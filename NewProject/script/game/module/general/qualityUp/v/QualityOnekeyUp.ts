/*
 * @Author: kexd
 * @Date: 2022-08-24 11:38:22
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\qualityUp\v\QualityOnekeyUp.ts
 * @Description: 一键升品
 */
import { EventClient } from '../../../../../app/base/event/EventClient';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import ListView from '../../../../base/components/listview/ListView';
import { Config } from '../../../../base/config/Config';
import { UtilCurrency } from '../../../../base/utils/UtilCurrency';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { WinCmp } from '../../../../com/win/WinCmp';
import { E } from '../../../../const/EventName';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import OnekeyUpItem from '../../com/OnekeyUpItem';
import { GeneralMsg } from '../../GeneralConst';
import ModelMgr from '../../../../manager/ModelMgr';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../../../i18n/i18n';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { DynamicImage } from '../../../../base/components/DynamicImage';

const { ccclass, property } = cc._decorator;

@ccclass
export default class QualityOnekeyUp extends WinCmp {
    @property(ListView)
    private ListItem: ListView = null;
    @property(DynamicImage)
    private NdCostIcon: DynamicImage = null;
    @property(cc.Label)
    private LabPrice: cc.Label = null;
    @property(cc.Node)
    private BtnUp: cc.Node = null;

    /** 数据列表 */
    private _data: GeneralMsg[][] = [];
    /** 取消的主武将id列表 */
    private _onlyId: string[] = [];
    /** 需要消耗的货币数量 */
    private _costId: number = 0;
    private _costNum: number = 0;

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
    }

    private _isinit: boolean = false;
    protected lateUpdate(dt: number): void {
        if (!this._isinit) {
            this.scheduleOnce(() => {
                this.ListItem.frameByFrameRenderNum = 0;
            }, 0.3);
            this._isinit = true;
        }
    }

    private clk() {
        UtilGame.Click(this.BtnUp, () => {
            const have: number = RoleMgr.I.getCurrencyById(this._costId);
            if (have < this._costNum) {
                WinMgr.I.open(ViewConst.ItemSourceWin, this._costId);
            } else {
                const d: { hasDevelop: boolean, list: GeneralQualityUpParam[] } = this.getSelectedIds();
                if (d && d.list && d.list.length > 0) {
                    if (d.hasDevelop) {
                        const str = i18n.tt(Lang.general_peiyang);
                        ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${str}</c>`, () => {
                            ControllerMgr.I.GeneralController.reqOnekeyQualityUp(d.list);
                            this.close();
                        }, { showToggle: 'QualityOnekeyUp' });
                    } else {
                        ControllerMgr.I.GeneralController.reqOnekeyQualityUp(d.list);
                        this.close();
                    }
                } else {
                    MsgToastMgr.Show(i18n.tt(Lang.general_deputy_none));
                }
            }
        }, this);
    }

    private getSelectedIds(): { hasDevelop: boolean, list: GeneralQualityUpParam[] } {
        let hasDevelop: boolean = false;
        const ids: GeneralQualityUpParam[] = [];
        for (let i = 0; i < this._data.length; i++) {
            // 是否已取消
            const onlyId = this._data[i][0].generalData.OnlyId;
            const index = this._onlyId.indexOf(onlyId);
            if (index >= 0) {
                // console.log('已被取消，跳过');
                continue;
            }
            const deputyIds: string[] = [];
            for (let j = 1; j < this._data[i].length; j++) {
                // 是否有已培养的武将
                if (!hasDevelop && ModelMgr.I.GeneralModel.hasDeveloped(this._data[i][j])) {
                    hasDevelop = true;
                }
                deputyIds.push(this._data[i][j].generalData.OnlyId);
            }
            ids.push({
                MainId: onlyId,
                CostList: deputyIds,
            });
        }
        return { hasDevelop, list: ids };
    }

    private addE() {
        EventClient.I.on(E.General.ClickOnekey, this.uptClickOnekey, this);
    }

    private remE() {
        EventClient.I.off(E.General.ClickOnekey, this.uptClickOnekey, this);
    }

    public init(data: unknown): void {
        if (data && data[0]) {
            this._data = data[0];
            this.ListItem.setNumItems(this._data.length);
            this.uptCost();
        }
    }

    /** 选中或取消某一组一键升品 */
    private uptClickOnekey(isSelected: boolean, onlyId: string) {
        // console.log('选中或取消某一组一键升品----', isSelected, onlyId, this._onlyId);
        const index = this._onlyId.indexOf(onlyId);
        if (isSelected) {
            this._onlyId.splice(index, 1);
        } else if (index < 0) {
            this._onlyId.push(onlyId);
        }
        // console.log('this._onlyId=', this._onlyId);
        this.uptCost();
    }

    private uptCost() {
        let count: number = 0;
        const cfg = Config.Get(Config.Type.Cfg_GeneralQuality);
        for (let i = 0; i < this._data.length; i++) {
            // 是否已取消
            const onlyId = this._data[i][0].generalData.OnlyId;
            const index = this._onlyId.indexOf(onlyId);
            // console.log(i, 'onlyId=', onlyId);
            if (index >= 0) {
                // console.log('已被取消，跳过');
                continue;
            }
            //
            const q = this._data[i][0].generalData.Quality;
            const d: Cfg_GeneralQuality = cfg.getValueByKey(q);
            if (d) {
                const tax = d.Tax.split(':');
                this._costId = +tax[0];
                const num: number = +tax[1];
                count += num;
            }
        }
        this._costNum = count;
        this.LabPrice.string = `${count}`;
        // 不需要变，屏蔽这里
        const costImgUrl: string = UtilCurrency.getIconByCurrencyType(this._costId);
        this.NdCostIcon.loadImage(costImgUrl, 1, true);
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: GeneralMsg[] = this._data[idx];
        const item = node.getComponent(OnekeyUpItem);
        if (data && item) {
            item.setData(data, idx, this._onlyId.indexOf(data[0].generalData.OnlyId) < 0);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
