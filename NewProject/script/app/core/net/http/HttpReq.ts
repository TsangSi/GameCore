/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
 * @Author: hrd
 * @Date: 2022-04-14 14:13:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-20 12:35:05
 * @FilePath: \SanGuo\assets\script\app\core\net\http\HttpReq.ts
 * @Description: Http 请求
 *
 */

export default class HttpReq {
    private static _i: HttpReq = null;

    public static get I(): HttpReq {
        if (!HttpReq._i) {
            HttpReq._i = new HttpReq();
        }
        return HttpReq._i;
    }
    private timeoutNum: number = 60000;

    /**
     * http get 请求
     * @param url 地址
     * @param successFunc 成功回调
     * @param failFunc 失败回调
     * @param mustLoad 是否必须加载
     */
    public get(url: string | URL, successFunc: (data: any) => void = null, failFunc: (err: any) => void = null, mustLoad = false): void {
        // if (window.ResMD5 && window.ResMD5.rename) {
        //     const orgUrl = GmCfg.I.getOrgResURL(url);
        //     if ((GmCfg.I.ResPath && orgUrl.indexOf(GmCfg.I.ResPath) >= 0)
        //         || (GmCfg.I.projectResURL && url.indexOf(GmCfg.I.projectResURL) >= 0)) {
        //         url = window.ResMD5.rename(url);
        //     }
        // }

        let xhr = this.setXMLHttpRequest((data) => {
            if (successFunc) {
                successFunc(data);
            }
        }, (err) => {
            if (mustLoad) {
                let timer = setTimeout(() => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    this.get(url, successFunc, failFunc, mustLoad);
                }, 1000);
            } else if (failFunc) {
                failFunc(err);
            }
        });
        xhr.open('GET', url, true);
        xhr.timeout = this.timeoutNum;
        xhr.send();
        xhr = null;
    }

    /** http get 请求 异步调用 */
    public getAsync(url: string | URL, mustLoad = false): Promise<HttpResultInfo> {
        const promise = new Promise<HttpResultInfo>((resolve) => {
            const result = new HttpResultInfo();
            this.get(url, (reData: any) => {
                result.resultInfo = reData;
                resolve(result);
            }, (err: any) => {
                result.errInfo = err;
                resolve(result);
            }, mustLoad);
        });
        return promise;
    }

    /**
     * http post 请求
     * @param url 地址
     * @param data 数据结构
     * @param successFunc 成功回调
     * @param failFunc 失败回调
     * @param mustLoad 是否必须加载
     * @param head 头域类型
     */
    // eslint-disable-next-line max-len
    public post(url: string | URL, data: { [name: string]: any; }, successFunc: (data: any) => void, failFunc: (err: any) => void = null, mustLoad = false, head: boolean = false): void {
        let str = '';
        if (data) {
            for (const k in data) {
                if (str !== '') {
                    str += '&';
                }
                str += `${k}=${data[k]}`;
            }
        }

        // if (window.ResMD5 && window.ResMD5.rename) {
        //     const orgUrl = GmCfg.I.getOrgResURL(url);
        //     if ((GmCfg.I.ResPath && orgUrl.indexOf(GmCfg.I.ResPath) >= 0)
        //         || (GmCfg.I.projectResURL && url.indexOf(GmCfg.I.projectResURL) >= 0)) {
        //         url = window.ResMD5.rename(url);
        //     }
        // }

        let xhr = this.setXMLHttpRequest((data) => {
            if (successFunc) {
                successFunc(data);
            }
        }, (err) => {
            if (mustLoad) {
                let timer = setTimeout(() => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    this.post(url, data, successFunc, failFunc, mustLoad, head);
                }, 1000);
            } else if (failFunc) {
                failFunc(err);
            }
        });
        xhr.open('GET', `${url}?${str}`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        if (head) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }

        xhr.send();
        xhr = null;
    }

    /** http post 请求 异步调用 */
    public postAsync(url: string | URL, data: { [name: string]: any; }, mustLoad = false, head: boolean = false): Promise<HttpResultInfo> {
        const promise = new Promise<HttpResultInfo>((resolve) => {
            const result = new HttpResultInfo();
            this.post(url, data, (reData: any) => {
                result.resultInfo = reData;
                resolve(result);
            }, (err: any) => {
                result.errInfo = err;
                resolve(result);
            }, mustLoad, head);
        });
        return promise;
    }

    /**
     * 请求json文件
     * @param url 地址
     * @param data 数据结构
     * @param successFunc 成功回调
     * @param failFunc 失败回调
     * @param mustLoad 是否必须加载
     */
    public postjson(url: string | URL, data: any = null, successFunc: (data: any) => void = null, failFunc: () => void = null, mustLoad = false): void {
        let xhr = this.setXMLHttpRequest((data) => {
            if (successFunc) {
                successFunc(data);
            }
        }, () => {
            if (mustLoad) {
                let timer = setTimeout(() => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                    this.postjson(url, data, successFunc, failFunc, mustLoad);
                }, 1000);
            } else if (failFunc) {
                failFunc();
            }
        });
        // const _plf = sys.platform;
        // if (_plf == sys.VIVO_GAME || _plf == sys.XIAOMI_GAME || _plf == sys.WECHAT_GAME || _plf == sys.OPPO_GAME) {
        //     xhr.open('POST', url, true);
        //     if (data == null) {
        //         xhr.send();
        //     } else {
        //         xhr.send(JSON.stringify(data));
        //     }
        // } else {
        //     const base64Param = window.btoa(JSON.stringify(data));
        //     xhr.open('GET', `${url}?data=${base64Param}`, true);
        //     xhr.send();
        // }
        const base64Param = window.btoa(JSON.stringify(data));
        xhr.open('GET', `${url}?data=${base64Param}`, true);
        xhr.send();

        xhr = null;
    }
    public getMpq(url: string | URL, successFunc: (data: any) => void, failFunc: () => void = null): void {
        // let xhr = this.setXMLHttpRequest((data) => {
        //     successFunc(data);
        //     data = null;
        // }, () => {
        //     failFunc();
        // });
        // xhr.open('GET', url, true);
        // xhr.responseType = 'arraybuffer';
        // xhr.timeout = this.timeoutNum;
        // xhr.send();
        // xhr = null;

        cc.assetManager.loadRemote(url as string, { ext: '.bin' }, (err, text: cc.BufferAsset) => {
            if (err == null) {
                // 微信小游戏底层使用wx.request(在wx-download.js中做了处理)加载txt文件，出来的结果为ArrayBuffer
                // h5中出来的是Unit8Array
                const _plf = cc.sys.platform;

                // eslint-disable-next-line max-len
                if (_plf === cc.sys.VIVO_GAME || _plf === cc.sys.XIAOMI_GAME || _plf === cc.sys.WECHAT_GAME || _plf === cc.sys.OPPO_GAME) {
                    if (successFunc) successFunc(text);
                    // eslint-disable-next-line dot-notation
                } else if (successFunc) successFunc(text['_buffer']);
                cc.assetManager.releaseAsset(text);
                text = null;
            } else if (failFunc) failFunc();
        });
    }
    private setXMLHttpRequest(successFunc: (resp, aa) => void, failFunc: (err) => void): XMLHttpRequest {
        let xhr = new XMLHttpRequest();

        // eslint-disable-next-line func-names
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && (this.status >= 200 && this.status < 300)) {
                this.onreadystatechange = null;
                this.onerror = null;
                this.ontimeout = null;
                if (successFunc) {
                    successFunc(this.response, this);
                    xhr = null;
                }
            } else if (this.status >= 400 && this.status < 600) {
                if (failFunc) {
                    failFunc('状态码异常');
                }
                this.onreadystatechange = null;
                this.onerror = null;
                this.ontimeout = null;
            }
        };

        // eslint-disable-next-line func-names
        xhr.onerror = function (err) {
            if (failFunc) {
                failFunc(err || 'xhr.onerror');
            }
        };
        // eslint-disable-next-line func-names
        xhr.ontimeout = function () {
            if (failFunc) {
                failFunc('超时');
            }
        };
        return xhr;
    }
    // private sended: { [name: string]: boolean; } = {};
    // public sedErr(errMsg: string): void {
    //     // let md5 = CryptoJS.MD5(errMsg).toString();
    //     // if (this.sended[md5]) {
    //     //     //已存在
    //     // } else {
    //     //     this.sended[errMsg] = true;
    //     //     //发送给服务器
    //     //     Tool.I.log("错误捕捉:" + errMsg);
    //     // }
    // }
}

export class HttpResultInfo {
    /** 成功返回 */
    public resultInfo: string = null;
    /** 失败返回 */
    public errInfo: string = null;
}
