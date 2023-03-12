/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @Author: hrd
 * @Date: 2022-04-15 18:56:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-15 12:08:48
 * @FilePath: \SanGuo2.4\assets\script\login\v\LoginView.ts
 * @Description:
 *
 */

import { EventClient } from '../../app/base/event/EventClient';
import BaseUiView from '../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../app/core/mvc/WinMgr';
import ModelMgr from '../../game/manager/ModelMgr';
import { E } from '../../game/const/EventName';
import { ViewConst } from '../../game/const/ViewConst';
import StartGamePanel from './StartGamePanel';
import { ResMgr } from '../../app/core/res/ResMgr';
import GameApp from '../../game/base/GameApp';
import { UI_PATH_ENUM } from '../../game/const/UIPath';
import { SdkMgr } from '../../platformSdk/SdkMgr';
import { UtilGame } from '../../game/base/utils/UtilGame';
import { AudioMgr } from '../../app/base/manager/AudioMgr';
import SpineBase from '../../game/base/spine/SpineBase';
import { EffectMgr } from '../../game/manager/EffectMgr';
import EntityUiMgr from '../../game/entity/EntityUiMgr';
import { ANIM_TYPE, ACTION_TYPE, ACTION_DIRECT } from '../../game/base/anim/AnimCfg';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginView extends BaseUiView {
    /** 背景 */
    @property(cc.Node)
    private SprBg: cc.Node = null;
    @property(cc.Node)
    private PanelNd: cc.Node = null;

    /** 开始游戏面板 */
    private SGPanel: StartGamePanel = null;

    @property(cc.Node)
    private BtnAge16: cc.Node = null;

    protected onLoad(): void {
        super.onLoad();
        AudioMgr.I.playLoginMusic();

        ResMgr.I.preload(UI_PATH_ENUM.MsgToast, cc.Prefab);
        ResMgr.I.preload(UI_PATH_ENUM.NetConfirmBox, cc.Prefab, true);
    }

    private addEvent() {
        EventClient.I.on(E.Login.Succ, this.onLoginSucc, this);
        EventClient.I.on(E.Login.GameLoading, this.onLoadStartGame, this);
        EventClient.I.on(E.Sdk.Health, this.onOpenHealthTipBtn, this);
    }

    private delEvent() {
        EventClient.I.off(E.Login.Succ, this.onLoginSucc, this);
        EventClient.I.off(E.Login.GameLoading, this.onLoadStartGame, this);
        EventClient.I.off(E.Sdk.Health, this.onOpenHealthTipBtn, this);
    }

    private test() {
        for (let i = 0; i < 1; i++) {
            const sp = new SpineBase({
                path: SpineBase.getSpineResPath('1001'),
                actionName: 'animation',
                loop: true,
            });
            sp.y = 100;
            this.node.addChild(sp);
        }

        EffectMgr.I.showAnim('action/skill_effect/action_2005/skill_effect2005_s', (node: cc.Node) => {
            if (this.node && this.node.isValid) {
                node.y = -200;
                this.node.addChild(node);
            }
        }, cc.WrapMode.Loop);

        //
        const pet = EntityUiMgr.I.createAnim(this.node, 20213, ANIM_TYPE.PET, ACTION_TYPE.ATTACK, ACTION_DIRECT.LEFT_UP, cc.WrapMode.Normal);
        pet.setPosition(200, 400);
        UtilGame.Click(this.node, () => {
            pet.playAction(ACTION_TYPE.ATTACK);
        }, this);
    }

    private _spine: SpineBase = null;
    private _spine2: SpineBase = null;
    private _act: number = 0;
    private test2() {
        this._spine = new SpineBase({
            path: SpineBase.getSpineResPath('1001'), // 'spine/role/man/10001-4',
            actionName: 'animation',
            loop: true,
            callback: () => {
                console.log('test2加载完');
            },
            endCallback: () => {
                console.log('test2播放完');
            },
        });
        this._spine.setPosition(200, 300);
        this.node.addChild(this._spine);

        UtilGame.Click(this.node, () => {
            if (this._act === 0) {
                //
                if (this._spine2) return;
                this._spine2 = new SpineBase({
                    path: SpineBase.getSpineResPath('1001'),
                    actionName: 'animation',
                    loop: true,
                    trackIndex: 1,
                    callback: () => {
                        console.log('spine加载完11111');
                    },
                    endCallback: () => {
                        console.log('spine播放完22222');
                    },
                });
                this._spine2.setPosition(-200, 300);
                this.node.addChild(this._spine2);
                this._act = 1;
            } else {
                //
                this._spine.destroy();
                this._spine2.playAction('animation', true);
                this._act = 0;
            }
        }, this);
    }

    public init(param: unknown[]): void {
        this.addEvent();
        this.initStartGamePanel();
    }

    private initStartGamePanel() {
        ResMgr.I.loadAsync(UI_PATH_ENUM.StartGameView, cc.Prefab).then((pre: cc.Prefab) => {
            const node = cc.instantiate(pre);
            this.PanelNd.addChild(node);
            this.SGPanel = node.getComponent(StartGamePanel);
            this.initUI();
        }).catch((err) => {
            console.log(err);
        });
    }

    private initUI() {
        if (window['closeSplashFunc']) {
            window['closeSplashFunc']();
        }
        this.PanelNd.active = false;
        // WinMgr.I.open(ViewConst.AccountLoginView);
        if (GameApp.I.isOpenSDK()) {
            SdkMgr.I.login();
        } else {
            WinMgr.I.open(ViewConst.AccountLoginView);
        }
        if (this.BtnAge16) {
            UtilGame.Click(this.BtnAge16, this.openAgeTips, this);
            this.BtnAge16.active = false;
        }
    }

    /** 登录成功 */
    private onLoginSucc() {
        const model = ModelMgr.I.LoginModel;
        this.PanelNd.active = true;
        const nowName = model.getLastSerName(); // 当前服务器名
        const newName = model.getNewSerName(); // 最新服务器名
        this.SGPanel.getComponent(StartGamePanel).setData(nowName, newName);
    }

    /** 开始加载游戏 */
    private onLoadStartGame() {
        this.PanelNd.active = false;
    }

    /** 显示适龄提示 */
    private openAgeTips(): void {
        SdkMgr.I.showAgeTips();
    }

    /** 显示适龄提示按钮 */
    private onOpenHealthTipBtn(state: number): void {
        this.BtnAge16.active = state === 1;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.delEvent();
    }
}
