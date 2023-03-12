/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: lijun
 * @Date: 2023-02-20 11:26:04
 * @Description:
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import UtilItem from '../../../base/utils/UtilItem';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import MatchRoleItem from '../com/MatchRoleItem';
import { HuarongdaoMatchState, IHuarongdaoActivityTimeStep } from '../HuarongdaoConst';
import HuarongdaoMapLayer from './HuarongdaoMapLayer';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HuarongdaoMapView extends BaseCmp {
    @property(cc.Node)
    private NdMap: cc.Node = null;
    @property(HuarongdaoMapLayer)
    private MapLayer: HuarongdaoMapLayer = null;

    @property(MatchRoleItem)
    private NdRole1: MatchRoleItem = null;
    @property(MatchRoleItem)
    private NdRole2: MatchRoleItem = null;
    @property(MatchRoleItem)
    private NdRole3: MatchRoleItem = null;
    @property(MatchRoleItem)
    private NdRole4: MatchRoleItem = null;
    @property(MatchRoleItem)
    private mainRole: MatchRoleItem = null;

    @property(cc.Node)
    private NdSmallMap: cc.Node = null;
    @property(cc.Node)
    private NdSmallRole1: cc.Node = null;
    @property(cc.Node)
    private NdSmallRole2: cc.Node = null;
    @property(cc.Node)
    private NdSmallRole3: cc.Node = null;
    @property(cc.Node)
    private NdSmallRole4: cc.Node = null;
    @property(cc.Node)
    private mainSmallRole: cc.Node = null;

    // 实时距离
    @property(cc.Node)
    private NdDIstance: cc.Node = null;
    @property(cc.Label)
    private LblName1: cc.Label = null;
    @property(cc.Label)
    private LblSpace: cc.Label = null;
    @property(cc.Label)
    private LblDistance: cc.Label = null;
    @property(cc.Label)
    private LblZhuishang: cc.Label = null;
    @property(cc.Label)
    private LblName2: cc.Label = null;

    private _mapId: number = 0;
    private _mapWidth: number = 0;
    private _initEnd: boolean = false;

    private _cfg_map: Cfg_HuarongdaoMap = null;
    private isFinishLoadMapData: boolean = false;

    private _startPosOffset: number = 100;// 起始偏移量
    private _cameraOffset: number = 0;// 镜头偏移

    private _bubbleTime1: number = 0;// 支持气泡时间
    private _bubbleTime2: number = 0;// 追逐气泡时间
    private _bubbleRadio1: number = 0;// 支持气泡比率
    private _bubbleRadio2: number = 0;// 支持气泡比率

    protected start(): void {
        super.start();
    }

    public init(): void {
        this.addE();
    }

    protected addE(): void {
        EventClient.I.on(E.Huarongdao.SupportStateUpdate, this.updateSupportState, this);
    }

    protected remE(): void {
        EventClient.I.off(E.Huarongdao.SupportStateUpdate, this.updateSupportState, this);
    }

    public updateView(): void {
        this.enterMap(1);
        this.updateModle();
        this.loadCurrentPos();
        this.loadCameraOffset();
        this.scheduleOnce(() => {
            this.initMapLayer();
        });
    }

    /** 读取地图配置 */
    private enterMap(mapId: number) {
        this._mapId = mapId;
        this._cfg_map = ModelMgr.I.HuarongdaoModel.getMapByKey(mapId);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this._mapWidth = this._cfg_map.EndPos * this._cfg_map.Conversion + this._startPosOffset;
        this.NdMap.width = this._mapWidth + 50;
        this.isFinishLoadMapData = true;
        this._initEnd = true;

        const cfg_bubble1 = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongdaoBubble1');
        const cfg_bubble2 = ModelMgr.I.HuarongdaoModel.getNormalByKey('HuarongdaoBubble2');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const cfg_array1 = UtilString.SplitToArray(cfg_bubble1.CfgValue);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const cfg_array2 = UtilString.SplitToArray(cfg_bubble2.CfgValue);
        this._bubbleTime1 = Number(cfg_array1[0][0]);
        this._bubbleTime2 = Number(cfg_array2[0][0]);
        this._bubbleRadio1 = Number(cfg_array1[0][1]);
        this._bubbleRadio2 = Number(cfg_array2[0][1]);
    }

    /** 初始化曹操位置 */
    private initMapLayer(): void {
        this.MapLayer.setMapSize(this._mapWidth + 50, 1280);
        if (ModelMgr.I.HuarongdaoModel.getMatchState() < HuarongdaoMatchState.match) {
            this.MapLayer.initPlayCell(this._cfg_map.CCInitPos * this._cfg_map.Conversion + this._startPosOffset, 0);
        } else {
            this.MapLayer.initPlayCell(this.mainRole.node.x, 0);
        }
    }

    public mainUpdate(dt: number): void {
        if (!this._initEnd) return;
        if (this.node.active) {
            if (this.mainRole) this.mainRole.mainUpdate(dt);
            if (this.NdRole1) this.NdRole1.mainUpdate(dt);
            if (this.NdRole2) this.NdRole2.mainUpdate(dt);
            if (this.NdRole3) this.NdRole3.mainUpdate(dt);
            if (this.NdRole4) this.NdRole4.mainUpdate(dt);
            this.followPlayer();
            this.triggerBubbleSche(dt);
            this.updateSmallMap(dt);
        }
    }

    /**
     * 视图跟随玩家
     * @param dt
     */
    private followPlayer(): void {
        const size = cc.view.getVisibleSize();

        if (this._cameraOffset < this._cfg_map.Camera * this._cfg_map.Conversion
            && ModelMgr.I.HuarongdaoModel.getMatchState() >= HuarongdaoMatchState.match) {
            this._cameraOffset++;
        }

        let x = -(this.mainRole.node.x - size.width / 2);
        x -= this._cameraOffset;// 镜头偏移
        // let y = -(this.mainRole.position.y - size.height / 2);

        const outWidth: number = this.NdMap.width - size.width;
        // const outHeight: number = this.NdMap.height - size.height;

        if (outWidth <= 0) {
            x = 0;
        } else if (x > 0) {
            x = 0;
        } else if (x < -outWidth) {
            x = -outWidth;
        }

        // if (outHeight <= 0) {
        //     y = 0;
        // } else if (y > 0) {
        //     y = 0;
        // } else if (y < -outHeight) {
        //     y = -outHeight;
        // }

        const sta = cc.v3(x - size.width / 2 - this.node.x, this.NdMap.y);

        // const end = this.NdMap.position;

        // const mag = sta.sub(end).mag();

        /** 移动镜头 */
        // if (mag > 1 && mag <= 200) {
        //     this.NdMap.x = cc.misc.lerp(end.x, sta.x, 1.5 * dt);
        //     this.NdMap.y = cc.misc.lerp(end.y, sta.y, 1.5 * dt);
        // } else {
        this.NdMap.position = sta;
        // }

        // this.node.setPosition(x - size.width / 2 - this.node.parent.x, y - size.height / 2 - this.node.parent.y);
        if (this.isFinishLoadMapData) {
            this.MapLayer.updateMapPos(this.mainRole.node.x - this._startPosOffset, 0);
        }
    }

    private _distanceUpdateTime = 0.1;// 距离刷新时间间隔
    private _distanceTime = 0;
    // 刷新小地图
    private updateSmallMap(dt: number): void {
        // 赛跑前隐藏小地图
        this.NdSmallMap.active = ModelMgr.I.HuarongdaoModel.getMatchState() >= HuarongdaoMatchState.support;
        // 配置总距离
        const totalDistance = this._cfg_map.EndPos;
        // 曹操当前实时距离
        const roleDistance = this.mainRole.getCurrentDistance();
        this.mainSmallRole.x = (this.NdSmallMap.width - 20) * roleDistance[1] / totalDistance - this.NdSmallMap.width / 2;

        const distanceArray = [];// 追逐武将的实时距离
        let maxDistance: [number, number, string, number, number] = [0, 0, '', 0, 0];// 距离曹操最近的武将数据[id,距离,名字，品质,输赢]
        for (let i = 0; i < 4; i++) {
            distanceArray[i] = this[`NdRole${i + 1}`].getCurrentDistance();
            this[`NdSmallRole${i + 1}`].x = (this.NdSmallMap.width - 10) * distanceArray[i][1] / totalDistance - this.NdSmallMap.width / 2;
            if (maxDistance[1] < distanceArray[i][1]) {
                maxDistance = distanceArray[i];
            }
        }

        if (this._distanceTime >= this._distanceUpdateTime) {
            if (maxDistance[0] && roleDistance[1] - maxDistance[1] > 0) { // 还差x米追上
                this.NdDIstance.active = true;
                this.LblDistance.node.active = this.LblZhuishang.node.active = true;
                this.LblName1.string = maxDistance[2];
                UtilCocos.setLableQualityColor(this.LblName1, maxDistance[3]);
                this.LblSpace.string = i18n.tt(Lang.huarongdao_distance_tip1);
                this.LblDistance.string = (roleDistance[1] - maxDistance[1]).toFixed(1);
                this.LblName2.string = roleDistance[2];
                UtilCocos.setLableQualityColor(this.LblName2, roleDistance[3]);
            } else if (maxDistance[0] && roleDistance[1] - maxDistance[1] <= 0 && maxDistance[4]) { // 抓住曹操
                this.NdDIstance.active = true;
                this.LblDistance.node.active = this.LblZhuishang.node.active = false;
                this.LblName1.string = maxDistance[2];
                UtilCocos.setLableQualityColor(this.LblName1, maxDistance[3]);
                this.LblSpace.string = i18n.tt(Lang.huarongdao_distance_tip3);
                this.LblName2.string = roleDistance[2];
                UtilCocos.setLableQualityColor(this.LblName2, roleDistance[3]);
            } else {
                this.NdDIstance.active = false;
            }
            this._distanceTime = 0;
        } else {
            this._distanceTime += dt;
        }
    }

    /** 更新模型信息 */
    private updateModle(): void {
        const genList = ModelMgr.I.HuarongdaoModel.getGenIdList();

        if (this.mainRole) { this.mainRole.setRoleId(genList.mainRole, this._cfg_map.BaseSpeed, this._cfg_map.Conversion, this._cfg_map.CCInitPos); }
        let ccDistance = 0;// 曹操的终点位置
        const ccPosY = this.mainRole.node.y;// 曹操的纵坐标
        if (genList.mainRole) {
            const mainEntryInfo = ModelMgr.I.HuarongdaoModel.getEntryInfoById(genList.mainRole);
            ccDistance = mainEntryInfo.SecondList.length > 0 ? mainEntryInfo.SecondList[mainEntryInfo.SecondList.length - 1].Distance : 0;
        }
        for (let i = 0; i < 4; i++) {
            const otherRoler = this[`NdRole${i + 1}`];
            if (otherRoler) {
                otherRoler.setRoleId(genList.other[i], this._cfg_map.BaseSpeed, this._cfg_map.Conversion, 0, ccDistance, ccPosY);
            }
        }
    }

    /** 设置初始位置 */
    private loadCurrentPos(): void {
        if (ModelMgr.I.HuarongdaoModel.getMatchState() < HuarongdaoMatchState.match) {
            this.loadInitPos();
        } else {
            // 追逐之后的位置由角色自己刷
        }
    }
    /** 等待时初始位置 */
    public loadInitPos(): void {
        for (let i = 0; i < 4; i++) {
            const otherRoler = this[`NdRole${i + 1}`];
            if (otherRoler) {
                otherRoler.node.x = this._startPosOffset;
            }
        }

        if (!this._cfg_map) {
            this._cfg_map = ModelMgr.I.HuarongdaoModel.getMapByKey(1);
        }
        if (ModelMgr.I.HuarongdaoModel.getMatchState() < HuarongdaoMatchState.countDown) {
            let CCInitPos = this._cfg_map.CCInitPos;
            if (CCInitPos >= 50) {
                CCInitPos = 45;
            }
            this.mainRole.node.x = this._startPosOffset + CCInitPos * this._cfg_map.Conversion;
        } else {
            this.mainRole.node.x = this._startPosOffset + this._cfg_map.CCInitPos * this._cfg_map.Conversion;
        }
    }

    /** 设置镜头偏移量 */
    private loadCameraOffset(): void {
        const camera = this._cfg_map.Camera;
        const conversion = this._cfg_map.Conversion;
        if (ModelMgr.I.HuarongdaoModel.getMatchState() < HuarongdaoMatchState.match) {
            const ccpos = this._startPosOffset + this._cfg_map.CCInitPos * this._cfg_map.Conversion;
            this._cameraOffset = -(ccpos - cc.view.getVisibleSize().width / 2);

            if (this._cameraOffset > camera * conversion) {
                this._cameraOffset = camera * conversion;
            }
        } else if (this._cameraOffset === 0) {
            this._cameraOffset = camera * conversion;
        }
    }

    /** 更新支持状态 */
    private updateSupportState() {
        if (this.mainRole) { this.mainRole.upadteSupportState(); }
        for (let i = 0; i < 4; i++) {
            const otherRoler = this[`NdRole${i + 1}`];
            if (otherRoler) {
                otherRoler.upadteSupportState();
            }
        }
    }

    public updateTimeStep(activityStep?: IHuarongdaoActivityTimeStep): void {
        // this.updateSupportState();
    }

    /** 重置界面 */
    public resetView(): void {
        this.loadInitPos();
        this.updateSmallMap(0);

        if (this.mainRole) { this.mainRole.clearData(); }
        for (let i = 0; i < 4; i++) {
            const otherRoler = this[`NdRole${i + 1}`];
            if (otherRoler) {
                otherRoler.clearData();
            }
        }
    }

    private _triggerBubble = 0;
    /** 触发气泡计时 */
    private triggerBubbleSche(dt: number): void {
        if (ModelMgr.I.HuarongdaoModel.getMatchState() !== HuarongdaoMatchState.match
            && ModelMgr.I.HuarongdaoModel.getMatchState() !== HuarongdaoMatchState.support) { return; }
        this._triggerBubble += dt;
        let radio = 0;
        if (ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.match && this._triggerBubble >= this._bubbleTime2) {
            radio = this._bubbleRadio2;
        } else if (ModelMgr.I.HuarongdaoModel.getMatchState() === HuarongdaoMatchState.support && this._triggerBubble >= this._bubbleTime1) {
            radio = this._bubbleRadio1;
        }
        if (radio > 0) {
            const random = UtilNum.RandomInt(1, 10);
            if (random <= radio / 1000) {
                const randomId = UtilNum.RandomInt(1, 5);
                if (randomId === 5) {
                    this.mainRole.triggerBubble();
                } else {
                    this[`NdRole${randomId}`].triggerBubble();
                }
            }
            this._triggerBubble = 0;
        }
    }

    /** 抓曹操 */
    public catchCaocaoAnim(): void {
        for (let i = 0; i < 4; i++) {
            const otherRoler = this[`NdRole${i + 1}`];
            if (otherRoler) {
                otherRoler.catchCaocaoAnim();
            }
        }
    }

    // update (dt) {}
}
