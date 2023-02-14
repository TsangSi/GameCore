/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import * as CryptoJS from 'crypto-js';
import { assetManager, BufferAsset, sys } from 'cc';
import UtilsTimeout from '../utils/UtilsTimeout';
import UtilsPlatform from '../utils/UtilsPlatform';

export default class HttpManager {
    private static _i: HttpManager = null;
    public static get I(): HttpManager {
        if (!HttpManager._i) {
            HttpManager._i = new HttpManager();
        }
        return HttpManager._i;
    }

    private timeoutNum = 60000;

    public get(url: string, successFunc: (data: any) => void = null, failFunc = null, mustLoad = false): void {
        let xhr = this.setXMLHttpRequest((data) => {
            if (successFunc) {
                successFunc(data);
            }
        }, () => {
            if (mustLoad) {
                UtilsTimeout.I.setTimeout(() => {
                    this.get(url, successFunc, failFunc, mustLoad);
                }, 1000);
            } else if (failFunc) {
                failFunc();
            }
        });
        xhr.open('GET', url, true);
        xhr.timeout = this.timeoutNum;
        xhr.send();
        xhr = null;
    }

    public post(url: string, data: Record<string, unknown> = null, successFunc = null, failFunc = null, mustLoad = false, head = false): void {
        let str = '';
        if (data) {
            for (const k in data) {
                if (str !== '') {
                    str += '&';
                }
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                str += `${k}=${data[k]}`;
            }
        }
        let xhr = this.setXMLHttpRequest((data) => {
            if (successFunc) {
                successFunc(data);
            }
        }, () => {
            if (mustLoad) {
                UtilsTimeout.I.setTimeout(() => {
                    this.post(url, data, successFunc, failFunc, mustLoad, head);
                }, 1000);
            } else if (failFunc) {
                failFunc();
            }
        });
        xhr.open('GET', `${url}?${str}`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        if (head) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        // if (str == "") {
        xhr.send();
        // } else {
        //     xhr.send(str);
        // }
        xhr = null;
    }
    public postjson(url: string, data: any = null, successFunc = null, failFunc = null, mustLoad = false): void {
        let xhr = this.setXMLHttpRequest((data) => {
            if (successFunc) {
                successFunc(data);
            }
        }, () => {
            if (mustLoad) {
                UtilsTimeout.I.setTimeout(() => {
                    this.postjson(url, data, successFunc, failFunc, mustLoad);
                }, 1000);
            } else if (failFunc) {
                failFunc();
            }
        });
        if (UtilsPlatform.isSmallGame()) {
            xhr.open('POST', url, true);
            if (data == null) {
                xhr.send();
            } else {
                xhr.send(JSON.stringify(data));
            }
        } else {
            const base64Param = window.btoa(JSON.stringify(data));
            xhr.open('GET', `${url}?data=${base64Param}`, true);
            xhr.send();
        }

        xhr = null;
    }
    public getMpq(url1, successFunc, failFunc): void {
        // var xhr = this.setXMLHttpRequest((data) => {
        //     successFunc(data);
        //     data = null;
        // }, () => {
        //     failFunc();
        // });
        // xhr.open("GET", url, true);
        // xhr.responseType = "arraybuffer";
        // xhr.timeout = this.timeoutNum;
        // xhr.send();
        // xhr = null;
        assetManager.loadRemote(url1, { ext: '.bin' }, (err, text: BufferAsset) => {
            if (err == null) {
                // 微信小游戏底层使用wx.request(在wx-download.js中做了处理)加载txt文件，出来的结果为ArrayBuffer
                // h5中出来的是Unit8Array
                // const _plf = sys.platform;

                if (UtilsPlatform.isSmallGame()) {
                    if (successFunc) successFunc(text);
                } else if (successFunc) successFunc(text.buffer());
                assetManager.releaseAsset(text);
                text = null;
            } else if (failFunc) failFunc();
        });
    }
    private setXMLHttpRequest(successFunc, failFunc) {
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
                    failFunc();
                }
                this.onreadystatechange = null;
                this.onerror = null;
                this.ontimeout = null;
            }
        };
        // eslint-disable-next-line func-names
        xhr.onerror = function () {
            if (failFunc) {
                failFunc();
            }
        };
        // eslint-disable-next-line func-names
        xhr.ontimeout = function () {
            if (failFunc) {
                failFunc();
            }
        };
        return xhr;
    }
    private sended: { [name: string]: boolean } = {}
    public sedErr(errMsg: string): void {
        const md5 = CryptoJS.MD5(errMsg).toString();
        if (this.sended[md5]) {
            // 已存在
        } else {
            this.sended[errMsg] = true;
            // 发送给服务器
            // Tool.I.log("错误捕捉:" + errMsg);
            console.log(`错误捕捉:${errMsg}`);
        }
    }
}
