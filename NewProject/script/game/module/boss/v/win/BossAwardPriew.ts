import { UtilString } from '../../../../../app/base/utils/UtilString';
import ListView from '../../../../base/components/listview/ListView';
import { Config } from '../../../../base/config/Config';
import UtilItem from '../../../../base/utils/UtilItem';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import ItemModel from '../../../../com/item/ItemModel';
import { WinCmp } from '../../../../com/win/WinCmp';

/*
 * @Author: wangxin
 * @Date: 2022-11-04 20:58:38
 * @FilePath: \SanGuo2.4\assets\script\game\module\boss\v\win\BossAwardPriew.ts
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class BossAwardPriew extends WinCmp {
    @property(ListView)
    private lsView: ListView = null;
    private itemModelList: ItemModel[] = [];
    private must: number[] = [];
    public init(param: unknown[]): void {
        super.init(param);
        const bossId = param[0] as number;
        const rank = param[1] as number;
        const indexer = Config.Get(Config.Type.Cfg_Boss_Multi);
        let itemStr: string = '';
        if (rank <= 5) {
            if (rank === 1) {
                itemStr = indexer.getValueByKey(bossId, 'Order1PrizeShow');
            }
            if (rank === 2) {
                itemStr = indexer.getValueByKey(bossId, 'Order2PrizeShow');
            }
            if (rank === 3) {
                itemStr = indexer.getValueByKey(bossId, 'Order3PrizeShow');
            }
            if (rank === 4) {
                itemStr = indexer.getValueByKey(bossId, 'Order4PrizeShow');
            }
            if (rank === 5) {
                itemStr = indexer.getValueByKey(bossId, 'Order5PrizeShow');
            }
        } else {
            itemStr = indexer.getValueByKey(bossId, 'ShowChallengPrize');
        }

        const itemModelList: ItemModel[] = [];
        const arr = itemStr.split('|');

        const pareItemStr = (strPath: string) => {
            const [itemId, itemNum, must] = strPath.split(':');
            return [Number(itemId), Number(itemNum), Number(must)];
        };
        for (let i = 0, len = arr.length; i < len; i++) {
            const item = arr[i];
            const [itemId, itemNum, must] = pareItemStr(item);
            const itemModel = UtilItem.NewItemModel(itemId, itemNum);
            itemModelList.push(itemModel);
            this.must.push(must);
        }
        this.itemModelList = itemModelList;
        this.lsView.setNumItems(this.itemModelList.length);
        this.lsView.updateAll();
    }

    public setList(item: cc.Node, idx: number): void {
        const _item: ItemIcon = item.getComponent(ItemIcon);
        _item.setData(this.itemModelList[idx], { needNum: true });
        UtilItem.addMark(_item.node, this.must[idx]);
    }
}
