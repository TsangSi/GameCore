/*
 * @Author: zs
 * @Date: 2022-05-09 11:06:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-29 12:18:07
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\config\Config.ts
 * @Description:
 *
 */

import { ConfigConst, ConfigInfo } from './ConfigConst';
import { ConfigIndexer } from './indexer/ConfigIndexer';

export class Config {
    /**
     * 获取对应的配置表索引器
     * ```ts
     * // 获取一条数据，根据索引
     * const object = Config.Get(Config.Type.Cfg_Item).getValueByIndex(0);
     * // 获取单个字段值，根据索引
     * const name = Config.Get(Config.Type.Cfg_Item).getValueByIndex(0, 'Name');
     * // 获取多个字段，根据索引
     * const object = Config.Get(Config.Type.Cfg_Item).getValueByIndex(0, {Name: '', Id: 0});
     * // 获取一条数据，根据唯一id
     * const object = Config.Get(Config.Type.Cfg_Item).getValueByKey(1001);
     * // 获取单个字段值，根据唯一id
     * const name = Config.Get(Config.Type.Cfg_Item).getValueByKey(1001, 'Name');
     * // 获取多个字段，根据唯一id
     * const object = Config.Get(Config.Type.Cfg_Item).getValueByKey(1001, {Name: '', Id: 0});
     * ```
     */
    public static Get<T extends ConfigIndexer>(info: ConfigInfo): T {
        if (!info || (!info.name && !info.indexer)) {
            console.warn('Config getI error:', info);
            return undefined;
        }
        if (info.indexerName && !info.indexer) {
            const Cls = cc.js.getClassByName(info.indexerName);
            info.indexer = Cls as any;// new Cls(info) as ConfigIndexer;
        }
        // eslint-disable-next-line dot-notation
        window['Config'] = Config;
        if (info.indexer) {
            // eslint-disable-next-line dot-notation
            return info.indexer['I'] as T;
        }

        return this.getIndexer<T>(info);
    }

    private static getIndexer<T>(info: ConfigInfo): T {
        const k = `_${info.name}`;
        if (this[k]) {
            return this[k] as T;
        }
        this[k] = new ConfigIndexer(info);
        return this[k] as T;
    }

    public static Type = ConfigConst;
}
