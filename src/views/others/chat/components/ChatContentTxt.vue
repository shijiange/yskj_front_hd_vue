<template>
  <span class="txt-content" v-html="checkoutURL(item.content)"></span>
</template>
<script>
export default {
  props: ["item"],
  mounted() {
    this.$emit("loaded");
  },
  methods: {
    checkoutURL(str){
      // 要以http 开头  防止图片src开头
      let reg = /^(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|#|;|%)+)/g;
      str = str.replace(reg, (website)=>{
        return "<span onclick='event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true); // 阻止事件冒泡'><a class='article-link-color' href='" + website +"' target='_blank'>" + website + "</a></span>";
      });
      return str;
    },
  }
};
</script>

<style>
.txt-content {
  user-select: text;
}

.txt-content img {
  max-width: 100%;
}

.txt-content a {
  color: #31e7c5;
}
</style>