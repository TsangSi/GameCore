/*
 * @Author: myl
 * @Date: 2022-10-21 11:33:59
 * @Description:
 *
 */

import { i18n, Lang } from '../../../../i18n/i18n';

const { ccclass, property } = cc._decorator;

@ccclass
export class AttrDetailItem extends cc.Component {
    @property(cc.Label)
    private titLab: cc.Label = null;
    @property(cc.RichText)
    private contLab: cc.RichText = null;

    public setData(data: { title: string, data: string }): void {
        this.titLab.string = data.title;
        this.contLab.string = data.data.length > 0 ? data.data : i18n.tt(Lang.com_null);
    }
}
