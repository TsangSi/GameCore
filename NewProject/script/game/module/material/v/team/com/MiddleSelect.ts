/*
 * @Author: zs
 * @Date: 2022-11-25 16:51:39
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\com\MiddleSelect.ts
 * @Description:
 *
 */
import BaseCmp from '../../../../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../../../../../base/utils/UtilGame';

const { ccclass, property } = cc._decorator;
/** 方向 */
enum EDir {
    /** 左边 */
    Left,
    /** 右边 */
    Right,
}
@ccclass
export default class MiddleSelect extends BaseCmp {
    @property(cc.Prefab)
    private PrefabItem: cc.Prefab = null;
    @property({
        type: cc.Component.EventHandler,
        tooltip: CC_DEV && '数据item填充事件',
    })
    private renderItemEvent: cc.Component.EventHandler = new cc.Component.EventHandler();
    @property({
        type: cc.Component.EventHandler,
        tooltip: CC_DEV && '点击选中事件',
    })
    private selectEvent: cc.Component.EventHandler = new cc.Component.EventHandler();
    @property(cc.Node)
    private content: cc.Node = null;
    @property({
        type: cc.Node,
        tooltip: CC_DEV && '左边的点击按钮',
    })
    private BtnLeft: cc.Node = null;
    @property({
        type: cc.Node,
        tooltip: CC_DEV && '右边的点击按钮',
    })
    private BtnRight: cc.Node = null;
    @property({
        type: cc.Node,
        tooltip: CC_DEV && '左边的箭头按钮',
    })
    private BtnArrowLeft: cc.Node = null;
    @property({
        type: cc.Node,
        tooltip: CC_DEV && '右边的箭头按钮',
    })
    private BtnArrowRight: cc.Node = null;

    @property({
        type: cc.Integer,
        tooltip: CC_DEV && '创建Item的最大数量，默认是4',
    })
    private ItemMaxNum: number = 4;
    @property({
        type: cc.Integer,
        tooltip: CC_DEV && '相邻子节点之间的水平距离',
    })
    private SpacingX: number = 0;

    /** 选中事件，返回false表示不可以选中，默认可以选中 */
    private checkFunc: (index: number) => boolean;
    private target: any = null;
    /** 是否能点击 */
    private isCanClick: boolean = true;
    /** 选中的索引 */
    private _selectIndex = 0;
    /** 选中的索引 */
    public get selectIndex(): number {
        return this._selectIndex;
    }
    /** item的数量 */
    private length: number = 0;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnLeft, this.onBtnLeft, this);
        UtilGame.Click(this.BtnRight, this.onBtnRight, this);
        UtilGame.Click(this.BtnArrowLeft, this.onBtnArrowLeft, this);
        UtilGame.Click(this.BtnArrowRight, this.onBtnArrowRight, this);
    }

    private clickSelect(type: EDir) {
        if (type === EDir.Left && this.selectIndex <= 0) {
            return;
        } else if (type === EDir.Right && this.selectIndex >= this.content.childrenCount) {
            return;
        }
        const addIndex = type === EDir.Left ? -1 : 1;

        /** 能否选中 */
        let isCanSelect: boolean = true;
        if (this.checkFunc) {
            if (this.target) {
                isCanSelect = this.checkFunc.call(this.target, this.selectIndex + addIndex);
            } else {
                isCanSelect = this.checkFunc(this.selectIndex + addIndex);
            }
        }
        if (isCanSelect === false) {
            return;
        }
        this._selectIndex += addIndex;
        if (this.selectEvent) {
            cc.Component.EventHandler.emitEvents([this.selectEvent], this.selectIndex);
        }
        this.isCanClick = false;
        this.BtnLeft.active = false;
        this.BtnRight.active = false;
        this.playMoveAction(type);
    }

    private onBtnLeft() {
        this.clickSelect(EDir.Left);
    }
    private onBtnRight() {
        this.clickSelect(EDir.Right);
    }
    private onBtnArrowLeft() {
        if (this.isCanClick) {
            this.clickSelect(EDir.Left);
        }
    }
    private onBtnArrowRight() {
        if (this.isCanClick) {
            this.clickSelect(EDir.Right);
        }
    }

    private playMoveAction(type: EDir) {
        let offsetX = this.content.children[1].x - this.content.children[0].x;
        if (type === EDir.Right) {
            offsetX = this.content.children[0].x - this.content.children[1].x;
        }
        for (let index = 0; index < this.content.childrenCount; index++) {
            const element = this.content.children[index];
            const act1: cc.ActionInterval = cc.moveTo(0.3, cc.v2({ x: element.x + offsetX, y: 0 }));
            if (index === this.selectIndex) {
                element.runAction(cc.scaleTo(0.3, 1.1, 1.1));
            } else {
                element.runAction(cc.scaleTo(0.3, 1, 1));
            }
            const func: cc.ActionInstant = cc.callFunc(this.updateBtnLevelActive, this);
            const seq: cc.ActionInterval = cc.sequence(act1, func);
            element.runAction(seq);
        }
    }
    /**
     * 更新切换等级按钮隐藏和显示
     */
    private updateBtnLevelActive() {
        this.isCanClick = true;
        this.BtnArrowLeft.active = false;
        this.BtnArrowRight.active = false;
        this.BtnLeft.active = false;
        this.BtnRight.active = false;
        if (this.length > 1) {
            if (this.selectIndex === 0) {
                this.BtnLeft.active = false;
                this.BtnRight.active = true;
                this.BtnArrowLeft.active = false;
                this.BtnArrowRight.active = true;
            } else if (this.selectIndex === (this.length - 1)) {
                this.BtnLeft.active = true;
                this.BtnRight.active = false;
                this.BtnArrowLeft.active = true;
                this.BtnArrowRight.active = false;
            } else {
                this.BtnLeft.active = true;
                this.BtnRight.active = true;
                this.BtnArrowLeft.active = true;
                this.BtnArrowRight.active = true;
            }
        }
    }

    /** 是否自动计算x */
    // private isAutoGetStartX: boolean = true;
    private _startX: number = 0;
    /** 起始x */
    public set startX(x: number) {
        // this.isAutoGetStartX = false;
        this._startX = x;
    }
    public get startX(): number {
        return this._startX;
    }

    /** 是否自动计算偏移值 */
    // private isAutoGetOffset: boolean = true;
    private _offset: number = 0;
    /** 偏移值 */
    public set offset(offset: number) {
        // this.isAutoGetOffset = false;
        this._offset = offset;
    }
    public get offset(): number {
        return this._offset;
    }

    /**
     * 设置检测回调
     * @param checkFunc 检测回调
     * @param target 回调上下文
     */
    public setCheckFunc(checkFunc: (index: number) => boolean, target?: unknown): void {
        this.checkFunc = checkFunc;
        this.target = target;
    }

    /**
     * 设置数量和默认选中索引
     * @param length 数量
     * @param index 选中索引
     */
    public setNumItems(length: number, index: number = 0): void {
        this.length = length;
        if (index < 0) {
            index = 0;
        }
        if (index >= length) {
            index = length - 1;
        }
        const hasNum = Math.max(this.length, this.content.childrenCount);
        const showNum = Math.min(hasNum, this.ItemMaxNum);
        for (let i = 0; i < showNum; i++) {
            this.updateItem(i);
        }
        if (length) {
            const selectIdx = this.selectIndex || 0;
            this._selectIndex = index;
            const moveNum = Math.abs(index - Math.min(length - 1, selectIdx));

            if (moveNum === 0) {
                this.content.children[this.selectIndex].scale = 1.1;
            } else {
                for (let i = 0; i < moveNum; i++) {
                    this.playMoveAction(index > selectIdx ? EDir.Right : EDir.Left);
                }
            }
            if (this.selectEvent) {
                cc.Component.EventHandler.emitEvents([this.selectEvent], index);
            }
        }
        this.updateBtnLevelActive();
    }

    private firstX: number = 0;
    /**
     *
     * @param index 更新Item
     */
    private updateItem(index: number, selectIndex: number = 0) {
        if (index < this.length) {
            const child = this.content.children[index] || cc.instantiate(this.PrefabItem);
            if (!this.startX) {
                this.offset = child.width + this.SpacingX;
                this.firstX = this.content.parent.width / 2 - this.content.width * this.content.anchorX - child.width;
                /** 默认选中的要放到中间，所以是第二个位置 */
                this.startX = this.offset + this.firstX;
            }

            if (!this.content.children[index]) {
                this.content.addChild(child);
                child.x = index * this.offset + this.startX;
            }
            if (this.renderItemEvent) {
                cc.Component.EventHandler.emitEvents([this.renderItemEvent], child, index);
            }
        } else {
            this.content.children[index].destroy();
        }
    }
}
