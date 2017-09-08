<template>
<div>
	<code-window-tabs :tabs = "tabs" :selected = "data.selectedPath" ></code-window-tabs>
	<div class = "code-window">
		<code-window-view :code = "code.text"></code-window-view>
	</div>
	</div>
</template>

<script>
import Vue from "vue";
import CodeWindowTabs from "./CodeWindowTabs";
import CodeWindowView from "./CodeWindowView";
import { EventBus } from "../modules/EventBus";
import gg from "../modules/github-getter";

var openFiles = {
};

var data = {
	selectedPath: ""
}

var tabs = [];

var code = {
	text: ""
}

EventBus.$on('open-file', ( path, name ) => {
	console.log(`Open File ${path}`)
	var insertInto = openFiles.length;

	Vue.set( openFiles, path, {
		name: name,
		path: path
	});

	gg.fakegetraw( path, ( res, err ) => {
		Vue.set( openFiles[ path ], "text", res )
	});

	console.log( openFiles );

	Vue.set( tabs, tabs.length, {
		name: name,
		path: path
	});

	if ( data.selectedPath === "" ) {
		console.log( "reset selected path" );
		Vue.set( data, "selectedPath", path );
	}

	console.log( path, name, data.selectedPath );
});

EventBus.$on( "select-tab", ( path ) => {
	Vue.set( data, "selectedPath", path );
	Vue.set( code, "text", openFiles[ path ].text );
})

export default {
	name: "code-window",

	data: function() {
		var text;

		if ( data.selectedPath !== "" ) {
			text = openFiles[ data.selectedPath ];
		} else text = "";

		return{
			code: code,
			tabs: tabs,
			data: data
		}
	},

	components: {
		CodeWindowTabs,
		CodeWindowView
	}
}
</script>