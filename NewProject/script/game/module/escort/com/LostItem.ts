import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilItem from '../../../base/utils/UtilItem';
/*
 * @Author: kexd
 * @Date: 2023-02-01 14:07:51
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\com\LostItem.ts
 * @Description:
 *
 */

const { ccclass, property } = cc._decorator;
@ccclass
export default class LostItem extends BaseCmp {
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Label)
    private LabName: cc.Label = null;

    protected start(): void {
        super.start();
    }

    public setData(itemId: number, itemNum: number): void {
        const itemCfg = UtilItem.GetCfgByItemId(itemId);
        this.SprIcon.loadImage(UtilItem.GetItemIconPath(itemCfg.PicID), 1, true);
        this.LabName.string = `${UtilNum.Convert(itemNum)}`;
    }
}
