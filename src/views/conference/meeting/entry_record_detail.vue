<template>
	<div id="all">
		<c-title :hide="false" text='活动报名信息'></c-title>
		<div id="content">
			<ul class="detail">
				<li v-for="(item,i) in list" :key='i'>
					<span>{{item.name}}</span>
					<span v-if="item.is_image==0">{{item.value}}</span>
					<span class="user" v-if="item.is_image==1"><img :src="item.value?item.value:require('../../../assets/images/photo-mr.jpg')"></span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import controller from './entry_record_detail_controller';
export default controller;

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#all {
  #content {
    background: #fff;

    .detail {
      padding: 0.625rem 0;

      li {
        display: flex;
        justify-content: space-between;
        height: 1.875rem;
        line-height: 1.875rem;
        align-items: center;
        padding: 0 0.875rem;
        font-size: 14px;

        .user {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 1rem;
          overflow: hidden;

          img {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
