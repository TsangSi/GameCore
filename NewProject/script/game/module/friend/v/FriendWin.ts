/*
 * @Author: myl
 * @Date: 2022-11-24 10:15:14
 * @Description:
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { TabBtnId } from '../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import { RID } from '../../reddot/RedDotConst';
import { FriendPageType } from '../FriendConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        return [
            {
                TabId: FriendPageType.Friend,
                prefabPath: UI_PATH_ENUM.FriendPage,
                className: 'FriendPage',
                redId: RID.More.Friend.Id,
                funcId: FuncId.Friend,
                // guideId: GuideBtnIds.GradeMount,
            },
        ];
    }
    public initWin(...param: unknown[]): void {
        // 如果功能未使用过 则请求使用
        if (!UtilFunOpen.GetFuncUsed(FuncId.Friend)) {
            ControllerMgr.I.GameController.useFunc(FuncId.Friend);
        }
    }
}
