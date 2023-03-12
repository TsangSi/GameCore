/*
 * @Author: myl
 * @Date: 2022-11-21 12:07:21
 * @Description:
 */

import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import { AttrModel } from '../../../../base/attribute/AttrModel';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { UtilColorFull } from '../../../../base/utils/UtilColorFull';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import WinBase from '../../../../com/win/WinBase';
import { RES_ENUM } from '../../../../const/ResPath';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleMgr } from '../../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SealAmuletUpWin extends WinBase {
    @property(cc.Label)
    private LabName0: cc.Label = null;
    @property(cc.Label)
    private LabName1: cc.Label = null;

    @property(DynamicImage)
    private Icon0: DynamicImage = null;
    @property(DynamicImage)
    private Icon1: DynamicImage = null;

    @property(cc.Label)
    private LabAtt0: cc.Label = null;
    @property(cc.Label)
    private LabAtt1: cc.Label = null;
    @property(cc.Node)
    private maskNd: cc.Node = null;

    public init(parma: unknown): void {
        super.init(parma);
        // 当前等级
        const curLvCfg = ModelMgr.I.RoleOfficeModel.getOfficialInfo(RoleMgr.I.d.OfficeLevel - 1);
        // 上一等级
        const nextLvCfg = ModelMgr.I.RoleOfficeModel.getOfficialInfo();

        this.LabName0.string = `${nextLvCfg.name1}•${nextLvCfg.name2}`;
        this.LabName1.string = `${curLvCfg.name1}•${curLvCfg.name2}`;

        const q0 = UtilItem.GetItemQualityColor(curLvCfg.conf.Quality, true);
        const q1 = UtilItem.GetItemQualityColor(nextLvCfg.conf.Quality, true);
        this.LabName0.node.color = UtilColor.Hex2Rgba(q1);
        this.LabName1.node.color = UtilColor.Hex2Rgba(q0);
        UtilColorFull.setQuality(this.LabName1, curLvCfg.conf.Quality, true);
        UtilColorFull.setQuality(this.LabName0, nextLvCfg.conf.Quality, true);

        this.Icon0.loadImage(`${RES_ENUM.Official_Icon_Icon_Guanzhi}${nextLvCfg.conf.Picture}`, 1, true);
        this.Icon1.loadImage(`${RES_ENUM.Official_Icon_Icon_Guanzhi}${curLvCfg.conf.Picture}`, 1, true);

        const att0 = AttrModel.MakeAttrInfo(nextLvCfg.conf.Attr);
        let att0Str = '';
        for (let index = 0; index < att0.attrs.length; index++) {
            const att = att0.attrs[index];
            att0Str += `\n${att.name}:${att.value}`;
        }
        this.LabAtt0.string = att0Str;

        const att1 = AttrModel.MakeAttrInfo(curLvCfg.conf.Attr);
        let att1Str = '';
        for (let index = 0; index < att1.attrs.length; index++) {
            const att = att1.attrs[index];
            att1Str += `\n${att.name}:${att.value}`;
        }
        this.LabAtt1.string = att1Str;

        UtilGame.Click(this.maskNd, () => {
            this.close();
        }, this, { scale: 1 });
    }
}
