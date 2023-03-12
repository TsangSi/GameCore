/*
 * @Author: myl
 * @Date: 2022-12-27 17:50:25
 * @Description:
 */

import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { IAttrBase, EAttrType } from '../../../../base/attribute/AttrConst';
import { AttrModel } from '../../../../base/attribute/AttrModel';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { SpriteCustomizer } from '../../../../base/components/SpriteCustomizer';
import { Config } from '../../../../base/config/Config';
import { ConfigConst } from '../../../../base/config/ConfigConst';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilAttr } from '../../../../base/utils/UtilAttr';

import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItemList from '../../../../base/utils/UtilItemList';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { UtilSkillInfo } from '../../../../base/utils/UtilSkillInfo';
import { ItemWhere } from '../../../../com/item/ItemConst';
import { EActiveStatus } from '../../../../const/GameConst';
import { RES_ENUM } from '../../../../const/ResPath';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import { EffectMgr } from '../../../../manager/EffectMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { SUIT_PART_STAR } from '../RoleSkinConst';
import { RoleSkinSuitInfo } from './RoleSkinSuitInfo';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleSkinSpecialSuitInfo extends RoleSkinSuitInfo {
    @property(cc.Node)
    private property2: cc.Node = null;
    @property(cc.Node)
    private property4: cc.Node = null;

    @property(cc.Node)
    private property2Nd: cc.Node = null;
    @property(cc.Node)
    private property4Nd: cc.Node = null;

    @property(cc.RichText)
    private richSkillDesc: cc.RichText = null;

    private _func: (num: number) => void;
    private _attrIds: number[] = [];

    /** 升阶 */
    @property(cc.Node)
    private NdUpGrade: cc.Node = null;
    @property(cc.RichText)
    private richGradeTip: cc.RichText = null;
    @property(cc.Node)
    private BtnUpGrade: cc.Node = null;

    @property(cc.Node)
    private ndMax: cc.Node = null;
    @property(cc.Node)
    private ndGradeInfo: cc.Node = null;
    @property(cc.Node)
    private ndIcon: cc.Node = null;

    @property(cc.Node)
    private ndAttrGrade: cc.Node = null;

    private _suitId: number = 0;

    private _canUpGrade: boolean = false;
    protected start(): void {
        UtilGame.Click(this.BtnUpGrade, () => {
            const _suitGrade = ModelMgr.I.RoleSkinModel.getSpecialGrade(this._suitId);
            const gradeInfo = ModelMgr.I.RoleSpecialSuitModel.specialCanGrade(this._suitId, _suitGrade);

            if (gradeInfo.partInfo.haveNum < gradeInfo.partInfo.totalNum) {
                MsgToastMgr.Show(i18n.tt(Lang.specialSuit_matSkin_unough_tip));
                return;
            } else if (gradeInfo.matInfo.haveMatNum < gradeInfo.matInfo.needNum) {
                WinMgr.I.open(ViewConst.ItemSourceWin, gradeInfo.matInfo.matId);
                return;
            }
            ControllerMgr.I.RoleSpecialSuitController.C2SSuitGradeUp(this._suitId);
        }, this);
    }

    public setData(
        attrIds: number[],
        activeStatus: EActiveStatus[] = [EActiveStatus.UnActive, EActiveStatus.UnActive, EActiveStatus.UnActive],
        hasCount: number = 0,
        func: (num: number) => void = undefined,
        suitId: number = 0,
    ): void {
        this._suitId = suitId;
        this.hasCount = hasCount;
        this.activeStatus = activeStatus;
        this._attrIds = attrIds;
        if (activeStatus[0] === EActiveStatus.Active && activeStatus[2] === EActiveStatus.Active) {
            this.NdUpGrade.active = true;
            this.property2Nd.active = false;
            this.property4Nd.active = false;
            this.updateGradeInfo();
        } else {
            this.NdUpGrade.active = false;
            this.property2Nd.active = true;
            this.property4Nd.active = true;
            for (let i = 0, n = attrIds.length; i < n; i++) {
                const attrId = attrIds[i];
                if (attrId > 0) {
                    const state = activeStatus[i];
                    const nd = i === 0 ? this.property2 : this.property4;
                    const childNd = cc.instantiate(this.NodeInfo);
                    childNd.active = true;
                    nd.addChild(childNd);
                    this.addAttr(nd, attrId, state);
                    if (func) {
                        this._func = func;
                        nd.targetOff(this);
                        UtilGame.Click(nd, () => {
                            if (activeStatus[i] === EActiveStatus.CanActive) {
                                func(i + SUIT_PART_STAR);
                            }
                        }, this, { scale: 1 });
                    }
                }
            }
            if (activeStatus[2] === EActiveStatus.Active) {
                this.richSkillDesc.node.color = UtilColor.Hex2Rgba(UtilColor.NorV);
            } else {
                this.richSkillDesc.node.color = UtilColor.Hex2Rgba(UtilColor.GreyV);
            }
        }
    }

    /** 更新华服套装的信息 */
    private updateGradeInfo() {
        const _suitGrade = ModelMgr.I.RoleSkinModel.getSpecialGrade(this._suitId);
        const gradeInfo = ModelMgr.I.RoleSpecialSuitModel.specialCanGrade(this._suitId, _suitGrade);
        // const indexer: ConfigRoleSkinIndexer = Config.Get(Config.Type.Cfg_RoleSkin);
        // const suitCfg: Cfg_SkinSuit = indexer.getSkinSuitValueByKey(this._suitId);
        if (gradeInfo.isMax) {
            this.ndMax.active = true;
            this.ndGradeInfo.active = false;
            this.richGradeTip.node.active = false;
        } else {
            this.ndMax.active = false;
            this.ndGradeInfo.active = true;
            UtilRedDot.UpdateRed(this.BtnUpGrade, gradeInfo.state, cc.v2(70, 25));
            UtilItemList.ShowItems(this.ndIcon, `${gradeInfo.matInfo.matId}:${gradeInfo.matInfo.needNum}`, {
                option: {
                    needNum: true, where: ItemWhere.OTHER, needLimit: true,
                },
            });

            this.richGradeTip.string = UtilString.FormatArray(i18n.tt(Lang.specialSuit_grade_mat_tip), [_suitGrade + 1,
            gradeInfo.partInfo.haveNum >= gradeInfo.partInfo.totalNum ? UtilColor.GreenV : UtilColor.RedV,
            `${gradeInfo.partInfo.haveNum}/${gradeInfo.partInfo.totalNum}`,
            ]);
            this.richGradeTip.node.active = true;
        }

        const indexer1 = Config.Get(ConfigConst.Cfg_SpecialSuitUp);
        const upGradeCfg: Cfg_SpecialSuitUp = indexer1.getValueByKey(_suitGrade === 0 || !_suitGrade ? 1 : _suitGrade);
        const attrId = upGradeCfg.AttrId;
        const childNd = cc.instantiate(this.NodeInfo);
        childNd.active = true;
        this.ndAttrGrade.addChild(childNd);
        this.addAttr(this.ndAttrGrade, attrId, EActiveStatus.Active);
    }

    /** 界面添加属性信息 */
    private addAttr(node: cc.Node, attrId: number, activeStatu: EActiveStatus) {
        const attrInfo = AttrModel.MakeAttrInfo(attrId);
        const attrs = attrInfo.attrs;
        let nameC = UtilColor.GreyV;
        let valueC = UtilColor.GreyV;
        if (activeStatu === EActiveStatus.Active) {
            nameC = UtilColor.NorV;
            valueC = UtilColor.GreenV;
        }
        const nodeAttrs = node;
        for (let i = 0, n = Math.max(attrs.length, nodeAttrs.children.length); i < n; i++) {
            let node: cc.Node;
            const element: IAttrBase = attrs[i];
            if (element) {
                node = nodeAttrs.children[i] || cc.instantiate(nodeAttrs.children[0]);
                if (!nodeAttrs.children[i]) {
                    nodeAttrs.addChild(node);
                }
            } else {
                node = nodeAttrs.children[i];
                if (node) {
                    node.destroy();
                    nodeAttrs.removeChild(node);
                    node = null;
                }
            }
            if (node) {
                const name = element.name || UtilAttr.GetAttrName(element.attrType);// EAttrName[EAttrType[element.attrType]];
                const value = element.value;
                UtilCocos.SetString(node, 'LabKey', name);
                UtilCocos.SetString(node, 'LabVal', `+${value}`);
                UtilCocos.SetColor(node, 'LabKey', nameC);
                UtilCocos.SetColor(node, 'LabVal', valueC);

                const dyImgNd = node.getChildByName('Icon');
                const dyImg = dyImgNd.getComponent(DynamicImage) || dyImgNd.addComponent(DynamicImage);
                dyImg.loadImage(UtilAttr.getIconByAttrType(element.attrType), 1, true);
            }
        }

        const spritecus = node.getChildByName('SpriteStatu')?.getComponent(SpriteCustomizer);
        if (spritecus) {
            spritecus.curIndex = activeStatu || 0;
        }

        const effectNd = node.parent.getChildByName('EffectNd');
        if (activeStatu === EActiveStatus.CanActive) {
            EffectMgr.I.showEffect(RES_ENUM.Com_Ui_102, effectNd, cc.WrapMode.Loop);
            if (effectNd) effectNd.active = true;
        } else {
            EffectMgr.I.delEffect(RES_ENUM.Com_Ui_102, effectNd);
            if (effectNd) effectNd.active = false;
        }
    }

    public setSkill(suitId: number): void {
        const indexer = Config.Get(ConfigConst.Cfg_SkinSuit);
        const suitCfg: Cfg_SkinSuit = indexer.getValueByKey(suitId);
        const skillId = suitCfg.SkillId;
        if (!skillId) {
            console.log('无技能配置');
            this.richSkillDesc.node.active = false;
        } else {
            this.richSkillDesc.node.active = true;
            const skillCfg = UtilSkillInfo.GetCfg(Number(skillId));
            UtilSkillInfo.GetSkillDesc(skillCfg);
            this.richSkillDesc.string = `${skillCfg.SkillName}:${UtilSkillInfo.GetSkillDesc(skillCfg)}`;// skillCfg.SkillDesc || '';
        }
    }

    // eslint-disable-next-line max-len
    public updateActiveStatus(activeStatus?: EActiveStatus[], hasCount?: number): void {
        if (activeStatus && activeStatus.length) {
            this.activeStatus = activeStatus;
        }
        if (hasCount !== undefined && hasCount !== null) {
            this.hasCount = hasCount;
        }

        this.property2.destroyAllChildren();
        this.property2.removeAllChildren();
        this.property4.destroyAllChildren();
        this.property4.removeAllChildren();
        this.setData(this._attrIds, activeStatus, hasCount, this._func, this._suitId);
    }

    public updateSkill(states: EActiveStatus): void {
        // this.richSkillDesc
    }
}
