/*
 * @Author: myl
 * @Date: 2023-02-22 15:14:41
 * @Description:
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { FuncId } from '../../../const/FuncConst';
import { TabBtnId } from '../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { HeadPhotoType } from '../../head/HeadConst';
import { RID } from '../../reddot/RedDotConst';

const { ccclass } = cc._decorator;

@ccclass
export default class SettingWin extends WinTabFrame {
    /** 获取窗口页签数据 */
    public getTabData(): IWinTabData[] {
        // 配置页签数据
        const tabDataArr: IWinTabData[] = [
            {
                TabId: 0,
                className: 'SettingPage',
                TabBtnId: TabBtnId.SettingPage,
                prefabPath: UI_PATH_ENUM.SettingPage,
            },
            {
                TabId: HeadPhotoType.Head,
                className: 'HeadPage',
                prefabPath: UI_PATH_ENUM.HeadPage,
                // TabBtnId: TabBtnId.Head,
                redId: RID.Setting.Head,
                funcId: FuncId.Head,
            },
            {
                TabId: HeadPhotoType.headFrame,
                className: 'HeadPage',
                prefabPath: UI_PATH_ENUM.HeadPage,
                // TabBtnId: TabBtnId.HeadFrame,
                redId: RID.Setting.HeadFrame,
                funcId: FuncId.HeadFrame,
            },
            {
                TabId: HeadPhotoType.chatBubble,
                className: 'HeadPage',
                prefabPath: UI_PATH_ENUM.HeadPage,
                // TabBtnId: TabBtnId.Bubble,
                redId: RID.Setting.ChatBubble,
                funcId: FuncId.ChatBubble,
            },
        ];
        return tabDataArr;
    }

    public initWin(param: unknown[]): void {
        //
    }
}
