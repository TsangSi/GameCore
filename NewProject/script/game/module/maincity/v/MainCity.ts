/*
 * @Author: zs
 * @Date: 2022-07-06 14:26:14
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\maincity\v\MainCity.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { EffectMgr } from '../../../manager/EffectMgr';
import { AssetType } from '../../../../app/core/res/ResConst';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import {
    ACTION_DIRECT, ANIM_TYPE, ACTION_TYPE,
} from '../../../base/anim/AnimCfg';
import AnimCom from '../../../base/anim/AnimCom';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ControllerIds } from '../../../const/ControllerIds';
import { E } from '../../../const/EventName';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ModelMgr from '../../../manager/ModelMgr';
import MapCfg from '../../../map/MapCfg';
import { Link } from '../../link/Link';
import { EActivityRedId, RID } from '../../reddot/RedDotConst';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import EntityBase from '../../../entity/EntityBase';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;
@ccclass
export class MainCity extends BaseUiView {
    @property(cc.Node)
    private NodeSprites: cc.Node = null;
    @property(cc.Node)
    private NodeButtons: cc.Node = null;
    @property(cc.Node)
    private NodeNpcs: cc.Node = null;
    @property(cc.Node)
    private NodeMap: cc.Node = null;
    @property(cc.Sprite)
    private SpriteMiniMap: cc.Sprite = null;
    @property(cc.Node)
    private NodeAni: cc.Node = null;
    @property(cc.Node)
    private NodeEffect: cc.Node = null;
    // /** 地图切片数量 */
    // private bgCount = 10;
    /** 地图图加载数量 */
    private bgLoadCount = 0;
    /** 地图资源id */
    private mapResId = 1001;
    /** 地图最大高度 */
    private maxHeight = 1680;
    /** 边界最大位置 */
    private maxPos: cc.Vec2 = cc.v2(0, 0);
    /** 边界最小位置 */
    private minPos: cc.Vec2 = cc.v2(0, 0);
    private sliceCount = 0;
    private cfgData: Cfg_MainCity;
    private _role: EntityBase = null;

    protected onLoad(): void {
        super.onLoad();
    }

    protected start(): void {
        super.start();
        this.onChangeMap();
        EventClient.I.on(E.MainCity.ChangeMap, this.onChangeMap, this);
        RoleMgr.I.on(this.onUpdateRole, this, RoleAN.N.Title, RoleAN.N.PlayerSkin, RoleAN.N.GradeHorse, RoleAN.N.GradeWeapon, RoleAN.N.GradeWing);
        this.NodeMap.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    private onChangeMap() {
        this.mapResId = ModelMgr.I.MainCityModel.getCurHourShowId(); // 1001;
        console.log('更新地图=', this.mapResId);
        this.cfgData = ModelMgr.I.MainCityModel.getCfgData(this.mapResId);
        this.showMap();
        this.showNpc();
        this.showButton();
        this.showRole();
        this.showEffect();
        this.NodeMap.setPosition(this.cfgData.Width * -0.5, this.maxHeight * -0.5);
    }

    /** 显示地图 */
    private showMap() {
        this.sliceCount = Math.ceil(this.cfgData.Width / this.cfgData.SliceWidth);
        this.bgLoadCount = 0;
        this.SpriteMiniMap.node.active = true;
        // this.SpriteMiniMap.node.getComponent(UITransform).setContentSize(this.cfgData.Width, this.maxHeight);
        this.SpriteMiniMap.node.setContentSize(this.cfgData.Width, this.maxHeight);
        this.loadRemoteMapBg(this.SpriteMiniMap, `${RES_ENUM.Maincity_Map_Minimap}${this.mapResId}`);
        this.node.getComponent(cc.Widget).updateAlignment();
        // const size = this.node._uiProps.uiTransformComp.contentSize;
        const size = this.node.getContentSize();
        this.minPos.x = size.width * -0.5;
        this.minPos.y = size.height * -0.5;
        this.maxPos.x = this.minPos.x - this.cfgData.Width + size.width;
        this.maxPos.y = this.minPos.y - this.maxHeight + size.height;
        this.NodeSprites.setContentSize(this.cfgData.Width, this.maxHeight);
        this.NodeMap.setContentSize(this.cfgData.Width, this.maxHeight);
        for (let i = 0, n = Math.max(this.sliceCount, this.NodeSprites.children.length); i < n; i++) {
            if (i >= this.sliceCount) {
                if (this.NodeSprites.children[i]) {
                    this.NodeSprites.children[i].destroy();
                }
                continue;
            }
            const node = this.NodeSprites.children[i] || new cc.Node();
            if (!this.NodeSprites.children[i]) {
                node.addComponent(cc.Sprite);
                node.setAnchorPoint(0, 0);
                this.NodeSprites.addChild(node);
                node.name = `cc.Sprite${i + 1}`;
            }
            const sprite = node.getComponent(cc.Sprite);
            this.loadRemoteMapBg(sprite, `${RES_ENUM.Maincity_Map}${this.mapResId}/1_${i + 1}`, () => {
                this.loadRemoteMapBgResult(sprite, i);
            });
        }
    }

    /** 显示npc */
    private showNpc() {
        if (!this.cfgData.Npc) {
            return;
        }
        const npcs = this.cfgData.Npc.split('|');
        this.NodeNpcs.destroyAllChildren();
        const cfgNpcIndexer = Config.Get(Config.Type.Cfg_MainCity_Npc);
        let data: Cfg_MainCity_Npc;
        npcs.forEach((id, i) => {
            if (id) {
                data = cfgNpcIndexer.getValueByKey(+id);
                let npc: AnimCom | cc.Node;
                const poss = data.EndPos.split('|');
                const dataPos: number[][] = [];
                poss.forEach((pos) => {
                    const ps: number[] = [];
                    pos.split(',').forEach((p) => {
                        ps.push(+p);
                    });
                    dataPos.push(ps);
                });
                const node = new cc.Node(`Npc${i}`);
                this.NodeNpcs.addChild(node);
                node.setPosition(+dataPos[0][0], +dataPos[0][1]);
                if (data.ResId && data.Restype) {
                    npc = new AnimCom({
                        resId: data.ResId,
                        resType: data.Restype as ANIM_TYPE,
                        isFight: false,
                    });
                    const n = npc as AnimCom;
                    n.playAction(ACTION_TYPE.STAND, ACTION_DIRECT.RIGHT_DOWN);
                    // n.setScale(v3(0.2, 0.2, npc.scale.z));
                    n.setScale(new cc.Vec2(0.2, 0.2));
                    // n.layer = this.NodeMap.layer;
                    n.name = 'npc';
                    node.addChild(n);
                } else {
                    const nodeName = `${i}_${data.Restype}`;
                    const nodeEffect = node.getChildByName(nodeName);
                    if (nodeEffect) {
                        nodeEffect.destroy();
                        node.removeChild(nodeEffect);
                    }
                    EffectMgr.I.showEffect(`${RES_ENUM.Com}${data.Restype}`, node, cc.WrapMode.Loop, (n) => {
                        n.name = nodeName;
                    });
                }
                // 行走动作
                if (dataPos.length > 1) {
                    this.npcMoveAction(node as AnimCom, dataPos);
                }

                // 说话动作
                if (data.Say) {
                    const strs = data.Say.split('|');
                    this.npcSayAction(node, strs);
                }
            }
        });
    }

    /** 显示建筑按钮 */
    private showButton() {
        const mcbIndexer = Config.Get(Config.Type.Cfg_MainCity_Build);
        const build = this.cfgData.Build || '';
        const builds = build.split('|');
        let cfgMcb: Cfg_MainCity_Build;
        let data: string[] = [];
        let x = 0;
        let y = 0;
        for (let i = 0, n = Math.max(builds.length, this.NodeButtons.children.length); i < n; i++) {
            let node = this.NodeButtons.children[i];
            if (!builds[i]) {
                if (node) {
                    if (i === 0) {
                        node.active = false;
                    }
                    node.destroy();
                    this.NodeButtons.removeChild(node);
                }
                continue;
            }
            data = builds[i].split(',');
            node = node || cc.instantiate(this.NodeButtons.children[0]);
            node.parent = node.parent || this.NodeButtons;
            node.active = true;
            const sprite = node.getComponent(cc.Sprite);
            cfgMcb = mcbIndexer.getValueByKey(Number(data[0]));

            UtilCocos.LoadSpriteFrame(sprite, `${RES_ENUM.Chat}${cfgMcb.NameBg}`);
            UtilCocos.SetString(node, 'Label', cfgMcb?.Name || '');
            if (data.length > 2) { // 有自定义的坐标
                x = Number(data[1]) || 0;
                y = Number(data[2]) || 0;
            } else { // 默认坐标
                data = cfgMcb?.Pos.split(',');
                x = data ? Number(data[0]) : 0;
                y = data ? Number(data[1]) : 0;
            }
            node.setPosition(x || 0, y || 0);
            node.targetOff(this);
            UtilGame.Click(node, this.onClickButton, this, { customData: cfgMcb?.FuncId || 12 });
            this.bindRedDot(node, cfgMcb?.FuncId);
        }
    }

    /** 绑定红点id */
    private bindRedDot(node: cc.Node, funcId: number) {
        let cId: number = 0;
        const cfgFunc: Cfg_Client_Func = UtilFunOpen.getFuncCfg(funcId);
        if (cfgFunc) {
            cId = cfgFunc.UI;
        }
        let rid: number = 0;
        switch (cId) {
            case ControllerIds.ShopController:
                rid = RID.Shop.Id;
                break;
            case ControllerIds.MailController:
                rid = RID.Bag.Mail.Id;
                break;
            case ControllerIds.BagController:
                rid = RID.Bag.Id;
                break;
            // case ControllerIds.RechargeController:
            // break;
            case ControllerIds.RoleSkinController:
                rid = RID.Role.Role.Skin.Id;
                break;
            case ControllerIds.GeneralController:
                rid = RID.General.Id;
                break;
            case ControllerIds.RoleOfficialController:
                rid = RID.Role.RoleOfficial.Official.Id;
                break;
            case ControllerIds.ArmyLevelController:
                rid = RID.Role.RoleOfficial.ArmyLevel.Id;
                break;
            case ControllerIds.ActivityController:
                rid = EActivityRedId + funcId;
                break;
            default:
                break;
        }
        UtilRedDot.Bind(rid, node, cc.v2(20, 40));
    }

    /** 显示烟花特效 */
    private showEffects: string[] = [];
    private showEffect() {
        this.NodeEffect.destroyAllChildren();
        this.showEffects.length = 0;
        if (!this.cfgData.Effect || !this.cfgData.EffectPos) { return; }
        const yanhuas = this.cfgData.Effect.split('|');
        const yanhuapos = this.cfgData.EffectPos.split('|');
        for (let i = 0, n = yanhuas.length; i < n; i++) {
            const pos = yanhuapos[i].split(',');
            const url = `${RES_ENUM.Com}${yanhuas[i]}`;
            this.showEffects.push(url);
            const node = new cc.Node(url);
            this.NodeEffect.addChild(node);
            EffectMgr.I.showEffectBySelf(url, node, cc.WrapMode.Loop, (n) => {
                if (this.showEffects.indexOf(url) < 0) {
                    n.destroy();
                } else {
                    n.setPosition(Number(pos[0]), Number(pos[1]));
                }
            });
        }
    }

    private onClickButton(node: cc.Node, funcId: number) {
        if (funcId !== undefined && funcId !== null) {
            Link.To(funcId);
        }
    }

    /**
     * 简单计算获取两个坐标之间的行走时间
     * @param x 起始x
     * @param y 起始y
     * @param ex 终点x
     * @param ey 终点y
     * @returns
     */
    private getRunTime(x: number, y: number, ex: number, ey: number) {
        const dx = Math.abs(x - ex);
        const dy = Math.abs(y - ey);
        if (dx > dy) {
            return dx / 100 * 1.5 + dy / 100 * 0.5;
        } else {
            return dy / 100 * 1.5 + dx / 100 * 0.5;
        }
    }

    /**
     * npc移动动作
     * @param npc
     * @param poss 移动坐标
     */
    private npcMoveAction(node: cc.Node, poss: number[][]) {
        let nextPos: number[];
        let curPos: number[] = [node.position.x, node.position.y];
        const action = cc.tween(node);
        const reverActions: cc.Tween<cc.Node>[] = [];
        for (let i = 1, n = poss.length; i < n; i++) {
            nextPos = poss[i];
            curPos = poss[i - 1] || curPos;
            const dir = MapCfg.I.useCellSerial2Direct(curPos[0], curPos[1], nextPos[0], nextPos[1]);
            const time = this.getRunTime(curPos[0], curPos[1], nextPos[0], nextPos[1]);
            this.makeTweenAction(action, node, ACTION_TYPE.RUN, dir, time, cc.v2(nextPos[0], nextPos[1]));
            if (nextPos[2]) {
                this.makeTweenAction(action, node, ACTION_TYPE.STAND).delay(nextPos[2]);
            }
            const rdir = MapCfg.I.useCellSerial2Direct(nextPos[0], nextPos[1], curPos[0], curPos[1]);
            const ra = cc.tween(node);
            this.makeTweenAction(ra, node, ACTION_TYPE.RUN, rdir, time, cc.v2(curPos[0], curPos[1]));
            if (curPos[2]) {
                this.makeTweenAction(ra, node, ACTION_TYPE.STAND).delay(curPos[2]);
            }
            reverActions.unshift(ra);
        }
        this.makeTweenAction(action, node, ACTION_TYPE.STAND);
        reverActions.push(this.makeTweenAction(undefined, node, ACTION_TYPE.STAND));
        if (reverActions.length > 1) {
            action.sequence(reverActions.shift(), ...reverActions);
        } else {
            action.then(reverActions[0]);
        }
        this.scheduleOnce(() => {
            cc.tween(node).then(action).repeatForever()
                .start();
        }, UtilNum.RandomFloat(0, 2));
    }

    private makeTweenAction(t: cc.Tween<cc.Node>, node: cc.Node, type: ACTION_TYPE, dir?: ACTION_DIRECT, time?: number, pos?: cc.Vec2) {
        const action = t || cc.tween(node);
        if (time && pos) {
            return action.call(() => { this.playAction(node, type, dir); }).to(time, { position: cc.v3(pos.x, pos.y) });
        } else {
            return action.call(() => { this.playAction(node, type, dir); });
        }
    }

    /**
     * 播放npc动作
     * @param npc 节点
     * @param type 动作类型
     * @param dir 动作方向
     */
    private playAction(node: cc.Node, type: ACTION_TYPE, dir?: ACTION_DIRECT) {
        if (node && node.isValid) {
            const npc = node.getChildByName('npc') as AnimCom;
            npc?.playAction(type, dir);
        } else {
            cc.Tween.stopAllByTarget(node);
        }
    }

    /** npc说话 */
    private npcSayAction(node: cc.Node, strs: string[], index: number = undefined) {
        if (!node || !node.isValid) {
            return;
        }
        const len = strs.length;
        let randomIndex = UtilNum.RandomInt(0, len - 1);
        let randomCount = 0;
        while (randomIndex === index && randomCount < len) {
            randomIndex = UtilNum.RandomInt(0, len - 1);
            randomCount++;
        }
        if (randomCount >= len) {
            randomIndex = 0;
        }

        let nodeSay = node.getChildByName('LabelSay');
        if (!nodeSay) {
            nodeSay = new cc.Node('LabelSay');
            const label = nodeSay.addComponent(cc.Label);
            label.fontSize = 22;
            // nodeSay.layer = node.layer;
            nodeSay.setPosition(0, 50);
            node.addChild(nodeSay);
        }
        nodeSay.active = true;
        UtilCocos.SetString(nodeSay, strs[randomIndex]);
        this.scheduleOnce(() => {
            nodeSay.active = false;
        }, UtilNum.RandomInt(3, 5));
        this.scheduleOnce(() => {
            this.npcSayAction(node, strs, randomIndex);
        }, UtilNum.RandomInt(7, 10));
    }

    private loadRemoteMapBg(sprite: cc.Sprite, url: string, callback?: () => void) {
        ResMgr.I.loadRemote(url, AssetType.SpriteFrame_jpg, (err, spriteFrame: cc.SpriteFrame) => {
            // eslint-disable-next-line max-len, dot-notation, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            if (err || !sprite || !sprite.node || !sprite.node.isValid || (spriteFrame['_uuid'] && spriteFrame['_uuid'].indexOf(this.mapResId.toString()) < 0)) {
                return;
            }
            sprite.spriteFrame = spriteFrame;
            if (callback) {
                callback();
            }
        });
    }

    private loadRemoteMapBgResult(sprite: cc.Sprite, index: number) {
        sprite.spriteFrame.getTexture().setWrapMode(cc.Texture2D.WrapMode.CLAMP_TO_EDGE, cc.Texture2D.WrapMode.CLAMP_TO_EDGE);
        sprite.node.setPosition(index * this.cfgData.SliceWidth, 0);
        this.bgLoadCount++;
        if (this.bgLoadCount >= this.sliceCount) {
            this.SpriteMiniMap.spriteFrame = null;
            this.SpriteMiniMap.node.active = false;
        }
    }

    private onTouchMove(event: cc.Event.EventTouch) {
        const diff: cc.Vec2 = event.getDelta();
        const x = Math.max(this.maxPos.x, Math.min(this.minPos.x, this.NodeMap.position.x + diff.x));
        const y = Math.max(this.maxPos.y, Math.min(this.minPos.y, this.NodeMap.position.y + diff.y));
        this.NodeMap.setPosition(x, y);
    }

    private showRole() {
        this.NodeAni.destroyAllChildren();
        this._role = EntityUiMgr.I.createAttrEntity(this.NodeAni, { isMainRole: true, isShowTitle: true });
        const pos = this.cfgData.ShowPos.split(',');
        this.NodeAni.setPosition(Number(pos[0]), Number(pos[1]));
    }

    protected onEnable(): void {
        // if (this.NodeAni.children.length > 0) {
        //     this.NodeAni.destroyAllChildren();
        //     EntityUiMgr.I.createAttrEntity(this.NodeAni, { isMainRole: true, isShowTitle: true });
        // }
        if (this._role) {
            this._role.resume();
        }
    }

    private onUpdateRole() {
        this.NodeAni.destroyAllChildren();
        this._role = EntityUiMgr.I.createAttrEntity(this.NodeAni, { isMainRole: true, isShowTitle: true });
    }

    protected onDestroy(): void {
        RoleMgr.I.off(this.onUpdateRole, this, RoleAN.N.Title, RoleAN.N.PlayerSkin, RoleAN.N.GradeHorse, RoleAN.N.GradeWeapon, RoleAN.N.GradeWing);
    }
}
