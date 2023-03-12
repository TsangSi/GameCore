/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
 * @Author: kexd
 * @Date: 2022-04-24 11:51:31
 * @LastEditors: Please set LastEditors
 * @Description: 动画基类
 * @FilePath: \SanGuo2.4\assets\script\game\base\anim\AnimCom.ts
 */
import {
    ACTION_DIRECT, ANIM_TYPE, ACTION_TYPE,
} from './AnimCfg';
import AnimBase from './AnimBase';

export default class AnimCom extends AnimBase {
    /**
     * 获取动画剪辑
     * @returns
     */
    public getAnimation(): cc.Animation {
        return this.clipBody;
    }

    /**
     *
     * @param resID 资源ID
     * @param resType 资源类型 ANIM_TYPE
     * @param resDir 方向 ANIM_TYPE
     * @param resAct 动作 ACTION_TYPE
     * @param wrapMode 播放模式
     * @param endCB 只循环一次,播放完成回调
     * @param context 上下文
     * @param starCB: 开始播放的回调
     * @returns
     */
    public reset(
        resID: number | string,
        resType: ANIM_TYPE,
        resDir: ACTION_DIRECT = null,
        resAct: ACTION_TYPE = null,
        wrapMode: number = cc.WrapMode.Loop,
        endCB: () => void = null,
        context: any = null,
        starCB: () => void = null,
    ): void {
        this.isUsed = true;
        const spriteFrame = this.getComponent(cc.Sprite).spriteFrame;
        if (this.isValid && spriteFrame && spriteFrame.isValid
            && (resID === this.resourceID && resType === this.resourceType
                && (resDir == null || resDir === this.resourceDirect)
                && (resAct == null || resAct === this.resourceAction))
        ) {
            console.log('AnimCom.reset----------------------', resID, resType, resDir, resAct);
            return;
        }
        this.release(!resID);

        this.resourceID = resID;
        this.resourceType = resType;
        if (resAct) this.resourceAction = resAct;
        if (resDir) this.resourceDirect = resDir;
        this.forcePlay = true;
        this.destroyOther = true;
        const state = this.playAction(resAct, resDir, wrapMode, endCB, context, starCB);
        if (state > 0) {
            console.log('playAction返回：', state);
        }
    }

    /**
     * 正数从前查,负数从后查
     * @param act 动作
     * @param frameNO 帧
     * @param callback 回调
     * @param ctx 参数
     */
    public gotoAndStop(act: ACTION_TYPE, frameNO: number, callback: () => void = null, ctx: any = null): void {
        this.playAction(act, null, cc.WrapMode.Normal, null, this, () => {
            try {
                const animaState = this.getCurAnimState();
                if (animaState) {
                    if (frameNO < 0) {
                        const cName: string = this.clipBody.currentClip.name;
                        const animaState: cc.AnimationState = this.clipBody.getAnimationState(cName);
                        frameNO *= -1;
                        if (animaState) this.clipBody.setCurrentTime(animaState.duration - (frameNO / this.frameRateNum));
                    } else if (frameNO > 0) {
                        this.clipBody.setCurrentTime(frameNO / this.frameRateNum);
                    }
                }
            } catch (e) {
                console.error(`gotoAndStop回调错误:${e.stack}`);
            }
            this.clipBody.stop();
            if (callback) {
                callback.call(ctx);
            }
        });
    }
}
