/*
 * @Author: kexd
 * @Date: 2022-03-30 13:56:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-19 11:34:14
 * @FilePath: \SanGuo\assets\script\game\base\mapBase\EditorElement\EditorNPC.ts
 * @Description:
 *
 */
import {
    ACTION_DIRECT, ANIM_TYPE, ACTION_TYPE,
} from '../../anim/AnimCfg';
import AnimCom from '../../anim/AnimCom';

import EditorElement from './EditorElement';

const { ccclass } = cc._decorator;

@ccclass
export default class EditorNPC extends EditorElement {
    public _npc: AnimCom;

    public get className(): string {
        return 'EditorNPC';
    }

    public init(resID: number | string, resType: ANIM_TYPE = ANIM_TYPE.PET): void {
        this._npc = new AnimCom({
            resId: resID,
            resType,
        });

        this._npc.playAction(ACTION_TYPE.STAND, ACTION_DIRECT.RIGHT_DOWN);

        this.node.addChild(this._npc);
    }
}
