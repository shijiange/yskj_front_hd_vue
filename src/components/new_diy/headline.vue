<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <!--头条静态-->
    <div class="headline">
      <!-- 在这里写签到静态头条静态 -->
      <div class="headline_img" v-if="datas.show_logo">
        <img :src="datas.logo_image ? datas.logo_image : emptyImage" alt="">
      </div>
      <div class="fixright" @click="gotoList">
        <template v-if="datas.show_number == 2">
          <van-swipe
            :style="{height: datas.headline_height+'px', background: datas.preview_color}"
            :autoplay="3000"
            vertical
            :touchable="false"
            :show-indicators="false"
            loop
            :width="fun.getPhoneEnv() == 3 ? 375 : clientWidth"
          >
            <div v-if="listData.length <= 0" :style="{lineHeight: datas.headline_height+'px'}" style="margin-left: 20px;"> 暂无设置文章</div>
            <van-swipe-item v-for="(item, i) in listData_2" :key="i">
              <div class="right" v-for="(item_1, i) in item" :key="i">
                <div class="headline_tag" v-if="datas.show_tag">
                  <span>{{datas.headline_tag}}</span>
                </div>
                <div class="headline_title" :style="{ lineHeight: datas.headline_height/2+'px'}">
                  {{ item_1.title || '暂无文章标题'}}
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </template>

        <template v-if="datas.show_number == 1">
          <van-swipe
            :style="{height: datas.headline_height+'px', background: datas.preview_color}"
            :autoplay="3000"
            loop
            vertical
            :touchable="false"
            :show-indicators="false"
            :width="fun.getPhoneEnv() == 3 ? 375 : clientWidth"
          >
            <div v-if="listData.length <= 0" :style="{lineHeight: datas.headline_height+'px'}" style="margin-left: 20px;"> 暂无设置文章</div>
            <van-swipe-item v-for="(item, i) in listData" :key="i">
              <div class="right">
                <div class="headline_tag" v-if="datas.show_tag">
                  <span>{{datas.headline_tag}}</span>
                </div>
                <div class="headline_title" :style="{lineHeight: datas.headline_height+'px'}">
                  {{item.title || '暂无文章标题'}}
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </template>
      </div>

    </div>

  </div>
</template>

<script>
import emptyImage from '../../assets/images/new_diy/toutiao.png';
// 自定义样式
const css = function () {
  const {
    preview_color,
    headline_height,
    headline_font_size,
    headline_font_color,
    tag_color,
    tag_font_color,
    tag_font_size,
    show_tag_border,
    tag_border_color,
    logo_image_size
  } = this.datas;

  return `
        .component-${this.id} .headline {
            background-color: ${preview_color};
            height: ${headline_height}px;
        }

        .component-${this.id} .headline_img {
        	width: ${logo_image_size}px;
        }

        .component-${this.id} .fixright .headline_title {
        		color: ${headline_font_color};
            font-size: ${headline_font_size}px;
        }

        .component-${this.id} .fixright .headline_tag {
        		border-radius: 5px;
        		background-color: ${tag_color};
        		color: ${tag_font_color};
            font-size: ${tag_font_size}px;
            border: solid ${show_tag_border?'1':'0'}px ${tag_border_color};
        }

    `;
};

export default {
  props: ['id', 'datas', 'styles'],
  data() {
    return {
      emptyImage,
      listData: [],
      listData_2: [],
      clientWidth: ''
    };
  },
  computed: {
    css() {
      return '<style>' + css.call(this) + '</style>';
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.clientWidth = document.body.clientWidth;
      this.listData = this.datas.list;

      if (this.datas.show_number == 2) {
        let arr_1 = [];
        for (let i = 0; i < this.listData.length; i += 2) {
          let arr_2 = [];
          if (this.listData[i]) {
            arr_2.push(this.listData[i]);
          }
          if (this.listData[i + 1]) {
            arr_2.push(this.listData[i + 1]);
          }
          arr_1.push(arr_2);
        }
        this.listData_2 = arr_1;
      }
    },
    gotoList() {
      window.localStorage.setItem('showheadline', JSON.stringify(this.datas));
      this.$router.push(this.fun.getUrl('ArticleList',{},{from: 'U_headline'}));
    }
  },

};
</script>

<style lang="scss" scoped>
  // 默认
  .component-wrapper {
    width: 100%;
    text-align: left;
  }

  .headline {
    display: flex;
    align-items: center;
    padding: 4px 0;

    .headline_img {
      margin-left: 16px;

      /* width: 36px; */

      /* height: 36px; */
      img {
        width: 100%;
        height: 100%;
      }
    }

    .fixright {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      justify-content: center;
    }

    .fixright .right:nth-child(2) {
      /* margin-top: 5px; */
    }

    .right {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;

      .headline_tag {
        margin-left: 9px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 3.5px 6.5px;
        // margin-left: 7px;
      }

      .headline_title {
        margin-left: 9px;
        flex: 0 0 67%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
