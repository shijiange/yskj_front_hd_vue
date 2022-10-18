<template>
  <div id="yz_specs">
    <van-popup v-model="popupSpecs" position="bottom" class="mint-popup-4 pcStyle_mint set-pc-styleLeft" :close-on-click-overlay="false" round closeable @close="close">
      <div class="specifications">
        <div class="shopimg">
          <div id="chooser_img" @click="showSkuImages_Methob">
            <img :src="popThumb" />
          </div>
          <div class="right">
            <slot name="sku-header-price">
              <div class="price" :style="{ color: `${themeColor}` }">
                {{ $i18n.t("money") }}
                <span id="option_price">{{ popPrice }}</span>
                <span v-if="isRent">/天</span>
              </div>
            </slot>
            <slot name="sku-header-stock">
              <div class="option">库存{{ popStock }}{{ popUnit }}</div>
            </slot>
            <slot name="sku-header-description">
              <div class="option" v-if="popDescription">{{ popDescription }}</div>
            </slot>
            <slot name="sku-header-other"></slot>
          </div>
        </div>

        <div class="sku-body-box">
          <slot name="sku-body-top"></slot>

          <div class="shopinfo noVantRadio" v-if="specs.length !== 0">
            <dl v-for="(specsParent, i) in specs" :key="i">
              <dt>{{ specsParent.title }}</dt>
              <dd>
                <van-radio-group v-model="specsParent.description" checked-color="#f15353" @change="selectSpecs">
                  <van-radio
                    :class="{ vantRadioshow: specsParent.description == specitem }"
                    :style="{
                      borderColor: `${themeColor}`,
                      backgroundColor: specsParent.description == specitem ? `${themeColor}` : '#fff',
                      color: specsParent.description != specitem ? `${themeColor}!important` : '#fff'
                    }"
                    :disabled="specitem.c"
                    v-for="(specitem, i) in specsParent.specitem"
                    :name="specitem"
                    :key="i"
                    :checked-color="`${themeColor}`"
                  >
                    {{ specitem.title }}
                  </van-radio>
                </van-radio-group>
              </dd>
            </dl>
          </div>

          <slot name="sku-body-bottom"></slot>
        </div>
        <slot name="sku-stepper">
          <div>
            <van-row>
              <div id="num">购买数量：</div>
              <van-stepper
                v-model.number="selectedNum"
                :min="startSaleNum"
                :max="quota == -1 ? optionsMaxCount : quota == 0 ? '' : quota"
                @plus="stepperPlus"
                @minus="stepperMinus"
                @change="stepperChange"
                integer
                ref="yz_specs_stepper"
                :disabled="disableStepperInput || optionsMaxCount == 0"
              />
            </van-row>
          </div>
        </slot>

        <div class="sku-buy-btn-style">
          <slot name="sku-buy-btn">
            <van-button :disabled="quota == -1 && optionsMaxCount == 0" :color="`${themeColor}`" type="danger" size="small" id="btsmall" block @click.stop="buyClicked">
              确认
            </van-button>
          </slot>
        </div>
      </div>
    </van-popup>
    <van-image-preview v-model="showSkuImages" ref="ImagePreview" :images="skuImages" @change="onChangeSkuImagesIndex" @close="onCloseSkuImages" :start-position="activeSkuIndex" :loop="false">
      <template v-slot:index></template>
      <template v-slot:cover>
        <div class="sku_price">
          <p v-if="goods.has_option == 1">{{ $i18n.t("money") }}{{ options[activeSkuIndex].product_price }}</p>
          <p v-if="goods.has_option == 0">{{ $i18n.t("money") }}{{ popPrice }}</p>
        </div>
      </template>
    </van-image-preview>
  </div>
</template>

<script>
var specsManage = []; //选择池 用于排序
var optionsId = 0; //选择后的 规格ID
export default {
  model: {
    prop: "popupSpecs",
    event: "onEmit"
  },
  props: {
    popupSpecs: {
      type: Boolean,
      default: false
    },
    isRent: {
      type: Boolean,
      default: false
    },
    //主题色
    themeColor: {
      type: String,
      default: "#f14e4e"
    },
    goods: {
      type: Object,
      default: () => ({})
    },
    goodSpecs: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    },
    disableStepperInput: {
      type: Boolean, //是否禁用步进器输入
      default: false
    },
    quota: {
      type: Number,
      default: -1 //限购数，-1按库存设置限购数，0不限购
    },
    startSaleNum: {
      type: Number,
      default: 1 //起售数量
    }
  },
  data() {
    return {
      popThumb: "", //顶部商品图片
      popPrice: "", //顶部商品价格
      popStock: null, //顶部商品库存
      popDescription: null, //顶部商品描述
      popUnit: "", //单位
      optionsMaxCount: 0, //库存
      selectedNum: 1, // 选择的商品数量
      specs: [],

      skuImages: [],
      showSkuImages: false,
      activeSkuIndex: 0,
      activeSkuIndex_1: null, //用于关闭时保存点击预览前的序号，在预览关闭时重新设置预览起始位置
      activeSkuIndex_2: null
    };
  },
  watch: {
    popupSpecs: function(newV, oldV) {
      if (newV) {
        this.initPopView();
      }
    }
  },
  created() {},
  components: {},
  computed: {},
  methods: {
    initPopView() {
      //初始化顶部商品信息
      console.log("初始化顶部商品信息", this.goods);
      this.popThumb = this.goods.hasOwnProperty("thumb") ? this.goods.thumb : "";
      this.popPrice = this.goods.hasOwnProperty("price") ? this.goods.price : "";
      this.popStock = this.goods.hasOwnProperty("stock") ? this.goods.stock : null;
      this.popUnit = this.goods.hasOwnProperty("unit") ? this.goods.unit : null;
      this.popDescription = null;
      this.specs = this.goodSpecs;

      specsManage = [];
      optionsId = 0;
      this.initSkuIMG();
      this.initSku();
    },
    initSku() {
      //默认选择第一个
      if (this.goods.has_option == 1) {
        if (this.fun.isTextEmpty(this.specs) || this.fun.isTextEmpty(this.options)) return;
        this.options.forEach((val, index) => {
          let _thumb = !this.fun.isTextEmpty(val.thumb) ? val.thumb : this.goods.thumb;
          this.skuImages.push(_thumb);
        });
        // 默认选择第一个
        for (let i = 0; i < this.specs.length; i++) {
          this.specs[i].description = this.specs[i].specitem[0];
          this.selectSpecs(this.specs[i].specitem[0]);
        }
      } else {
        this.optionsMaxCount = this.popStock;
        this.skuImages.push(this.goods.thumb);
      }
    },
    getSkuData() {
      let skuData = {
        price: this.popPrice,
        stock: this.popStock,
        selectedNum: this.selectedNum,
        has_option: this.goods.has_option,
        optionsId: optionsId
      };
      return skuData;
    },
    buyClicked() {
      //点击购买触发
      this.$emit("buy-clicked", this.getSkuData());
    },
    stepperPlus() {
      this.$emit("stepper-plus", this.getSkuData());
    },
    stepperMinus() {
      this.$emit("stepper-minus", this.getSkuData());
    },
    stepperChange() {
      this.$emit("stepper-change", this.getSkuData());
    },
    setPrice(e) {
      //设置价格
      if (e) this.popPrice = e;
    },
    setStock(e) {
      //设置库存
      if (e) this.popStock = e;
    },

    //界面选择规格触发事件
    selectSpecs(data) {
      this.manageSpecs(data); //处理选择池
      this.setGoodsSpecs(data); //处理规格组合选择状态
      this.setGoodsSpecsChangeInfo(); //设置选择规格后的 价格、照片、库存
      this.getMaxCount(); //判断当前购买总量与库存的关系
    },
    //处理选择池
    manageSpecs(data) {
      var specsObject = {};
      specsObject.id = data.id;
      specsObject.specid = data.specid;
      specsObject.title = data.title;

      if (specsManage.length > 0) {
        for (let i = 0; i < specsManage.length; i++) {
          if (specsManage[i].specid == specsObject.specid) {
            specsManage.splice(i, 1);
          }
        }
        specsManage.push(specsObject);
      } else {
        specsManage.push(specsObject);
      }

      //排序
      if (specsManage.length == this.specs.length) {
        var newSpecsManage = [];
        for (let i = 0; i < this.specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.specs[i].id == specsManage[j].specid) {
              newSpecsManage.push(specsManage[j]);
              break;
            }
          }
        }
        specsManage = newSpecsManage;
      }
      this.setGoodsDescription();
    },

    //处理goodsDescription 数据
    setGoodsDescription() {
      var description = "";
      //相等代表全选了 体现语句
      if (specsManage.length == this.specs.length) {
        description = "已选择 ";
        for (let i = 0; i < specsManage.length; i++) {
          description += specsManage[i].title + " ";
        }
        this.popDescription = description;
      } else {
        description = "请选择 ";

        for (let i = 0; i < this.specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.specs[i].id != specsManage[j].specid) {
              description += this.specs[i].title + " ";
              break;
            }
          }
        }
        this.popDescription = description;
      }
    },
    //处理规格组合选择状态 过滤数据
    setGoodsSpecs(specs) {
      for (let i = 0; i < this.specs.length; i++) {
        if (specs.specid != this.specs[i].id) {
          this.setGoodsSpecsStatus(this.specs[i].specitem, specs.id);
        }
      }
    },
    //处理规格组合选择状态 处理状态 specitem 组合数组(未选中的) id当前选中的ID 根据ID 组合算是否有当前组合
    setGoodsSpecsStatus(specitem, id) {
      // console.log(specitem);
      // console.log(id);
      let options = []; //数据池

      for (let i = 0; i < this.options.length; i++) {
        // console.log(this.options[i].specs);
        let _specs = this.options[i].specs.split("_");
        //console.log(_specs);
        //判断是否包含
        for (let j = 0; j < _specs.length; j++) {
          if (_specs[j] == id) {
            options.push(this.options[i]);
            return;
          }
        }
      }

      //关键处理方式 后期要优化 效率低
      for (let m = 0; m < options.length; m++) {
        let _specs = options[m].specs.split("_");
        for (let y = 0; y < _specs.length; y++) {
          if (_specs[y] != id && options[m].stock == 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = true;
                return;
              }
            }
          } else if (_specs[y] != id && options[m].stock > 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = false;
                return;
              }
            }
          }
        }
      }

      console.log(options);
    },
    //设置选择规格后的 价格、照片、库存
    setGoodsSpecsChangeInfo() {
      //根据ID 排序 specsManage.sort();
      specsManage.sort(function(a, b) {
        return a.id - b.id;
      });
      if (specsManage.length == this.specs.length) {
        let goodsSpecs = "";
        for (let j = 0; j < specsManage.length; j++) {
          goodsSpecs += specsManage[j].id + "_";
        }
        goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"
        // console.log('goodsSpecs', goodsSpecs)
        for (let i = 0; i < this.options.length; i++) {
          if (goodsSpecs == this.setGoodsSpecsBySort(this.options[i].specs)) {
            this.activeSkuIndex = i;
            this.popPrice = this.options[i].product_price; //设置价格
            this.popThumb = this.fun.isTextEmpty(this.options[i].thumb) ? this.goods.thumb : this.options[i].thumb; //设置图片
            this.popStock = this.options[i].stock; //设置库存

            optionsId = this.options[i].id; //设置规格ID，用于生成订单
            this.optionsMaxCount = this.options[i].stock; //库存最大数 用于切换更改买家购买数量
            if (this.optionsMaxCount > 0) {
              this.popNum = 1;
              this.goodsCount = 1;
            }

            this.$emit("sku-selected", optionsId);
            break;
          }
        }
      }
    },
    //处理商品goodsSpecs 并排序 新方法
    setGoodsSpecsBySort(specs) {
      let _specs = specs.split("_"); //先变成数组
      //_specs.sort();//排序
      _specs.sort(function(a, b) {
        return a - b;
      });

      // 在组装回去
      let goodsSpecs = "";
      for (let j = 0; j < _specs.length; j++) {
        goodsSpecs += _specs[j] + "_";
      }
      goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"

      return goodsSpecs;
    },

    //判断当前购买总量与库存的关系
    getMaxCount() {
      if (specsManage.length == this.specs.length) {
        // console.log(optionsMaxCount);
        // console.log(this.goodsCount);
        if (this.optionsMaxCount == 0) {
          //库存不足
          this.goodsCount = 0;
        }
        if (this.goodsCount > this.optionsMaxCount) {
          this.goodsCount = this.optionsMaxCount;
        }
      }
    },
    close() {
      this.$emit("onEmit", false);
    },
    //============ 处理规格图片点击放大 start============
    initSkuIMG() {
      //初始化图片数据
      this.showSkuImages = false;
      this.skuImages = [];
      this.showSkuImages = false;
      this.activeSkuIndex = 0;
      this.activeSkuIndex_1 = null; //用于关闭时保存点击预览前的序号，在预览关闭时重新设置预览起始位置
      this.activeSkuIndex_2 = null;
    },
    showSkuImages_Methob() {
      this.showSkuImages = true;
      if (this.goods.has_option != 1) {
        this.$nextTick(() => {
          this.$refs.ImagePreview.swipeTo(0);
        });
        // setTimeout(() => {
        //   this.$refs.ImagePreview.swipeTo(0);
        // }, 2000);
        return;
      }
      this.activeSkuIndex_1 = this.options[this.activeSkuIndex].specs.split("_");
    },
    onChangeSkuImagesIndex(index) {
      this.activeSkuIndex = index;
      if (this.goods.has_option != 1) {
        return;
      }
      this.activeSkuIndex_2 = this.options[index].specs.split("_");
    },
    onCloseSkuImages() {
      if (this.goods.has_option != 1) {
        return;
      }
      let that = this;
      let _lastOption = this.activeSkuIndex_1;
      let _activeOption = this.activeSkuIndex_2;
      let _activeSkuIndex = this.activeSkuIndex;
      for (let i = 0; i < _lastOption.length; i++) {
        if (_lastOption[i] != _activeOption[i]) {
          let _specs = Number(_activeOption[i]);

          for (let ind = 0; ind < that.specs.length; ind++) {
            for (let index = 0; index < that.specs[ind].specitem.length; index++) {
              if (that.specs[ind].specitem[index].id == _specs) {
                that.specs[ind].description = that.specs[ind].specitem[index];

                that.popPrice = that.options[_activeSkuIndex].product_price; //设置价格
                that.popThumb = that.fun.isTextEmpty(that.options[_activeSkuIndex].thumb) ? that.goods.thumb : that.options[_activeSkuIndex].thumb; //设置图片
                that.popStock = that.options[_activeSkuIndex].stock; //设置库存

                optionsId = that.options[_activeSkuIndex].id; //设置规格ID，用于生成订单
                this.optionsMaxCount = that.options[_activeSkuIndex].stock; //库存最大数 用于切换更改买家购买数量
              }
            }
          }
        }
      }
    }
    //============ 处理规格图片点击放大 end============
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#yz_specs {
  .noVantRadio {
    .van-radio-group {
      display: flex;
      flex-wrap: wrap;

      .van-radio {
        margin-right: 0.3125rem;
        margin-bottom: 0.3125rem;
        background: #fff;
        border: 1px solid #fb4a4a;
        text-align: center;
        box-sizing: border-box;
        border-radius: 0.25rem;
        color: #fb4a4a;
      }

      /deep/.vantRadioshow {
        background-color: rgb(241, 83, 83);
        border-color: rgb(241, 83, 83);
        // box-shadow: rgb(241, 83, 83) -1px 0px 0px 0px;
        .van-radio__label {
          color: #fff !important;
        }
      }

      /deep/.van-radio__label {
        color: inherit;
      }
    }
  }

  .sku-body-box {
    max-height: 45vh;
    overflow-y: scroll;
  }

  .shopinfo {
    text-align: left;
    padding: 0 0.625rem;
    margin: 0 0 1.5rem 0;
    max-height: 50vh;
    overflow: scroll;

    dl dt {
      margin-bottom: 0.3125rem;
      color: #666;
    }

    dl dd {
      margin-bottom: 0.3125rem;
    }
  }

  // .pcStyle_mint {
  //   width: 375px !important;
  //   box-sizing: border-box !important;
  // }
  .sku_price {
    position: fixed;
    bottom: 20px;
    font-size: 1rem;
    color: #fff;
    width: 100%;
    left: 0;
    text-align: center;
  }

  .specifications {
    position: relative;
    width: 100%;
    text-align: center;

    .shopimg {
      display: flex;

      #chooser_img {
        width: 4.75rem;
        height: 4.75rem;
        margin: 0.875rem;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.375rem;
        }
      }

      .right {
        text-align: left;
        flex: 1;
        margin: 0.875rem 0;

        .price {
          color: #f15353;
          font-size: 12px;
          line-height: 1.875rem;
          height: 1.875rem;
          overflow: hidden;

          span {
            font-size: 18px;
          }
        }

        .option {
          color: #999;
          font-size: 10px;
          line-height: 1rem;
          height: 1rem;
          overflow: hidden;
        }
      }
    }

    .el-radio-button,
    .el-radio-button__inner {
      margin-right: 0.3125rem;
      margin-bottom: 0.3125rem;
    }

    .el-radio-group .el-radio-button .el-radio-button__inner {
      border-radius: 0.25rem;
    }

    .el-radio-button--small .el-radio-button__inner {
      background: red;
    }

    .num {
      margin-top: 1rem;
      border-radius: 0.1875rem;
      float: right;
      background-color: #fff;
    }

    .num .leftnav {
      height: 1.75rem;
      width: 1.75rem;
      float: left;
      background-color: #f2f2f2;
      color: #999;
      text-align: center;
      border-radius: 0.1875rem;
      line-height: 1.75rem;
      font-size: 18px;
      font-weight: bold;
    }

    .num .shownum {
      height: 1.75rem;
      width: 2.25rem;
      float: left;
      border: 0;
      margin: 0;
      padding: 0;
      text-align: center;
      color: #333;
    }

    .num .rightnav {
      height: 1.75rem;
      width: 1.75rem;
      float: right;
      background-color: #f2f2f2;
      color: #999;
      text-align: center;
      border-radius: 0.1875rem;
      line-height: 1.75rem;
      font-size: 18px;
      font-weight: bold;
    }

    .el-row {
      border-top: solid 0.0625rem #f2f2f2;
      border-bottom: solid 0.0625rem #f2f2f2;
      margin: 1.25rem 0.875rem;
      padding: 0;
      font-size: 14px;
      display: flex;
      justify-content: space-between;

      #num {
        height: 3.75rem;
        line-height: 3.75rem;
        text-align: left;
      }
    }

    .van-row {
      margin: 1.25rem 0.875rem;
      padding: 0;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      #num {
        line-height: 2.75rem;
        text-align: left;
        flex: 1;
      }
    }

    .icon_close {
      position: absolute;
      top: 0;
      right: 0;
      width: 2.5rem;
      height: 2.5rem;

      i {
        line-height: 2.5rem;
        font-size: 1.125rem;
        color: #999;
      }
    }
  }

  .sku-buy-btn-style {
    padding: 0.375rem 0.875rem;
    display: flex;
    justify-content: center;
  }

  #btsmall {
    border-radius: 0.375rem;
    height: 3.0625rem;
    font-size: 16px;
  }
}
</style>
