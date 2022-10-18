<!-- 广告市场-广告主申请 -->
<template>
  <div id="adApply">
    <c-title :hide="false" text="广告管理"></c-title>
    <template v-if="!isStatus">
      <div class="main">
        <div class="title">姓名</div>
        <input type="text" v-model="apply.realname" placeholder="请输入广告主姓名" />
        <div class="title">手机号</div>
        <input type="number" v-model="apply.mobile" placeholder="请输入手机号" />
        <div class="title">公司名称</div>
        <input type="text" v-model="apply.company_name" placeholder="请输入公司名称" />
        <div class="title">所在区域</div>

        <van-cell :border="false" is-link class="clearDefault" center>
          <input type="text" @click.stop="addressShow = true" v-model="addressName" readonly placeholder="请选择区域" />
        </van-cell>

        <div class="title" v-show="strShow">所在街道</div>

        <van-cell :border="false" is-link class="clearDefault" v-show="strShow" center>
          <input
            slot="default"
            type="text"
            @click.stop="streetShow = true"
            v-model="street"
            readonly
            placeholder="请选择街道"
          />
        </van-cell>

        <input type="text" v-model="apply.company_address" placeholder="输入详细地址" />
        <div class="title">备注信息</div>

        <van-cell :border="false" style="padding-bottom: 0.625rem;" center class="morehand">
          <van-field
            style="padding: 10px;"
            v-model="apply.remark"
            rows="2"
            autosize
            class="remark"
            type="textarea"
            maxlength="100"
            placeholder="填写备注信息"
            show-word-limit
          />
        </van-cell>

        <!-- 街道地址 -->
        <yd-cityselect v-model="addressShow" :callback="addressCallback" :items="area"></yd-cityselect>

        <van-popup v-model="streetShow" position="right" duration="0" :style="{ height: '100%', width: '100%' }">
          <van-nav-bar title="选择街道">
            <template #left>
              <span>
                <van-icon name="arrow-left" size="18" @click.native="streetShow = false" color="#333" />
              </span>
            </template>
          </van-nav-bar>
          <!-- <div style="clear:both;margin-top:2.5rem;"></div> -->
          <van-cell :key="i" is-link v-for="(item, i) in districtVal" @click.native="streetConfirm(item)">
            <span slot="title">{{ item.areaname }}</span>
          </van-cell>
        </van-popup>
      </div>
      <div class="btnBox">
        <span @click="submit">提交</span>
      </div>
    </template>
    <div v-else class="okApply">
      <div class="ico"><i class="fa fa-check"></i></div>
      <div class="text">{{ statusText }}</div>
      <a @click="goToIndex()">
        <div class="sub">去商城逛逛</div>
      </a>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      apply: {
        realname: '',
        mobile: '',
        company_name: '',

        province_id: '',
        city_id: '',
        district_id: '',
        company_address: '',
        remark: '',
        street_id: '' //街道
      },
      addressShow: false,
      area: district,
      isStatus: false, //验证是否可以申请
      statusText: '',
      addressName: '',
      street: '',
      districtVal: [],
      strShow: false,
      streetShow: false
    };
  },

  activated() {
    this.init();
    this.getStatus();
  },

  components: { cTitle },

  computed: {},

  methods: {
    init() {
      this.apply.realname = '';
      this.apply.mobile = '';
      this.apply.company_name = '';
      this.addressShow = false;
      //街道
      this.apply.province_id = '';
      this.apply.city_id = '';
      this.apply.district_id = '';
      this.apply.street_id = '';

      this.apply.company_address = '';
      this.apply.remark = '';
      this.addressName = '';
      this.streetShow = false;
    },
    getStatus() {
      let that = this;
      $http.get('plugin.advert-market.frontend.advertMember.verify', {}, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            that.isStatus = false;
          } else {
            Toast(response.msg);
            that.isStatus = true;
            that.statusText = response.msg;
          }
        },
        function(response) {
          Toast(response.msg);
        }
      );
    },
    // 地址回调
    addressCallback(obj) {
      this.addressName = obj.itemName1 + ' ' + obj.itemName2 + ' ' + obj.itemName3;
      this.apply.province_id = obj.itemValue1;
      this.apply.city_id = obj.itemValue2;
      this.apply.district_id = obj.itemValue3;

      this.getStreet(obj.itemValue3);
    },
    // 获取街道
    getStreet(param) {
      $http
        .get('member.memberAddress.street', { district_id: param })
        .then(response => {
          if (response.result === 1) {
            if (!this.fun.isTextEmpty(response.data) && response.data.length > 0) {
              this.districtVal = response.data;
              this.strShow = true;
            } else {
              this.strShow = false;
            }
          } else {
            this.strShow = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    streetConfirm(item) {
      this.street = item.areaname;
      this.apply.street_id = item.id;
      this.streetShow = false;
    },
    submit() {
      if (this.fun.isTextEmpty(this.apply.realname)) {
        Toast('请填写姓名');
        return;
      }
      if (this.fun.isTextEmpty(this.apply.mobile)) {
        Toast('请填写号码');
        return;
      }
      if (this.fun.isMoblie(this.apply.mobile)) {
        Toast('请输入正确的手机号');
        return;
      }
      if (this.fun.isTextEmpty(this.apply.company_name)) {
        Toast('请填写公司名称');
        return;
      }
      if (
        this.fun.isTextEmpty(this.apply.province_id) ||
        this.fun.isTextEmpty(this.apply.city_id) ||
        this.fun.isTextEmpty(this.apply.district_id)
      ) {
        Toast('请选择省市区');
        return;
      }
      if (this.fun.isTextEmpty(this.apply.street_id)) {
        Toast('请在后台系统-交易设置-开启街道地址');
        return;
      }

      if (this.fun.isTextEmpty(this.apply.company_address)) {
        Toast('请填写详细地址');
        return;
      }
      $http.post('plugin.advert-market.frontend.advertMember.subApply', { apply: this.apply }, '提交中').then(
        response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.init();
            this.$store.commit('setAdApply', true);
            this.$router.go(-1);
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    // 去首页商城
    goToIndex() {
      this.$router.push(this.fun.getUrl('home'));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#adApply {
  background: #fff;
  min-height: 100vh;

  .main {
    padding: 0 1.315rem 4rem;
    text-align: left;

    .title {
      height: 2.25rem;
      line-height: 2.25rem;
      font-size: 1rem;
      color: #333;
      font-weight: bold;
      margin-top: 0.625rem;
    }

    input {
      width: 100%;
      border: none;
      height: 2.25rem;
      line-height: 2.25rem;
      font-size: 1rem;
      border-bottom: 0.0625rem solid #efefef;
    }

    .clearDefault {
      padding: 0;
    }
  }

  .yd-cell-item {
    padding: 0;

    .remark {
      background: none;
      border: 1px solid #efefef;
      border-radius: 0;
    }
  }

  /deep/ .yd-cell-item .yd-cell-right {
    padding: 0;
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

  .okApply {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;

    .ico {
      width: 4rem;
      height: 4rem;
      line-height: 4rem;
      font-size: 2.5rem;
      background: #70bd79;
      color: #fff;
      text-align: center;
      border-radius: 100%;
    }

    .text {
      padding: 0.825rem 0;
    }

    a {
      .sub {
        height: 2rem;
        background: #f15353;
        line-height: 2rem;
        color: #fff;
        border-radius: 1rem;
        padding: 0 1rem;
      }
    }
  }

  .morehand {
    margin-bottom: 0.625rem;
    padding: 10px 0;
    background: none;
    border: 1px solid #efefef;
  }

  /deep/.van-cell--clickable:active {
    background-color: #fff;
  }
}
</style>
