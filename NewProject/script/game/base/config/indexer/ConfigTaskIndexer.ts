/*
 * @Author: zs
 * @Date: 2022-07-25 16:05:56
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\config\indexer\ConfigTaskIndexer.ts
 * @Description:
 *
 */
import { ICfgTask } from '../../../module/task/TaskConst';
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;
@ccclass('ConfigTaskIndexer')
export class ConfigTaskIndexer extends ConfigIndexer {
    private static _i: ConfigTaskIndexer;
    public static get I(): ConfigTaskIndexer {
        if (!this._i) {
            this._i = new ConfigTaskIndexer(ConfigConst.Cfg_LinkTask);
            this._i._walks();
        }
        return this._i;
    }
    private indexsByType: { [type: number]: number[] } = cc.js.createMap(true);
    protected walk(data: ICfgTask, index: number): void {
        const indexs = this.indexsByType[data.Type] = this.indexsByType[data.Type] || [];
        indexs.push(index);
    }

    /** 根据类型获取该类型所有任务的索引列表 */
    public getIndexsByType(type: number): number[] {
        this._walks();
        return this.indexsByType[type] || [];
    }
}
