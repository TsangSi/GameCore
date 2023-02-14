import { js } from 'cc';

export class UtilsCommon {
    private static DefaultUniqueid = 0;

    static generateUniqueId() {
        return this.DefaultUniqueid++;
    }
}
