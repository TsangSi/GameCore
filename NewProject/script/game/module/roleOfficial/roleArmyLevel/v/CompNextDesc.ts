/*
 * @Author: myl
 * @Date: 2022-10-26 10:29:36
 * @Description:
 */
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { i18n } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import ModelMgr from '../../../../manager/ModelMgr';
import { ArmyLvConst } from '../ArmyLvConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class CompNextDesc extends cc.Component {
    @property(DynamicImage)
    private sprName: DynamicImage = null;
    @property(cc.Label)
    private armyNameLab: cc.Label = null;

    @property(cc.Label)
    private LabLv: cc.Label = null;

    @property(cc.RichText)
    private desc: cc.RichText = null;

    public updateDescInfo(armyLevel: number, armyStar: number): void {
        // 判断是否达到最大等级
        const isMax: boolean = ModelMgr.I.ArmyLevelModel.isArmyLvMax(armyLevel, armyLevel);
        if (isMax) {
            this.node.active = false;
            return;
        }

        let nextStar: number = armyStar;
        let nextLevel: number = armyLevel;

        if (armyStar === 5) {
            nextStar = 1;
            nextLevel = armyLevel + 1;
        } else {
            nextStar = armyStar + 1;
            if (armyLevel === 0) {
                nextLevel = 1;
            }
        }
        const cfg: Cfg_ArmyGrade = ModelMgr.I.ArmyLevelModel.getArmyLevelCfg(nextLevel, nextStar);
        if (cfg.Detail === '') {
            this.updateDescInfo(nextLevel, nextStar);
            return;
        }
        this.LabLv.string = `${nextStar}${i18n.lv}`;// 级
        const colorStr: string = ArmyLvConst.getLvColorByArmyLV(nextLevel, false);
        this.LabLv.node.color = UtilColor.Hex2Rgba(colorStr);

        this.desc.string = cfg.Detail;
        const url: string = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(nextLevel);
        this.sprName.loadImage(url, 1, true);

        // this.armyNameLab.string = cfg.ArmyName;
        // this.armyNameLab.node.color = UtilColor.Hex2Rgba(colorStr);
    }
}
