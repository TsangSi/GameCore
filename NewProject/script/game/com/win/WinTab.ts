/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: hrd
 * @Date: 2022-05-27 17:05:55
 * @FilePath: \SanGuo2.4\assets\script\game\com\win\WinTab.ts
 * @Description: 带标签的弹窗类
 *
 */
import { EMarkType, IWinTabData } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { UtilGame } from '../../base/utils/UtilGame';
import { WinTabPage } from './WinTabPage';
import WinBase from './WinBase';
import { DynamicImage } from '../../base/components/DynamicImage';
import UtilRedDot from '../../base/utils/UtilRedDot';
import { ViewConst } from '../../const/ViewConst';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { GuideMgr } from '../guide/GuideMgr';
import { ConfigTabPictureIndexer } from '../../base/config/indexer/ConfigTabPictureIndexer';
import { Config } from '../../base/config/Config';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import UtilNewMark from '../../base/utils/UtilNewMark';
import { NewMark } from '../../module/newMark/NewMark';

const { ccclass, property } = cc._decorator;

interface IPageData {
    /** 页签面版节点 */
    view: cc.Node;
    /** 页签面版引用计数 */
    usCount: number;
}
/** 远端标题/页签路径 */
enum RemoteTabTitlePath {
    /** 固定后缀 */
    Suffix = '@ML',
    /** 页签按钮 */
    TabBtnPath = 'texture/com/winTabBtn/',
    /** 页签按钮前缀 */
    TabBtnPrefix = 'WinBtn_',
    /** 页签按钮激活后缀 */
    TabBtnOnSuffix = '_01',
    /** 页签按钮未激活后缀 */
    TabBtnOffSuffix = '_02',
    /** 页签标题 */
    TabTitlePath = 'texture/com/winTabTitle/',
    /** 页签标题前缀 */
    TabTitlePrefix = 'WinTitle_',
}
/** 页签数据类型  */
enum TabType {
    TabTitle = 0,
    TabBtn = 1
}

@ccclass
export class WinTab extends WinBase {
    // 标题文本
    // @property(cc.Label)
    // private LabTitle: cc.Label = null;
    // 标题图片
    @property(DynamicImage)
    private SprTitleImg: DynamicImage = null;
    // 下方关闭按钮
    @property(cc.Node)
    private BtnBack: cc.Node = null;
    // 页签按钮容器
    @property(cc.Node)
    private BtnContent: cc.Node = null;
    @property(cc.Node)
    private BtnDesc: cc.Node = null;

    @property(cc.Node)
    private NdScroll: cc.Node = null;
    @property(cc.Node)
    private BdBottom: cc.Node = null;

    private BtnTab: cc.Node = null;
    /** 页签数据 */
    private _tabDataMap: Map<number, IWinTabData> = new Map();
    /** 页签id索引数组 */
    private _tabIdArr: number[] = [];
    /** 页签按钮数组 */
    private btnArray: Array<cc.Node> = [];
    /** 页签面版数据 */
    private tabPageInfo: { [tabName: string]: IPageData; } = {};
    /** 页签id对应页签下标 索引 */
    private _tabIdMap: { [id: number]: number; } = {};
    /** 缓存页签id列表 */
    private _oldTabIdArray: Array<number> = [];
    /** 大面板对应id */
    private winId: number = 0;
    /** 是否打开红点页签 */
    public isOpenRedPage: boolean = false;
    /** 选中的页签页签Id */
    private currTabId: number = -1;
    /** 回调上下文 */
    private _context: unknown;
    /** 判断按钮是否可以点击 */
    private btnClickFunc: (tabIndex: number, tabId: number) => boolean = null;
    /** 点击按钮回调  */
    private changeTabFunc: (tabIndex: number, tabId: number) => void = null;
    /** 描述功能 有可能是从二级界面传递出来的 */
    private _descId: number = 0;
    /** 页签图标表 */
    private _tabPicCfg: ConfigTabPictureIndexer = null;

    protected start(): void {
        super.start();

        this.scheduleOnce(() => {
            const design = cc.find('Canvas').getComponent(cc.Canvas).designResolution;
            const real = cc.view.getFrameSize();
            const contect = this.NdScroll.getComponent(cc.ScrollView).content;
            if ((real.width / real.height) > (design.width / design.height)) {
                contect.getComponent(cc.Layout).paddingRight = 125;
            } else {
                contect.getComponent(cc.Layout).paddingRight = 255;
            }
            // this.NdScroll.width = this.BdBottom.width - 110;
            this.NdScroll.getChildByName('view').getComponent(cc.Widget)?.updateAlignment();
        }, 0);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    /**  */
    public open(...param: unknown[]): void {
        super.open.apply(this, param);
    }

    public init(...param: unknown[]): void {
        // todo
        const data: unknown = param;
        let tabId: number = 0;
        if (data) {
            tabId = data[0] || 0;
        }
        const tabData = this.viewVo.tabData;
        this._tabPicCfg = Config.Get(Config.Type.Cfg_TabPicture);
        UtilGame.Click(this.BtnBack, () => {
            this.closeSelf();
        }, this);

        UtilGame.Click(this.BtnDesc, () => {
            // const data = this._tabDataMap.get(this.currTabId);
            WinMgr.I.open(ViewConst.DescWinTip, this._descId);
        }, this);

        this._loadWinTabBtn(() => {
            this.setData(tabData, this.viewVo.id, tabId, this.isOpenRedPage);
            this.updateUI();
            this.onTab(this.currTabId, true, param);
            this.changeTab(this._tabIdMap[this.currTabId], this.currTabId);
        });
    }

    /** 刷新 */
    public reTabWin(...param: unknown[]): void {
        const data: unknown = param;
        let tabId: number = 0;
        if (data) {
            tabId = data[0] || 0;
        }
        this.currTabId = tabId;
        if (!this._tabDataMap.get(tabId)) {
            this.currTabId = this._tabIdArr[0];
        }

        this.onTab(tabId, true, param);
        this.changeTab(this._tabIdMap[tabId], tabId);
    }

    private _loadWinTabBtn(callBack: () => void) {
        ResMgr.I.showPrefab(UI_PATH_ENUM.WinTabBtn, null, (err: any, node: cc.Node) => {
            if (err) {
                //
            } else {
                if (!this.BtnTab) {
                    this.BtnTab = node;
                }
                if (callBack) {
                    callBack();
                }
            }
        });
    }

    /**
     * 设置页面上的数据
     * @param data
     * @param winId
     * @param tab
     */
    private setData(data: Array<IWinTabData>, winId: number, tabId: number = 0, isOpenRedPage: boolean = false): void {
        // this.tabData = data;
        this._tabIdArr = [];
        this._tabDataMap.clear();
        this._tabIdMap = {};
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            this._tabDataMap.set(item.TabId, item);
            this._tabIdMap[item.TabId] = i;
            this._tabIdArr.push(item.TabId);
        }
        this.winId = winId;
        this.isOpenRedPage = isOpenRedPage;
        this.currTabId = tabId;
        if (!this._tabDataMap.get(tabId) && data[0]) {
            this.currTabId = data[0].TabId;
        }
    }

    /** 手动设置desc按钮 */
    public updateDesc(descId: number, show: boolean = true): void {
        this.BtnDesc.active = show;
        this._descId = descId;
    }

    /**
    * 刷新页签和界面
    */
    public updateUI(): void {
        // if (!this.BtnTab) {
        //     this._loadWinTabBtn(() => {
        //         this.updateUI();
        //     });
        //     return;
        // }
        // 删除数据中不存在的节点
        for (let i = 0; i < this._oldTabIdArray.length; i++) {
            const id = this._oldTabIdArray[i];
            const info = this._tabDataMap.get(id);
            // 如果不包含，就删除页签
            let own = false;
            if (!info) {
                own = true;
                // break;
            }
            if (!own) {
                this.remTab(id);
            }
        }

        this._oldTabIdArray = [];
        for (let i = 0; i < this._tabIdArr.length; i++) {
            const tId = this._tabIdArr[i];
            const info = this._tabDataMap.get(tId);
            // const index = this._tabIdMap[info.TabId]; // 这个功能的下标
            const index = this._oldTabIdArray.indexOf(tId);
            if (index >= 0) { // 如果存在，就不再重新生成
                continue;
            }
            const tabBtn = cc.instantiate(this.BtnTab);
            this.BtnContent.addChild(tabBtn);

            this.btnArray.push(tabBtn);
            tabBtn.active = true;
            this.refreshRed(info.redId, tabBtn);
            this.reWinBtnState(tId, this.currTabId);
            // 缓存页签id数组
            this._oldTabIdArray.push(tId);

            tabBtn.targetOff(this);
            UtilGame.Click(tabBtn, () => {
                this.onTab(tId, false);
                this.changeTab(this._tabIdMap[tId], tId);
            }, this);
            if (info.guideId) {
                this.scheduleOnce(() => {
                    GuideMgr.I.bindScript(info.guideId, tabBtn, this.BtnContent.parent.parent);
                }, 0.5);
            }
        }
        //
        const data = this._tabDataMap.get(this.currTabId);
        if (data) {
            this.checkClick();
        }

        this.scrollToTab(this._tabIdMap[this.currTabId]);
    }

    /** 这个接口暂时没有任何地方调用，看了下里面的写法有些地方也是不对的，慎用。 */
    public addTab(data: IWinTabData[]): void {
        // if (!this.BtnTab) {
        //     this._loadWinTabBtn(() => {
        //         this.addTab(data);
        //     });
        //     return;
        // }
        this.setData(data, this.winId, this.currTabId, this.isOpenRedPage);

        for (let i = 0; i < this._tabIdArr.length; i++) {
            const tabId = this._tabIdArr[i];
            const index = this._oldTabIdArray.indexOf(tabId); // 这个功能的下标
            if (index < 0) {
                const tab = cc.instantiate(this.BtnTab);
                this.BtnContent.addChild(tab);
                tab.setSiblingIndex(i + 1);// 因为还有个BtnTab节点 所以+1
                this.btnArray.splice(i, 0, tab);
                tab.active = true;
                this.refreshRed(i, tab);
            }
        }
        // 刷新两个列表中的内容
        this._oldTabIdArray.length = 0;
        for (let i = 0; i < this._tabIdArr.length; i++) {
            const tabId = this._tabIdArr[i];
            this._tabIdMap[tabId] = i;
            this._oldTabIdArray.push(tabId);
            const tabBtn = this.btnArray[i];

            if (tabBtn) {
                tabBtn.targetOff(this);
                UtilGame.Click(tabBtn, () => {
                    this.onTab(tabId);
                }, this);
            }
        }

        if (this._tabIdArr && this._tabIdArr.length > 0) {
            const idx = this._oldTabIdArray.indexOf(this.currTabId);
            if (idx < 0 || this.currTabId === -1) {
                // 当前活动结束则默认打开首页
                this.onTab(this._oldTabIdArray[0], true);
            } else {
                this.onTab(this.currTabId, true);
            }
        } else { // 所有子活动全部都关闭了，那就关闭当前界面
            this.closeSelf();
        }
    }

    /**
     * 根据tab的id跳转到对应的页签
     * @param tabId
     * @param force  是否强制点击（即使是当前页签也要刷新）
     */
    public onTabId(tabId: number, force: boolean = false): void {
        const tabIndex = this._tabIdMap[tabId];
        if (tabIndex === undefined) {
            return;
        }
        this.onTab(tabIndex, force);
    }
    /** 根据页签数据获取对应的图片表id */
    private getTabInfo(data: IWinTabData): number {
        let _id: number = null;
        if (data.TabBtnId) {
            _id = data.TabBtnId;
        } else if (data.funcId) {
            const ccf: Cfg_Client_Func = UtilFunOpen.getFuncCfg(data.funcId);
            if (ccf) {
                _id = ccf.TabId;
            }
        }
        if (!_id) {
            _id = 1;
            console.error(data.className, '模块未配置按钮与标题 funcid = ', data.funcId);
        }
        return _id;
    }
    /** 获取标题/页签按钮的前缀路径 */
    private getTabSuffixPath(data: IWinTabData, _type: TabType): string {
        let _path = '';
        const _picId = this.getTabInfo(data);
        if (_picId) {
            const _picInfo: { picName: string, titName: string } = this._tabPicCfg.getPicInfo(_picId);
            if (_picInfo) {
                if (_type === TabType.TabTitle) {
                    _path = `${RemoteTabTitlePath.TabTitlePath}${RemoteTabTitlePath.TabTitlePrefix}${_picInfo.titName}`;
                } else if (_type === TabType.TabBtn) {
                    _path = `${RemoteTabTitlePath.TabBtnPath}${RemoteTabTitlePath.TabBtnPrefix}${_picInfo.picName}`;
                }
            }
        } else if (data.ActBtnName) {
            const _pp = _type === TabType.TabTitle ? RemoteTabTitlePath.TabTitlePath : RemoteTabTitlePath.TabBtnPath;
            const _tt = _type === TabType.TabTitle ? RemoteTabTitlePath.TabTitlePrefix : RemoteTabTitlePath.TabBtnPrefix;
            _path = `${_pp}${_tt}${data.ActBtnName}`;
        }

        return _path;
    }
    /**
     * 点击页签的响应
     * @param index  点击的页签下标
     * @param force  是否强制点击（即使是当前页签也要刷新）
     */
    public onTab(tabId: number, force: boolean = false, param: unknown = null): void {
        if (!force && tabId === this.currTabId) {
            return;
        }
        if (!this.checkBtnClick(this._tabIdMap[tabId], tabId)) {
            return;
        }
        const data = this._tabDataMap.get(tabId);
        if (!data) return;

        this.BtnDesc.active = !!data.descId;
        if (this.BtnDesc.active) {
            this._descId = data.descId;
        }

        this.currTabId = tabId;
        const _pathTitle: string = this.getTabSuffixPath(data, TabType.TabTitle);
        // 设置标题
        if (_pathTitle) {
            this.SprTitleImg.loadImage(`${_pathTitle}${RemoteTabTitlePath.Suffix}`, 1, true);
        }
        // this.LabTitle.string = data.title;
        // this.LabTitle.node.active = !data.titleImg;
        // const isShowBtnTitle = !!data.funcId || !!data.TabBtnId;
        // this.SprTitleImg.node.active = isShowBtnTitle;
        // if (isShowBtnTitle) {
        //     this.SprTitleImg.loadImage(data.titleImg, 1, true);
        // }

        // 设置内容 状态
        const promise = this.showTabView(data, this.NdContent, tabId, param);
        promise.then(
            () => {
                this.rePageActive(data.className, tabId);
            },
            (err) => {
                console.log('err: 页签加载失败', tabId, data.className, err);
            },
        );

        // 设置标签状态
        for (let i = 0; i < this._tabIdArr.length; i++) {
            this.reWinBtnState(this._tabIdArr[i], tabId);
        }

        this.scrollToTab(this._tabIdMap[this.currTabId], force);
        // 检测是否是打开了该功能页签（‘新’标签）
        this.checkClick();
    }

    /** 检查是否有‘新’标签 */
    private checkNewMark(parent: cc.Node, info: IWinTabData) {
        UtilNewMark.Bind(info.funcId, parent, cc.v2(40, 40));
        const newMark = parent.getComponent(NewMark);
        if (newMark) {
            newMark.onFuncNew();
        }
    }

    private checkClick() {
        const idx = this._tabIdMap[this.currTabId];
        const tab = this.btnArray[idx];
        if (!tab) return;
        // 标签
        if (tab.getChildByName('NewMark')) {
            const newMark = tab.getComponent(NewMark);
            if (newMark) {
                const data = this._tabDataMap.get(this.currTabId);
                if (data) {
                    UtilFunOpen.CheckClick(data.funcId);
                }
            }
        }
    }

    /**
     *  刷新按钮状态
     * @param idx
     * @param currTabId
     */
    private reWinBtnState(tId: number, currTabId: number) {
        const idx = this._tabIdMap[tId];
        const tab = this.btnArray[idx];
        if (!tab) return;
        const element: IWinTabData = this._tabDataMap.get(tId);
        // 标签
        const SprMark = tab.getChildByName('SprMark');
        const SprSelect = tab.getChildByName('SprSelect');
        const SprUnselect = tab.getChildByName('SprUnselect');
        const SprSelectIcon = SprSelect.getChildByName('SprIcon').getComponent(DynamicImage);
        const SprUnselectIcon = SprUnselect.getChildByName('SprIcon').getComponent(DynamicImage);
        const _pathTitle: string = this.getTabSuffixPath(element, TabType.TabBtn);
        if (_pathTitle) {
            const unselectUrl = `${_pathTitle}${RemoteTabTitlePath.TabBtnOffSuffix}${RemoteTabTitlePath.Suffix}`;
            const selectUrl = `${_pathTitle}${RemoteTabTitlePath.TabBtnOnSuffix}${RemoteTabTitlePath.Suffix}`;
            SprUnselectIcon.loadImage(unselectUrl, 1, true);
            SprSelectIcon.loadImage(selectUrl, 1, true);
        }
        // LabTitle.string = element.title;
        SprSelect.active = currTabId === tId; // 选中
        SprUnselect.active = currTabId !== tId; // 未选中
        // 标签(双倍...)
        this.addMark(SprMark, element.markType);
        // 检查是否有‘新’的标签图
        this.checkNewMark(tab, element);
    }

    private addMark(parent: cc.Node, type: number): void {
        const imgMark = parent.getChildByName('itemMark');
        if (type && type === EMarkType.Double) {
            const markSrc = 'texture/com/font/com_font_sb@ML';

            if (!imgMark) {
                const node = UtilCocos.NewNode(parent, [cc.Sprite]);
                node.name = 'itemMark';
                node.setPosition(-33, 33, 0);
                node.active = true;
                const sp = node.getComponent(cc.Sprite);
                sp.sizeMode = cc.Sprite.SizeMode.RAW;
                sp.type = cc.Sprite.Type.SIMPLE;

                UtilCocos.LoadSpriteFrame(sp, markSrc);
            } else {
                imgMark.active = true;
                UtilCocos.LoadSpriteFrame(imgMark.getComponent(cc.Sprite), markSrc);
            }
        } else if (imgMark) {
            imgMark.active = false;
        }
    }

    public setMark(tabIndex: number, type: EMarkType): void {
        const tab = this.btnArray[tabIndex];
        if (tab) {
            const SprMark = tab.getChildByName('SprMark');
            this.addMark(SprMark, type);
        }
    }

    private rePageActive(className: string, tId: number) {
        if (tId !== this.currTabId) {
            const info = this.tabPageInfo[className];
            if (info.view) {
                info.view.active = false;
            }
            return;
        }
        for (const key in this.tabPageInfo) {
            if (Object.prototype.hasOwnProperty.call(this.tabPageInfo, key)) {
                const info = this.tabPageInfo[key];
                if (info.view) {
                    info.view.active = info.view.name === className;
                }
            }
        }
    }

    // 滚动页签让其居中
    private scrollToTab(tabIndex: number = 0, force: boolean = false) {
        const layout = this.BtnContent;
        const layoutScript = layout.getComponent(cc.Layout);
        const tabWidth = layout.children[0] ? layout.children[0].width + layoutScript.spacingX : 119;// 116 +间距（3）
        // 500 - 3 - (index+2) * itemWidth
        const index = Math.floor((layout.parent.width - layoutScript.paddingLeft - layoutScript.paddingRight) / tabWidth);
        let layoutX = 0;
        if (tabIndex >= index) {
            layoutX = (layout.parent.width - layoutScript.paddingLeft - layoutScript.paddingRight) - (tabIndex + 2) * tabWidth; // 计算要显示的位置
            layoutX = layoutX > 0 ? 0 : tabIndex === this._tabIdArr.length - 1 ? layoutX + tabWidth : layoutX + 30; // 如果>0 代表已经显示出来了，不必滚动
        }
        const layoutY = layout.getPosition().y;
        if (force) {
            // layout.x = layoutX;
            layout.setPosition(cc.v2(layoutX, layoutY));
        } else {
            const a1 = cc.moveTo(0.1, layoutX, 0);
            layout.runAction(a1);
        }
    }

    /**
     * 根据tabId来删除页签
     * @param tabId
     */
    public remTab(tabId: number, _showTab: number = 0): void {
        const tab = this._tabIdMap[tabId];
        if (this.btnArray[tab] && this.btnArray.length === 1) { // 如果要关闭的是当前窗口，并且当前是最后一个窗口，直接把界面干掉
            this.closeSelf();
        }
        if (tab !== undefined) {
            // 删除页签内容面板
            // const data = this.tabData[tab];
            const data = this._tabDataMap.get(tabId);
            if (this.tabPageInfo[data.className]) {
                const info = this.tabPageInfo[data.className];
                info.usCount--;
                if (info.usCount <= 0) {
                    info.view.destroy();
                    delete this.tabPageInfo[data.className];
                }
            }
            // 删除页签按钮
            if (this.btnArray[tab]) {
                this.btnArray[tab].destroy();
                this.btnArray.splice(tab, 1);
            }
            // 删除页签数据
            // if (this.tabData[tab]) {
            //     this.tabData.splice(tab, 1);
            // }
            this._tabDataMap.delete(tabId);
            this._tabIdArr.splice(tabId, 1);

            // 删除map中的内容
            delete this._tabIdMap[tabId];

            // 刷新两个列表中的内容
            this._oldTabIdArray.length = 0;
            for (let i = 0; i < this._tabIdArr.length; i++) {
                const tabId = this._tabIdArr[i];
                this._tabIdMap[tabId] = i;

                this._oldTabIdArray.push(tabId);

                const tabBtn = this.btnArray[i];
                if (tabBtn) {
                    tabBtn.targetOff(this);
                    UtilGame.Click(tabBtn, () => {
                        this.onTab(tabId);
                    }, this);
                }
            }
        }
    }

    private closeSelf() {
        WinMgr.I.closeView(this);
    }

    /**
     * s增加红点
     */
    private refreshRed(rid: number, tab: cc.Node) {
        if (rid) {
            // UtilRedDot.Bind(rid, tab, v3(38, 20, 0));
            UtilRedDot.Bind(rid, tab, cc.v2(38, 38));
        } else {
            UtilRedDot.Unbind(tab);
        }
    }
    /**
     * 删除红点
     */
    private remRed(_rid: number) {
        //
    }
    private showTabView(data: IWinTabData, parentNode: cc.Node, tabId: number, param?: unknown): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const p = this._showTabView(data, parentNode, tabId, param);
        return p;
    }

    private async _showTabView(data: IWinTabData, parentNode: cc.Node, tabId: number, param?: unknown) {
        const prefabPath = data.prefabPath;
        const className = data.className;
        let node = parentNode.getChildByName(className);
        if (node) {
            const cmp1 = node.getComponent(className) as WinTabPage;
            // cmp1.init(this.winId, param, tabIdx);
            cmp1.refreshPage(this.winId, param, this._tabIdMap[tabId], tabId);
            if (!data._isInit) {
                const info = this.tabPageInfo[className];
                info.usCount += 1;
                this.tabPageInfo[className] = info;
                data._isInit = true;
            }
        } else {
            node = await ResMgr.I.showPrefabAsync(prefabPath, parentNode);
            if (!node) return;
            node.name = className;
            const cmp2 = node.getComponent(className) as WinTabPage;
            cmp2._init(this.winId, param, this._tabIdMap[tabId], tabId);
            // this._tabPageArray.push(node);
            this.tabPageInfo[className] = { view: node, usCount: 1 };
            data._isInit = true;

            // 此处处理了funcid的传递
            if (data.funcId && data.funcId > 0) {
                cmp2.funcId = data.funcId;
            }
        }
    }

    public set context(v: unknown) {
        this._context = v;
    }
    public get context(): unknown {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._context;
    }

    /**
     * 判断按钮是否可以点击
     * @param tabIndex 页签id
     * @param tabId 页签id
     */
    private checkBtnClick(tabIndex: number, tabId: number): boolean {
        if (this.btnClickFunc) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.btnClickFunc.call(this.context, tabIndex, tabId);
        }
        return true;
    }

    public setBtnClickFunc(fucn: (index: number, tabId: number) => boolean): void {
        if (fucn) {
            this.btnClickFunc = fucn;
        }
    }

    /**
     * 点击按钮回调
     * @param tabId 页签索引
     *
     */
    private changeTab(tabIndex: number, tabId: number): void {
        if (this.changeTabFunc) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            this.changeTabFunc.call(this.context, tabIndex, tabId);
        }
    }

    public setChangeTabFunc(fucn: (index: number, tabId: number) => void): void {
        if (fucn) {
            this.changeTabFunc = fucn;
        }
    }

    /** 获取到页签数量 */
    public getTabDataNum(): number {
        return this._tabIdArr.length;
    }

    // public resetTitle(tit: string): void {
    //     if (this.LabTitle) {
    //         this.LabTitle.string = tit;
    //     }
    // }
}
