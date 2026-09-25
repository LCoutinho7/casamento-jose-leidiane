# José & Leidiane — site do casamento

Site do casamento do meu tio Zé com a Leidi, marcado para **16 de janeiro de 2027**. Conta a história dos dois (do primeiro encontro no cinema ao pedido no Cristo Redentor), reúne as informações do grande dia e concentra o que os convidados precisam fazer: confirmar presença, escolher um presente e deixar um bilhetinho para os noivos.

É um site estático, sem framework de servidor, publicado no GitHub Pages. A ideia foi manter o projeto pequeno o suficiente para caber na cabeça inteira e fácil de manter até o dia da festa.

## O que tem no site

- **Nossa história** — linha do tempo com cinco capítulos e fotos reais do casal.
- **Contagem regressiva** com botões para salvar a data no Google Agenda ou baixar um `.ics`.
- **Galeria** com filtro por momento (ensaio, viagens, noivado) e lightbox navegável pelo teclado.
- **O grande dia** — cards de cerimônia e recepção com mapa e endereço para copiar. Enquanto o local não é confirmado, a seção mostra um aviso em vez de dados inventados.
- **Lista de presentes** em dois caminhos: link para a lista no Magazine Luiza e cotas simbólicas via PIX. O site gera o payload "PIX copia e cola" (BR Code do Banco Central) com o valor da cota já preenchido, sem depender de gateway nem de taxa.
- **Mural de bilhetinhos** — o convidado escreve um recado, escolhe a cor do papel e ele fica marcado como "aguardando aprovação" até os noivos liberarem.
- **RSVP** — ainda fechado. A confirmação abre junto com o convite, com a regra de acompanhantes por convite.
- **Guia do convidado** e **perguntas frequentes**.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite 6](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com), com os tokens do projeto declarados em `@theme` (`src/index.css`)
- [lucide-react](https://lucide.dev) para os ícones
- GitHub Actions + GitHub Pages para o deploy

Sem biblioteca de estado, sem roteador, sem backend. Cada coisa que o site precisa lembrar (por enquanto só os bilhetes pendentes do próprio visitante) fica no `localStorage`.

## Rodando localmente

```bash
npm install
npm run dev
```

Outros scripts:

| Comando | O que faz |
|---|---|
| `npm run build` | Checa os tipos e gera a versão de produção em `dist/` |
| `npm run preview` | Serve o `dist/` localmente |
| `npm run typecheck` | Só a checagem de tipos |

## Estrutura

```
src/
├── data/wedding.ts        # tudo que é conteúdo: datas, história, galeria, cotas, FAQ
├── types.ts
├── hooks/                 # useCountdown, useLocalStorage
├── lib/                   # formatação, geração do payload PIX, utilitário de classes
├── components/
│   ├── ui/                # Button, SectionHeading, Modal, Field
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # uma pasta por seção da página, na ordem em que aparecem
│   ├── GiftModal.tsx
│   └── NoteModal.tsx
├── App.tsx
└── index.css              # tokens (@theme) e estilos base
public/images/             # fotos otimizadas em WebP (as originais ficam fora do repositório)
```

Quase toda alteração de conteúdo acontece em `src/data/wedding.ts`. Quando os noivos confirmarem o local, a chave PIX, o WhatsApp e o link da lista, basta preencher os campos lá e as seções passam a exibir os dados sozinhas.

## Deploy

Todo push na `main` roda o workflow em `.github/workflows/deploy.yml`, que publica o `dist/` no GitHub Pages. O domínio é `casamentoleidize.com.br`, definido em `public/CNAME`.

## Próximos passos

- [ ] RSVP com busca do convite pelo nome e confirmação individual de cada acompanhante (a lista de convidados está sendo fechada em planilha).
- [ ] Painel simples para os noivos aprovarem ou recusarem os bilhetinhos. Vai exigir uma API pequena em Node.js com banco gratuito; até lá os bilhetes ficam locais.
- [ ] Local, horário, chave PIX, WhatsApp e link da lista de presentes, assim que os noivos confirmarem.
