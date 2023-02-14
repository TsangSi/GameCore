export default class UtilsStorage {
    static RandomWord(max: number) { // 随机产生uuid
        let str = '';
        // eslint-disable-next-line max-len
        const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        for (let i = 0; i < max; i++) {
            const pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    }

    /** 获取和存储 uuid */
    static GetUUid() {
        const YxlWxImeiKey = '_report_uuid_';
        const uuid = localStorage.getItem(YxlWxImeiKey);

        if (!uuid) {
            const info_ = this.RandomWord(32);
            localStorage.setItem(YxlWxImeiKey, info_);
        }

        return uuid;
    }

    static setItem(key: string, data: any) {
        localStorage.setItem(key, data);
    }

    static getItem(key: string) {
        return localStorage.getItem(key);
    }
}
