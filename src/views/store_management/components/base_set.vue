<template>
  <div class="base-goods-info">
      <div class="goods-form">
        <div class="cell" style="margin-top: 0">
          <div class="loader-imgs">
            <van-field required label="商品图片：" :readonly="true"></van-field>
            <div style="margin-left: 1rem;">
              <van-uploader
                :after-read="(e, flag) => multipleMethod_1(e, flag, 'goods-img')"
                :deletable="false"
              >
                <img v-if="goodsImg" :src="goodsImg" class="uploader-img" alt="">
                <div v-else class="uploader-icon">
                  <img :src="require('../../../assets/images/up_icon.png')"/>
                </div>
              </van-uploader>
            </div>
          </div>
          <div class="loader-imgs">
            <van-field label="其他图片：" :readonly="true"></van-field>
            <div style="display: flex; flex-wrap: wrap; margin-left: 1rem;">
              <div v-for="(item, index) in otherImgs" :key="index" style="margin-right: 1rem;margin-bottom: 1rem">
                <div class="photobox">
                  <img :src="item" style="width: 100%;" />
                  <i class="iconfont icon-all_filldelete" @click="removeOtherImg(index)"></i>
                </div>
              </div>
              <van-uploader
                :after-read="(e, flag) => multipleMethod_1(e, flag, 'other-img')"
                :before-delete="removeOtherImgs"
                multiple
              >
                <div class="uploader-icon">
                  <img :src="require('../../../assets/images/up_icon.png')"/>
                </div>
              </van-uploader>
            </div>
          </div>
        </div>

        <div class="cell" v-if="!goodsId">
            <!-- 只有发布商品才能编辑 商品详情- -->
            <input-cell labelText="商品详情：" :isReadonly="true" :value="goodsDetail ? '修改' : '添加'" @click.native="showGoodsDetailPop"></input-cell>
        </div>
        <div class="cell">
            <van-field v-model="goodsName" required label="商品名称：" placeholder="请输入商品名称"></van-field>
        </div>
        <div class="cell">
          <input-cell @click.native="showCategoryPop" labelText="商品分类："
            :isReadonly="true" :isRequired="true" value="商品分类"
          ></input-cell>
          <div style="white-space: pre-wrap;">
            <div
              v-for="(tag, index) in goodsCategory" :key="index"
              class="category-tag"
              @click="showCategoryPop(tag, index)"
            >
              <div style="background-color:#F3F3F3;padding: 0.2rem 0.5rem;">
                <span v-if="tag.parent_name">{{tag.parent_name}}</span>
                <span v-if="tag.child_name">/{{tag.child_name}}</span>
                <span v-if="tag.third_name">/{{tag.third_name}}</span>
              </div>
              <span class="close-icon" @click.stop="removeCategory(index)">x</span>
            </div>
          </div>
        </div>
        <div class="cell">
          <input-cell labelText="商品类型：" @click.native="showGoodsTypePop" :isReadonly="true"  :value="goodsType==1?'实体商品':'虚拟商品'"></input-cell>
          <van-field label="下单是否需要地址：" :readonly="true" v-if="goodsType == 2">
            <template #right-icon>
              <van-switch v-model="needAddress" size="18px" :active-value="1" :inactive-value="0" inactive-color="#bebebe"></van-switch>
            </template>
          </van-field>
        </div>
        <div class="cell">
            <van-field v-model="goodsUnit" required label="商品单位：" placeholder="请输入商品单位"></van-field>
        </div>
        <div class="cell">
            <van-field v-model="price" required label="商品现价：" placeholder="请输入商品现价" type="number"></van-field>
            <van-field v-model="marketPrice" label="商品原价：" placeholder="请输入商品原价" type="number"></van-field>
            <van-field v-model="costPrice" label="商品成本：" placeholder="请输入商品成本" type="number"></van-field>
        </div>
        <div class="cell">
          <van-field v-model="stock" required label="商品库存：" placeholder="请输入商品库存"></van-field>
          <input-cell labelText="减库存的方式：" :isReadonly="true"  :value="stockTypeText" @click.native="showStockTypePop"></input-cell>
        </div>
        <div class="cell">
          <van-field label="不可退货退款：" :readonly="true">
            <template #right-icon>
              <van-switch v-model="refund" size="18px" :active-value="1" :inactive-value="0" inactive-color="#bebebe"></van-switch>
            </template>
          </van-field>
        </div>

        <div :class="['hide-logistics', viewMore ? 'show-logistics' : '']">
          <div style="padding: 5px 16px;">配送</div>
          <div class="cell">
            <input-cell labelText="运费设置：" :isReadonly="true"  :value="dispatchData.type ? '统一邮费' : '运费模板'" @click.native="showDispatchTypePop"></input-cell>
            <input-cell labelText="配送方式：" :isReadonly="true"  :value="distributeTypeText" @click.native="showDistributeTypePop"></input-cell>
          </div>
        </div>
        <!-- 更多设置 -->
        <div class="more" @click="viewMoreSet">
          <span>{{viewMore ? '收起' : '更多设置'}}</span>
          <van-icon v-if="viewMore" name="arrow-up"></van-icon>
          <van-icon v-else name="arrow-down"></van-icon>
        </div>
      </div>

      <goods-detail-popup ref="detailPopup" :defaultType="goodsDetail" @saveDetail="saveGoodsDetail"></goods-detail-popup>
      <goods-category-popup ref="categoryPopup" :categoryList="categoryMenus" @confirmType="editCategory"></goods-category-popup>
      <goods-type-popup ref="typePopup" :defaultType="goodsType" @confirmType="editGoodsType"></goods-type-popup>
      <stock-type-popup ref="stockPopup" :defaultType="stockType" @confirmType="editStockType"></stock-type-popup>
      <dispatch-type-popup ref="dispatchPopup" :templates="dispatchTemplates" :defaultData="dispatchData" @confirmType="editDispatch"></dispatch-type-popup>
      <distribute-type-popup ref="distributePopup" :dispatchTypeList="dispatchTypes" :defaultChecks="distributes" @confirmType="editDistribute"></distribute-type-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import inputCell from "./inputCell";
import goodsDetailPopup from "./baseInfo_popups/goods_detail_pop";
import goodsTypePopup from "./baseInfo_popups/goods_type_pop";
import stockTypePopup from "./baseInfo_popups/stock_type_pop";
import dispatchTypePopup from "./baseInfo_popups/dispatch_type_pop";
import goodsCategoryPopup from "./baseInfo_popups/goods_category_pop";
import distributeTypePopup from "./baseInfo_popups/distribute_type_pop";
export default {
  props: {
    goodsInfo: {
      type: Object,
    },
    categoryMenus: {
      type: Array,
      default () {
        return [];
      }
    },
    dispatchTemplates: {
      type: Array,
      default () {
        return [];
      }
    },
    dispatchTypes: {
      type: Array,
      default () {
        return [];
      }
    },
  },
  data () {
    return {
      goodsId: '',
      goodsData: {}, // 商品数据

      goodsImg: '',
      otherImgs: [],
      goodsDetail: '', // 商品详情
      goodsName: '', // 商品名称
      goodsCategory: [], // 商品分类
      goodsType: 1, // 商品类型 1实体商品 2虚拟商品
      needAddress: 0, // 是否需要填写收货地址 1是 0否
      goodsUnit: '', // 商品单位
      price: '', // 商品现价
      marketPrice: '', // 商品原价
      costPrice: '', // 商品成本
      stock: '', // 库存
      stockType: 0, // 减库存方式 0拍下减库存 1付款减库存 2不减库存
      refund: 0, // 能否退款 0否 1是

      viewMore: false,
      dispatchData: { // 运费设置 1统一邮费(params:邮费) 0邮费模板(type:模板参数)
        dispatch_type: 0,
        dispatch_price: 0,
        dispatch_id: '',
      },
      distributes: [],
    };
  },
  mounted () {
    this.goodsId = this.$route.params.id;
    if (this.goodsInfo) {
      this.goodsData = JSON.parse(JSON.stringify(this.goodsInfo));
      this.splitGoodsData(this.goodsData);
    }
    // this.goodsData = JSON.parse(JSON.stringify(this.goodsInfo));
    // this.splitGoodsData(this.goodsData);
  },
  computed: {
    stockTypeText () {
      let text = '';
      switch (this.stockType) {
      case 0:
        text = '拍下减库存';
        break;
      case 1:
        text = '付款减库存';
        break;
      case 2:
        text = '永不减库存';
        break;
      default:
        break;
      }
      return text;
    },
    distributeTypeText () {
      let typeTexts = [];
      let arr = this.dispatchTypes.filter((item) => {  return this.distributes.indexOf(item.id+'') > -1;});
      typeTexts = arr.map((pre, current) => {
        return pre.name;
      });
      return typeTexts.join("/");
    },
  },
  methods: {
    // 校验数据
    validatorData () {
      if (this.fun.isTextEmpty(this.goodsImg)) {
        this.$toast('请选择商品图片');
        return false;
      }
      if (this.fun.isTextEmpty(this.goodsName)) {
        this.$toast('请输入商品名称');
        return false;
      }
      if (this.goodsCategory.length <= 0) {
        this.$toast('请选择商品分类');
        return false;
      }
      if (this.fun.isTextEmpty(this.goodsName)) {
        this.$toast('请输入商品名称');
        return false;
      }
      if (this.fun.isTextEmpty(this.goodsType)) {
        this.$toast('请选择商品类型');
        return false;
      }
      if (this.fun.isTextEmpty(this.price)) {
        this.$toast('请输入商品现价');
        return false;
      }
      if (this.fun.isTextEmpty(this.stock)) {
        this.$toast('请输入商品库存');
        return false;
      }
      let data = {
        goods_type: this.goodsType,
        status: 1, // 上架
        title: this.goodsName,
        thumb: this.goodsImg,
        thumb_url: this.otherImgs,
        sku: this.goodsUnit,
        content: this.goodsDetail,
        market_price: this.marketPrice,
        price: this.price,
        cost_price: this.marketPrice,
        stock: this.stock,
        reduce_stock_method: this.stockType,
        no_refund: this.refund,
        need_address: this.needAddress,
        category: this.filterCategory(this.goodsCategory)
      };
      data.widgets = {
        dispatch: {
          ...this.dispatchData,
          dispatch_type_ids: this.distributes
        }
      };
      return data;
    },

    // 过滤分类数据
    filterCategory (arr) {
      let parentid = [];
      let childid = [];
      let thirdid = [];
      arr.forEach((item, index) => {
        if (item.parentid) parentid.push(item.parentid);
        if (item.childid) childid.push(item.childid);
        if (item.thirdid) thirdid.push(item.thirdid);
      });
      return {parentid, childid, thirdid};
    },

    // 数据分解
    splitGoodsData (goodsData) {
      this.goodsImg = goodsData.thumb_src;
      this.otherImgs = goodsData.thumb_url_src ? goodsData.thumb_url_src : [];
      this.goodsDetail = goodsData.content;
      this.goodsName = goodsData.title;
      this.goodsType = goodsData.type;
      this.needAddress = goodsData.need_address ? goodsData.need_address : 0;
      this.goodsUnit = goodsData.sku;
      this.price = goodsData.price;
      this.marketPrice = goodsData.market_price;
      this.costPrice = goodsData.cost_price;
      this.stock = goodsData.stock;
      this.stockType = goodsData.reduce_stock_method;
      this.refund = goodsData.no_refund;
      this.goodsCategory = goodsData.has_many_goods_category ? goodsData.has_many_goods_category : [];
      // 配送设置
      if ( goodsData.widgets && goodsData.widgets.dispatch ) {
        let dispatch = goodsData.widgets.dispatch;
        this.dispatchData.dispatch_type = dispatch.dispatch_type;
        this.dispatchData.dispatch_price = dispatch.dispatch_price;
        this.dispatchData.dispatch_id = dispatch.dispatch_id;
        this.distributes = dispatch.dispatch_type_ids;
      }
    },

    multipleMethod_1(e, flag, type) {
      if (type === 'goods-img') {
        this.LOADER_IMGS = 'goodsImgs';
      } else {
        this.LOADER_IMGS = 'otherImgs';
      }
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead_1(e[i], flag, type);
        }
      } else {
        this.onRead_1(e, flag, type);
      }
    },
    // vant 多图片上传
    onRead_1(e, flag, type) {
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios.post(this.fun.getRealUrl("upload.uploadPic"),fd,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      )
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (type === 'goods-img') {
              That.goodsImg = responseData.data.img_url;
            } else {
              That.otherImgs.push(responseData.data.img_url);
            }
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
        });
    },

    // 删除图片
    removeOtherImg (index) {
      this.otherImgs.splice(index, 1);
    },

    // 商品详情
    showGoodsDetailPop () {
      this.$refs.detailPopup.showPopup();
    },
    saveGoodsDetail (event) {
      this.goodsDetail = event;
    },
    // 删除分类
    removeCategory (index) {
      this.goodsCategory.splice(index, 1);
    },

    // 商品类型
    showGoodsTypePop () {
      this.$refs.typePopup.showPopup(this.goodsType);
    },
    editGoodsType (event) {
      this.goodsType = event;
    },

    // 减库存方式
    showStockTypePop () {
      this.$refs.stockPopup.showPopup();
    },
    editStockType (event) {
      this.stockType = event;
    },

    // 运费
    showDispatchTypePop () {
      this.$refs.dispatchPopup.showPopup();
    },
    editDispatch (event) {
      this.dispatchData = event;
    },

    // 商品分类
    showCategoryPop (activeTag, index) {
      if (index !== undefined && index !== '') {
        this.addCategoryIndex = index;
      } else {
        this.addCategoryIndex = '';
      }
      this.$refs.categoryPopup.showPopup(activeTag);
    },
    editCategory (event) {
      let isRepeat = this.goodsCategory.some(item => {
        if (event.thirdid) {
          return (item.parentid == event.parentid) && (item.childid == event.childid) && (item.thirdid == event.thirdid);
        } else {
          return (item.parentid == event.parentid) && (item.childid == event.childid);
        }
      });
      if (isRepeat) {
        return this.$toast('不能重复添加商品分类');
      }
      if (this.addCategoryIndex !== undefined && this.addCategoryIndex !== '') {
        this.goodsCategory.splice(this.addCategoryIndex, 1, event);
      } else {
        this.goodsCategory.push(event);
      }
    },

    // 配送方式
    showDistributeTypePop () {
      this.$refs.distributePopup.showPopup();
    },
    editDistribute (event) {
      this.distributes = event;
    },

    viewMoreSet () {
      this.viewMore = !this.viewMore;
    },


  },

  components: {
    inputCell,
    goodsDetailPopup,
    goodsTypePopup,
    stockTypePopup,
    dispatchTypePopup,
    goodsCategoryPopup,
    distributeTypePopup,
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .goods-form{
    overflow: hidden;
    .cell {
      margin-top: 0.62rem;
      text-align: left;
      background-color: #ffffff;
      white-space: nowrap;
      .van-cell::before{
        left: 4px;
        top: 14px;
        font-weight: 800;
      }
    }
    .loader-imgs {
      padding: 0.5rem 1rem 0.5rem 0;
      .cell-title {
        margin-bottom: 0.5rem;
        .icon-fontclass-xinghao {
          height: 12px;
          color: #ee2e2b;
          font-size: 10px;
        }
      }
      .photobox {
        position: relative;
        width: 5rem;
        height: 5rem;
        // border: 1px dashed #c0ccda;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
        img {
          width: 100%;
          height: 100%;
        }
        i {
          position: absolute;
          top: -0.6rem;
          right: -0.6rem;
          font-size: 1rem;
          color: #606060;
        }
      }
      .uploader-img{
        display: inline-block;
        margin-right: 0.5rem;
        width: 80px;
        height: 80px;
        vertical-align: bottom;
      }
      .uploader-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;
        width: 80px;
        height: 80px;
        border: 1px dashed #c0ccda;
        margin: 0 auto;
        img {
          width: 80%;
          height: 80%;
        }
      }
      /deep/ .van-cell::after {
        border: none;
      }
      /deep/ .van-uploader__input-wrapper {
        width: auto;
      }
    }
    .category-tag {
      position: relative;
      display: inline-block;
      color: #9897A4;
      padding: 0.5rem;
      font-size: 0.625rem;
      .close-icon {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 1rem;
      }
    }
    .more {
      margin: 1rem auto;
      color: #f15353;
    }
    .hide-logistics {
      text-align: left;
      max-height: 0rem;
      overflow: hidden;
      transition: max-height ease-in-out 0.5s;
    }
    .show-logistics {
      max-height: 30rem;
    }
  }
</style>