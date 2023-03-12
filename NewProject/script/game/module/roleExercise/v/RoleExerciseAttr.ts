// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilAttr } from '../../../base/utils/UtilAttr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleExerciseAttr extends cc.Component {
    @property(DynamicImage)
    private NdIcon: DynamicImage = null;

    @property(cc.Label)
    private LabKey: cc.Label = null;

    @property(cc.Label)
    private LabVal: cc.Label = null;

    public setAttr(
        type: number,
        name: string,
        value: string,
    ): void {
        this.NdIcon.loadImage(UtilAttr.getIconByAttrType(type), 1, true);
        this.LabKey.string = `${name}:`;
        this.LabVal.string = `+${value}`;
    }
}
