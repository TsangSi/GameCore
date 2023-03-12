/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-07-12 20:38:56
 * @FilePath: \SanGuo2.4\assets\script\game\com\attr\v\AttrTips.ts
 * @Description: 属性加成
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilGame } from '../../../base/utils/UtilGame';
import { ViewConst } from '../../../const/ViewConst';
import WinBase from '../../win/WinBase';
import { AttrName, EAttrKey } from '../AttrFvConst';

/** 展示样式 */
export const enum EAttrShowMode {
    /** 常用的属性展示： NdName是黄色字，NdSub里的属性名和值都是白色 */
    Normal = 0,
    /** 绿色加成样式： NdName是黄色字，NdSub里的属性名和值都是白色 */
    GreenAdd = 1,
}

/* 属性展示的数据形式 0：属性数据 1：直接的文字数据 */
export const enum EAttrDataMode {
    /** 0 属性数据 */
    Normal = 0,
    /** 1 外部生成要展示的文字数据传入 */
    CreateAttrDataByEx = 1,
}

export interface IAttrData {
    title: string,
    sub: { name: string, value: string }[],
}

/** 数据条数超过这个值就改为用scrollview */
const MaxLen = 12;

const { ccclass, property } = cc._decorator;

@ccclass
export default class AttrTips extends WinBase {
    @property(cc.Node)
    private NdClose: cc.Node = null;
    @property(cc.Label)
    private LabTitle: cc.Label = null;

    // 根据长度决定使用layout还是scroview
    @property(cc.Node)
    private NdLayout: cc.Node = null;
    @property(cc.ScrollView)
    private Sv: cc.ScrollView = null;
    // 子控件
    @property(cc.Node)
    private NdName: cc.Node = null;
    @property(cc.Node)
    private NdSub: cc.Node = null;

    /** 展示的文本颜色等差别 */
    private _showMode: EAttrShowMode = EAttrShowMode.Normal;
    /** 文字数据 */
    private _dataList: IAttrData[] = [];
    /** 属性数据 */
    private _attrList: FightAttrData[] = [];

    protected start(): void {
        super.start();

        UtilGame.Click(this.NdClose, () => {
            this.onClose();
        }, this);

        UtilGame.Click(this.NodeBlack, () => {
            this.onClose();
        }, this, { scale: 1 });
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    /**
     *
     * @param data
     * data [0]
     * data [1] 代表属性从外部传入 还是内部生成  1 代表外部传入 否则内部生成
     */
    public init(data: unknown): void {
        if (data && data[0]) {
            if (data[2]) {
                this._showMode = data[2];
            }

            if (data[1] === EAttrDataMode.CreateAttrDataByEx) {
                this._dataList = data[0] as IAttrData[];// 外部传入属性
                this.uptContent();
            } else {
                this._attrList = data[0] as FightAttrData[];// 内部自己生成属性列表
                this.uptUI();
            }
        }
    }

    /** 属性数据的长度 */
    private getAttrDataLen(): number {
        let count: number = 0;
        if (this._attrList && this._attrList.length > 0) {
            for (let i = 0; i < this._attrList.length; i++) {
                const attrs = this._attrList[i].Attrs;
                count += attrs.length + 1;
            }
        }
        return count;
    }

    /** 属性数据转换展示 */
    private uptUI() {
        if (!this._attrList || !this._attrList.length) {
            console.log('没有数据');
            return;
        }
        // 标题
        this.LabTitle.string = i18n.tt(Lang.attr_details);
        // 展示的内容
        const len = this.getAttrDataLen();
        const isSv = len >= MaxLen;
        this.NdLayout.active = !isSv;
        this.Sv.node.active = isSv;

        for (let i = 0; i < this._attrList.length; i++) {
            const attr: FightAttrData = this._attrList[i];
            // 取不到值容易undefind 加一个默认’属性‘
            const names = AttrName[EAttrKey[attr.Key]] ? AttrName[EAttrKey[attr.Key]] : i18n.tt(Lang.item_tips_base_attr_title);
            const ndTitle = cc.instantiate(this.NdName);
            ndTitle.active = true;
            ndTitle.getChildByName('LabName').getComponent(cc.Label).string = names;

            if (isSv) {
                this.Sv.content.addChild(ndTitle);
                ndTitle.setPosition(-this.Sv.node.width / 2 - 20, 0);
            } else {
                this.NdLayout.addChild(ndTitle);
                ndTitle.setPosition(-this.NdLayout.width / 2 - 20, 0);
            }

            attr.Attrs.sort((a, b) => a.K - b.K);
            for (let j = 0; j < attr.Attrs.length; j++) {
                const name = UtilAttr.GetAttrName(attr.Attrs[j].K);
                const value = attr.Attrs[j].V;
                const ndSub = cc.instantiate(this.NdSub);
                ndSub.active = true;
                ndSub.getChildByName('LabSubName').getComponent(cc.Label).string = name;
                const NdSubValue: cc.Node = ndSub.getChildByName('LabSubValue');
                NdSubValue.getComponent(cc.Label).string = `+${value}`;
                if (this._showMode === EAttrShowMode.GreenAdd) {
                    NdSubValue.color = UtilColor.ColorEnough;
                }
                ndSub.setPosition(0, 0);
                if (isSv) {
                    this.Sv.content.addChild(ndSub);
                } else {
                    this.NdLayout.addChild(ndSub);
                }
            }
        }
    }

    /** 直接的文本数据展示 */
    private uptContent() {
        if (!this._dataList || !this._dataList.length) {
            console.log('没有数据');
            return;
        }
        // 标题
        this.LabTitle.string = i18n.tt(Lang.attr_details);
        // 展示的内容
        const len = this.getAttrDataLen();
        const isSv = len >= MaxLen;
        this.NdLayout.active = !isSv;
        this.Sv.node.active = isSv;

        for (let i = 0; i < this._dataList.length; i++) {
            const data: IAttrData = this._dataList[i];
            const names = data.title;
            const ndTitle = cc.instantiate(this.NdName);
            ndTitle.active = true;
            ndTitle.getChildByName('LabName').getComponent(cc.Label).string = names;

            if (isSv) {
                this.Sv.node.addChild(ndTitle);
                ndTitle.setPosition(-this.Sv.node.width / 2, 0);
            } else {
                this.NdLayout.addChild(ndTitle);
                ndTitle.setPosition(-this.NdLayout.width / 2, 0);
            }

            for (let j = 0; j < data.sub.length; j++) {
                const name = data.sub[j].name;
                const value = data.sub[j].value;
                const ndSub = cc.instantiate(this.NdSub);
                ndSub.active = true;
                ndSub.getChildByName('LabSubName').getComponent(cc.Label).string = name;
                const NdSubValue: cc.Node = ndSub.getChildByName('LabSubValue');
                NdSubValue.getComponent(cc.Label).string = value;
                if (this._showMode === EAttrShowMode.GreenAdd) {
                    NdSubValue.color = UtilColor.ColorEnough;
                }
                ndSub.setPosition(0, 0);
                if (isSv) {
                    this.Sv.node.addChild(ndSub);
                } else {
                    this.NdLayout.addChild(ndSub);
                }
            }
        }
    }

    private onClose() {
        WinMgr.I.close(ViewConst.AttrTips);
    }
}
