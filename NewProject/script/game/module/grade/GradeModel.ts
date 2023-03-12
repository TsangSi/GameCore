/*
 * @Author: hwx
 * @Date: 2022-07-14 16:54:53
 * @FilePath: \SanGuo\assets\script\game\module\grade\GradeModel.ts
 * @Description: 升阶模型
 */

import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Cfg_GradeSkill_Unit, Cfg_Grade_Unit } from './GradeConst';

export class GradeModel extends BaseModel {
    /** 进阶数据 */
    public data: GradeData;

    /** 进阶配置 */
    public cfg: Cfg_Grade_Unit;

    public skinCfg: Cfg_GradeSkin;

    public skillsCfg: Cfg_GradeSkill_Unit[];

    public clearAll(): void {
        //
    }
}
