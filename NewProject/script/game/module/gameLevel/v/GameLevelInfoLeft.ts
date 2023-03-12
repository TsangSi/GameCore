/*
 * @Author: wangxin
 * @Date: 2022-09-19 11:26:51
 * @FilePath: \SanGuo\assets\script\game\module\gameLevel\v\GameLevelInfoLeft.ts
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import { ConfigPassLevelIndexer } from '../../../base/config/indexer/ConfigPassLevelIndexer';
import { ConfigStageIndexer } from '../../../base/config/indexer/ConfigStageIndexer';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemCurrencyId } from '../../../com/item/ItemConst';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { Link } from '../../link/Link';
import { OnHookModel } from '../../onHook/OnHookModel';
import { RID } from '../../reddot/RedDotConst';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class GameLevelInfoLeft extends WinCmp {
    // 标题
    @property(cc.Node)
    protected itemPos: cc.Node = null;
    @property(cc.Label)
    protected LbLevel: cc.Label = null;
    @property(cc.Label)
    protected LbBox: cc.Label = null;
    // 关卡排名
    @property(cc.Node)
    protected NdLevelRank: cc.Node = null;
    @property(cc.Node)
    protected NdRankList: cc.Node[] = [];
    @property(cc.Node)
    protected NdList: cc.Node = null;
    @property(cc.Node)
    protected NoRank: cc.Node = null;
    @property(cc.Node)
    protected NdSwich: cc.Node = null;
    // 挂机收益
    @property(cc.Label)
    protected LbCoinL: cc.Label = null;
    @property(cc.Label)
    protected LbCoinR: cc.Label = null;
    @property(cc.Label)
    protected LbExpL: cc.Label = null;
    @property(cc.Label)
    protected LbExpR: cc.Label = null;

    private _M: OnHookModel = null;
    private hookData: ItemInfo[] = null;
    /** 关卡左侧箭头，默认打开 */
    private leftSwichState: boolean = true;
    protected start(): void {
        super.start();
        this._M = ModelMgr.I.OnHookModel;
        EventClient.I.on(E.Rank.GameLevelRank, this.setRankData, this);
        EventClient.I.on(E.GamePass.UpdateInfo, this.onUpdatePassReward, this);
        RoleMgr.I.on(this.onUpdatePassReward, this, RoleAN.N.Stage);

        ControllerMgr.I.RankListController.getRankData(1, 2557);

        const btnPass = this.node.getChildByName('NdLevelTips');
        UtilGame.Click(btnPass, this.onPassRewardClicked, this);
        UtilGame.Click(this.NdSwich, this.onNdSwich, this);
        UtilRedDot.Bind(RID.Stage.Main.Pass.Id, btnPass, cc.v2(135, 35));
        // 初始化数据
        this.init();
        this.updateView();
    }

    private onUpdatePassReward() {
        const stage = RoleMgr.I.d.Stage;
        const cfgStage: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        const cfg: ConfigPassLevelIndexer = Config.Get(Config.Type.Cfg_Stage_PassLevel);
        const bigIndex = cfg.getPassBigPrizeIndexByStage(stage);
        const bigCfg: Cfg_Stage_PassLevel = cfg.getValueByIndex(bigIndex);
        const bigObj = cfgStage.getChapterInfo(bigCfg.MaxStageNum);
        this.LbLevel.string = UtilString.FormatArgs(i18n.tt(Lang.gamelevel_button_pass_title), bigObj.chapter, bigObj.level);
        if (bigCfg.Prize2) {
            const item = bigCfg.Prize2.split(':');
            const itemModel = UtilItem.NewItemModel(+item[0], +item[1]);
            UtilItem.Show(this.itemPos, itemModel, { option: { needNum: true } });
            UtilItem.ItemNameScrollSet(itemModel, this.LbBox, itemModel.cfg.Name, false);
        }
        this.updateTimeGet();
    }
    public init(): void {
        this.hookData = this._M.AFKEta;
    }

    private updateView(): void {
        // 更新挂机收益
        this.updateTimeGet();
        this.onUpdatePassReward();
    }

    private updateTimeGet() {
        this.hookData.forEach((item) => {
            let Rdiff: number = 0;
            switch (item.ItemId) {
                case ItemCurrencyId.COIN:
                    this.LbCoinL.string = `${UtilNum.Convert(item.ItemNum)}${i18n.tt(Lang.onhook_mins)}`;
                    Rdiff = this._M.getNextAFKEtaDiff(item);
                    if (Rdiff !== 0) {
                        this.LbCoinR.string = `(+${UtilNum.Convert(Rdiff)}${i18n.tt(Lang.onhook_mins)})`;
                    }
                    break;
                case ItemCurrencyId.EXP:
                    this.LbExpL.string = `${UtilNum.Convert(item.ItemNum)}${i18n.tt(Lang.onhook_mins)}`;
                    Rdiff = this._M.getNextAFKEtaDiff(item);
                    if (Rdiff !== 0) {
                        this.LbExpR.string = `(+${UtilNum.Convert(Rdiff)}${i18n.tt(Lang.onhook_mins)})`;
                    }
                    break;
                default:
                    break;
            }
        });
    }

    private setRankData(rankData: S2CGetRankData): void {
        let _rankData: { playrerInfo: RankPlayerData, R: number, SortValue: number }[] = [];
        let Fvip;
        let FShowAreaId;
        if (rankData.FirstData) {
            rankData.FirstData.PlayerInfo.A.forEach((v) => {
                if (v.K === 2510) {
                    Fvip = v.V;
                }
                if (v.K === 2560) {
                    FShowAreaId = v.V;
                }
            });
            const fistPlayInfo: RankPlayerData = {
                // eslint-disable-next-line max-len
                Name: rankData.FirstData.PlayerInfo.Name, ShowAreaId: FShowAreaId, UserId: rankData.FirstData.PlayerInfo.UserId, Vip: Fvip, HeadFrame: 0, Head: 0,
            };
            _rankData.push({ playrerInfo: fistPlayInfo, R: rankData.FirstData.R, SortValue: rankData.FirstData.SortValue });
        }
        if (rankData.SimpleData) {
            rankData.SimpleData.forEach((v) => {
                _rankData.push({
                    playrerInfo: v.PlayerInfo,
                    R: v.R,
                    SortValue: v.SortValue,
                });
            });
        }
        const rankLen = _rankData.length > 3 ? 3 : _rankData.length;
        this.NoRank.active = rankLen === 0;
        if (rankLen !== 0) {
            _rankData = _rankData.sort((a, b) => a.R - b.R);
            for (let i = 0; i < rankLen; i++) {
                // 服务器编号在Intattr里用Key获取
                const itm = _rankData[i];
                // const role = new RoleInfo({ A: itm.PlayerInfo.A });
                this.NdRankList[i].active = true;
                this.NdRankList[i].getChildByName('LbNo').getComponent(cc.Label).string = itm.R.toString();
                // eslint-disable-next-line max-len
                this.NdRankList[i].getChildByName('LbPlayName').getComponent(cc.Label).string = `${UtilGame.ShowNick(itm.playrerInfo.ShowAreaId, itm.playrerInfo.Name)}`;
                const obj = Config.Get<ConfigStageIndexer>(Config.Type.Cfg_Stage).getChapterInfo(itm.SortValue);
                const txt = `${obj.chapter}-${obj.level}`;
                this.NdRankList[i].getChildByName('LbLevelNum').getComponent(cc.Label).string = `${i18n.tt(Lang.game_level_guanqia)}${txt}`;
            }
        }
    }

    private onPassRewardClicked() {
        // ControllerMgr.I.GamePassController.linkOpen();
        Link.To(102005);
    }
    private onNdSwich() {
        this.leftSwichState = !this.leftSwichState;
        this.moveFoldButton();
    }
    private moveFoldButton() {
        cc.Tween.stopAllByTarget(this.NdList);
        cc.Tween.stopAllByTarget(this.NdSwich);
        const w = this.NdList.width;
        const pos = !this.leftSwichState ? cc.v2(-w, 0) : cc.v2(0, 0);
        cc.tween(this.NdList).to(0.2, { x: pos.x, y: pos.y }).start();
        // const posSW = !this.leftSwichState ? cc.v2(20, 101) : cc.v2(227, 101);
        // cc.tween(this.NdSwich).to(0.2, { x: posSW.x, y: posSW.y }).start();
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Rank.GameLevelRank, this.setRankData, this);
    }
}
