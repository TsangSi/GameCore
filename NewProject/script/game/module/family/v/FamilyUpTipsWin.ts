import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class FamilyUpTipsWin extends WinBase {
    //
    @property(cc.Node)
    private NdSprMask: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    // 事务等级
    @property(cc.Label)
    private LabLv: cc.Label = null;

    // 事务数量
    @property(cc.Label)
    private LabWorkNum: cc.Label = null;
    // 事务品质
    @property(cc.Label)
    private LabQuality: cc.Label = null;

    @property(cc.Label)
    private LabCountDown: cc.Label = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => {
            this.close();
        }, this, { scale: 1 });

        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.unschedule(this._countDown);
    }

    public init(params: any): void {
        this.LabLv.string = `${RoleMgr.I.d.FamilyTaskLevel}`;
        const cfg: Cfg_FNTask = ModelMgr.I.FamilyModel.CfgFNTask(RoleMgr.I.d.FamilyTaskLevel);
        this.LabWorkNum.string = `${cfg.TaskNum}`;
        // this.LabQuality.string = `${cfg.TaskQuality}`;
        this.LabQuality.string = `${i18n.tt(Lang[`general_quality_se${cfg.TaskQuality}`])}${i18n.tt(Lang.com_quality)}`;// 个

        // this.LabCountDown.string =
        this.unschedule(this._countDown);
        this.LabCountDown.string = `${i18n.tt(Lang.com_btn_confirm_1)}(3${i18n.tt(Lang.com_second)})`;
        this.schedule(this._countDown, 1);
    }

    private n = 3;
    private _countDown() {
        this.n--;
        this.LabCountDown.string = `${i18n.tt(Lang.com_btn_confirm_1)}(${this.n}${i18n.tt(Lang.com_second)})`;
        if (this.n <= 0) {
            this.unschedule(this._countDown);
            this.close();
        }
    }
}
