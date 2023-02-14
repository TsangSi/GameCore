import {
    _decorator, Component, Sprite,
   } from 'cc';
   import UtilsCC from '../../../../scripts/utils/UtilsCC';

   const { ccclass } = _decorator;

   /**
    * Predefined variables
    * Name = Test2
    * DateTime = Tue Mar 22 2022 17:37:47 GMT+0800 (中国标准时间)
    * Author = knuth520
    * FileBasename = Test2.ts
    * FileBasenameNoExtension = Test2
    * URL = db://assets/gamelogic/scripts/ui/main/Test2.ts
    * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
    *
    */

   @ccclass('Test2')
   export class Test2 extends Component {
       protected start(): void {
        // const s = this.node.getChildByName('1');
        // UtilsCC.setSprite(s.getComponent(Sprite), 'i/m/main/bottom/fnt_shengjichenggong');
        // console.log(this.node.children[363]);
        // const s2 = this.node.getChildByName('3');
        // UtilsCC.setSprite(s.getComponent(Sprite), 'i/m/main/bottom/fnt_shengjichenggong');
        // console.log(this.node.children[363]);
        // s.setSiblingIndex(0);
        // s2.setSiblingIndex(this.node.children.length - 100);

        // setTimeout(() => {
        //     s.setSiblingIndex(this.node.children.length - 112);
        //     s2.setSiblingIndex(this.node.children.length - 113);
        // }, 5000);
       }
   }
