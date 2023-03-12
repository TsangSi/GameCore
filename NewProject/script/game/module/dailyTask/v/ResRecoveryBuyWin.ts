import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import WinBase from '../../../com/win/WinBase';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResRecoveryBuyWin extends WinBase {
    @property(cc.Label)
    private LabTitle: cc.Label = null;

    @property(cc.Node)
    private NdAll: cc.Node = null;
    @property(cc.Label)
    private LabNum: cc.Label = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;

    @property(cc.Node)
    private NdDefault: cc.Node = null;
    @property(cc.RichText)
    private RichContent: cc.RichText = null;
    @property(cc.Label)
    private LabInput: cc.Label = null;
    @property(cc.Node)
    private BtnAdd: cc.Node = null;
    @property(cc.Node)
    private BtnRedu: cc.Node = null;
    @property(cc.Label)
    private LabNumD: cc.Label = null;
    @property(DynamicImage)
    private SprIconD: DynamicImage = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;
    @property(cc.Node)
    private BtnClose1: cc.Node = null;

    @property(cc.Node)
    private NdBtnClose: cc.Node = null;

    private _cb: (num?: number) => void = null;
    public init(param: any[]): void {
        if (param) {
            const type = Number(param[0]);
            if (type === 1) { //
                this.LabTitle.string = i18n.tt(Lang.res_recovery_title);
                this.updateDefault(param[1]);
            } else {
                this.LabTitle.string = i18n.tt(Lang.res_recovery_all);
                const str = param[1] as string;
                const strCfg = str.split(':');
                this.updateAll(Number(strCfg[0]), Number(strCfg[1]));
            }
        }
        if (param && param[2]) {
            this._cb = param[2];
        }
    }

    protected start(): void {
        super.start();
        UtilGame.Click(this.BtnAdd, () => {
            this.updateCount(1);
        }, this);
        UtilGame.Click(this.BtnRedu, () => {
            this.updateCount(-1);
        }, this);

        UtilGame.Click(this.BtnClose, () => {
            if (this._cb) this._cb(this.curNum);
            this.close();
        }, this);
        UtilGame.Click(this.BtnClose1, () => {
            if (this._cb) this._cb();
            this.close();
        }, this);
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.NdBtnClose, () => {
            this.close();
        }, this);
    }

    /** 最大数量 */
    private maxCount: number = 0;
    /** 单价 */
    private itemPrize: number = 0;
    /** 选中的数量 */
    private curNum: number = 0;

    private updateDefault(d: { cfg: Cfg_Resource, data: ResRecoveredReward }) {
        this.NdAll.active = false;
        this.NdDefault.active = true;
        this.maxCount = d.data.Count;
        /** 是否半价 */
        const half = ModelMgr.I.DailyTaskModel.resCostHalf().state;
        this.itemPrize = d.cfg.CostItemNum * (half ? 0.5 : 1);
        this.curNum = d.data.Count;
        this.SprIconD.loadImage(UtilItem.GetItemIconPathByItemId(d.cfg.CostItemId, 1, true), 1, true);
        this.updateCount(0);
        this.RichContent.string = UtilString.FormatArray(i18n.tt(Lang.res_recovery_tip), [d.cfg.Des, UtilColor.GreenV, d.data.Count]);
    }

    private updateAll(itemId: number, itemNum: number) {
        this.NdAll.active = true;
        this.NdDefault.active = false;
        this.SprIcon.loadImage(UtilItem.GetItemIconPathByItemId(itemId, 1, true), 1, true);
        this.LabNum.string = itemNum.toString();
    }

    private updateCount(num: number) {
        this.curNum += num;
        if (this.curNum <= 1) {
            this.curNum = 1;
        }
        if (this.curNum >= this.maxCount) {
            this.curNum = this.maxCount;
        }
        this.LabInput.string = this.curNum.toString();
        // 计算总价格
        const totalPrize = this.itemPrize * this.curNum;
        this.LabNumD.string = totalPrize.toString();
    }
}
