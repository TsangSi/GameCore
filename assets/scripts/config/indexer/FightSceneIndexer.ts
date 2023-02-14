/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { js } from 'cc';
import CfgIndexer from '../CfgIndexer';
import CfgManager from '../CfgManager';

export default class FightSceneIndexer extends CfgIndexer {
    private static _I: FightSceneIndexer = null;
    static get I(): FightSceneIndexer {
        if (this._I == null) {
            this._I = new FightSceneIndexer(CfgManager.I, 'Cfg_FightScene', 'Id');
        }
        return this._I;
    }
    private noWaits: { [fbtype: number]: boolean; } = js.createMap(true);
    private needShields: { [fbtype: number]: boolean; } = js.createMap(true);
    private fbtypeExs: { [bigtype: number]: { [smalltype: number]: number; }; } = js.createMap(true);
    /**
     * 只遍历一次，做好索引对应表
     */
    // eslint-disable-next-line camelcase
    protected walk(data: Cfg_FightScene, index: number): void {
        if (data.NoWait) {
            this.noWaits[data.FBType] = true;
        }
        if (data.NeedShield) {
            this.needShields[data.FBType] = true;
        }

        const typeInfo = data.FBType.split(':');
        let bigtype = 0;
        let smalltype = 0;
        bigtype = Number(typeInfo[0]);
        if (typeInfo.length > 1) {
            smalltype = Number(typeInfo[1]);
        }

        if (!this.fbtypeExs[bigtype]) {
            this.fbtypeExs[bigtype] = js.createMap(true);
        }
        this.fbtypeExs[bigtype][smalltype] = data.Id;
    }

    /** 是否不需要等待 */
    isNoWait(fbtype: number): boolean {
        return this.noWaits[fbtype] === true;
    }

    /** 是否需要护盾 */
    isNeedShield(fbtype: number): boolean {
        return this.needShields[fbtype] === true;
    }
}
