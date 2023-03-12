/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */

/*
 * @Author: kexd
 * @Date: 2022-06-08 21:11:18
 * @FilePath: \SanGuo2.4\assets\script\game\manager\PerformanceMgr.ts
 * @Description:
 *
 */

import MsgToastMgr from '../base/msgtoast/MsgToastMgr';
import WinMgr from '../../app/core/mvc/WinMgr';

/** 内存阀值 */
const MAX_MEMORY = 500 * 1024 * 1024;
/** drawCall阀值 */
const MAX_DRAWCALL = 800;
/** FPS设定值是30，这里设置阀值为15,监测是否有非常耗时的计算 */
const MAX_FPS = 15;

const uncheckWinIds = [31, 32];

interface textureInfo {
    /** 纹理内存 */
    memory: number,
    /** 宽 */
    width: number,
    /** 高 */
    height: number,
    /** 名 */
    name: string,
}

interface IMemoryInfo {
    /** 初始纹理内存 */
    startMemory: number,
    /** 初始纹理buffer内存 */
    startBuff: number,
    /** 初始js内存 */
    startJsMemory: number,
    /** 最大纹理内存 */
    maxMemory: number,
    /** 最大纹理buffer内存 */
    maxBuff: number,
    /** 最大js内存 */
    maxJsMemory: number,
}

// WinMgr.prototype.startCollect = function () {
//     PerformanceMgr.I.startCollect();
// };

export default class PerformanceMgr {
    private static _i: PerformanceMgr = null;
    public static get I(): PerformanceMgr {
        if (this._i == null) {
            this._i = new PerformanceMgr();
            this._i._init();
        }
        return this._i;
    }

    /** http请求数据列表 */
    private _httpPerfList = [];

    /** 开关 暂先默认开 */
    private _turnOn: boolean = false;
    /** 开始收集 */
    private _isCollect: boolean = false;
    /** 每1s检查一次纹理内存变化 */
    private _count: number = 0;
    private readonly MaxCount = 30;

    /** 当前winId */
    private _winId: number = 0;
    /** 记录内存信息 */
    private _memoryInfo: Map<number, IMemoryInfo> = new Map<number, IMemoryInfo>();
    /** 是否关闭界面后还有内存增长 */
    private _isEnd: boolean = false;
    /** 是否是战斗中 */
    private _isInWar: boolean = false;

    /** 设置开关 */
    public set turnOn(on: boolean) {
        console.log('性能监控开关：', on);
        this._turnOn = on;
    }
    public get turnOn(): boolean {
        return this._turnOn;
    }

    private _init() {
        this.initPerformanceObserver();
    }

    /** 打印纹理信息 */
    public textureInfo(): void {
        if (!this._turnOn) return;
        let total = 0;
        const tList: textureInfo[] = [];
        const all = cc.assetManager.assets['_map'];
        for (const k in all) {
            // if (k.indexOf('1001') >= 0) {
            //     console.log('ssssssssss');
            // }
            const item = all[k];
            if (item['_nativeData']) {
                const w = item['_nativeData'].width;
                const h = item['_nativeData'].height;
                const m = (w * h * 4) / 1024 / 1024;
                tList.push({
                    memory: m,
                    width: w,
                    height: h,
                    name: item['_nativeUrl'],
                });
                total += m;
                // console.log(m, `${w}_${h}`, item['_nativeUrl']);
            } else if (item['_texture']) {
                const _texture = item['_texture'];
                const w = _texture._width;
                const h = _texture._height;
                const m = (w * h * 4) / 1024 / 1024;
                const name = _texture['_nativeUrl'] || _texture['_uuid'] || k;
                tList.push({
                    memory: m,
                    width: w,
                    height: h,
                    name,
                });
                if (m >= 0) {
                    total += m;
                } else {
                    const a = 1;
                }

                // console.log(m, `${w}_${h}`, item['_name'], name);
            } else {
                // console.log('-----------', k);
            }
        }
        tList.sort((a, b) => b.memory - a.memory);
        console.log(tList);
        console.log('总的memory是', total);
    }

    /** 检测登录耗时、资源加载的数量 */
    private _loginT: number = 0;
    public loginCollect(): void {
        // ccPackMgr.turnOn = this._turnOn;
        // if (!this._turnOn) {
        //     return;
        // }
        // this._loginT = performance.now();
        // ccPackMgr.resTotal = 0;
        // ccPackMgr.resCollect = true;
        // this._httpPerfList = [];

        // this.gfxMemory(true);
    }
    public loginCost(): void {
        // if (!this._turnOn) {
        //     return;
        // }
        // // const resTotal = ccPackMgr.resTotal;
        // const resTotal = this._httpPerfList.length;
        // console.log(`登录耗时:${performance.now() - this._loginT}ms`);
        // console.log(`游戏已运行:${cc.game.totalTime / 1000}s`);
        // console.log('登录 Http Request 总数:', resTotal);

        // this.gfxMemory();

        // ccPackMgr.resCollect = false;
        // const arr = this.getPerfEntries(this._httpPerfList);
        // console.log(arr);
    }

    /** 检测打开界面的耗时 */
    private _lastT: number = 0;
    public startCollect(winId: number, isInWar: boolean = false): void {
        // ccPackMgr.turnOn = this._turnOn;
        // if (!this._turnOn) {
        //     return;
        // }
        // if (uncheckWinIds.indexOf(winId) >= 0) {
        //     return;
        // }
        // if (winId) {
        //     this._winId = winId;
        // }
        // console.log(`startCollect==========winId=${this._winId},${WinMgr.I.getVoCfgByWinId(this._winId)}`);
        // this._isEnd = false;
        // this._isInWar = isInWar;
        // this._isCollect = true;
        // this._lastT = new Date().getTime();

        // ccPackMgr.resTotal = 0;
        // ccPackMgr.resCollect = true;

        // this.gfxMemory(true);

        // this._httpPerfList = [];
    }

    public endCollect(winId: number, isInWar: boolean = false): void {
        // if (!this._turnOn) {
        //     return;
        // }
        // if (uncheckWinIds.indexOf(winId) >= 0) {
        //     return;
        // }
        // if (winId) {
        //     this._winId = winId;
        // }
        // console.log(`endCollect--------------winId=${winId},${WinMgr.I.getVoCfgByWinId(this._winId)}`);
        // this._isInWar = isInWar;
        // if (this._isCollect) {
        //     const now = new Date().getTime();
        //     console.log(`耗时:${now - this._lastT}ms`);
        // }
        // if (ccPackMgr.resCollect) {
        //     // const resTotal = ccPackMgr.resTotal;
        //     const resTotal = this._httpPerfList.length;
        //     console.log('Http Request 总数:', resTotal);
        // }
        // this.gfxMemory();

        // if (this._winId || this._isInWar) {
        //     this.outMax();
        // }
        // this._isEnd = true;
        // ccPackMgr.resCollect = false;
        // this._isCollect = false;
        // const arr = this.getPerfEntries(this._httpPerfList);
        // console.log(arr);
    }

    /** 输出最大内存占用信息 */
    private outMax(): void {
        // const endBuff = cc.game._gfxDevice.memoryStatus.bufferSize;
        // const endMemory = cc.game._gfxDevice.memoryStatus.textureSize;
        // const endjs = this.getJsMemory();
        const msg = this._isInWar ? '战斗' : `界面${this._winId},${WinMgr.I.getVoCfgByWinId(this._winId)}`;
        const minfo = this._memoryInfo.get(this._winId);
        if (minfo) {
            console.log(`刚进入 ${msg}的GFX纹理内存是:${(minfo.startMemory / 1048576).toFixed(2)}MB,
                刚进入 的GFX Buffer内存是:${(minfo.startBuff / 1048576).toFixed(2)}MB,
                刚进入 的js内存是:${(minfo.startJsMemory / 1048576).toFixed(2)}MB,
                最高 GFX纹理内存是:${(minfo.maxMemory / 1048576).toFixed(2)}MB,
                最高 GFX Buffer内存是:${(minfo.maxBuff / 1048576).toFixed(2)}MB,
                最高 js内存是:${(minfo.maxJsMemory / 1048576).toFixed(2)}MB,
                GFX纹理内存最大增长了:${((minfo.maxMemory - minfo.startMemory) / 1048576).toFixed(2)}MB,
                js内存最大增长了:${((minfo.maxJsMemory - minfo.startJsMemory) / 1048576).toFixed(2)}MB`);

            const startTotal = minfo.startMemory + minfo.startBuff + minfo.startJsMemory;
            const highestTotal = minfo.maxMemory + minfo.maxBuff + minfo.maxJsMemory;
            console.log(`刚进入${msg}的总内存是:${(startTotal / 1048576).toFixed(2)}MB,
                最高总内存是:${(highestTotal / 1048576).toFixed(2)}MB,
                总内存存最大增长了:${((highestTotal - startTotal) / 1048576).toFixed(2)}MB`);

            // minfo.maxMemory = endMemory;
        }
    }

    /**
     * GFX 设备参数：内存占用、drawCall、渲染三角形数量、FPS等信息
     */
    public gfxMemory(start: boolean = false): void {
        // const memoryStatus = cc.game._gfxDevice.memoryStatus;
        // const numDrawCalls = cc.game._gfxDevice.numDrawCalls;
        // const numTris = cc.game._gfxDevice.numTris;
        // const info = this.getJsMemory();

        // if (start && this._winId) {
        //     const minfo = this._memoryInfo.get(this._winId);
        //     if (!minfo) {
        //         this._memoryInfo.set(this._winId, {
        //             startMemory: memoryStatus.textureSize,
        //             startBuff: memoryStatus.bufferSize,
        //             startJsMemory: info.heapUsed,
        //             maxMemory: 0,
        //             maxBuff: 0,
        //             maxJsMemory: 0,
        //         });
        //     } else if (start) {
        //         minfo.startMemory = memoryStatus.textureSize;
        //         minfo.startBuff = memoryStatus.bufferSize;
        //         minfo.startJsMemory = info.heapUsed;
        //     } else {
        //         this.setMaxMemory();
        //     }
        // }

        // const msg: string = start ? '开始时:' : '结束时:';
        // console.log(`${this._winId}${msg}
        // FPS:, ${(this._fps || +cc.game.frameRate).toFixed(2)},
        // drawCall:, ${numDrawCalls},
        // 每帧耗时:, ${(this._ft || cc.game.frameTime).toFixed(2)},
        // Instance Count:${cc.game._gfxDevice.numInstances},
        // 渲染三角形数量:, ${numTris},
        // GFX纹理内存:${(memoryStatus.textureSize / 1048576).toFixed(2)}MB,
        // GFX Buffer内存:${(memoryStatus.bufferSize / 1048576).toFixed(2)}MB,
        // 浏览器js内存使用:${(info.heapUsed / 1048576).toFixed(2)},
        // `);
        // // 配置表内存(ConfigMgr):${PerformanceMgr.I.sizeof(ConfigMgr.I, true)},
    }

    /** 监测内存，cpu的变化情况，是否有超过阀值 */
    private _last: number = 0;
    private _ft: number = 0;
    private _fps: number = 0;
    public mainUpdate(dt: number): void {
        // if (!this._turnOn) {
        //     return;
        // }
        // // 这个是设定值，不会变的，cc.game.frameRate也是一样，不是实际值
        // // if (cc.game.deltaTime > MAX_FRAMETIME) {
        // //     console.log(`上一帧的增量时间${cc.game.deltaTime.toFixed(3)}超过阀值,检测是否有比较耗时的计算`);
        // //     MsgToastMgr.Show(`上一帧的增量时间${cc.game.deltaTime.toFixed(3)}超过阀值`);
        // // }
        // const now = new Date().getTime();
        // this._ft = (now - this._last) / 1000;
        // this._fps = this._ft > 0 ? 1 / this._ft : 0;
        // if (this._last > 0 && this._fps < MAX_FPS) {
        //     // console.log(`当前FPS:${this._fps.toFixed(2)}超过阀值,两帧间隔 ${this._ft.toFixed(2)}s 检测是否有比较耗时的计算`);
        //     // MsgToastMgr.Show(`当前FPS:${this._fps.toFixed(2)}超过阀值,两帧间隔 ${this._ft.toFixed(2)}s`);
        // }
        // if (cc.game._gfxDevice.numDrawCalls > MAX_DRAWCALL) {
        //     console.log('当前DrawCall超过阀值');
        //     MsgToastMgr.Show('当前DrawCall超过阀值');
        // }
        // if (cc.game._gfxDevice.memoryStatus.textureSize > MAX_MEMORY) {
        //     console.log('当前内存超过阀值');
        //     MsgToastMgr.Show('当前内存超过阀值');
        // }
        // if (this._winId || this._isInWar) {
        //     this._count++;
        //     if (this._count > this.MaxCount) {
        //         this._count = 0;
        //         this.setMaxMemory();
        //     }
        // }
        // this._last = now;
    }

    private setMaxMemory() {
        // const textureSize = cc.game._gfxDevice.memoryStatus.textureSize;
        // const minfo = this._memoryInfo.get(this._winId);
        // if (minfo) {
        //     const buffSize = cc.game._gfxDevice.memoryStatus.bufferSize;
        //     if (minfo.maxBuff < buffSize) {
        //         console.log(`${this._winId}最高GFX buffer内存:${(buffSize / 1048576).toFixed(2)}MB`);
        //         minfo.maxBuff = buffSize;
        //     }
        //     const jsMemory = this.getJsMemory();
        //     if (minfo.maxJsMemory < jsMemory.heapUsed) {
        //         console.log(`${this._winId}最高js内存:${(jsMemory.heapUsed / 1048576).toFixed(2)}MB`);
        //         minfo.maxJsMemory = jsMemory.heapUsed;
        //     }
        //     if (minfo.maxMemory < textureSize) {
        //         minfo.maxMemory = textureSize;
        //         console.log(`${this._winId}最高GFX纹理内存:${(textureSize / 1048576).toFixed(2)}MB`);
        //         if (this._isEnd) {
        //             this.outMax();
        //         }
        //     }
        // }
    }

    /** 初始化http性能观察 */
    private initPerformanceObserver() {
        if (!('PerformanceObserver' in window)) {
            console.log('当前浏览器不支持 PerformanceObserver API');
            return;
        }
        const observer = new PerformanceObserver((ist, observer) => {
            this.performanceCallBack(ist, observer);
        });
        observer.observe({ entryTypes: ['resource'] });
    }

    private performanceCallBack(list, observer) {
        // if (ccPackMgr.resCollect === false) return;
        // const arr = list.getEntries();
        // for (const item of arr) {
        //     this._httpPerfList.push(item);
        // }
    }

    public getPerfEntries(perfArray: PerformanceEntry[]): any[] {
        if (!perfArray || perfArray.length === 0) {
            return perfArray;
        }
        const entryTimesList = [];
        perfArray.forEach((item, index) => {
            const templeObj = {};
            // 请求资源路径
            templeObj['name'] = item.name;
            // 发起资源类型
            templeObj['资源类型'] = item['initiatorType'];
            templeObj['持续时间'] = item.duration.toFixed(2);
            if (item.duration > 10) {
                entryTimesList.push(templeObj);
            }
        });
        return entryTimesList;
    }

    private formatByteSize(bytes: number): string {
        if (bytes < 1024) {
            return `${bytes} bytes`;
        } else if (bytes < 1048576) {
            return `${(bytes / 1024).toFixed(3)} K`;
        } else if (bytes < 1073741824) {
            return `${(bytes / 1048576).toFixed(3)} M`;
        } else {
            return `${(bytes / 1073741824).toFixed(3)} G`;
        }
    }

    public getJsMemory(): { heapTotal: number, heapUsed: number } {
        const info = {
            heapTotal: 0,
            heapUsed: 0,

        };
        if (!window.performance || !window.performance['memory']) {
            console.log('该浏览器不支持performance.memory');
            return info;
        }
        const mem = window.performance['memory'];
        const totalJSHeapSize: number = mem.totalJSHeapSize;
        const usedJSHeapSize: number = mem.usedJSHeapSize;
        if (usedJSHeapSize > totalJSHeapSize) {
            console.warn('内存使用异常');
        }
        return {
            heapTotal: totalJSHeapSize,
            heapUsed: usedJSHeapSize,
        };
    }

    public getSysMemory(): { heapTotal: string, heapUsed: string } {
        const info = {
            heapTotal: '',
            heapUsed: '',

        };
        if (!window.performance || !window.performance['memory']) {
            console.log('该浏览器不支持performance.memory');
            return info;
        }
        const mem = window.performance['memory'];
        const totalJSHeapSize: number = mem.totalJSHeapSize;
        const usedJSHeapSize: number = mem.usedJSHeapSize;
        info.heapTotal = this.formatByteSize(mem.totalJSHeapSize);
        info.heapUsed = this.formatByteSize(mem.usedJSHeapSize);

        if (usedJSHeapSize > totalJSHeapSize) {
            console.warn('内存使用异常');
        }
        return info;
    }

    /** 近似计算一个对象在js占用内存 */
    public sizeof(object: unknown, isFormat: boolean = false): any {
        const seen = new WeakSet();
        const sizeOfObj = (obj) => {
            if (obj === null) return 0;

            let bytes = 0;
            // 对象里的key也是占用内存空间的
            const props = Object.keys(obj);
            for (let i = 0; i < props.length; i++) {
                const key = props[i];
                // 无论value是否重复，都需要计算key
                bytes += calculator(key);
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    // 这里需要注意value使用相同内存空间（只需计算一次内存）
                    if (seen.has(obj[key])) continue;
                    seen.add(obj[key]);
                }
                bytes += calculator(obj[key]);
            }
            return bytes;
        };

        const calculator = (obj) => {
            const objType = typeof obj;
            if (obj && obj['byteLength']) {
                return obj['byteLength'];
            }
            switch (objType) {
                case 'string':
                    // eslint-disable-next-line no-case-declarations
                    const len = obj.replace(/[^\00-\xFF]/g, '**').length;
                    return len * 2;
                case 'boolean':
                    return 4;
                case 'number':
                    return 8;
                case 'object':
                    if (Array.isArray(obj)) {
                        // 数组处理 [1,2] [{x:1},{y:2}]
                        return obj.map(calculator).reduce((res, cur) => res + cur, 0);
                    } else {
                        // 对象处理
                        return sizeOfObj(obj);
                    }
                default:
                    return 0;
            }
        };
        const m = calculator(object);
        if (isFormat) {
            return this.formatByteSize(m);
        }
        return m;
    }

    /** 键盘事件 */
    // private debugTools() {
    //     if (!this._turnOn) return;
    //     input.on(Input.EventType.KEY_DOWN, (event: EventKeyboard) => {
    //         switch (event.keyCode) {
    //             case KeyCode.SPACE:
    //                 {
    //                     const files = new UtilFile();
    //                     files.openTextWin((text: string, file: File) => {
    //                         const data = JSON.parse(text);
    //                         console.log(text);
    //                         console.log(data);
    //                     });
    //                 }
    //                 break;
    //             case KeyCode.KEY_Q:
    //                 this.textureInfo();
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }, this);
    // }
}
