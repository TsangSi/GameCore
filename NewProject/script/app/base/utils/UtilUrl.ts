/*
 * @Author: zs
 * @Date: 2022-05-09 11:18:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-11 16:52:04
 * @FilePath: \SanGuo\assets\script\app\base\utils\UtilUrl.ts
 * @Description:
 */
export class UtilUrl {
    public static GetResURL2(url: string): string {
        return url;
    }
    // public static Get0CURL(url: string): string {
    //     return `${GameApp.I.ResUrl}${url}`;
    // }

    // 获取url参数
    public static getQueryString(name: string): string {
        // const _plf = sys.platform;
        // if (_plf === sys.VIVO_GAME || _plf == sys.XIAOMI_GAME || _plf == sys.WECHAT_GAME || _plf == sys.OPPO_GAME) {

        // } else {
        //     const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
        //     const r = window.location.search.substr(1).match(reg);
        //     if (r != null) return unescape(r[2]);
        //     return null;
        // }

        const reg = new RegExp(`(^|&)?${name}=([^&]*)(&|$)`, 'i');
        const r = window.location.search.valueOf().match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

    /** 当前url是否为https */
    public static isSSL(): boolean {
        return document.location.protocol === 'https:';
    }

    /** 根据当前地址替换http头 */
    public static replaceHttpHead(url: string): string {
        const path = UtilUrl.isSSL() ? url.replace('http:', 'https:') : url;
        return path;
    }

    public static replaceWss(wss: string): string {
        const path = UtilUrl.isSSL() ? wss.replace('ws:', 'wss:') : wss;
        return path;
    }
}
