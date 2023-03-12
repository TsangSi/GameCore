/*
 * @Author: zs
 * @Date: 2022-05-24 12:14:58
 * @FilePath: \SanGuo-2.4-main\assets\script\game\base\components\NumberChoose.ts
 * @Description: 数量选择组件
 *
 */
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import MsgToastMgr from '../msgtoast/MsgToastMgr';
import { UtilGame } from '../utils/UtilGame';
import { i18n, Lang } from '../../../i18n/i18n';

const { ccclass, property } = cc._decorator;

// 提示内容
export interface tipsType {
    add?: string,
    dec?: string,
    max?: string,
    min?: string
}

@ccclass
export class NumberChoose extends cc.Component {
    @property(cc.Node)
    private NodeAddOne: cc.Node = null;
    @property(cc.Node)
    private NodeDecOne: cc.Node = null;
    @property(cc.Node)
    private NodeAdd: cc.Node = null;
    @property(cc.Node)
    private NodeDec: cc.Node = null;
    @property(cc.Node)
    private NodeMin: cc.Node = null;
    @property(cc.Node)
    private NodeMax: cc.Node = null;
    @property({
        type: cc.EditBox,
        visible(this: NumberChoose) {
            return !this.LabNum;
        },
    })
    private EditBox: cc.EditBox = null;
    @property({
        type: cc.Label,
        visible(this: NumberChoose) {
            return !this.EditBox;
        },
    })
    private LabNum: cc.Label = null;
    @property({ type: cc.Integer, tooltip: '减1，每次减的数' })
    private DecCountOne: number = 1;
    @property({ type: cc.Integer, tooltip: '加1，每次加的数' })
    private AddCountOne: number = 1;

    @property({ serializable: true })
    private _AddCount: number = 10;
    @property({
        type: cc.Integer,
        tooltip: '+按钮，每次加的数',
        visible(this: NumberChoose) {
            return !!this.NodeAdd;
        },
    })
    private set AddCount(c: number) {
        this._AddCount = c;
        UtilCocos.SetString(this.NodeAdd, 'Label', [`+${c}`]);
    }
    private get AddCount(): number { return this._AddCount; }

    @property({ serializable: true })
    private _DecCount: number = 10;
    @property({
        type: cc.Integer,
        tooltip: '-按钮，每次减的数',
        visible(this: NumberChoose) {
            return !!this.NodeDec;
        },
    })
    private set DecCount(c: number) {
        this._DecCount = c;
        UtilCocos.SetString(this.NodeDec, 'Label', [`-${c}`]);
    }
    private get DecCount(): number { return this._DecCount; }

    @property({ serializable: true })
    private _curCount: number = 0;
    /** 当前的数 */
    @property({ type: cc.Integer, tooltip: '默认数量' })
    public set curCount(c: number) { this.updateCount(c); }
    public get curCount(): number { return this._curCount; }

    @property({ serializable: true })
    private _minCount: number = 1;
    /** 最小的数 */
    @property({ type: cc.Integer, tooltip: '最小数量' })
    private set minCount(c: number) { this._minCount = c; }
    private get minCount(): number { return this._minCount; }

    @property({ serializable: true })
    private _maxCount: number = 10000;
    /** 最大的数 */
    @property({ type: cc.Integer, tooltip: '最大数量' })
    private set maxCount(c: number) { this._maxCount = c; }
    private get maxCount(): number { return this._maxCount; }

    @property(cc.Component.EventHandler)
    private changeEvents: cc.Component.EventHandler[] = [];

    protected onLoad(): void {
        this.updateCount(this._curCount);
        UtilGame.Click(this.NodeAddOne, this.onAddOneClicked, this);
        UtilGame.Click(this.NodeDecOne, this.onDecOneClicked, this);

        if (this.EditBox) {
            this.EditBox.node.on('text-changed', this.onEditorTextChanged, this);
            this.EditBox.node.on('editing-did-ended', this.onEditorDidEnded, this);
        }

        if (this.NodeAdd) {
            UtilCocos.SetString(this.NodeAdd, 'Label', [`+${this._AddCount}`]);
            UtilGame.Click(this.NodeAdd, this.onAddClicked, this);
        }

        if (this.NodeDec) {
            UtilCocos.SetString(this.NodeDec, 'Label', [`-${this._DecCount}`]);
            UtilGame.Click(this.NodeDec, this.onDecClicked, this);
        }

        if (this.NodeMin) {
            UtilGame.Click(this.NodeMin, this.onMinClicked, this);
        }

        if (this.NodeMax) {
            UtilGame.Click(this.NodeMax, this.onMaxClicked, this);
        }
    }

    private onEditorTextChanged() {
        this.curCount = parseInt(this.EditBox.string) || 0;
    }

    private onEditorDidEnded() {
        if (this.EditBox.string === '') {
            this.curCount = this.minCount;
        }
    }

    public setMaxCount(count: number): void {
        this.maxCount = count;
        if (this._curCount > this.maxCount) {
            this.curCount = this.maxCount;
        }
    }

    /** 更新数量 */
    private updateCount(count: number): void {
        if (count > this.maxCount) {
            count = this.maxCount;
        } else if (count < this.minCount) {
            count = this.minCount;
        }
        this._curCount = count;
        if (this.EditBox) {
            this.EditBox.string = this._curCount.toString();
        } else {
            this.LabNum.string = this._curCount.toString();
        }
        this.changeEvents.forEach((e) => {
            e.emit([this._curCount]);
        });
    }

    private tipsContent: tipsType = {
        add: i18n.tt(Lang.number_choose_add),
        dec: i18n.tt(Lang.number_choose_dec),
        max: '',
        min: '',
    };

    /** 设置提示语 */
    public setTipsContent(tips: tipsType): void {
        if (tips.add) {
            this.tipsContent.add = tips.add;
        }
        if (tips.dec) {
            this.tipsContent.dec = tips.dec;
        }
        if (tips.min) {
            this.tipsContent.min = tips.min;
        }
        if (tips.max) {
            this.tipsContent.max = tips.max;
        }
    }

    /** 加 */
    private onAddClicked() {
        this.curCount += this.AddCount;

        if (this.curCount === this.maxCount) {
            MsgToastMgr.Show(this.tipsContent.add);
        }
    }

    /** 减 */
    private onDecClicked() {
        this.curCount -= this.DecCount;

        if (this.curCount === this.minCount) {
            MsgToastMgr.Show(this.tipsContent.dec);
        }
    }
    /** 加1 */
    private onAddOneClicked() {
        this.curCount += this.AddCountOne;
        if (this.curCount === this.maxCount) {
            MsgToastMgr.Show(this.tipsContent.add);
        }
    }

    /** 减1 */
    private onDecOneClicked() {
        this.curCount -= this.DecCountOne;
        if (this.curCount === this.minCount) {
            MsgToastMgr.Show(this.tipsContent.dec);
        }
    }

    /** 最小 */
    private onMinClicked() {
        if (this.curCount === this.minCount) {
            MsgToastMgr.Show(this.tipsContent.min);
            return;
        }
        this.curCount = this.minCount;
    }

    /** 最大 */
    private onMaxClicked() {
        if (this.curCount === this.maxCount) {
            MsgToastMgr.Show(this.tipsContent.max);
            return;
        }
        this.curCount = this.maxCount;
    }
}
