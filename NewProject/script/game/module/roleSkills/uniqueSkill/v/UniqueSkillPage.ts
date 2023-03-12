/*
 * @Author: myl
 * @Date: 2022-10-26 10:29:36
 * @Description:
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import ListView from '../../../../base/components/listview/ListView';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ModelMgr from '../../../../manager/ModelMgr';
import { UniqueSkillItem } from './UniqueSkillItem';

const { ccclass, property } = cc._decorator;

/** 绝学 */
@ccclass
export class UniqueSkillPage extends WinTabPage {
    @property(ListView)
    private listView: ListView = null;

    private _skillCfgs: Cfg_ArmySkill[];
    protected start(): void {
        super.start();
        if (!this._skillCfgs) {
            this._skillCfgs = ModelMgr.I.RoleSkillModel.getArmySkillCfg();
        }
        const len: number = this._skillCfgs.length;
        this.listView.setNumItems(len, 0);

        EventClient.I.on(E.ArmyLevel.ArmySkillActive, this._onArmySkillActive, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.ArmyLevel.ArmySkillActive, this._onArmySkillActive, this);
    }

    public init(param: any): void {
        if (!this._skillCfgs) {
            this._skillCfgs = ModelMgr.I.RoleSkillModel.getArmySkillCfg();
        }
        const len: number = this._skillCfgs.length;
        this.listView.setNumItems(len, 0);
    }
    /** 技能激活 */
    private _onArmySkillActive(skillId: number) {
        let n = 0;
        if (this._skillCfgs) {
            this._skillCfgs = ModelMgr.I.RoleSkillModel.getArmySkillCfg();
        }
        for (let i = 0; i < this._skillCfgs.length; i++) {
            const cfg = this._skillCfgs[i];
            if (cfg.SkillId === skillId) {
                n = i; break;
            }
        }

        // this.listView.updateAll();
        this.listView.updateItem(n);

        WinMgr.I.open(ViewConst.ActiveSkillTip, skillId);
    }

    private scrollEvent(node: cc.Node, index: number) {
        const item: UniqueSkillItem = node.getComponent(UniqueSkillItem);
        item.setData(this._skillCfgs[index]);
    }
}
