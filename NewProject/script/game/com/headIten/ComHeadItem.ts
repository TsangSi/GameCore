/* eslint-disable @typescript-eslint/ban-types */
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import { DynamicImage } from '../../base/components/DynamicImage';
import { UtilGame } from '../../base/utils/UtilGame';
import UtilItem from '../../base/utils/UtilItem';
import { RES_ENUM } from '../../const/ResPath';
import { HeadData } from './ConstHead';

const { ccclass, property } = cc._decorator;
@ccclass()
export class ComHeadItem extends BaseCmp {
    // 品质 绿 蓝 紫 橙 红 金 彩
    @property(DynamicImage)
    private sprQuality: DynamicImage = null;
    // 头像
    @property(DynamicImage)
    private sprIcon: DynamicImage = null;
    // 选中框
    @property(cc.Node)
    private sprSelect: cc.Node = null;
    // 勾选
    @property(cc.Node)
    private sprCheck: cc.Node = null;
    // 大的锁
    @property(cc.Node)
    private sprLockBig: cc.Node = null;
    // 锁 & 勾选 公用的背景
    @property(cc.Node)
    private sprMask: cc.Node = null;

    // 等级背景
    @property(cc.Node)
    private sprLevelBg: cc.Node = null;
    // Label等级
    @property(cc.Label)
    private labLevel: cc.Label = null;

    // 左上角稀有度
    @property(DynamicImage)
    private sprTitle: DynamicImage = null;
    @property(cc.Label)
    private labTitle: cc.Label = null;

    // 虎将 名将 勇将...
    @property(DynamicImage)
    private sprRarity: DynamicImage = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.node, this.onClick, this);
    }

    // 点击事件 如有需求，可扩展长按等事件
    private _clickCallBack = null;
    private _customData: any;// 用户自定义数据
    public setData(data: HeadData, clickCallback: Function = null): void {
        // 品质
        const quality = data.quality;
        this.updateQuality(quality);
        // 头像
        const headIconId: number = data.headIconId;
        this.updateHeadIcon(headIconId);
        // 是否选中框
        this.select = data.select;
        // 是否勾选 √
        this.check = data.isCheck;
        // 是否锁住 大的锁
        this.lockBig = data.isLockBig;
        // 锁住与勾选公用背景
        this.sprMask.active = this.sprCheck.active || this.sprLockBig.active;
        // 等级
        this.updateLevel(data.level, data.levelColor);
        // title
        this.updateTitle(data.sprTitlePath, data.labTitle);
        // 虎将 武将 勇将 名将...
        this.updateRarity(data.sprRarityPath);
        this._clickCallBack = clickCallback;
        // 用户自定义数据 例如onlyId beautyid 英雄类型：武将 军师 红颜
        this._customData = data.customData;
    }

    public getCustomData(): any {
        return this._customData;
    }

    /** 可以传参方式 也可以 手动设置 */
    public setClckCallBack(cb: Function): void {
        this._clickCallBack = cb;
    }

    // 品质
    public updateQuality(quality: number): void {
        this.sprQuality.loadImage(UtilItem.GetItemQualityBgPath(quality), 1, true);
    }
    // 头像
    public updateHeadIcon(headIconId: number): void {
        if (headIconId) {
            this.sprIcon.node.active = true;
            // 头像固定在一个文件路径里
            this.sprIcon.loadImage(`${RES_ENUM.HeadIcon}${headIconId}`, 1, true);
        } else {
            this.sprIcon.node.active = false;
        }
    }

    /** 选中框 */
    public set select(b: boolean) {
        this.sprSelect.active = b;
    }
    public get select(): boolean {
        return this.sprSelect.active;
    }

    /** 是否勾选 √ */
    public set check(b: boolean) {
        this.sprCheck.active = b;
        this.sprMask.active = this.sprCheck.active || this.sprLockBig.active;
    }
    public get check(): boolean {
        return this.sprCheck.active;
    }
    /** 是否锁住  大的锁 */
    public set lockBig(b: boolean) {
        this.sprLockBig.active = b;
        this.sprMask.active = this.sprCheck.active || this.sprLockBig.active;
    }
    public get lockBig(): boolean {
        return this.sprLockBig.active;
    }

    // 等级
    public updateLevel(level: string, color: cc.Color): void {
        if (!level && level !== '0') {
            this.labLevel.node.active = false;
            this.sprLevelBg.active = false;
            if (color) {
                this.labLevel.node.color = color;
            }
        } else {
            this.labLevel.string = level;
            this.labLevel.node.active = true;
            this.sprLevelBg.active = true;
        }
    }

    // titile
    public updateTitle(titilePath: string, labTitle: string): void {
        if (titilePath === RES_ENUM.Img_Wujiang_T3_0) {
            console.log(titilePath);
        }
        // 无双 盖世 背景   极品稀有...
        if (titilePath) {
            this.sprTitle.node.active = true;
            // if (msg.rarity === GeneralRarity.Rarity5 && msg.title >= GeneralTitle.Title4) {
            //     title = msg.title - 3;
            // }

            this.sprTitle.loadImage(titilePath, 1, true);
        } else {
            this.sprTitle.node.active = false;
        }

        // 无双 盖世...
        if (labTitle) {
            this.labTitle.node.active = true;
            this.labTitle.string = labTitle;
        } else {
            this.labTitle.node.active = false;
            this.labTitle.string = '';
        }
    }

    // 武将 虎将 勇将...
    public updateRarity(rarityPath: string): void {
        if (rarityPath) {
            this.sprRarity.node.active = true;
            this.sprRarity.loadImage(rarityPath, 1, true);
        } else {
            this.sprRarity.node.active = false;
        }
    }

    protected onDestroy(): void {
        this._clickCallBack = null;
    }

    public onClick(): void {
        if (this._clickCallBack) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this._clickCallBack();
        }
    }
}
