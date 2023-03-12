import BaseModel from '../../../app/core/mvc/model/BaseModel';
import UtilObject from '../../base/utils/UtilObject';

/*
 * @Author: hwx
 * @Date: 2022-06-20 12:21:34
 * @FilePath: \SanGuo\assets\script\game\com\item\ItemModel.ts
 * @Description:
 */

export default class ItemModel extends BaseModel {
    /** 静态配置 */
    public cfg: Cfg_Item;

    /** 动态数据 */
    public data: ItemData;

    /** 是否新道具 */
    public isNew?: boolean;

    /** 战力 */
    public fightValue?: number;

    /** mark */
    public mark?: number;

    public constructor(data?: object) {
        super();
        // 构造初始化的数据默认是深度拷贝的对象
        if (data) this.set(data, true);
    }

    public clearAll(): void {
        this.data = null;
        this.cfg = null;
        this.isNew = false;
        this.fightValue = 0;
        this.mark = 0;
    }

    /**
     * 设置数据
     * @param data
     * @param deepCopy 是否深度拷贝引用的数据对象
     */
    public set(data: object, deepCopy?: boolean): void {
        for (const k in data) {
            if (deepCopy && typeof data[k] === 'object') {
                this[k] = UtilObject.clone(data[k], deepCopy);
            } else {
                this[k] = data[k];
            }
        }
    }
}
