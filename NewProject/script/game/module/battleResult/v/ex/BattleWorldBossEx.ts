/*
 * @Author: hrd
 * @Date: 2022-10-21 11:10:52
 * @Description:
 *
 */
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import ModelMgr from '../../../../manager/ModelMgr';
import { BattleExType } from '../../../worldBoss/WorldBossConst';
import { WorldBossModel } from '../../../worldBoss/WorldBossModel';
import { BattleType } from '../../BattleResultConst';
import { BattleRewardExBase } from './BattleRewardExBase';

const { ccclass, property } = cc._decorator;
// 世界boss颗粒
@ccclass
export class BattleWorldBossEx extends BattleRewardExBase {
    @property(cc.Node)
    private NdInfofIrst: cc.Node = null;
    @property([cc.Node])
    private NdList: cc.Node[] = [];

    private _M: WorldBossModel = null;
    /** 处理扩展内容赋值 */
    public setData(data: S2CPrizeReport): void {
        super.setData(data);
        this._M = ModelMgr.I.WorldBossModel;
        const worldBossRPType: BattleExType = this._M.getBattleType(data.FBType);
        const info = this._M.getBattleInfoData(data, worldBossRPType);
        const result = data.Type;
        this.setInfo(info, worldBossRPType, result);
    }

    public setNode(tar: cc.Node, key: string, val: string | number): void {
        UtilCocos.SetString(tar, 'LabTip', key);
        UtilCocos.SetString(tar, 'LabGrade', val);
    }
    public setInfo(info: { key: string, val: number | string }[], _type: BattleExType, result?: BattleType): void {
        this.NdInfofIrst.active = _type === BattleExType.BossFightEx;
        if (this.NdInfofIrst.active) {
            this.setNode(this.NdInfofIrst, info[0].key, info[0].val);
        }
        for (let i = 0, n = info.length; i < n; i++) {
            if (this.NdList[i]) {
                let j = i;
                if (this.NdInfofIrst.active) {
                    j = i + 1;
                    if (j > n) {
                        break;
                    }
                } else if (i === 1 && result === BattleType.Fail) {
                    const LabNoChange = this.NdList[i].getChildByName('LabNoChange');
                    LabNoChange.active = true;
                }
                this.NdList[i].active = true;
                const ele = info[j];
                if (ele) {
                    this.setNode(this.NdList[i], ele.key, ele.val);
                }
            }
        }
    }
}
