<!-- 社区团购 团购商品 -->
<template>
  <div id="community_buying-buying_details">
    <c-title :hide="false" text="团购商品"></c-title>
    <div class="top-box">
      <template v-if="this.info.group_status != 2">
        距离活动{{ this.info.group_status ? "结束" : "开始" }}还剩
        <van-count-down :time="time" class="tiem-box" @finish="finishTime">
          <template #default="timeData">
            <span class="block">{{ timeData.days >= 10 ? timeData.days : "0" + timeData.days }}</span>
            <span class="colon"> 天: </span>
            <span class="block"> {{ timeData.hours >= 10 ? timeData.hours : "0" + timeData.hours }}</span>
            <span class="colon"> 时: </span>
            <span class="block"> {{ timeData.minutes >= 10 ? timeData.minutes : "0" + timeData.minutes }}</span>
            <span class="colon"> 分: </span>
            <span class="block"> {{ timeData.seconds >= 10 ? timeData.seconds : "0" + timeData.seconds }}</span>
            <span class="colon"> 秒</span>
          </template>
        </van-count-down>
      </template>
      <template v-else>活动已结束</template>
    </div>
    <div class="other-box">
      <div>商品</div>
      <div>是否参加</div>
    </div>
    <div class="goods-list">
      <div class="goods" v-for="(item, inex) in info.goods" :key="item.id" @click.stop="showGoodPup(item.goods_id)">
        <img class="good-thumb" :src="item.thumb" alt="" />
        <div class="good-right">
          <div class="title">{{ item.title }}</div>
          <div class="goods-purchased"><i class="iconfont icon-fontclass-qian"></i>利润￥{{ item.priceBonus }} <i class="iconfont icon-fontclass-kucun"></i>库存{{ item.stock }}件</div>
          <div class="good-buy">
            <div class="price">
              <em>{{ $i18n.t("money") }}</em> {{ item.price }}
            </div>
            <div class="switch" @click.stop>
              <van-switch v-model="item.checked" size="18px" active-color="#f14e4e" @change="ChangeSwitch(value, item.goods_id, inex)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buying_order-foot set-pc-style" :class="[fun.isIphoneX() ? 'iphoneXStyle' : '']">
      <div class="by-foot-child " @click="showDescription = true">
        <i class="iconfont icon-fontclass-huodongshuoming"></i>
        <p>活动说明</p>
      </div>
      <div class="by-foot-child" @click.stop="gotoUrl('communityBuyOrder', { group_id: $route.params.id })">
        <i class="iconfont icon-fontclass-dingdanguanli"></i>
        <p>订单管理</p>
      </div>
      <div class="by-foot-child" @click.stop="gotoUrl('communityBuyData', { id: $route.params.id })">
        <i class="iconfont icon-fontclass-shuju"></i>
        <p>数据</p>
      </div>
      <div class="by-foot-child " @click.stop="showShare = true">
        <i class="iconfont icon-fontclass-fenxiang"></i>
        <p>分享</p>
      </div>
    </div>
    <!-- 商品详情页弹窗 -->
    <yzGoodsPopup v-model="showgp" :goodsInfo="goodinfo" v-on:showgoodspecs="showgoodspecs"></yzGoodsPopup>

    <van-popup v-model="showDescription" closeable round class="description-popup">
      <div class="description-title">活动说明</div>
      <div class="description-text" v-html="info.description"></div>
    </van-popup>
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
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import yzGoodsPopup from "components/ui_components/yz_goodsPopup";
export default {
  data() {
    return {
      info: {},
      showgp: false,
      deliver_id: 0,
      time: 0,
      showDescription: false,
      checked_status: false,
      showShare: false,
      showposter: false,
      showWechatshar: false,
      goodinfo: {},
      activity_gid: 0,
      options: [
        { name: "复制链接", icon: "link" },
        { name: "生成海报", icon: "poster" },
        { name: "分享给好友", icon: "wechat" }
      ]
    };
  },
  activated() {
    this.getData();
  },
  components: { yzWechatShareImg, yzGoodsPopup },
  computed: {},
  methods: {
    gotoUrl(_url, params = {}) {
      this.$router.push(this.fun.getUrl(_url, params));
    },
    getData() {
      // let that = this;
      $http
        .post("plugin.package-deliver.frontend.communityGroups.groupGoods", { id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            this.deliver_id = response.data.deliver_id;
            this.info = response.data.group;
            if (this.info.group_status == 0) {
              this.time = new Date(this.info.start_time.replace(/-/g, "/")).getTime() - new Date().getTime();
            } else if (this.info.group_status == 1) {
              this.time = new Date(this.info.end_time.replace(/-/g, "/")).getTime() - new Date().getTime();
            }
            this.info.goods.forEach(item => {
              item.checked = item.status == 0 ? false : true;
            });
          } else {
            this.$dialog
              .confirm({ message: response.msg })
              .then(() => {
                this.$router.push(this.fun.getUrl("SelfCarryApply", {}));
              })
              .catch(() => {
                this.$router.push(this.fun.getUrl("home", {}));
              });
            // Toast(response.msg)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    showGoodPup(_id) {
      if (this.activity_gid == _id) {
        this.showgp = true;
        return;
      }
      this.activity_gid = _id;
      $http
        .get("plugin.overseas.frontend.goods.get-goods-page", { id: Number(_id) }, ".")
        .then(res => {
          if (res.result == 1) {
            this.goodinfo = res.data.get_goods;
            this.goodinfo.end_time = this.fun.getTimestamp(this.info.end_time);
            if (res.data.get_goods.content) {
              let str = this.goodinfo.content.replace(/src=\"http:/gi, 'src="https:');
              this.goodinfo.content = str;
            } else {
              this.goodinfo.content = "暂无该商品详情";
            }
            setTimeout(() => {
              this.showgp = true;
            }, 800);
          } else {
            Toast(res, msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    ChangeSwitch(value, id, index) {
      $http
        .get("plugin.package-deliver.frontend.communityGroups.banGoods", { group_id: this.$route.params.id, goods_id: id }, "")
        .then(response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.checked_status = this.info.goods[index].checked;
            this.$delete(this.info.goods[index], "checked");
            this.$set(this.info.goods[index], "checked", this.checked_status);
            this.info.goods[index].checked = this.checked_status;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //分享面板
    onSelect(option) {
      let that = this;
      let _link = this.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/community_buying/buying_personal/" + that.info.id + "/" + that.deliver_id + "?i=" + this.fun.getKeyByI();
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
          this.appShare();
          return;
        }
        this.showWechatshar = true;
        wx.ready(function() {
          let _title = "";
          let _imgUrl = "";
          let _desc = "";
          try {
            _title = that.info.title;
          } catch (error) {
            console.log(error);
          }
          try {
            _imgUrl = that.info.share_img;
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
        .get("plugin.package-deliver.frontend.communityGroups.getPoster", { group_id: this.info.id, code_type: 1, get_type: 1, deliver_id: this.deliver_id }, "")
        .then(res => {
          if (res.result == 1) {
            this.poster_url = res.data;
            this.showShare = false;
            this.showposter = true;
          } else {
            Toast(res, msg);
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
      let uid = window.localStorage.getItem("uid");
      var that = this;
      var _title = that.info.title;

      let _link = this.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/community_buying/buying_personal/" + that.info.id + "/" + that.deliver_id + "?i=" + this.fun.getKeyByI();
      _link = this.fun.isMid(_link, uid);

      var _imgUrl = that.info.share_img;
      var _desc = "邀请您加入社区团购";
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#community_buying-buying_details {
  padding-bottom: 80px;

  .top-box {
    padding: 2.5rem 1rem;
    background-color: #f14e4e;
    color: #fff;
    font-size: 1rem;
    display: flex;

    .tiem-box {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-left: 0.5rem;

      .block {
        width: 1.5rem;
        height: 1.5rem;
        line-height: 1.5rem;
        border-radius: 50%;
        overflow: hidden;
        background: #fff;
        color: #f14e4e;
        display: block;
      }
    }
  }

  .other-box {
    height: 3rem;
    line-height: 3rem;
    color: #333;
    font-weight: bold;
    font-size: 1.125rem;
    display: flex;
    justify-content: space-between;
    padding: 0 0.938rem;
  }

  .goods-list {
    padding: 0 0.938rem;

    .goods {
      background: #fff;
      border-radius: 0.625rem;
      overflow: hidden;
      padding: 0.75rem;
      display: flex;
      margin-bottom: 0.625rem;

      .good-thumb {
        width: 7rem;
        height: 7rem;
        border-radius: 0.375rem;
        margin-right: 0.75rem;
      }

      .good-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .title {
          line-height: 1.5rem;
          height: 3rem;
          font-size: 0.938rem;
          font-weight: bold;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .goods-purchased {
          display: flex;
          font-size: 0.75rem;
          align-items: center;

          i {
            color: #ff7c48;
            font-size: 0.875rem;
          }

          .icon-fontclass-kucun {
            font-size: 1.25rem;
            margin-left: 0.935rem;
          }
        }

        .good-buy {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .price {
            color: #f14e4e;
            font-size: 1.125rem;
            font-weight: bold;

            em {
              font-size: 0.75rem;
            }
          }
        }
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

  .description-popup {
    width: 80%;

    .description-title {
      height: 3.75rem;
      width: 100%;
      line-height: 3.75rem;
      font-size: 1.25rem;
      color: #000;
    }

    .description-text {
      height: 16rem;
      overflow-y: scroll;
      padding: 0.875rem;

      /deep/img {
        max-width: 100%;
        height: auto;
        object-fit: contain;
      }
    }
  }
}
</style>
