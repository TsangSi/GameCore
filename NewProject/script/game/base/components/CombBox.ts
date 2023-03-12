/* eslint-disable max-len */
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../utils/UtilGame';
import ListView from './listview/ListView';
import { SpriteCustomizer } from './SpriteCustomizer';

const { ccclass, property } = cc._decorator;

export interface CombBoxItemInfo {
    /** 名字 */
    Title: string;
    /** 扩展参数 */
    customData: any;
}

@ccclass
export class CombBox extends BaseCmp {
    @property(cc.Label)
    private curLabel: cc.Label = null;

    @property(cc.Node)
    private triangle: cc.Node = null;

    @property(ListView)
    private SrcListView: ListView = null;

    /** 收缩后的箭头旋转角度 */
    @property({ type: cc.Integer, tooltip: CC_DEV && '收缩后的箭头旋转角度' })
    private upAngle = -90;

    /** 展开后的箭头旋转角度 */
    @property({ type: cc.Integer, tooltip: CC_DEV && '展开后的箭头旋转角度' })
    private downAngle = 90;

    /** 是否下拉框 */
    private _DropDown = true;
    /**
     * 是否下拉框
     * 暂时无动态改变上下拉框的需求，有的话把私有改为公有，外部可以调用设置即可
     */
    @property({ type: cc.Boolean, tooltip: CC_DEV && '下拉框' })
    private set DropDown(b: boolean) { this._DropDown = b; this._updateShowState(true); }
    private get DropDown(): boolean { return this._DropDown; }

    /** 是否上拉框 */
    private _PullUp = !this._DropDown;
    /**
     * 是否上拉框
     * 暂时无动态改变上下拉框的需求，有的话把私有改为公有，外部可以调用设置即可
     */
    @property({ type: cc.Boolean, tooltip: CC_DEV && '上拉框' })
    public set PullUp(b: boolean) { this._PullUp = b; this.DropDown = !b; }
    public get PullUp(): boolean { return this._PullUp; }

    /**
     * 展开状态,单纯设置状态，无其它逻辑
     */
    private _Expand: boolean = false;
    @property({ type: cc.Boolean, tooltip: CC_DEV && '是否展开' })
    private set Expand(b: boolean) { this._Expand = b; this._setRotation(); this._updateScrollViewActive(); }
    private get Expand(): boolean { return this._Expand; }

    /** 选择的列表项 */
    private _index: number = -1;

    /** 列表数据 */
    private _list: CombBoxItemInfo[] = [];
    /** 是否已渲染 */
    private isRender = false;

    private func: (index: number) => void;
    private target: any = undefined;

    /** 是否有效的重置高度 */
    private isValidResetHeight = false;
    /** 单个item的高度 */
    private oneItemHeight = 45;

    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.triangle, this.onTriangleClicked, this);
        UtilGame.Click(this.node, this.onTriangleClicked, this);

        // this.node.on(cc.Node.EventType.TOUCH_END, this.onTriangleClicked, this);
    }

    /**
     * 设置展开还是收缩
     * @param b 是否展开
     */
    public setExpand(b: boolean): void {
        this.Expand = b;
        if (this._Expand) {
            this.doExpand();
        } else {
            this.doContract();
        }
    }

    private onTriangleClicked() {
        this.setExpand(!this._Expand);
        if (!this.isValidResetHeight) {
            this.resetScrollviewHeight(this.oneItemHeight);
        }
    }

    /**
     * 填充列表数据
     * @param list 需要填充的数据
     * @param height 列表最大高度
     * 例子：initList([{ Title: "全部", Quity: -1 }, { Title: "紫色品质", Quity: 3 }]， 200);
     */
    public initList(list: CombBoxItemInfo[], func: (index: number) => void, target: unknown): void {
        // 根据数组初始化下拉框中的各个选项内容
        this._list = list;
        this.isRender = false;
        this.func = func;
        this.target = target;
        this._updateLabelByIndex(0);
    }

    /**
     * 重置scrollview的高度，两个参数只传一个就可
     * @param itemHeight 单个item高
     * @param height 总高度
     */
    public resetScrollviewHeight(itemHeight: number = this.oneItemHeight, height: number = -1): void {
        let tmpHeight = 0;
        if (height === -1 && itemHeight) {
            const length = this._list.length;
            this.oneItemHeight = itemHeight;
            this.isValidResetHeight = length > 0;
            // 偏移值
            const offset = 10;
            tmpHeight = length * itemHeight + offset;
        } else {
            this.isValidResetHeight = true;
            tmpHeight = height;
        }
        const transNode = this.SrcListView.node;
        if (transNode) {
            if (this.PullUp) {
                const worldpos = transNode.convertToWorldSpaceAR(cc.v2(0, tmpHeight));
                const size = cc.view.getDesignResolutionSize();
                worldpos.y += this.node.height;
                if (worldpos.y > size.height) {
                    const offsetY = worldpos.y - size.height;
                    tmpHeight -= offsetY;
                }
            } else {
                const worldpos = transNode.convertToWorldSpaceAR(cc.v2(0, -tmpHeight));
                // let y = worldpos.y - tmpHeight;
                worldpos.y -= this.node.height;
                // y -= this.node._uiProps.uiTransformComp.height;
                if (worldpos.y < 0) {
                    tmpHeight -= Math.abs(worldpos.y);
                }
            }
            transNode.setContentSize(transNode.width, tmpHeight);
            // if (!this.SrcListView.isLoad) {
            // this.SrcListView.onChangeSize();
            // }
        }
    }

    // protected start(): void {
    //     // 选中第一个下拉项
    //     this.lblChange(0);
    // }
    /**
     * 旋转三角按钮
     */
    private rotateTrg() {
        // 旋转小三角形
        const angle = this.getCurAngle();
        cc.tween(this.triangle).to(0.2, { angle }, { easing: 'cubicOut' }).start();
    }

    /**
     * 刷新列表
     * @param item 列表项
     * @param idx 索引
     */
    private onRenderList(item: cc.Node, idx: number) {
        item.targetOff(this);
        const s = UtilCocos.GetComponent(cc.Sprite, item, 'bg');
        s.node.getComponent(SpriteCustomizer).curIndex = this._index === idx ? 1 : 0;
        UtilCocos.SetString(item, 'Label', this.getTitleByIndex(idx));
        UtilGame.Click(item, this.onSelectClicked, this, { customData: idx });
    }

    /** 选中事件 */
    private onSelectClicked(target: cc.Node, index: number, forceCallback = true) {
        if (this._Expand) {
            this.Expand = !this._Expand;
        }
        this._updateLabelByIndex(index);
        if (index >= 0 && forceCallback !== false) {
            if (this.target) {
                this.func.call(this.target, index);
            } else {
                this.func(index);
            }
        }
        this.rotateTrg();
    }

    /**
     * 选中指定索引，走正常点击选中的逻辑
     * @param index 索引
     * @param forceCallback 是否触发回调
     */
    public selectIndex(index: number, forceCallback = false): void {
        this.onSelectClicked(undefined, index, forceCallback);
    }

    /**
     * 选中指定文本
     * @param str 文本
     * @param forceCallback 是否触发回调
     */
    public selectLabel(str: string, forceCallback = false): void {
        const index = this.getIndexByStr(str);
        this.onSelectClicked(undefined, index, forceCallback);
        if (index < 0) {
            this._updateLabel(str);
        }
    }

    // /**
    //  * 根据指定索引设置对应的内容，不会触发选中的回调
    //  */
    // public updateLabelByIndex(index: number): void {
    //     this._updateLabelByIndex(index);
    // }

    // /**
    //  * 直接显示文本，如果该文本不在列表内，索引不会被改变
    //  *
    //  * 不会触发选中的回调
    //  * @param str 文本
    //  */
    // public updateLabel(str: string): void {
    //     const index = this.getIndexByStr(str);
    //     if (index >= 0) {
    //         this._updateLabelByIndex(index);
    //     } else {
    //         this._updateLabel(str);
    //     }
    // }

    /**
     * 根据文本获取对应的索引，没有就返回-1
     * @param str 文本
     * @returns -1 | 0 | 1 | 2 | ...
     */
    private getIndexByStr(str: string): number {
        for (let i = 0, n = this._list.length; i < n; i++) {
            if (this._list[i].Title === str) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 根据索引设置当前显示的文本
     * @param index 索引
     */
    private _updateLabelByIndex(index: number): void {
        if (this._index === index || index < 0) { return; }
        this._index = index;
        const str = this.getTitleByIndex(index);
        this._updateLabel(str);
    }

    private getTitleByIndex(index: number) {
        const info = this._list[index];
        if (info) {
            return info.Title;
        }
        return '';
    }

    /**
     * 当前选中项名称
     * @param index 列表项索引
     */
    private _updateLabel(str: string) {
        if (str) {
            this.curLabel.string = str;
        }
        // Utils.I.showRainBowStr(this._list[index].Title, this.curLabel, this._list[index].Quity);
    }

    /**
     * 获取当前选中的索引
     */
    private getIndex() {
        return this._index;
    }

    /**
     * 设置旋转角度
     * @param force 是否强制
     */
    private _updateShowState(force = false) {
        this.isRender = false;
        this.isValidResetHeight = false;
        this._PullUp = !this._DropDown;
        this._updateScrollViewPos(force);
        if (CC_EDITOR) {
            this._setRotation(force);
            if (CC_DEV && this.curLabel) {
                this.curLabel.string = this._PullUp ? '上拉框' : '下拉框';
            }
            // this.SrcListView.onChangeSize();
        } else if (!this.isValidResetHeight) {
            // this.SrcListView.layout.removeChilds(0);
            // this.scheduleOnce(() => {
            this.resetScrollviewHeight(this.oneItemHeight);
            // this.SrcListView.reset();
            this.showList(true);
            // }, 0);
        }
    }

    /**
     * 更新scrollview的位置
     * @param force 是否强制
     */
    private _updateScrollViewPos(force = false) {
        // 强制 或者 编辑器环境才进行处理
        if (force || CC_EDITOR) {
            if (this._DropDown) {
                if (this.SrcListView && this.SrcListView.node) {
                    this.SrcListView.node.anchorY = 1;
                    this.SrcListView.node.setPosition(0, -20);
                }
            } else if (this.SrcListView && this.SrcListView.node) {
                this.SrcListView.node.anchorY = 0;
                this.SrcListView.node.setPosition(0, 20);
            }
        }
    }

    /**
     * 设置旋转角度
     * @param force 是否强制
     */
    private _setRotation(force = false) {
        // 强制 或者 编辑器环境才进行处理
        if (force || CC_EDITOR) {
            if (this.triangle) {
                const angle = this.getCurAngle();
                // this.triangle.setRotationFromEuler(0, 0, angle);
                this.triangle.setRotation(0, 0, angle);
            }
        }
    }

    /**
     * 更新scrollview的active
     */
    private _updateScrollViewActive() {
        if (this.SrcListView && this.SrcListView.node && this.SrcListView.node.active !== this._Expand) {
            this.SrcListView.node.active = this._Expand;
        }
    }

    /** 获取当前需要旋转的角度 */
    private getCurAngle() {
        let expandAngle = this.downAngle;
        let contractAngle = this.upAngle;
        if (!this._PullUp) {
            expandAngle *= -1;
            contractAngle *= -1;
        }
        const angle = this._Expand ? expandAngle : contractAngle;
        return angle;
    }

    /** 展开 */
    private doExpand() {
        this.rotateTrg();
        this.showList();
    }

    /** 收缩 */
    private doContract() {
        this.rotateTrg();
        this._updateScrollViewActive();
    }

    private showList(isResetTotal = false) {
        if (!this.isRender || isResetTotal) {
            this.isRender = true;
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            // this.LayoutContent.total(this._list.length);
            this.SrcListView.setNumItems(this._list.length, this._index);
            // console.log('this.SrcListView.Total=', this.SrcListView.Total);
            // this.SrcListView.scrollToIndex(this._index);
        }
    }
}
