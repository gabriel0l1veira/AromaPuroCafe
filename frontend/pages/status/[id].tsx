import { useRouter } from 'next/router'
export default function Status(){ 
  const { query } = useRouter()
  return <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-semibold">Status do Pedido #{query.id}</h1>
    <p className="mt-2">Status Atual: Em processamento</p>
  </div>
}
