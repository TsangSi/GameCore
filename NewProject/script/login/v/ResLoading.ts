/*
 * @Author: hwx
 * @Date: 2022-05-16 14:48:28
 * @Description:
 */

import BaseUiView from '../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../app/core/mvc/WinConst';
import WinMgr from '../../app/core/mvc/WinMgr';
import { ResMgr } from '../../app/core/res/ResMgr';
import GameApp from '../../game/base/GameApp';
import { LayerMgr } from '../../game/base/main/LayerMgr';
import { UI_PATH_ENUM } from '../../game/const/UIPath';
import { ViewConst } from '../../game/const/ViewConst';
import TaskCollector, { DB_ID_ENUM, DB_KEY_ENUM } from '../../game/manager/TaskCollector';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResLoading extends BaseUiView {
    @property(cc.ProgressBar)
    private BarResLoad: cc.ProgressBar = null;

    protected onLoad(): void {
        super.onLoad();
    }

    private addEvent() {
        // TODO
    }

    private delEvent() {
        // TODO
    }

    public init(param: unknown[]): void {
        this.addEvent();
        this.initUI();
    }

    private initUI() {
        // GameApp.I.PlayerPrefab = cc.resources.preload(UI_PATH_ENUM.player, cc.Prefab);

        const list = [
            UI_PATH_ENUM.Base_SceneMap,
            UI_PATH_ENUM.Module_Lobby_LobbyUI,
            UI_PATH_ENUM.Module_Lobby_LobbyUITop,
            UI_PATH_ENUM.Module_Lobby_LobbyUIBottom,
            UI_PATH_ENUM.Module_Lobby_LobbyUILeft,
            UI_PATH_ENUM.Module_Lobby_LobbyUIRight,
        ];
        cc.resources.preload(list, cc.Prefab, (progress, total) => {
            this.BarResLoad.progress = progress / total;
        }, () => {
            /** 刘海偏移高度 */
            LayerMgr.I.notchHeight = cc.sys.isMobile ? 70 : 0; //! 测试数据
            /** 底部偏移高度 */
            LayerMgr.I.bottomHeight = cc.sys.isMobile ? 70 : 0; //! 测试数据

            // 地图
            ResMgr.I.showPrefabAsync(UI_PATH_ENUM.Base_SceneMap).then((node) => {
                LayerMgr.I.addToLayer(GameLayerEnum.MAP_LAYER, node);
                TaskCollector.I.endTask(DB_KEY_ENUM.LodgingEnd, DB_ID_ENUM.MapInitEnd);
            }).catch((err) => {
                console.log(err);
            });

            // 主界面UI
            const lobbyui = ResMgr.I.showPrefabAsync(list[1]);
            // const bottom = ResMgr.I.showPrefabAsync(list[2]);
            // const left = ResMgr.I.showPrefabAsync(list[3]);
            // const right = ResMgr.I.showPrefabAsync(list[4]);
            Promise.all([lobbyui]).then((values) => {
                for (let i = 0; i < values.length; i++) {
                    LayerMgr.I.addToLayer(GameLayerEnum.MAIN_LAYER, values[i]);
                    WinMgr.I.close(ViewConst.ResLoading);
                    WinMgr.I.close(ViewConst.LoginView);
                }
            }).catch((err) => {
                console.log(err);
            });
        });
        ResMgr.I.preload(UI_PATH_ENUM.player, cc.Prefab, true);
        ResMgr.I.preload(UI_PATH_ENUM.WinTab, cc.Prefab, true);
        ResMgr.I.preload(UI_PATH_ENUM.WinTabBtn, cc.Prefab, true);
        ResMgr.I.preload(UI_PATH_ENUM.ActorNickBox, cc.Prefab, true);
        // ResMgr.I.loadAsync(UI_PATH_ENUM.player, cc.Prefab).then((pre: cc.Prefab) => {
        //     GameApp.I.PlayerPrefab = pre;
        // }).catch((err) => {
        //     console.log(err);
        // });
        // ResMgr.I.preload(UI_PATH_ENUM.NetConfirmBox, cc.Prefab, true);
        // ResMgr.I.loadAsync(UI_PATH_ENUM.NetConfirmBox, cc.Prefab).then((pre: cc.Prefab) => {
        //     GameApp.I.NetConfirmBox = pre;
        //     GameApp.I.NetConfirmBox.addRef();
        // }).catch((err) => {
        //     console.log(err);
        // });
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.delEvent();
    }
}
