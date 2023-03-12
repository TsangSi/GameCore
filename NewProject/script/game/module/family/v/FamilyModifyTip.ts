import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import WinBase from '../../../com/win/WinBase';
import { E } from '../../../const/EventName';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { FamilyPos, ModifyPageType } from '../FamilyConst';

const { ccclass, property } = cc._decorator;

/** 修改名 修改宣言 */
@ccclass
export class FamilyModifyTip extends WinBase {
    @property(cc.Node)
    private NdSprMask: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    @property(cc.Node)// 点击空白处关闭
    private BtnTips: cc.Node = null;

    @property(cc.Node)
    private BtnSure: cc.Node = null;
    @property(cc.Node)
    private NdBtnClose: cc.Node = null;
    @property(cc.Label)// 标题
    private LabTitile: cc.Label = null;
    @property(cc.EditBox)// 名称
    private EditBoxName: cc.EditBox = null;
    @property(cc.EditBox)// 宣言
    private EditBoxWord: cc.EditBox = null;

    @property(cc.Node)// 名称背景
    private NdNameBg: cc.Node = null;
    @property(cc.Node)// 宣言背景
    private NdWordBg: cc.Node = null;

    @property(cc.Label)// cd 冷却时间
    private LabCd: cc.Label = null;

    @property(cc.Label)// 首次免费
    private LabFree: cc.Label = null;

    @property(cc.Node)// 领取俸禄
    private BtnGetReward: cc.Node = null;
    @property(cc.Prefab) // 奖励
    private itemIcon: cc.Prefab = null;

    @property(cc.Node)// 奖励容器
    private NdRewardContainer: cc.Node = null;

    @property(cc.Node)// 消耗
    private NdCost: cc.Node = null;
    @property(DynamicImage)// 消耗
    private SprCost: DynamicImage = null;
    @property(cc.Label)// 消耗
    private LabCost: cc.Label = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => this.close(), this, { scale: 1 });
        UtilGame.Click(this.BtnClose, () => this.close(), this);
        UtilGame.Click(this.BtnTips, () => this.close(), this);
        UtilGame.Click(this.BtnSure, this._onBtnSure, this);
        UtilGame.Click(this.BtnGetReward, this._onBtnGetReward, this);
        UtilGame.Click(this.NdBtnClose, this.close, this);
        EventClient.I.on(E.Family.FamilyModify, this._onModifySuccess, this);

        EventClient.I.on(E.Family.FamilySalary, this._onFamilySalary, this);
    }
    protected onDestroy(): void {
        super.onDestroy();
        this.unschedule(this.countDownCd);
        EventClient.I.off(E.Family.FamilySalary, this._onFamilySalary, this);
        EventClient.I.off(E.Family.FamilyModify, this._onModifySuccess, this);
    }

    /** 领取俸禄 */
    private _onBtnGetReward(): void {
        const familyRoleInfo: S2CFamilyRoleInfo = ModelMgr.I.FamilyModel.getFamilyRoleInfo();
        const dailySalary = familyRoleInfo.DailySalary;
        if (!dailySalary) { // 未领取过 发送领取
            ControllerMgr.I.FamilyController.reqC2SFamilyDailySalary();
        }
    }
    /** 领取每日俸禄成功 */
    private _onFamilySalary(): void {
        MsgToastMgr.Show(`${i18n.tt(Lang.family_getReward)}`);// 领取成功
        this.close();
    }

    private _renameCheckCost(): void {
        const familyRoleInfo: S2CFamilyRoleInfo = ModelMgr.I.FamilyModel.getFamilyRoleInfo();
        const renameNum: number = familyRoleInfo.RenameNum;
        const [itemId, itemNum] = ModelMgr.I.FamilyModel.getCfgFNNameCost(renameNum);
        const bagNum = BagMgr.I.getItemNum(Number(itemId));

        const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);
        if (bagNum >= itemNum) {
            ControllerMgr.I.FamilyController.reqC2SFamilyRename(this.EditBoxName.string);
        } else {
            MsgToastMgr.Show(itemModel.cfg.Name + i18n.tt(Lang.not_enough));
        }
    }
    /** 确认修改 */
    private _onBtnSure(): void {
        const familyRoleInfo: S2CFamilyRoleInfo = ModelMgr.I.FamilyModel.getFamilyRoleInfo();
        if (this._nameOrWords === ModifyPageType.Name) {
            if (this.EditBoxName.string) {
                const renameNum: number = familyRoleInfo.RenameNum;
                if (!renameNum) { // 有免费次数
                    ControllerMgr.I.FamilyController.reqC2SFamilyRename(this.EditBoxName.string);
                } else {
                    // 不免费是否有CD
                    const RenameTime: number = familyRoleInfo.RenameTime;
                    if (RenameTime) { // 判断是否过了cd
                        const nowTime = UtilTime.NowSec();// 当前时间
                        const preTime = familyRoleInfo.RenameTime;// 上次改名时间
                        const deltTime = nowTime - preTime;
                        const cfgTime = ModelMgr.I.FamilyModel.getCfgFNNameCD();// 世家改名时间间隔
                        if (deltTime >= cfgTime) { // 间隔时间大于配置
                            this._renameCheckCost();
                        } else {
                            MsgToastMgr.Show(`${i18n.tt(Lang.family_modifyNameCd)}`);// 修改名称冷却中
                        }
                    } else { // 只需要判断消耗
                        this._renameCheckCost();
                    }
                }
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.family_inputFN));// 请输入世家名称
            }
        } else { // 修改宣言 // 判断cd
            // eslint-disable-next-line no-lonely-if
            if (this.EditBoxWord.string) {
                const preTime = familyRoleInfo.RenameWordTime;// 上次改名时间
                const nowTime = UtilTime.NowSec();// 当前时间
                const deltTime = nowTime - preTime;
                const cfgTime = ModelMgr.I.FamilyModel.getCfgFNNameCD();// 世家改名时间间隔
                if (deltTime >= cfgTime) {
                    ControllerMgr.I.FamilyController.reqC2SFamilyRenameWord(this.EditBoxWord.string);
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.family_wordCdCold));// 世家宣言修改冷却中
                }
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.family_inputFW));// 请输入世家宣言
            }
        }
    }

    /** 修改成功 */
    private _onModifySuccess(type: ModifyPageType): void {
        MsgToastMgr.Show(i18n.tt(Lang.family_modifySuccess));// 修改成功

        if (type === ModifyPageType.Name) {
            const name: string = this.EditBoxName.string; // 修改名称成功
            ModelMgr.I.FamilyModel.updateFamilyName(name);
        } else if (type === ModifyPageType.Word) {
            const words: string = this.EditBoxWord.string; // 修改word
            ModelMgr.I.FamilyModel.updateFamilyWord(words);
        }
        this.close();
    }

    private _nameOrWords: ModifyPageType;
    private _rewards: any[][];
    public init(params: any[]): void {
        this._nameOrWords = params[0]; // 根据当前职位显示不同的奖励
        this._initTitle();
        this._initBtnState();
        this._initContent();
        this._initCdCostInfo();
    }

    /** 标题：世家名称 世家宣言  族长俸禄 */
    private _initTitle(): void {
        if (this._nameOrWords === ModifyPageType.Name) {
            this.LabTitile.string = i18n.tt(Lang.family_modifyName);
        } else if (this._nameOrWords === ModifyPageType.Word) {
            this.LabTitile.string = i18n.tt(Lang.family_modifyWord);
        } else {
            // 判断当前是什么职位 显示什么标题
            const familyRoleInfo: S2CFamilyRoleInfo = ModelMgr.I.FamilyModel.getFamilyRoleInfo();
            const pos: number = familyRoleInfo.Position ? familyRoleInfo.Position : FamilyPos.Member;
            const name = ModelMgr.I.FamilyModel.getPosNameById(pos);
            this.LabTitile.string = name + i18n.tt(Lang.family_modifyFenlu);// 族长俸禄
            // this.LabTitile.string = i18n.tt(Lang.family_modifyFenlu);// 族长俸禄
        }
    }

    /** 三种状态下的按钮 */
    private _initBtnState(): void {
        const familyRoleInfo: S2CFamilyRoleInfo = ModelMgr.I.FamilyModel.getFamilyRoleInfo();
        if (this._nameOrWords === ModifyPageType.Name) {
            this.BtnSure.active = true;
            this.BtnClose.active = true;
            this.BtnGetReward.active = false;
        } else if (this._nameOrWords === ModifyPageType.Word) {
            this.BtnSure.active = true;
            this.BtnClose.active = true;
            this.BtnGetReward.active = false;
        } else {
            // 是否已经领取过奖励
            const dailySalary = familyRoleInfo && familyRoleInfo.DailySalary; // 是否领取过俸禄
            UtilCocos.SetSpriteGray(this.BtnGetReward, !!dailySalary, true);
            this.BtnGetReward.active = true;
            this.BtnSure.active = false;
            this.BtnClose.active = false;
        }
    }

    /** 初始化中间的内容 */
    private _initContent(): void {
        if (this._nameOrWords === ModifyPageType.Name) {
            this.NdNameBg.active = true;
            this.EditBoxName.node.active = true;
            this.NdWordBg.active = false;
            this.EditBoxWord.node.active = false;
            this.NdRewardContainer.active = false;
        } else if (this._nameOrWords === ModifyPageType.Word) {
            this.NdNameBg.active = false;// 隐藏世家名称
            this.EditBoxName.node.active = false; // 隐藏世家名称;
            this.NdWordBg.active = true;// 显示世家宣言
            this.EditBoxWord.node.active = true;// 显示世家宣言
            this.NdRewardContainer.active = false;// 隐藏奖励信息
        } else {
            this.EditBoxName.node.active = false;
            this.EditBoxWord.node.active = false;
            this.NdRewardContainer.active = true;
        }
    }

    private _initCdCostInfo(): void {
        const familyRoleInfo: S2CFamilyRoleInfo = ModelMgr.I.FamilyModel.getFamilyRoleInfo();
        if (this._nameOrWords === ModifyPageType.Name) {
            // 判断改名次数
            if (familyRoleInfo && familyRoleInfo.RenameNum) { // 不免费
                this.LabFree.node.active = false;// 不显示 首次免费
                if (familyRoleInfo.RenameTime) { // 有cd 则不显示消耗
                    this.NdCost.active = false;
                    this.LabCd.node.active = true;
                    this.unschedule(this.countDownCd);
                    this.countDownCd();
                    this.schedule(this.countDownCd, 1);
                } else {
                    this.LabCd.node.active = false;// mei有cd
                    this.NdCost.active = true;

                    // 根据修改次数 获取改名消耗
                    const [itemId, itemNum] = ModelMgr.I.FamilyModel.getCfgFNNameCost(familyRoleInfo.RenameNum);
                    const bagNum = BagMgr.I.getItemNum(Number(itemId));
                    const path = UtilItem.GetItemIconPathByItemId(Number(itemId));
                    this.SprCost.loadImage(path, 1, true);
                    // 刷新消耗
                    this.LabCost.string = `${UtilNum.Convert(Number(itemNum))}/${UtilNum.Convert(bagNum)}`;
                    this.LabCost.node.color = UtilColor.costColor(bagNum, Number(itemNum));
                }
            } else { // 有免费次数
                this.NdCost.active = false;
                this.LabFree.node.active = true;
                this.LabCd.node.active = false;
            }
        } else if (this._nameOrWords === ModifyPageType.Word) { // 修改宣言
            this.LabFree.node.active = false;
            this.NdCost.active = false;
            if (familyRoleInfo.RenameWordTime) { // 上次改宣言时间
                this.LabCd.node.active = true;
                this.unschedule(this.countDownCd);
                this.countDownCd();
                this.schedule(this.countDownCd, 1);
            } else {
                this.unschedule(this.countDownCd);
                this.LabCd.node.active = false;
            }
        } else { // 显示奖励信息
            this.NdCost.active = false;
            this.LabCd.node.active = false;
            this.LabFree.node.active = false;

            // roleInfo.Position
            const familyRoleInfo: S2CFamilyRoleInfo = ModelMgr.I.FamilyModel.getFamilyRoleInfo();
            const pos: number = familyRoleInfo.Position ? familyRoleInfo.Position : FamilyPos.Member;
            // const name = ModelMgr.I.FamilyModel.getPosNameById(pos);

            this._rewards = ModelMgr.I.FamilyModel.getCfgFamilyPosReward(pos, 'SalarReward');
            this.NdRewardContainer.destroyAllChildren();
            for (let i = 0; i < this._rewards.length; i++) {
                const node: cc.Node = cc.instantiate(this.itemIcon);
                this.NdRewardContainer.addChild(node);
                const itemIcon: ItemIcon = node.getComponent(ItemIcon);
                const [itemId, itemNum] = this._rewards[i];
                const itemModel: ItemModel = UtilItem.NewItemModel(Number(itemId), Number(itemNum));
                itemIcon.setData(itemModel, { needNum: true });
            }
        }
    }

    /** 倒计时 */
    private countDownCd(): void {
        const familyRoleInfo: S2CFamilyRoleInfo = ModelMgr.I.FamilyModel.getFamilyRoleInfo();
        const nowTime = UtilTime.NowSec();// 当前时间
        if (this._nameOrWords === ModifyPageType.Name) {
            const preTime = familyRoleInfo.RenameTime;// 上次改名时间
            const deltTime = nowTime - preTime;
            const cfgTime = ModelMgr.I.FamilyModel.getCfgFNNameCD();// 世家改名时间间隔
            if (deltTime >= cfgTime) {
                this.unschedule(this.countDownCd);
            } else {
                this.LabCd.string = `${i18n.tt(Lang.family_nameCdCold)} ${UtilTime.FormatHourDetail(cfgTime - deltTime)}`;// 冷却中
            }
        } else if (this._nameOrWords === ModifyPageType.Word) {
            const preTime = familyRoleInfo.RenameWordTime;// 上次改名时间
            const nowTime = UtilTime.NowSec();// 当前时间
            const deltTime = nowTime - preTime;
            const cfgTime = ModelMgr.I.FamilyModel.getCfgFNNameCD();// 世家改名时间间隔
            if (deltTime >= cfgTime) {
                this.unschedule(this.countDownCd);
            } else {
                this.LabCd.string = `${i18n.tt(Lang.family_nameCdCold)} ${UtilTime.FormatHourDetail(cfgTime - deltTime)}`;// 冷却中
            }
        }
    }
}
