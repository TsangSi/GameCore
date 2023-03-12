/*
 * @Author: hrd
 * @Date: 2022-05-05 14:49:47
 * @LastEditors: hrd
 * @LastEditTime: 2022-05-05 14:58:02
 * @FilePath: \SanGuo\assets\script\game\base\Singleton.ts
 * @Description:
 *
 */
export default class Singleton {
    private static maps:{[clsName: string]: any} = {};

    /** 获取单例对象  */
    public static Get<T>(targetCls: { new (): T }): T {
        const clsName = targetCls.name;
        if (!Object.prototype.hasOwnProperty.call(Singleton.maps, clsName)) {
            // eslint-disable-next-line new-cap
            Singleton.maps[clsName] = new targetCls();
        }
        return Singleton.maps[clsName] as T;
    }
    /** 移除单例对象 */
    public static Destroy<T>(targetCls: { new (): T }): void {
        const clsName = targetCls.name;
        if (Object.prototype.hasOwnProperty.call(Singleton.maps, clsName)) {
            delete Singleton.maps[clsName];
        }
    }
    /** 清除所有单例对象 */
    public static Clear(): void {
        Singleton.maps = {};
    }
    /** 对象是否存在 */
    public static Exist<T>(targetCls: { new (): T }): boolean {
        const clsName = targetCls.name;
        let isExist = false;
        if (Object.prototype.hasOwnProperty.call(Singleton.maps, clsName)) {
            isExist = true;
        }
        return isExist;
    }
}
