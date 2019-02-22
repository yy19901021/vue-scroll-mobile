import vueBetterScroll from './src/index.vue';

vueBetterScroll.install =  function (Vue) {
  Vue.component(vueBetterScroll.name, vueBetterScroll);
};

export default vueBetterScroll;