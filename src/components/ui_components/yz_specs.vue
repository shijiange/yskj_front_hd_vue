<template>
  <div id="yz_specs">
    <van-popup v-model="popupSpecs" position="bottom" class="mint-popup-4 pcStyle_mint set-pc-styleLeft" round :close-on-click-overlay="false">
      <div class="specifications">
        <div class="icon_close" @click.stop="close_yz_specs_popup(0)">
          <i class="iconfont icon-close11"></i>
        </div>
        <div class="shopimg">
          <div id="chooser_img" @click="showSkuImages_Methob">
            <img :src="popThumb == null || popThumb == '' || popThumb == undefined ? goodsInfo.thumb : popThumb" />
          </div>
          <div class="right">
            <div class="price" :style="{ color: `${themeColor}` }">
              {{ $i18n.t("money") }}
              <span id="option_price">{{ popPrice }}</span>
              <span v-if="isRent">/天</span>
            </div>
            <div class="option">库存{{ popStock }}{{ goodsInfo.sku }}</div>
            <div class="option">{{ goodsDescription }}</div>
          </div>
        </div>
        <slot></slot>
        <div class="shopinfo noVantRadio" v-if="!fun.isTextEmpty(goodsInfo.has_many_specs)">
          <dl v-for="(specs, i) in goodsInfo.has_many_specs" :key="i">
            <dt>{{ specs.title }}</dt>
            <dd>
              <van-radio-group v-model="specs.description" checked-color="#f15353" @change="selectSpecs">
                <van-radio
                  :class="{ vantRadioshow: specs.description == specitem }"
                  :style="{
                    borderColor: `${themeColor}`,
                    backgroundColor: specs.description == specitem ? `${themeColor}` : '#fff',
                    color: specs.description != specitem ? `${themeColor}!important` : '#fff'
                  }"
                  :disabled="specitem.c"
                  v-for="(specitem, i) in specs.specitem"
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
        <div v-if="!isRent">
          <van-row>
            <div id="num">购买数量：</div>
            <!--禁用步进器后面请使用ref操作，尽量不在该子组件编写其他逻辑 ，例如：this.$refs.goodSku.$refs.yz_specs_stepper.disabled -->
            <van-stepper
              v-model.number="goodsCount"
              :min="minNum"
              :max="optionsMaxCount"
              @plus="addGoods"
              @minus="reduceGoods"
              @change="changeGoods"
              integer
              ref="yz_specs_stepper"
              :disabled="$route.name == 'grab_group' || $route.name == 'grabGroup_detail' || optionsMaxCount == 0 ? true : false"
            />
          </van-row>
        </div>
        <van-button :color="`${themeColor}`" type="danger" size="small" id="btsmall" v-show="popStock >= 1" @click.stop="close_yz_specs_popup(1)">
          确认
        </van-button>
        <van-button type="danger" color="#999999" size="small" disabled id="btsmall" v-show="popStock <= 0">
          库存不足
        </van-button>
      </div>
    </van-popup>
    <van-image-preview v-model="showSkuImages" :images="skuImages" @change="onChangeSkuImagesIndex" @close="onCloseSkuImages" :start-position="activeSkuIndex" :loop="false">
      <template v-slot:index></template>
      <template v-slot:cover>
        <div class="sku_price">
          <!-- <p style="margin-bottom:8px;">【{{ goodsInfo.has_many_options[activeSkuIndex].title }}】</p> -->
          <p v-if="goodsInfo.has_option == 1">{{ $i18n.t("money") }}{{ goodsInfo.has_many_options[activeSkuIndex].product_price }}</p>
          <p v-if="goodsInfo.has_option != 1">{{ $i18n.t("money") }}{{ goodsInfo.price }}</p>
        </div>
      </template>
    </van-image-preview>
  </div>
</template>

<script>
import { Toast } from "vant";

var specsManage = []; //选择池 用于排序
var optionsId = 0; //选择后的 规格ID
export default {
  model: {
    prop: "popupSpecs",
    event: "onEmit"
  },
  props: {
    goodsInfo: {
      type: Object,
      default: () => ({})
    },
    popupSpecs: {
      type: Boolean,
      default: false
    },
    carts: {
      type: Array,
      default: () => []
    },
    //主题色
    themeColor: {
      type: String,
      default: "#f14e4e"
    }
  },
  data() {
    return {
      minNum: 1, //最小购买数量
      goodsCount: 1,
      optionsMaxCount: 1,
      popThumb: null,
      popPrice: 0,
      popStock: 0,
      goodsDescription: null,

      skuImages: [],
      showSkuImages: false,
      activeSkuIndex: 0,
      activeSkuIndex_1: null, //用于关闭时保存点击预览前的序号，在预览关闭时重新设置预览起始位置
      activeSkuIndex_2: null,

      popNum: null,
      popCard: {}
    };
  },
  watch: {
    popupSpecs: function(newV, oldV) {
      if (newV) {
        specsManage = [];
        optionsId = 0;
        this.initPopView();
      }
    }
  },
  created() {
    // specsManage = [];
    // optionsId = 0;
    // this.initPopView();
  },
  components: {},
  computed: {},
  methods: {
    //初始化弹窗view
    initPopView() {
      this.popThumb = this.goodsInfo.thumb; //设置默认图片
      this.popStock = this.goodsInfo.stock || 0; //设置默认库存
      if (this.goodsInfo.has_option == undefined) {
        this.goodsInfo.has_option = this.fun.isTextEmpty(this.goodsInfo.has_many_specs) ? 0 : 1;
      }

      if (this.goodsInfo.has_option == 1) {
        // this.popPrice = this.goodsInfo.min_price + '-' + this.goodsInfo.max_price //设置默认价格
        this.goodsInfo.has_many_options.forEach((val, index) => {
          let _thumb = !this.fun.isTextEmpty(val.thumb) ? val.thumb : this.goodsInfo.thumb;
          this.skuImages.push(_thumb);
        });
        // 默认选择第一个
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          this.goodsInfo.has_many_specs[i].description = this.goodsInfo.has_many_specs[i].specitem[0];
          this.selectSpecs(this.goodsInfo.has_many_specs[i].specitem[0]);
        }

        // this.goodsDescription = '选择'
        // for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
        //   this.goodsDescription += ' ' + this.goodsInfo.has_many_specs[i].title
        // }
      } else {
        this.popThumb = this.goodsInfo.thumb; //设置默认图片
        this.popStock = this.goodsInfo.stock || 0; //设置默认库存
        this.popPrice = this.goodsInfo.price; //设置默认价格
        this.goodsDescription = "";
        this.optionsMaxCount = this.goodsInfo.stock; //设置最大购买量

        this.skuImages.push(this.goodsInfo.thumb);

        if (this.carts.length > 0) {
          for (let i = 0; i < this.carts.length; i++) {
            if (this.carts[i].goods_id === this.goodsInfo.id) {
              this.popNum = this.carts[i].total;
              this.goodsCount = this.popNum;
              this.popCard = this.carts[i];
              break;
            }
          }
        }
      }
    },
    //界面选择规格触发事件
    selectSpecs(data) {
      // console.log(data)
      // var specid = data.specid; //对其他数据筛选 不筛选同级
      //console.log(specid);
      //处理选择池
      this.manageSpecs(data);

      //处理规格组合选择状态
      this.setGoodsSpecs(data);

      //设置选择规格后的 价格、照片、库存
      this.setGoodsSpecsChangeInfo();

      //判断当前购买总量与库存的关系
      this.getMaxCount();
    },

    //判断当前购买总量与库存的关系
    getMaxCount() {
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
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

    //设置选择规格后的 价格、照片、库存
    setGoodsSpecsChangeInfo() {
      //根据ID 排序 specsManage.sort();
      specsManage.sort(function(a, b) {
        return a.id - b.id;
      });
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        let goodsSpecs = "";
        for (let j = 0; j < specsManage.length; j++) {
          goodsSpecs += specsManage[j].id + "_";
        }
        goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"
        // console.log('goodsSpecs', goodsSpecs)
        for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
          if (goodsSpecs == this.setGoodsSpecsBySort(this.goodsInfo.has_many_options[i].specs)) {
            this.activeSkuIndex = i;
            this.popPrice = this.goodsInfo.has_many_options[i].product_price; //设置价格
            this.popThumb = this.fun.isTextEmpty(this.goodsInfo.has_many_options[i].thumb) ? this.goodsInfo.thumb : this.goodsInfo.has_many_options[i].thumb; //设置图片
            this.popStock = this.goodsInfo.has_many_options[i].stock; //设置库存

            optionsId = this.goodsInfo.has_many_options[i].id; //设置规格ID，用于生成订单
            this.optionsMaxCount = this.goodsInfo.has_many_options[i].stock; //库存最大数 用于切换更改买家购买数量
            if (this.optionsMaxCount > 0) {
              this.popNum = 1;
              this.goodsCount = 1;
            }
            break;
          }
        }
        if (this.carts.length > 0) {
          for (let i = 0; i < this.carts.length; i++) {
            if (this.carts[i].goods_id === this.goodsInfo.id && this.carts[i].option_id === optionsId) {
              this.popNum = this.carts[i].total;
              this.goodsCount = this.popNum;
              this.popCard = this.carts[i];
              break;
            }
            this.popNum = 1;
            this.goodsCount = 1;
            this.popCard = {};
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
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        var newSpecsManage = [];
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goodsInfo.has_many_specs[i].id == specsManage[j].specid) {
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
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        description = "已选择 ";
        for (let i = 0; i < specsManage.length; i++) {
          description += specsManage[i].title + " ";
        }
        this.goodsDescription = description;
      } else {
        description = "请选择 ";

        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goodsInfo.has_many_specs[i].id != specsManage[j].specid) {
              description += this.goodsInfo.has_many_specs[i].title + " ";
              break;
            }
          }
        }
        this.goodsDescription = description;
      }
    },

    //处理规格组合选择状态 过滤数据
    setGoodsSpecs(specs) {
      for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
        if (specs.specid != this.goodsInfo.has_many_specs[i].id) {
          this.setGoodsSpecsStatus(this.goodsInfo.has_many_specs[i].specitem, specs.id);
        }
      }
    },

    //处理规格组合选择状态 处理状态 specitem 组合数组(未选中的) id当前选中的ID 根据ID 组合算是否有当前组合
    setGoodsSpecsStatus(specitem, id) {
      // console.log(specitem);
      // console.log(id);
      let options = []; //数据池

      for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
        // console.log(this.goodsInfo.has_many_options[i].specs);
        let _specs = this.goodsInfo.has_many_options[i].specs.split("_");
        //console.log(_specs);
        //判断是否包含
        for (let j = 0; j < _specs.length; j++) {
          if (_specs[j] == id) {
            options.push(this.goodsInfo.has_many_options[i]);
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

    //增加
    addGoods() {
      if (specsManage.length == this.goodsInfo.has_many_specs.length && this.goodsCount == this.optionsMaxCount) {
        console.log("数量超出范围", this.optionsMaxCount);
        Toast("库存不足");
        return;
      }
      this.goodsCount++;
      this.$emit("addGoods", optionsId, this.goodsCount);
    },
    //减少
    reduceGoods() {
      if (this.goodsCount == 1 || this.goodsCount == 0) {
        return;
      }
      this.goodsCount--;
      this.$emit("reduceGoods", optionsId, this.goodsCount);
    },
    //数量变化
    changeGoods() {
      this.$emit("changeGoods", optionsId, this.goodsCount);
    },
    //============ 处理规格图片点击放大 start============
    showSkuImages_Methob() {
      this.showSkuImages = true;
      if (this.goodsInfo.has_option != 1) {
        return;
      }
      this.activeSkuIndex_1 = this.goodsInfo.has_many_options[this.activeSkuIndex].specs.split("_");
    },
    onChangeSkuImagesIndex(index) {
      this.activeSkuIndex = index;
      if (this.goodsInfo.has_option != 1) {
        return;
      }
      this.activeSkuIndex_2 = this.goodsInfo.has_many_options[index].specs.split("_");
    },
    onCloseSkuImages() {
      if (this.goodsInfo.has_option != 1) {
        return;
      }
      let that = this;
      let _lastOption = this.activeSkuIndex_1;
      let _activeOption = this.activeSkuIndex_2;
      let _activeSkuIndex = this.activeSkuIndex;
      for (let i = 0; i < _lastOption.length; i++) {
        if (_lastOption[i] != _activeOption[i]) {
          let _specs = Number(_activeOption[i]);

          for (let ind = 0; ind < that.goodsInfo.has_many_specs.length; ind++) {
            for (let index = 0; index < that.goodsInfo.has_many_specs[ind].specitem.length; index++) {
              if (that.goodsInfo.has_many_specs[ind].specitem[index].id == _specs) {
                that.goodsInfo.has_many_specs[ind].description = that.goodsInfo.has_many_specs[ind].specitem[index];

                that.popPrice = that.goodsInfo.has_many_options[_activeSkuIndex].product_price; //设置价格
                that.popThumb = that.fun.isTextEmpty(that.goodsInfo.has_many_options[_activeSkuIndex].thumb) ? that.goodsInfo.thumb : that.goodsInfo.has_many_options[_activeSkuIndex].thumb; //设置图片
                that.popStock = that.goodsInfo.has_many_options[_activeSkuIndex].stock; //设置库存

                optionsId = that.goodsInfo.has_many_options[_activeSkuIndex].id; //设置规格ID，用于生成订单
                this.optionsMaxCount = that.goodsInfo.has_many_options[_activeSkuIndex].stock; //库存最大数 用于切换更改买家购买数量
              }
            }
          }
        }
      }
    },
    //============ 处理规格图片点击放大 end============
    //点击关闭 clicktype为1：确认按钮 ，为0：关闭弹窗操作
    close_yz_specs_popup(clicktype) {
      console.log("optionsId", optionsId, this.goodsCount);
      if (clicktype == 1 && this.goodsInfo.has_option == 1 && this.fun.isTextEmpty(optionsId)) {
        Toast("规格id不可为空，请选择规格！");
        return;
      }
      this.$emit("closeSpecsPopup", optionsId, this.goodsCount, clicktype, this.popCard.id);
    }
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
          font-size: 16px;
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

  #btsmall {
    width: 94%;
    border-radius: 0.375rem;
    height: 3.0625rem;
    font-size: 16px;
    margin-bottom: 0.375rem;
  }
}
</style>
