import{c as L,r as s,j as o,A as C,m as M}from"./index-BIr1CvZ7.js";/**
 * @license lucide-react v0.486.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]],F=L("dollar-sign",j);/**
 * @license lucide-react v0.486.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]],H=L("users",A),R=()=>{const[u,$]=s.useState({x:0,y:0}),[r,m]=s.useState(!1),[S,v]=s.useState(!1),f=s.useRef(null),p=s.useRef(null);return s.useEffect(()=>{const t=f.current,h=p.current;let n=0,a=0,d=!1,x=0,y=0;const b=()=>{if(!t||!h)return;const e=d?.2:.15;n+=(x-n)*e,a+=(y-a)*e,t.style.transform=`translate3d(${n-8}px, ${a-8}px, 0) ${r?"scale(2)":"scale(1)"}`,h.style.transform=`translate3d(${n-16}px, ${a-16}px, 0) ${r?"scale(1.5)":"scale(1)"}`,requestAnimationFrame(b)};requestAnimationFrame(b);const g=e=>{x=e.clientX,y=e.clientY,$({x:e.clientX,y:e.clientY}),d=!0,clearTimeout(window.movingTimeout),window.movingTimeout=setTimeout(()=>{d=!1},100)},E=()=>{v(!0),setTimeout(()=>v(!1),600)},i=()=>m(!0),c=()=>m(!1);window.addEventListener("mousemove",g,{passive:!0}),window.addEventListener("click",E);const w=new MutationObserver(()=>{document.querySelectorAll("button, a, .hover-trigger, input, select, textarea").forEach(l=>{l.removeEventListener("mouseenter",i),l.removeEventListener("mouseleave",c),l.addEventListener("mouseenter",i),l.addEventListener("mouseleave",c)})}),k=document.querySelectorAll("button, a, .hover-trigger, input, select, textarea");return k.forEach(e=>{e.addEventListener("mouseenter",i),e.addEventListener("mouseleave",c)}),w.observe(document.body,{childList:!0,subtree:!0}),()=>{window.removeEventListener("mousemove",g),window.removeEventListener("click",E),w.disconnect(),clearTimeout(window.movingTimeout),k.forEach(e=>{e.removeEventListener("mouseenter",i),e.removeEventListener("mouseleave",c)})}},[]),s.useEffect(()=>{const t=document.createElement("style");return t.textContent=`
      @keyframes rippleEffect {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0.9;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          transform: translate(-50%, -50%) scale(6);
          opacity: 0;
        }
      }
    `,document.head.appendChild(t),()=>{document.head.removeChild(t)}},[]),o.jsxs(o.Fragment,{children:[o.jsx("div",{ref:f,className:"fixed top-0 left-0 w-4 h-4 pointer-events-none z-30 will-change-transform",style:{background:"linear-gradient(45deg, #3B82F6, #60A5FA)",boxShadow:"0 0 10px rgba(59, 130, 246, 0.5)",borderRadius:"50%",transform:"translate3d(0, 0, 0)",transition:r?"transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)":"transform 0.1s ease-out"}}),o.jsx("div",{ref:p,className:"fixed top-0 left-0 w-8 h-8 pointer-events-none z-30 will-change-transform",style:{border:"2px solid #3B82F6",borderRadius:"50%",boxShadow:"0 0 15px rgba(59, 130, 246, 0.3)",transform:"translate3d(0, 0, 0)",transition:r?"transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)":"transform 0.15s ease-out"}}),o.jsx(C,{children:S&&o.jsx(M.div,{className:"fixed pointer-events-none z-40",style:{left:`${u.x}px`,top:`${u.y}px`,width:0,height:0},initial:{opacity:1},animate:{opacity:1},exit:{opacity:0},children:[0,1,2].map(t=>o.jsx("div",{className:"absolute rounded-full",style:{width:"16px",height:"16px",left:0,top:0,border:`2px solid rgba(59, 130, 246, ${.9-t*.2})`,boxShadow:`0 0 ${8+t*4}px rgba(59, 130, 246, ${.4-t*.1})`,background:"transparent",animation:`rippleEffect ${.8+t*.1}s cubic-bezier(0, 0.2, 0.8, 1) forwards ${t*.12}s`,animationFillMode:"both"}},t))})})]})};export{R as C,F as D,H as U};
