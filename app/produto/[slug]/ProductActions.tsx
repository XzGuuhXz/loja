'use client';
import {useState} from 'react';
type P={id:string;name:string;price:number;stock:number;image:string|null;image_alt:string|null};
export default function ProductActions({product}:{product:P}){
 const [qty,setQty]=useState(1); const [added,setAdded]=useState(false);
 function add(){const saved=JSON.parse(localStorage.getItem('loja-cart')||'[]');const cart=Array.isArray(saved)?saved:[];const existing=cart.find((x:any)=>x.product_id===product.id);const next=existing?cart.map((x:any)=>x.product_id===product.id?{...x,quantity:Math.min(product.stock,x.quantity+qty)}:x):[...cart,{product_id:product.id,name:product.name,price:product.price,quantity:qty,image:product.image,image_alt:product.image_alt}];localStorage.setItem('loja-cart',JSON.stringify(next));window.dispatchEvent(new Event('loja-cart-updated'));setAdded(true);setTimeout(()=>setAdded(false),1400);}
 if(product.stock<=0)return <p className="form-message">Este produto está esgotado.</p>;
 return <div style={{display:'grid',gridTemplateColumns:'120px 1fr',gap:10,marginTop:24}}><input aria-label="Quantidade" type="number" min={1} max={Math.min(product.stock,20)} value={qty} onChange={e=>setQty(Math.max(1,Math.min(Math.min(product.stock,20),Number(e.target.value)||1)))} style={{padding:'12px',border:'1px solid var(--line)'}}/><button className="primary-btn" type="button" onClick={add}>{added?'Adicionado ✓':'Adicionar ao carrinho →'}</button></div>;
}