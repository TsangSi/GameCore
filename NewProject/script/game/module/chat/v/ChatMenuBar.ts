/*
 * @Author: myl
 * @Date: 2022-08-09 14:50:22
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../../i18n/i18n';
import { SpriteCustomizer } from '../../../base/components/SpriteCustomizer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import ModelMgr from '../../../manager/ModelMgr';
import { ERedDotStyle, RID } from '../../reddot/RedDotConst';
import { ChatCdMgr, EChatSetType } from '../ChatCdMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChatMenuBar extends cc.Component {
    @property({ type: [cc.Node] })
    private NdTabbarItems: cc.Node[] = [];

    protected start(): void {
        for (let i = 0; i < this.NdTabbarItems.length; i++) {
            const item = this.NdTabbarItems[i];
            UtilGame.Click(item, () => {
                const idx = this.NdTabbarItems.indexOf(item);
                this.selectIndex(idx);
            }, this);
        }

        EventClient.I.on(E.Chat.RedUpdate, this.redUpdate, this);
    }

    private _selectCall: (index: number) => void;

    public setSelectCall(cb: (index: number) => void, defaultSelectIndex: number = 0): void {
        this._selectCall = cb;
        // 默认选中第0个
        this.selectIndex(defaultSelectIndex);
    }

    private _sIdx = 0;
    public selectIndex(idx: number): void {
        this._sIdx = idx;
        if (idx === 1 && !UtilFunOpen.isOpen(FuncId.FamilyHome)) {
            MsgToastMgr.Show(i18n.tt(Lang.chat_framly_unlock));
            return;
        }
        for (let i = 0; i < this.NdTabbarItems.length; i++) {
            const nd = this.NdTabbarItems[i];
            const customizerSprite = nd.getChildByName('Sprite').getComponent(SpriteCustomizer);
            customizerSprite.curIndex = idx === i ? 1 : 0;
            nd.getChildByName('Label').getComponent(cc.Label).node.color = idx === i ? UtilColor.SelectColor : UtilColor.UnSelectColor;
        }
        if (this._selectCall) {
            this._selectCall(idx);
        }
    }

    private redUpdate() {
        const redMap = ModelMgr.I.ChatModel.getRed();
        if (this._sIdx === 0) {
            redMap[1] = 0;
            redMap[3] = 0;
        }
        if (this._sIdx === 1) {
            redMap[1] = 0;
        }
        if (this._sIdx === 3) {
            redMap[3] = 0;
        }
        let all = 0;
        for (const key in redMap) {
            const e = redMap[key];
            all += e;
        }
        this.updateRed(this.NdTabbarItems[0], all);
        this.updateRed(this.NdTabbarItems[3], redMap[3]);
        this.updateRed(this.NdTabbarItems[1], redMap[1]);
    }

    private updateRed(nd: cc.Node, redNum: number): void {
        const redNd = nd.getChildByName('RedDot');
        if (!redNum) {
            redNd.active = false;
        } else {
            redNd.active = true;
            const redLab = redNd.getChildByName('Label').getComponent(cc.Label);
            redLab.string = `${redNum}${redNum > 50 ? '+' : ''}`;
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Chat.RedUpdate, this.redUpdate, this);
    }
}
