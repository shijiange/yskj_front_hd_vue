<template>
  <div id="date">
    <h1>
      <i class="fa fa-angle-left" @click="put"></i>
      <span>{{ year }}年{{ month }}月</span>
      <i class="fa fa-angle-right" @click="add"></i>
    </h1>
    <ol>
      <li>日</li>
      <li>一</li>
      <li>二</li>
      <li>三</li>
      <li>四</li>
      <li>五</li>
      <li>六</li>
    </ol>
    <div style="height: 19rem; background: #fff;">
      <ul>
        <div v-bind:style="{ width: w + '%' }"></div>
        <li v-for="(val, key) in m" :key='key'>
          <span>{{ val }}</span>
          <img v-if="test(key)" src="../../../assets/iconfont/gou.svg" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import member_datecontroller from "./member_datecontroller";
export default member_datecontroller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#date {
  width: 21.5625rem;
  border-radius: 0.375rem;
  overflow: hidden;
  margin: 0 auto;

  h1 {
    background: #fff;
    font-size: 16px;
    color: #333;
    line-height: 2.5rem;
    text-align: center;
    text-indent: 1rem;
    display: flex;
    justify-content: center;

    i {
      font-size: 1.5rem;
      color: #ccc;
      line-height: 2.5rem;
    }

    span {
      margin: 0 0.625rem;
    }
  }

  ol {
    display: flex;
    background: #fafafa;
  }

  h1 {
    background: #fff;
    font-size: 16px;
    color: #f15353;
    font-weight: normal;
    line-height: 2.5rem;
    text-align: left;
    text-indent: 1rem;
  }

  ol {
    display: flex;
    background: #fff;
    box-sizing: border-box;
    padding: 0 0.3rem;

    & > li {
      display: inline-block;
      width: 14.27%;
      float: left;
      line-height: 2rem;
      border-bottom: solid 0.0625rem #e5e5e5;
    }
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    box-sizing: border-box;
    padding: 0 0.3rem;

    div {
      border-bottom: solid 0.0625rem #e5e5e5;
    }

    & > li {
      list-style: none;
      width: 14.27%;
      height: 3rem;
      border-bottom: solid 0.0625rem #e5e5e5;

      span {
        display: block;
        margin: 0.55rem 0 0.4rem 0;
      }

      img {
        background: #f15353;
        border-radius: 50%;
        width: 0.85rem;
        height: 0.85rem;
        display: block;
      }
    }

    &::after {
      content: "";
      width: 100%;
      height: 0.0625rem;
      z-index: 1;
      background: #fff;
      position: relative;
      left: 0;
      bottom: 0.0625rem;
    }
  }
}
</style>
