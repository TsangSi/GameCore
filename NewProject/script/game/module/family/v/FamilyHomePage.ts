import { EventClient } from '../../../../app/base/event/EventClient';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import EntityMapMgr from '../../../entity/EntityMapMgr';
import { EntityRole } from '../../../entity/EntityRole';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RID } from '../../reddot/RedDotConst';
import { FamilyPageType } from '../FamilyConst';
import FamilyModel from '../FamilyModel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FamilyHomePage extends BaseUiView {
    @property(cc.Node)// 打开世家
    private NdOpenFamily: cc.Node = null;

    @property(cc.Node)// 打开膜拜
    private BtnMb: cc.Node = null;

    @property(cc.Node)
    private NdAni: cc.Node = null;
    @property(cc.Node)
    private NdTitle: cc.Node = null;

    private _role: EntityRole = null;
    protected onEnable(): void {
        if (this._role) {
            this._role.resume();
        }
    }

    public start(): void {
        super.start();
        UtilRedDot.Bind(RID.Family.FamilyHome.Id, this.NdOpenFamily, cc.v2(150, 66));
        UtilGame.Click(this.NdOpenFamily, () => WinMgr.I.open(ViewConst.FamilyWin), this, { scale: 1 });// 打开世家
        UtilGame.Click(this.BtnMb, () => WinMgr.I.open(ViewConst.FamilyWin, FamilyPageType.FamilyMemberPage), this);// 打开成员
        this._onFamilyHomeHeroData();// 进入战斗后，页面模型被销毁。重新打开当前页面,重新生成角色动画
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Family.FamilyRoleInfo, this._onFamilyRoleInfo, this);
        EventClient.I.off(E.Family.FamilyHomeHeroData, this._onFamilyHomeHeroData, this);
        EventClient.I.off(E.Family.FamilyWorship, this._onFamilyWarShip, this);
        // EventClient.I.emit(E.MainCity.Close, FromPage.FamilyHome);
    }

    private model: FamilyModel;
    public init(winId: number, param: unknown[], tabIdx: number, tabId?: number): void {
        super.init(winId, param, 0);
        this.BtnMb.active = false;// 先隐藏
        if (!this.model) { this.model = ModelMgr.I.FamilyModel; }

        // 这里后端搞两条协议
        EventClient.I.on(E.Family.FamilyHomeHeroData, this._onFamilyHomeHeroData, this);// 监听模型数据
        EventClient.I.on(E.Family.FamilyRoleInfo, this._onFamilyRoleInfo, this);// 监听职位信息膜拜与否情况

        ControllerMgr.I.FamilyController.reqC2SFamilyTopPlayerData();
        ControllerMgr.I.FamilyController.reqC2SFamilyRoleInfo();

        // ControllerMgr.I.FamilyController.reqC2SFamilyPatriInfo(); // 请求争权基础信息
        // 膜拜成功
        EventClient.I.on(E.Family.FamilyWorship, this._onFamilyWarShip, this);
    }

    private _onFamilyWarShip(): void {
        this.BtnMb.active = false;
    }

    /** 玩家基础信息 */
    private _onFamilyRoleInfo(): void {
        this._initMbBtnState();
    }

    /** 膜拜按钮的状态 */
    private _initMbBtnState(): void {
        const modelData: S2CFamilyTopPlayerData = this.model.getModelData();
        if (modelData?.UserShowInfo?.length) {
            const familyRoleInfo: S2CFamilyRoleInfo = this.model.getFamilyRoleInfo();
            const ws: number = familyRoleInfo.Worship;// 是否已经膜拜过
            this.BtnMb.active = !ws;
        } else {
            this.BtnMb.active = false;
        }
    }

    /** 显示模型信息 */
    private _onFamilyHomeHeroData(): void {
        this.NdTitle.active = false;
        const modelData: S2CFamilyTopPlayerData = ModelMgr.I.FamilyModel.getModelData();
        // 有族长才有模型信息
        if (modelData) {
            const modelInfo: BaseUserInfo[] = modelData.UserShowInfo;
            if (modelInfo && modelInfo.length) {
                this.NdAni.destroyAllChildren();
                this.NdAni.removeAllChildren();
                this.NdTitle.active = true;
                this._role = EntityMapMgr.I.createRole(modelInfo[0], 0, false, true);
                this.NdAni.addChild(this._role);
            }
        }
    }

    public refreshPage(winId: number, params: any[]): void {
        //
    }
}
