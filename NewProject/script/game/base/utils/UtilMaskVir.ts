/*
 * @Author: myl
 * @Date: 2022-11-15 10:42:54
 * @Description:
 */
/** 遮罩带虚化效果 */
export class UtilMaskVir {
    public static cahceMat = {};// 缓存下，防止重复加载材质
    /**
     *
     * @param render 渲染组件类
     * @param star 开始（0.1-1.0）
     * @param end 结束（0.1-1.0）
     * @returns
     */
    public static SetRange(render: cc.RenderComponent, star: number = 0.6, end: number = 0.7): void {
        if (CC_EDITOR) return;
        if (!render || !render.node) return;
        const path = 'effects/MaskVir';
        if (!this.cahceMat[path]) {
            cc.resources.load(path, cc.Material, null, (error, mat: cc.Material) => {
                render.setMaterial(0, mat);
                render.getMaterial(0).setProperty('range', [star, end]);
            });
        } else {
            render.setMaterial(0, this.cahceMat[path]);
            render.getMaterial(0).setProperty('range', [star, end]);
        }
    }

    // 还原材质
    public static ResetMat(render: cc.RenderComponent): void {
        if (CC_EDITOR) return;
        if (!render || !render.node) return;
        const materialName = render.getMaterial(0)?.name;
        if (!materialName) return;
        if (materialName.indexOf('builtin-2d-sprite') !== -1) {
            return;
        }
        render.setMaterial(0, cc.Material.getBuiltinMaterial('2d-sprite'));
    }
}
