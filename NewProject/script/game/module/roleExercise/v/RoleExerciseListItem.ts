// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { DynamicImage } from '../../../base/components/DynamicImage';
import ListItem from '../../../base/components/listview/ListItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleExerciseListItem extends ListItem {
    @property(DynamicImage)
    private icon: DynamicImage = null;

    @property(DynamicImage)
    private selectIcon: DynamicImage = null;

    private lastId: number = -1;

    public setData(id: number): void {
        if (this.lastId === id) return;
        this.lastId = id;
        this.icon.node.opacity = 0;
        this.icon.loadImage(`/texture/roleExercise/UI_Exercise_icon_${id}`, 1, false, 'resources', false, () => {
            this.icon.node.opacity = 255;
        });
        this.selectIcon.node.opacity = 0;
        this.selectIcon.loadImage(`/texture/roleExercise/UI_Exercise_icon_${id}_sel`, 1, false, 'resources', false, () => {
            this.selectIcon.node.opacity = 255;
        });
    }
}
