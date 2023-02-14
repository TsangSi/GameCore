/* eslint-disable @typescript-eslint/no-unused-expressions */
import { PlayerN } from '../action/PlayerN';
import { EventM } from '../core/event/EventM';
import { SceneN } from '../map/SceneN';

export class RegNetPack {
    private static _I: RegNetPack = null;
    static get I(): RegNetPack {
        if (this._I == null) {
            this._I = new RegNetPack();
        }
        return this._I;
    }

    init() {
        EventM.I.once(EventM.Type.Config.InitConfigComplete, this.onInitConfigComplete, this);
    }

    onInitConfigComplete() {
        SceneN.I.init();
        PlayerN.I.init();
        // BagN.I;
    }
}
