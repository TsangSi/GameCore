/*
 * @Author: kexd
 * @Date: 2022-09-07 11:30:16
 * @FilePath: \SanGuo\assets\script\game\module\general\com\GeneralRewardWin.ts
 * @Description:
 */
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../../com/win/WinBase';
import { ClickType, GeneralMsg } from '../GeneralConst';
import GeneralHead from './GeneralHead';

const { ccclass, property } = cc._decorator;

@ccclass
export class GeneralRewardWin extends WinBase {
    @property(cc.Node)
    private LabClose: cc.Node = null;

    @property(ListView)
    private ListHead: ListView = null;

    @property(cc.Node)
    private NdBtnSure: cc.Node = null;

    @property(cc.Prefab)
    private GeneralHeadPrefab: cc.Prefab = null;

    @property(cc.Node)
    private NdLessthan5: cc.Node = null;

    @property(cc.Node)
    private NdList: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.NdBtnSure, () => {
            this.close();
        }, this);
        UtilGame.Click(this.LabClose, () => {
            this.close();
        }, this);
    }

    protected close(): void {
        super.close();
        this.NdLessthan5.destroyAllChildren();
    }
    /**
     * 奖励列表
     * @param params
     */
    private _generalData: GeneralData[] = [];
    public init(params: [GeneralData[]]): void {
        this._generalData = params[0];
        //
        this.NdLessthan5.destroyAllChildren();
        this.NdLessthan5.removeAllChildren();

        if (this._generalData.length <= 4) {
            this.NdList.active = false;
            this.NdLessthan5.active = true;
            for (const data of this._generalData) {
                const nd = cc.instantiate(this.GeneralHeadPrefab);
                this.NdLessthan5.addChild(nd);
                const head: GeneralHead = nd.getComponent(GeneralHead);

                const msg: GeneralMsg = {
                    generalData: data,
                };

                head.setData(msg, { clickType: ClickType.None });
            }
        } else {
            this.NdList.active = true;
            this.NdLessthan5.active = false;
            this.resetListHeight(360);
            this.ListHead.setNumItems(this._generalData.length);
        }
    }

    public onDestroy(): void {
        super.onDestroy();
    }

    // private _listGridTrans: UITransform;
    private resetListHeight(height: number): void {
        // if (!this._listGridTrans) {
        //     this._listGridTrans = this.ListHead.getComponent(UITransform);
        // }
        // this._listGridTrans.height = height;
        this.NdList.height = height;
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data = this._generalData[idx];
        const head: GeneralHead = node.getComponent(GeneralHead);
        if (data && head) {
            const msg: GeneralMsg = {
                generalData: data,
            };
            head.setData(msg, { clickType: ClickType.None });
        }
    }
}
