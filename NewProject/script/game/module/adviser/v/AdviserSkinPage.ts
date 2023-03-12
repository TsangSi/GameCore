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
import { UtilGame } from '../../../base/utils/UtilGame';
import { AdviserPageBase } from './AdviserPageBase';

const { ccclass, property } = cc._decorator;
@ccclass
export class AdviserSkinPage extends AdviserPageBase {
    @property(cc.Node)
    private BtnHuanHua: cc.Node = null;
    /** 等级 */
    private level: number = -1;
    protected onLoad(): void {
        super.onLoad();
        UtilGame.Click(this.BtnHuanHua, this.onBtnHuanHua, this);
    }

    private onUpdateInfo() {
        this.updateView();
    }

    /** 更新界面 */
    private updateView() {
        this.updateCom();
        this.showSkills([this.model.getSkill()]);
        this.showAnim(ModelMgr.I.AdviserModel.getSkin(), ModelMgr.I.AdviserModel.getName());
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

    /** 获取组件名 */
    private getComName(tabId: number) {
        return 'AdviserStar';
    }

    private onBtnHuanHua() {
        //
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Adviser.UpdateInfo, this.onUpdateInfo, this);
    }
}
