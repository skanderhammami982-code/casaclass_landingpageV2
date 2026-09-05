# CasaClass — Landing page

Landing page de conversion pour CasaClass : séances en ligne d'enseignement du Coran
et d'histoires du Coran pour les enfants des familles tunisiennes en Europe.

Page autonome : un seul fichier `index.html` (HTML + CSS + JS inline).
Aucune dépendance, aucun build. Seule ressource externe : Google Fonts.

## Déploiement

Ouvrir `index.html` dans un navigateur, ou déposer le fichier sur n'importe quel
hébergement statique (Netlify, Vercel, GitHub Pages, hébergeur classique).

> GitHub Pages sur un dépôt privé nécessite un plan GitHub Pro/Team.
> Sur un dépôt public, activer Pages depuis *Settings → Pages → Branch: main / root*.

## ⚠️ À renseigner avant de lancer du trafic payant

Les emplacements sont marqués `data-placeholder` dans le code, avec un récapitulatif
en commentaire en haut du fichier. **Les valeurs actuelles sont des exemples de mise
en page, pas des données réelles.** Les diffuser telles quelles en publicité serait
de la publicité mensongère.

| Marqueur | À remplacer par |
|---|---|
| `data-placeholder="video"` | Le témoignage filmé d'une cliente (section « Témoignage ») |
| `data-placeholder="price"` | Tarif mensuel réel et contenu de l'offre |
| `WHATSAPP_NUMBER` | Numéro WhatsApp au format international (3 occurrences de `21600000000`) |
| `sendLead()` | Webhook CRM / Make / Zapier, et décommenter l'appel `fbq` du pixel Meta |

## Bilingue français / arabe

La page bascule entre les deux langues sans rechargement, via le sélecteur
`FR / العربية` de l'en-tête. Le passage en arabe met la page en `dir="rtl"`,
`lang="ar"`, et charge les polices arabes (Tajawal + Amiri) — elles ne sont
téléchargées qu'au premier passage en arabe, la version française ne les paie pas.

**Le français est le contenu par défaut du HTML.** Si le script ne s'exécute pas,
la page reste entièrement lisible en français. L'arabe vit uniquement dans l'objet
`AR` du script : c'est le seul endroit à modifier pour retoucher la traduction.

Le balisage porte quatre types de marqueurs :

| Attribut | Effet |
|---|---|
| `data-i18n="clé"` | remplace le contenu HTML de l'élément |
| `data-i18n-txt="clé"` | remplace le texte en laissant l'icône SVG en place |
| `data-i18n-ph="clé"` | remplace le `placeholder` d'un champ |
| `data-i18n-aria="clé"` | remplace l'`aria-label` |

Langue au chargement : le paramètre `?lang=ar` dans l'URL est prioritaire — utile
pour router une campagne arabophone directement vers la version arabe — sinon le
dernier choix du visiteur, mémorisé en `localStorage`. La langue active est
transmise dans le lead (`langue`) et un évènement `Lang_Switch` est envoyé à chaque
bascule.

Traduction en arabe standard moderne. Pour passer au dialecte tunisien, il suffit
de réécrire les valeurs de l'objet `AR`, sans toucher au balisage.

## Vidéos

La vidéo du hero est en place : `assets/extrait-seance.mp4` (720×1280, 38 s, 4,4 Mo).
Elle est chargée en `preload="metadata"` — seul l'en-tête part au chargement de la
page, le fichier complet ne se télécharge qu'au clic. Le fragment `#t=0.5` fait
afficher l'image à 0,5 s en guise de vignette, sans fichier poster séparé.

La section « Témoignage » attend une seconde vidéo — le témoignage filmé d'une
cliente. L'emplacement est volontairement vide. Pour le brancher : déposez le
fichier dans `assets/`, remplacez le `<svg class="vid-bg">` du bloc par une balise
`<video>` sur le même modèle que le hero, retirez `data-placeholder="video"` et
décommentez le bloc `.vmeta` sous la vidéo pour y mettre le prénom et la ville.
Le script détecte automatiquement la présence d'une balise `video` et bascule du
message d'emplacement vers la lecture.

## Structure de la page

1. Hero — promesse + vidéo d'une séance réelle
2. « Est-ce pour vous ? » — 4 cartes d'auto-identification
3. Témoignage — une vidéo cliente (emplacement vide)
4. Comment ça marche — 3 étapes
5. Offre, garantie et comparatif
6. FAQ — 8 objections
7. CTA final + formulaire de capture en 2 étapes

Ont été retirés faute de données réelles disponibles : le bandeau de chiffres clés,
la section « Les professeurs », la note en étoiles du hero, la timeline minute par
minute, la section « Aperçu de la séance » et les trois avis écrits. Ils pourront
être réintroduits quand les éléments réels existeront.

## Conversion

- CTA répétés (header, hero, offre, barre sticky mobile, formulaire final)
- Formulaire en 2 étapes : âge de l'enfant d'abord (aucune donnée personnelle),
  puis 3 champs seulement — prénom du parent, prénom de l'enfant, WhatsApp
- Formulaire en exemplaire unique dans le DOM : déplacé dans la modale au clic,
  remis en place à la fermeture — la progression du visiteur est conservée
- Tracking prêt : UTM, `fbclid`, source du CTA cliqué, événements
  `Form_Open` / `Form_Step1` / `Lead` / `Video_Play`
- Accessibilité : `aria-expanded` sur la FAQ, modale `aria-modal` avec piège de focus
  et fermeture ESC, cibles tactiles ≥ 52 px, `prefers-reduced-motion` respecté
