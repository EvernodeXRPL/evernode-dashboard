"use strict";(self.webpackChunkhost_dashboard=self.webpackChunkhost_dashboard||[]).push([[715],{32514:function(e,t,n){n.d(t,{Z:function(){return l}});n(72791);var s=n(38302),a=n(63509),c=n(80184);function l(e){var t=e.modelName,n=e.speed,l=e.count,r=e.showTooltip,i=[];t&&i.push(t),n&&i.push("".concat(n," MHz")),l&&i.push("".concat(l," cores"));var o=i.join(", "),u=(0,c.jsx)(s.Z,{className:"text-wrap",children:o});return o?r?(0,c.jsx)(a.ZP,{title:"Host's CPU specifications",children:u}):u:"-"}},65331:function(e,t,n){n.d(t,{Z:function(){return r}});n(72791);var s=n(38317),a=n(63509),c=n(86886),l=n(80184);function r(e){var t=e.countryCode,n=e.size,r=(0,s.Z)({tooltipPlacementRight:{marginLeft:"0"}})(a.ZP);return(0,l.jsx)(r,{title:t,placement:"right-end",children:(0,l.jsx)("div",{children:(0,l.jsx)(c.Z,{className:"emojiFlag",countryCode:t,style:{fontSize:n,cursor:"pointer"},"aria-label":t,alt:t,svg:!0})})})}},23447:function(e,t,n){n.d(t,{Z:function(){return r}});n(72791);var s=n(38302),a=n(63509),c=n(80184);function l(e){return Math.round(100*e)/100}function r(e){var t=e.cpu,n=e.ram,r=e.disk,i=e.instanceCount,o=e.showTooltip,u=[];i&&(t&&u.push("".concat(l(t/1e4/i),"% CPU")),n&&u.push("".concat(l(n/1e3/i),"GB RAM")),r&&u.push("".concat(l(r/1e3/i),"GB Disk")));var d=u.join(", "),h=(0,c.jsx)(s.Z,{className:"text-wrap",children:d});return d?o?(0,c.jsx)(a.ZP,{title:"Resource allocation for a smart contract instance",children:h}):h:"-"}},83715:function(e,t,n){n.r(t),n.d(t,{default:function(){return k}});var s=n(93433),a=n(15861),c=n(29439),l=n(87757),r=n.n(l),i=n(72791),o=n(79271),u=n(26513),d=n(49425),h=n(84738),m=n(10283),f=n(42953),v=n(80184);function x(e){var t=e.columns,n=e.values,s=e.hideHeadings,a=e.onRowClick,c=Object.keys(t);return(0,v.jsx)(i.Fragment,{children:(0,v.jsx)(m.Z,{className:"card-box mb-4",children:(0,v.jsx)(f.Z,{className:"p-0",children:(0,v.jsx)("div",{className:"table-responsive",children:(0,v.jsxs)("table",{className:"table table-striped table-hover text-nowrap mb-0",children:[!s&&(0,v.jsx)("thead",{className:"thead-light",children:(0,v.jsx)("tr",{children:c.map((function(e,n){return(0,v.jsx)("th",{className:t[e].className,children:t[e].title},n)}))})}),(0,v.jsx)("tbody",{children:n.map((function(e,n){return(0,v.jsx)("tr",{onClick:function(){return a(e)},style:{cursor:"pointer"},children:c.map((function(n,s){return(0,v.jsx)("td",{className:t[n].className,children:e[n]},s)}))},n)}))})]})})})})})}var p=n(15211),j=n(80520),g=n(65331),b=n(32514),N=n(23447);function k(){var e=(0,o.k6)(),t=(0,p.y)(),n=(0,i.useState)(null),l=(0,c.Z)(n,2),m=l[0],f=l[1],k=(0,i.useState)(null),y=(0,c.Z)(k,2),C=y[0],Z=y[1],w=(0,i.useState)([]),z=(0,c.Z)(w,2),M=z[0],S=z[1],H=(0,i.useCallback)((0,a.Z)(r().mark((function e(){var n,s,a,c,l,i=arguments;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=i.length>0&&void 0!==i[0]?i[0]:null,e.next=3,t.getHosts(null,10,n);case 3:(s=e.sent).nextPageToken?(a=s.data,Z(s.nextPageToken)):(a=s,Z(null)),c={address:{title:"Address",className:"text-start"},status:{title:"Status",className:"text-center"},cpuModel:{title:"CPU Model",className:"text-center col-fixed-mw"},instanceSize:{title:"Instance Size",className:"text-center col-fixed-mw"},maxInstances:{title:"Max Instances",className:"text-center"},activeInstances:{title:"Active Instances",className:"text-center"}},l=a.map((function(e){return{key:e.address,address:(0,v.jsxs)("div",{className:"d-flex align-items-center",children:[(0,v.jsx)(g.Z,{countryCode:e.countryCode,size:"3em"}),(0,v.jsxs)("div",{className:"ml-3",children:[(0,v.jsxs)("p",{className:"font-weight-bold m-0",children:[e.address,e.hostMessage?(0,v.jsx)(d.Z,{className:"host-message-icon",fontSize:"small"}):null]}),(0,v.jsxs)("span",{className:"text-black-50 d-block py-1",children:[e.version&&(0,v.jsxs)("span",{children:["v",e.version," | "]}),e.description&&(0,v.jsx)("span",{children:e.description})]})]})]}),status:e.active?(0,v.jsx)("div",{className:"h-auto py-2 badge badge-success",style:{width:"4.25rem",fontSize:"0.75rem"},children:"Active"}):(0,v.jsx)("div",{className:"h-auto py-2 badge badge-warning",style:{width:"4.25rem",fontSize:"0.75rem"},children:"Inactive"}),cpuModel:(0,v.jsx)(b.Z,{modelName:e.cpuModelName,speed:e.cpuMHz,count:e.cpuCount}),instanceSize:(0,v.jsx)(N.Z,{cpu:e.cpuMicrosec,ram:e.ramMb,disk:e.diskMb,instanceCount:e.maxInstances}),maxInstances:e.maxInstances||0,activeInstances:e.activeInstances||0}})),f({hosts:a,tableColumns:c,tableValues:l});case 8:case"end":return e.stop()}}),e)}))),[t]);(0,i.useEffect)((function(){H()}),[H]);var P=(0,i.useCallback)((function(t){e.push("/host/".concat(t.key))}),[e]),I=(0,i.useCallback)((function(){S([].concat((0,s.Z)(M),[C])),H(C)}),[H,M,C]),O=(0,i.useCallback)((function(){var e=M.length>1?M[M.length-2]:null;S(M.slice(0,M.length-1)),H(e)}),[H,M]);return(0,v.jsxs)(i.Fragment,{children:[(0,v.jsx)(h.Z,{titleHeading:"Hosts"}),m&&(0,v.jsxs)("div",{children:[(0,v.jsx)(x,{columns:m.tableColumns,values:m.tableValues,onRowClick:P}),(0,v.jsxs)("div",{children:[M.length>0&&(0,v.jsx)(u.Z,{className:"pull-left",variant:"contained",onClick:O,children:"Prev"}),C&&(0,v.jsx)(u.Z,{className:"pull-right",variant:"contained",onClick:I,children:"Next"})]})]})||(0,v.jsx)(j.Z,{className:"p-4"})]})}},49425:function(e,t,n){var s=n(95318);t.Z=void 0;var a=s(n(72791)),c=(0,s(n(44894)).default)(a.default.createElement("path",{d:"M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"}),"Message");t.Z=c},86886:function(e,t,n){var s=n(72791);function a(){return a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(e[s]=n[s])}return e},a.apply(this,arguments)}var c=["cdnSuffix","cdnUrl","countryCode","style","svg"];t.Z=function(e){var t=e.cdnSuffix,n=void 0===t?"svg":t,l=e.cdnUrl,r=void 0===l?"https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.4/flags/4x3/":l,i=e.countryCode,o=e.style,u=e.svg,d=void 0!==u&&u,h=function(e,t){if(null==e)return{};var n,s,a={},c=Object.keys(e);for(s=0;s<c.length;s++)n=c[s],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,c);if("string"!==typeof i)return null;if(d){var m=""+r+i.toLowerCase()+"."+n;return(0,s.createElement)("img",Object.assign({},h,{src:m,style:a({display:"inline-block",width:"1em",height:"1em",verticalAlign:"middle"},o)}))}var f=i.toUpperCase().replace(/./g,(function(e){return String.fromCodePoint(e.charCodeAt(0)+127397)}));return(0,s.createElement)("span",Object.assign({role:"img"},h,{style:a({display:"inline-block",fontSize:"1em",lineHeight:"1em",verticalAlign:"middle"},o)}),f)}}}]);
//# sourceMappingURL=715.c401079e.chunk.js.map