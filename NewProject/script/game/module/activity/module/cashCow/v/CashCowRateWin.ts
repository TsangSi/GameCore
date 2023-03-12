/*
 * @Author: myl
 * @Date: 2022-12-26 10:09:56
 * @Description:
 */

import { i18n, Lang } from '../../../../../../i18n/i18n';
import ListView from '../../../../../base/components/listview/ListView';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import WinBase from '../../../../../com/win/WinBase';
import ModelMgr from '../../../../../manager/ModelMgr';
import CashCowRateItem from './CashCowRateItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CashCowRateWin extends WinBase {
    @property(ListView)
    private list: ListView = null;

    @property(cc.Label)
    private LabTitle: cc.Label = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;

    private rateCfg: string[] = [];
    private Leve = 1;
    public init(...param: unknown[]): void {
        if (param && param[0]) {
            this.Leve = Number(param[0]);
        }
        const cfg: Cfg_Server_CashCow = ModelMgr.I.CashCowModel.getCashCowCfg(this.Leve);
        if (cfg) {
            this.rateCfg = cfg.Time.split('|');
        }
        this.list.setNumItems(this.rateCfg.length);

        this.LabTitle.string = `${this.Leve}${i18n.lv}${i18n.tt(Lang.general_titleRandom)}`;

        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);
    }

    private scrollEvent(nd: cc.Node, index: number): void {
        const rate = this.rateCfg[index];
        const item = nd.getComponent(CashCowRateItem);
        item.setData(rate, index);
    }
}
