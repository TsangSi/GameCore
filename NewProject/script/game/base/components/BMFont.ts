/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable dot-notation */
/*
 * @Author: hrd
 * @Date: 2022-11-17 20:55:25
 * @Description: 动态加载BMFont
 *
 */

import { AssetType } from '../../../app/core/res/ResConst';
import { ResMgr } from '../../../app/core/res/ResMgr';
import TimerMgr from '../../manager/TimerMgr';

const {
    ccclass, property, executeInEditMode, disallowMultiple, menu, requireComponent,
} = cc._decorator;

@ccclass
@executeInEditMode()
@disallowMultiple()
@menu('常用组件/BMFont')
@requireComponent(cc.Label)

export class BMFont extends cc.Component {
    private _sf: cc.SpriteFrame = null;
    @property
    private pathPng: string = '';
    @property
    private _inEditor: boolean = true;
    @property({
        displayName: '预览',
    })
    public get inEditor(): boolean {
        return this._inEditor;
    }
    public set inEditor(val: boolean) {
        if (CC_EDITOR) {
            if (val) {
                this.__preload();
            }
        }
        this._inEditor = val;
    }
    private loadFont(url: string) {
        if (window['fontMap']) {
            this.setFont(this.pathPng);
        } else {
            this.loadText(url, () => {
                this.setFont(this.pathPng);
            });
        }
    }
    private _oldPath: string = '';
    public setFont(_path: string): void {
        if (!_path) {
            return;
        }
        if (this._oldPath === _path) {
            return;
        }
        if (!window['fontMap']) {
            this.pathPng = _path;
            this.__preload();
            return;
        }
        const pathPng = _path.trim();
        if (window['fontMap'][pathPng] && this.node && this.node.isValid) {
            this._oldPath = _path;
            const cLab = this.node.getComponent(cc.Label);
            cLab.enabled = false;
            const path = `${pathPng}`;
            ResMgr.I.loadRemote(path, AssetType.SpriteFrame, (err, spriteFrame: cc.SpriteFrame) => {
                if (err) { return; }
                if (!cLab || !cLab.isValid) {
                    return;
                }
                this._sf = spriteFrame;
                this.updateBmfont(cLab, spriteFrame, pathPng);
            });
        }
    }

    private updateBmfont(cLab: cc.Label, spriteFrame, pathPng) {
        const fntConfig = window['fontMap'][pathPng];
        const bf = new cc.BitmapFont();
        bf['_fntConfig'] = fntConfig;
        bf['spriteFrame'] = spriteFrame;
        this.getFontDefDictionary(bf, spriteFrame);
        cLab.font = bf;
        const s = cLab.string;
        cLab.string = s;
        cLab.enabled = true;
        spriteFrame.addRef();
        spriteFrame.getTexture().addRef();
    }
    private loadText(url: string, cb: () => void) {
        ResMgr.I.loadRemote(url, AssetType.Text, (err, data: cc.TextAsset) => {
            if (err) {
                this.scheduleOnce(() => {
                    this.loadText(url, cb);
                });
            } else {
                window['fontMap'] = JSON.parse(data.text);
                cb && cb();
                data.decRef();
            }
        });
    }
    private __preload() {
        // const pathUrl = `${GameApp.I.ResUrl}/allBMFont.txt`;
        this.loadFont('allBMFont');
    }
    private getFontDefDictionary(bf: cc.BitmapFont, spriteFrame: cc.SpriteFrame) {
        !bf['_fontDefDictionary'] && (bf['_fontDefDictionary'] = new cc.BitmapFont['FontAtlas'](spriteFrame['_texture']));
        const fntConfig = bf['_fntConfig'];
        if (!fntConfig) return;
        const fontDict = fntConfig.fontDefDictionary;
        for (const fontDef in fontDict) {
            const letter = new cc.BitmapFont['FontLetterDefinition']();
            const rect = fontDict[fontDef].rect;
            letter.offsetX = fontDict[fontDef].xOffset;
            letter.offsetY = fontDict[fontDef].yOffset;
            letter.w = rect.width;
            letter.h = rect.height;
            letter.u = rect.x;
            letter.v = rect.y;
            letter.textureID = 0;
            letter.valid = true;
            letter.xAdvance = fontDict[fontDef].xAdvance;
            bf['_fontDefDictionary'].addLetterDefinitions(fontDef, letter);
        }
    }
    protected onDestroy(): void {
        // this.pathPng && ResMgr.I.RemoteBmfontCount(this.pathPng, -1, -1);
        if (this._sf) {
            if (this._sf.getTexture()) {
                ResMgr.I.decRef(this._sf.getTexture());
            }
            ResMgr.I.decRef(this._sf);
        }
    }
}
