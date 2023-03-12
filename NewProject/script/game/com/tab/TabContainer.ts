/*
 * @Author: hwx
 * @Date: 2022-06-09 18:53:12
 * @FilePath: \SanGuo2.4-main\assets\script\game\com\tab\TabContainer.ts
 * @Description: 页签选项
 */
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { GuideMgr } from '../guide/GuideMgr';
import { TabData } from './TabData';
import { TabItem } from './TabItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class TabContainer extends cc.Component {
    @property({
        type: cc.Prefab,
        displayName: '预制模板',
        visible(this: TabContainer) {
            return !this.NdTabTpl;
        },
    })
    private PrefabTabTpl: cc.Prefab = null;

    @property({
        type: cc.Node,
        displayName: '节点模板',
        tooltip: '节点模板，不要放在该容器中！',
        visible(this: TabContainer) {
            return !this.PrefabTabTpl;
        },
    })
    private NdTabTpl: cc.Node = null;

    /** 侦听折叠事件列表 */
    @property({ type: cc.Component.EventHandler, displayName: '选中事件' })
    protected eventHandler: cc.Component.EventHandler[] = [];

    /** 选中的项 */
    private _selectedItem: TabItem;

    private _data: TabData[] = [];

    /**
     * 设置数据
     * @param data TabData[]
     * @param defaultId number
     * @param reselect 重新选择默认
     */
    public setData(data: TabData[], defaultId?: number): void {
        this._data = data.filter((v) => UtilFunOpen.canShow(v.funcId));

        let isChangeItem = false;
        const hasDefaultId = typeof defaultId === 'number';
        if (hasDefaultId && this._selectedItem) {
            isChangeItem = defaultId !== this._selectedItem.getData().id;
        }

        // 移除掉刷新是多余的数据
        const children: cc.Node[] = [];
        for (let k = this._data.length; k < this.node.children.length; k++) {
            const nd = this.node.children[k];
            children.push(nd);
        }
        children.forEach((nd) => {
            nd.removeFromParent();
            nd.destroy();
        });

        for (let i = 0, len = this._data.length; i < len; i++) {
            const tabData = this._data[i];
            const tabNode = this.node.children[i];
            let tabCompt: TabItem;
            if (!tabNode) {
                tabCompt = this.addTabItem(tabData);
            } else {
                tabCompt = tabNode.getComponent(TabItem);
                tabCompt.setData(tabData);
                if (tabData.guideId) {
                    GuideMgr.I.bindScript(tabData.guideId, tabNode, this.node.parent.parent);
                }
            }

            // 选中默认项
            if (!this._selectedItem || isChangeItem) {
                const isDefaultItem = hasDefaultId ? tabData.id === defaultId : true;
                if (isDefaultItem) {
                    // by zengsi，重新进来setData，应该把这个条件放开，让每一项恢复的到默认状态，所以未选中需要调用unselect
                    // isChangeItem = false;
                    tabCompt.select();
                } else {
                    tabCompt.unselect();
                }
            }
        }
    }

    /**
     * 重新聚焦当前选中项，发送选中事件
     */
    public focus(): void {
        if (this._selectedItem) {
            // 分发事件
            this.eventHandler.forEach((event) => {
                event.emit([this._selectedItem]);
            });
        }
    }

    /**
     * 切换Tab
     * @param tabId
     */
    public switchTab(tabId: number, force?: boolean): void {
        if (this._data.length > 0) {
            for (let i = 0, len = this._data.length; i < len; i++) {
                const tabData = this._data[i];
                if (tabData.id === tabId) {
                    const tabNode = this.node.children[i];
                    const tabCompt = tabNode.getComponent(TabItem);
                    if (tabCompt !== this._selectedItem || force) {
                        tabCompt.select();
                    } else {
                        this.focus();
                    }
                    break;
                }
            }
        }
    }

    /**
     * 添加页签项
     * @param tabData
     * @returns
     */
    public addTabItem(tabData: TabData): TabItem {
        // 添加节点
        const tpl = this.PrefabTabTpl || this.NdTabTpl;
        const tabNode = cc.instantiate(tpl) as cc.Node;
        tabNode.setPosition(0, 0); // 归零，防止加入到Layout中位置偏差
        tabNode.active = true; // 防止有模板是隐藏的
        this.node.addChild(tabNode);

        // 设置数据
        const tabCompt = tabNode.getComponent(TabItem);
        tabCompt.onSelected(this.onTabItemSelected, this);
        tabCompt.setData(tabData);
        if (tabData.guideId) {
            GuideMgr.I.bindScript(tabData.guideId, tabNode, this.node.parent.parent.parent);
        }

        return tabCompt;
    }

    /**
     * 监听页签项选中
     * @param comp TabItem
     */
    private onTabItemSelected(comp: TabItem): void {
        if (this._selectedItem && this._selectedItem !== comp) {
            this._selectedItem.unselect();
        }
        this._selectedItem = comp;

        // 分发事件
        this.eventHandler.forEach((event) => {
            event.emit([comp]);
        });
    }

    /**
     * 增加监听选中事件
     * @param target 目标节点
     * @param component 节点组件名
     * @param handler 组件函数名
     * @param customEventData 自定义事件参数字符串
     */
    public addEventHandler(target: cc.Node, component: string, handler: string, customEventData = ''): void {
        // 防止重复添加
        this.removeEventHandler(target, handler);

        // 新建事件
        const event = new cc.Component.EventHandler();
        event.target = target;
        event.component = component;
        event.handler = handler;
        event.customEventData = customEventData;
        this.eventHandler.push(event);

        // 先执行一次
        if (this._selectedItem) {
            event.emit([this._selectedItem]);
        }
    }

    /**
     * 删除监听选中事件
     * @param target 目标节点
     * @param handler 组件函数名
     */
    public removeEventHandler(target: cc.Node, handler: string): void {
        this.eventHandler.forEach((event, index) => {
            if (event.target === target && event.handler === handler) {
                this.eventHandler.splice(index, 1);
                return true;
            }
            return false;
        });
    }

    public getDataLength(): number {
        return this._data.length;
    }

    /** 隐藏/显示某个页签 */
    public changeTabState(id: number, hide: boolean = false): void {
        for (let i = 0; i < this.node.children.length; i++) {
            const nd = this.node.children[i];
            const item: TabItem = nd.getComponent(TabItem);
            if (item.getData().id === id && item !== this._selectedItem) {
                nd.active = hide;
            }
        }
    }
}
