/*
 * @Author: kexd
 * @Date: 2022-11-16 14:19:17
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gSkill\GSkillRecomWin.ts
 * @Description: 武将-技能推荐
 *
 */

import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import ListView from '../../../base/components/listview/ListView';
import { Config } from '../../../base/config/Config';
import { GSkillShowItem } from '../com/GSkillShowItem';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class GSkillRecomWin extends WinBase {
    @property(ListView)
    private ListView: ListView = null;
    @property(cc.Label)
    protected LabType: cc.Label = null;

    private _skills: string[] = [];

    protected start(): void {
        super.start();

        UtilGame.Click(this.NodeBlack, () => {
            this.onClose();
        }, this, { scale: 1 });
    }

    public init(args: unknown[]): void {
        const recomSkillId: number = args[0] as number;
        if (!recomSkillId) return;
        const cfg: Cfg_G_RecommenSkill = Config.Get(Config.Type.Cfg_G_RecommenSkill).getValueByKey(recomSkillId);
        if (!cfg) return;
        this.LabType.string = `【${cfg.Name}】`;
        this._skills = cfg.Combination.split('|');
        this.ListView.setNumItems(this._skills.length);
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const skillId: number = +this._skills[idx];
        const item = node.getComponent(GSkillShowItem);
        if (item) {
            item.setData(skillId);
        }
    }

    private onClose() {
        WinMgr.I.close(ViewConst.GSkillRecomWin);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
