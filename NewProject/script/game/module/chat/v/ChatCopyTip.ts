/*
 * @Author: myl
 * @Date: 2022-08-10 20:30:36
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCopy } from '../../../../app/base/utils/UtilCopy';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChatCopyTip extends cc.Component {
    @property(cc.Node)
    private btnCopy: cc.Node = null;
    protected start(): void {
        // [3]
        UtilGame.Click(this.btnCopy, () => {
            UtilCopy.CopyTextEvent(this._copyStr);
            this.node.destroy();
        }, this);

        UtilGame.Click(this.node, () => {
            UtilCopy.CopyTextEvent(this._copyStr);
        }, this, { scale: 1 });

        EventClient.I.on(E.Chat.RemoveCopyBtn, this.removeSelf, this);
    }
    private removeSelf() {
        this.node.destroy();
    }

    private _copyStr = '';
    public setConfig(cpStr: string): void {
        this._copyStr = cpStr;
        // this.btnCopy.setPosition(pos);
    }

    protected onDestroy(): void {
        this._copyStr = '';
        EventClient.I.off(E.Chat.RemoveCopyBtn, this.removeSelf, this);
    }
}
