/*
 * @Author: myl
 * @Date: 2022-12-03 15:59:45
 * @Description:
 */
import WinMgr from '../../../../../../app/core/mvc/WinMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import { FuncId } from '../../../../../const/FuncConst';
import { ViewConst } from '../../../../../const/ViewConst';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { Link } from '../../../../link/Link';
import AutoShake from './AutoShake';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CompLeftTop extends cc.Component {
    // 精度条奖励
    @property(cc.Node)
    private BtnReward: cc.Node = null;

    // 跳转商城
    @property(cc.Node)
    private BtnShop: cc.Node = null;

    // 精灵进度
    @property(cc.Sprite)
    private SprPrgress: cc.Sprite = null;

    @property(cc.Node)/** 奖励按钮 边上的tip */
    private NdTip: cc.Node = null;
    @property(cc.Node)/** 奖励按钮 边上的tip */
    private NdRed: cc.Node = null;

    @property([cc.Label])/** 奖励按钮 边上的tip */
    private labArr: cc.Label[] = [];

    protected start(): void {
        UtilGame.Click(this.NdTip, () => WinMgr.I.open(ViewConst.DescWinTip, 130802), this);
        UtilGame.Click(this.BtnReward, () => {
            if (this._curNum >= this._nextNum) {
                // 足够直接领取
                ControllerMgr.I.GeneralRecruitController.reqC2SZhaoMuGetStageRw(this._actId);
            } else {
                // 显示下一档励是什么
                const model = ModelMgr.I.GeneralRecruitModel;
                const curGet = model.getStageRwGet(this._actId);
                const cfg: Cfg_Server_ZhaoMuStageReward = ModelMgr.I.GeneralRecruitModel.getCfgNextStageCfg(this._actId, curGet);
                const arrAward = cfg.Reward.split(':');
                const [itemId, itemNum] = [Number(arrAward[0]), Number(arrAward[1])];
                // isReward 是否是奖励（预览与领取奖励UI不同）
                const leftNum = this._nextNum - this._curNum;
                WinMgr.I.open(ViewConst.GeneralAwardTip, {
                    isReward: false, itemId, itemNum, leftNum,
                });
            }
        }, this);
        UtilGame.Click(this.BtnShop, () => {
            Link.To(FuncId.WuJiangShop);
        }, this);
    }

    private _actId: number;
    public setActId(actId: number): void {
        this._actId = actId;
    }

    protected onEnable(): void {
        if (this._curNum || this._nextNum) {
            if (this._curNum >= this._nextNum) {
                this.BtnReward.getComponent(AutoShake).startAni();
            } else {
                this.BtnReward.getComponent(AutoShake).stopAni();
            }
        }
    }

    private _curNum: number;
    private _nextNum: number;
    public setProgress(curNum: number, nextNum: number): void {
        this._curNum = curNum;
        this._nextNum = nextNum;

        this.SprPrgress.fillRange = curNum / nextNum;
        this.labArr[0].string = `${curNum}`;
        this.labArr[1].string = `${nextNum}`;

        this.NdRed.active = this._curNum >= this._nextNum && this._curNum !== 0;
        // 抖动动画

        if (curNum >= nextNum) {
            this.BtnReward.getComponent(AutoShake).startAni();
        } else {
            this.BtnReward.getComponent(AutoShake).stopAni();
        }
    }
}
