import { Dialog } from 'vant';
// 长按录音
export default class Longtap {
  constructor(element, duration) {
    this.element = element;
    this.duration = 800; //长按触发的时长,默认600毫秒
    this.timer = null;
    this.startEvent = "touchstart";
    this.moveEvent = "touchmove";
    this.endEvent = "touchend";
    this.eventJudge();
    this.startTime = null;
    this.endTime = null;
  }

  longTap(callback1, callback2) {
    // console.log(this.element, this.startEvent, this.moveEvent, this.endEvent);
    this.element.addEventListener(
      this.startEvent,
      () => this.touchStart(callback1),
      false
    );
    this.element.addEventListener(
      this.moveEvent,
      () => this.touchMove(),
      false
    );
    this.element.addEventListener(
      this.endEvent,
      () => this.touchEnd(callback2),
      false
    );
  }
  touchStart(callback) {
    this.startTime = new Date();
    let cb = (...args) => typeof callback === "function" && callback(...args);
    this.timer = setTimeout(() => cb(), this.duration);
  }

  touchMove() {
    console.log("触摸移动");
    // this.timer && clearTimeout(this.timer);
  }

  touchEnd(callback) {
    this.endTime = new Date();
    console.log(this.endTime.getTime() - this.startTime.getTime());
    if (this.endTime.getTime() - this.startTime.getTime() <= 800) {
      //此处为点击事件
      // Toast.fail({
      //   message: "请长按按钮，当提示开始录音时说出口令",
      //   duration: "2000"
      // });
      Dialog.alert({
        title: "操作提示",
        message: "请长按按钮，当提示开始录音时说出口令"
      }).then(() => {
        // on close
      });
      // that.$dialog.alert({message:"请长按按钮，当提示开始录音时说出口令"});
      // alert("请长按按钮，当提示开始录音时说出口令"); //vant组件真机测试发现出现闪烁
    }
    this.timer && clearTimeout(this.timer);
    this.timer = null;
    let st = (...args) => typeof callback === "function" && callback(...args);
    st();
    console.log("触摸结束");
    return false;
  }

  //判断是移动端还是PC端
  eventJudge() {
    let click = ["mousedown", "mouseout", "mouseup"];
    let touch = ["touchstart", "touchmove", "touchend"];
    let touchSupport = "ontouchstart" in window;
    [this.startEvent, this.moveEvent, this.endEvent] = touchSupport
      ? touch
      : click;
  }
}
