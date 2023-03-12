/*
 * @Author: kexd
 * @Date: 2022-11-07 15:31:23
 * @FilePath: \SanGuo2.4\assets\script\game\module\beaconWar\com\BeaconMsg.ts
 * @Description: 伤害列表里的Boss信息条和归属的玩家信息条
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import Progress from '../../../base/components/Progress';
import { Config } from '../../../base/config/Config';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import MapMgr from '../../../map/MapMgr';
import { RoleInfo } from '../../role/RoleInfo';
import { RoleMgr } from '../../role/RoleMgr';
import { EBeaconState } from '../BeaconWarConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import UtilHead from '../../../base/utils/UtilHead';
import { RoleAN } from '../../role/RoleAN';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;
@ccclass
export default class BeaconMsg extends BaseCmp {
    @property(DynamicImage)
    private SprBossHead: DynamicImage = null;
    @property(Progress)
    private ProgressBossHp: Progress = null;
    @property(cc.Label)
    private LabBossLv: cc.Label = null;
    @property(cc.Label)
    private LabBossName: cc.Label = null;
    //
    @property(cc.Sprite)
    private SprHead: cc.Sprite = null;
    @property(cc.Sprite)
    private SprHeadBg: cc.Sprite = null;
    @property(Progress)
    private ProgressHp: Progress = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Node)
    private BtnFight: cc.Node = null;

    private _bossData: BossHomeBossData = null;

    protected onLoad(): void {
        super.onLoad();
    }

    protected start(): void {
        super.start();
        this.addE();

        UtilGame.Click(this.BtnFight, () => {
            if (!this._bossData) return;
            if (this._bossData.UserId === RoleMgr.I.info.userID) {
                MsgToastMgr.Show(i18n.tt(Lang.beaconWar_fightme));
                return;
            }
            if (this._bossData.State === EBeaconState.Die) {
                MsgToastMgr.Show(i18n.tt(Lang.beaconWar_unAlive));
            } else {
                const bossHomeId: number = ModelMgr.I.BeaconWarModel.curBossHomeId;
                ControllerMgr.I.BeaconWarController.reqGetBossHomePlayerPos(bossHomeId, this._bossData.UserId);
                // ModelMgr.I.BeaconWarModel.moveToPlayerPos(this._bossData.UserId);
            }
        }, this);

        UtilGame.Click(this.SprBossHead.node, () => {
            if (!this._bossData) return;
            if (RoleMgr.I.d.Map_State === EBeaconState.Die) {
                MsgToastMgr.Show(i18n.tt(Lang.beaconWar_cd));
                return;
            }
            if (this._bossData.State === EBeaconState.Die) {
                MsgToastMgr.Show(i18n.tt(Lang.beaconWar_unAlive));
            } else {
                ModelMgr.I.BeaconWarModel.moveToBossPos(this._bossData.BossId);
            }
        }, this);
    }

    private addE() {
        // EventClient.I.on(E.BeaconWar.UptPlayerData, this.uptUI, this);// 应该这里不需要
        EventClient.I.on(E.BeaconWar.PlayerHp, this.uptPlayerHp, this);
        EventClient.I.on(E.BeaconWar.MonsterHp, this.updateBossHp, this);
        RoleMgr.I.on(this.uptPlayerHp, this, RoleAN.N.FCurrHp, RoleAN.N.FMaxHp);
    }

    private remE() {
        // EventClient.I.off(E.BeaconWar.UptPlayerData, this.uptUI, this);// 应该这里不需要
        EventClient.I.off(E.BeaconWar.PlayerHp, this.uptPlayerHp, this);
        EventClient.I.off(E.BeaconWar.MonsterHp, this.updateBossHp, this);
        RoleMgr.I.off(this.uptPlayerHp, this, RoleAN.N.FCurrHp, RoleAN.N.FMaxHp);
    }

    public setData(data: BossHomeBossData, reqPlayerInfo: boolean = false): void {
        if (!data) return;
        this._bossData = data;
        const d: RoleInfo = ModelMgr.I.BeaconWarModel.playerInfo(this._bossData.UserId, reqPlayerInfo);// 应该这里用false就行
        if (d) {
            this.uptUI();
        }
    }

    private uptUI() {
        this.uptPlayerMsg();
        this.uptBossMsg();
    }

    /** 对手信息 */
    private uptPlayerMsg() {
        const info: RoleInfo = ModelMgr.I.BeaconWarModel.playerInfo(this._bossData.UserId, false);
        if (info) {
            // this.SprHead.loadImage(`${RES_ENUM.RoleHead}${info.d.HeadIcon || 1}`, 1, true); // 头像暂时没资源
            UtilHead.setHead(info.d.HeadIcon, this.SprHead, info.d.HeadFrame, this.SprHeadBg);

            this.LabName.string = info.getAreaNick(NickShowType.Nick);
            let max = info.d.FMaxHp;
            if (!max) max = info.d.FCurrHp;
            this.ProgressHp.updateProgress(info.d.FCurrHp, info.d.FMaxHp, false);
            const LabName = this.BtnFight.getChildByName('LabName').getComponent(cc.Label);
            LabName.string = this._bossData.UserId === RoleMgr.I.info.userID ? i18n.tt(Lang.beaconWar_belongme) : i18n.tt(Lang.beaconWar_fight);
        }
        this.uptPlayerHp();
    }

    private uptPlayerHp() {
        const info: RoleInfo = ModelMgr.I.BeaconWarModel.playerInfo(this._bossData.UserId, false);
        if (info) {
            this.ProgressHp.updateProgress(info.d.FCurrHp, info.d.FMaxHp, false);
        }
    }

    /** boss信息 */
    private uptBossMsg() {
        const cfgRefresh: Cfg_Refresh = ModelMgr.I.BeaconWarModel.getMonsterRefreshData(this._bossData.BossId);
        if (!cfgRefresh) return;
        const monsterId: number = +cfgRefresh.MonsterIds.split('|')[0];
        const cfg: Cfg_Monster = Config.Get(Config.Type.Cfg_Monster).getValueByKey(monsterId);
        if (!cfg) return;
        // boss图标
        this.SprBossHead.loadImage(`${RES_ENUM.HeadIcon}${cfg.AnimId}`, 1, true);
        // boss的名称
        this.LabBossName.string = cfg.Name;
        // boss的等级
        this.LabBossLv.string = `${cfgRefresh.MonsterLevel}${i18n.lv}`;
        // 血
        this.updateBossHp();
    }

    private updateBossHp(): void {
        const info = MapMgr.I.getMapMonsterData(this._bossData.BossId);
        if (info) {
            let max = info.d.FMaxHp;
            if (!max) {
                const cfgRefresh: Cfg_Refresh = ModelMgr.I.BeaconWarModel.getMonsterRefreshData(this._bossData.BossId);
                const indexer: ConfigIndexer = Config.Get(Config.Type.Cfg_Attr_Monster);
                const attr: Cfg_Attr_Monster = indexer.getValueByKey(cfgRefresh.AttrId_Boss, cfgRefresh.MonsterLevel);
                max = +attr.Attr_1;
            }
            this.ProgressBossHp.updateProgress(info.d.FCurrHp, max, false);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
