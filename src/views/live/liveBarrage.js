var track = true;
// var img;
// 创建Barrage类，用来实例化每一个弹幕元素
class Barrage {
  constructor(obj, ctx) {
    this.value = obj.nickname;
    this.giftName = obj.reward_name;
    this.time = obj.time;
    this.obj = obj;
    this.context = ctx;
    this.imgSrc= obj.img;
    // img = new Image();
    // img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
  }
  init() {
    this.color = this.obj.color || this.context.color;
    this.speed = this.obj.speed || this.context.speed;
    this.opacity = this.obj.opacity || this.context.opacity;
    this.fontSize = this.obj.fontSize || this.context.fontSize;

    // 为了计算每个弹幕的宽度，我们必须创建一个元素，然后计算文字的宽度
    let p = document.createElement('p');
    p.style.font = this.fontSize + 'px';
    p.innerHTML = this.value;
    document.body.appendChild(p);
    // 设置弹幕的宽度
    this.width = p.clientWidth;
    document.body.removeChild(p);
    // let that =this;
    // img = new Image();
    // img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
    // img.onload = function(){
    //   that.context.ctx.drawImage(img,0,0);
    // };

    this.x = this.context.canvas.width;
    // this.context.canvas.height * Math.random()
    this.y = track?this.context.canvas.height:40;
    // 考虑到弹幕会超出顶部和底部的距离，所以需要处理一下超出范围
    // canvas是按照字号基线来展示字体的
    // 如果小于这个字号大小
    if (this.y < this.fontSize) {
      this.y = this.fontSize;
    } else if (this.y > this.context.canvas.height - this.fontSize) {
      this.y = this.context.canvas.height - this.fontSize;
    }
    track =!track;
  }
  render() {
    drawRoundRect(this.context.ctx, this.x, this.y-20, this.context.ctx.measureText(this.value).width>this.context.ctx.measureText(this.giftName).width?this.context.ctx.measureText(this.value).width+40:this.context.ctx.measureText(this.giftName).width+40 , 32, 15,'rgba(0,0,0,0.4)');
    this.context.ctx.font = `${this.fontSize}px Ariayl`;
    this.context.ctx.fillStyle = this.color;
    this.context.ctx.fillText(this.value, this.x+32, this.y-7);//用户名
    this.context.ctx.fillText(this.giftName, this.x+32, this.y+7);//礼物名称
    draw(this.context.ctx,this.imgSrc,this.x, this.y);//用户头像
  }
}

function drawRoundRect (context, x, y, width, height, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
  context.lineTo(width - radius + x, y);
  context.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
  context.lineTo(width + x, height + y - radius);
  context.arc(width - radius + x, height - radius + y, radius, 0, Math.PI / 2);
  context.lineTo(radius + x, height + y);
  context.arc(radius + x, height - radius + y, radius, Math.PI / 2, Math.PI);
  context.fill();
  context.closePath();
}

function draw(context,img,x,y) {
  // img = new Image();
  // img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
  // img.onload = function(){
  // context.beginPath();
  if(!img){
    return;
  }
  context.save(); // 保存当前ctx的状态
  context.arc(x+15, y, 5, 0, 2 * Math.PI);
  context.clip();
  context.drawImage(img,x,y-18,30,30);
  context.restore(); // 还原状态
  // };

}

// 创建CanvasBarrage类，主要用做canvas来渲染整个弹幕
export default class CanvasBarrage {
  constructor(canvas, opts = {}) {
    // 如果canvas和video都没传，那就直接return掉
    if (!canvas) return;
    // 直接挂到this上
    this.canvas = canvas;
    // 获取画布
    this.ctx = canvas.getContext('2d');

    // 设置默认参数
    let defOpts = {
      color: '#ffffff',
      speed: 2,
      opacity: 0.5,
      fontSize: 14,
      data: []
    };
      // 合并对象并全都挂到this实例上
    Object.assign(this, defOpts, opts);

    // 得到所有的弹幕消息
    // this.barrages = this.data.map(item => new Barrage(item, this));
    this.barrages = [];
    let that = this;
    this.data.map((item,i) => setTimeout(function() {
      that.barrages.push(new Barrage(item, that));
    }, 1000*i));

    // 渲染
    this.render();
    // console.log(this);
  }
  render() {
    // 每次渲染先清空画布，防止后面绘制和前面的重叠
    this.clear();
    // 渲染弹幕
    this.renderBarrage();
    // 通过raf渲染动画，递归进行渲染
    requestAnimationFrame(this.render.bind(this));
  }
  renderBarrage() {
    this.barrages.forEach(barrage => {
      if (!barrage.flag ) {
        if (!barrage.isInit) {
          barrage.init();
          barrage.isInit = true;
        }
        barrage.x -= barrage.speed;
        barrage.render();
        if (barrage.x < -barrage.width) {
          barrage.flag = true;
        }
      }
    });
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  add(obj) {
    // this.barrages.push(new Barrage(obj, this));
    let that = this;
    obj.map((item,i) => setTimeout(function() {
      let addImg = new Image();
      addImg.src = item.img;
      item.img = addImg;
      that.barrages.push(new Barrage(item, that));
    }, 1000*i));
  }
}
