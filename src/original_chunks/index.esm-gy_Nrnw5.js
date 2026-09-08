import{aW as F,aP as Ie,cR as Ce,aX as ve,aN as xe,aO as De,aM as re,cS as Le,cT as Be,aR as Me}from"./index-D7OfHMJl.js";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const he="firebasestorage.googleapis.com",de="storageBucket",Fe=2*60*1e3,qe=10*60*1e3,He=1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d extends Me{constructor(e,n,s=0){super(W(e),`Firebase Storage: ${n} (${W(e)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,d.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return W(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var c;(function(t){t.UNKNOWN="unknown",t.OBJECT_NOT_FOUND="object-not-found",t.BUCKET_NOT_FOUND="bucket-not-found",t.PROJECT_NOT_FOUND="project-not-found",t.QUOTA_EXCEEDED="quota-exceeded",t.UNAUTHENTICATED="unauthenticated",t.UNAUTHORIZED="unauthorized",t.UNAUTHORIZED_APP="unauthorized-app",t.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",t.INVALID_CHECKSUM="invalid-checksum",t.CANCELED="canceled",t.INVALID_EVENT_NAME="invalid-event-name",t.INVALID_URL="invalid-url",t.INVALID_DEFAULT_BUCKET="invalid-default-bucket",t.NO_DEFAULT_BUCKET="no-default-bucket",t.CANNOT_SLICE_BLOB="cannot-slice-blob",t.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",t.NO_DOWNLOAD_URL="no-download-url",t.INVALID_ARGUMENT="invalid-argument",t.INVALID_ARGUMENT_COUNT="invalid-argument-count",t.APP_DELETED="app-deleted",t.INVALID_ROOT_OPERATION="invalid-root-operation",t.INVALID_FORMAT="invalid-format",t.INTERNAL_ERROR="internal-error",t.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(c||(c={}));function W(t){return"storage/"+t}function J(){const t="An unknown error occurred, please check the error payload for server response.";return new d(c.UNKNOWN,t)}function ze(t){return new d(c.OBJECT_NOT_FOUND,"Object '"+t+"' does not exist.")}function $e(t){return new d(c.QUOTA_EXCEEDED,"Quota for bucket '"+t+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function je(){const t="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new d(c.UNAUTHENTICATED,t)}function Xe(){return new d(c.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Ge(t){return new d(c.UNAUTHORIZED,"User does not have permission to access '"+t+"'.")}function fe(){return new d(c.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function _e(){return new d(c.CANCELED,"User canceled the upload/download.")}function Ve(t){return new d(c.INVALID_URL,"Invalid URL '"+t+"'.")}function We(t){return new d(c.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+t+"'.")}function Ke(){return new d(c.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+de+"' property when initializing the app?")}function pe(){return new d(c.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function Ze(){return new d(c.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function Ye(){return new d(c.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function Je(t){return new d(c.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function Y(t){return new d(c.INVALID_ARGUMENT,t)}function me(){return new d(c.APP_DELETED,"The Firebase app was deleted.")}function Qe(t){return new d(c.INVALID_ROOT_OPERATION,"The operation '"+t+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function M(t,e){return new d(c.INVALID_FORMAT,"String does not match format '"+t+"': "+e)}function B(t){throw new d(c.INTERNAL_ERROR,"Internal error: "+t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k{constructor(e,n){this.bucket=e,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,n){let s;try{s=k.makeFromUrl(e,n)}catch{return new k(e,"")}if(s.path==="")return s;throw We(e)}static makeFromUrl(e,n){let s=null;const r="([A-Za-z0-9.\\-_]+)";function i(b){b.path.charAt(b.path.length-1)==="/"&&(b.path_=b.path_.slice(0,-1))}const o="(/(.*))?$",u=new RegExp("^gs://"+r+o,"i"),a={bucket:1,path:3};function l(b){b.path_=decodeURIComponent(b.path)}const h="v[A-Za-z0-9_]+",f=n.replace(/[.]/g,"\\."),p="(/([^?#]*).*)?$",m=new RegExp(`^https?://${f}/${h}/b/${r}/o${p}`,"i"),g={bucket:1,path:3},y=n===he?"(?:storage.googleapis.com|storage.cloud.google.com)":n,_="([^?#]*)",U=new RegExp(`^https?://${y}/${r}/${_}`,"i"),R=[{regex:u,indices:a,postModify:i},{regex:m,indices:g,postModify:l},{regex:U,indices:{bucket:1,path:2},postModify:l}];for(let b=0;b<R.length;b++){const C=R[b],v=C.regex.exec(e);if(v){const G=v[C.indices.bucket];let L=v[C.indices.path];L||(L=""),s=new k(G,L),C.postModify(s);break}}if(s==null)throw Ve(e);return s}}class et{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tt(t,e,n){let s=1,r=null,i=null,o=!1,u=0;function a(){return u===2}let l=!1;function h(..._){l||(l=!0,e.apply(null,_))}function f(_){r=setTimeout(()=>{r=null,t(m,a())},_)}function p(){i&&clearTimeout(i)}function m(_,...U){if(l){p();return}if(_){p(),h.call(null,_,...U);return}if(a()||o){p(),h.call(null,_,...U);return}s<64&&(s*=2);let R;u===1?(u=2,R=0):R=(s+Math.random())*1e3,f(R)}let g=!1;function y(_){g||(g=!0,p(),!l&&(r!==null?(_||(u=2),clearTimeout(r),f(0)):_||(u=1)))}return f(0),i=setTimeout(()=>{o=!0,y(!0)},n),y}function nt(t){t(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function st(t){return t!==void 0}function rt(t){return typeof t=="function"}function it(t){return typeof t=="object"&&!Array.isArray(t)}function X(t){return typeof t=="string"||t instanceof String}function ie(t){return Q()&&t instanceof Blob}function Q(){return typeof Blob<"u"}function oe(t,e,n,s){if(s<e)throw Y(`Invalid value for '${t}'. Expected ${e} or greater.`);if(s>n)throw Y(`Invalid value for '${t}'. Expected ${n} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q(t,e,n){let s=e;return n==null&&(s=`https://${e}`),`${n}://${s}/v0${t}`}function ge(t){const e=encodeURIComponent;let n="?";for(const s in t)if(t.hasOwnProperty(s)){const r=e(s)+"="+e(t[s]);n=n+r+"&"}return n=n.slice(0,-1),n}var P;(function(t){t[t.NO_ERROR=0]="NO_ERROR",t[t.NETWORK_ERROR=1]="NETWORK_ERROR",t[t.ABORT=2]="ABORT"})(P||(P={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function be(t,e){const n=t>=500&&t<600,r=[408,429].indexOf(t)!==-1,i=e.indexOf(t)!==-1;return n||r||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(e,n,s,r,i,o,u,a,l,h,f,p=!0){this.url_=e,this.method_=n,this.headers_=s,this.body_=r,this.successCodes_=i,this.additionalRetryCodes_=o,this.callback_=u,this.errorCallback_=a,this.timeout_=l,this.progressCallback_=h,this.connectionFactory_=f,this.retry=p,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((m,g)=>{this.resolve_=m,this.reject_=g,this.start_()})}start_(){const e=(s,r)=>{if(r){s(!1,new z(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const o=u=>{const a=u.loaded,l=u.lengthComputable?u.total:-1;this.progressCallback_!==null&&this.progressCallback_(a,l)};this.progressCallback_!==null&&i.addUploadProgressListener(o),i.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(o),this.pendingConnection_=null;const u=i.getErrorCode()===P.NO_ERROR,a=i.getStatus();if(!u||be(a,this.additionalRetryCodes_)&&this.retry){const h=i.getErrorCode()===P.ABORT;s(!1,new z(!1,null,h));return}const l=this.successCodes_.indexOf(a)!==-1;s(!0,new z(l,i))})},n=(s,r)=>{const i=this.resolve_,o=this.reject_,u=r.connection;if(r.wasSuccessCode)try{const a=this.callback_(u,u.getResponse());st(a)?i(a):i()}catch(a){o(a)}else if(u!==null){const a=J();a.serverResponse=u.getErrorText(),this.errorCallback_?o(this.errorCallback_(u,a)):o(a)}else if(r.canceled){const a=this.appDelete_?me():_e();o(a)}else{const a=fe();o(a)}};this.canceled_?n(!1,new z(!1,null,!0)):this.backoffId_=tt(e,n,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&nt(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class z{constructor(e,n,s){this.wasSuccessCode=e,this.connection=n,this.canceled=!!s}}function at(t,e){e!==null&&e.length>0&&(t.Authorization="Firebase "+e)}function ut(t,e){t["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function lt(t,e){e&&(t["X-Firebase-GMPID"]=e)}function ct(t,e){e!==null&&(t["X-Firebase-AppCheck"]=e)}function ht(t,e,n,s,r,i,o=!0){const u=ge(t.urlParams),a=t.url+u,l=Object.assign({},t.headers);return lt(l,e),at(l,n),ut(l,i),ct(l,s),new ot(a,t.method,l,t.body,t.successCodes,t.additionalRetryCodes,t.handler,t.errorHandler,t.timeout,t.progressCallback,r,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dt(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function ft(...t){const e=dt();if(e!==void 0){const n=new e;for(let s=0;s<t.length;s++)n.append(t[s]);return n.getBlob()}else{if(Q())return new Blob(t);throw new d(c.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function _t(t,e,n){return t.webkitSlice?t.webkitSlice(e,n):t.mozSlice?t.mozSlice(e,n):t.slice?t.slice(e,n):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pt(t){if(typeof atob>"u")throw Je("base-64");return atob(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const E={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class K{constructor(e,n){this.data=e,this.contentType=n||null}}function mt(t,e){switch(t){case E.RAW:return new K(Re(e));case E.BASE64:case E.BASE64URL:return new K(Te(t,e));case E.DATA_URL:return new K(bt(e),Rt(e))}throw J()}function Re(t){const e=[];for(let n=0;n<t.length;n++){let s=t.charCodeAt(n);if(s<=127)e.push(s);else if(s<=2047)e.push(192|s>>6,128|s&63);else if((s&64512)===55296)if(!(n<t.length-1&&(t.charCodeAt(n+1)&64512)===56320))e.push(239,191,189);else{const i=s,o=t.charCodeAt(++n);s=65536|(i&1023)<<10|o&1023,e.push(240|s>>18,128|s>>12&63,128|s>>6&63,128|s&63)}else(s&64512)===56320?e.push(239,191,189):e.push(224|s>>12,128|s>>6&63,128|s&63)}return new Uint8Array(e)}function gt(t){let e;try{e=decodeURIComponent(t)}catch{throw M(E.DATA_URL,"Malformed data URL.")}return Re(e)}function Te(t,e){switch(t){case E.BASE64:{const r=e.indexOf("-")!==-1,i=e.indexOf("_")!==-1;if(r||i)throw M(t,"Invalid character '"+(r?"-":"_")+"' found: is it base64url encoded?");break}case E.BASE64URL:{const r=e.indexOf("+")!==-1,i=e.indexOf("/")!==-1;if(r||i)throw M(t,"Invalid character '"+(r?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=pt(e)}catch(r){throw r.message.includes("polyfill")?r:M(t,"Invalid character found")}const s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);return s}class we{constructor(e){this.base64=!1,this.contentType=null;const n=e.match(/^data:([^,]+)?,/);if(n===null)throw M(E.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const s=n[1]||null;s!=null&&(this.base64=Tt(s,";base64"),this.contentType=this.base64?s.substring(0,s.length-7):s),this.rest=e.substring(e.indexOf(",")+1)}}function bt(t){const e=new we(t);return e.base64?Te(E.BASE64,e.rest):gt(e.rest)}function Rt(t){return new we(t).contentType}function Tt(t,e){return t.length>=e.length?t.substring(t.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(e,n){let s=0,r="";ie(e)?(this.data_=e,s=e.size,r=e.type):e instanceof ArrayBuffer?(n?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),s=this.data_.length):e instanceof Uint8Array&&(n?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),s=e.length),this.size_=s,this.type_=r}size(){return this.size_}type(){return this.type_}slice(e,n){if(ie(this.data_)){const s=this.data_,r=_t(s,e,n);return r===null?null:new O(r)}else{const s=new Uint8Array(this.data_.buffer,e,n-e);return new O(s,!0)}}static getBlob(...e){if(Q()){const n=e.map(s=>s instanceof O?s.data_:s);return new O(ft.apply(null,n))}else{const n=e.map(o=>X(o)?mt(E.RAW,o).data:o.data_);let s=0;n.forEach(o=>{s+=o.byteLength});const r=new Uint8Array(s);let i=0;return n.forEach(o=>{for(let u=0;u<o.length;u++)r[i++]=o[u]}),new O(r,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ke(t){let e;try{e=JSON.parse(t)}catch{return null}return it(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wt(t){if(t.length===0)return null;const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function kt(t,e){const n=e.split("/").filter(s=>s.length>0).join("/");return t.length===0?n:t+"/"+n}function ye(t){const e=t.lastIndexOf("/",t.length-2);return e===-1?t:t.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yt(t,e){return e}class T{constructor(e,n,s,r){this.server=e,this.local=n||e,this.writable=!!s,this.xform=r||yt}}let $=null;function Et(t){return!X(t)||t.length<2?t:ye(t)}function ee(){if($)return $;const t=[];t.push(new T("bucket")),t.push(new T("generation")),t.push(new T("metageneration")),t.push(new T("name","fullPath",!0));function e(i,o){return Et(o)}const n=new T("name");n.xform=e,t.push(n);function s(i,o){return o!==void 0?Number(o):o}const r=new T("size");return r.xform=s,t.push(r),t.push(new T("timeCreated")),t.push(new T("updated")),t.push(new T("md5Hash",null,!0)),t.push(new T("cacheControl",null,!0)),t.push(new T("contentDisposition",null,!0)),t.push(new T("contentEncoding",null,!0)),t.push(new T("contentLanguage",null,!0)),t.push(new T("contentType",null,!0)),t.push(new T("metadata","customMetadata",!0)),$=t,$}function Ut(t,e){function n(){const s=t.bucket,r=t.fullPath,i=new k(s,r);return e._makeStorageReference(i)}Object.defineProperty(t,"ref",{get:n})}function At(t,e,n){const s={};s.type="file";const r=n.length;for(let i=0;i<r;i++){const o=n[i];s[o.local]=o.xform(s,e[o.server])}return Ut(s,t),s}function Ee(t,e,n){const s=ke(e);return s===null?null:At(t,s,n)}function Ot(t,e,n,s){const r=ke(e);if(r===null||!X(r.downloadTokens))return null;const i=r.downloadTokens;if(i.length===0)return null;const o=encodeURIComponent;return i.split(",").map(l=>{const h=t.bucket,f=t.fullPath,p="/b/"+o(h)+"/o/"+o(f),m=q(p,n,s),g=ge({alt:"media",token:l});return m+g})[0]}function Ue(t,e){const n={},s=e.length;for(let r=0;r<s;r++){const i=e[r];i.writable&&(n[i.server]=t[i.local])}return JSON.stringify(n)}class D{constructor(e,n,s,r){this.url=e,this.method=n,this.handler=s,this.timeout=r,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function S(t){if(!t)throw J()}function te(t,e){function n(s,r){const i=Ee(t,r,e);return S(i!==null),i}return n}function St(t,e){function n(s,r){const i=Ee(t,r,e);return S(i!==null),Ot(i,r,t.host,t._protocol)}return n}function H(t){function e(n,s){let r;return n.getStatus()===401?n.getErrorText().includes("Firebase App Check token is invalid")?r=Xe():r=je():n.getStatus()===402?r=$e(t.bucket):n.getStatus()===403?r=Ge(t.path):r=s,r.status=n.getStatus(),r.serverResponse=s.serverResponse,r}return e}function Ae(t){const e=H(t);function n(s,r){let i=e(s,r);return s.getStatus()===404&&(i=ze(t.path)),i.serverResponse=r.serverResponse,i}return n}function Nt(t,e,n){const s=e.fullServerUrl(),r=q(s,t.host,t._protocol),i="GET",o=t.maxOperationRetryTime,u=new D(r,i,te(t,n),o);return u.errorHandler=Ae(e),u}function Pt(t,e,n){const s=e.fullServerUrl(),r=q(s,t.host,t._protocol),i="GET",o=t.maxOperationRetryTime,u=new D(r,i,St(t,n),o);return u.errorHandler=Ae(e),u}function It(t,e){return t&&t.contentType||e&&e.type()||"application/octet-stream"}function Oe(t,e,n){const s=Object.assign({},n);return s.fullPath=t.path,s.size=e.size(),s.contentType||(s.contentType=It(null,e)),s}function Se(t,e,n,s,r){const i=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function u(){let R="";for(let b=0;b<2;b++)R=R+Math.random().toString().slice(2);return R}const a=u();o["Content-Type"]="multipart/related; boundary="+a;const l=Oe(e,s,r),h=Ue(l,n),f="--"+a+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+h+`\r
--`+a+`\r
Content-Type: `+l.contentType+`\r
\r
`,p=`\r
--`+a+"--",m=O.getBlob(f,s,p);if(m===null)throw pe();const g={name:l.fullPath},y=q(i,t.host,t._protocol),_="POST",U=t.maxUploadRetryTime,A=new D(y,_,te(t,n),U);return A.urlParams=g,A.headers=o,A.body=m.uploadData(),A.errorHandler=H(e),A}class j{constructor(e,n,s,r){this.current=e,this.total=n,this.finalized=!!s,this.metadata=r||null}}function ne(t,e){let n=null;try{n=t.getResponseHeader("X-Goog-Upload-Status")}catch{S(!1)}return S(!!n&&(e||["active"]).indexOf(n)!==-1),n}function Ct(t,e,n,s,r){const i=e.bucketOnlyServerUrl(),o=Oe(e,s,r),u={name:o.fullPath},a=q(i,t.host,t._protocol),l="POST",h={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${s.size()}`,"X-Goog-Upload-Header-Content-Type":o.contentType,"Content-Type":"application/json; charset=utf-8"},f=Ue(o,n),p=t.maxUploadRetryTime;function m(y){ne(y);let _;try{_=y.getResponseHeader("X-Goog-Upload-URL")}catch{S(!1)}return S(X(_)),_}const g=new D(a,l,m,p);return g.urlParams=u,g.headers=h,g.body=f,g.errorHandler=H(e),g}function vt(t,e,n,s){const r={"X-Goog-Upload-Command":"query"};function i(l){const h=ne(l,["active","final"]);let f=null;try{f=l.getResponseHeader("X-Goog-Upload-Size-Received")}catch{S(!1)}f||S(!1);const p=Number(f);return S(!isNaN(p)),new j(p,s.size(),h==="final")}const o="POST",u=t.maxUploadRetryTime,a=new D(n,o,i,u);return a.headers=r,a.errorHandler=H(e),a}const ae=256*1024;function xt(t,e,n,s,r,i,o,u){const a=new j(0,0);if(o?(a.current=o.current,a.total=o.total):(a.current=0,a.total=s.size()),s.size()!==a.total)throw Ze();const l=a.total-a.current;let h=l;r>0&&(h=Math.min(h,r));const f=a.current,p=f+h;let m="";h===0?m="finalize":l===h?m="upload, finalize":m="upload";const g={"X-Goog-Upload-Command":m,"X-Goog-Upload-Offset":`${a.current}`},y=s.slice(f,p);if(y===null)throw pe();function _(b,C){const v=ne(b,["active","final"]),G=a.current+h,L=s.size();let V;return v==="final"?V=te(e,i)(b,C):V=null,new j(G,L,v==="final",V)}const U="POST",A=e.maxUploadRetryTime,R=new D(n,U,_,A);return R.headers=g,R.body=y.uploadData(),R.progressCallback=u||null,R.errorHandler=H(t),R}const w={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function Z(t){switch(t){case"running":case"pausing":case"canceling":return w.RUNNING;case"paused":return w.PAUSED;case"success":return w.SUCCESS;case"canceled":return w.CANCELED;case"error":return w.ERROR;default:return w.ERROR}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(e,n,s){if(rt(e)||n!=null||s!=null)this.next=e,this.error=n??void 0,this.complete=s??void 0;else{const i=e;this.next=i.next,this.error=i.error,this.complete=i.complete}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(t){return(...e)=>{Promise.resolve().then(()=>t(...e))}}class Lt{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=P.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=P.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=P.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,n,s,r){if(this.sent_)throw B("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(n,e,!0),r!==void 0)for(const i in r)r.hasOwnProperty(i)&&this.xhr_.setRequestHeader(i,r[i].toString());return s!==void 0?this.xhr_.send(s):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw B("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw B("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw B("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw B("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class Bt extends Lt{initXhr(){this.xhr_.responseType="text"}}function N(){return new Bt}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(e,n,s=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=n,this._metadata=s,this._mappings=ee(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=r=>{if(this._request=void 0,this._chunkMultiplier=1,r._codeEquals(c.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const i=this.isExponentialBackoffExpired();if(be(r.status,[]))if(i)r=fe();else{this.sleepTime=Math.max(this.sleepTime*2,He),this._needToFetchStatus=!0,this.completeTransitions_();return}this._error=r,this._transition("error")}},this._metadataErrorHandler=r=>{this._request=void 0,r._codeEquals(c.CANCELED)?this.completeTransitions_():(this._error=r,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((r,i)=>{this._resolve=r,this._reject=i,this._start()}),this._promise.then(null,()=>{})}isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}_makeProgressCallback(){const e=this._transferred;return n=>this._updateProgress(e+n)}_shouldDoResumable(e){return e.size()>256*1024}_start(){this._state==="running"&&this._request===void 0&&(this._resumable?this._uploadUrl===void 0?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(e){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([n,s])=>{switch(this._state){case"running":e(n,s);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused");break}})}_createResumable(){this._resolveToken((e,n)=>{const s=Ct(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),r=this._ref.storage._makeRequest(s,N,e,n);this._request=r,r.getPromise().then(i=>{this._request=void 0,this._uploadUrl=i,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){const e=this._uploadUrl;this._resolveToken((n,s)=>{const r=vt(this._ref.storage,this._ref._location,e,this._blob),i=this._ref.storage._makeRequest(r,N,n,s);this._request=i,i.getPromise().then(o=>{o=o,this._request=void 0,this._updateProgress(o.current),this._needToFetchStatus=!1,o.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){const e=ae*this._chunkMultiplier,n=new j(this._transferred,this._blob.size()),s=this._uploadUrl;this._resolveToken((r,i)=>{let o;try{o=xt(this._ref._location,this._ref.storage,s,this._blob,e,this._mappings,n,this._makeProgressCallback())}catch(a){this._error=a,this._transition("error");return}const u=this._ref.storage._makeRequest(o,N,r,i,!1);this._request=u,u.getPromise().then(a=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(a.current),a.finalized?(this._metadata=a.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){ae*this._chunkMultiplier*2<32*1024*1024&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((e,n)=>{const s=Nt(this._ref.storage,this._ref._location,this._mappings),r=this._ref.storage._makeRequest(s,N,e,n);this._request=r,r.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((e,n)=>{const s=Se(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),r=this._ref.storage._makeRequest(s,N,e,n);this._request=r,r.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(e){const n=this._transferred;this._transferred=e,this._transferred!==n&&this._notifyObservers()}_transition(e){if(this._state!==e)switch(e){case"canceling":case"pausing":this._state=e,this._request!==void 0?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const n=this._state==="paused";this._state=e,n&&(this._notifyObservers(),this._start());break;case"paused":this._state=e,this._notifyObservers();break;case"canceled":this._error=_e(),this._state=e,this._notifyObservers();break;case"error":this._state=e,this._notifyObservers();break;case"success":this._state=e,this._notifyObservers();break}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start();break}}get snapshot(){const e=Z(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:e,metadata:this._metadata,task:this,ref:this._ref}}on(e,n,s,r){const i=new Dt(n||void 0,s||void 0,r||void 0);return this._addObserver(i),()=>{this._removeObserver(i)}}then(e,n){return this._promise.then(e,n)}catch(e){return this.then(null,e)}_addObserver(e){this._observers.push(e),this._notifyObserver(e)}_removeObserver(e){const n=this._observers.indexOf(e);n!==-1&&this._observers.splice(n,1)}_notifyObservers(){this._finishPromise(),this._observers.slice().forEach(n=>{this._notifyObserver(n)})}_finishPromise(){if(this._resolve!==void 0){let e=!0;switch(Z(this._state)){case w.SUCCESS:x(this._resolve.bind(null,this.snapshot))();break;case w.CANCELED:case w.ERROR:const n=this._reject;x(n.bind(null,this._error))();break;default:e=!1;break}e&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(e){switch(Z(this._state)){case w.RUNNING:case w.PAUSED:e.next&&x(e.next.bind(e,this.snapshot))();break;case w.SUCCESS:e.complete&&x(e.complete.bind(e))();break;case w.CANCELED:case w.ERROR:e.error&&x(e.error.bind(e,this._error))();break;default:e.error&&x(e.error.bind(e,this._error))()}}resume(){const e=this._state==="paused"||this._state==="pausing";return e&&this._transition("running"),e}pause(){const e=this._state==="running";return e&&this._transition("pausing"),e}cancel(){const e=this._state==="running"||this._state==="pausing";return e&&this._transition("canceling"),e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I{constructor(e,n){this._service=e,n instanceof k?this._location=n:this._location=k.makeFromUrl(n,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,n){return new I(e,n)}get root(){const e=new k(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return ye(this._location.path)}get storage(){return this._service}get parent(){const e=wt(this._location.path);if(e===null)return null;const n=new k(this._location.bucket,e);return new I(this._service,n)}_throwIfRoot(e){if(this._location.path==="")throw Qe(e)}}function Ft(t,e,n){t._throwIfRoot("uploadBytes");const s=Se(t.storage,t._location,ee(),new O(e,!0),n);return t.storage.makeRequestWithTokens(s,N).then(r=>({metadata:r,ref:t}))}function qt(t,e,n){return t._throwIfRoot("uploadBytesResumable"),new Mt(t,new O(e),n)}function Ht(t){t._throwIfRoot("getDownloadURL");const e=Pt(t.storage,t._location,ee());return t.storage.makeRequestWithTokens(e,N).then(n=>{if(n===null)throw Ye();return n})}function zt(t,e){const n=kt(t._location.path,e),s=new k(t._location.bucket,n);return new I(t.storage,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $t(t){return/^[A-Za-z]+:\/\//.test(t)}function jt(t,e){return new I(t,e)}function Ne(t,e){if(t instanceof se){const n=t;if(n._bucket==null)throw Ke();const s=new I(n,n._bucket);return e!=null?Ne(s,e):s}else return e!==void 0?zt(t,e):t}function Xt(t,e){if(e&&$t(e)){if(t instanceof se)return jt(t,e);throw Y("To use ref(service, url), the first argument must be a Storage instance.")}else return Ne(t,e)}function ue(t,e){const n=e==null?void 0:e[de];return n==null?null:k.makeFromBucketSpec(n,t)}function Gt(t,e,n,s={}){t.host=`${e}:${n}`,t._protocol="http";const{mockUserToken:r}=s;r&&(t._overrideAuthToken=typeof r=="string"?r:Le(r,t.app.options.projectId))}class se{constructor(e,n,s,r,i){this.app=e,this._authProvider=n,this._appCheckProvider=s,this._url=r,this._firebaseVersion=i,this._bucket=null,this._host=he,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Fe,this._maxUploadRetryTime=qe,this._requests=new Set,r!=null?this._bucket=k.makeFromBucketSpec(r,this._host):this._bucket=ue(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=k.makeFromBucketSpec(this._url,e):this._bucket=ue(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){oe("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){oe("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const n=await e.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new I(this,e)}_makeRequest(e,n,s,r,i=!0){if(this._deleted)return new et(me());{const o=ht(e,this._appId,s,r,n,this._firebaseVersion,i);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,n){const[s,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,n,s,r).getPromise()}}const le="@firebase/storage",ce="0.13.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pe="storage";function Yt(t,e,n){return t=F(t),Ft(t,e,n)}function Jt(t,e,n){return t=F(t),qt(t,e,n)}function Qt(t){return t=F(t),Ht(t)}function en(t,e){return t=F(t),Xt(t,e)}function tn(t=ve(),e){t=F(t);const s=Ie(t,Pe).getImmediate({identifier:e}),r=Ce("storage");return r&&Vt(s,...r),s}function Vt(t,e,n,s={}){Gt(t,e,n,s)}function Wt(t,{instanceIdentifier:e}){const n=t.getProvider("app").getImmediate(),s=t.getProvider("auth-internal"),r=t.getProvider("app-check-internal");return new se(n,s,r,e,Be)}function Kt(){xe(new De(Pe,Wt,"PUBLIC").setMultipleInstances(!0)),re(le,ce,""),re(le,ce,"esm2017")}Kt();export{d as StorageError,c as StorageErrorCode,E as StringFormat,O as _FbsBlob,k as _Location,w as _TaskState,Mt as _UploadTask,mt as _dataFromString,Y as _invalidArgument,Qe as _invalidRootOperation,Vt as connectStorageEmulator,Qt as getDownloadURL,tn as getStorage,en as ref,Yt as uploadBytes,Jt as uploadBytesResumable};
