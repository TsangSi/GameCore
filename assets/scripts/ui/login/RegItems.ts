import { Component, EditBox, Label, _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass
export default class RegItems extends Component {
    @property(Label)
    // label
    LabelStr: Label = null;
    @property(EditBox)
    // input
    Input: EditBox = null;
    onLoad () {

    }
    start () {

    }
    updateUi (params: { label: string, placeHolder: string, name: string, type: number, url: string }) {
        // 更新ui
        // const _self = this;
        this.Input.name = params.name;
        this.Input.placeholder = params.placeHolder || '';
        switch (params.type) {
            case 1:
                // 输入框类型为string
                this.Input.inputFlag = EditBox.InputFlag.DEFAULT;
                break;
            case 2:
                // 输入框类型为password
                this.Input.inputFlag = EditBox.InputFlag.PASSWORD;
                break;
            default:
                break;
        }
        this.LabelStr.string = params.label;
    }
    getInputValue (): Record<string, string> {
        // 获取input的值
        // const _self = this;
        return {
            key: this.Input.name,
            value: this.Input.string,
        };
    }
    hide () {
        this.node.destroy();
    }
}
