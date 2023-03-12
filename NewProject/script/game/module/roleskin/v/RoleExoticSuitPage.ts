/*
 * @Author: zs
 * @Date: 2022-07-12 17:20:54
 * @FilePath: \SanGuo\assets\script\game\module\roleskin\v\RoleExoticSuitPage.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { Executor } from '../../../../app/base/executor/Executor';
import { Config } from '../../../base/config/Config';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import { ConfigRoleSkinIndexer } from '../../../base/config/indexer/ConfigRoleSkinIndexer';
import { E } from '../../../const/EventName';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import {
    ERoleSkinPageIndex,
    ICfgRoleSkin,
} from './RoleSkinConst';
import { RoleSkinPageBase } from './RoleSkinPageBase';

const { ccclass, property } = cc._decorator;
@ccclass
export class RoleExoticSuitPage extends RoleSkinPageBase {
    @property(cc.Node)
    private NodeItems: cc.Node = null;
    @property(cc.Node)
    private NodeAttrInfo: cc.Node = null;
    /** 角色时装配置表索引器 */
    private cfgRoleSkin: ConfigRoleSkinIndexer;
    /** 角色时装配置表索引器 */
    private gradeskinIndexer: ConfigIndexer;
    /** 套装信息预制体脚本 */
    private readonly RoleSkinSuitInfo = 'RoleSkinSuitInfo';
    /** 套装部件预制体脚本 */
    private readonly RoleSkinSuitItem = 'RoleSkinSuitItem';
    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.RoleSkin.SuitInfo, this.onSuitInfo, this);
        EventClient.I.on(E.RoleSkin.NewAddSkin, this.onNewAddSkin, this);
        EventClient.I.on(E.RoleSkin.SuitActive, this.onSuitActive, this);
        this.cfgRoleSkin = Config.Get(Config.Type.Cfg_RoleSkin);
        this.gradeskinIndexer = Config.Get(Config.Type.Cfg_GradeSkin);
        // ControllerMgr.I.RoleSkinController.C2SSuitInfo();
        this.updateCommon();
        this.addPropertyPrefab(this.RoleSkinSuitInfo, UI_PATH_ENUM.RoleSkinSuitInfo, this.NodeAttrInfo);
        this.addPropertyPrefab(this.RoleSkinSuitItem, UI_PATH_ENUM.RoleSkinSuitItem, this.NodeItems);
    }
    private onSelectSkin(data: ICfgRoleSkin) {
        this.updateSuitInfo();
        this.updateSuitItem();
        const attrInfo = ModelMgr.I.RoleSkinModel.getSuitAttrInfo(this.selectSuitId);
        this.updatePower(attrInfo.fightValue);
    }

    private redStates: { [field: number]: number[] } = cc.js.createMap(true);
    private updateCommon() {
        const s = this.cfgRoleSkin.getActivitySuitDatas(ERoleSkinPageIndex.ExoticSuit);
        const field = 0;
        const states = this.redStates[field] = this.redStates[field] || [];
        const data: ICfgRoleSkin[] = [];
        for (let i = 0, n = s.length; i < n; i++) {
            const skinIds = s[i].SkinRequire.split('|');
            const d: ICfgRoleSkin = this.cfgRoleSkin.getSkinSuitValueByKey(s[i].Id, { IconId: '', Name: '' });
            d.Id = s[i].Id;
            const cfgRoleSkin = this.cfgRoleSkin.getValueByKey(+skinIds[0], { AnimId: '', NeedItem: 0 });
            d.Quality = Config.Get(Config.Type.Cfg_Item).getValueByKey(cfgRoleSkin.NeedItem, 'Quality') || 5;
            d.AnimId = cfgRoleSkin.AnimId;
            /** 还没有正式资源 */
            // d.GradeHorse = this.gradeskinIndexer.getValueByKey(+skinIds[1], 'AnimId');
            // d.GradeWing = this.gradeskinIndexer.getValueByKey(+skinIds[2], 'AnimId');
            // d.GradeWeapon = this.gradeskinIndexer.getValueByKey(+skinIds[3], 'AnimId');
            d.isSuit = true;
            data.push(d);
            const result = this.getSuitRedState(d.Id);
            if (result) {
                states.push(d.Id);
            }
        }
        data.sort((a, b) => a.Id - b.Id);
        this.updateRed(this.redStates);
        this.showFields(data, new Executor(this.onSelectSkin, this));
        this.setNodeStarActive(false);
    }
    private updateSuitRed(suitId: number) {
        const skinids = this.cfgRoleSkin.getSkinSuitSkinIds(suitId);
        if (skinids) {
            const f: number = this.cfgRoleSkin.getValueByKey(skinids[0], 'FieldId');

            const states = this.redStates[f] = this.redStates[f] || [];
            const reslut = this.getSuitRedState(suitId);
            const index = states.indexOf(suitId);
            if (reslut) {
                if (index < 0) {
                    states.push(suitId);
                }
            } else if (index >= 0) {
                states.splice(index, 1);
            }
            this.updateRedOne(f, suitId);
        }
    }

    /** 更新套装信息 */
    private updateSuitInfo() {
        if (this.selectSuitId) {
            const activeStatus = ModelMgr.I.RoleSkinModel.getSuitActiveStatus(this.selectSuitId);
            const activePartNum = this.getActivePartNum();
            const attrIds = ModelMgr.I.RoleSkinModel.getSuitPartAttrIds(this.selectSuitId);
            this.proxyFunc(this.RoleSkinSuitInfo, 'setData', attrIds, activeStatus, activePartNum, (num) => {
                ControllerMgr.I.RoleSkinController.C2SSuitActive(this.selectSuitId, num);
            });
        }
    }

    /** 更新套装部件 */
    private updateSuitItem() {
        if (this.selectSuitId) {
            this.proxyFunc(this.RoleSkinSuitItem, 'setData', this.selectSuitId);
        }
    }
    private onSuitInfo() {
        this.updateNodeItems();
    }

    private onSuitActive(suitId: number) {
        if (suitId === this.selectSuitId) {
            const attrInfo = ModelMgr.I.RoleSkinModel.getSuitAttrInfo(this.selectSuitId);
            const activePartNum = this.getActivePartNum();
            this.updatePower(attrInfo.fightValue);
            const activeStatus = ModelMgr.I.RoleSkinModel.getSuitActiveStatus(this.selectSuitId);
            this.proxyFunc(this.RoleSkinSuitInfo, 'updateActiveStatus', activeStatus, activePartNum);
        }
        this.updateSuitRed(suitId);
    }

    private onNewAddSkin(skinId: number) {
        if (!skinId) { return; }
        const index = this.skinIds.indexOf(skinId);
        if (index >= 0) {
            this.onSuitActive(this.selectSuitId);
            this.proxyFunc(this.RoleSkinSuitItem, 'updateItem', skinId, index);
        } else {
            this.updateSuitRed(this.cfgRoleSkin.getSuitIdBySkinId(skinId));
        }
        this.updateNodeItems();
    }
    protected onDestroy(): void {
        EventClient.I.off(E.RoleSkin.SuitInfo, this.onSuitInfo, this);
        EventClient.I.off(E.RoleSkin.NewAddSkin, this.onNewAddSkin, this);
        EventClient.I.off(E.RoleSkin.SuitActive, this.onSuitActive, this);
    }
}
