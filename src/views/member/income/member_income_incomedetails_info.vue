<template>
    <div id="commission">
        <c-title :hide="false" :text='`${income_name_text}详情`'></c-title>
        <div class="atitem" v-if="info">
            <div class="title">{{info.title}}</div>
            <div style="height: 0.625rem;"></div>
            <div class="tbs" v-for="(item,i) in info.data" :key='i' v-show="info">
                <div class="item1">{{item.title}}</div>
                <div class="item2">{{item.value}}</div>
            </div>
        </div>
    
        <div class="atitem" v-if="order">
            <div class="title">{{order.title}}</div>
            <div style="height: 0.625rem;"></div>
            <div class="tbs" v-for="(item,i) in order.data" :key='i'>
                <div class="item1">{{item.title}}</div>
                <div class="item2">{{item.value}}</div>
            </div>
    
        </div>
        <div class="atitem" v-if="goods">
            <div class="title">{{goods.title|escapeTitle}}</div>
            <div class="tbs goods-info" v-for="(item,k) in goods.data" :key='k'>
                    <div class="goods" v-for="(g,i) in item" :key='i'>
                        <div class="item1">{{g.title}}</div>
                        <div class="item2">{{g.value}}</div>
                    </div>
            </div>
        </div>
    </div>
</template>
<script>
import member_income_incomedetails_info_controller from './member_income_incomedetails_info_controller';
export default member_income_incomedetails_info_controller;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#commission {
  .times {
    text-align: left;
    text-indent: 10px;
    line-height: 2rem;
    border-bottom: #d9d9d9 solid 0.0625rem;
    font-weight: bold;
    font-size: 1rem;

    font {
      color: #008000;
      padding-left: 0.8125rem;
    }
  }

  .atitem {
    background: #fff;
    padding-bottom: 0.625rem;

    .title {
      background: #f5f5f5;
      line-height: 1.875rem;
      font-size: 14px;
      padding: 0 0.75rem;
      text-align: left;
    }

    .tbs.goods-info {
      padding-top: 0.625rem;
    }
  }

  /* .goods{display: flex;align-items:center;flex-wrap:wrap;background:#fff;border-top:1px solid #f1f1f1;
		b{flex: 2; img{width: 50%;margin:10px 0  ;}} */
  font {
    flex: 5;
    text-align: left;
    margin: 0.625rem;
  }

  span {
    flex: 1;
    text-align: right;
    margin-right: 0.625rem;
  }
}

.tbs {
  background: #fff;
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 0.875rem;
  line-height: 1.875rem;

  .item1 {
    color: #8c8c8c;
    flex: 35%;
    text-align: left;
    box-sizing: border-box;
  }

  .item2 {
    flex: 65%;
    color: #333;
    text-align: right;

    .reg {
      color: #259b24;
    }
  }

  .goods {
    background: #fff;
    overflow: hidden;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    line-height: 1.875rem;
    width: 100%;

    .item1 {
      color: #888;
      flex: 35%;
      text-align: left;
      box-sizing: border-box;
    }

    .item2 {
      flex: 65%;
      color: #000;
      text-align: right;

      .reg {
        color: #259b24;
      }
    }
  }
}
</style>
