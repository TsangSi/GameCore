/*
 * @Author: kexd
 * @Date: 2022-11-17 22:54:19
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gEquip\GEquipTipsWin.ts
 * @Description:
 *
 */

import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { IAttrBase } from '../../../base/attribute/AttrConst';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { ConfigAttributeIndexer } from '../../../base/config/indexer/ConfigAttributeIndexer';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { RES_ENUM } from '../../../const/ResPath';
import { ViewConst } from '../../../const/ViewConst';
import GEquipItem from '../com/GEquipItem';
import { GEquipMsg } from '../GeneralConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GEquipTipsWin extends WinBase {
    @property(GEquipItem)
    private GEquipItem: GEquipItem = null;
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabPart: cc.Label = null;
    @property(DynamicImage)
    private SprQuality: DynamicImage = null;
    @property(cc.Label)
    public LabFightValue: cc.Label = null;
    @property(cc.Label)
    private LabAttr: cc.Label = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NodeBlack, () => {
            this.onClose();
        }, this, { scale: 1 });
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    public init(data: unknown): void {
        if (data && data[0]) {
            const msg: GEquipMsg = data[0] as GEquipMsg;
            this.uptContent(msg);
        }
    }

    /** 直接的文本数据展示 */
    private uptContent(msg: GEquipMsg) {
        this.LabName.string = msg.cfg.Name;
        this.SprQuality.loadImage(`${RES_ENUM.Com_Bg_Com_Bg_Tips}${msg.cfg.Quality}`, 1, true);
        this.LabPart.string = i18n.tt(Lang[`general_equip_part${msg.cfg.Part}`]);
        //
        const attrIndexer: ConfigAttributeIndexer = Config.Get(Config.Type.Cfg_Attribute);
        const fv = attrIndexer.getFightValueById(msg.cfg.Attr);
        this.LabFightValue.string = `${fv}`;
        //
        this.GEquipItem.setData(msg);
        // 属性
        const attr: IAttrBase[] = UtilAttr.GetAttrBaseListById(msg.cfg.Attr);
        let attrs: string = '';
        for (let i = 0; i < attr.length; i++) {
            attrs += `${attr[i].name}：${attr[i].value}\n`;
        }
        this.LabAttr.string = attrs;
        // this.NdAttr.getComponent(NdAttrBaseContainer).init(attr, null, { nameC: UtilColor.NorN });
    }

    private onClose() {
        WinMgr.I.close(ViewConst.GEquipTipsWin);
    }
}
