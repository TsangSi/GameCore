/*
 * @Author: kexd
 * @Date: 2023-02-20 14:57:13
 * @FilePath: \SanGuo2.4\assets\script\game\module\funcPreview\v\FuncOpenWin.ts
 * @Description:
 *
 */

import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import { Link } from '../../link/Link';

const { ccclass, property } = cc._decorator;

@ccclass
export class FuncOpenWin extends WinBase {
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabClose: cc.Label = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    private _funcId: number = 0;
    private _countdown: number = 5;

    protected start(): void {
        super.start();
        this.clk();
    }

    public init(args: unknown[]): void {
        //
        this._funcId = args[0] as number;
        const cfgFunc: Cfg_Client_Func = UtilFunOpen.getFuncCfg(this._funcId);

        this.SprIcon.loadImage(`${RES_ENUM.FuncPreviewOpen}${this._funcId}`, ImageType.PNG, true);
        this.LabName.string = cfgFunc.Desc;
        this.LabClose.string = UtilString.FormatArray(i18n.tt(Lang.func_close), [this._countdown]);
        this.schedule(this.countdown, 1);
    }

    public refreshView(args: unknown[]): void {
        this._countdown = 5;
        this._funcId = args[0] as number;
        const cfgFunc: Cfg_Client_Func = UtilFunOpen.getFuncCfg(this._funcId);

        this.SprIcon.loadImage(`${RES_ENUM.FuncPreviewOpen}${this._funcId}`, ImageType.PNG, true);
        this.LabName.string = cfgFunc.Desc;
        this.LabClose.string = UtilString.FormatArray(i18n.tt(Lang.func_close), [this._countdown]);
        this.unschedule(this.countdown);
        this.schedule(this.countdown, 1);
    }

    private countdown() {
        this.LabClose.string = UtilString.FormatArray(i18n.tt(Lang.func_close), [this._countdown]);
        this._countdown--;
        if (this._countdown < 0) {
            this._countdown = 0;
            this.onClose();
        }
    }

    private clk() {
        UtilGame.Click(this.BtnClose, () => {
            Link.To(this._funcId);
            this.onClose();
        }, this);

        UtilGame.Click(this.NodeBlack, () => {
            this.onClose();
        }, this, { scale: 1 });
    }

    private onClose() {
        WinMgr.I.close(ViewConst.FuncOpenWin);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
