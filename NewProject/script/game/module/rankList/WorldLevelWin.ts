/*
 * @Author: zs
 * @Date: 2023-02-16 19:39:13
 * @Description:
 *
 */
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../i18n/i18n';
import ListView from '../../base/components/listview/ListView';
import { SpriteCustomizer } from '../../base/components/SpriteCustomizer';
import { Config } from '../../base/config/Config';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { WinCmp } from '../../com/win/WinCmp';
import { FuncId } from '../../const/FuncConst';
import ModelMgr from '../../manager/ModelMgr';
import { FuBenMgr } from '../fuben/FuBenMgr';

/*
 * @Author: zs
 * @Date: 2023-02-15 21:44:55
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class WorldLevelWin extends WinCmp {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Label)
    private LabelLevel: cc.Label = null;
    @property(cc.RichText)
    private LabelDesc: cc.RichText = null;

    protected onLoad(): void {
        super.onLoad();
    }

    protected start(): void {
        super.start();
        this.LabelDesc.string = Config.Get(Config.Type.Cfg_WorldNormal).getValueByKey<Cfg_WorldNormal>('NormalDesc')?.CfgValue || '';
        this.LabelLevel.string = UtilString.FormatArgs(i18n.tt(Lang.com_level), FuBenMgr.WorldLevel);
        this.updateScrollView();
    }

    private onRenderItem(node: cc.Node, index: number) {
        const cfg: Cfg_WorldSkill = Config.Get(Config.Type.Cfg_WorldSkill).getValueByIndex(index);
        UtilCocos.SetString(node, 'LabelLevel', UtilString.FormatArgs(i18n.tt(Lang.worldlevel_item_level_name), index + 1));
        const buffStr = ModelMgr.I.BuffModel.getBuffDesc(UtilFunOpen.isOpen(FuncId.RankListCross, false) ? cfg.BuffId2 : cfg.BuffId1);
        UtilCocos.SetString(node, 'LabelDesc', buffStr);
        node.getComponent(SpriteCustomizer).curIndex = index % 2 === 0 ? 0 : 1;
    }

    private updateScrollView() {
        // this.buffs = ModelMgr.I.BuffModel.getAllBuff();
        this.ListView.setNumItems(Config.Get(Config.Type.Cfg_WorldSkill).length);
    }
}
