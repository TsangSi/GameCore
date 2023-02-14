import { Animation, AnimationClip, CCBoolean, Component, _decorator } from 'cc';
import List from '../../../../scripts/component/List';
import { BaseView } from '../../../../scripts/ui/base/BaseView';
// import PhotoBookIndexer from '../../../../scripts/config/indexer/PhotoBookIndexer';
// import UtilsCC from '../../../../scripts/utils/UtilsCC';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Page1
 * DateTime = Thu Sep 23 2021 18:31:00 GMT+0800 (中国标准时间)
 * Author = knuth520
 * FileBasename = Page1.ts
 * FileBasenameNoExtension = Page1
 * URL = db://assets/gamelogic/scripts/ui/role/Page1.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Page1')
export class Page1 extends BaseView {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    onLoad() {
        // UtilsCC.setClickEvent('Sprite', this.node, 'on_del_clicked', this);
    }

    start() {
        this.node.getChildByName('ScrollView').getComponent(List).numItems = 100;
    }

    on_del_clicked() {
        // const Class = 2;
        // const Type = 13;
        // const indexs = PhotoBookIndexer.I.getDatasByClassType(Class, Type);
        // for (let i = 0, n = indexs.length; i < n; i++) {
        //     const data = PhotoBookIndexer.I.getDataByIndex(indexs[i]);
        //     console.log('data.Attr=', data.Attr);
        // }
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
