/*
 * @Author: hrd
 * @Date: 2022-06-28 19:00:58
 * @FilePath: \SanGuo-2.4-main\assets\script\game\battle\actions\TWarStartAction.ts
 * @Description:
 *
 */
import { EffectMgr } from '../../manager/EffectMgr';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import ModelMgr from '../../manager/ModelMgr';
import { BattleMgr } from '../BattleMgr';
import { ActionReturn, ExecuteType, WarStartType } from '../WarConst';
import { ActionBase } from './base/ActionBase';
import { TWarChatAction } from './TWarChatAction';
import { UtilString } from '../../../app/base/utils/UtilString';
import { SealAmuletType } from '../../module/roleOfficial/RoleSealAmulet/SealAmuletConst';
import { ConfigSAQualityIndexer } from '../../base/config/indexer/ConfigSAQualityIndexer';
import { i18n, Lang } from '../../../i18n/i18n';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ROfficialBattle } from '../view/StartPanel/ROfficialBattle';
import { TameStartPanel } from '../view/StartPanel/TameStartPanel';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import { EBattleType } from '../../module/battleResult/BattleResultConst';
import { RES_ENUM } from '../../const/ResPath';

export class TWarStartActionBase extends ActionBase {
    /** 延迟时间单位毫秒 */
    protected mDelay: number;

    public onUpdate(delta: number): ActionReturn {
        this.mDelay -= delta;
        if (this.mDelay > 0) {
            return ActionReturn.CONTINUE;
        }
        this.doExecute();
        return ActionReturn.NEXT;
    }

    protected doExecute(): void {
        super.doExecute();
        console.log('======战斗开始====');
        this.addChatAct();
    }

    public initAct(): void {
        super.initAct();
        // this.parseActionEvent();
    }

    private parseActionEvent() {
        this.addChatAct();
    }

    /** 添加战斗喊话行为 */
    private addChatAct() {
        const fbType = BattleMgr.I.getBattleReport().T;
        if (fbType !== EBattleType.GameLevelBoss) {
            return;
        }
        const entity = this.mWar.getBossEntity();
        if (!entity) return;
        if (!ModelMgr.I.NewPlotModel) {
            return;
        }
        const arr: string[] = ModelMgr.I.NewPlotModel.getBattlePlotTexts();
        if (arr.length === 0) {
            return;
        }
        const act = TWarChatAction.Create(entity, arr);
        // this.pushAction(act);
        act.init(this.mWar);
        act.onEnter();
    }
}

export class TWarStartAction extends ActionBase {
    public star: number = null;

    public static Create(): TWarStartAction {
        const action = new TWarStartAction();
        action.executeType = ExecuteType.Series;
        return action;
    }

    public onEnter(): void {
        super.onEnter();
        this.initStartWar();
    }

    protected doExecute(): void {
        super.doExecute();
    }

    private initStartWar() {
        const fbType = BattleMgr.I.getBattleReport().T;
        // BattleMgr.I.getBattleReport().SE[0].V = '13:1:1|28:1:1';
        const cfg: Cfg_FightScene = Config.Get(ConfigConst.Cfg_FightScene).getValueByKey(fbType);
        if (!cfg) return;
        const openingAniStr: string = cfg.OpeningAni;
        if (!openingAniStr) return;
        const animTypeArr = openingAniStr.split(':');
        for (let i = 0; i < animTypeArr.length; i++) {
            const type = +animTypeArr[i];
            const act = this.createAct(type as WarStartType);
            if (act) {
                this.pushAction(act);
            }
        }
    }

    private createAct(type: WarStartType): ActionBase {
        let act: ActionBase = null;
        switch (type) {
            case WarStartType.boss:
                act = TWarStartActionBoss.Create(1200);
                break;
            case WarStartType.amulet:
                if (BattleMgr.I.isShowAmuletAct()) {
                    act = TWarStartActionAmulet.Create(2000);
                }
                break;
            case WarStartType.Continue:
                act = TWarStartActionTeam.Create(1200);
                break;
            default:
                act = null;
                break;
        }
        return act;
    }
}

/** boss来袭开场 */
export class TWarStartActionBoss extends TWarStartActionBase {
    public static Create(delay: number): TWarStartActionBoss {
        const action = new TWarStartActionBoss();
        action.mDelay = delay;
        action.executeType = ExecuteType.Series;
        return action;
    }
    public onEnter(): void {
        super.onEnter();
        this.palyEff();
    }

    protected doExecute(): void {
        super.doExecute();
    }

    private palyEff() {
        const nd: cc.Node = BattleMgr.I.UILayer;
        EffectMgr.I.showAnim(`${RES_ENUM.Fight_Ui}${8053}`, (node: cc.Node) => {
            if (nd && nd.isValid) {
                const eff = nd.getChildByName('btnEffect');
                if (eff) {
                    eff.destroy();
                }
                nd.insertChild(node, 250);
                node.name = 'btnEffect';
            }
        }, cc.WrapMode.Normal);
    }
}

/** 虎符威慑开场 */
export class TWarStartActionAmulet extends TWarStartActionBase {
    public static Create(delay: number): TWarStartActionAmulet {
        const action = new TWarStartActionAmulet();
        action.mDelay = delay;
        action.executeType = ExecuteType.Series;
        return action;
    }

    public onEnter(): void {
        super.onEnter();
        this.initUI();
    }

    protected doExecute(): void {
        super.doExecute();
    }

    private initUI() {
        const info: SEffect = BattleMgr.I.getWarStarInfo(WarStartType.amulet);
        if (!info) return;
        // 攻方位置:虎符阶段：虎符等级|守方位置:虎符阶段：虎符等级
        const paramStr = info.V;
        const paramArr = UtilString.SplitToArray(paramStr);
        const p1 = +paramArr[0][0]; // 攻方位置
        const stage1 = +paramArr[0][1]; // 虎符阶段
        const lv1 = +paramArr[0][2]; // 虎符等级

        const p2 = +paramArr[1][0]; // 守方位置
        const stage2 = +paramArr[1][1];// 虎符阶段
        const lv2 = +paramArr[1][2]; // 虎符等级

        if (!(stage1 && lv1)) return;
        if (!(stage2 && lv2)) return;

        const u1 = BattleMgr.I.getFightUnitByPos(p1);
        const indexer: ConfigSAQualityIndexer = Config.Get(ConfigConst.Cfg_SAQuality);
        const conf1 = indexer.getSealAmuletQualityBy(SealAmuletType.Amulet, stage1, lv1);
        const conf2 = indexer.getSealAmuletQualityBy(SealAmuletType.Amulet, stage2, lv2);

        const name1 = `${conf1.Name}${UtilNum.ToChinese(stage1)}${i18n.jie}`;
        const name2 = `${conf2.Name}${UtilNum.ToChinese(stage2)}${i18n.jie}`;
        const imgPath1 = `${RES_ENUM.Official_Icon_Icon_Hufu}${conf1.Picture}`;
        const imgPath2 = `${RES_ENUM.Official_Icon_Icon_Hufu}${conf2.Picture}`;

        console.log(u1);
        console.log('=====TWarStartActionAmulet============', p1, stage1, lv1, p2, stage2, lv2);

        const nd: cc.Node = BattleMgr.I.UILayer;
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.ROfficialBattle, undefined, (e, n) => {
            nd.addChild(n);
            const isHigh = stage1 > stage2;
            n.getComponent(ROfficialBattle).setData(imgPath1, name1, imgPath2, name2, isHigh);
        });
    }
}

/** 组队副本开场 */
export class TWarStartActionTeam extends TWarStartActionBase {
    public static Create(delay: number): TWarStartActionTeam {
        const action = new TWarStartActionTeam();
        action.mDelay = delay;
        action.executeType = ExecuteType.Series;
        return action;
    }

    public onEnter(): void {
        super.onEnter();
        this.initUI();
    }

    protected doExecute(): void {
        super.doExecute();
    }

    private initUI() {
        const fbType = BattleMgr.I.getBattleReport().T;
        const param = BattleMgr.I.getBattleReport().PARAM;
        const num: number = BattleMgr.I.parseBattleReportParam(fbType, param) || 0; // 第几波
        const nd: cc.Node = BattleMgr.I.UILayer;
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.TameStartPanel, undefined, (e, n) => {
            nd.addChild(n);
            n.getComponent(TameStartPanel).setData(num);
        });
    }
}
