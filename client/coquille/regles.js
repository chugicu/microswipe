// Fonctions pures de l'écran d'accueil et de l'invitation à installer, sans accès à la page ni au réseau.

export const DUREE_ACCUEIL_MS = 1000;
export const CLE_LOGO_A_L_OUVERTURE = 'accueil.logo';

// Seul « non » exact (espaces autour ignorés) coupe le logo ; tout le reste le laisse allumé.
export function logoActive(reglages) {
  if (reglages === null || typeof reglages !== 'object') return true;
  const valeur = reglages[CLE_LOGO_A_L_OUVERTURE];
  return !(typeof valeur === 'string' && valeur.trim() === 'non');
}

export function doitMasquerLAccueil({ ecouleMs, appliPrete, toucher, logo }) {
  if (!appliPrete) return false;
  return !logo || Boolean(toucher) || ecouleMs >= DUREE_ACCUEIL_MS;
}

export const PARTIES_D_INVITATION = Object.freeze([1, 10]);

export function estInstallee({ affichageAutonome, standaloneIos }) {
  return affichageAutonome === true || standaloneIos === true;
}

// Un iPad récent se présente comme un Mac : seul son écran tactile (plusieurs points de contact) le distingue.
export function moyenDInstallation({ agentUtilisateur, pointsDeContact, invitationNative }) {
  if (invitationNative) return 'bouton';
  const agent = typeof agentUtilisateur === 'string' ? agentUtilisateur : '';
  if (/iPhone|iPod|iPad/.test(agent)) return 'consignes';
  if (/Macintosh/.test(agent) && pointsDeContact > 1) return 'consignes';
  return 'aucun';
}

export function doitInviterApresPartie(nombreDePartiesTerminees, installee) {
  return !installee && PARTIES_D_INVITATION.includes(nombreDePartiesTerminees);
}

export const TEXTES_INSTALLATION = Object.freeze({
  titre: 'Installe MicroSwipe',
  texte: "Elle s'ouvrira comme une appli, même hors ligne, et gardera mieux tes réponses.",
  consignesIphone: "Touche Partager, puis « Sur l'écran d'accueil ».",
  boutonInstaller: 'Installer',
  boutonPlusTard: 'Plus tard',
  ligneProfil: "Installer l'appli sur l'écran d'accueil",
});
