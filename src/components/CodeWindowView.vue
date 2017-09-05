<template>
		<pre>
			<code>{{code}}</code>
		</pre>
</template>

<script>
export default {
	name: "code-window-view",

	props: {
		code: String
	}
}
</script>