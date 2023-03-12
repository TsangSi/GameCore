/*
 * @Author: zs
 * @Date: 2022-12-01 18:05:19
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\v\CollectionBookPerson.ts
 * @Description:
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilBool } from '../../../../app/base/utils/UtilBool';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { EAttrType } from '../../../base/attribute/AttrConst';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { ItemType } from '../../../com/item/ItemConst';
import { TabContainer } from '../../../com/tab/TabContainer';
import { TabData } from '../../../com/tab/TabData';
import { TabItem } from '../../../com/tab/TabItem';
import { E } from '../../../const/EventName';
import { RID } from '../../reddot/RedDotConst';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { ECollectionBookTabId } from '../CollectionBookConst';
import CollectionBookPersonItem from '../com/CollectionBookPersonItem';
import CollectionBookPageBase from './CollectionBookPageBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectionBookPerson extends CollectionBookPageBase {
    @property(TabContainer)
    private tabContainer: TabContainer = null;
    @property(cc.ToggleContainer)
    private ToggleContainer: cc.ToggleContainer = null;
    @property(cc.Label)
    private LabelAttack: cc.Label = null;
    @property(cc.Label)
    private LabelDef: cc.Label = null;
    @property(cc.Label)
    private LabelHp: cc.Label = null;
    @property(cc.Label)
    private LabelFight: cc.Label = null;
    public init(winId: number, param: any[], tabIdx: number, tabId?: number): void {
        super.init(winId, param, tabIdx, tabId);
        this.refreshPage(winId, param, tabIdx, tabId);
        EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.WONDER_CARD}`, this.onItemChangeWonder, this);
        EventClient.I.on(`${E.Bag.ItemChangeOfType}${ItemType.PERSON_CARD}`, this.onItemChangePerson, this);
    }

    public refreshPage(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        this.tabIdx = tabIdx;
        this.tabId = tabId;
        this.bigType = tabId;
        this.subType = 0;
        const subTypes = this.cfgBook.getSubTypesByClass(this.bigType);
        this.getRedQuality();
        // this.subType = subTypes[0] || 0;
        if (this.subType) {
            const subPages: TabData[] = [];
            subTypes.forEach((subType, index) => {
                subPages.push({
                    id: subType,
                    title: this.cfgBook.getSubTypeName(subType),
                    redId: this.getSubTypeRid(index),
                });
            });
            this.tabContainer.setData(subPages, this.subType);
        }
    }
    /** 底部tab选中事件 */
    private tabClickEvents(item: TabItem) {
        this.clearData();
        const data = item.getData();
        this.subType = data.id;
        this.saveQualitys();
        this.selectQuality = this.getRedQuality() || this.qualitys[0];
        this.showQualitys();
        this.showItems();
        this.updateScore(false);
    }

    /** 有红点的品质列表 */
    private hasRedQualitys: number[] = [];
    protected getRedQuality(): number {
        const subTypes = this.cfgBook.getSubTypesByClass(this.bigType);
        this.hasRedQualitys.length = 0;
        // if (isAll) {
        subTypes.forEach((subType, index) => {
            const status = this.updateSubTypeRed(subType, index);
            if (status && this.subType === 0) {
                this.subType = subType;
            }
        });
        if (this.subType === 0) {
            this.subType = subTypes[0];
        }
        // } else {
        //     this.updateSubTypeRed(this.subType, subTypes.indexOf(this.subType));
        // }
        return this.hasRedQualitys[0] || 0;
    }

    /**
     * 获取子类型红点id
     * @param subIndex 子类型索引
     * @returns
     */
    private getSubTypeRid(subIndex: number) {
        if (this.bigType === ECollectionBookTabId.Person) {
            return RID.More.CollectionBook.Person.SubType + subIndex;
        } else {
            return RID.More.CollectionBook.Wonder.SubType + subIndex;
        }
    }

    private updateSubTypeRed(subType: number, subIndex: number) {
        let status = false;
        const rid = this.getSubTypeRid(subIndex);
        let c: Cfg_CollectionBook;
        const indexs = this.cfgBook.getIndexsByClass(this.bigType, subType);
        for (let i = 0, n = indexs.length; i < n; i++) {
            c = this.model.getCfg().getValueByIndex(indexs[i]);
            if (this.model.isCanShowRed(c.Id)) {
                status = true;
                if (subType === this.subType) {
                    if (this.hasRedQualitys.indexOf(c.Quality) < 0) {
                        this.hasRedQualitys.push(c.Quality);
                    }
                } else {
                    continue;
                }
            }
        }
        RedDotMgr.I.updateRedDot(rid, status);
        return status;
    }

    protected showQualitys(): void {
        const content = this.ToggleContainer.node;
        for (let i = 0, n = Math.max(content.childrenCount, this.qualitys.length); i < n; i++) {
            if (!UtilBool.isNullOrUndefined(this.qualitys[i])) {
                const child = content.children[i] || cc.instantiate(content.children[0]);
                UtilCocos.SetString(child, 'Label', UtilColor.GetQualityShortName(this.qualitys[i]));
                if (!content.children[i]) {
                    content.addChild(child);
                }
                child.targetOff(this);
                UtilGame.Click(child, this.onToggle, this, { customData: this.qualitys[i] });
                child.getComponent(cc.Toggle).isChecked = this.qualitys[i] === this.selectQuality;
                UtilRedDot.UpdateRed(child, this.hasRedQualitys.indexOf(this.qualitys[i]) >= 0, cc.v2(24, 7));
            } else {
                content.children[i]?.destroy();
            }
        }
    }
    protected onNewActive(): void {
        super.onNewActive();
        this.checkNextRedQuality();
    }

    protected onUpdateStar(): void {
        super.onUpdateStar();
        this.checkNextRedQuality();
    }

    private checkNextRedQuality() {
        const indexs = this.getShowIndexs();
        let needChangeQuality = true;
        for (let i = 0, n = indexs.length; i < n; i++) {
            const c: Cfg_CollectionBook = this.model.getCfg().getValueByIndex(indexs[i]);
            if (this.model.isCanShowRed(c.Id)) {
                needChangeQuality = false;
                break;
            }
        }
        if (needChangeQuality) {
            const toggleIndex = this.qualitys.indexOf(this.selectQuality);
            const node = this.ToggleContainer.node.children[toggleIndex];
            if (node) {
                UtilRedDot.UpdateRed(node, false);
            }
            const index = this.hasRedQualitys.indexOf(this.selectQuality);
            if (index >= 0) {
                this.hasRedQualitys.splice(index, 1);
            }
            if (this.hasRedQualitys.length > 0) {
                const quality = this.hasRedQualitys[0];
                this.onToggle(undefined, quality);
                const toggleIndex = this.qualitys.indexOf(quality);
                const node = this.ToggleContainer.node.children[toggleIndex];
                if (node) {
                    const toggle = node.getComponent(cc.Toggle);
                    if (toggle) {
                        toggle.isChecked = true;
                    }
                }
            }
        }
    }

    private onToggle(node: cc.Node, quality: number) {
        this.selectQuality = quality;
        this.showItems();
    }

    private onRenderItem(node: cc.Node, index: number) {
        node.getComponent(CollectionBookPersonItem).setData(this.getShowIndex(index));
    }

    protected updateAttr(): void {
        let c: Cfg_CollectionBook;
        // eslint-disable-next-line max-len
        const attr = new AttrInfo();
        this.LabelHp.string = '0';
        this.LabelAttack.string = '0';
        this.LabelDef.string = '0';

        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const index in this.indexActives) {
            if (this.indexActives[index]) {
                c = this.model.getCfg().getValueByIndex(+index);
                const tmpAttr = this.model.getAttrById(c.Id);
                if (tmpAttr) {
                    attr.add(tmpAttr);
                }
            }
        }
        for (let i = 0, n = attr.attrs.length; i < n; i++) {
            const type = attr.attrs[i].attrType;
            if (type === EAttrType.Attr_1) {
                this.LabelHp.string = `${attr.attrs[i].value}`;
            } else if (type === EAttrType.Attr_2) {
                this.LabelAttack.string = `${attr.attrs[i].value}`;
            } else if (type === EAttrType.Attr_3) {
                this.LabelDef.string = `${attr.attrs[i].value}`;
            }
        }
        this.LabelFight.string = UtilNum.ConvertFightValue(attr.fightValue);
    }

    private onItemChangeWonder() {
        if (this.bigType === ECollectionBookTabId.Wonder) {
            this.getRedQuality();
            this.showQualitys();
        }
    }

    private onItemChangePerson() {
        if (this.bigType === ECollectionBookTabId.Person) {
            this.getRedQuality();
            this.showQualitys();
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.WONDER_CARD}`, this.onItemChangeWonder, this);
        EventClient.I.off(`${E.Bag.ItemChangeOfType}${ItemType.PERSON_CARD}`, this.onItemChangePerson, this);
    }
}
