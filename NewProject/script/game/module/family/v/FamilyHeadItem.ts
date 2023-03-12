import { i18n, Lang } from '../../../../i18n/i18n';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import UtilItem from '../../../base/utils/UtilItem';
import { ComHeadItem } from '../../../com/headIten/ComHeadItem';
import { HeadData } from '../../../com/headIten/ConstHead';
import { RES_ENUM } from '../../../const/ResPath';
import ModelMgr from '../../../manager/ModelMgr';
import { BeautyInfo } from '../../beauty/BeautyInfo';
import { GeneralMsg } from '../../general/GeneralConst';
import { EntityData } from '../FamilyConst';
import { FamilyUIType } from '../FamilyVoCfg';

const { ccclass, property } = cc._decorator;

/** 事务列表Item */
@ccclass
export class FamilyHeadItem extends cc.Component {
    @property(cc.Label)// 玩家昵称
    private LabName: cc.Label = null;
    @property(ComHeadItem)// 玩家战力
    public comHeadItem: ComHeadItem = null;

    @property(cc.Node)// 协助中...
    private NdHelping: cc.Node = null;

    @property(cc.Node)// 阵营
    private NdCamp: cc.Node = null;

    @property(cc.Label)// 阵营
    private LabCamp: cc.Label = null;

    // GeneralMsg | BeautyInfo | 军师 |EntityData
    public setData(data: any, tabIdx: number, uiType: FamilyUIType): void {
        if (uiType === FamilyUIType.SetAssist) {
            this.NdCamp.active = false;
            this.NdHelping.active = false;// 设置协助不需要显示协助中
            let headData: HeadData = null;
            let strName: string = '';
            if (tabIdx === 0) { // 武将页签
                const _data: GeneralMsg = data;

                // 当前id 是否在 协助列表
                const onlyId: string = _data.generalData.OnlyId;
                const isChecked: boolean = ModelMgr.I.FamilyModel.isInHelpList(onlyId);
                const t = _data.generalData.Title;
                headData = {
                    quality: _data.generalData.Quality, // 品质
                    headIconId: Number(_data.cfg.RebornPetHeadIcon.split('|')[0]), // 头像
                    // select?: boolean, // 正方形的一个选中框
                    isCheck: isChecked, // 是否选中√
                    // isLockBig?: boolean, // 是否锁住 大的锁
                    level: _data.cfg.Name, // 等级 传入一个字符串 不传不显示
                    // levelColor?: cc.Color, // 等级颜色 不传默认白色
                    sprTitlePath: UtilGeneral.GetSmallTitle(_data.cfg.Rarity, t),
                    // `${RES_ENUM.General_Img_Wujiang_T3}${_data.generalData.Title}`, // 标题  背景 或者 极品 稀有 普通
                    labTitle: UtilGeneral.GLabTitle(_data.generalData.Title), // 无双 盖世...
                    sprRarityPath: UtilGeneral.GRPath(_data.cfg.Rarity), // 虎将 武将 名将...

                };
                strName = _data.cfg.Name;// 昵称
            } else if (tabIdx === 1) { // 红颜页签
                const _data: BeautyInfo = data;
                const cfgBeauty = _data.cfg.getValueByKey(_data.BeautyId, { Quality: 0, AnimId: 0, Name: '' });
                const BeautyId: string = `${_data.BeautyId}`;
                const isChecked: boolean = ModelMgr.I.FamilyModel.isInHelpList(BeautyId);
                headData = {
                    quality: cfgBeauty.Quality, // 品质
                    headIconId: cfgBeauty.AnimId, // 头像
                    // // select?: boolean, // 正方形的一个选中框
                    isCheck: isChecked, // 是否选中√
                    // // isLockBig?: boolean, // 是否锁住 大的锁
                    level: cfgBeauty.Name, // 等级 传入一个字符串 不传不显示
                    // // levelColor?: cc.Color, // 等级颜色 不传默认白色
                    sprTitlePath: `${RES_ENUM.Com_Font_Com_Font_Quality_Small}${cfgBeauty.Quality}@ML`, // 标题  背景 或者 极品 稀有 普通
                    // labTitle: i18n.tt(Lang[`general_title_${_data.generalData.Title}`]), // 无双 盖世...
                };
                strName = cfgBeauty.Name;// 昵称
            } else if (tabIdx === 2) { // 军师页签功能未开发
                // 待开发
                // 待开发
                // 待开发
                // 待开发
                // 待开发
            }
            this.LabName.string = '';// strName;// 昵称
            this.comHeadItem.setData(headData);
        } else { // 任务详情
            const eData: EntityData = data;
            this.NdHelping.active = !!eData.inSender;// 在派遣列表

            let headData: HeadData = null;
            let strName: string = '';
            this.NdCamp.active = false;
            if (tabIdx === 0) { // 武将页签
                this.NdCamp.active = true;

                if (eData.self) { // 是自己 还是别人
                    const _data: GeneralMsg = ModelMgr.I.FamilyModel.getGeneralInfo(eData);

                    const onlyId: string = _data.generalData.OnlyId;
                    let isChecked: boolean = ModelMgr.I.FamilyModel.isCheckInHeadArr(onlyId);// _headDataArr
                    if (eData.inSender) { // 如果显示派遣中  就不显示打钩
                        isChecked = false;
                    }
                    const t = _data.generalData.Title;

                    headData = {
                        quality: _data.generalData.Quality, // 品质
                        headIconId: Number(_data.cfg.RebornPetHeadIcon.split('|')[0]), // 头像
                        // select?: boolean, // 正方形的一个选中框
                        isCheck: isChecked, // 是否选中√
                        // isLockBig?: boolean, // 是否锁住 大的锁
                        level: _data.cfg.Name, // 等级 传入一个字符串 不传不显示
                        // levelColor?: cc.Color, // 等级颜色 不传默认白色
                        sprTitlePath: UtilGeneral.GetSmallTitle(_data.cfg.Rarity, t),
                        //  `${RES_ENUM.General_Img_Wujiang_T3}${_data.generalData.Title}`, // 标题  背景 或者 极品 稀有 普通
                        labTitle: i18n.tt(Lang[`general_title_${_data.generalData.Title}`]), // 无双 盖世...
                        sprRarityPath: UtilGeneral.GRPath(_data.cfg.Rarity), // 虎将 武将 名将...
                    };
                    strName = '';// _data.cfg.Name;// 昵称

                    // this.LabCamp.string = _data.cfg.Camp '魏蜀吴群';
                    this.LabCamp.string = i18n.tt(Lang[`general_camp_${_data.cfg.Camp}`]);
                } else {
                    const _data: HelpPartner = ModelMgr.I.FamilyModel.getOtherGeneralBeautyInfo(eData.StrId);
                    // 当前id 是否在 协助列表
                    const onlyId: string = _data.Id;
                    let isChecked: boolean = ModelMgr.I.FamilyModel.isCheckInHeadArr(onlyId);// _headDataArr
                    if (eData.inSender) { // 如果显示派遣中  就不显示打钩
                        isChecked = false;
                    }
                    const cfg: Cfg_General = ModelMgr.I.GeneralModel.getCfg(_data.IId);// 武将配置
                    const t = _data.Title;
                    headData = {
                        quality: _data.Quality, // 品质
                        headIconId: Number(cfg.RebornPetHeadIcon.split('|')[0]), // 头像
                        // select?: boolean, // 正方形的一个选中框
                        isCheck: isChecked, // 是否选中√
                        // isLockBig?: boolean, // 是否锁住 大的锁
                        level: cfg.Name, // 等级 传入一个字符串 不传不显示
                        // levelColor?: cc.Color, // 等级颜色 不传默认白色
                        sprTitlePath: UtilGeneral.GetSmallTitle(_data.Rarity, t),
                        //  `${RES_ENUM.General_Img_Wujiang_T3}${_data.Title}`, // 标题  背景 或者 极品 稀有 普通
                        labTitle: i18n.tt(Lang[`general_title_${_data.Title}`]), // 无双 盖世...
                        sprRarityPath: UtilGeneral.GRPath(_data.Rarity), // 虎将 武将 名将...

                    };
                    this.LabCamp.string = i18n.tt(Lang[`general_camp_${cfg.Camp}`]);
                    strName = _data.UserNick;// cfg.Name;// _data.UserNick;// 昵称//
                }
            } else if (tabIdx === 1) { // 红颜页签
                this.NdCamp.active = false;
                if (eData.self) { // 是自己 还是别人
                    const BeautyId: number = Number(eData.StrId);
                    const _data: BeautyInfo = ModelMgr.I.FamilyModel.getBeautyData(BeautyId);
                    const cfgBeauty = _data.cfg.getValueByKey(_data.BeautyId, { Quality: 0, AnimId: 0, Name: '' });

                    // 此处ID看FamilyModel里设置的
                    let isChecked: boolean = ModelMgr.I.FamilyModel.isCheckInHeadArr(eData.StrId);// _headDataArr
                    if (eData.inSender) { // 如果显示派遣中  就不显示打钩
                        isChecked = false;
                    }

                    headData = {
                        quality: cfgBeauty.Quality, // 品质
                        headIconId: cfgBeauty.AnimId, // 头像
                        // // select?: boolean, // 正方形的一个选中框
                        isCheck: isChecked, // 是否选中√
                        // // isLockBig?: boolean, // 是否锁住 大的锁
                        level: cfgBeauty.Name, // 等级 传入一个字符串 不传不显示
                        // // levelColor?: cc.Color, // 等级颜色 不传默认白色
                        sprTitlePath: UtilItem.GetItemQualityFontImgPath(cfgBeauty.Quality), // 标题  背景 或者 极品 稀有 普通
                        // labTitle: i18n.tt(Lang[`general_title_${_data.generalData.Title}`]), // 无双 盖世...
                    };
                    strName = '';// cfgBeauty.Name;// 昵称
                } else {
                    const _data: HelpPartner = ModelMgr.I.FamilyModel.getHelperBeautyInfo(eData.StrId);
                    const cfgBeauty: Cfg_Beauty = ModelMgr.I.BeautyModel.getBeautyCfg(eData.IId);
                    // 此处ID看FamilyModel里设置的
                    let isChecked: boolean = ModelMgr.I.FamilyModel.isCheckInHeadArr(eData.StrId);// _headDataArr
                    if (eData.inSender) { // 如果显示派遣中  就不显示打钩
                        isChecked = false;
                    }
                    headData = {
                        quality: _data.Quality, // 品质
                        headIconId: cfgBeauty.AnimId, // 头像
                        // // select?: boolean, // 正方形的一个选中框
                        isCheck: isChecked, // 是否选中√
                        // // isLockBig?: boolean, // 是否锁住 大的锁
                        level: cfgBeauty.Name, // 等级 传入一个字符串 不传不显示
                        // // levelColor?: cc.Color, // 等级颜色 不传默认白色
                        sprTitlePath: `${RES_ENUM.Com_Font_Com_Font_Quality_Small}${_data.Quality}@ML`, // 标题  背景 或者 极品 稀有 普通
                        // labTitle: i18n.tt(Lang[`general_title_${_data.generalData.Title}`]), // 无双 盖世...
                    };
                    strName = _data.UserNick;// cfgBeauty.Name;// 昵称
                }
            } else if (tabIdx === 2) { // 军师页签功能未开发
                this.NdCamp.active = false;
                // 待开发
                // 待开发
                // 待开发
                // 待开发
                // 待开发
            }
            this.LabName.string = strName;// 昵称
            this.comHeadItem.setData(headData);
        }
    }
}
