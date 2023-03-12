/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-06-23 20:47:14
 * @FilePath: \SanGuo2.4\assets\script\game\module\boss\v\PersonalItem.ts
 * @Description: 个人首领 （至尊首领）item项
 */
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../../../base/utils/UtilGame';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import UtilItemList from '../../../base/utils/UtilItemList';
import { Config } from '../../../base/config/Config';
import { IPersonal } from './PersonalPage';
import { AssetType } from '../../../../app/core/res/ResConst';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { i18n, Lang } from '../../../../i18n/i18n';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { FuBenMgr } from '../../fuben/FuBenMgr';
import { EMapFbInstanceType } from '../../../map/MapCfg';
import { GuideMgr } from '../../../com/guide/GuideMgr';
import { GuideBtnIds } from '../../../com/guide/GuideConst';
import { RolePageType } from '../../role/RoleConst';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { BattleCommon } from '../../../battle/BattleCommon';
import { RES_ENUM } from '../../../const/ResPath';
import { BossPageType, LocalBossPageType } from '../BossConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class PersonalItem extends BaseCmp {
    /** 头像 */
    @property(cc.Sprite)
    private SpIcon: cc.Sprite = null;
    @property(cc.Node)
    private NdHeadBg: cc.Node = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Node)
    private NdLock: cc.Node = null;

    @property(cc.Node)
    private NdPrize: cc.Node = null;
    @property(cc.Label)
    private LabUnlock: cc.Label = null;
    @property(cc.Label)
    private LabTimes: cc.Label = null;
    @property(cc.Node)
    private BtnFight: cc.Node = null;
    @property(cc.Node)
    private NdRed: cc.Node = null;

    /** 个人首领（至尊首领）数据 */
    private _personalData: IPersonal = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.BtnFight, () => {
            if (this._personalData.IsPersonal) {
                if (this._personalData.LeftTimes > 0) {
                    if (FuBenMgr.I.checkCanEnterFight(EMapFbInstanceType.YeWai, true)) {
                        WinMgr.I.setViewStashParam(ViewConst.BossWin, [BossPageType.Local, LocalBossPageType.Personal]);
                        // ControllerMgr.I.BossController.reqC2SPersonalFight(this._personalData.Id);
                        BattleCommon.I.enter(EBattleType.PersonBoss, this._personalData.Id);
                    }
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.boss_personal_fight));
                }
            } else if (this._personalData.LeftTimes > 0) {
                if (FuBenMgr.I.checkCanEnterFight(EMapFbInstanceType.YeWai, true)) {
                    WinMgr.I.setViewStashParam(ViewConst.BossWin, [BossPageType.Local, LocalBossPageType.Vip]);
                    // ControllerMgr.I.BossController.reqC2SVipFight(this._personalData.Id);
                    BattleCommon.I.enter(EBattleType.ZhiZunBoss, this._personalData.Id);
                }
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.boss_vip_fight));
            }
        }, this);

        UtilGame.Click(this.LabUnlock.node, () => {
            if (this._personalData.IsPersonal) {
                if (this._personalData.CfgPersonal.ExtCond) {
                    // if (Game.I.nocharge && Game.I.platform == PlatformEnum.weGameIos) {
                    //     MsgToast.ShowWithColor('活动暂未开启');
                    // } else {
                    MsgToastMgr.Show('月卡界面还没有');
                    // }
                } else {
                    // WinMgr.I.open(ViewConst.RoleWin, 2, 1);
                    ControllerMgr.I.RoleController.linkOpen(RolePageType.RoleOfficial, [1]);
                }
            } else if (RoleMgr.I.d.VipLevel < this._personalData.CfgVip.NeedVipLevel) {
                WinMgr.I.open(ViewConst.VipSuperWin, 1);
            } else {
                // WinMgr.I.open(ViewConst.RoleWin, 2, 1);
                ControllerMgr.I.RoleController.linkOpen(RolePageType.RoleOfficial, [1]);
            }
        }, this);
    }

    private index: number = 0;
    public loadItem(data: IPersonal, index: number): void {
        if (this.node && this.node.isValid) {
            this.index = index;
            this.setData(data);
        }
    }

    public setData(data: IPersonal): void {
        if (data) {
            this._personalData = data;
            this.uptUI();
        }
    }

    /** 更新boss头像 */
    private uptBossHead() {
        const bossId: number = this._personalData.IsPersonal ? this._personalData.CfgPersonal.BossId : this._personalData.CfgVip.BossId;
        const ShowName: string = this._personalData.IsPersonal ? this._personalData.CfgPersonal.ShowName : this._personalData.CfgVip.ShowName;
        const icon: string = Config.Get(Config.Type.Cfg_Monster).getValueByKey(bossId, 'AnimId');
        UtilCocos.LoadSpriteFrameRemote(this.SpIcon, `${RES_ENUM.HeadIcon}${icon}`, AssetType.SpriteFrame);
        if (ShowName) {
            this.NdHeadBg.active = true;
            this.LabName.node.active = true;
            this.LabName.string = ShowName;
        } else {
            this.NdHeadBg.active = false;
            this.LabName.node.active = false;
        }

        if (this.isHeadLock()) {
            this.NdLock.active = true;
            UtilCocos.SetSpriteGray(this.SpIcon.node, true);
        } else {
            this.NdLock.active = false;
            UtilCocos.SetSpriteGray(this.SpIcon.node, false);
        }
    }

    private isExtCondLock(): boolean {
        // 月卡和主角光环
        let isExtCond = false;
        if (this._personalData.IsPersonal && this._personalData.CfgPersonal.ExtCond) {
            isExtCond = RoleMgr.I.d.MonthCard <= UtilTime.NowSec(); // && !RoleM.I.d.LifeCard;
        }
        return isExtCond;
    }

    /** 头像是否带锁的条件 */
    private isHeadLock() {
        if (this._personalData.IsPersonal) {
            return RoleMgr.I.getArmyLevel() < this._personalData.CfgPersonal.NeedLevel || this.isExtCondLock();
        } else {
            return RoleMgr.I.getArmyLevel() < this._personalData.CfgVip.NeedLevel || RoleMgr.I.d.VipLevel < this._personalData.CfgVip.NeedVipLevel;
        }
    }

    private uptUI(): void {
        this.LabTimes.string = `${i18n.tt(Lang.arena_challenge_times)}:${this._personalData.LeftTimes}`;

        if (!this.isHeadLock()) {
            this.BtnFight.active = true;

            this.LabUnlock.node.active = false;
            this.NdRed.active = this._personalData.LeftTimes > 0;
        } else {
            this.BtnFight.active = false;
            this.LabUnlock.node.active = true;
            //
            let unlockStr: string = '';
            if (this.isExtCondLock()) {
                // if (Game.I.nocharge && Game.I.platform == PlatformEnum.weGameIos) {
                //     unlockStr = "";
                // } else {
                unlockStr = i18n.tt(Lang.boss_month_card);
                // }
            } else if (!this._personalData.IsPersonal) {
                if (RoleMgr.I.d.VipLevel < this._personalData.CfgVip.NeedVipLevel) {
                    const vipStr = UtilGame.GetVipNL(this._personalData.CfgVip.NeedVipLevel);
                    unlockStr = `${vipStr.N}${vipStr.L}${i18n.tt(Lang.boss_unlock)}`;
                } else {
                    unlockStr = `【${this._personalData.CfgVip.ShowLabel}】${i18n.tt(Lang.boss_unlock)}`;
                }
            } else {
                unlockStr = `【${this._personalData.CfgPersonal.ShowLabel}】${i18n.tt(Lang.boss_unlock)}`;
            }

            this.LabUnlock.string = unlockStr;
        }

        const ShowPrize = this._personalData.IsPersonal ? this._personalData.CfgPersonal.ShowPrize : this._personalData.CfgVip.ShowPrize;
        UtilItemList.ShowItems(this.NdPrize, ShowPrize, { option: { needNum: true } });
        if (this._personalData.IsPersonal) {
            if (this.index === 0) {
                GuideMgr.I.bindScript(GuideBtnIds.LeaderPersonFight, this.BtnFight);
            } else {
                GuideMgr.I.unbind(GuideBtnIds.LeaderSupremeFight, this.BtnFight);
                GuideMgr.I.unbind(GuideBtnIds.LeaderPersonFight, this.BtnFight);
            }
        } else if (this.index === 0) {
            GuideMgr.I.bindScript(GuideBtnIds.LeaderSupremeFight, this.BtnFight);
        } else {
            GuideMgr.I.unbind(GuideBtnIds.LeaderSupremeFight, this.BtnFight);
            GuideMgr.I.unbind(GuideBtnIds.LeaderPersonFight, this.BtnFight);
        }
        this.uptBossHead();
    }
}
