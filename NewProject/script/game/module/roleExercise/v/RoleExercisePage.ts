/* eslint-disable no-loop-func */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-await-in-loop */
import { EventClient } from '../../../../app/base/event/EventClient';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { AttrInfo } from '../../../base/attribute/AttrInfo';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { NumberFast } from '../../../base/components/NumberFast';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { FuncDescConst } from '../../../const/FuncDescConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RedDotMgr } from '../../reddot/RedDotMgr';
import { RoleMgr } from '../../role/RoleMgr';
import RoleExerciseAttr from './RoleExerciseAttr';
import RoleExerciseItemIcon from './RoleExerciseItemIcon';
import RoleExerciseListItem from './RoleExerciseListItem';

const { ccclass, property } = cc._decorator;
@ccclass
export default class RoleExercisePage extends WinTabPage {
    @property(ListView)
    private listView: ListView = null;

    @property(cc.Label)
    private LabelFightValue: cc.Label = null;

    @property(cc.RichText)
    private LabTip: cc.RichText = null;

    @property(cc.Node)
    private NdTip: cc.Node = null;

    @property(cc.Node)
    private items: cc.Node = null;

    @property(cc.Node)
    private BtnOneKey: cc.Node = null;

    @property(cc.Node)
    private NdAttrContainer: cc.Node = null;

    @property(DynamicImage)
    private SprRole: DynamicImage = null;

    private tipShow: boolean[] = [];

    private itemMgr: cc.Node[] = [];

    private propertyMgr: cc.Node[] = [];

    private redStates: boolean[] = [];

    private isInit: boolean = false;

    protected onLoad(): void {
        super.onLoad();

        EventClient.I.on(E.Bag.ItemChange, this.syncUi, this);

        EventClient.I.on(E.Exercise.syncUi, this.syncUi, this);

        const model = ModelMgr.I.RoleExerciseModel;

        const count = model.getPropertyNum();

        this.listView.setNumItems(count);

        for (let i = 0; i < count; ++i) {
            this.tipShow.push(true);
        }

        let init = 0;

        ControllerMgr.I.RoleExerciseController.reqInfo();

        const initUI = () => {
            UtilGame.Click(this.BtnOneKey, this.onClickOneKey, this);
            this.isInit = true;
            this.syncUi();
        };

        this.initProperty().then(() => {
            if (++init === 2) initUI();
        });

        this.initItem().then(() => {
            if (++init === 2) initUI();
        });

        this.SprRole.loadImage(`texture/roleExercise/UI_Exercise_juese_0${RoleMgr.I.d.Sex}`, 1, true);

        const cfgIndexer = Config.Get(Config.Type.Cfg_ClientMsg);
        const descStr: string = cfgIndexer.getValueByKey(FuncDescConst.RoleExerciseChat, 'MSG');
        this.LabTip.string = descStr;
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Bag.ItemChange, this.syncUi, this);
        EventClient.I.off(E.Exercise.syncUi, this.syncUi, this);
    }

    private syncUi(): void {
        if (this.isInit === false) return;
        const model = ModelMgr.I.RoleExerciseModel;
        const num = model.getPropertyNum();
        this.redStates.length = 0;
        let next = -1;
        /** 计算所有红点 */
        for (let i = 0; i < num; ++i) {
            const red = model.checkCanExercise(i + 1);
            this.redStates.push(red);
            if (next === -1 && red) next = i;
        }
        if (next === -1) next = 0;
        this.listView.updateAll();
        this.selectListItem(this.redStates[this.listView.selectedId] ? this.listView.selectedId : next);
        /** 填充战斗力 */
        const attr = model.calcAllProperty();
        this.LabelFightValue.string = String(attr.fightValue);
        /** 填充属性 */
        for (let i = 1; i <= 8; ++i) {
            const name = i18n.tt(Lang[`com_attr_${i}_name`]);
            let value = 0;
            for (let n = 0; n < attr.attrs.length; ++n) {
                if (attr.attrs[n].attrType === i) {
                    value = attr.attrs[n].value;
                    break;
                }
            }
            this.propertyMgr[i - 1].getComponent(RoleExerciseAttr).setAttr(i, name, String(value));
            console.log(i, name, String(value));
        }
    }

    private async initProperty(): Promise<void> {
        return new Promise((resolve) => {
            const res = ResMgr.I;
            let count = 8;
            for (let i = 0; i < 8; ++i) {
                const root = this.NdAttrContainer;
                res.showPrefabAsync('prefab/module/roleExercise/RoleExerciseAttr', root)
                    .then((node: cc.Node): void => {
                        this.propertyMgr.push(node);
                        if (--count === 0) {
                            resolve();
                        }
                    });
            }
        });
    }

    private async initItem(): Promise<void> {
        return new Promise((resolve) => {
            const res = ResMgr.I;
            let count = this.items.childrenCount;
            for (let i = 0; i < this.items.childrenCount; ++i) {
                const root = this.items.children[i];
                res.showPrefabAsync('prefab/module/roleExercise/RoleExerciseItemIcon', root)
                    .then((node: cc.Node): void => {
                        this.itemMgr.push(node);
                        if (--count === 0) {
                            resolve();
                        }
                    });
            }
        });
    }

    /** 点击一键炼体  */
    private onClickOneKey(): void {
        const type = this.listView.selectedId + 1;
        if (ModelMgr.I.RoleExerciseModel.checkCanExercise(type, true)) {
            ControllerMgr.I.RoleExerciseController.reqExercise(type);
            this.tipShow[this.listView.selectedId] = false;
            this.NdTip.active = false;
        }
    }

    /**
     * 刷新列表
     * @param item 列表项
     * @param idx 索引
     */
    public onRenderList(item: cc.Node, idx: number): void {
        item.targetOff(this);
        item.on(cc.Node.EventType.TOUCH_END, this.selectListItem.bind(this, idx), this);
        item.getComponent(RoleExerciseListItem).setData(idx + 1);
        UtilRedDot.UpdateRed(item, this.redStates[idx], cc.v2(30, 26));
    }

    /** 选择列表Item */
    protected selectListItem(idx: number): void {
        this.listView.selectedId = idx;
        const model = ModelMgr.I.RoleExerciseModel;
        const ary = model.getAllExercises(idx + 1);
        const bag = BagMgr.I;

        this.itemMgr.forEach((node: cc.Node, idx) => {
            const v = ary[idx];
            const num = bag.getItemNum(v.Cost);
            const curLv = model.getExerciseLv(v);
            const maxLv = model.getExerciseMaxLv(v);
            const desc = model.getExerciseDesc(v);
            node.getComponent(RoleExerciseItemIcon).setItem(idx + 1, UtilItem.NewItemModel(v.Cost, num), curLv, maxLv, desc);
        });

        UtilRedDot.UpdateRed(this.BtnOneKey, this.redStates[idx], cc.v2(90, 26));

        this.NdTip.active = this.tipShow[idx];

        console.log('刷新节点', idx);

        console.log('红点状态', this.redStates);
    }
}
