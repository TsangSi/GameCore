const { ccclass, property } = cc._decorator;

@ccclass
export default class ComSlider extends cc.Component {
    @property(cc.Slider)
    private slider: cc.Slider = null;

    @property(cc.ProgressBar)
    public progressbar: cc.ProgressBar = null;

    protected onLoad(): void {
        if (this.slider == null || this.progressbar == null) {
            return;
        }

        this.progressbar.progress = this.slider.progress;

        this.slider.node.on('slide', (event) => {
            this.progressbar.progress = this.slider.progress;
        }, this);
    }

    // 监听slider.progress???进度条设置值？
}
