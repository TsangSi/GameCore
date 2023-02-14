// import { _decorator, Label } from 'cc';
// import { i18n } from './i18n';
// const { ccclass, property } = _decorator;

import { Component, director, Label, log, _decorator } from 'cc';
import { EDITOR } from 'cc/env';
import { i18n } from './i18n';

const { ccclass, property, executeInEditMode, menu } = _decorator;
// function debounce (func: Function, wait: number, immediate = false) {
// let timeout: number = 0;
// return function() {
//     var context = this, args = arguments;
//     var later = function() {
//         timeout = 0;
//         if (!immediate) func.apply(context, args);
//     };
//     var callNow = immediate && !timeout;
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//     if (callNow) func.apply(context, args);
// };
// }
@ccclass('LocalizedLabel')
@executeInEditMode
@menu('_LocalizedLabel')
export class LocalizedLabel extends Component {
    private _debouncedUpdateLabel: ()=>void | null = null;
    @property
    public _dataID = 'zh-CN';
    @property
    get dataID () {
        return this._dataID;
    }
    set dataID (value: string) {
        if (this._dataID !== value) {
            this._dataID = value;
            if (EDITOR) {
                if (!this._debouncedUpdateLabel) {
                    this.onLoad();
                }
                this._debouncedUpdateLabel();
            } else {
                this.fetchRender();
            }
        }
    }

    private label: Label | null = null;

    onLoad () {
        if (EDITOR) {
            this._debouncedUpdateLabel = this.fetchRender;
        }
        // if (!i18n.inst) {
        //     i18n.init('zh-CN');
        // }
        // console.warn('dataID: ' + this.dataID + ' value: ' + i18n.t(this.dataID));
        this.fetchRender();
    }

    fetchRender () {
        if (!this.label) {
            this.label = this.node.getComponent(Label);
        }
        this.updateLabel();
    }

    updateLabel () {
        if (!this.label) {
            console.error('Failed to update localized label, label component is invalid!');
            return;
        }
        // console.warn('this.dataID=', this.dataID);
        const localizedString = i18n.t(this.dataID);
        if (localizedString) {
            this.label.string = i18n.t(this.dataID);
        } else {
            this.label.string = '';
        }
    }
}

// const i18n = require('i18n');
// cc.Class({
//     extends: cc.Label,
//
//     properties: {
//         textKey: {
//             default: 'TEXT_KEY',
//             multiline: true,
//             tooltip: 'Enter i18n key here',
//             notify: function () {
//                 this.string = this.localizedString;
//             }
//         },
//         localizedString: {
//             override: true,
//             tooltip: 'Here shows the localized string of Text Key',
//             get: function () {
//                 return i18n.t(this.textKey);
//             },
//             set: function (value) {
//                 this.textKey = value;
//                 if (CC_EDITOR) {
//                     cc.warn('Please set label text key in Text Key property.');
//                 }
//             }
//         },
//     },
//
//     onLoad () {
//         this._super();
//         if (this.localizedString) {
//             this.string = this.localizedString;
//         }
//     }
// });
