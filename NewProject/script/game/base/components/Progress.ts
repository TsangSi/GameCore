/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
/*
 * @Author: zs
 * @Date: 2022-04-08 11:41:28
 * @Description:
 *
 */
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import { i18n, Lang } from '../../../i18n/i18n';

const { ccclass, property } = cc._decorator;

export enum LableStyle {
    /** 空，不需要显示label */
    Empty,
    /** 显示百分比(20%) */
    Per,
    /** 显示数值(2/10) */
    Num,
    /** 显示数值（可超过最大值 15/10） */
    NumExceed,
    /** 只显示当前值 */
    CurNum,
    /** 向上取整显示百分比(20%) */
    PerCeil,
    /** 纯文本 经验条只显示文本 */
    OnlyText,
}
@ccclass
export default class Progress extends cc.ProgressBar {
    @property({ type: cc.Label, visible() { return this._labelStyle !== LableStyle.Empty; }, tooltip: CC_DEV && 'Label，用于显示进度' })
    private Label: cc.Label = null;

    @property({ serializable: true })
    private _labelStyle: LableStyle = LableStyle.Empty;
    @property({ type: cc.Enum(LableStyle), tooltip: CC_DEV && 'Label样式, 包括以下五种：\n 1. Empty: 空，不需要显示label \n 2. Per: 显示百分比(20%) \n 3. Num: 显示数值(2/10) \n 4. NumExceed: 显示数值（可超过最大值 15/10） \n 5. CurNum: 只显示当前值' })
    public get labelStyle(): LableStyle {
        return this._labelStyle;
    }
    public set labelStyle(value: LableStyle) {
        if (this._labelStyle !== value) {
            this._labelStyle = value;
            this.autoSetBarSprite();
            this.updateLabel(this._curNum, this._totalNum);
        }
    }
    /** 多语言的key */
    @property({ tooltip: CC_DEV && '仅在LableStyle.CurNum样式下才有效，比如要显示xx秒，此处填写秒，要填写多语言的key' })
    private LabelSufixI18nKey: string = '';

    @property({ serializable: true })
    private _totalNum: number = 100;
    @property({ type: cc.Integer, visible() { return this._labelStyle !== LableStyle.Empty && this._labelStyle !== LableStyle.Per && this._labelStyle !== LableStyle.PerCeil; }, tooltip: CC_DEV && '总进度值' })
    public get totalNum(): number {
        return this._totalNum;
    }
    /** 总值 */
    public set totalNum(value: number) {
        if (!Number.isNaN(value) && this._totalNum !== value) {
            this._totalNum = value;
            this.updateProgress(this._curNum, this._totalNum);
        }
    }

    @property({ serializable: true })
    private _curNum: number = 1;
    @property({ type: cc.Integer, visible() { return this._labelStyle !== LableStyle.Empty && this._labelStyle !== LableStyle.Per && this._labelStyle !== LableStyle.PerCeil; }, tooltip: CC_DEV && '当前进度值' })
    public get curNum(): number {
        return this._curNum;
    }
    /** 当前值 */
    public set curNum(value: number) {
        if (!Number.isNaN(value) && this._curNum !== value) {
            this._curNum = value;
            this.updateProgress(this._curNum, this._totalNum);
        }
    }
    public static LabelStyle = LableStyle;
    /** 是否是第一次 */
    private isFirst: boolean = true;

    /** 自动帮编辑器把Bar绑定节点 */
    private autoSetBarSprite() {
        if (!CC_EDITOR || this.barSprite) { return; }
        this.barSprite = this.node.getChildByName('Bar')?.getComponent(cc.Sprite);
        // Bar渲染模式是Filled填充，那么progressbar的显示模式要设置为填充模式
        if (this.barSprite && this.barSprite.type === cc.Sprite.Type.FILLED && this.mode !== cc.ProgressBar.Mode.FILLED) {
            this.mode = cc.ProgressBar.Mode.FILLED;
            this.totalLength = 1;
        }
    }

    private _tofix: number = 0;
    public set toFix(fixNum: number) {
        this._tofix = fixNum;
    }

    /**
     * 获取进度[0.1-1]
     */
    public get progressVal(): number {
        return this.progress;
    }
    /**
     * 设置进度，[0.1-1]
     */
    public set progressVal(value: number) {
        this.autoSetBarSprite();
        this._curNum = value * this._totalNum;
        // console.log('value, this._totalNum, this._curNum=', value, this._totalNum, this._curNum);
        this.updateLabel(this._curNum, this._totalNum);
        if (this.progress === value) {
            return;
        }
        this.progress = value;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, dot-notation
        this['_updateBarStatus']();
    }

    /**
     * 更新进度，有动作
     * @param curNum 当前值
     */
    public updateProgress(curNum: number): void
    /**
     * 更新进度，有动作
     * @param curNum 当前值
     * @param showAction 是否显示动作，默认为true
     */
    public updateProgress(curNum: number, showAction: boolean): void
    /**
     * 更新进度，有动作
     * @param curNum 当前值
     * @param totalNum 总值
     */
    public updateProgress(curNum: number, totalNum: number): void
    /**
     * 更新进度，有动作
     * @param curNum 当前值
     * @param totalNum 总值
     * @param showAction 是否显示动作，默认为true
     */
    public updateProgress(curNum: number, totalNum: number, showAction: boolean): void
    public updateProgress(curNum: number, totalNum?: number | boolean, showAction: boolean = true): void {
        if (Number.isNaN(curNum)) {
            console.error('进度条currNum isNaN');
            return;
        }
        if (totalNum !== undefined && totalNum !== null) {
            if (typeof totalNum === 'number') {
                showAction = showAction || false;
            } else {
                showAction = totalNum !== false;
                totalNum = this._totalNum;
            }
        }
        if (this.isFirst) {
            this.isFirst = false;
            showAction = false;
        }
        if (showAction) {
            this.stopAction();
            this.startAction(curNum, totalNum as number);
        } else {
            this._totalNum = totalNum as number;
            if (this._totalNum === 0) {
                this.progressVal = 0;
            } else {
                this.progressVal = curNum / this._totalNum;
            }

            this.stopAction();
        }
    }

    private startAction(endNum: number, totalEndNum: number): void {
        if (this._totalNum === totalEndNum && endNum <= this._curNum) {
            this.isNeedFull = true;
        }
        this.actionEndNum = endNum;
        this.actionTotalEndNum = totalEndNum;
        this.schedule(this.onAddAction, 0.005);
        this.onAddAction(1);
    }

    private stopAction(): void {
        this.unschedule(this.onAddAction);
        this.offsetAddNum = 0;
        this.isNeedFull = false;
    }

    /** 轮数 */
    private isNeedFull: boolean = false;
    private actionEndNum: number = 0;
    private actionTotalEndNum: number = 0;
    private offsetAddNum: number = 0;
    private onAddAction(dt: number): void {
        this.offsetAddNum = Math.ceil(this._totalNum / 10);
        this._curNum += this.offsetAddNum;
        let endNum = this.actionEndNum;
        if (this.isNeedFull) {
            endNum = this._totalNum;
        }
        if (this._totalNum === this.actionTotalEndNum && this._curNum >= endNum) {
            this.stopAction();
            this._totalNum = this.actionTotalEndNum;
            if (this._totalNum === 0) {
                this.progressVal = 0;
            } else {
                this.progressVal = this.actionEndNum / this._totalNum;
            }

            this.actionEndNum = 0;
            this.actionTotalEndNum = 0;
            return;
        }
        if (this._curNum > this._totalNum) {
            this._curNum -= this._totalNum;
            this._totalNum = this.actionTotalEndNum;
        }

        if (this._totalNum === 0) {
            this.progressVal = 0;
        } else {
            this.progressVal = this._curNum / this._totalNum;
        }
    }

    private updateLabel(cur: number, max: number) {
        if (!this.Label || !this.Label.isValid) { return; }
        this.Label.node.active = true;
        // 防止展示数字出现很多小数
        cur = UtilNum.Float32(cur);
        max = UtilNum.Float32(max);
        switch (this._labelStyle) {
            case LableStyle.Num:
                if (this._tofix) {
                    this.Label.string = `${Math.min(cur, max).toFixed(this._tofix)}/${max.toFixed(this._tofix)}`;
                } else {
                    this.Label.string = `${Math.min(cur, max)}/${max}`;
                }
                break;
            case LableStyle.Per:
                if (max === 0) {
                    this.Label.string = `${0}%`;
                } else {
                    this.Label.string = `${Math.floor(Math.min(cur, max) * 100 / max)}%`;
                }
                break;
            case LableStyle.NumExceed:
                this.Label.string = `${cur}/${max}`;
                break;
            case LableStyle.CurNum:
                this.Label.string = `${cur}${i18n.tt(Lang[this.LabelSufixI18nKey])}`;
                break;
            case LableStyle.PerCeil:
                if (max === 0) {
                    this.Label.string = `${0}%`;
                } else {
                    this.Label.string = `${Math.ceil(Math.min(cur, max) * 100 / max)}%`;
                }
                break;
            case LableStyle.OnlyText:
                this.Label.string = i18n.tt(Lang[this.LabelSufixI18nKey]);
                break;
            default:
                this.Label.node.active = false;
                break;
        }
    }

    protected onDestroy(): void {
        this.stopAction();
    }

    /** 更新进度  此处单独处理 没有动画 切 可以大于1 */
    public updateProg(num1: number, num2: number): void {
        this.progress = num1 > num2 ? 1 : num1 / num2;
        this.Label.string = `${num1}/${num2}`;
    }

    public updateProgressRate(num: number): void {
        this.progress = num;
    }

    /** 更新label的颜色值 */
    public updateLabColor(): void {
        if (this.progress >= 1) {
            this.Label.node.color = UtilColor.Hex2Rgba(UtilColor.GreenG);
        } else {
            this.Label.node.color = UtilColor.Hex2Rgba(UtilColor.RedG);
        }
    }
}
