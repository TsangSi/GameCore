/*
 * @Author: myl
 * @Date: 2022-09-30 17:19:07
 * @Description:
 */
import WinBase from '../../../com/win/WinBase';

const { ccclass, property } = cc._decorator;

@ccclass
export class GameLevelNewChapterView extends WinBase {
    protected start(): void {
        super.start();
        this.scheduleOnce(() => {
            this.close();
        }, 3);
    }
}
