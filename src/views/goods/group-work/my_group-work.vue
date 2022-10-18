<!-- 我的拼团组件 -->
<template>
  <div id="mygroups">
    <c-title :hide="false" text="我的拼团"></c-title>
    <div class="content">
      <van-tabs v-model="activeName" @change="getTab" sticky offset-top="40" swipeable>
        <van-tab :title="item.title" v-for="(item, index) in tabs" :key="item.id">
          <template v-if="dataList[index]">
            <van-list v-model="loading" :finished="dataList[index].isFinished" finished-text="没有更多了" @load="getMore">
              <my-group-cell
                v-for="itemChild in dataList[index].list"
                :key="itemChild.id"
                :title="itemChild.title"
                :price="itemChild.price"
                :thumb="itemChild.thumb"
                :time="activeName == 0 ? fun.getTimeDifference(itemChild.remain_time) : null"
              >
                <!--  -->
                <template v-slot:top>
                  <div class="time_state">
                    <span class="time">{{ itemChild.created_at }}</span>
                    <span class="state" v-if="activeName == 0">拼团中,还差{{ itemChild.disparity }}人</span>
                    <span class="state" v-if="activeName == 1">拼团成功 {{ itemChild.status == 2 ? `（抽中）` : "（未抽中）" }}</span>
                    <span class="state" v-if="activeName == 2">拼团失败</span>
                  </div>
                </template>
                <template v-slot:bottom>
                  <!-- v-show="activeName == 1 && itemChild.status == 2" -->
                  <button
                    type="button"
                    v-show="activeName == 1 && itemChild.status == 2 && !itemChild.order_id"
                    @click.stop="getGoods(itemChild.activity_id, itemChild.spec_id, itemChild.id)"
                    class="groupDetail"
                  >
                    去下单
                  </button>
                  <button type="button" v-show="activeName == 1 && itemChild.status == 2 && itemChild.order_id" @click.stop="toOrder(itemChild.order_id)" class="groupDetail">
                    订单详情
                  </button>
                  <button type="button" @click="gotoDetail(itemChild.alliance_id, itemChild.activity_id)" class="groupDetail">
                    拼团详情
                  </button>
                </template>
              </my-group-cell>
            </van-list>
          </template>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 规格弹窗,关联层级 -->
    <yzSpecs ref="yzSpecs" :goods="goods" :good-specs="specs" disable-stepper-input :options="options" v-model="popupSpecs" v-on:sku-selected="skuSelected" v-on:buy-clicked="buyClicked">
      <template v-slot:sku-body-bottom>
        <div class="select_box noVantRadio" v-if="!fun.isTextEmpty(groupLevel)" style="padding-top: 0;">
          <van-radio-group v-model="groupModel" checked-color="#f15353" @change="selectGroup" class="select" style="padding-bottom: 0;">
            <van-radio class="vantRadioshow" v-for="(item, i) in groupLevel" :name="item.id" :key="i">
              <div style="padding: 0.25rem 0.8rem;">
                <p>{{ $i18n.t("money") }}{{ item.min_price }} 起</p>
                <p>{{ item.person }}人团</p>
              </div>
            </van-radio>
          </van-radio-group>
        </div>
      </template>
    </yzSpecs>
  </div>
</template>

<script>
import myGroupCell from "./component/my-group-cell";
import yzSpecs from "./component/specs";
export default {
  data() {
    return {
      tabs: [
        {
          title: "正在拼团",
          id: 0
        },
        {
          title: "拼团成功",
          id: 1
        },
        {
          title: "拼团失败",
          id: 2
        }
      ],
      activeName: 0,
      dataList: [],
      loading: false,
      isLoadMore: true,

      //sku 规格弹窗data ====
      optionsId: 0,
      popupSpecs: false,
      goods: {},
      specs: [],
      options: [],
      // 拼团
      groupLevel: [],
      level_id: 0,
      activity_option_id: "", //团规格属性价格ID主键,下单需要
      alliance_detail_id: "", //团详情ID（拼团列表数据ID）,下单需要
      groupModel: "", //选择的拼团层级
      special_options: "", //层级和规格的组合
      selectGroupInfo: {} //拼团层级列表
      //sku 规格弹窗data ======end
    };
  },
  activated() {
    this.groupModel = 0;
    this.getData(true);
  },
  methods: {
    buyClicked(e) {
      console.log(e);
      let _data = {
        goodsId: this.goods.id,
        optionsId: e.optionsId,
        total: 1,
        tag: "group-work",
        alliance_detail_id: this.alliance_detail_id,
        activity_option_id: this.activity_option_id
      };
      this.$router.push(this.fun.getUrl("goodsorder", {}, _data));
    },
    getGoods(activity_id, spec_id, _id) {
      this.alliance_detail_id = _id;
      $http
        .post("plugin.group-work.frontend.modules.goods.controllers.detail.index", { record_id: activity_id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.goods.id = response.data.goods_id;
            this.goods.has_option = response.data.goods_info.has_option;
            this.goods.thumb = response.data.goods_info.thumb;
            this.goods["unit"] = response.data.goods_info.sku;

            this.specs = response.data.goods_info.has_many_specs;
            this.options = response.data.goods_info.has_many_options;
            this.groupModel = spec_id;
            this.groupLevel = response.data.specs.filter(v => {
              if (v.id == spec_id) {
                this.goods["price"] = v.min_price;
                return v;
              }
            }); //过滤层级，只显示之前开团参团支付的层级
            this.special_options = response.data.special_options;
            if (this.goods.has_option == 0) this.setGroupInfo(0);
            this.popupSpecs = true;
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    skuSelected(e) {
      console.log(e);
      if (e) this.optionsId = e;
      this.setGroupInfo(this.optionsId); //设置选择后规格对应的层级 过滤数据
    },
    //设置拼团层级的选择状态 过滤数据
    setGroupInfo(_id) {
      for (let i = 0; i < this.special_options.length; i++) {
        let _optionSpecs = this.special_options[i].option_id;
        //判断是否包含
        if (_optionSpecs == this.optionsId) {
          this.selectGroupInfo = this.special_options[i].activity_options;
          this.$refs.yzSpecs.setStock(this.special_options[i].stock); //当前组合的库存
          this.$refs.yzSpecs.optionsMaxCount = this.special_options[i].stock; //当前组合的库存
          this.selectGroup(this.groupModel);
          return;
        }
      }
    },

    //选择拼团层级
    selectGroup(_level_id) {
      this.groupModel = _level_id;
      let selectGroupLever = "";
      if (!this.fun.isTextEmpty(_level_id)) {
        if (this.goods.has_option == 1) {
          //有规格
          if (this.fun.isTextEmpty(this.optionsId)) {
            this.$toast("请选择商品规格！");
            this.groupModel = "";
          } else {
            selectGroupLever = this.selectGroupInfo.filter(function(v) {
              if (v.spec_id == _level_id) {
                return v.price;
              }
            });

            this.$refs.yzSpecs.setPrice(selectGroupLever[0].price);
            this.activity_option_id = selectGroupLever[0].id;
          }
        } else {
          //无规格
          this.selectGroupInfo = this.special_options[0].activity_options;
          selectGroupLever = this.selectGroupInfo.filter(function(v) {
            if (v.spec_id == _level_id) {
              return v.price;
            }
          });
          this.$refs.yzSpecs.setPrice(selectGroupLever[0].price);
          this.activity_option_id = selectGroupLever[0].id;
        }
      }
    },
    getTab() {
      this.getData(false);
    },
    getData(tag) {
      let status = ["1", "2", "-1"];
      let index = this.activeName;
      if (!tag && this.dataList[index].list.length > 0) {
        return;
      }
      this.loading = true;

      $http
        .get("plugin.group-work.frontend.modules.alliance.controllers.records.index", { status: status[index] }, "加载中")
        .then(response => {
          this.loading = false;
          if (response.result === 1) {
            if (tag) {
              this.tabs.forEach((val, index) => {
                this.dataList.push({
                  isFinished: false,
                  page: 1,
                  total_page: 0,
                  list: []
                });
              });
            }
            if (response.data.page_list.last_page == 1) this.dataList[index].isFinished = true;
            this.dataList[index].list = response.data.page_list.data;
            this.dataList[index].total_page = response.data.page_list.last_page;
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMore() {
      if (!this.isLoadMore || this.dataList[this.activeName].isFinished) {
        return;
      }
      let index = this.activeName;
      this.isLoadMore = false;
      this.dataList[index].page += 1;
      let status = ["1", "2", "-1"];
      $http
        .get(
          "plugin.group-work.frontend.modules.alliance.controllers.records.index",
          {
            page: this.dataList[index].page,
            status: status[index]
          },
          "加载中"
        )
        .then(response => {
          this.isLoadMore = true;
          if (response.result === 1) {
            if (response.data.page_list.current_page >= response.data.page_list.last_page) this.dataList[index].isFinished = true;
            this.dataList[index].list = this.dataList[index].list.concat(response.data.page_list.data);
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          this.isLoadMore = true;
          console.log(err);
        });
    },
    gotoDetail(aid, id) {
      this.$router.push(this.fun.getUrl("groupWorkDetail", { aid: aid, id: id }));
    },
    toOrder(_orderid) {
      this.$router.push(this.fun.getUrl("orderdetail", { order_id: _orderid, orderType: "groupWork" }));
    }
  },
  components: { myGroupCell, yzSpecs }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#mygroups {
  .time_state {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    height: 2.5rem;
    line-height: 2.5rem;
    padding: 0 0.875rem;

    .state {
      color: #f15353;
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
}
</style>
