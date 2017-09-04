<template>
	<ul>
		<item :model = "treeData"></item>
	</ul>
</template>

<script>
import TreeViewItem from "./TreeViewItem";
import gg from "../modules/github-getter";

/*var data = {
  name: 'My Tree',
  children: [
	{ name: 'hello' },
	{ name: 'wat' },
	{
	  name: 'child folder',
	  children: [
		{
		  name: 'child folder',
		  children: [
			{ name: 'hello' },
			{ name: 'wat' }
		  ]
		},
		{ name: 'hello' },
		{ name: 'wat' },
		{
		  name: 'child folder',
		  children: [
			{ name: 'hello' },
			{ name: 'wat' }
		  ]
		}
	  ]
	}
  ]
}*/

var data = {
	name: "test"
};

setTimeout( () => { data.name = "Hello World!" }, 1000 )

export default {
	name: "tree-view",
	
	components: {
		"item": TreeViewItem
	},

	data: () => {
		return {
			treeData: data
		}
	}
}
</script>