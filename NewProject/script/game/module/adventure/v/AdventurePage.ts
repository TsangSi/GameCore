/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { EventClient } from '../../../../app/base/event/EventClient';
import { StorageMgr } from '../../../../app/base/manager/StorageMgr';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { CCAtlas } from '../../../../app/engine/atlas/CCAtlas';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ACTION_DIRECT, ACTION_TYPE } from '../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { TickTimer } from '../../../base/components/TickTimer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import SpineBase from '../../../base/spine/SpineBase';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ActionType } from '../../../battle/WarConst';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import EntityMapMgr from '../../../entity/EntityMapMgr';
import { EntityRole } from '../../../entity/EntityRole';
import { MainRole } from '../../../entity/MainRole';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { points } from '../../roleSkills/martialSkill/v/RoleMartialConst';
import { levels, MapEvent } from '../AdventureConst';

const { ccclass, property } = cc._decorator;

/** 显示tip */
let showTip: boolean = true;

const dice_default_speed = 1.25;

@ccclass
export class AdventurePage extends WinTabPage {
    /** 地图控件 */
    @property(cc.TiledMap)
    private map: cc.TiledMap = null;

    /** 黄金层级 */
    @property(cc.Label)
    private LabHJLevel: cc.Label = null;

    /** 层级 */
    @property(cc.Label)
    private LabLevel: cc.Label = null;

    /** 奇遇事件按钮 */
    @property(cc.Node)
    private NdQyTip: cc.Node = null;

    /** 奇遇事件按钮 */
    @property(DynamicImage)
    private NdQyIcon: DynamicImage = null;

    /** 奇遇事件按钮 */
    @property(cc.Node)
    private NdQyEvent: cc.Node = null;

    /** 普通骰子 */
    @property(cc.Node)
    private NdComDict: cc.Node = null;

    /** 黄金骰子 */
    @property(cc.Node)
    private NdGoldDict: cc.Node = null;

    /** 普通骰子数量 */
    @property(cc.Label)
    private LabComDictCount: cc.Label = null;

    /** 黄金骰子数量 */
    @property(cc.Label)
    private LabGoldDictCount: cc.Label = null;

    /** 事件数量 */
    @property(cc.Label)
    private LabEventCount: cc.Label = null;

    /** 跳过动画 */
    @property(cc.Toggle)
    private TgSkipAnim: cc.Toggle = null;

    /** 自动投掷 */
    @property(cc.Toggle)
    private TgAutoDice: cc.Toggle = null;

    /** 剩余时间 */
    @property(TickTimer)
    private LabOutTime: TickTimer = null;

    @property(cc.Prefab)
    private PfbItemIcon: cc.Prefab = null;

    @property(cc.Node)
    private NdAutoDice: cc.Node = null;

    /** 角色 */
    private role: EntityRole = null;

    /** 完事后是否进入新地图 */
    private reload: boolean = false;
    /** 完事后是否跳转 */
    private goto: boolean = false;

    private currentLevel: number = 0;

    /** 图层管理 */
    private _tile: cc.TiledLayer = null;
    private _tile2: cc.TiledLayer = null;
    private _items: cc.TiledLayer = null;
    private _roles: cc.TiledLayer = null;

    /** 当前是否拖拽 */
    private isDrag: boolean = false;
    /** 强制锁定镜头 */
    private forceLock: boolean = false;

    /** 当前坐标 */
    private curTile: cc.Vec2 = null;
    /** 当前坐标 */
    private curTileIndex: number = -1;
    /** 默认路径 */
    private defPath: cc.Vec2[] = null;
    /** 扩展路径 */
    private exPath: cc.Vec2[] = null;

    /** 当前动作 */
    private action: cc.Tween = null;

    /** 当前状态 0.暂停 1.移动中 */
    private state: number = 0;

    /** 骰子切换计时器 */
    private dt: number = 0;

    /** 当前骰子节点 */
    private curDice: cc.Node = null;

    /** 黄金骰子点数 */
    private goldDice: number = 7;

    /** 骰子转动速冻 */
    private rollSpeed: number = dice_default_speed;

    /** 骰子允许滚动 */
    private enablleRoll: boolean = false;

    /** mapItemMsg */
    private mapItemMsg: Map<number, cc.Node> = new Map();

    /** mapEventMsg */
    private mapEventMsg: Map<number, MapEvent> = new Map();

    private eventPool: cc.NodePool = new cc.NodePool();

    private itemPool: cc.NodePool = new cc.NodePool();

    private offset: cc.Vec2 = cc.v2(0, 0);

    private endEventReward: string = '';

    private openExPath: boolean = false;

    public addE(): void {
        EventClient.I.on(E.Adventure.loadInfo, this.onLoadInfo, this);
        EventClient.I.on(E.Adventure.ComDiceEvent, this.onComDiceEvent, this);
        EventClient.I.on(E.Adventure.GoldDiceEvent, this.onGoldDiceEvent, this);
        EventClient.I.on(E.Adventure.SelectGoldDice, this.changeGoldDiceEvent, this);
        EventClient.I.on(E.Adventure.syncEventCount, this.syncItemCount, this);
        EventClient.I.on(E.Bag.ItemChange, this.syncItemCount, this);
    }

    public remE(): void {
        EventClient.I.off(E.Adventure.loadInfo, this.onLoadInfo, this);
        EventClient.I.off(E.Adventure.ComDiceEvent, this.onComDiceEvent, this);
        EventClient.I.off(E.Adventure.GoldDiceEvent, this.onGoldDiceEvent, this);
        EventClient.I.off(E.Adventure.SelectGoldDice, this.changeGoldDiceEvent, this);
        EventClient.I.off(E.Adventure.syncEventCount, this.syncItemCount, this);
        EventClient.I.off(E.Bag.ItemChange, this.syncItemCount, this);
    }

    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        ModelMgr.I.AdventureModel.clearInfo();
        ControllerMgr.I.AdventureController.reqInfo();
    }

    protected start(): void {
        super.start();

        this.addE();

        UtilGame.Click(this.NdComDict, this.onClickComDice.bind(this, false), this);

        UtilGame.Click(this.NdGoldDict, this.onClickGoldDice, this);

        UtilGame.Click(this.NdQyEvent, this.onClickEventBtn, this);

        this.NdAutoDice.active = false;

        this.TgAutoDice.isChecked = false;

        this.TgSkipAnim.isChecked = StorageMgr.I.getValue('skip_anim', false);

        const condition = ModelMgr.I.AdventureModel.getSkipLimit();

        if (!condition.state) {
            this.TgSkipAnim.isChecked = false;
        }

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventTouch) => {
            /** 一根手指的时候才允许拖动 */
            if (e.getTouches().length !== 1) return;
            // /** 简单防误触 */
            // if (!this.isDrag && e.getDelta().mag() < 10) return;

            const isMove = this.state === 1 || this.action || this.curDice;

            if (!this.isDrag) {
                this.isDrag = true;
                if (isMove) {
                    MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.adventure_tip_2)));
                }
            }

            if (isMove) return;

            const delta = e.getDelta();

            this.offset = this.offset.add(delta);
        });

        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.isDrag = false;
        });

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.isDrag = false;
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
        this.eventPool.clear();
        this.itemPool.clear();
    }

    /** pool */
    private createEventNode(name: string): cc.Node {
        if (this.eventPool.size() > 0) {
            const nd = this.eventPool.get();
            nd.stopAllActions();
            nd.children[0].getChildByName('LabName').getComponent(cc.Label).string = name;
            return nd;
        }
        const nd = new cc.Node();
        nd.addComponent(cc.Sprite);
        ResMgr.I.showPrefab('/prefab/module/adventure/AdventureName', nd, (err, child: cc.Node) => {
            if (child) {
                child.x = -60;
                child.getChildByName('LabName').getComponent(cc.Label).string = name;
            }
        });
        return nd;
    }

    /** pool */
    private createItemNode(): cc.Node {
        if (this.itemPool.size() > 0) {
            const nd = this.itemPool.get();
            nd.stopAllActions();
            return nd;
        }
        const nd = cc.instantiate(this.PfbItemIcon);
        return nd;
    }

    /** 重置 */
    private reset(): void {
        this.curTileIndex = 0;
        const ary = Array.from(this.mapEventMsg.keys());
        ary.forEach((key) => {
            const ev = this.mapEventMsg.get(key);
            this.eventPool.put(ev.node);
        });
        const ary2 = Array.from(this.mapItemMsg.keys());
        ary2.forEach((key) => {
            const node = this.mapItemMsg.get(key);
            this.itemPool.put(node);
        });
        this.mapEventMsg.clear();
        this.mapItemMsg.clear();
    }

    /** 初始化 */
    private onLoadInfo(info: S2CAdventureInfo): void {
        this.reset();
        this.syncItemCount();
        this.currentLevel = info.LevelNum;
        this.LabLevel.string = `第${info.LevelNum}层`;
        const model = ModelMgr.I.AdventureModel;
        this.endEventReward = model.getEndEventReward(info.LevelNum);
        this.LabHJLevel.string = `${Math.ceil(info.LevelNum / 5) * 5}`;
        this.loadMap(0, info.Pos ? info.Pos : 0).then(() => {
            this.reload = false;
            this.curDice = null;
            info.AdventurePosList.forEach((v) => {
                const id = v.Pos;
                if (id <= this.curTileIndex && (!v.EventId || v.EventId === 0)) return;
                const tile = id >= 100 ? this.exPath[id - 100] : this.defPath[id];
                const pos = this.tile2Postion(tile.x, tile.y);
                pos.y += 15;

                if (id >= 100) this.openExPath = true;

                if (tile && v.Type === 1) {
                    const node = this.createItemNode();
                    this._items.node.addChild(node);
                    node.opacity = 255;
                    node.scale = 0.8;
                    node.setPosition(pos);
                    const itemModel = UtilItem.NewItemModel(v.ItemInfo[0].ItemId, v.ItemInfo[0].ItemNum);
                    node.getChildByName('SprBg').active = false;
                    node.runAction(cc.repeatForever(
                        cc.sequence(
                            cc.moveBy(0.5, 0, 5),
                            cc.moveBy(1, 0, -10),
                            cc.moveBy(0.5, 0, 5),
                        ),
                    ));
                    node.getComponent(ItemIcon).setData(
                        itemModel,
                        {
                            hideQualityBg: true,
                            hideLeftLogo: true,
                            hideRightLogo: true,
                            hideEffect: true,
                            hideStar: true,
                            offClick: true,
                            needNum: v.ItemInfo[0].ItemNum !== 1,
                        },
                    );
                    this.mapItemMsg.set(id, node);
                } else if (v.EventId && v.EventId > 0) {
                    const name = model.getEventName(v.EventId);
                    let str = '';
                    for (let i = 0; i < name.length; ++i) {
                        if (str.length) str += '\n';
                        str += name[i];
                    }
                    const node = this.createEventNode(str);
                    node.opacity = 255;
                    this._items.node.addChild(node);
                    this.mapEventMsg.set(id, <MapEvent>{ node, event: v.EventId });
                    if (v.EventId === 4) pos.y += 26;
                    node.setPosition(pos);
                    const path = `texture/adventure/icon_yltx_jianzu${model.getEventIcon(v.EventId)}`;
                    ResMgr.I.loadLocal(path, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
                        if (res && node) node.getComponent(cc.Sprite).spriteFrame = res;
                    });
                }
            });
            this.scheduleOnce(() => {
                if (this.NdAutoDice.active) {
                    this.onClickComDice(true);
                }
            }, 0.2);
        }).catch((err) => {
            console.warn('加载地图错误');
            console.error(err);
        });
    }

    /** 普通骰子回调 */
    private onComDiceEvent(dice: S2CAdventureComDice): void {
        if ((!dice.Pos || dice.Pos === 0) && this.curTileIndex !== 0) {
            dice.Pos = this.curTileIndex >= 100 ? this.exPath.length - 1 + 100 : this.defPath.length - 1;
        }
        if (dice.Pos < 100 && dice.Pos === this.defPath.length - 1) {
            if (this.openExPath === false || this.currentLevel % 5 !== 0) this.reload = true;
            else this.goto = true;
        }
        if (dice.Pos > 100 && (dice.Pos - 100) === this.exPath.length - 1) this.reload = true;

        this.enablleRoll = true;
        /** 非跳过动画的情况下 最少保留滚动骰子最少1秒 */
        this.scheduleOnce(() => {
            ResMgr.I.loadLocal(`texture/adventure/img_yltx_tóuzi0${dice.DiceNum}`, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
                if (!cc.isValid(this) || !cc.isValid(this.node)) return;
                if (res) this.NdComDict.getComponent(cc.Sprite).spriteFrame = res;
                this.NdComDict.stopAllActions();
                this.NdComDict.runAction(cc.rotateTo(0.1, 360));
                this.enablleRoll = false;
                this.scheduleOnce(() => {
                    this.moveTo(dice.Pos, dice.AdventureEvent);
                }, 0.2);
            });
        }, this.TgSkipAnim.isChecked ? 0.1 : 1);
    }

    /** 黄金骰子回调 */
    private onGoldDiceEvent(dice: S2CAdventureComDice): void {
        if ((!dice.Pos || dice.Pos === 0) && this.curTileIndex !== 0) {
            dice.Pos = this.curTileIndex >= 100 ? this.exPath.length - 1 + 100 : this.defPath.length - 1;
        }
        if (dice.Pos < 100 && dice.Pos === this.defPath.length - 1) {
            if (this.openExPath === false || this.currentLevel % 5 !== 0) this.reload = true;
            else this.goto = true;
        }
        if (dice.Pos > 100 && (dice.Pos - 100) === this.exPath.length - 1) this.reload = true;

        this.enablleRoll = true;
        /** 非跳过动画的情况下 最少保留滚动骰子最少1秒 */
        this.scheduleOnce(() => {
            const str = `0${this.goldDice}`;
            ResMgr.I.loadLocal(`texture/adventure/img_yltx_tóuzi${str}`, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
                if (!cc.isValid(this) || !cc.isValid(this.node)) return;
                if (res) this.NdGoldDict.getComponent(cc.Sprite).spriteFrame = res;
                this.NdComDict.stopAllActions();
                this.NdGoldDict.runAction(cc.rotateTo(0.1, 360));
                this.enablleRoll = false;
                this.scheduleOnce(() => {
                    this.moveTo(dice.Pos, dice.AdventureEvent);
                }, 0.2);
            });
        }, this.TgSkipAnim.isChecked ? 0.1 : 1);
    }

    /** 选择黄金骰子回调 */
    private changeGoldDiceEvent(dice: number) {
        this.curDice = this.NdGoldDict;
        this.goldDice = dice;
    }

    /** 设置状态
     * @param  state 状态
     * @param  desc 注释
     */
    private setState(state: number): void {
        this.state = state;
    }

    /** 加载地图
     * @mapId 地图编号
     * @tileId 当前格子
     */
    private async loadMap(mapId: number, tileId: number = 0): Promise<void> {
        return new Promise((resolve, reject) => {
            ResMgr.I.loadLocal(`tiled/adventure/${mapId}`, cc.TiledMapAsset, (err, res: cc.TiledMapAsset) => {
                if (res) {
                    this.map.tmxAsset = res;

                    if (!this.role) {
                        this.role = EntityMapMgr.I.createCustomRole(ModelMgr.I.AdventureModel.getModelSkin());
                        // this.role = new SpineBase({
                        //     path: 'spine/role/man/10001-4',
                        //     actionName: 'stand',
                        //     loop: true,
                        //     // callback: () => {
                        //     //     console.log('加载完');
                        //     // },
                        //     // endCallback: () => {
                        //     //     console.log('播放完');
                        //     //     // this._act = 1;
                        //     //     // this._spine.playAction('run');
                        //     // },
                        // });
                    } else {
                        this.role.removeFromParent(false);
                    }

                    this.role.scale = 0.8;

                    this.forceLock = true;

                    this.defPath = levels[mapId].paths[0];

                    this.exPath = levels[mapId].paths[1];

                    this.curTileIndex = tileId;

                    this.curTile = tileId >= 100 ? this.exPath[tileId - 100] : this.defPath[tileId];

                    const layers = this.map.getLayers();
                    this._tile = layers[0];
                    this._tile2 = layers[1];
                    this._items = layers[2];
                    this._roles = layers[3];
                    this._roles.node.addChild(this.role);
                    this.openExPath = false;
                    const pos = this.tile2Postion(this.curTile.x, this.curTile.y);
                    this.role.setPosition(pos);

                    this.role.opacity = 0;

                    this.updateDir();

                    this.role.runAction(cc.sequence(
                        cc.fadeIn(0.25),
                        cc.callFunc(resolve),
                    ));

                    return;
                }
                reject(err);
            });
        });
    }

    /**
     * @func 格子转换屏幕坐标
     * @x 坐标x
     * @y 坐标y
     * @return 返回屏幕坐标
    */
    private tile2Postion(x: number, y: number): cc.Vec2 {
        y -= 1;
        const p = this._tile.getPositionAt(x, y);
        p.x -= this.map.node.width / 2;
        p.y -= this.map.node.height / 2;
        return p;
    }

    /**
     * @func 刷新道具数量
     * @id 格子ID
    */
    private syncItemCount(): void {
        const model = ModelMgr.I.AdventureModel;
        if (!WinMgr.I.checkIsOpen(ViewConst.AdventureEventView)) { model.clearEmptyEvent(true); }
        this.LabComDictCount.string = String(BagMgr.I.getItemNum(model.getDiceItem(0)));
        this.LabGoldDictCount.string = String(BagMgr.I.getItemNum(model.getDiceItem(1)));
        const num = model.getEventCount();
        this.LabEventCount.string = String(num);
        this.LabEventCount.node.parent.active = num !== 0;
        this.NdQyEvent.active = num !== 0;
        const time = model.getEventMinTime();
        this.LabOutTime.tick(time, `%HH:%mm:%ss`, true, true, false);
        this.LabOutTime.node.active = time > 0;
    }

    /**
     * @func 跳转到扩展路径
     * @id 格子ID
     */
    private gotoExPath(cb: Function): void {
        if (this.state === 1) return;
        this.state = 1;
        this.role.runAction(cc.sequence(
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                this.forceLock = true;
                this.curTileIndex = 100;
                this.curTile = this.exPath[0];
                const pos = this.tile2Postion(this.curTile.x, this.curTile.y);
                this.role.setPosition(pos);
                this.state = 0;
                this.updateDir();
            }),
            cc.fadeIn(0.3),
            cc.delayTime(0.1),
            cc.callFunc(cb),
        ));
    }

    /**
     * @func 跳转到默认路径
     * @id 格子ID
     */
    private gotoDef(cb: Function): void {
        if (this.state === 1) return;
        this.state = 1;
        this.role.runAction(cc.sequence(
            cc.fadeOut(0.3),
            cc.callFunc(() => {
                this.forceLock = true;
                this.curTileIndex = 0;
                this.curTile = this.defPath[0];
                const pos = this.tile2Postion(this.curTile.x, this.curTile.y);
                this.role.setPosition(pos);
                this.state = 0;
                this.updateDir();
            }),
            cc.fadeIn(0.3),
            cc.delayTime(0.1),
            cc.callFunc(cb),
        ));
    }

    /** 更新方向 */
    private updateDir(): void {
        const next = this.curTileIndex + 1;
        const nextTile = next >= 100 ? this.exPath[next - 100] : this.defPath[next];
        if (!nextTile) return;
        const pos = this.tile2Postion(this.curTile.x, this.curTile.y);
        const nextPos = this.tile2Postion(nextTile.x, nextTile.y);
        let dir = null;

        /** 方向检测 */
        if (nextPos.y > pos.y) {
            if (nextPos.x > pos.x) {
                dir = ACTION_DIRECT.RIGHT_UP;
            } else {
                dir = ACTION_DIRECT.LEFT_UP;
            }
        } else if (nextPos.x > pos.x) {
            dir = ACTION_DIRECT.RIGHT_DOWN;
        } else {
            dir = ACTION_DIRECT.LEFT_DOWN;
        }
        this.playAction(ACTION_TYPE.STAND, dir);
    }

    /** 播放动作 */
    private playAction(type: ACTION_TYPE, dir: ACTION_DIRECT) {
        // const spine = this.role as SpineBase;
        // spine.playAction(type === ACTION_TYPE.STAND ? 'stand' : 'run');
        // if (dir === ACTION_DIRECT.LEFT_UP || dir === ACTION_DIRECT.LEFT_DOWN) spine.scaleX = 1.0;
        // else spine.scaleX = -1.0;
        this.role.playAction(type, dir);
    }

    /**
     * @func 移动人物
     * @id 格子ID
     * @time 当前已经消耗时间
    */
    private moveTo(index: number, event: AdventureEvent = null): void {
        console.log('moveTo', index);

        if (!this.role || !this.defPath || !this.exPath || this.curTileIndex === -1) {
            this.curDice = null;
            console.log('未知错误');
            return;
        }

        this.offset.x = 0;

        this.offset.y = 0;

        if (this.curTileIndex > index) {
            this.gotoDef(() => {
                this.moveTo(index, event);
            });
            console.warn('未知错误');
            return;
        }

        if (index >= 100 && this.curTileIndex < 100) {
            index = this.defPath.length - 1;
            this.goto = true;
        }

        let start = this.curTileIndex;

        if (start === index) {
            this.curDice = null;
            console.log('无法寻路');
            return;
        }

        let pos = this.role.position;

        const tw = cc.tween(this.role);

        const speed = ModelMgr.I.AdventureModel.getMoveSpeed();

        console.log('计算路径', index, start);

        while (index !== start) {
            const next = start + (index > start ? 1 : -1);

            const nextTile = next >= 100 ? this.exPath[next - 100] : this.defPath[next];

            if (!nextTile) return;

            const nextPos = cc.v3(this.tile2Postion(nextTile.x, nextTile.y));

            start = next;

            const isEnd = index === start;

            let dir = null;

            /** 方向检测 */
            if (nextPos.y > pos.y) {
                if (nextPos.x > pos.x) {
                    dir = ACTION_DIRECT.RIGHT_UP;
                } else {
                    dir = ACTION_DIRECT.LEFT_UP;
                }
            } else if (nextPos.x > pos.x) {
                dir = ACTION_DIRECT.RIGHT_DOWN;
            } else {
                dir = ACTION_DIRECT.LEFT_DOWN;
            }

            pos = nextPos;

            /** 移动前 */
            tw.call(() => {
                this.playAction(ACTION_TYPE.RUN, dir);
                this.setState(1);
            });
            /** 移动 */
            tw.to(speed, { position: nextPos });
            /** 移动后 */
            tw.call(() => {
                this.onMoveTo(next, isEnd, event);
                this.curTileIndex = next;
                this.curTile = nextTile;
            });
        }

        tw.start(); // .goto(time);

        this.action = tw;
    }

    /**
     * @func 显示事件
     * @id 格子ID
     * @time 当前已经消耗时间
    */
    private showEvent(event: AdventureEvent = null): void {
        const type = event.EventId;

        let path = '';

        if (type === 1) {
            path = '/texture/adventure/icon_yltx_LLSR01@ML';
        } else if (type === 3) {
            path = '/texture/adventure/icon_yltx_xyc01@ML';
        } else if (type === 5) {
            path = '/texture/adventure/icon_yltx_QJT01@ML';
        } else {
            path = '/texture/adventure/icon_yltx_qwwd01@ML';
        }

        this.NdQyIcon.loadImage(path, 1, false, 'resources', false, () => {
            const pos = this.NdQyTip.convertToWorldSpaceAR(cc.v2(0, -60));
            this.NdQyIcon.node.setPosition(this.node.convertToNodeSpaceAR(pos));
            this.NdQyTip.opacity = 0;
            this.NdQyIcon.node.opacity = 0;
            this.NdQyTip.scale = 0.8;
            this.NdQyTip.stopAllActions();
            this.NdQyTip.runAction(cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.3),
                    cc.scaleTo(0.3, 1),
                ),
                cc.delayTime(0.5),
                cc.fadeOut(0.3),
            ));

            this.NdQyIcon.node.stopAllActions();
            this.NdQyIcon.node.runAction(cc.sequence(
                cc.fadeIn(0.3),
                cc.delayTime(0.5),
                cc.callFunc(() => {
                    const pos = this.NdQyEvent.convertToWorldSpaceAR(cc.v2(0, 0));
                    this.NdQyIcon.node.runAction(
                        cc.sequence(
                            cc.moveTo(0.4, this.node.convertToNodeSpaceAR(pos)),
                            cc.delayTime(0.2),
                            cc.fadeOut(0.3),
                            cc.callFunc(() => {
                                ModelMgr.I.AdventureModel.pushEvent(event);
                                this.syncItemCount();
                            }),
                        ),
                    );
                }),
            ));
        });
    }

    /** 移动到某个坐标点 */
    private onMoveTo(index: number, isEnd: boolean, event: AdventureEvent) {
        /** 路过的时候如果存在就删除 */
        if (this.mapItemMsg.has(index)) {
            const node = this.mapItemMsg.get(index);
            const item = node.getComponent(ItemIcon).getData();
            const cfg = item.cfg;
            const fmt = `${i18n.tt(Lang.com_huode)} <color=${UtilItem.GetItemQualityColor(cfg.Quality)}>${cfg.Name}x${item.data.ItemNum}</color>`;
            MsgToastMgr.Show(fmt);
            node.removeFromParent(false);
            node.zIndex = 100;
            this._roles.node.addChild(node);
            node.stopAllActions();
            node.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.spawn(
                    cc.fadeOut(0.5),
                    cc.moveBy(0.5, 0, 50),
                ),
                cc.callFunc(() => {
                    this.itemPool.put(node);
                }),
            ));
            this.mapItemMsg.delete(index);
        }

        if (isEnd) {
            this.scheduleOnce(() => {
                // this.updateDir();
                this.role.playAction(ACTION_TYPE.STAND);
                this.action = null;
                this.setState(0);
                console.log('取消骰子');
                if (this.goto) {
                    this.goto = false;
                    this.gotoExPath(() => {
                        this.curDice = null;
                        if (this.NdAutoDice.active) {
                            this.onClickComDice(true);
                        }
                    });
                } else if (this.reload) {
                    this.role.runAction(cc.sequence(
                        cc.fadeOut(0.3),
                        cc.callFunc(() => {
                            console.log('重新加载');
                            ControllerMgr.I.AdventureController.reqInfo();
                        }),
                    ));
                } else {
                    this.scheduleOnce(() => {
                        this.curDice = null;
                        if (this.NdAutoDice.active) {
                            this.onClickComDice(true);
                        }
                    }, 0.2);
                }
            });

            if (event) {
                this.showEvent(event);
            }

            /** 事件触发 */
            if (this.mapEventMsg.has(index)) {
                const ev = this.mapEventMsg.get(index);
                console.log('事件', ev);
                if (ev.event === 6 && this.endEventReward.length) {
                    const ary = this.endEventReward.split('|');
                    let str = '';
                    ary.forEach((v) => {
                        const strAry = v.split(':');
                        const item = UtilItem.NewItemModel(Number(strAry[0]), Number(strAry[1]));
                        const cfg = item.cfg;
                        const itemFmt = `<color=${UtilItem.GetItemQualityColor(cfg.Quality)}>${cfg.Name}x${item.data.ItemNum}</color>`;
                        if (str.length) str += ',';
                        str += itemFmt;
                    });
                    MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.adventure_huode), str));
                }
                if (event) {
                    const node = ev.node;
                    node.stopAllActions();
                    node.runAction(cc.sequence(
                        cc.delayTime(0.2),
                        cc.fadeOut(0.2),
                        cc.callFunc(() => {
                            this.eventPool.put(node);
                        }),
                    ));
                    this.mapEventMsg.delete(index);
                }
            }
        }
    }

    /** 点击普通骰子 */
    private onClickComDice(isAi: boolean = false) {
        const model = ModelMgr.I.AdventureModel;
        const num = model.getEventCount();
        const max = model.getEventMax();
        const item = model.getDiceItem(0);

        if (!isAi && this.NdAutoDice.active) {
            MsgToastMgr.Show(i18n.tt(Lang.adventure_tip_0));
            StorageMgr.I.setValue('auto_dice', false);
            this.NdAutoDice.active = false;
            return;
        }

        if (this.TgAutoDice.isChecked) {
            this.NdAutoDice.active = true;
        }

        const next = () => {
            if (BagMgr.I.getItemNum(item) < 1) {
                WinMgr.I.open(ViewConst.ItemSourceWin, item);
                MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.adventure_tip_1)));
                this.NdAutoDice.active = false;
                return;
            } else if (this.state === 1 || this.action || this.curDice) {
                if (!isAi) { MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.adventure_tip_2))); }
                return;
            }
            this.rollSpeed = dice_default_speed;
            this.curDice = this.NdComDict;
            ControllerMgr.I.AdventureController.reqComDice();
        };

        /** 提示框 */
        if (showTip && num >= max) {
            this.NdAutoDice.active = false;
            StorageMgr.I.setValue('auto_dice', false);
            ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.adventure_tip_6), UtilColor.NorV), (res) => {
                showTip = !res;
                this.onClickEventBtn();
            }, {
                tipTogState: false,
                ConfirmName: i18n.tt(Lang.adventure_btn2),
                CancelName: i18n.tt(Lang.adventure_btn),
                showToggle: 'show.event.tip',
            }, (res) => {
                next();
                showTip = !res;
            });
            return;
        }

        next();
    }

    /** 点击黄金骰子 */
    private onClickGoldDice() {
        const model = ModelMgr.I.AdventureModel;
        const num = model.getEventCount();
        const max = model.getEventMax();
        const item = model.getDiceItem(1);

        if (this.NdAutoDice.active && this.TgAutoDice.isChecked) {
            MsgToastMgr.Show(i18n.tt(Lang.adventure_tip_0));
            StorageMgr.I.setValue('auto_dice', false);
            this.NdAutoDice.active = false;
        }

        const next = () => {
            if (BagMgr.I.getItemNum(item) < 1) {
                WinMgr.I.open(ViewConst.ItemSourceWin, item);
                MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.adventure_tip_1)));
                this.NdAutoDice.active = false;
                return;
            } else if (this.state === 1 || this.action || this.curDice) {
                MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.adventure_tip_2)));
                return;
            }
            this.rollSpeed = dice_default_speed;
            const names: string[] = [];
            for (let i = 1; i <= 6; ++i) {
                const p = this.curTileIndex + i;
                if (this.mapEventMsg.has(p)) {
                    const ev = this.mapEventMsg.get(p);
                    names.push(model.getEventName(ev.event));
                } else {
                    names.push('');
                }
            }
            WinMgr.I.open(ViewConst.AdventureGoldDice, names);
        };

        /** 提示框 */
        if (showTip && num >= max) {
            this.NdAutoDice.active = false;
            StorageMgr.I.setValue('auto_dice', false);
            ModelMgr.I.MsgBoxModel.ShowBox(UtilString.FormatArgs(i18n.tt(Lang.adventure_tip_6), UtilColor.NorV), (res) => {
                showTip = !res;
                this.onClickEventBtn();
            }, {
                tipTogState: false,
                ConfirmName: i18n.tt(Lang.adventure_btn2),
                CancelName: i18n.tt(Lang.adventure_btn),
                showToggle: 'show.event.tip',
            }, (res) => {
                next();
                showTip = !res;
            });
            return;
        }

        next();
    }

    /** 点击自动投掷 */
    private onClickAutoDice(_): void {
        const condition = ModelMgr.I.AdventureModel.getAutoLimit();
        if (!condition.state) {
            MsgToastMgr.Show(`${condition.desc}${i18n.tt(Lang.open_open)}`);
            this.TgAutoDice.isChecked = false;
            this.NdAutoDice.active = false;
        }

        if (this.TgAutoDice.isChecked === false && this.NdAutoDice.active) {
            MsgToastMgr.Show(i18n.tt(Lang.adventure_tip_0));
            StorageMgr.I.setValue('auto_dice', false);
            this.NdAutoDice.active = false;
        }
    }

    /** 点击跳过动画 */
    private onClickSkipAnim(_): void {
        const condition = ModelMgr.I.AdventureModel.getSkipLimit();
        if (!condition.state) {
            MsgToastMgr.Show(`${condition.desc}${i18n.tt(Lang.open_open)}`);
            this.TgSkipAnim.isChecked = false;
            return;
        }
        StorageMgr.I.setValue('skip_anim', this.TgSkipAnim.isChecked);
    }

    /** 点击移动测试 */
    private onClickMoveTest(_): void {
        this.moveTo(this.curTileIndex + UtilNum.RandomInt(1, 5));
    }

    /** 点击事件 */
    private onClickEventBtn() {
        WinMgr.I.open(ViewConst.AdventureEventView);
    }

    private onClearEvent() {
        const model = ModelMgr.I.AdventureModel;
        if (!WinMgr.I.checkIsOpen(ViewConst.AdventureEventView)) { model.clearEmptyEvent(true); }
    }

    protected update(dt: number): void {
        if (this.curDice && this.enablleRoll) {
            this.offset.x = 0;
            this.offset.y = 0;
            this.dt += dt * this.rollSpeed;
            this.rollSpeed -= 1 * dt;
            if (this.rollSpeed < 0.4) this.rollSpeed = 0.4;
            if (this.dt >= 0.05) {
                this.dt = 0;
                if (this.curDice === this.NdComDict) {
                    ResMgr.I.loadLocal(`texture/adventure/img_yltx_tóuzi0${UtilNum.RandomInt(1, 6)}`, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
                        if (!cc.isValid(this) || !cc.isValid(this.node)) return;
                        if (this.enablleRoll && res && this.curDice && this.curDice === this.NdComDict) {
                            this.NdComDict.getComponent(cc.Sprite).spriteFrame = res;
                            this.curDice.angle -= 60;
                        }
                    });
                } else {
                    ResMgr.I.loadLocal(`texture/adventure/img_yltx_tóuzi0${UtilNum.RandomInt(7, 12)}`, cc.SpriteFrame, (err, res: cc.SpriteFrame) => {
                        if (!cc.isValid(this) || !cc.isValid(this.node)) return;
                        if (this.enablleRoll && res && this.curDice && this.curDice === this.NdGoldDict) {
                            this.NdGoldDict.getComponent(cc.Sprite).spriteFrame = res;
                            this.curDice.angle -= 60;
                        }
                    });
                }
            }
        }

        if (this.role) {
            /** 锁定镜头 */
            let x = -this.role.x;
            let y = -this.role.y;
            const w2 = this.map.node.width / 2 - this.node.width;
            const h2 = this.map.node.height / 2 - this.node.height / 2;
            x += this.offset.x;
            y += this.offset.y;
            x = Math.max(-800, x);
            x = Math.min(w2, x);
            y = Math.max(-500, y);
            y = Math.min(h2, y);
            const sta = cc.v3(x, y);
            const end = this.map.node.position;

            /** 强制转镜头 */
            if (this.forceLock) {
                this.forceLock = false;
                this.map.node.position = sta;
                return;
            }

            /** 移动镜头 */
            const mag = sta.sub(end).mag();
            if (mag > 1) {
                this.map.node.x = cc.misc.lerp(end.x, x, this.isDrag ? 0.5 : 2 * dt);
                this.map.node.y = cc.misc.lerp(end.y, y, this.isDrag ? 0.5 : 2 * dt);
            } else {
                this.map.node.position = sta;
            }
        }
    }
}
