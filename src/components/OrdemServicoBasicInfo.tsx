
import { OrdemServicoWithDetails } from "@/hooks/useOrdensServico"

interface OrdemServicoBasicInfoProps {
  ordemServico: OrdemServicoWithDetails
}

export const OrdemServicoBasicInfo = ({ ordemServico }: OrdemServicoBasicInfoProps) => {
  // Usar o veículo específico da OS ou o veículo do cliente
  const veiculo = ordemServico.veiculo || ordemServico.cliente_veiculo

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold mb-2">Cliente</h3>
        <p className="text-sm">{ordemServico.cliente?.nome}</p>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Veículo</h3>
        <p className="text-sm">
          {veiculo 
            ? `${veiculo.marca} ${veiculo.modelo} ${veiculo.ano} - ${veiculo.placa}`
            : 'N/A'
          }
        </p>
      </div>
    </div>
  )
}
