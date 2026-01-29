(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const r of e.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function c(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function i(t){if(t.ep)return;t.ep=!0;const e=c(t);fetch(t.href,e)}})();document.addEventListener("DOMContentLoaded",()=>{const o=document.querySelector(".navbar-pro");window.addEventListener("scroll",()=>{window.scrollY>100?(o.style.top="1rem",o.style.width="calc(100% - 2rem)",o.style.borderRadius="20px"):(o.style.top="var(--space-lg)",o.style.width="calc(100% - var(--space-4xl))",o.style.borderRadius="100px")});const n={threshold:.1,rootMargin:"0px 0px -10% 0px"},c=new IntersectionObserver(e=>{e.forEach(r=>{r.isIntersecting&&r.target.classList.add("visible")})},n);document.querySelectorAll(".fade-up, .bento-item").forEach(e=>{e.classList.add("fade-up"),c.observe(e)}),document.querySelectorAll(".btn-pro").forEach(e=>{e.addEventListener("mousemove",r=>{const s=e.getBoundingClientRect(),a=r.clientX-s.left-s.width/2,d=r.clientY-s.top-s.height/2;e.style.transform=`translate(${a*.15}px, ${d*.15}px) scale(1.02)`}),e.addEventListener("mouseleave",()=>{e.style.transform="translate(0, 0) scale(1)"})});const t=document.createElement("div");t.className="cursor-glow",document.body.appendChild(t),document.addEventListener("mousemove",e=>{t.style.transform=`translate(${e.clientX-100}px, ${e.clientY-100}px)`})});const l=document.createElement("style");l.textContent=`
    .cursor-glow {
        position: fixed;
        top: 0;
        left: 0;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(202, 138, 4, 0.05) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s linear;
    }
`;document.head.appendChild(l);
