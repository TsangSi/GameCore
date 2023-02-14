export default class PlayerManager {
    private static _I: PlayerManager = null;
    static get I(): PlayerManager {
        if (this._I == null) {
            this._I = new PlayerManager();
        }
        return this._I;
    }
}
