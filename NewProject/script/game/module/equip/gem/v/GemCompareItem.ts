import ModelMgr from '../../../../manager/ModelMgr';
import GemSkillItem from './GemSkillItem';

const { ccclass, property } = cc._decorator;

// ActiveSkillTip

@ccclass
export class GemCompareItem extends cc.Component {
    @property(GemSkillItem)
    private GsLastSkill: GemSkillItem = null;

    @property(GemSkillItem)
    private GsCurSkill: GemSkillItem = null;

    @property(cc.Node)
    private NdEmpty: cc.Node = null;

    public setData(itemId: number[]): void {
        console.log(itemId);
        const model = ModelMgr.I.GemModel;
        const info = model.getGemInfo(itemId[1]);
        this.NdEmpty.active = itemId[0] == null;
        this.GsLastSkill.node.active = itemId[0] != null;
        this.GsCurSkill.setData(info.skillName, info.desc, info.skillIcon);
        if (itemId[0] != null) {
            const info = model.getGemInfo(itemId[0]);
            this.GsLastSkill.setData(info.skillName, info.desc, info.skillIcon);
        }
    }
}
