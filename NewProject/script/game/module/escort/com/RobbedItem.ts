/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-constant-condition */
/*
 * @Author: kexd
 * @Date: 2023-01-16 20:42:41
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\com\RobbedItem.ts
 * @Description:
 *
 */

import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilItemList from '../../../base/utils/UtilItemList';
import { BattleCommon } from '../../../battle/BattleCommon';
import { ItemWhere } from '../../../com/item/ItemConst';
import ItemModel from '../../../com/item/ItemModel';
import ModelMgr from '../../../manager/ModelMgr';
import { EMapFbInstanceType } from '../../../map/MapCfg';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { FuBenMgr } from '../../fuben/FuBenMgr';
import { RoleInfo } from '../../role/RoleInfo';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;
@ccclass
export default class RobbedItem extends BaseCmp {
    @property(cc.Node)
    private BtnFight: cc.Node = null;
    @property(cc.Node)
    private NdReward: cc.Node = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabFv: cc.Label = null;

    private _robLog: EscortRobLog = null;
    private _roleInfo: RoleInfo = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnFight, () => {
            // 战力比对方小
            if (RoleMgr.I.info.FightValue < this._roleInfo.FightValue) {
                const str = UtilString.FormatArray(
                    i18n.tt(Lang.escort_robbed_tips),
                    [this._roleInfo.getAreaNick(NickShowType.ArenaNick)],
                );
                ModelMgr.I.MsgBoxModel.ShowBox(str, () => {
                    this.enterFight();// 进战斗
                });
            } else {
                // 进战斗
                this.enterFight();
            }
        }, this);
    }

    private enterFight() {
        if (FuBenMgr.I.checkCanEnterFight(EMapFbInstanceType.YeWai, true)) {
            BattleCommon.I.enter(EBattleType.Escort_PVP, [0, this._robLog.UserId, this._robLog.RobTime]);
        }
    }

    /**
     * 展示被劫记录
     * @param log EscortRobLog
     */
    public setData(log: EscortRobLog): void {
        this._robLog = log;
        this._roleInfo = new RoleInfo(log.UserShowInfo);
        this.LabName.string = this._roleInfo.getAreaNick(NickShowType.ArenaNick);
        this.LabFv.string = `${i18n.tt(Lang.com_txt_fv)} ${this._roleInfo.FightValue}`;

        // 奖励
        const arr: ItemModel[] = [];
        for (let i = 0; i < log.RewardInfo.length; i++) {
            const itemModel = UtilItem.NewItemModel(log.RewardInfo[i].ItemId, log.RewardInfo[i].ItemNum);
            arr.push(itemModel);
        }
        UtilItemList.ShowItemArr(this.NdReward, arr, { option: { where: ItemWhere.OTHER, needNum: true, numScale: 1.25 } });
    }
}
