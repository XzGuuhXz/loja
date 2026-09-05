'use client';
import { useState } from 'react';

export default function PayButton({ orderId }: { orderId:string }) {
  const [loading,setLoading]=useState(false); const [message,setMessage]=useState('');
  async function pay(){setLoading(true);setMessage('');try{const response=await fetch(`/api/pagamento/${orderId}`,{method:'POST'});const data=await response.json();if(data.initPoint){window.location.href=data.initPoint;return}setMessage(data.error||'Pagamento indisponível.')}catch{setMessage('Não foi possível iniciar o pagamento.')}finally{setLoading(false)}}
  return <div><button type="button" onClick={pay} disabled={loading}>{loading?'Abrindo pagamento...':'Pagar agora'}</button>{message&&<small style={{display:'block',marginTop:6}}>{message}</small>}</div>;
}
