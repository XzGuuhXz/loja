"use client";
import { useState } from "react";

type Props={label:string;pendingLabel?:string;action:()=>Promise<{success:boolean;message?:string}>;className?:string;confirm?:string};
export function AdminActionButton({label,pendingLabel='Salvando...',action,className='rounded-lg border px-3 py-2 text-sm font-semibold',confirm}:Props){const [pending,setPending]=useState(false);const [message,setMessage]=useState('');async function run(){if(confirm&&!window.confirm(confirm))return;setPending(true);setMessage('');const r=await action();setMessage(r.success?'OK':r.message??'Erro');setPending(false);if(r.success)window.location.reload();}return <div><button type="button" disabled={pending} onClick={run} className={`${className} disabled:opacity-50`}>{pending?pendingLabel:label}</button>{message&&message!=='OK'&&<p className="mt-1 text-xs text-red-600">{message}</p>}</div>}
