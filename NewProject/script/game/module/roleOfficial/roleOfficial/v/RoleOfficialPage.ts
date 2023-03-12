import { EventClient } from '../../../../../app/base/event/EventClient';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import ListView from '../../../../base/components/listview/ListView';
import UtilFunOpen from '../../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { FuncId } from '../../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';
import ModelMgr from '../../../../manager/ModelMgr';
import { RID } from '../../../reddot/RedDotConst';
import { TaskModel } from '../../../task/TaskModel';
import { RoleOfficialTaskItem } from './RoleOfficialTaskItem';

const { ccclass, property } = cc._decorator;
/** author ylj
 * 官职-官职功能
 */
@ccclass
export class RoleOfficialPage extends WinTabPage {
    @property(cc.Node)
    private BtnReward: cc.Node = null;
    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Node)
    private BtnGo: cc.Node = null;
    @property(cc.Node)
    private NdInfo: cc.Node = null;

    @property(ListView)
    private list: ListView = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnReward, this.rewardClick, this);
        // UtilGame.Click(this.BtnUp, this.upOfficial, this);
        UtilGame.Click(this.BtnGo, this.goSealAmulet, this);
        EventClient.I.on(E.RoleOfficial.OfficialTask, this.taskChange, this);
        ResMgr.I.showPrefab(UI_PATH_ENUM.RoleOfficialInfoView, this.NdInfo, (err, nd: cc.Node) => {
            //
        });

        UtilRedDot.Bind(RID.Role.RoleOfficial.Official.Reward.Id, this.BtnReward, cc.v2(30, 30));
        UtilRedDot.Bind(RID.Role.RoleOfficial.Official.SealAmulet.Id, this.BtnGo, cc.v2(30, 30));
    }

    /** 领取任务回调 */
    private taskChange(old: number, newId: number, index: number) {
        // const model = ModelMgr.I.RoleOfficeModel;
        // for (let i = 0; i < this.tasks.length; i++) {
        //     const element = this.tasks[i];
        //     if (element.conf.Id === old) {
        //         const conf = model.GetTaskInfo(newId);
        //         const data = TaskMgr.I.getTaskModel(newId);
        //         this.tasks[i] = { conf, data };
        //     }
        // }
        // this.list.updateAll();
        // 整体刷新
        this.tasks = ModelMgr.I.RoleOfficeModel.getCurrentTasks();
        this.list.setNumItems(this.tasks.length);
    }

    private tasks: { conf: Cfg_OfficialTask, data: TaskModel }[] = [];
    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        this.tasks = ModelMgr.I.RoleOfficeModel.getCurrentTasks();
        this.list.setNumItems(this.tasks.length);

        const msg1 = UtilFunOpen.isOpen(FuncId.OfficialSeal);
        const msg2 = UtilFunOpen.isOpen(FuncId.OfficialAmulet);
        if (!msg1 && !msg2) {
            this.BtnGo.active = false;
        } else {
            this.BtnGo.active = true;
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.RoleOfficial.OfficialTask, this.taskChange, this);
    }

    /** 打开奖励界面 */
    private rewardClick(): void {
        WinMgr.I.open(ViewConst.RoleOfficialRewardWin);
    }

    /** 前往官印虎符界面 */
    private goSealAmulet(): void {
        const { tab, index } = ModelMgr.I.SealAmuletModel.redTabIndex();
        WinMgr.I.open(ViewConst.SealAmuletWin, tab, index);
    }

    // /** 升级官职 */
    // private upOfficial(): void {
    //     ControllerMgr.I.RoleOfficialController.upOfficial();
    // }

    private scrollEvent(nd: cc.Node, index: number): void {
        const data = this.tasks[index];
        const item = nd.getComponent(RoleOfficialTaskItem);
        item.setData(data);
    }

    public updateUI(): void {
        // this.tasks = ModelMgr.I.RoleOfficeModel.getCurrentTasks();
        // this.list.setNumItems(this.tasks.length);
    }
}
