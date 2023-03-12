import UtilGeneral from '../../base/utils/UtilGeneral';
import UtilItem from '../../base/utils/UtilItem';
import { ComHeadItem } from '../../com/headIten/ComHeadItem';
import { HeadData } from '../../com/headIten/ConstHead';
import ModelMgr from '../../manager/ModelMgr';
import { BeautyInfo } from '../beauty/BeautyInfo';
import { GeneralMsg } from '../general/GeneralConst';

export default class FamilyUtil {
    // 武将红颜均需要判断 是自己的还是别人的
    public static setGeneralHead(comHeadItem: ComHeadItem, set: SetPartner, customData: any = null): void {
        // 判断是自己的还是别人的
        let headData: HeadData;
        const partnerId: string = set.Id;
        const otherData: HelpPartner = ModelMgr.I.FamilyModel.getOtherGeneralBeautyInfo(partnerId);
        if (otherData) { // 是他人列表
            // const _data: HelpPartner = ModelMgr.I.FamilyModel.getOtherGeneralBeautyInfo(partnerId);
            const cfg: Cfg_General = ModelMgr.I.GeneralModel.getCfg(otherData.IId);// 武将配置
            const t = otherData.Title;
            const r = otherData.Rarity;
            headData = {
                quality: otherData.Quality, // 品质
                headIconId: Number(cfg.RebornPetHeadIcon.split('|')[0]), // 头像
                level: cfg.Name, // 等级 传入一个字符串 不传不显示
                sprTitlePath: UtilGeneral.GetSmallTitle(r, t), // 头衔背景
                labTitle: UtilGeneral.GLabTitle(otherData.Title), // 无双 盖世...
                sprRarityPath: UtilGeneral.GRPath(r), // 虎将 武将 名将...
            };
        } else { // 是自己列表
            const _data: GeneralMsg = ModelMgr.I.GeneralModel.generalData(partnerId);
            const t = _data.generalData.Title;
            const r = _data.cfg.Rarity;
            headData = {
                quality: _data.generalData.Quality, // 品质
                headIconId: Number(_data.cfg.RebornPetHeadIcon.split('|')[0]), // 头像
                level: _data.cfg.Name, // 等级 传入一个字符串 不传不显示
                sprTitlePath: UtilGeneral.GetSmallTitle(r, t), // 武将头衔背景
                labTitle: UtilGeneral.GLabTitle(_data.generalData.Title), // 无双 盖世...
                sprRarityPath: UtilGeneral.GRPath(r), // 虎将 武将 名将...
            };
        }
        if (customData) {
            headData.customData = customData;
        }
        comHeadItem.setData(headData);
    }

    // 红颜
    public static setBeautyHead(comHeadItem: ComHeadItem, set: SetPartner, customData: any = null): void {
        let headData: HeadData;
        const partnerId = set.Id;
        const otherData: HelpPartner = ModelMgr.I.FamilyModel.getOtherGeneralBeautyInfo(partnerId);
        if (otherData) { // 是他人列表
            // const _data: HelpPartner = ModelMgr.I.FamilyModel.getOtherGeneralBeautyInfo(partnerId);
            const cfgBeauty: Cfg_Beauty = ModelMgr.I.BeautyModel.getBeautyCfg(otherData.IId);
            // 此处ID看FamilyModel里设置的
            headData = {
                quality: otherData.Quality, // 品质
                headIconId: cfgBeauty.AnimId, // 头像
                // // select?: boolean, // 正方形的一个选中框
                // isCheck: isChecked, // 是否选中√
                // // isLockBig?: boolean, // 是否锁住 大的锁
                level: cfgBeauty.Name, // 等级 传入一个字符串 不传不显示
                // // levelColor?: cc.Color, // 等级颜色 不传默认白色
                sprTitlePath: UtilItem.GetItemQualityFontImgPath(otherData.Quality), // 极品 稀有 普通
                // labTitle: i18n.tt(Lang[`general_title_${_data.generalData.Title}`]), // 无双 盖世...
            };
        } else {
            const _data: BeautyInfo = ModelMgr.I.BeautyModel.getBeauty(Number(partnerId));
            const cfgBeauty = _data.cfg.getValueByKey(_data.BeautyId, { Quality: 0, AnimId: 0, Name: '' });
            headData = {
                quality: cfgBeauty.Quality, // 品质
                headIconId: cfgBeauty.AnimId, // 头像
                // // select?: boolean, // 正方形的一个选中框
                // isCheck: boolean, // 是否选中√
                // // isLockBig?: boolean, // 是否锁住 大的锁
                level: cfgBeauty.Name, // 等级 传入一个字符串 不传不显示
                // // levelColor?: cc.Color, // 等级颜色 不传默认白色
                sprTitlePath: UtilItem.GetItemQualityFontImgPath(cfgBeauty.Quality), // 红颜：极品 稀有 普通
                // labTitle: i18n.tt(Lang[`general_title_${_data.generalData.Title}`]), // 无双 盖世...
            };
        }
        if (customData) {
            headData.customData = customData;
        }
        comHeadItem.setData(headData);
    }

    // 军师
    // 待开发
    // 待开发
    // 待开发
    // 待开发
}
