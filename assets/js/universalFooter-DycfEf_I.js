(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const k="/atlante/";async function T(){try{const n="mapConfig_atlante",e=new Date().getTime(),o=await(await fetch(`${k}config/map-config.json?v=${e}`)).json();return localStorage.setItem(n,JSON.stringify(o)),console.log(`Configuration loaded from server (cache bypassed) and saved to ${n}`),o}catch(n){console.error("Error loading configuration from server:",n);const e=localStorage.getItem(storageKey);if(e)return console.warn("Using cached configuration from localStorage as fallback"),JSON.parse(e);throw n}}async function j(n){try{const e="mapConfig_atlante";return localStorage.setItem(e,JSON.stringify(n,null,2)),console.log(`✅ Configuration saved to ${e}`),!0}catch(e){return console.error("Error saving configuration:",e),!1}}const E=/^[A-Za-z]:\//;function u(n=""){return n&&n.replace(/\\/g,"/").replace(E,e=>e.toUpperCase())}const $=/^[/\\]{2}/,L=/^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/,x=/^[A-Za-z]:$/,v=/^\/([A-Za-z]:)?$/,C=function(n){if(n.length===0)return".";n=u(n);const e=n.match($),t=d(n),o=n[n.length-1]==="/";return n=w(n,!t),n.length===0?t?"/":o?"./":".":(o&&(n+="/"),x.test(n)&&(n+="/"),e?t?`//${n}`:`//./${n}`:t&&!d(n)?`/${n}`:n)},S=function(...n){let e="";for(const t of n)if(t)if(e.length>0){const o=e[e.length-1]==="/",r=t[0]==="/";o&&r?e+=t.slice(1):e+=o||r?t:`/${t}`}else e+=t;return C(e)};function P(){return typeof process<"u"&&typeof process.cwd=="function"?process.cwd().replace(/\\/g,"/"):"/"}const p=function(...n){n=n.map(o=>u(o));let e="",t=!1;for(let o=n.length-1;o>=-1&&!t;o--){const r=o>=0?n[o]:P();!r||r.length===0||(e=`${r}/${e}`,t=d(r))}return e=w(e,!t),t&&!d(e)?`/${e}`:e.length>0?e:"."};function w(n,e){let t="",o=0,r=-1,s=0,i=null;for(let l=0;l<=n.length;++l){if(l<n.length)i=n[l];else{if(i==="/")break;i="/"}if(i==="/"){if(!(r===l-1||s===1))if(s===2){if(t.length<2||o!==2||t[t.length-1]!=="."||t[t.length-2]!=="."){if(t.length>2){const c=t.lastIndexOf("/");c===-1?(t="",o=0):(t=t.slice(0,c),o=t.length-1-t.lastIndexOf("/")),r=l,s=0;continue}else if(t.length>0){t="",o=0,r=l,s=0;continue}}e&&(t+=t.length>0?"/..":"..",o=2)}else t.length>0?t+=`/${n.slice(r+1,l)}`:t=n.slice(r+1,l),o=l-r-1;r=l,s=0}else i==="."&&s!==-1?++s:s=-1}return t}const d=function(n){return L.test(n)},y=function(n,e){const t=p(n).replace(v,"$1").split("/"),o=p(e).replace(v,"$1").split("/");if(o[0][1]===":"&&t[0][1]===":"&&t[0]!==o[0])return o.join("/");const r=[...t];for(const s of r){if(o[0]!==s)break;t.shift(),o.shift()}return[...t.map(()=>".."),...o].join("/")},f=function(n){const e=u(n).replace(/\/$/,"").split("/").slice(0,-1);return e.length===1&&x.test(e[0])&&(e[0]+="/"),e.join("/")||(d(n)?"/":".")},m=function(n,e){const t=u(n).split("/");let o="";for(let r=t.length-1;r>=0;r--){const s=t[r];if(s){o=s;break}}return e&&o.endsWith(e)?o.slice(0,-e.length):o};class A{constructor(e){this.currentPath=this.normalizePath(window.location.pathname),this.config=e,this.basePath=this.calculateBasePath(),this.header=null,this.isScrolling=!1,this.scrollThreshold=100}normalizePath(e){return e.endsWith("/")?e+"index.html":!e.includes(".")&&!e.endsWith("/")?e+"/index.html":e}calculateBasePath(){const e="/atlante/",t=f(this.currentPath),o=y(t,e);return o===""||o==="."?"./":o||"./"}getRelativePath(e){return S(this.basePath,e)}render(){const e=this.createNavElement(),t=[{text:"Home",path:"index.html"},{text:"Mappa",path:"pages/mappa.html"},{text:"Indici",path:"pages/indici.html"},{text:"Percorsi critici",path:"pages/percorsi.html"},{text:"Progetto",path:"pages/progetto.html"}],o=this.generateNavHTML(t);return e.innerHTML=o,this.setupEventListeners(),this.setupScrollListener(),console.log("Navigation rendered from:",this.currentPath,"Base path:",this.basePath),e}generateLogoHTML(){const e=this.config?.project?.projectThumbnailURL;if(e&&e.trim()!==""){const t=e.startsWith("imgs/")?this.getRelativePath(e):this.getRelativePath(`imgs/${e}`);return`
                <a href="${this.getRelativePath("index.html")}">
                    <img src="${t}" alt="Logo" class="h-10 object-contain">
                </a>
            `}else return`
                <a href="${this.getRelativePath("index.html")}" class="bg-primary-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:bg-primary-700 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </a>
            `}generateNavHTML(e){const t=e.map(r=>{const s=r.path.startsWith("http://")||r.path.startsWith("https://"),i=s?r.path:this.getRelativePath(r.path),l=s?'target="_blank" rel="noopener noreferrer"':"",c=!s&&this.isActivePath(r.path);let a,h;s?(a="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 font-medium transition duration-200 flex items-center gap-2",h=`
                    ${r.text}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                `):(a=`nav-link ${c?"text-primary-900 border-b-2 border-primary-600 pb-1":"text-gray-600 hover:text-primary-600"} font-medium transition duration-200`,h=r.text);const g=r.section?`data-section="${r.section}"`:"";return`<a href="${i}" ${l} class="${a}" ${g}>${h}</a>`}).join(""),o=e.map(r=>{const s=r.path.startsWith("http://")||r.path.startsWith("https://"),i=s?r.path:this.getRelativePath(r.path),l=s?'target="_blank" rel="noopener noreferrer"':"",c=!s&&this.isActivePath(r.path);let a,h;s?(a="block px-4 py-3 bg-primary-500 text-white hover:bg-primary-600 font-medium transition duration-200 flex items-center justify-between",h=`
                    ${r.text}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                `):(a=`block px-4 py-3 ${c?"text-primary-900 bg-primary-50 font-medium":"text-gray-600 hover:text-primary-600 hover:bg-gray-50"} transition duration-200`,h=r.text);const g=r.section?`data-section="${r.section}"`:"";return`<a href="${i}" ${l} class="${a}" ${g}>${h}</a>`}).join("");return`
            <div class="flex justify-between items-center h-20">
    <!-- Logo -->
    <div class="flex items-center space-x-4">
        <div class="flex items-center justify-center">
            ${this.generateLogoHTML()}
        </div>
    </div>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center space-x-8">
        ${t}
    </div>

    <!-- Mobile Menu Toggle -->
    <div class="md:hidden relative">
        <input type="checkbox" id="menu-toggle" class="hidden peer">
        <label for="menu-toggle" class="cursor-pointer text-gray-600 hover:text-primary-600 transition duration-200 peer-checked:text-primary-600">
            <svg class="h-6 w-6 peer-checked:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg class="h-6 w-6 hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </label>
        
        <div class="hidden peer-checked:block absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
            ${o}
        </div>
    </div>
</div>
        `}isActivePath(e){const t=m(this.currentPath),o=m(e);if(t==="index.html"&&o==="index.html"&&e==="index.html"){const r=f(this.currentPath),s="/atlante/",i=s.endsWith("/")?s.slice(0,-1):s;return r===i||r===i+"/"}return t===o}createNavElement(){let e=document.querySelector("header");e||(e=document.createElement("header"),e.className="bg-white shadow-lg border-b border-primary-100 w-full sticky top-0 z-40 transition-all duration-300",document.body.insertBefore(e,document.body.firstChild)),this.header=e;let t=e.querySelector("nav");return t||(t=document.createElement("nav"),t.className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",e.appendChild(t)),t}setupScrollListener(){let e=!1;const t=()=>{if(!this.header)return;const s=window.scrollY>this.scrollThreshold;s&&!this.isScrolling?(this.isScrolling=!0,this.header.className="bg-white shadow-lg border-b border-primary-100 w-full fixed top-0 z-40 transition-all duration-300",document.body.style.paddingTop=this.header.offsetHeight+"px"):!s&&this.isScrolling&&(this.isScrolling=!1,this.header.className="bg-white shadow-lg border-b border-primary-100 w-full sticky top-0 z-40 transition-all duration-300",document.body.style.paddingTop=""),e=!1},o=()=>{e||(requestAnimationFrame(t),e=!0)};window.addEventListener("scroll",o,{passive:!0}),this.cleanupScrollListener=()=>{window.removeEventListener("scroll",o)}}setupEventListeners(){document.addEventListener("click",e=>{const t=e.target.closest("a[data-section]");if(t&&t.dataset.section){const o=t.dataset.section,r=t.getAttribute("href");if(r&&r.includes("index.html")){e.preventDefault();const s=r.split("#")[0];window.location.href=`${s}#section-${o}`}}}),document.addEventListener("click",e=>{const t=document.getElementById("menu-toggle"),o=e.target.closest(".md\\:hidden");t&&t.checked&&!o&&(t.checked=!1)})}destroy(){this.cleanupScrollListener&&this.cleanupScrollListener(),document.body.style.paddingTop=""}}class M{constructor(e){this.currentPath=window.location.pathname,this.basePath=this.calculateBasePath(),this.config=e,this.isOpen=!1,this.footerElement=null,this.carouselInterval=null,this.currentSlide=0,this.logos=[],this.initLogos()}async initLogos(){try{const e=window.location.pathname.match(/^\/[^\/]+\//)?.[0]||"/",t=this.getRelativePath("/imgs/institutional_logos/manifest.json"),o=await fetch(t);if(!o.ok)throw new Error(`Manifest not found: ${o.status}`);const r=await o.json();this.logos=r.map(s=>({filename:s,path:this.getRelativePath("/imgs/institutional_logos/"+s)})).sort((s,i)=>s.filename.localeCompare(i.filename)),this.footerElement&&this.logos.length>0&&this.updateCarousel()}catch{this.logos=[]}}updateCarousel(){const e=this.footerElement.querySelector(".footer-inner");e&&(e.innerHTML=this.generateCompactFooterHTML(),this.initCarousel())}dirname(e){return e.substring(0,e.lastIndexOf("/"))||"/"}join(...e){return e.map(t=>t.replace(/^\/+|\/+$/g,"")).filter(t=>t.length>0).join("/").replace(/\/+/g,"/")}relative(e,t){const o=e.split("/").filter(a=>a),r=t.split("/").filter(a=>a);let s=0;for(let a=0;a<Math.min(o.length,r.length)&&o[a]===r[a];a++)s++;const i=o.length-s,l=r.slice(s);return"../".repeat(i)+l.join("/")||"./"}normalizePath(e){return e.endsWith("/")?e+"index.html":!e.includes(".")&&!e.endsWith("/")?e+"/index.html":e}calculateBasePath(){const e="/atlante/",t=f(this.currentPath),o=y(t,e);return o===""||o==="."?"./":o||"./"}getRelativePath(e){return this.join(this.basePath,e)}isExternalLink(e){return e.startsWith("http://")||e.startsWith("https://")}render(){return this.footerElement=this.createFooterElement(),this.setupEventListeners(),this.initCarousel(),this.footerElement}createFooterElement(){const e=document.querySelector(".footer-overlay");e&&e.remove();const t=document.createElement("div");return t.className="footer-overlay",t.innerHTML=`
            <div class="footer-trigger">
                <svg class="footer-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                </svg>
            </div>
            <div class="footer-content">
                <div class="footer-trigger">
                    <svg class="footer-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                    </svg>
                </div>
                <div class="footer-inner">
                    ${this.generateCompactFooterHTML()}
                </div>
            </div>
        `,document.body.appendChild(t),t}generateCompactFooterHTML(){const e=new Date().getFullYear(),t=this.config?.project?.projectShortTitle,o=this.getNavigationLinks().map(s=>{const i=this.isExternalLink(s.path),l=s.path,c=s.section?`data-section="${s.section}"`:"",a=i?'target="_blank" rel="noopener noreferrer"':"",h=i?`
                <svg class="footer-external-icon" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
            `:"";return`<li><a href="${l}" ${a} ${c}>${s.text}${h}</a></li>`}).join("");let r="";if(this.logos.length>0){const s=this.logos.map(l=>`
                <div class="footer-logo-slide">
                    <img src="${l.path}" alt="Institutional Logo - ${l.filename}" />
                </div>
            `).join(""),i=this.logos.map((l,c)=>`<span class="footer-carousel-dot ${c===0?"active":""}" data-index="${c}"></span>`).join("");r=`
                <div class="footer-logo-carousel-container">
                    <div class="footer-logo-carousel-title">Partner Istituzionali</div>
                    <div class="footer-logo-carousel">
                        <div class="footer-logo-carousel-track">
                            ${s}
                        </div>
                    </div>
                    <div class="footer-carousel-controls">
                        <button class="footer-carousel-btn footer-carousel-prev" aria-label="Previous logo">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <div class="footer-carousel-dots">
                            ${i}
                        </div>
                        <button class="footer-carousel-btn footer-carousel-next" aria-label="Next logo">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `}return`
            <div class="footer-title">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clip-rule="evenodd"/>
                </svg>
                ${t}
            </div>
            
            <ul class="footer-nav">
                ${o}
            </ul>
            
            ${r}
            <div class="footer-credits">
                <div>© ${e} ${t}. Tutti i diritti riservati.</div>
                <div style="margin-top: 4px;">
                    Sviluppato con <span class="footer-heart">♥</span> per la ricerca storica
                </div>
                <div style="margin-top: 4px;">
                    Powered by OpenStreetMap • GIS Technology
                </div>
            </div>
        `}getNavigationLinks(){return[{text:"Home",path:"/index.html"},{text:"Documentazione",path:"https://github.com/valentinapasqual/leda"},{text:"Contatti",path:"https://ledaprin2022pnrr.altervista.org/chi-siamo/"}]}initCarousel(){if(!this.footerElement||this.logos.length===0)return;const e=this.footerElement.querySelector(".footer-logo-carousel-track"),t=this.footerElement.querySelector(".footer-carousel-prev"),o=this.footerElement.querySelector(".footer-carousel-next"),r=this.footerElement.querySelectorAll(".footer-carousel-dot");if(!e)return;this.startCarousel(),t&&t.addEventListener("click",()=>{this.stopCarousel(),this.goToPrevSlide(),this.startCarousel()}),o&&o.addEventListener("click",()=>{this.stopCarousel(),this.goToNextSlide(),this.startCarousel()}),r.forEach(i=>{i.addEventListener("click",()=>{this.stopCarousel();const l=parseInt(i.dataset.index);this.goToSlide(l),this.startCarousel()})});const s=this.footerElement.querySelector(".footer-logo-carousel");s&&(s.addEventListener("mouseenter",()=>this.stopCarousel()),s.addEventListener("mouseleave",()=>this.startCarousel()))}startCarousel(){this.logos.length<=1||(this.stopCarousel(),this.carouselInterval=setInterval(()=>{this.goToNextSlide()},3e3))}stopCarousel(){this.carouselInterval&&(clearInterval(this.carouselInterval),this.carouselInterval=null)}goToSlide(e){const t=this.footerElement?.querySelector(".footer-logo-carousel-track"),o=this.footerElement?.querySelectorAll(".footer-carousel-dot");!t||!o||(this.currentSlide=e,t.style.transform=`translateX(-${e*100}%)`,o.forEach((r,s)=>{r.classList.toggle("active",s===e)}))}goToNextSlide(){const e=(this.currentSlide+1)%this.logos.length;this.goToSlide(e)}goToPrevSlide(){const e=(this.currentSlide-1+this.logos.length)%this.logos.length;this.goToSlide(e)}toggle(){this.isOpen=!this.isOpen,this.footerElement&&(this.footerElement.classList.toggle("open",this.isOpen),this.isOpen&&this.logos.length>0?this.startCarousel():this.stopCarousel())}setupEventListeners(){if(!this.footerElement)return;this.footerElement.querySelectorAll(".footer-trigger").forEach(t=>{t.addEventListener("click",o=>{o.stopPropagation(),this.toggle()})}),this.footerElement.addEventListener("click",t=>{const o=t.target.closest("a[data-section]");if(o&&o.dataset.section){const r=o.dataset.section,s=o.getAttribute("href");if(s&&s.includes("index.html")){t.preventDefault();const i=s.split("#")[0];window.location.href=`${i}#section-${r}`,this.toggle()}}}),document.addEventListener("click",t=>{this.isOpen&&!this.footerElement.contains(t.target)&&this.toggle()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&this.isOpen&&this.toggle()})}destroy(){this.stopCarousel(),this.footerElement&&this.footerElement.remove()}}export{A as U,M as a,T as l,j as s};
