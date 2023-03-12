/*
 * @Author: myl
 * @Date: 2022-11-17 11:42:09
 * @Description:
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilHead from '../../../base/utils/UtilHead';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { E } from '../../../const/EventName';
import { ESex } from '../../../const/GameConst';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagItemChangeInfo } from '../../bag/BagConst';
import { BagMgr } from '../../bag/BagMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { HeadItemData, HeadPhotoType } from '../HeadConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeadInfoView extends cc.Component {
    /** 头像 */
    @property(cc.Sprite)
    private SprHead: cc.Sprite = null;
    /** 头像框 */
    @property(cc.Sprite)
    private SprHeadFrame: cc.Sprite = null;

    /** 升星信息 */
    @property(DynamicImage)
    private MatIconStar: DynamicImage = null;
    @property(DynamicImage)
    private MatIconActive: DynamicImage = null;
    @property(cc.Label)
    private LabNeedStar: cc.Label = null;
    @property(cc.Label)
    private LabNeedActive: cc.Label = null;

    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private labStarNum: cc.Label = null;

    // 使用
    @property(cc.Node)
    private BtnUse: cc.Node = null;
    // 升星
    @property(cc.Node)
    private NdUpStar: cc.Node = null;
    @property(cc.Node)
    private BtnUpStar: cc.Node = null;
    // 激活
    @property(cc.Node)
    private NdActive: cc.Node = null;
    @property(cc.Node)
    private BtnActive: cc.Node = null;

    // 使用中
    @property(cc.Node)
    private NdUsing: cc.Node = null;
    // 未激活
    @property(cc.Node)
    private NdUnActivate: cc.Node = null;

    // 攻
    @property(cc.Label)
    private LabAtt1: cc.Label = null;
    @property(cc.Label)
    private LabAtt11: cc.Label = null;
    // 防
    @property(cc.Label)
    private LabAtt2: cc.Label = null;
    @property(cc.Label)
    private LabAtt21: cc.Label = null;
    // 血
    @property(cc.Label)
    private LabAtt3: cc.Label = null;
    @property(cc.Label)
    private LabAtt31: cc.Label = null;

    @property(cc.Label)
    private LabFv: cc.Label = null;
    @property(cc.Node)
    private BtnCheck: cc.Node = null;

    @property(cc.Node)
    private NdMax: cc.Node = null;
    @property(cc.Node)
    private NdUpStarMat: cc.Node = null;

    @property(cc.Node)
    private NdEff: cc.Node = null;
    @property(cc.Label)
    private LabEffTip: cc.Label = null;

    // 基础头像无属性提示文字
    @property(cc.Node)
    private NdDefaultTip: cc.Node = null;
    @property(cc.Label)
    private LabDefaultTip: cc.Label = null;
    @property(cc.Node)
    private NdPowerInfo: cc.Node = null;
    private _data: HeadItemData = null;

    private _totalFvInfo: { title: string, data: AttrInfo } = { title: '', data: null };
    private _canActive = false;
    private _canUpStar = false;
    private _canUsing = false;

    private _activeItemId: number = 0;
    private _upstarItemId: number = 0;
    private _isMax: boolean = false;

    protected onLoad(): void {
        EventClient.I.on(E.Head.Select, this.updateUI, this);
        EventClient.I.on(E.Bag.ItemChange, this.bagChange, this);
    }

    private bagChange(d: BagItemChangeInfo[]) {
        let needRefresh = false;
        const ids: number[] = [];
        d.forEach((item) => {
            ids.push(item.itemModel.cfg.Id);
        });

        if (ids.indexOf(this._data.cfg.Id) > -1 || ids.indexOf(Number(this._data.cfg.UnlockItem.split(':')[0])) > -1) {
            needRefresh = true;
        }

        if (needRefresh) {
            this.updateUI(this._data);
        }
    }

    protected start(): void {
        UtilGame.Click(this.BtnUse, () => {
            // 使用
            if (this._canUsing) {
                ControllerMgr.I.HeadController.useHead(this._data.cfg.Type, this._data.cfg.Id);
            } else if (this._data.cfg.Type === HeadPhotoType.Head) MsgToastMgr.Show(i18n.tt(Lang.head_using1));
            else if (this._data.cfg.Type === HeadPhotoType.headFrame) MsgToastMgr.Show(i18n.tt(Lang.head_using2));
            else if (this._data.cfg.Type === HeadPhotoType.chatBubble) MsgToastMgr.Show(i18n.tt(Lang.bubble_using));
        }, this);

        UtilGame.Click(this.BtnCheck, () => {
            WinMgr.I.open(ViewConst.AttrSimpleWin, this._totalFvInfo.title, this._totalFvInfo.data, this.BtnCheck.convertToWorldSpaceAR(cc.v2(0, 0)));
        }, this);

        UtilGame.Click(this.BtnActive, () => {
            // 激活
            if (this._canActive) {
                ControllerMgr.I.HeadController.activeHead(this._data.cfg.Type, this._data.cfg.Id);
            } else {
                WinMgr.I.open(ViewConst.ItemSourceWin, this._activeItemId);
            }
        }, this, { unRepeat: true, time: 500 });

        UtilGame.Click(this.BtnUpStar, () => {
            if (this._isMax) {
                MsgToastMgr.Show(Lang.com_text_full);
                return;
            }
            // 升星
            if (this._canUpStar) {
                ControllerMgr.I.HeadController.upStarHead(this._data.cfg.Type, this._data.cfg.Id);
            } else {
                WinMgr.I.open(ViewConst.ItemSourceWin, this._upstarItemId);
            }
        }, this, { unRepeat: true, time: 500 });
    }

    protected onDestroy(): void {
        EventClient.I.off(E.Head.Select, this.updateUI, this);
        EventClient.I.off(E.Bag.ItemChange, this.bagChange, this);
    }
    /** 界面更新 */
    private updateUI(data: HeadItemData): void {
        this._data = data;
        this._isMax = false;
        this.NdMax.active = false;
        const HeadModel = ModelMgr.I.HeadModel;
        this.SprHead.node.opacity = 255;
        if (data.cfg.Type === HeadPhotoType.Head) {
            // 头像
            const iconCfg = data.cfg.AnimId.split('|');
            const iconPath = RoleMgr.I.d.Sex === ESex.Male ? iconCfg[0] : iconCfg[1] ?? iconCfg[0];
            // const sprPath = `${RES_ENUM.RoleHead}${iconPath}`;
            // this.SprHead.loadImage(sprPath, 1, true);
            UtilHead.setHead(Number(iconPath), this.SprHead, RoleMgr.I.d.HeadFrame, this.SprHeadFrame);
        } else if (data.cfg.Type === HeadPhotoType.headFrame) {
            // 头像框
            const iconCfg = data.cfg.AnimId.split('|');
            let iconPath = RoleMgr.I.d.Sex === ESex.Male ? iconCfg[0] : iconCfg[1] ?? iconCfg[0];

            if (data.cfg.EffectUnlock) { // 需要动态头像框
                const effectStar = data.cfg.EffectUnlock.split('|');
                if (data.data && data.data.Star >= Number(effectStar[0])) {
                    iconPath = effectStar[1];
                }
            }
            UtilHead.setHead(UtilHead.ChangeHeadRes(RoleMgr.I.d.HeadIcon, RoleMgr.I.d.Sex), this.SprHead, Number(iconPath), this.SprHeadFrame);
            this.SprHead.node.opacity = 0;
        } else if (data.cfg.Type === HeadPhotoType.chatBubble) {
            const iconCfg = data.cfg.AnimId.split('|');
            this.SprHeadFrame.sizeMode = cc.Sprite.SizeMode.RAW;
            UtilHead.setBubble(Number(iconCfg[0]), this.SprHeadFrame, false);
            this.SprHead.node.opacity = 0;
        }

        // 名称
        this.LabName.string = data.cfg.Name;
        if (data.data) {
            this.NdUnActivate.active = false;
            this.labStarNum.string = `${data.data.Star ?? 0}`;
            this.NdUsing.active = data.data.Status === 1;
            this.BtnUse.active = true;
            // UtilColor.setGray(this.BtnUse, data.data.Status === 1, true);
            this.NdUpStar.active = true;
            this.NdActive.active = false;
            this.NdUpStarMat.active = true;
            // 设置升星数据
            const starId = data.cfg.StarUpItem;
            const funcid = data.cfg.FuncId;
            // 获取升星数据
            const starCfg = HeadModel.getStar(funcid, data.data.Star);
            if (starCfg) {
                const needNum = starCfg.LevelUpItem;
                const haveNum = BagMgr.I.getItemNum(starId);
                const starItemPath = UtilItem.GetItemIconPathByItemId(starId, RoleMgr.I.d.Sex);
                this.MatIconStar.loadImage(starItemPath, 1, true);
                this.LabNeedStar.string = `${haveNum}/${needNum}`;
                this.LabNeedStar.node.color = UtilColor.Hex2Rgba(haveNum >= needNum ? UtilColor.GreenV : UtilColor.RedV);
                this._canUpStar = haveNum >= needNum;
                this._canUsing = data.data.Status !== 1; // 不为1是时未使用 可以点击使用  否则可以使用
                this._upstarItemId = starId;
            } else {
                // // 最大星级
                // this._isMax = true;
                // this.NdMax.active = true;
                // this.NdUpStarMat.active = false;
            }
        } else {
            this.NdUnActivate.active = true;
            this.labStarNum.string = '0';
            this.NdUsing.active = false;
            this.BtnUse.active = false;
            this.NdUpStar.active = false;
            this.NdActive.active = true;
            // 不可升星
            this._canUpStar = false;
            this._canUsing = false;
        }
        // 获取当前所有拥有的头像/头像框的战力和
        const total = HeadModel.getHeadData(data.cfg.Type);
        const att = new AttrInfo();
        total.forEach((e) => {
            const att1 = HeadModel.getCurStarAttr(data.cfg.Type, e.HeadId, e.Star);
            if (att1) {
                att.add(att1);
            }
        });

        this.LabFv.string = UtilNum.ConvertFightValue(att.fightValue);

        const mode = data.cfg.Type === HeadPhotoType.chatBubble ? cc.Sprite.SizeMode.RAW : cc.Sprite.SizeMode.CUSTOM;

        this.MatIconStar.node.getComponent(cc.Sprite).sizeMode = mode;

        this.MatIconActive.node.getComponent(cc.Sprite).sizeMode = mode;

        if (mode === cc.Sprite.SizeMode.CUSTOM) {
            this.MatIconStar.node.setContentSize(38, 38);
            this.MatIconActive.node.setContentSize(38, 38);
        }

        if (data.cfg.Type === HeadPhotoType.Head) this._totalFvInfo.title = i18n.tt(Lang.head_addAttr_total);
        else if (data.cfg.Type === HeadPhotoType.headFrame) this._totalFvInfo.title = i18n.tt(Lang.head_addAttr_frame_total);
        else if (data.cfg.Type === HeadPhotoType.chatBubble) this._totalFvInfo.title = i18n.tt(Lang.bubble_addAttr_frame_total);

        this._totalFvInfo.data = att;
        this.BtnCheck.active = att.fightValue > 0;

        const curAtt = HeadModel.getCurStarAttr(data.cfg.Type, data.cfg.Id, data.data ? data.data.Star : 1);
        if (curAtt.attrs.length < 3) {
            this.NdPowerInfo.active = false;
            this.NdDefaultTip.active = true;
            if (data.cfg.Type === HeadPhotoType.Head) this.LabDefaultTip.string = i18n.tt(Lang.head_frame_tip);
            else if (data.cfg.Type === HeadPhotoType.headFrame) this.LabDefaultTip.string = i18n.tt(Lang.head_Headframe_tip);
            else if (data.cfg.Type === HeadPhotoType.chatBubble) this.LabDefaultTip.string = i18n.tt(Lang.head_bubble_tip);
        } else {
            this.NdPowerInfo.active = true;
            this.NdDefaultTip.active = false;
            this.LabAtt1.string = `${curAtt.attrs[0].name}：${curAtt.attrs[0].value}`;
            this.LabAtt2.string = `${curAtt.attrs[1].name}：${curAtt.attrs[1].value}`;
            this.LabAtt3.string = `${curAtt.attrs[2].name}：${curAtt.attrs[2].value}`;
            const nextAtt = HeadModel.getCurStarAttr(data.cfg.Type, data.cfg.Id, data.data ? data.data.Star + 1 : 1);
            if (nextAtt) {
                const diffAtt = nextAtt.diff(curAtt);
                this.LabAtt11.node.active = diffAtt.attrs[0].value > 0;
                this.LabAtt21.node.active = diffAtt.attrs[1].value > 0;
                this.LabAtt31.node.active = diffAtt.attrs[2].value > 0;
                this.LabAtt11.string = `+${diffAtt.attrs[0].value}`;
                this.LabAtt21.string = `+${diffAtt.attrs[1].value}`;
                this.LabAtt31.string = `+${diffAtt.attrs[2].value}`;

                this.NdUpStarMat.active = true;
            } else {
                this.LabAtt11.node.active = false;
                this.LabAtt21.node.active = false;
                this.LabAtt31.node.active = false;
                // 最大星级
                this._isMax = true;
                this.NdMax.active = true;
                this.NdUpStarMat.active = false;
            }
        }

        // 设置激活数据
        const actData = data.cfg.UnlockItem.split(':');
        const actId = parseInt(actData[0]);
        this._activeItemId = actId;
        const actNum = parseInt(actData[1]);
        const haveNum = BagMgr.I.getItemNum(actId);
        const actItemPath = UtilItem.GetItemIconPathByItemId(actId, RoleMgr.I.d.Sex);

        this.MatIconActive.loadImage(actItemPath, 1, true);
        this.LabNeedActive.string = `${haveNum}/${actNum}`;
        this.LabNeedActive.node.color = UtilColor.Hex2Rgba(haveNum >= actNum ? UtilColor.GreenV : UtilColor.RedV);
        this._canActive = haveNum >= actNum;

        // 特殊效果处理
        const eff = data.cfg.EffectUnlock;
        if (!eff) {
            // 没有特殊效果
            this.NdEff.active = false;
        } else {
            // 特殊效果
            this.NdEff.active = true;
            const effCfg = eff.split('|');
            this.LabEffTip.string = `${effCfg[0]}${i18n.tt(Lang.head_eff_tip)}`;
        }

        UtilRedDot.UpdateRed(this.BtnUpStar, this._canUpStar && !this._isMax, cc.v2(80, 25));
        UtilRedDot.UpdateRed(this.BtnActive, this._canActive, cc.v2(80, 25));
        if (data.cfg.Unlock === 1) {
            this.NdUpStar.active = false;
        }
    }
}
