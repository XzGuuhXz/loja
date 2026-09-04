'use client';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Login() { const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [msg,setMsg]=useState('');
async function submit(e:FormEvent){e.preventDefault();setMsg('');const {error}=await createClient().auth.signInWithPassword({email,password});if(error)setMsg('E-mail ou senha inválidos.');else window.location.href='/';}
return <main style={{maxWidth:420,margin:'80px auto',padding:24}}><h1>Entrar</h1><form onSubmit={submit} style={{display:'grid',gap:12}}><input required type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:12}}/><input required type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:12}}/><button type="submit" style={{padding:12}}>Entrar</button></form>{msg&&<p>{msg}</p>}<a href="/cadastro">Criar conta</a></main> }