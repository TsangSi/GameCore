// /* eslint-disable @typescript-eslint/no-unsafe-return */
// /* eslint-disable func-names */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable camelcase */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /*
//  * @Author: hwx
//  * @Date: 2022-04-06 19:08:05
//  * @LastEditors: hwx
//  * @LastEditTime: 2022-04-15 16:59:07
//  * @FilePath: \SanGuo\assets\script\app\engine\CCUITransform.ts
//  * @Description: UITransform 函数重写
//  */

// import {
//     Mat4, UITransform, Vec2, view,
// } from 'cc';

// const _vec2a = new Vec2();
// const _vec2b = new Vec2();
// const _mat4_temp = new Mat4();
// const _worldMatrix = new Mat4();
// const _zeroMatrix = new Mat4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

// const getVisibleRectCenter = () => {
//     const size = view.getVisibleSize();
//     const origin = view.getVisibleOrigin();
//     const x = origin.x + size.width / 2;
//     const y = origin.y + size.height / 2;
//     return new Vec2(x, y);
// };

// /** 重写节点变换是否击中 */
// UITransform.prototype.isHit = function () {
//     const w = this._contentSize.width;
//     const h = this._contentSize.height;
//     const cameraPt = _vec2a;
//     const testPt = _vec2b;
//     const nodeEventProcessor = this.node?.eventProcessor;
//     const point = arguments[0];

//     const cameras = this._getRenderScene().cameras;
//     for (let i = 0; i < cameras.length; i++) {
//         const camera = cameras[i];
//         if (!(camera.visibility & this.node.layer)) continue;

//         // 将一个摄像机坐标系下的点转换到世界坐标系下
//         camera.node.getWorldRT(_mat4_temp);
//         const m12 = _mat4_temp.m12;
//         const m13 = _mat4_temp.m13;
//         const center = getVisibleRectCenter();
//         _mat4_temp.m12 = center.x - (_mat4_temp.m00 * m12 + _mat4_temp.m04 * m13);
//         _mat4_temp.m13 = center.y - (_mat4_temp.m01 * m12 + _mat4_temp.m05 * m13);
//         Mat4.invert(_mat4_temp, _mat4_temp);
//         Vec2.transformMat4(cameraPt, point, _mat4_temp);

//         const hitMat4 = this.node.getWorldMatrix(_worldMatrix);
//         if (this.node.touchOriginalScale) {
//             hitMat4.m00 = this.node.touchOriginalScale.x; // 缩放x
//             hitMat4.m01 *= this.node.touchOriginalScale.x / _worldMatrix.m10; // 旋转z
//             hitMat4.m04 *= this.node.touchOriginalScale.x / _worldMatrix.m10; // 旋转z
//             hitMat4.m05 = this.node.touchOriginalScale.y; // 缩放y
//             hitMat4.m10 = this.node.touchOriginalScale.z; // 缩放z
//         }
//         Mat4.invert(_mat4_temp, hitMat4);
//         if (Mat4.strictEquals(_mat4_temp, _zeroMatrix)) {
//             continue;
//         }
//         Vec2.transformMat4(testPt, cameraPt, _mat4_temp);
//         testPt.x += this._anchorPoint.x * w;
//         testPt.y += this._anchorPoint.y * h;
//         let hit = false;
//         if (testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h) {
//             hit = true;
//             if (nodeEventProcessor && nodeEventProcessor.maskList) {
//                 const maskList = nodeEventProcessor.maskList;
//                 let parent: any = this.node;
//                 const length = maskList ? maskList.length : 0;
//                 // find mask parent, should hit test it
//                 for (let i = 0, j = 0; parent && j < length; ++i, parent = parent.parent) {
//                     const temp = maskList[j];
//                     if (i === temp.index) {
//                         if (parent === temp.comp.node) {
//                             const comp = temp.comp;
//                             if (comp && comp._enabled && !comp.isHit(cameraPt)) {
//                                 hit = false;
//                                 break;
//                             }

//                             j++;
//                         } else {
//                             // mask parent no longer exists
//                             maskList.length = j;
//                             break;
//                         }
//                     } else if (i > temp.index) {
//                         // mask parent no longer exists
//                         maskList.length = j;
//                         break;
//                     }
//                 }
//             }
//         }
//         if (hit) {
//             return true;
//         }
//     }
//     return false;
// };
