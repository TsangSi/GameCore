/*
 * @Author: zs
 * @Date: 2022-07-11 20:22:34
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\config\indexer\ConfigRoleSkinIndexer.ts
 * @Description:
 *
 */
import { FuncId } from '../../../const/FuncConst';
import { ERoleSkinPageIndex } from '../../../module/roleskin/v/RoleSkinConst';
import { Config } from '../Config';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigRoleSkinIndexer')
export class ConfigRoleSkinIndexer extends ConfigIndexer {
    private static _i: ConfigRoleSkinIndexer;
    public static get I(): ConfigRoleSkinIndexer {
        if (!this._i) {
            this._i = new ConfigRoleSkinIndexer(ConfigConst.Cfg_RoleSkin, ConfigConst.Cfg_SkinSuit);
        }
        return this._i;
    }

    /** 品质栏列表 */
    private skinFields: number[] = [];
    /** 根据品质栏存储的时装索引列表 */
    private skinIndexsByField: { [field: number]: Cfg_RoleSkin[] } = cc.js.createMap(true);
    /** 品质栏列表 */
    private skinSuitFields: number[] = [];
    /** 根据品质栏存储的时装索引列表 */
    private skinSuitIndexsByField: { [field: number]: Cfg_SkinSuit[] } = cc.js.createMap(true);
    /** 根据套装id存储的皮肤id列表 */
    private skinIdsBySuitId: { [suitId: number]: number[] } = cc.js.createMap(true);
    /** 根据华服套装id存储华服套装数据 */
    private skinSpecialSuit: { [suitId: number]: Cfg_SkinSuit } = cc.js.createMap(true);

    /** 炼神吞噬上限索引列表 */
    private lianshenUpIndexs: number[] = [];
    /**  */
    private roleOffY: Map<number, { x: number, y: number }> = new Map();

    protected walks(tableName: string, data: Cfg_RoleSkin | Cfg_SkinSuit, index: number): void {
        if (tableName === ConfigConst.Cfg_RoleSkin.name) {
            this.walkRoleSkin(data as Cfg_RoleSkin, index);
        } else if (tableName === ConfigConst.Cfg_SkinSuit.name) {
            this.walkSkinSuit(data as Cfg_SkinSuit, index);
        }
    }

    public getRoleOffset(AnimId: number): { y: number, x: number } {
        this._walks();
        const off = this.roleOffY.get(AnimId);
        if (off) {
            return off;
        }
        return { y: 0, x: 0 };
    }

    /** 角色时装配置表解析 */
    private walkRoleSkin(data: Cfg_RoleSkin, index: number) {
        if (!data.IsSuit) { // 0 : 时装部件 1：荣誉套装部件 2：华服部件 （）
            if (data.FieldId) {
                if (this.skinIndexsByField[data.FieldId]) {
                    this.skinIndexsByField[data.FieldId].push(data);
                } else {
                    this.skinIndexsByField[data.FieldId] = [data];
                    this.skinFields.push(data.FieldId);
                }
            }
            if (data.LianshenUp) {
                this.lianshenUpIndexs.push(index);
            }

            // 时装皮肤偏移
            if (data.FuncId === FuncId.Skin) {
                const animId = data.AnimId.split('|');
                for (let i = 0; i < animId.length; i++) {
                    const id: number = +animId[i];
                    const animMap = this.roleOffY.get(id);
                    if (!animMap && data.XY) {
                        const off = data.XY.split(',');
                        if (off) {
                            this.roleOffY.set(id, { x: +off[0], y: +off[1] || 0 });
                        }
                    }
                }
            }
        }
    }

    private activitySuitDatasByType: { [type: number]: Cfg_SkinSuit[] } = cc.js.createMap(true);

    /** 皮肤套装表解析 */
    private walkSkinSuit(data: Cfg_SkinSuit, index: number) {
        const skins = data.SkinRequire.split('|');
        if (data.Type === ERoleSkinPageIndex.SkinSuit) {
            // 只有时装套装才有品质栏
            const field: number = this._getValueByKey(Config.Type.Cfg_RoleSkin.name, +skins[0], 'FieldId');
            if (field) {
                if (this.skinSuitIndexsByField[field]) {
                    this.skinSuitIndexsByField[field].push(data);
                } else {
                    this.skinSuitIndexsByField[field] = [data];
                    this.skinSuitFields.push(field);
                }
            }
        } else if (data.Type === ERoleSkinPageIndex.SpecialSuit) { // 华服套装
            this.skinSpecialSuit[data.Id] = data;
        } else {
            const datas = this.activitySuitDatasByType[data.Type] = this.activitySuitDatasByType[data.Type] || [];
            datas.push(data);
        }
        this.skinIdsBySuitId[data.Id] = [];
        skins.forEach((id) => {
            this.skinIdsBySuitId[data.Id].push(+id);
        });
    }

    public getActivitySuitDatas(type: ERoleSkinPageIndex): Cfg_SkinSuit[] {
        return this.activitySuitDatasByType[type] || [];
    }

    /** 获取角色时装品质列表 */
    public getSkinFields(): number[] {
        this._walks();
        return this.skinFields;
    }

    /** 根据品质获取时装索引列表 */
    public getSkinIndexsByField(field: number): Cfg_RoleSkin[] {
        this._walks();
        return this.skinIndexsByField[field];
    }

    public getSkinIndexs(): { [field: number]: Cfg_RoleSkin[] } {
        this._walks();
        return this.skinIndexsByField;
    }

    /** 获取时装套装品质列表 */
    public getSkinSuitFields(): number[] {
        this._walks();
        return this.skinSuitFields;
    }

    /** 根据品质获取时装套装索引列表 */
    public getSkinSuitIndexsByField(field: number): Cfg_SkinSuit[] {
        this._walks();
        return this.skinSuitIndexsByField[field];
    }

    /** 获取当前的所有套装数据 */
    public getSkinSuitIndexs(): { [field: number]: Cfg_SkinSuit[] } {
        this._walks();
        return this.skinSuitIndexsByField;
    }

    public getSkinSuitValue(index: number): object {
        this._walks();
        return this._getValueByIndex(Config.Type.Cfg_SkinSuit.name, index);
    }

    public getSkinSuitValueByKey<T>(...args: (number | string | object)[]): T {
        this._walks();
        return this._getValueByKey(Config.Type.Cfg_SkinSuit.name, ...args);
    }

    /** 根据套装id获取皮肤id列表 */
    public getSkinSuitSkinIds(suitId: number): number[] {
        this._walks();
        return this.skinIdsBySuitId[suitId] || [];
    }

    /** 根据皮肤id获取套装id */
    public getSuitIdBySkinId(skinId: number): number {
        this._walks();
        let ids: number[];
        for (const id in this.skinIdsBySuitId) {
            ids = this.skinIdsBySuitId[id];
            if (ids.indexOf(skinId) >= 0) { return +id; }
        }
        return 0;
    }

    /** 增加炼神吞噬上限索引列表 */
    public getLianshenUpIndexs(): number[] {
        this._walks();
        return this.lianshenUpIndexs;
    }

    /** 获取华服套装所有数据 */
    public getSpecialSuitData(): Cfg_SkinSuit[] {
        this._walks();
        const result: Cfg_SkinSuit[] = [];
        for (const key in this.skinSpecialSuit) {
            const item = this.skinSpecialSuit[key];
            if (item) {
                result.push(item);
            }
        }
        return result.sort((a, b) => a.Id - b.Id);
    }

    public getSuitQuality(suitId: number, type: number): number {
        let data: Cfg_SkinSuit = null;
        if (type === ERoleSkinPageIndex.SpecialSuit) {
            data = this.skinSpecialSuit[suitId];
        } else {
            const suits = this.getActivitySuitDatas(type);
            suits.forEach((e) => {
                if (e.Id === suitId) {
                    data = e;
                }
            });
        }
        // const data: Cfg_SkinSuit = type === ERoleSkinPageIndex.SpecialSuit ? this.skinSpecialSuit[suitId] : ;
        const skins = data.SkinRequire.split('|');
        if (data.Type > ERoleSkinPageIndex.Skin) {
            // 只有时装套装才有品质栏
            const field: number = this._getValueByKey(Config.Type.Cfg_RoleSkin.name, +skins[0], 'FieldId');
            return field <= 0 ? 4 : field;
        }
        return 4;
    }
}
