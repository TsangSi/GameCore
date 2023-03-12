// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventClient } from '../../../../app/base/event/EventClient';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilItem from '../../../base/utils/UtilItem';
import { E } from '../../../const/EventName';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemGemTip extends cc.Component {
    @property(DynamicImage)
    private SpIcon: DynamicImage = null;

    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.RichText)
    private LabDesc: cc.RichText = null;

    private centerIcon() {
        //
    }

    public setData(picId: string, name: string, desc: string, layout: cc.Node): void {
        this.SpIcon.loadImage(UtilItem.GetItemIconPath(picId), 1, false, 'resources', false, () => {
            const nd = this.SpIcon.node;
            const scale = 40 / Math.max(nd.width, nd.height);
            nd.scale = scale;
            if (layout) layout.getComponent(cc.Layout).updateLayout();
            EventClient.I.emit(E.Game.ItemTipChangeSize);
            this.scheduleOnce(this.centerIcon.bind(this));
        });
        this.LabName.string = name;
        this.LabDesc.string = desc;
        this.scheduleOnce(this.centerIcon.bind(this));
    }
}
