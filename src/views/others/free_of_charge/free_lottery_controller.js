import roundTurntable from "./roundTurntable";
import { Toast } from "vant";
export default {
  data() {
    return {
      show: false,
      oneShow: false,
      gooodsShow: false,
      // 获取中奖商品信息
      dividendList: [],
      // 获取任务信息
      taskList: [],
      // 判断是否中奖 true中奖 false没中奖
      status: "",
      // 转盘上的奖品数据
      prizeData: [
        {
          id: 1,
          prizeName: "谢谢参与"
        },
        {
          id: 2,
          prizeName: "免单"
        },
        {
          id: 3,
          prizeName: "谢谢参与"
        },
        {
          id: 4,
          prizeName: "免单"
        },
        {
          id: 5,
          prizeName: "谢谢参与"
        },
        {
          id: 6,
          prizeName: "免单"
        },
        {
          id: 7,
          prizeName: "谢谢参与"
        },
        {
          id: 8,
          prizeName: "免单"
        }
      ],
      // 转动的圈数
      rotateCircle: 10,
      // 转动需要持续的时间（s）
      duringTime: 4.5,
      // 转盘样式的选项
      turntableStyleOption: {
        // 背景色
        prizeBgColors: ["#ffffff", "#fab044", "#ffffff", "#fab044", "#ffffff", "#fab044", "#ffffff", "#fab044"],
        // 转盘的外边框颜色
        borderColor: "#fab044"
      },

      // 中奖的奖品的index
      prizeIndex: -1,
      // 用来锁定转盘，避免同时多次点击转动
      isLocking: false,

      // 剩余抽奖次数
      num: 1,

      // 分享弹出层
      showPopupContext: false
    };
  },
  activated() {
    this.initList();
    this.getShareData();
  },
  methods: {
    initList() {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "订单支付中"
      });
      this.dataTime();
      this.myInterval = window.setInterval(() => {
        setTimeout(() => {
          this.dataTime(); //调用接口的方法
        });
      }, 3000);
    },
    // 初始化分享
    getShareData() {
      this.fun.wxShare(
        "",
        {},
        {
          link: this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/home?i=" + this.fun.getKeyByI() + "&mid=" + this.fun.getKeyByMid()
        }
      );
    },
    // 轮询
    dataTime() {
      $http
        .post("plugin.free-lottery.frontend.lottery.wait", {
          order_ids: this.$route.query.order_ids
        })
        .then(res => {
          if (res.data.status == 1) {
            clearInterval(this.myInterval);
            Toast.clear();
            this.getLuckDraw();
          }
        });
    },
    // 分享弹出层
    showPopup() {
      this.showPopupContext = true;
    },
    // 分享-确认
    btnShareDete() {
      this.showPopupContext = false;
    },
    // 关闭弹窗
    close() {
      this.show = false;
      this.oneShow = false;
      this.gooodsShow = false;
      clearInterval(this.myInterval);
    },
    // 获取抽奖数据
    getLuckDraw() {
      $http
        .post("plugin.free-lottery.frontend.lottery", {
          order_ids: this.$route.query.order_ids
        })
        .then(res => {
          if (res.result == 1) {
            this.dividendList = res.data.dividend;
            this.taskList = res.data.task;
            this.status = res.data.status;
            this.startRotation();
          } else {
            Toast(res.msg);
          }
        });
    },
    // 跳转到任务记录
    btnQueryTask() {
      this.$router.push(this.fun.getUrl("FreeRecord"));
    },
    startRotation() {
      // if(this.status){
      // 如果还不可以转动
      if (!this.canBeRotated()) {
        return false;
      }
      // 开始转动
      // 先上锁
      this.isLocking = true;
      // 设置在哪里停下，应该与后台交互，这里随机抽取0~5
      // const index = Math.floor(Math.random() * this.prizeData.length);
      // 成功后次数减少一次
      this.num--;
      // this.prizeIndex = index;

      if (this.status) {
        let free_list = [1, 3, 5, 7];
        let index = Math.floor(Math.random() * free_list.length);
        this.prizeIndex = free_list[index];
      } else {
        let no_list = [0, 2, 4, 6];
        let index = Math.floor(Math.random() * no_list.length);
        this.prizeIndex = no_list[index];
      }
      // 告诉子组件，开始转动了
      this.$refs.roundTurntable.rotate(this.prizeIndex);
      // }
    },
    // 已经转动完转盘触发的函数
    endRotation() {
      if (`${this.prizeData[this.prizeIndex].prizeName}` === "谢谢参与") {
        this.show = true;
      }
      if (`${this.prizeData[this.prizeIndex].prizeName}` === "免单") {
        if (this.taskList.status === 1) {
          // status === 1 为已完成
          this.gooodsShow = true;
        } else {
          this.oneShow = true;
        }
      }
      // 提示中奖
      // alert(`恭喜您获奖啦,您的奖品是：${this.prizeData[this.prizeIndex].prizeName}---${this.prizeIndex}`);
      // 解锁
      this.isLocking = false;
    },
    // 判断是否可以转动
    canBeRotated() {
      if (this.num <= 0) {
        // Toast("已经没有次数了！");
        return false;
      }
      if (this.isLocking) {
        return false;
      }
      return true;
    }
  },
  destroyed() {
    clearInterval(this.myInterval);
  },
  // filters:{
  //   conversionTime(data){
  //     function timeStamp(StatusMinute){
  //       let day=parseInt(StatusMinute/60/24);
  //       let hour=parseInt(StatusMinute/60%24);
  //       let min= parseInt(StatusMinute % 60);
  //       StatusMinute="";
  //       if (day > 0)
  //       {
  //          StatusMinute= day + "天";
  //       }
  //       if (hour>0)
  //       {
  //          StatusMinute += hour + "小时";
  //       }
  //       if (min>0)
  //       {
  //          StatusMinute += parseFloat(min) + "分钟";
  //       }
  //        return StatusMinute;
  //     }
  //     return timeStamp(data)
  //   }
  // },
  components: { roundTurntable }
};
