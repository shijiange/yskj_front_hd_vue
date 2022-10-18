
<template>
    <div id="teamCode">
        <c-title :hide="false" text='使用记录'></c-title>
		<div style="height: 5px;"></div>

        <ul class='rationList' v-for="(item,i) in codes" :key='i'>
          <li>
            <div class="left">
                <span>{{item.code}}</span>
                <p>使用者:{{item.has_one_use_member.nickname}}</p>
            </div>
            <div class="right">
                <span>已使用</span>
                <p>使用时间:{{item.updated_at}}</p>

            </div>
          </li>
        </ul>
    </div>
</template>

<script>
import newcode_history_controller from './newcode_history_controller';
export default newcode_history_controller;

</script>

<style  lang="scss" rel="stylesheet/scss" scoped>
#teamCode {
  .el-button--text {
    color: #fff;
    background-color: #ff4949;
    border-color: #ff4949;
    width: 90%;
    margin: 0.625rem;
  }

  .m_header {
    width: 100%;
    height: 2.8125rem;
    line-height: 2.8125rem;
    background: #fff;
    font-size: 15px;
    font-weight: bold;
    border-bottom: 0.0625rem solid #ccc;

    span {
      display: inline-block;
      width: 1rem;
      height: 1.5rem;
      float: left;
      font-size: 22px;
      font-weight: normal;
    }
  }

  .rationList {
    li {
      background: #fff;
      padding: 0.625rem;
      overflow: hidden;
      border-bottom: 0.0625rem solid #ddd;
      margin-bottom: 0.625rem;

      .left {
        float: left;
        color: #333;
        font-size: 16px;
        line-height: 1.75rem;
        text-align: left;
        p { color: #999; font-size: 12px; text-align: left; }
      }

      .right {
        float: right;
        line-height: 1.75rem;
        text-align: right;
        p { color: #999; font-size: 12px; }
      }
    }
  }
}

</style>
