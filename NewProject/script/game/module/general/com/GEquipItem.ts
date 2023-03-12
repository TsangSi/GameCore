/*
 * @Author: kexd
 * @Date: 2022-11-16 17:29:36
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\general\com\GEquipItem.ts
 * @Description: 武将-装备item
 *
 */

import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { BagMgr } from '../../bag/BagMgr';
import { GEquipMsg } from '../GeneralConst';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { SpriteCustomizer } from '../../../base/components/SpriteCustomizer';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import ControllerMgr from '../../../manager/ControllerMgr';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GEquipItem extends BaseCmp {
    @property(DynamicImage)
    private SprBg: DynamicImage = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Node)
    private NdStars: cc.Node = null;
    @property(cc.Label)
    private LabLevel: cc.Label = null;

    @property(cc.Node)
    private NdNum: cc.Node = null;
    @property(cc.Label)
    private LabHave: cc.Label = null;
    @property(cc.Label)
    private LabNeed: cc.Label = null;

    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Node)
    private NdClick: cc.Node = null;
    @property(cc.Node)
    private NdAdd: cc.Node = null;

    private _data: GEquipMsg = null;
    private _needClick: boolean = true;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NdAdd, () => {
            const cost = this.getCost();
            if (cost.have < cost.need) {
                WinMgr.I.open(ViewConst.ItemSourceWin, +this._data.cfg.Cost.split(':')[0]);
                return;
            }
            ControllerMgr.I.GeneralController.reqGeneralEquipWear(this._data.onlyId, this._data.cfg.Part);
        }, this);

        UtilGame.Click(this.NdClick, () => {
            if (this._needClick) {
                WinMgr.I.open(ViewConst.GEquipTipsWin, this._data);
            }
        }, this);
    }

    /**
     * 展示
     * @param data GEquipMsg
     */
    public setData(data: GEquipMsg, needClick: boolean = true): void {
        if (!data) return;
        this._data = data;
        this._needClick = needClick;
        this.NdClick.active = needClick;
        // 品质框和icon
        if (data.isEquiped) {
            this.SprIcon.loadImage(`${RES_ENUM.General_Item}${data.cfg.Icon}`, 1, true);
            this.SprBg.loadImage(UtilItem.GetItemQualityBgPath(data.cfg.Quality), 1, true);
        } else {
            this.SprIcon.getComponent(cc.Sprite).spriteFrame = null;
            this.SprBg.loadImage(UtilItem.GetItemQualityBgPath(0), 1, true);
        }

        // 阶
        this.LabLevel.node.active = data.isEquiped;
        if (data.isEquiped) {
            this.LabLevel.string = `${UtilNum.ToChinese(data.cfg.Level)}${i18n.tt(Lang.com_reborn)}`;
        }
        // 星星
        this.refreshStars(data.cfg.Star, !data.isEquiped);

        // name
        this.LabName.string = data.cfg.Name;
        // add
        this.NdAdd.active = !data.isEquiped;
        // 红点
        let isRed: boolean = false;

        // 数量
        this.NdNum.active = !data.isEquiped;
        if (!data.isEquiped) {
            const cost = this.getCost();

            const color: cc.Color = cost.have >= cost.need ? UtilColor.Hex2Rgba(UtilColor.GreenG) : UtilColor.Hex2Rgba(UtilColor.RedG);
            this.LabHave.node.color = color;
            this.LabHave.string = `${UtilNum.Convert(cost.have)}`;
            this.LabNeed.string = `/${UtilNum.Convert(cost.need)}`;

            isRed = cost.have >= cost.need;
        }

        UtilRedDot.UpdateRed(this.node, isRed, cc.v2(42, 42));
    }

    /**
     * 刷新星数
     * @param star
     * @param isHide
     */
    public refreshStars(star: number, isHide?: boolean): void {
        if (isHide) {
            this.NdStars.active = false;
        } else {
            this.NdStars.active = star > 0;
            if (this.NdStars.active) {
                this.NdStars.children.forEach((node, idx) => {
                    const spr = node.getComponent(SpriteCustomizer);
                    if (idx < star) {
                        spr.curIndex = SpriteCustomizer.Statu.Select;
                    } else {
                        spr.curIndex = SpriteCustomizer.Statu.Normall;
                    }
                });
            }
        }
    }

    private getCost(): { need: number, have: number } {
        const cost = this._data.cfg.Cost.split(':');
        const id: number = +cost[0];
        const need: number = +cost[1];
        const have: number = BagMgr.I.getItemNum(id);
        return { need, have };
    }

    /** 属性红点 */
    public refreshRed(): void {
        const cost = this.getCost();
        UtilRedDot.UpdateRed(this.node, cost.have >= cost.need, cc.v2(42, 42));
    }
}
