/*
 * @Author: kexd
 * @Date: 2022-07-21 12:01:51
 * @FilePath: \SanGuo24\assets\script\game\com\LevelUp.ts
 * @Description: 等级提升表现
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
export class LevelUp extends BaseUiView {
    @property(cc.Node)
    private NdAnim: cc.Node = null;
    @property(cc.Label)
    private LabOld: cc.Label = null;
    @property(cc.Label)
    private LabCur: cc.Label = null;

    private static I: LevelUp = null;

    private _oldLv: number = 0;
    private _curLv: number = 0;

    /** 上次的值 */
    private static oldLv: number = 0;
    public static show(value: number): void {
        if (LevelUp.oldLv === 0 || LevelUp.oldLv === value) {
            LevelUp.oldLv = value;
            return;
        }
        if (LevelUp.oldLv >= value) {
            LevelUp.oldLv = value;
            return;
        }

        ResMgr.I.loadLocal(UI_PATH_ENUM.LevelUp, cc.Prefab, (err, p: cc.Prefab) => {
            if (err) return;
            if (p) {
                const nd = cc.instantiate(p);
                LayerMgr.I.addToLayer(GameLayerEnum.TIPS_LAYER, nd);
                nd.getComponent(LevelUp).setData(value, LevelUp.oldLv);
                LevelUp.oldLv = value;
            }
        });
    }

    protected start(): void {
        LevelUp.I = this;
    }

    public setData(value: number, last: number): void {
        this._oldLv = last;
        this._curLv = value;

        const n = this.NdAnim.getChildByName('lvUp');
        if (!n) {
            EffectMgr.I.showAnim(RES_ENUM.Com_Ui_8001, (node: cc.Node) => {
                if (this.NdAnim && this.NdAnim.isValid) {
                    const eff = this.NdAnim.getChildByName('lvUp');
                    if (eff) {
                        eff.destroy();
                    }
                    this.NdAnim.addChild(node);
                    node.name = 'lvUp';

                    //
                    this.scheduleOnce(() => {
                        this.LabOld.string = `${this._oldLv}`;
                        this.LabCur.string = `${this._curLv}`;
                        this.LabOld.node.active = true;
                        this.LabCur.node.active = true;
                    }, 0.3);
                }
            }, cc.WrapMode.Normal, () => {
                this.onClose();
            });
        }
    }

    private onClose() {
        this.node.destroy();
        LevelUp.I = null;
    }
}
