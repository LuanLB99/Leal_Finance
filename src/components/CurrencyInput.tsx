interface Props {
  value: number
  onChange: (value: number) => void
}

function centsToDisplay(cents: number): string {
  if (cents === 0) return ''
  return (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Campo de valor com máscara: dígitos preenchem da direita pra esquerda, como em apps bancários. */
export default function CurrencyInput({ value, onChange }: Props) {
  const cents = Math.round(value * 100)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digitsOnly = e.target.value.replace(/\D/g, '')
    const newCents = digitsOnly ? parseInt(digitsOnly, 10) : 0
    onChange(newCents / 100)
  }

  return (
    <div className="currency-input">
      <span>R$</span>
      <input type="text" inputMode="decimal" value={centsToDisplay(cents)} onChange={handleChange} placeholder="0,00" />
    </div>
  )
}
