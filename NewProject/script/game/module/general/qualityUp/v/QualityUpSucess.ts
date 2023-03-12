/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-08-17 14:28:32
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\qualityUp\v\QualityUpSucess.ts
 * @Description: 武将-升品成功
 */
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { Config } from '../../../../base/config/Config';
import { ConfigGeneralSkinIndexer } from '../../../../base/config/indexer/ConfigGeneralSkinIndexer';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilGeneral from '../../../../base/utils/UtilGeneral';
import UtilObject from '../../../../base/utils/UtilObject';
import WinBase from '../../../../com/win/WinBase';
import { RES_ENUM } from '../../../../const/ResPath';
import { ViewConst } from '../../../../const/ViewConst';
import EntityUiMgr from '../../../../entity/EntityUiMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { IGetAwardsInfo } from '../../../grade/v/GradeGetAwardsWin';
import GeneralHead from '../../com/GeneralHead';
import {
    GeneralMsg, GeneralQuality, GeneralRarity, GeneralTitle,
} from '../../GeneralConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class QualityUpSucess extends WinBase {
    @property(cc.Label)
    private LabAtk: cc.Label = null;
    @property(cc.Label)
    private LabAtkNext: cc.Label = null;
    @property(cc.Label)
    private LabDef: cc.Label = null;
    @property(cc.Label)
    private LabDefNext: cc.Label = null;
    @property(cc.Label)
    private LabHp: cc.Label = null;
    @property(cc.Label)
    private LabHpNext: cc.Label = null;
    @property(cc.Label)
    private LabGrow: cc.Label = null;
    @property(cc.Label)
    private LabGrowNext: cc.Label = null;

    @property(cc.Node)
    private NdAnim: cc.Node = null;
    @property(GeneralHead)
    private GeneralHead: GeneralHead = null;
    @property(GeneralHead)
    private GeneralHead2: GeneralHead = null;
    @property(cc.Sprite)
    private SprTitle: cc.Sprite = null;
    @property(cc.Label)
    private LabTitle: cc.Label = null;
    @property(cc.Label)
    private LabClose: cc.Label = null;

    @property(DynamicImage)
    private SprTitleUp: DynamicImage = null;
    @property(DynamicImage)
    private SprSucess: DynamicImage = null;
    @property(cc.Label)
    private LabTitleUp: cc.Label = null;
    @property(cc.Node)
    private NdTitleUp: cc.Node = null;
    @property(cc.Node)
    private NdBg2: cc.Node = null;

    private _time: number = 5;
    private _skinId: number = 0;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });
    }

    public init(param: any[]): void {
        const iType: number = param[0];
        const nextData: GeneralData = param[1];
        const preMsg = param[2];
        if (iType === 1) {
            this.uptContent(nextData);
        } else if (iType === 2) {
            this.uptContent2(nextData, preMsg);
            if (nextData.SkinId) {
                this._skinId = nextData.SkinId;
            }
        }

        // this.LabClose.string = `${i18n.tt(Lang.com_click_close_tips)}(${this._time}${i18n.tt(Lang.com_second)})`;
        this.schedule(() => {
            this._time--;
            if (this._time < 0) {
                this.close();
            } else {
                // this.LabClose.string = `${i18n.tt(Lang.com_click_close_tips)}(${this._time}${i18n.tt(Lang.com_second)})`;
            }
        }, 1);
    }

    /** 升品 */
    private uptContent(nextData: GeneralData) {
        const cfg: Cfg_General = Config.Get(Config.Type.Cfg_General).getValueByKey(nextData.IId);
        const nextMsg: GeneralMsg = {
            generalData: nextData,
            cfg,
        };
        const curMsg: GeneralMsg = UtilObject.clone(nextMsg);
        curMsg.generalData.Quality -= 1;

        this.GeneralHead.setData(curMsg, { unshowSelect: true });
        this.GeneralHead2.setData(nextMsg, { unshowSelect: true });

        let quality = curMsg.generalData.Quality;
        if (quality > GeneralQuality.COLORFUL) {
            quality = GeneralQuality.COLORFUL;
        }
        if (quality < GeneralQuality.GREEN) {
            quality = GeneralQuality.GREEN;
        }
        // 攻击
        this.LabAtk.string = curMsg.cfg.TalentA_Max.split('|')[quality - 1];
        this.LabAtkNext.string = `${nextData.MaxAtkTalent}`;
        // 防御
        this.LabDef.string = curMsg.cfg.TalentD_Max.split('|')[quality - 1];
        this.LabDefNext.string = `${nextData.MaxDefTalent}`;
        // 生命
        this.LabHp.string = curMsg.cfg.TalentH_Max.split('|')[quality - 1];
        this.LabHpNext.string = `${nextData.MaxHpTalent}`;
        // 成长
        this.LabGrow.string = `${(+curMsg.cfg.Grow_Max.split('|')[quality - 1] / 10000).toFixed(2)}`;
        this.LabGrowNext.string = `${(nextData.MaxGrow / 10000).toFixed(2)}`;

        // 头衔
        UtilGeneral.SetTitle(this.SprTitle, this.LabTitle, { rarity: nextMsg.cfg.Rarity, title: nextMsg.generalData.Title, type: 1 });
        this.SprSucess.loadImage(RES_ENUM.Com_Font_Com_Img_Spcg, 1, true);
        //
        this.NdAnim.destroyAllChildren();
        this.NdAnim.removeAllChildren();
        EntityUiMgr.I.createEntity(this.NdAnim, { resId: ModelMgr.I.GeneralModel.getGeneralResByData(nextMsg), resType: ANIM_TYPE.PET, isPlayUs: false });
    }

    /** 觉醒升头衔 */
    private uptContent2(
        nextData: GeneralData,
        preMsg: {
            AtkTalent: number,
            DefTalent: number,
            HpTalent: number,
            MaxAtkTalent: number,
            MaxDefTalent: number,
            MaxHpTalent: number,
            Grow: number,
            MaxGrow: number,
            Title: number,
        },
    ) {
        const cfg: Cfg_General = Config.Get(Config.Type.Cfg_General).getValueByKey(nextData.IId);
        const nextMsg: GeneralMsg = {
            generalData: nextData,
            cfg,
        };
        const curMsg: GeneralMsg = UtilObject.clone(nextMsg);
        let t: number = nextMsg.generalData.Title;
        if (nextMsg.generalData.Title >= GeneralTitle.Title7) {
            t = nextMsg.generalData.Title - 6;
        } else if (nextMsg.generalData.Title >= GeneralTitle.Title4) {
            t = nextMsg.generalData.Title - 3;
        }
        if (curMsg.generalData.Title > 1) {
            curMsg.generalData.Title -= 1;
        }
        curMsg.generalData.SkinId = 0;

        this.GeneralHead.setData(curMsg, { unshowSelect: true });
        this.GeneralHead2.setData(nextMsg, { unshowSelect: true });

        // 攻击
        this.LabAtk.string = `${preMsg.MaxAtkTalent}`;
        this.LabAtkNext.string = `${nextData.MaxAtkTalent}`;
        // 防御
        this.LabDef.string = `${preMsg.MaxDefTalent}`;
        this.LabDefNext.string = `${nextData.MaxDefTalent}`;
        // 生命
        this.LabHp.string = `${preMsg.MaxHpTalent}`;
        this.LabHpNext.string = `${nextData.MaxHpTalent}`;
        // 成长
        this.LabGrow.string = `${(preMsg.MaxGrow / 10000).toFixed(2)}`;
        this.LabGrowNext.string = `${(nextData.MaxGrow / 10000).toFixed(2)}`;

        // 头衔
        UtilGeneral.SetTitle(this.SprTitle, this.LabTitle, { rarity: nextMsg.cfg.Rarity, title: nextMsg.generalData.Title, type: 1 });
        //
        this.NdAnim.destroyAllChildren();
        this.NdAnim.removeAllChildren();
        EntityUiMgr.I.createEntity(this.NdAnim, { resId: ModelMgr.I.GeneralModel.getGeneralResByData(nextMsg), resType: ANIM_TYPE.PET, isPlayUs: false });
        this.NdAnim.y = 20;
        this.NdBg2.y = -110;
        // 额外展示的内容
        this.NdTitleUp.active = true;
        this.SprTitleUp.loadImage(`${RES_ENUM.General_Img_Wujiang_T4}${t}`, 1, true);
        this.LabTitleUp.string = `武将头衔提升为【${i18n.tt(Lang[`general_title_${nextData.Title}`])}】了`;
        this.SprSucess.loadImage(RES_ENUM.Com_Font_Com_Font_Txts, 1, true);
    }

    private showGetSkin() {
        if (this._skinId) {
            const indexer: ConfigGeneralSkinIndexer = Config.Get(Config.Type.Cfg_GeneralSkin);
            const skinCfg = indexer.getSkinData(this._skinId);
            // 皮肤表里有数据
            if (skinCfg) {
                const gData: Cfg_General = Config.Get(Config.Type.Cfg_General).getValueByKey(skinCfg.GeneralId);

                const data: IGetAwardsInfo = {
                    type: 0, // 0默认模板，展示获得物品。 1 三倍领取 2 限时三倍领取
                    showName: skinCfg.Name, // 道具名字
                    quality: gData.Quality, // 道具质量
                    animId: skinCfg.AnimId, // 动画id
                    animType: ANIM_TYPE.PET,
                    animScale: 0.85,
                    animPosY: 0,
                    generalRarity: gData.Rarity,
                };
                WinMgr.I.open(ViewConst.GradeGetAwardsWin, data);
            }
        }
    }

    protected close(): void {
        super.close();
        this.showGetSkin();
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
