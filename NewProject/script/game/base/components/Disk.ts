/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: dcj
 * @Date: 2022-10-25 16:16:52
 * @FilePath: \SanGuo-2.4-main\assets\script\game\base\components\Disk.ts
 * @Description:圆盘节点布局
 */
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';

const { ccclass, property, menu } = cc._decorator;

interface Iitem {
    child: cc.Node,
    x: number,
    y: number
}

@ccclass
@menu('业务组件/Disk')
export class Disk extends BaseCmp {
    @property({ type: cc.Prefab, displayName: '子预制', visible() { return !this._childNode; } })
    private _childPrefab: cc.Prefab = null;

    @property({ type: cc.Node, displayName: '子节点', visible() { return !this._childPrefab; } })
    private _childNode: cc.Node = null;

    @property
    private _ndCount: number = 0;
    @property({ displayName: '节点数量', visible() { return this.isShow as boolean; } })
    public get ndCount(): number { return this._ndCount; }
    public set ndCount(value: number) {
        this._ndCount = value;
        this.upAll();
    }

    @property
    private _isRevDir: boolean = false;
    @property({ displayName: '是否顺时针', visible() { return this.isShow as boolean; } })
    public get isRevDir(): boolean { return this._isRevDir; }
    public set isRevDir(value: boolean) {
        this._isRevDir = value;
        this.changePos();
    }

    @property
    private _raduis: number = 150;
    @property({ displayName: '半径', visible() { return this.isShow as boolean; } })
    protected get raduis(): number { return this._raduis; }
    protected set raduis(value: number) {
        this._raduis = value;
        this.upView();
    }

    @property
    private _offsetDeg: number = 90;
    @property({ displayName: '偏移角度', tooltip: CC_DEV && '默认居中', visible() { return this.isShow as boolean; } })
    protected get offsetDeg(): number { return this._offsetDeg; }
    protected set offsetDeg(value: number) {
        this._offsetDeg = value;
        this.upView();
    }

    @property({ type: cc.Component.EventHandler, displayName: '回调函数' })
    protected cb: cc.Component.EventHandler = null;

    private _isShow: boolean = false;
    private get isShow() {
        this._isShow = this._childNode !== null || this._childPrefab !== null;
        return this._isShow;
    }

    protected start(): void {
        super.start();
        this.upAll();
    }
    private _child: cc.Node = null;
    /** 子节点列表 */
    public childList: Iitem[] = [];
    /** 节点之间的角度 */
    public partDeg: number = 0;

    /** 更新所有 */
    protected upAll(): void {
        this._child = this._childPrefab ? cc.instantiate(this._childPrefab) : this._childNode;
        if (this.ndCount !== 0 && this._child) {
            this.partDeg = 360 / this.ndCount;
            this.upChildList();
            if (this.cb) {
                this.cb.emit(this.childList);
            }
        }
    }

    /**
     * 回调
     * @param target 目标节点
     * @param component 节点组件名
     * @param handler 组件函数名
     * @param customEventData 自定义事件参数字符串
     */
    public setCallBack(target: cc.Node, component: string, handler: string, customEventData = ''): void {
        const event = new cc.Component.EventHandler();
        event.target = target;
        event.component = component;
        event.handler = handler;
        event.customEventData = customEventData;
        this.cb = event;
    }

    /** 更新节点 */
    protected upChildList(): void {
        if (this.childList.length !== 0) {
            this.node.removeAllChildren();
            this.childList = [];
        }

        for (let i = 0; i < this.ndCount; i++) {
            const cNd = cc.instantiate(this._child);
            cNd.name = `${cNd.name}${i + 1}`;
            cNd.parent = this.node;
            this.childList.push({ child: cNd, x: 0, y: 0 });
        }
        this.upView();
    }

    /** 更新布局 */
    protected upView(): void {
        if (!this._child) { return; }
        this.childList.forEach((item, idx) => {
            item.x = Math.cos(Math.PI * (this.partDeg * idx + this.offsetDeg) / 180) * this.raduis;
            item.y = Math.sin(Math.PI * (this.partDeg * idx + this.offsetDeg) / 180) * this.raduis;
        });
        this.changePos();
    }

    protected changePos(): void {
        let _temp = [...this.childList];
        if (this.isRevDir) {
            const _splice = _temp.splice(1, _temp.length - 1).reverse();
            _temp = _temp.concat(_splice);
        }

        _temp.forEach((item, idx) => {
            this.childList[idx].child.setPosition(item.x, item.y);
        });
    }
}
