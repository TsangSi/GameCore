/*
 * @Author: myl
 * @Date: 2022-10-12 14:15:08
 * @Description:
 */
import { UtilArray } from '../../../../../app/base/utils/UtilArray';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import ListView from '../../../../base/components/listview/ListView';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import UtilItemList from '../../../../base/utils/UtilItemList';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import ItemModel from '../../../../com/item/ItemModel';
import WinBase from '../../../../com/win/WinBase';
import { ViewConst } from '../../../../const/ViewConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class MaterialRewardScanWin extends WinBase {
    @property(ListView)
    private ListView1: ListView = null;
    @property(ListView)
    private ListView2: ListView = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    @property(cc.Node)
    private NodeEmpty: cc.Node = null;
    @property(cc.Node)
    private BtnSure: cc.Node = null;
    @property(cc.Label)
    private LabelTitle1: cc.Label = null;
    @property(cc.Label)
    private LabelTitle2: cc.Label = null;

    @property(cc.Label)
    private LabNullTip1: cc.Label = null;
    @property(cc.Label)
    private LabNullTip2: cc.Label = null;

    // private _data: { config: Cfg_FB_Material, data: MaterialData } = null;

    public start(): void {
        super.start();

        UtilGame.Click(this.BtnClose, this.close, this, { scale: 0.9 });
        UtilGame.Click(this.node, this.close, this, { scale: 1 });
    }

    private items1: ItemModel[] = [];
    private items2: ItemModel[] = [];
    public init(params: any[]): void {
        this.items1 = params[0];
        this.items2 = params[1];
        const opts: { btnFunc?: () => void, btnName?: string, title1?: string, title2?: string, nullTip1?: string, nullTip2?: string } = params[2];
        this.ListView1.setNumItems(this.items1.length);
        this.ListView2.setNumItems(this.items2.length);
        this.ListView1.node.active = this.items1.length > 0;
        this.ListView2.node.active = this.items2.length > 0;

        this.LabNullTip1.node.active = this.items1.length <= 0;
        this.LabNullTip2.node.active = this.items2.length <= 0;
        if (this.LabNullTip1.node.active) {
            this.LabNullTip1.string = opts.nullTip1 || '';
        }
        if (this.LabNullTip2.node.active) {
            this.LabNullTip2.string = opts.nullTip2 || '';
        }

        if (opts && (opts.btnFunc || opts.btnName)) {
            this.BtnSure.parent.active = true;
            this.NodeEmpty.active = false;
            UtilCocos.SetString(this.BtnSure, 'Label', opts.btnName || i18n.tt(Lang.com_btn_confirm));
            if (opts.btnFunc) {
                UtilGame.Click(this.BtnSure, () => {
                    opts.btnFunc();
                }, this);
            }
        } else {
            this.BtnSure.parent.active = false;
            this.NodeEmpty.active = true;
        }

        if (opts?.title1) {
            this.LabelTitle1.string = opts.title1;
        }
        if (opts?.title2) {
            this.LabelTitle2.string = opts.title2;
        }
    }

    private onRenderItem1(node: cc.Node, index: number) {
        node.scale = 0.85;
        node.getComponent(ItemIcon).setData(this.items1[index], { needNum: true });
    }
    private onRenderItem2(node: cc.Node, index: number) {
        node.scale = 0.85;
        node.getComponent(ItemIcon).setData(this.items2[index], { needNum: true });
    }

    // eslint-disable-next-line max-len
    public static Show(
        items1: ItemModel[],
        items2: ItemModel[],
        opts?: { btnFunc?: () => void, btnName?: string, title1?: string, title2?: string, nullTip1?: string, nullTip2?: string },
    ): void {
        WinMgr.I.open(ViewConst.MaterialRewardScanWin, items1, items2, opts);
    }

    public static ShowByRewardString(
        str1: string,
        str2: string,
        opts?: { btnFunc?: () => void, btnName?: string, title1?: string, title2?: string, nullTip1?: string, nullTip2?: string },
    ): void {
        const items1: ItemModel[] = [];
        const items2: ItemModel[] = [];
        const arr1 = str1.split('|');
        const arr2 = str2.split('|');
        for (let i = 0; i < arr1.length; i++) {
            const str = arr1[i];
            if (str.length > 1) {
                const itmInfo = str.split(':');
                const itemId = Number(itmInfo[0]);
                const itemNum = Number(itmInfo[1]);
                const item = UtilItem.NewItemModel(itemId, itemNum);
                items1.push(item);
            }
        }

        for (let i = 0; i < arr2.length; i++) {
            const str = arr2[i];
            if (str.length > 1) {
                const itmInfo = str.split(':');
                const itemId = Number(itmInfo[0]);
                const itemNum = Number(itmInfo[1]);
                const item = UtilItem.NewItemModel(itemId, itemNum);
                items2.push(item);
            }
        }

        WinMgr.I.open(ViewConst.MaterialRewardScanWin, items1, items2, opts);
    }
}
