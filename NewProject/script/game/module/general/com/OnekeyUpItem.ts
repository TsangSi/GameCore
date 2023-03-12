/*
 * @Author: kexd
 * @Date: 2022-08-24 11:51:38
 * @FilePath: \SanGuo\assets\script\game\module\general\com\OnekeyUpItem.ts
 * @Description: 一键升品列表item
 */
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../../../base/utils/UtilGame';
import GeneralHead from './GeneralHead';
import { GeneralMsg } from '../GeneralConst';
import UtilObject from '../../../base/utils/UtilObject';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { UI_PATH_ENUM } from '../../../const/UIPath';

const { ccclass, property } = cc._decorator;
@ccclass
export default class OnekeyUpItem extends BaseCmp {
    @property(GeneralHead)
    private GeneralHead: GeneralHead = null;
    @property(GeneralHead)
    private GeneralHead2: GeneralHead = null;
    @property(cc.ScrollView)
    private Sv: cc.ScrollView = null;
    @property(cc.Node)
    private NdDeputy: cc.Node = null;
    @property(cc.Toggle)
    private Toggle: cc.Toggle = null;

    private _onlyId: string = '';

    protected start(): void {
        super.start();

        UtilGame.Click(this.Toggle.node, () => {
            this.scheduleOnce(() => {
                if (this.Toggle && this.Toggle.isValid && this._onlyId) {
                    EventClient.I.emit(E.General.ClickOnekey, this.Toggle.isChecked, this._onlyId);
                }
            }, 0);
        }, this);
    }

    /**
     * 展示
     * @param data GeneralMsg[]
     * @param callback 回调
     */
    public setData(data: GeneralMsg[], idx: number, isCheck: boolean): void {
        // console.log(idx, 'setData:', data[0].generalData.OnlyId, 'Tog:', this.Toggle.isChecked, 'isCheck=', isCheck);

        this.Toggle.isChecked = isCheck;
        this._onlyId = data[0].generalData.OnlyId;
        this.GeneralHead.setData(data[0], { unshowSelect: true });
        const d: GeneralMsg = UtilObject.clone(data[0]);
        d.generalData.Quality += 1;
        this.GeneralHead2.setData(d, { unshowSelect: true });

        let parent: cc.Node;
        let tmpNode: cc.Node;

        if (data.length > 3) {
            parent = this.Sv.content;
            this.Sv.node.active = true;
            this.NdDeputy.active = false;
        } else {
            parent = this.NdDeputy;
            this.Sv.node.active = false;
            this.NdDeputy.active = true;
        }

        ResMgr.I.showPrefabOnce(UI_PATH_ENUM.GeneralHead, parent, (error, nd) => {
            if (error) return;
            for (let i = 1, n = data.length; i < n; i++) {
                if (data[i]) {
                    tmpNode = parent.children[i - 1];
                    if (!tmpNode) {
                        tmpNode = cc.instantiate(nd);
                        parent.addChild(tmpNode);
                    }
                    tmpNode.active = true;
                    tmpNode.getComponent(GeneralHead).setData(data[i], { unshowSelect: true });
                }
            }
        });
    }
}
