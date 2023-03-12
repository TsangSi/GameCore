/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable func-names */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: zs
 * @Date: 2022-04-18 10:36:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-09 14:21:01
 * @FilePath: \SanGuo2.4-zengsi\assets\script\app\engine\CCSprite.ts
 * @Description:
 *
 */

import { ISpriteFrameEx } from '../core/res/ResConst';
import { CCResMgr } from './CCResMgr';

cc.Sprite.prototype['addRef'] = function () {
    const spriteFrame: ISpriteFrameEx = this?._spriteFrame;
    if (spriteFrame?._uuid?.length > 0) {
        this._frameUuid = spriteFrame._uuid;
        spriteFrame.addRef();
        const texture = spriteFrame.getTexture();
        texture?.addRef();
    }
    return this;
};

cc.Sprite.prototype['decRef'] = function (autoRelease?: boolean) {
    const spriteFrame: ISpriteFrameEx = this?._spriteFrame;
    // if (spriteFrame?._original?._frame) {
    //     spriteFrame = spriteFrame._original._frame;
    // }
    if (spriteFrame?._uuid?.length > 0) {
        if (this._frameUuid === spriteFrame._uuid) {
            if (spriteFrame.refCount > 0) {
                CCResMgr.DecRef(spriteFrame, autoRelease);
            } else {
                console.warn('spriteFrame.refCount is 0，检查是否有地方对一个资源重复减少引用计数=', spriteFrame['_uuid']);
                // debugger;
            }
            // let texture: cc.Texture2D;
            // if (spriteFrame._original) {
            //     texture = spriteFrame._original._texture;
            // } else {
            const texture = spriteFrame.getTexture();
            // }
            if (texture) {
                if (texture.refCount > 0) {
                    CCResMgr.DecRef(texture, autoRelease);
                } else {
                    console.warn('spriteFrame.texture.refCount is 0，检查是否有地方对一个资源重复减少引用计数=', spriteFrame.getTexture()['_uuid']);
                    // debugger;
                }
            }
        }
    }
    return this;
};

/** 重写Sprite下的spriteFrame set方法 */
Object.defineProperty(cc.Sprite.prototype, 'spriteFrame', {
    set(value: ISpriteFrameEx, force?) {
        const lastSprite = this._spriteFrame;
        if (CC_EDITOR) {
            if (!force && ((lastSprite && lastSprite._uuid) === (value && value._uuid))) {
                return;
            }
        } else if (lastSprite === value) {
            return;
        }
        this.decRef();
        this._spriteFrame = value;
        this.addRef();
        this._applySpriteFrame(lastSprite);
        if (CC_EDITOR) {
            this.node.emit('spriteframe-changed', this);
        }
    },
});

// const _decRef = cc.Asset.prototype.decRef;
// cc.Asset.prototype.decRef = function (a) {
//     if (this._uuid == 'http://dev-hl3-client.kaixinxiyou.com/res_dev/resources/texture/roleHead/100200.png') {
//         console.log('this._ref=', this._ref);
//     }
//     _decRef.call(this, a);
// };
