import { EventM } from '../../../../scripts/common/EventManager';
import { UI_NAME } from '../../../../scripts/ui/UIConfig';
import UIManager from '../../../../scripts/ui/UIManager';

export class BagManager {
    private static _I: BagManager = null;
    static get I (): BagManager {
        if (this._I == null) {
            this._I = new BagManager();
        }
        return this._I;
    }

    setData () {

    }
}
