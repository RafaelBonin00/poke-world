import InputCadastro from './InputCadastro';
import SenhaRequirementos from './SenhaRequirementos';

export default function CadastroForm({
  form,
  passwordChecks,
  handleChange,
  handleBlur,
  handleSubmit,
  isFormValid,
  isSubmitting,
}) {
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <InputCadastro name="firstName" placeholder="Primeiro nome" value={form.firstName} onChange={handleChange} onBlur={handleBlur} />
      <InputCadastro name="lastName" placeholder="Sobrenome" value={form.lastName} onChange={handleChange} onBlur={handleBlur} />
      <InputCadastro name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} onBlur={handleBlur} />
      <InputCadastro name="confirmEmail" type="email" placeholder="Confirmar email" value={form.confirmEmail} onChange={handleChange} onBlur={handleBlur} />
      <InputCadastro name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange} onBlur={handleBlur} />
      <InputCadastro name="confirmPassword" type="password" placeholder="Confirmar senha" value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur} />

      <SenhaRequirementos
        checks={passwordChecks}
        password={form.password}
        confirmPassword={form.confirmPassword}
      />

      <button type="submit" disabled={!isFormValid || isSubmitting}>
        Cadastrar
      </button>
    </form>
  );
}
