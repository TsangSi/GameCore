/*
 * @Author: your name
 * @Date: 2020-03-02 10:45:31
 * @LastEditTime: 2020-05-25 17:06:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \RPG_Cocos\assets\script\s\com\ButtonStyle.ts
 */

import {
 Component, isValid, Node, _decorator,
} from 'cc';

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle funcs:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-funcs.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-funcs.html

const { ccclass, property } = _decorator;
@ccclass
export default class ButtonStyle extends Component {
    private myScalex = 1;
    private myScaley = 1;
    @property(Node)
    private nodeArr: Node[] = [];
    private target: any = undefined;
    private customData: any[] = [];
    private func: (...arg) => void = undefined;
    protected start(): void {
        // if (this.node == null) {
        //     this.node = this.node;
        // }
        this.myScalex = this.node.scale.x;
        this.myScaley = this.node.scale.y;
        this.setStyle();
    }

    /**
     * 设置按钮效果
     */
    private setStyle() {
        this.node.on(Node.EventType.TOUCH_START, () => {
            // event.stopPropagation();
            if (this.node.isValid) {
                this.node.setScale(this.myScalex * 0.9, this.myScaley * 0.9);
            }
            for (let i = 0; this.nodeArr && i < this.nodeArr.length; i++) {
                const node = this.nodeArr[i];
                if (isValid(node)) {
                    node.setScale(this.myScalex * 0.9, this.myScaley * 0.9);
                }
            }
        }, this);
        this.node.on(Node.EventType.TOUCH_END, () => {
            // event.stopPropagation();
            if (this.node.isValid) {
                this.node.setScale(this.myScalex, this.myScaley);
            }
            for (let i = 0; this.nodeArr && i < this.nodeArr.length; i++) {
                const node = this.nodeArr[i];
                if (isValid(node)) {
                    node.setScale(this.myScalex, this.myScaley);
                }
            }
            if (this.func) {
                this.func.apply(this.target, this.customData);
            }
        }, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, () => {
            // event.stopPropagation();
            if (this.node.isValid) {
                this.node.setScale(this.myScalex, this.myScaley);
            }
            for (let i = 0; this.nodeArr && i < this.nodeArr.length; i++) {
                const node = this.nodeArr[i];
                if (isValid(node)) {
                    node.setScale(this.myScalex, this.myScaley);
                }
            }
        }, this);
    }

    public setClickFunc(func: (...arg) => void, target: unknown, ...arg): void {
        this.target = target;
        this.func = func;
        this.customData = arg;
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START);
        this.node.off(Node.EventType.TOUCH_END);
    }
}
