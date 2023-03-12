/*
 * @Author: kexd
 * @Date: 2022-07-21 12:01:51
 * @FilePath: \SanGuo2.4-main\assets\script\game\com\FvUp.ts
 * @Description: 战力提升表现
 */
import BaseUiView from '../../app/core/mvc/view/BaseUiView';
import { ResMgr } from '../../app/core/res/ResMgr';
import { GameLayerEnum } from '../../app/core/mvc/WinConst';
import { LayerMgr } from '../base/main/LayerMgr';
import { EffectMgr } from '../manager/EffectMgr';
import { UI_PATH_ENUM } from '../const/UIPath';
import { RES_ENUM } from '../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class FvUp extends BaseUiView {
    /** 战力动画 */
    @property(cc.Node)
    private NdAnim: cc.Node = null;

    /** 五六个战力文本从下往上水波一样飘 */
    @property(cc.Node)
    private NdFlyUpAni: cc.Node = null;

    @property(cc.Label)
    private LabFv: cc.Label = null;

    /** 战力增加 */
    @property(cc.Label)
    private LabFvAdd: cc.Label = null;

    private static I: FvUp = null;

    /** 上次战力值 */
    private _preFv: number = 0;
    /** 当前战力值 */
    private _curFv: number = 0;
    /** 加的战力值 */
    private _addDeltaFv: number = 0;
    /** 上次的战力值 */
    private static lastValue: number = 0;

    public static show(value: number): void {
        if (FvUp.lastValue === 0 || FvUp.lastValue === value) {
            FvUp.lastValue = value;
            return;
        }
        if (FvUp.lastValue >= value) {
            FvUp.lastValue = value;
            return;
        }
        // console.log('上次战力是', FvUp.lastValue, '当前战力是', value, '上升', value - FvUp.lastValue);

        if (FvUp.I) {
            FvUp.I.onClose();
        }

        if (!FvUp.I) {
            ResMgr.I.loadLocal(UI_PATH_ENUM.FvUp, cc.Prefab, (err, p: cc.Prefab) => {
                if (err) return;
                if (p) {
                    const nd = cc.instantiate(p);
                    LayerMgr.I.addToLayer(GameLayerEnum.TIPS_LAYER, nd);
                    nd.getComponent(FvUp).setData(value, FvUp.lastValue);
                    FvUp.lastValue = value;
                }
            });
        } else {
            // console.log('当前已存在，就直接刷新就行', FvUp.lastValue, '当前战力是', value, '上升', value - FvUp.lastValue);
            FvUp.I.setData(value, FvUp.lastValue);
            FvUp.lastValue = value;
        }
    }

    protected start(): void {
        FvUp.I = this;
    }

    public setData(value: number, last: number): void {
        this._addDeltaFv = value - last;
        this._preFv = last;
        this._curFv = value;

        if (this._curFv <= 0) {
            this.onClose();
        }

        this.showAnim();
        this.uptUI();
        this.uptFv();
    }

    private _times: number = 0;
    private uptFv() {
        this._times = 0;
        this.schedule(() => {
            this._times++;
            // console.log('this._times=', this._times);
            if (this._times >= 5) {
                this.LabFv.string = this._curFv.toString();
            } else {
                if (this._preFv < this._curFv) {
                    const diff = this._curFv - this._preFv;
                    let add = Math.ceil(diff / 5);
                    if (add > diff) {
                        add = diff;
                    }
                    this._preFv += add;
                } else {
                    this._preFv = this._curFv;
                }
                this.LabFv.string = this._preFv.toString();
            }
        }, 0.1, 5, 0.2);
    }

    /** 当前战力是几位数 */
    private _getNumByFv(): number {
        let n = 1;
        for (let i = 1; i < 15; i++) {
            if (this._curFv >= 10 ** i) {
                n = i + 1;
            } else {
                break;
            }
        }
        return n;
    }

    private showAnim() {
        /** 播放背景 */
        EffectMgr.I.showEffect(RES_ENUM.Com_Ui_103, this.NdAnim, cc.WrapMode.Normal);
        /** 当前战力是几位数 */
        const n: number = this._getNumByFv();
        /** 字体间距 */
        const fontGap: number = 20;

        const singleDeltaTime = 0.08;// 单个字符间隔时间
        let totalTime = 0;
        for (let i = 0; i < n; i++) {
            totalTime += i * singleDeltaTime;
        }

        for (let i = 0; i < n; i++) {
            const nd = new cc.Node();
            this.NdFlyUpAni.addChild(nd);
            nd.x = fontGap * i;
            // nd.position.set(fontGap * i);

            const delayTime = (n - i) * singleDeltaTime;
            this.scheduleOnce(() => {
                // tween(nd).to(totalTime, { position: new cc.Vec2(fontGap * i, 0, 0) }).start();
                EffectMgr.I.showEffect(RES_ENUM.Com_Ui_103_2, nd, cc.WrapMode.Normal);
            }, delayTime);

            // if (i === n - 1) {
            //     this.uptUI();
            //     this.uptFv();
            // }
        }
    }

    private uptUI() {
        this.LabFv.string = this._preFv.toString();
        this.LabFvAdd.string = `+${this._addDeltaFv}`;
        // 上升的战力
        this.LabFvAdd.node.setPosition(10000, 10000, 0);
        cc.tween(this.LabFvAdd.node).delay(0.5)
            .call(() => {
                this.LabFvAdd.node.setPosition(-50, 25, 0);
            })
            .by(0.4, { x: 0, y: 25 }, { easing: 'sineIn' })
            .delay(0.3)
            .call(() => {
                this.onClose();
            })
            .start();

        // 最终显示战力
        this.LabFv.node.setPosition(10000, 10000, 0);
        cc.tween(this.LabFv.node)
            .delay(0.5)
            .call(() => {
                this.LabFv.node.setPosition(-50, 0, 0);
                // this.scheduleOnce(() => {
                //     this.onClose();
                // }, 0.8);
            })
            .start();
    }

    private onClose() {
        this.node.destroy();
        this.NdFlyUpAni.children.forEach((node, idx) => {
            if (node) node.destroy();
        });
        FvUp.I = null;
    }
}
