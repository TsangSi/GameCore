/*
 * @Author: kexd
 * @Date: 2022-11-07 18:31:30
 * @FilePath: \SanGuo2.4\assets\script\game\module\beaconWar\com\BeaconRelive.ts
 * @Description: 烽火-复活
 *
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import Progress from '../../../base/components/Progress';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleInfo } from '../../role/RoleInfo';
import ControllerMgr from '../../../manager/ControllerMgr';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { BagMgr } from '../../bag/BagMgr';
import UtilItem from '../../../base/utils/UtilItem';
import UtilHead from '../../../base/utils/UtilHead';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { UtilNum } from '../../../../app/base/utils/UtilNum';

const { ccclass, property } = cc._decorator;
@ccclass
export default class BeaconRelive extends BaseCmp {
    // 被其他玩家击杀才会出现的信息
    @property(cc.Node)
    private NdOpp: cc.Node = null;
    @property(cc.Sprite)
    private SprHead: cc.Sprite = null;
    @property(cc.Sprite)
    private SprHeadBg: cc.Sprite = null;
    @property(cc.Label)
    private LabDamage: cc.Label = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabPower: cc.Label = null;
    @property(Progress)
    private ProgressHp: Progress = null;
    @property(cc.ProgressBar)
    private ProgressTime: Progress = null;

    // 复活节点
    @property(cc.Label)
    private LabCd: cc.Label = null;
    @property(DynamicImage)
    private SprCurrency: DynamicImage = null;
    @property(cc.Label)
    private LabCost: cc.Label = null;
    @property(cc.Node)
    private BtnRelive: cc.Node = null;

    private _cd: number = 0;
    private _totalCd: number = 0;
    private _costId: number = 0;
    private _costNeed: number = 0;
    private _killByUserId: number = 0;

    protected onLoad(): void {
        super.onLoad();
    }

    protected start(): void {
        super.start();
        this.addE();

        UtilGame.Click(this.BtnRelive, () => {
            const have = BagMgr.I.getItemNum(this._costId);
            if (have < this._costNeed) {
                MsgToastMgr.Show(`${UtilItem.GetCfgByItemId(this._costId).Name}${i18n.tt(Lang.not_enough)}`);
                WinMgr.I.open(ViewConst.ItemSourceWin, this._costId);
            } else {
                ControllerMgr.I.BeaconWarController.reqBossHomeRelive();
            }
        }, this);
    }

    private addE() {
        EventClient.I.on(E.BeaconWar.UptPlayerData, this.uptPlayerMsg, this);
        EventClient.I.on(E.BeaconWar.PlayerHp, this.uptPlayerMsg, this);
    }

    private remE() {
        EventClient.I.off(E.BeaconWar.UptPlayerData, this.uptPlayerMsg, this);
        EventClient.I.off(E.BeaconWar.PlayerHp, this.uptPlayerMsg, this);
    }

    /** 被boss打死的 */
    public killedByBoss(cd: number): void {
        this._totalCd = cd;
        this._cd = cd;
        this.node.active = true;
        this.uptCdUI();
        this.NdOpp.active = false;
    }

    public end(): void {
        this.node.active = false;
    }

    /** 被其他玩家打死的 */
    public killedByOtherPlayer(cd: number, userId: number): void {
        this._totalCd = cd;
        this._cd = cd;
        this._killByUserId = userId;
        this.node.active = true;
        this.uptCdUI();
        this.NdOpp.active = true;
        const d: RoleInfo = ModelMgr.I.BeaconWarModel.playerInfo(userId, true);
        if (d) {
            this.uptPlayerMsg();
        }
    }

    private uptCdUI() {
        this.LabCd.string = `${this._cd}`;
        this.uptCd();
        // 消耗
        const cost = ModelMgr.I.BeaconWarModel.getReliveCost();
        this._costId = cost.id;
        this._costNeed = cost.need;
        const costImgUrl: string = UtilCurrency.getIconByCurrencyType(this._costId);
        this.SprCurrency.loadImage(costImgUrl, 1, true);
        this.LabCost.string = `${this._costNeed}`;
    }

    private uptCd() {
        if (this._cd > 0) {
            this.unschedule(this._cdUpdate);
            this.schedule(this._cdUpdate, 1);
        } else {
            this.node.active = false;
        }
    }

    private _cdUpdate() {
        if (this._cd > 0) {
            this._cd--;
        } else {
            this.node.active = false;
        }
        this.LabCd.string = `${this._cd}`;
        this.ProgressTime.updateProgress(this._cd, this._totalCd, false);
    }

    private uptPlayerMsg() {
        // 对手信息是否存在
        const info: RoleInfo = ModelMgr.I.BeaconWarModel.playerInfo(this._killByUserId, false);
        if (info) {
            UtilHead.setHead(info.d.HeadIcon, this.SprHead, info.d.HeadFrame, this.SprHeadBg);
            // console.log('info.d.FCurrHp, info.d.FMaxHp=', info.d.FCurrHp, info.d.FMaxHp);
            this.LabName.string = info.getAreaNick(NickShowType.Nick);
            this.ProgressHp.updateProgress(info.d.FCurrHp, info.d.FMaxHp, true);
            this.LabPower.string = `${UtilNum.ConvertFightValue(info.d.FightValue)}`;
            // 伤害
            const damage = ModelMgr.I.BeaconWarModel.getPlayerDamage(this._killByUserId);
            this.LabDamage.string = `${damage}`;
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
