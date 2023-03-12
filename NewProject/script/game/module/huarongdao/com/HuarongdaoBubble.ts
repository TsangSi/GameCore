/*
 * @Author: lijun
 * @Date: 2023-02-24 22:37:21
 * @Description:
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { i18n } from '../../../../i18n/i18n';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuarongdaoBubble extends cc.Component {
    @property(cc.Label)
    private LblContent: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start() {

    // }

    /**
     * 显示气泡
     * @param id 气泡id
     */
    public setBubbleId(id: number): void {
        const cfg = ModelMgr.I.HuarongdaoModel.getBubbleByKey(id);
        if (cfg) {
            this.LblContent.string = i18n.tt(cfg.Desc);
            this.node.active = true;
            this.unscheduleAllCallbacks();
            this.scheduleOnce(() => {
                this.node.active = false;
            }, 2);
        } else {
            this.node.active = false;
        }
    }

    // update (dt) {}
}
