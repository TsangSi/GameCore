/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: hrd
 * @Date: 2022-03-30 10:29:28
 * @Description:
 *
 */
import BaseModel from '../../app/core/mvc/model/BaseModel';
import { getsetObj } from '../base/Decorator';
import { VipModel } from '../module/vip/VipModel';
import { RechargeModel } from '../module/recharge/RechargeModel';
import { MsgBoxModel } from '../com/msgbox/MsgBoxModel';
import { ChatModel } from '../module/chat/ChatModel';
import { SmeltModel } from '../module/smelt/SmeltModel';
import { StrengthModel } from '../module/equip/strength/StrengthModel';
import { MailModel } from '../module/mail/MailModel';
import { BossModel } from '../module/boss/BossModel';
import { BuildModel } from '../module/equip/buildEquip/BuildModel';
import { TitleModel } from '../module/title/TitleModel';
import { UpStarModel } from '../module/equip/upStar/UpStarModel';
import { MainCityModel } from '../module/maincity/v/MainCityModel';
import { AttrFvModel } from '../com/attr/AttrFvModel';
import { RoleSkinModel } from '../module/roleskin/RoleSkinModel';
import { RoleSkillModel } from '../module/roleSkills/RoleSkillModel';
import { ArenaModel } from '../module/arena/ArenaModel';
import { BattleModel } from '../battle/BattleModel';
import { ArmyLevelModel } from '../module/roleOfficial/roleArmyLevel/ArmyLevelModel';
import { BattleResultModel } from '../module/battleResult/BattleResultModel';
import { MaterialModel } from '../module/material/MaterialModel';
import { GeneralModel } from '../module/general/GeneralModel';
import { PlanModel } from '../module/general/plan/PlanModel';
import { BattleUnitModel } from '../module/battleUnit/BattleUnitModel';
import { GskinModel } from '../module/general/gskin/GskinModel';
import LoginModel from '../../login/LoginModel';
import { MergeMatModel } from '../module/mergeMat/MergeMatModel';
import { ShopModel } from '../module/shop/ShopModel';
import { WorldBossModel } from '../module/worldBoss/WorldBossModel';
import { GmModel } from '../gm/GmModel';
import { GameLevelModel } from '../module/gameLevel/GameLevelModel';
import { OnHookModel } from '../module/onHook/OnHookModel';
import { GamePassModel } from '../module/gamePass/GamePassModel';
import { DaySignModel } from '../module/activity/module/DaySign/DaySignModel';
import { ActivityModel } from '../module/activity/ActivityModel';
import { RankListModel } from '../module/rankList/RankListModel';
import { RoleOfficeModel } from '../module/roleOfficial/roleOfficial/RoleOfficeModel';
import { SealAmuletModel } from '../module/roleOfficial/RoleSealAmulet/SealAmuletModel';
import { BeautyModel } from '../module/beauty/BeautyModel';
import { TeamModel } from '../module/team/TeamModel';
import { BeaconWarModel } from '../module/beaconWar/BeaconWarModel';
import { SettingModel } from '../module/setting/SettingModel';
import HeadModel from '../module/head/HeadModel';
import FriendModel from '../module/friend/FriendModel';
import NewPlotModel from '../module/newplot/NewPlotModel';
import { GeneralRecruitModel } from '../module/activity/module/generalRecruit/GeneralRecruitModel';
import CollectionBookModel from '../module/collectionBook/CollectionBookModel';
import FamilyModel from '../module/family/FamilyModel';
import OnlineRewardModel from '../module/activity/module/onlineReward/OnlieRewardModel';
import CashCowModel from '../module/activity/module/cashCow/CashCowModel';
import RoleSpecialSuitModel from '../module/roleskin/specialSuit/RoleSpecialSuitModel';
import RankMatchModel from '../module/arena/rankMatch/RankMatchModel';
import StageRewardModel from '../module/activity/module/stageReward/StageRewardModel';
import { SilkRoadModel } from '../module/equip/silkRoad/SilkRoadModel';
import { EscortModel } from '../module/escort/EscortModel';
import { GemModel } from '../module/equip/gem/GemModel';
import DailyTaskModel from '../module/dailyTask/DailyTaskModel';
import FBExploreModel from '../module/fbExplore/FBExploreModel';
import GeneralPassModel from '../module/activity/module/generalPass/GeneralPassModel';
import { AdventureModel } from '../module/adventure/AdventureModel';
import { FuncPreviewModel } from '../module/funcPreview/FuncPreviewModel';
import BuffModel from '../module/buff/BuffModel';
import AdviserModel from '../module/adviser/AdviserModel';
import HuarongdaoModel from '../module/huarongdao/HuarongdaoModel';
import RoleExerciseModel from '../module/roleExercise/RoleExerciseModel';

const { ccclass } = cc._decorator;
@ccclass('ModelMgr')
export default class ModelMgr {
    private mClsDict: { [clsname: string]: BaseModel } = {};
    /** 登录 */
    @getsetObj(LoginModel)
    public LoginModel: LoginModel = null;
    /** VIP */
    @getsetObj(VipModel)
    public VipModel: VipModel = null;
    @getsetObj(RechargeModel)
    public RechargeModel: RechargeModel = null;
    @getsetObj(MsgBoxModel)
    public MsgBoxModel: MsgBoxModel = null;
    @getsetObj(ChatModel)
    public ChatModel: ChatModel = null;
    @getsetObj(SmeltModel)
    public SmeltModel: SmeltModel = null;
    @getsetObj(StrengthModel)
    public StrengthModel: StrengthModel = null;
    @getsetObj(GemModel)
    public GemModel: GemModel = null;
    @getsetObj(BuildModel)
    public BuildModel: BuildModel = null;
    @getsetObj(MailModel)
    public MailModel: MailModel = null;
    @getsetObj(BossModel)
    public BossModel: BossModel = null;
    @getsetObj(TitleModel)
    public TitleModel: TitleModel = null;
    @getsetObj(GeneralModel)
    public GeneralModel: GeneralModel = null;
    @getsetObj(PlanModel)
    public PlanModel: PlanModel = null;
    @getsetObj(GskinModel)
    public GskinModel: GskinModel = null;
    @getsetObj(MainCityModel)
    public MainCityModel: MainCityModel = null;
    @getsetObj(RoleSkinModel)
    public RoleSkinModel: RoleSkinModel = null;
    @getsetObj(RoleSkillModel)
    public RoleSkillModel: RoleSkillModel = null;
    @getsetObj(UpStarModel)
    public UpStarModel: UpStarModel = null;
    @getsetObj(SilkRoadModel)
    public SilkRoadModel: SilkRoadModel = null;
    @getsetObj(AdventureModel)
    public AdventureModel: AdventureModel = null;
    @getsetObj(AttrFvModel)
    public AttrFvModel: AttrFvModel = null;
    @getsetObj(ArenaModel)
    public ArenaModel: ArenaModel = null;
    @getsetObj(BattleModel)
    public BattleModel: BattleModel = null;
    @getsetObj(ArmyLevelModel)
    public ArmyLevelModel: ArmyLevelModel = null;
    @getsetObj(BattleResultModel)
    public BattleResultModel: BattleResultModel = null;
    @getsetObj(BattleUnitModel)
    public BattleUnitModel: BattleUnitModel = null;
    @getsetObj(MaterialModel)
    public MaterialModel: MaterialModel = null;
    @getsetObj(MergeMatModel)
    public MergeMatModel: MergeMatModel = null;
    @getsetObj(ShopModel)
    public ShopModel: ShopModel = null;
    @getsetObj(WorldBossModel)
    public WorldBossModel: WorldBossModel = null;
    @getsetObj(BeaconWarModel)
    public BeaconWarModel: BeaconWarModel = null;
    @getsetObj(GmModel)
    public GmModel: GmModel = null;
    @getsetObj(GameLevelModel)
    public GameLevelModel: GameLevelModel = null;
    @getsetObj(OnHookModel)
    public OnHookModel: OnHookModel = null;
    @getsetObj(GamePassModel)
    public GamePassModel: GamePassModel = null;
    @getsetObj(DaySignModel)
    public DaySignModel: DaySignModel = null;
    @getsetObj(ActivityModel)
    public ActivityModel: ActivityModel = null;
    @getsetObj(RankListModel)
    public RankListModel: RankListModel = null;
    @getsetObj(RoleOfficeModel)
    public RoleOfficeModel: RoleOfficeModel = null;
    @getsetObj(SealAmuletModel)
    public SealAmuletModel: SealAmuletModel = null;
    @getsetObj(BeautyModel)
    public BeautyModel: BeautyModel = null;
    @getsetObj(SettingModel)
    public SettingModel: SettingModel = null;
    @getsetObj(TeamModel)
    public TeamModel: TeamModel = null;
    @getsetObj(GeneralRecruitModel)
    public GeneralRecruitModel: GeneralRecruitModel = null;
    @getsetObj(HeadModel)
    public HeadModel: HeadModel = null;
    @getsetObj(FriendModel)
    public FriendModel: FriendModel = null;
    @getsetObj(NewPlotModel)
    public NewPlotModel: NewPlotModel = null;
    @getsetObj(FamilyModel)
    public FamilyModel: FamilyModel = null;
    @getsetObj(CollectionBookModel)
    public CollectionBookModel: CollectionBookModel = null;
    @getsetObj(OnlineRewardModel)
    public OnlineRewardModel: OnlineRewardModel = null;
    @getsetObj(CashCowModel)
    public CashCowModel: CashCowModel = null;
    @getsetObj(RoleSpecialSuitModel)
    public RoleSpecialSuitModel: RoleSpecialSuitModel = null;
    @getsetObj(RankMatchModel)
    public RankMatchModel: RankMatchModel = null;
    @getsetObj(StageRewardModel)
    public StageRewardModel: StageRewardModel = null;
    @getsetObj(DailyTaskModel)
    public DailyTaskModel: DailyTaskModel = null;
    @getsetObj(FBExploreModel)
    public FBExploreModel: FBExploreModel = null;
    @getsetObj(GeneralPassModel)
    public GeneralPassModel: GeneralPassModel = null;
    @getsetObj(EscortModel)
    public EscortModel: EscortModel = null;
    @getsetObj(FuncPreviewModel)
    public FuncPreviewModel: FuncPreviewModel = null;
    @getsetObj(BuffModel)
    public BuffModel: BuffModel = null;
    @getsetObj(AdviserModel)
    public AdviserModel: AdviserModel = null;
    @getsetObj(HuarongdaoModel)
    public HuarongdaoModel: HuarongdaoModel = null;
    @getsetObj(RoleExerciseModel)
    public RoleExerciseModel: RoleExerciseModel = null;

    private static Instance: ModelMgr;
    public static get I(): ModelMgr {
        if (!this.Instance) {
            this.Instance = new ModelMgr();
            this.Instance.InitModel();
        }
        return this.Instance;
    }
    public do(): void {
        //
    }

    /** 初始化model-活动不需要静态注册 */
    private InitModel(): void {
        const initList: string[] = [
            'LoginModel',
            'MsgBoxModel',
            'ChatModel',
            'TitleModel',
            'GeneralModel',
            'PlanModel',
            'GskinModel',
            'UpStarModel',
            'SilkRoadModel',
            'AdventureModel',
            'ArenaModel',
            'ArmyLevelModel',
            'RoleSkinModel',
            'RoleSkillModel',
            'MaterialModel',
            'MailModel',
            'BattleUnitModel',
            'BattleResultModel',
            'RoleExerciseModel',
            'StrengthModel',
            'GemModel',
            'VipModel',
            'BuildModel',
            'MergeMatModel',
            'ShopModel',
            'GmModel',
            'OnHookModel',
            'WorldBossModel',
            'BeaconWarModel',
            'GamePassModel',
            'RankListModel',
            'RoleOfficeModel',
            'BeautyModel',
            'SealAmuletModel',
            'SettingModel',
            'TeamModel',
            'FriendModel',
            'FamilyModel',
            'RoleSpecialSuitModel',
            'FBExploreModel',
            'EscortModel',
            'FuncPreviewModel',
            'HuarongdaoModel',
        ];

        initList.forEach((clsName) => {
            if (this.mClsDict[clsName]) {
                return;
            }
            this[clsName].do();
        });
    }

    /** 初始化红点监控信息，需要的在这加上 */
    public registerRedDotListen(): void {
        const keys = Object.keys(this);
        keys.forEach((val, index) => {
            if (val.indexOf('Model') !== -1) {
                this[val.replace('_', '')].registerRedDotListen();
            }
        });
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
     * 通过类名重置一个Model
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
}
