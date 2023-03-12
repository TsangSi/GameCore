/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { CCAtlas } from '../../../../../app/engine/atlas/CCAtlas';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { TickTimer } from '../../../../base/components/TickTimer';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import { ItemWhere } from '../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import { RoadData } from '../SilkRoadConst';
import SilkroadelectItem from './SilkRoadSelectItem';
import { SilkRoadSelectView } from './SilkRoadSelectView';
import SkillRoadCity from './SkillRoadCity';

const { ccclass, property } = cc._decorator;

const offset = 180;

const citys: number[][] = [
    [628, 16 - offset],
    [595, 280 - offset],
    [360, 438 - offset],
    [120, 335 - offset],
    [-145, 438 - offset],
    [-540, 438 - offset],
    [362, -64 - offset],
    [16, -82 - offset],
    [302, 142 - offset],
    [-38, 162 - offset],
    [-348, 240 - offset],
    [-695, 245 - offset],
    [-615, 45 - offset],
    [-242, -96 - offset],
    [-506, -142 - offset],
];

/**
 * 西域行商
 * @author juny
 */
@ccclass
export class SilkRoadMapView extends cc.Component {
    @property(SilkroadelectItem)
    private item: SilkroadelectItem = null;

    @property(cc.Node)
    private NdTop: cc.Node = null;

    @property(DynamicImage)
    private NdEventIcon: DynamicImage = null;

    @property(TickTimer)
    private LabOutTime: TickTimer = null;

    @property(cc.Node)
    private NdFastBtn: cc.Node = null;

    @property(cc.Node)
    private NdRole: cc.Node = null;

    @property(cc.Node)
    private NdMapLayout: cc.Node = null;

    @property(DynamicImage)
    private NdCostIcon: DynamicImage = null;

    @property(cc.Label)
    private LabCostNum: cc.Label = null;

    @property(cc.Label)
    private LabState: cc.Label = null;

    @property(TickTimer)
    private LabStateTime: TickTimer = null;

    @property(cc.ProgressBar)
    private progpressBar: cc.ProgressBar = null;

    @property(cc.Node)
    private NdLines: cc.Node = null;

    @property(cc.Node)
    private NdBubble: cc.Node = null;

    @property(cc.Prefab)
    private PfbCity: cc.Prefab = null;

    private data: RoadData = null;

    private action: cc.Tween = null;

    private isFinfish: boolean = false;

    private stateDt: number = 0;

    private stateCd: number = 0;

    protected start(): void {
        EventClient.I.on(E.SilkRoad.finish, this.onSilkRoadFinish, this);
        cc.game.on(cc.game.EVENT_SHOW, () => {
            if (this.action && !this.isFinfish) {
                const model = ModelMgr.I.SilkRoadModel;
                const info = model.getInfo();
                const time = UtilTime.NowSec() - info.StartTime;
                this.action.goto(time);
                const curTime = UtilTime.NowSec();
                this.LabOutTime.tick(info.FinishTime - curTime, '%HH:%mm:%ss', true, true);
            }
        }, this);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.SilkRoad.finish, this.onSilkRoadFinish, this);
        cc.game.targetOff(this);
    }

    private onSilkRoadFinish(): void {
        this.moveToEnd();
    }

    public init(): void {
        const model = ModelMgr.I.SilkRoadModel;
        this.NdRole.zIndex = 2;
        this.NdBubble.zIndex = 3;
        for (let i = 0; i < citys.length; ++i) {
            const item = cc.instantiate(this.PfbCity);
            this.NdMapLayout.insertChild(item, i + 1);
            const name = model.getCityName(i + 1);
            let str = '';
            for (let i = 0; i < name.length; ++i) {
                if (str.length) str += '\n';
                str += name[i];
            }
            item.children[2].children[0].getComponent(cc.Label).string = str;
            item.setPosition(citys[i][0], citys[i][1]);
            item.getComponent(SkillRoadCity).setData(i + 1);
        }

        console.log(this.NdMapLayout.children);

        const cost = model.getSilkRoadTimesCost();

        const info = model.getInfo();

        const costImgUrl: string = UtilCurrency.getIconByCurrencyType(cost.id);
        if (this.NdCostIcon) this.NdCostIcon.loadImage(costImgUrl, 1, true);
        if (this.LabCostNum) this.LabCostNum.string = `${UtilNum.Convert(cost.num)}`;

        /** 点击快速完成 */
        UtilGame.Click(this.NdFastBtn, () => {
            if (this.isFinfish) return;
            const name = UtilItem.NewItemModel(cost.id).cfg.Name;
            const str = UtilString.FormatArray(i18n.tt(Lang.silkroad_tip), [`${cost.num}${UtilItem.NewItemModel(2).cfg.Name}`, UtilColor.GreenV]);
            ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
                const count = RoleMgr.I.getCurrencyById(cost.id);
                if (count < cost.num) {
                    /** 消耗不足 */
                    MsgToastMgr.Show(name + i18n.tt(Lang.com_buzu));
                    WinMgr.I.open(ViewConst.ItemSourceWin, cost.id);

                    return;
                }
                ControllerMgr.I.SilkRoadController.reqFastFinish(info.Id);
            });
        }, this);

        /** 初始化逻辑 */
        this.moveTo(info);
    }

    /** 移动到终点 */
    private moveToEnd() {
        if (this.isFinfish) return;
        if (this.action && this.data.time) {
            this.action.goto(this.data.time);
            this.action.stop();
            this.action = null;
            const idx = this.data.points[this.data.points.length - 1].id;
            const pos = cc.v3(this.NdMapLayout.children[idx].position);
            pos.y += 50;
            pos.x += 20;
            this.NdRole.position = pos;
        }

        const model = ModelMgr.I.SilkRoadModel;

        const info = model.getInfo();

        const road = model.getRoadData(info.Id);

        this.isFinfish = true;
        this.LabOutTime.tick(0, '%HH:%mm:%ss');
        let reward = '';
        let reward2 = '';

        info.BaseItemInfos.forEach((item) => {
            const itemStr = `${item.ItemId}:${item.ItemNum}`;
            if (reward.length) reward += '|';
            reward += itemStr;
        });

        info.CityInfos.forEach((city) => {
            city.ItemInfos.forEach((item) => {
                const itemStr = `${item.ItemId}:${item.ItemNum}`;
                console.log(itemStr);
                if (reward2.length) reward2 += '|';
                reward2 += itemStr;
            });
        });

        const color = UtilItem.GetItemQualityColor(road.quality);

        this.NdRole.getComponent(cc.Animation).play(`stand${this.type}`);

        WinMgr.I.open(ViewConst.SilkRoadReward, `<color=${color}>${road.name}</color>`, reward, reward2);
    }

    /** 设置状态
     * @param  state 状态
     * @param  desc 注释
     */
    private setState(state: number, desc: string, time: number, cd: number) {
        this.stateDt = time;
        this.stateCd = cd;
        this.LabState.string = desc;
        if (cd - time > 0) { this.LabStateTime.tick(cd - time, `${i18n.tt(Lang.com_format_time)})`, false); }
        if (state !== 3) {
            this.NdBubble.stopAllActions();
            this.NdBubble.opacity = 0;
        }
        if (state === 1) {
            this.NdRole.getComponent(cc.Animation).play(`run${this.type}`);
        } else {
            this.NdRole.getComponent(cc.Animation).play(`stand${this.type}`);
        }

        if (state === 1) {
            this.NdEventIcon.loadImage('texture/silkRoad/icon_xyxs_baoxiang');
        } else if (state === 2) {
            this.NdEventIcon.loadImage('texture/silkRoad/icon_xyxs_baoxiang_1');
        }
    }

    /**
     * @func 移动人物
     * @id 路线ID
     * @time 当前已经消耗时间
    */

    /** 地图类型 */
    private type: number = 1;

    private moveTo(info: SilkRoadInfo): void {
        if (this.action) {
            this.action.stop();
            this.action = null;
        }

        const model = ModelMgr.I.SilkRoadModel;

        const id = info.Id;

        this.type = id;

        const time = UtilTime.NowSec() - info.StartTime;

        const road = model.getRoadData(id);

        const curTime = UtilTime.NowSec();

        let finish = false;

        /** 是否完成判断 */
        if (curTime > info.FinishTime) {
            this.isFinfish = true;
            this.LabOutTime.tick(0, '%HH:%mm:%ss', true, true);
            let reward = '';
            let reward2 = '';

            info.BaseItemInfos.forEach((item) => {
                const itemStr = `${item.ItemId}:${item.ItemNum}`;
                if (reward.length) reward += '|';
                reward += itemStr;
            });

            info.CityInfos.forEach((city) => {
                city.ItemInfos.forEach((item) => {
                    const itemStr = `${item.ItemId}:${item.ItemNum}`;
                    console.log(itemStr);
                    if (reward2.length) reward2 += '|';
                    reward2 += itemStr;
                });
            });

            const color = UtilItem.GetItemQualityColor(road.quality);

            this.NdRole.getComponent(cc.Animation).play(`stand${this.type}`);

            WinMgr.I.open(ViewConst.SilkRoadReward, `<color=${color}>${road.name}</color>`, reward, reward2);

            finish = true;
        } else {
            this.LabOutTime.tick(info.FinishTime - curTime, '%HH:%mm:%ss', true, true);
        }

        this.item.setData(road);

        const tw = cc.tween(this.NdRole);

        const cd = model.getSilkRoadNormalCD();

        let js: number = time;

        road.points.forEach((v, i) => {
            const idx = v.id;
            const next = road.points[i + 1];
            /** 此处可能需要获取曲线 目前用的直线移动 */
            const node = this.NdMapLayout.children[idx];
            const p = node.position;
            const pos = cc.v3(p);
            pos.y += 50;
            pos.x += 20;
            tw.call(() => {
                if (!finish) this.setState(1, i18n.tt(Lang.silkroad_state1), js > 0 ? js : 0, v.time);
                js -= v.time;
            });
            tw.to(v.time, { position: pos });
            if (next) {
                if (i !== 0) {
                    tw.call(() => {
                        const city = info.CityInfos.find((item) => item.CityId === v.id);
                        /** 显示城镇随机事件 */
                        if (city) {
                            const idx = city.CityId;
                            const pos = cc.v3(this.NdMapLayout.children[idx].position);
                            pos.y += 50;
                            pos.x += 20;
                            const ev = model.getEventDesc(city.EventId);
                            if (this.action && city.ItemInfos.length) {
                                this.scheduleOnce(() => {
                                    const cfg = UtilItem.NewItemModel(city.ItemInfos[0].ItemId);
                                    const color = UtilItem.GetItemQualityColor(cfg.cfg.Quality, false);
                                    MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.silkroad_tip9), ev.Name, color, cfg.cfg.Name));
                                }, cd);
                            }
                            const evId = Math.max(2, Math.min(5, city.EventId));
                            this.NdEventIcon.loadImage(`texture/silkRoad/icon_xyxs_baoxiang_${evId}`);
                            if (!finish) this.setState(3, ev.Name, js > 0 ? js : 0, cd);
                            js -= cd;
                            const bubble = this.NdBubble;
                            bubble.getChildByName('text').getComponent(cc.RichText).string = ev.Desc;
                            pos.y += 30;
                            pos.x += 10;
                            bubble.setPosition(pos);
                            bubble.stopAllActions();
                            bubble.runAction(cc.sequence(
                                cc.fadeIn(0.2),
                                cc.delayTime(cd),
                                cc.fadeOut(0.1),
                            ));

                            return;
                        }
                        if (!finish) this.setState(2, i18n.tt(Lang.silkroad_state2), js > 0 ? js : 0, cd);
                        js -= cd;
                    });
                    tw.delay(cd);
                }
                // 动态生成线条
                const l = cc.instantiate(this.NdLines.children[0]);
                this.NdLines.addChild(l);
                l.active = true;
                l.setPosition(p);
                const nnode = this.NdMapLayout.children[next.id];
                const pos = nnode.position;
                const dir = pos.sub(p);
                l.width = dir.mag();
                l.angle = -(dir.signAngle(cc.v2(0, 1)) / Math.PI * 180) + 90;
            }
        });

        tw.start().goto(time);

        this.NdMapLayout.runAction(cc.fadeIn(0.2));

        this.scheduleOnce(() => {
            this.data = road;
            this.action = tw;
        });
    }

    private lastX = null;

    protected update(dt: number): void {
        let x = -this.NdRole.x;
        const y = -this.NdRole.y;
        const w2 = this.NdMapLayout.width / 2 - this.node.width / 2;
        x = Math.max(-w2, x);
        x = Math.min(w2, x);
        this.NdMapLayout.x = Math.floor(x);
        this.NdMapLayout.y = Math.floor(Math.min(150, Math.max(20, y)));

        if (this.lastX) {
            if (this.lastX < this.NdRole.x) this.NdRole.scaleX = 1;
            else this.NdRole.scaleX = -1;
        }

        this.lastX = this.NdRole.x;

        if (this.stateCd > 0) {
            this.stateDt += dt;
            this.progpressBar.progress = Math.min(1, this.stateDt / this.stateCd);
        } else {
            this.progpressBar.progress = 0;
        }
    }
}
