/*
 * @Author: zs
 * @Date: 2022-12-01 18:05:27
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\v\CollectionBookRw.ts
 * @Description:
 *
 */

import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import BaseUiView from '../../../../../app/core/mvc/view/BaseUiView';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItemList from '../../../../base/utils/UtilItemList';
import ControllerMgr from '../../../../manager/ControllerMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SilkRoadReward extends BaseUiView {
    @property(cc.Node)
    private contents: cc.Node[] = [];
    @property(cc.RichText)
    private labels: cc.RichText[] = [];
    @property(cc.Node)
    private NdConfirm: Node = null;

    private lock = false;

    /**
     *
     * @param param [itemStr: string, isShowTips: true]
     */
    public init(param: any[]): void {
        this.labels[1].node.active = false;
        for (let i = 0; i < 2; ++i) {
            const itemStr: string = param[i + 1];
            if (itemStr && itemStr.length) {
                this.contents[i].active = true;
                console.log(i);
                UtilItemList.ShowItems(this.contents[i], param[i + 1], {
                    option: {
                        needNum: true, hideLeftLogo: true, hideRightLogo: true,
                    },
                }, (err, node) => {
                    if (i === 1) {
                        this.labels[1].node.active = true;
                        this.labels[1].string = UtilString.FormatArgs(i18n.tt(Lang.silkroad_tip4), this.contents[1].childrenCount);
                    }
                    const num = Math.min(this.contents[i].childrenCount, 4);
                    this.contents[i].width = 98 * num + 10 * (num - 1);
                });
            }
        }
        this.scheduleOnce(() => {
            this.labels[0].string = UtilString.FormatArgs(i18n.tt(Lang.silkroad_tip3), param[0]);
            UtilGame.Click(this.NdConfirm, this.onClickConfirm, this);
        });
    }

    private onClickConfirm(): void {
        // if (this.lock) return;
        // this.lock = true;
        ControllerMgr.I.SilkRoadController.reqReward();
    }
}
