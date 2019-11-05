/*DiQuick v1.4 http://www.diquick.com*/
(function(){const events={ready:function(){this.directive();this.append();this.observe();this.bind()},directive:function(){HTMLElement.prototype.recordEvent=function(){Object.defineProperty(this,'diquickEvent',{value:true,writable:true})};HTMLElement.prototype.queryChildren=function(selector){const val=Math.random();this.setAttribute('data-scope',val);const els=this.querySelectorAll('[data-scope="'+val+'"]>'+selector);this.removeAttribute('data-scope');return els||[]};HTMLElement.prototype.setActive=function(val){const has=typeof val!=='undefined';if(has)components.active(this,val)}},append:function(){const nodes=[{type:'element',name:'message',selector:'.message.fade'},{type:'element',name:'dialog',selector:'.dialog'},{type:'element',name:'drawer',selector:'.drawer'},{type:'attribute',name:'dialog',selector:'[data-open-dialog^="img@"]'}];const has=function(type,selector){const els=document.querySelectorAll(selector);return type==='element'?Array.prototype.filter.call(els,function(el){return!el.hasOwnProperty('diquickEvent')}).length>0:type==='attribute'?els.length>0:false};for(let i=0;i<nodes.length;i++){const type=nodes[i].type;const name=nodes[i].name;const selector=nodes[i].selector;if(has(type,selector))components.init(type,name,selector)}},observe:function(){const MutationObserver=window.MutationObserver||window.WebKitMutationObserver;if(MutationObserver){const MutationObserverConfig={childList:true,subtree:true,attributes:true};const observer=new MutationObserver(function(mutations){events.append()});observer.observe(document,MutationObserverConfig)}else{document.addEventListener('DOMSubtreeModified',function(){events.append()})}},bind:function(){const doc=document.documentElement||document.body;const nodes=[{event:'handle',name:'data-move-panel'},{event:'handle',name:'data-toggle-switch'},{event:'handle',name:'data-open-message'},{event:'handle',name:'data-close-message'},{event:'handle',name:'data-open-dialog'},{event:'handle',name:'data-close-dialog'},{event:'handle',name:'data-open-drawer'},{event:'handle',name:'data-close-drawer'},{event:'handle',name:'data-open-mask'},{event:'handle',name:'data-close-mask'},{event:'close',name:'dialog'},{event:'close',name:'drawer'},{event:'timeout',name:'message'},{event:'timeout',name:'dialog'},{event:'timeout',name:'drawer'},{event:'timeout',name:'mask'},{event:'reset',name:'message'}];const getPath=function(el){let i=0;const path=[el];while(path[i]!==doc){path.push(path[i].parentNode);i++}return path};doc.addEventListener('click',function(e){components.path=e.path||getPath(e.target);components.target=e.target;components.timeStamp=e.timeStamp;const el=e.target;for(let i=0;i<nodes.length;i++){const event=nodes[i].event;const name=nodes[i].name;if(event==='handle'){const isOn=el.hasAttribute(name);if(isOn){const arg=name.split('-');const val=el.getAttribute(name);components.selector(arg[1],arg[2],val)}}else if(event==='close'){const isOn=el.classList.contains(name)&&!el.hasAttribute('data-close-lock');if(isOn){components.selector(event,name)}}}});doc.addEventListener("transitionend",function(e){const el=e.target;const isOpacity=e.propertyName==='opacity';if(isOpacity){for(let i=0;i<nodes.length;i++){const event=nodes[i].event;const name=nodes[i].name;if(event==='timeout'){const isOn=el.classList.contains(name)&&el.classList.contains('active');if(isOn){const val=el.getAttribute('data-close-timeout');components.handle(el,event,name,val);break}}else if(event==='reset'){const isOn=el.classList.contains(name)&&!el.classList.contains('active');if(isOn){components.handle(el,event,name);break}}}}})}};let components={index:0,init:function(type,name,selector){if(type==='element'){const els=document.querySelectorAll(selector);for(let i=0;i<els.length;i++){const el=els[i];if(!el.hasOwnProperty('diquickEvent')){el.recordEvent();const selector='data-'+name+'-container';const container=document.querySelector('['+selector+']')||this.create(selector);container.appendChild(el)}}}else if(type==='attribute'&&name==='dialog'){const img=document.querySelector('.dialog#HTMLImageElement');if(!img){const el=document.createElement('div');el.id='HTMLImageElement';el.className='dialog';el.insertAdjacentHTML('beforeend','<img>');document.body.appendChild(el)}}},active:function(el,val){const event=typeof val==='number'?'move':val===true?'open':val===false?'close':null;if(!!event){const names=['panel','switch','message','dialog','drawer','mask'];for(let i=0;i<names.length;i++){const name=names[i];const isOn=el.classList.contains(name);if(isOn){this.handle(el,event,name,val);break}}}},selector:function(event,name,val){if(event==='open'){const selector=name==='message'?'.message.fade[name='+val+']':name==='dialog'?'.dialog#'+(val.indexOf('img@')===0?'HTMLImageElement':val):'.'+name+'#'+val;const el=document.querySelector(selector+':not(.active)');if(!!el)this.handle(el,event,name,val)}else{const els=this.path;for(let i=0;i<els.length;i++){const el=els[i];const isThis=el.classList.contains(name);if(isThis){this.handle(el,event,name,val);break}}}},handle:function(el,event,name,val){switch(event){case'move':if(name==='panel'){const navs=el.queryChildren('ul.title>li');const items=el.queryChildren('ul.content>li');const isMove=!isNaN(val)&&val<navs.length&&val<items.length;if(isMove){el.queryChildren('ul.title>li.active')[0].classList.remove('active');el.queryChildren('ul.content>li.active')[0].classList.remove('active');navs[val].classList.add('active');items[val].classList.add('active')}}break;case'open':if(name==='message'){el.style.order=++this.index}else if(name==='dialog'){const isImg=typeof val==='string'&&val.indexOf('img@')===0;if(isImg){const img=el.queryChildren('img')[0];const url=!val.split('@')[1]&&this.target.nodeName==='IMG'?this.target.src:val.split('@')[1];img.src=url}}el.classList.add('active');break;case'close':el.classList.remove('active');break;case'toggle':el.classList.toggle('active');break;case'timeout':if(!!val){const isSet=!isNaN(val)&&parseInt(val)>=500;if(isSet){const millisec=parseInt(val);const timeStamp='t'+this.timeStamp;el.timeStamp=timeStamp;setTimeout(function(){const isThis=el.timeStamp===timeStamp;if(isThis){delete el.timeStamp;el.classList.remove('active')}},millisec)}}break;case'reset':if(name==='message')el.style.order='';break}},create:function(attr){const el=document.createElement('div');el.setAttribute(attr,'');document.body.appendChild(el);return el}};if(document.attachEvent?document.readyState==='complete':document.readyState!=='loading'){events.ready()}else{document.addEventListener('DOMContentLoaded',events.ready())}})()