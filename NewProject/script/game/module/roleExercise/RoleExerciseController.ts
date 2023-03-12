import { EventClient } from '../../../app/base/event/EventClient';
import { EventProto } from '../../../app/base/event/EventProto';
import BaseController from '../../../app/core/mvc/controller/BaseController';
import WinMgr from '../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import { ERoleSkinPageIndex } from '../roleskin/v/RoleSkinConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleExerciseController extends BaseController {
    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param id 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: ERoleSkinPageIndex, params?: any[], id?: number): boolean {
        if (UtilFunOpen.isOpen(FuncId.RoleExercise, true)) {
            console.log(1);
            WinMgr.I.open(ViewConst.RoleExerciseWin, tab, id);
        }
        return true;
    }

    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CExerciseInfo_ID, this.onInfo, this);
        EventProto.I.on(ProtoId.S2CExercise_ID, this.onExercise, this);
    }

    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CExerciseInfo_ID, this.onInfo, this);
        EventProto.I.off(ProtoId.S2CExercise_ID, this.onExercise, this);
    }

    /** 请求信息 */
    public reqInfo(): void {
        const req: C2SExerciseInfo = new C2SExerciseInfo();
        NetMgr.I.sendMessage(ProtoId.C2SExerciseInfo_ID, req);
    }

    /** 请求炼体 */
    public reqExercise(type: number): void {
        const req: C2SExercise = new C2SExercise();
        req.Type = type;
        NetMgr.I.sendMessage(ProtoId.C2SExercise_ID, req);
    }

    private onInfo(info: S2CExerciseInfo) {
        ModelMgr.I.RoleExerciseModel.setLevelData(info.ExerciseList);
        EventClient.I.emit(E.Exercise.syncUi);
    }

    private onExercise(data: S2CExercise) {
        if (data.ExerciseList.length === 0) return;
        ModelMgr.I.RoleExerciseModel.setLevelData(data.ExerciseList);
        EventClient.I.emit(E.Exercise.syncUi);
    }

    public addClientEvent(): void {
        //
    }
    public delClientEvent(): void {
        //
    }
    public clearAll(): void {
        //
    }
}
