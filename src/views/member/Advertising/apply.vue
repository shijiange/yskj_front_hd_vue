<!-- 广告主申请 -->
<template>
  <div id="Advertising-apply">
    <c-title :hide="false" text="广告管理"></c-title>
    <img :src="configInfo.banner" alt="" style="width: 100%;" v-if="configInfo.banner" />
    <template v-if="configInfo.status == 1">
      <div class="main">
        <div class="titel-border">
          <div class="border-r"></div>
          申请信息
        </div>
        <van-field v-model="apply.realname" label="姓名" :border="false" required placeholder="请输入姓名" input-align="right" />
        <van-field v-model="apply.mobile" label="手机号" type="tel" :border="false" required placeholder="请输入联系电话" input-align="right" />
        <van-field v-model="apply.gender" @click="showSex = true" label="性别" :border="false" placeholder="请选择性别" input-align="right" readonly right-icon="arrow" />
        <van-field v-model="addressName" @click="clickIcon(1)" label="所在区域" :border="false" required placeholder="请选择所在区域" readonly input-align="right" right-icon="arrow" />
        <van-field v-show="strShow" @click="clickIcon(2)" v-model="street" label="街道" :border="false" required placeholder="请选择街道" readonly input-align="right" right-icon="arrow" />
        <van-field v-model="apply.address" rows="1" :border="false" input-align="right" autosize label="详细地址" type="textarea" placeholder="请输入详细地址" />
        <van-cell value="上传证件" required :border="false" />
        <div class="certificate-arr">
          <div class="certificate-box">
            <yz_uploader v-model="FrontIDcard" :max_count="1" :isCustomStyle="true" :styles="{ width: '10.25rem', height: '6.375rem' }">
              <div class="certificate-img">
                <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/Front-of-ID-card.png" alt="" />
              </div>
            </yz_uploader>
            <div class="certificate-title">上传身份证人像面</div>
          </div>
          <div class="certificate-box">
            <yz_uploader v-model="backIDcard" :max_count="1" :isCustomStyle="true" :styles="{ width: '10.25rem', height: '6.375rem' }">
              <div class="certificate-img">
                <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/back-of-ID-card.png" alt="" />
              </div>
            </yz_uploader>
            <div class="certificate-title">上传身份证国徽面</div>
          </div>
          <div class="certificate-box">
            <yz_uploader v-model="businessFlie" :max_count="1" :isCustomStyle="true" :styles="{ width: '10.25rem', height: '6.375rem' }">
              <div class="certificate-img">
                <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/business-license.png" alt="" />
              </div>
            </yz_uploader>
            <div class="certificate-title">经营许可证</div>
          </div>
          <div class="certificate-box">
            <yz_uploader v-model="GenerateFlie" :max_count="1" :isCustomStyle="true" :styles="{ width: '10.25rem', height: '6.375rem' }">
              <div class="certificate-img">
                <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/Generate-license.png" alt="" />
              </div>
            </yz_uploader>
            <div class="certificate-title">生产许可证</div>
          </div>
        </div>
        <van-cell value="其他证件" :border="false" />
        <div class="certificate-arr other-file-box">
          <div class="certificate-box">
            <yz_uploader v-model="otherFlie" :isCustomStyle="true" :styles="{ width: '10.25rem', height: '6.375rem' }">
              <div class="certificate-img">
                <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/Other-documents.png" alt="" />
              </div>
            </yz_uploader>
          </div>
        </div>

        <div class="protocol-box">
          <van-checkbox v-model="checked"><div class="text-color" @click="showProtocol = true">《申请协议》</div> </van-checkbox>
        </div>

        <van-popup v-model="showProtocol" closeable round :style="{ width: '19.781rem' }">
          <div class="Protocol-popup">
            <div class="title-h1">申请协议</div>
            <div class="Protocol-text" v-html="configInfo.protocol"></div>
          </div>
        </van-popup>

        <!-- 街道地址 -->
        <yd-cityselect v-model="addressShow" :callback="addressCallback" :items="area"></yd-cityselect>

        <van-popup v-model="streetShow" position="bottom" round :style="{ height: '80%', width: '100%' }">
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

        <van-popup v-model="showSex" closeable round :style="{ width: '15.125rem', height: '10rem' }">
          <div class="sex-title">请选择您的性别</div>
          <div class="sex-select">
            <div class="sex-child " @click="selcetSex(1)" :class="{ 'active-select-radio': sexId == 1 }">
              <div class="sex-icon">
                <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/man_icon.png" alt="" />
              </div>
              <i class="iconfont icon-all_select_active"></i>
              男
            </div>
            <div style="color: #999;">或</div>
            <div class="sex-child" @click="selcetSex(2)" :class="{ 'active-select-radio': sexId == 2 }">
              <div class="sex-icon">
                <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/woman_icon.png" alt="" />
              </div>
              <i class="iconfont icon-all_select_active"></i>
              女
            </div>
          </div>
        </van-popup>
      </div>
      <div class="btnBox" @click="submitApply">
        <span>提交</span>
      </div>
    </template>
    <div v-if="configInfo.status && configInfo.status != 1" class="okApply">
      <div class="ico"><i class="fa fa-check"></i></div>
      <div class="text">{{ configInfo.status == 2 ? "已提交申请，等待审核通过..." : "您已是广告主，无需重复申请！" }}</div>
      <a @click="goToIndex()">
        <div class="sub">去商城逛逛</div>
      </a>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import yz_uploader from "components/ui_components/yz_uploader";
export default {
  data() {
    return {
      configInfo: {
        // status: 0
      }, //顶部banner图,申请协议,审核状态
      apply: {
        realname: "",
        mobile: "",
        company_name: "",

        province_id: "",
        city_id: "",
        district_id: "",
        company_address: "",
        remark: "",
        address: "",
        street_id: "" //街道
      },
      addressShow: false,
      area: district,
      isStatus: false, //验证是否可以申请
      statusText: "",
      addressName: "",
      street: "",
      districtVal: [],
      strShow: false,
      streetShow: false,
      showSex: false, //显示性别
      showProtocol: false, //申请协议

      FrontIDcard: [],
      backIDcard: [],
      businessFlie: [],
      GenerateFlie: [],
      otherFlie: [],

      sexId: 0, //（男1女2）
      checked: false
    };
  },

  activated() {
    this.getData();
  },

  components: { yz_uploader },

  computed: {},

  methods: {
    getData() {
      $http
        .get("plugin.ad-serving.frontend.advertisers.apply.index", {})
        .then(response => {
          if (response.result === 1) {
            this.configInfo = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    selcetSex(i) {
      this.sexId = i;
      this.apply.gender = i == 1 ? "男" : "女";
      this.showSex = false;
    },
    clickIcon(data) {
      if (data == 1) this.addressShow = true;
      if (data == 2) this.streetShow = true;
    },
    // 地址回调
    addressCallback(obj) {
      this.addressName = obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.apply.province_id = obj.itemValue1;
      this.apply.city_id = obj.itemValue2;
      this.apply.district_id = obj.itemValue3;

      this.getStreet(obj.itemValue3);
    },
    // 获取街道
    getStreet(param) {
      $http
        .get("member.memberAddress.street", { district_id: param })
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
    // 去首页商城
    goToIndex() {
      this.$router.push(this.fun.getUrl("home"));
    },
    submitApply() {
      if (this.fun.isTextEmpty(this.apply.realname)) {
        Toast("请填写姓名！");
        return;
      }
      if (this.fun.isTextEmpty(this.apply.mobile)) {
        Toast("请填写联系方式！");
        return;
      }
      if (this.fun.isTextEmpty(this.apply.province_id) || this.fun.isTextEmpty(this.apply.city_id) || this.fun.isTextEmpty(this.apply.district_id)) {
        Toast("请选择省市区");
        return;
      }

      if (this.fun.isTextEmpty(this.apply.street_id)) {
        Toast("请在后台系统-交易设置-开启街道地址");
        return;
      }
      if (this.fun.isTextEmpty(this.FrontIDcard) || this.fun.isTextEmpty(this.backIDcard)) {
        Toast("请上传身份证正反照！");
        return;
      }
      if (this.fun.isTextEmpty(this.businessFlie)) {
        Toast("请上传经营许可证！");
        return;
      }
      if (!this.checked) {
        Toast("请勾选申请协议！");
        return;
      }
      let json = {
        username: this.apply.realname,
        mobile: this.apply.mobile,
        sex: this.sexId,
        province_id: this.apply.province_id,
        city_id: this.apply.city_id,
        district_id: this.apply.district_id,
        street_id: this.apply.street_id,
        address: this.apply.address,
        id_card_front: this.FrontIDcard[0],
        id_card_side: this.backIDcard[0],
        business_certificate: this.businessFlie[0],
        production_licence: this.GenerateFlie[0],
        other_certificates: this.otherFlie
      };
      $http
        .post("plugin.ad-serving.frontend.advertisers.apply.apply", json)
        .then(response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.getData();
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#Advertising-apply {
  background: #fff;

  .main {
    padding: 0 0 4rem;
    text-align: left;

    .titel-border {
      height: 1.125rem;
      line-height: 1.125rem;
      font-size: 1.125rem;
      color: #f14e4e;
      font-weight: bold;
      margin: 0.875rem 0.875rem 0.25rem;
      display: flex;
      align-items: center;

      .border-r {
        height: 0.875rem;
        width: 3px;
        background: #f14e4e;
        margin-right: 0.375rem;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }

    .certificate-arr {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 1.25rem;
      align-items: center;
      justify-items: center;

      .certificate-box {
        text-align: center;
        font-size: 10px;
        color: #666;
        overflow: hidden;

        .certificate-img {
          width: 10.25rem;
          height: 6.375rem;
          background-color: #fff;
          border-radius: 0.5rem;
          border: solid 1px #e9e9e9;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .certificate-title {
          height: 1.25rem;
          line-height: 1.625rem;
        }
      }
    }

    .other-file-box {
      display: flex;
    }
  }

  .sex-title {
    height: 3rem;
    line-height: 3rem;
    font-size: 1rem;
    text-indent: 1rem;
  }

  .sex-select {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-around;
    padding: 0.875rem;
    width: 100%;

    .sex-child {
      width: 3.75rem;
      position: relative;

      .sex-icon {
        width: 3.75rem;
        height: 3.75rem;
        overflow: hidden;
        border-radius: 50%;
        border: solid 1px #bfbfbf;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .icon-all_select_active {
        position: absolute;
        right: 0.125rem;
        bottom: 1.125rem;
      }
    }

    .active-select-radio {
      color: #f14e4e;

      .sex-icon {
        border-color: #f14e4e;
      }
    }
  }

  .protocol-box {
    .text-color {
      color: #1c8edf;
    }

    padding: 2rem 0.875rem 0;
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
    // position: fixed;
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

  /deep/.van-cell--clickable:active {
    background-color: #fff;
  }

  .Protocol-popup {
    height: 24.75rem;
    display: flex;
    flex-direction: column;

    /deep/img {
      max-width: 100%;
    }

    .title-h1 {
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      font-size: 16px;
    }

    .Protocol-text {
      flex: 1;
      overflow: scroll;
      padding: 0 0.875rem 1rem;
    }
  }
}
</style>
