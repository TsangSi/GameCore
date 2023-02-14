/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable func-names */
// eslint-disable-next-line import/no-extraneous-dependencies
import * as $protobuf from 'protobufjs';
import {
 assetManager, Component, js, JsonAsset, Sprite, sys, __private,
} from 'cc';
import { EDITOR } from 'cc/env';
import GlobalConfig from '../config/GlobalConfig';
import UtilsPlatform from '../utils/UtilsPlatform';

export default class ProtoManager {
    private static _i: ProtoManager = null;
    public static get I(): ProtoManager {
        if (!this._i) {
            this._i = new ProtoManager();
        }
        return this._i;
    }

    private ProtoIds: { [idx: string]: string} = {};

    private root: $protobuf.Root;
    private msgIds: { [key: number]: string } = {};

    private msgClass: {[name: string]: __private.Constructor<unknown>} = {};
    initProto(msgJsonData) {
        msgJsonData = msgJsonData || ProtoManager.ProtoJSON;
        // eslint-disable-next-line dot-notation
        this.root = $protobuf['default'].Root.fromJSON(msgJsonData);
        const allPackNames = msgJsonData.nested.msg.nested;
        const packNames = allPackNames.PCK.values;
        for (const idx in packNames) {
            const className = idx.replace('_ID', '');
            const k = packNames[idx];
            this.ProtoIds[idx] = k;

            this.msgIds[k] = className;
            const t: any = function (data?) {
                return ProtoManager.I.root.lookupType(js.getClassName(this)).create(data);
            };
            js.setClassName(className, t);
            window[className] = js.getClassByName(className);
        }
        for (const className in allPackNames) {
            if (window[className] == null && className !== 'PCK') {
                const suffix = 'Dyna';
                const ct: any = function (data?) {
                    let selfClassName = js.getClassName(this);
                    selfClassName = selfClassName.replace('Dyna', '');
                    return ProtoManager.I.root.lookupType(selfClassName).create(data);
                };
                js.setClassName(suffix + className, ct);
                window[className] = js.getClassByName(suffix + className);
            }
        }
        msgJsonData = null;
    }

    get Root(): $protobuf.Root {
        return this.root;
    }

    getMsgClass(msgId: number) {
        const name = this.msgIds[msgId];
        if (name) {
            return this.root.lookupType(name);
        }
        return null;
    }

    static ProtoJSON = undefined;
    static ProtoId = undefined;
    private static onotProto(protoStr: any) {
        let msgJsonData = protoStr.json;
        this.ProtoJSON = msgJsonData;
        const packNames = msgJsonData.nested.msg.nested.PCK.values;
        window.ProtoId = {};
        for (const idx in packNames) {
            window.ProtoId[idx] = packNames[idx];
            const className = idx.replace('_ID', '');
            window[className] = new class {}();
        }
        protoStr = '';
        msgJsonData = null;
    }

    private loadMsgJson() {
        // 如果包含 https 就是 ssl
        let path = GlobalConfig.getProjectResURL();
        const isSSL = document.location.protocol === 'https:';
        path = isSSL ? path.replace('http:', 'https:') : path;

        assetManager.loadRemote<JsonAsset>(`${path}/msg.json`, (err, data) => {
            if (err) {
                setTimeout(() => {
                    ProtoManager.I.init();
                }, 100);
            } else {
                ProtoManager.onotProto(data);
            }
        });
    }

    private loadMsgJsonWX() {
//
    }

    public init() {
        // if (UtilsPlatform.isWechatGame()) {
        //     this.loadMsgJsonWX();
        // } else {
        //     this.loadMsgJson();
        // }
    }
}

if (!UtilsPlatform.isWechatGame()) {
    ProtoManager.I.init();
}
