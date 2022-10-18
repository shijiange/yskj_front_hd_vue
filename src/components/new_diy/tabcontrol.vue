<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div>
      <div id="tab">

        <ul class="tab_list" v-if="datas.list && datas.list.length > 0" :style="{minHeight: datas.is_tab_high ? '' :'100vh'}">
          <van-tabs v-model="active"
                    :sticky="sticky"
                    @change="onClick"
                    :background="datas.tab_bg_color"
                    :title-active-color="datas.tab_active_color"
                    :color="datas.tab_active_color"
                    :title-inactive-color="datas.tab_color">
            <van-tab :title="item.name || item.component" :name="i" v-for="(item, i) in datas.list" :key="i">
              <div  v-if="show_page && active == i && item">
                  <component
                    :is="item.uikey"
                    :id="id"
                    :index="i"
                    :page_id="page_id"
                    :datas="item.remote_data"
                    :component_key="'U_tabcontrol'"
                    :tabcontrol="true"
                    :isLast="isLast"
                    :isBottom="isBottom"
                    :fatherTitle="fatherTitle"
                  >
                  </component>
              </div>
              <template v-if="!show_page">
                <div :style="{backgroundColor: datas.tab_bg_color}" style="padding: 100px 15px; text-align: center;">
                  {{show_text}}
                </div>
              </template>
            </van-tab>
          </van-tabs>
        </ul>

        <div v-if="datas.list.length <= 1 && datas.list[0] && !datas.list[0].list_id"
             style="padding: 100px 15px; text-align: center;" :style="{backgroundColor: datas.tab_bg_color}">
          暂无设置选项卡或数据
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import U_article from "components/new_diy/article";
import U_goods from "components/new_diy/goods";
import U_goodsgroup from "components/new_diy/goodsgroup";
import U_goodsnearby from "components/new_diy/goodsnearby";
import U_goodsrush from "components/new_diy/goodsrush";
import U_simplegraph from "components/new_diy/simplegraph";
import U_cube from "components/new_diy/cube";
import U_livestreaming from "components/new_diy/livestreaming";
import U_community from "components/new_diy/community";
import U_shortvideo from "components/new_diy/shortvideo";
import U_lottery from "components/new_diy/lottery";
import U_stores from "components/new_diy/stores";
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
  data() {
    return {
      emptyImage,
      active: '0',
      show_text: '加载中...',
      show_page: true,
      isLast: false,

      sticky: false,
    };
  },
  props: ['isBottom', 'lastIndex', 'index', "page_id", "id", "datas", "component_key","fatherTitle"],
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
    if(this.lastIndex == this.index) {
      this.isLast = true;
    }
    setTimeout(()=>{
      this.sticky = true;
    },500);
  },
  methods: {
    // 功能数据
    handleDatas (old_data) {
      // 如果有配置项的话
      if (old_data) {
        const datas = {};
        Object.keys(old_data).map(key => {
          datas[key] = old_data[key].value;
        });
        return datas;
      } else {
        return this.component.remote_data || {};
      }
    },
    onClick(index, title) {
      this.getTabData(index);
      console.log(this.fatherTitle);
      console.log(6666);
      zhuge.track(this.fatherTitle+'-点击标签',{
        '标签名称':title
      });
    },
    getTabData(index) {
      this.show_page = false;
      this.show_text = '加载中...';
      $http
        .post(
          "home-page.get-decorate-page",
          {
            decorate_id: this.page_id || this.$store.state.temp.item.id,
            component_id: this.id,
            component_key: this.component_key,
            component_info: JSON.stringify({ list_key: index })
          }, "loading")
        .then((response) => {
          if (response.result === 1) {
            this.datas.list[index].remote_data = response.data[0].remote_data;
            this.show_page = true;
          } else {
            this.show_page = false;
            this.show_text = '后台没有设置数据或数据报错';
          }
        });
    }
  },
  components: {
    U_article,
    U_goods,
    U_goodsgroup,
    U_goodsnearby,
    U_goodsrush,
    U_simplegraph,
    U_cube,
    U_livestreaming,
    U_community,
    U_shortvideo,
    U_lottery,
    U_stores
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
    /* min-height: 100vh; */
    background: #fff;
  }
</style>
