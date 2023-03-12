/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: hwx
 * @Date: 2022-05-11 10:01:02
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\v\ActivityButton.ts
 * @Description: 大厅活动按钮
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../../../base/utils/UtilGame';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { TickTimer } from '../../../base/components/TickTimer';
import { EffectMgr } from '../../../manager/EffectMgr';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { EActivityRedId } from '../../reddot/RedDotConst';
import ModelMgr from '../../../manager/ModelMgr';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { ActData } from '../ActivityConst';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ControllerIds } from '../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class ActivityButton extends BaseCmp {
    @property({ type: DynamicImage })
    public SprIcon: DynamicImage = null;

    @property({ type: cc.Node })
    private NdAnima: cc.Node = null;

    @property({ type: DynamicImage })
    private SprAdorn: DynamicImage = null;

    @property({ type: TickTimer })
    public LabTime: TickTimer = null;

    /** 按钮数据 */
    private _data: ActData;

    /** 点击回调 */
    private _onClick: (data: ActData) => void;

    protected start(): void {
        super.start();

        // 注册点击事件
        UtilGame.Click(this.node, () => {
            if (this._onClick) this._onClick(this._data);
        }, this);

        this.addE();
    }

    private addE() {
        EventClient.I.on(E.Activity.Red, this.checkRed, this);
    }

    private remE() {
        EventClient.I.off(E.Activity.Red, this.checkRed, this);
    }

    public getData(): ActData {
        return this._data;
    }

    public setData(data: ActData): void {
        this._data = data;

        // 初始化图标
        const iconUrl = `${RES_ENUM.Activity_Icon}${data.Config.PosIcon}`;
        this.SprIcon.loadImage(iconUrl, 1, true);

        // 初始化动画
        this.showAnim(this.NdAnima);

        // 初始化倒计时
        if (!data.Config.HideTimestamp && data.StartTime && data.EndTime) {
            const second = data.EndTime - UtilTime.NowSec();// data.StartTime;

            if (second < (24 * 60 * 60)) {
                this.LabTime.tick(second, '%HH:%mm:%ss');
            } else {
                this.LabTime.tick(second, '%dd天%HH时');
            }

            this.LabTime.addTickEventHandler(this.node, 'ActivityButton', 'onTick');
            this.LabTime.node.parent.active = true;
        } else {
            this.LabTime.node.parent.active = false;
        }

        // Win注册
        WinMgr.I.addConfig({
            id: data.FuncId, // ViewConst.ActivityWin +
            layerType: GameLayerEnum.DEFAULT_LAYER,
            prefabPath: UI_PATH_ENUM.ActivityWin,
            mid: ControllerIds.ActivityController,
            resClass: (node: cc.Node): BaseUiView => node.getComponent('ActivityWin') as BaseUiView,
        });

        // 红点
        UtilRedDot.Bind(EActivityRedId + data.FuncId, this.node, cc.v2(25, 35));
        this.checkRed();
    }

    private checkRed() {
        let isRed: boolean = false;
        const actIds: number[] = ModelMgr.I.ActivityModel.getActsByContainerId(this._data.FuncId);
        if (actIds && actIds.length) {
            for (let i = 0; i < actIds.length; i++) {
                const actData: ActData = ModelMgr.I.ActivityModel.getActivityData(actIds[i]);
                if (actData && actData.Red) {
                    isRed = true;
                    break;
                }
            }
        }

        RedDotMgr.I.updateRedDot(EActivityRedId + this._data.FuncId, isRed);
    }

    private showAnim(nd: cc.Node) {
        if (!this._data || !this._data.Config.PosCircle) {
            nd.active = false;
            return;
        }
        const n = nd.getChildByName('btnEffect');
        if (!n) {
            EffectMgr.I.showAnim(`${RES_ENUM.Com_Ui}${this._data.Config.PosCircle}`, (node: cc.Node) => { // 6048
                if (nd && nd.isValid) {
                    const eff = nd.getChildByName('btnEffect');
                    if (eff) {
                        eff.destroy();
                    }
                    nd.active = true;
                    nd.addChild(node);
                    node.setScale(0.7, 0.7, 0.7);
                    node.name = 'btnEffect';
                }
            });
        }
    }

    private onTick(second: number): void {
        // 逆时针倒计时，如果剩余时间小于1天，就修改格式
        if (second < (24 * 60 * 60)) {
            this.LabTime.format = '%HH:%mm:%ss';
            // 倒计时到0
            if (second <= 0) {
                ModelMgr.I.ActivityModel.delActivity([this._data.FuncId]);
            }
        }
    }

    /** 监听点击事件 */
    public onClick(cb: (data: ActData) => void, target: unknown): void {
        this._onClick = cb.bind(target);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
