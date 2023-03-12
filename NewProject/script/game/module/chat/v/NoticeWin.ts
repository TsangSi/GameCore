/*
 * @Author: myl
 * @Date: 2022-07-22 14:39:11
 * @Description:
 */
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { RES_ENUM } from '../../../const/ResPath';
import { EffectMgr } from '../../../manager/EffectMgr';
import { NoticeMsgMgr } from '../NoticeMsgMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class NoticeWin extends BaseUiView {
    @property(cc.Node)
    private richNd: cc.Node = null;

    // @property(UITransform)
    // private BgTanfm: UITransform = null;

    public init(): void {
        this.playFinish();
        this.showEffect();
    }

    private playFinish(): void {
        const nextMsg = NoticeMsgMgr.I.getPlayMsg();
        if (nextMsg == null || nextMsg === undefined) {
            this.close();// 关闭
        } else {
            this.autoPlay(nextMsg);
        }
    }

    private autoPlay(msg: string) {
        this.richNd.getComponent(cc.RichText).string = msg;
        this.resetPosition();
        this.run();
    }

    private resetPosition() {
        const LEDNdWidth = this.node.getChildByName('NdLED').width;
        const richWidth = this.richNd.width;
        const x = (LEDNdWidth + richWidth) / 2;
        this.richNd.setPosition(x, 0, 0);
    }

    private run() {
        const LEDNdWidth = this.node.getChildByName('NdLED').width;
        const width = this.richNd.width;
        const distX = -LEDNdWidth / 2 - width;
        cc.tween(this.richNd).to(20, { x: distX, y: 0 }).call(() => {
            this.playFinish();
        }).start();
    }

    public close(): void {
        super.close();
        // EventClient.I.off(E.Chat.ConnectUser, this.connectUser, this);
        // EventClient.I.off(E.Chat.ScanUserInfo, this.scan, this);
        // EventClient.I.off(E.Chat.DeleteUser, this.deleteUser, this);
        // EventClient.I.off(E.Chat.SelectEmoji, this.selectEmoji, this);
    }

    private showEffect() {
        EffectMgr.I.showEffect(RES_ENUM.Com_Ui_101, this.node, cc.WrapMode.Loop, (n) => {
            //
        });
    }
}
