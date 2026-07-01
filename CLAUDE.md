# Règles du projet

## Boucle de vérification (obligatoire)
Après CHAQUE modification de code :
1. Lance `npm run check` (lint + typecheck + tests)
2. Si erreur : corrige et relance
3. Répète jusqu'à ce que tout soit vert
4. Ne termine JAMAIS une tâche avec un check rouge

## Conventions
- TypeScript strict, pas de `any`
- Toute nouvelle fonction = un test
- Pas de console.log en production

## Leçons apprises
(ajouter ici chaque erreur repérée pour que les futures sessions l'évitent)
