<template>
  <div class="page">
    <div class="title" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '', titleBgMode == 'white' ? 'white' : '']">
      <div class="title-icon-wrapper">
        <i class="iconfont icon-member-left" @click="gotoBack"></i>
      </div>
      <div class="title-icon-wrapper">
        <i class="iconfont icon-fontclass-shouye" @click="gotoHome"></i>
      </div>
    </div>
    <div class="banner">
      <img :src="bannerUrl" alt="" />
    </div>
    <div class="recharge">
      <div class="tabs">
        <div class="tabs-item">选择户号</div>
      </div>

      <div class="recharge-box">
        <div class="input-box">
          <span style="color: #fe3d43" @click="editUserShow = true" v-if="AccountList.length <= 0">添加户名</span>
          <div class="inpInofBox" @click="selectUserShow = true" v-if="AccountList.length > 0">
            <div class="left">
              <div class="leftIcon">{{ current.charge_type == "1" ? "住" : current.charge_type == "2" ? "店" : "企" }}</div>
              <div class="leftTxt">{{ current.account_number }}</div>
            </div>
            <div class="line"></div>
            <div class="right">
              <span>{{ current.account_name }}</span>
              <van-icon name="arrow" color="#616161" />
            </div>
          </div>
          <!-- <input type="text" v-model="mobile" placeholder="" /> -->
        </div>
        <div class="desc">{{ rechargeItem.desc_text }}</div>
        <div class="recharge-title">充值金额</div>
        <div class="recharge-items">
          <div class="recharge-item" @click="handClickOptions(item)" :class="optionsId == item.id ? 'active' : ''" v-for="(item, i) in displayOptions" :key="i" v-if="item.status == 1 && (current?item.charge_type == current.charge_type:true)">
            <div class="recharge-activity" v-if="item.diff_price > 0">立减{{ item.diff_price }}元</div>
            <div class="recharge-price"><span>￥</span>{{ item.face_value }}</div>
            <div class="recharge-discount">优惠价￥{{ item.product_price }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="like-box" v-if="likeArr.length > 0">
      <div class="like-box-title">猜你喜欢</div>
      <van-swipe :show-indicators="false" :loop="false" @change="changeSwipeIndex">
        <van-swipe-item v-for="(goods, i) in likeArr" :key="i">
          <div class="like-box-goods">
            <div class="like-box-good" v-for="item in goods" :key="item.id" @click="gotoGoods(item.id)">
              <div class="good-face">
                <img :src="item.thumb" alt="" />
              </div>
              <div class="good-name overflow">{{ item.title }}</div>
              <div class="good-price">￥{{ item.price }}</div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
      <div class="van-indicator">
        <div class="li" :class="swipeIndex == i ? 'active' : ''" v-for="(item, i) in likeArr" :key="i"></div>
      </div>
    </div>

    <div class="goods-details">
      <div class="goods-details-title">
        <div class="line"></div>
        <div class="text">商品详情</div>
        <div class="line"></div>
      </div>
      <div v-html="goodsInfo.content" @click="handleHtml($event)" style="text-align: left; padding: 0 1rem"></div>
      <p v-if="fun.isTextEmpty(goodsInfo.content)" style="color: #666">暂无该商品详情 ~</p>
    </div>

    <div class="footer" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div class="footer-left">
        <div class="service footer-left-item" @click="show1 = true">
          <i class="iconfont icon-fontclass-kefu"></i>
          <span>客服</span>
        </div>
        <div class="order footer-left-item" @click="gotoOrderList">
          <i class="iconfont icon-kc_line_order"></i>
          <span>订单</span>
        </div>
      </div>
      <div class="footer-right" @click="sendRecharge">立即充值</div>
    </div>

    <div class="fixed-qrcode" @click="postShow">
      <i class="iconfont icon-bc_eweima"></i>
    </div>

    <div class="fixed-topping" v-if="titleBgMode == 'white'" @click="setTopping">
      <i class="iconfont icon-fontclass-zhiding"></i>
    </div>
    <yz-goodsposter v-model="posterShow" :posterData="posterImg" :goodstype="true"></yz-goodsposter>
    <cservice-popup :show="show1" :cservice="cservice" :service_mobile="service_mobile" :service_QRcode="service_QRcode" @close="show1 = false" />
    <van-popup v-model="editUserShow" position="bottom" :style="{ height: showKeyboard ? '75%' : '59%' }">
      <van-nav-bar title="填写充值账户">
        <template #right>
          <van-icon name="cross" size="18" @click="editUserShow = false" />
        </template>
      </van-nav-bar>
      <div class="lineTitle">
        <div class="lineTxt">户名：</div>
        <div class="lineInp" style="">
          <van-field v-model="form.account_name" placeholder="例如我家/父母家" />
        </div>
      </div>
      <div class="lineTitle">
        <div class="lineTxt">户号：</div>
        <div class="lineInp">
          <van-field v-model="form.account_number" placeholder="请输入缴费户号" />
          <div class="acctips" @click="tipsShow = true">如何获取户号？</div>
        </div>
      </div>
      <div class="linebox" @click="addressShowProvince">
        <div class="lineTxt">所在省市：</div>
        <div class="lineSelect">
          <!-- is_Province -->
          <span>{{ form.province }} {{ form.city }}</span>
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="lineboxCard" v-if="this.checkProvince()">
        <div class="lineTxt">身份证/营业执照/机构代码后6位：</div>
        <div class="lineInp" style="">
          <van-field v-model="codeValue" maxlength='6' placeholder="身份证/营业执照/机构代码后6位" />
        </div>
      </div>
      <div class="linebox">
        <div class="lineTxt">账户类型：</div>
        <div class="lineSelect" @click="tapSelect_btn">
          <span>{{ form.charge_type == 1 ? "住宅" : form.charge_type == 2 ? "商铺" : "企事业" }}</span>
          <van-icon name="arrow" v-if="!tapSelect" />
          <van-icon name="arrow-up" v-if="tapSelect" />
        </div>
      </div>
      <div class="accountType" v-if="tapSelect">
        <van-radio-group v-model="form.charge_type">
          <div class="groupList">
            <div>住宅</div>
            <van-radio name="1" checked-color="#f14e4e"></van-radio>
          </div>
          <div class="groupList">
            <div>商铺</div>
            <van-radio name="2" checked-color="#f14e4e"></van-radio>
          </div>
          <div class="groupList">
            <div>企事业</div>
            <van-radio name="3" checked-color="#f14e4e"></van-radio>
          </div>
        </van-radio-group>
      </div>
      <div class="saveBox" @click="saveBox">保存</div>
    </van-popup>
    <van-popup v-model="selectUserShow" position="bottom" :style="{ height: '60%' }">
      <van-nav-bar title="选择户号">
        <template #right>
          <van-icon name="cross" size="18" @click="selectUserShow = false" />
        </template>
      </van-nav-bar>
      <div class="listBox_se">
        <van-radio-group v-model="radioAccount" @change="currentChange">
          <div class="lis" v-for="(item, ind) in AccountList" :key="ind">
            <div class="icon">{{ item.charge_type == "1" ? "住" : item.charge_type == "2" ? "店" : "企" }}</div>
            <div class="lis_detail">
              <div class="lis_detail_top">
                <div class="lis_detail_top_title">{{ item.account_name }}</div>
                <div class="lis_icon">
                  <i class="iconfont icon-fontclass-xiugai" @click="editIcon(item)"></i>
                  <div class="line"></div>
                  <i class="iconfont icon-fontclass-shanchu" @click="delIcon(item)"></i>
                </div>
              </div>
              <div class="lis_detail_bottom">{{ item.account_number }}</div>
            </div>
            <div class="iconRight">
              <van-radio :name="item.id" checked-color="#f14e4e"></van-radio>
            </div>
          </div>
        </van-radio-group>
      </div>
      <div class="saveBox" @click="newCreate">新增户号</div>
    </van-popup>
    <van-popup v-model="tipsShow" position="bottom" :style="{ height: '58%' }">
      <van-nav-bar title="如何获得户号？"></van-nav-bar>
      <div class="tipsBox">
        <div class="tipsTop">
          <div class="tipsTop_box">
            <i class="iconfont icon-zx_map_tel"></i>
          </div>
          电话查询
        </div>
        <div class="tipsBottom">拨打国家电网客户电话 95598，提供住址、身份证号即可拨打</div>
      </div>
      <div class="tipsBox" style="margin-top: 1.25rem">
        <div class="tipsTop">
          <div class="tipsTop_box">
            <i class="iconfont icon-fontclass-chucun"></i>
          </div>
          检查计费表
        </div>
        <div class="tipsBottom">在纸质缴费/催费通知单上查找户号</div>
      </div>
      <div class="tipsBox" style="margin-top: 1.25rem">
        <div class="tipsTop">
          <div class="tipsTop_box">
            <i class="iconfont icon-fontclass-yanzhengma"></i>
          </div>
          查询通知短信
        </div>
        <div class="tipsBottom">搜索手机由缴费单位发送的催缴短信，短信中包含户号</div>
      </div>
    </van-popup>
    <!-- 选省 -->
    <van-popup v-model="addressShow_p" position="bottom" :style="{ height: '45%' }">
      <van-picker title="" show-toolbar :columns="provinceData" @confirm="addressCallback" @cancel="onCancel" value-key="text" />
    </van-popup>
  </div>
</template>

<script>
import cservicePopup from "./children/plugin/cservicePopup";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
export default {
  props: ["goods_info"],
  components: { cservicePopup, yzGoodsposter },
  data() {
    return {
      titleBgMode: "transparent",
      goodsInfo: {},

      rechargeType: {},
      rechargeItem: {},
      rechargeSpecId: 0,

      displayOptions: [], //显示的规格，根据快充慢充来显示
      optionsId: 0,

      show1: false,
      service_QRcode: "",
      service_mobile: "",
      cservice: "",

      //猜你喜欢
      likeArr: [],
      swipeIndex: 0,

      mobile: "",

      bannerUrl: "",

      posterShow: false,
      posterImg: null,
      // 添加户名
      editUserShow: false,
      // 切换户名
      selectUserShow: false,
      // radioName: "1",
      // 账户类型选择
      tapSelect: false,
      // 选择户号
      radioAccount: "1",
      // 如何获取户号显隐
      tipsShow: false,
      addressShow_p: false,
      addressShow_c: false,
      provinceData: [],
      cityData: [],
      is_Province: "",
      is_City: "",
      ProvinceId: "",
      showCityData: [],
      AccountList: [],
      // 户号id
      AccountID: "",
      form: {
        account_name: "",
        account_number: "",
        province: "",
        city: "",
        // 选择账户类型
        charge_type: "1"
      },
      // 当前用户数组
      current: [],
      codeValue: "",
      showKeyboard: false
    };
  },
  created() {
    this.goodsInfo = this.goods_info.get_goods;
    this.rechargeType = this.goodsInfo.has_many_specs[0];
    this.handClickSpecs(this.rechargeType.specitem[0]);

    //轮播图
    if (this.goods_info && this.goods_info.plugin && this.goods_info.plugin.electricityBillPro) {
      this.bannerUrl = this.goods_info.plugin.electricityBillPro.banner;
    }
    this.rechargeItem.desc_text = this.goods_info.plugin.electricityBillPro.desc;

    //客服相关
    if (this.goods_info.customer_service) {
      // 客服
      this.service_QRcode = this.goods_info.customer_service.service_QRcode;
      this.service_mobile = this.goods_info.customer_service.service_mobile;
      this.cservice = this.goods_info.customer_service.cservice;
    }

    //猜你喜欢
    let show_push = this.goodsInfo.show_push.slice(0, 30);
    let likeArr = [];
    show_push.forEach(function (item, index) {
      var num = Math.floor(index / 6); //
      if (!likeArr[num]) {
        likeArr[num] = [];
      }
      likeArr[num].push(item); //将数据添加到数组里
    });
    this.likeArr = likeArr;

    //分享
    this.fun.wxShare(
      "",
      { mid: this.fun.getKeyByMid(), goods_id: this.goodsInfo.id },
      {
        title: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_title ? this.goodsInfo.has_one_share.share_title : this.goodsInfo.title,
        imgUrl: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_thumb ? this.goodsInfo.has_one_share.share_thumb : this.goodsInfo.thumb,
        description: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_desc ? this.goodsInfo.has_one_share.share_desc : ""
      }
    );
    this.handleScroll();
    this.getDataAccountList();
  },
  destroyed() {
    window.removeEventListener("scroll", this.windowScroll);
  },
  watch: {
    codeValue(nval, oval) {
      if (this.codeValue.length == 6) {
        this.showKeyboard = false;
      }
    },
    selectUserShow(nval,oval){
      console.log(nval,oval)
    }
  },
  computed: {
    
  },
  methods: {
    checkProvince() {
      let pro = this.form.province;
      if (pro == "广东省") {
        return true;
      } else if (pro == "广西壮族自治区") {
        return true;
      } else if (pro == "云南省") {
        return true;
      } else if (pro == "贵州省") {
        return true;
      } else if (pro == "海南省") {
        return true;
      } else if (pro == "澳门特别行政区") {
        return true;
      } else if (pro == "香港特别行政区") {
        return true;
      } else {
        return false;
      }
    },
    editUserShowTap() {
      this.editUserShow = true;
      this.form = {
        account_name: "",
        account_number: "",
        province: "",
        city: "",
        charge_type: "1"
      };
      this.codeValue = "";
    },
    newCreate() {
      this.form = {
        account_name: "",
        account_number: "",
        province: "",
        city: "",
        charge_type: "1"
      };
      this.AccountID = "";
      this.editUserShow = true;
    },
    keyTest(e, item) {
      console.log(e.target.value, item);
      if (item > 1) {
        item = item - 1;
        this.$nextTick(() => {
          this.$refs[`inp${item}`][0].focus();
        });
      }
    },
    testinp(e, item) {
      if (e.target.value.length > 1) {
        let oval = e.target.value.substr(0, 1);
        let nval = e.target.value.substr(1, 1);
        if (item < 6) {
          item = item + 1;
          this.$nextTick(() => {
            this.$refs[`inp${item}`][0].focus();
            this.$refs[`inp${item}`][0].value = nval;
          });
        }
        e.target.value = oval;
      }
      return;
    },
    saveBox() {
      if (this.fun.isTextEmpty(this.form.account_name)) {
        this.$toast("填写户名");
        return;
      } else if (this.fun.isTextEmpty(this.form.account_number)) {
        this.$toast("请输入缴费户号");
        return;
      } else if (this.fun.isTextEmpty(this.form.province) || this.fun.isTextEmpty(this.form.city)) {
        this.$toast("请选择所在省市");
        return;
      }
      if (this.checkProvince()) {
        if (this.fun.isTextEmpty(this.codeValue)) {
          this.$toast("请输入身份证/营业执照/机构代码后6位");
          return;
        } else if (this.codeValue.length < 6) {
          this.$toast("请输入身份证/营业执照/机构代码后6位");
          return;
        }
        this.form.code = this.codeValue;
      }
      console.log(this.form)
      let url = "plugin.electricity-bill-pro.frontend.accountUser.saveAccount";
      let json = this.form;
      json = JSON.stringify(json);
      let getJson = {
        form: json
      };
      if (this.AccountID) {
        getJson.id = this.AccountID;
      }
      
      $http
        .get(url, getJson, "")
        .then(response => {
          if (response.result == 1) {
            this.AccountID = "";
            this.editUserShow = false;
            this.getDataAccountList();
            this.$toast(response.msg);
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(error => {
          toastPoster.clear();
        });
    },
    // 获取户名列表
    getDataAccountList() {
      let url = "plugin.electricity-bill-pro.frontend.accountUser.getAccountList";
      $http
        .get(url, {}, "")
        .then(response => {
          if (response.result == 1) {
            this.AccountList = response.data;
            this.current = response.data[0];
            this.radioAccount = response.data[0].id;
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(error => {
          // toastPoster.clear();
        });
    },
    currentChange(e) {
      for (let i = 0; i < this.AccountList.length; i++) {
        console.log(this.AccountList[i].id);
        if (this.AccountList[i].id == e) {
          this.current = this.AccountList[i];
          this.selectUserShow = false;
        }
      }
      // console.log(this.current)
    },
    addressShowProvince() {
      $http.post("plugin.electricity-bill-pro.frontend.accountUser.getRegion", "").then(
        response => {
          if (response.result == 1) {
            console.log(response);
            this.provinceData = response.data;
            // // this.cityData = response.data.city;
            this.addressShow_p = true;
            // this.editUserShow = false;
          }
        },
        response => {
          this.$dialog.alert({ message: response.msg });
        }
      );
    },
    // 编辑
    editIcon(item) {
      console.log(item);
      this.form.province = item.province;
      if(this.checkProvince()){
        if(item.code){
          this.codeValue = item.code;
        }else{
          this.codeValue = ''
        }
      }
      this.selectUserShow = false;
      this.editUserShow = true;
      this.form.account_name = item.account_name;
      this.form.account_number = item.account_number;
      this.form.province = item.province;
      this.form.city = item.city;
      this.form.charge_type = String(item.charge_type);
      this.AccountID = item.id;
      // console.log(this.form)
    },
    delIcon(item) {
      this.$dialog
        .confirm({
          title: "",
          message: "是否删除户号"
        })
        .then(() => {
          $http.post("plugin.electricity-bill-pro.frontend.accountUser.delAccount", { id: item.id }, "").then(
            response => {
              if (response.result == 1) {
                this.$toast(response.msg);
                this.getDataAccountList();
                this.selectUserShow = true;
              }
            },
            response => {
              this.$dialog.alert(response.msg);
            }
          );
        });
    },
    addressCallback(e, ind) {
      // if (this.provinceData[ind[0]].children[ind[1]].is_open == 0) {
      //   this.$toast("该地区不支持电费充值");
      // } else {
        this.form.province = e[0];
        this.form.city = e[1];
        this.addressShow_p = false;
        this.codeValue = '';
      // }
    },
    //  addressShowCity(){

    // },
    addressCallback_c(e) {
      this.is_City = e.areaname;
      this.addressShow_p = false;
      this.addressShow_c = false;
    },
    onCancel() {
      this.addressShow_p = false;
      this.addressShow_c = false;
    },
    tapSelect_btn() {
      this.tapSelect = !this.tapSelect;
    },
    handleScroll() {
      window.addEventListener("scroll", this.windowScroll);
    },
    windowScroll() {
      let scroll = document.documentElement && document.documentElement.scrollTop;
      if (scroll >= 50 && this.titleBgMode == "transparent") {
        this.titleBgMode = "white";
      } else if (scroll <= 50 && this.titleBgMode == "white") {
        this.titleBgMode = "transparent";
      }
    },
    changeSwipeIndex(index) {
      this.swipeIndex = index;
    },
    gotoGoods(id) {
      this.$router.push(this.fun.getUrl("goods", { id }));
    },
    gotoOrderList() {
      this.$router.push(this.fun.getUrl("orderlist", { status: "1" }));
    },
    setTopping() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    },

    handClickSpecs(item) {
      if (this.rechargeSpecId == item.id) return;
      this.rechargeSpecId = item.id;
      let has_many_options = this.goodsInfo.has_many_options;
      let arr = [];
      for (let i = 0; i < has_many_options.length; i++) {
        // if (has_many_options[i].specs.indexOf(item.id) >= 0) {
        arr.push(has_many_options[i]);
        // }
      }
      this.displayOptions = arr;
      this.optionsId = 0;
    },
    handClickOptions(item) {
      this.optionsId = item.id;
    },
    sendRecharge() {
      // 手机慢充
      // if (!this.mobile) {
      //   this.$toast("请输入充值手机号码！");
      //   return false;
      // } else {
      //   let reg_txt = /^[1][0-9]{10}$/;
      //   if (!reg_txt.test(this.mobile)) {
      //     this.$toast("请输入正确的充值手机号码！");
      //     return false;
      //   }
      // }
      if (this.optionsId <= 0) return this.$toast("请选择充值金额");
      if (!this.current) return this.$toast("请选择户号");
      let json_data = {
        goodsId: this.goodsInfo.id,
        optionsId: this.optionsId,
        total: 1,
        tag: -2,
        account_id: this.current.id,
        electricity: "electricity"
      };
      this.$router.push(this.fun.getUrl("goodsorder", {}, json_data));
    },

    gotoBack() {
      let ua = window.navigator.userAgent.toLowerCase();
      if (this.fun.isCPS() && ua.indexOf("yz_cps01") > -1) {
        if (this.fun.isIosOrAndroid() === "ios") {
          routeBackUrlIOS({ body: "routeBackUrlIOS" });
        } else {
          routeBackUrlAndroid();
        }
        return;
      }
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else if (this.url) {
        this.$router.push(this.fun.getUrl(this.url));
      } else {
        this.$router.go(-1);
      }
    },

    gotoHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },

    //海报生成
    postShow() {
      if (!this.fun.isTextEmpty(this.posterImg)) {
        this.posterShow = true;
      } else {
        let toastPoster = this.$toast({
          duration: -1, // 持续展示 toast
          message: "正在为您生成海报中"
        });
        let url = "";
        let Jons = {};
        this.isFrontCanvas = true;
        url = "goods.goods-poster.new-goods-poster";
        Jons = {
          id: this.$route.params.id
        };

        Jons.id = this.$route.params.id;
        $http
          .get(url, Jons, "")
          .then(response => {
            toastPoster.clear();
            if (response.result == 1) {
              // isFrontCanvas 是否需要前端生成海报
              this.posterImg = this.isFrontCanvas ? response.data : `${response.data.image_url}?${Date.now()}`;
              this.posterShow = true;
            } else {
              this.posterShow = false;
              this.$toast(response.msg);
            }
          })
          .catch(error => {
            toastPoster.clear();
          });
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  min-height: 100vh;
  padding-bottom: 3rem;
  background: rgb(247, 247, 247);
}

.pcStyle {
  width: 375px;
  margin: 0 auto;
  left: 50% !important;
  margin-left: -187.5px;
}

.title {
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding-left: 1.281rem;
  padding-right: 1.281rem;
  z-index: 1;

  .title-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  }

  .icon-member-left {
    font-weight: bold;
    color: #fff;
  }

  .icon-fontclass-shouye {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
  }

  &.white {
    background: #fff;

    .title-icon-wrapper {
      background: transparent;
    }

    .icon-member-left {
      color: #000;
    }

    .icon-fontclass-shouye {
      color: #000;
    }
  }
}

.banner {
  width: 100%;
  min-height: 5rem;

  img {
    width: 100%;
    object-fit: contain;
  }
}

.recharge {
  width: 21.563rem;
  background-color: #fff;
  margin: -2.3rem auto 0;
  border-radius: 0.469rem;
  overflow: hidden;

  .tabs {
    display: flex;
    height: 2.813rem;

    .tabs-item {
      flex: 1;
      display: flex;
      align-items: center;
      height: 100%;
      font-size: 16px;
      color: #000;
      background-color: #fff;
      width: 100%;
      padding: 0 1rem;

      &.active {
        color: #8c5a04;
        background-color: #e6c36a;
      }
    }
  }

  .recharge-box {
    padding: 1.306rem 1rem 0.8rem;
    text-align: left;

    .input-box {
      border-bottom: 0.05rem solid #d4d4d4;
      padding-bottom: 0.66rem;
      padding-left: 0.469rem;

      input {
        font-size: 18px;
        color: #d5d5d5;
        border: none;
      }
    }
    .inpInofBox {
      display: flex;
      align-items: center;
      .right {
        font-size: 0.63rem;
        color: #9a9a9a;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
      .line {
        width: 0.03rem;
        height: 0.75rem;
        background-color: #d0d0d0;
        margin-left: 0.75rem;
        margin-right: 0.59rem;
      }
      .left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        max-width: 60%;
        .leftTxt {
          font-size: 1.13rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .leftIcon {
          width: 0.94rem;
          height: 0.94rem;
          background-color: #fe6402;
          border: solid 0.03rem #fe6402;
          font-size: 0.63rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100%;
          color: #fff;
          margin-right: 0.38rem;
          flex-shrink: 0;
        }
      }
    }
    .desc {
      padding-left: 0.469rem;
      padding-top: 0.66rem;
      font-size: 11px;
      color: #6c6c6c;
    }

    .recharge-title {
      margin-top: 1.45rem;
      font-size: 13px;
      color: #242424;
    }

    .recharge-items {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 0.625rem;
      padding-top: 0.7rem;

      .recharge-item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 6.031rem;
        height: 6.25rem;
        padding-top: 1.5rem;
        border-radius: 0.313rem;
        border: solid 0.031rem #acacac;
        margin-bottom: 1rem;

        .recharge-activity {
          position: absolute;
          left: 0;
          top: 0;
          font-size: 11px;
          color: #fff;
          padding: 0.125rem 0.344rem 0.156rem 0.438rem;
          background-image: linear-gradient(90deg, #fe3b42 0%, #fe6355 100%);
          border-radius: 0.313rem 0 0.313rem 0;
        }

        .recharge-price {
          font-size: 30px;
          color: #3b3b3b;

          span {
            font-size: 14px;
          }
        }

        .recharge-discount {
          margin-top: 0.4rem;
          font-size: 11px;
          color: #8c5a04;
        }

        &.active {
          border: none;
          background-color: rgba(245, 154, 31, 0.4);
          box-shadow: 0 0.125rem 0.366rem 0.041rem rgba(201, 129, 30, 0.76);

          .recharge-price {
            color: #fe6402;
          }
        }
      }
    }
  }
}

.like-box {
  width: 21.563rem;
  margin: 0.625rem auto 0;
  padding: 0.688rem 0.656rem;
  text-align: left;
  background-color: #fff;
  border-radius: 0.469rem;

  .like-box-title {
    font-size: 15px;
    font-weight: bold;
    color: #5f5e5e;
  }

  .like-box-goods {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 0.625rem;
    grid-row-gap: 0.625rem;
    padding-top: 0.875rem;

    .like-box-good {
      overflow: hidden;

      .good-face {
        width: 6.313rem;
        height: 6.313rem;
        border-radius: 0.188rem;

        img {
          width: 6.313rem;
          height: 6.313rem;
          border-radius: 0.188rem;
        }
      }

      .good-name {
        padding-top: 0.5rem;
        font-size: 11px;
        font-weight: bold;
        color: #3e3e3e;
      }

      .good-price {
        padding-top: 0.3rem;
        font-size: 12px;
        font-weight: bold;
        color: #f14e4e;
      }
    }
  }

  .van-indicator {
    display: flex;
    justify-content: center;
    padding-top: 1.2rem;
    padding-bottom: 0.6rem;

    .li {
      width: 0.25rem;
      height: 0.25rem;
      margin-right: 0.406rem;
      background-color: #c2c2c2;

      &.active {
        width: 0.469rem;
        height: 0.25rem;
        background-color: #f14e4e;
        border-radius: 0.125rem;
      }
    }
  }
}

.goods-details {
  margin-top: 0.625rem;
  padding-bottom: 0.625rem;
  background: #fff;

  .goods-details-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    color: #999;

    .line {
      width: 4rem;
      height: 2px;
      border-radius: 1px;
      background: rgb(213, 214, 216);
    }

    .text {
      padding: 0 0.5rem;
    }
  }
}

.fixed-qrcode {
  position: fixed;
  right: 50%;
  transform: translateX(11rem);
  bottom: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;

  .iconfont {
    font-size: 20px;
    color: #fff;
  }
}

.fixed-topping {
  position: fixed;
  right: 50%;
  transform: translateX(11rem);
  bottom: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;

  .iconfont {
    font-size: 22px;
    color: #fff;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 2.813rem;

  .footer-left {
    display: flex;
    justify-content: space-evenly;
    width: 9.125rem;
    background-color: #fff;

    .footer-left-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #8c8c8c;
      font-size: 10px;
      font-weight: bold;

      .iconfont {
        color: #3c3c3c;
      }

      .icon-fontclass-kefu {
        font-size: 18px;
        height: 19px;
      }
    }
  }

  .footer-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    color: #8c5a04;
    background-color: #e6c36a;
  }
}
.lineTitle {
  display: flex;
  align-items: center;
  padding: 0 0.94rem;
  .lineInp {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    .van-cell {
      padding-left: 0.47rem;
      border-bottom: 1px solid #e8e8e8;
    }
  }
}
.lineboxCard {
  display: flex;
  flex-direction: column;
  padding: 0.56rem 0.94rem;
  .lineInp{
    border-bottom: 1px solid #e8e8e8;
    .van-cell{
      padding:0 0 10px 0;
    }
  }
  .lineTxt {
    text-align: left;
    margin-bottom: 0.56rem;
  }
  .van-password-input__item {
    background: #f2f2f2;
  }
  .circle {
    border: 0.03rem solid #bdbfc3;
    width: 1.5rem;
    height: 1.8rem;
    .van-cell {
      padding: 0;
    }
  }
  .inpBox {
    display: flex;
    .inpBoxR {
      margin-right: 0.325rem;
      width: 2rem;
      height: 2.6rem;
      background: #f2f2f2;
      input {
        border: none;
        width: 100%;
        height: 100%;
        text-align: center;
      }
    }
  }
}
.linebox {
  display: flex;
  align-items: center;
  padding: 0.56rem 0.94rem;
  .lineSelect {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.saveBox {
  width: 20rem;
  height: 2.5rem;
  background-color: #f14e4e;
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-left: 7.3%;
  margin-bottom: 1rem;
}
.accountType {
  padding: 1.88rem 0.94rem 4rem 0.94rem;
  .groupList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.75rem 1.06rem 0.75rem;
  }
}

.listBox_se {
  padding: 0 0.94rem;
  padding-bottom: 1.5rem;
  .lis {
    height: 3.72rem;
    border-bottom: #e8e8e8 1px solid;
    display: flex;
    align-items: center;
    .icon {
      width: 1.25rem;
      height: 1.25rem;
      background-color: #fe6402;
      border-radius: 100%;
      font-size: 0.75rem;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-right: 0.66rem;
    }
    .lis_detail {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
      .lis_detail_bottom {
        display: flex;
        align-items: center;
        color: #737272;
        font-size: 0.75rem;
      }
      .lis_detail_top {
        width: 100%;
        display: flex;
        align-items: center;
        .lis_detail_top_title {
          font-size: 0.94rem;
        }
        .line {
          width: 0.03rem;
          height: 0.63rem;
          background-color: #c1c0c0;
          margin: 0 0.63rem;
        }
        .lis_icon {
          display: flex;
          align-items: center;
          margin-left: 0.72rem;
          .iconfont {
            color: #fe0202;
          }
        }
      }
    }
    .iconRight {
    }
  }
}
.tipsBox {
  padding: 0 0.94rem;
  .tipsTop {
    display: flex;
    align-items: center;
    .tipsTop_box {
      width: 1rem;
      height: 1rem;
      background-color: #fe6402;
      border: solid 0.03rem #fe6402;
      margin-right: 0.44rem;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .iconfont {
        color: #fff;
        font-size: 11px;
      }
    }

    font-size: 0.94rem;
  }
  .tipsBottom {
    text-align: left;
    margin-top: 0.63rem;
    width: 100%;
    background: #f3f3f3;
    border-radius: 0.19rem;
    padding: 0.91rem 0.69rem;
    font-size: 0.75rem;
    color: #606060;
  }
}
.acctips {
  font-size: 0.69rem;
  color: #fe3c43;
  margin-top: 0.63rem;
  margin-top: 0.23rem;
  margin-left: 0.53rem;
}
</style>
