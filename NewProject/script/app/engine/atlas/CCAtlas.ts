/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MaxRects } from './MaxRects';

const space = 2;

type info_dict = {
    x: number,
    y: number,
    texture: cc.Texture2D,
}

export class CCAtlas {
    public _texture: CCDynamicAtlasTexture;
    private _width: number;
    private _height: number;
    private _x: number;
    private _y: number;
    private _nexty: number;
    private _innerTextureInfos = {};
    private _innerSpriteFrames: cc.SpriteFrame[];
    private _count: number;
    // private _atlasName: string = ''

    public atlasName: string = '';
    public atlasKey: string = '';
    private _maxRects: MaxRects = null;

    public constructor(width: number, height: number, name: string, key: string) {
        const texture = new CCDynamicAtlasTexture();
        texture.initWithSize(width, height);
        texture.addRef();
        this._texture = texture;
        this._texture['_uuid'] = `${key}${new Date().getTime()}`;
        this.atlasName = name;
        texture.atlasName = name;
        this.atlasKey = key;
        texture.atlasKey = key;
        this._width = width;
        this._height = height;

        this._x = space;
        this._y = space;
        this._nexty = space;
        this._innerTextureInfos = {};
        this._innerSpriteFrames = [];
        this._count = 0;
        this._maxRects = new MaxRects(width, height, space, space);
    }

    /**
     * 添加碎图进入动态图集。
     *
     * @method insertSpriteFrame
     * @param spriteFrame  the sprite frame that will be inserted in the atlas.
     */
    public insertSpriteFrame(spriteFrame: cc.SpriteFrame, comp): info_dict {
        let info;
        let sx;
        let sy;
        let texture;
        // if (comp instanceof cc.Sprite) {
        texture = spriteFrame['_texture'];
        const rect = spriteFrame.getRect();

        // if (spriteFrame._originalSize) {
        //     let si = spriteFrame.getOriginalSize();
        //     // console.log(rect, si);
        //     if (rect.width !== si.width || rect.height !== si.height) {
        //         rect.width = si.width;
        //         rect.height = si.height;
        //     }
        // }

        if (spriteFrame['_original']) {
            texture = spriteFrame['_original']._texture as cc.Texture2D;
            rect.x = spriteFrame['_original']._x;
            rect.y = spriteFrame['_original']._y;
        }
        info = this._innerTextureInfos[texture._uuid] as info_dict;
        sx = rect.x;
        sy = rect.y;
        // } else {
        //     rect = spriteFrame._rect;
        //     texture = spriteFrame['_texture'];
        //     info = this._innerTextureInfos[texture._uuid] as info_dict;
        //     sx = rect.x;
        //     sy = rect.y;
        // }

        if (info) {
            sx += info.x;
            sy += info.y;
        } else {
            const width = texture.width;
            const height = texture.height;

            // if ((this._x + width + space) > this._width) {
            //     this._x = space;
            //     this._y = this._nexty;
            // }

            // if ((this._y + height + space) > this._nexty) {
            //     this._nexty = this._y + height + space;
            // }

            // if (this._nexty > this._height) {
            //     return null;
            // }

            const chosenRect = this._maxRects.add(width, height);
            if (chosenRect === undefined) {
                return null;
            } else {
                this._x = chosenRect.x;
                this._y = chosenRect.y;
            }

            // if (cc.dynamicAtlasManager.textureBleeding) {
            //     // Smaller frame is more likely to be affected by linear filter
            //     if (width <= 8 || height <= 8) {
            //         this._texture.drawTextureAt(texture, this._x - 1, this._y - 1);
            //         this._texture.drawTextureAt(texture, this._x - 1, this._y + 1);
            //         this._texture.drawTextureAt(texture, this._x + 1, this._y - 1);
            //         this._texture.drawTextureAt(texture, this._x + 1, this._y + 1);
            //     }
            //     this._texture.drawTextureAt(texture, this._x - 1, this._y);
            //     this._texture.drawTextureAt(texture, this._x + 1, this._y);
            //     this._texture.drawTextureAt(texture, this._x, this._y - 1);
            //     this._texture.drawTextureAt(texture, this._x, this._y + 1);
            // }

            // this._texture.drawTextureAt(texture, this._x, this._y);
            this._texture.drawTextureAt2(spriteFrame, this._texture, this._x - 1, this._y - 1, comp);
            this._texture.drawTextureAt2(spriteFrame, this._texture, this._x - 1, this._y + 1, comp);
            this._texture.drawTextureAt2(spriteFrame, this._texture, this._x + 1, this._y - 1, comp);
            this._texture.drawTextureAt2(spriteFrame, this._texture, this._x + 1, this._y + 1, comp);
            this._texture.drawTextureAt2(spriteFrame, this._texture, this._x, this._y, comp);

            this._innerTextureInfos[texture._uuid] = {
                x: this._x,
                y: this._y,
                texture,
            };
            this._innerSpriteFrames.push(spriteFrame);
            this._count++;
            sx += this._x;
            sy += this._y;
            this._x += width + space;
        }
        const frame = {
            x: sx,
            y: sy,
            texture: this._texture,
        };
        return frame;
    }

    /**
     * 从动态图集中删除某张纹理。
     *
     * @method deleteAtlasTexture
     * @param texture  the texture that will be removed from the atlas.
     */
    public deleteInnerTexture(texture): void {
        if (texture && this._innerTextureInfos[texture._uuid]) {
            delete this._innerTextureInfos[texture._uuid];
            this._count--;
        }
    }

    /**
     * 图集是否为空图集。
     *
     * @method isEmpty
     */
    public isEmpty(): boolean {
        return this._count <= 0;
    }

    /**
     * 重置该动态图集。
     *
     * @method reset
    */
    public reset(): void {
        this._x = space;
        this._y = space;
        this._nexty = space;

        const frames = this._innerSpriteFrames;
        for (let i = 0, l = frames.length; i < l; i++) {
            const frame = frames[i];
            if (!frame.isValid) {
                continue;
            }
            frame['_resetDynamicAtlasFrame']();
        }
        this._innerSpriteFrames.length = 0;
        this._innerTextureInfos = {};
    }

    /**
     * 重置该动态图集，并销毁该图集的纹理。
     *
     * @method destroy
    */
    public destroy(): void {
        this.reset();
        this._texture.destroy();
    }
}

export class CCDynamicAtlasTexture extends cc.RenderTexture {
    public atlasName: string = '';
    public atlasKey: string = '';
    /**
     * 初始化 render texture。
     *
     * @method initWithSize
     */
    // public initWithSize(width: number, height: number, format?: number): void {
    //     super.initWithSize(width, height);
    // }

    public drawTextureAt2(s: cc.SpriteFrame, d: cc.Texture2D, x: number, y: number, comp): cc.Rect {
        // const gfxTexture = this.getGFXTexture();
        // if (!texture1 || !gfxTexture) {
        //     return;
        // }
        // const gfxTexture1 = texture1.getGFXTexture();

        // const x1 = 0; const y1 = 0;
        // const w1 = gfxTexture1.width;
        // const h1 = gfxTexture1.height;
        // const gl = this._device.gl;
        // const framebuffer = gl.createFramebuffer();
        // gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        // gl.framebufferTexture2D(
        //     gl.FRAMEBUFFER,
        //     gl.COLOR_ATTACHMENT0,
        //     gfxTexture1['gpuTexture']['glTarget'],
        //     gfxTexture1['gpuTexture']['glTexture'],
        //     0,
        // );
        // gl.bindTexture(gl.TEXTURE_2D, gfxTexture['gpuTexture']['glTexture']);
        // gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, x, y, x1, y1, w1, h1);
        // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // gl.deleteFramebuffer(framebuffer);

        let w;
        let h;
        let rect;
        let webfb1;
        let webfb2;
        let gl;

        if (comp instanceof cc.Label) {
            if (!s['_texture']) return null;

            gl = s['_texture']._texture._device._gl;
            webfb1 = s['_texture']._texture._glID;
            webfb2 = d.getImpl()['_glID'];

            rect = s['_rect'];
            // rect = s['_originalSize'];
            // let s = s.getOriginalSize();
            w = rect.width;
            h = rect.height;
        } else if (comp instanceof cc.Sprite) {
            if (!s['_texture']._texture) return null;

            gl = s['_texture']._texture._device._gl;
            webfb1 = s['_texture']._texture._glID;
            webfb2 = d.getImpl()['_glID'];

            rect = s.getRect();
            // rect = s['_originalSize'];
            // console.log(s);

            let si = s.getOriginalSize();
            if (si.width !== rect.width || si.height !== rect.height) {
                rect = si;
                // console.log(si, rect);
            }

            w = rect.width;
            h = rect.height;
            if (s.isRotated()) {
                w = rect.height, h = rect.width;
            }
        }

        // TODOO  根据机型来选择使用哪种方式
        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, webfb1, 0);

        gl.bindTexture(gl.TEXTURE_2D, webfb2);
        gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, x, y, rect.x, rect.y, w, h);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteFramebuffer(fb);

        return cc.rect(x, y, w, h);
    }
}
