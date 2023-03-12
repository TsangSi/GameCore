/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable indent */
/* eslint-disable dot-notation */
/*
 * @Author: hrd
 * @Date: 2022-10-12 14:14:26
 * @Description:
 *
 */

import { EventClient } from '../app/base/event/EventClient';
import GameApp from '../game/base/GameApp';
import { LayerMgr } from '../game/base/main/LayerMgr';
import { E } from '../game/const/EventName';

export class SdkMgr {
    private static Instance: SdkMgr;
    public static get I(): SdkMgr {
        if (!this.Instance) {
            this.Instance = new SdkMgr();
            this.Instance._init();
        }
        return this.Instance;
    }

    private _init(): void {
        //
    }

    // 初始化sdk
    public init(): void {
        if (window && window['TZSDK']) {
            console.log('========sdk 初始化========= window[TZSDK].init ====');
            window['TZSDK'].init();
        } else {
            console.error(' sdk 初始化调用失败');
        }
    }

    // 登录
    public login(): void {
        if (window && window['TZSDK']) {
            console.log('========sdk 登录========= window[TZSDK].login ====');
            window['TZSDK'].login((param: object) => {
                // 登陆成功回调函数（异步）
                // param（类型：Object）为登陆成功平台回调参数
                // 获取登陆回调参数后，可根据参数中的信息完成后续登录校验操作。
                const app_id = param['app_id']; // 应用id
                const user_id = param['user_id']; // 平台账户id
                const token = param['token']; // 平台token
                const realNameState = param['realNameState']; // 实名认证状态
                const shiLingStatus: number = param['shi_ling_status']; // 是否显示适龄提示 0 | 1

                GameApp.I.RealNameState = realNameState;

                let notchHeight = 0;
                let bottomHeight = 0;
                if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) {
                    const info = window['Channel_SDK'];
                    if (info) {
                        notchHeight = info.notch_height;
                        bottomHeight = info.bottom_height;
                    }
                } else if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                    const sysInfo = wx.getSystemInfoSync();
                    if (sysInfo) {
                        const sysVer = sysInfo.system || '';
                        const menuInfo = wx.getMenuButtonBoundingClientRect();
                        let height = menuInfo.top;
                        if (height <= 20 && Number(sysInfo.safeArea.height) + Number(sysInfo.safeArea.top) !== sysInfo.screenHeight) {
                            height = Number(sysInfo.statusBarHeight) + Number(menuInfo.height);
                        }
                        if (height && sysVer.indexOf(cc.sys.OS_WINDOWS) > -1) {
                            height = 0;
                        }
                        notchHeight = height;
                        bottomHeight = height;
                    }
                } else {
                    notchHeight = param['notch_height'];
                    bottomHeight = param['bottom_height'];
                }
                LayerMgr.I.notchHeight = notchHeight; // 刘海屏适配高度
                LayerMgr.I.bottomHeight = bottomHeight; // 底部适配高度

                // console.log('====TZSDK==登陆======', param);
                EventClient.I.emit(E.Login.ReqLogin, user_id, token);
                EventClient.I.emit(E.Sdk.Health, shiLingStatus);
            });
        } else {
            console.error(' sdk 登录调用失败');
        }
    }

    /**
     * 支付
     * @param info 支付参数
     * {
        price: 600,
        order_id: '123tz123',
        goods_name: '商品',
        goods_desc: '商品描述',
        goods_id: 231,
        server_id: 1,
        server_name: '1服',
        buy_num: 1,
        role_id: 456,
        role_name: '角色名称',
        notify_url: 'https://www.baidu.com',
        extra: '透传参数',
        sign: 'md5字符串'
        }
     */
    public pay(info: object): void {
        if (window && window['TZSDK']) {
            window['TZSDK'].pay(info, (data) => {
                // 支付回调函数
                if (data.tag === 0) {
                    // 支付成功
                } else {
                    // 支付失败
                }
            });
        } else {
            console.error(' sdk 支付调用失败');
        }
    }

    /** 实名认证 */
    public realName(): void {
        if (window && window['TZSDK']) {
            window['TZSDK'].realName((data) => {
                // 实名认证成功回调函数
                if (data) {
                    // 实名认证成功，可获取实名后的实名认证状态
                    // data.realNameState为实名后的实名认证状态
                    // 取值为 0未实名, 1已实名未成年, 2已实名已成年
                }
            });
        } else {
            console.error(' sdk 实名认证调用失败');
        }
    }

    /** 埋点上报接口
     * @param info {
            button_id: 1,
            role_id: 12
            }
    */
    public reportData(info: object): void {
        if (window && window['TZSDK']) {
            window['TZSDK'].reportData(info);
        } else {
            console.error(' sdk 埋点上报调用失败');
        }
    }

    /**
     * 角色信息上报
     * @param info
     * {
            server_id: 1,
            server_name: '1313',
            create_role_time: 0,
            role_id: 1,
            role_nick: "仙魔",
            level: 10,
            vip_level: 8,
            has_gold: 1212,
            is_reg: 0
        }
     */
    public reportRoleInfo(info: object): void {
        if (window && window['TZSDK']) {
            window['TZSDK'].reportRoleInfo(info);
        } else {
            console.error(' sdk 角色信息上报调用失败');
        }
    }

    /** 打开健康游戏公告 */
    public showAgeTips(): void {
        console.log(' sdk 显示适龄提示');
        if (window && window['TZSDK']) {
            window['TZSDK'].openHealthTip();
        } else {
            console.error(' sdk 打开健康游戏公告调用失败');
        }
    }

    public exitLogin(): void {
        if (window && window['TZSDK'] && window['TZSDK'].exitLogin) {
            window['TZSDK'].exitLogin();
        } else {
            window.location.reload();
        }
    }
}
