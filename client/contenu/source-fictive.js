// Provisoire, phases 1 et 2 : pas de serveur. Le lot 307 remplace cette source par l'action contenu du serveur, qui répond sous la même forme. Ce fichier est alors supprimé.
import { paquetInternesFictif } from '../donnees-fictives/paquets-fictifs.js';

export function sourceFictive(type, versionLocale) {
  if (type === 'internes') {
    const paquet = paquetInternesFictif();
    if (versionLocale === paquet.versionContenu) {
      return Promise.resolve({ ok: true, aJour: true, versionContenu: paquet.versionContenu });
    }
    return Promise.resolve({ ok: true, aJour: false, versionContenu: paquet.versionContenu, paquet });
  }
  return Promise.resolve({ ok: false, erreur: 'paquet_indisponible' });
}
