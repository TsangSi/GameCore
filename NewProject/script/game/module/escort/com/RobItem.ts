/*
 * @Author: kexd
 * @Date: 2023-01-16 21:35:06
 * @FilePath: \SanGuo\assets\script\game\module\escort\com\RobItem.ts
 * @Description: 拦截item
 *
 */

import { UtilColor } from '../../../../app/base/utils/UtilColor';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { TickTimer } from '../../../base/components/TickTimer';
import { UtilColorFull } from '../../../base/utils/UtilColorFull';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilItemList from '../../../base/utils/UtilItemList';
import { ItemQuality, ItemWhere } from '../../../com/item/ItemConst';
import ItemModel from '../../../com/item/ItemModel';
import ModelMgr from '../../../manager/ModelMgr';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { ICarMsg, ERobState } from '../EscortConst';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { EDailyPageType } from '../../daily/DailyConst';
import { BattleCommon } from '../../../battle/BattleCommon';
import { EMapFbInstanceType } from '../../../map/MapCfg';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { FuBenMgr } from '../../fuben/FuBenMgr';

const { ccclass, property } = cc._decorator;
@ccclass
export default class RobItem extends BaseCmp {
    // 和RobbedItem里一样
    @property(cc.Node)
    private BtnFight: cc.Node = null;
    @property(cc.Node)
    private NdReward: cc.Node = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabFv: cc.Label = null;

    // 下面是拦截里多的
    @property(DynamicImage)
    private SprBoard: DynamicImage = null;
    @property(cc.Label)
    private LabBoard: cc.Label = null;
    @property(TickTimer)
    private TickTime: TickTimer = null;

    private _carData: ICarMsg = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnFight, () => {
            // 是否可拦截
            const canRob = this._carData.canRob;
            if (canRob === ERobState.NoRobNum) {
                MsgToastMgr.Show(i18n.tt(Lang.escort_rob_no));
            } else if (canRob === ERobState.IsSelf) {
                MsgToastMgr.Show(i18n.tt(Lang.escort_rob_self));
            } else if (canRob === ERobState.OverTimes) {
                const robLimit = ModelMgr.I.EscortModel.getCfgValue('RobLimitTimes');
                MsgToastMgr.Show(UtilString.FormatArray(i18n.tt(Lang.escort_rob_twice), [robLimit]));
            } else if (canRob === ERobState.HaveRob) {
                MsgToastMgr.Show(i18n.tt(Lang.escort_rob_done));
                // 需同时将该镖车从列表剔除
                EventClient.I.emit(E.Escort.HaveRob, this._carData.carData.UserId);
            } else if (FuBenMgr.I.checkCanEnterFight(EMapFbInstanceType.YeWai, true)) {
                const tab: number = EDailyPageType.Escort; // DailyTabDataArr.findIndex((v) => v.TabId === EDailyPageType.Escort);
                WinMgr.I.setViewStashParam(ViewConst.DailyWin, [tab]);
                BattleCommon.I.enter(EBattleType.Escort_PVP, [1, this._carData.carData.UserId]);
            }
        }, this);
    }

    /**
     * 展示
     * @param car CarData
     */
    public setData(car: ICarMsg): void {
        const offy: number[] = [-18, -18, -18, -22, -22];
        const scale: number[] = [0.7, 0.6, 0.6, 0.5, 0.5];
        this._carData = car;
        const cfg: Cfg_Escort = car.cfgEscort;
        const carData = car.carData;
        // 是否可拦截
        UtilCocos.SetSpriteGray(this.BtnFight, car.canRob !== ERobState.CanRob, true);
        // 奖励
        const cfgEscort: Cfg_Escort = ModelMgr.I.EscortModel.CfgEscort.getValueByKey(carData.QualityId);
        const arr: ItemModel[] = ModelMgr.I.EscortModel.getReward(cfgEscort.Quality, carData.Level, carData.IsDoubleReward > 0, false, true);
        UtilItemList.ShowItemArr(this.NdReward, arr, { option: { where: ItemWhere.OTHER, needNum: true, numScale: 1.4 } });
        // 镖车
        this.SprBoard.loadImage(`texture/escort/img_yslc_${cfg.Img}`, 1, true);
        const index: number = cfg.Id - 1;
        this.SprBoard.node.y = offy[index] || -18;
        this.SprBoard.node.scale = scale[index] || 0.5;

        this.LabBoard.string = cfg.Name;
        UtilColorFull.resetMat(this.LabBoard);
        if (cfg.Quality === ItemQuality.COLORFUL) {
            UtilColorFull.setColorFull(this.LabBoard, false);
        } else {
            this.LabBoard.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(cfg.Quality, true));
        }
        // 玩家
        const info = car.info;
        this.LabName.string = info.getAreaNick(NickShowType.ArenaNick);
        this.LabFv.string = `${i18n.tt(Lang.com_txt_fv)} ${info.FightValue}`;
        // 倒计时
        const now = UtilTime.NowSec();
        if (now > carData.EndTime) {
            this.end();
        } else {
            const left = carData.EndTime - now;
            this.onTick(left);
            this.TickTime.removeEndEventHandler(this.node, 'RobItem', 'onTick');
            this.TickTime.addTickEventHandler(this.node, 'RobItem', 'onTick');
        }
    }

    private onTick(left: number): void {
        if (left > 3600) {
            this.TickTime.node.parent.active = true;
            this.TickTime.tick(left, '%HH:%mm:%ss', false, true);
        } else if (left > 0) {
            this.TickTime.node.parent.active = true;
            this.TickTime.tick(left, '%mm:%ss', true, true);
        } else {
            this.TickTime.node.parent.active = false;
            this.end();
        }
    }

    /** 倒计时到了的处理：要从显示列表里移除 */
    private end() {
        EventClient.I.emit(E.Escort.TimeOut);
    }
}
