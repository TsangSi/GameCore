/*
 * @Author: myl
 * @Date: 2022-12-27 14:48:01
 * @Description:
 */

import BaseModel from '../../../../app/core/mvc/model/BaseModel';
import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import { ConfigRoleSkinIndexer } from '../../../base/config/indexer/ConfigRoleSkinIndexer';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { EActiveStatus } from '../../../const/GameConst';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RedDotCheckMgr } from '../../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { ERoleSkinPageIndex } from '../v/RoleSkinConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleSpecialSuitModel extends BaseModel {
    public clearAll(): void {
        //
    }

    public registerRedDotListen(): void {
        const info: IListenInfo = {
            ProtoId: [ProtoId.S2CRoleSkinActive_ID,
            ProtoId.S2CSuitInfo_ID,
            ProtoId.S2CSuitActive_ID,
            ProtoId.S2CSuitGradeUp_ID,
            ProtoId.S2CRoleSkinInfo_ID],
            ProxyRid: [RID.Role.Role.SpecialSuit.Id],
            // RoleAttr: [RoleAN.N.VipLevel, RoleAN.N.VipExp],
            EventClient: [E.Bag.ItemChange],
        };

        RedDotMgr.I.emit(
            REDDOT_ADD_LISTEN_INFO,
            { rid: RID.Role.Role.SpecialSuit.Base, info },
        );
    }

    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Role.Role.SpecialSuit.Base, this.specialRedDot, this);
    }

    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Role.Role.SpecialSuit.Base, this.specialRedDot, this);
    }
    /**
     * 判断某一个华服套装是否可以升阶 （材料和套装信息）
     * @param  华服套装id lv
     */
    public specialCanGrade(id: number, lv: number): {
        state: boolean,
        matInfo: { matId: number, needNum: number, haveMatNum: number },
        partInfo: { haveNum: number, totalNum: number }
        isMax: boolean,
    } {
        let isMax = false;
        const indexer = Config.Get(ConfigConst.Cfg_SpecialSuitUp);
        const upCfg: Cfg_SpecialSuitUp = indexer.getValueByKey((lv ?? 1) + 1);
        if (!upCfg) {
            isMax = true;
            return {
                state: false, matInfo: { matId: 0, needNum: 0, haveMatNum: 0 }, partInfo: { haveNum: 0, totalNum: 0 }, isMax,
            };
        }
        const matCfg = upCfg.Item_Id.split(':');
        const matId = Number(matCfg[0]);
        const needNum = Number(matCfg[1]);
        const haveMatNum = BagMgr.I.getItemNum(matId);

        const indexer1 = Config.Get(ConfigConst.Cfg_SkinSuit);
        const suitCfg: Cfg_SkinSuit = indexer1.getValueByKey(id);
        // 寻找所需套装的配置
        let haveNum = 0;

        const needPart = suitCfg.SkinRequire.split('|');
        const totalNum = needPart.length;
        for (let i = 0; i < needPart.length; i++) {
            const partId = Number(needPart[i]);
            const partLv = ModelMgr.I.RoleSkinModel.getSkinStar(partId, i, ERoleSkinPageIndex.SpecialSuit);
            if (partLv >= upCfg.Part_Level) {
                haveNum++;
            }
        }
        const state = haveMatNum >= needNum && haveNum >= totalNum;
        return {
            state, matInfo: { matId, needNum, haveMatNum }, partInfo: { haveNum, totalNum }, isMax,
        };
    }

    /** 获取当前选中的华服套装的阶级
     * id : 套装id 0标识未激活
    */
    public getSpecialSuitGrade(id: number): number {
        return ModelMgr.I.RoleSkinModel.getSpecialGrade(id) || 0;
    }

    /** 华服页签的红点 */
    public specialRedDot(): void {
        if (!UtilFunOpen.isOpen(FuncId.SkinSpecialSuit)) {
            // 功能未开启时 红点不做任何判断
            RedDotMgr.I.updateRedDot(RID.Role.Role.SpecialSuit.Base, false);
            return;
        }

        const indexer: ConfigRoleSkinIndexer = Config.Get(ConfigConst.Cfg_RoleSkin);
        const suitCfgs = indexer.getSpecialSuitData();
        let red = false;
        for (let i = 0; i < suitCfgs.length; i++) {
            const itm = suitCfgs[i];
            red = red || this.specialSuitRedDot(itm.Id);
        }
        RedDotMgr.I.updateRedDot(RID.Role.Role.SpecialSuit.Base, red);
    }

    /** 华服套装红点 */
    public specialSuitRedDot(suitId: number): boolean {
        const indexer = Config.Get(ConfigConst.Cfg_SkinSuit);
        const suitCfg: Cfg_SkinSuit = indexer.getValueByKey(suitId);
        if (!suitCfg) {
            return false;
        }
        // 部位红点
        const parts = suitCfg.SkinRequire.split('|');
        let red = false;
        for (let j = 0; j < parts.length; j++) {
            const itm = parts[j];
            red = red || this.sepicalSuitPartRedDot(Number(itm), j);
        }
        // 升阶红点
        const lv = this.getSpecialSuitGrade(suitId);
        red = red || this.specialCanGrade(suitId, lv).state;

        // 激活红点
        let actState = false;
        const stats = ModelMgr.I.RoleSkinModel.getSuitActiveStatus(suitId);
        if (stats[0] === EActiveStatus.CanActive || stats[2] === EActiveStatus.CanActive) {
            actState = true;
        }
        red = red || actState;

        if (!RedDotMgr.I.getStatus(RID.Role.Role.SpecialSuit.Base)) {
            RedDotMgr.I.updateRedDot(RID.Role.Role.SpecialSuit.Base, red);
        }
        return red;
    }

    /** 获取套装部位红点 */
    public sepicalSuitPartRedDot(skinId: number, index: number): boolean {
        const star = ModelMgr.I.RoleSkinModel.getSkinStar(skinId, index, ERoleSkinPageIndex.SpecialSuit);
        const red = this.specialPartRedDot(skinId, star);
        return red;
    }

    /**
     * 套装部件皮肤升星红点
     * @param skinId
     * @param star
     * @returns
     */
    public specialPartRedDot(skinId: number, star: number): boolean {
        const indexer = Config.Get(ConfigConst.Cfg_RoleSkinStar);
        const cfgRoleSkinStar = Config.Get(Config.Type.Cfg_RoleSkinStar);
        const index = cfgRoleSkinStar.getIntervalIndex(star + 1);
        const cfgStar: Cfg_RoleSkinStar = indexer.getValueByIndex(index);
        if (!cfgStar) {
            return false;
        }
        const needNum = cfgStar.LevelUpItem;
        const skinIndexer = Config.Get(ConfigConst.Cfg_RoleSkin);
        const skinCfg: Cfg_RoleSkin = skinIndexer.getValueByKey(skinId);
        if (skinCfg) {
            const needItemId = skinCfg.NeedItem;
            const haveNum = BagMgr.I.getItemNum(needItemId);
            return haveNum >= needNum;
        }
        return false;
    }
}
