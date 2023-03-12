/* eslint-disable max-len */
import { EventClient } from '../../../../app/base/event/EventClient';
import { StorageMgr } from '../../../../app/base/manager/StorageMgr';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { ConfigLimitConditionIndexer } from '../../../base/config/indexer/ConfigLimitConditionIndexer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItemList from '../../../base/utils/UtilItemList';
import { BattleCommon } from '../../../battle/BattleCommon';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { EffectMgr } from '../../../manager/EffectMgr';
import ModelMgr from '../../../manager/ModelMgr';
import MapCfg from '../../../map/MapCfg';
import { EBattleType } from '../../battleResult/BattleResultConst';
import { EquipWinTabType } from '../../equip/EquipConst';
import { UtilGameLevel } from '../../gameLevel/UtilGameLevel';
import { MaterialTabId } from '../../material/MaterialConst';
import { RoleMgr } from '../../role/RoleMgr';
import FBExploreTai from '../com/FBExploreTai';
import { EFBExplorePathDir, FBExploreStartPos } from '../FBExploreConst';
import FBExploreModel from '../FBExploreModel';

/*
 * @Author: zs
 * @Date: 2023-02-02 17:09:20
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class FBExploreView extends BaseUiView {
    @property(DynamicImage)
    private SpriteMap: DynamicImage = null;
    @property(cc.Node)
    private NodeTai: cc.Node = null;
    @property(cc.Node)
    private NodePlayer: cc.Node = null;
    @property(cc.Node)
    private NodeMap: cc.Node = null;
    /** 一键挑战 */
    @property(cc.Node)
    private BtnOneKey: cc.Node = null;
    /** 自动挑战 */
    @property(cc.Node)
    private BtnAuto: cc.Node = null;
    @property(cc.Node)
    private LayoutAuto: cc.Node = null;
    /** 功能按钮 */
    @property(cc.Node)
    private BtnFunc: cc.Node = null;
    /** 排行榜 */
    @property(cc.Node)
    private BtnRank: cc.Node = null;
    /** 道具 */
    @property(cc.Node)
    private NodeItem: cc.Node = null;
    /** 已领取 */
    @property(cc.Node)
    private NodeYLQ: cc.Node = null;
    /** 当前难度 */
    @property(cc.Label)
    private LabelDiff: cc.Label = null;
    /** 当前阶段 */
    @property(cc.Label)
    private LabelStage: cc.Label = null;
    /** 重置时间 */
    @property(cc.Label)
    private LabelTime: cc.Label = null;
    private _model: FBExploreModel = null;
    private get model(): FBExploreModel {
        if (!this._model) {
            this._model = ModelMgr.I.FBExploreModel;
        }
        return this._model;
    }
    /** 起始位置 */
    private startPos: cc.Vec2 = cc.v2(-144, 278);
    /** 偏移位置46,617 */
    private offsetPox: cc.Vec2 = cc.v2(190, 339);
    /** 当前关卡的配置 */
    private curFightCfg: Cfg_FB_ExploreGem = null;
    /** 当前挑战的关卡id */
    private curFightStageId: number = 0;
    /** 当前探险类型 */
    private curExploreType: number = 0;
    /** 当前显示的台子索引列表 */
    private showIndexs: number[] = [];
    /** 当前要挑战的台子脚本实例 */
    private curScriptTai: FBExploreTai = null;
    private lastScriptTai: FBExploreTai = null;

    /** 地图块需要的数量 */
    private mapNum: number = 0;
    /** 地图块高度 */
    private oneMapHeight: number = 256;
    protected onLoad(): void {
        super.onLoad();
        this.mapNum = Math.ceil(this.node.height / this.oneMapHeight) + 1;
        this.node.on('PageRefreshEvent', this.onPageRefreshEvent, this);
        this.SpriteMap.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        UtilGame.Click(this.BtnOneKey, this.onBtnOneKey, this);
        UtilGame.Click(this.BtnAuto, this.onBtnAuto, this);
        UtilGame.Click(this.BtnRank, this.onBtnRank, this);
        UtilGame.Click(this.BtnFunc, this.onBtnFunc, this);
        this.SpriteMap.node.on(cc.Node.EventType.POSITION_CHANGED, this.onAutoUpdateTaiActive, this);
        EventClient.I.once(E.BattleResult.SettleCloseView, this.onSettleCloseView, this);
        this.updatePerSecond();
    }

    private onBtnOneKey() {
        ControllerMgr.I.FBExploreController.C2SExploreSweep(this.curExploreType);
    }

    private onBtnAuto() {
        if (this.isAutoFight) {
            this.isAutoFight = false;
            this.stopAuto();
            return;
        }
        if (this.model.isTongGuan(this.curExploreType)) {
            MsgToastMgr.Show(i18n.tt(Lang.fbexplore_max_stage));
            return;
        }
        if (BattleCommon.I.isBattleIng()) {
            return;
        }
        this.doFight();
    }

    private getLimitDesc(langStr: string) {
        const data = Config.Get<ConfigLimitConditionIndexer>(Config.Type.Cfg_LimitCondition).getCondition(this.curFightCfg.Limit);
        if (!data?.state) {
            return UtilString.FormatArgs(i18n.tt(langStr), data.info.Param1);
        } else {
            return '';
        }
    }

    private doFight() {
        if (this.curFightCfg.Limit) {
            const desc = this.getLimitDesc(i18n.tt(Lang.fbexplore_fight_level_tips2));
            if (desc) {
                MsgToastMgr.Show(desc);
                this.isAutoFight = false;
                this.stopAuto();
                return;
            }
        }

        const battleType: EBattleType = ModelMgr.I.FBExploreModel.getBattleType(this.curExploreType);
        if (!BattleCommon.I.isCanEnter(battleType)) {
            return;
        }
        this.isAutoFight = true;
        this.startAuto();
        if (this.isMoving) {
            return;
        }
        this.offEventStage();
        WinMgr.I.setViewStashParam(ViewConst.MaterialWin, [MaterialTabId.FBExplore, this.curExploreType]);
        ModelMgr.I.FBExploreModel.savePreBattleStageId(this.curExploreType);
        ModelMgr.I.FBExploreModel.enterFight(this.curExploreType);
    }

    private onBtnRank() {
        ControllerMgr.I.FBExploreController.showRank(this.curExploreType);
    }

    private onBtnFunc() {
        ControllerMgr.I.StrengthController.linkOpen(EquipWinTabType.GEM);
    }

    /** 拖动地图背景 */
    private onTouchMove(event: cc.Event.EventTouch) {
        const diff: cc.Vec2 = event.getDelta();
        this.updateMapY(diff.y);
    }

    /** 一屏显示的数量 */
    private showNum = 4;
    /** 平均单个的高度 */
    private oneHeight = 0;
    private onAutoUpdateTaiActive() {
        const num = Math.floor(Math.abs(this.SpriteMap.node.position.y + 127) / this.oneHeight);
        this.NodeTai.children.forEach((child, index) => {
            if (num <= index && (num + this.showNum) > index) {
                child.active = true;
            } else {
                child.active = false;
            }
        });

        // 更新地图块
        const mapIndex = Math.floor(Math.abs(this.SpriteMap.node.position.y) / this.oneMapHeight);
        if (this.mapCurShowIndex !== mapIndex) {
            const needDelNum = this.mapCurShowIndex - mapIndex;
            this.mapCurShowIndex = mapIndex;
            for (let i = 0, n = Math.min(needDelNum, this.NodeMap.childrenCount - 1); i < n; i++) {
                const child = this.NodeMap.children[0];
                if (child) {
                    child.destroy();
                    this.NodeMap.removeChild(child);
                }
            }
            for (let i = 0, n = Math.max(this.NodeMap.childrenCount, this.mapNum); i < n; i++) {
                const child = this.NodeMap.children[i] || cc.instantiate(this.NodeMap.children[0]);
                if (child) {
                    child.name = `${this.mapCurShowIndex + i + 1}_1`;
                    const path = `texture/fbExplore/map/1001/${child.name}`;
                    child.getComponent(DynamicImage).loadImage(path, ImageType.JPG, true, undefined, undefined, (spr?: cc.Sprite) => {
                        child.setPosition(0, (this.mapCurShowIndex + i) * this.oneMapHeight + spr.node.height * 0.5);
                    });
                }
                if (!this.NodeMap.children[i]) {
                    this.NodeMap.addChild(child);
                }
            }
        }
    }
    /** 地图当前显示的索引 */
    private mapCurShowIndex: number = -1;
    private updateMapY(addY: number) {
        const x = this.SpriteMap.node.x;
        const y = this.autoMapPosY(addY);
        this.SpriteMap.node.setPosition(x, y);
    }

    private autoMapPosY(addY: number) {
        return Math.max((this.SpriteMap.node.height - this.SpriteMap.node.parent.height) * -1, Math.min(0, this.SpriteMap.node.y + addY));
    }

    /** 切换页签走这里 */
    private onPageRefreshEvent(exploreType: number) {
        if (this.curExploreType > 0) {
            this.offEventStage();
        }
        RoleMgr.I.on(this.onUpdateView, this, ModelMgr.I.FBExploreModel.getCurStageKeyName(exploreType));
        this.curExploreType = exploreType;
        this.updateView();
    }

    private offEventStage() {
        RoleMgr.I.off(this.onUpdateView, this, ModelMgr.I.FBExploreModel.getCurStageKeyName(this.curExploreType));
    }

    private onUpdateView() {
        EffectMgr.PlayCocosAnim('animPrefab/ui/ty_changjingqiehuan/anim/ty_changjingqiehuan', this.node);
        this.updateView();
    }
    /** 是否自动战斗中 */
    private isAutoFight: boolean = false;
    private updateView() {
        const preBattleId = ModelMgr.I.FBExploreModel.getPreBattleStageId(this.curExploreType);
        const curFightStageId = this.model.getCurStageId(this.curExploreType) + 1;
        const preCfg = this.model.getCfg(this.curExploreType, preBattleId);
        const curFightCfg = this.model.getCfg(this.curExploreType, curFightStageId);
        if (this.model.isTongGuan(this.curExploreType)) {
            // 已通关
            this.isAutoFight = false;
            this.updateShow(curFightStageId - 1);
        } else if (curFightCfg.Level > preCfg.Level || curFightCfg.Part > preCfg.Part) {
            this.isAutoFight = true;
            const curFightStageId = this.model.getCurStageId(this.curExploreType) + 1;
            this.updateShow(curFightStageId);
            this.unschedule(this.autoFight);
            this.isNeedChangeBigPart = true;
        } else if (curFightStageId > preBattleId) {
            this.isAutoFight = true;
            this.updateShow(preBattleId);
        } else {
            this.isAutoFight = false;
            this.updateShow(curFightStageId);
        }
    }

    /** 自动战斗 */
    private autoFight() {
        if (this.isAutoFight) {
            this.scheduleOnce(() => {
                if (this.isAutoFight) {
                    this.doFight();
                }
            }, 1);
        }
    }
    /**
     * 阶段变更
     */
    private updateShow(stageId: number) {
        this.updatStage(stageId);

        if (this.isAutoFight) {
            this.startAuto();
        } else {
            this.stopAuto();
        }
        this.showTai();
        const indexs: number[] = this.model.cfgFBGemStage.getValueByKey(this.curFightCfg.Level);
        if (indexs.length > 0) {
            const cfg: Cfg_FB_ExploreGemStage = this.model.cfgFBGemStage.getValueByIndex(indexs[indexs.length - 1]);
            if (cfg) {
                UtilItemList.ShowItems(this.NodeItem, cfg.ShowPartPrize.split('|')[0], { option: { needName: true, needNum: true } });
            }
        }
        this.NodeYLQ.active = this.model.getMaxStageId(this.curExploreType) >= this.model.getCfgMaxStageId(this.curExploreType);
    }

    /** 是否移动中 */
    private isMoving: boolean = false;
    /** 关卡变更 */
    private changeStage(stageId: number) {
        if (this.curScriptTai?.node?.isValid) {
            this.curScriptTai.delFightEffect();
            this.isMoving = true;
            this.updatStage(stageId);
            this.showIndexs.forEach((index, idx) => {
                this.updateTaiOther(index, this.NodeTai.children[idx], this.getDir(idx, idx === this.showIndexs.length - 1));
            });
            this.scheduleOnce(() => {
                const allTime = this.playerRun(this.NodePlayer, () => {
                    this.showIndexs.forEach((index, idx) => {
                        this.updateTai(index, this.NodeTai.children[idx], this.getDir(idx, idx === this.showIndexs.length - 1));
                    });
                    if (this.isAutoFight) {
                        this.startAuto();
                    } else {
                        this.stopAuto();
                    }
                    this.autoFight();
                    this.isMoving = false;
                }, this);
                const y = this.autoMapPosY(-1 * this.curScriptTai.node.height);
                cc.tween(this.SpriteMap.node).to(allTime, { position: cc.v3(this.SpriteMap.node.x, y) }).start();
            }, 0.1);
        }
    }

    /** 更新关卡 */
    private updatStage(stageId: number) {
        this.curFightStageId = stageId;
        this.curFightCfg = this.model.getCfg(this.curExploreType, stageId);
        this.updateLabel();
        if (this.model.getCurStageId(this.curExploreType) >= this.model.getMaxStageId(this.curExploreType)) {
            this.BtnOneKey.active = false;
            this.BtnAuto.active = true;
            if (this.model.isTongGuan(this.curExploreType)) {
                UtilCocos.SetString(this.BtnAuto, 'Label', i18n.tt(Lang.fbexplore_max_stage));
            }
        } else {
            this.BtnOneKey.active = true;
            this.BtnAuto.active = false;

            const time = StorageMgr.I.getValue(`FBExploreShowReset${this.curExploreType}`);
            const time24 = UtilTime.GetTodySometime(24);
            if (time !== time24) {
                WinMgr.I.open(ViewConst.FBExploreReset, this.curExploreType);
                StorageMgr.I.setValue(`FBExploreShowReset${this.curExploreType}`, time24);
            }
            // 重置需要把地图移回原位置
            this.SpriteMap.node.setPosition(0, 0);
        }
    }

    private autoActions: cc.Tween<cc.Node>[] = [];
    /** 开始自动战斗中 */
    private startAuto() {
        UtilCocos.SetActive(this.BtnAuto, 'Label', false);
        this.LayoutAuto.active = true;

        const scale = 1;
        const ss = 2;
        const time = 0.4;
        this.autoActions.forEach((t) => {
            t.stop();
        });
        this.autoActions.length = 0;
        this.LayoutAuto.children[0].scale = 1;
        this.LayoutAuto.children[1].scale = 1;
        this.LayoutAuto.children[2].scale = 1;
        const a1 = cc.tween(this.LayoutAuto.children[0]).repeatForever(cc.tween().to(time, { scale: ss }).to(time, { scale }).delay(time * 4)).start();
        const a2 = cc.tween(this.LayoutAuto.children[1]).repeatForever(cc.tween().delay(time * 2).to(time, { scale: ss }).to(time, { scale })
            .delay(time * 2)).start();
        const a3 = cc.tween(this.LayoutAuto.children[2]).repeatForever(cc.tween().delay(time * 4).to(time, { scale: ss }).to(time, { scale })).start();
        this.autoActions.push(a1, a2, a3);
    }

    /** 停止自动战斗中 */
    private stopAuto() {
        this.autoActions.forEach((t) => {
            t.stop();
        });
        this.autoActions.length = 0;
        this.LayoutAuto.children[0].scale = 1;
        this.LayoutAuto.children[1].scale = 1;
        this.LayoutAuto.children[2].scale = 1;
        UtilCocos.SetActive(this.BtnAuto, 'Label', true);
        this.LayoutAuto.active = false;
        if (this.curFightCfg.Limit) {
            const desc = this.getLimitDesc(i18n.tt(Lang.fbexplore_fight_level_tips1));
            if (desc) {
                UtilCocos.SetString(this.BtnAuto, 'Label', desc);
                UtilCocos.SetSpriteGray(this.BtnAuto, true, true);
            } else {
                UtilCocos.SetString(this.BtnAuto, 'Label', i18n.tt(Lang.com_text_zidongtiaozhan));
                UtilCocos.SetSpriteGray(this.BtnAuto, false, true);
            }
        }
    }

    /** 更新文本 */
    private updateLabel() {
        this.LabelDiff.string = `${this.curFightCfg.Level}${i18n.tt(Lang.equip_lev)}`;
        this.LabelStage.string = `阶段${UtilNum.ToChinese(this.curFightCfg.Part)}`;
    }

    /** 更新显示台子 */
    private showTai() {
        ResMgr.I.loadLocal(UI_PATH_ENUM.FBExploreTai, cc.Prefab, this.loadTaiResult, { target: this });
    }

    /** 加载台子预制体结果 */
    private loadTaiResult(e, p: cc.Prefab): void {
        if (e || !this.NodeTai?.isValid) { return; }
        this.NodeTai.destroyAllChildren();
        this.NodeTai.removeAllChildren();
        this.showIndexs = this.model.cfgFBGem.getValueByKey(this.curExploreType, this.curFightCfg.Level, this.curFightCfg.Part);
        const length = this.showIndexs.length;
        this.showIndexs.forEach((index, idx) => {
            const node = cc.instantiate(p);
            this.NodeTai.addChild(node);
            const cfg: Cfg_FB_ExploreGem = this.model.cfgFBGem.getValueByIndex(index);
            const s = node.getComponent(FBExploreTai);
            node.setPosition(this.getPos(idx));
            s.setData(cfg);
            this.updateTai(index, node, this.getDir(idx, idx === length - 1));
        });

        this.oneHeight = this.SpriteMap.node.height / length;

        const size = cc.view.getVisibleSize();
        this.showNum = Math.floor(size.height / this.NodeTai.children[0].height);
        const preBattleId = ModelMgr.I.FBExploreModel.getPreBattleStageId(this.curExploreType);
        const stageId = this.model.getCurStageId(this.curExploreType);
        if (this.curScriptTai?.node?.isValid) {
            this.updateMapY(-1 * (this.curScriptTai.node.y - this.curScriptTai.node.height));
        }
        if ((stageId + 1) > preBattleId && !this.model.isTongGuan(this.curExploreType)) {
            this.isNeedChangeNew = !this._isNeedChangeBigPart;
        }
        ModelMgr.I.FBExploreModel.clearPreBattleStageId();
        this.onAutoUpdateTaiActive();
    }

    private _isNeedChangeBigPart: boolean = false;
    private set isNeedChangeBigPart(b: boolean) {
        this._isNeedChangeBigPart = b;
        if (this._isNeedChangeBigPart && this._isSettleCloseView) {
            ModelMgr.I.FBExploreModel.clearPreBattleStageId();
            // 播放转场动画
            EffectMgr.PlayCocosAnim('animPrefab/ui/ty_changjingqiehuan/anim/ty_changjingqiehuan', this.node);
            this.scheduleOnce(this.autoFight, 1);
        }
    }

    private _isNeedChangeNew: boolean = false;
    private set isNeedChangeNew(b: boolean) {
        this._isNeedChangeNew = b;
        if (this._isNeedChangeNew && this._isSettleCloseView) {
            this.changeStage(this.model.getCurStageId(this.curExploreType) + 1);
        }
    }

    private _isSettleCloseView: boolean = false;
    private set isSettleCloseView(b: boolean) {
        this._isSettleCloseView = b;
        if (this._isNeedChangeNew && this._isSettleCloseView) {
            this.changeStage(this.model.getCurStageId(this.curExploreType) + 1);
        } else if (this._isNeedChangeBigPart && this._isSettleCloseView) {
            ModelMgr.I.FBExploreModel.clearPreBattleStageId();
            // 播放转场动画
            EffectMgr.PlayCocosAnim('animPrefab/ui/ty_changjingqiehuan/anim/ty_changjingqiehuan', this.node);
            this.scheduleOnce(this.autoFight, 1);
        }
    }

    private onSettleCloseView() {
        this.isSettleCloseView = true;
    }

    /**
     * 只更新台子其他东西，不更新路径（路径要通过走路）
     * @param index 配置表的索引
     * @param node 节点
     * @param dir 方向
     */
    private updateTaiOther(index: number, node: cc.Node, dir: EFBExplorePathDir) {
        const s = node.getComponent(FBExploreTai);
        s.updateOther(this.curFightStageId);
    }

    /**
     * 更新台子
     * @param index 配置表的索引
     * @param node 节点
     * @param dir 方向
     */
    private updateTai(index: number, node: cc.Node, dir: EFBExplorePathDir) {
        const cfg: Cfg_FB_ExploreGem = this.model.cfgFBGem.getValueByIndex(index);
        const s = node.getComponent(FBExploreTai);
        let stageId = this.curFightStageId;
        if (this.model.isTongGuan(this.curExploreType)) {
            if (stageId === cfg.Id) {
                this.lastScriptTai = this.curScriptTai;
                this.curScriptTai = s;
            }
            stageId += 1;
        }
        s.updatePath(dir, stageId);
        s.updateOther(stageId);
        if (stageId === cfg.Id) {
            this.updatePlayerQ(node);
            this.lastScriptTai = this.curScriptTai;
            this.curScriptTai = s;
        }
    }

    /** 更新玩家Q版资源 */
    private updatePlayerQ(node: cc.Node) {
        if (this.NodePlayer.childrenCount <= 0) {
            this.NodePlayer.addChild(UtilGameLevel.CreatePlayerQ());
            this.NodePlayer.setPosition(cc.v2(200, 200));
        }
        const pos = this.getConverPos(this.NodePlayer, node, FBExploreStartPos);
        this.NodePlayer.setPosition(pos);
    }

    protected updatePerSecond(): void {
        this.LabelTime.string = UtilTime.FormatHourDetail(Math.floor(UtilTime.GetTodayRemainTime() / 1000));
    }

    private getPos(idx: number) {
        let x = this.startPos.x;
        const y = this.startPos.y + this.offsetPox.y * idx;
        if (idx % 2 === 0) {
            x = this.startPos.x;
        } else {
            x = this.startPos.x + this.offsetPox.x;
        }
        return cc.v2(x, y);
    }

    private getDir(idx: number, isLastOne?: boolean) {
        let dir: EFBExplorePathDir;
        if (idx % 2 === 0) {
            dir = EFBExplorePathDir.Right;
        } else {
            dir = EFBExplorePathDir.Left;
        }
        if (isLastOne) {
            dir = EFBExplorePathDir.Empty;
        }
        return dir;
    }

    /**
     * 目标节点的位置转换成当前节点的位置
     * @param node 当前节点
     * @param targetNode 目标节点
     * @param targetOffsetPos 目标位置的偏移位置
     * @returns
     */
    private getConverPos(node: cc.Node, targetNode: cc.Node, nodePos: cc.Vec2 | cc.Vec3 = cc.v3(0, 0, 0)) {
        const p = targetNode.convertToWorldSpaceAR(nodePos);
        return node.parent.convertToNodeSpaceAR(p);
    }

    /**
     * 执行行走动作，返回总时间
     * @param callback 执行动作的回调
     * @param target
     * @returns
     */
    public playerRun(node: cc.Node, callback: () => void, target?: object): number {
        let norTime = 1;
        const oneTime = norTime / 56;
        let allTime = 0;
        const scripTai: FBExploreTai = this.curScriptTai;
        if (node && node.isValid) {
            const tweens: cc.Tween<cc.Node>[] = [];
            const nodePath = scripTai.getNodePath();
            if (nodePath.childrenCount > 0) {
                // scripTai.updatePathLight(0, true);
                let pos: cc.Vec2 | cc.Vec3;
                let newPos: cc.Vec2 | cc.Vec3;
                // 人已经站在第二个点的位置了，所以直接
                const startIndex = scripTai.getStartMovePathIndex();
                for (let i = startIndex; i < nodePath.childrenCount; i++) {
                    if (i === startIndex) {
                        pos = FBExploreStartPos;
                    } else {
                        pos = nodePath.children[i - 1].position;
                    }
                    newPos = nodePath.children[i].position;
                    const dir = pos.x > newPos.x ? -1 : 1;
                    const d1 = cc.Vec2.distance(newPos, pos);
                    norTime = d1 * oneTime;

                    allTime += norTime;
                    pos = this.getConverPos(node, nodePath.children[i]);
                    tweens.push(cc.tween().call(() => {
                        UtilGameLevel.updateState(node.children[0], 1, dir);
                    }, this));
                    tweens.push(cc.tween().to(norTime, { position: cc.v3(pos.x, pos.y) }));
                    tweens.push(cc.tween().call(() => {
                        if (i === startIndex) {
                            scripTai.updatePathLight(0, true);
                        }
                        scripTai.updatePathLight(i, true);
                    }, this));
                }
                const lastPos1 = nodePath.children[nodePath.childrenCount - 1].position;
                const d2 = cc.Vec2.distance(lastPos1, cc.v3(scripTai.curShowPathEx.x, scripTai.curShowPathEx.y));
                const time = d2 * oneTime;
                allTime += time;
                const dir = lastPos1.x > scripTai.curShowPathEx.x ? -1 : 1;
                tweens.push(cc.tween().call(() => {
                    UtilGameLevel.updateState(node.children[0], 1, dir);
                }, this));
                // eslint-disable-next-line max-len
                tweens.push(cc.tween().by(time, { position: cc.v3(scripTai.curShowPathEx.x - lastPos1.x, scripTai.curShowPathEx.y - lastPos1.y) }));
                tweens.push(cc.tween().call(() => {
                    UtilGameLevel.updateState(node.children[0], 0, -1);
                }, this));
                tweens.push(cc.tween().call(callback, target));
                cc.tween(node).sequence(tweens.shift(), ...tweens).start();
            }
        }
        return allTime;
    }
    protected onDestroy(): void {
        this.offEventStage();
        EventClient.I.off(E.BattleResult.SettleCloseView, this.onSettleCloseView, this);
    }
}
