import os
import subprocess
import sys
from pathlib import Path

# Configurações - Ajuste os nomes das pastas se forem diferentes
BACKEND_DIR = Path("./backend")  
FRONTEND_DIR = Path("./frontend")  
VENV_DIR = BACKEND_DIR / "venv"

def main():
    print("🚀 Iniciando o setup do projeto...")

    # 1. Cria a venv se não existir
    if not VENV_DIR.exists():
        print("📦 Criando ambiente virtual (venv)...")
        subprocess.run([sys.executable, "-m", "venv", str(VENV_DIR)], check=True)
    
    # 2. Configura caminhos do pip e uvicorn
    if os.name == "nt":  # Windows
        pip_path = VENV_DIR / "Scripts" / "pip"
        uvicorn_path = VENV_DIR / "Scripts" / "uvicorn"
    else:  # Linux / Mac
        pip_path = VENV_DIR / "bin" / "pip"
        uvicorn_path = VENV_DIR / "bin" / "uvicorn"

    # 3. Instala requerimentos do Backend
    requirements_file = BACKEND_DIR / "requirements.txt"
    if requirements_file.exists():
        print("📥 Instalando dependências do Python...")
        subprocess.run([str(pip_path), "install", "-r", str(requirements_file)], check=True)

    # 4. Instala dependências do Frontend
    if FRONTEND_DIR.exists():
        print("📦 Instalando dependências do npm...")
        subprocess.run(["npm", "install"], cwd=FRONTEND_DIR, check=True, shell=True)

    print("\n🔥 Iniciando os servidores em janelas separadas...")

    # 5. Roda os servidores dependendo do Sistema Operacional
    if os.name == "nt":  # Se for WINDOWS
        # O comando 'start' abre uma nova janela de prompt de comando para cada um
        
        # Inicia o Backend (Ativa a venv e roda o uvicorn)
        backend_cmd = f'cmd /k "cd {BACKEND_DIR} && ..\\{uvicorn_path} main:app --reload"'
        subprocess.Popen(backend_cmd, shell=True)
        print("⚡ Janela do Backend (FastAPI) iniciada.")

        # Inicia o Frontend
        frontend_cmd = f'cmd /k "cd {FRONTEND_DIR} && npm run dev"'
        subprocess.Popen(frontend_cmd, shell=True)
        print("⚡ Janela do Frontend (Vite) iniciada.")
        
        print("\nProntinho! Pode olhar as novas janelas do terminal que se abriram.")

    else:  # Se for Linux / Mac (roda em background no mesmo terminal de forma segura)
        backend_process = subprocess.Popen(f"{uvicorn_path} main:app --reload", cwd=BACKEND_DIR, shell=True)
        frontend_process = subprocess.Popen("npm run dev", cwd=FRONTEND_DIR, shell=True)
        
        try:
            backend_process.wait()
            frontend_process.wait()
        except KeyboardInterrupt:
            print("\n🛑 Desligando os servidores...")
            backend_process.terminate()
            frontend_process.terminate()

if __name__ == "__main__":
    main()