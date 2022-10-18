<style lang="scss" rel="stylesheet/scss" scoped>

#share {
  /* .top {
        text-align: left;
        height: 95px;
        padding: 15px;
        background: #fff;
        position: relative;
        text-align: center;
        margin: 15px 0;
        i {

            font-style: normal;
            font-size: 16px;
            display: block;
        }
        .content {

            width: 120px;
            margin: 0 auto;
            font-size: 16px;
            text-align: center;
            span {
                font-size: 28px;
                color: green;
                display: inline-block;
                padding-top: 12px;
                margin-bottom: 5px;
            }
            b {
                line-height: 24px;
                font-weight: normal;
                color: #fff;
                background: #f15353;
                width: 60px;
                height: 24px;
                display: inline-block;
            }
        }
    } */
  .middle,
  .bott {
    text-align: left;
    padding: 0.9375rem 0.75rem;
    line-height: 1.875rem;
    color: #333;
    background: #fff;
    margin-bottom: 0.5rem;
    font-size: 14px;
  }

  .middle {
    display: flex;
    flex-wrap: wrap;

    .lrest {
      flex: 50%;
      color: #8c8c8c;
    }

    .resot {
      flex: 50%;
      text-align: right;
    }
  }
}
</style>
<template>
    <div id="share">
        <div>
    
            <c-title :hide="false" text='供应商详情'></c-title>
    
            <div class="middle">
                <template v-for=" (item,i) in module1" >
                    <div class="lrest" :key="i">{{item.name}}</div>
                    <div class="resot" :key="i">{{item.value}}</div>
                </template>
            </div>
    
        </div>
    </div>
</template>


<script>
import enterprise_supplier_info_controller from './enterprise_supplier_info_controller';
export default enterprise_supplier_info_controller;
</script>