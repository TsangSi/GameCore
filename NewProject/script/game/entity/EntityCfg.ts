/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ANIM_TYPE } from '../base/anim/AnimCfg';
import { Config } from '../base/config/Config';
import { ConfigConst } from '../base/config/ConfigConst';
import { FuncId } from '../const/FuncConst';
import { RoleInfo } from '../module/role/RoleInfo';
import { EntityUnitType, IEntitySkin } from './EntityConst';
import { ESex } from '../const/GameConst';
import ModelMgr from '../manager/ModelMgr';
import { GeneralRarity, GeneralTitle, GeneralMsg } from '../module/general/GeneralConst';
import { ConfigGeneralSkinIndexer } from '../base/config/indexer/ConfigGeneralSkinIndexer';
import { ERoleSkinPageIndex, ESkinPartIndex } from '../module/roleskin/v/RoleSkinConst';

/*
 * @Author: kexd
 * @Date: 2022-05-19 15:33:45
 * @FilePath: \SanGuo\assets\script\game\entity\EntityCfg.ts
 * @Description: 主要用于获取模型皮肤需要用到的数据
 *
 */
export default class EntityCfg {
    private static _i: EntityCfg = null;
    public static get I(): EntityCfg {
        if (this._i == null) {
            this._i = new EntityCfg();
        }
        return this._i;
    }

    /** 玩家没有皮肤id的时候读取角色表的初始皮肤资源 */
    public roleInitSkin(sex: number, isHorse: boolean = false): number {
        const cfg: Cfg_Job = Config.Get(Config.Type.Cfg_Job).getValueByKey(sex);
        if (cfg) {
            const ids: string[] = cfg.AnimID.split('|');
            return isHorse ? +ids[1] : +ids[0];
        }
        return sex === ESex.Male ? isHorse ? 10003 : 10001 : isHorse ? 10004 : 10002;
    }

    /**
     * 获取主角初始时装
     * @param isHorse 是否要拿在坐骑上的资源
     * @param playerSkin RoleMD属性PlayerSkin的值
     * @param sex 性别
     * @returns
     */
    public getRoleInitSkinId(isHorse: boolean, playerSkin: number, sex: ESex): number {
        if (playerSkin > 0) {
            return this.getSkinAnimID(playerSkin, sex);
        }
        return this.roleInitSkin(sex, isHorse);
    }

    /**
     * 玩家没有武器id的时候读取角色表的初始武器资源
     * @param sex
     * @returns
     */
    public roleInitWeapon(sex: number): number {
        const cfg: Cfg_Job = Config.Get(Config.Type.Cfg_Job).getValueByKey(sex);
        if (cfg) {
            return cfg.WeaponID;
        }
        return sex === ESex.Male ? 50001 : 50002;
    }

    /**
    * 获取皮肤ID
    * @param idStr: 皮肤ID字符串
    * @param sex: 性别 男1女2
    */
    public getSkinId(idStr: string, sex: number): number {
        if (typeof idStr === 'number') return idStr;
        if (idStr.indexOf('|') === -1) return Number(idStr);
        const animArr = idStr.split('|');
        return Number(sex === ESex.Male ? animArr[0] : animArr[1]);
    }

    /**
     * 时装皮肤表 获取皮肤资源id
     * @param skinID 皮肤id
     * @param sex 性别 男1女2
     * @returns
     */
    public getSkinAnimID(skinID: number, sex: number): number {
        if (!skinID) {
            return 0;
        }
        const skinData: Cfg_RoleSkin = Config.Get(Config.Type.Cfg_RoleSkin).getValueByKey(skinID);
        if (skinData) {
            return this.getSkinId(skinData.AnimId, sex);
        }
        return 0;
    }

    /**
     * 进阶皮肤表 获取皮肤资源id
     * @param gradeId 进阶id
     * @returns
     */
    public getGradeAnimId(gradeId: number): number {
        if (!gradeId) {
            return 0;
        }
        const skinData: Cfg_GradeSkin = Config.Get(Config.Type.Cfg_GradeSkin).getValueByKey(gradeId);
        if (skinData) {
            return +skinData.AnimId;
        }
        return 0;
    }

    /**
     * 获取武器资源id
     * @param gradeId 武器进阶id
     * @param sex 性别
     * @param GradeHorse 因为人物时装10001和10002是不在坐骑上的，已经画了武器在动画里了。所以额外加了条件：GradeHorse（坐骑幻化id）
     * @returns
     */
    public getWeaponAnimId(gradeId: number, sex: number, GradeHorse: number): number {
        let resId = this.getGradeAnimId(gradeId);
        if (!resId && GradeHorse) {
            resId = this.roleInitWeapon(sex);
        }
        return resId;
    }

    /** 根据功能id获取动画类型 */
    public getResTypeByFuncId(funcId: number): ANIM_TYPE {
        let resType: ANIM_TYPE = ANIM_TYPE.ROLE;
        switch (funcId) {
            case FuncId.Horse:// 坐骑
                resType = ANIM_TYPE.HORSE;
                break;
            case FuncId.Wing:// 羽翼
                resType = ANIM_TYPE.WING;
                break;
            case FuncId.Weapon:// 武器
                resType = ANIM_TYPE.WEAPON;
                break;
            case FuncId.Skin:// 时装
                resType = ANIM_TYPE.ROLE;
                break;
            // 有新类型就往下继续补充
            default:
                break;
        }
        return resType;
    }

    /** 根据部位index获取动画类型 */
    public getResByIndex(idx: number): ANIM_TYPE {
        return [ANIM_TYPE.ROLE, ANIM_TYPE.HORSE, ANIM_TYPE.WING, ANIM_TYPE.WEAPON][idx];
    }

    /** 获取套装的时装、坐骑、羽翼、武器资源id */
    public getSuitRes(suitId: number, sex: number): IEntitySkin {
        const roleData: IEntitySkin = {
            bodyResID: 0, weaponResID: 0, horseResID: 0, wingResID: 0, titleResID: 0,
        };
        const cfgSuit: Cfg_SkinSuit = Config.Get(ConfigConst.Cfg_SkinSuit).getValueByKey(suitId);
        if (cfgSuit && cfgSuit.Type === ERoleSkinPageIndex.SkinSuit) {
            const ids = cfgSuit.SkinRequire.split('|');
            roleData.bodyResID = this.getSkinAnimID(+ids[0], sex);
            roleData.horseResID = this.getGradeAnimId(+ids[1]);
            roleData.wingResID = this.getGradeAnimId(+ids[2]);
            roleData.weaponResID = this.getGradeAnimId(+ids[3]);
        } else if (cfgSuit && (cfgSuit.Type === ERoleSkinPageIndex.SpecialSuit || cfgSuit.Type === ERoleSkinPageIndex.ActitySuit)) {
            const ids = cfgSuit.SkinRequire.split('|');
            roleData.bodyResID = this.getSkinAnimID(+ids[0], sex);
            roleData.horseResID = this.getSkinAnimID(+ids[1], sex);
            roleData.wingResID = this.getSkinAnimID(+ids[2], sex);
            roleData.weaponResID = this.getSkinAnimID(+ids[3], sex);
        } else {
            console.log('时装套装新增了类型 需要程序处理');
        }
        return roleData;
    }

    /** 获取主玩家其他出战单位的资源id */
    public getFollowerSkinResId(unitType: EntityUnitType = null): IEntitySkin[] {
        const followerData: IEntitySkin[] = [];

        // 出战的武将
        if (unitType === EntityUnitType.General) {
            const generalLineup: LineupUnit[] = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.General);
            if (generalLineup && generalLineup.length > 0) {
                for (let i = 0; i < generalLineup.length; i++) {
                    const msg: GeneralMsg = ModelMgr.I.GeneralModel.generalData(generalLineup[i].OnlyId);
                    let resId: string = '';
                    if (msg.generalData.SkinId) {
                        const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
                        resId = `${indexer.getSkinData(msg.generalData.SkinId).AnimId}`;
                    } else {
                        resId = ModelMgr.I.GeneralModel.getGeneralRes(generalLineup[i].OnlyId);
                    }

                    followerData.push({
                        id: msg.generalData.IId,
                        unitType,
                        pos: generalLineup[i].Pos,
                        bodyResID: resId,
                    });
                }
            }
        }

        return followerData;
    }

    /**
     *
     * @param id 武将id
     * @param title 武将头衔（觉醒等级）非名将是123，名将是456
     * @param isHead 是否获取头像
     * @returns
     */
    public getGeneralResId(id: number, title: GeneralTitle = GeneralTitle.Title1, isHead: boolean = false): number {
        const cfg: Cfg_General = Config.Get(Config.Type.Cfg_General).getValueByKey(id);
        if (!cfg) { return 0; }
        if (cfg.Rarity === GeneralRarity.Rarity5 && title < GeneralTitle.Title4) {
            title = GeneralTitle.Title4;
        }
        if (title > 3) {
            title -= 3;
        } else if (title < GeneralTitle.Title1) {
            title = GeneralTitle.Title1;
        }

        if (isHead) {
            return +cfg.RebornPetHeadIcon.split('|')[0]; // [title - 1]; //备注：和策划对了一下这里的只需要读第一个2022.11.1
        } else {
            return +cfg.AnimId.split('|')[0]; // [title - 1]; //备注：和策划对了一下这里的只需要读第一个2022.11.1
        }
    }

    /**
     * 根据武将皮肤id获取其动画资源id
     * @param skinId
     */
    public getGeneralSkinResId(skinId: number): number {
        const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
        return indexer.getSkinData(skinId).AnimId;
    }

    /**
     * 根据玩家属性数据获取应展示的模型资源
     * @param data
     * @returns
     */
    public getRoleSkinResID(data: RoleInfo | { A: IntAttr[], B: StrAttr[]; } = null): IEntitySkin {
        const roleData: IEntitySkin = {
            bodyResID: 0, weaponResID: 0, horseResID: 0, wingResID: 0, titleResID: 0,
        };

        let roleInfo: RoleInfo;
        if (data instanceof RoleInfo) {
            roleInfo = data;
        } else {
            roleInfo = new RoleInfo(data);
        }

        const sex = roleInfo.d.Sex;

        // 时装
        if (roleInfo.d.PlayerSkin) {
            roleData.bodyResID = this.getSkinAnimID(roleInfo.d.PlayerSkin, sex);
        }
        // 取不到时装就拿配置的初始时装
        if (!roleData.bodyResID) {
            roleData.bodyResID = this.getRoleInitSkinId(!!roleInfo.d.GradeHorse, roleInfo.d.PlayerSkin, sex);
        }

        let isSpecialSuit: boolean = false;
        let cfg: Cfg_SkinSuit = null;
        if (roleInfo.d.GradeSuitId) {
            const indexer = Config.Get(ConfigConst.Cfg_SkinSuit);
            cfg = indexer.getValueByKey(roleInfo.d.GradeSuitId);
            if (cfg.Type === ERoleSkinPageIndex.SpecialSuit || cfg.Type === ERoleSkinPageIndex.ActitySuit) {
                isSpecialSuit = true;
            }
        }

        if (isSpecialSuit) {
            const ids = cfg.SkinRequire.split('|');

            roleData.bodyResID = this.getSkinAnimID(+ids[0], sex);
            roleData.horseResID = this.getSkinAnimID(+ids[1], sex);
            roleData.wingResID = this.getSkinAnimID(+ids[2], sex);
            roleData.weaponResID = this.getSkinAnimID(+ids[3], sex);
        } else {
            // 坐骑
            roleData.horseResID = this.getGradeAnimId(roleInfo.d.GradeHorse);
            // 武器
            roleData.weaponResID = this.getWeaponAnimId(roleInfo.d.GradeWeapon, sex, roleInfo.d.GradeHorse);
            // 羽翼
            roleData.wingResID = this.getGradeAnimId(roleInfo.d.GradeWing);
        }

        // 称号
        roleData.titleResID = roleInfo.d.Title;

        return roleData;
    }

    /**
     * 获取怪物皮肤id
     * @param monsterId 怪物id
     * @returns
     */
    public getMonsterSkinResId(monsterId: number): number {
        const cfg: Cfg_Monster = Config.Get(Config.Type.Cfg_Monster).getValueByKey(monsterId);
        if (!cfg) {
            return null;
        }
        return cfg.AnimId;
    }

    /**
     * 获取怪物类型
     * @param monsterId 怪物id
     * @returns MonsterType
     */
    public getMonsterType(monsterId: number): number {
        const cfg: Cfg_Monster = Config.Get(Config.Type.Cfg_Monster).getValueByKey(monsterId);
        if (!cfg) {
            return null;
        }
        return cfg.MonsterType;
    }

    /**
     * 获取红颜皮肤id
     * @param beautyId 红颜id
     * @returns
     */
    public getBeautySkinResId(beautyId: number): number {
        const animId: number = Config.Get(Config.Type.Cfg_Beauty).getValueByKey(beautyId, 'AnimId');
        if (!animId) {
            return null;
        }
        return animId;
    }
}
