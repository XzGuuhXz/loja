"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
const schema=z.object({recipient:z.string().trim().min(2).max(120),zipCode:z.string().trim().min(8).max(9),street:z.string().trim().min(2).max(160),number:z.string().trim().min(1).max(20),complement:z.string().trim().max(120).optional(),neighborhood:z.string().trim().min(2).max(100),city:z.string().trim().min(2).max(100),state:z.string().trim().length(2),paymentMethod:z.enum(["PIX","CARD","BOLETO"]),items:z.array(z.object({productId:z.string().cuid(),quantity:z.number().int().min(1).max(99)})).min(1).max(50)});
export async function createOrder(input:unknown){
 const session=await auth(); if(!session?.user?.id)return{success:false,message:"Faça login para finalizar a compra."};
 const parsed=schema.safeParse(input); if(!parsed.success)return{success:false,message:"Revise os dados de entrega e pagamento."};
 const quantities=new Map<string,number>(); for(const item of parsed.data.items)quantities.set(item.productId,(quantities.get(item.productId)??0)+item.quantity);
 try{const order=await prisma.$transaction(async tx=>{
  const products=await tx.product.findMany({where:{id:{in:[...quantities.keys()]},isActive:true}}); if(products.length!==quantities.size)throw new Error("Um ou mais produtos não estão mais disponíveis.");
  let subtotal=0; const orderItems=[] as {productId:string;productName:string;price:any;quantity:number;subtotal:number}[];
  for(const p of products){const q=quantities.get(p.id)!;if(p.stock<q)throw new Error(`Estoque insuficiente para ${p.name}.`);const itemSubtotal=Number(p.price)*q;subtotal+=itemSubtotal;orderItems.push({productId:p.id,productName:p.name,price:p.price,quantity:q,subtotal:itemSubtotal});}
  const shipping=subtotal===0||subtotal>=250?0:24.9;
  const address=await tx.address.create({data:{userId:session.user.id,recipient:parsed.data.recipient,zipCode:parsed.data.zipCode,street:parsed.data.street,number:parsed.data.number,complement:parsed.data.complement||null,neighborhood:parsed.data.neighborhood,city:parsed.data.city,state:parsed.data.state.toUpperCase()}});
  const created=await tx.order.create({data:{userId:session.user.id,addressId:address.id,status:"PENDING",paymentStatus:"PENDING",paymentMethod:parsed.data.paymentMethod,subtotal,shipping,discount:0,total:subtotal+shipping,items:{create:orderItems}},select:{id:true}});
  for(const p of products){const q=quantities.get(p.id)!;const updated=await tx.product.updateMany({where:{id:p.id,isActive:true,stock:{gte:q}},data:{stock:{decrement:q}}});if(updated.count!==1)throw new Error(`O estoque de ${p.name} mudou. Tente novamente.`);}
  return created;
 }); revalidatePath("/produtos");revalidatePath("/conta");return{success:true,orderId:order.id};
 }catch(error){return{success:false,message:error instanceof Error?error.message:"Não foi possível criar o pedido."};}
}
