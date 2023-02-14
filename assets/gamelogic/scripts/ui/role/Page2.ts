import { _decorator, Component, Node } from 'cc';
import { BaseView } from '../../../../scripts/ui/base/BaseView';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Page2
 * DateTime = Thu Sep 23 2021 18:31:00 GMT+0800 (中国标准时间)
 * Author = knuth520
 * FileBasename = Page2.ts
 * FileBasenameNoExtension = Page2
 * URL = db://assets/gamelogic/scripts/ui/role/Page2.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Page2')
export class Page2 extends BaseView {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    onLoad () {
    }

    start () {
        // [3]
    }

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
