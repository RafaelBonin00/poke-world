export default function SenhaRequirementos({ checks, password, confirmPassword }){
  return (
    <div style={{ fontSize: '0.9em' }}>
      <p>Requisitos da senha:</p>
      <ul>
        <li style={{ color: checks.length ? 'green' : 'red' }}>
          Mínimo de 8 caracteres
        </li>
        <li style={{ color: checks.uppercase ? 'green' : 'red' }}>
          Pelo menos uma letra maiúscula
        </li>
        <li style={{ color: checks.number ? 'green' : 'red' }}>
          Pelo menos um número
        </li>
        <li style={{ color: checks.special ? 'green' : 'red' }}>
          Pelo menos um caractere especial
        </li>
        <li style={{
          color: password && confirmPassword && password === confirmPassword ? 'green' : 'red'
        }}>
          Senha e confirmação iguais
        </li>
      </ul>
    </div>
  );
}
