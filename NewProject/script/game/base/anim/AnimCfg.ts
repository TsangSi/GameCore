/*
 * @Author: kexd
 * @Date: 2022-04-24 11:51:31
 * @Description: 动画配置
 * @FilePath: \SanGuo2.4\assets\script\game\base\anim\AnimCfg.ts
 */

export enum ANIM_TYPE {
    ROLE = 'role',
    PET = 'pet',
    WEAPON = 'weapon',
    WING = 'wing',
    HORSE = 'horse',
    HORSE_HEAD = 'horseHead',
    SKILL = 'skill_effect',
    // 有新的动画类型就往下添加
}

export enum ACTION_TYPE {
    /** 正面展示 */
    UI = 'u',
    /** 界面展示的正面动作 */
    UI_SHOW = 'us',

    /** 武器、光翼、法宝等单个动画对象的单独展示 */
    View = 'v',

    /** 待机 */
    STAND = 's',
    /** 跑步 */
    RUN = 'r',
    /** 攻击 */
    ATTACK = 'a',
}

export enum ACTION_DIRECT {
    /** UI展示用的(使用的动画资源也会不同) */
    SHOW = -1,

    /** 以下是8个方向 */
    UP = 0,
    RIGHT_UP = 1,
    RIGHT = 2,
    RIGHT_DOWN = 3,
    DOWN = 4,
    LEFT_DOWN = 5,
    LEFT = 6,
    LEFT_UP = 7,
}

/**
 * 主要用于AnimBase的数据初始化的
 * 注意：不要加入 resAction 和 resDir
 */
export interface IAnimInfo {
    /** 动画资源id */
    resId?: number | string,
    /** 动画类型 */
    resType?: ANIM_TYPE,
    /** 是否是战斗的 */
    isFight?: boolean,
}

export enum EPlayState {
    /** 正常情况 */
    Normal = 0,

    /** 参数不对导致的失败返回 */
    ERR_ResId = 1,
    ERR_ResType = 2,
    ERR_ResAction = 3,
    ERR_ResDir = 4,

    /** 重复指令导致的返回 */
    EQU_ActionAndDir = 5,
    EQU_Action = 6,
    EQU_Dir = 7,

    /** 设置了不显示的返回 */
    Refuse = 8,
    /** 正在加载中的返回 */
    Loading = 9,
    /** 父节点已经被移除了的返回 */
    Isvalid = 10,
}

/**
 * 动画配置
 */
export default class AnimCfg {
    /** 地图上及UI展示中动画播放帧率 */
    public readonly ACTION_FRAMERATE: number = 8;
    /** 战斗中动画播放帧率 */
    public readonly ACTION_FRAMERATE_OTHER: number = 12;
    /** 动画播放加速倍率 */
    public SPEED: number = 0.75;
    /** 受击倒数第2帧 */
    public readonly SUFFER_ATTACK_FRAME: number = -2;
    /** 死亡倒数第1帧 */
    public readonly DEATH_FRAME: number = -1;

    private static _i: AnimCfg = null;
    public static get I(): AnimCfg {
        if (this._i == null) {
            this._i = new AnimCfg();
        }
        return this._i;
    }

    /** 游戏设置的数据 */
    public autoData: { [name: number]: number; } = {};

    public getActionName(direct: ACTION_DIRECT, type: ACTION_TYPE, editorActionName?: string): string {
        if (direct < 0) {
            if (editorActionName) {
                return `${type}_${editorActionName}`;
            } else {
                return `${type}`;
            }
        }
        if (direct >= ACTION_DIRECT.RIGHT && direct <= ACTION_DIRECT.LEFT) {
            if (editorActionName) {
                return `3${type}_${editorActionName}`;
            } else {
                return `3${type}`;
            }
        }
        if (editorActionName) {
            return `1${type}_${editorActionName}`;
        } else {
            return `1${type}`;
        }
    }

    public getActionResPath(resID: number | string, resType: ANIM_TYPE, resDirect: ACTION_DIRECT, resAction: ACTION_TYPE): string {
        let resTypeTemp = resType;
        if (resType === ANIM_TYPE.HORSE_HEAD) {
            resTypeTemp = ANIM_TYPE.HORSE;
        }
        let path: string = `action/${resTypeTemp}/action_${resID}/${resTypeTemp}${resID}_`;
        // if (resType === ANIM_TYPE.SKILL) {
        //     path = `action/${resTypeTemp}/action_${resID}/${'skill_effect'}${resID}_`;
        // }
        if (resDirect === ACTION_DIRECT.SHOW) {
            path += '';
        } else {
            path += resDirect;
        }

        path += resAction;

        if (resType === ANIM_TYPE.HORSE_HEAD) {
            path += '_h';
        }

        return path;
    }
}
