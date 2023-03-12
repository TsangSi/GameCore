
const { ccclass, property } = cc._decorator;

@ccclass
export class GmLabelItem extends cc.Component {
    @property(cc.Label)
    private lb: cc.Label = null;
    @property(cc.Label)
    private lb1: cc.Label = null;
    public setData(str: string, str1): void {
        this.lb.string = str;
        this.lb1.string = str1;
    }
}
