/*
 * @Author: myl
 * @Date: 2022-10-18 14:25:17
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { AttrModel } from '../../../../base/attribute/AttrModel';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import Progress from '../../../../base/components/Progress';
import { Config } from '../../../../base/config/Config';
import { ConfigShopIndexer } from '../../../../base/config/indexer/ConfigShopIndexer';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import ItemModel from '../../../../com/item/ItemModel';
import { E } from '../../../../const/EventName';
import { RES_ENUM } from '../../../../const/ResPath';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { BagMgr } from '../../../bag/BagMgr';
import { IWinAutoPayTips } from '../../../pay/WinAutoPayTips';
import { WinAutoPayTipsModel, AutoPayKey } from '../../../pay/WinAutoPayTipsModel';
import { RID } from '../../../reddot/RedDotConst';
import { RoleMgr } from '../../../role/RoleMgr';
import { UtilShop } from '../../../shop/UtilShop';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletGradeDetailView extends cc.Component {
    // 攻击
    @property(cc.Label)
    private att1Lab: cc.Label = null;
    @property(cc.Label)
    private att11Lab: cc.Label = null;
    // 生命
    @property(cc.Label)
    private att2Lab: cc.Label = null;
    @property(cc.Label)
    private att21Lab: cc.Label = null;

    // 防御
    @property(cc.Label)
    private att3Lab: cc.Label = null;
    @property(cc.Label)
    private att31Lab: cc.Label = null;

    @property(cc.Label)
    private lvLabel: cc.Label = null;
    @property(Progress)
    private progress: Progress = null;

    @property(DynamicImage)
    private itemSpr: DynamicImage = null;
    @property(cc.Label)
    private costLab: cc.Label = null;

    @property(cc.Toggle)
    private Tog: cc.Toggle = null;

    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Node)
    private BtnAutoUp: cc.Node = null;
    @property(cc.Node)
    private ndMaxLv: cc.Node = null;
    @property(cc.Node)
    private BtnGroup: cc.Node = null;

    private _data: OfficeSign = null;
    private _costItemId: number = 0;
    private _costItemNum: number = 0;
    /** 能否手动升级 */
    private _canUp = false;

    /** 如果未解锁上限则为false 点击提示解锁信息 */
    private _canClick = true;
    private _unClickTip = '';

    @property(cc.Label)
    private tipLab: cc.Label = null;

    protected start(): void {
        UtilGame.Click(this.BtnUp, () => {
            if (!this._canClick) {
                MsgToastMgr.Show(this._unClickTip);
                return;
            }
            if (UtilShop.itemIsEnough(this._costItemId, this._costItemNum, this.Tog.isChecked, true)) {
                ControllerMgr.I.SealAmuletController.upSealAmulet(this._data.Type, this.Tog.isChecked);
            }
        }, this);
        UtilGame.Click(this.BtnAutoUp, () => {
            if (!this._canClick) {
                MsgToastMgr.Show(this._unClickTip);
                return;
            }
            if (UtilShop.itemIsEnough(this._costItemId, this._costItemNum, this.Tog.isChecked, true)) {
                ControllerMgr.I.SealAmuletController.autoUp(this._data.Type, this.Tog.isChecked);
            }
        }, this);

        EventClient.I.on(E.SealAmulet.UpGrade, this.setUpView, this);
        EventClient.I.on(E.Bag.ItemChange, this.bagChange, this);

        const redId = this._data.Type === 1
            ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Grade.Btn
            : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Grade.Btn;
        UtilRedDot.Bind(redId, this.BtnUp, cc.v2(80, 25));
        UtilRedDot.Bind(redId, this.BtnAutoUp, cc.v2(80, 25));
    }

    private bagChange(changes: { itemModel: ItemModel, status: number }[]): void {
        let needRefresh = false;
        for (let i = 0, len = changes.length; i < len; i++) {
            const info = changes[i];
            if (info.itemModel.cfg.Id === this._costItemId) {
                needRefresh = true;
                break;
            }
        }

        if (needRefresh) {
            this.setUpView(this._data);
        }
    }

    public setUpView(data: OfficeSign): void {
        this._data = data;
        const lv = data.Level;
        const exp = data.LevelExp;
        this.lvLabel.string = `${lv}${i18n.lv}`;
        const model = ModelMgr.I.SealAmuletModel;
        const confCur = model.getAttByLv(data.Type, lv);
        let nextConf = model.getAttByLv(data.Type, lv + 1);
        if (!nextConf) {
            this.progress.updateProgress(confCur.Exp, confCur.Exp);
            this.progress.node.active = true;
            this.ndMaxLv.active = true;
            this.BtnGroup.active = false;
            nextConf = confCur;
        } else {
            this.ndMaxLv.active = false;
            this.progress.node.active = true;
            this.BtnGroup.active = true;
            this.progress.updateProgress(exp - confCur.Exp, nextConf.Exp - confCur.Exp, false);
        }

        // 处理当前的进度条数据
        const att = AttrModel.MakeAttrInfo(confCur.Attr);
        if (att.attrs.length < 3) {
            console.log('属性未找到');
            return;
        }
        const att1 = AttrModel.MakeAttrInfo(nextConf.Attr);
        const diffAtt = att1.diff(att);

        this.att1Lab.string = `${att.attrs[1].name}:${att.attrs[1].value}`;
        this.att11Lab.string = ` +${diffAtt.attrs[1].value}`;
        this.att11Lab.node.active = diffAtt.attrs[1].value > 0;

        this.att2Lab.string = `${att.attrs[0].name}:${att.attrs[0].value}`;
        this.att21Lab.string = ` +${diffAtt.attrs[0].value}`;
        this.att21Lab.node.active = diffAtt.attrs[0].value > 0;

        this.att3Lab.string = `${att.attrs[2].name}:${att.attrs[2].value}`;
        this.att31Lab.string = ` +${diffAtt.attrs[2].value}`;
        this.att31Lab.node.active = diffAtt.attrs[2].value > 0;

        // 计算消耗
        const costInfo = nextConf.NeedItem.split(':');
        const costType = parseInt(costInfo[0]);
        const costNum = parseInt(costInfo[1]);
        const haveNum = BagMgr.I.getItemNum(costType);
        this._costItemId = costType;
        this._costItemNum = costNum;
        this.itemSpr.loadImage(`${RES_ENUM.Item}${UtilItem.GetCfgByItemId(costType).PicID}`, 1, true);
        this.costLab.string = `${UtilNum.Convert(haveNum)}/${costNum}`;

        if (costNum <= haveNum) {
            this._canUp = true;
            this.costLab.node.color = UtilColor.Hex2Rgba(UtilColor.GreenV);
        } else {
            this._canUp = false;
            this.costLab.node.color = UtilColor.Hex2Rgba(UtilColor.RedV);
        }

        this.Tog.node.active = UtilShop.GoodsIsInShop(this._costItemId);

        // 处理解锁信息
        const limitInfo = model.conditionInfo(nextConf);
        if (!limitInfo.state) {
            this._canClick = false;
            const oInfo = ModelMgr.I.RoleOfficeModel.getOfficialInfo(limitInfo.info.Param1);
            this._unClickTip = UtilString.FormatArray(limitInfo.desc, [`${oInfo.name1}•${oInfo.name2}`]) + i18n.tt(Lang.com_unlock_max);
            this.tipLab.string = i18n.tt(Lang.con_zhu) + this._unClickTip;
            this.tipLab.node.active = true;
        } else {
            this._canClick = true;
            this.tipLab.node.active = false;
        }
    }

    private toggleClick() {
        if (this.Tog.isChecked && !WinAutoPayTipsModel.getState(this._data.Type === 1 ? AutoPayKey.SealGrade : AutoPayKey.AmuletGrade)) {
            const conf: IWinAutoPayTips = {
                /** 回调 */
                cb: (b: boolean) => {
                    if (this.Tog && this.Tog.isValid) {
                        this.Tog.isChecked = b;
                    }
                },
                /** 购买的物品 */
                itemId: this._costItemId,
                /** 存储的key */
                recordKey: this._data.Type === 1 ? AutoPayKey.SealGrade : AutoPayKey.AmuletGrade,
            };
            WinMgr.I.open(ViewConst.WinAutoPayTips, conf);
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.SealAmulet.UpGrade, this.setUpView, this);
        EventClient.I.off(E.Bag.ItemChange, this.bagChange, this);
    }
}
