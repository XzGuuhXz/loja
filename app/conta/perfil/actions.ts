'use server';
import {z} from 'zod'; import {createClient} from '@/lib/supabase/server';
const schema=z.object({full_name:z.string().trim().min(2).max(120)});
export async function updateProfile(formData:FormData){
 const parsed=schema.safeParse({full_name:formData.get('full_name')}); if(!parsed.success)return {error:'Nome inválido.'};
 const s=await createClient(); const {data:{user}}=await s.auth.getUser(); if(!user)return {error:'Faça login novamente.'};
 const {error}=await s.from('profiles').update({full_name:parsed.data.full_name,updated_at:new Date().toISOString()}).eq('id',user.id);
 return error?{error:'Não foi possível atualizar seus dados.'}:{ok:true};
}