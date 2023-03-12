/*
 * @Author: hwx
 * @Date: 2022-06-17 14:19:25
 * @FilePath: \SanGuo\assets\script\game\com\tips\part\ItemTipsRandomItemsPart.ts
 * @Description: 道具Tips随机宝箱部件
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../item/ItemIcon';
import { BaseItemTipsPart } from './BaseItemTipsPart';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemTipsRandomItemsPart extends BaseItemTipsPart {
    @property(cc.ScrollView)
    private SvAwardItems: cc.ScrollView = null;

    /**
     * 刷新
     */
    public refresh(): void {
        const funcCfg = UtilItem.GetUseFuncById(this.itemModel.cfg.UseFunc);
        const dropItemModels = UtilItem.GetDropItemsById(funcCfg.Param1); // 掉落Id
        UtilCocos.LayoutFill(this.SvAwardItems.content, (item, index) => {
            const comp = item.getComponent(ItemIcon);
            if (comp) {
                comp.setData(dropItemModels[index], { needName: true, needNum: true, isDarkBg: true });
            }
        }, dropItemModels.length);
    }
}
