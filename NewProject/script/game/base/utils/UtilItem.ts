/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: kexd
 * @Date: 2022-06-16 15:07:19
 * @Description: 单个道具展示
 *
 */
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { ResMgr } from '../../../app/core/res/ResMgr';
import {
    IItemMsg, ItemQuality, ItemType,
} from '../../com/item/ItemConst';
import ItemModel from '../../com/item/ItemModel';
import { ItemIcon } from '../../com/item/ItemIcon';
import { Config } from '../config/Config';
import { ConfigConst } from '../config/ConfigConst';
import { AttrModel } from '../attribute/AttrModel';
import { UtilGame } from './UtilGame';
import { ConfigItemIndexer } from '../config/indexer/ConfigItemIndexer';
import { IAttrBase } from '../attribute/AttrConst';
import { UtilAttr } from './UtilAttr';
import { AttrInfo } from '../attribute/AttrInfo';
import { i18n, Lang } from '../../../i18n/i18n';
import { BagMgr } from '../../module/bag/BagMgr';
import { ConfigAttributeIndexer } from '../config/indexer/ConfigAttributeIndexer';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { ConfigIndexer } from '../config/indexer/ConfigIndexer';
import { Link } from '../../module/link/Link';
import { GradeMgr } from '../../module/grade/GradeMgr';
import { UtilEquip } from './UtilEquip';
import { FuncId } from '../../const/FuncConst';
import { RES_ENUM } from '../../const/ResPath';
import { UI_PATH_ENUM } from '../../const/UIPath';
import LabelTextScroll from '../components/LabelTextScroll';

export default class UtilItem {
    /** 创建道具 */
    private static creatItem(parent: cc.Node, itemModel: ItemModel, showMsg: IItemMsg, callback?: (itemIcon: ItemIcon) => void) {
        if (!parent || !parent.isValid) return;
        if (!itemModel) return;
        let prefab: string = UI_PATH_ENUM.Com_Item_ItemIcon;
        if (showMsg && showMsg.prefab) prefab = showMsg.prefab;
        if (showMsg?.onlyOne) {
            ResMgr.I.showPrefabOnce(prefab, parent, (err, nd: cc.Node) => {
                if (err) return;
                if (!parent || !parent.isValid) return;

                const itemIcon = nd.getComponent(ItemIcon);
                itemIcon.setData(itemModel, showMsg?.option);

                UtilItem.addGot(nd, showMsg?.needGot, showMsg?.needGotBg);

                if (showMsg?.mark) {
                    UtilItem.addMark(nd, showMsg.mark);
                }

                if (callback) {
                    callback(itemIcon);
                }
            }); // , customData: { itemModel, showMsg }
        } else {
            ResMgr.I.showPrefab(prefab, parent, (err, nd: cc.Node) => {
                if (err) return;
                if (!parent || !parent.isValid) return;

                const itemIcon = nd.getComponent(ItemIcon);
                itemIcon.setData(itemModel, showMsg?.option);

                UtilItem.addGot(nd, showMsg?.needGot, showMsg?.needGotBg);

                if (showMsg?.mark) {
                    UtilItem.addMark(nd, showMsg.mark);
                }

                if (callback) {
                    callback(itemIcon);
                }
            }); // , customData: { itemModel, showMsg }
        }
    }

    /**
     * 生成一个新的道具
     * @param parent 父节点
     * @param data 道具数据
     * @param showMsg 额外参数：隐藏名字，回调等
     */
    public static New(parent: cc.Node, data: ItemModel, showMsg: IItemMsg, callback?: (itemIcon: ItemIcon) => void): void {
        UtilItem.creatItem(parent, data, showMsg, callback);
    }

    /**
     * 检测是否存在道具展示了，存在就只更新，不新生成
     * @param parent 父节点
     * @param data 道具数据
     * @param showMsg 额外参数：隐藏名字，回调等
     */
    public static Show(parent: cc.Node, data: ItemModel, showMsg?: IItemMsg, callback?: (itemIcon: ItemIcon) => void): void {
        // 存在就刷新
        if (parent.children.length > 0) {
            const item = parent.children[0];
            if (item) {
                const itemIcon = item.getComponent(ItemIcon);
                if (itemIcon) {
                    itemIcon.setData(data, showMsg?.option);

                    UtilItem.addGot(item, showMsg?.needGot, showMsg?.needGotBg);

                    if (showMsg?.mark) {
                        UtilItem.addMark(item, showMsg.mark);
                    }

                    if (callback) {
                        callback(itemIcon);
                    }
                }
            }
        } else {
            showMsg = showMsg || cc.js.createMap(true);
            showMsg.onlyOne = true;
            UtilItem.creatItem(parent, data, showMsg, callback);
        }
    }

    public static NewItem(parent: cc.Node, data: ItemData | number, showMsg: IItemMsg): void {
        if (parent.children.length > 0) {
            parent.destroyAllChildren();
            parent.removeAllChildren();
        }
        if (typeof data === 'number') {
            const ItemModel: ItemModel = UtilItem.NewItemModel(data);
            UtilItem.creatItem(parent, ItemModel, showMsg);
        } else {
            const itemData: ItemModel = UtilItem.NewItemModel(data);
            UtilItem.creatItem(parent, itemData, showMsg);
        }
    }
    /** 简易创建个精灵 */
    private static createSprite(par: cc.Node, name: string, size?: cc.Size, opacity?: number): cc.Sprite {
        const node = UtilCocos.NewNode(par, [cc.Sprite]);
        node.name = name;
        node.setPosition(0, 0, 0);
        const sp = node.getComponent(cc.Sprite);
        sp.sizeMode = cc.Sprite.SizeMode.RAW;
        sp.type = cc.Sprite.Type.SLICED;
        if (size) {
            sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sp.node.setContentSize(size);
        }
        sp.node.opacity = opacity || 255;
        return sp;
    }
    /**
     * 添加已领取
     * @param parent
     */
    public static addGot(parent: cc.Node, isShow: boolean, isShowDask?: boolean): void {
        const itemGot = parent.getChildByName('itemGot');
        if (!itemGot) {
            if (isShowDask) {
                const spBg = this.createSprite(parent, 'itemGotBg', cc.size(98, 98), 128);
                UtilCocos.LoadSpriteFrame(spBg, RES_ENUM.Com_Img_Com_Img_Di_11);
            }
            if (isShow) {
                const sp = this.createSprite(parent, 'itemGot');
                UtilCocos.LoadSpriteFrame(sp, RES_ENUM.Com_Font_Com_Font_Zhuangtai_01);
            }
        } else {
            itemGot.active = isShow;
        }
    }

    /**
     * 添加标签：必得、概率
     * @param parent
     */
    public static addMark(parent: cc.Node, type: number): void {
        const imgMark = parent.getChildByName('itemMark');
        // 策划说必得的角标不显示了  || type === 2
        if (type === 1) {
            const markSrc = RES_ENUM.Com_Font_Com_Font_Gailvjiaobiao;

            if (!imgMark) {
                const node = UtilCocos.NewNode(parent, [cc.Sprite]);
                node.name = 'itemMark';
                node.setPosition(-22, 21, 0);
                node.active = true;
                // node.setScale(1.2, 1.2, 1.2);
                const sp = node.getComponent(cc.Sprite);
                sp.sizeMode = cc.Sprite.SizeMode.RAW;
                sp.type = cc.Sprite.Type.SIMPLE;

                UtilCocos.LoadSpriteFrame(sp, markSrc);
            } else {
                imgMark.active = true;
                UtilCocos.LoadSpriteFrame(imgMark.getComponent(cc.Sprite), markSrc);
            }
        } else if (imgMark) {
            imgMark.active = false;
        }
    }

    /**
     * 根据道具ID获取道具配置
     * @param itemId
     * @returns Readonly<Cfg_Item> | undefined
     */
    public static GetCfgByItemId(itemId: number): Readonly<Cfg_Item> | undefined {
        const indexer = Config.Get(Config.Type.Cfg_Item);
        const cfg: Cfg_Item = indexer.getValueByKey(itemId);
        return cfg;
    }

    /**
     * 新建道具数据，不会生成唯一ID，不要存入道具缓存列表
     * @param itemId
     * @param itemNum
     * @returns ItemModel
     */
    public static NewItemModel(data: ItemData): ItemModel;
    public static NewItemModel(itemId: number, itemNum?: number): ItemModel;
    public static NewItemModel(...args: unknown[]): ItemModel {
        const itemModel = new ItemModel();
        if (typeof args[0] === 'number') {
            const itemId = args[0];
            const itemNum = typeof args[1] === 'number' ? args[1] : 1; // 数量默认为1
            itemModel.data = new ItemData({ ItemId: itemId, ItemNum: itemNum });
        } else {
            itemModel.data = args[0] as ItemData;
        }
        itemModel.cfg = this.GetCfgByItemId(itemModel.data.ItemId);
        // if (itemModel.cfg && itemModel.cfg.AttrId) {
        //     itemModel.fightValue = BagMgr.I.getItemFightValue(itemModel);
        // }
        return itemModel;
    }

    /**
     * 获取道具来源配置
     * @param sourceIds
     * @returns Cfg_ItemSource[]
     */
    public static GetCfgItemSources(sourceIds: string): Cfg_ItemSource[] {
        const sources: Cfg_ItemSource[] = [];
        const indexer = Config.Get(Config.Type.Cfg_ItemSource);
        const arr = sourceIds.split('|');
        for (let i = 0, len = arr.length; i < len; i++) {
            const sourceId = Number(arr[i]);
            const cfg: Cfg_ItemSource = indexer.getValueByKey(sourceId);
            if (cfg) sources.push(cfg);
        }
        return sources;
    }

    /**
     * 显示物品来源
     * @param fromId 来源id
     * @param richSource 富文本
     * @param callback 回调
     */
    public static ShowItemSourcesByFromId(fromId: number, richSource: cc.RichText, callback: (ret: boolean) => void, context: any = null): void {
        const cfg: Cfg_ItemSource = Config.Get(Config.Type.Cfg_ItemSource).getValueByKey(fromId);
        richSource.string = `<color=${UtilColor.GreenG}><u>${cfg.Desc}</u></c>`;
        richSource.node.targetOff(richSource);
        UtilGame.Click(richSource.node, () => {
            const isSuccess = Link.To(cfg.FuncId);
            if (callback) {
                callback.call(context, isSuccess);
            }
        }, this);
    }

    /**
     *  根据物品id显示一个来源
     * @param itemId 道具id
     * @param parentNode 显示来源跳转父节点
     * @param callback 回调
     * @param context 回调上下文
     */
    public static ShowSourcesByItemIdOne(itemId: number, richSource: cc.RichText, callback: (ret: boolean) => void, context: any = null): void {
        const itemCfg = UtilItem.GetCfgByItemId(itemId);
        const sourcesArr = UtilItem.GetCfgItemSources(itemCfg.FromID);
        const cfg = sourcesArr[0];
        richSource.string = `<color=${UtilColor.GreenG}><u>${cfg.Desc}</u></c>`;
        richSource.node.targetOff(richSource);
        UtilGame.Click(richSource.node, () => {
            const isSuccess = Link.To(cfg.FuncId);
            if (callback) {
                callback.call(context, isSuccess);
            }
        }, this);
    }

    /**
     *  根据物品id显示多个来源
     * @param itemId 道具id
     * @param parentNode 显示来源跳转父节点
     * @param callback 回调
     * @param context 回调上下文
     */
    public static ShowSourcesByItemIdMulti(itemId: number, parentNode: cc.Node, callback: (ret: boolean) => void, context: any = null): void {
        const itemCfg = UtilItem.GetCfgByItemId(itemId);
        const sourcesArr = UtilItem.GetCfgItemSources(itemCfg.FromID);
        parentNode.destroyAllChildren();
        parentNode.removeAllChildren();
        sourcesArr.forEach((cfg) => {
            const funcId = cfg.FuncId;
            const name = `from_${funcId}`;
            const r: cc.Node = new cc.Node();
            let c = r.getComponent(cc.RichText);
            if (!c) {
                c = r.addComponent(cc.RichText);
            }
            c.fontSize = 24;
            r.height = 30;
            r.name = name;

            if (cfg.Desc) {
                const color = UtilColor.GreenG;
                c.string = `<color=${color}><u>${cfg.Desc}</u></c>`;
                r.active = true;
            } else {
                r.active = false;
            }
            c.node.targetOff(c);
            UtilGame.Click(r, () => {
                const isSuccess = Link.To(funcId);
                if (callback) {
                    callback.call(context, isSuccess);
                }
            }, c);
            parentNode.addChild(r);
        });
    }

    public static GetUseFuncById(funcId: number): Cfg_UseFunc {
        const funcCfg = Config.Get(ConfigConst.Cfg_UseFunc);
        return funcCfg.getValueByKey(funcId);
    }

    /**
     * 根据掉落id获取掉落的道具
     * @param dropId
     */
    public static GetDropItemsById(dropId: number): ItemModel[] {
        let dropItemModels: ItemModel[] = [];
        const dropCfg = Config.Get(ConfigConst.Cfg_Drop);
        const dropCfgIndexs: number[] = dropCfg.getValueByKey(dropId);
        if (dropCfgIndexs) {
            dropCfgIndexs.forEach((idx) => {
                const dropCfgItem: Cfg_Drop = dropCfg.getValueByIndex(idx);
                if (dropCfgItem.DropDataType === 1) { // DropItemId是 道具id
                    const itemModel = UtilItem.NewItemModel(dropCfgItem.DropItemId, 1);
                    dropItemModels.push(itemModel);
                } else if (dropCfgItem.DropDataType === 2) { // DropItemId是 掉落组id
                    // TODO 掉落组客户端目前没有用到 后续完善
                } else if (dropCfgItem.DropDataType === 3) { // DropItemId是 掉落id
                    const arr = this.GetDropItemsById(dropCfgItem.DropItemId);
                    dropItemModels = dropItemModels.concat(arr);
                }
            });
        }
        return dropItemModels;
    }

    /**
     * 解析奖励道具字符串
     * @param str 道具ID:道具数量|道具ID:道具数量
     * @returns ItemModel[]
     */
    public static ParseAwardItems(str: string): ItemModel[] {
        const itemModelList: ItemModel[] = [];
        const arr = str.split('|');
        for (let i = 0, len = arr.length; i < len; i++) {
            const item = arr[i];
            const [itemId, itemNum] = this.ParseItemStr(item);
            const itemModel = this.NewItemModel(itemId, itemNum);
            itemModelList.push(itemModel);
        }
        return itemModelList;
    }

    public static ParseItemStr(str: string): [number, number] {
        const [itemId, itemNum] = str.split(':');
        return [Number(itemId), Number(itemNum)];
    }

    /**
     * 获取道具类型名称
     * @param itemType
     * @returns string
     */
    public static GetItemTypeName(itemType: number): string {
        const indexer = Config.Get(ConfigConst.Cfg_Item_Type);
        return indexer.getValueByKey(itemType, 'Desc');
    }

    /**
     * 获取道具品质背景路径
     * @param quality 道具品质
     * @returns
     */
    public static GetItemQualityBgPath(quality: number): string {
        return `${RES_ENUM.Com_Bg_Com_Bg_Item}${quality}`;
    }
    /**
     * 获取事务列表背景
     * @param quality 道具品质
     * @returns
     */
    public static GetItemQualityTitleBgPath(quality: number): string {
        return `${RES_ENUM.Com_Img_Com_Img_Pinzhitiao}${quality}`;
    }

    /**
     * 获取道具图标路径
     * @param picId 配置图标ID
     * @param sex 性别
     * @returns string
     */
    public static GetItemIconPath(picId: string, sex: number = 1): string {
        // 解析图标ID，可能需要根据性别展示不同图标
        const idsStr = picId.split('|');
        if (idsStr.length > 1 && sex !== 1) {
            picId = idsStr[1];
        } else {
            picId = idsStr[0];
        }
        return `${RES_ENUM.Item}${picId}`;
    }

    /**
     * 根据物品id 获取物品的资源路径
     * @param itemId 物品id
     * @param sex 性别
     * @returns
     */
    public static GetItemIconPathByItemId(itemId: number, sex: number = 1, small: boolean = false): string {
        const item = this.GetCfgByItemId(itemId);
        return this.GetItemIconPath(item.PicID, sex) + (small ? '_h' : '');
    }

    /**
     * 获取道具品质颜色
     * @param quality 道具品质
     * @param isDarkBg 是否暗色背景
     * @returns hex
     */
    public static GetItemQualityColor(quality: number, isDarkBg?: boolean): string {
        switch (quality) {
            case ItemQuality.GREEN: return isDarkBg ? UtilColor.GreenD : UtilColor.GreenD;
            case ItemQuality.BLUE: return isDarkBg ? '#42b7fa' : '#42b7fa';
            case ItemQuality.PURPLE: return isDarkBg ? '#ad2ee9' : '#ad2ee9';
            case ItemQuality.ORANGE: return isDarkBg ? '#ff6c0a' : '#ff6c0a';
            case ItemQuality.RED: return isDarkBg ? '#d53838' : '#d53838';
            case ItemQuality.GOLD: return isDarkBg ? '#d6a600' : '#d6a600';
            case ItemQuality.COLORFUL: return isDarkBg ? UtilColor.ColorFullD : UtilColor.ColorFullN;
            // return isDarkBg ? UtilColor.ColorFullD : UtilColor.ColorFullN;// 需要切换材质
            case ItemQuality.PINK: return isDarkBg ? '#ff6fc0' : '#c64990';
            default: return '#ffffff';
        }
    }

    public static getColorFulColor(): cc.Color[] {
        return [UtilColor.Hex2Rgba(UtilColor.ColorFullN), UtilColor.Hex2Rgba('#3791de')];
    }

    public static GetItemQualityName(quality: number): string {
        return i18n.tt(Lang[`com_quality_${quality}_name`]);
    }

    /**
     * 获取道具品质字图片路径(适用于item内)
     * @param quality 道具品质
     * @param isBig 是否大图
     * @returns string
     */
    public static GetItemQualityFontImgPath(quality: number, isBig?: boolean): string {
        if (isBig) {
            return `${RES_ENUM.Com_Font_Com_Font_Quality_Big}${quality}@ML`;
        }
        return `${RES_ENUM.Com_Font_Com_Font_Quality_Small}${quality}@ML`;
    }

    /**
     * 获取发光特效路径
     * @param quality
     * @returns string
     */
    public static GetItemGlowEffectPath(quality: number): string {
        switch (quality) {
            case ItemQuality.GREEN: return '';
            case ItemQuality.BLUE: return '';
            case ItemQuality.PURPLE: return '';
            case ItemQuality.ORANGE: return '';
            case ItemQuality.RED: return RES_ENUM.Item_Ui_6051;
            case ItemQuality.GOLD: return RES_ENUM.Item_Ui_6061;
            case ItemQuality.COLORFUL: return RES_ENUM.Item_Ui_6071;
            case ItemQuality.PINK: return RES_ENUM.Item_Ui_6081;
            default: return '';
        }
    }

    /**
     * 获取流光特效路径
     * @param quality
     * @returns string
     */
    public static GetItemStreamerEffectPath(quality: number): string {
        switch (quality) {
            case ItemQuality.GREEN: return '';
            case ItemQuality.BLUE: return '';
            case ItemQuality.PURPLE: return '';
            case ItemQuality.ORANGE: return '';
            case ItemQuality.RED: return RES_ENUM.Item_Ui_6052;
            case ItemQuality.GOLD: return RES_ENUM.Item_Ui_6062;
            case ItemQuality.COLORFUL: return RES_ENUM.Item_Ui_6072;
            case ItemQuality.PINK: return RES_ENUM.Item_Ui_6082;
            default: return '';
        }
    }

    public static GetItemLeftFlagPath(flagId: number): string {
        if (!flagId) return ''; // 文件名称做成和id对应形式
        return `${RES_ENUM.Com_Font_Com_Font_Item_Logo}${flagId}@ML`;
    }

    public static GetItemRightFlagPath(flagId: number): string {
        switch (flagId) {
            case ItemQuality.GREEN: // 普通
            case ItemQuality.BLUE: // 稀有
            case ItemQuality.PURPLE: // 卓越
            case ItemQuality.ORANGE: // 极品
            case ItemQuality.RED: // 绝品
            case ItemQuality.GOLD: // 史诗
            case ItemQuality.COLORFUL: // 传说
            case ItemQuality.PINK: // 神话
                return this.GetItemQualityFontImgPath(flagId);
            default: return '';
        }
    }

    public static GetQualityName(flagId: number): string {
        return i18n.tt(Lang[`com_quality_name_${flagId}`]);
    }

    /**
     * 获取装备部位名称
     * @param part
     * @returns string
     */
    public static GetRoleEquipPartName(part: number): string {
        return i18n.tt(Lang[`role_equip_part_${part}_name`]);
    }

    /**
     * 获取战力详情字符串
     * @param itemModel
     * @returns string
     */
    public static GetFightValueDetailStr(itemModel: ItemModel): string {
        let ret = '';
        /** 基础属性信息 */
        const baseAttrId = itemModel.cfg.AttrId;
        let attrInfo: AttrInfo;
        if (baseAttrId) {
            attrInfo = AttrModel.MakeAttrInfo(baseAttrId);
        }
        if (attrInfo?.attrs?.length > 0) {
            ret += `${i18n.tt(Lang.item_tips_base_attr_title)}     ${attrInfo.fightValue}\n`;
        }
        /** 附加属性信息 */
        const addAttr = itemModel.data.AddAttr;
        if (addAttr && addAttr.length > 0) {
            const addAttrInfo = AttrModel.MakeAttrInfo(...addAttr);
            ret += `${i18n.tt(Lang.item_tips_add_attr_title)}     ${addAttrInfo.fightValue}\n`;
        }
        return ret;
    }

    /**
     * 获取装备名称
     * @param itemModel
     * @returns string
     */
    public static GetEquipName(itemModel: ItemModel): string {
        const name = itemModel.cfg.Name;
        let sufixName: string = '';
        let prefix = '';
        const [r, b] = UtilGame.LevelToLong(itemModel.cfg.Level);
        if (r > 0) {
            prefix += `${r}${i18n.jie}`;
            if (b > 0) prefix += `${b}${i18n.tt(Lang.com_star)}`;
        }
        if (itemModel.cfg.Type === ItemType.EQUIP) {
            sufixName = GradeMgr.I.getGoldEquipLevelName(itemModel.cfg.SubType, itemModel.cfg.EquipPart, itemModel.data.OnlyId);
        }
        return prefix + name + sufixName;
    }

    public static GetCfgItemByTPQL(subType: number, equipPart: number, quality: number, level: number): Cfg_Item | null {
        let ret: Cfg_Item;
        const indexer: ConfigItemIndexer = Config.Get(Config.Type.Cfg_Item);
        const indexs = indexer.getIndexsBySubType(subType);
        for (let i = 0, len = indexs.length; i < len; i++) {
            const idx = indexs[i];
            const cfg: Cfg_Item = indexer.getValueByIndex(idx);
            if (equipPart && cfg.EquipPart === equipPart
                && quality && cfg.Quality === quality
                && level && cfg.Level === level) {
                ret = cfg;
                break;
            }
        }
        return ret;
    }

    public static GetItemsAttrBaseList(itemModels: ItemModel[]): AttrInfo {
        const info: AttrInfo = new AttrInfo();

        if (itemModels.length > 0) {
            for (let i = 0; i < itemModels.length; i++) {
                const itemModel = itemModels[i];
                /** 基础属性信息 */
                const baseAttrId = itemModel.cfg.AttrId;
                if (itemModel.cfg.Type === ItemType.EQUIP) {
                    const equipAttrId = UtilEquip.GetEquipAttrId(itemModel.cfg.SubType, itemModel.cfg.EquipPart, itemModel.data.OnlyId);
                    if (equipAttrId) {
                        info.add({ attrs: UtilAttr.GetAttrBaseListById(equipAttrId) });
                    }
                }
                if (baseAttrId) {
                    const list = UtilAttr.GetAttrBaseListById(baseAttrId);
                    info.add({ attrs: list });
                }
                /** 附加属性信息 */
                const addAttr = itemModel.data.AddAttr;
                if (addAttr && addAttr.length > 0) {
                    // 转换成IAttrBase
                    const list: IAttrBase[] = [];
                    addAttr.forEach((intAttr) => {
                        list.push({ attrType: intAttr.K, value: intAttr.V1 });
                    });
                    info.add({ attrs: list });
                }
            }
        }

        return info;
    }

    /**
     * 根据配置信息获取名称+其他
     * 例如 ： 3:100 -> 100元宝
     */
    public static GetItemTipString(str: string): { name: string, num: number } {
        const cfgs = str.split(':');
        if (cfgs.length < 2) {
            return { name: '', num: 0 };
        }
        const itemId = Number(cfgs[0]);
        const item = this.GetCfgByItemId(itemId);
        return {
            name: item.Name,
            num: +cfgs[1],
        };
    }

    /**
     * 根据配置信息获取道具战力信息
     * 例如 ： 2:100 ->
     */
    public static GetItemPower(str: string): number {
        const cfgs = str.split(':');
        if (cfgs.length < 2) {
            return 0;
        }
        const itemId = Number(cfgs[0]);
        const item = this.GetCfgByItemId(itemId);
        const attrIndexer: ConfigAttributeIndexer = Config.Get(Config.Type.Cfg_Attribute);
        return attrIndexer.getFightValueById(item.AttrId);
    }

    /** 根据装备部位id + 所属系统id，获取装备部位名称 */
    public static GetEquipPartName(id: number, sysId: number = 701): string {
        const k = Number(sysId.toString() + id.toString());
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_EquipPartName);
        const cfg: Cfg_EquipPartName = indexer.getValueByKey(k);
        if (cfg && cfg.Name) {
            return cfg.Name;
        }
        return '暂无部位名称';
    }

    /** 获取itemicon 左上角自定义角标路径 */
    public static GetItemIconLeftIconPath(id: number | string): string {
        return `texture/com/font/com_font_${id}@ML`;
    }

    public static ItemNameScrollSet(item: ItemModel, lab: cc.Label, str?: string, isColorLight: boolean = false): void {
        if (!item || !lab || !lab.node) return;
        const text = lab.getComponent(LabelTextScroll);
        if (text) {
            if (typeof str === 'string') {
                text.setText(str);
            }

            if (item.cfg.Quality === ItemQuality.COLORFUL) {
                text.setColorFull(true, isColorLight);
            } else {
                text.setColorFull(false);
                lab.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(item.cfg.Quality, isColorLight));
            }
        }
    }
}
