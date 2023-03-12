import BaseCmp from '../../app/core/mvc/view/BaseCmp';

/*
 * @Author: zs
 * @Date: 2023-02-15 21:44:55
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class SmallTitle extends BaseCmp {
    @property(cc.Label)
    private LabelTitle: cc.Label = null;

    public setData(str: string): void {
        this.LabelTitle.string = str;
    }
}
