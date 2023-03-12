/*
 * @Author: myl
 * @Date: 2022-10-12 17:22:04
 * @Description:
 */

import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { AttrModel } from '../../../../base/attribute/AttrModel';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import Progress from '../../../../base/components/Progress';
import { Config } from '../../../../base/config/Config';
import { ConfigConst } from '../../../../base/config/ConfigConst';
import { ConfigAttributeIndexer } from '../../../../base/config/indexer/ConfigAttributeIndexer';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { FuncId } from '../../../../const/FuncConst';
import { RES_ENUM } from '../../../../const/ResPath';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleAN } from '../../../role/RoleAN';
import { RoleMgr } from '../../../role/RoleMgr';
import { OfficialExpId } from '../../RoleOfficialConst';

const { ccclass, property } = cc._decorator;
@ccclass
export class RoleOfficialInfoView extends cc.Component {
    @property(DynamicImage)
    private LabOfficialName: DynamicImage = null;
    @property(cc.Label)
    private LabOfficialName1: cc.Label = null;

    @property(cc.Label)
    private LabAtt: cc.Label = null;
    @property(cc.Label)
    private LabFy: cc.Label = null;
    @property(cc.Label)
    private LabSm: cc.Label = null;
    @property(cc.Label)
    private LabAtt1: cc.Label = null;
    @property(cc.Label)
    private LabFy1: cc.Label = null;
    @property(cc.Label)
    private LabSm1: cc.Label = null;

    @property(cc.Label)
    private LabTipName1: cc.Label = null;
    @property(cc.Label)
    private LabTipName2: cc.Label = null;
    @property(cc.Label)
    private LabTipName3: cc.Label = null;
    @property(DynamicImage)
    private tipSpr1: DynamicImage = null;
    @property(DynamicImage)
    private tipSpr2: DynamicImage = null;
    @property(DynamicImage)
    private tipSpr3: DynamicImage = null;

    @property(DynamicImage)
    private expSpr: DynamicImage = null;

    @property(cc.Label)
    private LabNext: cc.Label = null;

    @property(cc.ProgressBar)
    private progress: cc.ProgressBar = null;
    @property(Progress)
    private expProgress: Progress = null;

    @property(DynamicImage)
    private officialIconSpr: DynamicImage = null;

    @property(cc.Node)
    private BtnUpOfficial: cc.Node = null;

    @property(cc.Label)
    private fvLab: cc.Label = null;

    @property(cc.Node)
    private maxTip: cc.Node = null;

    private _canUpOfficial: boolean = false;
    private readonly name1Ids = [1, 2, 3];
    protected start(): void {
        const model = ModelMgr.I.RoleOfficeModel;
        this.LabTipName1.string = model.getConstName1Config(1);
        this.LabTipName2.string = model.getConstName1Config(2);
        this.LabTipName3.string = model.getConstName1Config(3);
        UtilGame.Click(this.BtnUpOfficial, () => {
            // 升职
            if (this._canUpOfficial) {
                ControllerMgr.I.RoleOfficialController.upOfficial();
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.cannot_upOfficial));
            }
        }, this);
        this.updateUI();

        RoleMgr.I.on(this.updateUI, this, RoleAN.N.OfficeExp, RoleAN.N.OfficeLevel);

        const iconPath = UtilItem.GetItemIconPathByItemId(OfficialExpId);
        this.expSpr.loadImage(iconPath, 1, true);
    }

    protected updateUI(): void {
        const model = ModelMgr.I.RoleOfficeModel;
        const offCf = model.getOfficialInfo();
        // this.LabOfficialName.string = offCf.name1;
        this.LabOfficialName.loadImage(`${RES_ENUM.Com_Font_Com_Font_Official}${offCf.conf.OfficialLevel}@ML`, 1, true);
        this.LabOfficialName1.string = offCf.name2;
        this.officialIconSpr.loadImage(`${RES_ENUM.Official_Icon_Icon_Guanzhi}${offCf.conf.Picture}`, 1, true);
        const attInfo = AttrModel.MakeAttrInfo(offCf.conf.Attr);
        this.fvLab.string = UtilNum.ConvertFightValue(attInfo.fightValue);
        // 属性
        const attId = offCf.conf.Attr;
        // 下一级属性
        const cfg1 = model.getOfficialInfo(model.officialLevel + 1);

        const attr1 = AttrModel.MakeAttrInfo(attId);
        const attr2 = AttrModel.MakeAttrInfo(cfg1 ? cfg1.conf.Attr : attId);
        const attrDif = attr2.diff(attr1);
        this.LabAtt1.node.active = !!cfg1;
        this.LabFy1.node.active = !!cfg1;
        this.LabSm1.node.active = !!cfg1;
        this.LabFy.string = `${attr1.attrs[2].value}`;
        this.LabSm.string = `${attr1.attrs[0].value}`;
        this.LabAtt.string = `${attr1.attrs[1].value}`;
        this.LabAtt1.string = `+${attrDif.attrs[2].value}`;
        this.LabFy1.string = `+${attrDif.attrs[0].value}`;
        this.LabSm1.string = `+${attrDif.attrs[1].value}`;

        // 官职信息
        let star = 1;
        if (offCf.conf) {
            star = offCf.conf.OfficialStar;
        }
        const iconPath = RES_ENUM.Com_Img_Com_Icon_Dikaung;
        this.tipSpr1.loadImage(`${iconPath}${star >= 1 ? '01' : '02'}`, 1, true);
        this.tipSpr2.loadImage(`${iconPath}${star >= 2 ? '01' : '02'}`, 1, true);
        this.tipSpr3.loadImage(`${iconPath}${star >= 3 ? '01' : '02'}`, 1, true);

        this.LabTipName1.node.color = UtilColor.Hex2Rgba(star >= 1 ? UtilColor.NorV : UtilColor.WhiteD);
        this.LabTipName2.node.color = UtilColor.Hex2Rgba(star >= 2 ? UtilColor.NorV : UtilColor.WhiteD);
        this.LabTipName3.node.color = UtilColor.Hex2Rgba(star >= 3 ? UtilColor.NorV : UtilColor.WhiteD);

        let isMax = false;
        // 进度条
        this.progress.progress = (star - 1) / 2;
        const roleExp = RoleMgr.I.d.OfficeExp;
        const configExp = model.GetOfficialConfig();
        let lastConfigExp = 0;
        const lastConfig = model.GetOfficialConfig(model.officialLevel + 1);
        if (!lastConfig) {
            isMax = true;
            lastConfigExp = configExp.Exp;
        } else {
            lastConfigExp = lastConfig.Exp;
        }
        this.expProgress.updateProg(roleExp - configExp.Exp, lastConfigExp - configExp.Exp);
        if (this.expProgress.progress >= 1) {
            this.BtnUpOfficial.active = !isMax;
            this.maxTip.active = isMax;
            this._canUpOfficial = !isMax;
            UtilRedDot.UpdateRed(this.BtnUpOfficial, true, cc.v2(55, 17));
        } else {
            this._canUpOfficial = false;
            this.BtnUpOfficial.active = true;
            this.maxTip.active = false;
            UtilRedDot.UpdateRed(this.BtnUpOfficial, false, cc.v2(55, 17));
        }
        this.expProgress.updateLabColor();

        const msg1 = UtilFunOpen.getLimitMsg(FuncId.OfficialSeal, true);
        if (msg1 && msg1.length > 0) {
            this.LabNext.string = `${msg1}${i18n.tt(Lang.seal_title)}`;
        } else {
            const msg2 = UtilFunOpen.getLimitMsg(FuncId.OfficialAmulet, true);
            if (msg2 && msg2.length > 0) {
                this.LabNext.string = `${msg2}${i18n.tt(Lang.amulet_title)}`;
            } else {
                this.LabNext.node.active = false;
            }
        }
    }

    protected onDestroy(): void {
        RoleMgr.I.off(this.updateUI, this, RoleAN.N.OfficeExp, RoleAN.N.OfficeLevel);
    }
}
