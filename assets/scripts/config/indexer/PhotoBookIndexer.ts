import { js } from 'cc';
import Utils from '../../utils/Utils';
import CfgIndexer from '../CfgIndexer';
import CfgManager from '../CfgManager';
import { Config } from '../Config';

export default class PhotoBookIndexer extends CfgIndexer {
    private static _I: PhotoBookIndexer = null;
    static get I (): PhotoBookIndexer {
        if (this._I == null) {
            this._I = new PhotoBookIndexer(CfgManager.I, Config.T.Cfg_PhotoBook, 'Id');
        }
        return this._I;
    }

    private indexs_by_class_type: { [Class: number]: {[Type: number]: number[]} } = js.createMap(true);

    private ids: number[] = [];

    /**
     * 只遍历一次，做好索引对应表
     */
    protected walk (data: Cfg_PhotoBook, index: number) {
        this.ids.push(data.Id);

        if (!this.indexs_by_class_type[data.Class]) {
            this.indexs_by_class_type[data.Class] = js.createMap(true);
        }
        if (!this.indexs_by_class_type[data.Class][data.Type]) {
            this.indexs_by_class_type[data.Class][data.Type] = [];
        }
        Utils.insertToAscUniqueArray(this.indexs_by_class_type[data.Class][data.Type], index);
    }

    /**
     * 根据大类、小类获取数据
     * @param Class 大类
     * @param Type 小类
     */
    getDatasByClassType (Class: number, Type: number) {
        this._walk();
        const types = this.indexs_by_class_type[Class];
        if (types && types[Type]) {
            return types[Type];
        }
        return [];
    }
}
