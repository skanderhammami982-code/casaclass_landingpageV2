# Landing page CasaClass — dossier de livraison

Document destiné à la personne qui met la page en ligne.

---

## 1. Ce que contient la livraison

```
index.html                    la page entière (HTML + CSS + JS)
assets/extrait-seance.mp4     vidéo du hero          — 4,4 Mo
assets/temoignage.ogg         message vocal parent   — 226 Ko
assets/logo-casaclass.png     logo (favicon)         —  19 Ko
```

**Total : 4,8 Mo.** Aucune dépendance, aucun build, aucun framework.
Pas de PHP, pas de Node, pas de base de données.

Le dépôt de référence : <https://github.com/skanderhammami982-code/casaclass_landingpageV2>

---

## 2. Mise en ligne

Déposer les fichiers à la racine du site, **en conservant le dossier `assets/`
au même niveau que `index.html`** — les chemins sont relatifs.

```
/  (racine du site)
├── index.html
└── assets/
    ├── extrait-seance.mp4
    ├── temoignage.ogg
    └── logo-casaclass.png
```

### Exigences du serveur

| Point | Pourquoi |
|---|---|
| **HTTPS obligatoire** | Exigé par Meta Ads ; sans lui le navigateur bloque une partie des fonctions |
| **Requêtes par plage (`Accept-Ranges`)** | Sans elles, impossible de se déplacer dans la vidéo et l'audio |
| **Type MIME `audio/ogg` pour `.ogg`** | Voir ci-dessous — c'est le piège le plus fréquent |
| `index.html` à la racine | Pour que la page réponde sur `/` |

### Le piège du `.ogg`

Beaucoup de serveurs Apache ne connaissent pas l'extension `.ogg` et la servent
en `application/octet-stream` : **le navigateur refuse alors de lire le message
vocal**, sans message d'erreur explicite. À ajouter dans la configuration ou le
`.htaccess` :

```apache
AddType audio/ogg .ogg
AddType video/mp4 .mp4
```

Sur nginx, vérifier que `mime.types` contient bien `audio/ogg ogg;`.
Sur Netlify, Vercel ou GitHub Pages, rien à faire, c'est déjà correct.

### Compatibilité Safari

Safari ne lit les fichiers Ogg que depuis la version **17.4** (mars 2024). Pour
couvrir les iPhone plus anciens, convertir `temoignage.ogg` en `.m4a` et ajouter
une source **avant** l'existante, dans la balise `<audio id="vnAudio">` :

```html
<source src="assets/temoignage.m4a" type="audio/mp4">
```

---

## 3. À configurer AVANT de lancer les publicités

Ces quatre points sont bloquants. La page fonctionne sans eux, mais elle ne
rapportera rien.

### 3.1 — Le formulaire n'envoie nulle part *(critique)*

En bas de `index.html`, la fonction `sendLead()` ne fait qu'écrire dans la
console du navigateur. **En l'état, aucun prospect n'est enregistré.**

```js
function sendLead(d){ console.log('Lead CasaClass :',d); }
```

À remplacer par l'envoi vers le CRM, un webhook Make/Zapier, ou une adresse
e-mail :

```js
function sendLead(d){
  fetch('https://VOTRE-WEBHOOK', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(d)
  });
}
```

Le lead contient déjà : prénom du parent, prénom de l'enfant, numéro WhatsApp,
tranche d'âge, **la formule tarifaire consultée**, la langue d'affichage, et les
paramètres UTM de la campagne.

### 3.2 — Le pixel Meta est désactivé

Dans la fonction `track()`, la ligne est commentée :

```js
// if(window.fbq) fbq('track', event, data);
```

La décommenter et ajouter le code du pixel dans le `<head>`. Les évènements déjà
câblés : `Form_Open`, `Form_Step1`, `Lead`, `Lang_Switch`, `Audio_Play`,
`Audio_Speed`, `FAQ_Open`.

Penser aussi à la **vérification du domaine** dans le Business Manager Meta
(balise `meta` dans le `<head>` ou enregistrement `TXT` au DNS).

### 3.3 — Deux emplacements de contenu restent vides

Repérables dans le code par `data-placeholder` :

- **`quote`** — section « Témoignage » : le prénom réel de la maman et la phrase
  la plus forte de son message vocal. Le mode d'emploi est écrit en commentaire
  juste au-dessus. *Important : une grande partie du trafic mobile défile sans
  le son ; sans cette phrase écrite, la section ne convainc personne.*
- **`price`** — tarifs de rentrée. À mettre à jour à la fin de l'opération
  promotionnelle, et à vérifier avant diffusion (voir 3.4).

### 3.4 — Les prix barrés

La page affiche 45 € → 39 €, 79 € → 69 €, 99 € → 89 €. Dans l'Union européenne,
un prix de référence barré doit correspondre au prix **réellement pratiqué** avant
la promotion (le plus bas des 30 derniers jours). Si ces montants n'ont jamais
été appliqués, retirer les barrés : Meta refuse des annonces sur ce motif.

---

## 4. Ce que la page fait déjà

- **Bilingue français / arabe**, bascule sans rechargement, passage en RTL,
  polices arabes chargées seulement au premier passage en arabe.
- `?lang=ar` dans l'URL force la version arabe au chargement — pratique pour
  router une campagne arabophone directement vers la bonne version.
- **Formulaire en 2 étapes** : l'âge de l'enfant d'abord (aucune donnée
  personnelle), puis 3 champs. Le formulaire existe en un seul exemplaire et se
  déplace dans une fenêtre modale au clic : la progression du visiteur est
  conservée.
- **Lecteur audio** du témoignage avec vitesse 1,5× par défaut, réglable en 2×.
- Numéro WhatsApp en place : **+216 28 20 83 93**.

---

## 5. Merci de renvoyer

- [ ] L'**URL finale** de la page (pour les publicités)
- [ ] La destination des **leads** (webhook, CRM ou e-mail)
- [ ] L'**identifiant du pixel** Meta
- [ ] Un **accès en écriture au dépôt git** du projet (voir section 6)
- [ ] Confirmation que la **vidéo et l'audio se lisent** depuis un vrai téléphone

---

## 6. Déploiement depuis git et accès

Merci de **placer le projet sous git et de relier l'hébergement à ce dépôt**,
puis de me donner un **accès en écriture**.

Cette page va vivre : tarifs de rentrée à faire évoluer, témoignage à compléter,
textes à ajuster selon les résultats des campagnes. Ces modifications doivent
pouvoir se faire directement, sans repasser par un envoi de fichiers à chaque
fois.

Si la page est modifiée directement sur le serveur sans passer par git, la
version en ligne et le dépôt divergent, et la mise à jour suivante écrase ces
changements. Deux options propres :

1. déployer depuis le dépôt git, qui reste la référence ;
2. ou signaler les modifications faites, pour qu'elles soient reportées.
