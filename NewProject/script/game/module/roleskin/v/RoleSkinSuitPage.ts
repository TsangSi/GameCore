/*
 * @Author: zs
 * @Date: 2022-07-12 17:20:54
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\roleskin\v\RoleSkinSuitPage.ts
 * @Description:
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { Executor } from '../../../../app/base/executor/Executor';
import { Config } from '../../../base/config/Config';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import { ConfigRoleSkinIndexer } from '../../../base/config/indexer/ConfigRoleSkinIndexer';
import { E } from '../../../const/EventName';
import { EActiveStatus } from '../../../const/GameConst';
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
export class RoleSkinSuitPage extends RoleSkinPageBase {
    @property(cc.Node)
    protected NodeItems: cc.Node = null;
    @property(cc.Node)
    protected NodeAttrInfo: cc.Node = null;
    /** 角色时装配置表索引器 */
    protected cfgRoleSkin: ConfigRoleSkinIndexer;
    /** 角色时装配置表索引器 */
    private gradeskinIndexer: ConfigIndexer;
    /** 套装信息预制体脚本 */
    protected readonly RoleSkinSuitInfo = 'RoleSkinSuitInfo';
    /** 套装部件预制体脚本 */
    protected readonly RoleSkinSuitItem = 'RoleSkinSuitItem';
    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.RoleSkin.SuitInfo, this.onSuitInfo, this);
        EventClient.I.on(E.RoleSkin.NewAddSkin, this.onNewAddSkin, this);
        EventClient.I.on(E.RoleSkin.SuitActive, this.onSuitActive, this);
        this.cfgRoleSkin = Config.Get(Config.Type.Cfg_RoleSkin);
        this.gradeskinIndexer = Config.Get(Config.Type.Cfg_GradeSkin);
        this.loadPrefab();
    }

    protected loadPrefab(): void {
        this.addPropertyPrefab(this.RoleSkinSuitItem, UI_PATH_ENUM.RoleSkinSuitItem, this.NodeItems);
        this.addPropertyPrefab(this.RoleSkinSuitInfo, UI_PATH_ENUM.RoleSkinSuitInfo, this.NodeAttrInfo);
        this.updateCommon();
    }

    public refreshPage(winId: number, params: any[]): void {
        if (params) {
            const suitId: number = params[1];
            if (suitId) {
                const skinIds = this.cfgRoleSkin.getSkinSuitSkinIds(suitId);
                const field: number = this.cfgRoleSkin.getValueByKey(+skinIds[0], 'FieldId');
                this.selectSkin(suitId, field);
            }
        }
    }
    protected onSelectSkin(data: ICfgRoleSkin): void {
        this.updateSuitInfo();
        this.updateSuitItem();
        const attrInfo = ModelMgr.I.RoleSkinModel.getSuitAttrInfo(this.selectSuitId);
        this.updatePower(attrInfo.fightValue);
    }

    protected redStates: { [field: number]: number[] } = cc.js.createMap(true);
    protected updateCommon(): void {
        const s = this.cfgRoleSkin.getSkinSuitIndexs();
        const data: { [field: number]: ICfgRoleSkin[] } = {};
        for (const field in s) {
            let d: ICfgRoleSkin = cc.js.createMap(true);
            data[field] = [];
            const states = this.redStates[field] = this.redStates[field] || [];
            for (let i = 0, n = s[field].length; i < n; i++) {
                const resids = s[field][i].SkinRequire.split('|');
                d = this.cfgRoleSkin.getSkinSuitValueByKey(s[field][i].Id, { IconId: '', Name: '' });
                d.Id = s[field][i].Id;
                d.AnimId = this.cfgRoleSkin.getValueByKey(+resids[0], 'AnimId');
                data[field].push(d);
                d.isSuit = true;
                const result = this.getSuitRedState(d.Id);
                if (result) {
                    states.push(d.Id);
                }
            }
            data[field].sort((a, b) => a.Id - b.Id);
        }
        this.updateRed(this.redStates);
        this.showFields(this.cfgRoleSkin.getSkinSuitFields(), data, new Executor(this.onSelectSkin, this));
        this.setNodeStarActive(false);
    }

    /** 更新套装信息 */
    protected updateSuitInfo(): void {
        if (this.selectSuitId) {
            const activeStatus = ModelMgr.I.RoleSkinModel.getSuitActiveStatus(this.selectSuitId);
            const activePartNum = this.getActivePartNum();
            const attrIds = ModelMgr.I.RoleSkinModel.getSuitPartAttrIds(this.selectSuitId);
            this.proxyFunc(this.RoleSkinSuitInfo, 'setData', attrIds, activeStatus, activePartNum, (num) => {
                const actives = ModelMgr.I.RoleSkinModel.getSuitInfo(this.selectSuitId);
                if (actives.indexOf(num) < 0) {
                    ControllerMgr.I.RoleSkinController.C2SSuitActive(this.selectSuitId, num);
                }
            });
        }
    }

    /** 更新套装部件 */
    protected updateSuitItem(): void {
        this.proxyFunc(this.RoleSkinSuitItem, 'setType', ERoleSkinPageIndex.SkinSuit);
        this.proxyFunc(this.RoleSkinSuitItem, 'setData', this.selectSuitId);
    }

    private onSuitInfo() {
        this.updateNodeItems();
    }

    protected onSuitActive(suitId: number): void {
        if (suitId === this.selectSuitId) {
            const attrInfo = ModelMgr.I.RoleSkinModel.getSuitAttrInfo(this.selectSuitId);
            const activePartNum = this.getActivePartNum();
            this.updatePower(attrInfo.fightValue);
            const activeStatus = ModelMgr.I.RoleSkinModel.getSuitActiveStatus(this.selectSuitId);
            this.proxyFunc(this.RoleSkinSuitInfo, 'updateActiveStatus', activeStatus, activePartNum);
        } else {
            this.updateNodeItems(suitId);
        }
        this.updateSuitRed(suitId);
    }

    protected updateSuitRed(suitId: number): void {
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
        super.onDestroy();
        EventClient.I.off(E.RoleSkin.SuitInfo, this.onSuitInfo, this);
        EventClient.I.off(E.RoleSkin.NewAddSkin, this.onNewAddSkin, this);
        EventClient.I.off(E.RoleSkin.SuitActive, this.onSuitActive, this);
    }
}
