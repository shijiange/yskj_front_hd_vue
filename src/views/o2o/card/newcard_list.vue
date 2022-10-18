<template>
  <div id="CardOpenMembershipList">
    <c-title :hide="false" text="开通会员"></c-title>
    <div class="vip_box">
      <div class="img">
        <img :src="has_one_universal_level.thumb_image" />
      </div>
      <ul class="text">
        <li class="text_a">{{member_level.level_name}}</li>
        <li class="text_b">有效期：{{member_level.validity}}天</li>
        <li class="text_c">{{member_level.discount}}折优惠&nbsp;&nbsp;&nbsp;更多特权</li>
      </ul>
    </div>
    <div class="text-left">
      <span>请选择升级商品</span>
    </div>
    <div class="shopbox" v-for="(item,index) in member_goods" :key="index">
      <div class="inbox">
        <div class="shop-photo">
          <img :src="item.thumb" alt />
        </div>
        <div class="minbox">
          <div class="shop-right">
            <div class="shop-right-top">{{item.title}}</div>
            <div class="shop-right-bottom">
              <span>{{item.price}}</span>
              <p>元</p>
            </div>
          </div>
          <div class="checkbox">
            <!-- <div class="check" @click="selectSpecs(index)"></div>
            <van-icon name="checked" v-if="item.checked"></van-icon>-->
            <van-radio-group v-model="radio">
              <van-radio :name="item.id"></van-radio>
            </van-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="btn" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <button type="button" @click="openSubmit()">确定</button>
    </div>
  </div>
</template>
<script>
// import { Toast } from 'vant';
import cTitle from "components/title";
// const OPEN_URL = "";
// const OPEN_INDEX_URL = "plugin.universal-card.api.home.getLevel";
export default {
  data() {
    return {
      member_goods: "",
      member_level: "",
      radio: "",
      has_one_universal_level:''
    };
  },
  activated() {
    console.log(this.$route.params.level_id);
    if (this.fun.isTextEmpty(this.$route.params.level_id)) {
      this.$router.push(this.fun.getUrl("CardOpenMembership", {}));
    }
    this.initData();
    this.getData();
  },

  methods: {
    initData() {
      this.member_goods = "";
      this.member_level = "";
    },
    selectSpecs(e) {
      console.log(e);
    },
    getData() {
      let json = {
        level_id: this.$route.params.level_id
      };
      $http
        .get("plugin.universal-card.api.home.getLevel", json, "加载中")
        .then(res => {
          if (res.result == 1) {
            console.log(res.data);
            this.member_goods = res.data.member_goods;
            this.member_level = res.data.member_level;
            this.has_one_universal_level = res.data.member_level.has_one_universal_level;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    openSubmit() {
      console.log(this.radio);
      //判断升级商品是否有周期，有周期跳转至选择周期,没有周期直接订单页
      if (!this.fun.isTextEmpty(this.$route.params.spec)) {
        this.$router.push(
          this.fun.getUrl("CardChooseMembership", {
            goods_id: this.radio,
            level_id: this.member_level.id
          })
        );
      } else {
        this.$router.push(
          this.fun.getUrl("goodsorder",{}, {
            tag: "-2",
            optionsId: "",
            goodsId: this.radio,
            total: 1
          })
        );
      }
    }
  },
  components: { cTitle }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#CardOpenMembershipList {
  padding-bottom: 1.25rem;

  .btn {
    width: 100%;
    height: 3.5rem;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0.56rem 0 rgba(169, 169, 169, 0.24);
    position: fixed;
    bottom: 0;
    justify-content: center;
    align-items: center;

    button {
      margin: 0.5rem;
      border: none;
      background-color: rgba(59, 59, 79, 1);
      color: #fff;
      border-radius: 0.25rem;
      width: 19.56rem;
      height: 2.5rem;
      font-size: 16px;
    }
  }

  .pcStyle {
    width: 375px;
  }

  .shopbox {
    width: 22.1875rem;
    height: 6.22rem;
    margin: 0.625rem;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 0.16rem;
    overflow: hidden;

    .inbox {
      margin: 0.72rem 0.66rem 0.88rem 0.66rem;
      display: flex;
      justify-content: space-between;

      .shop-photo {
        width: 4.63rem;
        height: 4.63rem;
        margin-right: 0.59rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .minbox {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .shop-right {
          width: 11.41rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;

          .shop-right-top {
            width: 11.41rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            justify-content: space-between;
          }

          .shop-right-bottom {
            width: 11.41rem;
            text-align: left;
            display: flex;
            justify-content: flex-start;
          }
        }

        .checkbox {
          // width: 1rem;
          // height: 1rem;
          margin: 0 auto;

          .check {
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            border: 1px solid #333;
          }
        }
      }
    }
  }

  .text-left {
    text-align: left;
    margin-left: 0.625rem;
  }

  .vip_box {
    width: 22.1875rem;
    border-radius: 0.25rem;
    margin: 0.625rem auto;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 1.25rem 0.875rem;
    position: relative;

    .img {
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 3.75rem;
      background: #ccc;
      overflow: hidden;
      margin-right: 0.625rem;

      img {
        width: 4.5rem;
        height: 4.5rem;
      }
    }

    .text {
      text-align: left;

      .text_a {
        font-size: 18px;
        font-weight: bold;
        line-height: 1.875rem;
      }

      .text_b,
      .text_c {
        font-size: 14px;
        color: #8c8c8c;
        line-height: 1.5rem;
      }
    }

    .btn {
      position: absolute;
      right: 0.625rem;

      button {
        border: none;
        background: #daac5e;
        color: #fff;
        border-radius: 0.25rem;
        width: 5.5rem;
        height: 2.25rem;
        font-size: 16px;
      }
    }
  }
}
</style>
