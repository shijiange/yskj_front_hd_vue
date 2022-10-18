<template>
	<div id="all">
		<c-title :hide="false" text='推广报名信息'></c-title>
		<div id="content">
			<ul class="detail">
				<li>
					<span>店名</span>
					<span>一点点</span>
				</li>
				<li>
					<span>姓名</span>
					<span>开心麻花</span>
				</li>
				<li>
					<span>手机号</span>
					<span>15236025049</span>
				</li>
				<li>
					<span>头像</span>
					<span class="user"><img src="../../../assets/images/photo-mr.jpg"></span>
				</li>
				<li>
					<span>城市</span>
					<span>北京市&nbsp;&nbsp;&nbsp;城东区</span>
				</li>
			</ul>
		</div>

		
	</div>
</template>

<script>
import controller from './extend_enroll_detail_controller';
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
