<template>
  <div id="storeSignDetail">
    <c-title :hide="false" text="签到明细"></c-title>
    <div class="headBox">
      <div class="line bga">
        <div class="min">
          <div class="point">{{ info.points || 0 }}</div>
          <div class="txt">我的签到分</div>
        </div>
        <div class="min">
          <div class="point">{{ info.withdraw_points || 0 }}</div>
          <div class="txt">可提现签到分</div>
        </div>
      </div>
      <div class="line">
        <div class="min">
          <div class="point">{{ info.attendance_surplus || 0 }}</div>
          <div class="txt">剩余签到次数</div>
        </div>
        <div class="min">
          <div class="point">{{ info.attendance_count || 0 }}</div>
          <div class="txt">累计已签到次数</div>
        </div>
      </div>
      <div class="lineBottom" @click="show = true">
        <div class="txt">去提现</div>
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="coline"></div>
    <van-tabs v-model="active" @change="changeTap">
      <van-tab title="签到次数记录"></van-tab>
      <van-tab title="签到分记录"></van-tab>
      <van-tab title="提现记录"></van-tab>
    </van-tabs>
    <div class="list">
      <template v-for="(item, ind) in list">
        <div class="lis" :key="ind">
          <div class="left">
            <template v-if="active == 0">
              <div class="title">{{ item.type_name }}</div>
              <div class="sn">{{ item.remark }}</div>
              <div class="time">{{ item.created_at }}</div>
            </template>
            <template v-if="active == 1">
              <div class="title">{{item.type_name}}</div>
              <div class="sn">{{ item.store_name }}</div>
              <div class="time">{{ item.created_at }}</div>
            </template>
            <template v-if="active == 2">
              <div class="title">{{ item.type_name }}</div>
              <div class="time">{{ item.created_at }}</div>
            </template>
          </div>
          <div class="right">{{ active == 0 ? item.count : active == 1 ? item.attendance_bonus : `-${item.amount}` }}</div>
        </div>
      </template>
    </div>
    <van-popup v-model="show" style="width: 80%; border-radius: 1rem; background: transparent">
      <div class="intrShowBox">
        <div class="title">提现签到分</div>
        <div class="intro">
          <van-field type="number" v-model="points" placeholder="请输入要提现的签到分" />
        </div>
        <div class="txt">最多可输入{{ info.withdraw_points }}</div>
        <div class="txta">提现到{{ withdraw_type }}</div>
        <div class="btn">
          <div class="cancle" @click="show = false">取消</div>
          <div class="confirm" @click="withdrawablePoints">确认</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      show: false,
      points: "",
      info: [],
      withdraw_type: "",
      list: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.initPage();
    this.getData();
    this.getList();
  },
  methods: {
    changeTap() {
      this.initPage();
      this.getList();
    },
    withdrawablePoints() {
      if (this.fun.isTextEmpty(this.points)) {
        this.$dialog.alert({ message: `请输入签到分` });
      }
      if (this.points > this.info.withdraw_points) {
        this.$dialog.alert({ message: `输入签到分大于可提现签到分,请重新输入` });
        return;
      }
      $http
        .get("plugin.store-attendance.frontend.member.withdrawablePoints", { points: this.points }, "")
        .then(response => {
          if (response.result == 1) {
            this.show = false;
            this.points = "";
            this.getData();
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    initPage() {
      this.list = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    getList() {
      let url = "";
      if (this.active == 0) {
        url = "plugin.store-attendance.frontend.member.detailed";
      } else if (this.active == 1) {
        url = "plugin.store-attendance.frontend.member.record";
      } else if (this.active == 2) {
        url = "plugin.store-attendance.frontend.member.withdraw";
      }
      $http
        .get(url, {}, "")
        .then(response => {
          if (response.result == 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.list = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMoreData() {
      let url = "";
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        if (this.active == 0) {
          url = "plugin.store-attendance.frontend.member.detailed";
        } else if (this.active == 1) {
          url = "plugin.store-attendance.frontend.member.record";
        } else if (this.active == 2) {
          url = "plugin.store-attendance.frontend.member.withdraw";
        }
        $http
          .get(url, { page: this.page }, "")
          .then(response => {
            if (response.result == 1) {
              this.isLoadMore = true;
              this.list = response.data;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getData() {
      $http
        .get("plugin.store-attendance.frontend.member.index", {}, "")
        .then(response => {
          if (response.result == 1) {
            console.log(response.data);
            this.info = response.data.statistics;
            this.withdraw_type = response.data.withdraw_type;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
#storeSignDetail {
  background: #ffffff;
  min-height: 100vh;
  .intrShowBox {
    background: #ffffff;
    padding-bottom: 1rem;
    padding: 0.9rem;
    .title {
      padding: 1rem 0;
    }
    .intro {
      border: 1px solid rgba(236, 236, 236, 100);
    }
    .btn {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1.5rem;
      .cancle {
        border: 1px solid #bbbbbb;
        padding: 0.5rem 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 0.7rem;
        border-radius: 0.35rem;
      }
      .confirm {
        border-radius: 0.35rem;
        background: #ec3511;
        padding: 0.5rem 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
      }
    }
    .txt {
      color: #999999;
      text-align: left;
      font-size: 14px;
      margin-top: 0.3rem;
    }
    .txta {
      text-align: left;
      font-size: 14px;
      margin-top: 0.5rem;
    }
  }
  .coline {
    width: 100%;
    height: 0.63rem;
    background-color: #ebebeb;
  }
  .list {
    margin: 0 0.97rem 0 0.91rem;
    .lis {
      height: 100%;
      display: flex;
      padding: 0.84rem 0;
      border-bottom: 1px solid #ebebeb;
      .right {
        padding-top: 0.74rem;
        font-size: 0.81rem;
        color: #f15353;
        flex-shrink: 0;
      }
      .left {
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        font-size: 0.75rem;
        color: #6c6c6c;
        overflow: hidden;
        .title {
          text-align: left;
          width: 100%;
          margin-bottom: 0.5rem;
          font-size: 0.88rem;
          color: #000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sn {
          margin-bottom: 0.3rem;
        }
      }
      .right {
      }
    }
  }
  .headBox {
    width: 23.44rem;
    height: 10rem;
    background-color: #f15353;
    display: flex;
    flex-direction: column;
    position: relative;
    .bga {
      margin-bottom: 1.66rem;
      margin-top: 1rem;
    }
    .line {
      display: flex;
      width: 100%;
      align-items: center;
      .min {
        flex: 1;
        text-align: center;
        font-size: 0.94rem;
        color: #ffffff;
        .txt {
          font-size: 0.75rem;
          margin-top: 0.1rem;
        }
      }
    }
    .lineBottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1.88rem;
      background-color: #f36868;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.94rem;
      color: #ffffff;
      .txt {
        font-size: 0.81rem;
        font-weight: bold;
      }
    }
  }
}
</style>