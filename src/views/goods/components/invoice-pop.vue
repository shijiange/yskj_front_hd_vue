<template>
  <div>
    <div class="invoice" v-if="pluginShow" @click="popShowFun">
      <span>发票</span>
      <!-- <span class="type" v-if="invoicename">
        <em class="font">{{ invoicename }}</em>（{{ companyname }}—{{ invoice_list.call }}）
      </span> -->
      <i class="fa fa-angle-right"></i>
    </div>

    <van-popup v-model="popShow" position="bottom" round>
      <div class="invoice-pop">
          <div class="invoice-title">
            <div class="title-text">发票</div>
            <div class="title-right">
              <i class="iconfont icon-fontclass-gantanhao"></i>
              <span class="text" @click="explainShow = true">发票须知</span>
              <i @click="setPopShow(false)" class="iconfont icon-guanbi"></i>
            </div>
          </div>
          <div class="invoice-container">
            <div class="invoice-tabs">
              <div class="blod-title">发票类型</div>
              <div class="tabs-items">
                <div class="tabs-item" :class="{ active: item.value == invoice_type_index }" @click="setTabsIndex(item.value, 'invoice_type_index')" v-for="item in invoice_type_arr" :key="item.value">
                  {{ item.name }}
                </div>
              </div>
            </div>

            <div class="invoice-desc-text">平台启用电子发票，与纸质发票具备同等法律效力。</div>

            <div class="invoice-tabs" style="margin-top:1.5rem;">
              <div class="blod-title">发票抬头</div>
              <div class="tabs-items" v-if="invoice_type_index != 2">
                <div
                  class="tabs-item"
                  :class="{ active: item.value == invoice_header_index }"
                  @click="setTabsIndex(item.value, 'invoice_header_index')"
                  v-for="item in invoice_header_arr"
                  :key="item.value"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>

            <template>
              <div class="field-cell" style="margin-top:1.594rem;">
                <i class="iconfont icon-fontclass-xinghao"></i>
                <div class="field-cell-title">{{ invoice_header_index == 0 || invoice_type_index == 2 ? "单位" : "发票抬头" }}</div>
                <input type="text" v-model="collect_name" :placeholder="invoice_header_index == 0 || invoice_type_index == 2 ? '请填写单位名称' : '请填写需要开具发票的姓名'" />
                <i v-if="collect_name" @touchstart="clearCollectName" class="iconfont icon-adsystem_icon_cancle"></i>

                <div style="width:1.5rem;height:1rem;text-align:center;" v-if="collect_name == ''" @click="invoice_header_list_show = true">
                  <template v-if="invoice_header_index == 0 || invoice_type_index == 2">
                    <i class="fa fa-angle-right" v-if="invoice_header_list && invoice_header_list.company && invoice_header_list.company.length" style="font-size:20px;"></i>
                  </template>
                  <template v-else>
                    <i class="fa fa-angle-right" v-if="invoice_header_list && invoice_header_list.personal && invoice_header_list.personal.length" style="font-size:20px;"></i>
                  </template>
                </div>

                <!-- <div class="invoice-header-list" :class="{ show: (invoice_header_list_show && !collect_name) }">
                  <div class="invoice-header-list-item">个人发票抬头</div>
                  <div class="invoice-header-list-item">个人发票抬头</div>
                </div> -->
              </div>
            </template>

            <template v-if="invoice_header_index == 0 || invoice_type_index == 2">
              <div class="field-cell" style="margin-top:1.594rem;">
                <i class="iconfont icon-fontclass-xinghao"></i>
                <div class="field-cell-title">税号</div>
                <input v-model="gmf_taxpayer" type="text" placeholder="请填写纳税人识别号" />
                <i v-if="gmf_taxpayer" @touchstart.stop="gmf_taxpayer = ''" class="iconfont icon-adsystem_icon_cancle"></i>
              </div>
              <div class="split-line" v-if="invoice_type_index != 2" style="margin-top:1.25rem;margin-bottom:-0.394rem;"></div>
              <div class="field-cell" style="margin-top:1.594rem;">
                <i class="iconfont icon-fontclass-xinghao" v-if="invoice_type_index == 2"></i>
                <div class="field-cell-title">开户银行</div>
                <input v-model="gmf_bank" type="text" :placeholder="'请填写单位开户银行' + (invoice_type_index != 2 ? '(选填)' : '')" />
                <i v-if="gmf_bank" @touchstart.stop="gmf_bank = ''" class="iconfont icon-adsystem_icon_cancle"></i>
              </div>
              <div class="field-cell" style="margin-top:1.594rem;">
                <i class="iconfont icon-fontclass-xinghao" v-if="invoice_type_index == 2"></i>
                <div class="field-cell-title">银行账号</div>
                <input v-model="gmf_bank_admin" type="text" :placeholder="'请填写单位银行账号' + (invoice_type_index != 2 ? '(选填)' : '')" />
                <i v-if="gmf_bank_admin" @touchstart.stop="gmf_bank_admin = ''" class="iconfont icon-adsystem_icon_cancle"></i>
              </div>
              <div class="field-cell" style="margin-top:1.594rem;">
                <i class="iconfont icon-fontclass-xinghao" v-if="invoice_type_index == 2"></i>
                <div class="field-cell-title">注册地址</div>
                <input v-model="gmf_address" type="text" :placeholder="'请填写注册地址' + (invoice_type_index != 2 ? '(选填)' : '')" />
                <i v-if="gmf_address" @touchstart.stop="gmf_address = ''" class="iconfont icon-adsystem_icon_cancle"></i>
              </div>
              <div class="field-cell" style="margin-top:1.594rem;">
                <i class="iconfont icon-fontclass-xinghao" v-if="invoice_type_index == 2"></i>
                <div class="field-cell-title">注册电话</div>
                <input v-model="gmf_mobile" type="text" :placeholder="'请填写注册电话' + (invoice_type_index != 2 ? '(选填)' : '')" />
                <i v-if="gmf_mobile" @touchstart.stop="gmf_mobile = ''" class="iconfont icon-adsystem_icon_cancle"></i>
              </div>
            </template>

            <div class="blod-title" style="margin-top:1.531rem;">收票人信息</div>

            <!-- 电子发票显示 -->
            <template v-if="invoice_type_index == 0">
              <div class="field-cell" style="margin-top:1.594rem;">
                <div class="field-cell-title">手机号</div>
                <input type="text" v-model="col_mobile" placeholder="请输入手机号(选填)" />
                <i v-if="col_mobile" @touchstart.stop="col_mobile = ''" class="iconfont icon-adsystem_icon_cancle"></i>
              </div>
              <div class="field-cell" style="margin-top:1.594rem;">
                <div class="field-cell-title">邮箱</div>
                <input type="text" v-model="email" placeholder="请填入邮箱(选填)" />
                <i v-if="email" @touchstart.stop="email = ''" class="iconfont icon-adsystem_icon_cancle"></i>
              </div>
            </template>

            <template v-if="invoice_type_index == 1 || invoice_type_index == 2">
              <div class="address" @click="openAddList">
                <div class="address-container">
                  <div v-if="!address" class="address-placeholder">请选择收票地址</div>
                  <template v-if="address">
                    <div class="address-name">{{ address.username || address.realname }}/{{ address.mobile }}</div>
                    <div class="address-text" v-if="address.province&&address.city">收票地址：{{ address.province }} {{ address.city }} {{ address.district }} {{ address.street }}</div>
                    <div class="address-text" v-else>{{address.address}}</div>
                  </template>
                </div>
                <i class="iconfont icon-advertise-next"></i>
              </div>
            </template>

            <!-- 专用发票 invoice_type_index=3 不显示 -->
            <template v-if="invoice_type_index != 2">
              <div class="invoice-tabs" style="margin-top:1.531rem;">
                <div class="blod-title">发票内容</div>
                <div class="tabs-items">
                  <div
                    class="tabs-item"
                    :class="{ active: item.value == invoice_content_index }"
                    @click="setTabsIndex(item.value, 'invoice_content_index')"
                    v-for="item in invoice_content_arr"
                    :key="item.value"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>

              <div class="invoice-desc-text">发票金额为实际支付金额，不含折扣，优惠等扣减金额</div>
            </template>
          </div>
          <div class="invoice-btn-wrapper">
            <div class="invoice-btn-item" @click="send">确定</div>
          </div>
      </div>
    </van-popup>

    <van-popup v-model="explainShow" closeable position="bottom" round>
      <div class="explain">
        <div class="explain-title">
          发票须知
        </div>
        <div class="explain-container">
          <div v-html="invoice_explain"></div>
        </div>
        <div class="explain-btn-wrapper">
          <div class="explain-btn-item" @click="explainShow = false">我知道了</div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="invoice_header_list_show" closeable position="bottom" round>
      <div class="explain">
        <div class="explain-title">
          发票抬头
        </div>
        <div class="invoice-header-list-container">
          <template v-if="invoice_header_index == 0 || invoice_type_index == 2">
            <div class="item" v-for="(item, index) in invoice_header_list.company" :key="index" @click="setInvoiceHeader(item)">{{ item.collect_name }}</div>
          </template>
          <template v-else>
            <div class="item" v-for="(item, index) in invoice_header_list.personal" :key="index" @click="setInvoiceHeader(item)">{{ item.collect_name }}</div>
          </template>
        </div>
        <!-- <div class="explain-btn-wrapper">
          <div class="explain-btn-item" @click="invoice_header_list_show = false">我知道了</div>
        </div> -->
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props:["addressData"],
  data() {
    return {
      pluginShow: false,
      popShow: false,
      explainShow: false,

      invoice_type_index: 1, //发票类型
      invoice_type_arr: [],
      invoice_header_index: 1, //发票抬头
      invoice_header_arr: [
        { name: "个人", value: 1 },
        { name: "单位", value: 0 }
      ],
      invoice_content_index: 1, //发票内容
      invoice_content_arr: [],

      invoice_header_list: [], //发票抬头列表
      invoice_header_list_show: false,

      invoice_explain: "", //发票须知

      address: "", //地址，只有纸质发票跟专用发票才需要

      collect_name: "", //发票抬头 || 单位名称

      gmf_taxpayer: "", //纳税号
      gmf_bank: "", //开户银行
      gmf_bank_admin: "", //购买方银行账户
      gmf_address: "", //注册地址
      gmf_mobile: "", //注册电话
      col_mobile: "", //收票人手机号
      email: "", //电子邮箱

      tax_rate:0, //汇率，后台返回，回传给后台
    };
  },
  created() {},
  watch:{
    invoice_header_index(nVal){
      this.getcollect_name();
    },
    invoice_type_index(nVal){
      this.getcollect_name();
    }
  },
  methods: {
    getcollect_name(){
      let key = "personal"
      if (this.invoice_header_index == 0 || this.invoice_type_index == 2) {
        key = "company";
      }
      let list = this.invoice_header_list[key] || [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].is_default == 1) {
          this.setInvoiceHeader(list[i]);
          return false;
        }
      }
      this.collect_name = "";
    },
    initData(data) {
      if (data.is_open == 1 && data.invoice_type.length >= 1) {
        this.pluginShow = true;
        this.invoice_type_arr = data.invoice_type;
        this.invoice_type_index = data.invoice_type[0].value;
        let content = data.content;
        content.push({ name: "不开发票", value: 2 });
        this.invoice_content_arr = content;
        this.invoice_content_index = this.invoice_content_arr[0].value;
        this.invoice_explain = data.notice;
        this.invoice_header_list = data.rises;
        this.tax_rate = data.tax_rate;
        this.getcollect_name();
      }
    },
    openAddList() {
      this.$emit("openAddList");
    },
    setAddress(item) {
      this.address = item;
    },
    send() {
      if (this.invoice_content_index==2) {
        this.popShow = false;
        return false;
      }
      let { invoice_type_index, invoice_header_index, invoice_content_index, collect_name, gmf_taxpayer, gmf_bank, gmf_bank_admin, gmf_address, gmf_mobile, col_mobile, email, address,tax_rate } = this;
      // status和apply 后端要求写死
      let json = {
        status: 2,
        apply: 1,
        invoice_type: invoice_type_index,
        rise_type: invoice_header_index,
        content: invoice_content_index,
        tax_rate
      };

      if (this.fun.isTextEmpty(collect_name)) {
        if (invoice_header_index == 0 || invoice_type_index == 2) {
          return this.$toast("请输入单位名称");
        } else {
          return this.$toast("请输入发票抬头");
        }
      }
      json.collect_name = collect_name;

      //单位 或者 专用发票
      if (invoice_type_index == 2 || invoice_header_index == 0) {
        if (this.fun.isTextEmpty(gmf_taxpayer)) return this.$toast("请输入纳税人识别号");

        //专用发票要求必须输入，其他选选填
        if (invoice_type_index == 2) {
          if (this.fun.isTextEmpty(gmf_bank)) return this.$toast("请输入单位开户银行");
          if (this.fun.isTextEmpty(gmf_bank_admin)) return this.$toast("请输入单位银行账号");
          if (this.fun.isTextEmpty(gmf_address)) return this.$toast("请输入注册地址");
          if (this.fun.isTextEmpty(gmf_mobile)) return this.$toast("请输入注册电话");
        }

        json.gmf_taxpayer = gmf_taxpayer;

        json.gmf_bank = gmf_bank;
        json.gmf_bank_admin = gmf_bank_admin;
        json.gmf_address = gmf_address;
        json.gmf_mobile = gmf_mobile;
      }

      //非 电子发票 需要选择地址
      if (invoice_type_index != 0) {
        if (!address) return this.$toast("请选择地址");
        json.col_address = `${address.province} ${address.city} ${address.district} ${address.street}`;
        json.col_name = address.username;
        json.col_mobile = address.mobile;
      }

      //电子发票
      if (invoice_type_index == 0) {
        json.email = email;
        json.col_mobile = col_mobile;
      }

      this.$emit("confirm", json);
      this.popShow = false;
    },
    clearCollectName() {
      setTimeout(() => {
        this.collect_name = "";
      }, 50);
    },
    setPopShow(flag) {
      this.popShow = flag;
    },
    setTabsIndex(value, name) {
      this[name] = value;
    },
    setInvoiceHeader(item) {
      this.collect_name = item.collect_name;
      this.gmf_bank = item.bank;
      this.gmf_bank_admin = item.bank_admin;
      this.gmf_mobile = item.mobile;
      this.gmf_address = item.address;
      this.email = item.email;
      this.gmf_taxpayer = item.tax_num;
      this.invoice_header_list_show = false;
    },
    popShowFun(){
      this.popShow = true;
      this.address = this.addressData || "";
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// $pcStyle:370px;
// /deep/ .van-overlay{
//     width: $pcStyle;
// }
.invoice {
  background: #fff;
  margin-top: 0.625rem;
  height: 2.8125rem;
  line-height: 2.8125rem;
  font-size: 15px;
  display: flex;
  padding: 0 0.875rem;
  border-top: solid 0.0625rem #ebebeb;
  border-bottom: solid 0.0625rem #ebebeb;
  position: relative;

  span {
    margin-right: 1.25rem;

    .font {
      color: #f15353;
    }
  }

  .type {
    font-size: 12px;
    color: #8c8c8c;
  }

  i {
    position: absolute;
    right: 0.875rem;
    font-size: 24px;
    color: #c9c9c9;
    line-height: 2.8125rem;
  }
}
.invoice-pop {
  height: 35rem;
  background: #fff;
  .invoice-title {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.5rem;
    font-size: 18px;
    color: #202020;
    .title-right {
      position: absolute;
      display: flex;
      align-items: center;
      right: 0;
      .icon-fontclass-gantanhao {
        font-size: 13px;
        color: #f15353;
      }
      .text {
        margin-left: 0.281rem;
        font-size: 12px;
        color: #575757;
      }
      .icon-guanbi {
        margin-left: 1.344rem;
        margin-right: 1.25rem;
        font-size: 14px;
        color: #6c6c6c;
      }
    }
  }
  .invoice-container {
    height: 28rem;
    padding: 0 0.938rem;
    padding-bottom: 1rem;
    text-align: left;
    overflow-y: auto;
    .blod-title {
      font-size: 13px;
      color: #373737;
      font-weight: bolder;
    }
    .split-line {
      height: 0.031rem;
      background-color: #f2f2f2;
    }
    .invoice-tabs {
      .tabs-items {
        display: flex;
        margin-top: 1rem;
        .tabs-item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4.375rem;
          height: 1.563rem;
          margin-right: 2.281rem;
          padding-bottom: 0.125rem;
          color: #333333;
          font-size: 12px;
          &.active {
            color: #f15353;
            border-radius: 0.781rem;
            border: solid 0.031rem #f15353;
          }
        }
      }
    }
    .invoice-desc-text {
      margin-top: 0.813rem;
      font-size: 11px;
      color: #7c7c7c;
    }
    .field-cell {
      position: relative;
      display: flex;
      align-items: center;
      .icon-fontclass-xinghao {
        font-size: 12px;
        color: #f15353;
      }
      .field-cell-title {
        margin-left: 0.156rem;
        font-size: 12px;
        color: #202020;
      }
      input {
        flex: 1;
        margin-left: 0.5rem;
        font-size: 12px;
        color: #7c7c7c;
        border: none;
        &:focus + .icon-adsystem_icon_cancle {
          display: flex;
        }
      }
      .icon-adsystem_icon_cancle {
        display: none;
        position: absolute;
        right: 0;
        font-size: 18px;
      }
      .invoice-header-list {
        position: absolute;
        z-index: 1;
        transform: translateY(2.5rem);
        top: 0;
        left: 4.6rem;
        width: 11rem;
        max-height: 0;

        background-color: #ffffff;
        box-shadow: 0rem 0.063rem 0.5rem 0rem rgba(178, 178, 178, 0.47);
        border-radius: 0.125rem;
        overflow: hidden;
        transition: 0.5s;
        &.show {
          padding-top: 0.3rem;
          padding-bottom: 0.381rem;
          max-height: 100px;
        }
        .invoice-header-list-item {
          padding: 0.45rem 0.781rem;
          background: #fff;
          transition: 0.5s;
          &:active {
            filter: brightness(90%);
          }
        }
      }
    }
    .address {
      display: flex;
      align-items: center;
      padding-top: 0.969rem;
      .address-container {
        flex: 1;
        .address-placeholder {
          font-size: 12px;
          color: #7c7c7c;
        }
        .address-name {
          font-size: 12px;
          color: #202020;
        }
        .address-text {
          margin-top: 0.906rem;
          font-size: 12px;
          color: #202020;
        }
      }
      .icon-advertise-next {
        color: #202020;
      }
    }
  }
  .invoice-btn-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.5rem;
    padding: 0 2.313rem;
    .invoice-btn-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 2.188rem;
      font-size: 13px;
      font-weight: bold;
      color: #ffffff;
      background-color: #f05152;
      border-radius: 1.094rem;
    }
  }
}

.explain {
  height: 27rem;
  .explain-title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.5rem;
    font-size: 18px;
    color: #2a2a2a;
    font-weight: bold;
  }
  .explain-container {
    display: flex;
    height: 20rem;
    padding: 0 0.938rem;
    font-size: 15px;
    text-align: left;
    color: #333333;
    background: #fff;
    overflow: auto;
  }
  .explain-btn-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.5rem;
    padding: 0 2.313rem;
    .explain-btn-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 2.188rem;
      font-size: 13px;
      font-weight: bold;
      color: #ffffff;
      background-color: #f05152;
      border-radius: 1.094rem;
    }
  }
}
.invoice-header-list-container {
  height: 22rem;
  text-align: left;
  padding: 0 1.5rem;
  overflow: auto;
  .item {
    width: 100%;
    word-break: break-all;
    color: #202020;
    padding: 0.3rem 0;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    &:active {
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
