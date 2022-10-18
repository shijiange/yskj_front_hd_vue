<!-- 社区团购 订单列表 -->
<template>
  <div id="community_buying-buying_order">
    <c-title :hide="false" text="社区团购"></c-title>
    <van-tabs v-model="activeName" sticky swipeable @change="handleClick">
      <van-tab :title="items" v-for="(items, ind) in titleArr" :key="ind">
        <ul class="content" v-if="!fun.isTextEmpty(dataList[ind].list)">
          <li v-for="(item, index) in dataList[ind].list" :key="index" @click.stop="gotoUrl('communityBuyDetails', { id: item.id })">
            <div class="list">
              <div class="title">{{ item.title }}</div>
              <!-- 开始时间 -->
              <div class="times" v-if="item.group_status == 0">{{ item.start_time }} 开始</div>
              <!-- 结束时间 -->
              <div class="times" v-if="item.group_status == 1">{{ item.end_time }} 结束</div>
              <div class="good-box">
                <div class="good-thumb">
                  <img :src="good.goodThumb" alt="" v-for="good in item.goods" :key="good.id" />
                </div>
                <div class="good-num">
                  共 <em>{{ item.goodsCount }}</em> 件商品
                </div>
              </div>
              <div class="button-box">
                <div class="btn" v-if="item.group_status != 0" @click.stop="gotoUrl('communityBuyOrder', { group_id: item.id })">
                  订单
                </div>
                <div class="btn share-btn" v-if="item.group_status != 2" @click.stop="showShareM(item)">分享</div>
              </div>

              <div class="stauts-box" :class="[item.group_status == 2 ? 'bg-color' : '']" v-if="item.group_status != 0">
                {{ item.status_name }}
              </div>
            </div>
          </li>
        </ul>
        <img v-if="fun.isTextEmpty(dataList[ind].list)" src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem auto;" />
      </van-tab>
    </van-tabs>
    <div class="buying_order-foot set-pc-style" :class="[fun.isIphoneX() ? 'iphoneXStyle' : '']">
      <div class="by-foot-child active-color">
        <i class="iconfont icon-fontclass-huodong"></i>
        <p>活动管理</p>
      </div>
      <div class="by-foot-child" @click.stop="gotoUrl('communityBuyOrder')">
        <i class="iconfont icon-fontclass-dingdanguanli"></i>
        <p>订单管理</p>
      </div>
      <div class="by-foot-child" @click.stop="gotoUrl('communityBuyIndex')">
        <i class="iconfont icon-fontclass-wode"></i>
        <p>我的</p>
      </div>
    </div>

    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    <!-- 海报弹窗 -->
    <van-popup v-model="showposter" position="center" style="background-color: transparent;">
      <img :src="poster_url" alt="" style="width: 16rem;" />
    </van-popup>
    <!-- 微信分享提示 -->
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
  </div>
</template>

<script>
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeGroup: 0,
      deliver_id: 0,
      activeName: 0,
      dataList: [],
      titleArr: [],
      poster_url: null,
      isLoadMore: true,
      showShare: false,
      showposter: false,
      showWechatshar: false,
      options: [
        { name: "复制链接", icon: "link" },
        { name: "生成海报", icon: "poster" },
        { name: "分享给好友", icon: "wechat" }
      ]
    };
  },
  components: { yzWechatShareImg },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    gotoUrl(_url, params = {}) {
      this.$router.push(this.fun.getUrl(_url, params));
    },
    init() {
      this.dataList = [];
      this.titleArr = ["全部活动", "进行中", "未开始", "已结束"];
      this.isLoadMore = true;
      this.setNewArr();
    },
    setNewArr() {
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      this.handleClick();
    },
    handleClick() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }

      $http
        .post("plugin.package-deliver.frontend.communityGroups.groupList", { page: 1, status: this.activeName }, "")
        .then(response => {
          if (response.result === 1) {
            that.deliver_id = response.data.deliver_id;
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.list.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.list.data);
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = {};
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;
        _json.status = that.activeName;
        $http.get("plugin.package-deliver.frontend.communityGroups.groupList", _json, "加载中").then(
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
    showShareM(data) {
      this.activeGroup = data;
      this.showShare = true;
    },
    //分享面板
    onSelect(option) {
      let that = this;
      let _link = this.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/community_buying/buying_personal/" + that.activeGroup.id + "/" + that.deliver_id + "?i=" + this.fun.getKeyByI();
      _link = this.fun.isMid(_link, this.fun.getKeyByMid());
      if (option.name == "复制链接") {
        let message = "邀请您加入社区团购：" + _link;
        this.$copyText(message).then(
          function(e) {
            Toast("复制成功");
            console.log(e);
          },
          function(e) {
            Toast("复制失败");
            console.log(e);
          }
        );
      } else if (option.name == "生成海报") {
        this.getPoster();
      } else if (option.name == "分享给好友") {
        if (this.fun.getTyep() == 5) {
          return;
        } else if (this.fun.getTyep() == 7) {
          this.appSharesinit();
          return;
        }
        this.showWechatshar = true;
        wx.ready(function() {
          let _title = "";
          let _imgUrl = "";
          let _desc = "";
          try {
            _title = that.activeGroup.title;
          } catch (error) {
            console.log(error);
          }
          try {
            _imgUrl = that.activeGroup.share_img;
          } catch (error) {
            console.log(error);
          }
          try {
            _desc = "邀请您加入社区团购";
          } catch (error) {
            console.log(error);
          }
          wx.showOptionMenu();
          wx.onMenuShareTimeline({
            title: _title, // 分享标题
            link: _link, // 分享链接
            imgUrl: _imgUrl, // 分享图标
            success: function() {
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
              Toast("分享成功");
            },
            cancel: function() {
              Toast("取消分享");
            }
          });
        });
      }
    },
    getPoster() {
      $http
        .get("plugin.package-deliver.frontend.communityGroups.getPoster", { group_id: this.activeGroup.id, code_type: 1, get_type: 1, deliver_id: this.deliver_id }, "")
        .then(res => {
          if (res.result == 1) {
            this.poster_url = res.data;
            this.showShare = false;
            this.showposter = true;
          } else {
            Toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //app获取分享数据
    appSharesinit() {
      var that = this;
      var _url = document.location.href;
      var json = {
        url: _url,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function(response) {
          if (response.result == 1) {
            that.appShare(response.data);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare(data) {
      var that = this;
      var _title = this.activeGroup.title;
      let _link = this.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/community_buying/buying_personal/" + that.activeGroup.id + "/" + that.deliver_id + "?i=" + this.fun.getKeyByI();
      _link = this.fun.isMid(_link, data.info.uid);

      var _imgUrl = that.activeGroup.share_img;
      var _desc = "邀请您加入社区团购";
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    }
  }
};
</script>
<style lang="scss" scoped>
#community_buying-buying_order {
  padding-bottom: 80px;

  .content {
    padding: 1rem;
    text-align: left;

    .list {
      background: #fff;
      border-radius: 0.625rem;
      overflow: hidden;
      width: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      padding: 0.875rem;
      margin-bottom: 0.75rem;

      .title {
        width: 80%;
        color: #666;
        margin-bottom: 0.75rem;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }

      .times {
        font-size: 0.75rem;
        color: #f14e4e;
        margin-bottom: 0.75rem;
      }

      .good-box {
        display: flex;
        align-items: center;
        margin-bottom: 2rem;

        .good-thumb {
          width: 70%;
          height: 3.125rem;
          overflow: hidden;

          img {
            width: 3.125rem;
            height: 3.125rem;
            border-radius: 0.375rem;
            overflow: hidden;
            margin-right: 0.625rem;
          }
        }

        .good-num {
          flex: 1;
          font-size: 0.875rem;
          text-align: right;

          em {
            color: #f14e4e;
          }
        }
      }

      .button-box {
        display: flex;
        justify-content: flex-end;

        .btn {
          width: 4.75rem;
          height: 1.5rem;
          line-height: 1.5rem;
          border-radius: 0.75rem;
          border: solid 1px #f14e4e;
          margin-left: 0.875rem;
          text-align: center;
          color: #f14e4e;
        }

        .share-btn {
          color: #fff;
          background: #f14e4e;
        }
      }

      .stauts-box {
        position: absolute;
        width: 6.25rem;
        height: 2rem;
        line-height: 2rem;
        text-align: center;
        color: #fff;
        top: 6px;
        right: -28px;
        font-size: 0.75rem;
        transform: rotate(45deg);
        background: #f14e4e;
      }

      .bg-color {
        background: #a1a1a1;
        color: #fff;
      }
    }
  }

  .buying_order-foot {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 3.125rem;
    background: #fff;
    display: flex;

    .by-foot-child {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      i {
        font-size: 1.25rem;
        color: #8e8e8e;
      }

      p {
        font-size: 0.75rem;
        color: #666;
      }
    }

    .active-color {
      i,
      p {
        color: #f14e4e;
      }
    }
  }

  .iphoneXStyle {
    box-sizing: content-box;
    padding-bottom: 24px;
  }
}
</style>
