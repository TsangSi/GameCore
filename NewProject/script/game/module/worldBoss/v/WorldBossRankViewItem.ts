/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: dcj
 * @Date: 2022-09-06 14:46:14
 * @FilePath: \SanGuo-dcj-script\assets\script\game\module\worldBoss\v\WorldBossRankViewItem.ts
 * @Description:
 */
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import { WorldBossRPType } from '../WorldBossConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class WorldBossRankViewItem extends cc.Component {
    @property(cc.Node)
    private ItemBg: cc.Node = null;
    @property(cc.Label)
    private RankLab: cc.Label = null;
    @property(cc.Label)
    private NameLab: cc.Label = null;
    @property(cc.Label)
    private MessLab: cc.Label = null;
    @property(cc.Label)
    private FractionLab: cc.Label = null;

    protected start(): void {
        //
    }

    public setData(_data: WorldBossAreaRankData | WorldBossUserRankData, index: number, _type: WorldBossRPType): void {
        this.ItemBg.active = index % 2 === 0;
        this.RankLab.string = _data.R.toString();
        this.NameLab.string = _data.Name;
        let typeData = null;
        if (_type === WorldBossRPType.RpSelf) {
            typeData = _data as WorldBossUserRankData;
            this.MessLab.string = UtilString.FormatArray(
                i18n.tt(Lang.world_boss_power),
                [UtilNum.ConvertFightValue(typeData.FightValue)],
            );
        } else {
            typeData = _data as WorldBossAreaRankData;
            this.MessLab.string = UtilString.FormatArray(
                i18n.tt(Lang.world_boss_member),
                [typeData.FightNum],
            );
        }
        this.FractionLab.string = UtilNum.Convert(_data.Score);
    }

    protected onDestroy(): void {
        //
    }
}
