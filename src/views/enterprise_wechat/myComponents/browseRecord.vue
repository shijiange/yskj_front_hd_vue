<template>
  <div id="browseRecord">
    <!-- active-color="#d4d4d4" inactive-color="#d4d4d4" -->
    <van-steps :active="active" direction="vertical" class="record-list"  v-if="times.length > 0">
      <van-step class="record-item" v-for="(item, index) in times" :key="index">
        <div class="time-list">
          <div style="display: flex; align-items: center;" @click="showHistorys(index)">
            <div class="time" style="flex: 1; padding-left: 1.3rem;">{{item.time}}</div>
            <div v-if="!item.isShow">
              <span>点击查看记录 </span>
              <van-icon name="arrow-down"></van-icon>
            </div>
            <div v-else>
              <span>收起 </span>
              <van-icon name="arrow-up"></van-icon>
            </div>
          </div>

          <div class="item" v-if="item.isShow">
            <div class="browse-page" v-for="(history, index2) in item.list" :key="index2">
              <div class="header overflow">
                <div class="page-name overflow">{{history.title}}</div>
                <div class="time">{{history.created_at}}</div>
              </div>
              <div class="link overflow">访问  {{history.url}}</div>
              <div class="bottom">
                <div class="type">
                  <span style="padding: 0.1rem 0.4rem;" v-if="history.port_type">{{history.port_type}}</span>
                </div>
                <div class="copy"
                  v-clipboard:copy="history.url"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制链接</div>
              </div>
            </div>
            <div class="load-more" v-if="item.list.length > 0 && !item.load.finished" @click="getHistory">
              加载更多
              <van-icon name="arrow-down"></van-icon>
            </div>
          </div>
        </div>
        <template #active-icon>
          <img src="../../../assets/images/enterprise_wechat/point.png" alt="" style="width: 10px; height: 10px;">
        </template>
        <template #inactive-icon>
          <img src="../../../assets/images/enterprise_wechat/point.png" alt="" style="width: 10px; height: 10px;">
        </template>
      </van-step>
      <van-step class="record-item"></van-step>
    </van-steps>
    <van-empty v-else description="空空如也"></van-empty>
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  data () {
    return {
      active: 0,
      getHistoryUrl: "plugin.wechat-chat-sidebar.frontend.controller.customer.customer.get-history",
      getTimeUrl: "plugin.wechat-chat-sidebar.frontend.controller.customer.customer.history",
      getConfig: { client: "work", type: 17 }, //企业微信公共参数
      times: [],
      history: [],
      timeIndex: '',
      // page: 1,
      // loading: false,
      // finished: false
    };
  },

  mounted () {
    this.getTimeList();
  },
  methods: {
    getTimeList () {
      $http.get(this.getTimeUrl, { ...this.getConfig }, "loading")
        .then(res => {
          if (res.result === 1) {
            if (res.data.time_data.length > 0) {
              res.data.time_data.forEach((item) => {
                this.times.push({
                  time: item,
                  list: [],
                  load: {page: 1, finished: false},
                  isShow: false,
                });
              });
            } else  {
              // this.finished = true;
            }
          } else {
            this.$toast(res.msg);
          }
        });
    },
    showHistorys (index) {
      this.timeIndex = index;
      let historyData = this.times[index];
      historyData.isShow = !historyData.isShow;
      if (!historyData.isShow) {
        return;
      }
      this.getHistory();
    },
    getHistory () {
      let historyData = this.times[this.timeIndex];
      if (historyData.load.finished) {
        this.$$toast('没用更多了');
        return;
      }
      let json = {
        page: historyData.load.page,
        get_time: historyData.time,
      };
      $http.get(this.getHistoryUrl,
        {
          ...json, ...this.getConfig
        }, "loading")
        .then(res => {
          if (res.result === 1) {
            if (historyData.load.page >= res.data.last_page || res.data.data.length < res.data.per_page) {
              historyData.load.finished = true;
            }
            historyData.list = historyData.load.page > 1 ? historyData.list.concat(res.data.data) : res.data.data;
            historyData.load.page = ++historyData.load.page;
          } else {
            this.$toast(res.msg != "" ? res.msg : "暂无数据");
          }
        });
    },
    //复制
    onCopy: function (e) {
      Toast({
        message: "复制成功",
        duration: 1000
      });
    },
    onError: function (e) {
      Toast({
        message: "复制失败",
        duration: 1000
      });
    },
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#browseRecord {
  padding: 1.5rem 0.3rem;
  background-color: #fff;

  .record-list {
    overflow: visible;
    color: #252525;

    .record-item {
      color: #252525 !important;
      text-align: left;
      padding-bottom: 2rem;

      /deep/ .van-step__title {
        color: #252525;
        // margin-top: -20px;
        // transform: translateY(-18px);
      }
    }

    .record-item:nth-of-type(2) {
      /deep/ .van-step__title {
        color: #252525;
        margin-top: 0;
      }
    }
  }

  .browse-page {
    position: relative;
    width: 20.344rem;
    height: 5.563rem;
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.5rem 0.8rem 0.5rem 1.8rem;
    font-size: 12px;
    white-space: nowrap;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("../../../assets/images/enterprise_wechat/step_bg.png");

    .header,
    .bottom {
      display: flex;
      justify-content: space-between;
    }

    .page-name {
      flex: 1;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: bold;

      .time {
        font-size: 12px;
        font-weight: 400;
        color: #989898;
      }
    }

    .type {
      color: #fff;
      border-radius: 0.125rem;
      background-color: #f78b00;
    }

    .copy {
      font-weight: bold;
      color: #f78b00;
    }
  }

  .load-more {
    color: #5f5a5a;
    padding: 0.3rem;
    border-radius: 0.2rem;
    margin-left: 1.3rem;
    background: #f4f4f4;
    text-align: center;
  }
}
</style>