/*
 * @Author: zs
 * @Date: 2022-12-01 18:05:12
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\v\CollectionBookCareer.ts
 * @Description: 博物志-生涯
 *
 */
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import CollectionBookCareerItem from '../com/CollectionBookCareerItem';
import CollectionBookPageBase from './CollectionBookPageBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectionBookCareer extends CollectionBookPageBase {
    public init(winId: number, param: any[], tabIdx?: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        this.refreshPage(winId, param, tabIdx, tabId);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        this.subType = this.cfgBook.getSubTypesByClass(tabId)[0] || 101;
        super.refreshPage(winId, param, tabIdx, tabId);
    }

    protected start(): void {
        super.start();
        this.showItems();
        this.onUpdateScore(false);
        RoleMgr.I.on(this.onUpdateScore, this, RoleAN.N.Stage);
    }

    private onRenderItem(node: cc.Node, index: number) {
        node.getComponent(CollectionBookCareerItem).setData(this.getShowIndex(index));
    }
}
