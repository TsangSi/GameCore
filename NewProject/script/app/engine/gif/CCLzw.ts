/*
 * @Author: hrd
 * @Date: 2022-10-20 16:40:12
 * @Description:
 *
 */
// /*
//  * @Author: zs
//  * @Date: 2022-06-24 14:09:38
//  * @FilePath: \h3_engine\src\engine\gif\CCLzw.ts
//  * @Description:
//  *
//  */
// // /**
// // * CCLzw编码解析
// // */

// export class CCLzw {
//     public static decode(arr: number[], min: number): number[] {
//         const clearCode = 1 << min;
//         const eofCode = clearCode + 1;
//         let size = min + 1;
//         const dict: number[][] = [];
//         let pos = 0;

//         function clear() {
//             dict.length = 0;
//             size = min + 1;
//             for (let i = 0; i < clearCode; i++) {
//                 dict[i] = [i];
//             }
//             dict[clearCode] = [];
//             dict[eofCode] = null;
//         }

//         function decode() {
//             const out: number[] = [];
//             let code: number;
//             let last: number;
//             const x = 1;
//             do {
//                 last = code;
//                 code = read(size);
//                 if (code === clearCode) {
//                     clear();
//                     continue;
//                 }
//                 if (code === eofCode) {
//                     break;
//                 }
//                 if (code < dict.length) {
//                     if (last !== clearCode) {
//                         dict.push(dict[last].concat(dict[code][0]));
//                     }
//                 } else {
//                     if (code !== dict.length) {
//                         throw new Error('CCLzw解析出错');
//                     }
//                     dict.push(dict[last].concat(dict[last][0]));
//                 }
//                 out.push.apply(out, dict[code]);
//                 if (dict.length === (1 << size) && size < 12) {
//                     size++;
//                 }
//             } while (x);
//             return out;
//         }

//         function read(size) {
//             let i; let code = 0;
//             for (i = 0; i < size; i++) {
//                 if (arr[pos >> 3] & 1 << (pos & 7)) {
//                     code |= 1 << i;
//                 }
//                 pos++;
//             }
//             return code;
//         }
//         return decode();
//     }
// }
