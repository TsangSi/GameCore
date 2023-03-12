import BaseCmp from '../../../app/core/mvc/view/BaseCmp';

/*
 * @Author: dcj
 * @Date: 2022-11-25 15:03:09
 * @FilePath: \SanGuo-2.4-main\assets\script\game\base\components\TypeWriter.ts
 * @Description:打字机，循环打字
 */
const {
    ccclass, property, requireComponent, menu,
} = cc._decorator;

/** 状态 */
export enum IState {
    /** 初始化 */
    Init = -1,
    /** 打字中 */
    Run = 0,
    /** 暂停 */
    Stop = 1,
    /** 结束 */
    End = 2
}
@ccclass
@requireComponent(cc.Label)
@menu('业务组件/TypeWriter')
export class TypeWriter extends BaseCmp {
    @property
    private _speed: number = 200;
    @property({ displayName: '打字速度', tooltip: '默认0.2秒' })
    private get Speed(): number {
        return this._speed;
    }
    private set Speed(_s: number) {
        this._speed = _s;
    }
    /** 打字机状态,默认 */
    private _state: IState = IState.Init;
    public get state(): IState {
        return this._state;
    }
    public set state(v: IState) {
        this._state = v;
    }
    /** 打字内容 */
    private content: string = null;
    /** 打字记录点 */
    private _labIdx: number = 0;
    // 文本节点
    private _labNd: cc.Label = null;
    /** 定时器 */
    private _timer = null;
    protected start(): void {
        super.start();
        this._labNd = this.node.getComponent(cc.Label);
    }
    protected onDestroy(): void {
        super.onDestroy();
        this.clearInterval(this._timer);
        this._timer = null;
    }
    // 打印字
    private printWord(w: string): void {
        this._labIdx += 1;
        this._labNd.string += w;
    }
    // 开始打字
    public startPlay(): void {
        if (this.state === IState.Run) {
            console.log('已经在打字中');
            return;
        }
        if (this._timer) {
            this.clearInterval(this._timer);
            this._timer = null;
        }
        this.state = IState.Run;
        this._timer = this.setInterval(() => {
            console.log('打字中');
            if (this._state === IState.Stop) {
                return;
            }
            if (!this.content || this._labIdx === this.content.length) {
                this.endPlay();
                return;
            }
            const _w = this.content.slice(this._labIdx, this._labIdx + 1);
            this.printWord(_w);
        }, this.Speed);
    }
    // 暂停打字
    public stopPlay(): void {
        if (this.state !== IState.Run) {
            console.log('不在打字状态');
            return;
        }
        this.state = IState.Stop;
    }
    // 结束打字
    public endPlay(): void {
        if (this.state === IState.End) {
            console.log('打字已经结束');
            return;
        }
        if (this._timer) {
            this.clearInterval(this._timer);
            this._timer = null;
        }
        if (this.content) {
            this._labIdx = this.content.length;
            this._labNd.string = this.content;
        }
        this.state = IState.End;
    }
    // 初始化打字
    public initPlay(): void {
        if (this._timer) {
            this.clearInterval(this._timer);
            this._timer = null;
        }
        this.reset();
    }

    /**
     * 设置打字机内容
     * @param str  打印内容
     * @param play 立即播放，默认true
     */
    public setContent(str: string, play: boolean = true): void {
        if (!str) {
            str = this._labNd.string;// this.node.getComponent(cc.Label).string;
        }
        if (this.state !== IState.Init) {
            this.setWriteState(IState.Init);
        }
        this.content = str;
        if (play) {
            this.setWriteState(IState.Run);
        }
    }

    /** 设置打字机状态,设置之前，要先赋值label */
    public setWriteState(state: IState): void {
        switch (state) {
            case IState.Run:
                this.startPlay();
                break;
            case IState.Stop:
                this.stopPlay();
                break;
            case IState.End:
                this.endPlay();
                break;
            case IState.Init:
                this.initPlay();
                break;
            default:
                console.warn('打字机状态设置异常');
                break;
        }
    }

    /** 初始化数据 */
    private reset(): void {
        this.content = null;
        this._labIdx = 0;
        this.state = IState.Init;
    }

    /** 获取打字机状态 */
    public getWriteState(): IState {
        return this._state;
    }
}
