if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(callback()).then(() => value), (reason) => promise.resolve(callback()).then(() => {
      throw reason;
    }));
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue, shared) {
  "use strict";
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$3 = {
    name: "uniLink",
    props: {
      href: {
        type: String,
        default: ""
      },
      text: {
        type: String,
        default: ""
      },
      download: {
        type: String,
        default: ""
      },
      showUnderLine: {
        type: [Boolean, String],
        default: true
      },
      copyTips: {
        type: String,
        default: "\u5DF2\u81EA\u52A8\u590D\u5236\u7F51\u5740\uFF0C\u8BF7\u5728\u624B\u673A\u6D4F\u89C8\u5668\u91CC\u7C98\u8D34\u8BE5\u7F51\u5740"
      },
      color: {
        type: String,
        default: "#999999"
      },
      fontSize: {
        type: [Number, String],
        default: 14
      }
    },
    computed: {
      isShowA() {
        if ((this.isMail() || this.isTel()) && this._isH5 === true) {
          return true;
        }
        return false;
      }
    },
    created() {
      this._isH5 = null;
    },
    methods: {
      isMail() {
        return this.href.startsWith("mailto:");
      },
      isTel() {
        return this.href.startsWith("tel:");
      },
      openURL() {
        if (this.isTel()) {
          this.makePhoneCall(this.href.replace("tel:", ""));
        } else {
          plus.runtime.openURL(this.href);
        }
      },
      makePhoneCall(phoneNumber) {
        uni.makePhoneCall({
          phoneNumber
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return $options.isShowA ? (vue.openBlock(), vue.createElementBlock("a", {
      key: 0,
      class: vue.normalizeClass(["uni-link", { "uni-link--withline": $props.showUnderLine === true || $props.showUnderLine === "true" }]),
      href: $props.href,
      style: vue.normalizeStyle({ color: $props.color, fontSize: $props.fontSize + "px" }),
      download: $props.download
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, () => [
        vue.createTextVNode(vue.toDisplayString($props.text), 1)
      ], true)
    ], 14, ["href", "download"])) : (vue.openBlock(), vue.createElementBlock("text", {
      key: 1,
      class: vue.normalizeClass(["uni-link", { "uni-link--withline": $props.showUnderLine === true || $props.showUnderLine === "true" }]),
      style: vue.normalizeStyle({ color: $props.color, fontSize: $props.fontSize + "px" }),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.openURL && $options.openURL(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, () => [
        vue.createTextVNode(vue.toDisplayString($props.text), 1)
      ], true)
    ], 6));
  }
  var __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render], ["__scopeId", "data-v-6c93f7f9"], ["__file", "D:/working/mny-turn-page-demo/uni_modules/uni-link/components/uni-link/uni-link.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return shared.isString(component) ? easycom : component;
  }
  const _sfc_main$2 = {
    __name: "mny-turn-page",
    props: {
      width: {
        type: Number || String,
        required: true
      },
      height: {
        type: Number || String,
        required: true
      },
      resource: {
        type: Array,
        default: () => []
      },
      srcKey: {
        type: String,
        default: "src"
      },
      recyle: {
        type: Boolean,
        default: false
      },
      duration: {
        type: Number,
        default: 1e3
      }
    },
    setup(__props) {
      const props = __props;
      const ANIMATION_DURATION = 800;
      const state = vue.reactive({
        zIndex: [],
        animation: [],
        currentIndex: 0,
        startY: 0,
        endY: 0,
        turnNext: vue.computed(() => state.startY - state.endY > 30),
        turnPrev: vue.computed(() => state.endY - state.startY > 30),
        turning: false,
        computedStyle: vue.computed(() => {
          const w = parseInt(props.width) || 0;
          const h = parseInt(props.height) || 0;
          return {
            width: `${w}rpx`,
            height: `${h}rpx`
          };
        }),
        total: vue.computed(() => props.resource.length),
        cDuration: vue.computed(() => props.duration || ANIMATION_DURATION)
      });
      const animation = uni.createAnimation({
        delay: 0,
        duration: state.cDuration,
        timingFunction: "ease",
        transformOrigin: "0 0 0"
      });
      state.zIndex = props.resource.map((n, i) => i * -1);
      state.animation = new Array(state.total).fill(null);
      const onImageError = (e) => {
        formatAppLog("error", "at uni_modules/mny-turn-page/components/mny-turn-page/mny-turn-page.vue:109", e);
      };
      const validRange = (max, i) => {
        return props.recyle || i >= 0 && i < max;
      };
      const changeLayer = (i, total) => {
        state.zIndex[i] = state.zIndex[i] + total;
        formatAppLog("log", "at uni_modules/mny-turn-page/components/mny-turn-page/mny-turn-page.vue:124", "changeLayer currentIndex", i, state.zIndex[i]);
      };
      const generateCursor = (i, d, max) => {
        const c = i + d;
        if (c === max)
          return 0;
        if (c < 0)
          return max - 1;
        return c;
      };
      const onTouchStart = (e) => {
        state.startY = e.changedTouches[0].clientY;
      };
      const onTouchEnd = async (e) => {
        if (state.turning)
          return;
        state.endY = e.changedTouches[0].clientY;
        if (state.turnNext) {
          if (!validRange(state.total, state.currentIndex + 1))
            return;
          formatAppLog("log", "at uni_modules/mny-turn-page/components/mny-turn-page/mny-turn-page.vue:155", "turnNext");
          state.turning = true;
          animation.rotateY(-5).step({ duration: 1 });
          animation.rotateX(180).step();
          animation.opacity(0.05).rotateX(270).step();
          state.animation[state.currentIndex] = animation.export();
          setTimeout(async () => {
            changeLayer(state.currentIndex, state.total * -1);
            animation.opacity(1).rotateY(0).rotateX(0).step({ duration: 1 });
            state.animation[state.currentIndex] = animation.export();
            await vue.nextTick();
            state.animation[state.currentIndex] = null;
            formatAppLog("log", "at uni_modules/mny-turn-page/components/mny-turn-page/mny-turn-page.vue:171", "state.zIndex", state.zIndex, state.animation);
            const newIndex = generateCursor(state.currentIndex, 1, state.total);
            state.currentIndex = newIndex;
            formatAppLog("log", "at uni_modules/mny-turn-page/components/mny-turn-page/mny-turn-page.vue:176", "\u8BB0\u5F55\u65B0\u7684\u5F53\u524D\u9875index", state.currentIndex);
            state.turning = false;
          }, state.cDuration * 2);
        } else if (state.turnPrev) {
          if (!validRange(state.total, state.currentIndex - 1))
            return;
          formatAppLog("log", "at uni_modules/mny-turn-page/components/mny-turn-page/mny-turn-page.vue:181", "turnPrev");
          state.turning = true;
          const newIndex = generateCursor(state.currentIndex, -1, state.total);
          state.currentIndex = newIndex;
          formatAppLog("log", "at uni_modules/mny-turn-page/components/mny-turn-page/mny-turn-page.vue:188", "\u8BB0\u5F55\u65B0\u7684\u5F53\u524D\u9875index", state.currentIndex);
          animation.rotateX(270).rotateY(0).opacity(0.1).step({
            duration: 1
          });
          animation.opacity(1).rotateX(180).rotateY(-5).step({ duration: state.cDuration });
          animation.rotateX(180).step({ duration: state.cDuration });
          animation.opacity(1).rotateX(-5).rotateY(0).step({ duration: state.cDuration });
          state.animation[state.currentIndex] = animation.export();
          changeLayer(state.currentIndex, state.total);
          setTimeout(() => {
            state.animation[state.currentIndex] = null;
            state.turning = false;
          }, state.cDuration * 2);
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("view", { class: "uni-turn-page" }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.resource, (item, i) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.img,
              style: vue.normalizeStyle({ zIndex: state.zIndex[i] }),
              animation: state.animation[i],
              onTouchstart: onTouchStart,
              onTouchend: onTouchEnd,
              class: "image-container"
            }, [
              vue.renderSlot(_ctx.$slots, "default", { item }, () => [
                vue.createElementVNode("image", {
                  "lazy-load": "true",
                  onError: ($event) => onImageError(item),
                  src: item[__props.srcKey],
                  class: "image-item",
                  style: vue.normalizeStyle(state.computedStyle)
                }, null, 44, ["onError", "src"])
              ], true)
            ], 44, ["animation"]);
          }), 128))
        ]);
      };
    }
  };
  var __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-a5c21794"], ["__file", "D:/working/mny-turn-page-demo/uni_modules/mny-turn-page/components/mny-turn-page/mny-turn-page.vue"]]);
  const _sfc_main$1 = {
    __name: "index",
    setup(__props) {
      const state = vue.reactive({
        list: [
          {
            img: "https://cdn.pixabay.com/photo/2022/05/21/09/30/cat-7211080_960_720.jpg"
          },
          {
            img: "https://cdn.pixabay.com/photo/2014/04/13/20/49/cat-323262_960_720.jpg"
          },
          {
            img: "https://cdn.pixabay.com/photo/2015/04/23/21/59/tree-736877_960_720.jpg"
          },
          {
            img: "https://cdn.pixabay.com/photo/2022/01/24/21/22/snail-6964793_960_720.jpg"
          },
          {
            img: "https://cdn.pixabay.com/photo/2019/06/16/11/02/turtle-4277518_960_720.jpg"
          }
        ]
      });
      return (_ctx, _cache) => {
        const _component_uni_link = resolveEasycom(vue.resolveDynamicComponent("uni-link"), __easycom_0);
        const _component_mny_turn_page = resolveEasycom(vue.resolveDynamicComponent("mny-turn-page"), __easycom_1);
        return vue.openBlock(), vue.createElementBlock("view", { class: "mny-turn-page__demo" }, [
          vue.createElementVNode("view", { class: "text-xl uni-pa-6" }, [
            vue.createElementVNode("label", { for: "" }, "\u793A\u4F8B\u56FE\u7247\u6765\u6E90\uFF1A"),
            vue.createVNode(_component_uni_link, { href: "https://pixabay.com/" }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("https://pixabay.com/")
              ]),
              _: 1
            })
          ]),
          vue.createElementVNode("view", { class: "image-container" }, [
            vue.createElementVNode("image", {
              "lazy-load": "true",
              onError: _cache[0] || (_cache[0] = ($event) => _ctx.onImageError(_ctx.item)),
              src: "/static/calendar.png",
              class: "image-bg",
              style: { "width": "700rpx", "height": "400rpx", "background-color": "#eeeeee" }
            }, null, 32),
            vue.createVNode(_component_mny_turn_page, {
              width: 440,
              height: 220,
              resource: state.list,
              recyle: true,
              duration: 400,
              "src-key": "img",
              class: "tp-images"
            }, null, 8, ["resource"])
          ])
        ]);
      };
    }
  };
  var PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-57280228"], ["__file", "D:/working/mny-turn-page-demo/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("warn", "at App.vue:4", "\u5F53\u524D\u7EC4\u4EF6\u4EC5\u652F\u6301 uni_modules \u76EE\u5F55\u7ED3\u6784 \uFF0C\u8BF7\u5347\u7EA7 HBuilderX \u5230 3.1.0 \u7248\u672C\u4EE5\u4E0A\uFF01");
      formatAppLog("log", "at App.vue:5", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:8", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:11", "App Hide");
    }
  };
  var App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/working/mny-turn-page-demo/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue, uni.VueShared);
