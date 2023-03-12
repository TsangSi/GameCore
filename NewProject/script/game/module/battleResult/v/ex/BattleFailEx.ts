/*
 * @Author: myl
 * @Date: 2023-01-28 14:24:09
 * @Description:
 */

import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { FuncId } from '../../../../const/FuncConst';
import { ViewConst } from '../../../../const/ViewConst';
import ModelMgr from '../../../../manager/ModelMgr';
import { Link } from '../../../link/Link';
import { BattleRewardExBase } from './BattleRewardExBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleFailEx extends BattleRewardExBase {
    @property(cc.Node)
    private btnPet: cc.Node = null;

    @property(cc.Node)
    private btnBuild: cc.Node = null;

    @property(cc.Node)
    private btnSkill: cc.Node = null;

    protected start(): void {
        UtilGame.Click(this.btnPet, () => {
            // 武将
            ModelMgr.I.GeneralModel.openGeneral();
            this?._closeCall();
        }, this);
        UtilGame.Click(this.btnBuild, () => {
            // 锻造
            Link.To(FuncId.EquipStrength);
            this?._closeCall();
        }, this);
        UtilGame.Click(this.btnSkill, () => {
            // 技能
            WinMgr.I.open(ViewConst.RoleWin, 1, 0);
            this?._closeCall();
        }, this);
    }
}
