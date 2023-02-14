import { ServerMonitor } from "../../../../scripts/common/ServerMonitor";
import { BagItemManager } from "./BagItemManger";

export class BagN {
    private static instance: BagN = null;
    public static get I(): BagN {
        if (!this.instance) {
            this.instance = new BagN();
        }
        return this.instance;
    }

    public init() {
        ServerMonitor.I.proxyOn(ProtoId.S2CUserBag_ID, this.onUserBag, this);
        ServerMonitor.I.proxyOn(ProtoId.S2CBagChange_ID, this.onBagChange, this);
    }

    private fini() {
        ServerMonitor.I.proxyOff(ProtoId.S2CUserBag_ID, this.onUserBag, this);
        ServerMonitor.I.proxyOff(ProtoId.S2CBagChange_ID, this.onBagChange, this);
    }

    onUserBag(d: S2CUserBag) {
        BagItemManager.I.setItems(d.Bag, d.Init, d.End);
    }

    onBagChange(d: S2CBagChange) {
        BagItemManager.I.setBagChange(d.Change);
    }
}
