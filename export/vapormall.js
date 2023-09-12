"use strict";var vapormall=(()=>{var L=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var P=Object.getOwnPropertyNames;var D=Object.prototype.hasOwnProperty;var R=(l,e)=>{for(var s in e)L(l,s,{get:e[s],enumerable:!0})},O=(l,e,s,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of P(e))!D.call(l,n)&&n!==s&&L(l,n,{get:()=>e[n],enumerable:!(a=I(e,n))||a.enumerable});return l};var _=l=>O(L({},"__esModule",{value:!0}),l);var v={};R(v,{Battle:()=>p,CONSTANTS:()=>t,GameState:()=>k,IndividualSoul:()=>T,Manager:()=>y,SKILL_LIST:()=>d,SOUL_LIST:()=>g,Skill:()=>h});var t;(n=>{let l;(m=>(m.HP="HP",m.ATTACK="attack",m.DEFENSE="defense",m.GLITCHATTACK="glitch attack",m.GLITCHDEFENSE="glitch defense",m.SPEED="speed"))(l=n.STATS||={});let e;(S=>(S.NORMALDAMAGE="normal damage",S.GLITCHDAMAGE="glitch damage",S.STATUS="status"))(e=n.SKILLCATEGORIES||={});let s;(m=>(m.TYPELESS="typeless",m.SWEET="sweet",m.EDGE="edge",m.CORPORATE="corporate",m.SANGFROID="sangfroid",m.ERROR="error"))(s=n.TYPES||={});let a;(c=>(c[c.SELECTED=0]="SELECTED",c[c.OPPOSING=1]="OPPOSING",c[c.ALLIED=2]="ALLIED",c[c.ALLY=3]="ALLY",c[c.ALL=4]="ALL",c[c.SELF=5]="SELF",c[c.NONE=6]="NONE"))(a=n.TARGETS||={})})(t||={});var d={basic_attack:{name:"Attack",description:"Basic attack.",power:4,max_pp:30,priority:0,stat_changes:[],target:t.TARGETS.SELECTED,type:t.TYPES.TYPELESS,meta:{category:t.SKILLCATEGORIES.NORMALDAMAGE,crit_rate:0,drain:0,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}},recoil:{name:"Recoil",description:"Restores half the damage dealt.",power:12,max_pp:15,priority:0,stat_changes:[],target:t.TARGETS.SELECTED,type:t.TYPES.ERROR,meta:{category:t.SKILLCATEGORIES.NORMALDAMAGE,crit_rate:0,drain:-33,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}},drain:{name:"Drain",description:"Restores half the damage dealt.",power:4,max_pp:20,priority:0,stat_changes:[],target:t.TARGETS.SELECTED,type:t.TYPES.TYPELESS,meta:{category:t.SKILLCATEGORIES.NORMALDAMAGE,crit_rate:0,drain:50,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}},dazzling_polish:{name:"Dazzling Polish",description:"Polish simulated aesthetics for enhanced beauty. Raise Offense, Glitch Offense.",power:null,max_pp:15,priority:0,stat_changes:[{change:1,stat:t.STATS.ATTACK,target:t.TARGETS.SELF},{change:1,stat:t.STATS.GLITCHATTACK,target:t.TARGETS.SELF}],target:t.TARGETS.SELF,type:t.TYPES.SWEET,meta:{category:t.SKILLCATEGORIES.STATUS,crit_rate:0,drain:0,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}}};var g={Adware:{name:"ADWARE",description:"Churning glut of incoherence.",stats:{[t.STATS.HP]:20,[t.STATS.ATTACK]:10,[t.STATS.DEFENSE]:10,[t.STATS.GLITCHATTACK]:10,[t.STATS.GLITCHDEFENSE]:7,[t.STATS.SPEED]:8},sprites:{front:"temp.gif",back:"temp.gif"},types:[t.TYPES.ERROR],levelUp:[{level:1,learnedSkills:[d.basic_attack,d.recoil]},{level:2,statChanges:[{stat:t.STATS.SPEED,change:6}],learnedSkills:[d.dazzling_polish]},{level:3,statChanges:[{stat:t.STATS.DEFENSE,change:6}]},{level:4,statChanges:[{stat:t.STATS.HP,change:6}],learnedSkills:[d.drain]},{level:5,statChanges:[{stat:t.STATS.GLITCHDEFENSE,change:3},{stat:t.STATS.DEFENSE,change:3}]}]}};var f=class{constructor(e){this.soul=e,this.selected_skill=null,this.selected_target=null,this.stat_changes={[t.STATS.HP]:0,[t.STATS.ATTACK]:0,[t.STATS.DEFENSE]:0,[t.STATS.GLITCHATTACK]:0,[t.STATS.GLITCHDEFENSE]:0,[t.STATS.SPEED]:0},this.displayHP=this.soul.currentHP,this.hpText=document.createElement("small"),this.hpText.append(document.createTextNode(this.getHPString())),this.infoDiv=this.genInfoContainer(),document.getElementById("tophalf")?.append(this.infoDiv)}genInfoContainer(){let e=this.genInfoDiv(),s=this.genDetailedInfo(),a=document.createElement("div");return a.append(e),a.append(s),e.onmouseover=function(){s.style.display="block"},e.onmouseout=function(){s.style.display="none"},a}genInfoDiv(){let e=document.createElement("div"),s=document.createTextNode(this.soul.name);return e.append(s),e.append(document.createElement("br")),e.append(this.hpText),e}genDetailedInfo(){let e=document.createElement("div");e.classList.add("soul-tip","skill-div","hoverDiv");let s=document.createTextNode(this.soul.name);e.append(s,document.createElement("br"));let a=document.createElement("small");this.soul.soul_species.types.forEach((r,o)=>{a.innerText+=r+"/"}),e.append(a),e.append(document.createElement("hr"));let n=document.createElement("small");for(let r in this.soul.stats){let o=r;n.innerText+=r+" "+this.soul.stats[o]+" / "}e.append(n);let i=!1;for(let r in this.soul.stats){let o=r;this.stat_changes[o]!==0&&(i=!0)}if(i){let r=document.createElement("small");r.append(document.createElement("br"),document.createElement("br"),document.createTextNode("(After stat modifiers:)"),document.createElement("br")),e.append(r);let o=document.createElement("small");for(let S in this.soul.stats){let C=S;o.innerText+=S+" "+this.calculateStat(C)+" / "}e.append(o)}return e}updateInfo(){this.hpText.innerHTML=this.getHPString()}getHPString(){return"HP: "+this.displayHP+"/"+this.soul.stats[t.STATS.HP]}calculateStat(e){if(e===t.STATS.HP)return this.soul.stats[e];let s=this.soul.stats[e],a;return this.stat_changes[e]>0?a=(2+this.stat_changes[e])/2:a=2/(2-this.stat_changes[e]),Math.max(Math.floor(s*a),1)}},u=class extends f{constructor(e){super(e),this.infoDiv.classList.add("playerInfo","soulInfo","blackBg")}},E=class extends f{constructor(e){super(e),this.infoDiv.classList.add("enemyInfo","soulInfo","blackBg")}chooseMove(e,s,a){console.log(this.soul.skills);let n=Math.floor(Math.random()*this.soul.skills.length);switch(this.selected_skill=this.soul.skills[n],this.selected_skill.data.target){case t.TARGETS.SELECTED:case t.TARGETS.OPPOSING:let i=Math.floor(Math.random()*s.length);this.selected_target=[s[i]];break;case t.TARGETS.ALLIED:case t.TARGETS.ALLY:case t.TARGETS.SELF:this.selected_target=[this];break;case t.TARGETS.ALL:case t.TARGETS.NONE:break}}};function N(l){return l.charAt(0).toUpperCase()+l.slice(1)}var A=class l{static{this.ENDBLOCK_STRING="ENDBLOCK"}constructor(e){let s=document.getElementById("messageContainer");if(s===null){console.error("messageContainer is null! Cannot display messages!");return}this.messages=[],this.messageContainer=s,this.blocks=0,this.timeouts=[],this.skillHandlerCreator=e}addMessage(e){this.messages.push(e)}endMessageBlock(){this.messages.push(l.ENDBLOCK_STRING)}displayMessages(){let e=0;this.messages.forEach((s,a)=>{s===l.ENDBLOCK_STRING&&(this.enqueueBlock(this.messages.slice(e,a)),e=a+1)}),this.enqueueBlock(this.messages.slice(e,this.messages.length)),this.messages=[]}enqueueBlock(e){let s=this.blocks*3100,a=setTimeout(()=>{this.displayBlock(e)},s);this.timeouts.push(a),this.blocks++}displayBlock(e){let s=document.createElement("div");s.classList.add("message","blackBg"),this.messageContainer.append(s);let a=0;e.forEach((i,r)=>{let o=a*750;if(typeof i=="string"){let S=setTimeout(()=>{s.append(document.createTextNode(N(i))),s.append(document.createElement("br"))},o);this.timeouts.push(S),a++}else{let S=setTimeout(()=>{i()},o);this.timeouts.push(S)}});let n=setTimeout(()=>{s.remove(),this.blocks--},e.length*750);this.timeouts.push(n)}renderSkills(e){let s=[],a=document.createElement("div");a.id="skillContainer";let n=document.createElement("p");n.textContent="AGGRESSION PROTOCOL INITIATED.",a.append(n),e.soul.skills.forEach((i,r)=>{let o=this.makeSkillWrapper(e,i,r);a?.append(o)}),document.getElementById("bottomhalf")?.append(a)}makeSkillWrapper(e,s,a){let n=s.getSkillButton();s.pp>0?n.addEventListener("click",this.skillHandlerCreator(e,a),!1):n.classList.add("noClick");let i=s.getSkillTip();n.onmouseover=function(){i.style.display="block"},n.onmouseout=function(){i.style.display="none"};let r=document.createElement("div");return r.classList.add("skill-wrapper"),r.append(n),r.append(i),r}temporaryHideSkills(e){document.getElementById("skillContainer")?.remove();let a=setTimeout(()=>{this.renderSkills(e)},3100*2);this.timeouts.push(a)}endBattle(){document.getElementById("endScreen")?.classList.remove("hidden")}};var p=class l{constructor(e,s){this.playerSouls=e.map(function(n){return new u(n)}),this.enemySouls=s.map(function(n){return new E(n)}),this.souls=[...this.playerSouls,...this.enemySouls],this.battleOver=!1,this.messageRenderer=new A(this.createSkillClickHandler.bind(this));let a=this.playerSouls[0];this.messageRenderer.renderSkills(a)}static getName(e){return e instanceof u?"your "+e.soul.name:"the opposing "+e.soul.name}passTurn(){function e(a,n){return a.calculateStat(t.STATS.SPEED)-n.calculateStat(t.STATS.SPEED)}let s=this.souls.sort(e);for(let a=0;a<s.length;a++)this.useSkill(s[a])}checkBattleOver(){(this.playerSouls.length===0||this.enemySouls.length===0)&&(this.messageRenderer.endMessageBlock(),this.playerSouls.length,this.messageRenderer.addMessage(()=>{this.messageRenderer.endBattle()}))}selectEnemySkills(){for(let e of this.enemySouls)e.chooseMove(this.souls,this.playerSouls,this.enemySouls)}selectPlayerTarget(e){if(e.selected_skill===null){console.error("SELECTING TARGET FOR NULL PLAYER SKILL");return}switch(e.selected_skill.data.target){case t.TARGETS.SELECTED:case t.TARGETS.OPPOSING:e.selected_target=[this.enemySouls[0]];break;case t.TARGETS.ALLIED:e.selected_target=this.playerSouls;break;case t.TARGETS.ALLY:break;case t.TARGETS.ALL:e.selected_target=this.souls;break;case t.TARGETS.SELF:e.selected_target=[e];break;case t.TARGETS.NONE:e.selected_target=[];break}}createSkillClickHandler(e,s){return()=>{e.selected_skill=e.soul.skills[s],this.messageRenderer.temporaryHideSkills(e),this.selectPlayerTarget(e),this.selectEnemySkills(),this.passTurn(),this.messageRenderer.displayMessages()}}useSkill(e){let s=e.selected_skill;if(s===null){console.error("Using null skill!");return}if(s.pp<=0){console.error("Using skill with no pp!");return}switch(s.pp--,s.data.target){case t.TARGETS.SELECTED:case t.TARGETS.OPPOSING:case t.TARGETS.ALLIED:case t.TARGETS.ALLY:case t.TARGETS.ALL:case t.TARGETS.SELF:e.selected_target!==null?e.selected_target.forEach(a=>{this.applySkillEffects(e,s,a)}):console.error("No target for move!");break;case t.TARGETS.NONE:break}}applySkillEffects(e,s,a){switch(this.messageRenderer.addMessage(l.getName(e)+" used "+s.data.name+"!"),s.data.meta.category){case t.SKILLCATEGORIES.NORMALDAMAGE:case t.SKILLCATEGORIES.GLITCHDAMAGE:if(s.data.power!==null){let n=this.damageCalc(e,s,a,s.data.meta.category===t.SKILLCATEGORIES.GLITCHDAMAGE),i=1;if(a.soul.soul_species.types.forEach(r=>{i*=this.typeMultiplier(s.data.type,r)}),i===0)this.messageRenderer.addMessage("It didn't affect "+l.getName(a)+"...");else if(n=Math.ceil(n*i),this.messageRenderer.addMessage(()=>{a.displayHP-=n,a.updateInfo()}),i>1?this.messageRenderer.addMessage("It's super effective!"):i<1&&this.messageRenderer.addMessage("It's not very effective..."),this.messageRenderer.addMessage(l.getName(a)+" lost "+n+" HP!"),a.soul.changeHP(-n),this.checkFaint(a),s.data.meta.drain!==0){let r=Math.floor(n*(s.data.meta.drain/100));this.messageRenderer.addMessage(()=>{e.displayHP+=r,e.updateInfo()}),r>0?this.messageRenderer.addMessage(l.getName(e)+" drained "+r+" HP!"):r<0&&this.messageRenderer.addMessage(l.getName(e)+" lost "+-r+" HP from recoil!"),e.soul.changeHP(r),this.checkFaint(e)}}break;case t.SKILLCATEGORIES.STATUS:s.data.stat_changes.forEach(n=>{if(n.stat===t.STATS.HP)console.error("Stat change for HP not allowed!");else if(a.stat_changes[n.stat]===6)this.messageRenderer.addMessage(l.getName(a)+"'s "+n.stat+" couldn't go any higher!");else if(a.stat_changes[n.stat]===-6)this.messageRenderer.addMessage(l.getName(a)+"'s "+n.stat+" couldn't go any lower!");else{a.stat_changes[n.stat]+=n.change;let i=" ";n.change>0?i+="rose":i+="fell",n.change>1?i+=" "+Math.abs(n.change)+" stages!":i+=" "+Math.abs(n.change)+" stage!",this.messageRenderer.addMessage(l.getName(a)+"'s "+n.stat+i)}});break}this.messageRenderer.endMessageBlock()}checkFaint(e){e.soul.currentHP<=0&&(this.messageRenderer.endMessageBlock(),this.messageRenderer.addMessage(l.getName(e)+" was destroyed!"),this.souls.splice(this.souls.indexOf(e),1),e instanceof u?this.playerSouls.splice(this.playerSouls.indexOf(e),1):e instanceof E&&this.enemySouls.splice(this.enemySouls.indexOf(e),1),this.checkBattleOver())}damageCalc(e,s,a,n){if(n){let o=e.calculateStat(t.STATS.GLITCHATTACK)*s.data.power;return Math.ceil(o/a.calculateStat(t.STATS.GLITCHDEFENSE))}let i=e.calculateStat(t.STATS.ATTACK)*s.data.power;return Math.ceil(i/a.calculateStat(t.STATS.DEFENSE))}typeMultiplier(e,s){switch(e){case t.TYPES.TYPELESS:if(s===t.TYPES.ERROR)return 0;break;case t.TYPES.SWEET:if(s===t.TYPES.CORPORATE)return 2;if(s===t.TYPES.EDGE)return .5;break;case t.TYPES.EDGE:if(s===t.TYPES.SWEET)return 2;if(s===t.TYPES.SANGFROID)return .5;break;case t.TYPES.CORPORATE:if(s===t.TYPES.SANGFROID)return 2;if(s===t.TYPES.SWEET)return .5;break;case t.TYPES.SANGFROID:if(s===t.TYPES.EDGE)return 2;if(s===t.TYPES.CORPORATE)return .5;break}return 1}};var h=class{constructor(e){this.data=e,this.pp=e.max_pp}getSkillButton(){let e=document.createElement("button");e.classList.add("skill-button","skill-div");let s="skill-"+this.data.type;e.classList.add(s);let a=document.createTextNode(this.data.name);e.append(a),e.append(document.createElement("br"));let n=document.createElement("small");n.append(document.createTextNode(this.data.type+" ")),e.append(n);let i=document.createElement("small");return i.append(document.createTextNode(this.pp+"/"+this.data.max_pp)),e.append(i),e}getSkillTip(){let e=document.createElement("div");e.classList.add("skill-tip","skill-div","hoverDiv");let s=document.createTextNode(this.data.name);e.append(s),e.append(document.createElement("br"));let a=document.createElement("small");a.append(document.createTextNode(this.data.type+" ")),e.append(a);let n=document.createElement("small");if(n.append(document.createTextNode(this.data.meta.category+" ")),e.append(n),e.append(document.createElement("hr")),this.data.power!==null){let r=document.createElement("small");r.append(document.createTextNode("Power: "+this.data.power)),e.append(r),e.append(document.createElement("hr"))}let i=document.createElement("small");return i.append(document.createTextNode(this.data.description)),e.append(i),e}};var T=class{constructor(e,s){this.soul_species=e,this.name=e.name,this.level=s,this.skills=[],this.stats={[t.STATS.HP]:0,[t.STATS.ATTACK]:0,[t.STATS.DEFENSE]:0,[t.STATS.GLITCHATTACK]:0,[t.STATS.GLITCHDEFENSE]:0,[t.STATS.SPEED]:0},this.initializeStats(),this.levelUpSimulate(),this.currentHP=this.stats[t.STATS.HP]}initializeStats(){for(let e in this.stats){let s=e;this.stats[s]=this.soul_species.stats[s]}}levelUpSimulate(){let e=0;this.soul_species.levelUp.filter(s=>s.level<=this.level).forEach((s,a)=>{s.statChanges!==void 0&&s.statChanges.forEach(n=>{this.stats[n.stat]+=n.change}),s.learnedSkills!==void 0&&s.learnedSkills.forEach(n=>{this.skills[e]=new h(n),e=++e%4})})}changeHP(e){this.currentHP=Math.min(this.stats[t.STATS.HP],this.currentHP+e),this.currentHP=Math.max(0,this.currentHP)}changeName(e){this.name=e}};var k=class{constructor(){this.partySouls=[]}addSoul(e){this.partySouls.push(e)}removeSoul(e){this.partySouls.splice(this.partySouls.indexOf(e),1)}};var y=class l{static startBattle(e){let s=e.partySouls[0],a=l.generateEnemy();return new p([s],[a])}static generateEnemy(){return new T(g.Adware,1)}};return _(v);})();
