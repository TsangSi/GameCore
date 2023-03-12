const { ccclass, property } = cc._decorator;

export class UtilPaltform {
    public static get isWeChatGame(): boolean {
        return cc.sys.platform === cc.sys.WECHAT_GAME;
    }
}
