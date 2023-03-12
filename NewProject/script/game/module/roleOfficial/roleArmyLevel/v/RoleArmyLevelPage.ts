/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { EffectMgr } from '../../../../manager/EffectMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { BaseAddOptions, IAttrBase } from '../../../../base/attribute/AttrConst';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilEffectPath } from '../../../../base/utils/UtilEffectPath';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { NdAttrBaseAdditionContainer } from '../../../../com/attr/NdAttrBaseAdditionContainer';
import ItemModel from '../../../../com/item/ItemModel';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { BagMgr } from '../../../bag/BagMgr';
import { RID } from '../../../reddot/RedDotConst';
import { RoleMgr } from '../../../role/RoleMgr';
import { ETaskStatus } from '../../../task/TaskConst';
import { ArmyLevelModel } from '../ArmyLevelModel';
import { ArmyLvConst } from '../ArmyLvConst';
import { ArmyTaskItem } from './ArmyTaskItem';
import { CompNextDesc } from './CompNextDesc';
import UtilFunOpen from '../../../../base/utils/UtilFunOpen';
import { FuncId } from '../../../../const/FuncConst';
import { RolePageType } from '../../../role/RoleConst';
import { ERoleSkillPageType } from '../../../roleSkills/RoleSkillConst';
import { UtilSkillInfo } from '../../../../base/utils/UtilSkillInfo';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { RES_ENUM } from '../../../../const/ResPath';
import { FuncDescConst } from '../../../../const/FuncDescConst';

const { ccclass, property } = cc._decorator;
/** author ylj
 * 官职-军衔功能
 */
@ccclass
export class RoleArmyLevelPage extends WinTabPage {
    /** 属性 */
    @property(cc.Node)
    private NdAttrContainer: cc.Node = null;

    /** 战斗力 */
    @property(cc.Node)
    private NdPower: cc.Node = null;
    @property(cc.Label)
    private LabPower: cc.Label = null;

    @property(cc.Sprite)/** 5个点亮图片 */
    private SprLvIcons: cc.Sprite[] = [];
    @property(DynamicImage)/** 中间最大的军衔图标 */
    private SprIcon: DynamicImage = null;
    @property(DynamicImage)
    private SprName: DynamicImage = null;
    @property(cc.Label)/** x级 */
    private LabName: cc.Label = null;

    // 中间的描述信息
    @property(cc.Node)
    private NdDesc: cc.Node = null;

    // 特效节点
    @property(cc.Node)
    private NdAnimations: cc.Node[] = [];

    //
    @property(cc.Node)/** 晋升 */
    private NdLvUp: cc.Node = null;

    @property(cc.Node)/** 一键晋升 实际是一键完成任务 */
    private NdAutoLvUp: cc.Node = null;

    @property(cc.Label)// 一键晋升的道具进度情况
    private LabProgress: cc.Label = null;

    @property(cc.Node)/** 一键晋升 边上的tip */
    private NdTip: cc.Node = null;

    @property(cc.Node)/** 预览 */
    private NdPreView: cc.Node = null;
    @property(cc.Node)/** 技能 */
    private NdSkill: cc.Node = null;
    @property(cc.Label)/** 技能名称 */
    private LabSkillName: cc.Label = null;
    @property(cc.Label)/** 开启条件 */
    private LabOpenCondition: cc.Label = null;
    @property(DynamicImage)/** 技能图标 */
    private SprSkill: DynamicImage = null;

    @property(cc.Node)// 解锁条件
    private NdSkillLv: cc.Node = null;
    @property(cc.Node)// 激活
    private NdActive: cc.Node = null;

    @property(ArmyTaskItem)/** 4条任务 */
    private ArmyTaskItems: ArmyTaskItem[] = [];

    // 满级后任务表现
    @property(cc.Node)
    private NdMax: cc.Node = null;
    @property(cc.Node)
    private NdTaskItems: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdLvUp, this._onLvUpClick, this);
        UtilGame.Click(this.NdAutoLvUp, this._onAutoLvUpClick, this, { unRepeat: true, time: 800 });
        UtilGame.Click(this.NdTip, this._onTipClick, this);
        UtilGame.Click(this.NdPreView, this._onPreViewClick, this);
        UtilGame.Click(this.NdSkill, this._onNdSkillCLick, this);
        UtilGame.Click(this.NdActive, this._onSkillActive, this, { unRepeat: true, time: 1000 });

        // 监听军衔变化 更新UI
        EventClient.I.on(E.ArmyLevel.AutoLvUp, this._onAutoLvUp, this);
        EventClient.I.on(E.Task.UpdateTask, this._onUpdateTask, this);
        // 晋升成功
        EventClient.I.on(E.ArmyLevel.ArmyUp, this._onArmyUp, this);
        /** 领取奖励成功 */
        EventClient.I.on(E.ArmyLevel.ArmyReward, this._onArmyLevelReward, this);
        /** 技能激活之后 */
        EventClient.I.on(E.ArmyLevel.ArmySkillActive, this._onArmySkillActive, this);

        // 一键晋升
        const funcObj = RID.Role.RoleOfficial.ArmyLevel;
        UtilRedDot.Bind(funcObj.AutoLvUp, this.NdAutoLvUp, cc.v2(29, 9));
        UtilRedDot.Bind(funcObj.SkillActive, this.NdSkill, cc.v2(40, 30));

        this._armyLevel = RoleMgr.I.getArmyLevel();
        this._armyStar = RoleMgr.I.getArmyStar();
        this._initAll();
    }
    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.ArmyLevel.AutoLvUp, this._onAutoLvUp, this);
        EventClient.I.off(E.Task.UpdateTask, this._onUpdateTask, this);
        EventClient.I.off(E.ArmyLevel.ArmyUp, this._onArmyUp, this);
        EventClient.I.off(E.ArmyLevel.ArmyReward, this._onArmyLevelReward, this);
        EventClient.I.off(E.ArmyLevel.ArmySkillActive, this._onArmySkillActive, this);
    }

    /** 技能激活 */
    private _onArmySkillActive(skillId: number) {
        this._updateSkillInfo();
        this.NdActive.active = false;// 隐藏点击激活
        WinMgr.I.open(ViewConst.ActiveSkillTip, skillId);
        MsgToastMgr.Show(i18n.tt(Lang.role_armylv_skill_active));
    }

    public updateSkillInfo(): void {
        // 更新技能
        this._updateSkillInfo();
    }

    private _onArmyLevelReward(taskId: number) {
        //
        const taskCfg: Cfg_ArmyTask = ModelMgr.I.ArmyLevelModel.getTaskCfgByTaskId(taskId);
        const rewardArr = taskCfg.Prize.split(':');
        const itemId = Number(rewardArr[0]);
        const itemNum = Number(rewardArr[1]);

        const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);

        WinMgr.I.open(ViewConst.GetRewardWin, [itemModel]);
    }

    /** 晋升 */
    private _onLvUpClick(): void { // 得判断四个状态是否完成 或者已经领取 才可以
        const taskIds = ModelMgr.I.ArmyLevelModel.getTaskIds(this._armyLevel, this._armyStar);
        let bol = false;
        for (const id of taskIds) {
            const statu: ETaskStatus = ModelMgr.I.ArmyLevelModel.getTaskStatusByTaskId(id);
            if (statu === ETaskStatus.Completed) {
                MsgToastMgr.Show(i18n.tt(Lang.rolearmylv_task_noget));// '任务奖励未领取'
                return;
            }

            if (statu !== ETaskStatus.Awarded) {
                bol = true;
                MsgToastMgr.Show(i18n.tt(Lang.rolearmylv_task_no));// '任务未完成'
                return;
            }
        }

        if (!bol) {
            ControllerMgr.I.ArmyLevelController.reqC2SRoleArmyUp();
        }
    }
    /* 晋升成功 */
    private _onArmyUp() {
        this._armyLevel = RoleMgr.I.getArmyLevel();
        this._armyStar = RoleMgr.I.getArmyStar();

        WinMgr.I.open(ViewConst.ArmyLevelUpTip);

        this._updatePower();// 战力
        this._updateCenterInfo();// 中间图标

        this._updateAutoLvUpInfo();// 一键晋升描述信息 任务进度

        this._updateSkillInfo();// 技能名称
        this._updateNextLevelInfo();// 下一等级的描述信息
        this._updateAttrInfo();// 属性
        this._updateTaskInfo();// 更新任务信息
    }
    /** 一键晋升 */
    private _onAutoLvUpClick(): void {
        // 判断消耗物品是否足够
        const armyGradeCfg: Cfg_ArmyGrade = ModelMgr.I.ArmyLevelModel.getArmyLevelCfg(this._armyLevel, this._armyStar);
        const tempArr = armyGradeCfg.NeedItem.split(':');
        const itemId: number = Number(tempArr[0]);
        const itemNum: number = Number(tempArr[1]);
        const bagNum: number = BagMgr.I.getItemNum(itemId);
        const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);
        if (bagNum >= itemNum) {
            // eslint-disable-next-line max-len
            ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${i18n.tt(Lang.army_iscost)}<color=${UtilColor.GreenV}>${itemModel.cfg.Name}</color>${i18n.tt(Lang.army_complete_task)}</color>`, () => {
                ControllerMgr.I.ArmyLevelController.reqAutoLvUp();
            }, null);
        } else {
            WinMgr.I.open(ViewConst.ItemSourceWin, itemId);
            // MsgToastMgr.Show(`${itemModel.cfg.Name}${i18n.tt(Lang.not_enough)}`);// 不足
        }
    }
    /** 一键晋升成功 */
    private _onAutoLvUp() {
        this._updateAutoLvUpInfo();
        this._updateTaskInfo();
        this._updateCenterInfo();
    }
    /** 一键晋升 边上的tip */
    private _onTipClick(): void {
        WinMgr.I.open(ViewConst.DescWinTip, FuncDescConst.Army);
    }
    /** 预览 */
    private _onPreViewClick(): void {
        WinMgr.I.open(ViewConst.ArmyPreviewTip);
    }
    /** 技能 */
    private _onNdSkillCLick(): void {
        if (UtilFunOpen.isOpen(FuncId.RoleUniqueSkill, true)) {
            // WinMgr.I.open(ViewConst.EquipWin, tab, params ? params[0] : 0);
            WinMgr.I.open(ViewConst.RoleWin, RolePageType.Skill, ERoleSkillPageType.UniqueSkill);
        }
    }
    /** 点击激活 */
    private _onSkillActive(): void {
        // 如果ID 已激活return

        const cfg: Cfg_ArmySkill = ModelMgr.I.ArmyLevelModel.getSkillCfgByArmyLevel(this._armyLevel);
        const skillId: number = cfg.SkillId;
        if (ModelMgr.I.ArmyLevelModel.isSkillActive(skillId)) {
            return;
        }
        ControllerMgr.I.ArmyLevelController.reqActiveSkill(skillId);
    }
    //
    private _armyLevel: number = 0;// 军衔阶级
    private _armyStar: number = 0;// 军衔等级
    public init(winId: number, param: any[]): void {
        super.init(winId, param, 0);
        if (param && param[1]) {
            this.refreshPage(undefined, param);
        }
    }

    public refreshPage(winId: number, params: any[]): void {
        //
    }

    private _initAll(): void {
        this._updatePower();// 战力
        this._updateCenterInfo();// 中间图标
        this._updateAutoLvUpInfo();// 一键晋升描述信息 任务进度
        this._updateSkillInfo();// 技能名称
        this._updateNextLevelInfo();// 下一等级的描述信息
        this._updateAttrInfo();// 属性
        this._updateTaskInfo();// 更新任务信息
    }

    /** 战斗力 */
    private _updatePower() {
        // 平民没有任何战力
        // if (!this._armyLevel && !this._armyStar) {
        //     this.NdPower.active = false;
        //     return;
        // }
        // 有战力需要显示
        const powerNum: number = ModelMgr.I.ArmyLevelModel.getFightValByArmyLv(this._armyLevel, this._armyStar);
        this.LabPower.string = `${UtilNum.ConvertFightValue(powerNum)}`;
        // this.NdPower.active = !!Number(powerNum);
        // this.NdPower.active = true;//! !Number(powerNum);
    }

    /** 中间名称 图标 五个点亮信息 */
    private _updateCenterInfo() {
        // 军衔名称
        const model: ArmyLevelModel = ModelMgr.I.ArmyLevelModel;
        let url: string = model.getNameIconByArmyLv(this._armyLevel);
        this.SprName.loadImage(url, 1, true);
        /** 当前军衔等级 */
        if (this._armyLevel === 0 && this._armyStar === 0) {
            this.LabName.node.active = false;
        } else {
            this.LabName.node.active = true;
            this.LabName.string = `${this._armyStar}${i18n.lv}`;// 级
            const colorStr: string = ArmyLvConst.getLvColorByArmyLV(this._armyLevel, true);
            this.LabName.node.color = UtilColor.Hex2Rgba(colorStr);
        }

        // 中间图标
        url = model.getIconByArmyLv(this._armyLevel);
        this.SprIcon.loadImage(url, 1, true);

        // 五个点亮图标情况
        for (let i = 1, len = this.SprLvIcons.length; i <= len; i++) {
            const bol = this._armyStar < i;
            UtilColor.setGray(this.SprLvIcons[i - 1].node, bol);
        }
        // 五个图标中的某个 显示特效
        if (this._armyStar !== 0) {
            for (let i = 0; i < 5; i++) {
                if (i < this._armyStar) {
                    this.NdAnimations[i].active = true;
                    const eff = UtilEffectPath.getRoleArmyLvStarEffUrl();
                    this.NdAnimations[i].destroyAllChildren();
                    EffectMgr.I.showEffect(eff, this.NdAnimations[i]);
                } else {
                    this.NdAnimations[i].active = false;
                    this.NdAnimations[i].destroyAllChildren();
                }
            }
        } else {
            for (let i = 0; i < 5; i++) {
                this.NdAnimations[i].active = false;
                this.NdAnimations[i].destroyAllChildren();
            }
        }

        // 是否达到军衔最大等级  点击晋升按钮
        const isMax: boolean = model.isArmyLvMax(this._armyLevel, this._armyStar);
        // this.NdLvUp.active = !isMax;// 不是最大等级 可以晋升

        const statu: boolean = ModelMgr.I.ArmyLevelModel.isAllTaskDone(this._armyLevel, this._armyStar);
        if (isMax || !statu) {
            this.NdLvUp.active = false;
        } else {
            this.NdLvUp.active = true;
        }
    }

    /** 一键晋升底部的文本 */
    private _updateAutoLvUpInfo() {
        // 1 按钮的显示状态
        if (ModelMgr.I.ArmyLevelModel.isUseItem === 0) {
            // 4个任务都完成了
            const statu: boolean = ModelMgr.I.ArmyLevelModel.isAllTaskComplete(this._armyLevel, this._armyStar);
            if (statu || ModelMgr.I.ArmyLevelModel.isArmyLvMax(this._armyLevel, this._armyStar)) {
                this.NdAutoLvUp.active = false;
            } else {
                this.NdAutoLvUp.active = true;
                // 2 显示道具的拥有与升级需要的道具数量
                // 背包拥有的道具数量 & 当前需要消耗的道具数量
                const armyGradeCfg: Cfg_ArmyGrade = ModelMgr.I.ArmyLevelModel.getArmyLevelCfg(this._armyLevel, this._armyStar);
                const tempArr = armyGradeCfg.NeedItem.split(':');
                const itemId: string = tempArr[0];
                const itemNum: number = Number(tempArr[1]);
                const bagNum: number = BagMgr.I.getItemNum(Number(itemId));
                const color: cc.Color = bagNum >= itemNum ? UtilColor.Hex2Rgba(UtilColor.GreenD) : UtilColor.Hex2Rgba(UtilColor.RedD);
                this.LabProgress.string = `${bagNum}/${itemNum}`;
                this.LabProgress.node.color = color;
            }
        } else {
            this.NdAutoLvUp.active = false;// 已经点了一键晋升 需要隐藏
        }
    }

    /** 技能名 */
    private _updateSkillInfo() {
        // 技能名称  军衔等级 [平民]5级
        const cfg: Cfg_ArmySkill = ModelMgr.I.ArmyLevelModel.getSkillCfgByArmyLevel(this._armyLevel);
        const skillId: number = cfg.SkillId;
        const skillCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(skillId);

        // 技能名称
        this.LabSkillName.string = skillCfg.SkillName;

        // Icon 图标
        this.SprSkill.loadImage(`${RES_ENUM.Skill}${skillCfg.SkillIconID}`, 1, true);

        // 判断是否已经开启
        const armyLv = Number(cfg.Army.split('|')[0]);// 需要的军衔等级
        const armyStar = Number(cfg.Army.split('|')[1]);// 需要的星级

        // 玩家当前的军衔等级  玩家当前的星级
        const isActive = ModelMgr.I.ArmyLevelModel.isSkillActive(cfg.SkillId);
        if (isActive) {
            // 已解锁 // 点亮
            // this.SprSkill.getComponent(cc.Sprite).grayscale = false;
            UtilColor.setGray(this.SprSkill.node, false);
            this.NdSkillLv.active = false;// 隐藏开启条件
            this.NdActive.active = false;// 隐藏点击激活
        } else {
            // 未解锁 // 判断能否解锁
            const curUserArmyLv = RoleMgr.I.getArmyLevel();// 军衔
            const curArmyStar = RoleMgr.I.getArmyStar();// 军衔星级

            if (curUserArmyLv > armyLv) {
                // 可解锁
                // this.SprSkill.getComponent(cc.Sprite).grayscale = true;
                UtilColor.setGray(this.SprSkill.node, true);
                this.NdSkillLv.active = false;// 隐藏开启条件
                this.NdActive.active = true;// 隐藏点击激活
            } else if (curUserArmyLv === armyLv) {
                //
                if (curArmyStar >= armyStar) {
                    // 可解锁
                    // this.SprSkill.getComponent(cc.Sprite).grayscale = true;
                    UtilColor.setGray(this.SprSkill.node, true);
                    this.NdSkillLv.active = false;// 隐藏开启条件
                    this.NdActive.active = true;// 隐藏点击激活
                } else {
                    // 不能解锁
                    // this.SprSkill.getComponent(cc.Sprite).grayscale = true;
                    UtilColor.setGray(this.SprSkill.node, true);
                    this.NdSkillLv.active = true;// 隐藏开启条件
                    this.NdActive.active = false;// 隐藏点击激活
                }
            } else {
                // 不能解锁
                // this.SprSkill.getComponent(cc.Sprite).grayscale = true;
                UtilColor.setGray(this.SprSkill.node, true);
                this.NdSkillLv.active = true;// 隐藏开启条件
                this.NdActive.active = false;// 隐藏点击激活
            }
        }
        //
        if (this.NdSkillLv.active) {
            // 开启条件
            this.LabOpenCondition.string = ModelMgr.I.ArmyLevelModel.getArmyName(armyLv);
        }
    }

    /** 中间的下一等级信息 */
    private _updateNextLevelInfo() {
        this.NdDesc.getComponent(CompNextDesc).updateDescInfo(this._armyLevel, this._armyStar);
    }

    /** 三条属性 */
    private _updateAttrInfo(): void {
        const isMax: boolean = ModelMgr.I.ArmyLevelModel.isArmyLvMax(this._armyLevel, this._armyStar);
        let curAttr: IAttrBase[];
        let nextAttr: IAttrBase[];
        let coloneBaseAttr: IAttrBase[];
        if (this._armyLevel === 0 && this._armyStar === 0) {
            curAttr = ModelMgr.I.ArmyLevelModel.getAttrInfo(1, 1);
            const tempAttr: IAttrBase[] = curAttr;
            for (const item of tempAttr) {
                item.value = 0;
            }
            coloneBaseAttr = tempAttr;

            nextAttr = ModelMgr.I.ArmyLevelModel.getAttrInfo(1, 2);
        } else if (isMax) {
            curAttr = ModelMgr.I.ArmyLevelModel.getAttrInfo(this._armyLevel, this._armyStar);
            coloneBaseAttr = curAttr;
            nextAttr = null;
        } else {
            curAttr = ModelMgr.I.ArmyLevelModel.getAttrInfo(this._armyLevel, this._armyStar);
            coloneBaseAttr = curAttr;
            if (this._armyStar === 5) {
                nextAttr = ModelMgr.I.ArmyLevelModel.getAttrInfo(this._armyLevel + 1, 1);
            } else {
                nextAttr = ModelMgr.I.ArmyLevelModel.getAttrInfo(this._armyLevel, this._armyStar + 1);
            }
        }

        // 由于UI显示不够显示问题 策划说暂时搁置如下 若需要打开注释即可食用

        // // 克隆一份
        // const coloneBaseAttr: IAttrBase[] = JSON.parse(JSON.stringify(curAttr));
        // let coloneAddAttr: IAttrBase[];
        // if (nextAttr && nextAttr.length) {
        //     coloneAddAttr = JSON.parse(JSON.stringify(nextAttr));
        // }

        // // 拿到了当前等级下一等级
        // for (let i = 0, len = coloneBaseAttr.length; i < len; i++) {
        //     const base: IAttrBase = coloneBaseAttr[i];
        //     if (coloneAddAttr && coloneAddAttr.length) { // 有下一级的属性
        //         const add: IAttrBase = coloneAddAttr[i];
        //         add.value -= base.value;
        //     }
        // }

        // const bol: boolean = !!(nextAttr && nextAttr.length);
        // const opts: BaseAddOptions = {
        //     isShowAdd: bol,
        //     baseAddwidth: 201, // 总宽度
        //     NdAttrWidth: 141, // 左边的宽度
        //     NdAddWidth: 70, // 加成得宽度
        //     NdAttrSpaceX: 0, // 左边间隙
        //     NdAddSpaceX: 0, // 右边间隙
        //     NdAttrX: -100, // 左边的X
        //     NdAddX: 41,
        //     NdAttrColor: UtilColor.OrangeV, // 左边的颜色
        //     NdAddColor:  UtilColor.GreenV, // 右边的颜色
        //     signkey: ':',
        //     signVal: '',
        // };
        // this.NdAttrContainer.getComponent(NdAttrBaseAdditionContainer).init(coloneBaseAttr, coloneAddAttr, opts);

        const opts: BaseAddOptions = {
            isShowAdd: false,
            baseAddwidth: 201, // 总宽度
            NdAttrWidth: 141, // 左边的宽度
            NdAddWidth: 70, // 加成得宽度
            NdAttrSpaceX: 0, // 左边间隙
            NdAddSpaceX: 0, // 右边间隙
            NdAttrX: -100, // 左边的X
            NdAddX: 41,
            NdAttrColor: UtilColor.NorN, // 左边的橙色颜色
            NdAddColor: UtilColor.GreenV, // 右边的绿色颜色
            signkey: ':',
            signVal: '',
        };
        this.NdAttrContainer.getComponent(NdAttrBaseAdditionContainer).init(coloneBaseAttr, null, opts);
    }

    private _onUpdateTask(ids: number[]) { // 当前人物对应的id
        const taskIds: number[] = ModelMgr.I.ArmyLevelModel.getTaskIds(this._armyLevel, this._armyStar);
        // 任务变化  当前四个任务是否与变化的有关
        let bol = false;
        for (const id of ids) {
            if (taskIds.indexOf(id) !== -1) {
                bol = true;
                break;
            }
        }
        if (bol) {
            this._updateCenterInfo();
            this._updateAutoLvUpInfo();// 一键晋升描述信息 任务进度
            this._updateTaskInfo();
        }
    }

    /** 更新任务信息 */
    private _updateTaskInfo() { // 任务信息四个节点
        const isMax = ModelMgr.I.ArmyLevelModel.isArmyLvMax(this._armyLevel, this._armyStar);
        this.NdMax.active = isMax;
        this.NdTaskItems.active = !isMax;
        if (isMax) { return; }

        let taskIds = ModelMgr.I.ArmyLevelModel.getTaskIds(this._armyLevel, this._armyStar);
        if (taskIds.length === 1 && !taskIds[0]) {
            // 达到了最大等级 需要特殊处理UI
            taskIds = ModelMgr.I.ArmyLevelModel.getTaskIds(this._armyLevel, this._armyStar - 1);
            // return;
        }
        for (let i = 0, len = this.ArmyTaskItems.length; i < len; i++) {
            const armyTaskItem: ArmyTaskItem = this.ArmyTaskItems[i].getComponent(ArmyTaskItem);
            armyTaskItem.setData(taskIds[i]);
        }
    }
}
