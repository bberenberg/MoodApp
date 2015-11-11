/**
 * browser-deeplink v0.1
 *
 * Author: Hampus Ohlsson, Nov 2014
 * GitHub: http://github.com/hampusohlsson/browser-deeplink
 *
 * MIT License
 */

!function(n,e){"function"==typeof define&&define.amd?define("deeplink",e(n)):"object"==typeof exports?module.exports=e(n):n.deeplink=e(n)}(window||this,function(n){"use strict";if(n.document&&n.navigator){var e,t={},a={iOS:{},android:{},androidDisabled:!1,fallback:!0,delay:1e3,delta:500},i=function(n,e){var t={};for(var a in n)t[a]=n[a];for(var a in e)t[a]=e[a];return t},r=function(){var n="itms-apps://itunes.apple.com/app/",e=t.iOS.appName,a=t.iOS.appId;return a&&e?n+e+"/id"+a+"?mt=8":null},o=function(){var n="market://details?id=",e=t.android.appId;return e?n+e:null},d=function(){var n={ios:t.iOS.storeUrl||r(),android:t.android.storeUrl||o()};return n[t.platform]},u=function(){return navigator.userAgent.match("Android")},c=function(){return navigator.userAgent.match("iPad")||navigator.userAgent.match("iPhone")||navigator.userAgent.match("iPod")},f=function(){return u()||c()},l=function(n){return function(){var e=d(),a=t.delay+t.delta;"string"==typeof e&&Date.now()-n<a&&(window.location.href=e)}},p=function(n){t=i(a,n),u()&&(t.platform="android"),c()&&(t.platform="ios")},s=function(n){if(f()&&(!u()||!t.androidDisabled)){if(u()&&!navigator.userAgent.match(/Firefox/)){var a=n.match(/([^:]+):\/\/(.+)$/i);n="intent://"+a[2]+"#Intent;scheme="+a[1],n+=";package="+t.android.appId+";end"}t.fallback&&(e=setTimeout(l(Date.now()),t.delay));var i=document.createElement("iframe");i.onload=function(){clearTimeout(e),i.parentNode.removeChild(i),window.location.href=n},i.src=n,i.setAttribute("style","display:none;"),document.body.appendChild(i)}};return{setup:p,open:s}}});

