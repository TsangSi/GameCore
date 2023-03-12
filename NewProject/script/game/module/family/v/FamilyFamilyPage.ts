import { EventClient } from '../../../../app/base/event/EventClient';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { RoleMgr } from '../../role/RoleMgr';
import {
    FamilyFamilyType, FamilyPos, ModifyPageType, TipPageType,
} from '../FamilyConst';

const { ccclass, property } = cc._decorator;

/** 世家-世家 */
@ccclass
export default class FamilyFamilyPage extends WinTabPage {
    @property(cc.Node)// 处理事务
    private BtnProcess: cc.Node = null;
    @property(cc.Node)// 族长争夺
    private BtnFight: cc.Node = null;
    @property(cc.Node)// 试炼副本
    private BtnFuben: cc.Node = null;

    @property(cc.Label)// 世家宣言
    private LabWord: cc.Label = null;
    @property(cc.Label)// 世家等级
    private LabLevel: cc.Label = null;
    @property(cc.Label)// 世家经验
    private LabEXP: cc.Label = null;
    @property(cc.Label)// 世家名称
    private LabName: cc.Label = null;

    @property(cc.Label)// 世家加成
    private LabBuff: cc.Label = null;

    @property(cc.ProgressBar)// 世家经验进度条
    private progressExp: cc.ProgressBar = null;

    @property(cc.Node)// 提示框
    private BtnTip: cc.Node = null;

    @property(cc.Node)// 改名
    private BtnChangeName: cc.Node = null;
    @property(cc.Node)// 改宣言
    private BtnChangeWord: cc.Node = null;

    @property(cc.Node)// 俸禄
    private BtnFenLu: cc.Node = null;

    public start(): void {
        super.start();
        UtilGame.Click(this.BtnFight, this._onFamilyFight, this, { scale: 1 });
        UtilGame.Click(this.BtnProcess, this._onProcessTask, this, { scale: 1 });
        UtilGame.Click(this.BtnFuben, this._onFamilyFuben, this, { scale: 1 });
        UtilGame.Click(this.BtnTip, this._onBtnTip, this, { scale: 1 });
        UtilGame.Click(this.BtnChangeName, this._onBtnChangeName, this, { scale: 1 });
        UtilGame.Click(this.BtnChangeWord, this._onBtnChangeWord, this, { scale: 1 });
        // 俸禄
        UtilGame.Click(this.BtnFenLu, this._onBtnFenLu, this);
        // 昵称修改成功
        EventClient.I.on(E.Family.FamilyNameUpdate, this._onModifySuccess, this);

        // 三个按钮红点
        UtilRedDot.Bind(RID.Family.FamilyHome.Family.FamilyFamily.FamilyFight, this.BtnFight, cc.v2(290, 50));
        UtilRedDot.Bind(RID.Family.FamilyHome.Family.FamilyFamily.FamilyTask, this.BtnProcess, cc.v2(290, 50));
        UtilRedDot.Bind(RID.Family.FamilyHome.Family.FamilyFamily.FamilyFb, this.BtnFuben, cc.v2(290, 50));
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Family.FamilyNameUpdate, this._onModifySuccess, this);
        EventClient.I.off(E.Family.FamilyInfo, this._onFamilyInfo, this);
    }

    /** 修改昵称 修改宣言成功 */
    private _onModifySuccess(type: ModifyPageType): void {
        const data: S2CFamilyInfo = ModelMgr.I.FamilyModel.getFamilyInfo();
        if (type === ModifyPageType.Name) {
            this.LabName.string = `${data.Name}`;
            // this.LabName.string = `S${RoleMgr.I.d.ShowAreaId}.${data.Name}`;
        } else if (type === ModifyPageType.Word) {
            this.LabWord.string = data.Word;
        }
    }

    // 提示
    private _onBtnTip(): void {
        const worldPos = this.BtnTip.convertToWorldSpaceAR(cc.v2(-250, -150));
        WinMgr.I.open(ViewConst.FamilyLevelTips, TipPageType.Buff, worldPos);
    }

    // 改名
    private _onBtnChangeName(): void { // 判断是否是族长
        const roleInfo = ModelMgr.I.FamilyModel.getFamilyRoleInfo();
        if (roleInfo?.Position && roleInfo.Position === FamilyPos.Chiefs) {
            WinMgr.I.open(ViewConst.FamilyModifyTip, ModifyPageType.Name);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.family_canmodify));// 族长才能修改世家名称
        }
    }

    // 改宣言
    private _onBtnChangeWord(): void {
        // 族长与副族长才可以改宣言
        const roleInfo = ModelMgr.I.FamilyModel.getFamilyRoleInfo();
        if (roleInfo?.Position && (roleInfo.Position === FamilyPos.Chiefs || roleInfo.Position === FamilyPos.FuChiefs)) {
            WinMgr.I.open(ViewConst.FamilyModifyTip, ModifyPageType.Word);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.family_canmodify1));// 族长/副族长才能修改世家宣言
        }
    }

    // 俸禄
    private _onBtnFenLu(): void {
        WinMgr.I.open(ViewConst.FamilyModifyTip, ModifyPageType.Award);
    }

    public init(winId: number, param: unknown[], tabIdx: number, tabId?: number): void {
        super.init(winId, param, 0);
        // const tabid = param[0];
        // const param1 = param[1];
        // const param2 = param[2];
        this._openCheck(param);

        // 防止 未经过familyHome直接进入当前UI
        ControllerMgr.I.FamilyController.reqC2SFamilyTopPlayerData();
        ControllerMgr.I.FamilyController.reqC2SFamilyRoleInfo();

        EventClient.I.on(E.Family.FamilyInfo, this._onFamilyInfo, this);
        // 世家经验更新
        ControllerMgr.I.FamilyController.reqC2SFamilyInfo();
    }

    /** 打开当前UI 判断是否进入其他UI */
    private _openCheck(param: unknown[]) {
        if (!param) return;
        let param1 = param[1];
        if (param1 instanceof Array) {
            param1 = param1[0];
        }

        if (param1 === FamilyFamilyType.FamilyPatriarch) { // 族长争夺
            if (UtilFunOpen.isOpen(FuncId.FamilyPatriarch, true)) {
                WinMgr.I.open(ViewConst.FamilyPatriarchWin, param[1], param);
            }
        } else if (param1 === FamilyFamilyType.FamilyTask) { // 处理事务
            if (UtilFunOpen.isOpen(FuncId.FamilyTask, true)) {
                WinMgr.I.open(ViewConst.FamilyTaskWin, param[1], param);
            }
        } else if (param1 === FamilyFamilyType.FamilyTrial) { // 试炼副本
            if (UtilFunOpen.isOpen(FuncId.FamilyTrialCopy, true)) {
                WinMgr.I.open(ViewConst.FamilyTrialCopyWin, param[1], param);
            }
        }
    }

    /** 初始玩家基础信息 */
    private _onFamilyInfo(d: S2CFamilyInfo): void {
        const data: S2CFamilyInfo = ModelMgr.I.FamilyModel.getFamilyInfo();

        const cfgFamily: Cfg_Family = ModelMgr.I.FamilyModel.CfgFamily(data.Lv);// 下一级别的经验需要多少
        // buff 攻击加成
        const buffId: number = Number(cfgFamily.Buff);

        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_Buff);
        const cfgBuff: Cfg_Buff = indexer.getValueByKey(buffId);
        const attrArr = cfgBuff.BuffEffectValue.split(':');
        const atrrId = attrArr[2];// 属性id
        const name = UtilAttr.GetAttrName(Number(atrrId));
        const val = Number(attrArr[3]) / 100;
        const str = `${name}+${val}%\n`;

        this.LabBuff.string = `${str}`;// 全员攻击+6%

        this.LabName.string = `S${RoleMgr.I.d.ShowAreaId}.${data.Name}`;// 名称
        this.LabWord.string = data.Word;// 宣言
        this.LabLevel.string = `${data.Lv}`;// 等级

        // 经验进度
        this.LabEXP.string = `${data.Exp}/${cfgFamily.Exp}`;// 经验
        this.progressExp.progress = data.Exp / cfgFamily.Exp;
    }
    public refreshPage(winId: number, params: any[]): void {
        //
    }

    /** 处理事务 */
    private _onProcessTask(): void {
        if (UtilFunOpen.isOpen(FuncId.FamilyTask, true)) {
            WinMgr.I.open(ViewConst.FamilyTaskWin);
        }
    }
    /** 族长争夺 */
    private _onFamilyFight(): void {
        if (UtilFunOpen.isOpen(FuncId.FamilyPatriarch, true)) {
            WinMgr.I.open(ViewConst.FamilyPatriarchWin);
        }
    }
    /** 试炼副本 */
    private _onFamilyFuben(): void {
        if (UtilFunOpen.isOpen(FuncId.FamilyTrialCopy, true)) {
            WinMgr.I.open(ViewConst.FamilyTrialCopyWin);
        }
    }
}
