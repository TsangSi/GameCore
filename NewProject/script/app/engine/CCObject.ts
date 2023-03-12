/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: zs
 * @Date: 2022-04-19 15:58:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-03 10:35:49
 * @FilePath: \SanGuo2.4-zengsi\assets\script\app\engine\CCObject.ts
 * @Description:
 *
 */

import { CCResMgr } from './CCResMgr';

const Destroyed = 1 << 0;
/** cc.Object的原始_destroyImmediate接口 */
const _destroyImmediate = cc.Object.prototype['_destroyImmediate'];
/**
 * 重写CCObject的_destroyImmediate
 * 处理改节点的资源引用计数处理
 */
cc.Object.prototype['_destroyImmediate'] = function () {
    if (this._objFlags & Destroyed) {
        return;
    }
    extDestroyImmediate(this);
    _destroyImmediate.apply(this);
};

/**
 * 销毁对象组件——处理资源引用计数
 * @param obj 对象
 */
const extDestroyImmediate = (obj: cc.Object) => {
    if (CC_EDITOR) { return; }
    if (obj instanceof cc.Node) {
        if (obj['_prefab'] && obj['_prefab'].asset && obj['_prefab'].root === obj) {
            if (obj['_prefab'].asset.refCount > 0) {
                obj['_prefab'].asset.decRef();
            }
            obj['_prefab'].asset = null;
        }
    } else if (obj instanceof cc.Sprite) {
        obj['decRef']();
        // }
    } else if (obj instanceof cc.Label) {
        if (obj.font) {
            const spriteFrame = obj.font['_spriteFrame'] as cc.SpriteFrame;
            if (spriteFrame) {
                if (obj['_frameUuid'] === spriteFrame['_uuid']) {
                    if (spriteFrame.refCount > 0) {
                        // spriteFrame.decRef();
                        CCResMgr.DecRef(spriteFrame);
                        const texture = spriteFrame['_texture'];
                        if (texture) {
                            if (texture.refCount > 0) {
                                CCResMgr.DecRef(texture);
                            }
                        }
                    }
                }
            }
        }
    }
};
