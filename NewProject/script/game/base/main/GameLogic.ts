import SceneMap from '../../map/SceneMap';
import TaskQueue from '../TaskQueue';
import PerformanceMgr from '../../manager/PerformanceMgr';
/*
 * @Author: kexd
 * @Date: 2022-05-16 20:42:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-06-16 16:57:32
 * @FilePath: \SanGuo\assets\script\game\base\main\GameLogic.ts
 * @Description:
 *
 */
export default class GameLogic {
    private static _i: GameLogic = null;
    public static get I(): GameLogic {
        if (this._i == null) {
            this._i = new GameLogic();
        }
        return this._i;
    }

    /** 游戏主循环 */
    public mainUpdate(dt:number):void {
        if (SceneMap && SceneMap.I) {
            SceneMap.I.mainUpdate(dt);
        }

        TaskQueue.I.mainUpdate(dt);
        PerformanceMgr.I.mainUpdate(dt);
    }
}
