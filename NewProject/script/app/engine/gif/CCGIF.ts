// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable no-constant-condition */
// /* eslint-disable dot-notation */

// import { GIFCache } from './CCGIFCache';
// import { CCLzw } from './CCLzw';

// enum FileType {
//     UNKNOWN,
//     PNG,
//     JPG,
//     GIF,
//     WEBP
// }

// interface IImg {
//     codeSize: number,
//     colorTab?: number | Uint8Array,
//     h: number,
//     i: number,
//     m: number,
//     pixel: number,
//     r: number,
//     s: number,
//     w: number,
//     x: number,
//     y: number,
//     srcBuf: number[]
// }
// enum FileHead {
//     IMAGE_PNG = '89504e47',
//     IMAGE_JPG = 'ffd8ff',
//     IMAGE_GIF = '474946',
//     // /**
//     // * Webp
//     // */
//     RIFF = '52494646',
//     WEBP_RIFF = '52494646',
//     WEBP_WEBP = '57454250',
// }

// interface IGIFFrame {
//     ctrl: {
//         delay: number,
//         disp: number,
//         i: number,
//         t: number,
//         tranIndex: number
//     },
//     img: IImg
// }

// interface IInfo extends IImg {
//     header: string,
//     frames: IGIFFrame[],
//     comment: string,
//     cr: number,
//     bgColor: number,
//     radio: number,
//     appVersion: string
// }

// export class GIF {
//     private _tab: Uint8Array;
//     private _view: Uint8Array;
//     private _frame: IGIFFrame;
//     private _buffer: ArrayBuffer;
//     private _offset: number = 0;
//     private _lastData: ImageData;
//     private _info: IInfo = cc.js.createMap(true);
//     private _delays: Array<number> = [];
//     private _spriteFrames: Array<cc.SpriteFrame> = [];
//     public get delays(): number[] {
//         return this._delays;
//     }
//     public get spriteFrames(): cc.SpriteFrame[] {
//         return this._spriteFrames;
//     }
//     public get length(): number {
//         return this._info.frames.length;
//     }
//     private _canvas: HTMLCanvasElement = null;
//     private _context: CanvasRenderingContext2D = null;
//     public id = 'GIF';
//     public async = true;

//     public constructor() {
//         this._info.header = '';
//         this._info.frames = [];
//         this._info.comment = '';
//     }

//     private set buffer(buffer: ArrayBuffer) {
//         this.clear();
//         this._buffer = buffer;
//         this._view = new Uint8Array(buffer);
//     }
//     private get buffer() {
//         return this._buffer;
//     }
//     public handle(item: ArrayBuffer, callback: (e: Error, obj?: object) => void): void {
//         this.buffer = item;
//         this.getHeader();
//         this.getScrDesc();
//         this.getTexture();
//         if (this._spriteFrames.length === 0) {
//             callback(new Error('gif加载失败,帧长度为0'));
//         } else {
//             callback(null, this);
//         }
//     }
//     private static detectFormat(data: string): FileType {
//         if (data.indexOf(FileHead.IMAGE_GIF) !== -1) {
//             return FileType.GIF;
//         } else if (data.indexOf(FileHead.IMAGE_PNG) !== -1) {
//             return FileType.PNG;
//         } else if (data.indexOf(FileHead.IMAGE_JPG) !== -1) {
//             return FileType.JPG;
//         } else if (data.indexOf(FileHead.WEBP_RIFF) !== -1 && data.indexOf(FileHead.WEBP_WEBP) !== -1) {
//             return FileType.WEBP;
//         } else {
//             return FileType.UNKNOWN;
//         }
//     }
//     private static bytes2HexString(arrBytes: number[]) {
//         let str = '';
//         for (let i = 0; i < arrBytes.length; i++) {
//             let tmp: string;
//             const num = arrBytes[i];
//             if (num < 0) {
//                 tmp = (255 + num + 1).toString(16);
//             } else {
//                 tmp = num.toString(16);
//             }
//             if (tmp.length === 1) {
//                 tmp = `0${tmp}`;
//             }
//             str += tmp;
//         }
//         return str;
//     }
//     private getTexture() {
//         let index = 0;
//         // console.log(this._info.frames,'info')
//         // for (let i = 0, n = this._info.frames.length - 2; i < n; i++) {
//         //     this.decodeFrame2Texture(this._info.frames[i], i);
//         // }
//         for (const frame of this._info.frames) {
//             this.decodeFrame2Texture(frame, index++);
//         }
//     }
//     public getSpriteFrame(index: number): cc.SpriteFrame {
//         if (this._spriteFrames[index]) {
//             return this._spriteFrames[index];
//         } else {
//             return this.decodeFrame2Texture(this._info.frames[index], index);
//         }
//     }
//     private decodeFrame(frame: IGIFFrame) {
//         let imageData: ImageData;
//         // console.log(frame,'frame')
//         if (CC_JSB) {
//             imageData = this._context.createImageData(frame.img.w, frame.img.h);
//         } else {
//             imageData = this._context.getImageData(frame.img.x, frame.img.y, frame.img.w, frame.img.h);
//         }
//         if (frame.img.m) {
//             this._tab = frame.img.colorTab as Uint8Array;
//         } else {
//             this._tab = this._info.colorTab as Uint8Array;
//         }
//         CCLzw.decode(frame.img.srcBuf, frame.img.codeSize).forEach((j, k) => {
//             imageData.data[k * 4] = this._tab[j * 3];
//             imageData.data[k * 4 + 1] = this._tab[j * 3 + 1];
//             imageData.data[k * 4 + 2] = this._tab[j * 3 + 2];
//             imageData.data[k * 4 + 3] = 255;
//             if (frame.ctrl.t && j === frame.ctrl.tranIndex) {
//                 imageData.data[k * 4 + 3] = 0;
//             }
//             // frame.ctrl.t ? j == frame.ctrl.tranIndex ? imageData.data[k * 4 + 3] = 0 : 0 : 0;
//         });
//         return imageData;
//     }
//     private mergeFrames(lastImageData: ImageData, curImageData: ImageData) {
//         const imageData = curImageData;
//         if (lastImageData) {
//             for (let i = 0; i < imageData.data.length; i += 4) {
//                 if (imageData.data[i + 3] === 0) {
//                     imageData.data[i] = this._lastData.data[i];
//                     imageData.data[i + 1] = this._lastData.data[i + 1];
//                     imageData.data[i + 2] = this._lastData.data[i + 2];
//                     imageData.data[i + 3] = this._lastData.data[i + 3];
//                 }
//             }
//         }
//         return imageData;
//     }
//     private dataUrl2SpriteFrame(dataUrl: string, index: number) {
//         const spriteFrame = new cc.SpriteFrame();
//         const image = new Image();
//         image.src = dataUrl;
//         image.width = this._canvas.width;
//         image.height = this._canvas.height;
//         image.onload = () => {
//             const imgAsset = new cc.ImageAsset(image);
//             imgAsset._uuid = `${this._info.header}_${this._info.frames.length}_${index}`;
//             spriteFrame.texture = GIFCache.I.newTexture(imgAsset);
//         };
//         return spriteFrame;
//     }
//     private date2SpriteFrame(data: ImageData, index: number) {
//         const spriteFrame = new cc.SpriteFrame();
//         const image = new Image();
//         image.width = this._canvas.width;
//         image.height = this._canvas.height;
//         image['_data'] = data['_data'];
//         image.onload = () => {
//             const imgAsset = new ImageAsset(image);
//             imgAsset._uuid = `${this._info.header}_${this._info.frames.length}_${index}`;
//             spriteFrame.texture = GIFCache.I.newTexture(imgAsset);
//         };
//         return spriteFrame;
//     }
//     private putImageDataJSB(imageData: ImageData, x: number, y: number, frame: IGIFFrame) {
//         const cheeckNullPixel = () => {
//             if (imageData.data[0] === 4
//                 && imageData.data[1] === 0
//                 && imageData.data[2] === 0
//                 && imageData.data[3] === 0) {
//                 return true;
//             }
//             return false;
//         };
//         const checkAlpha = () => {
//             let alphaCount = 0;
//             for (let i = 0; i < imageData.height; i += 2) {
//                 let lineCount = 0;
//                 for (let j = 0; j < imageData.width; j++) {
//                     const indexData = i * 4 * imageData.width + 4 * j;
//                     if (imageData.data[indexData + 3] === 0) {
//                         lineCount++;
//                     }
//                 }
//                 if (lineCount / imageData.width > 0.1) {
//                     alphaCount++;
//                 }
//                 if (alphaCount / (imageData.height / 2) > 0.6) return true;
//             }
//             return false;
//         };
//         const replay = () => {
//             for (let i = 0; i < imageData.height; i++) {
//                 for (let j = 0; j < imageData.width; j++) {
//                     const indexData = i * 4 * imageData.width + 4 * j;
//                     const indexLastData = (i + y) * 4 * this._lastData.width + 4 * (j + x);
//                     if (imageData.data[indexData + 3] !== 0) {
//                         this._lastData.data[indexLastData] = imageData.data[indexData];
//                         this._lastData.data[indexLastData + 1] = imageData.data[indexData + 1];
//                         this._lastData.data[indexLastData + 2] = imageData.data[indexData + 2];
//                         this._lastData.data[indexLastData + 3] = imageData.data[indexData + 3];
//                     }
//                 }
//             }
//         };
//         const clearAndReplay = () => {
//             for (let i = 0; i < this._lastData.height; i++) {
//                 for (let j = 0; j < this._lastData.width; j++) {
//                     const indexLastData = i * 4 * this._lastData.width + 4 * j;
//                     const indexData = (i - y) * 4 * imageData.width + 4 * (j - x);
//                     let clear = false;
//                     if (j < x || j > (x + imageData.width)) {
//                         clear = true;
//                     }
//                     if (i < y || i > (y + imageData.height)) {
//                         clear = true;
//                     }
//                     if (clear) {
//                         this._lastData.data[indexLastData + 0] = 0;
//                         this._lastData.data[indexLastData + 1] = 0;
//                         this._lastData.data[indexLastData + 2] = 0;
//                         this._lastData.data[indexLastData + 3] = 0;
//                     } else {
//                         this._lastData.data[indexLastData + 0] = imageData.data[indexData + 0];
//                         this._lastData.data[indexLastData + 1] = imageData.data[indexData + 1];
//                         this._lastData.data[indexLastData + 2] = imageData.data[indexData + 2];
//                         this._lastData.data[indexLastData + 3] = imageData.data[indexData + 3];
//                     }
//                 }
//             }
//         };
//         if (cheeckNullPixel()) {
//             return;
//         }
//         if (frame.ctrl.disp === 1 || frame.ctrl.disp === 0) {
//             replay();
//         } else if (frame.ctrl.disp === 2) {
//             clearAndReplay();
//         } else if (checkAlpha()) {
//             clearAndReplay();
//         } else {
//             replay();
//         }
//     }
//     private putImageDataWeb(imageData: ImageData, frame: IGIFFrame) {
//         let finalImageData;
//         if (frame.ctrl.disp === 1 || frame.ctrl.disp === 0) {
//             this._context.putImageData(imageData, frame.img.x, frame.img.y, 0, 0, frame.img.w, frame.img.h);
//             const curImageData = this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
//             const lastImageData = this._lastData;
//             finalImageData = this.mergeFrames(lastImageData, curImageData);
//         } else {
//             this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
//             this._context.putImageData(imageData, frame.img.x, frame.img.y, 0, 0, frame.img.w, frame.img.h);
//             finalImageData = this._context.getImageData(0, 0, this._canvas.width, this._canvas.height);
//         }
//         this._context.putImageData(finalImageData, 0, 0);
//         this._lastData = finalImageData;
//         return this._canvas.toDataURL();
//     }
//     private decodeFrame2Texture(frame: IGIFFrame, index: number) {
//         if (!this._context) {
//             this._canvas = document.createElement('canvas');
//             this._context = this._canvas.getContext('2d');
//             this._canvas.width = frame.img.w;
//             this._canvas.height = frame.img.h;
//         }
//         // console.log('decodeFrame2Texture')
//         const imageData = this.decodeFrame(frame);
//         this._delays[index] = frame.ctrl.delay;
//         if (CC_JSB) {
//             if (!this._lastData) {
//                 this._lastData = imageData;
//             } else {
//                 this.putImageDataJSB(imageData, frame.img.x, frame.img.y, frame);
//             }
//             this._spriteFrames[index] = this.date2SpriteFrame(this._lastData, index);
//         } else {
//             const dataUrl = this.putImageDataWeb(imageData, frame);
//             this._spriteFrames[index] = this.dataUrl2SpriteFrame(dataUrl, index);
//         }
//         return this._spriteFrames[index];
//     }
//     private read(len) {
//         return this._view.slice(this._offset, this._offset += len);
//     }
//     private getHeader() {
//         this._info.header = '';
//         this.read(6).forEach((e) => {
//             this._info.header += String.fromCharCode(e);
//         });
//     }
//     private getScrDesc() {
//         const arr = this.read(7);
//         this._info.w = arr[0] + (arr[1] << 8);
//         this._info.h = arr[2] + (arr[3] << 8);
//         this._info.m = 1 & arr[4] >> 7;
//         this._info.cr = 7 & arr[4] >> 4;
//         this._info.s = 1 & arr[4] >> 3;
//         this._info.pixel = arr[4] & 0x07;
//         this._info.bgColor = arr[5];
//         this._info.radio = arr[6];
//         if (this._info.m) {
//             this._info.colorTab = this.read((2 << this._info.pixel) * 3);
//         }
//         this.decode();
//     }
//     private decode() {
//         let srcBuf = [];
//         let arr = this.read(1);
//         switch (arr[0]) {
//             case 33: // 扩展块
//                 this.extension();
//                 break;
//             case 44: // 图象标识符
//                 arr = this.read(9);
//                 this._frame.img = cc.js.createMap(true);
//                 this._frame.img.x = arr[0] + (arr[1] << 8);
//                 this._frame.img.y = arr[2] + (arr[3] << 8);
//                 this._frame.img.w = arr[4] + (arr[5] << 8);
//                 this._frame.img.h = arr[6] + (arr[7] << 8);
//                 this._frame.img.colorTab = 0;
//                 this._frame.img.m = 1 & arr[8] >> 7;
//                 this._frame.img.i = 1 & arr[8] >> 6;
//                 this._frame.img.s = 1 & arr[8] >> 5;
//                 this._frame.img.r = 3 & arr[8] >> 3;
//                 this._frame.img.pixel = arr[8] & 0x07;
//                 if (this._frame.img.m) {
//                     this._frame.img.colorTab = this.read((2 << this._frame.img.pixel) * 3);
//                 }
//                 this._frame.img.codeSize = this.read(1)[0];
//                 srcBuf = [];
//                 // eslint-disable-next-line no-constant-condition
//                 while (1) {
//                     arr = this.read(1);
//                     if (arr[0]) {
//                         this.read(arr[0]).forEach((e) => {
//                             srcBuf.push(e);
//                         });
//                     } else {
//                         this._frame.img.srcBuf = srcBuf;
//                         this.decode();
//                         break;
//                     }
//                 }
//                 break;
//             case 59:
//                 break;
//             default:
//                 break;
//         }
//     }
//     private extension() {
//         let arr = this.read(1);
//         switch (arr[0]) {
//             case 255: // 应用程序扩展
//                 if (this.read(1)[0] === 11) {
//                     this._info.appVersion = '';
//                     this.read(11).forEach((e) => {
//                         this._info.appVersion += String.fromCharCode(e);
//                     });
//                     while (1) {
//                         arr = this.read(1);
//                         if (arr[0]) {
//                             this.read(arr[0]);
//                         } else {
//                             this.decode();
//                             break;
//                         }
//                     }
//                 } else {
//                     throw new Error('解析出错');
//                 }
//                 break;
//             case 249: // 图形控制扩展
//                 if (this.read(1)[0] === 4) {
//                     arr = this.read(4);
//                     this._frame = cc.js.createMap(true);
//                     this._frame.ctrl = {
//                         disp: 7 & arr[0] >> 2,
//                         i: 1 & arr[0] >> 1,
//                         t: arr[0] & 0x01,
//                         delay: arr[1] + (arr[2] << 8),
//                         tranIndex: arr[3],
//                     };
//                     this._info.frames.push(this._frame);
//                     if (this.read(1)[0] === 0) {
//                         this.decode();
//                     } else {
//                         throw new Error('解析出错');
//                     }
//                 } else {
//                     throw new Error('解析出错');
//                 }
//                 break;
//             case 254: // 注释块
//                 arr = this.read(1);
//                 if (arr[0]) {
//                     this.read(arr[0]).forEach((e) => {
//                         this._info.comment += String.fromCharCode(e);
//                     });
//                     if (this.read(1)[0] === 0) {
//                         this.decode();
//                     }
//                 }
//                 break;
//             default:
//                 break;
//         }
//     }

//     public decRef(autoRelease?: boolean): void {
//         if (this._spriteFrames) {
//             this._spriteFrames.forEach((s) => {
//                 // s.decRef();
//                 if (s.refCount <= 0) {
//                     if (s.getTexture()) {
//                         s.getTexture().decRef();
//                         if (s.getTexture().refCount <= 0) {
//                             GIFCache.I.delTexture(s.getTexture()['_uuid']);
//                         }
//                     }
//                 }
//             });
//         }
//     }

//     private clear() {
//         this._tab = null;
//         this._view = null;
//         this._frame = null;
//         this._offset = 0;
//         this._info = cc.js.createMap(true);
//         this._info.header = '';
//         this._info.frames = [];
//         this._info.comment = '';
//         this._lastData = null;
//         this._delays = [];
//         this._spriteFrames = [];
//         this._canvas = null;
//         this._context = null;
//     }
// }
