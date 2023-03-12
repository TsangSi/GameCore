/*
 * @Author: zs
 * @Date: 2022-07-12 17:20:42
 * @FilePath: \SanGuo\assets\script\game\module\roleskin\v\com\RoleSkinCommon.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { Executor } from '../../../../../app/base/executor/Executor';
import { UtilArray } from '../../../../../app/base/utils/UtilArray';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { AssetType } from '../../../../../app/core/res/ResConst';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import ListView from '../../../../base/components/listview/ListView';
import { Config } from '../../../../base/config/Config';
import { ConfigConst } from '../../../../base/config/ConfigConst';
import { ConfigIndexer } from '../../../../base/config/indexer/ConfigIndexer';
import { ConfigRoleSkinIndexer } from '../../../../base/config/indexer/ConfigRoleSkinIndexer';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { UtilSkillInfo } from '../../../../base/utils/UtilSkillInfo';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import { TipsSkillInfo } from '../../../../com/tips/skillPart/SkillTopPart';
import { E } from '../../../../const/EventName';
import { EActiveStatus } from '../../../../const/GameConst';
import { ViewConst } from '../../../../const/ViewConst';
import EntityBase from '../../../../entity/EntityBase';
import EntityUiMgr from '../../../../entity/EntityUiMgr';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { EGeneralSkillType } from '../../../general/GeneralConst';
import { RoleAN } from '../../../role/RoleAN';
import { RoleMgr } from '../../../role/RoleMgr';
import { UtilAttr } from '../../../../base/utils/UtilAttr';
import {
    ERoleSkinPageIndex,
    ESkinPartIndex, ICfgRoleSkin, IRoleSkinItem, SUIT_PART_COUNT,
} from '../RoleSkinConst';
import { EAttrShowMode } from '../../../../com/attr/v/AttrTips';
import { EAttrShowType } from '../../../../base/attribute/AttrConst';
import { RES_ENUM } from '../../../../const/ResPath';
import { ActiveInfoSingle } from '../../../../com/attr/ActiveAttrList';

const { ccclass, property } = cc._decorator;

interface IFieldCfgSkin {
    [field: number]: ICfgRoleSkin[]
}

@ccclass
export class RoleSkinCommon extends BaseCmp {
    @property(cc.Sprite)
    protected SpriteQuality: cc.Sprite = null;
    @property(cc.ToggleContainer)
    protected Togglecontainer: cc.ToggleContainer = null;
    @property(ListView)
    protected ListView: ListView = null;
    @property(ListView)
    protected ListViewField: ListView = null;
    @property(cc.Label)
    protected LabelName: cc.Label = null;
    @property(cc.Node)
    protected NodeAni: cc.Node = null;
    @property(cc.Node)
    private BtnHuanHua: cc.Node = null;
    @property(cc.Node)
    private BtnCancel: cc.Node = null;
    @property(cc.Node)
    private NodeField: cc.Node = null;
    @property(cc.Label)
    private LabelStar: cc.Label = null;
    @property(cc.Label)
    private LabelPower: cc.Label = null;
    @property(cc.Node)
    private NodeStar: cc.Node = null;
    @property(cc.Node)
    private FsActiveDesc: cc.Node = null;
    /** 选中的皮肤id */
    private curSelectSkinId: number = 0;
    private curSelectSkinIndex: number = 0;
    /** 角色时装配置表索引器 */
    private cfgRoleSkinIndexer: ConfigRoleSkinIndexer;
    /** 角色时装升星配置表索引器 */
    private cfgRoleSkinStar: ConfigIndexer;
    private curSelectFiledIndex: number = 0;
    private curSelectFiled: number = 0;
    public skinIds: number[] = [];
    /** 当前显示的皮肤配置 */
    private cfgRoleSkin: ICfgRoleSkin;
    /** 根据皮肤id存储的皮肤NodeItem */
    protected NodeItem: { [skinId: number]: IRoleSkinItem } = cc.js.createMap(true);
    /** 根据品质存储的品质栏node */
    protected fieldNodeItem: { [field: number]: cc.Node } = cc.js.createMap(true);

    @property(cc.Node)
    private skillNode: cc.Node = null;
    // @property(cc.Node)
    // private SkillDescNd: cc.Node = null;

    // @property(cc.RichText)
    // private skillDesc: cc.RichText = null;
    @property(cc.Label)
    private LabSkillName: cc.Label = null;
    @property(DynamicImage)
    private SkillIcon: DynamicImage = null;

    @property(cc.Node)
    private NdNameStar: cc.Node = null;

    @property(cc.Node)
    private BtnCheckDetail: cc.Node = null;

    private _type: ERoleSkinPageIndex = ERoleSkinPageIndex.Skin;
    protected onLoad(): void {
        super.onLoad();
        this.cfgRoleSkinIndexer = Config.Get(Config.Type.Cfg_RoleSkin);
        this.cfgRoleSkinStar = Config.Get(Config.Type.Cfg_RoleSkinStar);
    }

    public setType(type: ERoleSkinPageIndex): void {
        this._type = type;
    }

    protected start(): void {
        super.start();
        /** 华服套装升阶回调 */
        EventClient.I.on(E.RoleSkin.SpecialGradeSuccess, this.updateInfo, this);
        RoleMgr.I.on(this.onUpdateBtnWear, this, RoleAN.N.PlayerSkin, RoleAN.N.GradeWeapon, RoleAN.N.GradeHorse, RoleAN.N.GradeWing);
        UtilGame.Click(this.BtnHuanHua, this.onClickHuanHua, this);
        UtilGame.Click(this.BtnCancel, this.onClickHuanHua, this);
        UtilGame.Click(this.skillNode, this.clickSkill, this);
        UtilGame.Click(this.BtnCheckDetail, this.checkDetail, this);
        EventClient.I.on(E.RoleSkin.NewAddSkin, this.updateInfo, this);
        EventClient.I.on(E.RoleSkin.SkinUpStar, this.updateInfo, this);
        EventClient.I.on(E.RoleSkin.SuitActive, this.updateInfo, this);
    }
    private updateInfo() {
        this.selectSkin(this.curSelectSkinId, undefined, true);
    }
    private checkDetail() {
        // const info = ModelMgr.I.SealAmuletModel.GetCurrInfo(this.contentConfig.Type);
        const model = ModelMgr.I.RoleSkinModel;
        const attmult = model.getSuitMultPartAttrInfo(this.cfgRoleSkin.Id);
        const attgrade = model.getSuitGradeAttrInfo(this.cfgRoleSkin.Id);
        const attPart = model.getSuitAllPartAttrInfo(this.cfgRoleSkin.Id, true, ERoleSkinPageIndex.SpecialSuit);
        const clo = UtilColor.WhiteD;
        const info = [
            { title: i18n.tt(Lang.attr_tip_tanzhuang), data: UtilAttr.GetShowAttrStr(attmult.attrs, EAttrShowType.ColonRich, { nameC: clo }) },
            { title: i18n.tt(Lang.attr_tip_grade), data: UtilAttr.GetShowAttrStr(attgrade.attrs, EAttrShowType.ColonRich, { nameC: clo }) },
            { title: i18n.tt(Lang.attr_tip_part), data: UtilAttr.GetShowAttrStr(attPart.attrs, EAttrShowType.ColonRich, { nameC: clo }) }];

        WinMgr.I.open(ViewConst.AttrDetailTips, info);
    }

    private clickSkill() {
        const indexer = Config.Get(ConfigConst.Cfg_SkinSuit);
        const suitCfg: Cfg_SkinSuit = indexer.getValueByKey(this.cfgRoleSkin.Id);
        const skillid = suitCfg.SkillId;
        const lv = ModelMgr.I.RoleSpecialSuitModel.getSpecialSuitGrade(this.cfgRoleSkin.Id);
        const skillCfg = UtilSkillInfo.GetCfg(Number(skillid), lv);
        const skillInfo: ActiveInfoSingle[] = [];
        const tipsInfo: TipsSkillInfo = {
            skillId: skillCfg.SkillId,
            iconId: skillCfg.SkillIconID,
            type: 0,
            level: lv,
            skillType: EGeneralSkillType.SkillTalent,
            name: skillCfg.SkillName,
        };
        // 技能当前级的描述
        let skillDesc = skillCfg.SkillDesc;
        skillDesc = UtilSkillInfo.GetSkillDesc(skillCfg.SkillId, lv);
        skillInfo.push({ title: i18n.tt(Lang.skill_effect), data: skillDesc });

        const nextSkillInfo = UtilSkillInfo.GetCfg(Number(skillid), lv + 1);
        const nextUpInfo = ModelMgr.I.RoleSkinModel.getUpgradeInfo(lv + 1);
        // 技能下一级的描述
        if (nextSkillInfo && nextUpInfo) {
            const nextSkillDesc = UtilSkillInfo.GetSkillDesc(nextSkillInfo.SkillId, lv + 1);
            skillInfo.push({ title: i18n.tt(Lang.skill_effect_next), data: nextSkillDesc });
            /** 升级条件 */
            skillInfo.push({ title: i18n.tt(Lang.com_next_limit), data: UtilString.FormatArgs(i18n.tt(Lang.specialSuit_skill_next_tip), lv + 1) });
        } else {
            skillInfo.push({ title: i18n.tt(Lang.skill_effect_next), data: `${i18n.tt(Lang.com_null)}` });
            /** 升级条件 */
            skillInfo.push({ title: i18n.tt(Lang.com_next_limit), data: `${i18n.tt(Lang.com_level_max)}` });
        }

        // 技能展开Tips
        WinMgr.I.open(ViewConst.TipsSkillWin, tipsInfo, skillInfo);
    }

    private updateSkill() {
        if (this.cfgRoleSkin.isSuit) {
            const indexer = Config.Get(ConfigConst.Cfg_SkinSuit);
            const suitCfg: Cfg_SkinSuit = indexer.getValueByKey(this.cfgRoleSkin.Id);
            if (suitCfg.Type === ERoleSkinPageIndex.SpecialSuit) {
                this.skillNode.active = true;
                // 获取技能信息
                const skillid = suitCfg.SkillId;
                const lv = ModelMgr.I.RoleSpecialSuitModel.getSpecialSuitGrade(this.cfgRoleSkin.Id);
                const skillCfg = UtilSkillInfo.GetCfg(Number(skillid), lv);
                const skilliconPath = `${RES_ENUM.Skill}${skillCfg.SkillIconID}`;
                this.SkillIcon.loadImage(skilliconPath, 1, true);
                this.LabSkillName.string = skillCfg.SkillName;
                // 判断套装是否激活
                const activeStatus = ModelMgr.I.RoleSkinModel.getSuitActiveStatus(this.cfgRoleSkin.Id);
                const active = activeStatus[0] === EActiveStatus.Active && activeStatus[2] === EActiveStatus.Active;
                if (lv > 0 && active) {
                    // UtilColor.setGray(this.skillNode, false, true);
                } else {
                    this.skillNode.active = false;
                    // UtilColor.setGray(this.skillNode, true, true);
                }
            } else {
                this.skillNode.active = false;
            }
        } else {
            this.skillNode.active = false;
        }
        this.updateSkinItem(this.cfgRoleSkin.Id);
    }

    private fields: number[] = [];
    private selectSkinFunc: Executor;
    /** 显示品质栏 */
    private skinIndexList: IFieldCfgSkin = cc.js.createMap(true);
    public showFields(skinIndexList: ICfgRoleSkin[], selectSkinFunc?: Executor): void;
    public showFields(fields: number[], skinIndexList: IFieldCfgSkin, selectSkinFunc?: Executor): void;
    // eslint-disable-next-line max-len
    public showFields(fields: number[] | ICfgRoleSkin[], skinIndexList?: IFieldCfgSkin | Executor, selectSkinFunc?: Executor): void {
        this.fields = [];
        const redData = this.getRedfiledAndSkinId();
        this.NodeField.active = fields && fields.length && typeof fields[0] === 'number';
        if (this.NodeField.active) {
            this.skinIndexList = skinIndexList as IFieldCfgSkin;
            this.selectSkinFunc = selectSkinFunc;
            this.fields = fields as number[];
            const filedNum = 4;
            const num = Math.min(this.fields.length, filedNum);
            // const viewWidget = this.ListViewField.scrollView.content.getComponent(cc.Widget);
            const size = this.ListViewField.scrollView.node.getContentSize();
            // const width = (size.width - viewWidget.left - viewWidget.right) / filedNum * num + viewWidget.left + viewWidget.right;
            const width = size.width / filedNum * num;
            this.ListViewField.node.setContentSize(width, size.height);
            this.selectQuality(redData.redFiled ? this.fields.indexOf(redData.redFiled) : 0);
            this.selectSkin(redData.redSkinId || this.skinIndexList[this.curSelectFiled][0].Id);
            this.ListViewField.setNumItems(this.fields.length, this.curSelectFiledIndex);
        } else {
            this.selectSkinFunc = skinIndexList as Executor;
            this.skinIndexList[0] = fields as ICfgRoleSkin[];
            this.selectQuality();
            this.selectSkin(redData.redSkinId || this.skinIndexList[0][0].Id);
        }
    }

    private getRedfiledAndSkinId() {
        let redFiled: number = 0;
        let redSkinId: number = 0;

        const reds = this.redStates[this.curSelectFiled || 0];
        if (reds && reds[0]) {
            return { redFiled: this.curSelectFiled, redSkinId: reds[0] };
        } else {
            for (const k in this.redStates) {
                if (this.redStates[k] && this.redStates[k][0]) {
                    if (+k > redFiled) {
                        redFiled = +k;
                        redSkinId = this.redStates[k][0];
                    }
                }
            }
            return { redFiled, redSkinId };
        }
    }

    public showNextRed(): void {
        const redData = this.getRedfiledAndSkinId();
        if (redData.redSkinId !== 0) {
            this.selectQuality(this.fields.indexOf(redData.redFiled));
            this.selectSkin(redData.redSkinId);
        }
    }

    /** 当前选中的皮肤，套装的话就是当前选中的套装id */
    public getSelectSkinId(): number {
        return this.curSelectSkinId;
    }

    /** 套装的时候才有皮肤列表 */
    public getSelectSkinIds(): number[] {
        return this.skinIds;
    }

    public updatePower(v: number): void {
        this.LabelPower.string = `${v}`;
        const model = ModelMgr.I.RoleSkinModel;
        if (!this.cfgRoleSkin.isSuit) {
            const star = model.getSkinStar(this.curSelectSkinId);
            this.NodeStar.active = star > 0;
            if (this.NodeStar.active) {
                this.LabelStar.string = `${UtilNum.ToChinese(star)}`;
            }
            this.BtnCheckDetail.active = false;
        } else {
            const type = model.getSuitType(this.cfgRoleSkin.Id);
            const isactive = model.getSuitIsActive(this.cfgRoleSkin.Id);
            this.BtnCheckDetail.active = type === ERoleSkinPageIndex.SpecialSuit;// && isactive;// ERoleSkinPageIndex.SpecialSuit;
        }
    }

    private onRenderField(node: cc.Node, index: number) {
        const field = this.fields[index];
        this.fieldNodeItem[field] = node;
        UtilCocos.SetString(node, 'LabelName', UtilItem.GetQualityName(this.fields[index]));
        node.targetOff(this);
        UtilGame.Click(node, () => {
            this.selectQuality(index);
            this.selectSkin(this.getSkinDatas()[0].Id);
        }, this);
        if (this.fields.length - 1 === index) {
            UtilCocos.SetActive(node, 'SpriteLineR', true);
        } else {
            UtilCocos.SetActive(node, 'SpriteLineR', false);
        }
        UtilCocos.SetActive(node, 'Checkmark', index === this.curSelectFiledIndex);
        const isShowRed = this.redStates[field] && this.redStates[field].length > 0;
        UtilRedDot.UpdateRed(node, isShowRed, cc.v2(54, 10));
    }

    public updateRed(redStates: { [field: number]: number[] }): void {
        this.redStates = redStates;
        for (const f in this.fieldNodeItem) {
            this.updateRedOne(+f);
        }
        this.skinIndexList[this.curSelectFiled]?.forEach((data) => {
            this.updateRedOne(undefined, data.Id);
        });
    }

    public updateRedOne(filed?: number, skinId?: number): void {
        if (filed !== undefined && filed !== null) {
            const node = this.fieldNodeItem[filed];
            if (node) {
                UtilRedDot.UpdateRed(node, this.redStates[filed]?.length > 0, cc.v2(54, 10));
            }
        }
        if (skinId) {
            const n = this.NodeItem[skinId];
            if (n) {
                filed = filed || this.curSelectFiled;
                const isShow = this.redStates[filed]?.indexOf(skinId) >= 0;
                UtilRedDot.UpdateRed(n, isShow, cc.v2(40, 38));
                if (!this.cfgRoleSkin.isSuit && !isShow && skinId === this.curSelectSkinId) {
                    this.showNextRed();
                }
            }
        }
    }

    private redStates: { [field: number]: number[] } = cc.js.createMap(true);

    /** 名字下面的星级是否显示 */
    public setNodeStarActive(active: boolean): void {
        this.NodeStar.active = active;
    }

    /** 点击幻化 */
    private onClickHuanHua() {
        if (this.cfgRoleSkin.isSuit) {
            ControllerMgr.I.RoleSkinController.C2SSuitWearOrRemove(this.curSelectSkinId);
        } else {
            ControllerMgr.I.RoleSkinController.C2SRoleSkinWearOrRemove(this.curSelectSkinId);
        }
    }

    private getSkinDatas(field?: number) {
        field = field || this.curSelectFiled;
        return this.skinIndexList[field] || this.skinIndexList[0];
    }
    /**
     * 选中品质栏
     * @param index 品质栏索引
     * @param id 皮肤id
     */
    private selectQuality(index?: number): void {
        index = Math.max(0, index) || 0;
        if (this.curSelectFiled === this.fields[index]) {
            return;
        }
        this.updateSelectFieldIndex(index);
        const field = this.fields[index];
        const datas = this.getSkinDatas();
        this.ListView.setNumItems(datas.length);
        if (field) {
            UtilCocos.LoadSpriteFrameRemote(this.SpriteQuality, UtilItem.GetItemQualityFontImgPath(field, true), AssetType.SpriteFrame);
        }
    }

    /** 角色时装数据回来要更新 */
    public updateNodeItems(skinId?: number): void {
        if (skinId) {
            const node = this.NodeItem[skinId];
            if (node && node.isValid) {
                this.updateSkinItem(+skinId);
            }
        } else {
            for (const skinId in this.NodeItem) {
                const node = this.NodeItem[skinId];
                if (node && node.isValid) {
                    this.updateSkinItem(+skinId);
                }
            }
        }
    }

    /** 渲染接口 */
    private onRenderList(node: IRoleSkinItem, index: number) {
        const data: ICfgRoleSkin = this.getSkinDatas()[index];
        node.targetOff(this);
        UtilGame.Click(node, this.onClickSelectSkin, this, { customData: index });
        UtilCocos.SetActive(node, 'NodeSelect', this.curSelectSkinId === data.Id);
        node.attr({ _cfgRoleSkin: data });
        this.NodeItem[data.Id] = node;
        this.updateSkinItem(data.Id);
    }

    /** 更新皮肤item */
    public updateSkinItem(skinId: number): void {
        const node = this.NodeItem[skinId];
        if (!node || !node.isValid) { return; }
        const data: ICfgRoleSkin = node._cfgRoleSkin;
        const itemIcon = node.getChildByName('ItemIcon')?.getComponent(ItemIcon);
        if (itemIcon) {
            if (data.NeedItem) {
                const star = ModelMgr.I.RoleSkinModel.getSkinStar(data.Id);
                itemIcon.node.active = true;
                UtilCocos.SetActive(node, 'SpriteIcon', false);
                const needItemModel = UtilItem.NewItemModel(data.NeedItem);
                itemIcon.setData(needItemModel, { offClick: true, sex: RoleMgr.I.d.Sex, hideLeftLogo: true });
                // itemIcon.setGray(star <= 0, 3);
                const NdMask = itemIcon.node.getChildByName('NdMask');
                if (NdMask) {
                    NdMask.active = star === 0;
                }
                node.getChildByName('NodeStar').active = star > 0;
                const isActive = star > 0;
                if (isActive) {
                    UtilCocos.SetString(node, 'LabelStar', star);
                } else {
                    UtilCocos.SetString(node, 'LabelStar', '');
                }
                const sources = UtilItem.GetCfgItemSources(needItemModel.cfg.FromID);
                const activeDesc: string = sources[0]?.Desc || '';
                const activeNode = UtilCocos.SetActive(node, 'ActiveDesc', !isActive && activeDesc !== '' && activeDesc !== undefined);
                if (!isActive) {
                    UtilCocos.SetString(activeNode, 'DescLabel', `${activeDesc}`);
                }
            } else if (data.IconId) {
                itemIcon.node.active = false;
                const nodeIcon = UtilCocos.SetActive(node, 'SpriteIcon', true);
                const partCount = ModelMgr.I.RoleSkinModel.getSuitActivePartCount(data.Id);

                // eslint-disable-next-line max-len
                UtilCocos.LoadSpriteFrameRemote(nodeIcon.getComponent(cc.Sprite), `${RES_ENUM.Roleskin_Suit_Icon}${data.IconId}`, AssetType.SpriteFrame, (s) => {
                    const grayscale = partCount < SUIT_PART_COUNT;
                    UtilColor.setGray(s.node, grayscale);
                });
                const str = UtilString.FormatArgs(i18n.tt(Lang.com_number), partCount, SUIT_PART_COUNT);
                const labelCount = UtilCocos.SetString(nodeIcon, 'LabelCount', str) as cc.Label;
                if (partCount >= SUIT_PART_COUNT) {
                    labelCount.node.color = UtilColor.Hex2Rgba(UtilColor.GreenV);
                } else {
                    labelCount.node.color = UtilColor.Hex2Rgba(UtilColor.RedD);
                }
                this.updateActiveDesc();
            }
        }
        if (data.isSuit) {
            const typeCfg: Cfg_SkinSuit = Config.Get(ConfigConst.Cfg_SkinSuit).getValueByKey(data.Id);
            if (typeCfg.Type === ERoleSkinPageIndex.SpecialSuit) {
                const red = ModelMgr.I.RoleSpecialSuitModel.specialSuitRedDot(data.Id);
                UtilRedDot.UpdateRed(node, red, cc.v2(40, 38));
            } else {
                UtilRedDot.UpdateRed(node, this.redStates[this.curSelectFiled || 0]?.indexOf(data.Id) >= 0, cc.v2(40, 38));
            }
        } else {
            UtilRedDot.UpdateRed(node, this.redStates[this.curSelectFiled || 0]?.indexOf(data.Id) >= 0, cc.v2(40, 38));
        }
    }

    /** 选中皮肤 */
    private onClickSelectSkin(node: IRoleSkinItem, index: number) {
        this.selectSkin(this.getSkinDatas()[index].Id);
    }

    private getSkinIndex(skinId: number) {
        const datas = this.getSkinDatas();
        for (let i = 0, n = datas.length; i < n; i++) {
            if (datas[i].Id === skinId) {
                return i;
            }
        }
        return 0;
    }

    private selectSkin(skinId: number, fieldId?: number, needRef?: boolean) {
        if (fieldId !== undefined && fieldId !== null) {
            this.selectQuality(this.fields.indexOf(fieldId));
        }

        const model = ModelMgr.I.RoleSkinModel;

        if (this.curSelectSkinId === skinId && !needRef) { return; }
        // this.updateSelectIndex(skinId);
        this.updateSelectIndex(skinId);
        const data: ICfgRoleSkin = this.getSkinDatas()[this.curSelectSkinIndex];
        this.cfgRoleSkin = data;
        this.LabelName.string = this.cfgRoleSkin.Name;

        // this.showAnim(this.cfgRoleSkin);
        if (this.curSelectFiledIndex >= 0 && this.cfgRoleSkin.Quality) {
            // eslint-disable-next-line max-len
            UtilCocos.LoadSpriteFrameRemote(this.SpriteQuality, UtilItem.GetItemQualityFontImgPath(this.cfgRoleSkin.Quality, true), AssetType.SpriteFrame);
        }
        if (this.cfgRoleSkin.isSuit) {
            // 华服套名称显示品阶
            this.NdNameStar.active = false;
            const suitType = model.getSuitType(this.cfgRoleSkin.Id);
            this.NodeStar.active = suitType === ERoleSkinPageIndex.SpecialSuit;
            if (suitType === ERoleSkinPageIndex.SpecialSuit) {
                const isActive = model.getSuitIsActive(this.cfgRoleSkin.Id);
                if (!isActive) {
                    this.NodeStar.active = false;
                } else {
                    const grade = model.getSpecialGrade(this.cfgRoleSkin.Id);
                    this.NodeStar.active = true;
                    this.LabelStar.string = `${UtilNum.ToChinese(grade)}${i18n.jie}`;
                }
            }
            this.skinIds = this.cfgRoleSkinIndexer.getSkinSuitSkinIds(this.curSelectSkinId);
            this.updateActiveDesc();
        } else {
            const star = model.getSkinStar(skinId);
            this.NdNameStar.active = true;
            this.NodeStar.active = star > 0;
            if (this.NodeStar.active) {
                this.LabelStar.string = `${star}`;
            }
        }
        this.onUpdateBtnWear();
        this.selectSkinFunc?.invokeWithArgs(data);

        this.updateSkill();
    }

    private updateActiveDesc() {
        const curType: number = Config.Get(Config.Type.Cfg_SkinSuit).getValueByKey(this.curSelectSkinId, 'Type');
        if (curType !== ERoleSkinPageIndex.ActitySuit) {
            const partCount = ModelMgr.I.RoleSkinModel.getSuitActivePartCount(this.curSelectSkinId);
            const isActive = partCount >= SUIT_PART_COUNT;
            const activeDesc: string = Config.Get(Config.Type.Cfg_SkinSuit).getValueByKey(this.curSelectSkinId, 'ActiveDesc');
            this.FsActiveDesc.active = !isActive && activeDesc !== '' && activeDesc !== undefined;
            const lab1 = UtilColor.GetTextWithColor(i18n.tt(Lang.itemsource_title), UtilColor.OrangeV);
            const lab2 = UtilColor.GetTextWithColor(activeDesc, UtilColor.GreenV);
            UtilCocos.SetString(this.FsActiveDesc, 'FsDescLabel', `${lab1 + lab2}`);
        }
    }

    /** 更新幻化按钮 */
    private onUpdateBtnWear() {
        let isActive = false;
        let isWear = false;
        if (this.cfgRoleSkin.isSuit) {
            for (let i = 0, n = this.skinIds.length; i < n; i++) {
                const suitId = this.cfgRoleSkinIndexer.getSuitIdBySkinId(this.skinIds[i]);
                const indexer = Config.Get(ConfigConst.Cfg_SkinSuit);
                const suitCfg: Cfg_SkinSuit = indexer.getValueByKey(suitId);
                const type = suitCfg.Type;
                isActive = ModelMgr.I.RoleSkinModel.getSkinActive(this.skinIds[i], i, type);
                if (isActive === false) {
                    break;
                }
            }
            isWear = RoleMgr.I.d.PlayerSkin === this.skinIds[ESkinPartIndex.Body];
            isWear = isWear && RoleMgr.I.d.GradeHorse === this.skinIds[ESkinPartIndex.Horse];
            isWear = isWear && RoleMgr.I.d.GradeWing === this.skinIds[ESkinPartIndex.Wing];
            isWear = isWear && RoleMgr.I.d.GradeWeapon === this.skinIds[ESkinPartIndex.Weapon];
        } else {
            isActive = ModelMgr.I.RoleSkinModel.getSkinActive(this.curSelectSkinId);
            isWear = RoleMgr.I.d.PlayerSkin === this.curSelectSkinId;
        }
        this.BtnCancel.active = isWear;
        this.BtnHuanHua.active = !isWear && isActive;
        this.showAnim(this.cfgRoleSkin);
    }

    protected onEnable(): void {
        if (this.entity) {
            this.entity.resume();
        }
    }

    private entity: EntityBase;
    private showAnim(data: ICfgRoleSkin) {
        const resId = ModelMgr.I.RoleSkinModel.getResIdByAnimId(data.AnimId);
        const resType = ANIM_TYPE.ROLE;
        this.NodeAni.destroyAllChildren();
        this.NodeAni.removeAllChildren();
        const suitId: number = data.isSuit ? data.Id : 0;
        this.entity = EntityUiMgr.I.createAttrEntity(this.NodeAni, {
            isMainRole: true, resId, resType, suitId, isShowTitle: false,
        });
    }

    /** 更新选中的皮肤 */
    private updateSelectIndex(skinId: number) {
        const lastNode = this.NodeItem[this.curSelectSkinId];
        if (this.curSelectSkinId !== skinId && lastNode && lastNode.isValid) {
            UtilCocos.SetActive(lastNode, 'NodeSelect', false);
        }
        const node = this.NodeItem[skinId];
        if (node && node.isValid) {
            UtilCocos.SetActive(node, 'NodeSelect', true);
        }
        this.curSelectSkinId = skinId;
        this.curSelectSkinIndex = this.getSkinIndex(skinId);
    }

    private updateSelectFieldIndex(index: number) {
        const lastNode = this.fieldNodeItem[this.curSelectFiled];
        if (this.curSelectFiledIndex !== index && lastNode && lastNode.isValid) {
            UtilCocos.SetActive(lastNode, 'Checkmark', false);
        }
        const node = this.fieldNodeItem[this.fields[index]];
        if (node && node.isValid) {
            UtilCocos.SetActive(node, 'Checkmark', true);
        }
        this.curSelectFiled = this.fields[index];
        this.curSelectFiledIndex = index;
    }
    protected onDestroy(): void {
        RoleMgr.I.off(this.onUpdateBtnWear, this, RoleAN.N.PlayerSkin, RoleAN.N.GradeWeapon, RoleAN.N.GradeHorse, RoleAN.N.GradeWing);
        EventClient.I.off(E.RoleSkin.SpecialGradeSuccess, this.updateInfo, this);
        EventClient.I.off(E.RoleSkin.NewAddSkin, this.updateInfo, this);
        EventClient.I.off(E.RoleSkin.SkinUpStar, this.updateInfo, this);
        EventClient.I.off(E.RoleSkin.SuitActive, this.updateInfo, this);
    }
}
