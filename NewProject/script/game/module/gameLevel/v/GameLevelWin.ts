/*
 * @Author: myl
 * @Date: 2022-09-14 12:06:43
 * @Description:
 */
import { IWinTabData } from '../../../../app/core/mvc/WinConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import WinTabFrame from '../../../com/win/WinTabFrame';
import { TabBtnId } from '../../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { RID } from '../../reddot/RedDotConst';
import { GameLevelPageIdType } from '../GameLevelConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class GameLevelWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        return [
            {
                TabId: GameLevelPageIdType.Map,
                className: 'GameLevelPage',
                TabBtnId: TabBtnId.GameLevelPage,
                prefabPath: UI_PATH_ENUM.GameLevelPage,

                redId: RID.Stage.Main.Id,
                // redId: RID.MaterialFB.Material.Id,
            },
        ];
    }

    public initWin(...param: unknown[]): void {
        //
    }
}
