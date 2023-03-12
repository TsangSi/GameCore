/* eslint-disable no-loop-func */
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: kexd
 * @Date: 2022-12-22 18:15:39
 * @FilePath: \SanGuo\assets\script\game\module\general\gBook\v\GBookDetailPage.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilBool } from '../../../../../app/base/utils/UtilBool';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import ListView from '../../../../base/components/listview/ListView';
import Progress from '../../../../base/components/Progress';
import { Config } from '../../../../base/config/Config';
import UtilFunOpen from '../../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { UtilSkillInfo } from '../../../../base/utils/UtilSkillInfo';
import { ItemSourceItem } from '../../../../com/item/ItemSourceItem';
import { TipsSkillInfo } from '../../../../com/tips/skillPart/SkillTopPart';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import GeneralEntity from '../../com/GeneralEntity';
import GeneralHead from '../../com/GeneralHead';
import { GSkillItem } from '../../com/GSkillItem';
import { NumberChoose } from '../../../../base/components/NumberChoose';
import {
    EGeneralSkillType,
    EGeneralUiType, ESkillItemShow, ESkillState, GeneralMsg, ISkillEx,
} from '../../GeneralConst';
import { Link } from '../../../link/Link';
import { ActiveInfoSingle } from '../../../../com/attr/ActiveAttrList';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GBookDetailPage extends WinTabPage {
    // 资质属性
    @property(Progress)
    private Progress: Progress[] = [];

    @property(ListView)
    private ListView: ListView = null;

    @property(cc.Node)
    private NdEntity: cc.Node = null;

    @property(cc.Label)
    private LabFrom: cc.Label = null;

    private _curData: GeneralMsg = null;
    private _GeneralEntity: GeneralEntity = null;
    private _generalUiType: EGeneralUiType = EGeneralUiType.None;

    protected start(): void {
        super.start();
        this.addE();
        this.clk();
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.GeneralEntity, this.NdEntity, (err, node) => {
            if (this.NdEntity && this.NdEntity.isValid) {
                this.NdEntity.active = true;
                this._GeneralEntity = node.getComponent(GeneralEntity);
                if (this._curData) {
                    this._GeneralEntity.uptContent(this._curData, this._generalUiType);
                }
            }
        });
    }

    protected onEnable(): void {
        if (this._GeneralEntity) {
            this.NdEntity.active = true;
            this._GeneralEntity.uptContent(this._curData, this._generalUiType);
        }
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        this._curData = param[0];
        // 最高战力
        this._curData.generalData.Fv = ModelMgr.I.GeneralModel.getBookFv(this._curData);

        this.uptEntity(this._curData);
        this.uptUI();
    }

    private addE() {
        // EventClient.I.on(E.General.UptEntity, this.uptEntity, this);
    }

    private remE() {
        // EventClient.I.off(E.General.UptEntity, this.uptEntity, this);
    }

    private uptEntity(msg: GeneralMsg, generalUiType: EGeneralUiType = EGeneralUiType.Books) {
        if (msg) {
            this._curData = msg;
        }
        this._generalUiType = generalUiType;
        if (this._GeneralEntity) {
            this.NdEntity.active = true;
            this._GeneralEntity.uptContent(this._curData, this._generalUiType);
        }
    }

    private clk() {
        //
    }

    private uptUI() {
        this.uptAttr();
        this.ListView.setNumItems(this._curData.generalData.Skills.length);
        //
        const fromId = +this._curData.cfg.FromID;
        const cfgSource: Cfg_ItemSource = Config.Get(Config.Type.Cfg_ItemSource).getValueByKey(fromId);
        if (!cfgSource) return;
        this.LabFrom.string = cfgSource.Desc;

        this.LabFrom.node.targetOff(this);
        UtilGame.Click(this.LabFrom.node, () => {
            Link.To(cfgSource.FuncId);
        }, this);
    }

    private uptAttr() {
        const isChange: boolean = false;
        this.Progress[0].updateProgress(this._curData.generalData.AtkTalent, this._curData.generalData.MaxAtkTalent, isChange);
        this.Progress[1].updateProgress(this._curData.generalData.DefTalent, this._curData.generalData.MaxDefTalent, isChange);
        this.Progress[2].updateProgress(this._curData.generalData.HpTalent, this._curData.generalData.MaxHpTalent, isChange);
        this.Progress[3].toFix = 4;
        this.Progress[3].updateProgress(this._curData.generalData.Grow / 10000, this._curData.generalData.MaxGrow / 10000, isChange);
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: GeneralSkill = this._curData.generalData.Skills[idx];
        const item = node.getComponent(GSkillItem);
        if (item) {
            if (data) {
                const ex: ISkillEx = {
                    skillId: data.SkillId,
                    skillType: data.SkillType,
                    skillLv: data.SkillLv,
                    isLock: !!data.Lock,
                    isShowLock: false,
                    showNameOrLv: ESkillItemShow.OnlyName,
                    isUnStudy: false,
                };
                item.getComponent(GSkillItem).setData(ex, this.clickSkill, this);
            }
        }
    }

    /**
     *
     * @param ex 数据
     * @param clickType 点击类型：1.查看技能 2.激活 3.锁定 4.取消锁定
     */
    private clickSkill(ex: ISkillEx, clickType: number): void {
        if (clickType === 1) {
            const skillCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(ex.skillId);
            const typeName = ModelMgr.I.GeneralModel.getSkillTypeName(ex.skillType);
            const tipsInfo: TipsSkillInfo = {
                skillId: ex.skillId,
                iconId: skillCfg.SkillIconID,
                type: 3,
                skillType: ex.skillType,
                typeName: `类型： ${typeName}`,
                name: skillCfg.SkillName,
                level: ex.skillType === EGeneralSkillType.SkillTalent ? 10000 : 0, // ex.skillLv : 0,
                unlock: ex.skillState,
                unlockString: ex.activeDesc,
            };

            if (ex.skillType === EGeneralSkillType.SkillTalent) {
                WinMgr.I.open(ViewConst.GeneralSkillWin, tipsInfo, this._curData);
                return;
            }

            const skillInfo: ActiveInfoSingle[] = [];
            // 觉醒技能
            if (ex.skillType === EGeneralSkillType.SkillAwaken) {
                // 1. 未激活: 技能效果和升级条件
                if (ex.skillState === ESkillState.UnActive) {
                    skillInfo.push({ title: '技能效果', data: UtilSkillInfo.GetSkillDesc(skillCfg) });
                    skillInfo.push({ title: '激活条件', data: i18n.tt(Lang.general_skill_active) });
                } else if (ex.skillState === ESkillState.CanActive) {
                    // 可激活
                    ControllerMgr.I.GeneralController.reqGeneralAwakenSkill(this._curData.generalData.OnlyId);
                } else {
                    // 已激活
                    skillInfo.push({ title: '技能效果', data: UtilSkillInfo.GetSkillDesc(skillCfg) });
                }
            } else {
                skillInfo.push({ title: '技能效果', data: UtilSkillInfo.GetSkillDesc(skillCfg, ex.skillLv) });
                skillInfo.push({ title: `【${i18n.tt(Lang.com_next_limit)}】`, data: i18n.tt(Lang.com_level_max), infoColor: UtilColor.GreenD });
            }

            WinMgr.I.open(ViewConst.TipsSkillWin, tipsInfo, skillInfo);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
