/*
 * @Author: hwx
 * @Date: 2022-07-28 14:59:48
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\grade\v\GradeToGoldEquipItem.ts
 * @Description:
 */
import UtilItem from '../../../base/utils/UtilItem';
import ItemModel from '../../../com/item/ItemModel';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ItemTipsOptions } from '../../../com/item/ItemConst';
import { UtilGame } from '../../../base/utils/UtilGame';
import { GradeMgr } from '../GradeMgr';
import { UtilEquip } from '../../../base/utils/UtilEquip';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeToGoldEquipItem extends cc.Component {
    @property(cc.Node)
    protected SpSelect: cc.Node = null;
    @property(cc.Node)
    protected NdName: cc.Node = null;
    @property(cc.Node)
    protected NdIcon: cc.Node = null;
    @property(cc.Label)
    protected LabGrade: cc.Label = null;
    @property(cc.Label)
    protected LabLevel: cc.Label = null;
    @property(cc.Node)
    protected NdLock: cc.Node = null;
    @property(cc.Node)
    public NdTouch: cc.Node = null;

    public index: number = null;
    /**
     * 设置数据
     * @param index 序号
     * @param lock 是否加锁 true加  false解锁
     * @param select 是否选中
     * @param level 阶
     * @param itemModel 道具item
     */
    public setData(data:
        { index: number, lock: boolean, select: boolean, grade: number, itemModel: ItemModel, level: number, hide?: boolean }): void {
        this.index = data.index;
        this.SpSelect.active = data.select;
        this.NdLock.active = data.lock;
        // this.NdName.active = !data.lock && data.grade > 0 && data.index !== -1;
        this.NdName.active = false;
        this.LabGrade.string = `${data.grade}${i18n.jie}`;
        this.LabGrade.node.active = !data.lock && data.grade > 0;
        if (!data.hide) {
            this.LabLevel.string = `${i18n.tt(Lang.com_dengji)}:${data.level}`;
            this.LabLevel.node.active = !data.lock && data.level > 0;
        } else {
            this.LabLevel.node.active = false;
        }

        this.NdIcon.active = !data.lock;
        if (data.itemModel) {
            UtilItem.Show(this.NdIcon, data.itemModel, { needName: this.NdName.active, isDarkBg: true }, (itemIcon) => {
                itemIcon.clickTarget = this.node;
                // const opts: ItemTipsOptions = cc.js.createMap(true);
                // const intAttr: IntAttr = UtilGame.GetIntAttrByKey(, data.itemModel.cfg.EquipPart);
                // const strengthLv = intAttr ? intAttr.V : 0;
                // if (strengthLv > 0) {
                //     const attrInfo = GradeMgr.I.getStrengthAttrInfo(part, strengthLv);
                //     const [strengthFv, strengthAttrStr] = UtilAttr.GetTipsStrengthFvAttrStr(equip.cfg.AttrId, attrInfo);
                //     opts.strengthFv = strengthFv;
                //     opts.strengthLv = strengthLv;
                //     opts.strengthAttrStr = strengthAttrStr;
                // }
                const opts = UtilEquip.GetEquipItemTipsOptions(data.itemModel);
                itemIcon.setTipsOptions(opts);
            });
        } else {
            this.NdIcon.destroyAllChildren();
            this.NdIcon.removeAllChildren();
        }
    }

    public setSelect(select: boolean): void {
        this.SpSelect.active = select;
    }
}
