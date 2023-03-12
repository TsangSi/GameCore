/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-08-17 12:07:27
 * @FilePath: \SanGuo\assets\script\game\module\general\qualityUp\v\QualityUpPreview.ts
 * @Description: 升品预览
 */
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { Config } from '../../../../base/config/Config';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItemList from '../../../../base/utils/UtilItemList';
import UtilObject from '../../../../base/utils/UtilObject';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import { WinCmp } from '../../../../com/win/WinCmp';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { BagMgr } from '../../../bag/BagMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import GeneralHead from '../../com/GeneralHead';
import { GeneralMsg, GeneralQuality } from '../../GeneralConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class QualityUpPreview extends WinCmp {
    @property(cc.Node)
    private BtnUp: cc.Node = null;
    @property(cc.Node)
    private BtnCancel: cc.Node = null;
    @property(cc.Label)
    private LabAtk: cc.Label = null;
    @property(cc.Label)
    private LabAtkNext: cc.Label = null;
    @property(cc.Label)
    private LabDef: cc.Label = null;
    @property(cc.Label)
    private LabDefNext: cc.Label = null;
    @property(cc.Label)
    private LabHp: cc.Label = null;
    @property(cc.Label)
    private LabHpNext: cc.Label = null;
    @property(cc.Label)
    private LabGrow: cc.Label = null;
    @property(cc.Label)
    private LabGrowNext: cc.Label = null;

    @property(GeneralHead)
    private GeneralHead: GeneralHead = null;
    @property(GeneralHead)
    private GeneralHead2: GeneralHead = null;
    @property(cc.Node)
    private NdList: cc.Node = null;

    private _isMedicine: boolean = false;
    private _medicine: string = '';
    private _curData: GeneralMsg = null;
    private _deputyList: GeneralMsg[] = [];
    private _cost: { id: number, num: number }[] = [];

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
    }

    public init(data: unknown): void {
        if (data) {
            this._curData = data[0];
            if (typeof data[1] === 'string') {
                this._medicine = data[1];
                this._isMedicine = true;
            } else {
                this._deputyList = data[1];
                this._isMedicine = false;
            }

            this.uptUI();
        }
    }

    private addE() {
        //
    }

    private remE() {
        //
    }

    private clk() {
        UtilGame.Click(this.BtnUp, () => {
            if (this._isMedicine) {
                if (this.judgeUp()) {
                    ControllerMgr.I.GeneralController.reqQualityUp(this._curData.generalData.OnlyId, this._cost[0].id, []);
                    this.onClose();
                }
            } else {
                const cost = ModelMgr.I.GeneralModel.costMoney(this._curData.generalData.Quality);
                const id = +cost[0];
                const need = +cost[1];
                const have: number = RoleMgr.I.getCurrencyById(id);
                if (have < need) {
                    WinMgr.I.open(ViewConst.ItemSourceWin, id);
                } else {
                    let hasDevelop: boolean = false;
                    const deputyIds: string[] = [];
                    for (let i = 0; i < this._deputyList.length; i++) {
                        if (!hasDevelop && ModelMgr.I.GeneralModel.hasDeveloped(this._deputyList[i])) {
                            hasDevelop = true;
                        }

                        deputyIds.push(this._deputyList[i].generalData.OnlyId);
                    }
                    if (hasDevelop) {
                        // 已培养
                        const str = i18n.tt(Lang.general_peiyang);
                        ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
                            ControllerMgr.I.GeneralController.reqQualityUp(this._curData.generalData.OnlyId, 0, deputyIds);
                            this.onClose();
                        }, { showToggle: 'QualityUpDevelop' });
                    } else {
                        ControllerMgr.I.GeneralController.reqQualityUp(this._curData.generalData.OnlyId, 0, deputyIds);
                        this.onClose();
                    }
                }
            }
        }, this);

        UtilGame.Click(this.BtnCancel, () => {
            this.onClose();
        }, this);
    }

    private uptUI() {
        if (!this._curData.cfg) {
            this._curData.cfg = Config.Get(Config.Type.Cfg_General).getValueByKey(this._curData.generalData.IId);
        }
        let quality = this._curData.generalData.Quality;
        if (quality > GeneralQuality.COLORFUL) {
            quality = GeneralQuality.COLORFUL;
        }
        // 攻击
        this.LabAtk.string = `${this._curData.generalData.MaxAtkTalent}`;
        this.LabAtkNext.string = this._curData.cfg.TalentA_Max.split('|')[quality];
        // 防御
        this.LabDef.string = `${this._curData.generalData.MaxDefTalent}`;
        this.LabDefNext.string = this._curData.cfg.TalentD_Max.split('|')[quality];
        // 生命
        this.LabHp.string = `${this._curData.generalData.MaxHpTalent}`;
        this.LabHpNext.string = this._curData.cfg.TalentH_Max.split('|')[quality];
        // 成长
        this.LabGrow.string = `${(this._curData.generalData.MaxGrow / 10000).toFixed(2)}`;
        this.LabGrowNext.string = (+this._curData.cfg.Grow_Max.split('|')[quality] / 10000).toFixed(2);
        //
        this.GeneralHead.setData(this._curData, { unshowSelect: true });
        const d: GeneralMsg = UtilObject.clone(this._curData);
        d.generalData.Quality += 1;
        this.GeneralHead2.setData(d, { unshowSelect: true });

        // 消耗
        if (this._isMedicine) {
            this.uptCost();
        } else {
            this.uptDeputy();
        }
    }

    private uptCost() {
        const items = this._medicine.split('|');
        for (let i = 0; i < items.length; i++) {
            const item = items[i].split(':');
            const itemId = +item[0];
            const itemNum = +item[1];
            this._cost.push({ id: itemId, num: itemNum });
        }
        // 展示
        UtilItemList.ShowItems(this.NdList, this._medicine, {
            needColor: true, option: { num1Show: true, needNum: true, needName: false },
        }, (item: cc.Node) => {
            const itemIcon = item.getComponent(ItemIcon);
            UtilCocos.SetScale(itemIcon.node, 0.9, 0.9, 0.9);
        });
    }

    private uptDeputy() {
        let tmpNode: cc.Node;
        for (let i = 0; i < this._deputyList.length; i++) {
            tmpNode = cc.instantiate(this.GeneralHead.node);
            this.NdList.addChild(tmpNode);
            tmpNode.active = true;
            UtilCocos.SetScale(tmpNode, 0.9, 0.9, 0.9);
            tmpNode.getComponent(GeneralHead).setData(this._deputyList[i], { unshowSelect: true });
        }
    }

    private judgeUp(): boolean {
        for (let i = 0; i < this._cost.length; i++) {
            const have = BagMgr.I.getItemNum(this._cost[i].id);
            if (have < this._cost[i].num) {
                WinMgr.I.open(ViewConst.ItemSourceWin, this._cost[i].id);
                return false;
            }
        }
        return true;
    }

    private onClose() {
        WinMgr.I.close(ViewConst.QualityUpPreview);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
