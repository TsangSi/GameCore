/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-09-22 22:17:12
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\com\GeneralSkinItem.ts
 * @Description: 武将-皮肤-头像
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { RES_ENUM } from '../../../const/ResPath';
import ModelMgr from '../../../manager/ModelMgr';
import { GSkinState } from '../gskin/GskinConst';

const { ccclass, property } = cc._decorator;
@ccclass
export default class GeneralSkinItem extends BaseCmp {
    @property(cc.Node)
    private NdItem: cc.Node = null;
    @property(cc.Node)
    private NdSelect: cc.Node = null;
    @property(DynamicImage)
    private SprQualityBg: DynamicImage = null;
    @property(DynamicImage)
    private SprQualityKuang: DynamicImage = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabFrom: cc.Label = null;

    private _skinId: number = 0;
    private _onlyId: string = '';
    private _callback: (skinId: number) => void = null;
    private _context: any;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NdItem, () => {
            if (this._callback) {
                this._callback.call(this._context, this._skinId);
            }
        }, this, { scale: 1 });
    }

    /**
     * 展示
     * @param itemId 道具id
     * @param exp 经验
     * @param isSelected 选中状态
     * @param callback 回调
     */
    public setData(onlyId: string, gData: Cfg_GeneralSkin, isSelected: boolean, callback: (itemId: number) => void = null, context: any = null): void {
        this._onlyId = onlyId;
        this._skinId = gData.Key;
        this._callback = callback;
        this._context = context;

        const state: GSkinState = ModelMgr.I.GeneralModel.getSkinState(this._onlyId, this._skinId);

        const itemCfg: Cfg_Item = Config.Get(Config.Type.Cfg_Item).getValueByKey(gData.NeedItem);
        this.SprIcon.loadImage(`${RES_ENUM.PortraitIcon}${gData.AnimId}`, 1, true);
        this.SprQualityBg.loadImage(`${RES_ENUM.General_Img_Wujiang_Kapai}${itemCfg.Quality}_b`, 1, true);
        this.SprQualityKuang.loadImage(`${RES_ENUM.General_Img_Wujiang_Kapai}${itemCfg.Quality}_a`, 1, true);
        this.LabName.string = gData.Name;
        this.LabFrom.string = gData.FromDesc;
        this.NdSelect.active = !!isSelected;

        const scale = isSelected ? 1 : 0.9;
        this.node.setScale(scale, scale, scale);
        this.uptActive();
        // 红点
        UtilRedDot.UpdateRed(this.node, state === GSkinState.CanActive || state === GSkinState.CanUpStar, cc.v2(65, 94));
    }

    /** 激活引起的展示变化 */
    public uptActive(): void {
        const isActive = ModelMgr.I.GeneralModel.isSkinActive(this._onlyId, this._skinId);
        UtilCocos.SetSpriteGray(this.NdItem, !isActive, true);
    }

    /**
     * 选中状态
     */
    public setSelected(isSelected: boolean): void {
        this.NdSelect.active = !!isSelected;
    }
}
