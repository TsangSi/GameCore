import { IAttrInfo } from '../../base/attribute/AttrConst';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { AttrModel } from '../../base/attribute/AttrModel';
import { Config } from '../../base/config/Config';
import { ConfigBeautyIndexer } from '../../base/config/indexer/ConfigBeautyIndexer';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { UtilAttr } from '../../base/utils/UtilAttr';

export interface IPartner {
    /** id */
    readonly id: number,
    /** 等级 */
    readonly lv: number,
    /** 等经验 */
    readonly exp: number,
    /** 星级 */
    readonly star: number,
    /** 品质 */
    readonly quality?: number,
    /** 模型id */
    readonly animId?: number,
    /** 名字 */
    readonly name?: number,
}
export abstract class PartnerInfo implements IPartner {
    /** 类名 */
    protected className: string = 'PartnerInfo';
    public constructor(id: number);
    public constructor(data: IPartner);
    public constructor(data: number | IPartner) {
        if (typeof data === 'number') {
            this.id = data;
        } else {
            this.id = data.id || this.id;
            if (data.star) {
                this.updateStar(data.star);
            }
            if (data.exp || data.lv) {
                this.updateExpLevel(data.exp || 0, data.lv || 1);
            }
        }
    }
    /** 唯一id */
    public readonly id: number = 0;

    /** 等级 */
    private _lv: number = 1;
    /** 等级 */
    public get lv(): number {
        return this._lv;
    }
    private set lv(lv: number) {
        if (this._lv !== lv) {
            this._levelAttrInfo.attrs = [];
            this._nextAttrInfo.attrs = [];
        }
        this._lv = lv;
    }

    /** 等级经验值 */
    private _exp: number = 0;
    /** 等级经验值 */
    public get exp(): number {
        return this._exp;
    }

    /** 星级 */
    private _star: number = 1;
    /** 星级 */
    public get star(): number {
        return this._star;
    }

    private set star(star: number) {
        if (this._star !== star) {
            this._starAttrInfo.attrs = [];
            this._nextAttrInfo.attrs = [];
        }
        this._star = star;
    }

    /**
     * 协议下发更新整个info
     */
    public updateInfo(data: IPartner): void {
        this.updateExpLevel(data.exp || this._exp, data.lv || this.lv);
        this.updateStar(data.star || this.star);
    }

    /**
     * 更新红颜星级
     * @param star 星级
     */
    public updateStar(star: number): void {
        this.star = star;
    }
    /**
     * 更新红颜等级
     * @param exp 等级经验值
     * @param level 等级
     */
    public updateExpLevel(exp: number, level?: number): void {
        if (level) {
            this.lv = level;
        } else {
            // 经验换算成等级
        }
        if (exp) {
            this._exp = exp;
        }
    }

    /** 战力 */
    public get fightValue(): number {
        return this.attrInfo.fightValue;
    }

    private _cfg: <T extends ConfigIndexer>;
    public abstract get cfg(): unknown

    private _attrId: number = 0;
    public get attrId(): number {
        if (!this._attrId) {
            this._attrId = this.cfg.getValueByKey(this.id, 'Attr');
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
            const attrId: number = this.cfg.getValueByKeyFromLevel(this.lv, 'AttrId');
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
            if (this.star === 1) {
                return this.baseAttrInfo;
            } else {
                const attrId: number = this.cfg.getValueByKeyFromStar(this.id, this.star, 'Attr');
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
            const attrId: number = this.cfg.getValueByKeyFromStar(this.id, this.star + 1, 'Attr');
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
        return this.star >= this.cfg.getMaxStar(this.id);
    }
}
