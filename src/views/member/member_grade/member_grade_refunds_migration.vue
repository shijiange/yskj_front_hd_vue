<template>
    <div id="member-grade">
       <c-title :hide="false" text='退款迁移'></c-title>
        <div class="box">
            <ul>
                <li class="time"><font>您的会员余额有效期：</font><span>2018-12-31</span></li>
                <li class="balance"><font>折合金额：</font><span>XX元</span></li>
                <li class="formula">折合金额=剩余有效期天数（取整）*每周期金额</li>
            </ul>
            <div class="region">
                <h1>当前分站区域：广东省-广州市-白云区</h1>
                <div class="select">
                    <!--<el-select style="width:100%;height:1.875rem" placeholder="请选择迁入分站区域" placement="top">-->
                        <!--<el-option value="">广东省-广州市-白云区</el-option>-->
                        <!--<el-option value="">广东省-广州市-天河区</el-option>-->
                        <!--<el-option value="">广东省-广州市-海珠区</el-option>-->
                    <!--</el-select>-->
                    <van-button plain type="primary"  style="border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-height: 1rem; min-width: 4rem;"  @click="seleRegional">{{regional}}</van-button>
                </div>
            </div>
        </div>
        <div class="button">
            <input type="button" value="申请迁移" >
        </div>
        <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
            <van-picker :columns="columns" @change="onChange"  @cancel="onCancelbtn" @confirm="onConfirmbtn" show-toolbar/>
        </van-popup>
    </div>


</template>


<script>
import member_grade_refunds_migration from "./member_grade_refunds_migration_controller";
export default member_grade_refunds_migration;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#member-grade {
  .box {
    padding-top: 0.875rem;
    background-color: #fff;

    ul {
      margin: 0 0.875rem;
      background: #efcb7b;
      border-radius: 0.375rem;
      padding: 1rem;
      text-align: left;

      li {
        font-size: 16px;
        line-height: 1.875rem;
      }

      font {
        font-weight: bold;
      }

      .time {
        margin-bottom: 0.625rem;
      }

      .balance {
        span {
          font-weight: bold;
        }
      }

      .formula {
        font-size: 14px;
        color: #fff;
        line-height: 1.5rem;
      }
    }

    .region {
      background-color: #fff;
      padding: 0.625rem 0.875rem;

      h1 {
        font-size: 14px;
        text-align: left;
        margin: 0.625rem 0;
      }

      .select {
        width: 80%;
        margin-bottom: 0.625rem;
        display: flex;
        border-radius: 0.25rem;
        text-align: left;

        option {
          padding: 0 0.375rem;
        }
      }

      .el-scrollbar li {
        text-align: left;
      }
    }
  }

  .button {
    margin-top: 2.5rem;

    input {
      width: 68%;
      height: 2.5rem;
      border-radius: 0.375rem;
      border: none;
      background-color: #f15353;
      color: #fff;
      font-weight: bold;
      font-size: 14px;
    }
  }
}

</style>


