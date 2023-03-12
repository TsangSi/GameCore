/* eslint-disable semi */
/* eslint-disable dot-notation */
/*
 * @Author: hrd
 * @Date: 2022-04-18 18:56:41
 * @LastEditors: Please set LastEditors
 * @FilePath: \SanGuo\assets\script\game\base\GameApp.ts
 * @Description:
 *
 */

import { UtilPaltform } from '../../app/base/utils/UtilPaltform';
import { UtilUrl } from '../../app/base/utils/UtilUrl';
import { SdkMgr } from '../../platformSdk/SdkMgr';
import { GameBranchVer } from '../const/GameConst';

export interface IGameCfgGlobal {
    /** 分支 */
    Branch: string;
    /** 运行状态 0 dev 1线上 ... */
    Run_State: number;
    /** 资源版本号 */
    GAME_RES_VER: string;
    /** 客户端版本号 */
    Client_Version: string;
    /** 渠道id */
    Channel_Id: string;
    /** 登录Api url */
    Login_Http_Uri: string;
    /** 资源服根路径 */
    Res_Root_Url: string;
    Res_Root_Url_List: string[];
    /** 是否接入SDK 登录 */
    IS_SDK: number;
    /** sdk 类型 */
    SDK_TYPE: number;
    /** 配置版本 */
    CFG_VER: string;
    /** 协议版本 */
    PROTO_VER: string;
    /** 资源根目录 */
    RES_DIR: string;
}

export default class GameApp {
    private static Instance: GameApp;
    public static get I(): GameApp {
        if (!this.Instance) {
            this.Instance = new GameApp();
        }
        return this.Instance;
    }

    /** debug 环境 */
    public debug = false;
    /** 1白名单 */
    public IsWhite = 0; // 1白名单
    /** 网关路径 */
    public _GateUrl = ''; // 网关路径
    /** 资源服根路径 */
    public _ResRootUrl = '';
    /** 资源路径 */
    private _ResUrl = '';
    /** 协议文件路径 */
    private _ProtoMsgUrl = '';
    /** 资源md5文件路径 */
    private _ResMD5Url = '';
    /** 登录Api url */
    private _LoginHttpUri = '';
    /** 运行状态 0 dev 1线上 ... */
    public RunState: number = 0;
    /** 版署 外网 */
    public IsBanShu: boolean = false;
    /** 角色预制 */
    // public PlayerPrefab: Prefab = null;
    // public NetConfirmBox: Prefab = null;
    // public MsgToast: Prefab = null;
    /** 是否战斗中 */
    public IsBattleIng: boolean = false;

    private isWxGame = UtilPaltform.isWeChatGame;
    /** 实名认证状态 0未实名， 1已实名未成年，2已实名已成年 */
    public RealNameState: number = 0;

    /** 游戏基础配置 */
    private _GameCfgGlobal: IGameCfgGlobal = window['GameCfgGlobal'];

    public get GameCfgGlobal(): IGameCfgGlobal {
        if (!window['GameCfgGlobal']) {
            this._GameCfgGlobal = {
                /** 分支 */
                Branch: 'dev-local',
                /** 运行状态 0 dev 1线上 ... */
                Run_State: 0,
                /** 资源版本号 */
                GAME_RES_VER: '',
                /** 客户端版本号 */
                Client_Version: '',
                /** 渠道id */
                Channel_Id: '',
                /** 登录Api url */
                Login_Http_Uri: 'http://dev-hl3-login.kaixinxiyou.com',
                // Login_Http_Uri: 'http://172.27.0.4:12001',
                /** 资源服根路径 */
                Res_Root_Url: 'http://dev-hl3-client.kaixinxiyou.com',
                Res_Root_Url_List: [],
                /** 是否接入SDK 登录 */
                IS_SDK: 0,
                /** sdk 类型 */
                SDK_TYPE: 0,
                /** 配置版本 */
                CFG_VER: 'main',
                /** 协议版本 */
                PROTO_VER: 'main',
                /** 资源根目录 */
                RES_DIR: 'res_dev', // res_release_md5
            };
            const cfgVer = UtilUrl.getQueryString('cfgVer');
            if (cfgVer) {
                this._GameCfgGlobal.CFG_VER = cfgVer;
            }

            const protoVer = UtilUrl.getQueryString('protoVer');
            if (protoVer) {
                this._GameCfgGlobal.PROTO_VER = protoVer;
            }
            // console.log('====GameCfgGlobal=======222222222222222======');
        } else {
            // console.log('====GameCfgGlobal=======111111111111111======');
            this._GameCfgGlobal = window['GameCfgGlobal'];
        }
        return this._GameCfgGlobal;
    }

    /** 运行状态 0 dev 1线上 */
    public initRunState(): void {
        this.RunState = this.GameCfgGlobal.Run_State;
    }

    /** 获取游戏资源版本号 */
    public getGameVersion(): string | undefined {
        const ver = this.GameCfgGlobal.GAME_RES_VER;
        return ver;
    }

    public get GateUrl(): string {
        this._GateUrl = UtilUrl.replaceWss(this._GateUrl);
        return this._GateUrl;
    }

    public set GateUrl(v: string) {
        this._GateUrl = UtilUrl.replaceWss(v);
    }

    /** 资源根 */
    public get ResRootUrl(): string {
        this._ResRootUrl = this.GameCfgGlobal.Res_Root_Url;
        this._ResRootUrl = UtilUrl.replaceHttpHead(this._ResRootUrl);
        return this._ResRootUrl;
    }
    /** 外层目录 res_dev 或者res_release_md5 */
    public ResDirUrl(): string {
        const url = `${this.ResRootUrl}/${this.GameCfgGlobal.RES_DIR}`;
        return url;
    }

    /** 资源目录 */
    public get ResUrl(): string {
        const pathUrl = this.ResDirUrl();
        this._ResUrl = `${pathUrl}/resources`;
        return this._ResUrl;
    }

    /** 获取配置路径 */
    public getConfigUrl(idx: number): string {
        const cfgVer = this.GameCfgGlobal.CFG_VER;
        const _str = `/config/${cfgVer}/cfg_${idx}_data.txt`;
        return _str;
    }

    /** 协议路径 */
    public get ProtoMsgUrl(): string {
        if (!this._ProtoMsgUrl) {
            const url = this.ResDirUrl();
            const prottVer = this.GameCfgGlobal.PROTO_VER;
            this._ProtoMsgUrl = `${url}/proto/${prottVer}`;
        }
        return this._ProtoMsgUrl;
    }

    /** MD5 */
    public get ResMD5Url(): string {
        if (!this._ResMD5Url) {
            const url = this.ResDirUrl();
            this._ResMD5Url = `${url}/resmd5`;
        }
        return this._ResMD5Url;
    }

    public get LoginHttpUri(): string {
        this._LoginHttpUri = this.GameCfgGlobal.Login_Http_Uri;
        this._LoginHttpUri = UtilUrl.replaceHttpHead(this._LoginHttpUri);
        return this._LoginHttpUri;
    }

    /** 退出游戏 */
    public exitGame(): void {
        // 退出游戏
        if (GameApp.I.isOpenSDK()) {
            SdkMgr.I.exitLogin();
        } else {
            window.location.reload();
        }
    }

    /** 是否接入sdk */
    public isOpenSDK(): boolean {
        const isSdk = this.GameCfgGlobal.IS_SDK;
        if (isSdk) return true;
        return false;
    }

    /** 是否为版署版本 */
    public isBanshu(): boolean {
        // return true
        const branch = this.GameCfgGlobal.Branch;
        if (branch === GameBranchVer.BanShu) return true;
        return false;
    }
}
