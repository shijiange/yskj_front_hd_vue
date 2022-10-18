<template>
  <div class="U000025-template1" :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <!--幸运大抽奖静态-->
    <div class="lottery-box" v-if="datas.lottery && datas.lottery.name">
      <div class="title">抽奖活动: {{datas.lottery.name}}</div>
      <div class="priceChanceBtn">
        您有{{remainingTimes}}次抽奖机会
      </div>

      <div class="box">
        <div
          v-for="(imgLi, index) in prizeList"
          :key='index'
          :ref="`price${id}`"
          :style="{ backgroundImage: 'url(' + imgLi.bgSrc + ')' }"
        >
          <img :src="imgLi.thumb_url" v-if="imgLi.thumb_url" />
          <span
            class="title"
            v-if="index !== 5 && index !== 6 && index !== 9 && index !== 10"
          >{{ imgLi.prize }}
        </span>
        </div>
        <section class="turn" :ref="`turn${id}`">
        <span class="text" v-if="startStatus === 1">
          立即抽奖
        </span>
          <span class="text" v-else-if="startStatus === 2">
          活动已结束
        </span>
          <span class="text" v-else>
          活动未开始
        </span>
        </section>
      </div>

      <div class="point" v-if="activityModel.draw_type!=0">
        {{activityModel.draw_type==1 ? '我的'+datas.list.point_word : '我的'+datas.list.love_word}} ：{{ activityModel.draw_type==1 ? (datas.list.point? datas.list.point.credit1: 0) : usable || 0 }}
      </div>
      <div class="reword" @click="toUrl">我的中奖纪录</div>
    </div>
    <van-popup v-model="show"  position="right" closeable close-icon="close" :style="{ height: '100%',width:'100%' }">
      <div class="van-content">
        <div style="height: 2rem; display: flex; justify-content: center; align-items: center;">选择商品</div>
        <van-radio-group v-model="radio" checked-color="#f15353">
          <van-radio :name="item.id"  v-for="(item,index) in goods" :key="index" class="radio">
            <div style="display: flex; align-items: center;">
              <div class="avatar">
                <img :src="item.thumb">
              </div>
              <div style="margin-left: 1rem;">{{item.title}}</div>
            </div>
          </van-radio>
        </van-radio-group>
        <div class="button" @click="confirmGoods">
          确定
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script>
import emptyImage from "../../assets/images/new_diy/image.png";
import lotteryBgImage from '../../assets/images/new_diy/lottery-bg.png';
import { Toast } from 'vant';
import noSelect from "src/assets/images/item_bg.png";
import isSelect from "src/assets/images/select.png";
import prizeBtn1 from "src/assets/images/01.png";
import prizeBtn2 from "src/assets/images/02.png";
import prizeBtn3 from "src/assets/images/03.png";
import prizeBtn4 from "src/assets/images/04.png";

// 自定义样式
const css = function () {
  if(this.datas.preview_color) {
    const {
      preview_color,
      font_size,
      font_color,
      class_font_size,
      class_font_color,
      class_bg_color,
      class_border_radius,
    } = this.datas;

    return `
        .component-${this.id} .lottery-box {
            background-color: ${preview_color.color || '#f8f8f8'};
            background-image: url(${preview_color.isColor == 2? preview_color.image || emptyImage: ''});
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
        }

        .component-${this.id} .point{
            font-size: ${font_size}px;
            color: ${font_color};
        }

        .component-${this.id}  .title {
            font-size: 16px;
            color: ${font_color};
        }

        .component-${this.id} .reword{
            background-color: ${class_bg_color};
            border-radius: ${class_border_radius}px;
            font-size: ${class_font_size}px;
            color: ${class_font_color};
        }
    `;
  }
};

export default {
  props: ['id', 'datas'],
  data() {
    return{
      goods:[{}],
      radio:'',
      show:false,
      prizeIndex: 0,
      arrNum: [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4], // 定义转动的顺序
      clickFlage: true, // 点击事件，防止重复点击
      prizeInfoShow: false, // 显示中奖信息的遮罩层
      noPrizeShow: false, // 没中奖
      havePrizeShow: false, // 中奖了
      haveLottery: false, // 已经抽过奖了
      timer1: "",
      timer2: "",
      s1: "",
      s2: -1,
      hasRecord: false, // 是否显示获奖情况
      remainingTimes: 0, // 剩余抽奖次数
      prizeList: [], // 奖项列表
      prizeLevel: "", // 中奖等级
      prizeName: "", // 奖品名称
      prizeUrl: "", // 奖品图片
      timeFlag: 0, // 时间标记，抽奖请求时间过长，则返回错误
      startStatus: 1, // 活动开始的状态
      success_app_url: "", // 成功跳转链接

      activityModel: {},
      result_arr: [],
      countdown_time: [],
      lotteryId: '',
      usable: '',

      emptyImage,
      lotteryBgImage,
    };
  },
  computed: {
    css() {
      return '<style>' + css.call(this) + '</style>';
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
  },
  activated() {
    this.show = false;
  },
  mounted() {
    this.$nextTick(()=> {
      if(this.datas.lottery && this.datas.lottery.name) {
        this.initData();
      }
      this.usable = window.localStorage.getItem("usable");
    });
  },
  methods: {
    toUrl() {
      this.$router.push(this.fun.getUrl("LotteryRecord",{},{lotteryId: this.lotteryId}));
    },
    initData() {
      this.show=false;
      this.result_arr = this.datas.list.result_arr;
      this.activityModel = this.datas.list.activityModel;
      this.success_app_url = this.datas.list.activityModel.success_app_url;
      this.countdown_time = this.datas.list.activityModel.countdown_time;
      this.lotteryId = this.activityModel.id;
      this.goods = this.datas.list.goods;
      this.remainingTimes = this.datas.list.surplus_time;
      if(this.goods && this.goods.length > 0 && this.goods[0].id) {
        this.radio=this.goods[0].id ;
      }
      this.result_arr.forEach(item => {
        this.$set(item, "bgSrc", noSelect);
      });
      this.result_arr.splice(5, 0, " ");
      this.result_arr.splice(6, 0, " ");
      this.result_arr.splice(9, 0, " ");
      this.result_arr.splice(10, 0, " ");
      this.prizeList = this.result_arr;
      let temp = this.prizeList[4];
      this.prizeList[4] = this.prizeList[7];
      this.prizeList[7] = temp;
      temp = this.prizeList[12];
      this.prizeList[12] = this.prizeList[13];
      this.prizeList[13] = temp;
      temp = this.prizeList[14];
      this.prizeList[14] = this.prizeList[15];
      this.prizeList[15] = temp;

      this.statusFun(
        Date.parse(new Date()) / 1000,
        this.countdown_time[0],
        this.countdown_time[1]
      ); // 获取状态，开始，未开始，结束
      this.prizeZhuan();
    },
    statusFun(c, s, e) {
      this.$nextTick(() => {
        if (c < s) {
          //Toast("当前时间小于开始时间，未开始");
          // 当前时间小于开始时间，未开始
          this.startStatus = 0;
        } else if (c > s && c < e) {
          // 当前时间大于开始时间，并且小于结束时间，已经开始未结束
          this.startStatus = 1;
        } else if (c > e) {
          //Toast("当前时间大于结束时间，已经结束");
          // 当前时间大于结束时间，已经结束
          this.startStatus = 2;
        }
        this.$refs[`price${this.id}`][5].className = "prizeBtn1";
        this.$refs[`price${this.id}`][6].className = "prizeBtn2";
        this.$refs[`price${this.id}`][9].className = "prizeBtn3";
        this.$refs[`price${this.id}`][10].className = "prizeBtn4";
        this.$refs[`price${this.id}`][5].style.backgroundImage = "url(" + prizeBtn1 + ")";
        this.$refs[`price${this.id}`][6].style.backgroundImage = "url(" + prizeBtn2 + ")";
        this.$refs[`price${this.id}`][9].style.backgroundImage = "url(" + prizeBtn3 + ")";
        this.$refs[`price${this.id}`][10].style.backgroundImage = "url(" + prizeBtn4 + ")";
      });
    },
    move() {
      if (this.prizeIndex === 0) {
        this.$refs[`price${this.id}`][this.arrNum[11]].style.backgroundImage =
            "url(" + noSelect + ")";
        this.$refs[`price${this.id}`][this.arrNum[this.prizeIndex]].style.backgroundImage =
            "url(" + isSelect + ")";
        this.prizeIndex++;
      } else if (this.prizeIndex === 12) {
        this.prizeIndex = 0;
        this.$refs[`price${this.id}`][this.arrNum[11]].style.backgroundImage =
            "url(" + noSelect + ")";
        this.$refs[`price${this.id}`][this.arrNum[this.prizeIndex]].style.backgroundImage =
            "url(" + isSelect + ")";
        this.prizeIndex++;
      } else {
        this.$refs[`price${this.id}`][
          this.arrNum[this.prizeIndex - 1]
        ].style.backgroundImage = "url(" + noSelect + ")";
        this.$refs[`price${this.id}`][this.arrNum[this.prizeIndex]].style.backgroundImage =
            "url(" + isSelect + ")";
        this.prizeIndex++;
      }

      if (
        this.s2 !== -1 &&
          this.prizeList[this.arrNum[this.prizeIndex - 1]].item == this.s2
      ) {
        clearInterval(this.timer1);
        clearInterval(this.timer2);
        this.stop();
      }

      this.timeFlag += 100;
      if (this.timeFlag >= 10000 && !this.prizeName) {
        clearInterval(this.timer1);
        clearInterval(this.timer2);
        Toast({
          message: "当前抽奖人数过多，稍后再来",
          position: "middle",
          duration: 1500
        });
        this.clickFlage = true; // 能点击
        setTimeout(() => {
          // 刷新后重新加载
          location.reload();
        }, 1500);
      }
    },
    // 停止
    stop() {
      this.s2 = -1;
      this.clickFlage = false; // 不能点击
      this.prizeInfo(); // 弹出是否中奖
    },
    // 降速
    lowSpeed() {
      clearInterval(this.timer1);
      this.clickFlage = false; // 不能点击
      this.timer2 = setInterval(this.move, 300);
      setTimeout(() => {
        this.s2 = this.prozeLevel;
      }, 900);
    },
    prizeInfo() {
      setTimeout(() => {
        this.clickFlage = true;
        if (this.hasRecord) {
          this.prizeInfoShow = true;
          this.havePrizeShow = true;
        } else {
          this.prizeInfoShow = true;
          this.noPrizeShow = true;
        }

        if(this.noPrizeShow) {
          this.$dialog.alert({message:`${this.empty_prize_prompt || "很遗憾，您没有中奖"}`});
        }
        if(this.havePrizeShow) {
          this.$dialog.alert({message:`恭喜您抽中${this.prizeName}`}).then(()=>{
            window.location.href = this.success_app_url;
          });
        }
        if(this.haveLottery) {
          this.$dialog.alert({message:'您已经抽过奖啦，不要太贪心哦！'});
        }
      }, 800);
    },
    prizeZhuan() {
      this.$nextTick(() => {
        this.$refs[`turn${this.id}`].onclick = () => {
          if (this.remainingTimes > 0) {
            // 判断剩余抽奖次数
            if (this.clickFlage) {
              if (this.startStatus === 1) {
                // 活动开始
                this.clickFlage = false; // 不能点击
                this.timer1 = setInterval(this.move, 100);
                $http
                  .get("plugin.lucky-draw.frontend.draw.doDraw", {
                    lotteryId: this.lotteryId
                  })
                  .then(
                    response => {
                      if (response.result === 1) {

                        this.remainingTimes--;
                        if (response.data.result) {
                          this.hasRecord = true;
                          this.prozeLevel = response.data.result.item;
                          this.prizeName = response.data.result.prize;
                          this.prizeUrl = response.data.result.thumb_url;
                        } else {
                          this.hasRecord = false;
                          this.prozeLevel = response.data.item;
                          this.prizeName = response.data.prize;
                          this.prizeUrl = response.data.thumb_url;
                          this.empty_prize_prompt = response.data.empty_prize_prompt;
                        }

                        // console.log(this.prozeLevel);
                        setTimeout(() => {
                          clearInterval(this.timer1);
                          this.lowSpeed();
                        }, 1200);
                      } else {
                        this.$dialog.alert({ message: response.msg})
                          .then(() => {
                            if (this.goods && this.goods.length > 0) {
                              this.show = true;
                            }
                          }).catch(() => {});
                        this.clickFlage = false; // 不能点击
                        setTimeout(() => {
                          this.clickFlage = true;
                        }, 2000);
                        clearInterval(this.timer1);
                        clearInterval(this.timer2);
                      }
                    },
                    response => {
                      Toast(response);
                    }
                  )
                  .catch(err => {
                    console.error(err);
                  });
              } else if (this.startStatus === 0) {
                // 没开始
                Toast({
                  message: "活动尚未开始",
                  position: "middle",
                  duration: 1500
                });
              } else if (this.startStatus === 2) {
                // 已经结束
                Toast({
                  message: "活动已经结束",
                  position: "middle",
                  duration: 1500
                });
              }
            }
          } else {
            // 没有抽奖机会了
            this.prizeInfoShow = true;
            this.haveLottery = true;
          }
        };
      });
    },
    confirmGoods(){
      this.show=false;
      this.$router.push(this.fun.getUrl("goods", { id: this.radio }));
    },
  },

};
</script>

<style lang="scss" scoped>
  // 默认
  .component-wrapper {
    width: 100%;
  }

  .lottery-box {
    width: 100%;

    /* height: 420px; */
    padding: 20px;
    text-align: center;

    img {
      width: 100%;
    }

    .point {
      margin: 15px;
    }

    .reword {
      width: 40%;
      margin: 0 auto;
      padding: 5px;
    }
  }

  .priceChanceBtn {
    width: 70%;
    margin: 1rem auto 0 auto;
    height: 2.2rem;
    border-radius: 1rem;
    background-color: #ff9600;
    line-height: 2.1rem;
    font-size: 17px;
    color: #fff;
    text-align: center;
  }

  .box {
    margin: 2rem auto 1.4rem;
    width: 21rem;
    height: 21rem;
    padding: 1rem;
    background-color: #fff;
    border: 0.5rem solid transparent;
    border-radius: 0.7rem;
    box-sizing: border-box;
    position: relative;

    /* display: flex; */

    /* flex-wrap: wrap; */

    /* background: linear-gradient(white, white) padding-box,
      repeating-linear-gradient(45deg, rgba(255, 212, 0, 0.67) 0%, #ffd400 4.6%, #f73d3d 0, #f73d3d 10%) 0 / 6.9rem 6.9rem; */
    div {
      background-size: 100%;
      width: 4.1rem;
      height: 4.1rem;
      float: left;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      position: relative;

      &:nth-child(4n) {
        margin-right: 0;
      }

      &:nth-child(8) {
        margin-left: 0.73rem;
      }

      &:nth-child(12) {
        margin-left: 0.15rem;
      }

      box-sizing: border-box;

      img {
        width: 70%;
        height: 70%;
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .title {
      color: #666;
      width: 100%;
      font-size: 12px;
      text-align: center;
      position: absolute;
      bottom: 2%;
      left: 0;
    }

    .prizeBtn1,
    .prizeBtn3 {
      margin: 0.31rem 0 0 0.31rem;
    }

    .prizeBtn2 {
      margin: 0.31rem 0 0 0;
    }

    .prizeBtn3,
    .prizeBtn4 {
      margin-top: -0.31rem;
    }

    .turn {
      width: 8rem;
      height: 8rem;
      font-size: 1.2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .text {
      color: white;
      line-height: 8rem;
    }
  }

  .van-content {
    padding: 1rem;
    position: relative;

    .button {
      position: fixed;
      bottom: 1rem;
      width: 21.5625rem;
      height: 2.875rem;
      background-color: #f15353;
      border-radius: 0.375rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .radio {
      margin-bottom: 1rem;
      display: flex;
      width: 100%;
    }

    .avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
</style>
