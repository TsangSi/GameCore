/* eslint-disable max-len */
/*
 * @Author: zs
 * @Date: 2022-08-26 18:18:39
 * @FilePath: \SanGuo2.4\assets\script\game\module\lobby\v\LobbyUI.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilBool } from '../../../../app/base/utils/UtilBool';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { Config } from '../../../base/config/Config';
import GameApp from '../../../base/GameApp';
import { LayerMgr } from '../../../base/main/LayerMgr';
import UtilFly from '../../../base/utils/UtilFly';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import TaskCollector, { DB_ID_ENUM, DB_KEY_ENUM } from '../../../manager/TaskCollector';
import MapCfg, { EMapFbInstanceType, MapType } from '../../../map/MapCfg';
import SceneMap from '../../../map/SceneMap';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { ELobbyViewType, ENodeType } from '../LobbyConst';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';

const { ccclass, property } = cc._decorator;

@ccclass
export class LobbyUI extends BaseCmp {
    @property(cc.Node) /** 副本ui */
    private UIFuBen: cc.Node = null;
    private UINodes: cc.Node[] = [];/** 方向的节点列表 */
    private get UITop(): cc.Node { /** UITop */
        return this.UINodes[ENodeType.Top];
    }
    private get UIBottom(): cc.Node { /** UIBottom */
        return this.UINodes[ENodeType.Bottom];
    }
    private get UILeft(): cc.Node {
        return this.UINodes[ENodeType.Left];
    }
    private get UIRight(): cc.Node {
        return this.UINodes[ENodeType.Right];
    }
    private get UIEasy(): cc.Node {
        return this.UINodes[ENodeType.Easy];
    }
    private lobbyLength: number = 0;/** lobby数量 */
    /** 等待删除列表 */
    private waitDelNodes: { [fbType: number]: cc.Node } = cc.js.createMap(true);
    /** 等待删除列表的开关 */
    private waitDelOnOff: boolean = false;
    /** 存储的副本节点Node  */
    public UIFBNodes: { [fbType: number]: cc.Node; } = cc.js.createMap(true);
    /** 当前副本类型 */
    private curFbType: EMapFbInstanceType = EMapFbInstanceType.YeWai;
    protected onLoad(): void {
        this.loadUIPrefab();
        this.addE();
        const _welcome = RoleMgr.I.d.Welcome;

        if (_welcome === 0) { // 创角欢迎
            this.openWelcome();
        }
        // // 防沉迷备用的先不开
        // if (RoleMgr.I.d.RealNameRealAuth === 0) {
        //     return;
        //     const model = ModelMgr.I.LoginModel;
        //     WinMgr.I.open(ViewConst.RealNameWin, model.UserName, model.UserPass, model.sdktype, model.channel_id);
        // }
    }

    protected start(): void {
        EventClient.I.emit(E.Lobby.FirstShow);
        // this.onFuncOpen();
    }

    private addE() {
        EventClient.I.on(E.Game.Start, this.loadEasy, this);
        EventClient.I.on(E.Battle.Start, this.onBattleStart, this);
        EventClient.I.on(E.Battle.End, this.onBattleEnd, this);
        EventClient.I.on(E.Map.ChangeMapStart, this.onChangeMap, this);
        EventClient.I.on(E.Map.ChangeMapEnd, this.onChangeMap, this);
        EventClient.I.on(E.Lobby.ChangeViewType, this.onChangeViewType, this);
        EventClient.I.on(E.OnHook.FlyCoinExp, this.flyCoinExp, this);
        EventClient.I.on(E.BattleResult.CloseView, this.checkFunOpenUI, this);
        RoleMgr.I.on(this.welcomeNewPlayer, this, RoleAN.N.Welcome);
    }

    private remE() {
        EventClient.I.off(E.Game.Start, this.loadEasy, this);
        EventClient.I.off(E.Battle.Start, this.onBattleStart, this);
        EventClient.I.off(E.Battle.End, this.onBattleEnd, this);
        EventClient.I.off(E.Map.ChangeMapStart, this.onChangeMap, this);
        EventClient.I.off(E.Map.ChangeMapEnd, this.onChangeMap, this);
        EventClient.I.off(E.Lobby.ChangeViewType, this.onChangeViewType, this);
        EventClient.I.off(E.OnHook.FlyCoinExp, this.flyCoinExp, this);
        EventClient.I.off(E.BattleResult.CloseView, this.checkFunOpenUI, this);
        RoleMgr.I.off(this.welcomeNewPlayer, this, RoleAN.N.Welcome);
    }

    private loadUIPrefab() {
        const list = [
            UI_PATH_ENUM.Module_Lobby_LobbyUITop,
            UI_PATH_ENUM.Module_Lobby_LobbyUIBottom,
            UI_PATH_ENUM.Module_Lobby_LobbyUILeft,
            UI_PATH_ENUM.Module_Lobby_LobbyUIRight,
        ];
        this.lobbyLength = list.length;
        // 主界面UI
        const top = ResMgr.I.showPrefabAsync(list[0]);
        const bottom = ResMgr.I.showPrefabAsync(list[1]);
        const left = ResMgr.I.showPrefabAsync(list[2]);
        const right = ResMgr.I.showPrefabAsync(list[3]);
        Promise.all([top, bottom, left, right]).then((values) => {
            for (let i = 0; i < values.length; i++) {
                this.addChild(values[i], i);
                this.UINodes[i] = values[i];
            }
            TaskCollector.I.endTask(DB_KEY_ENUM.LodgingEnd, DB_ID_ENUM.MainUIInitEnd);
        }).catch((err) => {
            console.log(err);
        });
    }

    private addChild(node: cc.Node, zIndex?: number) {
        this.node.addChild(node);
        if (!UtilBool.isNullOrUndefined(zIndex)) {
            node.setSiblingIndex(zIndex);
        }
    }

    /** 功能预告 */
    // private onFuncOpen() {
    //     const newFuncIds: number[] = UtilFunOpen.GetNewFuncIds();
    //     // 待补充
    // }

    private flyCoinExp() {
        const topPos = this.UITop.position;
        const coinPos = this.UITop.getChildByName('NdCurrencyBar').position;
        const bottomPos = this.UIBottom.position;
        const barPos = this.UIBottom.getChildByName('BarPlayerExp').position;
        UtilFly.flyOnHookAward(
            this.node,
            new cc.Vec2(topPos.x + coinPos.x - 102, topPos.y + coinPos.y),
            new cc.Vec2(bottomPos.x + barPos.x, bottomPos.y + barPos.y),
        );
    }

    /** 加载LobbyEasy，加载完之后移除监听 */
    private loadEasy() {
        if (!this.UIEasy) {
            ResMgr.I.loadLocal(UI_PATH_ENUM.LobbyEasy, cc.Prefab, (err, p: cc.Prefab) => {
                if (err) return;
                if (!this.UIEasy && p) {
                    const nd = cc.instantiate(p);
                    this.addChild(nd, this.lobbyLength);
                    this.UINodes[ENodeType.Easy] = nd;
                }
            });
        }
    }

    /** 设置主界面的ui显示or隐藏 */
    private setLobbyUIActive(active: boolean) {
        this.UINodes.forEach((node, index) => {
            if (index === ENodeType.Top) {
                // this.setFuncBtnActive(active);
            } else if (index === ENodeType.Bottom) {
                this.setBottomSuctionGoldActive(active);
            } else {
                node.active = active;
            }
        });
    }

    /** 设置下方吸金显示or隐藏 */
    private setBottomSuctionGoldActive(active: boolean) {
        if (active) {
            EventClient.I.emit(E.Lobby.BootomSuctionGoldShow);
        } else {
            EventClient.I.emit(E.Lobby.BootomSuctionGoldHide);
        }
    }

    /** 设置上方功能按钮显示or隐藏 */
    private setFuncBtnActive(active: boolean) {
        if (active) {
            EventClient.I.emit(E.Lobby.TopFuncBtnShow);
        } else {
            EventClient.I.emit(E.Lobby.TopFuncBtnHide);
        }
    }

    private onChangeViewType(type: ELobbyViewType) {
        switch (type) {
            case ELobbyViewType.YeWai:
                this.onCloseMainCity();
                break;
            default:
                this.onShowMainCity();
                break;
        }
    }

    /** 主城界面显示的事件 */
    private onShowMainCity() {
        this.setBottomSuctionGoldActive(false);// 隐藏下发的吸金
        const node = this.UIFBNodes[this.curFbType];
        if (node) {
            node.active = false;
        }
    }

    /** 主城界面关闭的事件 */
    private onCloseMainCity() {
        if (!GameApp.I.IsBattleIng) {
            this.setBottomSuctionGoldActive(true);// 显示下发的吸金
            if (SceneMap.I.mapId) {
                this.checkMap(SceneMap.I.mapId);
            }
        }
    }

    /** 战斗开始 */
    private onBattleStart() {
        this.setLobbyUIActive(false);
        this.setFuncBtnActive(false);
        this.UIFuBen.active = false;
    }

    /** 战斗结束 */
    private onBattleEnd() {
        this.UIFuBen.active = true;
        if (SceneMap.I.mapId) {
            this.checkMap(SceneMap.I.mapId);
        }
    }

    /** 切换地图 */
    private onChangeMap(mapId: number) {
        if (!mapId || GameApp.I.IsBattleIng) { return; }
        this.checkMap(mapId);
    }

    private checkMap(mapId: number): void {
        const cfgMap: Cfg_Map = Config.Get(Config.Type.Cfg_Map).getValueByKey(mapId);
        if (!cfgMap) {
            return;
        }

        if (cfgMap.MapType === MapType.WBosType) {
            // 野外
            this.setLobbyUIActive(true);
            this.setFuncBtnActive(true);
        } else {
            // 副本
            this.setLobbyUIActive(false);
        }
        this.changeUI(cfgMap.InstanceType);
    }

    /** 切换UI，主界面UI/副本UI */
    private changeUI(fbType: EMapFbInstanceType): void {
        // console.log('----changeUI------->', fbType);
        if (EMapFbInstanceType.YeWai === fbType) {
            this.removeAllFB();
            return;
        }
        if (this.curFbType !== fbType) {
            /** 关闭上一次副本UI */
            this.removeFB(this.curFbType);
            /** 保存当前要显示的副本类型 */
            this.curFbType = fbType;
        }
        const fbNode = this.UIFBNodes[fbType] || this.waitDelNodes[fbType];
        if (!fbNode) {
            ResMgr.I.showPrefabOnce(UI_PATH_ENUM[`FuBen_${fbType}`], this.UIFuBen, this.loadFbCallback, { target: this, customData: fbType });
        } else {
            this.addFB(fbType, fbNode);
        }
    }

    /** 监听关闭了结算，检查：非战斗&&在野外，弹出新功能开启 */
    private checkFunOpenUI() {
        // console.log('----非战斗&&在野外，弹出新功能开启', GameApp.I.IsBattleIng, MapCfg.I.isYeWai);
        if (!GameApp.I.IsBattleIng && MapCfg.I.isYeWai) {
            UtilFunOpen.checkOpenFuncPreview();
        }
    }

    private removeAllFB(): void {
        for (const fbType in this.UIFBNodes) {
            this.removeFB(+fbType);
        }
    }

    /** 删除单个副本 */
    private removeFB(fbType: EMapFbInstanceType) {
        const node = this.UIFBNodes[fbType];
        if (!node) { return; }
        if (this.waitDelOnOff) {
            node.parent = null;
            this.waitDelNodes[fbType] = node;
        } else {
            node.destroy();
        }
        delete this.UIFBNodes[fbType];
    }

    /** 添加单个副本 */
    private addFB(fbType: EMapFbInstanceType, node: cc.Node) {
        this.UIFBNodes[fbType] = node;
        if (!node.parent) {
            this.UIFuBen.addChild(node);
        }
        if (!node.active) {
            node.active = true;
        }
        if (this.waitDelNodes[fbType]) {
            delete this.waitDelNodes[fbType];
        }
    }

    /** 加载副本ui的回调 */
    private loadFbCallback(err, node: cc.Node, fbType: EMapFbInstanceType): boolean {
        if (err || this.curFbType !== fbType) {
            // 加载回来的时候已经切换到别的副本类型了
            return node?.destroy();
        }
        this.addFB(fbType, node);
        return true;
    }

    /** 新手欢迎界面 */
    private welcomeNewPlayer(): void {
        // 暂时没用
    }

    private openWelcome(): void {
        ResMgr.I.showPrefabAsync(UI_PATH_ENUM.Module_Lobby_LobbyNewPlayer).then((_node) => {
            // this.addChild(_node);
            // 离歌大谱，只有警告层比新手快速装备的高了
            LayerMgr.I.addToLayer(GameLayerEnum.TIPS_LAYER, _node);
        }).catch((err) => {
            console.log(err);
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
        for (const fbType in this.waitDelNodes) {
            this.waitDelNodes[fbType].destroy();
        }
        this.waitDelNodes = cc.js.createMap(true);
    }
}
