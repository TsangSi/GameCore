/*
 * @Author: kexd
 * @Date: 2023-02-20 14:43:45
 * @FilePath: \SanGuo2.4\assets\script\game\module\funcPreview\v\FuncItem.ts
 * @Description:
 *
 */
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../../../base/utils/UtilGame';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { RES_ENUM } from '../../../const/ResPath';
import { EFuncState, IFuncMsg } from '../FuncPreviewConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;
@ccclass
export default class FuncItem extends BaseCmp {
    @property(DynamicImage)
    private SprBg: DynamicImage = null;
    @property(cc.Label)
    private LabState: cc.Label = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Node)
    private NdRed: cc.Node = null;

    private _msg: IFuncMsg = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.node, () => {
            if (this._msg.callback) {
                this._msg.callback.call(this._msg.callback.call(this._msg.context, this._msg.index));
            }
        }, this, { scale: 1 });

        RoleMgr.I.on(
            this.uptCondition,
            this,
            RoleAN.N.Level, // 人物等级
            RoleAN.N.Stage, // 关卡
            RoleAN.N.VipLevel, // vip等级
            RoleAN.N.ArmyLevel, // 军衔
            RoleAN.N.ArmyStar,
            RoleAN.N.OfficeLevel, // 官职
            RoleAN.N.ChargeRmb, // 充值
            RoleAN.N.MonthCard, // 月卡
        );
    }

    public setData(msg: IFuncMsg): void {
        this._msg = msg;
        if (msg.state === EFuncState.UnOpen) {
            this.LabState.string = i18n.tt(Lang.rskill_unopen);
            this.LabState.node.color = UtilColor.Hex2Rgba('#b4a98b');
            const des: string = ModelMgr.I.FuncPreviewModel.getFuncDesc(msg.cfg.FuncId, msg.cfg, false);
            this.LabName.string = des;
            this.LabName.node.color = UtilColor.Hex2Rgba('#d33e2c');
        } else if (msg.state === EFuncState.CanGet) {
            this.LabState.string = i18n.tt(Lang.func_opend);
            this.LabState.node.color = UtilColor.Hex2Rgba('#823e3f');

            this.LabName.string = i18n.tt(Lang.func_canget);
            this.LabName.node.color = UtilColor.Hex2Rgba('#4f9b6a');
        } else {
            this.LabState.string = i18n.tt(Lang.func_opend);
            this.LabState.node.color = UtilColor.Hex2Rgba('#823e3f');

            this.LabName.string = i18n.tt(Lang.com_received);
            this.LabName.node.color = UtilColor.Hex2Rgba('#625954');
        }
        this.NdRed.active = msg.state === EFuncState.CanGet;
        this.SprIcon.loadImage(`${RES_ENUM.FuncPreviewUi}${msg.cfg.FuncId}@ML`, ImageType.PNG, true);
        if (msg.selected) {
            this.SprBg.loadImage(`${RES_ENUM.FuncPreviewSelect}`, ImageType.PNG, true);
        } else {
            this.SprBg.loadImage(`${RES_ENUM.FuncPreviewKuang}`, ImageType.PNG, true);
        }
    }

    /** 主要是未开启的条件描述，在人物属性变化后的刷新 */
    private uptCondition(): void {
        if (this._msg && this._msg.state === EFuncState.UnOpen) {
            const str = this.LabName.string;
            const des: string = ModelMgr.I.FuncPreviewModel.getFuncDesc(this._msg.cfg.FuncId, this._msg.cfg, false);
            if (str !== des) {
                this.LabName.string = des;
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        RoleMgr.I.off(
            this.uptCondition,
            this,
            RoleAN.N.Level, // 人物等级
            RoleAN.N.Stage, // 关卡
            RoleAN.N.VipLevel, // vip等级
            RoleAN.N.ArmyLevel, // 军衔
            RoleAN.N.ArmyStar,
            RoleAN.N.OfficeLevel, // 官职
            RoleAN.N.ChargeRmb, // 充值
            RoleAN.N.MonthCard, // 月卡
        );
    }
}
