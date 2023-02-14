/*
 * @Author: your name
 * @Date: 2020-07-24 15:51:17
 * @LastEditTime: 2021-07-08 15:59:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \RPG_Cocos\assets\script\m\uts\MsgToast1.ts
 */
import {
 RichText, _decorator, Component,
} from 'cc';
import UtilsCC from '../../utils/UtilsCC';

const { ccclass, property } = _decorator;
export class ToastInfo {
    info: string;
    aimColor: string;
}

@ccclass
export default class MsgToast1 extends Component {
    // 目标Y
    private aimY = 0;

    private endtime = 0;
    private upTime = 300;
    private disappearTime = 1000;
    private startY = -190;

    setInfo(str: string) {
        // let tArr: Array<ToastInfo> = [];
        str = str.replace(/<b>/g, '');
        str = str.replace(/<\/b>/g, '');
        str = str.replace(/<u>/g, '');
        str = str.replace(/<\/u>/g, '');
        this.node.getChildByName('rt_info').getComponent(RichText).string = str;

        UtilsCC.setPos(this.node, 0, -5000);
        this.aimY = 50;
        UtilsCC.setOpacity(this.node, 255);
        this.endtime = Date.now() + this.upTime + this.disappearTime;
        this.node.active = true;
    }
    // 上升期->消失时期(可能补充上升)->回收
    update() {
        const t = this.endtime - Date.now();
        if (t < 0) { // 到时间回收
            this.node.active = false;
            this.node.destroy();
        } else if (t < this.disappearTime) { // 消失期
            // this.node.opacity = 255 * t / this.disappearTime;
        } else { // 上升期
            UtilsCC.setPosY(this.node, this.startY + this.aimY - this.aimY * (t - this.disappearTime) / this.upTime);
        }
    }
    // 目标y
    setAimY(aimY: number) {
        this.aimY = aimY;
        UtilsCC.setPosY(this.node, this.startY + this.aimY);
    }
    onDisable() {
        const rt = this.node.getChildByName('rt_info');
        if (rt) {
            rt.getComponent(RichText).string = '';
            // rt.destroyAllChildren();
            const n = rt.getChildByName('labelLayout');
            if (n) n.destroy();
        }
    }
}
