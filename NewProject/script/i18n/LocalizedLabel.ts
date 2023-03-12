/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: zs
 * @Date: 2022-04-08 10:13:33
 * @FilePath: \SanGuo2.4\assets\script\i18n\LocalizedLabel.ts
 * @Description:
 *
 */
// import { CCResMD5 } from 'h3_engine';

import { data } from './zh-CN';
import BaseCmp from '../app/core/mvc/view/BaseCmp';

// eslint-disable-next-line dot-notation
const _Lang: { Name: string, Data: { [k: string]: string } } = window['_Lang'] = cc.js.createMap(true);
_Lang.Name = 'zh-CN';
_Lang.Data = data;
const isCanEditor = _Lang.Name === 'zh-CN';
// let fs;
// let filePath = '';
// if (CC_DEV && CC_EDITOR) {
// Editor.assetdb.queryPathByUuid('0a9af278-52ca-4b09-9725-8790bb4285ee', (err, path) => {
//     if (err) return Editor.error(err);
// });
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access, dot-notation
// filePath = `${Editor['remote'].Project.path}/assets/resources/i18n/prefab-${_Lang.Name}.json`;

// // filePath = `D:/Project/HL3/SanGuo/assets/cc.resources/i18n/prefab-${_Lang.Name}.json`;
// eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
// fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
// const dataStr = fs.readFileSync(filePath, 'utf-8');
// _Lang.Data = JSON.parse(dataStr);
// Editor.log(`加载${_Lang.Name}`);
// }
const {
    ccclass, property, executeInEditMode, menu, disallowMultiple, requireComponent,
} = cc._decorator;
@ccclass
@executeInEditMode()
@disallowMultiple()
// @requireComponent(cc.Label || cc.RichText)
@menu('LocalizedLabel')
export class LocalizedLabel extends BaseCmp {
    @property(cc.String)
    private _key = _Lang.Name;
    @property({
        type: cc.String,
    })
    private get key(): string {
        return this._key;
    }
    private set key(k: string) {
        k = k || '';
        this._key = k;
        if (this._key) {
            if (this.label) {
                this.label.string = _Lang.Data[this._key] || '';
            }
        }
    }

    private _label: cc.Label | cc.RichText = null;
    private get label(): cc.Label | cc.RichText {
        if (this._label) {
            return this._label;
        }
        this._label = this.node.getComponent(cc.Label) || this.node.getComponent(cc.RichText);
        return this._label;
    }

    @property(cc.Boolean)
    private _findKey: boolean = false;
    @property(cc.Boolean)
    private get findKey(): boolean {
        return this._findKey;
    }
    private set findKey(b: boolean) {
        if (CC_DEV && CC_EDITOR) {
            if (isCanEditor && this.label.string && this.label.string !== '多语言') {
                for (const k in _Lang.Data) {
                    if (_Lang.Data[k] === this.label.string) {
                        this.key = k;
                        return;
                    }
                }
                Editor.warn(`not found key, node.name=${this.node.name}, str=${this.label.string}`);
            }
        }
    }

    protected onLoad(): void {
        this.updateLabel();
    }
    private updateLabel() {
        if (!this.label) {
            if (CC_EDITOR) {
                Editor.error('Failed to update localized label, label component is invalid!');
            } else {
                console.error('Failed to update localized label, label component is invalid!');
            }
            return;
        }
        if (this.key) {
            this.label.string = _Lang.Data[this.key] || this.label.string;
            if (this.label.string !== _Lang.Data[this.key]) {
                if (CC_EDITOR) {
                    Editor.warn(`value is undefined node.name=${this.node.name}, str=${this.label.string}，${this.key}`);
                } else {
                    console.warn(`value is undefined node.name=${this.node.name}, str=${this.label.string}，${this.key}`);
                }
            }
        } else if (CC_EDITOR) {
            for (const key in _Lang.Data) {
                if (_Lang.Data[key] === this.label.string) {
                    this.key = key;
                    return;
                }
            }
            Editor.warn(`key is undefined, node.name=${this.node.name}, str=${this.label.string}`);
        } else {
            console.warn(`key is undefined, node.name=${this.node.name}, str=${this.label.string}`);
        }
    }

    protected update(dt: number): void {
        if (CC_DEV && CC_EDITOR && isCanEditor) {
            if (this.key && this.label?.string && this.label.string !== _Lang.Data[this.key]) {
                if (_Lang.Data[this.key]) {
                    this.label.string = _Lang.Data[this.key];
                }
            }
        }
    }
}
