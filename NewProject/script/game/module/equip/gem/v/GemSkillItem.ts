import { DynamicImage } from '../../../../base/components/DynamicImage';
import { RES_ENUM } from '../../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GemSkillItem extends cc.Component {
    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.RichText)
    private RtDesc: cc.RichText = null;

    @property(DynamicImage)
    private SprIcon: DynamicImage = null;

    public setData(name: string, desc: string, SkillIconID: number): void {
        this.LabName.string = name;
        this.RtDesc.string = desc;
        this.SprIcon.loadImage(`${RES_ENUM.Skill}${SkillIconID}`, 1, true);
    }
}
