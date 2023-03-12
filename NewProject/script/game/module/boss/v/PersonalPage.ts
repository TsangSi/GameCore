/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: kexd
 * @Date: 2022-06-23 20:22:54
 * @FilePath: \SanGuo2.4\assets\script\game\module\boss\v\PersonalPage.ts
 * @Description: 个人首领界面 和 至尊首领界面 共用
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import { RoleMgr } from '../../role/RoleMgr';
import PersonalItem from './PersonalItem';
import ModelMgr from '../../../manager/ModelMgr';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import ListView from '../../../base/components/listview/ListView';
import { i18n, Lang } from '../../../../i18n/i18n';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { RoleAN } from '../../role/RoleAN';

const { ccclass, property } = cc._decorator;

export interface IPersonal {
    Id: number,
    LeftTimes: number,
    Sort: number,
    IsPersonal: boolean,
    CfgPersonal?: Cfg_Boss_Personal,
    CfgVip?: Cfg_Boss_VIP,
}

@ccclass
export default class PersonalPage extends WinTabPage {
    @property(ListView)
    private ListBoss: ListView = null;
    @property(cc.Label)
    private LabVip: cc.Label = null;
    @property(cc.Node)
    private NdVip2: cc.Node = null;
    @property(cc.Node)
    private BtnSweep: cc.Node = null;

    /** 是个人首领还是至尊首领 */
    private _isPersonal: boolean = true;
    /** 个人首领(至尊首领)数据 */
    private _personalList: IPersonal[] = [];

    protected start(): void {
        super.start();
        this.clk();
        this.addE();

        this.uptUI();
    }

    /**
     * setData
     */
    public setData(isPersonal: boolean): void {
        this._isPersonal = isPersonal;

        if (this._isPersonal) {
            ControllerMgr.I.BossController.reqC2SPersonalInfo();
        } else {
            ControllerMgr.I.BossController.reqC2SVipInfo();
        }
    }

    private addE() {
        EventClient.I.on(E.Boss.UptPersonal, this.uptUI, this);
        EventClient.I.on(E.Boss.UptVip, this.uptUI, this);
        RoleMgr.I.on(this.uptUI, this, RoleAN.N.ArmyLevel, RoleAN.N.ArmyStar, RoleAN.N.VipLevel);
    }

    private remE() {
        EventClient.I.off(E.Boss.UptPersonal, this.uptUI, this);
        EventClient.I.off(E.Boss.UptVip, this.uptUI, this);
        RoleMgr.I.off(this.uptUI, this, RoleAN.N.ArmyLevel, RoleAN.N.ArmyStar, RoleAN.N.VipLevel);
    }

    private clk() {
        UtilGame.Click(this.BtnSweep, () => {
            if (this._isPersonal) {
                if (ModelMgr.I.BossModel.isPersonalTimes()) {
                    ControllerMgr.I.BossController.reqC2SPersonalSweep();
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.boss_sweep));
                }
            } else if (ModelMgr.I.BossModel.isVipTimes()) {
                ControllerMgr.I.BossController.reqC2SVipSweep();
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.boss_sweep));
            }
        }, this);

        UtilGame.Click(this.LabVip.node, () => {
            WinMgr.I.open(ViewConst.VipSuperWin, 1);
        }, this);
    }

    private getPersonalList() {
        this._personalList = [];

        if (this._isPersonal) {
            const bossPersonal = ModelMgr.I.BossModel.bossPersonal;
            for (const bossId in bossPersonal) {
                const p: IPersonal = {
                    Id: +bossId,
                    LeftTimes: bossPersonal[bossId].LeftTimes,
                    Sort: this.getPersonalSort(+bossId, bossPersonal[bossId].LeftTimes),
                    CfgPersonal: Config.Get(Config.Type.Cfg_Boss_Personal).getValueByKey(+bossId),
                    IsPersonal: true,
                };
                this._personalList.push(p);
            }
        } else {
            const bossPersonal = ModelMgr.I.BossModel.bossVip;
            for (const bossId in bossPersonal) {
                const p: IPersonal = {
                    Id: +bossId,
                    LeftTimes: bossPersonal[bossId].LeftTimes,
                    Sort: this.getPersonalSort(+bossId, bossPersonal[bossId].LeftTimes),
                    CfgVip: Config.Get(Config.Type.Cfg_Boss_VIP).getValueByKey(+bossId),
                    IsPersonal: false,
                };
                this._personalList.push(p);
            }
        }

        this._personalList.sort((a, b) => b.Sort - a.Sort);
    }
    private getPersonalSort(id: number, LeftTimes: number): number {
        if (this._isPersonal) {
            const _cc: Cfg_Boss_Personal = Config.Get(Config.Type.Cfg_Boss_Personal).getValueByKey(id);
            if (_cc) {
                return (_cc.ExtCond ? 100000 : 0) // 月卡或终身卡的在最前面 > 可挑战 > 未解锁 > 已挑战
                    + (RoleMgr.I.getArmyLevel() >= _cc.NeedLevel && LeftTimes > 0 ? 10000 : 0)
                    + LeftTimes > 0 ? 1000 : 0
                + (100 - _cc.NeedLevel);
            }
        } else {
            const _cc: Cfg_Boss_VIP = Config.Get(Config.Type.Cfg_Boss_VIP).getValueByKey(id);
            if (_cc) {
                return (RoleMgr.I.getArmyLevel() >= _cc.NeedLevel && RoleMgr.I.d.VipLevel >= _cc.NeedVipLevel && LeftTimes > 0 ? 10000 : 0)
                    + LeftTimes > 0 ? 1000 : 0
                + (100 - _cc.NeedLevel);
            }
        }

        return 0;
    }

    /**
     * 更新界面
     */
    private uptUI(): void {
        this.getPersonalList();

        const lv = RoleMgr.I.d.VipLevel;
        const limitVip = Number(Config.Get(Config.Type.Cfg_Boss_Config).getValueByKey('PersonalBossSweepVipLevel', 'Value'));

        if (lv >= limitVip) {
            this.BtnSweep.active = true;
            this.LabVip.node.active = false;
            this.NdVip2.active = false;
        } else {
            this.BtnSweep.active = false;
            this.LabVip.node.active = true;
            this.NdVip2.active = true;
            const vip = UtilGame.GetVipNL(limitVip);
            this.LabVip.string = `${vip.N}${vip.L}`;
        }

        this.initList();
    }

    private initList(): void {
        this.ListBoss.setNumItems(this._personalList.length);
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: IPersonal = this._personalList[idx];
        const item = node.getComponent(PersonalItem);
        if (data && item) {
            item.loadItem(data, idx);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
