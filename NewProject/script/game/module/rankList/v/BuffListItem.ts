import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import ModelMgr from '../../../manager/ModelMgr';
import { Link } from '../../link/Link';

/*
 * @Author: zs
 * @Date: 2023-02-15 21:44:55
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class BuffListItem extends BaseCmp {
    @property(DynamicImage)
    private SpriteIcon: DynamicImage = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelLevel: cc.Label = null;
    @property(cc.RichText)
    private LabelDesc: cc.Label = null;
    @property(cc.Label)
    private LabelTime: cc.Label = null;
    @property(cc.Node)
    private BtnGo: cc.Node = null;
    private data: IncreaseSkill = undefined;
    public setData(data: IncreaseSkill): void {
        this.data = data;
        const cfgInc: Cfg_IncreaseSkill = Config.Get(Config.Type.Cfg_IncreaseSkill).getValueByKey(data.SkillId);
        if (cfgInc) {
            this.LabelName.string = cfgInc.SkillName;
            this.LabelDesc.string = ModelMgr.I.BuffModel.getBuffDesc(cfgInc);
            this.LabelLevel.string = UtilString.FormatArgs(i18n.tt(Lang.com_level), cfgInc.SkillLevel);
            this.SpriteIcon.loadImage(`texture/skill/${cfgInc.SkillIconID}`, ImageType.PNG, true);
        }
        this.updatePerSecond();
        this.BtnGo.targetOff(this);
        UtilGame.Click(this.BtnGo, this.onBtnGo, this, { customData: cfgInc.Jump });
    }

    private onBtnGo(node: cc.Node, funcId: number) {
        Link.To(funcId);
    }

    protected updatePerSecond(): void {
        if (this.data.LifeTime > 0) {
            this.LabelTime.node.parent.active = true;
            const time = this.data.LifeTime - UtilTime.NowSec();
            if (time > 0) {
                this.LabelTime.string = UtilTime.FormatTime(time);
            } else {
                ModelMgr.I.BuffModel.delBuff(this.data.SkillId);
            }
        } else {
            this.LabelTime.node.parent.active = false;
        }
    }
}
