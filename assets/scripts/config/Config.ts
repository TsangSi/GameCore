import CfgIndexer from './CfgIndexer';
import CfgManager from './CfgManager';
import FightSceneIndexer from './indexer/FightSceneIndexer';

const DefaultKey = 'Id';

interface ConfigInfo {
    name: string,
    key?: string,
    indexer?: typeof CfgIndexer
}

export class Config {
    static cfgMI: CfgManager = CfgManager.I;

    static getI<T extends CfgIndexer>(info: ConfigInfo): T {
        if (!info || (!info.name && !info.indexer)) {
            return this.cfgMI.getCfgIndexer(this.T.Cfg_FeiSheng.name, this.T.Cfg_FeiSheng.key);
        }
        if (info.indexer) {
            // eslint-disable-next-line dot-notation
            return <T>info.indexer['I'];
        }
        return this.cfgMI.getCfgIndexer(info.name, info.key);
    }

    static T = {
        /** book */
        Cfg_PhotoBook: Object.create({ name: 'Cfg_PhotoBook', key: DefaultKey }),
        /** bookup */
        Cfg_PhotoBookUp: { name: 'Cfg_PhotoBookUp', key: 'Class,Quality,Level' },
        /** !Cfg_SkinGrade!升阶皮肤表 */
        Cfg_SkinGrade: { name: 'Cfg_SkinGrade', key: DefaultKey },
        /** !Cfg_Skin!皮肤表 */
        Cfg_Skin: { name: 'Cfg_Skin', key: DefaultKey },
        /** 职业表 */
        CfgJob: { name: 'Cfg_Job', key: 'RoleID' },
        /** 皮肤套装表 */
        Cfg_SkinSuit: { name: 'Cfg_SkinSuit', key: DefaultKey },
        /** 法阵表 */
        Cfg_FaZheng: { name: 'Cfg_FaZheng', key: DefaultKey },
        /** 王者之翼表 */
        Cfg_King_Suit: { name: 'Cfg_King_Suit', key: DefaultKey },
        /** !Cfg_FightPosition!战斗站位坐标配置 */
        Cfg_FightPosition: { name: 'Cfg_FightPosition', key: 'id' },
        /** 怪物表 */
        Cfg_Monster: { name: 'Cfg_Monster', key: 'MonsterId' },
        /** 宠物表 */
        Cfg_Pet2: { name: 'Cfg_Pet2', key: 'PetId' },
        /** !Cfg_PetA!天仙表 */
        Cfg_PetA: { name: 'Cfg_PetA', key: 'PetAId' },
        /** !Cfg_PetAMerge!合体天仙表 */
        Cfg_PetAMerge: { name: 'Cfg_PetAMerge', key: 'PetAId' },
        /** 灵兽园宠物库 */
        Cfg_Sect_Pets: { name: 'Cfg_Sect_Pets', key: DefaultKey },
        /** 宠物觉醒 */
        Cfg_PetAwaken: { name: 'Cfg_PetAwaken' },
        /** 飞升表 */
        Cfg_FeiSheng: { name: 'Cfg_FeiSheng', key: DefaultKey },
        /** 战斗UI */
        Cfg_FightScene: { name: 'Cfg_FightScene', indexer: FightSceneIndexer },
        /** 技能表 */
        Cfg_Skill: { name: 'Cfg_Skill', key: 'SkillId' },
        /** Buff表 */
        Cfg_Buff: { name: 'Cfg_Buff', key: 'BuffId' },
        /** 前端技能表 */
        Cfg_ClientSkill: { name: 'Cfg_ClientSkill', key: 'ID' },
        /** 神兽之怒 */
        Cfg_Sect_Animal_Rage: { name: 'Cfg_Sect_Animal_Rage', key: 'Id' },
        /** 跨服boss */
        Cfg_Act_WorldBoss: { name: 'Cfg_Act_WorldBoss' },
        /** 神龙系统 */
        Cfg_SL: { name: 'Cfg_SL', key: 'Grade' },
        /** !Cfg_GoldChange_Skin!战神神变皮肤配置 */
        Cfg_GoldChange_Skin: { name: 'Cfg_GoldChange_Skin', key: 'SkinId' },
        /** !Cfg_GoldChange_Warrior!战神神变 */
        Cfg_GoldChange_Warrior: { name: 'Cfg_GoldChange_Warrior' },
        Cfg_Item: { name: 'Cfg_Item', key: 'Id' },
    };
}
