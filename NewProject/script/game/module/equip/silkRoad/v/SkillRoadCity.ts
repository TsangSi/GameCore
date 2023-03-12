import { DynamicImage } from '../../../../base/components/DynamicImage';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkillRoadCity extends cc.Component {
    @property(DynamicImage)
    private icon: DynamicImage = null;
    public setData(id: number): void {
        this.icon.loadImage(`texture/silkRoad/city/city${id}`, 1);
    }
}
