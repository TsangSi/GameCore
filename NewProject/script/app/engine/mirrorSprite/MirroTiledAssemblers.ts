/* eslint-disable*/
import CCBaseSprite from './CCBaseSprite';

const {
    ccclass, property, disallowMultiple, menu, executionOrder, requireComponent,
} = cc._decorator;
cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {

    class MirrorTieldAssemblers extends cc['Assembler2D'] {
        // 不动
        initData(sprite) {
            this.verticesCount = 0;
            this.contentWidth = 0;
            this.contentHeight = 0;
            this.rectWidth = 0;
            this.rectHeight = 0;
            this.hRepeat = 0;
            this.vRepeat = 0;
            this.row = 0;
            this.col = 0;

            this['_renderData'].createFlexData(0, 4, 6, this['getVfmt']());
            this._updateIndices();
        }

        // 不动
        initLocal() {
            this._local = { x: [], y: [] };
        }

        // 不动
        _updateIndices() {
            const iData = this['_renderData'].iDatas[0];
            for (let i = 0, vid = 0, l = iData.length; i < l; i += 6, vid += 4) {
                iData[i] = vid;
                iData[i + 1] = vid + 1;
                iData[i + 2] = vid + 2;
                iData[i + 3] = vid + 1;
                iData[i + 4] = vid + 3;
                iData[i + 5] = vid + 2;
            }
        }

        updateRenderData(sprite) {
            const frame = sprite._spriteFrame;
            if (!CC_EDITOR) {
                this['packToDynamicAtlas'](sprite, frame);
            }

            const node = sprite.node;

            const contentWidth = this.contentWidth = Math.abs(node.width);
            const contentHeight = this.contentHeight = Math.abs(node.height);
            const rect = frame._rect;
            const leftWidth = frame.insetLeft; const rightWidth = frame.insetRight; const centerWidth = rect.width - leftWidth - rightWidth;
            const topHeight = frame.insetTop; const bottomHeight = frame.insetBottom; const centerHeight = rect.height - topHeight - bottomHeight;
            this.sizableWidth = contentWidth - leftWidth - rightWidth;
            this.sizableHeight = contentHeight - topHeight - bottomHeight;
            this.sizableWidth = this.sizableWidth > 0 ? this.sizableWidth : 0;
            this.sizableHeight = this.sizableHeight > 0 ? this.sizableHeight : 0;
            const hRepeat = this.hRepeat = centerWidth === 0 ? this.sizableWidth : this.sizableWidth / centerWidth;
            const vRepeat = this.vRepeat = centerHeight === 0 ? this.sizableHeight : this.sizableHeight / centerHeight;
            // let row = this.row = Math.ceil(vRepeat + 2);
            // let col = this.col = Math.ceil(hRepeat + 2);
            const row = this.row = Math.ceil(vRepeat);
            const col = this.col = Math.ceil(hRepeat);

            // update data property
            const count = row * col;
            this.verticesCount = count * 4;
            this.indicesCount = count * 6;

            const renderData = this._renderData;
            const flexBuffer = renderData._flexBuffer;
            if (flexBuffer.reserve(this.verticesCount, this.indicesCount)) {
                this._updateIndices();
                this.updateColor(sprite);
            }
            flexBuffer.used(this.verticesCount, this.indicesCount);

            if (sprite._vertsDirty) {
                this.updateUVs(sprite);
                this.updateVerts(sprite);
                sprite._vertsDirty = false;
            }
        }

        updateVerts(sprite) {
            const frame = sprite._spriteFrame;
            const rect = frame._rect;
            const node = sprite.node;
            const appx = node.anchorX * node.width; const appy = node.anchorY * node.height;

            const {
                row, col, contentWidth, contentHeight,
            } = this;
            const { x, y } = this._local;
            x.length = y.length = 0;
            const leftWidth = frame.insetLeft; const rightWidth = frame.insetRight; const centerWidth = rect.width - leftWidth - rightWidth;
            const topHeight = frame.insetTop; const bottomHeight = frame.insetBottom; const centerHeight = rect.height - topHeight - bottomHeight;
            const xScale = (node.width / (leftWidth + rightWidth)) > 1 ? 1 : node.width / (leftWidth + rightWidth);
            const yScale = (node.height / (topHeight + bottomHeight)) > 1 ? 1 : node.height / (topHeight + bottomHeight);
            let offsetWidth = 0; let offsetHeight = 0;
            if (centerWidth > 0) {
                /*
                 * Because the float numerical calculation in javascript is not accurate enough,
                 * there is an expected result of 1.0, but the actual result is 1.000001.
                 */
                offsetWidth = Math.floor(this.sizableWidth * 1000) / 1000 % centerWidth === 0 ? centerWidth : this.sizableWidth % centerWidth;
            } else {
                offsetWidth = this.sizableWidth;
            }
            if (centerHeight > 0) {
                offsetHeight = Math.floor(this.sizableHeight * 1000) / 1000 % centerHeight === 0 ? centerHeight : this.sizableHeight % centerHeight;
            } else {
                offsetHeight = this.sizableHeight;
            }

            for (let i = 0; i <= col; i++) {
                if (i === 0) {
                    x[i] = -appx;
                } else if (i > 0 && i < col) {
                    if (i === 1) {
                        x[i] = leftWidth * xScale + Math.min(centerWidth, this.sizableWidth) - appx;
                    } else if (centerWidth > 0) {
                        if (i === (col - 1)) {
                            x[i] = leftWidth + offsetWidth + centerWidth * (i - 2) - appx;
                        } else {
                            x[i] = leftWidth + Math.min(centerWidth, this.sizableWidth) + centerWidth * (i - 2) - appx;
                        }
                    } else {
                        x[i] = leftWidth + this.sizableWidth - appx;
                    }
                } else if (i === col) {
                    x[i] = Math.min(leftWidth + this.sizableWidth + rightWidth, contentWidth) - appx;
                }
            }
            for (let i = 0; i <= row; i++) {
                if (i === 0) {
                    y[i] = -appy;
                } else if (i > 0 && i < row) {
                    if (i === 1) {
                        y[i] = bottomHeight * yScale + Math.min(centerHeight, this.sizableHeight) - appy;
                    } else if (centerHeight > 0) {
                        if (i === (row - 1)) {
                            y[i] = bottomHeight + offsetHeight + (i - 2) * centerHeight - appy;
                        } else {
                            y[i] = bottomHeight + Math.min(centerHeight, this.sizableHeight) + (i - 2) * centerHeight - appy;
                        }
                    } else {
                        y[i] = bottomHeight + this.sizableHeight - appy;
                    }
                } else if (i === row) {
                    y[i] = Math.min(bottomHeight + this.sizableHeight + topHeight, contentHeight) - appy;
                }
            }

            this.updateWorldVerts(sprite);
        }

        updateWorldVerts(sprite) {
            const renderData = this._renderData;
            const local = this._local;
            const localX = local.x; const localY = local.y;
            const world = renderData.vDatas[0];
            const { row, col } = this;
            const matrix = sprite.node._worldMatrix;
            const matrixm = matrix.m;
            const a = matrixm[0]; const b = matrixm[1]; const c = matrixm[4]; const d = matrixm[5];
            const tx = matrixm[12]; const ty = matrixm[13];

            let x; let x1; let y; let y1;
            const floatsPerVert = this.floatsPerVert;
            let vertexOffset = 0;
            for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
                y = localY[yindex];
                y1 = localY[yindex + 1];
                for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                    x = localX[xindex];
                    x1 = localX[xindex + 1];

                    // lb
                    world[vertexOffset] = x * a + y * c + tx;
                    world[vertexOffset + 1] = x * b + y * d + ty;
                    vertexOffset += floatsPerVert;
                    // rb
                    world[vertexOffset] = x1 * a + y * c + tx;
                    world[vertexOffset + 1] = x1 * b + y * d + ty;
                    vertexOffset += floatsPerVert;
                    // lt
                    world[vertexOffset] = x * a + y1 * c + tx;
                    world[vertexOffset + 1] = x * b + y1 * d + ty;
                    vertexOffset += floatsPerVert;
                    // rt
                    world[vertexOffset] = x1 * a + y1 * c + tx;
                    world[vertexOffset + 1] = x1 * b + y1 * d + ty;
                    vertexOffset += floatsPerVert;
                }
            }

            // 更新左右坐标 水平翻转
            if (world.length === 40) {
                const v20x = world[20];
                const v25x = world[25];

                const v30x = world[30];
                const v35x = world[35];

                world[20] = v25x;
                world[25] = v20x;

                world[30] = v35x;
                world[35] = v30x;
            } else if (world.length === 80) { //四个角对称
                //右下角 世界坐标左右翻转
                const v20x = world[20];
                const v25x = world[25];
                const v30x = world[30];
                const v35x = world[35];
                world[20] = v25x;
                world[25] = v20x;
                world[30] = v35x;
                world[35] = v30x;
                //上下翻转
                let v21y = world[21]
                let v26y = world[26]
                let v31y = world[31]
                let v36y = world[36]
                world[21] = v31y;
                world[31] = v21y;
                world[26] = v36y;
                world[36] = v26y;

                //左下角
                let v1y = world[1]
                let v6y = world[6]
                let v11y = world[11]
                let v16y = world[16]
                world[1] = v11y;
                world[6] = v16y;
                world[11] = v1y;
                world[16] = v6y;

                //右上角
                const v60x = world[60];
                const v65x = world[65];
                const v70x = world[70];
                const v75x = world[75];
                world[60] = v65x;
                world[65] = v60x;
                world[70] = v75x;
                world[75] = v70x;
            }
        }

        updateUVs(sprite) {
            const verts = this['_renderData'].vDatas[0];
            if (!verts) return;

            const frame = sprite._spriteFrame;
            const rect = frame._rect;
            const leftWidth = frame.insetLeft; const rightWidth = frame.insetRight; const centerWidth = rect.width - leftWidth - rightWidth;
            const topHeight = frame.insetTop; const bottomHeight = frame.insetBottom; const centerHeight = rect.height - topHeight - bottomHeight;

            const {
                row, col, hRepeat, vRepeat,
            } = this;
            let coefu = 0; let coefv = 0;
            const uv = sprite.spriteFrame.uv;
            const uvSliced = sprite.spriteFrame.uvSliced;
            const rotated = sprite.spriteFrame._rotated;
            const floatsPerVert = this.floatsPerVert; let uvOffset = this.uvOffset;
            const tempXVerts = []; const tempYVerts = [];
            for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
                if (this.sizableHeight > centerHeight) {
                    if (this.sizableHeight >= yindex * centerHeight) {
                        coefv = 1;
                    } else {
                        coefv = vRepeat % 1;
                    }
                } else {
                    coefv = vRepeat;
                }
                for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                    if (this.sizableWidth > centerWidth) {
                        if (this.sizableWidth >= xindex * centerWidth) {
                            coefu = 1;
                        } else {
                            coefu = hRepeat % 1;
                        }
                    } else {
                        coefu = hRepeat;
                    }

                    if (rotated) {
                        if (yindex === 0) {
                            tempXVerts[0] = uvSliced[0].u;
                            tempXVerts[1] = uvSliced[0].u;
                            tempXVerts[2] = uvSliced[4].u + (uvSliced[8].u - uvSliced[4].u) * coefv;
                        } else if (yindex < (row - 1)) {
                            tempXVerts[0] = uvSliced[4].u;
                            tempXVerts[1] = uvSliced[4].u;
                            tempXVerts[2] = uvSliced[4].u + (uvSliced[8].u - uvSliced[4].u) * coefv;
                        } else if (yindex === (row - 1)) {
                            tempXVerts[0] = uvSliced[8].u;
                            tempXVerts[1] = uvSliced[8].u;
                            tempXVerts[2] = uvSliced[12].u;
                        }
                        if (xindex === 0) {
                            tempYVerts[0] = uvSliced[0].v;
                            tempYVerts[1] = uvSliced[1].v + (uvSliced[2].v - uvSliced[1].v) * coefu;
                            tempYVerts[2] = uvSliced[0].v;
                        } else if (xindex < (col - 1)) {
                            tempYVerts[0] = uvSliced[1].v;
                            tempYVerts[1] = uvSliced[1].v + (uvSliced[2].v - uvSliced[1].v) * coefu;
                            tempYVerts[2] = uvSliced[1].v;
                        } else if (xindex === (col - 1)) {
                            tempYVerts[0] = uvSliced[2].v;
                            tempYVerts[1] = uvSliced[3].v;
                            tempYVerts[2] = uvSliced[2].v;
                        }
                        tempXVerts[3] = tempXVerts[2];
                        tempYVerts[3] = tempYVerts[1];
                    } else {
                        if (xindex === 0) {
                            tempXVerts[0] = uvSliced[0].u;
                            tempXVerts[1] = uvSliced[1].u + (uvSliced[2].u - uvSliced[1].u) * coefu;
                            tempXVerts[2] = uv[0];
                        } else if (xindex < (col - 1)) {
                            tempXVerts[0] = uvSliced[1].u;
                            tempXVerts[1] = uvSliced[1].u + (uvSliced[2].u - uvSliced[1].u) * coefu;
                            tempXVerts[2] = uvSliced[1].u;
                        } else if (xindex === (col - 1)) {
                            tempXVerts[0] = uvSliced[2].u;
                            tempXVerts[1] = uvSliced[3].u;
                            tempXVerts[2] = uvSliced[2].u;
                        }
                        if (yindex === 0) {
                            tempYVerts[0] = uvSliced[0].v;
                            tempYVerts[1] = uvSliced[0].v;
                            tempYVerts[2] = uvSliced[4].v + (uvSliced[8].v - uvSliced[4].v) * coefv;
                        } else if (yindex < (row - 1)) {
                            tempYVerts[0] = uvSliced[4].v;
                            tempYVerts[1] = uvSliced[4].v;
                            tempYVerts[2] = uvSliced[4].v + (uvSliced[8].v - uvSliced[4].v) * coefv;
                        } else if (yindex === (row - 1)) {
                            tempYVerts[0] = uvSliced[8].v;
                            tempYVerts[1] = uvSliced[8].v;
                            tempYVerts[2] = uvSliced[12].v;
                        }
                        tempXVerts[3] = tempXVerts[1];
                        tempYVerts[3] = tempYVerts[2];
                    }
                    // lb
                    verts[uvOffset] = tempXVerts[0];
                    verts[uvOffset + 1] = tempYVerts[0];
                    uvOffset += floatsPerVert;
                    // rb
                    verts[uvOffset] = tempXVerts[1];
                    verts[uvOffset + 1] = tempYVerts[1];
                    uvOffset += floatsPerVert;
                    // lt
                    verts[uvOffset] = tempXVerts[2];
                    verts[uvOffset + 1] = tempYVerts[2];
                    uvOffset += floatsPerVert;
                    // rt
                    verts[uvOffset] = tempXVerts[3];
                    verts[uvOffset + 1] = tempYVerts[3];
                    uvOffset += floatsPerVert;
                }
            }
            // console.log(verts.length);//40
            if (verts.length === 40) { // 只有8个点 左右两个块
                let v2 = verts[2];//0
                let v3 = verts[3];//0
                let v7 = verts[7]//0
                let v8 = verts[8]//1

                let v12 = verts[12];//1
                let v13 = verts[13]//0
                let v17 = verts[17];//1
                let v18 = verts[18]//1

                verts[22] = v2;
                verts[23] = v3;
                verts[27] = v7;
                verts[28] = v8;

                verts[32] = v12;
                verts[33] = v13;
                verts[37] = v17;
                verts[38] = v18;
            } else if (verts.length === 80) {
                //
                let v2 = verts[2];//0
                let v3 = verts[3];//0
                let v7 = verts[7]//0
                let v8 = verts[8]//1
                let v12 = verts[12];//1
                let v13 = verts[13]//0
                let v17 = verts[17];//1
                let v18 = verts[18]//1


                verts[22] = v2;
                verts[23] = v3;
                verts[27] = v7;
                verts[28] = v8;
                verts[32] = v12;
                verts[33] = v13;
                verts[37] = v17;
                verts[38] = v18;

                verts[42] = v2;
                verts[43] = v3;
                verts[47] = v7;
                verts[48] = v8;

                verts[52] = v12;
                verts[52] = v13;
                verts[57] = v17;
                verts[58] = v18;

                verts[62] = v2;
                verts[63] = v3;
                verts[67] = v7;
                verts[68] = v8;

                verts[72] = v12;
                verts[72] = v13;
                verts[77] = v17;
                verts[78] = v18;

            } else {
                console.log("??????????");

                console.log(verts.length);

            }
        }
    }
    cc['Assembler'].register(CCBaseSprite, MirrorTieldAssemblers);
});
