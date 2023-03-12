import { ETaskStatus } from '../../module/task/TaskConst';
const { ccclass, property } = cc._decorator;

@ccclass
export class StateButton extends cc.Component {
    @property(cc.Node)
    private btnGet: cc.Node = null;// 领取
    @property(cc.Node)
    private btnAlready: cc.Node = null;// 已领取
    @property(cc.Node)
    private btnGo: cc.Node = null;// 前往

    public state: number = 0;

    public setState(state: number): void {
        this.state = state;
        this.btnGo.active = state === ETaskStatus.Processing;
        this.btnGet.active = state === ETaskStatus.Completed;
        this.btnAlready.active = state === ETaskStatus.Awarded;
    }
}
