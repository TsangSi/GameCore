/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * @Author: kexd
 * @Date: 2022-04-25 21:04:04
 * @LastEditors: kexd
 * @LastEditTime: 2022-06-01 16:46:36
 * @FilePath: \SanGuo\assets\script\game\base\mapBase\road\MapMode.ts
 * @Description:
 *
 */

/** import {' cc.Texture2D } 'from 'cc';  //*/
// import PathFindingAgent from './PathFindingAgent';

export enum MapMode {
    /** 90度平面地图 */
    angle90 = 0,

    /** 45度等视角地图 */
    angle45 = 1,

    /** 纵式六边形地图类型 */
    honeycomb = 2,

    /** 横式六边形地图类型(编辑器没使用) */
    honeycomb2 = 3,
}

/**
 * 地图参数
 */
export class MapParams {
    public name: string = '';
    public mapType: MapMode = MapMode.angle90;
    public mapWidth: number = 750;
    public mapHeight: number = 1600;
    public cellWidth: number = 32;
    public cellHeight: number = 32;
    public bgTex: cc.Texture2D = null;
    public bgName: string = '';
}

export class MapInfo {
    public name: string = '未命名';
    public bgName: string = 'map_bg';
    public type: MapMode = MapMode.angle90;
    public mapWidth: number = 0;
    public mapHeight: number = 0;
    public cellWidth: number = 0;
    public cellHeight: number = 0;
    public roadDataArr: number[][] = [];
    public mapItems: object[] = [];

    public constructor(info?: MapSaveInfo) {
        if (info) {
            this.type = info.type;
            this.mapWidth = info.mapWidth;
            this.mapHeight = info.mapHeight;
            this.cellWidth = info.cellWidth;
            this.cellHeight = info.cellHeight;
            this.mapItems = info.mapItems;
            // this.roadDataArr = PathFindingAgent.I.dCode(info.roads);
        }
    }
}

export class MapSaveInfo {
    public type: MapMode = MapMode.angle90;
    public mapWidth: number = 0;
    public mapHeight: number = 0;
    public cellWidth: number = 0;
    public cellHeight: number = 0;
    public roads: string = '';
    public mapItems: object[] = [];
    public constructor(info?: MapInfo) {
        if (info) {
            this.type = info.type;
            this.mapWidth = info.mapWidth;
            this.mapHeight = info.mapHeight;
            this.cellWidth = info.cellWidth;
            this.cellHeight = info.cellHeight;
            this.mapItems = info.mapItems;
            // this.roads = PathFindingAgent.I.eCode(info.roadDataArr);
        }
    }
}
