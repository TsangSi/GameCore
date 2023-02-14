import { Node, Sprite } from 'cc';
import { EventM } from '../common/EventManager';
import { ResManager } from '../common/ResManager';
import { BundleType } from '../global/GConst';
// import { Win } from './base/Win';
import {
 PAGE_NAME, UIConfig, UIType, UI_NAME,
} from './UIConfig';
import { Status, UIWin } from './UIWin';

// interface WinParams {
//     _ui_info: UIInfo,
//     _page_name?: PAGE_NAME,
//     _args?: Record<string, unknown>;
// }

export default class UIManager extends UIConfig {
    private static _I: UIManager = null;
    public static get I(): UIManager {
        if (this._I == null) {
            this._I = new UIManager();
            this._I.init();
        }
        return this._I;
    }

    /** ui根节点 */
    private uiRoot: Node = null;
    /** win窗口 */
    private uiWin: Node = null;
    /** 确认框 */
    private uiDialog: Node = null;
    /** 提示 */
    private uiTips: Node = null;

    /** 记录当前显示中的界面 */
    private curWins: { [name: string]: UIWin; } = {};
    /** 记录当前加载中的界面 */
    private curLoads: { [key: string]: number; } = {};

    private init() {
        EventM.I.on(EventM.Type.UI.Close, this.close, this);
    }

    /**
     * 显示ui
     * @param name ui名字
     * @param pageName 页签名字
     * @param args 扩展参数，this.node.attr(args)
     */
    public show(name: UI_NAME, pageName?: PAGE_NAME, args?: Record<string, unknown>): void {
        let status: Status = Status.Idle;
        let uiWin = this.curWins[name];
        if (uiWin) {
            status = uiWin.Status;
        } else {
            uiWin = this.curWins[name] = new UIWin(this.getUIInfo(name), UIManager.I);
        }
        switch (status) {
            case Status.Idle:
                uiWin.show(pageName, args);
                break;
            case Status.Loading:
                console.log('正在加载中');
                break;
            case Status.Show:
                console.log('已经显示中');
                break;
            default:
                break;
        }
    }

    /**
     * 关闭界面
     * @param name ui名字
     */
    public close(name: UI_NAME): void {
        if (!this.destroyUI(name)) {
            const path = this.getUIPath(name);
            console.log('fail close not show，ui_path=', path);
        }
        this.clearLoadingUI(name);
    }

    private destroyUI(name: string) {
        if (this.curWins[name]) {
            this.curWins[name].close();
            return true;
        }
        return false;
    }

    /**
     * 清除正在加载ui的标记
     */
    private clearLoadingUI(name: string) {
        if (this.curLoads[name]) {
            this.curLoads[name] = undefined;
        }
    }

    /**
     * 关闭所有界面
     */
    public closeAll(): void {
        for (const name in this.curWins) {
            this.destroyUI(name);
            this.clearLoadingUI(name);
        }
    }

    /**
     * 显示prefab
     * @param parent 父节点
     * @param path prefab路径
     * @param bundle bundle名字
     * @param callback 回调
     * @param target 回调上下文
     * @param args 扩展参数
     */
    public showPrefab(parent: Node, path: string, bundle?: BundleType, callback?: (err, node: Node) => void, target?: unknown, args?: unknown): void {
        ResManager.I.showPrefab(parent, path, bundle, callback, target, args);
    }

    public initUI(uiRoot: Node): void {
        this.uiDialog = uiRoot.getChildByName('Dialog');
        this.uiWin = uiRoot.getChildByName('Win');
        this.uiTips = uiRoot.getChildByName('Tips');
        this.uiRoot = uiRoot;
    }

    public addTo(node: Node, uiType: UIType): void {
        switch (uiType) {
            case UIType.Win:
                this.uiWin.addChild(node);
                break;
            case UIType.Tips:
                this.uiTips.addChild(node);
                break;
            case UIType.Dialog:
                this.uiDialog.addChild(node);
                break;
            default:
                this.uiWin.addChild(node);
                break;
        }
    }

    private getUIPath(name: UI_NAME) {
        const c = this.getUIInfo(name);
        return c ? c.path : 'undefined';
    }
}
