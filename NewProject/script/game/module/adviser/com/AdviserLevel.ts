/*
 * @Author: zs
 * @Date: 2023-03-06 14:44:25
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { i18n } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { UpLevelBase } from '../../beauty/com/UpLevelBase';
import { AutoPayKey } from '../../pay/WinAutoPayTipsModel';
import { UtilShop } from '../../shop/UtilShop';

const { ccclass, property } = cc._decorator;
@ccclass()
export class AdviserLevel extends UpLevelBase {
    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.Adviser.UpdateExpLevel, this.onUpdateExpLevel, this);
    }
    public setData(id: number): void {
        // throw new Error('Method not implemented.');
        this.id = id;
        // const b = ModelMgr.I.BeautyModel.getBeauty(this.id);
        // const needItemId: number = b.cfg.getValueByKeyFromLevel(b.Level, 'NeedItem');
        const item = ModelMgr.I.AdviserModel.getUpLevelCost();
        this.needItemId = item.id;

        this.updateItem(this.needItemId);
        // if (ModelMgr.I.BeautyModel.isActive(id)) {
        this.onUpdateExpLevel(false);
        // }
    }
    /** 更新进度值 */
    private onUpdateExpLevel(isShowProgressAction: boolean = true) {
        if (ModelMgr.I.AdviserModel.isFullLevel()) {
            return;
        }
        const level = ModelMgr.I.AdviserModel.getLevel();
        const exp = ModelMgr.I.AdviserModel.getLevelExp();
        const nextLevelExp: number = Config.Get(Config.Type.Cfg_AdviserLevel).getValueByKey(level + 1, 'NeedTotalExp');
        this.LabelLevel.string = `${level}${i18n.lv}`;
        const curLevelExp: number = Config.Get(Config.Type.Cfg_AdviserLevel).getValueByKey(level, 'NeedTotalExp');
        this.Progress.updateProgress(exp - curLevelExp, nextLevelExp - curLevelExp, isShowProgressAction);
        this.onItemChangeItem();
    }

    protected isCanShowRed(id: number): boolean {
        return ModelMgr.I.AdviserModel.isCanShowRedByLevel();
    }
    protected getAutoBuyKey(): AutoPayKey {
        return AutoPayKey.AdviserStarBuy;
    }
    protected onBtnUpClicked(): void {
        if (UtilShop.itemIsEnough(this.needItemId, 1, this.ToggleBuy.isChecked)) {
            ControllerMgr.I.AdviserController.C2SAdviserLevelUp(this.ToggleBuy.isChecked);
        } else {
            this.onItemChangeItem();
            ModelMgr.I.BeautyModel.onCheckUpLevel();
        }
    }
    protected onBtnOneKeyUpClicked(): void {
        if (UtilShop.itemIsEnough(this.needItemId, 1, this.ToggleBuy.isChecked)) {
            ControllerMgr.I.AdviserController.C2SAdviserLevelUpAuto(this.ToggleBuy.isChecked);
        }
    }
}
