(() => {
 'use strict';
 const statement=document.querySelector('.independently-operated');
 if(!statement)return;
 // Edit the plain text in index.html; generate wrappers only at runtime.
 const text=statement.textContent.trim();
 if(!text)return;
 const fragment=document.createDocumentFragment();
 for(const token of text.split(/(\s+)/u)){
  if(!token)continue;
  if(/^\s+$/u.test(token)){fragment.append(document.createTextNode(token));continue;}
  const word=document.createElement('span');
  word.className='independent-word';word.setAttribute('aria-hidden','true');
  for(const character of Array.from(token)){
   const letter=document.createElement('span');letter.className='independent-letter';letter.textContent=character;word.append(letter);
  }
  fragment.append(word);
 }
 statement.replaceChildren(fragment);
 statement.setAttribute('tabindex','0');
 statement.setAttribute('role','button');
 statement.setAttribute('aria-label',text+' Animate the letters.');
 statement.setAttribute('aria-pressed','false');
 const letters=[...statement.querySelectorAll('.independent-letter')];
 const motions=letters.map((letter,i)=>({phase:i*2.399,speed:.45+(i%7)*.09}));
 let frame=0,active=false,touchHeld=false;
 function wander(time){
  if(!active)return;
  const t=time/1000;
  letters.forEach((letter,i)=>{
   const {phase,speed}=motions[i];
   const x=Math.sin(t*speed+phase)*(10+i%5);
   const y=Math.cos(t*speed*.83+phase)*(7+i%4);
   const angle=Math.sin(t*.4+phase)*9;
   letter.style.transform=`translate(${x}px,${y}px) rotate(${angle}deg)`;
  });
  frame=requestAnimationFrame(wander);
 }
 function separate(){
  if(active)return;
  active=true;
  statement.classList.remove('letters-smooshed');
  statement.classList.add('letters-separated');
  statement.setAttribute('aria-pressed','true');
  letters.forEach(letter=>{letter.style.transition='transform .4s ease-out';});
  frame=requestAnimationFrame(wander);
 }
 function smoosh(){
  if(!active)return;
  active=false;cancelAnimationFrame(frame);
  statement.classList.remove('letters-separated');
  statement.classList.add('letters-smooshed');
  statement.setAttribute('aria-pressed','false');
  const charWidth=parseFloat(getComputedStyle(statement).fontSize)*.6;
  const left=(statement.clientWidth-charWidth*5)/2;
  const top=(statement.clientHeight-parseFloat(getComputedStyle(statement).fontSize))/2;
  letters.forEach((letter,i)=>{
   // Five fixed horizontal slots. All remaining letters stack into those slots.
   const x=left+(i%5)*charWidth-letter.offsetLeft-letter.parentElement.offsetLeft;
   const y=top+(i%3-1)*1.5-letter.offsetTop-letter.parentElement.offsetTop;
   letter.style.transition='transform .16s cubic-bezier(.2,.9,.3,1)';
   letter.style.transform=`translate(${x}px,${y}px) rotate(${(i%5-2)*3}deg)`;
  });
 }
 statement.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')separate();});
 statement.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse')smoosh();});
 statement.addEventListener('pointerdown',event=>{
  if(event.pointerType==='mouse')return;
  event.preventDefault();touchHeld=true;separate();
 });
 function release(){if(touchHeld){touchHeld=false;smoosh();}}
 document.addEventListener('pointerup',release);
 document.addEventListener('pointercancel',release);
 statement.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();separate();}});
 statement.addEventListener('keyup',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();smoosh();}});
 statement.addEventListener('blur',smoosh);
})();
