/*
 * @Author: hrd
 * @Date: 2022-07-25 16:20:50
 * @FilePath: \SanGuo2.4-main\assets\script\game\battle\util\UtilBattle.ts
 * @Description: 战斗工具类
 *
 */

import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import EntityBattle from '../../entity/EntityBattle';
import { MonsterType } from '../../entity/EntityConst';
import ModelMgr from '../../manager/ModelMgr';
import { BattleMgr } from '../BattleMgr';
import { WarPos } from '../WarConst';

export class UtilBattle {
    /** 屏幕中心坐标 */
    public static readonly SceneCentrePos = cc.v2(0, 0);
    /** 上方阵营中心坐标 */
    public static readonly UpCompCentrePos = cc.v2(-126, 246);
    /** 下方阵营中心坐标 */
    public static readonly DownCompCentrePos = cc.v2(110, -168);

    private static Instance: UtilBattle = null;
    public static get I(): UtilBattle {
        if (this.Instance == null) {
            this.Instance = new UtilBattle();
            this.Instance._init();
        }
        return this.Instance;
    }

    private _init() {
        //
    }

    /** 获取战斗常量 */
    public getFightConstCfg(key: string): Cfg_FightNormal {
        const configIndexer: ConfigIndexer = Config.Get(Config.Type.Cfg_FightNormal);
        const config: Cfg_FightNormal = configIndexer.getValueByKey(key);
        return config;
    }

    /** 获取战斗间隔时间 */
    public getFightAtkTime(key: string): number {
        const cfg = UtilBattle.I.getFightConstCfg(key);
        let time: number = 0;
        if (!cfg) {
            return time;
        }
        time = Number(cfg.FightValue);
        return time;
    }

    /** 获取站位配置 */
    private getPosCfg(posId: number): Cfg_FightPosition {
        let fightPos = 0;
        if (BattleMgr.I.curBattleType != null) {
            fightPos = Config.Get(ConfigConst.Cfg_FightScene).getValueByKey(BattleMgr.I.curBattleType, 'FightPos');
        }
        const cfg: Cfg_FightPosition = Config.Get(ConfigConst.Cfg_FightPosition).getValueByKey(fightPos, posId);
        return cfg;
    }

    /** 是否为上方阵营 */
    public isUpCamp(pos: number): boolean {
        const p = this.getPosCfg(pos);
        if (!p) return false;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (p.isUp === 1) return true;
        return false;
    }

    /**
     * 获取角色真实站位
     * @param unitPos 服务器下发站位 如果 unitPos > 100 为复合站位 需要求余
     * @returns
     */
    public getRealPos(unitPos: number): number {
        const p = unitPos % WarPos.SecondB;
        return p;
    }

    /**
     * 通过站位获取向量坐标
     * @param pos 站位id
     * @returns
     */
    public getPosVec2(pos: number): cc.Vec2 {
        const p = this.getPosCfg(pos);
        return cc.v2(p.Pos_x, p.Pos_y);
    }

    /**
     * 获取攻击目标坐标
     * @param tagPos 目标站位
     * @param ismult 是否为多人攻击
     * @returns
     */
    public getAtkPos(tagPos: number, ismult: boolean): cc.Vec2 {
        const pos = UtilBattle.I.getRealPos(tagPos);
        const p = UtilBattle.I.getPosVec2(pos);
        ismult = true;
        if (ismult) {
            const isUp = UtilBattle.I.isUpCamp(pos);
            if (!isUp) {
                p.x -= 76;
                p.y += 38;
            } else {
                p.x += 76;
                p.y -= 38;
            }
        }
        return p;
    }

    /**
     *
     * @param hitTimeStr 100|2000|
     */
    public getHitTimeList(hitTimeStr: string): number[] {
        if (!hitTimeStr) return [];

        const arr: number[] = [];
        const hitTimes = hitTimeStr.split('|');
        for (let i = 0; i < hitTimes.length; i++) {
            const time = hitTimes[i];
            arr.push(+time);
        }
        return arr;
    }

    /**
    * 深度拷贝
    * @param _data
    */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public copyDataHandler(obj: any): any {
        let newObj;
        if (obj instanceof Array) {
            newObj = [];
        } else if (obj instanceof Object) {
            newObj = {};
        } else {
            return obj;
        }
        const keys = Object.keys(obj);
        for (let i: number = 0, len = keys.length; i < len; i++) {
            const key = keys[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            newObj[key] = this.copyDataHandler(obj[key]);
        }
        return newObj;
    }

    /** 是否隐藏玩家自己 */
    public isHideEff(entity: EntityBattle): boolean {
        if (entity && entity.isSelfCamp) {
            // 玩家自己不隐藏
            return false;
        }
        // 其他玩家走配置
        let pbSkillEff: boolean = false;
        if (ModelMgr.I.SettingModel) {
            pbSkillEff = !ModelMgr.I.SettingModel.getSkillEff();
        }

        return pbSkillEff;
    }

    /** 获取战斗副本怪物缩放值 */
    public getMonsterScaleVal(fbType: number, monsterType: number): number {
        let _scale = 1;
        const cfg: Cfg_FightScene = Config.Get(ConfigConst.Cfg_FightScene).getValueByKey(fbType);
        if (monsterType === MonsterType.Boss) {
            if (cfg.BossBig) {
                _scale = cfg.BossBig / 100;
            }
        } else if (monsterType === MonsterType.Elite) {
            if (cfg.JingyingBig) {
                _scale = cfg.JingyingBig / 100;
            }
        } else if (monsterType === MonsterType.Normall) {
            if (cfg.XiaoguaiBig) {
                _scale = cfg.XiaoguaiBig / 100;
            }
        }
        return _scale;
    }

    public setNodeScale(node: cc.Node, scale: number): void {
        let _scaleX = node.scaleX;
        let _scaleY = node.scaleY;
        _scaleX = _scaleX < 0 ? 0 - scale : scale;
        _scaleY = _scaleY < 0 ? 0 - scale : scale;
        node.scaleX = _scaleX;
        node.scaleY = _scaleY;
    }
}
