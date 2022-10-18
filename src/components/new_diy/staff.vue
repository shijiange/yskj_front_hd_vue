<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <!--客服静态-->
    <div class="customer_service">
      <div class="service-item" v-for="(item, index) in datas.list" :key="index" @click="toService(item)">
        <div class="avatar">
          <img :src="item.avatar || emptyImage" alt="">
        </div>
        <div class="name">{{item.nickname}}</div>
        <span class="btn-session" @click.stop="toChat(item)">
          <span class="button-item">{{datas.button_title}}</span>
        </span>
      </div>

      <div style="font-size: 20px; font-weight: bold; margin: 15px auto;" v-if="!datas.list || datas.list.length <= 0">
        暂无添加客服
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
      font_size,
      font_color,
      button_size,
      button_bg_color,
      button_color,
      show_border,
      button_border_color,
    } = this.datas;

    return `
      .component-${this.id} .customer_service {
          background-color: ${preview_color.color || '#ffffff'};
          background-image: url(${preview_color.isColor == 2 ? preview_color.image : ''});
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
      }

      .component-${this.id} .customer_service .name {
          font-size: ${font_size}px;
          color: ${font_color};
      }

      .component-${this.id} .customer_service .btn-session {
          background-color: ${button_bg_color};
          font-size: ${button_size}px;
          color: ${button_color};
          border: solid ${show_border ? '1' : '0'}px ${button_border_color};
      }

  `;
  }
};

export default {
  data(){
    return{
      emptyImage,
    };
  },
  props: ['id', 'datas', 'styles'],
  computed: {
    css() {
      return '<style>' + css.call(this) + '</style>';
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
  },

  methods: {
    toService(item) {
      this.$router.push(this.fun.getUrl("personalProfile",{}, { id: item.id }));
    },
    toChat(item) {
      window.location.href = item.h5_url;
    },
  },

  mounted() {
    this.$emit('loaded');
  }
};
</script>

<style lang="scss" scoped>
  .customer_service {
    display: flex;
    flex-flow: wrap;
    padding: 10px 8px 0;
    font-size: 12px;
    color: #333;

    .service-item {
      display: flex;
      flex: 0 0 30%;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      padding: 10px 5px;
      background-color: #fff;
      border-radius: 10px;
      margin: 0 4px 10px;
    }

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .btn-session {
      color: #3b98f7;
      margin-top: 10px;
      padding: 2px 8px;
      border-radius: 15px;
      background-color: #f5f5f5;
    }
  }
</style>
