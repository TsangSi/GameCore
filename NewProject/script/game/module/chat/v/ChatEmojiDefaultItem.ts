/*
 * @Author: zs
 * @Date: 2022-06-28 18:17:39
 * @FilePath: \SanGuo\assets\script\game\module\chat\v\ChatEmojiDefaultItem.ts
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { EffectMgr } from '../../../manager/EffectMgr';
import { AssetType } from '../../../../app/core/res/ResConst';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChatEmojiDefaultItem extends cc.Component {
    @property({ type: cc.Sprite })
    private SprEmoji: cc.Sprite = null;

    protected start(): void {
        UtilGame.Click(this.node, this.itemClick, this);
    }

    private itemClick() {
        // 点击选中
        EventClient.I.emit(E.Chat.SelectEmoji, this._idx);
    }

    private _idx: number = 0;

    public setData(idx: number, configIdx: number): void {
        this._idx = configIdx;
        this.updateWid();
        const conf: Cfg_Emoji = Config.Get(Config.Type.Cfg_Emoji).getValueByIndex(configIdx);
        if (conf.IsGif) {
            this.SprEmoji.spriteFrame = null;
            const path = `${RES_ENUM.Chat_Emoji}${conf.ResId.toString()}`;
            EffectMgr.I.showEffect(path, this.SprEmoji.node, cc.WrapMode.Loop, (nd) => {
                nd.setContentSize(cc.size(50, 50));
                const spr = nd.getComponent(cc.Sprite);
                spr.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            });
        } else {
            const chd = this.SprEmoji.node.children;
            chd.forEach((nd) => {
                nd.destroy();
            });

            UtilCocos.LoadSpriteFrameRemote(this.SprEmoji, `${RES_ENUM.Chat_Emoji}${conf.ResId}`, AssetType.SpriteFrame);
        }
    }

    private updateWid() {
        this.SprEmoji.getComponent(cc.Widget).updateAlignment();
    }
}
