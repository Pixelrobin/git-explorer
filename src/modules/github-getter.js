const gg = {
	get: ( path, cb ) => {
		var request = new XMLHttpRequest();

		request.onreadystatechange = function() {
			if ( this.readyState === 4 ) {
				if ( this.status === 200 ) {
					cb( JSON.parse( this.responseText ), null );
				} else {
					cb( null, 200 );
				}
			}
		}

		request.open( "GET", "https://api.github.com/repos/pixelrobin/fec-database/contents/" );
		request.send();
	}
}

export default gg;