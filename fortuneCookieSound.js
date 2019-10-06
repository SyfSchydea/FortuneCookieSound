// ==UserScript==
// @name         Fortune Cookie sound
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Play a sound when a fortune cookie appears
// @author       /u/SyfSchydea
// @match        http://orteil.dashnet.org/cookieclicker/
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        none
// ==/UserScript==

(function() {
	// Sound to be played upon a fortune appearing
	window.fortuneCookieNotificationSound = "https://freesound.org/data/previews/22/22267_124239-lq.mp3";

	// Injects code into a method call
	function injectInto(obj, key, callbackBefore, callbackAfter) {
		let originalFunction = obj[key];
		
		obj[key] = function(...args) {
			callbackBefore.apply(this, args);
			let returnValue = originalFunction.apply(this, args);
			callbackAfter.apply(this, args);
			return returnValue;
		}
	}

	function noop() {}
	
	function onGameLoad(callback) {
		if (Game && Game.ready) {
			callback();
		} else {
			setTimeout(onGameLoad, 1000, callback);
		}
	}

	onGameLoad(function() {
		// Listen for the game fetching a new ticker, then play a sound if it's a fortune
		injectInto(Game, "getNewTicker", noop, function(manual) {
			if (Game.TickerEffect && Game.TickerEffect.type == "fortune" && Game.chimeType > 0) {
				PlaySound(window.fortuneCookieNotificationSound);
			}
		});
	});
})();
