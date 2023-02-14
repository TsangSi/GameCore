/* eslint-disable @typescript-eslint/no-namespace */

import { Vec2 } from "cc";

/* eslint-disable @typescript-eslint/ban-types */
export namespace MapConst {

    export enum MapType {
        angle45,
        angle90,
        honeycomb
    }

    export enum MapLoadModel {
        /** 单张地图加载 */
        single,
        /** 切片加载 */
        slices
    }

    export enum CharactorState {
        stand,
        run,
        sitdown,
        sitdown_run
    }

    export class MapData {
        public name = '';
        public bgName = '';
        public type: MapConst.MapType = MapConst.MapType.angle45;
        public mapWidth = 0;
        public mapHeight = 0;
        public nodeWidth = 0;
        public nodeHeight = 0;
        public roadDataArr: number[][] = [];
        // public row:number = 0;
        // public col:number = 0;

        public mapItem: object[] = [];
    }
    export class MapParams {
        /** 地图名称 */
        public name = '';
        /** 底图资源名称 */
        public bgName = '';
        /** 地图类型 */
        public mapType: MapConst.MapType = MapConst.MapType.angle45;
        /** 地图宽 */
        public mapWidth: number;
        /** 地图高 */
        public mapHeight: number;
        /** 地图单元格宽 */
        public ceilWidth: number;
        /** 地图单元格高 */
        public ceilHeight: number;
        /** 地图视野宽 */
        public viewWidth: number;
        /** 地图视野高 */
        public viewHeight: number;
        /** 地图切片宽 */
        public sliceWidth: number = 512;
        /** 地图切片高 */
        public sliceHeight: number = 512;
        /** 最大索引 */
        public maxIndex: Vec2;
        /** 最小索引 */
        public minIndex: Vec2;
        /** 底图加载模式，是单张还是切片加载 */
        public mapLoadModel: MapConst.MapLoadModel = MapConst.MapLoadModel.single;
        /** 地图底图 */
        public bgTex = null;
    }
}
