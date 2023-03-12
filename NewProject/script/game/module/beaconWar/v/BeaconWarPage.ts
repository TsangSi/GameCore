/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
 * @Author: kexd
 * @Date: 2022-10-31 20:31:37
 * @Description: 烽火连城
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { TickTimer } from '../../../base/components/TickTimer';
import { E } from '../../../const/EventName';
import ListView from '../../../base/components/listview/ListView';
import UtilItemList from '../../../base/utils/UtilItemList';
import { BeaconWarModel } from '../BeaconWarModel';
import ModelMgr from '../../../manager/ModelMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import ControllerMgr from '../../../manager/ControllerMgr';
import BeaconCityItem from '../com/BeaconCityItem';
import { RoleMgr } from '../../role/RoleMgr';
import BeaconBossItem from '../com/BeaconBossItem';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { RoleAN } from '../../role/RoleAN';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { RID } from '../../reddot/RedDotConst';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { ItemIcon } from '../../../com/item/ItemIcon';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { FuBenMgr } from '../../fuben/FuBenMgr';
import { TabPagesView } from '../../../com/win/WinTabPageView';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BeaconWarPage extends TabPagesView { // WinTabPage
    @property(ListView)
    private ListCity: ListView = null;
    @property(cc.Node)
    private NdBoss: cc.Node = null;
    @property(cc.Label)
    private LabPower: cc.Label = null;
    // 奖励
    @property(cc.ScrollView)
    private Sv: cc.ScrollView = null;
    @property(cc.Node)
    private NdAward: cc.Node = null;

    @property(cc.Node)
    private BtnDetail: cc.Node = null;
    @property(cc.Node)
    private BtnPackage: cc.Node = null;
    @property(cc.Node)
    private BtnAdd: cc.Node = null;
    @property(cc.Node)
    private BtnChallenge: cc.Node = null;
    // 剩余体力
    @property(cc.Label)
    private LabHave: cc.Label = null;
    @property(cc.Label)
    private LabNeed: cc.Label = null;
    @property(TickTimer)
    private TickTime: TickTimer = null;

    @property({ type: cc.Prefab })
    private BossItemPrefab: cc.Prefab = null;

    private _M: BeaconWarModel = null;
    private _curIndex: number = 0;
    private _curBossHomeId: number = 1;
    private _curCfgData: Cfg_BeaconWar = null;
    private _bossHomeIds: number[] = [];

    protected onLoad(): void {
        super.onLoad();
        if (!this._M) {
            this._M = ModelMgr.I.BeaconWarModel;
        }
    }

    protected start(): void {
        super.start();
        this.clk();
    }

    protected updateUI(...parma): void {
        // console.log('updateUI--------------', parma);
    }

    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx);
        if (!this._M) {
            this._M = ModelMgr.I.BeaconWarModel;
        }
        this.uptUI(true);
        // 请求主界面数据
        ControllerMgr.I.BeaconWarController.reqOpenBossHomeUI();

        this.remE();
        this.addE();

        UtilRedDot.Bind(RID.Boss.CrossBoss.BeaconWar.Tili, this.BtnChallenge, cc.v2(85, 25));
        UtilRedDot.Bind(RID.Boss.CrossBoss.BeaconWar.Bag, this.BtnPackage, cc.v2(25, 35));
    }

    private addE() {
        EventClient.I.on(E.BeaconWar.UptMain, this.uptUI, this);

        // 属性发生变化的刷新
        RoleMgr.I.on(this.uptEnergy, this, RoleAN.N.BossHomeEnergyVal);
    }

    private remE() {
        EventClient.I.off(E.BeaconWar.UptMain, this.uptUI, this);

        // 属性发生变化的刷新
        RoleMgr.I.off(this.uptEnergy, this, RoleAN.N.BossHomeEnergyVal);
    }

    private clk() {
        UtilGame.Click(this.BtnDetail, () => {
            WinMgr.I.open(ViewConst.BeaconWarRePreWin);
        }, this);

        UtilGame.Click(this.BtnAdd, () => {
            this._M.addEnergyForUI();
        }, this);

        UtilGame.Click(this.BtnPackage, () => {
            // this._M.openPackage();
            ControllerMgr.I.BeaconWarController.reqOpenPackageUI();
        }, this);

        UtilGame.Click(this.BtnChallenge, () => {
            if (RoleMgr.I.d.BossHomeEnergyVal < 10) {
                MsgToastMgr.Show(i18n.tt(Lang.beaconWar_energyLess));
                return;
            }
            // 检查条件
            const armyLv = RoleMgr.I.getArmyLevel();
            const armyStar = RoleMgr.I.getArmyStar();
            const cfg: Cfg_BeaconWar = this._M.CfgBeaconWar.getValueByKey(this._curBossHomeId);
            const isOpen = armyLv > cfg.ArmyLevel || (armyLv === cfg.ArmyLevel && armyStar >= cfg.ArmyStar);
            if (!isOpen) {
                const armyName = ModelMgr.I.ArmyLevelModel.getArmyName(cfg.ArmyLevel, cfg.ArmyStar);
                MsgToastMgr.Show(UtilString.FormatArray(i18n.tt(Lang.beaconWar_unlock), [armyName]));
                return;
            }

            FuBenMgr.I.enter(cfg.MapId, (isReqed) => {
                if (isReqed) {
                    ControllerMgr.I.BeaconWarController.reqEnterBossHome(this._curBossHomeId);
                    // WinMgr.I.close(ViewConst.BossWin);
                    WinMgr.I.closeAll();
                }
            });
        }, this);
    }

    /** 当前选中哪个城池 */
    private _openCount: number = 0;
    private _autoChoose() {
        this._curIndex = 0;
        this._openCount = 0;
        this._curBossHomeId = this._bossHomeIds[0];
        this._M.curBossHomeId = this._bossHomeIds[0];
        const armyLv = RoleMgr.I.getArmyLevel();
        const armyStar = RoleMgr.I.getArmyStar();
        for (let i = 0; i < this._bossHomeIds.length; i++) {
            const cfg: Cfg_BeaconWar = this._M.CfgBeaconWar.getValueByKey(this._bossHomeIds[i]);
            if (armyLv > cfg.ArmyLevel || (armyLv === cfg.ArmyLevel && armyStar >= cfg.ArmyStar)) {
                this._curIndex = i;
                this._curBossHomeId = cfg.CityID;
                this._M.curBossHomeId = cfg.CityID;
                this._openCount++;
            }
        }
    }

    /** 滚动位置：开启数量>4最右边保持最右侧有一个未解锁的城池 */
    private _scrollTo() {
        let to: number = this._openCount - 4;
        if (to < 0) to = 0;
        this.ListCity.scrollTo(to);
    }

    private uptUI(isInit: boolean) {
        this._bossHomeIds = this._M.getBossHomeIds();
        if (!this._bossHomeIds || this._bossHomeIds.length === 0) {
            // console.log('----uptUI-----return:', isInit);
            return;
        }
        this._bossHomeIds.sort((a, b) => a - b);
        // if (isInit) {
        this._autoChoose();

        // }
        // 城池列表
        this.ListCity.setNumItems(this._bossHomeIds.length);
        // 展示当前的城池
        this.uptCity();

        this._scrollTo();
    }

    /** 选中不同的城池，展示其信息 */
    private uptCity() {
        this._curCfgData = this._M.CfgBeaconWar.getValueByKey(this._curBossHomeId);
        // 怪
        this.uptBoss();
        // 奖励
        this.uptReward();
        // 推荐战力
        this.LabPower.string = `${UtilNum.ConvertFightValue(this._curCfgData.Recommend)}`;

        // 重置倒计时
        const leftT: number = UtilTime.GetTodayRemainTime() / 1000;
        this.TickTime.tick(leftT, '%HH:%mm:%ss', true, true);

        // 体力
        this.uptEnergy();
    }

    private uptEnergy() {
        // console.log('--体力变化的刷新', RoleMgr.I.d.BossHomeEnergyVal);
        let have: number = RoleMgr.I.d.BossHomeEnergyVal;
        if (have < 0) have = 0;
        const need: number = this._M.getNeedEnergy();
        this.LabHave.string = `${have}`;
        this.LabNeed.string = `/${need}`;
        const color = have < 10 ? UtilColor.Hex2Rgba(UtilColor.RedD) : UtilColor.Hex2Rgba(UtilColor.GreenV);
        this.LabHave.node.color = color;
        this.LabNeed.node.color = color;
    }

    /** boss展示 */
    private _bossDataList: BossHomeBossData[] = [];
    private uptBoss() {
        // const pos = [[-260, -200], [-220, -60], [-90, 45], [60, 45], [200, -50], [230, -185]];
        const pos = [[-206, -220], [-285, -82], [-145, 34], [145, 34], [285, -82], [206, -220]];
        this._bossDataList = this._M.getBossHomeData(this._curBossHomeId).BossData;
        this._bossDataList.sort((a, b) => a.BossId - b.BossId);

        for (let i = 0; i < this._bossDataList.length; i++) {
            const nd = cc.instantiate(this.BossItemPrefab);
            if (pos[i]) {
                nd.setPosition(pos[i][0], pos[i][1]);
            }

            this.NdBoss.addChild(nd);
            nd.getComponent(BeaconBossItem).setData(this._bossDataList[i], false);
        }
    }

    /** 奖励展示 */
    private uptReward() {
        const rewards = this._curCfgData.ShowDrop;
        const itemStrArray = rewards.split('|');
        if (itemStrArray.length <= 5) {
            this.Sv.node.active = false;
            this.NdAward.active = true;
            UtilItemList.ShowItems(this.NdAward, rewards, { option: { needNum: true, needName: false, isDarkBg: true } });
        } else {
            // 需要布局
            this.Sv.node.active = true;
            this.NdAward.active = false;
            UtilItemList.ShowItems(this.Sv.content, rewards, { option: { needNum: true, needName: false, isDarkBg: true } });
        }
    }

    private selectCity(bossHomeId: number) {
        if (this._curBossHomeId === bossHomeId) {
            return;
        }
        const index = this._bossHomeIds.indexOf(bossHomeId);
        if (index >= 0) {
            this._curIndex = index;
            this._curBossHomeId = bossHomeId;
            this._M.curBossHomeId = bossHomeId;
            this.ListCity.setNumItems(this._bossHomeIds.length);
            this.uptCity();
        }
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const bossHomeId: number = this._bossHomeIds[idx];
        const data: BossHomeData = this._M.getBossHomeData(bossHomeId);
        const cfg: Cfg_BeaconWar = this._M.CfgBeaconWar.getValueByKey(data.BossHomeId);
        const item = node.getComponent(BeaconCityItem);
        if (data && item) {
            item.setData(cfg, data.BossHomeId === this._curBossHomeId, (cityId: number) => {
                this.selectCity(cityId);
            });
        }
    }

    private onClose() {
        WinMgr.I.close(ViewConst.BossWin);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
