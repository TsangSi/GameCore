/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: hrd
 * @Date: 2022-04-13 17:56:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-21 11:08:36
 * @FilePath: \SanGuo2.4-zengsi\assets\script\game\manager\ProtoManager.ts
 * @Description:
 *
 */
import * as $protobuf from 'protobufjs';
import { UtilPaltform } from '../../app/base/utils/UtilPaltform';
import GameApp from '../base/GameApp';
import TaskCollector, { DB_ID_ENUM, DB_KEY_ENUM } from './TaskCollector';

export default class ProtoManager {
    private ProtoIds: { [idx: string]: string } = {};
    private root: $protobuf.Root;
    private msgIds: { [key: number]: string } = {};
    // private msgClass: {[name: string]: __private.Constructor<unknown>} = {};
    static ProtoJSON = undefined;
    static ProtoId = undefined;

    private static _i: ProtoManager = null;
    public static get I(): ProtoManager {
        if (!this._i) {
            this._i = new ProtoManager();
        }
        return this._i;
    }

    public initProto(msgJsonData?: any): void {
        msgJsonData = msgJsonData || ProtoManager.ProtoJSON;
        this.root = $protobuf.Root.fromJSON(msgJsonData);
        const allPackNames = msgJsonData.nested.msg.nested;
        const packNames = allPackNames.PCK.values;
        for (const idx in packNames) {
            const className = idx.replace('_ID', '');
            const k = packNames[idx];
            this.ProtoIds[idx] = k;

            this.msgIds[k] = className;
            const t: any = function (data?) {
                return ProtoManager.I.root.lookupType(cc.js.getClassName(this)).create(data);
            };
            cc.js.setClassName(className, t);
            window[className] = cc.js.getClassByName(className);
        }
        for (const className in allPackNames) {
            if (window[className] == null && className !== 'PCK') {
                const suffix = 'Dyna';
                const ct: any = function (data?) {
                    let selfClassName = cc.js.getClassName(this);
                    selfClassName = selfClassName.replace('Dyna', '');
                    return ProtoManager.I.root.lookupType(selfClassName).create(data);
                };
                cc.js.setClassName(suffix + className, ct);
                window[className] = cc.js.getClassByName(suffix + className);
            }
        }
        msgJsonData = null;
    }

    get Root(): $protobuf.Root {
        return this.root;
    }

    public getMsgClass(msgId: number): any {
        const name = this.msgIds[msgId];
        if (name) {
            return this.root.lookupType(name);
        }
        return null;
    }

    private static onotProto(protoStr) {
        console.timeEnd('loadProto');
        let msgJsonData = protoStr.json;
        this.ProtoJSON = msgJsonData;
        const packNames = msgJsonData.nested.msg.nested.PCK.values;
        window['ProtoId'] = {};
        for (const idx in packNames) {
            window['ProtoId'][idx] = packNames[idx];
            const className = idx.replace('_ID', '');
            window[className] = new class { }();
        }
        protoStr = '';
        msgJsonData = null;
        console.time('initProto');
        if (!UtilPaltform.isWeChatGame) {
            ProtoManager.I.initProto();
        }

        console.timeEnd('initProto');
        TaskCollector.I.endTask(DB_KEY_ENUM.ShowLoginUI, DB_ID_ENUM.LodgingProto);
    }

    private loadMsgJson() {
        console.time('loadProto');
        const path = GameApp.I.ProtoMsgUrl;
        cc.assetManager.loadRemote<cc.JsonAsset>(`${path}/msg.json`, (err, data) => {
            if (err) {
                let timer = setTimeout(() => {
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
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
        if (!UtilPaltform.isWeChatGame) {
            this.loadMsgJson();
        } else {
            TaskCollector.I.endTask(DB_KEY_ENUM.ShowLoginUI, DB_ID_ENUM.LodgingProto);
        }
    }
}
