<template>
  <div id="timeAppointment">
    <div>
      <div class="timeAppointmentUser">
        <div class="headTop">
          <i class="iconfont icon-fontclass-rengezhongxin"></i>
          <div class="title">选择{{ appointmentLang.reserve_obj }}</div>
        </div>
        <div class="checkList">
          <van-radio-group v-model="result" @change="checkTap">
            <div class="lis" v-for="item in plugin.objs" :key="item.id">
              <van-radio :name="item.id" checked-color="#f42a26"></van-radio>
              <div class="lisRight" @click="tapUser(item.service_id)">
                <div class="leftImg">
                  <img :src="item.thumb" alt="" />
                </div>
                <div class="rightBox">
                  <div class="name">
                    <span>{{ item.name }}</span>
                  </div>
                  <div class="intro">
                    <span>{{ item.description }}</span>
                  </div>
                  <div class="priceTxt">
                    {{ appointmentLang.service }}费:
                    <span class="price">{{ $i18n.t("money") }}{{ item.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </van-radio-group>
        </div>
      </div>
      <div class="timeSelectCon">
        <div class="headTop">
          <i class="iconfont icon-fontclass-xianshi"></i>
          <div class="title">选择预约时间</div>
        </div>
        <div class="calendar">
          <div class="weekDate" v-if="dateArr.length > 0 && dateArr">
            <div class="weekDateIn" v-for="(item, index) in dateArr" :key="index" @click="tapWeekInd(index)">
              <span class="spanTop" :class="[index == seleTap ? 'sToday' : '']">{{ checkTxt(item) }}</span>
              <div :class="[index == seleTap ? 'sTodayCircle' : '']" class="noneCircle">
                <span>{{ item.work_date.slice(8, 10) }}</span>
              </div>
            </div>
          </div>
          <div class="timelist" v-if="dateArr[seleTap]">
            <div
              v-for="(item, index) in dateArr[seleTap].periods"
              :key="index"
              class="dtime"
              @click="tapTimeInd(index, item)"
              :class="[item.status == 1 ? 'timeSelect' : 'timeSelect_none', index == timeSelect && item.status == 1 ? 'onSelect' : '']"
            >
              {{ item.period_time_start_str }}
            </div>
          </div>
          <div class="noSelect" v-if="!dateArr[seleTap]">暂无可预约时间</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  props: {
    plugin: {
      type: Object,
      default: () => ({})
    },
    goods_info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      result: 0,
      dateArr: [],
      workInfo: [],
      seleTap: 0,
      timeSelect: 0,
      childData: {
        time: "",
        item: null
      }
    };
  },
  computed: {
    appointmentLang() {
      if (this.$store.state.shopLanguage.reserve_simple) {
        return this.$store.state.shopLanguage.reserve_simple;
      } else {
        return { reserve_obj: "预约人员", service: "服务" };
      }
    }
  },
  watch: {
    // plugin(res) {
    //   if (this.plugin && this.plugin.objs) {
    //     console.log("ssssssssssssssssss");
    //     this.result = this.plugin.objs[0].id;
    //     this.getData(this.plugin.objs[0].service_id, this.plugin.objs[0].id, 0);
    //   }
    // }
  },
  methods: {
    checkTxt(str) {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`;
      let date = new Date().getDate();
      let nowDate = `${year}-${month}-${date}`;
      if (nowDate == str.work_date) {
        return "当天";
      }
      return str.work_date_week;
    },
    async tapTimeInd(e, item) {
      if (item.status == 0) {
        return Toast("当前时间不可预约");
      }
      this.timeSelect = e;
      let index = await this.checkInd();
      this.childData.item = this.plugin.objs[index];
      let str = this.dateArr[this.seleTap].work_date;
      this.childData.time = `${str} ${this.dateArr[this.seleTap].periods[this.timeSelect].period_time_start_str}`;
    },
    async tapWeekInd(e) {
      this.seleTap = e;
      let index = await this.checkInd();
      this.childData.item = this.plugin.objs[index];
      let ind = this.checkMr(this.dateArr[this.seleTap].periods);
      this.timeSelect = ind;
      if (this.dateArr[e].periods && this.dateArr[e].periods[this.timeSelect]) {
        // `${this.dateArr[this.seleTap].work_date} ${this.dateArr[this.seleTap].periods[this.timeSelect].period_time_start_str}`
        this.childData.time = `${this.dateArr[this.seleTap].work_date} ${this.dateArr[this.seleTap].periods[this.timeSelect].period_time_start_str}`;
      }
      this.$emit("postActionChild", this.childData);
    },
    tapUser(kid) {
      this.$router.push(this.fun.getUrl("AppointmentUserDe", { id: kid }));
    },
    checkTap(e) {
      // this.timeSelect = 0;
      for (let i = 0; i < this.plugin.objs.length; i++) {
        if (this.plugin.objs[i].id == this.result) {
          this.getData(this.plugin.objs[i].service_id, this.plugin.objs[i].id, i,'one');
        }
      }
    },
    checkInd(e) {
      for (let i = 0; i < this.plugin.objs.length; i++) {
        if (this.plugin.objs[i].id == this.result) {
          return i;
        }
      }
    },
    checkMr(oneSelect) {
      for (let i = 0; i < oneSelect.length; i++) {
        if (oneSelect[i].status == 1) {
          return i;
        }
      }
    },
    getWeek(dateString) {
      let dateArray = dateString.split("-");
      let date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
      return "周" + "日一二三四五六".charAt(date.getDay());
    },
    async getData(sid, id, index, key) {
      $http
        .get("plugin.reserve-simple.frontend.work-time.get-service-obj-periods", { obj_id: id, service_id: sid }, "加载中")
        .then(response => {
          if (response.result === 1) {
            console.log(response.data);
            this.workInfo = response.data;
            for (let i = 0; i < this.workInfo.length; i++) {
              this.workInfo[i].work_date_week = this.getWeek(this.workInfo[i].work_date);
            }
            if (key == "one") {
              let ind = this.checkMr(this.workInfo[this.seleTap].periods);
              if(!ind) this.childData.time = ""; //如果没有可以预约的就为空
              this.timeSelect = ind;
            }
            this.dateArr = this.workInfo;
            this.childData.item = this.plugin.objs[index];
            if (this.dateArr[this.seleTap].periods[this.timeSelect]) {
              if (this.dateArr[this.seleTap].periods[this.timeSelect].status == 0) {
                this.childData.time = "";
              } else {
                this.childData.time = `${this.dateArr[this.seleTap].work_date} ${this.dateArr[this.seleTap].periods[this.timeSelect].period_time_start_str}`;
              }
            }
            this.$emit("postActionChild", this.childData);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  mounted() {
    if (this.plugin && this.plugin.objs) {
      this.result = this.plugin.objs[0].id;
      this.getData(this.plugin.objs[0].service_id, this.plugin.objs[0].id, 0, "one");
    }
  }
};
</script>
<style lang="scss" scoped>
#timeAppointment {
  position: relative;
}
.sTodayCircle {
  width: 1.44rem;
  background-color: #f42a26;
  color: #ffffff;
  border-radius: 100%;
  text-align: center;
}
.noneCircle {
  height: 1.44rem;
  line-height: 1.44rem;
}
.noSelect {
  font-size: 0.813rem;
  color: #9c9c9c;
}
.sToday {
  color: #f42a26;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeSelectCon {
  width: 22.19rem;
  background-color: #ffffff;
  border-radius: 0.63rem;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 1rem 0.66rem 0.94rem 0.75rem;
  margin-top: 0.63rem;
  .calendar {
    margin-top: 1.06rem;
    .timelist {
      margin-top: 1.06rem;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .dtime:nth-child(n + 6) {
        margin-top: 1.09rem;
      }
      .dtime:nth-child(5n) {
        margin-right: 0;
      }
      .dtime {
        width: 16.3%;
        height: 1.63rem;
        border-radius: 0.13rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.81rem;
        margin-right: 0.89rem;
      }
      .onSelect {
        background-color: #f42a26;
        border: none;
        color: #ffffff;
        font-size: 0.81rem;
      }
      .timeSelect {
        border: solid 0.06rem #c2c2c2;
      }
      .timeSelect_none {
        border: solid 0.06rem #e8e8e8;
        color: #c4c4c4;
      }
    }

    .weekDate {
      display: flex;
      align-items: center;
      padding-bottom: 0.63rem;
      box-sizing: border-box;
      border-bottom: 0.03rem #f0f0f0 solid;
      overflow-x: auto;
      .weekDateIn {
        width: 15%;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .spanTop {
          margin-bottom: 0.3rem;
          font-size: 0.88rem;
          font-weight: bold;
        }
      }
    }
  }
}
.timeAppointmentUser {
  width: 22.19rem;
  background-color: #ffffff;
  border-radius: 0.63rem;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 1rem 0.66rem 0.94rem 0.75rem;
  .checkList {
    display: flex;
    flex-direction: column;
    .lis {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.94rem;
      .lisRight {
        width: 19.06rem;
        height: 6.19rem;
        background-color: #ffffff;
        border-radius: 0.31rem;
        border: solid 0.03rem #d0d0d0;
        padding: 0.75rem 0.63rem 0.75rem 0.75rem;
        box-sizing: border-box;
        display: flex;
        .rightBox {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          overflow: hidden;
          .priceTxt {
            font-size: 0.75rem;
            color: #4f4f4f;
            font-weight: bold;
            .price {
              color: #f14e4e;
            }
          }
          .name {
            width: 100%;
            font-size: 0.88rem;
            color: #4f4f4f;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
          }
          .intro {
            font-size: 0.75rem;
            color: #666666;
            text-align: left;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
        }
        .leftImg {
          flex-shrink: 0;
          width: 2.81rem;
          height: 2.81rem;
          border-radius: 100%;
          margin-right: 0.75rem;
          img {
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }
        }
      }
    }
  }
}
.headTop {
  display: flex;
  margin-bottom: 0.97rem;
  margin-right: 0.34rem;
  .title {
    font-size: 1.06rem;
    color: #353434;
    font-weight: bold;
    margin-left: 0.38rem;
  }
  .iconfont {
    font-size: 1.5rem;
    color: #fc8200;
  }
}
</style>
