/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { EffectMgr } from '../../../manager/EffectMgr';
import { AssetType } from '../../../../app/core/res/ResConst';
import { Config } from '../../../base/config/Config';
import { HtmlTextParser } from '../../../../app/base/utils/UtilHtmlTextParser';
import { UtilColorFull } from '../../../base/utils/UtilColorFull';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;
interface ISegment {
    node: cc.Node;
    comp: cc.Label | cc.Sprite | null;
    lineCount: number;
    styleIndex: number;
    imageOffset: string;
    clickParam: string;
    clickHandler: string;
    type: string,
}

/** 表情包的每一个节点大小为固定的40*40 */
const sprWidth = 35;
const sprHeight = 35;
const sysTipW = 58;
const sysTipH = 30;

const _BASELINE_RATIO = 0.26;
const RichTextChildImageName = 'RICHTEXT_Image_CHILD';

@ccclass
export class CustomRichText extends cc.RichText {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public _addRichTextImageElement(richTextElement): void {
        if (!richTextElement.style) {
            return;
        }

        const style = richTextElement.style;
        const src = style.src; // id
        const segment = new cc.PrivateNode(RichTextChildImageName);
        const spriteComponent = segment.addComponent(cc.Sprite);
        if (style.imageOffset) {
            segment._imageOffset = style.imageOffset;
        }
        spriteComponent.type = cc.Sprite.Type.SLICED;
        spriteComponent.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        this.node.addChild(segment);
        this._labelSegments.push(segment);

        let spriteRect = cc.size(sprWidth, sprHeight);

        const conf: Cfg_Emoji = Config.Get(Config.Type.Cfg_Emoji).getValueByKey(Number(src));
        if (conf) {
            segment.attr({ flag: conf.ResId.toString() });// conf.ResId.toString();
        } else {
            segment.attr({ flag: src });
        }
        /** 复用时防止子节点上精灵未回收的情况 */
        segment.destroyAllChildren();
        segment.removeAllChildren();
        segment.setAnchorPoint(0, 0);
        // 防止动态图 与静态图混合出现重叠
        if (conf) {
            if (conf.IsGif) {
                segment.setAnchorPoint(0, 0.15);
                const path = `${RES_ENUM.Chat_Emoji}${conf.ResId.toString()}`;
                const cNode = new cc.Node(conf.ResId.toString());
                segment.addChild(cNode);
                EffectMgr.I.showEffectBySelf(path, cNode, cc.WrapMode.Loop, (nd) => {
                    // eslint-disable-next-line dot-notation
                    if (segment['flag'] !== nd.name) {
                        // eslint-disable-next-line dot-notation
                        nd.destroy();
                    } else {
                        nd.setContentSize(26, 26);
                        // 因为父节点锚点为00 所以要设置位置为父节点的宽高的一半
                        nd.setPosition(sprWidth / 2, 12, 0);

                        const spr = nd.getComponent(cc.Sprite);
                        spr.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                    }
                });
            } else {
                segment.setAnchorPoint(0, 0.15);
                UtilCocos.LoadSpriteFrameRemote(
                    segment.getComponent(cc.Sprite),
                    `${RES_ENUM.Chat_Emoji}${conf.ResId}`,
                    AssetType.SpriteFrame,
                    (spr: cc.Sprite) => {
                        // if (url !== spr.node['flag']) {
                        //     console.log('加载不匹配');
                        segment.destroyAllChildren();
                        segment.removeAllChildren();
                        // }
                    },
                );
            }
            segment.setContentSize(spriteRect);
        } else {
            segment.setAnchorPoint(0, 0.15);
            spriteRect = cc.size(sysTipW, sysTipH);
            segment.setContentSize(spriteRect);
            UtilCocos.LoadSpriteFrameRemote(
                segment.getComponent(cc.Sprite),
                `${RES_ENUM.Chat_Emoji}${src}`,
                AssetType.SpriteFrame,
                (spr: cc.Sprite) => {
                    // if (url !== spr.name) {
                    //     console.log('加载不匹配1', url, spr.node['flag']);
                    segment.destroyAllChildren();
                    segment.removeAllChildren();
                    // }
                },
            );
        }

        const spriteWidth = spriteRect.width;
        if (this.maxWidth > 0) {
            if (this._lineOffsetX + spriteWidth > this.maxWidth) {
                this._updateLineInfo();
            }
            this._lineOffsetX += spriteWidth;
        } else {
            this._lineOffsetX += spriteWidth;
            if (this._lineOffsetX > this._labelWidth) {
                this._labelWidth = this._lineOffsetX;
            }
        }
        // segment.node._uiProps.uiTransformComp.setContentSize(spriteWidth, spriteHeight);
        segment._lineCount = this._lineCount;
    }

    public _updateRichText(): void {
        if (CC_EDITOR) return;
        if (!this.enabledInHierarchy) return;

        const _htmlTextParser = new HtmlTextParser();
        const newTextArray = _htmlTextParser.parse(this.string);

        // if (window.blockRichTextRender) {
        //     if (window.blockRichTextRender(this)) {
        //         if (window.pushRTIntoQueue) {
        //             window.pushRTIntoQueue(this);// 放入池子里 后续 从label---->image
        //             return;
        //         }
        //     } else if (this.node && this.node.isValid) {
        //         const c = this.node.getChildByName('labelLayout');
        //         if (c) c.destroy();
        //     }
        // }

        if (!this._needsUpdateTextLayout(newTextArray)) {
            this._textArray = newTextArray;
            this._updateLabelSegmentTextAttributes();
            return;
        }

        this._textArray = newTextArray;
        this._resetState();

        let lastEmptyLine = false;
        let label;
        let labelSize;

        for (let i = 0; i < this._textArray.length; ++i) {
            const richTextElement = this._textArray[i];
            const text = richTextElement.text;
            // handle <br/> <img /> tag
            if (text === '') {
                if (richTextElement.style && richTextElement.style.newline) {
                    this._updateLineInfo();
                    continue;
                }
                if (richTextElement.style && richTextElement.style.isImage) {
                    this._addRichTextImageElement(richTextElement);
                    continue;
                }
            }
            const multilineTexts = text.split('\n');

            for (let j = 0; j < multilineTexts.length; ++j) {
                const labelString = multilineTexts[j];
                if (labelString === '') {
                    // for continues \n
                    if (this._isLastComponentCR(text)
                        && j === multilineTexts.length - 1) {
                        continue;
                    }
                    this._updateLineInfo();
                    lastEmptyLine = true;
                    continue;
                }
                lastEmptyLine = false;

                if (this.maxWidth > 0) {
                    const labelWidth = this._measureText(i, labelString);
                    this._updateRichTextWithMaxWidth(labelString, labelWidth, i);

                    if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
                        this._updateLineInfo();
                    }
                } else {
                    label = this._addLabelSegment(labelString, i);
                    labelSize = label.getContentSize();

                    this._lineOffsetX += labelSize.width;
                    if (this._lineOffsetX > this._labelWidth) {
                        this._labelWidth = this._lineOffsetX;
                    }

                    if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
                        this._updateLineInfo();
                    }
                }
            }
        }
        if (!lastEmptyLine) {
            this._linesWidth.push(this._lineOffsetX);
        }

        if (this.maxWidth > 0) {
            this._labelWidth = this.maxWidth;
        }
        this._labelHeight = (this._lineCount + _BASELINE_RATIO) * this.lineHeight;

        // trigger "size-changed" event
        this.node.setContentSize(this._labelWidth, this._labelHeight);

        this._updateRichTextPosition();
        this._layoutDirty = false;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    protected _applyTextAttribute(labelNode, string, force): void {
        // eslint - disable - next - line @typescript-eslint / no - unsafe - call
        const labelComponent = labelNode.getComponent(cc.Label);
        if (!labelComponent) {
            return;
        }

        const index = labelNode._styleIndex;

        let textStyle = null;
        if (this._textArray[index]) {
            textStyle = this._textArray[index].style;
        }

        if (textStyle && textStyle.color) {
            labelNode.color = this._convertLiteralColorValue(textStyle.color);
            UtilColorFull.setColorString(labelNode.getComponent(cc.Label), textStyle.color);
        } else {
            labelNode.color = this.node.color;
            UtilColorFull.resetMat(labelNode.getComponent(cc.Label));
        }

        labelComponent.cacheMode = this.cacheMode;

        const isAsset = this.font instanceof cc.Font;
        if (isAsset && !this._isSystemFontUsed) {
            labelComponent.font = this.font;
        } else {
            labelComponent.fontFamily = this.fontFamily;
        }

        labelComponent.useSystemFont = this._isSystemFontUsed;
        labelComponent.lineHeight = this.lineHeight;
        labelComponent.enableBold = textStyle && textStyle.bold;
        labelComponent.enableItalics = textStyle && textStyle.italic;
        // TODO: temporary implementation, the italic effect should be implemented in the internal of label-assembler.
        if (textStyle && textStyle.italic) {
            labelNode.skewX = 12;
        }

        labelComponent.enableUnderline = textStyle && textStyle.underline;

        if (textStyle && textStyle.outline) {
            let labelOutlineComponent = labelNode.getComponent(cc.LabelOutline);
            if (!labelOutlineComponent) {
                labelOutlineComponent = labelNode.addComponent(cc.LabelOutline);
            }
            labelOutlineComponent.color = this._convertLiteralColorValue(textStyle.outline.color);
            labelOutlineComponent.width = textStyle.outline.width;
        }

        if (textStyle && textStyle.size) {
            labelComponent.fontSize = textStyle.size;
        } else {
            labelComponent.fontSize = this.fontSize;
        }

        if (string !== null) {
            if (typeof string !== 'string') {
                string = `${string}`;
            }
            labelComponent.string = string;
        }

        force && labelComponent._forceUpdateRenderData();

        if (textStyle && textStyle.event) {
            if (textStyle.event.click) {
                labelNode._clickHandler = 'RichTextClick';
            }
            if (textStyle.event.click) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                labelNode._clickParam = textStyle.event.click.substring(1, textStyle.event.click.length - 1);
            } else {
                labelNode._clickParam = '';
            }
        } else {
            labelNode._clickHandler = null;
        }

        // labelSeg.clickHandler = 'RichTextClick';// event.click || '';
        // labelSeg.clickParam = event.click.substring(1, event.click.length - 1);// event.param || '';
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    protected _updateRichTextPosition(): void {
        let nextTokenX = 0;
        let nextLineIndex = 1;
        const totalLineCount = this._lineCount;
        for (let i = 0; i < this._labelSegments.length; ++i) {
            const label = this._labelSegments[i];
            const lineCount = label._lineCount ?? 1;
            if (lineCount > nextLineIndex) {
                nextTokenX = 0;
                nextLineIndex = lineCount;
            }
            let lineOffsetX = 0;
            // let nodeAnchorXOffset = (0.5 - this.node.anchorX) * this._labelWidth;
            switch (this.horizontalAlign) {
                case cc.macro.TextAlignment.LEFT:
                    lineOffsetX = -this._labelWidth / 2;
                    break;
                case cc.macro.TextAlignment.CENTER:
                    lineOffsetX = -this._linesWidth[lineCount - 1] / 2;
                    break;
                case cc.macro.TextAlignment.RIGHT:
                    lineOffsetX = this._labelWidth / 2 - this._linesWidth[lineCount - 1];
                    break;
                default:
                    break;
            }
            label.x = nextTokenX + lineOffsetX;

            const labelSize = label.getContentSize();

            label.y = this.lineHeight * (totalLineCount - lineCount) - this._labelHeight / 2;

            if (lineCount === nextLineIndex) {
                nextTokenX += labelSize.width;
            }

            const sprite = label.getComponent(cc.Sprite);
            if (sprite) {
                // adjust img align (from <img align=top|center|bottom>)
                const lineHeightSet = this.lineHeight;
                const lineHeightReal = this.lineHeight * (1 + _BASELINE_RATIO); // single line node height
                switch (label.anchorY) {
                    case 1:
                        label.y += lineHeightSet + ((lineHeightReal - lineHeightSet) / 2);
                        break;
                    case 0.5:
                        label.y += lineHeightReal / 2;
                        break;
                    default:
                        label.y += (lineHeightReal - lineHeightSet) / 2;
                        break;
                }
                // adjust img offset (from <img offset=12|12,34>)
                if (label._imageOffset) {
                    const offsets = label._imageOffset.split(',');
                    if (offsets.length === 1 && offsets[0]) {
                        const offsetY = parseFloat(offsets[0]);
                        if (Number.isInteger(offsetY)) label.y += offsetY;
                    } else if (offsets.length === 2) {
                        const offsetX = parseFloat(offsets[0]);
                        const offsetY = parseFloat(offsets[1]);
                        if (Number.isInteger(offsetX)) label.x += offsetX;
                        if (Number.isInteger(offsetY)) label.y += offsetY;
                    }
                }
            }

            // adjust y for label with outline
            const outline = label.getComponent(cc.LabelOutline);
            if (outline && outline.width) label.y -= outline.width;
        }
    }
}
