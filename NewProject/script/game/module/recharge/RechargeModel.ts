/*
 * @Author: zs
 * @Date: 2022-06-08 16:05:05
 * @FilePath: \SanGuo\assets\script\game\module\recharge\RechargeModel.ts
 * @Description:
 *
 */
import BaseModel from '../../../app/core/mvc/model/BaseModel';

const { ccclass } = cc._decorator;
@ccclass('RechargeModel')
export class RechargeModel extends BaseModel {
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    private goodsDatas: GoodsData[] = [];
    public setGoodsDatas(datas: GoodsData[]): void {
        this.goodsDatas = datas;

        this.goodsDatas.sort((a, b) => a.Gid - b.Gid);
    }

    public getGoodsDatas(): GoodsData[] {
        return this.goodsDatas;
    }
}
