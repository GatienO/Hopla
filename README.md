# Hopla

Application mobile pour trouver instantanément une activité simple à faire avec un enfant, avec ce qu'on a déjà à la maison.

Conçu pour les parents débordés : ouvre l'app, filtre selon ton énergie du moment et le temps disponible, trouve une idée en 10 secondes.

---

## Fonctionnalités

- **Catalogue d'activités** — des dizaines d'idées pour enfants de 1 à 6 ans, classées par pertinence
- **Filtres rapides** — âge, durée, énergie parent, lieu (intérieur / extérieur / pluie)
- **Filtres avancés** — matériel disponible, niveau de bazar, compétences développées, favoris uniquement
- **Recherche libre** — dans le titre, la description, les matériaux et les compétences
- **Détail complet** — étapes, matériel, objectifs de développement, variante parent KO, variante plus complexe
- **Favoris** — garde les activités qui fonctionnent bien
- **Historique** — retrouve les 30 dernières activités ouvertes
- **Persistance locale** — favoris et filtres sauvegardés entre les sessions

## Écrans

| Écran | Route | Description |
|---|---|---|
| Accueil | `/` | Liste filtrée et triée de toutes les activités |
| Détail | `/activity/[id]` | Fiche complète d'une activité |
| Favoris | `/favorites` | Activités marquées comme favorites |
| Historique | `/history` | 30 dernières activités consultées |

## Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| React Native | 0.81 | UI cross-platform |
| Expo | ~54 | Build, dev, distribution |
| Expo Router | ~6 | Navigation fichiers |
| TypeScript | ~5.9 | Typage statique |
| Zustand | 5 | État global |
| AsyncStorage | 2.2 | Persistance locale |

## Installation

```bash
npm install
npx expo start
```

Scanne le QR code avec **Expo Go** (iOS ou Android).

## Scripts

```bash
npm run start        # Démarrer le serveur de développement
npm run ios          # Lancer sur simulateur iOS
npm run android      # Lancer sur émulateur Android
npm run web          # Lancer dans le navigateur
npm run typecheck    # Vérifier les types TypeScript
```

## Structure du projet

```
app/
  _layout.tsx           # Layout racine (navigation)
  index.tsx             # Accueil — liste + filtres
  favorites.tsx         # Favoris
  history.tsx           # Historique
  activity/[id].tsx     # Détail d'une activité
components/             # Composants UI réutilisables
data/
  activities.ts         # Catalogue complet des activités
store/
  activity-store.ts     # État global (Zustand + persistance)
types/
  activity.ts           # Types TypeScript
  options.ts            # Types des options de filtres
utils/
  activity-filter.ts    # Logique de filtrage et tri
  activity-library.ts   # Accès aux activités par id
  labels.ts             # Labels affichés (énergie, bazar, météo…)
  theme.ts              # Couleurs et rayons de bordure
```

## Logique de filtrage

La logique est dans [`utils/activity-filter.ts`](utils/activity-filter.ts).

**Filtres disponibles :**
- Recherche textuelle (titre, description, matériel, compétences)
- Âge par intersection avec la tranche d'âge de l'activité
- Durée maximale
- Énergie parent (compatible avec le niveau choisi ou moins exigeant)
- Météo / lieu compatible
- Matériel disponible (au moins un en commun)
- Niveau de bazar
- Compétences travaillées
- Favoris uniquement

**Tri par défaut :**
1. Favoris en premier
2. Activités courtes
3. Compatibles parent fatigué
4. Peu de bazar
