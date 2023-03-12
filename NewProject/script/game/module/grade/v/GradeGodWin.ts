/*
 * @Author: wangxina
 * @Date: 2022-07-15 14:21:02
 * @FilePath: \SanGuo\assets\script\game\module\grade\v\GradeGodWin.ts
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ActiveAttrList, ActiveInfo } from '../../../com/attr/ActiveAttrList';
import { NdAttrBaseContainer } from '../../../com/attr/NdAttrBaseContainer';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { GradeMgr } from '../GradeMgr';
import { EOpenType } from './GradeSoulWin';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeGodWin extends WinCmp {
    @property({ type: cc.Label, displayName: '道具名' })
    protected LbName: cc.Label = null;
    @property({ type: ItemIcon, displayName: '道具' })
    protected ItemIcon: ItemIcon = null;
    // @property({ type: cc.RichText, displayName: '吞噬数量' })
    // protected LbDevoureNum: cc.RichText = null;
    @property({ type: cc.Label, displayName: '吞噬数量左边' })
    protected LbDevourNumL: cc.Label = null;
    @property({ type: cc.Label, displayName: '吞噬数量左边' })
    protected LbDevourNumR: cc.Label = null;
    @property({ type: cc.Label, displayName: '拥有数量' })
    protected LbHaveNum: cc.Label = null;
    @property({ type: cc.Node, displayName: '属性父节点' })
    protected NdAttribute: cc.Node = null;
    @property({ type: cc.Node, displayName: '详情节点' })
    protected NdTips: cc.Node = null;
    @property({ type: cc.Node, displayName: '一键吞噬' })
    protected NdOneKey: cc.Node = null;
    @property({ type: cc.Node, displayName: '详情面板' })
    protected NdAttrDetails: cc.Node = null;
    @property({ type: cc.Node, displayName: '详情遮罩' })
    protected NdInfoMask: cc.Node = null;
    @property({ type: cc.Prefab, displayName: '激活属性模板' })
    protected ActiveAttrList: cc.Prefab = null;
    @property({ type: cc.Node, displayName: '属性content' })
    protected NdInfoCotent: cc.Node = null;
    @property(cc.Label)
    private LabelTips: cc.Label = null;

    /** gradeid */
    private _funcId: number = 0;
    /** 启动参数 */
    private openType: number = -1;
    /** 消耗道具id */
    private userItemId: number = 0;
    /** 升满所需道具数量 */
    private needNum: number = 0;
    /** 道具不足 */
    private noItem: boolean = false;
    /** 当前炼神满级 */
    private isFull: boolean = false;
    /** 炼神总量 */
    private devouredtNum: number = 0;
    /** 炼神基础值 */
    private baseNum: number = 0;
    /** 炼神数量 */
    private lsNum: number = 0;
    /** 所有进阶皮肤表 */
    private alllist: Cfg_GradeSkin[] = [];

    protected start(): void {
        super.start();
        if (this.openType === EOpenType.ROLE) {
            EventClient.I.on(E.RoleSkin.LianShenChange, this.updataUi, this);
            this.LabelTips.string = i18n.tt(Lang.grade_unlock_limit_god_roleskin);
        } else if (this.openType === EOpenType.GRADE) {
            EventClient.I.on(E.Grade.GradeItemNumChange.GodDang, this.upDataItemNum, this);
            EventClient.I.on(E.Grade.UpdateInfo, this.updataUi, this);
            this.LabelTips.string = i18n.tt(Lang.grade_unlock_limit_god_skin);
        } else if (this.openType === EOpenType.BEAUTY_GRADE) {
            EventClient.I.on(E.Grade.GradeItemNumChange.GodDang, this.upDataItemNum, this);
            EventClient.I.on(E.Grade.UpdateInfo, this.updataUi, this);
            this.LabelTips.string = i18n.tt(Lang.grade_unlock_limit_god_skin_beauty);
        } else if (this.openType === EOpenType.ADVISER_GRADE) {
            EventClient.I.on(E.Grade.GradeItemNumChange.GodDang, this.upDataItemNum, this);
            EventClient.I.on(E.Grade.UpdateInfo, this.updataUi, this);
            this.LabelTips.string = i18n.tt(Lang.grade_unlock_limit_god_skin_adviser);
        }
    }

    public init(param: unknown): void {
        super.init();
        this.openType = param[0];
        switch (this.openType) {
            case EOpenType.ROLE:
                // 时装 功能id默认就一个301
                this._funcId = this._funcId ? this._funcId : 301;
                break;
            case EOpenType.GRADE:
            case EOpenType.BEAUTY_GRADE:
            case EOpenType.ADVISER_GRADE:
                this._funcId = param[1];
                this.alllist = [];
                // 初始化取一个完整进阶时装表
                this.alllist = GradeMgr.I.getGradeSkinCfgList(this._funcId);
                break;
            default:
                break;
        }
        this.updataUi();
    }

    protected onDestroy(): void {
        super.onDestroy();
        switch (this.openType) {
            case EOpenType.ROLE:
                EventClient.I.off(E.RoleSkin.LianShenChange, this.updataUi, this);
                break;
            case EOpenType.GRADE:
            case EOpenType.BEAUTY_GRADE:
            case EOpenType.ADVISER_GRADE:
                EventClient.I.off(E.Grade.UpdateInfo, this.updataUi, this);
                EventClient.I.off(E.Grade.GradeItemNumChange.GodDang, this.upDataItemNum, this);

                break;
            default:
                break;
        }
    }

    protected updataUi(): void {
        // let GodItemCfg : Cfg_RoleSkinItem | Cfg_GradeItem = null;
        // 时装炼神
        let cfgRoleSkinItem: Cfg_RoleSkinItem;
        let cfgGradeItem: Cfg_GradeItem;
        switch (this.openType) {
            case EOpenType.ROLE:
                cfgRoleSkinItem = ModelMgr.I.RoleSkinModel.getRoleSkinItem(this._funcId);
                this.lsNum = ModelMgr.I.RoleSkinModel.godNum;
                this.baseNum = cfgRoleSkinItem.LSLimit;
                this.userItemId = cfgRoleSkinItem.LSItem;
                this.devouredtNum = this.baseNum;
                /** 时装的基础上限在这里 */
                this.getSkinListRole();
                break;
            // 进阶炼神
            case EOpenType.GRADE:
            case EOpenType.BEAUTY_GRADE:
            case EOpenType.ADVISER_GRADE:
                cfgGradeItem = GradeMgr.I.getGradeItemCfgById(this._funcId);
                this.lsNum = GradeMgr.I.getGradeData(this._funcId).GradeGod.Num;
                this.baseNum = this.alllist[0].LianshenUp;
                this.userItemId = cfgGradeItem.LSItem;
                // 进阶炼神基础值已在表里 这里清空下，防止刷数据脏了
                this.devouredtNum = 0;
                this.getSkinListGrade();
                break;
            default:
                break;
        }

        this.setItemData();
        this.upDataItemNum();
        this.initClick();
    }

    // 道具数量更新
    private upDataItemNum(): void {
        const itemNum = BagMgr.I.getItemNum(this.userItemId);
        this.LbHaveNum.string = itemNum.toString();
        this.noItem = itemNum === 0;
        // 有道具且不满级直接亮红点
        const redPoit = !this.noItem && !this.isFull;
        UtilRedDot.UpdateRed(this.NdOneKey, redPoit, cc.v2(80, 25));
    }

    /** 获取皮肤总数 进阶 返回名字，增加吞噬上限 */
    private getSkinListGrade(): void {
        const actSkin: Cfg_GradeSkin[] = GradeMgr.I.getGradeSkinCfgListWithActive(this._funcId);
        actSkin.sort((a, b) => a.Key - b.Key);
        // 遍历map把已激活和未激活的分开
        const unActSkin: Cfg_GradeSkin[] = this.alllist.filter((item1) => !actSkin.some((item2) => item1.Key === item2.Key));
        const actListInfo: ActiveInfo[] = [];
        const unActListInfo: ActiveInfo[] = [];
        actSkin.forEach((e) => {
            this.devouredtNum += e.LianshenUp;
            actListInfo.push({ infoName: e.Name, effect: `${i18n.tt(Lang.grade_god_limit_swallow)}+${UtilNum.Convert(e.LianshenUp)}` });
        });
        unActSkin.forEach((e) => {
            unActListInfo.push({ infoName: e.Name, effect: `${i18n.tt(Lang.grade_god_limit_swallow)}+${UtilNum.Convert(e.LianshenUp)}` });
        });
        this.isFull = this.devouredtNum === this.lsNum;
        // this.LbDevoureNum.string = `<color=${UtilColor.GreenV}>${this.lsNum}</color><color=${UtilColor.NorV}>/${this.devouredtNum}</color>`;
        this.LbDevourNumL.string = this.lsNum.toString();
        this.LbDevourNumR.string = `/${this.devouredtNum}`;
        this.NdInfoCotent.destroyAllChildren();
        if (actListInfo.length >= 1) {
            this.setAttrDetails(i18n.tt(Lang.com_zhongkuohao_active), actListInfo, `${UtilColor.GreenD}`);
        } else {
            // eslint-disable-next-line max-len
            this.setAttrDetails(i18n.tt(Lang.com_zhongkuohao_active), [{ infoName: i18n.tt(Lang.grade_god_skin_null), effect: '' }], `${UtilColor.WhiteD}`);
        }
        this.setAttrDetails(i18n.tt(Lang.con_zhongkuohao_unactive), unActListInfo, `${UtilColor.WhiteD}`);
    }

    /** 获取时装皮肤 炼神 */
    public getSkinListRole(): void {
        const list = ModelMgr.I.RoleSkinModel.getLianshenUpInfos();
        const actListInfo: ActiveInfo[] = [];
        const unActListInfo: ActiveInfo[] = [];
        list.actives.forEach((e) => {
            this.devouredtNum += e.LianshenUp;
            actListInfo.push({ infoName: e.Name, effect: `${i18n.tt(Lang.grade_god_limit_swallow)}+${UtilNum.Convert(e.LianshenUp)}` });
        });
        list.unactives.forEach((e) => {
            unActListInfo.push({ infoName: e.Name, effect: `${i18n.tt(Lang.grade_god_limit_swallow)}+${UtilNum.Convert(e.LianshenUp)}` });
        });
        this.isFull = this.devouredtNum === this.lsNum;
        this.needNum = this.devouredtNum - this.lsNum;
        // this.LbDevoureNum.string = `<color=${UtilColor.GreenV}>${this.lsNum}</color><color=${UtilColor.NorV}>/${this.devouredtNum}</color>`;
        this.LbDevourNumL.string = this.lsNum.toString();
        this.LbDevourNumR.string = `/${this.devouredtNum}`;
        this.NdInfoCotent.destroyAllChildren();
        if (actListInfo.length >= 1) {
            this.setAttrDetails(i18n.tt(Lang.com_zhongkuohao_active), actListInfo, `${UtilColor.GreenD}`);
        } else {
            // eslint-disable-next-line max-len
            this.setAttrDetails(i18n.tt(Lang.com_zhongkuohao_active), [{ infoName: i18n.tt(Lang.grade_god_skin_null), effect: '' }], `${UtilColor.WhiteD}`);
        }
        this.setAttrDetails(i18n.tt(Lang.con_zhongkuohao_unactive), unActListInfo, `${UtilColor.WhiteD}`);
    }

    private setItemData() {
        const itemIcon: ItemModel = UtilItem.NewItemModel(this.userItemId);
        this.LbName.string = itemIcon.cfg.Name;
        this.ItemIcon.setData(itemIcon, { needName: false, needNum: false });
        const attributeInfo: IAttrBase[] = UtilAttr.GetAttrBaseListById(itemIcon.cfg.AttrId);
        // 属性要拿道具id的值去换取，所以安排在这
        this.setAttribute(attributeInfo);
    }

    protected initClick(): void {
        UtilGame.Click(this.NdTips, () => {
            this.NdAttrDetails.active = true;
        }, this);
        UtilGame.Click(this.NdInfoMask, () => {
            this.NdAttrDetails.active = false;
        }, this);
        UtilGame.Click(this.NdOneKey, () => {
            // 一键吞噬
            switch (this.openType) {
                case EOpenType.ROLE:
                    if (this.isFull) {
                        MsgToastMgr.Show(i18n.tt(Lang.grade_god_limit_full));
                    } else if (this.noItem) {
                        WinMgr.I.open(ViewConst.ItemSourceWin, this.userItemId);
                    } else {
                        ControllerMgr.I.RoleSkinController.C2SRoleSkinGodNum();
                    }
                    break;
                case EOpenType.GRADE:
                case EOpenType.BEAUTY_GRADE:
                case EOpenType.ADVISER_GRADE:
                    if (this.isFull) {
                        MsgToastMgr.Show(i18n.tt(Lang.grade_god_limit_full));
                    } else if (this.noItem) {
                        // WinMgr.I.open(ViewConst.GradeQuickPay, this.userItemId, this.needNum);
                        WinMgr.I.open(ViewConst.ItemSourceWin, this.userItemId);
                    } else {
                        ControllerMgr.I.GradeController.reqC2SGradeGod(this._funcId);
                    }
                    break;
                default:
                    break;
            }
        }, this);
    }

    /**
     * 设置已永久增加角色属性
     * data: IAttrBase[] 传入属性数组
     * */
    protected setAttribute(data: IAttrBase[]): void {
        const attrCount: IAttrBase[] = [];
        attrCount.length = data.length;
        data.forEach((j, i) => {
            attrCount[i] = {
                attrType: j.attrType,
                value: j.value * this.lsNum,
                name: j.name,
            };
        });
        this.NdAttribute.getComponent(NdAttrBaseContainer).init(attrCount);
    }

    /**
     * 设置展开吞噬效果条目
     * @param activedata 已激活条目
     * @param unactiveData 未激活条目
     */
    protected setAttrDetails(title: string, listInfo: ActiveInfo[], InfoColor?: string, TitleColor?: string): void {
        const actList = cc.instantiate(this.ActiveAttrList);
        actList.getComponent(ActiveAttrList).setDoubleData(title, listInfo, InfoColor, TitleColor);
        actList.parent = this.NdInfoCotent;
        this.NdInfoCotent.getComponent(cc.Layout).updateLayout();
    }
}
