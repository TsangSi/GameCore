import {
 UIOpacity, v2, v3, Vec2, Vec3,
} from 'cc';
import MapRoadUtils from '../map/road/MapRoadUtils';
import RoadNode from '../map/road/RoadNode';
import { SceneMap } from '../map/SceneMap';
import SceneMapManager from '../map/SceneMapManager';
import { ACTION_DIRECT, ACTION_STATUS_TYPE } from './ActionConfig';
import Entity from './Entity';

/** 会移动的实体 */
export default class Actor extends Entity {
    /** 移动的速度 */
    protected moveSpeed = 60;
    /** 移动的角度 */
    private _moveAngle = 0;

    /**
     *玩家当前所站在的地图节点
     */
     private _currentNode: RoadNode;

    /** 目标id */
    private targetId: number;
    private _roadNodeArr: RoadNode[] = [];
    private _nodeIndex = 0;
    public constructor(id?: number) {
        super(id);
        this.__name = 'Actor';
    }
    // private _SceneMap: SceneMap = undefined;
    // public get SceneMap(): SceneMap {
    //     if (!this._SceneMap) {
    //         this._SceneMap = SceneMapManager.I.SceneMap;
    //     }
    //     return this._SceneMap;
    // }

    /** 当前状态 */
    protected __status: ACTION_STATUS_TYPE = ACTION_STATUS_TYPE.Stand;
    /** 获取当前状态 */
    public get status(): ACTION_STATUS_TYPE {
        return this.__status;
    }

    /** 设置当前状态 */
    public set status(s: ACTION_STATUS_TYPE) {
        this.__status = s;
    }
    private _alpha = 1;
    public get alpha(): number {
        return this._alpha;
    }
    public set alpha(value: number) {
        this._alpha = value;
        this.getComponent(UIOpacity).opacity = Math.floor(255 * (value / 1));
    }

    /** 获取目标id */
    public getTargetId(): number {
        return this.targetId;
    }

    public setTargetId(id: number): void {
        this.targetId = id;
    }
    public updateAttri(attriType: string, attriValue: unknown): void {
        super.updateAttri(attriType, attriValue);
        // if (attriType === 'x') {
        // } else if (attriType === 'y') {
        // } else if (attriType === 'pos') {
        // }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(dt: number): void {
        // if (!SceneMapManager.I.enter_map) {
        //     return;
        // }

        //  * int function(int Sx, int Sy, int Tx, int Ty) {
        // int x = Tx - Sx; int y = Ty - Sy; //经线最短修正（防止南辕北辙）
        // if(y > 180){ y -= 180; }
        // else if(y < -180){ y += 180; }
        // int r = 0; //方向枚举，约定：正西 1，西北 2，正北 3，东北 4， 正东 -1，东南 -2，正南 -3， 西南 -4
        // if(x > 0){
        // if(y > 0){
        // //第一象限 r = 4;//东北 }
        // else if(y < 0){//第四象限 r = -2;//东南 }
        //     else{ r = -1;//正东 } } else if(x < 0){ if(y > 0){//第二象限 r = 2;//西北 } else if(y < 0){//第三象限 r = -4;//东南 } else{ r = 1;//正西 } }
        //     else{ if(y > 0){ r = 3;//正北 } else if(y < 0){ r = -3;//正南 } else{ r = 0;//原点 } } return r; } //只是思想或算法。估计我想简单了。不过表达一下而已，理解上有问题被别人指正总是好的。

        if (this.status === ACTION_STATUS_TYPE.Stand) {
            this.playAction(this.status);
        } else if (this.status === ACTION_STATUS_TYPE.Run) {
            this.playAction(this.status);

            const nextNode: RoadNode = this._roadNodeArr[this._nodeIndex];
            if (nextNode) {
                const dx: number = nextNode.px - this.position.x;
                const dy: number = nextNode.py - this.position.y;
                const speed: number = this.moveSpeed * dt;
                if (dx * dx + dy * dy > speed * speed) {
                    if (this._moveAngle === 0) {
                        const x = dx;
                        let y = dy;
                        if (y > 180) {
                            y -= 180;
                        } else if (y < -180) {
                            y += 180;
                        }
                        let dir2 = 0;
                        if (x > 0) {
                            if (y > 0) {
                                // 第一象限 东北
                                dir2 = 9;
                            } else if (y < 0) {
                                // 第四象限 东南
                                dir2 = 3;
                            } else {
                                // 正东
                                dir2 = 6;
                            }
                        } else if (x < 0) {
                            if (y > 0) {
                                // 第二象限 西北
                                dir2 = 7;
                            } else if (y < 0) {
                                // 第三象限 西南
                                dir2 = 1;
                            } else {
                                // 正西
                                dir2 = 4;
                            }
                        } else if (y > 0) {
                            // 正北
                            dir2 = 8;
                        } else if (y < 0) {
                            // 正南
                            dir2 = 2;
                        } else {
                            // 原点
                            dir2 = 6;
                        }
                        // console.log('nnnn=', this.name, dir2);
                        this._moveAngle = Math.atan2(dy, dx);
                        this.playAction(ACTION_STATUS_TYPE.Run, dir2);
                    }
                    const xspeed: number = Math.cos(this._moveAngle) * speed;
                    const yspeed: number = Math.sin(this._moveAngle) * speed;
                    this.updateAttri('pos', v2(this.position.x + xspeed, this.position.y + yspeed));
                } else {
                    this._moveAngle = 0;
                    if (this._nodeIndex === this._roadNodeArr.length - 1) {
                        this.updateAttri('pos', v2(nextNode.px, nextNode.py));
                        this.stop();
                    } else {
                        this._walk();
                    }
                }
                this.setPlayerStateByNode();
            }
        }
    }
    public setPlayerStateByNode(): void {
        const node: RoadNode = SceneMapManager.I.getRoadNodeByPixel(this.position.x, this.position.y);

        if (node === this._currentNode) {
            return;
        }

        this._currentNode = node;

        if (this._currentNode) {
            switch (this._currentNode.value) {
                case 2:// 如果是透明节点时
                    if (this.alpha !== 0.4) {
                        this.alpha = 0.4;
                    }
                    break;
                case 3:// 如果是透明节点时
                    // trace("走到该节点传送");
                    // this.alpha < 1 && (this.alpha = 1);
                    if (this.alpha > 0) this.alpha = 0;
                    break;
                default:
                    if (this.alpha < 1) this.alpha = 1;
            }
        }
    }

    public moveToPos(targetX: number, targetY: number): boolean {
        // const startPoint: Vec2 = MapRoadUtils.instance.getWorldPointByPixel(this.position.x, this.position.y);
        // const targetPoint: Vec2 = MapRoadUtils.instance.getWorldPointByPixel(targetX, targetY);

        const startNode: RoadNode = SceneMapManager.I.getRoadNodeByPixel(this.position.x, this.position.y);
        const targetNode: RoadNode = SceneMapManager.I.getRoadNodeByPixel(targetX, targetY);

        const roadNodeArr: RoadNode[] = SceneMapManager.I.roadSeeker.seekPath2(startNode, targetNode); // 点击到障碍点不会行走
        // let roadNodeArr:RoadNode[] = this._roadSeeker.seekPath2(startNode,targetNode);  //点击到障碍点会行走到离障碍点最近的可走路点

        if (roadNodeArr.length > 0) {
            this.walkByRoad(roadNodeArr);
            return true;
        }
        return false;
    }
    /**
     * 根据路节点路径行走
     * @param roadNodeArr
     */
    public walkByRoad(roadNodeArr: RoadNode[]): void {
        this._roadNodeArr = roadNodeArr;
        this._nodeIndex = 0;
        this._moveAngle = 0;

        this._walk();
        this.move();
    }

    private _walk() {
        if (this._nodeIndex < this._roadNodeArr.length - 1) {
            this._nodeIndex++;
        }
    }

    public move(): void {
        this.status = ACTION_STATUS_TYPE.Run;
        // EventM.I.fire(EventM.Type.Player.CharactorState, this.state);
    }

    public stop(): void {
        this.status = ACTION_STATUS_TYPE.Stand;
        // EventM.I.fire(EventM.Type.Player.CharactorState, this.state);

        // this.playAction(ACTION_STATUS_TYPE.Stand);
        this.setTargetId(null);
        // AIManager.I.think(1);
    }

    /** 扩散倍数 */
    private spread = 50;
    /** 偏移位置 */
    private offsetPos = v3();
    /** 偏移位置 */
    private offsetPos2 = v2();
    private noise = 5;
    private getNoise(pos: Vec3) {
        const noise = this.noise;
        const x = pos.x + Math.random() * noise - noise / 2;
        const z = pos.z + Math.random() * noise - noise / 2;
        pos.x = x;
        pos.z = z;
        return pos;
    }
    private getNoise2(pos: Vec2) {
        const noise = this.noise;
        const x = pos.x + Math.random() * noise - noise / 2;
        const y = pos.y + Math.random() * noise - noise / 2;
        pos.x = x;
        pos.y = y;
        return pos;
    }

    // private nthOffset = 0;
    private hollow = false;
    private unitWidth = 5;
    private unitDepth = 2;
    protected evaluatePoints(): Vec3[] {
        const ret: Vec3[] = [];
        const middleOffset = v3((this.unitWidth - 1) * 0.5, 0, (this.unitDepth - 1) * 0.5);
        for (let x = 0; x < this.unitWidth; x++) {
            for (let z = 0; z < this.unitDepth; z++) {
                if (this.hollow && x !== 0 && x !== this.unitWidth - 1 && z !== 0 && z !== this.unitDepth - 1) continue;
                let pos = v3(x + (z % 2 === 0 ? 0 : this.nthOffset), 0, z);

                pos = pos.subtract(middleOffset);
                pos = this.getNoise(pos);
                pos = pos.multiplyScalar(this.spread);
                pos.add(this.offsetPos);
                ret.push(pos);
            }
        }
        return ret;
    }

    /** 数量 */
    private amount = 50;
    /** 半径 */
    private radius = 1;
    /** 半径增长乘数 */
    private radiusGrowthMultiplier = 0;
    /** 旋转 */
    private rotations = 1;
    /** 圈数 */
    private rings = 1;
    /** 环偏移 */
    private ringOffset = 1;
    /** 数偏移 */
    private nthOffset = 1;
    protected evaluatePoints2(): Vec2[] {
        const ret: Vec2[] = [];
        const amountPerRing = this.amount / this.rings;
        let ringOffset = 0;
        for (let i = 0; i < this.rings; i++) {
            for (let j = 0; j < amountPerRing; j++) {
                const angle = j * Math.PI * (2 * this.rotations) / amountPerRing + (i % 2 !== 0 ? this.nthOffset : 0);

                const radius = this.radius + ringOffset + j * this.radiusGrowthMultiplier;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                let pos = new Vec2(x, z);

                pos = this.getNoise2(pos);

                pos = pos.multiplyScalar(this.spread);

                pos.add(this.offsetPos2);
                ret.push(pos);
            }
            ringOffset += this.ringOffset;
        }
        return ret;
    }

    /** 圆形 */
    protected roundPoints(x: number, y: number): Vec2[] {
        const ret: Vec2[] = [];
        for (let i = 0; i < this.amount; i++) {
           const h = (2 * Math.PI / 360) * (360 / this.amount) * i;
           const pos = v2();
           pos.x = x + Math.sin(h) * 100;
           pos.y = y - Math.cos(h) * 100;
           ret.push(pos);
            // const pos = v2();
            // pos.x = x + (100 * Math.cos(((360 / this.amount) * i - 90) * Math.PI / 180));
            // pos.y = y + (100 * Math.sin(((360 / this.amount) * i - 90) * Math.PI / 180));
            // ret.push(pos);
        }
        return ret;
    }
}
