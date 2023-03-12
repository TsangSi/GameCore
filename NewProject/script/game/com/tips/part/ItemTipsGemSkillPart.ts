/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable max-len */
/*
 * @Author: hwx
 * @Date: 2022-06-17 14:17:55
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsGemSkillPart.ts
 * @Description: 道具Tips属性部件
 */
import ModelMgr from '../../../manager/ModelMgr';
import { ItemType } from '../../item/ItemConst';
import { BaseItemTipsPart } from './BaseItemTipsPart';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsGemSkillPart extends BaseItemTipsPart {
    @property(cc.RichText)
    private RichAttr: cc.RichText = null;
    protected refresh(): void {
        if (this.itemModel.cfg.Type !== ItemType.GEM || this.itemModel.cfg.SubType !== ItemType.GEM_SKILL) {
            this.node.active = false;
            return;
        }

        const model = ModelMgr.I.GemModel;

        const item = model.getGemItem(this.itemModel.cfg.Id);

        let str = '';

        if (item) {
            str += model.getSkillDesc(item.Skill);
        }

        this.RichAttr.string = str;
    }
}
