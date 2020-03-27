// based on https://analytics.google.com/analytics/web/#/a243284w194695237p190093932/admin/tracking/tracking-code/

function loadSdkAsynchronously() {
	

	setTimeout(() => {
		((d, s, id) => {
			const element = d.getElementsByTagName(s)[0];
			const fjs = element;
			let js = element;
			if (d.getElementById(id)) { return; }
			js = d.createElement(s); js.id = id;
			js.src = `https://www.googletagmanager.com/gtag/js?id=UA-243284-45`;
			fjs.parentNode.insertBefore(js, fjs);
		})(document, 'script', 'google-analytics');
	}, 1);


	window.dataLayer = window.dataLayer || [];
	function gtag(){
		window.dataLayer.push(arguments);
	}
	gtag('js', new Date());

	gtag('config', 'UA-243284-45', { 'app_name': 'PPECalc' });

	return gtag;

	// TODO	
	// gtag('set', {'user_id': 'USER_ID'}); // Set the user ID using signed-in user_id.
}

const gtag = loadSdkAsynchronously();

export default gtag;