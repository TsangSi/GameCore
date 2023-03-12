import { EventClient } from '../../../../app/base/event/EventClient';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { ccPackMgr } from '../../../../app/engine/CCPackManager';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { ISTATE_BATTLE } from '../../beaconWar/BeaconWarConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class BattleResultCommonView extends BaseCmp {
    @property(DynamicImage)
    private SprTitle: DynamicImage = null;
    @property(DynamicImage)
    private SprBg: DynamicImage = null;
    @property(DynamicImage)
    private SprTitleBg: DynamicImage = null;

    @property(cc.Label)
    private TipLabel: cc.Label = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;
    /** 关闭倒计时cd */
    private _closeCd = 5;
    private _closeTip: string = null;
    private _data: S2CPrizeReport = null;

    protected start(): void {
        super.start();
        ModelMgr.I.BattleResultModel.setIsShowing(true);
        // [3]
        UtilGame.Click(this.node, () => {
            this.node.destroy();
        }, this, { scale: 1 });

        UtilGame.Click(this.BtnClose, () => {
            this.node.destroy();
        }, this);

        this.updateCd();
    }
    public changeCloseTips(flag: boolean): void {
        this._closeTip = flag ? i18n.tt(Lang.com_close_tips) : i18n.tt(Lang.arena_reward_tip);
        this.TipLabel.string = `${this._closeTip}(${this._closeCd}${i18n.tt(Lang.com_second)})`;
    }

    private _closeCall: () => void;
    /** 配置界面参数
     *  3个路径（路径处理）
     */
    public setUIState(data: S2CPrizeReport, closeCall: () => void): void {
        this._closeCall = closeCall;
        const path = RES_ENUM.BattleResult;
        this._data = data;
        const tp = 1;// ModelMgr.I.BattleResultModel.getViewConfig(this._data.FBType, this._data.Type);
        const { t, b, tb } = this.getConfigByType(tp);
        this.SprTitle.loadImage(`${path}${t}`, 1, true);
        this.SprBg.loadImage(`${path}${tb}`, 1, true);
        this.SprTitleBg.loadImage(`${path}${b}`, 1, true);
    }

    private getConfigByType(tp: number): { t: string, b: string, tb: string } {
        // 烽火结算穿插预制体显示
        const _BeaconBattleState = this._data.IntData[0] && this._data.IntData[0] === ISTATE_BATTLE.BATTLE_DIE;
        // 1: 挑战成功
        switch (tp) {
            case 1:
            case 2:
            case 8:
            case 9:
            case 122:
                return { t: 'com_font_shengli@ML', b: 'com_img_JS_shenglidiban@9[20_20_0_0]', tb: 'com_img_JS_shengli' };
            case 3:
            case 4:
                return { t: 'com_font_zhandoujieshu@ML', b: 'com_img_JS_shenglidiban@9[20_20_0_0]', tb: 'com_img_JS_shengli' };
            case 5:
                return { t: 'com_font_tiaozhanchenggong@ML', b: 'com_img_JS_shenglidiban@9[20_20_0_0]', tb: 'com_img_JS_shengli' };
            case 6:
            case 10:
                return { t: 'com_font_tiaozhanchenggong@ML', b: 'com_img_JS_shenglidiban@9[20_20_0_0]', tb: 'com_img_JS_shengli' };
            case 7:
                this.SprTitleBg.node.getComponent(cc.Sprite).sizeMode = cc.Sprite.SizeMode.CUSTOM;
                this.SprTitleBg.node.getComponent(cc.Sprite).type = cc.Sprite.Type.SLICED;
                this.SprTitleBg.node.height = 740;
                this.BtnClose.parent.getChildByName('Label').setPosition(0, -30);
                this.BtnClose.setPosition(0, -85);
                return { t: 'com_font_zhandoujieshu@ML', b: 'com_img_JS_shenglidiban@9[20_20_0_0]', tb: 'com_img_JS_shengli' };
            case 101:
            case 102:
                return { t: 'com_font_shibai@ML', b: 'com_img_JS_shibaidiban@9[20_20_0_0]', tb: 'com_img_JS_shibai' };
            case 103:
            case 104:
                return { t: 'com_font_zhandoujieshu@ML', b: 'com_img_JS_shenglidiban@9[20_20_0_0]', tb: 'com_img_JS_shengli' };
            case 105:
                return { t: 'com_font_tiaozhanshibai@ML', b: 'com_img_JS_shibaidiban@9[20_20_0_0]', tb: 'com_img_JS_shibai' };
            case 106:
                return { t: 'com_font_tiaozhanshibai@ML', b: 'com_img_JS_shibaidiban@9[20_20_0_0]', tb: 'com_img_JS_shibai' };
            case 107:
                return { t: 'com_font_zhandoujieshu@ML', b: 'com_img_JS_shenglidiban@9[20_20_0_0]', tb: 'com_img_JS_shengli' };
            case 108:
                return {
                    t: _BeaconBattleState ? 'com_font_shibai@ML' : 'com_font_zhandoujieshu@ML',
                    b: _BeaconBattleState ? 'com_img_JS_shibaidiban@9[20_20_0_0]' : 'com_img_JS_shenglidiban@9[20_20_0_0]',
                    tb: _BeaconBattleState ? 'com_img_JS_shibai' : 'com_img_JS_shengli',
                };
            case 109:
                return {
                    t: _BeaconBattleState ? 'com_font_zhandoujieshu@ML' : 'com_font_shibai@ML',
                    b: _BeaconBattleState ? 'com_img_JS_shenglidiban@9[20_20_0_0]' : 'com_img_JS_shibaidiban@9[20_20_0_0]',
                    tb: _BeaconBattleState ? 'com_img_JS_shengli' : 'com_img_JS_shibai',
                };
            case 201:
            case 202:
            case 203:
            case 204:
            case 205:
                return { t: 'com_font_saodang@ML', b: 'com_img_JS_shenglidiban@9[20_20_0_0]', tb: 'com_img_JS_shengli' };
            default:
                return { t: '', b: '', tb: '' };
        }
    }

    private _timer = null;

    protected onDestroy(): void {
        super.onDestroy();
        // this.unschedule(this._cdUpdate);
        if (this._timer) {
            this.clearInterval(this._timer);
            this._timer = null;
        }
        if (!CC_EDITOR) {
            ControllerMgr.I.BattleResultController.reqC2SGetBattlePrize();
            const isFast = this._closeCd >= 4;
            setTimeout(() => {
                EventClient.I.emit(E.GameLevel.NewPlotPlayAfter);
            }, isFast ? 100 : 0);

            ModelMgr.I.BattleResultModel.setIsShowing(false);
        }
        if (this._closeCall) {
            this._closeCall();
        }
    }

    // private _timer: NodeJS.Timer = null;
    private updateCd() {
        // this.unschedule(this._cdUpdate);
        // this.schedule(this._cdUpdate, 1);
        if (this._timer) {
            this.clearInterval(this._timer);
            this._timer = null;
        }

        this._timer = this.setInterval(() => {
            this._closeCd--;
            this.TipLabel.string = `${this._closeTip}(${this._closeCd}${i18n.tt(Lang.com_second)})`;
            if (this._closeCd < 1) {
                // 关闭界面通知发奖
                this.node.destroy();
            }
        }, 1000);
    }
}
