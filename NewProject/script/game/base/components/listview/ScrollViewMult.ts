/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';

const {
    ccclass, property, disallowMultiple, menu,
} = cc._decorator;
const MYSELF = 'self';
interface IItemNodeInfo {
    x: number,
    y: number,
    width: number,
    height: number,
    data: any,
    node: cc.Node,
}

interface IParams {
    layoutList?: string[];
    richList?: string[]
}

@ccclass
@disallowMultiple()
@menu('自定义组件/ScrollViewMult')
export default class ScrollViewMult extends cc.ScrollView {
    private kWidth: number = 0;
    private kHeight: number = 0;
    private node_pools: cc.NodePool = new cc.NodePool();
    private items: IItemNodeInfo[] = []; // 存放缓存数据
    private start_index: number = -1; // 起始下标
    private stop_index: number = -1;// 结尾下标
    private gap_x: number = 0;// 间距
    private gap_y: number = 0;// 间距
    private paddingTop: number = 0;// 距离上面或者左边的padding
    private paddingBot: number = 0;// 距离下面或者右边的padding
    // eslint-disable-next-line object-curly-newline
    private layoutList: string[] = null;// 子节点路径
    // 富文本提高性能处理数据
    private richList: string[] = null;
    @property({
        type: cc.Component.EventHandler,
    })
    private renderEvent: cc.Component.EventHandler = new cc.Component.EventHandler();

    /** 获取预制体 */
    private ItemNodeByType: (index: number) => cc.Prefab | cc.Node = null;
    public registerNodeGetCall(method: (index: number) => cc.Prefab | cc.Node): void {
        if (!this.ItemNodeByType) {
            this.ItemNodeByType = method;
        }
    }

    private ItemNodeHeight: (index: number) => cc.Size;
    public registerItemNodeHeightCall(m: (index: number) => cc.Size): void {
        if (!this.ItemNodeHeight) {
            this.ItemNodeHeight = m;
        }
    }

    /** 手动更新layout */
    private updateLayoutSize(node: cc.Node, layoutList?: string[]) {
        layoutList.forEach((v) => {
            let layout: cc.Layout;
            if (v === MYSELF) {
                layout = node.getComponent(cc.Layout);
            } else {
                layout = UtilCocos.getChildByPath(node, v)?.getComponent(cc.Layout); // node.getChildByPath(v)?.getComponent(cc.Layout);
            }
            if (layout) {
                layout.updateLayout();
            }
        });
    }

    // 滑动中回调
    private onScrolling() {
        if (!this.items || !this.items.length) {
            return;
        }
        // 垂直滚动
        if (this.vertical) {
            const posy = Math.min(Math.max(this.content.position.y, 0), this.content.height - this.kHeight);
            let start = 0;
            let stop = this.items.length - 1;
            const viewport_start = -posy;
            const viewport_stop = viewport_start - this.kHeight;

            while (this.items[start].y - this.items[start].height > viewport_start) {
                start++;
            }
            while (this.items[stop].y < viewport_stop) {
                stop--;
            }
            if (stop + 1 < this.items.length) stop += 1;
            if (start !== this.start_index || stop !== this.stop_index) {
                this.start_index = start;
                this.stop_index = stop;
                this.renderItems();
            }
        } else { // 水平滚动
            const posx = Math.max(Math.min(this.content.position.x, 0), this.kWidth - this.node.width);

            let start = 0;
            let stop = this.items.length - 1;
            const viewport_start = -posx;
            const viewport_stop = viewport_start + this.kWidth;
            while (this.items[start].x + this.items[start].width < viewport_start) {
                start++;
            }
            while (this.items[stop].x > viewport_stop) {
                stop--;
            }
            if (start !== this.start_index || stop !== this.stop_index) {
                this.start_index = start;
                this.stop_index = stop;
                this.renderItems();
            }
        }
    }
    // 生成node
    private spawnNode(idx: number): cc.Node {
        const nd: cc.Node | cc.Prefab = this.ItemNodeByType(idx);
        if (nd instanceof cc.Prefab) {
            const nd1 = cc.instantiate(nd);
            return nd1;
        }
        return nd;
    }

    private _nodePool: cc.Node[] = [];
    public getPoolNode(name: string): cc.Node {
        if (name === null || name === '') return null;
        for (let i = 0; i < this._nodePool.length; i++) {
            const nd = this._nodePool[i];
            if (nd.name === name) {
                this._nodePool.splice(i, 1);
                nd.active = true;
                // nd.opacity = 255;
                return nd;
            }
        }
        return null;
    }
    // 回收item
    private recycleItem(item: IItemNodeInfo) {
        if (item.node && cc.isValid(item.node)) {
            // 富文本性能低 需要特殊处理
            this.richList?.forEach((v) => {
                const rich: cc.Node = UtilCocos.getChildByPath(item.node, v); // item.node.getChildByPath(v);
                if (rich) {
                    rich.active = false;
                    // item.node.opacity = 0;
                }
            });
            item.node.active = false;
            // item.node.opacity = 0;
            this._nodePool.push(item.node);
            item.node = null;
        }
    }

    // 清除items
    private clearItems() {
        if (this.items) {
            this.items.forEach((item) => {
                this.recycleItem(item);
            });
        }
    }
    // 渲染items
    private renderItems() {
        let item: IItemNodeInfo;
        for (let i = 0; i < this.start_index; i++) {
            item = this.items[i];
            if (item.node) {
                this.recycleItem(item);
            }
        }
        for (let i = this.items.length - 1; i > this.stop_index; i--) {
            item = this.items[i];
            if (item.node) {
                this.recycleItem(item);
            }
        }

        for (let i = this.start_index; i <= this.stop_index; i++) {
            if (!this.items[i]) {
                return;
            }
            item = this.items[i];
            if (!item.node) {
                item.node = this.spawnNode(i);
                // this.item_setter(item.node, item.data, i, true);
            }
            item.node.setPosition(item.x, item.y);
            this.item_setter(item.node, item.data, i, true);
        }
    }
    // 赋值item
    private packItem(index: number, data): IItemNodeInfo | undefined {
        const node = this.spawnNode(index);
        const [width, height] = this.item_setter(
            node,
            data,
            index,
            this.content.height <= this.kHeight || index < 1,
        );
        const item = {
            x: 0,
            y: 0,
            width,
            height,
            data,
            node,
        };
        return item;
    }
    // item具体赋值
    private item_setter(node: cc.Node, data: any, index: number, isSender: boolean = false) {
        if (this.renderEvent && isSender) {
            cc.Component.EventHandler.emitEvents([this.renderEvent], node, data, index);
            node.parent = this.content;
            if (this.layoutList) {
                this.updateLayoutSize(node, this.layoutList);
            }
        }
        const siz = this.ItemNodeHeight(index);
        return [siz.width, siz.height];
    }
    // 布局items
    private layout_items(start) {
        if (!this.items || this.items.length <= 0) {
            return;
        }
        let start_pos = -this.paddingTop;
        if (start > 0) {
            const prev_item = this.items[start - 1];
            if (this.vertical) {
                start_pos = prev_item.y - prev_item.height - this.gap_y;
            } else {
                start_pos = prev_item.x + prev_item.width + this.gap_x;
            }
        }
        for (let index = start, stop = this.items.length; index < stop; index++) {
            const item = this.items[index];
            if (this.vertical) {
                item.x = 0;
                item.y = start_pos;
                start_pos -= item.height + this.gap_y;
            } else {
                item.y = 0;
                item.x = start_pos;
                start_pos += item.width + this.gap_x;
            }
        }
    }
    // 调整content
    private resize_content() {
        if (this.items.length <= 0) {
            this.content.setContentSize(0, 0);
            return;
        }
        const last_item = this.items[this.items.length - 1];
        if (this.vertical) {
            // eslint-disable-next-line max-len
            this.content.height = Math.max(this.kHeight - this.gap_y - this.paddingTop - this.paddingBot - 20, last_item.height - last_item.y - this.gap_y + this.paddingBot);
        } else {
            this.content.width = Math.max(this.kWidth, last_item.x + last_item.width + this.paddingBot);
        }
    }
    // 插入数据
    private insert_data(index: number, data: any) {
        if (!data) {
            return;
        }
        if (!this.items) {
            this.items = [];
        }
        if (index < 0 || index > this.items.length) {
            console.log('无效的index', index);
            return;
        }
        const items = [];
        const item = this.packItem(index, data);
        items.push(item);
        this.items.splice(index, 0, ...items);
        this.layout_items(index);
        this.resize_content();
        this.start_index = -1;
        this.stop_index = -1;
        this.onScrolling();
    }
    protected onDestroy(): void {
        this.node.off('scrolling', this.onScrolling, this);
        /** 去掉注册高度和注册item的回调 */
        this.ItemNodeByType = null;
        this.ItemNodeHeight = null;
    }

    public setTemplateItemData(data?: any[], arg?: IParams): void {
        if (this.ItemNodeByType === null) {
            console.warn('请注册节点选择的方法');
            return;
        }
        if (!this.ItemNodeHeight) {
            console.log('请注册item高度的方法');
            return;
        }

        if (!this.node.hasEventListener('scrolling')) {
            this.node.on('scrolling', this.onScrolling, this);
        }

        this.kHeight = this.node.height;
        this.kWidth = this.node.width;
        const layout = this.content.getComponent(cc.Layout);
        if (layout) {
            if (this.vertical) {
                this.gap_y = layout.spacingY;
            } else {
                this.gap_x = layout.spacingX;
            }
            this.paddingBot = this.vertical ? layout.paddingBottom : layout.paddingTop;
            this.paddingTop = this.vertical ? layout.paddingTop : layout.paddingLeft;
            layout.enabled = false;
            layout.destroy();
        }
        if (arg) {
            if (arg.layoutList) {
                this.layoutList = arg.layoutList;
            } else {
                this.layoutList = null;
            }
            /** 富文本效率低 需要特殊处理 */
            if (arg.richList) {
                this.richList = arg.richList;
            } else {
                this.richList = [];
            }
        }
        if (data) {
            this.initData(data);
        }
    }

    // 设置数据
    // eslint-disable-next-line generator-star-spacing
    private initData(datas: any[]) {
        this.clearScroll();
        // for (let i = 0; i < datas.length; i++) {
        //     const item = datas[i];
        //     this.insert_data(i, item);
        // }

        let index = 0;
        this.schedule(() => {
            if (index >= datas.length) {
                // 创建完毕执行滚动
                if (this._scrollIndex > 0) {
                    this.scrollToIndex(this._scrollIndex, 0.1);
                } else {
                    this.scrollToBottom(0.1);
                }
                return;
            }
            const data = datas[index];
            this.insert_data(index, data);
            index++;
        }, 0.01, datas.length, 0);
        this.scrollToBottom(0.1);
    }
    // 追加数据
    public addData(datas: any[]): void {
        if (!this.items) {
            this.items = [];
        }
        const length = this.items.length;
        datas.forEach((data, index) => {
            this.insert_data(length + index, data);
        });
    }
    /**
     * 滚动到指定下标item
     */
    private _scrollIndex = 0;
    public scrollToIndex(index: number, timer: number = 0.1): void {
        this._scrollIndex = index;
        const item = this.items[index];
        if (item) { // 延时执行
            this.scrollToOffset(cc.v2(0, Math.abs(this.items[index].y)), timer);
            this.onScrolling();
        } else {
            this.scrollToTop();
        }
    }

    public scrollToTop(timeInSecond?: number, attenuated = true): void {
        if (this.vertical) {
            super.scrollToTop(timeInSecond, attenuated);
        } else {
            super.scrollToLeft(timeInSecond, attenuated);
        }
        if (!timeInSecond) {
            this.onScrolling();
        }
    }

    public scrollToEnd(timeInSecond?: number, attenuated = true): void {
        if (this.vertical) {
            this.scrollToBottom(timeInSecond, attenuated);
        } else {
            this.scrollToRight(timeInSecond, attenuated);
        }
        if (!timeInSecond) {
            this.onScrolling();
        }
    }
    // 清空scroll内节点
    private clearScroll() {
        this.clearItems();
        this.node_pools.clear();
        this._nodePool = [];
        this.items = [];
        this.resize_content();
        if (this.content && this.content.children.length) {
            this.content.destroyAllChildren();
            this.content.removeAllChildren();
        }
    }
}
