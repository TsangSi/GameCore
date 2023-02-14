
// import { _decorator, Component, Node } from 'cc';
// import { Executor } from './Executor';
// const { ccclass, property } = _decorator;

// /**
//  * Predefined variables
//  * Name = ExecutorList
//  * DateTime = Fri Mar 25 2022 16:54:16 GMT+0800 (中国标准时间)
//  * Author = zengsi
//  * FileBasename = ExecutorList.ts
//  * FileBasenameNoExtension = ExecutorList
//  * URL = db://assets/app/src/base/ExecutorList.ts
//  * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
//  *
//  */
 
// @ccclass('ExecutorList')
// export class ExecutorList {
//     private executors_: Executor[] = [];

//     private invoked_ = undefined;

//     private invoking_ = false;
//     private invoking_with_args_ = false;

//     /** @type {Array.<number>} */
//     private waiting_for_remove_: any[] = [];

//     private waiting_for_clear_ = false;

//     get length () {
//         return this.executors_.length;
//     }

//     clear () {
//         if (this.invoking_ || this.invoking_with_args_) {
//             this.waiting_for_clear_ = true;
//         } else {
//             this._clear();
//         }
//     }

//     _clear () {
//         if (this.waiting_for_clear_) {
//             this.waiting_for_remove_.length = 0;
//             this.executors_.length = 0;
//             this.waiting_for_clear_ = false;

//             return true;
//         }

//         return false;
//     }

//     _push (callback: (...arg)=> void, target?: unknown) {
//         const executor = new Executor(callback, target);
//         this.executors_.push(executor);
//     }

//     /**
//      * 新增一个callback
//      *
//      * 新增唯一的请使用pushUnique
//      */
//     push (callback: (...arg)=> void, target?: unknown) {
//         if (!callback || typeof callback !== 'function') {
//             return;
//         }
//         this._push(callback, target);
//     }

//     /**
//      * 新增一个唯一的callback
//      *
//      * 有可能重复的请使用push
//      */
//     pushUnique (callback: (...arg)=> void, target?: unknown) {
//         if (!callback || typeof callback !== 'function') {
//             return false;
//         }

//         if (this.indexOf(callback, target) >= 0) {
//             return false;
//         }
//         this._push(callback, target);
//         return true;
//     }

//     /** 查询，返回索引，没有返回-1 */
//     indexOf (callback: (...arg)=> void, target?: unknown) {
//         if (!callback) {
//             return -1;
//         }

//         const executors = this.executors_;
//         for (let i = 0, n = executors.length; i < n; ++i) {
//             const executor = executors[i];
//             if (executor.equals(callback, target)) {
//                 return i;
//             }
//         }
//         return -1;
//     }

//     invoke () {
//         const results: unknown[] = [];
//         if (this.invoking_) {
//             return results;
//         }

//         const executors = this.executors_;
//         this.invoking_ = true;
//         const removes = this.waiting_for_remove_;
//         for (let i = 0, n = executors.length; i < n; ++i) {
//             const executor = executors[i];

//             try {
//                 results.push(executor.invoke.call(executor, arguments));
//             } catch (e) {
//                 console.error(e.stack);
//             }

//             // let r = this._onInvoked(arguments);
//             // if (r & ExecutorList.InvokedResult.Remove) { utils.insertToOrderdUniqueArray(removes, i); }
//         }
//         this.invoking_ = false;

//         if (!this._clear()) { this.removes(removes); }

//         return results;
//     }
//     // /**
//     //  * 每次调用后的回调函数
//     //  * 用于中断循环
//     //  * @param {Function} callback -该回调返回true表示继续，否则中断调用循环
//     //  * @param {any} target
//     //  */
//     // onInvoked (callback, target) {
//     //     this.invoked_ = utils.functor.nnew(fn.Executor.prototype.constructor, arguments);
//     // }

//     invokeWithArgs (...params: any[]) {
//         if (this.invoking_with_args_) {
//             return;
//         }

//         const executors = this.executors_;
//         // let results = [];
//         this.invoking_with_args_ = true;
//         const removes = this.waiting_for_remove_;
//         for (let i = 0, n = executors.length; i < n; ++i) {
//             const executor = executors[i];
//             try {
//                 // results.push(utils.functor.fcall(executor, executor.invokeWithArgs, arguments));
//                 // results.push(executor.invokeWithArgs, )
//                 executor.invokeWithArgs.apply(executor, params);
//             } catch (e) {
//                 console.error(e.stack);
//             }

//             // let r = this._onInvoked(arguments);
//             // if (r & ExecutorList.InvokedResult.Remove) { utils.insertToOrderdUniqueArray(removes, i); }
//         }
//         this.invoking_with_args_ = false;

//         if (!this._clear()) { this.removes(removes); }

//         // return results;
//     }

//     remove (callback: (...arg)=> void, target: unknown) {
//         if (!callback || typeof callback !== 'function') {
//             return;
//         }

//         const idx = this.indexOf(callback, target);
//         if (idx < 0) { return; }
//         if (this.invoking_with_args_ || this.invoking_) {
//             // Utils.insertToAscUniqueArray(this.waiting_for_remove_, idx);
//             this.waiting_for_remove_.push(idx);
//         } else {
//             this.executors_.splice(idx, 1);
//         }
//     }

//     removeAllOf (callback: (...arg)=> void, target: unknown) {
//         if (!callback || typeof callback !== 'function') { return; }

//         const executors = this.executors_;
//         const removes = this.invoking_with_args_ || this.invoking_ ? this.waiting_for_remove_ : [];
//         for (let i = 0, n = executors.length; i < n; ++i) {
//             const executor = executors[i];
//             if (executor.equals(callback, target)) {
//                 // Utils.insertToAscUniqueArray(removes, i);
//                 const pos = this.waiting_for_remove_.indexOf(i);
//                 this.waiting_for_remove_.splice(pos, 1);
//             }
//         }

//         if (!(this.invoking_with_args_ || this.invoking_)) {
//             this.removes(removes);
//         }
//     }

//     /**
//      *
//      */
//     private removes (removes: number[]) {
//         const executors = this.executors_;
//         for (let i = removes.length - 1; i >= 0; --i) {
//             const idx = removes[i];
//             executors.splice(idx, 1);
//         }
//         removes.length = 0;
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
