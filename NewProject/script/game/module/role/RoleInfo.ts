import { UtilNum } from '../../../app/base/utils/UtilNum';
import { INickInfoConfig, NickShowType, UtilGame } from '../../base/utils/UtilGame';
import {
    RoleAttrData, RoleAttrDataA, RoleAttrDataB, RoleD,
} from './RoleD';
import { RoleMgr } from './RoleMgr';

/*
 * @Author: zs
 * @Date: 2022-05-18 15:47:02
 * @LastEditors: Please set LastEditors
 *
 */
export class RoleInfo {
    public constructor(data?: RoleAttrDataA);
    public constructor(data?: RoleAttrDataB);
    public constructor(data?: { A: IntAttr[], B: StrAttr[] });
    public constructor(data?: RoleAttrData) {
        if (data) {
            this._d = new RoleD(data);
        }
    }

    private _d: RoleD;
    public get d(): RoleD {
        if (!this._d) {
            this._d = new RoleD();
        }
        return this._d;
    }

    private _userID: number = 0;
    public get userID(): number {
        return this._userID || this.d.UserId;
    }
    public set userID(id: number) {
        this._userID = id;
    }

    public get FightValue(): string {
        const value = this.d.FightValue;
        return UtilNum.ConvertFightValue(value);
    }

    /** 获取昵称
     * 展示内容类型
     * rich 是否是富文本
     * isDark 颜色模式
     */
    public getAreaNick(showType: NickShowType, rich?: boolean, isDark?: boolean, nameLimitNum?: number): string {
        return RoleInfo.GetAreaNick(showType, this.d.Nick, this.d.ShowAreaId, {
            rich,
            isDark,
            isSelf: this.d.UserId === RoleMgr.I.info.userID,
            official: this.d.OfficeLevel,
            nameLimitNum,
        });
    }

    /**
     * 静态接口，获取昵称
     * @param showType 展示内容类型
     * @param name 名字
     * @param arenaId 区服id
     * @param official 官职等级
     * @param isDark 是否颜色模式
     * @param isSelf 是否自己
     * @param nameLimitNum 名字限制数量
     * @returns
     */
    // eslint-disable-next-line max-len, @typescript-eslint/no-unused-vars
    public static GetAreaNick(showType: NickShowType, name: string, arenaId: number, opts?: { rich?: boolean, official?: number, isDark?: boolean, isSelf?: boolean, nameLimitNum?: number }): string {
        if (opts?.nameLimitNum) {
            const num = name.length - opts.nameLimitNum;
            if (num > 0) {
                name = name.substring(0, opts.nameLimitNum);
                for (let i = 0; i < num; i++) {
                    name += '.';
                }
            }
        }
        const nickConf: INickInfoConfig = {
            name,
            arenaId,
            showType,
            official: opts?.official,
            isDark: opts?.isDark,
            isSelf: opts?.isSelf,
        };
        /** 改为富文本 */
        return UtilGame.FormatNick(nickConf, opts?.rich);
    }
}
