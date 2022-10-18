<template>
	<div id="extension_goods">
		<c-title :hide="false" text="专区商品"></c-title>
		<goods :goods="goodList" :showprice="1"></goods>
	</div>
</template>
<script>
import controller from './extension_goods_controller';
export default controller;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>