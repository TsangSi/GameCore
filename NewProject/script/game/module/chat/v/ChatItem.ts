/*
 * @Author: myl
 * @Date: 2022-07-29 16:56:37
 * @Description:
 */
import { CustomRichText } from './CustomRichText';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../app/base/utils/UtilString';
import ModelMgr from '../../../manager/ModelMgr';
import { NoticeMsg } from '../ChatConst';
import { UtilGame } from '../../../base/utils/UtilGame';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChatItem extends cc.Component {
    @property({ type: cc.Node })
    private NdSys: cc.Node = null;

    @property({ type: CustomRichText })
    private RichSys: CustomRichText = null;

    // dta : ChatData | { cfg: Cfg_Notice, msg: string; }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public setLobby(dta: any): string {
        const data = dta as ChatData;
        if (data.SenderInfo) {
            const atInfo: AtInfo = data.AtInfo;
            if (atInfo == null) {
                let clickInfo = '';
                const content = UtilString.textToImageSrc(data.Content);
                if (data?.IntArray?.length || data?.StrArray?.length) {
                    const itemInfo = ModelMgr.I.ChatModel.getObjInfo(data.IntArray, data.StrArray);
                    clickInfo = `${itemInfo.name0}<u><color=${itemInfo.color} click='|21,${data.ShowId},${data.ChatType}|' >${itemInfo.name}</c></u>`;
                    if (itemInfo.exParam) {
                        // eslint-disable-next-line max-len
                        clickInfo = `${itemInfo.name0}<u><color=${itemInfo.color} click='|21,${data.ShowId},${data.ChatType},${itemInfo.exParam}|' >${itemInfo.name}</c></u>`;
                    } else {
                        // eslint-disable-next-line max-len
                        clickInfo = `${itemInfo.name0}<u><color=${itemInfo.color} click='|21,${data.ShowId},${data.ChatType}|' >${itemInfo.name}</c></u>`;
                    }
                }
                const officialString = '';
                // if (data.SenderInfo.OfficeLevel) {
                //     const officialInfo = ModelMgr.I.RoleOfficeModel.getOfficialInfo(data.SenderInfo.OfficeLevel);
                //     const officialName = `【${officialInfo.name1}•${officialInfo.name2}】`;
                //     const officialColor = UtilItem.GetItemQualityColor(officialInfo.conf.Quality, true);
                //     officialString = `<color=${officialColor}>${officialName}</c>`;
                // }
                // eslint-disable-next-line max-len
                this.RichSys.string = `<img src='img_lt_${data.ChatType}@ML' /> ${officialString}<color=${UtilColor.WhiteD}>${UtilGame.ShowNick(data.SenderInfo.AreaId, data.SenderInfo.Nick)}：</color>${content}${clickInfo}`;
            } else {
                const txt = data.Content;
                const uid = `@[${atInfo.UserId}]`;
                const uName = `<color=${UtilColor.GreenV}>@[${UtilGame.ShowNick(atInfo.ShowAreaId, atInfo.Nick)}]</color>`;
                const content = txt.replace(uid, uName);
                const content1 = UtilString.textToImageSrc(content);
                const officialString = '';
                // if (data.SenderInfo.OfficeLevel) {
                //     const officialInfo = ModelMgr.I.RoleOfficeModel.getOfficialInfo(data.SenderInfo.OfficeLevel);
                //     const officialName = `【${officialInfo.name1}•${officialInfo.name2}】`;
                //     const officialColor = UtilItem.GetItemQualityColor(officialInfo.conf.Quality, true);
                //     officialString = `<color=${officialColor}>${officialName}</c>`;
                // }
                // eslint-disable-next-line max-len
                this.RichSys.string = `<img src='img_lt_${data.ChatType}@ML' /> ${officialString}<color=${UtilColor.WhiteD}>${data.SenderInfo.Nick}：</color>${content1}`;
            }
        } else {
            const dtas = dta as NoticeMsg;
            this.RichSys.string = `<img src='img_lt_2@ML' /> ${dtas.msg}`;
        }
        this.updateLayout();
        return this.RichSys.string;
    }

    private updateLayout() {
        this.NdSys.getComponent(cc.Layout).updateLayout();
        this.node.getComponent(cc.Layout).updateLayout();
    }
}
