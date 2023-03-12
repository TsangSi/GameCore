import { EventClient } from '../../../../app/base/event/EventClient';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import { ELobbyViewType } from '../LobbyConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class LobbyUILeft extends BaseCmp {
    @property({ type: cc.Node, displayName: '特殊福利' })
    private ndSpecialGitf: cc.Node = null;

    @property({ type: cc.Node, displayName: '系统预告' })
    private ndSystemForeshow: cc.Node = null;

    @property({ type: cc.Node, displayName: '左边不折叠的按钮' })
    private NdLeftBtn: cc.Node = null;

    @property(cc.Node)// 任务
    private NdMission: cc.Node = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.ndSpecialGitf, () => {
            console.log('点击了特殊福利节点');
        }, this);

        UtilGame.Click(this.ndSystemForeshow, () => {
            console.log('点击了系统预告节点');
        }, this);
        this.NdLeftBtn.children.forEach((node, idx) => {
            UtilGame.Click(node, () => {
                console.log(`点击了左侧${idx}按钮`);
            }, this);
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    private onShow(): void {
        this.node.active = true;
    }
    private onHide(): void {
        this.node.active = false;
    }
}
