'use client';
import { useEffect, useMemo, useState } from 'react';
import { checkout } from '../actions';

type Item = { product_id: string; name: string; price: number; quantity: number; image?: string | null; image_alt?: string | null };
type Address = { recipient_name: string; street: string; number: string; complement: string; neighborhood: string; city: string; state: string; postal_code: string };

const emptyAddress: Address = { recipient_name: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', postal_code: '' };

export default function Cart() {
  const [items, setItems] = useState<Item[]>([]);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('loja-cart') || '[]');
      setItems(Array.isArray(saved) ? saved : []);
    } catch { setItems([]); }
  }, []);

  function save(next: Item[]) {
    const normalized = next.map((item) => ({ ...item, quantity: Math.max(1, Math.min(100, Math.floor(item.quantity) || 1)) }));
    setItems(normalized);
    localStorage.setItem('loja-cart', JSON.stringify(normalized));
  }

  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [items]);

  async function finish() {
    setMsg(''); setPaymentUrl(null);
    if (!items.length) return;
    if (address.state.trim().length !== 2) { setMsg('Informe o estado com 2 letras.'); return; }
    setLoading(true);
    const result = await checkout({ items: items.map(({ product_id, quantity }) => ({ product_id, quantity })), address });
    if (result.error || !result.orderId) { setMsg(result.error || 'Não foi possível criar o pedido.'); setLoading(false); return; }
    localStorage.removeItem('loja-cart'); setItems([]); setMsg(`Pedido ${result.orderId} criado.`);
    try {
      const response = await fetch(`/api/pagamento/${result.orderId}`, { method: 'POST' });
      const payment = await response.json() as { initPoint?: string; error?: string };
      if (payment.initPoint) setPaymentUrl(payment.initPoint);
      else if (response.status !== 503) setMsg(`${result.orderId}: ${payment.error || 'Pagamento indisponível.'}`);
    } catch { setMsg(`Pedido ${result.orderId} criado. O pagamento pode ser iniciado depois.`); }
    setLoading(false);
  }

  const fields: Array<[keyof Address, string]> = [
    ['recipient_name', 'Nome do destinatário'], ['street', 'Rua'], ['number', 'Número'], ['complement', 'Complemento (opcional)'],
    ['neighborhood', 'Bairro'], ['city', 'Cidade'], ['state', 'UF'], ['postal_code', 'CEP']
  ];

  return <main className="page-shell">
    <a href="/" className="back-link">← Continuar comprando</a>
    <div className="page-title"><p className="eyebrow">SEU PEDIDO</p><h1>Carrinho</h1></div>
    {items.length === 0 ? <section className="empty-state"><div>🛒</div><h2>Seu carrinho está vazio</h2><p>Adicione produtos para começar sua compra.</p><a className="primary-btn" href="/#produtos">Ver produtos →</a></section> : <div className="checkout-layout">
      <section className="panel"><h2>Itens</h2>{items.map((item) => <div className="cart-row" key={item.product_id}>
        <div className="cart-product">
          <div className="cart-product-image">
            {item.image ? <img src={item.image} alt={item.image_alt || item.name} loading="lazy" /> : <span>{item.name.slice(0, 1).toUpperCase()}</span>}
          </div>
          <div className="cart-product-info"><strong>{item.name}</strong><small>Preço exibido: R$ {Number(item.price).toFixed(2).replace('.', ',')}</small></div>
        </div>
        <div className="cart-controls"><input aria-label={`Quantidade de ${item.name}`} type="number" min={1} max={100} value={item.quantity} onChange={(e) => save(items.map((x) => x.product_id === item.product_id ? { ...x, quantity: Number(e.target.value) } : x))}/><button type="button" onClick={() => save(items.filter((x) => x.product_id !== item.product_id))}>Remover</button></div>
      </div>)}<div className="cart-total"><span>Total estimado</span><strong>R$ {total.toFixed(2).replace('.', ',')}</strong></div></section>
      <section className="panel"><h2>Entrega</h2><div className="form-grid">{fields.map(([key, label]) => <label key={key}>{label}<input required={key !== 'complement'} value={address[key]} maxLength={key === 'state' ? 2 : 160} onChange={(e) => setAddress({ ...address, [key]: e.target.value })}/></label>)}</div><button className="primary-btn full" type="button" disabled={loading} onClick={finish}>{loading ? 'Processando...' : 'Finalizar pedido'}</button>{msg && <p className="form-message">{msg}</p>}{paymentUrl && <a className="primary-btn full" href={paymentUrl}>Pagar com Mercado Pago →</a>}<p className="secure-note">🔒 O valor final é recalculado no servidor. O navegador nunca define preço ou estoque.</p></section>
    </div>}
  </main>;
}
