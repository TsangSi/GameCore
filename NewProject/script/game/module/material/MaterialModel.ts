/*
 * @Author: myl
 * @Date: 2022-08-03 20:30:38
 * @Description:
 */
import { UtilString } from '../../../app/base/utils/UtilString';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../i18n/i18n';
import { Config } from '../../base/config/Config';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RoleMgr } from '../role/RoleMgr';
import { UnlockFunc } from '../vip/VipConst';
import { MaterialUnlockConditionType } from './MaterialConst';

const { ccclass, property } = cc._decorator;

@ccclass('MaterialModel')
export class MaterialModel extends BaseModel {
    public clearAll(): void {
        //
    }

    public registerRedDotListen(): void {
        const rid = RID.MaterialFB.Material.MaterialView;
        const info: IListenInfo = {
            ProtoId: [ProtoId.S2CMaterialListPush_ID],
            ProxyRid: [RID.MaterialFB.Material.Id],
            CheckVid: [ViewConst.MaterialWin],
        };
        RedDotMgr.I.emit(REDDOT_ADD_LISTEN_INFO, { rid, info });
    }

    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.MaterialFB.Material.Id, this.redUpdate, this);
        RedDotCheckMgr.I.on(RID.MaterialFB.Material.MaterialView, this.redUpdateMaterial, this);
    }

    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.MaterialFB.Material.Id, this.redUpdate, this);
        RedDotCheckMgr.I.off(RID.MaterialFB.Material.MaterialView, this.redUpdateMaterial, this);
    }

    private redUpdate() {
        const onshow = this.redUpdateMaterial();
        // RedDotMgr.I.updateRedDot(RID.MaterialFB.Material.Id, onshow);
    }

    private redUpdateMaterial(): boolean {
        const id = RID.MaterialFB.Material.MaterialView;
        if (!UtilFunOpen.isOpen(FuncId.MaterialFB)) {
            RedDotMgr.I.updateRedDot(id, false);
            return false;
        }
        const indexer = Config.Get(Config.Type.Cfg_FB_Material);
        for (const obj of this._fbList) {
            const item = this._fbList.get(obj[0]);
            const itemCfg: Cfg_FB_Material = indexer.getValueByKey(obj[0]);
            if (item.Num > 0 && this.condition(itemCfg.Unlock).unlock) {
                RedDotMgr.I.updateRedDot(id, true);
                return true;
            }
        }

        RedDotMgr.I.updateRedDot(id, false);
        return false;
    }

    private _fbList: Map<number, MaterialData> = new Map();

    public set fbList(list: Array<MaterialData>) {
        list.forEach((item) => {
            this._fbList.set(item.MaterialId, item);
        });
        // list.sort((a, b) => Number(a.MaterialId) - Number(b.MaterialId));
        // this._fbList = list;
    }

    public getFbList(): Map<number, MaterialData> {
        return this._fbList;
    }

    // 材料副本配置表数据
    public materialConfig(): Cfg_FB_Material[] {
        const indexer: ConfigIndexer = Config.Get(Config.Type.Cfg_FB_Material);
        const configKeys = indexer.getKeys();
        const items: Cfg_FB_Material[] = [];
        for (let i = 0; i < configKeys.length; i++) {
            const key = configKeys[i];
            const item: Cfg_FB_Material = indexer.getValueByKey(key);
            items.push(item);
        }
        items.sort((a, b) => Number(a.OpenSort) - Number(b.OpenSort));
        return items;
    }

    /** 判断副本是否开启 */
    public condition(conditionString: string): { unlock: boolean, cond: string } {
        if (conditionString === null || conditionString.length <= 0) {
            return { unlock: false, cond: '' };
        }
        const config: string[] = conditionString.split(':');
        const condType = Number(config[0]);
        const condNum = config[1];
        switch (condType) {
            case MaterialUnlockConditionType.Army:
                // 更高阶 和同阶更高级
                return this.armyCase(condNum);
            case MaterialUnlockConditionType.Level:
                {
                    const { chapter, level } = ModelMgr.I.GameLevelModel.getChapterMsg(parseInt(condNum));
                    return {
                        unlock: parseInt(condNum) < RoleMgr.I.d.Stage,
                        cond: UtilString.FormatArray(i18n.tt(Lang.material_tip_passLevel), [`${chapter}-${level}`]),
                    };
                }
                break;
            case MaterialUnlockConditionType.ServerDays:
                return {
                    unlock: UtilFunOpen.serverDays >= Number(condNum),
                    // unlock: false,
                    cond: UtilString.FormatArray(i18n.tt(Lang.material_tip_serverDays), [condNum]),
                };
            default:
                return { unlock: false, cond: '' };
        }
    }

    private armyCase(condNum: string): { unlock: boolean, cond: string } {
        const uArmy = RoleMgr.I.getArmyLevel();
        const uArmyLev = RoleMgr.I.getArmyStar();
        const configArmyInfo = ModelMgr.I.ArmyLevelModel.getArmyuInfoByString(condNum);
        // eslint-disable-next-line max-len
        // const armyConfig: Cfg_ArmyGrade = Config.Get(Config.Type.Cfg_ArmyGrade).getValueByKey(configArmyInfo.army, configArmyInfo.star) as Cfg_ArmyGrade;
        // ModelMgr.I.ArmyLevelModel.getArmyName(configArmyInfo.army, configArmyInfo.star);
        const armyName = ModelMgr.I.ArmyLevelModel.getArmyName(configArmyInfo.army, configArmyInfo.star);

        const tip = UtilString.FormatArray(i18n.tt(Lang.material_tip_army), [armyName]);
        return { unlock: uArmy > configArmyInfo.army || uArmy === configArmyInfo.army && uArmyLev >= configArmyInfo.star, cond: tip };
        return { unlock: false, cond: tip };
    }

    /**
     * 从配置表读取材料副本购买次数消耗数据
     * times 第几次购买
    */
    private materialBuyConfig(times: number): Cfg_MaterialCoin {
        if (times > 4) {
            times = 4;
        }
        const indexer: ConfigIndexer = Config.Get(Config.Type.Cfg_MaterialCoin);
        const config: Cfg_MaterialCoin = indexer.getValueByKey(times + 1);
        return config;
    }

    /** 获取vip表中 当前用户vip等级的可购买次数（材料副本） */
    public configBuyTimes(): number {
        // vip等级从1开始
        const vip = RoleMgr.I.d.VipLevel < 1 ? 1 : RoleMgr.I.d.VipLevel;
        const config: Cfg_VIP = Config.Get(Config.Type.Cfg_VIP).getValueByKey(vip);
        const mitime = config.MITime.split(':')[1];
        const num = Number(mitime);
        return num;
    }

    /**
     * 一键购买
     */
    public totalBuyTip(): { num: number, tip: string } {
        // 一键购买原则 有剩余购买次数的副本  每个副本均购买一次 如果没有剩余购买次数则不购买
        const coinsConfig: Map<number, number> = new Map();
        let count = 0;
        this._fbList.forEach((item) => {
            const buyConfig = this.buyOneConfig(item.MaterialId, item.BuyNum);
            const coinStr = buyConfig.config.Coin;
            const maxTimes = buyConfig.maxTimes;
            if (maxTimes > item.BuyNum) {
                count++;
                const itm = coinStr.split(':');
                const coinType = parseInt(itm[0]);
                const coinNum = parseInt(itm[1]);
                const num = coinsConfig.get(coinType);
                if (num >= 0) {
                    coinsConfig.set(coinType, num + coinNum);
                } else {
                    coinsConfig.set(coinType, coinNum);
                }
            }
        });

        let tipString = '';
        coinsConfig.forEach((val, key) => {
            const itemConfig: Cfg_Item = Config.Get(Config.Type.Cfg_Item).getValueByKey(key);
            tipString += `${val}${itemConfig.Name},`;
        });
        return { num: count, tip: tipString.slice(0, tipString.length - 1) };
    }

    /** 购买单个副本的次数
     * @param times 购买的是第几次
     * @param mid  副本id
    */
    public buyOneConfig(fbId: number, times: number): { mid: number, config: Cfg_MaterialCoin, maxTimes: number, uVIP: string } {
        // 读取配置表数据
        const conf: Cfg_MaterialCoin = this.materialBuyConfig(times);
        const maxT = this.configBuyTimes();
        const vip = RoleMgr.I.d.VipLevel < 1 ? 1 : RoleMgr.I.d.VipLevel;
        const vipName = ModelMgr.I.VipModel.getVipName(vip);
        return {
            mid: fbId, config: conf, maxTimes: maxT, uVIP: vipName,
        };
    }

    /** 获取一键扫荡功能开启条件  vip */
    public getOpenSweepFunCondition(): number {
        const needVip = 0;
        const indexer: ConfigIndexer = Config.Get(Config.Type.Cfg_VIP);
        for (let i = 0; i < indexer.keysLength; i++) {
            const config: Cfg_VIP = indexer.getValueByIndex(i);
            if (config.UnlockFunc.split('|').indexOf(UnlockFunc.materialSweep.toString()) > -1) {
                return i + 1;
            }
        }
        return 0;
    }
    /** 是否开启一键扫荡 */
    public canSweepAll(): boolean {
        const vip = RoleMgr.I.d.VipLevel < 1 ? 1 : RoleMgr.I.d.VipLevel;
        const vipConfig: Cfg_VIP = Config.Get(Config.Type.Cfg_VIP).getValueByKey(vip);
        return vipConfig.UnlockFunc.split('|').indexOf(UnlockFunc.materialSweep.toString()) > -1;
    }
}
