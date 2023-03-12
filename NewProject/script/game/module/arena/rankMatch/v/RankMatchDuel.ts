/*
 * @Author: zs
 * @Date: 2023-01-14 15:00:19
 * @Description:
 *
 */
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { ACTION_TYPE, ANIM_TYPE } from '../../../../base/anim/AnimCfg';
import ListView from '../../../../base/components/listview/ListView';
import { SpriteCustomizer } from '../../../../base/components/SpriteCustomizer';
import { NickShowType, UtilGame } from '../../../../base/utils/UtilGame';
import { BattleCommon } from '../../../../battle/BattleCommon';
import WinBase from '../../../../com/win/WinBase';
import { ViewConst } from '../../../../const/ViewConst';
import EntityBase from '../../../../entity/EntityBase';
import EntityCfg from '../../../../entity/EntityCfg';
import EntityUiMgr from '../../../../entity/EntityUiMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { EBattleType } from '../../../battleResult/BattleResultConst';
import { RoleInfo } from '../../../role/RoleInfo';
import { RoleMgr } from '../../../role/RoleMgr';
import { EArenaTabId } from '../../ArenaConst';

enum EScrollStatus {
    /** 继续 */
    Continue,
    /** 重复 */
    Repeat,
    /** 完成 */
    Complete,
}
const { ccclass, property } = cc._decorator;
@ccclass
export class RankMatchDuel extends WinBase {
    @property(cc.Node)
    private NodeComplete: cc.Node = null;
    @property(SpriteCustomizer)
    private SpriteTime: SpriteCustomizer = null;
    @property(cc.Node)
    private NodeLeft: cc.Node = null;
    @property(cc.Node)
    private NodeRight: cc.Node = null;
    @property(ListView)
    private listView: ListView = null;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.NodeBlack, this.close, this);
        this.updatePlayerInfo(this.NodeLeft, RoleMgr.I.info, true);
        this.updateAnim(UtilCocos.getChildByPath(this.NodeLeft, 'NodeMask/NodeAnim'), RoleMgr.I.info);
    }

    private index: number = 3;
    private time = 0.2;
    private players: RoleInfo[] = [];
    private maxIndex: number = 0;
    public init(params: unknown): void {
        this.players = params[0];
        this.maxIndex = this.players.length - 1;
        this.index = UtilNum.RandomInt(0, this.maxIndex);
        this.SpriteTime.node.active = true;
        this.schedule(this.onSchedule, this.randomTime);
    }
    // private time = 0.05;
    private randomTime = 0.1;
    private randomAllTime = 0;
    private onSchedule() {
        if (this.randomAllTime > 2) {
            this.unschedule(this.onSchedule);
            this.onRenderItem(this.listView.content.children[0], this.index);
            this.updatePlayerInfo(this.NodeRight, this.players[this.index], false);
            cc.tween(this.listView.content.children[0]).to(1, { scale: 1.2 }).call(() => {
                this.NodeComplete.active = true;
                this.SpriteTime.node.active = false;
            }).delay(1)
                .call(() => {
                    if (BattleCommon.I.enter(EBattleType.RankMath, this.players[this.index].d.UserId)) {
                        WinMgr.I.setViewStashParam(ViewConst.ArenaWin, [EArenaTabId.RankMatch, '战斗结束打开']);
                    }
                })
                .start();
        } else {
            this.onRenderItem(this.listView.content.children[0], UtilNum.RandomInt(0, this.maxIndex));
        }
        this.randomAllTime += this.randomTime;
        if (Math.floor(this.randomAllTime) !== this.SpriteTime.curIndex) {
            this.SpriteTime.curIndex = this.randomAllTime;
        }
    }
    private onRenderItem(node: cc.Node, index: number) {
        const nodeAnim = node.getChildByName('NodeAnim');
        if (nodeAnim && nodeAnim.children[0]) {
            const entity: EntityBase = nodeAnim.children[0] as EntityBase;
            if (entity) {
                const roleSkin = EntityCfg.I.getRoleSkinResID(this.players[index]);
                if (roleSkin) {
                    roleSkin.horseResID = 0;
                    // eslint-disable-next-line max-len
                    const resIds = [10001, 10002, 10003, 10004, 11001, 11002, 11003, 11004, 11009, 11010];
                    const resIndex = UtilNum.RandomInt(0, resIds.length - 1);
                    entity.setBodyAnim(this.index === index ? roleSkin.bodyResID : resIds[resIndex], ANIM_TYPE.ROLE, ACTION_TYPE.UI);
                    entity.initAnimData(roleSkin);
                }
            }
        } else {
            EntityUiMgr.I.createAttrEntity(nodeAnim, {
                isShowTitle: false,
                resType: ANIM_TYPE.ROLE,
                isPlayUs: false,
            }, this.players[index]);
        }
    }

    private updatePlayerInfo(node: cc.Node, player: RoleInfo, isSelf: boolean) {
        const score: number = isSelf ? ModelMgr.I.RankMatchModel.score : player.d.RankMatchScore;
        const name: string = isSelf ? i18n.tt(Lang.com_text_wo) : player.getAreaNick(NickShowType.ArenaNick);
        UtilCocos.SetString(node, 'LabelName', name);
        UtilCocos.SetString(node, 'LabelScore', UtilString.FormatArgs(i18n.tt(Lang.rankmatch_result_score), score));
        UtilCocos.SetString(node, 'LabelLevelName', ModelMgr.I.RankMatchModel.getCfgPos(score)?.Name || '');
    }

    private updateAnim(node: cc.Node, player: RoleInfo) {
        EntityUiMgr.I.createAttrEntity(node, {
            isShowTitle: false,
            resType: ANIM_TYPE.ROLE,
            isPlayUs: false,
        }, player);
    }
}
