import { UtilColor } from '../../../../app/base/utils/UtilColor';

/*
 * @Author: dcj
 * @Date: 2022-10-26 10:16:05
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\equip\v\ToggleBtnItem.ts
 * @Description:
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class ToggleBtnItem extends cc.Component {
    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.Node)
    private NdSelect: cc.Node = null;
    @property(cc.Node)
    private LabFlag: cc.Node = null;

    /** 设置按钮名称 */
    public setName(nameStr: string): void {
        this.LabName.string = nameStr;
    }

    /** 每个按钮都有一个index */
    public _toggleIdx;
    public setIndex(index: number): void {
        this._toggleIdx = index;
    }

    /** 初始按钮的选中状态 */
    public initCheckState(bol: boolean): void {
        this.LabName.node.y = bol ? 0 : 10;
        this.LabName.node.color = bol ? UtilColor.Hex2Rgba('#da912a') : UtilColor.Hex2Rgba('#906745');
        this.NdSelect.active = bol;
    }

    public setFlagState(bol: boolean): void {
        this.LabFlag.active = bol;
    }

    // public checked(): void {
    //     this._checked = !this._checked;
    //     this.NdSelect.active = this._checked;
    // }
}
