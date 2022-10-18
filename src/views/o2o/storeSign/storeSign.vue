<template>
  <div id="storeSign">
    <c-title :hide="false"></c-title>
    <div class="calendarBox">
      <div class="headTop">
        <div class="headTopleft">
          <div class="headTopleft_point">{{ info.store_accumulate_integral || 0 }}</div>
          <div class="headTopleft_txt">累计签到分</div>
          <div class="headTopleft_txt2">今日签到可得 {{ info.can_get_integral || 0 }} 签到分</div>
        </div>
        <div class="headTopRight">
          <div class="headTopRight_conten">
            <tamplate v-if="!info.new_finish_task">
              <div class="headTopRight_contentxt">-已连续签到-</div>
              <div class="headTopRight_contentxt2">{{ info.continuity || 0 }}<span>天</span></div>
            </tamplate>
            <tamplate v-else>
              <div class="headTopRight_contentxt clear">已完成门店新用户签到任务</div>
            </tamplate>
          </div>
          <div class="btnbox">
            <div class="btn" @click="attendance">{{ info.attended ? "已签到" : "立即签到" }}</div>
          </div>
        </div>
      </div>
      <div class="calendarView">
        <div class="month">{{ year }}年{{ month }}月</div>
        <div class="calendarList">
          <ol>
            <li>日</li>
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li>六</li>
          </ol>
          <div>
            <ul>
              <div v-bind:style="{ width: w + '%' }"></div>
              <li v-for="(val, key) in m" :key="key">
                <div class="dayTxt">
                  {{ val }}
                  <img v-if="checkKey(key)" src="../../../assets/images/storeCalendar/sign.png" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="calendarBottom">
        <div class="detail" @click="goDetail">
          <span>签到明细</span>
          <van-icon name="arrow" />
        </div>
        <div class="signDetail">
          <div class="signDetail_list">
            <div class="txt">{{ info.surplus_count }}</div>
            <div>剩余签到次数</div>
          </div>
          <div class="signDetail_list">
            <div class="txt">{{ info.store_accumulate_count }}</div>
            <div>累计已签到次数</div>
          </div>
        </div>
      </div>
      <div class="intro" @click="intrShow = true">
        <div class="icona">
          <i class="iconfont icon-qhm_shuoming"></i>
        </div>
        签到规则
      </div>
    </div>
    <van-popup v-model="show" class="mint-popup" style="border-radius: 1.31rem; background: transparent">
      <div class="showBox">
        <div class="showBoxTop"></div>
        <div class="showBoxBottom">签到成功，奖励{{ awardinfo }}签到分！</div>
      </div>
      <i class="iconfont icon-adsystem_icon_cancle" @click="show = false"></i>
    </van-popup>
    <van-popup v-model="intrShow" class="mint-popup" style="width: 80%; border-radius: 1rem; background: transparent">
      <div class="intrShowBox">
        <div class="title">签到规则</div>
        <div class="introHtml" v-html="info.attendance_describe" v-if="info.attendance_describe"></div>
      </div>
      <i class="iconfont icon-adsystem_icon_cancle" @click="intrShow = false"></i>
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      // 日历
      year: "",
      month: "",
      m: "",
      w: "",
      show: false,
      intrShow: false,
      info: [],
      awardinfo: [],
      store_id: ""
    };
  },
  activated() {
    this.store_id = this.$route.params.id;
    this.getDataNum(1);
    this.getData();
    window.scrollTo(0, 0);
  },
  methods: {
    checkKey(key) {
      if (this.info.attendance_date) {
        return this.info.attendance_date.indexOf(key + 1) + 1;
      }
    },
    goDetail() {
      this.$router.push(this.fun.getUrl("storeSignDetail", {}));
    },
    getDataNum(num) {
      let date = new Date();
      let year = date.getFullYear();
      this.year = year;
      let month = date.getMonth() + num;
      this.month = month;
      let d = new Date(year, month, 0);
      this.m = d.getDate(); // 获取一个月多少天
      let wx = new Date(year, month - 1, 1); // 获取当月第一天是星期几
      let w1 = wx.getDay();
      this.w = w1 * 14.27;
    },
    getData() {
      let json = {
        year: this.year,
        month: this.month,
        store_id: this.store_id
      };
      $http
        .get("plugin.store-attendance.frontend.dashboard.index", json, "")
        .then(response => {
          if (response.result == 1) {
            this.info = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 签到
    attendance() {
      if (this.info.attended) {
        Toast("已签到");
        return;
      } else {
        $http
          .get("plugin.store-attendance.frontend.member.attendance", { store_id: this.store_id }, "")
          .then(response => {
            if (response.result == 1) {
              this.awardinfo = response.data.award;
              this.show = true;
              this.getData();
            } else {
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#storeSign {
  min-height: 100vh;
  .icon-adsystem_icon_cancle {
    color: #fff;
    margin-top: 1rem;
    font-size: 2.5rem;
  }
  .intrShowBox {
    width: 100%;
    height: 20rem;
    background: #fff;
    border-radius: 1rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    .title {
      padding: 0.8rem;
    }
    .introHtml {
      flex: 1;
      padding: 0 1rem;
      border-radius: 0 0 1rem 1rem;
      text-align: left;
    }
  }
  .showBox {
    width: 17.53rem;
    height: 15.44rem;
    border-radius: 1.31rem;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    .showBoxBottom {
      width: 100%;
      height: 4.59rem;
      background: #fff;
      font-size: 1rem;
      text-align: center;
      line-height: 4.59rem;
      border-radius: 0 0 1.31rem 1.31rem;
    }
    .showBoxTop {
      flex: 1;
      background-repeat: no-repeat;
      background-size: cover;
      background-image: url("../../../assets/images/storeCalendar/succee.png");
    }
  }
  .calendarBox {
    overflow: hidden;
    width: 100%;
    position: relative;
    padding: 0 0.91rem;
    padding-bottom: 1.88rem;
    background-repeat: no-repeat;
    background-size: 100% 20.41rem;
    background-image: url("../../../assets/images/storeCalendar/background.png");
    .intro {
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #858585;
      font-size: 0.63rem;
      margin-top: 1.13rem;
      .icona {
        width: 1rem;
        height: 1rem;
        background-color: #b2b2b2;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        margin-right: 0.38rem;
        .iconfont {
          font-size: 0.5rem;
          color: #fff;
        }
      }
    }
    .calendarBottom {
      width: 100%;
      height: 7.81rem;
      padding: 0 0.81rem;
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      box-shadow: 0rem 0.06rem 0.56rem 0rem rgba(199, 199, 199, 0.29);
      border-radius: 0.31rem;
      padding-top: 1rem;
      .signDetail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        .signDetail_list {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .txt {
            font-size: 1.13rem;
            color: #1b1b1b;
            margin-bottom: 0.5rem;
          }
        }
      }
      .detail {
        border-bottom: 1px solid #e8e8e8;
        padding-bottom: 0.91rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.88rem;
      }
    }
    .calendarView {
      margin-top: 0.84rem;
      width: 100%;
      height: 20.31rem;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url("../../../assets/images/storeCalendar/calendatBackground.png");
      padding-top: 2.08rem;
      // .calendarList{
      //   padding: 0 0.4rem;
      // }
      ol {
        display: flex;
      }
      ol {
        display: flex;
        box-sizing: border-box;

        & > li {
          display: inline-block;
          width: 14.27%;
          float: left;
          line-height: 2rem;
        }
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        box-sizing: border-box;
        padding: 0 0.3rem;

        div {
          // border-bottom: solid 0.0625rem #e5e5e5;
        }

        & > li {
          list-style: none;
          width: 14.27%;
          height: 2.4rem;
          // border-bottom: solid 0.0625rem #e5e5e5;

          .dayTxt {
            display: block;
            margin: 0.55rem 0 0.4rem 0;
            position: relative;
            font-size: 0.75rem;
            img {
              position: absolute;
              left: 0.95rem;
              top: -0.15rem;
              border-radius: 50%;
              width: 1.28rem;
              height: 1.31rem;
              display: block;
            }
          }
        }

        &::after {
          content: "";
          width: 100%;
          height: 0.0625rem;
          z-index: 1;
          background: #fff;
          position: relative;
          left: 0;
          bottom: 0.0625rem;
        }
      }
      .month {
        text-align: center;
        font-size: 0.88rem;
        color: #1b1b1b;
      }
    }
    .background_Img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0 auto;
    }
    .headTop {
      padding-top: 2.28rem;
      width: 100%;
      display: flex;
      justify-content: center;
      .headTopRight {
        flex-shrink: 0;
        width: 10.25rem;
        height: 10.28rem;
        z-index: 1;
        display: flex;
        align-items: center;
        margin-left: 1.44rem;
        background-image: url("../../../assets/images/storeCalendar/circle.png");
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
        justify-content: center;
        .headTopRight_conten {
          font-size: 0.75rem;
          color: #ffffff;
          width: 60%;
          .headTopRight_contentxt {
            margin-bottom: 0.4rem;
          }
          .clear {
            margin-bottom: 0;
          }
          .headTopRight_contentxt2 {
            font-size: 1.88rem;
            span {
              font-size: 0.88rem;
            }
          }
        }
        .btnbox {
          position: absolute;
          bottom: 0.81rem;
          width: 100%;
          height: 1.88rem;
          display: flex;
          justify-content: center;
          .btn {
            width: 5.63rem;
            height: 1.88rem;
            background-color: #ffffff;
            border-radius: 0.94rem;
            font-size: 0.81rem;
            color: #ff2c29;
            text-align: center;
            line-height: 1.88rem;
          }
        }
      }
      .headTopleft {
        overflow: hidden;
        z-index: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: flex-end;
        font-size: 0.75rem;
        color: #ffffff;
        .headTopleft_point {
          font-size: 1.5rem;
          margin-bottom: 0.7rem;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .headTopleft_txt {
          margin-bottom: 0.8rem;
        }
        .headTopleft_txt2 {
          margin-bottom: 2rem;
        }
      }
    }
  }
}
</style>