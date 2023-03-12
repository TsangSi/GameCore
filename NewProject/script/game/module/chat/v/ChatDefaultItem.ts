import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilRichString } from '../../../../app/base/utils/UtilRichString';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { DynamicImage } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilHead from '../../../base/utils/UtilHead';
import UtilItem from '../../../base/utils/UtilItem';
import UtilTitle from '../../../base/utils/UtilTitle';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { CHAT_CHANNEL_ENUM } from '../ChatConst';
import { ChatCopyTip } from './ChatCopyTip';
import { CustomRichText } from './CustomRichText';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChatDefaultItem extends cc.Component {
    /** -------defalut-------- */
    @property({ type: cc.Sprite })
    private NdAvator: cc.Sprite = null;
    @property({ type: cc.Sprite })
    private NdAvatorFrame: cc.Sprite = null;
    @property({ type: cc.Label })
    private LabUName: cc.Label = null;
    @property({ type: CustomRichText })
    private RichWork: CustomRichText = null;
    @property({ type: cc.Label })
    private LabVip: cc.Label = null;
    @property({ type: cc.Node })
    private NdTitle: cc.Node = null;
    @property({ type: DynamicImage })
    private DyWorld: DynamicImage = null;
    @property({ type: cc.Node })
    private NdBao: cc.Node = null;
    @property(cc.Label)
    private LabFamily: cc.Label = null;

    @property(cc.Node)
    private NdText: cc.Node = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;

    private _data: ChatData = null;
    private readonly maxWidth = 440;
    private _dataContent = '';
    private _defaultBubble: cc.SpriteFrame = null;
    private _selectType: number = 0;
    protected start(): void {
        this._defaultBubble = this.NdBao.getComponent(cc.Sprite).spriteFrame;
        UtilGame.Click(this.NdAvator.node, () => {
            if (this._data.SenderInfo.UserId === RoleMgr.I.info.userID) {
                console.log('点击自己头像 跳转自己的详情页');
                return;
            }
            // 传递世界坐标
            const wPos = this.NdAvator.node.convertToWorldSpaceAR(cc.v2(60, -70));
            EventClient.I.emit(E.Chat.ScanUserInfo, [wPos, this._data]);
        }, this, { scale: 1 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public setData(data: ChatData, _idx: number, selectType: number): void {
        if (data === this._data) {
            if (this.RichWork.node.active === false) {
                this.RichWork.node.active = true;
            }
            return;
        }
        this._data = data;
        this._selectType = selectType;
        EventClient.I.emit(E.Chat.RemoveCopyBtn);
        // this._type = this._data.ChatType;
        this.setMsgUI();
    }

    private setMsgUI() {
        this._dataContent = this._data.Content;

        const atInfo: AtInfo = this._data.AtInfo;
        if (atInfo == null) {
            let clickInfo = this._dataContent;
            if (this._data?.IntArray?.length || this._data?.StrArray?.length) {
                const itemInfo = ModelMgr.I.ChatModel.getObjInfo(this._data.IntArray, this._data?.StrArray, true);
                this._dataContent += `${UtilRichString.RichPureText(itemInfo.name0)}${itemInfo.name}`;
                if (itemInfo.exParam) {
                    // eslint-disable-next-line max-len
                    clickInfo = `${itemInfo.name0}<u><color=${itemInfo.color} click='|21,${this._data.ShowId},${this._data.ChatType},${itemInfo.exParam}|' >${itemInfo.name}</c></u>`;
                } else {
                    // eslint-disable-next-line max-len
                    clickInfo = `${itemInfo.name0}<u><color=${itemInfo.color} click='|21,${this._data.ShowId},${this._data.ChatType}|' >${itemInfo.name}</c></u>`;
                }
                this.RichWork.maxWidth = this._dataContent.length > 20 ? this.maxWidth : 0;
            }
            const nRstr = `<color=#904b4b>${clickInfo}</color>`;
            this.RichWork.string = UtilString.textToImageSrc(nRstr);
            this.resetBallSize();
        } else {
            const txt = this._dataContent;
            const uid = `@[${atInfo.UserId}]`;
            const uName = `<color=${UtilColor.GreenV}>@[${UtilGame.ShowNick(atInfo.ShowAreaId, atInfo.Nick)}]</color>`;
            const content = txt.replace(uid, uName);
            const contentNew = UtilString.textToImageSrc(content);
            const nRstr = `<color=#904b4b>${contentNew}</color>`;
            this.RichWork.string = nRstr;
            this.resetBallSize(`@[${UtilGame.ShowNick(atInfo.ShowAreaId, atInfo.Nick)}]`);
        }

        // this.SprSelf.node.active = false;// this._data.SenderInfo.UserId === RoleMgr.I.info.userID;
        this.LabUName.string = `${UtilGame.ShowNick(this._data.SenderInfo.AreaId, this._data.SenderInfo.Nick)}`;

        const vipName = ModelMgr.I.VipModel.getVipName(this._data.SenderInfo.VIP ?? 1);

        this.LabVip.string = vipName;// `${vipName.slice(0, ModelMgr.I.SettingModel.getSpecialPower() ? 4 : 2)}`;
        const worldSrc = this._data.ChatType === 1 ? RES_ENUM.Chat_Emoji_Img_Lt_1 : RES_ENUM.Chat_Emoji_Img_Lt_3;
        this.DyWorld.loadImage(worldSrc, 1, true);
        UtilHead.setHead(this._data.SenderInfo.Head, this.NdAvator, this._data.SenderInfo.HeadFrame, this.NdAvatorFrame);

        const sp = this.NdBao.getComponent(cc.Sprite);
        sp.spriteFrame = this._defaultBubble;

        UtilHead.setBubble(this._data.SenderInfo.Bubble, sp, true);

        // this.SprBao.loadImage(`${RES_ENUM.Com_Bubble}${this._data.SenderInfo.Bubble}@9[0_0_60_60]`, 1, true, '', true);

        /** 官职调整 俩天不显示 */
        // if (this._data.SenderInfo.OfficeLevel) {
        //     this.LabOfficial.node.active = true;
        //     const officialInfo = ModelMgr.I.RoleOfficeModel.getOfficialInfo(this._data.SenderInfo.OfficeLevel);
        //     this.LabOfficial.string = `【${officialInfo.name1}•${officialInfo.name2}】`;
        //     UtilColorFull.resetMat(this.LabOfficial);
        //     if (officialInfo.conf.Quality === ItemQuality.COLORFUL) {
        //         UtilColorFull.setColorFull(this.LabOfficial, true);
        //     } else {
        //         this.LabOfficial.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(officialInfo.conf.Quality, true));
        //     }
        // } else {
        //     this.LabOfficial.node.active = false;
        // }

        UtilTitle.setTitle(this.NdTitle, this._data.SenderInfo.Title);
        this.NdTitle.active = this._data.SenderInfo.Title !== null;

        /** 世家相关 */
        if (this._selectType === CHAT_CHANNEL_ENUM.Current && this._data.SenderInfo.FamilyPos) {
            this.LabFamily.node.active = true;
            const famMod = ModelMgr.I.FamilyModel;
            const posName = famMod.getPosNameById(this._data.SenderInfo.FamilyPos || 4);
            this.LabFamily.string = `[${posName}]`;
            this.LabFamily.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(famMod.getPosQuality(this._data.SenderInfo.FamilyPos), true));
        } else {
            this.LabFamily.node.active = false;
        }

        // 大表情相关
        if (this._data.BigIcon > 0) {
            this.NdText.active = false;
            this.SprIcon.node.active = true;
            const config: Cfg_Emoji = Config.Get(Config.Type.Cfg_Emoji).getValueByKey(this._data.BigIcon);
            this.SprIcon.loadImage(`texture/chat/emoji/${config.ResId}`, 1, true);
        } else {
            this.NdText.active = true;
            this.SprIcon.node.active = false;
        }
    }

    private resetBallSize(replaceString?: string) {
        // this.RichWork.node.active = true;
        // this.RichWork.node.opacity = 255;
        const conf = {
            // eslint-disable-next-line dot-notation
            fontFamily: this.RichWork.font['_fontFamily'],
            fSize: 22,
            maxWidth: 440,
            lineHeight: 25,
            emojiWidth: 35,
            tipImgWidth: 0,
            richString: replaceString ? UtilString.replaceAtInfo(this._dataContent, replaceString) : this._dataContent,
        };
        // conf.maxWidth = this.RichWork.maxWidth;
        const vSize: cc.Size = UtilRichString.NormalRichStringSize(conf);
        this.RichWork.maxWidth = vSize.width >= this.maxWidth ? this.maxWidth : 0;
        this.RichWork.node.active = true;
        this.NdBao.setContentSize(cc.size(vSize.width + 45, 86));
    }

    private copy(): void {
        EventClient.I.emit(E.Chat.RemoveCopyBtn);
        ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Chat_ChatCopyTip, this.node, (err, nd) => {
            // 放置在气泡上 防止出现多个copy按钮出现
            const worldPos = this.NdBao.convertToWorldSpaceAR(cc.v2(this.NdBao.width / 2, -20));
            const curPos = this.node.convertToNodeSpaceAR(worldPos);
            if (!err) {
                nd.setPosition(curPos);
                nd.getComponent(ChatCopyTip).setConfig(this._data.Content);
                // nd.scaleX = this.NdText.scaleX;
            }
        });
    }
}
