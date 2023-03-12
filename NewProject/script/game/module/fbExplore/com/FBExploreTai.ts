import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { ACTION_TYPE, ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { SpriteCustomizer } from '../../../base/components/SpriteCustomizer';
import { Config } from '../../../base/config/Config';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import UtilItemList from '../../../base/utils/UtilItemList';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import { EffectMgr } from '../../../manager/EffectMgr';
import { EFBExplorePathDir, FBExploreStartPos, IFBExploreTai } from '../FBExploreConst';

/*
 * @Author: zs
 * @Date: 2023-02-02 17:09:20
 * @Description:
 *
 */
const { ccclass, property } = cc._decorator;

/** 台子索引枚举 */
enum EFBExploreTaiIndex {
    /** 默认台子 */
    Noemall,
    /** 当前关卡台子 */
    NowStage,
}

/** 路径点图片索引 */
enum EFBExplorePathIndex {
    /** 未通关 */
    NotCleared,
    /** 已通关 */
    Cleared,
}

@ccclass
export default class FBExploreTai extends BaseCmp {
    /** 台子样式数组[已通关样式，当前通关样式] */
    @property(cc.Node)
    private NodeTais: cc.Node[] = [];
    /** 模型 */
    @property(cc.Node)
    private NodeAnim: cc.Node = null;
    /** 已通关 */
    @property(cc.Node)
    private NodeYTG: cc.Node = null;
    /** 关卡名 */
    @property(cc.Label)
    private LabelStage: cc.Label = null;
    /** 战力 */
    @property(cc.Label)
    private LabelFV: cc.Label = null;
    /** 路径点的父节点 */
    @property(cc.Node)
    private NodePath: cc.Node = null;
    /** 奖励道具父节点 */
    @property(cc.Node)
    private NodeItems: cc.Node = null;
    /** 奖励道具遮罩 */
    @property(cc.Node)
    private NodeMask: cc.Node = null;
    @property(cc.Node)
    private NodeEffect: cc.Node = null;

    /** 左边的路径点位置 */
    private leftPaths: cc.Vec2[] = [
        cc.v2(-53, 15),
        cc.v2(-97, 46),
        cc.v2(-131, 94),
        cc.v2(-153, 151),
        cc.v2(-152, 209),
        cc.v2(-142, 258),
    ];

    /** 右边的路径点位置 */
    private rightPaths: cc.Vec2[] = [
        cc.v2(108, -1),
        cc.v2(173, 18),
        cc.v2(230, 49),
        cc.v2(290, 89),
        cc.v2(340, 139),
        cc.v2(340, 209),
        cc.v2(300, 249),
    ];
    private dir: EFBExplorePathDir = 0;
    private leftPathEx: cc.Vec2 = cc.v2(-190 + FBExploreStartPos.x, 340 + FBExploreStartPos.y);
    private rightPathEx: cc.Vec2 = cc.v2(190 + FBExploreStartPos.x, 339 + FBExploreStartPos.y);

    private data: IFBExploreTai = null;
    public setData(data: IFBExploreTai): void {
        this.data = data;
        this.LabelStage.string = `${data.Level}-${data.Part}-${data.Stage}`;
        const strItems = `${data.StageFirstPrize}|${data.StagePrize}`;
        const length = data.StageFirstPrize.split('|').length;
        const allLength = strItems.split('|').length;
        UtilItemList.ShowItems(this.NodeItems, strItems, { option: { needNum: true } }, (item, idx: number) => {
            if (idx < length) {
                // 显示首通角标
                const node = new cc.Node();
                UtilCocos.LoadSpriteFrame(node.addComponent(cc.Sprite), 'texture/com/font/com_font_shoutong@ML');
                node.setPosition(-20, 20);
                this.NodeItems.children[idx].addChild(node);
            }
        });
        let fv = 0;
        const cfgMonster: Cfg_Monster = Config.Get(Config.Type.Cfg_Monster).getValueByKey(data.BossId);
        if (cfgMonster) {
            const bossObj = { resId: cfgMonster.AnimId, resType: ANIM_TYPE.PET, resAction: ACTION_TYPE.UI_SHOW };
            const bossAni = EntityUiMgr.I.createAttrEntity(this.NodeAnim, bossObj);
            UtilCocos.SetScale(bossAni, 0.3, 0.3, 0.3);
            const cfgRefresh: Cfg_Refresh = Config.Get(Config.Type.Cfg_Refresh).getValueByKey(data.RefreshId);
            fv = UtilAttr.GetBossFv(cfgRefresh.AttrId_Boss, cfgRefresh.MonsterLevel);
        }
        this.LabelFV.string = UtilNum.ConvertFightValue(fv);
    }

    private _curShowPaths: cc.Vec2[] = [];
    public get curShowPaths(): cc.Vec2[] {
        return this._curShowPaths;
    }

    private _curShowPathEx: cc.Vec2 = cc.v2();
    public get curShowPathEx(): cc.Vec2 {
        return this._curShowPathEx;
    }

    private getPaths(dir: EFBExplorePathDir) {
        if (dir === EFBExplorePathDir.Left) {
            this._curShowPathEx = this.leftPathEx;
            return this.leftPaths;
        } else if (dir === EFBExplorePathDir.Right) {
            this._curShowPathEx = this.rightPathEx;
            return this.rightPaths;
        } else {
            return [];
        }
    }

    /**
     * 更新路径点
     * @param dir 方向
     * @param isTongGuan 是否通关
     */
    public updatePath(dir: EFBExplorePathDir, fightStageId: number): void {
        const isTongGuan = fightStageId > this.data.Id;
        this.dir = dir;
        const paths = this.getPaths(dir);
        for (let i = 0, n = Math.max(this.NodePath.childrenCount, paths.length); i < n; i++) {
            let node = this.NodePath.children[i];
            if (paths[i]) {
                node = node || cc.instantiate(this.NodePath.children[0]);
                node.setPosition(paths[i]);
                node.getComponent(SpriteCustomizer).curIndex = isTongGuan ? EFBExplorePathIndex.Cleared : EFBExplorePathIndex.NotCleared;
                node.active = true;
                if (!this.NodePath.children[i]) {
                    this.NodePath.addChild(node);
                }
            } else if (node) {
                if (i !== 0) {
                    node?.destroy();
                } else {
                    node.active = false;
                }
            }
        }
        this._curShowPaths = paths;
    }
    public updateOther(fightStageId: number): void {
        const isTongGuan = fightStageId > this.data.Id;
        const isCurFight = fightStageId === this.data.Id;
        this.NodeTais[EFBExploreTaiIndex.Noemall].active = !isCurFight;
        this.NodeTais[EFBExploreTaiIndex.NowStage].active = isCurFight;
        if (isCurFight) {
            EffectMgr.I.showEffect('effect/fuben/ui_6574', this.NodeEffect, cc.WrapMode.Loop);
        } else {
            this.delFightEffect();
        }
        this.NodeYTG.active = isTongGuan;
        if (!isTongGuan) {
            // 未通关
            this.NodeYTG.active = false;
        }
        const strItems = `${this.data.StageFirstPrize}|${this.data.StagePrize}`;
        const maskLength = isTongGuan ? strItems.split('|').length : 0;
        for (let i = 0, n = Math.max(this.NodeMask.childrenCount, maskLength); i < n; i++) {
            if (i >= maskLength) {
                if (i !== 0) {
                    this.NodeMask.children[i]?.destroy();
                } else {
                    this.NodeMask.children[i].active = false;
                }
            } else {
                const node = this.NodeMask.children[i] || cc.instantiate(this.NodeMask.children[0]);
                if (!this.NodeMask.children[i]) {
                    this.NodeMask.addChild(node);
                }
                node.active = true;
            }
        }
    }

    public delFightEffect(): void {
        EffectMgr.I.delEffect('effect/fuben/ui_6574', this.NodeEffect);
    }

    /** 更新路径点是否亮起 */
    public updatePathLight(index: number, isLight: boolean): void {
        const scriptCus = this.NodePath?.children[index]?.getComponent(SpriteCustomizer);
        if (scriptCus) {
            scriptCus.curIndex = isLight ? EFBExplorePathIndex.Cleared : EFBExplorePathIndex.NotCleared;
        }
    }

    /** 获取人物行走起始的路径点索引 */
    public getStartMovePathIndex(): number {
        if (this.dir === EFBExplorePathDir.Right) {
            // 方向在右边的时候，人物已经占在第二个点了，所以从第二个点开始行走
            return 1;
        } else {
            // 方向左边的时候，人物没有站在路径点位置上，所以从0开始行走
            return 0;
        }
    }

    public getNodePath(): cc.Node {
        return this.NodePath;
    }
}
