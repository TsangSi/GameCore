/*
 * @Author: dcj
 * @Date: 2022-09-28 20:57:29
 * @FilePath: \SanGuo2.4\assets\script\game\module\role\v\RoleAttrWin.ts
 * @Description:
 */

import { RoleMgr } from '../RoleMgr';
import { RoleMD } from '../RoleMD';
import Progress, { LableStyle } from '../../../base/components/Progress';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { EShowAttrType } from '../../../base/attribute/AttrConst';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Config } from '../../../base/config/Config';
import { ConfigAttrRelationIndexer } from '../../../base/config/indexer/ConfigAttrRelationIndexer';
import WinBase from '../../../com/win/WinBase';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import { ConfigConst } from '../../../base/config/ConfigConst';
import { ConfigIndexer } from '../../../base/config/indexer/ConfigIndexer';
import ModelMgr from '../../../manager/ModelMgr';
import { UtilAttr } from '../../../base/utils/UtilAttr';

const { ccclass, property } = cc._decorator;
@ccclass
export class RoleAttrWin extends WinBase {
    @property(cc.Label)
    private LabLevel: cc.Label = null;
    @property(cc.Label)
    private LabArena: cc.Label = null;
    @property(Progress)
    private RoleExpProgress: Progress = null;
    @property(cc.ScrollView)
    private SvAttr: cc.ScrollView = null;

    private indexerAttr: ConfigAttrRelationIndexer;
    private arenaIndex: ConfigIndexer;
    protected start(): void {
        super.start();

        UtilGame.Click(this.NodeBlack, () => {
            this.onClose();
        }, this);
        RoleMgr.I.on(this.updateView, this);
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param);
        // 初始化数据
        this.indexerAttr = Config.Get(Config.Type.Cfg_Attr_Relation);
        this.arenaIndex = Config.Get(ConfigConst.Cfg_ArmyGrade);
        this.initView();
    }

    private initView(): void {
        //
        this.updateView();
    }

    private updateView(): void {
        this.updateTopContent();
        this.initCenter();
    }

    private updateTopContent(): void {
        this.LabLevel.string = RoleMgr.I.d.Level.toString();
        // const cfg: Cfg_ArmyGrade = this.arenaIndex.getValueByKey(RoleMgr.I.getArmyLevel(), RoleMgr.I.getArmyStar()) as Cfg_ArmyGrade;

        const armyName = ModelMgr.I.ArmyLevelModel.getArmyName(RoleMgr.I.getArmyLevel(), RoleMgr.I.getArmyStar());
        this.LabArena.string = armyName;
        // 经验
        const cur: number = RoleMgr.I.d.RoleExp;
        let next: number = RoleMgr.I.getNextExp();
        if (next < cur) {
            next = cur;
        }

        if (RoleMgr.I.isMaxExp()) {
            this.RoleExpProgress.labelStyle = LableStyle.CurNum;
        } else {
            this.RoleExpProgress.labelStyle = LableStyle.NumExceed;
        }
        this.RoleExpProgress.updateProgress(cur, next, true);
    }

    private initCenter(): void {
        UtilCocos.LayoutFill(this.SvAttr.content, (item, index) => {
            const baseTitleLab = UtilCocos.FindNode(item, 'NdName/LabAttrName').getComponent(cc.Label);
            const _type = index + 1;
            const _data = this.indexerAttr.getShowAttrTypes(_type);
            const ndAttrs = item.getChildByName('NdAttrs');
            const tpl = ndAttrs.children[0];
            _data.forEach((data, i) => {
                let NdAttr = ndAttrs.children[i];
                if (NdAttr) {
                    if (i < _data.length) {
                        NdAttr.active = true;
                    } else {
                        NdAttr.destroy();
                    }
                } else if (i < _data.length) {
                    NdAttr = cc.instantiate(tpl);
                    NdAttr.active = true;
                    NdAttr.parent = ndAttrs;
                }
                NdAttr.getChildByName('LabAttr').getComponent(cc.Label).string = UtilAttr.GetAttrName(data.Attr);
                let attrV: string = '';
                if (data.PercentType) {
                    const mathC = parseFloat((RoleMgr.I.d[RoleMD.AttrType[data.Attr] as string] / 10000 * 100).toFixed(2)) || 0;
                    attrV = `${mathC}%`;
                } else {
                    attrV = RoleMgr.I.d[RoleMD.AttrType[data.Attr] as string];
                    const _cou = RoleMgr.I.d[RoleMD.AttrType[data.Attr] as string] / 100000000;
                    if (Math.floor(_cou) > 0) {
                        attrV = _cou.toFixed(2) + i18n.tt(Lang.com_Billion);
                    }
                }
                NdAttr.getChildByName('LabVal').getComponent(cc.Label).string = attrV;
            });
            baseTitleLab.string = `【${this.getTitle(_type)}】`;
        }, this.indexerAttr.getTypesVals());
    }

    private getTitle(_type: EShowAttrType) {
        let str = '';
        switch (_type) {
            case EShowAttrType.Base:
                str = i18n.tt(Lang.attr_base);
                break;
            case EShowAttrType.Advanced:
                str = i18n.tt(Lang.attr_senior);
                break;
            case EShowAttrType.Special:
                str = i18n.tt(Lang.attr_special);
                break;
            default:
                break;
        }
        return str;
    }
    protected onDestroy(): void {
        super.onDestroy();
        RoleMgr.I.off(this.updateView, this);
    }

    private onClose() {
        WinMgr.I.close(ViewConst.RoleAttrWin);
    }
}
