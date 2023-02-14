/* eslint-disable max-len */
import {
 _decorator, Node, Camera, CCBoolean, view, v3, EventTouch, Vec2, Texture2D, UITransform, size, SpriteFrame, resources, JsonAsset, assetManager, ImageAsset, v2, js,
} from 'cc';
import Actor from '../action/Actor';
import MapAvatar from '../action/MapAvatar';
import { EventM } from '../core/event/EventManager';
import { winSize } from '../global/GConst';
import EntityLayer from '../layer/EntityLayer';
import MapLayer from '../layer/MapLayer';
import { BaseView } from '../ui/base/BaseView';
import { UI_NAME } from '../ui/UIConfig';
import UIManager from '../ui/UIManager';
import { MapConst } from './base/MapConst';
import EntityManager from './EntityManager';
import MapRoadUtils from './road/MapRoadUtils';
import RoadNode from './road/RoadNode';
import SceneMapManager from './SceneMapManager';

const { ccclass, property } = _decorator;

interface DragInfo {
    StartPos: Vec2;
    Touch: boolean;
}
@ccclass('SceneMap')
export class SceneMap extends BaseView {
    @property(Node)
    public layer: Node;

    @property(MapLayer)
    public mapLayer: MapLayer = null;

    @property(EntityLayer)
    public entityLayer: EntityLayer = null;

    // private _PlayerAvatar: PlayerAvatar = undefined;
    // public get PlayerAvatar(): PlayerAvatar {
    //     if (this._PlayerAvatar === undefined) {
    //         this._PlayerAvatar = EntityManager.I.getPlayerAvatar();
    //     }
    //     return this._PlayerAvatar;
    // }

    // private target: Vec2 = v2(0, 0);

    @property(Camera)
    private camera: Camera = null;

    @property(CCBoolean)
    public isFollowPlayer = true;

    private _mapParams: MapConst.MapParams = null;

    private dragInfo: DragInfo = js.createMap(true);

    protected onLoad(): void {
        const winSize = view.getDesignResolutionSize();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        window.winSize.width = winSize.width;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        window.winSize.height = winSize.height;
    }

    protected start(): void {
        this.on(EventM.Type.Player.MovePlayerByPos, this.onMovePlayerByPos);
        this.on(EventM.Type.Player.StopMove, this.onStopMove);
        this.on(EventM.Type.SceneMap.MoveToPos, this.onMoveToPos);
    }
    public startLoadMap(mapId = 1002): void {
        this.loadSlicesMap(mapId);
        this.node.position = v3(-winSize.width / 2, -winSize.height / 2, 0);
        this.node.on(Node.EventType.TOUCH_START, this.onMapTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMapTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMapTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onMapTouchEnd, this);
    }

    private onMapTouchStart(event: EventTouch) {
        this.dragInfo.StartPos = event.getUILocation();
        this.dragInfo.Touch = false;
    }

    private onMapTouchMove(event: EventTouch) {
        const currentPos = event.getUILocation();
        const dis: Vec2 = v2(0, 0);
        Vec2.subtract(dis, currentPos, this.dragInfo.StartPos);
        if (dis.length() > 2) {
            this.dragInfo.Touch = true;
            this.dragInfo.StartPos = currentPos;
            this.mapMoveBy(dis);
        }
    }

    private onMapTouchEnd(event: EventTouch) {
        if (!this.dragInfo.Touch) {
            const currentPos = event.getUILocation();
            // const entity: Actor = EntityManager.I.getEntityByHandle(10001);
            const x = (currentPos.x - winSize.width * 0.5) - this.node.position.x;
            const y = (currentPos.y - winSize.height * 0.5) - this.node.position.y;
            // if (entity) {
            //     entity.moveToPos(x, y);
            // }
            console.log('click pos:', x.toFixed(1), y.toFixed(1));
            const entitys: {[handle: number]: Actor} = EntityManager.I.getEntities();
            let change = 0;
            for (const handle in entitys) {
                const entity = entitys[handle];
                entity.moveToPos(x, y);
                change++;
            }
            if (change === 0) {
                UIManager.I.show(UI_NAME.Test);
            }
        }
        this.dragInfo.Touch = false;
    }

    private mapMoveBy(dis: Vec2) {
        let x = this.node.position.x + dis.x;
        let y = this.node.position.y + dis.y;
        if (x > winSize.width * -0.5) {
            x = winSize.width * -0.5;
        }
        if (x < (winSize.width * 0.5 - this._mapParams.mapWidth)) {
            x = winSize.width * 0.5 - this._mapParams.mapWidth;
        }
        if (y > winSize.height * -0.5) {
            y = winSize.height * -0.5;
        }
        if (y < (winSize.height * 0.5 - this._mapParams.mapHeight)) {
            y = winSize.height * 0.5 - this._mapParams.mapHeight;
        }
        this.node.setPosition(x, y);
        this.setViewToPlayer();
    }

    private onMoveToPos(x = 7800, y = 6900) {
        const halfWidth = this._mapParams.mapWidth * 0.5;
        const halfHeight = this._mapParams.mapHeight * 0.5;
        const mapPos = v2(0, 0);
        mapPos.x = winSize.width * 0.5 - halfWidth;
        mapPos.y = winSize.height * 0.5 - halfHeight;
        const dis = v2(0, 0);
        dis.x = (halfWidth - x) - (this.node.position.x + halfWidth);
        dis.y = (halfHeight - y) - (this.node.position.y + halfHeight);
        this.mapMoveBy(dis);
    }
    /**
     * 加载单张地图
     */
    protected loadSingleMap(mapId: number): void {
        resources.load(`map/${mapId}`, JsonAsset, (error: Error, res: JsonAsset) => {
            const mapData = new MapConst.MapData();
            for (const k in mapData) {
                mapData[k] = res.json[k];
            }
            resources.load(`map/${mapData.bgName}/spriteFrame`, SpriteFrame, (error: Error, tex: SpriteFrame) => {
                this.node.active = true;
                this.init(mapData, tex, MapConst.MapLoadModel.single);
            });
        });
    }

    /**
      * 加载分切片地图
      */
    protected loadSlicesMap(mapId: number): void {
        const url = `http://192.168.123.95/h5/map/${mapId}.json`;
        assetManager.loadRemote(url, (err: Error, res: JsonAsset) => {
            const mapData = new MapConst.MapData();
            for (const k in mapData) {
                mapData[k] = res.json[k];
            }

            assetManager.loadRemote(`http://192.168.123.95/h5/map/minimap/${mapData.bgName}.jpg`, (err: Error, imageAsset: ImageAsset) => {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;
                this.node.active = true;
                this.init(mapData, spriteFrame, MapConst.MapLoadModel.slices);
            });
        });
    }
    private init(mapData: MapConst.MapData, bgTex: SpriteFrame, mapLoadModel: MapConst.MapLoadModel = 1) {
        const winSize = view.getDesignResolutionSize();

        MapRoadUtils.instance.updateMapInfo(mapData.mapWidth, mapData.mapHeight, mapData.nodeWidth, mapData.nodeHeight, mapData.type);

        // 初始化底图参数
        this._mapParams = new MapConst.MapParams();
        this._mapParams.name = mapData.name;
        this._mapParams.bgName = mapData.bgName;
        this._mapParams.mapType = mapData.type;
        this._mapParams.mapWidth = mapData.mapWidth;
        this._mapParams.mapHeight = mapData.mapHeight;
        this._mapParams.ceilWidth = mapData.nodeWidth;
        this._mapParams.ceilHeight = mapData.nodeHeight;
        this._mapParams.maxIndex = v2(Math.ceil(this._mapParams.mapWidth / this._mapParams.sliceWidth), Math.ceil(this._mapParams.mapHeight / this._mapParams.sliceHeight));

        this._mapParams.viewWidth = mapData.mapWidth > winSize.width ? winSize.width : mapData.mapWidth;
        this._mapParams.viewHeight = mapData.mapHeight > winSize.height ? winSize.height : mapData.mapHeight;
        // this._mapParams.sliceWidth = 256;
        // this._mapParams.sliceHeight = 256;
        this._mapParams.bgTex = bgTex;
        this._mapParams.mapLoadModel = mapLoadModel;

        this.mapLayer.init(this._mapParams);

        // this.node.setPosition(mapData.mapWidth * -0.5, mapData.mapHeight * -0.5);
        this.node.setPosition(-7800, -6900);
        // this.node.setPosition(0, 0);

        const len: number = mapData.roadDataArr.length;
        const len2: number = mapData.roadDataArr[0].length;

        let value = 0;
        let dx = 0;
        let dy = 0;

        const scenemapMgr = SceneMapManager.I;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len2; j++) {
                value = mapData.roadDataArr[i][j];
                dx = j;
                dy = i;

                const node: RoadNode = MapRoadUtils.instance.getNodeByDerect(dx, dy);
                node.value = value;

                scenemapMgr.addRoadNode(node.cx, node.cy, node);
            }
        }
        scenemapMgr.setMapType(mapData.type);
        this.node.getComponent(UITransform).setContentSize(size(this.mapLayer.width, this.mapLayer.height));

        this.setViewToPlayer();

        EventM.I.fire(EventM.Type.SceneMap.LoadComplete);
    }

    private onMovePlayerByPos(targetX: number, targetY: number) {
        this.movePlayerByPos(targetX, targetY);
    }

    /**
    * 移动玩家到某个坐标点
    * @param targetX 移动到的目标点x
    * @param targetY 移到到的目标点y
    *
    */
    private movePlayerByPos(targetX: number, targetY: number) {
        //
        console.log('targetX=', targetX, targetY);
    }

    /** 收到事件停止移动 */
    private onStopMove() {
        // this.PlayerAvatar.stop();
    }

    /**
     * 视图跟随玩家
     * @param dt
     */
    public followPlayer(): void {
        //
    }

    /**
     *把视野定位到给定位置
    * @param px
    * @param py
    *
    */
    public setViewToPoint(px: number, py: number): void {
        const winSize = view.getDesignResolutionSize();
        if (this._mapParams.mapLoadModel === MapConst.MapLoadModel.slices) {
            this.mapLayer.loadSliceImage(this._mapParams.mapWidth - (px + this._mapParams.mapWidth + winSize.width / 2), this._mapParams.mapHeight - (py + this._mapParams.mapHeight + winSize.height / 2));
        }
    }
    /**
     * 将视野对准玩家
     */
    private setViewToPlayer() {
        this.setViewToPoint(this.node.position.x, this.node.position.y);
    }
    // protected lateUpdate(dt: number): void {
    // }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onMapTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onMapTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onMapTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onMapTouchEnd, this);
        EventM.I.off(EventM.Type.Player.MovePlayerByPos, this.onMovePlayerByPos, this);
        EventM.I.off(EventM.Type.Player.StopMove, this.onStopMove, this);
    }
}
