import {
 instantiate, js, Node, Prefab, UIOpacity, UITransform,
} from 'cc';
import { Executor } from '../common/Executor';
import { ResManager } from '../common/ResManager';
import AutoResolution from '../utils/AutoResolution';
import UtilsCC from '../utils/UtilsCC';
import { BaseView } from './base/BaseView';
import { PanelTitle } from './base/PanelTitle';
import { Win } from './base/Win';
import { PAGE_NAME, UIInfo, UIType } from './UIConfig';
import UIManager from './UIManager';

// interface WinParams {
//     UIInfo?: UIInfo,
//     PageName?: PAGE_NAME,
//     args?: Record<string, unknown>;
// }

/** 状态 */
export enum Status {
    /** 空闲中 */
    Idle,
    /** 加载中 */
    Loading,
    /** 显示中 */
    Show,
}

export class UIWin {
    private _status: Status = Status.Idle;
    private UIInfo: UIInfo = undefined;
    private PageName: PAGE_NAME = undefined;
    private Args: Record<string, unknown> = js.createMap(true);
    private Win: Node = undefined;
    private UIManager: UIManager = undefined;
    public constructor(UIInfo: UIInfo, uimanager: UIManager) {
        this.UIManager = uimanager;
        this.UIInfo = UIInfo;
    }

    public get Status(): Status {
        return this._status;
    }

    /** 重新显示 */
    public show(pageName: PAGE_NAME, args: Record<string, unknown>): void {
        this.PageName = pageName;
        this.Args = args;
        this.startLoad();
    }

    /** 开始加载 */
    private startLoad() {
        this._status = Status.Loading;
        if (this.isOneWin()) {
            this.loadOneWin();
        } else {
            this.loadMulitWin();
        }
    }

    /** 加载单窗口 */
    private loadOneWin() {
        const uiInfo = this.UIInfo;
        if (uiInfo.bundle) {
            ResManager.I.loadFromBundle(uiInfo.bundle, uiInfo.path, Prefab, this.loadPrefabResult, this);
        } else {
            ResManager.I.load(uiInfo.path, Prefab, this.loadPrefabResult, this);
        }
    }

    /** 加载多窗口 */
    private loadMulitWin() {
        if (this.UIInfo.path) {
            // 使用自定义主窗口？
            this.loadOneWin();
        } else {
            this.createCommonWin();
        }
    }

    /**
     * 加载prefab结果，失败or成功
     * @param err 错误码
     * @param p prefab
     * @param params WinParams
     */
    private loadPrefabResult(err: Error | null, p: Prefab) {
        if (err) {
            this.loadPrefabFail(err, p);
        } else {
            this.loadPrefabSuccess(p);
        }
    }

    private loadPrefabFail(err: Error | null, p: Prefab) {
        // 加载失败
        console.log('加载prefab失败=', err);
    }

    /** 加载prefab成功 */
    private loadPrefabSuccess(p: Prefab) {
        let n: Node;
        switch (this.Status) {
            case Status.Loading:
                n = instantiate(p);
                n.attr({
                    _args: this.Args,
                    _uiInfo: this.UIInfo,
                });
                this.loadUIHandler(n);
                break;
            case Status.Show:
                break;
            case Status.Idle:
                p.destroy();
                break;
            default:
                break;
        }
        return undefined;
    }

    /** 加载ui显示分发处理 */
    private loadUIHandler(n: Node) {
        this._status = Status.Show;
        switch (this.UIInfo.uiType) {
            case UIType.Win:
                this.createCommonWin(n);
                break;
            default:
                this.addTo(n);
                break;
        }
    }

    /**
     * 创建通用窗口
     * @param params 窗口参数列表
     * @param UIWin ui窗口
     */
    private createCommonWin(UIWin?: Node) {
        const uiInfo = this.UIInfo;
        // this.waitActive(UIWin);
        // this.loadStart();
        console.time('createCommonWin111');
        ResManager.I.showPrefab(undefined, 'prefabs/ui/base/Win', undefined, (err, win: Node) => {
            console.timeEnd('createCommonWin111');
            console.time('createCommonWin222');
            const name = this.UIInfo.name;
            const scriptWin = win.getComponent(Win);
            win.name = `${name}Win`;
            win.attr({
                _args: this.Args,
                _uiInfo: uiInfo,
            });
            // this.waitActive(win);
            this.mergeUIWin(UIWin, win);
            this.mergeTitle(win);
            this.mergeBottom(win);
            this.setWinBgEnable(win);
            this.addTo(win);
            const hideTips = uiInfo.hideTips === undefined ? uiInfo.uiType === UIType.Win : uiInfo.hideTips;
            scriptWin.setBtnHelpActive(uiInfo.helpId > 0);
            scriptWin.setBtnCloseActive(uiInfo.hideClose !== true);
            scriptWin.setCloseTipsActive(!hideTips);
            // this.loadEnd();
        }, this);
    }

    private WaitNodes: Node[] = [];
    private waitActive(n: Node) {
        if (n) {
            // n.active = false;
            this.WaitNodes.push(n);
        }
    }

    private LoadCount = 0;
    private loadStart() {
        this.LoadCount++;
    }

    private loadEnd() {
        this.LoadCount--;
        if (!this.LoadCount) {
            this.active();
        }
    }

    private active() {
        this.WaitNodes.forEach((n) => {
            n.active = true;
        });
        this.WaitNodes.length = 0;
    }

    /** 合并标题，组装成一个页面 */
    private mergeTitle(win: Node) {
        const Frame = win.getChildByName('Frame');
        const uiType = this.UIInfo.uiType;
        // this.loadStart();
        // 窗口标题
        // UIManager.I.showPrefab(Frame, 'prefabs/ui/base/WinTitle', undefined, (err, title) => {
        const title = Frame.getChildByName('WinTitle');
        const pTitle = Frame.getChildByName('PanelTitle');
        if (!uiType) {
            UtilsCC.setString('Node/LbTitle', title, this.UIInfo.title);
            // title.setSiblingIndex(0);
            title.active = true;
            pTitle.destroy();
        } else {
            const scriptPaneltitle = pTitle.getComponent(PanelTitle);
            scriptPaneltitle.setString(this.UIInfo.title);
            pTitle.active = true;
            title.destroy();
        }
        // this.loadEnd();

        // pTitle.destroy();
        // });
        // } else {
        //     // 面板标题
        //     // UIManager.I.showPrefab(Frame, 'prefabs/ui/base/PanelTitle', undefined, (err, title) => {
        //         const scriptPaneltitle: any = title.getComponent('PanelTitle');
        //         scriptPaneltitle.setString(this.UIInfo.title);
        //         title.setSiblingIndex(0);
        //         this.loadEnd();
        //     });
        // }
    }

    /** 合并页签栏，组装成一个页面 */
    private mergeBottom(win: Node) {
        if (!this.UIInfo.uiType) {
            const Frame = win.getChildByName('Frame');
            const scriptWin = win.getComponent(Win);
            // 页签按钮列表
            if (this.UIInfo.pages && this.UIInfo.pages.length) {
                // this.loadStart();
                // UIManager.I.showPrefab(Frame, 'prefabs/ui/base/Bottom', undefined, (err, bottom) => {

                console.timeEnd('createCommonWin222');
                console.time('createCommonWin333');
                scriptWin.showMenus();
                console.timeEnd('createCommonWin333');
                // this.loadEnd();
                // });
                Frame.getChildByName('Bottom').active = true;
            }
        } else {
            const Frame = win.getChildByName('Frame');
            Frame.getChildByName('Bottom').destroy();
        }
    }

    /** 合并uiwin，组装成一个页面 */
    private mergeUIWin(UIWin: Node, win: Node) {
        if (UIWin) {
            UIWin.attr({
                _args: this.Args,
            });
            const Frame = win.getChildByName('Frame');
            const node = Frame.getChildByName('Pages');
            const scriptBase = UIWin.getComponent(BaseView);
            if (scriptBase) {
                const scriptWin = win.getComponent(Win);
                scriptWin.setCloseCallback(new Executor(scriptBase.onCloseClicked, scriptBase));
            }
            node.addChild(UIWin);
            if (this.UIInfo.size) {
                Frame.getComponent(UITransform).setContentSize(this.UIInfo.size);
            }
        }
    }

    /** 遮罩背景 */
    private setWinBgEnable(win: Node) {
        if (!this.UIInfo.uiType) {
            if (!this.UIInfo.size || (this.UIInfo.size.width === AutoResolution.rootWidth && this.UIInfo.size.height === AutoResolution.rootHeight)) {
                if (!this.UIInfo.hideBack) {
                    const bg = win.getChildByName('Bg');
                    const loadTexture = bg.getComponent('LoadTexture');
                    loadTexture.enabled = true;
                    bg.getComponent(UIOpacity).opacity = 255;
                }
            }
        }
    }

    private addTo(node: Node) {
        this.UIManager.addTo(node, this.UIInfo.uiType);
        this.Win = node;
    }

    /** 是否单独窗口 */
    private isOneWin() {
        const uiInfo = this.UIInfo;
        if (!uiInfo || !uiInfo.pages || !uiInfo.pages.length) {
            return true;
        }
        return false;
    }

    public close(): void {
        if (this.Win) {
            this._status = Status.Idle;
            this.Win.destroyAllChildren();
            this.Win.destroy();
            this.Win = undefined;
        }
    }
}
