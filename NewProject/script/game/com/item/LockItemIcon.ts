import { UtilGame } from '../../base/utils/UtilGame';
import UtilItemList from '../../base/utils/UtilItemList';
import UtilRedDot from '../../base/utils/UtilRedDot';
import { EActiveStatus } from '../../const/GameConst';
import ItemModel from './ItemModel';

/*
 * @Author: myl
 * @Date: 2023-01-30 18:08:06
 * @Description:
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class LockItemIcon extends cc.Component {
    @property(cc.Node)
    private NdItem: cc.Node = null;
    @property(cc.Node)
    private NdLock: cc.Node = null;
    @property(cc.Node)
    private NdReserved: cc.Node = null;
    @property(cc.Node)
    private NdClick: cc.Node = null;

    @property(cc.Node)
    private NdLockTip: cc.Node = null;
    @property(cc.Node)
    private NdBlack: cc.Node = null;
    protected start(): void {
        UtilGame.Click(this.NdClick, () => {
            if (this._cb) this._cb();
        }, this, { scale: 1 });
    }

    private _cb: () => void = null;
    public setData(
        data: ItemData | ItemModel | string,
        state: EActiveStatus,
        callBack?: () => void,
        needLock: boolean = true, // 未解锁状态是否需要锁
        needBlock: boolean = true,
    ): void {
        this.NdLock.active = state === EActiveStatus.UnActive;
        this.NdReserved.active = state === EActiveStatus.Active;
        this.NdClick.active = state === EActiveStatus.CanActive;
        UtilRedDot.UpdateRed(this.node, state === EActiveStatus.CanActive, cc.v2(40, 40));
        this._cb = callBack;
        this.NdLockTip.active = false;

        this.NdLockTip.active = needLock && state === EActiveStatus.UnActive;
        this.NdBlack.active = needBlock && state === EActiveStatus.UnActive;
        if (typeof data === 'string') {
            UtilItemList.ShowItems(this.NdItem, data, { option: { needNum: true } });
        } else {
            const arr = [];
            arr.push(ItemData);
            UtilItemList.ShowItemArr(this.NdItem, arr, { option: { needNum: true } });
        }
    }

    protected onDestroy(): void {
        if (this._cb) this._cb = null;
    }
}
