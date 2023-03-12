/* eslint-disable no-unused-expressions */
/*
 * @Author: hrd
 * @Date: 2022-03-29 20:51:52
 * @FilePath: \SanGuo\assets\script\game\base\main\GameMain.ts
 * @Description:
 *
 */
// import { CCResMD5 } from 'h3_engine';
import { EventClient } from '../../../app/base/event/EventClient';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import TaskCollector, { DB_ID_ENUM, DB_KEY_ENUM } from '../../manager/TaskCollector';
import ProtoManager from '../../manager/ProtoManager';
import ControllerMgr from '../../manager/ControllerMgr';
import GameLogic from './GameLogic';
import GameApp from '../GameApp';
import { ConfigMgr } from '../config/ConfigMgr';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { AudioMgr } from '../../../app/base/manager/AudioMgr';
import { CCResMD5 } from '../../../app/engine/resmd5/CCResMD5';
import { SdkMgr } from '../../../platformSdk/SdkMgr';
import ModelMgr from '../../manager/ModelMgr';
import { FrameBlockMgr } from '../../../app/engine/frameBlock/FrameBlockMgr';
import { UI_PATH_ENUM } from '../../const/UIPath';

const { ccclass, property } = cc._decorator;

// eslint-disable-next-line dot-notation
window.ResJsonStopCache = cc.sys.platform === cc.sys.WECHAT_GAME;

cc.assetManager.downloader.maxConcurrency = 1000;
cc.assetManager.downloader.maxRequestsPerFrame = 1000;

@ccclass
export class GameMain extends cc.Component {
    // 背景图
    @property(cc.Sprite)
    private SprBg: cc.Sprite = null;

    private _audioSource: cc.AudioSource = null;
    /** 游戏初始化完成 */
    private _initEnd: boolean = false;

    public onLoad(): void {
        FrameBlockMgr.I;
        this._audioSource = this.getComponent(cc.AudioSource);

        // [2]
        this.setSprBg();
        // todo 初始化平台
        this.initPlatform();
        this.initGame();

        // eslint-disable-next-line no-new
        // new LogMgr();
    }

    public onDestroy(): void {
        // [6]
    }

    /** 游戏主循环 */
    public lateUpdate(dt: number): void {
        FrameBlockMgr.I.lateUpdate();
        if (this._initEnd) {
            // EventClient.I.emit(E.Game.MainUpdate);
            GameLogic.I.mainUpdate(dt);
        }
    }

    private setSprBg() {
        // [4]
    }

    private initPlatform() {
        if (GameApp.I.isOpenSDK()) {
            SdkMgr.I.init();
        }
    }

    // LoginBack,
    // /** 获取角色信息 */
    // RoelInfoEnd,
    // /** 配置表初始化完成 */
    // ConfigInitEnd,
    // /** 地图初始化完成 */
    // MapInitEnd,
    // /** 主界面始化完成 */
    // MainUIInitEnd,

    private initGame() {
        TaskCollector.I.clear();
        TaskCollector.I.addTaskList(DB_KEY_ENUM.ShowLoginUI, [DB_ID_ENUM.LodgingProto, DB_ID_ENUM.InitRoot], this.onRunGame, this);
        TaskCollector.I.addTaskList(DB_KEY_ENUM.LodgingEnd, [
            DB_ID_ENUM.MapInitEnd,
            DB_ID_ENUM.ConfigInitEnd,
            DB_ID_ENUM.MainUIInitEnd,
        ], this.onStartGame, this);

        GameApp.I.initRunState();
        ResMgr.I.setResUrl(GameApp.I.ResUrl);

        const version = GameApp.I.getGameVersion();
        CCResMD5.ResUrl = GameApp.I.ResDirUrl();
        if (GameApp.I.GameCfgGlobal.Branch === 'release') {
            CCResMD5.ResPaths = GameApp.I.GameCfgGlobal.Res_Root_Url_List;
        }
        CCResMD5.I.LoadResHashFile(GameApp.I.ResMD5Url, version, () => {
            ConfigMgr.I.do();
            this.initRoot();
            // 初始化协议文件
            ProtoManager.I.init();
        });
    }

    private onRunGame() {
        this.showLoginView();
    }

    private onStartGame() {
        this._initEnd = true;
        EventClient.I.emit(E.Game.Start);
        // 信息存在玩家基本信息里，需要玩家基本信息有了才能取到
        AudioMgr.I.init();
        const frameRate = ModelMgr.I.SettingModel.getFrameRate();
        cc.game.setFrameRate(frameRate);
    }

    /**
     * 初始化游戏根节点
     */
    private initRoot() {
        // [6]
        cc.resources.load(UI_PATH_ENUM.Base_Root, cc.Prefab, (err, prefab) => {
            if (err) {
                // 加载失败继续尝试
                this.initRoot();
            } else {
                const panel = cc.instantiate(prefab);
                const canvas = cc.find('Canvas');
                canvas.addChild(panel);
                panel.setSiblingIndex(canvas.children.length - 2);
                // this.initLoginView();
                TaskCollector.I.endTask(DB_KEY_ENUM.ShowLoginUI, DB_ID_ENUM.InitRoot);
            }
        });
    }

    /** 登陆界面 */
    private showLoginView(): void {
        // []
        this.initGameMgr();
        WinMgr.I.open(ViewConst.LoginView);

        // RoleMgr.I.on(this.onAccountId, this);
        // RoleMgr.I.on(RoleAN.N.AccountId, this.onAccountId, this);
        // RoleMgr.I.on(RoleAN.N.ChannelId, this.onAccountId, this);
        // RoleMgr.I.testUpdateAttr([RoleAN.N.AccountId, RoleAN.N.ChannelId], [1, 2]);
    }

    private onAccountId(value: number, old: number) {
        console.log('GameMain onAccountId', value, old);
    }
    private onAccountId2(value: number, old: number) {
        console.log('GameMain onAccountId2', value, old);
    }
    private onAccountId3(value: number, old: number) {
        console.log('GameMain onAccountId3', value, old);
    }

    /** 初始化配置 */
    private initConfig() {
        // []
    }

    /** 初始化游戏数据 */
    private initGameMgr() {
        ControllerMgr.I.do();
    }
}

if (CC_DEV && CC_EDITOR) {
    ResMgr.I.setResUrl(GameApp.I.ResUrl);
}
