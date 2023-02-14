import { js, TiledUserNodeData } from 'cc';
import { Empty, Type } from '../../global/GConst';
import Utils from '../../utils/Utils';
import UtilsString from '../../utils/UtilsString';
import CfgIndexer from '../CfgIndexer';
import CfgManager from '../CfgManager';
import { Config } from '../Config';

export class GoldChangeWarriorIndexer extends CfgIndexer {
    private static _I: GoldChangeWarriorIndexer = null;
    static get I (): GoldChangeWarriorIndexer {
        if (this._I == null) {
            this._I = new GoldChangeWarriorIndexer(CfgManager.I, Config.T.Cfg_FightScene.name, 'Id');
        }
        return this._I;
    }

    /** 根据皮肤id存储最大等级索引 */
    private max_level_index_by_id: { [SkinId: number]: number } = js.createMap(true);
    /** 根据皮肤id存储最大等级，阶级1等级1 就是11 */
    private max_level_by_id: { [SkinId: number]: number } = js.createMap(true);
    private level_indexs_by_id_star_grade: { [SkinId: number]: { [star: number]: number[] } } = js.createMap(true);
    private stars_by_id: { [SkinId: number]: number[] } = js.createMap(true);
    /**
     * 只遍历一次，做好索引对应表
     */
    protected walk (data: Cfg_GoldChange_Warrior, index: number) {
        const id = data.SkinId;
        const star = data.CondStar;
        const grade = data.GCGrade;
        this.max_level_by_id[id] = this.max_level_by_id[id] || 0;
        this.max_level_index_by_id[id] = this.max_level_index_by_id[id] || 0;
        const gl = +`${grade}${data.GCLevel}`;
        if (this.max_level_by_id[id] < gl) {
            this.max_level_by_id[id] = gl;
            this.max_level_index_by_id[id] = index;
        }
        if (!this.level_indexs_by_id_star_grade[id]) {
            this.level_indexs_by_id_star_grade[id] = js.createMap(true);
            this.stars_by_id[id] = [];
        }
        if (!this.level_indexs_by_id_star_grade[id][star]) {
            this.level_indexs_by_id_star_grade[id][star] = [];
            this.stars_by_id[id].push(star);
        }
        this.level_indexs_by_id_star_grade[id][star].push(index);
    }

    /**
     * 获取该皮肤id最大等级索引
     * @param id 皮肤id
     * @returns
     */
    getMaxGCGradeById (id: number) {
        const stars = this.stars_by_id[id];
        const star = stars[stars.length - 1];
        const index_by_star = this.level_indexs_by_id_star_grade[id];
        const index_by_grade = index_by_star[star];
        const index = index_by_grade[index_by_grade.length];
        return this.select('GCGrade', index);
    }

    /**
     * 根据皮肤id，星变等级 获取对应的等级数量
     * @param id 皮肤id
     * @param star 星变等级
     * @returns
     */
    getLevelCountByIdGrade (id: number, star: number) {
        const index_by_star = this.level_indexs_by_id_star_grade[id];
        const index_by_grade = index_by_star[star];
        return index_by_grade.length;
    }
}
