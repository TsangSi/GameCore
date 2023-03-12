/*
 * @Author: zs
 * @Date: 2023-02-08 17:29:04
 * @Description:
 *
 */
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilString } from '../../../app/base/utils/UtilString';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import { i18n, Lang } from '../../../i18n/i18n';
import { Config } from '../../base/config/Config';
import { UtilGame } from '../../base/utils/UtilGame';
import WinBase from '../../com/win/WinBase';
import { EFBExploreType } from './FBExploreConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FBExploreReset extends WinBase {
    @property(cc.RichText)
    private RichDesc: cc.RichText = null;
    @property(cc.Label)
    private LabelTime: cc.Label = null;

    private endTime: number = 6;
    protected onLoad(): void {
        UtilGame.Click(this.NodeBlack, this.close, this);
        // this.endTime = UtilTime.NowSec() + 5;
    }

    public init(params: any[]): void {
        const type: EFBExploreType = params[0];
        const cfg: Cfg_FB_Explore = Config.Get(Config.Type.Cfg_FB_Explore).getValueByKey(type);
        const name = cfg.ExploreName;
        this.RichDesc.string = UtilString.FormatArgs(i18n.tt(Lang.fbexplore_reset_tips), name, UtilColor.GreenV, '#ff6c0a');
    }

    protected updatePerSecond(): void {
        const time = --this.endTime;
        if (time < 0) {
            this.close();
        } else {
            // this.LabelTime.string = UtilString.FormatArgs(i18n.tt(Lang.fbexplore_auto_close_tips), time);
        }
    }
}
