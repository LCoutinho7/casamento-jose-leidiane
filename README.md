# casamentoleidize.com.br

Site do casamento do meu tio, em 16 de janeiro de 2027. Está no ar em
**[casamentoleidize.com.br](https://casamentoleidize.com.br)**.

Não é um site institucional: os convidados precisam fazer coisas nele. Escolher um presente e pagar
por PIX, deixar um recado para o casal, consultar local e horário. E do outro lado existe um casal
que precisa moderar o que os convidados escrevem e confirmar quais presentes realmente caíram na
conta. Isso significa escrita pública, moderação privada e e-mail transacional — em um projeto que
não pode custar nada por mês e que precisa continuar funcionando sem manutenção até a data da festa.

O resultado é um front-end estático no GitHub Pages falando direto com o Postgres do Supabase, sem
servidor próprio no meio.

## As decisões que definiram o projeto

**PIX gerado no navegador, sem gateway.** As cotas de presente poderiam passar por uma plataforma de
lista de casamento, que cobra de 5% a 9% do valor. Em vez disso o site monta o payload do BR Code —
o padrão EMV do Banco Central, com CRC16 no fim — direto no cliente, já com o valor da cota
preenchido ([`src/lib/pix.ts`](src/lib/pix.ts)). O convidado copia e cola no app do banco. Zero taxa,
zero intermediário, zero dado de pagamento passando por mim. Validei o CRC contra o exemplo oficial
da especificação antes de confiar nele.

**A segurança mora no banco, não no JavaScript.** O site é estático, então a chave do Supabase está
no bundle e qualquer pessoa pode montar um POST na mão. Por isso nenhuma regra depende do front-end:

- Row Level Security deixa qualquer um inserir um bilhete, mas ler apenas os aprovados. Os avisos de
  presente ninguém lê, exceto os noivos autenticados.
- Um `BEFORE INSERT` sobrescreve o campo `status` a cada inserção — mandar `"status": "approved"` no
  JSON não aprova nada.
- O limite por convidado é contado no banco, por hash do IP que o PostgREST expõe no header. Sem
  login, é o mais perto de "por pessoa" que dá para chegar.

**E-mail transacional sem função serverless.** Quando um bilhete chega, os noivos são avisados; quando
eles confirmam um presente, o convidado recebe um comprovante. Isso poderia ser uma Edge Function,
mas seria mais um artefato para versionar e implantar. O gatilho chama a API do Resend pelo `pg_net`,
com a chave no Vault do Supabase, e os templates HTML são funções SQL — trocar o visual do e-mail não
exige redeploy de nada ([`supabase/`](supabase/)).

**O painel de moderação é outra página, não um roteador.** O site tem uma página só; colocar um
roteador para servir `/admin` seria carregar uma dependência inteira por causa de uma rota. O Vite
gera dois pontos de entrada, e o `@supabase/supabase-js` (que entra por causa do login) fica no bundle
do painel: o site público carrega **19 kB gzip** e usa `fetch` puro.

**Nada inventado na tela.** Enquanto os noivos não confirmavam o local, a seção mostrava um aviso em
vez de um endereço fictício. Vale para chave PIX, contatos e links de lista: cada campo vazio em
[`src/data/wedding.ts`](src/data/wedding.ts) degrada para "em breve" sozinho.

## O que o site faz

Linha do tempo com cinco capítulos da história do casal, galeria com filtro e lightbox navegável por
teclado, contagem regressiva com exportação para Google Agenda e `.ics`, cotas de presente com o
fluxo completo de PIX, mural de recados com moderação, e o guia dos convidados. O RSVP tem a data
limite e a estrutura de dados prontas, esperando a lista de convidados fechar.

O conteúdo todo — datas, textos, fotos, cotas, FAQ — vive em um arquivo só. Mudar a lista de
presentes é editar um array.

## Detalhes que custaram tempo

O movimento é todo em `transform` e `opacity`, com `prefers-reduced-motion` respeitado: a linha do
tempo se desenha conforme o scroll, o contador entra como folhinha de calendário caindo, e confirmar
um presente solta confete. O mural vira carrossel com `scroll-snap` no mobile e paginação automática
no desktop, pausando quando o cursor está em cima.

As 28 fotos vieram de um Drive com quase 1 GB de originais. Depois da curadoria e da conversão para
WebP, o site inteiro carrega 3,7 MB de imagem.

## Stack

React 19, TypeScript, Vite 6 e Tailwind CSS 4 — com todos os valores visuais declarados em `@theme`,
de modo que nenhum hexadecimal ou duração de transição apareça solto em componente. Supabase
(Postgres, Auth, RLS) para os dados, Resend para e-mail, GitHub Actions publicando no GitHub Pages a
cada push. Sem biblioteca de estado e sem roteador.

## Rodando

```bash
npm install
npm run dev
```

`npm run build` checa os tipos e gera o `dist/`; `npm run preview` serve o resultado. O schema do
banco, as políticas de acesso e os templates de e-mail estão em [`supabase/`](supabase/), na ordem em
que devem ser aplicados.

```
src/
├── data/wedding.ts   todo o conteúdo do site
├── lib/              PIX (BR Code), cliente REST, formatação
├── hooks/            contagem regressiva, scroll reveal, media query
├── components/
│   ├── ui/           botão, modal, campo, tilt, confete
│   ├── layout/       navbar, rodapé, barra de progresso
│   └── sections/     uma por seção da página
├── admin/            painel de moderação (entrada separada)
└── index.css         tokens e estilos base
```
