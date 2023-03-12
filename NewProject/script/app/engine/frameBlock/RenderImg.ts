/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable brace-style */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-lonely-if */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable default-case */
import { UtilChar } from '../../base/utils/UtilChar';
import { UtilColor } from '../../base/utils/UtilColor';
import { HtmlTextParser, IHtmlTextParserResultObj } from '../../base/utils/UtilHtmlTextParser';
import { CCDynamicAtlasMgr } from '../atlas/CCDynamicAtlasMgr';
import { CompUtil } from '../atlas/CompUtil';
import { FrameBlockUtil } from './FrameBlockUtil';

/** label richtext=>SpriteFrame */
const _htmlTextParser = new HtmlTextParser();
export class RenderImg {
    private static _i: RenderImg = null;
    public static get I(): RenderImg {
        if (this._i == null) {
            this._i = new RenderImg();
        }
        return this._i;
    }

    /** 富文本转图片 */
    public richText2Img(richText: cc.RichText): void {
        const defaultFont = 'Microsoft YaHei';
        const textArray = _htmlTextParser.parse(richText.string);
        if (textArray.length === 0) {
            richText.node.destroyAllChildren();
            return;
        }
        const rtLineHeight = richText.lineHeight;
        const rtFontSize = richText.fontSize;
        const rtFontFamily = richText['_N$font']?._fontFamily ? richText['_N$font']._fontFamily : defaultFont;

        const rtColor = richText.node.color.toString();
        const rtMaxWidth = richText.maxWidth;

        // 微软雅黑 0.75 默认字体

        // simHei 0.65
        // FZSHENGSKSJW_LABEL 0.6
        let addOffSet = 0.55;// 得根据不同的字体调整偏移量
        if (rtFontFamily !== defaultFont) {
            addOffSet = rtFontFamily === 'FZSHENGSKSJW_LABEL' ? 0.45 : 0.6;// 得根据不同的字体调整偏移量
        }
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS) {
            addOffSet = 0.35;// 苹果手机上的偏移量
        }

        // ios特殊处理
        // if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS) {
        // this.prcessIos(richText, textArray);
        // const newStr = '';
        // const isMulti = false;
        // for (let index = 0; index < textArray.length; index++) {
        //     const Element: IHtmlTextParserResultObj = textArray[index];
        //     if (Element.style) {
        //         if (Element.style['multiColor']) { // 富文本彩虹字
        //             isMulti = true;
        //             if (Element.style['multiColor'].color === '1') {
        //                 // newStr += Utils.I.getRainBowStr(Element.text);
        //             } else {
        //                 // newStr += Utils.I.getDarkRainBowStr(Element.text);
        //             }
        //         } else {
        //             newStr += `<color=${Element.style.color}>${Element.text}</c>`;
        //         }
        //     }
        // }
        // if (isMulti) {
        //     setTimeout(() => {
        //         if (richText && richText.node) {
        //             richText.string = newStr;
        //         }
        //     }, 0);
        // }
        // addOffSet = 0.35;
        // }

        // 1、清除画布 拿到画笔
        const _canvas = this.canvas;
        if (this.ctx2d == null) this.ctx2d = _canvas.getContext('2d');
        this.ctx2d.clearRect(0, 0, _canvas.width, _canvas.height);

        const ff = rtFontFamily; // 给个样式，防止measureText异常 此处必须要有一个默认fontFamily
        const _b = `${rtFontSize}px ${ff}`;
        this.ctx2d.font = _b;

        // 计算每行的信息
        let _w = 0;
        let _h = 0;
        const _row = [];// 所有行
        let _temp = [];// 当前行缓存的数据

        for (let i = 0; i < textArray.length; ++i) {
            const richTextElement: IHtmlTextParserResultObj = textArray[i];
            const text = richTextElement.text;
            // handle <br/> <img /> tag
            if (text === '') { // 文本是空的 中间行是空的 例如换行标签  img标签等
                if (richTextElement.style && richTextElement.style['newline']) {
                    _row.push(_temp);
                    _temp = [];
                    continue;
                }
                if (richTextElement.style && richTextElement.style.isImage && richText.imageAtlas) {
                    const spriteFrameName = richTextElement.style.src;
                    const spriteFrame = richText.imageAtlas.getSpriteFrame(spriteFrameName);
                    if (spriteFrame) {
                        const t: cc.Rect = spriteFrame.getRect();
                        let _mw = 0;// 图片所占用的宽度
                        let _mh = 0;// 图片所占用的高度
                        if (t.height > rtLineHeight) {
                            _mw = t.width * rtLineHeight / t.height;
                            _mh = rtLineHeight;
                        } else {
                            _mw = t.width;
                            _mh = t.height;
                        }
                        if (rtMaxWidth > 0) {
                            let _alreadyLen = 0;// 本行已占有宽度
                            for (let index = 0; index < _temp.length; index++) {
                                _alreadyLen += _temp[index].width;
                            }
                            if (_alreadyLen + _mw > rtMaxWidth) { // 自然折行
                                _row.push(_temp);// 了结当前行
                                _temp = [];// 清空已完结的行缓存
                            }
                        }
                        _temp.push({
                            type: 2, text: spriteFrameName, width: _mw, height: _mh,
                        });
                    }
                    // 如果图片加入到temp后超出了富文本的宽度，需要将本行结算，图片放在下一行
                    continue;
                }
            }

            const multilineTexts = text.split('\n');
            for (let j = 0; j < multilineTexts.length; ++j) {
                const labelString = multilineTexts[j];
                if (labelString === '') {
                    //
                } else if (rtMaxWidth > 0) { // 限宽
                    let _arg = labelString.split('');
                    let _tempStr = '';// 当前文本区域已确定的字符
                    let _mwl = 0;// 当前文本区域已确定的字符所占用的宽度
                    let _c = '#ffffff';
                    if (richTextElement.style) {
                        _c = richTextElement.style.color;
                    }
                    // else if (Game.I.isSmallGame()) {
                    //     _c = Utils.I.rgb2hex(richText.node.color);
                    // }
                    else {
                        _c = rtColor;
                    }
                    for (let i = 0, l = _arg.length; i < l; i++) {
                        const ssa = UtilChar.isEmojiCharacter(_tempStr + _arg[i]);
                        const _mw = this.ctx2d.measureText(ssa).width;// 预判宽度（当前文本区域已确定的字符+新字符）所占用的宽度
                        let _alreadyLen = 0;// 本行已占有宽度
                        for (let index = 0; index < _temp.length; index++) {
                            _alreadyLen += _temp[index].width;
                        }
                        if (_alreadyLen + _mw > rtMaxWidth) { // 自然折行
                            _temp.push({
                                type: 1, text: _tempStr, color: _c, style: richTextElement.style, width: _mwl,
                            });
                            _row.push(_temp);// 了结当前行
                            _temp = [];// 清空已完结的行缓存
                            _tempStr = '';// 下面会将当前字符填入下一行
                            _mwl = _mw - _mwl;// 取差值为新字符的宽度
                        } else {
                            _mwl = _mw;// 记录没被终结的最大行宽
                        }
                        _tempStr += _arg[i];// 当前字符填入
                    }
                    _temp.push({
                        type: 1, text: _tempStr, color: _c, style: richTextElement.style, width: _mwl,
                    });
                    _arg = null;
                    _tempStr = '';
                } else { // 不限宽
                    const ssa = UtilChar.isEmojiCharacter(labelString);
                    const m = this.ctx2d.measureText(ssa);
                    if (m == null) return;
                    const width = m.width;
                    let _c = '#ffffff';
                    if (richTextElement.style) {
                        _c = richTextElement.style.color;
                    }
                    // else if (Game.I.isSmallGame()) {
                    //     _c = Utils.I.rgb2hex(richText.node.color);
                    // }
                    else {
                        _c = rtColor;
                    }
                    _temp.push({
                        type: 1, text: labelString, color: _c, style: richTextElement.style, width,
                    });
                }
                if (j !== multilineTexts.length - 1) { // 强制换行
                    _row.push(_temp);
                    _temp = [];
                }
            }
        }

        if (_temp.length > 0) _row.push(_temp);
        for (let i = 0; i < _row.length; i++) {
            let _mw = 0;
            for (let j = 0; j < _row[i].length; j++) {
                const element = _row[i][j];
                _mw += element.width;
            }
            _w = _mw > _w ? _mw : _w;
        }
        _h = rtLineHeight * _row.length;

        // 获得画布宽高 此处计算有问题》》》》》》》》》》》》
        _canvas.width = _w;// 如果有描边。则需要+宽度 +高度
        _canvas.height = _h;
        // 渲染
        const imgs: { img: cc.SpriteFrame, dstrt: cc.Rect; }[] = [];
        for (let i = 0; i < _row.length; i++) {
            let offset = 0;// 元素在当前行的偏移位置
            let _alreadyLen = 0;// 本行总宽度
            switch (richText.horizontalAlign) {
                case cc.macro.TextAlignment.LEFT:
                    offset = 0;
                    break;
                case cc.macro.TextAlignment.CENTER:
                    for (let index = 0; index < _row[i].length; index++) {
                        _alreadyLen += _row[i][index].width;
                    }
                    offset = (_canvas.width - _alreadyLen) / 2;
                    break;
                case cc.macro.TextAlignment.RIGHT:
                    for (let index = 0; index < _row[i].length; index++) {
                        _alreadyLen += _row[i][index].width;
                    }
                    offset = _canvas.width - _alreadyLen;
                    break;
            }
            for (let j = 0; j < _row[i].length; j++) {
                const element = _row[i][j];

                if (element.type === 1) { // 文字
                    this.ctx2d.fillStyle = element.color;
                    this.ctx2d.strokeStyle = element.color;
                    this.ctx2d.font = _b;

                    this.ctx2d.textBaseline = 'middle';
                    this.ctx2d.textAlign = 'center';

                    this.ctx2d.lineJoin = 'round';

                    let _tet = element.text;
                    if (!_tet) {
                        _tet = ' ';
                    }
                    if (element.style && element.style.outline) {
                        this.ctx2d.strokeStyle = element.style.outline.color;
                        this.ctx2d.fillStyle = element.style.color;
                        this.ctx2d.lineWidth = element.style.outline.width * 4 || 2;
                        this.ctx2d.strokeText(_tet, offset + element.width / 2, rtLineHeight * (i + addOffSet));
                    }

                    if (element.style && element.style.multiColor) {
                        const gradient = this.ctx2d.createLinearGradient(offset, 0, offset + element.width, 0);
                        const colorList1 = ['#12a710', UtilColor.BlueV, '#ed2df2', '#ff4242', '#f16e31', UtilColor.BlueV]; // 亮色底
                        const colorList2 = ['#46ff69', '#6ce1fc', '#fa72f8', '#f3f049', '#ff4242', '#6ce1fc']; // 暗色底
                        const colorList = element.style.multiColor.color === 2 ? colorList2 : colorList1;
                        const len = colorList.length;
                        for (let i = 0; i < len; i++) {
                            let index = i * 0.18;
                            if (index > 1) {
                                index = 1;
                            }
                            gradient.addColorStop(index, colorList[i]);
                        }
                        this.ctx2d.fillStyle = gradient;
                    }

                    this.ctx2d.fillText(_tet, offset + element.width / 2, rtLineHeight * (i + addOffSet));

                    if (element.style && element.style.underline) {
                        // //画下划线
                        this.ctx2d.lineWidth = 2;
                        this.ctx2d.strokeStyle = element.color;
                        this.ctx2d.beginPath();
                        this.ctx2d.moveTo(offset, rtLineHeight * (i + addOffSet) + rtFontSize / 2);
                        this.ctx2d.lineTo(offset + element.width, rtLineHeight * (i + addOffSet) + rtFontSize / 2);
                        this.ctx2d.stroke();
                    }
                    offset += element.width;
                } else if (element.type === 2) { // 图片
                    const spriteFrameName = element.text;
                    const spriteFrame = richText.imageAtlas.getSpriteFrame(spriteFrameName);
                    if (spriteFrame) {
                        // canvas渲染
                        // const t: cc.Texture2D = spriteFrame.getTexture();
                        // const r: cc.Rect = spriteFrame.getRect();
                        // if (t) {
                        //     const img: HTMLImageElement = t.getHtmlElementObj();
                        //     this.ctx2d.drawImage(
                        //         img,
                        //         r.x,
                        //         r.y,
                        //         r.width,
                        //         r.height,
                        //         offset,
                        //         rtLineHeight * i + (rtLineHeight - element.height) / 2,
                        //         element.width,
                        //         element.height,
                        //     );
                        // }

                        // 后置gl渲染
                        imgs.push({
                            img: spriteFrame,
                            dstrt: cc.rect(offset, rtLineHeight * i
                                + (rtLineHeight - element.height) / 2, element.width, element.height),
                        });
                    }
                    offset += element.width;
                }
            }
        }
        // 生成图片
        const texture2D = new cc.RenderTexture();
        if (cc.Texture2D['curPixel']) {
            texture2D['_format'] = cc.Texture2D['curPixel'];
        }
        // if (GmCfg.I.os_IOS_Native && (_canvas.width == 0 || _canvas.height == 0)) {

        // } else
        // {
        texture2D.initWithSize(_canvas.width, _canvas.height);
        texture2D.getImpl()['updateSubImage']({
            x: 0,
            y: 0,
            image: _canvas,
            width: _canvas.width,
            height: _canvas.height,
            level: 0,
            flipY: false,
            premultiplyAlpha: true,
        });
        // }
        // texture2D['_image'] = _canvas;
        // 在目标图片上再次渲染富文本内部图片
        if (imgs.length > 0) {
            // 方法1 读取出来buf， 用buf画上去
            //  let gl=texture2D.getImpl()._device._gl ;
            // //这个rgbau8 可以作为静态数据  初始化读取到表情图集获取的数据存储起来
            // let r: cc.Rect = testimg.getRect();
            // let rgbabuf= new ArrayBuffer(r.width*r.height*4);
            // let rgbau8 =new  Uint8Array(rgbabuf);
            // let oldFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
            // var fb = gl.createFramebuffer();
            // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
            //  testimg.getTexture().getImpl()._glID, 0);//这个是图集的gltexture的id
            // gl.readPixels(r.x , r.y, dstrt.width, dstrt.height, gl.RGBA, gl.UNSIGNED_BYTE, rgbau8);
            // gl.bindFramebuffer(gl.FRAMEBUFFER, oldFBO);
            // gl.deleteFramebuffer(fb);

            // texture2D.getImpl()["updateSubImage"]({
            //     x:dstrt.x,y:dstrt.y,
            //     image:  rgbau8 ,
            //     width:   dstrt.width,
            //     height: dstrt.height,
            //     level: 0,
            //     flipY: false,
            //     premultiplyAlpha: false
            //   });

            // 方法二 从图集的坐标获取到 画到目标的指定位置上
            const gl = texture2D.getImpl()['_device']._gl;
            const oldFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
            const fb = gl.createFramebuffer();
            for (let index = 0; index < imgs.length; index++) {
                const element = imgs[index];
                const _texture = element.img.getTexture()['_texture'];
                if (_texture) {
                    // 这个rgbau8 可以作为静态数据  初始化读取到表情图集获取的数据存储起来
                    const r: cc.Rect = element.img.getRect();
                    // let rgbabuf = new ArrayBuffer(r.width * r.height * 4);
                    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, _texture._glID, 0);// 这个是图集的gltexture的id
                    gl.bindTexture(gl.TEXTURE_2D, texture2D.getImpl()['_glID']);
                    gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, element.dstrt.x, element.dstrt.y, r.x, r.y, element.dstrt.width, element.dstrt.height);
                }
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, oldFBO);
            gl.deleteFramebuffer(fb);
        }
        // 如若richtext不干净则清理
        for (let i = richText.node.children.length - 1; i >= 0; i--) {
            const child = richText.node.children[i];
            if (child.name === 'RICHTEXT_CHILD' || child.name === 'RICHTEXT_Image_CHILD') {
                child.destroy();
            }
        }

        // 输出node
        let n = richText.node.getChildByName('labelLayout');
        if (!n) {
            n = new cc.Node();
            n.name = 'labelLayout';
            n.parent = richText.node;
        }
        let c: cc.Sprite = n.getComponent(cc.Sprite);
        if (!c) {
            c = n.addComponent(cc.Sprite);
            c.srcBlendFactor = cc.macro.ONE;
            c.dstBlendFactor = cc.macro.ONE_MINUS_SRC_ALPHA;
        }
        // n.color = Utils.hex2Rgba('#ffffff');
        const a = new cc.SpriteFrame(texture2D);
        a['rt2img'] = true;
        if (texture2D['_framebuffer']) {
            texture2D['_framebuffer'].destroy();
            texture2D['_framebuffer'] = null;
        }
        // a['_textureFilename'] = `${richText.string}_${rtFontSize}_${richText.node.color.toHEX('#rrggbb')}`;
        a.name = 'RTImg';
        c.spriteFrame = a;
        n.anchorX = richText.node.anchorX;
        n.anchorY = richText.node.anchorY;
        richText.node.width = n.width;
        richText.node.height = n.height;
        // 点击事件
        richText.handleTouchEvent = false;
        n.destroyAllChildren();
        const offsetX = 0 - n.anchorX * n.width;// 加上+canvans的x就是node的x坐标
        const offsetY = n.height * (1 - n.anchorY);// 减去-canvans的y就是node的y坐标

        for (let i = 0; i < _row.length; i++) {
            let offset = 0;// 元素在当前行的偏移位置，
            for (let j = 0; j < _row[i].length; j++) {
                const element = _row[i][j];
                if (!element.style) continue;
                if (element.style.event && element.style.event.click) {
                    const nc = new cc.Node();
                    nc.name = 'rtclick';
                    nc.parent = n;
                    nc.width = element.width;
                    nc.height = rtLineHeight;
                    nc.x = offsetX + (offset + element.width / 2);
                    nc.y = offsetY - (rtLineHeight * (i + addOffSet));
                    nc['_clickHandler'] = element.style.event.click;
                    if (element.style.event.param) nc['_clickParam'] = element.style.event.param;
                    // UIMgr.I.clk(nc, (event) => {
                    //     let components = richText.node.getComponents(cc.Component);
                    //     components.forEach(function (component) {
                    //         if (component.enabledInHierarchy && component[nc["_clickHandler"]]) {
                    //             component[nc["_clickHandler"]](event, nc["_clickParam"]);
                    //         }
                    //     });
                    // }, nc);
                    // if (element.style.event.param) nc["_clickParam"] = element.style.event.param;
                }
                offset += element.width;
            }
        }

        a['_texture'].packable = true;
        a['_texture']['_uuid'] = CompUtil.createRichTextUuid(richText);
        if (CC_EDITOR) return;
        CCDynamicAtlasMgr.I.packToDynamicAtlas(c, a);
    }

    private canvas: HTMLCanvasElement = document.createElement('canvas');// 黑板
    private ctx2d: CanvasRenderingContext2D = null;// 画笔

    public labelPool: cc.NodePool = new cc.NodePool();
    public label2Img(lab: cc.Label): boolean {
        const defaultFont = 'Microsoft YaHei';
        // 1-fontFamily
        let fontFamily = defaultFont;
        if (lab['_N$file']?._fontFamily) fontFamily = lab['_N$file']._fontFamily;// FZSHENGSKSJW_LABEL
        // 2-fontSize
        const fontSize = lab.fontSize;
        // 3-fontColor
        const fontColor = UtilColor.getNdColorRGBA(lab.node);
        // 4-lineHeight
        const lineHeight = lab.lineHeight ? lab.lineHeight : lab.fontSize;
        // (lab.lineHeight || 30) + 10;// lab.lineHeight ? lab.lineHeight : lab.fontSize;//  行高等于字体大小
        // 5-underLine 是否有下划线
        const underLine = !!lab.enableUnderline;
        // 6-maxWidth 左右最大宽度
        const bol = lab.overflow === cc.Label.Overflow.RESIZE_HEIGHT;
        let maxWidth = bol ? lab.node.width : -1;// lab.node.width 此处可能不生效！！！
        // 7-align 水平对齐方式
        const align = FrameBlockUtil.getContextAlign(lab);
        // 8-outLine描边
        const labOutLine = lab.getComponent(cc.LabelOutline);
        const stroke = !!labOutLine;// 是否描边

        const char = lab.string ? lab.string : ' ';
        // if (maxWidth > 0 && maxWidth < fontSize) return true; // 是否限制了最大宽度,最大宽度如果是30 但是字体大小就是32了，那么无法绘制
        if (maxWidth > 0 && maxWidth < fontSize) {
            maxWidth = fontSize;
            cc.warn(lab, '该节点最大宽度要大于字体大小++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
        }

        // 1【获得 黑板& 画笔】
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
        }
        const _canvas = this.canvas;
        this.ctx2d = this.ctx2d ? this.ctx2d : _canvas.getContext('2d');

        // 2【设置笔刷大小】
        let _b = `${fontSize}px "${fontFamily}"`; /** 这个很重要！！！没有这句，mesureText会出现异常 */
        if (lab.enableItalic) _b = `italic ${_b}`;
        if (lab.enableBold) _b = `bold ${_b}`;

        this.ctx2d.clearRect(0, 0, _canvas.width, _canvas.height);// 清除黑板//w:300 h:150 默认画笔黑板
        this.ctx2d.font = _b;

        // 3【要绘制什么样的内容】
        // 计算下char文本有多宽多高
        let _w = 0; let _h = 0;
        const _rw = []; // 每行字体宽度
        const _row = [];// 放入每行字体

        const _allLineTmp = char.split('\n');
        if (_allLineTmp.length === 1 && maxWidth <= 0) { // 只有一行
            const ssa = UtilChar.isEmojiCharacter(char);
            const m = this.ctx2d.measureText(ssa);// 测量文本 返回文字格信息 没有返回高度
            if (m == null) return false;
            _row.push(char);
            _h = lineHeight;
            _w = m.width;
            _rw.push(_w);
        } else {
            // 有换行，好几行。 将每一行拿出来，判断当前这一行的文本是否超出了最大宽度。
            // 例如有一行文本是 "hello world"  则拆开为 h e l l o w o r l d
            // 紧接着拼接 h  he  hel  hell hello hello w...一直判断是否达到最大宽度
            for (let index = 0; index < _allLineTmp.length; index++) {
                const element = _allLineTmp[index];// 拿到每行
                // 计算自适应高度 也就是设置了最大宽度
                let _arg = element.split('');
                let _temp = '';
                let _mw = 0;
                for (let i = 0, l = _arg.length; i < l; i++) {
                    const ass = UtilChar.isEmojiCharacter(_temp + _arg[i]);
                    _mw = this.ctx2d.measureText(ass).width;
                    if (maxWidth > 0 && _mw > maxWidth) { // 自然折行
                        _row.push(_temp);// 了结当前行
                        _temp = '';// 清空已完结的行缓存，下面会将当前字符填入
                        _rw.push(_mw);
                    } else {
                        if (_mw > _w) _w = _mw;// 记录没被终结的最大行宽
                    }
                    _temp += _arg[i];// 当前字符放到下一行
                }
                _row.push(_temp);
                _rw.push(_mw);
                _h = _row.length * lineHeight;
                _arg = null;
                _temp = '';
            }
            if (maxWidth > 0) {
                _w = maxWidth;
            }
        }
        // 以上操作完得到 每一行有什么_rows  每一行多宽 _rw  以及行高 _h
        // 4【设置宽高 要在黑板多宽多高的区域内绘制内容】
        let borderWith = 0;
        if (stroke) {
            const low = labOutLine.width;
            borderWith = low * 2;// 8;
        }
        const can_w = _w + borderWith;
        const can_h = underLine || stroke ? _h + 4 : _h;

        _canvas.width = can_w;// 最大宽度
        _canvas.height = can_h;// 总高度

        this.ctx2d.fillStyle = fontColor;// 画笔颜色
        this.ctx2d.strokeStyle = fontColor;

        this.ctx2d.font = _b; // 重新确认下笔刷，选择多粗的笔
        this.ctx2d.textBaseline = 'middle';// 基线
        this.ctx2d.textAlign = align;// 文本对齐方式

        // FZSHENGSKSJW_LABEL 0.45
        // SIMHEI_LABEL 0.5
        let addOffSet = 0.6;// 得根据不同的字体调整偏移量

        if (fontFamily !== defaultFont) {
            addOffSet = fontFamily === 'FZSHENGSKSJW_LABEL' ? 0.45 : 0.5;// 得根据不同的字体调整偏移量
        }
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS) {
            addOffSet = 0.35;// 苹果手机上的偏移量
        }

        // 4【绘制】
        for (let i = 0, l = _row.length; i < l; i++) {
            const _item = _row[i];// 拿到每行文本
            /// -----计算锚点-----
            let _anX = _w / 2;
            const _anY = lineHeight * (i + addOffSet);
            _anX = FrameBlockUtil.getAnchrX(align, borderWith, _w);
            // ----- 是否描边-----
            if (stroke) {
                const labOutLine: cc.LabelOutline = lab.node.getComponent(cc.LabelOutline);
                const ccolor = labOutLine.color.toHEX('#rrggbbaa');
                this.ctx2d.strokeStyle = `#${ccolor}`;
                this.ctx2d.lineWidth = labOutLine.width * 2;
                // const _b = `${fontSize}px "Microsoft YaHei"`;
                const _b = `${fontSize}px "${fontFamily}"`;
                this.ctx2d.font = _b;
                this.ctx2d.lineJoin = 'round';
                this.ctx2d.strokeText(_item, _anX, _anY);
            }
            this.ctx2d.lineJoin = 'round';
            this.ctx2d.fillText(_item, _anX, _anY);

            // -----是否下划线-----
            if (underLine) {
                // 画下划线
                switch (align) {
                    case 'start':// left
                    case 'left':// left
                        _anX = 0;
                        break;
                    case 'center': // center
                        _anX -= _rw[i] / 2;
                        break;
                    case 'end': // right
                    case 'right': // right
                        _anX -= _rw[i];
                        break;
                    default: // center
                        _anX -= _rw[i] / 2;
                        break;
                }

                let ulOffSet = 4;// 根据字体不同，下划线需要变化
                if (fontFamily !== defaultFont) {
                    ulOffSet = fontFamily === 'FZSHENGSKSJW_LABEL' ? 0 : 4;// 得根据不同的字体调整偏移量
                }

                this.ctx2d.lineWidth = lab.underlineHeight;
                this.ctx2d.strokeStyle = fontColor;
                this.ctx2d.beginPath();
                this.ctx2d.moveTo(_anX, lineHeight * (i + 1) - ulOffSet);
                this.ctx2d.lineTo(_anX + _rw[i], lineHeight * (i + 1) - ulOffSet);
                this.ctx2d.stroke();
            }
        }

        // 将画布内的内容--> RenderTexture
        const texture2D = new cc.RenderTexture();
        if (cc.Texture2D['curPixel']) {
            texture2D['_format'] = cc.Texture2D['curPixel'];
        }
        // if (GmCfg.I.os_IOS_Native && (_canvas.width == 0 || _canvas.height == 0)) {
        // }
        // else {

        texture2D.initWithSize(_canvas.width, _canvas.height);
        if (_canvas) {
            texture2D.getImpl()['updateSubImage']({
                x: 0,
                y: 0,
                image: _canvas,
                width: _canvas.width,
                height: _canvas.height,
                level: 0,
                flipY: false,
                premultiplyAlpha: true,
            });
        }
        // }

        if (texture2D['_framebuffer']) {
            texture2D['_framebuffer'].destroy();
            texture2D['_framebuffer'] = null;
        }

        // 原本的label销毁 创建当前的替代
        const a = new cc.SpriteFrame(texture2D);
        if (a) { // 添加进入节点
            if (lab.node) {
                let n = lab.node.getChildByName('labelLayout');
                if (!n) {
                    n = this.labelPool.get();
                    if (n == null) {
                        n = FrameBlockUtil.createSpriteNode();
                    }
                    n.parent = lab.node;
                }
                const c = n.getComponent(cc.Sprite);
                c.spriteFrame = a;

                n.anchorX = lab.node.anchorX;
                n.anchorY = lab.node.anchorY;

                n.color = new cc.Color().fromHEX('#ffffff');

                lab.node.width = n.width;
                lab.node.height = n.height;

                a['_texture'].packable = true;
                const uuid = CompUtil.createLabelUuid(lab);
                a['_texture']._uuid = uuid;
                if (CC_EDITOR) return false;
                CCDynamicAtlasMgr.I.packToDynamicAtlas(c, a);
                return false;
            }
        }
        return false;
    }
}
