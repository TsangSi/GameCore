import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { AssetType } from '../../../../../app/core/res/ResConst';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { AttrBase } from '../../../../base/attribute/AttrBase';
import { EAttrType } from '../../../../base/attribute/AttrConst';
import ListView from '../../../../base/components/listview/ListView';
import { Config } from '../../../../base/config/Config';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import { NdAttrBaseAdditionContainer } from '../../../../com/attr/NdAttrBaseAdditionContainer';
import { ItemCurrencyId } from '../../../../com/item/ItemConst';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { RES_ENUM } from '../../../../const/ResPath';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { RID } from '../../../reddot/RedDotConst';
import { RedDotMgr } from '../../../reddot/RedDotMgr';
import { RoleAN } from '../../../role/RoleAN';
import { RoleMgr } from '../../../role/RoleMgr';
import { points } from './RoleMartialConst';
import { RoleMartialItem } from './RoleMartialItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleMartialPage extends WinTabPage {
    @property(ListView)
    private ListMartial: ListView = null;

    @property(cc.Node)
    private NdPoints: cc.Node = null;

    @property(cc.Node)
    private NdLines: cc.Node = null;

    @property(cc.Label)
    private LabelFightValue: cc.Label = null;

    @property(cc.Node)
    private NdCost: cc.Node = null;

    @property(cc.Node)
    private NdUpdate: cc.Node = null;

    @property(cc.Node)
    private NdActive: cc.Node = null;

    @property(cc.Node)
    private NdProperty: cc.Node = null;

    @property(cc.Label)
    private LabUpName: cc.Label = null;

    @property(cc.Label)
    private LabCostNum: cc.Label = null;

    @property(cc.Label)
    private LabTip: cc.Label = null;

    @property(cc.Sprite)
    private SpRole: cc.Sprite = null;

    @property(cc.Node)
    private NdAttrContainer: cc.Node = null;

    private curSelect: RoleMartialItem = null;

    private curConfig: Cfg_RoleMartial = null;

    private autoUpLevel: number = 0;

    private autoUp: boolean = false;

    private canClick: boolean = false;

    public init(): void {
        const count = ModelMgr.I.RoleSkillModel.CfgRoleMartialCount();
        this.ListMartial.setNumItems(count);
        this.addE();
        // this.onUpFight();
        UtilGame.Click(this.NdUpdate, this.onClickUpdate.bind(this), this);
        UtilGame.Click(this.NdActive, this.onClickUpdate.bind(this), this);
        UtilGame.Click(this.NdProperty, this.onClickProperty.bind(this), this);
        RedDotMgr.I.updateRedDot(RID.Role.RoleSkill.MartialSkill, false);
        this.autoUp = false;
        // console.log(Config.Get<ConfigAttributeIndexer>(Config.Type.Cfg_Attribute));
    }

    private addE() {
        RoleMgr.I.on(this.onPropertyChanged, this, RoleAN.N.ItemType_Coin4);
        RoleMgr.I.on(this.onPropertyChanged, this, RoleAN.N.ArmyLevel);
        RoleMgr.I.on(this.onPropertyChanged, this, RoleAN.N.ArmyStar);
        EventClient.I.on(E.RoleSkill.UptMartial, this.onUptMartial, this);
    }

    private remE() {
        RoleMgr.I.off(this.onPropertyChanged, this, RoleAN.N.ItemType_Coin4);
        RoleMgr.I.off(this.onPropertyChanged, this, RoleAN.N.ArmyLevel);
        RoleMgr.I.off(this.onPropertyChanged, this, RoleAN.N.ArmyStar);
        EventClient.I.off(E.RoleSkill.UptMartial, this.onUptMartial, this);
    }

    /**
     * @func 继续升级
     * @param mtl 当前的武艺信息
     */
    private nextUpdate(mtl: RoleMartialInfo): void {
        if (this.canClick && this.autoUp && mtl.Level !== this.autoUpLevel) {
            this.node.stopAllActions();
            this.node.runAction(cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(() => {
                    if (this.canClick && this.autoUp && mtl.Level !== this.autoUpLevel) {
                        ControllerMgr.I.RoleSkillController.reqRoleMartialLevelUp(this.curConfig.Id);
                    }
                }),
            ));
        }
    }

    /**
     * @func 停止自动升级
     * @param level 检测等级
    */
    private stopAutoUp(level: number) {
        if (this.autoUp) {
            this.autoUp = false;
            // 检测是否升满一级 并清除点位
            if (this.autoUpLevel === level) {
                this.node.stopAllActions();
                this.node.runAction(cc.sequence(
                    cc.delayTime(0.5),
                    cc.callFunc(() => {
                        if (this.autoUp === false) {
                            for (let i = 0; i < this.NdPoints.childrenCount; ++i) {
                                const node = this.NdPoints.children[i];
                                UtilCocos.SetSpriteGray(node, true, true);
                                const l = this.NdLines.children[i];
                                if (l) {
                                    UtilCocos.SetSpriteGray(l, true, false);
                                }
                            }
                        }
                    }),
                ));
            }
        }
    }

    /**
     * @func 显示属性
     * @param  Id 武艺ID
     * @param  level 当前等级
     * @param  point 点位数量
     * @param  open 是否激活状态
     */
    private showProperty(local: Cfg_RoleMartial, remote: RoleMartialInfo, level: number, point: number, open: boolean): void {
        if (!open) {
            level = 1;
            this.LabelFightValue.string = '0';
        }

        const model = ModelMgr.I.RoleSkillModel;

        const info = model.getMartialAttrInfo(local.Id, level, point);

        if (open) this.LabelFightValue.string = String(info.fightValue ? info.fightValue : 0);

        const upInfo = info.clone();

        if (open) {
            const info2 = model.getMartialPointAddAttr(local.Id, point + 1, level);

            for (let i = 0; i < upInfo.attrs.length; ++i) {
                upInfo.attrs[i].value = 0;

                for (let n = 0; n < info2.attrs.length; ++n) {
                    if (upInfo.attrs[i].attrType === info2.attrs[n].attrType) {
                        upInfo.attrs[i].value = info2.attrs[n].value;
                        break;
                    }
                }
            }

            for (let i = 0; i < info2.attrs.length; ++i) {
                if (info2.attrs[i].value) continue;
                let exist = false;
                for (let n = 0; n < upInfo.attrs.length; ++n) {
                    if (upInfo.attrs[n].attrType === info2.attrs[i].attrType) {
                        exist = true;
                        break;
                    }
                }
                if (exist === false) {
                    const attr = <AttrBase>{ ...info2.attrs[i] };
                    attr.value = 0;
                    upInfo.attrs.push(attr);
                }
            }
        } else {
            for (let i = 0; i < info.attrs.length; ++i) {
                info.attrs[i].value = 0;
            }
        }

        if (remote && remote.Level >= local.MaxLv) {
            upInfo.attrs.forEach((value) => {
                value.value = 0;
            });
        }

        this.NdAttrContainer.getComponent(NdAttrBaseAdditionContainer).init(info.attrs, upInfo.attrs, {
            isShowAdd: true, isShowAddSign: false, isShowLine: true, isCustom: true,
        });
    }

    /**
     * @func 检测前置武艺等级限制
     * @param  Id 武艺ID
     * @param  level 检测等级
     * @return 是否限制
    */
    private checkLimitLevel(Id: number, level: number): boolean {
        const model = ModelMgr.I.RoleSkillModel;
        const cfgRMLevel: Cfg_RoleMartialLevel = Config.Get(Config.Type.Cfg_RoleMartialLevel).getIntervalData(Id, level);

        if (cfgRMLevel && cfgRMLevel.LevelLimit.length) {
            const ary = cfgRMLevel.LevelLimit.split(':');
            if (ary.length === 2) {
                const key = Number(ary[0]);
                const next = Number(ary[1]);
                const dest = model.CfgRoleMartialGetValueByKey(key);
                const data = model.getMartialById(key);
                if (!data || data.Level < next) {
                    const fmt = i18n.tt(Lang.martial_tips3);
                    this.LabTip.string = UtilString.FormatArgs(fmt, dest.Name, next);
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @func 检测官职限制
     * @param  ArmyLevel 所需官职等级
     * @param  ArmyStar 所需官职星级
     * @return 是否限制
    */
    private checkArmy(ArmyLevel: number, ArmyStar: number): boolean {
        const lev = RoleMgr.I.getArmyLevel();
        const star = RoleMgr.I.getArmyStar();

        if (lev < ArmyLevel || (lev === ArmyLevel && star < ArmyStar)) {
            const fmt = i18n.tt(Lang.martial_tips);
            this.LabTip.string = UtilString.FormatArgs(fmt, ModelMgr.I.ArmyLevelModel.getArmyName(ArmyLevel, ArmyStar));
            return true;
        }
        return false;
    }

    /**
     * 刷新列表
     * @param item 列表项
     * @param idx 索引
     */
    public onRenderList(item: cc.Node, idx: number): void {
        const rmi = item.getComponent(RoleMartialItem);
        const model = ModelMgr.I.RoleSkillModel;
        const local: Cfg_RoleMartial = model.CfgRoleMartialGetValue(idx);

        if (local) {
            const remote = model.getMartialById(local.Id);
            const point = remote ? remote.Point : 0;
            const level = remote ? remote.Level : 0;
            // 是否已激活
            const open = level !== 0 || point !== 0;
            rmi.setIcon(idx);
            rmi.setLock(!open);
            rmi.setQuality(UtilItem.GetItemQualityColor(local.Quality, false));
            rmi.setData(local.Name, UtilString.FormatArgs(i18n.tt(Lang.martial_level), remote && remote.Level ? remote.Level : 0));
        }

        rmi.node.targetOff(this);

        rmi.node.on(cc.Node.EventType.TOUCH_END, this.onSelectItem.bind(this, rmi, local, idx), this);

        if (this.curSelect == null) this.onSelectItem(rmi, local, idx);
    }

    /**
     * 选中物品
     * @param item 列表项
     * @param idx 索引
     * @param isClick 是否按键点击
     */
    private onSelectItem(rmi: RoleMartialItem, local: Cfg_RoleMartial, idx: number = -1) {
        if (this.curSelect) this.curSelect.setSelect(false);

        const isClick = idx !== -1;

        if (isClick) {
            this.autoUp = false;
            const path = `${RES_ENUM.Roleskill_Img_Wy}${UtilNum.FillZero(idx + 1, 2)}`;
            ResMgr.I.loadRemote(path, AssetType.SpriteFrame_jpg, (err, spriteFrame: cc.SpriteFrame) => {
                if (!err) this.SpRole.spriteFrame = spriteFrame;
            });
        }

        rmi.setSelect(true);
        this.curSelect = rmi;
        const model = ModelMgr.I.RoleSkillModel;

        this.curConfig = local;

        if (local) {
            const remote = model.getMartialById(local.Id);
            const point = remote ? remote.Point : 0;
            let show = point;
            const level = remote ? remote.Level : 0;
            if (point === 0 && level > 1 && !isClick) show = 10;

            rmi.setData(local.Name, UtilString.FormatArgs(i18n.tt(Lang.martial_level), remote && remote.Level ? remote.Level : 0));

            for (let i = 0; i < this.NdPoints.childrenCount; ++i) {
                const node = this.NdPoints.children[i];
                UtilCocos.SetSpriteGray(node, i >= show, false);
                if (isClick) {
                    const p = points[idx][i];
                    node.setPosition(p);
                    const l = this.NdLines.children[i];
                    if (l) {
                        UtilCocos.SetSpriteGray(l, i >= show, false);
                        l.setPosition(p);
                        const pos = points[idx][i + 1];
                        const dir = pos.sub(p);
                        l.height = dir.mag();
                        l.angle = -(dir.signAngle(cc.v2(0, 1)) / Math.PI * 180);
                    }
                }
            }

            const costItemId = ItemCurrencyId.COIN;
            const bagNum: number = RoleMgr.I.getCurrencyById(costItemId);
            const costItemNum = local.CoinBase + local.CoinLevel * level;
            const color = bagNum >= costItemNum ? UtilColor.ColorEnoughV : UtilColor.ColorUnEnoughV; // cc.Color.GREEN : cc.Color.RED;
            this.LabCostNum.string = ` ${UtilNum.Convert(bagNum)} /${UtilNum.Convert(costItemNum)}`;
            this.LabCostNum.node.color = color;

            // 是否已激活
            const open = level !== 0 || point !== 0;

            rmi.setLock(!open);

            this.canClick = true;

            let name: string = i18n.tt(Lang.martial_oneKeyUp);

            if (this.checkLimitLevel(local.Id, level + 1) || this.checkArmy(local.ArmyLevel, local.ArmyStar)) {
                this.canClick = false;
            } else {
                this.LabTip.string = '';
            }

            if (remote && remote.Level >= local.MaxLv) {
                name = i18n.tt(Lang.com_level_max);
                this.canClick = false;
            }

            this.NdUpdate.active = open;

            this.NdActive.active = !open;

            // 置灰状态
            if (open) {
                UtilCocos.SetSpriteGray(this.NdUpdate, !this.canClick, true);
                this.NdUpdate.getComponent(cc.Button).interactable = this.canClick;
            } else {
                UtilCocos.SetSpriteGray(this.NdActive, !this.canClick, true);
                this.NdActive.getComponent(cc.Button).interactable = this.canClick;
            }

            // 停止升级
            if (bagNum < costItemNum || !this.canClick || this.autoUpLevel === level) {
                this.stopAutoUp(level);
            }

            this.LabUpName.string = name;

            this.NdCost.active = this.canClick;

            this.showProperty(local, remote, level, point, open);
        }
    }

    /* 点击升级 */
    private onClickUpdate() {
        if (this.autoUp) {
            return;
        }

        const local = this.curConfig;

        if (local) {
            const model = ModelMgr.I.RoleSkillModel;
            const remote = model.getMartialById(local.Id);
            const level = remote ? remote.Level : 0;

            const costItemId = ItemCurrencyId.COIN;
            const bagNum: number = RoleMgr.I.getCurrencyById(costItemId);
            const costItemNum = local.CoinBase + local.CoinLevel * level;

            if (bagNum < costItemNum) {
                WinMgr.I.open(ViewConst.ItemSourceWin, costItemId);
                MsgToastMgr.Show('金币不足');
                return;
            }

            ControllerMgr.I.RoleSkillController.reqRoleMartialLevelUp(this.curConfig.Id);

            this.autoUpLevel = level + 1;

            this.autoUp = true;
        }
    }

    /* 点击属性总览 */
    private onClickProperty() {
        const model = ModelMgr.I.RoleSkillModel;
        const info = model.getAllMartialAttrInfo();
        // console.log(info);
        if (info.attrs.length) {
            let str = '';
            info.attrs.forEach((value: AttrBase) => {
                /* 万分比判断显示 */
                if (value.attrType >= EAttrType.Attr_19 && value.attrType <= EAttrType.Attr_22) {
                    str += `${value.name} +${(value.value / 10000 * 100).toFixed(2)}%\n`;
                } else {
                    str += `${value.name} +${value.value}\n`;
                }
            });
            const cfgs = [];
            cfgs.push({ title: Lang.cur_property, data: str });
            WinMgr.I.open(ViewConst.AttrDetailTips, cfgs);
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.com_no_add_property));
        }
    }

    /* 属性更新 */
    private onPropertyChanged() {
        if (this.curConfig) {
            this.onSelectItem(this.curSelect, this.curConfig);
        }
    }

    // /** 更新战斗力 */
    // private onUpFight() {
    //     const model = ModelMgr.I.RoleSkillModel;
    //     this.LabelFightValue.string = String(model.getAllMartialAttrInfo().fightValue);
    // }

    /* 升级完成 */
    private onUptMartial(mtl: RoleMartialInfo) {
        if (this.curConfig && this.curConfig.Id === mtl.Id) {
            this.onSelectItem(this.curSelect, this.curConfig);
            // this.onUpFight();
            this.nextUpdate(mtl);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
