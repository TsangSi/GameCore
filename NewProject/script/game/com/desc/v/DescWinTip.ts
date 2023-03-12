/*
 * @Author: dcj
 * @Date: 2022-08-16 18:49:55
 * @FilePath: \SanGuo\assets\script\game\com\desc\v\DescWinTip.ts
 * @Description:
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { Config } from '../../../base/config/Config';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import WinBase from '../../win/WinBase';

const { ccclass, property } = cc._decorator;

/**
 * 传入ID 则直接读表
 * 传入字符串，则读字符串
 */
@ccclass
export class DescWinTip extends WinBase {
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    /** 标题 */
    @property(cc.Label)
    private lbTitle: cc.Label = null;

    /** 内容 */
    @property(cc.RichText)
    private richText: cc.RichText = null;

    /** 滑动区域 */
    @property(cc.Node)
    private NdScroll: cc.Node = null;

    private maxHeight: number = 900;
    protected start(): void {
        super.start();
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });

        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);
    }

    protected close(): void {
        super.close();
    }
    /**
     * 奖励列表
     * @param params
     */
    public init(params: number[]): void {
        const id: number = params[0];
        const cfgIndexer = Config.Get(Config.Type.Cfg_ClientMsg);
        const name: string = cfgIndexer.getValueByKey(id, 'Module');
        const descStr: string = cfgIndexer.getValueByKey(id, 'MSG');
        this.lbTitle.string = name;
        this.richText.string = `<color=${UtilColor.NorV}>${descStr}</c>`;

        if (this.richText.node.height <= 300) {
            const strFinally = `${descStr}\n\n\n`;
            this.richText.string = `<color=${UtilColor.NorV}>${strFinally}</c>`;
        } else if (this.richText.node.height > this.maxHeight) {
            this.NdScroll.getComponent(cc.Layout).enabled = false;
            this.NdScroll.getComponent(cc.ScrollView).enabled = true;

            const scrollviewNode = this.NdScroll.getChildByName('View');
            scrollviewNode.getComponent(cc.Layout).enabled = false;
            this.NdScroll.height = this.maxHeight - 100;
            scrollviewNode.height = this.maxHeight - 100;
        }
    }

    public onDestroy(): void {
        super.onDestroy();
    }
}
