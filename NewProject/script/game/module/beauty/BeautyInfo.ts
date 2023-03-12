import { IAttrInfo } from '../../base/attribute/AttrConst';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { AttrModel } from '../../base/attribute/AttrModel';
import { Config } from '../../base/config/Config';
import { ConfigBeautyIndexer } from '../../base/config/indexer/ConfigBeautyIndexer';
import { UtilAttr } from '../../base/utils/UtilAttr';

export interface IBeauty extends Beauty {
    readonly BeautyId: number,
    readonly Level: number,
    readonly LevelExp: number,
    readonly Star: number
}
export class BeautyInfo implements IBeauty {
    /** 红颜唯一id */
    public readonly BeautyId: number = 0;

    /** 等级 */
    private _Level: number = 1;
    /** 等级 */
    public get Level(): number {
        return this._Level;
    }
    private set Level(lv: number) {
        if (this._Level !== lv) {
            this._levelAttrInfo.attrs = [];
            this._nextAttrInfo.attrs = [];
        }
        this._Level = lv;
    }

    /** 等级经验值 */
    private _LevelExp: number = 0;
    /** 等级经验值 */
    public get LevelExp(): number {
        return this._LevelExp;
    }

    /** 星级 */
    private _Star: number = 1;
    /** 星级 */
    public get Star(): number {
        return this._Star;
    }
    private set Star(star: number) {
        if (this._Star !== star) {
            this._starAttrInfo.attrs = [];
            this._nextAttrInfo.attrs = [];
        }
        this._Star = star;
    }

    public constructor(id: number);
    public constructor(data: IBeauty);
    public constructor(data: number | IBeauty) {
        if (typeof data === 'number') {
            this.BeautyId = data;
        } else {
            this.BeautyId = data.BeautyId || this.BeautyId;
            if (data.Star) {
                this.updateStar(data.Star);
            }
            if (data.LevelExp || data.Level) {
                this.updateExpLevel(data.LevelExp || 0, data.Level || 1);
            }
        }
    }

    /**
     * 协议下发更新整个info
     */
    public updateInfo(data: Beauty): void {
        this.updateExpLevel(data.LevelExp || this._LevelExp, data.Level || this.Level);
        this.updateStar(data.Star || this.Star);
    }

    /**
     * 更新红颜星级
     * @param star 星级
     */
    public updateStar(star: number): void {
        this.Star = star;
    }
    /**
     * 更新红颜等级
     * @param exp 等级经验值
     * @param level 等级
     */
    public updateExpLevel(exp: number, level?: number): void {
        if (level) {
            this.Level = level;
        } else {
            // 经验换算成等级
        }
        if (exp) {
            this._LevelExp = exp;
        }
    }

    /** 战力 */
    public get fightValue(): number {
        return this.attrInfo.fightValue;
    }

    private _cfg: ConfigBeautyIndexer;
    public get cfg(): ConfigBeautyIndexer {
        if (!this._cfg) {
            this._cfg = Config.Get<ConfigBeautyIndexer>(Config.Type.Cfg_Beauty);
        }
        return this._cfg;
    }

    private _attrId: number = 0;
    public get attrId(): number {
        if (!this._attrId) {
            this._attrId = this.cfg.getValueByKey(this.BeautyId, 'Attr');
        }
        return this._attrId;
    }

    private _baseAttrInfo: AttrInfo;
    public get baseAttrInfo(): AttrInfo {
        if (!this._baseAttrInfo) {
            this._baseAttrInfo = AttrModel.MakeAttrInfo(this.attrId);
        }
        return this._baseAttrInfo;
    }

    private _levelAttrInfo: IAttrInfo = cc.js.createMap(true);
    /** 等级属性 */
    public get levelAttrInfo(): IAttrInfo {
        if (!this._levelAttrInfo.attrs?.length) {
            const attrId: number = this.cfg.getValueByKeyFromLevel(this.Level, 'AttrId');
            if (attrId) {
                this._levelAttrInfo.attrs = UtilAttr.GetAttrBaseListById(attrId);
            } else {
                this._levelAttrInfo.attrs = [];
            }
        }
        return this._levelAttrInfo;
    }
    private _starAttrInfo: IAttrInfo = cc.js.createMap(true);
    /** 星级属性 */
    public get starAttrInfo(): IAttrInfo {
        if (!this._starAttrInfo.attrs?.length) {
            // 没有激活属性，1星的话，就是激活属性
            if (this.Star === 1) {
                return this.baseAttrInfo;
            } else {
                const attrId: number = this.cfg.getValueByKeyFromStar(this.BeautyId, this.Star, 'Attr');
                if (attrId) {
                    this._starAttrInfo.attrs = UtilAttr.GetAttrBaseListById(attrId);
                } else {
                    this._starAttrInfo.attrs = [];
                }
            }
        }
        return this._starAttrInfo;
    }

    private _nextAttrInfo: IAttrInfo = cc.js.createMap(true);
    /** 下一星级属性 */
    public get nextStarAttrInfo(): IAttrInfo {
        if (!this._nextAttrInfo.attrs?.length) {
            const attrId: number = this.cfg.getValueByKeyFromStar(this.BeautyId, this.Star + 1, 'Attr');
            if (attrId) {
                this._nextAttrInfo.attrs = UtilAttr.GetAttrBaseListById(attrId);
            } else {
                this._nextAttrInfo.attrs = [];
            }
        }
        return this._nextAttrInfo;
    }

    private _attrInfo: AttrInfo = cc.js.createMap(true);
    /** 总的属性类 */
    public get attrInfo(): AttrInfo {
        /** 有一个为空就需要重新计算 */
        if (!this._attrInfo.attrs?.length || !this._levelAttrInfo.attrs?.length || !this._starAttrInfo.attrs?.length) {
            this._attrInfo = this.baseAttrInfo.clone().add(this.levelAttrInfo, this.starAttrInfo);
        }
        return this._attrInfo;
    }

    /** 是否已满星 */
    public isFullStar(): boolean {
        return this.Star >= this.cfg.getMaxStar(this.BeautyId);
    }
}
