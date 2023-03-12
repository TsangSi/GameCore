import { UtilString } from '../../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../../app/core/mvc/WinMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import { ViewConst } from '../../../../../const/ViewConst';
import ModelMgr from '../../../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

/** 日志 滚动条 */
@ccclass
export default class CompLog extends cc.Component {
    @property(cc.Node)
    private BtnLog: cc.Node = null;

    @property(cc.RichText)
    private rt1: cc.RichText = null;
    @property(cc.RichText)
    private rt2: cc.RichText = null;
    @property(cc.RichText)
    private rt3: cc.RichText = null;
    @property(cc.RichText)
    private rt4: cc.RichText = null;

    private postion = [25, 0, -25, -50];

    private ndArr: cc.RichText[] = [];
    protected start(): void {
        UtilGame.Click(this.BtnLog, () => WinMgr.I.open(ViewConst.RandomLogTip, { isLog: true, actId: this._actId }), this);
        // UtilGame.Click(this.BtnAdd, this._addItem, this);
        // EventClient.I.emit(E.Chat.LobbyMsgUpdate, dta);
        // EventClient.I.on(E.Chat.LobbyMsgUpdate, this._onLog, this);
    }

    // private _onLog(data): void {

    // }
    private _actId: number;
    public setActId(actId: number): void {
        this._actId = actId;
    }

    // private _n = 10000;
    // private _addItem() {
    //     this._n++;
    //     this._data.push(this._n);
    //     const queueArr = ModelMgr.I.GeneralRecruitModel.getQueueZhaoMuLog(this._actId);
    // }

    public setData(): void {
        this._data = ModelMgr.I.GeneralRecruitModel.getQueueZhaoMuLog(this._actId);
        // console.log(this._data);

        this.ndArr = [this.rt1, this.rt2, this.rt3, this.rt4];// 放四个
        for (let i = 0; i < this.ndArr.length; i++) {
            this.ndArr[i].string = ``;
        }
        // 第一次初始数据
        for (let i = 0; i < this.ndArr.length; i++) {
            this.ndArr[i].node.y = this.postion[i];
            if (this._data[i]) {
                const str = UtilString.parseLog(this._data[i]);

                this.ndArr[i].string = `${str}`;
            }
        }

        this.unschedule(this.rollLog);
        this.schedule(this.rollLog, 1);
    }

    private _data: ZhaoMuLog[] = [];
    /** 滚动日志 */
    public rollLog(): void {
        this._data = ModelMgr.I.GeneralRecruitModel.getQueueZhaoMuLog(this._actId);
        if (this._data.length > 3) {
            for (let i = 0; i < 4; i++) {
                this.ndArr[i].string = `${UtilString.parseLog(this._data[i])}`;
            }
            cc.tween(this.ndArr[0].node).to(0.82, { y: 50 }).call(() => {
                this.ndArr[0].node.y = -50;
                const item = this.ndArr.shift();
                this.ndArr.push(item);
                const data = this._data.shift();// 移除数据
                // 删除放入删除队列
                ModelMgr.I.GeneralRecruitModel.pushIntoDeleteQueue(data, this._actId);
            }).start();
            cc.tween(this.ndArr[1].node).to(0.8, { y: 25 }).start();
            cc.tween(this.ndArr[2].node).to(0.8, { y: 0 }).start();
            cc.tween(this.ndArr[3].node).to(0.8, { y: -25 }).start();
        } else {
            // 第一次初始数据
            for (let i = 0; i < this.ndArr.length; i++) {
                this.ndArr[i].node.y = this.postion[i];
                if (this._data[i]) {
                    const str = UtilString.parseLog(this._data[i]);
                    this.ndArr[i].string = `${str}`;
                }
            }
        }
    }
}
