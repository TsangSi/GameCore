/*
 * @Author: dcj
 * @Date: 2022-09-01 18:09:14
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\worldBoss\v\WbRewardPreviewWin.ts
 * @Description:
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinCmp } from '../../../com/win/WinCmp';
import ModelMgr from '../../../manager/ModelMgr';
import { WorldBossRPType } from '../WorldBossConst';
import { WorldBossModel } from '../WorldBossModel';
import { WbRewardPreviewItem } from './WbRewardPreviewItem';

const { ccclass, property } = cc._decorator;
@ccclass
export class WbRewardPreviewWin extends WinCmp {
    @property(ListView)
    private list: ListView = null;
    @property(cc.Node)
    private NdSelfBtn: cc.Node = null;
    @property(cc.Node)
    private NdFamilyBtn: cc.Node = null;
    @property(cc.Node)
    private NdRank: cc.Node = null;
    @property(cc.Node)
    private SelfLabel: cc.Node = null;

    private _M: WorldBossModel = null;
    private _nowType: WorldBossRPType = WorldBossRPType.RpSelf;
    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSelfBtn, () => { this.onHandleBtn(WorldBossRPType.RpSelf); }, this);
        UtilGame.Click(this.NdFamilyBtn, () => { this.onHandleBtn(WorldBossRPType.RpFamily); }, this);
    }
    public init(winId: number, param: unknown): void {
        super.init(winId, param);
        this._M = ModelMgr.I.WorldBossModel;
        this.initView();
    }
    private initView(): void {
        this.updateView();
    }
    private onHandleBtn(_type: WorldBossRPType): void {
        this._nowType = _type;
        this.updateView();
    }

    private scrollEvent(nd: cc.Node, idx: number) {
        const item = nd.getComponent(WbRewardPreviewItem);
        item.setData(this._nowType, idx);
    }

    private updateView(): void {
        this.updateContent();
        this.updateItems();
        this.updateBtns();
    }

    /** 更新奖励 */
    private updateItems(): void {
        this.list.setNumItems(this._M.RankCfg.get(this._nowType).length, 0);
        this.list.scrollTo(-1, 0.618);
    }
    /** 更新按钮 */
    private updateBtns(): void {
        UtilCocos.SetSpriteGray(this.NdSelfBtn, this._nowType !== WorldBossRPType.RpSelf);
        this.NdFamilyBtn.active = this._M.isWeekendBoss();
        UtilCocos.SetSpriteGray(this.NdFamilyBtn, this._nowType !== WorldBossRPType.RpFamily);
    }

    private updateContent(): void {
        const nowRank = this._nowType !== WorldBossRPType.RpSelf ? this._M.areaRank : this._M.myRank;
        const NdRank: cc.Label = this.NdRank.getComponent(cc.Label);
        if (nowRank > 0) {
            NdRank.string = `${i18n.tt(Lang.arena_di)}${nowRank}${i18n.tt(Lang.arena_ming)}`;
            NdRank.node.color = UtilColor.Hex2Rgba(UtilColor.GreenV);
        } else {
            NdRank.string = i18n.tt(Lang.com_notinrank);
            NdRank.node.color = UtilColor.Hex2Rgba(UtilColor.RedV);
        }
        const ttL = this._nowType === WorldBossRPType.RpSelf ? Lang.world_boss_self_rank_mess : Lang.world_boss_area_rank_mess;
        this.SelfLabel.getComponent(cc.Label).string = UtilString.FormatArray(i18n.tt(ttL), [i18n.tt(Lang.world_boss_rank)]);
        this.scheduleOnce(() => {
            const wid = this.SelfLabel.getContentSize().width;
            this.NdRank.setPosition(this.SelfLabel.position.x + wid, this.NdRank.position.y, 0);
        }, 0.01);
    }
    protected onDestroy(): void {
        super.onDestroy();
    }
}
