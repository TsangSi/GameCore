/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: hrd
 * @Date: 2022-12-06 10:29:00
 * @Description:
 *
 */

const _updateRenderData: Function = cc['RenderFlow']['prototype']['_updateRenderData'];

cc['RenderFlow']['prototype']['_updateRenderData'] = function (node) {
    const comp = node._renderComponent;
    if (!comp) {
        // console.error('_updateRenderData comp is null', node);
        return;
    }
    _updateRenderData.call(this, node);
};
