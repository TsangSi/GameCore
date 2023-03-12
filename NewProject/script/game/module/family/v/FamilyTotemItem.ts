import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class FamilyTotemItem extends cc.Component {
    @property(cc.Node)// 锁
    private NdBg: cc.Node = null;

    @property(cc.Label)// 等级
    private LabLv: cc.Label = null;

    @property(cc.Node)// 选中
    private NdSelect: cc.Node = null;

    @property(cc.Node)// 锁
    private NdLock: cc.Node = null;

    @property(DynamicImage)// 图腾图标
    private SprIcon: DynamicImage = null;

    @property(cc.Node)// 锁
    private NdRed: cc.Node = null;

    public setData(index: number, isSelect: boolean): void {
        this.NdSelect.active = isSelect;

        const path = `texture/family/icon_sj_totems_${index + 1}@ML`;
        this.SprIcon.pngPath(path);

        const cfg: Cfg_Totem = ModelMgr.I.FamilyModel.getCfgTotemByIndex(index);
        const totem: Totem = ModelMgr.I.FamilyModel.getTotemInfo(cfg.Id);
        if (totem) { // 已解锁
            UtilCocos.SetSpriteGray(this.NdBg, false, true);
            UtilCocos.SetSpriteGray(this.SprIcon.node, false, true);
            this.NdLock.active = false;
            this.LabLv.string = `${totem.Level}${i18n.lv}`;

            const maxLv = cfg.MaxLv;// 最大等级上限

            // 1、未满级2、消耗足够
            // const cfgTotemLevel: Cfg_TotemLevel = ModelMgr.I.FamilyModel.getCfgTotomLevel(totem.Level);
            const itemId = cfg.CostItem;
            const itemNum = 1;// Math.round(cfg.CostLevelRatio / 10000 * cfgTotemLevel.CostLevel);
            const bagNum = BagMgr.I.getItemNum(itemId);

            if (totem.Level < maxLv && bagNum >= itemNum) {
                this.NdRed.active = true;
            } else {
                this.NdRed.active = false;
            }
        } else { // 未解锁
            UtilCocos.SetSpriteGray(this.NdBg, true, true);
            UtilCocos.SetSpriteGray(this.SprIcon.node, true, true);
            this.NdRed.active = false;
            this.LabLv.string = ``;
            this.NdLock.active = true;
        }
    }
}
