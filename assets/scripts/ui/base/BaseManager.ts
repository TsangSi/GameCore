export class BaseManager {
    private static _instance;
    static get I () {
        if (!(<any>this)._instance) {
            (<any> this)._instance = new this();
        }
        return (<any> this)._instance;
    }
}
