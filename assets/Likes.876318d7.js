var g=Object.defineProperty,k=Object.defineProperties;var w=Object.getOwnPropertyDescriptors;var h=Object.getOwnPropertySymbols;var P=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var m=(s,o,n)=>o in s?g(s,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[o]=n,x=(s,o)=>{for(var n in o||(o={}))P.call(o,n)&&m(s,n,o[n]);if(h)for(var n of h(o))L.call(o,n)&&m(s,n,o[n]);return s},v=(s,o)=>k(s,w(o));import{r as S,o as d,c as _,a as e,W as I,X as C,b as D,p as N,h as M,t as y,i as z,_ as A,T as $,m as j,k as B,a0 as E,j as F,a2 as T,q as i,s as b}from"./index.917bd756.js";const l=s=>(N("data-v-371c1e65"),s=s(),M(),s),V={class:"likes bg_pattern"},H={class:"container py-12 min-h-screen"},R={class:"flex justify-between items-start gap-7"},U={class:"flex-auto space-y-4"},q=l(()=>e("div",{class:"relative p-8 z-[1]"},[e("h1",{class:"absolute inset-0 py-4 w-full border-2 border-black bg-white text-center text-xl font-bold after:inset-0 after:w-full after:h-full after:translate-x-[-7px] after:translate-y-[7px] after:content-[''] after:absolute after:bg-white after:border-2 after:border-black after:z-[-1]"}," \u6211\u6309\u8B9A\u7684\u8CBC\u6587 ")],-1)),O={class:"card-body py-4 pl-4 pr-10"},W={class:"flex justify-between items-center"},X={class:"flex gap-4 flex-1"},G=["src"],J={class:""},K={class:"font-bold mb-1"},Q={class:"text-xs text-gray-base font-num"},Y=z(" \u767C\u6587\u6642\u9593\uFF1A "),Z={class:"font-num"},ee={class:"flex gap-9"},se=["onClick"],te=l(()=>e("i",{class:"fa-regular fa-thumbs-up text-primary text-2xl"},null,-1)),ae=l(()=>e("span",{class:"block"},"\u53D6\u6D88",-1)),oe=[te,ae],ne=["onClick"],ce=l(()=>e("i",{class:"fa-regular fa-circle-right text-2xl"},null,-1)),re=l(()=>e("span",{class:"block"},"\u67E5\u770B",-1)),le=[ce,re];function ie(s,o,n,r,u,f){const t=S("SideMenu");return d(),_("div",V,[e("div",H,[e("section",R,[e("div",U,[q,(d(!0),_(I,null,C(r.normalizedPosts,a=>(d(),_("div",{class:"card",key:a._id},[e("div",O,[e("div",W,[e("div",X,[e("img",{src:a.userPhoto,class:"w-full h-full max-h-[40px] max-w-[40px] rounded-full",alt:"avatarImage"},null,8,G),e("div",J,[e("p",K,y(a.userName),1),e("p",Q,[Y,e("span",Z,y(a.createdAtDisplay),1)])])]),e("div",ee,[e("button",{type:"button",onClick:c=>r.removeLikePost(a._id)},oe,8,se),e("button",{type:"button",onClick:c=>r.goPersonalPage(a.user._id)},le,8,ne)])])])]))),128))]),D(t)])])])}const de="https://api.iconify.design/ri:user-5-line.svg",_e={name:"Likes",components:{SideMenu:$},setup(){const s=j([]),o=B(()=>s.value.map(t=>{var a,c,p;return v(x({},t),{userName:(c=(a=t==null?void 0:t.user)==null?void 0:a.name)!=null?c:"",userPhoto:((p=t==null?void 0:t.user)==null?void 0:p.photo)||de,createdAtDisplay:E(new Date(t.createdAt),"yyyy-MM-dd HH:mm")})})),n=T(async t=>{try{i(!0),await b.delete(`/api/v1/post/${t}/like`);const a=s.value.findIndex(c=>c._id===t);a!==-1&&s.value.splice(a,1)}catch(a){console.error(a)}finally{i(!1)}},500),r=async()=>{var t,a;try{i(!0);const c=await b.get("/api/v1/user/like-posts");s.value=(a=(t=c.data)==null?void 0:t.data)!=null?a:[]}catch(c){console.error(c)}finally{i(!1)}},u=F(),f=t=>{u.push({name:"Personal",params:{personalId:t}})};return r(),{normalizedPosts:o,removeLikePost:n,goPersonalPage:f}}};var pe=A(_e,[["render",ie],["__scopeId","data-v-371c1e65"]]);export{pe as default};