/*
 * @Author: wangxin
 * @Date: 2022-09-27 14:57:49
 * @FilePath: \SanGuo\assets\script\game\module\lobby\v\LobbyNewPlayer.ts
 */
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../../../base/utils/UtilGame';
import NetMgr from '../../../manager/NetMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class LobbyNewPlayer extends BaseCmp {
    @property(cc.Node)
    private NdBtn: cc.Node = null;
    @property(cc.Node)
    private Bg: cc.Node = null;
    @property(cc.Node)
    private NdGuide: cc.Node = null;
    protected start(): void {
        UtilGame.Click(this.NdBtn, this.clickWolrd, this, { scale: 1 });
        UtilGame.Click(this.Bg, this.clickWolrd, this, { scale: 1 });
    }

    private clickWolrd(): void {
        const req: C2SWelcome = {};
        NetMgr.I.sendMessage(ProtoId.C2SWelcome_ID, req);
        this.close();
        this.NdGuide.active = false;
    }
}
