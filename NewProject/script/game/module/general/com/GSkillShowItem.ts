/*
 * @Author: kexd
 * @Date: 2022-11-18 14:28:28
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\com\GSkillShowItem.ts
 * @Description: 武将-技能item
 *
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { GeneralMsg, ISkillEx } from '../GeneralConst';
import { GSkillItem } from './GSkillItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class GSkillShowItem extends BaseCmp {
    @property(GSkillItem)
    private GSkillItem: GSkillItem = null;

    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.RichText)
    private RichDesc: cc.RichText = null;

    protected start(): void {
        super.start();
    }

    /**
     * 武将-技能item展示
     * @param skillId: 技能id
     */
    public setData(skillId: number): void {
        const ex: ISkillEx = {
            skillId,
        };
        this.GSkillItem.setData(ex);
        this.LabName.string = UtilSkillInfo.GetSkillName(skillId);
        this.RichDesc.string = UtilSkillInfo.GetSkillDesc(skillId);
    }
}
