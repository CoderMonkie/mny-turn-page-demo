<!--
 * @Description: 翻页动画效果组件
 * @Autor: <maonianyou@foxmail.com>
 * @Date: 2022-09-30 01:06:18
 * @LastEditors: Archmage | 大法师 <maonianyou@pay.media>
-->
<template>
  <view class="uni-turn-page">
    <view
      :ref="collectRefs"
      v-for="(item, i) in resource"
      :key="i"
      :style="{
        zIndex: state.zIndex[i],
      }"
      :animation="state.animation[i]"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      class="image-container"
    >
      <slot :item="item">
        <image
          lazy-load="true"
          @error="onImageError(item)"
          :src="item[srcKey]"
          class="image-item"
          :style="state.computedStyle"
        />
      </slot>
    </view>
  </view>
</template>

<script setup>
import { reactive, computed, nextTick, watch } from "vue";
import { isPC } from "./utils.js";

/** 默认动画时长 */
const ANIMATION_DURATION = 800;

const emit = defineEmits(["change"]);
const props = defineProps({
  /** 宽 */
  width: {
    type: Number || String,
    required: true,
  },
  /** 高 */
  height: {
    type: Number || String,
    required: true,
  },
  /**
   * 资源
   * 格式为对象数组，含图片地址属性
   * 可指定属性名{@see srcKey}
   */
  resource: {
    type: Array,
    default: () => [],
  },
  /** 图片地址的属性名 */
  srcKey: {
    type: String,
    default: "src",
  },
  /** 是否可循环 */
  recyle: {
    type: Boolean,
    default: false,
  },
  /** 动画时长 */
  duration: {
    type: Number,
    default: 1000,
  },
});

const state = reactive({
  zIndex: [],
  animation: [],
  currentIndex: 0,
  // 计算翻页方向
  startY: 0,
  endY: 0,
  turnNext: computed(() => state.startY - state.endY > 30),
  turnPrev: computed(() => state.endY - state.startY > 30),
  turning: false,
  //
  computedStyle: computed(() => {
    //
    const w = parseInt(props.width) || 0;
    const h = parseInt(props.height) || 0;

    return {
      width: `${w}rpx`,
      height: `${h}rpx`,
    };
  }),
  total: computed(() => props.resource.length),
  cDuration: computed(() => props.duration || ANIMATION_DURATION),
});

state.zIndex = props.resource.map((n, i) => i * -1);
const animation = uni.createAnimation({
  delay: 0,
  duration: state.cDuration,
  timingFunction: "ease",
  transformOrigin: "0 0 0",
});
const hide = animation.opacity(0).step({ duration: 1 }).export();
state.animation = new Array(state.total).fill(hide);
state.animation[0] = null;

const onImageError = (e) => {
  console.error(e);
};

/**
 * 检查翻页的有效范围
 */
const validRange = (max, i) => {
  return props.recyle || (i >= 0 && i < max);
};

/**
 * 切换当前显示层
 */
const changeLayer = (i, total) => {
  state.zIndex[i] = state.zIndex[i] + total;
  console.log("changeLayer currentIndex", i, state.zIndex[i]);
};

const generateCursor = (i, d, max) => {
  const c = i + d;
  /**
   * 0 1 = 1
   * 1 1 = 2
   * 2 1 = 3(max) -> 0
   * --------
   * 0 -1 = -1 -> 2(max-1)
   * 1 -1 = 0
   * 2 -1 = 1
   */
  if (!props.recyle) return c;
  if (c === max) return 0;
  if (c < 0) return max - 1;
  return c;
};

watch(
  () => state.turning,
  (value) => {
    if (!value) {
      // on finish animation
      emit("change", props.resource[state.currentIndex], state.currentIndex);
    }
  }
);

const collectRefs = (vNode) => {
  if (!vNode || !isPC()) return;
  // console.log("collectRefs", vNode.$el);
  const el = vNode.$el;
  if (!el) return;

  function wrap(cb) {
    return function (e) {
      const { clientX, clientY } = e;
      const wrapper = {
        touches: [{ clientX, clientY }],
        changedTouches: [{ clientX, clientY }],
      };
      cb(wrapper);
    };
  }

  el.addEventListener("mousedown", wrap(onTouchStart));
  el.addEventListener("mouseup", wrap(onTouchEnd));
};

const onTouchStart = (e) => {
  console.log("onTouchStart", e);
  state.startY = e.changedTouches[0].clientY;
};

const onTouchEnd = async (e) => {
  console.log("onTouchEnd", e);
  if (state.turning) return;
  state.endY = e.changedTouches[0].clientY;

  if (state.turnNext) {
    const newIndex = generateCursor(state.currentIndex, 1, state.total);
    if (!validRange(state.total, newIndex)) return;
    console.log("turnNext");

    // 因翻页后避免会翻时闪一下，就让翻过去的变透明了
    // 如果翻完一圈，回到第一张，需要把它显示出来，
    // 依此类推，每次翻下一页前，都应该提前准备好先让它显示出来
    animation.opacity(1).step({ duration: 1 });
    state.animation[newIndex] = animation.export();

    // 下一页
    state.turning = true;
    //
    animation.opacity(1).rotateX(180).step();
    animation.opacity(0.05).rotateX(270).step();
    state.animation[state.currentIndex] = animation.export();

    // 动画结束后
    setTimeout(async () => {
      changeLayer(state.currentIndex, state.total * -1);
      animation.opacity(0).rotateX(0).step({ duration: 1 });
      state.animation[state.currentIndex] = animation.export();
      await nextTick();

      // 记录新的当前页index
      state.currentIndex = newIndex;
      console.log("记录新的当前页index", state.currentIndex);
      console.log("state.zIndex", state.zIndex, state.animation);
      // 结束本次翻页
      state.turning = false;
    }, state.cDuration * 2);
  } else if (state.turnPrev) {
    const newIndex = generateCursor(state.currentIndex, -1, state.total);
    if (!validRange(state.total, newIndex)) return;
    console.log("turnPrev");

    // 为淡入效果设置初始位置
    animation.rotateX(270).opacity(0.05).step({
      /** 注：这里duration不能是0，否则第二条动画不能执行 */ duration: 1,
    });
    state.animation[newIndex] = animation.export();

    // 上一页
    state.turning = true;
    //
    // 第一段动画：半透明出现在后上方，此时，当前页未切换
    animation.opacity(0.2).rotateX(180).step({ duration: state.cDuration });
    // animation.rotateX(-180).step({ duration: state.cDuration });
    state.animation[newIndex] = animation.export();
    await nextTick();

    // 记录新的当前页index
    state.currentIndex = newIndex;
    console.log("记录新的当前页index", state.currentIndex);
    // 切换当前页
    changeLayer(state.currentIndex, state.total);

    // 切换当前页后进行二段动画：恢复正常位置，覆盖掉原当前页
    setTimeout(() => {
      animation.opacity(1).rotateX(0).step({ duration: state.cDuration });
      // animation.rotateX(0).step({ duration: 1 }); // 恢复
      state.animation[newIndex] = animation.export();
    }, state.cDuration);

    setTimeout(() => {
      // 上一页翻完后把上上页修改为透明
      const newPrevIndex = generateCursor(state.currentIndex, -1, state.total);
      state.animation[newPrevIndex] = animation
        .opacity(0)
        .step({ duration: 1 })
        .export();
      console.log("state.zIndex", state.zIndex, state.animation);
      // 结束本次翻页
      state.turning = false;
    }, state.cDuration * 2);
  }
};
</script>

<style lang="scss" scoped>
.uni-turn-page {
  // transform: skew(-5deg, 2deg);
  .image-container {
    position: absolute;
    top: 0;
    left: 0;

    .image-item {
      // TODO for beautify
    }
  }
}
</style>
