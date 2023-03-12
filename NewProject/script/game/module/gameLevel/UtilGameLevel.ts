/*
 * @Author: myl
 * @Date: 2022-09-14 15:35:30
 * @Description:
 */
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { AssetType } from '../../../app/core/res/ResConst';
import { ACTION_TYPE } from '../../base/anim/AnimCfg';
import { Config } from '../../base/config/Config';
import GameApp from '../../base/GameApp';
import EntityMapMgr from '../../entity/EntityMapMgr';
import { EntityMonster } from '../../entity/EntityMonster';
import { EntityRole } from '../../entity/EntityRole';
import ModelMgr from '../../manager/ModelMgr';
import MapCfg from '../../map/MapCfg';
import { GameLevelInfoModel } from './GameLevelConst';

const { ccclass, property } = cc._decorator;

// 关卡地图块的像素分辨率
export const GameLevelMapRate = 40;
export interface ICloudInfo {
    // 云朵的x
    x: number,
    // 云朵的y
    y: number,
    // 云朵的远端资源路径
    res: string | number,
    // 旋转
    scale: number,
}

/** 地图基础配置 */
export interface ILevelMapConf {
    // 地图id 定位资源
    id: number,
    // 地图大小
    size: cc.Size,
    // 地图块大小
    tileSize?: cc.Size,
}

/** 关卡数据 */
export interface ILevelData {
    // 当前关卡
    currentLev: number,
    // 区域
    arenaId: number
}

const GameLevelMapPath = 'map/map_';
export class UtilGameLevel {
    /** 根据节点加载一个地图块 */
    public static LoadMap(mId: string, nd: cc.Node): void {
        const spr = nd.getComponent(cc.Sprite) || nd.addComponent(cc.Sprite);
        UtilCocos.LoadSpriteFrameRemote(spr, `${GameLevelMapPath}${mId}`, AssetType.SpriteFrame_jpg, (sp: cc.Sprite) => {
            nd.anchorX = 0;
            nd.anchorY = 1;
        });
    }

    /** 获取章节目录(包括所有的信息) */
    public static MapConfig(mapId?: string): GameLevelInfoModel[] {
        const custMapID = ModelMgr.I.GameLevelModel.getUserLevel().chapter;
        // 当前章节所处的配置表中的地图
        const curMap = Math.ceil(custMapID / 10);
        const all = ModelMgr.I.GameLevelModel.getAllChapterData();
        const res: GameLevelInfoModel[] = [];
        for (let i = 0; i < all.length; i++) {
            const element = all[i];
            if (Math.ceil(element.nameInfo.Chapter / 10) === curMap) {
                res.push(element);
            }
        }
        return res;
    }

    /** 获取区域id */
    public static StageArena(): number {
        return ModelMgr.I.GameLevelModel.getFoxInfo();
    }

    /** 根据路径移动
     * paths : 需要移动的路径
     * cb : 所以点移动完成之后回调
    */
    public static move(nd: cc.Node, paths: string | string[], cb: () => void): void {
        let moveDatas: string[] = [];
        if (typeof paths === 'string') {
            moveDatas = paths.split('|');
        } else {
            moveDatas = paths;
        }
        this.moveWithIndex(nd, moveDatas, 0, (isF) => {
            if (isF) {
                cb();
            }
        });
    }

    private static moveWithIndex(nd: cc.Node, data: string[], index: number, cb: (isFinish: boolean) => void) {
        if (index >= (data.length - 1)) {
            if (cb) {
                // 完成
                cb(true);
            }
            return;
        }
        let idx = index;
        const dta = data[idx];// 起点
        const dta1 = data[idx + 1];// 终点
        const pos = dta.split(',');
        const pos1 = dta1.split(',');
        this.moveTo(nd, pos, pos1, () => {
            idx++;
            this.moveWithIndex(nd, data, idx, cb);
        });
    }

    /** 两点之间移动   是否半透明是根据起始点决定
     *  start
     * end
     * cb : 移动完成回调
    */
    private static moveTo(nd: cc.Node, start: string[], end: string[], cb: () => void): void {
        // const x1 = parseInt(start[0]) * GameLevelMapRate;
        // const a1 = parseInt(start[2]);
        // const x2 = parseInt(end[0]) * GameLevelMapRate;
        // const y2 = -parseInt(end[1]) * GameLevelMapRate;
        // const _direction = this.Direction(x1, x2);
        // const role = nd.children[0];
        // this.updateState(role, 1, _direction);
        // if (a1 === 2) {
        //     role.color.a = 130;
        // } else {
        //     role.color.a = 255;
        // }
        // cc.tween(nd)
        //     .to(1, { x: x2, y: y2 })
        //     .call(() => {
        //         if (cb) cb();
        //     }).start();

        const x1 = parseInt(start[0]) * GameLevelMapRate;
        const y1 = -parseInt(start[1]) * GameLevelMapRate;
        const a1 = parseInt(start[2]);

        const x2 = parseInt(end[0]) * GameLevelMapRate;
        const y2 = -parseInt(end[1]) * GameLevelMapRate;
        const a2 = parseInt(end[2]);
        const _direction = MapCfg.I.useCellSerial2Direct(x1, y1, x2, y2);
        const role = nd.getChildByName('MainRole') as EntityRole;
        role.playAction(ACTION_TYPE.RUN, _direction);
        if (a1 === 2) {
            role.alpha = 0.5;
        } else {
            role.alpha = 1;
        }
        cc.tween(nd).to(1, { x: x2, y: y2 }).call(() => {
            if (cb) cb();
        }).start();
    }

    public static getAreaById(ind: number): Cfg_StageArea {
        const indexer = Config.Get(Config.Type.Cfg_StageArea);
        return indexer.getValueByKey(ind);
    }

    /** 判断朝向
     *  向左为0 向右为1（与城池方向相同）
    */
    public static Direction(starX: number, endX: number): number {
        return starX > endX ? 0 : 1;
    }

    /** 从配置表数据 获取城池朝向 */
    public static GetCityDirection(str: string): number {
        return parseInt(str.split(',')[3]);
    }

    /** 创建人物 */
    public static CreatePlayer(id?: number): EntityRole {
        // return this.CreatePlayerQ();
        return EntityMapMgr.I.createMeRole();
    }

    public static CreatePlayerQ(id: string = '10001-4'): cc.Node {
        const nd: cc.Node = new cc.Node(id);

        cc.assetManager.loadAny([
            { url: `${GameApp.I.ResUrl}/spine/role/man/${id}.atlas` },
            { url: `${GameApp.I.ResUrl}/spine/role/man/${id}.json` },
            { url: `${GameApp.I.ResUrl}/spine/role/man/${id}.png`, ext: '.png' },
        ], (e, assets: any[]) => {
            if (!e && nd && nd.isValid) {
                const spine = nd.addComponent(sp.Skeleton);
                const skeletonData = new sp.SkeletonData();
                const atxt = assets[0] as string;
                skeletonData.atlasText = atxt;
                skeletonData.skeletonJson = assets[1];
                const t2d1 = new cc.Texture2D();
                t2d1.initWithElement(assets[2]);

                // 顺序不能错乱
                skeletonData.textures = [t2d1];
                // eslint-disable-next-line dot-notation
                skeletonData['textureNames'] = [`${id}.png`];
                spine.skeletonData = skeletonData;
                spine.animation = 'stand';
            }
        });
        return nd;
    }

    public static updateState(nd: cc.Node, action: number, dir: number): void {
        nd.scaleX = dir === 1 ? -1 : 1;
        if (action === 0) {
            console.log('站立');
            const spine = nd.getComponent(sp.Skeleton);
            if (spine) {
                if (spine.animation !== 'stand') {
                    spine.animation = 'stand';
                }
            }
        } else {
            console.log('行走');
            const spine = nd.getComponent(sp.Skeleton);
            if (spine) {
                if (spine.animation !== 'run') {
                    spine.animation = 'run';
                }
            }
        }
    }

    /** 创建怪物 */
    public static CreateMonster(id: number): EntityMonster {
        // const nd: cc.Node = new cc.Node();
        // cc.assetManager.loadAny([
        //     { url: `${GameApp.I.ResUrl}/spine/role/man/10001-3.atlas` },
        //     { url: `${GameApp.I.ResUrl}/spine/role/man/10001-3.json` },
        //     { url: `${GameApp.I.ResUrl}/spine/role/man/10001-3.png`, ext: '.png' },
        // ], (e, assets: any[]) => {
        //     if (!e) {
        //         const spine = nd.addComponent(sp.Skeleton);
        //         const skeletonData = new sp.SkeletonData();
        //         const atxt = assets[0] as string;
        //         skeletonData.atlasText = atxt;
        //         skeletonData.skeletonJson = assets[1];

        //         const t2d1 = new cc.Texture2D();
        //         t2d1.initWithElement(assets[2]);

        //         // 顺序不能错乱
        //         skeletonData.textures = [t2d1];
        //         // eslint-disable-next-line dot-notation
        //         skeletonData['textureNames'] = ['10001-3.png'];
        //         spine.skeletonData = skeletonData;
        //         spine.animation = 'stand';
        //     }
        // });
        // return nd;
        // return this.CreatePlayer();
        return EntityMapMgr.I.createMonsterById(id);
    }
}
