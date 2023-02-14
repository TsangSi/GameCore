import {
    _decorator, Component, Node, Asset, sys, instantiate, game,
} from 'cc';
import { EventM } from '../common/EventManager';
import LoginManager from '../ui/login/LoginManager';
import { UI_NAME } from '../ui/UIConfig';
import UIManager from '../ui/UIManager';
import UtilsCC from '../utils/UtilsCC';
import UtilsStorage from '../utils/UtilsStorage';

const { ccclass, property } = _decorator;

// const customManifestStr = JSON.stringify({
//     version: '0.0.0.0',
//     packageUrl: 'http://192.168.123.95/hotgame',
//     remoteManifestUrl: 'http://192.168.123.95/project.manifest',
//     remoteVersionUrl: 'http://192.168.123.95/version.manifest',
//     assets: {},
//     searchPaths: [],
// });

@ccclass('UpdateWin')
export class UpdateWin extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property(Asset)
    private mainFestUrl: Asset = undefined;

    /** 是否更新中 */
    private updating = false;

    /** 失败数量 */
    private failCount = 0;

    /** 重试 */
    private canRetry = false;
    private am: jsb.AssetsManager = undefined;
    private versionCompareHandle: (versionA: string, versionB: string) => number = undefined;
    private storagePath: string = undefined;

    private content: Node = undefined;

    private onTestClicked() {
        const sp = this.node.getChildByName('Sprite-001');
        sp.destroy();
    }
    protected start(): void {
        UtilsCC.setClickEvent('Sprite', this.node, 'onTestClicked', this);
        // UIManager.I.show(UI_NAME.AccountLogin);
        // console.log('isnative=', sys.isNative);
        if (!sys.isNative) {
            // console.log('sys=', sys);
            UIManager.I.close(UI_NAME.UpdateWin);
            return;
        }
        // const _this = this;
        // setTimeout(() => {

        // UIManager.I.close(UI_NAME.UpdateWin);
        // }, 2000);

        UtilsCC.setActive('ScrollView', this.node, true);
        this.content = UtilsCC.getNode('ScrollView/view/content', this.node);
        UtilsCC.setClickEvent('tips/sprite4', this.node, 'onUpdateClicked', this);

        this.storagePath = `${jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/'}HLgame/asset`;

        this.showLog(`Storage path for remote asset : ${this.storagePath}`);

        this.versionCompareHandle = (versionA, versionB) => {
            LoginManager.I.cVersion = versionB;
            this.showLog(`============versionB=${versionB}`);
            this.showLog(`============LoginManager.I.cVersion=${LoginManager.I.cVersion}`);
            this.showLog(`JS Custom Version Compare: version A is ${versionA}, version B is ${versionB}`);
            const vA = versionA.split('.');
            const vB = versionB.split('.');
            for (let i = 0; i < vA.length; ++i) {
                const a = parseInt(vA[i]);
                const b = vB[i] ? parseInt(vB[i]) : 0;
                if (a === b) {
                    continue;
                } else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            } else {
                return 0;
            }
        };
        this.am = new jsb.AssetsManager('', this.storagePath, this.versionCompareHandle);
        this.am.setVerifyCallback((path, asset) => {
            const compressed = asset.compressed;

            const expectedMD5 = asset.md5;

            const relativePath = asset.path;

            // const size = asset.size;
            if (compressed) {
                this.showLog(`Verification passed : ${relativePath}`);
                return true;
            } else {
                this.showLog(`Verification passed : ${relativePath} (${expectedMD5})`);
                return true;
            }
        });

        this.showLog('Hot update is ready, please check or directly update.');

        if (sys.os === sys.OS.ANDROID) {
            this.showLog('Max concurrent tasks count have been limited to 2');
        }
        this.checkUpdate();
    }
    public showLog(...param: any[]): void {
        // this.showLog.apply(this.showLog, Array.prototype.slice.call(arguments, 0));
        let text = '';
        for (let i = 0; i < param.length; i++) {
            const str = param[i];
            if (str) {
                text += str;
            }
        }
        if (this.content && this.content.children && this.content.children.length > 0) {
            const label = this.content.children[0];
            const newLabel = instantiate(label);
            this.content.addChild(newLabel);
            newLabel.setSiblingIndex(100 - this.content.children.length);
            newLabel.active = true;
            UtilsCC.setString(newLabel, text);
        }
        console.log(text);
    }

    public retry(): void {
        if (!this.updating && this.canRetry) {
            // this.panel.retryBtn.active = false;
            this.canRetry = false;

            this.showLog('Retry failed Assets...=');
            this.am.downloadFailedAssets();
        }
    }

    private checkUpdate() {
        if (this.updating) {
            this.showLog('Checking or updating ...');
            return;
        }

        if (this.am.getState() === jsb.AssetsManager.State.UNINITED) {
            const url = this.mainFestUrl.nativeUrl;
            this.am.loadLocalManifest(url);
        }
        const manifest = this.am.getLocalManifest();
        if (!manifest || !manifest.isLoaded()) {
            this.showLog('Failed to load local manifest ...');
            return;
        }

        this.am.setEventCallback(this.checkCb.bind(this));
        this.am.checkUpdate();
        this.updating = true;
    }

    private onUpdateClicked() {
        UtilsCC.setActive('tips', this.node, false);
        UtilsCC.setActive('ProgressBar', this.node, true);
        this.hotUpdate();
    }

    private checkCb(event: jsb.EventAssetsManager) {
        const code = event.getEventCode();
        this.showLog(`Code: ${code}`);
        switch (code) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.showLog('No local manifest file found, hot update skipped.');
                // 本地版本没有记录
                this.am.setEventCallback(null);
                this.updating = false;
                UIManager.I.close(UI_NAME.UpdateWin);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.showLog('Fail to download manifest file, hot update skipped.');
                // 版本记录文件错误
                this.am.setEventCallback(null);
                this.updating = false;
                UIManager.I.close(UI_NAME.UpdateWin);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.showLog('Already up to date with the latest remote version.');
                // 已经是最新版本了
                this.am.setEventCallback(null);
                this.updating = false;
                UIManager.I.close(UI_NAME.UpdateWin);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                // 发现有更新
                this.am.setEventCallback(null);
                this.updating = false;
                // this.panel.info.string = 'New version found, please try to update. (' + this._am.getTotalBytes() + ')';
                this.showLog(`New version found, please try to update. (${this.am.getTotalBytes()})`);
                UtilsCC.setActive('tips', this.node, true);
                UtilsCC.setString(
                    'tips/Label',
                    this.node,
                    '版本更新了，%d个新文件(%sMB)',
                    this.am.getTotalFiles(),
                    (this.am.getTotalBytes() / 1024 / 1024).toFixed(2),
                );
                break;
            default:
                break;
        }
    }

    private hotUpdate() {
        if (this.am && !this.updating) {
            this.am.setEventCallback(this.updateCb.bind(this));

            if (this.am.getState() === jsb.AssetsManager.State.UNINITED) {
                const url = this.mainFestUrl.nativeUrl;
                this.am.loadLocalManifest(url);
            }
            this.failCount = 0;
            this.am.update();
            this.updating = true;
        }
    }

    private updateCb(event: jsb.EventAssetsManager) {
        let needRestart = false;
        let failed = false;
        let p = 0;
        let totalMb = 0;
        let totalS: string[] = [];
        let totalMbS = '';
        let curMb = 0;
        let curS: string[] = [];
        let curMbS = '';
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.showLog('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                p = event.getPercent() || 0;
                this.showLog(`Byte progression : ${p * 100}`);
                this.showLog(`File progression : ${event.getPercentByFile() / 100}`);
                this.showLog(`Total files      : ${event.getTotalFiles()}`);
                this.showLog(`Downloaded files : ${event.getDownloadedFiles()}`);
                this.showLog(`Total bytes      : ${event.getTotalBytes()}`);
                this.showLog(`Downloaded bytes : ${event.getDownloadedBytes()}`);
                UtilsCC.setString('ProgressBar/Label', this.node, `${Math.floor(p * 100)}%`);
                totalMb = event.getTotalBytes() / 1024 / 1024;
                totalS = totalMb.toString().split('.');
                if (totalS.length === 2 && totalS[1].length > 2) {
                    totalS[1] = totalS[1].substr(0, 2);
                    totalMbS = `${totalS[0]}.${totalS[1]}`;
                }
                curMb = event.getDownloadedBytes() / 1024 / 1024;
                curS = curMb.toString().split('.');
                if (curS.length === 2 && curS[1].length > 2) {
                    curS[1] = curS[1].substr(0, 2);
                    curMbS = `${curS[0]}.${curS[1]}`;
                }
                UtilsCC.setString(
                    'ProgressBar/speed',
                    this.node,
                    '%sMB/%sMB(%d/%d)',
                    curMbS,
                    totalMbS,
                    event.getDownloadedFiles(),
                    event.getTotalFiles(),
                );

                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.showLog('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.showLog('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                UtilsCC.setString('ProgressBar/Label', this.node, '100%');
                totalMb = event.getTotalBytes() / 1024 / 1024;
                totalS = totalMb.toString().split('.');
                totalMbS = '';
                if (totalS.length === 2 && totalS[1].length > 2) {
                    totalS[1] = totalS[1].substr(0, 2);
                    totalMbS = `${totalS[0]}.${totalS[1]}`;
                }
                curMb = event.getDownloadedBytes() / 1024 / 1024;
                curS = curMb.toString().split('.');
                curMbS = '';
                if (curS.length === 2 && curS[1].length > 2) {
                    curS[1] = curS[1].substr(0, 2);
                    curMbS = `${curS[0]}.${curS[1]}`;
                }
                UtilsCC.setString(
                    'ProgressBar/speed',
                    this.node,
                    '%sMB/%sMB（%d/%d）',
                    curMbS,
                    totalMbS,
                    event.getDownloadedFiles(),
                    event.getTotalFiles(),
                );

                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.showLog(`1111111Update failed. ${event.getMessage()}`);
                // this.panel.retryBtn.active = true;
                this.updating = false;
                this.canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.showLog(`Asset update error: ${event.getAssetId()}, ${event.getMessage()}`);
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.showLog(event.getMessage());
                break;
            default:
                break;
        }
        if (failed) {
            this.am.setEventCallback(null);
            this.updating = false;
        }
        if (needRestart) {
            this.am.setEventCallback(null);
            const searchPaths = jsb.fileUtils.getSearchPaths();
            const newPaths = this.am.getLocalManifest().getSearchPaths();
            this.showLog('newPaths', JSON.stringify(newPaths));
            // this.showLog('searchPaths=',)
            this.showLog('1111111111111111');
            for (let i = 0, n = newPaths.length; i < n; i++) {
                searchPaths.unshift(newPaths[i]);
            }
            this.showLog('222222222222');
            // Array.prototype.unshift.apply(searchPaths, newPaths);
            UtilsStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            this.showLog('3333333333333');
            jsb.fileUtils.setSearchPaths(searchPaths);
            this.showLog('44444444444');
            game.restart().then(() => {
                console.log('游戏重启');
            }).catch(() => {
                //
            });
            this.showLog('5555555555');
        }
    }

    protected onDestroy(): void {
        // UIManager.I.show(UI_NAME.Login);
        // UIManager.I.show(UI_NAME.CreateRole);
        // EventM.I.fire(EventM.Type.SceneMap.FirstLoadComplete);
        EventM.I.fire(EventM.Type.Update.Success);
    }
}
