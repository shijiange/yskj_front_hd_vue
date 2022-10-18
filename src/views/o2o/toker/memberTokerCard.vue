<template>
  <div id="memberTokerCard">
    <c-title :hide="false" :text="plugin_name"></c-title>
    <div style="width: 100%; height: 1.5rem;"></div>
    <div v-for="(item, index) in list" :key="index">
      <span class="">{{ item.created_at }}</span>
      <div class="list">
        <div class="lis">
          <div class="top">
            <div class="img">
              <img :src="item.card.store.thumb" alt="" />
              <div class="shopname">{{ item.card.store.store_name }}</div>
            </div>
          </div>
          <div class="bottom">
            <div class="left">
              <img :src="item.card.goods.thumb" alt="" />
            </div>
            <div class="right">
              <div class="title">{{ item.card.goods.title }}</div>
              <div class="rightBottom">
                <div class="time" v-for="(info, ind) in item.time_interval" :key="ind" v-show="!fun.isTextEmpty(info.star) || !fun.isTextEmpty(info.end)">
                  核销时间：{{ info.start }}-{{ info.end }}
                </div>
              </div>
            </div>
          </div>
          <div class="btn">
            <div class="isbtn" style="color: #fff; background-color: #f14e4e; margin-left: 0.63rem;" @click="tokerSetMeal(item.id)">套餐详情</div>
            <div class="isbtn" style="color: #fff; background-color: #f14e4e; margin-left: 0.63rem;" v-if="item.write_off" @click="toVerification(item.id)">核销</div>
            <div class="isbtn" style="color: #f14e4e; margin-left: 0.63rem;" @click="shareTap(item.card)">分享</div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 100%; height: 1.5rem;"></div>
  </div>
</template>
<script>
import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";
import { Dialog } from "vant";
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      list: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      plugin_name:''
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    toVerification(kid) {
      this.$router.push(this.fun.getUrl("tokerCode", { id: kid,name:this.plugin_name }));
    },
    tokerSetMeal(kid) {
      this.$router.push(this.fun.getUrl("tokerSetMeal", { id: kid }));
    },
    getData() {
      var that = this;
      $http.get("plugin.customer-development.Frontend.controllers.card.index").then(response => {
        if (response.result === 1) {
          that.list = response.data.data;
          that.plugin_name = response.data.plugin_name?response.data.plugin_name:'拓客卡';
          that.fun.setWXTitle(that.plugin_name?that.plugin_name:'拓客卡');
        } else {
          Toast(response.msg);
        }
      });
    },
    getMoreData() {
      let that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.page >= that.total_page) {
        return;
      } else {
        $http.get("plugin.customer-development.Frontend.controllers.card.index", { page: that.page }).then(response => {
          if (response.result == 1) {
            that.isLoadMore = true;
            that.list.concat(response.data.data);
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        });
      }
    },
    shareTap(item) {
      let that = this;
      let info = item;
      Dialog.confirm({
        // title: "标题",
        message: "请点击右上角分享"
      })
        .then(() => {
          // on confirm
          // that.initShare(info);
          that.fun.wxShare(
            "",
            {},
            {
              title: info.goods.title,
              link:that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/goods/" + info.goods_id + "?i=" + that.fun.getKeyByI(),
              imgUrl: info.goods.thumb,
              description: info.goods.title
            }
          );

        })
        .catch(() => {
          // on cancel
        });
    },
    initShare(info) {
      let that = this;
      let _url = document.location.href;
      let json = { url: _url };
      $http
        .post("member.member.wxJsSdkConfig", json)
        .then(response => {
          if (response.result == 1) {
            if (response.data.config) {
              that.share(response.data, info);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    share(data, info) {
      let that = this;

      wx.config(data.config);
      wx.ready(function () {
        let _title = that.fun.isTextEmpty(info.goods.title) ? data.share.title : info.goods.title;

        let _link = that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/goods/" + info.goods_id + "?i=" + that.fun.getKeyByI();
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(info.goods.thumb) ? data.share.icon : info.goods.thumb;
        let _desc = that.fun.isTextEmpty(info.goods.title) ? data.share.desc : info.goods.title;

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
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
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
      });
    }
  },
  components: {
    cTitle
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#memberTokerCard {
  .list {
    display: flex;
    justify-content: center;
    align-items: center;

    .lis {
      background-color: #fff;
      width: 21.56rem;
      height: 12.94rem;
      border-radius: 0.47rem;
      margin: 0.63rem 0 0.63rem 0;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .btn {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .isbtn {
          width: 4.69rem;
          height: 1.44rem;
          border-radius: 0.72rem;
          border: solid 0.03rem #f14e4e;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.59rem;
        }

        .isbtn:last-child {
          margin-right: 0;
        }
      }

      .bottom {
        display: flex;

        .left {
          width: 5.63rem;
          height: 5.63rem;
          background-color: #d8d8d8;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .right {
          flex: 1;
          margin-left: 0.63rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .rightBottom {
            display: flex;
            justify-content: space-between;

            .time {
              font-size: 0.75rem;
              color: #666;
            }
          }

          .title {
            text-align: left;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            font-size: 0.94rem;
            color: #202020;
          }
        }
      }

      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .img {
          img {
            width: 2.19rem;
            height: 2.19rem;
            background-color: #d8d8d8;
            border-radius: 100%;
          }

          display: flex;
          align-items: center;
          font-size: 0.88rem;

          .shopname {
            font-size: 0.88rem;
            margin-left: 0.5rem;
          }
        }
      }
    }
  }
}
</style>
