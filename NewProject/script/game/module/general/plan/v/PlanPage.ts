/*
 * @Author: kexd
 * @Date: 2022-08-15 16:41:25
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\general\plan\v\PlanPage.ts
 * @Description:武将-布阵
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { ANIM_TYPE } from '../../../../base/anim/AnimCfg';
import ListView from '../../../../base/components/listview/ListView';
import { Config } from '../../../../base/config/Config';
import UtilFunOpen from '../../../../base/utils/UtilFunOpen';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilRedDot from '../../../../base/utils/UtilRedDot';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { FuncId } from '../../../../const/FuncConst';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { EntityUnitType } from '../../../../entity/EntityConst';
import ModelMgr from '../../../../manager/ModelMgr';
import { BeautyInfo } from '../../../beauty/BeautyInfo';
import { BeautyHead } from '../../../beauty/com/BeautyHead';
import { RID } from '../../../reddot/RedDotConst';
import GeneralHead from '../../com/GeneralHead';
import { GeneralMsg, ClickType } from '../../GeneralConst';
import PlanPos from '../com/PlanPos';
import { IPlanMsg, PlanState } from '../PlanConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlanPage extends WinTabPage {
    @property(cc.Node)
    private BtnRelation: cc.Node = null;
    @property(cc.Label)
    private LabBattleFv: cc.Label = null;
    @property(cc.Node)
    private NodePosContent: cc.Node = null;
    @property(ListView)
    private ListHead: ListView = null;
    @property(cc.Node)
    private NodeToggleGroup: cc.Node = null;
    @property(cc.Label)
    private LabelInfo: cc.Label = null;

    @property(cc.Node)
    private NdNull: cc.Node = null;

    private _curData: GeneralMsg = null;
    private _generalList: GeneralMsg[] = [];
    private beautys: BeautyInfo[];
    private _lineup: LineupUnit[] = [];
    private _posLock: string[] = []; // 三个位置的解锁情况
    private _ids: string[]; // 三个位置的出战情况
    /** 当前选中的功能id */
    private selectFuncId: FuncId = FuncId.General;
    /** 选中的id */
    private selectId: string | number;
    /** 显示中的节点，根据id存储 */
    private showNodes: { [id: number | string]: cc.Node } = cc.js.createMap(true);
    private curSelectToggle: cc.Node;
    protected start(): void {
        super.start();
        this.addE();
        this.clk();
        this.initUI();

        const toggleGroupFuncIds = [
            { funcId: FuncId.General, rid: RID.General.Main.Plan.General },
            { funcId: FuncId.Beauty, rid: RID.General.Main.Plan.Beauty },
        ];
        for (let i = 0, n = toggleGroupFuncIds.length; i < n; i++) {
            const child = this.NodeToggleGroup.children[i];
            child.active = UtilFunOpen.canShow(toggleGroupFuncIds[i].funcId);
            UtilGame.Click(child, this.onToggleClicked, this, { customData: toggleGroupFuncIds[i].funcId });
            UtilRedDot.Bind(toggleGroupFuncIds[i].rid, child, cc.v2(56, 13));
        }
        // 默认选中第一个
        this.curSelectToggle = this.NodeToggleGroup.children[0];
    }

    private onToggleClicked(nodeToggle: cc.Node, id: FuncId) {
        if (this.curSelectToggle === nodeToggle) {
            return;
        }
        UtilCocos.SetColor(this.curSelectToggle.getChildByName('Label'), UtilColor.SelectColor);
        UtilCocos.SetColor(nodeToggle.getChildByName('Label'), UtilColor.SelectColor);
        this.curSelectToggle = nodeToggle;
        this.selectFuncId = id;
        this.uptUI();
        this.LabelInfo.node.parent.active = this.selectFuncId === FuncId.General;
    }

    private getPos(idx: number) {
        const firstNode = this.NodePosContent.children[0];
        const offsetX = this.NodePosContent.children[1].x - firstNode.x;
        const offsetY = this.NodePosContent.children[1].y - firstNode.y;
        const pos: cc.Vec2 = cc.v2(0, 0);
        pos.x = firstNode.x + offsetX * (idx % 5) + Math.floor(idx / 5) * 60;
        pos.y = firstNode.y + offsetY * (idx % 5) - Math.floor(idx / 5) * 125;
        return pos;
    }

    private getPlanPosData(unitType: EntityUnitType, pos: number) {
        /** 解锁条件描述 */
        let lockStr: string;
        /** 模型资源id */
        let resId: string;
        /** 按钮红点 */
        let btnRed: boolean = false;
        /** 按钮状态 */
        let btnState: PlanState = PlanState.None;

        /** 模型资源类型 */
        const resType: ANIM_TYPE = ANIM_TYPE.PET;
        let title = '';
        // 布阵界面，武将实际位置是2，3，4，要显示成1，2，3
        if (pos >= 2 && pos <= 4) {
            title = `${pos - 1}`;
        }
        const rData: IPlanMsg = {
            planType: unitType,
            pos,
            selectFuncId: this.selectFuncId,
            title,
        };
        let fv: number = 0;
        let selectFv: number = 0;
        const onlyId: string = ModelMgr.I.PlanModel.getOnlyIdByPos(pos, ModelMgr.I.BattleUnitModel.getBattleLineup(unitType));
        switch (unitType) {
            case EntityUnitType.General:
                lockStr = ModelMgr.I.PlanModel.checkGeneralPosLock(pos);
                resId = this.getGeneralResId(onlyId);
                fv = this.getFv(unitType, onlyId);
                selectFv = this.getFv(unitType, this.selectId as string);
                btnState = ModelMgr.I.PlanModel.getBtnState(!!lockStr, onlyId, this.selectId as string);
                btnRed = ModelMgr.I.PlanModel.getBtnRed(btnState, fv, selectFv, this.selectId as string);
                break;
            case EntityUnitType.Beauty:
                lockStr = UtilFunOpen.getLimitMsg(FuncId.Beauty, true);
                resId = Config.Get(Config.Type.Cfg_Beauty).getValueByKey(+onlyId, 'AnimId');
                fv = this.getFv(unitType, onlyId);
                selectFv = this.getFv(unitType, this.selectId.toString());
                break;
            default:
                break;
        }

        rData.fv = fv;
        rData.selectFv = selectFv;
        rData.onlyId = onlyId;
        rData.resId = resId;
        rData.isLock = !!lockStr;
        rData.lockStr = lockStr;
        rData.resType = resType;
        rData.btnRed = btnRed;
        rData.selectId = this.selectId as string;
        return rData;
    }

    private getGeneralResId(onlyId: string) {
        const gData: GeneralMsg = ModelMgr.I.GeneralModel.generalData(onlyId);
        if (gData) {
            if (!gData.cfg) {
                gData.cfg = Config.Get(Config.Type.Cfg_General).getValueByKey(gData.generalData.IId);
            }
            return ModelMgr.I.GeneralModel.getGeneralResByData(gData);
        }
        return undefined;
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
    }

    private addE() {
        EventClient.I.on(E.BattleUnit.UptUnit, this.uptUI, this);
        EventClient.I.on(E.General.PlanHead, this.uptClickHead, this);
    }

    private remE() {
        EventClient.I.off(E.BattleUnit.UptUnit, this.uptUI, this);
        EventClient.I.off(E.General.PlanHead, this.uptClickHead, this);
    }

    private clk() {
        UtilGame.Click(this.BtnRelation, () => {
            //
        }, this);
    }

    /** 初始化 */
    private initUI() {
        this.uptList(true);
        this.initPos();
        this.uptTotalFv();
    }

    private initPos() {
        const firstNode = this.NodePosContent.children[0];
        const tmpNode = cc.instantiate(firstNode);
        const cfgFPos = Config.Get(Config.Type.Cfg_FightPos);
        const posIndexs: number[] = cfgFPos.getValueByKey(0);
        /** 是否隐藏了第三排 */
        let isHideThirdrow: boolean = false;
        for (let pos = 11; pos <= 15; pos++) {
            const cfg = cfgFPos.getValueByIndex(posIndexs[pos], { Pos: 0, UnitType: 0 });
            if (cfg.Pos >= 11 && cfg.UnitType > EntityUnitType.None) {
                isHideThirdrow = true;
            }
        }

        ResMgr.I.loadLocal(UI_PATH_ENUM.Module_General_Plan_PlanPos, cc.Prefab, (e, p: cc.Prefab) => {
            // eslint-disable-next-line @typescript-eslint/no-for-in-array
            for (const pos in posIndexs) {
                const i = +pos;
                const cfg = cfgFPos.getValueByIndex(i, { Pos: 0, UnitType: 0 });
                if (isHideThirdrow && cfg.Pos >= 11) {
                    break;
                }
                let child = this.NodePosContent.children[i];
                if (!child) {
                    child = cc.instantiate(tmpNode);
                    this.NodePosContent.addChild(child);
                    child.setPosition(this.getPos(i));
                }
                const hasType = cfg.UnitType >= 0;
                if (hasType || (isHideThirdrow && cfg.Pos === 8)) {
                    const node = cc.instantiate(p);
                    child.addChild(node);
                    let data: IPlanMsg;
                    if (hasType) {
                        data = this.getPlanPosData(cfg.UnitType, cfg.Pos);
                    } else {
                        data = this.getPlanPosData(EntityUnitType.Player, cfg.Pos);
                    }
                    node.getComponent(PlanPos).setData(data);
                }
            }
        });
    }

    /** 出战有变化后的刷新 */
    private uptUI(pos?: number, onlyId?: string, type?: EntityUnitType) {
        // console.log('----- 出战有变化后的刷新 uptUI-----');
        this.uptList();
        this.NodePosContent.children[pos - 1]?.getChildByName('PlanPos')?.getComponent(PlanPos)?.setData(this.getPlanPosData(type, pos));
        this.uptTotalFv();
    }

    /**
     * 更新显示头像列表
     * @param isInit 是否初始化
     */
    private uptList(isInit: boolean = false): void {
        this.ListHead.content.destroyAllChildren();
        this.ListHead.content.removeAllChildren();
        switch (this.selectFuncId) {
            case FuncId.General:
                this.showGeneralHeadList(isInit);
                break;
            case FuncId.Beauty:
                this.showBeautyHeadList(isInit);
                break;
            default:
                break;
        }
    }

    /**
     * 显示武将头像
     * @param isInit 是否初始化
     * @returns
     */
    private showGeneralHeadList(isInit: boolean = false) {
        // 出战列表
        this._lineup = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.General);
        // 三个位置解锁情况
        this._posLock = ModelMgr.I.PlanModel.checkGeneralPosLock();
        // 三个位置的出战情况
        this._ids = ModelMgr.I.PlanModel.getPosOnly(this._lineup);

        // console.log('-----uptList-----', this._lineup, this._ids);
        this.clearSelectId();
        this._generalList = ModelMgr.I.GeneralModel.getGeneralListByRarity(0);
        if (!this._generalList || this._generalList.length === 0) {
            this.updateSelectId('0');
            return;
        }
        this._generalList.sort(ModelMgr.I.GeneralModel.sort);
        // 选中哪个武将
        let index: number = 0;
        if (isInit) {
            if (!ModelMgr.I.GeneralModel.curOnlyId) {
                ModelMgr.I.GeneralModel.curOnlyId = this._generalList[0].generalData.OnlyId;
            }
            this._curData = ModelMgr.I.GeneralModel.curData;
            index = this._generalList.findIndex((v) => v.generalData.OnlyId === this._curData.generalData.OnlyId);
        } else {
            index = this.autoSelect();
            if (index >= this._generalList.length) {
                index = 0;
            }
            this._curData = this._generalList[index];
        }
        this.updateSelectId(this._curData.generalData.OnlyId);
        ResMgr.I.loadLocal(UI_PATH_ENUM.Module_General_Com_GeneralPlanHead, cc.Prefab, (e, p: cc.Prefab) => {
            this.showNodes = cc.js.createMap(true);
            this.ListHead.setTemplateItem(p);
            this.ListHead.setNumItems(this._generalList.length, index);
            this.NdNull.active = this._generalList.length <= 0;
        });
    }

    /** 清空选中的id */
    private clearSelectId() {
        this.selectId = 0;
    }

    /**
     * 更新选中的id
     * @param id 选中的id
     */
    private updateSelectId(id: string) {
        this.selectId = id;
        this.NodePosContent.children.forEach((child) => {
            if (child.active) {
                const selectFv = this.getFv(EntityUnitType[FuncId[this.selectFuncId]], id);
                child.getChildByName('PlanPos')?.getComponent(PlanPos)?.updateSelectId(this.selectFuncId, this.selectId as string, selectFv);
            }
        });
    }

    private getFv(unitType: EntityUnitType, id?: string): number {
        id = id || this.selectId as string;
        let selectFv = 0;
        switch (unitType) {
            case EntityUnitType.General:
                selectFv = id ? ModelMgr.I.GeneralModel.generalData(id)?.generalData?.Fv : 0;
                break;
            case EntityUnitType.Beauty:
                selectFv = id ? ModelMgr.I.BeautyModel.getBeauty(+id)?.fightValue : 0;
                break;
            default:
                break;
        }
        return selectFv || 0;
    }

    /**
     * 显示红颜头像列表
     * @param isInit
     */
    private showBeautyHeadList(isInit: boolean = false) {
        this.beautys = ModelMgr.I.BeautyModel.getSortActiveBeautys(true);
        this.updateSelectId(this.beautys[0]?.BeautyId?.toString());
        ResMgr.I.loadLocal(UI_PATH_ENUM.Module_Beauty_Com_BeautyHead, cc.Prefab, (e, p: cc.Prefab) => {
            this.showNodes = cc.js.createMap(true);
            this.ListHead.setTemplateItem(p);
            this.ListHead.setNumItems(this.beautys.length);
            this.NdNull.active = this.beautys.length <= 0;
        });
    }

    /** 头像列表渲染事件 */
    private onRenderList(node: cc.Node, idx: number): void {
        switch (this.selectFuncId) {
            case FuncId.General:
                this.renderGeneralList(node, idx);
                break;
            case FuncId.Beauty:
                this.renderBeautyList(node, idx);
                break;
            default:
                break;
        }
    }

    /**
     * 渲染武将头像
     * @param node 节点
     * @param idx 索引
     */
    private renderGeneralList(node: cc.Node, idx: number) {
        const data: GeneralMsg = this._generalList[idx];
        const isSelected = this.selectId === data.generalData.OnlyId;
        const isRed = ModelMgr.I.PlanModel.isPlanRed(data, this._ids, this._posLock);
        const item = node.getComponent(GeneralHead);
        if (data && item) {
            item.setData(data, { isRed, clickType: ClickType.Plan, isSelected });
        }
        this.showNodes[data.generalData.OnlyId] = node;
    }

    /**
     * 渲染红颜头像
     * @param node 节点
     * @param idx 索引
     */
    private renderBeautyList(node: cc.Node, idx: number) {
        const data: BeautyInfo = this.beautys[idx];
        const item = node.getComponent(BeautyHead);
        if (data && item) {
            item.setData(data.BeautyId, this.onSelectBeautyCallback, { target: this });
            item.select = +this.selectId === data.BeautyId;
        }
        const curFv = this.getFv(EntityUnitType.Beauty, data.BeautyId.toString());
        // const selectFv = this.getFv(EntityUnitType.Beauty, this.selectId.toString());
        this.showNodes[data.BeautyId] = node;

        const lineup = ModelMgr.I.BattleUnitModel.getBattleLineup(EntityUnitType.Beauty);

        const isNeedShowRed = lineup.length <= 0;
        UtilRedDot.UpdateRed(node, isNeedShowRed && idx === 0, cc.v2(44, 52));
    }

    /**
     * 选中红颜头像
     * @param id 红颜id
     */
    private onSelectBeautyCallback(id: number) {
        const s = this.showNodes[this.selectId]?.getComponent(BeautyHead);
        if (s) {
            s.select = false;
        }
        const news = this.showNodes[id]?.getComponent(BeautyHead);
        if (news) {
            news.select = true;
        }
        this.updateSelectId(id.toString());
    }

    private uptTotalFv() {
        const fv = ModelMgr.I.PlanModel.getLineupTotalFv();
        this.LabBattleFv.string = `${fv}`;
    }

    /**
     * 自动选中哪个武将:
     * 1. 未出战中存在比出战战力高的，选中最高的(x)
     * 2. 未出战中没有比出战战力高的，选中最高的(x)
     * 上面是策划写的，是错的。真实的应该是：刚打开，选的是主界面选中的；有刷新就自动选中第一个未出战的。
     */
    private autoSelect(): number {
        return this._lineup.length;
    }

    /**
     * 选中武将头像
     * @param onlyId 武将id
     */
    private uptClickHead(onlyId: string) {
        const oldIndex = this._generalList.findIndex((v) => v.generalData.OnlyId === this.selectId);
        const index = this._generalList.findIndex((v) => v.generalData.OnlyId === onlyId);
        if (oldIndex === index) { return; }
        this._curData = this._generalList[index];
        this.updateSelectId(this._curData.generalData.OnlyId);
        this.ListHead.getItemByListId(index)?.getComponent(GeneralHead).setSelectActive(true);
        this.ListHead.getItemByListId(oldIndex)?.getComponent(GeneralHead).setSelectActive(false);
    }
    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
