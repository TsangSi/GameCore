/*
 * @Author: zs
 * @Date: 2022-07-12 17:20:54
 * @FilePath: \SanGuo\assets\script\game\module\roleskin\v\RoleActivitySuitPage.ts
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
import ModelMgr from '../../../manager/ModelMgr';
import {
    ERoleSkinPageIndex,
    ICfgRoleSkin, IRoleSkinItem,
} from './RoleSkinConst';
import { RoleSkinPageBase } from './RoleSkinPageBase';

const { ccclass, property } = cc._decorator;
@ccclass
export class RoleActivitySuitPage extends RoleSkinPageBase {
    @property(cc.Node)
    private NodeItems: cc.Node = null;
    @property(cc.Node)
    private NodeAttrInfo: cc.Node = null;
    /** 角色时装配置表索引器 */
    private cfgRoleSkin: ConfigRoleSkinIndexer;
    /** 角色时装配置表索引器 */
    private gradeskinIndexer: ConfigIndexer;
    /** 套装信息预制体脚本 */
    private readonly RoleActivitySuitAttr = 'RoleActivitySuitAttr';
    /** 套装部件预制体脚本 */
    // private readonly RoleSkinSuitItem = 'RoleSkinSuitItem';
    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.RoleSkin.SuitInfo, this.onSuitInfo, this);
        this.cfgRoleSkin = Config.Get(Config.Type.Cfg_RoleSkin);
        this.gradeskinIndexer = Config.Get(Config.Type.Cfg_GradeSkin);
        this.addPropertyPrefab(this.RoleActivitySuitAttr, UI_PATH_ENUM.RoleActivitySuitAttr, this.NodeAttrInfo);
        // this.addPropertyPrefab(this.RoleSkinSuitItem, UI_PATH_ENUM.RoleSkinSuitItem, this.NodeItems);
        // ControllerMgr.I.RoleSkinController.C2SSuitInfo();
        this.updateCommon();
    }
    private onSelectSkin(data: ICfgRoleSkin) {
        this.updateSuitInfo();
        // this.updateSuitItem();
    }

    public refreshPage(winId: number, params: any[]): void {
        this.selectSkin(this.selectSuitId, undefined, true);
        this.updateCommon();
    }

    private updateCommon() {
        const s = this.cfgRoleSkin.getActivitySuitDatas(ERoleSkinPageIndex.ActitySuit);
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
        this.setNodeStarActive(false);
    }

    /** 更新套装信息 */
    private updateSuitInfo() {
        if (this.selectSuitId) {
            const allPartAttrInfo = ModelMgr.I.RoleSkinModel.getSuitAllPartAttrInfo(this.selectSuitId, false, ERoleSkinPageIndex.ActitySuit);
            const attrInfo = ModelMgr.I.RoleSkinModel.getSuitAttrInfo(this.selectSuitId);
            this.updatePower(attrInfo.fightValue);
            this.proxyFunc(this.RoleActivitySuitAttr, 'setData', this.selectSuitId, allPartAttrInfo.attrs);
        }
    }

    /** 更新套装部件 */
    private updateSuitItem() {
        if (this.selectSuitId) {
            // this.proxyFunc(this.RoleSkinSuitItem, 'setData', this.selectSuitId);
        }
    }

    private onSuitInfo() {
        this.updateNodeItems();
    }

    protected onDestroy(): void {
        EventClient.I.off(E.RoleSkin.SuitInfo, this.onSuitInfo, this);
    }
}
