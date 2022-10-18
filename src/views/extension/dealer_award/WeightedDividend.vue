<template>
  <div style="text-align: left;">
    <div class="header">
      <div class="info-box">
        <div class="img">
          <img :src="member.avatar_image" alt />
        </div>
        <div class="info">
          <div class="nickname">{{ member.nickname }}</div>
          <div v-if="level" class="levelname">{{ level.level_name }}</div>
        </div>
      </div>
      <div class="total">累计分红金额：￥{{ total || "0.00" }}</div>
    </div>
    <div>
      <van-tabs v-model="active" sticky>
        <van-tab title="分红记录">
          <div class="record-box">
            <div class="record flex">
              <div class="flex1">按年</div>
              <van-popover v-model="showPopover" trigger="click" :actions="actions" @select="onSelect" placement="bottom">
                <template #reference>
                  {{ yearVal }}年
                  <div style="display: inline-block;" class="transition" :class="[showPopover ? 'open-arrow' : 'close-arrow']"><van-icon name="arrow-up" /></div>
                </template>
              </van-popover>
            </div>
            <div style="text-align: center;margin-top: 10px;" v-if="list.length <= 0">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blank.png" alt="" />
            </div>
            <template v-else>
              <div class="record transition" v-for="(item, i) in list" :class="[isclick[i] ? 'open-record' : 'close-record']" :key="i">
                <div class="flex" style="font-size: 1rem;margin-bottom: .8rem;">
                  <div class="flex1" style="color: #202020;">{{ item.year }}-{{ item.month }} 分红金额</div>
                  <div class="flex1" style="color:#f15353;margin-left:.5rem">{{ item.dividend_amounts > 0 ? "+" + item.dividend_amounts : item.dividend_amounts }}</div>
                  <div class="transition" @click="zhankai(i)" :class="[isclick[i] ? 'open-arrow' : 'close-arrow']"><van-icon name="arrow-up" /></div>
                </div>
                <div class="flex item">
                  <div class="flex1">团队业绩：{{ item.team_amounts || "0.00" }}</div>
                  <div class="flex1" v-if="show_person">等级达标人数：{{ item.person_num || "0" }}人</div>
                </div>
                <div class="flex item">
                  <div class="flex1">奖金总额：{{ item.all_amounts || "0.00" }}</div>
                  <div class="flex1" v-if="show_ratio">分红比例：{{ item.ratio || "0" }}%</div>
                </div>
              </div>
            </template>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import { Toast, Popover } from "vant";
export default {
  components: {
    "van-popover": Popover
  },
  data() {
    return {
      showPopover: false,
      isclick: [],
      show: false,
      yearVal: "",
      actions: [],
      member: {},
      level: {},
      total: null,
      list: [],
      active: "",
      show_person: false,
      show_ratio: false
    };
  },
  created() {
    this.getYearArr();
    this.getdata();
  },
  methods: {
    getYearArr() {
      let year = new Date().getFullYear();
      this.yearVal = year + "";
      for (let i = year; i >= 2021; i--) {
        this.actions.push({ text: i + "" });
      }
    },
    getdata() {
      $http.post("plugin.new-weighted-dividend.frontend.controllers.records.index", { search_year: this.yearVal }, "loading").then(res => {
        if (res.result == 1) {
          let data = res.data;
          this.show_person = data.show_person;
          this.show_ratio = data.show_ratio;
          this.total = data.total;
          this.level = data.member.has_one_level;
          this.member = data.member.has_one_member;
          this.list = data.list;
        } else {
          Toast(res.msg);
        }
      });
    },
    zhankai(i) {
      this.$set(this.isclick, i, !this.isclick[i]);
    },
    onSelect(item) {
      if (this.yearVal == item.text) {
        Toast(`当前是${this.yearVal}年的数据`);
        return;
      }
      this.yearVal = item.text;
      this.getdata();
    }
  }
};
</script>
<style lang="scss">
.van-tab {
  border-bottom: solid 0.125rem #ebebeb;
}
.van-popover__action {
  padding: 0;
  width: 6rem;
}
.header {
  width: 100%;
  background-color: #ee2e2b;
  color: #fff;
  .info-box {
    height: 7.344rem;
    display: flex;
    align-items: center;
    padding-left: 2rem;
    .img {
      img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }
    }
    .info {
      margin-left: 0.8rem;
      .nickname {
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }
      .levelname {
        display: inline-block;
        opacity: 0.9;
        font-size: 0.8rem;
        padding: 0.2rem 0.6rem;
        border-radius: 1rem;
        background-color: #f36b69;
      }
    }
  }
  .total {
    height: 2rem;
    background-color: #f14d4b;
    line-height: 2rem;
    padding-left: 1rem;
  }
}
.flex {
  display: flex;
}
.flex1 {
  flex: 1;
}
.record-box {
  padding: 0 1rem;
  background-color: #fff;
}
.record {
  font-size: 1rem;
  padding: 1rem 0;
  border-bottom: 1px #ebebeb solid;
  overflow: hidden;
}
.record:last-child {
  border-bottom: 1px solid transparent;
}
.item {
  line-height: 1.5rem;
  color: #666666;
  font-size: 0.8rem;
}
.transition {
  transition: all 0.3s;
}
.close-record {
  height: 3rem;
}
.open-record {
  height: 7rem;
}
.close-arrow {
  transform: rotate(0);
}
.open-arrow {
  transform: rotate(180deg);
}
</style>
