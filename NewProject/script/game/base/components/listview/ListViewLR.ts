/*
 * @Author: zs
 * @Date: 2022-06-02 14:45:15
 * @FilePath: \SanGuo2.4-main\assets\script\game\base\components\listview\ListViewLR.ts
 * @Description:
 */
import { UtilGame } from '../../utils/UtilGame';

const { ccclass, property } = cc._decorator;

const TempOffset = cc.v2(0, 0);
@ccclass
export class ListViewLR extends cc.Component {
    @property(cc.Node)
    private NodeLeft: cc.Node = null;
    @property(cc.Node)
    private NodeRight: cc.Node = null;
    /** Item宽高 */
    private ItemSize: cc.Size;
    /** 最大可滚动偏移量 */
    private MaxOffset: cc.Vec2;
    private Size: cc.Size;
    /** 滑动组件 */
    private scrollview: cc.ScrollView = null;
    protected start(): void {
        // [3]
        this.scrollview = this.node.getComponent(cc.ScrollView);
        this.node.on('scrolling', this.updateButtonActive, this);
        UtilGame.Click(this.NodeLeft, this.onLeftClicked, this);
        UtilGame.Click(this.NodeRight, this.onRightClicked, this);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.updateButtonActive, this);
        this.scheduleOnce(() => {
            this.updateButtonActive();
        }, 0.01);
    }

    private updateButtonActive() {
        const offset = this.scrollview.getScrollOffset();
        if (!this.ItemSize) {
            const view = this.node.getChildByName('view');
            const content = view.getChildByName('content');
            this.ItemSize = content.children[0]?.getContentSize();
            if (!this.ItemSize && content) {
                content.once(cc.Node.EventType.CHILD_ADDED, () => {
                    this.updateButtonActive();
                }, this);
            }
        }
        if (!this.ItemSize) {
            this.NodeLeft.active = false;
            return;
        }
        if (!this.MaxOffset) {
            this.MaxOffset = this.scrollview.getMaxScrollOffset();
        }
        if (this.scrollview.vertical) {
            if (offset.y >= this.ItemSize.height * 0.5) {
                // 移动超过一个item的高度
                this.NodeLeft.active = true;
            } else {
                this.NodeLeft.active = false;
            }
            if (offset.y < (this.MaxOffset.y - this.ItemSize.height * 0.5)) {
                this.NodeRight.active = true;
            } else {
                this.NodeRight.active = false;
            }
        } else {
            if (Math.abs(offset.x) >= this.ItemSize.width * 0.5) {
                // 移动超过一个item的宽度
                this.NodeLeft.active = true;
            } else {
                this.NodeLeft.active = false;
            }
            if (Math.abs(offset.x) < (this.MaxOffset.x - this.ItemSize.width * 0.5)) {
                this.NodeRight.active = true;
            } else {
                this.NodeRight.active = false;
            }
        }
    }

    private onLeftClicked() {
        if (!this.Size) {
            this.Size = this.node.getContentSize();
        }
        const offset = this.scrollview.getScrollOffset();

        if (this.scrollview.vertical) {
            TempOffset.x = 0;
            TempOffset.y = offset.y - this.Size.height * 0.5;
        } else {
            TempOffset.x = Math.abs(offset.x) - this.Size.width * 0.5;
            TempOffset.y = 0;
        }
        this.scrollview.scrollToOffset(TempOffset, 0.2);
    }

    private onRightClicked() {
        if (!this.Size) {
            this.Size = this.node.getContentSize();
        }
        const offset = this.scrollview.getScrollOffset();

        if (this.scrollview.vertical) {
            TempOffset.x = 0;
            TempOffset.y = offset.y + this.Size.height * 0.5;
        } else {
            TempOffset.x = Math.abs(offset.x) + this.Size.width * 0.5;
            TempOffset.y = 0;
        }
        this.scrollview.scrollToOffset(TempOffset, 0.2);
    }
}
