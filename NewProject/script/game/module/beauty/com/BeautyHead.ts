/*
 * @Author: zs
 * @Date: 2022-10-31 21:35:02
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\beauty\com\BeautyHead.ts
 * @Description:
 *
 */
import { UtilBool } from '../../../../app/base/utils/UtilBool';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { ConfigBeautyIndexer } from '../../../base/config/indexer/ConfigBeautyIndexer';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { RES_ENUM } from '../../../const/ResPath';
import { EntityUnitType } from '../../../entity/EntityConst';
import ModelMgr from '../../../manager/ModelMgr';

/** 红颜头像扩展参数接口声明 */
interface IBeautyHeadDataOps {
    /** 是否是打勾的勾选框，默认false */
    isCheckSelect?: boolean,
    /** 回调上下文的this */
    target?: any,
}
const { ccclass, property } = cc._decorator;
@ccclass()
export class BeautyHead extends BaseCmp {
    @property(cc.Label)
    private LabelLevel: cc.Label = null;
    @property(cc.Label)
    private LabelNdSynopsis: cc.Label = null;
    @property(cc.Label)
    private LabelStarVal: cc.Label = null;
    @property(cc.Node)
    private NodeLockB: cc.Node = null;
    @property(cc.Node)
    private NodeSelect: cc.Node = null;
    @property(cc.Node)
    private NodeCheck: cc.Node = null;
    @property(DynamicImage)
    private SpriteBg: DynamicImage = null;
    @property(DynamicImage)
    private SpriteIcon: DynamicImage = null;
    @property(DynamicImage)
    private SpriteQuality: DynamicImage = null;
    @property(cc.Node)
    private NodeBattle: cc.Node = null;
    /** 是否勾选 */
    private isCheckSelect: boolean = false;
    /** 红颜id */
    private id: number = 0;
    /** 选中的回调 */
    private selectCallback: (id: number, isChecked: boolean) => void = null;
    /** 选中的回调上下文this */
    private target: any = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.node, this.onSelectClicked, this);
    }
    private _cfg: ConfigBeautyIndexer;
    private get cfg(): ConfigBeautyIndexer {
        if (!this._cfg) {
            this._cfg = Config.Get(Config.Type.Cfg_Beauty);
        }
        return this._cfg;
    }

    /**
     * 设置红颜头像数据
     * @param id 红颜id
     * @param selectCallback 选中的回调
     * @param ops 红颜头像扩展参数
     */
    public setData(id: number, selectCallback: (id: number, isChecked: boolean) => void, ops?: IBeautyHeadDataOps): void {
        this.id = id;
        this.selectCallback = selectCallback;
        this.target = ops?.target;
        this.isCheckSelect = ops?.isCheckSelect || false;
        if (ModelMgr.I.BeautyModel.isActive(id)) {
            // 已经激活
            const b = ModelMgr.I.BeautyModel.getBeauty(id);
            this.NodeLockB.active = false;
            this.LabelLevel.string = UtilString.FormatArgs(i18n.tt(Lang.com_level), b.Level);
            this.LabelStarVal.string = `${b.Star}`;
            this.LabelStarVal.node.parent.active = true;
        } else {
            this.NodeLockB.active = true;
            this.NodeCheck.active = false;
            this.NodeSelect.active = false;
            this.LabelLevel.string = '';
            // this.LabelNdSynopsis.node.parent.active = false;
            this.LabelStarVal.node.parent.active = false;
        }
        const cfgBeauty = this.cfg.getValueByKey(id, { Quality: 0, AnimId: 0 });
        // 稀有度名称
        const path = UtilItem.GetItemQualityFontImgPath(cfgBeauty.Quality);
        this.SpriteQuality.loadImage(path, ImageType.PNG, true);
        // 品质框
        this.SpriteBg.loadImage(UtilItem.GetItemQualityBgPath(cfgBeauty.Quality), ImageType.PNG, true);
        // 头像
        this.SpriteIcon.loadImage(`${RES_ENUM.HeadIcon}${cfgBeauty.AnimId}`, ImageType.PNG, true);
        // 战斗中
        this.NodeBattle.active = ModelMgr.I.BattleUnitModel.isLineupByOnlyId(EntityUnitType.Beauty, this.id.toString());
    }

    /**
     * 更新战斗中标识显示，不传参就读真实出战情况
     * @param active 是否显示
     */
    public updateBattleFlag(active?: boolean): void {
        if (UtilBool.isNullOrUndefined(active)) {
            this.NodeBattle.active = ModelMgr.I.BattleUnitModel.isLineupByOnlyId(EntityUnitType.Beauty, this.id.toString());
        } else {
            this.NodeBattle.active = active;
        }
    }

    /** 单选 */
    public set select(b: boolean) {
        this.NodeSelect.active = b;
    }
    public get select(): boolean {
        return this.NodeSelect.active;
    }

    /** 选中框，有打勾 */
    public set check(b: boolean) {
        this.NodeCheck.active = b;
    }
    public get check(): boolean {
        return this.NodeCheck.active;
    }

    private onSelectClicked() {
        let result: boolean = false;
        if (this.isCheckSelect) {
            this.check = result = !this.check;
        } else {
            this.select = result = true;
        }
        if (this.selectCallback) {
            if (this.target) {
                this.selectCallback.call(this.target, this.id, result);
            } else {
                this.selectCallback(this.id, result);
            }
        }
    }
}
