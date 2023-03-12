/*
 * @Author: myl
 * @Date: 2023-01-30 14:54:20
 * @Description:
 */

import { UtilNum } from '../../../../../../app/base/utils/UtilNum';
import { i18n } from '../../../../../../i18n/i18n';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import LockItemIcon from '../../../../../com/item/LockItemIcon';
import { EActiveStatus } from '../../../../../const/GameConst';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import { GeneralPassItemData } from '../GeneralPassModel';

import { EGeneralPassType } from '../GeneralPassConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneralPassItem extends cc.Component {
    @property(cc.Label)
    private typeNameLab: cc.Label = null;
    @property(cc.Label)
    private contetnLab: cc.Label = null;

    @property(cc.Node)
    private NdReward: cc.Node = null;
    @property(cc.Node)
    private NdRewardPay: cc.Node = null;

    @property(cc.Prefab)
    private itemPrefab: cc.Prefab = null;

    @property(DynamicImage)
    private BgSpr: DynamicImage = null;

    private _data: GeneralPassItemData = null;
    private _idx: number = 0;
    private _funcId = 0;
    private _cycNo = 0;
    public setData(data: GeneralPassItemData, idx: number, funcId: number, cycNo: number): void {
        this._data = data;
        this._idx = idx;
        this._funcId = funcId;
        this._cycNo = cycNo;
        this.typeNameLab.string = data.passCfg.Condition;
        const exName = '';
        switch (data.cfg.ConditionType) {
            case EGeneralPassType.FightValue: {
                exName = '';
            }
                break;
            case EGeneralPassType.Level: {
                exName = i18n.lv;
            }
                break;
            case EGeneralPassType.LoginDay: {
                exName = i18n.day;
            }
                break;

            default:
                break;
        }
        this.contetnLab.string = UtilNum.ConvertFightValue(data.cfg.Value) + exName;
        const bgPath = `texture/activity/generalPass/img_djzl_lbd_0${data.isRecive ? 1 : 2}@9[0_0_347_12]`;
        this.BgSpr.loadImage(bgPath, 1, true, '', true);

        this.NdReward.destroyAllChildren();
        this.NdReward.removeAllChildren();
        this.NdRewardPay.destroyAllChildren();
        this.NdRewardPay.removeAllChildren();

        const prizes = data.cfg.Prize1.split('|');
        for (let i = 0; i < prizes.length; i++) {
            const ele = prizes[i];
            const nd = cc.instantiate(this.itemPrefab);
            this.NdReward.addChild(nd);
            const ndComp = nd.getComponent(LockItemIcon);
            let sta = EActiveStatus.UnActive;
            if (!data.isRecive) {
                sta = EActiveStatus.UnActive;
            }
            if (data.isRecive && !data.freeState) {
                sta = EActiveStatus.CanActive;
            }
            if (data.isRecive && data.freeState) {
                sta = EActiveStatus.Active;
            }
            ndComp.setData(ele, sta, () => {
                ControllerMgr.I.GeneralPassController.getPassReward(this._funcId, this._cycNo, this._data.passCfg.PassId);
            }, false, true);
        }

        const prize1s = data.cfg.Prize2.split('|');
        for (let j = 0; j < prize1s.length; j++) {
            const ele = prize1s[j];
            const nd = cc.instantiate(this.itemPrefab);
            this.NdRewardPay.addChild(nd);
            const ndComp = nd.getComponent(LockItemIcon);
            let sta = EActiveStatus.UnActive;
            if (!data.isRecive || data.isRecive && !data.isPay) {
                sta = EActiveStatus.UnActive;
            }
            if (data.isRecive && data.isPay) {
                sta = EActiveStatus.CanActive;
            }
            if (data.isRecive && data.isPay && data.payState) {
                sta = EActiveStatus.Active;
            }
            ndComp.setData(ele, sta, () => {
                ControllerMgr.I.GeneralPassController.getPassReward(this._funcId, this._cycNo, this._data.passCfg.PassId);
            }, true, !data.isRecive);
        }
    }
}
