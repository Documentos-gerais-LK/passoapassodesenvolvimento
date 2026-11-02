# LK Development Academy

**Do primeiro planejamento à publicação: aprenda desenvolvendo.**

Plataforma educacional interativa que ensina, passo a passo, um fluxo estruturado de desenvolvimento:

`Necessidade → Pesquisa → Especificação → Organização → Implementação → Testes → Homologação → Publicação`

## Público

Pessoas que já programam e querem integrar ChatGPT, Claude Code e GitHub em um processo rastreável. O treinamento tem duas trilhas: **A** (projeto pessoal, risco reduzido) e **B** (adaptação às regras de colaboração e segurança de uma empresa).

## Conteúdo

15 módulos (00–14), 35 etapas e 92 atividades verificáveis. Cada etapa segue o mesmo formato: o que vamos fazer, por que importa, ferramenta, passo a passo, resultado esperado, como conferir, checklist, problemas comuns e próxima etapa. Também há:

- Meu checklist de desenvolvimento (filtros, próxima ação, progresso por módulo).
- Biblioteca de 10 prompts com campos personalizáveis e botão de copiar.
- Glossário pesquisável.
- Simulações: fluxo do GitHub, CI, escolha tecnológica, escada de publicação.
- Formulários locais: especificação e registro de homologação (copiáveis em Markdown).

> Este repositório não contém dados privados de empresas, clientes, credenciais nem transcrições internas.

## Tecnologias

React 19, TypeScript, Vite, Tailwind CSS 4, Motion for React, Lucide React. Testes com Vitest e Testing Library; lint com ESLint.

React Bits e GSAP não foram usados: o fundo animado é CSS próprio e as animações são feitas com Motion, o suficiente para o escopo atual.

## Executar

Requer Node.js LTS.

```bash
npm install
npm run dev        # desenvolvimento
npm test           # testes
npm run lint       # lint
npm run typecheck  # tipos
npm run build      # build de produção
npm run preview    # serve o build localmente
npm run check      # typecheck + lint + testes + build
```

## Limitações do armazenamento local

O progresso e os rascunhos dos formulários ficam no `localStorage` do navegador:

- valem apenas para aquele navegador e aquele dispositivo (não há sincronização);
- podem ser perdidos se os dados do site forem limpos ou em janelas anônimas;
- não há login nem backend.

Se o navegador bloquear o armazenamento, a aplicação avisa que o progresso vale apenas na sessão.

## Estrutura

```
src/content/    conteúdo educacional (módulos, prompts, glossário, dados das simulações)
src/lib/        progresso (puro e testado), rota por hash, clipboard, geração de Markdown
src/components/ interface, widgets interativos, etapa
src/pages/      páginas (início, módulo, checklist, prompts, glossário, conclusão)
```

## Publicação

Não há deploy configurado. O build é estático (`dist/`) e usa rotas por hash, então pode ser servido de qualquer hospedagem estática, mediante autorização.

## Aviso

A conclusão do treinamento não é certificação profissional formal e não concede acessos nem autoriza publicações em projetos de nenhuma empresa. Comandos e telas de ferramentas de terceiros mudam: confirme sempre na documentação oficial.
