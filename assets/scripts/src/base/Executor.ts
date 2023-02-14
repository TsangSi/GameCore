
// import { _decorator, Component, Node } from 'cc';
// const { ccclass, property } = _decorator;

// /**
//  * Predefined variables
//  * Name = Executor
//  * DateTime = Fri Mar 25 2022 16:54:24 GMT+0800 (中国标准时间)
//  * Author = zengsi
//  * FileBasename = Executor.ts
//  * FileBasenameNoExtension = Executor
//  * URL = db://assets/app/src/base/Executor.ts
//  * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
//  *
//  */
 
// @ccclass('Executor')
// export class Executor {
//     private caller_: (...arg)=> void | undefined = undefined;
//     private this_: unknown = undefined;
//     private args_: any[] | undefined = undefined;
//     constructor (caller: (...arg)=> void, target?: unknown, ...params: any[]) {
//         this.caller_ = caller;
//         this.this_ = target;
//         this.args_ = Array.prototype.slice.call(arguments, 2);
//     }

//     /**
//      * 如果传入参数，则以传入参数作为调用
//      * 否则以构造函数传入参数调用
//      * @param {any} thisArg
//      */
//     invoke (thisArg?: unknown) {
//         if (!this.caller_) { return; }
//         let args;
//         if (arguments.length) {
//             thisArg = thisArg || window;
//             args = Array.prototype.slice.call(arguments, 1);
//         } else {
//             thisArg = this.this_ || window;
//             args = this.args_;
//         }

//         return this.caller_.apply(thisArg, args);
//     }

//     /**
//      * 调用回调，并且传入参数
//      */
//     invokeWithArgs (...params: any[]) {
//         const f = this.caller_;
//         if (!f || typeof f !== 'function') { return; }

//         const this_ = this.this_ || window;
//         return f.apply(this_, params);
//     }

//     /** 是否相同的callback和target */
//     equals (callback: (...arg)=> void, target?: unknown) {
//         return this.caller_ === callback && this.this_ === target;
//     }

//     callback () {
//         return this.caller_;
//     }

//     target () {
//         return this.this_;
//     }

//     getArgs() {
//         return this.args_;
//     }

//     /** 清除属性 */
//     clear () {
//         this.caller_ = undefined;
//         this.this_ = undefined;
//         this.args_ = undefined;
//     }
// }

// /**
//  * [1] Class member could be defined like this.
//  * [2] Use `property` decorator if your want the member to be serializable.
//  * [3] Your initialization goes here.
//  * [4] Your update function goes here.
//  *
//  * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
//  * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
//  * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
//  */
