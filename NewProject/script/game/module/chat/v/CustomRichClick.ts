/*
 * @Author: myl
 * @Date: 2022-07-12 14:40:18
 * @Description:
 */

import { Link } from '../../link/Link';

const { ccclass, property } = cc._decorator;

@ccclass
export class CustomRichClick extends cc.Component {
    private RichTextClick(evt, dta: string) {
        console.log('点击了相应的超链接', dta);
        const param: number[] = [];
        dta.split(',').forEach((element) => {
            param.push(parseInt(element));
        });

        if (param.length <= 0) {
            console.log('超链接无对应参数 无法识别跳转');
        }
        Link.To(param.shift(), ...param);
    }
}
