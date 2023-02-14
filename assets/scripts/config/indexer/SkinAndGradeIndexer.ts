import { js, TiledUserNodeData } from 'cc';
import { Empty, Type } from '../../global/GConst';
import Utils from '../../utils/Utils';
import UtilsString from '../../utils/UtilsString';
import CfgIndexer from '../CfgIndexer';
import CfgManager from '../CfgManager';
import { Config } from '../Config';

export class SkinAndGradeIndexer extends CfgIndexer {
    private static _I: SkinAndGradeIndexer = null;
    static get I (): SkinAndGradeIndexer {
        if (this._I == null) {
            this._I = new SkinAndGradeIndexer(CfgManager.I, Config.T.Cfg_FightScene.name, 'Id');
        }
        return this._I;
    }
    private animids: string[] = [];
    private nan_animids: number[] = [];
    private nv_animids: number[] = [];
    private indexs_by_sex_index: number[] = [];
    private indexs_by_animid_index: number[] = [];
    /**
     * 只遍历一次，做好索引对应表
     */
    protected walk (data: Cfg_Skin, index: number) {
        const animids = data.AnimId.split('|');
        if (animids.length > 1) {
            this.nan_animids.push(+animids[0]);
            this.nv_animids.push(+animids[0]);
            this.indexs_by_sex_index.push(index);
        } else {
            this.animids.push(animids[0]);
            this.indexs_by_animid_index.push(index);
        }
    }

    getIndexByAnimIdAndSex (AnimId: number | string, sex?: number) {
        if (!Utils.isNullOrUndefined(sex) && typeof AnimId === 'number') {
            if (sex === 1) {
                const index = this.nan_animids.indexOf(AnimId);
                if (index > -1) {
                    return this.indexs_by_sex_index[index];
                }
            } else {
                const index = this.nv_animids.indexOf(AnimId);
                if (index > -1) {
                    return this.indexs_by_sex_index[index];
                }
            }
        }
        const index = this.animids.indexOf(AnimId.toString());
        if (index > -1) {
            return this.indexs_by_animid_index[index];
        }
        return -1;
    }
}
