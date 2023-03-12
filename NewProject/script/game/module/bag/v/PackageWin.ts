/*
 * @Author: dcj
 * @Date: 2022-11-02 12:21:59
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\bag\v\PackageWin.ts
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import ItemModel from '../../../com/item/ItemModel';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import { PackageGrid } from './PackageGrid';

const { ccclass, property } = cc._decorator;
@ccclass
export class PackageWin extends WinCmp {
    @property(ListView)
    private list: ListView = null;
    @property(cc.Node)
    private NdContent: cc.Node = null;
    @property(cc.Node)
    private BtnOneKey: cc.Node = null;

    private _source: ItemModel[] = [];
    private _Nddesc: cc.Node = null;
    private _cb: () => void;// 点击领取回调
    /** 包裹填充数量，暂定100 */
    private _bakNum: number = 100;
    public get bakNum(): number {
        return this._bakNum;
    }
    public set bakNum(v: number) {
        this._bakNum = v;
    }
    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnOneKey, () => {
            if (this._source.length === 0) {
                MsgToastMgr.Show(i18n.tt(Lang.package_null));
                return;
            }
            if (this._cb) {
                this._cb();
                this.close();
            }
        }, this);
        EventClient.I.on(E.Package.UptPackage, this.upContent, this);
    }

    public init(param: unknown): void {
        super.init(param);
        this._Nddesc = this.NdContent.getChildByName('LabVal');
        const _items: ItemModel[] = param[0] ? param[0] : [];
        this._cb = param[1] ? param[1] : null;
        this.upContent(_items);
    }

    private scrollEvent(nd: cc.Node, idx: number) {
        const item = nd.getComponent(PackageGrid);
        if (this._source[idx] && item) {
            item.loadIcon(this._source[idx]);
        } else {
            item.clearIcon();
        }
    }

    public upContent(data?: ItemModel[]): void {
        if (data) {
            this._source = data;
        }
        this.list.setNumItems(this.bakNum);
        const RText = this._Nddesc.getComponent(cc.RichText);
        RText.string = `${UtilString.FormatArray(i18n.tt(Lang.package_desc), [this.bakNum, UtilColor.NorV, UtilColor.RedD])}`;
    }

    public clearAll(): void {
        this._source = [];
        this.upContent(this._source);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Package.UptPackage, this.upContent, this);
    }
}
