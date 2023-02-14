/* eslint-disable max-len */

/** AI状态 */
export const enum AIState {
    /** 待机中 */
    Stand,
    /** 挂机中 */
    HangUp,
    /** 访问NPC */
    AskNpc,
    /** 任务杀怪 */
    TaskMMonster,
}

export enum ACTION_ZINDEX {
    Precious = 0,
    Horse = 1,
    Win = 2,
    Role = 3,
    Body = 4,
    Weapon = 5,
    HorseHead = 6
}

/** 动作资源类型 */
export const enum ACTION_RES_TYPE {
    /** 地图武将 */
    MapRole = 'maprole',
    /** 战斗武将 */
    Role = 'role',
}

/** 动作8方向 */
export enum ACTION_DIRECT {
    /** 左下 */
    LEFT_DOWN = 1,
    /** 正下 */
    DOWN = 2,
    /** 右下 */
    RIGHT_DOWN = 3,
    /** 正左 */
    LEFT = 4,
    /** 正右 */
    RIGHT = 6,
    /** 左上 */
    LEFT_UP = 7,
    /** 正上 */
    UP = 8,
    /** 右上 */
    RIGHT_UP = 9,
}

/** 动作状态类型 */
export enum ACTION_STATUS_TYPE {
    /** 行走 */
    Run = 'r',
    /** 站立 */
    Stand = 's',
}

/** 动作配置解析处理 */
export default class ActionConfig {
    private static _I: ActionConfig = null;
    public static get I(): ActionConfig {
        if (this._I == null) {
            this._I = new ActionConfig();
        }
        return this._I;
    }

    /** 地图上及UI展示中动画播放帧率 */
    public readonly ACTION_FRAMERATE: number = 60 / 30;
    /** 战斗中动画播放帧率 */
    public readonly ACTION_FRAMERATE_OTHER: number = 60 / 12;
    /** 动画播放加速倍率 */
    public SPEED = 0.75;
    /** 受击倒数第2帧 */
    public readonly SUFFER_ATTACK_FRAME: number = -2;
    /** 死亡倒数第1帧 */
    public readonly DEATH_FRAME: number = -1;

    /** 根据方向和动作类型生成一个动作名字 */
    public makeActionName(direct: number, type: string): string {
        let actionName = '';
        switch (type) {
            case 'r':
                actionName = `${'run_'}${ACTION_DIRECT[direct]}`;
                break;
            case 's':
                actionName = `stand_${ACTION_DIRECT[direct]}`;
                break;
            default:
                break;
        }
        return actionName;
    }

    /** 获取某个模型的动作资源路径 */
    public getActionResPath(resID: number | string, resType: ACTION_RES_TYPE, resDirect: ACTION_DIRECT, status: ACTION_STATUS_TYPE): string {
        const resDir = this.getRealDir(resDirect);
        const path = `/action/${resType}/${resID}/${resType}${resID}_${resDir}${status}`;
        return path;
    }

    /**
     * 获取真正的资源方向
     * @param dir 方向
     * @returns
     */
    public getRealDir(dir: ACTION_DIRECT): ACTION_DIRECT {
        if (dir === ACTION_DIRECT.LEFT_DOWN) {
            return ACTION_DIRECT.RIGHT_DOWN;
        } else if (dir === ACTION_DIRECT.LEFT) {
            return ACTION_DIRECT.RIGHT;
        } else if (dir === ACTION_DIRECT.LEFT_UP) {
            return ACTION_DIRECT.RIGHT_UP;
        }
        return dir;
    }
    private getTablePetAnimID(skinID: number) {
        return skinID;
    }
}
