/*
 * @Author: hrd
 * @Date: 2022-03-29 21:10:03
 * @FilePath: \SanGuo\assets\script\game\base\main\LayerMgr.ts
 * @Description:
 *
 */
import { AppEvent } from '../../../app/AppEventConst';
import { EventClient } from '../../../app/base/event/EventClient';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import { E } from '../../const/EventName';
import { RES_ENUM } from '../../const/ResPath';
import { EffectMgr } from '../../manager/EffectMgr';

export class LayerMgr {
    private Root: cc.Node = null;
    /** 地图层 */
    private _MapLayer: cc.Node = null;
    /** 战斗层 */
    private _BattleLayer: cc.Node = null;
    /** 主城层 */
    private _MainCityLayer: cc.Node = null;
    /** 主界面层的下面一层 */
    private _DownLayer: cc.Node = null;
    /** 主界面层 */
    private _MainLayer: cc.Node = null;
    /** 默认UI弹出层 */
    private _DefaultLayer: cc.Node = null;
    /** 飘字层 */
    private _PopLayer: cc.Node = null;
    /** 提示窗层 */
    private _TipsLayer: cc.Node = null;
    /** 警告提示层 */
    private _WarnLayer: cc.Node = null;
    /** 点击特效层 需要保持在最上层 不要添加其他节点 */
    public _NdClickLayer: cc.Node = null;

    private _clickEffect: cc.Node = null;

    private static Instance: LayerMgr;
    public static get I(): LayerMgr {
        if (!this.Instance) {
            this.Instance = new LayerMgr();
            this.Instance.init();
        }
        return this.Instance;
    }

    private init(): void {
        EventClient.I.on(AppEvent.ViewAddToLayer, this.onAddToLayer, this);
        EventClient.I.on(AppEvent.WinBigAllClose, this.dealWinBigClose, this);
    }

    public get MapLayer(): cc.Node {
        return this._MapLayer;
    }
    public set MapLayer(nd: cc.Node) {
        this._MapLayer = nd;
    }
    public set BattleLayer(nd: cc.Node) {
        this._BattleLayer = nd;
    }
    public set MainCityLayer(nd: cc.Node) {
        this._MainCityLayer = nd;
    }
    public set DownLayer(nd: cc.Node) {
        this._DownLayer = nd;
    }
    public set MainLayer(nd: cc.Node) {
        this._MainLayer = nd;
    }
    public set DefaultLayer(nd: cc.Node) {
        this._DefaultLayer = nd;
    }
    public set PopLayer(nd: cc.Node) {
        this._PopLayer = nd;
    }

    public get TipsLayer(): cc.Node {
        return this._TipsLayer;
    }
    public set TipsLayer(nd: cc.Node) {
        this._TipsLayer = nd;
    }
    public set WarnLayer(nd: cc.Node) {
        this._WarnLayer = nd;
    }

    /** 刘海偏移高度 */
    private _notchHeight: number = 0;
    public set notchHeight(v: number) {
        if (this._notchHeight !== v) {
            this._notchHeight = v;
            EventClient.I.emit(E.UI.NotchHeightChange);
        }
    }
    public get notchHeight(): number {
        return this._notchHeight;
    }

    /** 底部偏移高度 */
    private _bottomHeight: number = 0;
    public set bottomHeight(v: number) {
        if (this._bottomHeight !== v) {
            this._bottomHeight = v;
            EventClient.I.emit(E.UI.NotchHeightChange);
        }
    }
    public get bottomHeight(): number {
        return this._bottomHeight;
    }

    public setRoot(nd: cc.Node): void {
        this.Root = nd;
    }

    public addToLayer(layerType: GameLayerEnum, node: cc.Node): void {
        if (!node) return;
        let taggetLayer: cc.Node = null;
        switch (layerType) {
            case GameLayerEnum.MAP_LAYER:
                taggetLayer = this._MapLayer;
                break;
            case GameLayerEnum.BATTLE_LAYER:
                taggetLayer = this._BattleLayer;
                break;
            case GameLayerEnum.MAIN_CITY_LAYER:
                taggetLayer = this._MainCityLayer;
                break;
            case GameLayerEnum.DOWN_LAYER:
                taggetLayer = this._DownLayer;
                break;
            case GameLayerEnum.MAIN_LAYER:
                taggetLayer = this._MainLayer;
                break;
            case GameLayerEnum.POP_LAYER:
                taggetLayer = this._PopLayer;
                break;
            case GameLayerEnum.DEFAULT_LAYER:
                taggetLayer = this._DefaultLayer;
                break;
            case GameLayerEnum.TIPS_LAYER:
                taggetLayer = this._TipsLayer;
                break;
            case GameLayerEnum.WARN_LAYER:
                taggetLayer = this._WarnLayer;
                break;
            default:
                break;
        }
        if (!taggetLayer) {
            console.warn('无效的层级: ', layerType);
            return;
        }
        taggetLayer.addChild(node);
    }

    public onAddToLayer(type: GameLayerEnum, node: cc.Node): void {
        this.addToLayer(type, node);
    }

    /** 处理全屏窗口打开关闭时隐藏主界面 */
    private dealWinBigClose(isWinBigAllClose: boolean) {
        this.hideLayer(isWinBigAllClose);
    }
    private hideLayer(isShow: boolean) {
        // 由于 active 函数性能问题隔帧处理
        const timer = setTimeout(() => {
            if (timer) clearTimeout(timer);
            if (this._MainLayer.active !== isShow) {
                this._MainLayer.active = isShow;
            }
        });
    }

    public initClickAnima(): void {
        const ndLayer: cc.Node = this._NdClickLayer;
        ndLayer.on(cc.Node.EventType.TOUCH_START, this.onMouseDown, this);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, dot-notation
        ndLayer['_touchListener'].setSwallowTouches(false);
    }

    private onMouseDown(event: cc.Event.EventTouch) {
        const ndLayer: cc.Node = this._NdClickLayer;
        const pos: cc.Vec2 = ndLayer.convertToNodeSpaceAR(event.getLocation());
        if (!this._clickEffect) {
            EffectMgr.I.showAnim(`${RES_ENUM.Touch_Ui}${6118}`, (node: cc.Node) => {
                if (ndLayer && ndLayer.isValid) {
                    const eff = ndLayer.getChildByName('btnEffect');
                    if (eff) {
                        eff.destroy();
                    }
                    node.name = 'btnEffect';
                    this._clickEffect = node;
                    ndLayer.addChild(node);
                    this._clickEffect.x = pos.x;
                    this._clickEffect.y = pos.y;
                }
            }, cc.WrapMode.Default);
        } else {
            this._clickEffect.x = pos.x;
            this._clickEffect.y = pos.y;
            const animation = this._clickEffect.getComponent(cc.Animation);
            if (animation) animation.play('default');
        }
    }

    /** 是否有界面打开 */
    public isDefaultLayerOpen(): boolean {
        return this._DefaultLayer.childrenCount > 0;
    }
}
