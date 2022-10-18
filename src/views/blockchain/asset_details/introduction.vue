<template>
  <div id="introduction">
    <c-title :hide="false" :text="'简况'"></c-title>
    <div id="content">
        <div class="content_a">
            <ul class="company_info">
                <li><h1>{{industry_detail.asset_name}}</h1></li>
                <li><i class="iconfont icon-seller-home"></i>{{industry_detail.industry_name}}</li>
                <li><i class="iconfont icon-seller-position"></i>{{industry_detail.industry_address}}</li>
            </ul>
        </div>
        <div class="content_b">
            <h2>基本信息</h2>
            <ul class="list">
                <li>
                    <span>所属分类：</span>
                    <span>{{asset_detail.category_name}}</span>
                </li>
                <li>
                    <span>标签：</span>
                    <span>{{asset_detail.asset_label}}</span>
                </li>
                <!--<li>-->
                    <!--<span>公司名称：</span>-->
                    <!--<span>{{asset_list.name}}</span>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<span>注册地址：</span>-->
                    <!--<span>{{asset_list.registered_address}}</span>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<span>注册时间：</span>-->
                     <!--<span>{{asset_list.registered_at}}</span>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<span>企业类型：</span>-->
                    <!--<span>{{asset_list.industry_type}}</span>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<span>注册资本：</span>-->
                    <!--<span>{{asset_list.formation}}万元人民币</span>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<span>法定代表人：</span>-->
                    <!--<span>{{asset_list.representative}}</span>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<span>经营期限：</span>-->
                    <!--<span>{{asset_list.period_at}}&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;无固定期限</span>-->
                <!--</li>-->
                <!--<li>-->
                    <!--<span>经营范围：</span>-->
                    <!--<span>{{asset_list.scope}}</span>-->
                <!--</li>-->
            </ul>
        </div>
        <div class="content_c" v-if="asset_detail.asset_property && asset_detail.asset_property.length >0">
            <h2>{{lang.capital_name}}属性</h2>
            <ul class="list">
                <li v-for="(item,index) in asset_detail.asset_property" :key="index">
                    <span>{{item.title}}：</span>
                    <span>{{item.value}}</span>
                </li>
            </ul>
        </div>
        <div class="content_d" v-if="asset_detail.asset_content">
            <h3>{{lang.capital_name}}详情</h3>
            <div class="text" v-html="asset_detail.asset_content"></div>
        </div>
    </div>
  </div>
</template>

<script>
import introduction_controller from "./introduction_controller";

export default introduction_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#introduction {
  background: #fff;
  padding-bottom: 2.5rem;

  #content {
    .content_a {
      margin: 0.625rem;
      background: #f5f5f5;
      border-radius: 0.375rem;
      padding: 0.625rem;

      .company_info {
        li {
          text-align: left;
          color: #8c8c8c;
          font-size: 14px;
          display: flex;

          i {
            font-size: 1.5rem;
            color: #999;
            line-height: 1.25rem;
          }

          h1 {
            font-size: 16px;
            line-height: 2.25rem;
            color: #333;
          }
        }

        li:last-child {
          line-height: 1.25rem;
        }
      }
    }

    .content_b,
    .content_c {
      margin-top: 0.625rem;

      h2 {
        font-size: 16px;
        line-height: 1.875rem;
        text-align: left;
        padding: 0 0.625rem;
      }

      .list {
        margin-top: 0.625rem;
        padding: 0 0.875rem;

        li {
          display: flex;
          font-size: 14px;
          text-align: left;
          line-height: 1.625rem;

          span:first-child {
            width: 6.25rem;
            color: #8c8c8c;
            display: block;
          }

          span:last-child {
            width: 15.4375rem;
          }
        }
      }
    }

    .content_d {
      margin-top: 0.625rem;
      text-align: left;

      h3 {
        font-size: 16px;
        line-height: 1.875rem;
        padding: 0 0.625rem;
      }

      .text {
        margin: 0.625rem 0.875rem;
        border: solid 0.0625rem #ebebeb;
        padding: 0.625rem;
      }
    }
  }
}
</style>