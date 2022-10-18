<template>
  <div class="time_box">
    <div :class="{ fixed: top }" style="position: fixed; width: 100%;">
      <div class="title">
        <h3>选择{{ type }}日期</h3>
        <i class="iconfont icon-close11" @click="close"></i>
      </div>
      <div class="week_box">
        <ul class="week">
          <li>日</li>
          <li>一</li>
          <li>二</li>
          <li>三</li>
          <li>四</li>
          <li>五</li>
          <li>六</li>
        </ul>
      </div>
    </div>
    <div class="box">
      <div class="month_box" v-for="(item, index) in date_obj_arr" :key="index">
        <h4>{{ item.full }}</h4>
        <div class="month">
          <ul class="row">
            <li v-for="(null_item,i) in item.null" :key='i'></li>
            <li
              v-for="(day_item, day_index) in item.day" :key="day_index"
              v-if="day_item.isOld == '-1'"
              style="background: #ccc;"
            >
              {{ day_item.value }}
            </li>
            <li
              v-for="(day_item, day_index) in item.day"
              v-if="day_item.isOld == '0'" :key="day_index"
              :class="{ choose1: day_index == d_index && index == m_index }"
              @click="chooseDate(index, day_index, day_item.all_date)"
            >
              <span>{{ day_item.value }}</span
              ><br/><span>{{
                day_index == d_index && index == m_index ? type : ""
              }}</span>
            </li>
            <li
              v-for="(day_item, day_index) in item.day"
              v-if="day_item.isOld == '1'" :key="day_index"
              :class="{ choose: day_index == d_index && index == m_index }"
              @click="chooseDate(index, day_index, day_item.all_date)"
            >
              <span>{{ day_item.value }}</span
              ><br/><span>{{
                day_index == d_index && index == m_index ? type : ""
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      date_obj_arr: [],
      m_index: 8888,
      d_index: 9999
    };
  },
  props: {
    //判断类型：入住日期 离店日期
    type: {
      default: ""
    },
    start: {
      default: ""
    },
    end: {
      default: ""
    },
    top: {
      default: true
    }
  },
  methods: {
    getDay() {
      let date_obj_arr = [];
      for (let i = 1; i < 13; i++) {
        let date_obj = {},
          day_arr = [],
          null_arr = [];
          //1.获取当前年份
        let current_year = new Date().getFullYear().toString();
        //2.获取当前时间
        let current_day = new Date().getDate();
        let current_date = new Date(`${current_year} ${i}`);
        let nulls = current_date.getDay();
        let days = this.getMonthDay(current_year, i);
        //3.当前时间
        let now_month = new Date().getMonth() + 1;
        //4.保存月份
        let current_month = i;
        for (let i = 0; i < days; i++) {
          let obj = {};
          if (current_day == i + 1 && now_month == current_month) {
            obj["value"] = "今天";
          } else {
            obj["value"] = i + 1;
          }
          if (current_day > obj.value && now_month == current_month) {
            obj["isOld"] = "-1";
          } else if (current_day < obj.value && now_month == current_month) {
            obj["isOld"] = "1";
          } else {
            if (now_month == current_month) {
              obj["isOld"] = "0";
            } else {
              obj["isOld"] = "1";
            }
          }
          if (now_month > current_month) {
            obj["isOld"] = "-1";
          }
          obj["all_date"] = `${current_year}-${
            current_month < 10 ? `0${current_month}` : `${current_month}`
          }-${i + 1 < 10 ? `0${i + 1}` : `${i + 1}`}`;
          day_arr.push(obj);
        }
        date_obj["day"] = day_arr;
        for (let i = 0; i < nulls; i++) {
          null_arr.push("null");
        }
        date_obj["null"] = null_arr;
        date_obj_arr.push(date_obj);
        date_obj["date"] = `${current_year}年${i}月`;
      }
      this.date_obj_arr = date_obj_arr;
    },
    getMonthDay(year, month) {
      let d = new Date(year, month, 0);
      return d.getDate();
    },
    chooseDate(index1, index2, date) {
      this.toggle(index1, index2);
      this.$emit("timeChange", this.type, date);
    },
    toggle(index1, index2, date) {
      //切换选中
      if (this.m_index == index1 && this.d_index == index2) {
        return;
      } else {
        this.m_index = index1;
        this.d_index = index2;
      }
    },
    close() {
      this.$emit("close", this.type);
    },
    //获取month循环数组(获取动态12个月数组)
    getMonthsArr() {
      let dataArr = [],
        data = new Date(),
        year = data.getFullYear(),
        // arr = [],
        currentObj = {};
      currentObj.year = year.toString();
      currentObj.month =
          data.getMonth() + 1 < 10
            ? "0" + (data.getMonth() + 1)
            : data.getMonth() + 1 + "";
      currentObj.full = currentObj.year + "-" + currentObj.month;
      for (let i = 0; i < 11; i++) {
        data.setDate(1);
        data.setMonth(data.getMonth() + 1); //每次循环一次 月份值加1
        // let current_month = data.getMonth();
        let obj = {};
        obj.year = data.getFullYear().toString();
        obj.month =
            data.getMonth() + 1 < 10
              ? "0" + (data.getMonth() + 1)
              : data.getMonth() + 1 + "";
        obj.full = obj.year + "-" + obj.month;
        dataArr.push(obj);
      }
      dataArr.unshift(currentObj);
      return dataArr;
    },
    getData() {
      //获取日期数组
      let month_arr = this.getMonthsArr();
      //获取今天的日期和月份
      let now_month =
          new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1 + "";
      let current_day = new Date().getDate();
      month_arr.forEach(item => {
        //获取天数
        let days = this.getMonthDay(item.year, item.month),
          day_arr = [],
          null_arr = [];
          //获取null个数
        let nulls = new Date(item.full).getDay();
        //处理天数数组
        for (let i = 0; i < days; i++) {
          let obj = {};
          obj["all_date"] = item.full + `-${i + 1}`;
          if (current_day == i + 1 && now_month == item.month) {
            obj["value"] = "今天";
          } else {
            obj["value"] = i + 1;
          }
          if (current_day > obj.value && now_month == item.month) {
            obj["isOld"] = "-1";
          } else if (current_day < obj.value && now_month == item.month) {
            obj["isOld"] = "1";
          } else {
            if (now_month == item.month) {
              obj["isOld"] = "0";
            } else {
              obj["isOld"] = "1";
            }
          }

          day_arr.push(obj);
        }
        //获取null数组
        for (let i = 0; i < nulls; i++) {
          null_arr.push("null");
        }
        item.null = null_arr; //加入数组null
        item.day = day_arr; //加入数组day_arr
        // console.log(item);
      });

      this.date_obj_arr = month_arr;
      // console.log(this.date_obj_arr);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .time_box {
    display: inline;

    .fixed {
      //position: fixed;
      top: 20%; //width: 100%;
    }

    .box {
      margin-top: 4.375rem;
    }

    .title {
      background: #fff;
      line-height: 2.5rem;
      text-align: center;
      display: flex;

      h3 {
        width: 100%;
        font-size: 16px;
      }

      i {
        font-size: 1rem;
        color: #999;
        position: absolute;
        right: 0.625rem;
        line-height: 2.5rem;
      }
    }

    .week_box {
      background: #f5f5f5;

      .week {
        display: flex;

        li {
          width: 3.3438rem;
          font-size: 15px;
          line-height: 1.875rem;
        }

        li:last-child,
        li:first-child {
          color: #f15353;
        }
      }
    }

    .month_box {
      background: #fff;
      margin-bottom: 0.625rem;

      h4 {
        line-height: 2.25rem;
        text-align: center;
        border-bottom: solid 0.0625rem #ebebeb;
        font-size: 15px;
        font-weight: normal;
      }

      .month {
        padding: 0.625rem 0;

        .row {
          display: flex;
          flex-wrap: wrap;

          li {
            flex-direction: row;
            width: 3.3438rem;
            font-size: 15px;
            height: 2.5rem;
          }
          // li:last-child,li:first-child{
          //     color:#f15353;
          // }
          .cur {
            background: #53a1f1;
            border-radius: 0.25rem;
            color: #fff;
          }
        }
      }
    }
  }

  .choose {
    background: #333;
    color: #fff;
  }

  .choose1 {
    background: #333;
    color: #fff;
  }

  .cur_choose {
    border: solid 0.0625rem #53a1f1;
    background: #eaf4fd;
  }
</style>
