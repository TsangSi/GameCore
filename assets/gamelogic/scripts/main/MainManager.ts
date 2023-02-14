import { EventM } from "../../../scripts/core/event/EventManager";
import { BagN } from "../ui/bag/BagN";

export default class MainManager {
    private static _I: MainManager = null;
    static get I(): MainManager {
        if (this._I == null) {
            this._I = new MainManager();
        }
        return this._I;
    }

    public init() {
        EventM.I.once(EventM.Type.Config.InitConfigComplete, this.onInitConfigComplete, this);
    }

    private onInitConfigComplete() {
        BagN.I.init();
    }
}
