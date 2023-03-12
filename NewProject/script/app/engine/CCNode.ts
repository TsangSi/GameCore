/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable dot-notation */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: hwx
 * @Date: 2022-04-15 16:32:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-29 18:10:15
 * @FilePath: \SanGuo\assets\script\app\engine\CCNode.ts
 * @Description: Node函数重写
 */

/** 重新节点事件分发 */
// const _dispatchEvent = cc.Node.prototype.dispatchEvent;
// cc.Node.prototype.dispatchEvent = function () {
//     const event = arguments[0];
//     if (event.type === 'touch-start') {
//         // 触发了触摸开始事件就缓存触摸原始缩放值
//         this.touchOriginalScale = cc.Vec3.clone(this.scale);
//     } else if (event.type === 'touch-end' || event.type === 'touch-cancel') {
//         // 触发了触摸结束事件就清除触摸原始缩放值
//         this.touchOriginalScale = undefined;
//     }
//     _dispatchEvent.apply(this, arguments);
// };

const _mat4_temp = cc.mat4();
const _vec3_temp = new cc.Vec3();

cc.Node.prototype['_hitTest'] = function (point, listener) {
    const _htVec3a = new cc.Vec3();
    const _htVec3b = new cc.Vec3();
    const _self: cc.Node = this as cc.Node;

    // const _mat4_temp = cc.mat4();
    const w = _self['_contentSize'].width;
    const h = _self['_contentSize'].height;
    const cameraPt = _htVec3a;
    const testPt = _htVec3b;

    const camera = cc.Camera.findCamera(_self);
    if (camera) {
        camera.getScreenToWorldPoint(point, cameraPt);
    } else {
        cameraPt.set(point);
    }

    _self['_updateWorldMatrix']();
    // If scale is 0, it can't be hit.
    // if (!cc.Mat4.invert(_mat4_temp, _self['_worldMatrix'])) {
    //     return false;
    // }

    // 修正因button缩放导致的按钮边缘点击无效的问题
    const m4 = cc.Mat4.clone(_self['_worldMatrix']);
    if (m4['m0'] > 0) m4['m0'] = 1;
    if (m4['m5'] > 0) m4['m5'] = 1;

    if (!cc.Mat4.invert(_mat4_temp, m4)) {
        return false;
    }

    cc.Vec2.transformMat4(testPt, cameraPt, _mat4_temp);
    testPt.x += _self['_anchorPoint'].x * w;
    testPt.y += _self['_anchorPoint'].y * h;

    let hit = false;
    if (testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h) {
        hit = true;
        if (listener && listener.mask) {
            const mask = listener.mask;
            let parent = _self;
            const length = mask ? mask.length : 0;
            // find mask parent, should hit test it
            for (let i = 0, j = 0; parent && j < length; ++i, parent = parent.parent) {
                const temp = mask[j];
                if (i === temp.index) {
                    if (parent === temp.node) {
                        const comp = parent.getComponent(cc.Mask);
                        if (comp && comp['_enabled'] && !comp['_hitTest'](cameraPt)) {
                            hit = false;
                            break;
                        }

                        j++;
                    } else {
                        // mask parent no longer exists
                        mask.length = j;
                        break;
                    }
                } else if (i > temp.index) {
                    // mask parent no longer exists
                    mask.length = j;
                    break;
                }
            }
        }
    }

    return hit;
};

cc.Node.prototype['convertToNodeSpaceAR'] = function (worldPoint, out) {
    this._updateWorldMatrix();
    cc.Mat4.invert(_mat4_temp, this._worldMatrix);

    if (worldPoint instanceof cc.Vec2) {
        out = out || new cc.Vec2();
        return cc.Vec2.transformMat4(out, worldPoint, _mat4_temp);
    } else {
        out = out || new cc.Vec3();
        return cc.Vec3.transformMat4(out, worldPoint, _mat4_temp);
    }
};

cc.Node.prototype['convertToNodeSpace'] = function (worldPoint) {
    this._updateWorldMatrix();
    cc.Mat4.invert(_mat4_temp, this._worldMatrix);
    const out = new cc.Vec2();
    cc.Vec2.transformMat4(out, worldPoint, _mat4_temp);
    out.x += this._anchorPoint.x * this._contentSize.width;
    out.y += this._anchorPoint.y * this._contentSize.height;
    return out;
};

cc.Node.prototype['getNodeToParentTransform'] = function (out) {
    if (!out) {
        out = cc.AffineTransform.identity();
    }
    this._updateLocalMatrix();

    const contentSize = this._contentSize;
    _vec3_temp.x = -this._anchorPoint.x * contentSize.width;
    _vec3_temp.y = -this._anchorPoint.y * contentSize.height;

    cc.Mat4.copy(_mat4_temp, this._matrix);
    cc.Mat4.transform(_mat4_temp, _mat4_temp, _vec3_temp);
    return cc.AffineTransform['fromMat4'](out, _mat4_temp);
};

cc.Node.prototype['getNodeToWorldTransform'] = function (out) {
    if (!out) {
        out = cc.AffineTransform.identity();
    }
    this._updateWorldMatrix();

    const contentSize = this['_contentSize'] as cc.Size;
    _vec3_temp.x = -this._anchorPoint.x * contentSize.width;
    _vec3_temp.y = -this._anchorPoint.y * contentSize.height;

    cc.Mat4.copy(_mat4_temp, this._worldMatrix);
    cc.Mat4.transform(_mat4_temp, _mat4_temp, _vec3_temp);

    return cc.AffineTransform['fromMat4'](out, _mat4_temp);
};

cc.Node.prototype['getParentToNodeTransform'] = function (out) {
    if (!out) {
        out = cc.AffineTransform.identity();
    }
    this._updateLocalMatrix();
    cc.Mat4.invert(_mat4_temp, this._matrix);
    return cc.AffineTransform['fromMat4'](out, _mat4_temp);
};

cc.Node.prototype['getWorldToNodeTransform'] = function (out) {
    if (!out) {
        out = cc.AffineTransform.identity();
    }
    this._updateWorldMatrix();
    cc.Mat4.invert(_mat4_temp, this._worldMatrix);
    return cc.AffineTransform['fromMat4'](out, _mat4_temp);
};
