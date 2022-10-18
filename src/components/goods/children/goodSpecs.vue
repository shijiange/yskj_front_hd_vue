<template>
  <div id="yz_specs">
    <van-popup v-model="popupSpecs" position="bottom" class="mint-popup-4 pcStyle_mint" round :close-on-click-overlay="false">
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
              <template v-if="goods_plugin.point_goods">
                <span id="option_price">{{ popPrice }}</span> <span class="point-text" style="font-size: 13px;">{{ integral }}</span>
              </template>
              <template v-else>
                <em style="font-size: 13px;">{{ $i18n.t("money") }}</em
                ><span id="option_price">{{ popPrice }}</span>
                <span style="font-size: 12px;" v-if="isRent">/天</span>
                <van-loading class="m-l-w6" size="16" color="#fdbc2e" v-show="isMultiSpecs && specsVIPPrc == 0" />
                <!-- 没有规格的会员价 -->
                <span v-if="vip_show && goodsInfo.has_option == 0" class="member-price m-l-w6">&nbsp;会员价: {{ $i18n.t("money") }}{{goodsInfo.vip_price_show}}</span>
                <!-- 有规格显示的会员价 -->
                <span class="member-price m-l-w6" v-if="isMultiSpecs && specsVIPPrc">&nbsp;会员价: {{ $i18n.t("money") }}{{ specsVIPPrc }} </span>
              </template>
            </div>
            <div class="option">库存{{ popStock }}{{ goodsInfo.sku }}</div>
            <div class="option">
              {{ goodsDescription }} <span v-if="iszhp" style="color: rgb(241, 78, 78);">共{{ $i18n.t("money") }}{{ sumTotol }}</span>
            </div>
            <div
              class="give_integral_wrapper"
              style="padding-left: 0; padding-top: 0.5rem;"
              v-if="goodsInfo.has_option == 0 && goodsInfo.goods_sale && goodsInfo.goods_sale.first_strip_key && goodsInfo.goods_sale.first_strip_key.points"
            >
              <div class="give_integral_text">送</div>
              <div class="give_integral_num" v-if="goodsInfo.goods_sale.first_strip_key.points.indexOf('%') >= 1">{{ goodsInfo.goods_sale.first_strip_key.points }}{{ integral }}</div>
              <div class="give_integral_num" v-if="goodsInfo.goods_sale.first_strip_key.points.indexOf('%') == -1">
                {{ (goodsInfo.goods_sale.first_strip_key.points * goodsCount).toFixed(2) }}{{ integral }}
              </div>
            </div>
            <div class="give_integral_wrapper" style="padding-left: 0; padding-top: 0.5rem;" v-if="goodsInfo.has_option == 1 && give_integral_count">
              <div class="give_integral_text">送</div>
              <div class="give_integral_num" v-if="give_integral_count.indexOf('%') >= 1">{{ give_integral_count }}{{ integral }}</div>
              <div class="give_integral_num" v-if="give_integral_count.indexOf('%') == -1">{{ (give_integral_count * goodsCount).toFixed(2) }}{{ integral }}</div>
            </div>
          </div>
        </div>
        <slot></slot>
        <div class="shopinfo noVantRadio" v-if="goodsInfo.has_option == 1 && !fun.isTextEmpty(goodsInfo.has_many_specs) && popupSpecs">
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

        <!-- 拼团层级 -->
        <div class="select_box noVantRadio" v-if="!this.fun.isTextEmpty(goods_info.has_many_level)" style="padding-top: 0;">
          <van-radio-group v-model="groupModel" checked-color="#f15353" @change="selectGroup" class="select" style="padding-bottom: 0;">
            <van-radio :class="{ vantRadioshow: groupModel == item.id }" v-for="(item, i) in goods_info.has_many_level" :name="item.id" :key="i">
              <div style="padding: 0.25rem 0.8rem;">
                <p>{{ $i18n.t("money") }}{{ item.min_price }} 起</p>
                <p>{{ item.member_num }}人团</p>
              </div>
            </van-radio>
          </van-radio-group>
        </div>

        <div v-if="goodsInfo.plugin_id != 72">
          <!--goodsInfo.plugin_id != 72话费商品限制数量1-->
          <van-row>
            <div id="num">购买数量：</div>
            <van-stepper
              v-model.number="goodsCount"
              :min="minNum"
              :max="optionsMaxCount"
              @plus="addGoods"
              @minus="reduceGoods"
              @change="changeGoods"
              integer
              ref="yz_specs_stepper"
              :disabled="isDisabled"
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
var level_id = ""; //拼团层级id
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
    goods_plugin: {
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
    },
    isRent: {
      type: Boolean,
      default: false
    },
    goods_info: {
      type: Object,
      default: () => ({})
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
      popCard: {},

      integral: window.localStorage.integral || "积分",

      // 拼团
      option_level_id: "", //规格层级id
      groupModel: "", //选择的拼团层级
      selectGroupInfo: {}, //拼团层级列表

      give_integral_count: "", //送积分数量

      isMultiSpecs: false, //多规格商品是否显示会员价
      specsVIPPrc: null, //规格商品会员价
      vip_show:JSON.parse(window.localStorage.getItem("globalParameter")).vip_show?JSON.parse(window.localStorage.getItem("globalParameter")).vip_show:false
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
  computed: {
    sumTotol() {
      return (Number(this.goods_info.min_price) * Number(this.goodsCount)).toFixed(2);
    },
    iszhp() {
      if (this.$route.name == "zhpGroup") {
        return true;
      } else {
        return false;
      }
    },
    isDisabled() {
      // zhpGroup 注释
      let arr = ["grab_group", "grabGroup_detail"];
      if (arr.indexOf(this.$route.name) != -1 || (this.$route.name == "newRetailSalesGood" && this.$route.params.mode == 2) || this.optionsMaxCount == 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    setMrSpec() {
      return new Promise((resolve, reject) => {
        for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
          if (this.goodsInfo.has_many_options[i].id == this.$route.params.coid) {
            resolve(this.goodsInfo.has_many_options[i].specs);
          }
        }
      });
    },
    //初始化弹窗view
    // 拼团的初始化价格popPrice不是规格价
    async initPopView() {
      this.popThumb = this.goodsInfo.thumb; //设置默认图片
      this.popStock = this.goodsInfo.stock || 0; //设置默认库存
      if (this.goodsInfo.has_option == undefined) {
        this.goodsInfo.has_option = this.fun.isTextEmpty(this.goodsInfo.has_many_specs) ? 0 : 1;
      }
      this.isShowMultiSpecsMemPrice(); //是否需要显示多规格会员价
      if (this.goodsInfo.has_option == 1) {
        if (this.goods_plugin.point_goods) {
          this.popPrice = this.goods_plugin.point_goods.min_point + "-" + this.goods_plugin.point_goods.max_point; //设置默认价格
        } else {
          // this.popPrice = this.goodsInfo.min_price + "-" + this.goodsInfo.max_price; //设置默认价格
        }
        this.goodsInfo.has_many_options.forEach((val, index) => {
          let _thumb = !this.fun.isTextEmpty(val.thumb) ? val.thumb : this.goodsInfo.thumb;
          this.skuImages.push(_thumb);
        });
        // 默认选择第一个
        let specsInd;
        if (this.$route.params.coid) {
          // coid规格默认id
          specsInd = await this.setMrSpec();
          specsInd = specsInd.split("_");
        }
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          if (this.$route.params.coid) {
            // 如果有默认规格id，规格弹窗规格按默认规格显示
            for (let j = 0; j < this.goodsInfo.has_many_specs[i].specitem.length; j++) {
              if (this.goodsInfo.has_many_specs[i].specitem[j].id == Number(specsInd[i])) {
                this.goodsInfo.has_many_specs[i].description = this.goodsInfo.has_many_specs[i].specitem[j];
                this.selectSpecs(this.goodsInfo.has_many_specs[i].specitem[j]);
              }
            }
          } else {
            this.goodsInfo.has_many_specs[i].description = this.goodsInfo.has_many_specs[i].specitem[0];
            this.selectSpecs(this.goodsInfo.has_many_specs[i].specitem[0]);
          }
        }

        // this.goodsDescription = '选择'
        // for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
        //   this.goodsDescription += ' ' + this.goodsInfo.has_many_specs[i].title
        // }
      } else {
        this.popThumb = this.goodsInfo.thumb; //设置默认图片
        this.popStock = this.goodsInfo.stock || 0; //设置默认库存
        if (this.goods_plugin.point_goods) {
          this.popPrice = this.goods_plugin.point_goods.point; //设置默认价格
        } else {
          this.popPrice = this.goodsInfo.price; //设置默认价格
        }
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
        if (this.$route.name == "GroupGoods" || this.$route.name == "zhpGroup") {
          this.popPrice = this.goods_info.min_price + "起"; //设置默认价格
          this.selectGroup();
        }
      }
    },
    isShowMultiSpecsMemPrice() {
      //判断是否需要显示多规格会员价【#70785】
      let arr = ["grab_group", "grabGroup_detail", "zhpGroup", "GroupGoods"]; //拼团类（独立的金额设置没有关联商城商品规格价）、积分商品不需要显示会员价
      if (arr.indexOf(this.$route.name) != -1) {
        this.isMultiSpecs = false;
        return;
      }
      if(this.vip_show){
        this.isMultiSpecs = true;
      }else{
        this.isMultiSpecs = false;
      }
      // 去除插件条件使用商城设置会员价开关 #87399
      //注释代码 this.goodsInfo.is_open_micro && Number(this.goodsInfo.is_open_micro) == 1
      //注释原因：后端解释和价格权限插件冲突了 [#80547]  
      // let _is_open_micro = 0;
      // if (this.goods_plugin) _is_open_micro = this.goods_plugin?.member_price?.is_open_micro || 0;
      // if (Number(_is_open_micro) == 1 && this.goodsInfo.has_option == 1) {
      //   this.isMultiSpecs = true;
      // } else {
      //   this.isMultiSpecs = false;
      // }
    },
    //界面选择规格触发事件
    selectSpecs(data) {
      // console.log(data)
      // var specid = data.specid; //对其他数据筛选 不筛选同级
      //console.log(specid);
      if (data) {
        //处理选择池
        this.manageSpecs(data);
      }

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
            if (this.$route.name == "GroupGoods") {
              this.popPrice = this.goods_info.min_price + "起"; //设置默认价格
            } else if (this.goods_plugin.point_goods) {
              this.popPrice = this.goods_plugin.point_goods.point_option[i].goods_point; //设置价格
            } else {
              this.popPrice = this.goodsInfo.has_many_options[i].product_price; //设置价格
            }
            this.popThumb = this.fun.isTextEmpty(this.goodsInfo.has_many_options[i].thumb) ? this.goodsInfo.thumb : this.goodsInfo.has_many_options[i].thumb; //设置图片
            this.popStock = this.goodsInfo.has_many_options[i].stock; //设置库存

            optionsId = this.goodsInfo.has_many_options[i].id; //设置规格ID，用于生成订单
            this.optionsMaxCount = this.goodsInfo.has_many_options[i].stock; //库存最大数 用于切换更改买家购买数量
            if (this.optionsMaxCount > 0) {
              this.popNum = 1;
              this.goodsCount = 1;
            }
            this.give_integral_count = this.goodsInfo.has_many_options[i].points;
            if (this.isMultiSpecs) this.getMemberPrice(optionsId);

            if (this.$route.name == "GroupGoods") {
              // 拼团插件
              this.setGroupInfo(optionsId); //设置选择后规格对应的层级 过滤数据
            }
            if (this.$route.name == "zhpGroup") {
              // 珍惠拼拼团抽奖插件
              this.getZHPOption(optionsId); //设置选择后规格对应的的活动设置规格价格、库存
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
    getZHPOption(_id) {
      let that = this;
      for (let i = 0; i < this.goods_info.has_many_zhp_option.length; i++) {
        let _optionSpecs = this.goods_info.has_many_zhp_option[i].goods_option_id;
        if (_optionSpecs == _id) {
          that.popPrice = that.goods_info.has_many_zhp_option[i].group_price;
          that.popStock = that.goods_info.has_many_zhp_option[i].stock;
          that.optionsMaxCount = that.popStock;
          return;
        }
      }
    },
    //设置拼团层级的选择状态 过滤数据
    setGroupInfo(_id) {
      let that = this;
      console.log("组合规格id", _id);
      for (let i = 0; i < this.goods_info.has_many_options.length; i++) {
        let _optionSpecs = this.goods_info.has_many_options[i].option_id;
        //判断是否包含
        // for (let j = 0; j < _specs.length; j++) {
        if (_optionSpecs == optionsId) {
          // options.push(this.goodsInfo.has_many_options[i]);
          that.selectGroupInfo = this.goods_info.has_many_options[i].has_many_option_level;
          that.popStock = this.goods_info.has_many_options[i].stock; //当前组合的库存
          let _buy_limit = this.goods_info.has_many_options[0].buy_limit;
          this.optionsMaxCount = _buy_limit == 0 ? this.popStock : _buy_limit; //当前组合的购买限制数, 为0 时为无限制购买
          this.selectGroup(level_id);
          // console.log("选择规格", this.gooddatas.has_many_options[i]);
          return;
        }
        // }
      }
    },

    //选择拼团层级
    selectGroup(_level_id) {
      // let level_id = _level_id || this.goods_info.has_many_level[0].id;

      if (_level_id) this.groupModel = _level_id;
      if (!this.groupModel) this.groupModel = this.goods_info.has_many_level[0].id;
      let selectGroupLever = "";
      if (!this.fun.isTextEmpty(this.groupModel)) {
        if (this.goodsInfo.has_option == 1) {
          //有规格
          if (this.fun.isTextEmpty(optionsId)) {
            Toast("请选择商品规格！");
            this.groupModel = "";
          } else {
            selectGroupLever = this.selectGroupInfo.filter(v => {
              if (v.level_id == this.groupModel) {
                return v.group_price;
              }
            });
            this.popPrice = selectGroupLever[0].group_price;
            this.option_level_id = selectGroupLever[0].id;
          }
        } else {
          //无规格
          this.selectGroupInfo = this.goods_info.has_many_options[0].has_many_option_level;
          selectGroupLever = this.selectGroupInfo.filter(v => {
            if (v.level_id == this.groupModel) {
              return v.group_price;
            }
          });
          this.popPrice = selectGroupLever[0].group_price;
          this.option_level_id = selectGroupLever[0].id;
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

    getMemberPrice(_optionsId) {
      if (!_optionsId) return;
      this.specsVIPPrc = 0;
      $http
        .post("goods.other-info.option-vpi-price", { option_id: _optionsId }, null, true)
        .then(res => {
          if (res.result == 1) {
            this.specsVIPPrc = res.data.vip_price || null;
          } else {
            this.specsVIPPrc = null;
          }
        })
        .catch(error => {
          this.specsVIPPrc = null;
          console.log(error);
        });
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

                if (that.goods_plugin.point_goods) {
                  that.popPrice = that.goods_plugin.point_goods.point_option[_activeSkuIndex].goods_point; //设置价格
                } else {
                  that.popPrice = that.goodsInfo.has_many_options[_activeSkuIndex].product_price; //设置价格
                }
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
      if (this.goodsInfo.has_option == 1 && specsManage.length < this.goodsInfo.has_many_specs.length) {
        Toast(this.goodsDescription);
        return;
      }
      if (clicktype == 1 && this.optionsMaxCount == 0) {
        //库存不足
        Toast("商品库存不足");
        return;
      }
      if (clicktype == 1 && this.goodsInfo.has_option == 1 && this.fun.isTextEmpty(optionsId)) {
        Toast("规格id不可为空，请选择规格！");
        return;
      }

      if(clicktype == 1){
        // console.log(this.$store.state.add_cart_now_buy_button);//$store.state.
        // console.log('商品id'+this.goodsInfo.id);//$store.state.
        // console.log('商品价格'+this.goodsInfo.price);//$store.state.
        // console.log('商品名称'+this.goodsInfo.title);//$store.state.
        // console.log('数量'+this.goodsCount);//$store.state.
        zhuge.track('商品详情页'+this.$store.state.add_cart_now_buy_button+'点击确定',{
         '商品名称':this.goodsInfo.title,
         '商品id':''+this.goodsInfo.id,
         '商品价格':this.goodsInfo.price,     
         '数量':this.goodsCount
        });
      }

      this.$emit("closeSpecsPopup", optionsId, this.goodsCount, clicktype, this.popCard.id, this.optionsMaxCount, this.groupModel, this.option_level_id);
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
          width: 4.75rem;
          height: 4.75rem;
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
          display: inline-block;

          span {
            font-size: 18px;
          }

          .member-price {
            font-size: 12px;
            color: #fdbc2e;
          }

          .m-l-w6 {
            margin-left: 6px;
            display: inline-block;
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

.select_box {
  padding: 0.875rem 0.875rem 0 0.875rem;

  .select {
    border-top: solid 0.0625rem #ebebeb;
    display: flex;
    flex-wrap: wrap;
    padding: 0.875rem 0;

    li {
      width: 6.75rem;
      padding: 0.625rem 0;
      border: solid 0.0625rem #ebebeb;
      border-radius: 0.25rem;
      margin-right: 0.625rem;
      margin-bottom: 0.625rem;

      span {
        display: block;
        font-size: 14px;

        font {
          font-size: 18px;
        }
      }
    }

    li:nth-child(3n) {
      margin-right: 0;
    }

    .current {
      border: solid 0.0625rem #f15353;
      color: #f15353;
    }
  }

  .van-radio-group {
    display: flex;
    flex-wrap: wrap;

    .van-radio {
      margin-right: 0.3125rem;
      margin-bottom: 0.3125rem;
      background: #fff;
      border: 1px solid #bfcbd9;
      text-align: center;
      box-sizing: border-box;
      border-radius: 0.25rem;
    }

    .vantRadioshow {
      background-color: rgb(241, 83, 83);
      border-color: rgb(241, 83, 83);
      box-shadow: rgb(241, 83, 83) -1px 0 0 0;
    }
  }
}

.give_integral_wrapper {
  position: relative;
  display: flex;
  text-align: left;

  .give_integral_text {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.094rem !important;
    height: 1.094rem !important;
    font-size: 0.688rem;
    color: #fff;
    background-color: #ec544a;
    border-radius: 50%;
  }

  .give_integral_num {
    display: inline-flex;
    align-items: center;
    height: 1.094rem !important;
    padding: 0.2rem 0.5rem 0.2rem 1.3rem;
    font-size: 0.688rem;
    color: #ec544a;
    background-color: #fff5f4;
    border-radius: 15%;
  }
}
</style>
