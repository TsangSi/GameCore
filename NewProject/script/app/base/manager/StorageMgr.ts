/*
 * @Author: hwx
 * @Date: 2022-04-08 15:28:10
 * @FilePath: \SanGuo\assets\script\app\base\manager\StorageMgr.ts
 * @Description: 存储管理器
 */
export class StorageMgr {
    /** 存储 */
    private _storage: Storage = cc.sys.localStorage;
    /** 单例对象 */
    private static _Instance: StorageMgr;
    public static get I(): StorageMgr {
        if (!this._Instance) {
            this._Instance = new StorageMgr();
        }
        return this._Instance;
    }
    /**
     * 设置键值
     * @param key
     * @param value
     */
    public setValue(key: string, value: unknown): void {
        if (value === undefined || value === null) {
            this.removeValue(key);
            return;
        }
        try {
            this._storage.setItem(key, JSON.stringify(value));
        } catch (err) {
            cc.error(err);
        }
    }

    /**
     * 获取键值
     * @param key
     * @param defaultValue
     * @returns 如果没有值，返回默认值
     */
    public getValue<T>(key: string, defaultValue?: unknown): T {
        const value = this._storage.getItem(key);
        if (!value) return defaultValue as T;

        try {
            return JSON.parse(value) as T;
        } catch (err) {
            cc.error(err);
        }
        return defaultValue as T;
    }

    /**
     * 删除指定的键值
     * @param key
     */
    public removeValue(key: string): void {
        this._storage.removeItem(key);
    }

    /**
     * 清空所有键值
     */
    public clear(): void {
        this._storage.clear();
    }
}
