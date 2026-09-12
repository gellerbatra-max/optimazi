/* Optimazi — shared nav + footer injection + ambient contours (interior pages) */
(function(){
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var yr = new Date().getFullYear();

  /* fixed contour canvas */
  var cv = document.getElementById("cont");
  if(!cv){ cv = document.createElement("canvas"); cv.id = "cont"; cv.setAttribute("aria-hidden","true"); document.body.insertBefore(cv, document.body.firstChild); }

  /* nav (menu on the left) */
  var nav = document.createElement("header");
  nav.className = "bar"; nav.id = "bar";
  nav.innerHTML = '<div class="bar__l"><button class="menu" aria-label="Menu"><i></i><i></i></button>'
    + '<a class="navbrand" href="index.html">Optim<span>a</span>zi</a></div>'
    + '<a class="pill" href="contact.html">Book a demo</a>';
  document.body.insertBefore(nav, cv.nextSibling);

  /* full-screen menu */
  var navmenu = document.createElement("div");
  navmenu.className = "navmenu"; navmenu.id = "navmenu"; navmenu.setAttribute("aria-hidden","true");
  navmenu.innerHTML =
      '<canvas class="navmenu__tex" aria-hidden="true"></canvas>'
    + '<div class="navmenu__gallery" aria-hidden="true">'
    +   '<div class="navmenu__col nmc--a">'
    +     '<figure class="nmg"><img src="Gemini_Generated_Image_14g0i814g0i814g0.jpg" alt="" loading="lazy"></figure>'
    +     '<figure class="nmg"><img src="Gemini_Generated_Image_23btiv23btiv23bt.jpg" alt="" loading="lazy"></figure>'
    +   '</div>'
    +   '<div class="navmenu__col nmc--b">'
    +     '<figure class="nmg"><img src="Gemini_Generated_Image_3f4wbx3f4wbx3f4w.jpg" alt="" loading="lazy"></figure>'
    +     '<figure class="nmg"><img src="Gemini_Generated_Image_6gvpdu6gvpdu6gvp.jpg" alt="" loading="lazy"></figure>'
    +   '</div>'
    + '</div>'
    + '<nav class="navmenu__links" aria-label="Pages">'
    +   '<a href="index.html">Home</a>'
    +   '<a href="products.html">Products</a>'
    +   '<a href="our-story.html">Our Story</a>'
    +   '<a href="invest.html">Invest</a>'
    +   '<a href="contact.html">Contact</a>'
    + '</nav>';
  document.body.appendChild(navmenu);
  var menuBtn = nav.querySelector(".menu");
  function setMenu(open){ navmenu.classList.toggle("open",open); menuBtn.classList.toggle("open",open); document.body.classList.toggle("menu-open",open); menuBtn.setAttribute("aria-expanded",open?"true":"false"); navmenu.setAttribute("aria-hidden",open?"false":"true"); if(open){ mrun=true; requestAnimationFrame(mDraw); } else { mrun=false; } }
  menuBtn.addEventListener("click", function(){ setMenu(!navmenu.classList.contains("open")); });
  navmenu.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ setMenu(false); }); });
  document.addEventListener("keydown", function(e){ if(e.key==="Escape" && navmenu.classList.contains("open")) setMenu(false); });
  /* photo columns counter-slide on the Y axis with the cursor — slow, subtle ease (Lando) */
  var colA=navmenu.querySelector(".nmc--a"), colB=navmenu.querySelector(".nmc--b"), mTgtY=0, mCurY=0;
  navmenu.addEventListener("mousemove", function(e){ mTgtY=(innerHeight/2 - e.clientY)*0.25; });
  navmenu.addEventListener("mouseleave", function(){ mTgtY=0; });
  /* mark the current page's link */
  (function(){ var f=(location.pathname.split("/").pop()||"index.html"); if(!f) f="index.html";
    navmenu.querySelectorAll(".navmenu__links a").forEach(function(a){ if(a.getAttribute("href")===f) a.classList.add("cur"); }); })();
  /* animated blob texture on the menu ground (runs only while open) */
  var mtex=navmenu.querySelector(".navmenu__tex"), mctx=mtex.getContext("2d"), mrun=false;
  var mMS={1:[3,2],2:[2,1],3:[3,1],4:[0,1],5:[0,3,2,1],6:[0,2],7:[0,3],8:[0,3],9:[0,2],10:[0,1,2,3],11:[0,1],12:[3,1],13:[1,2],14:[3,2]};
  function mEP(e,pt,pr,pb,pl){return e===0?pt:e===1?pr:e===2?pb:pl;}
  function mDraw(ts){ if(!mrun) return; var DPR=Math.min(2,window.devicePixelRatio||1),W=innerWidth,H=innerHeight;
    if(mtex.width!==W*DPR||mtex.height!==H*DPR){ mtex.width=W*DPR; mtex.height=H*DPR; mtex.style.width=W+"px"; mtex.style.height=H+"px"; }
    mctx.setTransform(DPR,0,0,DPR,0,0); mctx.clearRect(0,0,W,H);
    var T=(ts||0)*.00012, CELL=Math.max(40,Math.min(64,Math.round(W/26))), gc=Math.ceil(W/CELL)+3, gr=Math.ceil(H/CELL)+3, g=new Float32Array(gc*gr),i,j,x,y;
    for(j=0;j<gr;j++){ for(i=0;i<gc;i++){ x=i*CELL; y=j*CELL; g[j*gc+i]=Math.sin(x*.006+T*1.4)+Math.sin(y*.0082-T*1.1)+Math.sin((x+y)*.005+T)+.6*Math.sin((x-y)*.0091-T*.8); } }
    var LEV=[-2.7,-1.8,-.9,0,.9,1.8,2.7],li,L;
    for(li=0;li<LEV.length;li++){ L=LEV[li]; mctx.strokeStyle=(li===3)?"rgba(255,93,46,.08)":"rgba(221,225,210,.06)"; mctx.lineWidth=1.1; mctx.beginPath();
      for(y=0;y<gr-1;y++){ for(x=0;x<gc-1;x++){ var tl=g[y*gc+x],tr=g[y*gc+x+1],br=g[(y+1)*gc+x+1],bl=g[(y+1)*gc+x]; var ci=(tl>L?8:0)|(tr>L?4:0)|(br>L?2:0)|(bl>L?1:0); if(ci===0||ci===15) continue;
        var X=x*CELL,Y=y*CELL, pt=[X+CELL*(L-tl)/(tr-tl),Y], pr=[X+CELL,Y+CELL*(L-tr)/(br-tr)], pb=[X+CELL*(L-bl)/(br-bl),Y+CELL], pl=[X,Y+CELL*(L-tl)/(bl-tl)];
        var seg=mMS[ci],si; for(si=0;si<seg.length;si+=2){ var a=mEP(seg[si],pt,pr,pb,pl),z=mEP(seg[si+1],pt,pr,pb,pl); mctx.moveTo(a[0],a[1]); mctx.lineTo(z[0],z[1]); } } }
      mctx.stroke();
    }
    if(colA){ mCurY+=(mTgtY-mCurY)*0.16; colA.style.transform="translate3d(0,"+mCurY.toFixed(2)+"px,0)"; colB.style.transform="translate3d(0,"+(-mCurY).toFixed(2)+"px,0)"; }
    requestAnimationFrame(mDraw);
  }

  /* mega footer */
  var foot = document.createElement("footer");
  foot.className = "megafoot";
  foot.innerHTML =
      '<div class="megafoot__panel">'
  +   '<div class="megafoot__top"><div class="megafoot__word">OPTI<span>MAZI</span></div></div>'
  +   '<div class="mf-w">'
  +     '<div class="megafoot__hl">'
  +       '<h2>Fighting to use every line of <em>Fabric</em><br>to Improve <em>Profitability</em></h2></div>'
  +     '<div class="megafoot__mid">'
  +       '<nav class="megafoot__col" aria-label="Pages"><h4>Pages</h4>'
  +         '<a href="index.html">Home</a><a href="products.html">Products</a><a href="our-story.html">Our Story</a>'
  +         '<a href="invest.html">Invest</a><a href="contact.html">Contact</a></nav>'
  +       '<div class="megafoot__vid"><video autoplay muted loop playsinline preload="auto"><source src="videos/3.mp4" type="video/mp4"></video></div>'
  +       '<nav class="megafoot__col right" aria-label="Social"><h4>Follow on</h4>'
  +         '<a href="#">LinkedIn</a><a href="#">Instagram</a><a href="#">YouTube</a><a href="#">X</a></nav></div>'
  +     '<div class="megafoot__enq"><a class="megafoot__pill" href="mailto:info@gelianfashion.com">Business enquiries <span>&#8599;</span></a></div>'
  +   '</div>'
  + '</div>'
  + '<div class="megafoot__copy">&copy; ' + yr + ' Gelian (Pvt) Ltd<br>All rights reserved.</div>'
  + '<div class="megafoot__legal"><a href="#">Privacy Policy</a><span aria-hidden="true">&middot;</span><a href="#">Terms</a></div>';
  document.body.appendChild(foot);

  /* footer panel outline — drawn as a real path sized to the panel's pixels,
     so straight edges stretch but the top/bottom-centre tabs + corners stay fixed */
  (function(){
    var panel = foot.querySelector(".megafoot__panel"); if(!panel) return;
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS,"svg");
    svg.setAttribute("class","megafoot__frame"); svg.setAttribute("preserveAspectRatio","none"); svg.setAttribute("aria-hidden","true");
    var path = document.createElementNS(NS,"path"); path.setAttribute("vector-effect","non-scaling-stroke");
    svg.appendChild(path); panel.insertBefore(svg, panel.firstChild);

    /* topographic texture — light contours over the olive card, dark contours shading the orange frame */
    function contours(ctx, W, H, mainCol, zeroCol){
      var DPR=Math.min(2, window.devicePixelRatio||1);
      ctx.canvas.width=W*DPR; ctx.canvas.height=H*DPR; ctx.canvas.style.width=W+"px"; ctx.canvas.style.height=H+"px";
      ctx.setTransform(DPR,0,0,DPR,0,0); ctx.clearRect(0,0,W,H);
      var MS={1:[3,2],2:[2,1],3:[3,1],4:[0,1],5:[0,3,2,1],6:[0,2],7:[0,3],8:[0,3],9:[0,2],10:[0,1,2,3],11:[0,1],12:[3,1],13:[1,2],14:[3,2]};
      function EP(e,pt,pr,pb,pl){return e===0?pt:e===1?pr:e===2?pb:pl;}
      var CELL=Math.max(30,Math.min(48,Math.round(W/26)));
      var gc=Math.ceil(W/CELL)+3, gr=Math.ceil(H/CELL)+3, g=new Float32Array(gc*gr),i,j,x,y;
      for(j=0;j<gr;j++){ for(i=0;i<gc;i++){ x=i*CELL; y=j*CELL; g[j*gc+i]=Math.sin(x*.006)+Math.sin(y*.0082)+Math.sin((x+y)*.005)+.6*Math.sin((x-y)*.0091); } }
      var LEV=[-2.7,-1.8,-.9,0,.9,1.8,2.7],li,L;
      for(li=0;li<LEV.length;li++){ L=LEV[li];
        ctx.strokeStyle=(li===3)?zeroCol:mainCol; ctx.lineWidth=1.6; ctx.beginPath();
        for(y=0;y<gr-1;y++){ for(x=0;x<gc-1;x++){
          var tl=g[y*gc+x],tr=g[y*gc+x+1],br=g[(y+1)*gc+x+1],bl=g[(y+1)*gc+x];
          var ci=(tl>L?8:0)|(tr>L?4:0)|(br>L?2:0)|(bl>L?1:0); if(ci===0||ci===15) continue;
          var X=x*CELL,Y=y*CELL,
            pt=[X+CELL*(L-tl)/(tr-tl),Y], pr=[X+CELL,Y+CELL*(L-tr)/(br-tr)],
            pb=[X+CELL*(L-bl)/(br-bl),Y+CELL], pl=[X,Y+CELL*(L-tl)/(bl-tl)];
          var seg=MS[ci],si; for(si=0;si<seg.length;si+=2){ var a=EP(seg[si],pt,pr,pb,pl),z=EP(seg[si+1],pt,pr,pb,pl); ctx.moveTo(a[0],a[1]); ctx.lineTo(z[0],z[1]); } }
        }
        ctx.stroke();
      }
    }
    var ctex=document.createElement("canvas"); ctex.className="megafoot__tex"; ctex.setAttribute("aria-hidden","true");
    panel.insertBefore(ctex, svg.nextSibling); var cctx=ctex.getContext("2d");
    var ftex=document.createElement("canvas"); ftex.className="megafoot__ftex"; ftex.setAttribute("aria-hidden","true");
    foot.insertBefore(ftex, foot.firstChild); var fctx=ftex.getContext("2d");

    function build(){
      var W = panel.clientWidth, H = panel.clientHeight; if(!W || !H) return;
      var rise = parseFloat(getComputedStyle(panel).getPropertyValue("--rise")) || 20;
      var st = 2, R = 13, cx = W/2, TH = H + 2*rise;
      var tH = Math.max(170, Math.min(440, W*0.40))/2, bH = Math.max(300, Math.min(880, W*0.72))/2, s = Math.min(30, W*0.028);
      var L = st, Rt = W - st, yTop = st, yT = rise, yB = rise + H, yBot = TH - st;
      var d = "M"+L+","+(yT+R)
        + "Q"+L+","+yT+" "+(L+R)+","+yT
        + "L"+(cx-tH-s)+","+yT
        + "C"+(cx-tH-s*0.45)+","+yT+" "+(cx-tH-s*0.55)+","+yTop+" "+(cx-tH)+","+yTop
        + "L"+(cx+tH)+","+yTop
        + "C"+(cx+tH+s*0.55)+","+yTop+" "+(cx+tH+s*0.45)+","+yT+" "+(cx+tH+s)+","+yT
        + "L"+(Rt-R)+","+yT
        + "Q"+Rt+","+yT+" "+Rt+","+(yT+R)
        + "L"+Rt+","+(yB-R)
        + "Q"+Rt+","+yB+" "+(Rt-R)+","+yB
        + "L"+(cx+bH+s)+","+yB
        + "C"+(cx+bH+s*0.45)+","+yB+" "+(cx+bH+s*0.55)+","+yBot+" "+(cx+bH)+","+yBot
        + "L"+(cx-bH)+","+yBot
        + "C"+(cx-bH-s*0.55)+","+yBot+" "+(cx-bH-s*0.45)+","+yB+" "+(cx-bH-s)+","+yB
        + "L"+(L+R)+","+yB
        + "Q"+L+","+yB+" "+L+","+(yB-R)
        + "Z";
      svg.setAttribute("viewBox","0 0 "+W+" "+TH);
      svg.setAttribute("width",W); svg.setAttribute("height",TH);
      path.setAttribute("d",d);
      var sc = parseFloat((getComputedStyle(panel).transform.match(/matrix\(\s*([-\d.]+)/)||[0,0.94])[1]) || 0.94;
      panel.style.marginBottom = Math.round(-(1-sc) * H) + "px"; /* reclaim the space the scale leaves below */
      contours(cctx, W, TH, "rgba(244,244,237,.06)", "rgba(255,93,46,.09)");
      ctex.style.clipPath = "path('"+d+"')"; ctex.style.webkitClipPath = "path('"+d+"')";
      var MW = foot.clientWidth, MH = foot.clientHeight;
      if(MW && MH) contours(fctx, MW, MH, "rgba(28,12,4,.05)", "rgba(28,12,4,.07)");
    }
    build();
    if("ResizeObserver" in window){ new ResizeObserver(build).observe(panel); }
    window.addEventListener("resize", build);
    window.addEventListener("load", build);
    setTimeout(build,300); setTimeout(build,1200);

    /* hide the top nav once the footer card comes into view */
    if("IntersectionObserver" in window){
      new IntersectionObserver(function(es){
        es.forEach(function(e){ nav.classList.toggle("bar--gone", e.isIntersecting); });
      }, {threshold:0.06}).observe(panel);
    }
  })();

  /* mark current page active in footer + highlight */
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  foot.querySelectorAll('.megafoot__col a').forEach(function(a){
    if((a.getAttribute("href")||"").toLowerCase() === here){ a.style.color = "var(--pop)"; }
  });

  /* nav bg on scroll */
  window.addEventListener("scroll", function(){ nav.classList.toggle("scrolled", window.pageYOffset > 60); }, {passive:true});

  /* reveal on scroll */
  var rls = document.querySelectorAll(".rl");
  if("IntersectionObserver" in window && !reduce && rls.length){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); }, {threshold:.15, rootMargin:"0px 0px -6% 0px"});
    rls.forEach(function(el){ el.style.opacity=0; el.style.transform="translateY(24px)"; el.style.transition="opacity .8s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1)";
      io.observe(el); });
    var st=document.createElement("style"); st.textContent=".rl.in{opacity:1!important;transform:none!important}"; document.head.appendChild(st);
  }

  /* ambient topographic contours (fixed); colours are theme-driven via CSS vars */
  var ctx = cv.getContext("2d"), W, H, mx=.5, my=.5;
  var _cs=getComputedStyle(document.documentElement);
  var contInk=(_cs.getPropertyValue("--cont-ink").trim())||"rgba(233,242,250,.05)";
  var contPop=(_cs.getPropertyValue("--cont-pop").trim())||"rgba(255,93,46,.09)";
  function size(){ var DPR=Math.min(2,window.devicePixelRatio||1); W=innerWidth; H=innerHeight; cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  window.addEventListener("resize", size); size();
  window.addEventListener("mousemove", function(e){ mx=e.clientX/innerWidth; my=e.clientY/innerHeight; }, {passive:true});
  var LEV=[-2.7,-1.8,-.9,0,.9,1.8,2.7], MS={1:[3,2],2:[2,1],3:[3,1],4:[0,1],5:[0,3,2,1],6:[0,2],7:[0,3],8:[0,3],9:[0,2],10:[0,1,2,3],11:[0,1],12:[3,1],13:[1,2],14:[3,2]};
  function fld(x,y,T){ return Math.sin(x*.006+T*1.5)+Math.sin(y*.0082-T*1.2)+Math.sin((x+y)*.005+T)+.6*Math.sin((x-y)*.0091-T*.8); }
  function EP(e,pt,pr,pb,pl){ return e===0?pt:e===1?pr:e===2?pb:pl; }
  function draw(ts){ ctx.clearRect(0,0,W,H);
    var T=(ts||0)*.00028, ox=(mx-.5)*30, oy=(my-.5)*22, sy=window.pageYOffset*.12;
    var CELL=Math.max(44,Math.min(64,Math.round(W/29))), gc=Math.ceil(W/CELL)+3, gr=Math.ceil(H/CELL)+3, g=new Float32Array(gc*gr),i,j,x,y;
    for(j=0;j<gr;j++){ for(i=0;i<gc;i++){ g[j*gc+i]=fld(i*CELL-ox, j*CELL-oy+sy, T); } }
    for(var li=0;li<LEV.length;li++){ var L=LEV[li]; ctx.strokeStyle=(li===3)?contPop:contInk; ctx.lineWidth=1.1; ctx.beginPath();
      for(y=0;y<gr-1;y++){ for(x=0;x<gc-1;x++){ var tl=g[y*gc+x],tr=g[y*gc+x+1],br=g[(y+1)*gc+x+1],bl=g[(y+1)*gc+x]; var ci=(tl>L?8:0)|(tr>L?4:0)|(br>L?2:0)|(bl>L?1:0); if(ci===0||ci===15) continue;
        var X=x*CELL,Y=y*CELL, pt=[X+CELL*(L-tl)/(tr-tl),Y],pr=[X+CELL,Y+CELL*(L-tr)/(br-tr)],pb=[X+CELL*(L-bl)/(br-bl),Y+CELL],pl=[X,Y+CELL*(L-tl)/(bl-tl)];
        var seg=MS[ci]; for(var s=0;s<seg.length;s+=2){ var a=EP(seg[s],pt,pr,pb,pl),z=EP(seg[s+1],pt,pr,pb,pl); ctx.moveTo(a[0],a[1]); ctx.lineTo(z[0],z[1]); } } }
      ctx.stroke();
    }
  }
  if(reduce){ draw(0); } else { var run=true; var loop=function(ts){ if(run){ draw(ts); requestAnimationFrame(loop); } }; requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", function(){ run=!document.hidden; if(run) requestAnimationFrame(loop); }); }
})();

/* white-space blob texture (animated, fades out toward the bottom) — as on the home page; runs only if a .blankTex canvas is present */
(function(){
  var cv=document.querySelector(".blankTex"); if(!cv) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sec=cv.parentElement, ctx=cv.getContext("2d"), W=0, H=0;
  var MS={1:[3,2],2:[2,1],3:[3,1],4:[0,1],5:[0,3,2,1],6:[0,2],7:[0,3],8:[0,3],9:[0,2],10:[0,1,2,3],11:[0,1],12:[3,1],13:[1,2],14:[3,2]};
  function EP(e,pt,pr,pb,pl){return e===0?pt:e===1?pr:e===2?pb:pl;}
  function size(){ var DPR=Math.min(2,window.devicePixelRatio||1); W=sec.clientWidth; H=sec.clientHeight; cv.width=W*DPR; cv.height=H*DPR; cv.style.width=W+"px"; cv.style.height=H+"px"; ctx.setTransform(DPR,0,0,DPR,0,0); }
  function draw(ts){
    if(!W||!H) return;
    var T=(ts||0)*.00013;
    ctx.clearRect(0,0,W,H);
    var CELL=Math.max(34,Math.min(56,Math.round(W/28)));
    var gc=Math.ceil(W/CELL)+3, gr=Math.ceil(H/CELL)+3, g=new Float32Array(gc*gr),i,j,x,y;
    for(j=0;j<gr;j++){ for(i=0;i<gc;i++){ x=i*CELL; y=j*CELL; g[j*gc+i]=Math.sin(x*.006+T*1.4)+Math.sin(y*.0082-T*1.1)+Math.sin((x+y)*.005+T)+.6*Math.sin((x-y)*.0091-T*.8); } }
    var LEV=[-2.7,-1.8,-.9,0,.9,1.8,2.7],li,L;
    for(li=0;li<LEV.length;li++){ L=LEV[li];
      ctx.strokeStyle="rgba(42,40,32,.15)"; ctx.lineWidth=1.15; ctx.beginPath();
      for(y=0;y<gr-1;y++){ for(x=0;x<gc-1;x++){
        var tl=g[y*gc+x],tr=g[y*gc+x+1],br=g[(y+1)*gc+x+1],bl=g[(y+1)*gc+x];
        var ci=(tl>L?8:0)|(tr>L?4:0)|(br>L?2:0)|(bl>L?1:0); if(ci===0||ci===15) continue;
        var X=x*CELL,Y=y*CELL, pt=[X+CELL*(L-tl)/(tr-tl),Y], pr=[X+CELL,Y+CELL*(L-tr)/(br-tr)], pb=[X+CELL*(L-bl)/(br-bl),Y+CELL], pl=[X,Y+CELL*(L-tl)/(bl-tl)];
        var seg=MS[ci],si; for(si=0;si<seg.length;si+=2){ var a=EP(seg[si],pt,pr,pb,pl),z=EP(seg[si+1],pt,pr,pb,pl); ctx.moveTo(a[0],a[1]); ctx.lineTo(z[0],z[1]); } } }
      ctx.stroke();
    }
  }
  size(); if("ResizeObserver" in window){ new ResizeObserver(size).observe(sec); } addEventListener("resize", size);
  if(reduce){ draw(0); }
  else { var run=true; var loop=function(ts){ if(run){ draw(ts); requestAnimationFrame(loop); } }; requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", function(){ run=!document.hidden; if(run) requestAnimationFrame(loop); }); }
})();
