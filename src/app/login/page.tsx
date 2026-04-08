export const runtime = 'edge'

import LoginForm from './LoginForm'

export const metadata = { title: 'Login — Kard Hub' }

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#192547] px-4">
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #01F767 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden">
            <img src="https://pub-51d74cef61734d03867257479ddd2aae.r2.dev/KL-logo-fundo-azul-RGB.png" alt="Kard" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white">Kard Hub</h1>
          <p className="mt-1 text-sm font-medium text-white/50">
            Portal de Parceiros
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h2 className="mb-1 text-lg font-extrabold text-[#192547]">
            Entrar na sua conta
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Acesso exclusivo para parceiros Kard
          </p>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Kard. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
