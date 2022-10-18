<!-- 广告中心 - 广告管理 -->
<template>
  <div id="deviceManger">
    <c-title :hide="false"
             text="广告管理"></c-title>
    <div class="top_member">
      <!-- 用户信息 -->
      <img :src="StoreInfo.store_thumb"
           alt="" />
      <div class="name">
        {{ StoreInfo.store_name }}
      </div>
    </div>
    <div class="title">投放中的广告数量:{{ totalNum }}个</div>
    <van-checkbox-group v-model="result"
                        class="content">
      <van-cell-group>
        <van-cell v-for="(item, index) in list"
                  clickable
                  :key="item.id"
                  @click="toggle(index)"
                  class="saa">
          <template slot="title">
            <div class="co">
              <img v-if="item.advert_type==1"
                   :src="item.advert_img_url"
                   alt="" />
              <img v-if="item.advert_type==2"
                   src="../../../assets/images/agreen_video@2x.png"
                   alt="" />
              <div class="detailMain">
                <div class="titletwo">
                  {{ item.advert_name }}
                </div>
                <div class="tagBox">
                  <div class="tag"
                       v-if="item.await_amount">
                    待机：{{ item.await_amount }}元/min
                  </div>
                  <div class="tag"
                       v-if="item.payment_amount">
                    支付：{{ item.payment_amount }}元/次
                  </div>
                </div>
              </div>
            </div>
          </template>
          <van-checkbox :name="item.id"
                        checked-color="#f15353"
                        ref="checkboxes"
                        slot="right-icon" />
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
    <div class="btnBox"
         @click="submit">
      <span>提交</span>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      result: [],
      StoreInfo: {},
      list: [],
      store_id: null,
      totalNum: null
    };
  },

  activated() {
    this.result = [];
    this.StoreInfo = {};
    this.totalNum = null;
    this.getStoreInfo();
    this.getAdvertByDistrictId();
  },

  components: { cTitle },

  computed: {},

  methods: {
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    getStoreInfo() {
      $http
        .get("plugin.advert-market.frontend.advert.getStoreInfo", {}, "")
        .then(response => {
          if (response.result == 1) {
            this.StoreInfo = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAdvertByDistrictId() {
      $http
        .get(
          "plugin.advert-market.frontend.advert.getAdvertByDistrictId",
          {},
          ""
        )
        .then(response => {
          if (response.result == 1) {
            this.store_id = response.data.store_id;
            this.totalNum = response.data.adverts.total;
            this.list = response.data.adverts.data;
            if (this.fun.isTextEmpty(this.list)) {
              this.$store.commit("setAdDevice", true);
              this.$router.go(-1);
              return;
            }
          } else {
            Toast(response.msg);
            this.$router.go(-1);
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submit() {
      // console.log("投放广告id", this.result);
      if (this.result.length <= 0) {
        Toast("请选择投放广告！");
        return;
      }
      $http
        .post(
          "plugin.advert-market.frontend.advert.subStoreSelectAdverts",
          { store_id: this.store_id, advert_ids: this.result },
          ""
        )
        .then(response => {
          if (response.result == 1) {
            Toast(response.msg);
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
<style lang="scss" rel="stylesheet/scss" scoped>
#deviceManger {
  .top_member {
    padding: 1.344rem;
    overflow: hidden;
    width: 100%;
    background: #fff;

    img {
      margin-bottom: 0.875rem;
      width: 4.344rem;
      height: 4.344rem;
      border-radius: 100%;
    }

    .name {
      font-size: 0.875rem;
      font-weight: bold;
      color: #333;
      text-align: center;
      width: 100%;
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
    }
  }

  .title {
    height: 2rem;
    line-height: 2rem;
    text-align: left;
    text-indent: 1.344rem;
    color: #999;
  }

  .content {
    padding-bottom: 3.75rem;

    .saa {
      padding: 0.906rem 1.156rem;

      .co {
        display: flex;

        img {
          width: 2.875rem;
          height: 2.875rem;
          border-radius: 0.156rem;
        }

        .detailMain {
          flex: 1;
          padding-left: 0.625rem;

          .titletwo {
            width: 15rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.125rem;
            text-align: left;
          }

          .tagBox {
            display: flex;
            flex-wrap: wrap;

            .tag {
              border: 0.0625rem solid #f15353;
              color: #f15353;
              height: 1rem;
              line-height: 1rem;
              font-size: 0.625rem;
              text-align: center;
              padding: 0 0.4rem;
              border-radius: 0.156rem;
              margin: 0.4rem 0.5rem 0 0;
            }
          }
        }
      }
    }
  }

  .btnBox {
    height: 3.75rem;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    background: #fff;
    z-index: 99;
    display: flex;
    align-items: center;
    box-shadow: 0 0 0.313rem 0 rgba(0, 0, 0, 0.2);

    span {
      width: 85%;
      height: 2.438rem;
      line-height: 2.438rem;
      text-align: center;
      display: block;
      margin: 0 auto;
      color: #fff;
      border-radius: 1.219rem;
      background: #f15353;
    }
  }
}
</style>
