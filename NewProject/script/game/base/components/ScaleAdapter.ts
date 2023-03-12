/*
 * @Author: hwx
 * @Date: 2022-04-13 10:36:57
 * @FilePath: \SanGuo\assets\script\game\base\components\ScaleAdapter.ts
 * @Description: 节点缩放适配，多用于背景图片
 */
const {
    ccclass, property, requireComponent, menu, executeInEditMode,
} = cc._decorator;

/** 缩放模式枚举 */
enum ScaleMode {
    /** 优点：到边不变形；缺点：不全显 */
    NO_BORDER,
    /** 优点：到边内容全显, 可限宽高；缺点：变形 */
    SHOW_ALL,
}

@ccclass
@menu('适配/ScaleAdapter')
// @requireComponent(UITransform)
@executeInEditMode
export class ScaleAdapter extends cc.Component {
    /** 缩放模式 */
    @property
    private _scaleMode: ScaleMode = ScaleMode.SHOW_ALL;
    @property({
        type: cc.Enum(ScaleMode),
        displayName: '缩放模式',
        tooltip: 'NO_BORDER（优点：到边不变形；缺点：不全显） SHOW_ALL（优点：到边内容全显, 可限宽高；缺点：变形）',
    })
    protected get scaleMode(): ScaleMode { return this._scaleMode; }
    protected set scaleMode(mode: ScaleMode) {
        this._scaleMode = mode;
        this.onRescale();
    }

    /** 适配最大宽高 */
    @property
    private _adaptMaxSize: cc.Size = new cc.Size(cc.view.getDesignResolutionSize());
    @property({
        displayName: '适配最大宽高',
        tooltip: '推荐使用960x1680',
        visible(this: ScaleAdapter) {
            return this._scaleMode === ScaleMode.SHOW_ALL;
        },
    })
    protected get adaptMaxSize(): cc.Size { return this._adaptMaxSize; }
    protected set adaptMaxSize(size: cc.Size) {
        const designSize = cc.view.getDesignResolutionSize();
        if (size.width < designSize.width) {
            cc.warn('[CanvasAdapter] 最大适配宽度不能小于设计宽度');
            size.width = designSize.width;
        }
        if (size.height < designSize.height) {
            cc.warn('[CanvasAdapter] 最大适配高度不能小于设计高度');
            size.height = designSize.height;
        }
        this._adaptMaxSize = size;
        this.onRescale();
    }

    protected onLoad(): void {
        this.onRescale();
        cc.view.on('design-resolution-changed', this.onRescale, this);
    }

    protected onDestroy(): void {
        cc.view.off('design-resolution-changed', this.onRescale, this);
    }

    /** 重置缩放 */
    private onRescale(): void {
        // 节点宽高
        // const transform = this.getComponent(UITransform);
        const nodeWidth = this.node.width;
        const nodeHeight = this.node.height;

        // 屏幕宽高
        const winSize = cc.view.getFrameSize();
        const winWidth = winSize.width;
        const winHeight = winSize.height;

        // 设计分辨率宽高
        const designSize = cc.view.getDesignResolutionSize();
        const designWidth = designSize.width;
        const designHeight = designSize.height;

        // 计算实际节点宽高
        let finalWidth = winWidth;
        let finalHeight = winHeight;
        if ((winWidth / winHeight) > (designWidth / designHeight)) {
            // 如果更长，则用定高
            finalHeight = designHeight;
            finalWidth = finalHeight * (winWidth / winHeight);
        } else {
            // 如果更短，则用定宽
            finalWidth = designWidth;
            finalHeight = finalWidth * (winHeight / winWidth);
        }

        // 计算缩放值
        let nodeScaleX = 1;
        let nodeScaleY = 1;
        if (this.scaleMode === ScaleMode.NO_BORDER) {
            // NO_BORDER（优点：到边不变形；缺点：不全显）
            nodeScaleX = nodeScaleY = Math.max(finalWidth / nodeWidth, finalHeight / nodeHeight);
        } else {
            // SHOW_ALL（优点：到边内容全显, 可限宽高；缺点：变形）
            const adaptMaxWidth = this.adaptMaxSize.width;
            const adaptMaxHeight = this.adaptMaxSize.height;
            finalWidth = Math.min(Math.max(finalWidth, designWidth), adaptMaxWidth); // 宽度限制
            nodeScaleX = Math.min(finalWidth / nodeWidth, adaptMaxWidth / nodeWidth);
            finalHeight = Math.min(Math.max(finalHeight, designHeight), adaptMaxHeight); // 高度限制
            nodeScaleY = Math.min(finalHeight / nodeHeight, adaptMaxHeight / nodeHeight);
        }
        this.node.setScale(nodeScaleX, nodeScaleY);
    }
}
