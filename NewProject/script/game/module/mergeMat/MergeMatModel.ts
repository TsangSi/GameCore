/*
 * @Author: zs
 * @Date: 2022-11-30 10:42:20
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\mergeMat\MergeMatModel.ts
 * @Description:
 *
 */
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { ViewConst } from '../../const/ViewConst';
import { BagMgr } from '../bag/BagMgr';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';

const { ccclass } = cc._decorator;
@ccclass('MergeMatModel')
export class MergeMatModel extends BaseModel {
    public clearAll(): void {
        //
    }

    public clear(): void {
        //
    }

    public getCfgByIndex(index: number): Cfg_Stick {
        const indexer = Config.Get(Config.Type.Cfg_Stick);
        const cfg: Cfg_Stick = indexer.getValueByIndex(index);
        return cfg;
    }

    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Bag.MergeMat, this.redMergeMat, this);
    }

    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Bag.MergeMat, this.redMergeMat, this);
    }

    public registerRedDotListen(): void {
        // 任务
        const mergeRed = RID.Bag.MergeMat;
        const mergeListen: IListenInfo = { // 1背包变化 2合成材料成功
            ProtoId: [ProtoId.S2CBagInfo_ID, ProtoId.S2CBagChange_ID, ProtoId.S2CComMaterial_ID],
            CheckVid: [ViewConst.BagWin],
            // RoleAttr: [RoleAN.N.ItemType_Coin3, RoleAN.N.ArmyLevel], // 人物等级变化
            ProxyRid: [RID.Bag.MergeMat],
        };

        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: mergeRed, info: mergeListen },
        );
    }

    public getStickCfgBy3Key(k1: number, k2: number, k3: number): Cfg_Stick {
        const indexer = Config.Get(Config.Type.Cfg_Stick);
        const cfg: Cfg_Stick = indexer.getValueByKey(k1, k2, k3);
        return cfg;
    }

    public redMergeMat(): boolean {
        let isShow = false;
        const indexer = Config.Get(Config.Type.Cfg_Stick);
        // 根据索引搞到所有的配置
        for (let i = 0, len = indexer.length; i < len; i++) {
            const cfg: Cfg_Stick = this.getCfgByIndex(i);
            if (UtilFunOpen.isOpen(cfg.FuncId)) { // 功能未开启不做判断
                const bol = this.isCanMerge(cfg);
                if (bol) {
                    isShow = true;
                    break;
                }
            }
        }
        RedDotMgr.I.updateRedDot(RID.Bag.MergeMat, isShow);
        return isShow;
    }

    public isCanMerge(cfg: Cfg_Stick): boolean {
        const needItemArr = cfg.NeedItem.split(':');
        const needItemId: number = Number(needItemArr[0]);

        const needItemNum: number = Number(needItemArr[1]);
        const bagNum: number = BagMgr.I.getItemNum(needItemId);
        return bagNum >= needItemNum;
    }

    /** 获取默认可以合成的Item */
    public getCanMergeIndex(): number {
        // 选中默认那个   // 没有就选中0
        const indexer = Config.Get(Config.Type.Cfg_Stick);
        const len: number = indexer.length;
        for (let i = 0; i < len; i++) {
            const cfg: Cfg_Stick = indexer.getValueByIndex(i);
            const needItemArr = cfg.NeedItem.split(':');
            const needItemId: number = Number(needItemArr[0]);

            const needItemNum: number = Number(needItemArr[1]);
            const bagNum: number = BagMgr.I.getItemNum(needItemId);
            if (bagNum >= needItemNum) { // 可合成
                return i;
            }
        }
        return 0;
    }
}
