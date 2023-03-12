/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable dot-notation */
import { IfloatWord } from './WarConst';

export class BattleFloatWordMgr {
    private words: IfloatWord[] = [];

    private static Instance: BattleFloatWordMgr = null;
    public static get I(): BattleFloatWordMgr {
        if (this.Instance == null) {
            this.Instance = new BattleFloatWordMgr();
        }
        return this.Instance;
    }

    /** 加入队列 */
    private n = 0;
    public addFloatWord(param: IfloatWord): void {
        // const len = this._floatWords.length;
        // if (len) {
        //     for (let i = len - 1; i >= 0; i--) { // 取出400
        //         if (this._floatWords[i].effKey === param.effKey) { // 上一个是否与当前相同
        //             this._floatWords[i].addOffSet += 30;
        //         } else {
        //             break;
        //         }
        //     }
        //     param.addOffSet = this._floatWords[len - 1].addOffSet + 30;
        //     this._floatWords.push(param);// 400 0
        // } else {
        //     param.addOffSet = 0;// 第0个是0
        this.words.push(param);// 400 0
        // }
    }

    public popFloatWord(): IfloatWord {
        if (this.words.length) {
            const obj = this.words.shift();
            return obj;
        }
        return null;
    }

    /** 战斗退出 清除当前队列 */
    public clearFloatWord(): void {
        this.words = [];
    }

    /** 移动文本 */
    private _floatWords: cc.Node[] = [];

    public moveWord(nd: cc.Node): void {
        const len = this._floatWords.length;
        nd.active = true;
        nd['finalY'] = nd.y;// 记录下初始的finalY

        if (len) {
            for (let i = 0; i < len; i++) {
                this._floatWords[i]['finalY'] += 50;
                cc.Tween.stopAllByTarget(this._floatWords[i]);
                cc.tween(this._floatWords[i]).to(0.2, { y: this._floatWords[i]['finalY'] }).start();
            }
        }
        this._floatWords.push(nd);// 400 0

        setTimeout(() => {
            const nd = this._floatWords.shift();
            if (nd && nd.isValid) {
                nd['finalY'] = 0;
                cc.Tween.stopAllByTarget(nd);
                // if (this._wordEffPools && this._wordEffPools[key]) {
                //     // this._wordEffPools[key].y = 0;
                //     // this._wordEffPools[key].scale = 1;
                //     this._wordEffPools[key].put(nd);
                // } else {
                nd.destroy();
                // }
            }
        }, 800);
    }
}
