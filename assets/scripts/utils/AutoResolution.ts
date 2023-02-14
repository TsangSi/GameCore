import {
 Component, screen, view, Widget, _decorator,
} from 'cc';

const { ccclass, property } = _decorator;
@ccclass
export default class AutoResolution extends Component {
    public static rootWidth = 720;
    public static rootHeight = 1280;
    public static originWidth = 720;
    public static originHeight = 1280;

    protected start(): void {
        view.on('design-resolution-changed', () => {
            console.log('222222222222');
            this.updateRootSize();
        });
        this.updateRootSize();
    }
    public updateRootSize(): void {
        const size = screen.windowSize;
        AutoResolution.rootWidth = (size.width / size.height) * 1280;
        AutoResolution.rootHeight = (size.height / size.width) * 720;
        AutoResolution.rootWidth = AutoResolution.rootWidth > 720 ? AutoResolution.rootWidth : 720;
        AutoResolution.rootHeight = AutoResolution.rootHeight > 1280 ? AutoResolution.rootHeight : 1280;
        AutoResolution.rootWidth = AutoResolution.rootWidth > 960 ? 960 : AutoResolution.rootWidth;
        AutoResolution.rootHeight = AutoResolution.rootHeight > 1600 ? 1600 : AutoResolution.rootHeight;
        this.node.getComponent(Widget)?.updateAlignment();
    }
    /**
     * 由于适配导致的偏移 y
     */
    public static offsetY(): number {
        return AutoResolution.rootHeight - AutoResolution.originHeight;
    }
    /**
     * 由于适配导致的偏移 x
     */
     public static offsetX(): number {
        return AutoResolution.rootWidth - AutoResolution.originWidth;
    }
    /**
     * 由于适配导致的偏移缩放比 x
     */
     public static offsetScaleY(): number {
        return AutoResolution.rootHeight / AutoResolution.originHeight;
    }
    /**
     * 由于适配导致的偏移缩放比 x
     */
     public static offsetScaleX(): number {
        return AutoResolution.rootWidth / AutoResolution.originWidth;
    }
}
