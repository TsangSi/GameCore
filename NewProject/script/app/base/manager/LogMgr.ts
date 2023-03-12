/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */

const isLogOn: boolean = true;
export class LogMgr {
    public constructor() {
        // 重定义console的所有方法
        const log = console.log;
        console.log = function (message?: any, ...optionalParams: any[]): void {
            isLogOn && log.apply(console, [message, ...optionalParams]);
        };

        const error = console.error;
        console.error = function (message?: any, ...optionalParams: any[]): void {
            isLogOn && error.apply(console, [message, ...optionalParams]);
        };

        const assert = console.assert;
        console.assert = function (test?: boolean, message?: string, ...optionalParams: any[]): void {
            isLogOn && assert.apply(console, [test, message, ...optionalParams]);
        };

        const table = console.table;
        console.table = function (...data: any[]): void {
            isLogOn && table.apply(console, [...data]);
        };

        const clear = console.clear;
        console.clear = function (): void {
            isLogOn && clear.apply(console);
        };

        const count = console.count;
        console.count = function (countTitle?: string): void {
            isLogOn && count.apply(console, [countTitle]);
        };

        const debug = console.debug;
        console.debug = function (message?: string, ...optionalParams: any[]): void {
            isLogOn && debug.apply(console, [message, ...optionalParams]);
        };

        const dir = console.dir;
        console.dir = function (value?: any, ...optionalParams: any[]): void {
            isLogOn && dir.apply(console, [value, ...optionalParams]);
        };

        const dirxml = console.dirxml;
        console.dirxml = function (value: any): void {
            isLogOn && dirxml.apply(console, [value]);
        };

        const group = console.group;
        console.group = function (groupTitle?: string): void {
            isLogOn && group.apply(console, [groupTitle]);
        };

        const groupCollapsed = console.groupCollapsed;
        console.groupCollapsed = function (groupTitle?: string): void {
            isLogOn && groupCollapsed.apply(console, [groupTitle]);
        };

        const groupEnd = console.groupEnd;
        console.groupEnd = function (): void {
            isLogOn && groupEnd.apply(console);
        };

        const info = console.info;
        console.info = function (message?: any, ...optionalParams: any[]): void {
            isLogOn && info.apply(console, [message, ...optionalParams]);
        };

        const time = console.time;
        console.time = function (timerName?: string): void {
            isLogOn && time.apply(console, [timerName]);
        };

        const timeEnd = console.timeEnd;
        console.timeEnd = function (timerName?: string): void {
            isLogOn && timeEnd.apply(console, [timerName]);
        };

        const trace = console.trace;
        console.trace = function (message?: any, ...optionalParams: any[]): void {
            isLogOn && trace.apply(console, [message, ...optionalParams]);
        };

        const warn = console.warn;
        console.warn = function (message?: any, ...optionalParams: any[]): void {
            isLogOn && warn.apply(console, [message, ...optionalParams]);
        };
    }
}
