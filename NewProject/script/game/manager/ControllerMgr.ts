/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-new */
/*
 * @Author: hrd
 * @Date: 2022-03-30 10:42:03
 *
 */

import { IBaseController } from '../../app/core/mvc/controller/BaseController';
import LoginController from '../../login/LoginController';
import { ControllerIds } from '../const/ControllerIds';
import { getsetObj } from '../base/Decorator';
import { EventClient } from '../../app/base/event/EventClient';
import { AppEvent } from '../../app/AppEventConst';
import { RoleController } from '../module/role/RoleController';
import BagController from '../module/bag/BagController';
import { GMController } from '../gm/GMController';
import { RechargeController } from '../module/recharge/RechargeController';
import { ExchangeController } from '../module/exchange/ExchangeController';
import MailController from '../module/mail/MailController';
import SmeltController from '../module/smelt/SmeltController';
import StrengthController from '../module/equip/strength/StrengthController';
import BossController from '../module/boss/BossController';
import BattleResultController from '../module/battleResult/BattleResultController';
import { ChatController } from '../module/chat/ChatController';
import BuildController from '../module/equip/buildEquip/BuildController';
import GameController from '../base/main/GameController';
import TitleController from '../module/title/TitleController';
import GradeController from '../module/grade/GradeController';
import { UpStarController } from '../module/equip/upStar/UpStarController';
import AttrFvController from '../com/attr/AttrFvController';
import { RoleSkinController } from '../module/roleskin/RoleSkinController';
import { ArenaController } from '../module/arena/ArenaController';
import RoleSkillController from '../module/roleSkills/RoleSkillController';
import ArmyLevelController from '../module/roleOfficial/roleArmyLevel/ArmyLevelController';
import RoleOfficialController from '../module/roleOfficial/roleOfficial/RoleOfficialController';
import BattleController from '../battle/BattleController';
import { TaskController } from '../module/task/TaskController';
import MergeMatController from '../module/mergeMat/MergeMatController';
import { MaterialController } from '../module/material/MaterialController';
import GeneralController from '../module/general/GeneralController';
import BattleUnitController from '../module/battleUnit/BattleUnitController';
import { VipController } from '../module/vip/VipController';
import { ShopController } from '../module/shop/ShopController';
import { GameLevelController } from '../module/gameLevel/GameLevelController';
import OnHookController from '../module/onHook/OnHookController';
import { WorldBossController } from '../module/worldBoss/WorldBossController';
import { GamePassController } from '../module/gamePass/GamePassController';
import { DaySignController } from '../module/activity/module/DaySign/DaySignController';
import { ItemTipsController } from '../com/tips/ItemTipsController';
import { ActivityController } from '../module/activity/ActivityController';
import { ItemTipsExController } from '../com/tips/ItemTipsExController';
import { RankListController } from '../module/rankList/RankListController';
import { SealAmuletController } from '../module/roleOfficial/RoleSealAmulet/SealAmuletController';
import { BeautyController } from '../module/beauty/BeautyController';
import BeaconWarController from '../module/beaconWar/BeaconWarController';
import { SettingController } from '../module/setting/SettingController';
import TeamController from '../module/team/TeamController';
import HeadController from '../module/head/HeadController';
import FriendController from '../module/friend/FriendController';
import { GeneralRecruitController } from '../module/activity/module/generalRecruit/GeneralRecruitController';
import CollectionBookController from '../module/collectionBook/CollectionBookController';
import FamilyController from '../module/family/FamilyController';
import OnlineRewardController from '../module/activity/module/onlineReward/OnlineRewardController';
import PlanController from '../module/general/plan/PlanController';
import CashCowController from '../module/activity/module/cashCow/CashCowController';
import RoleSpecialSuitController from '../module/roleskin/specialSuit/RoleSpecialSuitController';
import RankMatchController from '../module/arena/rankMatch/RankMatchController';
import StageRewardController from '../module/activity/module/stageReward/StageRewardController';
import FBExploreController from '../module/fbExplore/FBExploreController';
import SilkRoadController from '../module/equip/silkRoad/SilkRoadController';
import GeneralPassController from '../module/activity/module/generalPass/GeneralPassController';
import DailyTaskController from '../module/dailyTask/DailyTaskController';
import EscortController from '../module/escort/EscortController';
import AdventureController from '../module/adventure/AdventureController';
import FuncPreviewController from '../module/funcPreview/FuncPreviewController';
import BuffController from '../module/buff/BuffController';
import { FuBenMgr } from '../module/fuben/FuBenMgr';
import CdKeyController from '../module/activity/module/cdKey/CdKeyController';
import AdviserController from '../module/adviser/AdviserController';
import HuarongdaoController from '../module/huarongdao/HuarongdaoController';
import RoleExerciseController from '../module/roleExercise/RoleExerciseController';

export default class ControllerMgr {
    private mClsDict: { [clsname: string]: IBaseController } = {};
    private static Instance: ControllerMgr;
    public static get I(): ControllerMgr {
        if (!this.Instance) {
            this.Instance = new ControllerMgr();
            this.Instance._init();
            this.Instance.InitController();
        }
        return this.Instance;
    }

    @getsetObj(GameController)
    public GameController: GameController = null;
    @getsetObj(GMController)
    public GMController: GMController = null;
    @getsetObj(LoginController)
    public LoginController: LoginController = null;
    @getsetObj(RoleController)
    public RoleController: RoleController = null;
    @getsetObj(BagController)
    public BagController: BagController = null;
    @getsetObj(RechargeController)
    public RechargeController: RechargeController = null;
    @getsetObj(ExchangeController)
    public ExchangeController: ExchangeController = null;
    @getsetObj(MailController)
    public MailController: MailController = null;
    @getsetObj(SmeltController)
    public SmeltController: SmeltController = null;
    @getsetObj(StrengthController)
    public StrengthController: StrengthController = null;
    @getsetObj(BossController)
    public BossController: BossController = null;
    @getsetObj(BattleResultController)
    public BattleResultController: BattleResultController = null;
    @getsetObj(TitleController)
    public TitleController: TitleController = null;
    @getsetObj(GeneralController)
    public GeneralController: GeneralController = null;
    @getsetObj(BuildController)
    public BuildController: BuildController = null;
    @getsetObj(ChatController)
    public ChatController: ChatController = null;
    @getsetObj(GradeController)
    public GradeController: GradeController = null;
    @getsetObj(AttrFvController)
    public AttrFvController: AttrFvController = null;
    @getsetObj(RoleSkinController)
    public RoleSkinController: RoleSkinController = null;
    @getsetObj(RoleSkillController)
    public RoleSkillController: RoleSkillController = null;
    @getsetObj(AdventureController)
    public AdventureController: AdventureController = null;
    @getsetObj(UpStarController)
    public UpStarController: UpStarController = null;
    @getsetObj(ArenaController)
    public ArenaController: ArenaController = null;
    @getsetObj(ArmyLevelController)
    public ArmyLevelController: ArmyLevelController = null;
    @getsetObj(RoleOfficialController)
    public RoleOfficialController: RoleOfficialController = null;
    @getsetObj(BattleController)
    public BattleController: BattleController = null;
    @getsetObj(BattleUnitController)
    public BattleUnitController: BattleUnitController = null;
    @getsetObj(TaskController)
    public TaskController: TaskController = null;
    @getsetObj(MergeMatController)
    public MergeMatController: MergeMatController = null;
    @getsetObj(MaterialController)
    public MaterialController: MaterialController = null;
    @getsetObj(VipController)
    public VipController: VipController = null;
    @getsetObj(ShopController)
    public ShopController: ShopController = null;
    @getsetObj(GameLevelController)
    public GameLevelController: GameLevelController = null;
    @getsetObj(OnHookController)
    public OnHookController: OnHookController = null;
    @getsetObj(WorldBossController)
    public WorldBossController: WorldBossController = null;
    @getsetObj(BeaconWarController)
    public BeaconWarController: BeaconWarController = null;
    @getsetObj(GamePassController)
    public GamePassController: GamePassController = null;
    @getsetObj(DaySignController)
    public DaySignController: DaySignController = null;
    @getsetObj(ItemTipsController)
    public ItemTipsController: ItemTipsController = null;
    @getsetObj(ActivityController)
    public ActivityController: ActivityController = null;
    @getsetObj(RankListController)
    public RankListController: RankListController = null;
    @getsetObj(ItemTipsExController)
    public ItemTipsExController: ItemTipsExController = null;
    @getsetObj(SealAmuletController)
    public SealAmuletController: SealAmuletController = null;
    @getsetObj(BeautyController)
    public BeautyController: BeautyController = null;
    @getsetObj(SettingController)
    public SettingController: SettingController = null;
    @getsetObj(GeneralRecruitController)
    public GeneralRecruitController: GeneralRecruitController = null;
    @getsetObj(TeamController)
    public TeamController: TeamController = null;
    @getsetObj(HeadController)
    public HeadController: HeadController = null;
    @getsetObj(FriendController)
    public FriendController: FriendController = null;
    @getsetObj(PlanController)
    public PlanController: PlanController = null;
    @getsetObj(FamilyController)
    public FamilyController: FamilyController = null;
    @getsetObj(CollectionBookController)
    public CollectionBookController: CollectionBookController = null;
    @getsetObj(SilkRoadController)
    public SilkRoadController: SilkRoadController = null;
    @getsetObj(OnlineRewardController)
    public OnlineRewardController: OnlineRewardController = null;
    @getsetObj(CashCowController)
    public CashCowController: CashCowController = null;
    @getsetObj(RoleSpecialSuitController)
    public RoleSpecialSuitController: RoleSpecialSuitController = null;
    @getsetObj(RoleExerciseController)
    public RoleExerciseController: RoleExerciseController = null;

    @getsetObj(RankMatchController)
    public RankMatchController: RankMatchController = null;
    @getsetObj(StageRewardController)
    public StageRewardController: StageRewardController = null;
    @getsetObj(FBExploreController)
    public FBExploreController: FBExploreController = null;
    @getsetObj(GeneralPassController)
    public GeneralPassController: GeneralPassController = null;
    @getsetObj(DailyTaskController)
    public DailyTaskController: DailyTaskController = null;
    @getsetObj(CdKeyController)
    public CdKeyController: CdKeyController = null;
    @getsetObj(EscortController)
    public EscortController: EscortController = null;
    @getsetObj(FuncPreviewController)
    public FuncPreviewController: FuncPreviewController = null;
    @getsetObj(BuffController)
    public BuffController: BuffController = null;
    @getsetObj(AdviserController)
    public AdviserController: AdviserController = null;
    @getsetObj(HuarongdaoController)
    public HuarongdaoController: HuarongdaoController = null;

    private _init() {
        EventClient.I.on(AppEvent.ControllerCheck, this.onCheck, this);
    }

    private onCheck(mid: number) {
        this.Check(mid);
    }

    public do(): void {
        //
    }

    /** 初始化Controller 活动不需要静态注册 */
    private InitController(): void {
        const initList: string[] = [
            'LoginController',
            'GameController',
            'RoleController',
            'BagController',
            'GMController',
            'MailController',
            'ChatController',
            'BossController',
            'BattleResultController',
            'TitleController',
            'GeneralController',
            'RoleSkillController',
            'AdventureController',
            'StrengthController',
            'UpStarController',
            'AttrFvController',
            'GradeController',
            'RoleOfficialController',
            'ArmyLevelController',
            'BattleController',
            'BattleUnitController',
            'TaskController',
            'MergeMatController',
            'MaterialController',
            'RoleSkinController',
            'VipController',
            'WorldBossController',
            'BeaconWarController',
            'ShopController',
            'BuildController',
            'OnHookController',
            'GameLevelController',
            'GamePassController',
            'EscortController',
            'FuncPreviewController',
            'ActivityController',
            'RankListController',
            'BeautyController',
            'SettingController',
            'TeamController',
            'FamilyController',
            'RoleExerciseController',
            'CollectionBookController',
            'SilkRoadController',
            'FriendController',
            'PlanController',
            'RankMatchController',
            'BuffController',
            'HuarongdaoController',
        ];

        initList.forEach((clsName) => {
            if (this.mClsDict[clsName]) {
                return;
            }
            this[clsName].do();
        });
        FuBenMgr.I.do();
    }

    /**
     *  检测
     * @param mId 模块id
     */
    public Check(mId: number): void {
        const clsName = ControllerIds[mId];
        if (!clsName) {
            // console.log('无效的 ControllerId： ', mId);
            return;
        }
        if (this.mClsDict[clsName]) {
            return;
        }
        console.log(clsName);

        this[clsName].do();
    }

    /** 重置所有 */
    public resetAll(): void {
        for (const key in this.mClsDict) {
            if (Object.prototype.hasOwnProperty.call(this.mClsDict, key)) {
                let cls = this.mClsDict[key];
                if (cls) {
                    cls.reset();
                    cls = null;
                }
            }
        }
        this.mClsDict = {};
    }
    /**
     * 通过类名重置一个Controller
     * @param clsName 类名
     */
    public delByName(clsName: string): void {
        let cls = this.mClsDict[clsName];
        if (cls) {
            cls.reset();
            cls = null;
            delete this.mClsDict[clsName];
        }
    }
    /**
     * Link.To跳转某个界面的中转接口
     * @param ContorllId 模块id
     * @param funcArgs 配置表参数列表
     * @param args 可变参，扩展参数
     * @returns
     */
    public linkOpen(controllerId: number, tab: number, params: any[] | undefined, ...args: any[]): boolean {
        const n = ControllerIds[controllerId];
        const c = this[n] as IBaseController;
        if (c && c.linkOpen) {
            console.log('ControllerMgr linkOpen, id,tab,params,args=', controllerId, tab, params, ...args);
            if (args.length > 0) {
                return c.linkOpen(tab, params, ...args);
            } else {
                return c.linkOpen(tab, params);
            }
        } else {
            console.warn('Controller not fount linkOpen, id,tab,params,args=', controllerId, tab, params, ...args);
            return false;
        }
    }
}
