/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-13 11:00:41
 * @FilePath: \SanGuo2.4\assets\script\game\module\title\v\TitlePage.ts
 * @Description: 称号主界面
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { MenuBar } from '../../../base/components/menubar/MenuBar';
import { IMenuNameData } from '../../../base/components/menubar/MenuBarItem';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { ITitleCfg, TitleState } from '../TitleConst';
import { StarLabelComponent } from '../../../base/components/StarLabelComponent';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import { RoleMgr } from '../../role/RoleMgr';
import EntityBase from '../../../entity/EntityBase';
import { ConfigTitleLevelUpIndexer } from '../../../base/config/indexer/ConfigTitleLevelUpIndexer';
import { ConfigTitleIndexer } from '../../../base/config/indexer/ConfigTitleIndexer';
import { ShareToChat } from '../../../com/ShareToChat';
import { RoleAN } from '../../role/RoleAN';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { TickTimer } from '../../../base/components/TickTimer';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilItem from '../../../base/utils/UtilItem';
import { EAttrKey } from '../../../com/attr/AttrFvConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import { NdAttrBaseContainer } from '../../../com/attr/NdAttrBaseContainer';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ChatShowItemType } from '../../chat/ChatConst';
import { BagItemChangeInfo } from '../../bag/BagConst';
import { ItemType } from '../../../com/item/ItemConst';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { GuideMgr } from '../../../com/guide/GuideMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TitlePage extends WinTabPage {
    @property(MenuBar)
    private Menu: MenuBar = null;
    @property(cc.Toggle)
    private TogActive: cc.Toggle = null;
    @property(cc.Node)
    private NdAnim: cc.Node = null;
    @property(cc.Label)
    private LabTotal: cc.Label = null;
    @property(cc.Node)
    private NdShow: cc.Node = null;
    @property(cc.Node)
    private NdTotal: cc.Node = null;
    // 属性
    @property(cc.Label)
    private LabRare: cc.Label = null;
    @property(cc.Label)
    private LabFv: cc.Label = null;
    @property(DynamicImage)
    private SprQuality: DynamicImage = null;
    @property(cc.Node)
    private NdStar: cc.Node = null;
    @property(cc.Node)
    private NdAttr: cc.Node = null;
    // 获取途径
    @property(cc.Label)
    private LabGet: cc.Label = null;
    @property(cc.Node)
    private NdTime: cc.Node = null;
    @property({ type: TickTimer })
    public LabTime: TickTimer = null;
    // 按钮状态
    @property(cc.Node)
    private BtnFv: cc.Node = null;
    @property(cc.Node)
    private BtnShare: cc.Node = null;
    @property(cc.Node)
    private BtnWear: cc.Node = null;
    @property(cc.Node)
    private BtnOff: cc.Node = null;
    @property(cc.Node)
    private BtnActive: cc.Node = null;
    @property(cc.Node)
    private BtnUpStar: cc.Node = null;
    @property(cc.Node)
    private NdUpStarRed: cc.Node = null;
    @property(cc.Node)
    private NdUnActive: cc.Node = null;
    @property(cc.Label)
    private LabMax: cc.Label = null;

    /** 数据 */
    private _role: EntityBase = null;
    private _titleId: number = 0;
    private _titleData: TitleData = null;
    private _menuAllData: IMenuNameData[] = [];
    private _menuActiveData: IMenuNameData[] = [];
    // private _isCreateActiveData:boolean = false;
    private _autoFirstId: number = 0;
    private _autoSecondId: number = 0;
    private _preTitleId: number = 0;

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
        this.initUI();
        this.NdAnim.destroyAllChildren();
        this.NdAnim.removeAllChildren();
        this._role = EntityUiMgr.I.createAttrEntity(this.NdAnim, {
            isMainRole: true, isPlayUs: false, isShowTitle: true,
        });
        this._role.setTitleScale(1.3);
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
    }

    private addE() {
        EventClient.I.on(E.Title.UptTitle, this.uptUI, this);
        EventClient.I.on(E.AttrFv.UptAttrFv, this.uptFight, this);
        EventClient.I.on(E.Bag.ItemChange, this.onBagChange, this);
        RoleMgr.I.on(this.onoff, this, RoleAN.N.Title);
    }

    private remE() {
        EventClient.I.off(E.Title.UptTitle, this.uptUI, this);
        EventClient.I.off(E.AttrFv.UptAttrFv, this.uptFight, this);
        EventClient.I.off(E.Bag.ItemChange, this.onBagChange, this);
        RoleMgr.I.off(this.onoff, this, RoleAN.N.Title);
    }

    private clk() {
        UtilGame.Click(this.BtnFv, () => {
            this.openTips();
        }, this);

        UtilGame.Click(this.BtnShare, () => {
            const pos = this.BtnShare.convertToWorldSpaceAR(cc.v2(0, 100));
            ShareToChat.show(ChatShowItemType.title, this._titleId, pos);
        }, this);

        UtilGame.Click(this.TogActive.node, this.onTog, this);

        UtilGame.Click(this.BtnWear, () => {
            this._preTitleId = RoleMgr.I.d.Title;
            ControllerMgr.I.TitleController.reqC2STitleWear(this._titleId);
        }, this);

        UtilGame.Click(this.BtnOff, () => {
            this._preTitleId = RoleMgr.I.d.Title;
            ControllerMgr.I.TitleController.reqC2STitleOff(this._titleId);
        }, this);

        UtilGame.Click(this.BtnActive, () => {
            this._preTitleId = RoleMgr.I.d.Title;
            ControllerMgr.I.TitleController.reqC2STitleActive(this._titleId);
        }, this);

        UtilGame.Click(this.BtnUpStar, () => {
            if (ModelMgr.I.TitleModel.canUpStar(this._titleId, null, null)) {
                ControllerMgr.I.TitleController.reqC2STitleUpGrade(this._titleId);
            } else {
                const star = this._titleData.Star;
                const indexer: ConfigTitleLevelUpIndexer = Config.Get(Config.Type.Cfg_TitleLevelUp);
                const maxLevel = indexer.getMaxLevel();
                if (star >= maxLevel) {
                    MsgToastMgr.Show(i18n.tt(Lang.title_maxLevelTips));
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.title_tips));
                }
            }
        }, this);
    }

    private onBagChange(changes: BagItemChangeInfo[]) {
        let check: boolean = false;
        // const titleIds: number[] = [];
        if (changes) {
            for (let i = 0; i < changes.length; i++) {
                if (changes[i].itemModel && changes[i].itemModel.cfg
                    && changes[i].itemModel.cfg.Type === ItemType.SKIN && changes[i].itemModel.cfg.SubType === ItemType.SKIN_TITLE) {
                    check = true;
                    break;
                    // titleIds.push(changes[i].itemModel.cfg.Id);
                }
            }
        }
        if (check) {
            // console.log('称号-道具id发生变化', titleIds);
            this.uptUI(false, []);
        }
    }

    private openTips() {
        const attrData: FightAttrData[] = [];
        attrData.push(ModelMgr.I.AttrFvModel.getAttrData(EAttrKey.AttrKey_RoleTitleStarAttr));
        WinMgr.I.open(ViewConst.AttrTips, attrData);
    }

    private createActiveData() {
        // 多级菜单数据
        this._menuActiveData = [];
        const cfgTitle = Config.Get(Config.Type.Cfg_Title);
        const cfgTab = Config.Get(Config.Type.Cfg_TitleTab);
        const tList: TitleData[] = ModelMgr.I.TitleModel.titleList;
        for (let i = 0; i < tList.length; i++) {
            const t: Cfg_Title = cfgTitle.getValueByKey(tList[i].TitleId);
            const state: TitleState = ModelMgr.I.TitleModel.getTitleState(t.Id);
            const tCfg: ITitleCfg = {
                Id: t.Id,
                State: state,
                IsWeared: state === TitleState.Wear,
                IsActive: state === TitleState.Wear || state === TitleState.Active,
            };
            const sub: IMenuNameData = {
                name: t.Name,
                Id: t.Id,
                cfg: tCfg,
            };

            let isFind: boolean = false;
            for (let k = 0; k < this._menuActiveData.length; k++) {
                if (this._menuActiveData[k].Id === t.TabId1) {
                    isFind = true;
                    this._menuActiveData[k].datas.push(sub);
                    break;
                }
            }
            if (!isFind) {
                const subData: IMenuNameData[] = [];
                subData.push(sub);

                this._menuActiveData.push({
                    name: cfgTab.getValueByKey(t.TabId1, 'TabName'),
                    Id: t.TabId1,
                    datas: subData,
                });
            }
        }
        // this._isCreateActiveData = true;
        // 类型排序
        this._menuActiveData.sort((a, b) => Number(a.Id) - Number(b.Id));
    }

    private createAllData() {
        const titleIndexer: ConfigTitleIndexer = Config.Get(Config.Type.Cfg_Title);
        const cfgs: Cfg_Title[] = titleIndexer.getTitleDatas();
        const cfgTab = Config.Get(Config.Type.Cfg_TitleTab);
        const tabkeys = cfgTab.getKeys();

        this._menuAllData = [];

        for (let i = 0; i < tabkeys.length; i++) {
            for (let j = 0, len = cfgs.length; j < len; j++) {
                const c: Cfg_Title = cfgs[j];
                const t: Cfg_Title = titleIndexer.getValueByKey(c.Id);

                if (t.TabId1 !== tabkeys[i]) {
                    continue;
                }
                const state: TitleState = ModelMgr.I.TitleModel.getTitleState(t.Id);
                const tCfg: ITitleCfg = {
                    Id: t.Id,
                    State: state,
                    IsWeared: state === TitleState.Wear,
                    IsActive: state === TitleState.Wear || state === TitleState.Active,
                };
                const sub: IMenuNameData = {
                    name: t.Name,
                    Id: t.Id,
                    cfg: tCfg,
                };

                let isFind: boolean = false;
                for (let k = 0; k < this._menuAllData.length; k++) {
                    if (this._menuAllData[k].Id === t.TabId1) {
                        isFind = true;
                        this._menuAllData[k].datas.push(sub);
                        break;
                    }
                }
                if (!isFind) {
                    const subData: IMenuNameData[] = [];
                    subData.push(sub);

                    this._menuAllData.push({
                        name: cfgTab.getValueByKey(t.TabId1, 'TabName'),
                        Id: t.TabId1,
                        datas: subData,
                    });
                }
            }
        }
    }

    private refreshData(data: IMenuNameData[], change: number[]) {
        if (change && change.length > 0) {
            for (let k = 0; k < change.length; k++) {
                let find: boolean = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].datas && data[i].datas.length > 0) {
                        for (let j = 0; j < data[i].datas.length; j++) {
                            if (+data[i].datas[j].Id === change[k]) {
                                const state: TitleState = ModelMgr.I.TitleModel.getTitleState(change[k]);
                                const tCfg: ITitleCfg = data[i].datas[j].cfg = data[i].datas[j].cfg || cc.js.createMap(true);
                                tCfg.Id = change[k];
                                tCfg.State = state;
                                tCfg.IsWeared = state === TitleState.Wear;
                                tCfg.IsActive = state === TitleState.Wear || state === TitleState.Active;

                                find = true;
                                break;
                            }
                        }
                    }
                    if (find) {
                        break;
                    }
                }
            }
        }
    }

    /** 排序 可激活>可升星（需要是已激活或已佩戴的）>已佩戴>已激活>未激活 */
    private sortFunc(_list: IMenuNameData[]): IMenuNameData[] {
        const _canActive: IMenuNameData[] = [];// 可激活
        const _canUp: IMenuNameData[] = []; // 可升星
        const _wear: IMenuNameData[] = []; // 佩戴
        const _active: IMenuNameData[] = []; // 已激活
        const _unActive: IMenuNameData[] = []; // 未激活

        for (let i = 0, l = _list.length; i < l; i++) {
            const _tmp = _list[i];
            if (!_tmp || !_tmp.cfg) {
                continue;
            }
            const cfg = _tmp.cfg as ITitleCfg;

            if (cfg.State === TitleState.CanActive) {
                _canActive.push(_tmp);
                continue;
            }
            if (cfg.State === TitleState.Wear) {
                if (ModelMgr.I.TitleModel.canUpStar(Number(_tmp.Id), null, cfg.State)) {
                    _canUp.push(_tmp);
                } else {
                    _wear.push(_tmp);
                }
                continue;
            }
            if (cfg.State === TitleState.Active) {
                if (ModelMgr.I.TitleModel.canUpStar(Number(_tmp.Id), null, cfg.State)) {
                    _canUp.push(_tmp);
                } else {
                    _active.push(_tmp);
                }
                continue;
            }
            if (cfg.State === TitleState.UnActive) {
                _unActive.push(_tmp);
                continue;
            }
        }
        return [..._canActive, ..._canUp, ..._wear, ..._active, ..._unActive];
    }

    /* 按 可激活-可升级-已佩戴-已激活-未激活 排序 */
    private sort(data: IMenuNameData[]) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].datas && data[i].datas.length > 0) {
                data[i].datas = this.sortFunc(data[i].datas);
            }
        }
    }

    /**
     * 是否勾选：'仅显示已激活'
     * 由于勾选或取消勾选，不会改变列表的值，可以不用重新生成
     */
    private onTog() {
        const isShowActive = this.TogActive.isChecked;
        const tList: TitleData[] = ModelMgr.I.TitleModel.titleList;
        if (isShowActive) {
            if (!tList || tList.length <= 0) {
                MsgToastMgr.Show('暂无已激活称号');
                this.scheduleOnce(() => {
                    if (this.TogActive && this.TogActive.isValid) {
                        this.TogActive.isChecked = false;
                    }
                }, 1);
                return;
            }
        }

        let titleMenuList: IMenuNameData[] = [];
        // let isRecreate:boolean = false;
        if (isShowActive) {
            // if (!this._isCreateActiveData) {
            this.createActiveData();
            this.sort(this._menuActiveData);
            // isRecreate = true;
            // }
            titleMenuList = this._menuActiveData;
        } else {
            // if (!this._menuAllData || this._menuAllData.length === 0) {
            this.createAllData();
            this.sort(this._menuAllData);
            // isRecreate = true;
            // }
            titleMenuList = this._menuAllData;
        }

        // console.log('=======onTog======', titleMenuList);

        // 菜单列表
        // if (isRecreate) {
        this.Menu.setMenuData(titleMenuList, this.selectMenuItem, this, 1);
        // } else {
        //     this.Menu.uptMenuData(titleMenuList);
        // }

        // 默认选中
        this.select(titleMenuList);

        // 红点列表
        this.updateRed(titleMenuList);
    }

    /** 初始展示界面 */
    private initUI(): void {
        let titleMenuList: IMenuNameData[] = [];

        const isShowActive = this.TogActive.isChecked;

        if (isShowActive) {
            this.createActiveData();
            this.sort(this._menuActiveData);
            titleMenuList = this._menuActiveData;
        } else {
            this.createAllData();
            this.sort(this._menuAllData);
            titleMenuList = this._menuAllData;
        }

        // 菜单列表
        this.Menu.setMenuData(titleMenuList, this.selectMenuItem, this, 1);

        // 默认选中
        this.select(titleMenuList);

        // 红点列表
        this.updateRed(titleMenuList);

        // 可以不用调用
        // this.uptContent();

        this.uptFight();
    }

    private uptFight() {
        const fData = ModelMgr.I.AttrFvModel.getAttrData(EAttrKey.AttrKey_RoleTitleStarAttr);
        let fv: number = 0;
        if (fData) {
            fv = fData.Fv;
        }
        if (fv > 0) {
            this.NdTotal.active = true;
            this.LabTotal.string = `${fv}`;
        } else {
            this.NdTotal.active = false;
        }
    }

    /** 穿脱的刷新：只有2个称号的数据会有变化，可以减少计算和刷新的消耗 */
    private onoff() {
        // 刷新数据
        this._titleData = this.getTitleData(this._titleId);

        let titleMenuList: IMenuNameData[] = [];
        // 刷新数据
        const isShowActive = this.TogActive.isChecked;
        if (isShowActive) {
            this.refreshData(this._menuActiveData, [this._preTitleId, RoleMgr.I.d.Title]);
            titleMenuList = this._menuActiveData;
        } else {
            this.refreshData(this._menuAllData, [this._preTitleId, RoleMgr.I.d.Title]);
            titleMenuList = this._menuAllData;
        }

        // console.log(RoleMgr.I.d.Title, 'titleMenuList=', titleMenuList);

        // 刷新菜单列表
        this.Menu.uptMenuData(titleMenuList);

        // 默认选中不改变，但是MenuBar里的数据是会清掉的，所以这里需要调用下
        this.Menu.select(this._autoFirstId, this._autoSecondId);

        // 穿脱都不影响红点，这里不需要调用
        // this.updateRed(titleMenuList);
        // 刷新内容
        this.uptContent();
        // 穿脱不影响战力，这里不需要刷新
        this.uptFight();
    }

    /**
     * 更新界面只有勾选了‘仅显示已激活’，并且是有称号增删的情况才需要重新生成菜单数据，否则就只是刷新菜单数据
     */
    private uptUI(isAddOrDel: boolean, change: number[]): void {
        // 刷新数据
        this._titleData = this.getTitleData(this._titleId);

        let titleMenuList: IMenuNameData[] = [];
        // 暂都重新生成数据吧
        const isShowActive = this.TogActive.isChecked;
        if (isShowActive) {
            if (isAddOrDel) {
                this.createActiveData();
                // 都重新生成数据了，也加下排序吧
                this.sort(this._menuActiveData);
            } else {
                this.refreshData(this._menuActiveData, change);
            }

            titleMenuList = this._menuActiveData;
        } else {
            this.refreshData(this._menuAllData, change);
            titleMenuList = this._menuAllData;
        }

        // console.log(RoleMgr.I.d.Title, 'titleMenuList=', titleMenuList);

        // 刷新菜单列表
        if (isShowActive && isAddOrDel) {
            this.Menu.setMenuData(titleMenuList, this.selectMenuItem, this, 1);
            this.select(titleMenuList);
        } else {
            this.Menu.uptMenuData(titleMenuList);
            this.Menu.select(this._autoFirstId, this._autoSecondId);
        }

        // 刷新红点列表
        this.updateRed(titleMenuList);
        // 刷新内容
        this.uptContent();

        this.uptFight();
    }

    private updateRed(titleMenuList: IMenuNameData[]) {
        if (!titleMenuList) {
            return;
        }
        for (let i = 0; i < titleMenuList.length; i++) {
            for (let j = 0; j < titleMenuList[i].datas.length; j++) {
                const id = +titleMenuList[i].datas[j].Id;
                const state: TitleState = ModelMgr.I.TitleModel.getTitleState(id);

                let isRed: boolean = false;
                // 能激活
                if (state === TitleState.CanActive) {
                    isRed = true;
                } else if (state === TitleState.Active || state === TitleState.Wear) {
                    // 已激活就看能否升星
                    const isActive = ModelMgr.I.TitleModel.isActived(id);
                    if (isActive) {
                        const canUpStar = ModelMgr.I.TitleModel.canUpStar(id, null, null);
                        if (canUpStar) {
                            isRed = true;
                        }
                    }
                }
                // console.log(i, j, '一级', titleMenuList[i].Id, '二级', titleMenuList[i].datas[j].Id, '红点', isRed);
                this.Menu.updateRed(isRed, titleMenuList[i].Id, titleMenuList[i].datas[j].Id);
            }
        }
    }

    private select(titleMenuList: IMenuNameData[]) {
        if (!titleMenuList) {
            return;
        }
        let autoFirstId: number = 0;
        let autoSecondId: number = 0;
        let find: boolean = false;
        for (let i = 0; i < titleMenuList.length; i++) {
            autoFirstId = +titleMenuList[i].Id;
            if (titleMenuList[i].datas && titleMenuList[i].datas.length > 0) {
                for (let j = 0; j < titleMenuList[i].datas.length; j++) {
                    const id = +titleMenuList[i].datas[j].Id;
                    const state: TitleState = ModelMgr.I.TitleModel.getTitleState(id);
                    // 能激活
                    if (state === TitleState.CanActive) {
                        autoSecondId = id;
                        find = true;
                        break;
                    }
                }
            }

            if (find) {
                break;
            }
        }
        if (!find) {
            for (let i = 0; i < titleMenuList.length; i++) {
                autoFirstId = +titleMenuList[i].Id;
                if (titleMenuList[i].datas && titleMenuList[i].datas.length > 0) {
                    for (let j = 0; j < titleMenuList[i].datas.length; j++) {
                        const id = +titleMenuList[i].datas[j].Id;
                        const state: TitleState = ModelMgr.I.TitleModel.getTitleState(id);
                        // 能升星
                        if (ModelMgr.I.TitleModel.canUpStar(id, null, state)) {
                            autoSecondId = id;
                            find = true;
                            break;
                        }
                    }
                }
                if (find) {
                    break;
                }
            }
        }
        if (!find) {
            for (let i = 0; i < titleMenuList.length; i++) {
                autoFirstId = +titleMenuList[i].Id;
                if (titleMenuList[i].datas && titleMenuList[i].datas.length > 0) {
                    for (let j = 0; j < titleMenuList[i].datas.length; j++) {
                        // 是否佩戴中
                        const id = +titleMenuList[i].datas[j].Id;
                        if (ModelMgr.I.TitleModel.isWeared(id)) {
                            autoSecondId = id;
                            find = true;
                            break;
                        }
                    }
                }
                if (find) {
                    break;
                }
            }
        }
        if (!find) {
            for (let i = 0; i < titleMenuList.length; i++) {
                autoFirstId = +titleMenuList[i].Id;
                if (titleMenuList[i].datas && titleMenuList[i].datas.length > 0) {
                    for (let j = 0; j < titleMenuList[i].datas.length; j++) {
                        // 是否已激活
                        const id = +titleMenuList[i].datas[j].Id;
                        if (ModelMgr.I.TitleModel.isActived(id)) {
                            autoSecondId = id;
                            find = true;
                            break;
                        }
                    }
                }
                if (find) {
                    break;
                }
            }
        }
        // console.log('find=', find, 'autoFirstId=', autoFirstId, 'autoSecondId=', autoSecondId);
        this._autoFirstId = autoFirstId;
        this._autoSecondId = autoSecondId;
        if (find) {
            this.Menu.select(this._autoFirstId, this._autoSecondId);
        }
    }

    private selectMenuItem(cfg: ITitleCfg) {
        // console.log('selectMenuItem:', cfg);
        this._titleId = cfg.Id;
        this._titleData = this.getTitleData(cfg.Id);
        this.uptRoleTitle();
        this.uptContent();

        GuideMgr.I.clearCur();
    }

    private uptRoleTitle() {
        if (!this._role) {
            this.NdAnim.destroyAllChildren();
            this.NdAnim.removeAllChildren();
            this._role = EntityUiMgr.I.createAttrEntity(this.NdAnim, {
                isMainRole: true,
                isPlayUs: false,
                isShowTitle: true,
            });
        }
        this._role.setTitleAnim(this._titleId);
    }

    private getTitleData(titleId: number): TitleData {
        const titleList = ModelMgr.I.TitleModel.titleList;
        for (let i = 0; i < titleList.length; i++) {
            if (titleList[i].TitleId === titleId) {
                return titleList[i];
            }
        }
        return null;
    }

    private uptContent() {
        if (!this._titleId) return;

        const cfg: Cfg_Title = Config.Get(Config.Type.Cfg_Title).getValueByKey(this._titleId);

        // 稀有 策划让优先显示表里的数据
        let rate: number = 0;
        if (cfg.Rate) {
            rate = cfg.Rate;
        } else if (this._titleData && this._titleData.RateValue > 0) {
            rate = this._titleData.RateValue;
        }

        if (rate > 0) {
            rate = Math.round(rate / 100);
            if (rate < 1) rate = 1;
            if (rate > 100) rate = 100;

            this.LabRare.node.active = true;
            this.LabRare.string = UtilString.FormatArray(i18n.tt(Lang.title_detail_active), [rate]);
        } else {
            this.LabRare.node.active = false;
        }
        // 战力和品质
        let star = 0;
        if (this._titleData) {
            star = this._titleData.Star;
        }
        const fv = ModelMgr.I.TitleModel.calculateFv(this._titleId, star);

        this.LabFv.string = `${fv}`;
        this.SprQuality.loadImage(UtilItem.GetItemQualityFontImgPath(cfg.Quality, true), 1, true);
        // 星星
        if (cfg.IsLevelUp === 1) {
            this.NdStar.active = true;
            this.NdStar.getComponent(StarLabelComponent).updateStars(star);
        } else {
            this.NdStar.active = false;
        }

        // 属性
        const indexer: ConfigTitleLevelUpIndexer = Config.Get(Config.Type.Cfg_TitleLevelUp);
        const ratio = indexer.getTitleAttrRatio(star);
        const attr: IAttrBase[] = UtilAttr.GetAttrBaseListById(cfg.AttrId);
        const tAttr: IAttrBase[] = [];
        for (let i = 0; i < attr.length; i++) {
            const t: IAttrBase = {
                attrType: attr[i].attrType,
                value: Math.ceil(attr[i].value * ratio),
                name: attr[i].name,
            };
            tAttr.push(t);
        }
        this.NdAttr.getComponent(NdAttrBaseContainer).init(tAttr, null, { nameC: UtilColor.NorN });
        // 产出
        this.LabGet.string = cfg.FromDesc;
        this.NdTime.active = false;
        if (cfg.TimeType && cfg.TimeParam) {
            if (cfg.TimeType === 1) {
                // 持续xx秒
                if (this._titleData && this._titleData.EndTime) {
                    const left: number = this._titleData.EndTime - UtilTime.NowSec();
                    if (left > 0) {
                        this.NdTime.active = true;
                        this.showTime(left);
                    }
                }
            } else if (cfg.TimeType === 2) {
                // 关联活动表id
            }
        }
        // 已满级
        const maxLevel = indexer.getMaxLevel();
        const isMax = star >= maxLevel;
        this.LabMax.node.active = isMax;
        // 状态
        const state = ModelMgr.I.TitleModel.getTitleState(this._titleId);
        this.NdUnActive.active = state === TitleState.UnActive;
        this.BtnOff.active = state === TitleState.Wear;
        this.BtnWear.active = state === TitleState.Active;
        this.BtnActive.active = state === TitleState.CanActive;
        // 配置可升星并且（已激活或已佩戴）
        this.BtnUpStar.active = cfg.IsLevelUp === 1 && (state === TitleState.Active || state === TitleState.Wear) && !isMax;
        // 配置可升星并且（已激活或已佩戴）并且能升星就显示红点
        if (this.BtnUpStar.active) {
            const isRed = ModelMgr.I.TitleModel.canUpStar(this._titleId, star, state);
            this.NdUpStarRed.active = isRed;
        }

        this.BtnShare.active = state === TitleState.Active || state === TitleState.Wear;
    }

    /** 剩余时间 */
    private showTime(left: number) {
        this.LabTime.node.parent.active = true;
        this.onTick(left);
        this.LabTime.removeEndEventHandler(this.node, 'TitlePage', 'onTick');
        this.LabTime.addTickEventHandler(this.node, 'TitlePage', 'onTick');
    }

    private onTick(left: number): void {
        if (left > 86400) {
            this.LabTime.tick(left, '%dd天', false, false);
        } else if (left > 3600) {
            this.LabTime.tick(left, '%HH时', false, false);
        } else if (left > 0) {
            this.LabTime.tick(left, '%mm:%ss', true, true);
        } else {
            this.LabTime.node.parent.active = false;
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
