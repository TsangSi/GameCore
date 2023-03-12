/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: dcj
 * @Date: 2022-11-18 12:12:56
 * @FilePath: \SanGuo-2.4-main\assets\script\game\base\config\indexer\ConfigTabPictureIndexer.ts
 * @Description:
 */
import { ConfigConst } from '../ConfigConst';
import { ConfigIndexer } from './ConfigIndexer';

const { ccclass } = cc._decorator;

@ccclass('ConfigTabPictureIndexer')
export class ConfigTabPictureIndexer extends ConfigIndexer {
    private static _i: ConfigTabPictureIndexer;
    public static get I(): ConfigTabPictureIndexer {
        if (!this._i) {
            this._i = new ConfigTabPictureIndexer(ConfigConst.Cfg_TabPicture);
        }
        return this._i;
    }

    private _picInfo: { [id: number]: { picName: string, titName: string } } = cc.js.createMap(true);

    protected walk(data: Cfg_TabPicture, index: number): void {
        const _item = { picName: data.PictureName || '', titName: data.TitlePicName || '' };
        this._picInfo[data.Id] = _item;
    }

    public getPicInfo(_id: number): { picName: string, titName: string } {
        this._walks();
        return this._picInfo[_id];
    }

    /**
     * 列表数据
     * @returns Cfg_TabPicture[]
     */
    public getTabPictureDatas(): Cfg_TabPicture[] {
        this._walks();
        return this.CfgmI.getDatas(this.TableName) as Cfg_TabPicture[];
    }
}
