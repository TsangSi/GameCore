/*
 * @Author: myl
 * @Date: 2023-01-17 18:51:11
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BattleSettlePartCfg, BattleType } from '../BattleResultConst';
import { BattleRewardExBase } from './ex/BattleRewardExBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleSettleWin extends WinBase {
    @property(DynamicImage)
    private SprTitle: DynamicImage = null;
    @property(DynamicImage)
    private SprBg: DynamicImage = null;
    @property(DynamicImage)
    private SprTitleBg: DynamicImage = null;

    @property(cc.Label)
    private TipLabel: cc.Label = null;

    @property(cc.Node)
    private NdNull: cc.Node = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;
    /** 关闭倒计时cd */
    private _closeCd = 5;
    private _closeTip: string = null;
    private _data: S2CPrizeReport = null;

    protected start(): void {
        super.start();
        ModelMgr.I.BattleResultModel.setIsShowing(true);
        // [3]
        UtilGame.Click(this.node, () => {
            this.onClose();
        }, this, { scale: 1 });

        UtilGame.Click(this.BtnClose, () => {
            this.onClose();
        }, this);

        this.updateCd();
    }
    public changeCloseTips(flag: boolean): void {
        this._closeTip = flag ? i18n.tt(Lang.com_close_tips) : i18n.tt(Lang.com_receive);
        this.TipLabel.string = `${this._closeTip}${this._closeCd}${i18n.tt(Lang.com_second)}`;
    }

    public init(d: S2CPrizeReport[]): void {
        super.init(d);
        this._data = d[0];
        this.setUIState(this._data);
    }

    /** 配置界面参数
     *  3个路径（路径处理）
     */
    public setUIState(data: S2CPrizeReport): void {
        const path = RES_ENUM.BattleResult;
        this._data = data;
        const {
            t, b, tb, part,
        } = ModelMgr.I.BattleResultModel.getWinImages(this._data);

        this.SprTitle.loadImage(`${path}${t}`, 1, true);
        this.SprBg.loadImage(`${path}${b}`, 1, true, 'resources', true);
        this.SprTitleBg.loadImage(`${path}${tb}`, 1, true);
        this.changeCloseTips(this._data.Type === BattleType.Fail || this._data.Items.length === 0);

        this.addParts(part);
    }

    private _timer = null;

    protected onDestroy(): void {
        super.onDestroy();
        if (this._timer) {
            this.clearInterval(this._timer);
            this._timer = null;
        }
        if (!CC_EDITOR) {
            ControllerMgr.I.BattleResultController.reqC2SGetBattlePrize();
            const isFast = this._closeCd >= 4;
            setTimeout(() => {
                EventClient.I.emit(E.BattleResult.SettleCloseView);
            }, isFast ? 100 : 0);

            ModelMgr.I.BattleResultModel.setIsShowing(false);
        }
    }

    private updateCd() {
        if (this._timer) {
            this.clearInterval(this._timer);
            this._timer = null;
        }
        this._timer = this.setInterval(() => {
            this._closeCd--;
            this.TipLabel.string = `${this._closeTip}${this._closeCd}${i18n.tt(Lang.com_second)}`;
            if (this._closeCd < 1) {
                this.onClose();
            }
        }, 1000);
    }

    /** 加载颗粒 */
    private addParts(partString: string): void {
        if (partString === null || partString.length <= 0) return;
        const parts = partString.split('|');
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const partPath = BattleSettlePartCfg[part];
            ResMgr.I.showPrefab(partPath, this.SprBg.node, (err, nd: cc.Node) => {
                // 加载颗粒
                const comp = nd.getComponent(BattleRewardExBase);
                comp.setData(this._data);
                comp.setCallBack(null);
                comp.setCloseCall(this.onClose);
                nd.zIndex = i + 1;
            });
        }
        this.scheduleOnce(() => {
            /** 添加空节点撑大内容节点 */
            if (parts.length === 1 && this.SprBg.node.childrenCount === 1) {
                this.NdNull.parent = this.SprBg.node;
                this.NdNull.zIndex = parts.length + 1;
            } else {
                this.NdNull.parent = null;
            }
        });
    }

    private onClose() {
        WinMgr.I.close(ViewConst.BattleSettleWin);
        EventClient.I.emit(E.BattleResult.CloseView);
    }
}
