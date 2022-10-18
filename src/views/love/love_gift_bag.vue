<template>
  <div :class="['love-gift-bag', {'pcStyle':fun.getPhoneEnv() == 3}]">
    <c-title :text="recordInfo.love_name"></c-title>

    <div class="content img-con">
      <h2 class="message">可领取红包数量<span class="num">{{num('can_total')}}</span>个</h2>
      <div :class="['btn-receive', {'grey': (this.recordInfo.can_total <= 0 || !pageLoad)}]" @click="showPopup">立即领取</div>
      <div class="history">
        <div class="total">
          <p class="num">{{num('stored_total')}}</p>
          <p>累计获得数量</p>
        </div>
        <div class="received">
          <p class="num">{{num('gain_total')}}</p>
          <p>已领取数量</p>
        </div>
        <div class="invalid">
          <p class="num">{{num('past_total')}}</p>
          <p>已过期数量</p>
        </div>
      </div>
    </div>
    <div class="record-list">
      <van-tabs
        v-model="tabActive"
        color="#af1319"
        title-inactive-color="#ffffff"
        title-active-color="#af1319"
        @change="switchTab"
      >
        <van-tab name="2" title="领取记录" title-class="nav"></van-tab>
        <van-tab name="-1" title="过期红包" title-class="nav"></van-tab>
      </van-tabs>

      <van-list
        v-if="recordList.length > 0"
        @load="getData"
        :finished="finished"
        :loading="loading"
        offset="0"
        finished-text="没有更多了"
        class="listContent"
      >
        <div class="item" v-for="(item, index) in recordList" :key="index">
          <div class="time">{{item.date}}</div>
          <div class="value">
            <span :class="[{'text-red': valueColor(item.love)}]">
              {{ item.love }}
            </span> {{recordInfo.love_name}}</div>
        </div>
      </van-list>

      <div class="empty" v-else>
        <img src="../../assets/images/blank.png" />
        <div class="text">还没有记录哦</div>
      </div>

    </div>


    <van-popup v-model="showDialog" round @close="onClose">
      <div class="popup-content img-con">
        <h2 class="message">{{redpack.msg}}</h2>
        <span class="money">{{redpack.love || 0}}</span>
        <div class="btn-confirm" @click="onClose">确定</div>
      </div>
    </van-popup>

    <audio id="myaudio" hidden="true" preload :src="audio.voice_link ? audio.voice_link : ''">
    </audio>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data () {
    return {
      tabActive: '2',
      isReceive: false,
      showDialog: false,
      recordList: [],
      recordInfo: {},

      loading: false,
      finished: false,
      page: 1,

      redpack: {},
      audio: '',
      timer: null, // 定时器
      pageLoad: false, // 页面是否加载完成
    };
  },

  computed: {
    num() {
      return (type) => {
        return this.recordInfo[type] ? this.recordInfo[type] : 0;
      };
    },
    valueColor() {
      return (value) => {
        return (value * 1 > 0);
      };
    },
  },

  mounted () {
    this.myAuto = document.getElementById("myaudio");
  },

  async activated () {
    this.initData();
    this.getData();
    await this.getAudio();
    this.timer = setInterval(() => {
      if (document.readyState === 'complete') {
        this.pageLoad = true;
        clearInterval(this.timer);
      }
    }, 500);
  },
  deactivated () {
    clearInterval(this.timer);
  },

  methods: {
    switchTab () {
      this.initData();
      this.getData();
    },
    async getData () {
      if (this.finished || this.loading) {
        return;
      }
      this.loading = true;
      let res = await $http.get(
        'plugin.love-redpack.frontend.redpack.homePage',
        {status: this.tabActive, page: this.page},
        "加载中"
      );
      this.loading = false;
      if (res.result !== 1) {
        this.$dialog.alert( {message: res.msg});
        return;
      }
      let data = res.data.list;
      this.recordInfo = res.data;
      if (data.last_page === this.page || data.data.length < data.per_page) {
        this.finished = true;
      }
      if (this.page > 1 && data.current_page > 1) {
        this.recordList = this.recordList.concat(data.data);
      } else {
        this.recordList = data.data;
      }
      this.page++;
      this.isReceive = !(res.data.can_total > 0);
      document.title = res.data.love_name;
    },

    async getAudio () {
      let res = await $http.get(
        'plugin.love-redpack.frontend.voice.index',
        {},
        ""
      );
      if (res.result !== 1) {
        Toast(res.msg);
        return 0;
      }
      this.audio = res.data;
      return 1;
    },

    async getRedpack () {
      let res = await $http.get(
        'plugin.love-redpack.frontend.redpack.getRedpack',
        {},
        "正在领取"
      );
      if (res.result !== 1) {
        this.$dialog.alert( {message: res.msg});
        return res.result;
      }
      this.redpack = res.data;
      return res.result;
    },
    async showPopup() {
      if (this.recordInfo.can_total <= 0 || !this.pageLoad) return;
      let res = await this.getRedpack();
      if (res !== 1) return;
      if (this.myAuto && this.audio.is_open) {
        this.myAuto.currentTime = 0;
        this.myAuto.play();
      }
      this.recordInfo.can_total = this.recordInfo.can_total - 1;
      this.showDialog = true;
    },
    onClose () {
      this.myAuto.pause();
      this.initData();
      this.getData();
      this.showDialog = false;
    },

    initData () {
      this.isReceive = false;
      this.showDialog = false;
      this.recordList = [];
      this.loading = false;
      this.finished = false;
      this.page = 1;
    },

  },

  components: {
    cTitle,
  },
};

</script>
<style lang='scss' rel='stylesheet/scss'>
.nav {
  background: #ffc910 !important;
}

.img-con {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.love-gift-bag {
  padding-bottom: 1rem;
  background: linear-gradient(to top, #af1219, #e53b24);

  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: auto;
    height: 30.47rem;
    background-image: url("../../assets/images/love_gift_bag/gift_bag_bg.png");
    overflow: hidden;
    padding: 0 2.09rem 1.3rem 2.09rem;

    .message {
      max-width: 14rem;
      margin: 0 auto;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      margin-top: 17.5rem;
      overflow: hidden;
      font-size: 1.13rem;
      letter-spacing: 0.11rem;
      color: #fff;
    }

    .num {
      font-size: 1.13rem;
      color: #ffe177;
    }

    .btn-receive {
      width: 4.41rem;
      height: 4.41rem;
      margin: 0 auto;
      background-image: linear-gradient(180deg, #fcd343 0%, #ff8e09 100%), linear-gradient(#f13140, #f13140);
      box-shadow: 0 0.28rem 1.25rem 0 rgba(189, 23, 35, 0.6);
      border-radius: 2.19rem;
      font-size: 1rem;
      font-weight: bold;
      letter-spacing: 0.1rem;
      color: #af1319;
      word-break: break-all;
      padding: 0.8rem 1rem;
    }

    .grey {
      background-image:
        linear-gradient(
          #e2e2e2,
          #e2e2e2
        ),
        linear-gradient(
          180deg,
          #fcd343 0%,
          #ff8e09 100%
        ),
        linear-gradient(
          #c1c1c1,
          #c1c1c1
        );
      color: #8e8e8e;
    }

    .history {
      width: 16.5rem;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      font-size: 0.69rem;
      color: #fff;
    }
  }

  .record-list {
    width: 20.94rem;
    height: 12.63rem;
    margin: 1rem auto;
    background-color: #f2f2f2;
    border-radius: 0.47rem;
    box-shadow: 0 -5px 0 #eaa01b;
    overflow: hidden;

    .listContent {
      height: 9.5rem;
      overflow-y: scroll;
    }

    .item {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      padding: 0 0.5rem;

      .time {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: left;
      }

      .love {
        color: green;
      }

      .text-red {
        color: red;
      }
    }
  }
}

.van-popup {
  background: transparent;
}

.popup-content {
  display: inline-block;
  width: 19.66rem;
  height: 24.78rem;
  background-image: url("../../assets/images/love_gift_bag/gift_bag.png");

  .message {
    margin: 0 auto;
    width: 12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 1.13rem;
    margin-top: 13rem;
    color: #fff;
  }

  .money {
    display: inline-block;
    margin: 1.5rem auto;
    font-size: 2.25rem;
    font-weight: bold;
    color: #feffb3;
  }

  .btn-confirm {
    width: 12.5rem;
    height: 2.38rem;
    margin: 0 auto;
    border-radius: 1.18rem;
    line-height: 2.38rem;
    background-image:
      linear-gradient(
        0deg,
        #ffda53 0%,
        #ffef93 100%
      );
    box-shadow: 0 3px 1px #ff6b25;
  }
}

.empty {
  padding: 2rem 0 4rem 0;

  img {
    width: 4rem;
    height: 4rem;
  }

  .text {
    margin-top: 15px;
    color: #ccc;
    font-size: 14px;
  }
}

.pcStyle {
  width: 375px;
}

</style>