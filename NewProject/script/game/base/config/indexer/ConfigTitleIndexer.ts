/*
 * @Author: kexd
 * @Date: 2022-07-08 15:18:45
 * @FilePath: \SanGuo\assets\script\game\base\config\indexer\ConfigTitleIndexer.ts
 * @Description:
 *
 */

import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigTitleIndexer')
export class ConfigTitleIndexer extends ConfigIndexer {
    private static _i: ConfigTitleIndexer;
    public static get I(): ConfigTitleIndexer {
        if (!this._i) {
            this._i = new ConfigTitleIndexer(ConfigConst.Cfg_Title);
        }
        return this._i;
    }

    /** 由道具id映射到称号id */
    // private _titleIds: { [id: number]: number } = cc.js.createMap(true);

    protected walk(data: Cfg_Title, index: number): void {
        // this._titleIds[data.NeedItem] = data.Id;
    }

    // public getTitleIdByItemId(itemId: number): number {
    //     this._walks();
    //     return this._titleIds[itemId];
    // }

    /**
     * 称号列表数据
     * @returns Cfg_Title[]
     */
    public getTitleDatas(): Cfg_Title[] {
        this._walks();
        return this.CfgmI.getDatas(this.TableName) as Cfg_Title[];
    }
}
