/*
 * @Author: hwx
 * @Date: 2022-04-11 10:59:50
 * @FilePath: \SanGuo\assets\script\game\base\components\CanvasAdapter.ts
 * @Description: 画布内容适配类，始终用SHOW_ALL模式，获取屏幕适配后的值可以通过view对象获取。
 */
const {
    ccclass, property, requireComponent, menu, executeInEditMode,
} = cc._decorator;

@ccclass
@menu('适配/CanvasAdapter')
// @requireComponent(UITransform)
@executeInEditMode
export class CanvasAdapter extends cc.Component {
    /** 🔒设计大小 */
    @property
    private _designSize: cc.Size = new cc.Size(cc.view.getDesignResolutionSize());
    @property({ displayName: '🔒设计大小' })
    protected get designSize(): cc.Size { return this._designSize; }
    protected set designSize(size: cc.Size) {
        cc.warn('[CanvasAdapter] 设计宽高只能在项目设置中修改');
    }

    /** 适配最大宽高 */
    @property
    private _adaptMaxSize: cc.Size = new cc.Size(cc.view.getDesignResolutionSize());
    @property({ displayName: '适配最大宽高', tooltip: '推荐使用960x1680' })
    protected get adaptMaxSize(): cc.Size { return this._adaptMaxSize; }
    protected set adaptMaxSize(size: cc.Size) {
        if (size.width < this.designSize.width) {
            cc.warn('[CanvasAdapter] 最大适配宽度不能小于设计宽度');
            size.width = this.designSize.width;
        }
        if (size.height < this.designSize.height) {
            cc.warn('[CanvasAdapter] 最大适配高度不能小于设计高度');
            size.height = this.designSize.height;
        }
        this._adaptMaxSize = size;
        this.onResize();
    }

    protected onLoad(): void {
        if (CC_EDITOR) {
            // todo 2.4 暂时注释
            // Editor.Message.removeBroadcastListener('project:change-design-resolution', this.onChangeDesignResolution.bind(this));
            // Editor.Message.addBroadcastListener('project:change-design-resolution', this.onChangeDesignResolution.bind(this));
            // cc.view.off('design-resolution-changed', this.onChangeDesignResolution.bind(this));
            // cc.view.on('design-resolution-changed', this.onChangeDesignResolution.bind(this));
            return;
        }

        this.onResize();
        cc.view.setResizeCallback(() => this.onResize());
    }

    /** 侦听重置窗口大小 */
    private onResize() {
        // 屏幕宽高
        const winSize = cc.view.getFrameSize();
        const winWidth = winSize.width;
        const winHeight = winSize.height;

        // 设计分辨率宽高
        const designWidth = this.designSize.width;
        const designHeight = this.designSize.height;

        // 计算实际画布宽高
        let finalWidth = winWidth;
        let finalHeight = winHeight;
        if ((winWidth / winHeight) > (designWidth / designHeight)) {
            // 如果更长，则用定高
            finalHeight = designHeight;
            finalWidth = Math.min(Math.max(finalHeight * winWidth / winHeight, designWidth), this.adaptMaxSize.width); // 宽度限制
        } else {
            // 如果更短，则用定宽
            finalWidth = designWidth;
            finalHeight = Math.min(Math.max(finalWidth * winHeight / winWidth, designHeight), this.adaptMaxSize.height); // 高度限制
        }

        // 设置画布宽高
        this.node.setContentSize(finalWidth, finalHeight);

        // 设置画布设计分辨率，始终用SHOW_ALL模式
        cc.view.setDesignResolutionSize(finalWidth, finalHeight, cc.ResolutionPolicy.SHOW_ALL);
    }

    /** 侦听项目设置设计分辨率变化 */
    private onChangeDesignResolution(params: { width: number, height: number }) {
        this._designSize = new cc.Size(params.width, params.height);
    }
}
