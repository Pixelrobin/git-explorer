// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { AsyncDataPlugin } from 'vue-async-data-2';
import VueBus from "vue-bus";

Vue.use( AsyncDataPlugin );
Vue.use( VueBus );
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	template: '<App/>',
	components: { App }
})