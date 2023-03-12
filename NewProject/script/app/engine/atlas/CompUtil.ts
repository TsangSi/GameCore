/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable dot-notation */
export class CompUtil {
    /** 给label texture 创建uuid */
    public static createLabelUuid(lab: cc.Label): string {
        const char = lab.string;
        const color = lab.node.color['_val'];
        const fontsize = lab.fontSize;

        let fontFamily = lab.fontFamily;
        if (lab['_N$file']?._fontFamily) fontFamily = lab['_N$file']._fontFamily;

        // const fontfamily = lab.fontFamily;
        const eWText = lab.enableWrapText ? 1 : 0;
        const isItalic = lab.enableItalic ? 1 : 0;
        const isBold = lab.enableBold ? 1 : 0;
        const isUnderline = lab.enableUnderline ? 1 : 0;
        const overflow = lab.overflow;
        const uuid = `${char}_${fontsize}_${fontFamily}_${eWText}_${isItalic}_${color}_${isBold}_${isUnderline}_${overflow}`;
        return uuid;
    }

    public static createRichTextUuid(RT: cc.RichText): string {
        return `${RT.uuid}_${RT.string}_${RT.fontSize}_${RT.node.color.toHEX('#rrggbb')}`;
    }
}
