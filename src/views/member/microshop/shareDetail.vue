<template>
  <div id="share">
    <div>
      <c-title :hide="false" :text="`${income_name_text}详情`"></c-title>
      <div class="top">
        <i>{{ module1.title }}</i>
        <div class="content">
          <span>{{ module1.money }}</span
          >元
          <br />
          <b>{{ module1.status }}</b>
        </div>
      </div>
      <div class="middle">
        <template v-for="(item,index) in module2">
          <div class="lrest" :key="index">{{ item.name }}</div>
          <div class="resot" :key="index">{{ item.value }}</div>
        </template>
      </div>
      <div class="middle">
        <template v-for="(item,index) in module3">
          <div class="lrest" :key="index">{{ item.name }}</div>
          <div class="resot" :key="index">{{ item.value }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import shareDetail_controller from "./shareDetail_controller";
export default shareDetail_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
p,
ul,
li {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

#share {
  .m_header {
    width: 100%;
    height: 2.8125rem;
    padding-right: 0.9375rem;
    box-sizing: border-box;
    background: #fff;
    line-height: 2.8125rem;
    font-size: 18px;

    span {
      display: inline-block;
      width: 1rem;
      height: 1.5rem;
      float: left;
      margin-left: 0.625rem;
      font-size: 30px;
    }

    i {
      font-size: 1rem;
      float: right;
      font-style: normal;
    }
  }

  .top {
    height: 5.9375rem;
    padding: 0.9375rem;
    background: #fff;
    position: relative;
    text-align: center;
    margin: 0.9375rem 0;

    i {
      font-style: normal;
      font-size: 1rem;
      display: block;
    }

    .content {
      width: 7.5rem;
      margin: 0 auto;
      font-size: 16px;
      text-align: center;

      span {
        font-size: 28px;
        color: green;
        display: inline-block;
        padding-top: 0.75rem;
        margin-bottom: 0.3125rem;
      }

      b {
        line-height: 1.5rem;
        font-weight: normal;
        color: #fff;
        background: #f15353;
        width: 3.75rem;
        height: 1.5rem;
        display: inline-block;
      }
    }
  }

  .middle,
  .bott {
    text-align: left;
    padding: 0.9375rem 0.9375rem;
    line-height: 2rem;
    color: #343434;
    background: #fff;
    margin-bottom: 0.5rem;
  }

  .middle {
    display: flex;
    flex-wrap: wrap;

    .lrest {
      flex: 50%;
    }

    .resot {
      flex: 50%;
      text-align: right;
    }
  }
}
</style>
