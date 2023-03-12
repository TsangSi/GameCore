/*
 * @Author: myl
 * @Date: 2022-08-01 15:14:56
 * @Description:
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { NoticeMsg } from '../ChatConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChatSysItem extends cc.Component {
    @property(cc.RichText)
    private Rich: cc.RichText = null;

    public setData(dta: any, index: number): void {
        const data = dta as ChatData;
        if (data.SenderInfo) {
            this.Rich.string = `<img src='img_lt_1' /> <color=${UtilColor.WhiteD}>${data.SenderInfo.Nick}：</color>${data.Content}`;
        } else {
            const dtas = dta as NoticeMsg;
            this.Rich.string = `<img src='img_lt_2' /> ${dtas.msg}`;
        }
        this.Rich.node.active = true;
        // this.Rich.node.opacity = 255;
    }
}
