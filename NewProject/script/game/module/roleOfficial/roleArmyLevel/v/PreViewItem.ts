/*
 * @Author: myl
 * @Date: 2022-10-26 10:29:36
 * @Description:
 */
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import ModelMgr from '../../../../manager/ModelMgr';
import { ArmyLvConst } from '../ArmyLvConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class PreViewItem extends cc.Component {
    @property(DynamicImage)
    private SprName: DynamicImage = null;

    @property(cc.Label)
    private LabLv: cc.Label = null;

    @property(cc.RichText)
    private RTDesc: cc.RichText = null;

    public setData(cfg: Cfg_ArmyGrade): void {
        // 名称
        const url: string = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(cfg.ArmyLevel);
        this.SprName.loadImage(url, 1, true);
        // 等级
        this.LabLv.string = `${cfg.ArmyStar}${i18n.lv}${i18n.tt(Lang.open_open)}`;
        const colorStr: string = ArmyLvConst.getLvColorByArmyLV(cfg.ArmyLevel);
        this.LabLv.node.color = UtilColor.Hex2Rgba(colorStr);
        // 描述
        this.RTDesc.string = `<color=${UtilColor.OrangeV}> ${cfg.Detail}</c>`;
    }
}
