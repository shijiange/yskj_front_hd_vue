<template>
  <div id="prizePool">
    <c-title :hide="false" :text="'奖金池'"> </c-title>
    <div class="bgbox">
      <div class="topbox">
        <div class="image">
          <div class="txt">平台周期利润</div>
          <div class="num">{{ info.profit }}</div>
        </div>
        <div class="centenBox">
          <div class="left">
            <div class="price">{{ info.total }}</div>
            <div class="text">平台周期营业额</div>
          </div>
          <div class="right">
            <div class="price">{{ info.person_num }}</div>
            <div class="text">平台会员人数</div>
          </div>
        </div>
        <div class="listBox">
          <div class="listTop">经销商等级周期分红</div>
          <div class="listConten">
            <div class="viewlist">权重</div>
            <div class="viewlistLive">
              <div style="width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">等级</div>
            </div>
            <div class="viewlist">分红比例</div>
            <div class="viewlist">分红金额</div>
          </div>
          <div class="listConten" v-for="(item, ind) in info.levels" :key="ind">
            <div class="viewlist">{{item.level_weight}}</div>
            <div class="viewlistLive">
              <div style="width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{item.level_name}}</div>
            </div>
            <div class="viewlist">{{item.rate}}%</div>
            <div class="viewlist">{{item.total}}</div>
          </div>
        </div>
      </div>
      <canvas id="canvas_bg" :class="[this.fun.getPhoneEnv() == 3 ?'canvas_bgnoPc':'canvas_bgPc']" ></canvas>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      info: [],
      // 画布
      canvas: {},
      ctx: "",
      arr: [],
      dist: "",
      lineArr: []
    };
  },
  mounted() {},
  activated() {
    window.scrollTo(0, 0);
    this.getData();
  },
  methods: {
    getData() {
      $http.get("plugin.prize-pool.frontend.controllers.center", {}, "").then(
        response => {
          if (response.result === 1) {
            this.info = response.data;
            this.constructor(60);
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    constructor(num) {
      this.canvas = document.getElementById("canvas_bg");
      this.canvas.width = this.fun.getPhoneEnv() == 3 ? "375" : document.documentElement.clientWidth;
      this.canvas.height = document.documentElement.clientHeight || document.body.clientHeight;
      this.ctx = this.canvas.getContext("2d");

      // 创建随机状态小球
      this.arr = Array.from(new Array(num)).map(item => ({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        speed: Math.random() * 1.5 + 0.5,
        xDir: Math.random() > 0.5 ? -1 : 1,
        yDir: Math.random() > 0.5 ? -1 : 1,
        r: 2
      }));
      // 小球连线距离
      this.dist = 60;

      this.animation();

      window.onresize = () => {
        this.canvas.width = this.fun.getPhoneEnv() == 3 ? "375" : document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight || document.body.clientHeight;
      };
    },
    // 计算小球位置并判断方向与绘制
    drawCircle() {
      this.arr.forEach(item => {
        item.x += item.xDir * item.speed;
        item.y += item.yDir * item.speed;

        item.x <= 0 && (item.xDir = 1);
        item.x > this.canvas.width - 1 && ((item.xDir = -1), (item.x = this.canvas.width - 1));

        item.y <= 0 && (item.yDir = 1);
        item.y > this.canvas.height - 1 && ((item.yDir = -1), (item.y = this.canvas.height - 1));

        this.ctx.beginPath();
        this.ctx.arc(item.x, item.y, item.r, 0, 2 * Math.PI);
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        this.ctx.fill();
      });
    },

    // 计算连线距离内的小球，并插入坐标至lineArr
    calcLine() {
      var arr = this.arr.concat();
      this.lineArr = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        for (let y = i + 1; y < len; y++) {
          let val = Math.sqrt(Math.pow(arr[i].x - arr[y].x, 2) + Math.pow(arr[i].y - arr[y].y, 2), 2);
          if (val < this.dist) {
            this.lineArr.push({
              start: arr[i],
              end: arr[y],
              val: val,
              ratio: val / this.dist
            });
          }
        }
      }
    },

    // 绘制小球
    drawLine() {
      while (this.lineArr.length) {
        this.ctx.beginPath();
        let item = this.lineArr.shift();
        // let c = 255 * item.ratio;

        this.ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
        // this.ctx.strokeStyle = `rgb(${c},${c},${c})`;
        this.ctx.moveTo(item.start.x, item.start.y);
        this.ctx.lineTo(item.end.x, item.end.y);
        this.ctx.stroke();
      }
    },

    // 动画过渡
    animation() {
      // this.canvas.width = this.canvas.width;
      this.drawCircle();
      this.calcLine();
      this.drawLine();
      setTimeout(() => {
        this.animation();
      }, 30);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#prizePool {
  position: relative;
}

.canvas_bgPc {
  position: fixed;
  top: 0;
  left: 0;
}

.canvas_bgnoPc {
  position: fixed;
  top: 0;
  left: 35%;
}

.pcStyle {
  width: 375px;
  margin: 0 auto;
  left: 50%;
  margin-left: -187.5px;
}

.bgbox {
  min-height: 100vh;
  background-color: rgba(215, 64, 47, 1);
}

.topbox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 3rem;

  .listBox {
    width: 22rem;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 0.47rem;
    margin: 0 auto;
    margin-top: 0.88rem;

    .listConten {
      display: flex;
      margin: 0 1rem;
      justify-content: space-around;

      .viewlistLive {
        width: 100%;
        flex: 1.4;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .viewlist {
        width: 100%;
        flex: 1;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: hidden;
      }
    }

    .listTop {
      margin: 0 0.91rem;
      height: 2.66rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #fff;
      font-size: 0.94rem;
      color: #fff;
    }
  }

  .centenBox {
    display: flex;
    width: 100%;
    justify-content: space-around;
    margin-top: 1.38rem;

    .left,
    .right {
      width: 10.31rem;
      height: 5.63rem;
      background-color: #fff;
      border-radius: 0.47rem;
      padding: 1.06rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      overflow: hidden;
    }

    .left .price,
    .right .price {
      font-size: 1.25rem;
      color: #d7402f;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }

    .left .text,
    .right .text {
      font-size: 0.81rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
  }

  .image {
    width: 9.28rem;
    height: 11.34rem;
    background-image: url("http://www.yunzmall.com/min_img/water_droplets.png");
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #fff;
    margin-top: 15px;

    .txt {
      font-size: 0.75rem;
      margin-top: 1.59rem;
    }

    .num {
      font-size: 1.25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
      text-align: center;
    }
  }
}
</style>