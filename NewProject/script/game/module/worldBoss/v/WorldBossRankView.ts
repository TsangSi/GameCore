/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: dcj
 * @Date: 2022-09-06 12:27:03
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\worldBoss\v\WorldBossRankView.ts
 * @Description:
 */
import ListView from '../../../base/components/listview/ListView';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { WorldBossRankViewItem } from './WorldBossRankViewItem';
import { WorldBossRPType } from '../WorldBossConst';
import { WorldBossModel } from '../WorldBossModel';
import ModelMgr from '../../../manager/ModelMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { i18n, Lang } from '../../../../i18n/i18n';
import ControllerMgr from '../../../manager/ControllerMgr';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilColor } from '../../../../app/base/utils/UtilColor';

const { ccclass, property } = cc._decorator;
@ccclass
export class WorldBossRankView extends BaseCmp {
    @property(ListView)
    private list: ListView = null;
    @property(cc.Node)
    private BtnSelf: cc.Node = null;
    @property(cc.Node)
    private BtnArea: cc.Node = null;
    @property(cc.Label)
    private SelfRankLab: cc.Label = null;
    @property(cc.Label)
    private AreaRankLab: cc.Label = null;
    @property(cc.Label)
    private FractionLab: cc.Label = null;
    @property(cc.Label)
    private NdMess: cc.Label = null;
    @property(cc.Node)
    private NdText: cc.Node = null;

    private _M: WorldBossModel = null;
    public _type: WorldBossRPType = WorldBossRPType.RpSelf;
    private _source = [];
    protected onLoad(): void {
        super.onLoad();
        this._M = ModelMgr.I.WorldBossModel;
    }
    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnSelf, () => { this.onBtnClick(WorldBossRPType.RpSelf); }, this);
        UtilGame.Click(this.BtnArea, () => { this.onBtnClick(WorldBossRPType.RpFamily); }, this);
    }

    private onBtnClick(_type: WorldBossRPType) {
        if (_type === this._type) {
            return;
        }
        this._type = _type;
        ControllerMgr.I.WorldBossController.C2SGetWorldBossRank(_type, 1, 100);
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param);
        this.updateView();
    }

    public updateView(): void {
        this._source = [];
        const _data = this._M.rankData.get(this._type) || [];
        _data?.forEach((item) => {
            if (item.R >= 1 && item.R <= 100) {
                this._source.push(item);
            }
        });
        this.NdText.active = this._source.length === 0;
        this.list.setNumItems(this._source.length, 0);

        this.updateSelfData();
        this.updateBtns();
    }

    private updateBtns() {
        const BtnSelfSpr = this.BtnSelf.getComponent(cc.Sprite);
        const BtnAreaSpr = this.BtnArea.getComponent(cc.Sprite);
        BtnAreaSpr.enabled = this._type === WorldBossRPType.RpFamily;

        this.BtnArea.active = this._M.isWeekendBoss();
        this.BtnSelf.getComponent(cc.Button).enabled = this.BtnArea.active;
        BtnSelfSpr.enabled = this._type === WorldBossRPType.RpSelf && this.BtnArea.active;

        const selfLab = this.BtnSelf.getChildByName('selfLab').getComponent(cc.Label);
        const familyLab = this.BtnArea.getChildByName('familyLab').getComponent(cc.Label);
        if (this._type === WorldBossRPType.RpSelf) {
            selfLab.node.color = this.BtnArea.active ? UtilColor.Hex2Rgba(UtilColor.RedD) : UtilColor.Hex2Rgba(UtilColor.WhiteD);
            familyLab.node.color = UtilColor.Hex2Rgba(UtilColor.WhiteD);
        } else {
            selfLab.node.color = UtilColor.Hex2Rgba(UtilColor.WhiteD);
            familyLab.node.color = UtilColor.Hex2Rgba(UtilColor.RedD);
        }
    }

    private updateSelfData(): void {
        const _rank = this._type === WorldBossRPType.RpSelf ? this._M.myRank : this._M.areaRank;
        const _score = this._type === WorldBossRPType.RpSelf ? this._M.userScore : this._M.areaScore;
        // 排名
        this.NdMess.string = this._type === WorldBossRPType.RpSelf ? i18n.tt(Lang.myself_mess) : i18n.tt(Lang.area_mess);
        this.SelfRankLab.string = _rank !== 0 ? _rank.toString() : i18n.tt(Lang.com_null);
        // 我的积分/我的势力积分 描述
        const areaRankLabttL = this._type === WorldBossRPType.RpSelf ? Lang.world_boss_self_rank_mess : Lang.world_boss_area_rank_mess;
        this.AreaRankLab.string = UtilString.FormatArray(i18n.tt(areaRankLabttL), [i18n.tt(Lang.world_boss_integral)]);
        // 我的积分/我的势力积分 值
        const fractionLabttL = this._type === WorldBossRPType.RpSelf ? Lang.com_notinrank : Lang.world_boss_self_area_null;
        const _p = this._type === WorldBossRPType.RpFamily && _rank === 0;
        this.FractionLab.node.x = _p ? 103 : 110;
        this.FractionLab.string = _rank === 0 ? i18n.tt(fractionLabttL) : _score.toString();
    }
    private scrollEvent(nd: cc.Node, idx: number) {
        const item = nd.getComponent(WorldBossRankViewItem);
        item.setData(this._source[idx], idx, this._type);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
