/*
 * @Author: kexd
 * @Date: 2022-11-07 16:40:27
 * @FilePath: \SanGuo2.4\assets\script\game\module\beaconWar\com\BeaconBossMsg.ts
 * @Description: 烽火-boss信息 （暂没用）
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { DynamicImage } from '../../../base/components/DynamicImage';
import Progress from '../../../base/components/Progress';
import { Config } from '../../../base/config/Config';
import { E } from '../../../const/EventName';
import MapMgr from '../../../map/MapMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;
@ccclass
export default class BeaconBossMsg extends BaseCmp {
    @property(DynamicImage)
    private SprHead: DynamicImage = null;
    @property(Progress)
    private ProgressHp: Progress = null;
    @property(cc.Label)
    private LabLv: cc.Label = null;
    @property(cc.Label)
    private LabName: cc.Label = null;

    private _bossId: number = 0;

    protected onLoad(): void {
        super.onLoad();
    }

    protected start(): void {
        super.start();
        this.addE();
    }

    private addE() {
        EventClient.I.on(E.BeaconWar.UptPlayerData, this.uptBossMsg, this);
    }

    private remE() {
        EventClient.I.off(E.BeaconWar.UptPlayerData, this.uptBossMsg, this);
    }

    /** 只需要bossId就可以展示boss归属的信息 */
    public setData(bossId: number): void {
        this._bossId = bossId;
        this.uptBossMsg();
    }

    private updateHp(): void {
        // boss的血要从场景信息里拿
        const info = MapMgr.I.getMapMonsterData(this._bossId);
        if (info) {
            this.ProgressHp.updateProgress(info.d.FCurrHp, info.d.FMaxHp, false);
        }
    }

    private uptBossMsg() {
        const cfgRefresh: Cfg_Refresh = ModelMgr.I.BeaconWarModel.getMonsterRefreshData(this._bossId);
        if (!cfgRefresh) return;
        const monsterId: number = +cfgRefresh.MonsterIds.split('|')[0];
        const cfg: Cfg_Monster = Config.Get(Config.Type.Cfg_Monster).getValueByKey(monsterId);
        if (!cfg) return;
        // boss图标
        this.SprHead.loadImage(`${RES_ENUM.HeadIcon}${cfg.AnimId}`, 1, true);
        // boss的名称
        this.LabName.string = cfg.Name;
        // boss的等级
        this.LabLv.string = `${cfgRefresh.MonsterLevel}`;
        // 血
        this.updateHp();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
