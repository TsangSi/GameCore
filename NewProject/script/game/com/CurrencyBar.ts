/*
 * @Author: hwx
 * @Date: 2022-05-24 10:07:23
 * @FilePath: \SanGuo\assets\script\game\com\CurrencyBar.ts
 * @Description: 货币栏
 */
import { EventClient } from '../../app/base/event/EventClient';
import { UtilNum } from '../../app/base/utils/UtilNum';
import WinMgr from '../../app/core/mvc/WinMgr';
import { UtilGame } from '../base/utils/UtilGame';
import { ViewConst } from '../const/ViewConst';
import { RoleAN } from '../module/role/RoleAN';
import { RoleMgr } from '../module/role/RoleMgr';
import { ItemCurrencyId } from './item/ItemConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class CurrencyBar extends cc.Component {
    @property({ type: cc.Node, displayName: '玉璧节点' })
    private NdJadeBox: cc.Node = null;

    @property({ type: cc.Node, displayName: '元宝节点' })
    private NdIngotBox: cc.Node = null;

    @property({ type: cc.Node, displayName: '铜钱节点' })
    private NdCoinBox: cc.Node = null;

    protected onEnable(): void {
        this.initData();
        RoleMgr.I.on(this.onUpdateJade, this, RoleAN.N.ItemType_Coin2);
        RoleMgr.I.on(this.onUpdateIngot, this, RoleAN.N.ItemType_Coin3);
        RoleMgr.I.on(this.onUpdateCoin, this, RoleAN.N.ItemType_Coin4);
    }

    protected onDisable(): void {
        EventClient.I.targetOff(this);
    }

    protected start(): void {
        UtilGame.Click(this.NdJadeBox, () => {
            WinMgr.I.open(ViewConst.VipSuperWin, 0);
        }, this);

        UtilGame.Click(this.NdIngotBox, () => {
            WinMgr.I.open(ViewConst.ItemSourceWin, ItemCurrencyId.INGOT);
        }, this);

        UtilGame.Click(this.NdCoinBox, () => {
            WinMgr.I.open(ViewConst.ItemSourceWin, ItemCurrencyId.COIN);
        }, this);
    }

    private initData(): void {
        this.setJadeCount(RoleMgr.I.d.ItemType_Coin2);
        this.setIngotCount(RoleMgr.I.d.ItemType_Coin3);
        this.setCoinCount(RoleMgr.I.d.ItemType_Coin4);
    }

    /**
     * 设置货币数量
     * @param node
     * @param count
     */
    private setCount(node: cc.Node, count: number): void {
        const label = node.getComponentInChildren(cc.Label);
        if (label) {
            label.string = UtilNum.Convert(count);
        }
    }

    /**
     * 设置玉石数量
     * @param count
     */
    public setJadeCount(count: number): void {
        this.setCount(this.NdJadeBox, count);
    }

    /**
     * 设置元宝数量
     * @param count
     */
    public setIngotCount(count: number): void {
        this.setCount(this.NdIngotBox, count);
    }

    /**
     * 设置铜钱数量
     * @param count
     */
    public setCoinCount(count: number): void {
        this.setCount(this.NdCoinBox, count);
    }

    /** 监听角色玉石数量变化 */
    private onUpdateJade() {
        this.setJadeCount(RoleMgr.I.d.ItemType_Coin2);
    }

    /** 监听角色元宝数量变化 */
    private onUpdateIngot() {
        this.setIngotCount(RoleMgr.I.d.ItemType_Coin3);
    }

    /** 监听角铜钱数量变化 */
    private onUpdateCoin() {
        this.setCoinCount(RoleMgr.I.d.ItemType_Coin4);
    }
}
