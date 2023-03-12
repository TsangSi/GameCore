/*
 * @Author: kexd
 * @Date: 2022-08-17 16:46:21
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\com\GeneralName.ts
 * @Description:
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import { UtilColorFull } from '../../../base/utils/UtilColorFull';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemQuality } from '../../../com/item/ItemConst';
import { GeneralMsg } from '../GeneralConst';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GeneralName extends BaseCmp {
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabLevel: cc.Label = null;
    @property(cc.Sprite)
    private SprRarity: cc.Sprite = null;
    @property(cc.Label)
    private LabCamp: cc.Label = null;

    private _lv: number = null;
    private _quality: number = null;
    private _camp: number = null;
    private _rarity: number = null;

    protected start(): void {
        super.start();
    }

    /**
     * setData
     */
    public setData(gData: GeneralMsg, isShow: boolean = true): void {
        if (!isShow) {
            this.node.active = false;
            return;
        }
        this.node.active = true;
        if (!gData.cfg) {
            gData.cfg = Config.Get(Config.Type.Cfg_General).getValueByKey(gData.generalData.IId);
        }
        // 名字+阶
        if (gData.generalData.Grade > 0) {
            this.LabName.string = `${gData.cfg.Name}+${gData.generalData.Grade}`;
        } else {
            this.LabName.string = gData.cfg.Name;
        }

        // 等级
        if (gData.generalData.Level !== this._lv) {
            if (gData.generalData.Level) {
                this.LabLevel.string = `${gData.generalData.Level}${i18n.lv}`;
            } else {
                this.LabLevel.string = '';
            }
        }

        // 用道具品质对应的颜色
        if (gData.generalData.Quality !== this._quality) {
            UtilColorFull.resetMat(this.LabName);
            UtilColorFull.resetMat(this.LabLevel);
            if (gData.generalData.Quality === ItemQuality.COLORFUL) {
                UtilColorFull.setColorFull(this.LabName, false);
                UtilColorFull.setColorFull(this.LabLevel, false);
            } else {
                this.LabName.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(gData.generalData.Quality, true));
                this.LabLevel.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(gData.generalData.Quality, true));
            }
        }

        // 阵营
        if (gData.cfg.Camp !== this._camp) {
            this.LabCamp.string = i18n.tt(Lang[`general_camp_${gData.cfg.Camp}`]);
        }
        // 稀有度
        if (gData.cfg.Rarity !== this._rarity) {
            UtilGeneral.SetRarityRes(this.SprRarity, gData.cfg.Rarity);
        }

        this._quality = gData.generalData.Quality;
        this._lv = gData.generalData.Level;
        this._camp = gData.cfg.Camp;
        this._rarity = gData.cfg.Rarity;
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
