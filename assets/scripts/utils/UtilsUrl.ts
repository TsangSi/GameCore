import { sys } from 'cc';
import MD5 from '../config/MD5';
import UtilsPlatform from './UtilsPlatform';

export default class UtilsUrl {
    private static _i: UtilsUrl = null;
    static get I (): UtilsUrl {
        if (this._i == null) {
            this._i = new UtilsUrl();
        }
        return this._i;
    }

    // 获取url参数
    static getQueryString (name: string) {
        if (UtilsPlatform.isSmallGame()) {
            //
        } else {
            const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
            const r = reg.exec(window.location.search.substr(1));
            if (r != null) return unescape(r[2]);
        }
        return undefined;
    }

    private _ResPath: string[] = [];// 远程资源地址
    public get ResPath () {
        return this._ResPath[0] || '';
    }
    public set ResPath (value: string) {
        this._ResPath = [];
        this._ResPath.push(value);
        this._ResPath.push(value.replace('client.', 'client1.'));
        this._ResPath.push(value.replace('client.', 'client2.'));
        this._ResPath.push(value.replace('client.', 'client3.'));
        this._ResPath.push(value.replace('client.', 'client4.'));
    }
    // 远程资源url,多域名
    public getResURLT2 (url: string) {
        const ut = this._ResPath[0] || '';
        return ut;
        // if (!url || url.length === 0) return ut;

        // let md5 = MD5.I.hex_md5(url);
        // md5 = md5.substr(md5.length - 4, 4);
        // const i = parseInt(md5, 16) % this._ResPath.length;
        // ut = this._ResPath[i];
        // return ut;
    }
    // //本地资源url,多域名
    // public getResURL(url: string) {
    //     if (!this.mergePrefabJson) return url;
    //     if (!url || url.length == 0) return url;
    //     if (url.indexOf('http') > -1) return url;
    //     return this.getResURLT(url) + '/' + url
    // };
    // 远程资源url,多域名
    public getResURL2 (url: string) {
        return this.getResURLT2(url) + url;
    }

    public get0CURL (url: string) {
        return `${<string>window.GlobalConfig.projectResURL + url}?${<string>window.RunM.path}`;
    }
}
