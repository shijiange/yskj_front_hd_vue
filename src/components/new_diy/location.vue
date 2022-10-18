<template>
  <div class="U000005-template1" :class="className" :id="`location-box-${this.id}`">
    <!-- style -->
    <div v-html="css"></div>

    <div class="location-box" v-if="datas.location_style == 1 || datas.location_style == 2">
      <div class="location-left" @click='tolocation'>
        <i class="iconfont icon-order_locate"></i>
        <span class="title">{{address || '全国'}}</span>
        <i class="iconfont icon-advertise-next"></i>
      </div>
      <div class="location-right" v-show="datas.show_search != 1" @click='tosearch'>
        <i class="iconfont icon-all_search_2"></i>
        <span>{{datas.search_title}}</span>
      </div>
      <div v-if="datas.location_style == 2 && datas.show_search != 1" @click='tosearch' class="location-search">搜索</div>
    </div>

    <div class="location-box2" v-if="datas.location_style == 3">
      <div class="location-whole">
        <div class="location-left" @click='tolocation'>
          <span class="title">{{address || '全国'}}</span>
          <i class="iconfont icon-advertise-next"></i>
        </div>
        <div class="location-right" v-show="datas.show_search != 1" @click='tosearch'>
          <i class="iconfont icon-all_search_2"></i>
          <span>{{datas.search_title}}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Toast } from 'vant';
// 自定义样式
const css = function () {
  const {
    preview_color,
    border_style,
    search_border_radius,
    bg_color,
    border_color,
    font_color,
    city_font_color,
  } = this.datas;

  return `
        .component-${this.id} .location-box, .component-${this.id} .location-box2{
            background-color: ${preview_color.color || '#f8f8f8'};
            background-image: url(${preview_color.isColor == 2? preview_color.image: ''});
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
        }
        .component-${this.id} .location-box .location-right{
            border-radius: ${search_border_radius}px;
            border: solid  ${border_style}px ${border_color};
            background-color: ${bg_color || '#f8f8f8'};
            color: ${font_color};
        }

        .component-${this.id} .location-search {
            color: ${city_font_color};
        }

        .component-${this.id} .location-box .location-left {
            color: ${city_font_color};
        }

        .component-${this.id} .location-box2 .location-whole {
            border-radius: ${search_border_radius}px;
            border: solid  ${border_style}px ${border_color};
            background-color: ${bg_color || '#f8f8f8'};
        }

        .component-${this.id} .location-box2 .location-left {
            color: ${city_font_color};
            border-color: ${city_font_color};
        }

        .component-${this.id} .location-box2 .location-right {
            color: ${font_color};
        }
    `;
};

export default {
  props: ['id', 'datas', 'styles'],
  data() {
    return {
      address: '',
      city: '',
      point: {},

      oldOffsetTop: 0,
      oDiv: {}
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
    this.ready();
  },
  activated() {
    this.ready();
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ready () {
      this.$store.commit('setReferer', window.location.href);
      this.$nextTick(() => {
        this.oDiv = document.getElementById(`location-box-${this.id}`);
      });
      window.addEventListener("scroll", this.handleScroll);
      this.fun.getLocation()
        .then((res)=> {
          this.point = res.point;
          this.address = res.title;
          this.city = res.city;
        })
        .catch((err)=> {
          console.log(err);
        });
    },
    tolocation() {
      this.$router.push(this.fun.getUrl('o2oLocation'));
    },
    tosearch() {
      if (!this.city) {
        Toast('请先选择城市');
        return;
      }

      let search_type = this.datas.search_type || 'store';
      this.$router.push(this.fun.getUrl('o2oSearchMultiple', {city: this.city, point: JSON.stringify(this.point),fromHome:1},{search_type}));
    },
    handleScroll() {
      if(this.datas.is_top_fixed != 1) {
        return;
      }

      let s = document.body.scrollTop || document.documentElement.scrollTop;
      if(this.oDiv.offsetTop != 0) {
        this.oldOffsetTop = this.oDiv.offsetTop;
      }
      if (s > this.oDiv.offsetTop && s > this.oldOffsetTop) {
        if(this.fun.getPhoneEnv() == 3) {
          this.oDiv.style = "position:fixed;top:0;width:375px;z-index:10";
        }else {
          this.oDiv.style = "position:fixed;top:0;width:100%;z-index:10";
        }
      } else {
        this.oDiv.style = "";
      }
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

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .location-box {
    display: flex;
    height: 45px;
    line-height: 45px;
    padding: 0 10px;

    .location-left {
      width: 40%;
      display: flex;
    }

    .location-right {
      flex: 0 0 47%;
      overflow: hidden;
      height: 25px;
      line-height: 25px;
      align-self: center;
      padding: 0 8px;
    }

    .location-search {
      text-align: center;
      flex:  0 0 10%;
      margin-left: 5px;
    }
  }

  .location-box2 {
    height: 45px;
    line-height: 45px;
    width: 100%;
    padding: 8px 10px;

    .location-whole {
      display: flex;
      padding: 5px;
      height: 30px;
      line-height: 20px;
    }

    .location-left {
      display: flex;
      width: 40%;
    }

    .location-right {
      border-left: 1px solid #d3d3d3;
      width: 60%;
      padding-left: 10px;
    }
  }
</style>
