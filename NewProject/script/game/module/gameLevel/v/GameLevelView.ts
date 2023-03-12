/*
 * @Author: myl
 * @Date: 2022-09-14 20:55:16
 * @Description:
 */

/**
 * 关卡设计思路(地板层 与 对象层 效果层分离)
 * 1，地板层 处理地图块资源加载(需要处理地图块和区域的关联性)
 * 2，对象层 处理关卡内容（包括关卡的相关内容）
 * 3，效果层 处理迷雾特效(新版优化 迷雾云朵层与scroll同级处理缩放不同)
 * 4，UI层 处理UI显示内容(UI层 放置到page处理)
 * 5, 增加小地图层 和 最新的城层（地图与城分离）
 */
/**
 * 使用scrollview当容器
 * 1，优点：1,1滑动流畅(需要注意滑动区域控制，当前区域如果不需要显示则滑动不到)，1,2，按需滑动
 * 2，缺点：content只能有一个 不能多层级处理
 */

import { ResMgr } from '../../../../app/core/res/ResMgr';
import { ACTION_TYPE } from '../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { ConfigStageIndexer } from '../../../base/config/indexer/ConfigStageIndexer';
import { ActionType } from '../../../battle/WarConst';
import { RES_ENUM } from '../../../const/ResPath';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { EntityMonster } from '../../../entity/EntityMonster';
import { EntityRole } from '../../../entity/EntityRole';
import ModelMgr from '../../../manager/ModelMgr';
import MapCfg from '../../../map/MapCfg';
import { RoleMgr } from '../../role/RoleMgr';
import {
    GameLevelInfoModel, GameLevelPageState, MapLevelScale, MapOffsetX, MapOffsetY,
} from '../GameLevelConst';
import { GameLevelMapRate, ILevelMapConf, UtilGameLevel } from '../UtilGameLevel';
import { GameLevelItem } from './GameLevelItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class GameLevelView extends cc.Component {
    @property(cc.ScrollView)
    private scrollView: cc.ScrollView = null;

    @property(cc.Node)
    private Content: cc.Node = null;
    @property(cc.Node)
    private NdMapTiled: cc.Node = null;
    @property(cc.Node)
    private NdLevel: cc.Node = null;
    @property(cc.Node)
    private NdCloud: cc.Node = null;
    @property(cc.Node)
    private NdPlayer: cc.Node = null;
    @property(cc.Node)
    private NdMonster: cc.Node = null;
    @property(cc.Node)
    private NdCity: cc.Node = null;
    @property(DynamicImage)
    private miniMap: DynamicImage = null;

    private _arenaInfo: string[] = [];

    /** 整个地图的宽度和高度 */
    private _mapSize: cc.Size = new cc.Size(0, 0);

    public set mapSize(v: cc.Size) {
        this._mapSize = v;
        // 设置当前内容节点的大小
        this.Content.setContentSize(v);
    }

    public get mapSize(): cc.Size {
        return this._mapSize;
    }

    private tiledSize: cc.Size = cc.size(400, 400);
    // 地图块xy方向的数量
    private mapXNum: number = 5;
    private mapYNum: number = 5;

    /** 地图块 */
    private mapPool: { [name: string]: cc.Node } = {};
    /** 关卡节点 */
    // private levelPool: cc.NodePool = new cc.NodePool();
    /** 云朵特效 */
    private cloudPool: Map<number, cc.Node> = new Map();

    /** 所需预制体是否加载完成 */
    private _prefabsIsLoaded: boolean = false;

    /** 关卡预制体 */
    private _levelPrefab: cc.Prefab = null;
    private _mapPath: number = 0;

    /** 处理加载所需预制体 */
    private loadPrefabs(cb: () => void) {
        const path = UI_PATH_ENUM.Module_GameLevel;
        ResMgr.I.loadLocal([`${path}GameLevelItem`], cc.Prefab, (err, prefabs: cc.Prefab[]) => {
            if (err) {
                console.error('预制体加载出错', err.message);
            } else {
                this._levelPrefab = prefabs[0];
                if (cb) { cb(); }
            }
        });
    }

    /** 偏移量 */
    private _clipOffsetY: number = 0;
    private _levelsPos: { x: number, y: number }[] = [];
    /** 配置地图属性 */
    public setMapResConfig(conf: ILevelMapConf): void {
        conf.tileSize = conf.tileSize || cc.size(400, 400);
        const resPath = conf.id;
        this._mapPath = resPath;
        // 地图大小
        this.mapSize = conf.size;
        // 地图块大小
        this.tiledSize = conf.tileSize ? conf.tileSize : cc.size(400, 400);
        // 地图块数量
        this.mapXNum = Math.ceil(this.mapSize.width / this.tiledSize.width);
        this.mapYNum = Math.ceil(this.mapSize.height / this.tiledSize.height);

        this._clipOffsetY = conf.tileSize.height % this.tiledSize.height;

        // const levCfg = UtilGameLevel.MapConfig();
        // for (let i = 0; i < levCfg.length; i++) {
        //     const levConf = levCfg[i];
        //     let pos = levConf.nameInfo.Position.split(',');
        //     if (pos.length < 2) {
        //         pos = ['0', '0'];
        //     }
        //     const poss = { x: parseInt(pos[0]) * GameLevelMapRate, y: -parseInt(pos[1]) * GameLevelMapRate + this._clipOffsetY };
        //     this._levelsPos.push(poss);
        // }
        // 开始加载地图数据
        this.loadPrefabs(() => {
            if (!this._prefabsIsLoaded) {
                this._prefabsIsLoaded = true;
                this.setUpMap(resPath);
                this.setLevelConfig();
            }
        });
        this.loadMiniMap(conf);
    }

    /** 加载小地图 */
    private loadMiniMap(conf: ILevelMapConf) {
        const path = `map/map_${conf.id}`;
        this.miniMap.loadImage(path, 2, true, '', false, () => {
            this.miniMap.node.width = conf.size.width;
            this.miniMap.node.height = conf.size.height;
        });
    }

    /** 设置关卡内的其他数据（云多层 人物层）
    * arena : 区域
    * chapter ： 章节
   */
    public setupMapRoleData(state: GameLevelPageState = GameLevelPageState.Default, arena: number = -1, chapter: number = -1): void {
        switch (state) {
            // case GameLevelPageState.NewArena: // 解锁新区域
            case GameLevelPageState.NewChapter: // 解锁新章节
                {
                    const areaId = UtilGameLevel.StageArena();
                    this._arenaInfo = UtilGameLevel.getAreaById(areaId).AreaPos.split(',');
                    this.scrollNew();
                }
                break;
            default: {
                // 设置玩家数据
                const areaId = UtilGameLevel.StageArena();
                this._arenaInfo = UtilGameLevel.getAreaById(areaId).AreaPos.split(',');
                // 添加人物
                this.addPlayer();
                // 添加怪物
                this.addMonster();
                // 设置朝向 （怪物朝向与城池相同 在添加时已经设置）
                this.playerMonsterDirection();
                this.scrollNew();
                break;
            }
        }
    }

    private scrollNew(t: number = 0.1) {
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        // 最新关卡
        const newStage = indexer.getChapterInfo();
        this.autoScroll(newStage.chapter, t);
    }

    private addGameLevelItem(levConf: GameLevelInfoModel) {
        if (!levConf) {
            return;
        }
        // 城池
        const posCity = levConf.nameInfo.CityPos.split(',');
        const cityPicNd = new cc.Node();
        const dyImg = cityPicNd.addComponent(DynamicImage);
        cityPicNd.setPosition(parseInt(posCity[1]) * GameLevelMapRate, -parseInt(posCity[2]) * GameLevelMapRate + this._clipOffsetY);
        dyImg.loadImage(`${RES_ENUM.GameLevel_City}${posCity[0]}`, 1, true);
        this.NdCity.addChild(cityPicNd);
        if (posCity[3] === '1') {
            cityPicNd.scaleX = -1;
            cityPicNd.setAnchorPoint(1, 0);
        } else {
            cityPicNd.scaleX = 1;
            cityPicNd.setAnchorPoint(0, 0);
        }

        // 关卡
        const nd = cc.instantiate(this._levelPrefab);
        let pos = levConf.nameInfo.Position.split(',');
        if (pos.length < 2) {
            pos = ['0', '0'];
        }
        // 城池UI位置偏移
        nd.setPosition(parseInt(pos[0]) * GameLevelMapRate + MapOffsetX, -parseInt(pos[1]) * GameLevelMapRate + this._clipOffsetY + MapOffsetY);
        const gameLevelItem: GameLevelItem = nd.getComponent(GameLevelItem) || nd.addComponent(GameLevelItem);
        gameLevelItem.setData(levConf);
        this.NdLevel.addChild(nd);
        // 城池UI缩放
        nd.setScale(MapLevelScale);
    }

    // 设置关卡数据
    public setLevelConfig(): void {
        if (!this.NdLevel) return;
        this.NdLevel.destroyAllChildren();
        this.NdLevel.removeAllChildren();
        const levels = UtilGameLevel.MapConfig();
        const timeD = 0.1;
        let time: number = 0;
        for (let i = 0, n = levels.length; i < n; i++) {
            time = i * timeD;
            if (time) {
                this.scheduleOnce(() => {
                    this.addGameLevelItem(levels[i]);
                }, time);
            } else {
                this.addGameLevelItem(levels[i]);
            }
        }
    }

    private setUpMap(id: number): void {
        if (!this.NdMapTiled) return;
        this.NdMapTiled.destroyAllChildren();
        this.NdMapTiled.removeAllChildren();
        for (let i = this.mapYNum; i > 0; i--) {
            const py = i * this.tiledSize.height;
            for (let j = 1; j <= this.mapXNum; j++) {
                const px = (j - 1) * this.tiledSize.width;
                const nid = `${i}_${j}`;
                const nd = this.getMap(nid);
                nd.name = nid;
                nd.setPosition(cc.v2(px, -this.mapSize.height + py));
                const rec = cc.rect(px, -this.mapSize.height + py, this.tiledSize.width, this.tiledSize.height); // 判断区域之内需要的地图块
                const isVisible = this.rectIsVisible(rec);

                this.mapPool[nid] = nd;
                if (isVisible) {
                    nd.parent = this.NdMapTiled;
                    UtilGameLevel.LoadMap(`${id}/${i}_${j}`, nd);
                }
            }
        }
    }

    private mapH = 4000;
    /** scrollview滚动回调 */
    private scrollEvent() {
        // 当前滑动位置;
        const offset = this.scrollView.getScrollOffset();
        // 根据当前区域获得到区域的滑动界限
        const arena: string[] = this._arenaInfo;
        const x = Math.max(offset.x, -parseInt(arena[2]));
        const y = Math.max(offset.y, parseInt(arena[1]));
        this.scrollView.scrollToOffset(cc.v2(-x, y));

        // this.NdCloud.scale = 1 - Math.abs((offset.y - kY) / this.mapH);
        this.handleMap();
    }

    /** 处理地图块的复用 */
    private handleMap() {
        for (const key in this.mapPool) {
            const nd = this.mapPool[key];
            if (this.NodeInView(nd)) {
                if (!nd.parent) {
                    nd.parent = this.NdMapTiled;
                    UtilGameLevel.LoadMap(`${this._mapPath}/${nd.name}`, nd);
                }
            } else {
                nd.removeFromParent();
                const spr = nd.getComponent(cc.Sprite);
                if (spr && spr.spriteFrame) {
                    spr.spriteFrame = null;
                }
            }
        }
    }
    // this.mapPool.forEach((nd: cc.Node) => {
    //     if (this.NodeInView(nd)) {
    //         if (!nd.parent) {
    //             nd.parent = this.NdMapTiled;
    //             UtilGameLevel.LoadMap(`${this._mapPath}/${nd.name}`, nd);
    //         }
    //     } else {
    //         nd.removeFromParent();
    //         const spr = nd.getComponent(cc.Sprite);
    //         if (spr && spr.spriteFrame) {
    //             spr.spriteFrame = null;
    //         }
    //     }
    // });

    private getMap(id: string): cc.Node {
        let nd = this.mapPool[id];
        if (!nd) {
            nd = new cc.Node();
            nd.addComponent(cc.Sprite);
        }
        return nd;
    }

    protected onDestroy(): void {
        this.mapPool = {};
        this.cloudPool.clear();
    }

    /** 判断node是否在可视区域内 */
    private NodeInView(nd: cc.Node): boolean {
        // 判断节点是否在 scrollview的区域中(矩形的交叉和包含需要在相同parent下比较或者做偏移处理,此处选择偏移处理)
        const ndRect = cc.rect(nd.position.x, nd.position.y, this.tiledSize.width, this.tiledSize.height);
        return this.rectIsVisible(ndRect);
    }

    /** 判断某个区域是否在可视范文之内 */
    private rectIsVisible(ndRect: cc.Rect): boolean {
        // 1,当前偏移量
        const scrollOffset: cc.Vec2 = this.scrollView.getScrollOffset();
        // 2,当前可视内容size
        const showSize = this.node.getContentSize();
        // 3, 可视rect
        const visibleRect = cc.rect(
            -scrollOffset.x,
            // -showSize.height,
            -showSize.height - scrollOffset.y, // 偏移量
            showSize.width + this.tiledSize.width / 2,
            showSize.height + this.tiledSize.height,
        );
        const res = visibleRect.intersects(ndRect) || visibleRect.containsRect(ndRect);
        return res;
    }

    // 解锁新章节
    public unlockNewStage(his: number, time = 0.1): void {
        // 应为战斗之后 销毁界面重新打开 所以要scroll定位到之前的位置
        this.setupMapRoleData(GameLevelPageState.NewChapter, his);
        // 添加人物
        this.addHisPlayer(his);
        // 添加怪物(需要执行动画)
        this.addMonster(true);
        this.playerMonsterDirection();
        this.scheduleOnce(() => {
            // 执行怪物出场动画
            this.MonsterAnimation(() => {
                // 滚动到玩家位置
                this.scrollWithPlayer(1);
                this.scheduleOnce(() => {
                    // 执行寻路
                    const a = this.currentChapter(his);
                    this.isRunning = true;
                    UtilGameLevel.move(this.NdPlayer, a.nameInfo.Road, () => {
                        // const dir = UtilGameLevel.Direction(this.NdPlayer.position.x, this.NdMonster.position.x);
                        // UtilGameLevel.updateState(this._player, 0, dir);
                        // const dir1 = UtilGameLevel.Direction(this.NdMonster.position.x, this.NdPlayer.position.x);
                        // UtilGameLevel.updateState(this._monster, 0, dir1);
                        // this.isRunning = false;
                        // this.scrollNew(1);
                        const role = this.NdPlayer.getChildByName('MainRole') as EntityRole;
                        const dir = MapCfg.I.useCellSerial2Direct(this._pPos[0], this._pPos[1], this._mPos[0], this._mPos[1]);
                        role.playAction(ACTION_TYPE.STAND, dir);
                        const dir1 = MapCfg.I.useCellSerial2Direct(this._mPos[0], this._mPos[1], this._pPos[0], this._pPos[1]);
                        const monster = this.NdMonster.getChildByName('EntityMonster') as EntityMonster;
                        monster.playAction(ACTION_TYPE.STAND, dir1);
                        this.isRunning = false;
                        this.scrollNew(1);
                    });
                }, 2);
            });
        }, 4);
    }

    // 借助update 实现镜头跟随
    private isRunning = false;
    protected update(dt: number): void {
        if (!this.isRunning) return;
        this.scrollWithPlayer(0.01);
    }
    // 解锁新的区域 (最新区域 最新章节)
    // public unlockNewArean(hisA: number, hisC: number): void {
    //     this.setupMapRoleData(GameLevelPageState.NewArena, hisA, hisC);
    //     this.addHisPlayer(hisC);
    //     // 应为战斗之后 销毁界面重新打开 所以要scroll定位到之前的位置
    //     this.scheduleOnce(() => {
    //         // 自动滚动到新的区域
    //         this.autoScroll(hisC + 1, hisA);
    //         // 先进行区域动画解锁  然后执行寻路
    //         // const nd = this.cloudPool.get(hisA + 1);
    //         // if (!nd) {
    //         //     console.log('没有下一个区域');
    //         //     return;
    //         // }
    //         // const arenaItem = nd.getComponent(GameLevelArenaItem);
    //         // arenaItem.playAnim(() => {
    //         //     this.unlockNewStage(hisC, 1.5);
    //         // });
    //         this.scheduleOnce(() => { // 1.5后跟随人物
    //             this.unlockNewStage(hisC, 1.5);
    //         }, 1.5);
    //     }, 2);
    // }

    private _pPos: number[] = [];
    private _mPos: number[] = [];
    /** 添加场景玩家 */
    private _player: EntityRole; // cc.Node;//
    private _monster: EntityMonster;// cc.Node;//
    // 地图上添加当前关的人物位置
    public addPlayer(): void {
        const info = this.currentChapter();
        const paths = info.nameInfo.Road.split('|');
        this._player?.destroy();
        this._player = UtilGameLevel.CreatePlayer();// EntityMapMgr.I.createMeRole();
        const posP = paths[0].split(',');
        this._pPos = [parseInt(posP[0]) * GameLevelMapRate, -parseInt(posP[1]) * GameLevelMapRate - this._clipOffsetY];
        this.NdPlayer.setPosition(this._pPos[0], this._pPos[1]);
        this.NdPlayer.addChild(this._player);
    }

    // 添加上一关卡的人物位置
    public addHisPlayer(his: number): void {
        const info = this.currentChapter(his);
        const paths = info.nameInfo.Road.split('|');
        this._player?.destroy();
        this._player = UtilGameLevel.CreatePlayer();// EntityMapMgr.I.createMeRole();
        const posP = paths[0].split(',');
        this._pPos = [parseInt(posP[0]) * GameLevelMapRate, -parseInt(posP[1]) * GameLevelMapRate - this._clipOffsetY];
        this.NdPlayer.setPosition(this._pPos[0], this._pPos[1]);
        this.NdPlayer.addChild(this._player);
    }

    private MonsterAnimation(cb: () => void) {
        const info = this.currentChapter();
        const cityPos = UtilGameLevel.GetCityDirection(info.nameInfo.CityPos);
        UtilGameLevel.updateState(this._monster, 1, cityPos);
        this._monster.playAction(ACTION_TYPE.RUN);
        cc.tween(this.NdMonster).to(
            2,
            {
                opacity: 255, scale: 1, x: this._mPos[0], y: this._mPos[1],
            },
        ).call(() => {
            UtilGameLevel.updateState(this._monster, 0, cityPos);
            this._monster.playAction(ACTION_TYPE.STAND);
            if (cb) cb();
        }).start();
    }

    /** 是否执行动画
    * 怪物位置始终都是在最新的位置 朝向与城池相同且不会改变
    */
    private addMonster(anim: boolean = false) {
        const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        const info = this.currentChapter();
        const lastNum = indexer.getMapMax(info.infoChapter.MapId - 1);
        const dis = RoleMgr.I.d.Stage - lastNum;
        // 移除旧的数据
        this._monster?.destroy();
        // 怪物为轮询 字需要获取到当前场景的怪物数据
        const cptr = ModelMgr.I.GameLevelModel.userPassingLevInfo().level;
        const monsts = info.infoChapter.BossGroup.split('|');
        const pos = info.nameInfo.MonPos.split(',');

        this._monster = UtilGameLevel.CreateMonster(parseInt(monsts[(dis - 1) % monsts.length]));
        // EntityMapMgr.I.createMonsterById(parseInt(monsts[(cptr - 1) % monsts.length]));
        this.NdMonster.addChild(this._monster);
        this._mPos = [parseInt(pos[0]) * GameLevelMapRate, -parseInt(pos[1]) * GameLevelMapRate - this._clipOffsetY];
        if (anim) {
            // 需要做动画
            const runPos = info.nameInfo.StartRunPos.split(',');
            const posA = [parseInt(runPos[0]) * GameLevelMapRate, -parseInt(runPos[1]) * GameLevelMapRate - this._clipOffsetY];
            this.NdMonster.setPosition(posA[0], posA[1]);
            this.NdMonster.opacity = 130;
            this.NdMonster.scale = 0.6;
        } else {
            // 不需要做动画
            this.NdMonster.setPosition(this._mPos[0], this._mPos[1]);
        }
        // 设置朝向
        const cityPos = UtilGameLevel.GetCityDirection(info.nameInfo.CityPos);
        UtilGameLevel.updateState(this._monster, 0, cityPos);
    }

    /** 人物的朝向 */
    private playerMonsterDirection() {
        // // 处理站立方向
        // const dir = UtilGameLevel.Direction(this._pPos[0], this._mPos[0]);
        // UtilGameLevel.updateState(this._player, 0, dir);
        // const dir1 = UtilGameLevel.Direction(this._mPos[0], this._pPos[0]);
        // UtilGameLevel.updateState(this._monster, 0, dir1);

        // 处理站立方向
        const dir = MapCfg.I.useCellSerial2Direct(this._pPos[0], this._pPos[1], this._mPos[0], this._mPos[1]);
        this._player.playAction(ACTION_TYPE.STAND, dir);
        const dir1 = MapCfg.I.useCellSerial2Direct(this._mPos[0], this._mPos[1], this._pPos[0], this._pPos[1]);
        this._monster.playAction(ACTION_TYPE.STAND, dir1);
    }

    /** 获取到当前关卡的相关信息
    * 不传值时为当前关卡 否则为其他关卡
    * cpt :当前场景
   */
    private currentChapter(cpt: number = 0): GameLevelInfoModel {
        const model = ModelMgr.I.GameLevelModel;
        if (cpt === 0) {
            const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
            const { chapter, level } = indexer.getChapterInfo();
            return model.GetCurrentStageChapterByLevel(chapter);
        } else {
            return model.GetCurrentStageChapterByLevel(cpt);
        }
    }

    /** 打开自动滚动设置
    * 当需要做场景和区域变化 才执行默认位置处理（上一个位置 ，默认是滚动到最新的位置）
   */
    // 屏幕偏移量 720/2 1280/2
    public autoScroll(hisStage: number, timeSecond: number = 0.1): void {
        // const newOffset = this.getPosBy(hisStage);
        const newa = this.currentChapter().nameInfo.LockPos.split(',');
        this.scrollView.scrollToOffset(cc.v2(
            parseInt(newa[0]) * GameLevelMapRate - 350,
            parseInt(newa[1]) * GameLevelMapRate - this._clipOffsetY - 600,
        ), timeSecond);
        // const pPos = this.NdPlayer.position;
        // this.scrollView.scrollToOffset(cc.v2(Math.abs(pPos.x) - 400, pPos.y), timeSecond);
    }

    /** * 根据场景id获取到scroll的滚动位置 */
    private getPosBy(stage: number): cc.Vec2 {
        const pos = this._levelsPos[stage - 1];
        return cc.v2(pos.x, pos.y);
    }

    /** 跟随人物跑动 偏移量 */
    private scrollWithPlayer(t?: number): void {
        const pPos = this.NdPlayer.position;

        /** 坐标转化 */
        const wp = this.NdPlayer.convertToWorldSpaceAR(cc.v2(0, 0));
        const np = this.scrollView.content.convertToNodeSpaceAR(wp);

        this.scrollView.scrollToOffset(cc.v2(np.x - 400, Math.abs(np.y) - 600), t);
    }
}
