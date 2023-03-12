/*
 * @Author: myl
 * @Date: 2022-12-29 14:03:06
 * @Description:
 */

import { data } from '../../../../../../resources/i18n/en-US';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { AssetType } from '../../../../../app/core/res/ResConst';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { Config } from '../../../../base/config/Config';
import { ConfigConst } from '../../../../base/config/ConfigConst';
import { ConfigRoleSkinIndexer } from '../../../../base/config/indexer/ConfigRoleSkinIndexer';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import WinBase from '../../../../com/win/WinBase';
import { ViewConst } from '../../../../const/ViewConst';
import EntityBase from '../../../../entity/EntityBase';
import EntityUiMgr from '../../../../entity/EntityUiMgr';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleSpecialCollectWin extends WinBase {
    // @property(cc.Node)
    // private BgNd: cc.Node = null;
    @property(cc.Label)
    private PowerLab: cc.Label = null;
    @property(cc.Node)
    private BtnHuanhua: cc.Node = null;

    @property(cc.Node)
    private NdAnim: cc.Node = null;
    @property(cc.Label)
    private LabSuitName: cc.Label = null;
    @property(DynamicImage)
    private SprQuality: DynamicImage = null;

    @property(cc.RichText)
    private RichTip: cc.RichText = null;

    private _suitCfg: Cfg_SkinSuit = null;
    public init(param: unknown[]): void {
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });

        if (param && param[0]) {
            this._suitCfg = param[0] as Cfg_SkinSuit;
        }
        if (!this._suitCfg) {
            this.close();
        } else {
            this.updateUI();
        }

        UtilGame.Click(this.BtnHuanhua, () => {
            ControllerMgr.I.RoleSkinController.C2SSuitWearOrRemove(this._suitCfg.Id);
            this.close();
        }, this);
    }
    private entity: EntityBase;
    private updateUI() {
        this.LabSuitName.string = this._suitCfg.Name;
        const attrInfo = ModelMgr.I.RoleSkinModel.getSuitAllPartAttrInfo(this._suitCfg.Id, true);
        this.PowerLab.string = attrInfo.fightValue.toString();
        const indexer: ConfigRoleSkinIndexer = Config.Get(ConfigConst.Cfg_RoleSkin);
        // 获取套装品质
        const quality = indexer.getSuitQuality(this._suitCfg.Id, this._suitCfg.Type);
        this.SprQuality.loadImage(UtilItem.GetItemQualityFontImgPath(quality, true), 1, true);
        const resType = ANIM_TYPE.ROLE;
        this.NdAnim.destroyAllChildren();
        this.NdAnim.removeAllChildren();
        const suitId: number = this._suitCfg.Id;
        this.entity = EntityUiMgr.I.createAttrEntity(this.NdAnim, {
            isMainRole: true, resType, suitId, isShowTitle: false,
        });

        this.RichTip.string = UtilString.FormatArray(i18n.tt(Lang.specialSuit_collect), [UtilItem.GetItemQualityColor(quality), this._suitCfg.Name]);
    }

    protected onEnable(): void {
        if (this.entity) {
            this.entity.resume();
        }
    }
}
