import { sys } from 'cc';
import { EventM } from '../core/event/EventManager';
import { ServerMonitor } from '../common/ServerMonitor';
import GlobalConfig from '../config/GlobalConfig';
import LoginManager from '../ui/login/LoginManager';
import UtilsStorage from '../utils/UtilsStorage';
import UtilsTime from '../utils/UtilsTime';
import UtilsTimeout from '../utils/UtilsTimeout';
import GameProto from './GameProto';
import HttpManager from './HttpManager';

export class ReportManager {
    private static instance: ReportManager = null;
    public static get I (): ReportManager {
        if (!ReportManager.instance) {
            ReportManager.instance = new ReportManager();
            ReportManager.instance.init();
        }
        return ReportManager.instance;
    }

    private reportDelay = 2000;
    private pointList: Array<any> = [];

    private init () {
        EventM.I.on(EventM.Type.Socket.SocketOpen, this.onSocketOpen, this);
        EventM.I.on(EventM.Type.Socket.SocketError, this.onSocketError, this);
    }

    private finit () {
        EventM.I.off(EventM.Type.Socket.SocketOpen, this.onSocketOpen, this);
        EventM.I.off(EventM.Type.Socket.SocketError, this.onSocketError, this);
    }

    private onSocketOpen () {
        this.SendDelay(ReportManager.Type.SocketOpen);
    }

    private onSocketError () {
        this.SendDelay(ReportManager.Type.SocketError);
    }

    private sendPkg (data: any) {
        // 局域网不上报
        if (window && window.GlobalConfig && window.GlobalConfig.showLog) {
            return;
        }
        // const _this = this;
        if (this.pointList.length === 0) return;

        const list = [];
        for (let i = 0; i < this.pointList.length; i++) {
            list.push(this.pointList[i]);
        }
        // console.log('----r---', data);
        data.data = list;
        this.pointList.length = 0;
        HttpManager.I.postjson(GlobalConfig.BuryingpointUrl, data,
            (res) => { }, // 成功回调
            () => { // 失败回调
                console.error('__FILETER__上报失败，重试', data);
                // 重试
                if (!data.times) data.times = 1;
                if (data.times > 3) return;
                data.times++;
                this.sendPkg(data);
            });
    }

    // ios平台上报
    private sendiOSPkg (data: any) {
        // 局域网不上报
        if (window && window.GlobalConfig && window.GlobalConfig.showLog) {
            return;
        }
        // const _this = this;
        if (!data) return;
        this.pointList.length = 0;
        HttpManager.I.post(`${GlobalConfig.pingTaiUrl}/log/button/click`, data,
            (res) => { }, // 成功回调
            () => { // 失败回调
                console.error('__FILETER__上报失败，重试', data);
                // 重试
                if (!data.times) data.times = 1;
                if (data.times > 3) return;
                data.times++;
                this.sendiOSPkg(data);
            });
    }

    processData (delay = 0) {
        UtilsTimeout.I.setTimeout(() => {
            if (this.pointList.length > 0) {
                const userid = ServerMonitor.I.game_server.userId ? Number(ServerMonitor.I.game_server.userId) : 0;
                const uuid = UtilsStorage.getItem('sdk_uuid') || LoginManager.I.uuid || UtilsStorage.GetUUid();
                const data = { uuid, user_id: userid, cps_id: LoginManager.I.cps_id, data: this.pointList };
                // console.log('-report--', data);
                this.sendPkg(data);
            }
        }, delay);
    }

    Send (id: number) {
        this.pointList.push({ id, time: UtilsTime.NowS() });
        this.processData();
    }

    SendDelay (id: number) {
        this.pointList.push({ id, time: UtilsTime.NowS() });
        this.processData(this.reportDelay);
    }

    // iOS平台登录上报
    iOSSendDelay (id: number) {
        if (sys.os === sys.OS.IOS && sys.isNative) {
            const CC_SDK = window.Channel_SDK;
            const loginI = LoginManager.I;
            const data = {
                button_id: id,
                app_id: LoginManager.I.game_id,
                channel_id: LoginManager.I.channel_id,
                uuid: CC_SDK ? CC_SDK.params.uuid : '',
                user_id: LoginManager.I.user_id,
                role_id: LoginManager.I.user_id,
                click_time: UtilsTime.NowS(),
                phone_model: CC_SDK ? CC_SDK.params.phone_model : 'iphone',
                phone_ver: CC_SDK ? CC_SDK.params.sys_ver : '',
                platform: 'ios',
                system: 'ios',
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                version: `v${window.RunM ? window.RunM.path : '1'}`,
            };
            console.log('-report--', data);
            this.sendiOSPkg(data);
        } else {
            this.SendDelay(id);
        }
    }

    static Type = {
        getConfig_Info: 1, // 拉取配置信息
        getConig_InfSuc: 2, // 拉取配置信息成功
        getConig_InfFal: 3, // 拉取配置信息失败
        clk_phoneLog: 6, // 用户点击手机登陆
        clk_FGPwd: 7, // 用户点击忘记密码
        clk_AccReg: 8, // 用户点击账号注册
        clk_FastG: 9, // 用户点击快速游戏
        clk_WXLog: 10, // 用户点击微信登陆按钮
        clk_PLCode: 15, // 手机登陆获取验证码
        clk_PLCodeSuc: 16, // 手机登陆获取验证码成功
        clk_PLCodeFal: 17, // 手机登陆获取验证码失败
        send_Log: 30, // 发起登陆
        LogReg_Suc: 31, // 登陆注册成功
        LogReg_Fal: 32, // 登陆注册失败
        getUsrInfo: 40, // 获取用户信息
        getUsrInfoSuc: 41, // 获取用户信息成功
        getUsrInfoFal: 42, // 获取用户信息失败
        bindPH: 50, // 绑定手机
        bindPHSuc: 51, // 绑定手机成功
        bindPHFal: 52, // 绑定手机失败
        unBindPH: 54, // 解除绑定手机
        unBindPHSuc: 55, // 解除绑定手机成功
        unBindPHFal: 56, // 解除绑定手机失败
        RealNA: 57, // 实名认证
        RealNASuc: 58, // 实名认证成功
        RealNAFal: 59, // 实名认证失败
        G_News: 60, // 获取资讯列表
        G_NewsSuc: 61, // 获取资讯列表成功
        G_NewsFal: 62, // 获取资讯列表失败
        G_News_One: 63, // 获取单个资讯
        G_News_OneSuc: 64, // 获取单个资讯成功
        G_News_OneFal: 65, // 获取单个资讯失败
        G_GFList: 66, // 获取礼包列表
        G_GFListSuc: 67, // 获取礼包列表成功
        G_GFListFal: 68, // 获取礼包列表失败
        R_GF: 69, // 领取礼包
        R_GFSuc: 70, // 领取礼包成功
        R_GFFal: 71, // 领取礼包失败
        FPWD_One: 80, // 找回密码第一步，校验手机号是否绑定过账号
        FPWD_CKSuc: 81, // 校验成功，进入下一步
        FPWD_CKFal: 82, // 校验失败
        FPWD_Reset: 85, // 立即重置
        FPWD_ResetSuc: 86, // 重置成功
        FPWD_ResetFal: 87, // 重置失败
        G_ServList: 500, // 获取服务器列表，获取公告列表，同步进行
        G_ServListSuc: 501, // 获取服务器列表成功
        G_ServListFal: 502, // 获取服务器列表失败
        G_NoticSuc: 503, // 获取公告列表成功
        G_NoticFal: 504, // 获取公告列表失败
        clk_ChosseServ: 510, // 用户点击《点击选服》按钮
        clk_ChosseServLeft: 511, // 用户点击选服界面左侧《服务器分页按钮》
        clk_ChosseServRight: 512, // 用户点击选服界面右侧《单个服务器》按钮
        clk_StartGame: 550, // 用户点击《开始游戏》按钮
        clk_BtnNotic: 551, // 用户点击开始游戏界面《游戏公告》按钮
        clk_BtnKF: 552, // 用户点击开始游戏界面《游戏客服》按钮
        clk_BtnCHAcc: 553, // 用户点击开始游戏界面《切换账号》按钮

        ChongBang_getRwd: 4, // 冲榜返利 领取奖励
        MTask_Click: 5, // 点击主线任务
        BatResult_close: 14, // 关闭战斗结果UI

        Stage_AutoFgt: 39, // 自动闯关
        JJC_Fgt_Clk: 48, // 竞技场点击挑战
        Player_PvP_Fgt: 49, // 添加玩家信息中的调整按钮
        Reg_UILoad: 65, // 注册UI加载完成
        Notice_Clk: 72, // 点击公告
        Frient_Show_Clk: 94, // 好友系统 点击商场

        FnMenu_FuBen_Clk: 100, // 主界面菜单 点击副本
        FnMenu_KuaFu_Clk: 101, // 主界面菜单 点击跨服
        FnMenu_JinJi_Clk: 102, // 主界面菜单 点击竞技
        FnMenu_Daily_Clk: 103, // 主界面菜单 点击日常
        FnMenu_Boss_Clk: 104, // 主界面菜单 点击首领
        FnMenu_Shop_Clk: 108, // 主界面菜单 点击商店

        CDKey_Start: 206, // 激活码 Start
        CDKey_RedeemCode: 211, // 激活码 使用激活码

        GameStartOnLoad: 10000, // 进入游戏场景，开始初始化游戏主场景
        LoginViewStart3: 10008, // loginView预制加载成功
        GmMgr0: 10009, // GmMgr0 的loginStart方法开始执行
        Mpq0Loaded: 10010, // 第一个mpq文件0.txt加载完成
        LoadMainGame: 10020, // 开始加载主程序
        RootLoaded: 10030, // 第一个预制体root 加载完成
        RootLoadFailed: 10031, // 加载 预制体失败
        CreateRoleLoaded: 10040, // 进入角色创建页面（看到创角界面）
        CreateRoleFinished: 10050, // 创角界面中点击一下登录按钮           |<- 互斥
        CreateRoleAutoStart: 10051, // 创角完成 用户没有点击，自动进入的   |<- 互斥
        CreateRoleFinished1: 10060, // 用户account_id获取错误
        CreateRoleFinished2: 10070, // 用户token获取错误
        CreateRoleFinished4: 10080, // 用户昵称为空
        CreateRoleSexMale: 10081, // 用户 选择男
        CreateRoleSexFemale: 10082, // 用户 选择女
        CreateRoleGetNick: 10083, // 用户 随机一个昵称
        CreateRoleFinished5: 10090, // 用户服务器信息为空
        CreateRoleFinished6: 10100, // 服务器未开放
        CreateRoleFinished7: 10110, // 创角后返回信息错误
        CreateRoleFinishedEnd: 10120, // 创角返回信息成功

        LoadMpq: 10128, // 加载mpq
        LoadMpqSuc: 10129, // mpq加载全部完成
        LoadJsonConfig: 10130, // 开始加载文本素材配置
        LoadGameConfig: 10140, // 开始加载游戏数值表配置
        LoadMainUI: 10150, // 开始设置 网络事件监听、游戏内事件监听、基础组件挂载 等
        ResourceLoaded: 10160, // 资源加载完成         //异步
        EnterGame: 10161, // 加载完成， 关闭游戏登录加载界面，进入游戏 异步 同 10160
        // PlotStart: 10170,//新手剧情开始
        // // PlotSubtitle1: 10180,//新手剧情字幕1
        // PlotSubtitle2: 10190,//新手剧情字幕2
        // PlotCheckPoint1: 10200,//新手剧情关卡1
        // PlotSubtitle3: 10210,//新手剧情字幕3
        // // PlotSubtitle4: 10220,//新手剧情字幕4
        // PlotCheckPoint2: 10230,//新手剧情关卡2
        // // PlotSubtitle5: 10240,//新手剧情Boss战斗失败对话5
        // // PlotCheckPoint3: 10250,//新手剧情关卡3
        // // PlotSubtitle6: 10260,//新手剧情字幕6
        // // PlotSubtitle7: 10270,//新手剧情字幕7
        // PlotEnd: 10280,//新手剧情结束
        // PlotSkip: 10281,//新手剧情结束
        // PlotSkip1: 10282,//新手剧情结束
        EnterPopup: 10290, // 第一次进入游戏时弹出的“开始游戏”弹窗
        EnterPopupButton: 10300, // 第一次进入游戏时弹出的“开始游戏”弹窗
        ClickFirstPayPop: 10310, // 点击充值弹窗

        SocketOpen: 10400, // socket连接
        SocketError: 10410, // socket连接失败

        StartGameButton: 1112075, // 点击登录游戏按钮                     |<- 互斥
        AuthLogin: 1117070, // 用户已授权直接登录             微信
        AuthFailed: 1117071, // 用户已授权直接登录失败        微信
        AuthFailedRetry: 1117072, // 获取微信用户信息失败，重试  微信
        LoginSuccess: 1118001, // 注册服务器返回信息             微信
        LoginNewPlayer: 1118005, // 新用户
        LoginFailed: 1118002, // 注册失败，服务器回信息
        ServerUrlLoaded: 1117050, // 获取服务器地址config返回响应
        ServerClosed: 1117060, // 获取服务器信息失败
        SubPackageLoaded: 1117040, // 加载子包完成
        SubPackageLoadFailed: 1117041, // 加载子包失败
        LoadCreateRole: 1111001, // 开始加载创建角色页面
        LoginGainUI: 11110000, // 加载登录送大礼领VIP5界面
        LoginGainAward: 11110038, // 点击领取奖励按钮 （领取VIP5）
        //= ==========
        ServerUrlLoaded1: 1117050, // 获取服务器地址config
        ServerUrlLoaded2: 1117050, // 获取服务器地址config

        ServerClosed1: 1117060, // 获取服务器信息失败
        ServerClosed2: 1117060, // 获取服务器信息失败
        BeforeAuthRequest: 1117065, // 获取用户授权

        FrontendAuthLogin: 1117080, // 用户未授权服务器前置登录
        BackendAuthLogin: 1117090, // 用户未授权服务器后置登录
        ChannelServerLogin: 1117100, // 登录渠道服务器newLogin
        GameServerLogin: 1117110, // 登录后端服务器

        FailedRefresh: 1117130, // 失败重置登录界面

        // aaaa: 1,//新手礼包领取奖励
        // aaaa: 2,//成就形象展示弹窗确认
        // aaaa: 3,//成就形象展示弹窗三倍领取
        // aaaa: 4,//成就领奖
        // aaaa: 5,//战斗场景任务栏引导点击
        // aaaa: 6,//主角-装备界面一键换装
        // aaaa: 7,//主角 - 技能界面一键升级
        // aaaa: 8,//角色 - 坐骑界面自动升阶
        // aaaa: 9,//主角返回
        // aaaa: 10,//主角关闭
        // aaaa: 11,//挑战关卡界面挑战
        // aaaa: 12,//挑战关卡界面返回
        // aaaa: 13,//挑战关卡界面关闭
        // aaaa: 14,//战斗奖励弹窗领取奖励
        // aaaa: 15,//战斗奖励弹窗关闭
        // aaaa: 16,//宠物界面自动升级
        // aaaa: 17,//宠物界面返回
        // aaaa: 18,//宠物界面关闭
        // aaaa: 19,//锻造 - 强化界面一键强化
        // aaaa: 20,//锻造 - 强化界面强化大师
        // aaaa: 21,//锻造 - 精炼界面一键精炼
        // aaaa: 22,//锻造 - 精炼界面精炼大师
        // aaaa: 23,//锻造 - 锻炼界面一键锻炼
        // aaaa: 24,//锻造 - 锻炼界面锻炼大师
        // aaaa: 25,//锻造 - 宝石界面一件镶嵌
        // aaaa: 26,//锻造 - 宝石界面镶嵌大师
        // aaaa: 27,//锻造界面返回
        // aaaa: 28,//锻造界面关闭
        // aaaa: 29,//背包 - 装备界面熔炼
        // aaaa: 30,//背包 - 熔炼界面熔炼
        // aaaa: 31,//背包 - 熔炼界面返回
        // aaaa: 32,//背包 - 熔炼界面自动熔炼
        // aaaa: 33,//背包界面返回
        // aaaa: 34,//背包界面关闭
        // aaaa: 35,//世界地图东海湾图标
        // aaaa: 36,//成就弹窗领奖
        // aaaa: 37,//成就弹窗三倍领奖
        // aaaa: 38,//成就弹窗领奖（三倍）
        // aaaa: 39,//战斗场景自动战斗
        // aaaa: 40,//材料副本 - 坐骑副本挑战
        // aaaa: 41,//材料副本 - 坐骑副本返回
        // aaaa: 42,//首领 - 个人首领30级挑战
        // aaaa: 43,//首领 - 个人首领31级返回
        // aaaa: 44,//藏宝图挖宝
        // aaaa: 45,//藏宝图返回
        // aaaa: 46,//仙侣自动升级
        // aaaa: 47,//仙侣返回
        // aaaa: 48,//仙侣关闭
        // aaaa: 49,//竞技场1号位
        // aaaa: 50,//竞技场2号位
        // aaaa: 51,//竞技场3号位
        // aaaa: 52,//竞技场4号位
        // aaaa: 53,//竞技场5号位
        // aaaa: 54,//竞技场返回
        // aaaa: 55,//竞技场关闭
        // aaaa: 56,//日常 - 师门任务一键完成
        // aaaa: 57,//日常 - 师门任务领取任务
        // aaaa: 58,//日常 - 师门任务返回
        // aaaa: 59,//日常 - 师门任务关闭
        // aaaa: 60,//师门任务星级挑战
        // aaaa: 61,//登录界面微信登录
        // aaaa: 62,//登录界面QQ登录
        // aaaa: 63,//登录界面游客登录
        // aaaa: 64,//登录界面账号登录
        // aaaa: 65,//登录界面账号注册
        // aaaa: 66,//创建角色界面人
        // aaaa: 67,//创建角色界面仙
        // aaaa: 68,//创建角色界面魔
        // aaaa: 69,//创建角色界面男
        // aaaa: 70,//创建角色界面女
        // aaaa: 71,//创建角色界面骰子
        // aaaa: 72,//选择服务器界面公告
        // aaaa: 73,//选择服务器界面切换账号
        // aaaa: 74,//选择服务器界面点击选服
        // aaaa: 75,//选择服务器界面开始游戏
        // aaaa: 76,//主城 - 首充充值6元
        // aaaa: 77,//主城 - 首充充值30元
        // aaaa: 78,//主城 - 首充充值98元
        // aaaa: 79,//主城 - 首充充值198元
        // aaaa: 80,//主城 - 首充支付成功
        // aaaa: 81,//主城 - 月卡购买
        // aaaa: 82,//主城 - 日常 - 西游历练历练找回
        // aaaa: 83,//主城 - 日常 - 西游历练资源找回
        // aaaa: 84,//主城护送加倍
        // aaaa: 85,//取经东归 - 护送弹窗刷新品质
        // aaaa: 86,//取经东归 - 护送弹窗一键刷橙
        // aaaa: 87,//取经东归 - 护送弹窗护送
        // aaaa: 88,//取经东归快速完成
        // aaaa: 89,//充值界面充值6元
        // aaaa: 90,//充值界面充值30元
        // aaaa: 91,//充值界面充值98元
        // aaaa: 92,//充值界面充值198元
        // aaaa: 93,//VIP领取礼包
        // aaaa: 94,//好友界面友情商店
        // aaaa: 95,//友情商店购买
        // aaaa: 96,//红包界面发红包
        // aaaa: 97,//红包界面塞进红包
        // aaaa: 98,//主城好友
        // aaaa: 99,//主城冒险
        // aaaa: 100,//主城副本
        // aaaa: 101,//主城跨服
        // aaaa: 102,//主城竞技
        // aaaa: 103,//主城帮会
        // aaaa: 104,//主城首领
        // aaaa: 105,//主城师徒
        // aaaa: 106,//主城姻缘
        // aaaa: 107,//主城寄售行
        // aaaa: 108,//主城商店
        // aaaa: 109,//主城装备商店
        // aaaa: 110,//主城排行榜
        // aaaa: 111,//首领界面全民首领
        // aaaa: 112,//首领界面至尊首领
        // aaaa: 113,//全民首领购买（购买挑战次数）
        // aaaa: 114,//至尊首领挑战
        // aaaa: 115,//师徒界面威望商店
        // aaaa: 116,//姻缘界面求缘结缘
        // aaaa: 117,//寄售行界面邮寄
        // aaaa: 118,//商店界面仙玉
        // aaaa: 119,//商店界面元宝
        // aaaa: 120,//商店界面宝塔
        // aaaa: 121,//商店界面帮会
        // aaaa: 122,//商店界面竞技
        // aaaa: 123,//商店界面宠物
        // aaaa: 124,//商店界面仙侣
        // aaaa: 125,//商店界面装扮
        // aaaa: 126,//商店界面威望
        // aaaa: 127,//商店界面友情
        // aaaa: 128,//商店界面取经
        // aaaa: 129,//商店界面答题
        // aaaa: 130,//商店界面材料
        // aaaa: 131,//商店界面寻宝
        // aaaa: 132,//商店界面龙宫夺宝
        // aaaa: 133,//商店界面对应的购买
        // aaaa: 134,//装备商店获取材料
        // aaaa: 135,//装备商店物品商店
        // aaaa: 136,//装备商店40级橙装
        // aaaa: 137,//装备商店60级橙装
        // aaaa: 138,//装备商店80级橙装
        // aaaa: 139,//装备商店100级橙装
        // aaaa: 140,//装备商店120级橙装
        // aaaa: 141,//装备商店140级橙装
        // aaaa: 142,//装备商店160级橙装
        // aaaa: 143,//装备商店180级橙装
        // aaaa: 144,//装备商店200级橙装
        // aaaa: 145,//装备商店220级橙装
        // aaaa: 146,//装备商店240级橙装
        // aaaa: 147,//装备商店260级橙装
        // aaaa: 148,//装备商店280级橙装
        // aaaa: 149,//装备商店300级橙装
        // aaaa: 150,//离线收益界面激活月卡
        // aaaa: 151,//离线收益界面激活主角光环
        // aaaa: 152,//离线收益界面加倍领取
        // aaaa: 153,//主城 - 仙侣界面仙侣
        // aaaa: 154,//主城 - 仙侣界面升星
        // aaaa: 155,//主城 - 仙侣界面法阵
        // aaaa: 156,//主城 - 仙侣界面仙位
        // aaaa: 157,//主城 - 宠物宠物
        // aaaa: 158,//主城 - 宠物技能
        // aaaa: 159,//主城 - 宠物通灵
        // aaaa: 160,//主城 - 宠物兽魂
        // aaaa: 161,//主城 - 龙宫夺宝夺宝商店
        // aaaa: 162,//主城 - 龙宫夺宝1次
        // aaaa: 163,//主城 - 龙宫夺宝10次
        // aaaa: 164,//主城 - 龙宫夺宝50次
        // aaaa: 165,//主城 - 龙宫夺宝开始夺宝
        // aaaa: 166,//主城 - 龙宫夺宝确认购买
        // aaaa: 167,//主城 - 龙宫夺宝再次挑战
        // aaaa: 168,//主城 - 活动界面科举比赛
        // aaaa: 169,//主城 - 活动界面取经东归
        // aaaa: 170,//主城 - 活动界面帮会战
        // aaaa: 171,//主城 - 活动界面九重天
        // aaaa: 172,//活动 - 科举比赛科举商店
        // aaaa: 173,//活动 - 取经东归取经商店
        // aaaa: 174,//活动 - 帮会战排名奖励
        // aaaa: 175,//活动 - 九重天排行
        // aaaa: 176,//运营活动终身首充
        // aaaa: 177,//运营活动每日首充
        // aaaa: 178,//运营活动豪礼首充
        // aaaa: 179,//运营活动神兽降临
        // aaaa: 180,//运营活动投资计划
        // aaaa: 181,//运营活动成长基金
        // aaaa: 182,//运营活动0元礼包
        // aaaa: 183,//运营活动每日豪礼
        // aaaa: 184,//运营活动直升一阶
        // aaaa: 185,//运营活动开服活动
        // aaaa: 186,//运营活动寻宝
        // aaaa: 187,//运营活动神装寻宝
        // aaaa: 188,//运营活动降服神兽
        // aaaa: 189,//运营活动登录送元宝
        // aaaa: 190,//运营活动福利大厅
        // aaaa: 191,//运营活动特惠礼包
        // aaaa: 192,//寻宝界面购买10万银两（元宝）
        // aaaa: 193,//寻宝界面购买1万银两（仙玉）
        // aaaa: 194,//寻宝界面购买10万银两（仙玉）
        // aaaa: 195,//寻宝 - 购买提示确认
        // aaaa: 196,//寻宝 - 购买提示取消
        // aaaa: 197,//神装寻宝界面购买10万银两（元宝）
        // aaaa: 198,//神装寻宝界面购买1万银两（仙玉）
        // aaaa: 199,//神装寻宝界面购买10万银两（仙玉）
        // aaaa: 200,//神装寻宝 - 购买提示确认
        // aaaa: 201,//神装寻宝 - 购买提示取消
        // aaaa: 202,//降服神兽界面降服
        // aaaa: 203,//福利大厅每日签到
        // aaaa: 204,//福利大厅送百万元宝
        // aaaa: 205,//福利大厅等级礼包
        // aaaa: 206,//福利大厅激活码
        // aaaa: 207,//福利大厅摇钱树
        // aaaa: 208,//福利大厅主角光环
        // aaaa: 209,//福利大厅 - 送百万元宝领取
        // aaaa: 210,//福利大厅 - 等级礼包领取
        // aaaa: 211,//福利大厅 - 激活码领取
        // aaaa: 212,//福利大厅 - 摇钱树摇一摇
        // aaaa: 213,//福利大厅 - 摇钱树宝箱
        // aaaa: 214,//福利大厅 - 主角光环购买
        // aaaa: 215,//神装礼包界面礼包购买
        // aaaa: 216,//特惠礼包界面礼包购买
    }
}
