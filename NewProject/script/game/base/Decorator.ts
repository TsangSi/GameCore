/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: hrd
 * @Date: 2022-04-27 18:20:38
 * @FilePath: \SanGuo\assets\script\game\base\Decorator.ts
 * @Description:
 *
 */

export function getsetObj<T>(cls: { new(): T }): any {
    return (target: any, publicKey: string) => {
        const privateKey = `_${publicKey}`;
        Object.defineProperty(target, privateKey, { configurable: true, writable: true });

        const descriptor: PropertyDescriptor = {
            get(): any {
                if (!this[privateKey]) {
                    const ccls = cc.js.getClassByName(publicKey);
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
