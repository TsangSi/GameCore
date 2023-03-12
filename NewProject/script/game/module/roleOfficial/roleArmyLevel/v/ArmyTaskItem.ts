import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { StateButton } from '../../../../com/btnGet/StateButton';
import { ItemWhere } from '../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import ItemModel from '../../../../com/item/ItemModel';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { Link } from '../../../link/Link';
import { RoleMgr } from '../../../role/RoleMgr';
import { ETaskStatus } from '../../../task/TaskConst';
import { TaskMgr } from '../../../task/TaskMgr';
import { TaskModel } from '../../../task/TaskModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArmyTaskItem extends cc.Component {
    @property(ItemIcon)
    public itemIcon: ItemIcon = null;

    @property(cc.Label)
    private lb1: cc.Label = null;
    @property(cc.Label)
    private lb2: cc.Label = null;
    @property(cc.Label)
    private lb3: cc.Label = null;

    @property(cc.Node)
    private BtnGet: cc.Node = null;

    protected start(): void {
        UtilGame.Click(this.BtnGet, this.onClick, this, { unRepeat: true, time: 800 });
    }

    public setState(state: number): void {
        this.BtnGet.getComponent(StateButton).setState(state);
        UtilRedDot.UpdateRed(this.node, state === ETaskStatus.Completed, cc.v2(125, -6));
    }

    public onClick(): void {
        if (this.BtnGet.getComponent(StateButton).state === ETaskStatus.Completed) {
            // 可领取 发送协议
            ControllerMgr.I.ArmyLevelController.reqC2SArmyReward(this._taskId);
        } else if (this.BtnGet.getComponent(StateButton).state === ETaskStatus.Processing) {
            // 任务奖励
            const taskCfg: Cfg_ArmyTask = ModelMgr.I.ArmyLevelModel.getTaskCfgByTaskId(Number(this._taskId));
            Link.To(taskCfg.FuncId);
        }
    }

    /** 设置图标 */
    private _taskId;
    public setData(taskId: number): void {
        this._taskId = taskId;
        // 任务奖励
        const taskCfg: Cfg_ArmyTask = ModelMgr.I.ArmyLevelModel.getTaskCfgByTaskId(Number(taskId));
        const rewardArr = taskCfg.Prize.split(':');
        const itemId = rewardArr[0];
        const itemNum = rewardArr[1];

        const itemModel: ItemModel = UtilItem.NewItemModel(Number(itemId), Number(itemNum));
        this.itemIcon.setData(itemModel, { where: ItemWhere.OTHER, needNum: true });
        //
        // 任务名称
        /** 目标 */
        const targetNum: number = Number(taskCfg.TargetCount);// 目标

        /** 当前 */

        const isMax = ModelMgr.I.ArmyLevelModel.isArmyLvMax(RoleMgr.I.getArmyLevel(), RoleMgr.I.getArmyStar());
        let curNum: number;
        let model: TaskModel;
        if (!isMax) {
            model = TaskMgr.I.getTaskModel(Number(taskId));
            if (model) {
                curNum = model.count;
            } else {
                cc.warn('GM指令使用导致异常');
            }
        } else {
            curNum = targetNum;
        }
        // }
        // console.log(`当前进度：${curNum}`);

        // RichText比较消耗性能

        // let strWithColor: string = '';
        // if (curNum >= targetNum) {
        //     // 任务达到
        //     strWithColor = `<color=${UtilColor.GreenV}>${curNum}/${targetNum}</c>`;
        // } else {
        //     // 任务未达到
        //     strWithColor = `<color=${UtilColor.RedV}>${curNum}/${targetNum}</c>`;
        // }

        // const str = TaskMgr.I.getFinallyName(taskCfg.Name, '{1}', strWithColor);
        // this.rtDesc.string = `<color=${UtilColor.NorV}> ${str}</c>`;

        // 富文本改为 label

        let progressColor;
        if (curNum >= targetNum) {
            // 任务达到
            progressColor = UtilColor.GreenV;
        } else {
            progressColor = UtilColor.RedV;
            // 任务未达到
        }

        let arr: string[] = [];
        this.lb1.node.color = UtilColor.Hex2Rgba(UtilColor.NorV);
        let targetCount: string = '';
        if (taskCfg.CountType === 2) {
            if (curNum >= targetNum) {
                targetCount = `(1/1)`;
            } else {
                targetCount = `(0/1)`;
            }
            arr = [TaskModel.GetTaskDesc(taskCfg), ''];
        } else {
            targetCount = `${curNum}/${targetNum}`;
            arr = TaskModel.GetTaskDesc(taskCfg, '{0}')?.split('{0}');
        }
        this.lb1.string = arr[0];
        this.lb2.string = targetCount;
        this.lb2.node.color = UtilColor.Hex2Rgba(progressColor);

        this.lb3.string = arr[1];
        this.lb3.node.color = UtilColor.Hex2Rgba(UtilColor.NorV);
        let statu: ETaskStatus;
        if (isMax) {
            statu = ETaskStatus.Awarded;
        } else {
            statu = ModelMgr.I.ArmyLevelModel.getTaskStatusByTaskId(Number(taskId));
        }
        // }
        this.setState(statu);
    }
}
