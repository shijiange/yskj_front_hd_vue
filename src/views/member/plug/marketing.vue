<template>
  <div id="marketing">
    <c-title :hide="false" text='营销工具'></c-title>
    <router-link to="/member/marketing">
      <ul>
        <li>
          <router-link to="/member/1"><i class="fa fa-star"></i>营销工具<i class="fa fa-angle-right"></i></router-link>
        </li>
        <li>
          <router-link to="/member/2"><i class="fa fa-star"></i>营销工具<i class="fa fa-angle-right"></i></router-link>
        </li>
        <li>
          <router-link to="/member/3"><i class="fa fa-star"></i>营销工具<i class="fa fa-angle-right"></i></router-link>
        </li>
        <li>
          <router-link to="/member/4"><i class="fa fa-star"></i>营销工具<i class="fa fa-angle-right"></i></router-link>
        </li>
        <li>
          <router-link to="/member/5"><i class="fa fa-star"></i>营销工具<i class="fa fa-angle-right"></i></router-link>
        </li>
        <li>
          <router-link to="/member/6"><i class="fa fa-star"></i>营销工具<i class="fa fa-angle-right"></i></router-link>
        </li>
        <li>
          <router-link to="/member/7"><i class="fa fa-star"></i>营销工具<i class="fa fa-angle-right"></i></router-link>
        </li>
      </ul>
    </router-link>
  </div>
</template>
<script>
import marketingcontroller from "./marketingcontroller";

export default marketingcontroller;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #marketing {
    a {
      color: #000;
    }

    ul {
      background: #fff;
      overflow: hidden;
    }

    li {
      border-bottom: 0.0625rem #f0f0f0 solid;
      padding-left: 0.625rem;
      line-height: 2.75rem;
      text-align: left;
      color: #000;
    }

    i {
      float: left;
      color: #a8a8a8;
      font-size: 26px;
      line-height: 2.75rem;
    }

    .fa-star {
      margin-right: 0.625rem;
    }

    .fa-angle-right {
      color: #999;
      width: 1.25rem;
      float: right;
    }
  }
</style>