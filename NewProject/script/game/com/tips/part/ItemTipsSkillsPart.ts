/*
 * @Author: hwx
 * @Date: 2022-06-17 14:19:35
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsSkillsPart.ts
 * @Description: 道具Tips技能部件
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { ItemType } from '../../item/ItemConst';
import { BaseItemTipsPart } from './BaseItemTipsPart';
import { ItemTipsSkillItem } from './ItemTipsSkillItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsSkillsPart extends BaseItemTipsPart {
    @property(cc.ScrollView)
    private SvSkills: cc.ScrollView = null;

    /**
     * 刷新
     */
    public refresh(): void {
        const itemId = this.itemModel.cfg.Id;
        const subType = this.itemModel.cfg.SubType;

        const skillsInfos = [];

        if (subType === ItemType.SKIN_HORSE
            || subType === ItemType.SKIN_WING
            || subType === ItemType.SKIN_WEAPON) {
            // 进阶皮肤不显示技能
        } else if (subType === ItemType.SKIN_FASHION) {
            // 角色时装不显示技能
        }

        if (skillsInfos.length > 0) {
            this.node.active = true;
            UtilCocos.LayoutFill(this.SvSkills.content, (item, index) => {
                const comp = item.getComponent(ItemTipsSkillItem);
                if (comp) {
                    comp.setData(skillsInfos[index]);
                }
            }, skillsInfos.length);
        } else {
            this.node.active = false;
        }
    }
}
