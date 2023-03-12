/*
 * @Author: myl
 * @Date: 2023-01-28 18:49:46
 * @Description:
 */

import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../../../i18n/i18n';
import ModelMgr from '../../../../manager/ModelMgr';
import { BattleExType } from '../../../worldBoss/WorldBossConst';
import { EBattleType } from '../../BattleResultConst';
import { BattleRewardExBase } from './BattleRewardExBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleBgTextEx extends BattleRewardExBase {
    // @property(cc.Label)
    // private ContentLab: cc.Label = null;
    // 世家
    @property(cc.RichText)
    private RtFamily: cc.RichText = null;

    public setData(data: S2CPrizeReport): void {
        super.setData(data);
        switch (data.FBType) {
            case EBattleType.MultiBoss_PVE:
                // this.RtFamily.node.active = false;
                this.RtFamily.string = i18n.tt(Lang.battleSettle_MultBoss_tip);
                break;
            case EBattleType.Family_Boss:/** 世家-boss战斗 */
                // this.RtFamily.node.active = true;
                // this.ContentLab.node.active = false;

                // eslint-disable-next-line no-case-declarations
                const lan1 = i18n.tt(Lang.family_familyBattle1); // '排行榜第1成员造成最大伤害:';
                // eslint-disable-next-line no-case-declarations
                const lan2 = i18n.tt(Lang.family_familyBattle2); // '本次战斗对您造成伤害';
                // eslint-disable-next-line no-case-declarations
                const lan3 = i18n.tt(Lang.family_familyBattle3); // '您当前排名';

                // eslint-disable-next-line no-case-declarations
                const d1 = data.IntData[0];
                // eslint-disable-next-line no-case-declarations
                const d2 = data.IntData[1];
                // eslint-disable-next-line no-case-declarations
                const d3 = data.IntData[2];
                // eslint-disable-next-line no-case-declarations
                const str: string = `<color=#F7EFCA>${lan1}:</c><color=${UtilColor.RedV}>${d1}</c>\n<color=#F7EFCA>${lan2}:</c><color=${UtilColor.RedV}>${d2}</c>\n<color=#F7EFCA>${lan3}:</c><color=${UtilColor.GreenV}>${d3}</c>`;
                this.RtFamily.string = str;
                break;
            case EBattleType.Family_TrialCopy: /** 世家-族长 */
                // eslint-disable-next-line no-case-declarations
                const lan4 = i18n.tt(Lang.family_familyBattle4); // '排行榜第1成员造成最大伤害:';
                // eslint-disable-next-line no-case-declarations
                const str4: string = `<color=#F7EFCA>${lan4}:</c><color=${UtilColor.RedV}>${data.IntData[0]}</c>`;
                this.RtFamily.string = str4;
                break;
            case EBattleType.Family_Chif: /** 世家-族长 */
                // eslint-disable-next-line no-case-declarations
                const lan5 = i18n.tt(Lang.family_familyBattle5); // '成功击败族长';
                // eslint-disable-next-line no-case-declarations
                const lan6 = i18n.tt(Lang.world_boss_integral); // '积分';
                // eslint-disable-next-line no-case-declarations
                const str5: string = `<color=#F7EFCA>${lan5},</c><color=${UtilColor.GreenV}>${lan6}+1</c>`;
                this.RtFamily.string = str5;
                break;
            case EBattleType.WorldBoss_PVE_DAYS:
            case EBattleType.WorldBoss_PVE_WeekDay:
            case EBattleType.WorldBoss_PVP_DAYS:
            case EBattleType.WorldBoss_PVP_WeekDay:
                // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-unsafe-member-access
                const model = ModelMgr.I.WorldBossModel;
                // eslint-disable-next-line no-case-declarations
                const worldBossRPType: BattleExType = model.getBattleType(this._data.FBType);
                // eslint-disable-next-line no-case-declarations
                const info = model.getBattleInfoData(this._data, worldBossRPType);
                // eslint-disable-next-line no-case-declarations
                let tipStr = '';
                for (let i = 0, n = info.length; i < n; i++) {
                    const ele = info[i];
                    tipStr = tipStr += `${ele.key}${ele.val}\n`;
                }
                this.RtFamily.string = tipStr;
                break;

            default:
                break;
        }
    }
}
