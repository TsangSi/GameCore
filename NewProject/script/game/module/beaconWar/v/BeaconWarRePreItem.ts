/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: dcj
 * @Date: 2022-08-31 11:06:45
 * @FilePath: \SanGuo2.4\assets\script\game\module\beaconWar\v\BeaconWarRePreItem.ts
 * @Description:
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import UtilItem from '../../../base/utils/UtilItem';
import UtilItemList from '../../../base/utils/UtilItemList';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class BeaconWarRePreItem extends cc.Component {
    @property(cc.ScrollView)
    private scroll: cc.ScrollView = null;
    @property(cc.Node)
    private NdRe: cc.Node = null;

    protected start(): void {
        //
    }

    public setData(data: string[], idx: number): void {
        this.NdRe.active = idx <= 4;
        this.scroll.node.active = idx > 4;
        const list = UtilItem.ParseAwardItems(data[idx]);
        const _spilt = data[idx].split('|');
        if (list.length <= 4) {
            UtilItemList.ShowItems(this.NdRe, data[idx], { option: { needNum: true } }, (item: cc.Node, i: number) => {
                const itemIcon = item.getComponent(ItemIcon);
                this.changeMask(itemIcon, _spilt, idx, i);
            });
        } else {
            UtilItemList.ShowItems(this.scroll.content, data[idx], { option: { needNum: true } }, (item: cc.Node, i: number) => {
                const itemIcon = item.getComponent(ItemIcon);
                this.changeMask(itemIcon, _spilt, idx, i);
            });
        }
    }

    private changeMask(item: ItemIcon, _spilt: string[], idx: number, i: number) {
        const itemMark = item.node?.getChildByName('itemMark');
        if (itemMark) {
            const itemStr = _spilt[i];
            const itemD = itemStr.split(':');
            const markType = itemD[2] ? parseInt(itemD[2]) : 0;
            if (+markType === 1) {
                const markSrc = RES_ENUM.Com_Font_Com_Font_Gailvjiaobiao;
                UtilCocos.LoadSpriteFrame(itemMark.getComponent(cc.Sprite), markSrc);
                itemMark.setPosition(-17, 17, 0);
            }
        }
    }

    protected onDestroy(): void {
        //
    }
}
