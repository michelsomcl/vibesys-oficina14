
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrdemServicoWithDetails, useDeleteOrdemServico } from "@/hooks/useOrdensServico"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { OrdemServicoCardStatus } from "@/components/OrdemServicoCardStatus"
import { OrdemServicoCardFinancial } from "@/components/OrdemServicoCardFinancial"

interface OrdemServicoCardProps {
  os: OrdemServicoWithDetails
  onView: (os: OrdemServicoWithDetails) => void
  onEdit: (os: OrdemServicoWithDetails) => void
}

export const OrdemServicoCard = ({ os, onView, onEdit }: OrdemServicoCardProps) => {
  const deleteOrdemServico = useDeleteOrdemServico()

  const handleDelete = () => {
    deleteOrdemServico.mutate(os.id)
  }

  const getVeiculoInfo = (os: OrdemServicoWithDetails) => {
    if (os.veiculo) {
      return `${os.veiculo.marca} ${os.veiculo.modelo} ${os.veiculo.ano} - ${os.veiculo.placa}`
    }
    
    if (os.cliente && os.cliente.marca && os.cliente.modelo) {
      return `${os.cliente.marca} ${os.cliente.modelo} ${os.cliente.ano} - ${os.cliente.placa}`
    }
    
    return 'N/A'
  }

  const valorComDesconto = os.valor_total - (os.desconto || 0)
  const valorAPagarCalculado = valorComDesconto - os.valor_pago

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">OS {os.numero}</CardTitle>
              <OrdemServicoCardStatus status={os.status_servico} />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p><strong>Cliente:</strong> {os.cliente?.nome}</p>
                <p><strong>Veículo:</strong> {getVeiculoInfo(os)}</p>
                {os.km_atual && <p><strong>Km Atual:</strong> {os.km_atual}</p>}
              </div>
              <div>
                <p><strong>Início:</strong> {format(new Date(os.data_inicio), 'dd/MM/yyyy')}</p>
                <p><strong>Prazo:</strong> {format(new Date(os.prazo_conclusao), 'dd/MM/yyyy')}</p>
                <p><strong>Status Pagamento:</strong> 
                  <Badge variant={os.status_pagamento === 'Pendente' ? "destructive" : "default"} className="ml-2">
                    {os.status_pagamento}
                  </Badge>
                </p>
              </div>
            </div>

            {os.observacao && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm"><strong>Observações:</strong></p>
                <p className="text-sm text-muted-foreground mt-1">{os.observacao}</p>
              </div>
            )}
          </div>
          
          <div className="text-right space-y-2">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">
                R$ {os.valor_total.toFixed(2).replace('.', ',')}
              </div>
              {(os.desconto || 0) > 0 && (
                <div className="text-sm">
                  <p className="text-orange-600">Desconto: R$ {(os.desconto || 0).toFixed(2).replace('.', ',')}</p>
                  <p className="font-semibold text-green-600">Total: R$ {valorComDesconto.toFixed(2).replace('.', ',')}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(os)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(os)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir a OS {os.numero}? Esta ação não pode ser desfeita.
                      {os.orcamento && (
                        <span className="block mt-2 text-sm">
                          O orçamento vinculado voltará para o status "Pendente".
                        </span>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deleteOrdemServico.isPending}
                    >
                      {deleteOrdemServico.isPending ? "Excluindo..." : "Excluir"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Peças</h4>
                <div className="space-y-1">
                  {os.orcamento?.orcamento_pecas?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantidade}x {item.peca?.nome}</span>
                      <span>R$ {(item.quantidade * parseFloat(item.valor_unitario.toString())).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )) || <span className="text-sm text-muted-foreground">Nenhuma peça</span>}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Serviços</h4>
                <div className="space-y-1">
                  {os.orcamento?.orcamento_servicos?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.horas}h {item.servico?.nome}</span>
                      <span>R$ {(parseFloat(item.horas.toString()) * parseFloat(item.valor_hora.toString())).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )) || <span className="text-sm text-muted-foreground">Nenhum serviço</span>}
                </div>
              </div>
            </div>
          </div>
          
          <OrdemServicoCardFinancial
            valorTotal={os.valor_total}
            desconto={os.desconto}
            valorPago={os.valor_pago}
            formaPagamento={os.forma_pagamento}
          />
        </div>
      </CardContent>
    </Card>
  )
}
