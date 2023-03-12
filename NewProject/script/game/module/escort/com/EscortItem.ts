/*
 * @Author: kexd
 * @Date: 2023-01-16 16:36:43
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\com\EscortItem.ts
 * @Description:
 *
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { RoleMgr } from '../../role/RoleMgr';
import { NickShowType } from '../../../base/utils/UtilGame';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { ICarMsg } from '../EscortConst';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { RES_ENUM } from '../../../const/ResPath';
import { EffectMgr } from '../../../manager/EffectMgr';

const { ccclass, property } = cc._decorator;
@ccclass
export default class EscortItem extends BaseCmp {
    @property(cc.Node)
    private NdLing: cc.Node = null;
    @property(cc.Node)
    private NdSelf: cc.Node = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(DynamicImage)
    private SprBoard: DynamicImage = null;
    @property(cc.Node)
    private NdAnim: cc.Node = null;

    private _carData: ICarMsg = null;

    protected start(): void {
        super.start();
    }

    /**
     * 展示
     * @param msg ICarMsg
     * @param speed 速度
     * @param posy y
     */
    public setData(msg: ICarMsg, speed: number, posy: number): void {
        const lingX: number[] = [-5, 0, 10, 20, 10];
        const lingY: number[] = [120, 120, 120, 130, 137];
        const selfX: number[] = [-80, -80, -90, -100, -110];
        const selfY: number[] = [60, 60, 60, 60, 70];
        // 特效
        const animX: number[] = [-22, -14, -13, -16, -16];
        const animY: number[] = [5, 10, 13, 22, 21];
        const animSX: number[] = [0.6, 0.8, 0.9, 1.1, 1.3];
        const animSY: number[] = [0.4, 0.6, 0.7, 1, 1.1];

        this._carData = msg;
        const carData: CarData = msg.carData;
        const cfg: Cfg_Escort = msg.cfgEscort;
        const info = msg.info;

        const size = cc.view.getVisibleSize();
        const isSelf = carData.UserId === RoleMgr.I.info.userID;
        this.NdSelf.active = isSelf;
        this.NdLing.active = carData.UseAmulet > 0;
        if (!isSelf) {
            this.LabName.node.active = true;
            this.LabName.string = info.getAreaNick(NickShowType.ArenaNick);
        } else {
            this.LabName.node.active = false;
        }
        const index = msg.carData.QualityId - 1;
        this.NdLing.setPosition(lingX[index] || 0, lingY[index] || 0);
        this.NdSelf.setPosition(selfX[index] || 0, selfY[index] || 0);
        // 船
        this.SprBoard.loadImage(`texture/escort/img_yslc_${cfg.Img}`, 1, true);
        // 特效
        EffectMgr.I.showAnim(`${RES_ENUM.Com_Ui}${10001}`, (node: cc.Node) => {
            if (this.NdAnim && this.NdAnim.isValid) {
                this.NdAnim.addChild(node);
                this.NdAnim.setPosition(animX[index], animY[index]);
                this.NdAnim.scaleX = animSX[index];
                this.NdAnim.scaleY = animSY[index];
            }
        });
        // 初始位置
        const startX = -size.width / 2 - this.node.width / 2;
        const endX = -startX;
        this.node.x = startX;
        this.node.y = posy;
        this.node.zIndex = 1000 - posy;
        // 开始移动
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node)
            .to(speed, { position: new cc.Vec3(endX, posy, 0) })
            .call(() => {
                if (this.node && this.node.isValid) {
                    this.node.destroy();
                    EventClient.I.emit(E.Escort.MoveToEnd, msg);
                }
            })
            .start();

        cc.tween(this.SprBoard.node)
            .by(0.7, { angle: 1 })
            .by(0.7, { angle: -1 }, { easing: 'sineIn' })
            .union()
            .repeatForever()
            .start();

        // 押镖时间到的处理
        const now = UtilTime.NowSec();
        const end = msg.carData.EndTime;
        if (now >= end) {
            this.node.destroy();
            EventClient.I.emit(E.Escort.TimeOut, msg);
        } else {
            const leftTime = end - now;
            this.scheduleOnce(() => {
                if (this.node && this.node.isValid) {
                    this.node.destroy();
                    EventClient.I.emit(E.Escort.TimeOut, msg);
                }
            }, leftTime);
        }
    }

    public getCarMsg(): ICarMsg {
        return this._carData;
    }

    protected onDestroy(): void {
        super.onDestroy();
        // console.log('EscortItem 移除了镖车');
    }
}
