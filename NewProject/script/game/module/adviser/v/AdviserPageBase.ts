/*
 * @Author: zs
 * @Date: 2023-03-06 11:18:18
 * @Description:
 *
 */
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { ACTION_TYPE, ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { WinTabPage } from '../../../com/win/WinTabPage';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { FightValue } from '../../../com/fightValue/FightValue';
import { i18n, Lang } from '../../../../i18n/i18n';
import { EAttrShowType, IAttrInfo } from '../../../base/attribute/AttrConst';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import AdviserModel from '../AdviserModel';
import { AdviserLevel } from '../com/AdviserLevel';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { BeautySkill } from '../../beauty/com/BeautySkill';

const { ccclass, property } = cc._decorator;
@ccclass
export abstract class AdviserPageBase extends WinTabPage {
    @property(cc.Node)
    protected content: cc.Node = null;
    @property(cc.Node)
    protected NodeSkill: cc.Node = null;
    @property(cc.Node)
    protected NodeAnim: cc.Node = null;
    @property(cc.Node)
    protected NodeFull: cc.Node = null;
    @property(cc.Node)
    protected NodeFightValue: cc.Node = null;
    @property(cc.Label)
    protected LabelName: cc.Label = null;

    /** 记录是否已经加载过，防止重复加载同一份预制体 */
    private isLoads: { [tabId: number]: boolean } = [];
    /** 当前选中的红颜id */
    private selectId: number = 0;
    /** 红颜模块model */
    protected model: AdviserModel = null;
    /** 战力组件类 */
    private scriptFightValue: FightValue = null;
    /** 当前展示的技能列表 */
    private skills: string[] = [];
    protected onLoad(): void {
        super.onLoad();
        this.model = ModelMgr.I.AdviserModel;
    }

    /** 更新当前红颜的战力 */
    protected updateFightValue(attrInfo: IAttrInfo): void {
        if (!this.scriptFightValue) {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Com_FightValue, this.NodeFightValue, (e, n) => {
                if (n) {
                    this.scriptFightValue = n.getComponent(FightValue);
                    this.setFightValue(attrInfo.fightValue);
                    this.scriptFightValue.setDetailCallback(() => {
                        const titles = [
                            i18n.tt(Lang.attr_base),
                        ];
                        const infos = this.getAttrDetailTips(titles, attrInfo);
                        WinMgr.I.open(ViewConst.AttrDetailTips, infos);
                    });
                }
            });
        } else {
            this.setFightValue(attrInfo.fightValue);
        }
    }

    /** 设置战力 */
    protected setFightValue(number: number): void {
        this.scriptFightValue?.setValue(number || 0);
    }

    /** 更新显示技能 */
    protected showSkills(ids: string[]): void {
        this.skills = ids;
        if (this.NodeSkill.childrenCount === 0) {
            ResMgr.I.loadLocal(UI_PATH_ENUM.Module_Beauty_Com_BeautySkill, cc.Prefab, (e, p: cc.Prefab) => {
                let skill: string[] = [];
                for (let i = 0, n = this.skills.length; i < n; i++) {
                    skill = this.skills[i].split(':');
                    if (skill) {
                        const child = cc.instantiate(p);
                        child.getComponent(BeautySkill).setData(this.selectId, i, +skill[0], +skill[1], true);
                        this.NodeSkill.addChild(child);
                    }
                }
            });
        } else {
            let skill: string[] = [];
            for (let i = 0, n = Math.max(this.NodeSkill.childrenCount, this.skills.length); i < n; i++) {
                skill = this.skills[i]?.split(':');
                if (skill) {
                    const child = this.NodeSkill.children[i] || cc.instantiate(this.NodeSkill.children[0]);
                    child.getComponent(BeautySkill).setData(this.selectId, i, +skill[0], +skill[1], true);
                    if (!this.NodeSkill.children[i]) {
                        this.NodeSkill.addChild(child);
                    } else {
                        child.active = true;
                    }
                } else {
                    this.NodeSkill.children[i].destroy();
                }
            }
        }
    }
    /** 显示模型 */
    protected showAnim(animId: number, name: string): void {
        this.NodeAnim.destroyAllChildren();
        EntityUiMgr.I.createAnim(this.NodeAnim, animId, ANIM_TYPE.PET, ACTION_TYPE.UI);
        this.LabelName.string = name;
    }

    /** 显示页签组件预制体 */
    protected showPageCom(name: string, path: string): void {
        if (!this.isLoads[name]) {
            this.isLoads[name] = true;
            if (name) {
                ResMgr.I.showPrefabOnce(path, this.content, (e, n) => {
                    const s: AdviserLevel = n.getComponent(name);
                    s.setData(this.selectId);
                });
            }
        } else {
            const node = this.content.getChildByName(name);
            if (node) {
                node.active = true;
                const s: AdviserLevel = node.getComponent(name);
                s.setData(this.selectId);
            }
        }
    }

    /**
    * 根据多个属性info转换成战力详情的格式
    * @param attrInfos 可变长参数，多个属性info
    * @returns
    */
    private getAttrDetailTips(titles: string[], ...attrInfos: IAttrInfo[]) {
        const infos: { title: string, data: string }[] = [];
        attrInfos.forEach((attrInfo, index) => {
            if (attrInfo?.attrs?.length) {
                const baseStr = UtilAttr.GetShowAttrStr(attrInfo.attrs, EAttrShowType.Plus);
                infos.push({ title: titles[index], data: baseStr });
            }
        });
        return infos;
    }
}
