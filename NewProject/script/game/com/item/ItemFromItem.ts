/*
 * @Author: myl
 * @Date: 2022-11-05 12:07:09
 * @Description:
 */

import { DynamicImage } from '../../base/components/DynamicImage';
import { UtilGame } from '../../base/utils/UtilGame';
import { RES_ENUM } from '../../const/ResPath';
import { Link } from '../../module/link/Link';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemFromItem extends cc.Component {
    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(DynamicImage)
    private icon: DynamicImage = null;

    private _data: Cfg_ItemSource = null;

    protected start(): void {
        UtilGame.Click(this.node, () => {
            Link.To(this._data.FuncId);
        }, this);
    }

    public setData(data: Cfg_ItemSource): void {
        this._data = data;
        this.LabName.string = data.Desc;
        this.icon.loadImage(`${RES_ENUM.Com_ItemSource}${data.Icon}`, 1, true);
    }
}
