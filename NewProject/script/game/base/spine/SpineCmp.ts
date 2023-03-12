/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable dot-notation */
import { ResMgr } from '../../../app/core/res/ResMgr';
import SpineBase from './SpineBase';
/*
 * @Author: kexd
 * @Date: 2023-02-10 11:56:03
 * @FilePath: \SanGuo2.4\assets\script\game\base\spine\SpineCmp.ts
 * @Description:
 *
 */

const { ccclass } = cc._decorator;

export const RemoveSpine = (s: sp.SkeletonData) => {
    if (!s) return false;
    if (s.refCount > 0) {
        ResMgr.I.decRef(s);

        // const texture = s.textures[0];
        // if (!texture || !texture.isValid) {
        //     console.log('spine的纹理已经不存在了');
        //     return false;
        // }

        // if (texture.refCount > 0) {
        //     ResMgr.I.decRef(texture);
        // }

        //     return true;
        // } else if (s.textures) {
        //     const texture = s.textures[0];
        //     if (!texture || !texture.isValid) {
        //         console.log('spine的纹理已经不存在了');
        //         return false;
        //     }

        //     if (texture.refCount > 0) {
        //         ResMgr.I.decRef(texture);
        //     } else { // if (CC_DEV)
        //         // eslint-disable-next-line no-debugger
        //         debugger;
        //     }
    }
    return false;
};

@ccclass
export class SpineCmp extends cc.Component {
    private skeletonData: { [uuid: string]: sp.SkeletonData; } = cc.js.createMap(true);

    public addRef(skeletonData: sp.SkeletonData): void {
        // const texture: cc.Texture2D = skeletonData.textures[0];
        // if (texture) {
        const uuidSA: string = skeletonData['_uuid'];
        if (!this.skeletonData[uuidSA]) {
            this.skeletonData[uuidSA] = skeletonData;
            //         // 只给纹理引用++
            //         texture.addRef();
        }
        // }
        skeletonData.addRef();
    }

    public decRef(): void {
        for (const uuid in this.skeletonData) {
            const s = this.skeletonData[uuid];
            if (s.refCount > 0) {
                // ResMgr.I.decRef(s);
                RemoveSpine(s);
            }
        }
        this.skeletonData = cc.js.createMap(true);
    }

    protected onDestroy(): void {
        // 引用计数--
        this.decRef();

        const nd = this.node as SpineBase;
        if (nd) {
            nd.release();
        }

        // 清所有的定时事件
        this.unscheduleAllCallbacks();
    }
}
