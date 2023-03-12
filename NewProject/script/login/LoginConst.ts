/*
 * @Author: hrd
 * @Date: 2022-04-18 12:27:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-26 10:31:38
 * @FilePath: \SanGuo2.4\assets\script\login\LoginConst.ts
 * @Description:
 */

export enum LoginHttpApi {
    /** 注册 */
    Register = '/api/register',
    /** 登陆 */
    Login = '/api/login',
    /** 创角 */
    Createrole = '/api/createrole',
    /** 获得随机昵称 */
    Getrandnick = '/api/getrandnick',
    /** 获取配置 */
    Getconfig = '/api/getconfig',
    /** 获取公告 */
    Getnotice = '/api/getnotice',
    /** 获取网关地址 */
    Getgateaddr = '/api/getgateaddr',
}

export enum RealName {
    /** 请求实名认证 */
    ReqRealName = '/api/uploadrealname',
}

export interface IAreaInfo {
    /** 区Id */
    area_id: number;
    /** 区名 */
    area_name: string;
    /** 展示Id */
    show_id: number;
    /** 状态(1新服 2火爆 3维护) */
    state: number;
    /** 角色ID */
    user_id: number;
    /** 角色名字 */
    nick: string;
    /** 角色等级 */
    level: number;
    /** 角色头像资源 */
    head_icon_res: number;
    /** 角色头像框资源 */
    head_frame_res: string;
    /** 下线时间 */
    logout_time: number;
}

export interface IServerItem1 {
    /** 标题 */
    labelText: string,
    /** 开始区段 */
    min?: number,
    /** 结束区段 */
    max?: number,
    /** 页签id */
    page: number,
}

/** 账号状态 */
export enum ACC_STATE_ENUM {
    /** 已注册 */
    completed = 1,
    /** 未完成 */
    NoCompleted = 2,

}
