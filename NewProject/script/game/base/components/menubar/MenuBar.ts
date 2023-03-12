/* eslint-disable max-len */
/*
 * @Author: zs
 * @Date: 2022-05-05 16:03:58
 * @FilePath: \SanGuo\assets\script\game\base\components\menubar\MenuBar.ts
 * @Description:
 */
import { Executor } from '../../../../app/base/executor/Executor';
import { IMenuNameData, ISharedData, MenuBarItem } from './MenuBarItem';

type CfgData = { [key: string | number]: number | string | string[] | CfgData | CfgData[] } | string;

const FilterName = (cfg: CfgData, titleKey: string) => cfg[titleKey] as string;

const { ccclass, property } = cc._decorator;
@ccclass
export class MenuBar extends cc.Component {
    @property(cc.Node)
    private tmpNodeItem: cc.Node = null;

    @property(cc.Node)
    private content: cc.Node = null;
    /** 菜单名数据 */
    private names: IMenuNameData[] = [];
    /** 最大层数 */
    private maxCount: number = 0;
    /** 最后一层标记 */
    private lastLayer: number = 0;
    /** 标题字段key列表 */
    private titleKeys: string[] = [];
    /** 选中回调器 */
    private selectEcecutor: Executor;
    /** 标记默认选中的索引列表 */
    private selectIndexs: number[] = [];
    /** 节点池 */
    private nodeItemPools: cc.Node[] = [];
    /** 自动选中是否执行标记 */
    private autoSeclectFlag = true;
    private filterCallback: (cfg, titleKey: string) => string;

    /** 是否保留上次点击的位置 */
    @property(cc.Boolean)
    private keepLastState: boolean = false;
    /**
     * 设置数据
     * @param datas 配置数据
     * @param titleKeys 要生成菜单按钮标题key
     * @param selectCallback 选中回调
     * @param target this
     * @param getNameCallback 名字获取回调，有些配置表只存了id，没有存实际名字的用回调获取名字
     */
    public setData(datas: CfgData, titleKeys: string[], selectCallback: (cfg) => void, target: unknown, getNameCallback?: (cfg, k: string) => string): void {
        this.filterCallback = getNameCallback;
        this.titleKeys = titleKeys;
        this.maxCount = titleKeys.length;
        this.lastLayer = this.maxCount - 1;
        this.selectEcecutor = new Executor(selectCallback, target);
        const anyDatas: any = datas;
        for (const k in anyDatas) {
            const tmpNames = this.newNameData(this.names);
            this.makeDataList(tmpNames, datas[k] as CfgData);
            tmpNames.Id = k;
            delete tmpNames.tmpNames;
        }
        // console.log('this.names=', this.names);
        this.autoSeclectFlag = true;
        this.scheduleOnce(this.autoSelect, 0);

        if (this.keepLastState) {
            this.setRecordCurMenu(true);
        }
    }

    /**
     * @param datas: IMenuNameData[] 组织好数据传入
     * @param selectCallback: 回调
     * @param target: 上下文
     */
    private _special: number = 0;
    public setMenuData(datas: IMenuNameData[], selectCallback: (cfg) => void, target: unknown, showSpecial: number = 0): void {
        this.content.destroyAllChildren();
        this.content.removeAllChildren();
        this._special = showSpecial;
        this.maxCount = datas.length;
        this.lastLayer = this.maxCount - 1;
        this.selectEcecutor = new Executor(selectCallback, target);
        this.names = datas;
        this.autoSeclectFlag = true;
        this.scheduleOnce(this.autoSelect, 0);
    }

    /**
     * 设置记录当前项
     * @param record 是否记录
     */
    public setRecordCurMenu(record: boolean): void {
        this.sharedData.recordCurMenu = record;
    }

    /** 更新菜单列表数据 */
    public uptMenuData(datas: IMenuNameData[]): void {
        this.maxCount = datas.length;
        this.lastLayer = this.maxCount - 1;
        this.names = datas;
        this.autoSeclectFlag = true;
        this.scheduleOnce(this._refreshMenu, 0);
    }

    public set showSpecial(showSpecial: number) {
        this._special = showSpecial;
    }

    /**
     * 选中某个选项
     * @param args ，多少层就传多少个参数
     */
    public select(...args: any[]): void {
        /** 添加自动选中 */
        // this.autoSeclectFlag = true;
        console.log('selecr=', ...args);
        this.selectIndexs.length = 0;
        let cfgs: IMenuNameData[] = this.names;
        let tmpcfg: IMenuNameData;
        let index = 0;
        args.forEach((id) => {
            if (cfgs) {
                // eslint-disable-next-line eqeqeq
                index = cfgs.findIndex((cfg) => cfg.Id == id);
                tmpcfg = cfgs[index];
                if (tmpcfg) {
                    this.selectIndexs.push(index);
                }
                cfgs = tmpcfg?.datas;
            }
        });
        // console.log('this.selectIndexs=', this.selectIndexs);
        if (!this.autoSeclectFlag) {
            // for (let i = 0, n = this.names.length; i < n; i++) {
            //     const c = this.names[i];
            this._addMenu(this.names[this.selectIndexs[0]], this.selectIndexs[0]);
            // }
            this.autoSeclectFlag = false;
        }
    }

    public updateRed(active: boolean, ...args: any[]): void {
        // console.log('active=', active, ...args);
        if (!this.autoSeclectFlag) {
            const indexs = [];
            let cfgs: IMenuNameData[] = this.names;
            let tmpcfg: IMenuNameData;
            let index = 0;

            if (typeof args[0] === 'object') {
                args = args[0];
            }

            args.forEach((id) => {
                if (cfgs) {
                    // eslint-disable-next-line eqeqeq
                    index = cfgs.findIndex((cfg) => cfg.Id == id);
                    tmpcfg = cfgs[index];
                    if (tmpcfg) {
                        indexs.push(index);
                    }
                    cfgs = tmpcfg?.datas;
                }
            });
            const node = this.content.children[indexs.shift() as number];

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            node?.getComponent(MenuBarItem).updateRedActive(active, ...indexs);
        } else {
            this.scheduleOnce(() => {
                this.updateRed(active, ...args);
            }, 0);
        }
    }

    /** 主要用于称号里的菜单状态更新：是否已激活、是否穿戴等 */
    public uptState(): void {
        //
    }

    /** 创建或者回收 */
    private createOrRecycleItemNode(node?: cc.Node) {
        if (node) {
            // node.removeFromParent();
            // this.nodeItemPools.push(node);
            node.active = false;
            return undefined;
        } else {
            node = this.nodeItemPools.shift();
            if (!node) {
                node = cc.instantiate(this.tmpNodeItem);
            }
            node.active = true;
            const w = node.getComponent(cc.Widget);
            w.left = 0;
            w.right = 0;
            // node.setPosition(0, node.position.y);
            return node;
        }
    }

    /**
     * 生成简单的数据列表
     * @param names 名字数据
     * @param childDatas 子菜单数据
     * @param layer 当前层
     * @param maxCount 最大层
     * @returns
     */
    private makeDataList(names: IMenuNameData, childDatas: CfgData, layer = 0, maxCount = this.lastLayer): void {
        if (layer >= maxCount) {
            let name = '';
            this.titleKeys.forEach((k) => {
                name = this.filterCallback ? this.filterCallback(childDatas, k) : FilterName(childDatas, k);
                name = name || '未配置';
                names.tmpNames.push(name);
            });
            names.cfg = childDatas;
            names.name = names.tmpNames[layer] || names.tmpNames[layer - 1];
            delete names.datas;
            return;
        }
        const anyChildDatas: any = childDatas;
        const nextlayer = layer + 1;
        let tmpCfgData: CfgData;
        for (const k in anyChildDatas) {
            tmpCfgData = childDatas[k];
            const tmpNames = this.newNameData(names.datas);
            this.makeDataList(tmpNames, tmpCfgData, nextlayer);
            if (nextlayer >= this.lastLayer && !Array.isArray(tmpCfgData) && !tmpCfgData[this.titleKeys[nextlayer]]) {
                if (tmpNames.tmpNames.length < this.titleKeys.length) {
                    names.cfg = tmpNames.cfg;
                    delete names.datas;
                }
            }
            tmpNames.Id = k;
            names.tmpNames = tmpNames.tmpNames;
            delete tmpNames.tmpNames;
            names.name = names.tmpNames[layer];
        }
    }

    /** 刷新MenuBarItem */
    private _refreshMenu() {
        for (let i = 0, n = this.names.length; i < n; i++) {
            const c = this.names[i];
            this._refreshMenuItem(c, i);
        }
        this.autoSeclectFlag = false;
    }

    private _refreshMenuItem(childDatas: IMenuNameData, index: number) {
        let item: cc.Node = this.content.children[index];
        if (!item) {
            item = this.createOrRecycleItemNode();
            this.content.addChild(item);
        }
        const s = item.getComponent(MenuBarItem);
        s.TopLayerObject.selectIndexs = this.selectIndexs;
        if (!s.TopLayerObject.createOrRecycleExecutor) {
            s.TopLayerObject.createOrRecycleExecutor = new Executor(this.createOrRecycleItemNode, this);
        }
        // 这是否需要？
        s.makeDataMaxLayer(childDatas);
        s.showSpecial = this._special;
        s.refreshData(childDatas, index, s, this.selectEcecutor);
    }

    /** 自动选中第一个 */
    private autoSelect() {
        for (let i = 0, n = this.names.length; i < n; i++) {
            const c = this.names[i];
            this._addMenu(c, i);
        }
        this.autoSeclectFlag = false;
    }
    /** 整个Menu共享数据 */
    private sharedData: ISharedData = cc.js.createMap(true);
    private _addMenu(childDatas: IMenuNameData, index: number): void {
        let item: cc.Node = this.content.children[index];
        if (!item) {
            item = this.createOrRecycleItemNode();
            this.content.addChild(item);
        }
        const s = item.getComponent(MenuBarItem);
        s.TopLayerObject.sharedData = this.sharedData;
        s.TopLayerObject.selectIndexs = this.selectIndexs;
        s.TopLayerObject.createOrRecycleExecutor = new Executor(this.createOrRecycleItemNode, this);
        s.makeDataMaxLayer(childDatas);
        s.showSpecial = this._special;
        s.setData(childDatas, index, s, this.selectEcecutor);
        // console.log('------', childDatas, s.topLayer);
    }

    /** 生成一个数据结构 */
    private newNameData(names: IMenuNameData[]) {
        const tmpNames: IMenuNameData = cc.js.createMap(true);
        names.push(tmpNames);
        tmpNames.name = '';
        tmpNames.datas = [];
        tmpNames.tmpNames = [];
        return tmpNames;
    }

    protected onDestroy(): void {
        if (this.selectEcecutor) {
            this.selectEcecutor.clear();
            delete this.selectEcecutor;
        }
    }
}
