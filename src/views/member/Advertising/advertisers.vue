<!-- 广告投放 广告主 -->
<template>
  <div id="advertisers">
    <c-title :hide="false" text="广告主"></c-title>
    <div class="top-box">
      <div class="member-info" v-if="info.has_one_member">
        <img :src="info.has_one_member.avatar_image" alt="" />
        <div class="member-name">{{ info.has_one_member.nickname }}</div>
      </div>
      <div class="release-btn" @click="gotoUrl('advertisingRelease')">
        <div class="iconfont icon-life-game-plus"></div>
        发布广告
      </div>
    </div>
    <div class="main">
      <van-tabs v-model="activeName" @click="onClick" sticky offset-top="40" :ellipsis="false">
        <van-tab :title="items.name" v-for="(items, ind) in titleArr" :key="ind">
          <div class="statistics-table" v-show="titleArr[ind].code == 'video' || titleArr[ind].code == 'live'">
            <div class="table-num">
              <div class="nums">{{ statistical.browse_total || "--" }}</div>
              <div>累计总播放量</div>
            </div>
            <div class="table-num">
              <div class="nums">{{ statistical.share_total || "--" }}</div>
              <div>累计总分享量</div>
            </div>
            <div class="table-num">
              <div class="nums">{{ statistical.reward_amount_total || "--" }}</div>
              <div>累计广告金额</div>
            </div>
            <div class="table-num">
              <div class="nums">{{ statistical.reward_amount || "--" }}</div>
              <div>累计已奖励金额</div>
            </div>
          </div>
          <van-sticky offset-top="84">
            <div class="content-title">
              <div>{{ titleArr[ind].code == "audit" ? "我的广告" : titleArr[ind].code == "video" ? "我的视频订单" : "我的直播订单" }}</div>
              <van-popover v-model="titleArr[ind].isPopover" trigger="click" :actions="actions" @select="onSelect" get-container="#advertisers">
                <template #reference> {{ popover_text }}<i class="iconfont icon-member-bottom"></i> </template>
              </van-popover>
            </div>
          </van-sticky>

          <!-- v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)" -->
          <div class="content">
            <template v-if="titleArr[ind].code == 'audit'">
              <div class="li audit-class" v-for="(item, index) in dataList[0].list" :key="index">
                <div class="li-img">
                  <img :src="item.video_cover" alt="" />
                </div>
                <div class="ad-li-right has-turn-down-box">
                  <div class="advertisers-title audit-class-title">
                    <div class="advertisers-status">{{ item.status_text }}</div>
                    <div style="display: inline-block;">{{ item.title }}</div>
                  </div>
                  <div class="turn-down-box" v-if="item.status == -1">驳回原因：{{ item.rejection_details }}</div>
                </div>
              </div>
            </template>
            <template v-if="titleArr[ind].code == 'video' || titleArr[ind].code == 'live'">
              <div class="li video-class" v-for="(item, index) in dataList[ind].list" :key="index">
                <div class="li-img">
                  <img :src="item.video_cover" alt="" />
                </div>
                <div class="ad-li-right">
                  <div class="advertisers-title">
                    <div class="advertisers-status">{{ item.status_text }}</div>
                    <div style="display: inline-block;">{{ item.title }}</div>
                  </div>
                  <div class="other">
                    广告金额：
                    <div class="size-color1">￥{{ item.reward_amount_total }}</div>
                  </div>
                  <div class="other">
                    已奖励金额：
                    <div class="size-color1">￥{{ item.reward_amount }}</div>
                  </div>
                  <div class="other">
                    播放量：
                    <div class="size-color2">{{ item.browse_total }}</div>
                  </div>
                  <div class="other">
                    分享量：
                    <div class="size-color2">{{ item.share_total }}</div>
                    <div class="btn-detail size-color1" @click="gotoUrl('advertisingAdDetails', { id: item.id })">查看详情 <i class="iconfont icon-member_right"></i></div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <yz-blank :datas="dataList[ind] && dataList[ind].list"></yz-blank>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { Toast, Popover } from "vant";
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
export default {
  mixins: [scrollMixin], //加载更多

  data() {
    return {
      statistical: {},
      popover_text: "全部",
      actions: [{ text: "全部" }],
      info: {},
      status: 0, //状态
      activeName: 0,
      dataList: [],
      titleArr: [
        {
          name: "广告审核",
          code: "audit",
          isPopover: false
        }
      ],
      isLoadMore: true
    };
  },

  // activated: {},

  components: {
    "van-popover": Popover,
    "yz-blank": yzBlank
  },

  computed: {},

  created() {
    this.init();
    this.getData();
  },

  methods: {
    gotoUrl(name, params = {}) {
      this.$router.push(this.fun.getUrl(name, params));
    },
    getData() {
      $http
        .get("plugin.ad-serving.frontend.advertisers.index.memberInfo", {}, "")
        .then(response => {
          if (response.result === 1) {
            this.info = response.data.info;
            let plugins_status = response.data.plugins_status;
            if (plugins_status.video_share) {
              //视频分享插件开启
              this.titleArr.push({
                name: "视频订单",
                code: "video",
                isPopover: false
              });
              this.dataList.push({
                isLoadMore: true,
                page: 1,
                total_page: 0,
                list: [],
                url: "plugin.ad-serving.frontend.advertisers.index.getOrderInfo"
              });
            }
            if (plugins_status.room) {
              //直播插件开启
              this.titleArr.push({
                name: "直播订单",
                code: "live",
                isPopover: false
              });
              this.dataList.push({
                isLoadMore: true,
                page: 1,
                total_page: 0,
                list: [],
                url: "plugin.ad-serving.frontend.advertisers.index.getOrderInfo"
              });
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    init() {
      this.activeName = 0;
      this.dataList = [
        {
          isLoadMore: true,
          page: 1,
          total_page: 0,
          url: "plugin.ad-serving.frontend.advertisers.index.advertisingCheck",
          list: []
        }
      ];
      this.isLoadMore = true;
      this.handleClick();
    },
    changeActions() {
      if (this.activeName == 0) {
        this.actions = [
          { text: "全部", className: "Popover-self-style" },
          { text: "待审核", className: "Popover-self-style" },
          { text: "通过", className: "Popover-self-style" },
          { text: "驳回", className: "Popover-self-style" }
        ];
      } else {
        this.actions = [
          { text: "全部", className: "Popover-self-style" },
          { text: "投放中", className: "Popover-self-style" },
          { text: "下架", className: "Popover-self-style" }
        ];
      }
    },
    onClick() {
      this.popover_text = "全部";
      this.handleClick();
    },
    handleClick(_status) {
      this.changeActions();
      let Json = {};
      console.log("1111111111111111111111", _status);
      if (_status) {
        Json.status = Number(_status);
        this.status = _status;
      } else {
        this.status = 0;
      }
      if (this.titleArr[this.activeName].code == "video") {
        Json.put_in_type = 2; //1-直播间，2-短视频，不传默认直播间
      }
      $http
        .post(this.dataList[this.activeName].url, Json, "...")
        .then(response => {
          if (response.result === 1) {
            if (response.data.statistical) this.statistical = response.data.statistical;
            this.isLoadMore = true;
            this.$set(this.dataList[this.activeName], "isLoadMore", true);
            this.$set(this.dataList[this.activeName], "total_page", response.data.list.last_page);
            if (!this.dataList[this.activeName].total_page) {
              this.$set(this.dataList[this.activeName], "total_page", 0);
              this.dataList[this.activeName].total_page = 0;
            }
            this.$set(this.dataList[this.activeName], "list", response.data.list.data);
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMoreData() {
      const that = this;
      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = {};
        _json.status = this.status;
        if (this.titleArr[this.activeName].code == "video") {
          _json.put_in_type = 2; //1-直播间，2-短视频，不传默认直播间
        }
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get(that.dataList[that.activeName].url, _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.list.data;
              that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(myData); //数组拼接
            } else {
              that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
              that.dataList[that.activeName].isLoadMore = false;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    onSelect(e, index) {
      this.popover_text = e.text;
      switch (index) {
        case 0:
          this.handleClick(); //全部
          break;
        case 1:
          if (this.titleArr[this.activeName].code != "audit") {
            this.handleClick("1"); //直播、视频的投放中
          } else {
            this.handleClick("0"); //广告审核的待审核
          }
          break;
        case 2:
          if (this.titleArr[this.activeName].code != "audit") {
            this.handleClick("0"); //直播、视频的下架
          } else {
            this.handleClick("1"); //广告审核的通过
          }
          break;
        case 3:
          this.handleClick("-1"); //广告审核的驳回
          break;
        default:
          this.handleClick(); // 全部
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#advertisers {
  .top-box {
    height: 11.375rem;
    padding: 1.406rem 0 1.656rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/ad-serving/ad-serving-bg1.png");
    background-size: 100% 100%;

    .member-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      width: 80%;
      text-align: center;

      img {
        width: 2.5rem;
        height: 2.5rem;
        background-color: #bbb;
        border: solid 1px #fff;
        overflow: hidden;
        border-radius: 50%;
      }

      .member-name {
        font-size: 1.125rem;
        line-height: 1.5rem;
        color: #fff;
        width: 100%;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }
    }

    .release-btn {
      color: #fff;
      width: 9.375rem;
      height: 2.188rem;
      line-height: 2.188rem;
      background-color: #ee2e2b;
      border-radius: 0.188rem;
      display: flex;
      text-align: center;
      justify-content: center;

      .iconfont {
        padding-right: 0.5rem;
      }
    }
  }

  .main {
    background: #fff;

    .statistics-table {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 90%;
      height: 8.75rem;
      background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/ad-serving/ad-serving-bg2.png");
      background-size: 100% 100%;
      margin: 1rem auto 0;
      border-radius: 0.75rem;
      overflow: hidden;
      align-items: center;
      color: #75562b;

      .nums {
        font-size: 20px;
        font-weight: 600;
      }
    }

    .content-title {
      height: 3rem;
      line-height: 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      padding: 0 1rem 0 0.875rem;
    }

    .content {
      padding: 0 0.875rem;
    }

    .li {
      display: flex;
      padding-bottom: 0.75rem;

      .li-img {
        width: 5rem;
        height: 5.938rem;
        background-color: #a6a6a6;
        border-radius: 0.313rem;
        overflow: hidden;
        flex-shrink: 0;
        margin-right: 0.625rem;

        img {
          width: 100%;
          height: 100%;
          object-fit: fill;
          display: block;
        }
      }

      .ad-li-right {
        flex: 1;
        overflow: hidden;
        padding-top: 0.375rem;
        text-align: left;

        .advertisers-title {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          text-align: left;

          .advertisers-status {
            font-size: 11px;
            display: inline-grid;
            width: 2.813rem;
            text-align: center;
            line-height: 1.156rem;
            height: 1.156rem;
            background-color: #ee2e2b;
            border-radius: 0.125rem;
            margin: 0;
            color: #fff;
            margin-right: 0.5rem;
          }
        }

        .audit-class-title {
          -webkit-line-clamp: 2;
        }

        .other {
          width: 100%;
          margin-top: 0.625rem;
          display: flex;
          color: #666;
          font-size: 12px;
          line-height: 12px;

          .size-color1 {
            color: #ee2e2b;
          }

          .size-color2 {
            color: #da9114;
          }

          .btn-detail {
            flex: 1;
            text-align: right;
          }
        }
      }

      .has-turn-down-box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #666;
        overflow: hidden;

        .turn-down-box {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 10px;
        }
      }
    }
  }

  .clearfix::after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .clearfix {
    /* 触发 hasLayout */
    zoom: 1;
  }

  /deep/.Popover-self-style {
    width: 74px;
    height: 34px;
    font-size: 12px;
    padding: 0 8px;
  }
}
</style>
