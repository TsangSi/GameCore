import ModelMgr from '../../../game/manager/ModelMgr';
import { BundleType } from '../../core/res/BundleMgr';
import { AssetType } from '../../core/res/ResConst';
import { ResMgr } from '../../core/res/ResMgr';
import AudioPath from './AudioPath';

/** 声音可选项参数 */
interface SoundOptional {
    bundle?: BundleType;
    isRemote?: boolean;
}

/** 音乐可选项参数 */
export interface SoundMusicOptional extends SoundOptional {
    loop?: boolean;
}

/** 音效可选项参数 */
export interface SoundEffectOptional extends SoundOptional {
    volumeScale?: number;
}

export class AudioMgr {
    private static _Instance: AudioMgr;
    public static get I(): AudioMgr {
        if (!this._Instance) {
            this._Instance = new AudioMgr();
        }
        return this._Instance;
    }
    // /** 缓存音频 */
    private _cachedAudioClipMap: Record<string, cc.AudioClip> = {};
    // 音效
    private effectEnable: boolean = true;// 开关 默认允许播放
    private effectVolume: number = 0.5;// 默认音量大小

    // 背景音乐
    private musicEnable: boolean = true;// 开关 默认允许播放
    private musicVolume: number = 0.5;// 默认音量大小
    private musicId: number = undefined;

    public init(): void {
        /** 获取音乐开关状态 */
        this.pauseMusic();
        const musicOpenState = ModelMgr.I.SettingModel.getMusicSwitch();
        AudioMgr.I.musicEnable = musicOpenState;
        AudioMgr.I.musicVolume = ModelMgr.I.SettingModel.getMusicVol();// 音乐音量 获取服务器得
        if (!musicOpenState) { // 音乐未开启 音量设置为0
            AudioMgr.I.musicVolume = 0;
            ModelMgr.I.SettingModel.setMusicVol(0);
        }
        this.setMusicVolume(AudioMgr.I.musicVolume);

        /** 获取音效开关状态 */
        const musicEffOpenState = ModelMgr.I.SettingModel.getMusicEffSwitch();
        AudioMgr.I.effectEnable = musicEffOpenState;
        AudioMgr.I.effectVolume = ModelMgr.I.SettingModel.getEffVol();
        if (!musicEffOpenState) { // 音效未开启 音量设置为0
            ModelMgr.I.SettingModel.setEffVol(0);
            AudioMgr.I.effectVolume = 0;
        }
        this.setMusicVolume(AudioMgr.I.effectVolume);
    }

    public pauseMusic(): void {
        cc.audioEngine.pauseMusic();
    }

    /** 加载音频 */
    private _loadAudioClip(soundPath: string, optional: SoundOptional, complete: (clip: cc.AudioClip) => void): void {
        const cachedAudioClip = this._cachedAudioClipMap[soundPath];
        if (cachedAudioClip) {
            complete(cachedAudioClip);
            return;
        }
        const _loadCallBack = (err, clip: cc.AudioClip) => {
            if (err) return;
            this._cachedAudioClipMap[soundPath] = clip;
            complete(clip);
        };

        const isRemote = optional && optional.isRemote ? optional.isRemote : false;
        if (isRemote) {
            ResMgr.I.loadRemote(soundPath, AssetType.AudioClip, _loadCallBack);
        } else {
            const bundle = optional ? optional.bundle : undefined;
            ResMgr.I.loadLocal(soundPath, cc.AudioClip, _loadCallBack, { bundle });
        }
    }

    /** 播放音乐 */
    public curMusicPath: string = '';

    private lastMisic: cc.AudioClip = null;
    public playMusic(soundPath: string, optional: SoundMusicOptional): void {
        if (this.curMusicPath === soundPath) return;
        this.curMusicPath = soundPath;
        if (!AudioMgr.I.musicEnable) {
            return;
        }
        const loop = optional && !optional.loop ? !!optional.loop : true; // 默认循环播放
        this._loadAudioClip(soundPath, optional, (clip) => {
            if (this.lastMisic && this.lastMisic !== clip) {
                cc.audioEngine.stopMusic();
                this.lastMisic.destroy();
                this.lastMisic = null;
            }
            this.lastMisic = clip;
            this.musicId = cc.audioEngine.playMusic(clip, loop);
        });
    }

    public playEffect(soundPath: string, optional?: SoundEffectOptional): void {
        if (!this.effectEnable) {
            return;
        }
        this._loadAudioClip(soundPath, optional, (clip) => {
            if (!clip) return;
            clip.addRef();
            const audioId = cc.audioEngine.playEffect(clip, false);
            cc.audioEngine.setFinishCallback(audioId, () => {
                cc.audioEngine.stopEffect(audioId);
                setTimeout(() => {
                    if (clip) {
                        if (clip.refCount === 1) {
                            delete this._cachedAudioClipMap[soundPath];
                        }
                        clip.decRef(true);
                    }
                }, 2000);
            });
        });
    }

    // 0--1 设置音乐音量
    public setMusicVolume(volume: number): void {
        this.musicVolume = volume;
        if (this.musicId) {
            cc.audioEngine.setVolume(this.musicId, this.musicVolume);
        } else {
            cc.audioEngine.setMusicVolume(this.musicVolume);
        }
    }
    // 获取音乐音量
    public getMusicVolume(): number {
        return this.musicVolume;
    }
    // 0~1 设置 音效音量
    public setEffectVolume(volume: number): void {
        this.effectVolume = volume;
        cc.audioEngine.setEffectsVolume(this.effectVolume);
    }
    // 获取 音效音量
    public getEffectVolume(): number {
        return this.effectVolume;
    }

    /** 暂停、播放、音效 */
    public setEffectEnable(enable: boolean): void {
        this.effectEnable = enable;
    }

    // 暂停、播放、音乐
    public setMusicEnable(enable: boolean): void {
        this.musicEnable = enable;

        if (this.musicEnable) {
            if (this.musicId !== undefined) {
                cc.audioEngine.resume(this.musicId);
            } else {
                this.playMusic(this.curMusicPath, { isRemote: true, loop: true });
            }
        } else if (this.musicId !== undefined) {
            cc.audioEngine.pause(this.musicId);
        }
    }

    // 音乐播放完成监听
    public onMusicComplete(): void {
        // do sth
    }

    /** 播放登录音乐 */
    public playLoginMusic(): void {
        /** 此时还没初始化音频 */
        AudioMgr.I.musicEnable = true;
        AudioMgr.I.musicVolume = 0.5;
        const path: string = `${AudioPath.audio}login`;
        AudioMgr.I.playMusic(path, { isRemote: true, loop: true });
    }
    /** 播放创建角色音乐 */
    public playCreateRoleMusic(): void {
        /** 此时还没初始化音频 */
        AudioMgr.I.musicEnable = true;
        AudioMgr.I.musicVolume = 0.5;
        const path: string = `${AudioPath.audio}createRole`;
        AudioMgr.I.playMusic(path, { isRemote: true, loop: true });
    }
}
