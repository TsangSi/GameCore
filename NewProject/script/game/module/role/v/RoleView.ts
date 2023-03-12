/*
 * @Author: zs
 * @Date: 2022-05-24 18:29:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-21 14:34:44
 * @FilePath: \SanGuo2.4\assets\script\game\module\role\v\RoleView.ts
 * @Description:
 *
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { SpriteCustomizer } from '../../../base/components/SpriteCustomizer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import { RoleAN } from '../RoleAN';
import { RoleMgr } from '../RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class RoleView extends BaseUiView {
    @property({ type: cc.Node, tooltip: '查看战力' })
    private NodeCheckFv: cc.Node = null;
    @property({ type: cc.Node, tooltip: '一键装备' })
    private NodeAuto: cc.Node = null;
    @property({ type: cc.Node, tooltip: '分解' })
    private NodeFJ: cc.Node = null;
    @property({ type: cc.Node, tooltip: '升星' })
    private NodeSX: cc.Node = null;
    @property({ type: cc.Node, tooltip: '合体' })
    private NodeHT: cc.Node = null;
    @property({ type: cc.Node, tooltip: '装备' })
    private NodeZB: cc.Node = null;
    @property({ type: cc.Node, tooltip: '强化' })
    private NodeQH: cc.Node = null;
    @property({ type: cc.Node, tooltip: '镶嵌' })
    private NodeXQ: cc.Node = null;
    @property({ type: cc.Node, tooltip: '玉璧' })
    private NodeXY: cc.Node = null;
    @property({ type: cc.Node, tooltip: '元宝' })
    private NodeYB: cc.Node = null;
    @property({ type: cc.Node, tooltip: '铜钱' })
    private NodeJB: cc.Node = null;
    @property({ type: cc.Node, tooltip: '模型' })
    private NodeAni: cc.Node = null;
    @property({ type: cc.Node, tooltip: '返回' })
    private NodeBack: cc.Node = null;
    @property(cc.Node)
    private NodeContent: cc.Node = null;
    @property(cc.Node)
    private NodeFuncs: cc.Node = null;
    @property({ type: cc.Sprite, tooltip: 'SSR品质' })
    private SpriteQuality: cc.Sprite = null;

    @property({ type: cc.Label, tooltip: '战力' })
    private LabelFightValue: cc.Label = null;
    @property({ type: cc.Label, tooltip: '等级' })
    private LabelLevel: cc.Label = null;
    @property({ type: cc.RichText, tooltip: '名字' })
    private RichName: cc.RichText = null;
    @property({ type: cc.Label, tooltip: '套装名' })
    private LabelSuitName: cc.Label = null;
    @property({ type: cc.Label, tooltip: '玉璧文本' })
    private LabelXY: cc.Label = null;
    @property({ type: cc.Label, tooltip: '元宝文本' })
    private LabelYB: cc.Label = null;
    @property({ type: cc.Label, tooltip: '铜钱文本' })
    private LabelJB: cc.Label = null;

    protected onLoad(): void {
        super.onLoad();
        RoleMgr.I.on(this.onLevelChanged, this, RoleAN.N.Level);
        RoleMgr.I.on(this.onFVChanged, this, RoleAN.N.FightValue);

        UtilGame.Click(this.NodeFJ, this.onFJClicked, this);
        UtilGame.Click(this.NodeSX, this.onSXClicked, this);
        UtilGame.Click(this.NodeHT, this.onHTClicked, this);
        UtilGame.Click(this.NodeZB, this.onZBClicked, this);
        UtilGame.Click(this.NodeQH, this.onQHClicked, this);
        UtilGame.Click(this.NodeXQ, this.onXQClicked, this);
        UtilGame.Click(this.NodeXY, this.onXYClicked, this);
        UtilGame.Click(this.NodeYB, this.onYBClicked, this);
        UtilGame.Click(this.NodeJB, this.onJBClicked, this);
        UtilGame.Click(this.NodeAuto, this.onAutoClicked, this);
        UtilGame.Click(this.NodeBack, this.onBackClicked, this);
        UtilGame.Click(this.NodeCheckFv, this.onCheckFvClicked, this);

        this.NodeContent.children.forEach((c, index) => {
            UtilGame.Click(c, this.onPageClicked, this, { customData: index });
        });

        this.NodeFuncs.children.forEach((c, index) => {
            UtilGame.Click(c, this.onFuncsClicked, this, { customData: index });
        });

        EntityUiMgr.I.createEntity(this.NodeAni, { resId: 20001, resType: ANIM_TYPE.PET, isPlayUs: false });
    }

    private onFuncsClicked(target: cc.Node, index: number) {
        this.NodeFuncs.children[this.funcIndex].getComponent(SpriteCustomizer).curIndex = SpriteCustomizer.Statu.Normall as number;
        this.NodeFuncs.children[index].getComponent(SpriteCustomizer).curIndex = SpriteCustomizer.Statu.Select as number;
        this.funcIndex = index;
        MsgToastMgr.Show(UtilCocos.GetString(target, 'Label'));
    }

    private pageIndex = 0;
    private funcIndex = 0;
    private onPageClicked(target: cc.Node, index: number) {
        this.NodeContent.children[this.pageIndex].getComponent(SpriteCustomizer).curIndex = SpriteCustomizer.Statu.Normall as number;
        // eslint-disable-next-line max-len
        this.NodeContent.children[this.pageIndex].getChildByName('icon').getComponent(SpriteCustomizer).curIndex = SpriteCustomizer.Statu.Normall as number;
        this.NodeContent.children[index].getComponent(SpriteCustomizer).curIndex = SpriteCustomizer.Statu.Select as number;
        this.NodeContent.children[index].getChildByName('icon').getComponent(SpriteCustomizer).curIndex = SpriteCustomizer.Statu.Select as number;
        this.pageIndex = index;
        MsgToastMgr.Show('切换页签');
    }

    private onCheckFvClicked() {
        MsgToastMgr.Show('查看战力');
    }
    private onFJClicked() {
        MsgToastMgr.Show('分解');
    }
    private onSXClicked() {
        MsgToastMgr.Show('升星');
    }
    private onHTClicked() {
        MsgToastMgr.Show('合体');
    }
    private onZBClicked() {
        MsgToastMgr.Show('装备');
    }
    private onQHClicked() {
        MsgToastMgr.Show('强化');
    }
    private onXQClicked() {
        MsgToastMgr.Show('镶嵌');
    }
    private onXYClicked() {
        MsgToastMgr.Show('玉璧');
    }
    private onYBClicked() {
        MsgToastMgr.Show('元宝');
    }
    private onJBClicked() {
        MsgToastMgr.Show('铜钱');
    }
    private onBackClicked() {
        MsgToastMgr.Show('返回');
        WinMgr.I.closeView(this);
    }
    private onAutoClicked() {
        MsgToastMgr.Show('一键装备');
    }

    private onAddFV() {
        RoleMgr.I.d.FightValue += UtilNum.RandomInt(1, 10);
        this.onFVChanged();
    }

    private xuanyu = 0;
    private yuanbao = 0;
    private jinbi = 0;
    private onAddXY() {
        this.xuanyu += UtilNum.RandomInt(1, 100);
        this.LabelXY.string = UtilNum.Convert(this.xuanyu);
    }
    private onAddYB() {
        this.yuanbao += UtilNum.RandomInt(1, 100);
        this.LabelYB.string = UtilNum.Convert(this.yuanbao);
    }
    private onAddJB() {
        this.jinbi += UtilNum.RandomInt(1, 100);
        this.LabelJB.string = UtilNum.Convert(this.jinbi);
    }

    private onLevelChanged() {
        UtilCocos.SetString(this.LabelLevel.node, RoleMgr.I.d.Level);
    }
    private onFVChanged() {
        this.LabelFightValue.string = `${UtilNum.ConvertFightValue(RoleMgr.I.d.FightValue)}`;
    }

    protected onDestroy(): void {
        super.onDestroy();
        RoleMgr.I.on(this.onLevelChanged, this, RoleAN.N.Level);
        RoleMgr.I.on(this.onFVChanged, this, RoleAN.N.FightValue);
    }
}
