/*
 * @Author: zs
 * @Date: 2022-04-26 20:33:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-24 17:37:16
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\components\PageViewEx.ts
 * @Description:
 *
 */
import { UtilGame } from '../utils/UtilGame';

const { ccclass, property } = cc._decorator;

@ccclass
export class PageViewEx extends cc.PageView {
    @property({ type: cc.Node, tooltip: CC_DEV && '上一页按钮节点' })
    private BtnLeft: cc.Node = null;
    @property({ type: cc.Node, tooltip: CC_DEV && '下一页按钮节点' })
    private BtnRight: cc.Node = null;
    /** 头部滑动循环 */
    // @property({ displayName: '头部滑动循环' })
    private headerLoop = false;
    /** 尾部滑动循环 */
    // @property({ displayName: '尾部滑动循环' })
    private footerLoop = false;

    /** 页面数量 */
    private _pageCount: number;
    public get pageCount(): number {
        return this._pageCount;
    }

    public onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnLeft, this.onBtnLeftClicked, this);
        UtilGame.Click(this.BtnRight, this.onBtnRightClicked, this);
        // this.node.on(PageView.EventType.)
        this.updateBtnActive();
    }

    private get curPageIdx(): number {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, dot-notation
        return this['_curPageIdx'];
    }

    protected _updatePageView(): void {
        // todo 2.4 暂时注释
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, dot-notation
        super['_updatePageView']();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, dot-notation
        this._pageCount = this['_pages']['length'];
    }

    private onBtnLeftClicked() {
        // todo 2.4 暂时注释
        // eslint-disable-next-line dot-notation
        let index = this.curPageIdx - 1;
        if (this.headerLoop && index < 0) {
            index = this._pageCount - 1;
            this.scrollToPage(index, 0);
        } else if (index >= 0) {
            this.scrollToPage(index);
        }
    }
    private onBtnRightClicked() {
        // todo 2.4 暂时注释
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, dot-notation
        let index = this.curPageIdx + 1;
        if (this.footerLoop && index >= this._pageCount) {
            index = 0;
            this.scrollToPage(index, 0);
        } else if (index < this._pageCount) {
            this.scrollToPage(index);
        }
    }

    public scrollToPage(idx: number, timeInSecond = 0.3): void {
        super.scrollToPage.apply(this, arguments);
        this.updateBtnActive();
    }

    private updateBtnActive() {
        // todo 2.4 暂时注释
        this.BtnLeft.active = this.headerLoop || this.curPageIdx > 0;
        this.BtnRight.active = this.footerLoop || this.curPageIdx < (this._pageCount - 1);
    }

    // // todo 2.4 暂时注释
    // private _directionEx: number;
    // public get directionEx(): number {
    //     return this.direction;
    // }
    // public set directionEx(value: number) {
    //     if (this._directionEx === value) {
    //         return;
    //     }
    //     this.direction = value;
    //     this._EditoSetNode();
    //     this._EditorUpdateWidget();
    // }

    private lastDirection: number = 0;
    protected _syncScrollDirection(): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, dot-notation
        super['_syncScrollDirection']();
        if (this.lastDirection !== this.direction) {
            this._EditoSetNode();
            this._EditorUpdateWidget();
        }
        this.lastDirection = this.direction;
    }

    private _EditoSetNode() {
        if (!this.BtnLeft) {
            this.BtnLeft = this.node.getChildByName('BtnLeft');
        }
        if (!this.BtnRight) {
            this.BtnRight = this.node.getChildByName('BtnRight');
        }
        if (!this.content) {
            const view = this.node.getChildByName('view');
            this.content = view?.getChildByName('content');
        }
        // if (!this.indicator) {
        //     const indicator = this.node.getChildByName('indicator');
        //     if (indicator) {
        //         this.indicator = indicator.getComponent(PageViewIndicator);
        //     }
        // }
    }

    private _EditorUpdateWidget() {
        if (this.BtnLeft) {
            const w = this.BtnLeft.getComponent(cc.Widget) || this.BtnLeft.addComponent(cc.Widget);
            if (this.vertical) {
                w.isAlignTop = false;
                w.isAlignBottom = true;
                w.isAlignLeft = false;
                w.isAlignRight = false;
                w.isAlignVerticalCenter = false;
                w.isAlignHorizontalCenter = true;
                w.bottom = this.node.height + 10;
                w.horizontalCenter = 0;
            } else {
                w.isAlignTop = false;
                w.isAlignBottom = false;
                w.isAlignLeft = true;
                w.isAlignRight = false;
                w.isAlignVerticalCenter = true;
                w.isAlignHorizontalCenter = false;
                w.left = -this.BtnLeft.width - 10;
                w.verticalCenter = 0;
            }
        }
        if (this.BtnRight) {
            const w = this.BtnRight.getComponent(cc.Widget) || this.BtnRight.addComponent(cc.Widget);
            if (this.vertical) {
                w.isAlignTop = false;
                w.isAlignBottom = true;
                w.isAlignLeft = false;
                w.isAlignRight = false;
                w.isAlignVerticalCenter = false;
                w.isAlignHorizontalCenter = true;
                w.bottom = -this.BtnRight.height - 10;
                w.horizontalCenter = 0;
            } else {
                w.isAlignTop = false;
                w.isAlignBottom = false;
                w.isAlignLeft = false;
                w.isAlignRight = true;
                w.isAlignVerticalCenter = true;
                w.isAlignHorizontalCenter = false;
                w.right = -this.BtnRight.width - 10;
                w.horizontalCenter = 0;
            }
        }
        if (this.content) {
            const layout = this.content.getComponent(cc.Layout) || this.content.addComponent(cc.Layout);
            const w = this.content.getComponent(cc.Widget) || this.content.addComponent(cc.Widget);
            if (this.vertical) {
                layout.type = cc.Layout.Type.VERTICAL;
                w.isAlignLeft = true;
                w.isAlignRight = true;
                w.isAlignTop = true;
                w.isAlignBottom = false;
                w.isAlignHorizontalCenter = false;
                w.isAlignVerticalCenter = false;
                w.left = 0;
                w.right = 0;
                w.top = 0;
            } else {
                layout.type = cc.Layout.Type.HORIZONTAL;
                w.isAlignLeft = true;
                w.isAlignTop = true;
                w.isAlignBottom = true;
                w.isAlignRight = false;
                w.isAlignHorizontalCenter = false;
                w.isAlignVerticalCenter = false;
                w.left = 0;
                w.top = 0;
                w.bottom = 0;
            }
        }
        // if (this.indicator) {
        //     if (this.vertical) {
        //         this.indicator.direction = PageViewIndicator.Direction.VERTICAL;
        //     } else {
        //         this.indicator.direction = PageViewIndicator.Direction.HORIZONTAL;
        //     }
        //     this.indicator._updateLayout();
        // }
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
