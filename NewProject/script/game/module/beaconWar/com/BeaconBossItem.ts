/*
 * @Author: kexd
 * @Date: 2022-11-01 20:43:02
 * @FilePath: \SanGuo2.4\assets\script\game\module\beaconWar\com\BeaconBossItem.ts
 * @Description:
 *
 */

import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { TickTimer } from '../../../base/components/TickTimer';
import { Config } from '../../../base/config/Config';
import { EBeaconState } from '../BeaconWarConst';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleInfo } from '../../role/RoleInfo';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { RoleMgr } from '../../role/RoleMgr';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;
@ccclass
export default class BeaconBossItem extends BaseCmp {
    @property(cc.Node)
    private NdBg: cc.Node = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Node)
    private NdCd: cc.Node = null;
    @property(cc.Node)
    private NdFighting: cc.Node = null;
    @property(cc.Node)
    private NdBelong: cc.Node = null;
    @property(cc.Node)
    private Ndline: cc.Node = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(TickTimer)
    private TickTime: TickTimer = null;

    private _isInMap: boolean = false;
    private _bossData: BossHomeBossData = null;

    protected start(): void {
        super.start();
    }

    private initUI() {
        if (this._isInMap) {
            this.node.targetOff(this);
            UtilGame.Click(this.node, () => {
                if (!this._isInMap || !this._bossData) return;
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

        this.remE();
        this.addE();
    }

    private addE() {
        // EventClient.I.on(E.BeaconWar.UptPlayerData, this.uptUI, this);
    }

    private remE() {
        // EventClient.I.off(E.BeaconWar.UptPlayerData, this.uptUI, this);
    }

    /** 在场景里才需要展示归属和挑战中，这里做下区分 */
    public setData(data: BossHomeBossData, isInMap: boolean, isLine: boolean = false): void {
        this._bossData = data;
        this._isInMap = isInMap;
        this.Ndline.active = isLine;
        this.initUI();
        this.uptUI();
    }

    private uptUI() {
        const bossId = ModelMgr.I.BeaconWarModel.getMonsterId(this._bossData.BossId);
        if (!bossId) return;
        const cfg: Cfg_Monster = Config.Get(Config.Type.Cfg_Monster).getValueByKey(bossId);
        if (!cfg) return;
        this.SprIcon.loadImage(`${RES_ENUM.HeadIcon}${cfg.AnimId}`, 1, true);
        // 是否死亡，若死亡，显示复活cd
        if (this._bossData.State === EBeaconState.Die) {
            const leftT: number = this._bossData.ReliveTime - UtilTime.NowSec();
            if (leftT > 0) {
                this.TickTime.tick(leftT, '%HH:%mm:%ss', true, true);
                this.TickTime.removeEndEventHandler(this.node, 'BeaconBossItem', 'onTick');
                this.TickTime.addTickEventHandler(this.node, 'BeaconBossItem', 'onTick');
            }

            this.NdCd.active = leftT > 0;
            UtilCocos.SetSpriteGray(this.SprIcon.node, leftT > 0);
            UtilCocos.SetSpriteGray(this.NdBg, leftT > 0);
        } else {
            this.NdCd.active = false;
            UtilCocos.SetSpriteGray(this.SprIcon.node, false);
            UtilCocos.SetSpriteGray(this.NdBg, false);
        }
        if (!this._isInMap || !this._bossData.UserId) {
            this.NdBelong.active = false;
            this.NdFighting.active = false;
        } else {
            // 归属
            const info: RoleInfo = ModelMgr.I.BeaconWarModel.playerInfo(this._bossData.UserId, false);
            if (!info) {
                this.NdBelong.active = false;
            } else {
                this.NdBelong.active = true;
                this.LabName.string = UtilString.GetLimitStr(info.getAreaNick(NickShowType.Nick), 3);
            }
            // 是否是挑战中(暂时这个都不会显示为true，除非可以切换显示伤害列表和boss列表)
            this.NdFighting.active = false;
        }
    }

    private onTick(leftT: number): void {
        this.NdCd.active = leftT > 0;
        UtilCocos.SetSpriteGray(this.SprIcon.node, leftT > 0);
        UtilCocos.SetSpriteGray(this.NdBg, leftT > 0);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
