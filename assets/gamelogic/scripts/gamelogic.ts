import { _decorator, Component } from 'cc';
import MainManager from './main/MainManager';

const { ccclass } = _decorator;

/**
 * Predefined variables
 * Name = Game
 * DateTime = Thu Jan 06 2022 18:51:47 GMT+0800 (中国标准时间)
 * Author = knuth520
 * FileBasename = gamelogic.ts
 * FileBasenameNoExtension = game
 * URL = db://assets/gamelogic/scripts/game.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('gamelogic')
export class gamelogic extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    public startLoad(): void {
        MainManager.I.init();
    }
    // start () {
    // [3]
    // }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */
