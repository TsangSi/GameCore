import { HtmlTextParser } from './UtilHtmlTextParser';
import { UtilString } from './UtilString';

/*
 * @Author: myl
 * @Date: 2022-08-11 17:06:56
 * @Description:
 */
const canvas = document.createElement('canvas');
function context2d(): CanvasRenderingContext2D {
    return canvas.getContext('2d');
}
/** 表情匹配 */
const seg = /#(\d+)#/g;

/** 1.26 是个很神奇的数字  richtext 单行时 高度为行高的1.26倍 */
const RichTextRate = 1.26;
/** 表情宽度 */
const RichEmojiWidth = 40;
/** 频道标识图标宽度 */
const RichSysIconWidth = 58;

export interface IRichTransform {
    fSize: number,
    maxWidth: number,
    lineHeight: number,
    emojiWidth?: number,
    tipImgWidth?: number,
    richString: string,
    fontFamily?: string
}
export class UtilRichString {
    /**
     * 通过文本计算文字高度 （此处需要做平台判断）
     * @param richString 富文本内容（除去标签信息）
     * @param maxWidth 最大宽度
     * @param lineHeight 行高
     * @param imageWidth 如果有图片则图片的宽度
     * @param tipImgWidth 提示图片宽度
     */
    public static StringHeight(
        fSize: number,
        richString: string,
        maxWidth: number,
        lineHeight: number,
        emojiWidth: number = 0,
        tipImgWidth: number = 0,
        fontFamily: string = '',
    ): number {
        if (richString.length <= 0) {
            return 0;
        }
        const c2d = context2d();
        c2d.font = `${fSize}px ${fontFamily}`;
        // 单行高度
        let tW = 0;
        if (maxWidth <= 0) {
            return lineHeight * RichTextRate;
        } else {
            const segu = new RegExp(seg);
            const imageResult = richString.match(segu);
            let tString = richString;
            let iW = 0;
            if (imageResult) {
                for (let i = 0; i < imageResult.length; i++) {
                    const char = imageResult[i];
                    if (UtilString.charIsEmoji(char)) {
                        iW += emojiWidth;
                        tString = tString.replace(char, '');
                    }
                }
            }

            const sW = c2d.measureText(tString).width;
            tW = tipImgWidth + sW + iW;
            return Math.floor(tW / maxWidth) * lineHeight + RichTextRate * lineHeight;
        }
    }

    /** 获取多文字的大小 */
    public static StringSize(
        fSize: number,
        richString: string,
        maxWidth: number,
        lineHeight: number,
        emojiWidth: number = 0,
        tipImgWidth: number = 0,
        fontFamily: string = '',
    ): cc.Size {
        if (richString.length <= 0) {
            return cc.size(0, 0);
        }
        const c2d = context2d();
        c2d.font = `${fSize}px ${fontFamily}`;
        // 单行高度
        let tW = 0;

        const segu = new RegExp(seg);
        const imageResult = richString.match(segu);
        let tString = richString;
        let iW = 0;
        if (imageResult) {
            for (let i = 0; i < imageResult.length; i++) {
                const char = imageResult[i];
                if (UtilString.charIsEmoji(char)) {
                    iW += emojiWidth;
                    tString = tString.replace(char, '');
                }
            }
        }

        // 处理回车键 如果包含回车键 则需要取最长的字符串为取值宽度
        const chars = tString.split('\n');
        let maxLength = 0;
        let maxString = '';
        for (let i = 0; i < chars.length; i++) {
            const ele = chars[i];
            if (ele.length > maxLength) {
                maxLength = ele.length;
                maxString = ele;
            }
        }
        const sW = c2d.measureText(maxString).width;
        tW = tipImgWidth + sW + iW;

        if (tW > maxWidth) {
            // 文字宽度确实大于给定最大宽度值 则需要处理换行问题
            return cc.size(
                maxWidth <= 0 ? tW : maxWidth,
                maxWidth <= 0 ? RichTextRate * lineHeight + (lineHeight * (chars.length - 1))
                    : Math.floor(tW / maxWidth) * lineHeight + RichTextRate * lineHeight,
            );
        } else {
            // 如果实际宽度确实小于给定的最大宽度 那么返回也是实际文字宽度  高度则为单行高度
            return cc.size(tW, RichTextRate * lineHeight + (lineHeight * (chars.length - 1)));
        }
    }

    /** 获取富文本的行数 */
    public static RichLineNumber(
        fSize: number,
        richString: string,
        maxWidth: number,
        lineHeight: number,
        emojiWidth: number = 0,
        tipImgWidth: number = 0,
        fontFamily: string = '',
    ): number {
        if (richString.length <= 0) {
            return 0;
        }
        const c2d = context2d();
        c2d.font = `${fSize}px ${fontFamily}`;
        // 单行高度
        let tW = 0;
        if (maxWidth <= 0) {
            return 1;
        } else {
            const segu = new RegExp(seg);
            const imageResult = richString.match(segu);
            let iW = 0;
            if (imageResult) {
                for (let i = 0; i < imageResult.length; i++) {
                    iW += emojiWidth;
                }
            }
            const tString = richString.replace(seg, '');
            // 处理回车键 如果包含回车键 则需要取最长的字符串为取值宽度
            const chars = tString.split('\n');
            let maxLength = 0;
            let maxString = '';
            for (let i = 0; i < chars.length; i++) {
                const ele = chars[i];
                if (ele.length > maxLength) {
                    maxLength = ele.length;
                    maxString = ele;
                }
            }
            const sW = c2d.measureText(maxString).width;
            tW = tipImgWidth + sW + iW;
            return Math.floor(tW / maxWidth) + 1;
        }
    }

    public static RichStringLineNumWithConfig(conf: IRichTransform): number {
        return this.RichLineNumber(
            conf.fSize,
            conf.richString,

            conf.maxWidth,

            conf.lineHeight,

            conf.emojiWidth,

            conf.tipImgWidth,
            conf.fontFamily,
        );
    }

    /** 聊天默认列表中的富文本高度 */
    public static NormalRichStringHeight(
        fSize: number,
        richString: string,
        maxWidth: number,
        lineHeight: number,
        emojiWidth: number = RichEmojiWidth,
        fontFamily: string = '',
    ): number {
        return this.StringHeight(fSize, richString, maxWidth, lineHeight, emojiWidth, 0, fontFamily);
    }

    /** 可以是正常文字也可以是富文本 */
    public static NormalRichStringSize(conf: IRichTransform): cc.Size {
        return this.StringSize(conf.fSize, conf.richString, conf.maxWidth, conf.lineHeight, conf.emojiWidth, conf.tipImgWidth, conf.fontFamily);
    }

    /** 系统消息富文本高度 */
    public static SysRichStringHeight(
        fSize: number,
        richString: string,
        maxWidth: number,
        lineHeight: number,
        emojiWidth: number = RichEmojiWidth,
        tipImgWidth: number = RichSysIconWidth,
        fontFamily: string = '',
    ): number {
        return this.StringHeight(fSize, richString, maxWidth, lineHeight, emojiWidth, tipImgWidth, fontFamily);
    }

    public static RichStringHeightWithConfig(conf: IRichTransform): number {
        return this.StringHeight(conf.fSize, conf.richString, conf.maxWidth, conf.lineHeight, conf.emojiWidth, conf.tipImgWidth);
    }

    /** 富文本中提取纯净的文本 不包含标签 */
    public static RichPureText(str: string): string {
        const parser = new HtmlTextParser();
        const testArrays = parser.parse(str);// 拆分为数组
        let text = '';
        for (let i = 0; i < testArrays.length; i++) {
            const obj: any = testArrays[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            text += obj.text;
        }
        return text;
    }
}
