import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { Config } from '../../../base/config/Config';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import UtilItem from '../../../base/utils/UtilItem';
import { ComHeadItem } from '../../../com/headIten/ComHeadItem';
import { HeadData } from '../../../com/headIten/ConstHead';
import { ItemWhere } from '../../../com/item/ItemConst';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import WinBase from '../../../com/win/WinBase';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import { EntityUnitType } from '../../../entity/EntityConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { BeautyInfo } from '../../beauty/BeautyInfo';
import { GeneralMsg } from '../../general/GeneralConst';
import { EntityData } from '../FamilyConst';
import FamilyModel from '../FamilyModel';
import { FamilyUIType } from '../FamilyVoCfg';
import { FamilyHeadItem } from './FamilyHeadItem';
import { FamilyHeadItemAdd } from './FamilyHeadItemAdd';

const { ccclass, property } = cc._decorator;

@ccclass
export class FamilySetAssistTip extends WinBase {
    @property(cc.Node)
    private NdSprMask: cc.Node = null;
    @property([cc.Toggle])
    private arrToggle: cc.Toggle[] = [];

    // 公共部分
    @property(ListView)// 底部 武将 红颜 军师列表
    private list: ListView = null;
    @property(cc.Label)// 标题
    private LabTitle: cc.Label = null;
    @property(cc.Label)// 标题内容
    private LabDesc: cc.Label = null;

    // 设置协助-------------------
    @property(cc.Node)// 设置协助
    private NdSetAssist: cc.Node = null;
    @property(cc.Label)// 协助奖励次数
    private LabRewardNum: cc.Label = null;
    @property(cc.Label)// cd时间
    private LabTime: cc.Label = null;
    @property(cc.Node)// 设置协助奖励列表
    private NdRewards: cc.Node = null;
    @property(cc.Prefab)
    private itemIcon: cc.Prefab = null;
    @property([cc.Node])// 三个背景
    private SprBgArr: cc.Node[] = [];
    @property([ComHeadItem])// 三个头像
    private comHeadItemArr: ComHeadItem[] = [];

    // 任务详情------------------
    @property(cc.Node)// 任务详情
    private NdTaskDetail: cc.Node = null;

    @property(DynamicImage)// 任务名称背景
    private SprTaskNameBg: DynamicImage = null;
    @property(cc.Label)// 任务名称
    private LabTaskName: cc.Label = null;

    // 条件
    @property(cc.Node)// 派遣条件容器
    private NdNameContainer1: cc.Node = null;
    @property(cc.Node)// 缘分条件容器
    private NdNameContainer2: cc.Node = null;
    @property(cc.Prefab)// 名称
    private NdNameItem: cc.Prefab = null;
    // 派遣列表
    @property(ListView)// 派遣列表
    private listHead: ListView = null;
    //
    @property(cc.Node)// 确定
    private BtnSure: cc.Node = null;
    @property(cc.Node)// 取消
    private BtnCancel: cc.Node = null;
    @property(cc.Label)// 取消文本
    private LabCancel: cc.Label = null;

    @property(DynamicImage)// 消耗
    private SprCost: DynamicImage = null;
    @property(cc.Label)// 消耗
    private LabCost: cc.Label = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => {
            this._onThisClose();
        }, this, { scale: 1 });

        for (let i = 0, len = this.arrToggle.length; i < len; i++) {
            this.arrToggle[i].node.on('toggle', () => {
                this._onToggle(i);
            }, this);
        }
        UtilGame.Click(this.BtnClose, this.close, this);
        UtilGame.Click(this.BtnCancel, this._onBtnCancel, this);
        UtilGame.Click(this.BtnSure, this._onBtnSure, this);
        // 设置协助返回
        EventClient.I.on(E.Family.FamilySetAssist, this._onSetAssist, this);
        /** 一键派遣成功 */
        EventClient.I.on(E.Family.FamilySingleSendSuccess, this._onFamilySingleSendSuccess, this);
        // 点击3个设置协助伙伴
        for (let i = 0; i < 3; i++) {
            UtilGame.Click(this.comHeadItemArr[i].node, this._onSetPartnerClick, this, { customData: i });
        }
    }

    private _onFamilySingleSendSuccess() {
        // 一键派遣成功
        MsgToastMgr.Show(i18n.tt(Lang.family_SendSuccess));
        this.close();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.unschedule(this._initHelpTime);
        this.model.resetPartnerList();// 重置协助伙伴
        EventClient.I.off(E.Family.FamilySetAssist, this._onSetAssist, this);
        EventClient.I.off(E.Family.FamilySingleSendSuccess, this._onFamilySingleSendSuccess, this);
        EventClient.I.off(E.Family.FamilyGetHelpPL, this._onInitHeroList, this);
    }

    private _onBtnCancel(): void {
        if (this._uiType === FamilyUIType.SetAssist) {
            this.model.resetPartnerList();// 重置协助伙伴
            this.close();
        } else {
            this._autoSelect();// 任务详情直接关闭UI
        }
    }

    private _onThisClose(): void {
        if (this._uiType === FamilyUIType.SetAssist) {
            this.model.resetPartnerList();// 重置协助伙伴
        }
        this.close();
    }

    // 发送设置协助
    private _onBtnSure(): void {
        if (this._uiType === FamilyUIType.SetAssist) {
            const list: SetPartner[] = this.model.getPartnerList();
            if (list.length) {
                // 判断CD  ===0
                const preTime: number = this.model.getHelpTime();// 当前CD时间
                const deltTime: number = this.model.getCfgAssistCD();// 设置协助间隔时间
                const nowTime: number = UtilTime.NowSec();// 当前时间+间隔时间

                if (preTime === 0 || nowTime - preTime > deltTime) {
                    if (list.length === 3) {
                        ControllerMgr.I.FamilyController.reqC2SFamilyTaskSetPartnerToHelp(list);
                    } else {
                        ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${i18n.tt(Lang.family_notFull)}</color>`, () => {
                            ControllerMgr.I.FamilyController.reqC2SFamilyTaskSetPartnerToHelp(list);
                        }, null);
                    }
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.family_timeLimit));// 设置协助CD冷却中
                }
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.family_setPartner));// 请选择协助伙伴
            }
        } else {
            // 武将个数达到needNum
            // 根据品质确定当前需要派遣多少个
            const quality: number = this._familyTask.Quality;
            const needNum: number = this.model.getCfgNeedNumByQuality(quality);

            const hadNum: number = this.model.getgetHeadTempArrLen();
            if (hadNum < needNum) {
                MsgToastMgr.Show(i18n.tt(Lang.family_SendNotEnough));
                return;
            }

            // 判断事务令是否足够
            const limitNum: number = ModelMgr.I.FamilyModel.getCfgItemCostLimit();
            const [itemId, itemNum] = ModelMgr.I.FamilyModel.getCfgItemCost();
            const itemModel: ItemModel = UtilItem.NewItemModel(Number(itemId), Number(itemNum));
            const curNum: number = ModelMgr.I.FamilyModel.getCurItemCost();// 已经使用数量
            if (curNum >= limitNum) { // 判断是否达到上限
                MsgToastMgr.Show(`${itemModel.cfg.Name}${i18n.tt(Lang.family_uptoLimit)}`);
                return;
            }
            const bagNum = BagMgr.I.getItemNum(Number(itemId));
            if (bagNum < Number(itemNum)) {
                WinMgr.I.open(ViewConst.ItemSourceWin, Number(itemId));// 事务令不足
                // MsgToastMgr.Show(itemModel.cfg.Name + i18n.tt(Lang.not_enough));
                return;
            }

            // 判断基本条件是否达成
            //
            const conditionIds: number[] = this._familyTask.TaskConditionIds;

            for (let i = 0, len = conditionIds.length; i < len; i++) { // 条件1 2 3
                const cid: number = conditionIds[i];
                const cfgTaskCondition: Cfg_TaskCondition = this.model.CfgTaskCondition(cid);

                const bol = this.model.checkSelectCondition(cfgTaskCondition);// 角色1 2 3
                if (!bol) {
                    MsgToastMgr.Show(`${i18n.tt(Lang.family_condition)}`);
                    return;
                }
            }

            // 判断是否有缘分条件

            // 缘分条件
            const fateId: number = this._familyTask.TaskFateId;// 缘分ID
            if (fateId) {
                const cfgTaskFateCondition: Cfg_TaskFateCondition = this.model.CfgTaskFateCondition(fateId);
                const partnerNum: number = cfgTaskFateCondition.PartnerNum;// 缘分数量
                const partnerIds = cfgTaskFateCondition.PartnerIds.split('|');
                const partnerTypes = cfgTaskFateCondition.PartnerTypes.split('|');
                let pass = true;
                for (let i = 0; i < partnerNum; i++) {
                    const id = partnerIds[i];
                    const type = Number(partnerTypes[i]);
                    const isPassCondition = this.model.checkFateCondition(id, type);
                    if (!isPassCondition) {
                        pass = false;
                        break;
                    }
                }
                if (!pass) {
                    ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${i18n.tt(Lang.family_rewardFate)}</color>`, () => {
                        ControllerMgr.I.FamilyController.reqC2SFamilyTaskStart(this._familyTask.TaskId, this.model.getHeadDataArr());
                    }, null);
                    return;
                }
            }
            ControllerMgr.I.FamilyController.reqC2SFamilyTaskStart(this._familyTask.TaskId, this.model.getHeadDataArr());
        }
    }

    // 返回设置协助
    private _onSetAssist(): void {
        MsgToastMgr.Show(i18n.tt(Lang.family_SetSuccess));
        this._initHelpTime();
        this.unschedule(this._initHelpTime);
        this.schedule(this._initHelpTime, 1);
    }

    private _onToggle(idx: number): void {
        this._curToggleIdx = idx;// 0 1 2 当前选中的是 武将  红颜 军师
        for (let i = 0, len = this.arrToggle.length; i < len; i++) {
            if (idx === i) {
                this.arrToggle[i].isChecked = true;
            } else {
                this.arrToggle[i].isChecked = false;
            }
        }
        this._initButtomList();
    }

    private _uiType: FamilyUIType;
    private _curToggleIdx: number = -1;// 当前选中 武将 红颜 军师 0  1 2
    private model: FamilyModel;
    // 当前这个任务信息
    private _familyTask: FamilyTask;
    private _openHasHead: boolean = false;
    public init(params: any): void {
        EventClient.I.on(E.Family.FamilyGetHelpPL, this._onInitHeroList, this);
        this.model = ModelMgr.I.FamilyModel;
        // eslint-disable-next-line
        this._uiType = params[0];// 1  || 2

        // 当前这个任务信息
        // eslint-disable-next-line
        this._familyTask = params[1];

        // 从世家任务列表进来这个值是空的 从可派遣列表中进来这个值是有的
        // 就是后端给预选好的 进入当前 任务详情页，是否带有后端下发的预选头像
        // eslint-disable-next-line
        this._openHasHead = params[2];
        if (!this._openHasHead) {
            this.model.clearHeadDataArr();
        }

        // 顶部信息
        this._initTopInfo();

        // 底部列表
        this._curToggleIdx = 0;

        // 标题
        this._initTitle();
        this._initButtomList();// 底部列表不同
        this.list.scrollTo(0);

        // 底部 取消按钮 && 自动派遣
        this._initCancelBtn();
    }

    private _initButtomList(): void {
        if (FamilyUIType.SetAssist === this._uiType) { // 设置协助
            this._initList();
        } else {
            this._reqHeroList();
        }
    }

    /** 获得协助伙伴列表后 初始化底部列表 */
    // private _curData: any[];
    private _onInitHeroList(): void {
        // 底部列表 BeautyInfo[] | GeneralMsg[]
        let len;
        if (this._curToggleIdx === 0) { // 武将
            this._curData = this.model.getGeneralAllData();
        } else if (this._curToggleIdx === 1) { // 红颜
            this._curData = this.model.getBeautyAllData();
        } else { // 军师
            // 军师功能待完成
            // 待开发
            // 待开发
            // 待开发
            // 待开发
            len = 0;
            this._curData = [];
        }
        len = this._curData && this._curData.length ? this._curData.length : 0;

        this.list.setNumItems(len, 0);
    }

    private _initTopInfo(): void {
        this.NdTaskDetail.active = FamilyUIType.SetAssist !== this._uiType;// 任务详情
        this.NdSetAssist.active = FamilyUIType.SetAssist === this._uiType;// 设置协助

        if (FamilyUIType.SetAssist === this._uiType) { // 设置协助
            this._assistRewardList();// 奖励列表
            this._initRewardNum();// 奖励次数
            this._initPartner();// 协助伙伴0 1 2
            this._initHelpTime();
            this.unschedule(this._initHelpTime);
            this.schedule(this._initHelpTime, 1);
        } else { // 任务详情
            this._initTaskName();// 任务名称
            this._initHeroPartner();// 派遣英雄选中列表
            this._initCondition();// 条件 缘分
        }
    }

    // 取消|自动派遣
    private _initCancelBtn(): void {
        if (FamilyUIType.SetAssist === this._uiType) { // 设置协助
            this.LabCancel.string = i18n.tt(Lang.com_btn_cancle);// 取消
            this.SprCost.node.active = false;
            this.LabCost.node.active = false;
        } else { // 任务详情
            this.LabCancel.string = i18n.tt(Lang.family_AutoSelect);// 自动派遣

            this.SprCost.node.active = true;
            this.LabCost.node.active = true;
            const arrStr: any[] = ModelMgr.I.FamilyModel.getCfgItemCost();
            const itemId = arrStr[0];
            const itemNum = arrStr[1];
            // 已经使用数量
            const bagNum = BagMgr.I.getItemNum(Number(itemId));
            const path = UtilItem.GetItemIconPathByItemId(Number(itemId));
            this.SprCost.loadImage(path, 1, true);
            // 刷新消耗
            this.LabCost.string = `${UtilNum.Convert(bagNum)}/${UtilNum.Convert(Number(itemNum))}`;
            this.LabCost.node.color = UtilColor.costColor(bagNum, Number(itemNum));
        }
    }

    /** -----------任务详情----------- */
    // 自动选择 如果原本后端有发则用后端 ，没有需要自己填充
    private _autoSelect(): void {
        if (this._openHasHead) { // 打开就有头像，就用后端选用的头像
            this._initHeroPartner();
        } else {
            this._headDataArr = [];
            const quality: number = this._familyTask.Quality;
            const needNum: number = this.model.getCfgNeedNumByQuality(quality);
            this.listHead.setNumItems(needNum, 0);
            this.listHead.scrollTo(0);
            // 根据品质确定当前需要派遣多少个
            ModelMgr.I.FamilyModel.setAutoSelect(this._familyTask);
            this._headDataArr = this.model.getHeadDataArr();
            this.listHead.setNumItems(needNum, 0);
            this.listHead.scrollTo(0);
        }

        if (!this._headDataArr.length) {
            MsgToastMgr.Show(i18n.tt(Lang.family_notFit));
            return;
        }
        this.updateCondition();
        this._onInitHeroList();
    }

    // 任务详情
    private _initTaskName(): void {
        // 标题品质
        const quality: number = this._familyTask.Quality;
        const path: string = UtilItem.GetItemQualityTitleBgPath(quality);
        this.SprTaskNameBg.loadImage(path, 1, true);

        // 任务名称
        const nameId: number = this._familyTask.NameId;
        const cfgTaskName: Cfg_TaskName = this.model.CfgTaskName(nameId);
        this.LabTaskName.string = cfgTaskName.TaskName;
    }
    /** 更新节点颜色 */
    private updateCondition(): void {
        console.log(this.NdNameContainer1.childrenCount);

        const conditionIds: number[] = this._familyTask.TaskConditionIds;
        for (let i = 0, len = conditionIds.length; i < len; i++) {
            // 创建多个label
            const cid: number = conditionIds[i];
            const cfgTaskCondition: Cfg_TaskCondition = this.model.CfgTaskCondition(cid);

            const LabelName: cc.Label = this._tempLab1Arr[i];

            const isPassCondition = this.model.checkSelectCondition(cfgTaskCondition);
            let c: cc.Color;
            if (isPassCondition) {
                c = UtilColor.Hex2Rgba(UtilColor.GreenV);
            } else {
                c = UtilColor.Hex2Rgba(UtilColor.RedV);
            }
            LabelName.node.color = c;
        }

        // 缘分条件
        const fateId: number = this._familyTask.TaskFateId;// 缘分ID
        if (!fateId) return;
        const cfgTaskFateCondition: Cfg_TaskFateCondition = this.model.CfgTaskFateCondition(fateId);
        const partnerNum: number = cfgTaskFateCondition.PartnerNum;// 缘分数量
        const partnerIds = cfgTaskFateCondition.PartnerIds.split('|');
        const partnerTypes = cfgTaskFateCondition.PartnerTypes.split('|');
        for (let i = 0; i < partnerNum; i++) {
            // 检测缘分条件是否成立

            const LabelName: cc.Label = this._tempLab2Arr[i];
            // let
            const id = partnerIds[i];
            const type = Number(partnerTypes[i]);
            const isPassCondition = this.model.checkFateCondition(id, type);
            let c: cc.Color;
            if (isPassCondition) {
                c = UtilColor.Hex2Rgba(UtilColor.GreenV);
            } else {
                c = UtilColor.Hex2Rgba(UtilColor.RedV);
            }
            LabelName.node.color = c;
        }
    }

    /** 条件 缘分 */
    private _tempLab1Arr: cc.Label[];
    private _tempLab2Arr: cc.Label[];
    private _initCondition(): void {
        this._tempLab1Arr = [];
        this._tempLab2Arr = [];
        // 派遣条件Name
        this.NdNameContainer1.destroyAllChildren();
        const conditionIds: number[] = this._familyTask.TaskConditionIds;
        for (let i = 0, len = conditionIds.length; i < len; i++) {
            // 创建多个label
            const cid: number = conditionIds[i];
            const cfgTaskCondition: Cfg_TaskCondition = this.model.CfgTaskCondition(cid);

            // 名称
            const name = this._getConditionName(cfgTaskCondition);
            const node: cc.Node = cc.instantiate(this.NdNameItem);
            const LabelName: cc.Label = node.getComponent(cc.Label);
            LabelName.string = name;
            this._tempLab1Arr.push(LabelName);

            const isPassCondition = this.model.checkSelectCondition(cfgTaskCondition);
            let c: cc.Color;
            if (isPassCondition) {
                c = UtilColor.Hex2Rgba(UtilColor.GreenV);
            } else {
                c = UtilColor.Hex2Rgba(UtilColor.RedV);
            }
            LabelName.node.color = c;
            this.NdNameContainer1.addChild(node);
        }

        // 缘分条件
        this.NdNameContainer2.destroyAllChildren();
        const fateId: number = this._familyTask.TaskFateId;// 缘分ID
        if (!fateId) return;

        const cfgTaskFateCondition: Cfg_TaskFateCondition = this.model.CfgTaskFateCondition(fateId);

        const partnerNum: number = cfgTaskFateCondition.PartnerNum;// 缘分数量
        const partnerTypes = cfgTaskFateCondition.PartnerTypes.split('|');
        const partnerIds = cfgTaskFateCondition.PartnerIds.split('|');

        for (let i = 0; i < partnerNum; i++) {
            // const type = partnerTypes[i];
            const id = partnerIds[i];
            // const partnerId: string = partnerIds[i];
            const type = Number(partnerTypes[i]);
            let strName: string = '';
            if (Number(type) === EntityUnitType.General) { // 武将
                const cfg: Cfg_General = ModelMgr.I.GeneralModel.getGeneralCfgById(Number(id));// 从武将表读取 partnerId;
                const name: string = cfg.Name;
                strName = `(${i18n.tt(Lang.general_name)})${name}`;
            } else if (Number(type) === EntityUnitType.Beauty) { // 红颜
                const cfgBeauty: Cfg_Beauty = Config.Get(Config.Type.Cfg_Beauty).getValueByKey(Number(id));
                const name = cfgBeauty.Name;// 从武将表读取 partnerId;
                strName = `(${i18n.tt(Lang.beauty_name)})${name}`;
            }
            // else if (Number(type) === EntityUnitType.Army) { // 军师
            // 待开发
            // const name = '赵云';// 从武将表读取 partnerId;
            // strName = `师(${name})`;
            // 待开发
            // 待开发
            // 待开发
            // }
            const node: cc.Node = cc.instantiate(this.NdNameItem);
            const LabelName: cc.Label = node.getComponent(cc.Label);
            LabelName.string = strName;
            this._tempLab2Arr.push(LabelName);// 第二个
            this.NdNameContainer2.addChild(node);

            const isPassCondition = this.model.checkFateCondition(id, type);
            let c: cc.Color;
            if (isPassCondition) {
                c = UtilColor.Hex2Rgba(UtilColor.GreenV);
            } else {
                c = UtilColor.Hex2Rgba(UtilColor.RedV);
            }
            LabelName.node.color = c;
        }
    }

    // 派遣条件 缘分条件
    private _getConditionName(cfgTaskCondition: Cfg_TaskCondition): string {
        let str: string = '';
        // 上阵{ 0 } { 1 } { 2 } { 3 } { 4 }* { 5}
        // 0代表品质颜色名称
        const QualityStr: string = cfgTaskCondition.Quality ? i18n.tt(Lang[`general_quality_se${cfgTaskCondition.Quality}`]) : '';
        if (QualityStr) {
            str += QualityStr + i18n.tt(Lang.family_above);// '以上'
        } else {
            str += QualityStr;
        }
        // 1代表武将稀有度名称
        const RarityStr: string = cfgTaskCondition.Rarity ? i18n.tt(Lang[`general_rarity_${cfgTaskCondition.Rarity}`]) : '';
        if (RarityStr) {
            str += RarityStr + i18n.tt(Lang.family_above);// '以上'
        } else {
            str += RarityStr;
        }
        // 2代表武将阵营名称
        //
        const CampStr: string = cfgTaskCondition.Camp ? i18n.tt(Lang[`general_camp_guo${cfgTaskCondition.Camp}`]) : '';
        str += CampStr;
        // 3代表武将头衔名称
        const TitleStr: string = cfgTaskCondition.Title ? i18n.tt(Lang[`general_title_${cfgTaskCondition.Title}`]) : '';
        if (TitleStr) {
            str += TitleStr + i18n.tt(Lang.family_above);// '以上'
        } else {
            str += TitleStr;
        }

        // 4代表伙伴类型名称（2武将 3红颜 x军师）
        const pt: number = cfgTaskCondition.PartnerType;
        let ptTypeStr = '';
        if (pt === EntityUnitType.General) {
            ptTypeStr = i18n.tt(Lang.general_name);// '武将';
        } else if (pt === EntityUnitType.Beauty) {
            ptTypeStr = i18n.tt(Lang.beauty_name);// '红颜';
        }
        // else if(//军师){
        // ptTypeStr = i18n.tt(Lang.army_name);// '军师';
        // 待开发
        // 待开发
        // 待开发
        // 待开发
        // 待开发
        // }
        str += ptTypeStr;

        // 6代表上阵伙伴数量
        const PartnerNumStr: string = cfgTaskCondition.PartnerNum ? `*${cfgTaskCondition.PartnerNum}` : '';
        str += PartnerNumStr;
        return str;
    }

    /** 底部的英雄列表 */
    private _reqHeroList(): void {
        ControllerMgr.I.FamilyController.reqC2SFamilyTaskHelpPartner();
    }

    private _headDataArr: SetPartner[] = [];
    private _initHeroPartner(): void {
        this._headDataArr = [];
        // 根据品质确定当前需要派遣多少个
        const quality: number = this._familyTask.Quality;
        // 需要多少个是固定的
        const needNum: number = this.model.getCfgNeedNumByQuality(quality);

        if (this._openHasHead) {
            // 头像的增删改查都对这个进行
            this._headDataArr = ModelMgr.I.FamilyModel.initHeadTempArr(this._familyTask.TaskId);
        }
        this.listHead.setNumItems(needNum, 0);
        this.listHead.scrollTo(0);
    }
    private _updateHeroPartner(): void {
        const quality: number = this._familyTask.Quality;
        const needNum: number = this.model.getCfgNeedNumByQuality(quality);

        this._headDataArr = ModelMgr.I.FamilyModel.getHeadDataArr();
        this.listHead.setNumItems(needNum, 0);
        this.listHead.scrollTo(0);
    }

    /** 头像列表 */
    public onScrollHeadList(node: cc.Node, index: number): void {
        const fheadItemAdd: FamilyHeadItemAdd = node.getComponent(FamilyHeadItemAdd);
        if (this._headDataArr[index]) {
            fheadItemAdd.setData(this._headDataArr[index]);
        } else {
            fheadItemAdd.setData(null);
        }
        // // 如下代码，可放入FamilyHeadItemAdd处理，点击事件可分点击与长按操作 需要给ComHeadItem增加长按组件 后续如有需求再扩展
        const nodeEvent: cc.Node = node.getChildByName('NdEvent');
        nodeEvent.targetOff(this);
        UtilGame.Click(nodeEvent, () => {
            const partner: SetPartner = this._headDataArr[index];

            if (!partner) return; // 没有数据 直接结束

            // 头像列表删除 更新头像列表
            this.model.deleteHeadItemById(partner.Id);
            this._updateHeroPartner();
            /** 更新底部列表 */

            // 判断当前页签是否在当前类型
            const id: string = partner.Id;
            const type: number = partner.PartnerType;
            // const _curData: EntityData[] = [];
            let listIndex = -1;
            for (let i = 0, len = this._curData.length; i < len; i++) {
                let onlyId: string = '';
                const eData: EntityData = this._curData[i];
                if (this._curToggleIdx === 0 && type === EntityUnitType.General) { // 选在武将
                    onlyId = eData.StrId;
                } else if (this._curToggleIdx === 1 && type === EntityUnitType.Beauty) { // 选在红颜
                    onlyId = eData.StrId;
                }
                // else if(this._curToggleIdx ===2 && type === EntityUnitType.Army){
                // 待开发
                // 待开发
                // 待开发
                // 待开发
                // }
                if (onlyId === id) {
                    listIndex = i;
                    break;
                }
            }

            if (listIndex !== -1) {
                this.list.updateItem(listIndex);
            }
            this.updateCondition();
        }, this);
    }
    // 设置协助------------------
    // 协助-奖励列表
    private _reWardData: number[][];
    private _assistRewardList(): void {
        this._reWardData = this.model.getCfgRewardData();

        // 删除自己的所有节点
        this.NdRewards.destroyAllChildren();
        for (let i = 0, len = this._reWardData.length; i < len; i++) {
            //
            const [itemId, itemNum] = [Number(this._reWardData[i][0]), Number(this._reWardData[i][0])];
            const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);
            const node: cc.Node = cc.instantiate(this.itemIcon);
            const item: ItemIcon = node.getComponent(ItemIcon);
            item.setData(itemModel, { needName: false, needNum: true, where: ItemWhere.OTHER });
            this.NdRewards.addChild(node);
        }
    }
    // 协助伙伴
    private _initPartner(): void { // 协助伙伴
        const partnerList: SetPartner[] = this.model.getPartnerList();
        // 隐藏3个背景
        for (let i = 0; i < 3; i++) {
            this.SprBgArr[i].active = true;
            this.comHeadItemArr[i].node.active = false;
        }
        for (let i = 0, len = partnerList.length; i < len; i++) {
            this.SprBgArr[i].active = false;
            this.comHeadItemArr[i].node.active = true;
            // 设置头像
            const partnerId: string = partnerList[i].Id;// id
            const partnerType: number = partnerList[i].PartnerType;// 伙伴类型

            if (partnerType === EntityUnitType.General) { // 武将
                const _data: GeneralMsg = ModelMgr.I.GeneralModel.generalData(partnerId);

                const t = _data.generalData.Title;
                const r = _data.cfg.Rarity;
                const headData: HeadData = {
                    quality: _data.generalData.Quality, // 品质
                    headIconId: Number(_data.cfg.RebornPetHeadIcon.split('|')[0]), // 头像
                    // select?: boolean, // 正方形的一个选中框
                    // isCheck: isChecked, // 是否选中√
                    // isLockBig?: boolean, // 是否锁住 大的锁
                    level: _data.cfg.Name, // 等级 传入一个字符串 不传不显示
                    // levelColor?: cc.Color, // 等级颜色 不传默认白色
                    sprTitlePath: UtilGeneral.GetSmallTitle(r, t),
                    //  `${RES_ENUM.General_Img_Wujiang_T3}${_data.generalData.Title}`, // 标题  背景 或者 极品 稀有 普通
                    labTitle: i18n.tt(Lang[`general_title_${t}`]), // 无双 盖世...
                    sprRarityPath: UtilGeneral.GRPath(r), // 虎将 武将 名将...
                    customData: [partnerId, partnerType],
                };
                this.comHeadItemArr[i].setData(headData);
            } else if (partnerType === EntityUnitType.Beauty) { // 红颜
                const _data: BeautyInfo = ModelMgr.I.BeautyModel.getBeauty(Number(partnerId));
                const cfgBeauty = _data.cfg.getValueByKey(_data.BeautyId, { Quality: 0, AnimId: 0, Name: '' });
                // const BeautyId: string = `${_data.BeautyId}`;
                const headData: HeadData = {
                    quality: cfgBeauty.Quality, // 品质
                    headIconId: cfgBeauty.AnimId, // 头像
                    // // select?: boolean, // 正方形的一个选中框
                    // isCheck: boolean, // 是否选中√
                    // // isLockBig?: boolean, // 是否锁住 大的锁
                    level: cfgBeauty.Name, // 等级 传入一个字符串 不传不显示
                    // // levelColor?: cc.Color, // 等级颜色 不传默认白色
                    sprTitlePath: UtilItem.GetItemQualityFontImgPath(cfgBeauty.Quality), // 标题  背景 或者 极品 稀有 普通
                    // labTitle: i18n.tt(Lang[`general_title_${_data.generalData.Title}`]), // 无双 盖世...
                    customData: [partnerId, partnerType],

                };
                this.comHeadItemArr[i].setData(headData);
            }
            // else if(partnerType === 军师){
            //     //待开发
            //     //待开发
            // let headData = {}
            // this.comHeadItemArr[i].setData(headData);
            //     //待开发
            //     //待开发
            // }
        }

        // ModelMgr.I.BeautyModel.getBeauty(Number())
        // ModelMgr.I.GeneralModel.generalData() .getBeauty(Number())
    }

    private _onSetPartnerClick(target: cc.Node, idx): void {
        const headItem: ComHeadItem = target.getComponent(ComHeadItem);
        const [id, type] = headItem.getCustomData();

        // 从选中列表删除
        this.model.deleteHelpPartnerList(id);
        this._initPartner();
        // 判断当前页签是否在当前类型
        const listIndex: number = this._getCurPartnerIndex(id, type);
        if (listIndex !== -1) {
            this.list.updateItem(listIndex);
        }
    }

    private _getCurPartnerIndex(id: string, type: EntityUnitType): number {
        for (let i = 0, len = this._curData.length; i < len; i++) {
            let onlyId: string = '';
            if (this._curToggleIdx === 0 && type === EntityUnitType.General) { // 选在武将
                const data: GeneralMsg = this._curData[i];
                onlyId = data.generalData.OnlyId;
            } else if (this._curToggleIdx === 1 && type === EntityUnitType.Beauty) { // 选在红颜
                const data: BeautyInfo = this._curData[i];
                onlyId = `${data.BeautyId}`;
            }
            // else if(this._curToggleIdx ===2 && type === EntityUnitType.Army){
            // 待开发
            // this.list.updateItem(index);
            // 待开发
            // 待开发
            // 待开发
            // }
            if (onlyId === id) {
                return i;
            }
        }
        return -1;
    }

    // 设置协助时间
    private _initHelpTime(): void {
        // 上次设置时间
        const preTime: number = this.model.getHelpTime();
        if (!preTime) {
            this.LabTime.string = ``;
            this.unschedule(this._initHelpTime);
        } else {
            const nowTime: number = UtilTime.NowSec();
            // preTime
            const deltCfgTime: number = this.model.getCfgAssistCD();// 设置协助间隔时间
            // 当前时间-上次时间>间隔 又可以发送
            if (nowTime - preTime >= deltCfgTime) {
                this.LabTime.string = ``;
                this.unschedule(this._initHelpTime);
            } else {
                const pastTime = nowTime - preTime;// 已经过去了多久
                const leftTime: number = deltCfgTime - pastTime;// 还剩余多长时间结束cd
                const timeStr: string = UtilTime.FormatHourDetail(leftTime);
                this.LabTime.string = `${i18n.tt(Lang.family_cd)}${' '}${timeStr}`;
            }
        }
    }

    // 奖励次数
    private _initRewardNum(): void {
        const num: number = this.model.getSetAssistRewardNum();
        this.LabRewardNum.string = `（${i18n.tt(Lang.family_times)}${num}/3）`;
    }

    // 公共部分----------------------
    private _initTitle(): void { // 标题 任务详情
        if (FamilyUIType.SetAssist === this._uiType) {
            this.LabTitle.string = i18n.tt(Lang.family_setAssist);// '设置协助';
        } else {
            this.LabTitle.string = i18n.tt(Lang.family_taskDetail);// 任务详情

            const taskText = this.model.CfgTaskName(this._familyTask.NameId).TaskText;
            this.LabDesc.string = taskText;
        }
    }

    // 底部列表 BeautyInfo[] | GeneralMsg[]
    private _curData: any[];
    private _initList() {
        let len;
        if (this._curToggleIdx === 0) { // 武将
            // const general = this.model.generalAllData;
            this._curData = ModelMgr.I.GeneralModel.getGeneralListByRaritySort(0);
        } else if (this._curToggleIdx === 1) { // 红颜
            this._curData = ModelMgr.I.BeautyModel.getSortActiveBeautys();
        } else { // 军师
            // 军师功能待完成
            // 待开发
            // 待开发
            // 待开发
            // 待开发
            len = 0;
            this._curData = [];
        }
        len = this._curData && this._curData.length ? this._curData.length : 0;
        this.list.setNumItems(len, 0);
    }

    // 底部公共列表
    private scrollEvent(node: cc.Node, index: number) {
        const item: FamilyHeadItem = node.getComponent(FamilyHeadItem);
        // 任务详情
        if (this._uiType === FamilyUIType.TaskDetail) {
            item.setData(this._curData[index], this._curToggleIdx, this._uiType);

            // 如下代码，可放入FamilyHeadItem处理，点击事件可分点击与长按操作 需要给ComHeadItem增加长按组件 后续如有需求再扩展
            const nodeEvent: cc.Node = node.getChildByName('NdEvent');
            nodeEvent.targetOff(this);
            UtilGame.Click(nodeEvent, () => {
                const eData: EntityData = this._curData[index];
                if (eData.inSender) {
                    MsgToastMgr.Show(i18n.tt(Lang.family_isSending));
                    return;
                }

                const onlyId: string = eData.StrId;// 唯一ID 武将 onlyId 红颜beautyId 别人的就是data.Id 详细查看 FamilyModel里 getAllGenerlData
                // 需要多少个是固定的
                const quality: number = this._familyTask.Quality;
                const needNum: number = this.model.getCfgNeedNumByQuality(quality);

                const isChecked: boolean = this.model.isCheckInHeadArr(onlyId); // 如果在头像列表 直接delete移除 setChecked = false;
                if (isChecked) {
                    this.model.deleteHeadItemById(onlyId);
                    item.comHeadItem.check = false;
                } else {
                    // 如果不在列表，判断当前是否达到上限n个
                    if (this.model.getgetHeadTempArrLen() >= needNum) {
                        MsgToastMgr.Show(i18n.tt(Lang.family_sendMaxLimit));// 协助伙伴已达上限
                        return;
                    } else {
                        const bol: boolean = this.model.hasOtherHeadArrHelper();
                        if (bol && !eData.self) {
                            MsgToastMgr.Show(i18n.tt(Lang.family_other));
                            return;
                        }
                        const set: SetPartner = {
                            Id: onlyId,
                            PartnerType: eData.PartnerType,
                        };
                        this.model.addHeadItemArr(set);
                    }
                    item.comHeadItem.check = true;// 选中
                }

                this._updateHeroPartner();
                this.updateCondition();
            }, this);
        } else {
            item.setData(this._curData[index], this._curToggleIdx, this._uiType);

            // 如下代码，可放入FamilyHeadItem处理，点击事件可分点击与长按操作 需要给ComHeadItem增加长按组件 后续如有需求再扩展
            const nodeEvent: cc.Node = node.getChildByName('NdEvent');
            nodeEvent.targetOff(this);
            UtilGame.Click(nodeEvent, () => {
                let onlyId: string = '';
                let HeroType: EntityUnitType = -1;// 英雄类型
                if (this._curToggleIdx === 0) { // 武将页签
                    const _data: GeneralMsg = this._curData[index];
                    onlyId = _data.generalData.OnlyId;
                    HeroType = EntityUnitType.General;
                } else if (this._curToggleIdx === 1) { // 红颜页签
                    const _data: BeautyInfo = this._curData[index];
                    onlyId = `${_data.BeautyId}`;
                    HeroType = EntityUnitType.Beauty;
                } else { // 军师
                    // 待开发
                    // onlyId = `${_data.junshiID}`;
                    // HeroType = EntityUnitType.Army;
                    // 待开发
                    // 待开发
                    // 待开发
                }

                const isChecked: boolean = this.model.isInHelpList(onlyId); // 如果在列表 直接delete移除 setChecked = false;
                if (isChecked) {
                    this.model.deleteHelpPartnerList(onlyId);
                    item.comHeadItem.check = false;
                } else { // 如果不在列表，判断当前是否达到上限3个
                    const helpPartnerList: SetPartner[] = this.model.getPartnerList();
                    if (helpPartnerList.length >= 3) {
                        MsgToastMgr.Show(i18n.tt(Lang.family_partnerMaxLimit));// 协助伙伴已达上限
                        return;
                    }
                    // 加入 选中 // 武将 军师 红颜类型
                    this.model.addHelpPartner(onlyId, HeroType);
                    item.comHeadItem.check = true;// 选中
                }

                this._initPartner();
            }, this);
        }
    }
}
