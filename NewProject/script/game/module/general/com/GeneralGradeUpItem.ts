/*
 * @Author: kexd
 * @Date: 2022-09-30 16:49:13
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\com\GeneralGradeUpItem.ts
 * @Description:武将-升阶 武将道具
 *
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import ModelMgr from '../../../manager/ModelMgr';
import { GeneralMsg, ClickType } from '../GeneralConst';
import GeneralHead from './GeneralHead';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GeneralGradeUpItem extends BaseCmp {
    @property(GeneralHead)
    private GeneralHead: GeneralHead = null;
    @property(cc.Node)
    private NdAdd: cc.Node = null;
    @property(cc.Label)
    private LabHave: cc.Label = null;
    @property(cc.Label)
    private LabNeed: cc.Label = null;

    private _type: number = 0;

    protected start(): void {
        super.start();
    }

    /**
     *
     * @param gData
     * @param chooseNum
     * @param costNum
     * @param i
     * @returns
     */
    public setData(type: number, selfOnlyId: string, gData: GeneralMsg, chooseNum: number, costNum: number, i: number): void {
        if (!gData) return;
        this._type = type;
        if (this._type === 0) {
            this.GeneralHead.getComponent(GeneralHead).setData(gData, { clickType: ClickType.GradeCost, unshowSelect: true, unshowLevel: true });
        } else if (this._type === 1) {
            this.GeneralHead.getComponent(GeneralHead).setData(gData, { clickType: ClickType.EquipCost, unshowSelect: true, unshowLevel: true });
        }

        UtilCocos.SetSpriteGray(this.GeneralHead.node, chooseNum < costNum, true);

        const color: cc.Color = chooseNum >= costNum ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);
        this.LabHave.node.color = color;
        this.LabHave.string = `${chooseNum}`;
        this.LabNeed.string = `/${costNum}`;
        // +
        this.NdAdd.active = chooseNum <= i;
        // 红点
        const gList: GeneralMsg[] = ModelMgr.I.GeneralModel.getGeneralListbyIId(gData.generalData.IId, selfOnlyId);
        const isRed: boolean = gList.length >= costNum && chooseNum <= i;
        UtilRedDot.UpdateRed(this.node, isRed, cc.v2(42, 42));
    }
}
