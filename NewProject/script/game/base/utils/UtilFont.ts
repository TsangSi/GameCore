export class UtilFont {
    public static GetFontFamily(comp: cc.Label | cc.RichText): string {
        let ff = 'Microsoft YaHei';//   // 给个样式，防止measureText异常 此处必须要有一个默认fontFamily
        if (comp instanceof cc.Label) {
            if (comp._N$file?._fontFamily) {
                ff = comp._N$file._fontFamily;
            }
        } else if (comp instanceof cc.RichText) {
            if (comp._N$font?._fontFamily) {
                ff = comp._N$font._fontFamily;
            }
        }
        return ff;
    }
}
