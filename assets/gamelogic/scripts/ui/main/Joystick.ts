
import { _decorator, Component, Node, Vec2 } from 'cc';
import { EventM } from '../../../../scripts/core/event/EventM';
import SceneMapManager from '../../../../scripts/map/SceneMapManager';
import UtilsCC from '../../../../scripts/utils/UtilsCC';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Joystick
 * DateTime = Thu Mar 03 2022 14:59:44 GMT+0800 (中国标准时间)
 * Author = knuth520
 * FileBasename = Joystick.ts
 * FileBasenameNoExtension = Joystick
 * URL = db://assets/gamelogic/scripts/ui/main/Joystick.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('Joystick')
export class Joystick extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    @property(Node)
    Stick: Node;

    start() {
        // [3]
    }

    onLoad() {
        EventM.I.on(EventM.Type.Joystick.Show, this.onShow, this);
        EventM.I.on(EventM.Type.Joystick.Hide, this.onHide, this);
        EventM.I.on(EventM.Type.Joystick.UpdateDir, this.onUpdateDir, this);
        EventM.I.on(EventM.Type.Joystick.UpdatePos, this.onUpdatePos, this);
        this.node.active = false;
    }

    private onUpdateDir(dir: Vec2) {
        let pos = dir.multiplyScalar(20);
        UtilsCC.setPos(this.Stick, pos.x, pos.y);
    }

    private onUpdatePos(pos: Vec2) {
        UtilsCC.setPos(this.node, pos.x, pos.y);
    }

    private onShow() {
        this.node.active = true;
    }

    private onHide() {
        this.node.active = false;
    }

    protected onDestroy() {
        EventM.I.off(EventM.Type.Joystick.Show, this.onShow, this);
        EventM.I.off(EventM.Type.Joystick.Hide, this.onHide, this);
        EventM.I.off(EventM.Type.Joystick.UpdateDir, this.onUpdateDir, this);
        EventM.I.off(EventM.Type.Joystick.UpdatePos, this.onUpdatePos, this);
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
