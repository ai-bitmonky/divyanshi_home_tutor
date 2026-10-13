/* Shared by the server layout (inline <head> script) and client code — no "use client" here,
   so the server component gets the real string, not a client reference. */
export const MOBILE_MQ = "(max-width: 899px)";
export const SA_KEY = "tfm-sa"; // sessionStorage: ?standalone=1 override sticks for the tab
export const SPLASH_KEY = "tfm-splash"; // sessionStorage: splash shown once per cold start

/** Runs inline in <head> before first paint (stringified into layout.tsx) */
export const BOOT_SCRIPT = `(function(){try{var d=document.documentElement,q=location.search,ss=sessionStorage;
d.setAttribute('data-mode',matchMedia('${MOBILE_MQ}').matches?'mobile':'desktop');
if(/[?&]standalone=1/.test(q))ss.setItem('${SA_KEY}','1');if(/[?&]standalone=0/.test(q))ss.removeItem('${SA_KEY}');
var sa=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true||ss.getItem('${SA_KEY}')==='1';
if(sa){d.setAttribute('data-standalone','1');if(d.getAttribute('data-mode')==='mobile'&&!ss.getItem('${SPLASH_KEY}')){ss.setItem('${SPLASH_KEY}','1');d.setAttribute('data-splash','1');}}
}catch(e){}})();`;

