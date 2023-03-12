import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { FamilyPatriRankItem } from './FamilyPatriRankItem';

const { ccclass, property } = cc._decorator;
/** 伤害排行@ylj */
@ccclass
export default class FamilyPatriarchRankPage extends WinTabPage {
    @property(cc.Label)// 我的排名
    private LabMyRank: cc.Label = null;
    @property(cc.Label)// 最大排名
    private LabMax: cc.Label = null;
    @property(cc.Label)// 上榜限制
    private LabLimit: cc.Label = null;

    @property(ListView)// ListView
    private list: ListView = null;
    @property(cc.Node)// 空
    private NdEmpty: cc.Node = null;

    public init(winId: number, param: unknown[], tabIdx: number, tabId?: number): void {
        super.init(winId, param, 0);
        EventClient.I.on(E.Family.FamilyDamageRank, this._onFamilyDamageRank, this);
        this._initRankList();
        this._initMyRankInfo();
    }
    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Family.FamilyDamageRank, this._onFamilyDamageRank, this);
    }

    public refreshPage(winId: number, params: any[]): void {
        ControllerMgr.I.FamilyController.reqC2SFamilyPatriGetRank();
    }
    /** 初始化我的排名信息 */
    private _initMyRankInfo(): void {
        const myRankInfo: S2CFamilyPatriGetMyRank = ModelMgr.I.FamilyModel.getMyRankInfo();
        if (myRankInfo) {
            // 我的排名
            this.LabMyRank.string = myRankInfo.Rank
                ? `${i18n.tt(Lang.arena_di)}${myRankInfo.Rank}${i18n.tt(Lang.arena_ming)}`
                : i18n.tt(Lang.com_notinrank);// `第${myRankInfo.Rank}名` : '未上榜';
            // 我的最高伤害
            this.LabMax.string = `${UtilNum.Convert(myRankInfo.Val)}`;
            // 上榜条件
            const maxLimit = ModelMgr.I.FamilyModel.getCfgPatriLimit();
            this.LabLimit.string = `${i18n.tt(Lang.family_damageReach)}${UtilNum.Convert(maxLimit)}`;// 最高伤害达到
        }
    }

    /** 初始化排行榜列表 */
    private _initRankList(): void {
        ControllerMgr.I.FamilyController.reqC2SFamilyPatriGetRank();// 请求排行榜信息
    }
    /** 返回排行榜列表成功 */
    private rankList: FamilyPatriHurtRank[];
    private _onFamilyDamageRank(data): void {
        this.rankList = ModelMgr.I.FamilyModel.getFamilyPatriHurtRankList();
        if (this.rankList && this.rankList.length) {
            this.list.setNumItems(this.rankList.length ? this.rankList.length : 0, 0);
            this.list.scrollTo(0);
            this.list.node.active = true;
            this.NdEmpty.active = false;
        } else {
            this.NdEmpty.active = true;
            this.list.node.active = false;
        }
    }
    private scrollEvent(node: cc.Node, index: number) {
        const item: FamilyPatriRankItem = node.getComponent(FamilyPatriRankItem);
        item.setData(this.rankList[index]);
    }
}
