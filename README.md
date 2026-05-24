# Interação Humanocomputador
Repositório do projeto da matéria de Interação Humanocomputador pelo grupo:

- Edmilson Li Quansang        10425514
- João Paulo B. Massabki      10425593
- Pietro Caffettani              10425628

---

# Link para acesso no Figma

Para acessar o site [EducaFree](https://www.figma.com/make/smVzaMCE9ozkIWcL2OPZon/EducaFree?t=gcKgXdCZFFirg1Au-20&fullscreen=1)

---
# Guia de Inicialização Rápida

Este é o guia passo a passo para clonar, instalar e correr o projeto **EducaFree** localmente na tua máquina.


## 🛠️ Pré-requisitos

Antes de começares, certifica-te de que tens instalado no teu computador:
* **Python 3.10+**
* **Node.js**
* **Git**

---

## 💻 Passo a Passo para executar o Projeto

Abre o teu terminal e segue as instruções abaixo:

### 1. Clonar o Repositório
Descarrega os arquivos do projeto do GitHub para a tua máquina:
```bash
git clone https://github.com/Engomadinhos-de-Salmourao/IHC.git
```
## ⚙️ Configuração do Backend (API)
### 2. Entrar na Pasta do Backend
Navega até à pasta do servidor:

```Bash
cd IHC/Projeto/backend
```
### 3. Criar e Ativar o Ambiente Virtual (venv)
Cria um ambiente isolado para instalar as dependências do Python:

#### No Windows (PowerShell):
```bash
python -m venv venv
.\venv\Scripts\Activate
```
#### No Mac/Linux:

```Bash
python3 -m venv venv
source venv/bin/activate
```
### 4. Instalar as Dependências do Python
Instala todas as bibliotecas necessárias listadas no projeto (como FastAPI, Uvicorn, etc.):

```Bash
pip install -r requirements.txt\
```
### 5. Popular o Banco de Dados (Opcional)
Se precisares de gerar os dados iniciais de teste no teu banco local:

```Bash
python seed_data.py
```
### 6. Iniciar o Servidor do Backend
Coloca a API a correr localmente com o Uvicorn:

```Bash
uvicorn main:app --reload
```
A API ficará disponível em: http://localhost:8000

## 🎨 Configuração do Frontend (Interface)
Abra um novo terminal para rodar o frontend, mantendo o terminal do backend ativo.

### 8. Entrar na Pasta do Frontend
Navega até à pasta onde estão os ficheiros de configuração do cliente:

```Bash
cd IHC/Projeto/frontend
```
### 9. Instalar as Dependências do Node
Instala todas as bibliotecas e ferramentas necessárias para o projeto (como React, Tailwind CSS e Lucide Icons):

```Bash
npm install
```
### 10. Iniciar o Servidor de Desenvolvimento
Coloca o projeto a correr localmente:

```Bash
npm run dev
```
11. Aceder no Navegador
Após iniciar o servidor, o Vite disponibilizará um link local no terminal.

Abre o teu navegador de preferência e acesse:
👉 http://localhost:5173
