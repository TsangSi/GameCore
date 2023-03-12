// /* eslint-disable*/
// import CCBaseSlicedSprite from "./CCBaseSlicedSprite";

// const {
//     ccclass, property, disallowMultiple, menu, executionOrder, requireComponent,
// } = cc._decorator;
// cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {

//     class MirrorSlicedAssembler extends cc.Assembler2D {
//         initData(sprite) {
//             if (this._renderData.meshCount > 0) return;
//             this._renderData.createData(0, this.verticesFloats, this.indicesCount);

//             let indices = this._renderData.iDatas[0];
//             let indexOffset = 0;
//             for (let r = 0; r < 3; ++r) {
//                 for (let c = 0; c < 3; ++c) {
//                     let start = r * 4 + c;
//                     indices[indexOffset++] = start;
//                     indices[indexOffset++] = start + 1;
//                     indices[indexOffset++] = start + 4;
//                     indices[indexOffset++] = start + 1;
//                     indices[indexOffset++] = start + 5;
//                     indices[indexOffset++] = start + 4;
//                 }
//             }
//         }

//         initLocal() {
//             this._local = [];
//             this._local.length = 8;
//         }

//         updateRenderData(sprite) {
//             let frame = sprite._spriteFrame;
//             if (!CC_EDITOR) {
//                 this.packToDynamicAtlas(sprite, frame);
//             }

//             if (sprite._vertsDirty) {
//                 this.updateUVs(sprite);
//                 this.updateVerts(sprite);
//                 sprite._vertsDirty = false;
//             }
//         }

//         updateVerts(sprite) {
//             let node = sprite.node,
//                 width = node.width, height = node.height,
//                 appx = node.anchorX * width, appy = node.anchorY * height;

//             let frame = sprite.spriteFrame;
//             let leftWidth = frame.insetLeft;
//             let rightWidth = frame.insetRight;
//             let topHeight = frame.insetTop;
//             let bottomHeight = frame.insetBottom;

//             let sizableWidth = width - leftWidth - rightWidth;
//             let sizableHeight = height - topHeight - bottomHeight;
//             let xScale = width / (leftWidth + rightWidth);
//             let yScale = height / (topHeight + bottomHeight);
//             xScale = (isNaN(xScale) || xScale > 1) ? 1 : xScale;
//             yScale = (isNaN(yScale) || yScale > 1) ? 1 : yScale;
//             sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
//             sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;

//             // update local
//             let local = this._local;
//             local[0] = -appx;
//             local[1] = -appy;
//             local[2] = leftWidth * xScale - appx;
//             local[3] = bottomHeight * yScale - appy;
//             local[4] = local[2] + sizableWidth;
//             local[5] = local[3] + sizableHeight;
//             local[6] = width - appx;
//             local[7] = height - appy;

//             this.updateWorldVerts(sprite);
//         }

//         updateUVs(sprite) {
//             let verts = this._renderData.vDatas[0];
//             let uvSliced = sprite.spriteFrame.uvSliced;
//             let uvOffset = this.uvOffset;
//             let floatsPerVert = this.floatsPerVert;
//             for (let row = 0; row < 4; ++row) {
//                 for (let col = 0; col < 4; ++col) {
//                     let vid = row * 4 + col;
//                     let uv = uvSliced[vid];
//                     let voffset = vid * floatsPerVert;
//                     verts[voffset + uvOffset] = uv.u;
//                     verts[voffset + uvOffset + 1] = uv.v;
//                 }
//             }
//             //左右对称类型

//             //右边v2 v3 == v0 v1
//             verts[12] = verts[2];
//             verts[13] = verts[3];
//             verts[17] = verts[7];
//             verts[18] = verts[8];
//             //v6 v7 ===4 5
//             verts[32] = verts[22];
//             verts[33] = verts[23];
//             verts[37] = verts[27];
//             verts[38] = verts[28];
//             //10 11 ====8  9
//             verts[52] = verts[42];
//             verts[53] = verts[43];
//             verts[57] = verts[47];
//             verts[58] = verts[48];
//             //14 15 ====12  13
//             verts[72] = verts[62];
//             verts[73] = verts[63];
//             verts[77] = verts[67];
//             verts[78] = verts[68];
//         }

//         updateWorldVerts(sprite) {
//             let matrix = sprite.node._worldMatrix;
//             let matrixm = matrix.m,
//                 a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
//                 tx = matrixm[12], ty = matrixm[13];

//             let local = this._local;
//             let world = this._renderData.vDatas[0];

//             let floatsPerVert = this.floatsPerVert;
//             for (let row = 0; row < 4; ++row) {
//                 let localRowY = local[row * 2 + 1];
//                 for (let col = 0; col < 4; ++col) {
//                     let localColX = local[col * 2];
//                     let worldIndex = (row * 4 + col) * floatsPerVert;
//                     world[worldIndex] = localColX * a + localRowY * c + tx;
//                     world[worldIndex + 1] = localColX * b + localRowY * d + ty;
//                 }
//             }
//         }
//     }

//     Object.assign(MirrorSlicedAssembler.prototype, {
//         verticesCount: 16,
//         indicesCount: 54
//     });
//     cc.Assembler.register(CCBaseSlicedSprite, MirrorSlicedAssembler);
// });
