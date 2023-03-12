/*
 * @Author: wangxin
 * @Date: 2022-10-11 10:39:38
 * @FilePath: \SanGuo2.4\assets\script\game\module\rankList\v\RankListLocalPage.ts
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { EventProto } from '../../../../app/base/event/EventProto';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { Config } from '../../../base/config/Config';
import { ConfigConst } from '../../../base/config/ConfigConst';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import { UtilPath } from '../../../base/utils/UtilPath';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemIcon } from '../../../com/item/ItemIcon';
import ItemModel from '../../../com/item/ItemModel';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import EntityBase from '../../../entity/EntityBase';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { FuBenMgr } from '../../fuben/FuBenMgr';
import { GradeMgr } from '../../grade/GradeMgr';
import { RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { ArmyLvConst } from '../../roleOfficial/roleArmyLevel/ArmyLvConst';
import { ERankParam, ERankType } from '../RankListConst';
import { RankInfoItem } from './RankInfoItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankListLocalPage extends WinTabPage {
    @property({ type: cc.Node, displayName: '动画模型' })
    private NdAni: cc.Node = null;

    @property({ type: cc.Node, displayName: '一键膜拜' })
    private NdOneKeyNice: cc.Node = null;

    @property({ type: ListView, displayName: '排行榜名' })
    private LvRankName: ListView = null;

    @property({ type: ListView, displayName: '排行榜内容' })
    private LvRankInfo: ListView = null;

    @property({ type: cc.Node, displayName: '第一名信息' })
    private NdPlayOne: cc.Node = null;

    @property({ type: cc.Node, displayName: '第一名虚位以待' })
    private NdNoOne: cc.Node = null;

    @property({ type: cc.Node, displayName: '位以待' })
    private NdListNoOne: cc.Node = null;

    @property({ type: DynamicImage, displayName: '第一名军衔或官职图标' })
    private DyArmy: DynamicImage = null;
    @property(DynamicImage)
    private DyPlayOneIcon: DynamicImage = null;

    @property(cc.Label)
    private LbPlayOneName: cc.Label = null;

    @property(cc.Label)
    private LbPlayOneValue: cc.Label = null;

    @property(cc.Node)
    private NdPlayOnArmy: cc.Node = null;

    @property(cc.Label)
    private LbPlayOneValueType: cc.Label = null;

    @property({ type: cc.Node, displayName: '装备节点' })
    private NdShowEquips: cc.Node = null;

    @property({ type: cc.Prefab, displayName: '装备栏预制体' })
    private RankNdEquip: cc.Prefab = null;

    @property({ type: cc.Node, displayName: '排行榜底部信息' })
    private ExRank: cc.Node = null;

    @property({ type: cc.Node, displayName: '我的排名' })
    private NdMyRank: cc.Node = null;

    @property({ type: cc.Node, displayName: '我的排名信息' })
    private NdMyRankInfo: cc.Node = null;

    @property(cc.Node)
    private NdWorldLevel: cc.Node = null;

    public RankListType: number;
    public tabId: number = 0;
    public isMobai: boolean = false;

    // 抽一组左边排行榜名字
    private RankNameData: string[] = [];
    // 抽一组左边排行榜Id
    private RankNameId: number[] = [];

    private cfgNoremakRank: Cfg_NormalRank[] = [];
    // 右边数组
    private RankInfoData: S2CGetRankData = null;

    private nameDesc: string[] = [];
    /** 当前选中榜 */
    private clickIdx: number = 0;

    // 动画容器
    private _role: EntityBase = null;

    /** 皮肤id */
    private skinId: number = 10001;
    private titel: number[] = [];
    /** 上限 */
    private rankLimit: number = 50;

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        this.tabId = param[0];
        // 首个协议包
        this.RankListType = this.tabId === 0 ? 1 : 3;
        const nameType = ModelMgr.I.RankListModel.getRankListIdOfName(this.RankListType);
        this.RankNameData = nameType.Name;
        this.nameDesc = nameType.Desc;
        // this.typeOfName();
        // eslint-disable-next-line max-len
        this.RankNameId = nameType.Param;
        const rankNameLenght: number = this.RankNameData.length;
        this.LvRankName.setNumItems(rankNameLenght);

        ControllerMgr.I.RankListController.getRankData(this.RankListType, this.RankNameId[0]);
        EventClient.I.on(E.Rank.GameLevelRank, this.setData, this);
        EventClient.I.on(E.Rank.Workshio, this.setOneKeyNice, this);
        // eslint-disable-next-line max-len
        const rankCfg = this.RankListType === 1 ? ModelMgr.I.RankListModel.getNormalRankCfg('WorldRankNum') : ModelMgr.I.RankListModel.getNormalRankCfg('SingleServerRankNum');
        this.rankLimit = parseInt(rankCfg.CfgValue);
        this.cfgNoremakRank = ModelMgr.I.RankListModel.getNormalRank();
        UtilGame.Click(this.NdWorldLevel, this.onNdWorldLevel, this);
        UtilRedDot.Bind(RID.RankList.WorldLevel, this.NdWorldLevel, cc.v2(28, 23));
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId: number): void {
        super.refreshPage(winId, param, tabIdx);
        console.log(this.tabId, tabIdx);
        if (this.tabId !== tabIdx) {
            this.tabId = tabIdx;
            this.RankListType = this.tabId === 0 ? 1 : 3;
            this.getData();
        }
    }

    protected start(): void {
        super.start();
    }

    protected onDestroy(): void {
        super.onDestroy();
        ModelMgr.I.RankListModel.cleanData();
        EventClient.I.off(E.Rank.GameLevelRank, this.setData, this);
        EventClient.I.off(E.Rank.Workshio, this.setOneKeyNice, this);
    }

    public getData(): void {
        const nameType = ModelMgr.I.RankListModel.getRankListIdOfName(this.RankListType);
        this.RankNameData = nameType.Name;
        this.RankNameId = nameType.Param;
        const rankNameLenght: number = this.RankNameData.length;
        this.LvRankName.setNumItems(rankNameLenght);
        this.LvRankName.updateAll();
        const _rankListData = ModelMgr.I.RankListModel.getRankListOfParam(this.RankNameId[this.clickIdx], this.RankListType);
        if (_rankListData) {
            this.setData(_rankListData);
        } else {
            ControllerMgr.I.RankListController.getRankData(this.RankListType, this.RankNameId[this.clickIdx]);
        }
        // this.RankInfoData = ModelMgr.I.RankListModel.getRankListOfParam(this.RankNameId[this.clickIdx], this.RankListType);
        // const needEquip = data.Param === ERankParam.Equip;

        this.NdWorldLevel.active = this.RankNameId[this.clickIdx] === ERankParam.Level && UtilFunOpen.isOpen(FuncId.WorldLevel, false);
        if (this.NdWorldLevel.active) {
            UtilCocos.SetString(this.NdWorldLevel, 'LabelLevel', UtilString.FormatArgs(i18n.tt(Lang.com_level), FuBenMgr.WorldLevel));
        }
    }

    public setData(data: S2CGetRankData): void {
        // 搞数据，传data
        if (!data) {
            MsgToastMgr.Show('数据异常');
            return;
        }
        ModelMgr.I.RankListModel.setRankDataMap(data);
        this.titel = [];
        this.cfgNoremakRank.forEach((v) => {
            if (v.MinRank === 1) {
                if (v.Param === this.clickIdx) {
                    this.skinId = 10001; // v.TitleID;
                }

                this.titel.push(v.TitleID);
            }
        });
        if (data.Param === this.RankNameId[this.clickIdx]) {
            this.RankInfoData = ModelMgr.I.RankListModel.getRankListOfParam(this.RankNameId[this.clickIdx], this.RankListType);
            const needEquip = data.Param === ERankParam.Equip;
            // 排行榜类型变化
            this.setOnePlay();

            this.NdShowEquips.active = needEquip;
            if (needEquip) {
                this.setEquip();
            }
            // 设置自己
            this.setMyselfRankInfo();
            // 设置排行列表
            this.updataRankInfoIlist();
            // 设置第一名
            this.setOneKeyNice();
        }
    }

    /** 设置排行榜名 */
    public setRankNameList(item: cc.Node, i: number): void {
        item.getComponentInChildren(cc.Label).string = this.RankNameData[i];
        this.setBtnState(item, this.clickIdx === i);
        UtilGame.Click(item, () => {
            // 还原上一个按钮状态
            if (this.clickIdx !== null && this.LvRankName.getItemByListId(this.clickIdx)) {
                this.setBtnState(this.LvRankName.getItemByListId(this.clickIdx), false);
            }
            this.setBtnState(item, true);
            this.clickIdx = i;
            this.getData();
            // const _rankListData = ModelMgr.I.RankListModel.getRankListOfParam(this.RankNameId[i], this.RankListType);
            // if (_rankListData) {
            //     this.setData(_rankListData);
            // } else {
            //     ControllerMgr.I.RankListController.getRankData(this.RankListType, this.RankNameId[i]);
            // }
            // console.log('点击', this.RankNameData[i], this.RankNameId[i]);
        }, this);
        if (this.RankNameId[i] === ERankParam.Level) {
            UtilRedDot.Bind(RID.RankList.WorldLevel, item, cc.v2(50, 14));
        } else {
            UtilRedDot.Unbind(item);
            UtilRedDot.UpdateRed(item, false, cc.v2(50, 14));
        }
    }

    // 设置按钮状态变化
    private setBtnState(_itemN: cc.Node, sw: boolean): void {
        _itemN.getComponent(DynamicImage).loadImage(
            sw ? RES_ENUM.Com_Btn_Com_Btn_B_03 : RES_ENUM.Com_Btn_Com_Btn_Tab_09,
            1,
            false,
        );
        _itemN.getComponentInChildren(cc.Label).node.color = sw ? UtilColor.Hex2Rgba('#2f5955') : UtilColor.Hex2Rgba('#7c5555');
    }

    public updataRankInfoIlist(): void {
        this.setMyselfRankInfo();
        const index = Config.Get(Config.Type.Cfg_NormalRankConfig);
        const showNum: number = index.getValueByKey(this.RankListType === ERankType.Local ? 'WorldRankNum' : 'SingleServerRankNum', 'CfgValue');
        this.LvRankInfo.setNumItems(showNum - 1 || 49);
        // (this.RankInfoData.SimpleData.length < this.rankLimit ? this.RankInfoData.SimpleData.length : this.rankLimit);
        this.NdListNoOne.active = !this.RankInfoData.SimpleData;
        this.LvRankInfo.updateAll();
    }

    /** 设置排行榜内容 */
    public setRankInfoList(item: cc.Node, i: number): void {
        const itemCtr = item.getComponent(RankInfoItem);
        const ishave = !!this.RankInfoData.SimpleData[i];
        const RankNo = ishave ? this.RankInfoData.SimpleData[i].R : i + 2; // 从第二名开始因此要+1 索引与排名要+1 最终+2
        const RankName = ishave
            ? `${UtilGame.ShowNick(this.RankInfoData.SimpleData[i].PlayerInfo.ShowAreaId, this.RankInfoData.SimpleData[i].PlayerInfo.Name)}`
            : i18n.tt(Lang.com_noman_is);
        const bvalue = ishave ? this.RankInfoData.SimpleData[i].SortValue : 0;
        let RankValue: string = i18n.tt(Lang.com_null);
        let armyLv = -1;
        let color = '';
        if (this.RankInfoData.Param === ERankParam.Army) {
            if (ishave) {
                RankValue = `${bvalue % 1000}${i18n.lv}`;
                armyLv = Math.floor(bvalue / 1000);
            }
        } else if (this.RankInfoData.Param === ERankParam.Office) {
            if (ishave) {
                const value = bvalue;
                const ArenaCfg = ModelMgr.I.RoleOfficeModel.getOfficialInfo(value);
                RankValue = `【${ArenaCfg.name1}·${ArenaCfg.name2}】`;
                color = UtilItem.GetItemQualityColor(ArenaCfg.conf.Quality);
            }
        } else {
            RankValue = UtilNum.ConvertFightValue(bvalue);
        }
        const vip = ishave ? this.RankInfoData.SimpleData[i].PlayerInfo.Vip : 1;
        itemCtr.setData({ RankNo, Name: RankName });
        if (color.length > 0) {
            itemCtr.setInfo(`${this.nameDesc[this.clickIdx]}:`, RankValue, armyLv, vip, i18n.tt(Lang.com_null), color);
        } else {
            itemCtr.setInfo(`${this.nameDesc[this.clickIdx]}:`, RankValue, armyLv, vip);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        itemCtr.setHead(ishave ? this.RankInfoData.SimpleData[i].PlayerInfo.Head : 1);
    }

    /** 设置第一名 */
    private setOnePlay(): void {
        //
        const rankPath = UtilPath.rankPath(1);
        this.DyPlayOneIcon.loadImage(rankPath, 1, true);
        this.NdNoOne.active = !this.RankInfoData.FirstData;
        this.NdAni.active = !!this.RankInfoData.FirstData;
        this.DyArmy.node.active = this.RankInfoData.Param === ERankParam.Office || this.RankInfoData.Param === ERankParam.Army;
        this.NdNoOne.active = !this.DyArmy.node.active && !this.RankInfoData.FirstData;
        if (!this.RankInfoData.FirstData) {
            this.LbPlayOneName.string = i18n.tt(Lang.com_noman_is);

            this.LbPlayOneValue.string = this.RankInfoData.Param === ERankParam.Army || this.RankInfoData.Param === ERankParam.Office
                ? i18n.tt(Lang.com_null)
                : '0';
            this.LbPlayOneValueType.string = `${this.nameDesc[this.clickIdx]}:`;
            return;
        }
        this.setModel();
        const playOneAttr: IntAttr[] = this.RankInfoData.FirstData.PlayerInfo.A;
        let _s: number;
        let _svip: number;
        playOneAttr.forEach((attr) => {
            if (attr.K === 2510) {
                _s = attr.V;
            }
            if (attr.K === 2560) {
                _svip = attr.V;
            }
        });
        this.LbPlayOneName.string = UtilGame.ShowNick(_s, this.RankInfoData.FirstData.PlayerInfo.Name);
        let RankValue: string;
        this.NdPlayOnArmy.active = this.RankInfoData.Param === ERankParam.Army;
        if (this.RankInfoData.Param === ERankParam.Army) {
            const lv = Math.floor(this.RankInfoData.FirstData.SortValue / 1000);
            RankValue = lv === 0 ? '' : `${this.RankInfoData.FirstData.SortValue % 1000}${i18n.lv}`;
            // if (lv > 0) {
            const colorStr: string = ArmyLvConst.getLvColorByArmyLV(lv, true);
            this.LbPlayOneValue.node.color = UtilColor.Hex2Rgba(colorStr);
            const img = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(lv);
            this.NdPlayOnArmy.getComponent(DynamicImage).loadImage(img, 1, true);
            // }
        } else if (this.RankInfoData.Param === ERankParam.Office) {
            const bvalue = this.RankInfoData.FirstData.SortValue;
            const ArenaCfg = ModelMgr.I.RoleOfficeModel.getOfficialInfo(bvalue);
            RankValue = `【${ArenaCfg.name1}·${ArenaCfg.name2}】`;
            this.LbPlayOneValue.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(ArenaCfg.conf.Quality));
        } else {
            RankValue = UtilNum.ConvertFightValue(this.RankInfoData.FirstData.SortValue);
            this.LbPlayOneValue.node.color = UtilColor.Hex2Rgba('#fbf3dc');
        }
        this.LbPlayOneValue.string = RankValue;
        this.LbPlayOneValueType.string = `${this.nameDesc[this.clickIdx]}:`;
        // 缺第一名，模型
    }

    private anmiId: number = 0;
    /** 设置模型区域 */
    private setModel(): void {
        const remove: () => void = () => {
            this.NdAni.destroyAllChildren();
            this.NdAni.removeAllChildren();
        }; // if (!this.RankInfoData.FirstData.PlayerInfo) return;
        // 人物角色展示
        this.DyArmy.node.active = this.RankInfoData.Param === ERankParam.Office || this.RankInfoData.Param === ERankParam.Army;
        if (this.RankInfoData.Param === ERankParam.BattleValue
            || this.RankInfoData.Param === ERankParam.Equip
            || this.RankInfoData.Param === ERankParam.Level) {
            remove();
            this._role = EntityUiMgr.I.createAttrEntity(this.NdAni, {
                isShowTitle: true,
                resType: ANIM_TYPE.ROLE,
                isPlayUs: false,
            }, {
                A: this.RankInfoData.FirstData.PlayerInfo.A,
                B: [],
            });
            this._role.setTitleAnim(this.titel[this.clickIdx], 1.5);
            this.anmiId = 0;
        } else if (this.RankInfoData.Param === ERankParam.General) {
            const skinid = UtilGame.GetIntAttrByKey(this.RankInfoData.FirstData.PlayerInfo.A, 2660).V;
            const indexer: Cfg_General = Config.Get(ConfigConst.Cfg_General).getValueByKey(skinid);
            // 此处有疑问，武将皮肤有三种状态，需要判断怎么选，还有幻化的皮肤
            const animId = indexer.AnimId.split('|')[0];
            if (this.anmiId === Number(animId)) return;
            this.anmiId = Number(animId);
            remove();
            this._role = EntityUiMgr.I.createAttrEntity(this.NdAni, {
                resId: animId,
                resType: ANIM_TYPE.PET,
                isPlayUs: false,
            });
        } else if (this.RankInfoData.Param === ERankParam.Horse) {
            const skinid = UtilGame.GetIntAttrByKey(this.RankInfoData.FirstData.PlayerInfo.A, 2570).V;
            const animId = GradeMgr.I.getGradeSkinCfgById(skinid).AnimId;
            if (this.anmiId === animId) return;
            this.anmiId = animId;
            remove();
            EntityUiMgr.I.createEntity(this.NdAni, {
                resId: animId,
                resType: ANIM_TYPE.HORSE,
                isPlayUs: false,
            });
        } else if (this.RankInfoData.Param === ERankParam.Wing) {
            const skinid = UtilGame.GetIntAttrByKey(this.RankInfoData.FirstData.PlayerInfo.A, 2571).V;
            const animId = GradeMgr.I.getGradeSkinCfgById(skinid).AnimId;
            if (this.anmiId === animId) return;
            this.anmiId = animId;
            remove();
            EntityUiMgr.I.createEntity(this.NdAni, {
                resId: animId,
                resType: ANIM_TYPE.WING,
                isPlayUs: false,
            });
        } else if (this.RankInfoData.Param === ERankParam.Waepon) {
            const skinid = UtilGame.GetIntAttrByKey(this.RankInfoData.FirstData.PlayerInfo.A, 2572).V;
            const animId = GradeMgr.I.getGradeSkinCfgById(skinid).AnimId;
            if (this.anmiId === animId) return;
            this.anmiId = animId;
            remove();
            EntityUiMgr.I.createEntity(this.NdAni, {
                resId: animId,
                resType: ANIM_TYPE.WEAPON,
                isPlayUs: false,
            });
        } else if (this.RankInfoData.Param === ERankParam.Army) {
            this.anmiId = 0;
            const armyIcon = ModelMgr.I.ArmyLevelModel.getIconByArmyLv(Math.floor(this.RankInfoData.FirstData.SortValue / 1000));
            this.DyArmy.loadImage(armyIcon, 1, true);
            remove();
        } else if (this.RankInfoData.Param === ERankParam.Office) {
            this.anmiId = 0;
            const armyIcon = ModelMgr.I.RoleOfficeModel.getOfficialInfo(this.RankInfoData.FirstData.SortValue);
            this.DyArmy.loadImage(`${RES_ENUM.Official_Icon_Icon_Guanzhi}${armyIcon.conf.Picture}`, 1, true);
            remove();
        }
    }

    /**
     *  设置道具信息
     */
    private setEquip(): void {
        this.NdShowEquips.destroyAllChildren();
        this.NdShowEquips.removeAllChildren();
        if (!this.RankInfoData.FirstData || !this.RankInfoData.FirstData.PlayerInfo) return;
        // 整一个道具列表的进来
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const itemData: ItemData[] = this.RankInfoData.FirstData.PlayerInfo.Items;
        const EquipPosList: EquipPos[] = this.RankInfoData.FirstData.PlayerInfo.EquipPosList;

        const _Equips = cc.instantiate(this.RankNdEquip);
        this.NdShowEquips.addChild(_Equips);
        const _RankNdEquips: cc.Node = this.NdShowEquips.children[0];

        console.log(this.RankInfoData.FirstData.PlayerInfo);

        for (let i = 0; _RankNdEquips.children.length > i && itemData.length > i; i++) {
            const _ItemModel: ItemModel = UtilItem.NewItemModel(itemData[i].ItemId, 1);
            const path = _ItemModel.cfg.EquipPart;
            const itemIcon = _RankNdEquips.children[path - 1].getComponentInChildren(ItemIcon);
            itemIcon.setData(_ItemModel);
            for (let n = 0; n < EquipPosList.length; ++n) {
                if (EquipPosList[n].Pos === path) {
                    _ItemModel.EquipPos = EquipPosList[n];
                    break;
                }
            }
        }
    }

    /** 设置一键膜拜 */
    private setOneKeyNice(): void {
        RedDotMgr.I.updateRedDot(RID.RankList.Mobai.Local, RoleMgr.I.d.RankWorship !== 1);
        RedDotMgr.I.updateRedDot(RID.RankList.Mobai.More, RoleMgr.I.d.RankWorshipUnion !== 1);
        UtilRedDot.Unbind(this.NdOneKeyNice);
        if (this.RankListType === 1) {
            this.isMobai = RoleMgr.I.d.RankWorship === 1;
            UtilRedDot.Bind(RID.RankList.Mobai.Local, this.NdOneKeyNice, cc.v2(20, 20));
        } else {
            this.isMobai = RoleMgr.I.d.RankWorshipUnion === 1;
            UtilRedDot.Bind(RID.RankList.Mobai.More, this.NdOneKeyNice, cc.v2(20, 20));
        }
        this.NdOneKeyNice.active = true;
        this.NdOneKeyNice.getComponent(DynamicImage).loadImage(
            this.isMobai ? '/texture/rankList/icon_yimobai@ML' : '/texture/rankList/icon_yijianmobai@ML',
            1,
            false,
        );
        UtilGame.Click(this.NdOneKeyNice, this.clickOneKeyNice, this);
    }

    /** 点击一键膜拜 */
    private clickOneKeyNice(): void {
        if (this.isMobai) {
            MsgToastMgr.Show(i18n.tt(Lang.ranklist_haveGet));
            return;
        }
        ControllerMgr.I.RankListController.getRankWorship(this.RankListType);
    }

    /** 设置自己的排行信息 */
    private setMyselfRankInfo(): void {
        const setInfo: (title: string, data: string, _node: cc.Node) => void = (title: string, data: string, _node: cc.Node) => {
            _node.getChildByName('Label0').getComponent(cc.Label).string = title;
            _node.getChildByName('Label1').getComponent(cc.Label).string = data;
        };
        if (!this.RankInfoData.MyData) {
            setInfo(`${i18n.tt(Lang.arena_my_rank)}`, i18n.tt(Lang.com_null), this.NdMyRank);
            let title = this.nameDesc[this.clickIdx];
            if (this.RankInfoData.Param === ERankParam.Level || this.RankInfoData.Param === ERankParam.BattleValue) {
                title = `${i18n.tt(Lang.com_mine)}${title}`;
            }
            setInfo(`${title}`, i18n.tt(Lang.com_null), this.NdMyRankInfo);
        } else {
            const bvalue = this.RankInfoData.MyData.SortValue;
            let RankValue: string;
            this.NdMyRankInfo.getChildByName('SprArmy').active = this.RankInfoData.Param === ERankParam.Army;
            if (this.RankInfoData.Param === ERankParam.Army) {
                // 军衔 处理的样式多一点
                const lv = Math.floor(bvalue / 1000);
                RankValue = lv === 0 ? '' : `${bvalue % 1000}${i18n.lv}`;
                const colorStr: string = ArmyLvConst.getLvColorByArmyLV(lv, true);
                // if (lv > 0) {
                this.NdMyRankInfo.getChildByName('Label1').color = UtilColor.Hex2Rgba(colorStr);
                const img = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(lv);
                this.NdMyRankInfo.getComponentInChildren(DynamicImage).loadImage(img, 1, true);
                // }
            } else if (this.RankInfoData.Param === ERankParam.Office) {
                const bvalue = this.RankInfoData.MyData.SortValue;
                const ArenaCfg = ModelMgr.I.RoleOfficeModel.getOfficialInfo(bvalue);
                RankValue = `【${ArenaCfg.name1}·${ArenaCfg.name2}】`;
                this.NdMyRankInfo.getChildByName('Label1').color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(ArenaCfg.conf.Quality));
            } else if (this.RankInfoData.Param === ERankParam.Level) {
                RankValue = `${bvalue}${i18n.lv}`;
            } else {
                this.NdMyRankInfo.getChildByName('Label1').color = UtilColor.Hex2Rgba(UtilColor.GreenE);
                RankValue = UtilNum.ConvertFightValue(bvalue);
            }
            let title = this.nameDesc[this.clickIdx];
            if (this.RankInfoData.Param === ERankParam.BattleValue) {
                title = `${i18n.tt(Lang.com_mine)}${title}`;
            }
            const data = [
                { title: `${i18n.tt(Lang.arena_my_rank)}:`, data: UtilNum.ConvertFightValue(this.RankInfoData.MyData.R) },
                { title: `${title}:`, data: RankValue }];
            setInfo(data[0].title, data[0].data.toString(), this.NdMyRank);
            setInfo(data[1].title, data[1].data.toString(), this.NdMyRankInfo);
        }
    }
    private onNdWorldLevel() {
        WinMgr.I.open(ViewConst.WorldLevelWin);
        RedDotMgr.I.updateRedDot(RID.RankList.WorldLevel, false);
    }
}
