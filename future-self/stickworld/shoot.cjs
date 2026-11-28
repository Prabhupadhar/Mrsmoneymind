const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>console.log(e.message));
await p.goto('file://'+process.cwd()+'/'+(process.argv[2]||'cast.html'),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
await p.screenshot({path:process.argv[3]||'cast-options.png'});await b.close();})();
