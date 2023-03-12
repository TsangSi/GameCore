import { EventClient } from '../../../../../app/base/event/EventClient';
import { Executor } from '../../../../../app/base/executor/Executor';
import { Config } from '../../../../base/config/Config';
import { E } from '../../../../const/EventName';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { ERoleSkinPageIndex, ICfgRoleSkin } from '../../v/RoleSkinConst';
import { RoleSkinSuitPage } from '../../v/RoleSkinSuitPage';

/*
 * @Author: myl
 * @Date: 2022-12-26 22:07:18
 * @Description:
 */
const { ccclass, property } = cc._decorator;
// 按照活动套装处理数据
@ccclass
export default class RoleSpecialSuitPage extends RoleSkinSuitPage {
    protected readonly RoleSkinSpecialSuitInfo = 'RoleSkinSpecialSuitInfo';

    protected onLoad(): void {
        super.onLoad();
        /** 华服套装升阶回调 */
        EventClient.I.on(E.RoleSkin.NewAddSkin, this.onSelectSkin, this);
        EventClient.I.on(E.RoleSkin.SkinUpStar, this.onSelectSkin, this);
        EventClient.I.on(E.Bag.ItemChange, this.onSelectSkin, this);
        EventClient.I.on(E.RoleSkin.SpecialGradeSuccess, this.onSelectSkin, this);

        EventClient.I.on(E.RoleSkin.SuitActive, this.onSelectSkin, this);
    }

    protected updateCommon(): void {
        const s = this.cfgRoleSkin.getSpecialSuitData();
        const data: ICfgRoleSkin[] = [];
        for (let i = 0, n = s.length; i < n; i++) {
            const skinIds = s[i].SkinRequire.split('|');
            const d: ICfgRoleSkin = this.cfgRoleSkin.getSkinSuitValueByKey(s[i].Id, { IconId: '', Name: '' });
            d.Id = s[i].Id;
            const cfgRoleSkin = this.cfgRoleSkin.getValueByKey(+skinIds[0], { AnimId: '', NeedItem: 0 });
            d.Quality = Config.Get(Config.Type.Cfg_Item).getValueByKey(cfgRoleSkin.NeedItem, 'Quality') || 5;
            d.AnimId = cfgRoleSkin.AnimId;
            d.isSuit = true;
            data.push(d);
        }
        data.sort((a, b) => a.Id - b.Id);
        this.showFields(data, new Executor(this.onSelectSkin, this));
        this.setNodeStarActive(true);
    }

    protected loadPrefab(): void {
        this.addPropertyPrefab(this.RoleSkinSuitItem, UI_PATH_ENUM.RoleSkinSuitItem, this.NodeItems);
        this.addPropertyPrefab(this.RoleSkinSpecialSuitInfo, UI_PATH_ENUM.RoleSkinSpecialSuitInfo, this.NodeAttrInfo);
        this.updateCommon();
    }

    /** 更新套装信息 */
    protected updateSuitInfo(): void {
        if (this.selectSuitId) {
            const activeStatus = ModelMgr.I.RoleSkinModel.getSuitActiveStatus(this.selectSuitId);
            const activePartNum = this.getActivePartNum();
            const attrIds = ModelMgr.I.RoleSkinModel.getSuitPartAttrIds(this.selectSuitId);
            this.proxyFunc(this.RoleSkinSpecialSuitInfo, 'setData', attrIds, activeStatus, activePartNum, (num) => {
                const actives = ModelMgr.I.RoleSkinModel.getSuitInfo(this.selectSuitId);
                if (actives.indexOf(num) < 0) {
                    ControllerMgr.I.RoleSkinController.C2SSuitActive(this.selectSuitId, num);
                }
            }, this.selectSuitId);
            this.proxyFunc(this.RoleSkinSpecialSuitInfo, 'setSkill', this.selectSuitId);
        }
    }

    protected onSelectSkin(data: ICfgRoleSkin): void {
        this.updateSuitInfo();
        this.updateSuitItem();
        const attrInfo = ModelMgr.I.RoleSkinModel.getSuitAttrInfo(this.selectSuitId);
        this.updatePower(attrInfo.fightValue);
    }

    protected onSuitActive(suitId: number): void {
        if (suitId === this.selectSuitId) {
            const attrInfo = ModelMgr.I.RoleSkinModel.getSuitAttrInfo(this.selectSuitId);
            const activePartNum = this.getActivePartNum();
            this.updatePower(attrInfo.fightValue);
            const activeStatus = ModelMgr.I.RoleSkinModel.getSuitActiveStatus(this.selectSuitId);
            this.proxyFunc(this.RoleSkinSpecialSuitInfo, 'updateActiveStatus', activeStatus, activePartNum);
        } else {
            this.updateNodeItems(suitId);
        }
        this.updateSuitRed(suitId);
    }

    /** 更新套装部件 */
    protected updateSuitItem(): void {
        this.proxyFunc(this.RoleSkinSuitItem, 'setType', ERoleSkinPageIndex.SpecialSuit);
        this.proxyFunc(this.RoleSkinSuitItem, 'setData', this.selectSuitId);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.RoleSkin.SpecialGradeSuccess, this.onSelectSkin, this);
        EventClient.I.off(E.RoleSkin.NewAddSkin, this.onSelectSkin, this);
        EventClient.I.off(E.RoleSkin.SkinUpStar, this.onSelectSkin, this);
        EventClient.I.off(E.Bag.ItemChange, this.onSelectSkin, this);
        EventClient.I.off(E.RoleSkin.SuitActive, this.onSelectSkin, this);
    }
}
