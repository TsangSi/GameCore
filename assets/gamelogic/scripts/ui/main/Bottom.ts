import {
 _decorator, Component, AnimationClip, dynamicAtlasManager, Node, UITransform, Sprite, SpriteFrame, find, director,
} from 'cc';
import { ACTION_STATUS_TYPE } from '../../../../scripts/action/ActionConfig';
import { EffectManager } from '../../../../scripts/common/EffectManager';
import { EventM } from '../../../../scripts/core/event/EventM';
import EntityManager from '../../../../scripts/map/EntityManager';
import MsgToast from '../../../../scripts/ui/Toast/MsgToast';
import { UI_NAME } from '../../../../scripts/ui/UIConfig';
import UIManager from '../../../../scripts/ui/UIManager';
import UtilsCC from '../../../../scripts/utils/UtilsCC';

const { ccclass } = _decorator;

/**
 * Predefined variables
 * Name = Bottom
 * DateTime = Tue Mar 22 2022 17:37:47 GMT+0800 (中国标准时间)
 * Author = knuth520
 * FileBasename = Bottom.ts
 * FileBasenameNoExtension = Bottom
 * URL = db://assets/gamelogic/scripts/ui/main/Bottom.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('Bottom')
export class Bottom extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    protected start(): void {
        // [3]
        EffectManager.I.showEffect(`e/main/bottom/ui_${6566}`, UtilsCC.getNode('city/ani', this.node), AnimationClip.WrapMode.Loop);
        UtilsCC.setClickFunc('city', this.node, this.onCityClicked, this);
        UtilsCC.setClickFunc('wujiang', this.node, this.onWuJiangClicked, this);
        UtilsCC.setClickFunc('test', this.node, this.onTestClicked, this);
        UtilsCC.setClickFunc('test2', this.node, this.onTest2Clicked, this);
        UtilsCC.setClickFunc('test3', this.node, this.onTest3Clicked, this);
    }

    private onCityClicked() {
        // MsgToast.Show('定位到主城');
        // // x = 7800, y = 6900
        // EventM.I.fire(EventM.Type.SceneMap.MoveToPos, 7800, 6900);
        // const entitys = EntityManager.I.getEntities();
        // for (const handle in entitys) {
        //     entitys[handle].status = ACTION_STATUS_TYPE.Stand;
        // }
    }

    private onWuJiangClicked() {
        // MsgToast.Show('显示武将列表');
        // const entity = EntityManager.I.getEntityByHandle(10001);
        // entity.status = ACTION_STATUS_TYPE.Run;

        const entitys = EntityManager.I.getEntities();
        for (const handle in entitys) {
            // entitys[handle].status = ACTION_STATUS_TYPE.Run;
            EntityManager.I.destoryEntity(Number(handle));
        }
        UIManager.I.close(UI_NAME.Bottom);
        UIManager.I.close(UI_NAME.Test);
        BuildManager.I.destroyBuild(100001);
        // EntityManager.I.destoryEntity(10001);
    }

    private shoTest = false;
    private onTestClicked() {
        if (this.shoTest) {
            UIManager.I.close(UI_NAME.Test);
            this.shoTest = false;
        } else {
            UIManager.I.show(UI_NAME.Test);
            this.shoTest = true;
        }
    }
    private shoTest2 = false;
    private onTest2Clicked() {
        if (this.shoTest2) {
            UIManager.I.close(UI_NAME.Test2);
            this.shoTest2 = false;
        } else {
            UIManager.I.show(UI_NAME.Test2);
            this.shoTest2 = true;
        }
    }
    private shoTest3 = false;
    private onTest3Clicked() {
        if (this.shoTest3) {
            UIManager.I.close(UI_NAME.Test3);
            this.shoTest3 = false;
        } else {
            UIManager.I.show(UI_NAME.Test3);
            this.shoTest3 = true;
        }
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
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
