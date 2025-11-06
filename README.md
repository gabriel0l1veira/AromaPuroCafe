☕ Aroma Puro Café

Sistema completo de e-commerce para uma cafeteria gourmet, desenvolvido como parte do Projeto Integrador Transdisciplinar em Sistemas de Informação II.
O projeto permite navegar, adicionar produtos ao carrinho, realizar pedidos e acompanhar o status, com backend em Flask e banco PostgreSQL.

🧩 Estrutura do Projeto
AromaPuroCafe/
├── backend/      → API Flask + SQLAlchemy + PostgreSQL
├── frontend/     → Aplicação Next.js + Tailwind CSS
└── database/     → Scripts SQL e configurações de conexão

🖥️ Tecnologias Utilizadas
Camada	Tecnologia	Descrição
Frontend	Next.js 14
	Framework React com suporte SSR
	Tailwind CSS
	Estilização com classes utilitárias
	Lucide React
	Ícones leves e otimizados
Backend	Flask
	Framework Python minimalista
	SQLAlchemy
	ORM para mapeamento objeto-relacional
Banco	PostgreSQL
	Banco de dados relacional
Deploy	Render.com
	Hospedagem gratuita para Flask APIs
Hospedagem Frontend	Vercel
	Deploy contínuo para projetos Next.js
⚙️ Backend (Flask + PostgreSQL)
🧱 Estrutura de diretórios
backend/
├── app/
│   ├── routes/
│   │   ├── produtos.py
│   │   ├── carrinho.py
│   │   ├── pedidos.py
│   │   └── auth.py
│   ├── models/
│   │   └── models.py
│   └── __init__.py
├── database.py
├── main.py
└── requirements.txt

🔧 Variáveis de ambiente (.env)

Crie um arquivo backend/.env com o conteúdo:

FLASK_ENV=development
SECRET_KEY=chave_super_secreta
DATABASE_URL=postgresql+psycopg2://usuario:senha@localhost:5432/aroma_puro_cafe
FRONTEND_URL=http://localhost:3000

▶️ Executando localmente
cd backend
python -m venv venv
venv\Scripts\activate   # (Windows)
pip install -r requirements.txt
python main.py


A API estará disponível em:
👉 http://localhost:5000

💻 Frontend (Next.js + Tailwind)
🧱 Estrutura de diretórios
frontend/
├── pages/
│   ├── index.tsx
│   ├── produtos/
│   │   ├── index.tsx
│   │   └── [id].tsx
│   ├── carrinho.tsx
│   ├── checkout.tsx
│   └── pedidos.tsx
├── components/
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── Footer.tsx
├── context/
│   └── CartContext.tsx
└── styles/
    └── globals.css

🔧 Variáveis de ambiente (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000

▶️ Executando o frontend localmente
cd frontend
npm install
npm run dev


O app estará acessível em:
👉 http://localhost:3000

🚀 Deploy

🌐 Backend (Render)

Faça login em Render.com

Crie um novo serviço do tipo Web Service

Conecte o repositório do backend

Configure:

Build Command: pip install -r requirements.txt

Start Command: python main.py

Environment Variables:

DATABASE_URL

SECRET_KEY

FRONTEND_URL=https://seusite.vercel.app

🌐 Frontend (Vercel)

Faça login em Vercel

Clique em "Add New Project"

Conecte o repositório do frontend

Configure:

Environment Variable:
NEXT_PUBLIC_API_URL=https://suaapi.onrender.com


Este projeto foi desenvolvido para fins acadêmicos no curso de Sistemas de Informação - Cruzeiro do Sul Virtual, sob autoria de Gabriel José Oliveira de Sousa 

📬 Contato

📧 gabrielsoliveira26@hotmail.com

💻 GitHub - em breve

📍 Uberlândia - MG, Brasil