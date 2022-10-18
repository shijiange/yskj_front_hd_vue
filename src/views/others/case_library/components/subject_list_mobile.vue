<template>
  <div id="subject-list">
    <headTemplate text="热门专题" choosed="subject"></headTemplate>
    <div class="subject">
      <div class="top">
        <div class="img">
          <img src="../../../../assets/images/case-hot.png" alt="" />
        </div>
        <div class="title">热门专题</div>
      </div>
    </div>
    <subjectTemplate :datas="list"></subjectTemplate>

    <serviceTemplate></serviceTemplate>
  </div>
</template>

<script>
import subject_list_mobile_controller from './subject_list_mobile_controller';

export default subject_list_mobile_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$text-color: #202020;

#subject-list {
  background: #fff;

  .top {
    padding: 1.25rem 0.9375rem 0 0.9375rem;
    display: flex;
    line-height: 1.5rem;

    .img {
      width: 0.9375rem;
      height: 1.25rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .title {
      color: $text-color;
      font-size: 1.0625rem;
      font-weight: 700;
      flex: 1;
      text-align: left;
      margin-left: 0.4275rem;
    }
  }
}
</style>
