import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import EntityMapMgr from '../../../entity/EntityMapMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleInfo } from '../../role/RoleInfo';
import { RoleMgr } from '../../role/RoleMgr';
import FamilyModel from '../FamilyModel';
import { FamilyMemberItem } from './FamilyMemberItem';

const { ccclass, property } = cc._decorator;
/** 世家-成员 */
@ccclass
export default class FamilyMemberPage extends WinTabPage {
    // 成员列表
    @property(ListView)
    private list: ListView = null;
    // 成员数量
    @property(cc.Label)
    private LabMemberNum: cc.Label = null;

    @property(cc.Label)// 累计掌权届
    private LabJie: cc.Label = null;
    @property(cc.Label)// 昵称
    private LabName: cc.Label = null;
    @property(cc.Label)// 累计掌权xx天
    private LabDays: cc.Label = null;
    @property(cc.Label)// vip等级
    private LabVip: cc.Label = null;
    @property(cc.Label)// 离线时间
    private LabOffline: cc.Label = null;

    @property(cc.Node)// 离线节点
    private NdOffLine: cc.Node = null;

    @property(cc.Node)// 膜拜按钮
    private BtnMb: cc.Node = null;
    @property(cc.Node)// 特权按钮
    private BtnSpecialPower: cc.Node = null;

    // 二期增加了族长信息
    @property(cc.Node)// 连任届数等
    private NdDays: cc.Node = null;
    @property(cc.Node)// 标题昵称
    private NdTitle: cc.Node = null;
    @property(cc.Node)// 在线
    private NdOnline: cc.Node = null;
    @property(cc.Node)// vip
    private NdVip: cc.Node = null;
    @property(cc.Node)// 空
    private NdEmpty: cc.Node = null;

    @property(cc.Node)// 角色模型
    private NdAni: cc.Node = null;

    private _initChifInfo(): void {
        const modelData: S2CFamilyTopPlayerData = ModelMgr.I.FamilyModel.getModelData();
        // 有族长才有模型信息
        if (modelData && modelData.UserShowInfo && modelData.UserShowInfo[0]) {
            const roleInfo = new RoleInfo(modelData.UserShowInfo[0]);

            this.NdDays.active = true;
            this.LabJie.string = `${modelData.TermNum}${i18n.tt(Lang.family_ren)}`;

            if (modelData.TermTime) {
                const day = UtilTime.disTanceToday(modelData.TermTime);
                this.LabDays.string = `${day}${i18n.tt(Lang.com_day)}`;// 天
            } else {
                this.LabDays.string = `${0}${i18n.tt(Lang.com_day)}`;// 天
            }

            // 在线离线状态
            if (roleInfo.d.IsOnline) {
                this.NdOnline.active = true;
                this.NdOffLine.active = false;
            } else {
                this.NdOnline.active = false;
                this.NdOffLine.active = true;
                const logOut: number = roleInfo.d.LogoutTime;
                const deltTime: number = UtilTime.NowSec() - logOut;
                if (deltTime) {
                    const str: string = UtilTime.TimeLimit(deltTime);
                    this.LabOffline.string = `${str}${i18n.tt(Lang.family_qian)}`;// UtilTime.FormatHourDetail(deltTime);
                } else {
                    this.LabOffline.string = '00:00:00';
                }
            }

            // vip
            this.NdVip.active = true;
            this.LabVip.string = ModelMgr.I.VipModel.getVipName(roleInfo.d.VipLevel);

            this.NdTitle.active = true;// 标题

            this.LabName.string = `S${RoleMgr.I.d.ShowAreaId}.${roleInfo.d.Nick}`;
            this.NdEmpty.active = false;

            // 模型
            const modelInfo: BaseUserInfo[] = modelData.UserShowInfo;
            const role = EntityMapMgr.I.createRole(modelInfo[0], 0, false, true, true);
            this.NdAni.addChild(role);
        } else {
            this.NdDays.active = false;
            this.NdOnline.active = false;
            this.NdOffLine.active = false;
            this.NdVip.active = false;
            this.NdTitle.active = false;
            this.NdEmpty.active = true;
        }
    }

    public start(): void {
        super.start();
        UtilGame.Click(this.BtnMb, this._onMoBai, this);// 膜拜
        UtilGame.Click(this.BtnSpecialPower, this._onBtnSpecialPower, this);// 特权弹窗
        EventClient.I.on(E.Family.FamilyWorship, this._onFamilyWorShip, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Family.FamilyMemberList, this._onMemberList, this);
        EventClient.I.off(E.Family.FamilyWorship, this._onFamilyWorShip, this);
    }

    /** 只要未膜拜过， 膜拜 */
    private _onMoBai(): void {
        ControllerMgr.I.FamilyController.reqC2SFamilyWorship();
    }
    // 膜拜返回
    private _onFamilyWorShip(): void {
        this._initMbBtnState();
    }

    /* *初始膜拜按钮状态 */
    private _initMbBtnState(): void {
        const modelData: S2CFamilyTopPlayerData = ModelMgr.I.FamilyModel.getModelData();
        if (modelData?.UserShowInfo?.length) {
            const familyRoleInfo: S2CFamilyRoleInfo = ModelMgr.I.FamilyModel.getFamilyRoleInfo();
            this.BtnMb.active = !familyRoleInfo.Worship;
        } else {
            this.BtnMb.active = false;
        }
    }

    /** 特权 */
    private _onBtnSpecialPower(): void {
        WinMgr.I.open(ViewConst.FamilyPowerTip);
    }

    // 成员列表
    private _memList: FamilyMember[] = [];
    private model: FamilyModel;
    public init(winId: number, param: unknown[], tabIdx: number, tabId?: number): void {
        super.init(winId, param, 0);
        this.model = ModelMgr.I.FamilyModel;
        ControllerMgr.I.FamilyController.reqC2SFamilyTopPlayerData();
        ControllerMgr.I.FamilyController.reqC2SFamilyInfo();// 需要请求到成员在线数量 总共在线人数

        EventClient.I.on(E.Family.FamilyMemberList, this._onMemberList, this);
        ControllerMgr.I.FamilyController.reqC2SFamilyMemberList(0, 50);

        this._initMbBtnState();
        this._initChifInfo();
    }

    /** 更新成员列表 */
    private _onMemberList(data: S2CFamilyMemberList): void {
        this._memList = this.model.getMemberList();
        const len = this._memList && this._memList.length || 0;
        this.list.setNumItems(len, 0);
        this.list.scrollTo(0);
        // const onLineNum: number = this.model.getOnlineMember();
        // // 成员在线个数
        // this.LabMemberNum.string = `${onLineNum}/${len}`;

        const onLineNum: number = this.model.getOnlineMember();
        const onAllNum: number = this.model.getAllNum();
        // 成员在线个数
        this.LabMemberNum.string = `${onLineNum}/${onAllNum}`;
    }

    public refreshPage(winId: number, params: any[]): void {
        ControllerMgr.I.FamilyController.reqC2SFamilyTopPlayerData();
    }

    // 列表
    private scrollEvent(node: cc.Node, index: number) {
        const item: FamilyMemberItem = node.getComponent(FamilyMemberItem);
        item.setData(this._memList[index]);
    }
}
