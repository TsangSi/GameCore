/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable dot-notation */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/** ****************************************
 * @author kL <klk0@qq.com>
 * @date 2019/6/6
 * @doc 列表组件.
 * @end
 ***************************************** */
import ListItem from './ListItem';

const {
    ccclass, property, disallowMultiple, menu, executionOrder, requireComponent,
} = cc._decorator;

enum SlideType {
    NORMAL = 1, // 普通
    ADHERING = 2, // 粘附模式，将强制关闭滚动惯性
    PAGE = 3, // 页面模式，将强制关闭滚动惯性
}

enum SelectedType {
    NONE = 0,
    SINGLE = 1, // 单选
    MULT = 2, // 多选
}

interface IChildInfo extends cc.Node {
    _listId: number,
    listItem?: ListItem
}

@ccclass
@disallowMultiple()
@menu('自定义组件/ListView')
@requireComponent(cc.ScrollView)
// 脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@executionOrder(-5000)
export default class ListView extends cc.Component {
    // 模板Item（cc.Node）
    @property({
        type: cc.Node,
        tooltip: CC_DEV && '模板Item',
        visible() { return !this.tmpPrefab; },
    })
    private tmpNode: cc.Node = null;
    // 模板Item（cc.Prefab）
    @property({
        type: cc.Prefab,
        tooltip: CC_DEV && '模板Item',
        visible() { return !this.tmpNode; },
    })
    private tmpPrefab: cc.Prefab = null;
    // 滑动模式
    @property
    private _slideMode: SlideType = SlideType.NORMAL;
    @property({
        type: cc.Enum(SlideType),
        tooltip: CC_DEV && '滑动模式',
    })
    public set slideMode(val: SlideType) {
        this._slideMode = val;
    }
    public get slideMode(): SlideType {
        return this._slideMode;
    }
    // 翻页作用距离
    @property({
        type: cc.Float,
        range: [0, 1, 0.1],
        tooltip: CC_DEV && '翻页作用距离',
        slide: true,
        visible() { return this._slideMode === SlideType.PAGE; },
    })
    public pageDistance: number = 0.3;
    // 页面改变事件
    @property({
        type: cc.Component.EventHandler,
        tooltip: CC_DEV && '页面改变事件',
        visible() { return this._slideMode === SlideType.PAGE; },
    })
    private pageChangeEvent: cc.Component.EventHandler = new cc.Component.EventHandler();
    // 是否为虚拟列表（动态列表）
    @property
    private _virtual: boolean = true;
    @property({
        type: cc.Boolean,
        tooltip: CC_DEV && '是否为虚拟列表（动态列表）',
    })
    private set virtual(val: boolean) {
        if (val != null) { this._virtual = val; }
        if (!CC_DEV && this._numItems !== 0) {
            this._onScrolling();
        }
    }
    private get virtual() {
        return this._virtual;
    }
    // 是否为循环列表
    @property({
        tooltip: CC_DEV && '是否为循环列表',
        visible() {
            const val: boolean = this.virtual && this.slideMode === SlideType.NORMAL;
            if (!val) { this.cyclic = false; }
            return val;
        },
    })
    public cyclic: boolean = false;
    // 缺省居中
    @property({
        tooltip: CC_DEV && 'Item数量不足以填满Content时，是否居中显示Item（不支持Grid布局）',
        visible() { return this.virtual; },
    })
    public lackCenter: boolean = false;
    // 缺省可滑动
    @property({
        tooltip: CC_DEV && 'Item数量不足以填满Content时，是否可滑动',
        visible() {
            const val: boolean = this.virtual && !this.lackCenter;
            if (!val) { this.lackSlide = false; }
            return val;
        },
    })
    public lackSlide: boolean = false;
    // 刷新频率
    @property
    private _updateRate: number = 0;
    @property({
        type: cc.Integer,
        range: [0, 6, 1],
        tooltip: CC_DEV && '刷新频率（值越大刷新频率越低、性能越高）',
        slide: true,
    })
    private set updateRate(val: number) {
        if (val >= 0 && val <= 6) {
            this._updateRate = val;
        }
    }
    private get updateRate() {
        return this._updateRate;
    }
    // 分帧渲染（每帧渲染的Item数量（<=0时关闭分帧渲染））
    @property({
        type: cc.Integer,
        range: [0, 12, 1],
        tooltip: CC_DEV && '逐帧渲染时，每帧渲染的Item数量（<=0时关闭分帧渲染）',
        slide: true,
    })
    public frameByFrameRenderNum: number = 0;
    // 渲染事件（渲染器）
    @property({
        type: cc.Component.EventHandler,
        tooltip: CC_DEV && '渲染事件（渲染器）',
    })
    private renderEvent: cc.Component.EventHandler = new cc.Component.EventHandler();
    // 选择模式
    @property({
        type: cc.Enum(SelectedType),
        tooltip: CC_DEV && '选择模式',
    })
    public selectedMode: SelectedType = SelectedType.NONE;
    @property({
        tooltip: CC_DEV && '是否重复响应单选事件',
        visible() { return this.selectedMode === SelectedType.SINGLE; },
    })
    public repeatEventSingle: boolean = false;
    // 触发选择事件
    @property({
        type: cc.Component.EventHandler,
        tooltip: CC_DEV && '触发选择事件',
        visible() { return this.selectedMode > SelectedType.NONE; },
    })
    private selectedEvent: cc.Component.EventHandler = null;
    // 当前选择id
    private _selectedId: number = -1;
    private _lastSelectedId: number = -1;
    private multSelected: number[];
    public set selectedId(val: number) {
        let item: cc.Node;
        switch (this.selectedMode) {
            case SelectedType.SINGLE: {
                if (!this.repeatEventSingle && val === this._selectedId) { return; }
                item = this.getItemByListId(val);
                // if (!item && val >= 0)
                //     return;
                let listItem: ListItem;
                if (this._selectedId >= 0) {
                    this._lastSelectedId = this._selectedId;
                } else { // 如果＜0则取消选择，把_lastSelectedId也置空吧，如果以后有特殊需求再改吧。
                    this._lastSelectedId = -1;
                }
                this._selectedId = val;
                if (item) {
                    listItem = item.getComponent(ListItem);
                    listItem.selected = true;
                }
                if (this._lastSelectedId >= 0 && this._lastSelectedId !== this._selectedId) {
                    const lastItem: cc.Node = this.getItemByListId(this._lastSelectedId);
                    if (lastItem) {
                        lastItem.getComponent(ListItem).selected = false;
                    }
                }
                if (this.selectedEvent) {
                    // cc.Component.EventHandler.emitEvents([this.selectedEvent], item, this._lastSelectedId == null ? null : this._lastSelectedId % this._actualNumItems);
                    cc.Component.EventHandler.emitEvents([this.selectedEvent], item, this.selectedId);
                }
                break;
            }
            case SelectedType.MULT: {
                item = this.getItemByListId(val);
                if (!item) { return; }
                const listItem = item.getComponent(ListItem);
                if (this._selectedId >= 0) { this._lastSelectedId = this._selectedId; }
                this._selectedId = val;
                const bool: boolean = !listItem.selected;
                listItem.selected = bool;
                const sub: number = this.multSelected.indexOf(val);
                if (bool && sub < 0) {
                    this.multSelected.push(val);
                } else if (!bool && sub >= 0) {
                    this.multSelected.splice(sub, 1);
                }
                if (this.selectedEvent) {
                    cc.Component.EventHandler.emitEvents([this.selectedEvent], item, this._lastSelectedId == null ? null : this._lastSelectedId % this._actualNumItems, bool);
                }
                break;
            }
            default:
                break;
        }
    }

    public get selectedId(): number {
        return this._selectedId;
    }

    /** 强制选中item */
    public forceSelectItem(index: number): void {
        this._selectedId = index;
        if (this.selectedEvent) {
            const item: cc.Node = this.getItemByListId(index);
            cc.Component.EventHandler.emitEvents([this.selectedEvent], item, this.selectedId);
        }
    }

    private _forceUpdate: boolean = false;
    private _align: number;
    private _horizontalDir: number;
    private _verticalDir: number;
    private _startAxis: number;
    private _alignCalcType: number;
    public content: cc.Node = null;
    private firstListId: number;
    public displayItemNum: number;
    private _updateDone: boolean = true;
    private _updateCounter: number;
    public _actualNumItems: number;
    private _cyclicNum: number;
    private _cyclicPos1: number;
    private _cyclicPos2: number;
    // 列表数量
    @property({
        serializable: false,
    })
    private _numItems: number = 0;
    private startShowIndex: number = 0;
    private endShowIndex: number = 0;
    /** 改变size标记，不马上渲染，改为下一帧渲染，有可能改变大小后，会重新设置NumItems， 也就不需要走改变大小的渲染了 */
    private changeSizeFlag: boolean = false;
    public setNumItems(val: number, index: number = undefined): void {
        if (!this.checkInited(false)) { return; }
        if (val == null || val < 0) {
            console.warn('numItems set the wrong::', val);
            return;
        }
        this.changeSizeFlag = false;
        this._actualNumItems = this._numItems = val;
        this._forceUpdate = true;
        this.startShowIndex = 0;
        if (this._virtual) {
            this._resizeContent();
            if (this.cyclic) {
                this._numItems *= this._cyclicNum;
            }
            let scrollResult = false;
            if (index !== undefined && index !== null) {
                this._calcViewPos();
                const data = this.getStartAndEndId();
                if (index <= data.curId || index >= data.endId) {
                    scrollResult = this.scrollTo(index);
                }
            }
            if (!scrollResult) {
                this._onScrolling();
            }
            if (!this.frameByFrameRenderNum && this.slideMode === SlideType.PAGE) { this.curPageNum = this.nearestListId; }
        } else {
            const layout: cc.Layout = this.content.getComponent(cc.Layout);
            if (layout) {
                layout.enabled = true;
            }
            this._delRedundantItem();

            this.firstListId = 0;
            if (this.frameByFrameRenderNum > 0) {
                // 先渲染几个出来
                const len: number = this.frameByFrameRenderNum > this._numItems ? this._numItems : this.frameByFrameRenderNum;
                for (let n: number = 0; n < len; n++) {
                    this._createOrUpdateItem2(n);
                }
                if (this.frameByFrameRenderNum < this._numItems) {
                    this._updateCounter = this.frameByFrameRenderNum;
                    this._updateDone = false;
                }
            } else {
                for (let n: number = 0; n < val; n++) {
                    this._createOrUpdateItem2(n);
                }
                this.displayItemNum = val;
            }
        }
    }

    private getCanStartShowIndex(index: number = undefined) {
        if (index === undefined || index === null) {
            this.startShowIndex = 0;
            return;
        }
        this.startShowIndex = index || 0;
        if (this.startShowIndex > 0) {
            this.startShowIndex = Math.min(this._numItems, index);
            let canShowNum = 0;
            if (this._align === cc.Layout.Type.VERTICAL) {
                canShowNum = Math.ceil(this.scrollView.content.parent.getContentSize().height / this.tmpNode.height);
            } else if (this._align === cc.Layout.Type.HORIZONTAL) {
                canShowNum = Math.ceil(this.scrollView.content.parent.getContentSize().width / this.tmpNode.width);
            } else if (this._align === cc.Layout.Type.GRID) {
                canShowNum = Math.ceil(this.scrollView.content.parent.getContentSize().height / this.tmpNode.height);
                const colum = Math.floor(this.scrollView.content.parent.getContentSize().width / this.tmpNode.width);
                canShowNum *= colum;
            }
            this.endShowIndex = this.startShowIndex + canShowNum;
            if (this.endShowIndex >= this._numItems) {
                this.startShowIndex = Math.min(this.endShowIndex, this._numItems - canShowNum);
                this.endShowIndex = this.startShowIndex + canShowNum;
            }
        }
    }
    public get numItems(): number {
        return this._actualNumItems;
    }

    private _inited: boolean = false;
    private _scrollView: cc.ScrollView = null;
    public get scrollView(): cc.ScrollView {
        return this._scrollView;
    }
    private _layout: cc.Layout = null;
    private _resizeMode: cc.Layout.ResizeMode;
    private _topGap: number;
    private _rightGap: number;
    private _bottomGap: number;
    private _leftGap: number;

    private _columnGap: number;
    private _lineGap: number;
    private _colLineNum: number;

    private _lastDisplayData: number[];
    public displayData: any[];
    private _pool: cc.NodePool;

    private _itemTmp: cc.Node = null;
    private _needUpdateWidget: boolean = false;
    private _itemSize: cc.Size;
    private _sizeType: boolean;

    public _customSize: any;

    private frameCount: number;
    private _aniDelRuning: boolean = false;
    private viewTop: number;
    private viewRight: number;
    private viewBottom: number;
    private viewLeft: number;

    private _doneAfterUpdate: boolean = false;

    private elasticTop: number;
    private elasticRight: number;
    private elasticBottom: number;
    private elasticLeft: number;

    private scrollToListId: number;

    private adhering: boolean = false;

    private _adheringBarrier: boolean = false;
    private nearestListId: number;

    public curPageNum: number = 0;
    private _beganPos: number;
    private _scrollPos: number;

    private _scrollToListId: number;
    private _scrollToEndTime: number;
    private _scrollToSo: any;

    private _lack: boolean;
    private _allItemSize: number;
    private _allItemSizeNoEdge: number;

    private _scrollItem: any;// 当前控制 cc.ScrollView 滚动的 Item

    //----------------------------------------------------------------------------

    protected onLoad(): void {
        this._init();
    }

    protected onDestroy(): void {
        if (this._itemTmp && this._itemTmp.isValid) { this._itemTmp.destroy(); }
        if (this.tmpNode && this.tmpNode.isValid) { this.tmpNode.destroy(); }
        // let total = this._pool.cc.size();
        while (this._pool && this._pool.size()) {
            const node = this._pool.get();
            node.destroy();
        }
        // if (total)
        //     log('-----------------' + t.node.name + '<List> destroy node total num. =>', total);
    }

    protected onEnable(): void {
        // if (!CC_EDITOR)
        this._registerEvent();
        this._init();
    }

    protected onDisable(): void {
        // if (!CC_EDITOR)
        this._unregisterEvent();
    }
    // 注册事件
    private _registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on('touch-up', this._onTouchUp, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this);
        this.node.on('scroll-began', this._onScrollBegan, this);
        this.node.on('scroll-ended', this._onScrollEnded, this);
        this.node.on('scrolling', this._onScrolling, this);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChanged, this);
    }
    // 卸载事件
    private _unregisterEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.off('touch-up', this._onTouchUp, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this);
        this.node.off('scroll-began', this._onScrollBegan, this);
        this.node.off('scroll-ended', this._onScrollEnded, this);
        this.node.off('scrolling', this._onScrolling, this);
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChanged, this);
    }
    // 初始化各种..
    private _init(): void {
        if (this._inited) { return; }
        if (this.tmpPrefab == null && this.tmpNode == null) {
            return;
        }
        this._scrollView = this.node.getComponent(cc.ScrollView);

        this.content = this._scrollView.content;
        if (!this.content) {
            console.warn(`${this.node.name}'s cc.ScrollView unset content!`);
            return;
        }

        this._layout = this.content.getComponent(cc.Layout);

        this._align = this._layout.type; // 排列模式
        this._resizeMode = this._layout.resizeMode; // 自适应模式
        this._startAxis = this._layout.startAxis;

        this._topGap = this._layout.paddingTop; // 顶边距
        this._rightGap = this._layout.paddingRight; // 右边距
        this._bottomGap = this._layout.paddingBottom; // 底边距
        this._leftGap = this._layout.paddingLeft; // 左边距

        this._columnGap = this._layout.spacingX; // 列距
        this._lineGap = this._layout.spacingY; // 行距

        this._colLineNum = 1; // 列数或行数（非GRID模式则=1，表示单列或单行）;

        this._verticalDir = this._layout.verticalDirection; // 垂直排列子节点的方向
        this._horizontalDir = this._layout.horizontalDirection; // 水平排列子节点的方向
        this.setTemplateItem(cc.instantiate(this.tmpPrefab || this.tmpNode));

        // 特定的滑动模式处理
        if (this._slideMode === SlideType.ADHERING || this._slideMode === SlideType.PAGE) {
            this._scrollView.inertia = false;
            // eslint-disable-next-line dot-notation
            this._scrollView['_onMouseWheel'] = () => { /* */ };
        }
        // lackCenter 仅支持 Virtual 模式
        if (!this.virtual) { this.lackCenter = false; }

        this._lastDisplayData = []; // 最后一次刷新的数据
        this.displayData = []; // 当前数据
        while (this._pool && this._pool.size()) {
            const node = this._pool.get();
            node.destroy();
        }
        this._pool = new cc.NodePool(); // 这是个池子..
        this._forceUpdate = false; // 是否强制更新
        this._updateCounter = 0; // 当前分帧渲染帧数
        this._updateDone = true; // 分帧渲染是否完成

        this.curPageNum = 0; // 当前页数

        if (this.cyclic || 0) {
            // eslint-disable-next-line dot-notation
            this._scrollView['_processAutoScrolling'] = this._processAutoScrolling.bind(this);
            // eslint-disable-next-line dot-notation
            this._scrollView['_startBounceBackIfNeeded'] = () => false;
            // this._scrollView._scrollChildren = function () {
            //     return false;
            // }
            // } else {
            //     this._scrollView['_processAutoScrolling'] = this._processAutoScrolling1.bind(this);
        }

        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL: {
                switch (this._horizontalDir) {
                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                        this._alignCalcType = 1;
                        break;
                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                        this._alignCalcType = 2;
                        break;
                    default:
                        break;
                }
                break;
            }
            case cc.Layout.Type.VERTICAL: {
                switch (this._verticalDir) {
                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                        this._alignCalcType = 3;
                        break;
                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                        this._alignCalcType = 4;
                        break;
                    default:
                        break;
                }
                break;
            }
            case cc.Layout.Type.GRID: {
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL:
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
                                this._alignCalcType = 3;
                                break;
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
                                this._alignCalcType = 4;
                                break;
                            default:
                                break;
                        }
                        break;
                    case cc.Layout.AxisDirection.VERTICAL:
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
                                this._alignCalcType = 1;
                                break;
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
                                this._alignCalcType = 2;
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
        // 清空 content
        // this.content.children.forEach((child: cc.Node) => {
        //     child.removeFromParent();
        //     if (child != this.tmpNode && child.isValid)
        //         child.destroy();
        // });
        // this.content.removeAllChildren();
        this._inited = true;
    }

    private testP = cc.v2(0, 0);
    private _processAutoScrolling1(dt: number) {
        const isAutoScrollBrake = this.scrollView['_isNecessaryAutoScrollBrake']();
        const brakingFactor = isAutoScrollBrake ? 0.05 : 1;
        this.scrollView['_autoScrollAccumulatedTime'] += dt * (1 / brakingFactor);

        let percentage = Math.min(1, this.scrollView['_autoScrollAccumulatedTime'] / this.scrollView['_autoScrollTotalTime']);
        if (this.scrollView['_autoScrollAttenuate']) {
            const time: number = percentage - 1;
            console.log('percentage=', percentage);
            percentage = time * time * time * time * time + 1;
            console.log('percentage=', percentage);
            // console.log('time=', time, percentage);
        }

        // console.log('percentage=', percentage);
        let newPosition = this.scrollView['_autoScrollStartPosition'].add(this.scrollView['_autoScrollTargetDelta'].mul(percentage));
        const EPSILON = this.scrollView['getScrollEndedEventTiming']();
        let reachedEnd = Math.abs(percentage - 1) <= EPSILON;

        const fireEvent = Math.abs(percentage - 1) <= EPSILON;
        if (fireEvent && !this.scrollView['_isScrollEndedWithThresholdEventFired']) {
            this.scrollView['_dispatchEvent']('scroll-ended-with-threshold');
            this.scrollView['_isScrollEndedWithThresholdEventFired'] = true;
        }

        if (this.scrollView.elastic) {
            let brakeOffsetPosition = newPosition.sub(this.scrollView['_autoScrollBrakingStartPosition']);
            if (isAutoScrollBrake) {
                brakeOffsetPosition = brakeOffsetPosition.mul(brakingFactor);
                // } else if (this.testP) {
                //     console.log('brakeOffsetPosition.y - this.testP.y=', brakeOffsetPosition.y - this.testP.y);
                //     this.testP.y = brakeOffsetPosition.y;
                // } else {
                //     this.testP.y = brakeOffsetPosition.y;
                //     console.log('2222brakeOffsetPosition=', brakeOffsetPosition.y);
            }
            newPosition = this.scrollView['_autoScrollBrakingStartPosition'].add(brakeOffsetPosition);
        } else {
            const moveDelta = newPosition.sub(this.scrollView.getContentPosition());
            const outOfBoundary = this.scrollView['_getHowMuchOutOfBoundary'](moveDelta);
            if (!outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
                newPosition = newPosition.add(outOfBoundary);
                reachedEnd = true;
            }
        }

        if (reachedEnd) {
            this.scrollView['_autoScrolling'] = false;
        }

        const deltaMove = newPosition.sub(this.scrollView['getContentPosition']());
        console.log('deltaMove=', newPosition.y, this.scrollView['getContentPosition']().y, deltaMove.y);
        this.scrollView['_moveContent'](this.scrollView['_clampDelta'](deltaMove), reachedEnd);
        this.scrollView['_dispatchEvent']('scrolling');

        // scollTo API controll move
        if (!this.scrollView['_autoScrolling']) {
            this.scrollView['_isBouncing'] = false;
            this.scrollView['_scrolling'] = false;
            this.scrollView['_dispatchEvent']('scroll-ended');
        }
    }

    /**
     * 为了实现循环列表，必须覆写ScrollView的某些函数
     * @param {Number} dt
     */
    private _processAutoScrolling(dt: number) {
        // let isAutoScrollBrake = this._scrollView._isNecessaryAutoScrollBrake();
        const brakingFactor: number = 1;
        this._scrollView['_autoScrollAccumulatedTime'] += dt * (1 / brakingFactor);

        let percentage: number = Math.min(1, this._scrollView['_autoScrollAccumulatedTime'] / this._scrollView['_autoScrollTotalTime']);
        if (this._scrollView['_autoScrollAttenuate']) {
            const time: number = percentage - 1;
            percentage = time * time * time * time * time + 1;
        }

        const _autoScrollTargetDelta = this._scrollView['_autoScrollTargetDelta'];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const newPosition = this._scrollView['_autoScrollStartPosition'].add(_autoScrollTargetDelta.multiplyScalar(percentage));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const EPSILON: number = this._scrollView['getScrollEndedEventTiming']();
        const reachedEnd: boolean = Math.abs(percentage - 1) <= EPSILON;
        // log(reachedEnd, Math.abs(percentage - 1), EPSILON)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const fireEvent: boolean = Math.abs(percentage - 1) <= this._scrollView['getScrollEndedEventTiming']();
        if (fireEvent && !this._scrollView['_isScrollEndedWithThresholdEventFired']) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this._scrollView['_dispatchEvent']('scroll-ended-with-threshold');
            this._scrollView['_isScrollEndedWithThresholdEventFired'] = true;
        }

        // if (this._scrollView.elastic && !reachedEnd) {
        //     let brakeOffsetPosition = newPosition.sub(this._scrollView._autoScrollBrakingStartPosition);
        //     if (isAutoScrollBrake) {
        //         brakeOffsetPosition = brakeOffsetPosition.mul(brakingFactor);
        //     }
        //     newPosition = this._scrollView._autoScrollBrakingStartPosition.add(brakeOffsetPosition);
        // } else {
        //     let moveDelta = newPosition.sub(this._scrollView.getContentPosition());
        //     let outOfBoundary = this._scrollView._getHowMuchOutOfBoundary(moveDelta);
        //     if (!outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
        //         newPosition = newPosition.add(outOfBoundary);
        //         reachedEnd = true;
        //     }
        // }

        if (reachedEnd) {
            this._scrollView['_autoScrolling'] = false;
        }

        let deltaMove: any = newPosition.subtract(this._scrollView.getContentPosition());
        // log(deltaMove)
        deltaMove = this._scrollView['_clampDelta'](deltaMove);
        this._scrollView['_moveContent'](deltaMove, reachedEnd);
        this._scrollView['_dispatchEvent']('scrolling');
        // scollTo API controll move
        if (!this._scrollView['_autoScrolling']) {
            this._scrollView['_isBouncing'] = false;
            this._scrollView['_scrolling'] = false;
            this._scrollView['_dispatchEvent']('scroll-ended');
        }
    }

    /** 获取模板Item */
    public getTempLateItemNode(): cc.Node {
        return this.tmpNode;
    }
    // 设置模板Item
    public setTemplateItem(item: cc.Node | cc.Prefab): void {
        if (!item) { return; }
        // if (this.tmpNode == null) {
        if (item instanceof cc.Prefab) {
            this.tmpNode = cc.instantiate(item);
            this._itemTmp = this.tmpNode;
        } else if (item instanceof cc.Node) {
            this.tmpNode = item;
            this._itemTmp = item;
        }
        // this._init();
        // return;
        // }
        this._itemTmp.setPosition(0, 0);

        if (this._resizeMode === cc.Layout.ResizeMode.CHILDREN) {
            this._itemSize = this._layout.cellSize;
        } else {
            const size = this._itemTmp.getContentSize();
            this._itemSize = new cc.Size(size.width, size.height);
        }

        // 获取ListItem，如果没有就取消选择模式
        const com = this._itemTmp.getComponent(ListItem);
        let remove = false;
        if (!com) { remove = true; }
        // if (com) {
        //     if (!com._btnCom && !item.getComponent(cc.Button)) {
        //         remove = true;
        //     }
        // }
        if (remove) {
            this.selectedMode = SelectedType.NONE;
        }
        const w = this._itemTmp.getComponent(cc.Widget);
        if (w && w.enabled) {
            this._needUpdateWidget = true;
        }
        // const dan = item.getComponent(DAN);
        // if (!dan) {
        //     item.addComponent(DAN);
        // }
        if (this.selectedMode === SelectedType.MULT) { this.multSelected = []; }

        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                this._colLineNum = 1;
                this._sizeType = false;
                break;
            case cc.Layout.Type.VERTICAL:
                this._colLineNum = 1;
                this._sizeType = true;
                break;
            case cc.Layout.Type.GRID:
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL: {
                        // 计算列数
                        const trimW: number = this.content.width - this._leftGap - this._rightGap;
                        this._colLineNum = Math.floor((trimW + this._columnGap) / (this._itemSize.width + this._columnGap));
                        this._sizeType = true;
                        break;
                    }
                    case cc.Layout.AxisDirection.VERTICAL: {
                        // 计算行数
                        const trimH: number = this.content.height - this._topGap - this._bottomGap;
                        this._colLineNum = Math.floor((trimH + this._lineGap) / (this._itemSize.height + this._lineGap));
                        this._sizeType = false;
                        break;
                    }
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }
    /**
     * 检查是否初始化
     * @param {Boolean} printLog 是否打印错误信息
     * @returns
     */
    public checkInited(printLog: boolean = true): boolean {
        if (!this._inited) {
            if (printLog) { console.warn('List initialization not completed!'); }
            return false;
        }
        return true;
    }
    private get viewSize() {
        return this.scrollView.content.parent.getContentSize();
    }
    // 禁用 cc.Layout 组件，自行计算 Content cc.Size
    private _resizeContent() {
        let result: number;

        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL: {
                if (this._customSize) {
                    const fixed = this._getFixedSize(null);
                    result = this._leftGap + fixed.val + (this._itemSize.width * (this._numItems - fixed.count)) + (this._columnGap * (this._numItems - 1)) + this._rightGap;
                } else {
                    result = this._leftGap + (this._itemSize.width * this._numItems) + (this._columnGap * (this._numItems - 1)) + this._rightGap;
                }
                break;
            }
            case cc.Layout.Type.VERTICAL: {
                if (this._customSize) {
                    const fixed = this._getFixedSize(null);
                    result = this._topGap + fixed.val + (this._itemSize.height * (this._numItems - fixed.count)) + (this._lineGap * (this._numItems - 1)) + this._bottomGap;
                } else {
                    result = this._topGap + (this._itemSize.height * this._numItems) + (this._lineGap * (this._numItems - 1)) + this._bottomGap;
                }
                break;
            }
            case cc.Layout.Type.GRID: {
                // 网格模式不支持居中
                if (this.lackCenter) { this.lackCenter = false; }
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL: {
                        const lineNum: number = Math.ceil(this._numItems / this._colLineNum);
                        result = this._topGap + (this._itemSize.height * lineNum) + (this._lineGap * (lineNum - 1)) + this._bottomGap;
                        break;
                    }
                    case cc.Layout.AxisDirection.VERTICAL: {
                        const colNum: number = Math.ceil(this._numItems / this._colLineNum);
                        result = this._leftGap + (this._itemSize.width * colNum) + (this._columnGap * (colNum - 1)) + this._rightGap;
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
        if (!this.content || !this.content['_components']) {
            return;
        }
        const layout: cc.Layout = this.content.getComponent(cc.Layout);
        if (layout) { layout.enabled = false; }

        this._allItemSize = result;
        this._allItemSizeNoEdge = this._allItemSize - (this._sizeType ? this._topGap + this._bottomGap : this._leftGap + this._rightGap);

        let _cyclicAllItemSize = 0;
        if (this.cyclic) {
            let totalSize: number = this._sizeType ? this.viewSize.height : this.viewSize.width;

            this._cyclicPos1 = 0;
            totalSize -= this._cyclicPos1;
            this._cyclicNum = Math.ceil(totalSize / this._allItemSizeNoEdge) + 1;
            const spacing: number = this._sizeType ? this._lineGap : this._columnGap;
            this._cyclicPos2 = this._cyclicPos1 + this._allItemSizeNoEdge + spacing;
            _cyclicAllItemSize = this._allItemSize + (this._allItemSizeNoEdge * (this._cyclicNum - 1)) + (spacing * (this._cyclicNum - 1));
            // this._cycilcAllItemSizeNoEdge = this._allItemSizeNoEdge * this._cyclicNum;
            // this._cycilcAllItemSizeNoEdge += spacing * (this._cyclicNum - 1);
            // log('_cyclicNum ->', this._cyclicNum, this._allItemSizeNoEdge, this._allItemSize, this._cyclicPos1, this._cyclicPos2);
        }

        this._lack = !this.cyclic && this._allItemSize < (this._sizeType ? this.viewSize.height : this.viewSize.width);
        const slideOffset: number = (!this._lack || !this.lackCenter) && this.lackSlide ? 0 : 0.1;
        let targetWH = 0;
        if (this._lack) {
            if (this._sizeType) {
                targetWH = this.viewSize.height - slideOffset;
            } else {
                targetWH = this.viewSize.width - slideOffset;
            }
        } else if (this.cyclic) {
            targetWH = _cyclicAllItemSize;
        } else {
            targetWH = this._allItemSize;
        }
        // let targetWH: number = this._lack ? (this._sizeType ? this.viewSize.height : this.viewSize.width) - slideOffset : this.cyclic ? _cyclicAllItemSize : this._allItemSize;
        if (targetWH < 0) { targetWH = 0; }

        if (this._sizeType) {
            this.content.height = targetWH;
        } else {
            this.content.width = targetWH;
        }

        // log('_resizeContent()  numItems =', t._numItems, '，content =', t.content);
    }

    // 滚动进行时...
    private _onScrolling(ev: Event = null) {
        if (this.frameCount == null) { this.frameCount = this._updateRate; }
        if (!this._forceUpdate && (ev && ev.type !== 'scroll-ended') && this.frameCount > 0) {
            this.frameCount--;
            return;
        } else { this.frameCount = this._updateRate; }

        if (this._aniDelRuning) { return; }

        // 循环列表处理
        if (this.cyclic) {
            let scrollPos: any = this.scrollView.getContentPosition();
            scrollPos = this._sizeType ? scrollPos.y : scrollPos.x;

            const addVal = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap);
            const add: any = this._sizeType ? cc.v2(0, addVal) : cc.v2(addVal, 0);

            switch (this._alignCalcType) {
                case 1:// 单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                    if (scrollPos > -this._cyclicPos1) {
                        this.content.x = -this._cyclicPos2;
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                        }
                        // if (this._beganPos) {
                        //     this._beganPos += add;
                        // }
                    } else if (scrollPos < -this._cyclicPos2) {
                        this.content.x = -this._cyclicPos1;
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                        }
                        // if (this._beganPos) {
                        //     this._beganPos -= add;
                        // }
                    }
                    break;
                case 2:// 单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                    if (scrollPos < this._cyclicPos1) {
                        this.content.x = this._cyclicPos2;
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                        }
                    } else if (scrollPos > this._cyclicPos2) {
                        this.content.x = this._cyclicPos1;
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                        }
                    }
                    break;
                case 3:// 单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                    if (scrollPos < this._cyclicPos1) {
                        this.content.y = this._cyclicPos2;
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                        }
                    } else if (scrollPos > this._cyclicPos2) {
                        this.content.y = this._cyclicPos1;
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                        }
                    }
                    break;
                case 4:// 单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                    if (scrollPos > -this._cyclicPos1) {
                        this.content.y = -this._cyclicPos2;
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                        }
                    } else if (scrollPos < -this._cyclicPos2) {
                        this.content.y = -this._cyclicPos1;
                        if (this._scrollView.isAutoScrolling()) {
                            this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        this._calcViewPos();
        if (this._virtual) {
            if (this._customSize) {
                this.displayData = this.getCustomSizeDatas();
            } else {
                this.displayData = this.getDisplayDatas();
            }
            this._delRedundantItem();
            if (this.displayData.length <= 0 || !this._numItems) { // if none, delete all.
                this._lastDisplayData = [];
                return;
            }
            this.displayItemNum = this.displayData.length;
            const len: number = this._lastDisplayData.length;

            let haveDataChange: boolean = this.displayItemNum !== len;
            if (haveDataChange) {
                // 如果是逐帧渲染，需要排序
                if (this.frameByFrameRenderNum > 0) {
                    this._lastDisplayData.sort((a, b) => a - b);
                }
                // 因List的显示数据是有序的，所以只需要判断数组长度是否相等，以及头、尾两个元素是否相等即可。
                this.firstListId = this.displayData[0].id;
                haveDataChange = this.firstListId !== this._lastDisplayData[0] || this.displayData[this.displayItemNum - 1].id !== this._lastDisplayData[len - 1];
            }
            if (this._forceUpdate || haveDataChange) { // 如果是强制更新
                if (this.frameByFrameRenderNum > 0) {
                    // if (this._updateDone) {
                    // this._lastDisplayData = [];
                    // 逐帧渲染
                    if (this._numItems > 0) {
                        if (!this._updateDone) {
                            this._doneAfterUpdate = true;
                        } else {
                            this._updateCounter = 0;
                        }
                        this._updateDone = false;
                    } else {
                        this._updateCounter = 0;
                        this._updateDone = true;
                    }
                    // }
                } else {
                    // 直接渲染
                    this._lastDisplayData = [];
                    // log('List Display Data II::', this.displayData);
                    for (let c = 0; c < this.displayItemNum; c++) {
                        this._createOrUpdateItem(this.displayData[c]);
                    }
                    this._forceUpdate = false;
                }
            }
            this._calcNearestItem();
        }
    }

    /** 获取自定义size的data数据 */
    private getCustomSizeDatas() {
        const displayData = [];
        const endId: number = this._numItems - 1;
        let breakFor: boolean = false;
        let itemPos;
        // 如果该item的位置在可视区域内，就推入displayData
        for (let curId = 0; curId <= endId && !breakFor; curId++) {
            itemPos = this._calcItemPos(curId);
            switch (this._align) {
                case cc.Layout.Type.HORIZONTAL:
                    if (itemPos.right >= this.viewLeft && itemPos.left <= this.viewRight) {
                        displayData.push(itemPos);
                    } else if (curId !== 0 && displayData.length > 0) {
                        breakFor = true;
                    }
                    break;
                case cc.Layout.Type.VERTICAL:
                    if (itemPos.bottom <= this.viewTop && itemPos.top >= this.viewBottom) {
                        displayData.push(itemPos);
                    } else if (curId !== 0 && displayData.length > 0) {
                        breakFor = true;
                    }
                    break;
                case cc.Layout.Type.GRID:
                    switch (this._startAxis) {
                        case cc.Layout.AxisDirection.HORIZONTAL:
                            if (itemPos.bottom <= this.viewTop && itemPos.top >= this.viewBottom) {
                                displayData.push(itemPos);
                            } else if (curId !== 0 && displayData.length > 0) {
                                breakFor = true;
                            }
                            break;
                        case cc.Layout.AxisDirection.VERTICAL:
                            if (itemPos.right >= this.viewLeft && itemPos.left <= this.viewRight) {
                                displayData.push(itemPos);
                            } else if (curId !== 0 && displayData.length > 0) {
                                breakFor = true;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        }
        return displayData;
    }

    /** 获取正常size的data数据 */
    private getDisplayDatas() {
        const displayData = [];
        const indexData = this.getStartAndEndId();
        for (let curId = indexData.curId; curId <= indexData.endId; curId++) {
            displayData.push(this._calcItemPos(curId));
        }
        return displayData;
    }

    /** 获取起始和结尾索引id */
    private getStartAndEndId() {
        let curId = 0;
        let endId = 0;
        const ww: number = this._itemSize.width + this._columnGap;
        const hh: number = this._itemSize.height + this._lineGap;
        switch (this._alignCalcType) {
            case 1:// 单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                curId = this.viewLeft /** + this._leftGap */ / ww;
                endId = this.viewRight /** + this._rightGap */ / ww;
                break;
            case 2:// 单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                curId = -this.viewRight /** - this._rightGap */ / ww;
                endId = -this.viewLeft /** - this._leftGap */ / ww;
                break;
            case 3:// 单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                curId = -this.viewTop /** - this._topGap */ / hh;
                endId = -this.viewBottom /** - this._bottomGap */ / hh;
                break;
            case 4:// 单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                curId = this.viewBottom /** + this._bottomGap */ / hh;
                endId = this.viewTop /** + this._topGap */ / hh;
                break;
            default:
                break;
        }
        curId = Math.floor(curId) * this._colLineNum;
        endId = Math.ceil(endId) * this._colLineNum;
        endId--;
        if (curId < 0) { curId = 0; }
        if (endId >= this._numItems) { endId = this._numItems - 1; }
        return { curId, endId };
    }
    // 计算可视范围
    private _calcViewPos() {
        if (!this.content) return;
        const scrollPos: any = this.content.getPosition();
        switch (this._alignCalcType) {
            case 1:// 单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                this.elasticLeft = scrollPos.x > 0 ? scrollPos.x : 0;
                this.viewLeft = (scrollPos.x < 0 ? -scrollPos.x : 0) - this.elasticLeft;
                this.viewRight = this.viewLeft + this.node.width;
                this.elasticRight = this.viewRight > this.content.width ? Math.abs(this.viewRight - this.content.width) : 0;
                this.viewRight += this.elasticRight;
                // log(this.elasticLeft, this.elasticRight, this.viewLeft, this.viewRight);
                break;
            case 2:// 单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                this.elasticRight = scrollPos.x < 0 ? -scrollPos.x : 0;
                this.viewRight = (scrollPos.x > 0 ? -scrollPos.x : 0) + this.elasticRight;
                this.viewLeft = this.viewRight - this.node.width;
                this.elasticLeft = this.viewLeft < -this.content.width ? Math.abs(this.viewLeft + this.content.width) : 0;
                this.viewLeft -= this.elasticLeft;
                // log(this.elasticLeft, this.elasticRight, this.viewLeft, this.viewRight);
                break;
            case 3:// 单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                this.elasticTop = scrollPos.y < 0 ? Math.abs(scrollPos.y) : 0;
                this.viewTop = (scrollPos.y > 0 ? -scrollPos.y : 0) + this.elasticTop;
                this.viewBottom = this.viewTop - this.node.height;
                this.elasticBottom = this.viewBottom < -this.content.height ? Math.abs(this.viewBottom + this.content.height) : 0;
                this.viewBottom += this.elasticBottom;
                // log(this.elasticTop, this.elasticBottom, this.viewTop, this.viewBottom);
                break;
            case 4:// 单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                this.elasticBottom = scrollPos.y > 0 ? Math.abs(scrollPos.y) : 0;
                this.viewBottom = (scrollPos.y < 0 ? -scrollPos.y : 0) - this.elasticBottom;
                this.viewTop = this.viewBottom + this.node.height;
                this.elasticTop = this.viewTop > this.content.height ? Math.abs(this.viewTop - this.content.height) : 0;
                this.viewTop -= this.elasticTop;
                // log(this.elasticTop, this.elasticBottom, this.viewTop, this.viewBottom);
                break;
            default:
                break;
        }
    }
    // 计算位置 根据id
    private _calcItemPos(id: number) {
        let width: number; let height: number; let top: number; let bottom: number; let left: number; let right: number; let itemX: number; let itemY: number;
        if (!this._itemSize) return {};
        switch (this._align) {
            case cc.Layout.Type.HORIZONTAL:
                switch (this._horizontalDir) {
                    case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT: {
                        if (this._customSize) {
                            const fixed = this._getFixedSize(id);
                            left = this._leftGap + ((this._itemSize.width + this._columnGap) * (id - fixed.count)) + (fixed.val + (this._columnGap * fixed.count));
                            const cs: number = this._customSize[id];
                            width = cs > 0 ? cs : this._itemSize.width;
                        } else {
                            left = this._leftGap + ((this._itemSize.width + this._columnGap) * id);
                            width = this._itemSize.width;
                        }
                        right = left + width;
                        if (this.lackCenter) {
                            const offset: number = (this.content.width / 2) - (this._allItemSizeNoEdge / 2);
                            left += offset;
                            right += offset;
                        }
                        return {
                            id,
                            left,
                            right,
                            x: left + (this._itemTmp.anchorX * width),
                            y: this._itemTmp.position.y,
                        };
                    }
                    case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT: {
                        if (this._customSize) {
                            const fixed = this._getFixedSize(id);
                            right = -this._rightGap - ((this._itemSize.width + this._columnGap) * (id - fixed.count)) - (fixed.val + (this._columnGap * fixed.count));
                            const cs: number = this._customSize[id];
                            width = cs > 0 ? cs : this._itemSize.width;
                        } else {
                            right = -this._rightGap - ((this._itemSize.width + this._columnGap) * id);
                            width = this._itemSize.width;
                        }
                        left = right - width;
                        if (this.lackCenter) {
                            const offset: number = (this.content.width / 2) - (this._allItemSizeNoEdge / 2);
                            left -= offset;
                            right -= offset;
                        }
                        return {
                            id,
                            right,
                            left,
                            x: left + (this._itemTmp.anchorX * width),
                            y: this._itemTmp.position.y,
                        };
                    }
                    default:
                        break;
                }
                break;
            case cc.Layout.Type.VERTICAL: {
                switch (this._verticalDir) {
                    case cc.Layout.VerticalDirection.TOP_TO_BOTTOM: {
                        if (this._customSize) {
                            const fixed = this._getFixedSize(id);
                            top = -this._topGap - ((this._itemSize.height + this._lineGap) * (id - fixed.count)) - (fixed.val + (this._lineGap * fixed.count));
                            const cs: number = this._customSize[id];
                            height = cs > 0 ? cs : this._itemSize.height;
                        } else {
                            top = -this._topGap - ((this._itemSize.height + this._lineGap) * id);
                            height = this._itemSize.height;
                        }
                        bottom = top - height;
                        if (this.lackCenter) {
                            const offset: number = (this.content.height / 2) - (this._allItemSizeNoEdge / 2);
                            top -= offset;
                            bottom -= offset;
                        }
                        return {
                            id,
                            top,
                            bottom,
                            x: this._itemTmp.position.x,
                            y: bottom + (this._itemTmp.anchorY * height),
                        };
                    }
                    case cc.Layout.VerticalDirection.BOTTOM_TO_TOP: {
                        if (this._customSize) {
                            const fixed = this._getFixedSize(id);
                            bottom = this._bottomGap + ((this._itemSize.height + this._lineGap) * (id - fixed.count)) + (fixed.val + (this._lineGap * fixed.count));
                            const cs: number = this._customSize[id];
                            height = cs > 0 ? cs : this._itemSize.height;
                        } else {
                            bottom = this._bottomGap + ((this._itemSize.height + this._lineGap) * id);
                            height = this._itemSize.height;
                        }
                        top = bottom + height;
                        if (this.lackCenter) {
                            const offset: number = (this.content.height / 2) - (this._allItemSizeNoEdge / 2);
                            top += offset;
                            bottom += offset;
                        }
                        return {
                            id,
                            top,
                            bottom,
                            x: this._itemTmp.position.x,
                            y: bottom + (this._itemTmp.anchorY * height),
                        };
                        break;
                    }
                    default:
                        break;
                }
                break;
            }
            case cc.Layout.Type.GRID: {
                const colLine: number = Math.floor(id / this._colLineNum);
                switch (this._startAxis) {
                    case cc.Layout.AxisDirection.HORIZONTAL: {
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM: {
                                top = -this._topGap - ((this._itemSize.height + this._lineGap) * colLine);
                                bottom = top - this._itemSize.height;
                                itemY = bottom + (this._itemTmp.anchorY * this._itemSize.height);
                                break;
                            }
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP: {
                                bottom = this._bottomGap + ((this._itemSize.height + this._lineGap) * colLine);
                                top = bottom + this._itemSize.height;
                                itemY = bottom + (this._itemTmp.anchorY * this._itemSize.height);
                                break;
                            }
                            default:
                                break;
                        }
                        itemX = this._leftGap + ((id % this._colLineNum) * (this._itemSize.width + this._columnGap));
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT: {
                                itemX += this._itemTmp.anchorX * this._itemSize.width;
                                itemX -= this.content.anchorX * this.content.width;
                                break;
                            }
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT: {
                                itemX += (1 - this._itemTmp.anchorX) * this._itemSize.width;
                                itemX -= (1 - this.content.anchorX) * this.content.width;
                                itemX *= -1;
                                break;
                            }
                            default:
                                break;
                        }
                        return {
                            id,
                            top,
                            bottom,
                            x: itemX,
                            y: itemY,
                        };
                    }
                    case cc.Layout.AxisDirection.VERTICAL: {
                        switch (this._horizontalDir) {
                            case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT: {
                                left = this._leftGap + ((this._itemSize.width + this._columnGap) * colLine);
                                right = left + this._itemSize.width;
                                itemX = left + (this._itemTmp.anchorX * this._itemSize.width);
                                itemX -= this.content.anchorX * this.content.width;
                                break;
                            }
                            case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT: {
                                right = -this._rightGap - ((this._itemSize.width + this._columnGap) * colLine);
                                left = right - this._itemSize.width;
                                itemX = left + (this._itemTmp.anchorX * this._itemSize.width);
                                itemX += (1 - this.content.anchorX) * this.content.width;
                                break;
                            }
                            default:
                                break;
                        }
                        itemY = -this._topGap - ((id % this._colLineNum) * (this._itemSize.height + this._lineGap));
                        switch (this._verticalDir) {
                            case cc.Layout.VerticalDirection.TOP_TO_BOTTOM: {
                                itemY -= (1 - this._itemTmp.anchorY) * this._itemSize.height;
                                itemY += (1 - this.content.anchorY) * this.content.height;
                                break;
                            }
                            case cc.Layout.VerticalDirection.BOTTOM_TO_TOP: {
                                itemY -= this._itemTmp.anchorY * this._itemSize.height;
                                itemY += this.content.anchorY * this.content.height;
                                itemY *= -1;
                                break;
                            }
                            default:
                                break;
                        }
                        return {
                            id,
                            left,
                            right,
                            x: itemX,
                            y: itemY,
                        };
                    }
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
        return {
            id,
            top,
            bottom,
            x: itemX,
            y: itemY,
        };
    }
    // 计算已存在的Item的位置
    private _calcExistItemPos(id: number) {
        const item = this.getItemByListId(id);
        if (!item) { return null; }
        const data: any = {
            id,
            x: item.position.x,
            y: item.position.y,
        };
        if (this._sizeType) {
            data.top = item.position.y + (item.height * (1 - item.anchorY));
            data.bottom = item.position.y - (item.height * item.anchorY);
        } else {
            data.left = item.position.x - (item.width * item.anchorX);
            data.right = item.position.x + (item.width * (1 - item.anchorX));
        }
        return data;
    }
    // 获取Item位置
    public getItemPos(id: number): {
        id?: number;
        left?: number;
        right?: number;
        x?: number;
        y?: number;
        top?: number;
        bottom?: number;
    } {
        if (this._virtual) {
            return this._calcItemPos(id);
        } else if (this.frameByFrameRenderNum) {
            return this._calcItemPos(id);
        } else {
            return this._calcExistItemPos(id);
        }
    }
    // 获取固定尺寸
    private _getFixedSize(listId: number) {
        if (!this._customSize) { return null; }
        if (listId == null) { listId = this._numItems; }
        let fixed: number = 0;
        let count: number = 0;
        for (const id in this._customSize) {
            if (parseInt(id) < listId) {
                fixed += this._customSize[id];
                count++;
            }
        }
        return {
            val: fixed,
            count,
        };
    }
    // 滚动结束时..
    private _onScrollBegan() {
        this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
    }
    // 滚动结束时..
    private _onScrollEnded() {
        if (this.scrollToListId != null) {
            const item: any = this.getItemByListId(this.scrollToListId);
            this.scrollToListId = null;
            if (item) {
                cc.tween(item).to(0.1, { scale: cc.v3(1.06, 1.06, 1.06) }).to(0.1, { scale: cc.v3(1, 1, 1) }).start();
            }
        }
        this._onScrolling();

        if (this._slideMode === SlideType.ADHERING
            && !this.adhering
        ) {
            // log(this.adhering, this._scrollView.isAutoScrolling(), this._scrollView.isScrolling());
            this.adhere();
        } else if (this._slideMode === SlideType.PAGE) {
            if (this._beganPos != null) {
                this._pageAdhere();
            } else {
                this.adhere();
            }
        }
    }
    // 触摸时
    private _onTouchStart(ev, captureListeners) {
        if (this._scrollView == null || this._scrollView['hasNestedViewGroup'](ev, captureListeners)) { return; }
        const isMe = ev.eventPhase === Event.AT_TARGET && ev.target === this.node;
        if (!isMe) {
            let itemNode: IChildInfo = ev.target;
            while (itemNode._listId == null && itemNode.parent) { itemNode = itemNode.parent as IChildInfo; }
            this._scrollItem = itemNode._listId != null ? itemNode : ev.target;
        }
    }
    // 触摸抬起时..
    private _onTouchUp() {
        this._scrollPos = null;
        if (this._slideMode === SlideType.ADHERING) {
            if (this.adhering) { this._adheringBarrier = true; }
            this.adhere();
        } else if (this._slideMode === SlideType.PAGE) {
            if (this._beganPos != null) {
                this._pageAdhere();
            } else {
                this.adhere();
            }
        }
        this._scrollItem = null;
    }

    private _onTouchCancelled(ev, captureListeners) {
        if (!this._scrollView || this._scrollView['hasNestedViewGroup'](ev, captureListeners) || ev.simulate) { return; }

        this._scrollPos = null;
        if (this._slideMode === SlideType.ADHERING) {
            if (this.adhering) { this._adheringBarrier = true; }
            this.adhere();
        } else if (this._slideMode === SlideType.PAGE) {
            if (this._beganPos != null) {
                this._pageAdhere();
            } else {
                this.adhere();
            }
        }
        this._scrollItem = null;
    }
    // 当尺寸改变
    private _onSizeChanged() {
        this.changeSizeFlag = true;
        if (this.checkInited(false)) {
            this.scheduleOnce(() => {
                if (this.changeSizeFlag) {
                    this._onScrolling();
                }
            });
        }
        const w = this.scrollView.content.parent.getComponent(cc.Widget);
        if (w) {
            w.updateAlignment();
        }
        this._resizeContent();
    }
    // 当Item自适应
    private _onItemAdaptive(item) {
        if (this.checkInited(false)) {
            if (
                (!this._sizeType && item.width !== this._itemSize.width)
                || (this._sizeType && item.height !== this._itemSize.height)
            ) {
                if (!this._customSize) { this._customSize = {}; }
                const val = this._sizeType ? item.height : item.width;
                if (this._customSize[item._listId] !== val) {
                    this._customSize[item._listId] = val;
                    this._resizeContent();
                    // this.content.children.forEach((child: cc.Node) => {
                    //     this._updateItemPos(child);
                    // });
                    this.updateAll();
                    // 如果当前正在运行 scrollTo，肯定会不准确，在这里做修正
                    if (!Number.isNaN(this._scrollToListId)) {
                        this._scrollPos = null;
                        this.unschedule(this._scrollToSo);
                        this.scrollTo(this._scrollToListId, Math.max(0, this._scrollToEndTime - (new Date().getTime() / 1000)));
                    }
                }
            }
        }
    }
    // PAGE粘附
    private _pageAdhere() {
        if (!this.cyclic && (this.elasticTop > 0 || this.elasticRight > 0 || this.elasticBottom > 0 || this.elasticLeft > 0)) { return; }
        const curPos = this._sizeType ? this.viewTop : this.viewLeft;
        const dis = (this._sizeType ? this.viewSize.height : this.viewSize.width) * this.pageDistance;
        const canSkip = Math.abs(this._beganPos - curPos) > dis;
        if (canSkip) {
            const timeInSecond = 0.5;
            switch (this._alignCalcType) {
                case 1:// 单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                case 4:// 单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                    if (this._beganPos > curPos) {
                        this.prePage(timeInSecond);
                        // log('_pageAdhere   PPPPPPPPPPPPPPP');
                    } else {
                        this.nextPage(timeInSecond);
                        // log('_pageAdhere   NNNNNNNNNNNNNNN');
                    }
                    break;
                case 2:// 单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                case 3:// 单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                    if (this._beganPos < curPos) {
                        this.prePage(timeInSecond);
                    } else {
                        this.nextPage(timeInSecond);
                    }
                    break;
                default:
                    break;
            }
        } else if (this.elasticTop <= 0 && this.elasticRight <= 0 && this.elasticBottom <= 0 && this.elasticLeft <= 0) {
            this.adhere();
        }
        this._beganPos = null;
    }
    // 粘附
    private adhere() {
        if (!this.checkInited()) { return; }
        if (this.elasticTop > 0 || this.elasticRight > 0 || this.elasticBottom > 0 || this.elasticLeft > 0) { return; }
        this.adhering = true;
        this._calcNearestItem();
        const offset: number = (this._sizeType ? this._topGap : this._leftGap) / (this._sizeType ? this.viewSize.height : this.viewSize.width);
        const timeInSecond: number = 0.7;
        this.scrollTo(this.nearestListId, timeInSecond, offset);
    }
    // Update..
    protected update(): void {
        if (this.frameByFrameRenderNum <= 0 || this._updateDone) { return; }
        // log(this.displayData.length, this._updateCounter, this.displayData[this._updateCounter]);
        if (this._virtual) {
            const len: number = (this._updateCounter + this.frameByFrameRenderNum) > this.displayItemNum ? this.displayItemNum : this._updateCounter + this.frameByFrameRenderNum;
            for (let n: number = this._updateCounter; n < len; n++) {
                const data: any = this.displayData[n];
                if (data) {
                    this._createOrUpdateItem(data);
                }
            }

            if (this._updateCounter >= this.displayItemNum - 1) { // 最后一个
                if (this._doneAfterUpdate) {
                    this._updateCounter = 0;
                    this._updateDone = false;
                    // if (!this._scrollView.isScrolling())
                    this._doneAfterUpdate = false;
                } else {
                    this._updateDone = true;
                    this._delRedundantItem();
                    this._forceUpdate = false;
                    this._calcNearestItem();
                    if (this.slideMode === SlideType.PAGE) { this.curPageNum = this.nearestListId; }
                }
            } else {
                this._updateCounter += this.frameByFrameRenderNum;
            }
        } else if (this._updateCounter < this._numItems) {
            const len: number = (this._updateCounter + this.frameByFrameRenderNum) > this._numItems ? this._numItems : this._updateCounter + this.frameByFrameRenderNum;
            for (let n: number = this._updateCounter; n < len; n++) {
                this._createOrUpdateItem2(n);
            }
            this._updateCounter += this.frameByFrameRenderNum;
        } else {
            this._updateDone = true;
            this._calcNearestItem();
            if (this.slideMode === SlideType.PAGE) this.curPageNum = this.nearestListId;
        }
    }
    /**
     * 创建或更新Item（虚拟列表用）
     * @param {Object} data 数据
     */
    private _createOrUpdateItem(data: any) {
        let item = this.getItemByListId(data.id);
        const index = data.id % this._actualNumItems;
        if (!item) { // 如果不存在
            const canGet: boolean = this._pool.size() > 0;
            if (canGet) {
                item = this._pool.get() as IChildInfo;
                // log('从池中取出::   旧id =', item['_listId'], '，新id =', data.id, item);
            } else {
                item = cc.instantiate(this._itemTmp) as IChildInfo;
                // log('新建::', data.id, item);
            }
            if (item._listId !== data.id) {
                item._listId = data.id;
                item.setContentSize(this._itemSize);
            }
            item.setPosition(data.x, data.y);
            // this._resetItemSize(item);
            item.active = true;
            this.content.addChild(item);
            if (canGet && this._needUpdateWidget) {
                const widget: cc.Widget = item.getComponent(cc.Widget);
                if (widget) { widget.updateAlignment(); }
            }
            item.setSiblingIndex(this.content.children.length - 1);

            const listItem: ListItem = item.getComponent(ListItem);
            item.listItem = listItem;
            if (listItem) {
                listItem.listId = data.id;
                listItem.list = this;
                listItem['_registerEvent']();
            }
            // console.log('index=', index, this.startShowIndex, this.endShowIndex);
            if (this.renderEvent && item && (this.startShowIndex <= 0 || (this.startShowIndex <= index && this.endShowIndex >= index))) {
                this.startShowIndex = 0;
                this.endShowIndex = this._numItems - 1;
                cc.Component.EventHandler.emitEvents([this.renderEvent], item, Math.abs(index));
            }
        } else if (this._forceUpdate && this.renderEvent) { // 强制更新
            item.setPosition(data.x, data.y);
            // this._resetItemSize(item);
            // log('ADD::', data.id, item);
            if (this.renderEvent && item && (this.startShowIndex <= 0 || (this.startShowIndex <= index && this.endShowIndex >= index))) {
                this.startShowIndex = 0;
                this.endShowIndex = this._numItems - 1;
                cc.Component.EventHandler.emitEvents([this.renderEvent], item, Math.abs(index));
            }
        }
        // this._resetItemSize(item);

        this._updateListItem(item.listItem);
        if (this._lastDisplayData.indexOf(data.id) < 0) {
            this._lastDisplayData.push(data.id);
        }
    }
    // 创建或更新Item（非虚拟列表用）
    private _createOrUpdateItem2(listId: number) {
        let item = this.content.children[listId] as IChildInfo;
        let listItem: ListItem;
        if (!item) { // 如果不存在
            item = cc.instantiate(this._itemTmp) as IChildInfo;
            item._listId = listId;
            item.active = true;
            item.setPosition(0, 0);
            this.content.addChild(item);
            listItem = item.getComponent(ListItem);
            item.listItem = listItem;
            if (listItem) {
                listItem.listId = listId;
                listItem.list = this;
                listItem['_registerEvent']();
            }
            if (this.renderEvent && item) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], item, listId);
            }
        } else if (this._forceUpdate && this.renderEvent) { // 强制更新
            item._listId = listId;
            if (listItem) { listItem.listId = listId; }
            if (this.renderEvent && item) {
                cc.Component.EventHandler.emitEvents([this.renderEvent], item, listId);
            }
        }
        this._updateListItem(listItem);
        if (this._lastDisplayData.indexOf(listId) < 0) {
            this._lastDisplayData.push(listId);
        }
    }

    private _updateListItem(listItem: ListItem) {
        if (!listItem) { return; }
        if (this.selectedMode > SelectedType.NONE) {
            const item: any = listItem.node;
            switch (this.selectedMode) {
                case SelectedType.SINGLE:
                    listItem.selected = this.selectedId === item._listId;
                    break;
                case SelectedType.MULT:
                    listItem.selected = this.multSelected.indexOf(item._listId) >= 0;
                    break;
                default:
                    break;
            }
        }
    }
    // 仅虚拟列表用
    // private _resetItemSize() {

    // let cc.size: number;
    // if (this._customSize && this._customSize[item._listId]) {
    //     cc.size = this._customSize[item._listId];
    // } else if (this._colLineNum > 1) item.setContentSize(this._itemSize);
    // else cc.size = this._sizeType ? this._itemSize.height : this._itemSize.width;
    // if (cc.size) {
    //     if (this._sizeType) { item.height = cc.size; } else { item.width = cc.size; }
    // }
    // }
    /**
     * 更新Item位置
     * @param {Number||cc.Node} listIdOrItem
     */
    private _updateItemPos(listIdOrItem: any) {
        const item: IChildInfo = Number.isNaN(listIdOrItem) ? listIdOrItem : this.getItemByListId(listIdOrItem);
        const pos: any = this.getItemPos(item._listId);
        item.setPosition(pos.x, pos.y);
    }
    /**
     * 设置多选
     * @param {Array} args 可以是单个listId，也可是个listId数组
     * @param {Boolean} bool 值，如果为null的话，则直接用args覆盖
     */
    private setMultSelected(args: any, bool: boolean) {
        if (!this.checkInited()) { return; }
        if (!Array.isArray(args)) {
            args = [args];
        }
        if (bool == null) {
            this.multSelected = args;
        } else {
            let listId: number; let sub: number;
            if (bool) {
                for (let n: number = args.length - 1; n >= 0; n--) {
                    listId = args[n];
                    sub = this.multSelected.indexOf(listId);
                    if (sub < 0) {
                        this.multSelected.push(listId);
                    }
                }
            } else {
                for (let n: number = args.length - 1; n >= 0; n--) {
                    listId = args[n];
                    sub = this.multSelected.indexOf(listId);
                    if (sub >= 0) {
                        this.multSelected.splice(sub, 1);
                    }
                }
            }
        }
        this._forceUpdate = true;
        this._onScrolling();
    }
    /**
     * 更新指定的Item
     * @param {Array} args 单个listId，或者数组
     * @returns
     */
    public updateItem(...listIds: number[]): void {
        if (!this.checkInited()) { return; }
        listIds.forEach((listId) => {
            const item: any = this.getItemByListId(listId);
            if (item) { cc.Component.EventHandler.emitEvents([this.renderEvent], item, listId % this._actualNumItems); }
        });
    }
    /**
     * 更新全部
     */
    public updateAll(): void {
        if (!this.checkInited()) { return; }
        const num = this.numItems;
        this.setNumItems(num);
    }
    /**
     * 根据ListID获取Item
     * @param {Number} listId
     * @returns
     */
    public getItemByListId(listId: number): IChildInfo {
        if (this.content == null) {
            return undefined;
        }
        for (let n: number = this.content.children.length - 1; n >= 0; n--) {
            const item: IChildInfo = this.content.children[n] as IChildInfo;
            if (item._listId === listId) {
                return item;
            }
        }
        return undefined;
    }
    /**
     * 获取在显示区域外的Item
     * @returns
     */
    private _getOutsideItem() {
        let item: IChildInfo;
        const result: any[] = [];
        for (let n: number = this.content.children.length - 1; n >= 0; n--) {
            item = this.content.children[n] as IChildInfo;
            let isHas: boolean = false;
            for (const data of this.displayData) {
                // for (const idx in this.displayData) {
                const id = data.id as number;
                if (id === item._listId) {
                    isHas = true;
                    continue;
                }
            }
            if (!isHas) {
                result.push(item);
            }
        }
        return result;
    }
    // 删除显示区域以外的Item
    private _delRedundantItem() {
        if (this._virtual) {
            const arr: any[] = this._getOutsideItem();
            for (let n: number = arr.length - 1; n >= 0; n--) {
                const item: any = arr[n];
                if (this._scrollItem && item._listId === this._scrollItem._listId) { continue; }
                this._pool.put(item);
                for (let m: number = this._lastDisplayData.length - 1; m >= 0; m--) {
                    if (this._lastDisplayData[m] === item._listId) {
                        this._lastDisplayData.splice(m, 1);
                        break;
                    }
                }
            }
            // log('存入::', str, '    pool.length =', this._pool.length);
        } else {
            while (this.content.children.length > this._numItems) {
                this._delSingleItem(this.content.children[this.content.children.length - 1]);
            }
        }
    }
    // 删除单个Item
    public _delSingleItem(item: cc.Node): void {
        // log('DEL::', item['_listId'], item);
        item.removeFromParent();
        if (item.destroy) { item.destroy(); }
        item = null;
    }
    /**
     * 动效删除Item（此方法只适用于虚拟列表，即_virtual=true）
     * 一定要在回调函数里重新设置新的numItems进行刷新，毕竟本List是靠数据驱动的。
     */
    public aniDelItem(listId: number, callFunc: (listid: number) => void, aniType: number): void {
        if (!this.checkInited() || this.cyclic || !this._virtual) { return console.warn('This function is not allowed to be called!'); }

        if (this._aniDelRuning) { return console.warn('Please wait for the current deletion to finish!'); }

        let item: cc.Node = this.getItemByListId(listId);
        let listItem: ListItem;
        if (!item) {
            callFunc(listId);
            return undefined;
        } else {
            listItem = item.getComponent(ListItem);
        }
        this._aniDelRuning = true;
        const curLastId: number = this.displayData[this.displayData.length - 1].id;
        const resetSelectedId: boolean = listItem.selected;
        listItem.showAni(aniType, () => {
            // 判断有没有下一个，如果有的话，创建粗来
            let newId: number;
            if (curLastId < this._numItems - 2) {
                newId = curLastId + 1;
            }
            if (newId != null) {
                const newData: any = this._calcItemPos(newId);
                this.displayData.push(newData);
                if (this._virtual) { this._createOrUpdateItem(newData); } else { this._createOrUpdateItem2(newId); }
            } else { this._numItems--; }
            if (this.selectedMode === SelectedType.SINGLE) {
                if (resetSelectedId) {
                    this._selectedId = -1;
                } else if (this._selectedId - 1 >= 0) {
                    this._selectedId--;
                }
            } else if (this.selectedMode === SelectedType.MULT && this.multSelected.length) {
                const sub: number = this.multSelected.indexOf(listId);
                if (sub >= 0) {
                    this.multSelected.splice(sub, 1);
                }
                // 多选的数据，在其后的全部减一
                for (let n: number = this.multSelected.length - 1; n >= 0; n--) {
                    const id: number = this.multSelected[n];
                    if (id >= listId) { this.multSelected[n]--; }
                }
            }
            if (this._customSize) {
                if (this._customSize[listId]) { delete this._customSize[listId]; }
                const newCustomSize: any = {};
                let size: number;
                for (const id in this._customSize) {
                    size = this._customSize[id];
                    const idNumber: number = parseInt(id);
                    newCustomSize[idNumber - (idNumber >= listId ? 1 : 0)] = size;
                }
                this._customSize = newCustomSize;
            }
            // 后面的Item向前怼的动效
            const sec: number = 0.2333;
            let acts = new cc.Tween();
            let haveCB: boolean;
            for (let n: number = newId != null ? newId : curLastId; n >= listId + 1; n--) {
                item = this.getItemByListId(n);
                if (item) {
                    const posData: any = this._calcItemPos(n - 1);
                    acts = acts.to(sec, { position: cc.v3(posData.x, posData.y) });
                    if (n <= listId + 1) {
                        haveCB = true;
                        acts = acts.call(() => {
                            this._aniDelRuning = false;
                            callFunc(listId);
                        });
                    }
                    cc.tween(item).sequence(acts).start();
                }
            }
            if (!haveCB) {
                this._aniDelRuning = false;
                callFunc(listId);
            }
        }, true);
        return undefined;
    }
    /**
     * 滚动到..
     * @param {Number} listId 索引（如果<0，则滚到首个Item位置，如果>=_numItems，则滚到最末Item位置）
     * @param {Number} timeInSecond 时间
     * @param {Number} offset 索引目标位置偏移，0-1
     * @param {Boolean} overStress 滚动后是否强调该Item（这只是个实验功能）
     */
    public scrollTo(listId: number, timeInSecond: number = 0.5, offset: number = null, overStress: boolean = false): boolean {
        if (!this.checkInited(false)) { return false; }
        // this._scrollView.stopAutoScroll();
        if (timeInSecond == null) { // 默认0.5
            timeInSecond = 0.5;
        } else if (timeInSecond < 0) {
            timeInSecond = 0;
        }
        if (listId < 0) { listId = 0; } else if (listId >= this._numItems) { listId = this._numItems - 1; }
        // 以防设置了numItems之后layout的尺寸还未更新
        if (!this._virtual && this._layout && this._layout.enabled) { this._layout.updateLayout(); }
        this.getCanStartShowIndex(Math.max(0, listId - 1));
        let pos = this.getItemPos(listId);
        let targetX: number; let targetY: number;

        switch (this._alignCalcType) {
            case 1:// 单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                targetX = pos.left;
                if (offset != null) { targetX -= this.viewSize.width * offset; } else { targetX -= this._leftGap; }
                pos = cc.v2(targetX, 0);
                break;
            case 2:// 单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                targetX = pos.right - this.viewSize.width;
                if (offset != null) { targetX += this.viewSize.width * offset; } else { targetX += this._rightGap; }
                pos = cc.v2(targetX + this.content.width, 0);
                break;
            case 3:// 单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                targetY = pos.top;
                if (offset != null) { targetY += this.viewSize.height * offset; } else { targetY += this._topGap; }
                pos = cc.v2(0, -targetY);
                break;
            case 4:// 单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                targetY = Number(pos.bottom) + this.viewSize.height;
                if (offset != null) { targetY -= this.viewSize.height * offset; } else { targetY -= this._bottomGap; }
                pos = cc.v2(0, -targetY + this.content.height);
                break;
            default:
                break;
        }
        let viewPos: any = this.content.getPosition();
        viewPos = Math.abs(this._sizeType ? viewPos.y : viewPos.x);

        const comparePos = this._sizeType ? pos.y : pos.x;
        const runScroll = Math.abs((this._scrollPos != null ? this._scrollPos : viewPos) - comparePos) > 0.5;
        // log(runScroll, this._scrollPos, viewPos, comparePos)

        // this._scrollView.stopAutoScroll();
        if (!runScroll) {
            return false;
        }
        this._scrollView.scrollToOffset(pos as cc.Vec2, timeInSecond);
        this._scrollToListId = listId;
        this._scrollToEndTime = (new Date().getTime() / 1000) + timeInSecond;
        // log(listId, this.content.width, this.content.getPosition(), pos);
        this._scrollToSo = this.scheduleOnce(() => {
            if (!this._adheringBarrier) {
                this.adhering = this._adheringBarrier = false;
            }
            this._scrollPos = this._scrollToListId = this._scrollToEndTime = this._scrollToSo = null;
            // log('2222222222', this._adheringBarrier)
            if (overStress) {
                // this.scrollToListId = listId;
                const item = this.getItemByListId(listId);
                if (item) {
                    cc.tween(item).to(0.1, { scale: 1.05 }).to(0.1, { scale: 1 }).start();
                }
            }
        }, timeInSecond + 0.1);

        if (timeInSecond <= 0) {
            this._onScrolling();
        }

        return true;
    }
    /**
     * 计算当前滚动窗最近的Item
     */
    private _calcNearestItem() {
        this.nearestListId = null;
        let data: any; let center: number;

        if (this._virtual) { this._calcViewPos(); }

        const vTop = this.viewTop;
        const vRight = this.viewRight;
        const vBottom = this.viewBottom;
        const vLeft = this.viewLeft;

        let breakFor: boolean = false;
        for (let n = 0; n < this.content.children.length && !breakFor; n += this._colLineNum) {
            data = this._virtual ? this.displayData[n] : this._calcExistItemPos(n);
            if (!data) { break; }
            center = this._sizeType ? (Number(data.top) + Number(data.bottom)) / 2 : center = (Number(data.left) + Number(data.right)) / 2;
            switch (this._alignCalcType) {
                case 1:// 单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                    if (data.right >= vLeft) {
                        this.nearestListId = data.id;
                        if (vLeft > center) { this.nearestListId += this._colLineNum; }
                        breakFor = true;
                    }
                    break;
                case 2:// 单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                    if (data.left <= vRight) {
                        this.nearestListId = data.id;
                        if (vRight < center) { this.nearestListId += this._colLineNum; }
                        breakFor = true;
                    }
                    break;
                case 3:// 单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                    if (data.bottom <= vTop) {
                        this.nearestListId = data.id;
                        if (vTop < center) { this.nearestListId += this._colLineNum; }
                        breakFor = true;
                    }
                    break;
                case 4:// 单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                    if (data.top >= vBottom) {
                        this.nearestListId = data.id;
                        if (vBottom > center) { this.nearestListId += this._colLineNum; }
                        breakFor = true;
                    }
                    break;
                default:
                    break;
            }
        }
        // 判断最后一个Item。。。（哎，这些判断真心恶心，判断了前面的还要判断最后一个。。。一开始呢，就只有一个布局（单列布局），那时候代码才三百行，后来就想着完善啊，艹..这坑真深，现在这行数都一千五了= =||）
        data = this._virtual ? this.displayData[this.displayItemNum - 1] : this._calcExistItemPos(this._numItems - 1);
        if (data && data.id === this._numItems - 1) {
            center = this._sizeType ? (Number(data.top) + Number(data.bottom)) / 2 : center = (Number(data.left) + Number(data.right)) / 2;
            switch (this._alignCalcType) {
                case 1:// 单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                    if (vRight > center) { this.nearestListId = data.id; }
                    break;
                case 2:// 单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                    if (vLeft < center) { this.nearestListId = data.id; }
                    break;
                case 3:// 单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                    if (vBottom < center) { this.nearestListId = data.id; }
                    break;
                case 4:// 单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                    if (vTop > center) { this.nearestListId = data.id; }
                    break;
                default:
                    break;
            }
        }
        // log('this.nearestListId =', this.nearestListId);
    }
    // 上一页
    public prePage(timeInSecond: number = 0.5): void {
        // log('👈');
        if (!this.checkInited()) { return; }
        this.skipPage(this.curPageNum - 1, timeInSecond);
    }
    // 下一页
    public nextPage(timeInSecond: number = 0.5): void {
        // log('👉');
        if (!this.checkInited()) { return; }
        this.skipPage(this.curPageNum + 1, timeInSecond);
    }
    // 跳转到第几页
    public skipPage(pageNum: number, timeInSecond: number): void {
        if (!this.checkInited()) { return; }
        if (this._slideMode !== SlideType.PAGE) {
            console.warn('This function is not allowed to be called, Must SlideMode = PAGE!');
            return;
        }
        if (pageNum < 0 || pageNum >= this._numItems) { return; }
        if (this.curPageNum === pageNum) { return; }
        // log(pageNum);
        this.curPageNum = pageNum;
        if (this.pageChangeEvent) {
            cc.Component.EventHandler.emitEvents([this.pageChangeEvent], pageNum);
        }
        this.scrollTo(pageNum, timeInSecond);
    }
    // 计算 CustomSize（这个函数还是保留吧，某些罕见的情况的确还是需要手动计算customSize的）
    public calcCustomSize(numItems: number): unknown {
        if (!this.checkInited()) { return; }
        if (!this._itemTmp) {
            console.warn('Unset template item!');
            return;
        }
        if (!this.renderEvent) {
            console.warn('Unset Render-Event!');
            return;
        }
        this._customSize = {};
        const temp: cc.Node = cc.instantiate(this._itemTmp);
        this.content.addChild(temp);
        for (let n: number = 0; n < numItems; n++) {
            cc.Component.EventHandler.emitEvents([this.renderEvent], temp, n);
            if (temp.height !== this._itemSize.height || temp.width !== this._itemSize.width) {
                this._customSize[n] = this._sizeType ? temp.height : temp.width;
            }
        }
        if (!Object.keys(this._customSize).length) { this._customSize = null; }
        temp.removeFromParent();
        if (temp.destroy) { temp.destroy(); }
        // eslint-disable-next-line consistent-return
        return this._customSize;
    }
}
