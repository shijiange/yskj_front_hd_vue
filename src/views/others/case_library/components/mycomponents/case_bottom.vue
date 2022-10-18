<template>
  <div id="case-bottom" v-html="$store.state.caseLibrary.set.nav_bottom"></div>
</template>

<script>
import case_bottom_controller from './case_bottom_controller';

export default case_bottom_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#case-bottom {
  background: #fff;
  text-align: left;
  // .bottom {
  //   width: 100%;
  //   img {
  //     width: 100%;
  //   }
  // }
}
</style>
<style lang="scss" rel="stylesheet/scss">
#case-bottom {
  .bottom {
    height: 388px;

    /* background-image: url(./../images/contact_part1.png); */
    background: #2f3034;
    background-position: left;
    background-size: cover;
    width: 100%;
    color: #fff;
  }

  .bottom-a {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    overflow: hidden;
    padding-top: 30px;
  }

  .bottom-left {
    border-right: 1px solid #ccc;
    margin: 30px 0;
    flex: 3;
    display: flex;
    justify-content: flex-start;
  }

  .bottom-left-one {
    display: flex;
    width: 100%;
  }

  .bottom-left-title {
    flex: 1;
    margin-right: 30px;
  }

  .bottom-left-title1 {
    padding-bottom: 15px;
    display: inline-block;
    border-bottom: 2px solid #fff;
    margin-bottom: 30px;
    cursor: pointer;
  }

  .bottom-left-title2 a {
    color: #fff;
  }

  .bottom-left-title2 {
    font-size: 14px;
    line-height: 28px;
    cursor: pointer;
  }

  .bottom-right {
    flex: 2;
    display: flex;
    justify-content: center;
    margin: 30px 0;

    /* border: 1px solid #ccc; */
  }

  .bottom-right-img {
    flex: 1;
    margin-left: 30px;
    text-align: center;
    height: 150px;
  }

  .bottom-right-img img {
    width: 150px;
    height: 150px;
  }

  .bottom-right-tip {
    padding-top: 20px;
    font-size: 14px;
  }

  .bottom-b {
    text-align: center;
    line-height: 28px;
    font-size: 14px;
  }
}
</style>
