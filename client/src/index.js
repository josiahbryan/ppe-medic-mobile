import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

(function sayHello() {
	const runningVer = process.env.REACT_APP_GIT_REV;
	if (!!window.chrome) {
		var args = [
			'\n%c %c %c === PPE for CHWs Calculator ' + runningVer + " ===  %c  %c  Made with love by Josiah Bryan <josiahbryan@gmail.com> https://ppe-medic-mobile.netlify.com/  %c %c \u2665%c\u2665%c\u2665 \n\n", 
			'background: #c0454c; padding:5px 0;', 
			'background: #c0454c; padding:5px 0;', 
			'color: #fff; background: #90335a; padding:5px 0;', 
			'color: #fff; background: #c0454c; padding:5px 0;', 
			'color: #fff; background: #4b235d; padding:5px 0;', 
			'color: #fff; background: #4b235d; padding:5px 0;', 
			'color: #4b235d; background: #fff; padding:5px 0;', 
			'color: #29235C; background: #fff; padding:5px 0;', 
			'color: #c0454c; background: #fff; padding:5px 0;'
		];
		window.console.log.apply(console, args);
	} else if (window.console) {
		window.console.log('=== PPE for CHWs Calculator ' + runningVer + ' ===  Made with love by Josiah Bryan <josiahbryan@gmail.com>');
	}
})();

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
