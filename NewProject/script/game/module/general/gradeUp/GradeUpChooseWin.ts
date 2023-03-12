/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-09-23 17:37:05
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gradeUp\GradeUpChooseWin.ts
 * @Description:武将-升阶-选择界面
 *
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import ListView from '../../../base/components/listview/ListView';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import { WinCmp } from '../../../com/win/WinCmp';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';
import GeneralHead from '../com/GeneralHead';
import { ClickType, GeneralMsg } from '../GeneralConst';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../../i18n/i18n';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GradeUpChooseWin extends WinCmp {
    @property(cc.Node)
    private BtnChoose: cc.Node = null;
    @property(cc.Label)
    private LabNum: cc.Label = null;
    @property(ListView)
    private ListHead: ListView = null;

    private _type: number = 0;
    private _curData: GeneralMsg = null;
    private _chooseCost: string[] = [];
    private _generalList: GeneralMsg[] = [];
    private _costNum: number = 0;
    private _choose: boolean = false;

    protected start(): void {
        super.start();
        this.clk();
        this.addE();
    }

    public init(data: unknown): void {
        this._choose = false;
        if (data) {
            this._curData = data[0];
            this._chooseCost = data[1];
            this._costNum = data[2] || 0;
            this._type = data[3] || 0;

            this.uptUI();
        }
    }

    private addE() {
        EventClient.I.on(E.General.GradeChooseHead, this.uptClickHead, this);
        EventClient.I.on(E.BattleUnit.UptUnit, this.uptUI, this);
    }

    private remE() {
        EventClient.I.off(E.General.GradeChooseHead, this.uptClickHead, this);
        EventClient.I.off(E.BattleUnit.UptUnit, this.uptUI, this);
    }

    private clk() {
        UtilGame.Click(this.BtnChoose, () => {
            this._choose = true;
            this.onClose();
        }, this);
    }

    private uptClickHead(onlyId: string) {
        const index = this._generalList.findIndex((v) => v.generalData.OnlyId === onlyId);
        if (index < 0) {
            console.warn('不存在该武将');
        }
        const chooseIndex: number = this._chooseCost.indexOf(onlyId);
        if (chooseIndex < 0) {
            if (this._costNum > this._chooseCost.length) {
                // 优化为走统一接口
                if (!ModelMgr.I.GeneralModel.costSelf(this._generalList[index], index, { showToggle: 'GradeUpLock', tipTogState: false }, this.clickCallback, this)) {
                    this._chooseCost.push(this._generalList[index].generalData.OnlyId);
                }
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.general_grade_max));
            }
        } else {
            this._chooseCost.splice(chooseIndex, 1);
        }
        this.ListHead.updateItem(index);
        this.uptCost();
    }

    private clickCallback(index: number) {
        this._chooseCost.push(this._generalList[index].generalData.OnlyId);
        this.ListHead.updateItem(index);
        this.uptCost();
    }

    /** 一键升品里的副将的排序 */
    private sort(a: GeneralMsg, b: GeneralMsg): number {
        if (!a.cfg || !b.cfg) {
            const indexer = Config.Get(Config.Type.Cfg_General);
            a.cfg = indexer.getValueByKey(a.generalData.IId);
            b.cfg = indexer.getValueByKey(b.generalData.IId);
        }

        // 1.未锁
        if (!a.generalData.Lock && b.generalData.Lock) {
            return -1;
        } else if (a.generalData.Lock && !b.generalData.Lock) {
            return 1;
        }

        // 2.未出战
        if (!a.battlePos && b.battlePos) {
            return -1;
        } else if (a.battlePos && !b.battlePos) {
            return 1;
        }

        // 3.稀有度
        if (a.cfg.Rarity !== b.cfg.Rarity) {
            return b.cfg.Rarity - a.cfg.Rarity;
        }

        // 4.头衔
        if (a.generalData.Title !== b.generalData.Title) {
            return b.generalData.Title - a.generalData.Title;
        }

        // 5.阶级
        if (a.generalData.Grade !== b.generalData.Grade) {
            return b.generalData.Grade - a.generalData.Grade;
        }

        // 6.等级
        if (a.generalData.Level !== b.generalData.Level) {
            return b.generalData.Level - a.generalData.Level;
        }
        return b.generalData.IId - a.generalData.IId;
    }

    private uptUI() {
        this._generalList = ModelMgr.I.GeneralModel.getGeneralListbyIId(this._curData.generalData.IId, this._curData.generalData.OnlyId);
        this._generalList.sort(this.sort);
        this.ListHead.setNumItems(this._generalList.length);
        this.uptCost();
    }

    private uptCost() {
        // const indexer = Config.Get(Config.Type.Cfg_GeneralGradeUp);
        // const curCfg: Cfg_GeneralGradeUp = indexer.getValueByKey(this._curData.cfg.Rarity, this._curData.generalData.Grade + 1) as Cfg_GeneralGradeUp;
        // if (curCfg) {
        //     this._costNum = curCfg.CostNum;
        const color: cc.Color = this._chooseCost.length >= this._costNum ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.RedV);
        this.LabNum.node.color = color;
        this.LabNum.string = `${this._chooseCost.length}/${this._costNum}`;
        // }
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: GeneralMsg = this._generalList[idx];
        const index: number = this._chooseCost.indexOf(data.generalData.OnlyId);
        const isSelected: boolean = index >= 0;
        const item = node.getComponent(GeneralHead);
        if (data && item) {
            item.setData(data, { clickType: ClickType.GradeChoose, isSelected });
        }
    }

    private onClose() {
        WinMgr.I.close(ViewConst.GradeUpChooseWin);
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this._choose) {
            if (this._type === 0) {
                EventClient.I.emit(E.General.UptGradeChoose, this._chooseCost);
            } else if (this._type === 1) {
                EventClient.I.emit(E.General.UptEquipChoose, this._chooseCost);
            }
        }
        this.remE();
    }
}
