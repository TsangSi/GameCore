import { director, js, Vec2 } from 'cc';
import { MapConst } from './base/MapConst';
import AstarHoneycombRoadSeeker from './road/AstarHoneycombRoadSeeker';
import AStarRoadSeeker from './road/AStarRoadSeeker';
import IRoadSeeker from './road/IRoadSeeker';
import MapRoadUtils from './road/MapRoadUtils';
import RoadNode from './road/RoadNode';
import { SceneMap } from './SceneMap';

export default class SceneMapManager {
    private static _I: SceneMapManager = null;
    public static get I(): SceneMapManager {
        if (this._I == null) {
            this._I = new SceneMapManager();
        }
        return this._I;
    }

    private _mapType: MapConst.MapType;
    public get mapType(): MapConst.MapType {
        return this._mapType;
    }
    public setMapType(mapType: MapConst.MapType): void {
        this._mapType = mapType;

        if (mapType === MapConst.MapType.honeycomb) {
            this._roadSeeker = new AstarHoneycombRoadSeeker(this._roadDic);
        } else {
            this._roadSeeker = new AStarRoadSeeker(this._roadDic);
        }
    }

    private _roadSeeker: IRoadSeeker;
    public get roadSeeker(): IRoadSeeker {
        return this._roadSeeker;
    }

    /** 路点Node */
    private _roadDic: { [key: string]: RoadNode; } = js.createMap(true);

    private _enterMap = false;
    public get enterMap(): boolean {
        return this._enterMap;
    }
    public set enterMap(b: boolean) {
        this._enterMap = b;
    }

    private _isFirst = true;
    public setFirst(b: boolean): void {
        this._isFirst = b;
    }
    public isFirst(): boolean {
        return this._isFirst;
    }

    private _SceneMap: SceneMap = undefined;
    public get SceneMap(): SceneMap {
        if (!this._SceneMap) {
            this._SceneMap = <SceneMap>director.getScene().getComponentInChildren('SceneMap');
        }
        return this._SceneMap;
    }

    public startEnterMap(mapId = 1003): void {
        this.SceneMap.startLoadMap(mapId);
    }

    public addRoadNode(x: number, y: number, roadNode: RoadNode): void {
        this._roadDic[`${x}_${y}`] = roadNode;
    }

    public getRoadNodeByWorldPoint(x: number, y: number): RoadNode {
        return this._roadDic[`${x}_${y}`];
    }

    /**
     * 根据像素坐标获得地图节点
     * @param px
     * @param py
     */
    public getRoadNodeByPixel(px: number, py: number): RoadNode {
        const point: Vec2 = MapRoadUtils.instance.getWorldPointByPixel(px, py);
        return this.getRoadNodeByWorldPoint(point.x, point.y);
    }

    public addToEntity(node: Node): void {
        // this.SceneMap.entityLayer.
    }
}
