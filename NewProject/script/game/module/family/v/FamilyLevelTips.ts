import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilTime } from '../../../../app/base/utils/UtilTime';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { IPDStruct } from '../../../base/utils/UtilConst';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import WinBase from '../../../com/win/WinBase';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleInfo } from '../../role/RoleInfo';
import { RoleMgr } from '../../role/RoleMgr';
import { TipPageType } from '../FamilyConst';
import { FamilyNdBuffItem } from './FamilyNdBuffItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class FamilyLevelTips extends WinBase {
    // Buff
    @property(cc.Prefab)
    private NdBuffItem: cc.Prefab = null;
    @property(cc.Node)
    private NdBuffContainer: cc.Node = null;

    // 进度条 FamilyTask
    @property(cc.ProgressBar)
    private pro: cc.ProgressBar = null;
    @property(cc.Label)
    private labPro: cc.Label = null;
    @property(cc.Label)
    private labCurLv: cc.Label = null;

    @property(cc.Label)
    private labCurNum: cc.Label = null;
    @property(cc.Label)
    private labCurQuality: cc.Label = null;

    @property(cc.Node)
    private LabMax: cc.Node = null;
    @property(cc.Node)
    private NdNotMax: cc.Node = null;
    @property(cc.Label)
    private labNumNext: cc.Label = null;
    @property(cc.Label)
    private labCurQualityNext: cc.Label = null;
    @property(cc.Node)
    private NdCondition: cc.Node = null;

    @property(cc.Label)
    private labNumNextLevel: cc.Label = null;
    // vip
    @property(cc.RichText)
    private labVipTask1: cc.RichText = null;
    @property(cc.RichText)
    private labVipTask2: cc.RichText = null;
    @property(cc.Label)
    private LabTitle1: cc.Label = null;
    @property(cc.Label)
    private LabTitle2: cc.Label = null;
    // 族长争夺buff
    @property(cc.RichText)
    private LabFightBuff1: cc.RichText = null;
    @property(cc.RichText)
    private LabFightBuff2: cc.RichText = null;

    // 三个大容器------------
    @property(cc.Node)
    private NdBuff: cc.Node = null;
    @property(cc.Node)
    private NdFamilyTask: cc.Node = null;
    @property(cc.Node)
    private NdSpecialPower: cc.Node = null;
    @property(cc.Node)
    private NdFightBuff: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1, swallow: true });

        this.scheduleOnce(() => {
            this.node.opacity = 255;
        }, 0.05);
    }

    public init(...param: unknown[]): void {
        this.node.opacity = 0;

        const type = param[0][0];
        this.NdBuff.active = type === TipPageType.Buff;
        this.NdFamilyTask.active = type === TipPageType.FamilyTask;
        this.NdSpecialPower.active = type === TipPageType.SpecialPower;
        this.NdFightBuff.active = type === TipPageType.FightBuff;

        const worldPos = param[0][1] as cc.Vec2;
        const pos = this.node.parent.convertToNodeSpaceAR(worldPos);
        this.NdContent.setPosition(pos);

        if (TipPageType.Buff === type) {
            this._initBuff();
        } else if (TipPageType.FamilyTask === type) {
            this._initFamilyTaskInfo();
        } else if (TipPageType.SpecialPower === type) { // 特权
            this._initVipInfo();
        } else if (TipPageType.FightBuff === type) {
            this._initFightBuff();
        }
    }

    /** 族长争霸 */
    private _initFightBuff(): void {
        // this.LabFightBuff1.string = '族长连任x次,候选人攻击力+60%';
        // this.LabFightBuff2.string = '族长连任x次,候选人攻击力+60%';
        this.LabFightBuff1.string = '';
        this.LabFightBuff2.string = '';

        const modelData: S2CFamilyTopPlayerData = ModelMgr.I.FamilyModel.getModelData();
        if (modelData && modelData.UserShowInfo && modelData.UserShowInfo[0]) { // 有族长信息
            // 连任多少届
            let jie: number = modelData.TermNum;// 届数
            // 离线多少天
            const roleInfo = new RoleInfo(modelData.UserShowInfo[0]);
            const logOut: number = roleInfo.d.LogoutTime;
            let day = 0;
            let str2 = 0;
            if (logOut) { // 在线
                day = UtilTime.disTanceToday(logOut);
                str2 = ModelMgr.I.FamilyModel.getCfgAttrBuffByType(2, day);
            }
            const str1 = ModelMgr.I.FamilyModel.getCfgAttrBuffByType(1, jie);

            // 有一条属性就显示1条
            this.NdFightBuff.active = !!str1 || !!str2;

            // const attrInfo1 = UtilAttr.GetAttrInfoByStr(str1);
            // const attrInfo2 = UtilAttr.GetAttrInfoByStr(str2);
            const strTimes = `${i18n.tt(Lang.family_chifConstant)}${jie}${i18n.ci},候选人`;// `族长连任${jie}次`
            const strDays = `${i18n.tt(Lang.family_chifOffline)}${day}${i18n.day},候选人`;// `族长连任${jie}次`
            // const strHxr = i18n.tt(Lang.family_chifSelect);// 候选人
            if (str1 && str2) {
                const max1 = UtilSkillInfo.getMaxSkillLevel(str1);
                if (jie >= max1) {
                    jie = max1;
                }
                const cfg1 = UtilSkillInfo.GetCfg(str1, jie);
                const arrPD1: IPDStruct[] = UtilSkillInfo.getAttrPDArr(cfg1, jie);
                const name1 = `${arrPD1[0].d.name}+${arrPD1[0].p}${arrPD1[0].d.perStr}`;// 攻击+30%
                // const name1 = UtilSkillInfo.GetSkillDesc(cfg1, jie);
                this.LabFightBuff1.string = `${strTimes}<color=${UtilColor.GreenG}>${name1}</color>`;

                const max2 = UtilSkillInfo.getMaxSkillLevel(str2);
                if (day >= max2) {
                    day = max2;
                }
                const cfg2 = UtilSkillInfo.GetCfg(str2, day);
                const arrPD2: IPDStruct[] = UtilSkillInfo.getAttrPDArr(cfg2, day);
                const name2 = `${arrPD2[0].d.name}+${arrPD2[0].p}${arrPD2[0].d.perStr}`;// 攻击+30%
                // const name2 = UtilSkillInfo.GetSkillDesc(cfg2, jie);
                this.LabFightBuff2.string = `${strDays}<color=${UtilColor.GreenG}>${name2}</color>`;

                // const v1 = Math.floor(attrInfo1.attrs[0].value / 10000);
                // const v2 = Math.floor(attrInfo2.attrs[0].value / 10000);

                // const name1 = `${strTimes} ${strHxr}${attrInfo1.attrs[0].name}`;
                // this.LabFightBuff1.string = `<color=${UtilColor.WhiteD}>${name1}</c><color=${UtilColor.GreenV}>+${v1}%</c>`;

                // const name2 = `${strDays} ${strHxr}${attrInfo2.attrs[0].name}`;
                // this.LabFightBuff2.string = `<color=${UtilColor.WhiteD}>${name2}</c><color=${UtilColor.GreenV}>+${v2}%</c>`;
            } else if (str1 || str2) {
                if (str1) {
                    const max1 = UtilSkillInfo.getMaxSkillLevel(str1);
                    if (jie >= max1) {
                        jie = max1;
                    }
                    const cfg1 = UtilSkillInfo.GetCfg(str1, jie);
                    // const name1 = UtilSkillInfo.GetSkillDesc(cfg1, jie);
                    const arrPD1: IPDStruct[] = UtilSkillInfo.getAttrPDArr(cfg1, jie);
                    const name1 = `${arrPD1[0].d.name}+${arrPD1[0].p}${arrPD1[0].d.perStr}`;// 攻击+30%
                    this.LabFightBuff1.string = `${strTimes}<color=${UtilColor.GreenG}>${name1}</color>`;
                    this.LabFightBuff2.string = '';

                    // const name1 = `${strTimes} ${strHxr}${attrInfo1.attrs[0].name}`;
                    // const v1 = Math.floor(attrInfo1.attrs[0].value / 10000);

                    // this.LabFightBuff1.string = `<color=${UtilColor.WhiteD}>${name1}</c><color=${UtilColor.GreenV}>+${v1}%</c>`;
                } else {
                    const max2 = UtilSkillInfo.getMaxSkillLevel(str2);
                    if (day >= max2) {
                        day = max2;
                    }
                    const cfg2 = UtilSkillInfo.GetCfg(str2, day);
                    // const name1 = UtilSkillInfo.GetSkillDesc(cfg1, day);
                    const arrPD2: IPDStruct[] = UtilSkillInfo.getAttrPDArr(cfg2, day);
                    const name2 = `${arrPD2[0].d.name}+${arrPD2[0].p}${arrPD2[0].d.perStr}`;// 攻击+30%
                    this.LabFightBuff1.string = `${strDays}<color=${UtilColor.GreenG}>${name2}</color>`;
                    this.LabFightBuff2.string = '';
                    // const name2 = `${strDays} ${strHxr}${attrInfo2.attrs[0].name}`;
                    // const v2 = Math.floor(attrInfo2.attrs[0].value / 10000);

                    // this.LabFightBuff1.string = `<color=${UtilColor.WhiteD}>${name2}</c><color=${UtilColor.GreenV}>+${v2}%</c>`;
                    // this.LabFightBuff2.string = '';
                }
            }
        } else { // 没有族长信息
            this.NdBuff.active = false;
        }
    }
    /** 族长特权 */
    private _initVipInfo() {
        let cfg1: Cfg_VIP = null;
        let cfg2: Cfg_VIP = null;
        const cfgVip: Cfg_VIP[] = ModelMgr.I.VipModel.getVipConfig();
        for (let i = 0, len = cfgVip.length; i < len; i++) {
            const cfg: Cfg_VIP = cfgVip[i];
            if (cfg.Family1 && !cfg1) {
                cfg1 = cfg;
            }
            if (cfg.Family2 && !cfg2) {
                cfg2 = cfg;
            }
        }
        const name1 = ModelMgr.I.VipModel.getVipFullName(cfg1.VIPLevel);
        const name2 = ModelMgr.I.VipModel.getVipFullName(cfg2.VIPLevel);

        this.LabTitle1.string = `【${name1}${i18n.tt(Lang.vip_super_title)}】`;
        this.LabTitle2.string = `【${name2}${i18n.tt(Lang.vip_super_title)}】`;

        const f1Str1: string = cfg1.Family1;
        const descId1: string = f1Str1.split(':')[0];
        const f1Str2: string = cfg2.Family2;
        const descId2: string = f1Str2.split(':')[0];

        const descConf1: Cfg_VIP_Desc = Config.Get(Config.Type.Cfg_VIP_Desc).getValueByKey(Number(descId1));
        const descConf2: Cfg_VIP_Desc = Config.Get(Config.Type.Cfg_VIP_Desc).getValueByKey(Number(descId2));
        this.labVipTask1.string = descConf1.Desc;
        this.labVipTask2.string = descConf2.Desc;
    }
    /** */
    private _initFamilyTaskInfo(): void {
        const curExp: number = RoleMgr.I.d.FamilyTaskExp || 0;// 经验
        const curLv: number = RoleMgr.I.d.FamilyTaskLevel || 0;// 等级
        const cfg: Cfg_FNTask = ModelMgr.I.FamilyModel.CfgFNTask(curLv);

        const cfgExp: number = cfg.Exp;// 需要的经验

        this.pro.progress = curExp / cfgExp;
        this.labPro.string = `${curExp}/${cfgExp}`;
        this.labCurLv.string = `${i18n.tt(Lang.family_task)}${curLv}${i18n.lv}`;

        this.labCurNum.string = `${cfg.TaskNum}${i18n.tt(Lang.com_ge)}`;// 个
        this.labCurQuality.string = `${i18n.tt(Lang[`general_quality_se${cfg.TaskQuality}`])}${i18n.tt(Lang.com_quality)}`;// 个
        // 根据品质获取颜色
        this.labCurQuality.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(cfg.TaskQuality, true));

        const isMax: boolean = ModelMgr.I.FamilyModel.CfgFNTaskIsMax(curLv + 1);
        if (isMax) {
            this.LabMax.active = true;
            this.NdNotMax.active = false;
            this.NdCondition.active = false;
        } else {
            const cfg: Cfg_FNTask = ModelMgr.I.FamilyModel.CfgFNTask(curLv + 1);
            this.LabMax.active = false;
            this.NdNotMax.active = true;
            this.NdCondition.active = true;

            this.labNumNextLevel.string = `${curLv + 1}${i18n.lv}`;// 个
            this.labNumNext.string = `${cfg.TaskNum}${i18n.tt(Lang.com_ge)}`;// 个
            this.labCurQualityNext.string = `${i18n.tt(Lang[`general_quality_se${cfg.TaskQuality}`])}${i18n.tt(Lang.com_quality)}`;// 个
            this.labCurQualityNext.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(cfg.TaskQuality, true));
        }
    }

    /** Buff */
    private _initBuff() {
        this.NdBuffContainer.destroyAllChildren();
        const data: S2CFamilyInfo = ModelMgr.I.FamilyModel.getFamilyInfo();

        const cfg: Cfg_Family = ModelMgr.I.FamilyModel.CfgFamily(data.Lv + 1);// 下一级别的经验需要多少
        if (cfg) {
            // buff 攻击加成
            const buff: string = cfg.Buff;
            const arr = buff.split('|');
            for (let i = 0; i < arr.length; i++) {
                const BuffId = Number(arr[i]);
                const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_Buff);
                const cfg: Cfg_Buff = indexer.getValueByKey(BuffId);
                const attrArr = cfg.BuffEffectValue.split(':');
                const key = attrArr[2];// 属性id
                const name = UtilAttr.GetAttrName(Number(key));
                const val = Number(attrArr[3]) / 100;
                const node: cc.Node = cc.instantiate(this.NdBuffItem);
                const item: FamilyNdBuffItem = node.getComponent(FamilyNdBuffItem);
                item.setData(name, `+${val}%`);
                this.NdBuffContainer.addChild(node);
            }
        } else {
            const node: cc.Node = cc.instantiate(this.NdBuffItem);
            const item: FamilyNdBuffItem = node.getComponent(FamilyNdBuffItem);
            item.setData(i18n.tt(Lang.com_level_max), ``);
            this.NdBuffContainer.addChild(node);
        }
    }
}
