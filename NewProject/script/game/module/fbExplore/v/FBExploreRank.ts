/*
 * @Author: zs
 * @Date: 2023-02-07 11:38:16
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { ERankParam, ERankType } from '../../rankList/RankListConst';
import FBExploreRankItem from '../com/FBExploreRankItem';
import { EFBExploreType } from '../FBExploreConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FBExploreRank extends WinCmp {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Label)
    private LabelRank: cc.Label = null;
    @property(cc.Label)
    private LabelLevel: cc.Label = null;
    @property(cc.Node)
    private NodeEmpty: cc.Node = null;

    public init(params: any[]): void {
        this.exploreType = params[0];
        EventClient.I.on(E.Rank.GameLevelRank, this.onGameLevelRank, this);
        if (UtilFunOpen.isOpen(FuncId.RankListCross, false)) {
            ControllerMgr.I.RankListController.getRankData(ERankType.More, ERankParam.FBExploreGem);
        } else {
            ControllerMgr.I.RankListController.getRankData(ERankType.Local, ERankParam.FBExploreGem);
        }
    }

    private exploreType: EFBExploreType = null;
    private datas: RankSimpleData[] = [];
    private onGameLevelRank(data: S2CGetRankData) {
        this.datas.length = 0;
        const type = data?.Param;
        if (!type) { return; }
        switch (type) {
            case ERankParam.FBExploreGem:
                if (data.FirstData) {
                    let Fvip;
                    let FShowAreaId;
                    data.FirstData.PlayerInfo.A.forEach((v) => {
                        if (v.K === 2510) {
                            Fvip = v.V;
                        }
                        if (v.K === 2560) {
                            FShowAreaId = v.V;
                        }
                    });
                    const fistPlayInfo: RankPlayerData = {
                        // eslint-disable-next-line max-len
                        Name: data.FirstData.PlayerInfo.Name,
                        ShowAreaId: FShowAreaId,
                        UserId: data.FirstData.PlayerInfo.UserId,
                        Vip: Fvip,
                        HeadFrame: 0,
                        Head: 0,
                    };
                    this.datas.push({ PlayerInfo: fistPlayInfo, R: data.FirstData.R, SortValue: data.FirstData.SortValue });
                }
                this.datas = this.datas.concat(data.SimpleData);
                this.ListView.setNumItems(this.datas.length);
                this.NodeEmpty.active = this.datas.length === 0;
                break;
            default:
                break;
        }
        let strLeven = i18n.tt(Lang.com_null);
        if (data?.MyData?.SortValue) {
            const cfg = ModelMgr.I.FBExploreModel.getCfg(this.exploreType, data?.MyData?.SortValue);
            if (cfg) {
                strLeven = UtilString.FormatArgs(i18n.tt(Lang.fbexplore_rank_level_desc), cfg.Level, cfg.Part, cfg.Stage);
            }
        }
        this.LabelLevel.string = strLeven;
        this.LabelRank.string = this.LabelRank.string = data?.MyData?.R ? `${data.MyData.R}` : i18n.tt(Lang.com_notinrank);
    }

    private onRenderItem(node: cc.Node, index: number) {
        node.getComponent(FBExploreRankItem).setData(this.exploreType, this.datas[index]);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Rank.GameLevelRank, this.onGameLevelRank, this);
    }
}
