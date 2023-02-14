import {
 js, Node, UITransform, Vec2,
} from 'cc';
import UtilsCC from '../utils/UtilsCC';
import ActionBase from './ActionBase';
import { ACTION_DIRECT, ACTION_RES_TYPE, ACTION_STATUS_TYPE } from './ActionConfig';

export interface EntityInfo {
    pos: Vec2,
    resId: number,
    resType: ACTION_RES_TYPE,
    resStatus: ACTION_STATUS_TYPE,
    dir: ACTION_DIRECT
    /** 主将id */
    mainId: number
}
/** 实体基类 */
export default class Entity extends Node {
    protected __id = 0;
    protected __name = '';
    protected __body: Node;
    protected __dir: number;
    protected __Info: EntityInfo = js.createMap(true);
    public constructor(id: number) {
        super(id?.toString());
        this.__name = 'Entity';
        this.__id = id;
        this.addComponent(UITransform);
    }

    public updateAttri(attriType: string, attriValue: unknown): void {
        this.__Info[attriType] = attriValue;
        if (attriType === 'x') {
            UtilsCC.setPosX(this, Number(attriValue));
        } else if (attriType === 'y') {
            UtilsCC.setPosY(this, Number(attriValue));
        } else if (attriType === 'pos') {
            const pos: Vec2 = attriValue as Vec2;
            UtilsCC.setPos(this, pos.x, pos.y);
        }
    }

    public playAction(status: ACTION_STATUS_TYPE, dir: ACTION_DIRECT = undefined): void {
        this.__Info.resStatus = status;
        if (dir) {
            this.__Info.dir = dir;
        }
        const body = this.getBody();
        body.children.forEach((child: ActionBase) => {
            child.playAction(this.__Info.resStatus, this.__Info.dir);
        });
    }

    public show(): void {
        this.getBody();
    }

    private getBody() {
        if (!this.__body) {
            this.__body = new Node('Body');
            this.__body.addComponent(UITransform);
            this.addChild(this.__body);
            const actionBase = new ActionBase();
            this.__body.addChild(actionBase);
            actionBase.updateShow(this.__Info.resId, this.__Info.resType, this.__Info.dir, this.__Info.resStatus);
        }
        return this.__body;
    }

    public getId(): number {
        return this.__id;
    }

    public getName(): string {
        return this.__name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(dt: number): void {
        // console.log('dt', dt);
    }
}
