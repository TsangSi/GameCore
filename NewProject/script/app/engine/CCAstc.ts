/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-inner-declarations */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable dot-notation */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { common } from 'protobufjs';
import { CCDynamicAtlasMgr } from './atlas/CCDynamicAtlasMgr';
import { CCResMD5 } from './resmd5/CCResMD5';

// astc format (Adaptive Scalable Texture Compression)

// 官方参考 2.4.11 https://github.com/cocos/cocos-engine/commit/89e28a431253805ef7b5d9b45a26613f0e041eb2#diff-92a278f44e79285e8eadb9e0e67532b56dbe6dcff72e3e04e8444e02e5882e60

const gfx = cc['gfx'];

const Texture2D = cc.Texture2D;

/** 2.4.11 拷贝出来的 合并 */
gfx.TEXTURE_FMT_RGBA_ASTC_4X4 = 30;
gfx.TEXTURE_FMT_RGBA_ASTC_5X4 = 31;
gfx.TEXTURE_FMT_RGBA_ASTC_5X5 = 32;
gfx.TEXTURE_FMT_RGBA_ASTC_6X5 = 33;
gfx.TEXTURE_FMT_RGBA_ASTC_6X6 = 34;
gfx.TEXTURE_FMT_RGBA_ASTC_8X5 = 35;
gfx.TEXTURE_FMT_RGBA_ASTC_8X6 = 36;
gfx.TEXTURE_FMT_RGBA_ASTC_8X8 = 37;
gfx.TEXTURE_FMT_RGBA_ASTC_10X5 = 38;
gfx.TEXTURE_FMT_RGBA_ASTC_10X6 = 39;
gfx.TEXTURE_FMT_RGBA_ASTC_10X8 = 40;
gfx.TEXTURE_FMT_RGBA_ASTC_10X10 = 41;
gfx.TEXTURE_FMT_RGBA_ASTC_12X10 = 42;
gfx.TEXTURE_FMT_RGBA_ASTC_12X12 = 43;

// astc format (Adaptive Scalable Texture Compression) SRGB
gfx.TEXTURE_FMT_SRGBA_ASTC_4X4 = 44;
gfx.TEXTURE_FMT_SRGBA_ASTC_5X4 = 45;
gfx.TEXTURE_FMT_SRGBA_ASTC_5X5 = 46;
gfx.TEXTURE_FMT_SRGBA_ASTC_6X5 = 47;
gfx.TEXTURE_FMT_SRGBA_ASTC_6X6 = 48;
gfx.TEXTURE_FMT_SRGBA_ASTC_8X5 = 49;
gfx.TEXTURE_FMT_SRGBA_ASTC_8X6 = 50;
gfx.TEXTURE_FMT_SRGBA_ASTC_8X8 = 51;
gfx.TEXTURE_FMT_SRGBA_ASTC_10X5 = 52;
gfx.TEXTURE_FMT_SRGBA_ASTC_10X6 = 53;
gfx.TEXTURE_FMT_SRGBA_ASTC_10X8 = 54;
gfx.TEXTURE_FMT_SRGBA_ASTC_10X10 = 55;
gfx.TEXTURE_FMT_SRGBA_ASTC_12X10 = 56;
gfx.TEXTURE_FMT_SRGBA_ASTC_12X12 = 57;

/** 2.4.11 拷贝出来的 合并 */
const RGBA_ASTC_4x4 = gfx.TEXTURE_FMT_RGBA_ASTC_4X4;
const RGBA_ASTC_5x4 = gfx.TEXTURE_FMT_RGBA_ASTC_5X4;
const RGBA_ASTC_5x5 = gfx.TEXTURE_FMT_RGBA_ASTC_5X5;
const RGBA_ASTC_6x5 = gfx.TEXTURE_FMT_RGBA_ASTC_6X5;
const RGBA_ASTC_6x6 = gfx.TEXTURE_FMT_RGBA_ASTC_6X6;
const RGBA_ASTC_8x5 = gfx.TEXTURE_FMT_RGBA_ASTC_8X5;
const RGBA_ASTC_8x6 = gfx.TEXTURE_FMT_RGBA_ASTC_8X6;
const RGBA_ASTC_8x8 = gfx.TEXTURE_FMT_RGBA_ASTC_8X8;
const RGBA_ASTC_10x5 = gfx.TEXTURE_FMT_RGBA_ASTC_10X5;
const RGBA_ASTC_10x6 = gfx.TEXTURE_FMT_RGBA_ASTC_10X6;
const RGBA_ASTC_10x8 = gfx.TEXTURE_FMT_RGBA_ASTC_10X8;
const RGBA_ASTC_10x10 = gfx.TEXTURE_FMT_RGBA_ASTC_10X10;
const RGBA_ASTC_12x10 = gfx.TEXTURE_FMT_RGBA_ASTC_12X10;
const RGBA_ASTC_12x12 = gfx.TEXTURE_FMT_RGBA_ASTC_12X12;

const TEXTURE_FMT_RGBA8 = 16;
// const GL_BYTE = 5120;                  // gl.BYTE
const GL_UNSIGNED_BYTE = 5121; // gl.UNSIGNED_BYTE
// const GL_SHORT = 5122;                 // gl.SHORT
const GL_UNSIGNED_SHORT = 5123; // gl.UNSIGNED_SHORT
const GL_UNSIGNED_INT = 5125; // gl.UNSIGNED_INT
const GL_FLOAT = 5126; // gl.FLOAT
const GL_UNSIGNED_SHORT_5_6_5 = 33635; // gl.UNSIGNED_SHORT_5_6_5
const GL_UNSIGNED_SHORT_4_4_4_4 = 32819; // gl.UNSIGNED_SHORT_4_4_4_4
const GL_UNSIGNED_SHORT_5_5_5_1 = 32820; // gl.UNSIGNED_SHORT_5_5_5_1
const GL_HALF_FLOAT_OES = 36193; // gl.HALF_FLOAT_OES

const GL_DEPTH_COMPONENT = 6402; // gl.DEPTH_COMPONENT

const GL_ALPHA = 6406; // gl.ALPHA
const GL_RGB = 6407; // gl.RGB
const GL_RGBA = 6408; // gl.RGBA
const GL_LUMINANCE = 6409; // gl.LUMINANCE
const GL_LUMINANCE_ALPHA = 6410; // gl.LUMINANCE_ALPHA

const GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0; // ext.COMPRESSED_RGB_S3TC_DXT1_EXT
const GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1; // ext.COMPRESSED_RGBA_S3TC_DXT1_EXT
const GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2; // ext.COMPRESSED_RGBA_S3TC_DXT3_EXT
const GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3; // ext.COMPRESSED_RGBA_S3TC_DXT5_EXT

const GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00; // ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
const GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01; // ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG
const GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02; // ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
const GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03; // ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG

const GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64; // ext.COMPRESSED_RGB_ETC1_WEBGL

const GL_COMPRESSED_RGB8_ETC2 = 0x9274; // ext.COMPRESSED_RGB8_ETC2
const GL_COMPRESSED_RGBA8_ETC2_EAC = 0x9278; // ext.COMPRESSED_RGBA8_ETC2_EAC

const GL_COMPRESSED_RGBA_ASTC_4x4_KHR = 0x93B0;
const GL_COMPRESSED_RGBA_ASTC_5x4_KHR = 0x93B1;
const GL_COMPRESSED_RGBA_ASTC_5x5_KHR = 0x93B2;
const GL_COMPRESSED_RGBA_ASTC_6x5_KHR = 0x93B3;
const GL_COMPRESSED_RGBA_ASTC_6x6_KHR = 0x93B4;
const GL_COMPRESSED_RGBA_ASTC_8x5_KHR = 0x93B5;
const GL_COMPRESSED_RGBA_ASTC_8x6_KHR = 0x93B6;
const GL_COMPRESSED_RGBA_ASTC_8x8_KHR = 0x93B7;
const GL_COMPRESSED_RGBA_ASTC_10x5_KHR = 0x93B8;
const GL_COMPRESSED_RGBA_ASTC_10x6_KHR = 0x93B9;
const GL_COMPRESSED_RGBA_ASTC_10x8_KHR = 0x93BA;
const GL_COMPRESSED_RGBA_ASTC_10x10_KHR = 0x93BB;
const GL_COMPRESSED_RGBA_ASTC_12x10_KHR = 0x93BC;
const GL_COMPRESSED_RGBA_ASTC_12x12_KHR = 0x93BD;

const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR = 0x93D0;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR = 0x93D1;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR = 0x93D2;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR = 0x93D3;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR = 0x93D4;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR = 0x93D5;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR = 0x93D6;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR = 0x93D7;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR = 0x93D8;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR = 0x93D9;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR = 0x93DA;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR = 0x93DB;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR = 0x93DC;
const GL_COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR = 0x93DD;

/** 2.4.11 拷贝出来的 合并 */
const _textureFmtGL = [
    // TEXTURE_FMT_RGB_DXT1: 0
    { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_S3TC_DXT1_EXT, pixelType: null },

    // TEXTURE_FMT_RGBA_DXT1: 1
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT1_EXT, pixelType: null },

    // TEXTURE_FMT_RGBA_DXT3: 2
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT3_EXT, pixelType: null },

    // TEXTURE_FMT_RGBA_DXT5: 3
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT5_EXT, pixelType: null },

    // TEXTURE_FMT_RGB_ETC1: 4
    { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_ETC1_WEBGL, pixelType: null },

    // TEXTURE_FMT_RGB_PVRTC_2BPPV1: 5
    { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG, pixelType: null },

    // TEXTURE_FMT_RGBA_PVRTC_2BPPV1: 6
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG, pixelType: null },

    // TEXTURE_FMT_RGB_PVRTC_4BPPV1: 7
    { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG, pixelType: null },

    // TEXTURE_FMT_RGBA_PVRTC_4BPPV1: 8
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG, pixelType: null },

    // TEXTURE_FMT_A8: 9
    { format: GL_ALPHA, internalFormat: GL_ALPHA, pixelType: GL_UNSIGNED_BYTE },

    // TEXTURE_FMT_L8: 10
    { format: GL_LUMINANCE, internalFormat: GL_LUMINANCE, pixelType: GL_UNSIGNED_BYTE },

    // TEXTURE_FMT_L8_A8: 11
    { format: GL_LUMINANCE_ALPHA, internalFormat: GL_LUMINANCE_ALPHA, pixelType: GL_UNSIGNED_BYTE },

    // TEXTURE_FMT_R5_G6_B5: 12
    { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_UNSIGNED_SHORT_5_6_5 },

    // TEXTURE_FMT_R5_G5_B5_A1: 13
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_SHORT_5_5_5_1 },

    // TEXTURE_FMT_R4_G4_B4_A4: 14
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_SHORT_4_4_4_4 },

    // TEXTURE_FMT_RGB8: 15
    { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_UNSIGNED_BYTE },

    // TEXTURE_FMT_RGBA8: 16
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_BYTE },

    // TEXTURE_FMT_RGB16F: 17
    { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_HALF_FLOAT_OES },

    // TEXTURE_FMT_RGBA16F: 18
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_HALF_FLOAT_OES },

    // TEXTURE_FMT_RGB32F: 19
    { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_FLOAT },

    // TEXTURE_FMT_RGBA32F: 20
    { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_FLOAT },

    // TEXTURE_FMT_R32F: 21
    { format: null, internalFormat: null, pixelType: null },

    // TEXTURE_FMT_111110F: 22
    { format: null, internalFormat: null, pixelType: null },

    // TEXTURE_FMT_SRGB: 23
    { format: null, internalFormat: null, pixelType: null },

    // TEXTURE_FMT_SRGBA: 24
    { format: null, internalFormat: null, pixelType: null },

    // TEXTURE_FMT_D16: 25
    { format: GL_DEPTH_COMPONENT, internalFormat: GL_DEPTH_COMPONENT, pixelType: GL_UNSIGNED_SHORT },

    // TEXTURE_FMT_D32: 26
    { format: GL_DEPTH_COMPONENT, internalFormat: GL_DEPTH_COMPONENT, pixelType: GL_UNSIGNED_INT },

    // TEXTURE_FMT_D24S8: 27
    { format: GL_DEPTH_COMPONENT, internalFormat: GL_DEPTH_COMPONENT, pixelType: GL_UNSIGNED_INT },

    // TEXTURE_FMT_RGB_ETC2: 28
    { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB8_ETC2, pixelType: null },

    // TEXTURE_FMT_RGBA_ETC2: 29
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA8_ETC2_EAC, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_4X4: 30
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_4x4_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_5X4: 31
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_5x4_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_5X5: 32
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_5x5_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_6X5: 33
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_6x5_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_6X6: 34
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_6x6_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_8X5: 35
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_8x5_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_8X6: 36
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_8x6_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_8X8: 37
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_8x8_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_10X5: 38
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_10x5_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_10X6: 39
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_10x6_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_10X8: 40
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_10x8_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_10X10: 41
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_10x10_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_12X10: 42
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_12x10_KHR, pixelType: null },

    // TEXTURE_FMT_RGBA_ASTC_12X12: 43
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_ASTC_12x12_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_4X4: 44
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_5X4: 45
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_5X5: 46
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_6X5: 47
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_6X6: 48
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_8X5: 49
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_8X6: 50
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_8X8: 51
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_10X5: 52
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_10X6: 53
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_10X8: 54
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_10X10: 55
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_12X10: 56
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR, pixelType: null },

    // TEXTURE_FMT_SRGBA_ASTC_12X12: 57
    { format: GL_RGBA, internalFormat: GL_COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR, pixelType: null },
];

/** 2.4.11 拷贝出来的 合并 */
cc.macro.SUPPORT_TEXTURE_FORMATS = ['.astc', '.pkm', '.pvr', '.webp', '.jpg', '.jpeg', '.bmp', '.png'];

/** 2.4.11 拷贝出来的 合并 */
Texture2D['extnames'] = ['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.pvr', '.pkm', '.astc'];

/** 2.4.11 拷贝出来的 合并 */
const CHAR_CODE_0 = 48; // '0'
const CHAR_CODE_1 = 49; // '1'
const PixelFormat = cc.Texture2D.PixelFormat;

// /** 这里重新实现了 拦截下载 到解析文件头和纹理实例化 稍微和官方有点差异 */
if (cc.sys.isBrowser) {
    cc.assetManager.parser.register('.astc', parseASTCTex());
    cc.assetManager['factory'].register('.astc', createTexture);
    cc.assetManager.downloader.register('.astc', downloadArrayBuffer);
}

/** 文件下载 */
function downloadArrayBuffer(url, options, onComplete) {
    if (cc.sys.isNative) url = CCResMD5.GetHashUrl(url);
    options.responseType = 'arraybuffer';
    cc.assetManager.downloader['downloadFile'](url, options, options.onFileProgress, onComplete);
    console.log('downloadFile astc');
}

/** 创建纹理 */
function createTexture(id, data, options, onComplete) {
    console.log('createTexture astc');

    let out = null; let err = null;

    try {
        console.log('data format', data.format);
        out = new cc.Texture2D();
        /* 这里需要强制修改format 官方的似乎没修改 */
        out._format = data.format;
        out._nativeUrl = id;
        out._nativeAsset = data;
    } catch (e) {
        err = e;
    }

    onComplete && onComplete(err, out);
}

/** 2.4.11 里面拷贝出来的 */
function isPow2(v: number) {
    return !(v & (v - 1)) && !!v;
}

/** 获取 astc 格式 */
/** 2.4.11 里面拷贝出来的 */
function getASTCFormat(xdim: number, ydim: number): number {
    if (xdim === 4) {
        return RGBA_ASTC_4x4;
    } if (xdim === 5) {
        if (ydim === 4) {
            return RGBA_ASTC_5x4;
        }
        return RGBA_ASTC_5x5;
    } if (xdim === 6) {
        if (ydim === 5) {
            return RGBA_ASTC_6x5;
        }
        return RGBA_ASTC_6x6;
    } if (xdim === 8) {
        if (ydim === 5) {
            return RGBA_ASTC_8x5;
        } if (ydim === 6) {
            return RGBA_ASTC_8x6;
        }
        return RGBA_ASTC_8x8;
    } if (xdim === 10) {
        if (ydim === 5) {
            return RGBA_ASTC_10x5;
        } if (ydim === 6) {
            return RGBA_ASTC_10x6;
        } if (ydim === 8) {
            return RGBA_ASTC_10x8;
        }
        return RGBA_ASTC_10x10;
    }
    if (ydim === 10) {
        return RGBA_ASTC_12x10;
    }
    return RGBA_ASTC_12x12;
}

/** 解析 astc 文件头 */
/** 2.4.11 里面拷贝出来的 */
function parseASTCTex(): any {
    //= ==============//
    // ASTC constants //
    //= ==============//

    // struct astc_header
    // {
    //  uint8_t magic[4];
    //  uint8_t blockdim_x;
    //  uint8_t blockdim_y;
    //  uint8_t blockdim_z;
    //  uint8_t xsize[3]; // x-size = xsize[0] + xsize[1] + xsize[2]
    //  uint8_t ysize[3]; // x-size, y-size and z-size are given in texels;
    //  uint8_t zsize[3]; // block count is inferred
    // };
    const ASTC_MAGIC = 0x5CA1AB13;

    const ASTC_HEADER_LENGTH = 16; // The header length
    const ASTC_HEADER_MAGIC = 4;
    const ASTC_HEADER_BLOCKDIM = 3;

    const ASTC_HEADER_SIZE_X_BEGIN = 7;
    const ASTC_HEADER_SIZE_Y_BEGIN = 10;
    const ASTC_HEADER_SIZE_Z_BEGIN = 13;

    console.log('parseASTCTex astc');

    return (file, options, onComplete) => {
        let err = null; let out = null;
        try {
            const buffer = file instanceof ArrayBuffer ? file : file.buffer;
            const header = new Uint8Array(buffer);

            const magicval = header[0] + (header[1] << 8) + (header[2] << 16) + (header[3] << 24);

            if (magicval !== ASTC_MAGIC) {
                return new Error('Invalid magic number in ASTC header');
            }

            const xdim = header[ASTC_HEADER_MAGIC];
            const ydim = header[ASTC_HEADER_MAGIC + 1];
            const zdim = header[ASTC_HEADER_MAGIC + 2];
            if ((xdim < 3 || xdim > 6 || ydim < 3 || ydim > 6 || zdim < 3 || zdim > 6)
                && (xdim < 4 || xdim === 7 || xdim === 9 || xdim === 11 || xdim > 12
                    || ydim < 4 || ydim === 7 || ydim === 9 || ydim === 11 || ydim > 12 || zdim !== 1)) {
                return new Error('Invalid block number in ASTC header');
            }

            const format = getASTCFormat(xdim, ydim);

            const xsize = header[ASTC_HEADER_SIZE_X_BEGIN] + (header[ASTC_HEADER_SIZE_X_BEGIN + 1] << 8)
                + (header[ASTC_HEADER_SIZE_X_BEGIN + 2] << 16);
            const ysize = header[ASTC_HEADER_SIZE_Y_BEGIN] + (header[ASTC_HEADER_SIZE_Y_BEGIN + 1] << 8)
                + (header[ASTC_HEADER_SIZE_Y_BEGIN + 2] << 16);
            const zsize = header[ASTC_HEADER_SIZE_Z_BEGIN] + (header[ASTC_HEADER_SIZE_Z_BEGIN + 1] << 8)
                + (header[ASTC_HEADER_SIZE_Z_BEGIN + 2] << 16);

            // buffer = buffer.slice(ASTC_HEADER_LENGTH, buffer.byteLength);
            const astcData = new Uint8Array(buffer, ASTC_HEADER_LENGTH);

            out = {
                _data: astcData,
                _compressed: true,
                width: xsize,
                height: ysize,
                format,
            };
        } catch (e) {
            err = e;
        }
        onComplete(err, out);
    };
}

/** 2.4.11 里面拷贝出来的 */
function glTextureFmt(fmt) {
    const result = _textureFmtGL[fmt];
    if (result === undefined) {
        console.warn(`Unknown TEXTURE_FMT: ${fmt}`);
        return _textureFmtGL[TEXTURE_FMT_RGBA8];
    }

    return result;
}

/** 根据后缀名判断浏览器是否支持 */
/** 2.4.11 里面拷贝出来的 */
Texture2D['_parseExt'] = function (extIdStr, defaultFormat) {
    const device = cc.renderer['device'];
    const extIds = extIdStr.split('_');

    let defaultExt = '';
    let bestExt = '';
    let bestIndex = 999;
    let bestFormat = defaultFormat;
    const SupportTextureFormats = cc.macro.SUPPORT_TEXTURE_FORMATS;

    for (let i = 0; i < extIds.length; i++) {
        const extFormat = extIds[i].split('@');
        let tmpExt = extFormat[0];
        tmpExt = Texture2D['extnames'][tmpExt.charCodeAt(0) - CHAR_CODE_0] || tmpExt;

        const index = SupportTextureFormats.indexOf(tmpExt);
        if (index !== -1 && index < bestIndex) {
            const tmpFormat = extFormat[1] ? parseInt(extFormat[1]) : defaultFormat;
            // check whether or not support compressed texture
            /** 这里增加了ASTC后缀的判断 */
            if (tmpExt === '.astc' && !device.ext('WEBGL_compressed_texture_astc')) {
                continue;
            } else if (tmpExt === '.pvr' && !device.ext('WEBGL_compressed_texture_pvrtc')) {
                continue;
            } else if ((tmpFormat === PixelFormat.RGB_ETC1 || tmpFormat === PixelFormat.RGBA_ETC1) && !device.ext('WEBGL_compressed_texture_etc1')) {
                continue;
            } else if ((tmpFormat === PixelFormat.RGB_ETC2 || tmpFormat === PixelFormat.RGBA_ETC2) && !device.ext('WEBGL_compressed_texture_etc')) {
                continue;
            } else if (tmpExt === '.webp' && !cc.sys.capabilities.webp) {
                continue;
            }

            bestIndex = index;
            bestExt = tmpExt;
            bestFormat = tmpFormat;
        } else if (!defaultExt) {
            defaultExt = tmpExt;
        }
    }
    return { bestExt, bestFormat, defaultExt };
};

if (cc.sys.isBrowser) {
    /** 2.4.11 里面拷贝出来的 */
    gfx.Texture2D.prototype.update = function (options: any) {
        const gl = this._device._gl;
        let genMipmaps = this._genMipmap;

        if (options) {
            if (options.width !== undefined) {
                this._width = options.width;
            }
            if (options.height !== undefined) {
                this._height = options.height;
            }
            if (options.anisotropy !== undefined) {
                this._anisotropy = options.anisotropy;
            }
            if (options.minFilter !== undefined) {
                this._minFilter = options.minFilter;
            }
            if (options.magFilter !== undefined) {
                this._magFilter = options.magFilter;
            }
            if (options.mipFilter !== undefined) {
                this._mipFilter = options.mipFilter;
            }
            if (options.wrapS !== undefined) {
                this._wrapS = options.wrapS;
            }
            if (options.wrapT !== undefined) {
                this._wrapT = options.wrapT;
            }
            if (options.format !== undefined) {
                this._format = options.format;
                this._compressed = (this._format >= gfx.TEXTURE_FMT_RGB_DXT1 && this._format <= gfx.TEXTURE_FMT_RGBA_PVRTC_4BPPV1)
                    || (this._format >= gfx.TEXTURE_FMT_RGB_ETC2 && this._format <= gfx.TEXTURE_FMT_RGBA_ETC2)
                    /** 以下是 2.4.11 新增 */
                    || (this._format >= gfx.TEXTURE_FMT_RGBA_ASTC_4X4 && this._format <= gfx.TEXTURE_FMT_SRGBA_ASTC_12X12);
            }

            // check if generate mipmap
            if (options.genMipmaps !== undefined) {
                this._genMipmap = options.genMipmaps;
                genMipmaps = options.genMipmaps;
            }

            const maxSize = this._device.caps.maxTextureSize || Number.MAX_VALUE;
            const textureMaxSize = Math.max(options.width || 0, options.height || 0);
            if (maxSize < textureMaxSize) { console.warn(`The current texture size ${textureMaxSize} exceeds the maximum size [${maxSize}] supported on the device.`); }

            if (options.images !== undefined) {
                if (options.images.length > 1) {
                    genMipmaps = false;
                    const maxLength = options.width > options.height ? options.width : options.height;
                    if (maxLength >> (options.images.length - 1) !== 1) {
                        console.error('texture-2d mipmap is invalid, should have a 1x1 mipmap.');
                    }
                }
            }
        }

        // NOTE: get pot after this._width, this._height has been assigned.
        const pot = isPow2(this._width) && isPow2(this._height);
        if (!pot) {
            genMipmaps = false;
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._glID);
        if (options.images !== undefined && options.images.length > 0) {
            this._setMipmap(options.images, options.flipY, options.premultiplyAlpha);
            if (options.images.length > 1) this._genMipmap = true;
        }
        if (genMipmaps) {
            gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
            gl.generateMipmap(gl.TEXTURE_2D);
            this._genMipmap = true;
        }

        this._setTexInfo();
        this._device._restoreTexture(0);
    };

    /** 2.4.11 里面拷贝出来的 */
    gfx.Texture2D.prototype.updateSubImage = function (options) {
        const gl = this._device._gl;
        const glFmt = glTextureFmt(this._format);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._glID);
        this._setSubImage(glFmt, options);
        this._device._restoreTexture(0);
    };

    /** 2.4.11 里面拷贝出来的 */
    gfx.Texture2D.prototype.updateImage = function (options) {
        const gl = this._device._gl;
        const glFmt = glTextureFmt(this._format);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._glID);
        this._setImage(glFmt, options);
        this._device._restoreTexture(0);
    };

    /** 2.4.11 里面拷贝出来的 */
    gfx.Texture2D.prototype._setMipmap = function (images, flipY, premultiplyAlpha) {
        const glFmt = glTextureFmt(this._format);
        const options = {
            width: this._width,
            height: this._height,
            flipY,
            premultiplyAlpha,
            level: 0,
            image: null,
        };

        for (let i = 0; i < images.length; ++i) {
            options.level = i;
            options.width = this._width >> i;
            options.height = this._height >> i;
            options.image = images[i];
            this._setImage(glFmt, options);
        }
    };

    /** 2.4.11 里面拷贝出来的 */
    gfx.TextureCube.prototype.update = function (options: any) {
        const gl = this._device._gl;
        let genMipmaps = this._genMipmaps;

        if (options) {
            if (options.width !== undefined) {
                this._width = options.width;
            }
            if (options.height !== undefined) {
                this._height = options.height;
            }
            if (options.anisotropy !== undefined) {
                this._anisotropy = options.anisotropy;
            }
            if (options.minFilter !== undefined) {
                this._minFilter = options.minFilter;
            }
            if (options.magFilter !== undefined) {
                this._magFilter = options.magFilter;
            }
            if (options.mipFilter !== undefined) {
                this._mipFilter = options.mipFilter;
            }
            if (options.wrapS !== undefined) {
                this._wrapS = options.wrapS;
            }
            if (options.wrapT !== undefined) {
                this._wrapT = options.wrapT;
            }
            // wrapR available in webgl2
            // if (options.wrapR !== undefined) {
            //   this._wrapR = options.wrapR;
            // }
            if (options.format !== undefined) {
                this._format = options.format;
                this._compressed = (this._format >= gfx.TEXTURE_FMT_RGB_DXT1 && this._format <= gfx.TEXTURE_FMT_RGBA_PVRTC_4BPPV1)
                    || (this._format >= gfx.TEXTURE_FMT_RGB_ETC2 && this._format <= gfx.TEXTURE_FMT_RGBA_ETC2)
                    /** 以下是 2.4.11 新增 */
                    || (this._format >= gfx.TEXTURE_FMT_RGBA_ASTC_4X4 && this._format <= gfx.TEXTURE_FMT_SRGBA_ASTC_12X12);
            }

            // check if generate mipmap
            if (options.genMipmaps !== undefined) {
                this._genMipmaps = options.genMipmaps;
                genMipmaps = options.genMipmaps;
            }

            if (options.images !== undefined) {
                if (options.images.length > 1) {
                    genMipmaps = false;
                    if (options.width !== options.height) {
                        console.warn('texture-cube width and height should be identical.');
                    }
                    if (options.width >> (options.images.length - 1) !== 1) {
                        console.error('texture-cube mipmap is invalid. please set mipmap as 1x1, 2x2, 4x4 ... nxn');
                    }
                }
            }
        }

        // NOTE: get pot after this._width, this._height has been assigned.
        const pot = isPow2(this._width) && isPow2(this._height);
        if (!pot) {
            genMipmaps = false;
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
        if (options.images !== undefined && options.images.length > 0) {
            this._setMipmap(options.images, options.flipY, options.premultiplyAlpha);
            if (options.images.length > 1) this._genMipmaps = true;
        }
        if (genMipmaps) {
            gl.hint(gl.GENERATE_MIPMAP_HINT, gl.NICEST);
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            this._genMipmaps = true;
        }

        this._setTexInfo();

        this._device._restoreTexture(0);
    };

    /** 2.4.11 里面拷贝出来的 */
    gfx.TextureCube.prototype.updateSubImage = function (options) {
        const gl = this._device._gl;
        const glFmt = glTextureFmt(this._format);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
        this._setSubImage(glFmt, options);

        this._device._restoreTexture(0);
    };

    /** 2.4.11 里面拷贝出来的 */
    gfx.TextureCube.prototype.updateImage = function (options) {
        const gl = this._device._gl;
        const glFmt = glTextureFmt(this._format);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glID);
        this._setImage(glFmt, options);
        this._device._restoreTexture(0);
    };

    /** 2.4.11 里面拷贝出来的 */
    gfx.TextureCube.prototype._setMipmap = function (images, flipY, premultiplyAlpha) {
        const glFmt = glTextureFmt(this._format);
        const options = {
            width: this._width,
            height: this._height,
            faceIndex: 0,
            flipY,
            premultiplyAlpha,
            level: 0,
            image: null,
        };

        for (let i = 0; i < images.length; ++i) {
            const levelImages = images[i];
            options.level = i;
            options.width = this._width >> i;
            options.height = this._height >> i;

            for (let face = 0; face < 6; ++face) {
                options.faceIndex = face;
                options.image = levelImages[face];
                this._setImage(glFmt, options);
            }
        }
    };
} else {
    /** 原生修改 参考 https://github.com/zhefengzhang/support_astc_etc2/tree/a09b6bb740b24b1d970af9b25295df0ba3d5da60 */

    const _tmpGetSetDesc = {
        get: undefined,
        set: undefined,
        enumerable: true,
        configurable: true,
    };

    /**
     * Program
     */
    var _p = gfx.Program.prototype;
    _p._ctor = function (device, options) {
        if (device) {
            this.init(device, options.vert, options.frag);
        }
    };

    /**
     * VertexBuffer
     */
    _p = gfx.VertexBuffer.prototype;
    _p._ctor = function (device, format, usage, data, numVertices) {
        this._attr2el = format._attr2el;
        if (device && format) {
            this.init(device, format._nativeObj, usage, data, numVertices);
        }
        this._nativePtr = this.self();
    };
    _p.getFormat = function (name) {
        return this._attr2el[name];
    };
    _tmpGetSetDesc.get = _p.getCount;
    _tmpGetSetDesc.set = undefined;
    Object.defineProperty(_p, 'count', _tmpGetSetDesc);

    /**
     * IndexBuffer
     */
    _p = gfx.IndexBuffer.prototype;
    _p._ctor = function (device, format, usage, data, numIndices) {
        if (device) {
            this.init(device, format, usage, data, numIndices);
        }
        this._nativePtr = this.self();
    };
    _tmpGetSetDesc.get = _p.getCount;
    _tmpGetSetDesc.set = undefined;
    Object.defineProperty(_p, 'count', _tmpGetSetDesc);

    /**
     * Texture2D
     */
    function convertImages(images) {
        if (images) {
            for (let i = 0, len = images.length; i < len; ++i) {
                const image = images[i];
                if (image !== null) {
                    if (image instanceof window.HTMLCanvasElement) {
                        if (image._data) {
                            images[i] = image._data._data;
                        } else {
                            images[i] = null;
                        }
                    } else if (image instanceof window.HTMLImageElement) {
                        images[i] = image._data;
                    }
                }
            }
        }
    }

    function convertOptions(texture, options) {
        const gl = window.__gl;

        if (options.images && options.images[0] instanceof HTMLImageElement) {
            const image = options.images[0];
            options.glInternalFormat = image._glInternalFormat;
            options.glFormat = image._glFormat;
            options.glType = image._glType;
            options.bpp = image._bpp;
            options.compressed = image._compressed;
        } else if (options.images && options.images[0] instanceof HTMLCanvasElement) {
            options.glInternalFormat = gl.RGBA;
            options.glFormat = gl.RGBA;
            options.glType = gl.UNSIGNED_BYTE;
            options.bpp = 32;
            options.compressed = false;
        } else {
            const format = texture._format || options.format;
            const gltf = glTextureFmt(format);
            options.glInternalFormat = gltf.internalFormat;
            options.glFormat = gltf.format;
            options.glType = gltf.pixelType;
            options.bpp = gltf.bpp;
            options.compressed = (format >= gfx.TEXTURE_FMT_RGB_DXT1 && format <= gfx.TEXTURE_FMT_RGBA_PVRTC_4BPPV1)
                || (format >= gfx.TEXTURE_FMT_RGB_ETC2 && format <= gfx.TEXTURE_FMT_RGBA_ETC2)
                || (format >= gfx.TEXTURE_FMT_RGBA_ASTC_4X4 && format <= gfx.TEXTURE_FMT_SRGBA_ASTC_12X12);

            console.log('===========compressed=========== ', format, options.compressed);
        }

        options.width = options.width || texture._width;
        options.height = options.height || texture._height;

        convertImages(options.images);
    }

    var _p = gfx.Texture2D.prototype;
    let _textureID = 0;
    _p._ctor = function (device, options) {
        if (device) {
            convertOptions(this, options);
            this.init(device, options);
        }
        this._id = _textureID++;
    };
    _p.destroy = function () {
        //
    };
    _p.update = function (options) {
        convertOptions(this, options);
        this.updateNative(options);
        console.log('=========update=========');
    };
    _p.updateSubImage = function (option) {
        const images = [option.image];
        convertImages(images);
        const data = new Uint32Array(8
            + (images[0].length + 3) / 4);

        data[0] = option.x;
        data[1] = option.y;
        data[2] = option.width;
        data[3] = option.height;
        data[4] = option.level;
        data[5] = option.flipY;
        data[6] = false;
        data[7] = images[0].length;
        const imageData = new Uint8Array(data.buffer);
        imageData.set(images[0], 32);

        this.updateSubImageNative(data);
        console.log('=========update=========');
    };
    _tmpGetSetDesc.get = _p.getWidth;
    _tmpGetSetDesc.set = undefined;
    Object.defineProperty(_p, '_width', _tmpGetSetDesc);
    _tmpGetSetDesc.get = _p.getHeight;
    Object.defineProperty(_p, '_height', _tmpGetSetDesc);

    /**
     * FrameBuffer
     */
    _p = gfx.FrameBuffer.prototype;
    _p._ctor = function (device, width, height, options) {
        if (!device) return;
        this.init(device, width, height, options);

        this._glID = { _id: this.getHandle() };
        this.getHandle = function () {
            return this._glID;
        };
    };

    /**
     * FrameBuffer
     */
    _p = gfx.RenderBuffer.prototype;
    _p._ctor = function (device, format, width, height) {
        if (!device) return;
        this.init(device, format, width, height);

        this._glID = { _id: this.getHandle() };
        this.getHandle = function () {
            return this._glID;
        };
    };

    gfx.RB_FMT_D16 = 0x81A5; // GL_DEPTH_COMPONENT16 hack for JSB
}

/**
 * Device
 */

if (cc.sys.isNative) {
    let instance;

    const _getInstance = gfx.Device.getInstance;

    gfx.Device.prototype.setBlendColor32 = gfx.Device.prototype.setBlendColor;

    gfx.Device.getInstance = function () {
        // init native device instance
        if (!instance) {
            instance = _getInstance();
            instance._gl = window.__gl;
            instance.ext = function (extName) {
                return window.__gl.getExtension(extName);
            };
            console.log('==========Device=Get===========');
            console.log(instance.ext('WEBGL_compressed_texture_astc'));
            cc.assetManager.parser.register('.astc', parseASTCTex());
            cc.assetManager['factory'].register('.astc', createTexture);
            cc.assetManager.downloader.register('.astc', downloadArrayBuffer);
            // inject(instance._gl);
        }
        return instance;
    };
} else {
    const _initExtensions = gfx.Device.prototype._initExtensions;

    /** 初始化扩展 */
    gfx.Device.prototype._initExtensions = function (v) {
        /** 强制在原来的基础上插入 astc etc */
        v = [...v, ...['WEBGL_compressed_texture_astc', 'WEBGL_compressed_texture_etc']];
        _initExtensions.call(this, v);
        inject(this._gl);
        console.log(this);

        console.log('==========astc=init===========');
    };
}

let isInject: boolean = false;

const textureMgr: Map<number, number> = new Map();

let textureMemory: number = 0;

let currentTexture = null;

/** 注入 webgl 统计内存 */
function inject(gl: any) {
    /** 只注入一次 */
    if (!isInject && gl) {
        isInject = true;
        const createTexture = gl.createTexture;
        const texImage2D = gl.texImage2D;
        const bindTexture = gl.bindTexture;
        const copyTexImage2D = gl.copyTexImage2D;
        const deleteTexture = gl.deleteTexture;
        const compressedTexImage2D = gl.compressedTexImage2D;
        const compressedcopyTexImage2D = gl.compressedcopyTexImage2D;
        gl.createTexture = function () {
            const tid = createTexture.call(gl);
            textureMgr.set(tid, 0);
            return tid;
        };
        gl.bindTexture = function (...args: any[]) {
            currentTexture = args[1];
            return bindTexture.call(gl, ...args);
        };
        gl.texImage2D = function (...args: any[]) {
            if (currentTexture) {
                const img = args[5] as ImageBitmap;
                let size = 0;
                if (args[3] === gl.RGB) {
                    size = img.width * img.height * 3;
                } else if (args[3] === gl.RGBA) {
                    size = img.width * img.height * 4;
                }

                if (textureMgr.has(currentTexture)) {
                    textureMemory -= textureMgr.get(currentTexture);
                }
                textureMgr.set(currentTexture, size);
                textureMemory += size;
            }
            return texImage2D.call(gl, ...args);
        };
        gl.compressedTexImage2D = function (...args: any[]) {
            if (currentTexture) {
                console.log('------ args ', args);
                let size = 0;
                let pixel = 0;
                if (args[2] === GL_COMPRESSED_RGBA_ASTC_4x4_KHR) {
                    pixel = 16 / (4 * 4) * 8;
                } else if (args[2] === GL_COMPRESSED_RGBA_ASTC_6x6_KHR) {
                    pixel = 16 / (6 * 6) * 8;
                }
                if (pixel > 0) {
                    size = args[3] * args[4] * pixel / 8;
                }

                if (textureMgr.has(currentTexture)) {
                    textureMemory -= textureMgr.get(currentTexture);
                }
                textureMgr.set(currentTexture, size);
                textureMemory += size;
            }
            return compressedTexImage2D.call(gl, ...args);
        };
        gl.deleteTexture = function (tex: number) {
            if (textureMgr.has(tex)) {
                textureMemory -= textureMgr.get(tex);
                textureMgr.delete(tex);
            }
            if (tex === currentTexture) {
                currentTexture = null;
            }
            return deleteTexture.call(gl, tex);
        };
    }
}

function getTextureMemory(): number {
    const allMemory = textureMemory + CCDynamicAtlasMgr.I.getTextureMemory();
    const memory = +(allMemory / 1024 / 1024).toFixed(2);
    // console.log(`${memory}mb`, '纹理数', textureMgr.size);
    return memory;
}

window['getTextureMemory'] = getTextureMemory;
