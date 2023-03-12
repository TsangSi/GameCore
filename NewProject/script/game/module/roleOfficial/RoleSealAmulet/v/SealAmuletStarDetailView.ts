/*
 * @Author: myl
 * @Date: 2022-10-18 14:25:09
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { AttrModel } from '../../../../base/attribute/AttrModel';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilItemList from '../../../../base/utils/UtilItemList';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { ItemWhere } from '../../../../com/item/ItemConst';
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
import { UtilShop } from '../../../shop/UtilShop';
import { SealAmuletProgress } from './SealAmuletProgress';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletStarDetailView extends cc.Component {
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

    @property(SealAmuletProgress)
    private progress: SealAmuletProgress = null;

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
    @property(cc.Node)
    private upStarBtn: cc.Node = null;
    @property(cc.Node)
    private NdUpStar: cc.Node = null;
    @property(cc.Node)
    private NdUpStarNeed: cc.Node = null;
    // 当前正在升级的属性字符
    @property(cc.Label)
    private curLab: cc.Label = null;

    private _data: OfficeSign = null;
    private _costItemId: number = 0;
    private _costItemNum: number;
    /** 能否手动升级 */
    private _canUp = false;
    private _canBreak = false;
    /** 升星时 材料是否充足 */
    private _breakMatsEnough = '';

    /** 如果未解锁上限则为false 点击提示解锁信息 */
    private _canClick = true;
    private _unClickTip = '';
    private _otherBreakMatId: number = 0;

    @property(cc.Label)
    private tipLab: cc.Label = null;

    protected start(): void {
        UtilGame.Click(this.BtnUp, () => {
            if (!this._canClick) {
                MsgToastMgr.Show(this._unClickTip);
                return;
            }

            if (UtilShop.itemIsEnough(this._costItemId, this._costItemNum, this.Tog.isChecked, true)) {
                ControllerMgr.I.SealAmuletController.upStarSealAmulet(this._data.Type, this.Tog.isChecked);
            }
        }, this);
        UtilGame.Click(this.BtnAutoUp, () => {
            if (!this._canClick) {
                MsgToastMgr.Show(this._unClickTip);
                return;
            }

            // 判断是否不足
            if (UtilShop.itemIsEnough(this._costItemId, this._costItemNum, this.Tog.isChecked, true)) {
                ControllerMgr.I.SealAmuletController.autoStar(this._data.Type, this.Tog.isChecked);
            }
        }, this);

        UtilGame.Click(this.upStarBtn, () => {
            if (!this._canClick) {
                MsgToastMgr.Show(this._unClickTip);
                return;
            }
            if (this._canBreak) {
                const breadNeed = this._breakMatsEnough.split('|');
                for (let k = 0; k < breadNeed.length; k++) {
                    const itmeConf = breadNeed[k].split(':');
                    if (!UtilShop.itemIsEnough(parseInt(itmeConf[0]), parseInt(itmeConf[1]), false, true)) { return; }
                }
                ControllerMgr.I.SealAmuletController.upStarBreak(this._data.Type);
            }
        }, this);

        EventClient.I.on(E.SealAmulet.UpStar, this.setUpView, this);
        EventClient.I.on(E.Bag.ItemChange, this.bagChange, this);

        const redId = this._data.Type === 1
            ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Star.Up
            : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Star.Up;
        const redId1 = this._data.Type === 1
            ? RID.Role.RoleOfficial.Official.SealAmulet.Seal.Star.Break
            : RID.Role.RoleOfficial.Official.SealAmulet.Amulet.Star.Break;
        UtilRedDot.Bind(redId, this.BtnUp, cc.v2(80, 25));
        UtilRedDot.Bind(redId, this.BtnAutoUp, cc.v2(80, 25));
        UtilRedDot.Bind(redId1, this.upStarBtn, cc.v2(80, 25));
    }

    private bagChange(changes: { itemModel: ItemModel, status: number }[]): void {
        let needRefresh = false;
        for (let i = 0, len = changes.length; i < len; i++) {
            const info = changes[i];
            if (info.itemModel.cfg.Id === this._costItemId || info.itemModel.cfg.Id === this._otherBreakMatId) {
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
        const star = data.Star;
        const starPos = data.StarPos;
        const exp = data.StarExp;
        const model = ModelMgr.I.SealAmuletModel;
        const confCur = model.getAttByStar(data.Type, star, starPos);
        let nextConf = model.getNextAttByStar(confCur.Id + 1);
        if (!nextConf || nextConf.Tpye !== confCur.Tpye) {
            nextConf = null;
        }
        if (!nextConf) {
            this.progress.updateProgress(1, 1);
            this.ndMaxLv.active = true;
            this.BtnGroup.active = false;
            this.NdUpStar.active = false;
            nextConf = confCur;
            this.progress.node.active = false;
        } else {
            // this.progress.node.active = true;
            this.ndMaxLv.active = false;
            this.BtnGroup.active = true;
            this.progress.updateProgress(exp - confCur.Exp, nextConf.Exp - confCur.Exp);
            if (this.progress.progress >= 1) {
                this.BtnGroup.active = false;
                this.NdUpStar.active = true;
                this._canBreak = true;
                this.progress.node.active = false;
            } else {
                this._canBreak = false;
                this.NdUpStar.active = false;
                this.BtnGroup.active = true;
                this.progress.node.active = true;
            }
        }

        // 处理当前的进度条数据
        const att = AttrModel.MakeAttrInfo(confCur.Attr);
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

        for (let k = 0; k < diffAtt.attrs.length; k++) {
            const v = diffAtt.attrs[k];
            if (v.value > 0) {
                this.curLab.string = v.name.slice(0, 1);
            }
        }

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

        if (this._canBreak) {
            UtilItemList.ShowItems(this.NdUpStarNeed, nextConf.NeedItem, {
                option: {
                    needNum: true, where: ItemWhere.OTHER, needLimit: true,
                },
            });
            this._otherBreakMatId = Number(nextConf.NeedItem.split('|')[1].split(':')[0]);
            this._breakMatsEnough = nextConf.NeedItem;
        }
        // 处理解锁信息
        const limitInfo = model.conditionInfo(nextConf);
        if (!limitInfo.state) {
            this._canClick = false;
            this._unClickTip = limitInfo.desc + i18n.tt(Lang.com_unlock_max);
            this.tipLab.string = i18n.tt(Lang.con_zhu) + this._unClickTip;
            this.tipLab.node.active = true;
        } else {
            this._canClick = true;
            this.tipLab.node.active = false;
        }

        this.Tog.node.active = UtilShop.GoodsIsInShop(this._costItemId);
    }
    private toggleClick() {
        if (this.Tog.isChecked && !WinAutoPayTipsModel.getState(this._data.Type === 1 ? AutoPayKey.SealStar : AutoPayKey.AmuletStar)) {
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
                recordKey: this._data.Type === 1 ? AutoPayKey.SealStar : AutoPayKey.AmuletStar,
            };
            WinMgr.I.open(ViewConst.WinAutoPayTips, conf);
        }
    }

    protected onDestroy(): void {
        EventClient.I.off(E.SealAmulet.UpStar, this.setUpView, this);
        EventClient.I.off(E.Bag.ItemChange, this.bagChange, this);
    }
}
