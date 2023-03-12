import { AudioMgr } from '../../../../app/base/manager/AudioMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import ComSlider from '../../../com/slider/ComSlider';
import { SwitchButton } from '../../../com/switchBtn/SwitchButton';
import ModelMgr from '../../../manager/ModelMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ComMusicSettingInfo extends cc.Component {
    @property(cc.Slider) // 音乐
    private sliderMusicBg: cc.Slider = null;
    @property(cc.Slider) // 音效
    private sliderMusicEff: cc.Slider = null;
    @property(SwitchButton) // 音乐
    private switchBtnMusic: SwitchButton = null;
    @property(SwitchButton) // 特效
    private switchBtnEff: SwitchButton = null;

    protected start(): void {
        UtilGame.Click(this.switchBtnMusic.node, this._onSwitchMusic, this); // 音乐
        UtilGame.Click(this.switchBtnEff.node, this._onSwitchEff, this); // 特效
        this.sliderMusicBg.node.on('slide', this._onSliderMusic, this);
        this.sliderMusicEff.node.on('slide', this._onSliderEff, this);
    }
    //
    //
    /** 设置音乐音效默认状态 */
    private _setMusicDefault() {
        const openMusic = ModelMgr.I.SettingModel.getMusicSwitch(); // 获取音乐开启状态
        const musicVol = ModelMgr.I.SettingModel.getMusicVol(); // 获取音乐音量
        this.switchBtnMusic.setState(openMusic);
        this.sliderMusicBg.progress = musicVol;// slider进度条
        this.sliderMusicBg.getComponent(ComSlider).progressbar.progress = musicVol;// 绿色背景进度条
        AudioMgr.I.setMusicVolume(musicVol);

        const openEff = ModelMgr.I.SettingModel.getMusicEffSwitch(); // 获取音效果开启状态
        const effVol = ModelMgr.I.SettingModel.getEffVol(); // 获取音效音量
        this.switchBtnEff.setState(openEff);
        this.sliderMusicEff.progress = effVol;// slider进度条
        this.sliderMusicEff.getComponent(ComSlider).progressbar.progress = effVol;// 绿色背景进度条
        AudioMgr.I.setEffectVolume(effVol);// 从远端获取默认音量
    }
    // 切换音乐开关
    private _onSwitchMusic() {
        const preState = ModelMgr.I.SettingModel.getMusicSwitch(); // 获取音乐开启状态
        const curState = !preState;
        ModelMgr.I.SettingModel.setMusicSwitch(curState); // 获取音乐开启状态
        this.switchBtnMusic.setState(curState);
        if (curState) { // 前个状态是关  当前状态开
            this.sliderMusicBg.progress = 0.5;// 从关到开
            this.sliderMusicBg.getComponent(ComSlider).progressbar.progress = 0.5;// 绿色背景进度条
            this._setMusicVol(0.5);
            this.setMusicEnable(true);
        } else {
            this.sliderMusicBg.progress = 0;// 从开到关
            this.sliderMusicBg.getComponent(ComSlider).progressbar.progress = 0;// 绿色背景进度条
            this._setMusicVol(0);
            this.setMusicEnable(false);
        }
    }
    public setMusicEnable(bol: boolean): void {
        AudioMgr.I.setMusicEnable(bol);
        ModelMgr.I.SettingModel.setMusicSwitch(bol);// 开 存进去的是true
    }
    private _setMusicVol(proNum: number): void {
        AudioMgr.I.setMusicVolume(proNum);
        ModelMgr.I.SettingModel.setMusicVol(proNum);
    }
    // 切换音效开关
    private _onSwitchEff() {
        const preState = ModelMgr.I.SettingModel.getMusicEffSwitch(); // 获取音乐开启状态
        const curState = !preState;
        ModelMgr.I.SettingModel.setMusicEffSwitch(curState); // 获取音乐开启状态
        this.switchBtnEff.setState(curState);

        if (curState) { // 前个状态是关  当前状态开
            this.sliderMusicEff.progress = 0.5;// 从关到开
            this.sliderMusicEff.getComponent(ComSlider).progressbar.progress = 0.5;// 绿色背景进度条
            this._setEffVol(0.5);
            this._setMusicEffEnable(true);
        } else {
            this.sliderMusicEff.progress = 0;// 从开到关
            this.sliderMusicEff.getComponent(ComSlider).progressbar.progress = 0;// 绿色背景进度条
            this._setEffVol(0);
            this._setMusicEffEnable(false);
        }
    }
    public _setMusicEffEnable(bol: boolean): void {
        AudioMgr.I.setEffectEnable(bol);
        ModelMgr.I.SettingModel.setMusicEffSwitch(bol);// 开 存进去的是true
    }
    private _setEffVol(proNum: number): void {
        AudioMgr.I.setEffectVolume(proNum);
        ModelMgr.I.SettingModel.setEffVol(proNum);
    }
    // 滑动音乐音效滑条
    private _onSliderMusic(): void {
        const curPro = this.sliderMusicBg.progress;
        this._setMusicVol(curPro);
        this._onSliderMusicState(this.sliderMusicBg.progress !== 0);
    }
    private _openMusicState = -1;
    private _onSliderMusicState(bol: boolean) {
        const s = bol ? 1 : 0;
        if (s === this._openMusicState) { return; }
        this._openMusicState = s;

        this.setMusicEnable(bol);
        ModelMgr.I.SettingModel.setMusicSwitch(bol); // 获取音乐开启状态
        this.switchBtnMusic.setState(bol);
    }
    private _onSliderEff(): void {
        const curPro = this.sliderMusicEff.progress;
        this._setEffVol(curPro);
        this._onSliderMusicEffState(this.sliderMusicEff.progress !== 0);
    }
    private _openMusicEffState = -1;
    private _onSliderMusicEffState(bol: boolean) {
        const s = bol ? 1 : 0;
        if (s === this._openMusicEffState) { return; }
        this._openMusicEffState = s;

        this._setMusicEffEnable(bol);
        ModelMgr.I.SettingModel.setMusicEffSwitch(bol); // 获取音乐开启状态
        this.switchBtnEff.setState(bol);
    }
    //
    protected onLoad(): void {
        this._setMusicDefault();// 设置音乐开关
    }
}
