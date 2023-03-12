/*
 * @Author: lijun
 * @Date: 2023-02-14 14:17:47
 * @Description:
 */
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { FamilyAwardItem } from './FamilyAwardItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class FamilyAwardTip extends WinBase {
    @property(cc.Node)
    private NdSprMask: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    @property(ListView)
    private list: ListView = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => this.close(), this, { scale: 1 });
        UtilGame.Click(this.BtnClose, () => this.close(), this);
    }

    public init(params: any): void {
        this.list.setNumItems(4, 0);
        this.list.scrollTo(0);
    }

    private onScrollEvent(node: cc.Node, index: number): void { //
        const faitem: FamilyAwardItem = node.getComponent(FamilyAwardItem);
        faitem.setData(index + 1);
    }
}
