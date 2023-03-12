/*
 * @Author: myl
 * @Date: 2022-07-29 16:56:37
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import { ChatEmojiDefaultItem } from './ChatEmojiDefaultItem';

const { ccclass, property } = cc._decorator;
@ccclass
export class ChatEmojiView extends BaseUiView {
    @property({ type: cc.Node })
    private NdBg: cc.Node = null;

    @property({ type: cc.ScrollView })
    private SvContent: cc.ScrollView = null;

    @property({ type: cc.Prefab })
    private EmojiPrefab: cc.Prefab = null;

    @property(cc.Node)
    private menu: cc.Node = null;

    // texture/chat/
    private selectBgImgName = 'btn_lt_04';
    private normalBgImgName = 'btn_lt_03';
    private selectTipImgNames: string[] = ['icon_lt_biaoqing_2', 'icon_lt_biaoqing_4', 'icon_lt_biaoqing_2', 'icon_lt_biaoqing_4'];
    private normalTipImgNames: string[] = ['icon_lt_biaoqing_1', 'icon_lt_biaoqing_3', 'icon_lt_biaoqing_1', 'icon_lt_biaoqing_3'];

    private readonly itemSizeConfig: cc.Size[] = [cc.size(70, 70), cc.size(150, 150)];
    private emojisConfig: number[][] = [[], [], [], []];

    public init(...param: unknown[]): void {
        const config = Config.Get(Config.Type.Cfg_Emoji);
        const count = config.keysLength;
        for (let i = 0; i < count; i++) {
            const item: Cfg_Emoji = config.getValueByIndex(i);
            if (item) {
                this.emojisConfig[item.Group].push(i);
            }
        }
        UtilGame.Click(this.NdBg, () => {
            this.close();
        }, this, { scale: 1 });

        EventClient.I.on(E.Chat.SelectEmoji, this.selectEmoji, this);
        this.handlerSv();
    }

    protected start(): void {
        super.start();

        const children = this.menu.children;
        for (let i = 0; i < children.length; i++) {
            const nd = children[i];
            UtilGame.Click(nd, () => {
                if (this._currentIdx === i) {
                    return;
                }
                for (let j = 0; j < children.length; j++) {
                    const nd1 = children[j];
                    const textColor = i === j ? '#a14a24' : '#fbd2a1';
                    const bgName = i === j ? this.selectBgImgName : this.normalBgImgName;
                    UtilCocos.LoadSpriteFrame(nd1.getChildByName('NdBg').getComponent(cc.Sprite), `${RES_ENUM.Chat}${bgName}`);
                    nd1.getChildByName('LabTip').getComponent(cc.Label).node.color = UtilColor.Hex2Rgba(textColor);
                }

                this._currentIdx = i;
                this.handlerSv();
            }, this);
        }
    }

    private _currentIdx = 0;// 防止重复点击导致的 再次刷新

    private selectEmoji(dta: number[]) {
        this.close();
    }

    private handlerSv() {
        const children = this.SvContent.content.children;
        const itemSize = this._currentIdx === 2 ? this.itemSizeConfig[1] : this.itemSizeConfig[0];
        const itemCount = this.emojisConfig[this._currentIdx];
        const maxCount = Math.max(children.length, itemCount.length);
        for (let i = 0; i < maxCount; i++) {
            const child = children[i];
            if (child == null) {
                const nd = cc.instantiate(this.EmojiPrefab);
                this.SvContent.content.addChild(nd);
                nd.setContentSize(itemSize);
                nd.getComponent(ChatEmojiDefaultItem).setData(i, itemCount[i]);
            } else if (i >= itemCount.length) {
                child.destroy();
            } else {
                child.setContentSize(itemSize);
                child.getComponent(ChatEmojiDefaultItem).setData(i, itemCount[i]);
            }
        }
    }

    public close(): void {
        super.close();
        EventClient.I.off(E.Chat.SelectEmoji, this.selectEmoji, this);
    }
}
