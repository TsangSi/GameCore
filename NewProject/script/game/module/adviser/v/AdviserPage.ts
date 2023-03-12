/*
 * @Author: zs
 * @Date: 2023-03-06 11:18:18
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
// import { BeautyHead } from '../com/BeautyHead';
import { AttrsStyleA } from '../../../com/attr/AttrsStyleA';
import { AttrModel } from '../../../base/attribute/AttrModel';
import { EAdviserAttrInfoType } from '../AdviserConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { AdviserPageBase } from './AdviserPageBase';

const { ccclass, property } = cc._decorator;
@ccclass
export class AdviserPage extends AdviserPageBase {
    @property(AttrsStyleA)
    private AttrsStyleA: AttrsStyleA = null;
    @property(cc.Node)
    private BtnSkin: cc.Node = null;
    /** 等级 */
    private level: number = -1;
    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.Adviser.UpdateExpLevel, this.onUpdateExpLevel, this);
        EventClient.I.on(E.Adviser.UpdateInfo, this.onUpdateInfo, this);
        ControllerMgr.I.AdviserController.C2SAdviserInfo();
        UtilGame.Click(this.BtnSkin, this.onBtnSkin, this);
    }

    private onUpdateInfo() {
        this.updateView();
    }

    /** 更新界面 */
    private updateView() {
        this.updateCom();
        this.showSkills([this.model.getSkill()]);
        this.showAnim(ModelMgr.I.AdviserModel.getSkin(), ModelMgr.I.AdviserModel.getName());
        this.onUpdateExpLevel(this.model.getLevel());
    }

    /** 更新组件预制体（等级、升星、未激活） */
    private updateCom() {
        const name = this.getComName(this.tabId);
        if (this.model.isFullLevel()) {
            this.NodeFull.active = true;
            const node = this.content.getChildByName(name);
            if (node) {
                node.destroy();
            }
        } else {
            this.showPageCom(name, `prefab/module/adviser/com/${name}`);
        }
    }

    private onUpdateExpLevel(level: number) {
        if (this.level === level) {
            return;
        }
        this.level = level || 1;
        const cfg: Cfg_AdviserLevel = this.model.cfgLevel.getValueByKey(this.level);
        this.AttrsStyleA.init(AttrModel.MakeAttrInfo(cfg.AttrId));
        this.updateFightValue(this.model.getAllAttrInfo(EAdviserAttrInfoType.Level));
        this.updateCom();
    }

    /** 获取组件名 */
    private getComName(tabId: number) {
        return 'AdviserLevel';
    }

    private onBtnSkin() {
        //
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Adviser.UpdateExpLevel, this.onUpdateExpLevel, this);
        EventClient.I.off(E.Adviser.UpdateInfo, this.onUpdateInfo, this);
    }
}
