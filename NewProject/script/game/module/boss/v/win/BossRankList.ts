/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import ListView from '../../../../base/components/listview/ListView';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilHead from '../../../../base/utils/UtilHead';
import { UtilPath } from '../../../../base/utils/UtilPath';
import { WinCmp } from '../../../../com/win/WinCmp';
import { E } from '../../../../const/EventName';
import { RES_ENUM } from '../../../../const/ResPath';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';

/*
 * @Author: wangxin
 * @Date: 2022-11-03 10:26:18
 * @FilePath: \SanGuo2.4\assets\script\game\module\boss\v\win\BossRankList.ts
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class ComBossPage extends WinCmp {
    @property(ListView)
    private RankList: ListView = null;

    @property(cc.Node)
    private NdCurRank: cc.Node = null;

    @property(cc.Node)
    private NdNetRank: cc.Node = null;

    @property(cc.Label)
    private LbMyHit: cc.Label = null;

    @property(cc.Node)
    private NdNoOne: cc.Node = null;

    private rankListData: MultiBossRankData[] = [];

    private bossId: number;
    public init(param: number[]): void {
        super.init(param);
        this.bossId = param[0];
        UtilColor.setGray(this.NdCurRank, false);
        UtilColor.setGray(this.NdNetRank, true);
    }

    public start(): void {
        EventClient.I.on(E.Boss.MultiBossRank, this.upRankList, this);
        ControllerMgr.I.BossController.reqC2SMultiBossGetRankData(this.bossId, 1);
        this.rankListData = [];

        UtilGame.Click(this.NdCurRank, () => {
            UtilColor.setGray(this.NdCurRank, false);
            UtilColor.setGray(this.NdNetRank, true);
            ControllerMgr.I.BossController.reqC2SMultiBossGetRankData(this.bossId, 1);
        }, this);
        UtilGame.Click(this.NdNetRank, () => {
            UtilColor.setGray(this.NdCurRank, true);
            UtilColor.setGray(this.NdNetRank, false);
            ControllerMgr.I.BossController.reqC2SMultiBossGetRankData(this.bossId, 2);
        }, this);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Boss.MultiBossRank, this.upRankList, this);
    }

    public upRankList(d: S2CMultiBossGetRankData): void {
        d.Items.sort((a, b) => a.Rank - b.Rank);
        for (let i = 0; i < 5; i++) {
            if (i < d.Items.length) {
                this.rankListData[i] = d.Items[i];
            } else {
                const _Items: MultiBossRankData = {
                    UserId: -1,
                    Rank: i + 1,
                    MaxDamage: 0,
                    VipLevel: 1,
                    ShowAreaId: -1,
                    Nick: '虚位以待',
                    Head: 2,
                    HeadFrame: 1,
                };
                this.rankListData[i] = _Items;
            }
        }

        this.NdNoOne.active = !(this.rankListData.length > 0);
        // this.rankListData = this.rankListData.sort((a, b) => a.Rank - b.Rank);
        this.RankList.setNumItems(5); // this.rankListData.length // 策划说读配置50个
        this.RankList.updateAll();
        this.LbMyHit.string = UtilNum.Convert(d.MyDamage);
    }

    public setRankListData(item: cc.Node, idx: number): void {
        // get Rank Data
        const rankData = this.rankListData[idx];
        if (!rankData) return;
        item.active = true;
        // set RankNo
        const _No = item.getChildByName('LbNo');
        const SprIcon = _No.getChildByName('SprIcon');
        SprIcon.active = idx < 3;
        let sprUrl: string;
        if (rankData.Rank <= 3) {
            sprUrl = UtilPath.rankPath(rankData.Rank);
        }
        SprIcon.getComponent(DynamicImage).loadImage(sprUrl, 1, true);
        _No.getComponent(cc.Label).string = (idx + 1).toString();
        const itemInfo = item.getChildByName('ItemInfo');
        itemInfo.active = rankData.UserId > 0;
        item.getChildByName('LbNoOne').active = rankData.UserId <= 0;

        if (rankData.UserId > 0) {
            // set vip lv
            const lv = rankData.VipLevel;
            const vipLv = itemInfo.getChildByName('SprVipLv').getChildByName('LbLv').getComponent(cc.Label);

            vipLv.string = lv > 10 ? `${i18n.tt(Lang.open_svip)}${lv - 10}` : `${i18n.tt(Lang.open_vip)}${lv}`;

            // set PlayName
            // const Area = rankData.ShowAreaId > 0 ? `S${rankData.ShowAreaId}.` : '';
            const Area = rankData.ShowAreaId > 0 ? `` : '';
            itemInfo.getChildByName('LbName').getComponent(cc.Label).string = `${Area}${rankData.Nick}`;
            itemInfo.getChildByName('LbHigeHitNum').getComponent(cc.Label).string = UtilNum.Convert(rankData.MaxDamage);

            const sprBg = item.getChildByName('SprHeadBg').getComponent(cc.Sprite);
            const sprHead = item.getChildByName('SprHead').getComponent(cc.Sprite);
            UtilHead.setHead(rankData.Head, sprHead, rankData.HeadFrame, sprBg, 0.7);
        } else {
            // set Head
            const sprHead = item.getChildByName('SprHead').getComponent(cc.Sprite);
            const SprHead1 = item.getChildByName('SprHeadBg').getComponent(cc.Sprite);

            UtilHead.setHead(1, sprHead, 0, SprHead1, 0.7);
            // const headId = rankData.Head;
            // const headFrameId = rankData.HeadFrame;
            // item.getChildByName('SprHeadBg').getComponent(DynamicImage).loadImage(`${RES_ENUM.Com_HeadFrame}${headFrameId}`, 1, true);
            // SprHead1.loadImage(rankData.UserId <= 0 ? RES_ENUM.Com_Head_Img_Zjm_Youxiang : RES_ENUM.Com_Head_2, 1, true);
        }
        UtilGame.Click(item.getChildByName('NdPrevi'), () => {
            WinMgr.I.open(ViewConst.BossAwardPriew, this.bossId, rankData.Rank);
        }, this);
    }
}
