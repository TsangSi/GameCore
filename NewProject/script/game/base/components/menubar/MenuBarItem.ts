/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Executor } from '../../../../app/base/executor/Executor';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { UtilGame } from '../../utils/UtilGame';
import { SpriteCustomizer } from '../SpriteCustomizer';
import UtilTitle from '../../utils/UtilTitle';
import { ITitleCfg } from '../../../module/title/TitleConst';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { LabelCustomColor } from '../LabelCustomColor';
import { UtilBool } from '../../../../app/base/utils/UtilBool';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { UtilArray } from '../../../../app/base/utils/UtilArray';

/*
 * @Author: zs
 * @Date: 2022-05-05 15:25:10
 * @FilePath: \SanGuo\assets\script\game\base\components\menubar\MenuBarItem.ts
 * @Description:
 *
 */

enum Layer {
    /** 空层，占位用 */
    Empty,
    /** 第一层 */
    First,
    /** 第二层 */
    Second,
    /** 第三层 */
    Third,
    /** 第四层 */
    Fourth
}

export interface IMenuNameData {
    name: string,
    Id?: number | string,
    cfg?: any,
    tmpNames?: string[],
    tmpkeys?: string[],
    red?: boolean,
    datas?: IMenuNameData[]
}

enum ButtonState {
    /** 默认未选中状态 */
    Normall,
    /** 选中状态 */
    Select,
}

export interface ISharedData {
    /** 选中的node */
    selectItem?: MenuBarItem,
    /** 是否记录当前项 */
    recordCurMenu?: boolean
}

interface TopLayerObject {
    /** 记录最大层数 */
    maxLayer: number,
    /** 暂时用于第一次刚打开要默认选中的索引列表，用完就会清除里面的数据 */
    selectIndexs?: number[],
    /** 红点列表 */
    reds?: number[],
    /** 创建和回收节点的回调器 */
    createOrRecycleExecutor: Executor,
    /** 整个Menu共享数据 */
    sharedData?: ISharedData,
}

const { ccclass, property } = cc._decorator;
@ccclass
export class MenuBarItem extends cc.Component {
    private NodeBg: cc.Node = null;
    // @property(SpriteCustomizer)
    private _nodeJianTou: SpriteCustomizer;
    private get nodeJianTou(): SpriteCustomizer {
        if (this._layer === 1 && !this._nodeJianTou) {
            const node = UtilCocos.FindNode(this.node, 'item1/Sprite');
            this._nodeJianTou = node?.getComponent(SpriteCustomizer);
        }
        return this._nodeJianTou;
    }
    private childDatas: IMenuNameData;
    @property({
        type: cc.Node,
        serializable: true,
    })
    private Items: cc.Node[] = [];
    private _layer: number = Layer.First;
    public get layer(): number {
        return this._layer;
    }
    @property(cc.Integer)
    public set layer(l: number) {
        this._layer = l;
        this.updateStyle();
    }

    private updateStyle() {
        const idx = this.layer - 1;
        for (let i = this.Items.length - 1; i >= 0; i--) {
            this.Items[i].active = i === idx;
            if (this.Items[i].active) {
                this.NodeBg = this.Items[i];
            }
        }
        this.spriteCustomizer = this.NodeBg.getComponent(SpriteCustomizer);
        this.labelCustomColor = this.NodeBg.getChildByName('Label').getComponent(LabelCustomColor);
    }

    private _TopLayerObject: TopLayerObject = null;
    /** 顶层的object对象，所有子层共用的数据存储对象 */
    public get TopLayerObject(): TopLayerObject {
        if (!this._TopLayerObject) {
            this.maskTopLayerObject();
        }
        return this._TopLayerObject;
    }

    /** 最高层 */
    public get topLayer(): number {
        if (!this._TopLayerObject) {
            return 1;
        }
        return this._TopLayerObject.maxLayer;
    }

    /** 索引 */
    private index: number = 0;
    /** 根索引 */
    private rootItem: MenuBarItem;
    /** 选中的回调器 */
    private selectEcecutor: Executor;
    /** 精灵帧替换脚本 */
    private spriteCustomizer: SpriteCustomizer;
    /** Label颜色替换脚本 */
    private labelCustomColor: LabelCustomColor;
    /** 红点数量 */
    private _redCount: number = 0;
    private set redCount(c: number) {
        const lastCount = this._redCount;
        this._redCount = c;
        if (lastCount > c) {
            const pm = this.node.parent.getComponent(MenuBarItem);
            if (pm) {
                pm.redCount--;
            }
        } else {
            const pm = this.node.parent.getComponent(MenuBarItem);
            if (pm) {
                pm.redCount++;
            }
        }
    }
    private get redCount(): number {
        return this._redCount;
    }
    private updateRedArgss: any[][] = [];
    private _showSpecial: number = 0;
    /**
     * 设置数据
     * @param childDatas 子菜单数据
     * @param index 当前索引
     * @param rootIndex 根菜单索引
     * @param selectEcecutor 选中回调器
     */
    public setData(childDatas: IMenuNameData, index: number, rootItem: MenuBarItem, selectEcecutor: Executor, showSpecial?: number): void {
        this.initNode();
        this.childDatas = childDatas;
        this._showSpecial = showSpecial;
        if (!showSpecial) {
            this.updateLabel(childDatas.name);
        } else {
            this.uptSpecial(showSpecial, childDatas.cfg);
        }

        this.index = index;
        this.rootItem = rootItem;
        this.selectEcecutor = selectEcecutor;
        this.NodeBg.targetOff(this);
        UtilGame.Click(this.NodeBg, this.onBtnClicked, this);
        this.updateNormallSelect(this.node);
    }

    /**
     * 刷新数据
     * @param childDatas 子菜单数据
     * @param index 当前索引
     * @param rootIndex 根菜单索引
     * @param selectEcecutor 选中回调器
     */
    public refreshData(childDatas: IMenuNameData, index: number, rootItem: MenuBarItem, selectEcecutor: Executor, showSpecial?: number): void {
        this.initNode();
        this.childDatas = childDatas;
        this._showSpecial = showSpecial;
        if (!showSpecial) {
            this.updateLabel(childDatas.name);
        } else {
            this.uptSpecial(showSpecial, childDatas.cfg);
        }

        this.index = index;
        this.rootItem = rootItem;
        this.selectEcecutor = selectEcecutor;
        this.NodeBg.targetOff(this);
        UtilGame.Click(this.NodeBg, this.onBtnClicked, this);
        this._refreshSub(this.childDatas);
    }

    private _special: number = 0;
    public set showSpecial(showSpecial: number) {
        this._special = showSpecial;
    }

    private getCurLayerSelectIndex(shift: boolean = true) {
        let selectIndex = -1;
        if (this.TopLayerObject.reds.length > 0) {
            if (this.childDatas.datas) {
                for (let i = 0, n = this.childDatas.datas.length; i < n; i++) {
                    if (this.TopLayerObject.reds[0] === this.childDatas.datas[i].cfg) {
                        selectIndex = this.index;
                        break;
                    }
                }
            } else if (this.TopLayerObject.reds[0] === this.childDatas.cfg) {
                selectIndex = this.index;
            }
        } else {
            selectIndex = 0;
        }
        if (this.TopLayerObject.selectIndexs && this.TopLayerObject.selectIndexs.length > 0) {
            selectIndex = this.TopLayerObject.selectIndexs[0];
            if (shift && this.index === this.TopLayerObject.selectIndexs[0]) {
                selectIndex = this.TopLayerObject.selectIndexs.shift();
            }
        }
        return selectIndex;
    }

    /** 更新默认选中 */
    private updateNormallSelect(target?: cc.Node, isClick?: boolean) {
        const selectIndex = this.getCurLayerSelectIndex();
        if (this.index === selectIndex) {
            this.showOrHideItem(target, isClick);
            this.select();
        } else {
            this.unselect();
        }
    }

    /** 初始化节点对象保存 */
    private initNode() {
        this.NodeBg = this.NodeBg || this.Items[this.layer - 1];
        this.spriteCustomizer = this.spriteCustomizer || this.NodeBg.getComponent(SpriteCustomizer);
        this.labelCustomColor = this.labelCustomColor || this.NodeBg.getChildByName('Label').getComponent(LabelCustomColor);
    }

    protected onLoad(): void {
        this.initNode();
    }

    /**
     * 选中节点，显示选中状态
     * @param node 节点
     */
    private select(node?: cc.Node) {
        const target = node?.getComponent(MenuBarItem) || this;
        target.spriteCustomizer.curIndex = ButtonState.Select;
        target.labelCustomColor.curIndex = ButtonState.Select;
        if (target.nodeJianTou?.node?.active) {
            const childNode = target.node.children[this.Items.length];
            if (childNode?.active) {
                target.nodeJianTou.curIndex = ButtonState.Select;
            } else {
                target.nodeJianTou.curIndex = ButtonState.Normall;
            }
        }
        target.isSelect = true;
        if (this._showSpecial === 1 && target.NodeBg) {
            const NdSelected = target.NodeBg.getChildByName('NdSelected');
            if (NdSelected) NdSelected.active = true;
        }
    }

    /**
     * 取消选中节点，显示未选中状态
     * @param node 节点
     */
    private unselect(node?: cc.Node) {
        const target = node?.getComponent(MenuBarItem) || this;
        target.spriteCustomizer.curIndex = ButtonState.Normall;
        target.labelCustomColor.curIndex = ButtonState.Normall;
        if (target.nodeJianTou?.node?.active) {
            target.nodeJianTou.curIndex = ButtonState.Normall;
        }
        target.isSelect = false;
        if (this._showSpecial === 1 && target.NodeBg) {
            const NdSelected = target.NodeBg.getChildByName('NdSelected');
            if (NdSelected) NdSelected.active = false;
        }
    }
    /**
     * 删除相同的同一层的兄弟节点
     */
    private delSomeBrotherNode() {
        if (this.node.parent) {
            const length = this.Items.length;
            this.node.parent.children.forEach((child) => {
                if (child.name === this.node.name) {
                    if (this.node !== child) {
                        this.delMenu(child, length);
                    }
                }
            });
        }
    }

    /** 更新选中状态 */
    private updateSelect() {
        if (this.node.parent) {
            this.node.parent.children.forEach((child) => {
                if (child.name === this.node.name) {
                    if (this.node === child) {
                        this.select(child);
                    } else {
                        this.unselect(child);
                    }
                }
            });
        }
    }

    /**
     * 更新菜单按钮的隐藏显示状态
     * @param target 点击的目标节点
     */
    private updateMenuActive(target?: cc.Node, isClick?: boolean) {
        this.node.children.forEach((node, index) => {
            if (index >= this.Items.length) {
                // 如果点击的是同个root，则不走选中逻辑
                if (!target || !this.isSelect || (isClick && target === this.node)) {
                    node.active = !node.active;
                }
                if (!this.TopLayerObject?.sharedData?.recordCurMenu || !this.isSelect || this.node !== target) {
                    node.getComponent(MenuBarItem).updateNormallSelect(target, isClick);
                }
            }
        });
    }

    /**
     * 显示隐藏
     * @param target 点击的目标节点
     * @returns
     */
    private showOrHideItem(target?: cc.Node, isClick?: boolean) {
        if (this.node.children.length > this.Items.length) {
            this.delSomeBrotherNode();
            this.updateMenuActive(target, isClick);
        } else if (this.childDatas.datas && this.childDatas.datas.length) {
            this.delSomeBrotherNode();
            this.addMenu(this.childDatas);
        } else if (this.selectEcecutor) {
            this.isSelect = true;
            this.selectEcecutor.invokeWithArgs(this.childDatas.cfg);
        }
        this.clickOtherHandle(target);
    }

    private isSelect = false;
    private onBtnClicked() {
        this.showOrHideItem(this.node, true);
        this.updateRedArgss.forEach((args) => {
            this.updateRedActive.apply(this, args);
        });
        this.updateRedArgss = [];
    }

    /**
     * 点击按钮处理
     */
    private clickOtherHandle(target?: cc.Node) {
        this.updateSelect();
        const func = this[`clickLayer${this.layer}`] as () => void;
        if (func) {
            func.call(this, target);
        }
    }

    /** 点击1层按钮 */
    private clickLayer1(target?: cc.Node) {
        //
    }

    /** 点击2层按钮 */
    private clickLayer2() {
        //
    }

    /** 点击3层按钮 */
    private clickLayer3() {
        //
    }

    /** 点击4层按钮 */
    private clickLayer4() {
        //
    }

    /** 更新按钮名字 */
    public updateLabel(name: string): void {
        const str: string = UtilString.GetLimitStr(name, 6);
        UtilCocos.SetString(this.NodeBg, 'Label', str);
    }

    /**
     * 更新特殊菜单里的状态：
     */
    public uptSpecial(special: number, cfg: any): void {
        if (special === 1) {
            const cfgTitle: ITitleCfg = cfg as ITitleCfg;
            if (this.NodeBg) {
                const NdTitle = this.NodeBg.getChildByName('NdTitle');
                const NdWear = this.NodeBg.getChildByName('NdWear');
                UtilTitle.setTitle(NdTitle, cfgTitle.Id, false, 0, !cfgTitle.IsActive);
                if (NdWear) NdWear.active = !!cfgTitle.IsWeared;
            }
        } else if (special === 2) {
            // 其它特殊类型
        }
    }

    /**
     * 删除/隐藏菜单
     * @param nodeMenu 节点
     * @param length 菜单开始索引
     * @param isClearFlag 是否清除标记
     */
    private delMenu(nodeMenu: cc.Node, length: number, isClearFlag = true) {
        for (let i = nodeMenu.children.length - 1; i >= length; i--) {
            if (this.TopLayerObject.createOrRecycleExecutor) {
                if (isClearFlag) {
                    nodeMenu.children[i].getComponent(MenuBarItem).unselect();
                }
                this.TopLayerObject.createOrRecycleExecutor.invokeWithArgs(nodeMenu.children[i]);
            } else {
                // nodeMenu.children[i].destroy();
                if (isClearFlag) {
                    nodeMenu.children[i].getComponent(MenuBarItem).unselect();
                }
                nodeMenu.children[i].active = false;
            }
            this.delMenu(nodeMenu.children[i], length, isClearFlag);
        }
    }

    private _refreshSub(childDatas: IMenuNameData) {
        // console.log('this.isSelect=', this.isSelect, childDatas);
        if (this.isSelect) {
            if (childDatas.datas && childDatas.datas.length) {
                for (let i = 0, n = childDatas.datas.length; i < n; i++) {
                    const c = childDatas.datas[i];
                    const node: cc.Node = this.node.children[this.Items.length + i];
                    if (node) {
                        const s = node.getComponent(MenuBarItem);
                        s.refreshData(c, i, this.rootItem, this.selectEcecutor, this._special);
                    }
                }
            }
        }
    }

    /**
     * 添加菜单
     * @param childDatas 子菜单数据
     */
    private addMenu(childDatas: IMenuNameData): void {
        if (childDatas.datas && childDatas.datas.length) {
            const addNodes: cc.Node[] = [];
            for (let i = 0, n = childDatas.datas.length; i < n; i++) {
                const c = childDatas.datas[i];
                let node: cc.Node = this.node.children[this.Items.length + i];
                if (this.TopLayerObject.createOrRecycleExecutor) {
                    node = node || this.TopLayerObject.createOrRecycleExecutor.invoke();
                } else {
                    node = node || cc.instantiate(this.node);
                }
                const s = node.getComponent(MenuBarItem);
                if (i === 0) {
                    if (!this._TopLayerObject && this._TopLayerObject === s._TopLayerObject) {
                        this.maskTopLayerObject();
                    }
                    this._TopLayerObject.maxLayer = this._TopLayerObject.maxLayer || this.layer;
                    while (this._TopLayerObject.maxLayer < (this.layer + 1)) {
                        this._TopLayerObject.maxLayer++;
                    }
                }
                s._TopLayerObject = this._TopLayerObject;
                s.layer = this.layer + 1;

                s.setData(c, i, this.rootItem, this.selectEcecutor, this._special);
                if (!this.node.children[this.Items.length + i]) {
                    addNodes.push(node);
                } else {
                    node.active = true;
                }
            }
            addNodes.forEach((node) => {
                this.node.addChild(node);
            });
            this.node.getComponent(cc.Layout).updateLayout();
        }
    }

    private maskTopLayerObject() {
        this._TopLayerObject = {
            maxLayer: this.layer,
            reds: [],
            createOrRecycleExecutor: null,
        };
    }

    private showRed() {
        if (this.layer !== this.topLayer) {
            return;
        }
        // 显示红点
        this.showRedDotPrefab();
        this.addRed(this.childDatas.cfg);
    }

    private hideRed() {
        if (this.layer !== this.topLayer) {
            return;
        }
        const redDot = this.NodeBg.getChildByName('RedDot');
        if (redDot) {
            redDot.destroy();
            this.NodeBg.removeChild(redDot);
        }
        this.delRed(this.childDatas.cfg);
    }

    private showRedDotPrefab() {
        const redDot = this.NodeBg.getChildByName('RedDot');
        if (redDot) {
            return;
        }
        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.Com_Reddot_RedDot, this.NodeBg, (e, n) => {
            if (e) return;
            if (!this.NodeBg || !this.NodeBg.isValid) return;
            const w = n.addComponent(cc.Widget);
            w.isAlignRight = true;
            w.isAlignTop = true;
            w.right = 0;
            w.top = 0;
        });
    }

    private addRed(cfg: number) {
        const index = this.TopLayerObject.reds.indexOf(cfg);
        if (index >= 0) {
            return index;
        }
        this.redCount++;
        return UtilArray.Insert(this.TopLayerObject.reds, cfg);
        // return this.TopLayerObject.reds.push(cfg);
    }

    private delRed(cfg: number) {
        const redIndex = this.TopLayerObject.reds.indexOf(cfg);
        if (redIndex >= 0) {
            this.redCount--;
            return this.TopLayerObject.reds.splice(redIndex, 1);
        } else {
            return this.TopLayerObject.reds;
        }
    }

    private cacheRedInfo(args: any[], argsIndex: number, childDatas: IMenuNameData) {
        if (childDatas.datas) {
            const index: number = args[argsIndex];
            if (childDatas.datas[index]) {
                this.cacheRedInfo(args, argsIndex + 1, childDatas.datas[index]);
            }
        } else if (!UtilBool.isNullOrUndefined(childDatas.cfg)) {
            if (args[0]) {
                this.addRed(childDatas.cfg);
            } else {
                this.delRed(childDatas.cfg);
            }
        }
    }

    public updateRedActive(active: boolean, ...args: any[]): void {
        if (this.layer !== this.topLayer) {
            const index = args.shift() as number;
            const node = this.node.children[index + this.Items.length];
            if (node) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                node.getComponent(MenuBarItem).updateRedActive(active, ...args);
            } else {
                args.unshift(index);
                args.unshift(active);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                this.updateRedArgss.push(args);
                this.cacheRedInfo(args, 1, this.childDatas);
            }
        } else if (active) {
            this.showRed();
        } else {
            this.hideRed();
        }

        if (this.layer !== this.topLayer) {
            if (active || this.redCount > 0) {
                this.showRedDotPrefab();
            } else {
                const redDot = this.NodeBg.getChildByName('RedDot');
                if (redDot) {
                    redDot.destroy();
                    this.NodeBg.removeChild(redDot);
                }
            }
        }
    }

    // private hasChildRed(childDatas: IMenuNameData): boolean {
    //     console.log('如果到了这里，那就有漏网之鱼，需要继续优化');
    //     if (this.TopLayerObject.reds.length > 0 && childDatas.datas) {
    //         for (let i = 0, n = childDatas.datas.length; i < n; i++) {
    //             if (childDatas.datas[i].datas) {
    //                 if (this.hasChildRed(childDatas.datas[i])) {
    //                     return true;
    //                 }
    //             } else if (childDatas.datas[i].cfg) {
    //                 if (this.TopLayerObject.reds.indexOf(childDatas.datas[i].cfg) >= 0) {
    //                     return true;
    //                 }
    //             }
    //         }
    //     }
    //     return false;
    // }

    protected onDestroy(): void {
        if (this._TopLayerObject && this._TopLayerObject.createOrRecycleExecutor) {
            this._TopLayerObject.createOrRecycleExecutor.clear();
            delete this._TopLayerObject.createOrRecycleExecutor;
        }
    }

    public makeDataMaxLayer(data: IMenuNameData): void {
        if (data.datas && data.datas[0]) {
            if (this.TopLayerObject.maxLayer < (this.layer + 1)) {
                this.TopLayerObject.maxLayer++;
            }
            this.makeDataMaxLayer(data.datas[0]);
        }
    }
}
