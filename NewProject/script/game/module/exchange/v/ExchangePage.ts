/*
 * @Author: zs
 * @Date: 2022-06-06 11:12:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-25 22:03:21
 * @FilePath: \SanGuo24\assets\script\game\module\exchange\v\ExchangePage.ts
 * @Description:
 *
 */
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { Config } from '../../../base/config/Config';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ExchangeItem } from './ExchangeItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ExchangePage extends WinTabPage {
    @property(cc.Node)
    private NodeContent: cc.Node = null;
    public init(winId: number, param: unknown): void {
        this.updateGoodsDatas();
    }

    private updateGoodsDatas() {
        const cfgIndexer = Config.Get(Config.Type.Cfg_DH);
        ResMgr.I.loadLocal(UI_PATH_ENUM.ExchangeItem, cc.Prefab, (e, p: cc.Prefab) => {
            if (e || !p || !this.NodeContent || !this.NodeContent.isValid) return;
            for (let i = 0; i < cfgIndexer.keysLength; i++) {
                const cfg: Cfg_DH = cfgIndexer.getValueByIndex(i);
                const n = cc.instantiate(p);
                this.NodeContent.addChild(n);
                const s = n.getComponent(ExchangeItem);
                s.setData(cfg, i);
            }
        });
    }

    protected onDestroy(): void {
        //
    }
}
