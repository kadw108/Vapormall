"use strict";var vapormall=(()=>{var D=Object.defineProperty;var G=Object.getOwnPropertyDescriptor;var F=Object.getOwnPropertyNames;var K=Object.prototype.hasOwnProperty;var Y=(o,e)=>{for(var t in e)D(o,t,{get:e[t],enumerable:!0})},W=(o,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of F(e))!K.call(o,a)&&a!==t&&D(o,a,{get:()=>e[a],enumerable:!(n=G(e,a))||n.enumerable});return o};var U=o=>W(D({},"__esModule",{value:!0}),o);var j={};Y(j,{Battle:()=>l,CONSTANTS:()=>s,GameState:()=>A,IndividualSoul:()=>h,MallMap:()=>y,Manager:()=>x,PlayerSoul:()=>P,SKILL_LIST:()=>p,SOUL_LIST:()=>f,Skill:()=>g});var s;(r=>{let o;(m=>(m.HP="HP",m.ATTACK="attack",m.DEFENSE="defense",m.GLITCHATTACK="glitch attack",m.GLITCHDEFENSE="glitch defense",m.SPEED="speed"))(o=r.STATS||={});let e;(T=>(T.NORMALDAMAGE="normal damage",T.GLITCHDAMAGE="glitch damage",T.STATUS="status"))(e=r.SKILLCATEGORIES||={});let t;(m=>(m.TYPELESS="typeless",m.SWEET="sweet",m.EDGE="edge",m.CORPORATE="corporate",m.SANGFROID="sangfroid",m.ERROR="error"))(t=r.TYPES||={});let n;(c=>(c[c.SELECTED=0]="SELECTED",c[c.OPPOSING=1]="OPPOSING",c[c.ALLIED=2]="ALLIED",c[c.ALLY=3]="ALLY",c[c.ALL=4]="ALL",c[c.SELF=5]="SELF",c[c.NONE=6]="NONE"))(n=r.TARGETS||={}),r.DIRECTIONS=[{name:"north",number:0},{name:"east",number:1},{name:"south",number:2},{name:"west",number:3}]})(s||={});var p={basic_attack:{name:"Attack",description:"Basic attack.",power:4,max_pp:30,priority:0,stat_changes:[],target:s.TARGETS.SELECTED,type:s.TYPES.TYPELESS,meta:{category:s.SKILLCATEGORIES.NORMALDAMAGE,crit_rate:0,drain:0,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}},recoil:{name:"Recoil",description:"Restores half the damage dealt.",power:12,max_pp:15,priority:0,stat_changes:[],target:s.TARGETS.SELECTED,type:s.TYPES.ERROR,meta:{category:s.SKILLCATEGORIES.NORMALDAMAGE,crit_rate:0,drain:-33,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}},drain:{name:"Drain",description:"Restores half the damage dealt.",power:4,max_pp:20,priority:0,stat_changes:[],target:s.TARGETS.SELECTED,type:s.TYPES.TYPELESS,meta:{category:s.SKILLCATEGORIES.NORMALDAMAGE,crit_rate:0,drain:50,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}},dazzling_polish:{name:"Dazzling Polish",description:"Polish simulated aesthetics for enhanced beauty. Raise Offense, Glitch Offense.",power:null,max_pp:15,priority:0,stat_changes:[{change:1,stat:s.STATS.ATTACK,target:s.TARGETS.SELF},{change:1,stat:s.STATS.GLITCHATTACK,target:s.TARGETS.SELF}],target:s.TARGETS.SELF,type:s.TYPES.SWEET,meta:{category:s.SKILLCATEGORIES.STATUS,crit_rate:0,drain:0,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}}};var f={Adware:{name:"ADWARE",description:"Churning glut of incoherence.",stats:{[s.STATS.HP]:20,[s.STATS.ATTACK]:10,[s.STATS.DEFENSE]:10,[s.STATS.GLITCHATTACK]:10,[s.STATS.GLITCHDEFENSE]:7,[s.STATS.SPEED]:8},sprites:{front:"temp.gif",back:"temp.gif"},types:[s.TYPES.ERROR],levelUp:[{level:1,learnedSkills:[p.basic_attack,p.recoil]},{level:2,statChanges:[{stat:s.STATS.SPEED,change:6}],learnedSkills:[p.dazzling_polish]},{level:3,statChanges:[{stat:s.STATS.DEFENSE,change:6}]},{level:4,statChanges:[{stat:s.STATS.HP,change:6}],learnedSkills:[p.drain]},{level:5,statChanges:[{stat:s.STATS.GLITCHDEFENSE,change:3},{stat:s.STATS.DEFENSE,change:3}]}]}};var C=class{constructor(e){this.soul=e,this.selected_skill=null,this.selected_target=null,this.stat_changes={[s.STATS.HP]:0,[s.STATS.ATTACK]:0,[s.STATS.DEFENSE]:0,[s.STATS.GLITCHATTACK]:0,[s.STATS.GLITCHDEFENSE]:0,[s.STATS.SPEED]:0},this.displayHP=this.soul.currentHP,this.hpText=document.createElement("small"),this.hpText.append(document.createTextNode(this.getHPString())),this.infoContainer=this.genInfoContainer(),document.getElementById("tophalf")?.append(this.infoContainer),this.index=0}genInfoContainer(){let e=this.genInfoDiv(),t=this.genDetailedInfo(),n=document.createElement("div");return n.append(e),n.append(t),e.onmouseover=function(){t.style.display="block"},e.onmouseout=function(){t.style.display="none"},this.detailedInfoDiv=t,n}genInfoDiv(){let e=document.createElement("div"),t=document.createTextNode(this.soul.name);return e.append(t),e.append(document.createElement("br")),e.append(this.hpText),e}genDetailedInfo(){let e=this.soul.genDetailedInfo();return e.classList.remove("bottomhalf-tip"),e.classList.add("tophalf-tip"),this.modifiedStatInfoBox=this.modifiedStatInfo(),e.append(this.modifiedStatInfoBox),e}hasModifiers(){for(let e in this.soul.stats){let t=e;if(this.stat_changes[t]!==0)return!0}return!1}modifiedStatInfo(){let e=document.createElement("div");if(this.hasModifiers()){let t=document.createElement("small");t.append(document.createElement("br"),document.createElement("br"),document.createTextNode("(After stat modifiers:)"),document.createElement("br")),e.append(t),e.append(this.soul.genStatText(this.modifiedStatDict()))}return e}modifiedStatDict(){return{[s.STATS.HP]:this.soul.currentHP,[s.STATS.ATTACK]:this.calculateStat(s.STATS.ATTACK),[s.STATS.DEFENSE]:this.calculateStat(s.STATS.DEFENSE),[s.STATS.GLITCHATTACK]:this.calculateStat(s.STATS.GLITCHATTACK),[s.STATS.GLITCHDEFENSE]:this.calculateStat(s.STATS.GLITCHDEFENSE),[s.STATS.SPEED]:this.calculateStat(s.STATS.SPEED)}}updateHP(){this.hpText.innerHTML=this.getHPString()}updateStats(){this.modifiedStatInfoBox.remove(),this.modifiedStatInfoBox=this.modifiedStatInfo(),this.detailedInfoDiv.append(this.modifiedStatInfoBox)}getHPString(){return"HP: "+this.displayHP+"/"+this.soul.stats[s.STATS.HP]}calculateStat(e){if(e===s.STATS.HP)return this.soul.stats[e];let t=this.soul.stats[e],n;return this.stat_changes[e]>0?n=(2+this.stat_changes[e])/2:n=2/(2-this.stat_changes[e]),Math.max(Math.floor(t*n),1)}switchOut(){this.infoContainer.remove()}},S=class extends C{constructor(e){super(e),this.infoContainer.classList.add("playerInfo","soulInfo","blackBg")}},E=class extends C{constructor(e){super(e),this.infoContainer.classList.add("enemyInfo","soulInfo","blackBg")}chooseMove(e,t,n){console.log(this.soul.skills);let a=Math.floor(Math.random()*this.soul.skills.length);switch(this.selected_skill=this.soul.skills[a],this.selected_skill.data.target){case s.TARGETS.SELECTED:case s.TARGETS.OPPOSING:let r=Math.floor(Math.random()*t.length);this.selected_target=[t[r]];break;case s.TARGETS.ALLIED:case s.TARGETS.ALLY:case s.TARGETS.SELF:this.selected_target=[this];break;case s.TARGETS.ALL:case s.TARGETS.NONE:break}}};function v(o){return o.charAt(0).toUpperCase()+o.slice(1)}function w(o){return Math.floor(Math.random()*o.length)}function k(o){return o[w(o)]}function H(o){return o.split(" ").map(e=>v(e)).join(" ")}function B(o){let e=Math.floor(Math.random()*o),t=[],n=e;for(let a=0;a<o;a++)t.push(n),n=(n+1)%o;return t}function O(o){var e=/\w+/.exec(o);if(e)var t=e[0];else return"an";var n=t.toLowerCase(),a=["honest","hour","hono"];for(var r in a)if(n.indexOf(a[r])==0)return"an";if(n.length==1)return"aedhilmnorsx".indexOf(n)>=0?"an":"a";if(t.match(/^(?!FJO|[HLMNS]Y.|RY[EO]|SQU|(F[LR]?|[HL]|MN?|N|RH?|S[CHKLMNPTVW]?|X(YL)?)[AEIOU])[FHLMNRSX][A-Z]/))return"an";var i=[/^e[uw]/,/^onc?e\b/,/^uni([^nmd]|mo)/,/^u[bcfhjkqrst][aeiou]/];for(var r in i)if(n.match(i[r]))return"a";return t.match(/^U[NK][AIEO]/)?"a":t==t.toUpperCase()?"aedhilmnorsx".indexOf(n[0])>=0?"an":"a":"aeiou".indexOf(n[0])>=0||n.match(/^y(b[lor]|cl[ea]|fere|gg|p[ios]|rou|tt)/)?"an":"a"}var I=class o{static{this.ENDBLOCK_STRING="ENDBLOCK"}constructor(e,t){let n=document.getElementById("messageContainer");if(n===null){console.error("messageContainer is null! Cannot display messages!");return}this.messages=[],this.messageContainer=n,this.blocks=0,this.timeouts=[],this.skillHandlerCreator=e,this.switchHandlerCreator=t}addMessage(e){this.messages.push(e)}endMessageBlock(){this.messages.push(o.ENDBLOCK_STRING)}displayMessages(){let e=0;this.messages.forEach((t,n)=>{t===o.ENDBLOCK_STRING&&(this.enqueueBlock(this.messages.slice(e,n)),e=n+1)}),this.enqueueBlock(this.messages.slice(e,this.messages.length)),this.messages=[]}enqueueBlock(e){let t=this.blocks*3100,n=setTimeout(()=>{this.displayBlock(e)},t);this.timeouts.push(n),this.blocks++}displayBlock(e){let t=document.createElement("div");t.classList.add("message","blackBg"),this.messageContainer.append(t);let n=0;e.forEach((r,i)=>{let d=n*750;if(typeof r=="string"){let u=setTimeout(()=>{t.append(document.createTextNode(v(r))),t.append(document.createElement("br"))},d);this.timeouts.push(u),n++}else{let u=setTimeout(()=>{r()},d);this.timeouts.push(u)}});let a=setTimeout(()=>{t.remove(),this.blocks--},e.length*750);this.timeouts.push(a)}renderSkills(e){let t=document.createElement("div");t.id="skillContainer";let n=document.createElement("p");n.textContent="AGGRESSION PROTOCOL INITIATED.",t.append(n),e.soul.skills.forEach((a,r)=>{let i=this.makeSkillWrapper(e,a,r);t?.append(i)}),document.getElementById("bottomContainer")?.append(t)}makeSkillWrapper(e,t,n){let a=t.getSkillContainer(),r=a.getElementsByTagName("button")[0];return t.pp>0?r.addEventListener("click",this.skillHandlerCreator(e,n),!1):r.classList.add("noClick"),a}hideActions(){document.getElementById("bottomContainer")?.remove()}queueShowActions(e,t,n){let a=setTimeout(()=>{let r=document.createElement("div");r.id="bottomContainer",document.getElementById("bottomhalf")?.append(r),this.renderSkills(e),this.renderSwitch(t,n)},6200);this.timeouts.push(a)}renderSwitch(e,t){let n=document.createElement("div");n.id="switchContainer";let a=document.createElement("p");a.textContent="SWITCH ACTIVE PROCESS?",n.append(a),e.forEach((r,i)=>{let d=this.makeSwitchWrapper(r,i,t);n?.append(d)}),document.getElementById("bottomContainer")?.append(n)}makeSwitchWrapper(e,t,n){let a=e.getSwitchContainer(),r=a.getElementsByTagName("button")[0],i=!0;return n.forEach(d=>{d.soul===e&&(i=!1)}),e.currentHP>0&&i?r.addEventListener("click",this.switchHandlerCreator(0,t),!1):r.classList.add("noClick"),a}endBattle(){document.getElementById("endScreen")?.classList.remove("hidden")}};var N=class{constructor(e){this.battle=e}applySkillEffects(e,t,n){switch(this.battle.messageRenderer.addMessage(l.getName(e)+" used "+t.data.name+"!"),t.data.meta.category){case s.SKILLCATEGORIES.NORMALDAMAGE:case s.SKILLCATEGORIES.GLITCHDAMAGE:if(t.data.power!==null){let a=this.damageCalc(e,t,n,t.data.meta.category===s.SKILLCATEGORIES.GLITCHDAMAGE),r=1;if(n.soul.soul_species.types.forEach(i=>{r*=this.typeMultiplier(t.data.type,i)}),r===0)this.battle.messageRenderer.addMessage("It didn't affect "+l.getName(n)+"...");else if(a=Math.ceil(a*r),this.battle.messageRenderer.addMessage(()=>{n.displayHP-=a,n.updateHP()}),r>1?this.battle.messageRenderer.addMessage("It's super effective!"):r<1&&this.battle.messageRenderer.addMessage("It's not very effective..."),this.battle.messageRenderer.addMessage(l.getName(n)+" lost "+a+" HP!"),n.soul.changeHP(-a),this.checkFaint(n),t.data.meta.drain!==0){let i=Math.floor(a*(t.data.meta.drain/100));this.battle.messageRenderer.addMessage(()=>{e.displayHP+=i,e.updateHP()}),i>0?this.battle.messageRenderer.addMessage(l.getName(e)+" drained "+i+" HP!"):i<0&&this.battle.messageRenderer.addMessage(l.getName(e)+" lost "+-i+" HP from recoil!"),e.soul.changeHP(i),this.checkFaint(e)}}break;case s.SKILLCATEGORIES.STATUS:t.data.stat_changes.forEach(a=>{if(a.stat===s.STATS.HP)console.error("Stat change for HP not allowed!");else if(n.stat_changes[a.stat]===6)this.battle.messageRenderer.addMessage(l.getName(n)+"'s "+a.stat+" couldn't go any higher!");else if(n.stat_changes[a.stat]===-6)this.battle.messageRenderer.addMessage(l.getName(n)+"'s "+a.stat+" couldn't go any lower!");else{n.stat_changes[a.stat]+=a.change;let r=" ";a.change>0?r+="rose":r+="fell",a.change>1?r+=" "+Math.abs(a.change)+" stages!":r+=" "+Math.abs(a.change)+" stage!",this.battle.messageRenderer.addMessage(()=>{n.updateStats()}),this.battle.messageRenderer.addMessage(l.getName(n)+"'s "+a.stat+r)}});break}this.battle.messageRenderer.endMessageBlock()}damageCalc(e,t,n,a){if(a){let d=e.calculateStat(s.STATS.GLITCHATTACK)*t.data.power;return Math.ceil(d/n.calculateStat(s.STATS.GLITCHDEFENSE))}let r=e.calculateStat(s.STATS.ATTACK)*t.data.power;return Math.ceil(r/n.calculateStat(s.STATS.DEFENSE))}typeMultiplier(e,t){switch(e){case s.TYPES.TYPELESS:if(t===s.TYPES.ERROR)return 0;break;case s.TYPES.SWEET:if(t===s.TYPES.CORPORATE)return 2;if(t===s.TYPES.EDGE)return .5;break;case s.TYPES.EDGE:if(t===s.TYPES.SWEET)return 2;if(t===s.TYPES.SANGFROID)return .5;break;case s.TYPES.CORPORATE:if(t===s.TYPES.SANGFROID)return 2;if(t===s.TYPES.SWEET)return .5;break;case s.TYPES.SANGFROID:if(t===s.TYPES.EDGE)return 2;if(t===s.TYPES.CORPORATE)return .5;break}return 1}checkFaint(e){e.soul.currentHP<=0&&(this.battle.messageRenderer.endMessageBlock(),this.battle.messageRenderer.addMessage(l.getName(e)+" was destroyed!"),this.battle.souls.filter(t=>{t.soul.name,e.soul.name}),e instanceof S?this.battle.playerSouls.splice(this.battle.playerSouls.indexOf(e),1):e instanceof E&&this.battle.enemySouls.splice(this.battle.enemySouls.indexOf(e),1),this.battle.checkBattleOver())}};var l=class o{constructor(e,t){this.playerParty=e,this.enemyParty=t,this.playerSouls=[new S(this.playerParty[0])],this.enemySouls=[new E(this.enemyParty[0])],this.souls=[...this.playerSouls,...this.enemySouls],this.battleOver=!1,this.battleCalculator=new N(this),this.messageRenderer=new I(this.createSkillClickHandler.bind(this),this.createSwitchClickHandler.bind(this));let n=this.playerSouls[0];this.messageRenderer.renderSkills(n),this.messageRenderer.renderSwitch(this.playerParty,this.playerSouls)}static getName(e){return e instanceof S?"your "+e.soul.name:"the opposing "+e.soul.name}passTurn(){function e(n,a){return n.calculateStat(s.STATS.SPEED)-a.calculateStat(s.STATS.SPEED)}let t=this.souls.sort(e);for(let n=0;n<t.length;n++)this.useSkill(t[n])}checkBattleOver(){(this.playerSouls.length===0||this.enemySouls.length===0)&&(this.messageRenderer.endMessageBlock(),this.playerSouls.length,this.messageRenderer.addMessage(()=>{this.messageRenderer.endBattle()}))}selectEnemySkills(){for(let e of this.enemySouls)e.chooseMove(this.souls,this.playerSouls,this.enemySouls)}selectPlayerTarget(e){if(e.selected_skill===null){console.error("SELECTING TARGET FOR NULL PLAYER SKILL");return}switch(e.selected_skill.data.target){case s.TARGETS.SELECTED:case s.TARGETS.OPPOSING:e.selected_target=[this.enemySouls[0]];break;case s.TARGETS.ALLIED:e.selected_target=this.playerSouls;break;case s.TARGETS.ALLY:break;case s.TARGETS.ALL:e.selected_target=this.souls;break;case s.TARGETS.SELF:e.selected_target=[e];break;case s.TARGETS.NONE:e.selected_target=[];break}}useSkill(e){let t=e.selected_skill;if(t===null){console.error("Using null skill!");return}if(t.pp<=0){console.error("Using skill with no pp!");return}switch(t.pp--,t.data.target){case s.TARGETS.SELECTED:case s.TARGETS.OPPOSING:case s.TARGETS.ALLIED:case s.TARGETS.ALLY:case s.TARGETS.ALL:case s.TARGETS.SELF:e.selected_target!==null?e.selected_target.forEach(n=>{this.battleCalculator.applySkillEffects(e,t,n)}):console.error("No target for move!");break;case s.TARGETS.NONE:break}}switchSoul(e,t){let n=this.playerSouls[e],a=new S(this.playerParty[t]);return n.switchOut(),this.playerSouls[e]=a,this.messageRenderer.addMessage("Switching out "+o.getName(n)+" for "+a.soul.name),a}createSkillClickHandler(e,t){return()=>{this.messageRenderer.hideActions(),e.selected_skill=e.soul.skills[t],this.selectPlayerTarget(e),this.selectEnemySkills(),this.passTurn(),this.messageRenderer.queueShowActions(e,this.playerParty,this.playerSouls),this.messageRenderer.displayMessages()}}createSwitchClickHandler(e,t){return()=>{this.messageRenderer.hideActions();let n=this.switchSoul(e,t);this.selectEnemySkills(),this.passTurn(),this.messageRenderer.queueShowActions(n,this.playerParty,this.playerSouls),this.messageRenderer.displayMessages()}}};var g=class{constructor(e){this.data=e,this.pp=e.max_pp}getSkillButton(){let e=document.createElement("button");e.classList.add("skill-button","outlineDiv");let t="skill-"+this.data.type;e.classList.add(t);let n=document.createTextNode(this.data.name);e.append(n),e.append(document.createElement("br"));let a=document.createElement("small");a.append(document.createTextNode(this.data.type+" ")),e.append(a);let r=document.createElement("small");return r.append(document.createTextNode(this.pp+"/"+this.data.max_pp)),e.append(r),e}getSkillTip(){let e=document.createElement("div");e.classList.add("bottomhalf-tip","outlineDiv","hoverDiv");let t=document.createTextNode(this.data.name);e.append(t),e.append(document.createElement("br"));let n=document.createElement("small");n.append(document.createTextNode(this.data.type+" | ")),e.append(n);let a=document.createElement("small");if(a.append(document.createTextNode(this.data.meta.category+" ")),e.append(a),e.append(document.createElement("hr")),this.data.power!==null){let i=document.createElement("small");i.append(document.createTextNode("Power: "+this.data.power)),e.append(i),e.append(document.createElement("hr"))}let r=document.createElement("small");return r.append(document.createTextNode(this.data.description)),e.append(r),e}getSkillContainer(){let e=this.getSkillButton(),t=this.getSkillTip();e.onmouseover=function(){t.style.display="block"},e.onmouseout=function(){t.style.display="none"};let n=document.createElement("div");return n.classList.add("choice-wrapper"),n.append(e),n.append(t),n}};var h=class{constructor(e,t){this.soul_species=e,this.name=e.name,this.level=t,this.skills=[],this.stats={[s.STATS.HP]:0,[s.STATS.ATTACK]:0,[s.STATS.DEFENSE]:0,[s.STATS.GLITCHATTACK]:0,[s.STATS.GLITCHDEFENSE]:0,[s.STATS.SPEED]:0},this.initializeStats(),this.levelUpSimulate(),this.currentHP=this.stats[s.STATS.HP]}initializeStats(){for(let e in this.stats){let t=e;this.stats[t]=this.soul_species.stats[t]}}levelUpSimulate(){let e=0;this.soul_species.levelUp.filter(t=>t.level<=this.level).forEach((t,n)=>{t.statChanges!==void 0&&t.statChanges.forEach(a=>{this.stats[a.stat]+=a.change}),t.learnedSkills!==void 0&&t.learnedSkills.forEach(a=>{this.skills[e]=new g(a),e=++e%4})})}changeHP(e){this.currentHP=Math.min(this.stats[s.STATS.HP],this.currentHP+e),this.currentHP=Math.max(0,this.currentHP)}changeName(e){this.name=e}genDetailedInfo(){let e=document.createElement("div");e.classList.add("bottomhalf-tip","outlineDiv","hoverDiv");let t=document.createTextNode(this.name);e.append(t,document.createElement("br"));let n=document.createElement("small");return this.soul_species.types.forEach((a,r)=>{n.innerText+=a+"/"}),e.append(n),e.append(document.createElement("hr")),e.append(this.genStatText(this.stats)),e}genStatText(e){let t=document.createElement("small");for(let n in this.stats)if(n!="HP"){let a=n;t.innerText+=n+" ",t.innerText+=e[a],t.innerText+=" / "}return t}},P=class o extends h{constructor(e,t){super(e,t)}static createPlayerSoul(e){let t=new o(e.soul_species,e.level);return Object.assign(t,e)}getSwitchContainer(){let e=this.getSwitchButton(),t=this.genDetailedInfo(),n=document.createElement("div");return n.classList.add("choice-wrapper"),n.append(e),n.append(t),e.onmouseover=function(){t.style.display="block"},e.onmouseout=function(){t.style.display="none"},n}getSwitchButton(){let e=document.createElement("button");e.classList.add("outlineDiv");let t=document.createTextNode(this.name);return e.append(t),e.append(document.createElement("br")),e}};var L=class{static addNumber(e){if(Math.random()<.1){let t=Math.floor(Math.random()*1e3);return Math.random()<.5?t+" "+e:e+" "+t}return e}static format(e){return H(e)}};var R;(t=>(t.CLOTHING=[{word:"dress",descriptions:["Velvet sundresses sway in the digital breeze.","Pleated skirts and petticoats. Perfume seeps into simulated nasal ducts."]},{word:"suit",descriptions:["Double-breasted. Rows of gleaming silver buttons untarnished by time.","Pinstripe black and white. Urbane flair."]},{word:"perfume",descriptions:["Glittering bottles."]},{word:"tie",descriptions:["Slick, sharp, colored in vaguely nauseating fashion."]},{word:"shirt",descriptions:["Cloth scraps in a scrapyard world."]},{word:"jacket",descriptions:["Sleek leather jackets, demure gray cotton jackets, formal suit jackets..."]},{word:"shimmer",descriptions:["Shimmering skins for your avatar! Now 30% off!"]},{word:"gloves",descriptions:["Fingerless gloves drifting in the air. There is no gravity here."]},{word:"trouser",descriptions:["Denim, denim, denim."]},{word:"face",descriptions:["Bearing expressions of all kinds, so you can emote properly."]},{word:"sunglasses",descriptions:["Mysterious aviator glasses or blue-rimmed horned lenses for the scholar?"]},{word:"hands",descriptions:["Of all shapes and colors!"]}],t.PLACES=["lounge","suite","court","plaza","aisle","outlet","store","boutique","hall"]))(R||={});var b=class{constructor(e){this.connections=[null,null,null,null],this.coord=e,this.info=new _(this)}hasSpace(){return this.connections.filter(e=>e===null).length>0}connectToRoom(e,t){if(!this.hasSpace())return!1;for(let n of B(this.connections.length))if(this.connections[n]===null){let a=new M([this,e]),r=[-1,-1];if(s.DIRECTIONS[n].name==="north"?(r=[this.coord[0],this.coord[1]-1],e.connections[2]=a):s.DIRECTIONS[n].name==="east"?(r=[this.coord[0]+1,this.coord[1]],e.connections[3]=a):s.DIRECTIONS[n].name==="south"?(r=[this.coord[0],this.coord[1]+1],e.connections[0]=a):s.DIRECTIONS[n].name==="west"&&(r=[this.coord[0]-1,this.coord[1]],e.connections[1]=a),r[0]>=t.length||r[0]<0||r[1]>=t.length||r[1]<0||t[r[1]][r[0]]!==void 0){e.connections=[null,null,null,null];break}return this.connections[n]=a,e.coord=r,!0}return!1}isConnectedTo(e){for(let t of this.connections)if(t!==null&&t.nodes.includes(e))return!0;return!1}getConnectedRooms(){let e=[];for(let t of this.connections)if(t!==null){let n=t.nodes.filter(a=>a!==this)[0];e.push(n.info.name)}else e.push("null");return e}},M=class{constructor(e){this.nodes=e,this.enterText="You leave one place and enter another.",this.name="Door #"+Math.floor(Math.random()*1e3)}otherRoom(e){return this.nodes[0]===e?this.nodes[1]:this.nodes[0]}},_=class{constructor(e){this.room=e;let t=k(R.CLOTHING);this.name=t.word+" "+k(R.PLACES),this.name=L.addNumber(this.name),this.name=L.format(this.name),this.description=k(t.descriptions),this.encounters=[],this.generateEncounters()}html(){let e="<h3>"+this.name+"</h3>",t="<p>"+this.description+"</p>",n="";if(this.encounters.length===0){n="<p>Exits: ";for(let a=0;a<this.room.connections.length;a++){let r=this.room.connections[a];r!==null&&(n+=s.DIRECTIONS[a].name+" to ",n+="<a class='exitLink' direction='"+s.DIRECTIONS[a].name+"'>",n+=r.otherRoom(this.room).info.name,n+="</a>",n+=" | ")}n+="</p>"}else{let a=w(this.encounters),r=this.encounters[a];if(n="<p>",n+="<a class='battleLink' encounterIndex="+a+">",r.length===1)n+="You see "+O(r[0].name)+" "+r[0].name+"!";else if(r.length>=1){n+="You see: ";for(let i=0;i<r.length;i++)n+=O(r[i].name)+" "+r[i].name,i===r.length-2?n+=", and ":i<r.length-1&&(n+=", ");n+="!"}else console.error("Room contains encounter with 0 enemies!");n+="</a></p>"}return e+t+n}generateEncounters(){let e=[];for(let t=0;t<Math.random()*5+1;t++){let n=new h(f.Adware,1);if(e.push(n),Math.random()<.6)break}this.encounters.push(e)}};var y=class{constructor(){this.adjacencyList=[],this.mapLength=25,this.mapArray=[...Array(this.mapLength)].map(t=>Array(this.mapLength));let e=Math.ceil(this.mapLength/2);this.centerCoord=[e,e],this.generateFloor(),this.currentLocation=this.centerCoord,this.renderRoom(this.currentRoom())}currentRoom(){return this.mapArray[this.currentLocation[1]][this.currentLocation[0]]}generateFloor(){let t=new b(this.centerCoord);this.adjacencyList.push(t),this.mapArray[t.coord[1]][t.coord[0]]=t;let n=0;for(;n<12-1;){let a=Math.floor(Math.random()*this.adjacencyList.length),r=this.adjacencyList[a],i=new b([-1,-1]);r.connectToRoom(i,this.mapArray)&&(this.adjacencyList.push(i),this.mapArray[i.coord[1]][i.coord[0]]=i,n++)}this.printFloor(),this.printMap()}printFloor(){for(let e of this.adjacencyList)console.log(e.info.name+" ("+e.coord+")  ("+e.getConnectedRooms()+")")}printMap(){let e="";for(let t=0;t<this.mapLength;t++){for(let n=0;n<this.mapLength;n++){let a=this.mapArray[t][n];if(a!==void 0){let r=String(a.coord).padStart(6);e+=r.padEnd(7)}else e+=" _____ "}e+=`
`}console.log(e)}move(e){switch(e){case"north":this.currentLocation=[this.currentLocation[0],this.currentLocation[1]-1];break;case"east":this.currentLocation=[this.currentLocation[0]+1,this.currentLocation[1]];break;case"south":this.currentLocation=[this.currentLocation[0],this.currentLocation[1]+1];break;case"west":this.currentLocation=[this.currentLocation[0]-1,this.currentLocation[1]];break}this.renderRoom(this.currentRoom())}renderRoom(e){let t=document.getElementById("roomName");t!==null&&(t.innerText=e.info.name);let n=document.getElementById("bottomContent");n!==null&&(n.innerHTML=e.info.html()),document.querySelectorAll(".exitLink").forEach((i,d)=>{let u=i;u.onclick=function(){let T=u.getAttribute("direction");T!==null&&this.move(T)}.bind(this)}),document.querySelectorAll(".battleLink").forEach((i,d)=>{let u=i;u.onclick=function(){}})}};var A=class o{static{this.partySouls=[]}static getPartySouls(){return o.partySouls}static addSoul(e){o.partySouls.push(e)}static removeSoul(e){o.partySouls.splice(this.partySouls.indexOf(e),1)}static generateFloor(){this.currentFloor=new y}};var x=class o{static startBattle(){let e=A.getPartySouls(),t=o.generateEnemy();return new l(e,[t])}static generateEnemy(){return new h(f.Adware,1)}};return U(j);})();
window.vapormall = vapormall;
console.log(story);
