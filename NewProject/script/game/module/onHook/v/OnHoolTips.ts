/*
 * @Author: dcj
 * @Date: 2022-11-03 19:09:36
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\onHook\v\OnHoolTips.ts
 * @Description:
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { ViewConst } from '../../../const/ViewConst';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class OnHoolTips extends WinBase {
    @property(cc.Node)
    private NdJiantou: cc.Node = null;

    @property(cc.ScrollView)
    private SvAttr: cc.ScrollView = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this);
    }
    private _source: number[] = [];
    public init(params: any[]): void {
        this._source = params[0] || [];
        this.upView();
    }

    private upView() {
        UtilCocos.LayoutFill(this.SvAttr.content, (nd, index) => {
            const length = this._source.length || 0;
            const node = nd.getChildByName('SvContent');
            for (let i = 0, n = Math.max(length, node.childrenCount); i < n; i++) {
                if (!this._source[i]) {
                    if (i !== 0) {
                        node.children[i]?.destroy();
                    } else {
                        node.children[0].active = false;
                    }
                }
                const child = node.children[i] || cc.instantiate(node.children[0]);
                const cfg = Config.Get(Config.Type.Cfg_IncreaseSkill).getValueByKey<Cfg_IncreaseSkill>(this._source[i]);
                UtilCocos.SetString(child, 'NodeName/Label', `【${cfg.SkillName}】：`);
                UtilCocos.SetString(child, 'RichText', ModelMgr.I.BuffModel.getBuffDesc(cfg));
                if (!node.children[i]) {
                    node.addChild(child);
                }
            }
            UtilCocos.SetString(nd, 'NdTitle/LabAttr', '已激活加成');
        }, 1);
        this.NdJiantou.active = this._source.length > 4;
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    private onClose() {
        WinMgr.I.close(ViewConst.OnHoolTips);
    }
}
