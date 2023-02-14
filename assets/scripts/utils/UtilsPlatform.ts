import { sys } from 'cc';

// 判断是否是vivo，xioami, 微信小游戏，等
const smallGameMap = [sys.Platform.WECHAT_GAME, sys.Platform.VIVO_MINI_GAME, sys.Platform.XIAOMI_QUICK_GAME, sys.Platform.OPPO_MINI_GAME];

export default class UtilsPlatform {
    // 判断是否是vivo，xioami, 微信小游戏，等
    public static isSmallGame(): boolean {
        const _d = sys.platform;
        const _t = smallGameMap;
        let _r = false;
        for (let i = 0, l = _t.length; i < l; i++) {
            if (_d === _t[i]) {
                _r = true;
                break;
            }
        }
        return _r;
    }

    public static isWin32(): boolean {
        return sys.platform === sys.Platform.WIN32;
    }

    public static isAndroid(): boolean {
        return sys.platform === sys.Platform.ANDROID;
    }

    public static isIos(): boolean {
        return sys.platform === sys.Platform.IOS;
    }

    public static isPrimitive(): boolean {
        return UtilsPlatform.isWin32() || UtilsPlatform.isAndroid() || UtilsPlatform.isIos();
    }

    /** 是否是微信小游戏 */
    public static isWechatGame(): boolean {
        return sys.platform === sys.Platform.WECHAT_GAME;
    }

    public static Type = {
        // ios原生
        iosNative: 'ios',
        // android原生
        androidNative: 'android',
        // 网站
        h5: 'h5',
        // 小游戏ios端
        weGameIos: 'xyx_ios',
        // 小游戏android端
        weGameAndroid: 'xyx_android',
        // pc端浏览器
        pc: 'pc',
        // 公众号
        mp: 'mp',
        // 手机浏览器
        mobileH5: 'mobile_h5',
    };
}
