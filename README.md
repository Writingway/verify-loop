# verify-loop

Projet d'entraînement aux **verification loops** avec Claude Code (méthode Boris Cherny).

Le sujet de ce repo n'est pas la todo-list — c'est **la méthode**. Le code (un module tasks de ~30 lignes, une mini UI) sert uniquement de matière à démontrer un système où l'agent ne peut pas livrer du code non vérifié.

## La boucle

```
        ┌─────────────────────────────────────────────┐
        │                                             │
        ▼                                             │
  prompt / plan ──► modification du code              │
                          │                           │
                          ▼                           │
              hook PostToolUse : prettier             │
              (formatage déterministe,                │
               que l'agent y pense ou non)            │
                          │                           │
                          ▼                           │
                   npm run check                      │
              lint + typecheck + tests                │
                          │                           │
                 rouge ? ─┴─► corrige ────────────────┘
                          │
                        vert
                          │
                          ▼
              npm run check:full (e2e)
                          │
                          ▼
              commit + leçon → CLAUDE.md
```

Trois niveaux de garantie, du plus rapide au plus complet :

| Niveau          | Commande             | Couvre                            | Durée      |
| --------------- | -------------------- | --------------------------------- | ---------- |
| Boucle interne  | `npm run check`      | eslint + tsc + vitest (unitaires) | ~2 s       |
| Boucle complète | `npm run check:full` | check + Playwright (chromium)     | ~5 s       |
| Formatage       | hook automatique     | prettier sur chaque Edit/Write    | instantané |

## Pourquoi chaque pièce existe

**`CLAUDE.md`** — le contrat. Règle centrale : _ne jamais terminer une tâche avec un check rouge_. L'agent le lit à chaque session ; les règles survivent aux conversations.

**`npm run check`** — la boucle de vérification elle-même. Une seule commande, réponse binaire (vert/rouge). L'agent itère dessus jusqu'au vert au lieu d'affirmer "ça devrait marcher".

**Le hook prettier** (`.claude/settings.json` + `.claude/hooks/format.mjs`) — la leçon la plus importante du projet : **déterministe > prompt**. Demander à l'agent de formater = fiable à 90 %. Un hook qui s'exécute à chaque édition = fiable à 100 %, que l'agent y pense ou non.

**TDD (rouge avant vert)** — chaque feature de ce repo a suivi le cycle : test écrit d'abord, échec observé, puis implémentation. Un test qu'on n'a jamais vu échouer ne prouve rien. Le e2e Playwright a suivi la même règle : rouge constaté avant d'écrire `src/ui.ts`.

**`check:full` séparé de `check`** — la boucle interne doit rester rapide (feedback en secondes, l'agent la lance après chaque modification). Le e2e, plus lent, se lance en fin de tâche. Deux boucles, deux fréquences.

**La section "Leçons apprises" de `CLAUDE.md`** — la méta-loop. Chaque erreur repérée en session devient une règle écrite que les sessions futures lisent. Le système s'améliore à chaque itération, pas seulement le code.

## Leçons apprises (extraites du CLAUDE.md)

1. **`await` dans un callback non-async = SyntaxError silencieuse.** Le hook prettier a été livré cassé : crash au parse, échec muet à chaque exécution. D'où la règle : tout script hors `src/` échappe à `npm run check` (zone morte) → le tester manuellement (`echo '<json>' | node script.mjs`) avant de compter dessus.
2. **Chemins relatifs dans les hooks sous Windows.** `$CLAUDE_PROJECT_DIR` (syntaxe POSIX) n'est pas expansé par tous les shells ; le cwd d'un hook est la racine du projet.
3. **Version minimale d'abord.** Premier plan de la persistance sur-conçu (type guard + 5 tests pour ~20 lignes) ; l'utilisateur a dû demander de simplifier. Pas de validation ni d'abstraction spéculative.
4. **Course hook / test runner.** Lancer vitest immédiatement après une édition peut lire le fichier pendant que le hook le réécrit → erreurs incompréhensibles. Run bizarre juste après un Edit → relancer avant de débugger.
5. **Vitest ramasse `**/*.spec.ts` par défaut.** Sans `vitest.config.ts` verrouillé sur `src/`, le spec Playwright aurait cassé `npm run check`.

## Structure

```
CLAUDE.md              contrat + leçons (lu par l'agent à chaque session)
.claude/
  settings.json        hook PostToolUse → prettier
  hooks/format.mjs     le script du hook
src/
  tasks.ts             domaine pur (create/update/complete/pending)
  storage.ts           persistance JSON (save/load)
  *.test.ts            tests unitaires vitest (11)
  ui.ts                mini UI web (réutilise tasks.ts sans le modifier)
index.html             squelette de l'UI (Vite)
e2e/tasks.spec.ts      test e2e Playwright (1 scénario complet)
```

## Lancer

```bash
npm install
npx playwright install chromium   # une fois
npm run dev          # UI sur http://localhost:5173
npm run check        # boucle rapide : lint + typecheck + tests
npm run check:full   # check + e2e
```
