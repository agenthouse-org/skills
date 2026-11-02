// Text is cut into individual 3D tiles. Their positions are calculated from
// absolute stage time, so playback and repeated seeks produce identical frames.
import { WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, BoxGeometry, MeshStandardMaterial, CanvasTexture, SRGBColorSpace, AmbientLight, DirectionalLight, PointLight, Color } from 'three';
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{const v=clamp(n); return v*v*(3-2*v);};
const mix=(a,b,t)=>a+(b-a)*t;
window.MotionAd3D={mount(stage){
 const canvas=stage.querySelector('canvas[data-motion-three]'); if(!canvas)return null;
 try {
  const renderer=new WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true});
  renderer.setPixelRatio(1); renderer.setSize(1920,1080,false);
  const scene=new Scene(), camera=new PerspectiveCamera(34,1920/1080,.1,100); camera.position.set(0,0,18); camera.lookAt(0,0,0);
  scene.add(new AmbientLight(0xb8d4e5,1.5));
  const key=new DirectionalLight(0xffffff,3.8); key.position.set(-4,6,9); scene.add(key);
  const rim=new PointLight(0xf4a52c,90,30); rim.position.set(6,-2,5); scene.add(rim);
  const resources=[], groups=[];
  const palette=[0xff505c,0x47d8d0,0x8c79ff,0xffb33c,0x66aaff,0xee6bc3].map(c=>new Color(c));
  function word(text,width,color){
   const source=document.createElement('canvas'); source.width=1600; source.height=400;
   const ctx=source.getContext('2d'); ctx.clearRect(0,0,1600,400); ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.font='900 310px Arial, sans-serif'; ctx.fillText(text,800,200,1500);
   const cols=32, rows=8, cellW=50, cellH=50, height=width/4;
   const group=new Group(); scene.add(group); const pieces=[];
   for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
    const pixels=ctx.getImageData(x*cellW,y*cellH,cellW,cellH).data; let visible=false;
    for(let k=3;k<pixels.length;k+=4)if(pixels[k]>20){visible=true;break;} if(!visible)continue;
    const tile=document.createElement('canvas'); tile.width=cellW; tile.height=cellH; tile.getContext('2d').drawImage(source,x*cellW,y*cellH,cellW,cellH,0,0,cellW,cellH);
    const texture=new CanvasTexture(tile); texture.colorSpace=SRGBColorSpace;
    const face=new MeshStandardMaterial({map:texture,color,transparent:true,alphaTest:.05,metalness:.48,roughness:.28});
    const side=new MeshStandardMaterial({color:0x496379,metalness:.7,roughness:.32,transparent:true,opacity:0});
    const geometry=new BoxGeometry(width/cols,height/rows,.22);
    const fragment=new Mesh(geometry,[side,side,side,side,face,side]); group.add(fragment);
    const px=(x+.5-cols/2)*width/cols, py=(rows/2-y-.5)*height/rows;
    const seed=(x*37+y*71)%101/100;
    pieces.push({fragment,face,side,base:new Color(color),burst:palette[(x*3+y*5)%palette.length],px,py,seed,x,y}); resources.push(texture,face,side,geometry);
   }
   groups.push({group,pieces});
  }
  word('CRM',9.2,0xf4f6f5); word('DealDesk',12.2,0xf5bd51);
  canvas.dataset.threeStatus='ready';
  canvas.addEventListener('webglcontextlost',()=>{canvas.dataset.threeStatus='unavailable';});
  window.addEventListener('pagehide',()=>{resources.forEach(r=>r.dispose());renderer.dispose();},{once:true});
  return {render(time){
   const crm=groups[0], deal=groups[1]; crm.group.visible=time<6.5; deal.group.visible=time>=4.7;
   crm.pieces.forEach(({fragment,face,side,base,burst,px,py,seed,x,y})=>{
    // A quick impulse followed by gravity: each fragment has its own velocity.
    const t=Math.max(0,time-2.2), launch=1-Math.exp(-t*2.6);
    const direction=(seed-.5)*2;
    face.color.copy(base).lerp(burst,clamp(t*2)); side.color.copy(burst); side.opacity=clamp(t*5);
    fragment.position.set(px+(px*.38+direction*3.8)*launch,py+(2.8+seed*2)*launch-1.15*t*t,(seed-.5)*8*launch);
    fragment.rotation.set(t*(2+seed*4),t*(3+seed*5)*(x%2?1:-1),t*(2+seed*3)*(y%2?1:-1));
   });
   deal.pieces.forEach(({fragment,face,side,base,burst,px,py,seed,x,y})=>{
    // Start beyond all four edges, then ease each tile into its final position.
    const delay=((x*17+y*29)%31)/31*.8;
    const u=clamp((time-5.0-delay)/3.6);
    const arrival=1-Math.pow(1-u,3);
    const edge=(x*7+y*13)%4;
    const spread=((x*19+y*23)%101)/100*2-1;
    const sx=edge===0?-17:edge===1?17:spread*17;
    const sy=edge===2?10:edge===3?-10:spread*10;
    const arc=Math.sin(Math.PI*u)*(1-u);
    face.color.copy(base).lerp(burst,1-smooth((u-.55)/.45));
    side.color.copy(burst); side.opacity=1-smooth((u-.7)/.3);
    fragment.position.set(mix(sx,px,arrival)+arc*(seed-.5)*3,mix(sy,py,arrival)+arc*(1+seed),mix((seed-.5)*9,0,arrival));
    const spin=(1-arrival);
    fragment.rotation.set(spin*(seed-.5)*18,spin*(seed-.5)*22,spin*(seed-.5)*14);
   });
   camera.position.z=18-1.0*smooth((time-2)/2)+1.0*smooth((time-6)/4); camera.lookAt(0,0,0);
   renderer.render(scene,camera);
  }};
 }catch(error){canvas.dataset.threeStatus='unavailable';canvas.hidden=true;console.warn('motion-ad: 3D unavailable; showing text fallback',error);return null;}
}};
