import {
    ACTION_TYPE, ANIM_TYPE, ACTION_DIRECT,
} from '../base/anim/AnimCfg';
import { IEntitySkin } from './EntityConst';
import { EntityRole } from './EntityRole';
import { RoleInfo } from '../module/role/RoleInfo';
import EntityCfg from './EntityCfg';
import { RoleMgr } from '../module/role/RoleMgr';
import { EntityMonster } from './EntityMonster';
import { INickInfoConfig, NickShowType } from '../base/utils/UtilGame';
import { ESex } from '../const/GameConst';
import { MainRole } from './MainRole';

/*
 * @Author: kexd
 * @Date: 2022-05-18 12:14:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-26 10:16:30
 * @FilePath: \SanGuo\assets\script\game\entity\EntityMapMgr.ts
 * @Description: 地图上用的模型对象
 *
 */
export default class EntityMapMgr {
    private static _i: EntityMapMgr = null;
    public static get I(): EntityMapMgr {
        if (this._i == null) {
            this._i = new EntityMapMgr();
        }
        return this._i;
    }

    /**
     * 主要用于生成主玩家类，会直接读取主玩家数据生成
     */
    public createMeRole(resDir: ACTION_DIRECT = ACTION_DIRECT.RIGHT_DOWN): MainRole {
        const roleInfo: RoleInfo = RoleMgr.I.info;
        const roleSkin: IEntitySkin = EntityCfg.I.getRoleSkinResID(roleInfo);

        // 因为刚创号的玩家还没有时装id，要读取角色表里的默认时装，这里设置为采用getRoleInitSkinId里的值
        const resId: number | string = EntityCfg.I.getRoleInitSkinId(!!RoleMgr.I.d.GradeHorse, RoleMgr.I.d.PlayerSkin, RoleMgr.I.d.Sex);
        roleSkin.bodyResID = resId;

        const role: MainRole = new MainRole(
            roleSkin.bodyResID,
            ANIM_TYPE.ROLE,
            resDir,
            ACTION_TYPE.STAND,
            cc.WrapMode.Loop,
            false,
        );
        role.initAnimData(roleSkin);
        role.roleInfo = roleInfo;
        role.roleInfo.userID = roleInfo.userID;

        return role;
    }

    /**
     * 根据资源ID创建角色
     */
    public createCustomRole(resId: number, resDir: ACTION_DIRECT = ACTION_DIRECT.RIGHT_DOWN): EntityRole {
        // const roleInfo: RoleInfo = RoleMgr.I.info;
        // const roleSkin: IEntitySkin = EntityCfg.I.getRoleSkinResID(roleInfo);

        // roleSkin.bodyResID = resId;

        const role: EntityRole = new EntityRole(
            resId,
            ANIM_TYPE.ROLE,
            resDir,
            ACTION_TYPE.STAND,
            cc.WrapMode.Loop,
            false,
        );
        // role.initAnimData(roleSkin);
        // role.roleInfo = roleInfo;
        // role.roleInfo.userID = roleInfo.userID;

        return role;
    }

    /**
     * 主要用于生成周围玩家类
     * @param data 属性数据
     * @param userID 玩家id
     * @returns EntityRole
     */
    public createRole(data: { A: IntAttr[], B: StrAttr[]; }, userID: number = 0, onlyShadow: boolean = false, hideTitle: boolean = false, hideName: boolean = false): EntityRole {
        let role: EntityRole = null;
        const roleInfo: RoleInfo = new RoleInfo(data);

        if (onlyShadow) {
            role = new EntityRole(
                0,
                ANIM_TYPE.ROLE,
                ACTION_DIRECT.RIGHT_DOWN,
                ACTION_TYPE.STAND,
                cc.WrapMode.Loop,
                false,
            );
        } else {
            const roleSkin: IEntitySkin = EntityCfg.I.getRoleSkinResID(data);

            if (!roleSkin.bodyResID) {
                roleSkin.bodyResID = roleInfo.d.Sex === ESex.Female ? 10002 : 10001;
            }

            role = new EntityRole(
                roleSkin.bodyResID,
                ANIM_TYPE.ROLE,
                ACTION_DIRECT.RIGHT_DOWN,
                ACTION_TYPE.STAND,
                cc.WrapMode.Loop,
                false,
            );
            role.initAnimData(roleSkin, hideTitle);
        }

        role.roleInfo = roleInfo;
        if (userID > 0) {
            role.roleInfo.userID = userID;
        }
        role.setName(roleInfo.getAreaNick(NickShowType.OfficialArenaNick, true), hideName);
        return role;
    }

    /**
     * 主要用于生成 怪物、宠物等对象
     * @param data 属性数据
     * @param userID 玩家id
     * @returns EntityMonster
     */
    public createMonster(data: { A: IntAttr[], B: StrAttr[]; }, userID: number = 0): EntityMonster {
        const roleInfo: RoleInfo = new RoleInfo(data);
        const roleSkin: IEntitySkin = EntityCfg.I.getRoleSkinResID(data);
        const monster: EntityMonster = new EntityMonster(
            roleSkin.bodyResID,
            ANIM_TYPE.PET,
            ACTION_DIRECT.RIGHT_DOWN,
            ACTION_TYPE.STAND,
            cc.WrapMode.Loop,
            false,
        );
        monster.initAnimData(roleSkin);
        monster.roleInfo = roleInfo;
        if (userID > 0) {
            monster.roleInfo.userID = userID;
        }
        return monster;
    }

    /**
     * 生成一个怪物
     *
     */
    public createMonsterById(monsterId: number = 0): EntityMonster {
        const resId: number = EntityCfg.I.getMonsterSkinResId(monsterId);
        const monster: EntityMonster = new EntityMonster(
            resId,
            ANIM_TYPE.PET,
            ACTION_DIRECT.RIGHT_DOWN,
            ACTION_TYPE.STAND,
            cc.WrapMode.Loop,
            false,
        );
        return monster;
    }
}
