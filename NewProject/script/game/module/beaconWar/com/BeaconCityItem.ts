/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-11-01 20:58:00
 * @Description:
 *
 */

import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { SpriteCustomizer } from '../../../base/components/SpriteCustomizer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;
@ccclass
export default class BeaconCityItem extends BaseCmp {
    @property(DynamicImage)
    private SprCity: DynamicImage = null;
    @property(cc.Node)
    private NdSelect: cc.Node = null;
    @property(cc.Node)
    private SprBg: cc.Node = null;
    @property(cc.Label)
    private LabName: cc.Label = null;

    private _cityData: Cfg_BeaconWar = null;
    private _isOpen: boolean = false;
    private _callback: (cityId: number) => void = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.node, () => {
            if (this._callback) {
                if (!this._isOpen) {
                    const armyName = ModelMgr.I.ArmyLevelModel.getArmyName(this._cityData.ArmyLevel, this._cityData.ArmyStar);
                    MsgToastMgr.Show(UtilString.FormatArray(i18n.tt(Lang.beaconWar_unlock), [armyName]));
                    return;
                }
                this._callback.call(this, this._cityData.CityID);
            }
        }, this);
    }

    /**
     * 展示
     * @param itemId 道具id
     * @param exp 经验
     * @param isSelected 选中状态
     * @param callback 回调
     */
    public setData(cityData: Cfg_BeaconWar, isSelected: boolean, callback: (cityId: number) => void = null): void {
        const armyLv = RoleMgr.I.getArmyLevel();
        const armyStar = RoleMgr.I.getArmyStar();
        this._cityData = cityData;
        this._isOpen = armyLv > cityData.ArmyLevel || (armyLv === cityData.ArmyLevel && armyStar >= cityData.ArmyStar);
        // this.SprCity.loadImage(`${RES_ENUM.BeaconWar_City}${cityData.MiniIconId}`, 1, true);
        // this.NdSelect.active = isSelected;
        this.LabName.node.color = isSelected ? UtilColor.Hex2Rgba('#b55534') : UtilColor.Hex2Rgba('#98663D');
        if (!this._isOpen) {
            this.SprBg.getComponent(SpriteCustomizer).curIndex = 2;
        } else {
            this.SprBg.getComponent(SpriteCustomizer).curIndex = isSelected ? 1 : 0;
        }
        this.LabName.string = cityData.CityName;
        if (callback) {
            this._callback = callback;
        }
    }

    /**
     * 选中状态
     */
    public setSelected(isSelected: boolean): void {
        this.NdSelect.active = !!isSelected;
    }
}
