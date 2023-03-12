/*
 * @Author: hrd
 * @Date: 2022-04-15 18:53:51
 * @FilePath: \SanGuo-2.4-main\assets\script\login\LoginModel.ts
 * @Description:
 *
 */

import BaseModel from '../app/core/mvc/model/BaseModel';
import GameApp from '../game/base/GameApp';
import { i18n, Lang } from '../i18n/i18n';
import { IAreaInfo, IServerItem1 } from './LoginConst';

const { ccclass } = cc._decorator;
@ccclass('LoginModel')
export default class LoginModel extends BaseModel {
    /** 分组数量 */
    private _groupCount: number = 20;
    /** 区服列表信息 */
    private _AreaInfos: IAreaInfo[] = [];
    /** 账号id */
    public AccountID = 0;
    /** token */
    public Token = '';
    /** sdk 类型 */
    public sdktype: number = 0;
    /** 客户端版本号 */
    public client_version: string = '';
    /** 渠道id */
    public channel_id: string = '';
    public UserName: string = '';
    public UserPass: string = '';
    /** 当前选中ServerId */
    public selServerId: number = null;
    /** 当前选中角色ID */
    public selUserId: number = null;
    public sex: number = null;
    /** 最近登录服页签 */
    private LastPage: number = -1;
    public createRoleSucc: boolean = false; // 创角成功

    private _AreaInfoPage: { [page: number]: IAreaInfo[] } = [];
    /** 最新服 */
    private _newAreaInfo: IAreaInfo = null;

    public constructor() {
        super();
        this._initData();
    }

    private _initData() {
        // if (GameApp.I.isBanshuSDK()) {
        //     this.sdktype = 1; // todo 版署 sdktype为1, 这里先写死
        //     this.channel_id = '2'; // todo 版署 channel_id为2 , 这里先写死
        // }

        this.sdktype = GameApp.I.GameCfgGlobal.SDK_TYPE;
        this.channel_id = GameApp.I.GameCfgGlobal.Channel_Id;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public setData(v: any): void {
        this._AreaInfos = v;
        if (!this._AreaInfos || this._AreaInfos.length < 1) {
            this._AreaInfos = [];
            return;
        }

        this._AreaInfos.forEach((info: IAreaInfo) => {
            const page = Math.floor(info.area_id / this._groupCount);
            if (!this._AreaInfoPage[page]) {
                this._AreaInfoPage[page] = [];
            }
            this._AreaInfoPage[page].push(info);

            if (!this._newAreaInfo || this._newAreaInfo.area_id < info.area_id) {
                this._newAreaInfo = info;
            }

            if (info.user_id) { // 最近登录服
                if (!this._AreaInfoPage[this.LastPage]) {
                    this._AreaInfoPage[this.LastPage] = [];
                }
                this._AreaInfoPage[this.LastPage].push(info);
            }
        });

        // 最近近登录服排序
        if (this._AreaInfoPage[this.LastPage]) {
            this._AreaInfoPage[this.LastPage].sort((a, b) => {
                const n = a.logout_time || 0;
                const m = b.logout_time || 0;
                return m - n;
            });
        }
    }

    public getAreaInfos(): IAreaInfo[] {
        return this._AreaInfos;
    }

    /** 是否有角色数据 */
    public isHaveRole(): boolean {
        let _isHaveRole = false;
        const info = this.getLastLoginInfo();
        if (info && info.user_id) {
            _isHaveRole = true;
        }

        if (this.selUserId) {
            _isHaveRole = true;
        }

        return _isHaveRole;
    }

    /** 获取上次登录信息 */
    public getLastLoginInfo(): IAreaInfo {
        const arr = this.getLastInfos();
        let info: IAreaInfo = null;
        if (arr.length === 0) { // 最近登录服没有数据取新服
            info = this.getNewLoginInfo();
        } else {
            info = arr[0];
        }
        return info;
    }

    public getNewLoginInfo(): IAreaInfo {
        const info = this._newAreaInfo || null;
        return info;
    }

    public getLastSerName(): string {
        const info = this.getLastLoginInfo();
        if (!info) return '';
        this.selServerId = info.area_id;
        this.selUserId = info.user_id;
        return info.area_name;
    }

    public getNewSerName(): string {
        const info = this.getNewLoginInfo();
        if (!info) return '';
        return info.area_name;
    }

    /** 获取最近登录服数据 */
    public getLastInfos(): IAreaInfo[] {
        const arr: IAreaInfo[] = this._AreaInfoPage[this.LastPage];
        if (!arr) return [];
        return arr;
    }
    private _maxAreaId: number = null;
    public getMaxAreaId(): number {
        if (this._maxAreaId) return this._maxAreaId;
        let m = 0;
        for (let i = 0; i < this._AreaInfos.length; i++) {
            const info = this._AreaInfos[i];
            if (info.area_id > m) {
                m = info.area_id;
            }
        }
        this._maxAreaId = m;
        return this._maxAreaId;
    }

    /** 获取分页标签 */
    public getPageTitles(): IServerItem1[] {
        let arr: IServerItem1[] = [];
        const maxCount = this.getMaxAreaId();
        const groupCount = this._groupCount;
        if (maxCount / groupCount <= 1) {
            arr.push({
                labelText: `1-${groupCount}${i18n.tt(Lang.server_fu)}`,
                min: 1,
                max: groupCount,
                page: 0,
            });
        } else {
            const _sf: number = maxCount / groupCount;
            let _s = Math.floor(_sf); // 商
            const _y = maxCount % groupCount;// 余
            // 只要有余数，分页加1
            if (_y) {
                _s += 1;
            }
            for (let i = 0; i < _s; i++) {
                const _start = groupCount * i + 1;
                const _end = groupCount * (i + 1);
                const _page = i;
                if (!this._AreaInfoPage[_page]) {
                    continue;
                }
                const _o = {
                    labelText: `${_start}-${_end}${i18n.tt(Lang.server_fu)}`,
                    min: _start,
                    max: _end,
                    page: _page,
                };
                arr.push(_o);
            }
        }

        // 排序，最新的服务器在最上面
        // arr.sort((a, b) => b.page - a.page);

        const _recArg = [{
            labelText: `${i18n.tt(Lang.server_last_login)}`,
            page: this.LastPage,
        }];

        arr = [..._recArg, ...arr];

        return arr;
    }

    /** 获取分页数据 */
    public getPageInfo(page: number): IAreaInfo[] {
        const d = this._AreaInfoPage[page];
        if (!d) return [];
        return d;
    }

    public clearAll(): void {
        this._AreaInfos = [];
    }
}
