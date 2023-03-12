/*
 * @Author: zs
 * @Date: 2022-10-31 14:21:07
 * @FilePath: \SanGuo\assets\script\game\module\beauty\com\BeautyLevel.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { i18n } from '../../../../i18n/i18n';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { AutoPayKey } from '../../grade/WinAutoPayTipsModel';
import { BagMgr } from '../../bag/BagMgr';
import { IWinAutoPayTips } from '../../pay/WinAutoPayTips';
import { WinAutoPayTipsModel, AutoPayKey } from '../../pay/WinAutoPayTipsModel';
import { RoleMgr } from '../../role/RoleMgr';
import { UtilShop } from '../../shop/UtilShop';
import { UpLevelBase } from './UpLevelBase';

const { ccclass, property } = cc._decorator;
@ccclass()
export class BeautyLevel extends UpLevelBase {
    protected isCanShowRed(id: number): boolean {
        return ModelMgr.I.BeautyModel.isCanShowRedByLevel(id);
    }
    protected getAutoBuyKey(): AutoPayKey {
        return AutoPayKey.BeautyStarBuy;
    }
    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.Beauty.UpdateExpLevel, this.onUpdateExpLevel, this);
    }

    public setData(id: number): void {
        this.id = id;
        const b = ModelMgr.I.BeautyModel.getBeauty(this.id);
        const needItemId: number = b.cfg.getValueByKeyFromLevel(b.Level, 'NeedItem');
        this.needItemId = needItemId;
        this.updateItem(this.needItemId);
        if (ModelMgr.I.BeautyModel.isActive(id)) {
            this.onUpdateExpLevel(false);
        }
    }

    /** 更新进度值 */
    private onUpdateExpLevel(isShowProgressAction: boolean = true) {
        if (ModelMgr.I.BeautyModel.isFullLevel(this.id)) {
            return;
        }
        const b = ModelMgr.I.BeautyModel.getBeauty(this.id);
        const nextLevelExp: number = b.cfg.getValueByKeyFromLevel(b.Level + 1, 'NeedTotalExp');
        this.LabelLevel.string = `${b.Level}${i18n.lv}`;
        const curLevelExp: number = b.cfg.getValueByKeyFromLevel(b.Level, 'NeedTotalExp');
        this.Progress.updateProgress(b.LevelExp - curLevelExp, nextLevelExp - curLevelExp, isShowProgressAction);
        this.onItemChangeItem();
    }

    /** 升阶 */
    protected onBtnUpClicked(): void {
        if (UtilShop.itemIsEnough(this.needItemId, 1, this.ToggleBuy.isChecked)) {
            ControllerMgr.I.BeautyController.C2SBeautyLevelUp(this.id, this.ToggleBuy.isChecked);
        } else {
            this.onItemChangeItem();
            EventClient.I.emit(E.Beauty.UpdateHead, this.id);
            ModelMgr.I.BeautyModel.onCheckUpLevel();
        }
    }

    protected onEnable(): void {
        this.ToggleBuy.isChecked = false;
    }

    /** 自动购买 */
    private onNodeAutoBuyClicked() {
        // ModelMgr.I.MsgBoxModel.ShowBox('道具不足，是否自动从商店购买？', () => {
        // }, { showToggle: 'BeautyStarBuy' });
        if (this.ToggleBuy.isChecked) {
            this.ToggleBuy.isChecked = false;
        } else if (WinAutoPayTipsModel.getState(AutoPayKey.BeautyStarBuy)) {
            this.ToggleBuy.isChecked = true;
        } else {
            const conf: IWinAutoPayTips = {
                cb: (b) => {
                    if (this.ToggleBuy && this.ToggleBuy.isValid) {
                        this.ToggleBuy.isChecked = b;
                    }
                },
                itemId: this.needItemId,
                recordKey: AutoPayKey.BeautyStarBuy,
            };
            WinMgr.I.open(ViewConst.WinAutoPayTips, conf);
        }
    }

    /** 一键升阶 */
    protected onBtnOneKeyUpClicked(): void {
        if (UtilShop.itemIsEnough(this.needItemId, 1, this.ToggleBuy.isChecked)) {
            ControllerMgr.I.BeautyController.C2SBeautyLevelUpAuto(this.id, this.ToggleBuy.isChecked);
        }
    }
}
