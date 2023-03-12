/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-07-12 20:38:56
 * @FilePath: \SanGuo-2.4-main\assets\script\game\com\attr\v\AttrDetailTips.ts
 * @Description: 属性加成
 *
 */

import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilGame } from '../../../base/utils/UtilGame';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import WinBase from '../../win/WinBase';
import { AttrDetailItem } from './AttrDetailItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class AttrDetailTips extends WinBase {
    @property(cc.Node)
    private NdClose: cc.Node = null;
    private _attr: { title: string, data: string }[];
    private _skillDesc: string = null;
    @property(cc.Node)
    private attrsNd: cc.Node = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.NdClose, () => {
            this.close();
        }, this);

        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    public init(data: unknown[]): void {
        if (data && data[0]) {
            this._attr = data[0] as { title: string, data: string }[];
            this.uptUI(this._attr);
        }

        // 技能信息（单独处理）
        if (data && data[1]) {
            this._skillDesc = data[1] as string;
        }
    }

    private uptUI(atts: { title: string, data: string }[]) {
        if (!atts || atts.length <= 0) {
            console.log('没有数据');
            return;
        }
        ResMgr.I.showPrefab(UI_PATH_ENUM.Com_AttrDetailItem, null, (err, nd: cc.Node) => {
            for (let i = 0; i < atts.length; i++) {
                const itm = atts[i];
                const nd1 = cc.instantiate(nd);
                nd1.getComponent(AttrDetailItem).setData(itm);
                this.attrsNd.addChild(nd1);
            }
            if (this._skillDesc) {
                this.attrsNd.addChild(nd);
                let desc = '';
                if (typeof this._skillDesc === 'string') {
                    desc = this._skillDesc;
                }

                nd.getComponent(AttrDetailItem).setData({ title: i18n.tt(Lang.con_skill_property), data: desc });
            }
        });
    }

    private onClose() {
        WinMgr.I.close(ViewConst.AttrDetailTips);
    }
}
