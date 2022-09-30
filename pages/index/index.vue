
<template>
  <view class="mny-turn-page__demo">
    <view class="text-xl uni-pa-6">
      <label for="">示例图片来源：</label>
      <uni-link href="https://pixabay.com/">https://pixabay.com/</uni-link>
    </view>
    <view class="image-container">
      <image
        lazy-load="true"
        @error="onImageError(item)"
        src="/static/calendar.png"
        class="image-bg"
        style="width: 700rpx; height: 400rpx; background-color: #eeeeee"
      />
      <mny-turn-page
        :width="440"
        :height="220"
        :resource="state.list"
        :recyle="true"
        :duration="400"
        src-key="img"
        class="tp-images"
      ></mny-turn-page>
    </view>
  </view>
</template>

<script setup>
import { reactive } from "vue";

const state = reactive({
  list: [
    {
      img: "https://cdn.pixabay.com/photo/2022/05/21/09/30/cat-7211080_960_720.jpg",
    },
    {
      img: "https://cdn.pixabay.com/photo/2014/04/13/20/49/cat-323262_960_720.jpg",
    },
    {
      img: "https://cdn.pixabay.com/photo/2015/04/23/21/59/tree-736877_960_720.jpg",
    },
    {
      img: "https://cdn.pixabay.com/photo/2022/01/24/21/22/snail-6964793_960_720.jpg",
    },
    {
      img: "https://cdn.pixabay.com/photo/2019/06/16/11/02/turtle-4277518_960_720.jpg",
    },
  ],
});
</script>

<style lang="scss" scoped>
.mny-turn-page__demo {
  .image-container {
    position: absolute;
    top: 400rpx;
    left: 20rpx;
  }

  .image-bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -9999;
    /* display: none; */
  }
  .tp-images {
    position: absolute;
    left: 120rpx;
    top: 40rpx;
  }
}
</style>