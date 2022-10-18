import { Toast } from "vant";
import noSelect from "src/assets/images/item_bg.png";
import isSelect from "src/assets/images/select.png";
import prizeBtn1 from "src/assets/images/01.png";
import prizeBtn2 from "src/assets/images/02.png";
import prizeBtn3 from "src/assets/images/03.png";
import prizeBtn4 from "src/assets/images/04.png";

export default {
  data() {
    return {
      goods: [],
      radio: "",
      show: false,
      success_app_url: "",
      swiperName: {
        // 获奖名单
        loop: true, // 当获奖人数大于等于5的时候滚动，否则不滚动
        direction: "vertical",
        slidesPerView: 5,
        freeMode: true,
        freeModeMomentum: true,
        freeModeMomentumVelocityRatio: 1,
        autoplay: 1000
      },
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
      lotteryId: "", // 抽奖活动的id
      activityModel: {}, // 活动说明
      hasRecord: false, // 是否显示获奖情况
      remainingTimes: 0, // 剩余抽奖次数
      prizeList: [], // 奖项列表
      prizeLevel: "", // 中奖等级
      prizeName: "", // 奖品名称
      prizeUrl: "", // 奖品图片
      prizers: [], // 获奖名单
      timeFlag: 0, // 时间标记，抽奖请求时间过长，则返回错误
      startStatus: 1, // 活动开始的状态

      credit1: 0,
      empty_prize_prompt: "", //未中奖提示
      amount_word: "",
      love_word: "",
      love: 0,
      point_word: "",
      shop_logo: "",
      toolbar: false,
      prizerListTime:null
    };
  },
  created() {
    this.lotteryId = this.fun.getKey("lotteryId");

  },
  activated() {
    this.show = false;
    this.lotteryId = this.fun.getKey("lotteryId");
    this.getData();
  },
  methods: {
    confirmGoods() {
      this.show = false;
      this.$router.push(this.fun.getUrl("goods", { id: this.radio }));
    },
    showToolbar() {
      this.toolbar = !this.toolbar;
    },
    getData() {
      let that = this;
      $http
        .get(
          "plugin.lucky-draw.frontend.draw.index",
          { lotteryId: this.lotteryId },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              this.shop_logo = response.data.shop_logo;
              this.amount_word = response.data.amount_word;
              this.love_word = response.data.love_word;
              if (response.data.love) {
                this.love = response.data.love[0];
              }
              this.point_word = response.data.point_word;
              this.credit1 = response.data.point.credit1;
              this.activityModel = response.data.activityModel;
              this.success_app_url = response.data.activityModel.success_app_url;
              this.goods = response.data.goods;
              if (this.goods && this.goods.length > 0) {
                this.radio = this.goods[0].id;
              }
              this.remainingTimes = response.data.surplus_time;
              response.data.result_arr.forEach(item => {
                this.$set(item, "bgSrc", noSelect);
              });
              response.data.result_arr.splice(5, 0, " ");
              response.data.result_arr.splice(6, 0, " ");
              response.data.result_arr.splice(9, 0, " ");
              response.data.result_arr.splice(10, 0, " ");
              this.prizeList = response.data.result_arr;
              this.prizers = response.data.list;
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
                this.activityModel.countdown_time[0],
                this.activityModel.countdown_time[1]
              ); // 获取状态，开始，未开始，结束
              if (this.prizers && this.prizers.length > 5) {
                this.prizerListScroll();
              }
              this.prizeZhuan();
              // this.initShare();
              this.fun.wxShare(
                "",
                {},
                {
                  title: that.activityModel.name,
                  imgUrl: that.activityModel.background,
                  description: that.activityModel.describe_content
                },
                ()=> {},
                ()=> {
                  $http
                    .get("plugin.lucky-draw.frontend.draw.getShare", {
                      lotteryId: this.lotteryId
                    })
                    .then(response => {
                      this.getData();
                    })
                    .catch(err => {
                      console.error(err);
                    });
                },
              );
            } else {
              if (response.msg != "请登录") {
                Toast(response.msg);
                this.$router.go(-1);
              }
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
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
        this.$refs.pice[5].className = "prizeBtn1";
        this.$refs.pice[6].className = "prizeBtn2";
        this.$refs.pice[9].className = "prizeBtn3";
        this.$refs.pice[10].className = "prizeBtn4";
        this.$refs.pice[5].style.backgroundImage = "url(" + prizeBtn1 + ")";
        this.$refs.pice[6].style.backgroundImage = "url(" + prizeBtn2 + ")";
        this.$refs.pice[9].style.backgroundImage = "url(" + prizeBtn3 + ")";
        this.$refs.pice[10].style.backgroundImage = "url(" + prizeBtn4 + ")";
      });
    },
    move() {
      if (this.prizeIndex === 0) {
        this.$refs.pice[this.arrNum[11]].style.backgroundImage =
          "url(" + noSelect + ")";
        this.$refs.pice[this.arrNum[this.prizeIndex]].style.backgroundImage =
          "url(" + isSelect + ")";
        this.prizeIndex++;
      } else if (this.prizeIndex === 12) {
        this.prizeIndex = 0;
        this.$refs.pice[this.arrNum[11]].style.backgroundImage =
          "url(" + noSelect + ")";
        this.$refs.pice[this.arrNum[this.prizeIndex]].style.backgroundImage =
          "url(" + isSelect + ")";
        this.prizeIndex++;
      } else {
        this.$refs.pice[
          this.arrNum[this.prizeIndex - 1]
        ].style.backgroundImage = "url(" + noSelect + ")";
        this.$refs.pice[this.arrNum[this.prizeIndex]].style.backgroundImage =
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
    // 获奖名单滚动
    prizerListScroll() {
      this.$nextTick(() => {
        var prizerList2 = document.getElementById("prizerList2");
        var prizerList1 = document.getElementById("prizerList1");
        var prizerList = document.getElementById("prizerList");
        prizerList2.innerHTML = prizerList1.innerHTML;
        if(this.prizerListTime){
          clearInterval(this.prizerListTime);
        }
        this.prizerListTime = setInterval(() => {
          // if (this.prizerList.scrollTop >= (this.prizerList1.offsetHeight - this.prizerList.offsetHeight)) {
          if (prizerList.scrollTop >= prizerList1.offsetHeight) {
            prizerList.scrollTop = 0;
          } else {
            prizerList.scrollTop++;
          }
        }, 30);
      });
    },
    prizeZhuan() {
      this.$nextTick(() => {
        this.$refs.turn.onclick = () => {
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
                        Toast(response.msg);
                        if (this.goods && this.goods.length > 0) {
                          this.show = true;
                        }

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
    touchMove(e) {
      e.preventDefault(); // 禁止滚动
      e.stopPropagation();
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
      }, 800);
    },
    close(name) {
      // 关闭没中奖
      this.prizeInfoShow = false;
      this.noPrizeShow = false;
      this.haveLottery = false;
      this.havePrizeShow = false;
      if (name == "success" && this.success_app_url) {
        window.location.href = this.success_app_url;
      }
    },
    goIndex() {
      if (this.activityModel.jump_link) {
        window.location.href = this.activityModel.jump_link;
      } else {
        this.$router.push(this.fun.getUrl("home"));
      }
      this.prizeInfoShow = false; // 显示中奖信息的遮罩层
      this.noPrizeShow = false; // 没中奖
    },
    lotteryRecord() {
      this.$router.push(
        this.fun.getUrl("LotteryRecord", {}, { lotteryId: this.lotteryId })
      );
    },
    //分享
    initShare() {
      if (this.fun.getTyep() == 5) {
        return;
      }
      $http
        .post("member.member.wxJsSdkConfig", {
          url:
            this.fun.isIosOrAndroid() === "android"
              ? window.location.href
              : window.initUrl
        })
        .then(response => {
          if (response.result === 1) {
            this.share(response.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.activityModel.name)
          ? data.share.title
          : that.activityModel.name;

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.activityModel.background)
          ? data.share.icon
          : that.activityModel.background;
        let _desc = that.fun.isTextEmpty(that.activityModel.describe_content)
          ? data.share.desc
          : that.activityModel.describe_content;

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            $http
              .get("plugin.lucky-draw.frontend.draw.getShare", {
                lotteryId: that.lotteryId
              })
              .then(response => {
                that.getData();
              })
              .catch(err => {
                console.error(err);
              });
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            $http
              .get("plugin.lucky-draw.frontend.draw.getShare", {
                lotteryId: that.lotteryId
              })
              .then(response => {
                that.getData();
                console.log(response);
              })
              .catch(err => {
                console.error(err);
              });
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    }
  }
};
