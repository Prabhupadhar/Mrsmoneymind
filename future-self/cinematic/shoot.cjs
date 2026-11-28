const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:2880}});p.on('pageerror',e=>console.log(e.message));
await p.goto('file://'+process.cwd()+'/frames.html',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
const s=await p.$$('svg');for(let i=0;i<s.length;i++)await s[i].screenshot({path:`frame${i+1}.png`});await b.close();})();
