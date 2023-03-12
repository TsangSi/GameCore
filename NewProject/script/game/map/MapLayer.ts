/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @Author: kexd
 * @Date: 2022-04-25 17:50:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-25 19:00:57
 * @FilePath: \SanGuo2.4\assets\script\game\map\MapLayer.ts
 * @Description: 地图层(缩略图、地图块)动态加载及移动相关
 */

import { EventClient } from '../../app/base/event/EventClient';
import { AssetType } from '../../app/core/res/ResConst';
import { ResMgr } from '../../app/core/res/ResMgr';
import { E } from '../const/EventName';
import { MapArea } from './MapArea';
import MapCfg, { MAP_AREA_X, MAP_AREA_Y, MAP_CONFIG } from './MapCfg';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapLayer extends cc.Component {
    @property(cc.Node)
    private NdBg: cc.Node = null;

    @property(cc.Node)
    private NdCell: cc.Node = null;

    /** 是否打印信息 */
    private _isShowInfo: boolean = false;
    /** 人物身边的地图块 3*5 */
    private _mapArea: { [name: string]: MapArea; } = cc.js.createMap(true);
    /** 玩家所处地图切块 */
    private _roleMapBlock: cc.Vec2 = cc.v2(0, 0);
    /** 玩家所处网格 */
    private _roleMapCell: cc.Vec2 = cc.v2(0, 0);

    public static I: MapLayer;

    protected start(): void {
        MapLayer.I = this;
    }

    protected onDestroy(): void {
        MapLayer.I = null;
    }

    /**
     * 加载地图缩略图
     */
    public loadBgMap() {
        ResMgr.I.loadRemote(`map/map_${MapCfg.I.mapRes}`, AssetType.SpriteFrame_jpg, (err, sp: cc.SpriteFrame) => {
            if (err) { return; }
            const spBg = this.NdBg.getComponent(cc.Sprite);
            spBg.spriteFrame = sp;

            this.NdBg.anchorX = 0;
            this.NdBg.anchorY = 0;
            this.NdBg.width = MapCfg.I.mapWidth;
            this.NdBg.height = MapCfg.I.mapHeight;

            EventClient.I.emit(E.Map.InitMapLoaded);
        });
    }

    /**
     * 设置地图缩略图的宽高
     */
    public setBgSize(w: number, h: number) {
        if (this.NdBg.isValid) {
            // const trans = this.NdBg.getComponent(UITransform);
            this.NdBg.width = w;
            this.NdBg.height = h;
        }
    }

    /**
     * initCell
     */
    public initCell(standCellSerialX: number, standCellSerialY: number): void {
        if (!MapCfg.I.finishLoadMapData) {
            console.log('还没加载完地图数据，这里return');
            const stack = new Error().stack;
            console.warn('initCell打印堆栈:', stack);
            return;
        }
        const posx = standCellSerialX * MapCfg.I.cellWidth;
        const posy = standCellSerialY * MapCfg.I.cellHeight;
        this._roleMapCell.x = standCellSerialX;
        this._roleMapCell.y = standCellSerialY;
        this._roleMapBlock.x = Math.floor(posx / MAP_CONFIG.mapBlockX);
        this._roleMapBlock.y = Math.floor(posy / MAP_CONFIG.mapBlockY);
        this.initMapTileds(this._roleMapBlock.x, this._roleMapBlock.y);
    }

    /**
     * 清理图块
     */
    public clearMapTiled(): void {
        for (const idx in this._mapArea) {
            const mapTempNode = this._mapArea[idx];
            if (mapTempNode) {
                mapTempNode.destroy();
            }
        }
        this._mapArea = {};
    }

    /**
     * 是否在当前3*5地图块内
     */
    public isInBlocks(x: number, y: number) {
        let lx = (this._roleMapBlock.x - 1) * MAP_CONFIG.mapBlockX;
        let rx = (this._roleMapBlock.x + 2) * MAP_CONFIG.mapBlockX;
        let uy = (this._roleMapBlock.y + 3) * MAP_CONFIG.mapBlockY;
        let dy = (this._roleMapBlock.y - 2) * MAP_CONFIG.mapBlockY;

        if (lx < 0) lx = 0;
        if (rx > MapCfg.I.mapWidth) rx = MapCfg.I.mapWidth;
        if (dy < 0) dy = 0;
        if (uy > MapCfg.I.mapHeight) uy = MapCfg.I.mapHeight;

        return x >= lx && x <= rx && y >= dy && y <= uy;
    }

    /**
     * 是否不在当前3*5地图块内
     */
    public isOutBlocks(x: number, y: number) {
        const lx = (this._roleMapBlock.x - 1) * MAP_CONFIG.mapBlockX - 100;
        const rx = (this._roleMapBlock.x + 2) * MAP_CONFIG.mapBlockX + 100;
        const uy = (this._roleMapBlock.y + 3) * MAP_CONFIG.mapBlockY - 100;
        const dy = (this._roleMapBlock.y - 2) * MAP_CONFIG.mapBlockY + 100;

        return x < lx || x > rx || y < dy || y > uy;
    }

    /**
     *  初始化图块矩阵 3*5
     * @param cellPoint 矩阵 中心坐标（大地图中心地图切块坐标）
     */
    public initMapTileds(blockX: number, blockY: number): void {
        this.clearMapTiled();
        // const blockNum = MapCfg.I.cellCount();
        const offsetX = Math.floor((MAP_AREA_X - 1) / 2);
        const offsetY = Math.floor((MAP_AREA_Y - 1) / 2);

        // console.log(blockX, blockY, '--------------------initMapTileds------------------------', MapCfg.I.mapId, this._roleMapCell.x, this._roleMapCell.y);

        // 初始化地图切块,放到最后执行
        for (let ix = 0; ix < MAP_AREA_X; ix++) {
            // 左右偏移 offsetX 取地图块
            let mapMarkX: number = blockX + (ix - offsetX);
            const px: number = mapMarkX * MAP_CONFIG.mapBlockX;
            // 实际资源+1
            mapMarkX = 1 + mapMarkX;
            for (let iy = 0; iy < MAP_AREA_Y; iy++) {
                // 上下偏移 offsetY 取地图块
                let mapMarkY: number = blockY + (iy - offsetY);
                const py: number = mapMarkY * MAP_CONFIG.mapBlockY;
                // 实际资源+1
                mapMarkY = 1 + mapMarkY;
                if (this._isShowInfo) console.log(`中心block是${blockX}_${blockY}`, `中心块资源名是${blockY + 1}_${blockX + 1}`, `当前${mapMarkY}_${mapMarkX}`, px, py);

                const mapNode: MapArea = new MapArea();
                const mnName = `${mapMarkY}_${mapMarkX}`;
                this.NdCell.addChild(mapNode);
                mapNode.active = false;
                this._mapArea[mnName] = mapNode;
                mapNode.name = mnName;
                mapNode.setPosition(px, py);

                if (this.checkBroderline(mapMarkY, mapMarkX)) {
                    // 检测一遍是否超框
                    // MapCfg.I.loadingMapCount++;
                    mapNode.loadMapArea(mapMarkY, mapMarkX, MapCfg.I.mapId);
                }
            }
        }
    }

    /**
     *  更新地图图块矩阵
     * @param sceneCenterSerial //屏幕中心网格坐标 （32*32）
     * @param targetBlockSerial //目标角色所处的图块坐标 （512*512）img
     * return 新的角色图块坐标
     */
    public doUpdateMapTileds(sceneCenterSerial: cc.Vec2, targetBlockSerial: cc.Vec2): cc.Vec2 {
        const markPoint: cc.Vec2 = targetBlockSerial;
        // const blockNum = MapCfg.I.cellCount();
        const cellXNum = MAP_CONFIG.mapBlockX / MapCfg.I.cellWidth;
        const cellYNum = MAP_CONFIG.mapBlockY / MapCfg.I.cellHeight;
        // 玩家记录格子所在地图块  与  玩家记录地图所在区块  的差值
        const diffBlockX: number = Math.floor(sceneCenterSerial.x / cellXNum) - targetBlockSerial.x;
        const diffBlockY: number = Math.floor(sceneCenterSerial.y / cellYNum) - targetBlockSerial.y;

        // 一旦产生差值，说明要切换地图块
        if (diffBlockX > 0 || diffBlockX < 0) {
            if (this._isShowInfo) console.log('doUpdateMapTileds,中心cell是: ', `(${sceneCenterSerial.x}),${sceneCenterSerial.y}),中心block是: (${targetBlockSerial.x}, ${targetBlockSerial.y})`, diffBlockX, diffBlockY);
            // X轴切换地图块
            // 计算左右两侧地图块数量
            const offsetX = Math.floor((MAP_AREA_X - 1) / 2);
            const offsetY = Math.floor((MAP_AREA_Y - 1) / 2);
            // X轴切换地图块，遍历Y轴
            for (let i = 0; i < MAP_AREA_Y; i++) {
                // 实际资源+1
                const mapMarkY = 1 + targetBlockSerial.y + (i - offsetY);
                // 左边地图块 实际资源+1
                const mapMarkL: string = `${mapMarkY}_${1 + targetBlockSerial.x - offsetX}`;
                // 右边地图块 实际资源+1
                const mapMarkR: string = `${mapMarkY}_${1 + targetBlockSerial.x + offsetX}`;

                // 目标
                let targetMark: string;
                let mapChangeNode: MapArea;

                if (diffBlockX > 0) {
                    // 向右运动，左侧地图块重绘
                    mapChangeNode = this._mapArea[mapMarkL];
                    if (mapChangeNode && this._mapArea[mapMarkR]) {
                        if (mapChangeNode.isLoading) {
                            if (this._isShowInfo) {
                                console.log('向右运动，左侧地图块重绘', mapMarkL);
                            }
                            // 加载真慢，还在使用,也有可能加载错误
                            mapChangeNode.destroy();
                            mapChangeNode = new MapArea();
                            mapChangeNode.setSiblingIndex(-10);
                            this.NdCell.addChild(mapChangeNode);
                        }
                        // 重绘目标图片标识 实际资源+1
                        targetMark = `${mapMarkY}_${1 + targetBlockSerial.x + offsetX + 1}`;
                        // 重绘目标位置 这个是提前设置了将要加载的资源的位置
                        mapChangeNode.setPosition(this._mapArea[mapMarkR].position.x + MAP_CONFIG.mapBlockX, this._mapArea[mapMarkR].position.y);
                        // 置空重绘
                        this._mapArea[mapMarkL] = null;
                    } else if (this._isShowInfo) {
                        console.log('向右运动 mapChangeNode-A 为空');
                    }
                } else if (diffBlockX < 0) {
                    // 向左运动，右侧地图块重绘
                    mapChangeNode = this._mapArea[mapMarkR];
                    if (mapChangeNode && this._mapArea[mapMarkL]) {
                        if (mapChangeNode.isLoading) {
                            if (this._isShowInfo) {
                                console.log('向左运动，右侧地图块重绘', mapMarkR);
                            }
                            // 加载真慢，还在使用
                            mapChangeNode.destroy();
                            mapChangeNode = new MapArea();
                            mapChangeNode.setSiblingIndex(-10);
                            this.NdCell.addChild(mapChangeNode);
                        }
                        // 实际资源+1
                        targetMark = `${mapMarkY}_${1 + targetBlockSerial.x - offsetX - 1}`;
                        mapChangeNode.setPosition(this._mapArea[mapMarkL].position.x - MAP_CONFIG.mapBlockX, this._mapArea[mapMarkL].position.y);
                        this._mapArea[mapMarkR] = null;
                    } else if (this._isShowInfo) {
                        console.log('向左运动 mapChangeNode-B 为空');
                    }
                }
                if (this._isShowInfo) {
                    console.log('左边地图块:', mapMarkL, '右边地图块:', mapMarkR, 'targetMark:', targetMark);
                }
                if (mapChangeNode) {
                    this._mapArea[targetMark] = mapChangeNode;
                    mapChangeNode.active = false;
                    if (this.checkBroderline(targetMark)) {
                        mapChangeNode.loadMapAreaMark(targetMark, MapCfg.I.mapId);
                    }
                }
            }
            // 记录X地图块值
            markPoint.x += diffBlockX;
        }
        // 一但产生差值，说明要切换地图块
        if (diffBlockY > 0 || diffBlockY < 0) {
            // Y轴切换地图块
            // 计算上下两侧地图块数量
            if (this._isShowInfo) console.log('doUpdateMapTileds,中心cell是: ', `(${sceneCenterSerial.x}),${sceneCenterSerial.y}),中心block是: (${targetBlockSerial.x}, ${targetBlockSerial.y})`, diffBlockX, diffBlockY);
            const offsetX = Math.floor((MAP_AREA_X - 1) / 2);
            const offsetY = Math.floor((MAP_AREA_Y - 1) / 2);
            for (let i = 0; i < MAP_AREA_X; i++) {
                // 上边地图块 资源+1
                const mapMarkUY = 1 + targetBlockSerial.y + offsetY;
                const mapMarkU: string = `${mapMarkUY}_${1 + targetBlockSerial.x + (i - offsetX)}`;
                // 下边地图块 资源+1
                const mapMarkDY = 1 + targetBlockSerial.y - offsetY;
                const mapMarkD: string = `${mapMarkDY}_${1 + targetBlockSerial.x + (i - offsetX)}`;
                // 目标
                let targetMark: string = '';
                let mapChangeNode: MapArea = null;

                if (diffBlockY < 0) {
                    // 向下运动
                    mapChangeNode = this._mapArea[mapMarkU];
                    if (mapChangeNode && this._mapArea[mapMarkD]) {
                        if (mapChangeNode.isLoading) {
                            if (this._isShowInfo) console.log('loaded destroy=====Y1=====');
                            // 加载真慢，还在使用
                            mapChangeNode.destroy();
                            mapChangeNode = new MapArea();
                            mapChangeNode.setSiblingIndex(-10);
                            this.NdCell.addChild(mapChangeNode);
                        }
                        // 实际资源+1
                        targetMark = `${mapMarkDY - 1}_${1 + targetBlockSerial.x + (i - offsetX)}`;
                        mapChangeNode.setPosition(this._mapArea[mapMarkD].position.x, this._mapArea[mapMarkD].position.y - MAP_CONFIG.mapBlockY);
                        this._mapArea[mapMarkU] = null;
                    } else if (this._isShowInfo) {
                        console.log(' 向下运动 mapChangeNode-C为空. mapMarkU=', mapMarkU, 'mapMarkD=', mapMarkD);
                    }
                } else if (diffBlockY > 0) {
                    // 向上运动
                    mapChangeNode = this._mapArea[mapMarkD];
                    if (mapChangeNode && this._mapArea[mapMarkU]) {
                        if (mapChangeNode.isLoading) {
                            // 加载真慢，还在使用
                            if (this._isShowInfo) console.log('loaded destroy====Y2======');
                            mapChangeNode.destroy();
                            mapChangeNode = new MapArea();
                            mapChangeNode.setSiblingIndex(-10);
                            this.NdCell.addChild(mapChangeNode);
                        }
                        // 实际资源+1
                        targetMark = `${mapMarkUY + 1}_${1 + targetBlockSerial.x + (i - offsetX)}`;
                        mapChangeNode.setPosition(this._mapArea[mapMarkU].position.x, this._mapArea[mapMarkU].position.y + MAP_CONFIG.mapBlockY);
                        this._mapArea[mapMarkD] = null;
                    } else if (this._isShowInfo) {
                        console.log('向上运动 mapChangeNode-D 为空 mapMarkD=', mapMarkD, 'mapMarkU=', mapMarkU);
                    }
                }
                if (this._isShowInfo) {
                    console.log('上边地图块:', mapMarkU, '下边地图块:', mapMarkD, 'targetMark:', targetMark);
                }
                if (mapChangeNode) {
                    this._mapArea[targetMark] = mapChangeNode;
                    mapChangeNode.active = false;
                    if (this.checkBroderline(targetMark)) {
                        mapChangeNode.loadMapAreaMark(targetMark, MapCfg.I.mapId);
                    }
                } else if (this._isShowInfo) {
                    console.log('mapChangeNode为空');
                }
            }
            markPoint.y += diffBlockY;
        }

        return markPoint;
    }

    /**
     * 刷新地图位置
     */
    public uptMapPos(x: number, y: number) {
        if (!this.node.active || !MapCfg.I.cellWidth || !MapCfg.I.cellHeight) {
            return;
        }
        if (!MapCfg.I.finishLoadMapData) {
            console.log('uptMapPos-----还没加载完地图数据，这里return');
            return;
        }
        const cx = Math.floor(x / MapCfg.I.cellWidth);
        const cy = Math.floor(y / MapCfg.I.cellHeight);

        if (cx !== this._roleMapCell.x || cy !== this._roleMapCell.y) {
            this._roleMapCell.x = cx;
            this._roleMapCell.y = cy;
            const point = this.doUpdateMapTileds(this._roleMapCell, this._roleMapBlock);
            this._roleMapBlock = point;
        }
    }

    public checkBroderline(mark: string): boolean;
    public checkBroderline(my: number, mx: number): boolean;
    public checkBroderline(param?: any, mx?: number): boolean {
        if (param === undefined) return;
        let my: number = 0;
        if (typeof param === 'string') {
            my = Number(param.split('_')[0]);
            mx = Number(param.split('_')[1]);
        } else {
            my = param;
        }
        if (mx < 1) {
            if (this._isShowInfo) console.log('地图块超出左边界');
            return false;
        }
        if (my < 1) {
            if (this._isShowInfo) console.log('地图块超出下边界');
            return false;
        }
        if (mx > Math.ceil(MapCfg.I.mapWidth / MAP_CONFIG.mapBlockX)) {
            if (this._isShowInfo) console.log('地图块超出右边界');
            return false;
        }
        if (my > Math.ceil(MapCfg.I.mapHeight / MAP_CONFIG.mapBlockY)) {
            if (this._isShowInfo) console.log('地图块超出上边界');
            return false;
        }
        return true;
    }
}
