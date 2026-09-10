"use client";
import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
type Props={product:{id:string;slug:string;name:string;price:number;stock:number;imageUrl?:string}};
export function AddToCart({product}:Props){const addItem=useCartStore(s=>s.addItem);const[added,setAdded]=useState(false);const disabled=product.stock<=0;function handleAdd(){if(disabled)return;addItem(product);setAdded(true);window.setTimeout(()=>setAdded(false),1600)}return <button type="button" onClick={handleAdd} disabled={disabled} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">{added?<Check className="size-5"/>:<ShoppingCart className="size-5"/>}{disabled?"Produto esgotado":added?"Adicionado!":"Adicionar ao carrinho"}</button>}
