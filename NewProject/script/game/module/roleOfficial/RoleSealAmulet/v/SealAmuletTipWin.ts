/*
 * @Author: myl
 * @Date: 2022-10-21 15:07:43
 * @Description:
 */
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { ShareToChat } from '../../../../com/ShareToChat';
import WinBase from '../../../../com/win/WinBase';
import { RES_ENUM } from '../../../../const/ResPath';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { ChatShowItemType, CHAT_CHANNEL_ENUM } from '../../../chat/ChatConst';
import { RID } from '../../../reddot/RedDotConst';
import { RedDotMgr } from '../../../reddot/RedDotMgr';
import { SealAmuletType } from '../SealAmuletConst';
import { SealAmuletItem } from './SealAmuletItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletTipWin extends WinBase {
    @property(cc.Node)
    private NdContentShow: cc.Node = null;
    @property(cc.Node)
    private NdIcon: cc.Node = null;
    @property(cc.Label)
    private LabTitle: cc.Label = null;
    @property(cc.Label)
    private LabLv: cc.Label = null;
    @property(cc.Label)
    private LabPower: cc.Label = null;

    @property(cc.Label)
    private LabGrade: cc.Label = null;

    @property(cc.RichText)
    private property1: cc.RichText = null;
    @property(cc.RichText)
    private property2: cc.RichText = null;
    @property(cc.RichText)
    private property3: cc.RichText = null;
    @property(cc.RichText)
    private skillLab: cc.RichText = null;

    @property(cc.Node)
    private BtnShow: cc.Node = null;
    @property(cc.Node)
    private BtnGo: cc.Node = null;

    @property(cc.Node)
    private btnDet: cc.Node = null;

    @property(cc.Node)
    private NdDetail: cc.Node = null;
    @property(cc.Label)
    private LabDet1: cc.Label = null;
    @property(cc.Label)
    private LabDet2: cc.Label = null;
    @property(cc.Label)
    private LabDet3: cc.Label = null;

    @property(DynamicImage)
    private QualityBg: DynamicImage = null;

    private _data: OfficeSign = null;
    private _canOperate: boolean = false;
    protected start(): void {
        super.start();

        UtilGame.Click(this.BtnGo, () => {
            WinMgr.I.open(ViewConst.SealAmuletWin, this._data.Type, ModelMgr.I.SealAmuletModel.GetSealRedIndex(this._data.Type));
            this.close();
        }, this);

        UtilGame.Click(this.BtnShow, () => {
            // MsgToastMgr.Show(i18n.tt(Lang.com_show_success));
            // ControllerMgr.I.ChatController.showItem(
            //     this._data.Type === 1 ? ChatShowItemType.seal : ChatShowItemType.amulet,
            //     `${this._data.RefineLv}`,
            //     CHAT_CHANNEL_ENUM.Current,
            // );
            const pos = this.BtnShow.convertToWorldSpaceAR(cc.v2(0, 100));
            ShareToChat.show(
                this._data.Type === 1 ? ChatShowItemType.seal : ChatShowItemType.amulet,
                `${this._data.RefineLv}`,
                pos,
            );
        }, this);
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.NdContentShow, () => {
            // this.close();
        }, this, { scale: 1 });

        UtilGame.Click(this.btnDet, () => {
            const wpos = this.btnDet.convertToWorldSpaceAR(cc.v2(-100, -130));
            const npos = this.node.convertToNodeSpaceAR(wpos);
            this.NdDetail.setPosition(npos);
            this.NdDetail.active = !this.NdDetail.active;
            // if (this.NdDetail.active) {
            //     this.LabDet1.string = UtilNum.Convert(this._preFv[0]);
            //     this.LabDet2.string = UtilNum.Convert(this._preFv[1]);
            //     this.LabDet3.string = UtilNum.Convert(this._preFv[2]);
            // }
        }, this);

        UtilGame.Click(this.NdDetail, () => {
            this.NdDetail.active = false;
        }, this, { scale: 1 });
    }

    private _preFv: number[];
    public init(param: unknown[]): void {
        if (param && param[0]) {
            this._data = param[0] as OfficeSign;
        }
        if (param && param[1]) { // 是否可以操作
            const can = param[1] as boolean;
            this._canOperate = can;
        }

        this.BtnGo.active = this._canOperate;
        this.BtnShow.active = this._canOperate;

        const model = ModelMgr.I.SealAmuletModel;
        const info = model.GetSealAmuletInfo(this._data);
        const nameInfo = model.getAttByRefineLv(this._data.Type, this._data.RefineLv, this._data.RefineValue);

        this.LabTitle.string = i18n.tt(this._data.Type === SealAmuletType.Seal ? Lang.seal_title : Lang.amulet_title);
        this.LabLv.string = `${nameInfo.Name}${this._data.RefineLv}${i18n.jie}`;
        this.LabLv.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(nameInfo.Star, true));
        this.LabPower.string = `${UtilNum.ConvertFightValue(info.fv[0] + info.fv[1] + info.fv[2])}`;
        this.QualityBg.loadImage(`${RES_ENUM.Com_Img_Com_Bg_Tips}${nameInfo.Star}`, 1, true);
        this.LabGrade.string = `${this._data.Level}${i18n.lv}`;
        this.LabGrade.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(nameInfo.Star, true));
        this._preFv = info.fv;
        ResMgr.I.showPrefab(UI_PATH_ENUM.Module_SealAmulet_SealAmuletItem, this.NdIcon, (err, nd: cc.Node) => {
            if (!err) {
                const item = nd.getComponent(SealAmuletItem);
                item.setData(this._data, false, true);
            }
        });

        this.LabDet1.string = UtilNum.ConvertFightValue(this._preFv[0]);
        this.LabDet2.string = UtilNum.ConvertFightValue(this._preFv[1]);
        this.LabDet3.string = UtilNum.ConvertFightValue(this._preFv[2]);

        this.property1.string = info.property[0].data;
        this.property2.string = info.property[1].data;
        this.property3.string = info.property[2].data;

        this.skillLab.string = info.skill && info.skill.skill ? info.skill.skill : '无';

        UtilRedDot.UpdateRed(
            this.BtnGo,
            RedDotMgr.I.getStatus(this._data.Type === SealAmuletType.Seal
                ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Id
                : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Id),
            cc.v2(70, 15),
        );
    }
}
