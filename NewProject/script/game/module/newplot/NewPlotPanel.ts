import { Config } from '../../base/config/Config';
import { UtilGame } from '../../base/utils/UtilGame';
import WinBase from '../../com/win/WinBase';
import EntityUiMgr from '../../entity/EntityUiMgr';
import { RoleMgr } from '../role/RoleMgr';

/*
 * @Author: zs
 * @Date: 2022-11-23 18:37:34
 * @FilePath: \SanGuo2.4\assets\script\game\module\newplot\NewPlotPanel.ts
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

/** 位置枚举 */
enum EPosition {
    /** 左边 */
    Left = 0,
    /** 右边 */
    Right = 1
}

@ccclass
export default class NewPlotPanel extends WinBase {
    @property(cc.RichText)
    private RichText: cc.RichText = null;
    @property(cc.Node)
    private NdAnimLeft: cc.Node = null;
    @property(cc.Node)
    private NdAnimRight: cc.Node = null;
    @property(cc.Label)
    private LabelNameLeft: cc.Label = null;
    @property(cc.Label)
    private LabelNameRight: cc.Label = null;
    @property(cc.Node)
    private BtnSkip: cc.Node = null;
    @property(cc.ProgressBar)
    private ProgressBar: cc.ProgressBar = null;
    /** 剧情列表 */
    private plotIds: number[] = [];
    /** 当前展示的文字数量 */
    private curNum: number = 0;
    /** 当前展示的时间 */
    private curTime: number = 0;
    /** 当前剧情列表的索引 */
    private curPlayIndex: number = 0;
    /** 最终要展示的文字 */
    private text: string = '';
    /** 每次展示的文字数量 */
    private oneTimesNum: number = 0;
    /** 文字的总数量 */
    private maxNum: number = 0;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.node.getChildByName('SprBlack'), this.onClicked, this);
        UtilGame.Click(this.BtnSkip, this.onBtnSkip, this);
    }
    protected start(): void {
        super.start();
        this.playPlot();
    }

    /** 当前剧情id */
    private get curPlayPlotId(): number {
        return this.plotIds[this.curPlayIndex];
    }
    /** 获取下一个剧情id */
    private getNextPlayPlotId(): number {
        return this.plotIds[this.curPlayIndex + 1];
    }

    /** 完成触发的回调 */
    private completeFunc: () => void;
    private target: any = null;
    public init(param: any[]): void {
        this.plotIds = param[0];
        this.completeFunc = param[1];
        this.target = param[2];
    }

    /** 播放剧情 */
    public playPlot(): void {
        const cfgNP: Cfg_NewPlot = Config.Get(Config.Type.Cfg_NewPlot).getValueByKey(this.curPlayPlotId);
        if (!cfgNP) {
            this.close();
            return;
        }
        this.curNum = 0;
        this.curTime = 0;
        this.text = cfgNP.Text;
        this.maxNum = this.text.length;
        const time = 2;
        this.oneTimesNum = Math.ceil(this.maxNum / time);
        if (cfgNP.ResourceType) {
            if (cfgNP.Position === EPosition.Left) {
                this.showAnim(this.NdAnimLeft, cfgNP.AnimId, cfgNP.ResourceType);
                this.LabelNameLeft.string = cfgNP.Name;
                this.NdAnimRight.active = false;
                this.LabelNameRight.node.parent.active = false;
                this.LabelNameLeft.node.parent.active = true;
            } else {
                this.NdAnimLeft.active = false;
                this.showAnim(this.NdAnimRight, cfgNP.AnimId, cfgNP.ResourceType);
                this.LabelNameRight.string = cfgNP.Name;
                this.LabelNameLeft.node.parent.active = false;
                this.LabelNameRight.node.parent.active = true;
            }
        } else {
            this.NdAnimLeft.active = false;
            this.LabelNameLeft.node.parent.active = false;
            this.NdAnimRight.active = false;
            this.LabelNameRight.node.parent.active = false;
        }
    }

    private showAnim(nodeAnim: cc.Node, animId: number, type: any) {
        nodeAnim.active = true;
        if (nodeAnim) {
            // eslint-disable-next-line dot-notation
            if (nodeAnim['animId'] !== animId) {
                nodeAnim.attr({ animId });
                nodeAnim.destroyAllChildren();
                if (animId) {
                    EntityUiMgr.I.createAnim(nodeAnim, animId, type);
                } else {
                    EntityUiMgr.I.createAttrEntity(nodeAnim, { isMainRole: true, isShowTitle: false }, RoleMgr.I.info);
                }
            }
        }
    }

    /** 下一条剧情 */
    private nextPlot() {
        const plotId = this.getNextPlayPlotId();
        if (plotId) {
            this.curPlayIndex++;
            this.playPlot();
        } else {
            this.close();
        }
    }

    protected update(dt: number): void {
        this.curTime += dt;
        const needShowNum = this.oneTimesNum * this.curTime;
        if (this.curNum < this.maxNum && this.curNum !== needShowNum) {
            // this.curNum = needShowNum;
            // this.RichText.string = this.text.substring(0, Math.min(this.curNum, this.maxNum));
            this.updateText(needShowNum);
        }
    }

    private onClicked() {
        if (this.curNum < this.maxNum) {
            // 还在逐渐显示文字
            // this.curNum = this.maxNum;
            // this.RichText.string = this.text;
            this.updateText(this.maxNum);
        } else {
            // 已经显示完文字了，点击到下一条剧情
            this.unschedule(this.onProgress);
            this.ProgressBar.progress = 0;
            this.nextPlot();
        }
    }

    private updateText(num: number) {
        if (num >= this.maxNum) {
            this.curNum = this.maxNum;
            this.RichText.string = this.text;
            this.ProgressBar.progress = 0;
            this.schedule(this.onProgress, 0.1);
        } else {
            this.curNum = num;
            this.RichText.string = this.text.substring(0, Math.min(this.curNum, this.maxNum));
        }
    }

    private onProgress() {
        // console.log('this.ProgressBar.progress=', this.ProgressBar.progress);
        if (this.ProgressBar.progress >= 1) {
            this.unschedule(this.onProgress);
            this.nextPlot();
            this.ProgressBar.progress = 0;
        } else {
            this.ProgressBar.progress += 0.15;
        }
    }

    private onBtnSkip() {
        this.close();
    }

    protected close(): void {
        super.close();
        if (this.completeFunc) {
            if (this.target) {
                this.completeFunc.call(this.target);
            } else {
                this.completeFunc();
            }
        }
    }
}
