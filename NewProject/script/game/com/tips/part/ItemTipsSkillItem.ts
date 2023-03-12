/*
 * @Author: hwx
 * @Date: 2022-06-22 15:59:19
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsSkillItem.ts
 * @Description: 道具Tips技能项
 */

import { DynamicImage } from '../../../base/components/DynamicImage';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

type SkillInfo = { id: number, desc: string }

@ccclass
export class ItemTipsSkillItem extends cc.Component {
    @property(DynamicImage)
    private NdIcon: DynamicImage = null;

    @property(cc.Label)
    private LabDesc: cc.Label = null;

    public setData(data: SkillInfo): void {
        this.NdIcon.loadImage(`${RES_ENUM.Item}${data.id}`, 1, true);
        this.LabDesc.string = data.desc;
    }
}
