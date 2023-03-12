/*
 * @Author: zs
 * @Date: 2022-12-01 18:05:27
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\v\CollectionBookRw.ts
 * @Description:
 *
 */
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItemList from '../../../base/utils/UtilItemList';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectionBookRw extends BaseUiView {
    @property(cc.Node)
    private content: cc.Node = null;
    @property(cc.Node)
    private NodeTips: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    /**
     *
     * @param param [itemStr: string, isShowTips: true]
     */
    public init(param: any[]): void {
        // this.NodeTips.active = param[1] !== false;
        UtilItemList.ShowItems(this.content, param[0], { option: { needNum: true } }, (err, node) => {
            console.log(err, node);
        });
        UtilGame.Click(this.node, 'SprBlack', this.close, this, { scale: 1.0 });
        UtilGame.Click(this.BtnClose, this.close, this);
    }
}
