/*
 * @Author: zs
 * @Date: 2022-11-09 16:22:07
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\TeamPage.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { ACTION_TYPE, ANIM_TYPE } from '../../../../base/anim/AnimCfg';
import ListView from '../../../../base/components/listview/ListView';
import { Config } from '../../../../base/config/Config';
import { ConfigTeamBossIndexer } from '../../../../base/config/indexer/ConfigTeamBossIndexer';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../../base/utils/UtilCurrency';
import UtilFunOpen from '../../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItemList from '../../../../base/utils/UtilItemList';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import EntityUiMgr from '../../../../entity/EntityUiMgr';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { PlanPageType } from '../../../general/plan/PlanConst';
import { RID } from '../../../reddot/RedDotConst';
import { RedDotMgr } from '../../../reddot/RedDotMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import { ETeamViewType } from '../../../team/TeamConst';
import { TeamModel } from '../../../team/TeamModel';
import { EVipFuncType } from '../../../vip/VipConst';
import MiddleSelect from './com/MiddleSelect';
import { TeamTypeItem } from './com/TeamTypeItem';
import { TeamTypeLevelItem } from './com/TeamTypeLevelItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeamPage extends WinTabPage {
    /** 滑动组件-等级 */
    @property(MiddleSelect)
    private MiddleSelect: MiddleSelect = null;
    /** 滑动组件-类型 */
    @property(ListView)
    private ListViewType: ListView = null;
    /** 模型 */
    @property(cc.Node)
    private NodeAnim: cc.Node = null;
    /** 奖励父节点 */
    @property(cc.Node)
    private NodeReward: cc.Node = null;
    /** 组队阵营 */
    @property(cc.Node)
    private BtnPlan: cc.Node = null;
    /** 扫荡 */
    @property(cc.Node)
    private BtnSweep: cc.Node = null;
    /** 组队挑战 */
    @property(cc.Node)
    private BtnTeam: cc.Node = null;
    /** 增加挑战次数 */
    @property(cc.Node)
    private BtnAdd: cc.Node = null;
    /** 查看按钮 */
    @property(cc.Node)
    private BtnCheck: cc.Node = null;
    /** 勾选收到邀请默认接受 */
    @property(cc.Toggle)
    private Toggle: cc.Toggle = null;
    /** 协助次数 */
    @property(cc.Label)
    private LabelAssistNum: cc.Label = null;
    /** 挑战次数 */
    @property(cc.Label)
    private LabelBattleNum: cc.Label = null;
    // @property(cc.Prefab)
    // private PrefabLevelItem: cc.Prefab = null;

    /** 选中的副本类型 */
    private selectType: number;
    /** 选中的副本id */
    private selectId: number;
    private showTypes: number[] = [];
    private showFBIds: number[] = [];
    private levelItems: { [index: number]: TeamTypeLevelItem } = cc.js.createMap(true);
    private typeItems: { [index: number]: TeamTypeItem } = cc.js.createMap(true);
    private model: TeamModel = null;

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        super.refreshPage(winId, param, tabIdx, tabId);
        this.updatePgae(param);
    }

    private updatePgae(param: unknown) {
        const hasTeam = ModelMgr.I.TeamModel.hasTeam();
        if (param) {
            this.show(param[2]);
        } else if (hasTeam) {
            this.show({ fbId: ModelMgr.I.TeamModel.myTeamFbId });
        } else {
            this.show();
        }
        if (hasTeam) {
            this.onBtnTeamClicked();
        }
    }

    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        this.model = ModelMgr.I.TeamModel;
        UtilGame.Click(this.BtnPlan, this.onBtnPlanClicked, this);
        UtilGame.Click(this.BtnSweep, this.onBtnSweepClicked, this);
        UtilGame.Click(this.BtnTeam, this.onBtnTeamClicked, this);
        UtilGame.Click(this.BtnAdd, this.onBtnAddClicked, this);
        UtilGame.Click(this.BtnCheck, this.onBtnCheckClicked, this);
        UtilGame.Click(this.Toggle.node, this.onToggle, this);

        EventClient.I.on(E.Team.UpdateTeamInfo, this.onUpdateTeamInfo, this);
        EventClient.I.on(E.Team.UpdateBuyPassTime, this.onUpdateBuyPassTime, this);

        this.Toggle.isChecked = RoleMgr.I.d.TeamDunAccept === 1;

        // this.MiddleSelect.setCheckFunc((index) => this.levelItems[index].isCanSelect(true));
        this.updatePgae(param);
        UtilRedDot.Bind(RID.MaterialFB.Team.TeamPlan, this.BtnPlan, cc.v2(23, 27));
    }

    private show(param?: { fbId?: number, exParam?: number }) {
        this.showTypes.length = 0;
        this.model.cfg.forEach((cfg: Cfg_TeamBoss) => {
            this.showTypes.push(cfg.Id);
            return true;
        });
        let fbType: number;
        let fbId: number;
        if (param) {
            const p: { fbId?: number, exParam?: number } = param;
            if (p.fbId) {
                const cfgTBLevel: Cfg_TeamBoss_Level = this.model.cfg.getValueByKeyFromLevel(p.fbId);
                if (cfgTBLevel) {
                    fbType = cfgTBLevel.FBId;
                }
                fbId = p.fbId;
            }
        }
        this.updateSelectType(fbType || this.showTypes[0], fbId);
        this.ListViewType.setNumItems(this.showTypes.length);
    }

    /** 更新界面 */
    private updateView() {
        this.updateBattleNum();
        this.updateAssistNum();
    }

    /** 更新战斗次数 */
    private updateBattleNum() {
        const type = this.selectType || this.showTypes[0];
        if (type) {
            const maxNum: number = this.model.cfg.getValueByKey(type, 'NOLimit');
            const num = this.model.getPassTime(type);
            this.LabelBattleNum.string = `${num}/${maxNum}`;
            this.LabelBattleNum.node.color = num > 0 ? UtilColor.ColorEnoughV : UtilColor.ColorUnEnoughV;
            // RedDotMgr.I.getStatus(RID.MaterialFB.Team.Type + this.showTypes.indexOf(this.selectType));
            const isShowRed = num > 0;
            UtilCocos.SetActive(this.BtnTeam, 'RedDot', isShowRed && this.levelItems[this.showFBIds.indexOf(this.selectId)].isCanSelect(false));
            UtilCocos.SetActive(this.BtnSweep, 'RedDot', isShowRed && this.model.isCanSweep(this.selectId));
        }
    }

    /** 更新协助次数 */
    private updateAssistNum() {
        const type = this.selectType || this.showTypes[0];
        if (type) {
            const maxNum: number = this.model.cfg.getValueByKey(type, 'HelpNO');
            const num = this.model.getHelpPassTime(type);
            this.LabelAssistNum.string = `${num}/${maxNum}`;
            this.LabelAssistNum.node.color = num > 0 ? UtilColor.ColorEnoughV : UtilColor.ColorUnEnoughV;
        }
    }

    /** 副本类型点击 */
    private onSelectTypeClicked(node: cc.Node, data: { index: number, funcId: number }) {
        if (UtilFunOpen.isOpen(data.funcId, true)) {
            const idx = this.showTypes.indexOf(this.selectType);
            if (idx >= 0 && this.typeItems[idx]) {
                this.typeItems[idx].select = false;
            }
            this.updateSelectType(this.showTypes[data.index]);
            if (this.typeItems[data.index]) {
                this.typeItems[data.index].select = true;
            }
        }
    }

    /** 副本等级点击 */
    private onSelectLevelClicked(index: number) {
        if (this.levelItems[index]) {
            const idx = this.showFBIds.indexOf(this.selectId);
            if (idx >= 0 && this.levelItems[idx]) {
                this.levelItems[idx].select = false;
            }
            this.updateSelectLevel(this.showFBIds[index]);
            this.levelItems[index].select = true;
            return true;
        }
        return false;
    }

    /** 显示中的模型id */
    private showAnimId: number = 0;
    /** 显示中的奖励列表 */
    private showReward: string = '';
    /**
     * 更新选中的副本等级
     * @param fbId 副本id
     * @returns
     */
    private updateSelectLevel(fbId: number) {
        if (this.selectId === fbId) { return; }

        this.selectId = fbId;
        const indexs: number[] = this.model.cfg.getValueByKeyFromMonster(this.selectId);
        if (indexs) {
            const cfgTBMonster: Cfg_TeamBoss_Monster = this.model.cfg.getValueFromMonster(indexs[indexs.length - 1]);
            const mIds: string = Config.Get(Config.Type.Cfg_Refresh).getValueByKey(cfgTBMonster.RefreshId, 'MonsterIds');
            if (mIds) {
                const mId = mIds.split('|');
                const animId: number = Config.Get(Config.Type.Cfg_Monster).getValueByKey(+mId[0], 'AnimId');
                if (this.showAnimId !== animId) {
                    this.NodeAnim.destroyAllChildren();
                    EntityUiMgr.I.createAnim(this.NodeAnim, animId, ANIM_TYPE.PET, ACTION_TYPE.UI);
                    this.showAnimId = animId;
                }
            }
        }
        const reward: string = this.model.cfg.getValueByKeyFromLevel(this.selectId, 'ShowReward');
        if (this.showReward !== reward) {
            UtilItemList.ShowItems(this.NodeReward, reward, { option: { needNum: true } });
            this.showReward = reward;
        }

        UtilColor.setGray(this.BtnSweep, !this.model.isCanSweep(fbId), true);
        UtilColor.setGray(this.BtnTeam, !this.levelItems[this.showFBIds.indexOf(this.selectId)].isCanSelect(false), true);
        this.updateView();
    }
    /**
     * 更新选中的副本类型
     * @param type 副本类型
     * @returns
     */
    private updateSelectType(type: number, fbId?: number) {
        if (this.selectType === type) { return; }
        this.selectType = type;

        this.showFBIds = this.model.cfg.getFBIds(type);
        let index: number = 0;
        if (!fbId) {
            for (let i = 0, n = this.showFBIds.length; i < n; i++) {
                const c: Cfg_TeamBoss_Level = this.model.cfg.getValueByKeyFromLevel(this.showFBIds[i]);
                if (c && c.LevelLimit <= RoleMgr.I.d.Level && (i === 0 || this.model.isPass(this.showFBIds[i - 1]))) {
                    fbId = this.showFBIds[i];
                    index = i;
                }
            }
        } else {
            index = this.showFBIds.indexOf(fbId);
        }
        this.MiddleSelect.setNumItems(this.showFBIds.length, index);
        this.updateSelectLevel(fbId);
    }

    /** 副本类型 */
    private onRenderItemType(node: cc.Node, index: number) {
        const cfg = ConfigTeamBossIndexer.I.getValueByKey(this.showTypes[index], { Name: '', FunctionLimit: 0 });
        const script = node.getComponent(TeamTypeItem);
        const fbType = this.showTypes[index];
        script.fbType = fbType;
        script.select = this.selectType === fbType;
        node.targetOff(this);
        UtilGame.Click(node, this.onSelectTypeClicked, this, { customData: { index, funcId: cfg.FunctionLimit } });
        this.typeItems[index] = script;
        UtilRedDot.UpdateRed(node, RedDotMgr.I.getStatus(RID.MaterialFB.Team.Type + index), cc.v2(25, 33));
    }

    /** 副本等级 */
    private onRednerItemLevel(node: cc.Node, index: number) {
        const cfg: Cfg_TeamBoss_Level = this.model.cfg.getValueByKeyFromLevel(this.showFBIds[index]);
        const script = node.getComponent(TeamTypeLevelItem);
        script.setData(cfg.LevelLimit, index, this.showFBIds[index - 1]);
        script.select = this.selectId === cfg.Id;
        this.levelItems[index] = script;
    }

    private onBtnPlanClicked() {
        WinMgr.I.open(ViewConst.PlanWin, PlanPageType.TeamPlan);
    }

    private onBtnSweepClicked() {
        if (this.model.isCanSweep(this.selectId, true)) {
            ControllerMgr.I.TeamController.C2STeamDunSweep(this.selectId);
        }
    }

    private onBtnTeamClicked() {
        if (ModelMgr.I.TeamModel.hasTeam()) {
            ControllerMgr.I.TeamController.C2SMyTeamInfo();
        }
        if (this.levelItems[this.showFBIds.indexOf(this.selectId)].isCanSelect(true)) {
            WinMgr.I.open(ViewConst.TeamWin, this.selectType, this.selectId);
        }
    }

    private onBtnAddClicked() {
        const maxNum: number = this.model.cfg.getValueByKey(this.selectType, 'NOLimit');
        if (this.model.getPassTime(this.selectType) >= maxNum) {
            MsgToastMgr.Show(i18n.tt(Lang.team_page_add_tips));
        } else {
            const VipCfgConst = this.selectType === ETeamViewType.BingFa ? EVipFuncType.TeamDun1 : EVipFuncType.TeamDun2;
            const { tip, vipLv } = ModelMgr.I.VipModel.getMinTimesCfg(VipCfgConst);
            if (RoleMgr.I.d.VipLevel < vipLv) {
                MsgToastMgr.Show(tip);
                return;
            }
            this.showBuyView();
        }
    }

    private onBtnCheckClicked() {
        WinMgr.I.open(ViewConst.TeamRewardWin, this.selectType, this.selectId);
    }

    private onToggle() {
        ControllerMgr.I.TeamController.C2STeamDunSetAccept(this.Toggle.isChecked);
    }

    private showBuyView() {
        const laug = i18n.tt(Lang.arena_challenge_time_unenough_tip);
        const model: TeamModel = ModelMgr.I.TeamModel;
        const haveBuyNum = model.getBuyTime(this.selectType);
        // 计算消耗
        const costInfo = model.getBuyTimesConfig(this.selectType, haveBuyNum);
        const coinNum = costInfo.num;
        const roleVip = RoleMgr.I.d.VipLevel;
        const roleVIpName = ModelMgr.I.VipModel.getVipName(roleVip);
        const configNum = model.configBuyTimes();

        const moneyName = UtilCurrency.getNameByType(costInfo.type);
        const config = [
            UtilColor.NorV,
            UtilColor.GreenV,
            coinNum,
            1,
            roleVIpName,
            configNum - haveBuyNum,
            configNum,
            configNum - haveBuyNum > 0 ? UtilColor.GreenV : UtilColor.RedV,
            moneyName,
        ];
        const tipString = UtilString.FormatArray(
            laug,
            config,
        );
        ModelMgr.I.MsgBoxModel.ShowBox(tipString, () => {
            if (configNum <= haveBuyNum) {
                MsgToastMgr.Show(i18n.tt(Lang.arena_buy_times_unenough));
            } else {
                // 用户货币数量
                const roleCoin = RoleMgr.I.getCurrencyById(costInfo.type);
                if (roleCoin < coinNum) {
                    MsgToastMgr.Show(`${moneyName}${i18n.tt(Lang.com_buzu)}`);
                } else {
                    // 购买挑战次数
                    ControllerMgr.I.TeamController.C2STeamDunBuyPassTime(this.selectType);
                    MsgToastMgr.Show(i18n.tt(Lang.com_buy_success));
                }
            }
        }, { showToggle: '', cbCloseFlag: 'TeamBuy' }, null);
    }

    private onUpdateTeamInfo() {
        this.updateSelectType(this.selectType);
        if (ModelMgr.I.TeamModel.hasTeam()) {
            this.onBtnTeamClicked();
        }
        UtilColor.setGray(this.BtnSweep, !this.model.isCanSweep(this.selectId));
        this.updateView();
    }

    private onUpdateBuyPassTime() {
        this.updateBattleNum();
        const maxTime: number = ModelMgr.I.TeamModel.cfg.getValueByKey(this.selectType, 'NOLimit');
        if (ModelMgr.I.TeamModel.getPassTime(this.selectType) >= maxTime) {
            WinMgr.I.close(ViewConst.ConfirmBox);
        } else {
            this.showBuyView();
        }
        UtilColor.setGray(this.BtnSweep, !this.model.isCanSweep(this.selectId));
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Team.UpdateTeamInfo, this.onUpdateTeamInfo, this);
        EventClient.I.off(E.Team.UpdateBuyPassTime, this.onUpdateBuyPassTime, this);
    }
}
