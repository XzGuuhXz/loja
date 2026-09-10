"use client";

import { useState } from "react";

export function ProductGallery({ name, images }: { name: string; images: { url: string; alt: string | null }[] }) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];

  if (!current) return <div className="grid aspect-square place-items-center rounded-[2rem] border border-slate-200 bg-gradient-to-br from-indigo-100 via-white to-violet-100 text-8xl font-black text-indigo-200">NV</div>;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <img src={current.url} alt={current.alt ?? name} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && <div className="grid grid-cols-5 gap-3">
        {images.map((image, index) => <button key={image.url + index} type="button" onClick={() => setSelected(index)} aria-label={`Ver imagem ${index + 1}`} className={`aspect-square overflow-hidden rounded-xl border-2 bg-white ${selected === index ? "border-indigo-600" : "border-slate-200"}`}><img src={image.url} alt={image.alt ?? `${name} - imagem ${index + 1}`} className="h-full w-full object-cover" /></button>)}
      </div>}
    </div>
  );
}
