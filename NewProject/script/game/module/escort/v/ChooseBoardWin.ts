/*
 * @Author: kexd
 * @Date: 2023-01-17 10:07:00
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\v\ChooseBoardWin.ts
 * @Description: 选择镖车
 *
 */

import WinMgr from '../../../../app/core/mvc/WinMgr';
import ListView from '../../../base/components/listview/ListView';
import { WinCmp } from '../../../com/win/WinCmp';
import { ViewConst } from '../../../const/ViewConst';
import ChooseBoardItem from '../com/ChooseBoardItem';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import ControllerMgr from '../../../manager/ControllerMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RoleMgr } from '../../role/RoleMgr';
import ModelMgr from '../../../manager/ModelMgr';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import UtilItem from '../../../base/utils/UtilItem';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { EscortModel } from '../EscortModel';
import { StorageMgr } from '../../../../app/base/manager/StorageMgr';
import { UtilShop } from '../../shop/UtilShop';
import { BagItemChangeInfo } from '../../bag/BagConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChooseBoardWin extends WinCmp {
    @property(ListView)
    private ListView: ListView = null;

    @property(DynamicImage)
    private SprCurrency: DynamicImage = null;
    @property(DynamicImage)
    private SprCurrency2: DynamicImage = null;
    @property(cc.Label)
    private LabRefresh: cc.Label = null;
    @property(cc.Label)
    private LabOnekey: cc.Label = null;
    @property(cc.Label)
    private LabLing: cc.Label = null;

    @property(cc.Node)
    private BtnRefresh: cc.Node = null;
    @property(cc.Node)
    private BtnOnekey: cc.Node = null;
    @property(cc.Node)
    private BtnStart: cc.Node = null;
    @property(cc.Toggle)
    private TogUse: cc.Toggle = null;
    @property(cc.Node)
    private NdRed: cc.Node = null;
    @property(cc.Node)
    private NdDouble: cc.Node = null;

    private _M: EscortModel = null;
    private _higestQualityId: number = 0;
    private _cfgEscort: Cfg_Escort[] = [];
    private _lingId: number = 0;
    private _lingNeed: number = 0;
    private _isDoubleLast: boolean = null;

    protected onLoad(): void {
        super.onLoad();
        if (!this._M) {
            this._M = ModelMgr.I.EscortModel;
        }
    }

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
        const isCheck = StorageMgr.I.getValue('EscortTog', 0) > 0;
        // console.log('isCheck=', isCheck);
        if (isCheck) {
            this.TogUse.check();
        } else {
            this.TogUse.uncheck();
        }
        // this.TogUse.isChecked = isCheck;
        this.uptUI();
    }

    public init(args: unknown[]): void {
        if (!this._M) {
            this._M = ModelMgr.I.EscortModel;
        }
    }

    private addE() {
        EventClient.I.on(E.Escort.RefreshQuality, this.refreshQuality, this);
        EventClient.I.on(E.Bag.ItemChange, this.onBagChange, this);
    }

    private remE() {
        EventClient.I.off(E.Escort.RefreshQuality, this.refreshQuality, this);
        EventClient.I.off(E.Bag.ItemChange, this.onBagChange, this);
    }

    private clk() {
        UtilGame.Click(this.BtnStart, () => {
            // 判断次数
            const times = this._M.leftEscortNum;
            if (times <= 0) {
                MsgToastMgr.Show(i18n.tt(Lang.escort_no_times));
                return;
            }
            // 品质是否低于4
            const curQualityId = this._M.qualityId;
            const cfg: Cfg_Escort = this._M.CfgEscort.getValueByKey(curQualityId);
            const curQuality = cfg.Quality;
            if (curQuality <= 4) {
                ModelMgr.I.MsgBoxModel.ShowBox(i18n.tt(Lang.escort_low), () => {
                    this.sendStart();
                }, { showToggle: 'chooseBoard', tipTogState: false });
            } else if (!this.TogUse.isChecked) {
                ModelMgr.I.MsgBoxModel.ShowBox(i18n.tt(Lang.escort_gou), () => {
                    this.sendStart();
                }, { showToggle: 'chooseBoard2', tipTogState: false });
            } else {
                this.sendStart();
            }
        }, this);

        UtilGame.Click(this.BtnRefresh, () => {
            // 是否已是最高品质
            if (this.isHigest()) {
                MsgToastMgr.Show(i18n.tt(Lang.escort_higest));
                return;
            }
            // 元宝是否够
            const cost = this._M.getCfgValue('NormalRefresh');
            const arr = cost.split(':');
            const id: number = +arr[0];
            const need: number = +arr[1];
            const have: number = RoleMgr.I.getCurrencyById(id);

            if (have >= need) {
                ControllerMgr.I.EscortController.reqEscortRefreshCar(1);
            } else {
                MsgToastMgr.Show(`${UtilItem.GetCfgByItemId(id).Name}${i18n.tt(Lang.not_enough)}`);
                WinMgr.I.open(ViewConst.ItemSourceWin, id);
            }
        }, this);

        UtilGame.Click(this.BtnOnekey, () => {
            // 是否已是最高品质
            if (this.isHigest()) {
                MsgToastMgr.Show(i18n.tt(Lang.escort_higest));
                return;
            }
            // 玉璧是否够
            const cost = this._M.getCfgValue('GoldRefresh');
            const arr = cost.split(':');
            const id: number = +arr[0];
            const need: number = +arr[1];
            const have: number = RoleMgr.I.getCurrencyById(id);

            if (have >= need) {
                ControllerMgr.I.EscortController.reqEscortRefreshCar(2);
            } else {
                MsgToastMgr.Show(`${UtilItem.GetCfgByItemId(id).Name}${i18n.tt(Lang.not_enough)}`);
                WinMgr.I.open(ViewConst.ItemSourceWin, id);
            }
        }, this);

        UtilGame.Click(this.TogUse.node, () => {
            this.scheduleOnce(() => {
                if (this.node && this.node.isValid) {
                    // 红点
                    const have = BagMgr.I.getItemNum(this._lingId);
                    this.NdRed.active = have >= this._lingNeed && !this.TogUse.isChecked;
                    // 奖励
                    this.uptReward();

                    StorageMgr.I.setValue('EscortTog', this.TogUse.isChecked ? 1 : 0);
                }
            }, 0.1);
        }, this);
    }

    private sendStart() {
        // 是否有护送令
        if (this.TogUse.isChecked) {
            if (UtilShop.itemIsEnough(this._lingId, 1, false, true)) {
                ControllerMgr.I.EscortController.reqEscortCarStart(1, 1);
                this.onClose();
            } else {
                MsgToastMgr.Show(`${UtilItem.GetCfgByItemId(this._lingId).Name}${i18n.tt(Lang.not_enough)}`);
            }
        } else {
            ControllerMgr.I.EscortController.reqEscortCarStart(0, 0);
            this.onClose();
        }
    }

    private onBagChange(changes: BagItemChangeInfo[]) {
        let check: boolean = false;
        if (changes) {
            for (let i = 0; i < changes.length; i++) {
                if (changes[i].itemModel && changes[i].itemModel.cfg
                    && changes[i].itemModel.cfg.Id === this._lingId) {
                    check = true;
                    break;
                }
            }
        }
        if (check) {
            this.uptUI();
        }
    }

    /** 是否是最高品质 */
    private isHigest(): boolean {
        const curQualityId = this._M.qualityId;
        return curQualityId >= this._higestQualityId;
    }

    private refreshQuality() {
        this.ListView.setNumItems(this._cfgEscort.length);
    }

    private uptUI() {
        this._isDoubleLast = this._M.isInDoubleTime();
        this._cfgEscort = [];
        const indexer: ConfigIndexer = this._M.CfgEscort;
        const keys = indexer.getKeys();
        for (let i = 0; i < keys.length; i++) {
            const cfg: Cfg_Escort = indexer.getValueByKey(keys[i]);
            this._cfgEscort.push(cfg);
            //
            if (this._higestQualityId < cfg.Id) {
                this._higestQualityId = cfg.Id;
            }
        }
        this.ListView.setNumItems(this._cfgEscort.length);
        // 元宝刷新
        const cost = this._M.getCfgValue('NormalRefresh');
        const arr = cost.split(':');
        const id = +arr[0];
        const need = +arr[1];
        const costImgUrl: string = UtilCurrency.getIconByCurrencyType(id);
        this.SprCurrency.loadImage(costImgUrl, 1, true);
        this.LabRefresh.string = `${need}`;
        // 一键刷新
        const one_cost = this._M.getCfgValue('GoldRefresh');
        const one_arr = one_cost.split(':');
        const one_id = +one_arr[0];
        const one_need = +one_arr[1];
        const one_costImgUrl: string = UtilCurrency.getIconByCurrencyType(one_id);
        this.SprCurrency2.loadImage(one_costImgUrl, 1, true);
        this.LabOnekey.string = `${one_need}`;
        // 护送令
        const ling = this._M.getCfgValue('ProtectCost');
        const larr = ling.split(':');
        this._lingId = +larr[0];
        this._lingNeed = +larr[1];
        const have = BagMgr.I.getItemNum(this._lingId);
        this.LabLing.string = `${have}`;
        const color: cc.Color = have > 0 ? UtilColor.Hex2Rgba(UtilColor.NorN) : UtilColor.Hex2Rgba(UtilColor.RedV);
        this.LabLing.node.color = color;
        // 双倍
        this.uptDouble();
        // 红点
        this.NdRed.active = have >= this._lingNeed && !this.TogUse.isChecked;
    }

    protected updatePerSecond(): void {
        if (this.node && this.node.isValid && this._cfgEscort.length > 0) {
            this.uptDouble();
        }
    }

    /** 双倍标签 */
    private uptDouble() {
        const isDoubelTime: boolean = this._M.isInDoubleTime();
        this.NdDouble.active = isDoubelTime;
        if (this._isDoubleLast !== isDoubelTime) {
            this._isDoubleLast = isDoubelTime;
            this.uptReward();
            // this.ListView.setNumItems(this._cfgEscort.length);
        }
    }

    private uptReward() {
        this.ListView.content.children.forEach((n) => {
            if (n && n.isValid) {
                n.getComponent(ChooseBoardItem)?.uptReward(this._isDoubleLast, this.TogUse.isChecked);
            }
        });
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const item = node.getComponent(ChooseBoardItem);
        if (item) {
            item.getComponent(ChooseBoardItem).setData(this._cfgEscort[idx], this._isDoubleLast, this.TogUse.isChecked);
        }
    }

    private onClose() {
        WinMgr.I.close(ViewConst.ChooseBoardWin);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
