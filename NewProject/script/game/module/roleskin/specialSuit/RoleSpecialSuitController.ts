/*
 * @Author: myl
 * @Date: 2022-12-26 12:07:57
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { EventProto } from '../../../../app/base/event/EventProto';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import NetMgr from '../../../manager/NetMgr';
import { RoleSkinController } from '../RoleSkinController';
import { ERoleSkinPageIndex } from '../v/RoleSkinConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleSpecialSuitController extends RoleSkinController {
    /**
     * 打开界面
     * @param tab 页签id
     * @param params 配置表的参数列表
     * @param id 可变参，手动传入的参数
     * @returns
     */
    public linkOpen(tab?: ERoleSkinPageIndex, params?: any[], id?: number): boolean {
        if (UtilFunOpen.isOpen(FuncId.SkinSpecialSuit, true)) {
            WinMgr.I.open(ViewConst.RoleSpecialSuitWin, tab, id);
        }
        return true;
    }

    /** 网络监听 */
    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CSuitGradeUp_ID, this.onS2CSuitGradeUp, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CSuitGradeUp_ID, this.onS2CSuitGradeUp, this);
    }

    /**
     * 华服升阶（需要所有部位全部达到才能升阶）
     * @param id 华服套装id
     */
    public C2SSuitGradeUp(id: number): void {
        const d: C2SSuitGradeUp = {
            Id: id,
        };
        NetMgr.I.sendMessage(ProtoId.C2SSuitGradeUp_ID, d);
    }

    /** 角色华服套装的升阶返回 */
    private onS2CSuitGradeUp(data: S2CSuitGradeUp): void {
        if (data && data.Tag === 0) {
            ModelMgr.I.RoleSkinModel.setSpecialGrade(data.Id, data.GradeLevel);
            // EventClient.I.emit(E.RoleSkin.SpecialGradeSuccess, data);
        }
    }
}
