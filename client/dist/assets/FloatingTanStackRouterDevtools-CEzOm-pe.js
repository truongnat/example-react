import{c as ue,a as Ge,b as z,u as xt,S as mt,d as q,t as L,i as g,m as Z,e as O,f as d,g as Q,s,h as Ze,j as Te,k as Ct,l as St,n as Qe,o as wt,r as Ye,p as gt,q as Ft,v as zt,w as Mt,D as Ut,x as Bt}from"./index-DIgHvqHW.js";const Et=typeof window>"u";function qe(e){const t={pending:"yellow",success:"green",error:"red",notFound:"purple",redirected:"gray"};return e.isFetching&&e.status==="success"?e.isFetching==="beforeLoad"?"purple":"blue":t[e.status]}function Dt(e,t){const n=e.find(i=>i.routeId===t.id);return n?qe(n):"gray"}function Ot(){const[e,t]=ue(!1);return(Et?Ge:z)(()=>{t(!0)}),e}const It=e=>{const t=Object.getOwnPropertyNames(Object(e)),n=typeof e=="bigint"?`${e.toString()}n`:e;try{return JSON.stringify(n,t)}catch{return"unable to stringify"}};function Gt(e,t=[n=>n]){return e.map((n,i)=>[n,i]).sort(([n,i],[p,o])=>{for(const a of t){const c=a(n),u=a(p);if(typeof c>"u"){if(typeof u>"u")continue;return 1}if(c!==u)return c>u?1:-1}return i-o}).map(([n])=>n)}let Tt={data:""},Pt=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||Tt,At=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Lt=/\/\*[^]*?\*\/|  +/g,pt=/\n+/g,_e=(e,t)=>{let n="",i="",p="";for(let o in e){let a=e[o];o[0]=="@"?o[1]=="i"?n=o+" "+a+";":i+=o[1]=="f"?_e(a,o):o+"{"+_e(a,o[1]=="k"?"":t)+"}":typeof a=="object"?i+=_e(a,t?t.replace(/([^,])+/g,c=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,u=>/&/.test(u)?u.replace(/&/g,c):c?c+" "+u:u)):o):a!=null&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),p+=_e.p?_e.p(o,a):o+":"+a+";")}return n+(t&&p?t+"{"+p+"}":p)+i},he={},bt=e=>{if(typeof e=="object"){let t="";for(let n in e)t+=n+bt(e[n]);return t}return e},Rt=(e,t,n,i,p)=>{let o=bt(e),a=he[o]||(he[o]=(u=>{let l=0,r=11;for(;l<u.length;)r=101*r+u.charCodeAt(l++)>>>0;return"go"+r})(o));if(!he[a]){let u=o!==e?e:(l=>{let r,$,v=[{}];for(;r=At.exec(l.replace(Lt,""));)r[4]?v.shift():r[3]?($=r[3].replace(pt," ").trim(),v.unshift(v[0][$]=v[0][$]||{})):v[0][r[1]]=r[2].replace(pt," ").trim();return v[0]})(e);he[a]=_e(p?{["@keyframes "+a]:u}:u,n?"":"."+a)}let c=n&&he.g?he.g:null;return n&&(he.g=he[a]),((u,l,r,$)=>{$?l.data=l.data.replace($,u):l.data.indexOf(u)===-1&&(l.data=r?u+l.data:l.data+u)})(he[a],t,i,c),a},jt=(e,t,n)=>e.reduce((i,p,o)=>{let a=t[o];if(a&&a.call){let c=a(n),u=c&&c.props&&c.props.className||/^go/.test(c)&&c;a=u?"."+u:c&&typeof c=="object"?c.props?"":_e(c,""):c===!1?"":c}return i+p+(a??"")},"");function ze(e){let t=this||{},n=e.call?e(t.p):e;return Rt(n.unshift?n.raw?jt(n,[].slice.call(arguments,1),t.p):n.reduce((i,p)=>Object.assign(i,p&&p.call?p(t.p):p),{}):n,Pt(t.target),t.g,t.o,t.k)}ze.bind({g:1});ze.bind({k:1});const D={colors:{inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000000",white:"#ffffff",neutral:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},darkGray:{50:"#525c7a",100:"#49536e",200:"#414962",300:"#394056",400:"#313749",500:"#292e3d",600:"#212530",700:"#191c24",800:"#111318",900:"#0b0d10"},gray:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},blue:{25:"#F5FAFF",50:"#EFF8FF",100:"#D1E9FF",200:"#B2DDFF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",800:"#1849A9",900:"#194185"},green:{25:"#F6FEF9",50:"#ECFDF3",100:"#D1FADF",200:"#A6F4C5",300:"#6CE9A6",400:"#32D583",500:"#12B76A",600:"#039855",700:"#027A48",800:"#05603A",900:"#054F31"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},yellow:{25:"#FFFCF5",50:"#FFFAEB",100:"#FEF0C7",200:"#FEDF89",300:"#FEC84B",400:"#FDB022",500:"#F79009",600:"#DC6803",700:"#B54708",800:"#93370D",900:"#7A2E0E"},purple:{25:"#FAFAFF",50:"#F4F3FF",100:"#EBE9FE",200:"#D9D6FE",300:"#BDB4FE",400:"#9B8AFB",500:"#7A5AF8",600:"#6938EF",700:"#5925DC",800:"#4A1FB8",900:"#3E1C96"},teal:{25:"#F6FEFC",50:"#F0FDF9",100:"#CCFBEF",200:"#99F6E0",300:"#5FE9D0",400:"#2ED3B7",500:"#15B79E",600:"#0E9384",700:"#107569",800:"#125D56",900:"#134E48"},pink:{25:"#fdf2f8",50:"#fce7f3",100:"#fbcfe8",200:"#f9a8d4",300:"#f472b6",400:"#ec4899",500:"#db2777",600:"#be185d",700:"#9d174d",800:"#831843",900:"#500724"},cyan:{25:"#ecfeff",50:"#cffafe",100:"#a5f3fc",200:"#67e8f9",300:"#22d3ee",400:"#06b6d4",500:"#0891b2",600:"#0e7490",700:"#155e75",800:"#164e63",900:"#083344"}},alpha:{90:"e5",70:"b3",20:"33"},font:{size:{"2xs":"calc(var(--tsrd-font-size) * 0.625)",xs:"calc(var(--tsrd-font-size) * 0.75)",sm:"calc(var(--tsrd-font-size) * 0.875)",md:"var(--tsrd-font-size)"},lineHeight:{xs:"calc(var(--tsrd-font-size) * 1)",sm:"calc(var(--tsrd-font-size) * 1.25)"},weight:{normal:"400",medium:"500",semibold:"600",bold:"700"},fontFamily:{sans:"ui-sans-serif, Inter, system-ui, sans-serif, sans-serif",mono:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"}},border:{radius:{xs:"calc(var(--tsrd-font-size) * 0.125)",sm:"calc(var(--tsrd-font-size) * 0.25)",md:"calc(var(--tsrd-font-size) * 0.375)",full:"9999px"}},size:{0:"0px",.5:"calc(var(--tsrd-font-size) * 0.125)",1:"calc(var(--tsrd-font-size) * 0.25)",1.5:"calc(var(--tsrd-font-size) * 0.375)",2:"calc(var(--tsrd-font-size) * 0.5)",2.5:"calc(var(--tsrd-font-size) * 0.625)",3:"calc(var(--tsrd-font-size) * 0.75)",3.5:"calc(var(--tsrd-font-size) * 0.875)",4:"calc(var(--tsrd-font-size) * 1)",5:"calc(var(--tsrd-font-size) * 1.25)",8:"calc(var(--tsrd-font-size) * 2)"}},Ht=e=>{const{colors:t,font:n,size:i,alpha:p,border:o}=D,{fontFamily:a,lineHeight:c,size:u}=n,l=e?ze.bind({target:e}):ze;return{devtoolsPanelContainer:l`
      direction: ltr;
      position: fixed;
      bottom: 0;
      right: 0;
      z-index: 99999;
      width: 100%;
      max-height: 90%;
      border-top: 1px solid ${t.gray[700]};
      transform-origin: top;
    `,devtoolsPanelContainerVisibility:r=>l`
        visibility: ${r?"visible":"hidden"};
      `,devtoolsPanelContainerResizing:r=>r()?l`
          transition: none;
        `:l`
        transition: all 0.4s ease;
      `,devtoolsPanelContainerAnimation:(r,$)=>r?l`
          pointer-events: auto;
          transform: translateY(0);
        `:l`
        pointer-events: none;
        transform: translateY(${$}px);
      `,logo:l`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      border: none;
      font-family: ${a.sans};
      gap: ${D.size[.5]};
      padding: 0px;
      &:hover {
        opacity: 0.7;
      }
      &:focus-visible {
        outline-offset: 4px;
        border-radius: ${o.radius.xs};
        outline: 2px solid ${t.blue[800]};
      }
    `,tanstackLogo:l`
      font-size: ${n.size.md};
      font-weight: ${n.weight.bold};
      line-height: ${n.lineHeight.xs};
      white-space: nowrap;
      color: ${t.gray[300]};
    `,routerLogo:l`
      font-weight: ${n.weight.semibold};
      font-size: ${n.size.xs};
      background: linear-gradient(to right, #84cc16, #10b981);
      background-clip: text;
      -webkit-background-clip: text;
      line-height: 1;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    `,devtoolsPanel:l`
      display: flex;
      font-size: ${u.sm};
      font-family: ${a.sans};
      background-color: ${t.darkGray[700]};
      color: ${t.gray[300]};

      @media (max-width: 700px) {
        flex-direction: column;
      }
      @media (max-width: 600px) {
        font-size: ${u.xs};
      }
    `,dragHandle:l`
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 4px;
      cursor: row-resize;
      z-index: 100000;
      &:hover {
        background-color: ${t.purple[400]}${p[90]};
      }
    `,firstContainer:l`
      flex: 1 1 500px;
      min-height: 40%;
      max-height: 100%;
      overflow: auto;
      border-right: 1px solid ${t.gray[700]};
      display: flex;
      flex-direction: column;
    `,routerExplorerContainer:l`
      overflow-y: auto;
      flex: 1;
    `,routerExplorer:l`
      padding: ${D.size[2]};
    `,row:l`
      display: flex;
      align-items: center;
      padding: ${D.size[2]} ${D.size[2.5]};
      gap: ${D.size[2.5]};
      border-bottom: ${t.darkGray[500]} 1px solid;
      align-items: center;
    `,detailsHeader:l`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: ${t.darkGray[600]};
      padding: 0px ${D.size[2]};
      font-weight: ${n.weight.medium};
      font-size: ${n.size.xs};
      min-height: ${D.size[8]};
      line-height: ${n.lineHeight.xs};
      text-align: left;
      display: flex;
      align-items: center;
    `,maskedBadge:l`
      background: ${t.yellow[900]}${p[70]};
      color: ${t.yellow[300]};
      display: inline-block;
      padding: ${D.size[0]} ${D.size[2.5]};
      border-radius: ${o.radius.full};
      font-size: ${n.size.xs};
      font-weight: ${n.weight.normal};
      border: 1px solid ${t.yellow[300]};
    `,maskedLocation:l`
      color: ${t.yellow[300]};
    `,detailsContent:l`
      padding: ${D.size[1.5]} ${D.size[2]};
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: ${n.size.xs};
    `,routeMatchesToggle:l`
      display: flex;
      align-items: center;
      border: 1px solid ${t.gray[500]};
      border-radius: ${o.radius.sm};
      overflow: hidden;
    `,routeMatchesToggleBtn:(r,$)=>{const b=[l`
        appearance: none;
        border: none;
        font-size: 12px;
        padding: 4px 8px;
        background: transparent;
        cursor: pointer;
        font-family: ${a.sans};
        font-weight: ${n.weight.medium};
      `];if(r){const x=l`
          background: ${t.darkGray[400]};
          color: ${t.gray[300]};
        `;b.push(x)}else{const x=l`
          color: ${t.gray[500]};
          background: ${t.darkGray[800]}${p[20]};
        `;b.push(x)}return $&&b.push(l`
          border-right: 1px solid ${D.colors.gray[500]};
        `),b},detailsHeaderInfo:l`
      flex: 1;
      justify-content: flex-end;
      display: flex;
      align-items: center;
      font-weight: ${n.weight.normal};
      color: ${t.gray[400]};
    `,matchRow:r=>{const v=[l`
        display: flex;
        border-bottom: 1px solid ${t.darkGray[400]};
        cursor: pointer;
        align-items: center;
        padding: ${i[1]} ${i[2]};
        gap: ${i[2]};
        font-size: ${u.xs};
        color: ${t.gray[300]};
      `];if(r){const b=l`
          background: ${t.darkGray[500]};
        `;v.push(b)}return v},matchIndicator:r=>{const v=[l`
        flex: 0 0 auto;
        width: ${i[3]};
        height: ${i[3]};
        background: ${t[r][900]};
        border: 1px solid ${t[r][500]};
        border-radius: ${o.radius.full};
        transition: all 0.25s ease-out;
        box-sizing: border-box;
      `];if(r==="gray"){const b=l`
          background: ${t.gray[700]};
          border-color: ${t.gray[400]};
        `;v.push(b)}return v},matchID:l`
      flex: 1;
      line-height: ${c.xs};
    `,ageTicker:r=>{const v=[l`
        display: flex;
        gap: ${i[1]};
        font-size: ${u.xs};
        color: ${t.gray[400]};
        font-variant-numeric: tabular-nums;
        line-height: ${c.xs};
      `];if(r){const b=l`
          color: ${t.yellow[400]};
        `;v.push(b)}return v},secondContainer:l`
      flex: 1 1 500px;
      min-height: 40%;
      max-height: 100%;
      overflow: auto;
      border-right: 1px solid ${t.gray[700]};
      display: flex;
      flex-direction: column;
    `,thirdContainer:l`
      flex: 1 1 500px;
      overflow: auto;
      display: flex;
      flex-direction: column;
      height: 100%;
      border-right: 1px solid ${t.gray[700]};

      @media (max-width: 700px) {
        border-top: 2px solid ${t.gray[700]};
      }
    `,fourthContainer:l`
      flex: 1 1 500px;
      min-height: 40%;
      max-height: 100%;
      overflow: auto;
      display: flex;
      flex-direction: column;
    `,routesContainer:l`
      overflow-x: auto;
      overflow-y: visible;
    `,routesRowContainer:(r,$)=>{const b=[l`
        display: flex;
        border-bottom: 1px solid ${t.darkGray[400]};
        align-items: center;
        padding: ${i[1]} ${i[2]};
        gap: ${i[2]};
        font-size: ${u.xs};
        color: ${t.gray[300]};
        cursor: ${$?"pointer":"default"};
        line-height: ${c.xs};
      `];if(r){const x=l`
          background: ${t.darkGray[500]};
        `;b.push(x)}return b},routesRow:r=>{const v=[l`
        flex: 1 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: ${u.xs};
        line-height: ${c.xs};
      `];if(!r){const b=l`
          color: ${t.gray[400]};
        `;v.push(b)}return v},routesRowInner:l`
      display: 'flex';
      align-items: 'center';
      flex-grow: 1;
      min-width: 0;
    `,routeParamInfo:l`
      color: ${t.gray[400]};
      font-size: ${u.xs};
      line-height: ${c.xs};
    `,nestedRouteRow:r=>l`
        margin-left: ${r?0:i[3.5]};
        border-left: ${r?"":`solid 1px ${t.gray[700]}`};
      `,code:l`
      font-size: ${u.xs};
      line-height: ${c.xs};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,matchesContainer:l`
      flex: 1 1 auto;
      overflow-y: auto;
    `,cachedMatchesContainer:l`
      flex: 1 1 auto;
      overflow-y: auto;
      max-height: 50%;
    `,maskedBadgeContainer:l`
      flex: 1;
      justify-content: flex-end;
      display: flex;
    `,matchDetails:l`
      display: flex;
      flex-direction: column;
      padding: ${D.size[2]};
      font-size: ${D.font.size.xs};
      color: ${D.colors.gray[300]};
      line-height: ${D.font.lineHeight.sm};
    `,matchStatus:(r,$)=>{const b=$&&r==="success"?$==="beforeLoad"?"purple":"blue":{pending:"yellow",success:"green",error:"red",notFound:"purple",redirected:"gray"}[r];return l`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        border-radius: ${D.border.radius.sm};
        font-weight: ${D.font.weight.normal};
        background-color: ${D.colors[b][900]}${D.alpha[90]};
        color: ${D.colors[b][300]};
        border: 1px solid ${D.colors[b][600]};
        margin-bottom: ${D.size[2]};
        transition: all 0.25s ease-out;
      `},matchDetailsInfo:l`
      display: flex;
      justify-content: flex-end;
      flex: 1;
    `,matchDetailsInfoLabel:l`
      display: flex;
    `,mainCloseBtn:l`
      background: ${t.darkGray[700]};
      padding: ${i[1]} ${i[2]} ${i[1]} ${i[1.5]};
      border-radius: ${o.radius.md};
      position: fixed;
      z-index: 99999;
      display: inline-flex;
      width: fit-content;
      cursor: pointer;
      appearance: none;
      border: 0;
      gap: 8px;
      align-items: center;
      border: 1px solid ${t.gray[500]};
      font-size: ${n.size.xs};
      cursor: pointer;
      transition: all 0.25s ease-out;

      &:hover {
        background: ${t.darkGray[500]};
      }
    `,mainCloseBtnPosition:r=>l`
        ${r==="top-left"?`top: ${i[2]}; left: ${i[2]};`:""}
        ${r==="top-right"?`top: ${i[2]}; right: ${i[2]};`:""}
        ${r==="bottom-left"?`bottom: ${i[2]}; left: ${i[2]};`:""}
        ${r==="bottom-right"?`bottom: ${i[2]}; right: ${i[2]};`:""}
      `,mainCloseBtnAnimation:r=>r?l`
        opacity: 0;
        pointer-events: none;
        visibility: hidden;
      `:l`
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
        `,routerLogoCloseButton:l`
      font-weight: ${n.weight.semibold};
      font-size: ${n.size.xs};
      background: linear-gradient(to right, #98f30c, #00f4a3);
      background-clip: text;
      -webkit-background-clip: text;
      line-height: 1;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    `,mainCloseBtnDivider:l`
      width: 1px;
      background: ${D.colors.gray[600]};
      height: 100%;
      border-radius: 999999px;
      color: transparent;
    `,mainCloseBtnIconContainer:l`
      position: relative;
      width: ${i[5]};
      height: ${i[5]};
      background: pink;
      border-radius: 999999px;
      overflow: hidden;
    `,mainCloseBtnIconOuter:l`
      width: ${i[5]};
      height: ${i[5]};
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      filter: blur(3px) saturate(1.8) contrast(2);
    `,mainCloseBtnIconInner:l`
      width: ${i[4]};
      height: ${i[4]};
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `,panelCloseBtn:l`
      position: absolute;
      cursor: pointer;
      z-index: 100001;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      background-color: ${t.darkGray[700]};
      &:hover {
        background-color: ${t.darkGray[500]};
      }

      top: 0;
      right: ${i[2]};
      transform: translate(0, -100%);
      border-right: ${t.darkGray[300]} 1px solid;
      border-left: ${t.darkGray[300]} 1px solid;
      border-top: ${t.darkGray[300]} 1px solid;
      border-bottom: none;
      border-radius: ${o.radius.sm} ${o.radius.sm} 0px 0px;
      padding: ${i[1]} ${i[1.5]} ${i[.5]} ${i[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        top: 100%;
        left: -${i[2.5]};
        height: ${i[1.5]};
        width: calc(100% + ${i[5]});
      }
    `,panelCloseBtnIcon:l`
      color: ${t.gray[400]};
      width: ${i[2]};
      height: ${i[2]};
    `,navigateButton:l`
      background: none;
      border: none;
      padding: 0 0 0 4px;
      margin: 0;
      color: ${t.gray[400]};
      font-size: ${u.md};
      cursor: pointer;
      line-height: 1;
      vertical-align: middle;
      margin-right: 0.5ch;
      flex-shrink: 0;
      &:hover {
        color: ${t.blue[300]};
      }
    `}};function Me(){const e=xt(mt),[t]=ue(Ht(e));return t}const Nt=e=>{try{const t=localStorage.getItem(e);return typeof t=="string"?JSON.parse(t):void 0}catch{return}};function Ne(e,t){const[n,i]=ue();return Ge(()=>{const o=Nt(e);i(typeof o>"u"||o===null?typeof t=="function"?t():t:o)}),[n,o=>{i(a=>{let c=o;typeof o=="function"&&(c=o(a));try{localStorage.setItem(e,JSON.stringify(c))}catch{}return c})}]}var Vt=L('<span><svg xmlns=http://www.w3.org/2000/svg width=12 height=12 fill=none viewBox="0 0 24 24"><path stroke=currentColor stroke-linecap=round stroke-linejoin=round stroke-width=2 d="M9 18l6-6-6-6">'),Re=L("<div>"),Yt=L("<button><span> "),qt=L("<div><div><button> [<!> ... <!>]"),Jt=L("<button><span></span> 🔄 "),Kt=L("<span>:"),Wt=L("<span>");const vt=({expanded:e,style:t={}})=>{const n=yt();return(()=>{var i=Vt(),p=i.firstChild;return z(o=>{var a=n().expander,c=Q(n().expanderIcon(e));return a!==o.e&&d(i,o.e=a),c!==o.t&&s(p,"class",o.t=c),o},{e:void 0,t:void 0}),i})()};function Zt(e,t){if(t<1)return[];let n=0;const i=[];for(;n<e.length;)i.push(e.slice(n,n+t)),n=n+t;return i}function Qt(e){return Symbol.iterator in e}function Fe({value:e,defaultExpanded:t,pageSize:n=100,filterSubEntries:i,...p}){const[o,a]=ue(!!t),c=()=>a(S=>!S),u=q(()=>typeof e()),l=q(()=>{let S=[];const oe=C=>{const h=t===!0?{[C.label]:!0}:t?.[C.label];return{...C,value:()=>C.value,defaultExpanded:h}};return Array.isArray(e())?S=e().map((C,h)=>oe({label:h.toString(),value:C})):e()!==null&&typeof e()=="object"&&Qt(e())&&typeof e()[Symbol.iterator]=="function"?S=Array.from(e(),(C,h)=>oe({label:h.toString(),value:C})):typeof e()=="object"&&e()!==null&&(S=Object.entries(e()).map(([C,h])=>oe({label:C,value:h}))),i?i(S):S}),r=q(()=>Zt(l(),n)),[$,v]=ue([]),[b,x]=ue(void 0),w=yt(),R=()=>{x(e()())},J=S=>O(Fe,Te({value:e,filterSubEntries:i},p,S));return(()=>{var S=Re();return g(S,(()=>{var oe=Z(()=>!!r().length);return()=>oe()?[(()=>{var C=Yt(),h=C.firstChild,G=h.firstChild;return C.$$click=()=>c(),g(C,O(vt,{get expanded(){return o()??!1}}),h),g(C,()=>p.label,h),g(h,()=>String(u).toLowerCase()==="iterable"?"(Iterable) ":"",G),g(h,()=>l().length,G),g(h,()=>l().length>1?"items":"item",null),z(ie=>{var se=w().expandButton,F=w().info;return se!==ie.e&&d(C,ie.e=se),F!==ie.t&&d(h,ie.t=F),ie},{e:void 0,t:void 0}),C})(),Z(()=>Z(()=>!!(o()??!1))()?Z(()=>r().length===1)()?(()=>{var C=Re();return g(C,()=>l().map((h,G)=>J(h))),z(()=>d(C,w().subEntries)),C})():(()=>{var C=Re();return g(C,()=>r().map((h,G)=>(()=>{var ie=qt(),se=ie.firstChild,F=se.firstChild,K=F.firstChild,ge=K.nextSibling,ce=ge.nextSibling,de=ce.nextSibling;return de.nextSibling,F.$$click=()=>v(H=>H.includes(G)?H.filter(X=>X!==G):[...H,G]),g(F,O(vt,{get expanded(){return $().includes(G)}}),K),g(F,G*n,ge),g(F,G*n+n-1,de),g(se,(()=>{var H=Z(()=>!!$().includes(G));return()=>H()?(()=>{var X=Re();return g(X,()=>h.map(ne=>J(ne))),z(()=>d(X,w().subEntries)),X})():null})(),null),z(H=>{var X=w().entry,ne=Q(w().labelButton,"labelButton");return X!==H.e&&d(se,H.e=X),ne!==H.t&&d(F,H.t=ne),H},{e:void 0,t:void 0}),ie})())),z(()=>d(C,w().subEntries)),C})():null)]:(()=>{var C=Z(()=>u()==="function");return()=>C()?O(Fe,{get label(){return(()=>{var h=Jt(),G=h.firstChild;return h.$$click=R,g(G,()=>p.label),z(()=>d(h,w().refreshValueBtn)),h})()},value:b,defaultExpanded:{}}):[(()=>{var h=Kt(),G=h.firstChild;return g(h,()=>p.label,G),h})()," ",(()=>{var h=Wt();return g(h,()=>It(e())),z(()=>d(h,w().value)),h})()]})()})()),z(()=>d(S,w().entry)),S})()}const Xt=e=>{const{colors:t,font:n,size:i}=D,{fontFamily:p,lineHeight:o,size:a}=n,c=e?ze.bind({target:e}):ze;return{entry:c`
      font-family: ${p.mono};
      font-size: ${a.xs};
      line-height: ${o.sm};
      outline: none;
      word-break: break-word;
    `,labelButton:c`
      cursor: pointer;
      color: inherit;
      font: inherit;
      outline: inherit;
      background: transparent;
      border: none;
      padding: 0;
    `,expander:c`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: ${i[3]};
      height: ${i[3]};
      padding-left: 3px;
      box-sizing: content-box;
    `,expanderIcon:u=>u?c`
          transform: rotate(90deg);
          transition: transform 0.1s ease;
        `:c`
        transform: rotate(0deg);
        transition: transform 0.1s ease;
      `,expandButton:c`
      display: flex;
      gap: ${i[1]};
      align-items: center;
      cursor: pointer;
      color: inherit;
      font: inherit;
      outline: inherit;
      background: transparent;
      border: none;
      padding: 0;
    `,value:c`
      color: ${t.purple[400]};
    `,subEntries:c`
      margin-left: ${i[2]};
      padding-left: ${i[2]};
      border-left: 2px solid ${t.darkGray[400]};
    `,info:c`
      color: ${t.gray[500]};
      font-size: ${a["2xs"]};
      padding-left: ${i[1]};
    `,refreshValueBtn:c`
      appearance: none;
      border: 0;
      cursor: pointer;
      background: transparent;
      color: inherit;
      padding: 0;
      font-family: ${p.mono};
      font-size: ${a.xs};
    `}};function yt(){const e=xt(mt),[t]=ue(Xt(e));return t}Ze(["click"]);var er=L("<div><div></div><div>/</div><div></div><div>/</div><div>");function Ve(e){const t=["s","min","h","d"],n=[e/1e3,e/6e4,e/36e5,e/864e5];let i=0;for(let o=1;o<n.length&&!(n[o]<1);o++)i=o;return new Intl.NumberFormat(navigator.language,{compactDisplay:"short",notation:"compact",maximumFractionDigits:0}).format(n[i])+t[i]}function Je({match:e,router:t}){const n=Me();if(!e)return null;const i=t().looseRoutesById[e.routeId];if(!i.options.loader)return null;const p=Date.now()-e.updatedAt,o=i.options.staleTime??t().options.defaultStaleTime??0,a=i.options.gcTime??t().options.defaultGcTime??30*60*1e3;return(()=>{var c=er(),u=c.firstChild,l=u.nextSibling,r=l.nextSibling,$=r.nextSibling,v=$.nextSibling;return g(u,()=>Ve(p)),g(r,()=>Ve(o)),g(v,()=>Ve(a)),z(()=>d(c,Q(n().ageTicker(p>o)))),c})()}var tr=L("<button type=button>➔");function Ke({to:e,params:t,search:n,router:i}){const p=Me();return(()=>{var o=tr();return o.$$click=a=>{a.stopPropagation(),i().navigate({to:e,params:t,search:n})},s(o,"title",`Navigate to ${e}`),z(()=>d(o,p().navigateButton)),o})()}Ze(["click"]);var rr=L("<button><div>TANSTACK</div><div>TanStack Router v1"),ir=L("<div><div>"),nr=L("<code> "),je=L("<code>"),lr=L("<div><div role=button><div>"),He=L("<div>"),or=L('<div><button><svg xmlns=http://www.w3.org/2000/svg width=10 height=6 fill=none viewBox="0 0 10 6"><path stroke=currentColor stroke-linecap=round stroke-linejoin=round stroke-width=1.667 d="M1 1l4 4 4-4"></path></svg></button><div><div></div><div><div></div></div></div><div><div><div><span>Pathname</span></div><div><code></code></div><div><div><button type=button>Routes</button><button type=button>Matches</button></div><div><div>age / staleTime / gcTime</div></div></div><div>'),sr=L("<div><span>masked"),ht=L("<div role=button><div>"),ar=L("<div><div><div>Cached Matches</div><div>age / staleTime / gcTime</div></div><div>"),dr=L("<div><div>Match Details</div><div><div><div><div></div></div><div><div>ID:</div><div><code></code></div></div><div><div>State:</div><div></div></div><div><div>Last Updated:</div><div></div></div></div></div><div>Explorer</div><div>"),cr=L("<div>Loader Data"),fr=L("<div><div>Search Params</div><div>");function ur(e){const{className:t,...n}=e,i=Me();return(()=>{var p=rr(),o=p.firstChild,a=o.nextSibling;return Qe(p,Te(n,{get class(){return Q(i().logo,t?t():"")}}),!1,!0),z(c=>{var u=i().tanstackLogo,l=i().routerLogo;return u!==c.e&&d(o,c.e=u),l!==c.t&&d(a,c.t=l),c},{e:void 0,t:void 0}),p})()}function We(e){return(()=>{var t=ir(),n=t.firstChild;return t.style.setProperty("display","flex"),t.style.setProperty("align-items","center"),t.style.setProperty("width","100%"),g(t,()=>e.left,n),n.style.setProperty("flex-grow","1"),n.style.setProperty("min-width","0"),g(n,()=>e.children),g(t,()=>e.right,null),z(()=>d(t,e.class)),t})()}function kt({routerState:e,router:t,route:n,isRoot:i,activeId:p,setActiveId:o}){const a=Me(),c=q(()=>e().pendingMatches||e().matches),u=q(()=>e().matches.find($=>$.routeId===n.id)),l=q(()=>{var $,v;try{if(($=u())!=null&&$.params){const b=(v=u())==null?void 0:v.params,x=n.path||gt(n.id);if(x.startsWith("$")){const w=x.slice(1);if(b[w])return`(${b[w]})`}}return""}catch{return""}}),r=q(()=>{if(i||!n.path)return;const $=Object.assign({},...c().map(b=>b.params)),v=Ft({path:n.fullPath,params:$,leaveWildcards:!1,leaveParams:!1,decodeCharMap:t().pathParamsDecodeCharMap});return v.isMissingParams?void 0:v.interpolatedPath});return(()=>{var $=lr(),v=$.firstChild,b=v.firstChild;return v.$$click=()=>{u()&&o(p()===n.id?"":n.id)},g(v,O(We,{get class(){return Q(a().routesRow(!!u()))},get left(){return O(zt,{get when(){return r()},children:x=>O(Ke,{get to(){return x()},router:t})})},get right(){return O(Je,{get match(){return u()},router:t})},get children(){return[(()=>{var x=nr(),w=x.firstChild;return g(x,()=>i?Ye:n.path||gt(n.id),w),z(()=>d(x,a().code)),x})(),(()=>{var x=je();return g(x,l),z(()=>d(x,a().routeParamInfo)),x})()]}}),null),g($,(()=>{var x=Z(()=>{var w;return!!((w=n.children)!=null&&w.length)});return()=>x()?(()=>{var w=He();return g(w,()=>[...n.children].sort((R,J)=>R.rank-J.rank).map(R=>O(kt,{routerState:e,router:t,route:R,activeId:p,setActiveId:o}))),z(()=>d(w,a().nestedRouteRow(!!i))),w})():null})(),null),z(x=>{var w=`Open match details for ${n.id}`,R=Q(a().routesRowContainer(n.id===p(),!!u())),J=Q(a().matchIndicator(Dt(c(),n)));return w!==x.e&&s(v,"aria-label",x.e=w),R!==x.t&&d(v,x.t=R),J!==x.a&&d(b,x.a=J),x},{e:void 0,t:void 0,a:void 0}),$})()}const gr=function({...t}){const{isOpen:n=!0,setIsOpen:i,handleDragStart:p,router:o,routerState:a,shadowDOMTarget:c,...u}=t,{onCloseClick:l}=Ct(),r=Me(),{className:$,style:v,...b}=u;St(o);const[x,w]=Ne("tanstackRouterDevtoolsShowMatches",!0),[R,J]=Ne("tanstackRouterDevtoolsActiveRouteId",""),S=q(()=>[...a().pendingMatches??[],...a().matches,...a().cachedMatches].find(K=>K.routeId===R()||K.id===R())),oe=q(()=>Object.keys(a().location.search).length),C=q(()=>({...o(),state:a()})),h=q(()=>Object.fromEntries(Gt(Object.keys(C()),["state","routesById","routesByPath","flatRoutes","options","manifest"].map(F=>K=>K!==F)).map(F=>[F,C()[F]]).filter(F=>typeof F[1]!="function"&&!["__store","basepath","injectedHtml","subscribers","latestLoadPromise","navigateTimeout","resetNextScroll","tempLocationKey","latestLocation","routeTree","history"].includes(F[0])))),G=q(()=>{var F;return(F=S())==null?void 0:F.loaderData}),ie=q(()=>S()),se=q(()=>a().location.search);return(()=>{var F=or(),K=F.firstChild,ge=K.firstChild,ce=K.nextSibling,de=ce.firstChild,H=de.nextSibling,X=H.firstChild,ne=ce.nextSibling,Ce=ne.firstChild,pe=Ce.firstChild;pe.firstChild;var B=pe.nextSibling,V=B.firstChild,W=B.nextSibling,N=W.firstChild,Y=N.firstChild,ee=Y.nextSibling,I=N.nextSibling,te=W.nextSibling;return Qe(F,Te({get class(){return Q(r().devtoolsPanel,"TanStackRouterDevtoolsPanel",$?$():"")},get style(){return v?v():""}},b),!1,!0),g(F,p?(()=>{var f=He();return wt(f,"mousedown",p,!0),z(()=>d(f,r().dragHandle)),f})():null,K),K.$$click=f=>{i&&i(!1),l(f)},g(de,O(ur,{"aria-hidden":!0,onClick:f=>{i&&i(!1),l(f)}})),g(X,O(Fe,{label:"Router",value:h,defaultExpanded:{state:{},context:{},options:{}},filterSubEntries:f=>f.filter(k=>typeof k.value()!="function")})),g(pe,(()=>{var f=Z(()=>!!a().location.maskedLocation);return()=>f()?(()=>{var k=sr(),U=k.firstChild;return z(T=>{var y=r().maskedBadgeContainer,j=r().maskedBadge;return y!==T.e&&d(k,T.e=y),j!==T.t&&d(U,T.t=j),T},{e:void 0,t:void 0}),k})():null})(),null),g(V,()=>a().location.pathname),g(B,(()=>{var f=Z(()=>!!a().location.maskedLocation);return()=>f()?(()=>{var k=je();return g(k,()=>{var U;return(U=a().location.maskedLocation)==null?void 0:U.pathname}),z(()=>d(k,r().maskedLocation)),k})():null})(),null),Y.$$click=()=>{w(!1)},ee.$$click=()=>{w(!0)},g(te,(()=>{var f=Z(()=>!x());return()=>f()?O(kt,{routerState:a,router:o,get route(){return o().routeTree},isRoot:!0,activeId:R,setActiveId:J}):(()=>{var k=He();return g(k,()=>{var U,T;return(T=(U=a().pendingMatches)!=null&&U.length?a().pendingMatches:a().matches)==null?void 0:T.map((y,j)=>(()=>{var _=ht(),P=_.firstChild;return _.$$click=()=>J(R()===y.id?"":y.id),g(_,O(We,{get left(){return O(Ke,{get to(){return y.pathname},get params(){return y.params},get search(){return y.search},router:o})},get right(){return O(Je,{match:y,router:o})},get children(){var A=je();return g(A,()=>`${y.routeId===Ye?Ye:y.pathname}`),z(()=>d(A,r().matchID)),A}}),null),z(A=>{var E=`Open match details for ${y.id}`,ae=Q(r().matchRow(y===S())),re=Q(r().matchIndicator(qe(y)));return E!==A.e&&s(_,"aria-label",A.e=E),ae!==A.t&&d(_,A.t=ae),re!==A.a&&d(P,A.a=re),A},{e:void 0,t:void 0,a:void 0}),_})())}),k})()})()),g(ne,(()=>{var f=Z(()=>!!a().cachedMatches.length);return()=>f()?(()=>{var k=ar(),U=k.firstChild,T=U.firstChild,y=T.nextSibling,j=U.nextSibling;return g(j,()=>a().cachedMatches.map(_=>(()=>{var P=ht(),A=P.firstChild;return P.$$click=()=>J(R()===_.id?"":_.id),g(P,O(We,{get left(){return O(Ke,{get to(){return _.pathname},get params(){return _.params},get search(){return _.search},router:o})},get right(){return O(Je,{match:_,router:o})},get children(){var E=je();return g(E,()=>`${_.id}`),z(()=>d(E,r().matchID)),E}}),null),z(E=>{var ae=`Open match details for ${_.id}`,re=Q(r().matchRow(_===S())),fe=Q(r().matchIndicator(qe(_)));return ae!==E.e&&s(P,"aria-label",E.e=ae),re!==E.t&&d(P,E.t=re),fe!==E.a&&d(A,E.a=fe),E},{e:void 0,t:void 0,a:void 0}),P})())),z(_=>{var P=r().cachedMatchesContainer,A=r().detailsHeader,E=r().detailsHeaderInfo;return P!==_.e&&d(k,_.e=P),A!==_.t&&d(U,_.t=A),E!==_.a&&d(y,_.a=E),_},{e:void 0,t:void 0,a:void 0}),k})():null})(),null),g(F,(()=>{var f=Z(()=>{var k;return!!(S()&&((k=S())!=null&&k.status))});return()=>f()?(()=>{var k=dr(),U=k.firstChild,T=U.nextSibling,y=T.firstChild,j=y.firstChild,_=j.firstChild,P=j.nextSibling,A=P.firstChild,E=A.nextSibling,ae=E.firstChild,re=P.nextSibling,fe=re.firstChild,$e=fe.nextSibling,xe=re.nextSibling,be=xe.firstChild,me=be.nextSibling,ve=T.nextSibling,ye=ve.nextSibling;return g(_,(()=>{var m=Z(()=>{var M,le;return!!(((M=S())==null?void 0:M.status)==="success"&&((le=S())!=null&&le.isFetching))});return()=>{var M;return m()?"fetching":(M=S())==null?void 0:M.status}})()),g(ae,()=>{var m;return(m=S())==null?void 0:m.id}),g($e,(()=>{var m=Z(()=>{var M;return!!((M=a().pendingMatches)!=null&&M.find(le=>{var ke;return le.id===((ke=S())==null?void 0:ke.id)}))});return()=>m()?"Pending":a().matches.find(M=>{var le;return M.id===((le=S())==null?void 0:le.id)})?"Active":"Cached"})()),g(me,(()=>{var m=Z(()=>{var M;return!!((M=S())!=null&&M.updatedAt)});return()=>{var M;return m()?new Date((M=S())==null?void 0:M.updatedAt).toLocaleTimeString():"N/A"}})()),g(k,(()=>{var m=Z(()=>!!G());return()=>m()?[(()=>{var M=cr();return z(()=>d(M,r().detailsHeader)),M})(),(()=>{var M=He();return g(M,O(Fe,{label:"loaderData",value:G,defaultExpanded:{}})),z(()=>d(M,r().detailsContent)),M})()]:null})(),ve),g(ye,O(Fe,{label:"Match",value:ie,defaultExpanded:{}})),z(m=>{var M,le,ke=r().thirdContainer,Ue=r().detailsHeader,Se=r().matchDetails,Be=r().matchStatus((M=S())==null?void 0:M.status,(le=S())==null?void 0:le.isFetching),Pe=r().matchDetailsInfoLabel,we=r().matchDetailsInfo,Ae=r().matchDetailsInfoLabel,Ee=r().matchDetailsInfo,Le=r().matchDetailsInfoLabel,De=r().matchDetailsInfo,Oe=r().detailsHeader,Ie=r().detailsContent;return ke!==m.e&&d(k,m.e=ke),Ue!==m.t&&d(U,m.t=Ue),Se!==m.a&&d(y,m.a=Se),Be!==m.o&&d(j,m.o=Be),Pe!==m.i&&d(P,m.i=Pe),we!==m.n&&d(E,m.n=we),Ae!==m.s&&d(re,m.s=Ae),Ee!==m.h&&d($e,m.h=Ee),Le!==m.r&&d(xe,m.r=Le),De!==m.d&&d(me,m.d=De),Oe!==m.l&&d(ve,m.l=Oe),Ie!==m.u&&d(ye,m.u=Ie),m},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0}),k})():null})(),null),g(F,(()=>{var f=Z(()=>!!oe());return()=>f()?(()=>{var k=fr(),U=k.firstChild,T=U.nextSibling;return g(T,O(Fe,{value:se,get defaultExpanded(){return Object.keys(a().location.search).reduce((y,j)=>(y[j]={},y),{})}})),z(y=>{var j=r().fourthContainer,_=r().detailsHeader,P=r().detailsContent;return j!==y.e&&d(k,y.e=j),_!==y.t&&d(U,y.t=_),P!==y.a&&d(T,y.a=P),y},{e:void 0,t:void 0,a:void 0}),k})():null})(),null),z(f=>{var k=r().panelCloseBtn,U=r().panelCloseBtnIcon,T=r().firstContainer,y=r().row,j=r().routerExplorerContainer,_=r().routerExplorer,P=r().secondContainer,A=r().matchesContainer,E=r().detailsHeader,ae=r().detailsContent,re=r().detailsHeader,fe=r().routeMatchesToggle,$e=!x(),xe=Q(r().routeMatchesToggleBtn(!x(),!0)),be=x(),me=Q(r().routeMatchesToggleBtn(!!x(),!1)),ve=r().detailsHeaderInfo,ye=Q(r().routesContainer);return k!==f.e&&d(K,f.e=k),U!==f.t&&s(ge,"class",f.t=U),T!==f.a&&d(ce,f.a=T),y!==f.o&&d(de,f.o=y),j!==f.i&&d(H,f.i=j),_!==f.n&&d(X,f.n=_),P!==f.s&&d(ne,f.s=P),A!==f.h&&d(Ce,f.h=A),E!==f.r&&d(pe,f.r=E),ae!==f.d&&d(B,f.d=ae),re!==f.l&&d(W,f.l=re),fe!==f.u&&d(N,f.u=fe),$e!==f.c&&(Y.disabled=f.c=$e),xe!==f.w&&d(Y,f.w=xe),be!==f.m&&(ee.disabled=f.m=be),me!==f.f&&d(ee,f.f=me),ve!==f.y&&d(I,f.y=ve),ye!==f.g&&d(te,f.g=ye),f},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0}),F})()};Ze(["click","mousedown"]);var pr=L('<svg xmlns=http://www.w3.org/2000/svg enable-background="new 0 0 634 633"viewBox="0 0 634 633"><g transform=translate(1)><linearGradient x1=-641.486 x2=-641.486 y1=856.648 y2=855.931 gradientTransform="matrix(633 0 0 -633 406377 542258)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#6bdaff></stop><stop offset=0.319 stop-color=#f9ffb5></stop><stop offset=0.706 stop-color=#ffa770></stop><stop offset=1 stop-color=#ff7373></stop></linearGradient><circle cx=316.5 cy=316.5 r=316.5 fill-rule=evenodd clip-rule=evenodd></circle><defs><filter width=454 height=396.9 x=-137.5 y=412 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=-137.5 y=412 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=89.5 cy=610.5 fill=#015064 fill-rule=evenodd stroke=#00CFE2 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=316.5 y=412 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=316.5 y=412 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=543.5 cy=610.5 fill=#015064 fill-rule=evenodd stroke=#00CFE2 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=-137.5 y=450 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=-137.5 y=450 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=89.5 cy=648.5 fill=#015064 fill-rule=evenodd stroke=#00A8B8 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=316.5 y=450 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=316.5 y=450 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=543.5 cy=648.5 fill=#015064 fill-rule=evenodd stroke=#00A8B8 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=-137.5 y=486 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=-137.5 y=486 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=89.5 cy=684.5 fill=#015064 fill-rule=evenodd stroke=#007782 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=454 height=396.9 x=316.5 y=486 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=454 height=396.9 x=316.5 y=486 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><ellipse cx=543.5 cy=684.5 fill=#015064 fill-rule=evenodd stroke=#007782 stroke-width=25 clip-rule=evenodd rx=214.5 ry=186></ellipse><defs><filter width=176.9 height=129.3 x=272.2 y=308 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=176.9 height=129.3 x=272.2 y=308 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><g><path fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11 d="M436 403.2l-5 28.6m-140-90.3l-10.9 62m52.8-19.4l-4.3 27.1"></path><linearGradient x1=-645.656 x2=-646.499 y1=854.878 y2=854.788 gradientTransform="matrix(-184.159 -32.4722 11.4608 -64.9973 -128419.844 34938.836)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ee2700></stop><stop offset=1 stop-color=#ff008e></stop></linearGradient><path fill-rule=evenodd d="M344.1 363l97.7 17.2c5.8 2.1 8.2 6.2 7.1 12.1-1 5.9-4.7 9.2-11 9.9l-106-18.7-57.5-59.2c-3.2-4.8-2.9-9.1.8-12.8 3.7-3.7 8.3-4.4 13.7-2.1l55.2 53.6z"clip-rule=evenodd></path><path fill=#D8D8D8 fill-rule=evenodd stroke=#FFF stroke-linecap=round stroke-linejoin=bevel stroke-width=7 d="M428.3 384.5l.9-6.5m-33.9 1.5l.9-6.5m-34 .5l.9-6.1m-38.9-16.1l4.2-3.9m-25.2-16.1l4.2-3.9"clip-rule=evenodd></path></g><defs><filter width=280.6 height=317.4 x=73.2 y=113.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=280.6 height=317.4 x=73.2 y=113.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><g><linearGradient x1=-646.8 x2=-646.8 y1=854.844 y2=853.844 gradientTransform="matrix(-100.1751 48.8587 -97.9753 -200.879 19124.773 203538.61)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#a17500></stop><stop offset=1 stop-color=#5d2100></stop></linearGradient><path fill-rule=evenodd d="M192.3 203c8.1 37.3 14 73.6 17.8 109.1 3.8 35.4 2.8 75.2-2.9 119.2l61.2-16.7c-15.6-59-25.2-97.9-28.6-116.6-3.4-18.7-10.8-51.8-22.2-99.6l-25.3 4.6"clip-rule=evenodd></path><linearGradient x1=-635.467 x2=-635.467 y1=852.115 y2=851.115 gradientTransform="matrix(92.6873 4.8575 2.0257 -38.6535 57323.695 36176.047)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M195 183.9s-12.6-22.1-36.5-29.9c-15.9-5.2-34.4-1.5-55.5 11.1 15.9 14.3 29.5 22.6 40.7 24.9 16.8 3.6 51.3-6.1 51.3-6.1z"clip-rule=evenodd></path><linearGradient x1=-636.573 x2=-636.573 y1=855.444 y2=854.444 gradientTransform="matrix(109.9945 5.7646 6.3597 -121.3507 64719.133 107659.336)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5s-47.5-8.5-83.2 15.7c-23.8 16.2-34.3 49.3-31.6 99.3 30.3-27.8 52.1-48.5 65.2-61.9 19.8-20 49.6-53.1 49.6-53.1z"clip-rule=evenodd></path><linearGradient x1=-632.145 x2=-632.145 y1=854.174 y2=853.174 gradientTransform="matrix(62.9558 3.2994 3.5021 -66.8246 37035.367 59284.227)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M195 183.9c-.8-21.9 6-38 20.6-48.2 14.6-10.2 29.8-15.3 45.5-15.3-6.1 21.4-14.5 35.8-25.2 43.4-10.7 7.5-24.4 14.2-40.9 20.1z"clip-rule=evenodd></path><linearGradient x1=-638.224 x2=-638.224 y1=853.801 y2=852.801 gradientTransform="matrix(152.4666 7.9904 3.0934 -59.0251 94939.86 55646.855)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5c31.9-30 64.1-39.7 96.7-29 32.6 10.7 50.8 30.4 54.6 59.1-35.2-5.5-60.4-9.6-75.8-12.1-15.3-2.6-40.5-8.6-75.5-18z"clip-rule=evenodd></path><linearGradient x1=-637.723 x2=-637.723 y1=855.103 y2=854.103 gradientTransform="matrix(136.467 7.1519 5.2165 -99.5377 82830.875 89859.578)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5c35.8-7.6 65.6-.2 89.2 22 23.6 22.2 37.7 49 42.3 80.3-39.8-9.7-68.3-23.8-85.5-42.4-17.2-18.5-32.5-38.5-46-59.9z"clip-rule=evenodd></path><linearGradient x1=-631.79 x2=-631.79 y1=855.872 y2=854.872 gradientTransform="matrix(60.8683 3.19 8.7771 -167.4773 31110.818 145537.61)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#2f8a00></stop><stop offset=1 stop-color=#90ff57></stop></linearGradient><path fill-rule=evenodd stroke=#2F8A00 stroke-width=13 d="M194.9 184.5c-33.6 13.8-53.6 35.7-60.1 65.6-6.5 29.9-3.6 63.1 8.7 99.6 27.4-40.3 43.2-69.6 47.4-88 4.2-18.3 5.5-44.1 4-77.2z"clip-rule=evenodd></path><path fill=none stroke=#2F8A00 stroke-linecap=round stroke-width=8 d="M196.5 182.3c-14.8 21.6-25.1 41.4-30.8 59.4-5.7 18-9.4 33-11.1 45.1"></path><path fill=none stroke=#2F8A00 stroke-linecap=round stroke-width=8 d="M194.8 185.7c-24.4 1.7-43.8 9-58.1 21.8-14.3 12.8-24.7 25.4-31.3 37.8m99.1-68.9c29.7-6.7 52-8.4 67-5 15 3.4 26.9 8.7 35.8 15.9m-110.8-5.9c20.3 9.9 38.2 20.5 53.9 31.9 15.7 11.4 27.4 22.1 35.1 32"></path></g><defs><filter width=532 height=633 x=50.5 y=399 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=532 height=633 x=50.5 y=399 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><linearGradient x1=-641.104 x2=-641.278 y1=856.577 y2=856.183 gradientTransform="matrix(532 0 0 -633 341484.5 542657)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#fff400></stop><stop offset=1 stop-color=#3c8700></stop></linearGradient><ellipse cx=316.5 cy=715.5 fill-rule=evenodd clip-rule=evenodd rx=266 ry=316.5></ellipse><defs><filter width=288 height=283 x=391 y=-24 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"></feColorMatrix></filter></defs><mask width=288 height=283 x=391 y=-24 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#FFF fill-rule=evenodd clip-rule=evenodd></circle></g></mask><g><g transform="translate(397 -24)"><linearGradient x1=-1036.672 x2=-1036.672 y1=880.018 y2=879.018 gradientTransform="matrix(227 0 0 -227 235493 199764)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffdf00></stop><stop offset=1 stop-color=#ff9d00></stop></linearGradient><circle cx=168.5 cy=113.5 r=113.5 fill-rule=evenodd clip-rule=evenodd></circle><linearGradient x1=-1017.329 x2=-1018.602 y1=658.003 y2=657.998 gradientTransform="matrix(30 0 0 -1 30558 771)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M30 113H0"></path><linearGradient x1=-1014.501 x2=-1015.774 y1=839.985 y2=839.935 gradientTransform="matrix(26.5 0 0 -5.5 26925 4696.5)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M33.5 79.5L7 74"></path><linearGradient x1=-1016.59 x2=-1017.862 y1=852.671 y2=852.595 gradientTransform="matrix(29 0 0 -8 29523 6971)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M34 146l-29 8"></path><linearGradient x1=-1011.984 x2=-1013.257 y1=863.523 y2=863.229 gradientTransform="matrix(24 0 0 -13 24339 11407)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M45 177l-24 13"></path><linearGradient x1=-1006.673 x2=-1007.946 y1=869.279 y2=868.376 gradientTransform="matrix(20 0 0 -19 20205 16720)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M67 204l-20 19"></path><linearGradient x1=-992.85 x2=-993.317 y1=871.258 y2=870.258 gradientTransform="matrix(13.8339 0 0 -22.8467 13825.796 20131.938)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M94.4 227l-13.8 22.8"></path><linearGradient x1=-953.835 x2=-953.965 y1=871.9 y2=870.9 gradientTransform="matrix(7.5 0 0 -24.5 7278 21605)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M127.5 243.5L120 268"></path><linearGradient x1=244.504 x2=244.496 y1=871.898 y2=870.898 gradientTransform="matrix(.5 0 0 -24.5 45.5 21614)"gradientUnits=userSpaceOnUse><stop offset=0 stop-color=#ffa400></stop><stop offset=1 stop-color=#ff5e00></stop></linearGradient><path fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12 d="M167.5 252.5l.5 24.5">');function $t(){const e=Mt();return(()=>{var t=pr(),n=t.firstChild,i=n.firstChild,p=i.nextSibling,o=p.nextSibling,a=o.firstChild,c=o.nextSibling,u=c.firstChild,l=c.nextSibling,r=l.nextSibling,$=r.firstChild,v=r.nextSibling,b=v.firstChild,x=v.nextSibling,w=x.nextSibling,R=w.firstChild,J=w.nextSibling,S=J.firstChild,oe=J.nextSibling,C=oe.nextSibling,h=C.firstChild,G=C.nextSibling,ie=G.firstChild,se=G.nextSibling,F=se.nextSibling,K=F.firstChild,ge=F.nextSibling,ce=ge.firstChild,de=ge.nextSibling,H=de.nextSibling,X=H.firstChild,ne=H.nextSibling,Ce=ne.firstChild,pe=ne.nextSibling,B=pe.nextSibling,V=B.firstChild,W=B.nextSibling,N=W.firstChild,Y=W.nextSibling,ee=Y.firstChild,I=ee.nextSibling,te=I.nextSibling,f=Y.nextSibling,k=f.firstChild,U=f.nextSibling,T=U.firstChild,y=U.nextSibling,j=y.firstChild,_=j.nextSibling,P=_.nextSibling,A=P.nextSibling,E=A.nextSibling,ae=E.nextSibling,re=ae.nextSibling,fe=re.nextSibling,$e=fe.nextSibling,xe=$e.nextSibling,be=xe.nextSibling,me=be.nextSibling,ve=me.nextSibling,ye=ve.nextSibling,m=y.nextSibling,M=m.firstChild,le=m.nextSibling,ke=le.firstChild,Ue=le.nextSibling,Se=Ue.nextSibling,Be=Se.nextSibling,Pe=Be.firstChild,we=Be.nextSibling,Ae=we.firstChild,Ee=we.nextSibling,Le=Ee.firstChild,De=Le.firstChild,Oe=De.nextSibling,Ie=Oe.nextSibling,Xe=Ie.nextSibling,et=Xe.nextSibling,tt=et.nextSibling,rt=tt.nextSibling,it=rt.nextSibling,nt=it.nextSibling,lt=nt.nextSibling,ot=lt.nextSibling,st=ot.nextSibling,at=st.nextSibling,dt=at.nextSibling,ct=dt.nextSibling,ft=ct.nextSibling,ut=ft.nextSibling,_t=ut.nextSibling;return s(i,"id",`a-${e}`),s(p,"fill",`url(#a-${e})`),s(a,"id",`b-${e}`),s(c,"id",`c-${e}`),s(u,"filter",`url(#b-${e})`),s(l,"mask",`url(#c-${e})`),s($,"id",`d-${e}`),s(v,"id",`e-${e}`),s(b,"filter",`url(#d-${e})`),s(x,"mask",`url(#e-${e})`),s(R,"id",`f-${e}`),s(J,"id",`g-${e}`),s(S,"filter",`url(#f-${e})`),s(oe,"mask",`url(#g-${e})`),s(h,"id",`h-${e}`),s(G,"id",`i-${e}`),s(ie,"filter",`url(#h-${e})`),s(se,"mask",`url(#i-${e})`),s(K,"id",`j-${e}`),s(ge,"id",`k-${e}`),s(ce,"filter",`url(#j-${e})`),s(de,"mask",`url(#k-${e})`),s(X,"id",`l-${e}`),s(ne,"id",`m-${e}`),s(Ce,"filter",`url(#l-${e})`),s(pe,"mask",`url(#m-${e})`),s(V,"id",`n-${e}`),s(W,"id",`o-${e}`),s(N,"filter",`url(#n-${e})`),s(Y,"mask",`url(#o-${e})`),s(I,"id",`p-${e}`),s(te,"fill",`url(#p-${e})`),s(k,"id",`q-${e}`),s(U,"id",`r-${e}`),s(T,"filter",`url(#q-${e})`),s(y,"mask",`url(#r-${e})`),s(j,"id",`s-${e}`),s(_,"fill",`url(#s-${e})`),s(P,"id",`t-${e}`),s(A,"fill",`url(#t-${e})`),s(E,"id",`u-${e}`),s(ae,"fill",`url(#u-${e})`),s(re,"id",`v-${e}`),s(fe,"fill",`url(#v-${e})`),s($e,"id",`w-${e}`),s(xe,"fill",`url(#w-${e})`),s(be,"id",`x-${e}`),s(me,"fill",`url(#x-${e})`),s(ve,"id",`y-${e}`),s(ye,"fill",`url(#y-${e})`),s(M,"id",`z-${e}`),s(le,"id",`A-${e}`),s(ke,"filter",`url(#z-${e})`),s(Ue,"id",`B-${e}`),s(Se,"fill",`url(#B-${e})`),s(Se,"mask",`url(#A-${e})`),s(Pe,"id",`C-${e}`),s(we,"id",`D-${e}`),s(Ae,"filter",`url(#C-${e})`),s(Ee,"mask",`url(#D-${e})`),s(De,"id",`E-${e}`),s(Oe,"fill",`url(#E-${e})`),s(Ie,"id",`F-${e}`),s(Xe,"stroke",`url(#F-${e})`),s(et,"id",`G-${e}`),s(tt,"stroke",`url(#G-${e})`),s(rt,"id",`H-${e}`),s(it,"stroke",`url(#H-${e})`),s(nt,"id",`I-${e}`),s(lt,"stroke",`url(#I-${e})`),s(ot,"id",`J-${e}`),s(st,"stroke",`url(#J-${e})`),s(at,"id",`K-${e}`),s(dt,"stroke",`url(#K-${e})`),s(ct,"id",`L-${e}`),s(ft,"stroke",`url(#L-${e})`),s(ut,"id",`M-${e}`),s(_t,"stroke",`url(#M-${e})`),t})()}var vr=L("<button type=button><div><div></div><div></div></div><div>-</div><div>TanStack Router");function $r({initialIsOpen:e,panelProps:t={},closeButtonProps:n={},toggleButtonProps:i={},position:p="bottom-left",containerElement:o="footer",router:a,routerState:c,shadowDOMTarget:u}){const[l,r]=ue();let $;const[v,b]=Ne("tanstackRouterDevtoolsOpen",e),[x,w]=Ne("tanstackRouterDevtoolsHeight",null),[R,J]=ue(!1),[S,oe]=ue(!1),C=Ot(),h=Me(),G=(B,V)=>{if(V.button!==0)return;oe(!0);const W={originalHeight:B?.getBoundingClientRect().height??0,pageY:V.pageY},N=ee=>{const I=W.pageY-ee.pageY,te=W.originalHeight+I;w(te),te<70?b(!1):b(!0)},Y=()=>{oe(!1),document.removeEventListener("mousemove",N),document.removeEventListener("mouseUp",Y)};document.addEventListener("mousemove",N),document.addEventListener("mouseup",Y)};v(),Ge(()=>{J(v()??!1)}),Ge(()=>{var B,V,W;if(R()){const N=(V=(B=l())==null?void 0:B.parentElement)==null?void 0:V.style.paddingBottom,Y=()=>{var ee;const I=$.getBoundingClientRect().height;(ee=l())!=null&&ee.parentElement&&r(te=>(te?.parentElement&&(te.parentElement.style.paddingBottom=`${I}px`),te))};if(Y(),typeof window<"u")return window.addEventListener("resize",Y),()=>{var ee;window.removeEventListener("resize",Y),(ee=l())!=null&&ee.parentElement&&typeof N=="string"&&r(I=>(I.parentElement.style.paddingBottom=N,I))}}else(W=l())!=null&&W.parentElement&&r(N=>(N?.parentElement&&N.parentElement.removeAttribute("style"),N))}),Ge(()=>{if(l()){const B=l(),V=getComputedStyle(B).fontSize;B?.style.setProperty("--tsrd-font-size",V)}});const{style:ie={},...se}=t,{style:F={},onClick:K,...ge}=n,{onClick:ce,class:de,...H}=i;if(!C())return null;const X=q(()=>x()??500),ne=q(()=>Q(h().devtoolsPanelContainer,h().devtoolsPanelContainerVisibility(!!v()),h().devtoolsPanelContainerResizing(S),h().devtoolsPanelContainerAnimation(R(),X()+16))),Ce=q(()=>({height:`${X()}px`,...ie||{}})),pe=q(()=>Q(h().mainCloseBtn,h().mainCloseBtnPosition(p),h().mainCloseBtnAnimation(!!v()),de));return O(Bt,{component:o,ref:r,class:"TanStackRouterDevtools",get children(){return[O(Ut.Provider,{value:{onCloseClick:K??(()=>{})},get children(){return O(gr,Te({ref(B){var V=$;typeof V=="function"?V(B):$=B}},se,{router:a,routerState:c,className:ne,style:Ce,get isOpen(){return R()},setIsOpen:b,handleDragStart:B=>G($,B),shadowDOMTarget:u}))}}),(()=>{var B=vr(),V=B.firstChild,W=V.firstChild,N=W.nextSibling,Y=V.nextSibling,ee=Y.nextSibling;return Qe(B,Te(H,{"aria-label":"Open TanStack Router Devtools",onClick:I=>{b(!0),ce&&ce(I)},get class(){return pe()}}),!1,!0),g(W,O($t,{})),g(N,O($t,{})),z(I=>{var te=h().mainCloseBtnIconContainer,f=h().mainCloseBtnIconOuter,k=h().mainCloseBtnIconInner,U=h().mainCloseBtnDivider,T=h().routerLogoCloseButton;return te!==I.e&&d(V,I.e=te),f!==I.t&&d(W,I.t=f),k!==I.a&&d(N,I.a=k),U!==I.o&&d(Y,I.o=U),T!==I.i&&d(ee,I.i=T),I},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),B})()]}})}export{$r as FloatingTanStackRouterDevtools,$r as default};
