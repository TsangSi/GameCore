/*
 * @Author: myl
 * @Date: 2022-08-16 22:22:54
 * @Description:
 */
/** import {' cc._decorator, cc.Node } 'from 'cc';  // */
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinCmp } from '../../../com/win/WinCmp';
import ModelMgr from '../../../manager/ModelMgr';
import { FuncAddState } from '../VipConst';
import { VipContentItem } from './VipContentItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class VipContentTipWin extends WinCmp {
    @property(ListView)
    private list: ListView = null;

    @property(cc.Node)
    private closeBtn: cc.Node = null;

    private _dataSource: { funcState: FuncAddState, desc: string }[] = [];
    protected start(): void {
        super.start();
        UtilGame.Click(this.closeBtn, () => {
            this.close();
        }, this);
    }

    public init(param: any[]): void {
        if (param && param[0]) {
            this._dataSource = ModelMgr.I.VipModel.addFunc(parseInt(param[0]), true);
            this.list.setNumItems(this._dataSource.length);
        }
        this.resetTitle(UtilString.FormatArray(i18n.tt(Lang.vip_funcs), [ModelMgr.I.VipModel.vipName(parseInt(param[0]))]));
    }

    private scrollEvent(nd: cc.Node, index: number) {
        const contentItem = nd.getComponent(VipContentItem);
        contentItem.setData(this._dataSource[index]);
    }
}
