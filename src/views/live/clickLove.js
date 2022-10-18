const queue = {};
let timer = 0;
export default class ClickLove {
  constructor(canvas, img) {
    if (!canvas) return;
    this.img = img;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  likeClick() {
    let that = this;
    const anmationData = {
      id: new Date().getTime(),
      timer: 0,
      opacity: 0.5,
      pathData: that.generatePathData(),
      image: that.img,
      factor: {
        speed: 0.006, // 运动速度，值越小越慢
        t: 0 //  贝塞尔函数系数
      }
    };
    if (Object.keys(queue).length > 0) {
      queue[anmationData.id] = anmationData;
    } else {
      queue[anmationData.id] = anmationData;
      that.bubbleAnimate();
    }
  }

  /**获取图片路径 */
  generatePathData() {
    let width = this.canvas.width,
      height = this.canvas.height;
    const p0 = {
      x: 0.65 * width,
      y: height
    };
    const p1 = {
      x: this.getRandom(0.22 * width, 0.33 * width),
      y: this.getRandom(0.5 * height, 0.75 * height)
    };
    const p2 = {
      x: this.getRandom(0, 0.88 * width),
      y: this.getRandom(0.25 * height, 0.5 * height)
    };
    const p3 = {
      x: this.getRandom(0, 0.88 * width),
      y: this.getRandom(0, 0.125 * height)
    };
    return [p0, p1, p2, p3];
  }

  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  updatePath(data, factor) {
    const p0 = data[0];
    const p1 = data[1];
    const p2 = data[2];
    const p3 = data[3];
    const t = factor.t;

    /*计算多项式系数 （下同）*/
    const cx1 = 3 * (p1.x - p0.x);
    const bx1 = 3 * (p2.x - p1.x) - cx1;
    const ax1 = p3.x - p0.x - cx1 - bx1;

    const cy1 = 3 * (p1.y - p0.y);
    const by1 = 3 * (p2.y - p1.y) - cy1;
    const ay1 = p3.y - p0.y - cy1 - by1;

    const x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x;
    const y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y;
    return {
      x,
      y
    };
  }

  bubbleAnimate() {
    let width = this.canvas.width,
      height = this.canvas.height;
    let that = this;
    that.ctx.clearRect(0, 0, width, height);
    Object.keys(queue).forEach(key => {
      const anmationData = queue[+key];
      const {
        x,
        y
      } = this.updatePath(
        anmationData.pathData,
        anmationData.factor
      );
      const speed = anmationData.factor.speed;
      anmationData.factor.t += speed;
      var curWidth = 30;
      curWidth = (height - y) / 1.5;
      curWidth = Math.min(30, curWidth);
      var curAlpha = anmationData.opacity;
      curAlpha = y / height;
      curAlpha = Math.min(1, curAlpha);
      that.ctx.globalAlpha = curAlpha;
      that.ctx.drawImage(anmationData.image, x, y, curWidth, curWidth);
      if (anmationData.factor.t > 1) {
        delete queue[anmationData.id];
      }
    });
    if (Object.keys(queue).length > 0) {
      timer = setTimeout(() => {
        this.bubbleAnimate();
      }, 20);
    } else {
      clearTimeout(timer);
      // this.ctx.draw(); // 清空画面
      that.ctx.clearRect(0, 0, width, height);
    }
  }
}
