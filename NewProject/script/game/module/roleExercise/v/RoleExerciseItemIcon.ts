// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import Progress from '../../../base/components/Progress';
import { ItemIconOptions } from '../../../com/item/ItemConst';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleExerciseItemIcon extends cc.Component {
    @property(Progress)
    private progress: Progress = null;

    @property(cc.Label)
    private LabProgress: cc.Label = null;

    @property(DynamicImage)
    private SprPinZhi: DynamicImage = null;

    @property(cc.RichText)
    private LabProperty: cc.RichText = null;

    @property(ItemIcon)
    private icon: ItemIcon = null;

    public setItem(pinzhi: number, itemModel: ItemModel, curLv: number, maxLv: number, desc: string): void {
        this.SprPinZhi.loadImage(`/texture/com/font/com_font_quality_small_${pinzhi + 1}@ML`, 1, true);
        this.icon.setData(itemModel, { needNum: true });
        this.LabProgress.string = `${curLv}/${maxLv}`;
        this.progress.progress = curLv / maxLv;
        this.LabProperty.string = desc;
    }
}
