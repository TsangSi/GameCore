/* eslint-disable no-lonely-if */
import { UtilChar } from '../../base/utils/UtilChar';

export class FrameBlockUtil {
    /** 创建Sprite */
    public static createSpriteNode(): cc.Node {
        const n = new cc.Node();
        n.name = 'labelLayout';
        const comp = n.addComponent(cc.Sprite);
        comp.trim = false;
        comp.sizeMode = cc.Sprite.SizeMode.RAW;
        comp.srcBlendFactor = cc.macro.ONE;
        comp.dstBlendFactor = cc.macro.ONE_MINUS_SRC_ALPHA;
        return n;
    }

    /** 文本的对齐方式转为画布的对齐方式 */
    public static getContextAlign(lab: cc.Label): CanvasTextAlign {
        const _align = lab.horizontalAlign;
        let _alignA: CanvasTextAlign = 'center';
        switch (_align) {
            case cc.Label.HorizontalAlign.LEFT:
                _alignA = 'start';
                break;
            case cc.Label.HorizontalAlign.CENTER:
                _alignA = 'center';
                break;
            case cc.Label.HorizontalAlign.RIGHT:
                _alignA = 'end';
                break;
            default: // center
                _alignA = 'center';
                break;
        }
        // 目前发现，在vivo快应用中，horizontalAlign属性无效
        if (cc.sys.platform === cc.sys.VIVO_GAME) {
            _alignA = 'center';
        }
        return _alignA;
    }

    public static getAnchrX(align: string, broderWidth: number, _w: number): number {
        let _anX: number = 0;
        switch (align) {
            case 'start':
            case 'left':
                _anX = 0 + broderWidth / 2;
                break;
            case 'center':
                _anX = _w / 2 + broderWidth / 2;
                break;
            case 'end':
            case 'right':
                _anX = _w - broderWidth / 2;
                break;
            default:
                _anX = _w / 2 + broderWidth / 2;
                break;
        }
        return _anX;
    }

    public static createRandomNode(): cc.Node {
        const n = new cc.Node();
        n.name = 'labelLayout';
        const c = n.addComponent(cc.Sprite);
        c.trim = false;
        c.sizeMode = cc.Sprite.SizeMode.RAW;
        c.srcBlendFactor = cc.macro.ONE;
        c.dstBlendFactor = cc.macro.ONE_MINUS_SRC_ALPHA;
        return n;
    }

    // public static getCharInfo(
    //     ctx: CanvasRenderingContext2D,
    //     char: string,
    //     maxWidth: number,
    //     lineHeight: number,
    // ): void {
    //     let _w = 0; // 全部文本多宽
    //     let _h = 0;
    //     const _rw = []; // 每行字体宽度
    //     const _row = [];// 放入每行字体

    //     const _allLineTmp = char.split('\n');
    //     if (_allLineTmp.length === 1 && maxWidth <= 0) { // 只有一行
    //         const ssa = UtilChar.isEmojiCharacter(char);
    //         const m = ctx.measureText(ssa);// 测量文本 返回文字格信息 没有返回高度
    //         if (m == null) return;
    //         _row.push(char);
    //         _h = lineHeight;
    //         _w = m.width;
    //         _rw.push(_w);
    //     } else {
    //         // 有换行，好几行。 将每一行拿出来，判断当前这一行的文本是否超出了最大宽度。
    //         // 例如有一行文本是 "hello world"  则拆开为 h e l l o w o r l d
    //         // 紧接着拼接 h  he  hel  hell hello hello w...一直判断是否达到最大宽度
    //         for (let index = 0; index < _allLineTmp.length; index++) {
    //             const element = _allLineTmp[index];// 拿到每行
    //             // 计算自适应高度 也就是设置了最大宽度
    //             let _arg = element.split('');
    //             let _temp = '';
    //             let _mw = 0;
    //             for (let i = 0, l = _arg.length; i < l; i++) {
    //                 const ass = UtilChar.isEmojiCharacter(_temp + _arg[i]);
    //                 _mw = ctx.measureText(ass).width;
    //                 if (maxWidth > 0 && _mw > maxWidth) { // 自然折行
    //                     _row.push(_temp);// 了结当前行
    //                     _temp = '';// 清空已完结的行缓存，下面会将当前字符填入
    //                     _rw.push(_mw);
    //                 } else {
    //                     if (_mw > _w) _w = _mw;// 记录没被终结的最大行宽
    //                 }
    //                 _temp += _arg[i];// 当前字符放到下一行
    //             }
    //             _row.push(_temp);
    //             _rw.push(_mw);
    //             _h = _row.length * lineHeight;
    //             _arg = null;
    //             _temp = '';
    //         }
    //         if (maxWidth > 0) {
    //             _w = maxWidth;
    //         }
    //     }
    // }
}
