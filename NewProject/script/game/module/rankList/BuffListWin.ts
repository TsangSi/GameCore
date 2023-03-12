import { EventClient } from '../../../app/base/event/EventClient';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { i18n, Lang } from '../../../i18n/i18n';
import ScrollViewMult from '../../base/components/listview/ScrollViewMult';
import { SmallTitle } from '../../com/SmallTitle';
import WinBase from '../../com/win/WinBase';
import { WinCmp } from '../../com/win/WinCmp';
import { E } from '../../const/EventName';
import ModelMgr from '../../manager/ModelMgr';
import { IIncreaseSkillEx } from '../buff/BuffModel';
import { BuffListItem } from './v/BuffListItem';
import { BuffListItemEmpty } from './v/BuffListItemEmpty';

/*
 * @Author: zs
 * @Date: 2023-02-15 21:44:55
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

enum EBuffTimeType {
    /** 时效 */
    Hour,
    /** 永久 */
    Permanent,
}

interface IItem {
    desc: string,
    type: EBuffTimeType,
    nodeName: string,
}

@ccclass
export class BuffListWin extends WinCmp {
    @property(ScrollViewMult)
    private ScrollView: ScrollViewMult = null;
    @property(cc.Prefab)
    private SmallTitle: cc.Prefab = null;
    @property(cc.Prefab)
    private BuffListItem: cc.Prefab = null;
    @property(cc.Prefab)
    private BuffListItemEmpty: cc.Prefab = null;

    private SmallTitleSize: cc.Size;
    private BuffListItemSize: cc.Size;
    private BuffListItemEmptySize: cc.Size;
    private buffs: IIncreaseSkillEx[] = [];

    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.Buff.Update, this.onUpdateBuff, this);
        EventClient.I.on(E.Buff.Del, this.onUpdateBuff, this);
    }

    protected start(): void {
        super.start();
        this.ScrollView.registerNodeGetCall(this.differentItem.bind(this));
        this.ScrollView.registerItemNodeHeightCall(this.itemHeight.bind(this));
        this.updateScrollView();
    }

    private getOrNewNode(name: string) {
        let node = this.ScrollView.getPoolNode(name);
        if (!node) {
            node = cc.instantiate(this[name] as cc.Prefab);
            this[`${name}Size`] = cc.size(node.width, node.height);
        }
        return node;
    }

    private getNodeSize(name: string): cc.Size {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this[`${name}Size`] || cc.size(0, 0);
    }

    private getNodeName(index: number) {
        const data = this.buffs[index];
        if (data.title) {
            return this.SmallTitle.name;
        } else if (data.desc) {
            return this.BuffListItemEmpty.name;
        } else {
            return this.BuffListItem.name;
        }
    }

    /** 复用时选择的itemnode */
    private differentItem(index: number): cc.Node | cc.Prefab {
        return this.getOrNewNode(this.getNodeName(index));
    }

    /** 复用时每个item的高度返回 */
    private itemHeight(index: number): cc.Size {
        const s = this.getNodeSize(this.getNodeName(index));
        // console.log('size=', s);
        return s;
    }

    private onRenderItem(node: cc.Node, data: IIncreaseSkillEx, index: number) {
        // const data = this.buffs[index];
        switch (node.name) {
            case this.SmallTitle.name:
                node.getComponent(SmallTitle).setData(data.title);
                break;
            case this.BuffListItemEmpty.name:
                // str = data.type === EBuffTimeType.Hour ? i18n.tt(Lang.bufflist_item_time_empty) : i18n.tt(Lang.bufflist_item_permanent_empty);
                node.getComponent(BuffListItemEmpty).setData(data.desc);
                break;
            case this.BuffListItem.name:
                node.getComponent(BuffListItem).setData(data);
                break;
            default:
                break;
        }
    }

    private updateScrollView() {
        this.buffs = ModelMgr.I.BuffModel.getAllBuff();
        this.ScrollView.setTemplateItemData(this.buffs);
    }

    private onUpdateBuff() {
        this.updateScrollView();
    }

    protected onDestroy(): void {
        super.onDestroy();

        EventClient.I.off(E.Buff.Update, this.onUpdateBuff, this);
        EventClient.I.off(E.Buff.Del, this.onUpdateBuff, this);
    }
}
