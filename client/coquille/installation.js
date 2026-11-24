// Détection de l'installation et invitation native du navigateur ; l'affichage de l'invitation appartient aux lots 106, 207 et 208.
import { estInstallee, moyenDInstallation } from './regles.js';

export const evenements = new EventTarget();

let invitationGardee = null;
let installeeParEvenement = false;

function signaler() {
  evenements.dispatchEvent(new Event('installation-changee'));
}

export function demarrerInstallation() {
  window.addEventListener('beforeinstallprompt', (evenement) => {
    evenement.preventDefault();
    invitationGardee = evenement;
    signaler();
  });
  window.addEventListener('appinstalled', () => {
    installeeParEvenement = true;
    invitationGardee = null;
    signaler();
  });
}

export function etatDeLInstallation() {
  const installee =
    installeeParEvenement ||
    estInstallee({
      affichageAutonome: window.matchMedia('(display-mode: standalone)').matches,
      standaloneIos: navigator.standalone === true,
    });
  const moyen = moyenDInstallation({
    agentUtilisateur: navigator.userAgent,
    pointsDeContact: navigator.maxTouchPoints,
    invitationNative: invitationGardee !== null,
  });
  return { installee, moyen };
}

// Une invitation ne sert qu'une fois, acceptée ou non.
export async function lancerInstallationNative() {
  if (invitationGardee === null) return 'indisponible';
  const invitation = invitationGardee;
  invitationGardee = null;
  signaler();
  try {
    await invitation.prompt();
    const choix = await invitation.userChoice;
    return choix.outcome === 'accepted' ? 'acceptee' : 'refusee';
  } catch (erreur) {
    return 'indisponible';
  }
}
