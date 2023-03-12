/*
 * @Author: myl
 * @Date: 2023-01-29 16:26:28
 * @Description:
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass, property } = cc._decorator;

@ccclass('ConfigGeneralPassIndexer')
export default class ConfigGeneralPassIndexer extends ConfigIndexer {
    private static _i: ConfigGeneralPassIndexer = null;
    public static get I(): ConfigGeneralPassIndexer {
        if (!this._i) {
            this._i = new ConfigGeneralPassIndexer(
                ConfigConst.Cfg_Server_GeneralPass,
                ConfigConst.Cfg_Server_GeneralPassRd,
                ConfigConst.Cfg_Server_Welfare,
            );
        }
        return this._i;
    }

    protected _passesMap: Map<string, Cfg_Server_GeneralPass[]> = new Map();
    protected _rdsMap: Map<string, Map<number, Cfg_Server_GeneralPassRd[]>> = new Map();
    protected _welfareMap: Map<string, Cfg_Server_Welfare[]> = new Map();

    protected walks(tableName: string, data: unknown, index: number): void {
        switch (tableName) {
            case ConfigConst.Cfg_Server_GeneralPass.name: {
                // 根据活动类型区分
                const dta = data as Cfg_Server_GeneralPass;
                const actId = dta.Group;
                const arrs = this._passesMap.get(actId) || [];
                arrs.push(dta);
                this._passesMap.set(actId, arrs);
                break;
            }
            case ConfigConst.Cfg_Server_GeneralPassRd.name: {
                // 根据通行证区分
                const dta = data as Cfg_Server_GeneralPassRd;
                const groupId = dta.Group;
                const map = this._rdsMap.get(groupId) || new Map<number, Cfg_Server_GeneralPassRd[]>();
                const actId = dta.PassId;
                const arrs1 = map.get(actId) || [];
                arrs1.push(dta);
                map.set(actId, arrs1);
                this._rdsMap.set(groupId, map);
            }
                break;
            case ConfigConst.Cfg_Server_Welfare.name: {
                // 根据期数类型区分
                const dta = data as Cfg_Server_Welfare;
                const groupId = dta.Group;
                const arrs = this._welfareMap.get(groupId) || [];
                arrs.push(dta);
                this._welfareMap.set(groupId, arrs);
            }
                break;
            default:
                break;
        }
    }

    /** 根据期数group获取所有的通行证 */
    public getPasses(groupId: string): Cfg_Server_GeneralPass[] {
        this._walks();
        return this._passesMap.get(groupId) || [];
    }

    /** 获取单张通行证详细信息 */
    public getPassByKey(passId: number): Cfg_Server_GeneralPass {
        this._walks();
        return this._getValueByKey(ConfigConst.Cfg_Server_GeneralPass.name, passId);
    }

    /** 根据期数获取通行证下的奖励数据 */
    public getRewardsInPass(groupId: string, passId: number): Cfg_Server_GeneralPassRd[] {
        this._walks();
        return this._rdsMap.get(groupId)?.get(passId) || [];
    }

    /** 获取单个奖励的数据 */
    public getRdByKey(id: number): Cfg_Server_GeneralPassRd {
        this._walks();
        return this._getValueByKey(ConfigConst.Cfg_Server_GeneralPassRd.name, id);
    }

    /** 获取单个全民奖励配置数据 */
    public getWelfareByKey(id: number): Cfg_Server_Welfare {
        this._walks();
        return this._getValueByKey(ConfigConst.Cfg_Server_Welfare.name, id);
    }

    /** 根据期数group获取全民奖励 */
    public getWelfareByActId(groupId: string): Cfg_Server_Welfare[] {
        this._walks();
        return this._welfareMap.get(groupId) || [];
    }
}
