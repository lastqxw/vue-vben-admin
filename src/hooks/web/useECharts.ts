import { useTimeout } from '/@/hooks/core/useTimeout';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { unref, Ref, nextTick } from 'vue';
import type { EChartOption, ECharts } from 'echarts';
import echarts from 'echarts';
import { useDebounce } from '/@/hooks/core/useDebounce';
import { useEvent } from '/@/hooks/event/useEvent';
import { useBreakpoint } from '/@/hooks/event/useBreakpoint';

export type { EChartOption, ECharts };
export function useECharts(
  elRef: Ref<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'light'
) {
  let chartInstance: Nullable<ECharts> = null;
  let resizeFn: Fn = resize;
  let removeResizeFn: Fn = () => {};

  const [debounceResize] = useDebounce(resize, 200);
  resizeFn = debounceResize;

  function init() {
    const el = unref(elRef);

    if (!el || !unref(el)) {
      return;
    }
    chartInstance = echarts.init(el, theme);
    const { removeEvent } = useEvent({
      el: window,
      name: 'resize',
      listener: resizeFn,
    });
    removeResizeFn = removeEvent;
    const { widthRef, screenEnum } = useBreakpoint();
    if (unref(widthRef) <= screenEnum.MD) {
      useTimeout(() => {
        resizeFn();
      }, 30);
    }
  }

  function setOptions(options: any, clear = true) {
    nextTick(() => {
      useTimeout(() => {
        if (!chartInstance) {
          init();

          if (!chartInstance) return;
        }
        clear && chartInstance.clear();

        chartInstance && chartInstance.setOption(options);
      }, 30);
    });
  }

  function resize() {
    if (!chartInstance) return;
    chartInstance.resize();
  }

  tryOnUnmounted(() => {
    if (!chartInstance) return;
    removeResizeFn();
    chartInstance.dispose();
    chartInstance = null;
  });

  return {
    setOptions,
    echarts,
    resize,
  };
}
