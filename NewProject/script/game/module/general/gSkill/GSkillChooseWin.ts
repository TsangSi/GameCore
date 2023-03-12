/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-11-16 14:16:42
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gSkill\GSkillChooseWin.ts
 * @Description: 武将-技能选择
 *
 */

import { UtilGame } from '../../../base/utils/UtilGame';
import ListView from '../../../base/components/listview/ListView';
import { BagMgr } from '../../bag/BagMgr';
import ItemModel from '../../../com/item/ItemModel';
import { EventClient } from '../../../../app/base/event/EventClient';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import { WinCmp } from '../../../com/win/WinCmp';
import GSkillBigItem from '../com/GSkillBigItem';
import UtilGeneral from '../../../base/utils/UtilGeneral';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import ModelMgr from '../../../manager/ModelMgr';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { ESkillQuality } from '../GeneralConst';
import { ItemType } from '../../../com/item/ItemConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class GSkillChooseWin extends WinCmp {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Node)
    protected NdGet: cc.Node = null;
    @property(cc.Node)
    private BtnChoose: cc.Node = null;
    @property(cc.ToggleContainer)
    private TogCon: cc.ToggleContainer = null;
    @property(cc.Toggle)
    private TogHide: cc.Toggle = null;
    @property(cc.Node)
    protected NdNone: cc.Node = null;

    private _skillCommon: GeneralSkill[] = [];
    private _books: ItemModel[] = [];
    private _cur: ItemModel[] = [];
    private _selectItemId: number = 0;
    private _selectSkillId: number = 0;
    private _tab: number = 0;

    protected start(): void {
        super.start();

        this.addE();

        UtilGame.Click(this.BtnChoose, () => {
            if (!this._selectItemId) {
                MsgToastMgr.Show(i18n.tt(Lang.general_skill_unselect));
            }
            if (this.isLearned(this._selectSkillId)) {
                MsgToastMgr.Show(i18n.tt(Lang.general_skill_learn));
                return;
            }

            EventClient.I.emit(E.General.GSkillChoose, this._selectItemId, this._selectSkillId);
            this.onClose();
        }, this);

        UtilGame.Click(this.NdGet, () => {
            ModelMgr.I.GeneralModel.openSource();
        }, this);

        let i = 0; const len = this.TogCon.toggleItems.length;
        for (; i < len; i++) {
            if (this.TogCon.toggleItems[i]) {
                UtilGame.Click(this.TogCon.toggleItems[i].node, (nodeToggle: cc.Node) => {
                    const tab: number = +nodeToggle.name;
                    if (this._tab === tab) {
                        return;
                    }
                    this.onTog(tab);
                }, this);
            }
        }

        UtilGame.Click(this.TogHide.node, () => {
            this.onTog(this._tab);
        }, this);
    }

    private addE() {
        //
    }

    private remE() {
        //
    }

    public init(args: unknown[]): void {
        this._books = BagMgr.I.getParamItems(ItemType.GBook);
        this._skillCommon = args[0] as GeneralSkill[];
        this.onTog(0);
    }

    private getQuality(tab: number): number {
        let quality: number = ESkillQuality.Low;
        if (tab === 1) quality = ESkillQuality.Low;
        else if (tab === 2) quality = ESkillQuality.Mid;
        else if (tab === 3) quality = ESkillQuality.Top;
        return quality;
    }

    /**
     *
     * @param tab
     * @param isRecursion 是否是递归过来的,防范重复递归
     * @returns
     */
    private onTog(tab: number, isRecursion: boolean = false) {
        if (tab === 0) {
            this._cur = this._books;
        } else {
            // 刷选
            const quality = this.getQuality(tab);
            // console.log('tab=', tab, 'quality=', quality);
            this._cur = UtilGeneral.GetSkillBooksByQuality(this._books, quality);
            // 是否有该品质的技能书
            if (tab > 0) {
                if (this._cur.length === 0) {
                    MsgToastMgr.Show(i18n.tt(Lang[`general_skill_no${tab}`]));
                    if (!isRecursion) {
                        this.onTog(this._tab, true);
                    }
                    return;
                }
            }
        }
        // 去掉已学的技能
        this._cur = this.uptHide();
        // 排序
        if (this.TogHide.isChecked) {
            this._cur.sort(this.sort);
        } else {
            const skillCommon = this._skillCommon;
            this._cur.sort((a, b) => {
                const aSkillId = a.cfg.Param;
                const bSkillId = b.cfg.Param;
                const aCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(aSkillId, 1);
                const bCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(bSkillId, 1);
                const aQuality: number = aCfg.Quality;
                const bQuality: number = bCfg.Quality;
                const aId: number = aCfg.SkillId;
                const bId: number = bCfg.SkillId;

                const aIsLearn = skillCommon.findIndex((v) => v.SkillId === aSkillId) >= 0 ? 1 : 0;
                const bIsLearn = skillCommon.findIndex((v) => v.SkillId === bSkillId) >= 0 ? 1 : 0;

                // 未学习- 已学习
                if (aIsLearn !== bIsLearn) {
                    return aIsLearn - bIsLearn;
                }

                // 1. 品质高到低
                if (aQuality !== bQuality) {
                    return bQuality - aQuality;
                }

                // 2. id大到小
                return bId - aId;
            });
        }
        //
        this._selectItemId = 0;
        this._selectSkillId = 0;
        if (this._cur.length > 0) {
            // if (this.TogHide.isChecked) {
            this._selectItemId = this._cur[0].data.ItemId;
            this._selectSkillId = this._cur[0].cfg.Param;
            // } else if (!this.isLearned(this._cur[0].cfg.Param)) {
            //     this._selectItemId = this._cur[0].data.ItemId;
            //     this._selectSkillId = this._cur[0].cfg.Param;
            // }
        }

        this.ListView.setNumItems(this._cur.length);
        this.NdNone.active = this._cur.length === 0;
        this.TogCon.toggleItems[tab].isChecked = true;
        this._tab = tab;
    }

    /** 技能品质排序 */
    private sort(a: ItemModel, b: ItemModel): number {
        const aSkillId = a.cfg.Param;
        const bSkillId = b.cfg.Param;
        const aCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(aSkillId, 1);
        const bCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(bSkillId, 1);
        const aQuality: number = aCfg.Quality;
        const bQuality: number = bCfg.Quality;
        const aId: number = aCfg.SkillId;
        const bId: number = bCfg.SkillId;

        // 1. 品质高到低
        if (aQuality !== bQuality) {
            return bQuality - aQuality;
        }

        // 2. id大到小
        return bId - aId;
    }

    private uptHide() {
        const quality = this.getQuality(this._tab);
        if (this.TogHide.isChecked) {
            const newData: ItemModel[] = [];
            for (let i = 0; i < this._cur.length; i++) {
                const skillId = this._cur[i].cfg.Param;
                const skillQuality: number = UtilSkillInfo.GetQuality(skillId, 1);
                let isHide: boolean = false;
                for (let j = 0; j < this._skillCommon.length; j++) {
                    if (this._skillCommon[j].SkillId === skillId) {
                        if (this._tab === 0) {
                            isHide = true;
                        } else if (quality === skillQuality) {
                            isHide = true;
                        }
                    }
                }
                if (!isHide) {
                    newData.push(this._cur[i]);
                }
            }
            return newData;
        }
        return this._cur;
    }

    /** 是否已学习 */
    private isLearned(skillId: number): boolean {
        // if (this.TogHide.isChecked) {
        //     return false;
        // }
        for (let j = 0; j < this._skillCommon.length; j++) {
            if (this._skillCommon[j].SkillId === skillId) {
                return true;
            }
        }
        return false;
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: ItemModel = this._cur[idx];
        const item = node.getComponent(GSkillBigItem);
        if (item) {
            const isLearn: boolean = this.isLearned(data.cfg.Param);
            item.getComponent(GSkillBigItem).setData(data, isLearn, this._selectSkillId === data.cfg.Param, (itemId: number, skillId: number) => {
                this._selectItemId = itemId;
                this._selectSkillId = skillId;
                this.ListView.setNumItems(this._cur.length);
                this.NdNone.active = this._cur.length === 0;
            }, this);
        }
    }

    private onClose() {
        WinMgr.I.close(ViewConst.GSkillChooseWin);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
