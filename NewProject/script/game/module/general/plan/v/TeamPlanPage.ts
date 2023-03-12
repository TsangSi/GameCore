import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../../base/anim/AnimCfg';
import ListView from '../../../../base/components/listview/ListView';
import { Config } from '../../../../base/config/Config';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import { EntityUnitType } from '../../../../entity/EntityConst';
import EntityUiMgr from '../../../../entity/EntityUiMgr';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { FightUnitHead } from './FightUnitHead';

/*
 * @Author: zs
 * @Date: 2022-11-16 21:32:31
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\general\plan\v\TeamPlanPage.ts
 * @Description:
 *
 */
enum EPlanPos {
    First = 1,
    Second = 2,
    Three = 3,
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeamPlanPage extends WinTabPage {
    @property(cc.Node)
    private BtnShow: cc.Node = null;
    @property(cc.Node)
    private NodeAvatar: cc.Node = null;
    @property(ListView)
    private ListView: ListView = null;

    @property(cc.Node)
    private NdNull: cc.Node = null;

    /** 选中的唯一id */
    private selectId: string = '';
    /** 选中的助战类型 */
    private selectType: EntityUnitType;
    private fightUnits: LineupUnit[] = [];
    private selectIndex: number = -1;

    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnShow, this.onBtnShow, this);
        EventClient.I.on(E.BattleUnit.UptUnit, this.onUptUnit, this);
        EventClient.I.on(E.Team.PlanList, this.onPlanList, this);
        EventClient.I.on(E.Team.PlanDown, this.onPlanDown, this);
        EventClient.I.on(E.Team.PlanUp, this.onPlanUp, this);
        EventClient.I.on(E.Team.PlanReplace, this.onPlanReplace, this);
        EventClient.I.on(E.Team.PlanChange, this.onPlanChange, this);

        this.NodeAvatar.children.forEach((c, index) => {
            UtilGame.Click(c, 'BtnDown', this.onBtnDown, this, { customData: index + 1 });
            UtilGame.Click(c, 'BtnUp', this.onBtnUp, this, { customData: index + 1 });
        });
        this.onPlanList();
    }

    private scriptFightUnits: { [onlyId: string]: FightUnitHead } = cc.js.createMap(true);
    // protected start(): void {
    //     super.start();
    // }

    private getFightValue(type: EntityUnitType, onlyId: string) {
        switch (type) {
            case EntityUnitType.General:
                return ModelMgr.I.GeneralModel.generalData(onlyId).generalData.Fv;
            case EntityUnitType.Beauty:
                return ModelMgr.I.BeautyModel.getBeauty(+onlyId).fightValue;
            default:
                return 0;
        }
    }

    private onBtnShow() {
        WinMgr.I.open(ViewConst.TeamPlanPreView);
    }

    private onPlanList() {
        this.updatePlanList();
        const nextIndex = Math.min(ModelMgr.I.TeamModel.getLineups().length, this.fightUnits.length - 1);
        if (nextIndex >= 0) {
            this.onUpdateSelect(nextIndex, this.selectType, this.fightUnits[nextIndex].OnlyId);
        }
    }

    private lineupUnitsByPos: { [pos: number]: LineupUnit } = cc.js.createMap(true);
    private updatePlanList() {
        const teamLineups = ModelMgr.I.TeamModel.getLineups();
        const battleLineup = ModelMgr.I.BattleUnitModel.getAllBattleLineup();

        this.lineupUnitsByPos = cc.js.createMap(true);
        const allLineups: LineupUnit[] = [];
        teamLineups.forEach((l) => {
            this.lineupUnitsByPos[l.Pos] = l;
            allLineups.push(l);
        });
        for (const type in battleLineup) {
            let b: LineupUnit;
            for (let i = 0, n = battleLineup[type].length; i < n; i++) {
                b = battleLineup[type][i];
                if (!ModelMgr.I.TeamModel.isLineup(b.OnlyId)) {
                    allLineups.push({ Type: b.Type, Pos: b.Pos, OnlyId: b.OnlyId });
                }
            }
        }

        this.updateListView(allLineups);
        for (let pos = EPlanPos.First; pos <= EPlanPos.Three; pos++) {
            this.updatePet(pos, this.lineupUnitsByPos[pos]);
        }
    }

    private updateListView(fightUnits: LineupUnit[]) {
        fightUnits.sort((a, b) => {
            const aLineup = ModelMgr.I.TeamModel.getLineup(a.OnlyId);
            const bLineup = ModelMgr.I.TeamModel.getLineup(b.OnlyId);
            if (aLineup && bLineup) {
                return a.Pos - b.Pos;
            } else if (aLineup) {
                return -1;
            } else if (bLineup) {
                return 1;
            } else if (a.Type !== b.Type) {
                switch (a.Type) {
                    case EntityUnitType.General:
                        return -1;
                    case EntityUnitType.Beauty:
                        return 1;
                    default:
                        return 1;
                }
            } else {
                return this.getFightValue(a.Type, a.OnlyId) - this.getFightValue(b.Type, b.OnlyId);
            }
        });
        this.fightUnits = fightUnits;
        this.ListView.setNumItems(this.fightUnits.length);
        this.NdNull.active = this.fightUnits.length <= 0;
    }

    private updatePet(pos: number, lineup?: LineupUnit) {
        const node = this.NodeAvatar.children[pos - 1];
        const isNone = !lineup;
        const NdAvatar = UtilCocos.SetActive(node, 'NdAvatar', !isNone);
        UtilCocos.SetActive(node, 'BtnDown', !isNone);
        UtilCocos.SetActive(node, 'BtnUp', isNone);
        if (lineup) {
            this.showAnim(NdAvatar, lineup.Type, lineup.OnlyId);
        }
        // eslint-disable-next-line max-len
        UtilRedDot.UpdateRed(node.getChildByName('BtnUp'), isNone && this.fightUnits.length > ModelMgr.I.TeamModel.getLineups().length, cc.v2(63, 12));
    }

    /**
     * 显示模型和名字
     * @param node 节点
     * @param type 助战类型
     * @param onlyId 助战单位的唯一id
     */
    private showAnim(node: cc.Node, type: EntityUnitType, onlyId: string) {
        node.getChildByName('NdAnim')?.destroyAllChildren();
        switch (type) {
            case EntityUnitType.General:
                this.showGeneral(node, onlyId);
                break;
            case EntityUnitType.Beauty:
                this.showBeauty(node, +onlyId);
                break;
            default:
                break;
        }
    }

    /**
     * 更新选中的助战单位
     * @param type 选中的类型
     * @param selectId 选中的唯一id
     */
    public updateSelect(type?: EntityUnitType, selectId?: string): void {
        this.selectType = type;
        this.selectId = selectId;
        /** 是否已上阵 */
        const isLineup = ModelMgr.I.TeamModel.isLineup(selectId);
        for (let pos = EPlanPos.First; pos <= EPlanPos.Three; pos++) {
            const child = this.NodeAvatar.children[pos - 1];
            if (this.lineupUnitsByPos[pos]) {
                if (isLineup && this.lineupUnitsByPos[pos].OnlyId === selectId) {
                    // 选中的是已经上阵的单位，显示下阵
                    UtilCocos.SetString(child, 'BtnDown/Label', i18n.tt(Lang.team_plan_btn_down));
                } else {
                    UtilCocos.SetString(child, 'BtnDown/Label', i18n.tt(Lang.team_plan_btn_change));
                }
            }
        }
    }

    private onUpdateSelect(index: number, unitType: number, onlyId: string) {
        const node = this.ListView.content.children[this.selectIndex];
        if (node) {
            node.getComponent(FightUnitHead).setSelectActive(false);
        }
        const node2 = this.ListView.content.children[index];
        if (node2) {
            node2.getComponent(FightUnitHead).setSelectActive(true);
        }
        this.selectIndex = index;
        this.updateSelect(unitType, onlyId);
    }

    private onRenderItem(node: cc.Node, index: number) {
        const script = node.getComponent(FightUnitHead);
        script.setData(this.fightUnits[index].Type, this.fightUnits[index].OnlyId, (unitType, onlyId) => {
            this.onUpdateSelect(index, unitType, onlyId);
        });
        script.index = index;
        this.scriptFightUnits[this.fightUnits[index].OnlyId] = script;
    }
    /**
     * 显示武将
     * @param node 节点
     * @param onlyId 武将唯一id
     */
    private showGeneral(node: cc.Node, onlyId: string) {
        const genera = ModelMgr.I.GeneralModel.generalData(onlyId);
        let name = genera?.cfg?.Name;
        if (!name) {
            const cfg: Cfg_General = Config.Get(Config.Type.Cfg_General).getValueByKey(genera.generalData.IId);
            name = cfg.Name;
        }
        UtilCocos.SetString(node, 'NameBg/LabelName', name || '');
        EntityUiMgr.I.createAnim(node.getChildByName('NdAnim'), ModelMgr.I.GeneralModel.getGeneralResByData(genera), ANIM_TYPE.PET);
        UtilCocos.SetString(node, 'NameBg/Sprite/LabelTypeName', i18n.tt(Lang.general_short_name));
    }

    /**
     * 显示红颜
     * @param node 节点
     * @param onlyId 红颜唯一id
     */
    private showBeauty(node: cc.Node, onlyId: number) {
        const beauty = ModelMgr.I.BeautyModel.getBeauty(+onlyId);
        const cfgBeauty: Cfg_Beauty = Config.Get(Config.Type.Cfg_Beauty).getValueByKey(beauty.BeautyId);
        if (cfgBeauty) {
            UtilCocos.SetString(node, 'NameBg/LabelName', cfgBeauty.Name || '');
            EntityUiMgr.I.createAnim(node.getChildByName('NdAnim'), cfgBeauty.AnimId, ANIM_TYPE.PET);
        }
        UtilCocos.SetString(node, 'NameBg/Sprite/LabelTypeName', i18n.tt(Lang.beauty_short_name));
    }

    /** 按钮下阵/替换 点击事件 */
    private onBtnDown(node: cc.Node, pos: number) {
        if (this.lineupUnitsByPos[pos]) {
            const isSelf = this.lineupUnitsByPos[pos].OnlyId === this.selectId;
            ControllerMgr.I.TeamController.C2STeamDunChangeLineup(pos, isSelf ? '' : this.selectId);
        }
    }

    /** 按钮上阵 点击事件 */
    private onBtnUp(node: cc.Node, pos: number) {
        if (this.selectId) {
            ControllerMgr.I.TeamController.C2STeamDunChangeLineup(pos, this.selectId);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.team_plan_btn_tips));
        }
    }

    /** 收到下阵成功事件 */
    private onPlanDown(pos: number, onlyId: string) {
        const script = this.scriptFightUnits[onlyId];
        if (script) {
            // 隐藏头像的出战中
            script.setFightActive(!ModelMgr.I.TeamModel.isLineup(onlyId));
            if (this.lineupUnitsByPos[pos]) {
                // 如果下阵的单位也没有在布阵里出战，那么就不需要显示这个头像了
                if (!ModelMgr.I.BattleUnitModel.isLineupByOnlyId(this.lineupUnitsByPos[pos].Type, onlyId)) {
                    this.fightUnits.splice(script.index, 1);
                }
            }
        }
        delete this.lineupUnitsByPos[pos];
        this.updatePet(pos);
        // this.updateSelect(this.selectType, this.selectId);
        // this.updateListView(this.fightUnits);
        this.updatePlanList();
        const nextIndex = Math.min(ModelMgr.I.TeamModel.getLineups().length, this.fightUnits.length - 1);
        this.onUpdateSelect(nextIndex, this.selectType, this.fightUnits[nextIndex]?.OnlyId);
    }

    /** 收到上阵成功事件 */
    private onPlanUp(pos: number, onlyId: string, type: EntityUnitType, oldOlyId: string) {
        const script = this.scriptFightUnits[onlyId];
        if (script) {
            script.setFightActive(ModelMgr.I.TeamModel.isLineup(onlyId));
        }
        const oldScript = this.scriptFightUnits[oldOlyId];
        if (oldScript) {
            oldScript.setFightActive(ModelMgr.I.TeamModel.isLineup(oldOlyId));
        }

        this.lineupUnitsByPos[pos] = { OnlyId: onlyId, Type: type, Pos: pos };
        this.updatePet(pos, this.lineupUnitsByPos[pos]);
        // this.updateListView(this.fightUnits);
        this.updatePlanList();

        const nextIndex = Math.min(ModelMgr.I.TeamModel.getLineups().length, this.fightUnits.length - 1);
        this.onUpdateSelect(nextIndex, this.fightUnits[nextIndex].Type, this.fightUnits[nextIndex].OnlyId);
    }

    /**
     * 交换位置
     * @param pos 位置1
     * @param onlyId 位置1的唯一id
     * @param type 位置1的类型
     * @param pos2 位置2
     */
    private onPlanReplace(pos: number, onlyId: string, type: EntityUnitType, pos2: number) {
        const temp: LineupUnit = {
            OnlyId: this.lineupUnitsByPos[pos].OnlyId,
            Type: this.lineupUnitsByPos[pos].Type,
            Pos: pos2,
        };
        this.lineupUnitsByPos[pos] = { OnlyId: onlyId, Type: type, Pos: pos };
        this.lineupUnitsByPos[pos2] = temp;
        this.updatePet(pos, this.lineupUnitsByPos[pos]);
        this.updatePet(pos2, this.lineupUnitsByPos[pos2]);
        this.updatePlanList();
        const nextIndex = Math.min(ModelMgr.I.TeamModel.getLineups().length, this.fightUnits.length - 1);
        this.onUpdateSelect(nextIndex, this.fightUnits[nextIndex].Type, this.fightUnits[nextIndex].OnlyId);
    }

    /** 改变位置 */
    private onPlanChange(pos: number, onlyId: string, type: EntityUnitType, pos2: number) {
        this.lineupUnitsByPos[pos] = { OnlyId: onlyId, Type: type, Pos: pos };
        delete this.lineupUnitsByPos[pos2];
        this.updatePet(pos, this.lineupUnitsByPos[pos]);
        this.updatePet(pos2);
        const nextIndex = Math.min(ModelMgr.I.TeamModel.getLineups().length, this.fightUnits.length - 1);
        this.onUpdateSelect(nextIndex, this.fightUnits[nextIndex].Type, this.fightUnits[nextIndex].OnlyId);
    }

    private onUptUnit() {
        this.updatePlanList();

        const nextIndex = Math.min(ModelMgr.I.TeamModel.getLineups().length, this.fightUnits.length - 1);
        if (nextIndex >= 0) {
            this.onUpdateSelect(nextIndex, this.selectType, this.fightUnits[nextIndex].OnlyId);
        } else {
            this.selectId = undefined;
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.BattleUnit.UptUnit, this.onUptUnit, this);
        EventClient.I.off(E.Team.PlanList, this.onPlanList, this);
        EventClient.I.off(E.Team.PlanDown, this.onPlanDown, this);
        EventClient.I.off(E.Team.PlanUp, this.onPlanUp, this);
        EventClient.I.off(E.Team.PlanReplace, this.onPlanReplace, this);
        EventClient.I.off(E.Team.PlanChange, this.onPlanChange, this);
    }
}
