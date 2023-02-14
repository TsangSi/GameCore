import { _decorator, Component, Node, Label, Sprite } from 'cc';
import UtilsCC from '../../utils/UtilsCC';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PanelTitle
 * DateTime = Sun Sep 26 2021 22:04:01 GMT+0800 (中国标准时间)
 * Author = knuth520
 * FileBasename = PanelTitle.ts
 * FileBasenameNoExtension = PanelTitle
 * URL = db://assets/gamelogic/prefabs/ui/base/PanelTitle.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('PanelTitle')
export class PanelTitle extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property(Label)
    titleLabel: Label = undefined;
    // 背景宽度变换时的标题字数上限
    maxLength = 4;
    // 每个字需要增加的宽度
    addWidth = 40;

    start () {
        // [3]
    }

    setString (title: string) {
        // this.title = title;

        if (title.length > this.maxLength) {
            let width = UtilsCC.getWidth(this.node);
            width += (title.length - this.maxLength) * this.addWidth;
            // const bgNode = this.titleBg.node.parent;
            // if (bgNode) {
            //     const bg_width = UtilsCC.getWidth(bgNode);
            //     if (width > bg_width) {
            //         width = bg_width - this.addWidth * 2;
            //     }
            // }
            UtilsCC.setWidth(this.node, width);
        }
        this.titleLabel.string = title;
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
