<!--  -->
<template>
  <div id="warehouse-farm-giftDetail">
    <c-title :hide="false" text="礼物详情"></c-title>
    <div class="bg">
      <div class="member-info">
        <img class="avatar" :src="info.avatar || ''" alt="" />
        <div class="nickname">{{ info.nickname || "" }}</div>
        发起的礼包
      </div>
    </div>

    <div class="list-item">
      <img class="good-img" :src="goods.thumb" alt="" />
      <div class="item-right">
        <div class="title">{{ goods.title }}</div>
        <div class="good-info">
          <div class="stock">库存：{{ goods.nums }}</div>
        </div>
      </div>
    </div>

    <div class="receive_detail" v-if="mode != 'creat'">{{ receive_detail }}</div>
    <div class="recipient" v-if="received_info">
      <div class="member" v-for="(item, index) in received_info" :key="index">
        <img class="avatar" :src="item.has_one_member && item.has_one_member.avatar" alt="" />
        <div class="member-nickname">
          <div class="nickname">{{ item.has_one_member && item.has_one_member.nickname }}</div>
          <div class="time">{{ item.updated_at }}</div>
        </div>
        <div class="status">已领取 X{{ item.nums }}</div>
      </div>
    </div>

    <div class="share-box set-pc-style" v-if="!isReceived">
      <van-button type="primary" round block color="#ff464c" @click="showshareFn">分享</van-button>
    </div>

    <div class="collection-record" v-if="mode == 'give'" @click.stop="toUrl">查看我的领取记录</div>
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
  </div>
</template>

<script>
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
export default {
  data() {
    return {
      shareOptions: {}, //分享配置
      receive_detail: "", //领取详情
      info: {},
      goods: {},
      received_info: [], //领取人信息
      received_time: null, //领取时间
      isReceived: true, //是否已领取
      showWechatshar: false,
      mode: null //当前模式（creat：创建礼物赠送||receiving or getgift: 领取别人礼物）
    };
  },

  activated() {
    if (this.$route.params.mode) this.mode = this.$route.params.mode;
    this.getData();
  },

  components: { yzWechatShareImg },

  computed: {},

  mounted() {},

  methods: {
    getData() {
      let _url = ""; //请求api
      let _json = {}; //请求参数
      let apiConfig = new Map([
        ["creat", "plugin.warehouse.frontend.controllers.gift.give"],
        ["receiving", "plugin.warehouse.frontend.controllers.gift.records.detail"],
        ["getgift", "plugin.warehouse.frontend.controllers.gift.records.detail"],
        ["give", "plugin.warehouse.frontend.controllers.gift.give.receive"]
      ]);

      if (apiConfig.has(this.mode)) {
        //先通过has()判断apiConfig是否给key
        _url = apiConfig.get(this.mode); //获取key(即this.orderType)设置的api集合
      }

      if (this.mode == "creat") {
        //创建礼物赠送页面进入
        if (!this.$route.params.gid) {
          this.$router.go(-1);
          return;
        }
        _json = {
          goods_id: this.$route.params.gid,
          nums: this.$route.params.nums,
          share_num: this.$route.params.sNum
        };
        this.isReceived = false; //显示分享按钮
      } else if (this.mode == "receiving" || this.mode == "getgift") {
        // 从礼物查看记录进入的
        _json = {
          gift_type: this.mode == "getgift" ? "get" : "",
          records_id: this.$route.query.records_id //记录id
        };
      } else if (this.mode == "give") {
        // 从分享链接进入的
        _json = {
          gift_key: this.$route.query.id //礼包码
        };
      }
      $http
        .get(_url, _json, ".")
        .then(response => {
          if (response.result === 1) {
            let _shareInfo = {
              title: (response.data.share_info && response.data.share_info.title) || "赠送礼物",
              imgUrl: (response.data.share_info && response.data.share_info.thumb) || null,
              description: (response.data.share_info && response.data.share_info.detail) || null
            };
            if (this.mode == "creat") {
              this.setInfo(response.data.info, response.data.goods);
              _shareInfo.link = this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/warehouseFarm/index?i=" + this.fun.getKeyByI() + "&markId=" + response.data.mark_id;
            } else if (this.mode == "receiving" || this.mode == "getgift") {
              this.receive_detail = response.data.detail;
              this.setInfo(response.data.record.has_one_give, response.data.record.has_one_goods, response.data.record.has_many_receive);
              this.received_time = response.data.record.updated_at;
              this.goods.nums = response.data.record.goods_num;
              if (response.data.record.status == 0) {
                this.isReceived = false; //显示分享按钮
                _shareInfo.link = this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/warehouseFarm/index?i=" + this.fun.getKeyByI() + "&markId=" + response.data.record.mark_id;
              }
            } else if (this.mode == "give") {
              this.receive_detail = response.data.detail;
              this.setInfo(response.data.record.has_one_give, response.data.record.has_one_goods, response.data.record.has_many_receive);
              this.received_time = response.data.record.updated_at;
              this.goods.nums = response.data.record.goods_num;
            }
            this.shareOptions = _shareInfo;
            this.fun.wxShare("", { mid: this.fun.getKeyByMid() }, _shareInfo);
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showshareFn() {
      if (this.fun.getTyep() == 1) {
        this.showWechatshar = true;
      } else if (this.fun.getTyep() == 7) {
        this.appSharesinit();
      }
    },
    appSharesinit() {
      let _data = this.shareOptions;
      YDB.Share(_data.title, _data.description, _data.imgUrl, _data.link, "Sharesback");
    },
    setInfo(_info, _goods, _received) {
      if (_info) this.info = _info;
      if (_goods) this.goods = _goods;
      if (_received) this.received_info = _received;
    },
    toUrl() {
      this.$router.replace(this.fun.getUrl("warehouseFarmGiftLog", { tag: 1 }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#warehouse-farm-giftDetail {
  .bg {
    height: 8.125rem;
    background-image: linear-gradient(to right, #f9874b, #fd692e);
    color: #fff;
    padding: 1.625rem 1.125rem 0;
  }
  .member-info {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
    .avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      margin: 0;
    }
    .nickname {
      margin: 0 0.875rem;
    }
  }
  .receive_detail {
    padding: 0.5rem 0.875rem 0;
    text-align: left;
    color: #999;
  }
  .list-item {
    display: flex;
    width: 92%;
    margin: -2.875rem auto 0;
    background: #fff;
    padding: 0.625rem;
    border-radius: 0.375rem;
    .good-img {
      width: 4.625rem;
      height: 4.625rem;
      background-color: #9d9d9d;
      border-radius: 0.375rem;
      margin-right: 0.625rem;
    }
    .item-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      .title {
        font-size: 15px;
        color: #2c2c2c;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .good-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .stock {
          color: #8a8a8a;
          font-size: 10px;
        }
        .button {
          .icon-zb_all_share {
            color: #ec8f35;
            font-size: 20px;
          }
        }
      }
    }
  }
  .recipient {
    padding: 1rem;
    background: #fff;
    margin-top: 1rem;
    .member {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .avatar {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        margin: 0;
        flex-shrink: 0;
      }
      .member-nickname {
        margin: 0 0.5rem;
        text-align: left;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        .nickname {
          overflow: hidden; /*超出部分隐藏*/
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /*规定段落中的文本不进行换行 */
        }
        .time {
          color: #8a8a8a;
          font-size: 10px;
        }
      }
      .status {
        color: #ff464c;
      }
    }
  }
  .share-box {
    padding: 0 1.375rem 0.938rem;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .collection-record {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 1rem;
    color: #ff464c;
  }
}
</style>
