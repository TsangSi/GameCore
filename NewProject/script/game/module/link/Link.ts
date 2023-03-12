/*
 * @Author: zs
 * @Date: 2022-05-24 17:40:13
 * @Description:
 *
 */

import { UtilBool } from '../../../app/base/utils/UtilBool';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { FuncId } from '../../const/FuncConst';
import ControllerMgr from '../../manager/ControllerMgr';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { ViewConst } from '../../const/ViewConst';
import { ControllerIds } from '../../const/ControllerIds';

const { ccclass, property } = cc._decorator;
@ccclass
export class Link {
    public static To(funcId: number, ...args: any[]): boolean {
        if (funcId < ViewConst.ActivityWin) {
            const cfgFunc: Cfg_Client_Func = UtilFunOpen.getFuncCfg(funcId);
            if (!cfgFunc) {
                console.log('Link.to,funcId, args=', funcId, args);
                return false;
            }
            /** 限制条件配置 */
            if (!UtilFunOpen.isOpen(funcId, true)) {
                return false;
            }

            console.log('Link.to,funcId, UI=', funcId, cfgFunc.UI, args, cfgFunc);
            switch (funcId) {
                case FuncId.CloseAll:
                    WinMgr.I.closeAll();
                    return true;
                case FuncId.MsgToast:
                case FuncId.MsgBox:
                    MsgToastMgr.ShowMsg(cfgFunc.Tab, cfgFunc.Param1);
                    return true;
                default:
                    return this.otherHandler(cfgFunc, ...args);
            }
        } else {
            return ControllerMgr.I.linkOpen(ControllerIds.ActivityController, funcId, ...args);
        }
    }

    private static otherHandler(cfgFunc: Cfg_Client_Func, ...args: any[]): boolean {
        const funcArgs = [];
        // funcArgs.push(cfgFunc.Tab);
        /** 有配参数 或者 参数是0 */
        if (!UtilBool.isNullOrUndefined(cfgFunc.Param1)) {
            funcArgs.push(cfgFunc.Param1);
        }
        if (!UtilBool.isNullOrUndefined(cfgFunc.Param2)) {
            funcArgs.push(cfgFunc.Param2);
        }
        if (!UtilBool.isNullOrUndefined(cfgFunc.Param3)) {
            funcArgs.push(cfgFunc.Param3);
        }
        if (!UtilBool.isNullOrUndefined(cfgFunc.Param4)) {
            funcArgs.push(cfgFunc.Param4);
        }

        // funcArgs.push(cfgFunc.Param2);
        // funcArgs.push(cfgFunc.Param3);
        // funcArgs.push(cfgFunc.Param4);
        // funcArgs = funcArgs.concat(args);
        return ControllerMgr.I.linkOpen(cfgFunc.UI, cfgFunc.Tab, funcArgs, ...args);
    }
}
