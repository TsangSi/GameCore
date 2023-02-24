/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export function getset<T>(cls: { new(): T }): any {
    return (target: any, publicKey: string) => {
        const privateKey = `_${publicKey}`;
        Object.defineProperty(target, privateKey, { configurable: true, writable: true });

        const descriptor: PropertyDescriptor = {
            get(): any {
                if (!this[privateKey]) {
                    // eslint-disable-next-line new-cap
                    const clsObj = new cls();
                    this[privateKey] = clsObj;
                    const clsName = clsObj.constructor.name;
                    this.mClsDict[clsName] = clsObj;
                }
                return this[privateKey];
            },
            set(value: any) {
                this[privateKey] = value;
            },
        };
        return descriptor;
    };
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/ban-types
export function singleton<T extends object>(target: new () => T) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let instance: object | null = null;
    Object.defineProperty(target, 'getInstance', {
        value: () =>
            // eslint-disable-next-line implicit-arrow-linebreak, new-cap
            instance || (instance = new target())
        ,
    });
    return target;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace singleton {
    export function get<T>(constructor: new (...args: any[]) => T): T {
        // TODO: check here
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, dot-notation
        return constructor['getInstance']();
    }
}

interface IClass<T> {
    II: T
    show: ()=> void
}

class C extends singleton(C) {
    public II: T;
    private static _i;
    private static get I() {
        if (!this._i) {
            this._i = new C();
        }
        return this._i as unknown;
    }
    public show() {
        console.log('C');
    }
}

class Base {
    private static _i = null;
    public static get I() {
        if (!this._i) {
            this._i = new Base();
        }
        return this._i as Base;
    }
    protected name: string = 'Base';
    public constructor() {
        //
    }
    public test() {
        console.log(this.name);
    }
}
class ABase extends Base {
    // public static get I(): ABase {
    //     return super.I as ABase;
    // }

    public constructor() {
        super();
        this.name = 'ABase';
    }

    public show(): void {
        console.log('ABase show');
    }
}

class BBase extends Base {
    // public static get I(): BBase {
    //     return super.I as BBase;
    // }

    public constructor() {
        super();
        this.name = 'BBase';
    }

    public show(): void {
        console.log('BBase show');
    }
}
