/* eslint-disable max-len */
/* eslint-disable no-tabs */

/*
 * @Author: kexd
 * @Date: 2022-04-25 15:40:31
 * @LastEditors: kexd
 * @LastEditTime: 2022-05-30 09:54:21
 * @FilePath: \SanGuo\assets\script\game\base\mapBase\road\MapRoadUtils.ts
 * @Description:MapRoadUtils
 *
 */

import Point from './Point';
import RoadNode from './RoadNode';
import { MapMode } from './MapMode';

export enum ENUM_ROAD {
	Block = 0, // 阻挡
	Run = 1, // 可行走
	Half = 2, // 半透明
	Trans = 3, // 传送点
}

export default class MapRoadUtils {
    private static _instance: MapRoadUtils;

    public static get I(): MapRoadUtils {
        if (this._instance == null) {
            this._instance = new MapRoadUtils();
        }
        return this._instance;
    }

    /** 地图宽度 */
    private _mapWidth: number;

    /** 地图高度 */
    private _mapHeight: number;

    /** 地图一共分成几行 */
    private _row: number;

    /** 地图一共分成几列 */
    private _col: number;

    /** 地图路点单元格宽 */
    private _cellWidth: number;

    /** 地图路点单元格高 */
    private _cellHeight: number;

    /** 地图路点单元宽的一半 */
    private _halfCellWidth: number;

    /** 地图路点单元高的一半 */
    private _halfCellHeight: number;

    private _mapType: number;

    private _mapRoad: IMapRoad;

    public updateMapInfo(mapWidth: number, mapHeight: number, nodeWidth: number, nodeHeight: number, mapType: MapMode): void {
        this._mapWidth = mapWidth;
        this._mapHeight = mapHeight;
        this._cellWidth = nodeWidth;
        this._cellHeight = nodeHeight;

        this._halfCellWidth = Math.floor(this._cellWidth / 2);
        this._halfCellHeight = Math.floor(this._cellHeight / 2);

        this._mapType = mapType;

        switch (this._mapType) {
            case MapMode.angle45:
                this._col = Math.ceil(mapWidth / this._cellWidth);
                this._row = Math.ceil(mapHeight / this._cellHeight) * 2;
                this._mapRoad = new MapRoad45Angle(this._row, this._col, this._cellWidth, this._cellHeight, this._halfCellWidth, this._halfCellHeight); break;
            case MapMode.angle90:
                this._col = Math.ceil(mapWidth / this._cellWidth);
                this._row = Math.ceil(mapHeight / this._cellHeight);
                this._mapRoad = new MapRoad90Angle(this._row, this._col, this._cellWidth, this._cellHeight, this._halfCellWidth, this._halfCellHeight); break;
            case MapMode.honeycomb:
                // this._cellHeight = (this._cellWidth / 2) * 1.732;
                this._col = Math.ceil((this._mapWidth - this._cellWidth / 4) / (this._cellWidth / 4 * 6)) * 2;
                this._row = Math.ceil((this._mapHeight - this._cellHeight / 2) / this._cellHeight);
                this._mapRoad = new MapRoadHoneycomb(this._row, this._col, this._cellWidth, this._cellHeight, this._halfCellWidth, this._halfCellHeight); break;
            case MapMode.honeycomb2:
                // this._cellHeight = (this._cellWidth / 2) * 1.732;
                this._col = Math.ceil((this._mapWidth - this._cellHeight / 2) / this._cellHeight);
                this._row = Math.ceil((this._mapHeight - this._cellWidth / 4) / (this._cellWidth / 4 * 6)) * 2;
                this._mapRoad = new MapRoadHoneycomb2(this._row, this._col, this._cellWidth, this._cellHeight, this._halfCellWidth, this._halfCellHeight); break;
            default:
                break;
        }
    }

    /**
	 *根据地图平面像素坐标获得路节点
		* @param x
		* @param y
		* @return
		*
		*/
    public getNodeByPixel(x: number, y: number): RoadNode {
        if (this._mapRoad) {
            return this._mapRoad.getNodeByPixel(x, y);
        }
        return new RoadNode();
    }

    /**
	 *根据路点平面坐标点获得路节点
		* @param px
		* @param py
		* @return
		*
		*/
    public getNodeByDerect(dx: number, dy: number): RoadNode {
        if (this._mapRoad) {
            return this._mapRoad.getNodeByDerect(dx, dy);
        }
        return new RoadNode();
    }

    /**
	 *根据路点场景世界坐标获得路节点
		* @param cx
		* @param cy
		* @return
		*
		*/
    public getNodeByWorldPoint(cx: number, cy: number): RoadNode {
        if (this._mapRoad) {
            return this._mapRoad.getNodeByWorldPoint(cx, cy);
        }
        return new RoadNode();
    }

    /**
	 *根据像素坐标得到场景世界坐标
		* @param x
		* @param y
		* @return
		*
		*/
    public getWorldPointByPixel(x: number, y: number): Point {
        if (this._mapRoad) {
            return this._mapRoad.getWorldPointByPixel(x, y);
        }
        return new Point();
    }

    /**
     * 根据世界坐标获得像素坐标
     * @param cx
     * @param cy
     * @returns
     */
    public getPixelByWorldPoint(cx: number, cy: number): Point {
        if (this._mapRoad) {
            return this._mapRoad.getPixelByWorldPoint(cx, cy);
        }
        return new Point();
    }

    /**
     * 根据像素坐标获得网格平面坐标
     * @param x
     * @param y
     * @returns
     */
    public getDerectByPixel(x: number, y: number): Point {
        if (this._mapRoad) {
            return this._mapRoad.getDerectByPixel(x, y);
        }
        return new Point();
    }

    /**
     * 根据世界坐标获得网格平面坐标
     * @param cx
     * @param cy
     * @returns
     */
    public getDerectByWorldPoint(cx: number, cy: number): Point {
        if (this._mapRoad) {
            return this._mapRoad.getDerectByWorldPoint(cx, cy);
        }
        return new Point();
    }

    public getPixelByDerect(dx: number, dy: number): Point {
        if (this._mapRoad) {
            return this._mapRoad.getPixelByDerect(dx, dy);
        }
        return new Point();
    }

    public get mapWidth(): number {
        return this._mapWidth;
    }

    public get mapHeight(): number {
        return this._mapHeight;
    }

    public get cellWidth(): number {
        return this._cellWidth;
    }

    public get cellHeight(): number {
        return this._cellHeight;
    }

    public get row(): number {
        return this._row;
    }

    public get col(): number {
        return this._col;
    }

    public get halfCellWidth(): number {
        return this._halfCellWidth;
    }

    public get halfCellHeight(): number {
        return this._halfCellHeight;
    }

    /**
     * 地图类型 0:斜45度等视角地图, 1:90度角平面地图 2:六边形
     */
    public get mapType(): number {
        return this._mapType;
    }
}

/**
 *地图路点处理接口
 * @author Administrator
 *
 */
interface IMapRoad {
	/**
	 *根据地图平面像素坐标获得路节点
	 * @param x
	 * @param y
	 * @return
	 *
	 */
	getNodeByPixel(x: number, y: number): RoadNode;

	/**
	 *根据路点平面坐标点获得路节点
	 * @param px
	 * @param py
	 * @return
	 *
	 */
	getNodeByDerect(dx: number, dy: number): RoadNode;

	/**
	 *根据路点场景世界坐标获得路节点
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
	getNodeByWorldPoint(cx: number, cy: number): RoadNode;

	/**
	 *根据像素坐标得到场景世界坐标
	 * @param x
	 * @param y
	 * @return
	 *
	 */
	getWorldPointByPixel(x: number, y: number): Point;

	/**
	 *根据世界坐标获得像素坐标
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
	getPixelByWorldPoint(cx: number, cy: number): Point;

	/**
	 *根据像素坐标获得网格平面坐标
	 * @param x
	 * @param y
	 * @return
	 *
	 */
	getDerectByPixel(x: number, y: number): Point;

	/**
	 *根据世界坐标获得网格平面坐标
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
	getDerectByWorldPoint(cx: number, cy: number): Point;

	/**
	 *根据网格平面坐标获得像素坐标
	 * @param dx
	 * @param dy
	 * @return
	 *
	 */
	getPixelByDerect(dx: number, dy: number): Point;
}

/**
 *45度等视角地图路点处理接口实现
 * @author Administrator
 *
 */
class MapRoad45Angle implements IMapRoad {
    /**
	 *地图一共分成几行
	 */
    private _row: number;

    /**
	 *地图一共分成几列
	 */
    private _col: number;

    /**
	 *地图路点单元格宽
	 */
    private _cellWidth: number;

    /**
	 *地图路点单元格高
	 */
    private _cellHeight: number;

    /**
	 *地图路点单元宽的一半
	 */
    private _halfCellWidth: number;

    /**
	 *地图路点单元高的一半
	 */
    private _halfCellHeight: number;

    public constructor(row: number, col: number, nodeWidth: number, nodeHeight: number, halfNodeWidth: number, halfNodeHeight: number) {
        this._row = row;
        this._col = col;
        this._cellWidth = nodeWidth;
        this._cellHeight = nodeHeight;
        this._halfCellWidth = halfNodeWidth;
        this._halfCellHeight = halfNodeHeight;
    }

    /**
	 *根据地图平面像素坐标获得路节点
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getNodeByPixel(x: number, y: number): RoadNode {
        const wPoint: Point = this.getWorldPointByPixel(x, y);
        const fPoint: Point = this.getPixelByWorldPoint(wPoint.x, wPoint.y);
        const dPoint: Point = this.getDerectByPixel(x, y);

        const node: RoadNode = new RoadNode();

        node.cx = wPoint.x;
        node.cy = wPoint.y;

        node.px = fPoint.x;
        node.py = fPoint.y;

        node.dx = dPoint.x;
        node.dy = dPoint.y;

        return node;
    }

    /**
	 *根据路点平面坐标点获得路节点
	 * @param px
	 * @param py
	 * @return
	 *
	 */
    public getNodeByDerect(dx: number, dy: number): RoadNode {
        const fPoint: Point = this.getPixelByDerect(dx, dy);
        const wPoint: Point = this.getWorldPointByPixel(fPoint.x, fPoint.y);

        const node: RoadNode = new RoadNode();

        node.cx = wPoint.x;
        node.cy = wPoint.y;

        node.px = fPoint.x;
        node.py = fPoint.y;

        node.dx = dx;
        node.dy = dy;

        return node;
    }

    /**
	 *根据路点场景世界坐标获得路节点
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getNodeByWorldPoint(cx: number, cy: number): RoadNode {
        const point: Point = this.getPixelByWorldPoint(cx, cy);
        return this.getNodeByPixel(point.x, point.y);
    }

    /**
	 *根据像素坐标得到场景世界坐标
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getWorldPointByPixel(x: number, y: number): Point {
        const cx: number = Math.ceil(x / this._cellWidth - 0.5 + y / this._cellHeight) - 1;
        const cy: number = (this._col - 1) - Math.ceil(x / this._cellWidth - 0.5 - y / this._cellHeight);

        return new Point(cx, cy);
    }

    /**
	 *根据世界坐标获得像素坐标
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getPixelByWorldPoint(cx: number, cy: number): Point {
        const x: number = Math.floor((cx + 1 - (cy - (this._col - 1))) * this._halfCellWidth);
        const y: number = Math.floor((cx + 1 + (cy - (this._col - 1))) * this._halfCellHeight);
        return new Point(x, y);
    }

    /**
	 *根据像素坐标获得网格平面坐标
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getDerectByPixel(x: number, y: number): Point {
        const worldPoint: Point = this.getWorldPointByPixel(x, y);
        const pixelPoint: Point = this.getPixelByWorldPoint(worldPoint.x, worldPoint.y);
        const dx: number = Math.floor(pixelPoint.x / this._cellWidth) - (pixelPoint.x % this._cellWidth == 0 ? 1 : 0);
        const dy: number = Math.floor(pixelPoint.y / this._halfCellHeight) - 1;
        return new Point(dx, dy);
    }

    /**
	 *根据世界坐标获得网格平面坐标
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getDerectByWorldPoint(cx: number, cy: number): Point {
        const dx: number = Math.floor((cx - (cy - (this._col - 1))) / 2);
        const dy: number = cx + (cy - (this._col - 1));
        return new Point(dx, dy);
    }

    /**
	 *根据网格平面坐标获得像素坐标
	 * @param dx
	 * @param dy
	 * @return
	 *
	 */
    public getPixelByDerect(dx: number, dy: number): Point {
        const x: number = Math.floor((dx + dy % 2) * this._cellWidth + (1 - dy % 2) * this._halfCellWidth);
        const y: number = Math.floor((dy + 1) * this._halfCellHeight);
        return new Point(x, y);
    }
}

/**
 *90度平面地图路点处理接口实现
 * @author Administrator
 *
 */
class MapRoad90Angle implements IMapRoad {
    /**
	 *地图一共分成几行
	 */
    private _row: number;

    /**
	 *地图一共分成几列
	 */
    private _col: number;

    /**
	 *地图路点单元格宽
	 */
    private _cellWidth: number;

    /**
	 *地图路点单元格高
	 */
    private _cellHeight: number;

    /**
	 *地图路点单元宽的一半
	 */
    private _halfCellWidth: number;

    /**
	 *地图路点单元高的一半
	 */
    private _halfCellHeight: number;

    public constructor(row: number, col: number, nodeWidth: number, nodeHeight: number, halfNodeWidth: number, halfNodeHeight: number) {
        this._row = row;
        this._col = col;
        this._cellWidth = nodeWidth;
        this._cellHeight = nodeHeight;
        this._halfCellWidth = halfNodeWidth;
        this._halfCellHeight = halfNodeHeight;
    }

    /**
	 *根据地图平面像素坐标获得路节点
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getNodeByPixel(x: number, y: number): RoadNode {
        const wPoint: Point = this.getWorldPointByPixel(x, y);
        const fPoint: Point = this.getPixelByWorldPoint(wPoint.x, wPoint.y);
        const dPoint: Point = this.getDerectByPixel(x, y);

        const node: RoadNode = new RoadNode();

        node.cx = wPoint.x;
        node.cy = wPoint.y;

        node.px = fPoint.x;
        node.py = fPoint.y;

        node.dx = dPoint.x;
        node.dy = dPoint.y;

        return node;
    }

    /**
	 *根据路点平面坐标点获得路节点
	 * @param px
	 * @param py
	 * @return
	 *
	 */
    public getNodeByDerect(dx: number, dy: number): RoadNode {
        const fPoint: Point = this.getPixelByDerect(dx, dy);
        const wPoint: Point = this.getWorldPointByPixel(fPoint.x, fPoint.y);

        const node: RoadNode = new RoadNode();

        node.cx = wPoint.x;
        node.cy = wPoint.y;

        node.px = fPoint.x;
        node.py = fPoint.y;

        node.dx = dx;
        node.dy = dy;

        return node;
    }

    /**
	 *根据路点场景世界坐标获得路节点
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getNodeByWorldPoint(cx: number, cy: number): RoadNode {
        const point: Point = this.getPixelByWorldPoint(cx, cy);
        return this.getNodeByPixel(point.x, point.y);
    }

    /**
	 *根据像素坐标得到场景世界坐标
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getWorldPointByPixel(x: number, y: number): Point {
        const cx: number = Math.floor(x / this._cellWidth);
        const cy: number = Math.floor(y / this._cellHeight);

        return new Point(cx, cy);
    }

    /**
	 *根据世界坐标获得像素坐标
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getPixelByWorldPoint(cx: number, cy: number): Point {
        const x: number = Math.floor((cx + 1) * this._cellWidth - this._halfCellWidth);
        const y: number = Math.floor((cy + 1) * this._cellHeight - this._halfCellHeight);
        return new Point(x, y);
    }

    /**
	 *根据像素坐标获得网格平面坐标
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getDerectByPixel(x: number, y: number): Point {
        const dx: number = Math.floor(x / this._cellWidth);
        const dy: number = Math.floor(y / this._cellHeight);
        return new Point(dx, dy);
    }

    /**
	 *根据世界坐标获得网格平面坐标 90度地图的世界坐标和网格坐标相同
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getDerectByWorldPoint(cx: number, cy: number): Point {
        return new Point(cx, cy);
    }

    /**
	 *根据网格平面坐标获得像素坐标
	 * @param dx
	 * @param dy
	 * @return
	 *
	 */
    public getPixelByDerect(dx: number, dy: number): Point {
        const x: number = Math.floor((dx + 1) * this._cellWidth - this._halfCellWidth);
        const y: number = Math.floor((dy + 1) * this._cellHeight - this._halfCellHeight);
        return new Point(x, y);
    }
}

/**
 *蜂巢式（即正六边形）地图路点处理接口实现
 * @author Administrator
 *
 */
class MapRoadHoneycomb implements IMapRoad {
    /**
	 *地图一共分成几行
	 */
    private _row: number;

    /**
	 *地图一共分成几列
	 */
    private _col: number;

    /**
	 *地图路点单元格宽
	 */
    private _cellWidth: number;

    /**
	 *地图路点单元格高
	 */
    private _cellHeight: number;

    /**
	 *地图路点单元宽的一半
	 */
    private _halfCellWidth: number;

    /**
	 *地图路点单元高的一半
	 */
    private _halfCellHeight: number;

    /**
	 * 六边形直径的4分之一
	 */
    private _nwDiv4: number;

    /**
	 * 六边形直径的半径
	 */
    private _radius: number;

    /**
	 * 六边形宽高的tan值，正六边形为1.732
	 */
    private _proportion = 1.732;

    /**
	 *蜂巢式（即正六边形）地图路点处理
	 * @param row
	 * @param col
	 * @param nodeWidth
	 * @param nodeHeight
	 * @param halfNodeWidth
	 * @param halfNodeHeight
	 *
	 */
    public constructor(row: number, col: number, nodeWidth: number, nodeHeight: number, halfNodeWidth: number, halfNodeHeight: number) {
        this._row = row;
        this._col = col;
        this._cellWidth = nodeWidth;
        // this._cellHeight = (this._cellWidth / 2) * 1.732;
        this._cellHeight = nodeHeight;
        this._halfCellWidth = halfNodeWidth;
        this._halfCellHeight = halfNodeHeight;

        this._nwDiv4 = this._cellWidth / 4;
        this._radius = this._nwDiv4 * 4;

        this._proportion = this._cellHeight * 2 / this._cellWidth;
    }

    /**
	 *根据地图平面像素坐标获得路节点
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getNodeByPixel(x: number, y: number): RoadNode {
        const wPoint: Point = this.getWorldPointByPixel(x, y);
        const fPoint: Point = this.getPixelByWorldPoint(wPoint.x, wPoint.y);
        // var dPoint:Point = getDerectByPixel(x,y);

        const node: RoadNode = new RoadNode();

        node.cx = wPoint.x;
        node.cy = wPoint.y;

        node.px = fPoint.x;
        node.py = fPoint.y;

        node.dx = wPoint.x;
        node.dy = wPoint.y;

        return node;
    }

    /**
	 *根据路点平面坐标点获得路节点
	 * @param px
	 * @param py
	 * @return
	 *
	 */
    public getNodeByDerect(dx: number, dy: number): RoadNode {
        const fPoint: Point = this.getPixelByDerect(dx, dy);
        // var wPoint:Point = getWorldPointByPixel(fPoint.x,fPoint.y);

        const node: RoadNode = new RoadNode();

        node.cx = dx;
        node.cy = dy;

        node.px = fPoint.x;
        node.py = fPoint.y;

        node.dx = dx;
        node.dy = dy;

        return node;
    }

    /**
	 *根据路点场景世界坐标获得路节点
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getNodeByWorldPoint(cx: number, cy: number): RoadNode {
        const point: Point = this.getPixelByWorldPoint(cx, cy);
        return this.getNodeByPixel(point.x, point.y);
    }

    /**
	 *根据像素坐标得到场景世界坐标
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getWorldPointByPixel(x: number, y: number): Point {
        const nwDiv4Index: number = Math.floor(x / this._nwDiv4); // 六边形的外切矩形竖方向均等分成4分，所有的六边形外切矩形连在一起形成一个个4分之一矩形宽的区域，nwDiv4Index就是该区域的索引

        const col: number = Math.floor(nwDiv4Index / 3); // 取得临时六边形横轴的索引,根据不同的情况可能会变

        let row: number; // 六边形纵轴的索引

        let cx: number;

        let cy: number;

        if ((nwDiv4Index - 1) % 6 === 0 || (nwDiv4Index - 2) % 6 === 0) {
            row = Math.floor(y / this._cellHeight);
            cx = col;
            cy = row;
        } else if ((nwDiv4Index - 4) % 6 === 0 || (nwDiv4Index - 5) % 6 === 0) {
            if (y < this._cellHeight / 2) {
                row = -1;
            } else {
                row = Math.floor((y - this._cellHeight / 2) / this._cellHeight);
            }
            cx = col;
            cy = row;
        } else if (col % 2 === 0) {
            // (x - 1,y - 1)  (x - 1,y)
            row = Math.floor(y / this._cellHeight);

            if (this.testPointInHoneycomb(col, row, x, y)) {
                cx = col;
                cy = row;
            } else if (this.testPointInHoneycomb(col - 1, row - 1, x, y)) {
                cx = col - 1;
                cy = row - 1;
            } else {
                cx = col - 1;
                cy = row;
            }
        } else {
            // (x - 1,y)  (x - 1,y + 1)

            if (y < this._cellHeight / 2) {
                row = -1;
            } else {
                row = Math.floor((y - this._cellHeight / 2) / this._cellHeight);
            }

            if (this.testPointInHoneycomb(col, row, x, y)) {
                cx = col;
                cy = row;
            } else if (this.testPointInHoneycomb(col - 1, row, x, y)) {
                cx = col - 1;
                cy = row;
            } else {
                cx = col - 1;
                cy = row + 1;
            }
        }

        return new Point(cx, cy);
    }

    private testPointInHoneycomb(col: number, row: number, px: number, py: number): boolean {
        const a: number = this._nwDiv4 * 2;

        const point: Point = this.getPixelByWorldPoint(col, row);

        const absX: number = Math.abs(px - point.x);
        const absY: number = Math.abs(py - point.y);

        // return a-absX >= absY/(1.732);

        return a - absX >= absY / this._proportion;
    }

    /**
	 *根据世界坐标获得像素坐标
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getPixelByWorldPoint(cx: number, cy: number): Point {
        const x: number = Math.floor((2 + 3 * cx) / 4 * this._cellWidth);
        const y: number = Math.floor((cy + 1 / 2 * (1 + (cx % 2))) * this._cellHeight);

        return new Point(x, y);
    }

    /**
	 *根据像素坐标获得网格平面坐标
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getDerectByPixel(x: number, y: number): Point {
        return this.getWorldPointByPixel(x, y);
    }

    /**
	 *根据世界坐标获得网格平面坐标 90度地图的世界坐标和网格坐标相同
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getDerectByWorldPoint(cx: number, cy: number): Point {
        return new Point(cx, cy);
    }

    /**
	 *根据网格平面坐标获得像素坐标
	 * @param dx
	 * @param dy
	 * @return
	 *
	 */
    public getPixelByDerect(dx: number, dy: number): Point {
        const x: number = (2 + 3 * dx) / 4 * this._cellWidth;
        const y: number = (dy + 1 / 2 * (1 + (dx % 2))) * this._cellHeight;
        return new Point(x, y);
    }
}

/**
 *蜂巢式（即正六边形）地图路点处理接口实现 横
 * @author Administrator
 *
 */
class MapRoadHoneycomb2 implements IMapRoad {
    private mapRoadHoneycomb: MapRoadHoneycomb;

    /**
	 *蜂巢式（即正六边形）地图路点处理
	 * @param row
	 * @param col
	 * @param nodeWidth
	 * @param nodeHeight
	 * @param halfNodeWidth
	 * @param halfNodeHeight
	 *
	 */
    public constructor(row: number, col: number, nodeWidth: number, nodeHeight: number, halfNodeWidth: number, halfNodeHeight: number) {
        this.mapRoadHoneycomb = new MapRoadHoneycomb(row, col, nodeWidth, nodeHeight, halfNodeWidth, halfNodeHeight);
    }

    /**
	 * 转置路节点，即把x,y轴调换过来
	 * @param node
	 */
    private transposedNode(node: RoadNode): RoadNode {
        const tempCx:number = node.cx;
        const tempDx:number = node.dx;
        const tempPx:number = node.px;

        node.cx = node.cy;
        node.cy = tempCx;

        node.dx = node.dy;
        node.dy = tempDx;

        node.px = node.py;
        node.py = tempPx;

        return node;
    }

    /**
	 * 转置坐标点，即把x,y轴调换过来
	 * @param point
	 */
    private transposedPoint(point: Point): Point {
        const tempX = point.x;
        point.x = point.y;
        point.y = tempX;

        return point;
    }

    /**
	 *根据地图平面像素坐标获得路节点
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getNodeByPixel(x: number, y: number): RoadNode {
        return this.transposedNode(this.mapRoadHoneycomb.getNodeByPixel(y, x));
    }

    /**
	 *根据路点平面坐标点获得路节点
	 * @param px
	 * @param py
	 * @return
	 *
	 */
    public getNodeByDerect(dx: number, dy: number): RoadNode {
        return this.transposedNode(this.mapRoadHoneycomb.getNodeByDerect(dy, dx));
    }

    /**
	 *根据路点场景世界坐标获得路节点
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getNodeByWorldPoint(cx: number, cy: number): RoadNode {
        return this.transposedNode(this.mapRoadHoneycomb.getNodeByWorldPoint(cy, cx));
    }

    /**
	 *根据像素坐标得到场景世界坐标
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getWorldPointByPixel(x: number, y: number): Point {
        return this.transposedPoint(this.mapRoadHoneycomb.getWorldPointByPixel(y, x));
    }

    /**
	 *根据世界坐标获得像素坐标
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getPixelByWorldPoint(cx: number, cy: number): Point {
        return this.transposedPoint(this.mapRoadHoneycomb.getPixelByWorldPoint(cy, cx));
    }

    /**
	 *根据像素坐标获得网格平面坐标
	 * @param x
	 * @param y
	 * @return
	 *
	 */
    public getDerectByPixel(x: number, y: number): Point {
        return this.transposedPoint(this.mapRoadHoneycomb.getDerectByPixel(y, x));
    }

    /**
	 *根据世界坐标获得网格平面坐标 90度地图的世界坐标和网格坐标相同
	 * @param cx
	 * @param cy
	 * @return
	 *
	 */
    public getDerectByWorldPoint(cx: number, cy: number): Point {
        return this.transposedPoint(this.mapRoadHoneycomb.getDerectByWorldPoint(cy, cx));
    }

    /**
	 *根据网格平面坐标获得像素坐标
	 * @param dx
	 * @param dy
	 * @return
	 *
	 */
    public getPixelByDerect(dx: number, dy: number): Point {
        return this.transposedPoint(this.mapRoadHoneycomb.getPixelByDerect(dy, dx));
    }
}
