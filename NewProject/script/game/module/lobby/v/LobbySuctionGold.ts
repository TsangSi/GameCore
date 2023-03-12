import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { TickTimer } from '../../../base/components/TickTimer';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { FlyItem } from '../../onHook/com/FlyItem';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import SceneMap from '../../../map/SceneMap';
import { Config } from '../../../base/config/Config';
import ModelMgr from '../../../manager/ModelMgr';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { EffectMgr } from '../../../manager/EffectMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class LobbySuctionGold extends BaseCmp {
    @property(sp.Skeleton)
    private NdAnima: sp.Skeleton = null;
    @property(cc.Sprite)
    private SprBar: cc.Sprite = null;
    @property(TickTimer)
    private LabTime: TickTimer = null;
    @property(cc.Node)
    private NdAward: cc.Node = null;
    @property(cc.Node)
    private NdEff: cc.Node = null;

    private _init: boolean = false;
    /** 挂机奖励的时间上限 */
    private _maxTime: number = 0;
    private _percent30: number = 0;
    private _percent60: number = 0;
    /** 已挂机时间 */
    private _AFKTime: number = 0;
    /** 聚宝盆状态 0-低于30%,1-低于60%,2-低于100%, 3-100% */
    private _state: number = 0;
    /** 聚宝盆状态:1 2 3 */
    private _animState: number = 1;

    protected start(): void {
        this.addE();
        ControllerMgr.I.OnHookController.reqAFKInfo();
        this.uptTime();
    }

    private addE() {
        EventClient.I.on(E.Map.RemoveVMMonsterToMap, this.fly, this);
        EventClient.I.on(E.OnHook.AFKInfo, this.uptTime, this);
    }

    private remE() {
        EventClient.I.off(E.Map.RemoveVMMonsterToMap, this.fly, this);
        EventClient.I.off(E.OnHook.AFKInfo, this.uptTime, this);
    }

    protected update(dt: number): void {
        if (this._init) {
            if (this._AFKTime < this._percent30) {
                this._state = 0;
            } else if (this._AFKTime < this._percent60) {
                this._state = 1;
            } else if (this._AFKTime < this._maxTime) {
                this._state = 2;
            } else {
                this._state = 3;
            }
            this.playAnim();
        }
    }

    private getAnimState(): number {
        if (this._state === 0) {
            return 1;
        } else if (this._state === 1) {
            return 2;
        } else {
            return 3;
        }
    }

    private playAnim() {
        const aState = this.getAnimState();
        if (this._animState !== aState) {
            this.NdAnima.setAnimation(0, `daiji${aState}`, true);
            this._animState = aState;
        }
    }

    private playEat() {
        const aState = this.getAnimState();
        this.NdAnima.setAnimation(0, `zhangzui${aState}`, false);
        this.NdAnima.setCompleteListener(() => {
            this.NdAnima.setAnimation(0, `daiji${aState}`, true);
        });
    }

    private uptTime() {
        const cfg: Cfg_Config_AFK = Config.Get(Config.Type.Cfg_Config_AFK).getValueByKey('AFKPrizeMaxTime');
        this._maxTime = +cfg.CfgValue;
        this._percent30 = Math.ceil(this._maxTime * 0.3);
        this._percent60 = Math.ceil(this._maxTime * 0.6);
        this._AFKTime = ModelMgr.I.OnHookModel.AFKTime;
        if (this._AFKTime > this._maxTime) {
            this._AFKTime = this._maxTime;
            ModelMgr.I.OnHookModel.AFKTime = this._AFKTime;
        }
        this.LabTime.tick2(this._AFKTime, this._maxTime, '%HH:%mm:%ss', true, true, true);
        this.LabTime.removeEndEventHandler(this.node, 'LobbySuctionGold', 'onTick');
        this.LabTime.addTickEventHandler(this.node, 'LobbySuctionGold', 'onTick');

        this.SprBar.fillRange = this._AFKTime / this._maxTime;
        this._init = true;
    }

    private onTick(left: number): void {
        this._AFKTime = left;
        if (this._AFKTime > this._maxTime) {
            this._AFKTime = this._maxTime;
        }
        ModelMgr.I.OnHookModel.AFKTime = this._AFKTime;
        this.SprBar.fillRange = this._AFKTime / this._maxTime;
    }

    /** 飞金币的效果展示 */
    public fly(monsterid: number, w_x: number, w_y: number): void {
        this.NdAward.destroyAllChildren();
        this.NdAward.removeAllChildren();
        ResMgr.I.loadLocal(UI_PATH_ENUM.FlyItem, cc.Prefab, (err, p: cc.Prefab) => {
            if (err || !p || !this.NdAward || !this.NdAward.isValid) return;
            const len = UtilNum.RandomInt(10, 12);
            const half = len / 2;
            const pos = SceneMap.I.getMapPos();

            for (let i = 0; i < len; i++) {
                const newNd = cc.instantiate(p);
                this.NdAward.addChild(newNd);
                newNd.setPosition(w_x + pos.x + 64, w_y + pos.y + 64, 0);
                newNd.getComponent(FlyItem).setData(new cc.Vec2(-35, -285), i < half ? -1 : 1);
            }
            this.scheduleOnce(() => {
                this.playEat();
            }, 0.8);

            this.scheduleOnce(() => {
                this.NdEff.destroyAllChildren();
                EffectMgr.I.showAnim(RES_ENUM.Onhook_Ui_6582, (node: cc.Node) => {
                    if (this.NdEff && this.NdEff.isValid) {
                        this.NdEff.addChild(node);
                    }
                }, cc.WrapMode.Normal);
            }, 1.25);
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
