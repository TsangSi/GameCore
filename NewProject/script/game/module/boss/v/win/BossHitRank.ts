import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import { IBattleCampAtkInfo } from '../../../../battle/WarConst';
import { E } from '../../../../const/EventName';
import ModelMgr from '../../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BossHitRank extends BaseCmp {
    @property(cc.Label)
    private MyHit: cc.Label = null;
    @property(cc.Label)
    private RankName: cc.Label[] = [];
    @property(cc.Label)
    private RankHit: cc.Label[] = [];
    @property(cc.Node)
    private NdRankList: cc.Node = null;
    @property(cc.ProgressBar)
    private PbHpbar: cc.ProgressBar = null;
    @property(cc.Label)
    private HpHit: cc.Label = null;
    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.Battle.MyCampAtkCount, this.upMyAttk, this);
        EventClient.I.on(E.Battle.BossHpChange, this.upBossHp, this);

        this.setRankInfo();
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Battle.MyCampAtkCount, this.upMyAttk, this);
        EventClient.I.off(E.Battle.BossHpChange, this.upBossHp, this);
    }

    private counHp: number = 0;
    /** 加个血条 从batteMgr 过来不一定有数据 */
    public setHp(): void {
        const bossId = ModelMgr.I.BossModel.getFightId();
        let nowBossHp = ModelMgr.I.BossModel.getBossNowHp();
        const BossModel = ModelMgr.I.BossModel.GetMultiBossAttr(bossId);
        this.counHp = BossModel ? parseInt(BossModel.Attr_1) : nowBossHp;
        nowBossHp = nowBossHp === -1 ? this.counHp : nowBossHp;
        // this.Ndprg.updateProgress(nowBossHp, this.counHp, true);
        this.PbHpbar.progress = nowBossHp / this.counHp;
        const hpn = nowBossHp / this.counHp * 100 > 1 ? Math.floor(nowBossHp / this.counHp * 100) : nowBossHp === 0 ? 0 : 1;
        this.HpHit.string = `${hpn}%`;
    }

    public setRankInfo(): void {
        const ranklist = ModelMgr.I.BossModel.getFightRank();
        const rankName: string[] = [];
        const hit: number[] = [];
        if (ranklist && ranklist.length > 0) {
            ranklist.forEach((v: MultiBossRankData, i) => {
                rankName.push(`${v.ShowAreaId}.${v.Nick}`);
                hit.push(v.MaxDamage);
            });
            rankName.forEach((v: string, i) => {
                this.RankName[i].string = rankName[i];
            });
            hit.forEach((v, i) => {
                this.RankHit[i].string = UtilNum.Convert(hit[i]);
            });
        }
    }

    private rankListSw: boolean = false;
    private rankListSwith(): void {
        const actList = cc.sequence(
            // cc.moveTo(0.3, this.rankListSw ? cc.v2(-640, -180) : cc.v2(-320, -180)),
            this.rankListSw ? cc.fadeOut(0.1) : cc.fadeIn(0.1),
            cc.callFunc(() => {
                this.rankListSw = !this.rankListSw;
            }),
        );
        this.NdRankList.runAction(actList);
    }

    private hidCount = 0;
    private upMyAttk(d: IBattleCampAtkInfo): void {
        if (!d.campAtkDamage) return;
        this.hidCount += d.campAtkDamage;
        this.MyHit.string = UtilNum.Convert(this.hidCount);
    }

    private upBossHp(d) {
        // this.Ndprg.updateProgress(d, this.counHp, true);
        this.PbHpbar.progress = d / this.counHp;
        const hpn = d / this.counHp * 100 > 1 ? Math.floor(d / this.counHp * 100) : d === 0 ? 0 : 1;
        this.HpHit.string = `${hpn}%`;
    }
}
