// import TimerMgr from '../../../game/manager/TimerMgr';
// import { CompleteCallback, IResLoadOps } from './ResConst';

// /*
//  * @Author: zs
//  * @Date: 2023-02-24 11:55:56
//  * @Description:
//  *
//  */
// export class ResMgrBase {
//     /** 资源地址 */
//     private _ResUrl: string = '';

//     /** 从贴图缓存表剔除某个贴图 */
//     public removeTexture(uuid: string): void {
//         // this.resLoadTexture.delCache(uuid);
//     }

//     /** 从精灵帧缓存表剔除某个精灵帧 */
//     public removeSpriteFrame(uuid: string): void {
//         // for (const path in this.spriteFrameCaches) {
//         //     const t = this.spriteFrameCaches[path];
//         //     // eslint-disable-next-line dot-notation
//         //     if (t['_uuid'] === uuid) {
//         //         delete this.spriteFrameCaches[path];
//         //     }
//         // }
//     }

//     /** 缓存时间 */
//     private assetCacheTime = 5;
//     /** 是否需要缓存5秒 */
//     private needCache: boolean = true;
//     private assetCaches: { [uuid: string]: { asset: cc.Asset, time: number } } = cc.js.createMap(true);
//     /**
//      * 减少资源的引用并尝试加入缓存机制
//      * @param asset 资源
//      * @param force 是否自动释放，不加入缓存机制，默认为false
//      * @returns
//      */
//     public decRef(asset: cc.Asset, force?: boolean): void {
//         force = force || false;
//         asset.decRef(force);
//         if (!this.needCache) {
//             if (asset.refCount <= 0) {
//                 this.removeAsset(asset);
//             }
//             return;
//         }
//         if (asset.refCount === 0) {
//             // eslint-disable-next-line dot-notation
//             let k: string = asset['_uuid'] || asset['_name'];
//             if (asset instanceof cc.SpriteFrame) {
//                 k += '@cc.SpriteFrame';
//             } else if (asset instanceof sp.SkeletonData) {
//                 k += '@sp.SkeletonData';
//             } else if (asset instanceof cc.Texture2D) {
//                 k += '@cc.Texture2D';
//             } else if (asset instanceof cc.SpriteAtlas) {
//                 k += '@cc.SpriteAtlas';
//             }
//             this.assetCaches[k] = { asset, time: this.assetCacheTime };
//             this.startTimer();
//         }
//     }

//     /** 检测资源的定时器标识id */
//     private checkResTimerId: number;
//     /** 启动定时器 */
//     private startTimer(): void {
//         if (this.checkResTimerId !== undefined && this.checkResTimerId !== null) {
//             return;
//         }
//         this.checkResTimerId = TimerMgr.I.setInterval(this.checkAssetCaches, 1000, this);
//     }

//     /** 停止定时器 */
//     private stopTimer(): void {
//         if (this.checkResTimerId !== undefined && this.checkResTimerId !== null) {
//             TimerMgr.I.clearInterval(this.checkResTimerId);
//             this.checkResTimerId = undefined;
//         }
//     }

//     /** 移除资源 */
//     private removeAsset(asset: cc.Asset, k?: string): void {
//         if (asset instanceof cc.SpriteFrame) {
//             // eslint-disable-next-line dot-notation
//             if (asset['_uuid'] && asset['_name']) {
//                 asset.decRef();
//             } else {
//                 asset.destroy();
//             }
//             // eslint-disable-next-line dot-notation
//             if (asset['_uuid'] !== '') {
//                 // eslint-disable-next-line dot-notation
//                 this.removeSpriteFrame(asset['_uuid']);
//                 // }
//             }
//         } else if (asset instanceof cc.Texture2D) {
//             asset.decRef();
//             // eslint-disable-next-line dot-notation
//             // this.removeTexture(asset['_uuid']);
//         } else if (asset instanceof cc.SpriteAtlas) {
//             asset.destroy();
//         } else {
//             asset.decRef();
//         }
//         if (k && this.assetCaches[k]) {
//             delete this.assetCaches[k];
//         }
//     }

//     /** 检查资源缓存 */
//     private checkAssetCaches(): void {
//         let data: { asset: cc.Asset, time: number };
//         let hasCache = false;
//         for (const k in this.assetCaches) {
//             data = this.assetCaches[k];
//             if (data && data.asset.refCount === 0) {
//                 if (data.time <= 0) {
//                     this.removeAsset(data.asset, k);
//                 } else {
//                     data.time -= 1;
//                     hasCache = true;
//                 }
//             }
//         }
//         if (!hasCache) {
//             this.stopTimer();
//         }
//     }
//     /** http url统一在这加上 */
//     // eslint-disable-next-line max-len
//     public _loadRemote<T>(filePath: string, onComplete: (e: Error, obj: T, ...args: any[]) => void, target?: object, ...args: any[]): void {
//         filePath = this.getRealFilePath(filePath);
//         // this.time(`_loadRemote ${filePath}`);
//         cc.assetManager.loadRemote(filePath, (e, obj: T) => {
//             // this.timeEnd(`_loadRemote ${filePath}`);
//             onComplete.call(target, e, obj, ...args);
//         });
//     }
//     /** 根据文件路径获取远程服务器真实存储路径 */
//     public getRealFilePath(filePath: string): string {
//         if (filePath.indexOf('http://') === 0 || filePath.indexOf('https://') === 0) {
//             return filePath;
//         }
//         const resUrl = this.getResUrl();
//         return `${resUrl}/${filePath}`;
//     }

//     public setResUrl(url: string): void {
//         this._ResUrl = url;
//     }
//     public getResUrl(): string {
//         return this._ResUrl;
//     }

//     public loadLocal<T extends cc.Asset>(path: string, type: any, callback: CompleteCallback<T>, resLoadOps?: IResLoadOps): void;
//     public loadLocal<T extends cc.Asset>(path: string[], type: any, callback: CompleteCallback<T[]>, resLoadOps?: IResLoadOps): void;
//     public loadLocal<T extends cc.Asset>(path: string | string[], type: any, callback: CompleteCallback<T | T[]>, resLoadOps?: IResLoadOps): void {
//         //
//     }

//     private time(label: string) {
//         // eslint-disable-next-line dot-notation
//         if (window['restime']) {
//             console.time(label);
//         }
//     }
//     private timeEnd(label: string) {
//         // eslint-disable-next-line dot-notation
//         if (window['restime']) {
//             console.timeEnd(label);
//         }
//     }

//     /** 析构接口 */
//     public fini(): void {
//         this.stopTimer();
//     }
// }
