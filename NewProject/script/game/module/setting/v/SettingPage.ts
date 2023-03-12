import WinMgr from '../../../../app/core/mvc/WinMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilHead from '../../../base/utils/UtilHead';
import { SwitchButton } from '../../../com/switchBtn/SwitchButton';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class SettingPage extends WinTabPage {
    // 帧率
    @property(cc.Toggle) // 帧率30
    private CkFrame30: cc.Toggle = null;
    @property(cc.Toggle) // 帧率60
    private CkFrame60: cc.Toggle = null;

    // 自动战斗
    @property(cc.Toggle)
    private CkAutoFight: cc.Toggle = null;

    // 技能背饰模型>>>
    @property(cc.Toggle)
    private CkSkillEff: cc.Toggle = null;
    @property(cc.Toggle)
    private CkBeiShi: cc.Toggle = null;
    @property(cc.Toggle)
    private CkModel: cc.Toggle = null;
    @property(cc.Toggle)
    private CkSpecialPower: cc.Toggle = null;

    // 助战跟随 武将军师红颜
    @property(cc.Toggle)
    private CkWuJiang: cc.Toggle = null;
    @property(cc.Toggle)
    private CkHongYan: cc.Toggle = null;
    @property(cc.Toggle)
    private CkJunShi: cc.Toggle = null;
    @property(cc.Toggle)
    private CkFightFollow: cc.Toggle = null;

    // 流畅模式
    @property(SwitchButton)
    private switchBtnLcModel: SwitchButton = null;

    @property(cc.Node) // 修改名字
    private BtnModifyName: cc.Node = null;

    @property(cc.Sprite)
    private SprHead: cc.Sprite = null;
    @property(cc.Sprite)
    private SprHeadFrame: cc.Sprite = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.BtnModifyName, () => { WinMgr.I.open(ViewConst.ModifyNamePage); }, this);
        this.CkAutoFight.node.on('toggle', this._onCkAutoFight, this);

        UtilGame.Click(this.switchBtnLcModel.node, this._onSwitchBtnLcModel, this); // 流畅模式

        this.CkFrame30.node.on('toggle', () => { this._onToggleFrame(30); }, this);
        this.CkFrame60.node.on('toggle', () => { this._onToggleFrame(60); }, this);
        // 技能 背饰 模型
        this.CkSkillEff.node.on('toggle', this._onCkSkillEff, this);
        this.CkBeiShi.node.on('toggle', this._onCkBeiShi, this);
        this.CkModel.node.on('toggle', this._onCkModel, this);

        // 助战跟随 武将 军师 红颜
        this.CkFightFollow.node.on('toggle', this._onCkFightFollow, this);
        this.CkWuJiang.node.on('toggle', this._onCkWuJiang, this);
        this.CkJunShi.node.on('toggle', this._onCkJunShi, this);
        this.CkHongYan.node.on('toggle', this._onCkHongYan, this);

        // 特权等级
        this.CkSpecialPower.node.on('toggle', this._onCkSpecialPower, this);
    }
    // 设置默认的 助战跟随
    private _setDefaultFightFollow(): void {
        this.CkHongYan.isChecked = !ModelMgr.I.SettingModel.getHongYan();// 勾选了是屏蔽
        this.CkJunShi.isChecked = !ModelMgr.I.SettingModel.getJunShi();
        this.CkWuJiang.isChecked = !ModelMgr.I.SettingModel.getWuJiang();

        this._setFightFollow();
    }

    /** 助战跟随 */
    private _setFightFollow(): void {
        this.CkFightFollow.isChecked = ModelMgr.I.SettingModel.getFightFollow();
    }
    //
    private _onCkFightFollow(): void {
        const currState = this.CkFightFollow.isChecked;// 如果勾选了
        ModelMgr.I.SettingModel.setFightFollow(currState);

        this.CkWuJiang.isChecked = currState;
        this.CkJunShi.isChecked = currState;
        this.CkHongYan.isChecked = currState;
    }

    private _onCkWuJiang(): void {
        ModelMgr.I.SettingModel.setWuJiang(!this.CkWuJiang.isChecked);
        this._setFightFollow();
    }
    private _onCkJunShi(): void {
        ModelMgr.I.SettingModel.setJunShi(!this.CkJunShi.isChecked);
        this._setFightFollow();
    }
    private _onCkHongYan(): void {
        ModelMgr.I.SettingModel.setHongYan(!this.CkHongYan.isChecked);
        this._setFightFollow();
    }
    //
    //
    // 设置默认模型显示
    private _setDefaultModel() { // 显示则不勾选
        this.CkSkillEff.isChecked = !ModelMgr.I.SettingModel.getSkillEff();// 勾选了是屏蔽
        this.CkBeiShi.isChecked = !ModelMgr.I.SettingModel.getBeiShi();
        this.CkModel.isChecked = !ModelMgr.I.SettingModel.getModel();
    }
    // 技能背饰模型
    private _onCkSkillEff(): void {
        ModelMgr.I.SettingModel.setSkillEff(!this.CkSkillEff.isChecked);
    }
    private _onCkBeiShi(): void {
        ModelMgr.I.SettingModel.setBeiShi(!this.CkBeiShi.isChecked);
    }
    private _onCkModel(): void {
        ModelMgr.I.SettingModel.setModel(!this.CkModel.isChecked);
    }
    //
    //
    // 设置默认特权等级
    private _setDefaultSpecialPower() { // 显示则不勾选
        this.CkSpecialPower.isChecked = !ModelMgr.I.SettingModel.getSpecialPower();
    }
    /** 点击特权等级 */
    private _onCkSpecialPower(): void {
        ModelMgr.I.SettingModel.setSpecialPower(!this.CkSpecialPower.isChecked);
    }
    //
    //
    // 帧率默认选中30帧
    private _setDefaultFrameRate() {
        const frame = ModelMgr.I.SettingModel.getFrameRate();
        this._setFrameRate(frame);
        this.CkFrame30.isChecked = frame === 30;
        this.CkFrame60.isChecked = frame !== 30;
    }
    private _setFrameRate(num) {
        cc.game.setFrameRate(num);
        ModelMgr.I.SettingModel.setFrameRate(num);
    }
    private _onToggleFrame(frame: number) {
        // ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>是否消耗</color>`, () => {
        //     //
        //     console.log('确定');
        // }, null, () => {
        //     console.log('取消');
        // });

        if (frame === 30) {
            this.CkFrame60.isChecked = !this.CkFrame30.isChecked;
            if (this.CkFrame30.isChecked) {
                this._setFrameRate(30);
            } else {
                this._setFrameRate(60);
            }
        } else {
            this.CkFrame30.isChecked = !this.CkFrame60.isChecked;
            if (this.CkFrame60.isChecked) {
                this._setFrameRate(60);
            } else {
                this._setFrameRate(30);
            }
        }
    }

    public init(winId: number, param: any[]): void {
        super.init(winId, param, 0);
        RoleMgr.I.on(this.updateHeadInfo, this, RoleAN.N.Sex, RoleAN.N.HeadFrame, RoleAN.N.HeadIcon);
        this._setDefaultCk();// CheckBox有些需要默认选中
        this.updateHeadInfo();
    }

    protected onDestroy(): void {
        super.onDestroy();
        RoleMgr.I.off(this.updateHeadInfo, this, RoleAN.N.Sex, RoleAN.N.HeadFrame, RoleAN.N.HeadIcon);
    }
    private updateHeadInfo() {
        UtilHead.setHead(UtilHead.ChangeHeadRes(RoleMgr.I.d.HeadIcon, RoleMgr.I.d.Sex), this.SprHead, RoleMgr.I.d.HeadFrame, this.SprHeadFrame);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        this.updateHeadInfo();
    }

    /** 设置默认初始选中哪些 */
    private _setDefaultCk() {
        this._setDefaultModel();// 模型
        this._setDefaultSpecialPower();// 特权

        const state = ModelMgr.I.SettingModel.getAutoFight();
        this.CkAutoFight.isChecked = state;

        this._setDefaultFrameRate();
        this._setDefaultLcModel();

        this._setDefaultFightFollow();
    }
    /** 挂机战斗 */
    private _onCkAutoFight() {
        // 挂机战斗
        ModelMgr.I.SettingModel.setAutoFight(this.CkAutoFight.isChecked);
    }
    /** 设置默认流畅模式 默认关闭 不勾选 */
    private _setDefaultLcModel(): void {
        const lcModel = ModelMgr.I.SettingModel.getLcMode();
        this.switchBtnLcModel.setState(lcModel);
    }

    /** 流畅模式 */
    private _onSwitchBtnLcModel() {
        const lcModel = ModelMgr.I.SettingModel.getLcMode();// 前一个状态

        const currState: boolean = !lcModel;// 当前状态
        ModelMgr.I.SettingModel.setLcMode(currState);// 实际存储在这里
        this.switchBtnLcModel.setState(currState);// 开关按钮

        // 只更新UI
        this.CkSkillEff.isChecked = currState;
        this.CkBeiShi.isChecked = currState;
        this.CkModel.isChecked = currState;
        // 特权
        this.CkSpecialPower.isChecked = currState;

        this.CkAutoFight.isChecked = currState;
        // ModelMgr.I.GameLevelModel.autoFight = this.CkAutoFight.isChecked;

        // 助战跟随 true 需要勾选
        this.CkWuJiang.isChecked = currState;
        this.CkJunShi.isChecked = currState;
        this.CkHongYan.isChecked = currState;

        this._setFightFollow();

        if (currState) { // 开启流畅 ，其他需要勾选
            this.CkFrame30.isChecked = true;
            this.CkFrame60.isChecked = false;
            this._setFrameRate(30);
        } else { // 关闭，不勾选
            this.CkFrame30.isChecked = false;
            this.CkFrame60.isChecked = true;
            this._onToggleFrame(60);
        }
    }
}
