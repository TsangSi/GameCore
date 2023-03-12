/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable dot-notation */
/*
 * @Author: kexd
 * @Date: 2023-02-09 18:08:06
 * @FilePath: \SanGuo2.4\assets\script\game\base\spine\SpineBase.ts
 * @Description: 骨骼动画基类
 *
 */

import { AssetType } from '../../../app/core/res/ResConst';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { ACTION_DIRECT, ACTION_TYPE, ANIM_TYPE } from '../anim/AnimCfg';
import { SpineCmp } from './SpineCmp';

export interface ISpineMsg {
    /** spine资源 */
    path: string;
    /** 默认播放的动作名字 */
    actionName: string;
    /** trackIndex */
    trackIndex?: number;
    /** 循环播 */
    loop?: boolean;
    /** 开始播的回调 */
    callback?: () => void;
    /** 播放一次循环结束后的事件监听 */
    endCallback?: () => void;
    /** 回调的上下文 */
    context?: any;
}

export default class SpineBase extends cc.Node {
    private _skeleton: sp.Skeleton = null;

    public constructor(data: ISpineMsg) {
        super();

        this.name = 'SpineBase';

        this.addComponent(SpineCmp);

        if (!data || !data.path) {
            console.warn('data.path缺失');
            return;
        }

        const index = data.path.lastIndexOf('/');

        if (index < 0) {
            console.warn('path参数不对');
            return;
        }

        const textureNames = data.path.substring(index + 1);

        ResMgr.I.loadRemote(data.path, AssetType.Spine, (e, skeletonData: sp.SkeletonData) => {
            if (!e && this && cc.isValid(this)) {
                let skeleton = this.getComponent(sp.Skeleton);
                if (!skeleton) {
                    skeleton = this.addComponent(sp.Skeleton);
                }
                this._skeleton = skeleton;
                skeletonData['textureNames'] = [`${textureNames}.png`];
                this._skeleton.skeletonData = skeletonData;

                // 加载完成的回调
                if (data.callback) {
                    data.callback.call(data.context, this._skeleton);
                }
                // 采用spine的纹理采用了引用计数方式后，当生成第二个相同对象会出现播放不出来的情况，下一帧播才正常播放，这里暂先这样处理，后面再找下底层的原因。
                // this.getComponent(SpineCmp).scheduleOnce(() => {
                //     if (this.isValid) {
                this.playAction(data.actionName, data.loop, data.endCallback, data.context, data.trackIndex);
                //     }
                // }, 0);

                // 引用计数++
                this.getComponent(SpineCmp).addRef(skeletonData);
            }
        });
    }

    /**
     *
     * @param actionName 要播放的动画名字
     * @param loop 循环
     * @param endCallback 播放一次循环结束后的事件监听
     * @param context 回调的上下文
     * @param trackIndex
     */
    public playAction(actionName: string, loop: boolean = true, endCallback: () => void = null, context: any = null, trackIndex: number = 0): void {
        if (this._skeleton) {
            if (actionName) {
                this._skeleton.setAnimation(trackIndex, actionName, loop);
            }
            if (endCallback) {
                // 播放一次循环结束后的事件监听,其他监听事件看api吧
                this._skeleton.setCompleteListener(() => {
                    endCallback.call(context, this._skeleton);
                });
            }
        } else {
            console.warn('没有this._skeleton，可能还没加载完或者资源不存在');
        }
    }

    /** 释放sp.Skeleton */
    public release(): void {
        if (this._skeleton) {
            // 如果destroy了skeletonData，会连着纹理也一起清了，那样加的纹理引用计数就失效了，这样的话就要连ResMgr里的spineCaches及texturesCaches也不缓存了
            // 如果不清skeletonData，就会有skeletonJson，atlasText，以及bones等数据残留，而这些数据看了下是原始的.atlas和.json的大小的2-3倍，因为额外还多了bones等等的数据
            // 暂时还没办法不调用skeletonData.destroy又能清掉它的buff数据，如直接清skeletonData.skeletonJson是会出问题的。
            // if (this._skeleton.skeletonData) {
            //     this._skeleton.skeletonData.destroy();
            //     this._skeleton.skeletonData = null;
            // }
            this._skeleton.destroy();
            this._skeleton = null;
        }
    }

    /** 销毁 */
    public destroy(): boolean {
        this.release();
        return super.destroy();
    }

    /** 修改播放速率 */
    public setTimeScale(timeScale: number): void {
        if (this._skeleton) {
            this._skeleton.timeScale = timeScale;
        }
    }

    public setScheduleOnce(callback: () => void, context: any, delay: number): void {
        this.getComponent(SpineCmp).scheduleOnce(() => {
            if (this && cc.isValid(this)) {
                if (callback) {
                    callback.call(context);
                }
            }
        }, delay);
    }

    public static getSpineResPath(
        resID: number | string,
        resType: ANIM_TYPE = ANIM_TYPE.SKILL,
        resDirect: ACTION_DIRECT = ACTION_DIRECT.SHOW,
        resAction: ACTION_TYPE = ACTION_TYPE.STAND,
    ): string {
        let resTypeTemp = resType;
        if (resType === ANIM_TYPE.HORSE_HEAD) {
            resTypeTemp = ANIM_TYPE.HORSE;
        }
        let path: string = `spine/${resTypeTemp}/`;
        if (resType == ANIM_TYPE.ROLE) {
            path += `man/${resID}-${resDirect}`;
        } else {
            path += `action_${resID}/${'skill_effect'}${resID}_`;
            if (resDirect === ACTION_DIRECT.SHOW) {
                path += '';
            } else {
                path += resDirect;
            }

            path += resAction;

            if (resType === ANIM_TYPE.HORSE_HEAD) {
                path += '_h';
            }
        }

        return path;
    }
}
