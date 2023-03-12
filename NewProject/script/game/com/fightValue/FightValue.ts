/*
 * @Author: hwx
 * @Date: 2022-07-12 15:27:41
 * @FilePath: \SanGuo2.4-main\assets\script\game\com\fightValue\FightValue.ts
 * @Description: 战力
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { UtilGame } from '../../base/utils/UtilGame';
import { E } from '../../const/EventName';
import { ViewConst } from '../../const/ViewConst';
import ModelMgr from '../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class FightValue extends BaseCmp {
    @property(cc.Label)
    private LabFv: cc.Label = null;

    @property(cc.Node)
    private NdDetailBtn: cc.Node = null;

    @property
    private _hideDetailBtn = false;
    @property
    public get hideDetailBtn(): boolean { return this._hideDetailBtn; }
    public set hideDetailBtn(value: boolean) {
        this._hideDetailBtn = value;
        this.NdDetailBtn.active = !value;
    }

    @property
    public zeroForHide = false;

    /** 战力属性ID */
    private _fvAttrIds: number[] = [];
    /** 战力属性数据 */
    private _fvAttrDatas: FightAttrData[] = [];
    /** 详情回调 */
    private detailCallback: () => void;

    protected start(): void {
        super.start();
        if (!this.hideDetailBtn) {
            UtilGame.Click(this.NdDetailBtn, this.onClickDetailBtn, this);
        }
    }

    protected onDestroy(): void {
        if (this._fvAttrIds?.length) {
            EventClient.I.off(E.AttrFv.UptAttrFv, this.onUptAttrFv, this);
        }
    }

    private onClickDetailBtn(): void {
        if (this._fvAttrDatas?.length) {
            WinMgr.I.open(ViewConst.AttrTips, this._fvAttrDatas);
        }
        if (this.detailCallback) {
            this.detailCallback();
        }
    }

    /**
     * 设置监听的战力属性ID
     * @param fvAttrId 有参数时，启动战力属性变化监听、显示战力详情按钮，反之取监、隐藏
     */
    public setOnFvAttrId(...fvAttrIds: number[]): void {
        this._fvAttrIds = fvAttrIds;
        if (this._fvAttrIds?.length) {
            this.hideDetailBtn = false;
            // 更新属性战力
            this.onUptAttrFv();

            /** 监听事件 */
            UtilGame.Click(this.NdDetailBtn, this.onClickDetailBtn, this);
            EventClient.I.on(E.AttrFv.UptAttrFv, this.onUptAttrFv, this);
        } else {
            // 没有战力属性ID，就隐藏详情按钮
            this.hideDetailBtn = true;

            /** 关闭事件 */
            this.NdDetailBtn.targetOff(this);
            EventClient.I.off(E.AttrFv.UptAttrFv, this.onUptAttrFv, this);
        }
    }

    /**
     * 监听属性战力
     */
    private onUptAttrFv(): void {
        // 使用功能ID获取总战力
        this._fvAttrDatas.length = 0;
        let fv: number = 0;
        this._fvAttrIds?.forEach((id, index) => {
            const attr = ModelMgr.I.AttrFvModel.getAttrData(id);
            if (attr?.Attrs?.length) {
                this._fvAttrDatas.push(attr);
                fv += this._fvAttrDatas[index]?.Fv || 0;
            }
        });
        if (this._fvAttrDatas) {
            this.NdDetailBtn.active = fv > 0;
            this.setValue(fv);
        }
    }

    /**
     * 设置战力
     * @param fv
     */
    public setValue(fv: number): void {
        this.LabFv.string = `${UtilNum.ConvertFightValue(fv)}`;
        this.LabFv.spacingX = 0;
        this.node.active = !(this.zeroForHide && fv === 0);
    }

    /**
     * 获取战力值
     * @returns
     */
    public getFvAttrDatas(): FightAttrData[] {
        return this._fvAttrDatas || [];
    }

    /**
     * 设置战力属性数据
     * @param fvAttrData
     */
    public setFvAttrData(...fvAttrDatas: FightAttrData[]): void {
        this._fvAttrDatas = fvAttrDatas;
    }

    /** 设置详情回调 */
    public setDetailCallback(callback: () => void): void {
        this.detailCallback = callback;
    }
}
