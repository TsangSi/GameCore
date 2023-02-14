/* eslint-disable max-len */
import {
 Label, Node, Rect, v2, Vec2, Vec3,
} from 'cc';
import { EntityType } from '../global/GConst';
import EntityManager from '../map/EntityManager';
import { UtilsNumber } from '../utils/UtilsNumber';
import { ACTION_DIRECT, ACTION_RES_TYPE, ACTION_STATUS_TYPE } from './ActionConfig';
import Actor from './Actor';
import { Quadtree } from './QuadTree';

// interface AnimaData {
//     weaponResID?: number,
//     horseResID?: number,
//     circleResID?: number,
//     wingResID?: number,
//     preciousResID?: number,
//     soulResID?: number;
// }

// class Role extends Node {
//     public playAction(resAction: string, dir?: number, warpMode: WarpMode = AnimationClip.WrapMode.Loop) {
//         this.children.forEach((node) => {
//             node.playAction(resAction, dir, warpMode);
//         });
//     }

//     public release() {
//         this.children.forEach((node) => {
//             node.release();
//         });
//     }
// }
export default class MapAvatar extends Actor {
    public constructor(id?: number) {
        super(id);
        this.__name = 'MapAvatar';
        // const node = new Node('name');
        // const l = node.addComponent(Label);
        // l.string = id ? id.toString() : '1111';
        // l.cacheMode = Label.CacheMode.CHAR;
        // this.addChild(node);
    }

    private mainId: number;
    private soldiers: number[] = [];
    private tree: Quadtree;
    public addSoldier(count = 1): void {
        // if (this.soldiers.indexOf(id) >= 0) {
        //     console.log('已有该士兵');
        //     return;
        // }
        // console.log('添加士兵');
        // this.tree = new Quadtree(new Rect(0, 0, 100, 100));
        this.points = this.roundPoints(this.position.x, this.position.y);
        this.setScale(2, 2);
        for (let i = 0; i < count; i++) {
            const entity = EntityManager.I.createEntity(EntityType.MapAvatar, +`${this.__Info.resId}${UtilsNumber.FillZero(i, 3)}`);
            entity.updateAttri('resId', 10001);
            entity.updateAttri('resType', this.__Info.resType);
            entity.updateAttri('x', this.position.x);
            entity.updateAttri('y', this.position.y);
            entity.updateAttri('dir', this.__Info.dir);
            entity.updateAttri('mainId', this.__id);
            entity.show();
            entity.status = ACTION_STATUS_TYPE.Stand;
            // const pos = this.getPosById(i);
            entity.moveToPos(this.points[i].x, this.points[i].y);
            // this.addChild(entity);
            this.soldiers.push(entity.__id);
            // this.tree.insert(entity);
        }
    }

    public moveToPos(targetX: number, targetY: number): boolean {
        // if (this.__Info.mainId) {
        //     const idx = this.__id % 10001;
        //     const pos = this.getPosById(idx, targetX, targetY);
        //     targetX = pos.x;
        //     targetY = pos.y;
        // }
        return super.moveToPos(targetX, targetY);
        // const startPoint: Vec2 = MapRoadUtils.instance.getWorldPointByPixel(this.position.x, this.position.y);
        // const targetPoint: Vec2 = MapRoadUtils.instance.getWorldPointByPixel(targetX, targetY);

        // const startNode: RoadNode = SceneMapManager.I.getRoadNodeByPixel(this.position.x, this.position.y);
        // const targetNode: RoadNode = SceneMapManager.I.getRoadNodeByPixel(targetX, targetY);

        // const roadNodeArr: RoadNode[] = SceneMapManager.I.roadSeeker.seekPath2(startNode, targetNode); // 点击到障碍点不会行走
        // // let roadNodeArr:RoadNode[] = this._roadSeeker.seekPath2(startNode,targetNode);  //点击到障碍点会行走到离障碍点最近的可走路点

        // if (roadNodeArr.length > 0) {
        //     this.walkByRoad(roadNodeArr);
        //     return true;
        // }
        // return false;
    }

    private points: Vec3 | Vec2[] = [];
    private getPosById(idx: number, x: number, y: number) {
        const pos = v2(0, 0);
        switch (this.__Info.dir) {
            case ACTION_DIRECT.RIGHT:
                pos.x = x + -60 - Math.floor(idx % 10) * 60;
                pos.y = y + 180 - Math.floor(idx / 10) * 50;
                break;
            case ACTION_DIRECT.LEFT:
                pos.x = x + 60 + Math.floor(idx % 10) * 60;
                pos.y = y + 180 - Math.floor(idx / 10) * 50;
                break;
            default:
                pos.x = x + 60 + Math.floor(idx % 10) * 60;
                pos.y = y + 180 - Math.floor(idx / 10) * 50;
                break;
        }
        // pos.x = this.points[idx].x + x;
        // pos.y = this.points[idx].y + y;
        return pos;
    }
}
