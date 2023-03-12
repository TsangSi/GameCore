/*
 * @Author: zs
 * @Date: 2022-05-09 20:46:11
 * @Description: 角色数据管理器
 */
import { RoleEvent } from './RoleEvent';
import { RoleMD } from './RoleMD';
import { RoleInfo } from './RoleInfo';
import { RoleD } from './RoleD';
import { Config } from '../../base/config/Config';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { ItemCurrencyId } from '../../com/item/ItemConst';
import { FvUp } from '../../com/FvUp';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';

export class RoleMgr extends RoleEvent {
    private static _i: RoleMgr = null;
    public static get I(): RoleMgr {
        if (!this._i) {
            this._i = new RoleMgr();
        }
        return this._i;
    }

    private _info: RoleInfo;
    /** 人物属性类 */
    public get info(): RoleInfo {
        if (!this._info) {
            this._info = new RoleInfo();
        }
        return this._info;
    }

    /** 人物属性 */
    private _d: RoleD;
    public get d(): RoleD {
        if (!this._d) {
            this._d = this.info.d;
        }
        return this._d;
    }

    /** 是否初始化过角色属性标记 */
    private isInitInfo: boolean = false;
    /**
     * 更新用户角色信息
     * @param msg 用户角色信息协议结构体
     */
    public updateUserInfo(msg: S2CRoleInfo): void {
        const paramMap: { [key: string]: any } = cc.js.createMap(true);
        const paramMapOld: { [key: string]: any } = cc.js.createMap(true);
        let key: string;
        let old: any = null;
        let change = 0;
        let fvChange: number = 0;
        if (msg.A != null) {
            msg.A.forEach((element) => {
                key = RoleMD.AttrType[element.K];
                old = this.info.d[key];
                if (this.info.d.updateAttr(key, element.V) && this.isInitInfo) {
                    this.emit(key, element.V, old);
                    paramMap[key] = element.V;
                    paramMapOld[key] = old;
                    change++;
                }
                if (key === 'FightValue') {
                    fvChange = element.V;
                }
            });
        }
        if (msg.B != null) {
            msg.B.forEach((element) => {
                key = RoleMD.AttrType[element.K];
                old = this.info.d[key];
                if (this.d.updateAttr(key, element.V) && this.isInitInfo) {
                    this.emit(key, element.V, old);
                    paramMap[key] = element.V;
                    paramMapOld[key] = old;
                    change++;
                }
            });
        }
        if (change > 0) {
            this.emit('All', paramMap, paramMapOld);
            this.emits(paramMap, paramMapOld);
            RedDotCheckMgr.I.onRoleAttr(paramMap);
        }
        this.isInitInfo = true;
        if (fvChange) {
            FvUp.show(fvChange);
        }
    }

    public testUpdateAttr(keys: string[], values: (number | string)[]): void {
        const paramMap: { [key: string]: any } = cc.js.createMap(true);
        const paramMapOld: { [key: string]: any } = cc.js.createMap(true);
        let old: any;
        let change = 0;
        keys.forEach((element, index) => {
            old = this.info[element];
            if (this.d.updateAttr(element, values[index])) {
                this.emit(element, values[index], old);
                paramMap[element] = values[index];
                paramMapOld[element] = old;
                change++;
            }
        });

        this.emits(paramMap, paramMapOld);
        if (change > 0) {
            this.emit('All', paramMap, paramMapOld);
            this.emits(paramMap, paramMapOld);
        }
    }

    public showTips(id: number): void {
        const msg: string = Config.Get(Config.Type.Cfg_Tips).getValueByKey(id, 'Msg');
        MsgToastMgr.Show(msg);
    }

    /**
     * 军衔阶--类似幻1的转生数
     * @returns
     */
    public getArmyLevel(): number {
        return this.d.ArmyLevel;
        // 废弃了下面幻1的做法
        // const _tmp = UtilGame.LevelToLong(this.d.Level);
        // return _tmp[0];
    }

    /**
     * 军衔阶--类似幻1的重数
     */
    public getArmyStar(): number {
        return this.d.ArmyStar;
        // 废弃了下面幻1的做法
        // const _tmp = UtilGame.LevelToLong(this.d.Level);
        // return _tmp[1];
    }

    /**
     * 人物等级
     * (【X转X重X级】中的X级，这是幻1的做法，被废弃，现在是直接获取)
     */
    public getLevel(): number {
        return this.d.Level;
        // 废弃了下面幻1的做法
        // const _tmp = UtilGame.LevelToLong(this.d.Level);
        // return _tmp[2];
    }

    /**
     * 检查角色货币是否足够
     * @param currencyId
     * @param cost
     * @returns boolean
     */
    public checkCurrency(currencyId: ItemCurrencyId, cost: number): boolean {
        switch (currencyId) {
            // 经验
            case ItemCurrencyId.EXP: return this.d.RoleExp >= cost;
            // 玉璧
            case ItemCurrencyId.JADE: return this.d.ItemType_Coin2 >= cost;
            // 元宝
            case ItemCurrencyId.INGOT: return this.d.ItemType_Coin3 >= cost;
            // 铜钱
            case ItemCurrencyId.COIN: return this.d.ItemType_Coin4 >= cost;
            // 金钻
            // case ItemCurrencyId.DIAMOND: return this.d.ItemType_Coin6 > cost;
            // VIP 经验
            case ItemCurrencyId.VIP_EXP: return this.d.VipExp >= cost;
            // SVIP 经验
            // case ItemCurrencyId.SVIP_EXP: return this.d.SuperVipExp >= cost;
            // 战技积分
            case ItemCurrencyId.SKILL_COIN: return this.d.SkillCoin >= cost;
            // 技能经验
            case ItemCurrencyId.SKILL_EXP: return this.d.SkillExp >= cost;
            // 武将金币
            case ItemCurrencyId.GENERAL_SCORE: return this.d.WJZhaoMuScore >= cost;
            // 世家币
            case ItemCurrencyId.FAMILY_COIN: return this.d.FamilyCoin >= cost;
            // 代币(暂未用)
            default: return this.d.ItemType_Coin2 >= cost;
        }
    }

    public getCurrencyById(currencyId: ItemCurrencyId): number {
        switch (currencyId) {
            // 经验
            case ItemCurrencyId.EXP: return this.d.RoleExp;
            // 玉璧
            case ItemCurrencyId.JADE: return this.d.ItemType_Coin2;
            // 元宝
            case ItemCurrencyId.INGOT: return this.d.ItemType_Coin3;
            // 铜钱
            case ItemCurrencyId.COIN: return this.d.ItemType_Coin4;
            // 金钻
            // case ItemCurrencyId.DIAMOND: return this.d.ItemType_Coin6;
            // VIP 经验
            case ItemCurrencyId.VIP_EXP: return this.d.VipExp;
            // SVIP 经验
            // case ItemCurrencyId.SVIP_EXP: return this.d.SuperVipExp;
            // 战技积分
            case ItemCurrencyId.SKILL_COIN: return this.d.SkillCoin;
            // 技能经验
            case ItemCurrencyId.SKILL_EXP: return this.d.SkillExp;
            // 竞技声望
            case ItemCurrencyId.ARENA_COIN: return this.d.ArenaMedal;
            // 获取武将积分
            case ItemCurrencyId.GENERAL_SCORE: return this.d.WJZhaoMuScore;
            // 家族币
            case ItemCurrencyId.FAMILY_COIN: return this.d.FamilyCoin;
            // 礼券
            case ItemCurrencyId.HuarongTicket: return this.d.HuarongTicket;
            // 代币(暂未用)
            default: return this.d.ItemType_Coin2;
        }
    }

    /** 是否是货币 */
    public isCurrency(id: number): boolean {
        return id === ItemCurrencyId.EXP
            || id === ItemCurrencyId.JADE
            || id === ItemCurrencyId.INGOT
            || id === ItemCurrencyId.COIN
            || id === ItemCurrencyId.VIP_EXP
            || id === ItemCurrencyId.SKILL_COIN
            || id === ItemCurrencyId.SKILL_EXP
            || id === ItemCurrencyId.HuarongTicket;
    }

    public getNextExp(): number {
        const indexer = Config.Get(Config.Type.Cfg_Level);
        const ccf: Cfg_Level = indexer.getValueByKey(this._d.Level);
        if (!ccf) {
            return 0;
        }
        const nextCfg: Cfg_Level = indexer.getValueByKey(this._d.Level + 1);
        const nextExp = nextCfg ? nextCfg.NeedExp : ccf.NeedExp;
        return parseInt(nextExp);
    }

    public isMaxExp(): boolean {
        return !Config.Get(Config.Type.Cfg_Level).getValueByKey(this._d.Level + 1);
    }

    /** 获取战力值 字符 */
    public get FightValueString(): string {
        return UtilNum.ConvertFightValue(
            this.d.FightValue,
        );
    }

    public get Rank(): number {
        return this.d.ArenaRank <= 0 ? 20000 : this.d.ArenaRank;
    }

    public get HistoryRank(): number {
        return this.d.ArenaHistoryRank <= 0 ? 20000 : this.d.ArenaHistoryRank;
    }

    /** 用户通关关卡 */
    public get PassLevel(): number {
        return this.d.Stage;
    }

    /** 根据配置表配置的string 获取获取是否充足 */
    public checkByConfig(configStr: string): boolean {
        const cfgs = configStr.split(':');
        if (cfgs.length < 2) {
            return false;
        }
        return this.checkCurrency(Number(cfgs[0]), Number(cfgs[1]));
    }

    /** 根据用户属性关联相对应的货币类型  例如 ItemType_Coin2->2(玉璧)
     *  如果后续att 具有共同点则可以修改该方法
    */
    // public attToCoinType(att: string): number {
    //     let currencyType = 0;
    //     switch (att) {
    //         case 'ItemType_Coin2':
    //             currencyType = 2;
    //             break;
    //         case 'ItemType_Coin3':
    //             currencyType = 3;
    //             break;
    //         case 'ItemType_Coin4':
    //             currencyType = 4;
    //             break;
    //         default:
    //             break;
    //     }
    //     return currencyType;
    // }

    public cTypeToAtt(v: number): string {
        let att = '';
        switch (v) {
            case 5:
                att = 'VipExp';
                break;
            case 7:
                att = 'ArenaMedal';
                break;
            case 8:
                att = 'SkillCoin';
                break;
            case 9:
                att = 'FamilyCoin';
                break;
            case 20:
                att = 'WJZhaoMuScore';
                break;
            case 1301:
                att = 'HuarongTicket';
                break;
            default:
                att = `ItemType_Coin${v}`;
                break;
        }
        return att;
    }
}
