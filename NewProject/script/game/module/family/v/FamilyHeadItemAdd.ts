import { data } from '../../../../../resources/i18n/en-US';
import { i18n, Lang } from '../../../../i18n/i18n';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import UtilItem from '../../../base/utils/UtilItem';
import { ComHeadItem } from '../../../com/headIten/ComHeadItem';
import { HeadData } from '../../../com/headIten/ConstHead';
import { RES_ENUM } from '../../../const/ResPath';
import { EntityUnitType } from '../../../entity/EntityConst';
import ModelMgr from '../../../manager/ModelMgr';
import { BeautyInfo } from '../../beauty/BeautyInfo';
import { GeneralMsg } from '../../general/GeneralConst';

const { ccclass, property } = cc._decorator;

/** 事务列表Item */
@ccclass
export class FamilyHeadItemAdd extends cc.Component {
    @property(cc.Node)// 玩家昵称
    private SprBg: cc.Node = null;
    @property(ComHeadItem)// 玩家战力
    public comHeadItem: ComHeadItem = null;

    @property(cc.Node)// 阵营
    private NdCamp: cc.Node = null;

    @property(cc.Label)// 阵营
    private LabCamp: cc.Label = null;

    private _data: SetPartner;
    public setData(data: SetPartner): void {
        this._data = data;
        if (data) {
            this.comHeadItem.node.active = true;
            this.SprBg.active = false;
            this._setHead();
        } else {
            this.NdCamp.active = false;
            this.comHeadItem.node.active = false;
            this.SprBg.active = true;
        }
    }

    private _setHead() {
        const partnerId: string = this._data.Id;// id
        const partnerType: number = this._data.PartnerType;// 伙伴类型

        // 自己还是他人的头像
        const isOther: HelpPartner = ModelMgr.I.FamilyModel.getOtherGeneralBeautyInfo(partnerId);
        if (!isOther) { // 自己
            if (partnerType === EntityUnitType.General) { // 武将
                this.NdCamp.active = true;
                const _data: GeneralMsg = ModelMgr.I.GeneralModel.generalData(partnerId);
                this.LabCamp.string = i18n.tt(Lang[`general_camp_${_data.cfg.Camp}`]);

                const t = _data.generalData.Title;
                const r = _data.cfg.Rarity;
                const headData: HeadData = {
                    quality: _data.generalData.Quality, // 品质
                    headIconId: Number(_data.cfg.RebornPetHeadIcon.split('|')[0]), // 头像
                    // select?: boolean, // 正方形的一个选中框
                    // isCheck: isChecked, // 是否选中√
                    // isLockBig?: boolean, // 是否锁住 大的锁
                    level: _data.cfg.Name, // 等级 传入一个字符串 不传不显示
                    // levelColor?: cc.Color, // 等级颜色 不传默认白色
                    sprTitlePath: UtilGeneral.GetSmallTitle(r, t),
                    //  `${RES_ENUM.General_Img_Wujiang_T3}${_data.generalData.Title}`, // 标题  背景 或者 极品 稀有 普通
                    labTitle: i18n.tt(Lang[`general_title_${_data.generalData.Title}`]), // 无双 盖世...
                    sprRarityPath: UtilGeneral.GRPath(r), // 虎将 武将 名将...
                    customData: [partnerId, partnerType],
                };
                this.comHeadItem.setData(headData);
            } else if (partnerType === EntityUnitType.Beauty) { // 红颜
                this.NdCamp.active = false;

                const _data: BeautyInfo = ModelMgr.I.BeautyModel.getBeauty(Number(partnerId));
                const cfgBeauty = _data.cfg.getValueByKey(_data.BeautyId, { Quality: 0, AnimId: 0, Name: '' });
                // const BeautyId: string = `${_data.BeautyId}`;
                const headData: HeadData = {
                    quality: cfgBeauty.Quality, // 品质
                    headIconId: cfgBeauty.AnimId, // 头像
                    // // select?: boolean, // 正方形的一个选中框
                    // isCheck: boolean, // 是否选中√
                    // // isLockBig?: boolean, // 是否锁住 大的锁
                    level: cfgBeauty.Name, // 等级 传入一个字符串 不传不显示
                    // // levelColor?: cc.Color, // 等级颜色 不传默认白色
                    sprTitlePath: UtilItem.GetItemQualityFontImgPath(cfgBeauty.Quality), // 标题  背景 或者 极品 稀有 普通
                    // labTitle: i18n.tt(Lang[`general_title_${_data.generalData.Title}`]), // 无双 盖世...
                    customData: [partnerId, partnerType],

                };
                this.comHeadItem.setData(headData);
            }
            // else if(partnerType === 军师){
            //     //待开发
            //     //待开发
            // let headData = {}
            // this.comHeadItemArr[i].setData(headData);
            //     //待开发
            //     //待开发
            // }
        } else { // 其他人的头像
            // eslint-disable-next-line no-lonely-if
            if (partnerType === EntityUnitType.General) { // 武将
                this.NdCamp.active = true;
                const _data: HelpPartner = ModelMgr.I.FamilyModel.getOtherGeneralBeautyInfo(partnerId);
                const cfg: Cfg_General = ModelMgr.I.GeneralModel.getCfg(_data.IId);// 武将配置
                this.LabCamp.string = i18n.tt(Lang[`general_camp_${cfg.Camp}`]);
                const t = _data.Title;
                const r = _data.Rarity;
                const headData = {
                    quality: _data.Quality, // 品质
                    headIconId: Number(cfg.RebornPetHeadIcon.split('|')[0]), // 头像
                    // select?: boolean, // 正方形的一个选中框
                    // isCheck: isChecked, // 是否选中√
                    // isLockBig?: boolean, // 是否锁住 大的锁
                    level: cfg.Name, // 等级 传入一个字符串 不传不显示
                    // levelColor?: cc.Color, // 等级颜色 不传默认白色
                    sprTitlePath: UtilGeneral.GetSmallTitle(r, t),
                    // `${RES_ENUM.General_Img_Wujiang_T3}${_data.Title}`, // 标题  背景 或者 极品 稀有 普通
                    labTitle: i18n.tt(Lang[`general_title_${_data.Title}`]), // 无双 盖世...
                    sprRarityPath: UtilGeneral.GRPath(r), // 虎将 武将 名将...
                };
                this.comHeadItem.setData(headData);
            } else if (partnerType === EntityUnitType.Beauty) { // 红颜
                this.NdCamp.active = false;
                const _data: HelpPartner = ModelMgr.I.FamilyModel.getOtherGeneralBeautyInfo(partnerId);

                const cfgBeauty: Cfg_Beauty = ModelMgr.I.BeautyModel.getBeautyCfg(_data.IId);
                // 此处ID看FamilyModel里设置的
                const headData = {
                    quality: _data.Quality, // 品质
                    headIconId: cfgBeauty.AnimId, // 头像
                    // // select?: boolean, // 正方形的一个选中框
                    // isCheck: isChecked, // 是否选中√
                    // // isLockBig?: boolean, // 是否锁住 大的锁
                    level: cfgBeauty.Name, // 等级 传入一个字符串 不传不显示
                    // // levelColor?: cc.Color, // 等级颜色 不传默认白色
                    sprTitlePath: `${RES_ENUM.Com_Font_Com_Font_Quality_Small}${_data.Quality}@ML`, // 标题  背景 或者 极品 稀有 普通
                    // labTitle: i18n.tt(Lang[`general_title_${_data.generalData.Title}`]), // 无双 盖世...
                };
                this.comHeadItem.setData(headData);
            }
            // else if(partnerType === 军师){
            //     //待开发
            //     //待开发
            // let headData = {}
            // this.comHeadItemArr[i].setData(headData);
            //     //待开发
            //     //待开发
            // }
        }
    }
}
