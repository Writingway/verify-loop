# Règles du projet

## Boucle de vérification (obligatoire)

Après CHAQUE modification de code :

1. Lance `npm run check` (lint + typecheck + tests)
2. Si erreur : corrige et relance
3. Répète jusqu'à ce que tout soit vert
4. Ne termine JAMAIS une tâche avec un check rouge

Zone morte du check : tout script hors `src/` (hooks `.claude/`, outils) n'est
couvert ni par eslint ni par vitest. L'exécuter manuellement au moins une fois
avant de terminer (ex. `echo '<json>' | node script.mjs`).

## Conventions

- TypeScript strict, pas de `any`
- Toute nouvelle fonction = un test
- Pas de console.log en production
- Version minimale d'abord : pas de validation, option ou abstraction
  spéculative. Complexité seulement si demandée ou prouvée nécessaire.

## Leçons apprises

(ajouter ici chaque erreur repérée pour que les futures sessions l'évitent)

- `await` dans un callback non-async (`process.stdin.on('end', () => { await ... })`) = SyntaxError : le top-level await ne marche qu'au niveau module. Un script qui crashe au parse échoue en silence dans un hook.
- Dans les hooks Claude Code sous Windows, préférer un chemin relatif à `$CLAUDE_PROJECT_DIR` (syntaxe POSIX, expansion non garantie selon le shell) : le cwd du hook est la racine du projet.
- Premier plan de la persistance sur-conçu (type guard + 5 tests pour ~20 lignes) : l'utilisateur a dû demander de simplifier → règle "version minimale d'abord" ci-dessus.
