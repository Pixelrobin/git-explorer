<template>
	<div>
		<code-window-tabs ref = "code-window-tabs"></code-window-tabs>
		<div class = "code-window">
			<code-window-view :code = "code.text"></code-window-view>
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import CodeWindowTabs from "./CodeWindowTabs";
import test from "./CodeWindowTabs";
import CodeWindowView from "./CodeWindowView";
import { EventBus } from "../modules/EventBus";
import gg from "../modules/github-getter";

console.log( CodeWindowTabs );

var openFiles = {
};

var data = {
	selectedPath: ""
}

var tabs = [];

var code = {
	text: ""
}

export default {
	name: "code-window",

	data: function() {
		var text;

		if ( data.selectedPath !== "" ) {
			text = openFiles[ data.selectedPath ];
		} else text = "";

		return{
			code: code,
			data: data
		}
	},

	components: {
		CodeWindowTabs,
		CodeWindowView
	},

	created() {
		EventBus.$on('open-file', ( path, name ) => {
			var insertInto = openFiles.length;

			Vue.set( openFiles, path, {
				name: name,
				path: path
			});

			gg.fakegetraw( path, ( res, err ) => {
				Vue.set( openFiles[ path ], "text", res )
			});

			Vue.set( tabs, tabs.length, {
				name: name,
				path: path
			});

			this.$bus.emit( "create-tab", name, path );
		});

		/*EventBus.$on( "select-tab", ( path ) => {
			Vue.set( data, "selectedPath", path );
			Vue.set( code, "text", openFiles[ path ].text );
		})*/
	}
}
</script>