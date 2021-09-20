(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{38:function(e,t,a){},43:function(e,t,a){e.exports=a(57)},48:function(e,t,a){},51:function(e,t,a){},54:function(e,t,a){},56:function(e,t,a){},57:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(13),c=a.n(r),l=(a(48),a(35)),i=a.n(l),u=a(39),s=a(10),d=(a(51),a(36));var f=function(){return o.a.createElement(d.a,{bg:"dark",variant:"dark"},o.a.createElement(d.a.Brand,{href:"#home"},"Images PDF Searcher"))},m=a(15),h=a(30);a(54);function p(e){var t=Object(n.useState)(void 0),a=Object(s.a)(t,2),r=a[0],c=a[1],l=Object(n.useState)(!1),i=Object(s.a)(l,2),u=i[0],d=i[1];Object(n.useEffect)(function(){d(!1)},[e.uniqueFileName]);var f=!(r&&!u);return o.a.createElement(m.a,{onSubmit:function(t){t.preventDefault(),d(!0),e.handleUpload(r)}},o.a.createElement(m.a.Group,{id:"upload-pdf-file-form-group"},o.a.createElement("h3",{className:"inputs-label"},"Upload PDF File"),o.a.createElement(m.a.File,{id:"upload-pdf-file",label:r?r.name:"No File Selected",onChange:function(e){var t=e.target.files[0];c(t)},onMouseEnter:function(e){e.target.style.cursor="pointer"},onMouseLeave:function(e){e.target.style.cursor=""},accept:".pdf",custom:!0,key:r})),o.a.createElement("div",{id:"upload-pdf-file-button-container"},o.a.createElement(h.a,{id:"upload-pdf-file-delete-button",className:"upload-pdf-file-button",variant:"danger",onClick:function(t){c(void 0),e.handleDeleteFileServer()},disabled:f},"Delete"),o.a.createElement(h.a,{id:"upload-pdf-file-upload-button",className:"upload-pdf-file-button",variant:"success",type:"submit",disabled:f},"Upload")))}function v(e){var t=!e.uniqueFileName;return o.a.createElement(m.a,{onSubmit:function(t){t.preventDefault();var a=void 0;""!==t.target[0].value&&(a=t.target[0].value),e.handleSetSearchWords(a)}},o.a.createElement(m.a.Group,{id:"search-words-form-group"},o.a.createElement("h3",{className:"inputs-label"},"Search Words"),o.a.createElement(m.a.Control,{id:"search-words-input",placeholder:"Enter Search Words",disabled:t})),o.a.createElement(h.a,{id:"search-words-button",variant:"success",type:"submit",disabled:t},"Search"))}var b=function(e){return o.a.createElement("div",{id:"inputs-container"},o.a.createElement(p,{handleUpload:e.handleUpload,handleDeleteFileServer:e.handleDeleteFileServer,uniqueFileName:e.uniqueFileName}),o.a.createElement(v,{handleSetSearchWords:e.handleSetSearchWords,uniqueFileName:e.uniqueFileName}))},E=a(40),g=a(24);a(38);function S(e){return o.a.createElement("img",{className:"image-thumbnail",src:"data:image/jpeg;base64, ".concat(e.photo),alt:"",onClick:function(){e.handleClick(e.id)},onMouseEnter:function(e){e.target.style.cursor="pointer"},onMouseLeave:function(e){e.target.style.cursor=""}})}var F=function(e){return o.a.createElement(E.a,{xs:"auto"}," ",e.photos.map(function(t,a){return o.a.createElement(g.a,{xs:"auto",key:a},o.a.createElement(S,{photo:t,id:a,handleClick:e.handleClick}))}))},j=a(31);var N=function(e){var t=Object(n.useState)(!1),a=Object(s.a)(t,2),r=a[0],c=a[1];return Object(n.useEffect)(function(){"undefined"!==typeof e.selectedPhotoID&&c(!0)},[e.selectedPhotoID]),o.a.createElement(j.a,{show:r,onHide:function(){c(!1),e.setSelectedPhotoID(void 0)},animation:!1},o.a.createElement(j.a.Header,{closeButton:!0}," Image "),o.a.createElement(j.a.Body,null,o.a.createElement("img",{className:"image-modal",src:"data:image/jpeg;base64, ".concat(e.selectedPhoto),alt:""})))},O=a(41),P=a(42);a(56);var w=function(e){var t,a;return e.show?t=o.a.createElement(O.a,{animation:"border"}):"undefined"!==typeof e.message&&(a=e.message,t=o.a.createElement(P.a,{variant:"danger"},a)),o.a.createElement("div",{className:"status"},t)};var y=function(){var e=Object(n.useState)({allPhotos:[],ocr:{},uniqueFileName:void 0}),t=Object(s.a)(e,2),a=t[0],r=t[1],c=Object(n.useState)([]),l=Object(s.a)(c,2),d=l[0],m=l[1],h=Object(n.useState)(void 0),p=Object(s.a)(h,2),v=p[0],E=p[1],g=Object(n.useState)(!1),S=Object(s.a)(g,2),j=S[0],O=S[1],P=Object(n.useState)(void 0),y=Object(s.a)(P,2),D=y[0],k=y[1],q=function(e){E(e)};return o.a.createElement("div",{className:"App"},o.a.createElement(f,null),o.a.createElement(b,{handleUpload:function(e){var t,a=new FormData;a.append("file",e),O(!0),(t=a,new Promise(function(e,a){fetch("http://localhost:5000/pdf/",{method:"POST",body:t}).then(function(e){if(e.ok)return e.json();throw e}).then(function(t){e(t)}).catch(function(e){a(e)})})).then(function(e){r({allPhotos:e.photos,ocr:e.ocr,uniqueFileName:e.uniqueFileName}),m(e.photos),O(!1),k(void 0)})},handleSetSearchWords:function(e){var t="undefined"!==typeof e?e.split(" "):[];(function(e){return new Promise(function(t,a){fetch("http://localhost:5000/search/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}).then(function(e){if(e.ok)return e.json();throw e}).then(function(e){t(e)}).catch(function(e){a(e)})})})({allPhotos:a.allPhotos,ocr:a.ocr,searchWord:t}).then(function(e){m(e.photos)}).catch(function(){var e=Object(u.a)(i.a.mark(function e(t){var a;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.json();case 2:a=e.sent,k(a.message);case 4:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}())},handleDeleteFileServer:function(){r({allPhotos:[],ocr:{},uniqueFileName:void 0}),m([])},uniqueFileName:a.uniqueFileName}),o.a.createElement(F,{photos:d,handleClick:q}),o.a.createElement(N,{selectedPhoto:d[v],selectedPhotoID:v,setSelectedPhotoID:q}),o.a.createElement(w,{show:j,message:D}))},D=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,59)).then(function(t){var a=t.getCLS,n=t.getFID,o=t.getFCP,r=t.getLCP,c=t.getTTFB;a(e),n(e),o(e),r(e),c(e)})};c.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(y,null)),document.getElementById("root")),D()}},[[43,1,2]]]);
//# sourceMappingURL=main.511edac7.chunk.js.map