import { Animation, AnimationClip, Component, EventTouch, js, Label, Layout, Node, Size, Sprite, tween, UITransform, v2, v3, Vec2, Vec3, _decorator } from "cc";
import { EffectManager } from "../../../../scripts/common/EffectManager";
import { Config } from "../../../../scripts/config/Config";
import { CommonYesNo, DetailType, EquipType, EquipWearStatus, FuncType, ItemType, QualityType, ShowSrc } from "../../../../scripts/global/GConst";
import { i18n } from "../../../../scripts/i18n/i18n";
import { BaseView } from "../../../../scripts/ui/base/BaseView";
import Utils from "../../../../scripts/utils/Utils";
import UtilsCC from "../../../../scripts/utils/UtilsCC";
import { UtilsNumber } from "../../../../scripts/utils/UtilsNumber";
import { UtilsResPath } from "../../../../scripts/utils/UtilsResPath";
import UtilsString from "../../../../scripts/utils/UtilsString";
import { BagItemManager } from "../bag/BagItemManger";
import { ItemDataEx } from "../bag/ItemDataEx";

const { ccclass, property } = _decorator;

export class ItemDataDetail {
    itemdata: ItemData = null;
    eqpPos: { [key: number]: EquipPos; } = null;
    EquipDuJins: { [key: number]: EquipDuJin; } = null;
    EquipJL: EquipJingLian = null;

    EquipZh: EquipZhuHun = null;
    dicZhLvInfo: { [key: number]: EquipZhuHunLevelInfo; } = {};
    dicZhSuitInfo: { [key: number]: EquipZhuHunSuitInfo; } = {};

    // roleD: RoleM = null; //玩家信息
    constructor() {

    }
}

interface ShowInfo extends ItemDataDetail {
    /** 物品id */
    id: number,
    iid: number,
    // IId: number, // 继承ItemData

    /** 唯一id */
    onlyId: string,
    // Id: string, // 继承ItemData

    /** 数量，为0表示不显示数量，默认为0 */
    count: number,
    Count: number,
    num: number,
    Num: number,
    // N: number // 继承ItemData

    /**
     * 等级，小于0表示不显示等级，默认为-1
     * 1.不显示等级的情况：以下字段都不设值，或者任意一个字段值设为负数
     * 2.要显示等级的情况：以下字段任意一个设为0，最终根据配置表的等级来显示，如果配置表等级为0，那么也会显示0级
     * 3.要显示自定义等级的情况：以下字段任意一个设为需要显示等级值（大于0的值）
    */
    level: number,
    Lv: number,
    lv: number,
    Level: number,
    lev: number,
    // Lev: number, // 集成ItemData

    /** 展示来源 */
    Src: ShowSrc,
    showFVUp: boolean,
    showSSR: boolean,
    /** 是否需要显示物品名字 */
    needName: boolean,
    /** 是否可点击显示tips */
    needLink: boolean,

    /** exMsg */
    ActId: number;
    Pos: number;
    GroupId: number;
    itemNum: number;
    isGain: boolean;
    func: Function;
}

/** 显示物品数据，继承ItemData和ItemDataDetail */
export interface ShowItemData extends ShowInfo, ItemData {
}

@ccclass('BagItem')
export class BagItem extends BaseView {

    @property(Sprite)
    icon: Sprite;
    @property(Label)
    Level: Label;
    @property(Label)
    num: Label;
    @property(Label)
    itemName: Label;
    @property(Label)
    reborn: Label;
    @property(Node)
    border: Node;
    @property(Sprite)
    micon: Sprite;
    @property(Node)
    sellIcon: Node;
    @property(Sprite)
    awkSp: Sprite;
    @property(Layout)
    stars: Layout;

    /** 唯一id */
    private id: string;
    /** 物品id */
    private iid: number;
    /** 数量 */
    private count: number;
    /** 等级 */
    private level: number;

    private show_info: ShowInfo = undefined;
    private item_data: ItemData = undefined;
    /** 展示来源 */
    private show_src: ShowSrc = ShowSrc.Normall;

    private imgZhunhun = ["img_biaoqian_fan", "img_biaoqian_ling", "img_biaoqian_xian", "img_biaoqian_shen"];
    onLoad() {
    }

    start() {
        this.updateShow();
    }

    updateShow() {
        let show_item_data: ShowItemData = this.getArg('ItemData', true);
        let item_data: ItemData = show_item_data.itemdata ? show_item_data.itemdata : show_item_data;
        this.id = Utils.GetValidValueFromArray([show_item_data.onlyId, item_data.Id, '']);
        this.iid = Utils.GetValidValueFromArray([show_item_data.id, show_item_data.iid, item_data.IId, 0]);
        this.count = Utils.GetValidValueFromArray([show_item_data.count, show_item_data.Count, show_item_data.num, show_item_data.Num, item_data.N]);

        let levels = [show_item_data.level, show_item_data.Lv, show_item_data.lv, show_item_data.Level, show_item_data.lev, -1];
        this.level = Utils.GetValidValueFromArray(levels);

        this.item_data = item_data;
        this.show_info = show_item_data;
        if (this.iid < 0 || this.show_info.GroupId < 0) {
            // 据说是自选奖励使用，暂且空着，后续加上
        }
        this.destroyAllChildByNode(this.icon.node);
        let cfg_item: Cfg_Item = Config.getI(Config.T.Cfg_Item).getDataByKey(this.iid.toString());
        if (!cfg_item) {
            this.node.active = false;
            return;
        }
        this.sellIcon.active = !!cfg_item.SellCon;
        this.showPetAwkSp(cfg_item);
        this.showHpSoulIcon(cfg_item);
        this.showQualityFrame(cfg_item);
        this.showFightValueStatus(cfg_item);
        this.showStar();

        this.setSprite(this.icon, UtilsResPath.getItemIconPath(cfg_item.PicID));
        this.setSSR(this.show_info.showSSR, cfg_item);
        this.setRaity(cfg_item);
        this.showCount();
        this.showName(cfg_item);
        this.showLevel(cfg_item);
        this.showRebornActive(cfg_item);
        if (cfg_item.Type === ItemType.PetPiece || cfg_item.Type === ItemType.BoxItem || cfg_item.Type === ItemType.Sword) {
            this.setPetSP(true);
        } else {
            this.setPetSP(false);
        }

        if (this.show_info.needLink) {
            UtilsCC.setClickEventOnly(this.node, 'on_tips_clicked', this, cfg_item);
        }
    }

    /** 显示数量 */
    showCount() {
        if (this.count > 1) {
            this.num.string = UtilsNumber.ConvertNum(this.count);
            this.num.node.active = true;
        } else {
            this.num.node.active = false;
        }
    }

    showName(cfg_item: Cfg_Item) {
        // if (cfg_item) {
        //     let item = BagItemManager.I.getItem(this.id);
        //     this.itemName.string = item.getOrderKey();
        //     return;
        // }
        if (this.show_info.needName) {
            let _nameStr = "";
            if (cfg_item.Type === ItemType.Equip && cfg_item.EquipType !== EquipType.Fariy && cfg_item.EquipType !== EquipType.Pet) {    //合体装备显示正常名称
                if (cfg_item.ObjType === FuncType.Normall || cfg_item.ObjType === FuncType.RoleEquip || cfg_item.ObjType === FuncType.TianXianQiYuan) {
                    let [reborn, b, lv] = Utils.LevelToLongLevel(cfg_item.Level);
                    if (reborn === 0) {
                        _nameStr = lv + i18n.t('common_ji');
                    } else {
                        _nameStr = reborn + i18n.t('common_zhuan');
                    }
                } else {
                    _nameStr = cfg_item.Level + i18n.t('common_jie');
                }
            } else {
                // if (cfg_item.ObjType === FuncType.PetEquip) {
                // _nameStr = PetEqM.I.getMakeName(this.itemData, cfg_item.Name);
                // } else {
                _nameStr = UtilsString.Clup(cfg_item.Name, 8);
                // }
            }
            Utils.ShowRainBowStr(_nameStr, this.itemName, cfg_item.Quality);
            this.itemName.string = _nameStr;
        } else {
            this.itemName.node.active = false;
        }
    }

    showRebornActive(cfg_item: Cfg_Item) {
        if (cfg_item.Type === ItemType.MaterialIcon && cfg_item.ObjType === FuncType.RoleEquip) {//装备碎片
            this.reborn.node.active = true;
            this.reborn.string = UtilsNumber.ConvertNumber(cfg_item.Reborn) + i18n.t('common_zhuan');
        } else if (cfg_item.Type === ItemType.MaterialIcon && cfg_item.ObjType === FuncType.Normall) {//进阶装备碎片
            this.reborn.node.active = true;
            this.reborn.string = UtilsNumber.ConvertNumber(cfg_item.Level) + i18n.t('common_jie');
        } else if (cfg_item.Type === ItemType.Equip && cfg_item.EquipType === EquipType.Grade) {
            this.reborn.node.active = true;
            this.reborn.string = UtilsNumber.ConvertNumber(cfg_item.Level) + i18n.t('common_jie');
        } else {
            this.reborn.node.active = false;
        }

    }

    /** 显示等级 */
    showLevel(cfg_item: Cfg_Item) {
        if (this.level >= 0) {
            // 之前代码这样判断功能类型的，有点打乱了level的计划
            if (cfg_item.ObjType === FuncType.TianXianQiYuan) {
                this.Level.node.active = true;
                this.Level.string = (this.level || cfg_item.Level || 0).toString();
                return;
            }
        }
        this.Level.node.active = false;
    }

    /** 显示品质框 */
    showQualityFrame(cfg_item: Cfg_Item) {
        let equip_dujins = (this.show_src === ShowSrc.OtherRoleEquipInfo && this.item_data) ? this.show_info.EquipDuJins : null;
        let item = BagItemManager.I.getItem(this.id);
        let bQualityJin = false;
        if (item) {
            bQualityJin = item.isQualityJin(this.show_src, equip_dujins);
        }
        let qualiy = !bQualityJin ? cfg_item.Quality : QualityType.J;

        /** 品质框 */
        this.setSprite(this.node, UtilsResPath.getBorderImg(qualiy));


        //boder特效
        let borderEffId = 0;
        if (bQualityJin) {
            borderEffId = UtilsResPath.getBodrEffectId(QualityType.J);
        } else {
            borderEffId = UtilsResPath.getBodrEffectId(cfg_item.Flash_Quality);
        }
        if (borderEffId > 0) {
            this.destroyAllChildByNode(this.border);
            EffectManager.I.showEffect('e/bag/ui_' + borderEffId, this.border, AnimationClip.WrapMode.Loop, (node) => {
                if (this.item_data) {
                    // this.destroyAllChildByNode(this.border);
                    // this.border.addChild(node);
                    this.setNewActive(this.show_src === ShowSrc.BagView && this.item_data && this.item_data.IsNew == 1);
                }
            });
        } else {
            this.destroyAllChildByNode(this.border);
            //没有特效的情况  检查有没有特效资源 有的话 删除
            //显示“新”
            this.setNewActive(this.show_src === ShowSrc.BagView && this.item_data && this.item_data.IsNew == 1);
        }


    }


    /** 宠物星耀处理 */
    showPetAwkSp(cfg_item: Cfg_Item) {
        let is_awksp = !!(cfg_item.ObjType === FuncType.Pet && cfg_item.Level);
        this.awkSp.node.active = is_awksp;
        if (is_awksp) {
            // 宠物星耀处理
        }
    }

    /** 命魂icon */
    showHpSoulIcon(cfg_item: Cfg_Item) {
        if ((this.item_data || this.show_src === ShowSrc.Zhuhun) && (cfg_item.EquipType === EquipType.Normall || cfg_item.EquipType === EquipType.Suit)) {
            let bDetail = this.show_src === ShowSrc.OtherRoleEquipInfo && this.item_data != null;
            let iData = bDetail ? new ItemDataEx() : BagItemManager.I.getItem(this.id);
            if (bDetail) {
                // let itemCfg = Config.I.GetCfgItem(this.itemData.IId);
                // iData.set({ itemData: this.itemData, cfg_Item: itemCfg });
            }
            if (iData) {
                let zhlvinfo: EquipZhuHunLevelInfo = null;
                if (bDetail) {
                    zhlvinfo = this.show_info.dicZhLvInfo[cfg_item.EquipPart];
                } else {
                    // zhlvinfo = RoleM.I.dicZhLvInfo[item.EquipPart];
                }
                if (this.show_info.Pos === EquipWearStatus.Yes && (zhlvinfo || this.show_src === ShowSrc.Zhuhun)) {
                    let mid = 0;
                    if (this.show_src === ShowSrc.Zhuhun /**&& EqpCSl.I**/) {
                        // mid = EqpCSl.I.MHunId - 1;
                    } else if (zhlvinfo) {
                        mid = zhlvinfo.MingHunID - 1;
                    }
                    if (mid >= 0) {
                        this.micon.node.active = true;
                        this.setSprite(this.micon, 'res/ui/equip/' + this.imgZhunhun[mid]);
                    }
                }
            }
        }
    }

    /** 动态添加星级标识 */
    showStar(star?: number, force: boolean = false) {
        if (Utils.isNullOrUndefined(star)) {
            star = BagItemManager.I.getStar(this.iid, this.item_data.Star);
        }
        this.destroyAllSameNameChild("__star");

        if (star > 0) {
            let list = {};
            for (let i = 0; i < star; i++) {
                if (i > 4) {
                    let j = i % 5;
                    let starId = Math.floor(i / 5);   //什么颜色的星星
                    this.setSprite(list[j], "i/com/b/img_star" + starId);
                    continue;
                }
                let n = new Node();
                let s = n.addComponent(Sprite);
                n.name = "__star";
                let t = n.addComponent(UITransform);

                t.width = 20;
                t.height = 20;
                n.position.set(35, 35 - i * 17);
                s.sizeMode = Sprite.SizeMode.CUSTOM;
                s.type = Sprite.Type.SIMPLE;

                list[i] = s;

                this.setSprite(s, "i/com/b/star2");

                this.node.addChild(n);
            }
            if (force) {
                this.item_data.Star = star;
            }
        }
    }

    /**
     * 动态 添加 “新”
     */
    setNewActive(isShow: boolean = false) {
        let node = this.addNodeOrDestroy('__new', isShow, v3(-35, -35), undefined);
        if (node) {
            this.setSprite(node, "i/com/g/img_font_xin");
            // 缩放动画
            tween(node).to(0.5, { scale: v3(1.5) }).to(0.5, { scale: v3(1) }).repeatForever().start();
        }
    }

    /** 显示战力状态，更好还是更差 */
    showFightValueStatus(cfg_item: Cfg_Item) {
        if (this.show_info.showFVUp && cfg_item.DetailType === DetailType.Equip_2) {
            let fightvalue_gap = BagItemManager.I.compareFightValue2Equiped(this.id);
            if (fightvalue_gap > 0) { // 战力比 此装备低，应该显示 ↑↑↑↑
                this.FVStat(this.node, 1);  // ↑↑↑↑
            } else if (fightvalue_gap < 0) { //战力比当前装备高，显示 下
                this.FVStat(this.node, 2); // ↓↓↓↓↓
            } else { // 相等的情况不显示
                this.FVStat(this.node, 0);
            }
        } else {
            this.FVStat(this.node, 0);
        }
    }
    /**
     * 动态 添加战力大小标识
     * @param parentNode
     * @param state 状态： 0 不显示；1 上；2 下
     */
    FVStat(parentNode: Node, state: number) {
        let fvNode = parentNode.getChildByName('__FV__');
        if (state == 0) {
            if (fvNode) {
                fvNode.active = false;
            }
        } else {
            if (!fvNode) {
                fvNode = new Node();
                fvNode.name = "__FV__";
                parentNode.addChild(fvNode);
            }
            fvNode.position.set(35, 27);
            let t = fvNode.addComponent(UITransform);

            t.width = 27;
            t.height = 42;

            let s = fvNode.addComponent(Sprite);
            s.sizeMode = Sprite.SizeMode.CUSTOM;
            s.type = Sprite.Type.SIMPLE;

            if (state == 2) {
                // Utils.I.setSprite(s, "i/com/g/img_jiangdi");

            } else if (state == 1) {
                this.setSprite(s, "i/com/g/img_tigao");
            } else {
                // Utils.I.setSprite(s, "");
            }
        }
    }

    /**
     * 添加s sr ssr sssr  品质标识
     * @param isShow
     */
    setSSR(isSS: boolean, cfg_item: Cfg_Item) {
        let is_show = isSS;
        if (is_show) {
            let ShowSSRDetailType = [3, 4];
            let ShowSSRObjType = [11161, 11162, 24];
            is_show = (ShowSSRDetailType.indexOf(cfg_item.DetailType) > -1 || (cfg_item.Type != 6 && ShowSSRObjType.indexOf(cfg_item.ObjType) > -1));//显示标识
        }
        let node = this.addNodeOrDestroy('sssr', is_show, v3(42, 35));
        if (node) {
            UtilsCC.setAnchorPoint(node, 1);
            node.scale.set(0.7);
            this.setSprite(node, UtilsResPath.I.getSkinRarity(cfg_item.Quality));
        }
    }

    /**
   * 添加宠物道具稀有度标识
   * @param isShow
   */
    setRaity(cfg_item: Cfg_Item) {
        let is_show = cfg_item && (cfg_item.Type === ItemType.Pet || cfg_item.Type === ItemType.PetPiece);
        let node = this.addNodeOrDestroy('PetR', is_show, v3(52, 35));
        if (node) {
            UtilsCC.setAnchorPoint(node, 1);
            node.scale.set(0.7);

            let rarity: number = Config.getI(Config.T.Cfg_Pet2).selectByKey(cfg_item.DetailId.toString(), 'Rarity');
            let path = UtilsResPath.I.getPetRarity(rarity);
            if (path) {
                this.setSprite(node, path);
            }
        }
    }

    /**
     * 动态 添加 碎片标识”
     */
    setPetSP(isShow: boolean = false) {
        let node = this.addNodeOrDestroy('__PetSP', isShow, v3(-28, 28), undefined);
        if (node) {
            node.setSiblingIndex(3);
            this.setSprite(node, "i/com/g/img_suipian");
        }
    }

    /** 添加节点或者删除节点 */
    addNodeOrDestroy(node_name: string, is_show: boolean = false, pos: Vec3 = v3(0, 0), size: Size = new Size(20, 20)) {
        this.destroyAllSameNameChild(node_name);
        if (is_show) {
            let n = new Node();
            n.name = node_name;
            if (pos) {
                n.position.set(pos.x, pos.y);
            }
            let s = n.addComponent(Sprite);
            let t = n.addComponent(UITransform);
            if (size) {
                t.setContentSize(size);
            }
            s.sizeMode = Sprite.SizeMode.RAW;
            s.type = Sprite.Type.SIMPLE;
            this.node.addChild(n);
            return n;
        }
    }

    /**
     * 删除当前节点下所有 name是 参数的节点
     * @param name
     */
    destroyAllSameNameChild(name: string) {
        if (this.node) {
            this.node.children.forEach((c) => {
                if (c.name === name) {
                    c.destroy();
                }
            });
        }
    }

    /** 清除所有子节点 */
    destroyAllChildByNode(p: Node) {
        if (p) {
            p.children.forEach((c) => {
                c.destroy();
            });
        }
    }

    on_tips_clicked(e: EventTouch, cfg_item?: Cfg_Item) {
        // gm模式
        if (!this.item_data) {
            return;
        }
        if (this.item_data.IsNew === CommonYesNo.Yes) {
            this.setNewActive(false);
            // 通知背包管理把该物品new标识去掉
            console.log('通知背包管理把该物品new标识去掉,iid, id=', this.iid, this.id);
        }
        if (this.iid >= BagItemManager.ItemId.ID_2001 && this.iid <= BagItemManager.ItemId.ID_2004) {
            console.log('走缘戒tips,iid, id=', this.iid, this.id);
            return;
        }

        if (cfg_item.DetailType === DetailType.ShengBei_13 || cfg_item.DetailType === DetailType.JingLing_14) {
            console.log('显示精灵、圣杯tips');
            return;
        }
        if (cfg_item.DetailType === DetailType.LongHun_23 && this.id) {
            console.log('走龙魂tips');
            return;
        }
        if (cfg_item.Type === ItemType.BoxChoose && (cfg_item.GetFunc || cfg_item.UseFunc)) {
            console.log('走保险tips');
            return;
        }
        // if (this.show_info.itemd)
        console.log('显示道具通用tips');
    }
}
