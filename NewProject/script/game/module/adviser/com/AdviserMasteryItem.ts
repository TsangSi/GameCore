/*
 * @Author: zs
 * @Date: 2023-03-07 15:11:24
 * @Description:
 *
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n } from '../../../../i18n/i18n';
import { UtilGame } from '../../../base/utils/UtilGame';
import ModelMgr from '../../../manager/ModelMgr';
import { EMasteryType } from '../AdviserConst';
import AdviserModel from '../AdviserModel';

const { ccclass, property } = cc._decorator;
@ccclass()
export class AdviserMasteryItem extends BaseCmp {
    @property(cc.Sprite)
    private SpriteIcon: cc.Sprite = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelLevel: cc.Label = null;
    @property(cc.Node)
    private NdSelect: cc.Node = null;
    @property(cc.Node)
    private NdMask: cc.Node = null;
    private model: AdviserModel = null;
    private func: (itemScript: AdviserMasteryItem) => void;
    private target: object = null;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.node, () => {
            if (this.target) {
                this.func.call(this.target, this);
            } else {
                this.func(this);
            }
        }, this);
    }
    private _cfg: Cfg_AdviserMastery = null;
    public get cfg(): Cfg_AdviserMastery {
        return this._cfg;
    }
    public setData(index: number, cfg: Cfg_AdviserMastery): void {
        this.model = ModelMgr.I.AdviserModel;
        this._cfg = cfg;
        this.NdSelect.active = false;
        UtilCocos.LoadSpriteFrameRemote(this.SpriteIcon, `texture/adviser/icon_junshi_jineng0${index + 1}`);
        this.LabelName.string = this.cfg.Name;
        const level = this.model.getMasteryLevel(this.cfg.Id);
        this.updateLevel(level);
    }
    /**
     * 更新等级
     * @param level 等级
     */
    public updateLevel(level: number): void {
        let maskActive = true;
        if (level > 0) {
            let str = '';
            if (this.cfg.MasteryType === EMasteryType.Special) {
                str = i18n.jie;
            } else {
                str = i18n.lv;
            }
            const levelStr = `${this.model.getMasteryLevel(this.cfg.Id)}${str}`;
            maskActive = false;
            this.LabelLevel.string = levelStr;
        }
        this.LabelLevel.node.active = !maskActive;
        this.NdMask.active = maskActive;
    }

    public setSelectFunc(func: (itemScript: AdviserMasteryItem) => void, target?: object): void {
        this.func = func;
        this.target = target;
    }

    public setSelectActive(active: boolean): void {
        this.NdSelect.active = active;
    }
}
