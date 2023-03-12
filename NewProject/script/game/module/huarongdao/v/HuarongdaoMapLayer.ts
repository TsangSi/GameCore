// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import HuarongdaoMapArea from './HuarongdaoMapArea';

const { ccclass, property } = cc._decorator;

const MAP_AREA_X = 3;
const MAP_AREA_Y = 1;

@ccclass
export default class HuarongdaoMapLayer extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    private _cellWidth: number = 1434;
    private _cellHeight: number = 1280;
    /**
      * 一个地图切片宽
      */
    private mapBlockX: number = 1434;
    /**
      * 一个地图切片高
      */
    private mapBlockY: number = 1280;
    /** 人物身边的地图块 3*5 */
    private _mapArea: { [name: string]: HuarongdaoMapArea; } = cc.js.createMap(true);
    /** 玩家所处地图切块 */
    private _roleMapBlock: cc.Vec2 = cc.v2(0, 0);
    /** 玩家所处网格 */
    private _roleMapCell: cc.Vec2 = cc.v2(0, 0);

    /** 是否打印信息 */
    private _isShowInfo: boolean = false;

    private _mapWidth: number = 0;
    private _mapHeight: number = 0;

    private _initCellState = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    public setMapSize(width: number, height): void {
        this._mapWidth = width;
        this._mapHeight = height;
    }

    /** 玩家出生在哪个格子 */
    public initPlayCell(x: number, y: number): void {
        if (this._initCellState) {
            return;
        }
        const cx = Math.floor(x / this._cellWidth);
        const cy = Math.floor(y / this._cellHeight);

        this.initCell(cx, cy);
        this._initCellState = true;
        // console.log(this._role.x, this._role.y, 'initPlayCell---------', x, y, cellX, cellY);
    }

    /**
     * initCell
     */
    public initCell(standCellSerialX: number, standCellSerialY: number): void {
        const posx = standCellSerialX * this._cellWidth;
        const posy = standCellSerialY * this._cellHeight;
        this._roleMapCell.x = standCellSerialX;
        this._roleMapCell.y = standCellSerialY;
        this._roleMapBlock.x = Math.floor(posx / this.mapBlockX);
        this._roleMapBlock.y = Math.floor(posy / this.mapBlockY);
        this.initMapTileds(this._roleMapBlock.x, this._roleMapBlock.y);
    }

    /**
     *  初始化图块矩阵
     * @param cellPoint 矩阵 中心坐标（大地图中心地图切块坐标）
     */
    public initMapTileds(blockX: number, blockY: number): void {
        this.clearMapTiled();
        // const blockNum = MapCfg.I.cellCount();
        const offsetX = Math.floor((MAP_AREA_X - 1) / 2);
        const offsetY = Math.floor((MAP_AREA_Y - 1) / 2);

        console.log('--------------------initMapTileds------------------------', 1, this._roleMapCell.x, this._roleMapCell.y);

        // 初始化地图切块,放到最后执行
        for (let ix = 0; ix < MAP_AREA_X; ix++) {
            // 左右偏移 offsetX 取地图块
            let mapMarkX: number = blockX + (ix - offsetX);
            const px: number = mapMarkX * this.mapBlockX;
            // 实际资源+1
            mapMarkX = 1 + mapMarkX;
            for (let iy = 0; iy < MAP_AREA_Y; iy++) {
                // 上下偏移 offsetY 取地图块
                let mapMarkY: number = blockY + (iy - offsetY);
                const py: number = mapMarkY * this.mapBlockY;
                // 实际资源+1
                mapMarkY = 1 + mapMarkY;
                if (this._isShowInfo) console.log(`中心block是${blockX}_${blockY}`, `中心块资源名是${blockY + 1}_${blockX + 1}`, `当前${mapMarkY}_${mapMarkX}`, px, py);

                const mapNode: HuarongdaoMapArea = new HuarongdaoMapArea();
                const mnName = `${mapMarkY}_${mapMarkX}`;
                this.node.addChild(mapNode);
                mapNode.active = false;
                this._mapArea[mnName] = mapNode;
                mapNode.name = mnName;
                mapNode.setPosition(px, py);

                if (this.checkBroderline(mapMarkY, mapMarkX)) {
                    // 检测一遍是否超框
                    // MapCfg.I.loadingMapCount++;
                    mapNode.loadMapArea(mapMarkY, mapMarkX, 1);
                }
            }
        }
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

    public updateMapPos(x: number, y: number) {
        if (!this.node.active) {
            return;
        }
        const cx = Math.floor(x / this._cellWidth);
        const cy = Math.floor(y / this._cellHeight);

        if (cx !== this._roleMapCell.x || cy !== this._roleMapCell.y) {
            this._roleMapCell.x = cx;
            this._roleMapCell.y = cy;
            const point = this.doUpdateMapTileds(this._roleMapCell, this._roleMapBlock);
            this._roleMapBlock = point;
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
        const cellXNum = this.mapBlockX / this._cellWidth;
        const cellYNum = this.mapBlockY / this._cellHeight;
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
                let mapChangeNode: HuarongdaoMapArea;

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
                            mapChangeNode = new HuarongdaoMapArea();
                            mapChangeNode.setSiblingIndex(-10);
                            this.node.addChild(mapChangeNode);
                        }
                        // 重绘目标图片标识 实际资源+1
                        targetMark = `${mapMarkY}_${1 + targetBlockSerial.x + offsetX + 1}`;
                        // 重绘目标位置 这个是提前设置了将要加载的资源的位置
                        mapChangeNode.setPosition(this._mapArea[mapMarkR].position.x + this.mapBlockX, this._mapArea[mapMarkR].position.y);
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
                            mapChangeNode = new HuarongdaoMapArea();
                            mapChangeNode.setSiblingIndex(-10);
                            this.node.addChild(mapChangeNode);
                        }
                        // 实际资源+1
                        targetMark = `${mapMarkY}_${1 + targetBlockSerial.x - offsetX - 1}`;
                        mapChangeNode.setPosition(this._mapArea[mapMarkL].position.x - this.mapBlockX, this._mapArea[mapMarkL].position.y);
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
                        mapChangeNode.loadMapAreaMark(targetMark, 1);
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
                let mapChangeNode: HuarongdaoMapArea = null;

                if (diffBlockY < 0) {
                    // 向下运动
                    mapChangeNode = this._mapArea[mapMarkU];
                    if (mapChangeNode && this._mapArea[mapMarkD]) {
                        if (mapChangeNode.isLoading) {
                            if (this._isShowInfo) console.log('loaded destroy=====Y1=====');
                            // 加载真慢，还在使用
                            mapChangeNode.destroy();
                            mapChangeNode = new HuarongdaoMapArea();
                            mapChangeNode.setSiblingIndex(-10);
                            this.node.addChild(mapChangeNode);
                        }
                        // 实际资源+1
                        targetMark = `${mapMarkDY - 1}_${1 + targetBlockSerial.x + (i - offsetX)}`;
                        mapChangeNode.setPosition(this._mapArea[mapMarkD].position.x, this._mapArea[mapMarkD].position.y - this.mapBlockY);
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
                            mapChangeNode = new HuarongdaoMapArea();
                            mapChangeNode.setSiblingIndex(-10);
                            this.node.addChild(mapChangeNode);
                        }
                        // 实际资源+1
                        targetMark = `${mapMarkUY + 1}_${1 + targetBlockSerial.x + (i - offsetX)}`;
                        mapChangeNode.setPosition(this._mapArea[mapMarkU].position.x, this._mapArea[mapMarkU].position.y + this.mapBlockY);
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
                        mapChangeNode.loadMapAreaMark(targetMark, 1);
                    }
                } else if (this._isShowInfo) {
                    console.log('mapChangeNode为空');
                }
            }
            markPoint.y += diffBlockY;
        }

        return markPoint;
    }

    public checkBroderline(mark: string): boolean;
    public checkBroderline(my: number, mx: number): boolean;
    public checkBroderline(param?: any, mx?: number): boolean {
        if (param === undefined) return false;
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
        if (mx > Math.ceil(this._mapWidth / this.mapBlockX)) {
            if (this._isShowInfo) console.log('地图块超出右边界');
            return false;
        }
        if (my > Math.ceil(this._mapHeight / this.mapBlockY)) {
            if (this._isShowInfo) console.log('地图块超出上边界');
            return false;
        }
        return true;
    }

    // update (dt) {}
}
