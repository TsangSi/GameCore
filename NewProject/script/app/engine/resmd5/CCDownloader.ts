/*
 * @Author: zs
 * @Date: 2022-06-28 21:56:10
 * @FilePath: \SanGuo2.4-zengsi\assets\script\app\engine\resmd5\CCDownloader.ts
 * @Description:
 *
 */

import { CCResMD5 } from './CCResMD5';

type IDownCallback = (...args: any) => any;

type TDownloader = typeof cc.assetManager.downloader

interface IDiyDownloader extends TDownloader {
    _downloaders: { [key: string]: IDownCallback }
}
/** 引擎原始的assetManager.downloader对象 */
const downloader: IDiyDownloader = cc.assetManager.downloader as IDiyDownloader;

/** 引擎原始的下载回调表 */
const downloaders = downloader._downloaders;

const downloadDomImage1 = downloaders['.jpg'];
const _downloadDomImage = function (url: string, ...args: any[]): any {
    url = CCResMD5.GetHashUrl(url);
    return downloadDomImage1(url, ...args);
};

const downloadText = downloaders['.txt'];
const _downloadText = function (url: string, ...args: any[]): any {
    url = CCResMD5.GetHashUrl(url);
    return downloadText(url, ...args);
};

const downloadArrayBuffer = downloaders['.bin'];
const _downloadArrayBuffer = function (url: string, ...args: any[]): any {
    url = CCResMD5.GetHashUrl(url);
    return downloadArrayBuffer(url, ...args);
};

const downloadJson = downloaders['.json'];
const _downloadJson = function (url: string, ...args: any[]): any {
    url = CCResMD5.GetHashUrl(url);
    return downloadJson(url, ...args);
};
const downloadBundle = downloaders.bundle;
const _downloadBundle = function (url: string, ...args: any[]): any {
    url = CCResMD5.GetHashUrl(url);
    return downloadBundle(url, ...args);
};
const downloadAudio = downloaders['.mp3'];
const _downloadAudio = function (url: string, ...args: any[]): any {
    url = CCResMD5.GetHashUrl(url);
    return downloadAudio(url, ...args);
};
const downloadFont = downloaders['.font'];
const _downloadFont = function (url: string, ...args: any[]): any {
    url = CCResMD5.GetHashUrl(url);
    return downloadFont(url, ...args);
};
const downloadScript = downloaders['.js'];
const _downloadScript = function (url: string, ...args: any[]): any {
    url = CCResMD5.GetHashUrl(url);
    return downloadScript(url, ...args);
};
const downloadCCONB = downloaders['.cconb'];
const _downloadCCONB = function (url: string, ...args: any[]): any {
    url = CCResMD5.GetHashUrl(url);
    return downloadCCONB(url, ...args);
};
const downloadCCON = downloaders['.ccon'];
const _downloadCCON = function (url: string, ...args: any[]): any {
    url = CCResMD5.GetHashUrl(url);
    return downloadCCON(url, ...args);
};

if (!CC_EDITOR) {
    downloaders['.png'] = _downloadDomImage;
    downloaders['.jpg'] = _downloadDomImage;
    downloaders['.bmp'] = _downloadDomImage;
    downloaders['.jpeg'] = _downloadDomImage;
    downloaders['.gif'] = _downloadDomImage;
    downloaders['.ico'] = _downloadDomImage;
    downloaders['.tiff'] = _downloadDomImage;
    downloaders['.webp'] = _downloadDomImage;
    downloaders['.image'] = _downloadDomImage;

    downloaders['.pvr'] = _downloadArrayBuffer;
    downloaders['.pkm'] = _downloadArrayBuffer;
    downloaders['.astc'] = _downloadArrayBuffer;
    downloaders['.binary'] = _downloadArrayBuffer;
    downloaders['.bin'] = _downloadArrayBuffer;
    downloaders['.dbbin'] = _downloadArrayBuffer;
    downloaders['.skel'] = _downloadArrayBuffer;

    downloaders['.json'] = _downloadJson;
    downloaders['.ExportJson'] = _downloadJson;

    /** 音频 */
    downloaders['.mp3'] = _downloadAudio;
    downloaders['.ogg'] = _downloadAudio;
    downloaders['.wav'] = _downloadAudio;
    downloaders['.m4a'] = _downloadAudio;

    /** 字体 */
    downloaders['.eot'] = _downloadFont;
    downloaders['.font'] = _downloadFont;
    downloaders['.svg'] = _downloadFont;
    downloaders['.ttc'] = _downloadFont;
    downloaders['.ttf'] = _downloadFont;
    downloaders['.woff'] = _downloadFont;

    downloaders['.js'] = _downloadScript;
    downloaders['.ccon'] = _downloadCCON;
    downloaders['.cconb'] = _downloadCCONB;
    downloaders.bundle = _downloadBundle;

    downloaders['.txt'] = _downloadText;
    downloaders['.xml'] = _downloadText;
    downloaders['.vsh'] = _downloadText;
    downloaders['.fsh'] = _downloadText;
    downloaders['.atlas'] = _downloadText;
    downloaders['.tmx'] = _downloadText;
    downloaders['.tsx'] = _downloadText;
    downloaders['.plist'] = _downloadText;
    downloaders['.fnt'] = _downloadText;
    downloaders.default = _downloadText;
}
