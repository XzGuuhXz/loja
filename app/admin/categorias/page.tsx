'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Category={id:string;name:string;slug:string};
export default function Categories(){const [rows,setRows]=useState<Category[]>([]);const [name,setName]=useState('');const [slug,setSlug]=useState('');const [editing,setEditing]=useState<string|null>(null);const [msg,setMsg]=useState('');const s=createClient();
  async function load(){const {data}=await s.from('categories').select('*').order('name');setRows(data||[])} useEffect(()=>{load()},[]);
  function edit(c:Category){setEditing(c.id);setName(c.name);setSlug(c.slug);setMsg('')} function reset(){setEditing(null);setName('');setSlug('')}
  async function save(){if(!name.trim()||!slug.trim()){setMsg('Informe nome e slug.');return}const result=editing?await s.from('categories').update({name:name.trim(),slug:slug.trim()}).eq('id',editing).select().single():await s.from('categories').insert({name:name.trim(),slug:slug.trim()}).select().single();if(result.error){setMsg('Não foi possível salvar. Verifique se nome/slug já existem.');return}setMsg(editing?'Categoria atualizada.':'Categoria criada.');reset();load()}
  async function del(c:Category){if(!confirm(`Excluir ${c.name}? Produtos vinculados ficarão sem categoria.`))return;const {error}=await s.from('categories').delete().eq('id',c.id);if(error)setMsg('Não foi possível excluir.');else load()}
  return <main style={{maxWidth:800,margin:'0 auto',padding:32}}><a href="/admin">← Admin</a><h1>Categorias</h1><div style={{display:'grid',gap:8,maxWidth:500}}><input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)}/><input placeholder="Slug" value={slug} onChange={e=>setSlug(e.target.value)}/><div><button onClick={save}>{editing?'Salvar':'Criar'}</button>{editing&&<button onClick={reset} style={{marginLeft:8}}>Cancelar</button>}</div>{msg&&<p>{msg}</p>}</div><ul>{rows.map(c=><li key={c.id} style={{marginTop:12}}>{c.name} ({c.slug}) <button onClick={()=>edit(c)}>Editar</button> <button onClick={()=>del(c)}>Excluir</button></li>)}</ul></main>}
