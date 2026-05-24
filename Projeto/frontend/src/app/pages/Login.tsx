import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap, Mail } from 'lucide-react';
import { storage } from '../utils/storage';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    // Simple mock login - in real app, this would validate against backend
    const user = {
      name: loginEmail.split('@')[0],
      email: loginEmail,
      subscribedCourses: [],
      calendarEvents: []
    };
    
    storage.saveUser(user);
    toast.success('Login realizado com sucesso!');
    navigate('/');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    const user = {
      name: registerName,
      email: registerEmail,
      subscribedCourses: [],
      calendarEvents: []
    };
    
    storage.saveUser(user);
    toast.success('Conta criada com sucesso!');
    navigate('/');
  };

  const handleGoogleSignIn = () => {
    // Mock Google sign-in
    const user = {
      name: 'Usuário Google',
      email: 'usuario@gmail.com',
      subscribedCourses: [],
      calendarEvents: []
    };
    
    storage.saveUser(user);
    toast.success('Login com Google realizado!');
    navigate('/');
  };

  const handleBrowseAsGuest = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Illustration and branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12">
        <div className="max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="size-12" />
            <h1 className="text-4xl">EducaFree</h1>
          </div>
          
          <p className="text-xl">
            Seu caminho para o conhecimento gratuito
          </p>
          
          <img 
            src="https://images.unsplash.com/photo-1620067285935-ead87c731296?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsZWFybmluZyUyMGFjY2Vzc2liaWxpdHklMjBkaXZlcnNlJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzc0Mjc2MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Educação acessível"
            className="rounded-lg shadow-2xl w-full"
          />
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1">✓</div>
              <p>Cursos 100% gratuitos de instituições confiáveis</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1">✓</div>
              <p>Certificados reconhecidos no mercado</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1">✓</div>
              <p>Flexibilidade para estudar no seu ritmo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login/Register forms */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <GraduationCap className="size-8 text-blue-600" />
            <h1 className="text-2xl text-blue-600">EducaFree</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo!</CardTitle>
              <CardDescription>
                Acesse sua conta ou crie uma nova para começar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Cadastrar</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button 
                        type="button"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Entrar
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Ou</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                  >
                    <Mail className="mr-2 size-4" />
                    Entrar com Google
                  </Button>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome Completo</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="João Silva"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm">Confirmar Senha</Label>
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      Criar Conta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Guest browsing option */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Quer conhecer primeiro?
            </p>
            <Button
              variant="link"
              className="text-blue-600"
              onClick={handleBrowseAsGuest}
            >
              Navegar como visitante →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
