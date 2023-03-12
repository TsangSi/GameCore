/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-04-27 16:37:43
 * @LastEditors: kexd
 * @LastEditTime: 2022-05-10 20:11:20
 * @FilePath: \sanguo\assets\script\app\base\map\attribute\AttributeUtils.ts
 * @Description:
 *
 */
import AttributeEditor from './AttributeEditor';
import EditorElement from '../EditorElement/EditorElement';

export default class AttributeUtils {
    private static _instance:AttributeUtils = null;

    public static get I():AttributeUtils {
        if (!this._instance) {
            this._instance = new AttributeUtils();
            this._instance.init();
        }

        return this._instance;
    }

    // private classDic = new Map();

    private baseAttributes:AttributeEditor[] = [
        new AttributeEditor('objId', '物体的唯一标识'),
        new AttributeEditor('objName', '物体名称'),
        new AttributeEditor('objType', '物体类型'),
        new AttributeEditor('skin', '物体皮肤'),
        new AttributeEditor('x', 'x坐标', AttributeEditor.NUMBER),
        new AttributeEditor('y', 'y坐标', AttributeEditor.NUMBER),
        // new AttributeEditor("z","z坐标",AttributeEditor.NUMBER),
        new AttributeEditor('cx', '世界坐标x轴', AttributeEditor.NUMBER, false),
        new AttributeEditor('cy', '世界坐标y轴', AttributeEditor.NUMBER, false),
        // new AttributeEditor("width","对象宽度",AttributeEditor.NUMBER),
        // new AttributeEditor("height","对象高度",AttributeEditor.NUMBER),
        new AttributeEditor('scaleX', '水平缩放', AttributeEditor.NORMAL),
        new AttributeEditor('scaleY', '垂直缩放', AttributeEditor.NORMAL),
        // new AttributeEditor("alpha","对象透明度",AttributeEditor.NUMBER),
        new AttributeEditor('params', '自定义参数'),
    ];

    private init():void {
        this.initClassDic();
    }

    public initClassDic():void {
        // this.classDic.EditorElement = this.baseAttributes;

        // this.classDic.EditorNPC = this.baseAttributes.concat([
        //     // new AttributeEditor("direction","模型方向",AttributeEditor.NUMBER),
        //     // new AttributeEditor("state","玩家状态",AttributeEditor.NUMBER),
        //     // new AttributeEditor("sizeGrid","资源切片")
        // ]);
    }

    public getObjectEditAttribute(editObj:EditorElement):AttributeEditor[] {
        return this.baseAttributes;
        // const key:string = editObj.className;
        // return this.classDic[key];
    }
}
