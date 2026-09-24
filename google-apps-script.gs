/**
 * CasaClass — réception des leads de la landing page dans Google Sheets
 * ---------------------------------------------------------------------
 * Installation :
 *   1. Ouvrir le Google Sheet
 *   2. Extensions → Apps Script
 *   3. Effacer le contenu par défaut, coller ce fichier
 *   4. Déployer → Nouveau déploiement → type « Application web »
 *        Exécuter en tant que : Moi
 *        Qui a accès        : Tout le monde
 *   5. Copier l'URL qui se termine par /exec
 *   6. La coller dans LEAD_ENDPOINT, en bas de index.html
 *
 * À chaque modification du script, il faut redéployer (Déployer →
 * Gérer les déploiements → crayon → Version : Nouvelle version).
 */

var SHEET_ID   = '1SQ3xKauTxb3Pv_fN0KWBXOj_s5ZkFK5iDffn67wjdng';
var SHEET_NAME = 'Leads';

/* Ordre des colonnes. Le formulaire Meta doit alimenter les mêmes,
   pour que les deux sources cohabitent dans le même tableau. */
var COLONNES = [
  'Date', 'Source', 'Prénom parent', 'Prénom enfant', 'WhatsApp',
  'Âge enfant', 'Langue', 'Formule consultée',
  'utm_source', 'utm_campaign', 'utm_content', 'fbclid', 'Page',
  'Statut', 'Notes'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);            // évite deux écritures simultanées
  try {
    var d = JSON.parse(e.postData.contents);
    var sh = feuille_();

    sh.appendRow([
      d.date ? new Date(d.date) : new Date(),
      d.source        || 'landing_page',
      d.prenom_parent || '',
      d.prenom_enfant || '',
      // apostrophe : force Sheets à garder le + du format international
      d.whatsapp ? "'" + d.whatsapp : '',
      d.age_enfant    || '',
      d.langue        || '',
      d.cta_source    || '',
      d.utm_source    || '',
      d.utm_campaign  || '',
      d.utm_content   || '',
      d.fbclid        || '',
      d.page          || '',
      'À contacter',                // statut initial, à faire évoluer à la main
      ''
    ]);

    return json_({ ok: true });
  } catch (err) {
    // La ligne est conservée en brut pour ne perdre aucun prospect
    try {
      feuille_('Erreurs').appendRow([new Date(), String(err), e && e.postData ? e.postData.contents : '']);
    } catch (_) {}
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Permet de vérifier depuis un navigateur que le déploiement répond. */
function doGet() {
  return json_({ ok: true, message: 'Endpoint CasaClass actif' });
}

function feuille_(nom) {
  nom = nom || SHEET_NAME;
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(nom);
  if (!sh) {
    sh = ss.insertSheet(nom);
    if (nom === SHEET_NAME) {
      sh.appendRow(COLONNES);
      sh.getRange(1, 1, 1, COLONNES.length).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
  }
  return sh;
}

function json_(o) {
  return ContentService
    .createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

/** À exécuter une fois depuis l'éditeur pour tester sans la landing page. */
function testerEnvoi() {
  doPost({ postData: { contents: JSON.stringify({
    date: new Date().toISOString(),
    source: 'test',
    prenom_parent: 'Amel',
    prenom_enfant: 'Rayan',
    whatsapp: '+33612345678',
    age_enfant: '7-8 ans',
    langue: 'fr',
    cta_source: 'offre-semi',
    utm_source: 'meta',
    utm_campaign: 'rentree_2026'
  }) } });
}
