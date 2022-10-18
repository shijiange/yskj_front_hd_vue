<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="html-box" v-if="(datas.show_list && datas.show_list.length > 0) || datas.list.length > 0">
      <div id="memberrights">
        <div class="title" @click="changeShow">
          <div style="display: flex;">
            <div class="spare"></div>
            <h3>{{datas.title}}</h3>
          </div>
          <i v-show="datas.list_style == '2' && !show" style="flex: 1; text-align: right; font-size: 20px;" class="iconfont icon-member-top"></i>
        </div>

        <ul class="tool-box" v-if="datas.list_style == '1'">
          <li v-for="icon in datas.show_list" :key="icon.url" v-if="notShow.indexOf(icon.url)<0" @click="pluginGoto(icon)">
            <!--<img class="diy-img" :src="icon.image || emptyImage" :onerror="errorImg01" alt="">-->
            <i class="iconfont" :class="icon.class"></i>
            <div>{{icon.title}}</div>
          </li>
          <li v-for="(item, index) in datas.list" :key="index" @click="gotoUrl(item)">
            <img class="diy-img" :src="item.image || emptyImage" alt="">
            <div style="margin-top: 9px;">{{item.text}}</div>
          </li>
        </ul>

        <ul class="tool-boxlis" v-if="datas.list_style == '2'" v-show="show">
          <li v-for="icon in datas.show_list" :key="icon.url" v-if="notShow.indexOf(icon.url)<0" @click="pluginGoto(icon)">
            <div class="lis">
              <img class="diy-img" :src="icon.image || emptyImage" :onerror="errorImg01" alt="">
              <!--<i class="iconfont" :class="icon.class" style="font-size: 28px;"></i>-->
              <div>{{icon.title}}</div>
            </div>
            <i class="iconfont icon-member_right"></i>
          </li>
          <li v-for="(item, index) in datas.list" :key="index" @click="gotoUrl(item)">
            <div class="lis">
              <img class="diy-img" :src="item.image || emptyImage" alt="">
              <div style="margin-left: 5px;">{{item.text}}</div>
            </div>
            <i class="iconfont icon-member_right"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import emptyImage from '@/assets/images/new_diy/image.png';
// 自定义样式
const css = function () {
  if(this.datas.preview_color) {
    const {
      preview_color,
      text_color
    } = this.datas;

    return `
      .component-${this.id} .html-box {
          background-color: ${preview_color.color};
          background-image: url(${preview_color.isColor == 2 ? preview_color.image : ''});
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
      }

      .component-${this.id} .html-box .tool-box, .component-${this.id} .html-box .tool-boxlis{
          color: ${text_color};
      }
  `;
  }
};

export default {
  props: ["id", "datas", "member_item", "notShow"],
  data() {
    return {
      emptyImage,
      errorImg01: 'this.src="' + require('@/assets/images/new_diy/image.png') + '"',
      show: true,
    };
  },
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    },
  },
  methods: {
    changeShow() {
      this.show = !this.show;
    },
    gotoUrl(item) {
      if (item.h5_link) {
        window.location.href = item.h5_link;
      }
    },
    pluginGoto(item) {
      if (item.name == "article") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            id: "0"
          })
        );
      } else if (item.name == "courier") {
        window.localStorage.setItem("couriername", item.title);
        this.$router.push(this.fun.getUrl(item.url));
      } else if (item.name == "supplier") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            uid: this.member_item.uid
          })
        );
      } else {
        this.$router.push(this.fun.getUrl(item.url));
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/icon.scss";

* {
  list-style: none;
  padding: 0;
  margin: 0;
}

// 默认
.component-wrapper {
  width: 100%;
}

.html-box {
  min-height: 30px;
}

#memberrights {
  overflow: hidden;
  color: #333;

  .title {
    display: flex;
    height: 40px;
    line-height: 40px;
    padding: 0 14px;

    /* border: solid 1px #f3f3f3; */
  }

  .spare {
    width: 4px;
    height: 16px;
    border-radius: 1px;
    background-color: #f15353;
    margin-top: 11px;
    margin-right: 6px;
  }

  h3 {
    color: #333;
    text-align: left;
    font-size: 16px;
    box-sizing: border-box;
  }

  .tool-boxlis {
    display: -webkit-box;
    display: -webkit-flex;
    padding: 10px 0 10px 0;
    flex-direction: column;

    .lis {
      display: flex;
      align-items: center;
      font-size: 16px;
    }

    .diy-img {
      width: 23px;
      height: 23px;
      margin: 6px;
      display: block;
    }

    li {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      position: relative;
      box-sizing: border-box;
      text-align: center;
      font-size: 12px;
      margin-bottom: 10px;
      padding: 0 10px;

      .span {
        line-height: 30px;
      }
    }

    li i {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      color: #c9c9c9;
      line-height: 36px;

      /* margin-bottom: 4px; */
    }

    li .lis i {
      color: #f15353;
      margin-right: 5px;
      font-size: 25px;
    }
  }

  .tool-box {
    padding: 20px 0 10px 0;
    display: flex;
    flex-wrap: wrap;

    li {
      width: 25%;
      position: relative;
      box-sizing: border-box;
      text-align: center;
      font-size: 12px;
      margin-bottom: 10px;

      .span {
        line-height: 30px;
      }
    }

    .diy-img {
      width: 28px;
      height: 28px;
      margin: 6px auto;
      display: block;
    }

    li i {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      line-height: 36px;
      font-size: 20px;
      margin-bottom: 7px;
    }
  }
}

</style>
