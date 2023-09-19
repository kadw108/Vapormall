"use strict";var vapormall=(()=>{var C=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var N=Object.getOwnPropertyNames;var P=Object.prototype.hasOwnProperty;var v=(r,e)=>{for(var t in e)C(r,t,{get:e[t],enumerable:!0})},D=(r,e,t,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of N(e))!P.call(r,n)&&n!==t&&C(r,n,{get:()=>e[n],enumerable:!(a=I(e,n))||a.enumerable});return r};var R=r=>D(C({},"__esModule",{value:!0}),r);var O={};v(O,{Battle:()=>o,CONSTANTS:()=>s,GameState:()=>E,IndividualSoul:()=>T,Manager:()=>L,SKILL_LIST:()=>S,SOUL_LIST:()=>f,Skill:()=>p});var s;(n=>{let r;(m=>(m.HP="HP",m.ATTACK="attack",m.DEFENSE="defense",m.GLITCHATTACK="glitch attack",m.GLITCHDEFENSE="glitch defense",m.SPEED="speed"))(r=n.STATS||={});let e;(d=>(d.NORMALDAMAGE="normal damage",d.GLITCHDAMAGE="glitch damage",d.STATUS="status"))(e=n.SKILLCATEGORIES||={});let t;(m=>(m.TYPELESS="typeless",m.SWEET="sweet",m.EDGE="edge",m.CORPORATE="corporate",m.SANGFROID="sangfroid",m.ERROR="error"))(t=n.TYPES||={});let a;(c=>(c[c.SELECTED=0]="SELECTED",c[c.OPPOSING=1]="OPPOSING",c[c.ALLIED=2]="ALLIED",c[c.ALLY=3]="ALLY",c[c.ALL=4]="ALL",c[c.SELF=5]="SELF",c[c.NONE=6]="NONE"))(a=n.TARGETS||={})})(s||={});var S={basic_attack:{name:"Attack",description:"Basic attack.",power:4,max_pp:30,priority:0,stat_changes:[],target:s.TARGETS.SELECTED,type:s.TYPES.TYPELESS,meta:{category:s.SKILLCATEGORIES.NORMALDAMAGE,crit_rate:0,drain:0,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}},recoil:{name:"Recoil",description:"Restores half the damage dealt.",power:12,max_pp:15,priority:0,stat_changes:[],target:s.TARGETS.SELECTED,type:s.TYPES.ERROR,meta:{category:s.SKILLCATEGORIES.NORMALDAMAGE,crit_rate:0,drain:-33,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}},drain:{name:"Drain",description:"Restores half the damage dealt.",power:4,max_pp:20,priority:0,stat_changes:[],target:s.TARGETS.SELECTED,type:s.TYPES.TYPELESS,meta:{category:s.SKILLCATEGORIES.NORMALDAMAGE,crit_rate:0,drain:50,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}},dazzling_polish:{name:"Dazzling Polish",description:"Polish simulated aesthetics for enhanced beauty. Raise Offense, Glitch Offense.",power:null,max_pp:15,priority:0,stat_changes:[{change:1,stat:s.STATS.ATTACK,target:s.TARGETS.SELF},{change:1,stat:s.STATS.GLITCHATTACK,target:s.TARGETS.SELF}],target:s.TARGETS.SELF,type:s.TYPES.SWEET,meta:{category:s.SKILLCATEGORIES.STATUS,crit_rate:0,drain:0,healing:0,max_hits:null,max_turns:null,min_hits:null,min_turns:null}}};var f={Adware:{name:"ADWARE",description:"Churning glut of incoherence.",stats:{[s.STATS.HP]:20,[s.STATS.ATTACK]:10,[s.STATS.DEFENSE]:10,[s.STATS.GLITCHATTACK]:10,[s.STATS.GLITCHDEFENSE]:7,[s.STATS.SPEED]:8},sprites:{front:"temp.gif",back:"temp.gif"},types:[s.TYPES.ERROR],levelUp:[{level:1,learnedSkills:[S.basic_attack,S.recoil]},{level:2,statChanges:[{stat:s.STATS.SPEED,change:6}],learnedSkills:[S.dazzling_polish]},{level:3,statChanges:[{stat:s.STATS.DEFENSE,change:6}]},{level:4,statChanges:[{stat:s.STATS.HP,change:6}],learnedSkills:[S.drain]},{level:5,statChanges:[{stat:s.STATS.GLITCHDEFENSE,change:3},{stat:s.STATS.DEFENSE,change:3}]}]}};var A=class{constructor(e){this.soul=e,this.selected_skill=null,this.selected_target=null,this.stat_changes={[s.STATS.HP]:0,[s.STATS.ATTACK]:0,[s.STATS.DEFENSE]:0,[s.STATS.GLITCHATTACK]:0,[s.STATS.GLITCHDEFENSE]:0,[s.STATS.SPEED]:0},this.displayHP=this.soul.currentHP,this.hpText=document.createElement("small"),this.hpText.append(document.createTextNode(this.getHPString())),this.infoContainer=this.genInfoContainer(),document.getElementById("tophalf")?.append(this.infoContainer),this.index=0}genInfoContainer(){let e=this.genInfoDiv(),t=this.genDetailedInfo(),a=document.createElement("div");return a.append(e),a.append(t),e.onmouseover=function(){t.style.display="block"},e.onmouseout=function(){t.style.display="none"},this.detailedInfoDiv=t,a}genInfoDiv(){let e=document.createElement("div"),t=document.createTextNode(this.soul.name);return e.append(t),e.append(document.createElement("br")),e.append(this.hpText),e}genDetailedInfo(){let e=this.soul.genDetailedInfo();return e.classList.remove("bottomhalf-tip"),e.classList.add("tophalf-tip"),this.statInfo=this.genStatInfo(),e.append(this.statInfo),e}hasModifiers(){for(let e in this.soul.stats){let t=e;if(this.stat_changes[t]!==0)return!0}return!1}genStatInfo(){let e=document.createElement("div");if(e.append(this.genStatText(!1)),this.hasModifiers()){let t=document.createElement("small");t.append(document.createElement("br"),document.createElement("br"),document.createTextNode("(After stat modifiers:)"),document.createElement("br")),e.append(t),e.append(this.genStatText(!0))}return e}genStatText(e){let t=document.createElement("small");for(let a in this.soul.stats)if(a!="HP"){let n=a;t.innerText+=a+" ",e?t.innerText+=this.calculateStat(n):t.innerText+=this.soul.stats[n],t.innerText+=" / "}return t}updateHP(){this.hpText.innerHTML=this.getHPString()}updateStats(){this.statInfo.remove(),this.statInfo=this.genStatInfo(),this.detailedInfoDiv.append(this.statInfo)}getHPString(){return"HP: "+this.displayHP+"/"+this.soul.stats[s.STATS.HP]}calculateStat(e){if(e===s.STATS.HP)return this.soul.stats[e];let t=this.soul.stats[e],a;return this.stat_changes[e]>0?a=(2+this.stat_changes[e])/2:a=2/(2-this.stat_changes[e]),Math.max(Math.floor(t*a),1)}switchOut(){this.infoContainer.remove()}},u=class extends A{constructor(e){super(e),this.infoContainer.classList.add("playerInfo","soulInfo","blackBg")}},h=class extends A{constructor(e){super(e),this.infoContainer.classList.add("enemyInfo","soulInfo","blackBg")}chooseMove(e,t,a){console.log(this.soul.skills);let n=Math.floor(Math.random()*this.soul.skills.length);switch(this.selected_skill=this.soul.skills[n],this.selected_skill.data.target){case s.TARGETS.SELECTED:case s.TARGETS.OPPOSING:let i=Math.floor(Math.random()*t.length);this.selected_target=[t[i]];break;case s.TARGETS.ALLIED:case s.TARGETS.ALLY:case s.TARGETS.SELF:this.selected_target=[this];break;case s.TARGETS.ALL:case s.TARGETS.NONE:break}}};function b(r){return r.charAt(0).toUpperCase()+r.slice(1)}var y=class r{static{this.ENDBLOCK_STRING="ENDBLOCK"}constructor(e,t){let a=document.getElementById("messageContainer");if(a===null){console.error("messageContainer is null! Cannot display messages!");return}this.messages=[],this.messageContainer=a,this.blocks=0,this.timeouts=[],this.skillHandlerCreator=e,this.switchHandlerCreator=t}addMessage(e){this.messages.push(e)}endMessageBlock(){this.messages.push(r.ENDBLOCK_STRING)}displayMessages(){let e=0;this.messages.forEach((t,a)=>{t===r.ENDBLOCK_STRING&&(this.enqueueBlock(this.messages.slice(e,a)),e=a+1)}),this.enqueueBlock(this.messages.slice(e,this.messages.length)),this.messages=[]}enqueueBlock(e){let t=this.blocks*3100,a=setTimeout(()=>{this.displayBlock(e)},t);this.timeouts.push(a),this.blocks++}displayBlock(e){let t=document.createElement("div");t.classList.add("message","blackBg"),this.messageContainer.append(t);let a=0;e.forEach((i,l)=>{let g=a*750;if(typeof i=="string"){let d=setTimeout(()=>{t.append(document.createTextNode(b(i))),t.append(document.createElement("br"))},g);this.timeouts.push(d),a++}else{let d=setTimeout(()=>{i()},g);this.timeouts.push(d)}});let n=setTimeout(()=>{t.remove(),this.blocks--},e.length*750);this.timeouts.push(n)}renderSkills(e){let t=document.createElement("div");t.id="skillContainer";let a=document.createElement("p");a.textContent="AGGRESSION PROTOCOL INITIATED.",t.append(a),e.soul.skills.forEach((n,i)=>{let l=this.makeSkillWrapper(e,n,i);t?.append(l)}),document.getElementById("bottomContainer")?.append(t)}makeSkillWrapper(e,t,a){let n=t.getSkillContainer(),i=n.getElementsByTagName("button")[0];return t.pp>0?i.addEventListener("click",this.skillHandlerCreator(e,a),!1):i.classList.add("noClick"),n}hideActions(){document.getElementById("bottomContainer")?.remove()}queueShowActions(e,t){let a=setTimeout(()=>{let n=document.createElement("div");n.id="bottomContainer",document.getElementById("bottomhalf")?.append(n),this.renderSkills(e),this.renderSwitch(t)},6200);this.timeouts.push(a)}renderSwitch(e){let t=document.createElement("div");t.id="switchContainer";let a=document.createElement("p");a.textContent="SWITCH ACTIVE PROCESS?",t.append(a),e.forEach((n,i)=>{let l=this.makeSwitchWrapper(n,i);t?.append(l)}),document.getElementById("bottomContainer")?.append(t)}makeSwitchWrapper(e,t){let a=e.getSwitchContainer(),n=a.getElementsByTagName("button")[0];return e.currentHP>0?n.addEventListener("click",this.switchHandlerCreator(0,t),!1):n.classList.add("noClick"),a}endBattle(){document.getElementById("endScreen")?.classList.remove("hidden")}};var k=class{constructor(e){this.battle=e}applySkillEffects(e,t,a){switch(this.battle.messageRenderer.addMessage(o.getName(e)+" used "+t.data.name+"!"),t.data.meta.category){case s.SKILLCATEGORIES.NORMALDAMAGE:case s.SKILLCATEGORIES.GLITCHDAMAGE:if(t.data.power!==null){let n=this.damageCalc(e,t,a,t.data.meta.category===s.SKILLCATEGORIES.GLITCHDAMAGE),i=1;if(a.soul.soul_species.types.forEach(l=>{i*=this.typeMultiplier(t.data.type,l)}),i===0)this.battle.messageRenderer.addMessage("It didn't affect "+o.getName(a)+"...");else if(n=Math.ceil(n*i),this.battle.messageRenderer.addMessage(()=>{a.displayHP-=n,a.updateHP()}),i>1?this.battle.messageRenderer.addMessage("It's super effective!"):i<1&&this.battle.messageRenderer.addMessage("It's not very effective..."),this.battle.messageRenderer.addMessage(o.getName(a)+" lost "+n+" HP!"),a.soul.changeHP(-n),this.checkFaint(a),t.data.meta.drain!==0){let l=Math.floor(n*(t.data.meta.drain/100));this.battle.messageRenderer.addMessage(()=>{e.displayHP+=l,e.updateHP()}),l>0?this.battle.messageRenderer.addMessage(o.getName(e)+" drained "+l+" HP!"):l<0&&this.battle.messageRenderer.addMessage(o.getName(e)+" lost "+-l+" HP from recoil!"),e.soul.changeHP(l),this.checkFaint(e)}}break;case s.SKILLCATEGORIES.STATUS:t.data.stat_changes.forEach(n=>{if(n.stat===s.STATS.HP)console.error("Stat change for HP not allowed!");else if(a.stat_changes[n.stat]===6)this.battle.messageRenderer.addMessage(o.getName(a)+"'s "+n.stat+" couldn't go any higher!");else if(a.stat_changes[n.stat]===-6)this.battle.messageRenderer.addMessage(o.getName(a)+"'s "+n.stat+" couldn't go any lower!");else{a.stat_changes[n.stat]+=n.change;let i=" ";n.change>0?i+="rose":i+="fell",n.change>1?i+=" "+Math.abs(n.change)+" stages!":i+=" "+Math.abs(n.change)+" stage!",this.battle.messageRenderer.addMessage(()=>{a.updateStats()}),this.battle.messageRenderer.addMessage(o.getName(a)+"'s "+n.stat+i)}});break}this.battle.messageRenderer.endMessageBlock()}damageCalc(e,t,a,n){if(n){let g=e.calculateStat(s.STATS.GLITCHATTACK)*t.data.power;return Math.ceil(g/a.calculateStat(s.STATS.GLITCHDEFENSE))}let i=e.calculateStat(s.STATS.ATTACK)*t.data.power;return Math.ceil(i/a.calculateStat(s.STATS.DEFENSE))}typeMultiplier(e,t){switch(e){case s.TYPES.TYPELESS:if(t===s.TYPES.ERROR)return 0;break;case s.TYPES.SWEET:if(t===s.TYPES.CORPORATE)return 2;if(t===s.TYPES.EDGE)return .5;break;case s.TYPES.EDGE:if(t===s.TYPES.SWEET)return 2;if(t===s.TYPES.SANGFROID)return .5;break;case s.TYPES.CORPORATE:if(t===s.TYPES.SANGFROID)return 2;if(t===s.TYPES.SWEET)return .5;break;case s.TYPES.SANGFROID:if(t===s.TYPES.EDGE)return 2;if(t===s.TYPES.CORPORATE)return .5;break}return 1}checkFaint(e){e.soul.currentHP<=0&&(this.battle.messageRenderer.endMessageBlock(),this.battle.messageRenderer.addMessage(o.getName(e)+" was destroyed!"),this.battle.souls.filter(t=>{t.soul.name,e.soul.name}),e instanceof u?this.battle.playerSouls.splice(this.battle.playerSouls.indexOf(e),1):e instanceof h&&this.battle.enemySouls.splice(this.battle.enemySouls.indexOf(e),1),this.battle.checkBattleOver())}};var o=class r{constructor(e,t){this.playerParty=e,this.enemyParty=t,this.playerSouls=[new u(this.playerParty[0])],this.enemySouls=[new h(this.enemyParty[0])],this.souls=[...this.playerSouls,...this.enemySouls],this.battleOver=!1,this.battleCalculator=new k(this),this.messageRenderer=new y(this.createSkillClickHandler.bind(this),this.createSwitchClickHandler.bind(this));let a=this.playerSouls[0];this.messageRenderer.renderSkills(a),this.messageRenderer.renderSwitch(this.playerParty)}static getName(e){return e instanceof u?"your "+e.soul.name:"the opposing "+e.soul.name}passTurn(){function e(a,n){return a.calculateStat(s.STATS.SPEED)-n.calculateStat(s.STATS.SPEED)}let t=this.souls.sort(e);for(let a=0;a<t.length;a++)this.useSkill(t[a])}checkBattleOver(){(this.playerSouls.length===0||this.enemySouls.length===0)&&(this.messageRenderer.endMessageBlock(),this.playerSouls.length,this.messageRenderer.addMessage(()=>{this.messageRenderer.endBattle()}))}selectEnemySkills(){for(let e of this.enemySouls)e.chooseMove(this.souls,this.playerSouls,this.enemySouls)}selectPlayerTarget(e){if(e.selected_skill===null){console.error("SELECTING TARGET FOR NULL PLAYER SKILL");return}switch(e.selected_skill.data.target){case s.TARGETS.SELECTED:case s.TARGETS.OPPOSING:e.selected_target=[this.enemySouls[0]];break;case s.TARGETS.ALLIED:e.selected_target=this.playerSouls;break;case s.TARGETS.ALLY:break;case s.TARGETS.ALL:e.selected_target=this.souls;break;case s.TARGETS.SELF:e.selected_target=[e];break;case s.TARGETS.NONE:e.selected_target=[];break}}useSkill(e){let t=e.selected_skill;if(t===null){console.error("Using null skill!");return}if(t.pp<=0){console.error("Using skill with no pp!");return}switch(t.pp--,t.data.target){case s.TARGETS.SELECTED:case s.TARGETS.OPPOSING:case s.TARGETS.ALLIED:case s.TARGETS.ALLY:case s.TARGETS.ALL:case s.TARGETS.SELF:e.selected_target!==null?e.selected_target.forEach(a=>{this.battleCalculator.applySkillEffects(e,t,a)}):console.error("No target for move!");break;case s.TARGETS.NONE:break}}switchSoul(e,t){let a=this.playerSouls[e],n=new u(this.playerParty[t]);return a.switchOut(),this.playerSouls[e]=n,this.messageRenderer.addMessage("Switching out "+r.getName(a)+" for "+n.soul.name),n}createSkillClickHandler(e,t){return()=>{this.messageRenderer.hideActions(),e.selected_skill=e.soul.skills[t],this.selectPlayerTarget(e),this.selectEnemySkills(),this.passTurn(),this.messageRenderer.queueShowActions(e,this.playerParty),this.messageRenderer.displayMessages()}}createSwitchClickHandler(e,t){return()=>{this.messageRenderer.hideActions();let a=this.switchSoul(e,t);this.selectEnemySkills(),this.passTurn(),this.messageRenderer.queueShowActions(a,this.playerParty),this.messageRenderer.displayMessages()}}};var p=class{constructor(e){this.data=e,this.pp=e.max_pp}getSkillButton(){let e=document.createElement("button");e.classList.add("skill-button","outlineDiv");let t="skill-"+this.data.type;e.classList.add(t);let a=document.createTextNode(this.data.name);e.append(a),e.append(document.createElement("br"));let n=document.createElement("small");n.append(document.createTextNode(this.data.type+" ")),e.append(n);let i=document.createElement("small");return i.append(document.createTextNode(this.pp+"/"+this.data.max_pp)),e.append(i),e}getSkillTip(){let e=document.createElement("div");e.classList.add("bottomhalf-tip","outlineDiv","hoverDiv");let t=document.createTextNode(this.data.name);e.append(t),e.append(document.createElement("br"));let a=document.createElement("small");a.append(document.createTextNode(this.data.type+" | ")),e.append(a);let n=document.createElement("small");if(n.append(document.createTextNode(this.data.meta.category+" ")),e.append(n),e.append(document.createElement("hr")),this.data.power!==null){let l=document.createElement("small");l.append(document.createTextNode("Power: "+this.data.power)),e.append(l),e.append(document.createElement("hr"))}let i=document.createElement("small");return i.append(document.createTextNode(this.data.description)),e.append(i),e}getSkillContainer(){let e=this.getSkillButton(),t=this.getSkillTip();e.onmouseover=function(){t.style.display="block"},e.onmouseout=function(){t.style.display="none"};let a=document.createElement("div");return a.classList.add("choice-wrapper"),a.append(e),a.append(t),a}};var T=class{constructor(e,t){this.soul_species=e,this.name=e.name,this.level=t,this.skills=[],this.stats={[s.STATS.HP]:0,[s.STATS.ATTACK]:0,[s.STATS.DEFENSE]:0,[s.STATS.GLITCHATTACK]:0,[s.STATS.GLITCHDEFENSE]:0,[s.STATS.SPEED]:0},this.initializeStats(),this.levelUpSimulate(),this.currentHP=this.stats[s.STATS.HP]}initializeStats(){for(let e in this.stats){let t=e;this.stats[t]=this.soul_species.stats[t]}}levelUpSimulate(){let e=0;this.soul_species.levelUp.filter(t=>t.level<=this.level).forEach((t,a)=>{t.statChanges!==void 0&&t.statChanges.forEach(n=>{this.stats[n.stat]+=n.change}),t.learnedSkills!==void 0&&t.learnedSkills.forEach(n=>{this.skills[e]=new p(n),e=++e%4})})}changeHP(e){this.currentHP=Math.min(this.stats[s.STATS.HP],this.currentHP+e),this.currentHP=Math.max(0,this.currentHP)}changeName(e){this.name=e}getSwitchContainer(){let e=this.getSwitchButton(),t=this.genDetailedInfo(),a=document.createElement("div");return a.classList.add("choice-wrapper"),a.append(e),a.append(t),e.onmouseover=function(){t.style.display="block"},e.onmouseout=function(){t.style.display="none"},a}getSwitchButton(){let e=document.createElement("button");e.classList.add("outlineDiv");let t=document.createTextNode(this.name);return e.append(t),e.append(document.createElement("br")),e}genDetailedInfo(){let e=document.createElement("div");e.classList.add("bottomhalf-tip","outlineDiv","hoverDiv");let t=document.createTextNode(this.name);e.append(t,document.createElement("br"));let a=document.createElement("small");return this.soul_species.types.forEach((n,i)=>{a.innerText+=n+"/"}),e.append(a),e.append(document.createElement("hr")),e}};var E=class r{static{this.partySouls=[]}static getPartySouls(){return r.partySouls}static addSoul(e){r.partySouls.push(e)}static removeSoul(e){r.partySouls.splice(this.partySouls.indexOf(e),1)}};var L=class r{static startBattle(){let e=E.getPartySouls(),t=r.generateEnemy();return new o(e,[t])}static generateEnemy(){return new T(f.Adware,1)}};return R(O);})();
