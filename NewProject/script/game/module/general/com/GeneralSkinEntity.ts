/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-09-23 10:59:15
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\com\GeneralSkinEntity.ts
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { ConfigAttributeIndexer } from '../../../base/config/indexer/ConfigAttributeIndexer';
import { ConfigGeneralSkinIndexer } from '../../../base/config/indexer/ConfigGeneralSkinIndexer';
import { UtilGame } from '../../../base/utils/UtilGame';
import { FightValue } from '../../../com/fightValue/FightValue';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import EntityBase from '../../../entity/EntityBase';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { GSkinState } from '../gskin/GskinConst';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GeneralSkinEntity extends BaseCmp {
    @property(FightValue)
    private FightValue: FightValue = null;
    @property(cc.Node)
    private NdAnim: cc.Node = null;
    //
    @property(cc.Node)
    private NdStar: cc.Node = null;
    @property(cc.Label)
    private LabStar: cc.Label = null;
    @property(cc.Label)
    private LabTitle: cc.Label = null;
    @property(DynamicImage)
    private SprQuality: DynamicImage = null;
    //
    @property(cc.Node)
    private BtnOn: cc.Node = null;
    @property(cc.Node)
    private BtnOff: cc.Node = null;

    private _onlyId: string = null;
    private _generalSkin: Cfg_GeneralSkin = null;
    private _skinId: number = 0;
    private _role: EntityBase = null;

    protected start(): void {
        super.start();
        this.addE();

        UtilGame.Click(this.BtnOn, () => {
            if (this._onlyId) {
                ControllerMgr.I.GeneralController.reqGeneralWearSkin(this._onlyId, this._skinId);
            }
        }, this);

        UtilGame.Click(this.BtnOff, () => {
            if (this._onlyId) {
                ControllerMgr.I.GeneralController.reqGeneralWearSkin(this._onlyId, 0);
            }
        }, this);
    }

    protected onEnable(): void {
        // if (this._generalSkin) {
        //     this.NdAnim.destroyAllChildren();
        //     this.NdAnim.removeAllChildren();
        //     EntityUiMgr.I.createEntity(this.NdAnim, { resId: this._generalSkin.AnimId, resType: ANIM_TYPE.PET, isPlayUs: false });
        // }
        if (this._role) {
            this._role.resume();
        }
    }

    private addE() {
        EventClient.I.on(E.General.GskinWear, this.uptState, this);
    }

    private remE() {
        EventClient.I.off(E.General.GskinWear, this.uptState, this);
    }

    /** 更新模型战力头衔名字等等的信息 */
    private _skinRes: number = null;
    private _quality: number = null;
    public uptContent(onlyId: string, skinId: number): void {
        if (!onlyId || !skinId) {
            this.node.active = false;
            return;
        }
        // 武将皮肤
        const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
        this._generalSkin = indexer.getSkinData(skinId);
        const needCreateEntity: boolean = this._generalSkin.AnimId !== this._skinRes;
        this._skinRes = this._generalSkin.AnimId;
        this._onlyId = onlyId;
        this._skinId = skinId;
        this.node.active = true;
        // 道具品质
        const itemCfg: Cfg_Item = Config.Get(Config.Type.Cfg_Item).getValueByKey(this._generalSkin.NeedItem);
        // 品质
        if (itemCfg.Quality !== this._quality) {
            this.SprQuality.loadImage(`${RES_ENUM.Com_Font_Com_Font_Quality_Big}${itemCfg.Quality}@ML`, 1, true);
        }
        this._quality = itemCfg.Quality;
        // 名字
        this.LabTitle.string = this._generalSkin.Name;
        // 星
        const star: number = ModelMgr.I.GeneralModel.getSkinStar(this._generalSkin.Key);
        if (star > 0) {
            this.NdStar.active = true;
            this.LabStar.string = `${star}`;
        } else {
            this.NdStar.active = false;
        }
        // 状态
        this.uptState();
        // 战力
        const isNotAwakenSkin = this._generalSkin.AttrId > 0;
        if (isNotAwakenSkin) {
            this.FightValue.node.active = true;
            const attrIndexer: ConfigAttributeIndexer = Config.Get(Config.Type.Cfg_Attribute);
            const fv = attrIndexer.getFightValueById(itemCfg.AttrId);
            let ratio = 1;
            if (star > 0) {
                const cfgStar: Cfg_GeneralSkinStar = Config.Get(Config.Type.Cfg_GeneralSkinStar).getIntervalData(star);
                ratio = (cfgStar.TotalRatio - (cfgStar.MaxLevel - star) * cfgStar.AttrRatio) / 10000;
            }
            this.FightValue.setValue(Math.ceil(fv * ratio));
        } else {
            this.FightValue.node.active = false;
        }

        // 模型
        if (needCreateEntity) {
            this.NdAnim.destroyAllChildren();
            this.NdAnim.removeAllChildren();
            this._role = EntityUiMgr.I.createAttrEntity(this.NdAnim, { resId: this._generalSkin.AnimId, resType: ANIM_TYPE.PET, isPlayUs: false });
        }
    }

    /**
     * uptState
     */
    public uptState(): void {
        const state: GSkinState = ModelMgr.I.GeneralModel.getSkinState(this._onlyId, this._skinId);
        const isActive = state > GSkinState.CanActive;
        const isWear: boolean = ModelMgr.I.GeneralModel.isWear(this._onlyId, this._skinId);
        this.BtnOff.active = isActive && isWear;
        this.BtnOn.active = isActive && !isWear;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
