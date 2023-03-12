/*
 * @Author: hrd
 * @Date: 2022-06-20 15:33:28
 * @FilePath: \SanGuo-2.4-main\assets\script\game\battle\view\BattlePanel.ts
 * @Description:
 *
 */

import { EventClient } from '../../../app/base/event/EventClient';
import { AudioMgr } from '../../../app/base/manager/AudioMgr';
import AudioPath from '../../../app/base/manager/AudioPath';
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../app/base/utils/UtilString';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import { AssetType } from '../../../app/core/res/ResConst';
import { i18n, Lang } from '../../../i18n/i18n';
import { UtilGame } from '../../base/utils/UtilGame';
import { E } from '../../const/EventName';
import { RES_ENUM } from '../../const/ResPath';
import ModelMgr from '../../manager/ModelMgr';
import MapCfg from '../../map/MapCfg';
import { BattleMgr } from '../BattleMgr';
import { BattleModel } from '../BattleModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class BattlePanel extends BaseCmp {
    /** 战斗背景 */
    @property(cc.Sprite)
    private SprBg: cc.Sprite = null;
    /** 技能业务层 角色下层 */
    @property(cc.Node)
    private NdSkillLayer1: cc.Node = null;
    /** 技能业务层 角色上层 */
    @property(cc.Node)
    private NdSkillLayer2: cc.Node = null;
    /** 角色层 */
    @property(cc.Node)
    private NdEntityLayer: cc.Node = null;
    /** 战斗扣血飘字层 */
    @property(cc.Node)
    private NdBloodLayer: cc.Node = null;
    /** 战斗UI层 */
    @property(cc.Node)
    private NdUILayer: cc.Node = null;
    /** 战斗回合信息节点 */
    @property(cc.Node)
    private NdBattleTurn: cc.Node = null;
    @property(cc.Node)
    private SprBatchBg: cc.Node = null;
    /** 战斗回合数Lab */
    @property(cc.Label)
    private LabTurnNum: cc.Label = null;
    /** 战斗波数Lab */
    @property(cc.Label)
    private LabBatchNum: cc.Label = null;
    @property(cc.Node)
    private NdClose: cc.Node = null;
    @property(cc.Node)
    private NdScene: cc.Node = null;
    @property(cc.Node)
    private NdSpeed: cc.Node = null;
    @property(cc.Label)
    private LabDesc: cc.Label = null;
    @property(cc.Node)
    private NdBo: cc.Node = null;

    private _timer: any = null;
    private _model: BattleModel = null;

    protected onLoad(): void {
        super.onLoad();

        this.addE();
        BattleMgr.I._BattlePanel = this;

        UtilGame.Click(this.NdClose, () => {
            BattleMgr.I.skipCurWar();
            this.node.destroy();
        }, this);

        UtilGame.Click(this.NdSpeed, () => {
            this.onAddSpeed();
        }, this);

        this._model = ModelMgr.I.BattleModel;
        const id = this._model.getBattleBgId();
        UtilCocos.LoadSpriteFrameRemote(this.SprBg, `${RES_ENUM.BattleUI_Bg_Battle_Bg}${id}`, AssetType.SpriteFrame_jpg);
        this.NdClose.active = this._model.isShowJumpWar(1);
        this.onUpTurnNum(1);
        this.onUpBatchNum(0);
        this.runUpdate();
        this.playBattleBgm();
    }

    // protected start(): void {
    //     super.start();
    // }

    protected onEnable(): void {
        super.onEnable();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.delE();
        if (this._timer) {
            this.clearInterval(this._timer);
            this._timer = null;
        }
    }

    private addE(): void {
        EventClient.I.on(E.Battle.TurnNumChange, this.onUpTurnNum, this);
        EventClient.I.on(E.Battle.TestSpeed, this.onOpenSpeed, this);
        EventClient.I.on(E.Battle.BacthNumChange, this.onUpBatchNum, this);
        EventClient.I.on(E.Battle.DescChange, this.onUpLabDesc, this);
    }

    private delE(): void {
        EventClient.I.off(E.Battle.TurnNumChange, this.onUpTurnNum, this);
        EventClient.I.off(E.Battle.TestSpeed, this.onOpenSpeed, this);
        EventClient.I.off(E.Battle.BacthNumChange, this.onUpBatchNum, this);
        EventClient.I.off(E.Battle.DescChange, this.onUpLabDesc, this);
    }

    private playBattleBgm() {
        // 读配置
        console.log('战斗内播放音乐');
        console.log(MapCfg.I.mapData);
        // MapCfg.I.mapData.BgMusic
        const arr = UtilString.SplitToArray(MapCfg.I.mapData.BgMusic);
        const musicIds: string[] = arr[1];// MapCfg.I.mapData.BgMusic.split('|')[1].split(':');
        const idx = Math.floor(Math.random() * musicIds.length);
        const audioName = `${musicIds[idx]}`;

        const path: string = AudioPath.bgMusicBase + audioName;
        AudioMgr.I.playMusic(path, { isRemote: true, loop: true });
    }

    private runUpdate() {
        let now = new Date().getTime();
        let old = now;

        const delta = 1000 / 60;
        this._timer = this.setInterval(() => {
            now = new Date().getTime();
            const dt = (now - old) / 1000;
            old = now;
            this.updateTiem(dt);
        }, delta);
    }

    /** 更新回合数 */
    private onUpTurnNum(num: number) {
        let maxTurn = 1;
        if (BattleMgr.I.MaxTurn) {
            maxTurn = BattleMgr.I.MaxTurn;
        }
        this.LabTurnNum.string = `${num}/${maxTurn}${i18n.tt(Lang.battle_TurnTxt)}`;

        this.NdClose.active = this._model.isShowJumpWar(num);
    }

    /** 更新战斗波数 */
    private onUpBatchNum(num: number): void {
        if (!num) {
            this.NdBo.active = false;
            this.SprBatchBg.active = false;
            return;
        }
        this.SprBatchBg.active = true;
        this.NdBo.active = true;
        this.LabBatchNum.string = `${num}`;
        // this.LabBatchNum.string = UtilString.FormatArray(i18n.tt(Lang.battle_batch_info), [num]);
    }

    /** 更新战斗描述 */
    private onUpLabDesc(str: string): void {
        this.LabDesc.string = str;
    }

    public getSceneLayer(): cc.Node {
        return this.NdScene;
    }

    public getEntityLayer(): cc.Node {
        return this.NdEntityLayer;
    }

    public getSkillLayer1(): cc.Node {
        return this.NdSkillLayer1;
    }

    public getSkillLayer2(): cc.Node {
        return this.NdSkillLayer2;
    }

    public getBloodLayer(): cc.Node {
        return this.NdBloodLayer;
    }

    public getUILayer(): cc.Node {
        return this.NdUILayer;
    }

    // public update(dt: number): void {
    //     super.update(dt);
    //     BattleMgr.I.updateTime(dt * 1000);
    // }

    public updateTiem(dt: number): void {
        // super.update(dt);
        BattleMgr.I.updateTime(dt * 1000);
    }

    private onOpenSpeed() {
        this.NdSpeed.active = true;
        this.upSpeedBtn();
    }

    private onAddSpeed(): void {
        let mSpeed = BattleMgr.I.getWarSpeed();
        if (mSpeed >= 3) {
            mSpeed = 1;
        } else {
            mSpeed += 0.5;
        }
        BattleMgr.I.setWarSpeed(mSpeed);
        this.upSpeedBtn();
    }

    private upSpeedBtn() {
        if (this.NdSpeed && this.NdSpeed.active) {
            const speed = BattleMgr.I.getWarSpeed();
            // const str = `速度X${speed}`;
            const str = `${i18n.tt(Lang.battle_speed)}X${speed}`;
            this.NdSpeed.getChildByName('Label').getComponent(cc.Label).string = str;
        }
    }

    /** 清除所有层级节点 */
    public doClearAll(): void {
        this.NdEntityLayer.destroyAllChildren();
        this.NdSkillLayer1.destroyAllChildren();
        this.NdSkillLayer2.destroyAllChildren();
        this.NdBloodLayer.destroyAllChildren();
        this.NdUILayer.destroyAllChildren();
    }
}
