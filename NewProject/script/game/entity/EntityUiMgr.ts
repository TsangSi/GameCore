/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-05-18 12:14:36
 * @FilePath: \SanGuo2.4\assets\script\game\entity\EntityUiMgr.ts
 * @Description: 界面内用的模型对象
 *
 */
import {
    ACTION_DIRECT, ANIM_TYPE, ACTION_TYPE,
} from '../base/anim/AnimCfg';
import { IEntitySkin, IEntityData } from './EntityConst';
import AnimCom from '../base/anim/AnimCom';
import EntityCfg from './EntityCfg';
import EntityBase from './EntityBase';
import { RoleMgr } from '../module/role/RoleMgr';
import { RoleInfo } from '../module/role/RoleInfo';
import { Config } from '../base/config/Config';
import { ESex } from '../const/GameConst';

export default class EntityUiMgr {
    private static _i: EntityUiMgr = null;
    public static get I(): EntityUiMgr {
        if (this._i == null) {
            this._i = new EntityUiMgr();
        }
        return this._i;
    }

    /**
     * 展示单个的us动画，播放结束了再展示u动画。u一般都是作为模型展示来用的，一般都是使用createAttrEntity
     * @param ndEntity 父节点
     * @param data IEntityData
     * @returns AnimCom
     */
    public showUs(ndEntity: cc.Node, data: IEntityData): AnimCom {
        let anim: AnimCom = null;
        if (data.isPlayUs) {
            anim = new AnimCom({
                resId: data.resId,
                resType: data.resType,
                isFight: false,
            });
            anim.setScale(2, 2, 2);
            anim.playAction(ACTION_TYPE.UI_SHOW, data.resDir, cc.WrapMode.Normal, () => {
                anim.setCleanPreRes(true);
                anim.playAction(data.resAction, data.resDir, cc.WrapMode.Loop, null, this, () => {
                    anim.setScale(1, 1, 1);
                    anim.setCleanPreRes(false);
                });
            });
        } else {
            anim = new AnimCom({
                resId: data.resId,
                resType: data.resType,
                isFight: false,
            });
            anim.playAction(data.resAction, data.resDir);
        }
        if (data.offsetY) {
            anim.setPosition(anim.position.x, data.offsetY);
        }
        ndEntity.addChild(anim);
        return anim;
    }

    /** 武器、光翼、法宝等单个动画对象的单独展示 */
    private showV(ndEntity: cc.Node, data: IEntityData) {
        const anim: AnimCom = new AnimCom({
            resId: data.resId,
            resType: data.resType,
            isFight: false,
        });
        anim.playAction(ACTION_TYPE.View, ACTION_DIRECT.SHOW);
        if (data.offsetY) {
            anim.setPosition(anim.position.x, data.offsetY);
        }
        ndEntity.addChild(anim);
    }

    /**
     * 界面通用展示接口。由动画类型来决定是展示单个动画还是模型
     * @param ndEntity 父节点
     * @param data IUIEntity类型
     */
    public createEntity(ndEntity: cc.Node, data: IEntityData, attr: RoleInfo | { A: IntAttr[], B: StrAttr[]; } = null): void {
        // 默认参数
        data.resAction = data.resAction ? data.resAction : ACTION_TYPE.UI;
        data.resDir = data.resDir ? data.resDir : ACTION_DIRECT.SHOW;
        // 这些是单个动画的,暂时只有坐骑和羽翼有v动画 （如何区分用u还是v？？？目前有点乱）
        if (data.resType === ANIM_TYPE.WEAPON || data.resType === ANIM_TYPE.WING) {
            this.showV(ndEntity, data);
        } else if (data.resType === ANIM_TYPE.PET
            || data.resType === ANIM_TYPE.HORSE) {
            // 单个动画的展示，是使用showV，现在还没有对应的美术资源，这里先使用showUs
            this.showUs(ndEntity, data);
        } else {
            this.createAttrEntity(ndEntity, data, attr);
        }
    }

    /**
     * 展示模型。由玩家属性来获得模型的所有资源，包括武器、羽翼、坐骑等
     * @param ndEntity: 节点
     * @param data: 属性数据
     */
    public createAttrEntity(ndEntity: cc.Node, data: IEntityData, attr: RoleInfo | { A: IntAttr[], B: StrAttr[]; } = null): EntityBase {
        let roleSkin: IEntitySkin = {
            bodyResID: data.resId || 0,
            weaponResID: 0,
            horseResID: 0,
            wingResID: 0,
        };

        let roleInfo: RoleInfo;
        if (attr instanceof RoleInfo) {
            roleInfo = attr;
        } else {
            roleInfo = new RoleInfo(attr);
        }

        if (data.isMainRole) {
            data.resType = ANIM_TYPE.ROLE;
            roleSkin.bodyResID = EntityCfg.I.getRoleInitSkinId(!!RoleMgr.I.d.GradeHorse, RoleMgr.I.d.PlayerSkin, RoleMgr.I.d.Sex);
            roleInfo = RoleMgr.I.info;
        }

        if (data.suitId) {
            roleSkin = EntityCfg.I.getSuitRes(data.suitId, roleInfo.d.Sex);
            const entity = new EntityBase(roleSkin.bodyResID, data.resType, ACTION_DIRECT.RIGHT_DOWN, ACTION_TYPE.STAND);
            entity.initAnimData(roleSkin);
            ndEntity.addChild(entity);
            entity.setScale(1.75, 1.75, 1.75);
            entity.setPosition(0, -150, 0);
            entity.setShadow();

            return entity;
        }

        if (data.singleAnim && data.resId) {
            roleSkin.bodyResID = data.resId;
        } else {
            roleSkin = EntityCfg.I.getRoleSkinResID(roleInfo);
            // 传的参数需要指定显示皮肤
            if (data.resId) {
                roleSkin.bodyResID = data.resId;
                if (data.resType === ANIM_TYPE.ROLE) {
                    // 10001 和 10002 的皮肤具有特殊性：武器是做在皮肤动画里了（除了u动画），所以这2个皮肤的武器资源id需要置为0（除了u），u动画需要武器资源id
                    if (roleSkin.bodyResID === 10001 || roleSkin.bodyResID === 10002) {
                        if (!data.isPlayUs) roleSkin.weaponResID = 0;
                        else if (!roleSkin.weaponResID) {
                            roleSkin.weaponResID = EntityCfg.I.roleInitWeapon(roleInfo.d.Sex);
                        }
                    } else if (!roleSkin.weaponResID) {
                        roleSkin.weaponResID = EntityCfg.I.roleInitWeapon(roleInfo.d.Sex);
                    }
                }
            }
        }

        if (!data.isShowTitle) roleSkin.titleResID = 0;

        // UI 展示里不显示坐骑
        if (data.resType === ANIM_TYPE.ROLE) {
            roleSkin.horseResID = 0;
        }

        /** 该模型需要先展示us动作 */
        let entity: EntityBase;

        if (data.isPlayUs) {
            entity = new EntityBase(roleSkin.bodyResID, data.resType, ACTION_DIRECT.SHOW, ACTION_TYPE.UI_SHOW, cc.WrapMode.Normal);
            entity.initAnimData(roleSkin);
            entity.setScale(2, 2, 2);
            entity.forcePlay = true;
            entity.setCleanPreRes(true);
            entity.playAction(ACTION_TYPE.UI_SHOW, ACTION_DIRECT.SHOW, cc.WrapMode.Normal, () => {
                entity.playAction(ACTION_TYPE.UI, ACTION_DIRECT.SHOW, cc.WrapMode.Loop, null, this, () => {
                    entity.setCleanPreRes(false);
                    entity.forcePlay = false;
                    entity.setScale(1, 1, 1);
                });
            }, this);
            ndEntity.addChild(entity);
        } else {
            entity = new EntityBase(roleSkin.bodyResID, data.resType, ACTION_DIRECT.SHOW, ACTION_TYPE.UI);
            entity.initAnimData(roleSkin);
            ndEntity.addChild(entity);
        }
        return entity;
    }

    /**
     * 机器人模型
     * @param ndEntity 节点
     * @param sex 性别
     */
    public createRobotEntity(ndEntity: cc.Node, sex: ESex): EntityBase {
        const roleSkin: IEntitySkin = {
            bodyResID: 0,
            weaponResID: 0,
            horseResID: 0,
            wingResID: 0,
        };
        const cfg: Cfg_Job = Config.Get(Config.Type.Cfg_Job).getValueByKey(sex);
        if (cfg) {
            const ids: string[] = cfg.AnimID.split('|');
            roleSkin.bodyResID = +ids[0];
            roleSkin.weaponResID = cfg.WeaponID;
        } else {
            roleSkin.bodyResID = sex === ESex.Male ? 10001 : 10003;
            roleSkin.weaponResID = 50001;
        }
        const entity: EntityBase = new EntityBase(roleSkin.bodyResID, ANIM_TYPE.ROLE, ACTION_DIRECT.SHOW, ACTION_TYPE.UI);
        entity.initAnimData(roleSkin);
        ndEntity.addChild(entity);
        return entity;
    }

    /** 生成单个动画，不需要属性数据的 */
    public createAnim(
        parentNode: cc.Node,
        resId: number | string,
        resType: ANIM_TYPE,
        resAction: ACTION_TYPE = ACTION_TYPE.UI,
        resDirect: ACTION_DIRECT = ACTION_DIRECT.SHOW,
        wrapMode: number = cc.WrapMode.Loop,
    ): AnimCom {
        const anim = new AnimCom();
        anim.initAnimData({
            resId,
            resType,
            isFight: false,
        });
        anim.playAction(resAction, resDirect, wrapMode);
        parentNode.addChild(anim);
        return anim;
    }
}
