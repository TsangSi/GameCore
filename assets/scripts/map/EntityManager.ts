import {
 director, Event, Node, Sprite, UITransform, v2,
} from 'cc';
import { ACTION_DIRECT, ACTION_RES_TYPE, ACTION_STATUS_TYPE } from '../action/ActionConfig';
import Entity from '../action/Entity';
import MapAvatar from '../action/MapAvatar';
import Monster from '../action/Monster';
import PlayerAvatar from '../action/PlayerAvatar';
import { EventM } from '../common/EventManager';
import { EntityType } from '../global/GConst';
import EntityLayer from '../layer/EntityLayer';
import { UI_NAME } from '../ui/UIConfig';
import UIManager from '../ui/UIManager';
import Utils from '../utils/Utils';
import UtilsCC from '../utils/UtilsCC';
import { UtilsNumber } from '../utils/UtilsNumber';

export default class EntityManager {
    private static _I: EntityManager = null;
    public static get I(): EntityManager {
        if (this._I == null) {
            this._I = new EntityManager();
            this._I.init();
        }
        return this._I;
    }

    private _handle = 10001;
    public getNewHandle(): number {
        return this._handle++;
    }

    private _EntityLayer: EntityLayer = undefined;
    public get EntityLayer(): EntityLayer {
        if (!this._EntityLayer) {
            this._EntityLayer = director.getScene().getComponentInChildren('EntityLayer') as EntityLayer;
        }
        return this._EntityLayer;
    }
    private PlayerAvatarHandle = 0;
    private PlayerAvatar: PlayerAvatar = undefined;
    private Handles: number[] = [];
    private Entities: { [handle: number]: unknown; } = {};

    private init() {
        EventM.I.on(EventM.Type.Entity.UpdateSiblingIndex, this.onUpdateSiblingIndex, this);
        EventM.I.on(EventM.Type.Player.UpdateFightStatus, this.onUpdateFightStatus, this);
    }

    // public addBuild(x = 7800, y = 6900): Node {
    //     const build = new Node('city1');
    //     build.addComponent(UITransform);
    //     const sprite = build.addComponent(Sprite);
    //     const url = `http://192.168.123.95/h5/build/city/1001.png`;
    //     UtilsCC.setSprite(sprite, url);
    //     build.setPosition(x, y);
    //     this.EntityLayer.node.addChild(build);
    //     return build;
    // }
    public createEntity<T extends MapAvatar>(entityType: number, handle?: number): T {
        let newEntity: MapAvatar | Monster;
        handle = handle || this.getNewHandle();
        if (this.Entities[handle]) {
            this.destoryEntity(handle);
        }
        switch (entityType) {
            // case EntityType.PlayerAvatar:
                // this.PlayerAvatarHandle = handle;
                // newEntity = new PlayerAvatar(handle);
                // this.PlayerAvatar = newEntity;
                // break;
            case EntityType.MapAvatar:
                newEntity = new MapAvatar(handle);
                break;
            case EntityType.Monster:
                newEntity = new Monster(handle);
                break;
            default:
                // newEntity = new Actor(handle);
                break;
        }
        // newEntity.Type = entityType;
        this.Handles.push(handle);
        this.Entities[handle] = newEntity;
        this.EntityLayer.node.addChild(newEntity);
        newEntity.layer = this.EntityLayer.node.layer;
        return newEntity as T;
    }

    // public createMainEntity(handle: number): void {
        // if (!EntityManager.I.getPlayerAvatar()) {
            // const player: PlayerAvatar = this.createEntity(EntityType.PlayerAvatar, new PlayerAvatar(handle));
            // this.PlayerAvatar = player;
            // player.updateAttri('x', 2830);
            // player.updateAttri('y', 2015);
        // }
    // }

    /** 获取实体 */
    public getEntityByHandle<T extends Entity>(handle: number): T {
        return this.Entities[handle] as T;
    }

    /** 获取主角 */
    public getPlayerAvatar(): PlayerAvatar {
        return this.PlayerAvatar;
    }

    // public isPlayerAvatarUserId(userid: number): boolean {
    //     if (this.PlayerAvatar && this.PlayerAvatar.Info) {
    //         return this.PlayerAvatar.Info.UserId === userid;
    //     }
    //     return false;
    // }

    /** 附近是否有可以工具的目标 */
    public haveCanAttackEntity(): boolean {
        // const targetId = this.PlayerAvatar.getTargetId();
        // if (!targetId) {
        //     return false;
        // }
        // const targetEntity = this.getEntityByHandle(targetId);
        // if (!targetEntity) {
        //     return false;
        // }

        // if (this.PlayerAvatar.canAttackTarget(targetEntity)) {
        //     return true;
        // }
        return false;
    }

    // getCanAttackEntity () {

    // }

    /** 移除实体 */
    public destoryEntity(handle: number): void {
        const entity = this.getEntityByHandle(handle);
        if (entity) {
            entity.destroy();
            delete this.Entities[handle];
        }
        const pos = this.Handles.indexOf(handle);
        if (pos >= 0) {
            this.Handles.splice(pos, 1);
        }
    }

    public getEntities<T extends Entity>(): { [handle: number]: T} {
        return this.Entities as { [handle: number]: T};
    }

    public getNearestEntityId(): number {
        const entities = this.Entities;
        // let diPos: Vec2;
        let dis: number;
        let targetId: number;
        // for (const id in entities) {
        //     const tmpId = parseInt(id);
        //     if (tmpId !== this.PlayerAvatarHandle) {
        //         const entity = entities[id];
        //         if (entity.Type === EntityType.Monster) {
        //             const tmpDis = Math.sqrt((this.PlayerAvatar.Info.x - entity.Info.x) ** 2 + (this.PlayerAvatar.Info.y - entity.Info.y) ** 2);
        //             if (Utils.isNullOrUndefined(dis) || tmpDis < dis) {
        //                 dis = tmpDis;
        //                 // diPos = v2(entity.Info.x, entity.Info.y);
        //                 targetId = tmpId;
        //             }
        //         }
        //     }
        // }
        return targetId;
    }

    public onUpdateSiblingIndex(handle: number): void {
        if (this.Handles.indexOf(handle) < 0) { return; }

        this.Handles.sort((h1: number, h2: number) => {
            const a = this.getEntityByHandle(h1);
            const b = this.getEntityByHandle(h2);
            if (a && b) { return b.position.y - a.position.y; }
            return 0;
        });
        this.Handles.forEach((h: number, index: number) => {
            const e = this.Entities[h];
            if (e) { e.setSiblingIndex(index); }
        });
    }

    public onUpdateFightStatus(isFight: boolean): void {
        this.PlayerAvatar.isFight = isFight;
    }
}
