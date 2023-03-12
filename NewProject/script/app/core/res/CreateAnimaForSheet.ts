/* eslint-disable dot-notation */
/*
 * @Author: zs
 * @Date: 2022-04-07 18:21:34
 * @FilePath: \SanGuo2.4\assets\script\app\core\res\CreateAnimaForSheet.ts
 * @Description:
 *
 */
// import { GIFCache } from 'h3_engine';
import { ResMgr } from './ResMgr';

const { ccclass } = cc._decorator;

export const RemoveSpriteAtlas = (s: cc.SpriteAtlas) => {
    if (!s) return false;
    const removeTextureUuid: { [uuid: string]: any } = cc.js.createMap(true);
    // const removeSpriteFrameUuid: { [uuid: string]: number } = cc.js.createMap(true);
    if (s.refCount > 0) {
        ResMgr.I.decRef(s);
        if (!s.isValid || !s.getSpriteFrames()) {
            console.log('当前的序列帧已经没有了', s['_uuid']);
            return false;
        }
        if (s.refCount <= 0) {
            // s.getSpriteFrames().forEach((f) => {
            //     if (f.refCount > 0) {
            //         ResMgr.I.decRef(f);
            //     }
            //     if (f.refCount <= 0) {
            //         const uuid: string = f.getTexture()['_uuid'];
            //         removeTextureUuid[uuid] = f.getTexture();
            //     }
            //     f = null;
            // });
            // for (const uuid in removeTextureUuid) {
            //     ResMgr.I.decRef(removeTextureUuid[uuid]);
            // }
        }
        return true;
    } else {
        // eslint-disable-next-line no-debugger
        debugger;
    }
    return false;
};

@ccclass
export class CreateAnimaForSheet extends cc.Component {
    private spriteAtlas: { [uuid: string]: cc.SpriteAtlas; } = cc.js.createMap(true);
    public addRef(spriteAtlas: cc.SpriteAtlas): void {
        const uuidSA: string = spriteAtlas['_uuid'];
        if (!this.spriteAtlas[uuidSA]) {
            this.spriteAtlas[uuidSA] = spriteAtlas;
            spriteAtlas.addRef();
            // spriteAtlas.getSpriteFrames().forEach((s) => {
            //     s.addRef();
            //     if (s.texture) {
            //         s.texture.addRef();
            //     }
            // });
        }
    }

    public decRef(): void {
        for (const uuid in this.spriteAtlas) {
            const s = this.spriteAtlas[uuid];
            RemoveSpriteAtlas(s);
        }
        this.spriteAtlas = cc.js.createMap(true);
    }

    protected onDestroy(): void {
        // console.log('+++++++++++++++++++++------------------------');
        const a = this.node.getComponent(cc.Animation);

        const clips: cc.AnimationClip[] = a.getClips();
        if (a && clips) {
            let num = clips.length;
            while (num > 0) {
                // const clip = clips.shift();
                const clip = clips[0];
                a.removeClip(clip, true);
                clip.destroy();
                num--;
            }
            if (a.currentClip) {
                if (a.currentClip.isValid) {
                    a.currentClip.destroy();
                }
                a.currentClip = null;
            }
        }
        this.decRef();
    }
}
