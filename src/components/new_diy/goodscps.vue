<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div>
      <div id="tab">

        <ul class="tab_list" v-if="datas.list && datas.list.length > 0" :style="{minHeight: datas.is_tab_high ? '' :'100vh'}">
          <van-tabs v-model="active"
                    :sticky="sticky"
                    @change="onChange"
                    :background="datas.tab_bg_color"
                    :title-active-color="datas.tab_active_color"
                    :color="datas.tab_active_color"
                    :title-inactive-color="datas.tab_color">
            <van-tab :title="item.text" :name="i" v-for="(item, i) in datas.list" :key="i">
              <div  v-if="show_page && active == i && item">
                  <cpslist :datas="goodsData" :ratio_data="ratio_data"></cpslist>
              </div>
              <template v-if="!show_page">
                <div :style="{backgroundColor: datas.tab_bg_color}" style="padding: 100px 15px; text-align: center;">
                  {{show_text}}
                </div>
              </template>
            </van-tab>
          </van-tabs>
        </ul>

        <div v-if="datas.list.length <= 1 && datas.list[0] && !datas.list[0].text"
             style="padding: 100px 15px; text-align: center;" :style="{backgroundColor: datas.tab_bg_color}">
          暂无设置商品数据
        </div>

      </div>

      <div v-if="lastIndex != index">
        <div class="loadMore" v-if="isLoadMore" @click="getMoreData">
          {{ $i18n.t('加载更多') }}
        </div>
        <div class="loadMore" v-if="lastIndex == index && !isLoadMore">{{ $i18n.t('没有更多了') }}~~</div>
      </div>
    </div>
  </div>
</template>

<script>
import cpslist from "./component/cpslist";
import { cpsApi } from "../../utils/cpsApi"; //引入CPS方法
import emptyImage from "../../assets/images/new_diy/banner.png";
// 自定义样式
const css = function() {
  const {
    tab_bg_color,
    tab_color,
    tab_active_color
  } = this.datas;

  return `
        .component-${this.id}  .nav-bgimage{
            background-color: ${tab_bg_color};
            color: ${tab_color};
        }

        .component-${this.id}  .nav-bgimage .nav-selected{
            color: ${tab_active_color};
            border-bottom: 2px solid ${tab_active_color};
        }
    `;
};

export default {
  mixins: [cpsApi],
  data() {
    return {
      emptyImage,
      active: '0',
      show_text: '加载中...',
      show_page: true,

      sticky: false,
    };
  },
  props: ['isBottom', 'lastIndex', 'index', "page_id", "id", "datas", "component_key"],
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    },
  },
  mounted() {
    this.getCPSLogin();
    setTimeout(()=>{
      this.sticky = true;
    },500);
  },
  watch: {
    isBottom: function(newVal, oldVal) {
      // this.lastIndex == this.index判断商品列表是最后一个组件
      if (newVal && this.lastIndex == this.index && this.isLoadMore) {
        this.page += 1;
        this.getCPSGood(this.active,this.datas.list[this.active].text,'more');
      }
    }
  },
  methods: {
    getMoreData() {
      this.page += 1;
      this.getCPSGood(this.active,this.datas.list[this.active].text,'more');
    },
    onChange(index, title) {
      this.page = 1;
      this.isLoadMore = true;
      this.getCPSGood(index, title);
    },
  },
  components: {
    cpslist
  },
};
</script>

<style lang="scss" scoped>
  // 默认
  * {
    list-style-type: none;
  }

  .component-wrapper {
    width: 100%;
  }

  .tab_list {
    background: #fff;
  }

  .loadMore {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    clear: both;
    background: #fff;
  }
</style>
