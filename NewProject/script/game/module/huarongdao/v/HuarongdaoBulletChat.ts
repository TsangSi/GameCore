/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: lijun
 * @Date: 2023-02-22 18:44:29
 * @Description:
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilArray } from '../../../../app/base/utils/UtilArray';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilRichString } from '../../../../app/base/utils/UtilRichString';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import UtilItem from '../../../base/utils/UtilItem';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import { HuarongdaoSpeedColor, IHuarongdaoBulletChat } from '../HuarongdaoConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuarongdaoBulletChat extends BaseCmp {
    @property(cc.Prefab)
    private bulletChatItem: cc.Prefab = null;

    @property(cc.Node)
    private NdbulletParent: cc.Node = null;

    private chatList: Array<IHuarongdaoBulletChat> = [];
    private bullet_chat_pool: cc.NodePool = new cc.NodePool();
    private lineHeight = 50;
    private lineList = [];
    private speedRandomArray = [150, 210];// 速度范围
    private speed = 4;
    private bulletState = true;
    private bulletIndex = 0;
    private tweenMap: { [id: number]: cc.Tween } = cc.js.createMap();
    private lineSpeed: { [id: number]: cc.Tween } = cc.js.createMap();

    protected start(): void {
        this.addE();
        this.getLineList();

        // this.scheduleOnce(() => {
        //     this.test();
        // }, 2);
    }

    protected addE(): void {
        EventClient.I.on(E.Huarongdao.BulletChat, this.showBulletChat, this);
        EventClient.I.on(E.Huarongdao.ToggleBulletChat, this.changeToggle, this);
    }

    protected remE(): void {
        EventClient.I.off(E.Huarongdao.BulletChat, this.showBulletChat, this);
        EventClient.I.off(E.Huarongdao.ToggleBulletChat, this.changeToggle, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
    /** 接受弹幕事件 */
    private showBulletChat(chatData: Array<IHuarongdaoBulletChat>): void {
        if (!this.bulletState) { return; }
        this.chatList = [...this.chatList, ...chatData];
        if (chatData.length > 1) {
            this.step = 1;
        }
    }

    /** 弹幕开关状态 */
    private changeToggle(state: boolean): void {
        this.bulletState = state;
        if (!this.bulletState) {
            for (const k in this.tweenMap) {
                this.tweenMap[k].stop();
            }
        }
        this.tweenMap = {};
        this.lineList = [];
        this.getLineList();
        this.chatList = [];
        this.scheduleOnce(() => {
            this.NdbulletParent.removeAllChildren();
        });

        MsgToastMgr.Show(i18n.tt(this.bulletState ? Lang.huarongdao_bullet_tip2 : Lang.huarongdao_bullet_tip1));
    }

    // 通道
    private getLineList(): void {
        let count = 0;
        for (let i = 0; i < this.NdbulletParent.height; i += this.lineHeight) {
            count++;
            this.lineList.push(count);
        }
    }

    private dts: number = 0;
    private step = 0.5;
    protected update(dt: number): void {
        if (!this.bulletState) { this.dts = 0; return; }
        this.dts += dt;
        if (this.dts >= this.step) {
            this.dts -= this.step;
            this.createBullet();
        }
    }

    // 匹配这些中文标点符号 。 ？ ！ ， 、 ； ： “ ” ‘ ' （ ） 《 》 〈 〉 【 】 『 』 「 」 ﹃ ﹄ 〔 〕 … — ～ ﹏ ￥ 需要修改layout值
    private reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;

    /** 创建弹幕 */
    private createBullet(): void {
        const chat = this.chatList.shift();
        if (chat) {
            if (this.chatList.length == 0) {
                this.step = 0.5;
            }
            const posLine = this.getPosLine();
            if (posLine != -1) {
                const cfg = ModelMgr.I.HuarongdaoModel.getBulletChatByKey(chat.chatId);
                const desc = cfg.Desc.replace(/name/g, '');
                const effect = cfg.Effect;
                const genCfg = ModelMgr.I.HuarongdaoModel.getGenValueByKey(chat.genId);
                const color = UtilItem.GetItemQualityColor(Number(genCfg.OddsTime), true);
                // const str = UtilString.FormatArgs(i18n.tt(desc), `<color=${color}>${genCfg.Name}</c>`);

                let nd = this.bullet_chat_pool.get();
                if (!nd) {
                    nd = cc.instantiate(this.bulletChatItem);
                }

                /** 富文本 */
                // const CRichText = nd.getComponentInChildren(cc.RichText);
                // CRichText.string = `<outline color=#442626 width=2>${str}</outline>`;

                /** label */
                const LblName = nd.getChildByName('LblName').getComponent(cc.Label);
                const LblEvent = nd.getChildByName('LblEvent').getComponent(cc.Label);
                const LblEffect = nd.getChildByName('LblEffect').getComponent(cc.Label);
                LblName.string = genCfg.Name;
                UtilCocos.SetColor(LblName.node, color);
                LblEvent.string = cfg.Desc.replace(/{name0}/g, '');

                const desc2 = cfg.Desc2;
                if (effect > 0) {
                    // str += `,<color=${HuarongdaoSpeedColor.up}>${UtilString.FormatArgs(i18n.tt(Lang.huarongdao_speed_up), effect / 100)}</c>`;
                    LblEffect.string = desc2;
                    UtilCocos.SetColor(LblEffect.node, HuarongdaoSpeedColor.up);
                } else {
                    // str += `,<color=${HuarongdaoSpeedColor.down}>${UtilString.FormatArgs(i18n.tt(Lang.huarongdao_speed_down), Math.abs(effect) / 100)}</c>`;
                    LblEffect.string = desc2;
                    UtilCocos.SetColor(LblEffect.node, HuarongdaoSpeedColor.down);
                }

                const layout = nd.getComponent(cc.Layout);
                if (this.reg.test(desc2)) {
                    layout.paddingLeft = 12;
                    layout.paddingRight = -4;
                } else {
                    layout.paddingLeft = 8;
                    layout.paddingRight = 8;
                }

                this.scheduleOnce(() => {
                    LblName._forceUpdateRenderData(true);
                    LblEvent._forceUpdateRenderData(true);
                    LblEffect._forceUpdateRenderData(true);
                    const width1 = LblName.node.width;
                    const width2 = LblEvent.node.width;
                    const width3 = LblEffect.node.width;
                    const speed = UtilNum.RandomInt(this.speedRandomArray[0], this.speedRandomArray[1]);
                    this.startMove(nd, posLine, width1 + width2 + width3 + 16, speed);
                }, 0);
            } else {
                this.chatList.unshift(chat);
            }
        }
    }

    /** 获取通道号 */
    private getPosLine(): number {
        if (this.lineList.length == 0) {
            return -1;
        }
        const line: number = UtilArray.GetRandom(this.lineList);
        const index = this.lineList.indexOf(line);
        this.lineList.splice(index, 1);
        return line;
    }

    // 10*t = 4*t+x + width

    /** 开始移动 */
    private startMove(node: cc.Node, line: number, width: number, speed: number) {
        this.NdbulletParent.addChild(node);
        node.x = cc.view.getVisibleSize().width / 2;
        node.y = (line - 1) * this.lineHeight + this.lineHeight / 2;
        const recyTime = cc.view.getVisibleSize().width / (this.speedRandomArray[1] * cc.game.getFrameRate());
        const recyWidth = recyTime * speed;
        const moveWidth = cc.view.getVisibleSize().width - recyWidth + width;
        const recyLineTime = moveWidth / speed;
        // const recyLineTime = (width + 50) / (this.speed * cc.game.getFrameRate());
        const totalTime = (cc.view.getVisibleSize().width + width) / speed;
        const index = this.bulletIndex;
        const tweenAnim = cc.tween(node)
            .to(totalTime, { x: -(cc.view.getVisibleSize().width / 2 + width) })
            .call(() => {
                this.bullet_chat_pool.put(node);
                delete this.tweenMap[index];
            })
            .start();

        const label = node.getComponentInChildren(cc.Label);
        label.scheduleOnce(() => {
            this.lineList.push(line);
        }, recyLineTime);
        this.tweenMap[index] = tweenAnim;
        this.bulletIndex++;
        // cc.log(`弹幕：${this.bulletIndex}`);
    }

    private test(): void {
        const Cfg_chat = Config.Get(Config.Type.Cfg_HuarongdaoChat);
        const keys = Cfg_chat.getKeys();
        for (let i = 0; i < keys.length; i++) {
            const data: IHuarongdaoBulletChat = {
                chatId: keys[i],
                genId: UtilArray.GetRandom([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
            };
            this.showBulletChat([data]);
        }
    }
}
