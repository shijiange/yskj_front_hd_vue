<template>
  <div id="work-wechat-index">
    <div class="top-search">
      <van-search v-model="json.keyword" placeholder="请输入商品名称" @search="search" shape="round"></van-search>
    </div>
    <div class="list" v-if="goodsList.length > 0">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="loadMore"
      >
        <div class="goods-item" v-for="(goods) in goodsList" :key="goods.id" @click.stop="toGoodsDetail(goods.id)">
          <div class="left-img">
            <img :src="goods.thumb" alt="">
          </div>
          <div class="right-info overflow">
            <h1 class="goods-title overflow">{{goods.title}}</h1>
            <p class="price">{{$i18n.t('money')}} {{goods.price}}</p>
            <div class="bottom">
              <span class="stock">库存{{goods.stock}}</span>
              <div class="bnt-send" @click.stop="sendGoods(goods)">发送</div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <van-empty v-else description="空空如也"></van-empty>
  </div>
</template>

<script>
export default {
  data () {
    return {
      agentData: { // 企业微信config接口配置
        agent_secret: "",
        agentid: "",
        corpid: ""
      },
      strUrl: "plugin.wechat-chat-sidebar.frontend.controller.customer.home-page.index",
      getConfig: {client: 'work',type: 17}, //企业微信公共参数
      goodsList: [],
      json: {
        page: 1,
        keyword: ''
      },
      loading: false,
      finished: false,
      sendGoodsData: '',
    };
  },

  activated () {
    this.getAgentConfig();
  },
  methods: {
    // 企业微信配置信息
    getAgentConfig() {
      let that = this;
      $http
        .get("plugin.wechat-chat-sidebar.frontend.controller.index.get-config", { url: this.fun.isIosOrAndroid() === "ios" ? window.initUrl : document.location.href }, "loading")
        .then(response => {
          if (response.result === 1) {
            this.agentData = response.data;
            let get_token = response.data.get_token;
            let config = {
              debug: false,
              beta: true,
              jsApiList: ["agentConfig"],
              openTagList: ["ww-open-data"],
              appId: this.agentData.corpid,
              nonceStr: get_token.noncestr,
              timestamp: get_token.timestamp,
              signature: get_token.token
            };
            wx.config(config);
            wx.ready(() => {
              setTimeout(() => {
                that.getAgentSign(config, get_token.app_token);
              }, 500);
            });
            wx.error(res => {
              this.$toast("config信息验证失败！" + JSON.stringify(res));
              // console.log("getAgentConfig：：config信息验证失败！" + JSON.stringify(res));
            });
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(error => {
          console.log("getAgentConfig::", error);
        });
    },
    // 企业微信登录
    getAgentSign(config, app_token) {
      // let that = this;
      wx.agentConfig({
        corpid: config.appId,
        agentid: this.agentData.agentid,
        timestamp: config.timestamp,
        nonceStr: config.nonceStr,
        signature: app_token,
        jsApiList: ["sendChatMessage"],
        success: () => {
          this.getData();
        }
      });
    },
    async getData() {
      if (this.finished && this.loading) {
        return;
      }
      try {
        this.loading = true;
        let res = await $http.get(this.strUrl, { ...this.json, ...this.getConfig }, "loading");
        this.loading = false;
        if (res.result === 1) {
          if (this.json.page >= res.data.last_page || res.data.data.length < res.data.per_page) {
            this.finished = true;
          }
          this.goodsList = this.json.page > 1 ? this.goodsList.concat(res.data.data) : res.data.data;
          this.json.page = ++this.json.page;
        } else {
          this.finished = true;
          this.$toast(res.msg != "" ? res.msg : "暂无数据");
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    search () {
      this.json.page = 1;
      this.loading = false;
      this.finished = false;
      this.getData();
    },
    loadMore () {
      this.getData();
    },
    sendGoods (data) {
      let goods = data;
      wx.invoke('sendChatMessage', {
        msgtype:"news", //消息类型，必填
        enterChat: true, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段
        news:
        {
          link: goods.link, //H5消息页面url 必填
          title: goods.title ? goods.title : '商品', //H5消息标题
          desc: "", //H5消息摘要
          imgUrl: "https://" + goods.thumb, //图片地址 图片地址为必填且要符合网络地址规律
        },
      }, function(res) {
        if (res.err_msg == 'sendChatMessage:ok') {
          //发送成功
          console.log("sendChatMessage::ok", res);
        }
      });
    },
    toGoodsDetail (gid) {
      this.$router.push(this.fun.getUrl("goods", { id: gid }));
    }
  },

  components: {
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#work-wechat-index {
  font-size: 12px;

  .top-search {
    background-color: #fff;
    padding: 0.43rem 0.96rem;
  }

  .list {
    padding: 0.43rem 0.96rem;
    background-color: #f2f2f2;

    .goods-item {
      display: flex;
      align-items: center;
      padding: 0.81rem;
      background-color: #fff;
      border-radius: 0.25rem;

      .left-img {
        width: 4.688rem;
        height: 4.688rem;
        border-radius: 0.25rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .right-info {
        flex: 1;
        text-align: left;
        margin-left: 0.5rem;

        .goods-title {
          font-size: 14px;
          color: #202020;
        }

        .price {
          margin: 0.5rem 0;
          font-size: 0.75rem;
          color: #f14e4e;
        }

        .bottom {
          display: flex;

          .stock {
            flex: 1;
            color: #999;
          }

          .bnt-send {
            color: #fff;
            padding: 0.25rem 1.125rem;
            background-color: #f78b00;
            border-radius: 0.125rem;
          }
        }
      }
    }
  }
}
</style>