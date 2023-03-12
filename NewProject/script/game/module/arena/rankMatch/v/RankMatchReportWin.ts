/*
 * @Author: zs
 * @Date: 2023-01-12 20:25:04
 * @Description:
 *
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import ListView from '../../../../base/components/listview/ListView';
import { SpriteCustomizer } from '../../../../base/components/SpriteCustomizer';
import { NickShowType, UtilGame } from '../../../../base/utils/UtilGame';
import UtilHead from '../../../../base/utils/UtilHead';
import { BattleCommon } from '../../../../battle/BattleCommon';
import { WinCmp } from '../../../../com/win/WinCmp';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import { RoleInfo } from '../../../role/RoleInfo';
import { EArenaTabId } from '../../ArenaConst';
import { ERankMatchBtn } from '../RankMatchConst';

const { ccclass, property } = cc._decorator;
@ccclass
export class RankMatchReportWin extends WinCmp {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Node)
    private NodeEmpty: cc.Node = null;

    protected start(): void {
        super.start();

        EventClient.I.on(E.RankMatch.FightLog, this.onFightLog, this);
        ControllerMgr.I.RankMatchController.C2SRankMatchOpenFightLogUI();
    }

    private logs: RankMatchFightLog[] = [];

    private onFightLog(logs: RankMatchFightLog[]) {
        this.logs = logs;
        this.ListView.setNumItems(logs.length);
        this.NodeEmpty.active = logs.length === 0;
    }

    /**
     * 渲染每一项
     * @param node 节点
     * @param index 索引
     */
    private onRenderItem(node: cc.Node, index: number) {
        const log = this.logs[index];
        const isWin = log.State === 1;
        const player = new RoleInfo(log.UserInfo);
        UtilCocos.SetString(node, 'LabelTime', UtilTime.FormatToDate(log.Time * 1000, i18n.tt(Lang.com_time_fmt_mdhs)));
        UtilCocos.SetActive(node, 'NodeWin', isWin);
        UtilCocos.SetActive(node, 'NodeLose', !isWin);
        UtilCocos.SetString(node, 'LabelFv', player.FightValue);
        UtilCocos.SetString(node, 'LabelName', player.getAreaNick(NickShowType.ArenaNick));
        const label = UtilCocos.SetString(node, 'LabelScore', log.ScoreChange);
        label.node.color = isWin ? UtilColor.ColorEnoughV : UtilColor.ColorUnEnoughV;

        const spriteIcon: cc.Sprite = UtilCocos.GetComponent(cc.Sprite, node, 'HeadIcon');
        const spriteFrame: cc.Sprite = UtilCocos.GetComponent(cc.Sprite, node, 'HeadFrame');
        UtilHead.setHead(player.d.HeadIcon, spriteIcon, player.d.HeadFrame, spriteFrame, 0.8);
        UtilGame.Click(node.getChildByName('BtnPlay'), this.onBtnPlay, this, { customData: log.Time });
        const spriteUp: SpriteCustomizer = UtilCocos.GetComponent('SpriteCustomizer', node, 'SpriteUp');
        if (spriteUp) {
            spriteUp.curIndex = Number(isWin);
        }
    }

    /** 播放战报 */
    private onBtnPlay(target: cc.Node, time: number) {
        // if (BattleCommon.I.enter(EBattleType.RankMath, this.players[index].d.UserId)) {
        WinMgr.I.setViewStashParam(ViewConst.ArenaWin, [EArenaTabId.RankMatch, ERankMatchBtn.Report]);
        // }
        ControllerMgr.I.RankMatchController.C2SRankMatchPlayFightLog(time);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.RankMatch.FightLog, this.onFightLog, this);
    }
}
