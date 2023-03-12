/*
 * @Author: hrd
 * @Date: 2022-04-02 10:18:39
 * @FilePath: \SanGuo2.4\assets\script\game\base\main\Root.ts
 * @Description:
 *
 */
import { LayerMgr } from './LayerMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class Root extends cc.Component {
    /** 地图层 */
    @property(cc.Node)
    private MapLayer: cc.Node = null;
    /** 战斗层 */
    @property(cc.Node)
    private BattleLayer: cc.Node = null;
    /** 主城层 */
    @property(cc.Node)
    private MainCityLayer: cc.Node = null;
    /** UI最底下层（在主界面层下一层） */
    @property(cc.Node)
    private DownLayer: cc.Node = null;
    /** 主界面层 */
    @property(cc.Node)
    private MainLayer: cc.Node = null;
    /** 默认UI弹出层 */
    @property(cc.Node)
    private DefaultLayer: cc.Node = null;
    /** 飘字层 */
    @property(cc.Node)
    private PopLayer: cc.Node = null;
    /** 提示窗层 */
    @property(cc.Node)
    private TipsLayer: cc.Node = null;
    /** 警告提示层 */
    @property(cc.Node)
    private WarnLayer: cc.Node = null;
    /** 点击特效层 */
    @property(cc.Node)
    private NdClickLayer: cc.Node = null;
    public onLoad(): void {
        LayerMgr.I.setRoot(this.node);
        LayerMgr.I.MapLayer = this.MapLayer;
        LayerMgr.I.BattleLayer = this.BattleLayer;
        LayerMgr.I.MainCityLayer = this.MainCityLayer;
        LayerMgr.I.DownLayer = this.DownLayer;
        LayerMgr.I.MainLayer = this.MainLayer;
        LayerMgr.I.DefaultLayer = this.DefaultLayer;
        LayerMgr.I.PopLayer = this.PopLayer;
        LayerMgr.I.TipsLayer = this.TipsLayer;
        LayerMgr.I.WarnLayer = this.WarnLayer;
        LayerMgr.I._NdClickLayer = this.NdClickLayer;
        LayerMgr.I.initClickAnima();
        // window.rootNode = this.node;
    }

    // public start(): void {
    //     console.log('=======start=========', this.DefaultLayer);
    // }
}
