/* eslint-disable @typescript-eslint/no-unsafe-return */
import { TabData } from '../../../com/tab/TabData';
import { WinTabPageView } from '../../../com/win/WinTabPageView';
import { RebornPageTabs } from '../GeneralConst';

/*
 * @Author: kexd
 * @Date: 2022-12-12 14:09:36
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gReborn\GRebornPage.ts
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;
@ccclass
export class GRebornPage extends WinTabPageView {
    public tabPages(): TabData[] {
        return RebornPageTabs;
    }
}
