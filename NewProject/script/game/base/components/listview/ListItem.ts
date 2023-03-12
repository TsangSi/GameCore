/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/** ****************************************
 * @author kL <klk0@qq.com>
 * @date 2019/6/6
 * @doc 列表Item组件.
 * 说明：
 *      1、此组件须配合List组件使用。（配套的配套的..）
 * @end
 ***************************************** */
import ListView from './ListView';

const {
    ccclass, property, disallowMultiple, menu, executionOrder,
} = cc._decorator;

enum SelectedType {
    NONE = 0,
    TOGGLE = 1,
    SWITCH = 2,
}

@ccclass
@disallowMultiple()
@menu('自定义组件/List Item')
@executionOrder(-5001) // 先于List
export default class ListItem extends cc.Component {
    // 选择模式
    @property({ type: cc.Enum(SelectedType), tooltip: CC_DEV && '选择模式' })
    private selectedMode: SelectedType = SelectedType.NONE;
    // 被选标志
    @property({
        type: cc.Node,
        tooltip: CC_DEV && '被选标志',
        visible() { return this.selectedMode > SelectedType.NONE; },
    })
    protected selectedFlag: cc.Node = null;
    // 被选择的SpriteFrame
    @property({
        type: cc.SpriteFrame,
        tooltip: CC_DEV && '被选择的SpriteFrame',
        visible() { return this.selectedMode === SelectedType.SWITCH; },
    })
    private selectedSpriteFrame: cc.SpriteFrame = null;
    // 未被选择的SpriteFrame
    private _unselectedSpriteFrame: cc.SpriteFrame = null;
    // 自适应尺寸
    @property({
        tooltip: CC_DEV && '自适应尺寸（宽或高）',
    })
    private adaptiveSize: boolean = false;
    // 选择
    private _selected: boolean = false;
    public set selected(val: boolean) {
        this._selected = val;
        if (!this.selectedFlag) { return; }
        switch (this.selectedMode) {
            case SelectedType.TOGGLE:
                this.updateToggleUI(val);
                break;
            case SelectedType.SWITCH: {
                this.updateSwitchUI(val);
                // const sp: cc.Sprite = this.selectedFlag.getComponent(cc.Sprite);
                // if (sp) { sp.spriteFrame = val ? this.selectedSpriteFrame : this._unselectedSpriteFrame; }
                break;
            }
            default:
                break;
        }
    }
    public get selected(): boolean {
        return this._selected;
    }

    /** 更新UI设置 选中状态下的界面变化处理 */
    public updateSwitchUI(val: boolean): void {
        const sp: cc.Sprite = this.selectedFlag.getComponent(cc.Sprite);
        if (sp) { sp.spriteFrame = val ? this.selectedSpriteFrame : this._unselectedSpriteFrame; }
    }

    /** 更新UI设置 选中状态下的界面变化处理 */
    public updateToggleUI(val: boolean): void {
        this.selectedFlag.active = val;
    }

    // // 按钮组件
    // private _btnCom: any;
    // get btnCom() {
    //     if (!this._btnCom) { this._btnCom = this.node.getComponent(cc.Button); }
    //     return this._btnCom;
    // }
    // 依赖的List组件
    public list: ListView;
    // 是否已经注册过事件
    private _eventReg = false;
    // 序列id
    public listId: number;

    protected onLoad(): void {
        // //没有按钮组件的话，selectedFlag无效
        // if (!this.btnCom)
        //     this.selectedMode == SelectedType.NONE;
        // 有选择模式时，保存相应的东西
        if (this.selectedMode === SelectedType.SWITCH) {
            const com: cc.Sprite = this.selectedFlag.getComponent(cc.Sprite);
            this._unselectedSpriteFrame = com.spriteFrame;
        }
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
    }

    private _registerEvent() {
        if (!this._eventReg) {
            // if (this.btnCom && this.selectedMode > 0) {
            //     this.btnCom.clickEvents.unshift(this.createEvt(this, 'onClickThis'));
            // }
            if (this.adaptiveSize) {
                this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
            }
            this._eventReg = true;
        }
    }

    private _onSizeChange() {
        // eslint-disable-next-line dot-notation
        this.list['_onItemAdaptive'](this.node);
    }
    // /**
    //   * 创建事件
    //   * @param {cc.Component} component 组件脚本
    //   * @param {string} handlerName 触发函数名称
    //   * @param {cc.Node} node 组件所在node（不传的情况下取component.node）
    //   * @returns cc.Component.EventHandler
    //   */
    // private createEvt(component: cc.Component, handlerName: string, node: cc.Node = null) {
    //     if (!component || !component.isValid) { return; }// 有些异步加载的，节点以及销毁了。
    //     component.comName = component.comName || component.name.match(/\<(.*?)\>/g).pop().replace(/\<|>/g, '');
    //     const evt = new cc.Component.EventHandler();
    //     evt.target = node || component.node;
    //     evt.component = component.comName;
    //     evt.handler = handlerName;
    //     return evt;
    // }

    public showAni(aniType: number, callFunc: () => void, del: boolean): void {
        let ac = new cc.Tween();
        switch (aniType) {
            case 0: // 向上消失
                ac = ac.to(0.2, { scale: cc.v3(0.7, 0.7, 0.7) }).by(0.3, { position: cc.v3(0, this.node.height * 2) });
                break;
            case 1: // 向右消失
                ac = ac.to(0.2, { scale: cc.v3(0.7, 0.7, 0.7) }).by(0.3, { position: cc.v3(this.node.width * 2, 0) });
                break;
            case 2: // 向下消失
                ac = ac.to(0.2, { scale: cc.v3(0.7, 0.7, 0.7) }).by(0.3, { position: cc.v3(0, this.node.height * -2) });
                break;
            case 3: // 向左消失
                ac = ac.to(0.2, { scale: cc.v3(0.7, 0.7, 0.7) }).by(0.3, { position: cc.v3(this.node.width * -2, 0) });
                break;
            default: // 默认：缩小消失
                ac = ac.to(0.2, { scale: cc.v3(0.1, 0.1, 0.1) });
                break;
        }
        if (callFunc || del) {
            ac = ac.call(() => {
                if (del) {
                    this.list._delSingleItem(this.node);
                    for (let n: number = this.list.displayData.length - 1; n >= 0; n--) {
                        if (this.list.displayData[n].id === this.listId) {
                            this.list.displayData.splice(n, 1);
                            break;
                        }
                    }
                }
                callFunc();
            });
        }
        cc.tween(this.node).sequence(ac).start();
    }

    private onClickThis() {
        this.list.selectedId = this.listId;
    }
}
