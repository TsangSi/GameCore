// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable dot-notation */

// import { GIF } from './CCGIF';

// /*
//  * @Author: zs
//  * @Date: 2022-06-27 15:35:34
//  * @FilePath: \h3_engine\src\engine\gif\CCGIFCache.ts
//  * @Description:
//  *
//  */enum FileType {
//     UNKNOWN,
//     PNG,
//     JPG,
//     GIF,
//     WEBP
// }
// interface GIFCaheItem {
//     referenceCount: number,
//     type: FileType,
//     frame?: object
//     frameData: GIFFrameData
// }
// export interface GIFFrameData extends cc.Asset {
//     delays: Array<number>,
//     spriteFrames: Array<cc.SpriteFrame>,
//     length: number
// }

// export class GIFCache {
//     private static _i: GIFCache;

//     private gifFrameMap: Record<string, GIFCaheItem> = cc.js.createMap(true);
//     public static get I(): GIFCache {
//         if (!this._i) {
//             this._i = new GIFCache();
//             this._i.initRegister();
//         }
//         return this._i;
//     }

//     public do(): void {
//         //
//     }

//     private initRegister() {
//         const _downloaders = cc.assetManager.downloader['_downloaders'];
//         if (CC_JSB) {
//             // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//             cc.assetManager.downloader.register('.gif', _downloaders['.binary']);
//         } else {
//             cc.assetManager.downloader.register('.gif', (url, options, onComplete) => {
//                 // console.log("downloader", url);
//                 // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//                 const func = _downloaders['.bin'] as (url: string, options: object, onComplete: (e: Error, data: Asset) => void) => void;
//                 func(url, options, (err, data) => {
//                     if (!err) {
//                         // CC_JSB
//                         if (typeof data === 'string') {
//                             cc.assetManager.parser.parse(url, data, '.bin', options, onComplete);
//                             return;
//                         }
//                     }
//                     onComplete(err, data);
//                 });
//             });
//         }

//         if (CC_JSB) {
//             cc.assetManager.parser.register('.gif', (file, options, onComplete) => {
//                 const gif = new GIF();
//                 // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//                 const buffer = jsb.fileUtils['getDataFromFile'](file);
//                 // console.log(buffer,' >>> buffer')
//                 gif.handle(buffer, onComplete);
//             });
//         } else {
//             cc.assetManager.parser.register('.gif', (file, options, onComplete) => {
//                 const gif = new GIF();
//                 let buffer = file;
//                 if (file['arrayBuffer']) {
//                     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//                     buffer = file['arrayBuffer']();
//                 }
//                 gif.handle(buffer, onComplete);
//             });
//         }
//     }
//     private preloadGif(data: { words: any[], classes: any[] }) {
//         try {
//             if (data.words) {
//                 data.words.forEach((item) => {
//                     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//                     if (item.indexOf('.gif') !== -1) { assetManager.loadRemote(item.img); }
//                 });
//             }
//             if (data.classes) {
//                 data.classes.forEach((item) => {
//                     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//                     if (item.indexOf('.gif') !== -1) { assetManager.loadRemote(item.img); }
//                 });
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     }

//     private textures: { [uuid: string]: Texture2D } = js.createMap(true);
//     public newTexture(imgAsset: ImageAsset) {
//         let texture = this.textures[imgAsset._uuid];
//         if (!texture) {
//             texture = new Texture2D();
//             texture.image = imgAsset;
//             texture._uuid = imgAsset._uuid;
//             this.textures[imgAsset._uuid] = texture;
//             assetManager.assets.add(imgAsset._uuid, texture);
//         }
//         texture.addRef();
//         return texture;
//     }

//     public delTexture(uuid: string) {
//         if (this.textures[uuid]) {
//             delete this.textures[uuid];
//         }
//     }

//     // private addItemFrame(key: string, frameData: GIFFrameData) {
//     //     if (this.has(key) === true) {
//     //         const item = this.get(key);
//     //         item.referenceCount++;
//     //         item.frameData = frameData;
//     //     } else {
//     //         const gifCaheItem: GIFCaheItem = js.createMap(true);
//     //         gifCaheItem.referenceCount = 0;
//     //         gifCaheItem.type = FileType.GIF;
//     //         gifCaheItem.frame = js.createMap(true);
//     //         this.gifFrameMap[key] = gifCaheItem;
//     //     }
//     // }
//     // private addItemType(key: any, type: FileType) {
//     //     if (this.has(key)) {
//     //         const item = this.get(key);
//     //         item.type = type;
//     //     } else {
//     //         const gifCaheItem: GIFCaheItem = js.createMap(true);
//     //         gifCaheItem.referenceCount = 0;
//     //         gifCaheItem.type = type;
//     //         this.gifFrameMap[key] = gifCaheItem;
//     //     }
//     // }
//     // private add(key: any, value: GIFCaheItem) {
//     //     if (!this.has(key)) {
//     //         this.gifFrameMap[key] = value;
//     //     }
//     // }
//     // private get(key: any): GIFCaheItem {
//     //     return this.gifFrameMap[key];
//     // }
//     // private has(key: any): boolean {
//     //     if (this.gifFrameMap[key] === undefined) {
//     //         return false;
//     //     }
//     //     return true;
//     // }
//     // private hasFrame(key: any) {
//     //     const item = this.get(key);
//     //     if (item !== undefined) {
//     //         const itemFrame = item.frameData;
//     //         if (itemFrame != null) {
//     //             return true;
//     //         }
//     //     }
//     //     return false;
//     // }
//     // private relase(key: any) {
//     //     if (this.has(key)) {
//     //         if (this.gifFrameMap[key] && this.gifFrameMap[key].frameData && this.gifFrameMap[key].frameData.spriteFrames) {
//     //             this.gifFrameMap[key].frameData.spriteFrames.forEach((s) => {
//     //                 assetManager.releaseAsset(s);
//     //             });
//     //         }
//     //         this.gifFrameMap[key] = undefined;
//     //     }
//     // }
//     // private releaseAll() {
//     //     for (const key in this.gifFrameMap) {
//     //         if (this.gifFrameMap[key] && this.gifFrameMap[key].frameData && this.gifFrameMap[key].frameData.spriteFrames) {
//     //             this.gifFrameMap[key].frameData.spriteFrames.forEach((s) => {
//     //                 assetManager.releaseAsset(s);
//     //             });
//     //         }
//     //     }

//     //     this.gifFrameMap = js.createMap(true);
//     // }
// }
