/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable max-len */
/*
 * @Author: hwx
 * @Date: 2022-06-08 17:10:47
 * @FilePath: \SanGuo2.4\assets\script\game\gm\GMController.ts
 * @Description: GM控制器
 */

import { EventClient } from '../../app/base/event/EventClient';
import { EventProto } from '../../app/base/event/EventProto';
import { StorageMgr } from '../../app/base/manager/StorageMgr';
import BaseController from '../../app/core/mvc/controller/BaseController';
import { GameLayerEnum } from '../../app/core/mvc/WinConst';
import WinMgr from '../../app/core/mvc/WinMgr';
import { CCDynamicAtlasMgr } from '../../app/engine/atlas/CCDynamicAtlasMgr';
import { ANIM_TYPE, ACTION_TYPE, ACTION_DIRECT } from '../base/anim/AnimCfg';
import AnimCom from '../base/anim/AnimCom';
import GameApp from '../base/GameApp';
import { LayerMgr } from '../base/main/LayerMgr';
import MsgToastMgr from '../base/msgtoast/MsgToastMgr';
import SpineBase from '../base/spine/SpineBase';
import UtilFile from '../base/utils/UtilFile';
import { E } from '../const/EventName';
import { ViewConst } from '../const/ViewConst';
import EntityUiMgr from '../entity/EntityUiMgr';
import NetMgr from '../manager/NetMgr';
import PerformanceMgr from '../manager/PerformanceMgr';
import SceneMap from '../map/SceneMap';

const { ccclass } = cc._decorator;
@ccclass('GMController')
export class GMController extends BaseController {
    public constructor() {
        super();

        // if (!GameApp.I.isBanshu()) {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUP, this);
        // }
    }

    private inputCtrl: boolean = false;
    private inputItemModeCount: string = '';
    private _show: boolean = false;
    public onKeyDown(e: cc.Event.EventKeyboard): void {
        if (e.keyCode === cc.macro.KEY.d) { // 开启动态合图
            CCDynamicAtlasMgr.I.showDebug();
        }
        if (e.keyCode === cc.macro.KEY.s) { // 切换模型
            SceneMap.I.testChangeRole();
        }
        if (e.keyCode === cc.macro.KEY.g) { // 开启GM菜单
            if (WinMgr.I.checkIsOpen(ViewConst.GMWin)) {
                WinMgr.I.close(ViewConst.GMWin);
            } else {
                WinMgr.I.open(ViewConst.GMWin);
            }
        }

        if (e.keyCode === cc.macro.KEY.w) {
            PerformanceMgr.I.turnOn = !PerformanceMgr.I.turnOn;
        } else if (e.keyCode === cc.macro.KEY.q) {
            PerformanceMgr.I.textureInfo();
        } else if (e.keyCode === cc.macro.KEY.c) {
            this.showFps();
        } else if (e.keyCode === cc.macro.KEY.ctrl) {
            this.inputCtrl = true;
        } else if (e.keyCode === cc.macro.KEY.i) {
            const debugItemMode: boolean = StorageMgr.I.getValue('DebugItemMode', false);
            if (this.inputCtrl) {
                if (!debugItemMode) {
                    MsgToastMgr.Show('开启道具模式');
                } else {
                    MsgToastMgr.Show('关闭道具模式');
                }
                StorageMgr.I.setValue('DebugItemMode', !debugItemMode);
            }
        } else if (this.inputCtrl
            && (e.keyCode >= cc.macro.KEY.num9
                || e.keyCode >= cc.macro.KEY.num0)) {
            if (e.keyCode === cc.macro.KEY.num0) {
                this.inputItemModeCount += '0';
            } else if (e.keyCode === cc.macro.KEY.num1) {
                this.inputItemModeCount += '1';
            } else if (e.keyCode === cc.macro.KEY.num2) {
                this.inputItemModeCount += '2';
            } else if (e.keyCode === cc.macro.KEY.num3) {
                this.inputItemModeCount += '3';
            } else if (e.keyCode === cc.macro.KEY.num4) {
                this.inputItemModeCount += '4';
            } else if (e.keyCode === cc.macro.KEY.num5) {
                this.inputItemModeCount += '5';
            } else if (e.keyCode === cc.macro.KEY.num6) {
                this.inputItemModeCount += '6';
            } else if (e.keyCode === cc.macro.KEY.num7) {
                this.inputItemModeCount += '7';
            } else if (e.keyCode === cc.macro.KEY.num8) {
                this.inputItemModeCount += '8';
            } else if (e.keyCode === cc.macro.KEY.num9) {
                this.inputItemModeCount += '9';
            }
        } else if (e.keyCode === cc.macro.KEY.enter) {
            if (this.inputItemModeCount) {
                MsgToastMgr.Show(`修改道具模式增加数量为：${this.inputItemModeCount}`);
                StorageMgr.I.setValue('DebugItemModeCount', Number(this.inputItemModeCount));
                this.inputItemModeCount = '';
            }
        } else if (e.keyCode === cc.macro.KEY.insert) {
            // 导入战报json文件 播放
            const files = new UtilFile();
            files.openTextWin((text: string, file: File) => {
                // 兼容旧数据
                const data = JSON.parse(text);
                // console.log(text);
                // console.log(data);
                EventClient.I.emit(E.Battle.Test, data);
            });
        } else if (e.keyCode === cc.macro.KEY.z) {
            // 战斗加速
            EventClient.I.emit(E.Battle.TestSpeed);
        } /* else if (e.keyCode === cc.macro.KEY.k) {
            this.testSpine();
        } else if (e.keyCode === cc.macro.KEY.l) {
            this.testAnim();
        } else if (e.keyCode === cc.macro.KEY.j) {
            this.testPet();
        } else if (e.keyCode === cc.macro.KEY.h) {
            this.testOne();
        } else if (e.keyCode === cc.macro.KEY.m) {
            this.testAdd();
        } */
    }

    public showFps(): void {
        // eslint-disable-next-line
        // const keys = Object.keys(cc.game['_persistRootNodes']);
        // // eslint-disable-next-line
        // const _rootNode = cc.game['_persistRootNodes'][keys[0]];
        // // eslint-disable-next-line
        // if (_rootNode && _rootNode[`active`]) {
        //     // eslint-disable-next-line
        //     cc['profiler'].hideStats();
        // } else {
        //     // eslint-disable-next-line
        //     cc['profiler'].showStats();
        // }

        let _rootNode: cc.Node;
        if (!_rootNode) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, dot-notation
            const keys = Object.keys(cc.game[`_persistRootNodes`]);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, dot-notation
            _rootNode = cc.game[`_persistRootNodes`][keys[0]];
            if (_rootNode) {
                // eslint-disable-next-line dot-notation
                const childrens: cc.Node[] = _rootNode[`_children`];
                const rightNode = childrens[1];
                rightNode.x = 350;

                const lbLeft: cc.Label = childrens[0].getComponent(cc.Label);
                const lbRight: cc.Label = childrens[1].getComponent(cc.Label);
                lbLeft.fontSize = 30;
                lbRight.fontSize = 30;
                lbLeft.lineHeight = 30;
                lbRight.lineHeight = 30;

                const c1 = new cc.Color(255, 0, 0, 255);// 左边颜色
                const c2 = new cc.Color(0, 0, 255, 255);// 右边颜色
                lbLeft.node.color = c1;
                lbRight.node.color = c2;
                lbLeft.string += '按上下左右箭头移动 \n';
            }
        }
        if (_rootNode && _rootNode.active) {
            // eslint-disable-next-line
            cc['profiler'].hideStats();
        } else {
            // eslint-disable-next-line
            cc['profiler'].showStats();
        }
    }

    private _load: boolean = false;
    public testSpine(): void {
        if (this._load) {
            this._load = false;
            LayerMgr.I.TipsLayer.destroyAllChildren();
            LayerMgr.I.TipsLayer.removeAllChildren();
            return;
        }
        for (let i = 0; i < 22; i++) {
            const sp = new SpineBase({
                path: SpineBase.getSpineResPath(`${1001 + i}`),
                actionName: 'animation',
                loop: true,
            });
            const x = -300 + (i % 4) * 50;
            const y = -500 + Math.floor(i / 4) * 50;
            sp.setPosition(x, y);
            LayerMgr.I.addToLayer(GameLayerEnum.TIPS_LAYER, sp);
        }
        this._load = true;
    }

    private _loadSp: boolean = false;
    private testOne() {
        if (this._loadSp) {
            this._loadSp = false;
            const sp = LayerMgr.I.TipsLayer.getChildByName('sp');
            if (sp) {
                sp.destroy();
            }
            return;
        }
        for (let i = 0; i < 1; i++) {
            const sp = new SpineBase({
                path: SpineBase.getSpineResPath(`${1001 + i}`),
                actionName: 'animation',
                loop: true,
            });
            const x = 300 + (i % 4) * 50;
            const y = 400 + Math.floor(i / 4) * 50;
            sp.setPosition(x, y);
            sp.name = 'sp';
            LayerMgr.I.addToLayer(GameLayerEnum.TIPS_LAYER, sp);
        }
        this._loadSp = true;
    }

    private testAdd() {
        for (let i = 0; i < 1; i++) {
            const sp = new SpineBase({
                path: SpineBase.getSpineResPath(`${1001 + i}`),
                actionName: 'animation',
                loop: true,
            });
            const x = 200 + (i % 4) * 50;
            const y = 400 + Math.floor(i / 4) * 50;
            sp.setPosition(x, y);
            sp.name = 'sp';
            LayerMgr.I.addToLayer(GameLayerEnum.TIPS_LAYER, sp);
        }
    }

    public testAnim(): void {
        if (this._load) {
            this._load = false;
            LayerMgr.I.TipsLayer.destroyAllChildren();
            LayerMgr.I.TipsLayer.removeAllChildren();
            return;
        }
        for (let i = 0; i < 22; i++) {
            const anim = new AnimCom();
            anim.initAnimData({
                resId: 2001 + i,
                resType: ANIM_TYPE.SKILL,
                isFight: false,
            });
            anim.playAction(ACTION_TYPE.STAND, ACTION_DIRECT.SHOW);

            const x = -300 + (i % 4) * 50;
            const y = -500 + Math.floor(i / 4) * 50;
            anim.setPosition(x, y);
            LayerMgr.I.addToLayer(GameLayerEnum.TIPS_LAYER, anim);
        }
        this._load = true;
    }

    private testPet() {
        if (this._load) {
            this._load = false;
            LayerMgr.I.TipsLayer.destroyAllChildren();
            LayerMgr.I.TipsLayer.removeAllChildren();
            return;
        }
        const anim = EntityUiMgr.I.createAnim(LayerMgr.I.TipsLayer, 20213, ANIM_TYPE.PET, ACTION_TYPE.ATTACK, ACTION_DIRECT.LEFT_UP, cc.WrapMode.Loop);
        anim.setPosition(200, 200);

        this._load = true;
    }

    private onKeyUP(e: cc.Event.EventKeyboard): void {
        if (e.keyCode === cc.macro.KEY.ctrl) {
            this.inputCtrl = false;
        }
    }

    public addNetEvent(): void {
        EventProto.I.on(ProtoId.S2CGm_ID, this.onS2CGm, this);
    }
    public delNetEvent(): void {
        EventProto.I.off(ProtoId.S2CGm_ID, this.onS2CGm, this);
    }
    public addClientEvent(): void {
        //
        EventClient.I.on(E.GM.SendGMMsg, this.reqC2SGm, this);
    }
    public delClientEvent(): void {
        //
        EventClient.I.off(E.GM.SendGMMsg, this.reqC2SGm, this);
    }
    public clearAll(): void {
        //
    }

    /**
     * 请求GM命令，如：additem@物品Id@物品数量
     * @param cmd additem
     * @param data @物品Id@物品数量
     */
    public reqC2SGm(cmd: string, data?: string): void {
        NetMgr.I.sendMessage(ProtoId.C2SGm_ID, new C2SGm({ CmdStr: cmd, Data: data }));
    }

    private onS2CGm(data: S2CGm): void {
        if (data.Tag) {
            console.warn('执行GM命令失败：', data.ErrStr);
        }
    }
}
