/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-08-22 21:45:53
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\com\GeneralEntity.ts
 * @Description: 武将模型等等信息
 *
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import { FightValue } from '../../../com/fightValue/FightValue';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { EGeneralUiType, GeneralMsg } from '../GeneralConst';
import GeneralName from './GeneralName';
import ControllerMgr from '../../../manager/ControllerMgr';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import EntityBase from '../../../entity/EntityBase';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { EAttrDataMode, EAttrShowMode, IAttrData } from '../../../com/attr/v/AttrTips';
import { ViewConst } from '../../../const/ViewConst';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import { ConfigGeneralEquipIndexer } from '../../../base/config/indexer/ConfigGeneralEquipIndexer';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GeneralEntity extends BaseCmp {
    // 顶部头像相关信息（和升品的一样）
    @property(cc.Node)
    private NdHeroShow: cc.Node = null;
    @property(FightValue)
    private FightValue: FightValue = null;
    @property(cc.Node)
    private BtnFv: cc.Node = null;
    @property(GeneralName)
    private GeneralName: GeneralName = null;
    @property(cc.Node)
    private NdAnim: cc.Node = null;
    @property(cc.Sprite)
    private SprLock: cc.Sprite = null;
    @property(cc.Sprite)
    private SprTitle: cc.Sprite = null;
    @property(cc.Label)
    private LabTitle: cc.Label = null;

    private _curData: GeneralMsg = null;
    private _role: EntityBase = null;
    private _roleRes: string = '';
    private _generalUiType: EGeneralUiType = EGeneralUiType.None;

    protected start(): void {
        super.start();
        this.addE();

        UtilGame.Click(this.SprLock.node, () => {
            if (this._curData) {
                ControllerMgr.I.GeneralController.reqLock(this._curData.generalData.OnlyId, this._curData.generalData.Lock ? 0 : 1);
            }
        }, this);

        UtilGame.Click(this.BtnFv, () => {
            if (this._generalUiType === EGeneralUiType.Equip) {
                this.showEquipAttr();
            } else {
                this.showAttr();
            }
        }, this);
    }

    protected onEnable(): void {
        if (this._role) {
            this._role.resume();
        }
    }

    private addE() {
        EventClient.I.on(E.General.Lock, this.uptLock, this);
    }

    private remE() {
        EventClient.I.off(E.General.Lock, this.uptLock, this);
    }

    /** 武将属性 */
    public showAttr(): void {
        // 策划又修改为只展示总的属性加成+资质数据
        const attrData: IAttrData[] = [];
        const attr: IAttrData = {
            title: i18n.tt(Lang.general_attr_title),
            sub: [],
        };
        attr.sub.push({ name: i18n.tt(Lang.general_atk), value: `+${this._curData.generalData.Atk}` });
        attr.sub.push({ name: i18n.tt(Lang.general_def), value: `+${this._curData.generalData.Def}` });
        attr.sub.push({ name: i18n.tt(Lang.general_hp), value: `+${this._curData.generalData.Hp}` });

        const attr2: IAttrData = {
            title: i18n.tt(Lang.general_zizhi),
            sub: [],
        };
        attr2.sub.push({ name: i18n.tt(Lang.general_zizhi_atk), value: `${this._curData.generalData.AtkTalent}/${this._curData.generalData.MaxAtkTalent}` });
        attr2.sub.push({ name: i18n.tt(Lang.general_zizhi_def), value: `${this._curData.generalData.DefTalent}/${this._curData.generalData.MaxDefTalent}` });
        attr2.sub.push({ name: i18n.tt(Lang.general_zizhi_hp), value: `${this._curData.generalData.HpTalent}/${this._curData.generalData.MaxHpTalent}` });
        attr2.sub.push({ name: i18n.tt(Lang.general_zizhi_grow), value: `${this._curData.generalData.Grow / 10000}/${this._curData.generalData.MaxGrow / 10000}` });

        attrData.push(attr);
        attrData.push(attr2);

        WinMgr.I.open(ViewConst.AttrTips, attrData, EAttrDataMode.CreateAttrDataByEx, EAttrShowMode.GreenAdd);
    }

    private showEquipAttr() {
        const attrData: IAttrData[] = [];
        const attr: IAttrData = {
            title: i18n.tt(Lang.general_attr_equip),
            sub: [],
        };

        const curLv = this._curData.generalData.EquipData.Level || 1;
        const curStar = this._curData.generalData.EquipData.Star || 1;

        const cfg: ConfigIndexer = Config.Get(Config.Type.Cfg_Genera_EquipStarUp);
        const curCfg: Cfg_Genera_EquipStarUp = cfg.getValueByKey(curLv, curStar);

        // 装备属性
        const wearIds: number[] = this._curData.generalData.EquipData.WearEquips;
        const indexer: ConfigGeneralEquipIndexer = Config.Get(Config.Type.Cfg_Genera_Equip);
        let attrEquip: IAttrBase[] = [];
        // 读之前的属性总和
        if (curCfg.Attr) {
            attrEquip = UtilAttr.GetAttrBaseListById(curCfg.Attr);
        }
        for (let i = 0; i < 4; i++) {
            // 如果有穿上就计算
            if (wearIds.indexOf(i + 1) >= 0) {
                const data: Cfg_Genera_Equip = indexer.getEquipData(i + 1, curLv, curStar);
                const attrBase: IAttrBase[] = UtilAttr.GetAttrBaseListById(data.Attr);
                for (let j = 0; j < attrBase.length; j++) {
                    const index = attrEquip.findIndex((v) => v.attrType === attrBase[j].attrType);
                    if (index >= 0) {
                        attrEquip[index].value += attrBase[j].value;
                    } else {
                        attrEquip.push(attrBase[j]);
                    }
                }
            }
        }
        for (let i = 0; i < attrEquip.length; i++) {
            const name = UtilAttr.GetAttrName(attrEquip[i].attrType);
            const value = attrEquip[i].value;
            attr.sub.push({ name: `${name}：`, value: `${value}` });
        }

        // 装备升星属性
        const attr2: IAttrData = {
            title: i18n.tt(Lang.general_attr_star),
            sub: [],
        };

        const attrPer = curCfg.AttrPer / 100;
        attr2.sub.push({ name: i18n.tt(Lang.general_atk), value: `+${attrPer.toFixed(1)}%` });
        attr2.sub.push({ name: i18n.tt(Lang.general_def), value: `+${attrPer.toFixed(1)}%` });
        attr2.sub.push({ name: i18n.tt(Lang.general_hp), value: `+${attrPer.toFixed(1)}%` });
        attr2.sub.push({ name: i18n.tt(Lang.general_star_growup), value: `+${(curCfg.GrowPer / 10000).toFixed(3)}` });

        attrData.push(attr);
        attrData.push(attr2);
        WinMgr.I.open(ViewConst.AttrTips, attrData, EAttrDataMode.CreateAttrDataByEx, EAttrShowMode.GreenAdd);
    }

    /** 更新模型战力头衔名字等等的信息 */
    private _title: number = null;
    private _rarity: number = null;
    private _lock: number = null;
    private _fv: number = null;
    public uptContent(curData: GeneralMsg, generalUiType: EGeneralUiType = EGeneralUiType.None): void {
        if (!curData) {
            this.NdHeroShow.active = false;
            return;
        }
        const newRoleRes = ModelMgr.I.GeneralModel.getGeneralResByData(curData);
        const needCreateEntity: boolean = newRoleRes !== this._roleRes;

        this._curData = curData;
        this._generalUiType = generalUiType;
        if (!this._curData.cfg) {
            this._curData.cfg = Config.Get(Config.Type.Cfg_General).getValueByKey(this._curData.generalData.IId);
        }
        this.NdHeroShow.active = true;
        // 锁
        if (this._generalUiType === EGeneralUiType.Books) {
            this.SprLock.node.active = false;
        } else {
            this.SprLock.node.active = true;
            if (curData.generalData.Lock !== this._lock) {
                UtilCocos.LoadSpriteFrame(this.SprLock, this._curData.generalData.Lock ? RES_ENUM.Com_Btn_Com_Btn_Suo_2 : RES_ENUM.Com_Btn_Com_Btn_Suo_1);
            }
            this._lock = curData.generalData.Lock;
        }
        // 头衔
        this.showTitle(generalUiType !== EGeneralUiType.Equip);
        // 战力
        if (curData.generalData.Fv !== this._fv) {
            this.FightValue.setValue(this._curData.generalData.Fv);
        }
        this._fv = curData.generalData.Fv;
        // 名字信息
        this.GeneralName.setData(this._curData, generalUiType !== EGeneralUiType.Equip);
        // 模型
        if (needCreateEntity) {
            this.NdAnim.destroyAllChildren();
            this.NdAnim.removeAllChildren();
            this._roleRes = ModelMgr.I.GeneralModel.getGeneralResByData(this._curData);
            this._role = EntityUiMgr.I.createAttrEntity(this.NdAnim, { resId: this._roleRes, resType: ANIM_TYPE.PET, isPlayUs: false });
        }
        // 放大镜
        if (this._generalUiType === EGeneralUiType.Info) {
            this.BtnFv.active = true;
        } else if (this._generalUiType === EGeneralUiType.Equip) {
            this.BtnFv.active = this._curData.generalData.EquipData.Level > 1
                || this._curData.generalData.EquipData.Star > 1
                || this._curData.generalData.EquipData.WearEquips.length > 0;
        } else {
            this.BtnFv.active = false;
        }
    }

    /**
     * 锁的状态
     */
    public uptLock(): void {
        if (this._curData) {
            UtilCocos.LoadSpriteFrame(this.SprLock, this._curData.generalData.Lock ? RES_ENUM.Com_Btn_Com_Btn_Suo_2 : RES_ENUM.Com_Btn_Com_Btn_Suo_1);
        }
    }

    public showTitle(isShow: boolean): void {
        this.SprTitle.node.active = isShow;
        if (isShow) {
            if (!this._curData.cfg) {
                this._curData.cfg = Config.Get(Config.Type.Cfg_General).getValueByKey(this._curData.generalData.IId);
            }
            if (this._curData.cfg.Rarity !== this._rarity || this._curData.generalData.Title !== this._title) {
                UtilGeneral.SetTitle(this.SprTitle, this.LabTitle, { rarity: this._curData.cfg.Rarity, title: this._curData.generalData.Title, type: 1 });
            }
            this._rarity = this._curData.cfg.Rarity;
            this._title = this._curData.generalData.Title;
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
