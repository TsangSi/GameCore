/* eslint-disable max-len */
/*
 * @Author: zs
 * @Date: 2023-02-25 12:19:14
 * @Description:
 *
 */
import { UtilString } from '../../base/utils/UtilString';
import {
    CompleteCallback, IFrame, IPlistAsset, IPlistFrame, IPlistJson, LoadInfo,
} from './ResConst';
import { ResLoadBase } from './ResLoadBase';

type IPlistFrameOrJson = IPlistFrame | IPlistJson
export class ResLoadPlist extends ResLoadBase<any> {
    public constructor() {
        super('IPlistAsset');
    }

    /** 是否是json */
    private isPlistJson(data: IPlistJson | IPlistFrame) {
        let isJson: boolean = false;
        for (const k in data) {
            if (typeof data[k] === 'string') {
                isJson = true;
                break;
            }
        }
        return isJson;
    }

    protected complete(e: Error, asset: { [name: string]: IPlistFrameOrJson } | IPlistFrameOrJson, callback: CompleteCallback<IPlistAsset>, target?: object, loadInfo?: LoadInfo, plistName?: string, ...args: any[]): void {
        let plist: IPlistFrameOrJson;
        if (!e) {
            let keyName: string = '';
            if (plistName) {
                keyName = `${plistName}.json`;
                plist = asset[keyName] as IPlistFrameOrJson;
            } else {
                plist = asset as IPlistFrameOrJson;
            }
            if (this.isPlistJson(plist)) {
                const tmpPlist = this.jsonToPlist(plist as IPlistJson);
                if (tmpPlist) {
                    if (keyName) {
                        asset[keyName] = tmpPlist;
                    }
                    plist = tmpPlist;
                }
            }
        }
        this.doCallback(e, plist, callback, target, loadInfo, ...args);
    }

    protected loadResult(e: Error, asset: IPlistAsset, path: string, callback: CompleteCallback<IPlistAsset>, target?: object, loadInfo?: LoadInfo, ...args: any[]): void {
        let plist;
        if (!e) {
            plist = this.getCache(path);
            if (asset?.json) {
                if (!plist) {
                    plist = asset.json;
                    this.addCache(path, plist);
                }
                this.complete(e, plist, callback, target, loadInfo, ...args);
            } else {
                if (!plist) {
                    plist = this.getPlistByObject(asset);
                    this.addCache(path, plist);
                }
                this.doCallback(e, plist, callback, target, loadInfo, ...args);
            }
            if (asset) {
                asset.decRef();
            }
        } else {
            this.complete(e, plist, callback, target, loadInfo, ...args);
        }
    }

    private jsonToPlist(data: IPlistJson) {
        let plist: IPlistFrame;
        for (const fName in data) {
            plist = plist || cc.js.createMap(true);
            const frame = data[fName];
            const trans = this.transPlist(frame);
            plist[fName] = trans;
        }
        return plist;
    }

    private transPlist(frame: string) {
        const frameData: IFrame = cc.js.createMap(true);
        const mDat = frame.split(',');
        frameData.Rotated = +mDat[0] === 1;
        frameData.Frame = [[+mDat[1], +mDat[2]], [+mDat[3], +mDat[4]]];
        frameData.Offset = [+mDat[5], +mDat[6]];
        frameData.SourceSize = [+mDat[7], +mDat[8]];
        return frameData;
    }
    /** 根据远程下载回来的plist数据解析成能弄的plist */
    private getPlistByObject(object: IPlistAsset) {
        if (object && object._nativeAsset) {
            const plist: Record<string, unknown> = cc.js.createMap(true);
            const frams = object._nativeAsset.frames;
            for (const fName in frams) {
                let frameData = frams[fName];
                const plistData: { Rotated?: boolean, Frame?: number[][], Offset?: number[], SourceSize?: number[]; } = {};
                frameData.frame = frameData.frame.replace(/{/g, '[').replace(/}/g, ']');
                plistData.Frame = JSON.parse(frameData.frame);
                frameData.offset = frameData.offset.replace('{', '[').replace('}', ']');
                plistData.Offset = JSON.parse(frameData.offset);
                plistData.Rotated = frameData.rotated;
                frameData.sourceSize = frameData.sourceSize.replace('{', '[').replace('}', ']');
                plistData.SourceSize = JSON.parse(frameData.sourceSize);
                frameData = null;
                plist[fName.split('.')[0]] = plistData;
            }
            return plist;
        } else if (object && object.json) {
            const plist = {};
            const frams = object.json;

            for (const fName in frams) {
                let frame = frams[fName];
                plist[fName] = this.transPlist(frame);
                frame = null;
            }
            return plist;
        }
        return undefined;
    }

    public getEditorSkillFrame(pathNoSuffix: string, skillName: string): number[] {
        const path = `${UtilString.ReplaceFileNameForAnim(pathNoSuffix, '_cfg')}.json`;
        const actionPath = `${UtilString.ReplaceFileNameForAnim(pathNoSuffix, '_action')}.json`;
        const names = actionPath.split('/');
        const actionName = `${names[names.length - 1]}`;

        const asset: unknown = this.getCache(path);
        if (asset && asset[actionName]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return asset[actionName][skillName] as number[];
        }
        return [];
    }
}
