/*
 * @Author: lijun
 * @Date: 2023-02-25 17:44:12
 * @Description:
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuarongdaoCountDown extends BaseCmp {
    @property([cc.Node])
    private NdArray: cc.Node[] = [];

    private _index: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // protected start(): void {
    //     super.start();
    // }

    protected onEnable(): void {
        super.onEnable();
        this.NdArray.forEach((item) => {
            item.active = false;
        });
        this._index = 0;
        this.NdArray[0].active = true;
        this.time = 0;
    }

    private time = 0;
    protected update(dt: number): void {
        this.time += dt;
        if (this.time >= 1) {
            this.time = 0;
            if (this._index >= this.NdArray.length - 1) {
                return;
            }
            this.NdArray[this._index].active = false;
            this._index++;
            this.NdArray[this._index].active = true;
        }
    }
}
