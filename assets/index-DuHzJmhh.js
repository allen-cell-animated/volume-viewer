const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/raw-Dt1HMqYc.js","assets/basedecoder-DvumDe3Y.js","assets/lzw-DpvbRwG5.js","assets/jpeg-CdeCw_eT.js","assets/deflate-CUkHh1nh.js","assets/pako.esm-CPws4d4z.js","assets/packbits-DQnG8s9w.js","assets/lerc-CUiIedq7.js","assets/webimage-BcnuJlio.js"])))=>i.map(i=>d[i]);
var ov=Object.defineProperty;var av=(i,e,t)=>e in i?ov(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var mu=(i,e,t)=>av(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ra="171",ja={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},lv=0,gu=1,cv=2,cp=1,hv=2,ti=3,Ii=0,pn=1,Un=2,Ri=0,Wn=1,vu=2,_u=3,xu=4,hp=5,Ji=100,uv=101,dv=102,pv=103,up=104,fv=200,kl=201,mv=202,gv=203,zl=204,Vl=205,vv=206,_v=207,xv=208,bv=209,yv=210,wv=211,Sv=212,Mv=213,Ev=214,Gl=0,Hl=1,Wl=2,Xs=3,Xl=4,Yl=5,ql=6,jl=7,Uc=0,Av=1,Cv=2,Pi=0,Tv=1,Rv=2,Pv=3,Lv=4,Iv=5,Dv=6,Uv=7,Nc=300,Ys=301,qs=302,$l=303,Kl=304,oa=306,Yo=1e3,dn=1001,qo=1002,It=1003,dp=1004,Sr=1005,zt=1006,Fo=1007,Ei=1008,Qt=1009,Oc=1010,Fc=1011,js=1012,aa=1013,Di=1014,Tn=1015,Br=1016,Bc=1017,kc=1018,$s=1020,pp=35902,fp=1021,mp=1022,Xt=1023,zc=1024,gp=1025,zs=1026,Ks=1027,la=1028,ii=1029,vp=1030,Vc=1031,Gc=1033,Bo=33776,ko=33777,zo=33778,Vo=33779,Zl=35840,Jl=35841,Ql=35842,ec=35843,tc=36196,nc=37492,ic=37496,sc=37808,rc=37809,oc=37810,ac=37811,lc=37812,cc=37813,hc=37814,uc=37815,dc=37816,pc=37817,fc=37818,mc=37819,gc=37820,vc=37821,Go=36492,_c=36494,xc=36495,_p=36283,bc=36284,yc=36285,wc=36286,Nv=2300,Ov=2301,Fv=3200,Bv=3201,xp=0,kv=1,ri="",bn="srgb",Zs="srgb-linear",jo="linear",yt="srgb",xs=7680,bu=519,zv=512,Vv=513,Gv=514,bp=515,Hv=516,Wv=517,Xv=518,Yv=519,yu=35044,wu="300 es",ai=2e3,$o=2001;class is{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Zt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Su=1234567;const Tr=Math.PI/180,Js=180/Math.PI;function nr(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Zt[i&255]+Zt[i>>8&255]+Zt[i>>16&255]+Zt[i>>24&255]+"-"+Zt[e&255]+Zt[e>>8&255]+"-"+Zt[e>>16&15|64]+Zt[e>>24&255]+"-"+Zt[t&63|128]+Zt[t>>8&255]+"-"+Zt[t>>16&255]+Zt[t>>24&255]+Zt[n&255]+Zt[n>>8&255]+Zt[n>>16&255]+Zt[n>>24&255]).toLowerCase()}function ht(i,e,t){return Math.max(e,Math.min(t,i))}function Hc(i,e){return(i%e+e)%e}function qv(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function jv(i,e,t){return i!==e?(t-i)/(e-i):0}function Rr(i,e,t){return(1-t)*i+t*e}function $v(i,e,t,n){return Rr(i,e,1-Math.exp(-t*n))}function Kv(i,e=1){return e-Math.abs(Hc(i,e*2)-e)}function Zv(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Jv(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Qv(i,e){return i+Math.floor(Math.random()*(e-i+1))}function e0(i,e){return i+Math.random()*(e-i)}function t0(i){return i*(.5-Math.random())}function n0(i){i!==void 0&&(Su=i);let e=Su+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function i0(i){return i*Tr}function s0(i){return i*Js}function r0(i){return(i&i-1)===0&&i!==0}function o0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function a0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function l0(i,e,t,n,s){const r=Math.cos,a=Math.sin,c=r(t/2),u=a(t/2),d=r((e+n)/2),f=a((e+n)/2),m=r((e-n)/2),v=a((e-n)/2),g=r((n-e)/2),b=a((n-e)/2);switch(s){case"XYX":i.set(c*f,u*m,u*v,c*d);break;case"YZY":i.set(u*v,c*f,u*m,c*d);break;case"ZXZ":i.set(u*m,u*v,c*f,c*d);break;case"XZX":i.set(c*f,u*b,u*g,c*d);break;case"YXY":i.set(u*g,c*f,u*b,c*d);break;case"ZYZ":i.set(u*b,u*g,c*f,c*d);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ns(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function sn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Ko={DEG2RAD:Tr,RAD2DEG:Js,generateUUID:nr,clamp:ht,euclideanModulo:Hc,mapLinear:qv,inverseLerp:jv,lerp:Rr,damp:$v,pingpong:Kv,smoothstep:Zv,smootherstep:Jv,randInt:Qv,randFloat:e0,randFloatSpread:t0,seededRandom:n0,degToRad:i0,radToDeg:s0,isPowerOfTwo:r0,ceilPowerOfTwo:o0,floorPowerOfTwo:a0,setQuaternionFromProperEuler:l0,normalize:sn,denormalize:Ns};class Ue{constructor(e=0,t=0){Ue.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class et{constructor(e,t,n,s,r,a,c,u,d){et.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,c,u,d)}set(e,t,n,s,r,a,c,u,d){const f=this.elements;return f[0]=e,f[1]=s,f[2]=c,f[3]=t,f[4]=r,f[5]=u,f[6]=n,f[7]=a,f[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],c=n[3],u=n[6],d=n[1],f=n[4],m=n[7],v=n[2],g=n[5],b=n[8],y=s[0],x=s[3],_=s[6],w=s[1],E=s[4],M=s[7],P=s[2],D=s[5],O=s[8];return r[0]=a*y+c*w+u*P,r[3]=a*x+c*E+u*D,r[6]=a*_+c*M+u*O,r[1]=d*y+f*w+m*P,r[4]=d*x+f*E+m*D,r[7]=d*_+f*M+m*O,r[2]=v*y+g*w+b*P,r[5]=v*x+g*E+b*D,r[8]=v*_+g*M+b*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],c=e[5],u=e[6],d=e[7],f=e[8];return t*a*f-t*c*d-n*r*f+n*c*u+s*r*d-s*a*u}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],c=e[5],u=e[6],d=e[7],f=e[8],m=f*a-c*d,v=c*u-f*r,g=d*r-a*u,b=t*m+n*v+s*g;if(b===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/b;return e[0]=m*y,e[1]=(s*d-f*n)*y,e[2]=(c*n-s*a)*y,e[3]=v*y,e[4]=(f*t-s*u)*y,e[5]=(s*r-c*t)*y,e[6]=g*y,e[7]=(n*u-d*t)*y,e[8]=(a*t-n*r)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,c){const u=Math.cos(r),d=Math.sin(r);return this.set(n*u,n*d,-n*(u*a+d*c)+a+e,-s*d,s*u,-s*(-d*a+u*c)+c+t,0,0,1),this}scale(e,t){return this.premultiply($a.makeScale(e,t)),this}rotate(e){return this.premultiply($a.makeRotation(-e)),this}translate(e,t){return this.premultiply($a.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const $a=new et;function yp(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Zo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function c0(){const i=Zo("canvas");return i.style.display="block",i}const Mu={};function Os(i){i in Mu||(Mu[i]=!0,console.warn(i))}function h0(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function u0(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function d0(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Eu=new et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Au=new et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function p0(){const i={enabled:!0,workingColorSpace:Zs,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===yt&&(s.r=li(s.r),s.g=li(s.g),s.b=li(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===yt&&(s.r=Vs(s.r),s.g=Vs(s.g),s.b=Vs(s.b))),s},fromWorkingColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},toWorkingColorSpace:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ri?jo:this.spaces[s].transfer},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Zs]:{primaries:e,whitePoint:n,transfer:jo,toXYZ:Eu,fromXYZ:Au,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:bn},outputColorSpaceConfig:{drawingBufferColorSpace:bn}},[bn]:{primaries:e,whitePoint:n,transfer:yt,toXYZ:Eu,fromXYZ:Au,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:bn}}}),i}const vt=p0();function li(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Vs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let bs;class f0{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{bs===void 0&&(bs=Zo("canvas")),bs.width=e.width,bs.height=e.height;const n=bs.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=bs}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Zo("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=li(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(li(t[n]/255)*255):t[n]=li(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let m0=0;class Wc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:m0++}),this.uuid=nr(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,c=s.length;a<c;a++)s[a].isDataTexture?r.push(Ka(s[a].image)):r.push(Ka(s[a]))}else r=Ka(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Ka(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?f0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let g0=0;class Tt extends is{constructor(e=Tt.DEFAULT_IMAGE,t=Tt.DEFAULT_MAPPING,n=dn,s=dn,r=zt,a=Ei,c=Xt,u=Qt,d=Tt.DEFAULT_ANISOTROPY,f=ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:g0++}),this.uuid=nr(),this.name="",this.source=new Wc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=d,this.format=c,this.internalFormat=null,this.type=u,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new et,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Nc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Yo:e.x=e.x-Math.floor(e.x);break;case dn:e.x=e.x<0?0:1;break;case qo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Yo:e.y=e.y-Math.floor(e.y);break;case dn:e.y=e.y<0?0:1;break;case qo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Tt.DEFAULT_IMAGE=null;Tt.DEFAULT_MAPPING=Nc;Tt.DEFAULT_ANISOTROPY=1;class Mt{constructor(e=0,t=0,n=0,s=1){Mt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const u=e.elements,d=u[0],f=u[4],m=u[8],v=u[1],g=u[5],b=u[9],y=u[2],x=u[6],_=u[10];if(Math.abs(f-v)<.01&&Math.abs(m-y)<.01&&Math.abs(b-x)<.01){if(Math.abs(f+v)<.1&&Math.abs(m+y)<.1&&Math.abs(b+x)<.1&&Math.abs(d+g+_-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(d+1)/2,M=(g+1)/2,P=(_+1)/2,D=(f+v)/4,O=(m+y)/4,U=(b+x)/4;return E>M&&E>P?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=D/n,r=O/n):M>P?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=D/s,r=U/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=O/r,s=U/r),this.set(n,s,r,t),this}let w=Math.sqrt((x-b)*(x-b)+(m-y)*(m-y)+(v-f)*(v-f));return Math.abs(w)<.001&&(w=1),this.x=(x-b)/w,this.y=(m-y)/w,this.z=(v-f)/w,this.w=Math.acos((d+g+_-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this.w=ht(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this.w=ht(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class v0 extends is{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Mt(0,0,e,t),this.scissorTest=!1,this.viewport=new Mt(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:zt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Tt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let c=0;c<a;c++)this.textures[c]=r.clone(),this.textures[c].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Wc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fn extends v0{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class wp extends Tt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Sp extends Tt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=It,this.minFilter=It,this.wrapR=dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ui{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,c){let u=n[s+0],d=n[s+1],f=n[s+2],m=n[s+3];const v=r[a+0],g=r[a+1],b=r[a+2],y=r[a+3];if(c===0){e[t+0]=u,e[t+1]=d,e[t+2]=f,e[t+3]=m;return}if(c===1){e[t+0]=v,e[t+1]=g,e[t+2]=b,e[t+3]=y;return}if(m!==y||u!==v||d!==g||f!==b){let x=1-c;const _=u*v+d*g+f*b+m*y,w=_>=0?1:-1,E=1-_*_;if(E>Number.EPSILON){const P=Math.sqrt(E),D=Math.atan2(P,_*w);x=Math.sin(x*D)/P,c=Math.sin(c*D)/P}const M=c*w;if(u=u*x+v*M,d=d*x+g*M,f=f*x+b*M,m=m*x+y*M,x===1-c){const P=1/Math.sqrt(u*u+d*d+f*f+m*m);u*=P,d*=P,f*=P,m*=P}}e[t]=u,e[t+1]=d,e[t+2]=f,e[t+3]=m}static multiplyQuaternionsFlat(e,t,n,s,r,a){const c=n[s],u=n[s+1],d=n[s+2],f=n[s+3],m=r[a],v=r[a+1],g=r[a+2],b=r[a+3];return e[t]=c*b+f*m+u*g-d*v,e[t+1]=u*b+f*v+d*m-c*g,e[t+2]=d*b+f*g+c*v-u*m,e[t+3]=f*b-c*m-u*v-d*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,c=Math.cos,u=Math.sin,d=c(n/2),f=c(s/2),m=c(r/2),v=u(n/2),g=u(s/2),b=u(r/2);switch(a){case"XYZ":this._x=v*f*m+d*g*b,this._y=d*g*m-v*f*b,this._z=d*f*b+v*g*m,this._w=d*f*m-v*g*b;break;case"YXZ":this._x=v*f*m+d*g*b,this._y=d*g*m-v*f*b,this._z=d*f*b-v*g*m,this._w=d*f*m+v*g*b;break;case"ZXY":this._x=v*f*m-d*g*b,this._y=d*g*m+v*f*b,this._z=d*f*b+v*g*m,this._w=d*f*m-v*g*b;break;case"ZYX":this._x=v*f*m-d*g*b,this._y=d*g*m+v*f*b,this._z=d*f*b-v*g*m,this._w=d*f*m+v*g*b;break;case"YZX":this._x=v*f*m+d*g*b,this._y=d*g*m+v*f*b,this._z=d*f*b-v*g*m,this._w=d*f*m-v*g*b;break;case"XZY":this._x=v*f*m-d*g*b,this._y=d*g*m-v*f*b,this._z=d*f*b+v*g*m,this._w=d*f*m+v*g*b;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],c=t[5],u=t[9],d=t[2],f=t[6],m=t[10],v=n+c+m;if(v>0){const g=.5/Math.sqrt(v+1);this._w=.25/g,this._x=(f-u)*g,this._y=(r-d)*g,this._z=(a-s)*g}else if(n>c&&n>m){const g=2*Math.sqrt(1+n-c-m);this._w=(f-u)/g,this._x=.25*g,this._y=(s+a)/g,this._z=(r+d)/g}else if(c>m){const g=2*Math.sqrt(1+c-n-m);this._w=(r-d)/g,this._x=(s+a)/g,this._y=.25*g,this._z=(u+f)/g}else{const g=2*Math.sqrt(1+m-n-c);this._w=(a-s)/g,this._x=(r+d)/g,this._y=(u+f)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ht(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,c=t._x,u=t._y,d=t._z,f=t._w;return this._x=n*f+a*c+s*d-r*u,this._y=s*f+a*u+r*c-n*d,this._z=r*f+a*d+n*u-s*c,this._w=a*f-n*c-s*u-r*d,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let c=a*e._w+n*e._x+s*e._y+r*e._z;if(c<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,c=-c):this.copy(e),c>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const u=1-c*c;if(u<=Number.EPSILON){const g=1-t;return this._w=g*a+t*this._w,this._x=g*n+t*this._x,this._y=g*s+t*this._y,this._z=g*r+t*this._z,this.normalize(),this}const d=Math.sqrt(u),f=Math.atan2(d,c),m=Math.sin((1-t)*f)/d,v=Math.sin(t*f)/d;return this._w=a*m+this._w*v,this._x=n*m+this._x*v,this._y=s*m+this._y*v,this._z=r*m+this._z*v,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,n=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Cu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Cu.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,c=e.z,u=e.w,d=2*(a*s-c*n),f=2*(c*t-r*s),m=2*(r*n-a*t);return this.x=t+u*d+a*m-c*f,this.y=n+u*f+c*d-r*m,this.z=s+u*m+r*f-a*d,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ht(this.x,e.x,t.x),this.y=ht(this.y,e.y,t.y),this.z=ht(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ht(this.x,e,t),this.y=ht(this.y,e,t),this.z=ht(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ht(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,c=t.y,u=t.z;return this.x=s*u-r*c,this.y=r*a-n*u,this.z=n*c-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Za.copy(this).projectOnVector(e),this.sub(Za)}reflect(e){return this.sub(Za.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ht(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Za=new I,Cu=new Ui;class fn{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Pn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Pn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Pn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,c=r.count;a<c;a++)e.isMesh===!0?e.getVertexPosition(a,Pn):Pn.fromBufferAttribute(r,a),Pn.applyMatrix4(e.matrixWorld),this.expandByPoint(Pn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),to.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),to.copy(n.boundingBox)),to.applyMatrix4(e.matrixWorld),this.union(to)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Pn),Pn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(_r),no.subVectors(this.max,_r),ys.subVectors(e.a,_r),ws.subVectors(e.b,_r),Ss.subVectors(e.c,_r),_i.subVectors(ws,ys),xi.subVectors(Ss,ws),Xi.subVectors(ys,Ss);let t=[0,-_i.z,_i.y,0,-xi.z,xi.y,0,-Xi.z,Xi.y,_i.z,0,-_i.x,xi.z,0,-xi.x,Xi.z,0,-Xi.x,-_i.y,_i.x,0,-xi.y,xi.x,0,-Xi.y,Xi.x,0];return!Ja(t,ys,ws,Ss,no)||(t=[1,0,0,0,1,0,0,0,1],!Ja(t,ys,ws,Ss,no))?!1:(io.crossVectors(_i,xi),t=[io.x,io.y,io.z],Ja(t,ys,ws,Ss,no))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Pn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Pn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Kn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Kn=[new I,new I,new I,new I,new I,new I,new I,new I],Pn=new I,to=new fn,ys=new I,ws=new I,Ss=new I,_i=new I,xi=new I,Xi=new I,_r=new I,no=new I,io=new I,Yi=new I;function Ja(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Yi.fromArray(i,r);const c=s.x*Math.abs(Yi.x)+s.y*Math.abs(Yi.y)+s.z*Math.abs(Yi.z),u=e.dot(Yi),d=t.dot(Yi),f=n.dot(Yi);if(Math.max(-Math.max(u,d,f),Math.min(u,d,f))>c)return!1}return!0}const _0=new fn,xr=new I,Qa=new I;class ca{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):_0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xr.subVectors(e,this.center);const t=xr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(xr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Qa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xr.copy(e.center).add(Qa)),this.expandByPoint(xr.copy(e.center).sub(Qa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Zn=new I,el=new I,so=new I,bi=new I,tl=new I,ro=new I,nl=new I;class Mp{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Zn.copy(this.origin).addScaledVector(this.direction,t),Zn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){el.copy(e).add(t).multiplyScalar(.5),so.copy(t).sub(e).normalize(),bi.copy(this.origin).sub(el);const r=e.distanceTo(t)*.5,a=-this.direction.dot(so),c=bi.dot(this.direction),u=-bi.dot(so),d=bi.lengthSq(),f=Math.abs(1-a*a);let m,v,g,b;if(f>0)if(m=a*u-c,v=a*c-u,b=r*f,m>=0)if(v>=-b)if(v<=b){const y=1/f;m*=y,v*=y,g=m*(m+a*v+2*c)+v*(a*m+v+2*u)+d}else v=r,m=Math.max(0,-(a*v+c)),g=-m*m+v*(v+2*u)+d;else v=-r,m=Math.max(0,-(a*v+c)),g=-m*m+v*(v+2*u)+d;else v<=-b?(m=Math.max(0,-(-a*r+c)),v=m>0?-r:Math.min(Math.max(-r,-u),r),g=-m*m+v*(v+2*u)+d):v<=b?(m=0,v=Math.min(Math.max(-r,-u),r),g=v*(v+2*u)+d):(m=Math.max(0,-(a*r+c)),v=m>0?r:Math.min(Math.max(-r,-u),r),g=-m*m+v*(v+2*u)+d);else v=a>0?-r:r,m=Math.max(0,-(a*v+c)),g=-m*m+v*(v+2*u)+d;return n&&n.copy(this.origin).addScaledVector(this.direction,m),s&&s.copy(el).addScaledVector(so,v),g}intersectSphere(e,t){Zn.subVectors(e.center,this.origin);const n=Zn.dot(this.direction),s=Zn.dot(Zn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),c=n-a,u=n+a;return u<0?null:c<0?this.at(u,t):this.at(c,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,c,u;const d=1/this.direction.x,f=1/this.direction.y,m=1/this.direction.z,v=this.origin;return d>=0?(n=(e.min.x-v.x)*d,s=(e.max.x-v.x)*d):(n=(e.max.x-v.x)*d,s=(e.min.x-v.x)*d),f>=0?(r=(e.min.y-v.y)*f,a=(e.max.y-v.y)*f):(r=(e.max.y-v.y)*f,a=(e.min.y-v.y)*f),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),m>=0?(c=(e.min.z-v.z)*m,u=(e.max.z-v.z)*m):(c=(e.max.z-v.z)*m,u=(e.min.z-v.z)*m),n>u||c>s)||((c>n||n!==n)&&(n=c),(u<s||s!==s)&&(s=u),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Zn)!==null}intersectTriangle(e,t,n,s,r){tl.subVectors(t,e),ro.subVectors(n,e),nl.crossVectors(tl,ro);let a=this.direction.dot(nl),c;if(a>0){if(s)return null;c=1}else if(a<0)c=-1,a=-a;else return null;bi.subVectors(this.origin,e);const u=c*this.direction.dot(ro.crossVectors(bi,ro));if(u<0)return null;const d=c*this.direction.dot(tl.cross(bi));if(d<0||u+d>a)return null;const f=-c*bi.dot(nl);return f<0?null:this.at(f/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class _t{constructor(e,t,n,s,r,a,c,u,d,f,m,v,g,b,y,x){_t.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,c,u,d,f,m,v,g,b,y,x)}set(e,t,n,s,r,a,c,u,d,f,m,v,g,b,y,x){const _=this.elements;return _[0]=e,_[4]=t,_[8]=n,_[12]=s,_[1]=r,_[5]=a,_[9]=c,_[13]=u,_[2]=d,_[6]=f,_[10]=m,_[14]=v,_[3]=g,_[7]=b,_[11]=y,_[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _t().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Ms.setFromMatrixColumn(e,0).length(),r=1/Ms.setFromMatrixColumn(e,1).length(),a=1/Ms.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),c=Math.sin(n),u=Math.cos(s),d=Math.sin(s),f=Math.cos(r),m=Math.sin(r);if(e.order==="XYZ"){const v=a*f,g=a*m,b=c*f,y=c*m;t[0]=u*f,t[4]=-u*m,t[8]=d,t[1]=g+b*d,t[5]=v-y*d,t[9]=-c*u,t[2]=y-v*d,t[6]=b+g*d,t[10]=a*u}else if(e.order==="YXZ"){const v=u*f,g=u*m,b=d*f,y=d*m;t[0]=v+y*c,t[4]=b*c-g,t[8]=a*d,t[1]=a*m,t[5]=a*f,t[9]=-c,t[2]=g*c-b,t[6]=y+v*c,t[10]=a*u}else if(e.order==="ZXY"){const v=u*f,g=u*m,b=d*f,y=d*m;t[0]=v-y*c,t[4]=-a*m,t[8]=b+g*c,t[1]=g+b*c,t[5]=a*f,t[9]=y-v*c,t[2]=-a*d,t[6]=c,t[10]=a*u}else if(e.order==="ZYX"){const v=a*f,g=a*m,b=c*f,y=c*m;t[0]=u*f,t[4]=b*d-g,t[8]=v*d+y,t[1]=u*m,t[5]=y*d+v,t[9]=g*d-b,t[2]=-d,t[6]=c*u,t[10]=a*u}else if(e.order==="YZX"){const v=a*u,g=a*d,b=c*u,y=c*d;t[0]=u*f,t[4]=y-v*m,t[8]=b*m+g,t[1]=m,t[5]=a*f,t[9]=-c*f,t[2]=-d*f,t[6]=g*m+b,t[10]=v-y*m}else if(e.order==="XZY"){const v=a*u,g=a*d,b=c*u,y=c*d;t[0]=u*f,t[4]=-m,t[8]=d*f,t[1]=v*m+y,t[5]=a*f,t[9]=g*m-b,t[2]=b*m-g,t[6]=c*f,t[10]=y*m+v}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(x0,e,b0)}lookAt(e,t,n){const s=this.elements;return vn.subVectors(e,t),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),yi.crossVectors(n,vn),yi.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),yi.crossVectors(n,vn)),yi.normalize(),oo.crossVectors(vn,yi),s[0]=yi.x,s[4]=oo.x,s[8]=vn.x,s[1]=yi.y,s[5]=oo.y,s[9]=vn.y,s[2]=yi.z,s[6]=oo.z,s[10]=vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],c=n[4],u=n[8],d=n[12],f=n[1],m=n[5],v=n[9],g=n[13],b=n[2],y=n[6],x=n[10],_=n[14],w=n[3],E=n[7],M=n[11],P=n[15],D=s[0],O=s[4],U=s[8],L=s[12],A=s[1],F=s[5],q=s[9],X=s[13],J=s[2],Q=s[6],te=s[10],ee=s[14],z=s[3],le=s[7],ce=s[11],re=s[15];return r[0]=a*D+c*A+u*J+d*z,r[4]=a*O+c*F+u*Q+d*le,r[8]=a*U+c*q+u*te+d*ce,r[12]=a*L+c*X+u*ee+d*re,r[1]=f*D+m*A+v*J+g*z,r[5]=f*O+m*F+v*Q+g*le,r[9]=f*U+m*q+v*te+g*ce,r[13]=f*L+m*X+v*ee+g*re,r[2]=b*D+y*A+x*J+_*z,r[6]=b*O+y*F+x*Q+_*le,r[10]=b*U+y*q+x*te+_*ce,r[14]=b*L+y*X+x*ee+_*re,r[3]=w*D+E*A+M*J+P*z,r[7]=w*O+E*F+M*Q+P*le,r[11]=w*U+E*q+M*te+P*ce,r[15]=w*L+E*X+M*ee+P*re,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],c=e[5],u=e[9],d=e[13],f=e[2],m=e[6],v=e[10],g=e[14],b=e[3],y=e[7],x=e[11],_=e[15];return b*(+r*u*m-s*d*m-r*c*v+n*d*v+s*c*g-n*u*g)+y*(+t*u*g-t*d*v+r*a*v-s*a*g+s*d*f-r*u*f)+x*(+t*d*m-t*c*g-r*a*m+n*a*g+r*c*f-n*d*f)+_*(-s*c*f-t*u*m+t*c*v+s*a*m-n*a*v+n*u*f)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],c=e[5],u=e[6],d=e[7],f=e[8],m=e[9],v=e[10],g=e[11],b=e[12],y=e[13],x=e[14],_=e[15],w=m*x*d-y*v*d+y*u*g-c*x*g-m*u*_+c*v*_,E=b*v*d-f*x*d-b*u*g+a*x*g+f*u*_-a*v*_,M=f*y*d-b*m*d+b*c*g-a*y*g-f*c*_+a*m*_,P=b*m*u-f*y*u-b*c*v+a*y*v+f*c*x-a*m*x,D=t*w+n*E+s*M+r*P;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/D;return e[0]=w*O,e[1]=(y*v*r-m*x*r-y*s*g+n*x*g+m*s*_-n*v*_)*O,e[2]=(c*x*r-y*u*r+y*s*d-n*x*d-c*s*_+n*u*_)*O,e[3]=(m*u*r-c*v*r-m*s*d+n*v*d+c*s*g-n*u*g)*O,e[4]=E*O,e[5]=(f*x*r-b*v*r+b*s*g-t*x*g-f*s*_+t*v*_)*O,e[6]=(b*u*r-a*x*r-b*s*d+t*x*d+a*s*_-t*u*_)*O,e[7]=(a*v*r-f*u*r+f*s*d-t*v*d-a*s*g+t*u*g)*O,e[8]=M*O,e[9]=(b*m*r-f*y*r-b*n*g+t*y*g+f*n*_-t*m*_)*O,e[10]=(a*y*r-b*c*r+b*n*d-t*y*d-a*n*_+t*c*_)*O,e[11]=(f*c*r-a*m*r-f*n*d+t*m*d+a*n*g-t*c*g)*O,e[12]=P*O,e[13]=(f*y*s-b*m*s+b*n*v-t*y*v-f*n*x+t*m*x)*O,e[14]=(b*c*s-a*y*s-b*n*u+t*y*u+a*n*x-t*c*x)*O,e[15]=(a*m*s-f*c*s+f*n*u-t*m*u-a*n*v+t*c*v)*O,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,c=e.y,u=e.z,d=r*a,f=r*c;return this.set(d*a+n,d*c-s*u,d*u+s*c,0,d*c+s*u,f*c+n,f*u-s*a,0,d*u-s*c,f*u+s*a,r*u*u+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,c=t._z,u=t._w,d=r+r,f=a+a,m=c+c,v=r*d,g=r*f,b=r*m,y=a*f,x=a*m,_=c*m,w=u*d,E=u*f,M=u*m,P=n.x,D=n.y,O=n.z;return s[0]=(1-(y+_))*P,s[1]=(g+M)*P,s[2]=(b-E)*P,s[3]=0,s[4]=(g-M)*D,s[5]=(1-(v+_))*D,s[6]=(x+w)*D,s[7]=0,s[8]=(b+E)*O,s[9]=(x-w)*O,s[10]=(1-(v+y))*O,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Ms.set(s[0],s[1],s[2]).length();const a=Ms.set(s[4],s[5],s[6]).length(),c=Ms.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Ln.copy(this);const d=1/r,f=1/a,m=1/c;return Ln.elements[0]*=d,Ln.elements[1]*=d,Ln.elements[2]*=d,Ln.elements[4]*=f,Ln.elements[5]*=f,Ln.elements[6]*=f,Ln.elements[8]*=m,Ln.elements[9]*=m,Ln.elements[10]*=m,t.setFromRotationMatrix(Ln),n.x=r,n.y=a,n.z=c,this}makePerspective(e,t,n,s,r,a,c=ai){const u=this.elements,d=2*r/(t-e),f=2*r/(n-s),m=(t+e)/(t-e),v=(n+s)/(n-s);let g,b;if(c===ai)g=-(a+r)/(a-r),b=-2*a*r/(a-r);else if(c===$o)g=-a/(a-r),b=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+c);return u[0]=d,u[4]=0,u[8]=m,u[12]=0,u[1]=0,u[5]=f,u[9]=v,u[13]=0,u[2]=0,u[6]=0,u[10]=g,u[14]=b,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,t,n,s,r,a,c=ai){const u=this.elements,d=1/(t-e),f=1/(n-s),m=1/(a-r),v=(t+e)*d,g=(n+s)*f;let b,y;if(c===ai)b=(a+r)*m,y=-2*m;else if(c===$o)b=r*m,y=-1*m;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+c);return u[0]=2*d,u[4]=0,u[8]=0,u[12]=-v,u[1]=0,u[5]=2*f,u[9]=0,u[13]=-g,u[2]=0,u[6]=0,u[10]=y,u[14]=-b,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ms=new I,Ln=new _t,x0=new I(0,0,0),b0=new I(1,1,1),yi=new I,oo=new I,vn=new I,Tu=new _t,Ru=new Ui;class en{constructor(e=0,t=0,n=0,s=en.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],c=s[8],u=s[1],d=s[5],f=s[9],m=s[2],v=s[6],g=s[10];switch(t){case"XYZ":this._y=Math.asin(ht(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-f,g),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(v,d),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(c,g),this._z=Math.atan2(u,d)):(this._y=Math.atan2(-m,r),this._z=0);break;case"ZXY":this._x=Math.asin(ht(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(-m,g),this._z=Math.atan2(-a,d)):(this._y=0,this._z=Math.atan2(u,r));break;case"ZYX":this._y=Math.asin(-ht(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(v,g),this._z=Math.atan2(u,r)):(this._x=0,this._z=Math.atan2(-a,d));break;case"YZX":this._z=Math.asin(ht(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-f,d),this._y=Math.atan2(-m,r)):(this._x=0,this._y=Math.atan2(c,g));break;case"XZY":this._z=Math.asin(-ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(v,d),this._y=Math.atan2(c,r)):(this._x=Math.atan2(-f,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Tu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Tu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ru.setFromEuler(this),this.setFromQuaternion(Ru,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}en.DEFAULT_ORDER="XYZ";class Ep{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let y0=0;const Pu=new I,Es=new Ui,Jn=new _t,ao=new I,br=new I,w0=new I,S0=new Ui,Lu=new I(1,0,0),Iu=new I(0,1,0),Du=new I(0,0,1),Uu={type:"added"},M0={type:"removed"},As={type:"childadded",child:null},il={type:"childremoved",child:null};class Et extends is{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:y0++}),this.uuid=nr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new I,t=new en,n=new Ui,s=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new _t},normalMatrix:{value:new et}}),this.matrix=new _t,this.matrixWorld=new _t,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ep,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Es.setFromAxisAngle(e,t),this.quaternion.multiply(Es),this}rotateOnWorldAxis(e,t){return Es.setFromAxisAngle(e,t),this.quaternion.premultiply(Es),this}rotateX(e){return this.rotateOnAxis(Lu,e)}rotateY(e){return this.rotateOnAxis(Iu,e)}rotateZ(e){return this.rotateOnAxis(Du,e)}translateOnAxis(e,t){return Pu.copy(e).applyQuaternion(this.quaternion),this.position.add(Pu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Lu,e)}translateY(e){return this.translateOnAxis(Iu,e)}translateZ(e){return this.translateOnAxis(Du,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Jn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ao.copy(e):ao.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),br.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Jn.lookAt(br,ao,this.up):Jn.lookAt(ao,br,this.up),this.quaternion.setFromRotationMatrix(Jn),s&&(Jn.extractRotation(s.matrixWorld),Es.setFromRotationMatrix(Jn),this.quaternion.premultiply(Es.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Uu),As.child=e,this.dispatchEvent(As),As.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(M0),il.child=e,this.dispatchEvent(il),il.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Jn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Jn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Jn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Uu),As.child=e,this.dispatchEvent(As),As.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,e,w0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(br,S0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(c=>({boxInitialized:c.boxInitialized,boxMin:c.box.min.toArray(),boxMax:c.box.max.toArray(),sphereInitialized:c.sphereInitialized,sphereRadius:c.sphere.radius,sphereCenter:c.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(c,u){return c[u.uuid]===void 0&&(c[u.uuid]=u.toJSON(e)),u.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const c=this.geometry.parameters;if(c!==void 0&&c.shapes!==void 0){const u=c.shapes;if(Array.isArray(u))for(let d=0,f=u.length;d<f;d++){const m=u[d];r(e.shapes,m)}else r(e.shapes,u)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const c=[];for(let u=0,d=this.material.length;u<d;u++)c.push(r(e.materials,this.material[u]));s.material=c}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let c=0;c<this.children.length;c++)s.children.push(this.children[c].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let c=0;c<this.animations.length;c++){const u=this.animations[c];s.animations.push(r(e.animations,u))}}if(t){const c=a(e.geometries),u=a(e.materials),d=a(e.textures),f=a(e.images),m=a(e.shapes),v=a(e.skeletons),g=a(e.animations),b=a(e.nodes);c.length>0&&(n.geometries=c),u.length>0&&(n.materials=u),d.length>0&&(n.textures=d),f.length>0&&(n.images=f),m.length>0&&(n.shapes=m),v.length>0&&(n.skeletons=v),g.length>0&&(n.animations=g),b.length>0&&(n.nodes=b)}return n.object=s,n;function a(c){const u=[];for(const d in c){const f=c[d];delete f.metadata,u.push(f)}return u}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Et.DEFAULT_UP=new I(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const In=new I,Qn=new I,sl=new I,ei=new I,Cs=new I,Ts=new I,Nu=new I,rl=new I,ol=new I,al=new I,ll=new Mt,cl=new Mt,hl=new Mt;class Nn{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),In.subVectors(e,t),s.cross(In);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){In.subVectors(s,t),Qn.subVectors(n,t),sl.subVectors(e,t);const a=In.dot(In),c=In.dot(Qn),u=In.dot(sl),d=Qn.dot(Qn),f=Qn.dot(sl),m=a*d-c*c;if(m===0)return r.set(0,0,0),null;const v=1/m,g=(d*u-c*f)*v,b=(a*f-c*u)*v;return r.set(1-g-b,b,g)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ei)===null?!1:ei.x>=0&&ei.y>=0&&ei.x+ei.y<=1}static getInterpolation(e,t,n,s,r,a,c,u){return this.getBarycoord(e,t,n,s,ei)===null?(u.x=0,u.y=0,"z"in u&&(u.z=0),"w"in u&&(u.w=0),null):(u.setScalar(0),u.addScaledVector(r,ei.x),u.addScaledVector(a,ei.y),u.addScaledVector(c,ei.z),u)}static getInterpolatedAttribute(e,t,n,s,r,a){return ll.setScalar(0),cl.setScalar(0),hl.setScalar(0),ll.fromBufferAttribute(e,t),cl.fromBufferAttribute(e,n),hl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(ll,r.x),a.addScaledVector(cl,r.y),a.addScaledVector(hl,r.z),a}static isFrontFacing(e,t,n,s){return In.subVectors(n,t),Qn.subVectors(e,t),In.cross(Qn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return In.subVectors(this.c,this.b),Qn.subVectors(this.a,this.b),In.cross(Qn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Nn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Nn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Nn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Nn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Nn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,c;Cs.subVectors(s,n),Ts.subVectors(r,n),rl.subVectors(e,n);const u=Cs.dot(rl),d=Ts.dot(rl);if(u<=0&&d<=0)return t.copy(n);ol.subVectors(e,s);const f=Cs.dot(ol),m=Ts.dot(ol);if(f>=0&&m<=f)return t.copy(s);const v=u*m-f*d;if(v<=0&&u>=0&&f<=0)return a=u/(u-f),t.copy(n).addScaledVector(Cs,a);al.subVectors(e,r);const g=Cs.dot(al),b=Ts.dot(al);if(b>=0&&g<=b)return t.copy(r);const y=g*d-u*b;if(y<=0&&d>=0&&b<=0)return c=d/(d-b),t.copy(n).addScaledVector(Ts,c);const x=f*b-g*m;if(x<=0&&m-f>=0&&g-b>=0)return Nu.subVectors(r,s),c=(m-f)/(m-f+(g-b)),t.copy(s).addScaledVector(Nu,c);const _=1/(x+y+v);return a=y*_,c=v*_,t.copy(n).addScaledVector(Cs,a).addScaledVector(Ts,c)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ap={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wi={h:0,s:0,l:0},lo={h:0,s:0,l:0};function ul(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ke{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=bn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,vt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=vt.workingColorSpace){return this.r=e,this.g=t,this.b=n,vt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=vt.workingColorSpace){if(e=Hc(e,1),t=ht(t,0,1),n=ht(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=ul(a,r,e+1/3),this.g=ul(a,r,e),this.b=ul(a,r,e-1/3)}return vt.toWorkingColorSpace(this,s),this}setStyle(e,t=bn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],c=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(c))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=bn){const n=Ap[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=li(e.r),this.g=li(e.g),this.b=li(e.b),this}copyLinearToSRGB(e){return this.r=Vs(e.r),this.g=Vs(e.g),this.b=Vs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bn){return vt.fromWorkingColorSpace(Jt.copy(this),e),Math.round(ht(Jt.r*255,0,255))*65536+Math.round(ht(Jt.g*255,0,255))*256+Math.round(ht(Jt.b*255,0,255))}getHexString(e=bn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=vt.workingColorSpace){vt.fromWorkingColorSpace(Jt.copy(this),t);const n=Jt.r,s=Jt.g,r=Jt.b,a=Math.max(n,s,r),c=Math.min(n,s,r);let u,d;const f=(c+a)/2;if(c===a)u=0,d=0;else{const m=a-c;switch(d=f<=.5?m/(a+c):m/(2-a-c),a){case n:u=(s-r)/m+(s<r?6:0);break;case s:u=(r-n)/m+2;break;case r:u=(n-s)/m+4;break}u/=6}return e.h=u,e.s=d,e.l=f,e}getRGB(e,t=vt.workingColorSpace){return vt.fromWorkingColorSpace(Jt.copy(this),t),e.r=Jt.r,e.g=Jt.g,e.b=Jt.b,e}getStyle(e=bn){vt.fromWorkingColorSpace(Jt.copy(this),e);const t=Jt.r,n=Jt.g,s=Jt.b;return e!==bn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(wi),this.setHSL(wi.h+e,wi.s+t,wi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(wi),e.getHSL(lo);const n=Rr(wi.h,lo.h,t),s=Rr(wi.s,lo.s,t),r=Rr(wi.l,lo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Jt=new Ke;Ke.NAMES=Ap;let E0=0;class ss extends is{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:E0++}),this.uuid=nr(),this.name="",this.type="Material",this.blending=Wn,this.side=Ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=zl,this.blendDst=Vl,this.blendEquation=Ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=Xs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=bu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=xs,this.stencilZFail=xs,this.stencilZPass=xs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Wn&&(n.blending=this.blending),this.side!==Ii&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==zl&&(n.blendSrc=this.blendSrc),this.blendDst!==Vl&&(n.blendDst=this.blendDst),this.blendEquation!==Ji&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Xs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==bu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==xs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==xs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==xs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const c in r){const u=r[c];delete u.metadata,a.push(u)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Xc extends ss{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new en,this.combine=Uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ft=new I,co=new Ue;class Dt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=yu,this.updateRanges=[],this.gpuType=Tn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)co.fromBufferAttribute(this,t),co.applyMatrix3(e),this.setXY(t,co.x,co.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix3(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ns(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=sn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ns(t,this.array)),t}setX(e,t){return this.normalized&&(t=sn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ns(t,this.array)),t}setY(e,t){return this.normalized&&(t=sn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ns(t,this.array)),t}setZ(e,t){return this.normalized&&(t=sn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ns(t,this.array)),t}setW(e,t){return this.normalized&&(t=sn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=sn(t,this.array),n=sn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=sn(t,this.array),n=sn(n,this.array),s=sn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=sn(t,this.array),n=sn(n,this.array),s=sn(s,this.array),r=sn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==yu&&(e.usage=this.usage),e}}class Cp extends Dt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Tp extends Dt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Rn extends Dt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let A0=0;const Cn=new _t,dl=new Et,Rs=new I,_n=new fn,yr=new fn,Wt=new I;class Mn extends is{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:A0++}),this.uuid=nr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(yp(e)?Tp:Cp)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new et().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Cn.makeRotationFromQuaternion(e),this.applyMatrix4(Cn),this}rotateX(e){return Cn.makeRotationX(e),this.applyMatrix4(Cn),this}rotateY(e){return Cn.makeRotationY(e),this.applyMatrix4(Cn),this}rotateZ(e){return Cn.makeRotationZ(e),this.applyMatrix4(Cn),this}translate(e,t,n){return Cn.makeTranslation(e,t,n),this.applyMatrix4(Cn),this}scale(e,t,n){return Cn.makeScale(e,t,n),this.applyMatrix4(Cn),this}lookAt(e){return dl.lookAt(e),dl.updateMatrix(),this.applyMatrix4(dl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Rs).negate(),this.translate(Rs.x,Rs.y,Rs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Rn(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];_n.setFromBufferAttribute(r),this.morphTargetsRelative?(Wt.addVectors(this.boundingBox.min,_n.min),this.boundingBox.expandByPoint(Wt),Wt.addVectors(this.boundingBox.max,_n.max),this.boundingBox.expandByPoint(Wt)):(this.boundingBox.expandByPoint(_n.min),this.boundingBox.expandByPoint(_n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ca);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(_n.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const c=t[r];yr.setFromBufferAttribute(c),this.morphTargetsRelative?(Wt.addVectors(_n.min,yr.min),_n.expandByPoint(Wt),Wt.addVectors(_n.max,yr.max),_n.expandByPoint(Wt)):(_n.expandByPoint(yr.min),_n.expandByPoint(yr.max))}_n.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Wt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Wt));if(t)for(let r=0,a=t.length;r<a;r++){const c=t[r],u=this.morphTargetsRelative;for(let d=0,f=c.count;d<f;d++)Wt.fromBufferAttribute(c,d),u&&(Rs.fromBufferAttribute(e,d),Wt.add(Rs)),s=Math.max(s,n.distanceToSquared(Wt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),c=[],u=[];for(let U=0;U<n.count;U++)c[U]=new I,u[U]=new I;const d=new I,f=new I,m=new I,v=new Ue,g=new Ue,b=new Ue,y=new I,x=new I;function _(U,L,A){d.fromBufferAttribute(n,U),f.fromBufferAttribute(n,L),m.fromBufferAttribute(n,A),v.fromBufferAttribute(r,U),g.fromBufferAttribute(r,L),b.fromBufferAttribute(r,A),f.sub(d),m.sub(d),g.sub(v),b.sub(v);const F=1/(g.x*b.y-b.x*g.y);isFinite(F)&&(y.copy(f).multiplyScalar(b.y).addScaledVector(m,-g.y).multiplyScalar(F),x.copy(m).multiplyScalar(g.x).addScaledVector(f,-b.x).multiplyScalar(F),c[U].add(y),c[L].add(y),c[A].add(y),u[U].add(x),u[L].add(x),u[A].add(x))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let U=0,L=w.length;U<L;++U){const A=w[U],F=A.start,q=A.count;for(let X=F,J=F+q;X<J;X+=3)_(e.getX(X+0),e.getX(X+1),e.getX(X+2))}const E=new I,M=new I,P=new I,D=new I;function O(U){P.fromBufferAttribute(s,U),D.copy(P);const L=c[U];E.copy(L),E.sub(P.multiplyScalar(P.dot(L))).normalize(),M.crossVectors(D,L);const F=M.dot(u[U])<0?-1:1;a.setXYZW(U,E.x,E.y,E.z,F)}for(let U=0,L=w.length;U<L;++U){const A=w[U],F=A.start,q=A.count;for(let X=F,J=F+q;X<J;X+=3)O(e.getX(X+0)),O(e.getX(X+1)),O(e.getX(X+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Dt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let v=0,g=n.count;v<g;v++)n.setXYZ(v,0,0,0);const s=new I,r=new I,a=new I,c=new I,u=new I,d=new I,f=new I,m=new I;if(e)for(let v=0,g=e.count;v<g;v+=3){const b=e.getX(v+0),y=e.getX(v+1),x=e.getX(v+2);s.fromBufferAttribute(t,b),r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,x),f.subVectors(a,r),m.subVectors(s,r),f.cross(m),c.fromBufferAttribute(n,b),u.fromBufferAttribute(n,y),d.fromBufferAttribute(n,x),c.add(f),u.add(f),d.add(f),n.setXYZ(b,c.x,c.y,c.z),n.setXYZ(y,u.x,u.y,u.z),n.setXYZ(x,d.x,d.y,d.z)}else for(let v=0,g=t.count;v<g;v+=3)s.fromBufferAttribute(t,v+0),r.fromBufferAttribute(t,v+1),a.fromBufferAttribute(t,v+2),f.subVectors(a,r),m.subVectors(s,r),f.cross(m),n.setXYZ(v+0,f.x,f.y,f.z),n.setXYZ(v+1,f.x,f.y,f.z),n.setXYZ(v+2,f.x,f.y,f.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Wt.fromBufferAttribute(e,t),Wt.normalize(),e.setXYZ(t,Wt.x,Wt.y,Wt.z)}toNonIndexed(){function e(c,u){const d=c.array,f=c.itemSize,m=c.normalized,v=new d.constructor(u.length*f);let g=0,b=0;for(let y=0,x=u.length;y<x;y++){c.isInterleavedBufferAttribute?g=u[y]*c.data.stride+c.offset:g=u[y]*f;for(let _=0;_<f;_++)v[b++]=d[g++]}return new Dt(v,f,m)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Mn,n=this.index.array,s=this.attributes;for(const c in s){const u=s[c],d=e(u,n);t.setAttribute(c,d)}const r=this.morphAttributes;for(const c in r){const u=[],d=r[c];for(let f=0,m=d.length;f<m;f++){const v=d[f],g=e(v,n);u.push(g)}t.morphAttributes[c]=u}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let c=0,u=a.length;c<u;c++){const d=a[c];t.addGroup(d.start,d.count,d.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const u=this.parameters;for(const d in u)u[d]!==void 0&&(e[d]=u[d]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const u in n){const d=n[u];e.data.attributes[u]=d.toJSON(e.data)}const s={};let r=!1;for(const u in this.morphAttributes){const d=this.morphAttributes[u],f=[];for(let m=0,v=d.length;m<v;m++){const g=d[m];f.push(g.toJSON(e.data))}f.length>0&&(s[u]=f,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const c=this.boundingSphere;return c!==null&&(e.data.boundingSphere={center:c.center.toArray(),radius:c.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const d in s){const f=s[d];this.setAttribute(d,f.clone(t))}const r=e.morphAttributes;for(const d in r){const f=[],m=r[d];for(let v=0,g=m.length;v<g;v++)f.push(m[v].clone(t));this.morphAttributes[d]=f}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let d=0,f=a.length;d<f;d++){const m=a[d];this.addGroup(m.start,m.count,m.materialIndex)}const c=e.boundingBox;c!==null&&(this.boundingBox=c.clone());const u=e.boundingSphere;return u!==null&&(this.boundingSphere=u.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ou=new _t,qi=new Mp,ho=new ca,Fu=new I,uo=new I,po=new I,fo=new I,pl=new I,mo=new I,Bu=new I,go=new I;class Lt extends Et{constructor(e=new Mn,t=new Xc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const c=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const c=this.morphTargetInfluences;if(r&&c){mo.set(0,0,0);for(let u=0,d=r.length;u<d;u++){const f=c[u],m=r[u];f!==0&&(pl.fromBufferAttribute(m,e),a?mo.addScaledVector(pl,f):mo.addScaledVector(pl.sub(t),f))}t.add(mo)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ho.copy(n.boundingSphere),ho.applyMatrix4(r),qi.copy(e.ray).recast(e.near),!(ho.containsPoint(qi.origin)===!1&&(qi.intersectSphere(ho,Fu)===null||qi.origin.distanceToSquared(Fu)>(e.far-e.near)**2))&&(Ou.copy(r).invert(),qi.copy(e.ray).applyMatrix4(Ou),!(n.boundingBox!==null&&qi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,qi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,c=r.index,u=r.attributes.position,d=r.attributes.uv,f=r.attributes.uv1,m=r.attributes.normal,v=r.groups,g=r.drawRange;if(c!==null)if(Array.isArray(a))for(let b=0,y=v.length;b<y;b++){const x=v[b],_=a[x.materialIndex],w=Math.max(x.start,g.start),E=Math.min(c.count,Math.min(x.start+x.count,g.start+g.count));for(let M=w,P=E;M<P;M+=3){const D=c.getX(M),O=c.getX(M+1),U=c.getX(M+2);s=vo(this,_,e,n,d,f,m,D,O,U),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const b=Math.max(0,g.start),y=Math.min(c.count,g.start+g.count);for(let x=b,_=y;x<_;x+=3){const w=c.getX(x),E=c.getX(x+1),M=c.getX(x+2);s=vo(this,a,e,n,d,f,m,w,E,M),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}else if(u!==void 0)if(Array.isArray(a))for(let b=0,y=v.length;b<y;b++){const x=v[b],_=a[x.materialIndex],w=Math.max(x.start,g.start),E=Math.min(u.count,Math.min(x.start+x.count,g.start+g.count));for(let M=w,P=E;M<P;M+=3){const D=M,O=M+1,U=M+2;s=vo(this,_,e,n,d,f,m,D,O,U),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const b=Math.max(0,g.start),y=Math.min(u.count,g.start+g.count);for(let x=b,_=y;x<_;x+=3){const w=x,E=x+1,M=x+2;s=vo(this,a,e,n,d,f,m,w,E,M),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}}}function C0(i,e,t,n,s,r,a,c){let u;if(e.side===pn?u=n.intersectTriangle(a,r,s,!0,c):u=n.intersectTriangle(s,r,a,e.side===Ii,c),u===null)return null;go.copy(c),go.applyMatrix4(i.matrixWorld);const d=t.ray.origin.distanceTo(go);return d<t.near||d>t.far?null:{distance:d,point:go.clone(),object:i}}function vo(i,e,t,n,s,r,a,c,u,d){i.getVertexPosition(c,uo),i.getVertexPosition(u,po),i.getVertexPosition(d,fo);const f=C0(i,e,t,n,uo,po,fo,Bu);if(f){const m=new I;Nn.getBarycoord(Bu,uo,po,fo,m),s&&(f.uv=Nn.getInterpolatedAttribute(s,c,u,d,m,new Ue)),r&&(f.uv1=Nn.getInterpolatedAttribute(r,c,u,d,m,new Ue)),a&&(f.normal=Nn.getInterpolatedAttribute(a,c,u,d,m,new I),f.normal.dot(n.direction)>0&&f.normal.multiplyScalar(-1));const v={a:c,b:u,c:d,normal:new I,materialIndex:0};Nn.getNormal(uo,po,fo,v.normal),f.face=v,f.barycoord=m}return f}class rs extends Mn{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const c=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const u=[],d=[],f=[],m=[];let v=0,g=0;b("z","y","x",-1,-1,n,t,e,a,r,0),b("z","y","x",1,-1,n,t,-e,a,r,1),b("x","z","y",1,1,e,n,t,s,a,2),b("x","z","y",1,-1,e,n,-t,s,a,3),b("x","y","z",1,-1,e,t,n,s,r,4),b("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(u),this.setAttribute("position",new Rn(d,3)),this.setAttribute("normal",new Rn(f,3)),this.setAttribute("uv",new Rn(m,2));function b(y,x,_,w,E,M,P,D,O,U,L){const A=M/O,F=P/U,q=M/2,X=P/2,J=D/2,Q=O+1,te=U+1;let ee=0,z=0;const le=new I;for(let ce=0;ce<te;ce++){const re=ce*F-X;for(let Re=0;Re<Q;Re++){const st=Re*A-q;le[y]=st*w,le[x]=re*E,le[_]=J,d.push(le.x,le.y,le.z),le[y]=0,le[x]=0,le[_]=D>0?1:-1,f.push(le.x,le.y,le.z),m.push(Re/O),m.push(1-ce/U),ee+=1}}for(let ce=0;ce<U;ce++)for(let re=0;re<O;re++){const Re=v+re+Q*ce,st=v+re+Q*(ce+1),Y=v+(re+1)+Q*(ce+1),ae=v+(re+1)+Q*ce;u.push(Re,st,ae),u.push(st,Y,ae),z+=6}c.addGroup(g,z,L),g+=z,v+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Qs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function rn(i){const e={};for(let t=0;t<i.length;t++){const n=Qs(i[t]);for(const s in n)e[s]=n[s]}return e}function T0(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Rp(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:vt.workingColorSpace}const R0={clone:Qs,merge:rn};var P0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,L0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class mn extends ss{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=P0,this.fragmentShader=L0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qs(e.uniforms),this.uniformsGroups=T0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Pp extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _t,this.projectionMatrix=new _t,this.projectionMatrixInverse=new _t,this.coordinateSystem=ai}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Si=new I,ku=new Ue,zu=new Ue;class un extends Pp{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Js*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Tr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Js*2*Math.atan(Math.tan(Tr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Si.x,Si.y).multiplyScalar(-e/Si.z),Si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Si.x,Si.y).multiplyScalar(-e/Si.z)}getViewSize(e,t){return this.getViewBounds(e,ku,zu),t.subVectors(zu,ku)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Tr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const u=a.fullWidth,d=a.fullHeight;r+=a.offsetX*s/u,t-=a.offsetY*n/d,s*=a.width/u,n*=a.height/d}const c=this.filmOffset;c!==0&&(r+=e*c/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ps=-90,Ls=1;class I0 extends Et{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new un(Ps,Ls,e,t);s.layers=this.layers,this.add(s);const r=new un(Ps,Ls,e,t);r.layers=this.layers,this.add(r);const a=new un(Ps,Ls,e,t);a.layers=this.layers,this.add(a);const c=new un(Ps,Ls,e,t);c.layers=this.layers,this.add(c);const u=new un(Ps,Ls,e,t);u.layers=this.layers,this.add(u);const d=new un(Ps,Ls,e,t);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,c,u]=t;for(const d of t)this.remove(d);if(e===ai)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),c.up.set(0,1,0),c.lookAt(0,0,1),u.up.set(0,1,0),u.lookAt(0,0,-1);else if(e===$o)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),c.up.set(0,-1,0),c.lookAt(0,0,1),u.up.set(0,-1,0),u.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const d of t)this.add(d),d.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,c,u,d,f]=this.children,m=e.getRenderTarget(),v=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),b=e.xr.enabled;e.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,c),e.setRenderTarget(n,3,s),e.render(t,u),e.setRenderTarget(n,4,s),e.render(t,d),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),e.render(t,f),e.setRenderTarget(m,v,g),e.xr.enabled=b,n.texture.needsPMREMUpdate=!0}}class Lp extends Tt{constructor(e,t,n,s,r,a,c,u,d,f){e=e!==void 0?e:[],t=t!==void 0?t:Ys,super(e,t,n,s,r,a,c,u,d,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class D0 extends Fn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Lp(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:zt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new rs(5,5,5),r=new mn({name:"CubemapFromEquirect",uniforms:Qs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:pn,blending:Ri});r.uniforms.tEquirect.value=t;const a=new Lt(s,r),c=t.minFilter;return t.minFilter===Ei&&(t.minFilter=zt),new I0(1,10,this).update(e,a),t.minFilter=c,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class ns extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new en,this.environmentIntensity=1,this.environmentRotation=new en,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Gs extends Tt{constructor(e=null,t=1,n=1,s,r,a,c,u,d=It,f=It,m,v){super(null,a,c,u,d,f,s,r,m,v),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const fl=new I,U0=new I,N0=new et;class yn{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=fl.subVectors(n,t).cross(U0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(fl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||N0.getNormalMatrix(e),s=this.coplanarPoint(fl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ji=new ca,_o=new I;class Yc{constructor(e=new yn,t=new yn,n=new yn,s=new yn,r=new yn,a=new yn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const c=this.planes;return c[0].copy(e),c[1].copy(t),c[2].copy(n),c[3].copy(s),c[4].copy(r),c[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ai){const n=this.planes,s=e.elements,r=s[0],a=s[1],c=s[2],u=s[3],d=s[4],f=s[5],m=s[6],v=s[7],g=s[8],b=s[9],y=s[10],x=s[11],_=s[12],w=s[13],E=s[14],M=s[15];if(n[0].setComponents(u-r,v-d,x-g,M-_).normalize(),n[1].setComponents(u+r,v+d,x+g,M+_).normalize(),n[2].setComponents(u+a,v+f,x+b,M+w).normalize(),n[3].setComponents(u-a,v-f,x-b,M-w).normalize(),n[4].setComponents(u-c,v-m,x-y,M-E).normalize(),t===ai)n[5].setComponents(u+c,v+m,x+y,M+E).normalize();else if(t===$o)n[5].setComponents(c,m,y,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ji.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ji.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ji)}intersectsSprite(e){return ji.center.set(0,0,0),ji.radius=.7071067811865476,ji.applyMatrix4(e.matrixWorld),this.intersectsSphere(ji)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(_o.x=s.normal.x>0?e.max.x:e.min.x,_o.y=s.normal.y>0?e.max.y:e.min.y,_o.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(_o)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ha extends ss{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Jo=new I,Qo=new I,Vu=new _t,wr=new Mp,xo=new ca,ml=new I,Gu=new I;class O0 extends Et{constructor(e=new Mn,t=new ha){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Jo.fromBufferAttribute(t,s-1),Qo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Jo.distanceTo(Qo);e.setAttribute("lineDistance",new Rn(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),xo.copy(n.boundingSphere),xo.applyMatrix4(s),xo.radius+=r,e.ray.intersectsSphere(xo)===!1)return;Vu.copy(s).invert(),wr.copy(e.ray).applyMatrix4(Vu);const c=r/((this.scale.x+this.scale.y+this.scale.z)/3),u=c*c,d=this.isLineSegments?2:1,f=n.index,v=n.attributes.position;if(f!==null){const g=Math.max(0,a.start),b=Math.min(f.count,a.start+a.count);for(let y=g,x=b-1;y<x;y+=d){const _=f.getX(y),w=f.getX(y+1),E=bo(this,e,wr,u,_,w);E&&t.push(E)}if(this.isLineLoop){const y=f.getX(b-1),x=f.getX(g),_=bo(this,e,wr,u,y,x);_&&t.push(_)}}else{const g=Math.max(0,a.start),b=Math.min(v.count,a.start+a.count);for(let y=g,x=b-1;y<x;y+=d){const _=bo(this,e,wr,u,y,y+1);_&&t.push(_)}if(this.isLineLoop){const y=bo(this,e,wr,u,b-1,g);y&&t.push(y)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const c=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[c]=r}}}}}function bo(i,e,t,n,s,r){const a=i.geometry.attributes.position;if(Jo.fromBufferAttribute(a,s),Qo.fromBufferAttribute(a,r),t.distanceSqToSegment(Jo,Qo,ml,Gu)>n)return;ml.applyMatrix4(i.matrixWorld);const u=e.ray.origin.distanceTo(ml);if(!(u<e.near||u>e.far))return{distance:u,point:Gu.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}const Hu=new I,Wu=new I;class qc extends O0{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Hu.fromBufferAttribute(t,s),Wu.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Hu.distanceTo(Wu);e.setAttribute("lineDistance",new Rn(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ai extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}class gl extends Tt{constructor(e,t,n,s,r,a,c,u,d,f,m,v){super(null,a,c,u,d,f,s,r,m,v),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}class jc extends Tt{constructor(e,t,n,s,r,a,c,u,d,f=zs){if(f!==zs&&f!==Ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&f===zs&&(n=Di),n===void 0&&f===Ks&&(n=$s),super(null,s,r,a,c,u,f,n,d),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=c!==void 0?c:It,this.minFilter=u!==void 0?u:It,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Ni extends Mn{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,c=Math.floor(n),u=Math.floor(s),d=c+1,f=u+1,m=e/c,v=t/u,g=[],b=[],y=[],x=[];for(let _=0;_<f;_++){const w=_*v-a;for(let E=0;E<d;E++){const M=E*m-r;b.push(M,-w,0),y.push(0,0,1),x.push(E/c),x.push(1-_/u)}}for(let _=0;_<u;_++)for(let w=0;w<c;w++){const E=w+d*_,M=w+d*(_+1),P=w+1+d*(_+1),D=w+1+d*_;g.push(E,M,D),g.push(M,P,D)}this.setIndex(g),this.setAttribute("position",new Rn(b,3)),this.setAttribute("normal",new Rn(y,3)),this.setAttribute("uv",new Rn(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ni(e.width,e.height,e.widthSegments,e.heightSegments)}}class F0 extends ss{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Ke(16777215),this.specular=new Ke(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xp,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new en,this.combine=Uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class B0 extends ss{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Fv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class k0 extends ss{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}let $c=class extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}};const vl=new _t,Xu=new I,Yu=new I;class Ip{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.map=null,this.mapPass=null,this.matrix=new _t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Yc,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Xu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Xu),Yu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Yu),t.updateMatrixWorld(),vl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vl),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(vl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class z0 extends Ip{constructor(){super(new un(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=Js*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class qu extends $c{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new z0}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class oi extends Pp{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,c=s+t,u=s-t;if(this.view!==null&&this.view.enabled){const d=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=d*this.view.offsetX,a=r+d*this.view.width,c-=f*this.view.offsetY,u=c-f*this.view.height}this.projectionMatrix.makeOrthographic(r,a,c,u,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class V0 extends Ip{constructor(){super(new oi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class yo extends $c{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new V0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ju extends $c{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class G0 extends un{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}const Kc="\\[\\]\\.:\\/",H0=new RegExp("["+Kc+"]","g"),Zc="[^"+Kc+"]",W0="[^"+Kc.replace("\\.","")+"]",X0=/((?:WC+[\/:])*)/.source.replace("WC",Zc),Y0=/(WCOD+)?/.source.replace("WCOD",W0),q0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Zc),j0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Zc),$0=new RegExp("^"+X0+Y0+q0+j0+"$"),K0=["material","materials","bones","map"];class Z0{constructor(e,t,n){const s=n||gt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class gt{constructor(e,t,n){this.path=t,this.parsedPath=n||gt.parseTrackName(t),this.node=gt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new gt.Composite(e,t,n):new gt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(H0,"")}static parseTrackName(e){const t=$0.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);K0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const c=r[a];if(c.name===t||c.uuid===t)return c;const u=n(c.children);if(u)return u}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=gt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let d=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let f=0;f<e.length;f++)if(e[f].name===d){d=f;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(d!==void 0){if(e[d]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[d]}}const a=e[s];if(a===void 0){const d=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+d+"."+s+" but it wasn't found.",e);return}let c=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?c=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(c=this.Versioning.MatrixWorldNeedsUpdate);let u=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}u=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(u=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(u=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[u],this.setValue=this.SetterByBindingTypeAndVersioning[u][c]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}gt.Composite=Z0;gt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};gt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};gt.prototype.GetterByBindingType=[gt.prototype._getValue_direct,gt.prototype._getValue_array,gt.prototype._getValue_arrayElement,gt.prototype._getValue_toArray];gt.prototype.SetterByBindingTypeAndVersioning=[[gt.prototype._setValue_direct,gt.prototype._setValue_direct_setNeedsUpdate,gt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_array,gt.prototype._setValue_array_setNeedsUpdate,gt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_arrayElement,gt.prototype._setValue_arrayElement_setNeedsUpdate,gt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[gt.prototype._setValue_fromArray,gt.prototype._setValue_fromArray_setNeedsUpdate,gt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Dp extends qc{constructor(e,t=16776960){const n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new Mn;r.setIndex(new Dt(n,1)),r.setAttribute("position",new Rn(s,3)),super(r,new ha({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class J0 extends qc{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Mn;s.setAttribute("position",new Rn(t,3)),s.setAttribute("color",new Rn(n,3));const r=new ha({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){const s=new Ke,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}function $u(i,e,t,n){const s=Q0(n);switch(t){case fp:return i*e;case zc:return i*e;case gp:return i*e*2;case la:return i*e/s.components*s.byteLength;case ii:return i*e/s.components*s.byteLength;case vp:return i*e*2/s.components*s.byteLength;case Vc:return i*e*2/s.components*s.byteLength;case mp:return i*e*3/s.components*s.byteLength;case Xt:return i*e*4/s.components*s.byteLength;case Gc:return i*e*4/s.components*s.byteLength;case Bo:case ko:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case zo:case Vo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Jl:case ec:return Math.max(i,16)*Math.max(e,8)/4;case Zl:case Ql:return Math.max(i,8)*Math.max(e,8)/2;case tc:case nc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ic:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case sc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case rc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case oc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ac:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case lc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case cc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case hc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case uc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case dc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case pc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case fc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case mc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case gc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case vc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Go:case _c:case xc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case _p:case bc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case yc:case wc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Q0(i){switch(i){case Qt:case Oc:return{byteLength:1,components:1};case js:case Fc:case Br:return{byteLength:2,components:1};case Bc:case kc:return{byteLength:2,components:4};case Di:case aa:case Tn:return{byteLength:4,components:1};case pp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ra}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ra);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Up(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function e_(i){const e=new WeakMap;function t(c,u){const d=c.array,f=c.usage,m=d.byteLength,v=i.createBuffer();i.bindBuffer(u,v),i.bufferData(u,d,f),c.onUploadCallback();let g;if(d instanceof Float32Array)g=i.FLOAT;else if(d instanceof Uint16Array)c.isFloat16BufferAttribute?g=i.HALF_FLOAT:g=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)g=i.SHORT;else if(d instanceof Uint32Array)g=i.UNSIGNED_INT;else if(d instanceof Int32Array)g=i.INT;else if(d instanceof Int8Array)g=i.BYTE;else if(d instanceof Uint8Array)g=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)g=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:v,type:g,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version,size:m}}function n(c,u,d){const f=u.array,m=u.updateRanges;if(i.bindBuffer(d,c),m.length===0)i.bufferSubData(d,0,f);else{m.sort((g,b)=>g.start-b.start);let v=0;for(let g=1;g<m.length;g++){const b=m[v],y=m[g];y.start<=b.start+b.count+1?b.count=Math.max(b.count,y.start+y.count-b.start):(++v,m[v]=y)}m.length=v+1;for(let g=0,b=m.length;g<b;g++){const y=m[g];i.bufferSubData(d,y.start*f.BYTES_PER_ELEMENT,f,y.start,y.count)}u.clearUpdateRanges()}u.onUploadCallback()}function s(c){return c.isInterleavedBufferAttribute&&(c=c.data),e.get(c)}function r(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=e.get(c);u&&(i.deleteBuffer(u.buffer),e.delete(c))}function a(c,u){if(c.isInterleavedBufferAttribute&&(c=c.data),c.isGLBufferAttribute){const f=e.get(c);(!f||f.version<c.version)&&e.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}const d=e.get(c);if(d===void 0)e.set(c,t(c,u));else if(d.version<c.version){if(d.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(d.buffer,c,u),d.version=c.version}}return{get:s,remove:r,update:a}}var t_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,n_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,i_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,s_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,r_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,o_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,a_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,l_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,c_=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,h_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,u_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,d_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,p_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,f_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,m_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,g_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,v_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,__=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,x_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,b_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,y_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,w_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,S_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,M_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,E_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,A_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,C_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,T_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,R_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,P_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,L_="gl_FragColor = linearToOutputTexel( gl_FragColor );",I_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,D_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,U_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,N_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,O_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,F_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,B_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,k_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,z_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,V_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,G_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,H_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,W_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,X_=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Y_=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,q_=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,j_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$_=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,K_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Z_=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,J_=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Q_=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ex=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,tx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,nx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ix=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,sx=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rx=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ox=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ax=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,lx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,cx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,hx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ux=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,dx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,px=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,mx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,vx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_x=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,xx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,bx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Sx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Mx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ex=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ax=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Cx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Tx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Rx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Px=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Lx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ix=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Dx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ux=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Nx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ox=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Fx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Bx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,kx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,zx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Vx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Gx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Hx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Wx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Xx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Yx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,jx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,$x=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Kx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Jx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Qx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const e1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,t1=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,i1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,s1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,r1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,o1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,a1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,l1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,c1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,h1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,u1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,d1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,p1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,f1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,m1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,v1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,x1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,b1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,y1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,w1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,S1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,E1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,A1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,C1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,T1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,R1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,P1=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,L1=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,I1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,D1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,it={alphahash_fragment:t_,alphahash_pars_fragment:n_,alphamap_fragment:i_,alphamap_pars_fragment:s_,alphatest_fragment:r_,alphatest_pars_fragment:o_,aomap_fragment:a_,aomap_pars_fragment:l_,batching_pars_vertex:c_,batching_vertex:h_,begin_vertex:u_,beginnormal_vertex:d_,bsdfs:p_,iridescence_fragment:f_,bumpmap_pars_fragment:m_,clipping_planes_fragment:g_,clipping_planes_pars_fragment:v_,clipping_planes_pars_vertex:__,clipping_planes_vertex:x_,color_fragment:b_,color_pars_fragment:y_,color_pars_vertex:w_,color_vertex:S_,common:M_,cube_uv_reflection_fragment:E_,defaultnormal_vertex:A_,displacementmap_pars_vertex:C_,displacementmap_vertex:T_,emissivemap_fragment:R_,emissivemap_pars_fragment:P_,colorspace_fragment:L_,colorspace_pars_fragment:I_,envmap_fragment:D_,envmap_common_pars_fragment:U_,envmap_pars_fragment:N_,envmap_pars_vertex:O_,envmap_physical_pars_fragment:q_,envmap_vertex:F_,fog_vertex:B_,fog_pars_vertex:k_,fog_fragment:z_,fog_pars_fragment:V_,gradientmap_pars_fragment:G_,lightmap_pars_fragment:H_,lights_lambert_fragment:W_,lights_lambert_pars_fragment:X_,lights_pars_begin:Y_,lights_toon_fragment:j_,lights_toon_pars_fragment:$_,lights_phong_fragment:K_,lights_phong_pars_fragment:Z_,lights_physical_fragment:J_,lights_physical_pars_fragment:Q_,lights_fragment_begin:ex,lights_fragment_maps:tx,lights_fragment_end:nx,logdepthbuf_fragment:ix,logdepthbuf_pars_fragment:sx,logdepthbuf_pars_vertex:rx,logdepthbuf_vertex:ox,map_fragment:ax,map_pars_fragment:lx,map_particle_fragment:cx,map_particle_pars_fragment:hx,metalnessmap_fragment:ux,metalnessmap_pars_fragment:dx,morphinstance_vertex:px,morphcolor_vertex:fx,morphnormal_vertex:mx,morphtarget_pars_vertex:gx,morphtarget_vertex:vx,normal_fragment_begin:_x,normal_fragment_maps:xx,normal_pars_fragment:bx,normal_pars_vertex:yx,normal_vertex:wx,normalmap_pars_fragment:Sx,clearcoat_normal_fragment_begin:Mx,clearcoat_normal_fragment_maps:Ex,clearcoat_pars_fragment:Ax,iridescence_pars_fragment:Cx,opaque_fragment:Tx,packing:Rx,premultiplied_alpha_fragment:Px,project_vertex:Lx,dithering_fragment:Ix,dithering_pars_fragment:Dx,roughnessmap_fragment:Ux,roughnessmap_pars_fragment:Nx,shadowmap_pars_fragment:Ox,shadowmap_pars_vertex:Fx,shadowmap_vertex:Bx,shadowmask_pars_fragment:kx,skinbase_vertex:zx,skinning_pars_vertex:Vx,skinning_vertex:Gx,skinnormal_vertex:Hx,specularmap_fragment:Wx,specularmap_pars_fragment:Xx,tonemapping_fragment:Yx,tonemapping_pars_fragment:qx,transmission_fragment:jx,transmission_pars_fragment:$x,uv_pars_fragment:Kx,uv_pars_vertex:Zx,uv_vertex:Jx,worldpos_vertex:Qx,background_vert:e1,background_frag:t1,backgroundCube_vert:n1,backgroundCube_frag:i1,cube_vert:s1,cube_frag:r1,depth_vert:o1,depth_frag:a1,distanceRGBA_vert:l1,distanceRGBA_frag:c1,equirect_vert:h1,equirect_frag:u1,linedashed_vert:d1,linedashed_frag:p1,meshbasic_vert:f1,meshbasic_frag:m1,meshlambert_vert:g1,meshlambert_frag:v1,meshmatcap_vert:_1,meshmatcap_frag:x1,meshnormal_vert:b1,meshnormal_frag:y1,meshphong_vert:w1,meshphong_frag:S1,meshphysical_vert:M1,meshphysical_frag:E1,meshtoon_vert:A1,meshtoon_frag:C1,points_vert:T1,points_frag:R1,shadow_vert:P1,shadow_frag:L1,sprite_vert:I1,sprite_frag:D1},xe={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new et}},envmap:{envMap:{value:null},envMapRotation:{value:new et},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new et},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0},uvTransform:{value:new et}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}}},Gn={basic:{uniforms:rn([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:it.meshbasic_vert,fragmentShader:it.meshbasic_frag},lambert:{uniforms:rn([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Ke(0)}}]),vertexShader:it.meshlambert_vert,fragmentShader:it.meshlambert_frag},phong:{uniforms:rn([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30}}]),vertexShader:it.meshphong_vert,fragmentShader:it.meshphong_frag},standard:{uniforms:rn([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag},toon:{uniforms:rn([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new Ke(0)}}]),vertexShader:it.meshtoon_vert,fragmentShader:it.meshtoon_frag},matcap:{uniforms:rn([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:it.meshmatcap_vert,fragmentShader:it.meshmatcap_frag},points:{uniforms:rn([xe.points,xe.fog]),vertexShader:it.points_vert,fragmentShader:it.points_frag},dashed:{uniforms:rn([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:it.linedashed_vert,fragmentShader:it.linedashed_frag},depth:{uniforms:rn([xe.common,xe.displacementmap]),vertexShader:it.depth_vert,fragmentShader:it.depth_frag},normal:{uniforms:rn([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:it.meshnormal_vert,fragmentShader:it.meshnormal_frag},sprite:{uniforms:rn([xe.sprite,xe.fog]),vertexShader:it.sprite_vert,fragmentShader:it.sprite_frag},background:{uniforms:{uvTransform:{value:new et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:it.background_vert,fragmentShader:it.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new et}},vertexShader:it.backgroundCube_vert,fragmentShader:it.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:it.cube_vert,fragmentShader:it.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:it.equirect_vert,fragmentShader:it.equirect_frag},distanceRGBA:{uniforms:rn([xe.common,xe.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:it.distanceRGBA_vert,fragmentShader:it.distanceRGBA_frag},shadow:{uniforms:rn([xe.lights,xe.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:it.shadow_vert,fragmentShader:it.shadow_frag}};Gn.physical={uniforms:rn([Gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new et},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new et},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new et},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new et},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new et},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new et},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new et}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag};const wo={r:0,b:0,g:0},$i=new en,U1=new _t;function N1(i,e,t,n,s,r,a){const c=new Ke(0);let u=r===!0?0:1,d,f,m=null,v=0,g=null;function b(E){let M=E.isScene===!0?E.background:null;return M&&M.isTexture&&(M=(E.backgroundBlurriness>0?t:e).get(M)),M}function y(E){let M=!1;const P=b(E);P===null?_(c,u):P&&P.isColor&&(_(P,1),M=!0);const D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(E,M){const P=b(M);P&&(P.isCubeTexture||P.mapping===oa)?(f===void 0&&(f=new Lt(new rs(1,1,1),new mn({name:"BackgroundCubeMaterial",uniforms:Qs(Gn.backgroundCube.uniforms),vertexShader:Gn.backgroundCube.vertexShader,fragmentShader:Gn.backgroundCube.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(D,O,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(f)),$i.copy(M.backgroundRotation),$i.x*=-1,$i.y*=-1,$i.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&($i.y*=-1,$i.z*=-1),f.material.uniforms.envMap.value=P,f.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,f.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(U1.makeRotationFromEuler($i)),f.material.toneMapped=vt.getTransfer(P.colorSpace)!==yt,(m!==P||v!==P.version||g!==i.toneMapping)&&(f.material.needsUpdate=!0,m=P,v=P.version,g=i.toneMapping),f.layers.enableAll(),E.unshift(f,f.geometry,f.material,0,0,null)):P&&P.isTexture&&(d===void 0&&(d=new Lt(new Ni(2,2),new mn({name:"BackgroundMaterial",uniforms:Qs(Gn.background.uniforms),vertexShader:Gn.background.vertexShader,fragmentShader:Gn.background.fragmentShader,side:Ii,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),Object.defineProperty(d.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(d)),d.material.uniforms.t2D.value=P,d.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,d.material.toneMapped=vt.getTransfer(P.colorSpace)!==yt,P.matrixAutoUpdate===!0&&P.updateMatrix(),d.material.uniforms.uvTransform.value.copy(P.matrix),(m!==P||v!==P.version||g!==i.toneMapping)&&(d.material.needsUpdate=!0,m=P,v=P.version,g=i.toneMapping),d.layers.enableAll(),E.unshift(d,d.geometry,d.material,0,0,null))}function _(E,M){E.getRGB(wo,Rp(i)),n.buffers.color.setClear(wo.r,wo.g,wo.b,M,a)}function w(){f!==void 0&&(f.geometry.dispose(),f.material.dispose()),d!==void 0&&(d.geometry.dispose(),d.material.dispose())}return{getClearColor:function(){return c},setClearColor:function(E,M=1){c.set(E),u=M,_(c,u)},getClearAlpha:function(){return u},setClearAlpha:function(E){u=E,_(c,u)},render:y,addToRenderList:x,dispose:w}}function O1(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=v(null);let r=s,a=!1;function c(A,F,q,X,J){let Q=!1;const te=m(X,q,F);r!==te&&(r=te,d(r.object)),Q=g(A,X,q,J),Q&&b(A,X,q,J),J!==null&&e.update(J,i.ELEMENT_ARRAY_BUFFER),(Q||a)&&(a=!1,M(A,F,q,X),J!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(J).buffer))}function u(){return i.createVertexArray()}function d(A){return i.bindVertexArray(A)}function f(A){return i.deleteVertexArray(A)}function m(A,F,q){const X=q.wireframe===!0;let J=n[A.id];J===void 0&&(J={},n[A.id]=J);let Q=J[F.id];Q===void 0&&(Q={},J[F.id]=Q);let te=Q[X];return te===void 0&&(te=v(u()),Q[X]=te),te}function v(A){const F=[],q=[],X=[];for(let J=0;J<t;J++)F[J]=0,q[J]=0,X[J]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:q,attributeDivisors:X,object:A,attributes:{},index:null}}function g(A,F,q,X){const J=r.attributes,Q=F.attributes;let te=0;const ee=q.getAttributes();for(const z in ee)if(ee[z].location>=0){const ce=J[z];let re=Q[z];if(re===void 0&&(z==="instanceMatrix"&&A.instanceMatrix&&(re=A.instanceMatrix),z==="instanceColor"&&A.instanceColor&&(re=A.instanceColor)),ce===void 0||ce.attribute!==re||re&&ce.data!==re.data)return!0;te++}return r.attributesNum!==te||r.index!==X}function b(A,F,q,X){const J={},Q=F.attributes;let te=0;const ee=q.getAttributes();for(const z in ee)if(ee[z].location>=0){let ce=Q[z];ce===void 0&&(z==="instanceMatrix"&&A.instanceMatrix&&(ce=A.instanceMatrix),z==="instanceColor"&&A.instanceColor&&(ce=A.instanceColor));const re={};re.attribute=ce,ce&&ce.data&&(re.data=ce.data),J[z]=re,te++}r.attributes=J,r.attributesNum=te,r.index=X}function y(){const A=r.newAttributes;for(let F=0,q=A.length;F<q;F++)A[F]=0}function x(A){_(A,0)}function _(A,F){const q=r.newAttributes,X=r.enabledAttributes,J=r.attributeDivisors;q[A]=1,X[A]===0&&(i.enableVertexAttribArray(A),X[A]=1),J[A]!==F&&(i.vertexAttribDivisor(A,F),J[A]=F)}function w(){const A=r.newAttributes,F=r.enabledAttributes;for(let q=0,X=F.length;q<X;q++)F[q]!==A[q]&&(i.disableVertexAttribArray(q),F[q]=0)}function E(A,F,q,X,J,Q,te){te===!0?i.vertexAttribIPointer(A,F,q,J,Q):i.vertexAttribPointer(A,F,q,X,J,Q)}function M(A,F,q,X){y();const J=X.attributes,Q=q.getAttributes(),te=F.defaultAttributeValues;for(const ee in Q){const z=Q[ee];if(z.location>=0){let le=J[ee];if(le===void 0&&(ee==="instanceMatrix"&&A.instanceMatrix&&(le=A.instanceMatrix),ee==="instanceColor"&&A.instanceColor&&(le=A.instanceColor)),le!==void 0){const ce=le.normalized,re=le.itemSize,Re=e.get(le);if(Re===void 0)continue;const st=Re.buffer,Y=Re.type,ae=Re.bytesPerElement,ye=Y===i.INT||Y===i.UNSIGNED_INT||le.gpuType===aa;if(le.isInterleavedBufferAttribute){const me=le.data,Le=me.stride,Fe=le.offset;if(me.isInstancedInterleavedBuffer){for(let Ve=0;Ve<z.locationSize;Ve++)_(z.location+Ve,me.meshPerAttribute);A.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let Ve=0;Ve<z.locationSize;Ve++)x(z.location+Ve);i.bindBuffer(i.ARRAY_BUFFER,st);for(let Ve=0;Ve<z.locationSize;Ve++)E(z.location+Ve,re/z.locationSize,Y,ce,Le*ae,(Fe+re/z.locationSize*Ve)*ae,ye)}else{if(le.isInstancedBufferAttribute){for(let me=0;me<z.locationSize;me++)_(z.location+me,le.meshPerAttribute);A.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let me=0;me<z.locationSize;me++)x(z.location+me);i.bindBuffer(i.ARRAY_BUFFER,st);for(let me=0;me<z.locationSize;me++)E(z.location+me,re/z.locationSize,Y,ce,re*ae,re/z.locationSize*me*ae,ye)}}else if(te!==void 0){const ce=te[ee];if(ce!==void 0)switch(ce.length){case 2:i.vertexAttrib2fv(z.location,ce);break;case 3:i.vertexAttrib3fv(z.location,ce);break;case 4:i.vertexAttrib4fv(z.location,ce);break;default:i.vertexAttrib1fv(z.location,ce)}}}}w()}function P(){U();for(const A in n){const F=n[A];for(const q in F){const X=F[q];for(const J in X)f(X[J].object),delete X[J];delete F[q]}delete n[A]}}function D(A){if(n[A.id]===void 0)return;const F=n[A.id];for(const q in F){const X=F[q];for(const J in X)f(X[J].object),delete X[J];delete F[q]}delete n[A.id]}function O(A){for(const F in n){const q=n[F];if(q[A.id]===void 0)continue;const X=q[A.id];for(const J in X)f(X[J].object),delete X[J];delete q[A.id]}}function U(){L(),a=!0,r!==s&&(r=s,d(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:c,reset:U,resetDefaultState:L,dispose:P,releaseStatesOfGeometry:D,releaseStatesOfProgram:O,initAttributes:y,enableAttribute:x,disableUnusedAttributes:w}}function F1(i,e,t){let n;function s(d){n=d}function r(d,f){i.drawArrays(n,d,f),t.update(f,n,1)}function a(d,f,m){m!==0&&(i.drawArraysInstanced(n,d,f,m),t.update(f,n,m))}function c(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,d,0,f,0,m);let g=0;for(let b=0;b<m;b++)g+=f[b];t.update(g,n,1)}function u(d,f,m,v){if(m===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let b=0;b<d.length;b++)a(d[b],f[b],v[b]);else{g.multiDrawArraysInstancedWEBGL(n,d,0,f,0,v,0,m);let b=0;for(let y=0;y<m;y++)b+=f[y]*v[y];t.update(b,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=c,this.renderMultiDrawInstances=u}function B1(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const O=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(O.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(O){return!(O!==Xt&&n.convert(O)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function c(O){const U=O===Br&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(O!==Qt&&n.convert(O)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&O!==Tn&&!U)}function u(O){if(O==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";O="mediump"}return O==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=t.precision!==void 0?t.precision:"highp";const f=u(d);f!==d&&(console.warn("THREE.WebGLRenderer:",d,"not supported, using",f,"instead."),d=f);const m=t.logarithmicDepthBuffer===!0,v=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),g=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),b=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),w=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),P=b>0,D=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:u,textureFormatReadable:a,textureTypeReadable:c,precision:d,logarithmicDepthBuffer:m,reverseDepthBuffer:v,maxTextures:g,maxVertexTextures:b,maxTextureSize:y,maxCubemapSize:x,maxAttributes:_,maxVertexUniforms:w,maxVaryings:E,maxFragmentUniforms:M,vertexTextures:P,maxSamples:D}}function k1(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new yn,c=new et,u={value:null,needsUpdate:!1};this.uniform=u,this.numPlanes=0,this.numIntersection=0,this.init=function(m,v){const g=m.length!==0||v||n!==0||s;return s=v,n=m.length,g},this.beginShadows=function(){r=!0,f(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(m,v){t=f(m,v,0)},this.setState=function(m,v,g){const b=m.clippingPlanes,y=m.clipIntersection,x=m.clipShadows,_=i.get(m);if(!s||b===null||b.length===0||r&&!x)r?f(null):d();else{const w=r?0:n,E=w*4;let M=_.clippingState||null;u.value=M,M=f(b,v,E,g);for(let P=0;P!==E;++P)M[P]=t[P];_.clippingState=M,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=w}};function d(){u.value!==t&&(u.value=t,u.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function f(m,v,g,b){const y=m!==null?m.length:0;let x=null;if(y!==0){if(x=u.value,b!==!0||x===null){const _=g+y*4,w=v.matrixWorldInverse;c.getNormalMatrix(w),(x===null||x.length<_)&&(x=new Float32Array(_));for(let E=0,M=g;E!==y;++E,M+=4)a.copy(m[E]).applyMatrix4(w,c),a.normal.toArray(x,M),x[M+3]=a.constant}u.value=x,u.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,x}}function z1(i){let e=new WeakMap;function t(a,c){return c===$l?a.mapping=Ys:c===Kl&&(a.mapping=qs),a}function n(a){if(a&&a.isTexture){const c=a.mapping;if(c===$l||c===Kl)if(e.has(a)){const u=e.get(a).texture;return t(u,a.mapping)}else{const u=a.image;if(u&&u.height>0){const d=new D0(u.height);return d.fromEquirectangularTexture(i,a),e.set(a,d),a.addEventListener("dispose",s),t(d.texture,a.mapping)}else return null}}return a}function s(a){const c=a.target;c.removeEventListener("dispose",s);const u=e.get(c);u!==void 0&&(e.delete(c),u.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Bs=4,Ku=[.125,.215,.35,.446,.526,.582],Qi=20,_l=new oi,Zu=new Ke;let xl=null,bl=0,yl=0,wl=!1;const Zi=(1+Math.sqrt(5))/2,Is=1/Zi,Ju=[new I(-Zi,Is,0),new I(Zi,Is,0),new I(-Is,0,Zi),new I(Is,0,Zi),new I(0,Zi,-Is),new I(0,Zi,Is),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)];class Qu{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){xl=this._renderer.getRenderTarget(),bl=this._renderer.getActiveCubeFace(),yl=this._renderer.getActiveMipmapLevel(),wl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=nd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=td(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(xl,bl,yl),this._renderer.xr.enabled=wl,e.scissorTest=!1,So(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ys||e.mapping===qs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xl=this._renderer.getRenderTarget(),bl=this._renderer.getActiveCubeFace(),yl=this._renderer.getActiveMipmapLevel(),wl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:zt,minFilter:zt,generateMipmaps:!1,type:Br,format:Xt,colorSpace:Zs,depthBuffer:!1},s=ed(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ed(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=V1(r)),this._blurMaterial=G1(r,e,t)}return s}_compileMaterial(e){const t=new Lt(this._lodPlanes[0],e);this._renderer.compile(t,_l)}_sceneToCubeUV(e,t,n,s){const c=new un(90,1,t,n),u=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],f=this._renderer,m=f.autoClear,v=f.toneMapping;f.getClearColor(Zu),f.toneMapping=Pi,f.autoClear=!1;const g=new Xc({name:"PMREM.Background",side:pn,depthWrite:!1,depthTest:!1}),b=new Lt(new rs,g);let y=!1;const x=e.background;x?x.isColor&&(g.color.copy(x),e.background=null,y=!0):(g.color.copy(Zu),y=!0);for(let _=0;_<6;_++){const w=_%3;w===0?(c.up.set(0,u[_],0),c.lookAt(d[_],0,0)):w===1?(c.up.set(0,0,u[_]),c.lookAt(0,d[_],0)):(c.up.set(0,u[_],0),c.lookAt(0,0,d[_]));const E=this._cubeSize;So(s,w*E,_>2?E:0,E,E),f.setRenderTarget(s),y&&f.render(b,c),f.render(e,c)}b.geometry.dispose(),b.material.dispose(),f.toneMapping=v,f.autoClear=m,e.background=x}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ys||e.mapping===qs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=nd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=td());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Lt(this._lodPlanes[0],r),c=r.uniforms;c.envMap.value=e;const u=this._cubeSize;So(t,0,0,3*u,2*u),n.setRenderTarget(t),n.render(a,_l)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),c=Ju[(s-r-1)%Ju.length];this._blur(e,r-1,r,a,c)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,c){const u=this._renderer,d=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const f=3,m=new Lt(this._lodPlanes[s],d),v=d.uniforms,g=this._sizeLods[n]-1,b=isFinite(r)?Math.PI/(2*g):2*Math.PI/(2*Qi-1),y=r/b,x=isFinite(r)?1+Math.floor(f*y):Qi;x>Qi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Qi}`);const _=[];let w=0;for(let O=0;O<Qi;++O){const U=O/y,L=Math.exp(-U*U/2);_.push(L),O===0?w+=L:O<x&&(w+=2*L)}for(let O=0;O<_.length;O++)_[O]=_[O]/w;v.envMap.value=e.texture,v.samples.value=x,v.weights.value=_,v.latitudinal.value=a==="latitudinal",c&&(v.poleAxis.value=c);const{_lodMax:E}=this;v.dTheta.value=b,v.mipInt.value=E-n;const M=this._sizeLods[s],P=3*M*(s>E-Bs?s-E+Bs:0),D=4*(this._cubeSize-M);So(t,P,D,3*M,2*M),u.setRenderTarget(t),u.render(m,_l)}}function V1(i){const e=[],t=[],n=[];let s=i;const r=i-Bs+1+Ku.length;for(let a=0;a<r;a++){const c=Math.pow(2,s);t.push(c);let u=1/c;a>i-Bs?u=Ku[a-i+Bs-1]:a===0&&(u=0),n.push(u);const d=1/(c-2),f=-d,m=1+d,v=[f,f,m,f,m,m,f,f,m,m,f,m],g=6,b=6,y=3,x=2,_=1,w=new Float32Array(y*b*g),E=new Float32Array(x*b*g),M=new Float32Array(_*b*g);for(let D=0;D<g;D++){const O=D%3*2/3-1,U=D>2?0:-1,L=[O,U,0,O+2/3,U,0,O+2/3,U+1,0,O,U,0,O+2/3,U+1,0,O,U+1,0];w.set(L,y*b*D),E.set(v,x*b*D);const A=[D,D,D,D,D,D];M.set(A,_*b*D)}const P=new Mn;P.setAttribute("position",new Dt(w,y)),P.setAttribute("uv",new Dt(E,x)),P.setAttribute("faceIndex",new Dt(M,_)),e.push(P),s>Bs&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function ed(i,e,t){const n=new Fn(i,e,t);return n.texture.mapping=oa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function So(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function G1(i,e,t){const n=new Float32Array(Qi),s=new I(0,1,0);return new mn({name:"SphericalGaussianBlur",defines:{n:Qi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Jc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ri,depthTest:!1,depthWrite:!1})}function td(){return new mn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ri,depthTest:!1,depthWrite:!1})}function nd(){return new mn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ri,depthTest:!1,depthWrite:!1})}function Jc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function H1(i){let e=new WeakMap,t=null;function n(c){if(c&&c.isTexture){const u=c.mapping,d=u===$l||u===Kl,f=u===Ys||u===qs;if(d||f){let m=e.get(c);const v=m!==void 0?m.texture.pmremVersion:0;if(c.isRenderTargetTexture&&c.pmremVersion!==v)return t===null&&(t=new Qu(i)),m=d?t.fromEquirectangular(c,m):t.fromCubemap(c,m),m.texture.pmremVersion=c.pmremVersion,e.set(c,m),m.texture;if(m!==void 0)return m.texture;{const g=c.image;return d&&g&&g.height>0||f&&g&&s(g)?(t===null&&(t=new Qu(i)),m=d?t.fromEquirectangular(c):t.fromCubemap(c),m.texture.pmremVersion=c.pmremVersion,e.set(c,m),c.addEventListener("dispose",r),m.texture):null}}}return c}function s(c){let u=0;const d=6;for(let f=0;f<d;f++)c[f]!==void 0&&u++;return u===d}function r(c){const u=c.target;u.removeEventListener("dispose",r);const d=e.get(u);d!==void 0&&(e.delete(u),d.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function W1(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Os("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function X1(i,e,t,n){const s={},r=new WeakMap;function a(m){const v=m.target;v.index!==null&&e.remove(v.index);for(const b in v.attributes)e.remove(v.attributes[b]);v.removeEventListener("dispose",a),delete s[v.id];const g=r.get(v);g&&(e.remove(g),r.delete(v)),n.releaseStatesOfGeometry(v),v.isInstancedBufferGeometry===!0&&delete v._maxInstanceCount,t.memory.geometries--}function c(m,v){return s[v.id]===!0||(v.addEventListener("dispose",a),s[v.id]=!0,t.memory.geometries++),v}function u(m){const v=m.attributes;for(const g in v)e.update(v[g],i.ARRAY_BUFFER)}function d(m){const v=[],g=m.index,b=m.attributes.position;let y=0;if(g!==null){const w=g.array;y=g.version;for(let E=0,M=w.length;E<M;E+=3){const P=w[E+0],D=w[E+1],O=w[E+2];v.push(P,D,D,O,O,P)}}else if(b!==void 0){const w=b.array;y=b.version;for(let E=0,M=w.length/3-1;E<M;E+=3){const P=E+0,D=E+1,O=E+2;v.push(P,D,D,O,O,P)}}else return;const x=new(yp(v)?Tp:Cp)(v,1);x.version=y;const _=r.get(m);_&&e.remove(_),r.set(m,x)}function f(m){const v=r.get(m);if(v){const g=m.index;g!==null&&v.version<g.version&&d(m)}else d(m);return r.get(m)}return{get:c,update:u,getWireframeAttribute:f}}function Y1(i,e,t){let n;function s(v){n=v}let r,a;function c(v){r=v.type,a=v.bytesPerElement}function u(v,g){i.drawElements(n,g,r,v*a),t.update(g,n,1)}function d(v,g,b){b!==0&&(i.drawElementsInstanced(n,g,r,v*a,b),t.update(g,n,b))}function f(v,g,b){if(b===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,g,0,r,v,0,b);let x=0;for(let _=0;_<b;_++)x+=g[_];t.update(x,n,1)}function m(v,g,b,y){if(b===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let _=0;_<v.length;_++)d(v[_]/a,g[_],y[_]);else{x.multiDrawElementsInstancedWEBGL(n,g,0,r,v,0,y,0,b);let _=0;for(let w=0;w<b;w++)_+=g[w]*y[w];t.update(_,n,1)}}this.setMode=s,this.setIndex=c,this.render=u,this.renderInstances=d,this.renderMultiDraw=f,this.renderMultiDrawInstances=m}function q1(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,c){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=c*(r/3);break;case i.LINES:t.lines+=c*(r/2);break;case i.LINE_STRIP:t.lines+=c*(r-1);break;case i.LINE_LOOP:t.lines+=c*r;break;case i.POINTS:t.points+=c*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function j1(i,e,t){const n=new WeakMap,s=new Mt;function r(a,c,u){const d=a.morphTargetInfluences,f=c.morphAttributes.position||c.morphAttributes.normal||c.morphAttributes.color,m=f!==void 0?f.length:0;let v=n.get(c);if(v===void 0||v.count!==m){let L=function(){O.dispose(),n.delete(c),c.removeEventListener("dispose",L)};v!==void 0&&v.texture.dispose();const g=c.morphAttributes.position!==void 0,b=c.morphAttributes.normal!==void 0,y=c.morphAttributes.color!==void 0,x=c.morphAttributes.position||[],_=c.morphAttributes.normal||[],w=c.morphAttributes.color||[];let E=0;g===!0&&(E=1),b===!0&&(E=2),y===!0&&(E=3);let M=c.attributes.position.count*E,P=1;M>e.maxTextureSize&&(P=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);const D=new Float32Array(M*P*4*m),O=new wp(D,M,P,m);O.type=Tn,O.needsUpdate=!0;const U=E*4;for(let A=0;A<m;A++){const F=x[A],q=_[A],X=w[A],J=M*P*4*A;for(let Q=0;Q<F.count;Q++){const te=Q*U;g===!0&&(s.fromBufferAttribute(F,Q),D[J+te+0]=s.x,D[J+te+1]=s.y,D[J+te+2]=s.z,D[J+te+3]=0),b===!0&&(s.fromBufferAttribute(q,Q),D[J+te+4]=s.x,D[J+te+5]=s.y,D[J+te+6]=s.z,D[J+te+7]=0),y===!0&&(s.fromBufferAttribute(X,Q),D[J+te+8]=s.x,D[J+te+9]=s.y,D[J+te+10]=s.z,D[J+te+11]=X.itemSize===4?s.w:1)}}v={count:m,texture:O,size:new Ue(M,P)},n.set(c,v),c.addEventListener("dispose",L)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)u.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let y=0;y<d.length;y++)g+=d[y];const b=c.morphTargetsRelative?1:1-g;u.getUniforms().setValue(i,"morphTargetBaseInfluence",b),u.getUniforms().setValue(i,"morphTargetInfluences",d)}u.getUniforms().setValue(i,"morphTargetsTexture",v.texture,t),u.getUniforms().setValue(i,"morphTargetsTextureSize",v.size)}return{update:r}}function $1(i,e,t,n){let s=new WeakMap;function r(u){const d=n.render.frame,f=u.geometry,m=e.get(u,f);if(s.get(m)!==d&&(e.update(m),s.set(m,d)),u.isInstancedMesh&&(u.hasEventListener("dispose",c)===!1&&u.addEventListener("dispose",c),s.get(u)!==d&&(t.update(u.instanceMatrix,i.ARRAY_BUFFER),u.instanceColor!==null&&t.update(u.instanceColor,i.ARRAY_BUFFER),s.set(u,d))),u.isSkinnedMesh){const v=u.skeleton;s.get(v)!==d&&(v.update(),s.set(v,d))}return m}function a(){s=new WeakMap}function c(u){const d=u.target;d.removeEventListener("dispose",c),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:r,dispose:a}}const Np=new Tt,id=new jc(1,1),Op=new wp,Fp=new Sp,Bp=new Lp,sd=[],rd=[],od=new Float32Array(16),ad=new Float32Array(9),ld=new Float32Array(4);function ir(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=sd[s];if(r===void 0&&(r=new Float32Array(s),sd[s]=r),e!==0){n.toArray(r,0);for(let a=1,c=0;a!==e;++a)c+=t,i[a].toArray(r,c)}return r}function Vt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Gt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ua(i,e){let t=rd[e];t===void 0&&(t=new Int32Array(e),rd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function K1(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Z1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2fv(this.addr,e),Gt(t,e)}}function J1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Vt(t,e))return;i.uniform3fv(this.addr,e),Gt(t,e)}}function Q1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4fv(this.addr,e),Gt(t,e)}}function eb(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Gt(t,e)}else{if(Vt(t,n))return;ld.set(n),i.uniformMatrix2fv(this.addr,!1,ld),Gt(t,n)}}function tb(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Gt(t,e)}else{if(Vt(t,n))return;ad.set(n),i.uniformMatrix3fv(this.addr,!1,ad),Gt(t,n)}}function nb(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Gt(t,e)}else{if(Vt(t,n))return;od.set(n),i.uniformMatrix4fv(this.addr,!1,od),Gt(t,n)}}function ib(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function sb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2iv(this.addr,e),Gt(t,e)}}function rb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;i.uniform3iv(this.addr,e),Gt(t,e)}}function ob(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4iv(this.addr,e),Gt(t,e)}}function ab(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function lb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2uiv(this.addr,e),Gt(t,e)}}function cb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;i.uniform3uiv(this.addr,e),Gt(t,e)}}function hb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4uiv(this.addr,e),Gt(t,e)}}function ub(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(id.compareFunction=bp,r=id):r=Np,t.setTexture2D(e||r,s)}function db(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Fp,s)}function pb(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Bp,s)}function fb(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Op,s)}function mb(i){switch(i){case 5126:return K1;case 35664:return Z1;case 35665:return J1;case 35666:return Q1;case 35674:return eb;case 35675:return tb;case 35676:return nb;case 5124:case 35670:return ib;case 35667:case 35671:return sb;case 35668:case 35672:return rb;case 35669:case 35673:return ob;case 5125:return ab;case 36294:return lb;case 36295:return cb;case 36296:return hb;case 35678:case 36198:case 36298:case 36306:case 35682:return ub;case 35679:case 36299:case 36307:return db;case 35680:case 36300:case 36308:case 36293:return pb;case 36289:case 36303:case 36311:case 36292:return fb}}function gb(i,e){i.uniform1fv(this.addr,e)}function vb(i,e){const t=ir(e,this.size,2);i.uniform2fv(this.addr,t)}function _b(i,e){const t=ir(e,this.size,3);i.uniform3fv(this.addr,t)}function xb(i,e){const t=ir(e,this.size,4);i.uniform4fv(this.addr,t)}function bb(i,e){const t=ir(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function yb(i,e){const t=ir(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function wb(i,e){const t=ir(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Sb(i,e){i.uniform1iv(this.addr,e)}function Mb(i,e){i.uniform2iv(this.addr,e)}function Eb(i,e){i.uniform3iv(this.addr,e)}function Ab(i,e){i.uniform4iv(this.addr,e)}function Cb(i,e){i.uniform1uiv(this.addr,e)}function Tb(i,e){i.uniform2uiv(this.addr,e)}function Rb(i,e){i.uniform3uiv(this.addr,e)}function Pb(i,e){i.uniform4uiv(this.addr,e)}function Lb(i,e,t){const n=this.cache,s=e.length,r=ua(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Np,r[a])}function Ib(i,e,t){const n=this.cache,s=e.length,r=ua(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Fp,r[a])}function Db(i,e,t){const n=this.cache,s=e.length,r=ua(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Bp,r[a])}function Ub(i,e,t){const n=this.cache,s=e.length,r=ua(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Gt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Op,r[a])}function Nb(i){switch(i){case 5126:return gb;case 35664:return vb;case 35665:return _b;case 35666:return xb;case 35674:return bb;case 35675:return yb;case 35676:return wb;case 5124:case 35670:return Sb;case 35667:case 35671:return Mb;case 35668:case 35672:return Eb;case 35669:case 35673:return Ab;case 5125:return Cb;case 36294:return Tb;case 36295:return Rb;case 36296:return Pb;case 35678:case 36198:case 36298:case 36306:case 35682:return Lb;case 35679:case 36299:case 36307:return Ib;case 35680:case 36300:case 36308:case 36293:return Db;case 36289:case 36303:case 36311:case 36292:return Ub}}class Ob{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=mb(t.type)}}class Fb{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Nb(t.type)}}class Bb{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const c=s[r];c.setValue(e,t[c.id],n)}}}const Sl=/(\w+)(\])?(\[|\.)?/g;function cd(i,e){i.seq.push(e),i.map[e.id]=e}function kb(i,e,t){const n=i.name,s=n.length;for(Sl.lastIndex=0;;){const r=Sl.exec(n),a=Sl.lastIndex;let c=r[1];const u=r[2]==="]",d=r[3];if(u&&(c=c|0),d===void 0||d==="["&&a+2===s){cd(t,d===void 0?new Ob(c,i,e):new Fb(c,i,e));break}else{let m=t.map[c];m===void 0&&(m=new Bb(c),cd(t,m)),t=m}}}class Ho{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);kb(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const c=t[r],u=n[c.id];u.needsUpdate!==!1&&c.setValue(e,u.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function hd(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const zb=37297;let Vb=0;function Gb(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const c=a+1;n.push(`${c===e?">":" "} ${c}: ${t[a]}`)}return n.join(`
`)}const ud=new et;function Hb(i){vt._getMatrix(ud,vt.workingColorSpace,i);const e=`mat3( ${ud.elements.map(t=>t.toFixed(4))} )`;switch(vt.getTransfer(i)){case jo:return[e,"LinearTransferOETF"];case yt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function dd(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Gb(i.getShaderSource(e),a)}else return s}function Wb(i,e){const t=Hb(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Xb(i,e){let t;switch(e){case Tv:t="Linear";break;case Rv:t="Reinhard";break;case Pv:t="Cineon";break;case Lv:t="ACESFilmic";break;case Dv:t="AgX";break;case Uv:t="Neutral";break;case Iv:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Mo=new I;function Yb(){vt.getLuminanceCoefficients(Mo);const i=Mo.x.toFixed(4),e=Mo.y.toFixed(4),t=Mo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function qb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Mr).join(`
`)}function jb(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function $b(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let c=1;r.type===i.FLOAT_MAT2&&(c=2),r.type===i.FLOAT_MAT3&&(c=3),r.type===i.FLOAT_MAT4&&(c=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:c}}return t}function Mr(i){return i!==""}function pd(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function fd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Kb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Sc(i){return i.replace(Kb,Jb)}const Zb=new Map;function Jb(i,e){let t=it[e];if(t===void 0){const n=Zb.get(e);if(n!==void 0)t=it[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Sc(t)}const Qb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function md(i){return i.replace(Qb,ey)}function ey(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function gd(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function ty(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===cp?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===hv?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ti&&(e="SHADOWMAP_TYPE_VSM"),e}function ny(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ys:case qs:e="ENVMAP_TYPE_CUBE";break;case oa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function iy(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case qs:e="ENVMAP_MODE_REFRACTION";break}return e}function sy(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Uc:e="ENVMAP_BLENDING_MULTIPLY";break;case Av:e="ENVMAP_BLENDING_MIX";break;case Cv:e="ENVMAP_BLENDING_ADD";break}return e}function ry(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function oy(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,c=t.fragmentShader;const u=ty(t),d=ny(t),f=iy(t),m=sy(t),v=ry(t),g=qb(t),b=jb(r),y=s.createProgram();let x,_,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b].filter(Mr).join(`
`),x.length>0&&(x+=`
`),_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b].filter(Mr).join(`
`),_.length>0&&(_+=`
`)):(x=[gd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Mr).join(`
`),_=[gd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",t.envMap?"#define "+m:"",v?"#define CUBEUV_TEXEL_WIDTH "+v.texelWidth:"",v?"#define CUBEUV_TEXEL_HEIGHT "+v.texelHeight:"",v?"#define CUBEUV_MAX_MIP "+v.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Pi?"#define TONE_MAPPING":"",t.toneMapping!==Pi?it.tonemapping_pars_fragment:"",t.toneMapping!==Pi?Xb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",it.colorspace_pars_fragment,Wb("linearToOutputTexel",t.outputColorSpace),Yb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Mr).join(`
`)),a=Sc(a),a=pd(a,t),a=fd(a,t),c=Sc(c),c=pd(c,t),c=fd(c,t),a=md(a),c=md(c),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,x=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,_=["#define varying in",t.glslVersion===wu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===wu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const E=w+x+a,M=w+_+c,P=hd(s,s.VERTEX_SHADER,E),D=hd(s,s.FRAGMENT_SHADER,M);s.attachShader(y,P),s.attachShader(y,D),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function O(F){if(i.debug.checkShaderErrors){const q=s.getProgramInfoLog(y).trim(),X=s.getShaderInfoLog(P).trim(),J=s.getShaderInfoLog(D).trim();let Q=!0,te=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,P,D);else{const ee=dd(s,P,"vertex"),z=dd(s,D,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+q+`
`+ee+`
`+z)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(X===""||J==="")&&(te=!1);te&&(F.diagnostics={runnable:Q,programLog:q,vertexShader:{log:X,prefix:x},fragmentShader:{log:J,prefix:_}})}s.deleteShader(P),s.deleteShader(D),U=new Ho(s,y),L=$b(s,y)}let U;this.getUniforms=function(){return U===void 0&&O(this),U};let L;this.getAttributes=function(){return L===void 0&&O(this),L};let A=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=s.getProgramParameter(y,zb)),A},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Vb++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=P,this.fragmentShader=D,this}let ay=0;class ly{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new cy(e),t.set(e,n)),n}}class cy{constructor(e){this.id=ay++,this.code=e,this.usedTimes=0}}function hy(i,e,t,n,s,r,a){const c=new Ep,u=new ly,d=new Set,f=[],m=s.logarithmicDepthBuffer,v=s.vertexTextures;let g=s.precision;const b={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(L){return d.add(L),L===0?"uv":`uv${L}`}function x(L,A,F,q,X){const J=q.fog,Q=X.geometry,te=L.isMeshStandardMaterial?q.environment:null,ee=(L.isMeshStandardMaterial?t:e).get(L.envMap||te),z=ee&&ee.mapping===oa?ee.image.height:null,le=b[L.type];L.precision!==null&&(g=s.getMaxPrecision(L.precision),g!==L.precision&&console.warn("THREE.WebGLProgram.getParameters:",L.precision,"not supported, using",g,"instead."));const ce=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,re=ce!==void 0?ce.length:0;let Re=0;Q.morphAttributes.position!==void 0&&(Re=1),Q.morphAttributes.normal!==void 0&&(Re=2),Q.morphAttributes.color!==void 0&&(Re=3);let st,Y,ae,ye;if(le){const nt=Gn[le];st=nt.vertexShader,Y=nt.fragmentShader}else st=L.vertexShader,Y=L.fragmentShader,u.update(L),ae=u.getVertexShaderID(L),ye=u.getFragmentShaderID(L);const me=i.getRenderTarget(),Le=i.state.buffers.depth.getReversed(),Fe=X.isInstancedMesh===!0,Ve=X.isBatchedMesh===!0,j=!!L.map,ge=!!L.matcap,Xe=!!ee,k=!!L.aoMap,ut=!!L.lightMap,Ne=!!L.bumpMap,He=!!L.normalMap,Ie=!!L.displacementMap,dt=!!L.emissiveMap,Oe=!!L.metalnessMap,N=!!L.roughnessMap,C=L.anisotropy>0,$=L.clearcoat>0,se=L.dispersion>0,he=L.iridescence>0,ie=L.sheen>0,De=L.transmission>0,be=C&&!!L.anisotropyMap,Ee=$&&!!L.clearcoatMap,rt=$&&!!L.clearcoatNormalMap,fe=$&&!!L.clearcoatRoughnessMap,Te=he&&!!L.iridescenceMap,ke=he&&!!L.iridescenceThicknessMap,Ye=ie&&!!L.sheenColorMap,Me=ie&&!!L.sheenRoughnessMap,tt=!!L.specularMap,je=!!L.specularColorMap,bt=!!L.specularIntensityMap,V=De&&!!L.transmissionMap,ve=De&&!!L.thicknessMap,ne=!!L.gradientMap,oe=!!L.alphaMap,Se=L.alphaTest>0,we=!!L.alphaHash,Je=!!L.extensions;let St=Pi;L.toneMapped&&(me===null||me.isXRRenderTarget===!0)&&(St=i.toneMapping);const Nt={shaderID:le,shaderType:L.type,shaderName:L.name,vertexShader:st,fragmentShader:Y,defines:L.defines,customVertexShaderID:ae,customFragmentShaderID:ye,isRawShaderMaterial:L.isRawShaderMaterial===!0,glslVersion:L.glslVersion,precision:g,batching:Ve,batchingColor:Ve&&X._colorsTexture!==null,instancing:Fe,instancingColor:Fe&&X.instanceColor!==null,instancingMorph:Fe&&X.morphTexture!==null,supportsVertexTextures:v,outputColorSpace:me===null?i.outputColorSpace:me.isXRRenderTarget===!0?me.texture.colorSpace:Zs,alphaToCoverage:!!L.alphaToCoverage,map:j,matcap:ge,envMap:Xe,envMapMode:Xe&&ee.mapping,envMapCubeUVHeight:z,aoMap:k,lightMap:ut,bumpMap:Ne,normalMap:He,displacementMap:v&&Ie,emissiveMap:dt,normalMapObjectSpace:He&&L.normalMapType===kv,normalMapTangentSpace:He&&L.normalMapType===xp,metalnessMap:Oe,roughnessMap:N,anisotropy:C,anisotropyMap:be,clearcoat:$,clearcoatMap:Ee,clearcoatNormalMap:rt,clearcoatRoughnessMap:fe,dispersion:se,iridescence:he,iridescenceMap:Te,iridescenceThicknessMap:ke,sheen:ie,sheenColorMap:Ye,sheenRoughnessMap:Me,specularMap:tt,specularColorMap:je,specularIntensityMap:bt,transmission:De,transmissionMap:V,thicknessMap:ve,gradientMap:ne,opaque:L.transparent===!1&&L.blending===Wn&&L.alphaToCoverage===!1,alphaMap:oe,alphaTest:Se,alphaHash:we,combine:L.combine,mapUv:j&&y(L.map.channel),aoMapUv:k&&y(L.aoMap.channel),lightMapUv:ut&&y(L.lightMap.channel),bumpMapUv:Ne&&y(L.bumpMap.channel),normalMapUv:He&&y(L.normalMap.channel),displacementMapUv:Ie&&y(L.displacementMap.channel),emissiveMapUv:dt&&y(L.emissiveMap.channel),metalnessMapUv:Oe&&y(L.metalnessMap.channel),roughnessMapUv:N&&y(L.roughnessMap.channel),anisotropyMapUv:be&&y(L.anisotropyMap.channel),clearcoatMapUv:Ee&&y(L.clearcoatMap.channel),clearcoatNormalMapUv:rt&&y(L.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:fe&&y(L.clearcoatRoughnessMap.channel),iridescenceMapUv:Te&&y(L.iridescenceMap.channel),iridescenceThicknessMapUv:ke&&y(L.iridescenceThicknessMap.channel),sheenColorMapUv:Ye&&y(L.sheenColorMap.channel),sheenRoughnessMapUv:Me&&y(L.sheenRoughnessMap.channel),specularMapUv:tt&&y(L.specularMap.channel),specularColorMapUv:je&&y(L.specularColorMap.channel),specularIntensityMapUv:bt&&y(L.specularIntensityMap.channel),transmissionMapUv:V&&y(L.transmissionMap.channel),thicknessMapUv:ve&&y(L.thicknessMap.channel),alphaMapUv:oe&&y(L.alphaMap.channel),vertexTangents:!!Q.attributes.tangent&&(He||C),vertexColors:L.vertexColors,vertexAlphas:L.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!Q.attributes.uv&&(j||oe),fog:!!J,useFog:L.fog===!0,fogExp2:!!J&&J.isFogExp2,flatShading:L.flatShading===!0,sizeAttenuation:L.sizeAttenuation===!0,logarithmicDepthBuffer:m,reverseDepthBuffer:Le,skinning:X.isSkinnedMesh===!0,morphTargets:Q.morphAttributes.position!==void 0,morphNormals:Q.morphAttributes.normal!==void 0,morphColors:Q.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:Re,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:L.dithering,shadowMapEnabled:i.shadowMap.enabled&&F.length>0,shadowMapType:i.shadowMap.type,toneMapping:St,decodeVideoTexture:j&&L.map.isVideoTexture===!0&&vt.getTransfer(L.map.colorSpace)===yt,decodeVideoTextureEmissive:dt&&L.emissiveMap.isVideoTexture===!0&&vt.getTransfer(L.emissiveMap.colorSpace)===yt,premultipliedAlpha:L.premultipliedAlpha,doubleSided:L.side===Un,flipSided:L.side===pn,useDepthPacking:L.depthPacking>=0,depthPacking:L.depthPacking||0,index0AttributeName:L.index0AttributeName,extensionClipCullDistance:Je&&L.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Je&&L.extensions.multiDraw===!0||Ve)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:L.customProgramCacheKey()};return Nt.vertexUv1s=d.has(1),Nt.vertexUv2s=d.has(2),Nt.vertexUv3s=d.has(3),d.clear(),Nt}function _(L){const A=[];if(L.shaderID?A.push(L.shaderID):(A.push(L.customVertexShaderID),A.push(L.customFragmentShaderID)),L.defines!==void 0)for(const F in L.defines)A.push(F),A.push(L.defines[F]);return L.isRawShaderMaterial===!1&&(w(A,L),E(A,L),A.push(i.outputColorSpace)),A.push(L.customProgramCacheKey),A.join()}function w(L,A){L.push(A.precision),L.push(A.outputColorSpace),L.push(A.envMapMode),L.push(A.envMapCubeUVHeight),L.push(A.mapUv),L.push(A.alphaMapUv),L.push(A.lightMapUv),L.push(A.aoMapUv),L.push(A.bumpMapUv),L.push(A.normalMapUv),L.push(A.displacementMapUv),L.push(A.emissiveMapUv),L.push(A.metalnessMapUv),L.push(A.roughnessMapUv),L.push(A.anisotropyMapUv),L.push(A.clearcoatMapUv),L.push(A.clearcoatNormalMapUv),L.push(A.clearcoatRoughnessMapUv),L.push(A.iridescenceMapUv),L.push(A.iridescenceThicknessMapUv),L.push(A.sheenColorMapUv),L.push(A.sheenRoughnessMapUv),L.push(A.specularMapUv),L.push(A.specularColorMapUv),L.push(A.specularIntensityMapUv),L.push(A.transmissionMapUv),L.push(A.thicknessMapUv),L.push(A.combine),L.push(A.fogExp2),L.push(A.sizeAttenuation),L.push(A.morphTargetsCount),L.push(A.morphAttributeCount),L.push(A.numDirLights),L.push(A.numPointLights),L.push(A.numSpotLights),L.push(A.numSpotLightMaps),L.push(A.numHemiLights),L.push(A.numRectAreaLights),L.push(A.numDirLightShadows),L.push(A.numPointLightShadows),L.push(A.numSpotLightShadows),L.push(A.numSpotLightShadowsWithMaps),L.push(A.numLightProbes),L.push(A.shadowMapType),L.push(A.toneMapping),L.push(A.numClippingPlanes),L.push(A.numClipIntersection),L.push(A.depthPacking)}function E(L,A){c.disableAll(),A.supportsVertexTextures&&c.enable(0),A.instancing&&c.enable(1),A.instancingColor&&c.enable(2),A.instancingMorph&&c.enable(3),A.matcap&&c.enable(4),A.envMap&&c.enable(5),A.normalMapObjectSpace&&c.enable(6),A.normalMapTangentSpace&&c.enable(7),A.clearcoat&&c.enable(8),A.iridescence&&c.enable(9),A.alphaTest&&c.enable(10),A.vertexColors&&c.enable(11),A.vertexAlphas&&c.enable(12),A.vertexUv1s&&c.enable(13),A.vertexUv2s&&c.enable(14),A.vertexUv3s&&c.enable(15),A.vertexTangents&&c.enable(16),A.anisotropy&&c.enable(17),A.alphaHash&&c.enable(18),A.batching&&c.enable(19),A.dispersion&&c.enable(20),A.batchingColor&&c.enable(21),L.push(c.mask),c.disableAll(),A.fog&&c.enable(0),A.useFog&&c.enable(1),A.flatShading&&c.enable(2),A.logarithmicDepthBuffer&&c.enable(3),A.reverseDepthBuffer&&c.enable(4),A.skinning&&c.enable(5),A.morphTargets&&c.enable(6),A.morphNormals&&c.enable(7),A.morphColors&&c.enable(8),A.premultipliedAlpha&&c.enable(9),A.shadowMapEnabled&&c.enable(10),A.doubleSided&&c.enable(11),A.flipSided&&c.enable(12),A.useDepthPacking&&c.enable(13),A.dithering&&c.enable(14),A.transmission&&c.enable(15),A.sheen&&c.enable(16),A.opaque&&c.enable(17),A.pointsUvs&&c.enable(18),A.decodeVideoTexture&&c.enable(19),A.decodeVideoTextureEmissive&&c.enable(20),A.alphaToCoverage&&c.enable(21),L.push(c.mask)}function M(L){const A=b[L.type];let F;if(A){const q=Gn[A];F=R0.clone(q.uniforms)}else F=L.uniforms;return F}function P(L,A){let F;for(let q=0,X=f.length;q<X;q++){const J=f[q];if(J.cacheKey===A){F=J,++F.usedTimes;break}}return F===void 0&&(F=new oy(i,A,L,r),f.push(F)),F}function D(L){if(--L.usedTimes===0){const A=f.indexOf(L);f[A]=f[f.length-1],f.pop(),L.destroy()}}function O(L){u.remove(L)}function U(){u.dispose()}return{getParameters:x,getProgramCacheKey:_,getUniforms:M,acquireProgram:P,releaseProgram:D,releaseShaderCache:O,programs:f,dispose:U}}function uy(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let c=i.get(a);return c===void 0&&(c={},i.set(a,c)),c}function n(a){i.delete(a)}function s(a,c,u){i.get(a)[c]=u}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function dy(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function vd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function _d(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(m,v,g,b,y,x){let _=i[e];return _===void 0?(_={id:m.id,object:m,geometry:v,material:g,groupOrder:b,renderOrder:m.renderOrder,z:y,group:x},i[e]=_):(_.id=m.id,_.object=m,_.geometry=v,_.material=g,_.groupOrder=b,_.renderOrder=m.renderOrder,_.z=y,_.group=x),e++,_}function c(m,v,g,b,y,x){const _=a(m,v,g,b,y,x);g.transmission>0?n.push(_):g.transparent===!0?s.push(_):t.push(_)}function u(m,v,g,b,y,x){const _=a(m,v,g,b,y,x);g.transmission>0?n.unshift(_):g.transparent===!0?s.unshift(_):t.unshift(_)}function d(m,v){t.length>1&&t.sort(m||dy),n.length>1&&n.sort(v||vd),s.length>1&&s.sort(v||vd)}function f(){for(let m=e,v=i.length;m<v;m++){const g=i[m];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:u,finish:f,sort:d}}function py(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new _d,i.set(n,[a])):s>=r.length?(a=new _d,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function fy(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Ke};break;case"SpotLight":t={position:new I,direction:new I,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":t={color:new Ke,position:new I,halfWidth:new I,halfHeight:new I};break}return i[e.id]=t,t}}}function my(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let gy=0;function vy(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function _y(i){const e=new fy,t=my(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)n.probe.push(new I);const s=new I,r=new _t,a=new _t;function c(d){let f=0,m=0,v=0;for(let L=0;L<9;L++)n.probe[L].set(0,0,0);let g=0,b=0,y=0,x=0,_=0,w=0,E=0,M=0,P=0,D=0,O=0;d.sort(vy);for(let L=0,A=d.length;L<A;L++){const F=d[L],q=F.color,X=F.intensity,J=F.distance,Q=F.shadow&&F.shadow.map?F.shadow.map.texture:null;if(F.isAmbientLight)f+=q.r*X,m+=q.g*X,v+=q.b*X;else if(F.isLightProbe){for(let te=0;te<9;te++)n.probe[te].addScaledVector(F.sh.coefficients[te],X);O++}else if(F.isDirectionalLight){const te=e.get(F);if(te.color.copy(F.color).multiplyScalar(F.intensity),F.castShadow){const ee=F.shadow,z=t.get(F);z.shadowIntensity=ee.intensity,z.shadowBias=ee.bias,z.shadowNormalBias=ee.normalBias,z.shadowRadius=ee.radius,z.shadowMapSize=ee.mapSize,n.directionalShadow[g]=z,n.directionalShadowMap[g]=Q,n.directionalShadowMatrix[g]=F.shadow.matrix,w++}n.directional[g]=te,g++}else if(F.isSpotLight){const te=e.get(F);te.position.setFromMatrixPosition(F.matrixWorld),te.color.copy(q).multiplyScalar(X),te.distance=J,te.coneCos=Math.cos(F.angle),te.penumbraCos=Math.cos(F.angle*(1-F.penumbra)),te.decay=F.decay,n.spot[y]=te;const ee=F.shadow;if(F.map&&(n.spotLightMap[P]=F.map,P++,ee.updateMatrices(F),F.castShadow&&D++),n.spotLightMatrix[y]=ee.matrix,F.castShadow){const z=t.get(F);z.shadowIntensity=ee.intensity,z.shadowBias=ee.bias,z.shadowNormalBias=ee.normalBias,z.shadowRadius=ee.radius,z.shadowMapSize=ee.mapSize,n.spotShadow[y]=z,n.spotShadowMap[y]=Q,M++}y++}else if(F.isRectAreaLight){const te=e.get(F);te.color.copy(q).multiplyScalar(X),te.halfWidth.set(F.width*.5,0,0),te.halfHeight.set(0,F.height*.5,0),n.rectArea[x]=te,x++}else if(F.isPointLight){const te=e.get(F);if(te.color.copy(F.color).multiplyScalar(F.intensity),te.distance=F.distance,te.decay=F.decay,F.castShadow){const ee=F.shadow,z=t.get(F);z.shadowIntensity=ee.intensity,z.shadowBias=ee.bias,z.shadowNormalBias=ee.normalBias,z.shadowRadius=ee.radius,z.shadowMapSize=ee.mapSize,z.shadowCameraNear=ee.camera.near,z.shadowCameraFar=ee.camera.far,n.pointShadow[b]=z,n.pointShadowMap[b]=Q,n.pointShadowMatrix[b]=F.shadow.matrix,E++}n.point[b]=te,b++}else if(F.isHemisphereLight){const te=e.get(F);te.skyColor.copy(F.color).multiplyScalar(X),te.groundColor.copy(F.groundColor).multiplyScalar(X),n.hemi[_]=te,_++}}x>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xe.LTC_FLOAT_1,n.rectAreaLTC2=xe.LTC_FLOAT_2):(n.rectAreaLTC1=xe.LTC_HALF_1,n.rectAreaLTC2=xe.LTC_HALF_2)),n.ambient[0]=f,n.ambient[1]=m,n.ambient[2]=v;const U=n.hash;(U.directionalLength!==g||U.pointLength!==b||U.spotLength!==y||U.rectAreaLength!==x||U.hemiLength!==_||U.numDirectionalShadows!==w||U.numPointShadows!==E||U.numSpotShadows!==M||U.numSpotMaps!==P||U.numLightProbes!==O)&&(n.directional.length=g,n.spot.length=y,n.rectArea.length=x,n.point.length=b,n.hemi.length=_,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=M+P-D,n.spotLightMap.length=P,n.numSpotLightShadowsWithMaps=D,n.numLightProbes=O,U.directionalLength=g,U.pointLength=b,U.spotLength=y,U.rectAreaLength=x,U.hemiLength=_,U.numDirectionalShadows=w,U.numPointShadows=E,U.numSpotShadows=M,U.numSpotMaps=P,U.numLightProbes=O,n.version=gy++)}function u(d,f){let m=0,v=0,g=0,b=0,y=0;const x=f.matrixWorldInverse;for(let _=0,w=d.length;_<w;_++){const E=d[_];if(E.isDirectionalLight){const M=n.directional[m];M.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(x),m++}else if(E.isSpotLight){const M=n.spot[g];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(x),M.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(x),g++}else if(E.isRectAreaLight){const M=n.rectArea[b];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(x),a.identity(),r.copy(E.matrixWorld),r.premultiply(x),a.extractRotation(r),M.halfWidth.set(E.width*.5,0,0),M.halfHeight.set(0,E.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),b++}else if(E.isPointLight){const M=n.point[v];M.position.setFromMatrixPosition(E.matrixWorld),M.position.applyMatrix4(x),v++}else if(E.isHemisphereLight){const M=n.hemi[y];M.direction.setFromMatrixPosition(E.matrixWorld),M.direction.transformDirection(x),y++}}}return{setup:c,setupView:u,state:n}}function xd(i){const e=new _y(i),t=[],n=[];function s(f){d.camera=f,t.length=0,n.length=0}function r(f){t.push(f)}function a(f){n.push(f)}function c(){e.setup(t)}function u(f){e.setupView(t,f)}const d={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:d,setupLights:c,setupLightsView:u,pushLight:r,pushShadow:a}}function xy(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let c;return a===void 0?(c=new xd(i),e.set(s,[c])):r>=a.length?(c=new xd(i),a.push(c)):c=a[r],c}function n(){e=new WeakMap}return{get:t,dispose:n}}const by=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,yy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function wy(i,e,t){let n=new Yc;const s=new Ue,r=new Ue,a=new Mt,c=new B0({depthPacking:Bv}),u=new k0,d={},f=t.maxTextureSize,m={[Ii]:pn,[pn]:Ii,[Un]:Un},v=new mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:by,fragmentShader:yy}),g=v.clone();g.defines.HORIZONTAL_PASS=1;const b=new Mn;b.setAttribute("position",new Dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Lt(b,v),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cp;let _=this.type;this.render=function(D,O,U){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||D.length===0)return;const L=i.getRenderTarget(),A=i.getActiveCubeFace(),F=i.getActiveMipmapLevel(),q=i.state;q.setBlending(Ri),q.buffers.color.setClear(1,1,1,1),q.buffers.depth.setTest(!0),q.setScissorTest(!1);const X=_!==ti&&this.type===ti,J=_===ti&&this.type!==ti;for(let Q=0,te=D.length;Q<te;Q++){const ee=D[Q],z=ee.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const le=z.getFrameExtents();if(s.multiply(le),r.copy(z.mapSize),(s.x>f||s.y>f)&&(s.x>f&&(r.x=Math.floor(f/le.x),s.x=r.x*le.x,z.mapSize.x=r.x),s.y>f&&(r.y=Math.floor(f/le.y),s.y=r.y*le.y,z.mapSize.y=r.y)),z.map===null||X===!0||J===!0){const re=this.type!==ti?{minFilter:It,magFilter:It}:{};z.map!==null&&z.map.dispose(),z.map=new Fn(s.x,s.y,re),z.map.texture.name=ee.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();const ce=z.getViewportCount();for(let re=0;re<ce;re++){const Re=z.getViewport(re);a.set(r.x*Re.x,r.y*Re.y,r.x*Re.z,r.y*Re.w),q.viewport(a),z.updateMatrices(ee,re),n=z.getFrustum(),M(O,U,z.camera,ee,this.type)}z.isPointLightShadow!==!0&&this.type===ti&&w(z,U),z.needsUpdate=!1}_=this.type,x.needsUpdate=!1,i.setRenderTarget(L,A,F)};function w(D,O){const U=e.update(y);v.defines.VSM_SAMPLES!==D.blurSamples&&(v.defines.VSM_SAMPLES=D.blurSamples,g.defines.VSM_SAMPLES=D.blurSamples,v.needsUpdate=!0,g.needsUpdate=!0),D.mapPass===null&&(D.mapPass=new Fn(s.x,s.y)),v.uniforms.shadow_pass.value=D.map.texture,v.uniforms.resolution.value=D.mapSize,v.uniforms.radius.value=D.radius,i.setRenderTarget(D.mapPass),i.clear(),i.renderBufferDirect(O,null,U,v,y,null),g.uniforms.shadow_pass.value=D.mapPass.texture,g.uniforms.resolution.value=D.mapSize,g.uniforms.radius.value=D.radius,i.setRenderTarget(D.map),i.clear(),i.renderBufferDirect(O,null,U,g,y,null)}function E(D,O,U,L){let A=null;const F=U.isPointLight===!0?D.customDistanceMaterial:D.customDepthMaterial;if(F!==void 0)A=F;else if(A=U.isPointLight===!0?u:c,i.localClippingEnabled&&O.clipShadows===!0&&Array.isArray(O.clippingPlanes)&&O.clippingPlanes.length!==0||O.displacementMap&&O.displacementScale!==0||O.alphaMap&&O.alphaTest>0||O.map&&O.alphaTest>0){const q=A.uuid,X=O.uuid;let J=d[q];J===void 0&&(J={},d[q]=J);let Q=J[X];Q===void 0&&(Q=A.clone(),J[X]=Q,O.addEventListener("dispose",P)),A=Q}if(A.visible=O.visible,A.wireframe=O.wireframe,L===ti?A.side=O.shadowSide!==null?O.shadowSide:O.side:A.side=O.shadowSide!==null?O.shadowSide:m[O.side],A.alphaMap=O.alphaMap,A.alphaTest=O.alphaTest,A.map=O.map,A.clipShadows=O.clipShadows,A.clippingPlanes=O.clippingPlanes,A.clipIntersection=O.clipIntersection,A.displacementMap=O.displacementMap,A.displacementScale=O.displacementScale,A.displacementBias=O.displacementBias,A.wireframeLinewidth=O.wireframeLinewidth,A.linewidth=O.linewidth,U.isPointLight===!0&&A.isMeshDistanceMaterial===!0){const q=i.properties.get(A);q.light=U}return A}function M(D,O,U,L,A){if(D.visible===!1)return;if(D.layers.test(O.layers)&&(D.isMesh||D.isLine||D.isPoints)&&(D.castShadow||D.receiveShadow&&A===ti)&&(!D.frustumCulled||n.intersectsObject(D))){D.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,D.matrixWorld);const X=e.update(D),J=D.material;if(Array.isArray(J)){const Q=X.groups;for(let te=0,ee=Q.length;te<ee;te++){const z=Q[te],le=J[z.materialIndex];if(le&&le.visible){const ce=E(D,le,L,A);D.onBeforeShadow(i,D,O,U,X,ce,z),i.renderBufferDirect(U,null,X,ce,D,z),D.onAfterShadow(i,D,O,U,X,ce,z)}}}else if(J.visible){const Q=E(D,J,L,A);D.onBeforeShadow(i,D,O,U,X,Q,null),i.renderBufferDirect(U,null,X,Q,D,null),D.onAfterShadow(i,D,O,U,X,Q,null)}}const q=D.children;for(let X=0,J=q.length;X<J;X++)M(q[X],O,U,L,A)}function P(D){D.target.removeEventListener("dispose",P);for(const U in d){const L=d[U],A=D.target.uuid;A in L&&(L[A].dispose(),delete L[A])}}}const Sy={[Gl]:Hl,[Wl]:ql,[Xl]:jl,[Xs]:Yl,[Hl]:Gl,[ql]:Wl,[jl]:Xl,[Yl]:Xs};function My(i,e){function t(){let V=!1;const ve=new Mt;let ne=null;const oe=new Mt(0,0,0,0);return{setMask:function(Se){ne!==Se&&!V&&(i.colorMask(Se,Se,Se,Se),ne=Se)},setLocked:function(Se){V=Se},setClear:function(Se,we,Je,St,Nt){Nt===!0&&(Se*=St,we*=St,Je*=St),ve.set(Se,we,Je,St),oe.equals(ve)===!1&&(i.clearColor(Se,we,Je,St),oe.copy(ve))},reset:function(){V=!1,ne=null,oe.set(-1,0,0,0)}}}function n(){let V=!1,ve=!1,ne=null,oe=null,Se=null;return{setReversed:function(we){if(ve!==we){const Je=e.get("EXT_clip_control");ve?Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.ZERO_TO_ONE_EXT):Je.clipControlEXT(Je.LOWER_LEFT_EXT,Je.NEGATIVE_ONE_TO_ONE_EXT);const St=Se;Se=null,this.setClear(St)}ve=we},getReversed:function(){return ve},setTest:function(we){we?me(i.DEPTH_TEST):Le(i.DEPTH_TEST)},setMask:function(we){ne!==we&&!V&&(i.depthMask(we),ne=we)},setFunc:function(we){if(ve&&(we=Sy[we]),oe!==we){switch(we){case Gl:i.depthFunc(i.NEVER);break;case Hl:i.depthFunc(i.ALWAYS);break;case Wl:i.depthFunc(i.LESS);break;case Xs:i.depthFunc(i.LEQUAL);break;case Xl:i.depthFunc(i.EQUAL);break;case Yl:i.depthFunc(i.GEQUAL);break;case ql:i.depthFunc(i.GREATER);break;case jl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}oe=we}},setLocked:function(we){V=we},setClear:function(we){Se!==we&&(ve&&(we=1-we),i.clearDepth(we),Se=we)},reset:function(){V=!1,ne=null,oe=null,Se=null,ve=!1}}}function s(){let V=!1,ve=null,ne=null,oe=null,Se=null,we=null,Je=null,St=null,Nt=null;return{setTest:function(nt){V||(nt?me(i.STENCIL_TEST):Le(i.STENCIL_TEST))},setMask:function(nt){ve!==nt&&!V&&(i.stencilMask(nt),ve=nt)},setFunc:function(nt,tn,Ht){(ne!==nt||oe!==tn||Se!==Ht)&&(i.stencilFunc(nt,tn,Ht),ne=nt,oe=tn,Se=Ht)},setOp:function(nt,tn,Ht){(we!==nt||Je!==tn||St!==Ht)&&(i.stencilOp(nt,tn,Ht),we=nt,Je=tn,St=Ht)},setLocked:function(nt){V=nt},setClear:function(nt){Nt!==nt&&(i.clearStencil(nt),Nt=nt)},reset:function(){V=!1,ve=null,ne=null,oe=null,Se=null,we=null,Je=null,St=null,Nt=null}}}const r=new t,a=new n,c=new s,u=new WeakMap,d=new WeakMap;let f={},m={},v=new WeakMap,g=[],b=null,y=!1,x=null,_=null,w=null,E=null,M=null,P=null,D=null,O=new Ke(0,0,0),U=0,L=!1,A=null,F=null,q=null,X=null,J=null;const Q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let te=!1,ee=0;const z=i.getParameter(i.VERSION);z.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(z)[1]),te=ee>=1):z.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),te=ee>=2);let le=null,ce={};const re=i.getParameter(i.SCISSOR_BOX),Re=i.getParameter(i.VIEWPORT),st=new Mt().fromArray(re),Y=new Mt().fromArray(Re);function ae(V,ve,ne,oe){const Se=new Uint8Array(4),we=i.createTexture();i.bindTexture(V,we),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Je=0;Je<ne;Je++)V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?i.texImage3D(ve,0,i.RGBA,1,1,oe,0,i.RGBA,i.UNSIGNED_BYTE,Se):i.texImage2D(ve+Je,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Se);return we}const ye={};ye[i.TEXTURE_2D]=ae(i.TEXTURE_2D,i.TEXTURE_2D,1),ye[i.TEXTURE_CUBE_MAP]=ae(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ye[i.TEXTURE_2D_ARRAY]=ae(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ye[i.TEXTURE_3D]=ae(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),c.setClear(0),me(i.DEPTH_TEST),a.setFunc(Xs),Ne(!1),He(gu),me(i.CULL_FACE),k(Ri);function me(V){f[V]!==!0&&(i.enable(V),f[V]=!0)}function Le(V){f[V]!==!1&&(i.disable(V),f[V]=!1)}function Fe(V,ve){return m[V]!==ve?(i.bindFramebuffer(V,ve),m[V]=ve,V===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=ve),V===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=ve),!0):!1}function Ve(V,ve){let ne=g,oe=!1;if(V){ne=v.get(ve),ne===void 0&&(ne=[],v.set(ve,ne));const Se=V.textures;if(ne.length!==Se.length||ne[0]!==i.COLOR_ATTACHMENT0){for(let we=0,Je=Se.length;we<Je;we++)ne[we]=i.COLOR_ATTACHMENT0+we;ne.length=Se.length,oe=!0}}else ne[0]!==i.BACK&&(ne[0]=i.BACK,oe=!0);oe&&i.drawBuffers(ne)}function j(V){return b!==V?(i.useProgram(V),b=V,!0):!1}const ge={[Ji]:i.FUNC_ADD,[uv]:i.FUNC_SUBTRACT,[dv]:i.FUNC_REVERSE_SUBTRACT};ge[pv]=i.MIN,ge[up]=i.MAX;const Xe={[fv]:i.ZERO,[kl]:i.ONE,[mv]:i.SRC_COLOR,[zl]:i.SRC_ALPHA,[yv]:i.SRC_ALPHA_SATURATE,[xv]:i.DST_COLOR,[vv]:i.DST_ALPHA,[gv]:i.ONE_MINUS_SRC_COLOR,[Vl]:i.ONE_MINUS_SRC_ALPHA,[bv]:i.ONE_MINUS_DST_COLOR,[_v]:i.ONE_MINUS_DST_ALPHA,[wv]:i.CONSTANT_COLOR,[Sv]:i.ONE_MINUS_CONSTANT_COLOR,[Mv]:i.CONSTANT_ALPHA,[Ev]:i.ONE_MINUS_CONSTANT_ALPHA};function k(V,ve,ne,oe,Se,we,Je,St,Nt,nt){if(V===Ri){y===!0&&(Le(i.BLEND),y=!1);return}if(y===!1&&(me(i.BLEND),y=!0),V!==hp){if(V!==x||nt!==L){if((_!==Ji||M!==Ji)&&(i.blendEquation(i.FUNC_ADD),_=Ji,M=Ji),nt)switch(V){case Wn:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vu:i.blendFunc(i.ONE,i.ONE);break;case _u:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case xu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case Wn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vu:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case _u:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case xu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}w=null,E=null,P=null,D=null,O.set(0,0,0),U=0,x=V,L=nt}return}Se=Se||ve,we=we||ne,Je=Je||oe,(ve!==_||Se!==M)&&(i.blendEquationSeparate(ge[ve],ge[Se]),_=ve,M=Se),(ne!==w||oe!==E||we!==P||Je!==D)&&(i.blendFuncSeparate(Xe[ne],Xe[oe],Xe[we],Xe[Je]),w=ne,E=oe,P=we,D=Je),(St.equals(O)===!1||Nt!==U)&&(i.blendColor(St.r,St.g,St.b,Nt),O.copy(St),U=Nt),x=V,L=!1}function ut(V,ve){V.side===Un?Le(i.CULL_FACE):me(i.CULL_FACE);let ne=V.side===pn;ve&&(ne=!ne),Ne(ne),V.blending===Wn&&V.transparent===!1?k(Ri):k(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),a.setFunc(V.depthFunc),a.setTest(V.depthTest),a.setMask(V.depthWrite),r.setMask(V.colorWrite);const oe=V.stencilWrite;c.setTest(oe),oe&&(c.setMask(V.stencilWriteMask),c.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),c.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),dt(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?me(i.SAMPLE_ALPHA_TO_COVERAGE):Le(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ne(V){A!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),A=V)}function He(V){V!==lv?(me(i.CULL_FACE),V!==F&&(V===gu?i.cullFace(i.BACK):V===cv?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Le(i.CULL_FACE),F=V}function Ie(V){V!==q&&(te&&i.lineWidth(V),q=V)}function dt(V,ve,ne){V?(me(i.POLYGON_OFFSET_FILL),(X!==ve||J!==ne)&&(i.polygonOffset(ve,ne),X=ve,J=ne)):Le(i.POLYGON_OFFSET_FILL)}function Oe(V){V?me(i.SCISSOR_TEST):Le(i.SCISSOR_TEST)}function N(V){V===void 0&&(V=i.TEXTURE0+Q-1),le!==V&&(i.activeTexture(V),le=V)}function C(V,ve,ne){ne===void 0&&(le===null?ne=i.TEXTURE0+Q-1:ne=le);let oe=ce[ne];oe===void 0&&(oe={type:void 0,texture:void 0},ce[ne]=oe),(oe.type!==V||oe.texture!==ve)&&(le!==ne&&(i.activeTexture(ne),le=ne),i.bindTexture(V,ve||ye[V]),oe.type=V,oe.texture=ve)}function $(){const V=ce[le];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function se(){try{i.compressedTexImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function he(){try{i.compressedTexImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ie(){try{i.texSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function De(){try{i.texSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function be(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ee(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function rt(){try{i.texStorage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function fe(){try{i.texStorage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Te(){try{i.texImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ke(){try{i.texImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ye(V){st.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),st.copy(V))}function Me(V){Y.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),Y.copy(V))}function tt(V,ve){let ne=d.get(ve);ne===void 0&&(ne=new WeakMap,d.set(ve,ne));let oe=ne.get(V);oe===void 0&&(oe=i.getUniformBlockIndex(ve,V.name),ne.set(V,oe))}function je(V,ve){const oe=d.get(ve).get(V);u.get(ve)!==oe&&(i.uniformBlockBinding(ve,oe,V.__bindingPointIndex),u.set(ve,oe))}function bt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},le=null,ce={},m={},v=new WeakMap,g=[],b=null,y=!1,x=null,_=null,w=null,E=null,M=null,P=null,D=null,O=new Ke(0,0,0),U=0,L=!1,A=null,F=null,q=null,X=null,J=null,st.set(0,0,i.canvas.width,i.canvas.height),Y.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),c.reset()}return{buffers:{color:r,depth:a,stencil:c},enable:me,disable:Le,bindFramebuffer:Fe,drawBuffers:Ve,useProgram:j,setBlending:k,setMaterial:ut,setFlipSided:Ne,setCullFace:He,setLineWidth:Ie,setPolygonOffset:dt,setScissorTest:Oe,activeTexture:N,bindTexture:C,unbindTexture:$,compressedTexImage2D:se,compressedTexImage3D:he,texImage2D:Te,texImage3D:ke,updateUBOMapping:tt,uniformBlockBinding:je,texStorage2D:rt,texStorage3D:fe,texSubImage2D:ie,texSubImage3D:De,compressedTexSubImage2D:be,compressedTexSubImage3D:Ee,scissor:Ye,viewport:Me,reset:bt}}function Ey(i,e,t,n,s,r,a){const c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,u=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new Ue,f=new WeakMap;let m;const v=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(N,C){return g?new OffscreenCanvas(N,C):Zo("canvas")}function y(N,C,$){let se=1;const he=Oe(N);if((he.width>$||he.height>$)&&(se=$/Math.max(he.width,he.height)),se<1)if(typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&N instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&N instanceof ImageBitmap||typeof VideoFrame<"u"&&N instanceof VideoFrame){const ie=Math.floor(se*he.width),De=Math.floor(se*he.height);m===void 0&&(m=b(ie,De));const be=C?b(ie,De):m;return be.width=ie,be.height=De,be.getContext("2d").drawImage(N,0,0,ie,De),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+he.width+"x"+he.height+") to ("+ie+"x"+De+")."),be}else return"data"in N&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+he.width+"x"+he.height+")."),N;return N}function x(N){return N.generateMipmaps}function _(N){i.generateMipmap(N)}function w(N){return N.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:N.isWebGL3DRenderTarget?i.TEXTURE_3D:N.isWebGLArrayRenderTarget||N.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(N,C,$,se,he=!1){if(N!==null){if(i[N]!==void 0)return i[N];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+N+"'")}let ie=C;if(C===i.RED&&($===i.FLOAT&&(ie=i.R32F),$===i.HALF_FLOAT&&(ie=i.R16F),$===i.UNSIGNED_BYTE&&(ie=i.R8)),C===i.RED_INTEGER&&($===i.UNSIGNED_BYTE&&(ie=i.R8UI),$===i.UNSIGNED_SHORT&&(ie=i.R16UI),$===i.UNSIGNED_INT&&(ie=i.R32UI),$===i.BYTE&&(ie=i.R8I),$===i.SHORT&&(ie=i.R16I),$===i.INT&&(ie=i.R32I)),C===i.RG&&($===i.FLOAT&&(ie=i.RG32F),$===i.HALF_FLOAT&&(ie=i.RG16F),$===i.UNSIGNED_BYTE&&(ie=i.RG8)),C===i.RG_INTEGER&&($===i.UNSIGNED_BYTE&&(ie=i.RG8UI),$===i.UNSIGNED_SHORT&&(ie=i.RG16UI),$===i.UNSIGNED_INT&&(ie=i.RG32UI),$===i.BYTE&&(ie=i.RG8I),$===i.SHORT&&(ie=i.RG16I),$===i.INT&&(ie=i.RG32I)),C===i.RGB_INTEGER&&($===i.UNSIGNED_BYTE&&(ie=i.RGB8UI),$===i.UNSIGNED_SHORT&&(ie=i.RGB16UI),$===i.UNSIGNED_INT&&(ie=i.RGB32UI),$===i.BYTE&&(ie=i.RGB8I),$===i.SHORT&&(ie=i.RGB16I),$===i.INT&&(ie=i.RGB32I)),C===i.RGBA_INTEGER&&($===i.UNSIGNED_BYTE&&(ie=i.RGBA8UI),$===i.UNSIGNED_SHORT&&(ie=i.RGBA16UI),$===i.UNSIGNED_INT&&(ie=i.RGBA32UI),$===i.BYTE&&(ie=i.RGBA8I),$===i.SHORT&&(ie=i.RGBA16I),$===i.INT&&(ie=i.RGBA32I)),C===i.RGB&&$===i.UNSIGNED_INT_5_9_9_9_REV&&(ie=i.RGB9_E5),C===i.RGBA){const De=he?jo:vt.getTransfer(se);$===i.FLOAT&&(ie=i.RGBA32F),$===i.HALF_FLOAT&&(ie=i.RGBA16F),$===i.UNSIGNED_BYTE&&(ie=De===yt?i.SRGB8_ALPHA8:i.RGBA8),$===i.UNSIGNED_SHORT_4_4_4_4&&(ie=i.RGBA4),$===i.UNSIGNED_SHORT_5_5_5_1&&(ie=i.RGB5_A1)}return(ie===i.R16F||ie===i.R32F||ie===i.RG16F||ie===i.RG32F||ie===i.RGBA16F||ie===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ie}function M(N,C){let $;return N?C===null||C===Di||C===$s?$=i.DEPTH24_STENCIL8:C===Tn?$=i.DEPTH32F_STENCIL8:C===js&&($=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===Di||C===$s?$=i.DEPTH_COMPONENT24:C===Tn?$=i.DEPTH_COMPONENT32F:C===js&&($=i.DEPTH_COMPONENT16),$}function P(N,C){return x(N)===!0||N.isFramebufferTexture&&N.minFilter!==It&&N.minFilter!==zt?Math.log2(Math.max(C.width,C.height))+1:N.mipmaps!==void 0&&N.mipmaps.length>0?N.mipmaps.length:N.isCompressedTexture&&Array.isArray(N.image)?C.mipmaps.length:1}function D(N){const C=N.target;C.removeEventListener("dispose",D),U(C),C.isVideoTexture&&f.delete(C)}function O(N){const C=N.target;C.removeEventListener("dispose",O),A(C)}function U(N){const C=n.get(N);if(C.__webglInit===void 0)return;const $=N.source,se=v.get($);if(se){const he=se[C.__cacheKey];he.usedTimes--,he.usedTimes===0&&L(N),Object.keys(se).length===0&&v.delete($)}n.remove(N)}function L(N){const C=n.get(N);i.deleteTexture(C.__webglTexture);const $=N.source,se=v.get($);delete se[C.__cacheKey],a.memory.textures--}function A(N){const C=n.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),n.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let se=0;se<6;se++){if(Array.isArray(C.__webglFramebuffer[se]))for(let he=0;he<C.__webglFramebuffer[se].length;he++)i.deleteFramebuffer(C.__webglFramebuffer[se][he]);else i.deleteFramebuffer(C.__webglFramebuffer[se]);C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer[se])}else{if(Array.isArray(C.__webglFramebuffer))for(let se=0;se<C.__webglFramebuffer.length;se++)i.deleteFramebuffer(C.__webglFramebuffer[se]);else i.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&i.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&i.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let se=0;se<C.__webglColorRenderbuffer.length;se++)C.__webglColorRenderbuffer[se]&&i.deleteRenderbuffer(C.__webglColorRenderbuffer[se]);C.__webglDepthRenderbuffer&&i.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const $=N.textures;for(let se=0,he=$.length;se<he;se++){const ie=n.get($[se]);ie.__webglTexture&&(i.deleteTexture(ie.__webglTexture),a.memory.textures--),n.remove($[se])}n.remove(N)}let F=0;function q(){F=0}function X(){const N=F;return N>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+N+" texture units while this GPU supports only "+s.maxTextures),F+=1,N}function J(N){const C=[];return C.push(N.wrapS),C.push(N.wrapT),C.push(N.wrapR||0),C.push(N.magFilter),C.push(N.minFilter),C.push(N.anisotropy),C.push(N.internalFormat),C.push(N.format),C.push(N.type),C.push(N.generateMipmaps),C.push(N.premultiplyAlpha),C.push(N.flipY),C.push(N.unpackAlignment),C.push(N.colorSpace),C.join()}function Q(N,C){const $=n.get(N);if(N.isVideoTexture&&Ie(N),N.isRenderTargetTexture===!1&&N.version>0&&$.__version!==N.version){const se=N.image;if(se===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(se.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y($,N,C);return}}t.bindTexture(i.TEXTURE_2D,$.__webglTexture,i.TEXTURE0+C)}function te(N,C){const $=n.get(N);if(N.version>0&&$.__version!==N.version){Y($,N,C);return}t.bindTexture(i.TEXTURE_2D_ARRAY,$.__webglTexture,i.TEXTURE0+C)}function ee(N,C){const $=n.get(N);if(N.version>0&&$.__version!==N.version){Y($,N,C);return}t.bindTexture(i.TEXTURE_3D,$.__webglTexture,i.TEXTURE0+C)}function z(N,C){const $=n.get(N);if(N.version>0&&$.__version!==N.version){ae($,N,C);return}t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture,i.TEXTURE0+C)}const le={[Yo]:i.REPEAT,[dn]:i.CLAMP_TO_EDGE,[qo]:i.MIRRORED_REPEAT},ce={[It]:i.NEAREST,[dp]:i.NEAREST_MIPMAP_NEAREST,[Sr]:i.NEAREST_MIPMAP_LINEAR,[zt]:i.LINEAR,[Fo]:i.LINEAR_MIPMAP_NEAREST,[Ei]:i.LINEAR_MIPMAP_LINEAR},re={[zv]:i.NEVER,[Yv]:i.ALWAYS,[Vv]:i.LESS,[bp]:i.LEQUAL,[Gv]:i.EQUAL,[Xv]:i.GEQUAL,[Hv]:i.GREATER,[Wv]:i.NOTEQUAL};function Re(N,C){if(C.type===Tn&&e.has("OES_texture_float_linear")===!1&&(C.magFilter===zt||C.magFilter===Fo||C.magFilter===Sr||C.magFilter===Ei||C.minFilter===zt||C.minFilter===Fo||C.minFilter===Sr||C.minFilter===Ei)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(N,i.TEXTURE_WRAP_S,le[C.wrapS]),i.texParameteri(N,i.TEXTURE_WRAP_T,le[C.wrapT]),(N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY)&&i.texParameteri(N,i.TEXTURE_WRAP_R,le[C.wrapR]),i.texParameteri(N,i.TEXTURE_MAG_FILTER,ce[C.magFilter]),i.texParameteri(N,i.TEXTURE_MIN_FILTER,ce[C.minFilter]),C.compareFunction&&(i.texParameteri(N,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(N,i.TEXTURE_COMPARE_FUNC,re[C.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===It||C.minFilter!==Sr&&C.minFilter!==Ei||C.type===Tn&&e.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||n.get(C).__currentAnisotropy){const $=e.get("EXT_texture_filter_anisotropic");i.texParameterf(N,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,s.getMaxAnisotropy())),n.get(C).__currentAnisotropy=C.anisotropy}}}function st(N,C){let $=!1;N.__webglInit===void 0&&(N.__webglInit=!0,C.addEventListener("dispose",D));const se=C.source;let he=v.get(se);he===void 0&&(he={},v.set(se,he));const ie=J(C);if(ie!==N.__cacheKey){he[ie]===void 0&&(he[ie]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,$=!0),he[ie].usedTimes++;const De=he[N.__cacheKey];De!==void 0&&(he[N.__cacheKey].usedTimes--,De.usedTimes===0&&L(C)),N.__cacheKey=ie,N.__webglTexture=he[ie].texture}return $}function Y(N,C,$){let se=i.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(se=i.TEXTURE_2D_ARRAY),C.isData3DTexture&&(se=i.TEXTURE_3D);const he=st(N,C),ie=C.source;t.bindTexture(se,N.__webglTexture,i.TEXTURE0+$);const De=n.get(ie);if(ie.version!==De.__version||he===!0){t.activeTexture(i.TEXTURE0+$);const be=vt.getPrimaries(vt.workingColorSpace),Ee=C.colorSpace===ri?null:vt.getPrimaries(C.colorSpace),rt=C.colorSpace===ri||be===Ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,rt);let fe=y(C.image,!1,s.maxTextureSize);fe=dt(C,fe);const Te=r.convert(C.format,C.colorSpace),ke=r.convert(C.type);let Ye=E(C.internalFormat,Te,ke,C.colorSpace,C.isVideoTexture);Re(se,C);let Me;const tt=C.mipmaps,je=C.isVideoTexture!==!0,bt=De.__version===void 0||he===!0,V=ie.dataReady,ve=P(C,fe);if(C.isDepthTexture)Ye=M(C.format===Ks,C.type),bt&&(je?t.texStorage2D(i.TEXTURE_2D,1,Ye,fe.width,fe.height):t.texImage2D(i.TEXTURE_2D,0,Ye,fe.width,fe.height,0,Te,ke,null));else if(C.isDataTexture)if(tt.length>0){je&&bt&&t.texStorage2D(i.TEXTURE_2D,ve,Ye,tt[0].width,tt[0].height);for(let ne=0,oe=tt.length;ne<oe;ne++)Me=tt[ne],je?V&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,Me.width,Me.height,Te,ke,Me.data):t.texImage2D(i.TEXTURE_2D,ne,Ye,Me.width,Me.height,0,Te,ke,Me.data);C.generateMipmaps=!1}else je?(bt&&t.texStorage2D(i.TEXTURE_2D,ve,Ye,fe.width,fe.height),V&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,fe.width,fe.height,Te,ke,fe.data)):t.texImage2D(i.TEXTURE_2D,0,Ye,fe.width,fe.height,0,Te,ke,fe.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){je&&bt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ve,Ye,tt[0].width,tt[0].height,fe.depth);for(let ne=0,oe=tt.length;ne<oe;ne++)if(Me=tt[ne],C.format!==Xt)if(Te!==null)if(je){if(V)if(C.layerUpdates.size>0){const Se=$u(Me.width,Me.height,C.format,C.type);for(const we of C.layerUpdates){const Je=Me.data.subarray(we*Se/Me.data.BYTES_PER_ELEMENT,(we+1)*Se/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,we,Me.width,Me.height,1,Te,Je)}C.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,Me.width,Me.height,fe.depth,Te,Me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ne,Ye,Me.width,Me.height,fe.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else je?V&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,Me.width,Me.height,fe.depth,Te,ke,Me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ne,Ye,Me.width,Me.height,fe.depth,0,Te,ke,Me.data)}else{je&&bt&&t.texStorage2D(i.TEXTURE_2D,ve,Ye,tt[0].width,tt[0].height);for(let ne=0,oe=tt.length;ne<oe;ne++)Me=tt[ne],C.format!==Xt?Te!==null?je?V&&t.compressedTexSubImage2D(i.TEXTURE_2D,ne,0,0,Me.width,Me.height,Te,Me.data):t.compressedTexImage2D(i.TEXTURE_2D,ne,Ye,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):je?V&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,Me.width,Me.height,Te,ke,Me.data):t.texImage2D(i.TEXTURE_2D,ne,Ye,Me.width,Me.height,0,Te,ke,Me.data)}else if(C.isDataArrayTexture)if(je){if(bt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ve,Ye,fe.width,fe.height,fe.depth),V)if(C.layerUpdates.size>0){const ne=$u(fe.width,fe.height,C.format,C.type);for(const oe of C.layerUpdates){const Se=fe.data.subarray(oe*ne/fe.data.BYTES_PER_ELEMENT,(oe+1)*ne/fe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,oe,fe.width,fe.height,1,Te,ke,Se)}C.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,fe.width,fe.height,fe.depth,Te,ke,fe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ye,fe.width,fe.height,fe.depth,0,Te,ke,fe.data);else if(C.isData3DTexture)je?(bt&&t.texStorage3D(i.TEXTURE_3D,ve,Ye,fe.width,fe.height,fe.depth),V&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,fe.width,fe.height,fe.depth,Te,ke,fe.data)):t.texImage3D(i.TEXTURE_3D,0,Ye,fe.width,fe.height,fe.depth,0,Te,ke,fe.data);else if(C.isFramebufferTexture){if(bt)if(je)t.texStorage2D(i.TEXTURE_2D,ve,Ye,fe.width,fe.height);else{let ne=fe.width,oe=fe.height;for(let Se=0;Se<ve;Se++)t.texImage2D(i.TEXTURE_2D,Se,Ye,ne,oe,0,Te,ke,null),ne>>=1,oe>>=1}}else if(tt.length>0){if(je&&bt){const ne=Oe(tt[0]);t.texStorage2D(i.TEXTURE_2D,ve,Ye,ne.width,ne.height)}for(let ne=0,oe=tt.length;ne<oe;ne++)Me=tt[ne],je?V&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,Te,ke,Me):t.texImage2D(i.TEXTURE_2D,ne,Ye,Te,ke,Me);C.generateMipmaps=!1}else if(je){if(bt){const ne=Oe(fe);t.texStorage2D(i.TEXTURE_2D,ve,Ye,ne.width,ne.height)}V&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Te,ke,fe)}else t.texImage2D(i.TEXTURE_2D,0,Ye,Te,ke,fe);x(C)&&_(se),De.__version=ie.version,C.onUpdate&&C.onUpdate(C)}N.__version=C.version}function ae(N,C,$){if(C.image.length!==6)return;const se=st(N,C),he=C.source;t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+$);const ie=n.get(he);if(he.version!==ie.__version||se===!0){t.activeTexture(i.TEXTURE0+$);const De=vt.getPrimaries(vt.workingColorSpace),be=C.colorSpace===ri?null:vt.getPrimaries(C.colorSpace),Ee=C.colorSpace===ri||De===be?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,C.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,C.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee);const rt=C.isCompressedTexture||C.image[0].isCompressedTexture,fe=C.image[0]&&C.image[0].isDataTexture,Te=[];for(let oe=0;oe<6;oe++)!rt&&!fe?Te[oe]=y(C.image[oe],!0,s.maxCubemapSize):Te[oe]=fe?C.image[oe].image:C.image[oe],Te[oe]=dt(C,Te[oe]);const ke=Te[0],Ye=r.convert(C.format,C.colorSpace),Me=r.convert(C.type),tt=E(C.internalFormat,Ye,Me,C.colorSpace),je=C.isVideoTexture!==!0,bt=ie.__version===void 0||se===!0,V=he.dataReady;let ve=P(C,ke);Re(i.TEXTURE_CUBE_MAP,C);let ne;if(rt){je&&bt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,tt,ke.width,ke.height);for(let oe=0;oe<6;oe++){ne=Te[oe].mipmaps;for(let Se=0;Se<ne.length;Se++){const we=ne[Se];C.format!==Xt?Ye!==null?je?V&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Se,0,0,we.width,we.height,Ye,we.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Se,tt,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):je?V&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Se,0,0,we.width,we.height,Ye,Me,we.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Se,tt,we.width,we.height,0,Ye,Me,we.data)}}}else{if(ne=C.mipmaps,je&&bt){ne.length>0&&ve++;const oe=Oe(Te[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,tt,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(fe){je?V&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Te[oe].width,Te[oe].height,Ye,Me,Te[oe].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,tt,Te[oe].width,Te[oe].height,0,Ye,Me,Te[oe].data);for(let Se=0;Se<ne.length;Se++){const Je=ne[Se].image[oe].image;je?V&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Se+1,0,0,Je.width,Je.height,Ye,Me,Je.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Se+1,tt,Je.width,Je.height,0,Ye,Me,Je.data)}}else{je?V&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Ye,Me,Te[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,tt,Ye,Me,Te[oe]);for(let Se=0;Se<ne.length;Se++){const we=ne[Se];je?V&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Se+1,0,0,Ye,Me,we.image[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Se+1,tt,Ye,Me,we.image[oe])}}}x(C)&&_(i.TEXTURE_CUBE_MAP),ie.__version=he.version,C.onUpdate&&C.onUpdate(C)}N.__version=C.version}function ye(N,C,$,se,he,ie){const De=r.convert($.format,$.colorSpace),be=r.convert($.type),Ee=E($.internalFormat,De,be,$.colorSpace),rt=n.get(C),fe=n.get($);if(fe.__renderTarget=C,!rt.__hasExternalTextures){const Te=Math.max(1,C.width>>ie),ke=Math.max(1,C.height>>ie);he===i.TEXTURE_3D||he===i.TEXTURE_2D_ARRAY?t.texImage3D(he,ie,Ee,Te,ke,C.depth,0,De,be,null):t.texImage2D(he,ie,Ee,Te,ke,0,De,be,null)}t.bindFramebuffer(i.FRAMEBUFFER,N),He(C)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,se,he,fe.__webglTexture,0,Ne(C)):(he===i.TEXTURE_2D||he>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&he<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,se,he,fe.__webglTexture,ie),t.bindFramebuffer(i.FRAMEBUFFER,null)}function me(N,C,$){if(i.bindRenderbuffer(i.RENDERBUFFER,N),C.depthBuffer){const se=C.depthTexture,he=se&&se.isDepthTexture?se.type:null,ie=M(C.stencilBuffer,he),De=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,be=Ne(C);He(C)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,be,ie,C.width,C.height):$?i.renderbufferStorageMultisample(i.RENDERBUFFER,be,ie,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,ie,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,De,i.RENDERBUFFER,N)}else{const se=C.textures;for(let he=0;he<se.length;he++){const ie=se[he],De=r.convert(ie.format,ie.colorSpace),be=r.convert(ie.type),Ee=E(ie.internalFormat,De,be,ie.colorSpace),rt=Ne(C);$&&He(C)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt,Ee,C.width,C.height):He(C)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt,Ee,C.width,C.height):i.renderbufferStorage(i.RENDERBUFFER,Ee,C.width,C.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Le(N,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,N),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const se=n.get(C.depthTexture);se.__renderTarget=C,(!se.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),Q(C.depthTexture,0);const he=se.__webglTexture,ie=Ne(C);if(C.depthTexture.format===zs)He(C)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,he,0,ie):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,he,0);else if(C.depthTexture.format===Ks)He(C)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,he,0,ie):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,he,0);else throw new Error("Unknown depthTexture format")}function Fe(N){const C=n.get(N),$=N.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==N.depthTexture){const se=N.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),se){const he=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,se.removeEventListener("dispose",he)};se.addEventListener("dispose",he),C.__depthDisposeCallback=he}C.__boundDepthTexture=se}if(N.depthTexture&&!C.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");Le(C.__webglFramebuffer,N)}else if($){C.__webglDepthbuffer=[];for(let se=0;se<6;se++)if(t.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer[se]),C.__webglDepthbuffer[se]===void 0)C.__webglDepthbuffer[se]=i.createRenderbuffer(),me(C.__webglDepthbuffer[se],N,!1);else{const he=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=C.__webglDepthbuffer[se];i.bindRenderbuffer(i.RENDERBUFFER,ie),i.framebufferRenderbuffer(i.FRAMEBUFFER,he,i.RENDERBUFFER,ie)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=i.createRenderbuffer(),me(C.__webglDepthbuffer,N,!1);else{const se=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=C.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,he),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,he)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ve(N,C,$){const se=n.get(N);C!==void 0&&ye(se.__webglFramebuffer,N,N.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),$!==void 0&&Fe(N)}function j(N){const C=N.texture,$=n.get(N),se=n.get(C);N.addEventListener("dispose",O);const he=N.textures,ie=N.isWebGLCubeRenderTarget===!0,De=he.length>1;if(De||(se.__webglTexture===void 0&&(se.__webglTexture=i.createTexture()),se.__version=C.version,a.memory.textures++),ie){$.__webglFramebuffer=[];for(let be=0;be<6;be++)if(C.mipmaps&&C.mipmaps.length>0){$.__webglFramebuffer[be]=[];for(let Ee=0;Ee<C.mipmaps.length;Ee++)$.__webglFramebuffer[be][Ee]=i.createFramebuffer()}else $.__webglFramebuffer[be]=i.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){$.__webglFramebuffer=[];for(let be=0;be<C.mipmaps.length;be++)$.__webglFramebuffer[be]=i.createFramebuffer()}else $.__webglFramebuffer=i.createFramebuffer();if(De)for(let be=0,Ee=he.length;be<Ee;be++){const rt=n.get(he[be]);rt.__webglTexture===void 0&&(rt.__webglTexture=i.createTexture(),a.memory.textures++)}if(N.samples>0&&He(N)===!1){$.__webglMultisampledFramebuffer=i.createFramebuffer(),$.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let be=0;be<he.length;be++){const Ee=he[be];$.__webglColorRenderbuffer[be]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,$.__webglColorRenderbuffer[be]);const rt=r.convert(Ee.format,Ee.colorSpace),fe=r.convert(Ee.type),Te=E(Ee.internalFormat,rt,fe,Ee.colorSpace,N.isXRRenderTarget===!0),ke=Ne(N);i.renderbufferStorageMultisample(i.RENDERBUFFER,ke,Te,N.width,N.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+be,i.RENDERBUFFER,$.__webglColorRenderbuffer[be])}i.bindRenderbuffer(i.RENDERBUFFER,null),N.depthBuffer&&($.__webglDepthRenderbuffer=i.createRenderbuffer(),me($.__webglDepthRenderbuffer,N,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ie){t.bindTexture(i.TEXTURE_CUBE_MAP,se.__webglTexture),Re(i.TEXTURE_CUBE_MAP,C);for(let be=0;be<6;be++)if(C.mipmaps&&C.mipmaps.length>0)for(let Ee=0;Ee<C.mipmaps.length;Ee++)ye($.__webglFramebuffer[be][Ee],N,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+be,Ee);else ye($.__webglFramebuffer[be],N,C,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+be,0);x(C)&&_(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(De){for(let be=0,Ee=he.length;be<Ee;be++){const rt=he[be],fe=n.get(rt);t.bindTexture(i.TEXTURE_2D,fe.__webglTexture),Re(i.TEXTURE_2D,rt),ye($.__webglFramebuffer,N,rt,i.COLOR_ATTACHMENT0+be,i.TEXTURE_2D,0),x(rt)&&_(i.TEXTURE_2D)}t.unbindTexture()}else{let be=i.TEXTURE_2D;if((N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(be=N.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(be,se.__webglTexture),Re(be,C),C.mipmaps&&C.mipmaps.length>0)for(let Ee=0;Ee<C.mipmaps.length;Ee++)ye($.__webglFramebuffer[Ee],N,C,i.COLOR_ATTACHMENT0,be,Ee);else ye($.__webglFramebuffer,N,C,i.COLOR_ATTACHMENT0,be,0);x(C)&&_(be),t.unbindTexture()}N.depthBuffer&&Fe(N)}function ge(N){const C=N.textures;for(let $=0,se=C.length;$<se;$++){const he=C[$];if(x(he)){const ie=w(N),De=n.get(he).__webglTexture;t.bindTexture(ie,De),_(ie),t.unbindTexture()}}}const Xe=[],k=[];function ut(N){if(N.samples>0){if(He(N)===!1){const C=N.textures,$=N.width,se=N.height;let he=i.COLOR_BUFFER_BIT;const ie=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,De=n.get(N),be=C.length>1;if(be)for(let Ee=0;Ee<C.length;Ee++)t.bindFramebuffer(i.FRAMEBUFFER,De.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ee,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,De.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ee,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,De.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,De.__webglFramebuffer);for(let Ee=0;Ee<C.length;Ee++){if(N.resolveDepthBuffer&&(N.depthBuffer&&(he|=i.DEPTH_BUFFER_BIT),N.stencilBuffer&&N.resolveStencilBuffer&&(he|=i.STENCIL_BUFFER_BIT)),be){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,De.__webglColorRenderbuffer[Ee]);const rt=n.get(C[Ee]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,rt,0)}i.blitFramebuffer(0,0,$,se,0,0,$,se,he,i.NEAREST),u===!0&&(Xe.length=0,k.length=0,Xe.push(i.COLOR_ATTACHMENT0+Ee),N.depthBuffer&&N.resolveDepthBuffer===!1&&(Xe.push(ie),k.push(ie),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,k)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Xe))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),be)for(let Ee=0;Ee<C.length;Ee++){t.bindFramebuffer(i.FRAMEBUFFER,De.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ee,i.RENDERBUFFER,De.__webglColorRenderbuffer[Ee]);const rt=n.get(C[Ee]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,De.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ee,i.TEXTURE_2D,rt,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,De.__webglMultisampledFramebuffer)}else if(N.depthBuffer&&N.resolveDepthBuffer===!1&&u){const C=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[C])}}}function Ne(N){return Math.min(s.maxSamples,N.samples)}function He(N){const C=n.get(N);return N.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function Ie(N){const C=a.render.frame;f.get(N)!==C&&(f.set(N,C),N.update())}function dt(N,C){const $=N.colorSpace,se=N.format,he=N.type;return N.isCompressedTexture===!0||N.isVideoTexture===!0||$!==Zs&&$!==ri&&(vt.getTransfer($)===yt?(se!==Xt||he!==Qt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),C}function Oe(N){return typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement?(d.width=N.naturalWidth||N.width,d.height=N.naturalHeight||N.height):typeof VideoFrame<"u"&&N instanceof VideoFrame?(d.width=N.displayWidth,d.height=N.displayHeight):(d.width=N.width,d.height=N.height),d}this.allocateTextureUnit=X,this.resetTextureUnits=q,this.setTexture2D=Q,this.setTexture2DArray=te,this.setTexture3D=ee,this.setTextureCube=z,this.rebindTextures=Ve,this.setupRenderTarget=j,this.updateRenderTargetMipmap=ge,this.updateMultisampleRenderTarget=ut,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=ye,this.useMultisampledRTT=He}function Ay(i,e){function t(n,s=ri){let r;const a=vt.getTransfer(s);if(n===Qt)return i.UNSIGNED_BYTE;if(n===Bc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===kc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===pp)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Oc)return i.BYTE;if(n===Fc)return i.SHORT;if(n===js)return i.UNSIGNED_SHORT;if(n===aa)return i.INT;if(n===Di)return i.UNSIGNED_INT;if(n===Tn)return i.FLOAT;if(n===Br)return i.HALF_FLOAT;if(n===fp)return i.ALPHA;if(n===mp)return i.RGB;if(n===Xt)return i.RGBA;if(n===zc)return i.LUMINANCE;if(n===gp)return i.LUMINANCE_ALPHA;if(n===zs)return i.DEPTH_COMPONENT;if(n===Ks)return i.DEPTH_STENCIL;if(n===la)return i.RED;if(n===ii)return i.RED_INTEGER;if(n===vp)return i.RG;if(n===Vc)return i.RG_INTEGER;if(n===Gc)return i.RGBA_INTEGER;if(n===Bo||n===ko||n===zo||n===Vo)if(a===yt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Bo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ko)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Vo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Bo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ko)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===zo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Vo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Zl||n===Jl||n===Ql||n===ec)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Zl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Jl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ql)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ec)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===tc||n===nc||n===ic)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===tc||n===nc)return a===yt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ic)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===sc||n===rc||n===oc||n===ac||n===lc||n===cc||n===hc||n===uc||n===dc||n===pc||n===fc||n===mc||n===gc||n===vc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===sc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===rc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===oc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ac)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===lc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===cc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===hc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===uc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===dc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===pc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===fc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===mc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===gc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===vc)return a===yt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Go||n===_c||n===xc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Go)return a===yt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===_c)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===xc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===_p||n===bc||n===yc||n===wc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Go)return r.COMPRESSED_RED_RGTC1_EXT;if(n===bc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===yc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===wc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===$s?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Cy={type:"move"};class Ml{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ai,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ai,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ai,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const c=this._targetRay,u=this._grip,d=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(d&&e.hand){a=!0;for(const y of e.hand.values()){const x=t.getJointPose(y,n),_=this._getHandJoint(d,y);x!==null&&(_.matrix.fromArray(x.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=x.radius),_.visible=x!==null}const f=d.joints["index-finger-tip"],m=d.joints["thumb-tip"],v=f.position.distanceTo(m.position),g=.02,b=.005;d.inputState.pinching&&v>g+b?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!d.inputState.pinching&&v<=g-b&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else u!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(u.matrix.fromArray(r.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,r.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(r.linearVelocity)):u.hasLinearVelocity=!1,r.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(r.angularVelocity)):u.hasAngularVelocity=!1));c!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1,this.dispatchEvent(Cy)))}return c!==null&&(c.visible=s!==null),u!==null&&(u.visible=r!==null),d!==null&&(d.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ai;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Ty=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ry=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Py{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new Tt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new mn({vertexShader:Ty,fragmentShader:Ry,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Lt(new Ni(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ly extends is{constructor(e,t){super();const n=this;let s=null,r=1,a=null,c="local-floor",u=1,d=null,f=null,m=null,v=null,g=null,b=null;const y=new Py,x=t.getContextAttributes();let _=null,w=null;const E=[],M=[],P=new Ue;let D=null;const O=new un;O.viewport=new Mt;const U=new un;U.viewport=new Mt;const L=[O,U],A=new G0;let F=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ae=E[Y];return ae===void 0&&(ae=new Ml,E[Y]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(Y){let ae=E[Y];return ae===void 0&&(ae=new Ml,E[Y]=ae),ae.getGripSpace()},this.getHand=function(Y){let ae=E[Y];return ae===void 0&&(ae=new Ml,E[Y]=ae),ae.getHandSpace()};function X(Y){const ae=M.indexOf(Y.inputSource);if(ae===-1)return;const ye=E[ae];ye!==void 0&&(ye.update(Y.inputSource,Y.frame,d||a),ye.dispatchEvent({type:Y.type,data:Y.inputSource}))}function J(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",Q);for(let Y=0;Y<E.length;Y++){const ae=M[Y];ae!==null&&(M[Y]=null,E[Y].disconnect(ae))}F=null,q=null,y.reset(),e.setRenderTarget(_),g=null,v=null,m=null,s=null,w=null,st.stop(),n.isPresenting=!1,e.setPixelRatio(D),e.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){c=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||a},this.setReferenceSpace=function(Y){d=Y},this.getBaseLayer=function(){return v!==null?v:g},this.getBinding=function(){return m},this.getFrame=function(){return b},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(_=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",J),s.addEventListener("inputsourceschange",Q),x.xrCompatible!==!0&&await t.makeXRCompatible(),D=e.getPixelRatio(),e.getSize(P),s.renderState.layers===void 0){const ae={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,t,ae),s.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),w=new Fn(g.framebufferWidth,g.framebufferHeight,{format:Xt,type:Qt,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil})}else{let ae=null,ye=null,me=null;x.depth&&(me=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=x.stencil?Ks:zs,ye=x.stencil?$s:Di);const Le={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:r};m=new XRWebGLBinding(s,t),v=m.createProjectionLayer(Le),s.updateRenderState({layers:[v]}),e.setPixelRatio(1),e.setSize(v.textureWidth,v.textureHeight,!1),w=new Fn(v.textureWidth,v.textureHeight,{format:Xt,type:Qt,depthTexture:new jc(v.textureWidth,v.textureHeight,ye,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:v.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(u),d=null,a=await s.requestReferenceSpace(c),st.setContext(s),st.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function Q(Y){for(let ae=0;ae<Y.removed.length;ae++){const ye=Y.removed[ae],me=M.indexOf(ye);me>=0&&(M[me]=null,E[me].disconnect(ye))}for(let ae=0;ae<Y.added.length;ae++){const ye=Y.added[ae];let me=M.indexOf(ye);if(me===-1){for(let Fe=0;Fe<E.length;Fe++)if(Fe>=M.length){M.push(ye),me=Fe;break}else if(M[Fe]===null){M[Fe]=ye,me=Fe;break}if(me===-1)break}const Le=E[me];Le&&Le.connect(ye)}}const te=new I,ee=new I;function z(Y,ae,ye){te.setFromMatrixPosition(ae.matrixWorld),ee.setFromMatrixPosition(ye.matrixWorld);const me=te.distanceTo(ee),Le=ae.projectionMatrix.elements,Fe=ye.projectionMatrix.elements,Ve=Le[14]/(Le[10]-1),j=Le[14]/(Le[10]+1),ge=(Le[9]+1)/Le[5],Xe=(Le[9]-1)/Le[5],k=(Le[8]-1)/Le[0],ut=(Fe[8]+1)/Fe[0],Ne=Ve*k,He=Ve*ut,Ie=me/(-k+ut),dt=Ie*-k;if(ae.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(dt),Y.translateZ(Ie),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Le[10]===-1)Y.projectionMatrix.copy(ae.projectionMatrix),Y.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{const Oe=Ve+Ie,N=j+Ie,C=Ne-dt,$=He+(me-dt),se=ge*j/N*Oe,he=Xe*j/N*Oe;Y.projectionMatrix.makePerspective(C,$,se,he,Oe,N),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function le(Y,ae){ae===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ae.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let ae=Y.near,ye=Y.far;y.texture!==null&&(y.depthNear>0&&(ae=y.depthNear),y.depthFar>0&&(ye=y.depthFar)),A.near=U.near=O.near=ae,A.far=U.far=O.far=ye,(F!==A.near||q!==A.far)&&(s.updateRenderState({depthNear:A.near,depthFar:A.far}),F=A.near,q=A.far),O.layers.mask=Y.layers.mask|2,U.layers.mask=Y.layers.mask|4,A.layers.mask=O.layers.mask|U.layers.mask;const me=Y.parent,Le=A.cameras;le(A,me);for(let Fe=0;Fe<Le.length;Fe++)le(Le[Fe],me);Le.length===2?z(A,O,U):A.projectionMatrix.copy(O.projectionMatrix),ce(Y,A,me)};function ce(Y,ae,ye){ye===null?Y.matrix.copy(ae.matrixWorld):(Y.matrix.copy(ye.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ae.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ae.projectionMatrix),Y.projectionMatrixInverse.copy(ae.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Js*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(!(v===null&&g===null))return u},this.setFoveation=function(Y){u=Y,v!==null&&(v.fixedFoveation=Y),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=Y)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(A)};let re=null;function Re(Y,ae){if(f=ae.getViewerPose(d||a),b=ae,f!==null){const ye=f.views;g!==null&&(e.setRenderTargetFramebuffer(w,g.framebuffer),e.setRenderTarget(w));let me=!1;ye.length!==A.cameras.length&&(A.cameras.length=0,me=!0);for(let Fe=0;Fe<ye.length;Fe++){const Ve=ye[Fe];let j=null;if(g!==null)j=g.getViewport(Ve);else{const Xe=m.getViewSubImage(v,Ve);j=Xe.viewport,Fe===0&&(e.setRenderTargetTextures(w,Xe.colorTexture,v.ignoreDepthValues?void 0:Xe.depthStencilTexture),e.setRenderTarget(w))}let ge=L[Fe];ge===void 0&&(ge=new un,ge.layers.enable(Fe),ge.viewport=new Mt,L[Fe]=ge),ge.matrix.fromArray(Ve.transform.matrix),ge.matrix.decompose(ge.position,ge.quaternion,ge.scale),ge.projectionMatrix.fromArray(Ve.projectionMatrix),ge.projectionMatrixInverse.copy(ge.projectionMatrix).invert(),ge.viewport.set(j.x,j.y,j.width,j.height),Fe===0&&(A.matrix.copy(ge.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),me===!0&&A.cameras.push(ge)}const Le=s.enabledFeatures;if(Le&&Le.includes("depth-sensing")){const Fe=m.getDepthInformation(ye[0]);Fe&&Fe.isValid&&Fe.texture&&y.init(e,Fe,s.renderState)}}for(let ye=0;ye<E.length;ye++){const me=M[ye],Le=E[ye];me!==null&&Le!==void 0&&Le.update(me,ae,d||a)}re&&re(Y,ae),ae.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ae}),b=null}const st=new Up;st.setAnimationLoop(Re),this.setAnimationLoop=function(Y){re=Y},this.dispose=function(){}}}const Ki=new en,Iy=new _t;function Dy(i,e){function t(x,_){x.matrixAutoUpdate===!0&&x.updateMatrix(),_.value.copy(x.matrix)}function n(x,_){_.color.getRGB(x.fogColor.value,Rp(i)),_.isFog?(x.fogNear.value=_.near,x.fogFar.value=_.far):_.isFogExp2&&(x.fogDensity.value=_.density)}function s(x,_,w,E,M){_.isMeshBasicMaterial||_.isMeshLambertMaterial?r(x,_):_.isMeshToonMaterial?(r(x,_),m(x,_)):_.isMeshPhongMaterial?(r(x,_),f(x,_)):_.isMeshStandardMaterial?(r(x,_),v(x,_),_.isMeshPhysicalMaterial&&g(x,_,M)):_.isMeshMatcapMaterial?(r(x,_),b(x,_)):_.isMeshDepthMaterial?r(x,_):_.isMeshDistanceMaterial?(r(x,_),y(x,_)):_.isMeshNormalMaterial?r(x,_):_.isLineBasicMaterial?(a(x,_),_.isLineDashedMaterial&&c(x,_)):_.isPointsMaterial?u(x,_,w,E):_.isSpriteMaterial?d(x,_):_.isShadowMaterial?(x.color.value.copy(_.color),x.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function r(x,_){x.opacity.value=_.opacity,_.color&&x.diffuse.value.copy(_.color),_.emissive&&x.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(x.map.value=_.map,t(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,t(_.alphaMap,x.alphaMapTransform)),_.bumpMap&&(x.bumpMap.value=_.bumpMap,t(_.bumpMap,x.bumpMapTransform),x.bumpScale.value=_.bumpScale,_.side===pn&&(x.bumpScale.value*=-1)),_.normalMap&&(x.normalMap.value=_.normalMap,t(_.normalMap,x.normalMapTransform),x.normalScale.value.copy(_.normalScale),_.side===pn&&x.normalScale.value.negate()),_.displacementMap&&(x.displacementMap.value=_.displacementMap,t(_.displacementMap,x.displacementMapTransform),x.displacementScale.value=_.displacementScale,x.displacementBias.value=_.displacementBias),_.emissiveMap&&(x.emissiveMap.value=_.emissiveMap,t(_.emissiveMap,x.emissiveMapTransform)),_.specularMap&&(x.specularMap.value=_.specularMap,t(_.specularMap,x.specularMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest);const w=e.get(_),E=w.envMap,M=w.envMapRotation;E&&(x.envMap.value=E,Ki.copy(M),Ki.x*=-1,Ki.y*=-1,Ki.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Ki.y*=-1,Ki.z*=-1),x.envMapRotation.value.setFromMatrix4(Iy.makeRotationFromEuler(Ki)),x.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=_.reflectivity,x.ior.value=_.ior,x.refractionRatio.value=_.refractionRatio),_.lightMap&&(x.lightMap.value=_.lightMap,x.lightMapIntensity.value=_.lightMapIntensity,t(_.lightMap,x.lightMapTransform)),_.aoMap&&(x.aoMap.value=_.aoMap,x.aoMapIntensity.value=_.aoMapIntensity,t(_.aoMap,x.aoMapTransform))}function a(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,_.map&&(x.map.value=_.map,t(_.map,x.mapTransform))}function c(x,_){x.dashSize.value=_.dashSize,x.totalSize.value=_.dashSize+_.gapSize,x.scale.value=_.scale}function u(x,_,w,E){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.size.value=_.size*w,x.scale.value=E*.5,_.map&&(x.map.value=_.map,t(_.map,x.uvTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,t(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function d(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.rotation.value=_.rotation,_.map&&(x.map.value=_.map,t(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,t(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function f(x,_){x.specular.value.copy(_.specular),x.shininess.value=Math.max(_.shininess,1e-4)}function m(x,_){_.gradientMap&&(x.gradientMap.value=_.gradientMap)}function v(x,_){x.metalness.value=_.metalness,_.metalnessMap&&(x.metalnessMap.value=_.metalnessMap,t(_.metalnessMap,x.metalnessMapTransform)),x.roughness.value=_.roughness,_.roughnessMap&&(x.roughnessMap.value=_.roughnessMap,t(_.roughnessMap,x.roughnessMapTransform)),_.envMap&&(x.envMapIntensity.value=_.envMapIntensity)}function g(x,_,w){x.ior.value=_.ior,_.sheen>0&&(x.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),x.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(x.sheenColorMap.value=_.sheenColorMap,t(_.sheenColorMap,x.sheenColorMapTransform)),_.sheenRoughnessMap&&(x.sheenRoughnessMap.value=_.sheenRoughnessMap,t(_.sheenRoughnessMap,x.sheenRoughnessMapTransform))),_.clearcoat>0&&(x.clearcoat.value=_.clearcoat,x.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(x.clearcoatMap.value=_.clearcoatMap,t(_.clearcoatMap,x.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,t(_.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(x.clearcoatNormalMap.value=_.clearcoatNormalMap,t(_.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===pn&&x.clearcoatNormalScale.value.negate())),_.dispersion>0&&(x.dispersion.value=_.dispersion),_.iridescence>0&&(x.iridescence.value=_.iridescence,x.iridescenceIOR.value=_.iridescenceIOR,x.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(x.iridescenceMap.value=_.iridescenceMap,t(_.iridescenceMap,x.iridescenceMapTransform)),_.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=_.iridescenceThicknessMap,t(_.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),_.transmission>0&&(x.transmission.value=_.transmission,x.transmissionSamplerMap.value=w.texture,x.transmissionSamplerSize.value.set(w.width,w.height),_.transmissionMap&&(x.transmissionMap.value=_.transmissionMap,t(_.transmissionMap,x.transmissionMapTransform)),x.thickness.value=_.thickness,_.thicknessMap&&(x.thicknessMap.value=_.thicknessMap,t(_.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=_.attenuationDistance,x.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(x.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(x.anisotropyMap.value=_.anisotropyMap,t(_.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=_.specularIntensity,x.specularColor.value.copy(_.specularColor),_.specularColorMap&&(x.specularColorMap.value=_.specularColorMap,t(_.specularColorMap,x.specularColorMapTransform)),_.specularIntensityMap&&(x.specularIntensityMap.value=_.specularIntensityMap,t(_.specularIntensityMap,x.specularIntensityMapTransform))}function b(x,_){_.matcap&&(x.matcap.value=_.matcap)}function y(x,_){const w=e.get(_).light;x.referencePosition.value.setFromMatrixPosition(w.matrixWorld),x.nearDistance.value=w.shadow.camera.near,x.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Uy(i,e,t,n){let s={},r={},a=[];const c=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function u(w,E){const M=E.program;n.uniformBlockBinding(w,M)}function d(w,E){let M=s[w.id];M===void 0&&(b(w),M=f(w),s[w.id]=M,w.addEventListener("dispose",x));const P=E.program;n.updateUBOMapping(w,P);const D=e.render.frame;r[w.id]!==D&&(v(w),r[w.id]=D)}function f(w){const E=m();w.__bindingPointIndex=E;const M=i.createBuffer(),P=w.__size,D=w.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,P,D),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,M),M}function m(){for(let w=0;w<c;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function v(w){const E=s[w.id],M=w.uniforms,P=w.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let D=0,O=M.length;D<O;D++){const U=Array.isArray(M[D])?M[D]:[M[D]];for(let L=0,A=U.length;L<A;L++){const F=U[L];if(g(F,D,L,P)===!0){const q=F.__offset,X=Array.isArray(F.value)?F.value:[F.value];let J=0;for(let Q=0;Q<X.length;Q++){const te=X[Q],ee=y(te);typeof te=="number"||typeof te=="boolean"?(F.__data[0]=te,i.bufferSubData(i.UNIFORM_BUFFER,q+J,F.__data)):te.isMatrix3?(F.__data[0]=te.elements[0],F.__data[1]=te.elements[1],F.__data[2]=te.elements[2],F.__data[3]=0,F.__data[4]=te.elements[3],F.__data[5]=te.elements[4],F.__data[6]=te.elements[5],F.__data[7]=0,F.__data[8]=te.elements[6],F.__data[9]=te.elements[7],F.__data[10]=te.elements[8],F.__data[11]=0):(te.toArray(F.__data,J),J+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,q,F.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function g(w,E,M,P){const D=w.value,O=E+"_"+M;if(P[O]===void 0)return typeof D=="number"||typeof D=="boolean"?P[O]=D:P[O]=D.clone(),!0;{const U=P[O];if(typeof D=="number"||typeof D=="boolean"){if(U!==D)return P[O]=D,!0}else if(U.equals(D)===!1)return U.copy(D),!0}return!1}function b(w){const E=w.uniforms;let M=0;const P=16;for(let O=0,U=E.length;O<U;O++){const L=Array.isArray(E[O])?E[O]:[E[O]];for(let A=0,F=L.length;A<F;A++){const q=L[A],X=Array.isArray(q.value)?q.value:[q.value];for(let J=0,Q=X.length;J<Q;J++){const te=X[J],ee=y(te),z=M%P,le=z%ee.boundary,ce=z+le;M+=le,ce!==0&&P-ce<ee.storage&&(M+=P-ce),q.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),q.__offset=M,M+=ee.storage}}}const D=M%P;return D>0&&(M+=P-D),w.__size=M,w.__cache={},this}function y(w){const E={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(E.boundary=4,E.storage=4):w.isVector2?(E.boundary=8,E.storage=8):w.isVector3||w.isColor?(E.boundary=16,E.storage=12):w.isVector4?(E.boundary=16,E.storage=16):w.isMatrix3?(E.boundary=48,E.storage=48):w.isMatrix4?(E.boundary=64,E.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),E}function x(w){const E=w.target;E.removeEventListener("dispose",x);const M=a.indexOf(E.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function _(){for(const w in s)i.deleteBuffer(s[w]);a=[],s={},r={}}return{bind:u,update:d,dispose:_}}class bd{constructor(e={}){const{canvas:t=c0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:c=!1,premultipliedAlpha:u=!0,preserveDrawingBuffer:d=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:m=!1,reverseDepthBuffer:v=!1}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const b=new Uint32Array(4),y=new Int32Array(4);let x=null,_=null;const w=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=bn,this.toneMapping=Pi,this.toneMappingExposure=1;const M=this;let P=!1,D=0,O=0,U=null,L=-1,A=null;const F=new Mt,q=new Mt;let X=null;const J=new Ke(0);let Q=0,te=t.width,ee=t.height,z=1,le=null,ce=null;const re=new Mt(0,0,te,ee),Re=new Mt(0,0,te,ee);let st=!1;const Y=new Yc;let ae=!1,ye=!1;const me=new _t,Le=new _t,Fe=new I,Ve=new Mt,j={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ge=!1;function Xe(){return U===null?z:1}let k=n;function ut(R,G){return t.getContext(R,G)}try{const R={alpha:!0,depth:s,stencil:r,antialias:c,premultipliedAlpha:u,preserveDrawingBuffer:d,powerPreference:f,failIfMajorPerformanceCaveat:m};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ra}`),t.addEventListener("webglcontextlost",oe,!1),t.addEventListener("webglcontextrestored",Se,!1),t.addEventListener("webglcontextcreationerror",we,!1),k===null){const G="webgl2";if(k=ut(G,R),k===null)throw ut(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let Ne,He,Ie,dt,Oe,N,C,$,se,he,ie,De,be,Ee,rt,fe,Te,ke,Ye,Me,tt,je,bt,V;function ve(){Ne=new W1(k),Ne.init(),je=new Ay(k,Ne),He=new B1(k,Ne,e,je),Ie=new My(k,Ne),He.reverseDepthBuffer&&v&&Ie.buffers.depth.setReversed(!0),dt=new q1(k),Oe=new uy,N=new Ey(k,Ne,Ie,Oe,He,je,dt),C=new z1(M),$=new H1(M),se=new e_(k),bt=new O1(k,se),he=new X1(k,se,dt,bt),ie=new $1(k,he,se,dt),Ye=new j1(k,He,N),fe=new k1(Oe),De=new hy(M,C,$,Ne,He,bt,fe),be=new Dy(M,Oe),Ee=new py,rt=new xy(Ne),ke=new N1(M,C,$,Ie,ie,g,u),Te=new wy(M,ie,He),V=new Uy(k,dt,He,Ie),Me=new F1(k,Ne,dt),tt=new Y1(k,Ne,dt),dt.programs=De.programs,M.capabilities=He,M.extensions=Ne,M.properties=Oe,M.renderLists=Ee,M.shadowMap=Te,M.state=Ie,M.info=dt}ve();const ne=new Ly(M,k);this.xr=ne,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const R=Ne.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Ne.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(R){R!==void 0&&(z=R,this.setSize(te,ee,!1))},this.getSize=function(R){return R.set(te,ee)},this.setSize=function(R,G,K=!0){if(ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}te=R,ee=G,t.width=Math.floor(R*z),t.height=Math.floor(G*z),K===!0&&(t.style.width=R+"px",t.style.height=G+"px"),this.setViewport(0,0,R,G)},this.getDrawingBufferSize=function(R){return R.set(te*z,ee*z).floor()},this.setDrawingBufferSize=function(R,G,K){te=R,ee=G,z=K,t.width=Math.floor(R*K),t.height=Math.floor(G*K),this.setViewport(0,0,R,G)},this.getCurrentViewport=function(R){return R.copy(F)},this.getViewport=function(R){return R.copy(re)},this.setViewport=function(R,G,K,Z){R.isVector4?re.set(R.x,R.y,R.z,R.w):re.set(R,G,K,Z),Ie.viewport(F.copy(re).multiplyScalar(z).round())},this.getScissor=function(R){return R.copy(Re)},this.setScissor=function(R,G,K,Z){R.isVector4?Re.set(R.x,R.y,R.z,R.w):Re.set(R,G,K,Z),Ie.scissor(q.copy(Re).multiplyScalar(z).round())},this.getScissorTest=function(){return st},this.setScissorTest=function(R){Ie.setScissorTest(st=R)},this.setOpaqueSort=function(R){le=R},this.setTransparentSort=function(R){ce=R},this.getClearColor=function(R){return R.copy(ke.getClearColor())},this.setClearColor=function(){ke.setClearColor.apply(ke,arguments)},this.getClearAlpha=function(){return ke.getClearAlpha()},this.setClearAlpha=function(){ke.setClearAlpha.apply(ke,arguments)},this.clear=function(R=!0,G=!0,K=!0){let Z=0;if(R){let H=!1;if(U!==null){const pe=U.texture.format;H=pe===Gc||pe===Vc||pe===ii}if(H){const pe=U.texture.type,_e=pe===Qt||pe===Di||pe===js||pe===$s||pe===Bc||pe===kc,Ae=ke.getClearColor(),Ce=ke.getClearAlpha(),qe=Ae.r,$e=Ae.g,Be=Ae.b;_e?(b[0]=qe,b[1]=$e,b[2]=Be,b[3]=Ce,k.clearBufferuiv(k.COLOR,0,b)):(y[0]=qe,y[1]=$e,y[2]=Be,y[3]=Ce,k.clearBufferiv(k.COLOR,0,y))}else Z|=k.COLOR_BUFFER_BIT}G&&(Z|=k.DEPTH_BUFFER_BIT),K&&(Z|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",oe,!1),t.removeEventListener("webglcontextrestored",Se,!1),t.removeEventListener("webglcontextcreationerror",we,!1),ke.dispose(),Ee.dispose(),rt.dispose(),Oe.dispose(),C.dispose(),$.dispose(),ie.dispose(),bt.dispose(),V.dispose(),De.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",Vr),ne.removeEventListener("sessionend",ci),Bn.stop()};function oe(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function Se(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const R=dt.autoReset,G=Te.enabled,K=Te.autoUpdate,Z=Te.needsUpdate,H=Te.type;ve(),dt.autoReset=R,Te.enabled=G,Te.autoUpdate=K,Te.needsUpdate=Z,Te.type=H}function we(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Je(R){const G=R.target;G.removeEventListener("dispose",Je),St(G)}function St(R){Nt(R),Oe.remove(R)}function Nt(R){const G=Oe.get(R).programs;G!==void 0&&(G.forEach(function(K){De.releaseProgram(K)}),R.isShaderMaterial&&De.releaseShaderCache(R))}this.renderBufferDirect=function(R,G,K,Z,H,pe){G===null&&(G=j);const _e=H.isMesh&&H.matrixWorld.determinant()<0,Ae=ba(R,G,K,Z,H);Ie.setMaterial(Z,_e);let Ce=K.index,qe=1;if(Z.wireframe===!0){if(Ce=he.getWireframeAttribute(K),Ce===void 0)return;qe=2}const $e=K.drawRange,Be=K.attributes.position;let ct=$e.start*qe,pt=($e.start+$e.count)*qe;pe!==null&&(ct=Math.max(ct,pe.start*qe),pt=Math.min(pt,(pe.start+pe.count)*qe)),Ce!==null?(ct=Math.max(ct,0),pt=Math.min(pt,Ce.count)):Be!=null&&(ct=Math.max(ct,0),pt=Math.min(pt,Be.count));const Rt=pt-ct;if(Rt<0||Rt===1/0)return;bt.setup(H,Z,Ae,K,Ce);let At,ot=Me;if(Ce!==null&&(At=se.get(Ce),ot=tt,ot.setIndex(At)),H.isMesh)Z.wireframe===!0?(Ie.setLineWidth(Z.wireframeLinewidth*Xe()),ot.setMode(k.LINES)):ot.setMode(k.TRIANGLES);else if(H.isLine){let ze=Z.linewidth;ze===void 0&&(ze=1),Ie.setLineWidth(ze*Xe()),H.isLineSegments?ot.setMode(k.LINES):H.isLineLoop?ot.setMode(k.LINE_LOOP):ot.setMode(k.LINE_STRIP)}else H.isPoints?ot.setMode(k.POINTS):H.isSprite&&ot.setMode(k.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)ot.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Ne.get("WEBGL_multi_draw"))ot.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const ze=H._multiDrawStarts,Ot=H._multiDrawCounts,ft=H._multiDrawCount,gn=Ce?se.get(Ce).bytesPerElement:1,ui=Oe.get(Z).currentProgram.getUniforms();for(let nn=0;nn<ft;nn++)ui.setValue(k,"_gl_DrawID",nn),ot.render(ze[nn]/gn,Ot[nn])}else if(H.isInstancedMesh)ot.renderInstances(ct,Rt,H.count);else if(K.isInstancedBufferGeometry){const ze=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Ot=Math.min(K.instanceCount,ze);ot.renderInstances(ct,Rt,Ot)}else ot.render(ct,Rt)};function nt(R,G,K){R.transparent===!0&&R.side===Un&&R.forceSinglePass===!1?(R.side=pn,R.needsUpdate=!0,hs(R,G,K),R.side=Ii,R.needsUpdate=!0,hs(R,G,K),R.side=Un):hs(R,G,K)}this.compile=function(R,G,K=null){K===null&&(K=R),_=rt.get(K),_.init(G),E.push(_),K.traverseVisible(function(H){H.isLight&&H.layers.test(G.layers)&&(_.pushLight(H),H.castShadow&&_.pushShadow(H))}),R!==K&&R.traverseVisible(function(H){H.isLight&&H.layers.test(G.layers)&&(_.pushLight(H),H.castShadow&&_.pushShadow(H))}),_.setupLights();const Z=new Set;return R.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const pe=H.material;if(pe)if(Array.isArray(pe))for(let _e=0;_e<pe.length;_e++){const Ae=pe[_e];nt(Ae,K,H),Z.add(Ae)}else nt(pe,K,H),Z.add(pe)}),E.pop(),_=null,Z},this.compileAsync=function(R,G,K=null){const Z=this.compile(R,G,K);return new Promise(H=>{function pe(){if(Z.forEach(function(_e){Oe.get(_e).currentProgram.isReady()&&Z.delete(_e)}),Z.size===0){H(R);return}setTimeout(pe,10)}Ne.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let tn=null;function Ht(R){tn&&tn(R)}function Vr(){Bn.stop()}function ci(){Bn.start()}const Bn=new Up;Bn.setAnimationLoop(Ht),typeof self<"u"&&Bn.setContext(self),this.setAnimationLoop=function(R){tn=R,ne.setAnimationLoop(R),R===null?Bn.stop():Bn.start()},ne.addEventListener("sessionstart",Vr),ne.addEventListener("sessionend",ci),this.render=function(R,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(G),G=ne.getCamera()),R.isScene===!0&&R.onBeforeRender(M,R,G,U),_=rt.get(R,E.length),_.init(G),E.push(_),Le.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),Y.setFromProjectionMatrix(Le),ye=this.localClippingEnabled,ae=fe.init(this.clippingPlanes,ye),x=Ee.get(R,w.length),x.init(),w.push(x),ne.enabled===!0&&ne.isPresenting===!0){const pe=M.xr.getDepthSensingMesh();pe!==null&&hi(pe,G,-1/0,M.sortObjects)}hi(R,G,0,M.sortObjects),x.finish(),M.sortObjects===!0&&x.sort(le,ce),ge=ne.enabled===!1||ne.isPresenting===!1||ne.hasDepthSensing()===!1,ge&&ke.addToRenderList(x,R),this.info.render.frame++,ae===!0&&fe.beginShadows();const K=_.state.shadowsArray;Te.render(K,R,G),ae===!0&&fe.endShadows(),this.info.autoReset===!0&&this.info.reset();const Z=x.opaque,H=x.transmissive;if(_.setupLights(),G.isArrayCamera){const pe=G.cameras;if(H.length>0)for(let _e=0,Ae=pe.length;_e<Ae;_e++){const Ce=pe[_e];ls(Z,H,R,Ce)}ge&&ke.render(R);for(let _e=0,Ae=pe.length;_e<Ae;_e++){const Ce=pe[_e];as(x,R,Ce,Ce.viewport)}}else H.length>0&&ls(Z,H,R,G),ge&&ke.render(R),as(x,R,G);U!==null&&(N.updateMultisampleRenderTarget(U),N.updateRenderTargetMipmap(U)),R.isScene===!0&&R.onAfterRender(M,R,G),bt.resetDefaultState(),L=-1,A=null,E.pop(),E.length>0?(_=E[E.length-1],ae===!0&&fe.setGlobalState(M.clippingPlanes,_.state.camera)):_=null,w.pop(),w.length>0?x=w[w.length-1]:x=null};function hi(R,G,K,Z){if(R.visible===!1)return;if(R.layers.test(G.layers)){if(R.isGroup)K=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(G);else if(R.isLight)_.pushLight(R),R.castShadow&&_.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Y.intersectsSprite(R)){Z&&Ve.setFromMatrixPosition(R.matrixWorld).applyMatrix4(Le);const _e=ie.update(R),Ae=R.material;Ae.visible&&x.push(R,_e,Ae,K,Ve.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Y.intersectsObject(R))){const _e=ie.update(R),Ae=R.material;if(Z&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Ve.copy(R.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),Ve.copy(_e.boundingSphere.center)),Ve.applyMatrix4(R.matrixWorld).applyMatrix4(Le)),Array.isArray(Ae)){const Ce=_e.groups;for(let qe=0,$e=Ce.length;qe<$e;qe++){const Be=Ce[qe],ct=Ae[Be.materialIndex];ct&&ct.visible&&x.push(R,_e,ct,K,Ve.z,Be)}}else Ae.visible&&x.push(R,_e,Ae,K,Ve.z,null)}}const pe=R.children;for(let _e=0,Ae=pe.length;_e<Ae;_e++)hi(pe[_e],G,K,Z)}function as(R,G,K,Z){const H=R.opaque,pe=R.transmissive,_e=R.transparent;_.setupLightsView(K),ae===!0&&fe.setGlobalState(M.clippingPlanes,K),Z&&Ie.viewport(F.copy(Z)),H.length>0&&cs(H,G,K),pe.length>0&&cs(pe,G,K),_e.length>0&&cs(_e,G,K),Ie.buffers.depth.setTest(!0),Ie.buffers.depth.setMask(!0),Ie.buffers.color.setMask(!0),Ie.setPolygonOffset(!1)}function ls(R,G,K,Z){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;_.state.transmissionRenderTarget[Z.id]===void 0&&(_.state.transmissionRenderTarget[Z.id]=new Fn(1,1,{generateMipmaps:!0,type:Ne.has("EXT_color_buffer_half_float")||Ne.has("EXT_color_buffer_float")?Br:Qt,minFilter:Ei,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:vt.workingColorSpace}));const pe=_.state.transmissionRenderTarget[Z.id],_e=Z.viewport||F;pe.setSize(_e.z,_e.w);const Ae=M.getRenderTarget();M.setRenderTarget(pe),M.getClearColor(J),Q=M.getClearAlpha(),Q<1&&M.setClearColor(16777215,.5),M.clear(),ge&&ke.render(K);const Ce=M.toneMapping;M.toneMapping=Pi;const qe=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),_.setupLightsView(Z),ae===!0&&fe.setGlobalState(M.clippingPlanes,Z),cs(R,K,Z),N.updateMultisampleRenderTarget(pe),N.updateRenderTargetMipmap(pe),Ne.has("WEBGL_multisampled_render_to_texture")===!1){let $e=!1;for(let Be=0,ct=G.length;Be<ct;Be++){const pt=G[Be],Rt=pt.object,At=pt.geometry,ot=pt.material,ze=pt.group;if(ot.side===Un&&Rt.layers.test(Z.layers)){const Ot=ot.side;ot.side=pn,ot.needsUpdate=!0,Gr(Rt,K,Z,At,ot,ze),ot.side=Ot,ot.needsUpdate=!0,$e=!0}}$e===!0&&(N.updateMultisampleRenderTarget(pe),N.updateRenderTargetMipmap(pe))}M.setRenderTarget(Ae),M.setClearColor(J,Q),qe!==void 0&&(Z.viewport=qe),M.toneMapping=Ce}function cs(R,G,K){const Z=G.isScene===!0?G.overrideMaterial:null;for(let H=0,pe=R.length;H<pe;H++){const _e=R[H],Ae=_e.object,Ce=_e.geometry,qe=Z===null?_e.material:Z,$e=_e.group;Ae.layers.test(K.layers)&&Gr(Ae,G,K,Ce,qe,$e)}}function Gr(R,G,K,Z,H,pe){R.onBeforeRender(M,G,K,Z,H,pe),R.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),H.onBeforeRender(M,G,K,Z,R,pe),H.transparent===!0&&H.side===Un&&H.forceSinglePass===!1?(H.side=pn,H.needsUpdate=!0,M.renderBufferDirect(K,G,Z,H,R,pe),H.side=Ii,H.needsUpdate=!0,M.renderBufferDirect(K,G,Z,H,R,pe),H.side=Un):M.renderBufferDirect(K,G,Z,H,R,pe),R.onAfterRender(M,G,K,Z,H,pe)}function hs(R,G,K){G.isScene!==!0&&(G=j);const Z=Oe.get(R),H=_.state.lights,pe=_.state.shadowsArray,_e=H.state.version,Ae=De.getParameters(R,H.state,pe,G,K),Ce=De.getProgramCacheKey(Ae);let qe=Z.programs;Z.environment=R.isMeshStandardMaterial?G.environment:null,Z.fog=G.fog,Z.envMap=(R.isMeshStandardMaterial?$:C).get(R.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&R.envMap===null?G.environmentRotation:R.envMapRotation,qe===void 0&&(R.addEventListener("dispose",Je),qe=new Map,Z.programs=qe);let $e=qe.get(Ce);if($e!==void 0){if(Z.currentProgram===$e&&Z.lightsStateVersion===_e)return us(R,Ae),$e}else Ae.uniforms=De.getUniforms(R),R.onBeforeCompile(Ae,M),$e=De.acquireProgram(Ae,Ce),qe.set(Ce,$e),Z.uniforms=Ae.uniforms;const Be=Z.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Be.clippingPlanes=fe.uniform),us(R,Ae),Z.needsLights=Fi(R),Z.lightsStateVersion=_e,Z.needsLights&&(Be.ambientLightColor.value=H.state.ambient,Be.lightProbe.value=H.state.probe,Be.directionalLights.value=H.state.directional,Be.directionalLightShadows.value=H.state.directionalShadow,Be.spotLights.value=H.state.spot,Be.spotLightShadows.value=H.state.spotShadow,Be.rectAreaLights.value=H.state.rectArea,Be.ltc_1.value=H.state.rectAreaLTC1,Be.ltc_2.value=H.state.rectAreaLTC2,Be.pointLights.value=H.state.point,Be.pointLightShadows.value=H.state.pointShadow,Be.hemisphereLights.value=H.state.hemi,Be.directionalShadowMap.value=H.state.directionalShadowMap,Be.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Be.spotShadowMap.value=H.state.spotShadowMap,Be.spotLightMatrix.value=H.state.spotLightMatrix,Be.spotLightMap.value=H.state.spotLightMap,Be.pointShadowMap.value=H.state.pointShadowMap,Be.pointShadowMatrix.value=H.state.pointShadowMatrix),Z.currentProgram=$e,Z.uniformsList=null,$e}function Hr(R){if(R.uniformsList===null){const G=R.currentProgram.getUniforms();R.uniformsList=Ho.seqWithValue(G.seq,R.uniforms)}return R.uniformsList}function us(R,G){const K=Oe.get(R);K.outputColorSpace=G.outputColorSpace,K.batching=G.batching,K.batchingColor=G.batchingColor,K.instancing=G.instancing,K.instancingColor=G.instancingColor,K.instancingMorph=G.instancingMorph,K.skinning=G.skinning,K.morphTargets=G.morphTargets,K.morphNormals=G.morphNormals,K.morphColors=G.morphColors,K.morphTargetsCount=G.morphTargetsCount,K.numClippingPlanes=G.numClippingPlanes,K.numIntersection=G.numClipIntersection,K.vertexAlphas=G.vertexAlphas,K.vertexTangents=G.vertexTangents,K.toneMapping=G.toneMapping}function ba(R,G,K,Z,H){G.isScene!==!0&&(G=j),N.resetTextureUnits();const pe=G.fog,_e=Z.isMeshStandardMaterial?G.environment:null,Ae=U===null?M.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:Zs,Ce=(Z.isMeshStandardMaterial?$:C).get(Z.envMap||_e),qe=Z.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,$e=!!K.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Be=!!K.morphAttributes.position,ct=!!K.morphAttributes.normal,pt=!!K.morphAttributes.color;let Rt=Pi;Z.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(Rt=M.toneMapping);const At=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,ot=At!==void 0?At.length:0,ze=Oe.get(Z),Ot=_.state.lights;if(ae===!0&&(ye===!0||R!==A)){const Yt=R===A&&Z.id===L;fe.setState(Z,R,Yt)}let ft=!1;Z.version===ze.__version?(ze.needsLights&&ze.lightsStateVersion!==Ot.state.version||ze.outputColorSpace!==Ae||H.isBatchedMesh&&ze.batching===!1||!H.isBatchedMesh&&ze.batching===!0||H.isBatchedMesh&&ze.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&ze.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&ze.instancing===!1||!H.isInstancedMesh&&ze.instancing===!0||H.isSkinnedMesh&&ze.skinning===!1||!H.isSkinnedMesh&&ze.skinning===!0||H.isInstancedMesh&&ze.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&ze.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&ze.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&ze.instancingMorph===!1&&H.morphTexture!==null||ze.envMap!==Ce||Z.fog===!0&&ze.fog!==pe||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==fe.numPlanes||ze.numIntersection!==fe.numIntersection)||ze.vertexAlphas!==qe||ze.vertexTangents!==$e||ze.morphTargets!==Be||ze.morphNormals!==ct||ze.morphColors!==pt||ze.toneMapping!==Rt||ze.morphTargetsCount!==ot)&&(ft=!0):(ft=!0,ze.__version=Z.version);let gn=ze.currentProgram;ft===!0&&(gn=hs(Z,G,H));let ui=!1,nn=!1,Bi=!1;const wt=gn.getUniforms(),ln=ze.uniforms;if(Ie.useProgram(gn.program)&&(ui=!0,nn=!0,Bi=!0),Z.id!==L&&(L=Z.id,nn=!0),ui||A!==R){Ie.buffers.depth.getReversed()?(me.copy(R.projectionMatrix),u0(me),d0(me),wt.setValue(k,"projectionMatrix",me)):wt.setValue(k,"projectionMatrix",R.projectionMatrix),wt.setValue(k,"viewMatrix",R.matrixWorldInverse);const Kt=wt.map.cameraPosition;Kt!==void 0&&Kt.setValue(k,Fe.setFromMatrixPosition(R.matrixWorld)),He.logarithmicDepthBuffer&&wt.setValue(k,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&wt.setValue(k,"isOrthographic",R.isOrthographicCamera===!0),A!==R&&(A=R,nn=!0,Bi=!0)}if(H.isSkinnedMesh){wt.setOptional(k,H,"bindMatrix"),wt.setOptional(k,H,"bindMatrixInverse");const Yt=H.skeleton;Yt&&(Yt.boneTexture===null&&Yt.computeBoneTexture(),wt.setValue(k,"boneTexture",Yt.boneTexture,N))}H.isBatchedMesh&&(wt.setOptional(k,H,"batchingTexture"),wt.setValue(k,"batchingTexture",H._matricesTexture,N),wt.setOptional(k,H,"batchingIdTexture"),wt.setValue(k,"batchingIdTexture",H._indirectTexture,N),wt.setOptional(k,H,"batchingColorTexture"),H._colorsTexture!==null&&wt.setValue(k,"batchingColorTexture",H._colorsTexture,N));const cn=K.morphAttributes;if((cn.position!==void 0||cn.normal!==void 0||cn.color!==void 0)&&Ye.update(H,K,gn),(nn||ze.receiveShadow!==H.receiveShadow)&&(ze.receiveShadow=H.receiveShadow,wt.setValue(k,"receiveShadow",H.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(ln.envMap.value=Ce,ln.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),Z.isMeshStandardMaterial&&Z.envMap===null&&G.environment!==null&&(ln.envMapIntensity.value=G.environmentIntensity),nn&&(wt.setValue(k,"toneMappingExposure",M.toneMappingExposure),ze.needsLights&&ya(ln,Bi),pe&&Z.fog===!0&&be.refreshFogUniforms(ln,pe),be.refreshMaterialUniforms(ln,Z,z,ee,_.state.transmissionRenderTarget[R.id]),Ho.upload(k,Hr(ze),ln,N)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(Ho.upload(k,Hr(ze),ln,N),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&wt.setValue(k,"center",H.center),wt.setValue(k,"modelViewMatrix",H.modelViewMatrix),wt.setValue(k,"normalMatrix",H.normalMatrix),wt.setValue(k,"modelMatrix",H.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){const Yt=Z.uniformsGroups;for(let Kt=0,Yn=Yt.length;Kt<Yn;Kt++){const qt=Yt[Kt];V.update(qt,gn),V.bind(qt,gn)}}return gn}function ya(R,G){R.ambientLightColor.needsUpdate=G,R.lightProbe.needsUpdate=G,R.directionalLights.needsUpdate=G,R.directionalLightShadows.needsUpdate=G,R.pointLights.needsUpdate=G,R.pointLightShadows.needsUpdate=G,R.spotLights.needsUpdate=G,R.spotLightShadows.needsUpdate=G,R.rectAreaLights.needsUpdate=G,R.hemisphereLights.needsUpdate=G}function Fi(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(R,G,K){Oe.get(R.texture).__webglTexture=G,Oe.get(R.depthTexture).__webglTexture=K;const Z=Oe.get(R);Z.__hasExternalTextures=!0,Z.__autoAllocateDepthBuffer=K===void 0,Z.__autoAllocateDepthBuffer||Ne.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Z.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,G){const K=Oe.get(R);K.__webglFramebuffer=G,K.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(R,G=0,K=0){U=R,D=G,O=K;let Z=!0,H=null,pe=!1,_e=!1;if(R){const Ce=Oe.get(R);if(Ce.__useDefaultFramebuffer!==void 0)Ie.bindFramebuffer(k.FRAMEBUFFER,null),Z=!1;else if(Ce.__webglFramebuffer===void 0)N.setupRenderTarget(R);else if(Ce.__hasExternalTextures)N.rebindTextures(R,Oe.get(R.texture).__webglTexture,Oe.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Be=R.depthTexture;if(Ce.__boundDepthTexture!==Be){if(Be!==null&&Oe.has(Be)&&(R.width!==Be.image.width||R.height!==Be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");N.setupDepthRenderbuffer(R)}}const qe=R.texture;(qe.isData3DTexture||qe.isDataArrayTexture||qe.isCompressedArrayTexture)&&(_e=!0);const $e=Oe.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray($e[G])?H=$e[G][K]:H=$e[G],pe=!0):R.samples>0&&N.useMultisampledRTT(R)===!1?H=Oe.get(R).__webglMultisampledFramebuffer:Array.isArray($e)?H=$e[K]:H=$e,F.copy(R.viewport),q.copy(R.scissor),X=R.scissorTest}else F.copy(re).multiplyScalar(z).floor(),q.copy(Re).multiplyScalar(z).floor(),X=st;if(Ie.bindFramebuffer(k.FRAMEBUFFER,H)&&Z&&Ie.drawBuffers(R,H),Ie.viewport(F),Ie.scissor(q),Ie.setScissorTest(X),pe){const Ce=Oe.get(R.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+G,Ce.__webglTexture,K)}else if(_e){const Ce=Oe.get(R.texture),qe=G||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ce.__webglTexture,K||0,qe)}L=-1},this.readRenderTargetPixels=function(R,G,K,Z,H,pe,_e){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=Oe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&_e!==void 0&&(Ae=Ae[_e]),Ae){Ie.bindFramebuffer(k.FRAMEBUFFER,Ae);try{const Ce=R.texture,qe=Ce.format,$e=Ce.type;if(!He.textureFormatReadable(qe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!He.textureTypeReadable($e)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=R.width-Z&&K>=0&&K<=R.height-H&&k.readPixels(G,K,Z,H,je.convert(qe),je.convert($e),pe)}finally{const Ce=U!==null?Oe.get(U).__webglFramebuffer:null;Ie.bindFramebuffer(k.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(R,G,K,Z,H,pe,_e){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=Oe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&_e!==void 0&&(Ae=Ae[_e]),Ae){const Ce=R.texture,qe=Ce.format,$e=Ce.type;if(!He.textureFormatReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!He.textureTypeReadable($e))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(G>=0&&G<=R.width-Z&&K>=0&&K<=R.height-H){Ie.bindFramebuffer(k.FRAMEBUFFER,Ae);const Be=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,Be),k.bufferData(k.PIXEL_PACK_BUFFER,pe.byteLength,k.STREAM_READ),k.readPixels(G,K,Z,H,je.convert(qe),je.convert($e),0);const ct=U!==null?Oe.get(U).__webglFramebuffer:null;Ie.bindFramebuffer(k.FRAMEBUFFER,ct);const pt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await h0(k,pt,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,Be),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,pe),k.deleteBuffer(Be),k.deleteSync(pt),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(R,G=null,K=0){R.isTexture!==!0&&(Os("WebGLRenderer: copyFramebufferToTexture function signature has changed."),G=arguments[0]||null,R=arguments[1]);const Z=Math.pow(2,-K),H=Math.floor(R.image.width*Z),pe=Math.floor(R.image.height*Z),_e=G!==null?G.x:0,Ae=G!==null?G.y:0;N.setTexture2D(R,0),k.copyTexSubImage2D(k.TEXTURE_2D,K,0,0,_e,Ae,H,pe),Ie.unbindTexture()};const Wr=k.createFramebuffer(),wa=k.createFramebuffer();this.copyTextureToTexture=function(R,G,K=null,Z=null,H=0,pe=null){R.isTexture!==!0&&(Os("WebGLRenderer: copyTextureToTexture function signature has changed."),Z=arguments[0]||null,R=arguments[1],G=arguments[2],pe=arguments[3]||0,K=null),pe===null&&(H!==0?(Os("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),pe=H,H=0):pe=0);let _e,Ae,Ce,qe,$e,Be,ct,pt,Rt;const At=R.isCompressedTexture?R.mipmaps[pe]:R.image;if(K!==null)_e=K.max.x-K.min.x,Ae=K.max.y-K.min.y,Ce=K.isBox3?K.max.z-K.min.z:1,qe=K.min.x,$e=K.min.y,Be=K.isBox3?K.min.z:0;else{const cn=Math.pow(2,-H);_e=Math.floor(At.width*cn),Ae=Math.floor(At.height*cn),R.isDataArrayTexture?Ce=At.depth:R.isData3DTexture?Ce=Math.floor(At.depth*cn):Ce=1,qe=0,$e=0,Be=0}Z!==null?(ct=Z.x,pt=Z.y,Rt=Z.z):(ct=0,pt=0,Rt=0);const ot=je.convert(G.format),ze=je.convert(G.type);let Ot;G.isData3DTexture?(N.setTexture3D(G,0),Ot=k.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(N.setTexture2DArray(G,0),Ot=k.TEXTURE_2D_ARRAY):(N.setTexture2D(G,0),Ot=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,G.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,G.unpackAlignment);const ft=k.getParameter(k.UNPACK_ROW_LENGTH),gn=k.getParameter(k.UNPACK_IMAGE_HEIGHT),ui=k.getParameter(k.UNPACK_SKIP_PIXELS),nn=k.getParameter(k.UNPACK_SKIP_ROWS),Bi=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,At.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,At.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,qe),k.pixelStorei(k.UNPACK_SKIP_ROWS,$e),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Be);const wt=R.isDataArrayTexture||R.isData3DTexture,ln=G.isDataArrayTexture||G.isData3DTexture;if(R.isDepthTexture){const cn=Oe.get(R),Yt=Oe.get(G),Kt=Oe.get(cn.__renderTarget),Yn=Oe.get(Yt.__renderTarget);Ie.bindFramebuffer(k.READ_FRAMEBUFFER,Kt.__webglFramebuffer),Ie.bindFramebuffer(k.DRAW_FRAMEBUFFER,Yn.__webglFramebuffer);for(let qt=0;qt<Ce;qt++)wt&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Oe.get(R).__webglTexture,H,Be+qt),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Oe.get(G).__webglTexture,pe,Rt+qt)),k.blitFramebuffer(qe,$e,_e,Ae,ct,pt,_e,Ae,k.DEPTH_BUFFER_BIT,k.NEAREST);Ie.bindFramebuffer(k.READ_FRAMEBUFFER,null),Ie.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(H!==0||R.isRenderTargetTexture||Oe.has(R)){const cn=Oe.get(R),Yt=Oe.get(G);Ie.bindFramebuffer(k.READ_FRAMEBUFFER,Wr),Ie.bindFramebuffer(k.DRAW_FRAMEBUFFER,wa);for(let Kt=0;Kt<Ce;Kt++)wt?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,cn.__webglTexture,H,Be+Kt):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,cn.__webglTexture,H),ln?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Yt.__webglTexture,pe,Rt+Kt):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Yt.__webglTexture,pe),H!==0?k.blitFramebuffer(qe,$e,_e,Ae,ct,pt,_e,Ae,k.COLOR_BUFFER_BIT,k.NEAREST):ln?k.copyTexSubImage3D(Ot,pe,ct,pt,Rt+Kt,qe,$e,_e,Ae):k.copyTexSubImage2D(Ot,pe,ct,pt,qe,$e,_e,Ae);Ie.bindFramebuffer(k.READ_FRAMEBUFFER,null),Ie.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ln?R.isDataTexture||R.isData3DTexture?k.texSubImage3D(Ot,pe,ct,pt,Rt,_e,Ae,Ce,ot,ze,At.data):G.isCompressedArrayTexture?k.compressedTexSubImage3D(Ot,pe,ct,pt,Rt,_e,Ae,Ce,ot,At.data):k.texSubImage3D(Ot,pe,ct,pt,Rt,_e,Ae,Ce,ot,ze,At):R.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,pe,ct,pt,_e,Ae,ot,ze,At.data):R.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,pe,ct,pt,At.width,At.height,ot,At.data):k.texSubImage2D(k.TEXTURE_2D,pe,ct,pt,_e,Ae,ot,ze,At);k.pixelStorei(k.UNPACK_ROW_LENGTH,ft),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,gn),k.pixelStorei(k.UNPACK_SKIP_PIXELS,ui),k.pixelStorei(k.UNPACK_SKIP_ROWS,nn),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Bi),pe===0&&G.generateMipmaps&&k.generateMipmap(Ot),Ie.unbindTexture()},this.copyTextureToTexture3D=function(R,G,K=null,Z=null,H=0){return R.isTexture!==!0&&(Os("WebGLRenderer: copyTextureToTexture3D function signature has changed."),K=arguments[0]||null,Z=arguments[1]||null,R=arguments[2],G=arguments[3],H=arguments[4]||0),Os('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(R,G,K,Z,H)},this.initRenderTarget=function(R){Oe.get(R).__webglFramebuffer===void 0&&N.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?N.setTextureCube(R,0):R.isData3DTexture?N.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?N.setTexture2DArray(R,0):N.setTexture2D(R,0),Ie.unbindTexture()},this.resetState=function(){D=0,O=0,U=null,Ie.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ai}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=vt._getDrawingBufferColorSpace(e),t.unpackColorSpace=vt._getUnpackColorSpace()}}/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class Xn{constructor(e,t,n,s,r="div"){this.parent=e,this.object=t,this.property=n,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(r),this.domElement.classList.add("controller"),this.domElement.classList.add(s),this.$name=document.createElement("div"),this.$name.classList.add("name"),Xn.nextNameID=Xn.nextNameID||0,this.$name.id=`lil-gui-name-${++Xn.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",a=>a.stopPropagation()),this.domElement.addEventListener("keyup",a=>a.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(n)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle("disabled",e),this.$disable.toggleAttribute("disabled",e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(e){const t=this.parent.add(this.object,this.property,e);return t.name(this._name),this.destroy(),t}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Ny extends Xn{constructor(e,t,n){super(e,t,n,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Mc(i){let e,t;return(e=i.match(/(#|0x)?([a-f0-9]{6})/i))?t=e[2]:(e=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?t=parseInt(e[1]).toString(16).padStart(2,0)+parseInt(e[2]).toString(16).padStart(2,0)+parseInt(e[3]).toString(16).padStart(2,0):(e=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(t=e[1]+e[1]+e[2]+e[2]+e[3]+e[3]),t?"#"+t:!1}const Oy={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:Mc,toHexString:Mc},Lr={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},Fy={isPrimitive:!1,match:i=>Array.isArray(i),fromHexString(i,e,t=1){const n=Lr.fromHexString(i);e[0]=(n>>16&255)/255*t,e[1]=(n>>8&255)/255*t,e[2]=(n&255)/255*t},toHexString([i,e,t],n=1){n=255/n;const s=i*n<<16^e*n<<8^t*n<<0;return Lr.toHexString(s)}},By={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,e,t=1){const n=Lr.fromHexString(i);e.r=(n>>16&255)/255*t,e.g=(n>>8&255)/255*t,e.b=(n&255)/255*t},toHexString({r:i,g:e,b:t},n=1){n=255/n;const s=i*n<<16^e*n<<8^t*n<<0;return Lr.toHexString(s)}},ky=[Oy,Lr,Fy,By];function zy(i){return ky.find(e=>e.match(i))}class Vy extends Xn{constructor(e,t,n,s){super(e,t,n,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=zy(this.initialValue),this._rgbScale=s,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const r=Mc(this.$text.value);r&&this._setValueFromHexString(r)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){const t=this._format.fromHexString(e);this.setValue(t)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class El extends Xn{constructor(e,t,n){super(e,t,n,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",s=>{s.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Gy extends Xn{constructor(e,t,n,s,r,a){super(e,t,n,"number"),this._initInput(),this.min(s),this.max(r);const c=a!==void 0;this.step(c?a:this._getImplicitStep(),c),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,t=!0){return this._step=e,this._stepExplicit=t,this}updateDisplay(){const e=this.getValue();if(this._hasSlider){let t=(e-this._min)/(this._max-this._min);t=Math.max(0,Math.min(t,1)),this.$fill.style.width=t*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const t=()=>{let w=parseFloat(this.$input.value);isNaN(w)||(this._stepExplicit&&(w=this._snap(w)),this.setValue(this._clamp(w)))},n=w=>{const E=parseFloat(this.$input.value);isNaN(E)||(this._snapClampSetValue(E+w),this.$input.value=this.getValue())},s=w=>{w.key==="Enter"&&this.$input.blur(),w.code==="ArrowUp"&&(w.preventDefault(),n(this._step*this._arrowKeyMultiplier(w))),w.code==="ArrowDown"&&(w.preventDefault(),n(this._step*this._arrowKeyMultiplier(w)*-1))},r=w=>{this._inputFocused&&(w.preventDefault(),n(this._step*this._normalizeMouseWheel(w)))};let a=!1,c,u,d,f,m;const v=5,g=w=>{c=w.clientX,u=d=w.clientY,a=!0,f=this.getValue(),m=0,window.addEventListener("mousemove",b),window.addEventListener("mouseup",y)},b=w=>{if(a){const E=w.clientX-c,M=w.clientY-u;Math.abs(M)>v?(w.preventDefault(),this.$input.blur(),a=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(E)>v&&y()}if(!a){const E=w.clientY-d;m-=E*this._step*this._arrowKeyMultiplier(w),f+m>this._max?m=this._max-f:f+m<this._min&&(m=this._min-f),this._snapClampSetValue(f+m)}d=w.clientY},y=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",b),window.removeEventListener("mouseup",y)},x=()=>{this._inputFocused=!0},_=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",t),this.$input.addEventListener("keydown",s),this.$input.addEventListener("wheel",r,{passive:!1}),this.$input.addEventListener("mousedown",g),this.$input.addEventListener("focus",x),this.$input.addEventListener("blur",_)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const e=(_,w,E,M,P)=>(_-w)/(E-w)*(P-M)+M,t=_=>{const w=this.$slider.getBoundingClientRect();let E=e(_,w.left,w.right,this._min,this._max);this._snapClampSetValue(E)},n=_=>{this._setDraggingStyle(!0),t(_.clientX),window.addEventListener("mousemove",s),window.addEventListener("mouseup",r)},s=_=>{t(_.clientX)},r=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",s),window.removeEventListener("mouseup",r)};let a=!1,c,u;const d=_=>{_.preventDefault(),this._setDraggingStyle(!0),t(_.touches[0].clientX),a=!1},f=_=>{_.touches.length>1||(this._hasScrollBar?(c=_.touches[0].clientX,u=_.touches[0].clientY,a=!0):d(_),window.addEventListener("touchmove",m,{passive:!1}),window.addEventListener("touchend",v))},m=_=>{if(a){const w=_.touches[0].clientX-c,E=_.touches[0].clientY-u;Math.abs(w)>Math.abs(E)?d(_):(window.removeEventListener("touchmove",m),window.removeEventListener("touchend",v))}else _.preventDefault(),t(_.touches[0].clientX)},v=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",m),window.removeEventListener("touchend",v)},g=this._callOnFinishChange.bind(this),b=400;let y;const x=_=>{if(Math.abs(_.deltaX)<Math.abs(_.deltaY)&&this._hasScrollBar)return;_.preventDefault();const E=this._normalizeMouseWheel(_)*this._step;this._snapClampSetValue(this.getValue()+E),this.$input.value=this.getValue(),clearTimeout(y),y=setTimeout(g,b)};this.$slider.addEventListener("mousedown",n),this.$slider.addEventListener("touchstart",f,{passive:!1}),this.$slider.addEventListener("wheel",x,{passive:!1})}_setDraggingStyle(e,t="horizontal"){this.$slider&&this.$slider.classList.toggle("active",e),document.body.classList.toggle("lil-gui-dragging",e),document.body.classList.toggle(`lil-gui-${t}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:t,deltaY:n}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(t=0,n=-e.wheelDelta/120,n*=this._stepExplicit?1:10),t+-n}_arrowKeyMultiplier(e){let t=this._stepExplicit?1:10;return e.shiftKey?t*=10:e.altKey&&(t/=10),t}_snap(e){const t=Math.round(e/this._step)*this._step;return parseFloat(t.toPrecision(15))}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){const e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Hy extends Xn{constructor(e,t,n,s){super(e,t,n,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(s)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(t=>{const n=document.createElement("option");n.textContent=t,this.$select.appendChild(n)}),this.updateDisplay(),this}updateDisplay(){const e=this.getValue(),t=this._values.indexOf(e);return this.$select.selectedIndex=t,this.$display.textContent=t===-1?e:this._names[t],this}}class Wy extends Xn{constructor(e,t,n){super(e,t,n,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",s=>{s.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const Xy=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: none;
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
  }
  .lil-gui button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;function Yy(i){const e=document.createElement("style");e.innerHTML=i;const t=document.querySelector("head link[rel=stylesheet], head style");t?document.head.insertBefore(e,t):document.head.appendChild(e)}let yd=!1;class Qc{constructor({parent:e,autoPlace:t=e===void 0,container:n,width:s,title:r="Controls",closeFolders:a=!1,injectStyles:c=!0,touchStyles:u=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",d=>{(d.code==="Enter"||d.code==="Space")&&(d.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(r),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),u&&this.domElement.classList.add("allow-touch-styles"),!yd&&c&&(Yy(Xy),yd=!0),n?n.appendChild(this.domElement):t&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),s&&this.domElement.style.setProperty("--width",s+"px"),this._closeFolders=a}add(e,t,n,s,r){if(Object(n)===n)return new Hy(this,e,t,n);const a=e[t];switch(typeof a){case"number":return new Gy(this,e,t,n,s,r);case"boolean":return new Ny(this,e,t);case"string":return new Wy(this,e,t);case"function":return new El(this,e,t)}console.error(`gui.add failed
	property:`,t,`
	object:`,e,`
	value:`,a)}addColor(e,t,n=1){return new Vy(this,e,t,n)}addFolder(e){const t=new Qc({parent:this,title:e});return this.root._closeFolders&&t.close(),t}load(e,t=!0){return e.controllers&&this.controllers.forEach(n=>{n instanceof El||n._name in e.controllers&&n.load(e.controllers[n._name])}),t&&e.folders&&this.folders.forEach(n=>{n._title in e.folders&&n.load(e.folders[n._title])}),this}save(e=!0){const t={controllers:{},folders:{}};return this.controllers.forEach(n=>{if(!(n instanceof El)){if(n._name in t.controllers)throw new Error(`Cannot save GUI with duplicate property "${n._name}"`);t.controllers[n._name]=n.save()}}),e&&this.folders.forEach(n=>{if(n._title in t.folders)throw new Error(`Cannot save GUI with duplicate folder "${n._title}"`);t.folders[n._title]=n.save()}),t}open(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const t=this.$children.clientHeight;this.$children.style.height=t+"px",this.domElement.classList.add("transition");const n=r=>{r.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",n))};this.$children.addEventListener("transitionend",n);const s=e?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!e),requestAnimationFrame(()=>{this.$children.style.height=s+"px"})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(n=>n.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(t=>{e=e.concat(t.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(t=>{e=e.concat(t.foldersRecursive())}),e}}function eh(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var Er={exports:{}};/*! Tweakpane 3.1.10 (c) 2016 cocopon, licensed under the MIT license. */var qy=Er.exports,wd;function jy(){return wd||(wd=1,function(i,e){(function(t,n){n(e)})(qy,function(t){class n{constructor(o){const[l,p]=o.split("-"),S=l.split(".");this.major=parseInt(S[0],10),this.minor=parseInt(S[1],10),this.patch=parseInt(S[2],10),this.prerelease=p??null}toString(){const o=[this.major,this.minor,this.patch].join(".");return this.prerelease!==null?[o,this.prerelease].join("-"):o}}class s{constructor(o){this.controller_=o}get element(){return this.controller_.view.element}get disabled(){return this.controller_.viewProps.get("disabled")}set disabled(o){this.controller_.viewProps.set("disabled",o)}get hidden(){return this.controller_.viewProps.get("hidden")}set hidden(o){this.controller_.viewProps.set("hidden",o)}dispose(){this.controller_.viewProps.set("disposed",!0)}}class r{constructor(o){this.target=o}}class a extends r{constructor(o,l,p,S){super(o),this.value=l,this.presetKey=p,this.last=S??!0}}class c extends r{constructor(o,l,p){super(o),this.value=l,this.presetKey=p}}class u extends r{constructor(o,l){super(o),this.expanded=l}}class d extends r{constructor(o,l){super(o),this.index=l}}function f(h){return h}function m(h){return h==null}function v(h,o){if(h.length!==o.length)return!1;for(let l=0;l<h.length;l++)if(h[l]!==o[l])return!1;return!0}function g(h,o){let l=h;do{const p=Object.getOwnPropertyDescriptor(l,o);if(p&&(p.set!==void 0||p.writable===!0))return!0;l=Object.getPrototypeOf(l)}while(l!==null);return!1}const b={alreadydisposed:()=>"View has been already disposed",invalidparams:h=>`Invalid parameters for '${h.name}'`,nomatchingcontroller:h=>`No matching controller for '${h.key}'`,nomatchingview:h=>`No matching view for '${JSON.stringify(h.params)}'`,notbindable:()=>"Value is not bindable",propertynotfound:h=>`Property '${h.name}' not found`,shouldneverhappen:()=>"This error should never happen"};class y{static alreadyDisposed(){return new y({type:"alreadydisposed"})}static notBindable(){return new y({type:"notbindable"})}static propertyNotFound(o){return new y({type:"propertynotfound",context:{name:o}})}static shouldNeverHappen(){return new y({type:"shouldneverhappen"})}constructor(o){var l;this.message=(l=b[o.type](o.context))!==null&&l!==void 0?l:"Unexpected error",this.name=this.constructor.name,this.stack=new Error(this.message).stack,this.type=o.type}}class x{constructor(o,l,p){this.obj_=o,this.key_=l,this.presetKey_=p??l}static isBindable(o){return!(o===null||typeof o!="object"&&typeof o!="function")}get key(){return this.key_}get presetKey(){return this.presetKey_}read(){return this.obj_[this.key_]}write(o){this.obj_[this.key_]=o}writeProperty(o,l){const p=this.read();if(!x.isBindable(p))throw y.notBindable();if(!(o in p))throw y.propertyNotFound(o);p[o]=l}}class _ extends s{get label(){return this.controller_.props.get("label")}set label(o){this.controller_.props.set("label",o)}get title(){var o;return(o=this.controller_.valueController.props.get("title"))!==null&&o!==void 0?o:""}set title(o){this.controller_.valueController.props.set("title",o)}on(o,l){const p=l.bind(this);return this.controller_.valueController.emitter.on(o,()=>{p(new r(this))}),this}}class w{constructor(){this.observers_={}}on(o,l){let p=this.observers_[o];return p||(p=this.observers_[o]=[]),p.push({handler:l}),this}off(o,l){const p=this.observers_[o];return p&&(this.observers_[o]=p.filter(S=>S.handler!==l)),this}emit(o,l){const p=this.observers_[o];p&&p.forEach(S=>{S.handler(l)})}}const E="tp";function M(h){return(l,p)=>[E,"-",h,"v",l?`_${l}`:"",p?`-${p}`:""].join("")}function P(h,o){return l=>o(h(l))}function D(h){return h.rawValue}function O(h,o){h.emitter.on("change",P(D,o)),o(h.rawValue)}function U(h,o,l){O(h.value(o),l)}function L(h,o,l){l?h.classList.add(o):h.classList.remove(o)}function A(h,o){return l=>{L(h,o,l)}}function F(h,o){O(h,l=>{o.textContent=l??""})}const q=M("btn");class X{constructor(o,l){this.element=o.createElement("div"),this.element.classList.add(q()),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("button");p.classList.add(q("b")),l.viewProps.bindDisabled(p),this.element.appendChild(p),this.buttonElement=p;const S=o.createElement("div");S.classList.add(q("t")),F(l.props.value("title"),S),this.buttonElement.appendChild(S)}}class J{constructor(o,l){this.emitter=new w,this.onClick_=this.onClick_.bind(this),this.props=l.props,this.viewProps=l.viewProps,this.view=new X(o,{props:this.props,viewProps:this.viewProps}),this.view.buttonElement.addEventListener("click",this.onClick_)}onClick_(){this.emitter.emit("click",{sender:this})}}class Q{constructor(o,l){var p;this.constraint_=l==null?void 0:l.constraint,this.equals_=(p=l==null?void 0:l.equals)!==null&&p!==void 0?p:(S,B)=>S===B,this.emitter=new w,this.rawValue_=o}get constraint(){return this.constraint_}get rawValue(){return this.rawValue_}set rawValue(o){this.setRawValue(o,{forceEmit:!1,last:!0})}setRawValue(o,l){const p=l??{forceEmit:!1,last:!0},S=this.constraint_?this.constraint_.constrain(o):o,B=this.rawValue_;this.equals_(B,S)&&!p.forceEmit||(this.emitter.emit("beforechange",{sender:this}),this.rawValue_=S,this.emitter.emit("change",{options:p,previousRawValue:B,rawValue:S,sender:this}))}}class te{constructor(o){this.emitter=new w,this.value_=o}get rawValue(){return this.value_}set rawValue(o){this.setRawValue(o,{forceEmit:!1,last:!0})}setRawValue(o,l){const p=l??{forceEmit:!1,last:!0},S=this.value_;S===o&&!p.forceEmit||(this.emitter.emit("beforechange",{sender:this}),this.value_=o,this.emitter.emit("change",{options:p,previousRawValue:S,rawValue:this.value_,sender:this}))}}function ee(h,o){const l=o==null?void 0:o.constraint,p=o==null?void 0:o.equals;return!l&&!p?new te(h):new Q(h,o)}class z{constructor(o){this.emitter=new w,this.valMap_=o;for(const l in this.valMap_)this.valMap_[l].emitter.on("change",()=>{this.emitter.emit("change",{key:l,sender:this})})}static createCore(o){return Object.keys(o).reduce((p,S)=>Object.assign(p,{[S]:ee(o[S])}),{})}static fromObject(o){const l=this.createCore(o);return new z(l)}get(o){return this.valMap_[o].rawValue}set(o,l){this.valMap_[o].rawValue=l}value(o){return this.valMap_[o]}}function le(h,o){const p=Object.keys(o).reduce((S,B)=>{if(S===void 0)return;const W=o[B],de=W(h[B]);return de.succeeded?Object.assign(Object.assign({},S),{[B]:de.value}):void 0},{});return p}function ce(h,o){return h.reduce((l,p)=>{if(l===void 0)return;const S=o(p);if(!(!S.succeeded||S.value===void 0))return[...l,S.value]},[])}function re(h){return h===null?!1:typeof h=="object"}function Re(h){return o=>l=>{if(!o&&l===void 0)return{succeeded:!1,value:void 0};if(o&&l===void 0)return{succeeded:!0,value:void 0};const p=h(l);return p!==void 0?{succeeded:!0,value:p}:{succeeded:!1,value:void 0}}}function st(h){return{custom:o=>Re(o)(h),boolean:Re(o=>typeof o=="boolean"?o:void 0)(h),number:Re(o=>typeof o=="number"?o:void 0)(h),string:Re(o=>typeof o=="string"?o:void 0)(h),function:Re(o=>typeof o=="function"?o:void 0)(h),constant:o=>Re(l=>l===o?o:void 0)(h),raw:Re(o=>o)(h),object:o=>Re(l=>{if(re(l))return le(l,o)})(h),array:o=>Re(l=>{if(Array.isArray(l))return ce(l,o)})(h)}}const Y={optional:st(!0),required:st(!1)};function ae(h,o){const l=Y.required.object(o)(h);return l.succeeded?l.value:void 0}function ye(h){console.warn([`Missing '${h.key}' of ${h.target} in ${h.place}.`,"Please rebuild plugins with the latest core package."].join(" "))}function me(h){return h&&h.parentElement&&h.parentElement.removeChild(h),null}class Le{constructor(o){this.value_=o}static create(o){return[new Le(o),(l,p)=>{o.setRawValue(l,p)}]}get emitter(){return this.value_.emitter}get rawValue(){return this.value_.rawValue}}const Fe=M("");function Ve(h,o){return A(h,Fe(void 0,o))}class j extends z{constructor(o){var l;super(o),this.onDisabledChange_=this.onDisabledChange_.bind(this),this.onParentChange_=this.onParentChange_.bind(this),this.onParentGlobalDisabledChange_=this.onParentGlobalDisabledChange_.bind(this),[this.globalDisabled_,this.setGlobalDisabled_]=Le.create(ee(this.getGlobalDisabled_())),this.value("disabled").emitter.on("change",this.onDisabledChange_),this.value("parent").emitter.on("change",this.onParentChange_),(l=this.get("parent"))===null||l===void 0||l.globalDisabled.emitter.on("change",this.onParentGlobalDisabledChange_)}static create(o){var l,p,S;const B=o??{};return new j(z.createCore({disabled:(l=B.disabled)!==null&&l!==void 0?l:!1,disposed:!1,hidden:(p=B.hidden)!==null&&p!==void 0?p:!1,parent:(S=B.parent)!==null&&S!==void 0?S:null}))}get globalDisabled(){return this.globalDisabled_}bindClassModifiers(o){O(this.globalDisabled_,Ve(o,"disabled")),U(this,"hidden",Ve(o,"hidden"))}bindDisabled(o){O(this.globalDisabled_,l=>{o.disabled=l})}bindTabIndex(o){O(this.globalDisabled_,l=>{o.tabIndex=l?-1:0})}handleDispose(o){this.value("disposed").emitter.on("change",l=>{l&&o()})}getGlobalDisabled_(){const o=this.get("parent");return(o?o.globalDisabled.rawValue:!1)||this.get("disabled")}updateGlobalDisabled_(){this.setGlobalDisabled_(this.getGlobalDisabled_())}onDisabledChange_(){this.updateGlobalDisabled_()}onParentGlobalDisabledChange_(){this.updateGlobalDisabled_()}onParentChange_(o){var l;const p=o.previousRawValue;p==null||p.globalDisabled.emitter.off("change",this.onParentGlobalDisabledChange_),(l=this.get("parent"))===null||l===void 0||l.globalDisabled.emitter.on("change",this.onParentGlobalDisabledChange_),this.updateGlobalDisabled_()}}function ge(){return["veryfirst","first","last","verylast"]}const Xe=M(""),k={veryfirst:"vfst",first:"fst",last:"lst",verylast:"vlst"};class ut{constructor(o){this.parent_=null,this.blade=o.blade,this.view=o.view,this.viewProps=o.viewProps;const l=this.view.element;this.blade.value("positions").emitter.on("change",()=>{ge().forEach(p=>{l.classList.remove(Xe(void 0,k[p]))}),this.blade.get("positions").forEach(p=>{l.classList.add(Xe(void 0,k[p]))})}),this.viewProps.handleDispose(()=>{me(l)})}get parent(){return this.parent_}set parent(o){if(this.parent_=o,!("parent"in this.viewProps.valMap_)){ye({key:"parent",target:j.name,place:"BladeController.parent"});return}this.viewProps.set("parent",this.parent_?this.parent_.viewProps:null)}}const Ne="http://www.w3.org/2000/svg";function He(h){h.offsetHeight}function Ie(h,o){const l=h.style.transition;h.style.transition="none",o(),h.style.transition=l}function dt(h){return h.ontouchstart!==void 0}function Oe(){return globalThis}function N(){return Oe().document}function C(h){const o=h.ownerDocument.defaultView;return o&&"document"in o?h.getContext("2d",{willReadFrequently:!0}):null}const $={check:'<path d="M2 8l4 4l8 -8"/>',dropdown:'<path d="M5 7h6l-3 3 z"/>',p2dpad:'<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>'};function se(h,o){const l=h.createElementNS(Ne,"svg");return l.innerHTML=$[o],l}function he(h,o,l){h.insertBefore(o,h.children[l])}function ie(h){h.parentElement&&h.parentElement.removeChild(h)}function De(h){for(;h.children.length>0;)h.removeChild(h.children[0])}function be(h){for(;h.childNodes.length>0;)h.removeChild(h.childNodes[0])}function Ee(h){return h.relatedTarget?h.relatedTarget:"explicitOriginalTarget"in h?h.explicitOriginalTarget:null}const rt=M("lbl");function fe(h,o){const l=h.createDocumentFragment();return o.split(`
`).map(S=>h.createTextNode(S)).forEach((S,B)=>{B>0&&l.appendChild(h.createElement("br")),l.appendChild(S)}),l}class Te{constructor(o,l){this.element=o.createElement("div"),this.element.classList.add(rt()),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("div");p.classList.add(rt("l")),U(l.props,"label",B=>{m(B)?this.element.classList.add(rt(void 0,"nol")):(this.element.classList.remove(rt(void 0,"nol")),be(p),p.appendChild(fe(o,B)))}),this.element.appendChild(p),this.labelElement=p;const S=o.createElement("div");S.classList.add(rt("v")),this.element.appendChild(S),this.valueElement=S}}class ke extends ut{constructor(o,l){const p=l.valueController.viewProps;super(Object.assign(Object.assign({},l),{view:new Te(o,{props:l.props,viewProps:p}),viewProps:p})),this.props=l.props,this.valueController=l.valueController,this.view.valueElement.appendChild(this.valueController.view.element)}}const Ye={id:"button",type:"blade",accept(h){const o=Y,l=ae(h,{title:o.required.string,view:o.required.constant("button"),label:o.optional.string});return l?{params:l}:null},controller(h){return new ke(h.document,{blade:h.blade,props:z.fromObject({label:h.params.label}),valueController:new J(h.document,{props:z.fromObject({title:h.params.title}),viewProps:h.viewProps})})},api(h){return!(h.controller instanceof ke)||!(h.controller.valueController instanceof J)?null:new _(h.controller)}};class Me extends ut{constructor(o){super(o),this.value=o.value}}function tt(){return new z({positions:ee([],{equals:v})})}class je extends z{constructor(o){super(o)}static create(o){const l={completed:!0,expanded:o,expandedHeight:null,shouldFixHeight:!1,temporaryExpanded:null},p=z.createCore(l);return new je(p)}get styleExpanded(){var o;return(o=this.get("temporaryExpanded"))!==null&&o!==void 0?o:this.get("expanded")}get styleHeight(){if(!this.styleExpanded)return"0";const o=this.get("expandedHeight");return this.get("shouldFixHeight")&&!m(o)?`${o}px`:"auto"}bindExpandedClass(o,l){const p=()=>{this.styleExpanded?o.classList.add(l):o.classList.remove(l)};U(this,"expanded",p),U(this,"temporaryExpanded",p)}cleanUpTransition(){this.set("shouldFixHeight",!1),this.set("expandedHeight",null),this.set("completed",!0)}}function bt(h,o){let l=0;return Ie(o,()=>{h.set("expandedHeight",null),h.set("temporaryExpanded",!0),He(o),l=o.clientHeight,h.set("temporaryExpanded",null),He(o)}),l}function V(h,o){o.style.height=h.styleHeight}function ve(h,o){h.value("expanded").emitter.on("beforechange",()=>{if(h.set("completed",!1),m(h.get("expandedHeight"))){const l=bt(h,o);l>0&&h.set("expandedHeight",l)}h.set("shouldFixHeight",!0),He(o)}),h.emitter.on("change",()=>{V(h,o)}),V(h,o),o.addEventListener("transitionend",l=>{l.propertyName==="height"&&h.cleanUpTransition()})}class ne extends s{constructor(o,l){super(o),this.rackApi_=l}}function oe(h,o){return h.addBlade(Object.assign(Object.assign({},o),{view:"button"}))}function Se(h,o){return h.addBlade(Object.assign(Object.assign({},o),{view:"folder"}))}function we(h,o){const l=o??{};return h.addBlade(Object.assign(Object.assign({},l),{view:"separator"}))}function Je(h,o){return h.addBlade(Object.assign(Object.assign({},o),{view:"tab"}))}class St{constructor(o){this.emitter=new w,this.items_=[],this.cache_=new Set,this.onSubListAdd_=this.onSubListAdd_.bind(this),this.onSubListRemove_=this.onSubListRemove_.bind(this),this.extract_=o}get items(){return this.items_}allItems(){return Array.from(this.cache_)}find(o){for(const l of this.allItems())if(o(l))return l;return null}includes(o){return this.cache_.has(o)}add(o,l){if(this.includes(o))throw y.shouldNeverHappen();const p=l!==void 0?l:this.items_.length;this.items_.splice(p,0,o),this.cache_.add(o);const S=this.extract_(o);S&&(S.emitter.on("add",this.onSubListAdd_),S.emitter.on("remove",this.onSubListRemove_),S.allItems().forEach(B=>{this.cache_.add(B)})),this.emitter.emit("add",{index:p,item:o,root:this,target:this})}remove(o){const l=this.items_.indexOf(o);if(l<0)return;this.items_.splice(l,1),this.cache_.delete(o);const p=this.extract_(o);p&&(p.emitter.off("add",this.onSubListAdd_),p.emitter.off("remove",this.onSubListRemove_)),this.emitter.emit("remove",{index:l,item:o,root:this,target:this})}onSubListAdd_(o){this.cache_.add(o.item),this.emitter.emit("add",{index:o.index,item:o.item,root:this,target:o.target})}onSubListRemove_(o){this.cache_.delete(o.item),this.emitter.emit("remove",{index:o.index,item:o.item,root:this,target:o.target})}}class Nt extends s{constructor(o){super(o),this.onBindingChange_=this.onBindingChange_.bind(this),this.emitter_=new w,this.controller_.binding.emitter.on("change",this.onBindingChange_)}get label(){return this.controller_.props.get("label")}set label(o){this.controller_.props.set("label",o)}on(o,l){const p=l.bind(this);return this.emitter_.on(o,S=>{p(S.event)}),this}refresh(){this.controller_.binding.read()}onBindingChange_(o){const l=o.sender.target.read();this.emitter_.emit("change",{event:new a(this,l,this.controller_.binding.target.presetKey,o.options.last)})}}class nt extends ke{constructor(o,l){super(o,l),this.binding=l.binding}}class tn extends s{constructor(o){super(o),this.onBindingUpdate_=this.onBindingUpdate_.bind(this),this.emitter_=new w,this.controller_.binding.emitter.on("update",this.onBindingUpdate_)}get label(){return this.controller_.props.get("label")}set label(o){this.controller_.props.set("label",o)}on(o,l){const p=l.bind(this);return this.emitter_.on(o,S=>{p(S.event)}),this}refresh(){this.controller_.binding.read()}onBindingUpdate_(o){const l=o.sender.target.read();this.emitter_.emit("update",{event:new c(this,l,this.controller_.binding.target.presetKey)})}}class Ht extends ke{constructor(o,l){super(o,l),this.binding=l.binding,this.viewProps.bindDisabled(this.binding.ticker),this.viewProps.handleDispose(()=>{this.binding.dispose()})}}function Vr(h){return h instanceof hi?h.apiSet_:h instanceof ne?h.rackApi_.apiSet_:null}function ci(h,o){const l=h.find(p=>p.controller_===o);if(!l)throw y.shouldNeverHappen();return l}function Bn(h,o,l){if(!x.isBindable(h))throw y.notBindable();return new x(h,o,l)}class hi extends s{constructor(o,l){super(o),this.onRackAdd_=this.onRackAdd_.bind(this),this.onRackRemove_=this.onRackRemove_.bind(this),this.onRackInputChange_=this.onRackInputChange_.bind(this),this.onRackMonitorUpdate_=this.onRackMonitorUpdate_.bind(this),this.emitter_=new w,this.apiSet_=new St(Vr),this.pool_=l;const p=this.controller_.rack;p.emitter.on("add",this.onRackAdd_),p.emitter.on("remove",this.onRackRemove_),p.emitter.on("inputchange",this.onRackInputChange_),p.emitter.on("monitorupdate",this.onRackMonitorUpdate_),p.children.forEach(S=>{this.setUpApi_(S)})}get children(){return this.controller_.rack.children.map(o=>ci(this.apiSet_,o))}addInput(o,l,p){const S=p??{},B=this.controller_.view.element.ownerDocument,W=this.pool_.createInput(B,Bn(o,l,S.presetKey),S),de=new Nt(W);return this.add(de,S.index)}addMonitor(o,l,p){const S=p??{},B=this.controller_.view.element.ownerDocument,W=this.pool_.createMonitor(B,Bn(o,l),S),de=new tn(W);return this.add(de,S.index)}addFolder(o){return Se(this,o)}addButton(o){return oe(this,o)}addSeparator(o){return we(this,o)}addTab(o){return Je(this,o)}add(o,l){this.controller_.rack.add(o.controller_,l);const p=this.apiSet_.find(S=>S.controller_===o.controller_);return p&&this.apiSet_.remove(p),this.apiSet_.add(o),o}remove(o){this.controller_.rack.remove(o.controller_)}addBlade(o){const l=this.controller_.view.element.ownerDocument,p=this.pool_.createBlade(l,o),S=this.pool_.createBladeApi(p);return this.add(S,o.index)}on(o,l){const p=l.bind(this);return this.emitter_.on(o,S=>{p(S.event)}),this}setUpApi_(o){this.apiSet_.find(p=>p.controller_===o)||this.apiSet_.add(this.pool_.createBladeApi(o))}onRackAdd_(o){this.setUpApi_(o.bladeController)}onRackRemove_(o){if(o.isRoot){const l=ci(this.apiSet_,o.bladeController);this.apiSet_.remove(l)}}onRackInputChange_(o){const l=o.bladeController;if(l instanceof nt){const p=ci(this.apiSet_,l),S=l.binding;this.emitter_.emit("change",{event:new a(p,S.target.read(),S.target.presetKey,o.options.last)})}else if(l instanceof Me){const p=ci(this.apiSet_,l);this.emitter_.emit("change",{event:new a(p,l.value.rawValue,void 0,o.options.last)})}}onRackMonitorUpdate_(o){if(!(o.bladeController instanceof Ht))throw y.shouldNeverHappen();const l=ci(this.apiSet_,o.bladeController),p=o.bladeController.binding;this.emitter_.emit("update",{event:new c(l,p.target.read(),p.target.presetKey)})}}class as extends ne{constructor(o,l){super(o,new hi(o.rackController,l)),this.emitter_=new w,this.controller_.foldable.value("expanded").emitter.on("change",p=>{this.emitter_.emit("fold",{event:new u(this,p.sender.rawValue)})}),this.rackApi_.on("change",p=>{this.emitter_.emit("change",{event:p})}),this.rackApi_.on("update",p=>{this.emitter_.emit("update",{event:p})})}get expanded(){return this.controller_.foldable.get("expanded")}set expanded(o){this.controller_.foldable.set("expanded",o)}get title(){return this.controller_.props.get("title")}set title(o){this.controller_.props.set("title",o)}get children(){return this.rackApi_.children}addInput(o,l,p){return this.rackApi_.addInput(o,l,p)}addMonitor(o,l,p){return this.rackApi_.addMonitor(o,l,p)}addFolder(o){return this.rackApi_.addFolder(o)}addButton(o){return this.rackApi_.addButton(o)}addSeparator(o){return this.rackApi_.addSeparator(o)}addTab(o){return this.rackApi_.addTab(o)}add(o,l){return this.rackApi_.add(o,l)}remove(o){this.rackApi_.remove(o)}addBlade(o){return this.rackApi_.addBlade(o)}on(o,l){const p=l.bind(this);return this.emitter_.on(o,S=>{p(S.event)}),this}}class ls extends ut{constructor(o){super({blade:o.blade,view:o.view,viewProps:o.rackController.viewProps}),this.rackController=o.rackController}}class cs{constructor(o,l){const p=M(l.viewName);this.element=o.createElement("div"),this.element.classList.add(p()),l.viewProps.bindClassModifiers(this.element)}}function Gr(h,o){for(let l=0;l<h.length;l++){const p=h[l];if(p instanceof nt&&p.binding===o)return p}return null}function hs(h,o){for(let l=0;l<h.length;l++){const p=h[l];if(p instanceof Ht&&p.binding===o)return p}return null}function Hr(h,o){for(let l=0;l<h.length;l++){const p=h[l];if(p instanceof Me&&p.value===o)return p}return null}function us(h){return h instanceof Fi?h.rack:h instanceof ls?h.rackController.rack:null}function ba(h){const o=us(h);return o?o.bcSet_:null}class ya{constructor(o){var l,p;this.onBladePositionsChange_=this.onBladePositionsChange_.bind(this),this.onSetAdd_=this.onSetAdd_.bind(this),this.onSetRemove_=this.onSetRemove_.bind(this),this.onChildDispose_=this.onChildDispose_.bind(this),this.onChildPositionsChange_=this.onChildPositionsChange_.bind(this),this.onChildInputChange_=this.onChildInputChange_.bind(this),this.onChildMonitorUpdate_=this.onChildMonitorUpdate_.bind(this),this.onChildValueChange_=this.onChildValueChange_.bind(this),this.onChildViewPropsChange_=this.onChildViewPropsChange_.bind(this),this.onDescendantLayout_=this.onDescendantLayout_.bind(this),this.onDescendantInputChange_=this.onDescendantInputChange_.bind(this),this.onDescendantMonitorUpdate_=this.onDescendantMonitorUpdate_.bind(this),this.emitter=new w,this.blade_=(l=o.blade)!==null&&l!==void 0?l:null,(p=this.blade_)===null||p===void 0||p.value("positions").emitter.on("change",this.onBladePositionsChange_),this.viewProps=o.viewProps,this.bcSet_=new St(ba),this.bcSet_.emitter.on("add",this.onSetAdd_),this.bcSet_.emitter.on("remove",this.onSetRemove_)}get children(){return this.bcSet_.items}add(o,l){var p;(p=o.parent)===null||p===void 0||p.remove(o),g(o,"parent")?o.parent=this:(o.parent_=this,ye({key:"parent",target:"BladeController",place:"BladeRack.add"})),this.bcSet_.add(o,l)}remove(o){g(o,"parent")?o.parent=null:(o.parent_=null,ye({key:"parent",target:"BladeController",place:"BladeRack.remove"})),this.bcSet_.remove(o)}find(o){return this.bcSet_.allItems().filter(l=>l instanceof o)}onSetAdd_(o){this.updatePositions_();const l=o.target===o.root;if(this.emitter.emit("add",{bladeController:o.item,index:o.index,isRoot:l,sender:this}),!l)return;const p=o.item;if(p.viewProps.emitter.on("change",this.onChildViewPropsChange_),p.blade.value("positions").emitter.on("change",this.onChildPositionsChange_),p.viewProps.handleDispose(this.onChildDispose_),p instanceof nt)p.binding.emitter.on("change",this.onChildInputChange_);else if(p instanceof Ht)p.binding.emitter.on("update",this.onChildMonitorUpdate_);else if(p instanceof Me)p.value.emitter.on("change",this.onChildValueChange_);else{const S=us(p);if(S){const B=S.emitter;B.on("layout",this.onDescendantLayout_),B.on("inputchange",this.onDescendantInputChange_),B.on("monitorupdate",this.onDescendantMonitorUpdate_)}}}onSetRemove_(o){this.updatePositions_();const l=o.target===o.root;if(this.emitter.emit("remove",{bladeController:o.item,isRoot:l,sender:this}),!l)return;const p=o.item;if(p instanceof nt)p.binding.emitter.off("change",this.onChildInputChange_);else if(p instanceof Ht)p.binding.emitter.off("update",this.onChildMonitorUpdate_);else if(p instanceof Me)p.value.emitter.off("change",this.onChildValueChange_);else{const S=us(p);if(S){const B=S.emitter;B.off("layout",this.onDescendantLayout_),B.off("inputchange",this.onDescendantInputChange_),B.off("monitorupdate",this.onDescendantMonitorUpdate_)}}}updatePositions_(){const o=this.bcSet_.items.filter(S=>!S.viewProps.get("hidden")),l=o[0],p=o[o.length-1];this.bcSet_.items.forEach(S=>{const B=[];S===l&&(B.push("first"),(!this.blade_||this.blade_.get("positions").includes("veryfirst"))&&B.push("veryfirst")),S===p&&(B.push("last"),(!this.blade_||this.blade_.get("positions").includes("verylast"))&&B.push("verylast")),S.blade.set("positions",B)})}onChildPositionsChange_(){this.updatePositions_(),this.emitter.emit("layout",{sender:this})}onChildViewPropsChange_(o){this.updatePositions_(),this.emitter.emit("layout",{sender:this})}onChildDispose_(){this.bcSet_.items.filter(l=>l.viewProps.get("disposed")).forEach(l=>{this.bcSet_.remove(l)})}onChildInputChange_(o){const l=Gr(this.find(nt),o.sender);if(!l)throw y.alreadyDisposed();this.emitter.emit("inputchange",{bladeController:l,options:o.options,sender:this})}onChildMonitorUpdate_(o){const l=hs(this.find(Ht),o.sender);if(!l)throw y.alreadyDisposed();this.emitter.emit("monitorupdate",{bladeController:l,sender:this})}onChildValueChange_(o){const l=Hr(this.find(Me),o.sender);if(!l)throw y.alreadyDisposed();this.emitter.emit("inputchange",{bladeController:l,options:o.options,sender:this})}onDescendantLayout_(o){this.updatePositions_(),this.emitter.emit("layout",{sender:this})}onDescendantInputChange_(o){this.emitter.emit("inputchange",{bladeController:o.bladeController,options:o.options,sender:this})}onDescendantMonitorUpdate_(o){this.emitter.emit("monitorupdate",{bladeController:o.bladeController,sender:this})}onBladePositionsChange_(){this.updatePositions_()}}class Fi extends ut{constructor(o,l){super(Object.assign(Object.assign({},l),{view:new cs(o,{viewName:"brk",viewProps:l.viewProps})})),this.onRackAdd_=this.onRackAdd_.bind(this),this.onRackRemove_=this.onRackRemove_.bind(this);const p=new ya({blade:l.root?void 0:l.blade,viewProps:l.viewProps});p.emitter.on("add",this.onRackAdd_),p.emitter.on("remove",this.onRackRemove_),this.rack=p,this.viewProps.handleDispose(()=>{for(let S=this.rack.children.length-1;S>=0;S--)this.rack.children[S].viewProps.set("disposed",!0)})}onRackAdd_(o){o.isRoot&&he(this.view.element,o.bladeController.view.element,o.index)}onRackRemove_(o){o.isRoot&&ie(o.bladeController.view.element)}}const Wr=M("cnt");class wa{constructor(o,l){var p;this.className_=M((p=l.viewName)!==null&&p!==void 0?p:"fld"),this.element=o.createElement("div"),this.element.classList.add(this.className_(),Wr()),l.viewProps.bindClassModifiers(this.element),this.foldable_=l.foldable,this.foldable_.bindExpandedClass(this.element,this.className_(void 0,"expanded")),U(this.foldable_,"completed",A(this.element,this.className_(void 0,"cpl")));const S=o.createElement("button");S.classList.add(this.className_("b")),U(l.props,"title",We=>{m(We)?this.element.classList.add(this.className_(void 0,"not")):this.element.classList.remove(this.className_(void 0,"not"))}),l.viewProps.bindDisabled(S),this.element.appendChild(S),this.buttonElement=S;const B=o.createElement("div");B.classList.add(this.className_("i")),this.element.appendChild(B);const W=o.createElement("div");W.classList.add(this.className_("t")),F(l.props.value("title"),W),this.buttonElement.appendChild(W),this.titleElement=W;const de=o.createElement("div");de.classList.add(this.className_("m")),this.buttonElement.appendChild(de);const Ge=l.containerElement;Ge.classList.add(this.className_("c")),this.element.appendChild(Ge),this.containerElement=Ge}}class R extends ls{constructor(o,l){var p;const S=je.create((p=l.expanded)!==null&&p!==void 0?p:!0),B=new Fi(o,{blade:l.blade,root:l.root,viewProps:l.viewProps});super(Object.assign(Object.assign({},l),{rackController:B,view:new wa(o,{containerElement:B.view.element,foldable:S,props:l.props,viewName:l.root?"rot":void 0,viewProps:l.viewProps})})),this.onTitleClick_=this.onTitleClick_.bind(this),this.props=l.props,this.foldable=S,ve(this.foldable,this.view.containerElement),this.rackController.rack.emitter.on("add",()=>{this.foldable.cleanUpTransition()}),this.rackController.rack.emitter.on("remove",()=>{this.foldable.cleanUpTransition()}),this.view.buttonElement.addEventListener("click",this.onTitleClick_)}get document(){return this.view.element.ownerDocument}onTitleClick_(){this.foldable.set("expanded",!this.foldable.get("expanded"))}}const G={id:"folder",type:"blade",accept(h){const o=Y,l=ae(h,{title:o.required.string,view:o.required.constant("folder"),expanded:o.optional.boolean});return l?{params:l}:null},controller(h){return new R(h.document,{blade:h.blade,expanded:h.params.expanded,props:z.fromObject({title:h.params.title}),viewProps:h.viewProps})},api(h){return h.controller instanceof R?new as(h.controller,h.pool):null}};class K extends Me{constructor(o,l){const p=l.valueController.viewProps;super(Object.assign(Object.assign({},l),{value:l.valueController.value,view:new Te(o,{props:l.props,viewProps:p}),viewProps:p})),this.props=l.props,this.valueController=l.valueController,this.view.valueElement.appendChild(this.valueController.view.element)}}class Z extends s{}const H=M("spr");class pe{constructor(o,l){this.element=o.createElement("div"),this.element.classList.add(H()),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("hr");p.classList.add(H("r")),this.element.appendChild(p)}}class _e extends ut{constructor(o,l){super(Object.assign(Object.assign({},l),{view:new pe(o,{viewProps:l.viewProps})}))}}const Ae={id:"separator",type:"blade",accept(h){const l=ae(h,{view:Y.required.constant("separator")});return l?{params:l}:null},controller(h){return new _e(h.document,{blade:h.blade,viewProps:h.viewProps})},api(h){return h.controller instanceof _e?new Z(h.controller):null}},Ce=M("tbi");class qe{constructor(o,l){this.element=o.createElement("div"),this.element.classList.add(Ce()),l.viewProps.bindClassModifiers(this.element),U(l.props,"selected",B=>{B?this.element.classList.add(Ce(void 0,"sel")):this.element.classList.remove(Ce(void 0,"sel"))});const p=o.createElement("button");p.classList.add(Ce("b")),l.viewProps.bindDisabled(p),this.element.appendChild(p),this.buttonElement=p;const S=o.createElement("div");S.classList.add(Ce("t")),F(l.props.value("title"),S),this.buttonElement.appendChild(S),this.titleElement=S}}class $e{constructor(o,l){this.emitter=new w,this.onClick_=this.onClick_.bind(this),this.props=l.props,this.viewProps=l.viewProps,this.view=new qe(o,{props:l.props,viewProps:l.viewProps}),this.view.buttonElement.addEventListener("click",this.onClick_)}onClick_(){this.emitter.emit("click",{sender:this})}}class Be{constructor(o,l){this.onItemClick_=this.onItemClick_.bind(this),this.ic_=new $e(o,{props:l.itemProps,viewProps:j.create()}),this.ic_.emitter.on("click",this.onItemClick_),this.cc_=new Fi(o,{blade:tt(),viewProps:j.create()}),this.props=l.props,U(this.props,"selected",p=>{this.itemController.props.set("selected",p),this.contentController.viewProps.set("hidden",!p)})}get itemController(){return this.ic_}get contentController(){return this.cc_}onItemClick_(){this.props.set("selected",!0)}}class ct{constructor(o,l){this.controller_=o,this.rackApi_=l}get title(){var o;return(o=this.controller_.itemController.props.get("title"))!==null&&o!==void 0?o:""}set title(o){this.controller_.itemController.props.set("title",o)}get selected(){return this.controller_.props.get("selected")}set selected(o){this.controller_.props.set("selected",o)}get children(){return this.rackApi_.children}addButton(o){return this.rackApi_.addButton(o)}addFolder(o){return this.rackApi_.addFolder(o)}addSeparator(o){return this.rackApi_.addSeparator(o)}addTab(o){return this.rackApi_.addTab(o)}add(o,l){this.rackApi_.add(o,l)}remove(o){this.rackApi_.remove(o)}addInput(o,l,p){return this.rackApi_.addInput(o,l,p)}addMonitor(o,l,p){return this.rackApi_.addMonitor(o,l,p)}addBlade(o){return this.rackApi_.addBlade(o)}}class pt extends ne{constructor(o,l){super(o,new hi(o.rackController,l)),this.onPageAdd_=this.onPageAdd_.bind(this),this.onPageRemove_=this.onPageRemove_.bind(this),this.onSelect_=this.onSelect_.bind(this),this.emitter_=new w,this.pageApiMap_=new Map,this.rackApi_.on("change",p=>{this.emitter_.emit("change",{event:p})}),this.rackApi_.on("update",p=>{this.emitter_.emit("update",{event:p})}),this.controller_.tab.selectedIndex.emitter.on("change",this.onSelect_),this.controller_.pageSet.emitter.on("add",this.onPageAdd_),this.controller_.pageSet.emitter.on("remove",this.onPageRemove_),this.controller_.pageSet.items.forEach(p=>{this.setUpPageApi_(p)})}get pages(){return this.controller_.pageSet.items.map(o=>{const l=this.pageApiMap_.get(o);if(!l)throw y.shouldNeverHappen();return l})}addPage(o){const l=this.controller_.view.element.ownerDocument,p=new Be(l,{itemProps:z.fromObject({selected:!1,title:o.title}),props:z.fromObject({selected:!1})});this.controller_.add(p,o.index);const S=this.pageApiMap_.get(p);if(!S)throw y.shouldNeverHappen();return S}removePage(o){this.controller_.remove(o)}on(o,l){const p=l.bind(this);return this.emitter_.on(o,S=>{p(S.event)}),this}setUpPageApi_(o){const l=this.rackApi_.apiSet_.find(S=>S.controller_===o.contentController);if(!l)throw y.shouldNeverHappen();const p=new ct(o,l);this.pageApiMap_.set(o,p)}onPageAdd_(o){this.setUpPageApi_(o.item)}onPageRemove_(o){if(!this.pageApiMap_.get(o.item))throw y.shouldNeverHappen();this.pageApiMap_.delete(o.item)}onSelect_(o){this.emitter_.emit("select",{event:new d(this,o.rawValue)})}}const Rt=-1;class At{constructor(){this.onItemSelectedChange_=this.onItemSelectedChange_.bind(this),this.empty=ee(!0),this.selectedIndex=ee(Rt),this.items_=[]}add(o,l){const p=l??this.items_.length;this.items_.splice(p,0,o),o.emitter.on("change",this.onItemSelectedChange_),this.keepSelection_()}remove(o){const l=this.items_.indexOf(o);l<0||(this.items_.splice(l,1),o.emitter.off("change",this.onItemSelectedChange_),this.keepSelection_())}keepSelection_(){if(this.items_.length===0){this.selectedIndex.rawValue=Rt,this.empty.rawValue=!0;return}const o=this.items_.findIndex(l=>l.rawValue);o<0?(this.items_.forEach((l,p)=>{l.rawValue=p===0}),this.selectedIndex.rawValue=0):(this.items_.forEach((l,p)=>{l.rawValue=p===o}),this.selectedIndex.rawValue=o),this.empty.rawValue=!1}onItemSelectedChange_(o){if(o.rawValue){const l=this.items_.findIndex(p=>p===o.sender);this.items_.forEach((p,S)=>{p.rawValue=S===l}),this.selectedIndex.rawValue=l}else this.keepSelection_()}}const ot=M("tab");class ze{constructor(o,l){this.element=o.createElement("div"),this.element.classList.add(ot(),Wr()),l.viewProps.bindClassModifiers(this.element),O(l.empty,A(this.element,ot(void 0,"nop")));const p=o.createElement("div");p.classList.add(ot("t")),this.element.appendChild(p),this.itemsElement=p;const S=o.createElement("div");S.classList.add(ot("i")),this.element.appendChild(S);const B=l.contentsElement;B.classList.add(ot("c")),this.element.appendChild(B),this.contentsElement=B}}class Ot extends ls{constructor(o,l){const p=new Fi(o,{blade:l.blade,viewProps:l.viewProps}),S=new At;super({blade:l.blade,rackController:p,view:new ze(o,{contentsElement:p.view.element,empty:S.empty,viewProps:l.viewProps})}),this.onPageAdd_=this.onPageAdd_.bind(this),this.onPageRemove_=this.onPageRemove_.bind(this),this.pageSet_=new St(()=>null),this.pageSet_.emitter.on("add",this.onPageAdd_),this.pageSet_.emitter.on("remove",this.onPageRemove_),this.tab=S}get pageSet(){return this.pageSet_}add(o,l){this.pageSet_.add(o,l)}remove(o){this.pageSet_.remove(this.pageSet_.items[o])}onPageAdd_(o){const l=o.item;he(this.view.itemsElement,l.itemController.view.element,o.index),l.itemController.viewProps.set("parent",this.viewProps),this.rackController.rack.add(l.contentController,o.index),this.tab.add(l.props.value("selected"))}onPageRemove_(o){const l=o.item;ie(l.itemController.view.element),l.itemController.viewProps.set("parent",null),this.rackController.rack.remove(l.contentController),this.tab.remove(l.props.value("selected"))}}const ft={id:"tab",type:"blade",accept(h){const o=Y,l=ae(h,{pages:o.required.array(o.required.object({title:o.required.string})),view:o.required.constant("tab")});return!l||l.pages.length===0?null:{params:l}},controller(h){const o=new Ot(h.document,{blade:h.blade,viewProps:h.viewProps});return h.params.pages.forEach(l=>{const p=new Be(h.document,{itemProps:z.fromObject({selected:!1,title:l.title}),props:z.fromObject({selected:!1})});o.add(p)}),o},api(h){return h.controller instanceof Ot?new pt(h.controller,h.pool):null}};function gn(h,o){const l=h.accept(o.params);if(!l)return null;const p=Y.optional.boolean(o.params.disabled).value,S=Y.optional.boolean(o.params.hidden).value;return h.controller({blade:tt(),document:o.document,params:Object.assign(Object.assign({},l.params),{disabled:p,hidden:S}),viewProps:j.create({disabled:p,hidden:S})})}class ui{constructor(){this.disabled=!1,this.emitter=new w}dispose(){}tick(){this.disabled||this.emitter.emit("tick",{sender:this})}}class nn{constructor(o,l){this.disabled_=!1,this.timerId_=null,this.onTick_=this.onTick_.bind(this),this.doc_=o,this.emitter=new w,this.interval_=l,this.setTimer_()}get disabled(){return this.disabled_}set disabled(o){this.disabled_=o,this.disabled_?this.clearTimer_():this.setTimer_()}dispose(){this.clearTimer_()}clearTimer_(){if(this.timerId_===null)return;const o=this.doc_.defaultView;o&&o.clearInterval(this.timerId_),this.timerId_=null}setTimer_(){if(this.clearTimer_(),this.interval_<=0)return;const o=this.doc_.defaultView;o&&(this.timerId_=o.setInterval(this.onTick_,this.interval_))}onTick_(){this.disabled_||this.emitter.emit("tick",{sender:this})}}class Bi{constructor(o){this.onValueChange_=this.onValueChange_.bind(this),this.reader=o.reader,this.writer=o.writer,this.emitter=new w,this.value=o.value,this.value.emitter.on("change",this.onValueChange_),this.target=o.target,this.read()}read(){const o=this.target.read();o!==void 0&&(this.value.rawValue=this.reader(o))}write_(o){this.writer(this.target,o)}onValueChange_(o){this.write_(o.rawValue),this.emitter.emit("change",{options:o.options,rawValue:o.rawValue,sender:this})}}function wt(h,o){for(;h.length<o;)h.push(void 0)}function ln(h){const o=[];return wt(o,h),ee(o)}function cn(h){const o=h.indexOf(void 0);return o<0?h:h.slice(0,o)}function Yt(h,o){const l=[...cn(h),o];return l.length>h.length?l.splice(0,l.length-h.length):wt(l,h.length),l}class Kt{constructor(o){this.onTick_=this.onTick_.bind(this),this.reader_=o.reader,this.target=o.target,this.emitter=new w,this.value=o.value,this.ticker=o.ticker,this.ticker.emitter.on("tick",this.onTick_),this.read()}dispose(){this.ticker.dispose()}read(){const o=this.target.read();if(o===void 0)return;const l=this.value.rawValue,p=this.reader_(o);this.value.rawValue=Yt(l,p),this.emitter.emit("update",{rawValue:p,sender:this})}onTick_(o){this.read()}}class Yn{constructor(o){this.constraints=o}constrain(o){return this.constraints.reduce((l,p)=>p.constrain(l),o)}}function qt(h,o){if(h instanceof o)return h;if(h instanceof Yn){const l=h.constraints.reduce((p,S)=>p||(S instanceof o?S:null),null);if(l)return l}return null}class ds{constructor(o){this.values=z.fromObject({max:o.max,min:o.min})}constrain(o){const l=this.values.get("max"),p=this.values.get("min");return Math.min(Math.max(o,p),l)}}class or{constructor(o){this.values=z.fromObject({options:o})}get options(){return this.values.get("options")}constrain(o){const l=this.values.get("options");return l.length===0||l.filter(S=>S.value===o).length>0?o:l[0].value}}class dh{constructor(o){this.values=z.fromObject({max:o.max,min:o.min})}get maxValue(){return this.values.get("max")}get minValue(){return this.values.get("min")}constrain(o){const l=this.values.get("max"),p=this.values.get("min");let S=o;return m(p)||(S=Math.max(S,p)),m(l)||(S=Math.min(S,l)),S}}class Xr{constructor(o,l=0){this.step=o,this.origin=l}constrain(o){const l=this.origin%this.step,p=Math.round((o-l)/this.step);return l+p*this.step}}const Sa=M("lst");class gf{constructor(o,l){this.onValueChange_=this.onValueChange_.bind(this),this.props_=l.props,this.element=o.createElement("div"),this.element.classList.add(Sa()),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("select");p.classList.add(Sa("s")),l.viewProps.bindDisabled(p),this.element.appendChild(p),this.selectElement=p;const S=o.createElement("div");S.classList.add(Sa("m")),S.appendChild(se(o,"dropdown")),this.element.appendChild(S),l.value.emitter.on("change",this.onValueChange_),this.value_=l.value,U(this.props_,"options",B=>{De(this.selectElement),B.forEach(W=>{const de=o.createElement("option");de.textContent=W.text,this.selectElement.appendChild(de)}),this.update_()})}update_(){const o=this.props_.get("options").map(l=>l.value);this.selectElement.selectedIndex=o.indexOf(this.value_.rawValue)}onValueChange_(){this.update_()}}class ar{constructor(o,l){this.onSelectChange_=this.onSelectChange_.bind(this),this.props=l.props,this.value=l.value,this.viewProps=l.viewProps,this.view=new gf(o,{props:this.props,value:this.value,viewProps:this.viewProps}),this.view.selectElement.addEventListener("change",this.onSelectChange_)}onSelectChange_(o){const l=o.currentTarget;this.value.rawValue=this.props.get("options")[l.selectedIndex].value}}const ph=M("pop");class vf{constructor(o,l){this.element=o.createElement("div"),this.element.classList.add(ph()),l.viewProps.bindClassModifiers(this.element),O(l.shows,A(this.element,ph(void 0,"v")))}}class fh{constructor(o,l){this.shows=ee(!1),this.viewProps=l.viewProps,this.view=new vf(o,{shows:this.shows,viewProps:this.viewProps})}}const mh=M("txt");class _f{constructor(o,l){this.onChange_=this.onChange_.bind(this),this.element=o.createElement("div"),this.element.classList.add(mh()),l.viewProps.bindClassModifiers(this.element),this.props_=l.props,this.props_.emitter.on("change",this.onChange_);const p=o.createElement("input");p.classList.add(mh("i")),p.type="text",l.viewProps.bindDisabled(p),this.element.appendChild(p),this.inputElement=p,l.value.emitter.on("change",this.onChange_),this.value_=l.value,this.refresh()}refresh(){const o=this.props_.get("formatter");this.inputElement.value=o(this.value_.rawValue)}onChange_(){this.refresh()}}class Yr{constructor(o,l){this.onInputChange_=this.onInputChange_.bind(this),this.parser_=l.parser,this.props=l.props,this.value=l.value,this.viewProps=l.viewProps,this.view=new _f(o,{props:l.props,value:this.value,viewProps:this.viewProps}),this.view.inputElement.addEventListener("change",this.onInputChange_)}onInputChange_(o){const p=o.currentTarget.value,S=this.parser_(p);m(S)||(this.value.rawValue=S),this.view.refresh()}}function xf(h){return String(h)}function gh(h){return h==="false"?!1:!!h}function vh(h){return xf(h)}class bf{constructor(o){this.text=o}evaluate(){return Number(this.text)}toString(){return this.text}}const yf={"**":(h,o)=>Math.pow(h,o),"*":(h,o)=>h*o,"/":(h,o)=>h/o,"%":(h,o)=>h%o,"+":(h,o)=>h+o,"-":(h,o)=>h-o,"<<":(h,o)=>h<<o,">>":(h,o)=>h>>o,">>>":(h,o)=>h>>>o,"&":(h,o)=>h&o,"^":(h,o)=>h^o,"|":(h,o)=>h|o};class wf{constructor(o,l,p){this.left=l,this.operator=o,this.right=p}evaluate(){const o=yf[this.operator];if(!o)throw new Error(`unexpected binary operator: '${this.operator}`);return o(this.left.evaluate(),this.right.evaluate())}toString(){return["b(",this.left.toString(),this.operator,this.right.toString(),")"].join(" ")}}const Sf={"+":h=>h,"-":h=>-h,"~":h=>~h};class Mf{constructor(o,l){this.operator=o,this.expression=l}evaluate(){const o=Sf[this.operator];if(!o)throw new Error(`unexpected unary operator: '${this.operator}`);return o(this.expression.evaluate())}toString(){return["u(",this.operator,this.expression.toString(),")"].join(" ")}}function Ma(h){return(o,l)=>{for(let p=0;p<h.length;p++){const S=h[p](o,l);if(S!=="")return S}return""}}function lr(h,o){var l;const p=h.substr(o).match(/^\s+/);return(l=p&&p[0])!==null&&l!==void 0?l:""}function Ef(h,o){const l=h.substr(o,1);return l.match(/^[1-9]$/)?l:""}function cr(h,o){var l;const p=h.substr(o).match(/^[0-9]+/);return(l=p&&p[0])!==null&&l!==void 0?l:""}function Af(h,o){const l=cr(h,o);if(l!=="")return l;const p=h.substr(o,1);if(o+=1,p!=="-"&&p!=="+")return"";const S=cr(h,o);return S===""?"":p+S}function Ea(h,o){const l=h.substr(o,1);if(o+=1,l.toLowerCase()!=="e")return"";const p=Af(h,o);return p===""?"":l+p}function _h(h,o){const l=h.substr(o,1);if(l==="0")return l;const p=Ef(h,o);return o+=p.length,p===""?"":p+cr(h,o)}function Cf(h,o){const l=_h(h,o);if(o+=l.length,l==="")return"";const p=h.substr(o,1);if(o+=p.length,p!==".")return"";const S=cr(h,o);return o+=S.length,l+p+S+Ea(h,o)}function Tf(h,o){const l=h.substr(o,1);if(o+=l.length,l!==".")return"";const p=cr(h,o);return o+=p.length,p===""?"":l+p+Ea(h,o)}function Rf(h,o){const l=_h(h,o);return o+=l.length,l===""?"":l+Ea(h,o)}const Pf=Ma([Cf,Tf,Rf]);function Lf(h,o){var l;const p=h.substr(o).match(/^[01]+/);return(l=p&&p[0])!==null&&l!==void 0?l:""}function If(h,o){const l=h.substr(o,2);if(o+=l.length,l.toLowerCase()!=="0b")return"";const p=Lf(h,o);return p===""?"":l+p}function Df(h,o){var l;const p=h.substr(o).match(/^[0-7]+/);return(l=p&&p[0])!==null&&l!==void 0?l:""}function Uf(h,o){const l=h.substr(o,2);if(o+=l.length,l.toLowerCase()!=="0o")return"";const p=Df(h,o);return p===""?"":l+p}function Nf(h,o){var l;const p=h.substr(o).match(/^[0-9a-f]+/i);return(l=p&&p[0])!==null&&l!==void 0?l:""}function Of(h,o){const l=h.substr(o,2);if(o+=l.length,l.toLowerCase()!=="0x")return"";const p=Nf(h,o);return p===""?"":l+p}const Ff=Ma([If,Uf,Of]),Bf=Ma([Ff,Pf]);function kf(h,o){const l=Bf(h,o);return o+=l.length,l===""?null:{evaluable:new bf(l),cursor:o}}function zf(h,o){const l=h.substr(o,1);if(o+=l.length,l!=="(")return null;const p=bh(h,o);if(!p)return null;o=p.cursor,o+=lr(h,o).length;const S=h.substr(o,1);return o+=S.length,S!==")"?null:{evaluable:p.evaluable,cursor:o}}function Vf(h,o){var l;return(l=kf(h,o))!==null&&l!==void 0?l:zf(h,o)}function xh(h,o){const l=Vf(h,o);if(l)return l;const p=h.substr(o,1);if(o+=p.length,p!=="+"&&p!=="-"&&p!=="~")return null;const S=xh(h,o);return S?(o=S.cursor,{cursor:o,evaluable:new Mf(p,S.evaluable)}):null}function Gf(h,o,l){l+=lr(o,l).length;const p=h.filter(S=>o.startsWith(S,l))[0];return p?(l+=p.length,l+=lr(o,l).length,{cursor:l,operator:p}):null}function Hf(h,o){return(l,p)=>{const S=h(l,p);if(!S)return null;p=S.cursor;let B=S.evaluable;for(;;){const W=Gf(o,l,p);if(!W)break;p=W.cursor;const de=h(l,p);if(!de)return null;p=de.cursor,B=new wf(W.operator,B,de.evaluable)}return B?{cursor:p,evaluable:B}:null}}const Wf=[["**"],["*","/","%"],["+","-"],["<<",">>>",">>"],["&"],["^"],["|"]].reduce((h,o)=>Hf(h,o),xh);function bh(h,o){return o+=lr(h,o).length,Wf(h,o)}function Xf(h){const o=bh(h,0);return!o||o.cursor+lr(h,o.cursor).length!==h.length?null:o.evaluable}function qn(h){var o;const l=Xf(h);return(o=l==null?void 0:l.evaluate())!==null&&o!==void 0?o:null}function yh(h){if(typeof h=="number")return h;if(typeof h=="string"){const o=qn(h);if(!m(o))return o}return 0}function Yf(h){return String(h)}function jt(h){return o=>o.toFixed(Math.max(Math.min(h,20),0))}const qf=jt(0);function qr(h){return qf(h)+"%"}function wh(h){return String(h)}function Aa(h){return h}function hr({primary:h,secondary:o,forward:l,backward:p}){let S=!1;function B(W){S||(S=!0,W(),S=!1)}h.emitter.on("change",W=>{B(()=>{o.setRawValue(l(h,o),W.options)})}),o.emitter.on("change",W=>{B(()=>{h.setRawValue(p(h,o),W.options)}),B(()=>{o.setRawValue(l(h,o),W.options)})}),B(()=>{o.setRawValue(l(h,o),{forceEmit:!1,last:!0})})}function hn(h,o){const l=h*(o.altKey?.1:1)*(o.shiftKey?10:1);return o.upKey?+l:o.downKey?-l:0}function ur(h){return{altKey:h.altKey,downKey:h.key==="ArrowDown",shiftKey:h.shiftKey,upKey:h.key==="ArrowUp"}}function jn(h){return{altKey:h.altKey,downKey:h.key==="ArrowLeft",shiftKey:h.shiftKey,upKey:h.key==="ArrowRight"}}function jf(h){return h==="ArrowUp"||h==="ArrowDown"}function Sh(h){return jf(h)||h==="ArrowLeft"||h==="ArrowRight"}function Ca(h,o){var l,p;const S=o.ownerDocument.defaultView,B=o.getBoundingClientRect();return{x:h.pageX-(((l=S&&S.scrollX)!==null&&l!==void 0?l:0)+B.left),y:h.pageY-(((p=S&&S.scrollY)!==null&&p!==void 0?p:0)+B.top)}}class ki{constructor(o){this.lastTouch_=null,this.onDocumentMouseMove_=this.onDocumentMouseMove_.bind(this),this.onDocumentMouseUp_=this.onDocumentMouseUp_.bind(this),this.onMouseDown_=this.onMouseDown_.bind(this),this.onTouchEnd_=this.onTouchEnd_.bind(this),this.onTouchMove_=this.onTouchMove_.bind(this),this.onTouchStart_=this.onTouchStart_.bind(this),this.elem_=o,this.emitter=new w,o.addEventListener("touchstart",this.onTouchStart_,{passive:!1}),o.addEventListener("touchmove",this.onTouchMove_,{passive:!0}),o.addEventListener("touchend",this.onTouchEnd_),o.addEventListener("mousedown",this.onMouseDown_)}computePosition_(o){const l=this.elem_.getBoundingClientRect();return{bounds:{width:l.width,height:l.height},point:o?{x:o.x,y:o.y}:null}}onMouseDown_(o){var l;o.preventDefault(),(l=o.currentTarget)===null||l===void 0||l.focus();const p=this.elem_.ownerDocument;p.addEventListener("mousemove",this.onDocumentMouseMove_),p.addEventListener("mouseup",this.onDocumentMouseUp_),this.emitter.emit("down",{altKey:o.altKey,data:this.computePosition_(Ca(o,this.elem_)),sender:this,shiftKey:o.shiftKey})}onDocumentMouseMove_(o){this.emitter.emit("move",{altKey:o.altKey,data:this.computePosition_(Ca(o,this.elem_)),sender:this,shiftKey:o.shiftKey})}onDocumentMouseUp_(o){const l=this.elem_.ownerDocument;l.removeEventListener("mousemove",this.onDocumentMouseMove_),l.removeEventListener("mouseup",this.onDocumentMouseUp_),this.emitter.emit("up",{altKey:o.altKey,data:this.computePosition_(Ca(o,this.elem_)),sender:this,shiftKey:o.shiftKey})}onTouchStart_(o){o.preventDefault();const l=o.targetTouches.item(0),p=this.elem_.getBoundingClientRect();this.emitter.emit("down",{altKey:o.altKey,data:this.computePosition_(l?{x:l.clientX-p.left,y:l.clientY-p.top}:void 0),sender:this,shiftKey:o.shiftKey}),this.lastTouch_=l}onTouchMove_(o){const l=o.targetTouches.item(0),p=this.elem_.getBoundingClientRect();this.emitter.emit("move",{altKey:o.altKey,data:this.computePosition_(l?{x:l.clientX-p.left,y:l.clientY-p.top}:void 0),sender:this,shiftKey:o.shiftKey}),this.lastTouch_=l}onTouchEnd_(o){var l;const p=(l=o.targetTouches.item(0))!==null&&l!==void 0?l:this.lastTouch_,S=this.elem_.getBoundingClientRect();this.emitter.emit("up",{altKey:o.altKey,data:this.computePosition_(p?{x:p.clientX-S.left,y:p.clientY-S.top}:void 0),sender:this,shiftKey:o.shiftKey})}}function Ct(h,o,l,p,S){const B=(h-o)/(l-o);return p+B*(S-p)}function Mh(h){return String(h.toFixed(10)).split(".")[1].replace(/0+$/,"").length}function kt(h,o,l){return Math.min(Math.max(h,o),l)}function Eh(h,o){return(h%o+o)%o}const En=M("txt");class $f{constructor(o,l){this.onChange_=this.onChange_.bind(this),this.props_=l.props,this.props_.emitter.on("change",this.onChange_),this.element=o.createElement("div"),this.element.classList.add(En(),En(void 0,"num")),l.arrayPosition&&this.element.classList.add(En(void 0,l.arrayPosition)),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("input");p.classList.add(En("i")),p.type="text",l.viewProps.bindDisabled(p),this.element.appendChild(p),this.inputElement=p,this.onDraggingChange_=this.onDraggingChange_.bind(this),this.dragging_=l.dragging,this.dragging_.emitter.on("change",this.onDraggingChange_),this.element.classList.add(En()),this.inputElement.classList.add(En("i"));const S=o.createElement("div");S.classList.add(En("k")),this.element.appendChild(S),this.knobElement=S;const B=o.createElementNS(Ne,"svg");B.classList.add(En("g")),this.knobElement.appendChild(B);const W=o.createElementNS(Ne,"path");W.classList.add(En("gb")),B.appendChild(W),this.guideBodyElem_=W;const de=o.createElementNS(Ne,"path");de.classList.add(En("gh")),B.appendChild(de),this.guideHeadElem_=de;const Ge=o.createElement("div");Ge.classList.add(M("tt")()),this.knobElement.appendChild(Ge),this.tooltipElem_=Ge,l.value.emitter.on("change",this.onChange_),this.value=l.value,this.refresh()}onDraggingChange_(o){if(o.rawValue===null){this.element.classList.remove(En(void 0,"drg"));return}this.element.classList.add(En(void 0,"drg"));const l=o.rawValue/this.props_.get("draggingScale"),p=l+(l>0?-1:l<0?1:0),S=kt(-p,-4,4);this.guideHeadElem_.setAttributeNS(null,"d",[`M ${p+S},0 L${p},4 L${p+S},8`,`M ${l},-1 L${l},9`].join(" ")),this.guideBodyElem_.setAttributeNS(null,"d",`M 0,4 L${l},4`);const B=this.props_.get("formatter");this.tooltipElem_.textContent=B(this.value.rawValue),this.tooltipElem_.style.left=`${l}px`}refresh(){const o=this.props_.get("formatter");this.inputElement.value=o(this.value.rawValue)}onChange_(){this.refresh()}}class dr{constructor(o,l){var p;this.originRawValue_=0,this.onInputChange_=this.onInputChange_.bind(this),this.onInputKeyDown_=this.onInputKeyDown_.bind(this),this.onInputKeyUp_=this.onInputKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.baseStep_=l.baseStep,this.parser_=l.parser,this.props=l.props,this.sliderProps_=(p=l.sliderProps)!==null&&p!==void 0?p:null,this.value=l.value,this.viewProps=l.viewProps,this.dragging_=ee(null),this.view=new $f(o,{arrayPosition:l.arrayPosition,dragging:this.dragging_,props:this.props,value:this.value,viewProps:this.viewProps}),this.view.inputElement.addEventListener("change",this.onInputChange_),this.view.inputElement.addEventListener("keydown",this.onInputKeyDown_),this.view.inputElement.addEventListener("keyup",this.onInputKeyUp_);const S=new ki(this.view.knobElement);S.emitter.on("down",this.onPointerDown_),S.emitter.on("move",this.onPointerMove_),S.emitter.on("up",this.onPointerUp_)}constrainValue_(o){var l,p;const S=(l=this.sliderProps_)===null||l===void 0?void 0:l.get("minValue"),B=(p=this.sliderProps_)===null||p===void 0?void 0:p.get("maxValue");let W=o;return S!==void 0&&(W=Math.max(W,S)),B!==void 0&&(W=Math.min(W,B)),W}onInputChange_(o){const p=o.currentTarget.value,S=this.parser_(p);m(S)||(this.value.rawValue=this.constrainValue_(S)),this.view.refresh()}onInputKeyDown_(o){const l=hn(this.baseStep_,ur(o));l!==0&&this.value.setRawValue(this.constrainValue_(this.value.rawValue+l),{forceEmit:!1,last:!1})}onInputKeyUp_(o){hn(this.baseStep_,ur(o))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}onPointerDown_(){this.originRawValue_=this.value.rawValue,this.dragging_.rawValue=0}computeDraggingValue_(o){if(!o.point)return null;const l=o.point.x-o.bounds.width/2;return this.constrainValue_(this.originRawValue_+l*this.props.get("draggingScale"))}onPointerMove_(o){const l=this.computeDraggingValue_(o.data);l!==null&&(this.value.setRawValue(l,{forceEmit:!1,last:!1}),this.dragging_.rawValue=this.value.rawValue-this.originRawValue_)}onPointerUp_(o){const l=this.computeDraggingValue_(o.data);l!==null&&(this.value.setRawValue(l,{forceEmit:!0,last:!0}),this.dragging_.rawValue=null)}}const Ta=M("sld");class Kf{constructor(o,l){this.onChange_=this.onChange_.bind(this),this.props_=l.props,this.props_.emitter.on("change",this.onChange_),this.element=o.createElement("div"),this.element.classList.add(Ta()),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("div");p.classList.add(Ta("t")),l.viewProps.bindTabIndex(p),this.element.appendChild(p),this.trackElement=p;const S=o.createElement("div");S.classList.add(Ta("k")),this.trackElement.appendChild(S),this.knobElement=S,l.value.emitter.on("change",this.onChange_),this.value=l.value,this.update_()}update_(){const o=kt(Ct(this.value.rawValue,this.props_.get("minValue"),this.props_.get("maxValue"),0,100),0,100);this.knobElement.style.width=`${o}%`}onChange_(){this.update_()}}class Zf{constructor(o,l){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDownOrMove_=this.onPointerDownOrMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.baseStep_=l.baseStep,this.value=l.value,this.viewProps=l.viewProps,this.props=l.props,this.view=new Kf(o,{props:this.props,value:this.value,viewProps:this.viewProps}),this.ptHandler_=new ki(this.view.trackElement),this.ptHandler_.emitter.on("down",this.onPointerDownOrMove_),this.ptHandler_.emitter.on("move",this.onPointerDownOrMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.trackElement.addEventListener("keydown",this.onKeyDown_),this.view.trackElement.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(o,l){o.point&&this.value.setRawValue(Ct(kt(o.point.x,0,o.bounds.width),0,o.bounds.width,this.props.get("minValue"),this.props.get("maxValue")),l)}onPointerDownOrMove_(o){this.handlePointerEvent_(o.data,{forceEmit:!1,last:!1})}onPointerUp_(o){this.handlePointerEvent_(o.data,{forceEmit:!0,last:!0})}onKeyDown_(o){const l=hn(this.baseStep_,jn(o));l!==0&&this.value.setRawValue(this.value.rawValue+l,{forceEmit:!1,last:!1})}onKeyUp_(o){hn(this.baseStep_,jn(o))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}const Ra=M("sldtxt");class Jf{constructor(o,l){this.element=o.createElement("div"),this.element.classList.add(Ra());const p=o.createElement("div");p.classList.add(Ra("s")),this.sliderView_=l.sliderView,p.appendChild(this.sliderView_.element),this.element.appendChild(p);const S=o.createElement("div");S.classList.add(Ra("t")),this.textView_=l.textView,S.appendChild(this.textView_.element),this.element.appendChild(S)}}class Pa{constructor(o,l){this.value=l.value,this.viewProps=l.viewProps,this.sliderC_=new Zf(o,{baseStep:l.baseStep,props:l.sliderProps,value:l.value,viewProps:this.viewProps}),this.textC_=new dr(o,{baseStep:l.baseStep,parser:l.parser,props:l.textProps,sliderProps:l.sliderProps,value:l.value,viewProps:l.viewProps}),this.view=new Jf(o,{sliderView:this.sliderC_.view,textView:this.textC_.view})}get sliderController(){return this.sliderC_}get textController(){return this.textC_}}function pr(h,o){h.write(o)}function jr(h){const o=Y;if(Array.isArray(h))return o.required.array(o.required.object({text:o.required.string,value:o.required.raw}))(h).value;if(typeof h=="object")return o.required.raw(h).value}function Ah(h){if(h==="inline"||h==="popup")return h}function di(h){const o=Y;return o.required.object({max:o.optional.number,min:o.optional.number,step:o.optional.number})(h).value}function Ch(h){if(Array.isArray(h))return h;const o=[];return Object.keys(h).forEach(l=>{o.push({text:l,value:h[l]})}),o}function La(h){return m(h)?null:new or(Ch(h))}function Qf(h){const o=h?qt(h,Xr):null;return o?o.step:null}function $r(h,o){const l=h&&qt(h,Xr);return l?Mh(l.step):Math.max(Mh(o),2)}function ps(h){const o=Qf(h);return o??1}function fs(h,o){var l;const p=h&&qt(h,Xr),S=Math.abs((l=p==null?void 0:p.step)!==null&&l!==void 0?l:o);return S===0?.1:Math.pow(10,Math.floor(Math.log10(S))-1)}const Kr=M("ckb");class em{constructor(o,l){this.onValueChange_=this.onValueChange_.bind(this),this.element=o.createElement("div"),this.element.classList.add(Kr()),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("label");p.classList.add(Kr("l")),this.element.appendChild(p);const S=o.createElement("input");S.classList.add(Kr("i")),S.type="checkbox",p.appendChild(S),this.inputElement=S,l.viewProps.bindDisabled(this.inputElement);const B=o.createElement("div");B.classList.add(Kr("w")),p.appendChild(B);const W=se(o,"check");B.appendChild(W),l.value.emitter.on("change",this.onValueChange_),this.value=l.value,this.update_()}update_(){this.inputElement.checked=this.value.rawValue}onValueChange_(){this.update_()}}class tm{constructor(o,l){this.onInputChange_=this.onInputChange_.bind(this),this.value=l.value,this.viewProps=l.viewProps,this.view=new em(o,{value:this.value,viewProps:this.viewProps}),this.view.inputElement.addEventListener("change",this.onInputChange_)}onInputChange_(o){const l=o.currentTarget;this.value.rawValue=l.checked}}function nm(h){const o=[],l=La(h.options);return l&&o.push(l),new Yn(o)}const im={id:"input-bool",type:"input",accept:(h,o)=>{if(typeof h!="boolean")return null;const p=ae(o,{options:Y.optional.custom(jr)});return p?{initialValue:h,params:p}:null},binding:{reader:h=>gh,constraint:h=>nm(h.params),writer:h=>pr},controller:h=>{const o=h.document,l=h.value,p=h.constraint,S=p&&qt(p,or);return S?new ar(o,{props:new z({options:S.values.value("options")}),value:l,viewProps:h.viewProps}):new tm(o,{value:l,viewProps:h.viewProps})}},zi=M("col");class sm{constructor(o,l){this.element=o.createElement("div"),this.element.classList.add(zi()),l.foldable.bindExpandedClass(this.element,zi(void 0,"expanded")),U(l.foldable,"completed",A(this.element,zi(void 0,"cpl")));const p=o.createElement("div");p.classList.add(zi("h")),this.element.appendChild(p);const S=o.createElement("div");S.classList.add(zi("s")),p.appendChild(S),this.swatchElement=S;const B=o.createElement("div");if(B.classList.add(zi("t")),p.appendChild(B),this.textElement=B,l.pickerLayout==="inline"){const W=o.createElement("div");W.classList.add(zi("p")),this.element.appendChild(W),this.pickerElement=W}else this.pickerElement=null}}function rm(h,o,l){const p=kt(h/255,0,1),S=kt(o/255,0,1),B=kt(l/255,0,1),W=Math.max(p,S,B),de=Math.min(p,S,B),Ge=W-de;let We=0,mt=0;const xt=(de+W)/2;return Ge!==0&&(mt=Ge/(1-Math.abs(W+de-1)),p===W?We=(S-B)/Ge:S===W?We=2+(B-p)/Ge:We=4+(p-S)/Ge,We=We/6+(We<0?1:0)),[We*360,mt*100,xt*100]}function om(h,o,l){const p=(h%360+360)%360,S=kt(o/100,0,1),B=kt(l/100,0,1),W=(1-Math.abs(2*B-1))*S,de=W*(1-Math.abs(p/60%2-1)),Ge=B-W/2;let We,mt,xt;return p>=0&&p<60?[We,mt,xt]=[W,de,0]:p>=60&&p<120?[We,mt,xt]=[de,W,0]:p>=120&&p<180?[We,mt,xt]=[0,W,de]:p>=180&&p<240?[We,mt,xt]=[0,de,W]:p>=240&&p<300?[We,mt,xt]=[de,0,W]:[We,mt,xt]=[W,0,de],[(We+Ge)*255,(mt+Ge)*255,(xt+Ge)*255]}function am(h,o,l){const p=kt(h/255,0,1),S=kt(o/255,0,1),B=kt(l/255,0,1),W=Math.max(p,S,B),de=Math.min(p,S,B),Ge=W-de;let We;Ge===0?We=0:W===p?We=60*(((S-B)/Ge%6+6)%6):W===S?We=60*((B-p)/Ge+2):We=60*((p-S)/Ge+4);const mt=W===0?0:Ge/W,xt=W;return[We,mt*100,xt*100]}function Th(h,o,l){const p=Eh(h,360),S=kt(o/100,0,1),B=kt(l/100,0,1),W=B*S,de=W*(1-Math.abs(p/60%2-1)),Ge=B-W;let We,mt,xt;return p>=0&&p<60?[We,mt,xt]=[W,de,0]:p>=60&&p<120?[We,mt,xt]=[de,W,0]:p>=120&&p<180?[We,mt,xt]=[0,W,de]:p>=180&&p<240?[We,mt,xt]=[0,de,W]:p>=240&&p<300?[We,mt,xt]=[de,0,W]:[We,mt,xt]=[W,0,de],[(We+Ge)*255,(mt+Ge)*255,(xt+Ge)*255]}function lm(h,o,l){const p=l+o*(100-Math.abs(2*l-100))/200;return[h,p!==0?o*(100-Math.abs(2*l-100))/p:0,l+o*(100-Math.abs(2*l-100))/(2*100)]}function cm(h,o,l){const p=100-Math.abs(l*(200-o)/100-100);return[h,p!==0?o*l/p:0,l*(200-o)/(2*100)]}function Vi(h){return[h[0],h[1],h[2]]}function Rh(h,o){return[h[0],h[1],h[2],o]}const hm={hsl:{hsl:(h,o,l)=>[h,o,l],hsv:lm,rgb:om},hsv:{hsl:cm,hsv:(h,o,l)=>[h,o,l],rgb:Th},rgb:{hsl:rm,hsv:am,rgb:(h,o,l)=>[h,o,l]}};function Zr(h,o){return[o==="float"?1:h==="rgb"?255:360,o==="float"?1:h==="rgb"?255:100,o==="float"?1:h==="rgb"?255:100]}function um(h,o){return h===o?o:Eh(h,o)}function dm(h,o,l){var p;const S=Zr(o,l);return[o==="rgb"?kt(h[0],0,S[0]):um(h[0],S[0]),kt(h[1],0,S[1]),kt(h[2],0,S[2]),kt((p=h[3])!==null&&p!==void 0?p:1,0,1)]}function Ph(h,o,l,p){const S=Zr(o,l),B=Zr(o,p);return h.map((W,de)=>W/S[de]*B[de])}function pm(h,o,l){const p=Ph(h,o.mode,o.type,"int"),S=hm[o.mode][l.mode](...p);return Ph(S,l.mode,"int",l.type)}function Jr(h,o){return typeof h!="object"||m(h)?!1:o in h&&typeof h[o]=="number"}class at{static black(o="int"){return new at([0,0,0],"rgb",o)}static fromObject(o,l="int"){const p="a"in o?[o.r,o.g,o.b,o.a]:[o.r,o.g,o.b];return new at(p,"rgb",l)}static toRgbaObject(o,l="int"){return o.toRgbaObject(l)}static isRgbColorObject(o){return Jr(o,"r")&&Jr(o,"g")&&Jr(o,"b")}static isRgbaColorObject(o){return this.isRgbColorObject(o)&&Jr(o,"a")}static isColorObject(o){return this.isRgbColorObject(o)}static equals(o,l){if(o.mode!==l.mode)return!1;const p=o.comps_,S=l.comps_;for(let B=0;B<p.length;B++)if(p[B]!==S[B])return!1;return!0}constructor(o,l,p="int"){this.mode=l,this.type=p,this.comps_=dm(o,l,p)}getComponents(o,l="int"){return Rh(pm(Vi(this.comps_),{mode:this.mode,type:this.type},{mode:o??this.mode,type:l}),this.comps_[3])}toRgbaObject(o="int"){const l=this.getComponents("rgb",o);return{r:l[0],g:l[1],b:l[2],a:l[3]}}}const pi=M("colp");class fm{constructor(o,l){this.alphaViews_=null,this.element=o.createElement("div"),this.element.classList.add(pi()),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("div");p.classList.add(pi("hsv"));const S=o.createElement("div");S.classList.add(pi("sv")),this.svPaletteView_=l.svPaletteView,S.appendChild(this.svPaletteView_.element),p.appendChild(S);const B=o.createElement("div");B.classList.add(pi("h")),this.hPaletteView_=l.hPaletteView,B.appendChild(this.hPaletteView_.element),p.appendChild(B),this.element.appendChild(p);const W=o.createElement("div");if(W.classList.add(pi("rgb")),this.textView_=l.textView,W.appendChild(this.textView_.element),this.element.appendChild(W),l.alphaViews){this.alphaViews_={palette:l.alphaViews.palette,text:l.alphaViews.text};const de=o.createElement("div");de.classList.add(pi("a"));const Ge=o.createElement("div");Ge.classList.add(pi("ap")),Ge.appendChild(this.alphaViews_.palette.element),de.appendChild(Ge);const We=o.createElement("div");We.classList.add(pi("at")),We.appendChild(this.alphaViews_.text.element),de.appendChild(We),this.element.appendChild(de)}}get allFocusableElements(){const o=[this.svPaletteView_.element,this.hPaletteView_.element,this.textView_.modeSelectElement,...this.textView_.textViews.map(l=>l.inputElement)];return this.alphaViews_&&o.push(this.alphaViews_.palette.element,this.alphaViews_.text.inputElement),o}}function mm(h){return h==="int"?"int":h==="float"?"float":void 0}function Ia(h){const o=Y;return ae(h,{alpha:o.optional.boolean,color:o.optional.object({alpha:o.optional.boolean,type:o.optional.custom(mm)}),expanded:o.optional.boolean,picker:o.optional.custom(Ah)})}function Gi(h){return h?.1:1}function Hi(h){var o;return(o=h.color)===null||o===void 0?void 0:o.type}function gm(h,o){return h.alpha===o.alpha&&h.mode===o.mode&&h.notation===o.notation&&h.type===o.type}function An(h,o){const l=h.match(/^(.+)%$/);return Math.min(l?parseFloat(l[1])*.01*o:parseFloat(h),o)}const vm={deg:h=>h,grad:h=>h*360/400,rad:h=>h*360/(2*Math.PI),turn:h=>h*360};function Lh(h){const o=h.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);if(!o)return parseFloat(h);const l=parseFloat(o[1]),p=o[2];return vm[p](l)}function Ih(h){const o=h.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!o)return null;const l=[An(o[1],255),An(o[2],255),An(o[3],255)];return isNaN(l[0])||isNaN(l[1])||isNaN(l[2])?null:l}function Dh(h){return o=>{const l=Ih(o);return l?new at(l,"rgb",h):null}}function Uh(h){const o=h.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!o)return null;const l=[An(o[1],255),An(o[2],255),An(o[3],255),An(o[4],1)];return isNaN(l[0])||isNaN(l[1])||isNaN(l[2])||isNaN(l[3])?null:l}function Nh(h){return o=>{const l=Uh(o);return l?new at(l,"rgb",h):null}}function Oh(h){const o=h.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!o)return null;const l=[Lh(o[1]),An(o[2],100),An(o[3],100)];return isNaN(l[0])||isNaN(l[1])||isNaN(l[2])?null:l}function Fh(h){return o=>{const l=Oh(o);return l?new at(l,"hsl",h):null}}function Bh(h){const o=h.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);if(!o)return null;const l=[Lh(o[1]),An(o[2],100),An(o[3],100),An(o[4],1)];return isNaN(l[0])||isNaN(l[1])||isNaN(l[2])||isNaN(l[3])?null:l}function kh(h){return o=>{const l=Bh(o);return l?new at(l,"hsl",h):null}}function zh(h){const o=h.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);if(o)return[parseInt(o[1]+o[1],16),parseInt(o[2]+o[2],16),parseInt(o[3]+o[3],16)];const l=h.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);return l?[parseInt(l[1],16),parseInt(l[2],16),parseInt(l[3],16)]:null}function _m(h){const o=zh(h);return o?new at(o,"rgb","int"):null}function Vh(h){const o=h.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);if(o)return[parseInt(o[1]+o[1],16),parseInt(o[2]+o[2],16),parseInt(o[3]+o[3],16),Ct(parseInt(o[4]+o[4],16),0,255,0,1)];const l=h.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);return l?[parseInt(l[1],16),parseInt(l[2],16),parseInt(l[3],16),Ct(parseInt(l[4],16),0,255,0,1)]:null}function xm(h){const o=Vh(h);return o?new at(o,"rgb","int"):null}function Gh(h){const o=h.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);if(!o)return null;const l=[parseFloat(o[1]),parseFloat(o[2]),parseFloat(o[3])];return isNaN(l[0])||isNaN(l[1])||isNaN(l[2])?null:l}function Hh(h){return o=>{const l=Gh(o);return l?new at(l,"rgb",h):null}}function Wh(h){const o=h.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);if(!o)return null;const l=[parseFloat(o[1]),parseFloat(o[2]),parseFloat(o[3]),parseFloat(o[4])];return isNaN(l[0])||isNaN(l[1])||isNaN(l[2])||isNaN(l[3])?null:l}function Xh(h){return o=>{const l=Wh(o);return l?new at(l,"rgb",h):null}}const bm=[{parser:zh,result:{alpha:!1,mode:"rgb",notation:"hex"}},{parser:Vh,result:{alpha:!0,mode:"rgb",notation:"hex"}},{parser:Ih,result:{alpha:!1,mode:"rgb",notation:"func"}},{parser:Uh,result:{alpha:!0,mode:"rgb",notation:"func"}},{parser:Oh,result:{alpha:!1,mode:"hsl",notation:"func"}},{parser:Bh,result:{alpha:!0,mode:"hsl",notation:"func"}},{parser:Gh,result:{alpha:!1,mode:"rgb",notation:"object"}},{parser:Wh,result:{alpha:!0,mode:"rgb",notation:"object"}}];function ym(h){return bm.reduce((o,{parser:l,result:p})=>o||(l(h)?p:null),null)}function Da(h,o="int"){const l=ym(h);return l?l.notation==="hex"&&o!=="float"?Object.assign(Object.assign({},l),{type:"int"}):l.notation==="func"?Object.assign(Object.assign({},l),{type:o}):null:null}const Yh={int:[_m,xm,Dh("int"),Nh("int"),Fh("int"),kh("int"),Hh("int"),Xh("int")],float:[Dh("float"),Nh("float"),Fh("float"),kh("float"),Hh("float"),Xh("float")]};function wm(h){const o=Yh[h];return l=>{if(typeof l!="string")return at.black(h);const p=o.reduce((S,B)=>S||B(l),null);return p??at.black(h)}}function Ua(h){const o=Yh[h];return l=>o.reduce((p,S)=>p||S(l),null)}function qh(h){const o=kt(Math.floor(h),0,255).toString(16);return o.length===1?`0${o}`:o}function jh(h,o="#"){const l=Vi(h.getComponents("rgb")).map(qh).join("");return`${o}${l}`}function Na(h,o="#"){const l=h.getComponents("rgb"),p=[l[0],l[1],l[2],l[3]*255].map(qh).join("");return`${o}${p}`}function $h(h,o){const l=jt(o==="float"?2:0);return`rgb(${Vi(h.getComponents("rgb",o)).map(S=>l(S)).join(", ")})`}function Sm(h){return o=>$h(o,h)}function Qr(h,o){const l=jt(2),p=jt(o==="float"?2:0);return`rgba(${h.getComponents("rgb",o).map((B,W)=>(W===3?l:p)(B)).join(", ")})`}function Mm(h){return o=>Qr(o,h)}function Em(h){const o=[jt(0),qr,qr];return`hsl(${Vi(h.getComponents("hsl")).map((p,S)=>o[S](p)).join(", ")})`}function Am(h){const o=[jt(0),qr,qr,jt(2)];return`hsla(${h.getComponents("hsl").map((p,S)=>o[S](p)).join(", ")})`}function Kh(h,o){const l=jt(o==="float"?2:0),p=["r","g","b"];return`{${Vi(h.getComponents("rgb",o)).map((B,W)=>`${p[W]}: ${l(B)}`).join(", ")}}`}function Cm(h){return o=>Kh(o,h)}function Zh(h,o){const l=jt(2),p=jt(o==="float"?2:0),S=["r","g","b","a"];return`{${h.getComponents("rgb",o).map((W,de)=>{const Ge=de===3?l:p;return`${S[de]}: ${Ge(W)}`}).join(", ")}}`}function Tm(h){return o=>Zh(o,h)}const Rm=[{format:{alpha:!1,mode:"rgb",notation:"hex",type:"int"},stringifier:jh},{format:{alpha:!0,mode:"rgb",notation:"hex",type:"int"},stringifier:Na},{format:{alpha:!1,mode:"hsl",notation:"func",type:"int"},stringifier:Em},{format:{alpha:!0,mode:"hsl",notation:"func",type:"int"},stringifier:Am},...["int","float"].reduce((h,o)=>[...h,{format:{alpha:!1,mode:"rgb",notation:"func",type:o},stringifier:Sm(o)},{format:{alpha:!0,mode:"rgb",notation:"func",type:o},stringifier:Mm(o)},{format:{alpha:!1,mode:"rgb",notation:"object",type:o},stringifier:Cm(o)},{format:{alpha:!0,mode:"rgb",notation:"object",type:o},stringifier:Tm(o)}],[])];function Oa(h){return Rm.reduce((o,l)=>o||(gm(l.format,h)?l.stringifier:null),null)}const fr=M("apl");class Pm{constructor(o,l){this.onValueChange_=this.onValueChange_.bind(this),this.value=l.value,this.value.emitter.on("change",this.onValueChange_),this.element=o.createElement("div"),this.element.classList.add(fr()),l.viewProps.bindClassModifiers(this.element),l.viewProps.bindTabIndex(this.element);const p=o.createElement("div");p.classList.add(fr("b")),this.element.appendChild(p);const S=o.createElement("div");S.classList.add(fr("c")),p.appendChild(S),this.colorElem_=S;const B=o.createElement("div");B.classList.add(fr("m")),this.element.appendChild(B),this.markerElem_=B;const W=o.createElement("div");W.classList.add(fr("p")),this.markerElem_.appendChild(W),this.previewElem_=W,this.update_()}update_(){const o=this.value.rawValue,l=o.getComponents("rgb"),p=new at([l[0],l[1],l[2],0],"rgb"),S=new at([l[0],l[1],l[2],255],"rgb"),B=["to right",Qr(p),Qr(S)];this.colorElem_.style.background=`linear-gradient(${B.join(",")})`,this.previewElem_.style.backgroundColor=Qr(o);const W=Ct(l[3],0,1,0,100);this.markerElem_.style.left=`${W}%`}onValueChange_(){this.update_()}}class Lm{constructor(o,l){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=l.value,this.viewProps=l.viewProps,this.view=new Pm(o,{value:this.value,viewProps:this.viewProps}),this.ptHandler_=new ki(this.view.element),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.element.addEventListener("keydown",this.onKeyDown_),this.view.element.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(o,l){if(!o.point)return;const p=o.point.x/o.bounds.width,S=this.value.rawValue,[B,W,de]=S.getComponents("hsv");this.value.setRawValue(new at([B,W,de,p],"hsv"),l)}onPointerDown_(o){this.handlePointerEvent_(o.data,{forceEmit:!1,last:!1})}onPointerMove_(o){this.handlePointerEvent_(o.data,{forceEmit:!1,last:!1})}onPointerUp_(o){this.handlePointerEvent_(o.data,{forceEmit:!0,last:!0})}onKeyDown_(o){const l=hn(Gi(!0),jn(o));if(l===0)return;const p=this.value.rawValue,[S,B,W,de]=p.getComponents("hsv");this.value.setRawValue(new at([S,B,W,de+l],"hsv"),{forceEmit:!1,last:!1})}onKeyUp_(o){hn(Gi(!0),jn(o))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}const ms=M("coltxt");function Im(h){const o=h.createElement("select"),l=[{text:"RGB",value:"rgb"},{text:"HSL",value:"hsl"},{text:"HSV",value:"hsv"}];return o.appendChild(l.reduce((p,S)=>{const B=h.createElement("option");return B.textContent=S.text,B.value=S.value,p.appendChild(B),p},h.createDocumentFragment())),o}class Dm{constructor(o,l){this.element=o.createElement("div"),this.element.classList.add(ms()),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("div");p.classList.add(ms("m")),this.modeElem_=Im(o),this.modeElem_.classList.add(ms("ms")),p.appendChild(this.modeSelectElement),l.viewProps.bindDisabled(this.modeElem_);const S=o.createElement("div");S.classList.add(ms("mm")),S.appendChild(se(o,"dropdown")),p.appendChild(S),this.element.appendChild(p);const B=o.createElement("div");B.classList.add(ms("w")),this.element.appendChild(B),this.textsElem_=B,this.textViews_=l.textViews,this.applyTextViews_(),O(l.colorMode,W=>{this.modeElem_.value=W})}get modeSelectElement(){return this.modeElem_}get textViews(){return this.textViews_}set textViews(o){this.textViews_=o,this.applyTextViews_()}applyTextViews_(){De(this.textsElem_);const o=this.element.ownerDocument;this.textViews_.forEach(l=>{const p=o.createElement("div");p.classList.add(ms("c")),p.appendChild(l.element),this.textsElem_.appendChild(p)})}}function Um(h){return jt(h==="float"?2:0)}function Nm(h,o,l){const p=Zr(h,o)[l];return new ds({min:0,max:p})}function Fa(h,o,l){return new dr(h,{arrayPosition:l===0?"fst":l===2?"lst":"mid",baseStep:Gi(!1),parser:o.parser,props:z.fromObject({draggingScale:o.colorType==="float"?.01:1,formatter:Um(o.colorType)}),value:ee(0,{constraint:Nm(o.colorMode,o.colorType,l)}),viewProps:o.viewProps})}class Om{constructor(o,l){this.onModeSelectChange_=this.onModeSelectChange_.bind(this),this.colorType_=l.colorType,this.parser_=l.parser,this.value=l.value,this.viewProps=l.viewProps,this.colorMode=ee(this.value.rawValue.mode),this.ccs_=this.createComponentControllers_(o),this.view=new Dm(o,{colorMode:this.colorMode,textViews:[this.ccs_[0].view,this.ccs_[1].view,this.ccs_[2].view],viewProps:this.viewProps}),this.view.modeSelectElement.addEventListener("change",this.onModeSelectChange_)}createComponentControllers_(o){const l={colorMode:this.colorMode.rawValue,colorType:this.colorType_,parser:this.parser_,viewProps:this.viewProps},p=[Fa(o,l,0),Fa(o,l,1),Fa(o,l,2)];return p.forEach((S,B)=>{hr({primary:this.value,secondary:S.value,forward:W=>W.rawValue.getComponents(this.colorMode.rawValue,this.colorType_)[B],backward:(W,de)=>{const Ge=this.colorMode.rawValue,We=W.rawValue.getComponents(Ge,this.colorType_);return We[B]=de.rawValue,new at(Rh(Vi(We),We[3]),Ge,this.colorType_)}})}),p}onModeSelectChange_(o){const l=o.currentTarget;this.colorMode.rawValue=l.value,this.ccs_=this.createComponentControllers_(this.view.element.ownerDocument),this.view.textViews=[this.ccs_[0].view,this.ccs_[1].view,this.ccs_[2].view]}}const Ba=M("hpl");class Fm{constructor(o,l){this.onValueChange_=this.onValueChange_.bind(this),this.value=l.value,this.value.emitter.on("change",this.onValueChange_),this.element=o.createElement("div"),this.element.classList.add(Ba()),l.viewProps.bindClassModifiers(this.element),l.viewProps.bindTabIndex(this.element);const p=o.createElement("div");p.classList.add(Ba("c")),this.element.appendChild(p);const S=o.createElement("div");S.classList.add(Ba("m")),this.element.appendChild(S),this.markerElem_=S,this.update_()}update_(){const o=this.value.rawValue,[l]=o.getComponents("hsv");this.markerElem_.style.backgroundColor=$h(new at([l,100,100],"hsv"));const p=Ct(l,0,360,0,100);this.markerElem_.style.left=`${p}%`}onValueChange_(){this.update_()}}class Bm{constructor(o,l){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=l.value,this.viewProps=l.viewProps,this.view=new Fm(o,{value:this.value,viewProps:this.viewProps}),this.ptHandler_=new ki(this.view.element),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.element.addEventListener("keydown",this.onKeyDown_),this.view.element.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(o,l){if(!o.point)return;const p=Ct(kt(o.point.x,0,o.bounds.width),0,o.bounds.width,0,360),S=this.value.rawValue,[,B,W,de]=S.getComponents("hsv");this.value.setRawValue(new at([p,B,W,de],"hsv"),l)}onPointerDown_(o){this.handlePointerEvent_(o.data,{forceEmit:!1,last:!1})}onPointerMove_(o){this.handlePointerEvent_(o.data,{forceEmit:!1,last:!1})}onPointerUp_(o){this.handlePointerEvent_(o.data,{forceEmit:!0,last:!0})}onKeyDown_(o){const l=hn(Gi(!1),jn(o));if(l===0)return;const p=this.value.rawValue,[S,B,W,de]=p.getComponents("hsv");this.value.setRawValue(new at([S+l,B,W,de],"hsv"),{forceEmit:!1,last:!1})}onKeyUp_(o){hn(Gi(!1),jn(o))!==0&&this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}const ka=M("svp"),Jh=64;class km{constructor(o,l){this.onValueChange_=this.onValueChange_.bind(this),this.value=l.value,this.value.emitter.on("change",this.onValueChange_),this.element=o.createElement("div"),this.element.classList.add(ka()),l.viewProps.bindClassModifiers(this.element),l.viewProps.bindTabIndex(this.element);const p=o.createElement("canvas");p.height=Jh,p.width=Jh,p.classList.add(ka("c")),this.element.appendChild(p),this.canvasElement=p;const S=o.createElement("div");S.classList.add(ka("m")),this.element.appendChild(S),this.markerElem_=S,this.update_()}update_(){const o=C(this.canvasElement);if(!o)return;const p=this.value.rawValue.getComponents("hsv"),S=this.canvasElement.width,B=this.canvasElement.height,W=o.getImageData(0,0,S,B),de=W.data;for(let mt=0;mt<B;mt++)for(let xt=0;xt<S;xt++){const Wi=Ct(xt,0,S,0,100),gr=Ct(mt,0,B,100,0),vr=Th(p[0],Wi,gr),eo=(mt*S+xt)*4;de[eo]=vr[0],de[eo+1]=vr[1],de[eo+2]=vr[2],de[eo+3]=255}o.putImageData(W,0,0);const Ge=Ct(p[1],0,100,0,100);this.markerElem_.style.left=`${Ge}%`;const We=Ct(p[2],0,100,100,0);this.markerElem_.style.top=`${We}%`}onValueChange_(){this.update_()}}class zm{constructor(o,l){this.onKeyDown_=this.onKeyDown_.bind(this),this.onKeyUp_=this.onKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=l.value,this.viewProps=l.viewProps,this.view=new km(o,{value:this.value,viewProps:this.viewProps}),this.ptHandler_=new ki(this.view.element),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.element.addEventListener("keydown",this.onKeyDown_),this.view.element.addEventListener("keyup",this.onKeyUp_)}handlePointerEvent_(o,l){if(!o.point)return;const p=Ct(o.point.x,0,o.bounds.width,0,100),S=Ct(o.point.y,0,o.bounds.height,100,0),[B,,,W]=this.value.rawValue.getComponents("hsv");this.value.setRawValue(new at([B,p,S,W],"hsv"),l)}onPointerDown_(o){this.handlePointerEvent_(o.data,{forceEmit:!1,last:!1})}onPointerMove_(o){this.handlePointerEvent_(o.data,{forceEmit:!1,last:!1})}onPointerUp_(o){this.handlePointerEvent_(o.data,{forceEmit:!0,last:!0})}onKeyDown_(o){Sh(o.key)&&o.preventDefault();const[l,p,S,B]=this.value.rawValue.getComponents("hsv"),W=Gi(!1),de=hn(W,jn(o)),Ge=hn(W,ur(o));de===0&&Ge===0||this.value.setRawValue(new at([l,p+de,S+Ge,B],"hsv"),{forceEmit:!1,last:!1})}onKeyUp_(o){const l=Gi(!1),p=hn(l,jn(o)),S=hn(l,ur(o));p===0&&S===0||this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}class Vm{constructor(o,l){this.value=l.value,this.viewProps=l.viewProps,this.hPaletteC_=new Bm(o,{value:this.value,viewProps:this.viewProps}),this.svPaletteC_=new zm(o,{value:this.value,viewProps:this.viewProps}),this.alphaIcs_=l.supportsAlpha?{palette:new Lm(o,{value:this.value,viewProps:this.viewProps}),text:new dr(o,{parser:qn,baseStep:.1,props:z.fromObject({draggingScale:.01,formatter:jt(2)}),value:ee(0,{constraint:new ds({min:0,max:1})}),viewProps:this.viewProps})}:null,this.alphaIcs_&&hr({primary:this.value,secondary:this.alphaIcs_.text.value,forward:p=>p.rawValue.getComponents()[3],backward:(p,S)=>{const B=p.rawValue.getComponents();return B[3]=S.rawValue,new at(B,p.rawValue.mode)}}),this.textC_=new Om(o,{colorType:l.colorType,parser:qn,value:this.value,viewProps:this.viewProps}),this.view=new fm(o,{alphaViews:this.alphaIcs_?{palette:this.alphaIcs_.palette.view,text:this.alphaIcs_.text.view}:null,hPaletteView:this.hPaletteC_.view,supportsAlpha:l.supportsAlpha,svPaletteView:this.svPaletteC_.view,textView:this.textC_.view,viewProps:this.viewProps})}get textController(){return this.textC_}}const za=M("colsw");class Gm{constructor(o,l){this.onValueChange_=this.onValueChange_.bind(this),l.value.emitter.on("change",this.onValueChange_),this.value=l.value,this.element=o.createElement("div"),this.element.classList.add(za()),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("div");p.classList.add(za("sw")),this.element.appendChild(p),this.swatchElem_=p;const S=o.createElement("button");S.classList.add(za("b")),l.viewProps.bindDisabled(S),this.element.appendChild(S),this.buttonElement=S,this.update_()}update_(){const o=this.value.rawValue;this.swatchElem_.style.backgroundColor=Na(o)}onValueChange_(){this.update_()}}class Hm{constructor(o,l){this.value=l.value,this.viewProps=l.viewProps,this.view=new Gm(o,{value:this.value,viewProps:this.viewProps})}}class Va{constructor(o,l){this.onButtonBlur_=this.onButtonBlur_.bind(this),this.onButtonClick_=this.onButtonClick_.bind(this),this.onPopupChildBlur_=this.onPopupChildBlur_.bind(this),this.onPopupChildKeydown_=this.onPopupChildKeydown_.bind(this),this.value=l.value,this.viewProps=l.viewProps,this.foldable_=je.create(l.expanded),this.swatchC_=new Hm(o,{value:this.value,viewProps:this.viewProps});const p=this.swatchC_.view.buttonElement;p.addEventListener("blur",this.onButtonBlur_),p.addEventListener("click",this.onButtonClick_),this.textC_=new Yr(o,{parser:l.parser,props:z.fromObject({formatter:l.formatter}),value:this.value,viewProps:this.viewProps}),this.view=new sm(o,{foldable:this.foldable_,pickerLayout:l.pickerLayout}),this.view.swatchElement.appendChild(this.swatchC_.view.element),this.view.textElement.appendChild(this.textC_.view.element),this.popC_=l.pickerLayout==="popup"?new fh(o,{viewProps:this.viewProps}):null;const S=new Vm(o,{colorType:l.colorType,supportsAlpha:l.supportsAlpha,value:this.value,viewProps:this.viewProps});S.view.allFocusableElements.forEach(B=>{B.addEventListener("blur",this.onPopupChildBlur_),B.addEventListener("keydown",this.onPopupChildKeydown_)}),this.pickerC_=S,this.popC_?(this.view.element.appendChild(this.popC_.view.element),this.popC_.view.element.appendChild(S.view.element),hr({primary:this.foldable_.value("expanded"),secondary:this.popC_.shows,forward:B=>B.rawValue,backward:(B,W)=>W.rawValue})):this.view.pickerElement&&(this.view.pickerElement.appendChild(this.pickerC_.view.element),ve(this.foldable_,this.view.pickerElement))}get textController(){return this.textC_}onButtonBlur_(o){if(!this.popC_)return;const l=this.view.element,p=o.relatedTarget;(!p||!l.contains(p))&&(this.popC_.shows.rawValue=!1)}onButtonClick_(){this.foldable_.set("expanded",!this.foldable_.get("expanded")),this.foldable_.get("expanded")&&this.pickerC_.view.allFocusableElements[0].focus()}onPopupChildBlur_(o){if(!this.popC_)return;const l=this.popC_.view.element,p=Ee(o);p&&l.contains(p)||p&&p===this.swatchC_.view.buttonElement&&!dt(l.ownerDocument)||(this.popC_.shows.rawValue=!1)}onPopupChildKeydown_(o){this.popC_?o.key==="Escape"&&(this.popC_.shows.rawValue=!1):this.view.pickerElement&&o.key==="Escape"&&this.swatchC_.view.buttonElement.focus()}}function Wm(h,o){return at.isColorObject(h)?at.fromObject(h,o):at.black(o)}function Xm(h){return Vi(h.getComponents("rgb")).reduce((o,l)=>o<<8|Math.floor(l)&255,0)}function Ym(h){return h.getComponents("rgb").reduce((o,l,p)=>{const S=Math.floor(p===3?l*255:l)&255;return o<<8|S},0)>>>0}function qm(h){return new at([h>>16&255,h>>8&255,h&255],"rgb")}function jm(h){return new at([h>>24&255,h>>16&255,h>>8&255,Ct(h&255,0,255,0,1)],"rgb")}function $m(h){return typeof h!="number"?at.black():qm(h)}function Km(h){return typeof h!="number"?at.black():jm(h)}function Zm(h){const o=Oa(h);return o?(l,p)=>{pr(l,o(p))}:null}function Jm(h){const o=h?Ym:Xm;return(l,p)=>{pr(l,o(p))}}function Qm(h,o,l){const p=o.toRgbaObject(l);h.writeProperty("r",p.r),h.writeProperty("g",p.g),h.writeProperty("b",p.b),h.writeProperty("a",p.a)}function eg(h,o,l){const p=o.toRgbaObject(l);h.writeProperty("r",p.r),h.writeProperty("g",p.g),h.writeProperty("b",p.b)}function tg(h,o){return(l,p)=>{h?Qm(l,p,o):eg(l,p,o)}}function Ga(h){var o;return!!(h!=null&&h.alpha||!((o=h==null?void 0:h.color)===null||o===void 0)&&o.alpha)}function ng(h){return h?o=>Na(o,"0x"):o=>jh(o,"0x")}function ig(h){return"color"in h||"view"in h&&h.view==="color"}const sg={id:"input-color-number",type:"input",accept:(h,o)=>{if(typeof h!="number"||!ig(o))return null;const l=Ia(o);return l?{initialValue:h,params:l}:null},binding:{reader:h=>Ga(h.params)?Km:$m,equals:at.equals,writer:h=>Jm(Ga(h.params))},controller:h=>{const o=Ga(h.params),l="expanded"in h.params?h.params.expanded:void 0,p="picker"in h.params?h.params.picker:void 0;return new Va(h.document,{colorType:"int",expanded:l??!1,formatter:ng(o),parser:Ua("int"),pickerLayout:p??"popup",supportsAlpha:o,value:h.value,viewProps:h.viewProps})}};function rg(h){return at.isRgbaColorObject(h)}function og(h){return o=>Wm(o,h)}function ag(h,o){return l=>h?Zh(l,o):Kh(l,o)}const lg={id:"input-color-object",type:"input",accept:(h,o)=>{if(!at.isColorObject(h))return null;const l=Ia(o);return l?{initialValue:h,params:l}:null},binding:{reader:h=>og(Hi(h.params)),equals:at.equals,writer:h=>tg(rg(h.initialValue),Hi(h.params))},controller:h=>{var o;const l=at.isRgbaColorObject(h.initialValue),p="expanded"in h.params?h.params.expanded:void 0,S="picker"in h.params?h.params.picker:void 0,B=(o=Hi(h.params))!==null&&o!==void 0?o:"int";return new Va(h.document,{colorType:B,expanded:p??!1,formatter:ag(l,B),parser:Ua(B),pickerLayout:S??"popup",supportsAlpha:l,value:h.value,viewProps:h.viewProps})}},cg={id:"input-color-string",type:"input",accept:(h,o)=>{if(typeof h!="string"||"view"in o&&o.view==="text")return null;const l=Da(h,Hi(o));if(!l||!Oa(l))return null;const S=Ia(o);return S?{initialValue:h,params:S}:null},binding:{reader:h=>{var o;return wm((o=Hi(h.params))!==null&&o!==void 0?o:"int")},equals:at.equals,writer:h=>{const o=Da(h.initialValue,Hi(h.params));if(!o)throw y.shouldNeverHappen();const l=Zm(o);if(!l)throw y.notBindable();return l}},controller:h=>{const o=Da(h.initialValue,Hi(h.params));if(!o)throw y.shouldNeverHappen();const l=Oa(o);if(!l)throw y.shouldNeverHappen();const p="expanded"in h.params?h.params.expanded:void 0,S="picker"in h.params?h.params.picker:void 0;return new Va(h.document,{colorType:o.type,expanded:p??!1,formatter:l,parser:Ua(o.type),pickerLayout:S??"popup",supportsAlpha:o.alpha,value:h.value,viewProps:h.viewProps})}};class fi{constructor(o){this.components=o.components,this.asm_=o.assembly}constrain(o){const l=this.asm_.toComponents(o).map((p,S)=>{var B,W;return(W=(B=this.components[S])===null||B===void 0?void 0:B.constrain(p))!==null&&W!==void 0?W:p});return this.asm_.fromComponents(l)}}const Qh=M("pndtxt");class hg{constructor(o,l){this.textViews=l.textViews,this.element=o.createElement("div"),this.element.classList.add(Qh()),this.textViews.forEach(p=>{const S=o.createElement("div");S.classList.add(Qh("a")),S.appendChild(p.element),this.element.appendChild(S)})}}function ug(h,o,l){return new dr(h,{arrayPosition:l===0?"fst":l===o.axes.length-1?"lst":"mid",baseStep:o.axes[l].baseStep,parser:o.parser,props:o.axes[l].textProps,value:ee(0,{constraint:o.axes[l].constraint}),viewProps:o.viewProps})}class Ha{constructor(o,l){this.value=l.value,this.viewProps=l.viewProps,this.acs_=l.axes.map((p,S)=>ug(o,l,S)),this.acs_.forEach((p,S)=>{hr({primary:this.value,secondary:p.value,forward:B=>l.assembly.toComponents(B.rawValue)[S],backward:(B,W)=>{const de=l.assembly.toComponents(B.rawValue);return de[S]=W.rawValue,l.assembly.fromComponents(de)}})}),this.view=new hg(o,{textViews:this.acs_.map(p=>p.view)})}}function eu(h,o){return"step"in h&&!m(h.step)?new Xr(h.step,o):null}function tu(h){return!m(h.max)&&!m(h.min)?new ds({max:h.max,min:h.min}):!m(h.max)||!m(h.min)?new dh({max:h.max,min:h.min}):null}function dg(h){const o=qt(h,ds);if(o)return[o.values.get("min"),o.values.get("max")];const l=qt(h,dh);return l?[l.minValue,l.maxValue]:[void 0,void 0]}function pg(h,o){const l=[],p=eu(h,o);p&&l.push(p);const S=tu(h);S&&l.push(S);const B=La(h.options);return B&&l.push(B),new Yn(l)}const fg={id:"input-number",type:"input",accept:(h,o)=>{if(typeof h!="number")return null;const l=Y,p=ae(o,{format:l.optional.function,max:l.optional.number,min:l.optional.number,options:l.optional.custom(jr),step:l.optional.number});return p?{initialValue:h,params:p}:null},binding:{reader:h=>yh,constraint:h=>pg(h.params,h.initialValue),writer:h=>pr},controller:h=>{var o;const l=h.value,p=h.constraint,S=p&&qt(p,or);if(S)return new ar(h.document,{props:new z({options:S.values.value("options")}),value:l,viewProps:h.viewProps});const B=(o="format"in h.params?h.params.format:void 0)!==null&&o!==void 0?o:jt($r(p,l.rawValue)),W=p&&qt(p,ds);return W?new Pa(h.document,{baseStep:ps(p),parser:qn,sliderProps:new z({maxValue:W.values.value("max"),minValue:W.values.value("min")}),textProps:z.fromObject({draggingScale:fs(p,l.rawValue),formatter:B}),value:l,viewProps:h.viewProps}):new dr(h.document,{baseStep:ps(p),parser:qn,props:z.fromObject({draggingScale:fs(p,l.rawValue),formatter:B}),value:l,viewProps:h.viewProps})}};class mi{constructor(o=0,l=0){this.x=o,this.y=l}getComponents(){return[this.x,this.y]}static isObject(o){if(m(o))return!1;const l=o.x,p=o.y;return!(typeof l!="number"||typeof p!="number")}static equals(o,l){return o.x===l.x&&o.y===l.y}toObject(){return{x:this.x,y:this.y}}}const nu={toComponents:h=>h.getComponents(),fromComponents:h=>new mi(...h)},gs=M("p2d");class mg{constructor(o,l){this.element=o.createElement("div"),this.element.classList.add(gs()),l.viewProps.bindClassModifiers(this.element),O(l.expanded,A(this.element,gs(void 0,"expanded")));const p=o.createElement("div");p.classList.add(gs("h")),this.element.appendChild(p);const S=o.createElement("button");S.classList.add(gs("b")),S.appendChild(se(o,"p2dpad")),l.viewProps.bindDisabled(S),p.appendChild(S),this.buttonElement=S;const B=o.createElement("div");if(B.classList.add(gs("t")),p.appendChild(B),this.textElement=B,l.pickerLayout==="inline"){const W=o.createElement("div");W.classList.add(gs("p")),this.element.appendChild(W),this.pickerElement=W}else this.pickerElement=null}}const gi=M("p2dp");class gg{constructor(o,l){this.onFoldableChange_=this.onFoldableChange_.bind(this),this.onValueChange_=this.onValueChange_.bind(this),this.invertsY_=l.invertsY,this.maxValue_=l.maxValue,this.element=o.createElement("div"),this.element.classList.add(gi()),l.layout==="popup"&&this.element.classList.add(gi(void 0,"p")),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("div");p.classList.add(gi("p")),l.viewProps.bindTabIndex(p),this.element.appendChild(p),this.padElement=p;const S=o.createElementNS(Ne,"svg");S.classList.add(gi("g")),this.padElement.appendChild(S),this.svgElem_=S;const B=o.createElementNS(Ne,"line");B.classList.add(gi("ax")),B.setAttributeNS(null,"x1","0"),B.setAttributeNS(null,"y1","50%"),B.setAttributeNS(null,"x2","100%"),B.setAttributeNS(null,"y2","50%"),this.svgElem_.appendChild(B);const W=o.createElementNS(Ne,"line");W.classList.add(gi("ax")),W.setAttributeNS(null,"x1","50%"),W.setAttributeNS(null,"y1","0"),W.setAttributeNS(null,"x2","50%"),W.setAttributeNS(null,"y2","100%"),this.svgElem_.appendChild(W);const de=o.createElementNS(Ne,"line");de.classList.add(gi("l")),de.setAttributeNS(null,"x1","50%"),de.setAttributeNS(null,"y1","50%"),this.svgElem_.appendChild(de),this.lineElem_=de;const Ge=o.createElement("div");Ge.classList.add(gi("m")),this.padElement.appendChild(Ge),this.markerElem_=Ge,l.value.emitter.on("change",this.onValueChange_),this.value=l.value,this.update_()}get allFocusableElements(){return[this.padElement]}update_(){const[o,l]=this.value.rawValue.getComponents(),p=this.maxValue_,S=Ct(o,-p,+p,0,100),B=Ct(l,-p,+p,0,100),W=this.invertsY_?100-B:B;this.lineElem_.setAttributeNS(null,"x2",`${S}%`),this.lineElem_.setAttributeNS(null,"y2",`${W}%`),this.markerElem_.style.left=`${S}%`,this.markerElem_.style.top=`${W}%`}onValueChange_(){this.update_()}onFoldableChange_(){this.update_()}}function iu(h,o,l){return[hn(o[0],jn(h)),hn(o[1],ur(h))*(l?1:-1)]}class vg{constructor(o,l){this.onPadKeyDown_=this.onPadKeyDown_.bind(this),this.onPadKeyUp_=this.onPadKeyUp_.bind(this),this.onPointerDown_=this.onPointerDown_.bind(this),this.onPointerMove_=this.onPointerMove_.bind(this),this.onPointerUp_=this.onPointerUp_.bind(this),this.value=l.value,this.viewProps=l.viewProps,this.baseSteps_=l.baseSteps,this.maxValue_=l.maxValue,this.invertsY_=l.invertsY,this.view=new gg(o,{invertsY:this.invertsY_,layout:l.layout,maxValue:this.maxValue_,value:this.value,viewProps:this.viewProps}),this.ptHandler_=new ki(this.view.padElement),this.ptHandler_.emitter.on("down",this.onPointerDown_),this.ptHandler_.emitter.on("move",this.onPointerMove_),this.ptHandler_.emitter.on("up",this.onPointerUp_),this.view.padElement.addEventListener("keydown",this.onPadKeyDown_),this.view.padElement.addEventListener("keyup",this.onPadKeyUp_)}handlePointerEvent_(o,l){if(!o.point)return;const p=this.maxValue_,S=Ct(o.point.x,0,o.bounds.width,-p,+p),B=Ct(this.invertsY_?o.bounds.height-o.point.y:o.point.y,0,o.bounds.height,-p,+p);this.value.setRawValue(new mi(S,B),l)}onPointerDown_(o){this.handlePointerEvent_(o.data,{forceEmit:!1,last:!1})}onPointerMove_(o){this.handlePointerEvent_(o.data,{forceEmit:!1,last:!1})}onPointerUp_(o){this.handlePointerEvent_(o.data,{forceEmit:!0,last:!0})}onPadKeyDown_(o){Sh(o.key)&&o.preventDefault();const[l,p]=iu(o,this.baseSteps_,this.invertsY_);l===0&&p===0||this.value.setRawValue(new mi(this.value.rawValue.x+l,this.value.rawValue.y+p),{forceEmit:!1,last:!1})}onPadKeyUp_(o){const[l,p]=iu(o,this.baseSteps_,this.invertsY_);l===0&&p===0||this.value.setRawValue(this.value.rawValue,{forceEmit:!0,last:!0})}}class _g{constructor(o,l){var p,S;this.onPopupChildBlur_=this.onPopupChildBlur_.bind(this),this.onPopupChildKeydown_=this.onPopupChildKeydown_.bind(this),this.onPadButtonBlur_=this.onPadButtonBlur_.bind(this),this.onPadButtonClick_=this.onPadButtonClick_.bind(this),this.value=l.value,this.viewProps=l.viewProps,this.foldable_=je.create(l.expanded),this.popC_=l.pickerLayout==="popup"?new fh(o,{viewProps:this.viewProps}):null;const B=new vg(o,{baseSteps:[l.axes[0].baseStep,l.axes[1].baseStep],invertsY:l.invertsY,layout:l.pickerLayout,maxValue:l.maxValue,value:this.value,viewProps:this.viewProps});B.view.allFocusableElements.forEach(W=>{W.addEventListener("blur",this.onPopupChildBlur_),W.addEventListener("keydown",this.onPopupChildKeydown_)}),this.pickerC_=B,this.textC_=new Ha(o,{assembly:nu,axes:l.axes,parser:l.parser,value:this.value,viewProps:this.viewProps}),this.view=new mg(o,{expanded:this.foldable_.value("expanded"),pickerLayout:l.pickerLayout,viewProps:this.viewProps}),this.view.textElement.appendChild(this.textC_.view.element),(p=this.view.buttonElement)===null||p===void 0||p.addEventListener("blur",this.onPadButtonBlur_),(S=this.view.buttonElement)===null||S===void 0||S.addEventListener("click",this.onPadButtonClick_),this.popC_?(this.view.element.appendChild(this.popC_.view.element),this.popC_.view.element.appendChild(this.pickerC_.view.element),hr({primary:this.foldable_.value("expanded"),secondary:this.popC_.shows,forward:W=>W.rawValue,backward:(W,de)=>de.rawValue})):this.view.pickerElement&&(this.view.pickerElement.appendChild(this.pickerC_.view.element),ve(this.foldable_,this.view.pickerElement))}onPadButtonBlur_(o){if(!this.popC_)return;const l=this.view.element,p=o.relatedTarget;(!p||!l.contains(p))&&(this.popC_.shows.rawValue=!1)}onPadButtonClick_(){this.foldable_.set("expanded",!this.foldable_.get("expanded")),this.foldable_.get("expanded")&&this.pickerC_.view.allFocusableElements[0].focus()}onPopupChildBlur_(o){if(!this.popC_)return;const l=this.popC_.view.element,p=Ee(o);p&&l.contains(p)||p&&p===this.view.buttonElement&&!dt(l.ownerDocument)||(this.popC_.shows.rawValue=!1)}onPopupChildKeydown_(o){this.popC_?o.key==="Escape"&&(this.popC_.shows.rawValue=!1):this.view.pickerElement&&o.key==="Escape"&&this.view.buttonElement.focus()}}class vs{constructor(o=0,l=0,p=0){this.x=o,this.y=l,this.z=p}getComponents(){return[this.x,this.y,this.z]}static isObject(o){if(m(o))return!1;const l=o.x,p=o.y,S=o.z;return!(typeof l!="number"||typeof p!="number"||typeof S!="number")}static equals(o,l){return o.x===l.x&&o.y===l.y&&o.z===l.z}toObject(){return{x:this.x,y:this.y,z:this.z}}}const su={toComponents:h=>h.getComponents(),fromComponents:h=>new vs(...h)};function xg(h){return vs.isObject(h)?new vs(h.x,h.y,h.z):new vs}function bg(h,o){h.writeProperty("x",o.x),h.writeProperty("y",o.y),h.writeProperty("z",o.z)}function yg(h,o){return new fi({assembly:su,components:[$n("x"in h?h.x:void 0,o.x),$n("y"in h?h.y:void 0,o.y),$n("z"in h?h.z:void 0,o.z)]})}function Wa(h,o){return{baseStep:ps(o),constraint:o,textProps:z.fromObject({draggingScale:fs(o,h),formatter:jt($r(o,h))})}}const wg={id:"input-point3d",type:"input",accept:(h,o)=>{if(!vs.isObject(h))return null;const l=Y,p=ae(o,{x:l.optional.custom(di),y:l.optional.custom(di),z:l.optional.custom(di)});return p?{initialValue:h,params:p}:null},binding:{reader:h=>xg,constraint:h=>yg(h.params,h.initialValue),equals:vs.equals,writer:h=>bg},controller:h=>{const o=h.value,l=h.constraint;if(!(l instanceof fi))throw y.shouldNeverHappen();return new Ha(h.document,{assembly:su,axes:[Wa(o.rawValue.x,l.components[0]),Wa(o.rawValue.y,l.components[1]),Wa(o.rawValue.z,l.components[2])],parser:qn,value:o,viewProps:h.viewProps})}};class _s{constructor(o=0,l=0,p=0,S=0){this.x=o,this.y=l,this.z=p,this.w=S}getComponents(){return[this.x,this.y,this.z,this.w]}static isObject(o){if(m(o))return!1;const l=o.x,p=o.y,S=o.z,B=o.w;return!(typeof l!="number"||typeof p!="number"||typeof S!="number"||typeof B!="number")}static equals(o,l){return o.x===l.x&&o.y===l.y&&o.z===l.z&&o.w===l.w}toObject(){return{x:this.x,y:this.y,z:this.z,w:this.w}}}const ru={toComponents:h=>h.getComponents(),fromComponents:h=>new _s(...h)};function Sg(h){return _s.isObject(h)?new _s(h.x,h.y,h.z,h.w):new _s}function Mg(h,o){h.writeProperty("x",o.x),h.writeProperty("y",o.y),h.writeProperty("z",o.z),h.writeProperty("w",o.w)}function Eg(h,o){return new fi({assembly:ru,components:[$n("x"in h?h.x:void 0,o.x),$n("y"in h?h.y:void 0,o.y),$n("z"in h?h.z:void 0,o.z),$n("w"in h?h.w:void 0,o.w)]})}function Ag(h,o){return{baseStep:ps(o),constraint:o,textProps:z.fromObject({draggingScale:fs(o,h),formatter:jt($r(o,h))})}}const Cg={id:"input-point4d",type:"input",accept:(h,o)=>{if(!_s.isObject(h))return null;const l=Y,p=ae(o,{x:l.optional.custom(di),y:l.optional.custom(di),z:l.optional.custom(di),w:l.optional.custom(di)});return p?{initialValue:h,params:p}:null},binding:{reader:h=>Sg,constraint:h=>Eg(h.params,h.initialValue),equals:_s.equals,writer:h=>Mg},controller:h=>{const o=h.value,l=h.constraint;if(!(l instanceof fi))throw y.shouldNeverHappen();return new Ha(h.document,{assembly:ru,axes:o.rawValue.getComponents().map((p,S)=>Ag(p,l.components[S])),parser:qn,value:o,viewProps:h.viewProps})}};function Tg(h){const o=[],l=La(h.options);return l&&o.push(l),new Yn(o)}const Rg={id:"input-string",type:"input",accept:(h,o)=>{if(typeof h!="string")return null;const p=ae(o,{options:Y.optional.custom(jr)});return p?{initialValue:h,params:p}:null},binding:{reader:h=>wh,constraint:h=>Tg(h.params),writer:h=>pr},controller:h=>{const o=h.document,l=h.value,p=h.constraint,S=p&&qt(p,or);return S?new ar(o,{props:new z({options:S.values.value("options")}),value:l,viewProps:h.viewProps}):new Yr(o,{parser:B=>B,props:z.fromObject({formatter:Aa}),value:l,viewProps:h.viewProps})}},mr={monitor:{defaultInterval:200,defaultLineCount:3}},ou=M("mll");class Pg{constructor(o,l){this.onValueUpdate_=this.onValueUpdate_.bind(this),this.formatter_=l.formatter,this.element=o.createElement("div"),this.element.classList.add(ou()),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("textarea");p.classList.add(ou("i")),p.style.height=`calc(var(--bld-us) * ${l.lineCount})`,p.readOnly=!0,l.viewProps.bindDisabled(p),this.element.appendChild(p),this.textareaElem_=p,l.value.emitter.on("change",this.onValueUpdate_),this.value=l.value,this.update_()}update_(){const o=this.textareaElem_,l=o.scrollTop===o.scrollHeight-o.clientHeight,p=[];this.value.rawValue.forEach(S=>{S!==void 0&&p.push(this.formatter_(S))}),o.textContent=p.join(`
`),l&&(o.scrollTop=o.scrollHeight)}onValueUpdate_(){this.update_()}}class Xa{constructor(o,l){this.value=l.value,this.viewProps=l.viewProps,this.view=new Pg(o,{formatter:l.formatter,lineCount:l.lineCount,value:this.value,viewProps:this.viewProps})}}const au=M("sgl");class Lg{constructor(o,l){this.onValueUpdate_=this.onValueUpdate_.bind(this),this.formatter_=l.formatter,this.element=o.createElement("div"),this.element.classList.add(au()),l.viewProps.bindClassModifiers(this.element);const p=o.createElement("input");p.classList.add(au("i")),p.readOnly=!0,p.type="text",l.viewProps.bindDisabled(p),this.element.appendChild(p),this.inputElement=p,l.value.emitter.on("change",this.onValueUpdate_),this.value=l.value,this.update_()}update_(){const o=this.value.rawValue,l=o[o.length-1];this.inputElement.value=l!==void 0?this.formatter_(l):""}onValueUpdate_(){this.update_()}}class Ya{constructor(o,l){this.value=l.value,this.viewProps=l.viewProps,this.view=new Lg(o,{formatter:l.formatter,value:this.value,viewProps:this.viewProps})}}const Ig={id:"monitor-bool",type:"monitor",accept:(h,o)=>{if(typeof h!="boolean")return null;const p=ae(o,{lineCount:Y.optional.number});return p?{initialValue:h,params:p}:null},binding:{reader:h=>gh},controller:h=>{var o;return h.value.rawValue.length===1?new Ya(h.document,{formatter:vh,value:h.value,viewProps:h.viewProps}):new Xa(h.document,{formatter:vh,lineCount:(o=h.params.lineCount)!==null&&o!==void 0?o:mr.monitor.defaultLineCount,value:h.value,viewProps:h.viewProps})}},vi=M("grl");class Dg{constructor(o,l){this.onCursorChange_=this.onCursorChange_.bind(this),this.onValueUpdate_=this.onValueUpdate_.bind(this),this.element=o.createElement("div"),this.element.classList.add(vi()),l.viewProps.bindClassModifiers(this.element),this.formatter_=l.formatter,this.props_=l.props,this.cursor_=l.cursor,this.cursor_.emitter.on("change",this.onCursorChange_);const p=o.createElementNS(Ne,"svg");p.classList.add(vi("g")),p.style.height=`calc(var(--bld-us) * ${l.lineCount})`,this.element.appendChild(p),this.svgElem_=p;const S=o.createElementNS(Ne,"polyline");this.svgElem_.appendChild(S),this.lineElem_=S;const B=o.createElement("div");B.classList.add(vi("t"),M("tt")()),this.element.appendChild(B),this.tooltipElem_=B,l.value.emitter.on("change",this.onValueUpdate_),this.value=l.value,this.update_()}get graphElement(){return this.svgElem_}update_(){const o=this.svgElem_.getBoundingClientRect(),l=this.value.rawValue.length-1,p=this.props_.get("minValue"),S=this.props_.get("maxValue"),B=[];this.value.rawValue.forEach((mt,xt)=>{if(mt===void 0)return;const Wi=Ct(xt,0,l,0,o.width),gr=Ct(mt,p,S,o.height,0);B.push([Wi,gr].join(","))}),this.lineElem_.setAttributeNS(null,"points",B.join(" "));const W=this.tooltipElem_,de=this.value.rawValue[this.cursor_.rawValue];if(de===void 0){W.classList.remove(vi("t","a"));return}const Ge=Ct(this.cursor_.rawValue,0,l,0,o.width),We=Ct(de,p,S,o.height,0);W.style.left=`${Ge}px`,W.style.top=`${We}px`,W.textContent=`${this.formatter_(de)}`,W.classList.contains(vi("t","a"))||(W.classList.add(vi("t","a"),vi("t","in")),He(W),W.classList.remove(vi("t","in")))}onValueUpdate_(){this.update_()}onCursorChange_(){this.update_()}}class Ug{constructor(o,l){if(this.onGraphMouseMove_=this.onGraphMouseMove_.bind(this),this.onGraphMouseLeave_=this.onGraphMouseLeave_.bind(this),this.onGraphPointerDown_=this.onGraphPointerDown_.bind(this),this.onGraphPointerMove_=this.onGraphPointerMove_.bind(this),this.onGraphPointerUp_=this.onGraphPointerUp_.bind(this),this.props_=l.props,this.value=l.value,this.viewProps=l.viewProps,this.cursor_=ee(-1),this.view=new Dg(o,{cursor:this.cursor_,formatter:l.formatter,lineCount:l.lineCount,props:this.props_,value:this.value,viewProps:this.viewProps}),!dt(o))this.view.element.addEventListener("mousemove",this.onGraphMouseMove_),this.view.element.addEventListener("mouseleave",this.onGraphMouseLeave_);else{const p=new ki(this.view.element);p.emitter.on("down",this.onGraphPointerDown_),p.emitter.on("move",this.onGraphPointerMove_),p.emitter.on("up",this.onGraphPointerUp_)}}onGraphMouseLeave_(){this.cursor_.rawValue=-1}onGraphMouseMove_(o){const l=this.view.element.getBoundingClientRect();this.cursor_.rawValue=Math.floor(Ct(o.offsetX,0,l.width,0,this.value.rawValue.length))}onGraphPointerDown_(o){this.onGraphPointerMove_(o)}onGraphPointerMove_(o){if(!o.data.point){this.cursor_.rawValue=-1;return}this.cursor_.rawValue=Math.floor(Ct(o.data.point.x,0,o.data.bounds.width,0,this.value.rawValue.length))}onGraphPointerUp_(){this.cursor_.rawValue=-1}}function qa(h){return"format"in h&&!m(h.format)?h.format:jt(2)}function Ng(h){var o;return h.value.rawValue.length===1?new Ya(h.document,{formatter:qa(h.params),value:h.value,viewProps:h.viewProps}):new Xa(h.document,{formatter:qa(h.params),lineCount:(o=h.params.lineCount)!==null&&o!==void 0?o:mr.monitor.defaultLineCount,value:h.value,viewProps:h.viewProps})}function Og(h){var o,l,p;return new Ug(h.document,{formatter:qa(h.params),lineCount:(o=h.params.lineCount)!==null&&o!==void 0?o:mr.monitor.defaultLineCount,props:z.fromObject({maxValue:(l="max"in h.params?h.params.max:null)!==null&&l!==void 0?l:100,minValue:(p="min"in h.params?h.params.min:null)!==null&&p!==void 0?p:0}),value:h.value,viewProps:h.viewProps})}function lu(h){return"view"in h&&h.view==="graph"}const Fg={id:"monitor-number",type:"monitor",accept:(h,o)=>{if(typeof h!="number")return null;const l=Y,p=ae(o,{format:l.optional.function,lineCount:l.optional.number,max:l.optional.number,min:l.optional.number,view:l.optional.string});return p?{initialValue:h,params:p}:null},binding:{defaultBufferSize:h=>lu(h)?64:1,reader:h=>yh},controller:h=>lu(h.params)?Og(h):Ng(h)},Bg={id:"monitor-string",type:"monitor",accept:(h,o)=>{if(typeof h!="string")return null;const l=Y,p=ae(o,{lineCount:l.optional.number,multiline:l.optional.boolean});return p?{initialValue:h,params:p}:null},binding:{reader:h=>wh},controller:h=>{var o;const l=h.value;return l.rawValue.length>1||"multiline"in h.params&&h.params.multiline?new Xa(h.document,{formatter:Aa,lineCount:(o=h.params.lineCount)!==null&&o!==void 0?o:mr.monitor.defaultLineCount,value:l,viewProps:h.viewProps}):new Ya(h.document,{formatter:Aa,value:l,viewProps:h.viewProps})}};function kg(h,o){var l;const p=h.accept(o.target.read(),o.params);if(m(p))return null;const S=Y,B={target:o.target,initialValue:p.initialValue,params:p.params},W=h.binding.reader(B),de=h.binding.constraint?h.binding.constraint(B):void 0,Ge=ee(W(p.initialValue),{constraint:de,equals:h.binding.equals}),We=new Bi({reader:W,target:o.target,value:Ge,writer:h.binding.writer(B)}),mt=S.optional.boolean(o.params.disabled).value,xt=S.optional.boolean(o.params.hidden).value,Wi=h.controller({constraint:de,document:o.document,initialValue:p.initialValue,params:p.params,value:We.value,viewProps:j.create({disabled:mt,hidden:xt})});return new nt(o.document,{binding:We,blade:tt(),props:z.fromObject({label:"label"in o.params?(l=S.optional.string(o.params.label).value)!==null&&l!==void 0?l:null:o.target.key}),valueController:Wi})}function zg(h,o){return o===0?new ui:new nn(h,o??mr.monitor.defaultInterval)}function Vg(h,o){var l,p,S;const B=Y,W=h.accept(o.target.read(),o.params);if(m(W))return null;const de={target:o.target,initialValue:W.initialValue,params:W.params},Ge=h.binding.reader(de),We=(p=(l=B.optional.number(o.params.bufferSize).value)!==null&&l!==void 0?l:h.binding.defaultBufferSize&&h.binding.defaultBufferSize(W.params))!==null&&p!==void 0?p:1,mt=B.optional.number(o.params.interval).value,xt=new Kt({reader:Ge,target:o.target,ticker:zg(o.document,mt),value:ln(We)}),Wi=B.optional.boolean(o.params.disabled).value,gr=B.optional.boolean(o.params.hidden).value,vr=h.controller({document:o.document,params:W.params,value:xt.value,viewProps:j.create({disabled:Wi,hidden:gr})});return new Ht(o.document,{binding:xt,blade:tt(),props:z.fromObject({label:"label"in o.params?(S=B.optional.string(o.params.label).value)!==null&&S!==void 0?S:null:o.target.key}),valueController:vr})}class Gg{constructor(){this.pluginsMap_={blades:[],inputs:[],monitors:[]}}getAll(){return[...this.pluginsMap_.blades,...this.pluginsMap_.inputs,...this.pluginsMap_.monitors]}register(o){o.type==="blade"?this.pluginsMap_.blades.unshift(o):o.type==="input"?this.pluginsMap_.inputs.unshift(o):o.type==="monitor"&&this.pluginsMap_.monitors.unshift(o)}createInput(o,l,p){const S=l.read();if(m(S))throw new y({context:{key:l.key},type:"nomatchingcontroller"});const B=this.pluginsMap_.inputs.reduce((W,de)=>W??kg(de,{document:o,target:l,params:p}),null);if(B)return B;throw new y({context:{key:l.key},type:"nomatchingcontroller"})}createMonitor(o,l,p){const S=this.pluginsMap_.monitors.reduce((B,W)=>B??Vg(W,{document:o,params:p,target:l}),null);if(S)return S;throw new y({context:{key:l.key},type:"nomatchingcontroller"})}createBlade(o,l){const p=this.pluginsMap_.blades.reduce((S,B)=>S??gn(B,{document:o,params:l}),null);if(!p)throw new y({type:"nomatchingview",context:{params:l}});return p}createBladeApi(o){if(o instanceof nt)return new Nt(o);if(o instanceof Ht)return new tn(o);if(o instanceof Fi)return new hi(o,this);const l=this.pluginsMap_.blades.reduce((p,S)=>p??S.api({controller:o,pool:this}),null);if(!l)throw y.shouldNeverHappen();return l}}function Hg(){const h=new Gg;return[$g,wg,Cg,Rg,fg,cg,lg,sg,im,Ig,Bg,Fg,Ye,G,Ae,ft].forEach(o=>{h.register(o)}),h}function Wg(h){return mi.isObject(h)?new mi(h.x,h.y):new mi}function Xg(h,o){h.writeProperty("x",o.x),h.writeProperty("y",o.y)}function $n(h,o){if(!h)return;const l=[],p=eu(h,o);p&&l.push(p);const S=tu(h);return S&&l.push(S),new Yn(l)}function Yg(h,o){return new fi({assembly:nu,components:[$n("x"in h?h.x:void 0,o.x),$n("y"in h?h.y:void 0,o.y)]})}function cu(h,o){const[l,p]=h?dg(h):[];if(!m(l)||!m(p))return Math.max(Math.abs(l??0),Math.abs(p??0));const S=ps(h);return Math.max(Math.abs(S)*10,Math.abs(o)*10)}function qg(h,o){const l=o instanceof fi?o.components[0]:void 0,p=o instanceof fi?o.components[1]:void 0,S=cu(l,h.x),B=cu(p,h.y);return Math.max(S,B)}function hu(h,o){return{baseStep:ps(o),constraint:o,textProps:z.fromObject({draggingScale:fs(o,h),formatter:jt($r(o,h))})}}function jg(h){if(!("y"in h))return!1;const o=h.y;return o&&"inverted"in o?!!o.inverted:!1}const $g={id:"input-point2d",type:"input",accept:(h,o)=>{if(!mi.isObject(h))return null;const l=Y,p=ae(o,{expanded:l.optional.boolean,picker:l.optional.custom(Ah),x:l.optional.custom(di),y:l.optional.object({inverted:l.optional.boolean,max:l.optional.number,min:l.optional.number,step:l.optional.number})});return p?{initialValue:h,params:p}:null},binding:{reader:h=>Wg,constraint:h=>Yg(h.params,h.initialValue),equals:mi.equals,writer:h=>Xg},controller:h=>{const o=h.document,l=h.value,p=h.constraint;if(!(p instanceof fi))throw y.shouldNeverHappen();const S="expanded"in h.params?h.params.expanded:void 0,B="picker"in h.params?h.params.picker:void 0;return new _g(o,{axes:[hu(l.rawValue.x,p.components[0]),hu(l.rawValue.y,p.components[1])],expanded:S??!1,invertsY:jg(h.params),maxValue:qg(l.rawValue,p),parser:qn,pickerLayout:B??"popup",value:l,viewProps:h.viewProps})}};class uu extends s{constructor(o){super(o),this.emitter_=new w,this.controller_.valueController.value.emitter.on("change",l=>{this.emitter_.emit("change",{event:new a(this,l.rawValue)})})}get label(){return this.controller_.props.get("label")}set label(o){this.controller_.props.set("label",o)}get options(){return this.controller_.valueController.props.get("options")}set options(o){this.controller_.valueController.props.set("options",o)}get value(){return this.controller_.valueController.value.rawValue}set value(o){this.controller_.valueController.value.rawValue=o}on(o,l){const p=l.bind(this);return this.emitter_.on(o,S=>{p(S.event)}),this}}class du extends s{constructor(o){super(o),this.emitter_=new w,this.controller_.valueController.value.emitter.on("change",l=>{this.emitter_.emit("change",{event:new a(this,l.rawValue)})})}get label(){return this.controller_.props.get("label")}set label(o){this.controller_.props.set("label",o)}get maxValue(){return this.controller_.valueController.sliderController.props.get("maxValue")}set maxValue(o){this.controller_.valueController.sliderController.props.set("maxValue",o)}get minValue(){return this.controller_.valueController.sliderController.props.get("minValue")}set minValue(o){this.controller_.valueController.sliderController.props.set("minValue",o)}get value(){return this.controller_.valueController.value.rawValue}set value(o){this.controller_.valueController.value.rawValue=o}on(o,l){const p=l.bind(this);return this.emitter_.on(o,S=>{p(S.event)}),this}}class pu extends s{constructor(o){super(o),this.emitter_=new w,this.controller_.valueController.value.emitter.on("change",l=>{this.emitter_.emit("change",{event:new a(this,l.rawValue)})})}get label(){return this.controller_.props.get("label")}set label(o){this.controller_.props.set("label",o)}get formatter(){return this.controller_.valueController.props.get("formatter")}set formatter(o){this.controller_.valueController.props.set("formatter",o)}get value(){return this.controller_.valueController.value.rawValue}set value(o){this.controller_.valueController.value.rawValue=o}on(o,l){const p=l.bind(this);return this.emitter_.on(o,S=>{p(S.event)}),this}}const Kg=function(){return{id:"list",type:"blade",accept(h){const o=Y,l=ae(h,{options:o.required.custom(jr),value:o.required.raw,view:o.required.constant("list"),label:o.optional.string});return l?{params:l}:null},controller(h){const o=new or(Ch(h.params.options)),l=ee(h.params.value,{constraint:o}),p=new ar(h.document,{props:new z({options:o.values.value("options")}),value:l,viewProps:h.viewProps});return new K(h.document,{blade:h.blade,props:z.fromObject({label:h.params.label}),valueController:p})},api(h){return!(h.controller instanceof K)||!(h.controller.valueController instanceof ar)?null:new uu(h.controller)}}}();function Zg(h){return h.reduce((o,l)=>Object.assign(o,{[l.presetKey]:l.read()}),{})}function Jg(h,o){h.forEach(l=>{const p=o[l.target.presetKey];p!==void 0&&l.writer(l.target,l.reader(p))})}class Qg extends as{constructor(o,l){super(o,l)}get element(){return this.controller_.view.element}importPreset(o){const l=this.controller_.rackController.rack.find(nt).map(p=>p.binding);Jg(l,o),this.refresh()}exportPreset(){const o=this.controller_.rackController.rack.find(nt).map(l=>l.binding.target);return Zg(o)}refresh(){this.controller_.rackController.rack.find(nt).forEach(o=>{o.binding.read()}),this.controller_.rackController.rack.find(Ht).forEach(o=>{o.binding.read()})}}class ev extends R{constructor(o,l){super(o,{expanded:l.expanded,blade:l.blade,props:l.props,root:!0,viewProps:l.viewProps})}}const tv={id:"slider",type:"blade",accept(h){const o=Y,l=ae(h,{max:o.required.number,min:o.required.number,view:o.required.constant("slider"),format:o.optional.function,label:o.optional.string,value:o.optional.number});return l?{params:l}:null},controller(h){var o,l;const p=(o=h.params.value)!==null&&o!==void 0?o:0,S=new ds({max:h.params.max,min:h.params.min}),B=new Pa(h.document,{baseStep:1,parser:qn,sliderProps:new z({maxValue:S.values.value("max"),minValue:S.values.value("min")}),textProps:z.fromObject({draggingScale:fs(void 0,p),formatter:(l=h.params.format)!==null&&l!==void 0?l:Yf}),value:ee(p,{constraint:S}),viewProps:h.viewProps});return new K(h.document,{blade:h.blade,props:z.fromObject({label:h.params.label}),valueController:B})},api(h){return!(h.controller instanceof K)||!(h.controller.valueController instanceof Pa)?null:new du(h.controller)}},nv=function(){return{id:"text",type:"blade",accept(h){const o=Y,l=ae(h,{parse:o.required.function,value:o.required.raw,view:o.required.constant("text"),format:o.optional.function,label:o.optional.string});return l?{params:l}:null},controller(h){var o;const l=new Yr(h.document,{parser:h.params.parse,props:z.fromObject({formatter:(o=h.params.format)!==null&&o!==void 0?o:p=>String(p)}),value:ee(h.params.value),viewProps:h.viewProps});return new K(h.document,{blade:h.blade,props:z.fromObject({label:h.params.label}),valueController:l})},api(h){return!(h.controller instanceof K)||!(h.controller.valueController instanceof Yr)?null:new pu(h.controller)}}}();function iv(h){const o=h.createElement("div");return o.classList.add(M("dfw")()),h.body&&h.body.appendChild(o),o}function fu(h,o,l){if(h.querySelector(`style[data-tp-style=${o}]`))return;const p=h.createElement("style");p.dataset.tpStyle=o,p.textContent=l,h.head.appendChild(p)}class sv extends Qg{constructor(o){var l,p;const S=o??{},B=(l=S.document)!==null&&l!==void 0?l:N(),W=Hg(),de=new ev(B,{expanded:S.expanded,blade:tt(),props:z.fromObject({title:S.title}),viewProps:j.create()});super(de,W),this.pool_=W,this.containerElem_=(p=S.container)!==null&&p!==void 0?p:iv(B),this.containerElem_.appendChild(this.element),this.doc_=B,this.usesDefaultWrapper_=!S.container,this.setUpDefaultPlugins_()}get document(){if(!this.doc_)throw y.alreadyDisposed();return this.doc_}dispose(){const o=this.containerElem_;if(!o)throw y.alreadyDisposed();if(this.usesDefaultWrapper_){const l=o.parentElement;l&&l.removeChild(o)}this.containerElem_=null,this.doc_=null,super.dispose()}registerPlugin(o){("plugin"in o?[o.plugin]:"plugins"in o?o.plugins:[]).forEach(p=>{this.pool_.register(p),this.embedPluginStyle_(p)})}embedPluginStyle_(o){o.css&&fu(this.document,`plugin-${o.id}`,o.css)}setUpDefaultPlugins_(){fu(this.document,"default",'.tp-tbiv_b,.tp-coltxtv_ms,.tp-ckbv_i,.tp-rotv_b,.tp-fldv_b,.tp-mllv_i,.tp-sglv_i,.tp-grlv_g,.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw,.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{background-color:var(--btn-bg);border-radius:var(--elm-br);color:var(--btn-fg);cursor:pointer;display:block;font-weight:bold;height:var(--bld-us);line-height:var(--bld-us);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tp-p2dv_b:hover,.tp-btnv_b:hover,.tp-lstv_s:hover{background-color:var(--btn-bg-h)}.tp-p2dv_b:focus,.tp-btnv_b:focus,.tp-lstv_s:focus{background-color:var(--btn-bg-f)}.tp-p2dv_b:active,.tp-btnv_b:active,.tp-lstv_s:active{background-color:var(--btn-bg-a)}.tp-p2dv_b:disabled,.tp-btnv_b:disabled,.tp-lstv_s:disabled{opacity:.5}.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw{background-color:var(--in-bg);border-radius:var(--elm-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--bld-us);line-height:var(--bld-us);min-width:0;width:100%}.tp-txtv_i:hover,.tp-p2dpv_p:hover,.tp-colswv_sw:hover{background-color:var(--in-bg-h)}.tp-txtv_i:focus,.tp-p2dpv_p:focus,.tp-colswv_sw:focus{background-color:var(--in-bg-f)}.tp-txtv_i:active,.tp-p2dpv_p:active,.tp-colswv_sw:active{background-color:var(--in-bg-a)}.tp-txtv_i:disabled,.tp-p2dpv_p:disabled,.tp-colswv_sw:disabled{opacity:.5}.tp-mllv_i,.tp-sglv_i,.tp-grlv_g{background-color:var(--mo-bg);border-radius:var(--elm-br);box-sizing:border-box;color:var(--mo-fg);height:var(--bld-us);scrollbar-color:currentColor rgba(0,0,0,0);scrollbar-width:thin;width:100%}.tp-mllv_i::-webkit-scrollbar,.tp-sglv_i::-webkit-scrollbar,.tp-grlv_g::-webkit-scrollbar{height:8px;width:8px}.tp-mllv_i::-webkit-scrollbar-corner,.tp-sglv_i::-webkit-scrollbar-corner,.tp-grlv_g::-webkit-scrollbar-corner{background-color:rgba(0,0,0,0)}.tp-mllv_i::-webkit-scrollbar-thumb,.tp-sglv_i::-webkit-scrollbar-thumb,.tp-grlv_g::-webkit-scrollbar-thumb{background-clip:padding-box;background-color:currentColor;border:rgba(0,0,0,0) solid 2px;border-radius:4px}.tp-rotv{--font-family: var(--tp-font-family, Roboto Mono, Source Code Pro, Menlo, Courier, monospace);--bs-br: var(--tp-base-border-radius, 6px);--cnt-h-p: var(--tp-container-horizontal-padding, 4px);--cnt-v-p: var(--tp-container-vertical-padding, 4px);--elm-br: var(--tp-element-border-radius, 2px);--bld-s: var(--tp-blade-spacing, 4px);--bld-us: var(--tp-blade-unit-size, 20px);--bs-bg: var(--tp-base-background-color, hsl(230, 7%, 17%));--bs-sh: var(--tp-base-shadow-color, rgba(0, 0, 0, 0.2));--btn-bg: var(--tp-button-background-color, hsl(230, 7%, 70%));--btn-bg-a: var(--tp-button-background-color-active, #d6d7db);--btn-bg-f: var(--tp-button-background-color-focus, #c8cad0);--btn-bg-h: var(--tp-button-background-color-hover, #bbbcc4);--btn-fg: var(--tp-button-foreground-color, hsl(230, 7%, 17%));--cnt-bg: var(--tp-container-background-color, rgba(187, 188, 196, 0.1));--cnt-bg-a: var(--tp-container-background-color-active, rgba(187, 188, 196, 0.25));--cnt-bg-f: var(--tp-container-background-color-focus, rgba(187, 188, 196, 0.2));--cnt-bg-h: var(--tp-container-background-color-hover, rgba(187, 188, 196, 0.15));--cnt-fg: var(--tp-container-foreground-color, hsl(230, 7%, 75%));--in-bg: var(--tp-input-background-color, rgba(187, 188, 196, 0.1));--in-bg-a: var(--tp-input-background-color-active, rgba(187, 188, 196, 0.25));--in-bg-f: var(--tp-input-background-color-focus, rgba(187, 188, 196, 0.2));--in-bg-h: var(--tp-input-background-color-hover, rgba(187, 188, 196, 0.15));--in-fg: var(--tp-input-foreground-color, hsl(230, 7%, 75%));--lbl-fg: var(--tp-label-foreground-color, rgba(187, 188, 196, 0.7));--mo-bg: var(--tp-monitor-background-color, rgba(0, 0, 0, 0.2));--mo-fg: var(--tp-monitor-foreground-color, rgba(187, 188, 196, 0.7));--grv-fg: var(--tp-groove-foreground-color, rgba(187, 188, 196, 0.1))}.tp-rotv_c>.tp-cntv.tp-v-lst,.tp-tabv_c .tp-brkv>.tp-cntv.tp-v-lst,.tp-fldv_c>.tp-cntv.tp-v-lst{margin-bottom:calc(-1*var(--cnt-v-p))}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-tabv_c .tp-brkv>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_c{border-bottom-left-radius:0}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-tabv_c .tp-brkv>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_b{border-bottom-left-radius:0}.tp-rotv_c>*:not(.tp-v-fst),.tp-tabv_c .tp-brkv>*:not(.tp-v-fst),.tp-fldv_c>*:not(.tp-v-fst){margin-top:var(--bld-s)}.tp-rotv_c>.tp-sprv:not(.tp-v-fst),.tp-tabv_c .tp-brkv>.tp-sprv:not(.tp-v-fst),.tp-fldv_c>.tp-sprv:not(.tp-v-fst),.tp-rotv_c>.tp-cntv:not(.tp-v-fst),.tp-tabv_c .tp-brkv>.tp-cntv:not(.tp-v-fst),.tp-fldv_c>.tp-cntv:not(.tp-v-fst){margin-top:var(--cnt-v-p)}.tp-rotv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-tabv_c .tp-brkv>.tp-sprv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-rotv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-tabv_c .tp-brkv>.tp-cntv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-cntv+*:not(.tp-v-hidden){margin-top:var(--cnt-v-p)}.tp-rotv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-tabv_c .tp-brkv>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-fldv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-rotv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-tabv_c .tp-brkv>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-fldv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv{margin-top:0}.tp-tabv_c .tp-brkv>.tp-cntv,.tp-fldv_c>.tp-cntv{margin-left:4px}.tp-tabv_c .tp-brkv>.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-fldv>.tp-fldv_b{border-top-left-radius:var(--elm-br);border-bottom-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv>.tp-fldv.tp-fldv-expanded>.tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b{border-bottom-left-radius:0}.tp-tabv_c .tp-brkv .tp-fldv>.tp-fldv_c,.tp-fldv_c .tp-fldv>.tp-fldv_c{border-bottom-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv>.tp-cntv+.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-cntv+.tp-fldv>.tp-fldv_b{border-top-left-radius:0}.tp-tabv_c .tp-brkv>.tp-cntv+.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-cntv+.tp-tabv>.tp-tabv_t{border-top-left-radius:0}.tp-tabv_c .tp-brkv>.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-tabv>.tp-tabv_t{border-top-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv .tp-tabv>.tp-tabv_c,.tp-fldv_c .tp-tabv>.tp-tabv_c{border-bottom-left-radius:var(--elm-br)}.tp-rotv_b,.tp-fldv_b{background-color:var(--cnt-bg);color:var(--cnt-fg);cursor:pointer;display:block;height:calc(var(--bld-us) + 4px);line-height:calc(var(--bld-us) + 4px);overflow:hidden;padding-left:var(--cnt-h-p);padding-right:calc(4px + var(--bld-us) + var(--cnt-h-p));position:relative;text-align:left;text-overflow:ellipsis;white-space:nowrap;width:100%;transition:border-radius .2s ease-in-out .2s}.tp-rotv_b:hover,.tp-fldv_b:hover{background-color:var(--cnt-bg-h)}.tp-rotv_b:focus,.tp-fldv_b:focus{background-color:var(--cnt-bg-f)}.tp-rotv_b:active,.tp-fldv_b:active{background-color:var(--cnt-bg-a)}.tp-rotv_b:disabled,.tp-fldv_b:disabled{opacity:.5}.tp-rotv_m,.tp-fldv_m{background:linear-gradient(to left, var(--cnt-fg), var(--cnt-fg) 2px, transparent 2px, transparent 4px, var(--cnt-fg) 4px);border-radius:2px;bottom:0;content:"";display:block;height:6px;right:calc(var(--cnt-h-p) + (var(--bld-us) + 4px - 6px)/2 - 2px);margin:auto;opacity:.5;position:absolute;top:0;transform:rotate(90deg);transition:transform .2s ease-in-out;width:6px}.tp-rotv.tp-rotv-expanded .tp-rotv_m,.tp-fldv.tp-fldv-expanded>.tp-fldv_b>.tp-fldv_m{transform:none}.tp-rotv_c,.tp-fldv_c{box-sizing:border-box;height:0;opacity:0;overflow:hidden;padding-bottom:0;padding-top:0;position:relative;transition:height .2s ease-in-out,opacity .2s linear,padding .2s ease-in-out}.tp-rotv.tp-rotv-cpl:not(.tp-rotv-expanded) .tp-rotv_c,.tp-fldv.tp-fldv-cpl:not(.tp-fldv-expanded)>.tp-fldv_c{display:none}.tp-rotv.tp-rotv-expanded .tp-rotv_c,.tp-fldv.tp-fldv-expanded>.tp-fldv_c{opacity:1;padding-bottom:var(--cnt-v-p);padding-top:var(--cnt-v-p);transform:none;overflow:visible;transition:height .2s ease-in-out,opacity .2s linear .2s,padding .2s ease-in-out}.tp-lstv,.tp-coltxtv_m{position:relative}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m,.tp-coltxtv_mm{bottom:0;margin:auto;pointer-events:none;position:absolute;right:2px;top:0}.tp-lstv_m svg,.tp-coltxtv_mm svg{bottom:0;height:16px;margin:auto;position:absolute;right:0;top:0;width:16px}.tp-lstv_m svg path,.tp-coltxtv_mm svg path{fill:currentColor}.tp-pndtxtv,.tp-coltxtv_w{display:flex}.tp-pndtxtv_a,.tp-coltxtv_c{width:100%}.tp-pndtxtv_a+.tp-pndtxtv_a,.tp-coltxtv_c+.tp-pndtxtv_a,.tp-pndtxtv_a+.tp-coltxtv_c,.tp-coltxtv_c+.tp-coltxtv_c{margin-left:2px}.tp-btnv_b{width:100%}.tp-btnv_t{text-align:center}.tp-ckbv_l{display:block;position:relative}.tp-ckbv_i{left:0;opacity:0;position:absolute;top:0}.tp-ckbv_w{background-color:var(--in-bg);border-radius:var(--elm-br);cursor:pointer;display:block;height:var(--bld-us);position:relative;width:var(--bld-us)}.tp-ckbv_w svg{bottom:0;display:block;height:16px;left:0;margin:auto;opacity:0;position:absolute;right:0;top:0;width:16px}.tp-ckbv_w svg path{fill:none;stroke:var(--in-fg);stroke-width:2}.tp-ckbv_i:hover+.tp-ckbv_w{background-color:var(--in-bg-h)}.tp-ckbv_i:focus+.tp-ckbv_w{background-color:var(--in-bg-f)}.tp-ckbv_i:active+.tp-ckbv_w{background-color:var(--in-bg-a)}.tp-ckbv_i:checked+.tp-ckbv_w svg{opacity:1}.tp-ckbv.tp-v-disabled .tp-ckbv_w{opacity:.5}.tp-colv{position:relative}.tp-colv_h{display:flex}.tp-colv_s{flex-grow:0;flex-shrink:0;width:var(--bld-us)}.tp-colv_t{flex:1;margin-left:4px}.tp-colv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-colv.tp-colv-expanded.tp-colv-cpl .tp-colv_p{overflow:visible}.tp-colv.tp-colv-expanded .tp-colv_p{margin-top:var(--bld-s);opacity:1}.tp-colv .tp-popv{left:calc(-1*var(--cnt-h-p));right:calc(-1*var(--cnt-h-p));top:var(--bld-us)}.tp-colpv_h,.tp-colpv_ap{margin-left:6px;margin-right:6px}.tp-colpv_h{margin-top:var(--bld-s)}.tp-colpv_rgb{display:flex;margin-top:var(--bld-s);width:100%}.tp-colpv_a{display:flex;margin-top:var(--cnt-v-p);padding-top:calc(var(--cnt-v-p) + 2px);position:relative}.tp-colpv_a::before{background-color:var(--grv-fg);content:"";height:2px;left:calc(-1*var(--cnt-h-p));position:absolute;right:calc(-1*var(--cnt-h-p));top:0}.tp-colpv.tp-v-disabled .tp-colpv_a::before{opacity:.5}.tp-colpv_ap{align-items:center;display:flex;flex:3}.tp-colpv_at{flex:1;margin-left:4px}.tp-svpv{border-radius:var(--elm-br);outline:none;overflow:hidden;position:relative}.tp-svpv.tp-v-disabled{opacity:.5}.tp-svpv_c{cursor:crosshair;display:block;height:calc(var(--bld-us)*4);width:100%}.tp-svpv_m{border-radius:100%;border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;filter:drop-shadow(0 0 1px rgba(0, 0, 0, 0.3));height:12px;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;width:12px}.tp-svpv:focus .tp-svpv_m{border-color:#fff}.tp-hplv{cursor:pointer;height:var(--bld-us);outline:none;position:relative}.tp-hplv.tp-v-disabled{opacity:.5}.tp-hplv_c{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAABCAYAAABubagXAAAAQ0lEQVQoU2P8z8Dwn0GCgQEDi2OK/RBgYHjBgIpfovFh8j8YBIgzFGQxuqEgPhaDOT5gOhPkdCxOZeBg+IDFZZiGAgCaSSMYtcRHLgAAAABJRU5ErkJggg==);background-position:left top;background-repeat:no-repeat;background-size:100% 100%;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;position:absolute;top:50%;width:100%}.tp-hplv_m{border-radius:var(--elm-br);border:rgba(255,255,255,.75) solid 2px;box-shadow:0 0 2px rgba(0,0,0,.1);box-sizing:border-box;height:12px;left:50%;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;top:50%;width:12px}.tp-hplv:focus .tp-hplv_m{border-color:#fff}.tp-aplv{cursor:pointer;height:var(--bld-us);outline:none;position:relative;width:100%}.tp-aplv.tp-v-disabled{opacity:.5}.tp-aplv_b{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:4px 4px;background-position:0 0,2px 2px;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;overflow:hidden;position:absolute;top:50%;width:100%}.tp-aplv_c{bottom:0;left:0;position:absolute;right:0;top:0}.tp-aplv_m{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:12px 12px;background-position:0 0,6px 6px;border-radius:var(--elm-br);box-shadow:0 0 2px rgba(0,0,0,.1);height:12px;left:50%;margin-left:-6px;margin-top:-6px;overflow:hidden;pointer-events:none;position:absolute;top:50%;width:12px}.tp-aplv_p{border-radius:var(--elm-br);border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;bottom:0;left:0;position:absolute;right:0;top:0}.tp-aplv:focus .tp-aplv_p{border-color:#fff}.tp-colswv{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:10px 10px;background-position:0 0,5px 5px;border-radius:var(--elm-br);overflow:hidden}.tp-colswv.tp-v-disabled{opacity:.5}.tp-colswv_sw{border-radius:0}.tp-colswv_b{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;cursor:pointer;display:block;height:var(--bld-us);left:0;margin:0;outline:none;padding:0;position:absolute;top:0;width:var(--bld-us)}.tp-colswv_b:focus::after{border:rgba(255,255,255,.75) solid 2px;border-radius:var(--elm-br);bottom:0;content:"";display:block;left:0;position:absolute;right:0;top:0}.tp-coltxtv{display:flex;width:100%}.tp-coltxtv_m{margin-right:4px}.tp-coltxtv_ms{border-radius:var(--elm-br);color:var(--lbl-fg);cursor:pointer;height:var(--bld-us);line-height:var(--bld-us);padding:0 18px 0 4px}.tp-coltxtv_ms:hover{background-color:var(--in-bg-h)}.tp-coltxtv_ms:focus{background-color:var(--in-bg-f)}.tp-coltxtv_ms:active{background-color:var(--in-bg-a)}.tp-coltxtv_mm{color:var(--lbl-fg)}.tp-coltxtv.tp-v-disabled .tp-coltxtv_mm{opacity:.5}.tp-coltxtv_w{flex:1}.tp-dfwv{position:absolute;top:8px;right:8px;width:256px}.tp-fldv{position:relative}.tp-fldv.tp-fldv-not .tp-fldv_b{display:none}.tp-fldv_t{padding-left:4px}.tp-fldv_b:disabled .tp-fldv_m{display:none}.tp-fldv_c{padding-left:4px}.tp-fldv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--bld-us) + 4px);width:var(--bs-br)}.tp-fldv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-fldv_b:hover+.tp-fldv_i{color:var(--cnt-bg-h)}.tp-fldv_b:focus+.tp-fldv_i{color:var(--cnt-bg-f)}.tp-fldv_b:active+.tp-fldv_i{color:var(--cnt-bg-a)}.tp-fldv.tp-v-disabled>.tp-fldv_i{opacity:.5}.tp-grlv{position:relative}.tp-grlv_g{display:block;height:calc(var(--bld-us)*3)}.tp-grlv_g polyline{fill:none;stroke:var(--mo-fg);stroke-linejoin:round}.tp-grlv_t{margin-top:-4px;transition:left .05s,top .05s;visibility:hidden}.tp-grlv_t.tp-grlv_t-a{visibility:visible}.tp-grlv_t.tp-grlv_t-in{transition:none}.tp-grlv.tp-v-disabled .tp-grlv_g{opacity:.5}.tp-grlv .tp-ttv{background-color:var(--mo-fg)}.tp-grlv .tp-ttv::before{border-top-color:var(--mo-fg)}.tp-lblv{align-items:center;display:flex;line-height:1.3;padding-left:var(--cnt-h-p);padding-right:var(--cnt-h-p)}.tp-lblv.tp-lblv-nol{display:block}.tp-lblv_l{color:var(--lbl-fg);flex:1;-webkit-hyphens:auto;hyphens:auto;overflow:hidden;padding-left:4px;padding-right:16px}.tp-lblv.tp-v-disabled .tp-lblv_l{opacity:.5}.tp-lblv.tp-lblv-nol .tp-lblv_l{display:none}.tp-lblv_v{align-self:flex-start;flex-grow:0;flex-shrink:0;width:160px}.tp-lblv.tp-lblv-nol .tp-lblv_v{width:100%}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m{color:var(--btn-fg)}.tp-sglv_i{padding:0 4px}.tp-sglv.tp-v-disabled .tp-sglv_i{opacity:.5}.tp-mllv_i{display:block;height:calc(var(--bld-us)*3);line-height:var(--bld-us);padding:0 4px;resize:none;white-space:pre}.tp-mllv.tp-v-disabled .tp-mllv_i{opacity:.5}.tp-p2dv{position:relative}.tp-p2dv_h{display:flex}.tp-p2dv_b{height:var(--bld-us);margin-right:4px;position:relative;width:var(--bld-us)}.tp-p2dv_b svg{display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px}.tp-p2dv_b svg path{stroke:currentColor;stroke-width:2}.tp-p2dv_b svg circle{fill:currentColor}.tp-p2dv_t{flex:1}.tp-p2dv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-p2dv.tp-p2dv-expanded .tp-p2dv_p{margin-top:var(--bld-s);opacity:1}.tp-p2dv .tp-popv{left:calc(-1*var(--cnt-h-p));right:calc(-1*var(--cnt-h-p));top:var(--bld-us)}.tp-p2dpv{padding-left:calc(var(--bld-us) + 4px)}.tp-p2dpv_p{cursor:crosshair;height:0;overflow:hidden;padding-bottom:100%;position:relative}.tp-p2dpv.tp-v-disabled .tp-p2dpv_p{opacity:.5}.tp-p2dpv_g{display:block;height:100%;left:0;pointer-events:none;position:absolute;top:0;width:100%}.tp-p2dpv_ax{opacity:.1;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_l{opacity:.5;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_m{border:var(--in-fg) solid 1px;border-radius:50%;box-sizing:border-box;height:4px;margin-left:-2px;margin-top:-2px;position:absolute;width:4px}.tp-p2dpv_p:focus .tp-p2dpv_m{background-color:var(--in-fg);border-width:0}.tp-popv{background-color:var(--bs-bg);border-radius:6px;box-shadow:0 2px 4px var(--bs-sh);display:none;max-width:168px;padding:var(--cnt-v-p) var(--cnt-h-p);position:absolute;visibility:hidden;z-index:1000}.tp-popv.tp-popv-v{display:block;visibility:visible}.tp-sprv_r{background-color:var(--grv-fg);border-width:0;display:block;height:2px;margin:0;width:100%}.tp-sprv.tp-v-disabled .tp-sprv_r{opacity:.5}.tp-sldv.tp-v-disabled{opacity:.5}.tp-sldv_t{box-sizing:border-box;cursor:pointer;height:var(--bld-us);margin:0 6px;outline:none;position:relative}.tp-sldv_t::before{background-color:var(--in-bg);border-radius:1px;bottom:0;content:"";display:block;height:2px;left:0;margin:auto;position:absolute;right:0;top:0}.tp-sldv_k{height:100%;left:0;position:absolute;top:0}.tp-sldv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";display:block;height:2px;left:0;margin-bottom:auto;margin-top:auto;position:absolute;right:0;top:0}.tp-sldv_k::after{background-color:var(--btn-bg);border-radius:var(--elm-br);bottom:0;content:"";display:block;height:12px;margin-bottom:auto;margin-top:auto;position:absolute;right:-6px;top:0;width:12px}.tp-sldv_t:hover .tp-sldv_k::after{background-color:var(--btn-bg-h)}.tp-sldv_t:focus .tp-sldv_k::after{background-color:var(--btn-bg-f)}.tp-sldv_t:active .tp-sldv_k::after{background-color:var(--btn-bg-a)}.tp-sldtxtv{display:flex}.tp-sldtxtv_s{flex:2}.tp-sldtxtv_t{flex:1;margin-left:4px}.tp-tabv{position:relative}.tp-tabv_t{align-items:flex-end;color:var(--cnt-bg);display:flex;overflow:hidden;position:relative}.tp-tabv_t:hover{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus){color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active){color:var(--cnt-bg-a)}.tp-tabv_t::before{background-color:currentColor;bottom:0;content:"";height:2px;left:0;pointer-events:none;position:absolute;right:0}.tp-tabv.tp-v-disabled .tp-tabv_t::before{opacity:.5}.tp-tabv.tp-tabv-nop .tp-tabv_t{height:calc(var(--bld-us) + 4px);position:relative}.tp-tabv.tp-tabv-nop .tp-tabv_t::before{background-color:var(--cnt-bg);bottom:0;content:"";height:2px;left:0;position:absolute;right:0}.tp-tabv_c{padding-bottom:var(--cnt-v-p);padding-left:4px;padding-top:var(--cnt-v-p)}.tp-tabv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--bld-us) + 4px);width:var(--bs-br)}.tp-tabv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-tabv_t:hover+.tp-tabv_i{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus)+.tp-tabv_i{color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active)+.tp-tabv_i{color:var(--cnt-bg-a)}.tp-tabv.tp-v-disabled>.tp-tabv_i{opacity:.5}.tp-tbiv{flex:1;min-width:0;position:relative}.tp-tbiv+.tp-tbiv{margin-left:2px}.tp-tbiv+.tp-tbiv.tp-v-disabled::before{opacity:.5}.tp-tbiv_b{display:block;padding-left:calc(var(--cnt-h-p) + 4px);padding-right:calc(var(--cnt-h-p) + 4px);position:relative;width:100%}.tp-tbiv_b:disabled{opacity:.5}.tp-tbiv_b::before{background-color:var(--cnt-bg);bottom:2px;content:"";left:0;pointer-events:none;position:absolute;right:0;top:0}.tp-tbiv_b:hover::before{background-color:var(--cnt-bg-h)}.tp-tbiv_b:focus::before{background-color:var(--cnt-bg-f)}.tp-tbiv_b:active::before{background-color:var(--cnt-bg-a)}.tp-tbiv_t{color:var(--cnt-fg);height:calc(var(--bld-us) + 4px);line-height:calc(var(--bld-us) + 4px);opacity:.5;overflow:hidden;text-overflow:ellipsis}.tp-tbiv.tp-tbiv-sel .tp-tbiv_t{opacity:1}.tp-txtv{position:relative}.tp-txtv_i{padding:0 4px}.tp-txtv.tp-txtv-fst .tp-txtv_i{border-bottom-right-radius:0;border-top-right-radius:0}.tp-txtv.tp-txtv-mid .tp-txtv_i{border-radius:0}.tp-txtv.tp-txtv-lst .tp-txtv_i{border-bottom-left-radius:0;border-top-left-radius:0}.tp-txtv.tp-txtv-num .tp-txtv_i{text-align:right}.tp-txtv.tp-txtv-drg .tp-txtv_i{opacity:.3}.tp-txtv_k{cursor:pointer;height:100%;left:-3px;position:absolute;top:0;width:12px}.tp-txtv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";height:calc(var(--bld-us) - 4px);left:50%;margin-bottom:auto;margin-left:-1px;margin-top:auto;opacity:.1;position:absolute;top:0;transition:border-radius .1s,height .1s,transform .1s,width .1s;width:2px}.tp-txtv_k:hover::before,.tp-txtv.tp-txtv-drg .tp-txtv_k::before{opacity:1}.tp-txtv.tp-txtv-drg .tp-txtv_k::before{border-radius:50%;height:4px;transform:translateX(-1px);width:4px}.tp-txtv_g{bottom:0;display:block;height:8px;left:50%;margin:auto;overflow:visible;pointer-events:none;position:absolute;top:0;visibility:hidden;width:100%}.tp-txtv.tp-txtv-drg .tp-txtv_g{visibility:visible}.tp-txtv_gb{fill:none;stroke:var(--in-fg);stroke-dasharray:1}.tp-txtv_gh{fill:none;stroke:var(--in-fg)}.tp-txtv .tp-ttv{margin-left:6px;visibility:hidden}.tp-txtv.tp-txtv-drg .tp-ttv{visibility:visible}.tp-ttv{background-color:var(--in-fg);border-radius:var(--elm-br);color:var(--bs-bg);padding:2px 4px;pointer-events:none;position:absolute;transform:translate(-50%, -100%)}.tp-ttv::before{border-color:var(--in-fg) rgba(0,0,0,0) rgba(0,0,0,0) rgba(0,0,0,0);border-style:solid;border-width:2px;box-sizing:border-box;content:"";font-size:.9em;height:4px;left:50%;margin-left:-2px;position:absolute;top:100%;width:4px}.tp-rotv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);font-family:var(--font-family);font-size:11px;font-weight:500;line-height:1;text-align:left}.tp-rotv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br);border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br);padding-left:calc(4px + var(--bld-us) + var(--cnt-h-p));text-align:center}.tp-rotv.tp-rotv-expanded .tp-rotv_b{border-bottom-left-radius:0;border-bottom-right-radius:0}.tp-rotv.tp-rotv-not .tp-rotv_b{display:none}.tp-rotv_b:disabled .tp-rotv_m{display:none}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c .tp-fldv.tp-v-vlst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-right-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst{margin-top:calc(-1*var(--cnt-v-p))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst>.tp-fldv_b{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst{margin-top:calc(-1*var(--cnt-v-p))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst>.tp-tabv_t{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv.tp-v-disabled,.tp-rotv .tp-v-disabled{pointer-events:none}.tp-rotv.tp-v-hidden,.tp-rotv .tp-v-hidden{display:none}'),this.pool_.getAll().forEach(o=>{this.embedPluginStyle_(o)}),this.registerPlugin({plugins:[tv,Kg,ft,nv]})}}const rv=new n("3.1.10");t.BladeApi=s,t.ButtonApi=_,t.FolderApi=as,t.InputBindingApi=Nt,t.ListApi=uu,t.MonitorBindingApi=tn,t.Pane=sv,t.SeparatorApi=Z,t.SliderApi=du,t.TabApi=pt,t.TabPageApi=ct,t.TextApi=pu,t.TpChangeEvent=a,t.VERSION=rv,Object.defineProperty(t,"__esModule",{value:!0})})}(Er,Er.exports)),Er.exports}var $y=jy();class Eo extends is{constructor(e,t){super();const n=this,s={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM_PAN:4};this.object=e,this.domElement=t,this.enabled=!0,this.screen={left:0,top:0,width:0,height:0},this.length=10,this.scale=.5,this.scale0=.5,this.aspect=1,this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.keys=["KeyA","KeyS","KeyD"],this.mouseButtons={LEFT:ja.ROTATE,MIDDLE:ja.DOLLY,RIGHT:ja.PAN},this.autoRotate=!1,this.autoRotateSpeed=2,this.target=new I;const r=1e-6,a=new I;let c=1,u=s.NONE,d=s.NONE,f=0,m=0,v=0;const g=new I,b=new Ue,y=new Ue,x=new I,_=new Ue,w=new Ue,E=new Ue,M=new Ue,P=[],D={};this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.up0=this.object.up.clone(),this.zoom0=this.object.zoom;const O={type:"change"},U={type:"start"},L={type:"end"};this.handleResize=function(){const j=n.domElement.getBoundingClientRect(),ge=n.domElement.ownerDocument.documentElement;n.screen.left=j.left+window.pageXOffset-ge.clientLeft,n.screen.top=j.top+window.pageYOffset-ge.clientTop,n.screen.width=j.width,n.screen.height=j.height};const A=function(){const j=new Ue;return function(Xe,k){return j.set((Xe-n.screen.left)/n.screen.width,(k-n.screen.top)/n.screen.height),j}}(),F=function(){const j=new Ue;return function(Xe,k){return j.set((Xe-n.screen.width*.5-n.screen.left)/(n.screen.width*.5),(n.screen.height+2*(n.screen.top-k))/n.screen.width),j}}();function q(j){return 2*Math.PI/60/60*n.autoRotateSpeed*(j*60)}this.rotateCamera=function(){const j=new I,ge=new Ui,Xe=new I,k=new I,ut=new I,Ne=new I;let He,Ie,dt;return function(N){Ie=y.x-b.x,dt=y.y-b.y,Ne.set(Ie,dt,0),He=Ne.length(),He*=n.rotateSpeed,n.autoRotate&&u===s.NONE&&(He=q(N),Ie=He,dt=0,Ne.set(He,0,0)),He?(g.copy(n.object.position).sub(n.target),Xe.copy(g).normalize(),k.copy(n.object.up).normalize(),ut.crossVectors(k,Xe).normalize(),k.setLength(dt),ut.setLength(Ie),Ne.copy(k.add(ut)),j.crossVectors(Ne,g).normalize(),ge.setFromAxisAngle(j,He),g.applyQuaternion(ge),n.object.up.applyQuaternion(ge),x.copy(j),v=He):!n.staticMoving&&v&&(v*=Math.sqrt(1-n.dynamicDampingFactor),g.copy(n.object.position).sub(n.target),ge.setFromAxisAngle(x,v),g.applyQuaternion(ge),n.object.up.applyQuaternion(ge)),b.copy(y)}}(),this.zoomCamera=function(){let j;u===s.TOUCH_ZOOM_PAN?(j=f/m,f=m,n.object.isPerspectiveCamera?g.multiplyScalar(j):n.object.isOrthographicCamera?(n.scale=n.scale*j,n.object.zoom/=j,n.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")):(j=1+(w.y-_.y)*n.zoomSpeed,j!==1&&j>0&&(n.object.isPerspectiveCamera?g.multiplyScalar(j):n.object.isOrthographicCamera?(n.scale=n.scale*j,n.object.zoom/=j,n.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")),n.staticMoving?_.copy(w):_.y+=(w.y-_.y)*this.dynamicDampingFactor)},this.panCamera=function(){const j=new Ue,ge=new I,Xe=new I;return function(){if(j.copy(M).sub(E),j.lengthSq()){if(n.object.isOrthographicCamera){const ut=(n.object.right-n.object.left)/n.object.zoom/n.domElement.clientWidth,Ne=(n.object.top-n.object.bottom)/n.object.zoom/n.domElement.clientWidth;j.x*=ut,j.y*=Ne}j.multiplyScalar(g.length()*n.panSpeed),Xe.copy(g).cross(n.object.up).setLength(j.x),Xe.add(ge.copy(n.object.up).setLength(j.y)),n.object.position.add(Xe),n.target.add(Xe),n.staticMoving?E.copy(M):E.add(j.subVectors(M,E).multiplyScalar(n.dynamicDampingFactor))}}}(),this.checkDistances=function(){(!n.noZoom||!n.noPan)&&(g.lengthSq()>n.maxDistance*n.maxDistance&&(n.object.position.addVectors(n.target,g.setLength(n.maxDistance)),_.copy(w)),g.lengthSq()<n.minDistance*n.minDistance&&(n.object.position.addVectors(n.target,g.setLength(n.minDistance)),_.copy(w)))},this.update=function(j){n.enabled!==!1&&(j=j||0,g.subVectors(n.object.position,n.target),n.noRotate||n.rotateCamera(j),n.noZoom||n.zoomCamera(),n.noPan||n.panCamera(),n.object.position.addVectors(n.target,g),n.object.isPerspectiveCamera?(n.checkDistances(),n.object.lookAt(n.target),a.distanceToSquared(n.object.position)>r&&(n.dispatchEvent(O),a.copy(n.object.position))):n.object.isOrthographicCamera?(n.object.lookAt(n.target),(a.distanceToSquared(n.object.position)>r||c!==n.object.zoom)&&(n.dispatchEvent(O),a.copy(n.object.position),c=n.object.zoom)):console.warn("THREE.TrackballControls: Unsupported camera type"))},this.reset=function(){u=s.NONE,d=s.NONE,n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.up.copy(n.up0),n.object.zoom=n.zoom0,n.scale=n.scale0,n.object.updateProjectionMatrix(),g.subVectors(n.object.position,n.target),n.object.lookAt(n.target),n.dispatchEvent(O),a.copy(n.object.position),c=n.object.zoom};function X(j){n.enabled!==!1&&(P.length===0&&(n.domElement.setPointerCapture(j.pointerId),n.domElement.addEventListener("pointermove",J),n.domElement.addEventListener("pointerup",Q)),me(j),j.pointerType==="touch"?st(j):le(j))}function J(j){n.enabled!==!1&&(j.pointerType==="touch"?Y(j):ce(j))}function Q(j){n.enabled!==!1&&(j.pointerType==="touch"?ae(j):re(),Le(j),P.length===0&&(n.domElement.releasePointerCapture(j.pointerId),n.domElement.removeEventListener("pointermove",J),n.domElement.removeEventListener("pointerup",Q)))}function te(j){Le(j)}function ee(j){n.enabled!==!1&&(window.removeEventListener("keydown",ee),d===s.NONE&&(j.code===n.keys[s.ROTATE]&&!n.noRotate?d=s.ROTATE:j.code===n.keys[s.ZOOM]&&!n.noZoom?d=s.ZOOM:j.code===n.keys[s.PAN]&&!n.noPan&&(d=s.PAN)))}function z(j){n.enabled!==!1&&(d=s.NONE,window.addEventListener("keydown",ee))}function le(j){if(u===s.NONE)switch(j.button){case n.mouseButtons.LEFT:u=s.ROTATE;break;case n.mouseButtons.MIDDLE:u=s.ZOOM;break;case n.mouseButtons.RIGHT:u=s.PAN;break}const ge=d!==s.NONE?d:u;ge===s.ROTATE&&!n.noRotate?(y.copy(F(j.pageX,j.pageY)),b.copy(y)):ge===s.ZOOM&&!n.noZoom?(_.copy(A(j.pageX,j.pageY)),w.copy(_)):ge===s.PAN&&!n.noPan&&(E.copy(A(j.pageX,j.pageY)),M.copy(E)),n.dispatchEvent(U)}function ce(j){const ge=d!==s.NONE?d:u;ge===s.ROTATE&&!n.noRotate?(b.copy(y),y.copy(F(j.pageX,j.pageY))):ge===s.ZOOM&&!n.noZoom?w.copy(A(j.pageX,j.pageY)):ge===s.PAN&&!n.noPan&&M.copy(A(j.pageX,j.pageY))}function re(){u=s.NONE,n.dispatchEvent(L)}function Re(j){if(n.enabled!==!1&&n.noZoom!==!0){switch(j.preventDefault(),j.deltaMode){case 2:_.y-=j.deltaY*.025;break;case 1:_.y-=j.deltaY*.01;break;default:_.y-=j.deltaY*25e-5;break}n.dispatchEvent(U),n.dispatchEvent(L)}}function st(j){Fe(j);let ge,Xe,k,ut;switch(P.length){case 1:u=s.TOUCH_ROTATE,y.copy(F(P[0].pageX,P[0].pageY)),b.copy(y);break;default:u=s.TOUCH_ZOOM_PAN,ge=P[0].pageX-P[1].pageX,Xe=P[0].pageY-P[1].pageY,m=f=Math.sqrt(ge*ge+Xe*Xe),k=(P[0].pageX+P[1].pageX)/2,ut=(P[0].pageY+P[1].pageY)/2,E.copy(A(k,ut)),M.copy(E);break}n.dispatchEvent(U)}function Y(j){Fe(j);let ge,Xe,k,ut,Ne;switch(P.length){case 1:b.copy(y),y.copy(F(j.pageX,j.pageY));break;default:ge=Ve(j),Xe=j.pageX-ge.x,k=j.pageY-ge.y,m=Math.sqrt(Xe*Xe+k*k),ut=(j.pageX+ge.x)/2,Ne=(j.pageY+ge.y)/2,M.copy(A(ut,Ne));break}}function ae(j){switch(P.length){case 0:u=s.NONE;break;case 1:u=s.TOUCH_ROTATE,y.copy(F(j.pageX,j.pageY)),b.copy(y);break;case 2:u=s.TOUCH_ZOOM_PAN,y.copy(F(j.pageX-b.x,j.pageY-b.y)),b.copy(y);break}n.dispatchEvent(L)}function ye(j){n.enabled!==!1&&j.preventDefault()}function me(j){P.push(j)}function Le(j){delete D[j.pointerId];for(let ge=0;ge<P.length;ge++)if(P[ge].pointerId==j.pointerId){P.splice(ge,1);return}}function Fe(j){let ge=D[j.pointerId];ge===void 0&&(ge=new Ue,D[j.pointerId]=ge),ge.set(j.pageX,j.pageY)}function Ve(j){const ge=j.pointerId===P[0].pointerId?P[1]:P[0];return D[ge.pointerId]}this.dispose=function(){n.domElement.removeEventListener("contextmenu",ye),n.domElement.removeEventListener("pointerdown",X),n.domElement.removeEventListener("pointercancel",te),n.domElement.removeEventListener("wheel",Re),n.domElement.removeEventListener("pointermove",J),n.domElement.removeEventListener("pointerup",Q),window.removeEventListener("keydown",ee),window.removeEventListener("keyup",z)},this.domElement.addEventListener("contextmenu",ye),this.domElement.addEventListener("pointerdown",X),this.domElement.addEventListener("pointercancel",te),this.domElement.addEventListener("wheel",Re,{passive:!1}),window.addEventListener("keydown",ee),window.addEventListener("keyup",z),this.handleResize(),this.update()}}class Ky{constructor(){this.beginTime=(performance||Date).now(),this.prevTime=this.beginTime,this.frames=0,this.lastFrameMs=0,this.lastFPS=0}begin(){this.beginTime=(performance||Date).now()}end(){this.frames++;const e=(performance||Date).now();return this.lastFrameMs=e-this.beginTime,e>=this.prevTime+1e3&&(this.lastFPS=this.frames*1e3/(e-this.prevTime),this.prevTime=e,this.frames=0),e}update(){this.beginTime=this.end()}}const Zy=`
<svg enable-background="new 0 0 150 75.3" viewBox="0 0 150 75.3" xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <linearGradient id="a" gradientTransform="matrix(1 0 0 -1 0 76)" gradientUnits="userSpaceOnUse" x1=".3035"
    x2="149.6965" y1="19.59" y2="19.59">
    <stop offset="0" stop-color="currentColor" stop-opacity="0" />
    <stop offset=".16" stop-color="currentColor" />
    <stop offset=".84" stop-color="currentColor" />
    <stop offset="1" stop-color="currentColor" stop-opacity="0" />
  </linearGradient>
  <g fill="none">
    <path d="m.5 39.1 149 34.6" stroke="url(#a)" stroke-miterlimit="10" stroke-width="4" />
    <path d="m101.5 73.6 11-8.5" stroke="currentColor" stroke-miterlimit="10" stroke-width="4" />
    <path d="m25.1 55.7 11-8.5" stroke="currentColor" stroke-miterlimit="10" stroke-width="4" />
    <path
      d="m36.2 40c0-12 5.3-12.4 10.5-14.2 5-1.7 17.3 1.9 22.6 1.7s8-5 8.4-11.8c-.4 6.9 3.4 13.8 10 16.3 8 3 17.9 2.7 23.2 7.3 7 6 3.3 12.2 1.6 19.1"
      stroke="white" stroke-dasharray="2 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
  </g>
</svg>
`,Sd={int8:Int8Array,int16:Int16Array,int32:Int32Array,int64:globalThis.BigInt64Array,uint8:Uint8Array,uint16:Uint16Array,uint32:Uint32Array,uint64:globalThis.BigUint64Array,float32:Float32Array,float64:Float64Array},Jy=0;var Ze=(i=>(i[i.RAYMARCH=0]="RAYMARCH",i[i.PATHTRACE=1]="PATHTRACE",i[i.SLICE=2]="SLICE",i))(Ze||{});const On=i=>i&&i.isOrthographicCamera,Qy=i=>i&&i.isPerspectiveCamera;var Wo=(i=>(i.TOP_LEFT="top_left",i.TOP_RIGHT="top_right",i.BOTTOM_LEFT="bottom_left",i.BOTTOM_RIGHT="bottom_right",i))(Wo||{});const Md=i=>i==="top_left"||i==="top_right",Ed=i=>i==="top_right"||i==="bottom_right";var on=(i=>(i[i.MILLISECOND=0]="MILLISECOND",i[i.SECOND=1]="SECOND",i[i.MINUTE=2]="MINUTE",i[i.HOUR=3]="HOUR",i[i.DAY=4]="DAY",i))(on||{});const ew={0:new Set(["ms","millisecond","milliseconds"]),1:new Set(["s","sec","second","seconds"]),2:new Set(["m","min","minute","minutes"]),3:new Set(["h","hr","hour","hours"]),4:new Set(["d","day","days"])};function tw(i){for(const[e,t]of Object.entries(ew))if(t.has(i))return e}var Pe=(i=>(i[i.TRANSFORM=1]="TRANSFORM",i[i.CAMERA=2]="CAMERA",i[i.BOUNDING_BOX=4]="BOUNDING_BOX",i[i.ROI=8]="ROI",i[i.MASK_ALPHA=16]="MASK_ALPHA",i[i.MATERIAL=32]="MATERIAL",i[i.SAMPLING=64]="SAMPLING",i[i.VIEW=128]="VIEW",i[i.MASK_DATA=256]="MASK_DATA",i[i.ALL=1023]="ALL",i))(Pe||{}),Pt=(i=>(i.X="x",i.Y="y",i.Z="z",i.XYZ="",i.NONE="",i))(Pt||{});class Li{constructor(e){this.translation=new I(0,0,0),this.rotation=new en,this.scale=new I(1,1,1),this.isOrtho=!1,this.viewAxis="",this.orthoScale=1,this.flipAxes=new I(1,1,1),this.maskChannelIndex=-1,this.maskAlpha=1,this.gammaMin=0,this.gammaLevel=1,this.gammaMax=1,this.density=0,this.brightness=0,this.showBoundingBox=!1,this.bounds={bmin:new I(-.5,-.5,-.5),bmax:new I(.5,.5,.5)},this.boundingBoxColor=[1,1,0],this.primaryRayStepSize=1,this.secondaryRayStepSize=1,this.useInterpolation=!0,this.visible=!0,this.maxProjectMode=!1,e?(this.zSlice=Math.floor(e.imageInfo.subregionSize.z/2),this.diffuse=new Array(e.imageInfo.numChannels).fill([255,255,255]),this.specular=new Array(e.imageInfo.numChannels).fill([0,0,0]),this.emissive=new Array(e.imageInfo.numChannels).fill([0,0,0]),this.glossiness=new Array(e.imageInfo.numChannels).fill(0)):(this.zSlice=0,this.diffuse=[[255,255,255]],this.specular=[[0,0,0]],this.emissive=[[0,0,0]],this.glossiness=[0]),this.pixelSamplingRate=.75,this.resolution=new Ue(1,1)}resizeWithVolume(e){this.zSlice=Math.floor(e.imageInfo.subregionSize.z/2),this.diffuse=new Array(e.imageInfo.numChannels).fill([255,255,255]),this.specular=new Array(e.imageInfo.numChannels).fill([0,0,0]),this.emissive=new Array(e.imageInfo.numChannels).fill([0,0,0]),this.glossiness=new Array(e.imageInfo.numChannels).fill(0)}static compareArray(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++){const s=e[n],r=t[n];if(s instanceof Array&&r instanceof Array){if(!this.compareArray(s,r))return!1}else if(s!==r)return!1}return!0}isEqual(e){for(const t of Object.keys(this)){const n=this[t],s=e[t];if(n instanceof Array){if(!Li.compareArray(n,s))return!1}else if(n&&n.bmin!==void 0){const r=n,a=s;if(!r.bmin.equals(a.bmin)||!r.bmax.equals(a.bmax))return!1}else if(n instanceof I||n instanceof Ue||n instanceof en){if(!n.equals(s))return!1}else if(n!==s)return!1}return!0}static deepCopyArray(e){const t=new Array(e.length);for(let n=0;n<e.length;n++){const s=e[n];s instanceof Array?t[n]=this.deepCopyArray(s):t[n]=s}return t}clone(){const e=new Li;for(const t of Object.keys(this)){const n=this[t];n instanceof Array?e[t]=Li.deepCopyArray(n):t==="bounds"?(e.bounds.bmax=this.bounds.bmax.clone(),e.bounds.bmin=this.bounds.bmin.clone()):n instanceof I||n instanceof Ue||n instanceof en?e[t]=n.clone():n instanceof String?e[t]=""+n:e[t]=n}return e}}const kp=5,Hs=1e3,Ir=Hs*60,Dr=Ir*60,ea=Dr*24;function nw(i){const e=[8304,185,178,179,8308,8309,8310,8311,8312,8313];return String.fromCharCode(e[i])}function Ad(i,e=kp){const t=i.toExponential(e-1),[n,s]=t.split("e"),r=s[0]==="-"?"⁻":"",c=s.slice(1).split("").map(u=>nw(Number(u))).join("");return`${n}×10${r}${c}`}function iw(i,e){const t=Math.floor(Math.log10(Math.abs(i)));return i.toFixed(Math.max(e-t-1,0))}function sw(i,e){let t=i.length-1;for(;i[t]===e;)t--;return i.slice(0,t+1)}function ta(i,e=kp,t=e-2){const n=Math.abs(i);if(Number.isInteger(i))return n>=1e4?Ad(i,t):i.toString();{const s=iw(i,e),r=Math.abs(Number(s));if(r>=1e4||r<.01)return Ad(i,t);const a=sw(s,"0");return a.endsWith(".")?a.slice(0,-1):a}}const rw={[on.MILLISECOND]:1,[on.SECOND]:Hs,[on.MINUTE]:Ir,[on.HOUR]:Dr,[on.DAY]:ea};function Cd(i,e){const t=rw[e];if(t===void 0)throw new Error("Unrecognized time unit");return i*t}function Al(i,e,t){return t?i.toString().padStart(e,"0"):i.toString()}function Td(i,e){const{useMs:t,useSec:n,useMin:s,useHours:r,useDays:a}=e,c=[],u=[];if(a){const d=Math.floor(i/ea);c.push(d.toString()),u.push("d")}if(r){const d=Math.floor(i%ea/Dr);c.push(Al(d,2,a)),u.push("h")}if(s){const d=Math.floor(i%Dr/Ir);c.push(Al(d,2,r)),u.push("m")}if(n){const d=Math.floor(i%Ir/Hs);let f=Al(d,2,s);if(u.push("s"),t){const m=Math.floor(i%Hs);f+="."+m.toString().padStart(3,"0")}c.push(f)}else if(t){const d=Math.floor(i%Hs);c.push(d.toString()),u.push("ms")}return{timestamp:c.join(":"),units:u.join(":")}}function ow(i,e,t){const n=tw(t);if(n===void 0)return`${ta(i)} / ${ta(e)} ${t}`;const s=Cd(i,n),r=Cd(e,n),a={useMs:n==on.MILLISECOND,useSec:n==on.SECOND||n<=on.SECOND&&r>=Hs,useMin:n==on.MINUTE||n<=on.MINUTE&&r>=Ir,useHours:n==on.HOUR||n<=on.HOUR&&r>=Dr,useDays:n==on.DAY||n<=on.DAY&&r>=ea},{timestamp:c,units:u}=Td(s,a),{timestamp:d}=Td(r,a);return`${c} / ${d} ${u}`}function aw(i,e,t){switch(t){case Pt.X:return[i[0],e[1],e[2]];case Pt.Y:return[e[0],i[1],e[2]];case Pt.Z:return[e[0],e[1],i[2]];default:return[...i]}}function na(i){let e=i[0],t=i[0];for(let n=1;n<i.length;n++)e=Math.min(e,i[n]),t=Math.max(t,i[n]);return[e,t]}const ia=`
precision highp float;
precision highp int;
out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`,zp=`
precision highp float;
precision highp int;
precision highp sampler2D;

in vec2 vUv;
uniform sampler2D image;

void main() {
  gl_FragColor = texture2D(image, vUv);
}
`;class Ec{constructor(e,t){this.scene=new ns,this.geometry=new Ni(2,2),this.material=new mn({vertexShader:ia,fragmentShader:e,uniforms:t}),this.material.depthWrite=!1,this.material.depthTest=!1,this.mesh=new Lt(this.geometry,this.material),this.scene.add(this.mesh),this.camera=new oi(-1,1,1,-1,0,1)}render(e,t){e.setRenderTarget(t??null),e.render(this.scene,this.camera),e.setRenderTarget(null)}}const lw=0,ks=1,cw=5,Rd=.1,Pd=20,Cl=.5;class hw{constructor(e,t){this.containerdiv=document.createElement("div"),this.containerdiv.style.position="relative",this.canvas=document.createElement("canvas"),this.containerdiv.appendChild(this.canvas),this.canvas.style.backgroundColor="black",e&&(this.canvas.height=e.offsetHeight,this.canvas.width=e.offsetWidth,e.appendChild(this.containerdiv)),this.scene=new ns,this.meshRenderTarget=new Fn(this.canvas.width,this.canvas.height,{minFilter:It,magFilter:It,format:Xt,type:Qt,depthBuffer:!0}),this.meshRenderToBuffer=new Ec(zp,{image:{value:this.meshRenderTarget.texture}}),this.meshRenderTarget.depthTexture=new jc(this.canvas.width,this.canvas.height),this.scaleBarContainerElement=document.createElement("div"),this.orthoScaleBarElement=document.createElement("div"),this.showOrthoScaleBar=!0,this.perspectiveScaleBarElement=document.createElement("div"),this.showPerspectiveScaleBar=!1,this.timestepIndicatorElement=document.createElement("div"),this.showTimestepIndicator=!1,this.animateFuncs=[],this.inRenderLoop=!1,this.requestedRender=0,this.hasWebGL2=!1;const n=this.canvas.getContext("webgl2");n?(this.hasWebGL2=!0,this.renderer=new bd({context:n,canvas:this.canvas,preserveDrawingBuffer:!0,alpha:!0,premultipliedAlpha:!1}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.state.setBlending(Wn),this.renderer.getContext().getExtension("EXT_color_buffer_float")):(console.warn("WebGL 2.0 not available. Some functionality may be limited. Please use a browser that supports WebGL 2.0."),this.renderer=new bd({canvas:this.canvas,preserveDrawingBuffer:!0,alpha:!0,premultipliedAlpha:!1}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.state.setBlending(Wn)),this.renderer.localClippingEnabled=!0,e&&(this.renderer.setSize(e.offsetWidth,e.offsetHeight),this.meshRenderTarget.setSize(e.offsetWidth,e.offsetHeight)),this.timer=new Ky;const s=Cl,r=this.getWidth()/this.getHeight();this.fov=20,this.perspectiveCamera=new un(this.fov,r,Rd,Pd),this.resetPerspectiveCamera(),this.perspectiveControls=new Eo(this.perspectiveCamera,this.canvas),this.perspectiveControls.rotateSpeed=4/window.devicePixelRatio,this.perspectiveControls.autoRotate=!1,this.perspectiveControls.staticMoving=!0,this.perspectiveControls.length=10,this.perspectiveControls.enabled=!0,this.orthographicCameraX=new oi(-.5*r,s*r,s,-.5,.001,20),this.resetOrthographicCameraX(),this.orthoControlsX=new Eo(this.orthographicCameraX,this.canvas),this.orthoControlsX.noRotate=!0,this.orthoControlsX.scale=s,this.orthoControlsX.scale0=s,this.orthoControlsX.aspect=r,this.orthoControlsX.staticMoving=!0,this.orthoControlsX.enabled=!1,this.orthoControlsX.panSpeed=this.canvas.clientWidth*.5,this.orthographicCameraY=new oi(-.5*r,s*r,s,-.5,.001,20),this.resetOrthographicCameraY(),this.orthoControlsY=new Eo(this.orthographicCameraY,this.canvas),this.orthoControlsY.noRotate=!0,this.orthoControlsY.scale=s,this.orthoControlsY.scale0=s,this.orthoControlsY.aspect=r,this.orthoControlsY.staticMoving=!0,this.orthoControlsY.enabled=!1,this.orthoControlsY.panSpeed=this.canvas.clientWidth*.5,this.orthographicCameraZ=new oi(-.5*r,s*r,s,-.5,.001,20),this.resetOrthographicCameraZ(),this.orthoControlsZ=new Eo(this.orthographicCameraZ,this.canvas),this.orthoControlsZ.noRotate=!0,this.orthoControlsZ.scale=s,this.orthoControlsZ.scale0=s,this.orthoControlsZ.aspect=r,this.orthoControlsZ.staticMoving=!0,this.orthoControlsZ.enabled=!1,this.orthoControlsZ.panSpeed=this.canvas.clientWidth*.5,this.camera=this.perspectiveCamera,this.controls=this.perspectiveControls,this.viewMode=Pt.NONE,this.axisCamera=new oi,this.axisHelperScene=new ns,this.axisHelperObject=new Et,this.axisHelperObject.name="axisHelperParentObject",this.showAxis=!1,this.axisScale=50,this.axisOffset=[66,66],this.setupAxisHelper(),this.setupIndicatorElements()}updateCameraFocus(e,t,n){this.perspectiveCamera.fov=e,this.fov=e,this.perspectiveCamera.updateProjectionMatrix()}resetPerspectiveCamera(){this.perspectiveCamera.position.x=0,this.perspectiveCamera.position.y=0,this.perspectiveCamera.position.z=cw,this.perspectiveCamera.up.x=0,this.perspectiveCamera.up.y=1,this.perspectiveCamera.up.z=0}resetOrthographicCameraX(){this.orthographicCameraX.position.x=2,this.orthographicCameraX.position.y=0,this.orthographicCameraX.position.z=0,this.orthographicCameraX.up.x=0,this.orthographicCameraX.up.y=0,this.orthographicCameraX.up.z=1,this.orthographicCameraX.lookAt(new I(0,0,0))}resetOrthographicCameraY(){this.orthographicCameraY.position.x=0,this.orthographicCameraY.position.y=2,this.orthographicCameraY.position.z=0,this.orthographicCameraY.up.x=0,this.orthographicCameraY.up.y=0,this.orthographicCameraY.up.z=1,this.orthographicCameraY.lookAt(new I(0,0,0))}resetOrthographicCameraZ(){this.orthographicCameraZ.position.x=0,this.orthographicCameraZ.position.y=0,this.orthographicCameraZ.position.z=2,this.orthographicCameraZ.up.x=0,this.orthographicCameraZ.up.y=1,this.orthographicCameraZ.up.z=0,this.orthographicCameraZ.lookAt(new I(0,0,0))}requestCapture(e){this.dataurlcallback=e,this.redraw()}isVR(){return this.renderer.xr.enabled}resetToPerspectiveCamera(){const e=this.getWidth()/this.getHeight();this.perspectiveCamera=new un(this.fov,e,Rd,Pd),this.resetPerspectiveCamera(),this.switchViewMode("3D"),this.controls.object=this.perspectiveCamera,this.controls.enabled=!0,this.controls.reset()}resetCamera(){this.camera===this.perspectiveCamera?this.resetPerspectiveCamera():this.camera===this.orthographicCameraX?this.resetOrthographicCameraX():this.camera===this.orthographicCameraY?this.resetOrthographicCameraY():this.camera===this.orthographicCameraZ&&this.resetOrthographicCameraZ(),this.controls.reset()}setupAxisHelper(){const e=new Xc({color:11447469}),t=new rs(this.axisScale/5,this.axisScale/5,this.axisScale/5),n=new Lt(t,e);this.axisHelperObject.add(n);const s=new J0(this.axisScale);this.axisHelperObject.add(s),this.axisHelperScene.add(this.axisHelperObject),this.axisCamera=new oi(0,this.getWidth(),this.getHeight(),0,.001,this.axisScale*4),this.axisCamera.position.z=1,this.axisCamera.up.x=0,this.axisCamera.up.y=1,this.axisCamera.up.z=0,this.axisCamera.lookAt(new I(0,0,0)),this.axisCamera.position.set(-this.axisOffset[0],-this.axisOffset[1],this.axisScale*2)}setAxisPosition(e,t,n){this.axisOffset=[e+50,t+50],Md(n)&&(this.axisOffset[1]=this.getHeight()-this.axisOffset[1]),Ed(n)&&(this.axisOffset[0]=this.getWidth()-this.axisOffset[0]),this.axisCamera.position.set(-this.axisOffset[0],-this.axisOffset[1],this.axisScale*2)}orthoScreenPixelsToPhysicalUnits(e,t){const n=1/(this.camera.zoom*this.getHeight());return e*window.devicePixelRatio*n*t}setupIndicatorElements(){const e={fontFamily:"-apple-system, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif",position:"absolute",right:"169px",bottom:"20px"};Object.assign(this.scaleBarContainerElement.style,e),this.containerdiv.appendChild(this.scaleBarContainerElement);const t={border:"1px solid white",borderTop:"none",height:"10px",display:"none",color:"white",mixBlendMode:"difference",fontSize:"14px",textAlign:"right",lineHeight:"0",boxSizing:"border-box",paddingRight:"10px",marginRight:"40px"};Object.assign(this.orthoScaleBarElement.style,t),this.scaleBarContainerElement.appendChild(this.orthoScaleBarElement);const n={width:"75px",textAlign:"center",display:"none",color:"white"};Object.assign(this.perspectiveScaleBarElement.style,n),this.scaleBarContainerElement.appendChild(this.perspectiveScaleBarElement);const s=document.createElement("div"),r=document.createElement("div");r.style.color="rgb(255, 255, 0)",r.innerHTML=Zy,this.perspectiveScaleBarElement.appendChild(s),this.perspectiveScaleBarElement.appendChild(r);const a={fontFamily:"-apple-system, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif",position:"absolute",right:"20px",bottom:"20px",color:"white",mixBlendMode:"difference",display:"none",lineHeight:"0.75"};Object.assign(this.timestepIndicatorElement.style,a),this.containerdiv.appendChild(this.timestepIndicatorElement)}updateOrthoScaleBar(e,t){const s=this.orthoScreenPixelsToPhysicalUnits(150,e),a=10**Math.floor(Math.log10(s)),c=Math.floor(s/a)*a,u=ta(c);this.orthoScaleBarElement.innerHTML=`${u}${t||""}`,this.orthoScaleBarElement.style.width=`${150*(c/s)}px`}updatePerspectiveScaleBar(e,t){const n=this.perspectiveScaleBarElement.firstChild;n.innerHTML=`${ta(e)}${t||""}`}updateTimestepIndicator(e,t,n){this.timestepIndicatorElement.innerHTML=ow(e,t,n)}setPerspectiveScaleBarColor(e){const t=this.perspectiveScaleBarElement.lastChild;t.style.color=`rgb(${e[0]*255}, ${e[1]*255}, ${e[2]*255})`}updateScaleBarVisibility(){const e=On(this.camera),t=e&&this.showOrthoScaleBar,n=!e&&this.showPerspectiveScaleBar;this.orthoScaleBarElement.style.display=t?"":"none",this.perspectiveScaleBarElement.style.display=n?"":"none"}setShowOrthoScaleBar(e){this.showOrthoScaleBar=e,this.updateScaleBarVisibility()}setShowPerspectiveScaleBar(e){this.showPerspectiveScaleBar=e,this.updateScaleBarVisibility()}setShowTimestepIndicator(e){this.showTimestepIndicator=e,this.timestepIndicatorElement.style.display=e?"":"none"}setIndicatorPosition(e,t,n,s){const{style:r}=e?this.timestepIndicatorElement:this.scaleBarContainerElement;r.removeProperty("top"),r.removeProperty("bottom"),r.removeProperty("left"),r.removeProperty("right");const a=Ed(s)?"right":"left",c=Md(s)?"top":"bottom";Object.assign(r,{[a]:t+"px",[c]:n+"px"})}setAutoRotate(e){this.controls.autoRotate=e}getAutoRotate(){return this.controls.autoRotate}replaceCamera(e){this.camera=e}replaceControls(e){this.controls!==e&&(this.controls.enabled=!1,this.removeControlHandlers(),this.controls=e,this.controls.enabled=!0,this.controlStartHandler&&this.controls.addEventListener("start",this.controlStartHandler),this.controlChangeHandler&&this.controls.addEventListener("change",this.controlChangeHandler),this.controlEndHandler&&this.controls.addEventListener("end",this.controlEndHandler),this.controls.update())}switchViewMode(e){switch(e=e.toUpperCase(),e){case"YZ":case"X":this.replaceCamera(this.orthographicCameraX),this.replaceControls(this.orthoControlsX),this.axisHelperObject.rotation.set(0,Math.PI*.5,0),this.viewMode=Pt.X;break;case"XZ":case"Y":this.replaceCamera(this.orthographicCameraY),this.replaceControls(this.orthoControlsY),this.axisHelperObject.rotation.set(Math.PI*.5,0,0),this.viewMode=Pt.Y;break;case"XY":case"Z":this.replaceCamera(this.orthographicCameraZ),this.replaceControls(this.orthoControlsZ),this.axisHelperObject.rotation.set(0,0,0),this.viewMode=Pt.Z;break;default:this.replaceCamera(this.perspectiveCamera),this.replaceControls(this.perspectiveControls),this.axisHelperObject.rotation.setFromRotationMatrix(this.camera.matrixWorldInverse),this.viewMode=Pt.NONE;break}this.updateScaleBarVisibility()}getMeshDepthTexture(){return this.meshRenderTarget.depthTexture}resize(e,t,n,s,r,a){var u,d;t=t||((u=this.containerdiv.parentElement)==null?void 0:u.offsetWidth)||this.containerdiv.offsetWidth,n=n||((d=this.containerdiv.parentElement)==null?void 0:d.offsetHeight)||this.containerdiv.offsetHeight,this.containerdiv.style.width=""+t+"px",this.containerdiv.style.height=""+n+"px";const c=t/n;this.perspectiveControls.aspect=c,this.orthoControlsZ.aspect=c,this.orthoControlsZ.panSpeed=t*.5,this.orthoControlsY.aspect=c,this.orthoControlsY.panSpeed=t*.5,this.orthoControlsX.aspect=c,this.orthoControlsX.panSpeed=t*.5,On(this.camera)?(this.camera.left=-.5*c,this.camera.right=Cl*c,this.camera.updateProjectionMatrix()):(this.camera.aspect=c,this.camera.updateProjectionMatrix()),this.axisCamera.left=0,this.axisCamera.right=t,this.axisCamera.top=n,this.axisCamera.bottom=0,this.axisCamera.updateProjectionMatrix(),this.renderer.getPixelRatio()!==window.devicePixelRatio&&this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(t,n),this.meshRenderTarget.setSize(t,n),this.perspectiveControls.handleResize(),this.orthoControlsZ.handleResize(),this.orthoControlsY.handleResize(),this.orthoControlsX.handleResize()}setClearColor(e,t){this.renderer.setClearColor(e,t)}getWidth(){return this.renderer.getContext().canvas.width}getHeight(){return this.renderer.getContext().canvas.height}getCameraState(){return{position:this.camera.position.toArray(),up:this.camera.up.toArray(),target:this.controls.target.toArray(),orthoScale:On(this.camera)?this.controls.scale:void 0,fov:Qy(this.camera)?this.camera.fov:void 0}}setCameraState(e){const n={...this.getCameraState(),...e};this.camera.up.fromArray(n.up).normalize(),this.controls.target.fromArray(n.target);const s=aw(n.position,n.target,this.viewMode);if(this.camera.position.fromArray(s),On(this.camera)){const r=n.orthoScale||Cl;this.controls.scale=r,this.camera.zoom=.5/r}else this.camera.fov=n.fov||this.fov;this.controls.update(),this.camera.updateProjectionMatrix()}render(){On(this.camera)||this.axisHelperObject.rotation.setFromRotationMatrix(this.camera.matrixWorldInverse);for(let e=0;e<this.animateFuncs.length;e++)this.animateFuncs[e]&&this.animateFuncs[e](this.renderer,this.camera,this.meshRenderTarget.depthTexture);this.camera.layers.set(ks),this.renderer.setRenderTarget(this.meshRenderTarget),this.renderer.render(this.scene,this.camera),this.meshRenderToBuffer.material.uniforms.image.value=this.meshRenderTarget.texture,this.meshRenderToBuffer.render(this.renderer),this.camera.layers.set(lw),this.renderer.setRenderTarget(null),this.renderer.autoClear=!1,this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0,this.showAxis&&(this.renderer.autoClear=!1,this.renderer.render(this.axisHelperScene,this.axisCamera),this.renderer.autoClear=!0),this.dataurlcallback&&(this.dataurlcallback(this.canvas.toDataURL()),this.dataurlcallback=void 0)}redraw(){this.inRenderLoop||(this.requestedRender&&cancelAnimationFrame(this.requestedRender),this.timer.begin(),this.requestedRender=requestAnimationFrame(this.onAnimationLoop.bind(this)))}onAnimationLoop(){this.timer.update();const e=this.timer.lastFrameMs/1e3;this.controls.update(e),this.render()}startRenderLoop(){this.inRenderLoop=!0,this.timer.begin(),this.renderer.setAnimationLoop(this.onAnimationLoop.bind(this))}stopRenderLoop(){this.renderer.setAnimationLoop(null),this.inRenderLoop=!1,this.requestedRender&&(cancelAnimationFrame(this.requestedRender),this.requestedRender=0),this.timer.end()}removeControlHandlers(){this.controlStartHandler&&this.controls.removeEventListener("start",this.controlStartHandler),this.controlChangeHandler&&this.controls.removeEventListener("change",this.controlChangeHandler),this.controlEndHandler&&this.controls.removeEventListener("end",this.controlEndHandler)}setControlHandlers(e,t,n){this.removeControlHandlers(),e&&(this.controlStartHandler=e,this.controls.addEventListener("start",this.controlStartHandler)),t&&(this.controlChangeHandler=t,this.controls.addEventListener("change",this.controlChangeHandler)),n&&(this.controlEndHandler=n,this.controls.addEventListener("end",this.controlEndHandler))}}const uw=Object.freeze({angle:36*Ko.DEG2RAD,castShadow:!1,color:16777215,intensity:.4,position:{x:-4,y:3.5,z:7}}),dw=Object.freeze({color:16777215,intensity:.6}),pw=Object.freeze({castShadow:!1,color:16746666,intensity:.2,position:{x:1,y:-5,z:0}}),fw=Object.freeze({castShadow:!1,color:15258025,intensity:.15,position:{x:2.5,y:.2,z:1.5}}),Bt={spotlightSettings:uw,ambientLightSettings:dw,reflectedLightSettings:pw,fillLightSettings:fw};class mw{parse(e,t={}){t=Object.assign({binary:!1},t);const n=t.binary,s=[];let r=0;e.traverse(function(_){if(_.isMesh){const w=_.geometry,E=w.index,M=w.getAttribute("position");r+=E!==null?E.count/3:M.count/3,s.push({object3d:_,geometry:w})}});let a,c=80;if(n===!0){const _=r*2+r*3*4*4+80+4,w=new ArrayBuffer(_);a=new DataView(w),a.setUint32(c,r,!0),c+=4}else a="",a+=`solid exported
`;const u=new I,d=new I,f=new I,m=new I,v=new I,g=new I;for(let _=0,w=s.length;_<w;_++){const E=s[_].object3d,M=s[_].geometry,P=M.index,D=M.getAttribute("position");if(P!==null)for(let O=0;O<P.count;O+=3){const U=P.getX(O+0),L=P.getX(O+1),A=P.getX(O+2);b(U,L,A,D,E)}else for(let O=0;O<D.count;O+=3){const U=O+0,L=O+1,A=O+2;b(U,L,A,D,E)}}return n===!1&&(a+=`endsolid exported
`),a;function b(_,w,E,M,P){u.fromBufferAttribute(M,_),d.fromBufferAttribute(M,w),f.fromBufferAttribute(M,E),P.isSkinnedMesh===!0&&(P.applyBoneTransform(_,u),P.applyBoneTransform(w,d),P.applyBoneTransform(E,f)),u.applyMatrix4(P.matrixWorld),d.applyMatrix4(P.matrixWorld),f.applyMatrix4(P.matrixWorld),y(u,d,f),x(u),x(d),x(f),n===!0?(a.setUint16(c,0,!0),c+=2):(a+=`		endloop
`,a+=`	endfacet
`)}function y(_,w,E){m.subVectors(E,w),v.subVectors(_,w),m.cross(v).normalize(),g.copy(m).normalize(),n===!0?(a.setFloat32(c,g.x,!0),c+=4,a.setFloat32(c,g.y,!0),c+=4,a.setFloat32(c,g.z,!0),c+=4):(a+="	facet normal "+g.x+" "+g.y+" "+g.z+`
`,a+=`		outer loop
`)}function x(_){n===!0?(a.setFloat32(c,_.x,!0),c+=4,a.setFloat32(c,_.y,!0),c+=4,a.setFloat32(c,_.z,!0),c+=4):a+="			vertex "+_.x+" "+_.y+" "+_.z+`
`}}}const Ld={POSITION:["byte","byte normalized","unsigned byte","unsigned byte normalized","short","short normalized","unsigned short","unsigned short normalized"],NORMAL:["byte normalized","short normalized"],TANGENT:["byte normalized","short normalized"],TEXCOORD:["byte","byte normalized","unsigned byte","short","short normalized","unsigned short"]};class sa{constructor(){this.textureUtils=null,this.pluginCallbacks=[],this.register(function(e){return new Ew(e)}),this.register(function(e){return new Aw(e)}),this.register(function(e){return new Pw(e)}),this.register(function(e){return new Lw(e)}),this.register(function(e){return new Iw(e)}),this.register(function(e){return new Dw(e)}),this.register(function(e){return new Cw(e)}),this.register(function(e){return new Tw(e)}),this.register(function(e){return new Rw(e)}),this.register(function(e){return new Uw(e)}),this.register(function(e){return new Nw(e)}),this.register(function(e){return new Ow(e)}),this.register(function(e){return new Fw(e)}),this.register(function(e){return new Bw(e)})}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}setTextureUtils(e){return this.textureUtils=e,this}parse(e,t,n,s){const r=new Mw,a=[];for(let c=0,u=this.pluginCallbacks.length;c<u;c++)a.push(this.pluginCallbacks[c](r));r.setPlugins(a),r.setTextureUtils(this.textureUtils),r.writeAsync(e,t,s).catch(n)}parseAsync(e,t){const n=this;return new Promise(function(s,r){n.parse(e,s,r,t)})}}const lt={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,INT:5124,UNSIGNED_INT:5125,FLOAT:5126,ARRAY_BUFFER:34962,ELEMENT_ARRAY_BUFFER:34963,NEAREST:9728,LINEAR:9729,NEAREST_MIPMAP_NEAREST:9984,LINEAR_MIPMAP_NEAREST:9985,NEAREST_MIPMAP_LINEAR:9986,LINEAR_MIPMAP_LINEAR:9987,CLAMP_TO_EDGE:33071,MIRRORED_REPEAT:33648,REPEAT:10497},Tl="KHR_mesh_quantization",Sn={};Sn[It]=lt.NEAREST;Sn[dp]=lt.NEAREST_MIPMAP_NEAREST;Sn[Sr]=lt.NEAREST_MIPMAP_LINEAR;Sn[zt]=lt.LINEAR;Sn[Fo]=lt.LINEAR_MIPMAP_NEAREST;Sn[Ei]=lt.LINEAR_MIPMAP_LINEAR;Sn[dn]=lt.CLAMP_TO_EDGE;Sn[Yo]=lt.REPEAT;Sn[qo]=lt.MIRRORED_REPEAT;const Id={scale:"scale",position:"translation",quaternion:"rotation",morphTargetInfluences:"weights"},gw=new Ke,Dd=12,vw=1179937895,_w=2,Ud=8,xw=1313821514,bw=5130562;function Ar(i,e){return i.length===e.length&&i.every(function(t,n){return t===e[n]})}function yw(i){return new TextEncoder().encode(i).buffer}function ww(i){return Ar(i.elements,[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}function Sw(i,e,t){const n={min:new Array(i.itemSize).fill(Number.POSITIVE_INFINITY),max:new Array(i.itemSize).fill(Number.NEGATIVE_INFINITY)};for(let s=e;s<e+t;s++)for(let r=0;r<i.itemSize;r++){let a;i.itemSize>4?a=i.array[s*i.itemSize+r]:(r===0?a=i.getX(s):r===1?a=i.getY(s):r===2?a=i.getZ(s):r===3&&(a=i.getW(s)),i.normalized===!0&&(a=Ko.normalize(a,i.array))),n.min[r]=Math.min(n.min[r],a),n.max[r]=Math.max(n.max[r],a)}return n}function Vp(i){return Math.ceil(i/4)*4}function Rl(i,e=0){const t=Vp(i.byteLength);if(t!==i.byteLength){const n=new Uint8Array(t);if(n.set(new Uint8Array(i)),e!==0)for(let s=i.byteLength;s<t;s++)n[s]=e;return n.buffer}return i}function Nd(){return typeof document>"u"&&typeof OffscreenCanvas<"u"?new OffscreenCanvas(1,1):document.createElement("canvas")}function Od(i,e){if(i.toBlob!==void 0)return new Promise(n=>i.toBlob(n,e));let t;return e==="image/jpeg"?t=.92:e==="image/webp"&&(t=.8),i.convertToBlob({type:e,quality:t})}class Mw{constructor(){this.plugins=[],this.options={},this.pending=[],this.buffers=[],this.byteOffset=0,this.buffers=[],this.nodeMap=new Map,this.skins=[],this.extensionsUsed={},this.extensionsRequired={},this.uids=new Map,this.uid=0,this.json={asset:{version:"2.0",generator:"THREE.GLTFExporter r"+ra}},this.cache={meshes:new Map,attributes:new Map,attributesNormalized:new Map,materials:new Map,textures:new Map,images:new Map},this.textureUtils=null}setPlugins(e){this.plugins=e}setTextureUtils(e){this.textureUtils=e}async writeAsync(e,t,n={}){this.options=Object.assign({binary:!1,trs:!1,onlyVisible:!0,maxTextureSize:1/0,animations:[],includeCustomExtensions:!1},n),this.options.animations.length>0&&(this.options.trs=!0),await this.processInputAsync(e),await Promise.all(this.pending);const s=this,r=s.buffers,a=s.json;n=s.options;const c=s.extensionsUsed,u=s.extensionsRequired,d=new Blob(r,{type:"application/octet-stream"}),f=Object.keys(c),m=Object.keys(u);if(f.length>0&&(a.extensionsUsed=f),m.length>0&&(a.extensionsRequired=m),a.buffers&&a.buffers.length>0&&(a.buffers[0].byteLength=d.size),n.binary===!0){const v=new FileReader;v.readAsArrayBuffer(d),v.onloadend=function(){const g=Rl(v.result),b=new DataView(new ArrayBuffer(Ud));b.setUint32(0,g.byteLength,!0),b.setUint32(4,bw,!0);const y=Rl(yw(JSON.stringify(a)),32),x=new DataView(new ArrayBuffer(Ud));x.setUint32(0,y.byteLength,!0),x.setUint32(4,xw,!0);const _=new ArrayBuffer(Dd),w=new DataView(_);w.setUint32(0,vw,!0),w.setUint32(4,_w,!0);const E=Dd+x.byteLength+y.byteLength+b.byteLength+g.byteLength;w.setUint32(8,E,!0);const M=new Blob([_,x,y,b,g],{type:"application/octet-stream"}),P=new FileReader;P.readAsArrayBuffer(M),P.onloadend=function(){t(P.result)}}}else if(a.buffers&&a.buffers.length>0){const v=new FileReader;v.readAsDataURL(d),v.onloadend=function(){const g=v.result;a.buffers[0].uri=g,t(a)}}else t(a)}serializeUserData(e,t){if(Object.keys(e.userData).length===0)return;const n=this.options,s=this.extensionsUsed;try{const r=JSON.parse(JSON.stringify(e.userData));if(n.includeCustomExtensions&&r.gltfExtensions){t.extensions===void 0&&(t.extensions={});for(const a in r.gltfExtensions)t.extensions[a]=r.gltfExtensions[a],s[a]=!0;delete r.gltfExtensions}Object.keys(r).length>0&&(t.extras=r)}catch(r){console.warn("THREE.GLTFExporter: userData of '"+e.name+"' won't be serialized because of JSON.stringify error - "+r.message)}}getUID(e,t=!1){if(this.uids.has(e)===!1){const s=new Map;s.set(!0,this.uid++),s.set(!1,this.uid++),this.uids.set(e,s)}return this.uids.get(e).get(t)}isNormalizedNormalAttribute(e){if(this.cache.attributesNormalized.has(e))return!1;const n=new I;for(let s=0,r=e.count;s<r;s++)if(Math.abs(n.fromBufferAttribute(e,s).length()-1)>5e-4)return!1;return!0}createNormalizedNormalAttribute(e){const t=this.cache;if(t.attributesNormalized.has(e))return t.attributesNormalized.get(e);const n=e.clone(),s=new I;for(let r=0,a=n.count;r<a;r++)s.fromBufferAttribute(n,r),s.x===0&&s.y===0&&s.z===0?s.setX(1):s.normalize(),n.setXYZ(r,s.x,s.y,s.z);return t.attributesNormalized.set(e,n),n}applyTextureTransform(e,t){let n=!1;const s={};(t.offset.x!==0||t.offset.y!==0)&&(s.offset=t.offset.toArray(),n=!0),t.rotation!==0&&(s.rotation=t.rotation,n=!0),(t.repeat.x!==1||t.repeat.y!==1)&&(s.scale=t.repeat.toArray(),n=!0),n&&(e.extensions=e.extensions||{},e.extensions.KHR_texture_transform=s,this.extensionsUsed.KHR_texture_transform=!0)}async buildMetalRoughTextureAsync(e,t){if(e===t)return e;function n(g){return g.colorSpace===bn?function(y){return y<.04045?y*.0773993808:Math.pow(y*.9478672986+.0521327014,2.4)}:function(y){return y}}e instanceof gl&&(e=await this.decompressTextureAsync(e)),t instanceof gl&&(t=await this.decompressTextureAsync(t));const s=e?e.image:null,r=t?t.image:null,a=Math.max(s?s.width:0,r?r.width:0),c=Math.max(s?s.height:0,r?r.height:0),u=Nd();u.width=a,u.height=c;const d=u.getContext("2d",{willReadFrequently:!0});d.fillStyle="#00ffff",d.fillRect(0,0,a,c);const f=d.getImageData(0,0,a,c);if(s){d.drawImage(s,0,0,a,c);const g=n(e),b=d.getImageData(0,0,a,c).data;for(let y=2;y<b.length;y+=4)f.data[y]=g(b[y]/256)*256}if(r){d.drawImage(r,0,0,a,c);const g=n(t),b=d.getImageData(0,0,a,c).data;for(let y=1;y<b.length;y+=4)f.data[y]=g(b[y]/256)*256}d.putImageData(f,0,0);const v=(e||t).clone();return v.source=new Wc(u),v.colorSpace=ri,v.channel=(e||t).channel,e&&t&&e.channel!==t.channel&&console.warn("THREE.GLTFExporter: UV channels for metalnessMap and roughnessMap textures must match."),console.warn("THREE.GLTFExporter: Merged metalnessMap and roughnessMap textures."),v}async decompressTextureAsync(e,t=1/0){if(this.textureUtils===null)throw new Error("THREE.GLTFExporter: setTextureUtils() must be called to process compressed textures.");return await this.textureUtils.decompress(e,t)}processBuffer(e){const t=this.json,n=this.buffers;return t.buffers||(t.buffers=[{byteLength:0}]),n.push(e),0}processBufferView(e,t,n,s,r){const a=this.json;a.bufferViews||(a.bufferViews=[]);let c;switch(t){case lt.BYTE:case lt.UNSIGNED_BYTE:c=1;break;case lt.SHORT:case lt.UNSIGNED_SHORT:c=2;break;default:c=4}let u=e.itemSize*c;r===lt.ARRAY_BUFFER&&(u=Math.ceil(u/4)*4);const d=Vp(s*u),f=new DataView(new ArrayBuffer(d));let m=0;for(let b=n;b<n+s;b++){for(let y=0;y<e.itemSize;y++){let x;e.itemSize>4?x=e.array[b*e.itemSize+y]:(y===0?x=e.getX(b):y===1?x=e.getY(b):y===2?x=e.getZ(b):y===3&&(x=e.getW(b)),e.normalized===!0&&(x=Ko.normalize(x,e.array))),t===lt.FLOAT?f.setFloat32(m,x,!0):t===lt.INT?f.setInt32(m,x,!0):t===lt.UNSIGNED_INT?f.setUint32(m,x,!0):t===lt.SHORT?f.setInt16(m,x,!0):t===lt.UNSIGNED_SHORT?f.setUint16(m,x,!0):t===lt.BYTE?f.setInt8(m,x):t===lt.UNSIGNED_BYTE&&f.setUint8(m,x),m+=c}m%u!==0&&(m+=u-m%u)}const v={buffer:this.processBuffer(f.buffer),byteOffset:this.byteOffset,byteLength:d};return r!==void 0&&(v.target=r),r===lt.ARRAY_BUFFER&&(v.byteStride=u),this.byteOffset+=d,a.bufferViews.push(v),{id:a.bufferViews.length-1,byteLength:0}}processBufferViewImage(e){const t=this,n=t.json;return n.bufferViews||(n.bufferViews=[]),new Promise(function(s){const r=new FileReader;r.readAsArrayBuffer(e),r.onloadend=function(){const a=Rl(r.result),c={buffer:t.processBuffer(a),byteOffset:t.byteOffset,byteLength:a.byteLength};t.byteOffset+=a.byteLength,s(n.bufferViews.push(c)-1)}})}processAccessor(e,t,n,s){const r=this.json,a={1:"SCALAR",2:"VEC2",3:"VEC3",4:"VEC4",9:"MAT3",16:"MAT4"};let c;if(e.array.constructor===Float32Array)c=lt.FLOAT;else if(e.array.constructor===Int32Array)c=lt.INT;else if(e.array.constructor===Uint32Array)c=lt.UNSIGNED_INT;else if(e.array.constructor===Int16Array)c=lt.SHORT;else if(e.array.constructor===Uint16Array)c=lt.UNSIGNED_SHORT;else if(e.array.constructor===Int8Array)c=lt.BYTE;else if(e.array.constructor===Uint8Array)c=lt.UNSIGNED_BYTE;else throw new Error("THREE.GLTFExporter: Unsupported bufferAttribute component type: "+e.array.constructor.name);if(n===void 0&&(n=0),(s===void 0||s===1/0)&&(s=e.count),s===0)return null;const u=Sw(e,n,s);let d;t!==void 0&&(d=e===t.index?lt.ELEMENT_ARRAY_BUFFER:lt.ARRAY_BUFFER);const f=this.processBufferView(e,c,n,s,d),m={bufferView:f.id,byteOffset:f.byteOffset,componentType:c,count:s,max:u.max,min:u.min,type:a[e.itemSize]};return e.normalized===!0&&(m.normalized=!0),r.accessors||(r.accessors=[]),r.accessors.push(m)-1}processImage(e,t,n,s="image/png"){if(e!==null){const r=this,a=r.cache,c=r.json,u=r.options,d=r.pending;a.images.has(e)||a.images.set(e,{});const f=a.images.get(e),m=s+":flipY/"+n.toString();if(f[m]!==void 0)return f[m];c.images||(c.images=[]);const v={mimeType:s},g=Nd();g.width=Math.min(e.width,u.maxTextureSize),g.height=Math.min(e.height,u.maxTextureSize);const b=g.getContext("2d",{willReadFrequently:!0});if(n===!0&&(b.translate(0,g.height),b.scale(1,-1)),e.data!==void 0){t!==Xt&&console.error("GLTFExporter: Only RGBAFormat is supported.",t),(e.width>u.maxTextureSize||e.height>u.maxTextureSize)&&console.warn("GLTFExporter: Image size is bigger than maxTextureSize",e);const x=new Uint8ClampedArray(e.height*e.width*4);for(let _=0;_<x.length;_+=4)x[_+0]=e.data[_+0],x[_+1]=e.data[_+1],x[_+2]=e.data[_+2],x[_+3]=e.data[_+3];b.putImageData(new ImageData(x,e.width,e.height),0,0)}else if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap||typeof OffscreenCanvas<"u"&&e instanceof OffscreenCanvas)b.drawImage(e,0,0,g.width,g.height);else throw new Error("THREE.GLTFExporter: Invalid image type. Use HTMLImageElement, HTMLCanvasElement, ImageBitmap or OffscreenCanvas.");u.binary===!0?d.push(Od(g,s).then(x=>r.processBufferViewImage(x)).then(x=>{v.bufferView=x})):g.toDataURL!==void 0?v.uri=g.toDataURL(s):d.push(Od(g,s).then(x=>new FileReader().readAsDataURL(x)).then(x=>{v.uri=x}));const y=c.images.push(v)-1;return f[m]=y,y}else throw new Error("THREE.GLTFExporter: No valid image data found. Unable to process texture.")}processSampler(e){const t=this.json;t.samplers||(t.samplers=[]);const n={magFilter:Sn[e.magFilter],minFilter:Sn[e.minFilter],wrapS:Sn[e.wrapS],wrapT:Sn[e.wrapT]};return t.samplers.push(n)-1}async processTextureAsync(e){const n=this.options,s=this.cache,r=this.json;if(s.textures.has(e))return s.textures.get(e);r.textures||(r.textures=[]),e instanceof gl&&(e=await this.decompressTextureAsync(e,n.maxTextureSize));let a=e.userData.mimeType;a==="image/webp"&&(a="image/png");const c={sampler:this.processSampler(e),source:this.processImage(e.image,e.format,e.flipY,a)};e.name&&(c.name=e.name),await this._invokeAllAsync(async function(d){d.writeTexture&&await d.writeTexture(e,c)});const u=r.textures.push(c)-1;return s.textures.set(e,u),u}async processMaterialAsync(e){const t=this.cache,n=this.json;if(t.materials.has(e))return t.materials.get(e);if(e.isShaderMaterial)return console.warn("GLTFExporter: THREE.ShaderMaterial not supported."),null;n.materials||(n.materials=[]);const s={pbrMetallicRoughness:{}};e.isMeshStandardMaterial!==!0&&e.isMeshBasicMaterial!==!0&&console.warn("GLTFExporter: Use MeshStandardMaterial or MeshBasicMaterial for best results.");const r=e.color.toArray().concat([e.opacity]);if(Ar(r,[1,1,1,1])||(s.pbrMetallicRoughness.baseColorFactor=r),e.isMeshStandardMaterial?(s.pbrMetallicRoughness.metallicFactor=e.metalness,s.pbrMetallicRoughness.roughnessFactor=e.roughness):(s.pbrMetallicRoughness.metallicFactor=0,s.pbrMetallicRoughness.roughnessFactor=1),e.metalnessMap||e.roughnessMap){const c=await this.buildMetalRoughTextureAsync(e.metalnessMap,e.roughnessMap),u={index:await this.processTextureAsync(c),texCoord:c.channel};this.applyTextureTransform(u,c),s.pbrMetallicRoughness.metallicRoughnessTexture=u}if(e.map){const c={index:await this.processTextureAsync(e.map),texCoord:e.map.channel};this.applyTextureTransform(c,e.map),s.pbrMetallicRoughness.baseColorTexture=c}if(e.emissive){const c=e.emissive;if(Math.max(c.r,c.g,c.b)>0&&(s.emissiveFactor=e.emissive.toArray()),e.emissiveMap){const d={index:await this.processTextureAsync(e.emissiveMap),texCoord:e.emissiveMap.channel};this.applyTextureTransform(d,e.emissiveMap),s.emissiveTexture=d}}if(e.normalMap){const c={index:await this.processTextureAsync(e.normalMap),texCoord:e.normalMap.channel};e.normalScale&&e.normalScale.x!==1&&(c.scale=e.normalScale.x),this.applyTextureTransform(c,e.normalMap),s.normalTexture=c}if(e.aoMap){const c={index:await this.processTextureAsync(e.aoMap),texCoord:e.aoMap.channel};e.aoMapIntensity!==1&&(c.strength=e.aoMapIntensity),this.applyTextureTransform(c,e.aoMap),s.occlusionTexture=c}e.transparent?s.alphaMode="BLEND":e.alphaTest>0&&(s.alphaMode="MASK",s.alphaCutoff=e.alphaTest),e.side===Un&&(s.doubleSided=!0),e.name!==""&&(s.name=e.name),this.serializeUserData(e,s),await this._invokeAllAsync(async function(c){c.writeMaterialAsync&&await c.writeMaterialAsync(e,s)});const a=n.materials.push(s)-1;return t.materials.set(e,a),a}async processMeshAsync(e){const t=this.cache,n=this.json,s=[e.geometry.uuid];if(Array.isArray(e.material))for(let M=0,P=e.material.length;M<P;M++)s.push(e.material[M].uuid);else s.push(e.material.uuid);const r=s.join(":");if(t.meshes.has(r))return t.meshes.get(r);const a=e.geometry;let c;e.isLineSegments?c=lt.LINES:e.isLineLoop?c=lt.LINE_LOOP:e.isLine?c=lt.LINE_STRIP:e.isPoints?c=lt.POINTS:c=e.material.wireframe?lt.LINES:lt.TRIANGLES;const u={},d={},f=[],m=[],v={uv:"TEXCOORD_0",uv1:"TEXCOORD_1",uv2:"TEXCOORD_2",uv3:"TEXCOORD_3",color:"COLOR_0",skinWeight:"WEIGHTS_0",skinIndex:"JOINTS_0"},g=a.getAttribute("normal");g!==void 0&&!this.isNormalizedNormalAttribute(g)&&(console.warn("THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one."),a.setAttribute("normal",this.createNormalizedNormalAttribute(g)));let b=null;for(let M in a.attributes){if(M.slice(0,5)==="morph")continue;const P=a.attributes[M];if(M=v[M]||M.toUpperCase(),/^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/.test(M)||(M="_"+M),t.attributes.has(this.getUID(P))){d[M]=t.attributes.get(this.getUID(P));continue}b=null;const O=P.array;M==="JOINTS_0"&&!(O instanceof Uint16Array)&&!(O instanceof Uint8Array)?(console.warn('GLTFExporter: Attribute "skinIndex" converted to type UNSIGNED_SHORT.'),b=new Dt(new Uint16Array(O),P.itemSize,P.normalized)):(O instanceof Uint32Array||O instanceof Int32Array)&&!M.startsWith("_")&&(console.warn(`GLTFExporter: Attribute "${M}" converted to type FLOAT.`),b=sa.Utils.toFloat32BufferAttribute(P));const U=this.processAccessor(b||P,a);U!==null&&(M.startsWith("_")||this.detectMeshQuantization(M,P),d[M]=U,t.attributes.set(this.getUID(P),U))}if(g!==void 0&&a.setAttribute("normal",g),Object.keys(d).length===0)return null;if(e.morphTargetInfluences!==void 0&&e.morphTargetInfluences.length>0){const M=[],P=[],D={};if(e.morphTargetDictionary!==void 0)for(const O in e.morphTargetDictionary)D[e.morphTargetDictionary[O]]=O;for(let O=0;O<e.morphTargetInfluences.length;++O){const U={};let L=!1;for(const A in a.morphAttributes){if(A!=="position"&&A!=="normal"){L||(console.warn("GLTFExporter: Only POSITION and NORMAL morph are supported."),L=!0);continue}const F=a.morphAttributes[A][O],q=A.toUpperCase(),X=a.attributes[A];if(t.attributes.has(this.getUID(F,!0))){U[q]=t.attributes.get(this.getUID(F,!0));continue}const J=F.clone();if(!a.morphTargetsRelative)for(let Q=0,te=F.count;Q<te;Q++)for(let ee=0;ee<F.itemSize;ee++)ee===0&&J.setX(Q,F.getX(Q)-X.getX(Q)),ee===1&&J.setY(Q,F.getY(Q)-X.getY(Q)),ee===2&&J.setZ(Q,F.getZ(Q)-X.getZ(Q)),ee===3&&J.setW(Q,F.getW(Q)-X.getW(Q));U[q]=this.processAccessor(J,a),t.attributes.set(this.getUID(X,!0),U[q])}m.push(U),M.push(e.morphTargetInfluences[O]),e.morphTargetDictionary!==void 0&&P.push(D[O])}u.weights=M,P.length>0&&(u.extras={},u.extras.targetNames=P)}const y=Array.isArray(e.material);if(y&&a.groups.length===0)return null;let x=!1;if(y&&a.index===null){const M=[];for(let P=0,D=a.attributes.position.count;P<D;P++)M[P]=P;a.setIndex(M),x=!0}const _=y?e.material:[e.material],w=y?a.groups:[{materialIndex:0,start:void 0,count:void 0}];for(let M=0,P=w.length;M<P;M++){const D={mode:c,attributes:d};if(this.serializeUserData(a,D),m.length>0&&(D.targets=m),a.index!==null){let U=this.getUID(a.index);(w[M].start!==void 0||w[M].count!==void 0)&&(U+=":"+w[M].start+":"+w[M].count),t.attributes.has(U)?D.indices=t.attributes.get(U):(D.indices=this.processAccessor(a.index,a,w[M].start,w[M].count),t.attributes.set(U,D.indices)),D.indices===null&&delete D.indices}const O=await this.processMaterialAsync(_[w[M].materialIndex]);O!==null&&(D.material=O),f.push(D)}x===!0&&a.setIndex(null),u.primitives=f,n.meshes||(n.meshes=[]),await this._invokeAllAsync(function(M){M.writeMesh&&M.writeMesh(e,u)});const E=n.meshes.push(u)-1;return t.meshes.set(r,E),E}detectMeshQuantization(e,t){if(this.extensionsUsed[Tl])return;let n;switch(t.array.constructor){case Int8Array:n="byte";break;case Uint8Array:n="unsigned byte";break;case Int16Array:n="short";break;case Uint16Array:n="unsigned short";break;default:return}t.normalized&&(n+=" normalized");const s=e.split("_",1)[0];Ld[s]&&Ld[s].includes(n)&&(this.extensionsUsed[Tl]=!0,this.extensionsRequired[Tl]=!0)}processCamera(e){const t=this.json;t.cameras||(t.cameras=[]);const n=e.isOrthographicCamera,s={type:n?"orthographic":"perspective"};return n?s.orthographic={xmag:e.right*2,ymag:e.top*2,zfar:e.far<=0?.001:e.far,znear:e.near<0?0:e.near}:s.perspective={aspectRatio:e.aspect,yfov:Ko.degToRad(e.fov),zfar:e.far<=0?.001:e.far,znear:e.near<0?0:e.near},e.name!==""&&(s.name=e.type),t.cameras.push(s)-1}processAnimation(e,t){const n=this.json,s=this.nodeMap;n.animations||(n.animations=[]),e=sa.Utils.mergeMorphTargetTracks(e.clone(),t);const r=e.tracks,a=[],c=[];for(let u=0;u<r.length;++u){const d=r[u],f=gt.parseTrackName(d.name);let m=gt.findNode(t,f.nodeName);const v=Id[f.propertyName];if(f.objectName==="bones"&&(m.isSkinnedMesh===!0?m=m.skeleton.getBoneByName(f.objectIndex):m=void 0),!m||!v){console.warn('THREE.GLTFExporter: Could not export animation track "%s".',d.name);continue}const g=1;let b=d.values.length/d.times.length;v===Id.morphTargetInfluences&&(b/=m.morphTargetInfluences.length);let y;d.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline===!0?(y="CUBICSPLINE",b/=3):d.getInterpolation()===Nv?y="STEP":y="LINEAR",c.push({input:this.processAccessor(new Dt(d.times,g)),output:this.processAccessor(new Dt(d.values,b)),interpolation:y}),a.push({sampler:c.length-1,target:{node:s.get(m),path:v}})}return n.animations.push({name:e.name||"clip_"+n.animations.length,samplers:c,channels:a}),n.animations.length-1}processSkin(e){const t=this.json,n=this.nodeMap,s=t.nodes[n.get(e)],r=e.skeleton;if(r===void 0)return null;const a=e.skeleton.bones[0];if(a===void 0)return null;const c=[],u=new Float32Array(r.bones.length*16),d=new _t;for(let m=0;m<r.bones.length;++m)c.push(n.get(r.bones[m])),d.copy(r.boneInverses[m]),d.multiply(e.bindMatrix).toArray(u,m*16);return t.skins===void 0&&(t.skins=[]),t.skins.push({inverseBindMatrices:this.processAccessor(new Dt(u,16)),joints:c,skeleton:n.get(a)}),s.skin=t.skins.length-1}async processNodeAsync(e){const t=this.json,n=this.options,s=this.nodeMap;t.nodes||(t.nodes=[]);const r={};if(n.trs){const c=e.quaternion.toArray(),u=e.position.toArray(),d=e.scale.toArray();Ar(c,[0,0,0,1])||(r.rotation=c),Ar(u,[0,0,0])||(r.translation=u),Ar(d,[1,1,1])||(r.scale=d)}else e.matrixAutoUpdate&&e.updateMatrix(),ww(e.matrix)===!1&&(r.matrix=e.matrix.elements);if(e.name!==""&&(r.name=String(e.name)),this.serializeUserData(e,r),e.isMesh||e.isLine||e.isPoints){const c=await this.processMeshAsync(e);c!==null&&(r.mesh=c)}else e.isCamera&&(r.camera=this.processCamera(e));if(e.isSkinnedMesh&&this.skins.push(e),e.children.length>0){const c=[];for(let u=0,d=e.children.length;u<d;u++){const f=e.children[u];if(f.visible||n.onlyVisible===!1){const m=await this.processNodeAsync(f);m!==null&&c.push(m)}}c.length>0&&(r.children=c)}await this._invokeAllAsync(function(c){c.writeNode&&c.writeNode(e,r)});const a=t.nodes.push(r)-1;return s.set(e,a),a}async processSceneAsync(e){const t=this.json,n=this.options;t.scenes||(t.scenes=[],t.scene=0);const s={};e.name!==""&&(s.name=e.name),t.scenes.push(s);const r=[];for(let a=0,c=e.children.length;a<c;a++){const u=e.children[a];if(u.visible||n.onlyVisible===!1){const d=await this.processNodeAsync(u);d!==null&&r.push(d)}}r.length>0&&(s.nodes=r),this.serializeUserData(e,s)}async processObjectsAsync(e){const t=new ns;t.name="AuxScene";for(let n=0;n<e.length;n++)t.children.push(e[n]);await this.processSceneAsync(t)}async processInputAsync(e){const t=this.options;e=e instanceof Array?e:[e],await this._invokeAllAsync(function(s){s.beforeParse&&s.beforeParse(e)});const n=[];for(let s=0;s<e.length;s++)e[s]instanceof ns?await this.processSceneAsync(e[s]):n.push(e[s]);n.length>0&&await this.processObjectsAsync(n);for(let s=0;s<this.skins.length;++s)this.processSkin(this.skins[s]);for(let s=0;s<t.animations.length;++s)this.processAnimation(t.animations[s],e[0]);await this._invokeAllAsync(function(s){s.afterParse&&s.afterParse(e)})}async _invokeAllAsync(e){for(let t=0,n=this.plugins.length;t<n;t++)await e(this.plugins[t])}}class Ew{constructor(e){this.writer=e,this.name="KHR_lights_punctual"}writeNode(e,t){if(!e.isLight)return;if(!e.isDirectionalLight&&!e.isPointLight&&!e.isSpotLight){console.warn("THREE.GLTFExporter: Only directional, point, and spot lights are supported.",e);return}const n=this.writer,s=n.json,r=n.extensionsUsed,a={};e.name&&(a.name=e.name),a.color=e.color.toArray(),a.intensity=e.intensity,e.isDirectionalLight?a.type="directional":e.isPointLight?(a.type="point",e.distance>0&&(a.range=e.distance)):e.isSpotLight&&(a.type="spot",e.distance>0&&(a.range=e.distance),a.spot={},a.spot.innerConeAngle=(1-e.penumbra)*e.angle,a.spot.outerConeAngle=e.angle),e.decay!==void 0&&e.decay!==2&&console.warn("THREE.GLTFExporter: Light decay may be lost. glTF is physically-based, and expects light.decay=2."),e.target&&(e.target.parent!==e||e.target.position.x!==0||e.target.position.y!==0||e.target.position.z!==-1)&&console.warn("THREE.GLTFExporter: Light direction may be lost. For best results, make light.target a child of the light with position 0,0,-1."),r[this.name]||(s.extensions=s.extensions||{},s.extensions[this.name]={lights:[]},r[this.name]=!0);const c=s.extensions[this.name].lights;c.push(a),t.extensions=t.extensions||{},t.extensions[this.name]={light:c.length-1}}}class Aw{constructor(e){this.writer=e,this.name="KHR_materials_unlit"}async writeMaterialAsync(e,t){if(!e.isMeshBasicMaterial)return;const s=this.writer.extensionsUsed;t.extensions=t.extensions||{},t.extensions[this.name]={},s[this.name]=!0,t.pbrMetallicRoughness.metallicFactor=0,t.pbrMetallicRoughness.roughnessFactor=.9}}class Cw{constructor(e){this.writer=e,this.name="KHR_materials_clearcoat"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.clearcoat===0)return;const n=this.writer,s=n.extensionsUsed,r={};if(r.clearcoatFactor=e.clearcoat,e.clearcoatMap){const a={index:await n.processTextureAsync(e.clearcoatMap),texCoord:e.clearcoatMap.channel};n.applyTextureTransform(a,e.clearcoatMap),r.clearcoatTexture=a}if(r.clearcoatRoughnessFactor=e.clearcoatRoughness,e.clearcoatRoughnessMap){const a={index:await n.processTextureAsync(e.clearcoatRoughnessMap),texCoord:e.clearcoatRoughnessMap.channel};n.applyTextureTransform(a,e.clearcoatRoughnessMap),r.clearcoatRoughnessTexture=a}if(e.clearcoatNormalMap){const a={index:await n.processTextureAsync(e.clearcoatNormalMap),texCoord:e.clearcoatNormalMap.channel};e.clearcoatNormalScale.x!==1&&(a.scale=e.clearcoatNormalScale.x),n.applyTextureTransform(a,e.clearcoatNormalMap),r.clearcoatNormalTexture=a}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}}class Tw{constructor(e){this.writer=e,this.name="KHR_materials_dispersion"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.dispersion===0)return;const s=this.writer.extensionsUsed,r={};r.dispersion=e.dispersion,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}}class Rw{constructor(e){this.writer=e,this.name="KHR_materials_iridescence"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.iridescence===0)return;const n=this.writer,s=n.extensionsUsed,r={};if(r.iridescenceFactor=e.iridescence,e.iridescenceMap){const a={index:await n.processTextureAsync(e.iridescenceMap),texCoord:e.iridescenceMap.channel};n.applyTextureTransform(a,e.iridescenceMap),r.iridescenceTexture=a}if(r.iridescenceIor=e.iridescenceIOR,r.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],r.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1],e.iridescenceThicknessMap){const a={index:await n.processTextureAsync(e.iridescenceThicknessMap),texCoord:e.iridescenceThicknessMap.channel};n.applyTextureTransform(a,e.iridescenceThicknessMap),r.iridescenceThicknessTexture=a}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}}class Pw{constructor(e){this.writer=e,this.name="KHR_materials_transmission"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.transmission===0)return;const n=this.writer,s=n.extensionsUsed,r={};if(r.transmissionFactor=e.transmission,e.transmissionMap){const a={index:await n.processTextureAsync(e.transmissionMap),texCoord:e.transmissionMap.channel};n.applyTextureTransform(a,e.transmissionMap),r.transmissionTexture=a}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}}class Lw{constructor(e){this.writer=e,this.name="KHR_materials_volume"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.transmission===0)return;const n=this.writer,s=n.extensionsUsed,r={};if(r.thicknessFactor=e.thickness,e.thicknessMap){const a={index:await n.processTextureAsync(e.thicknessMap),texCoord:e.thicknessMap.channel};n.applyTextureTransform(a,e.thicknessMap),r.thicknessTexture=a}e.attenuationDistance!==1/0&&(r.attenuationDistance=e.attenuationDistance),r.attenuationColor=e.attenuationColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}}class Iw{constructor(e){this.writer=e,this.name="KHR_materials_ior"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.ior===1.5)return;const s=this.writer.extensionsUsed,r={};r.ior=e.ior,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}}class Dw{constructor(e){this.writer=e,this.name="KHR_materials_specular"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.specularIntensity===1&&e.specularColor.equals(gw)&&!e.specularIntensityMap&&!e.specularColorMap)return;const n=this.writer,s=n.extensionsUsed,r={};if(e.specularIntensityMap){const a={index:await n.processTextureAsync(e.specularIntensityMap),texCoord:e.specularIntensityMap.channel};n.applyTextureTransform(a,e.specularIntensityMap),r.specularTexture=a}if(e.specularColorMap){const a={index:await n.processTextureAsync(e.specularColorMap),texCoord:e.specularColorMap.channel};n.applyTextureTransform(a,e.specularColorMap),r.specularColorTexture=a}r.specularFactor=e.specularIntensity,r.specularColorFactor=e.specularColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}}class Uw{constructor(e){this.writer=e,this.name="KHR_materials_sheen"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.sheen==0)return;const n=this.writer,s=n.extensionsUsed,r={};if(e.sheenRoughnessMap){const a={index:await n.processTextureAsync(e.sheenRoughnessMap),texCoord:e.sheenRoughnessMap.channel};n.applyTextureTransform(a,e.sheenRoughnessMap),r.sheenRoughnessTexture=a}if(e.sheenColorMap){const a={index:await n.processTextureAsync(e.sheenColorMap),texCoord:e.sheenColorMap.channel};n.applyTextureTransform(a,e.sheenColorMap),r.sheenColorTexture=a}r.sheenRoughnessFactor=e.sheenRoughness,r.sheenColorFactor=e.sheenColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}}class Nw{constructor(e){this.writer=e,this.name="KHR_materials_anisotropy"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.anisotropy==0)return;const n=this.writer,s=n.extensionsUsed,r={};if(e.anisotropyMap){const a={index:await n.processTextureAsync(e.anisotropyMap)};n.applyTextureTransform(a,e.anisotropyMap),r.anisotropyTexture=a}r.anisotropyStrength=e.anisotropy,r.anisotropyRotation=e.anisotropyRotation,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}}class Ow{constructor(e){this.writer=e,this.name="KHR_materials_emissive_strength"}async writeMaterialAsync(e,t){if(!e.isMeshStandardMaterial||e.emissiveIntensity===1)return;const s=this.writer.extensionsUsed,r={};r.emissiveStrength=e.emissiveIntensity,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}}class Fw{constructor(e){this.writer=e,this.name="EXT_materials_bump"}async writeMaterialAsync(e,t){if(!e.isMeshStandardMaterial||e.bumpScale===1&&!e.bumpMap)return;const n=this.writer,s=n.extensionsUsed,r={};if(e.bumpMap){const a={index:await n.processTextureAsync(e.bumpMap),texCoord:e.bumpMap.channel};n.applyTextureTransform(a,e.bumpMap),r.bumpTexture=a}r.bumpFactor=e.bumpScale,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}}class Bw{constructor(e){this.writer=e,this.name="EXT_mesh_gpu_instancing"}writeNode(e,t){if(!e.isInstancedMesh)return;const n=this.writer,s=e,r=new Float32Array(s.count*3),a=new Float32Array(s.count*4),c=new Float32Array(s.count*3),u=new _t,d=new I,f=new Ui,m=new I;for(let g=0;g<s.count;g++)s.getMatrixAt(g,u),u.decompose(d,f,m),d.toArray(r,g*3),f.toArray(a,g*4),m.toArray(c,g*3);const v={TRANSLATION:n.processAccessor(new Dt(r,3)),ROTATION:n.processAccessor(new Dt(a,4)),SCALE:n.processAccessor(new Dt(c,3))};s.instanceColor&&(v._COLOR_0=n.processAccessor(s.instanceColor)),t.extensions=t.extensions||{},t.extensions[this.name]={attributes:v},n.extensionsUsed[this.name]=!0,n.extensionsRequired[this.name]=!0}}sa.Utils={insertKeyframe:function(i,e){const n=i.getValueSize(),s=new i.TimeBufferType(i.times.length+1),r=new i.ValueBufferType(i.values.length+n),a=i.createInterpolant(new i.ValueBufferType(n));let c;if(i.times.length===0){s[0]=e;for(let u=0;u<n;u++)r[u]=0;c=0}else if(e<i.times[0]){if(Math.abs(i.times[0]-e)<.001)return 0;s[0]=e,s.set(i.times,1),r.set(a.evaluate(e),0),r.set(i.values,n),c=0}else if(e>i.times[i.times.length-1]){if(Math.abs(i.times[i.times.length-1]-e)<.001)return i.times.length-1;s[s.length-1]=e,s.set(i.times,0),r.set(i.values,0),r.set(a.evaluate(e),i.values.length),c=s.length-1}else for(let u=0;u<i.times.length;u++){if(Math.abs(i.times[u]-e)<.001)return u;if(i.times[u]<e&&i.times[u+1]>e){s.set(i.times.slice(0,u+1),0),s[u+1]=e,s.set(i.times.slice(u+1),u+2),r.set(i.values.slice(0,(u+1)*n),0),r.set(a.evaluate(e),(u+1)*n),r.set(i.values.slice((u+1)*n),(u+2)*n),c=u+1;break}}return i.times=s,i.values=r,c},mergeMorphTargetTracks:function(i,e){const t=[],n={},s=i.tracks;for(let r=0;r<s.length;++r){let a=s[r];const c=gt.parseTrackName(a.name),u=gt.findNode(e,c.nodeName);if(c.propertyName!=="morphTargetInfluences"||c.propertyIndex===void 0){t.push(a);continue}if(a.createInterpolant!==a.InterpolantFactoryMethodDiscrete&&a.createInterpolant!==a.InterpolantFactoryMethodLinear){if(a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline)throw new Error("THREE.GLTFExporter: Cannot merge tracks with glTF CUBICSPLINE interpolation.");console.warn("THREE.GLTFExporter: Morph target interpolation mode not yet supported. Using LINEAR instead."),a=a.clone(),a.setInterpolation(Ov)}const d=u.morphTargetInfluences.length,f=u.morphTargetDictionary[c.propertyIndex];if(f===void 0)throw new Error("THREE.GLTFExporter: Morph target name not found: "+c.propertyIndex);let m;if(n[u.uuid]===void 0){m=a.clone();const g=new m.ValueBufferType(d*m.times.length);for(let b=0;b<m.times.length;b++)g[b*d+f]=m.values[b];m.name=(c.nodeName||"")+".morphTargetInfluences",m.values=g,n[u.uuid]=m,t.push(m);continue}const v=a.createInterpolant(new a.ValueBufferType(1));m=n[u.uuid];for(let g=0;g<m.times.length;g++)m.values[g*d+f]=v.evaluate(m.times[g]);for(let g=0;g<a.times.length;g++){const b=this.insertKeyframe(m,a.times[g]);m.values[b*d+f]=a.values[g]}}return i.tracks=t,i},toFloat32BufferAttribute:function(i){const e=new Dt(new Float32Array(i.count*i.itemSize),i.itemSize,!1);if(!i.normalized&&!i.isInterleavedBufferAttribute)return e.array.set(i.array),e;for(let t=0,n=i.count;t<n;t++)for(let s=0;s<i.itemSize;s++)e.setComponent(t,s,i.getComponent(t,s));return e}};const Fd={shininess:1e3,specularColor:65793};new Ke(16777215);class es{static save(e,t){const n=window.URL.createObjectURL(e),s=document.createElement("a");s.href=n,s.download=t,s.style.display="none",document.body.appendChild(s),s.click(),document.body.removeChild(s),window.URL.revokeObjectURL(n)}static saveString(e,t){const n=new Blob([e],{type:"text/plain;charset=utf-8"});es.save(n,t)}static saveBinary(e,t){const n=new Blob([new Uint8Array(e)],{type:"application/octet-stream"});es.save(n,t)}static saveArrayBuffer(e,t){const n=new Blob([e],{type:"application/octet-stream"});es.save(n,t)}}(function(){var i=new Int32Array(24),e=new Int32Array(256);(function(){for(var n=0,s=0;s<8;++s)for(var r=1;r<=4;r<<=1){var a=s^r;s<=a&&(i[n++]=s,i[n++]=a)}for(var s=0;s<256;++s){for(var c=0,r=0;r<24;r+=2){var u=!!(s&1<<i[r]),d=!!(s&1<<i[r+1]);c|=u!==d?1<<(r>>1):0}e[s]=c}})();var t=new Int32Array(4096);return function(n,s,r){var a=[],c=[],u=0,d=new Int32Array(3),f=new Int32Array([1,s[0]+1,(s[0]+1)*(s[1]+1)]),m=new Float32Array(8),v=1;for(f[2]*2>t.length&&(t=new Int32Array(f[2]*2)),d[2]=0;d[2]<s[2]-1;++d[2],u+=s[0],v^=1,f[2]=-f[2]){var g=1+(s[0]+1)*(1+v*(s[1]+1));for(d[1]=0;d[1]<s[1]-1;++d[1],++u,g+=2)for(d[0]=0;d[0]<s[0]-1;++d[0],++u,++g){for(var b=0,y=0,x=u,_=0;_<2;++_,x+=s[0]*(s[1]-2))for(var w=0;w<2;++w,x+=s[0]-2)for(var E=0;E<2;++E,++y,++x){var M=n[x]-r;m[y]=M,b|=M<0?1<<y:0}if(!(b===0||b===255)){for(var P=e[b],D=[0,0,0],O=0,E=0;E<12;++E)if(P&1<<E){++O;var U=i[E<<1],L=i[(E<<1)+1],A=m[U],F=m[L],q=A-F;if(Math.abs(q)>1e-6)q=A/q;else continue;for(var w=0,_=1;w<3;++w,_<<=1){var X=U&_,J=L&_;X!==J?D[w]+=X?1-q:q:D[w]+=X?1:0}}for(var Q=1/O,E=0;E<3;++E)D[E]=d[E]+Q*D[E];t[g]=a.length,a.push([2*D[0]/s[0]-1,2*D[1]/s[1]-1,2*D[2]/s[2]-1]);for(var E=0;E<3;++E)if(P&1<<E){var te=(E+1)%3,ee=(E+2)%3;if(!(d[te]===0||d[ee]===0)){var z=f[te],le=f[ee];b&1?c.push([t[g],t[g-z],t[g-z-le],t[g-le]]):c.push([t[g],t[g-le],t[g-z-le],t[g-z]])}}}}}return{vertices:a,faces:c}}})();class kw extends Lt{constructor(e,t,n,s,r,a){const c=new Mn;super(c,t),this.maxCount=16384,this.count=0,this.hasPositions=!1,this.hasNormals=!1,this.hasColors=!1,this.hasUvs=!1;const u=this;this.isovalue=0;const d=new Float32Array(12*3),f=new Float32Array(12*3);this.enableUvs=!!n,this.enableColors=!!s,this.enableNormals=!!r,this.dirty=!0,this.resolution=[0,0,0],this.stepSizeX=0,this.stepSizeY=0,this.stepSizeZ=0,this.sizeX=0,this.sizeY=0,this.sizeZ=0,this.sizeXY=0,this.sizeXYZ=0,this.size3=0,this.halfsizeX=0,this.halfsizeY=0,this.halfsizeZ=0,this.deltaX=0,this.deltaY=0,this.deltaZ=0,this.yd=0,this.zd=0,this.field=new Uint8Array,this.normal_cache=new Float32Array,this.positionArray=new Float32Array,this.normalArray=new Float32Array,this.uvArray=new Float32Array,this.colorArray=new Float32Array,this.init=function(w,E){this.dirty=!0,this.resolution=w,this.isovalue=.05,this.stepSizeX=1,this.stepSizeY=1,this.stepSizeZ=1,this.sizeX=w[0],this.sizeY=w[1],this.sizeZ=w[2],this.sizeXY=this.sizeX*this.sizeY,this.sizeXYZ=this.sizeXY*this.sizeZ,this.size3=this.sizeXYZ,this.halfsizeX=this.sizeX/2,this.halfsizeY=this.sizeY/2,this.halfsizeZ=this.sizeZ/2,this.deltaX=2/this.sizeX,this.deltaY=2/this.sizeY,this.deltaZ=2/this.sizeZ,this.yd=this.sizeX,this.zd=this.sizeXY,E?this.field=E:this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.maxCount=16384,this.count=0,this.hasPositions=!1,this.hasNormals=!1,this.hasColors=!1,this.hasUvs=!1,this.positionArray=new Float32Array(this.maxCount*3),this.enableNormals&&(this.normalArray=new Float32Array(this.maxCount*3)),this.enableUvs&&(this.uvArray=new Float32Array(this.maxCount*2)),this.enableColors&&(this.colorArray=new Float32Array(this.maxCount*3))};function m(w,E,M){return w+(E-w)*M}function v(w,E,M,P,D,O,U,L){const A=(M-U)/(L-U),F=u.normal_cache;d[E+0]=P+A*u.deltaX*u.stepSizeX,d[E+1]=D,d[E+2]=O,f[E+0]=m(F[w+0],F[w+3],A),f[E+1]=m(F[w+1],F[w+4],A),f[E+2]=m(F[w+2],F[w+5],A)}function g(w,E,M,P,D,O,U,L){const A=(M-U)/(L-U),F=u.normal_cache;d[E+0]=P,d[E+1]=D+A*u.deltaY*u.stepSizeY,d[E+2]=O;const q=w+u.yd*3;f[E+0]=m(F[w+0],F[q+0],A),f[E+1]=m(F[w+1],F[q+1],A),f[E+2]=m(F[w+2],F[q+2],A)}function b(w,E,M,P,D,O,U,L){const A=(M-U)/(L-U),F=u.normal_cache;d[E+0]=P,d[E+1]=D,d[E+2]=O+A*u.deltaZ*u.stepSizeZ;const q=w+u.zd*3;f[E+0]=m(F[w+0],F[q+0],A),f[E+1]=m(F[w+1],F[q+1],A),f[E+2]=m(F[w+2],F[q+2],A)}function y(w){const E=w*3;u.normal_cache[E]===0&&(u.normal_cache[E+0]=u.field[w-1*u.stepSizeX]-u.field[w+1*u.stepSizeX],u.normal_cache[E+1]=u.field[w-u.yd*u.stepSizeY]-u.field[w+u.yd*u.stepSizeY],u.normal_cache[E+2]=u.field[w-u.zd*u.stepSizeZ]-u.field[w+u.zd*u.stepSizeZ])}function x(w,E,M,P,D,O){const U=P+1*u.stepSizeX,L=P+u.yd*u.stepSizeY,A=P+u.zd*u.stepSizeZ,F=U+u.yd*u.stepSizeY,q=U+u.zd*u.stepSizeZ,X=P+u.yd*u.stepSizeY+u.zd*u.stepSizeZ,J=U+u.yd*u.stepSizeY+u.zd*u.stepSizeZ;let Q=0;const te=u.field[P],ee=u.field[U],z=u.field[L],le=u.field[F],ce=u.field[A],re=u.field[q],Re=u.field[X],st=u.field[J];te<D&&(Q|=1),ee<D&&(Q|=2),z<D&&(Q|=8),le<D&&(Q|=4),ce<D&&(Q|=16),re<D&&(Q|=32),Re<D&&(Q|=128),st<D&&(Q|=64);const Y=zw[Q];if(Y===0)return 0;const ae=u.deltaX*u.stepSizeX,ye=u.deltaY*u.stepSizeY,me=u.deltaZ*u.stepSizeZ,Le=w+ae,Fe=E+ye,Ve=M+me;Y&1&&(y(P),y(U),v(P*3,0,D,w,E,M,te,ee)),Y&2&&(y(U),y(F),g(U*3,3,D,Le,E,M,ee,le)),Y&4&&(y(L),y(F),v(L*3,6,D,w,Fe,M,z,le)),Y&8&&(y(P),y(L),g(P*3,9,D,w,E,M,te,z)),Y&16&&(y(A),y(q),v(A*3,12,D,w,E,Ve,ce,re)),Y&32&&(y(q),y(J),g(q*3,15,D,Le,E,Ve,re,st)),Y&64&&(y(X),y(J),v(X*3,18,D,w,Fe,Ve,Re,st)),Y&128&&(y(A),y(X),g(A*3,21,D,w,E,Ve,ce,Re)),Y&256&&(y(P),y(A),b(P*3,24,D,w,E,M,te,ce)),Y&512&&(y(U),y(q),b(U*3,27,D,Le,E,M,ee,re)),Y&1024&&(y(F),y(J),b(F*3,30,D,Le,Fe,M,le,st)),Y&2048&&(y(L),y(X),b(L*3,33,D,w,Fe,M,z,Re)),Q<<=4;let j,ge,Xe,k=0,ut=0;for(;Ao[Q+ut]!=-1;)j=Q+ut,ge=j+1,Xe=j+2,_(d,f,3*Ao[j],3*Ao[ge],3*Ao[Xe],O),ut+=3,k++;return k}function _(w,E,M,P,D,O){const U=u.count*3;if(u.positionArray[U+0]=w[M],u.positionArray[U+1]=w[M+1],u.positionArray[U+2]=w[M+2],u.positionArray[U+3]=w[P],u.positionArray[U+4]=w[P+1],u.positionArray[U+5]=w[P+2],u.positionArray[U+6]=w[D],u.positionArray[U+7]=w[D+1],u.positionArray[U+8]=w[D+2],u.enableNormals&&(u.normalArray[U+0]=E[M],u.normalArray[U+1]=E[M+1],u.normalArray[U+2]=E[M+2],u.normalArray[U+3]=E[P],u.normalArray[U+4]=E[P+1],u.normalArray[U+5]=E[P+2],u.normalArray[U+6]=E[D],u.normalArray[U+7]=E[D+1],u.normalArray[U+8]=E[D+2]),u.enableUvs){const L=u.count*2;u.uvArray[L+0]=w[M],u.uvArray[L+1]=w[M+2],u.uvArray[L+2]=w[P],u.uvArray[L+3]=w[P+2],u.uvArray[L+4]=w[D],u.uvArray[L+5]=w[D+2]}u.enableColors&&(u.colorArray[U+0]=w[M],u.colorArray[U+1]=w[M+1],u.colorArray[U+2]=w[M+2],u.colorArray[U+3]=w[P],u.colorArray[U+4]=w[P+1],u.colorArray[U+5]=w[P+2],u.colorArray[U+6]=w[D],u.colorArray[U+7]=w[D+1],u.colorArray[U+8]=w[D+2]),u.count+=3,u.count>=u.maxCount-3&&(u.hasPositions=!0,u.enableNormals&&(u.hasNormals=!0),u.enableUvs&&(u.hasUvs=!0),u.enableColors&&(u.hasColors=!0),O(u))}this.begin=function(){this.count=0,this.hasPositions=!1,this.hasNormals=!1,this.hasUvs=!1,this.hasColors=!1},this.end=function(w){if(this.count!==0){for(let E=this.count*3;E<this.positionArray.length;E++)this.positionArray[E]=0;this.hasPositions=!0,this.enableNormals&&(this.hasNormals=!0),this.enableUvs&&(this.hasUvs=!0),this.enableColors&&(this.hasColors=!0),w(this)}},this.reset=function(){var w;for(w=0;w<this.size3;w++)this.normal_cache[w*3]=0,this.field[w]=0},this.render=function(w){if(!this.dirty){this.end(w);return}this.begin();const E=this.sizeX-2,M=this.sizeY-2,P=this.sizeZ-2;for(let D=1;D<P;D+=this.stepSizeZ){const O=this.sizeXY*D,U=(D-this.halfsizeZ)/this.halfsizeZ;for(let L=1;L<M;L+=this.stepSizeY){const A=O+this.sizeX*L,F=(L-this.halfsizeY)/this.halfsizeY;for(let q=1;q<E;q+=this.stepSizeX){const X=(q-this.halfsizeX)/this.halfsizeX,J=A+q;x(X,F,U,J,this.isovalue,w)}}}this.end(w)},this.generateGeometry=function(){if(!this.dirty)return;const w=[],E=function(M){const P=new Mn;P.setAttribute("position",new Dt(M.positionArray.slice(),3)),M.enableNormals&&P.setAttribute("normal",new Dt(M.normalArray.slice(),3));const D=new Uint16Array(M.count),O=M.count/3;for(let U=0;U<O;U++){const L=U*3,A=L+1,F=L+2;D[U*3+0]=L,D[U*3+1]=A,D[U*3+2]=F}P.setIndex(new Dt(D,1)),w.push(P),M.count=0};return this.render(E),this.dirty=!1,w},this.init(e,a)}}const zw=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Ao=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),Pl=.95;class Vw{constructor(e){this.volume=e,this.meshRoot=new Et,this.meshRoot.name="Mesh Surface Group",this.meshPivot=new Ai,this.meshPivot.name="MeshContainerNode",this.meshPivot.add(this.meshRoot),this.meshrep=[],this.channelColors=[],this.channelOpacities=[],this.scale=new I(1,1,1),this.bounds={bmin:new I(-.5,-.5,-.5),bmax:new I(.5,.5,.5)}}cleanup(){for(let e=0;e<this.volume.imageInfo.numChannels;++e)this.destroyIsosurface(e)}setVisible(e){this.meshRoot.visible=e}doRender(){}get3dObject(){return this.meshPivot}setScale(e,t=new I(0,0,0)){this.scale=e,this.meshRoot.scale.copy(e).multiplyScalar(.5),this.meshRoot.position.copy(t)}setFlipAxes(e,t,n){this.meshRoot.scale.copy(new I(.5*this.scale.x*e,.5*this.scale.y*t,.5*this.scale.z*n))}setTranslation(e){this.meshPivot.position.copy(e)}setRotation(e){this.meshPivot.rotation.copy(e),this.updateClipFromBounds()}setResolution(e,t){}setOrthoThickness(e){}setAxisClip(e,t,n,s){this.bounds.bmax[e]=n,this.bounds.bmin[e]=t,this.updateClipFromBounds()}updateMeshColors(e){this.channelColors=e;for(let t=0;t<this.volume.imageInfo.numChannels;++t){const n=this.meshrep[t];if(n){const s=e[t],r=s[0]<<16|s[1]<<8|s[2];n.traverse(function(a){a instanceof Lt&&(a.material.color=new Ke(r))})}}}createMaterialForChannel(e,t,n){const s=e[0]<<16|e[1]<<8|e[2];return new F0({color:new Ke(s),shininess:Fd.shininess,specular:new Ke(Fd.specularColor),opacity:t,transparent:t<Pl,side:Un})}createMeshForChannel(e,t,n,s,r){const a=this.generateIsosurfaceGeometry(e,n),c=this.createMaterialForChannel(t,s,r),u=new Ai;u.name="Channel"+e,u.userData={isovalue:n};for(let d=0;d<a.length;++d){const f=new Lt(a[d],c);f.layers.set(ks),u.add(f)}return u}updateIsovalue(e,t){const n=this.meshrep[e];if(!n||n.userData.isovalue===t)return;const s=this.channelOpacities[e],r=this.channelColors[e];this.destroyIsosurface(e);const a=this.createMeshForChannel(e,r,t,s,!1);this.meshrep[e]=a,this.meshRoot.add(a)}getIsovalue(e){const t=this.meshrep[e];return t==null?void 0:t.userData.isovalue}getOpacity(e){const t=this.meshrep[e];let n;return t==null||t.traverse(s=>{s instanceof Lt&&(n=s.material.opacity)}),n}updateClipRegion(e,t,n,s,r,a){this.bounds={bmin:new I(e-.5,n-.5,r-.5),bmax:new I(t-.5,s-.5,a-.5)},this.updateClipFromBounds()}updateClipFromBounds(){const e=this.bounds.bmin.x,t=this.bounds.bmin.y,n=this.bounds.bmin.z,s=this.bounds.bmax.x,r=this.bounds.bmax.y,a=this.bounds.bmax.z,c=this.meshPivot.rotation;for(let u=0;u<this.meshrep.length;++u){const d=this.meshrep[u];if(!d)continue;const f=[];e>-.5&&f.push(new yn(new I(1,0,0).applyEuler(c),this.meshRoot.position.x+-e*this.scale.x)),t>-.5&&f.push(new yn(new I(0,1,0).applyEuler(c),this.meshRoot.position.y+-t*this.scale.y)),n>-.5&&f.push(new yn(new I(0,0,1).applyEuler(c),this.meshRoot.position.z+-n*this.scale.z)),s<.5&&f.push(new yn(new I(-1,0,0).applyEuler(c),this.meshRoot.position.x+s*this.scale.x)),r<.5&&f.push(new yn(new I(0,-1,0).applyEuler(c),this.meshRoot.position.y+r*this.scale.y)),a<.5&&f.push(new yn(new I(0,0,-1).applyEuler(c),this.meshRoot.position.z+a*this.scale.z)),d.traverse(function(m){m instanceof Lt&&(m.material.clippingPlanes=f)})}}updateOpacity(e,t){this.channelOpacities[e]=t;const n=this.meshrep[e];n&&n.traverse(function(s){s instanceof Lt&&(s.material.opacity=t,s.material.transparent=t<Pl)})}hasIsosurface(e){return!!this.meshrep[e]}createIsosurface(e,t,n=127,s=1,r=s<Pl){if(!this.meshrep[e]){const a=this.createMeshForChannel(e,t,n,s,r);this.meshrep[e]=a,this.channelOpacities[e]=s,this.channelColors[e]=t,this.meshRoot.add(a)}}destroyIsosurface(e){const t=this.meshrep[e];t&&(this.meshRoot.remove(t),t.traverse(function(n){n instanceof Lt&&(n.material.dispose(),n.geometry.dispose())}),this.meshrep[e]=null)}saveChannelIsosurface(e,t,n){const s=this.meshrep[e];if(s){if(t==="STL")this.exportSTL(s,n+"_"+this.volume.channelNames[e]);else if(t==="GLTF"){const r=[];for(let a=0;a<this.meshrep.length;++a){const c=this.meshrep[a];c&&(r[a]=c.visible,c.visible=a===e)}this.exportGLTF(this.meshRoot,n+"_"+this.volume.channelNames[e]);for(let a=0;a<this.meshrep.length;++a){const c=this.meshrep[a];c&&(c.visible=r[a])}}}}exportSTL(e,t){const s=new mw().parse(e,{binary:!0});es.saveBinary(s.buffer,t+".stl")}exportGLTF(e,t){const n=new sa,s={trs:!1,onlyVisible:!0,truncateDrawRange:!0,binary:!0,forceIndices:!1,forcePowerOfTwoTextures:!0};n.parse(e,function(r){if(r instanceof ArrayBuffer)es.saveArrayBuffer(r,t+".glb");else{const a=JSON.stringify(r,null,2);es.saveString(a,t+".gltf")}},function(r){console.error(r)},s)}generateIsosurfaceGeometry(e,t){if(!this.volume)return[];const n=this.volume.channels[e].volumeData,s=this.volume.imageInfo.subregionSize.toArray();{const r=new kw(s,new ss,!1,!1,!0,n);return r.position.copy(this.meshRoot.position),r.scale.set(.5*this.scale.x,.5*this.scale.y,.5*this.scale.z),r.isovalue=t,r.generateGeometry()||[]}}}const Gw=`precision highp float;
precision highp int;
precision highp usampler2D;
precision highp sampler3D;

// the lut texture is a 256x1 rgba texture for each channel
uniform sampler2D lutSampler;

uniform vec2 lutMinMax;

// src texture is the raw volume intensity data
uniform usampler2D srcTexture;

void main()
{
    ivec2 vUv = ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y));
    uint intensity = texelFetch(srcTexture, vUv, 0).r;
    float ilookup = float(float(intensity) - lutMinMax.x) / float(lutMinMax.y - lutMinMax.x);
    // apply lut to intensity:
    vec4 pix = texture(lutSampler, vec2(ilookup, 0.5));
    gl_FragColor = vec4(pix.xyz*pix.w, pix.w);
}
`,Hw=`precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;

// the lut texture is a 256x1 rgba texture for each channel
uniform sampler2D lutSampler;

uniform vec2 lutMinMax;

// src texture is the raw volume intensity data
uniform sampler2D srcTexture;

void main()
{
    ivec2 vUv = ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y));

    // load from channel
    float intensity = texelFetch(srcTexture, vUv, 0).r;

    float ilookup = float(float(intensity) - lutMinMax.x) / float(lutMinMax.y - lutMinMax.x);
    // apply lut to intensity:
    vec4 pix = texture(lutSampler, vec2(ilookup, 0.5));
    gl_FragColor = vec4(pix.xyz*pix.w, pix.w);
}
`,Ww=`precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;

// the lut texture is a 256x1 rgba texture for each channel
uniform sampler2D lutSampler;

uniform vec2 lutMinMax;

// src texture is the raw volume intensity data
uniform isampler2D srcTexture;

void main()
{
    ivec2 vUv = ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y));
    int intensity = texelFetch(srcTexture, vUv, 0).r;
    float ilookup = float(float(intensity) - lutMinMax.x) / float(lutMinMax.y - lutMinMax.x);
    // apply lut to intensity:
    vec4 pix = texture(lutSampler, vec2(ilookup, 0.5));
    gl_FragColor = vec4(pix.xyz*pix.w, pix.w);
}
`;class Gp{constructor(e,t){this.width=e,this.height=t,this.maskTexture=new Gs(new Uint8ClampedArray(this.width*this.height).fill(255),this.width,this.height,la,Qt),this.maskTexture.generateMipmaps=!1,this.maskTexture.magFilter=zt,this.maskTexture.minFilter=zt,this.maskTexture.wrapS=dn,this.maskTexture.wrapT=dn,this.maskTexture.unpackAlignment=1,this.fuseRequested=null,this.channelsDataToFuse=[],this.fuseScene=new ns,this.quadCamera=new oi(-1,1,1,-1,0,1),this.fuseRenderTarget=new Fn(this.width,this.height,{minFilter:zt,magFilter:zt,format:Xt,type:Qt,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1,wrapS:dn,wrapT:dn}),this.fuseMaterialProps={vertexShader:ia,depthTest:!1,depthWrite:!1,blending:hp,blendSrc:kl,blendDst:kl,blendEquation:up},this.fuseMaterialF=this.setupFuseMaterial(Hw),this.fuseMaterialUI=this.setupFuseMaterial(Gw),this.fuseMaterialI=this.setupFuseMaterial(Ww),this.fuseMaterialF.needsUpdate=!0,this.fuseMaterialUI.needsUpdate=!0,this.fuseMaterialI.needsUpdate=!0,this.fuseGeometry=new Ni(2,2)}setupFuseMaterial(e){return new mn({uniforms:{lutSampler:{value:null},lutMinMax:{value:new Ue(0,255)},srcTexture:{value:null}},fragmentShader:e,...this.fuseMaterialProps})}getFusedTexture(){return this.fuseRenderTarget.texture}cleanup(){this.fuseScene.clear(),this.maskTexture.dispose()}getShader(e){switch(e){case"float32":return this.fuseMaterialF;case"uint8":case"uint16":case"uint32":return this.fuseMaterialUI;case"int8":case"int16":case"int32":return this.fuseMaterialI;default:throw new Error("Unsupported data type for fuse shader")}}fuse(e,t){let n=!1;for(let s=0;s<e.length;++s){const r=e[s],a=r.chIndex;t[a].loaded&&(r.lut=t[a].combineLuts(r.rgbColor,r.lut),n=!0)}if(!n){this.channelsDataToFuse=[],this.fuseRequested=[];return}this.fuseRequested=e,this.channelsDataToFuse=t}gpuFuse(e){const t=this.fuseRequested,n=this.channelsDataToFuse;if(t){this.fuseScene.traverse(s=>{s instanceof Lt&&s.material.dispose()}),this.fuseScene.clear();for(let s=0;s<t.length;++s)if(t[s].rgbColor){const r=t[s].chIndex;if(!n[r].loaded)continue;const a=this.getShader(n[r].dtype).clone();a.uniforms.lutSampler.value=n[r].lutTexture,a.uniforms.lutMinMax.value=new Ue(n[r].rawMin,n[r].rawMax),a.uniforms.srcTexture.value=n[r].dataTexture,this.fuseScene.add(new Lt(this.fuseGeometry,a))}if(this.fuseScene.children.length>0){e.setRenderTarget(this.fuseRenderTarget),e.autoClearColor=!0;const s=new Ke;e.getClearColor(s);const r=e.getClearAlpha();e.setClearColor(0,0),e.render(this.fuseScene,this.quadCamera),e.setRenderTarget(null),e.setClearColor(s,r)}this.fuseRequested=null}}setChannelAsMask(e,t){if(!t||!t.loaded)return!1;const n=new Uint8ClampedArray(t.imgData.data.length);for(let r=0;r<t.imgData.data.length;r++)n[r]=t.imgData.data[r]>0?255:0;const s={data:n,width:this.width,height:this.height,colorSpace:"srgb"};return this.maskTexture.image=s,this.maskTexture.needsUpdate=!0,!0}}const Xw=`// switch on high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 pObj;

void main() {
  pObj = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Yw=`
#ifdef GL_ES
precision highp float;
#endif

#define M_PI 3.14159265358979323846

uniform vec2 iResolution;
uniform vec2 textureRes;
uniform float GAMMA_MIN;
uniform float GAMMA_MAX;
uniform float GAMMA_SCALE;
uniform float BRIGHTNESS;
uniform float DENSITY;
uniform float maskAlpha;
uniform vec2 ATLAS_DIMS;
uniform vec3 AABB_CLIP_MIN;
uniform float CLIP_NEAR;
uniform vec3 AABB_CLIP_MAX;
uniform float CLIP_FAR;
uniform sampler2D textureAtlas;
uniform sampler2D textureAtlasMask;
uniform sampler2D textureDepth;
uniform int usingPositionTexture;
uniform int BREAK_STEPS;
uniform float SLICES;
uniform float isOrtho;
uniform float orthoThickness;
uniform float orthoScale;
uniform int maxProject;
uniform bool interpolationEnabled;
uniform vec3 flipVolume;
uniform vec3 volumeScale;

// view space to axis-aligned volume box
uniform mat4 inverseModelViewMatrix;
uniform mat4 inverseProjMatrix;

varying vec3 pObj;

float powf(float a, float b) {
  return pow(a,b);
}

float rand(vec2 co) {
  float threadId = gl_FragCoord.x/(gl_FragCoord.y + 1.0);
  float bigVal = threadId*1299721.0/911.0;
  vec2 smallVal = vec2(threadId*7927.0/577.0, threadId*104743.0/1039.0);
  return fract(sin(dot(co, smallVal)) * bigVal);
}

vec4 luma2Alpha(vec4 color, float vmin, float vmax, float C) {
  float x = dot(color.rgb, vec3(0.2125, 0.7154, 0.0721));
  // float x = max(color[2], max(color[0],color[1]));
  float xi = (x-vmin)/(vmax-vmin);
  xi = clamp(xi,0.0,1.0);
  float y = pow(xi,C);
  y = clamp(y,0.0,1.0);
  color[3] = y;
  return color;
}

vec2 offsetFrontBack(float t) {
  int a = int(t);
  int ax = int(ATLAS_DIMS.x);
  vec2 os = vec2(float(a - (a / ax) * ax), float(a / ax)) / ATLAS_DIMS;
  return clamp(os, vec2(0.0), vec2(1.0) - vec2(1.0) / ATLAS_DIMS);
}

vec4 sampleAtlasLinear(sampler2D tex, vec4 pos) {
  float bounds = float(pos[0] >= 0.0 && pos[0] <= 1.0 &&
                       pos[1] >= 0.0 && pos[1] <= 1.0 &&
                       pos[2] >= 0.0 && pos[2] <= 1.0 );
  float nSlices = float(SLICES);
  // get location within atlas tile
  // TODO: get loc1 which follows ray to next slice along ray direction
  // when flipvolume = 1:  pos
  // when flipvolume = -1: 1-pos
  vec2 loc0 = ((pos.xy - 0.5) * flipVolume.xy + 0.5) / ATLAS_DIMS;

  // loc ranges from 0 to 1/ATLAS_DIMS
  // shrink loc0 to within one half edge texel - so as not to sample across edges of tiles.
  loc0 = vec2(0.5) / textureRes + loc0 * (vec2(1.0) - ATLAS_DIMS / textureRes);
  
  // interpolate between two slices
  float z = (pos.z)*(nSlices-1.0);
  float z0 = floor(z);
  float t = z-z0; //mod(z, 1.0);
  float z1 = min(z0+1.0, nSlices-1.0);

  // flipped:
  if (flipVolume.z == -1.0) {
    z0 = nSlices - z0 - 1.0;
    z1 = nSlices - z1 - 1.0;
    t = 1.0 - t;
  }

  // get slice offsets in texture atlas
  vec2 o0 = offsetFrontBack(z0) + loc0;
  vec2 o1 = offsetFrontBack(z1) + loc0;

  vec4 slice0Color = texture2D(tex, o0);
  vec4 slice1Color = texture2D(tex, o1);
  // NOTE we could premultiply the mask in the fuse function,
  // but that is slower to update the maskAlpha value than here in the shader.
  // it is a memory vs perf tradeoff.  Do users really need to update the maskAlpha at realtime speed?
  float slice0Mask = texture2D(textureAtlasMask, o0).x;
  float slice1Mask = texture2D(textureAtlasMask, o1).x;
  // or use max for conservative 0 or 1 masking?
  float maskVal = mix(slice0Mask, slice1Mask, t);
  // take mask from 0..1 to alpha..1
  maskVal = mix(maskVal, 1.0, maskAlpha);
  vec4 retval = mix(slice0Color, slice1Color, t);
  // only mask the rgb, not the alpha(?)
  retval.rgb *= maskVal;
  return bounds*retval;
}

vec4 sampleAtlasNearest(sampler2D tex, vec4 pos) {
  float bounds = float(pos[0] >= 0.0 && pos[0] <= 1.0 &&
                       pos[1] >= 0.0 && pos[1] <= 1.0 &&
                       pos[2] >= 0.0 && pos[2] <= 1.0 );
  float nSlices = float(SLICES);

  vec2 loc0 = ((pos.xy - 0.5) * flipVolume.xy + 0.5) / ATLAS_DIMS;

  // No interpolation - sample just one slice at a pixel center.
  // Ideally this would be accomplished in part by switching this texture to linear
  //   filtering, but three makes this difficult to do through a WebGLRenderTarget.
  loc0 = floor(loc0 * textureRes) / textureRes;
  loc0 += vec2(0.5) / textureRes;

  float z = min(floor(pos.z * nSlices), nSlices-1.0);
  
  if (flipVolume.z == -1.0) {
    z = nSlices - z - 1.0;
  }

  vec2 o = offsetFrontBack(z) + loc0;
  vec4 voxelColor = texture2D(tex, o);

  // Apply mask
  float voxelMask = texture2D(textureAtlasMask, o).x;
  voxelMask = mix(voxelMask, 1.0, maskAlpha);
  voxelColor.rgb *= voxelMask;

  return bounds*voxelColor;
}

bool intersectBox(in vec3 r_o, in vec3 r_d, in vec3 boxMin, in vec3 boxMax,
                  out float tnear, out float tfar) {
  // compute intersection of ray with all six bbox planes
  vec3 invR = vec3(1.0,1.0,1.0) / r_d;
  vec3 tbot = invR * (boxMin - r_o);
  vec3 ttop = invR * (boxMax - r_o);

  // re-order intersections to find smallest and largest on each axis
  vec3 tmin = min(ttop, tbot);
  vec3 tmax = max(ttop, tbot);

  // find the largest tmin and the smallest tmax
  float largest_tmin  = max(max(tmin.x, tmin.y), max(tmin.x, tmin.z));
  float smallest_tmax = min(min(tmax.x, tmax.y), min(tmax.x, tmax.z));

  tnear = largest_tmin;
  tfar = smallest_tmax;

  // use >= here?
  return(smallest_tmax > largest_tmin);
}

vec4 accumulate(vec4 col, float s, vec4 C) {
  float stepScale = (1.0 - powf((1.0-col.w),s));
  col.w = stepScale;
  col.xyz *= col.w;
  col = clamp(col,0.0,1.0);

  C = (1.0-C.w)*col + C;
  return C;
}

vec4 integrateVolume(vec4 eye_o,vec4 eye_d,
                     float tnear,   float tfar,
                     float clipNear, float clipFar,
                     sampler2D textureAtlas
                     ) {
  vec4 C = vec4(0.0);
  // march along ray from front to back, accumulating color

  // estimate step length
  const int maxSteps = 512;
  // modify the 3 components of eye_d by volume scale
  float scaledSteps = float(BREAK_STEPS) * length((eye_d.xyz/volumeScale));
  float csteps = clamp(float(scaledSteps), 1.0, float(maxSteps));
  float invstep = (tfar-tnear)/csteps;
  // special-casing the single slice to remove the random ray dither.
  // this removes a Moire pattern visible in single slice images, which we want to view as 2D images as best we can.
  float r = (SLICES==1.0) ? 0.0 : rand(eye_d.xy);
  // if ortho and clipped, make step size smaller so we still get same number of steps
  float tstep = invstep*orthoThickness;
  float tfarsurf = r*tstep;
  float overflow = mod((tfarsurf - tfar),tstep); // random dithering offset
  float t = tnear + overflow;
  t += r*tstep; // random dithering offset
  float tdist = 0.0;
  int numSteps = 0;
  vec4 pos, col;
  // We need to be able to scale the alpha contrib with number of ray steps,
  // in order to make the final color invariant to the step size(?)
  // use maxSteps (a constant) as the numerator... Not sure if this is sound.
  float s = 0.5 * float(maxSteps) / csteps;
  for (int i = 0; i < maxSteps; i++) {
    pos = eye_o + eye_d*t;
    // !!! assume box bounds are -0.5 .. 0.5.  pos = (pos-min)/(max-min)
    // scaling is handled by model transform and already accounted for before we get here.
    // AABB clip is independent of this and is only used to determine tnear and tfar.
    pos.xyz = (pos.xyz-(-0.5))/((0.5)-(-0.5)); //0.5 * (pos + 1.0); // map position from [boxMin, boxMax] to [0, 1] coordinates

    vec4 col = interpolationEnabled ? sampleAtlasLinear(textureAtlas, pos) : sampleAtlasNearest(textureAtlas, pos);

    if (maxProject != 0) {
      col.xyz *= BRIGHTNESS;
      C = max(col, C);
    } else {
      col = luma2Alpha(col, GAMMA_MIN, GAMMA_MAX, GAMMA_SCALE);
      col.xyz *= BRIGHTNESS;
      // for practical use the density only matters for regular volume integration
      col.w *= DENSITY;
      C = accumulate(col, s, C);
    }
    t += tstep;
    numSteps = i;

    if (t > tfar || t > tnear+clipFar ) break;
    if (C.w > 1.0 ) break;
  }

  return C;
}

void main() {
  gl_FragColor = vec4(0.0);
  vec2 vUv = gl_FragCoord.xy/iResolution.xy;

  vec3 eyeRay_o, eyeRay_d;

  if (isOrtho == 0.0) {
    // for perspective rays:
    // world space camera coordinates
    // transform to object space
    eyeRay_o = (inverseModelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    eyeRay_d = normalize(pObj - eyeRay_o);
  } else {
    // for ortho rays:
    float zDist = 2.0;
    eyeRay_d = (inverseModelViewMatrix*vec4(0.0, 0.0, -zDist, 0.0)).xyz;
    vec4 ray_o = vec4(2.0*vUv - 1.0, 1.0, 1.0);
    ray_o.xy *= orthoScale;
    ray_o.x *= iResolution.x/iResolution.y;
    eyeRay_o = (inverseModelViewMatrix*ray_o).xyz;
  }

  // -0.5..0.5 is full box. AABB_CLIP lets us clip to a box shaped ROI to look at
  // I am applying it here at the earliest point so that the ray march does
  // not waste steps.  For general shaped ROI, this has to be handled more
  // generally (obviously)
  vec3 boxMin = AABB_CLIP_MIN;
  vec3 boxMax = AABB_CLIP_MAX;

  float tnear, tfar;
  bool hit = intersectBox(eyeRay_o, eyeRay_d, boxMin, boxMax, tnear, tfar);

  if (!hit) {
    // return background color if ray misses the cube
    // is this safe to do when there is other geometry / gObjects drawn?
    gl_FragColor = vec4(0.0); //C1;//vec4(0.0);
    return;
  }

  float clipNear = 0.0;//-(dot(eyeRay_o.xyz, eyeNorm) + dNear) / dot(eyeRay_d.xyz, eyeNorm);
  float clipFar  = 10000.0;//-(dot(eyeRay_o.xyz,-eyeNorm) + dFar ) / dot(eyeRay_d.xyz,-eyeNorm);

  // Sample the depth/position texture
  // If this is a depth texture, the r component is a depth value. If this is a position texture,
  // the xyz components are a view space position and w is 1.0 iff there's a mesh at this fragment.
  vec4 meshPosSample = texture2D(textureDepth, vUv);
  // Note: we make a different check for whether a mesh is present with depth vs. position textures.
  // Here's the check for depth textures:
  bool hasDepthValue = usingPositionTexture == 0 && meshPosSample.r < 1.0;

  // If there's a depth-contributing mesh at this fragment, we may need to terminate the ray early
  if (hasDepthValue || (usingPositionTexture == 1 && meshPosSample.a > 0.0)) {
    if (hasDepthValue) {
      // We're working with a depth value, so we need to convert back to view space position
      // Get a projection space position from depth and uv, and unproject back to view space
      vec4 meshProj = vec4(vUv * 2.0 - 1.0, meshPosSample.r * 2.0 - 1.0, 1.0);
      vec4 meshView = inverseProjMatrix * meshProj;
      meshPosSample = vec4(meshView.xyz / meshView.w, 1.0);
    }
    // Transform the mesh position to object space
    vec4 meshObj = inverseModelViewMatrix * meshPosSample;

    // Derive a t value for the mesh intersection
    // NOTE: divides by 0 when \`eyeRay_d.z\` is 0. Could be mitigated by picking another component
    //   to derive with when z is 0, but I found this was rare enough in practice to be acceptable.
    float tMesh = (meshObj.z - eyeRay_o.z) / eyeRay_d.z;
    if (tMesh < tfar) {
      clipFar = tMesh - tnear;
    }
  }

  vec4 C = integrateVolume(vec4(eyeRay_o,1.0), vec4(eyeRay_d,0.0),
                          tnear,    tfar, //intersections of box
                          clipNear, clipFar,
                          textureAtlas);

  C = clamp(C, 0.0, 1.0);
  gl_FragColor = C;
  return;
}
`,qw=Xw,jw=Yw,$w=()=>({iResolution:{type:"v2",value:new Ue(100,100)},CLIP_NEAR:{type:"f",value:.1},CLIP_FAR:{type:"f",value:20},maskAlpha:{type:"f",value:1},BRIGHTNESS:{type:"f",value:0},DENSITY:{type:"f",value:1},GAMMA_MIN:{type:"f",value:0},GAMMA_MAX:{type:"f",value:1},GAMMA_SCALE:{type:"f",value:1},BREAK_STEPS:{type:"i",value:128},ATLAS_DIMS:{type:"v2",value:new Ue(6,6)},SLICES:{type:"f",value:50},isOrtho:{type:"f",value:0},orthoThickness:{type:"f",value:1},orthoScale:{type:"f",value:.5},AABB_CLIP_MIN:{type:"v3",value:new I(-.5,-.5,-.5)},AABB_CLIP_MAX:{type:"v3",value:new I(.5,.5,.5)},inverseModelViewMatrix:{type:"m4",value:new _t},inverseProjMatrix:{type:"m4",value:new _t},textureAtlas:{type:"t",value:new Tt},textureAtlasMask:{type:"t",value:new Tt},textureDepth:{type:"t",value:new Tt},usingPositionTexture:{type:"i",value:0},maxProject:{type:"i",value:0},interpolationEnabled:{type:"b",value:!0},flipVolume:{type:"v3",value:new I(1,1,1)},volumeScale:{type:"v3",value:new I(1,1,1)},textureRes:{type:"v2",value:new Ue(1,1)}}),Bd=new Ke(16776960);class kd{constructor(e,t=new Li(e)){this.volume=e,this.uniforms=$w(),[this.geometry,this.geometryMesh]=this.createGeometry(this.uniforms),this.boxHelper=new Dp(new fn(new I(-.5,-.5,-.5),new I(.5,.5,.5)),Bd),this.boxHelper.updateMatrixWorld(),this.boxHelper.visible=!1,this.tickMarksMesh=this.createTickMarks(),this.tickMarksMesh.updateMatrixWorld(),this.tickMarksMesh.visible=!1,this.geometryTransformNode=new Ai,this.geometryTransformNode.name="VolumeContainerNode",this.geometryTransformNode.add(this.boxHelper,this.tickMarksMesh,this.geometryMesh),this.emptyPositionTex=new Gs(new Uint8Array(Array(16).fill(0)),2,2),this.settings=t,this.updateSettings(t,Pe.ALL),this.updateVolumeDimensions()}updateVolumeDimensions(){var c;const{normPhysicalSize:e,normRegionSize:t}=this.volume;this.geometryMesh.position.copy(this.volume.getContentCenter().multiply(this.settings.scale));const n=e.clone().multiply(this.settings.scale);this.geometryMesh.scale.copy(n).multiply(t),this.setUniform("volumeScale",e),this.boxHelper.box.set(n.clone().multiplyScalar(-.5),n.clone().multiplyScalar(.5)),this.tickMarksMesh.scale.copy(n),this.settings&&this.updateSettings(this.settings,Pe.ROI);const{atlasTileDims:s,subregionSize:r}=this.volume.imageInfo,a=new Ue(r.x,r.y).multiply(s);this.setUniform("ATLAS_DIMS",s),this.setUniform("textureRes",a),this.setUniform("SLICES",this.volume.imageInfo.volumeSize.z),(!this.channelData||this.channelData.width!==a.x||this.channelData.height!==a.y)&&((c=this.channelData)==null||c.cleanup(),this.channelData=new Gp(a.x,a.y))}viewpointMoved(){}updateSettings(e,t){if(t===void 0&&(t=Pe.ALL),this.settings=e,t&Pe.VIEW){this.geometryMesh.visible=this.settings.visible,this.setUniform("orthoScale",this.settings.orthoScale),this.setUniform("isOrtho",this.settings.isOrtho?1:0);const n=this.settings.viewAxis;if(this.settings.isOrtho&&n){const s=this.settings.bounds.bmax[n],r=this.settings.bounds.bmin[n],a=s-r;this.setUniform("orthoThickness",a)}else this.setUniform("orthoThickness",1)}if((t&Pe.VIEW||t&Pe.BOUNDING_BOX)&&(this.tickMarksMesh.visible=this.settings.showBoundingBox&&!this.settings.isOrtho,this.setUniform("maxProject",this.settings.maxProjectMode?1:0)),t&Pe.BOUNDING_BOX){this.boxHelper.visible=this.settings.showBoundingBox;const n=this.settings.boundingBoxColor,s=new Ke(n[0],n[1],n[2]);this.boxHelper.material.color=s,this.tickMarksMesh.material.color=s}if(t&Pe.TRANSFORM&&(this.geometryTransformNode.position.copy(this.settings.translation),this.geometryTransformNode.rotation.copy(this.settings.rotation),this.updateVolumeDimensions(),this.setUniform("flipVolume",this.settings.flipAxes)),t&Pe.MATERIAL&&this.setUniform("DENSITY",this.settings.density),t&Pe.CAMERA&&(this.setUniform("BRIGHTNESS",this.settings.brightness*2),this.setUniform("GAMMA_MIN",this.settings.gammaMin),this.setUniform("GAMMA_MAX",this.settings.gammaMax),this.setUniform("GAMMA_SCALE",this.settings.gammaLevel)),t&Pe.ROI){const n=this.settings.bounds,{normRegionSize:s,normRegionOffset:r}=this.volume,a=s.clone().divideScalar(2).add(r).subScalar(.5),c=n.bmin.clone().sub(a).divide(s).clampScalar(-.5,.5),u=n.bmax.clone().sub(a).divide(s).clampScalar(-.5,.5);this.setUniform("AABB_CLIP_MIN",c),this.setUniform("AABB_CLIP_MAX",u)}t&Pe.SAMPLING&&(this.setUniform("interpolationEnabled",this.settings.useInterpolation),this.setUniform("iResolution",this.settings.resolution)),t&Pe.MASK_ALPHA&&this.setUniform("maskAlpha",this.settings.maskChannelIndex<0?1:this.settings.maskAlpha),t&Pe.MASK_DATA&&this.channelData.setChannelAsMask(this.settings.maskChannelIndex,this.volume.getChannel(this.settings.maskChannelIndex))}createGeometry(e){const t=new rs(1,1,1),n=new Lt(t);n.name="Volume";const s=qw,r=jw,a=new mn({uniforms:e,vertexShader:s,fragmentShader:r,transparent:!0,depthTest:!0,depthWrite:!1});return n.material=a,[t,n]}createTickMarks(){const{tickMarkPhysicalLength:t,physicalScale:n,normPhysicalSize:s}=this.volume,r=n/t,a=[],c=.025/s.y+.5,u=1/(s.x*r);for(let g=-.5;g<=.5;g+=u)a.push(g,.5,.5,g,c,.5,g,-.5,-.5,g,-c,-.5,g,.5,-.5,g,c,-.5,g,-.5,.5,g,-c,.5);const d=.025/s.x+.5,f=1/(s.y*r);for(let g=.5;g>=-.5;g-=f)a.push(-.5,g,.5,-d,g,.5,-.5,g,-.5,-d,g,-.5,.5,g,-.5,d,g,-.5,.5,g,.5,d,g,.5);const m=1/(s.z*r);for(let g=.5;g>=-.5;g-=m)a.push(-.5,.5,g,-d,.5,g,-.5,-.5,g,-d,-.5,g,.5,-.5,g,d,-.5,g,.5,.5,g,d,.5,g);const v=new Mn;return v.setAttribute("position",new Dt(new Float32Array(a),3)),new qc(v,new ha({color:Bd}))}cleanup(){this.geometry.dispose(),this.geometryMesh.material.dispose(),this.channelData.cleanup()}doRender(e,t,n){if(!this.geometryMesh.visible)return;const s=n??this.emptyPositionTex;this.setUniform("textureDepth",s),this.setUniform("usingPositionTexture",s.isDepthTexture?0:1),this.setUniform("CLIP_NEAR",t.near),this.setUniform("CLIP_FAR",t.far),this.channelData.gpuFuse(e),this.setUniform("textureAtlas",this.channelData.getFusedTexture()),this.geometryTransformNode.updateMatrixWorld(!0);const r=new _t;r.multiplyMatrices(t.matrixWorldInverse,this.geometryMesh.matrixWorld),r.invert(),this.setUniform("inverseModelViewMatrix",r),this.setUniform("inverseProjMatrix",t.projectionMatrixInverse)}get3dObject(){return this.geometryTransformNode}setUniform(e,t){this.uniforms[e]&&(this.uniforms[e].value=t)}updateActiveChannels(e,t){this.channelData.fuse(e,t),this.setUniform("textureAtlas",this.channelData.getFusedTexture()),this.setUniform("textureAtlasMask",this.channelData.maskTexture)}setRenderUpdateListener(e){}}const Kw=`precision highp float;
precision highp int;
precision highp sampler2D;

uniform float gInvExposure;
uniform int gDenoiseWindowRadius;
uniform float gDenoiseNoise;
uniform float gDenoiseInvWindowArea;
uniform float gDenoiseWeightThreshold;
uniform float gDenoiseLerpThreshold;
uniform float gDenoiseLerpC;
uniform vec2 gDenoisePixelSize;

uniform sampler2D tTexture0;
in vec2 vUv;

// Used to convert from XYZ to linear RGB space
const mat3 XYZ_2_RGB = (mat3(
 3.2404542, -1.5371385, -0.4985314,
 -0.9692660,  1.8760108,  0.0415560,
  0.0556434, -0.2040259,  1.0572252
));

vec3 XYZtoRGB(vec3 xyz) {
  return xyz * XYZ_2_RGB;
}

void main()
{
  vec4 pixelColor = texture(tTexture0, vUv);
  // TODO TONE MAP!!!!!!
  pixelColor.rgb = XYZtoRGB(pixelColor.rgb);

  pixelColor.rgb = 1.0-exp(-pixelColor.rgb*gInvExposure);
  pixelColor = clamp(pixelColor, 0.0, 1.0);

  /////////////////////
  /////////////////////
  /////////////////////
  /////////////////////
  //// DENOISING FILTER
  /////////////////////
  // see https://developer.download.nvidia.com/compute/cuda/1.1-Beta/x86_website/projects/imageDenoising/doc/imageDenoising.pdf
  /////////////////////
  vec4 clr00 = pixelColor;

  float fCount = 0.0;
  float SumWeights = 0.0;
  vec3 clr = vec3(0.0, 0.0, 0.0);

  vec2 uvsample = vUv;
  vec3 rgbsample;
  for (int i = -gDenoiseWindowRadius; i <= gDenoiseWindowRadius; i++) {
    for (int j = -gDenoiseWindowRadius; j <= gDenoiseWindowRadius; j++) {

      // boundary checking?
      vec3 clrIJ = texture(tTexture0, vUv + vec2(float(i)/gDenoisePixelSize.x, float(j)/gDenoisePixelSize.y)).rgb;
      //vec3 clrIJ = texelFetch(tTexture0, ivec2(gl_FragCoord.xy) + ivec2(i,j), 0).rgb;

      rgbsample = XYZtoRGB(clrIJ);
      // tone map!
      rgbsample = 1.0 - exp(-rgbsample * gInvExposure);
      rgbsample = clamp(rgbsample, 0.0, 1.0);

      clrIJ = rgbsample;

      float distanceIJ = (clr00.x-clrIJ.x)*(clr00.x-clrIJ.x) + (clr00.y-clrIJ.y)*(clr00.y-clrIJ.y) + (clr00.z-clrIJ.z)*(clr00.z-clrIJ.z);

      // gDenoiseNoise = 1/h^2
      //
      float weightIJ = exp(-(distanceIJ * gDenoiseNoise + float(i * i + j * j) * gDenoiseInvWindowArea));

      clr += (clrIJ * weightIJ);

      SumWeights += weightIJ;

      fCount += (weightIJ > gDenoiseWeightThreshold) ? gDenoiseInvWindowArea : 0.0;
    }
  }

  SumWeights = 1.0 / SumWeights;

  clr.rgb *= SumWeights;

  float LerpQ = (fCount > gDenoiseLerpThreshold) ? gDenoiseLerpC : 1.0f - gDenoiseLerpC;

  clr.rgb = mix(clr.rgb, clr00.rgb, LerpQ);
  clr.rgb = clamp(clr.rgb, 0.0, 1.0);

  pc_fragColor = vec4(clr.rgb, clr00.a);
}
`,Zw=Kw,Ll=3,zd=()=>({gInvExposure:{type:"f",value:1/(1-.75)},gDenoiseWindowRadius:{type:"i",value:Ll},gDenoiseNoise:{type:"f",value:.05},gDenoiseInvWindowArea:{type:"f",value:1/((2*Ll+1)*(2*Ll+1))},gDenoiseWeightThreshold:{type:"f",value:.1},gDenoiseLerpThreshold:{type:"f",value:0},gDenoiseLerpC:{type:"f",value:.01},gDenoisePixelSize:{type:"v2",value:new Ue(1,1)},tTexture0:{type:"t",value:null}}),Jw=`precision highp float;
precision highp int;
precision highp sampler2D;

uniform float gInvExposure;
uniform sampler2D tTexture0;
in vec2 vUv;

// Used to convert from XYZ to linear RGB space
const mat3 XYZ_2_RGB = (mat3(
  3.2404542, -1.5371385, -0.4985314,
 -0.9692660,  1.8760108,  0.0415560,
  0.0556434, -0.2040259,  1.0572252
));

vec3 XYZtoRGB(vec3 xyz) {
  return xyz * XYZ_2_RGB;
}

void main() {
  vec4 pixelColor = texture(tTexture0, vUv);

  pixelColor.rgb = XYZtoRGB(pixelColor.rgb);

  // pixelColor.rgb = pow(pixelColor.rgb, vec3(1.0/2.2));
  pixelColor.rgb = 1.0-exp(-pixelColor.rgb*gInvExposure);
  pixelColor = clamp(pixelColor, 0.0, 1.0);

  pc_fragColor = pixelColor; // sqrt(pixelColor);
  // out_FragColor = pow(pixelColor, vec4(1.0/2.2));
}
`,Qw=Jw,eS=()=>({gInvExposure:{type:"f",value:1/(1-.75)},tTexture0:{type:"t",value:null}}),da=0,pa=1;class er{constructor(e){this.mTheta=14*Math.PI/180,this.mPhi=54*Math.PI/180,this.mWidth=1,this.mHeight=1,this.mHalfWidth=.5*this.mWidth,this.mHalfHeight=.5*this.mHeight,this.mDistance=4,this.mSkyRadius=1e3,this.mP=new I,this.mTarget=new I,this.mArea=1,this.mAreaPdf=1/this.mArea,this.mColor=new I(75,75,75),this.mColorTop=new I(.3,.3,.3),this.mColorMiddle=new I(.3,.3,.3),this.mColorBottom=new I(.3,.3,.3),this.mT=e,this.mN=new I(0,0,1),this.mU=new I(1,0,0),this.mV=new I(0,1,0),this.update(new I(0,0,0))}update(e,t){this.mHalfWidth=.5*this.mWidth,this.mHalfHeight=.5*this.mHeight,this.mTarget.copy(e),this.mP.x=this.mDistance*Math.sin(this.mPhi)*Math.sin(this.mTheta),this.mP.z=this.mDistance*Math.sin(this.mPhi)*Math.cos(this.mTheta),this.mP.y=this.mDistance*Math.cos(this.mPhi),this.mP.add(this.mTarget),t&&(this.mP.applyMatrix4(t),this.mTarget.applyMatrix4(t)),this.mT===da?(this.mArea=this.mWidth*this.mHeight,this.mAreaPdf=1/this.mArea):this.mT===pa&&(this.mP.copy(e),this.mTarget.addVectors(this.mP,new I(0,0,1)),this.mSkyRadius=1e3*e.length()*2,this.mArea=4*Math.PI*Math.pow(this.mSkyRadius,2),this.mAreaPdf=1/this.mArea),this.mN.subVectors(this.mTarget,this.mP).normalize(),this.mN.y===1||this.mN.y===-1?this.mU.crossVectors(this.mN,new I(1,0,0)).normalize():this.mU.crossVectors(this.mN,new I(0,1,0)).normalize(),this.mV.crossVectors(this.mN,this.mU).normalize()}}const tS=`precision highp float;
precision highp int;
precision highp sampler2D;
precision highp sampler3D;

#define PI (3.1415926535897932384626433832795)
#define PI_OVER_2 (1.57079632679489661923)
#define PI_OVER_4 (0.785398163397448309616)
#define INV_PI (1.0/PI)
#define INV_2_PI (0.5/PI)
#define INV_4_PI (0.25/PI)

const vec3 BLACK = vec3(0,0,0);
const vec3 WHITE = vec3(1.0,1.0,1.0);
const int ShaderType_Brdf = 0;
const int ShaderType_Phase = 1;
const int ShaderType_Mixed = 2;
const float MAX_RAY_LEN = 1500000.0f;

in vec2 vUv;

struct Camera {
  vec3 mFrom;
  vec3 mU, mV, mN;
  vec4 mScreen;  // left, right, bottom, top
  vec2 mInvScreen;  // 1/w, 1/h
  float mFocalDistance;
  float mApertureSize;
  float mIsOrtho; // 1 or 0
};

uniform Camera gCamera;

struct Light {
  float   mTheta;
  float   mPhi;
  float   mWidth;
  float   mHalfWidth;
  float   mHeight;
  float   mHalfHeight;
  float   mDistance;
  float   mSkyRadius;
  vec3    mP;
  vec3    mTarget;
  vec3    mN;
  vec3    mU;
  vec3    mV;
  float   mArea;
  float   mAreaPdf;
  vec3    mColor;
  vec3    mColorTop;
  vec3    mColorMiddle;
  vec3    mColorBottom;
  int     mT;
};
const int NUM_LIGHTS = 2;
uniform Light gLights[2];

uniform vec3 gClippedAaBbMin;
uniform vec3 gClippedAaBbMax;
uniform vec3 gVolCenter;
uniform float gDensityScale;
uniform float gStepSize;
uniform float gStepSizeShadow;
uniform sampler3D volumeTexture;
uniform vec3 gInvAaBbMax;
uniform int gNChannels;
uniform int gShadingType;
uniform vec3 gGradientDeltaX;
uniform vec3 gGradientDeltaY;
uniform vec3 gGradientDeltaZ;
uniform float gInvGradientDelta;
uniform float gGradientFactor;
uniform float uShowLights;
uniform vec3 flipVolume;

// per channel
// the luttexture is a 256x4 rgba texture
// each row is a 256 element lookup table.
uniform sampler2D gLutTexture;
uniform vec4 gIntensityMax;
uniform vec4 gIntensityMin;
uniform float gOpacity[4];
uniform vec3 gEmissive[4];
uniform vec3 gDiffuse[4];
uniform vec3 gSpecular[4];
uniform float gGlossiness[4];

// compositing / progressive render
uniform float uFrameCounter;
uniform float uSampleCounter;
uniform vec2 uResolution;
uniform sampler2D tPreviousTexture;

// from iq https://www.shadertoy.com/view/4tXyWN
float rand( inout uvec2 seed )
{
  seed += uvec2(1);
  uvec2 q = 1103515245U * ( (seed >> 1U) ^ (seed.yx) );
  uint  n = 1103515245U * ( (q.x) ^ (q.y >> 3U) );
  return float(n) * (1.0 / float(0xffffffffU));
}

vec3 XYZtoRGB(vec3 xyz) {
  return vec3(
    3.240479f*xyz[0] - 1.537150f*xyz[1] - 0.498535f*xyz[2],
    -0.969256f*xyz[0] + 1.875991f*xyz[1] + 0.041556f*xyz[2],
    0.055648f*xyz[0] - 0.204043f*xyz[1] + 1.057311f*xyz[2]
  );
}

// Used to convert from linear RGB to XYZ space
const mat3 RGB_2_XYZ = (mat3(
  0.4124564, 0.3575761, 0.1804375,
  0.2126729, 0.7151522, 0.0721750,
  0.0193339, 0.1191920, 0.9503041
));
vec3 RGBtoXYZ(vec3 rgb) {
  return rgb * RGB_2_XYZ;
}

vec3 getUniformSphereSample(in vec2 U)
{
  float z = 1.f - 2.f * U.x;
  float r = sqrt(max(0.f, 1.f - z*z));
  float phi = 2.f * PI * U.y;
  float x = r * cos(phi);
  float y = r * sin(phi);
  return vec3(x, y, z);
}

float SphericalPhi(in vec3 Wl)
{
  float p = atan(Wl.z, Wl.x);
  return (p < 0.f) ? p + 2.f * PI : p;
}

float SphericalTheta(in vec3 Wl)
{
  return acos(clamp(Wl.y, -1.f, 1.f));
}

bool SameHemisphere(in vec3 Ww1, in vec3 Ww2)
{
   return (Ww1.z * Ww2.z) > 0.0f;
}

vec2 getConcentricDiskSample(in vec2 U)
{
  float r, theta;
  // Map 0..1 to -1..1
  float sx = 2.0 * U.x - 1.0;
  float sy = 2.0 * U.y - 1.0;

  // Map square to (r,theta)

  // Handle degeneracy at the origin
  if (sx == 0.0 && sy == 0.0)
  {
    return vec2(0.0f, 0.0f);
  }

  // quadrants of disk
  if (sx >= -sy)
  {
    if (sx > sy)
    {
      r = sx;
      if (sy > 0.0)
        theta = sy/r;
      else
        theta = 8.0f + sy/r;
    }
    else
    {
      r = sy;
      theta = 2.0f - sx/r;
    }
  }
  else
  {
    if (sx <= sy)
    {
      r = -sx;
      theta = 4.0f - sy/r;
    }
    else
    {
      r = -sy;
      theta = 6.0f + sx/r;
    }
  }

  theta *= PI_OVER_4;

  return vec2(r*cos(theta), r*sin(theta));
}

vec3 getCosineWeightedHemisphereSample(in vec2 U)
{
  vec2 ret = getConcentricDiskSample(U);
  return vec3(ret.x, ret.y, sqrt(max(0.f, 1.f - ret.x * ret.x - ret.y * ret.y)));
}

struct Ray {
  vec3 m_O;
  vec3 m_D;
  float m_MinT, m_MaxT;
};

vec3 rayAt(Ray r, float t) {
  return r.m_O + t*r.m_D;
}

Ray GenerateCameraRay(in Camera cam, in vec2 Pixel, in vec2 ApertureRnd)
{
  // negating ScreenPoint.y flips the up/down direction. depends on whether you want pixel 0 at top or bottom
  // we could also have flipped mScreen and mInvScreen, or cam.mV?
  vec2 ScreenPoint = vec2(
    cam.mScreen.x + (cam.mInvScreen.x * Pixel.x),
    cam.mScreen.z + (cam.mInvScreen.y * Pixel.y)
  );
  vec3 dxy = (ScreenPoint.x * cam.mU) + (-ScreenPoint.y * cam.mV);

  // orthographic camera ray: start at (camera pos + screen point), go in direction N
  // perspective camera ray: start at camera pos, go in direction (N + screen point)
  vec3 RayO = cam.mFrom + cam.mIsOrtho * dxy;
  vec3 RayD = normalize(cam.mN + (1.0 - cam.mIsOrtho) * dxy);

  if (cam.mApertureSize != 0.0f)
  {
    vec2 LensUV = cam.mApertureSize * getConcentricDiskSample(ApertureRnd);

    vec3 LI = cam.mU * LensUV.x + cam.mV * LensUV.y;
    RayO += LI;
    RayD = normalize((RayD * cam.mFocalDistance) - LI);
  }

  return Ray(RayO, RayD, 0.0, MAX_RAY_LEN);
}

bool IntersectBox(in Ray R, out float pNearT, out float pFarT)
{
  vec3 invR		= vec3(1.0f, 1.0f, 1.0f) / R.m_D;
  vec3 bottomT		= invR * (vec3(gClippedAaBbMin.x, gClippedAaBbMin.y, gClippedAaBbMin.z) - R.m_O);
  vec3 topT		= invR * (vec3(gClippedAaBbMax.x, gClippedAaBbMax.y, gClippedAaBbMax.z) - R.m_O);
  vec3 minT		= min(topT, bottomT);
  vec3 maxT		= max(topT, bottomT);
  float largestMinT = max(max(minT.x, minT.y), max(minT.x, minT.z));
  float smallestMaxT = min(min(maxT.x, maxT.y), min(maxT.x, maxT.z));

  pNearT = largestMinT;
  pFarT	= smallestMaxT;

  return smallestMaxT > largestMinT;
}

// assume volume is centered at 0,0,0 so p spans -bounds to + bounds
// transform p to range from 0,0,0 to 1,1,1 for volume texture sampling.
// optionally invert axes
vec3 PtoVolumeTex(vec3 p) {
  vec3 uvw = (p - gVolCenter) * gInvAaBbMax + vec3(0.5, 0.5, 0.5);
  // if flipVolume = 1, uvw is unchanged.
  // if flipVolume = -1, uvw = 1 - uvw
  uvw = (flipVolume*(uvw - 0.5) + 0.5);
  return uvw;
}

const float UINT8_MAX = 1.0;//255.0;

// strategy: sample up to 4 channels, and take the post-LUT maximum intensity as the channel that wins
// we will return the unmapped raw intensity value from the volume so that other luts can be applied again later.
float GetNormalizedIntensityMax4ch(in vec3 P, out int ch)
{
  vec4 intensity = UINT8_MAX * texture(volumeTexture, PtoVolumeTex(P));

  //intensity = (intensity - gIntensityMin) / (gIntensityMax - gIntensityMin);
  vec4 ilut = vec4(0.0, 0.0, 0.0, 0.0);
  // w in the lut texture is "opacity"
  ilut.x = texture(gLutTexture, vec2(intensity.x, 0.5/4.0)).w / 255.0;
  ilut.y = texture(gLutTexture, vec2(intensity.y, 1.5/4.0)).w / 255.0;
  ilut.z = texture(gLutTexture, vec2(intensity.z, 2.5/4.0)).w / 255.0;
  ilut.w = texture(gLutTexture, vec2(intensity.w, 3.5/4.0)).w / 255.0;

  float maxIn = 0.0;
  float iOut = 0.0;
  ch = 0;
  for (int i = 0; i < min(gNChannels, 4); ++i) {
    if (ilut[i] > maxIn) {
      maxIn = ilut[i];
      ch = i;
      iOut = intensity[i];
    }
  }

  //return maxIn;
  return iOut;
}

float GetNormalizedIntensity4ch(vec3 P, int ch)
{
  vec4 intensity = UINT8_MAX * texture(volumeTexture, PtoVolumeTex(P));
  // select channel
  float intensityf = intensity[ch];
  //intensityf = (intensityf - gIntensityMin[ch]) / (gIntensityMax[ch] - gIntensityMin[ch]);
  //intensityf = texture(gLutTexture, vec2(intensityf, (0.5+float(ch))/4.0)).x;

  return intensityf;
}

// note that gInvGradientDelta is maxpixeldim of volume
// gGradientDeltaX,Y,Z is 1/X,Y,Z of volume
vec3 Gradient4ch(vec3 P, int ch)
{
  vec3 Gradient;

  Gradient.x = (GetNormalizedIntensity4ch(P + (gGradientDeltaX), ch) - GetNormalizedIntensity4ch(P - (gGradientDeltaX), ch)) * gInvGradientDelta;
  Gradient.y = (GetNormalizedIntensity4ch(P + (gGradientDeltaY), ch) - GetNormalizedIntensity4ch(P - (gGradientDeltaY), ch)) * gInvGradientDelta;
  Gradient.z = (GetNormalizedIntensity4ch(P + (gGradientDeltaZ), ch) - GetNormalizedIntensity4ch(P - (gGradientDeltaZ), ch)) * gInvGradientDelta;

  return Gradient;
}

float GetOpacity(float NormalizedIntensity, int ch)
{
  // apply lut
  float o = texture(gLutTexture, vec2(NormalizedIntensity, (0.5+float(ch))/4.0)).w / 255.0;
  float Intensity = o * gOpacity[ch];
  return Intensity;
}

vec3 GetEmissionN(float NormalizedIntensity, int ch)
{
  return gEmissive[ch];
}

vec3 GetDiffuseN(float NormalizedIntensity, int ch)
{
  vec4 col = texture(gLutTexture, vec2(NormalizedIntensity, (0.5+float(ch))/4.0));
  //vec3 col = vec3(1.0, 1.0, 1.0);
  return col.xyz * gDiffuse[ch];
}

vec3 GetSpecularN(float NormalizedIntensity, int ch)
{
  return gSpecular[ch];
}

float GetGlossinessN(float NormalizedIntensity, int ch)
{
  return gGlossiness[ch];
}

// a bsdf sample, a sample on a light source, and a randomly chosen light index
struct LightingSample {
  float m_bsdfComponent;
  vec2  m_bsdfDir;
  vec2  m_lightPos;
  float m_lightComponent;
  float m_LightNum;
};

LightingSample LightingSample_LargeStep(inout uvec2 seed) {
  return LightingSample(
    rand(seed),
    vec2(rand(seed), rand(seed)),
    vec2(rand(seed), rand(seed)),
    rand(seed),
    rand(seed)
    );
}

// return a color xyz
vec3 Light_Le(in Light light, in vec2 UV)
{
  if (light.mT == 0)
    return RGBtoXYZ(light.mColor) / light.mArea;

  if (light.mT == 1)
  {
    if (UV.y > 0.0f)
      return RGBtoXYZ(mix(light.mColorMiddle, light.mColorTop, abs(UV.y)));
    else
      return RGBtoXYZ(mix(light.mColorMiddle, light.mColorBottom, abs(UV.y)));
  }

  return BLACK;
}

// return a color xyz
vec3 Light_SampleL(in Light light, in vec3 P, out Ray Rl, out float Pdf, in LightingSample LS)
{
  vec3 L = BLACK;
  Pdf = 0.0;
  vec3 Ro = vec3(0,0,0), Rd = vec3(0,0,1);
  if (light.mT == 0)
  {
    Ro = (light.mP + ((-0.5f + LS.m_lightPos.x) * light.mWidth * light.mU) + ((-0.5f + LS.m_lightPos.y) * light.mHeight * light.mV));
    Rd = normalize(P - Ro);
    L = dot(Rd, light.mN) > 0.0f ? Light_Le(light, vec2(0.0f)) : BLACK;
    Pdf = abs(dot(Rd, light.mN)) > 0.0f ? dot(P-Ro, P-Ro) / (abs(dot(Rd, light.mN)) * light.mArea) : 0.0f;
  }
  else if (light.mT == 1)
  {
    Ro = light.mP + light.mSkyRadius * getUniformSphereSample(LS.m_lightPos);
    Rd = normalize(P - Ro);
    L = Light_Le(light, vec2(1.0f) - 2.0f * LS.m_lightPos);
    Pdf = pow(light.mSkyRadius, 2.0f) / light.mArea;
  }

  Rl = Ray(Ro, Rd, 0.0f, length(P - Ro));

  return L;
}

// Intersect ray with light
bool Light_Intersect(Light light, inout Ray R, out float T, out vec3 L, out float pPdf)
{
  if (light.mT == 0)
  {
    // Compute projection
    float DotN = dot(R.m_D, light.mN);

    // Ray is coplanar with light surface
    if (DotN >= 0.0f)
      return false;

    // Compute hit distance
    T = (-light.mDistance - dot(R.m_O, light.mN)) / DotN;

    // Intersection is in ray's negative direction
    if (T < R.m_MinT || T > R.m_MaxT)
      return false;

    // Determine position on light
    vec3 Pl = rayAt(R, T);

    // Vector from point on area light to center of area light
    vec3 Wl = Pl - light.mP;

    // Compute texture coordinates
    vec2 UV = vec2(dot(Wl, light.mU), dot(Wl, light.mV));

    // Check if within bounds of light surface
    if (UV.x > light.mHalfWidth || UV.x < -light.mHalfWidth || UV.y > light.mHalfHeight || UV.y < -light.mHalfHeight)
      return false;

    R.m_MaxT = T;

    //pUV = UV;

    if (DotN < 0.0f)
      L = RGBtoXYZ(light.mColor) / light.mArea;
    else
      L = BLACK;

    pPdf = dot(R.m_O-Pl, R.m_O-Pl) / (DotN * light.mArea);

    return true;
  }

  else if (light.mT == 1)
  {
    T = light.mSkyRadius;

    // Intersection is in ray's negative direction
    if (T < R.m_MinT || T > R.m_MaxT)
      return false;

    R.m_MaxT = T;

    vec2 UV = vec2(SphericalPhi(R.m_D) * INV_2_PI, SphericalTheta(R.m_D) * INV_PI);

    L = Light_Le(light, vec2(1.0f,1.0f) - 2.0f * UV);

    pPdf = pow(light.mSkyRadius, 2.0f) / light.mArea;
    //pUV = UV;

    return true;
  }

  return false;
}

float Light_Pdf(in Light light, in vec3 P, in vec3 Wi)
{
  vec3 L;
  vec2 UV;
  float Pdf = 1.0f;

  Ray Rl = Ray(P, Wi, 0.0f, 100000.0f);

  if (light.mT == 0)
  {
    float T = 0.0f;

    if (!Light_Intersect(light, Rl, T, L, Pdf))
      return 0.0f;

    return pow(T, 2.0f) / (abs(dot(light.mN, -Wi)) * light.mArea);
  }

  else if (light.mT == 1)
  {
    return pow(light.mSkyRadius, 2.0f) / light.mArea;
  }

  return 0.0f;
}

struct VolumeShader {
  int m_Type; // 0 = bsdf, 1 = phase

  vec3 m_Kd; // isotropic phase // xyz color
  vec3 m_R; // specular reflectance
  float m_Ior;
  float m_Exponent;
  vec3 m_Nn;
  vec3 m_Nu;
  vec3 m_Nv;
};

// return a xyz color
vec3 ShaderPhase_F(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  return shader.m_Kd * INV_PI;
}

float ShaderPhase_Pdf(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  return INV_4_PI;
}

vec3 ShaderPhase_SampleF(in VolumeShader shader, in vec3 Wo, out vec3 Wi, out float Pdf, in vec2 U)
{
  Wi	= getUniformSphereSample(U);
  Pdf	= ShaderPhase_Pdf(shader, Wo, Wi);

  return ShaderPhase_F(shader, Wo, Wi);
}

// return a xyz color
vec3 Lambertian_F(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  return shader.m_Kd * INV_PI;
}

float Lambertian_Pdf(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  //return abs(Wi.z)*INV_PI;
  return SameHemisphere(Wo, Wi) ? abs(Wi.z) * INV_PI : 0.0f;
}

// return a xyz color
vec3 Lambertian_SampleF(in VolumeShader shader, in vec3 Wo, out vec3 Wi, out float Pdf, in vec2 U)
{
  Wi = getCosineWeightedHemisphereSample(U);

  if (Wo.z < 0.0f)
    Wi.z *= -1.0f;

  Pdf = Lambertian_Pdf(shader, Wo, Wi);

  return Lambertian_F(shader, Wo, Wi);
}

vec3 SphericalDirection(in float SinTheta, in float CosTheta, in float Phi)
{
  return vec3(SinTheta * cos(Phi), SinTheta * sin(Phi), CosTheta);
}

void Blinn_SampleF(in VolumeShader shader, in vec3 Wo, out vec3 Wi, out float Pdf, in vec2 U)
{
  // Compute sampled half-angle vector wh for Blinn distribution
  float costheta = pow(U.x, 1.f / (shader.m_Exponent+1.0));
  float sintheta = sqrt(max(0.f, 1.f - costheta*costheta));
  float phi = U.y * 2.f * PI;

  vec3 wh = SphericalDirection(sintheta, costheta, phi);

  if (!SameHemisphere(Wo, wh))
    wh = -wh;

  // Compute incident direction by reflecting about wh
  Wi = -Wo + 2.f * dot(Wo, wh) * wh;

  // Compute PDF for wi from Blinn distribution
  float blinn_pdf = ((shader.m_Exponent + 1.f) * pow(costheta, shader.m_Exponent)) / (2.f * PI * 4.f * dot(Wo, wh));

  if (dot(Wo, wh) <= 0.f)
    blinn_pdf = 0.f;

  Pdf = blinn_pdf;
}

float Blinn_D(in VolumeShader shader, in vec3 wh)
{
  float costhetah = abs(wh.z);//AbsCosTheta(wh);
  return (shader.m_Exponent+2.0) * INV_2_PI * pow(costhetah, shader.m_Exponent);
}
float Microfacet_G(in VolumeShader shader, in vec3 wo, in vec3 wi, in vec3 wh)
{
  float NdotWh = abs(wh.z);//AbsCosTheta(wh);
  float NdotWo = abs(wo.z);//AbsCosTheta(wo);
  float NdotWi = abs(wi.z);//AbsCosTheta(wi);
  float WOdotWh = abs(dot(wo, wh));

  return min(1.f, min((2.f * NdotWh * NdotWo / WOdotWh), (2.f * NdotWh * NdotWi / WOdotWh)));
}

vec3 Microfacet_F(in VolumeShader shader, in vec3 wo, in vec3 wi)
{
  float cosThetaO = abs(wo.z);//AbsCosTheta(wo);
  float cosThetaI = abs(wi.z);//AbsCosTheta(wi);

  if (cosThetaI == 0.f || cosThetaO == 0.f)
    return BLACK;

  vec3 wh = wi + wo;

  if (wh.x == 0. && wh.y == 0. && wh.z == 0.)
    return BLACK;

  wh = normalize(wh);
  float cosThetaH = dot(wi, wh);

  vec3 F = WHITE;//m_Fresnel.Evaluate(cosThetaH);

  return shader.m_R * Blinn_D(shader, wh) * Microfacet_G(shader, wo, wi, wh) * F / (4.f * cosThetaI * cosThetaO);
}

vec3 ShaderBsdf_WorldToLocal(in VolumeShader shader, in vec3 W)
{
  return vec3(dot(W, shader.m_Nu), dot(W, shader.m_Nv), dot(W, shader.m_Nn));
}

vec3 ShaderBsdf_LocalToWorld(in VolumeShader shader, in vec3 W)
{
  return vec3(	shader.m_Nu.x * W.x + shader.m_Nv.x * W.y + shader.m_Nn.x * W.z,
    shader.m_Nu.y * W.x + shader.m_Nv.y * W.y + shader.m_Nn.y * W.z,
    shader.m_Nu.z * W.x + shader.m_Nv.z * W.y + shader.m_Nn.z * W.z);
}

float Blinn_Pdf(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  vec3 wh = normalize(Wo + Wi);

  float costheta = abs(wh.z);//AbsCosTheta(wh);
  // Compute PDF for wi from Blinn distribution
  float blinn_pdf = ((shader.m_Exponent + 1.f) * pow(costheta, shader.m_Exponent)) / (2.f * PI * 4.f * dot(Wo, wh));

  if (dot(Wo, wh) <= 0.0f)
    blinn_pdf = 0.0f;

  return blinn_pdf;
}

vec3 Microfacet_SampleF(in VolumeShader shader, in vec3 wo, out vec3 wi, out float Pdf, in vec2 U)
{
  Blinn_SampleF(shader, wo, wi, Pdf, U);

  if (!SameHemisphere(wo, wi))
    return BLACK;

  return Microfacet_F(shader, wo, wi);
}

float Microfacet_Pdf(in VolumeShader shader, in vec3 wo, in vec3 wi)
{
  if (!SameHemisphere(wo, wi))
    return 0.0f;

  return Blinn_Pdf(shader, wo, wi);
}

// return a xyz color
vec3 ShaderBsdf_F(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  vec3 Wol = ShaderBsdf_WorldToLocal(shader, Wo);
  vec3 Wil = ShaderBsdf_WorldToLocal(shader, Wi);

  vec3 R = vec3(0,0,0);

  R += Lambertian_F(shader, Wol, Wil);
  R += Microfacet_F(shader, Wol, Wil);

  return R;
}

float ShaderBsdf_Pdf(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  vec3 Wol = ShaderBsdf_WorldToLocal(shader, Wo);
  vec3 Wil = ShaderBsdf_WorldToLocal(shader, Wi);

  float Pdf = 0.0f;

  Pdf += Lambertian_Pdf(shader, Wol, Wil);
  Pdf += Microfacet_Pdf(shader, Wol, Wil);

  return Pdf;
}


vec3 ShaderBsdf_SampleF(in VolumeShader shader, in LightingSample S, in vec3 Wo, out vec3 Wi, out float Pdf, in vec2 U)
{
  vec3 Wol = ShaderBsdf_WorldToLocal(shader, Wo);
  vec3 Wil = vec3(0,0,0);

  vec3 R = vec3(0,0,0);

  if (S.m_bsdfComponent <= 0.5f)
  {
    Lambertian_SampleF(shader, Wol, Wil, Pdf, S.m_bsdfDir);
  }
  else
  {
    Microfacet_SampleF(shader, Wol, Wil, Pdf, S.m_bsdfDir);
  }

  Pdf += Lambertian_Pdf(shader, Wol, Wil);
  Pdf += Microfacet_Pdf(shader, Wol, Wil);

  R += Lambertian_F(shader, Wol, Wil);
  R += Microfacet_F(shader, Wol, Wil);

  Wi = ShaderBsdf_LocalToWorld(shader, Wil);

  //return vec3(1,1,1);
  return R;
}

// return a xyz color
vec3 Shader_F(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  if (shader.m_Type == 0) {
    return ShaderBsdf_F(shader, Wo, Wi);
  }
  else {
    return ShaderPhase_F(shader, Wo, Wi);
  }
}

float Shader_Pdf(in VolumeShader shader, in vec3 Wo, in vec3 Wi)
{
  if (shader.m_Type == 0) {
    return ShaderBsdf_Pdf(shader, Wo, Wi);
  }
  else {
    return ShaderPhase_Pdf(shader, Wo, Wi);
  }
}

vec3 Shader_SampleF(in VolumeShader shader, in LightingSample S, in vec3 Wo, out vec3 Wi, out float Pdf, in vec2 U)
{
  //return vec3(1,0,0);
  if (shader.m_Type == 0) {
    return ShaderBsdf_SampleF(shader, S, Wo, Wi, Pdf, U);
  }
  else {
    return ShaderPhase_SampleF(shader, Wo, Wi, Pdf, U);
  }
}


bool IsBlack(in vec3 v) {
  return (v.x==0.0 && v.y == 0.0 && v.z == 0.0);
}

float PowerHeuristic(float nf, float fPdf, float ng, float gPdf)
{
  float f = nf * fPdf;
  float g = ng * gPdf;
  // The power heuristic is Veach's MIS balance heuristic except each component is being squared
  // balance heuristic would be f/(f+g) ...?
  return (f * f) / (f * f + g * g);
}

float MISContribution(float pdf1, float pdf2)
{
  return PowerHeuristic(1.0f, pdf1, 1.0f, pdf2);
}

// "shadow ray" using gStepSizeShadow, test whether it can exit the volume or not
bool DoesSecondaryRayScatterInVolume(inout Ray R, inout uvec2 seed)
{
  float MinT;
  float MaxT;
  vec3 Ps;

  if (!IntersectBox(R, MinT, MaxT))
    return false;

  MinT = max(MinT, R.m_MinT);
  MaxT = min(MaxT, R.m_MaxT);

  // delta (Woodcock) tracking
  float S	= -log(rand(seed)) / gDensityScale;
  float Sum = 0.0f;
  float SigmaT = 0.0f;

  MinT += rand(seed) * gStepSizeShadow;
  int ch = 0;
  float intensity = 0.0;
  while (Sum < S)
  {
    Ps = rayAt(R, MinT);  // R.m_O + MinT * R.m_D;

    if (MinT > MaxT)
      return false;

    intensity = GetNormalizedIntensityMax4ch(Ps, ch);
    SigmaT = gDensityScale * GetOpacity(intensity, ch);

    Sum += SigmaT * gStepSizeShadow;
    MinT += gStepSizeShadow;
  }

  return true;
}

int GetNearestLight(Ray R, out vec3 oLightColor, out vec3 Pl, out float oPdf)
{
  int hit = -1;
  float T = 0.0f;
  Ray rayCopy = R;
  float pdf = 0.0f;

  for (int i = 0; i < 2; i++)
  {
    if (Light_Intersect(gLights[i], rayCopy, T, oLightColor, pdf))
    {
      Pl = rayAt(R, T);
      hit = i;
    }
  }
  oPdf = pdf;

  return hit;
}

// return a XYZ color
// Wo is direction from scatter point out toward incident ray direction

// Wi goes toward light sample and is not necessarily perfect reflection of Wo
// ^Wi   ^N    ^Wo
//  \\\\    |    //
//   \\\\   |   //
//    \\\\  |  //
//     \\\\ | //
//      \\\\|// Pe = volume sample where scattering occurs
//   ---------
vec3 EstimateDirectLight(int shaderType, float Density, int ch, in Light light, in LightingSample LS, in vec3 Wo, in vec3 Pe, in vec3 N, inout uvec2 seed)
{
  vec3 Ld = BLACK, Li = BLACK, F = BLACK;

  vec3 diffuse = GetDiffuseN(Density, ch);
  vec3 specular = GetSpecularN(Density, ch);
  float glossiness = GetGlossinessN(Density, ch);

  // can N and Wo be coincident????
  vec3 nu = normalize(cross(N, Wo));
  vec3 nv = normalize(cross(N, nu));

  // the IoR here is hard coded... and unused!!!!
  VolumeShader Shader = VolumeShader(shaderType, RGBtoXYZ(diffuse), RGBtoXYZ(specular), 2.5f, glossiness, N, nu, nv);

  float LightPdf = 1.0f, ShaderPdf = 1.0f;

  Ray Rl = Ray(vec3(0,0,0), vec3(0,0,1.0), 0.0, MAX_RAY_LEN);
  // Rl is ray from light toward Pe in volume, with a max traversal of the distance from Pe to Light sample pos.
  Li = Light_SampleL(light, Pe, Rl, LightPdf, LS);

  // Wi: negate ray direction: from volume scatter point toward light...?
  vec3 Wi = -Rl.m_D, P = vec3(0,0,0);

  // we will calculate two lighting contributions and combine them by MIS.

  F = Shader_F(Shader,Wo, Wi);

  ShaderPdf = Shader_Pdf(Shader, Wo, Wi);

  // get a lighting contribution along Rl;  see if Rl would scatter in the volume or not
  if (!IsBlack(Li) && (ShaderPdf > 0.0f) && (LightPdf > 0.0f) && !DoesSecondaryRayScatterInVolume(Rl, seed))
  {
    // ray from light can see through volume to Pe!

    float dotProd = 1.0;
    if (shaderType == ShaderType_Brdf){

      // (use abs or clamp here?)
      dotProd = abs(dot(Wi, N));
    }
    Ld += F * Li * dotProd * MISContribution(LightPdf, ShaderPdf) / LightPdf;

  }

  // get a lighting contribution by sampling nearest light from the scattering point
  F = Shader_SampleF(Shader, LS, Wo, Wi, ShaderPdf, LS.m_bsdfDir);
  if (!IsBlack(F) && (ShaderPdf > 0.0f))
  {
    vec3 Pl = vec3(0,0,0);
    int n = GetNearestLight(Ray(Pe, Wi, 0.0f, 1000000.0f), Li, Pl, LightPdf);
    if (n > -1)
    {
      Light pLight = gLights[n];
      LightPdf = Light_Pdf(pLight, Pe, Wi);

      if ((LightPdf > 0.0f) && !IsBlack(Li)) {
        Ray rr = Ray(Pl, normalize(Pe - Pl), 0.0f, length(Pe - Pl));
        if (!DoesSecondaryRayScatterInVolume(rr, seed))
        {
          float dotProd = 1.0;
          if (shaderType == ShaderType_Brdf){

            // (use abs or clamp here?)
            dotProd = abs(dot(Wi, N));
          }
          // note order of MIS params is swapped
          Ld += F * Li * dotProd * MISContribution(ShaderPdf, LightPdf) / ShaderPdf;
        }

      }
    }
  }

  return Ld;

}

// return a linear xyz color
vec3 UniformSampleOneLight(int shaderType, float Density, int ch, in vec3 Wo, in vec3 Pe, in vec3 N, inout uvec2 seed)
{
  //if (NUM_LIGHTS == 0)
  //  return BLACK;

  // select a random light, a random 2d sample on light, and a random 2d sample on brdf
  LightingSample LS = LightingSample_LargeStep(seed);

  int WhichLight = int(floor(LS.m_LightNum * float(NUM_LIGHTS)));

  Light light = gLights[WhichLight];

  return float(NUM_LIGHTS) * EstimateDirectLight(shaderType, Density, ch, light, LS, Wo, Pe, N, seed);

}

bool SampleScatteringEvent(inout Ray R, inout uvec2 seed, out vec3 Ps)
{
  float MinT;
  float MaxT;

  if (!IntersectBox(R, MinT, MaxT))
    return false;

  MinT = max(MinT, R.m_MinT);
  MaxT = min(MaxT, R.m_MaxT);

  // delta (Woodcock) tracking

  // notes, not necessarily coherent:
  // ray march along the ray's projected path and keep an average sigmaT value.
  // The distance is weighted by the intensity at each ray step sample. High intensity increases the apparent distance.
  // When the distance has become greater than the average sigmaT value given by -log(RandomFloat[0, 1]) / averageSigmaT
  // then that would be considered the interaction position.

  // sigmaT = sigmaA + sigmaS = absorption coeff + scattering coeff = extinction coeff

  // Beer-Lambert law: transmittance T(t) = exp(-sigmaT*t)  where t is a distance!

  // importance sampling the exponential function to produce a free path distance S
  // the PDF is p(t) = sigmaT * exp(-sigmaT * t)
  // In a homogeneous volume,
  // S is the free-path distance = -ln(1-zeta)/sigmaT where zeta is a random variable
  // density scale = 0   => S --> 0..inf.  Low density means randomly sized ray paths
  // density scale = inf => S --> 0.       High density means short ray paths!

  // note that ln(x:0..1) is negative

  // here gDensityScale represents sigmaMax, a majorant of sigmaT
  // it is a parameter that should be set as close to the max extinction coefficient as possible.
  float S	= -log(rand(seed)) / gDensityScale;

  float Sum		= 0.0f;
  float SigmaT	= 0.0f; // accumulated extinction along ray march

  // start: take one step now.
  MinT += rand(seed) * gStepSize;

  int ch = 0;
  float intensity = 0.0;

  // ray march until we have traveled S (or hit the maxT of the ray)
  while (Sum < S)
  {
    Ps = rayAt(R, MinT);  // R.m_O + MinT * R.m_D;

    // if we exit the volume with no scattering
    if (MinT > MaxT)
      return false;

    intensity = GetNormalizedIntensityMax4ch(Ps, ch);
    SigmaT = gDensityScale * GetOpacity(intensity, ch);

    Sum += SigmaT * gStepSize;
    MinT += gStepSize;
  }

  // at this time, MinT - original MinT is the T transmission distance before a scatter event.
  // Ps is the point

  return true;
}


vec4 CalculateRadiance(inout uvec2 seed) {
  float r = rand(seed);
  //return vec4(r,0,0,1);

  vec3 Lv = BLACK, Li = BLACK;

  //Ray Re = Ray(vec3(0,0,0), vec3(0,0,1), 0.0, MAX_RAY_LEN);

  vec2 UV = vUv*uResolution + vec2(rand(seed), rand(seed));

  Ray Re = GenerateCameraRay(gCamera, UV, vec2(rand(seed), rand(seed)));

  //return vec4(vUv, 0.0, 1.0);
  //return vec4(0.5*(Re.m_D + 1.0), 1.0);
  //return vec4(Re.m_D, 1.0);

  //Re.m_MinT = 0.0f;
  //Re.m_MaxT = MAX_RAY_LEN;

  vec3 Pe = vec3(0,0,0), Pl = vec3(0,0,0);
  float lpdf = 0.0;

  float alpha = 0.0;
  // find point Pe along ray Re
  if (SampleScatteringEvent(Re, seed, Pe))
  {
    alpha = 1.0;
    // is there a light between Re.m_O and Pe? (ray's maxT is distance to Pe)
    // (test to see if area light was hit before volume.)
    int i = GetNearestLight(Ray(Re.m_O, Re.m_D, 0.0f, length(Pe - Re.m_O)), Li, Pl, lpdf);
    if (i > -1)
    {
      // set sample pixel value in frame estimate (prior to accumulation)
      return vec4(Li, 1.0);
    }

    int ch = 0;
    float D = GetNormalizedIntensityMax4ch(Pe, ch);

    // emission from volume
    Lv += RGBtoXYZ(GetEmissionN(D, ch));

    vec3 gradient = Gradient4ch(Pe, ch);
    // send ray out from Pe toward light
    switch (gShadingType)
    {
      case ShaderType_Brdf:
      {
        Lv += UniformSampleOneLight(ShaderType_Brdf, D, ch, normalize(-Re.m_D), Pe, normalize(gradient), seed);
        break;
      }

      case ShaderType_Phase:
      {
        Lv += 0.5f * UniformSampleOneLight(ShaderType_Phase, D, ch, normalize(-Re.m_D), Pe, normalize(gradient), seed);
        break;
      }

      case ShaderType_Mixed:
      {
        //const float GradMag = GradientMagnitude(Pe, volumedata.gradientVolumeTexture[ch]) * (1.0/volumedata.intensityMax[ch]);
        float GradMag = length(gradient);
        float PdfBrdf = (1.0f - exp(-gGradientFactor * GradMag));

        vec3 cls; // xyz color
        if (rand(seed) < PdfBrdf) {
          cls = UniformSampleOneLight(ShaderType_Brdf, D, ch, normalize(-Re.m_D), Pe, normalize(gradient), seed);
        }
        else {
          cls = 0.5f * UniformSampleOneLight(ShaderType_Phase, D, ch, normalize(-Re.m_D), Pe, normalize(gradient), seed);
        }

        Lv += cls;

        break;
      }
    }
  }
  else
  {
    // background color:
    // set Lv to a selected color based on environment light source?
    // if (uShowLights > 0.0) {
    //   int n = GetNearestLight(Ray(Re.m_O, Re.m_D, 0.0f, 1000000.0f), Li, Pl, lpdf);
    //   if (n > -1)
    //     Lv = Li;
    // }
    //Lv = vec3(r,0,0);
  }

  // set sample pixel value in frame estimate (prior to accumulation)

  return vec4(Lv, alpha);
}

vec4 CumulativeMovingAverage(vec4 A, vec4 Ax, float N)
{
   return A + ((Ax - A) / max((N), 1.0f));
}

void main()
{
  // seed for rand(seed) function
  uvec2 seed = uvec2(uFrameCounter, uFrameCounter + 1.0) * uvec2(gl_FragCoord);

  // perform path tracing and get resulting pixel color
  vec4 pixelColor = CalculateRadiance( seed );

  vec4 previousColor = texture(tPreviousTexture, vUv);
  if (uSampleCounter < 1.0) {
    previousColor = vec4(0,0,0,0);
  }

  pc_fragColor = CumulativeMovingAverage(previousColor, pixelColor, uSampleCounter);
}
`,nS=tS,iS=0,sS=()=>({tPreviousTexture:{type:"t",value:new Tt},uSampleCounter:{type:"f",value:0},uFrameCounter:{type:"f",value:1},uResolution:{type:"v2",value:new Ue},gClippedAaBbMin:{type:"v3",value:new I(0,0,0)},gClippedAaBbMax:{type:"v3",value:new I(1,1,1)},gVolCenter:{type:"v3",value:new I(0,0,0)},gDensityScale:{type:"f",value:50},gStepSize:{type:"f",value:1},gStepSizeShadow:{type:"f",value:1},gInvAaBbMax:{type:"v3",value:new I},gNChannels:{type:"i",value:0},gShadingType:{type:"i",value:iS},gGradientDeltaX:{type:"v3",value:new I(.01,0,0)},gGradientDeltaY:{type:"v3",value:new I(0,.01,0)},gGradientDeltaZ:{type:"v3",value:new I(0,0,.01)},gInvGradientDelta:{type:"f",value:0},gGradientFactor:{type:"f",value:.25},gCamera:{value:{mFrom:new I,mU:new I,mV:new I,mN:new I,mScreen:new Mt,mInvScreen:new Ue,mFocalDistance:0,mApertureSize:0,mIsOrtho:0}},gLights:{value:[new er(pa),new er(da)]},volumeTexture:{type:"t",value:new Tt},gLutTexture:{type:"t",value:new Tt},gIntensityMax:{type:"v4",value:new Mt(1,1,1,1)},gIntensityMin:{type:"v4",value:new Mt(0,0,0,0)},gOpacity:{type:"1fv",value:[1,1,1,1]},gEmissive:{type:"v3v",value:[new I(0,0,0),new I(0,0,0),new I(0,0,0),new I(0,0,0)]},gDiffuse:{type:"v3v",value:[new I(1,0,0),new I(0,1,0),new I(0,0,1),new I(1,0,1)]},gSpecular:{type:"v3v",value:[new I(0,0,0),new I(0,0,0),new I(0,0,0),new I(0,0,0)]},gGlossiness:{type:"1fv",value:[1,1,1,1]},uShowLights:{type:"f",value:0},flipVolume:{type:"v3",value:new I(1,1,1)}}),Il=[[255,0,255],[255,255,255],[0,255,255]];function rS(i,e,t){let n,s,r,a=0;if(arguments.length===1){const v=i;e=v.s,t=v.v,a=v.h}else a=i;const c=Math.floor(a*6),u=a*6-c,d=t*(1-e),f=t*(1-u*e),m=t*(1-(1-u)*e);switch(c%6){case 0:n=t,s=m,r=d;break;case 1:n=f,s=t,r=d;break;case 2:n=d,s=t,r=m;break;case 3:n=d,s=f,r=t;break;case 4:n=m,s=d,r=t;break;case 5:n=t,s=d,r=f;break}return[Math.round(n*255),Math.round(s*255),Math.round(r*255)]}function oS(i){return function(){return i=Math.imul(48271,i)|0%2147483647,(i&2147483647)/2147483648}}const Dl=oS(123),Xo=i=>(Il[i]||(Il[i]=rS(Dl(),Dl()*.5+.5,Dl()*.5+.5)),Il[i]);function Fs(i,e,t){return Math.min(Math.max(e,i),t)}function Ci(i,e,t){return t*(e-i)+i}function aS(i,e,t,n,s,r,a){const c=(i-e)/(t-e),d=((a-r)*c+r-n)/(s-n);return e+d*(t-e)}function lS(i,e,t,n,s,r,a){const c=(i-e)/(t-e),d=((s-n)*c+n-r)/(a-r);return e+d*(t-e)}const Hn=256,wn=Hn*4;function cS(i){const e=Hn,t=new Uint8Array(e*4).fill(0);if(i.length===0)return t;if(i.sort((d,f)=>d.x-f.x),i.length===1){const d=Co(i[0]),f=Fs(i[0].x,0,255);for(let m=f;m<e;++m)t[m*4+0]=d[0],t[m*4+1]=d[1],t[m*4+2]=d[2],t[m*4+3]=d[3];return t}let n=i[0],s=i[1],r=Co(n),a=Co(s),c=1,u=0;for(let d=0;d<e;++d){for(;d>s.x;)n=s,r=a,c++,c>=i.length?s={x:255,color:s.color,opacity:s.opacity}:s=i[c],a=Co(s);s.x===n.x?u=1:u=(d-n.x)/(s.x-n.x),t[d*4+0]=Fs(Ci(r[0],a[0],u),0,255),t[d*4+1]=Fs(Ci(r[1],a[1],u),0,255),t[d*4+2]=Fs(Ci(r[2],a[2],u),0,255),t[d*4+3]=Fs(Ci(r[3],a[3],u),0,255)}return t}function Co(i){return[i.color[0],i.color[1],i.color[2],Math.floor(i.opacity*255)]}const Ul=(i=0,e=1)=>[{x:0,opacity:i,color:[255,255,255]},{x:255,opacity:e,color:[255,255,255]}];class ni{constructor(){this.lut=new Uint8Array(wn),this.controlPoints=[],this.createFullRange()}createFromMinMax(e,t){if(t<e){const a=t;t=e,e=a}if(e<0&&t<0)return this.controlPoints=Ul(1,1),this.createFromControlPoints(this.controlPoints);if(e>=255&&t>=255)return this.controlPoints=Ul(0,0),this.createFromControlPoints(this.controlPoints);const n=[];let s=0;e<0&&(s=-e/(t-e)),n.push({x:0,opacity:s,color:[255,255,255]}),e>0&&n.push({x:e,opacity:0,color:[255,255,255]}),t<255&&(t===e?n.push({x:e+.5,opacity:1,color:[255,255,255]}):n.push({x:t,opacity:1,color:[255,255,255]}));let r=1;return t>255&&(r=(255-e)/(t-e)),n.push({x:255,opacity:r,color:[255,255,255]}),this.createFromControlPoints(n)}createFullRange(){return this.controlPoints=Ul(),this.createFromControlPoints(this.controlPoints)}createFromWindowLevel(e,t){const n=t-e*.5,s=t+e*.5;return this.createFromMinMax(n*255,s*255)}createFromControlPoints(e){return this.lut=cS(e),this.controlPoints=e,this}createFromEqHistogram(e){const t=[];for(let s=0;s<e.getNumBins();++s)t[s]=0;t[0]=e.getBin(0);for(let s=1;s<e.getNumBins();++s)t[s]=t[s-1]+e.getBin(s);if(t[t.length-1]-t[0]>0){const s=[{x:0,opacity:0,color:[255,255,255]}];let r=0,a=0,c=0,u=0;for(let d=1;d<Hn;++d)u=c,c=Fs(Math.round(255*(t[d]-t[0])),0,255),r=c-u,r!=a&&(s.push({x:d-1,opacity:u/255,color:[255,255,255]}),a=r);return s.push({x:255,opacity:1,color:[255,255,255]}),this.createFromControlPoints(s)}else return this.createFullRange()}createLabelColors(e){const t=new Uint8Array(wn).fill(0),n=[];n.push({x:0,opacity:0,color:[0,0,0]});let s=0,r=0,a=0,c=0,u=0,d=0,f=0,m=0;for(let v=1;v<Hn;++v){const g=Math.floor(v/(Hn-1)*(e.getNumBins()-1));if(e.getBin(g)>0){const b=Xo(g);t[v*4+0]=b[0],t[v*4+1]=b[1],t[v*4+2]=b[2],t[v*4+3]=255,u=b[0],d=b[1],f=b[2],m=1}else u=0,d=0,f=0,m=0;(u!==s||d!==r||f!==a||m!==c)&&(c===0&&n.push({x:v-.5,opacity:c,color:[s,r,a]}),n.push({x:v,opacity:m,color:[u,d,f]}),s=u,r=d,a=f,c=m)}return this.lut=t,this.controlPoints=n,this}remapDomains(e,t,n,s){this.lut=hS(this.lut,e,t,n,s),this.controlPoints=uS(this.controlPoints,e,t,n,s)}}function hS(i,e,t,n,s){const r=new Uint8Array(wn);for(let a=0;a<Hn;++a){let c=aS(a,0,Hn-1,e,t,n,s);c<0&&(c=0),c>Hn-1&&(c=Hn-1);const u=Math.floor(c),d=Math.ceil(c),f=c-u;r[a*4+0]=Math.round(Ci(i[u*4+0],i[d*4+0],f)),r[a*4+1]=Math.round(Ci(i[u*4+1],i[d*4+1],f)),r[a*4+2]=Math.round(Ci(i[u*4+2],i[d*4+2],f)),r[a*4+3]=Math.round(Ci(i[u*4+3],i[d*4+3],f))}return r}function uS(i,e,t,n,s,r=!0){if(i.length===0)return i;const a=[],c=i[0].x,u=i[i.length-1].x;for(let d=0;d<i.length;++d){const f=i[d],v={x:lS(f.x,0,Hn-1,e,t,n,s),opacity:f.opacity,color:[f.color[0],f.color[1],f.color[2]]};a.push(v)}return r?dS(a,c,u):a}function dS(i,e,t){const s=i[0],r=i[1],a=i[i.length-2],c=i[i.length-1];return Math.abs(s.opacity-((r==null?void 0:r.opacity)??1/0))<1e-4&&(s.x<0?s.x=Math.min(0,r.x-1):e<1e-4&&(s.x=0)),Math.abs(c.opacity-((a==null?void 0:a.opacity)??1/0))<1e-4&&(c.x>255?c.x=Math.max(255,a.x+1):t>255-1e-4&&(c.x=255)),i}class Vd{constructor(e,t=new Li(e)){this.pathTracingUniforms=sS(),this.denoiseShaderUniforms=zd(),this.screenOutputShaderUniforms=eS(),this.volume=e,this.viewChannels=[-1,-1,-1,-1];const{x:n,y:s,z:r}=e.imageInfo.subregionSize,a=new Uint8Array(n*s*r*4).fill(0);this.volumeTexture=new Sp(a,n,s,r),this.volumeTexture.minFilter=this.volumeTexture.magFilter=zt,this.volumeTexture.generateMipmaps=!1,this.volumeTexture.needsUpdate=!0;const c=new Uint8Array(wn*4).fill(1),u=new Gs(c,256,4,Xt,Qt);u.minFilter=u.magFilter=zt,u.needsUpdate=!0,this.pathTracingUniforms.gLutTexture.value=u,this.cameraIsMoving=!1,this.sampleCounter=0,this.frameCounter=0,this.pathTracingRenderTarget=new Fn(2,2,{minFilter:It,magFilter:It,format:Xt,type:Tn,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1}),this.screenTextureRenderTarget=new Fn(2,2,{minFilter:It,magFilter:It,format:Xt,type:Tn,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1}),this.pathTracingUniforms.volumeTexture.value=this.volumeTexture,this.pathTracingUniforms.tPreviousTexture.value=this.screenTextureRenderTarget.texture,this.pathTracingRenderToBuffer=new Ec(nS,this.pathTracingUniforms),this.screenTextureRenderToBuffer=new Ec(zp,{image:{value:this.pathTracingRenderTarget.texture}}),this.screenOutputGeometry=new Ni(2,2),this.screenOutputMaterial=new mn({uniforms:this.screenOutputShaderUniforms,vertexShader:ia,fragmentShader:Qw,depthWrite:!1,depthTest:!1,blending:Wn,transparent:!0}),this.denoiseShaderUniforms=zd(),this.screenOutputDenoiseMaterial=new mn({uniforms:this.denoiseShaderUniforms,vertexShader:ia,fragmentShader:Zw,depthWrite:!1,depthTest:!1,blending:Wn,transparent:!0}),this.screenOutputMaterial.uniforms.tTexture0.value=this.pathTracingRenderTarget.texture,this.screenOutputDenoiseMaterial.uniforms.tTexture0.value=this.pathTracingRenderTarget.texture,this.screenOutputMesh=new Lt(this.screenOutputGeometry,this.screenOutputMaterial),this.gradientDelta=1/Math.max(n,Math.max(s,r));const d=1/this.gradientDelta;this.pathTracingUniforms.gGradientDeltaX.value=new I(this.gradientDelta,0,0),this.pathTracingUniforms.gGradientDeltaY.value=new I(0,this.gradientDelta,0),this.pathTracingUniforms.gGradientDeltaZ.value=new I(0,0,this.gradientDelta),this.pathTracingUniforms.gInvGradientDelta.value=d,this.pathTracingUniforms.gGradientFactor.value=50,this.updateSettings(t),this.settings=t;const f=this.getNormVolumeSize();this.pathTracingUniforms.gInvAaBbMax.value=new I(1/f.x,1/f.y,1/f.z).divide(e.normRegionSize),this.updateLightsSecondary()}cleanup(){this.volumeTexture.dispose()}setRenderUpdateListener(e){this.renderUpdateListener=e}resetProgress(){this.sampleCounter!==0&&this.renderUpdateListener&&this.renderUpdateListener(0),this.sampleCounter=0}getNormVolumeSize(){return this.volume.normPhysicalSize.clone().multiply(this.settings.scale)}updateSettings(e,t){if(t===void 0&&(t=Pe.ALL),this.settings=e,t&Pe.SAMPLING){const n=this.settings.resolution.clone(),s=window.devicePixelRatio?window.devicePixelRatio:1,r=Math.floor(n.x*this.settings.pixelSamplingRate/s),a=Math.floor(n.y*this.settings.pixelSamplingRate/s);this.pathTracingUniforms.uResolution.value.x=r,this.pathTracingUniforms.uResolution.value.y=a,this.pathTracingRenderTarget.setSize(r,a),this.screenTextureRenderTarget.setSize(r,a),this.pathTracingUniforms.gStepSize.value=this.settings.primaryRayStepSize*this.gradientDelta,this.pathTracingUniforms.gStepSizeShadow.value=this.settings.secondaryRayStepSize*this.gradientDelta}if(t&Pe.TRANSFORM&&(this.pathTracingUniforms.flipVolume.value=this.settings.flipAxes),t&Pe.MATERIAL&&(this.pathTracingUniforms.gDensityScale.value=this.settings.density*150,this.updateMaterial()),t&Pe.ROI){const{normRegionSize:n,normRegionOffset:s}=this.volume,{bmin:r,bmax:a}=this.settings.bounds,c=this.getNormVolumeSize(),u=s.clone().subScalar(.5).multiply(c),d=s.clone().add(n).subScalar(.5).multiply(c),f=r.clone().multiply(c);this.pathTracingUniforms.gClippedAaBbMin.value=f.clamp(u,d);const m=a.clone().multiply(c);this.pathTracingUniforms.gClippedAaBbMax.value=m.clamp(u,d),this.pathTracingUniforms.gVolCenter.value=this.volume.getContentCenter().multiply(this.settings.scale)}t&Pe.CAMERA&&this.updateExposure(this.settings.brightness),t&Pe.MASK_ALPHA&&this.updateVolumeData4(),t&Pe.VIEW&&(this.pathTracingUniforms.gCamera.value.mIsOrtho=this.settings.isOrtho?1:0),t&Pe.SAMPLING&&(this.volumeTexture.minFilter=this.volumeTexture.magFilter=e.useInterpolation?zt:It,this.volumeTexture.needsUpdate=!0),this.resetProgress()}updateVolumeDimensions(){this.updateSettings(this.settings,Pe.ROI)}doRender(e,t){if(!this.volumeTexture)return;this.cameraIsMoving?(this.resetProgress(),this.frameCounter+=1):(this.sampleCounter+=1,this.frameCounter+=1,this.renderUpdateListener&&this.renderUpdateListener(this.sampleCounter)),this.pathTracingUniforms.uSampleCounter.value=this.sampleCounter,this.pathTracingUniforms.uFrameCounter.value=this.frameCounter,t.updateMatrixWorld(!0);const n=t.matrixWorld.clone();n.setPosition(new I(0,0,0)),this.updateLightsSecondary(n);let s=new I;s=t.getWorldDirection(s);const r=new I().copy(t.up),a=new I().copy(t.position),c=new _t().makeRotationFromQuaternion(new Ui().setFromEuler(this.settings.rotation).invert());a.sub(this.settings.translation),a.applyMatrix4(c),r.applyMatrix4(c),s.applyMatrix4(c),this.pathTracingUniforms.gCamera.value.mIsOrtho=On(t)?1:0,this.pathTracingUniforms.gCamera.value.mFrom.copy(a),this.pathTracingUniforms.gCamera.value.mN.copy(s),this.pathTracingUniforms.gCamera.value.mU.crossVectors(this.pathTracingUniforms.gCamera.value.mN,r).normalize(),this.pathTracingUniforms.gCamera.value.mV.crossVectors(this.pathTracingUniforms.gCamera.value.mU,this.pathTracingUniforms.gCamera.value.mN).normalize();const u=On(t)?Math.abs(t.top)/t.zoom:Math.tan(.5*t.fov*Math.PI/180),d=this.pathTracingUniforms.uResolution.value.x/this.pathTracingUniforms.uResolution.value.y;this.pathTracingUniforms.gCamera.value.mScreen.set(-u*d,u*d,u,-u);const f=this.pathTracingUniforms.gCamera.value.mScreen;this.pathTracingUniforms.gCamera.value.mInvScreen.set((f.y-f.x)/this.pathTracingUniforms.uResolution.value.x,(f.w-f.z)/this.pathTracingUniforms.uResolution.value.y);const m=.33*(Math.max(this.sampleCounter-1,1)*.035);m>0&&m<1?(this.screenOutputDenoiseMaterial.uniforms.gDenoiseLerpC.value=m,this.screenOutputMesh.material=this.screenOutputDenoiseMaterial):this.screenOutputMesh.material=this.screenOutputMaterial,this.screenOutputDenoiseMaterial.uniforms.gDenoisePixelSize.value.x=this.pathTracingUniforms.uResolution.value.x,this.screenOutputDenoiseMaterial.uniforms.gDenoisePixelSize.value.y=this.pathTracingUniforms.uResolution.value.y,this.pathTracingRenderToBuffer.render(e,this.pathTracingRenderTarget),this.screenTextureRenderToBuffer.render(e,this.screenTextureRenderTarget),e.setRenderTarget(null)}get3dObject(){return this.screenOutputMesh}onStartControls(){this.cameraIsMoving=!0}onChangeControls(){}onEndControls(){this.cameraIsMoving=!1,this.resetProgress()}viewpointMoved(){this.resetProgress()}updateActiveChannels(e,t){const n=[-1,-1,-1,-1];let s=0;const r=this.volume.imageInfo.numChannels,a=4;for(let u=0;u<r&&s<a;++u)e[u].rgbColor!==Jy&&t[u].loaded&&(n[s]=u,s++);n.every((u,d)=>u===this.viewChannels[d],this)||(this.pathTracingUniforms.gNChannels.value=s,this.viewChannels=n,this.updateVolumeData4(),this.resetProgress(),this.updateLuts(e,t),this.updateMaterial())}updateVolumeData4(){const{x:e,y:t,z:n}=this.volume.imageInfo.subregionSize,s=new Uint8Array(e*t*n*4);s.fill(0);for(let r=0;r<4;++r){const a=this.viewChannels[r];if(a===-1)continue;const c=this.volume.getChannel(a);for(let u=0;u<n;++u)for(let d=0;d<t;++d)for(let f=0;f<e;++f)s[r+f*4+d*4*e+u*4*e*t]=255*c.normalizeRaw(c.getIntensity(f,d,u));if(this.settings.maskChannelIndex!==-1&&this.settings.maskAlpha<1){const u=this.volume.getChannel(this.settings.maskChannelIndex);let d=1;const f=this.settings.maskAlpha;for(let m=0;m<n;++m)for(let v=0;v<t;++v)for(let g=0;g<e;++g)d=u.getIntensity(g,v,m)>0?1:f,s[r+g*4+v*4*e+m*4*e*t]*=d}}this.volumeTexture.image.data.set(s),this.volumeTexture.needsUpdate=!0}updateLuts(e,t){for(let n=0;n<this.pathTracingUniforms.gNChannels.value;++n){const s=this.viewChannels[n],r=t[s].combineLuts(e[s].rgbColor);this.pathTracingUniforms.gLutTexture.value.image.data.set(r,n*wn),this.pathTracingUniforms.gIntensityMax.value.setComponent(n,this.volume.channels[s].histogram.getMax()/255),this.pathTracingUniforms.gIntensityMin.value.setComponent(n,this.volume.channels[s].histogram.getMin()/255)}this.pathTracingUniforms.gLutTexture.value.needsUpdate=!0,this.resetProgress()}updateMaterial(){for(let e=0;e<this.viewChannels.length;++e){const t=this.viewChannels[e];if(t>-1){const s=this.volume.getChannel(t).combineLuts(this.settings.diffuse[t]);this.pathTracingUniforms.gLutTexture.value.image.data.set(s,e*wn),this.pathTracingUniforms.gLutTexture.value.needsUpdate=!0,this.pathTracingUniforms.gDiffuse.value[e]=new I(1,1,1),this.pathTracingUniforms.gSpecular.value[e]=new I().fromArray(this.settings.specular[t]).multiplyScalar(1/255),this.pathTracingUniforms.gEmissive.value[e]=new I().fromArray(this.settings.emissive[t]).multiplyScalar(1/255),this.pathTracingUniforms.gGlossiness.value[e]=this.settings.glossiness[t]}}this.resetProgress()}updateShadingMethod(e){this.pathTracingUniforms.gShadingType.value=e,this.resetProgress()}updateShowLights(e){this.pathTracingUniforms.uShowLights.value=e,this.resetProgress()}updateExposure(e){e>.99999&&(e=.99999),this.screenOutputMaterial.uniforms.gInvExposure.value=1/(1-e)-1,this.screenOutputDenoiseMaterial.uniforms.gInvExposure.value=1/(1-e)-1,this.resetProgress()}updateCamera(e,t,n){this.pathTracingUniforms.gCamera.value.mApertureSize=n,this.pathTracingUniforms.gCamera.value.mFocalDistance=t,this.resetProgress()}updateLights(e){this.pathTracingUniforms.gLights.value[0].mColorTop=new I().copy(e[0].mColorTop),this.pathTracingUniforms.gLights.value[0].mColorMiddle=new I().copy(e[0].mColorMiddle),this.pathTracingUniforms.gLights.value[0].mColorBottom=new I().copy(e[0].mColorBottom),this.pathTracingUniforms.gLights.value[1].mColor=new I().copy(e[1].mColor),this.pathTracingUniforms.gLights.value[1].mTheta=e[1].mTheta,this.pathTracingUniforms.gLights.value[1].mPhi=e[1].mPhi,this.pathTracingUniforms.gLights.value[1].mDistance=e[1].mDistance,this.pathTracingUniforms.gLights.value[1].mWidth=e[1].mWidth,this.pathTracingUniforms.gLights.value[1].mHeight=e[1].mHeight,this.updateLightsSecondary(),this.resetProgress()}updateLightsSecondary(e){console.log("lights secondary");const t=this.getNormVolumeSize(),n=new I(t.x*.5,t.y*.5,t.z*.5);for(let s=0;s<2;++s)this.pathTracingUniforms.gLights.value[s].update(n,e)}updateClipRegion(e,t,n,s,r,a){this.settings.bounds={bmin:new I(e-.5,n-.5,r-.5),bmax:new I(t-.5,s-.5,a-.5)};const c=this.getNormVolumeSize();this.pathTracingUniforms.gClippedAaBbMin.value=new I(e*c.x-.5*c.x,n*c.y-.5*c.y,r*c.z-.5*c.z),this.pathTracingUniforms.gClippedAaBbMax.value=new I(t*c.x-.5*c.x,s*c.y-.5*c.y,a*c.z-.5*c.z),this.resetProgress()}setZSlice(e){return!0}}const pS=`precision highp float;
precision highp int;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);
}
`,fS=`
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 textureRes;
uniform float GAMMA_MIN;
uniform float GAMMA_MAX;
uniform float GAMMA_SCALE;
uniform float BRIGHTNESS;
uniform float DENSITY;
uniform float maskAlpha;
uniform vec2 ATLAS_DIMS;
uniform vec3 AABB_CLIP_MIN;
uniform vec3 AABB_CLIP_MAX;
uniform sampler2D textureAtlas;
uniform sampler2D textureAtlasMask;
uniform int Z_SLICE;
uniform float SLICES;
uniform bool interpolationEnabled;
uniform vec3 flipVolume;

varying vec2 vUv;

// for atlased texture, we need to find the uv offset for the slice at t
vec2 offsetFrontBack(float t) {
  int a = int(t);
  int ax = int(ATLAS_DIMS.x);
  vec2 os = vec2(float(a - (a / ax) * ax), float(a / ax)) / ATLAS_DIMS;
  return clamp(os, vec2(0.0), vec2(1.0) - vec2(1.0) / ATLAS_DIMS);
}

vec4 sampleAtlas(sampler2D tex, vec4 pos) {
  float bounds = float(pos[0] >= 0.0 && pos[0] <= 1.0 &&
    pos[1] >= 0.0 && pos[1] <= 1.0 &&
    pos[2] >= 0.0 && pos[2] <= 1.0);

  float nSlices = float(SLICES);

  vec2 loc0 = ((pos.xy - 0.5) * flipVolume.xy + 0.5) / ATLAS_DIMS;


  if (interpolationEnabled) {
    // loc ranges from 0 to 1/ATLAS_DIMS
    // shrink loc0 to within one half edge texel - so as not to sample across edges of tiles.
    loc0 = loc0 * (vec2(1.0) - ATLAS_DIMS / textureRes);
  }
  else {
    // No interpolation - sample just one slice at a pixel center.
    loc0 = floor(loc0 * textureRes) / textureRes;
  }
  loc0 += vec2(0.5) / textureRes;

  float z = min(floor(pos.z * nSlices), nSlices - 1.0);

  if(flipVolume.z == -1.0) {
    z = nSlices - z - 1.0;
  }

  vec2 o = offsetFrontBack(z) + loc0;
  vec4 voxelColor = texture2D(tex, o);

  // Apply mask
  float voxelMask = texture2D(textureAtlasMask, o).x;
  voxelMask = mix(voxelMask, 1.0, maskAlpha);
  voxelColor.rgb *= voxelMask;

  return bounds * voxelColor;
}

void main() {
  gl_FragColor = vec4(0.0);

  vec3 boxMin = AABB_CLIP_MIN;
  vec3 boxMax = AABB_CLIP_MAX;
  // Normalize UV for [-0.5, 0.5] range
  vec2 normUv = vUv - vec2(0.5);

  // Return background color if outside of clipping box
  if(normUv.x < boxMin.x || normUv.x > boxMax.x || normUv.y < boxMin.y || normUv.y > boxMax.y) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // Normalize z-slice by total slices
  vec4 pos = vec4(vUv, 
    (SLICES==1.0 && Z_SLICE==0) ? 0.0 : float(Z_SLICE) / (SLICES - 1.0), 
    0.0);

  vec4 C;
  C = sampleAtlas(textureAtlas, pos);
  C.xyz *= BRIGHTNESS;

  C = clamp(C, 0.0, 1.0);
  gl_FragColor = C;
  return;
}`,mS=pS,gS=fS,vS=()=>({iResolution:{type:"v2",value:new Ue(100,100)},CLIP_NEAR:{type:"f",value:0},CLIP_FAR:{type:"f",value:1e4},maskAlpha:{type:"f",value:1},BRIGHTNESS:{type:"f",value:0},DENSITY:{type:"f",value:1},GAMMA_MIN:{type:"f",value:0},GAMMA_MAX:{type:"f",value:1},GAMMA_SCALE:{type:"f",value:1},BREAK_STEPS:{type:"i",value:128},ATLAS_DIMS:{type:"v2",value:new Ue(6,6)},Z_SLICE:{type:"i",value:0},SLICES:{type:"f",value:50},isOrtho:{type:"f",value:0},orthoThickness:{type:"f",value:1},orthoScale:{type:"f",value:.5},AABB_CLIP_MIN:{type:"v3",value:new I(-.5,-.5,-.5)},AABB_CLIP_MAX:{type:"v3",value:new I(.5,.5,.5)},inverseModelViewMatrix:{type:"m4",value:new _t},textureAtlas:{type:"t",value:new Tt},textureAtlasMask:{type:"t",value:new Tt},maxProject:{type:"i",value:0},interpolationEnabled:{type:"b",value:!0},flipVolume:{type:"v3",value:new I(1,1,1)},volumeScale:{type:"v3",value:new I(1,1,1)},textureRes:{type:"v2",value:new Ue(1,1)}}),_S=new Ke(16776960);class xS{constructor(e,t=new Li(e)){this.sliceUpdateWaiting=!1,this.volume=e,this.uniforms=vS(),[this.geometry,this.geometryMesh]=this.createGeometry(this.uniforms),this.boxHelper=new Dp(new fn(new I(-.5,-.5,-.5),new I(.5,.5,.5)),_S),this.boxHelper.updateMatrixWorld(),this.boxHelper.visible=!1,this.geometryTransformNode=new Ai,this.geometryTransformNode.name="VolumeContainerNode",this.geometryTransformNode.add(this.boxHelper,this.geometryMesh),this.setUniform("Z_SLICE",Math.floor(e.imageInfo.volumeSize.z/2)),this.settings=t,this.updateVolumeDimensions(),this.updateSettings(t,Pe.ALL)}updateSlice(){const e=Math.floor(this.settings.zSlice),t=this.volume.imageInfo.volumeSize.z;if(e<0||e>=t)return!1;const n=this.volume.imageInfo.subregionOffset.z,s=n+this.volume.imageInfo.subregionSize.z;return e<n||e>=s?this.sliceUpdateWaiting=!0:(this.setUniform("Z_SLICE",e),this.sliceUpdateWaiting=!1),!0}updateVolumeDimensions(){var u;const e=this.volume.normPhysicalSize.clone().multiply(this.settings.scale),t=e.clone().multiply(this.volume.normRegionSize),n=this.volume.getContentCenter().clone().multiply(this.settings.scale);this.geometryMesh.position.copy(n),this.geometryMesh.scale.copy(t),this.setUniform("volumeScale",t),this.boxHelper.box.set(e.clone().multiplyScalar(-.5),e.clone().multiplyScalar(.5));const{atlasTileDims:s,subregionSize:r,volumeSize:a}=this.volume.imageInfo,c=new Ue(r.x,r.y).multiply(s);this.setUniform("ATLAS_DIMS",s),this.setUniform("textureRes",c),this.setUniform("SLICES",a.z),this.sliceUpdateWaiting&&this.updateSlice(),(!this.channelData||this.channelData.width!==c.x||this.channelData.height!==c.y)&&((u=this.channelData)==null||u.cleanup(),this.channelData=new Gp(c.x,c.y))}updateSettings(e,t){if(t===void 0&&(t=Pe.ALL),this.settings=e,t&Pe.VIEW){this.geometryMesh.visible=this.settings.visible,this.setUniform("orthoScale",this.settings.orthoScale),this.setUniform("isOrtho",this.settings.isOrtho?1:0);const n=this.settings.viewAxis;if(this.settings.isOrtho&&n!==null){const s=this.settings.bounds.bmax[n],r=this.settings.bounds.bmin[n],a=s-r;this.setUniform("orthoThickness",a)}else this.setUniform("orthoThickness",1)}if(t&Pe.BOUNDING_BOX){this.boxHelper.visible=this.settings.showBoundingBox;const n=this.settings.boundingBoxColor,s=new Ke(n[0],n[1],n[2]);this.boxHelper.material.color=s}if(t&Pe.TRANSFORM&&(this.geometryTransformNode.position.copy(this.settings.translation),this.geometryTransformNode.rotation.copy(this.settings.rotation),this.setUniform("flipVolume",this.settings.flipAxes)),t&Pe.MATERIAL&&this.setUniform("DENSITY",this.settings.density),t&Pe.CAMERA&&(this.setUniform("BRIGHTNESS",this.settings.brightness*2),this.setUniform("GAMMA_MIN",this.settings.gammaMin),this.setUniform("GAMMA_MAX",this.settings.gammaMax),this.setUniform("GAMMA_SCALE",this.settings.gammaLevel)),t&Pe.ROI){const n=this.settings.bounds,{normRegionSize:s,normRegionOffset:r}=this.volume,a=s.clone().divideScalar(2).add(r).subScalar(.5),c=n.bmin.clone().sub(a).divide(s).clampScalar(-.5,.5),u=n.bmax.clone().sub(a).divide(s).clampScalar(-.5,.5);if(this.setUniform("AABB_CLIP_MIN",c),this.setUniform("AABB_CLIP_MAX",u),this.updateSlice()){const f=Math.floor(this.settings.zSlice)/this.volume.imageInfo.volumeSize.z,m=(Math.floor(this.settings.zSlice)+1)/this.volume.imageInfo.volumeSize.z;this.volume.updateRequiredData({subregion:new fn(new I(0,0,f),new I(1,1,m))})}}t&Pe.SAMPLING&&(this.setUniform("interpolationEnabled",this.settings.useInterpolation),this.setUniform("iResolution",this.settings.resolution)),t&Pe.MASK_ALPHA&&this.setUniform("maskAlpha",this.settings.maskChannelIndex<0?1:this.settings.maskAlpha),t&Pe.MASK_DATA&&this.channelData.setChannelAsMask(this.settings.maskChannelIndex,this.volume.getChannel(this.settings.maskChannelIndex))}createGeometry(e){const t=new Ni(1,1),n=new Lt(t);n.name="Plane";const s=mS,r=gS,a=new mn({uniforms:e,vertexShader:s,fragmentShader:r,transparent:!0,depthTest:!0,depthWrite:!1});return n.material=a,[t,n]}cleanup(){this.geometry.dispose(),this.geometryMesh.material.dispose(),this.channelData.cleanup()}viewpointMoved(){}doRender(e,t){if(!this.geometryMesh.visible)return;this.channelData.gpuFuse(e),this.setUniform("textureAtlas",this.channelData.getFusedTexture()),this.setUniform("textureAtlasMask",this.channelData.maskTexture),this.geometryTransformNode.updateMatrixWorld(!0);const n=new _t;n.multiplyMatrices(t.matrixWorldInverse,this.geometryMesh.matrixWorld);const s=new _t;s.copy(n).invert(),this.setUniform("inverseModelViewMatrix",s)}get3dObject(){return this.geometryTransformNode}updateActiveChannels(e,t){this.channelData.fuse(e,t),this.setUniform("textureAtlas",this.channelData.getFusedTexture()),this.setUniform("textureAtlasMask",this.channelData.maskTexture)}setUniform(e,t){this.uniforms[e]&&(this.uniforms[e].value=t)}setRenderUpdateListener(e){}}class bS{constructor(e,t){switch(this.volume=e,this.settings=new Li(e),this.onChannelDataReadyCallback=void 0,this.viewMode=Pt.NONE,this.channelColors=this.volume.channelColorsDefault.slice(),this.channelOptions=new Array(this.volume.imageInfo.numChannels).fill({}),this.fusion=this.channelColors.map((n,s)=>{let r;return n[0]===0&&n[1]===0&&n[2]===0?r=0:r=[n[0],n[1],n[2]],{chIndex:s,lut:new Uint8Array(wn),rgbColor:r}}),this.sceneRoot=new Et,this.meshVolume=new Vw(this.volume),t.renderMode=t.renderMode||Ze.RAYMARCH,t.renderMode){case Ze.PATHTRACE:this.renderMode=Ze.PATHTRACE,this.volumeRendering=new Vd(this.volume,this.settings);break;case Ze.SLICE:case Ze.RAYMARCH:default:this.renderMode=Ze.RAYMARCH,this.volumeRendering=new kd(this.volume,this.settings)}(t.renderMode===Ze.RAYMARCH||t.renderMode===Ze.SLICE)&&this.sceneRoot.add(this.meshVolume.get3dObject()),this.sceneRoot.add(this.volumeRendering.get3dObject()),this.sceneRoot.position.set(0,0,0),this.updateScale(),this.settings.translation=new I().fromArray(this.volume.getTranslation()),this.settings.rotation=new en().fromArray(this.volume.getRotation()),this.setOptions(t)}updateChannelDataRequired(e){const{enabled:t,isosurfaceEnabled:n}=this.channelOptions[e],s=t||n||e===this.settings.maskChannelIndex,r=this.volume.loadSpecRequired.channels;r.includes(e)?s||this.volume.updateRequiredData({channels:r.filter(a=>a!==e)}):s&&this.volume.updateRequiredData({channels:[...r,e]})}setOptions(e){e=e||{},e.maskChannelIndex!==void 0&&this.setChannelAsMask(e.maskChannelIndex),e.maskAlpha!==void 0&&this.setMaskAlpha(e.maskAlpha),e.clipBounds!==void 0&&(this.settings.bounds={bmin:new I(e.clipBounds[0],e.clipBounds[2],e.clipBounds[4]),bmax:new I(e.clipBounds[1],e.clipBounds[3],e.clipBounds[5])},this.setAxisClip(Pt.X,e.clipBounds[0],e.clipBounds[1]),this.setAxisClip(Pt.Y,e.clipBounds[2],e.clipBounds[3]),this.setAxisClip(Pt.Z,e.clipBounds[4],e.clipBounds[5])),e.translation!==void 0&&this.setTranslation(new I().fromArray(e.translation)),e.rotation!==void 0&&this.setRotation(new en().fromArray(e.rotation)),e.renderMode!==void 0&&this.setVolumeRendering(e.renderMode),(e.primaryRayStepSize!==void 0||e.secondaryRayStepSize!==void 0)&&this.setRayStepSizes(e.primaryRayStepSize,e.secondaryRayStepSize),e.showBoundingBox!==void 0&&this.setShowBoundingBox(e.showBoundingBox),e.boundingBoxColor!==void 0&&this.setBoundingBoxColor(e.boundingBoxColor),e.channels!==void 0&&(this.channelOptions=e.channels,this.channelOptions.forEach((t,n)=>{this.setChannelOptions(n,t)}))}setChannelOptions(e,t){if(this.channelOptions[e]=Object.assign(this.channelOptions[e],t),t.enabled!==void 0&&this.setVolumeChannelEnabled(e,t.enabled),t.color!==void 0&&this.updateChannelColor(e,t.color),t.isosurfaceEnabled!==void 0){const n=this.hasIsosurface(e);if(n!==t.isosurfaceEnabled){if(n&&!t.isosurfaceEnabled)this.meshVolume.destroyIsosurface(e);else if(!n&&t.isosurfaceEnabled&&this.volume.channels[e].loaded){const{isovalue:s,isosurfaceOpacity:r}=t;this.meshVolume.createIsosurface(e,this.channelColors[e],s,r)}this.updateChannelDataRequired(e)}else t.isosurfaceEnabled&&(t.isovalue!==void 0&&this.meshVolume.updateIsovalue(e,t.isovalue),t.isosurfaceOpacity!==void 0&&this.meshVolume.updateOpacity(e,t.isosurfaceOpacity))}else t.isovalue!==void 0&&this.meshVolume.updateIsovalue(e,t.isovalue),t.isosurfaceOpacity!==void 0&&this.meshVolume.updateOpacity(e,t.isosurfaceOpacity)}setRayStepSizes(e,t){e===this.settings.primaryRayStepSize&&t===this.settings.secondaryRayStepSize||(e!==void 0&&(this.settings.primaryRayStepSize=e),t!==void 0&&(this.settings.secondaryRayStepSize=t),this.volumeRendering.updateSettings(this.settings,Pe.SAMPLING))}updateScale(){const{normPhysicalSize:e,normRegionSize:t}=this.volume,n=e.clone().multiply(t).multiply(this.settings.scale);this.meshVolume.setScale(n,this.volume.getContentCenter().multiply(this.settings.scale)),this.volumeRendering.updateVolumeDimensions(),this.volumeRendering.updateSettings(this.settings,Pe.TRANSFORM)}setOrthoScale(e){this.settings.orthoScale!==e&&(this.settings.orthoScale=e,this.volumeRendering.updateSettings(this.settings,Pe.VIEW))}setResolution(e,t){const n=new Ue(e,t);this.settings.resolution.equals(n)||(this.meshVolume.setResolution(e,t),this.settings.resolution=n,this.volumeRendering.updateSettings(this.settings,Pe.SAMPLING))}setAxisClip(e,t,n,s){this.settings.bounds.bmax[e]===n&&this.settings.bounds.bmin[e]===t&&this.settings.viewAxis===e&&this.settings.isOrtho===(s||!1)||(this.settings.bounds.bmax[e]=n,this.settings.bounds.bmin[e]=t,this.settings.viewAxis=e,this.settings.isOrtho=s||!1,e!==Pt.NONE&&this.renderMode!==Ze.PATHTRACE&&this.meshVolume.setAxisClip(e,t,n,!!s),this.volumeRendering.updateSettings(this.settings,Pe.ROI|Pe.VIEW))}modeStringToAxis(e){return{X:Pt.X,YZ:Pt.X,Y:Pt.Y,XZ:Pt.Y,Z:Pt.Z,XY:Pt.Z}[e]||Pt.NONE}setViewMode(e,t){const n=this.modeStringToAxis(e);this.viewMode=n,n===Pt.Z?(this.renderMode===Ze.RAYMARCH||this.renderMode===Ze.PATHTRACE)&&this.setVolumeRendering(Ze.SLICE):this.renderMode===Ze.SLICE&&this.setVolumeRendering(t),this.settings.viewAxis!==n&&(this.settings.viewAxis=n,this.volumeRendering.updateSettings(this.settings,Pe.VIEW))}setIsOrtho(e){this.settings.isOrtho!==e&&(this.settings.isOrtho=e,this.volumeRendering.updateSettings(this.settings,Pe.VIEW))}setInterpolationEnabled(e){this.settings.useInterpolation!==e&&(this.settings.useInterpolation=e,this.volumeRendering.updateSettings(this.settings,Pe.SAMPLING))}setOrthoThickness(e){this.renderMode!==Ze.PATHTRACE&&this.meshVolume.setOrthoThickness(e)}setGamma(e,t,n){this.settings.gammaMin===e&&this.settings.gammaLevel===t&&this.settings.gammaMax===n||(this.settings.gammaMin=e,this.settings.gammaLevel=t,this.settings.gammaMax=n,this.volumeRendering.updateSettings(this.settings,Pe.CAMERA))}setFlipAxes(e,t,n){const s=new I(e,t,n);this.settings.flipAxes.equals(s)||(this.settings.flipAxes=s,this.meshVolume.setFlipAxes(e,t,n),this.volumeRendering.updateSettings(this.settings,Pe.TRANSFORM))}setMaxProjectMode(e){this.settings.maxProjectMode!==e&&(this.settings.maxProjectMode=e,this.volumeRendering.updateSettings(this.settings,Pe.VIEW))}onAnimate(e,t,n){t.updateMatrixWorld(!0),t.matrixWorldInverse.copy(t.matrixWorld).invert(),this.volumeRendering.doRender(e,t,n),this.renderMode!==Ze.PATHTRACE&&this.meshVolume.doRender()}getViewMode(){return this.viewMode}getIsovalue(e){return this.meshVolume.getIsovalue(e)}hasIsosurface(e){return this.meshVolume.hasIsosurface(e)}fuse(){this.volume&&this.volumeRendering.updateActiveChannels(this.fusion,this.volume.channels)}setRenderUpdateListener(e){this.renderUpdateListener=e,this.renderMode===Ze.PATHTRACE&&this.volumeRendering.setRenderUpdateListener(e)}updateShadingMethod(e){this.renderMode===Ze.PATHTRACE&&this.volumeRendering.updateShadingMethod(e?1:0)}updateMaterial(){this.volumeRendering.updateActiveChannels(this.fusion,this.volume.channels),this.volumeRendering.updateSettings(this.settings,Pe.MATERIAL)}updateLuts(){this.volumeRendering.updateActiveChannels(this.fusion,this.volume.channels),this.volumeRendering.updateSettings(this.settings,Pe.MATERIAL)}setVoxelSize(e){this.volume.setVoxelSize(e),this.updateScale()}cleanup(){this.meshVolume.cleanup(),this.volumeRendering.cleanup()}getChannel(e){return this.volume.getChannel(e)}onChannelLoaded(e){var t;for(let n=0;n<e.length;++n){const s=e[n],r=this.channelOptions[s];if(this.setChannelOptions(s,r),r.isosurfaceEnabled){this.meshVolume.destroyIsosurface(s);const{isovalue:a,isosurfaceOpacity:c}=r;this.meshVolume.createIsosurface(s,this.channelColors[s],a,c)}}(t=this.onChannelDataReadyCallback)==null||t.call(this)}onChannelAdded(e){this.channelColors[e]=this.volume.channelColorsDefault[e],this.fusion[e]={chIndex:e,lut:new Uint8Array[wn],rgbColor:[this.channelColors[e][0],this.channelColors[e][1],this.channelColors[e][2]]},this.settings.diffuse[e]=[this.channelColors[e][0],this.channelColors[e][1],this.channelColors[e][2]],this.settings.specular[e]=[0,0,0],this.settings.emissive[e]=[0,0,0],this.settings.glossiness[e]=0}saveChannelIsosurface(e,t){this.meshVolume.saveChannelIsosurface(e,t,this.volume.name)}setVolumeChannelEnabled(e,t){this.fusion[e].rgbColor=t?this.channelColors[e]:0,this.settings.visible=!this.fusion.every(n=>n.rgbColor===0),this.volumeRendering.updateSettings(this.settings,Pe.VIEW),this.updateChannelDataRequired(e)}isVolumeChannelEnabled(e){return this.fusion[e].rgbColor!==0}updateChannelColor(e,t){this.channelColors[e]&&(this.channelColors[e]=t,this.settings.diffuse[e]=t,this.fusion[e].rgbColor!==0&&(this.fusion[e].rgbColor=t),this.meshVolume.updateMeshColors(this.channelColors))}updateMeshColors(){this.meshVolume.updateMeshColors(this.channelColors)}getChannelColor(e){return this.channelColors[e]}updateChannelMaterial(e,t,n,s,r){this.channelColors[e]&&(this.updateChannelColor(e,t),this.settings.diffuse[e]=t,this.settings.specular[e]=n,this.settings.emissive[e]=s,this.settings.glossiness[e]=r)}setDensity(e){this.settings.density=e,this.volumeRendering.updateSettings(this.settings,Pe.MATERIAL)}getDensity(){return this.settings.density}setBrightness(e){this.settings.brightness=e,this.volumeRendering.updateSettings(this.settings,Pe.CAMERA)}getBrightness(){return this.settings.brightness}setChannelAsMask(e){!this.volume.channels[e]||!this.volume.channels[e].loaded||(this.settings.maskChannelIndex=e,this.updateChannelDataRequired(e),this.volumeRendering.updateSettings(this.settings,Pe.MASK_DATA))}setMaskAlpha(e){this.settings.maskAlpha=e,this.volumeRendering.updateSettings(this.settings,Pe.MASK_ALPHA)}setShowBoundingBox(e){this.settings.showBoundingBox=e,this.volumeRendering.updateSettings(this.settings,Pe.BOUNDING_BOX)}setBoundingBoxColor(e){this.settings.boundingBoxColor=e,this.volumeRendering.updateSettings(this.settings,Pe.BOUNDING_BOX)}getIntensity(e,t,n,s){return this.volume.getIntensity(e,t,n,s)}onStartControls(){this.renderMode===Ze.PATHTRACE&&this.volumeRendering.onStartControls()}onChangeControls(){this.renderMode===Ze.PATHTRACE&&this.volumeRendering.onChangeControls()}onEndControls(){this.renderMode===Ze.PATHTRACE&&this.volumeRendering.onEndControls()}onResetCamera(){this.volumeRendering.viewpointMoved()}onCameraChanged(e,t,n){this.renderMode===Ze.PATHTRACE&&this.volumeRendering.updateCamera(e,t,n)}updateClipRegion(e,t,n,s,r,a){this.settings.bounds.bmin=new I(e-.5,n-.5,r-.5),this.settings.bounds.bmax=new I(t-.5,s-.5,a-.5),this.meshVolume.updateClipRegion(e,t,n,s,r,a),this.volumeRendering.updateSettings(this.settings,Pe.ROI)}updateLights(e){this.renderMode===Ze.PATHTRACE&&this.volumeRendering.updateLights(e)}setPixelSamplingRate(e){this.settings.pixelSamplingRate=e,this.volumeRendering.updateSettings(this.settings,Pe.SAMPLING)}setVolumeRendering(e){if(!(e===Ze.PATHTRACE&&this.renderMode===Ze.PATHTRACE)){switch((this.renderMode===Ze.SLICE||this.renderMode===Ze.RAYMARCH)&&this.sceneRoot.remove(this.meshVolume.get3dObject()),this.sceneRoot.remove(this.volumeRendering.get3dObject()),this.volumeRendering.cleanup(),e){case Ze.PATHTRACE:this.volumeRendering=new Vd(this.volume,this.settings),this.volume.updateRequiredData({subregion:new fn(new I(0,0,0),new I(1,1,1))}),this.volumeRendering.setRenderUpdateListener(this.renderUpdateListener);break;case Ze.SLICE:this.volumeRendering=new xS(this.volume,this.settings);break;case Ze.RAYMARCH:default:this.volumeRendering=new kd(this.volume,this.settings),this.volume.updateRequiredData({subregion:new fn(new I(0,0,0),new I(1,1,1))});break}(e===Ze.RAYMARCH||e===Ze.SLICE)&&(this.renderUpdateListener&&this.renderUpdateListener(0),this.sceneRoot.add(this.meshVolume.get3dObject())),this.sceneRoot.add(this.volumeRendering.get3dObject()),this.renderMode=e,this.fuse()}}setTranslation(e){this.settings.translation.copy(e),this.meshVolume.setTranslation(this.settings.translation),this.volumeRendering.updateSettings(this.settings,Pe.TRANSFORM)}setRotation(e){this.settings.rotation.copy(e),this.meshVolume.setRotation(this.settings.rotation),this.volumeRendering.updateSettings(this.settings,Pe.TRANSFORM)}setScale(e){this.settings.scale.copy(e),this.updateScale()}setupGui(e){e.addInput(this.settings,"translation").on("change",({value:s})=>this.setTranslation(s)),e.addInput(this.settings,"rotation").on("change",({value:s})=>this.setRotation(s));const t=e.addFolder({title:"Multiscale loading"});t.addInput(this.volume.loadSpecRequired,"maxAtlasEdge").on("change",({value:s})=>this.volume.updateRequiredData({maxAtlasEdge:s})),t.addInput(this.volume.loadSpecRequired,"useExplicitLevel").on("change",({value:s})=>this.volume.updateRequiredData({useExplicitLevel:s})),t.addInput(this.volume.loadSpecRequired,"scaleLevelBias").on("change",({value:s})=>this.volume.updateRequiredData({scaleLevelBias:s})),t.addInput(this.volume.loadSpecRequired,"multiscaleLevel").on("change",({value:s})=>this.volume.updateRequiredData({multiscaleLevel:s}));const n=e.addFolder({title:"Pathtrace",expanded:!1});n.addInput(this.settings,"primaryRayStepSize",{min:1,max:100}).on("change",({value:s})=>this.setRayStepSizes(s)),n.addInput(this.settings,"secondaryRayStepSize",{min:1,max:100}).on("change",({value:s})=>this.setRayStepSizes(void 0,s))}setZSlice(e){const t=this.volume.imageInfo.volumeSize.z;return this.settings.zSlice!==e&&e<t&&e>=0?(this.settings.zSlice=e,this.volumeRendering.updateSettings(this.settings,Pe.ROI),!0):!1}get showBoundingBox(){return this.settings.showBoundingBox}}const Hp=Ze.RAYMARCH,Wp=Ze.PATHTRACE,Nl={numChunksToPrefetchAhead:5,prefetchAlongNonPlayingAxis:!1,throttleArrivingChannelData:!0};class yS{constructor(e){this.handleKeydown=n=>{n.code==="Digit1"&&n.altKey&&n.ctrlKey&&(this.tweakpane?(this.tweakpane.dispose(),this.tweakpane=null):this.tweakpane=this.setupGui(this.canvas3d.containerdiv))};const t=(e==null?void 0:e.useWebGL2)===void 0?!0:e.useWebGL2;this.canvas3d=new hw(e==null?void 0:e.parentElement,t),this.redraw=this.redraw.bind(this),this.scene=new ns,this.backgroundColor=new Ke(0),this.lights=[],this.pixelSamplingRate=.75,this.exposure=.5,this.volumeRenderMode=Ze.RAYMARCH,window.addEventListener("resize",()=>this.resize(null)),this.lightContainer=new Et,this.ambientLight=new ju,this.spotLight=new qu,this.reflectedLight=new yo,this.fillLight=new yo,this.buildScene(),this.tweakpane=null,window.addEventListener("keydown",this.handleKeydown)}preRender(){const e=this.scene.getObjectByName("lightContainer");if(e&&e.rotation.setFromRotationMatrix(this.canvas3d.camera.matrixWorld),this.image&&On(this.canvas3d.camera)){const{top:t,zoom:n}=this.canvas3d.camera;this.image.setOrthoScale(Math.abs(t)/n),this.updateOrthoScaleBar(this.image.volume)}}updateOrthoScaleBar(e){this.canvas3d.updateOrthoScaleBar(e.physicalScale,e.imageInfo.spatialUnit)}updatePerspectiveScaleBar(e){this.canvas3d.updatePerspectiveScaleBar(e.tickMarkPhysicalLength,e.imageInfo.spatialUnit)}updateTimestepIndicator(e){const{times:t,timeScale:n,timeUnit:s}=e.imageInfo,r=e.loadSpec.time;this.canvas3d.updateTimestepIndicator(r*n,t*n,s)}capture(e){return this.canvas3d.requestCapture(e)}getDOMElement(){return this.canvas3d.containerdiv}getCameraState(){return this.canvas3d.getCameraState()}setCameraState(e){this.canvas3d.setCameraState(e),this.redraw()}redraw(){this.canvas3d.redraw()}unsetImage(){return this.image&&(this.canvas3d.removeControlHandlers(),this.canvas3d.animateFuncs=[],this.scene.remove(this.image.sceneRoot)),this.image}addVolume(e,t){e.addVolumeDataObserver(this),t=t||{},t.renderMode=this.volumeRenderMode,this.setImage(new bS(e,t))}setVolumeChannelOptions(e,t,n){var s;(s=this.image)==null||s.setChannelOptions(t,n),this.redraw()}setVolumeDisplayOptions(e,t){var n;(n=this.image)==null||n.setOptions(t),this.redraw()}removeVolume(e){const t=this.unsetImage();t&&t.cleanup(),e&&e.removeVolumeDataObserver(this)}removeAllVolumes(){this.image&&this.removeVolume(this.image.volume),this.image=void 0}setRenderUpdateListener(e){var t;this.renderUpdateListener=e,(t=this.image)==null||t.setRenderUpdateListener(e)}onVolumeData(e,t){var n,s;(n=this.image)==null||n.updateScale(),(s=this.image)==null||s.onChannelLoaded(t),e.isLoaded()&&this.tweakpane&&this.tweakpane.refresh()}onVolumeChannelAdded(e,t){var n;(n=this.image)==null||n.onChannelAdded(t)}onVolumeLoadError(e,t){var n;(n=this.loadErrorHandler)==null||n.call(this,e,t)}setLoadErrorHandler(e){this.loadErrorHandler=e}setTime(e,t,n){const s=Math.max(0,Math.min(t,e.imageInfo.times-1));e.updateRequiredData({time:s},n),this.updateTimestepIndicator(e)}setScaleLevelBias(e,t){e.updateRequiredData({scaleLevelBias:t})}setVolumeChannelAsMask(e,t){var n;(n=this.image)==null||n.setChannelAsMask(t),this.redraw()}setVoxelSize(e,t,n){this.image&&(this.image.setVoxelSize(new I().fromArray(t)),n&&this.image.volume.setUnitSymbol(n),this.updatePerspectiveScaleBar(this.image.volume)),this.redraw()}setRayStepSizes(e,t,n){var s;(s=this.image)==null||s.setRayStepSizes(t,n),this.redraw()}setShowBoundingBox(e,t){var n;(n=this.image)==null||n.setShowBoundingBox(t),this.canvas3d.setShowPerspectiveScaleBar(t&&this.canvas3d.showOrthoScaleBar&&this.volumeRenderMode!==Ze.PATHTRACE),this.redraw()}setBoundingBoxColor(e,t){var n;(n=this.image)==null||n.setBoundingBoxColor(t),this.canvas3d.setPerspectiveScaleBarColor(t),this.redraw()}setBackgroundColor(e){const t=new Ke().fromArray(e);this.backgroundColor=t,this.canvas3d.setClearColor(t,1),this.redraw()}hasIsosurface(e,t){var n;return((n=this.image)==null?void 0:n.hasIsosurface(t))||!1}saveChannelIsosurface(e,t,n){var s;(s=this.image)==null||s.saveChannelIsosurface(t,n)}setImage(e){const t=this.unsetImage();return this.image=e,this.scene.add(e.sceneRoot),this.image.setResolution(this.canvas3d.getWidth(),this.canvas3d.getHeight()),this.image.setIsOrtho(On(this.canvas3d.camera)),this.image.setBrightness(this.exposure),this.canvas3d.setControlHandlers(this.onStartControls.bind(this),this.onChangeControls.bind(this),this.onEndControls.bind(this)),this.canvas3d.animateFuncs.push(this.preRender.bind(this)),this.canvas3d.animateFuncs.push(e.onAnimate.bind(e)),this.updatePerspectiveScaleBar(e.volume),this.updateTimestepIndicator(e.volume),this.redraw(),t}onStartControls(){var e;this.volumeRenderMode!==Ze.PATHTRACE&&this.canvas3d.startRenderLoop(),(e=this.image)==null||e.onStartControls()}onChangeControls(){var e;(e=this.image)==null||e.onChangeControls()}onEndControls(){var e;(e=this.image)==null||e.onEndControls(),this.volumeRenderMode!==Ze.PATHTRACE&&!this.canvas3d.controls.autoRotate&&this.canvas3d.stopRenderLoop(),this.redraw()}buildScene(){this.scene=this.canvas3d.scene,this.canvas3d.setClearColor(this.backgroundColor,1),this.lights=[new er(pa),new er(da)],this.lightContainer=new Et,this.lightContainer.name="lightContainer",this.ambientLight=new ju(Bt.ambientLightSettings.color,Bt.ambientLightSettings.intensity),this.ambientLight.layers.enable(ks),this.lightContainer.add(this.ambientLight),this.spotLight=new qu(Bt.spotlightSettings.color,Bt.spotlightSettings.intensity),this.spotLight.position.set(Bt.spotlightSettings.position.x,Bt.spotlightSettings.position.y,Bt.spotlightSettings.position.z),this.spotLight.target=new Et,this.spotLight.angle=Bt.spotlightSettings.angle,this.spotLight.layers.enable(ks),this.lightContainer.add(this.spotLight),this.reflectedLight=new yo(Bt.reflectedLightSettings.color),this.reflectedLight.position.set(Bt.reflectedLightSettings.position.x,Bt.reflectedLightSettings.position.y,Bt.reflectedLightSettings.position.z),this.reflectedLight.castShadow=Bt.reflectedLightSettings.castShadow,this.reflectedLight.intensity=Bt.reflectedLightSettings.intensity,this.reflectedLight.layers.enable(ks),this.lightContainer.add(this.reflectedLight),this.fillLight=new yo(Bt.fillLightSettings.color),this.fillLight.position.set(Bt.fillLightSettings.position.x,Bt.fillLightSettings.position.y,Bt.fillLightSettings.position.z),this.fillLight.castShadow=Bt.fillLightSettings.castShadow,this.fillLight.intensity=Bt.fillLightSettings.intensity,this.fillLight.layers.enable(ks),this.lightContainer.add(this.fillLight),this.scene.add(this.lightContainer)}setCameraMode(e){var t,n;this.canvas3d.switchViewMode(e),(t=this.image)==null||t.setViewMode(e,this.volumeRenderMode),(n=this.image)==null||n.setIsOrtho(e!=="3D"),this.canvas3d.redraw()}setZSlice(e,t){var n;return(n=this.image)!=null&&n.setZSlice(t)?(this.canvas3d.redraw(),!0):!1}setShowAxis(e){this.canvas3d.showAxis=e,this.canvas3d.redraw()}setShowScaleBar(e){var t;this.canvas3d.setShowOrthoScaleBar(e),this.canvas3d.setShowPerspectiveScaleBar(e&&!!((t=this.image)!=null&&t.showBoundingBox)&&this.volumeRenderMode!==Ze.PATHTRACE)}setShowTimestepIndicator(e){var s;const t=(s=this.image)==null?void 0:s.volume.imageInfo.times,n=!!t&&t>1;this.canvas3d.setShowTimestepIndicator(e&&n)}setAxisPosition(e,t,n=Wo.BOTTOM_LEFT){this.canvas3d.setAxisPosition(e,t,n),this.canvas3d.showAxis&&this.canvas3d.redraw()}setScaleBarPosition(e,t,n=Wo.BOTTOM_RIGHT){this.canvas3d.setIndicatorPosition(!1,e,t,n)}setTimestepIndicatorPosition(e,t,n=Wo.BOTTOM_RIGHT){this.canvas3d.setIndicatorPosition(!0,e,t,n)}setAutoRotate(e){this.canvas3d.setAutoRotate(e),e?this.onStartControls():this.onEndControls()}setScaleUnit(e){this.image&&(this.image.volume.setUnitSymbol(e),this.updatePerspectiveScaleBar(this.image.volume),On(this.canvas3d.camera)&&this.updateOrthoScaleBar(this.image.volume))}setFlipVolume(e,t,n,s){var r;(r=this.image)==null||r.setFlipAxes(t,n,s),this.redraw()}setInterpolationEnabled(e,t){var n;(n=this.image)==null||n.setInterpolationEnabled(t),this.redraw()}resize(e,t,n,s,r,a){var c;this.canvas3d.resize(e,t,n,s,r,a),(c=this.image)==null||c.setResolution(this.canvas3d.getWidth(),this.canvas3d.getHeight()),this.redraw()}updateDensity(e,t){var n;(n=this.image)==null||n.setDensity(t),this.redraw()}updateShadingMethod(e,t){var n;(n=this.image)==null||n.updateShadingMethod(t)}setGamma(e,t,n,s){var r;(r=this.image)==null||r.setGamma(t,n,s),this.redraw()}setMaxProjectMode(e,t){var n;(n=this.image)==null||n.setMaxProjectMode(t),this.redraw()}updateActiveChannels(e){var t;(t=this.image)==null||t.fuse(),this.redraw()}updateLuts(e){var t;(t=this.image)==null||t.updateLuts(),this.redraw()}updateMaterial(e){var t;(t=this.image)==null||t.updateMaterial(),this.redraw()}updateExposure(e){var t;this.exposure=e,(t=this.image)==null||t.setBrightness(e),this.redraw()}updateCamera(e,t,n){var s;this.canvas3d.updateCameraFocus(e,t,n),(s=this.image)==null||s.onCameraChanged(e,t,n),this.redraw()}updateClipRegion(e,t,n,s,r,a,c){var u;(u=this.image)==null||u.updateClipRegion(t,n,s,r,a,c),this.redraw()}setAxisClip(e,t,n,s,r){var a;(a=this.image)==null||a.setAxisClip(t,n,s,r),this.redraw()}updateLights(e){var t;this.lights=e,(t=this.image)==null||t.updateLights(e)}updatePixelSamplingRate(e){var t;this.pixelSamplingRate!==e&&(this.pixelSamplingRate=e,(t=this.image)==null||t.setPixelSamplingRate(e))}updateMaskAlpha(e,t){var n;(n=this.image)==null||n.setMaskAlpha(t),this.redraw()}setVolumeChannelEnabled(e,t,n){var s;(s=this.image)==null||s.setChannelOptions(t,{enabled:n}),this.redraw()}updateChannelMaterial(e,t,n,s,r,a){var c;(c=this.image)==null||c.updateChannelMaterial(t,n,s,r,a)}updateChannelColor(e,t,n){var s;(s=this.image)==null||s.updateChannelColor(t,n)}setVolumeRenderMode(e){var t;if(e!==this.volumeRenderMode){if(this.volumeRenderMode=e,this.image){if(this.image.getViewMode()===Pt.Z)return;e===Ze.PATHTRACE&&this.canvas3d.hasWebGL2?(this.image.setVolumeRendering(Ze.PATHTRACE),this.image.updateLights(this.lights),this.canvas3d.startRenderLoop()):e===Ze.RAYMARCH&&(this.image.setVolumeRendering(Ze.RAYMARCH),this.canvas3d.redraw()),this.updatePixelSamplingRate(this.pixelSamplingRate),this.image.setIsOrtho(On(this.canvas3d.camera)),this.image.setResolution(this.canvas3d.getWidth(),this.canvas3d.getHeight()),this.setAutoRotate(this.canvas3d.controls.autoRotate),this.image.setRenderUpdateListener(this.renderUpdateListener)}this.canvas3d.setShowPerspectiveScaleBar(this.canvas3d.showOrthoScaleBar&&!!((t=this.image)!=null&&t.showBoundingBox)&&e!==Ze.PATHTRACE)}}setVolumeTranslation(e,t){var n;(n=this.image)==null||n.setTranslation(new I().fromArray(t)),this.redraw()}setVolumeRotation(e,t){var n;(n=this.image)==null||n.setRotation(new en().fromArray(t)),this.redraw()}setVolumeScale(e,t){var n;(n=this.image)==null||n.setScale(new I().fromArray(t)),this.redraw()}resetCamera(){var e;this.canvas3d.resetCamera(),(e=this.image)==null||e.onResetCamera(),this.redraw()}hasWebGL2(){return this.canvas3d.hasWebGL2}removeEventListeners(){window.removeEventListener("keydown",this.handleKeydown)}setupGui(e){var c;const t=new $y.Pane({title:"Advanced Settings",container:e}),n={position:"absolute",top:"0",right:"0"};Object.assign(t.element.style,n);const s=t.addFolder({title:"Lights (isosurface)"}),r=(u,d)=>{const f=s.addFolder({title:d,expanded:!1});f.addInput(u,"color",{color:{type:"float"}}),f.addInput(u,"intensity",{min:0}),u.isAmbientLight||f.addInput(u,"position")};r(this.spotLight,"spot light"),r(this.ambientLight,"ambient light"),r(this.reflectedLight,"reflected light"),r(this.fillLight,"fill light"),(c=this.image)==null||c.setupGui(t);const a=t.addFolder({title:"Prefetch"});return a.addInput(Nl,"numChunksToPrefetchAhead").on("change",u=>{var d,f,m;(f=(d=this.loaderContext)==null?void 0:d.getActiveLoader())==null||f.updateFetchOptions({maxPrefetchDistance:[u.value,u.value,u.value,u.value]}),(m=this.image)==null||m.volume.updateRequiredData({})}),a.addInput(Nl,"prefetchAlongNonPlayingAxis").on("change",u=>{var d,f;(f=(d=this.loaderContext)==null?void 0:d.getActiveLoader())==null||f.updateFetchOptions({onlyPriorityDirections:!u.value})}),a.addInput(Nl,"throttleArrivingChannelData").on("change",u=>{var d;(d=this.loaderContext)==null||d.setThrottleChannelData(u.value)}),t}}const Gd=256;class ts{constructor(e){this.dataMinBin=0,this.dataMaxBin=0,this.maxBin=0,this.bins=new Uint32Array,this.min=0,this.max=0,this.binSize=0;const t=ts.calculateHistogram(e,Gd);this.bins=t.bins,this.min=t.min,this.max=t.max,this.binSize=t.binSize;for(let s=0;s<this.bins.length;s++)if(this.bins[s]>0){this.dataMinBin=s;break}for(let s=this.bins.length-1;s>=0;s--)if(this.bins[s]>0){this.dataMaxBin=s;break}this.pixelCount=e.length,this.maxBin=1;let n=this.bins[1];for(let s=1;s<this.bins.length;s++)this.bins[s]>n&&(this.maxBin=s,n=this.bins[s])}static findBin(e,t,n,s){let r=Math.floor((e-t)/n);return r===s&&r--,r}findBinOfValue(e){return ts.findBin(e,this.min,this.binSize,Gd)}getDataMin(){return this.min}getDataMax(){return this.max}getMin(){return this.dataMinBin}getMax(){return this.dataMaxBin}getNumBins(){return this.bins.length}getBin(e){return this.bins[e]}getBinRange(e){return[this.min+e*this.binSize,this.min+(e+1)*this.binSize]}findBinOfPercentile(e){const t=this.pixelCount*e;let n=0,s=0;for(n=0;n<this.bins.length&&(s+=this.bins[n],!(s>t));++n);return n}findBestFitBins(){const t=this.pixelCount/10;let n=0,s=0;for(n=1;n<this.bins.length&&(s+=this.bins[n],!(s>t));++n);const r=n;for(s=0,n=this.bins.length-1;n>=1&&(s+=this.bins[n],!(s>t));--n);return[r,n]}findAutoIJBins(){const t=this.pixelCount,n=t/10,s=t/5e3;let r=this.bins.length-1,a=1;for(let c=1;c<this.bins.length;++c)if(this.bins[c]>s&&this.bins[c]<=n){r=c;break}for(let c=this.bins.length-1;c>=1;--c)if(this.bins[c]>s&&this.bins[c]<=n){a=c;break}return a<r&&(r=0,a=255),[r,a]}findAutoMinMax(){const t=Math.floor(this.bins[this.maxBin]*.1);let n=0,s=this.bins.length-1;for(let r=1;r<this.bins.length;++r)if(this.bins[r]>t){n=r;break}for(let r=this.bins.length-1;r>=1;--r)if(this.bins[r]>t){s=r;break}return[n,s]}static calculateHistogram(e,t=1){t<1&&(t=1);let n=e[0],s=e[0];for(let c=1;c<e.length;c++)e[c]<n?n=e[c]:e[c]>s&&(s=e[c]);const r=new Uint32Array(t).fill(0),a=(s-n)/t===0?1:(s-n)/t;for(let c=0;c<e.length;c++){const u=e[c],d=ts.findBin(u,n,a,t);r[d]++}return{bins:r,min:n,max:s,binSize:a}}}class Hd{constructor(e){this.loaded=!1,this.dtype="uint8",this.imgData={data:new Uint8Array,width:0,height:0},this.rawMin=0,this.rawMax=255,this.dataTexture=new Gs(new Uint8Array,0,0),this.lutTexture=new Gs(new Uint8Array(wn),256,1,Xt,Qt),this.lutTexture.minFilter=this.lutTexture.magFilter=zt,this.lutTexture.generateMipmaps=!1,this.volumeData=new Uint8Array,this.name=e,this.histogram=new ts(new Uint8Array),this.dims=[0,0,0],this.lut=new ni().createFromMinMax(0,255),this.colorPalette=new Uint8Array(wn).fill(0),this.colorPaletteAlpha=0}combineLuts(e,t){const n=t||new Uint8Array(wn);if(!e)return n;const s=[e[0]/255,e[1]/255,e[2]/255];if(this.colorPaletteAlpha===1)n.set(this.colorPalette);else if(this.colorPaletteAlpha===0){n.set(this.lut.lut);for(let r=0;r<wn/4;++r)n[r*4+0]*=s[0],n[r*4+1]*=s[1],n[r*4+2]*=s[2]}else for(let r=0;r<wn/4;++r)n[r*4+0]=this.colorPalette[r*4+0]*this.colorPaletteAlpha+this.lut.lut[r*4+0]*(1-this.colorPaletteAlpha)*s[0],n[r*4+1]=this.colorPalette[r*4+1]*this.colorPaletteAlpha+this.lut.lut[r*4+1]*(1-this.colorPaletteAlpha)*s[1],n[r*4+2]=this.colorPalette[r*4+2]*this.colorPaletteAlpha+this.lut.lut[r*4+2]*(1-this.colorPaletteAlpha)*s[2],n[r*4+3]=this.colorPalette[r*4+3]*this.colorPaletteAlpha+this.lut.lut[r*4+3]*(1-this.colorPaletteAlpha);return this.lutTexture.image.data.set(n),this.lutTexture.needsUpdate=!0,n}setRawDataRange(e,t){!(this.rawMin===0&&this.rawMax===0)&&!(e===0&&t===0)&&(this.lut.remapDomains(this.rawMin,this.rawMax,e,t),this.rawMin=e,this.rawMax=t)}getHistogram(){return this.histogram}getIntensity(e,t,n){return this.volumeData[e+t*this.dims[0]+n*(this.dims[0]*this.dims[1])]}normalizeRaw(e){return(e-this.rawMin)/(this.rawMax-this.rawMin)}getIntensityFromAtlas(e,t,n){const s=this.imgData.width/this.dims[0],r=n%s,a=Math.floor(n/s),c=r*this.dims[0]+e+(a*this.dims[1]+t)*this.imgData.width;return this.imgData.data[c]}rebuildDataTexture(e,t,n){this.dataTexture&&this.dataTexture.dispose();let s=zc,r=Qt,a="LUMINANCE";switch(this.dtype){case"uint8":r=Qt,s=ii,a="R8UI";break;case"int8":r=Oc,s=ii,a="R8I";break;case"uint16":r=js,s=ii,a="R16UI";break;case"int16":r=Fc,s=ii,a="R16I";break;case"uint32":r=Di,s=ii,a="R32UI";break;case"int32":r=aa,s=ii,a="R32I";break;case"float32":r=Tn,s=la,a="R32F";break;default:console.warn("unsupported dtype for channel data",this.dtype);break}this.dataTexture=new Gs(e,t,n,s,r,Nc,dn,dn,It,It),this.dataTexture.internalFormat=a,this.dataTexture.needsUpdate=!0}setFromAtlas(e,t,n,s,r,a,c){this.dtype=s,this.imgData={data:e,width:t,height:n},this.rebuildDataTexture(this.imgData.data,t,n),this.loaded=!0,this.histogram=new ts(e),this.setRawDataRange(r,a),this.unpackFromAtlas(c.x,c.y,c.z)}unpackFromAtlas(e,t,n){const s=this.imgData.data;this.dims=[e,t,n];const r=Sd[this.dtype];this.volumeData=new r(e*t*n);const a=this.imgData.width/e,c=this.imgData.width;let u=0,d=0,f=0,m=0,v=0;for(let g=0;g<n;++g){u=g%a,d=Math.floor(g/a),f=u*e+d*t*c;for(let b=0;b<t;++b)m=b*c,v=g*(e*t)+b*e,this.volumeData.set(s.subarray(f+m,f+m+e),v)}}setFromVolumeData(e,t,n,s,r,a,c,u,d){this.dims=[t,n,s],this.volumeData=e,this.dtype=d,this.packToAtlas(t,n,s,r,a),this.loaded=!0,this.setRawDataRange(c,u),this.histogram=new ts(this.volumeData)}packToAtlas(e,t,n,s,r){(s%e!==0||r%t!==0||s/e*(r/t)<n)&&(console.log("ERROR - atlas and volume dims are inconsistent"),console.log(s,r,e,t,n));const a=Sd[this.dtype];this.imgData={width:s,height:r,data:new a(s*r)},this.imgData.data.fill(0);const c=this.imgData.data,u=e,d=t,f=n,m=this.imgData.width/u,v=this.imgData.width;let g=0,b=0,y=0,x=0,_=0;for(let w=0;w<f;++w){g=w%m,b=Math.floor(w/m),y=g*u+b*d*v;for(let E=0;E<d;++E)x=E*v,_=w*(u*d)+E*u,c.set(this.volumeData.subarray(_,_+u),y+x)}this.rebuildDataTexture(this.imgData.data,s,r)}setLut(e){this.lut=e}setColorPalette(e){this.colorPalette=e}setColorPaletteAlpha(e){this.colorPaletteAlpha=e}}function Wd(i){return new I(i.shape[4],i.shape[3],i.shape[2])}function wS(i){return new I(i.spacing[4],i.spacing[3],i.spacing[2])}function Xp(){return{name:"",atlasTileDims:[1,1],subregionSize:[1,1,1],subregionOffset:[0,0,0],combinedNumChannels:1,channelNames:["0"],channelColors:[[255,255,255]],multiscaleLevel:0,multiscaleLevelDims:[{shape:[1,1,1,1,1],spacing:[1,1,1,1,1],spaceUnit:"",timeUnit:"",dataType:"uint8"}],transform:{translation:[0,0,0],rotation:[0,0,0],scale:[1,1,1]}}}class fa{constructor(e){this.imageInfo=e||Xp()}get currentLevelDims(){return this.imageInfo.multiscaleLevelDims[this.imageInfo.multiscaleLevel]}get numChannels(){return this.imageInfo.combinedNumChannels}get originalSize(){return Wd(this.imageInfo.multiscaleLevelDims[0])}get volumeSize(){return Wd(this.currentLevelDims)}get physicalPixelSize(){return wS(this.imageInfo.multiscaleLevelDims[0])}get spatialUnit(){return this.imageInfo.multiscaleLevelDims[0].spaceUnit}get times(){return this.currentLevelDims.shape[0]}get timeScale(){return this.currentLevelDims.spacing[0]}get timeUnit(){return this.currentLevelDims.timeUnit}get numMultiscaleLevels(){return this.imageInfo.multiscaleLevelDims.length}get channelNames(){return this.imageInfo.channelNames}get channelColors(){return this.imageInfo.channelColors}get subregionSize(){return new I(...this.imageInfo.subregionSize)}get subregionOffset(){return new I(...this.imageInfo.subregionOffset)}get multiscaleLevel(){return this.imageInfo.multiscaleLevel}get atlasTileDims(){return new Ue(...this.imageInfo.atlasTileDims)}get transform(){return{translation:new I(...this.imageInfo.transform.translation),rotation:new I(...this.imageInfo.transform.rotation),scale:new I(...this.imageInfo.transform.scale)}}}function Yp(i){const{atlasTileDims:e}=i,t=i.multiscaleLevelDims[i.multiscaleLevel];return[e[0]*t.shape[4],e[1]*t.shape[3]]}const Ur=4096;function Ac(i,e,t){let n=1,s=i,r=s*e/(n*t),a=n,c=s;for(;r>1;)a=n,c=s,s-=1,n=Math.ceil(i/s),r=s*e/(n*t);return new Ue(a,c)}function qp(i,e=Ur){const t=i[2],n=i[1],s=i[0],r=Math.floor(e/t),a=Math.floor(e/n);return r*a>=s}function SS(i,e=Ur){if(i.length<=1)return 0;for(let t=0;t<i.length;++t)if(qp(i[t],e))return t}function MS(i,e){if(i.useExplicitLevel&&i.multiscaleLevel!==void 0)return Math.max(0,Math.min(e.length-1,i.multiscaleLevel));let t=SS(e,i.maxAtlasEdge);if(t!==void 0&&(t=Math.max(t+(i.scaleLevelBias??0),i.multiscaleLevel??0),t=Math.max(0,Math.min(e.length-1,t)),qp(e[t],i.maxAtlasEdge)))return t;t===void 0&&(t=e.length-1);const n=e[t];return console.error(`Volume is too large; no multiscale level found that fits in preferred memory footprint. Selected level ${t}  has dimensions `,n,`. Max atlas edge allowed is ${i.maxAtlasEdge}.`),console.log("All available levels: ",e),t}function ES(i){for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e))return!1;return!0}function AS(i){const e=new fa(i),t=e.volumeSize.clone().multiply(e.physicalPixelSize),n={};return n.Dimensions={...e.subregionSize},n["Original dimensions"]={...e.originalSize},n["Physical size"]={x:t.x+e.spatialUnit,y:t.y+e.spatialUnit,z:t.z+e.spatialUnit},n["Physical size per pixel"]={x:e.physicalPixelSize.x+e.spatialUnit,y:e.physicalPixelSize.y+e.spatialUnit,z:e.physicalPixelSize.z+e.spatialUnit},n["Multiresolution levels"]=i.multiscaleLevelDims,n.Channels=i.combinedNumChannels,n["Time series frames"]=e.times||1,i.userData&&!ES(i.userData)&&(n["User data"]=i.userData),n}class ma{constructor(){this.time=0,this.subregion=new fn(new I(0,0,0),new I(1,1,1)),this.useExplicitLevel=!1}}class kr{setPrefetchPriority(e){}syncMultichannelLoading(e){}updateFetchOptions(e){}async createVolume(e,t){const{imageInfo:n,loadSpec:s}=await this.createImageInfo(e),r=new jp(n,s,this);return r.channelLoadCallback=t,r.imageMetadata=AS(n),r}async loadVolumeData(e,t,n){const s=(c,u)=>{c&&(e.imageInfo=new fa(c),e.updateDimensions()),e.loadSpec={...u,...a}},r=(c,u,d,f,m)=>{for(let v=0;v<c.length;v++){const g=c[v],b=u[v],y=d[v],x=f[v];m?e.setChannelDataFromAtlas(g,y,m[0],m[1],x,b):e.setChannelDataFromVolume(g,y,x,b),n==null||n(e,g)}},a={...e.loadSpec,...t};return this.loadRawChannelData(e.imageInfo.imageInfo,a,s,r)}}class jp{constructor(e=Xp(),t=new ma,n){if(this.loaded=!1,this.imageInfo=new fa(e),this.name=e.name,this.loadSpec={multiscaleLevel:0,scaleLevelBias:0,maxAtlasEdge:Ur,channels:Array.from({length:this.imageInfo.numChannels},(s,r)=>r),...t},this.loadSpecRequired={...this.loadSpec,channels:this.loadSpec.channels.slice(),subregion:this.loadSpec.subregion.clone()},this.loader=n,this.imageMetadata={},this.normRegionSize=new I(1,1,1),this.normRegionOffset=new I(0,0,0),this.physicalSize=new I(1,1,1),this.physicalScale=1,this.normPhysicalSize=new I(1,1,1),this.physicalPixelSize=this.imageInfo.physicalPixelSize,this.tickMarkPhysicalLength=1,this.setVoxelSize(this.physicalPixelSize),this.numChannels=this.imageInfo.numChannels,this.channelNames=this.imageInfo.channelNames.slice(),this.channelColorsDefault=this.imageInfo.channelColors?this.imageInfo.channelColors.slice():this.channelNames.map((s,r)=>Xo(r)),this.channelColorsDefault.length<this.imageInfo.numChannels)for(let s=this.channelColorsDefault.length-1;s<this.imageInfo.numChannels;++s)this.channelColorsDefault[s]=Xo(s);this.channels=[];for(let s=0;s<this.imageInfo.numChannels;++s){const r=new Hd(this.channelNames[s]);this.channels.push(r),r.dims=this.imageInfo.subregionSize.toArray()}this.physicalUnitSymbol=this.imageInfo.spatialUnit,this.volumeDataObservers=[]}setUnloaded(){this.loaded=!1,this.channels.forEach(e=>{e.loaded=!1})}isLoaded(){return this.loaded}updateDimensions(){const{volumeSize:e,subregionSize:t,subregionOffset:n}=this.imageInfo;this.setVoxelSize(this.physicalPixelSize),this.normRegionSize=t.clone().divide(e),this.normRegionOffset=n.clone().divide(e)}mustLoadNewData(){return this.loadSpec.useExplicitLevel!==this.loadSpecRequired.useExplicitLevel||this.loadSpec.time!==this.loadSpecRequired.time||!this.loadSpec.subregion.containsBox(this.loadSpecRequired.subregion)||this.loadSpecRequired.channels.some(e=>!this.loadSpec.channels.includes(e))}mayLoadNewScaleLevel(){return!this.loadSpec.subregion.equals(this.loadSpecRequired.subregion)||this.loadSpecRequired.maxAtlasEdge!==this.loadSpec.maxAtlasEdge||this.loadSpecRequired.multiscaleLevel!==this.loadSpec.multiscaleLevel||this.loadSpecRequired.scaleLevelBias!==this.loadSpec.scaleLevelBias}async updateRequiredData(e,t){this.loadSpecRequired={...this.loadSpecRequired,...e};let n=this.mustLoadNewData();if(!n&&this.mayLoadNewScaleLevel()){const s=await this.loadScaleLevelDims();if(s){const r=s.map(({shape:c})=>[c[2],c[3],c[4]]),a=MS(this.loadSpecRequired,r);n=this.imageInfo.multiscaleLevel!==a}}n&&this.loadNewData(t)}async loadScaleLevelDims(){var e;try{return await((e=this.loader)==null?void 0:e.loadDims(this.loadSpecRequired))}catch(t){this.volumeDataObservers.forEach(n=>n.onVolumeLoadError(this,t));return}}async loadNewData(e){var t;this.setUnloaded(),this.loadSpec={...this.loadSpecRequired,subregion:this.loadSpecRequired.subregion.clone()};try{await((t=this.loader)==null?void 0:t.loadVolumeData(this,void 0,e))}catch(n){throw this.volumeDataObservers.forEach(s=>s.onVolumeLoadError(this,n)),n}}setVoxelSize(e){e.x=e.x>0?e.x:1,e.y=e.y>0?e.y:1,e.z=e.z>0?e.z:1,this.physicalPixelSize=e,this.physicalSize=this.imageInfo.originalSize.clone().multiply(this.physicalPixelSize),this.physicalScale=Math.max(this.physicalSize.x,this.physicalSize.y,this.physicalSize.z),this.normPhysicalSize=this.physicalSize.clone().divideScalar(this.physicalScale),this.tickMarkPhysicalLength=10**Math.floor(Math.log10(this.physicalScale/2))}setUnitSymbol(e){this.physicalUnitSymbol=e}getContentCenter(){return this.normRegionSize.clone().divideScalar(2).add(this.normRegionOffset).subScalar(.5).multiply(this.normPhysicalSize)}cleanup(){}getChannel(e){return this.channels[e]}onChannelLoaded(e){this.loadSpec.channels.every(t=>this.channels[t].loaded)&&(this.loaded=!0),e.forEach(t=>{var n;return(n=this.channelLoadCallback)==null?void 0:n.call(this,this,t)}),this.volumeDataObservers.forEach(t=>t.onVolumeData(this,e))}setChannelDataFromAtlas(e,t,n,s,r,a="uint8"){this.channels[e].setFromAtlas(t,n,s,a,r[0],r[1],this.imageInfo.subregionSize),this.onChannelLoaded([e])}setChannelDataFromVolume(e,t,n,s="uint8"){const{subregionSize:r,atlasTileDims:a}=this.imageInfo;this.channels[e].setFromVolumeData(t,r.x,r.y,r.z,a.x*r.x,a.y*r.y,n[0],n[1],s),this.onChannelLoaded([e])}appendEmptyChannel(e,t){const n=this.imageInfo.numChannels,s=e||"channel_"+n,r=t||Xo(n);this.numChannels+=1,this.channelNames.push(s),this.channelColorsDefault.push(r),this.channels.push(new Hd(s));for(let a=0;a<this.volumeDataObservers.length;++a)this.volumeDataObservers[a].onVolumeChannelAdded(this,n);return n}getIntensity(e,t,n,s){return this.channels[e].getIntensity(t,n,s)}getHistogram(e){return this.channels[e].getHistogram()}setLut(e,t){this.channels[e].setLut(t)}setColorPalette(e,t){this.channels[e].setColorPalette(t)}setColorPaletteAlpha(e,t){this.channels[e].setColorPaletteAlpha(t)}getRotation(){return this.imageInfo.transform.rotation.toArray()}getTranslation(){return this.voxelsToWorldSpace(this.imageInfo.transform.translation.toArray())}voxelsToWorldSpace(e){const t=1/Math.max(this.physicalSize.x,Math.max(this.physicalSize.y,this.physicalSize.z));return new I().fromArray(e).multiply(this.physicalPixelSize).multiplyScalar(t).toArray()}addVolumeDataObserver(e){this.volumeDataObservers.push(e)}removeVolumeDataObserver(e){if(e){const t=this.volumeDataObservers.indexOf(e);t!==-1&&this.volumeDataObservers.splice(t,1)}}removeAllVolumeDataObservers(){this.volumeDataObservers=[]}}class Ti{static createVolume(e,t,n,s){const r=new Uint8Array(e*t*n).fill(0),a=e/2,c=t/2,u=n/2;let d,f,m,v;for(let g=0;g<n;++g)for(let b=0;b<t;++b)for(let y=0;y<e;++y)d=g*(e*t)+b*e+y,f=y-a,m=b-c,v=g-u,s(f,m,v)<0?r[d]=255:r[d]=0;return r}static createSphere(e,t,n,s){return Ti.createVolume(e,t,n,(r,a,c)=>Math.sqrt(r*r+a*a+c*c)-s)}static createCylinder(e,t,n,s,r){let a,c,u,d;return Ti.createVolume(e,t,n,(f,m,v)=>(a=Math.abs(Math.sqrt(f*f+v*v))-s,c=Math.abs(m)-r,u=Math.max(a,0),d=Math.max(c,0),Math.min(Math.max(a,c),0)+Math.sqrt(u*u+d*d)))}static createTorus(e,t,n,s,r){let a,c;return Ti.createVolume(e,t,n,(u,d,f)=>(a=Math.sqrt(u*u+f*f)-s,c=d,Math.sqrt(a*a+c*c)-r))}static createCone(e,t,n,s,r){let a;return Ti.createVolume(e,t,n,(c,u,d)=>(a=Math.sqrt(c*c+u*u),s*a+r*d))}}class CS extends Error{constructor(e){super(e),this.name="NodeNotFoundError"}}class TS extends Error{constructor(e){super(e),this.name="KeyError"}}const RS="modulepreload",PS=function(i){return"/"+i},Xd={},os=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),c=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=Promise.allSettled(t.map(u=>{if(u=PS(u),u in Xd)return;Xd[u]=!0;const d=u.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${f}`))return;const m=document.createElement("link");if(m.rel=d?"stylesheet":RS,d||(m.as="script"),m.crossOrigin="",m.href=u,c&&m.setAttribute("nonce",c),document.head.appendChild(m),d)return new Promise((v,g)=>{m.addEventListener("load",v),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(a){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=a,window.dispatchEvent(c),!c.defaultPrevented)throw a}return s.then(a=>{for(const c of a||[])c.status==="rejected"&&r(c.reason);return e().catch(r)})},LS=[EvalError,RangeError,ReferenceError,SyntaxError,TypeError,URIError,globalThis.DOMException,globalThis.AssertionError,globalThis.SystemError].filter(Boolean).map(i=>[i.name,i]),ga=new Map(LS);class th extends Error{constructor(t){super(th._prepareSuperMessage(t));mu(this,"name","NonError")}static _prepareSuperMessage(t){try{return JSON.stringify(t)}catch{return String(t)}}}const IS=[{property:"name",enumerable:!1},{property:"message",enumerable:!1},{property:"stack",enumerable:!1},{property:"code",enumerable:!0},{property:"cause",enumerable:!1}],Cc=new WeakSet,DS=i=>{Cc.add(i);const e=i.toJSON();return Cc.delete(i),e},$p=i=>ga.get(i)??Error,Kp=({from:i,seen:e,to:t,forceEnumerable:n,maxDepth:s,depth:r,useToJSON:a,serialize:c})=>{if(!t)if(Array.isArray(i))t=[];else if(!c&&Yd(i)){const d=$p(i.name);t=new d}else t={};if(e.push(i),r>=s)return t;if(a&&typeof i.toJSON=="function"&&!Cc.has(i))return DS(i);const u=d=>Kp({from:d,seen:[...e],forceEnumerable:n,maxDepth:s,depth:r,useToJSON:a,serialize:c});for(const[d,f]of Object.entries(i)){if(f&&f instanceof Uint8Array&&f.constructor.name==="Buffer"){t[d]="[object Buffer]";continue}if(f!==null&&typeof f=="object"&&typeof f.pipe=="function"){t[d]="[object Stream]";continue}if(typeof f!="function"){if(!f||typeof f!="object"){try{t[d]=f}catch{}continue}if(!e.includes(i[d])){r++,t[d]=u(i[d]);continue}t[d]="[Circular]"}}for(const{property:d,enumerable:f}of IS)typeof i[d]<"u"&&i[d]!==null&&Object.defineProperty(t,d,{value:Yd(i[d])?u(i[d]):i[d],enumerable:n?!0:f,configurable:!0,writable:!0});return t};function Zp(i,e={}){const{maxDepth:t=Number.POSITIVE_INFINITY}=e;if(i instanceof Error)return i;if(US(i)){const n=$p(i.name);return Kp({from:i,seen:[],to:new n,maxDepth:t,depth:0,serialize:!1})}return new th(i)}function Yd(i){return!!i&&typeof i=="object"&&"name"in i&&"message"in i&&"stack"in i}function US(i){return!!i&&typeof i=="object"&&"message"in i&&!Array.isArray(i)}var Nr=(i=>(i.UNKNOWN="unknown",i.NOT_FOUND="not_found",i.TOO_LARGE="too_large",i.LOAD_DATA_FAILED="load_data_failed",i.INVALID_METADATA="invalid_metadata",i.INVALID_MULTI_SOURCE_ZARR="invalid_multi_source_zarr",i))(Nr||{});class Or extends Error{constructor(e,t){super(e,t),this.name="VolumeLoadError",this.type=(t==null?void 0:t.type)??"unknown"}}ga.set("NodeNotFoundError",CS);ga.set("KeyError",TS);ga.set("VolumeLoadError",Or);function qd(i="Unknown error occurred while loading volume data",e="unknown",t){return n=>{throw n instanceof Or?n:(console.log(`Error loading volume data: ${n}`),new Or(i,{type:e,cause:n}))}}const Jp=i=>{const e=i.pixel_size_x*i.width/i.tile_width,t=i.pixel_size_y*i.height/i.tile_height,n=i.pixel_size_z;return[e,t,n]},NS=i=>{var r,a;const[e,t,n]=Jp(i),s=((r=i.transform)==null?void 0:r.translation)??[0,0,0];return s[0]=s[0]*i.tile_width/i.width,s[1]=s[1]*i.tile_height/i.height,{name:i.name,atlasTileDims:[i.cols,i.rows],subregionSize:[i.tile_width,i.tile_height,i.tiles],subregionOffset:[0,0,0],combinedNumChannels:i.channels,channelNames:i.channel_names,channelColors:i.channel_colors,multiscaleLevel:0,multiscaleLevelDims:[{shape:[i.times||1,i.channels,i.tiles,i.tile_height,i.tile_width],spacing:[i.time_scale||1,1,n,t,e],spaceUnit:i.pixel_size_unit||"μm",timeUnit:i.time_unit||"s",dataType:"uint8"}],transform:{translation:s,rotation:(a=i.transform)!=null&&a.rotation?i.transform.rotation:[0,0,0],scale:[1,1,1]},userData:{...i.userData,originalVolumeSize:[i.width,i.height,i.tiles],originalPhysicalPixelSize:[i.pixel_size_x,i.pixel_size_y,i.pixel_size_z]}}};class va extends kr{constructor(e,t){super(),this.syncChannels=!1,Array.isArray(e)?this.urls=e:this.urls=[e],this.jsonInfo=new Array(this.urls.length),this.cache=t}async getJsonImageInfo(e){const t=this.jsonInfo[e];if(t)return t;const s=await(await fetch(this.urls[e])).json();return s.pixel_size_unit=s.pixel_size_unit||"μm",s.times=s.times||this.urls.length,this.jsonInfo[e]=s,s}syncMultichannelLoading(e){this.syncChannels=e}async loadDims(e){const t=await this.getJsonImageInfo(e.time),[n,s,r]=Jp(t);return[{shape:[t.times||1,t.channels,t.tiles,t.tile_height,t.tile_width],spacing:[1,1,r,s,n],spaceUnit:t.pixel_size_unit??"μm",dataType:"uint8",timeUnit:t.time_unit??"s"}]}async createImageInfo(e){const t=await this.getJsonImageInfo(e.time);return{imageInfo:NS(t),loadSpec:e}}async loadRawChannelData(e,t,n,s){const r=await this.getJsonImageInfo(t.time);let a=r==null?void 0:r.images;if(!a)return;const c=t.channels;c&&(a=a.filter(({channels:g})=>g.some(b=>c.includes(b))));const u=this.urls[t.time].replace(/[^/]*$/,"");a=a.map(g=>({...g,name:u+g.name}));const d={...t,subregion:new fn(new I(0,0,0),new I(1,1,1)),multiscaleLevel:0,channels:a.flatMap(({channels:g})=>g)};n(void 0,d);const[f,m]=Yp(e),v=(g,b,y,x)=>s(g,b,y,x,[f,m]);await va.loadVolumeAtlasData(a,v,this.cache,this.syncChannels)}static async loadVolumeAtlasData(e,t,n,s=!1){const r=[],a=[],c=[],u=[],d=e.map(async f=>{let m=!0;for(let P=0;P<Math.min(f.channels.length,4);++P){const D=f.channels[P],O=n==null?void 0:n.get(`${f.name}/${D}`);if(O){const U=new Uint8Array(O);s?(r.push(D),a.push("uint8"),c.push(U),u.push(na(U))):t([D],["uint8"],[U],[na(U)])}else{m=!1;break}}if(m)return;const g=await(await fetch(f.name,{mode:"cors"})).blob(),b=await createImageBitmap(g),x=new OffscreenCanvas(b.width,b.height).getContext("2d");if(!x){console.log("Error creating canvas 2d context for "+f.name);return}x.globalCompositeOperation="copy",x.globalAlpha=1,x.drawImage(b,0,0);const _=x.getImageData(0,0,b.width,b.height),w=[],E=b.width*b.height;for(let P=0;P<Math.min(f.channels.length,4);++P)w.push(new Uint8Array(E));const M=[];for(let P=0;P<Math.min(f.channels.length,4);++P){let D=1/0,O=-1/0;for(let U=0;U<E;U++)w[P][U]=_.data[U*4+P],D=Math.min(D,w[P][U]),O=Math.max(O,w[P][U]);M[P]=[D,O]}for(let P=0;P<Math.min(f.channels.length,4);++P){const D=f.channels[P];n==null||n.insert(`${f.name}/${D}`,w[P]),s?(r.push(D),a.push("uint8"),c.push(w[P]),u.push(M[P])):t([D],["uint8"],[w[P]],[M[P]],[b.width,b.height])}});await Promise.all(d),s&&t(r,a,c,u)}}const OS=i=>{const e=Ac(i.sizeZ,i.sizeX,i.sizeY);return{name:i.name,atlasTileDims:[e.x,e.y],subregionSize:[i.sizeX,i.sizeY,i.sizeZ],subregionOffset:[0,0,0],combinedNumChannels:i.sizeC,channelNames:i.channelNames,channelColors:void 0,multiscaleLevel:0,multiscaleLevelDims:[{shape:[1,i.sizeC,i.sizeZ,i.sizeY,i.sizeX],spacing:[1,1,i.physicalPixelSize[2],i.physicalPixelSize[1],i.physicalPixelSize[0]],spaceUnit:i.spatialUnit||"μm",timeUnit:"s",dataType:"uint8"}],transform:{translation:[0,0,0],rotation:[0,0,0],scale:[1,1,1]},userData:i.userData}};class FS extends kr{constructor(e,t){if(super(),this.jsonInfo=t,this.data=e,this.data.shape[0]!==this.jsonInfo.sizeC||this.data.shape[1]!==this.jsonInfo.sizeZ||this.data.shape[2]!==this.jsonInfo.sizeY||this.data.shape[3]!==this.jsonInfo.sizeX)throw new Error("RawArrayLoader: data shape does not match metadata")}async loadDims(e){const t=this.jsonInfo;return[{shape:[1,t.sizeC,t.sizeZ,t.sizeY,t.sizeX],spacing:[1,1,t.physicalPixelSize[2],t.physicalPixelSize[1],t.physicalPixelSize[0]],spaceUnit:t.spatialUnit||"μm",dataType:"uint8",timeUnit:"s"}]}async createImageInfo(e){return{imageInfo:OS(this.jsonInfo),loadSpec:e}}loadRawChannelData(e,t,n,s){const r=t.channels,a={...t,subregion:new fn(new I(0,0,0),new I(1,1,1)),multiscaleLevel:0};n(void 0,a);for(let c=0;c<e.combinedNumChannels;++c){if(r&&r.length>0&&!r.includes(c))continue;const u=this.data.shape[3]*this.data.shape[2]*this.data.shape[1],d=new Uint8Array(this.data.buffer.buffer,c*u,u),f=na(d);s([c],["uint8"],[d],[f])}return Promise.resolve()}}function $t(i){return(e,...t)=>BS(i,e,t)}function sr(i,e){return $t(Qp(i,e).get)}const{apply:BS,construct:KE,defineProperty:ZE,get:JE,getOwnPropertyDescriptor:Qp,getPrototypeOf:nh,has:QE,ownKeys:kS,set:eA,setPrototypeOf:tA}=Reflect,{iterator:zr,species:nA,toStringTag:zS,for:iA}=Symbol,VS=Object,{create:ih,defineProperty:GS,freeze:sA,is:rA}=VS,HS=Array,WS=HS.prototype,ef=WS[zr],XS=$t(ef),tf=ArrayBuffer,YS=tf.prototype;sr(YS,"byteLength");const jd=typeof SharedArrayBuffer<"u"?SharedArrayBuffer:null;jd&&sr(jd.prototype,"byteLength");const nf=nh(Uint8Array);nf.from;const an=nf.prototype;an[zr];$t(an.keys);$t(an.values);$t(an.entries);$t(an.set);$t(an.reverse);$t(an.fill);$t(an.copyWithin);$t(an.sort);$t(an.slice);$t(an.subarray);sr(an,"buffer");sr(an,"byteOffset");sr(an,"length");sr(an,zS);const qS=Uint8Array,sf=Uint16Array,sh=Uint32Array,jS=Float32Array,Fr=nh([][zr]()),rf=$t(Fr.next),$S=$t(function*(){}().next),KS=nh(Fr),ZS=DataView.prototype,JS=$t(ZS.getUint16),rh=WeakMap,of=rh.prototype,af=$t(of.get),QS=$t(of.set),lf=new rh,eM=ih(null,{next:{value:function(){const e=af(lf,this);return rf(e)}},[zr]:{value:function(){return this}}});function tM(i){if(i[zr]===ef&&Fr.next===rf)return i;const e=ih(eM);return QS(lf,e,XS(i)),e}const nM=new rh,iM=ih(KS,{next:{value:function(){const e=af(nM,this);return $S(e)},writable:!0,configurable:!0}});for(const i of kS(Fr))i!=="next"&&GS(iM,i,Qp(Fr,i));const cf=new tf(4),sM=new jS(cf),rM=new sh(cf),kn=new sf(512),zn=new qS(512);for(let i=0;i<256;++i){const e=i-127;e<-24?(kn[i]=0,kn[i|256]=32768,zn[i]=24,zn[i|256]=24):e<-14?(kn[i]=1024>>-e-14,kn[i|256]=1024>>-e-14|32768,zn[i]=-e-1,zn[i|256]=-e-1):e<=15?(kn[i]=e+15<<10,kn[i|256]=e+15<<10|32768,zn[i]=13,zn[i|256]=13):e<128?(kn[i]=31744,kn[i|256]=64512,zn[i]=24,zn[i|256]=24):(kn[i]=31744,kn[i|256]=64512,zn[i]=13,zn[i|256]=13)}const oh=new sh(2048);for(let i=1;i<1024;++i){let e=i<<13,t=0;for(;!(e&8388608);)e<<=1,t-=8388608;e&=-8388609,t+=947912704,oh[i]=e|t}for(let i=1024;i<2048;++i)oh[i]=939524096+(i-1024<<13);const rr=new sh(64);for(let i=1;i<31;++i)rr[i]=i<<23;rr[31]=1199570944;rr[32]=2147483648;for(let i=33;i<63;++i)rr[i]=2147483648+(i-32<<23);rr[63]=3347054592;const hf=new sf(64);for(let i=1;i<64;++i)i!==32&&(hf[i]=1024);function oM(i){const e=i>>10;return rM[0]=oh[hf[e]+(i&1023)]+rr[e],sM[0]}function uf(i,e,...t){return oM(JS(i,e,...tM(t)))}var To={exports:{}},$d;function aM(){if($d)return To.exports;$d=1;function i(e,t,n){const s=n&&n.debug||!1;s&&console.log("[xml-utils] getting "+t+" in "+e);const r=typeof e=="object"?e.outer:e,a=r.slice(0,r.indexOf(">")+1),c=['"',"'"];for(let u=0;u<c.length;u++){const d=c[u],f=t+"\\="+d+"([^"+d+"]*)"+d;s&&console.log("[xml-utils] pattern:",f);const v=new RegExp(f).exec(a);if(s&&console.log("[xml-utils] match:",v),v)return v[1]}}return To.exports=i,To.exports.default=i,To.exports}var lM=aM();const Ol=eh(lM);var Ro={exports:{}},Po={exports:{}},Lo={exports:{}},Kd;function cM(){if(Kd)return Lo.exports;Kd=1;function i(e,t,n){const r=new RegExp(t).exec(e.slice(n));return r?n+r.index:-1}return Lo.exports=i,Lo.exports.default=i,Lo.exports}var Io={exports:{}},Zd;function hM(){if(Zd)return Io.exports;Zd=1;function i(e,t,n){const r=new RegExp(t).exec(e.slice(n));return r?n+r.index+r[0].length-1:-1}return Io.exports=i,Io.exports.default=i,Io.exports}var Do={exports:{}},Jd;function uM(){if(Jd)return Do.exports;Jd=1;function i(e,t){const n=new RegExp(t,"g"),s=e.match(n);return s?s.length:0}return Do.exports=i,Do.exports.default=i,Do.exports}var Qd;function dM(){if(Qd)return Po.exports;Qd=1;const i=cM(),e=hM(),t=uM();function n(s,r,a){const c=a&&a.debug||!1,u=!(a&&typeof a.nested===!1),d=a&&a.startIndex||0;c&&console.log("[xml-utils] starting findTagByName with",r," and ",a);const f=i(s,`<${r}[ 
>/]`,d);if(c&&console.log("[xml-utils] start:",f),f===-1)return;const m=s.slice(f+r.length);let v=e(m,"^[^<]*[ /]>",0);const g=v!==-1&&m[v-1]==="/";if(c&&console.log("[xml-utils] selfClosing:",g),g===!1)if(u){let _=0,w=1,E=0;for(;(v=e(m,"[ /]"+r+">",_))!==-1;){const M=m.substring(_,v+1);if(w+=t(M,"<"+r+`[ 
	>]`),E+=t(M,"</"+r+">"),E>=w)break;_=v}}else v=e(m,"[ /]"+r+">",0);const b=f+r.length+v+1;if(c&&console.log("[xml-utils] end:",b),b===-1)return;const y=s.slice(f,b);let x;return g?x=null:x=y.slice(y.indexOf(">")+1,y.lastIndexOf("<")),{inner:x,outer:y,start:f,end:b}}return Po.exports=n,Po.exports.default=n,Po.exports}var ep;function pM(){if(ep)return Ro.exports;ep=1;const i=dM();function e(t,n,s){const r=[],a=s&&s.debug||!1,c=s&&typeof s.nested=="boolean"?s.nested:!0;let u=s&&s.startIndex||0,d;for(;d=i(t,n,{debug:a,startIndex:u});)c?u=d.start+1+n.length:u=d.end,r.push(d);return a&&console.log("findTagsByName found",r.length,"tags"),r}return Ro.exports=e,Ro.exports.default=e,Ro.exports}var fM=pM();const mM=eh(fM),Pr={315:"Artist",258:"BitsPerSample",265:"CellLength",264:"CellWidth",320:"ColorMap",259:"Compression",33432:"Copyright",306:"DateTime",338:"ExtraSamples",266:"FillOrder",289:"FreeByteCounts",288:"FreeOffsets",291:"GrayResponseCurve",290:"GrayResponseUnit",316:"HostComputer",270:"ImageDescription",257:"ImageLength",256:"ImageWidth",271:"Make",281:"MaxSampleValue",280:"MinSampleValue",272:"Model",254:"NewSubfileType",274:"Orientation",262:"PhotometricInterpretation",284:"PlanarConfiguration",296:"ResolutionUnit",278:"RowsPerStrip",277:"SamplesPerPixel",305:"Software",279:"StripByteCounts",273:"StripOffsets",255:"SubfileType",263:"Threshholding",282:"XResolution",283:"YResolution",326:"BadFaxLines",327:"CleanFaxData",343:"ClipPath",328:"ConsecutiveBadFaxLines",433:"Decode",434:"DefaultImageColor",269:"DocumentName",336:"DotRange",321:"HalftoneHints",346:"Indexed",347:"JPEGTables",285:"PageName",297:"PageNumber",317:"Predictor",319:"PrimaryChromaticities",532:"ReferenceBlackWhite",339:"SampleFormat",340:"SMinSampleValue",341:"SMaxSampleValue",559:"StripRowCounts",330:"SubIFDs",292:"T4Options",293:"T6Options",325:"TileByteCounts",323:"TileLength",324:"TileOffsets",322:"TileWidth",301:"TransferFunction",318:"WhitePoint",344:"XClipPathUnits",286:"XPosition",529:"YCbCrCoefficients",531:"YCbCrPositioning",530:"YCbCrSubSampling",345:"YClipPathUnits",287:"YPosition",37378:"ApertureValue",40961:"ColorSpace",36868:"DateTimeDigitized",36867:"DateTimeOriginal",34665:"Exif IFD",36864:"ExifVersion",33434:"ExposureTime",41728:"FileSource",37385:"Flash",40960:"FlashpixVersion",33437:"FNumber",42016:"ImageUniqueID",37384:"LightSource",37500:"MakerNote",37377:"ShutterSpeedValue",37510:"UserComment",33723:"IPTC",34675:"ICC Profile",700:"XMP",42112:"GDAL_METADATA",42113:"GDAL_NODATA",34377:"Photoshop",33550:"ModelPixelScale",33922:"ModelTiepoint",34264:"ModelTransformation",34735:"GeoKeyDirectory",34736:"GeoDoubleParams",34737:"GeoAsciiParams",50674:"LercParameters"},Vn={};for(const i in Pr)Pr.hasOwnProperty(i)&&(Vn[Pr[i]]=parseInt(i,10));const gM=[Vn.BitsPerSample,Vn.ExtraSamples,Vn.SampleFormat,Vn.StripByteCounts,Vn.StripOffsets,Vn.StripRowCounts,Vn.TileByteCounts,Vn.TileOffsets,Vn.SubIFDs],Fl={1:"BYTE",2:"ASCII",3:"SHORT",4:"LONG",5:"RATIONAL",6:"SBYTE",7:"UNDEFINED",8:"SSHORT",9:"SLONG",10:"SRATIONAL",11:"FLOAT",12:"DOUBLE",13:"IFD",16:"LONG8",17:"SLONG8",18:"IFD8"},Qe={};for(const i in Fl)Fl.hasOwnProperty(i)&&(Qe[Fl[i]]=parseInt(i,10));const xn={WhiteIsZero:0,BlackIsZero:1,RGB:2,Palette:3,TransparencyMask:4,CMYK:5,YCbCr:6,CIELab:8,ICCLab:9},vM={Unspecified:0,Assocalpha:1,Unassalpha:2},oA={Version:0,AddCompression:1},aA={None:0,Deflate:1,Zstandard:2},_M={1024:"GTModelTypeGeoKey",1025:"GTRasterTypeGeoKey",1026:"GTCitationGeoKey",2048:"GeographicTypeGeoKey",2049:"GeogCitationGeoKey",2050:"GeogGeodeticDatumGeoKey",2051:"GeogPrimeMeridianGeoKey",2052:"GeogLinearUnitsGeoKey",2053:"GeogLinearUnitSizeGeoKey",2054:"GeogAngularUnitsGeoKey",2055:"GeogAngularUnitSizeGeoKey",2056:"GeogEllipsoidGeoKey",2057:"GeogSemiMajorAxisGeoKey",2058:"GeogSemiMinorAxisGeoKey",2059:"GeogInvFlatteningGeoKey",2060:"GeogAzimuthUnitsGeoKey",2061:"GeogPrimeMeridianLongGeoKey",2062:"GeogTOWGS84GeoKey",3072:"ProjectedCSTypeGeoKey",3073:"PCSCitationGeoKey",3074:"ProjectionGeoKey",3075:"ProjCoordTransGeoKey",3076:"ProjLinearUnitsGeoKey",3077:"ProjLinearUnitSizeGeoKey",3078:"ProjStdParallel1GeoKey",3079:"ProjStdParallel2GeoKey",3080:"ProjNatOriginLongGeoKey",3081:"ProjNatOriginLatGeoKey",3082:"ProjFalseEastingGeoKey",3083:"ProjFalseNorthingGeoKey",3084:"ProjFalseOriginLongGeoKey",3085:"ProjFalseOriginLatGeoKey",3086:"ProjFalseOriginEastingGeoKey",3087:"ProjFalseOriginNorthingGeoKey",3088:"ProjCenterLongGeoKey",3089:"ProjCenterLatGeoKey",3090:"ProjCenterEastingGeoKey",3091:"ProjCenterNorthingGeoKey",3092:"ProjScaleAtNatOriginGeoKey",3093:"ProjScaleAtCenterGeoKey",3094:"ProjAzimuthAngleGeoKey",3095:"ProjStraightVertPoleLongGeoKey",3096:"ProjRectifiedGridAngleGeoKey",4096:"VerticalCSTypeGeoKey",4097:"VerticalCitationGeoKey",4098:"VerticalDatumGeoKey",4099:"VerticalUnitsGeoKey"};function xM(i,e){const{width:t,height:n}=i,s=new Uint8Array(t*n*3);let r;for(let a=0,c=0;a<i.length;++a,c+=3)r=256-i[a]/e*256,s[c]=r,s[c+1]=r,s[c+2]=r;return s}function bM(i,e){const{width:t,height:n}=i,s=new Uint8Array(t*n*3);let r;for(let a=0,c=0;a<i.length;++a,c+=3)r=i[a]/e*256,s[c]=r,s[c+1]=r,s[c+2]=r;return s}function yM(i,e){const{width:t,height:n}=i,s=new Uint8Array(t*n*3),r=e.length/3,a=e.length/3*2;for(let c=0,u=0;c<i.length;++c,u+=3){const d=i[c];s[u]=e[d]/65536*256,s[u+1]=e[d+r]/65536*256,s[u+2]=e[d+a]/65536*256}return s}function wM(i){const{width:e,height:t}=i,n=new Uint8Array(e*t*3);for(let s=0,r=0;s<i.length;s+=4,r+=3){const a=i[s],c=i[s+1],u=i[s+2],d=i[s+3];n[r]=255*((255-a)/256)*((255-d)/256),n[r+1]=255*((255-c)/256)*((255-d)/256),n[r+2]=255*((255-u)/256)*((255-d)/256)}return n}function SM(i){const{width:e,height:t}=i,n=new Uint8ClampedArray(e*t*3);for(let s=0,r=0;s<i.length;s+=3,r+=3){const a=i[s],c=i[s+1],u=i[s+2];n[r]=a+1.402*(u-128),n[r+1]=a-.34414*(c-128)-.71414*(u-128),n[r+2]=a+1.772*(c-128)}return n}const MM=.95047,EM=1,AM=1.08883;function CM(i){const{width:e,height:t}=i,n=new Uint8Array(e*t*3);for(let s=0,r=0;s<i.length;s+=3,r+=3){const a=i[s+0],c=i[s+1]<<24>>24,u=i[s+2]<<24>>24;let d=(a+16)/116,f=c/500+d,m=d-u/200,v,g,b;f=MM*(f*f*f>.008856?f*f*f:(f-16/116)/7.787),d=EM*(d*d*d>.008856?d*d*d:(d-16/116)/7.787),m=AM*(m*m*m>.008856?m*m*m:(m-16/116)/7.787),v=f*3.2406+d*-1.5372+m*-.4986,g=f*-.9689+d*1.8758+m*.0415,b=f*.0557+d*-.204+m*1.057,v=v>.0031308?1.055*v**(1/2.4)-.055:12.92*v,g=g>.0031308?1.055*g**(1/2.4)-.055:12.92*g,b=b>.0031308?1.055*b**(1/2.4)-.055:12.92*b,n[r]=Math.max(0,Math.min(1,v))*255,n[r+1]=Math.max(0,Math.min(1,g))*255,n[r+2]=Math.max(0,Math.min(1,b))*255}return n}const df=new Map;function Oi(i,e){Array.isArray(i)||(i=[i]),i.forEach(t=>df.set(t,e))}async function TM(i){const e=df.get(i.Compression);if(!e)throw new Error(`Unknown compression method identifier: ${i.Compression}`);const t=await e();return new t(i)}Oi([void 0,1],()=>os(()=>import("./raw-Dt1HMqYc.js"),__vite__mapDeps([0,1])).then(i=>i.default));Oi(5,()=>os(()=>import("./lzw-DpvbRwG5.js"),__vite__mapDeps([2,1])).then(i=>i.default));Oi(6,()=>{throw new Error("old style JPEG compression is not supported.")});Oi(7,()=>os(()=>import("./jpeg-CdeCw_eT.js"),__vite__mapDeps([3,1])).then(i=>i.default));Oi([8,32946],()=>os(()=>import("./deflate-CUkHh1nh.js"),__vite__mapDeps([4,5,1])).then(i=>i.default));Oi(32773,()=>os(()=>import("./packbits-DQnG8s9w.js"),__vite__mapDeps([6,1])).then(i=>i.default));Oi(34887,()=>os(()=>import("./lerc-CUiIedq7.js"),__vite__mapDeps([7,5,1])).then(async i=>(await i.zstd.init(),i)).then(i=>i.default));Oi(50001,()=>os(()=>import("./webimage-BcnuJlio.js"),__vite__mapDeps([8,1])).then(i=>i.default));function _a(i,e,t,n=1){return new(Object.getPrototypeOf(i)).constructor(e*t*n)}function RM(i,e,t,n,s){const r=e/n,a=t/s;return i.map(c=>{const u=_a(c,n,s);for(let d=0;d<s;++d){const f=Math.min(Math.round(a*d),t-1);for(let m=0;m<n;++m){const v=Math.min(Math.round(r*m),e-1),g=c[f*e+v];u[d*n+m]=g}}return u})}function Ws(i,e,t){return(1-t)*i+t*e}function PM(i,e,t,n,s){const r=e/n,a=t/s;return i.map(c=>{const u=_a(c,n,s);for(let d=0;d<s;++d){const f=a*d,m=Math.floor(f),v=Math.min(Math.ceil(f),t-1);for(let g=0;g<n;++g){const b=r*g,y=b%1,x=Math.floor(b),_=Math.min(Math.ceil(b),e-1),w=c[m*e+x],E=c[m*e+_],M=c[v*e+x],P=c[v*e+_],D=Ws(Ws(w,E,y),Ws(M,P,y),f%1);u[d*n+g]=D}}return u})}function LM(i,e,t,n,s,r="nearest"){switch(r.toLowerCase()){case"nearest":return RM(i,e,t,n,s);case"bilinear":case"linear":return PM(i,e,t,n,s);default:throw new Error(`Unsupported resampling method: '${r}'`)}}function IM(i,e,t,n,s,r){const a=e/n,c=t/s,u=_a(i,n,s,r);for(let d=0;d<s;++d){const f=Math.min(Math.round(c*d),t-1);for(let m=0;m<n;++m){const v=Math.min(Math.round(a*m),e-1);for(let g=0;g<r;++g){const b=i[f*e*r+v*r+g];u[d*n*r+m*r+g]=b}}}return u}function DM(i,e,t,n,s,r){const a=e/n,c=t/s,u=_a(i,n,s,r);for(let d=0;d<s;++d){const f=c*d,m=Math.floor(f),v=Math.min(Math.ceil(f),t-1);for(let g=0;g<n;++g){const b=a*g,y=b%1,x=Math.floor(b),_=Math.min(Math.ceil(b),e-1);for(let w=0;w<r;++w){const E=i[m*e*r+x*r+w],M=i[m*e*r+_*r+w],P=i[v*e*r+x*r+w],D=i[v*e*r+_*r+w],O=Ws(Ws(E,M,y),Ws(P,D,y),f%1);u[d*n*r+g*r+w]=O}}}return u}function UM(i,e,t,n,s,r,a="nearest"){switch(a.toLowerCase()){case"nearest":return IM(i,e,t,n,s,r);case"bilinear":case"linear":return DM(i,e,t,n,s,r);default:throw new Error(`Unsupported resampling method: '${a}'`)}}function NM(i,e,t){let n=0;for(let s=e;s<t;++s)n+=i[s];return n}function Tc(i,e,t){switch(i){case 1:if(e<=8)return new Uint8Array(t);if(e<=16)return new Uint16Array(t);if(e<=32)return new Uint32Array(t);break;case 2:if(e===8)return new Int8Array(t);if(e===16)return new Int16Array(t);if(e===32)return new Int32Array(t);break;case 3:switch(e){case 16:case 32:return new Float32Array(t);case 64:return new Float64Array(t)}break}throw Error("Unsupported data format/bitsPerSample")}function OM(i,e){return(i===1||i===2)&&e<=32&&e%8===0?!1:!(i===3&&(e===16||e===32||e===64))}function FM(i,e,t,n,s,r,a){const c=new DataView(i),u=t===2?a*r:a*r*n,d=t===2?1:n,f=Tc(e,s,u),m=parseInt("1".repeat(s),2);if(e===1){let v;t===1?v=n*s:v=s;let g=r*v;g&7&&(g=g+7&-8);for(let b=0;b<a;++b){const y=b*g;for(let x=0;x<r;++x){const _=y+x*d*s;for(let w=0;w<d;++w){const E=_+w*s,M=(b*r+x)*d+w,P=Math.floor(E/8),D=E%8;if(D+s<=8)f[M]=c.getUint8(P)>>8-s-D&m;else if(D+s<=16)f[M]=c.getUint16(P)>>16-s-D&m;else if(D+s<=24){const O=c.getUint16(P)<<8|c.getUint8(P+2);f[M]=O>>24-s-D&m}else f[M]=c.getUint32(P)>>32-s-D&m}}}}return f.buffer}class BM{constructor(e,t,n,s,r,a){this.fileDirectory=e,this.geoKeys=t,this.dataView=n,this.littleEndian=s,this.tiles=r?{}:null,this.isTiled=!e.StripOffsets;const c=e.PlanarConfiguration;if(this.planarConfiguration=typeof c>"u"?1:c,this.planarConfiguration!==1&&this.planarConfiguration!==2)throw new Error("Invalid planar configuration.");this.source=a}getFileDirectory(){return this.fileDirectory}getGeoKeys(){return this.geoKeys}getWidth(){return this.fileDirectory.ImageWidth}getHeight(){return this.fileDirectory.ImageLength}getSamplesPerPixel(){return typeof this.fileDirectory.SamplesPerPixel<"u"?this.fileDirectory.SamplesPerPixel:1}getTileWidth(){return this.isTiled?this.fileDirectory.TileWidth:this.getWidth()}getTileHeight(){return this.isTiled?this.fileDirectory.TileLength:typeof this.fileDirectory.RowsPerStrip<"u"?Math.min(this.fileDirectory.RowsPerStrip,this.getHeight()):this.getHeight()}getBlockWidth(){return this.getTileWidth()}getBlockHeight(e){return this.isTiled||(e+1)*this.getTileHeight()<=this.getHeight()?this.getTileHeight():this.getHeight()-e*this.getTileHeight()}getBytesPerPixel(){let e=0;for(let t=0;t<this.fileDirectory.BitsPerSample.length;++t)e+=this.getSampleByteSize(t);return e}getSampleByteSize(e){if(e>=this.fileDirectory.BitsPerSample.length)throw new RangeError(`Sample index ${e} is out of range.`);return Math.ceil(this.fileDirectory.BitsPerSample[e]/8)}getReaderForSample(e){const t=this.fileDirectory.SampleFormat?this.fileDirectory.SampleFormat[e]:1,n=this.fileDirectory.BitsPerSample[e];switch(t){case 1:if(n<=8)return DataView.prototype.getUint8;if(n<=16)return DataView.prototype.getUint16;if(n<=32)return DataView.prototype.getUint32;break;case 2:if(n<=8)return DataView.prototype.getInt8;if(n<=16)return DataView.prototype.getInt16;if(n<=32)return DataView.prototype.getInt32;break;case 3:switch(n){case 16:return function(s,r){return uf(this,s,r)};case 32:return DataView.prototype.getFloat32;case 64:return DataView.prototype.getFloat64}break}throw Error("Unsupported data format/bitsPerSample")}getSampleFormat(e=0){return this.fileDirectory.SampleFormat?this.fileDirectory.SampleFormat[e]:1}getBitsPerSample(e=0){return this.fileDirectory.BitsPerSample[e]}getArrayForSample(e,t){const n=this.getSampleFormat(e),s=this.getBitsPerSample(e);return Tc(n,s,t)}async getTileOrStrip(e,t,n,s,r){const a=Math.ceil(this.getWidth()/this.getTileWidth()),c=Math.ceil(this.getHeight()/this.getTileHeight());let u;const{tiles:d}=this;this.planarConfiguration===1?u=t*a+e:this.planarConfiguration===2&&(u=n*a*c+t*a+e);let f,m;this.isTiled?(f=this.fileDirectory.TileOffsets[u],m=this.fileDirectory.TileByteCounts[u]):(f=this.fileDirectory.StripOffsets[u],m=this.fileDirectory.StripByteCounts[u]);const v=(await this.source.fetch([{offset:f,length:m}],r))[0];let g;return d===null||!d[u]?(g=(async()=>{let b=await s.decode(this.fileDirectory,v);const y=this.getSampleFormat(),x=this.getBitsPerSample();return OM(y,x)&&(b=FM(b,y,this.planarConfiguration,this.getSamplesPerPixel(),x,this.getTileWidth(),this.getBlockHeight(t))),b})(),d!==null&&(d[u]=g)):g=d[u],{x:e,y:t,sample:n,data:await g}}async _readRaster(e,t,n,s,r,a,c,u,d){const f=this.getTileWidth(),m=this.getTileHeight(),v=this.getWidth(),g=this.getHeight(),b=Math.max(Math.floor(e[0]/f),0),y=Math.min(Math.ceil(e[2]/f),Math.ceil(v/f)),x=Math.max(Math.floor(e[1]/m),0),_=Math.min(Math.ceil(e[3]/m),Math.ceil(g/m)),w=e[2]-e[0];let E=this.getBytesPerPixel();const M=[],P=[];for(let U=0;U<t.length;++U)this.planarConfiguration===1?M.push(NM(this.fileDirectory.BitsPerSample,0,t[U])/8):M.push(0),P.push(this.getReaderForSample(t[U]));const D=[],{littleEndian:O}=this;for(let U=x;U<_;++U)for(let L=b;L<y;++L){let A;this.planarConfiguration===1&&(A=this.getTileOrStrip(L,U,0,r,d));for(let F=0;F<t.length;++F){const q=F,X=t[F];this.planarConfiguration===2&&(E=this.getSampleByteSize(X),A=this.getTileOrStrip(L,U,X,r,d));const J=A.then(Q=>{const te=Q.data,ee=new DataView(te),z=this.getBlockHeight(Q.y),le=Q.y*m,ce=Q.x*f,re=le+z,Re=(Q.x+1)*f,st=P[q],Y=Math.min(z,z-(re-e[3]),g-le),ae=Math.min(f,f-(Re-e[2]),v-ce);for(let ye=Math.max(0,e[1]-le);ye<Y;++ye)for(let me=Math.max(0,e[0]-ce);me<ae;++me){const Le=(ye*f+me)*E,Fe=st.call(ee,Le+M[q],O);let Ve;s?(Ve=(ye+le-e[1])*w*t.length+(me+ce-e[0])*t.length+q,n[Ve]=Fe):(Ve=(ye+le-e[1])*w+me+ce-e[0],n[q][Ve]=Fe)}});D.push(J)}}if(await Promise.all(D),a&&e[2]-e[0]!==a||c&&e[3]-e[1]!==c){let U;return s?U=UM(n,e[2]-e[0],e[3]-e[1],a,c,t.length,u):U=LM(n,e[2]-e[0],e[3]-e[1],a,c,u),U.width=a,U.height=c,U}return n.width=a||e[2]-e[0],n.height=c||e[3]-e[1],n}async readRasters({window:e,samples:t=[],interleave:n,pool:s=null,width:r,height:a,resampleMethod:c,fillValue:u,signal:d}={}){const f=e||[0,0,this.getWidth(),this.getHeight()];if(f[0]>f[2]||f[1]>f[3])throw new Error("Invalid subsets");const m=f[2]-f[0],v=f[3]-f[1],g=m*v,b=this.getSamplesPerPixel();if(!t||!t.length)for(let w=0;w<b;++w)t.push(w);else for(let w=0;w<t.length;++w)if(t[w]>=b)return Promise.reject(new RangeError(`Invalid sample index '${t[w]}'.`));let y;if(n){const w=this.fileDirectory.SampleFormat?Math.max.apply(null,this.fileDirectory.SampleFormat):1,E=Math.max.apply(null,this.fileDirectory.BitsPerSample);y=Tc(w,E,g*t.length),u&&y.fill(u)}else{y=[];for(let w=0;w<t.length;++w){const E=this.getArrayForSample(t[w],g);Array.isArray(u)&&w<u.length?E.fill(u[w]):u&&!Array.isArray(u)&&E.fill(u),y.push(E)}}const x=s||await TM(this.fileDirectory);return await this._readRaster(f,t,y,n,x,r,a,c,d)}async readRGB({window:e,interleave:t=!0,pool:n=null,width:s,height:r,resampleMethod:a,enableAlpha:c=!1,signal:u}={}){const d=e||[0,0,this.getWidth(),this.getHeight()];if(d[0]>d[2]||d[1]>d[3])throw new Error("Invalid subsets");const f=this.fileDirectory.PhotometricInterpretation;if(f===xn.RGB){let _=[0,1,2];if(this.fileDirectory.ExtraSamples!==vM.Unspecified&&c){_=[];for(let w=0;w<this.fileDirectory.BitsPerSample.length;w+=1)_.push(w)}return this.readRasters({window:e,interleave:t,samples:_,pool:n,width:s,height:r,resampleMethod:a,signal:u})}let m;switch(f){case xn.WhiteIsZero:case xn.BlackIsZero:case xn.Palette:m=[0];break;case xn.CMYK:m=[0,1,2,3];break;case xn.YCbCr:case xn.CIELab:m=[0,1,2];break;default:throw new Error("Invalid or unsupported photometric interpretation.")}const v={window:d,interleave:!0,samples:m,pool:n,width:s,height:r,resampleMethod:a,signal:u},{fileDirectory:g}=this,b=await this.readRasters(v),y=2**this.fileDirectory.BitsPerSample[0];let x;switch(f){case xn.WhiteIsZero:x=xM(b,y);break;case xn.BlackIsZero:x=bM(b,y);break;case xn.Palette:x=yM(b,g.ColorMap);break;case xn.CMYK:x=wM(b);break;case xn.YCbCr:x=SM(b);break;case xn.CIELab:x=CM(b);break;default:throw new Error("Unsupported photometric interpretation.")}if(!t){const _=new Uint8Array(x.length/3),w=new Uint8Array(x.length/3),E=new Uint8Array(x.length/3);for(let M=0,P=0;M<x.length;M+=3,++P)_[P]=x[M],w[P]=x[M+1],E[P]=x[M+2];x=[_,w,E]}return x.width=b.width,x.height=b.height,x}getTiePoints(){if(!this.fileDirectory.ModelTiepoint)return[];const e=[];for(let t=0;t<this.fileDirectory.ModelTiepoint.length;t+=6)e.push({i:this.fileDirectory.ModelTiepoint[t],j:this.fileDirectory.ModelTiepoint[t+1],k:this.fileDirectory.ModelTiepoint[t+2],x:this.fileDirectory.ModelTiepoint[t+3],y:this.fileDirectory.ModelTiepoint[t+4],z:this.fileDirectory.ModelTiepoint[t+5]});return e}getGDALMetadata(e=null){const t={};if(!this.fileDirectory.GDAL_METADATA)return null;const n=this.fileDirectory.GDAL_METADATA;let s=mM(n,"Item");e===null?s=s.filter(r=>Ol(r,"sample")===void 0):s=s.filter(r=>Number(Ol(r,"sample"))===e);for(let r=0;r<s.length;++r){const a=s[r];t[Ol(a,"name")]=a.inner}return t}getGDALNoData(){if(!this.fileDirectory.GDAL_NODATA)return null;const e=this.fileDirectory.GDAL_NODATA;return Number(e.substring(0,e.length-1))}getOrigin(){const e=this.fileDirectory.ModelTiepoint,t=this.fileDirectory.ModelTransformation;if(e&&e.length===6)return[e[3],e[4],e[5]];if(t)return[t[3],t[7],t[11]];throw new Error("The image does not have an affine transformation.")}getResolution(e=null){const t=this.fileDirectory.ModelPixelScale,n=this.fileDirectory.ModelTransformation;if(t)return[t[0],-t[1],t[2]];if(n)return n[1]===0&&n[4]===0?[n[0],-n[5],n[10]]:[Math.sqrt(n[0]*n[0]+n[4]*n[4]),-Math.sqrt(n[1]*n[1]+n[5]*n[5]),n[10]];if(e){const[s,r,a]=e.getResolution();return[s*e.getWidth()/this.getWidth(),r*e.getHeight()/this.getHeight(),a*e.getWidth()/this.getWidth()]}throw new Error("The image does not have an affine transformation.")}pixelIsArea(){return this.geoKeys.GTRasterTypeGeoKey===1}getBoundingBox(e=!1){const t=this.getHeight(),n=this.getWidth();if(this.fileDirectory.ModelTransformation&&!e){const[s,r,a,c,u,d,f,m]=this.fileDirectory.ModelTransformation,g=[[0,0],[0,t],[n,0],[n,t]].map(([x,_])=>[c+s*x+r*_,m+u*x+d*_]),b=g.map(x=>x[0]),y=g.map(x=>x[1]);return[Math.min(...b),Math.min(...y),Math.max(...b),Math.max(...y)]}else{const s=this.getOrigin(),r=this.getResolution(),a=s[0],c=s[1],u=a+r[0]*n,d=c+r[1]*t;return[Math.min(a,u),Math.min(c,d),Math.max(a,u),Math.max(c,d)]}}}class kM{constructor(e){this._dataView=new DataView(e)}get buffer(){return this._dataView.buffer}getUint64(e,t){const n=this.getUint32(e,t),s=this.getUint32(e+4,t);let r;if(t){if(r=n+2**32*s,!Number.isSafeInteger(r))throw new Error(`${r} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);return r}if(r=2**32*n+s,!Number.isSafeInteger(r))throw new Error(`${r} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);return r}getInt64(e,t){let n=0;const s=(this._dataView.getUint8(e+(t?7:0))&128)>0;let r=!0;for(let a=0;a<8;a++){let c=this._dataView.getUint8(e+(t?a:7-a));s&&(r?c!==0&&(c=~(c-1)&255,r=!1):c=~c&255),n+=c*256**a}return s&&(n=-n),n}getUint8(e,t){return this._dataView.getUint8(e,t)}getInt8(e,t){return this._dataView.getInt8(e,t)}getUint16(e,t){return this._dataView.getUint16(e,t)}getInt16(e,t){return this._dataView.getInt16(e,t)}getUint32(e,t){return this._dataView.getUint32(e,t)}getInt32(e,t){return this._dataView.getInt32(e,t)}getFloat16(e,t){return uf(this._dataView,e,t)}getFloat32(e,t){return this._dataView.getFloat32(e,t)}getFloat64(e,t){return this._dataView.getFloat64(e,t)}}class zM{constructor(e,t,n,s){this._dataView=new DataView(e),this._sliceOffset=t,this._littleEndian=n,this._bigTiff=s}get sliceOffset(){return this._sliceOffset}get sliceTop(){return this._sliceOffset+this.buffer.byteLength}get littleEndian(){return this._littleEndian}get bigTiff(){return this._bigTiff}get buffer(){return this._dataView.buffer}covers(e,t){return this.sliceOffset<=e&&this.sliceTop>=e+t}readUint8(e){return this._dataView.getUint8(e-this._sliceOffset,this._littleEndian)}readInt8(e){return this._dataView.getInt8(e-this._sliceOffset,this._littleEndian)}readUint16(e){return this._dataView.getUint16(e-this._sliceOffset,this._littleEndian)}readInt16(e){return this._dataView.getInt16(e-this._sliceOffset,this._littleEndian)}readUint32(e){return this._dataView.getUint32(e-this._sliceOffset,this._littleEndian)}readInt32(e){return this._dataView.getInt32(e-this._sliceOffset,this._littleEndian)}readFloat32(e){return this._dataView.getFloat32(e-this._sliceOffset,this._littleEndian)}readFloat64(e){return this._dataView.getFloat64(e-this._sliceOffset,this._littleEndian)}readUint64(e){const t=this.readUint32(e),n=this.readUint32(e+4);let s;if(this._littleEndian){if(s=t+2**32*n,!Number.isSafeInteger(s))throw new Error(`${s} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);return s}if(s=2**32*t+n,!Number.isSafeInteger(s))throw new Error(`${s} exceeds MAX_SAFE_INTEGER. Precision may be lost. Please report if you get this message to https://github.com/geotiffjs/geotiff.js/issues`);return s}readInt64(e){let t=0;const n=(this._dataView.getUint8(e+(this._littleEndian?7:0))&128)>0;let s=!0;for(let r=0;r<8;r++){let a=this._dataView.getUint8(e+(this._littleEndian?r:7-r));n&&(s?a!==0&&(a=~(a-1)&255,s=!1):a=~a&255),t+=a*256**r}return n&&(t=-t),t}readOffset(e){return this._bigTiff?this.readUint64(e):this.readUint32(e)}}const tp=`\r
\r
`;function pf(i){if(typeof Object.fromEntries<"u")return Object.fromEntries(i);const e={};for(const[t,n]of i)e[t.toLowerCase()]=n;return e}function VM(i){const e=i.split(`\r
`).map(t=>{const n=t.split(":").map(s=>s.trim());return n[0]=n[0].toLowerCase(),n});return pf(e)}function GM(i){const[e,...t]=i.split(";").map(s=>s.trim()),n=t.map(s=>s.split("="));return{type:e,params:pf(n)}}function Rc(i){let e,t,n;return i&&([,e,t,n]=i.match(/bytes (\d+)-(\d+)\/(\d+)/),e=parseInt(e,10),t=parseInt(t,10),n=parseInt(n,10)),{start:e,end:t,total:n}}function HM(i,e){let t=null;const n=new TextDecoder("ascii"),s=[],r=`--${e}`,a=`${r}--`;for(let c=0;c<10;++c)n.decode(new Uint8Array(i,c,r.length))===r&&(t=c);if(t===null)throw new Error("Could not find initial boundary");for(;t<i.byteLength;){const c=n.decode(new Uint8Array(i,t,Math.min(r.length+1024,i.byteLength-t)));if(c.length===0||c.startsWith(a))break;if(!c.startsWith(r))throw new Error("Part does not start with boundary");const u=c.substr(r.length+2);if(u.length===0)break;const d=u.indexOf(tp),f=VM(u.substr(0,d)),{start:m,end:v,total:g}=Rc(f["content-range"]),b=t+r.length+d+tp.length,y=parseInt(v,10)+1-parseInt(m,10);s.push({headers:f,data:i.slice(b,b+y),offset:m,length:y,fileSize:g}),t=b+y+4}return s}class ff{async fetch(e,t=void 0){return Promise.all(e.map(n=>this.fetchSlice(n,t)))}async fetchSlice(e){throw new Error(`fetching of slice ${e} not possible, not implemented`)}get fileSize(){return null}async close(){}}class WM extends Map{constructor(e={}){if(super(),!(e.maxSize&&e.maxSize>0))throw new TypeError("`maxSize` must be a number greater than 0");if(typeof e.maxAge=="number"&&e.maxAge===0)throw new TypeError("`maxAge` must be a number greater than 0");this.maxSize=e.maxSize,this.maxAge=e.maxAge||Number.POSITIVE_INFINITY,this.onEviction=e.onEviction,this.cache=new Map,this.oldCache=new Map,this._size=0}_emitEvictions(e){if(typeof this.onEviction=="function")for(const[t,n]of e)this.onEviction(t,n.value)}_deleteIfExpired(e,t){return typeof t.expiry=="number"&&t.expiry<=Date.now()?(typeof this.onEviction=="function"&&this.onEviction(e,t.value),this.delete(e)):!1}_getOrDeleteIfExpired(e,t){if(this._deleteIfExpired(e,t)===!1)return t.value}_getItemValue(e,t){return t.expiry?this._getOrDeleteIfExpired(e,t):t.value}_peek(e,t){const n=t.get(e);return this._getItemValue(e,n)}_set(e,t){this.cache.set(e,t),this._size++,this._size>=this.maxSize&&(this._size=0,this._emitEvictions(this.oldCache),this.oldCache=this.cache,this.cache=new Map)}_moveToRecent(e,t){this.oldCache.delete(e),this._set(e,t)}*_entriesAscending(){for(const e of this.oldCache){const[t,n]=e;this.cache.has(t)||this._deleteIfExpired(t,n)===!1&&(yield e)}for(const e of this.cache){const[t,n]=e;this._deleteIfExpired(t,n)===!1&&(yield e)}}get(e){if(this.cache.has(e)){const t=this.cache.get(e);return this._getItemValue(e,t)}if(this.oldCache.has(e)){const t=this.oldCache.get(e);if(this._deleteIfExpired(e,t)===!1)return this._moveToRecent(e,t),t.value}}set(e,t,{maxAge:n=this.maxAge}={}){const s=typeof n=="number"&&n!==Number.POSITIVE_INFINITY?Date.now()+n:void 0;return this.cache.has(e)?this.cache.set(e,{value:t,expiry:s}):this._set(e,{value:t,expiry:s}),this}has(e){return this.cache.has(e)?!this._deleteIfExpired(e,this.cache.get(e)):this.oldCache.has(e)?!this._deleteIfExpired(e,this.oldCache.get(e)):!1}peek(e){if(this.cache.has(e))return this._peek(e,this.cache);if(this.oldCache.has(e))return this._peek(e,this.oldCache)}delete(e){const t=this.cache.delete(e);return t&&this._size--,this.oldCache.delete(e)||t}clear(){this.cache.clear(),this.oldCache.clear(),this._size=0}resize(e){if(!(e&&e>0))throw new TypeError("`maxSize` must be a number greater than 0");const t=[...this._entriesAscending()],n=t.length-e;n<0?(this.cache=new Map(t),this.oldCache=new Map,this._size=t.length):(n>0&&this._emitEvictions(t.slice(0,n)),this.oldCache=new Map(t.slice(n)),this.cache=new Map,this._size=0),this.maxSize=e}*keys(){for(const[e]of this)yield e}*values(){for(const[,e]of this)yield e}*[Symbol.iterator](){for(const e of this.cache){const[t,n]=e;this._deleteIfExpired(t,n)===!1&&(yield[t,n.value])}for(const e of this.oldCache){const[t,n]=e;this.cache.has(t)||this._deleteIfExpired(t,n)===!1&&(yield[t,n.value])}}*entriesDescending(){let e=[...this.cache];for(let t=e.length-1;t>=0;--t){const n=e[t],[s,r]=n;this._deleteIfExpired(s,r)===!1&&(yield[s,r.value])}e=[...this.oldCache];for(let t=e.length-1;t>=0;--t){const n=e[t],[s,r]=n;this.cache.has(s)||this._deleteIfExpired(s,r)===!1&&(yield[s,r.value])}}*entriesAscending(){for(const[e,t]of this._entriesAscending())yield[e,t.value]}get size(){if(!this._size)return this.oldCache.size;let e=0;for(const t of this.oldCache.keys())this.cache.has(t)||e++;return Math.min(this._size+e,this.maxSize)}entries(){return this.entriesAscending()}forEach(e,t=this){for(const[n,s]of this.entriesAscending())e.call(t,s,n,this)}get[Symbol.toStringTag](){return JSON.stringify([...this.entriesAscending()])}}async function XM(i){return new Promise(e=>setTimeout(e,i))}function YM(i,e){const t=Array.isArray(i)?i:Array.from(i),n=Array.isArray(e)?e:Array.from(e);return t.map((s,r)=>[s,n[r]])}class tr extends Error{constructor(e){super(e),Error.captureStackTrace&&Error.captureStackTrace(this,tr),this.name="AbortError"}}class qM extends Error{constructor(e,t){super(t),this.errors=e,this.message=t,this.name="AggregateError"}}const jM=qM;class $M{constructor(e,t,n=null){this.offset=e,this.length=t,this.data=n}get top(){return this.offset+this.length}}class np{constructor(e,t,n){this.offset=e,this.length=t,this.blockIds=n}}class KM extends ff{constructor(e,{blockSize:t=65536,cacheSize:n=100}={}){super(),this.source=e,this.blockSize=t,this.blockCache=new WM({maxSize:n,onEviction:(s,r)=>{this.evictedBlocks.set(s,r)}}),this.evictedBlocks=new Map,this.blockRequests=new Map,this.blockIdsToFetch=new Set,this.abortedBlockIds=new Set}get fileSize(){return this.source.fileSize}async fetch(e,t){const n=[],s=[],r=[];this.evictedBlocks.clear();for(const{offset:v,length:g}of e){let b=v+g;const{fileSize:y}=this;y!==null&&(b=Math.min(b,y));const x=Math.floor(v/this.blockSize)*this.blockSize;for(let _=x;_<b;_+=this.blockSize){const w=Math.floor(_/this.blockSize);!this.blockCache.has(w)&&!this.blockRequests.has(w)&&(this.blockIdsToFetch.add(w),s.push(w)),this.blockRequests.has(w)&&n.push(this.blockRequests.get(w)),r.push(w)}}await XM(),this.fetchBlocks(t);const a=[];for(const v of s)this.blockRequests.has(v)&&a.push(this.blockRequests.get(v));await Promise.allSettled(n),await Promise.allSettled(a);const c=[],u=r.filter(v=>this.abortedBlockIds.has(v)||!this.blockCache.has(v));if(u.forEach(v=>this.blockIdsToFetch.add(v)),u.length>0&&t&&!t.aborted){this.fetchBlocks(null);for(const v of u){const g=this.blockRequests.get(v);if(!g)throw new Error(`Block ${v} is not in the block requests`);c.push(g)}await Promise.allSettled(c)}if(t&&t.aborted)throw new tr("Request was aborted");const d=r.map(v=>this.blockCache.get(v)||this.evictedBlocks.get(v)),f=d.filter(v=>!v);if(f.length)throw new jM(f,"Request failed");const m=new Map(YM(r,d));return this.readSliceData(e,m)}fetchBlocks(e){if(this.blockIdsToFetch.size>0){const t=this.groupBlocks(this.blockIdsToFetch),n=this.source.fetch(t,e);for(let s=0;s<t.length;++s){const r=t[s];for(const a of r.blockIds)this.blockRequests.set(a,(async()=>{try{const c=(await n)[s],u=a*this.blockSize,d=u-c.offset,f=Math.min(d+this.blockSize,c.data.byteLength),m=c.data.slice(d,f),v=new $M(u,m.byteLength,m,a);this.blockCache.set(a,v),this.abortedBlockIds.delete(a)}catch(c){if(c.name==="AbortError")c.signal=e,this.blockCache.delete(a),this.abortedBlockIds.add(a);else throw c}finally{this.blockRequests.delete(a)}})())}this.blockIdsToFetch.clear()}}groupBlocks(e){const t=Array.from(e).sort((a,c)=>a-c);if(t.length===0)return[];let n=[],s=null;const r=[];for(const a of t)s===null||s+1===a?(n.push(a),s=a):(r.push(new np(n[0]*this.blockSize,n.length*this.blockSize,n)),n=[a],s=a);return r.push(new np(n[0]*this.blockSize,n.length*this.blockSize,n)),r}readSliceData(e,t){return e.map(n=>{let s=n.offset+n.length;this.fileSize!==null&&(s=Math.min(this.fileSize,s));const r=Math.floor(n.offset/this.blockSize),a=Math.floor(s/this.blockSize),c=new ArrayBuffer(n.length),u=new Uint8Array(c);for(let d=r;d<=a;++d){const f=t.get(d),m=f.offset-n.offset,v=f.top-s;let g=0,b=0,y;m<0?g=-m:m>0&&(b=m),v<0?y=f.length-g:y=s-f.offset-g;const x=new Uint8Array(f.data,g,y);u.set(x,b)}return c})}}class ah{get ok(){return this.status>=200&&this.status<=299}get status(){throw new Error("not implemented")}getHeader(e){throw new Error("not implemented")}async getData(){throw new Error("not implemented")}}class lh{constructor(e){this.url=e}async request({headers:e,signal:t}={}){throw new Error("request is not implemented")}}class ZM extends ah{constructor(e){super(),this.response=e}get status(){return this.response.status}getHeader(e){return this.response.headers.get(e)}async getData(){return this.response.arrayBuffer?await this.response.arrayBuffer():(await this.response.buffer()).buffer}}class JM extends lh{constructor(e,t){super(e),this.credentials=t}async request({headers:e,signal:t}={}){const n=await fetch(this.url,{headers:e,credentials:this.credentials,signal:t});return new ZM(n)}}class QM extends ah{constructor(e,t){super(),this.xhr=e,this.data=t}get status(){return this.xhr.status}getHeader(e){return this.xhr.getResponseHeader(e)}async getData(){return this.data}}class eE extends lh{constructRequest(e,t){return new Promise((n,s)=>{const r=new XMLHttpRequest;r.open("GET",this.url),r.responseType="arraybuffer";for(const[a,c]of Object.entries(e))r.setRequestHeader(a,c);r.onload=()=>{const a=r.response;n(new QM(r,a))},r.onerror=s,r.onabort=()=>s(new tr("Request aborted")),r.send(),t&&(t.aborted&&r.abort(),t.addEventListener("abort",()=>r.abort()))})}async request({headers:e,signal:t}={}){return await this.constructRequest(e,t)}}const Bl={};class tE extends ah{constructor(e,t){super(),this.response=e,this.dataPromise=t}get status(){return this.response.statusCode}getHeader(e){return this.response.headers[e]}async getData(){return await this.dataPromise}}class nE extends lh{constructor(e){super(e),this.parsedUrl=Bl.parse(this.url),this.httpApi=(this.parsedUrl.protocol==="http:",Bl)}constructRequest(e,t){return new Promise((n,s)=>{const r=this.httpApi.get({...this.parsedUrl,headers:e},a=>{const c=new Promise(u=>{const d=[];a.on("data",f=>{d.push(f)}),a.on("end",()=>{const f=Buffer.concat(d).buffer;u(f)}),a.on("error",s)});n(new tE(a,c))});r.on("error",s),t&&(t.aborted&&r.destroy(new tr("Request aborted")),t.addEventListener("abort",()=>r.destroy(new tr("Request aborted"))))})}async request({headers:e,signal:t}={}){return await this.constructRequest(e,t)}}class ch extends ff{constructor(e,t,n,s){super(),this.client=e,this.headers=t,this.maxRanges=n,this.allowFullFile=s,this._fileSize=null}async fetch(e,t){return this.maxRanges>=e.length?this.fetchSlices(e,t):(this.maxRanges>0&&e.length>1,Promise.all(e.map(n=>this.fetchSlice(n,t))))}async fetchSlices(e,t){const n=await this.client.request({headers:{...this.headers,Range:`bytes=${e.map(({offset:s,length:r})=>`${s}-${s+r}`).join(",")}`},signal:t});if(n.ok)if(n.status===206){const{type:s,params:r}=GM(n.getHeader("content-type"));if(s==="multipart/byteranges"){const m=HM(await n.getData(),r.boundary);return this._fileSize=m[0].fileSize||null,m}const a=await n.getData(),{start:c,end:u,total:d}=Rc(n.getHeader("content-range"));this._fileSize=d||null;const f=[{data:a,offset:c,length:u-c}];if(e.length>1){const m=await Promise.all(e.slice(1).map(v=>this.fetchSlice(v,t)));return f.concat(m)}return f}else{if(!this.allowFullFile)throw new Error("Server responded with full file");const s=await n.getData();return this._fileSize=s.byteLength,[{data:s,offset:0,length:s.byteLength}]}else throw new Error("Error fetching data.")}async fetchSlice(e,t){const{offset:n,length:s}=e,r=await this.client.request({headers:{...this.headers,Range:`bytes=${n}-${n+s}`},signal:t});if(r.ok)if(r.status===206){const a=await r.getData(),{total:c}=Rc(r.getHeader("content-range"));return this._fileSize=c||null,{data:a,offset:n,length:s}}else{if(!this.allowFullFile)throw new Error("Server responded with full file");const a=await r.getData();return this._fileSize=a.byteLength,{data:a,offset:0,length:a.byteLength}}else throw new Error("Error fetching data.")}get fileSize(){return this._fileSize}}function hh(i,{blockSize:e,cacheSize:t}){return e===null?i:new KM(i,{blockSize:e,cacheSize:t})}function iE(i,{headers:e={},credentials:t,maxRanges:n=0,allowFullFile:s=!1,...r}={}){const a=new JM(i,t),c=new ch(a,e,n,s);return hh(c,r)}function sE(i,{headers:e={},maxRanges:t=0,allowFullFile:n=!1,...s}={}){const r=new eE(i),a=new ch(r,e,t,n);return hh(a,s)}function rE(i,{headers:e={},maxRanges:t=0,allowFullFile:n=!1,...s}={}){const r=new nE(i),a=new ch(r,e,t,n);return hh(a,s)}function oE(i,{forceXHR:e=!1,...t}={}){return typeof fetch=="function"&&!e?iE(i,t):typeof XMLHttpRequest<"u"?sE(i,t):rE(i,t)}function Pc(i){switch(i){case Qe.BYTE:case Qe.ASCII:case Qe.SBYTE:case Qe.UNDEFINED:return 1;case Qe.SHORT:case Qe.SSHORT:return 2;case Qe.LONG:case Qe.SLONG:case Qe.FLOAT:case Qe.IFD:return 4;case Qe.RATIONAL:case Qe.SRATIONAL:case Qe.DOUBLE:case Qe.LONG8:case Qe.SLONG8:case Qe.IFD8:return 8;default:throw new RangeError(`Invalid field type: ${i}`)}}function aE(i){const e=i.GeoKeyDirectory;if(!e)return null;const t={};for(let n=4;n<=e[3]*4;n+=4){const s=_M[e[n]],r=e[n+1]?Pr[e[n+1]]:null,a=e[n+2],c=e[n+3];let u=null;if(!r)u=c;else{if(u=i[r],typeof u>"u"||u===null)throw new Error(`Could not get value of geoKey '${s}'.`);typeof u=="string"?u=u.substring(c,c+a-1):u.subarray&&(u=u.subarray(c,c+a),a===1&&(u=u[0]))}t[s]=u}return t}function Ds(i,e,t,n){let s=null,r=null;const a=Pc(e);switch(e){case Qe.BYTE:case Qe.ASCII:case Qe.UNDEFINED:s=new Uint8Array(t),r=i.readUint8;break;case Qe.SBYTE:s=new Int8Array(t),r=i.readInt8;break;case Qe.SHORT:s=new Uint16Array(t),r=i.readUint16;break;case Qe.SSHORT:s=new Int16Array(t),r=i.readInt16;break;case Qe.LONG:case Qe.IFD:s=new Uint32Array(t),r=i.readUint32;break;case Qe.SLONG:s=new Int32Array(t),r=i.readInt32;break;case Qe.LONG8:case Qe.IFD8:s=new Array(t),r=i.readUint64;break;case Qe.SLONG8:s=new Array(t),r=i.readInt64;break;case Qe.RATIONAL:s=new Uint32Array(t*2),r=i.readUint32;break;case Qe.SRATIONAL:s=new Int32Array(t*2),r=i.readInt32;break;case Qe.FLOAT:s=new Float32Array(t),r=i.readFloat32;break;case Qe.DOUBLE:s=new Float64Array(t),r=i.readFloat64;break;default:throw new RangeError(`Invalid field type: ${e}`)}if(e===Qe.RATIONAL||e===Qe.SRATIONAL)for(let c=0;c<t;c+=2)s[c]=r.call(i,n+c*a),s[c+1]=r.call(i,n+(c*a+4));else for(let c=0;c<t;++c)s[c]=r.call(i,n+c*a);return e===Qe.ASCII?new TextDecoder("utf-8").decode(s):s}class lE{constructor(e,t,n){this.fileDirectory=e,this.geoKeyDirectory=t,this.nextIFDByteOffset=n}}class Uo extends Error{constructor(e){super(`No image at index ${e}`),this.index=e}}class cE{async readRasters(e={}){const{window:t,width:n,height:s}=e;let{resX:r,resY:a,bbox:c}=e;const u=await this.getImage();let d=u;const f=await this.getImageCount(),m=u.getBoundingBox();if(t&&c)throw new Error('Both "bbox" and "window" passed.');if(n||s){if(t){const[b,y]=u.getOrigin(),[x,_]=u.getResolution();c=[b+t[0]*x,y+t[1]*_,b+t[2]*x,y+t[3]*_]}const g=c||m;if(n){if(r)throw new Error("Both width and resX passed");r=(g[2]-g[0])/n}if(s){if(a)throw new Error("Both width and resY passed");a=(g[3]-g[1])/s}}if(r||a){const g=[];for(let b=0;b<f;++b){const y=await this.getImage(b),{SubfileType:x,NewSubfileType:_}=y.fileDirectory;(b===0||x===2||_&1)&&g.push(y)}g.sort((b,y)=>b.getWidth()-y.getWidth());for(let b=0;b<g.length;++b){const y=g[b],x=(m[2]-m[0])/y.getWidth(),_=(m[3]-m[1])/y.getHeight();if(d=y,r&&r>x||a&&a>_)break}}let v=t;if(c){const[g,b]=u.getOrigin(),[y,x]=d.getResolution(u);v=[Math.round((c[0]-g)/y),Math.round((c[1]-b)/x),Math.round((c[2]-g)/y),Math.round((c[3]-b)/x)],v=[Math.min(v[0],v[2]),Math.min(v[1],v[3]),Math.max(v[0],v[2]),Math.max(v[1],v[3])]}return d.readRasters({...e,window:v})}}class uh extends cE{constructor(e,t,n,s,r={}){super(),this.source=e,this.littleEndian=t,this.bigTiff=n,this.firstIFDOffset=s,this.cache=r.cache||!1,this.ifdRequests=[],this.ghostValues=null}async getSlice(e,t){const n=this.bigTiff?4048:1024;return new zM((await this.source.fetch([{offset:e,length:typeof t<"u"?t:n}]))[0],e,this.littleEndian,this.bigTiff)}async parseFileDirectoryAt(e){const t=this.bigTiff?20:12,n=this.bigTiff?8:2;let s=await this.getSlice(e);const r=this.bigTiff?s.readUint64(e):s.readUint16(e),a=r*t+(this.bigTiff?16:6);s.covers(e,a)||(s=await this.getSlice(e,a));const c={};let u=e+(this.bigTiff?8:2);for(let m=0;m<r;u+=t,++m){const v=s.readUint16(u),g=s.readUint16(u+2),b=this.bigTiff?s.readUint64(u+4):s.readUint32(u+4);let y,x;const _=Pc(g),w=u+(this.bigTiff?12:8);if(_*b<=(this.bigTiff?8:4))y=Ds(s,g,b,w);else{const E=s.readOffset(w),M=Pc(g)*b;if(s.covers(E,M))y=Ds(s,g,b,E);else{const P=await this.getSlice(E,M);y=Ds(P,g,b,E)}}b===1&&gM.indexOf(v)===-1&&!(g===Qe.RATIONAL||g===Qe.SRATIONAL)?x=y[0]:x=y,c[Pr[v]]=x}const d=aE(c),f=s.readOffset(e+n+t*r);return new lE(c,d,f)}async requestIFD(e){if(this.ifdRequests[e])return this.ifdRequests[e];if(e===0)return this.ifdRequests[e]=this.parseFileDirectoryAt(this.firstIFDOffset),this.ifdRequests[e];if(!this.ifdRequests[e-1])try{this.ifdRequests[e-1]=this.requestIFD(e-1)}catch(t){throw t instanceof Uo?new Uo(e):t}return this.ifdRequests[e]=(async()=>{const t=await this.ifdRequests[e-1];if(t.nextIFDByteOffset===0)throw new Uo(e);return this.parseFileDirectoryAt(t.nextIFDByteOffset)})(),this.ifdRequests[e]}async getImage(e=0){const t=await this.requestIFD(e);return new BM(t.fileDirectory,t.geoKeyDirectory,this.dataView,this.littleEndian,this.cache,this.source)}async getImageCount(){let e=0,t=!0;for(;t;)try{await this.requestIFD(e),++e}catch(n){if(n instanceof Uo)t=!1;else throw n}return e}async getGhostValues(){const e=this.bigTiff?16:8;if(this.ghostValues)return this.ghostValues;const t="GDAL_STRUCTURAL_METADATA_SIZE=",n=t.length+100;let s=await this.getSlice(e,n);if(t===Ds(s,Qe.ASCII,t.length,e)){const a=Ds(s,Qe.ASCII,n,e).split(`
`)[0],c=Number(a.split("=")[1].split(" ")[0])+a.length;c>n&&(s=await this.getSlice(e,c));const u=Ds(s,Qe.ASCII,c,e);this.ghostValues={},u.split(`
`).filter(d=>d.length>0).map(d=>d.split("=")).forEach(([d,f])=>{this.ghostValues[d]=f})}return this.ghostValues}static async fromSource(e,t,n){const s=(await e.fetch([{offset:0,length:1024}],n))[0],r=new kM(s),a=r.getUint16(0,0);let c;if(a===18761)c=!0;else if(a===19789)c=!1;else throw new TypeError("Invalid byte order value.");const u=r.getUint16(2,c);let d;if(u===42)d=!1;else if(u===43){if(d=!0,r.getUint16(4,c)!==8)throw new Error("Unsupported offset byte-size.")}else throw new TypeError("Invalid magic number.");const f=d?r.getUint64(8,c):r.getUint32(4,c);return new uh(e,c,d,f,t)}close(){return typeof this.source.close=="function"?this.source.close():!1}}async function hE(i,e={},t){return uh.fromSource(oE(i,e),t)}function uE(i){const e=/[\u0000]$/g;return i.trim().replace(e,"").trim()}function dE(i){const e=new DOMParser;try{return e.parseFromString(i,"text/xml").getElementsByTagName("OME")[0]}catch(t){throw new Or("Could not find OME metadata in TIFF file",{type:Nr.INVALID_METADATA,cause:t})}}class pE{constructor(){this.sizex=0,this.sizey=0,this.sizez=1,this.sizec=1,this.sizet=1,this.unit="",this.pixeltype="",this.dimensionorder="",this.pixelsizex=1,this.pixelsizey=1,this.pixelsizez=1,this.channelnames=[]}}function ip(i){const t={uint8:"uint8",uint16:"uint16",uint32:"uint32",int8:"int8",int16:"int16",int32:"int32",float:"float32"}[i];return t===void 0?(console.warn(`Unsupported OME pixel type ${i}; defaulting to uint8`),"uint8"):t}function sp(i,e){const t=i.getAttribute(e);if(t===null)throw new Or(`Missing attribute ${e} in OME-TIFF metadata`,{type:Nr.INVALID_METADATA});return t}function fE(i){const e=new pE,t=i.getElementsByTagName("Pixels")[0];e.sizex=Number(sp(t,"SizeX")),e.sizey=Number(sp(t,"SizeY")),e.sizez=Number(t.getAttribute("SizeZ")),e.sizec=Number(t.getAttribute("SizeC")),e.sizet=Number(t.getAttribute("SizeT")),e.unit=t.getAttribute("PhysicalSizeXUnit")||"",e.pixeltype=t.getAttribute("Type")||"",e.dimensionorder=t.getAttribute("DimensionOrder")||"XYZCT",e.pixelsizex=Number(t.getAttribute("PhysicalSizeX")),e.pixelsizey=Number(t.getAttribute("PhysicalSizeY")),e.pixelsizez=Number(t.getAttribute("PhysicalSizeZ"));const n=t.getElementsByTagName("Channel");for(let s=0;s<n.length;++s){const r=n[s].getAttribute("Name"),a=n[s].getAttribute("ID");e.channelnames.push(r||a||"Channel"+s)}return e}const mE=i=>i==="uint8"?1:i==="uint16"?2:4;class gE extends kr{constructor(e){super(),this.url=e}async loadOmeDims(){if(!this.dims){const t=await(await hE(this.url,{allowFullFile:!0}).catch(qd(`Could not open TIFF file at ${this.url}`,Nr.NOT_FOUND))).getImage().catch(qd("Failed to open TIFF image",Nr.NOT_FOUND)),n=uE(t.getFileDirectory().ImageDescription),r=dE(n).getElementsByTagName("Image")[0];this.dims=fE(r)}return this.dims}async loadDims(e){const t=await this.loadOmeDims(),n=Ac(t.sizez,t.sizex,t.sizey),s=Ur,r=Math.floor(s/n.x),a=Math.floor(s/n.y);return[{shape:[t.sizet,t.sizec,t.sizez,a,r],spacing:[1,1,t.pixelsizez,t.pixelsizey*t.sizey/a,t.pixelsizex*t.sizex/r],spaceUnit:t.unit?t.unit:"micron",dataType:ip(t.pixeltype),timeUnit:"s"}]}async createImageInfo(e){const t=await this.loadOmeDims(),n=Ac(t.sizez,t.sizex,t.sizey),s=Ur,r=Math.floor(s/n.x),a=Math.floor(s/n.y);return{imageInfo:{name:"TEST",atlasTileDims:[n.x,n.y],subregionSize:[r,a,t.sizez],subregionOffset:[0,0,0],combinedNumChannels:t.sizec,channelNames:t.channelnames,multiscaleLevel:0,multiscaleLevelDims:[{shape:[t.sizet,t.sizec,t.sizez,a,r],spacing:[1,1,t.pixelsizez,t.pixelsizey*t.sizey/a,t.pixelsizex*t.sizex/r],spaceUnit:t.unit||"",timeUnit:"",dataType:ip(t.pixeltype)}],transform:{translation:[0,0,0],rotation:[0,0,0],scale:[1,1,1]}},loadSpec:new ma}}async loadRawChannelData(e,t,n,s){const r=await this.loadOmeDims(),c=new fa(e).volumeSize,u=[];for(let d=0;d<e.combinedNumChannels;++d){const f=new Promise((m,v)=>{const g={channel:d,tilesizex:c.x,tilesizey:c.y,sizec:e.combinedNumChannels,sizez:c.z,dimensionOrder:r.dimensionorder,bytesPerSample:mE(r.pixeltype),url:this.url},b=new Worker(new URL("/assets/FetchTiffWorker-CKjuSY7C.js",import.meta.url),{type:"module"});b.onmessage=y=>{if(y.data.isError){v(Zp(y.data.error));return}const{data:x,dtype:_,channel:w,range:E}=y.data;s([w],[_],[x],[E]),b.terminate(),m()},b.postMessage(g)});u.push(f)}await Promise.all(u)}}var Ut=(i=>(i.ZARR="zarr",i.JSON="json",i.TIFF="tiff",i.DATA="data",i))(Ut||{});function vE(i){return i.endsWith(".json")?"json":i.endsWith(".tif")||i.endsWith(".tiff")?"tiff":"zarr"}var No={exports:{}},rp;function _E(){return rp||(rp=1,function(i,e){Object.defineProperty(e,"__esModule",{value:!0});function t(n,s,r){r===void 0&&(r=!1),r&&(s=s/n,n=1);var a=[],c=0,u=0,d,f=function(){var m=c+s,v=Date.now();if(v<m){d!==void 0&&clearTimeout(d),d=setTimeout(f,m-v);return}c=v,u=0;for(var g=0,b=a.splice(0,n);g<b.length;g++){var y=b[g];u++,y()}a.length?d=setTimeout(f,s):d=void 0};return function(m){return new Promise(function(v,g){var b=function(){return Promise.resolve().then(m).then(v).catch(g)},y=Date.now();d===void 0&&y-c>s&&(c=y,u=0),u++<n?b():(a.push(b),d===void 0&&(d=setTimeout(f,c+s-y)))})}}i.exports=t,e.default=t}(No,No.exports)),No.exports}var xE=_E();const bE=eh(xE);var si=(i=>(i[i.INIT=0]="INIT",i[i.CREATE_LOADER=1]="CREATE_LOADER",i[i.CREATE_VOLUME=2]="CREATE_VOLUME",i[i.LOAD_DIMS=3]="LOAD_DIMS",i[i.LOAD_VOLUME_DATA=4]="LOAD_VOLUME_DATA",i[i.SET_PREFETCH_PRIORITY_DIRECTIONS=5]="SET_PREFETCH_PRIORITY_DIRECTIONS",i[i.SYNCHRONIZE_MULTICHANNEL_LOADING=6]="SYNCHRONIZE_MULTICHANNEL_LOADING",i[i.UPDATE_FETCH_OPTIONS=7]="UPDATE_FETCH_OPTIONS",i))(si||{}),Lc=(i=>(i[i.SUCCESS=0]="SUCCESS",i[i.ERROR=1]="ERROR",i[i.EVENT=2]="EVENT",i))(Lc||{}),Ic=(i=>(i[i.METADATA_UPDATE=0]="METADATA_UPDATE",i[i.CHANNEL_LOAD=1]="CHANNEL_LOAD",i))(Ic||{});function op(i){return{...i,subregion:new fn(new I().copy(i.subregion.min),new I().copy(i.subregion.max))}}const yE=bE(1,16);class wE{constructor(){this.pendingRequests=[],this.workerOpen=!0,this.throttleChannelData=!1,this.onChannelData=void 0,this.onUpdateMetadata=void 0,this.worker=new Worker(new URL("/assets/VolumeLoadWorker-CxoZg4Rx.js",import.meta.url),{type:"module"}),this.worker.onmessage=this.receiveMessage.bind(this)}registerMessagePromise(e){for(const[t,n]of this.pendingRequests.entries())if(n===void 0)return this.pendingRequests[t]=e,t;return this.pendingRequests.push(e)-1}get isOpen(){return this.workerOpen}close(){this.worker.terminate(),this.workerOpen=!1}sendMessage(e,t){let n=-1;const s=new Promise((a,c)=>{n=this.registerMessagePromise({type:e,resolve:a,reject:c})}),r={msgId:n,type:e,payload:t};return this.worker.postMessage(r),s}receiveMessage({data:e}){var t;if(e.responseResult===Lc.EVENT)e.eventType===Ic.CHANNEL_LOAD?this.onChannelData&&(this.throttleChannelData?yE(()=>this.onChannelData?this.onChannelData(e):{}):this.onChannelData&&this.onChannelData(e)):e.eventType===Ic.METADATA_UPDATE&&((t=this.onUpdateMetadata)==null||t.call(this,e));else{const n=this.pendingRequests[e.msgId];if(n===void 0)throw new Error(`Received response for unknown message ID ${e.msgId}`);if(n.type!==e.type)throw new Error(`Received response of type ${e.type} for message of type ${n.type}`);e.responseResult===Lc.ERROR?n.reject(Zp(e.payload)):n.resolve(e.payload),this.pendingRequests[e.msgId]=void 0}}setThrottleChannelData(e){this.throttleChannelData=e}}class SE{constructor(e,t,n){this.activeLoader=void 0,this.activeLoaderId=-1,this.workerHandle=new wE,this.openPromise=this.workerHandle.sendMessage(si.INIT,{maxCacheSize:e,maxActiveRequests:t,maxLowPriorityRequests:n})}onOpen(){return this.workerHandle.isOpen?this.openPromise:Promise.reject("Worker is closed")}close(){var e;this.workerHandle.close(),(e=this.activeLoader)==null||e.close()}async createLoader(e,t){var a;const n=Array.isArray(e)?e[0]:e,s=(t==null?void 0:t.fileType)||vE(n);if(s===Ut.TIFF)return new gE(n);if(s===Ut.DATA){if(!(t!=null&&t.rawArrayOptions))throw new Error("Failed to create loader: Must provide RawArrayOptions for RawArrayLoader");return new FS(t.rawArrayOptions.data,t.rawArrayOptions.metadata)}if(!await this.workerHandle.sendMessage(si.CREATE_LOADER,{path:e,options:t}))throw new Error("Failed to create loader");return(a=this.activeLoader)==null||a.close(),this.activeLoaderId+=1,this.activeLoader=new ME(this.activeLoaderId,this.workerHandle),this.activeLoader}setThrottleChannelData(e){this.workerHandle.setThrottleChannelData(e)}getActiveLoader(){return this.activeLoader}}class ME extends kr{constructor(e,t){super(),this.loaderId=e,this.workerHandle=t,this.isOpen=!0,this.currentLoadId=-1,this.currentLoadCallback=void 0,this.currentMetadataUpdateCallback=void 0,t.onChannelData=this.onChannelData.bind(this),t.onUpdateMetadata=this.onUpdateMetadata.bind(this)}checkIsOpen(){if(!this.isOpen||!this.workerHandle.isOpen)throw new Error("Tried to use a closed loader")}close(){this.isOpen=!1}setPrefetchPriority(e){return this.workerHandle.sendMessage(si.SET_PREFETCH_PRIORITY_DIRECTIONS,e)}updateFetchOptions(e){return this.workerHandle.sendMessage(si.UPDATE_FETCH_OPTIONS,e)}syncMultichannelLoading(e){return this.workerHandle.sendMessage(si.SYNCHRONIZE_MULTICHANNEL_LOADING,e)}loadDims(e){return this.checkIsOpen(),this.workerHandle.sendMessage(si.LOAD_DIMS,e)}async createImageInfo(e){this.checkIsOpen();const{imageInfo:t,loadSpec:n}=await this.workerHandle.sendMessage(si.CREATE_VOLUME,e);return{imageInfo:t,loadSpec:op(n)}}loadRawChannelData(e,t,n,s){return this.checkIsOpen(),this.currentLoadCallback=s,this.currentMetadataUpdateCallback=n,this.currentLoadId+=1,this.workerHandle.sendMessage(si.LOAD_VOLUME_DATA,{imageInfo:e,loadSpec:t,loaderId:this.loaderId,loadId:this.currentLoadId})}onChannelData(e){var t;e.loaderId!==this.loaderId||e.loadId!==this.currentLoadId||(t=this.currentLoadCallback)==null||t.call(this,e.channelIndex,e.dtype,e.data,e.ranges,e.atlasDims)}onUpdateMetadata(e){var s;if(e.loaderId!==this.loaderId||e.loadId!==this.currentLoadId)return;const t=e.imageInfo,n=e.loadSpec&&op(e.loadSpec);(s=this.currentMetadataUpdateCallback)==null||s.call(this,t,n)}}class EE extends kr{async loadDims(e){return[{shape:[1,2,27,600,600],spacing:[1,1,2,1,1],spaceUnit:"",dataType:"uint8",timeUnit:""}]}async createImageInfo(e){return{imageInfo:{name:"TEST",atlasTileDims:[27,1],subregionSize:[600,600,27],subregionOffset:[0,0,0],combinedNumChannels:2,channelNames:["DNA","Structure"],multiscaleLevel:0,multiscaleLevelDims:[{shape:[1,2,27,600,600],spacing:[1,1,2,1,1],spaceUnit:"µm",timeUnit:"",dataType:"uint8"}],transform:{translation:[0,0,0],rotation:[0,0,0],scale:[1,1,1]}},loadSpec:new ma}}loadRawChannelData(e,t,n,s){const r=[{name:"https://opencell.czbiohub.org/data/opencell-microscopy/roi/czML0383-P0007/czML0383-P0007-A02-PML0308-S13_ROI-0424-0025-0600-0600-LQTILE-CH405.jpg",channels:[0]},{name:"https://opencell.czbiohub.org/data/opencell-microscopy/roi/czML0383-P0007/czML0383-P0007-A02-PML0308-S13_ROI-0424-0025-0600-0600-LQTILE-CH488.jpg",channels:[1]}],[a,c]=Yp(e);return va.loadVolumeAtlasData(r,(u,d,f)=>s(u,d,f,f.map(na),[a,c]))}}const AE=1e9,CE=8,TE=3,RE=[5,5,5,5],PE=25,LE=80,ap={timeSeries:{type:Ut.JSON,url:"https://animatedcell-test-data.s3.us-west-2.amazonaws.com/timelapse/test_parent_T49.ome_%%_atlas.json",times:46},omeTiff:{type:Ut.TIFF,url:"https://animatedcell-test-data.s3.us-west-2.amazonaws.com/AICS-12_881.ome.tif"},zarrEMT:{url:"https://dev-aics-dtp-001.int.allencell.org/dan-data/3500005818_20230811__20x_Timelapse-02(P27-E7).ome.zarr",type:Ut.ZARR},zarrIDR1:{type:Ut.ZARR,url:"https://uk1s3.embassy.ebi.ac.uk/idr/zarr/v0.4/idr0076A/10501752.zarr"},zarrIDR2:{type:Ut.ZARR,url:"https://uk1s3.embassy.ebi.ac.uk/idr/zarr/v0.4/idr0054A/5025553.zarr"},zarrVariance:{type:Ut.ZARR,url:"https://animatedcell-test-data.s3.us-west-2.amazonaws.com/variance/1.zarr"},zarrNucmorph0:{type:Ut.ZARR,url:"https://animatedcell-test-data.s3.us-west-2.amazonaws.com/20200323_F01_001/P13-C4.zarr/"},zarrNucmorph1:{type:Ut.ZARR,url:"https://animatedcell-test-data.s3.us-west-2.amazonaws.com/20200323_F01_001/P15-C3.zarr/"},zarrNucmorph2:{type:Ut.ZARR,url:"https://animatedcell-test-data.s3.us-west-2.amazonaws.com/20200323_F01_001/P7-B4.zarr/"},zarrNucmorph3:{type:Ut.ZARR,url:"https://animatedcell-test-data.s3.us-west-2.amazonaws.com/20200323_F01_001/P8-B4.zarr/"},zarrFlyBrain:{type:Ut.ZARR,url:"https://uk1s3.embassy.ebi.ac.uk/idr/zarr/v0.4/idr0048A/9846152.zarr/"},zarrUK:{type:Ut.ZARR,url:"https://uk1s3.embassy.ebi.ac.uk/idr/zarr/v0.4/idr0062A/6001240.zarr"},opencell:{type:"opencell",url:""},cfeJson:{type:Ut.JSON,url:"AICS-12_881_atlas.json"},abm:{type:Ut.TIFF,url:"https://animatedcell-test-data.s3.us-west-2.amazonaws.com/HAMILTONIAN_TERM_FOV_VSAHJUP_0000_000192.ome.tif"},procedural:{type:Ut.DATA,url:""}};let ue;const Dc=new SE(AE,CE,TE),T={file:"",volume:new jp,currentFrame:0,lastFrameTime:0,isPlaying:!1,timerId:0,loader:new va("https://animatedcell-test-data.s3.us-west-2.amazonaws.com/timelapse/test_parent_T49.ome_%%_atlas.json"),density:12.5,maskAlpha:1,exposure:.75,aperture:0,fov:20,focalDistance:4,lights:[new er(pa),new er(da)],skyTopIntensity:.3,skyMidIntensity:.3,skyBotIntensity:.3,skyTopColor:[255,255,255],skyMidColor:[255,255,255],skyBotColor:[255,255,255],lightColor:[255,255,255],lightIntensity:75,lightTheta:14,lightPhi:54,xmin:0,ymin:0,zmin:0,xmax:1,ymax:1,zmax:1,samplingRate:.25,primaryRay:1,secondaryRay:1,isPT:!1,isMP:!1,interpolationActive:!0,isTurntable:!1,isAxisShowing:!1,isAligned:!0,showScaleBar:!0,showBoundingBox:!1,boundingBoxColor:[255,255,0],backgroundColor:[0,0,0],flipX:1,flipY:1,flipZ:1,channelFolderNames:[],channelGui:[],currentImageStore:"",currentImageName:""},xa=()=>T.totalFrames||T.volume.imageInfo.times;function mf(i){return i/50}function IE(){T.lights[0].mColorTop=new I(T.skyTopColor[0]/255*T.skyTopIntensity,T.skyTopColor[1]/255*T.skyTopIntensity,T.skyTopColor[2]/255*T.skyTopIntensity),T.lights[0].mColorMiddle=new I(T.skyMidColor[0]/255*T.skyMidIntensity,T.skyMidColor[1]/255*T.skyMidIntensity,T.skyMidColor[2]/255*T.skyMidIntensity),T.lights[0].mColorBottom=new I(T.skyBotColor[0]/255*T.skyBotIntensity,T.skyBotColor[1]/255*T.skyBotIntensity,T.skyBotColor[2]/255*T.skyBotIntensity),T.lights[1].mTheta=T.lightTheta*Math.PI/180,T.lights[1].mPhi=T.lightPhi*Math.PI/180,T.lights[1].mColor=new I(T.lightColor[0]/255*T.lightIntensity,T.lightColor[1]/255*T.lightIntensity,T.lightColor[2]/255*T.lightIntensity),ue.updateLights(T.lights)}function DE(){T.isPT&&T.isMP&&(T.isMP=!1),ue.setVolumeRenderMode(T.isPT?Wp:Hp),ue.setMaxProjectMode(T.volume,T.isMP)}let Dn;function UE(){Dn=new Qc,Dn.add(T,"density").max(100).min(0).step(.001).onChange(function(n){ue.updateDensity(T.volume,mf(n))}),Dn.add(T,"maskAlpha").max(1).min(0).step(.001).onChange(function(n){ue.updateMaskAlpha(T.volume,n)}),Dn.add(T,"primaryRay").max(40).min(1).step(.1).onChange(function(){ue.setRayStepSizes(T.volume,T.primaryRay,T.secondaryRay)}),Dn.add(T,"secondaryRay").max(40).min(1).step(.1).onChange(function(){ue.setRayStepSizes(T.volume,T.primaryRay,T.secondaryRay)});const i=Dn.addFolder("Camera").close();i.add(T,"exposure").max(1).min(0).step(.001).onChange(function(n){ue.updateExposure(n)}),i.add(T,"aperture").max(.1).min(0).step(.001).onChange(function(){ue.updateCamera(T.fov,T.focalDistance,T.aperture)}),i.add(T,"focalDistance").max(5).min(.1).step(.001).onChange(function(){ue.updateCamera(T.fov,T.focalDistance,T.aperture)}),i.add(T,"fov").max(90).min(0).step(.001).onChange(function(){ue.updateCamera(T.fov,T.focalDistance,T.aperture)}),i.add(T,"samplingRate").max(1).min(.1).step(.001).onChange(function(n){ue.updatePixelSamplingRate(n)});const e=Dn.addFolder("Clipping Box").close();e.add(T,"xmin").max(1).min(0).step(.001).onChange(function(){ue.updateClipRegion(T.volume,T.xmin,T.xmax,T.ymin,T.ymax,T.zmin,T.zmax)}),e.add(T,"xmax").max(1).min(0).step(.001).onChange(function(){ue.updateClipRegion(T.volume,T.xmin,T.xmax,T.ymin,T.ymax,T.zmin,T.zmax)}),e.add(T,"ymin").max(1).min(0).step(.001).onChange(function(){ue.updateClipRegion(T.volume,T.xmin,T.xmax,T.ymin,T.ymax,T.zmin,T.zmax)}),e.add(T,"ymax").max(1).min(0).step(.001).onChange(function(){ue.updateClipRegion(T.volume,T.xmin,T.xmax,T.ymin,T.ymax,T.zmin,T.zmax)}),e.add(T,"zmin").max(1).min(0).step(.001).onChange(function(){ue.updateClipRegion(T.volume,T.xmin,T.xmax,T.ymin,T.ymax,T.zmin,T.zmax)}),e.add(T,"zmax").max(1).min(0).step(.001).onChange(function(){ue.updateClipRegion(T.volume,T.xmin,T.xmax,T.ymin,T.ymax,T.zmin,T.zmax)});const t=Dn.addFolder("Lighting").close();t.addColor(T,"skyTopColor",255).name("Sky Top").onChange(function(){T.lights[0].mColorTop=new I(T.skyTopColor[0]/255*T.skyTopIntensity,T.skyTopColor[1]/255*T.skyTopIntensity,T.skyTopColor[2]/255*T.skyTopIntensity),ue.updateLights(T.lights)}),t.add(T,"skyTopIntensity").max(100).min(.01).step(.1).onChange(function(){T.lights[0].mColorTop=new I(T.skyTopColor[0]/255*T.skyTopIntensity,T.skyTopColor[1]/255*T.skyTopIntensity,T.skyTopColor[2]/255*T.skyTopIntensity),ue.updateLights(T.lights)}),t.addColor(T,"skyMidColor",255).name("Sky Mid").onChange(function(){T.lights[0].mColorMiddle=new I(T.skyMidColor[0]/255*T.skyMidIntensity,T.skyMidColor[1]/255*T.skyMidIntensity,T.skyMidColor[2]/255*T.skyMidIntensity),ue.updateLights(T.lights)}),t.add(T,"skyMidIntensity").max(100).min(.01).step(.1).onChange(function(){T.lights[0].mColorMiddle=new I(T.skyMidColor[0]/255*T.skyMidIntensity,T.skyMidColor[1]/255*T.skyMidIntensity,T.skyMidColor[2]/255*T.skyMidIntensity),ue.updateLights(T.lights)}),t.addColor(T,"skyBotColor",255).name("Sky Bottom").onChange(function(){T.lights[0].mColorBottom=new I(T.skyBotColor[0]/255*T.skyBotIntensity,T.skyBotColor[1]/255*T.skyBotIntensity,T.skyBotColor[2]/255*T.skyBotIntensity),ue.updateLights(T.lights)}),t.add(T,"skyBotIntensity").max(100).min(.01).step(.1).onChange(function(){T.lights[0].mColorBottom=new I(T.skyBotColor[0]/255*T.skyBotIntensity,T.skyBotColor[1]/255*T.skyBotIntensity,T.skyBotColor[2]/255*T.skyBotIntensity),ue.updateLights(T.lights)}),t.add(T.lights[1],"mDistance").max(10).min(0).step(.1).onChange(function(){ue.updateLights(T.lights)}),t.add(T,"lightTheta").max(180).min(-180).step(1).onChange(function(n){T.lights[1].mTheta=n*Math.PI/180,ue.updateLights(T.lights)}),t.add(T,"lightPhi").max(180).min(0).step(1).onChange(function(n){T.lights[1].mPhi=n*Math.PI/180,ue.updateLights(T.lights)}),t.add(T.lights[1],"mWidth").max(100).min(.01).step(.1).onChange(function(n){T.lights[1].mWidth=n,T.lights[1].mHeight=n,ue.updateLights(T.lights)}),t.add(T,"lightIntensity").max(1e3).min(.01).step(.1).onChange(function(){T.lights[1].mColor=new I(T.lightColor[0]/255*T.lightIntensity,T.lightColor[1]/255*T.lightIntensity,T.lightColor[2]/255*T.lightIntensity),ue.updateLights(T.lights)}),t.addColor(T,"lightColor",255).name("lightColor").onChange(function(){T.lights[1].mColor=new I(T.lightColor[0]/255*T.lightIntensity,T.lightColor[1]/255*T.lightIntensity,T.lightColor[2]/255*T.lightIntensity),ue.updateLights(T.lights)}),IE()}function NE(i){const e=Dn.folders.find(t=>t._title===i);e&&(e.close(),e.destroy())}function OE(){const i=xa(),e=document.getElementById("timeSlider");e&&(e.max=`${i-1}`);const t=document.getElementById("timeValue");t&&(t.max=`${i-1}`);const n=document.getElementById("playBtn");i<2?n.disabled=!0:n.disabled=!1;const s=document.getElementById("pauseBtn");i<2?s.disabled=!0:s.disabled=!1}function FE(i,e){const t=i.channels[e],n=i.imageInfo.channelNames,s=Dn.folders.find(a=>a._title==="Channel "+n[e]);if(!s)return;const r=s.controllers.find(a=>a._name==="isovalue");r&&(r.min(t.rawMin),r.max(t.rawMax))}function BE(i){const e=document.getElementById("zSlider"),t=document.getElementById("zValue"),n=i.imageInfo.volumeSize.z;e.max=`${n-1}`,t.max=`${n-1}`,t.value=`${Math.floor(n/2)}`,e.value=`${Math.floor(n/2)}`}function kE(i){if(T.channelFolderNames)for(let n=0;n<T.channelFolderNames.length;++n)NE(T.channelFolderNames[n]);const e=i.imageInfo.numChannels,t=i.imageInfo.channelNames;T.channelGui=[],T.channelFolderNames=[];for(let n=0;n<e;++n){T.channelGui.push({colorD:i.channelColorsDefault[n],colorS:[0,0,0],colorE:[0,0,0],window:1,level:.5,glossiness:0,isovalue:128,isosurface:!1,enabled:n<3,reset:function(r){return function(){const a=new ni().createFullRange();i.setLut(r,a),ue.updateLuts(i)}}(n),autoIJ:function(r){return function(){const[a,c]=i.getHistogram(r).findAutoIJBins(),u=new ni().createFromMinMax(a,c);i.setLut(r,u),ue.updateLuts(i)}}(n),auto0:function(r){return function(){const[a,c]=i.getHistogram(r).findAutoMinMax(),u=new ni().createFromMinMax(a,c);i.setLut(r,u),ue.updateLuts(i)}}(n),bestFit:function(r){return function(){const[a,c]=i.getHistogram(r).findBestFitBins(),u=new ni().createFromMinMax(a,c);i.setLut(r,u),ue.updateLuts(i)}}(n),pct50_98:function(r){return function(){const a=i.getHistogram(r).findBinOfPercentile(.5),c=i.getHistogram(r).findBinOfPercentile(.983),u=new ni().createFromMinMax(a,c);i.setLut(r,u),ue.updateLuts(i)}}(n),colorizeEnabled:!1,colorize:function(r){return function(){const a=new ni().createLabelColors(i.getHistogram(r));i.setColorPalette(r,a.lut),T.channelGui[r].colorizeEnabled=!T.channelGui[r].colorizeEnabled,T.channelGui[r].colorizeEnabled?i.setColorPaletteAlpha(r,T.channelGui[r].colorizeAlpha):i.setColorPaletteAlpha(r,0),ue.updateLuts(i)}}(n),colorizeAlpha:0});const s=Dn.addFolder("Channel "+t[n]);n>0&&s.close(),T.channelFolderNames.push("Channel "+t[n]),s.add(T.channelGui[n],"enabled").onChange(function(r){return function(a){ue.setVolumeChannelEnabled(i,r,!!a),ue.updateActiveChannels(i)}}(n)),s.add(T.channelGui[n],"isosurface").onChange(function(r){return function(a){ue.setVolumeChannelOptions(i,r,{isosurfaceEnabled:a})}}(n)),s.add(T.channelGui[n],"isovalue").max(255).min(0).step(1).onChange(function(r){return function(a){ue.setVolumeChannelOptions(i,r,{isovalue:a})}}(n)),s.addColor(T.channelGui[n],"colorD",255).name("Diffuse").onChange(function(r){return function(){ue.updateChannelMaterial(i,r,T.channelGui[r].colorD,T.channelGui[r].colorS,T.channelGui[r].colorE,T.channelGui[r].glossiness),ue.updateMaterial(i)}}(n)),s.addColor(T.channelGui[n],"colorS",255).name("Specular").onChange(function(r){return function(){ue.updateChannelMaterial(i,r,T.channelGui[r].colorD,T.channelGui[r].colorS,T.channelGui[r].colorE,T.channelGui[r].glossiness),ue.updateMaterial(i)}}(n)),s.addColor(T.channelGui[n],"colorE",255).name("Emissive").onChange(function(r){return function(){ue.updateChannelMaterial(i,r,T.channelGui[r].colorD,T.channelGui[r].colorS,T.channelGui[r].colorE,T.channelGui[r].glossiness),ue.updateMaterial(i)}}(n)),s.add(T.channelGui[n],"window").max(1).min(0).step(.001).onChange(function(r){return function(a){const c=a,u=T.channelGui[r].level,d=new ni().createFromWindowLevel(c,u);i.setLut(r,d),ue.updateLuts(i)}}(n)),s.add(T.channelGui[n],"level").max(1).min(0).step(.001).onChange(function(r){return function(a){const c=T.channelGui[r].window,u=a,d=new ni().createFromWindowLevel(c,u);i.setLut(r,d),ue.updateLuts(i)}}(n)),s.add(T.channelGui[n],"reset"),s.add(T.channelGui[n],"autoIJ"),s.add(T.channelGui[n],"auto0"),s.add(T.channelGui[n],"bestFit"),s.add(T.channelGui[n],"pct50_98"),s.add(T.channelGui[n],"colorize"),s.add(T.channelGui[n],"colorizeAlpha").max(1).min(0).onChange(function(r){return function(a){T.channelGui[r].colorizeEnabled&&(i.setColorPaletteAlpha(r,a),ue.updateLuts(i))}}(n)),s.add(T.channelGui[n],"glossiness").max(100).min(0).onChange(function(r){return function(){ue.updateChannelMaterial(i,r,T.channelGui[r].colorD,T.channelGui[r].colorS,T.channelGui[r].colorE,T.channelGui[r].glossiness),ue.updateMaterial(i)}}(n))}}function zE(i,e){const t=i;ue.onVolumeData(t,[e]),ue.setVolumeChannelEnabled(t,e,T.channelGui[e].enabled),ue.updateActiveChannels(t),ue.updateLuts(t),t.isLoaded()&&console.log("currentVol with name "+t.name+" is loaded"),FE(t,e),ue.redraw()}function VE(i){const e=i.imageInfo;if(T.volume=i,ue.removeAllVolumes(),ue.addVolume(T.volume),DE(),ue.updateActiveChannels(T.volume),ue.updateLuts(T.volume),ue.updateLights(T.lights),ue.updateDensity(T.volume,mf(T.density)),ue.updateExposure(T.exposure),e.transform){const t=e.imageInfo.transform;ue.setVolumeTranslation(T.volume,T.volume.voxelsToWorldSpace(t.translation)),ue.setVolumeRotation(T.volume,t.rotation),ue.setVolumeScale(T.volume,t.scale)}OE(),BE(T.volume),kE(T.volume)}function GE(i){window.clearTimeout(T.timerId),T.loader.syncMultichannelLoading(!0),T.isPlaying=!0;const e=()=>{T.lastFrameTime=Date.now();const t=(T.currentFrame+1)%xa();ue.setTime(T.volume,t,n=>{if(n.isLoaded()&&(T.currentFrame=t,i(),T.isPlaying)){const s=Date.now()-T.lastFrameTime;T.timerId=window.setTimeout(e,LE-s)}})};e()}function Mi(){return T.currentFrame}function Oo(i){return console.log("going to Frame "+i),i>xa()-1||i<0?(console.log(`frame ${i} out of bounds`),!1):(ue.setTime(T.volume,i),T.currentFrame=i,!0)}function Cr(i){if(ue.setZSlice(T.volume,i)){const e=document.getElementById("zSlider"),t=document.getElementById("zValue");return t.value=`${i}`,e.value=`${i}`,!0}else return!1}function HE(i){const e=i.reduce((s,r)=>s+r.length,0),t=new Uint8Array(e);let n=0;for(const s of i)t.set(s,n),n+=s.length;return t}function WE(){const n={name:"AICS-10_5_5",sizeX:64,sizeY:64,sizeZ:64,sizeC:3,physicalPixelSize:[1,1,1],spatialUnit:"",channelNames:["DRAQ5","EGFP","SEG_Memb"]},s=[Ti.createSphere(64,64,64,24),Ti.createTorus(64,64,64,24,8),Ti.createCone(64,64,64,24,24)],r=HE(s);return{metadata:n,data:{dtype:"uint8",shape:[s.length,64,64,64],buffer:new DataView(r.buffer)}}}async function XE(i){if(i.type==="opencell")return new EE;await Dc.onOpen();const e={};let t=i.url;if(i.type===Ut.JSON){t=[];const n=i.times||0;for(let s=0;s<=n;s++)t.push(i.url.replace("%%",s.toString()))}else if(i.type===Ut.DATA){const n=WE();e.fileType=Ut.DATA,e.rawArrayOptions={data:n.data,metadata:n.metadata}}return await Dc.createLoader(t,{...e,fetchOptions:{maxPrefetchDistance:RE,maxPrefetchChunks:PE}})}async function YE(i,e){const t=await e.loadDims(i);console.log(t);const n=await e.createVolume(i,zE);VE(n),e.loadVolumeData(n),Cr(Math.floor(n.imageInfo.subregionSize.z/2))}async function lp(i){T.loader=await XE(i);const e=new ma;T.totalFrames=i.times,YE(e,T.loader)}function Us(i){let e=Number(i[0]),t=Number(i[1]),n=Number(i[2]);(t>n||t<e)&&(t=.5*(e+n));const s=255;e/=s,n/=s,t/=s;const r=n-e,a=(t-e)/r;let c=4*a*a;return(t-.5)*(t-.5)<5e-4&&(c=1),[e,n,c]}function qE(){const i=document.getElementById("vol-e");if(!i)return;ue=new yS({parentElement:i}),ue.loaderContext=Dc;const e=document.getElementById("testData");e==null||e.addEventListener("change",({currentTarget:ce})=>{const re=ce==null?void 0:ce.value,Re=ap[re];Re&&lp(Re)});const t=document.getElementById("X");t==null||t.addEventListener("click",()=>{ue.setCameraMode("X")});const n=document.getElementById("Y");n==null||n.addEventListener("click",()=>{ue.setCameraMode("Y")});const s=document.getElementById("Z");s==null||s.addEventListener("click",()=>{ue.setCameraMode("Z")});const r=document.getElementById("3D");r==null||r.addEventListener("click",()=>{ue.setCameraMode("3D")});const a=document.getElementById("rotBtn");a==null||a.addEventListener("click",()=>{T.isTurntable=!T.isTurntable,ue.setAutoRotate(T.isTurntable)});const c=document.getElementById("axisBtn");c==null||c.addEventListener("click",()=>{T.isAxisShowing=!T.isAxisShowing,ue.setShowAxis(T.isAxisShowing)});const u=document.getElementById("showBoundingBox");u==null||u.addEventListener("click",()=>{T.showBoundingBox=!T.showBoundingBox,ue.setShowBoundingBox(T.volume,T.showBoundingBox)});const d=document.getElementById("showScaleBar");d==null||d.addEventListener("click",()=>{T.showScaleBar=!T.showScaleBar,ue.setShowScaleBar(T.showScaleBar)});function f(ce,re){const Re=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(ce);return Re?[parseInt(Re[1],16)/255,parseInt(Re[2],16)/255,parseInt(Re[3],16)/255]:re}const m=document.getElementById("boundingBoxColor");m==null||m.addEventListener("change",ce=>{var re;T.boundingBoxColor=f((re=ce.target)==null?void 0:re.value,T.boundingBoxColor),ue.setBoundingBoxColor(T.volume,T.boundingBoxColor)});const v=document.getElementById("backgroundColor");v==null||v.addEventListener("change",ce=>{var re;T.backgroundColor=f((re=ce.target)==null?void 0:re.value,T.backgroundColor),ue.setBackgroundColor(T.backgroundColor)});const g=document.getElementById("flipXBtn");g==null||g.addEventListener("click",()=>{T.flipX*=-1,ue.setFlipVolume(T.volume,T.flipX,T.flipY,T.flipZ)});const b=document.getElementById("flipYBtn");b==null||b.addEventListener("click",()=>{T.flipY*=-1,ue.setFlipVolume(T.volume,T.flipX,T.flipY,T.flipZ)});const y=document.getElementById("flipZBtn");y==null||y.addEventListener("click",()=>{T.flipZ*=-1,ue.setFlipVolume(T.volume,T.flipX,T.flipY,T.flipZ)});const x=document.getElementById("playBtn");x==null||x.addEventListener("click",()=>{T.currentFrame>=xa()-1&&(T.currentFrame=-1),GE(()=>{P&&(P.value=""+Mi()),M&&(M.value=""+Mi())})});const _=document.getElementById("pauseBtn");_==null||_.addEventListener("click",()=>{window.clearTimeout(T.timerId),T.isPlaying=!1,T.loader.syncMultichannelLoading(!1)});const w=document.getElementById("forwardBtn"),E=document.getElementById("backBtn"),M=document.getElementById("timeSlider"),P=document.getElementById("timeValue");w==null||w.addEventListener("click",()=>{Oo(Mi()+1)&&(P&&(P.value=""+Mi()),M&&(M.value=""+Mi()))}),E==null||E.addEventListener("click",()=>{Oo(Mi()-1)&&(P&&(P.value=""+Mi()),M&&(M.value=""+Mi()))}),M==null||M.addEventListener("change",()=>{Oo(M==null?void 0:M.valueAsNumber)&&P&&(P.value=M.value)}),P==null||P.addEventListener("change",()=>{Oo(P==null?void 0:P.valueAsNumber)&&M&&(M.value=P.value)});const D=document.getElementById("zforwardBtn"),O=document.getElementById("zbackBtn"),U=document.getElementById("zSlider"),L=document.getElementById("zValue");D==null||D.addEventListener("click",()=>{Cr((U==null?void 0:U.valueAsNumber)+1)}),O==null||O.addEventListener("click",()=>{Cr((U==null?void 0:U.valueAsNumber)-1)}),U==null||U.addEventListener("change",()=>{Cr(U==null?void 0:U.valueAsNumber)}),L==null||L.addEventListener("change",()=>{Cr(L==null?void 0:L.valueAsNumber)});const A=document.getElementById("xfBtn");A==null||A.addEventListener("click",()=>{T.isAligned=!T.isAligned,ue.setVolumeTranslation(T.volume,T.isAligned?T.volume.getTranslation():[0,0,0]),ue.setVolumeRotation(T.volume,T.isAligned?T.volume.getRotation():[0,0,0])});const F=document.getElementById("resetCamBtn");F==null||F.addEventListener("click",()=>{ue.resetCamera()});const q=document.getElementById("counter");q&&ue.setRenderUpdateListener(ce=>{q.innerHTML=""+ce});const X=document.getElementById("renderMode"),J=(ce,re)=>{T.isPT=ce,T.isMP=re,ue.setVolumeRenderMode(ce?Wp:Hp),ue.setMaxProjectMode(T.volume,re)};X==null||X.addEventListener("change",({currentTarget:ce})=>{const re=ce;re.value==="PT"?ue.hasWebGL2()&&J(!0,!1):re.value==="MP"?J(!1,!0):J(!1,!1)});const Q=document.getElementById("interpolateBtn");Q==null||Q.addEventListener("click",()=>{T.interpolationActive=!T.interpolationActive,ue.setInterpolationEnabled(T.volume,T.interpolationActive)});const te=document.getElementById("screenshotBtn");te==null||te.addEventListener("click",()=>{ue.capture(ce=>{const re=document.createElement("a");re.href=ce,re.download="screenshot.png",re.click()})});const ee=document.getElementById("gammaMin"),z=document.getElementById("gammaMax"),le=document.getElementById("gammaScale");ee==null||ee.addEventListener("change",({currentTarget:ce})=>{const re=Us([ee.valueAsNumber,le.valueAsNumber,z.valueAsNumber]);ue.setGamma(T.volume,re[0],re[1],re[2])}),ee==null||ee.addEventListener("input",({currentTarget:ce})=>{const re=Us([ee.valueAsNumber,le.valueAsNumber,z.valueAsNumber]);ue.setGamma(T.volume,re[0],re[1],re[2])}),z==null||z.addEventListener("change",({currentTarget:ce})=>{const re=Us([ee.valueAsNumber,le.valueAsNumber,z.valueAsNumber]);ue.setGamma(T.volume,re[0],re[1],re[2])}),z==null||z.addEventListener("input",({currentTarget:ce})=>{const re=Us([ee.valueAsNumber,le.valueAsNumber,z.valueAsNumber]);ue.setGamma(T.volume,re[0],re[1],re[2])}),le==null||le.addEventListener("change",({currentTarget:ce})=>{const re=Us([ee.valueAsNumber,le.valueAsNumber,z.valueAsNumber]);ue.setGamma(T.volume,re[0],re[1],re[2])}),le==null||le.addEventListener("input",({currentTarget:ce})=>{const re=Us([ee.valueAsNumber,le.valueAsNumber,z.valueAsNumber]);ue.setGamma(T.volume,re[0],re[1],re[2])}),UE(),lp(ap[e==null?void 0:e.value])}document.body.onload=()=>{qE()};export{oA as L,aA as a,eh as g};
