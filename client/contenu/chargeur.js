// Chargeur de contenu : relit le paquet rangé dans IndexedDB, demande à la source s'il y en a un plus récent, le range et prévient les autres modules.
import {
  MAGASIN_CONTENU,
  TYPES_RANGES,
  creerEnregistrement,
  deciderApresReponse,
  gelerEnProfondeur,
  lireEnregistrement,
} from './regles.js';

// Jamais une valeur du paquet dans un message : seulement le code de l'erreur.
function journaliser(contexte, erreur) {
  const code = erreur && typeof erreur.code === 'string' ? erreur.code : 'inconnue';
  console.error(`contenu : ${contexte} (${code})`);
}

export function creerChargeurDeContenu({ obtenirBase, source, maintenant }) {
  const evenements = new EventTarget();
  const etats = new Map(TYPES_RANGES.map((type) => [type, { paquet: null, range: false, dernierResultat: null }]));
  const chargementsEnCours = new Map();
  let base = null;
  let perimee = false;

  function emettreChangement(type, paquet) {
    evenements.dispatchEvent(new CustomEvent('contenu-change', { detail: { type, versionContenu: paquet.versionContenu } }));
  }

  function surBasePerimee() {
    if (perimee) return;
    perimee = true;
    base = null; // la base est déjà fermée : plus aucune écriture n'est tentée
    for (const etat of etats.values()) etat.range = false;
    evenements.dispatchEvent(new Event('base-perimee'));
  }

  const pret = (async () => {
    try {
      base = await obtenirBase();
    } catch (ignoree) {
      base = null; // pas de stockage pour toute la durée de vie du chargeur
      return;
    }
    if (base && base.evenements && typeof base.evenements.addEventListener === 'function') {
      base.evenements.addEventListener('base-perimee', surBasePerimee);
    }
    for (const type of TYPES_RANGES) {
      try {
        const enregistrement = lireEnregistrement(await base.lire(MAGASIN_CONTENU, type), type);
        if (enregistrement) {
          const etat = etats.get(type);
          etat.paquet = gelerEnProfondeur(enregistrement.paquet);
          etat.range = base !== null;
          emettreChangement(type, etat.paquet);
        }
      } catch (erreur) {
        journaliser('lecture du paquet rangé impossible', erreur);
      }
    }
  })().catch((erreur) => journaliser('démarrage', erreur));

  function lirePaquet(type = 'internes') {
    const etat = etats.get(type);
    return etat ? etat.paquet : null;
  }

  function versionContenuLocale(type = 'internes') {
    const paquet = lirePaquet(type);
    return paquet ? paquet.versionContenu : null;
  }

  function etat(type = 'internes') {
    const e = etats.get(type);
    return {
      present: Boolean(e && e.paquet),
      versionContenu: versionContenuLocale(type),
      range: Boolean(e && e.range),
      dernierResultat: e ? e.dernierResultat : null,
    };
  }

  async function ecrireAvecUnSecondEssai(enregistrement) {
    for (let essai = 1; essai <= 2; essai += 1) {
      const baseCourante = base;
      if (!baseCourante) return false; // base devenue périmée entre-temps : on ne tente rien
      try {
        await baseCourante.ecrire(MAGASIN_CONTENU, enregistrement);
        return true;
      } catch (erreur) {
        if (essai === 2) journaliser('écriture du paquet impossible', erreur);
      }
    }
    return false;
  }

  async function chargerUneFois(type) {
    await pret;
    let resultat;
    let reponse;
    try {
      reponse = await source(type, versionContenuLocale(type));
    } catch (ignoree) {
      resultat = { resultat: 'garde', motif: 'source_indisponible' };
    }
    if (!resultat) {
      const decision = deciderApresReponse(reponse, type);
      if (decision.action === 'garder') {
        resultat = { resultat: decision.motif === 'a_jour' ? 'a_jour' : 'garde', motif: decision.motif };
        if (decision.motif === 'refus') resultat.erreur = decision.erreur;
      } else {
        const paquet = gelerEnProfondeur(reponse.paquet);
        const enregistrement = creerEnregistrement(paquet, maintenant());
        const ecrit = base ? await ecrireAvecUnSecondEssai(enregistrement) : false;
        const e = etats.get(type);
        e.paquet = paquet;
        e.range = ecrit && !perimee;
        emettreChangement(type, paquet);
        resultat = { resultat: 'remplace', motif: 'nouvelle_version' };
      }
    }
    etats.get(type).dernierResultat = resultat;
    return resultat;
  }

  function charger(type = 'internes') {
    if (!TYPES_RANGES.includes(type)) return Promise.reject(Object.assign(new Error('type_non_range'), { code: 'type_non_range' }));
    if (chargementsEnCours.has(type)) return chargementsEnCours.get(type);
    const promesse = chargerUneFois(type).finally(() => chargementsEnCours.delete(type));
    chargementsEnCours.set(type, promesse);
    return promesse;
  }

  return { pret, lirePaquet, versionContenuLocale, etat, charger, basePerimee: () => perimee, evenements };
}
