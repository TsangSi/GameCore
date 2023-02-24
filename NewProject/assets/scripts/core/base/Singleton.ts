
export default function Singleton<T>() {
    class Singleton {
        private static _instance: any = null;
        public static get I(): T {
            if (this._instance) {
                return this._instance;
            }
            this._instance = new this();
            return this._instance;
        } 

        protected name: string = 'Singleton';

        public test() {
            console.log(this.name);
        }
    }
    return Singleton;
}