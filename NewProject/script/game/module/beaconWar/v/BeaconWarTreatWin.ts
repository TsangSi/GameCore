/*
 * @Author: dcj
 * @Date: 2022-11-02 12:21:59
 * @FilePath: \SanGuo\assets\script\game\module\beaconWar\v\BeaconWarTreatWin.ts
 * @Description:
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { WinCmp } from '../../../com/win/WinCmp';
import { ViewConst } from '../../../const/ViewConst';
import { EntityUnitType } from '../../../entity/EntityConst';
import ModelMgr from '../../../manager/ModelMgr';
import { GeneralMsg } from '../../general/GeneralConst';
import { BeaconWarCfgKey } from '../BeaconWarConst';
import { BeaconWarModel } from '../BeaconWarModel';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import ControllerMgr from '../../../manager/ControllerMgr';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { RoleMgr } from '../../role/RoleMgr';
import { RoleAN } from '../../role/RoleAN';
import { Config } from '../../../base/config/Config';
import { ConfigBeautyIndexer } from '../../../base/config/indexer/ConfigBeautyIndexer';
import { UtilBool } from '../../../../app/base/utils/UtilBool';
import { RoleInfo } from '../../role/RoleInfo';
import UtilHead from '../../../base/utils/UtilHead';
import { RES_ENUM } from '../../../const/ResPath';
import { WinAutoPayTipsModel, AutoPayKey } from '../../pay/WinAutoPayTipsModel';

const { ccclass, property } = cc._decorator;
@ccclass
export class BeaconWarTreatWin extends WinCmp {
    @property(cc.Label)
    private LabHp: cc.Label = null;
    @property(cc.Node)
    private BtnTreat: cc.Node = null;
    @property(cc.Toggle)
    private Toggle: cc.Toggle = null;
    @property(cc.ScrollView)
    private SvAttr: cc.ScrollView = null;
    @property(cc.Node)
    private NdConsume: cc.Node = null;

    private _M: BeaconWarModel = null;
    private _roleInfo: RoleInfo = null;
    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnTreat, () => {
            const _tips = this._M.getIsETreat();
            if (!_tips) {
                MsgToastMgr.Show(`${UtilItem.GetCfgByItemId(+this._cost[0]).Name}${i18n.tt(Lang.not_enough)}`);
                WinMgr.I.open(ViewConst.ItemSourceWin, +this._cost[0]);
                return;
            } else {
                const _eTips = this._M.getIsMaxHp();
                if (_eTips) {
                    MsgToastMgr.Show(_eTips);
                } else {
                    ControllerMgr.I.BeaconWarController.reqBossHomeTreat();
                    MsgToastMgr.Show(_tips);
                }
            }
            this.close();
        }, this);

        UtilGame.Click(this.Toggle.node, () => {
            WinAutoPayTipsModel.setState(AutoPayKey.BeaconWarAutoTreat, this.Toggle.isChecked);
            if (this.Toggle.isChecked) {
                this._M.autoTreat();
            }
        }, this);

        this.addE();
        ControllerMgr.I.BeaconWarController.reqPlayerHpLists(this._M.curBossHomeId, RoleMgr.I.info.userID);
    }

    private addE() {
        EventClient.I.on(E.BeaconWar.UptTreat, this.upView, this);
        EventClient.I.on(E.BeaconWar.UptTreatHpList, this.upView, this);
        // 血
        RoleMgr.I.on(this.upView, this, RoleAN.N.FCurrHp, RoleAN.N.FMaxHp);
    }

    private remE() {
        EventClient.I.off(E.BeaconWar.UptTreat, this.upView, this);
        EventClient.I.off(E.BeaconWar.UptTreatHpList, this.upView, this);
        RoleMgr.I.off(this.upView, this, RoleAN.N.FCurrHp, RoleAN.N.FMaxHp);
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param);
        this._M = ModelMgr.I.BeaconWarModel;
        this._Bcfg = Config.Get(Config.Type.Cfg_Beauty);
        this._roleInfo = ModelMgr.I.BeaconWarModel.playerInfo(RoleMgr.I.info.userID, false);
        this.upView();
        this.Toggle.isChecked = WinAutoPayTipsModel.getState(AutoPayKey.BeaconWarAutoTreat);
    }

    private createRoleD() {
        const quality: number = null;
        const head: string = null;
        const name = i18n.tt(Lang.beaconWar_mine);
        const pos = 13;
        return {
            quality, head, name, pos,
        };
    }

    private _cost: string[] = [];
    private _Bcfg: ConfigBeautyIndexer = null;
    private upView(force?: boolean): void {
        let _hpList = this._M.playerHpLists;
        if (!UtilBool.isNullOrUndefined(force)) {
            _hpList = [];// 强制刷新满血
        }
        const lineup: { [Type: number]: LineupUnit[] } = ModelMgr.I.BattleUnitModel.getAllBattleLineup();
        const dataList: { quality: number, head: string, name: string, pos: number }[] = [];
        // 默认加主角
        const roleD = this.createRoleD();
        dataList.push(roleD);
        lineup[EntityUnitType.Player] = [{ OnlyId: '', Pos: 13, Type: EntityUnitType.Player }];

        let ratio = RoleMgr.I.info.d.FCurrHp / RoleMgr.I.info.d.FMaxHp;
        if (ratio > 1) ratio = 1;
        if (ratio < 0) ratio = 0;
        this.LabHp.string = `${Math.ceil(ratio * 100)}%`;
        for (const k in lineup) {
            const type = +k;
            const data = lineup[k];
            switch (type) {
                case EntityUnitType.General:
                    for (let i = 0; i < lineup[k].length; i++) {
                        const general: GeneralMsg = ModelMgr.I.GeneralModel.generalData(data[i].OnlyId);
                        const quality: number = general.generalData.Quality;
                        const chead: string = ModelMgr.I.GeneralModel.getGeneralRes(data[i].OnlyId);
                        const head: string = `${RES_ENUM.HeadIcon}${chead}`;
                        const name = general.cfg.Name;
                        const pos = data[i].Pos;
                        dataList.push({
                            quality, head, name, pos,
                        });
                    }
                    break;
                case EntityUnitType.Beauty:
                    for (let i = 0, n = lineup[k].length; i < n; i++) {
                        const cfgBeauty = this._Bcfg.getValueByKey(+data[i].OnlyId, { Quality: 0, AnimId: 0, Name: '' });
                        const quality: number = cfgBeauty.Quality;
                        const head: string = `${RES_ENUM.HeadIcon}${cfgBeauty.AnimId}`;
                        const name = cfgBeauty.Name;
                        const pos = data[i].Pos;
                        dataList.push({
                            quality, head, name, pos,
                        });
                    }
                    break;
                default:
                    break;
            }
        }
        if (lineup) {
            UtilCocos.LayoutFill(this.SvAttr.content, (item, index) => {
                const data: { quality: number, head: string, name: string, pos: number } = dataList[index];
                const NdHead = item.getChildByName('NdAvator');
                const NdName = item.getChildByName('LabName');
                const NdQuality = item.getChildByName('SprQualityBg');
                const HpProgress = item.getChildByName('Progress').getComponent(cc.ProgressBar);
                if (index > 0) {
                    NdHead.removeAllChildren();
                    NdHead.setContentSize(80, 80);
                    NdQuality.setContentSize(90, 90);
                    NdHead.getComponent(DynamicImage).loadImage(data.head, 1, true);
                    NdQuality.getComponent(DynamicImage).loadImage(UtilItem.GetItemQualityBgPath(data.quality), 1, true);
                } else {
                    NdHead.setContentSize(90, 90);
                    NdQuality.setContentSize(140, 140);
                    // eslint-disable-next-line max-len
                    UtilHead.setHead(this._roleInfo.d.HeadIcon, NdHead.getComponent(cc.Sprite), this._roleInfo.d.HeadFrame, NdQuality.getComponent(cc.Sprite));
                }
                NdName.getComponent(cc.Label).string = data.name;
                // 更新血量
                if (_hpList.length !== 0) {
                    const _hpD = _hpList.filter((item) => item.P === data.pos)[0];
                    if (_hpD) {
                        HpProgress.progress = _hpD.Hp / 10000;
                    } else {
                        HpProgress.progress = 100;
                    }
                } else { // 如果没有血量就是满的情况
                    HpProgress.progress = 100;
                }
            }, dataList.length);
        }
        // 拥有多少个
        const costD = ModelMgr.I.BossModel.getValByKey(BeaconWarCfgKey.BeaconWarTreatCost);
        this._cost = costD.split(':');
        const LabCost = this.NdConsume.getChildByName('Ndcost').getComponent(cc.Label);
        const costSpr = this.NdConsume.getChildByName('CostSpr').getComponent(cc.Sprite);
        UtilCocos.LoadSpriteFrameRemote(costSpr, UtilCurrency.getIconByCurrencyType(+this._cost[0]));
        const needNum = this._cost[1];
        LabCost.string = needNum;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
