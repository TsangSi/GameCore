/*
 * @Author: myl
 * @Date: 2022-07-29 09:57:25
 * @Description:
 */

export class NoticeMsg {
    public cfg: Cfg_Notice = null;
    public msg: string = null;
    public SendTime: number = null;
    public constructor(cfg: Cfg_Notice, msg: string, SendTime: number) {
        this.cfg = cfg;
        this.msg = msg;
        this.SendTime = SendTime;
    }
}
/** 整个聊天数据缓存的数据格式 data :服务端数据  state:是否已经已读 */
export type ChatStoreData = { [k: string]: { data: ChatData | NoticeMsg, state: boolean } };

/** 聊天频道 */
export enum CHAT_CHANNEL_ENUM {
    /** 综合 */
    All = 0,
    /** 世家 */
    Current = 1,
    /** 系统 */
    Sys = 2,
    /** 连服世界频道 */
    World = 3,
    /** 黑名单 */
    BlackList = 4,
    /** 军团 */
    Regiment = 5,
}

/** 表情类型 */
export enum CHAT_EMOJT_TYPE {
    /** 普通 */
    Normal = 0,
    /** vip表情 */
    Vip = 1,
    /** 月卡表情 */
    Mouth = 2,
    /** 光环表情 */
    Sunshine = 3
}

/** 聊天item样式 */
export enum CHAT_ITEM_STYLE_ENUM {
    /** 聊天信息 */
    World = 1,
    /** 系统发言 */
    Sys = 2,
}

/** 展示的物品类型 */
export enum ChatShowItemType {
    /** 文字 */
    text = 0,
    /** 物品 */
    default = 1,
    /** 武将 */
    pet = 2,
    /** 官印 */
    seal = 3,
    /** 虎符 */
    amulet = 4,
    /** 称号 */
    title = 5,
    /** 红颜 */
    beauty = 6,
    /** 组队 */
    team = 7,
    /** 博物志-插画 */
    plot = 8,
}

/** 聊天中通过该枚举 获取到相应的物品id */
export enum ChatItemObjKey {
    /** 物品 */
    default = 12501,
    /** 武将 */
    pet = 12502,
    /** 官印 */
    seal = 12503,
    /** 虎符 */
    amulet = 12504,
    /** c称号 */
    title = 12505,
    /** 红颜 */
    beauty = 12506,
    /** 组队 */
    team = 12507,
    /** 博物志-插画 */
    plot = 12508,
}

/** 系统消息格式化行高 减少计算 */
export const CHAT_SYS_ITEM_HEIGHT_CONFIG = {
    0: 0,
    1: 36.5,
    2: 61.5,
    3: 86.5,
    4: 111.5,
};

/** 普通聊天消息 格式化行高 减少计算 */
export const CHAT_DEFAULT_ITEM_HEIGHT_CONFIG = {
    0: 120,
    1: 120,
    2: 120,
    3: 120,
};

/** 富文本的配置信息 请与预制体富文本的信息保持一致 */
export const CHAT_RICH_NORMAL_CONFIG = {
    fSize: 22,
    maxWidth: 440,
    lineHeight: 30,
    emojiWidth: 35,
    tipImgWidth: 0,
    richString: '',
};

export const CHAT_RICH_SYS_CONFIG = {
    fSize: 22,
    maxWidth: 650,
    lineHeight: 25,
    emojiWidth: 35,
    tipImgWidth: 58,
    richString: '',
};

/** 显示范围 */
export enum ChatShowRang {
    /** 跑马灯 */
    Marquee = '1',
    /** 场景跑马灯 */
    ActMarquee = '2',
    /** 综合频道 */
    All = '10001',
    /** 世界频道 */
    World = '10002',
    /** 世家频道 */
    Current = '10003',
    /** 系统频道 */
    Sys10001 = '10004',

}

/** 额外参数常量枚举 */
export enum EChatExt {
    /** 运输船 */
    Car = 1,
    /** 华容道 */
    Huarongdao = 2,
    /** 待添加 */
}

export interface IChatCommonData {
    /** 界面标识 */
    id: string,
    /** 可移动范围 */
    moveContent: cc.Rect,
    /** 坐标(记录存在则取记录内的坐标) */
    pos: cc.Vec3,
}
