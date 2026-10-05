/* New tabs in ordinary browsers; best-effort escape from recognized mobile app browsers. */
(() => {
 'use strict';
 const ua=navigator.userAgent;
 const android=/Android/i.test(ua);
 const ios=/iPhone|iPad|iPod/i.test(ua)||(/Macintosh/i.test(ua)&&navigator.maxTouchPoints>1);
 // Detection is heuristic: some apps hide their identity or change their user agent.
 const inApp=/Instagram|FBAN|FBAV|TikTok|musical_ly|Bytedance|Snapchat|Line\//i.test(ua);
 const banner=document.getElementById('browser-hint');
 const message=document.getElementById('browser-hint-message');
 const openButton=document.getElementById('browser-hint-open');
 function safeUrl(value){try{const url=new URL(value,location.href);return ['https:','http:'].includes(url.protocol)?url:null;}catch{return null;}}
 function chromeIntent(url){
  return 'intent://'+url.host+url.pathname+url.search+'#Intent;scheme='+url.protocol.slice(0,-1)+';action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.android.chrome;S.browser_fallback_url='+encodeURIComponent(url.href)+';end';
 }
 function launch(url){
  // Called synchronously from a real click; do not use timed redirects or popup detection.
  if(android&&inApp){location.assign(chromeIntent(url));return;}
  window.open(url.href,'_blank','noopener,noreferrer');
 }
 window.openExternalDestination=value=>{const url=safeUrl(value);if(url)launch(url);};
 if(inApp&&(android||ios)){
  banner.hidden=false;
  message.textContent=ios?'This app has you boxed in. Tap its menu or share button and look for “Open in browser” or “Open in Safari.”':'This app has you boxed in. Try Chrome, or use the app’s menu and look for “Open in browser.”';
  if(android){openButton.hidden=false;openButton.addEventListener('click',()=>{const url=safeUrl(location.href);if(url)launch(url);});}
 }
 document.getElementById('browser-hint-close').addEventListener('click',()=>{banner.hidden=true;});
 document.addEventListener('click',event=>{
  const anchor=event.target.closest('a[href]');
  if(!anchor||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  if(!(android&&inApp))return;
  const url=safeUrl(anchor.getAttribute('href'));
  if(!url||anchor.getAttribute('href').startsWith('#'))return;
  event.preventDefault();launch(url);
 });
})();
