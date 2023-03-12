/*
 * @Author: zs
 * @Date: 2022-11-18 12:00:32
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\com\TeamTypeLevelItem.ts
 * @Description:
 *
 */
import { UtilNum } from '../../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { DynamicImage, ImageType } from '../../../../../base/components/DynamicImage';
import { SpriteCustomizer } from '../../../../../base/components/SpriteCustomizer';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { RES_ENUM } from '../../../../../const/ResPath';
import ModelMgr from '../../../../../manager/ModelMgr';
import { RoleMgr } from '../../../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class TeamTypeLevelItem extends BaseCmp {
    @property(DynamicImage)
    private Icon: DynamicImage = null;
    @property(SpriteCustomizer)
    private SpriteFrame: SpriteCustomizer = null;
    @property(cc.Node)
    private SpriteMask: cc.Node = null;
    @property(cc.Label)
    private LabelLevel: cc.Label = null;

    private _select: boolean = false;
    @property(cc.Boolean)
    public set select(b: boolean) {
        if (this._select === b) {
            return;
        }
        this._select = b;
        this.SpriteFrame.curIndex = this._select ? 1 : 0;
    }
    public get select(): boolean {
        return this._select;
    }

    @property(cc.Boolean)
    public set lock(b: boolean) {
        if (this.SpriteMask.active === b) {
            return;
        }
        this.SpriteMask.active = b;
    }
    public get lock(): boolean {
        return this.SpriteMask.active;
    }

    private level: number = 0;
    private lastFbId: number = 0;
    /**
     * @param level 等级
     * @param index 索引
     * @param lastFbId 上一個等級副本id
     */
    public setData(level: number, index: number, lastFbId: number): void {
        this.level = level;
        this.lastFbId = lastFbId;
        this.LabelLevel.string = UtilString.FormatArgs(i18n.tt(Lang.com_level), level);
        const bannerIndex = ((index + 1) % 4) || 1;

        // 等级不满足，或者上一个等级副本未通关
        this.lock = level > RoleMgr.I.d.Level || (lastFbId && !ModelMgr.I.TeamModel.isPass(lastFbId));
        this.Icon.loadImage(`${RES_ENUM.Team_Img_Zd_Tu}${UtilNum.FillZero(bannerIndex, 2)}`, ImageType.JPG, true);
    }

    /** 是否能选中 */
    public isCanSelect(showTips: boolean = false): boolean {
        let result = RoleMgr.I.d.Level >= this.level;
        if (showTips && !result) {
            MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.team_page_select_level_tips), this.level));
            showTips = false;
        }
        if (result) {
            result = !this.lastFbId || ModelMgr.I.TeamModel.isPass(this.lastFbId);
            if (showTips && !result) {
                const c: Cfg_TeamBoss_Level = ModelMgr.I.TeamModel.cfg.getValueByKeyFromLevel(this.lastFbId);
                MsgToastMgr.Show(UtilString.FormatArgs(i18n.tt(Lang.team_page_select_pass_tips), c.LevelLimit));
            }
        }
        return result;
    }
}
