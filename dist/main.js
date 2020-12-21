(()=>{"use strict";const e=(e,t)=>{for(const o in t)e.setAttribute(o,t[o])},t="REORDER",o="ADD TO BAG",i=["https://images.unsplash.com/photo-1512654448383-47b2fe224e44?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1559753491-c7db50a61c74?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1589942151968-89bfe5d60c61?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1562413255-16d008a3532b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1512654448383-47b2fe224e44?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1559753491-c7db50a61c74?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1589942151968-89bfe5d60c61?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1562413255-16d008a3532b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1512654448383-47b2fe224e44?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1559753491-c7db50a61c74?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1589942151968-89bfe5d60c61?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1562413255-16d008a3532b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1512654448383-47b2fe224e44?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1559753491-c7db50a61c74?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1589942151968-89bfe5d60c61?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80","https://images.unsplash.com/photo-1562413255-16d008a3532b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"],n=document.getElementById("main-container"),d=document.getElementById("favorites-container"),a=document.getElementById("food-item-template"),c=document.getElementById("bag-count"),s=document.querySelector(".cart svg path"),l=document.getElementById("search-text"),m=document.getElementById("search"),r=document.getElementById("remove"),u=document.getElementById("categories"),f=document.getElementById("food-items-container"),p=document.getElementById("food-page-container-wrapper"),h=document.getElementById("navigate-back"),x=document.getElementById("selected-food-button"),w=document.getElementById("selected-food-count-decrement"),g=document.getElementById("selected-food-count-increment"),y=document.getElementById("no-dish"),b=document.getElementById("favorites-loader"),B=document.getElementById("food-items-loader"),D=document.getElementById("categories-loader");let E,C,H=[],M=[],v=[],L=0,G=-1;const q=()=>{L+=1,I()},I=()=>{L?(c.textContent=L,c.hidden=!1,s.setAttribute("fill","#FAA92A")):(c.textContent=0,c.hidden=!0,s.setAttribute("fill","#ABABAB"))},A=()=>{const e=C.querySelector(".add-cart"),t=C.querySelector(".update-item"),o=C.querySelector(".update-item .item-count");E.itemCount&&E.itemCount>0?(e.hidden=!0,o.textContent=E.itemCount,t.classList.remove("hidden")):(e.hidden=!1,t.classList.add("hidden"))},j=(e,t,o,i)=>{1===e.itemCount?(e.itemCount=0,o.classList.add("hidden"),t.hidden=!1):(e.itemCount-=1,i.textContent=e.itemCount),L>0&&(L-=1),I()},S=(e,t,o)=>{null==e.itemCount&&(e.itemCount=0),e.itemCount=1,t.hidden=!0,o.classList.remove("hidden"),q()},V=(e,t)=>{e.itemCount+=1,t.textContent=e.itemCount,q()},W=(d,c)=>{d.image=i[c];const s=a.content.cloneNode(!0),l=s.querySelector(".item .image img");e(l,{src:d.image,alt:d.name,title:d.name,loading:"lazy"});const m=s.querySelector(".item .description");s.querySelector(".item .description .details-name").textContent=d.name,s.querySelector(".item .description .details-price").textContent=`₹${d.price}`;const r=s.querySelector(".item .description .add-cart");r.textContent=d.isFavourite?t:o;const u=s.querySelector(".item .description .update-item"),f=s.querySelector(".item .description .update-item .decrement"),w=s.querySelector(".item .description .update-item .increment"),g=s.querySelector(".item .description .update-item .item-count");return d.itemCount&&d.itemCount>0?(r.hidden=!0,u.classList.remove("hidden"),g.textContent=d.itemCount):g.textContent=1,l.addEventListener("click",(()=>{E=d,C=m,(()=>{n.hidden=!0,p.classList.remove("hidden"),h.classList.remove("hidden");const i=document.getElementById("selected-food-image");e(i,{src:E.image,alt:E.name,title:E.name});const d=document.getElementById("selected-food-name"),a=document.getElementById("selected-food-price"),c=document.getElementById("selected-food-update-item"),s=document.getElementById("selected-food-count"),l=document.getElementById("selected-food-category"),m=document.getElementById("selected-food-ratings"),r=document.getElementById("selected-food-details");d.textContent=E.name,a.textContent=`₹${E.price}`,x.textContent=E.isFavourite?t:o,l.textContent=`Category: ${E.category}`;const u=E.rating.toFixed(1);m.textContent=`${u} Rating, (${E.reviews} Reviews)`,r.textContent=E.details,E.itemCount&&E.itemCount>0?(x.hidden=!0,c.classList.contains("hidden")&&c.classList.remove("hidden"),s.textContent=E.itemCount):(x.hidden=!1,c.classList.contains("hidden")||c.classList.add("hidden"),s.textContent=1)})()})),f.addEventListener("click",(()=>{j(d,r,u,g)})),w.addEventListener("click",(()=>{V(d,g)})),r.addEventListener("click",(()=>{S(d,r,u)})),s.querySelector(".item")},X=e=>{const t=f.children;t&&t.length>1&&((e=[])=>{for(let t=e.length-1;t>0;t--)f.removeChild(e[t])})(t),B.style.display="inherit",(e||M).forEach(((e,t)=>{const o=W(e,t);f.appendChild(o)})),B.style.display="none"},Y=()=>{try{const e=l.value;let t;e&&e.length&&(t=M.filter((t=>t.name.toLowerCase().includes(e.toLowerCase())))),G>-1&&(t=(t||M).filter((e=>e.category===H[G].name))),t&&!t.length?y.hidden=!1:y.hidden=!0,X(t)}catch(e){console.log(e)}},k=function(e,t){let o;return function(){let t=this,i=arguments;clearTimeout(o),o=setTimeout((()=>{e.apply(t,i)}),200)}}((e=>{let t=e.target.value;t=t?t.trim():null,r.hidden=!t,l.value=t,13===e.keyCode&&Y()}));l.addEventListener("keyup",k),m.addEventListener("click",(()=>{const e=l.value;e&&e.length&&Y()})),r.addEventListener("click",(()=>{l.value=null,r.hidden=!0,Y()})),w.addEventListener("click",(()=>{j(E,x,document.getElementById("selected-food-update-item"),document.getElementById("selected-food-count")),A()})),g.addEventListener("click",(()=>{V(E,document.getElementById("selected-food-count")),A()})),x.addEventListener("click",(()=>{S(E,x,document.getElementById("selected-food-update-item")),A()})),h.addEventListener("click",(()=>{n.hidden=!1,p.classList.add("hidden"),h.classList.add("hidden")})),(async()=>{try{const t=await fetch("http://temp.dash.zeta.in/food.php"),o=await t.json();H=o.categories||[],M=o.recipes||[],v=JSON.parse(JSON.stringify(M.filter((e=>e.isFavourite)))),v.forEach(((e,t)=>{const o=W(e,t);d.appendChild(o)})),b.style.display="none",H.forEach(((t,o)=>{const i=((t,o)=>{const i=document.createElement("div");i.classList.add("categories-item");const n=document.createElement("figure");n.classList.add("categories-item-icon");const d=document.createElement("img");e(d,{src:t.image,alt:t.name,title:t.name}),n.appendChild(d);const a=document.createElement("span");return a.classList.add("categories-item-name"),a.textContent=t.name,i.appendChild(n),i.appendChild(a),i.addEventListener("click",(()=>{-1===G?(G=o,i.classList.add("active")):G===o?(G=-1,i.classList.remove("active")):(u.children[G].classList.remove("active"),G=o,i.classList.add("active")),Y()})),i})(t,o);u.appendChild(i)})),D.style.display="none",X()}catch(e){console.log(e)}})()})();