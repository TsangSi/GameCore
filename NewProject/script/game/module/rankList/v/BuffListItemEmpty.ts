import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
/*
 * @Author: zs
 * @Date: 2023-02-15 21:44:55
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class BuffListItemEmpty extends BaseCmp {
    @property(cc.Label)
    private LabelName: cc.Label = null;
    public setData(str: string): void {
        this.LabelName.string = str;
    }
}
