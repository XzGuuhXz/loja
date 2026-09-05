'use client';
import {useState} from 'react';

type Product = { id:string; name:string; price:number; image?:string|null; alt?:string|null };

type CartItem = { product_id:string; name:string; price:number; quantity:number; image?:string|null; image_alt?:string|null };

export default function AddToCart({product}:{product:Product}) {
  const [qty,setQty]=useState(1);
  const [msg,setMsg]=useState('');

  function add() {
    let cart:CartItem[]=[];
    try {
      const parsed=JSON.parse(localStorage.getItem('loja-cart')||'[]');
      cart=Array.isArray(parsed)?parsed:[];
    } catch {}

    const i=cart.findIndex(x=>x.product_id===product.id);
    if(i>=0) {
      cart[i].quantity=Math.min(100,Math.max(1,Number(cart[i].quantity)||1)+qty);
      cart[i].image=product.image||cart[i].image||null;
      cart[i].image_alt=product.alt||cart[i].image_alt||product.name;
    } else {
      cart.push({
        product_id:product.id,
        name:product.name,
        price:product.price,
        quantity:qty,
        image:product.image||null,
        image_alt:product.alt||product.name,
      });
    }

    localStorage.setItem('loja-cart',JSON.stringify(cart));
    setMsg('Adicionado ao carrinho.');
  }

  return <div><input type="number" min={1} max={100} value={qty} onChange={e=>setQty(Math.max(1,Math.min(100,Number(e.target.value)||1)))} /><button onClick={add}>Adicionar ao carrinho</button>{msg&&<span> {msg}</span>}</div>;
}
