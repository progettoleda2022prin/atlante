(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(e){if(e.ep)return;e.ep=!0;const r=o(e);fetch(e.href,r)}})();const v="/atlante/";async function k(){try{const n="mapConfig_atlante",t=new Date().getTime(),s=await(await fetch(`${v}config/map-config.json?v=${t}`)).json();return localStorage.setItem(n,JSON.stringify(s)),console.log(`Configuration loaded from server (cache bypassed) and saved to ${n}`),s}catch(n){console.error("Error loading configuration from server:",n);const t=localStorage.getItem(storageKey);if(t)return console.warn("Using cached configuration from localStorage as fallback"),JSON.parse(t);throw n}}async function E(n){try{const t="mapConfig_atlante";return localStorage.setItem(t,JSON.stringify(n,null,2)),console.log(`✅ Configuration saved to ${t}`),!0}catch(t){return console.error("Error saving configuration:",t),!1}}const m=/^[A-Za-z]:\//;function f(n=""){return n&&n.replace(/\\/g,"/").replace(m,t=>t.toUpperCase())}const y=/^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/,x=/^[A-Za-z]:$/,b=function(n){return y.test(n)},w=function(n){const t=f(n).replace(/\/$/,"").split("/").slice(0,-1);return t.length===1&&x.test(t[0])&&(t[0]+="/"),t.join("/")||(b(n)?"/":".")},p=function(n,t){const o=f(n).split("/");let s="";for(let e=o.length-1;e>=0;e--){const r=o[e];if(r){s=r;break}}return t&&s.endsWith(t)?s.slice(0,-t.length):s};class C{constructor(t){this.currentPath=this.normalizePath(window.location.pathname),this.config=t,this.basePath=this.calculateBasePath(),this.header=null,this.isScrolling=!1,this.scrollThreshold=100,document.documentElement.style.setProperty("--bg-image","url(/atlante/imgs/seppia.jpg)")}normalizePath(t){return t.endsWith("/")?t+"index.html":!t.includes(".")&&!t.endsWith("/")?t+"/index.html":t}calculateBasePath(){return"/atlante/"}getRelativePath(t){const o=t.replace(/^\//,"");return this.basePath+o}render(){const t=this.createNavElement(),o=[{text:"Home",path:"index.html"},{text:"Mappa",path:"pages/mappa.html"},{text:"Indici",path:"pages/indici.html"},{text:"Percorsi critici",path:"pages/percorsi.html"},{text:"Progetto",path:"pages/progetto.html",separate:!0}],s=this.generateNavHTML(o);return t.innerHTML=s,this.setupEventListeners(),this.setupScrollListener(),console.log("Navigation rendered from:",this.currentPath,"Base path:",this.basePath),t}generateLogoHTML(){const t=this.config?.project?.projectThumbnailURL;if(t&&t.trim()!==""){const o=t.startsWith("imgs/")?this.getRelativePath(t):this.getRelativePath(`imgs/${t}`);return`
                <a href="${this.getRelativePath("index.html")}">
                    <img src="${o}" alt="Logo" class="h-10 object-contain">
                </a>
            `}else return`
                <a href="${this.getRelativePath("index.html")}" class="bg-primary-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:bg-primary-700 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </a>
            `}generateNavHTML(t){const o=t.map(e=>{const r=e.path.startsWith("http://")||e.path.startsWith("https://"),i=r?e.path:this.getRelativePath(e.path),l=r?'target="_blank" rel="noopener noreferrer"':"",c=!r&&this.isActivePath(e.path),a="separate"in e?e.separate:!1;let h,d;r?(h="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 font-medium transition duration-200 flex items-center gap-2",d=`
                    ${e.text}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                `):a?(h=`nav-link ${c?"text-primary-900 border-primary-600 pb-1":"text-gray-400 hover:text-primary-600"} font-medium transition duration-200 ml-8 pl-8 border-l-2 border-gray-200`,d=e.text):(h=`nav-link ${c?"text-primary-900 border-b-2 border-primary-600 pb-1":"text-gray-600 hover:text-primary-600"} font-medium transition duration-200`,d=e.text);const u=e.section?`data-section="${e.section}"`:"";return`<a href="${i}" ${l} class="${h}" ${u}>${d}</a>`}).join(""),s=t.map(e=>{const r=e.path.startsWith("http://")||e.path.startsWith("https://"),i=r?e.path:this.getRelativePath(e.path),l=r?'target="_blank" rel="noopener noreferrer"':"",c=!r&&this.isActivePath(e.path),a="separate"in e?e.separate:!1;let h,d;r?(h="block px-4 py-3 bg-primary-500 text-white hover:bg-primary-600 font-medium transition duration-200 flex items-center justify-between",d=`
                    ${e.text}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                `):a?(h=`block px-4 py-3 ${c?"text-primary-900 bg-primary-50 font-medium":"text-gray-400 hover:text-primary-600 hover:bg-gray-50"} transition duration-200 border-t-2 border-gray-200`,d=e.text):(h=`block px-4 py-3 ${c?"text-primary-900 bg-primary-50 font-medium":"text-gray-600 hover:text-primary-600 hover:bg-gray-50"} transition duration-200`,d=e.text);const u=e.section?`data-section="${e.section}"`:"";return`<a href="${i}" ${l} class="${h}" ${u}>${d}</a>`}).join("");return`
            <div class="flex justify-between items-center h-20">
    <!-- Logo -->
    <div class="flex items-center space-x-4">
        <div class="flex items-center justify-center">
            ${this.generateLogoHTML()}
        </div>
    </div>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center space-x-8">
        ${o}
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
            ${s}
        </div>
    </div>
</div>
        `}isActivePath(t){const o=p(this.currentPath),s=p(t);if(o==="index.html"&&s==="index.html"&&t==="index.html"){const e=w(this.currentPath),r="/atlante/",i=r.endsWith("/")?r.slice(0,-1):r;return e===i||e===i+"/"}return o===s}createNavElement(){let t=document.querySelector("header");t||(t=document.createElement("header"),t.className="bg-white shadow-lg border-b border-primary-100 w-full sticky top-0 z-40 transition-all duration-300",document.body.insertBefore(t,document.body.firstChild)),this.header=t;let o=t.querySelector("nav");return o||(o=document.createElement("nav"),o.className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",t.appendChild(o)),o}setupScrollListener(){let t=!1;const o=()=>{if(!this.header)return;const r=window.scrollY>this.scrollThreshold;r&&!this.isScrolling?(this.isScrolling=!0,this.header.className="bg-white shadow-lg border-b border-primary-100 w-full fixed top-0 z-40 transition-all duration-300",document.body.style.paddingTop=this.header.offsetHeight+"px"):!r&&this.isScrolling&&(this.isScrolling=!1,this.header.className="bg-white shadow-lg border-b border-primary-100 w-full sticky top-0 z-40 transition-all duration-300",document.body.style.paddingTop=""),t=!1},s=()=>{t||(requestAnimationFrame(o),t=!0)};window.addEventListener("scroll",s,{passive:!0}),this.cleanupScrollListener=()=>{window.removeEventListener("scroll",s)}}setupEventListeners(){document.addEventListener("click",t=>{const o=t.target.closest("a[data-section]");if(o&&o.dataset.section){const s=o.dataset.section,e=o.getAttribute("href");if(e&&e.includes("index.html")){t.preventDefault();const r=e.split("#")[0];window.location.href=`${r}#section-${s}`}}}),document.addEventListener("click",t=>{const o=document.getElementById("menu-toggle"),s=t.target.closest(".md\\:hidden");o&&o.checked&&!s&&(o.checked=!1)})}destroy(){this.cleanupScrollListener&&this.cleanupScrollListener(),document.body.style.paddingTop=""}}class L{constructor(t){this.currentPath=window.location.pathname,this.basePath=this.calculateBasePath(),this.config=t,this.isOpen=!1,this.footerElement=null,this.carouselInterval=null,this.currentSlide=0,this.logos=[],this.initLogos()}async initLogos(){try{const t=this.getRelativePath("/imgs/institutional_logos/manifest.json"),o=await fetch(t);if(!o.ok)throw new Error(`Manifest not found: ${o.status}`);const s=await o.json();this.logos=s.map(e=>({filename:e,path:this.getRelativePath("/imgs/institutional_logos/"+e)})).sort((e,r)=>e.filename.localeCompare(r.filename)),this.footerElement&&this.logos.length>0&&this.updateCarousel()}catch{this.logos=[]}}updateCarousel(){const t=this.footerElement.querySelector(".footer-inner");t&&(t.innerHTML=this.generateCompactFooterHTML(),this.initCarousel())}dirname(t){return t.substring(0,t.lastIndexOf("/"))||"/"}join(...t){return t.map(o=>o.replace(/^\/+|\/+$/g,"")).filter(o=>o.length>0).join("/").replace(/\/+/g,"/")}relative(t,o){const s=t.split("/").filter(a=>a),e=o.split("/").filter(a=>a);let r=0;for(let a=0;a<Math.min(s.length,e.length)&&s[a]===e[a];a++)r++;const i=s.length-r,l=e.slice(r);return"../".repeat(i)+l.join("/")||"./"}calculateBasePath(){return"/atlante/"}getRelativePath(t){const o=t.replace(/^\//,"");return this.basePath+o}isExternalLink(t){return t.startsWith("http://")||t.startsWith("https://")}render(){return this.footerElement=this.createFooterElement(),this.setupEventListeners(),this.initCarousel(),this.footerElement}createFooterElement(){const t=document.querySelector(".footer-overlay");t&&t.remove();const o=document.createElement("div");return o.className="footer-overlay",o.innerHTML=`
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
        `,document.body.appendChild(o),o}generateCompactFooterHTML(){const t=new Date().getFullYear(),o=this.config?.project?.projectShortTitle,s=this.getNavigationLinks().map(r=>{const i=this.isExternalLink(r.path),l=r.path,c=r.section?`data-section="${r.section}"`:"",a=i?'target="_blank" rel="noopener noreferrer"':"",h=i?`
                <svg class="footer-external-icon" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
            `:"";return`<li><a href="${l}" ${a} ${c}>${r.text}${h}</a></li>`}).join("");let e="";if(this.logos.length>0){const r=this.logos.map(l=>`
                <div class="footer-logo-slide">
                    <img src="${l.path}" alt="Institutional Logo - ${l.filename}" />
                </div>
            `).join(""),i=this.logos.map((l,c)=>`<span class="footer-carousel-dot ${c===0?"active":""}" data-index="${c}"></span>`).join("");e=`
                <div class="footer-logo-carousel-container">
                    <div class="footer-logo-carousel-title">Partner Istituzionali</div>
                    <div class="footer-logo-carousel">
                        <div class="footer-logo-carousel-track">
                            ${r}
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
                ${o}
            </div>
            
            <ul class="footer-nav">
                ${s}
            </ul>
            
            ${e}
            <div class="footer-credits">
                <div>© ${t} ${o}. Tutti i diritti riservati.</div>
                <div style="margin-top: 4px;">
                    Sviluppato con <span class="footer-heart">♥</span> per la ricerca storica
                </div>
                <div style="margin-top: 4px;">
                    Powered by OpenStreetMap • GIS Technology
                </div>
            </div>
        `}getNavigationLinks(){return[{text:"Home",path:this.getRelativePath("/index.html")},{text:"Documentazione",path:"https://github.com/valentinapasqual/leda"},{text:"Contatti",path:this.getRelativePath("/pages/progetto.html#members")}]}initCarousel(){if(!this.footerElement||this.logos.length===0)return;const t=this.footerElement.querySelector(".footer-logo-carousel-track"),o=this.footerElement.querySelector(".footer-carousel-prev"),s=this.footerElement.querySelector(".footer-carousel-next"),e=this.footerElement.querySelectorAll(".footer-carousel-dot");if(!t)return;this.startCarousel(),o&&o.addEventListener("click",()=>{this.stopCarousel(),this.goToPrevSlide(),this.startCarousel()}),s&&s.addEventListener("click",()=>{this.stopCarousel(),this.goToNextSlide(),this.startCarousel()}),e.forEach(i=>{i.addEventListener("click",()=>{this.stopCarousel();const l=parseInt(i.dataset.index);this.goToSlide(l),this.startCarousel()})});const r=this.footerElement.querySelector(".footer-logo-carousel");r&&(r.addEventListener("mouseenter",()=>this.stopCarousel()),r.addEventListener("mouseleave",()=>this.startCarousel()))}startCarousel(){this.logos.length<=1||(this.stopCarousel(),this.carouselInterval=setInterval(()=>{this.goToNextSlide()},3e3))}stopCarousel(){this.carouselInterval&&(clearInterval(this.carouselInterval),this.carouselInterval=null)}goToSlide(t){const o=this.footerElement?.querySelector(".footer-logo-carousel-track"),s=this.footerElement?.querySelectorAll(".footer-carousel-dot");!o||!s||(this.currentSlide=t,o.style.transform=`translateX(-${t*100}%)`,s.forEach((e,r)=>{e.classList.toggle("active",r===t)}))}goToNextSlide(){const t=(this.currentSlide+1)%this.logos.length;this.goToSlide(t)}goToPrevSlide(){const t=(this.currentSlide-1+this.logos.length)%this.logos.length;this.goToSlide(t)}toggle(){this.isOpen=!this.isOpen,this.footerElement&&(this.footerElement.classList.toggle("open",this.isOpen),this.isOpen&&this.logos.length>0?this.startCarousel():this.stopCarousel())}setupEventListeners(){if(!this.footerElement)return;this.footerElement.querySelectorAll(".footer-trigger").forEach(o=>{o.addEventListener("click",s=>{s.stopPropagation(),this.toggle()})}),this.footerElement.addEventListener("click",o=>{const s=o.target.closest("a[data-section]");if(s&&s.dataset.section){const e=s.dataset.section,r=s.getAttribute("href");if(r&&r.includes("index.html")){o.preventDefault();const i=r.split("#")[0];window.location.href=`${i}#section-${e}`,this.toggle()}}}),document.addEventListener("click",o=>{this.isOpen&&!this.footerElement.contains(o.target)&&this.toggle()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&this.isOpen&&this.toggle()})}destroy(){this.stopCarousel(),this.footerElement&&this.footerElement.remove()}}export{C as U,L as a,k as l,E as s};
