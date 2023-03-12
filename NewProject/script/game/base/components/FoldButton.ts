/*
 * @Author: hwx
 * @Date: 2022-05-10 16:39:04
 * @FilePath: \SanGuo\assets\script\game\base\components\FoldButton.ts
 * @Description: 折叠按钮，常用与收纳
 */
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../utils/UtilGame';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('常用组件/FoldButton')
export class FoldButton extends BaseCmp {
    @property({ type: cc.Sprite })
    protected SprArrow: cc.Sprite = null;

    @property
    private _fold: boolean = false;
    @property({ displayName: '折叠' })
    public get fold(): boolean { return this._fold; }
    public set fold(value: boolean) {
        this._fold = value;
        this.rotationFoldArrow(value);
    }

    @property
    private _foldAngle: number = 0;
    @property({ displayName: '折叠后角度' })
    protected get foldAngle(): number { return this._foldAngle; }
    protected set foldAngle(value: number) {
        this._foldAngle = value;
        this.rotationFoldArrow(this._fold);
    }

    @property
    private _unfoldAngle: number = 0;
    @property({ displayName: '展开后角度' })
    protected get unfoldAngle(): number { return this._unfoldAngle; }
    protected set unfoldAngle(value: number) {
        this._unfoldAngle = value;
        this.rotationFoldArrow(this._fold);
    }

    /** 侦听折叠事件列表 */
    @property({ type: cc.Component.EventHandler, displayName: '折叠事件' })
    protected eventHandler: cc.Component.EventHandler[] = [];

    protected start(): void {
        super.start();

        this.setFoldState(this.fold);

        // let enter = false;
        UtilGame.Click(this.node, () => {
            this.setFoldState(!this.fold);
            // if (enter) {
            //     SceneMap.I.sendEnterMap(8);
            //     EventClient.I.emit(E.FuBen.Exit);
            // } else {
            //     SceneMap.I.sendEnterMap(11);
            //     EventClient.I.emit(E.FuBen.Enter);
            // }
            // enter = !enter;
        }, this);
    }

    /**
     * 设置折叠状态
     * @param fold
     */
    public setFoldState(fold: boolean): void {
        this.fold = fold;
        // 分发事件
        this.eventHandler.forEach((event) => {
            event.emit([fold]);
        });
    }

    /**
     * 获取折叠状态
     * @param fold
     */
    public getFoldState(): boolean {
        return this.fold;
    }

    /**
     * 旋转折叠箭头
     * @param angle 旋转角度
     */
    private rotationFoldArrow(fold: boolean): void {
        const angle = fold ? this.foldAngle : this.unfoldAngle;
        const ndArrow = this.SprArrow.node;
        if (CC_EDITOR) {
            ndArrow.angle = angle;
        } else {
            cc.Tween.stopAllByTarget(ndArrow);
            cc.tween(ndArrow).to(0.2, { angle }).start();
        }
    }

    /**
     * 增加监听折叠状态
     * @param target 目标节点
     * @param component 节点组件名
     * @param handler 组件函数名
     * @param customEventData 自定义事件参数字符串
     */
    public addEventHandler(target: cc.Node, component: string, handler: string, customEventData = ''): void {
        const event = new cc.Component.EventHandler();
        event.target = target;
        event.component = component;
        event.handler = handler;
        event.customEventData = customEventData;
        this.eventHandler.push(event);

        // 先执行一次
        event.emit([this.fold]);
    }

    /**
     * 删除监听折叠状态
     * @param target 目标节点
     * @param component 节点组件名
     * @param handler 组件函数名
     */
    public removeEventHandler(target: cc.Node, component: string, handler: string): void {
        this.eventHandler.some((event, index) => {
            if (event.target === target && event.component === component && event.handler === handler) {
                this.eventHandler.splice(index, 1);
                return true;
            }
            return false;
        });
    }
}
