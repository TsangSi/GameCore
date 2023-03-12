/*
 * @Author: dcj
 * @Date: 2022-08-25 19:49:00
 * @FilePath: \SanGuo2.4\assets\script\game\module\worldBoss\v\WorldBossPage.ts
 * @Description:
 */

import { TabData } from '../../../com/tab/TabData';
import { WinTabPageView } from '../../../com/win/WinTabPageView';
import { WorldBossPageTabs } from '../../boss/BossConst';

const { ccclass, property } = cc._decorator;
@ccclass
export class WorldBossPage extends WinTabPageView {
    public tabPages(): TabData[] {
        return WorldBossPageTabs;
    }
}
