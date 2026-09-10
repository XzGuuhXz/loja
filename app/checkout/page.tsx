import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
export const metadata={title:"Checkout",description:"Finalize sua compra na NovaVitrine."};
export default async function CheckoutPage(){const session=await auth();if(!session?.user)redirect("/login?callbackUrl=/checkout");return <CheckoutForm/>;}
