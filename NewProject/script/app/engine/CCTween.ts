/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable func-names */
// 扩展 Tween 动画类
// 扩展了 tween 的暂停、恢复、倍速播放、总时长、已进行时长、跳转到指定时间、根据标签暂停、恢复
// 原文地址 https://blog.csdn.net/u010799737/article/details/121089742

cc.ActionInterval.prototype.step = function (dt) {
    if (this.paused) {
        return;
    }

    if (this._firstTick && !this._goto) {
        this._firstTick = false;
        this._elapsed = 0;
    } else {
        this._elapsed += dt;
    }

    let t = this._elapsed / (this._duration > 0.0000001192092896 ? this._duration : 0.0000001192092896);
    t = t < 1 ? t : 1;
    this.update(t > 0 ? t : 0);

    // Compatible with repeat class, Discard after can be deleted (this._repeatMethod)
    if (this._repeatMethod && this._timesForRepeat > 1 && this.isDone()) {
        if (!this._repeatForever) {
            this._timesForRepeat--;
        }
        this.startWithTarget(this.target);
        this.step(this._elapsed - this._duration);
    }
};

/**
 * 暂停
 * @example tween.pause();
 */
cc.Tween.prototype.pause = function () {
    this._finalAction.paused = true;
};

/**
 * 恢复
 * @example tween.resume();
 */
cc.Tween.prototype.resume = function () {
    this._finalAction.paused = false;
};

/**
 * 倍速播放
 * @param speed 倍速
 * @example tween.speed(2);
 */
cc.Tween.prototype.speed = function (speed) {
    this._finalAction._speedMethod = true;
    this._finalAction._speed = speed;
};

/**
 * 获取持续时间
 * @example let duration = tween.duration();
 */
cc.Tween.prototype.duration = function () {
    return this._finalAction._duration;
};

/**
 * 获取已经进行的时间
 * @example let elapsed = tween.elapsed();
 */
cc.Tween.prototype.elapsed = function () {
    return this._finalAction._elapsed;
};

/**
 * 跳转到指定时间
 * @param time 时间(秒)
 * @example tween.goto(2);
 */
cc.Tween.prototype.goto = function (time) {
    this._finalAction._goto = true;
    this._finalAction._elapsed = time;
};
