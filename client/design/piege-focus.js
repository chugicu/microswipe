// Gestion du focus commune au dialogue et à la fiche : le focus reste dedans, entre dedans à l'ouverture et revient à l'élément d'avant.
const SELECTEUR = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Rend la fonction qui rend le focus à l'élément d'avant, s'il est encore dans la page.
export function memoriserLeFocus() {
  const avant = document.activeElement;
  return () => {
    if (avant && avant !== document.body && avant.isConnected && typeof avant.focus === 'function') avant.focus();
  };
}

// Tab et Maj+Tab restent dans le conteneur (qui porte tabindex="-1" et reçoit le focus à l'ouverture).
export function pieger(conteneur, evenement) {
  if (evenement.key !== 'Tab') return;
  const cibles = [...conteneur.querySelectorAll(SELECTEUR)];
  if (cibles.length === 0) {
    evenement.preventDefault();
    conteneur.focus();
    return;
  }
  const premier = cibles[0];
  const dernier = cibles[cibles.length - 1];
  const actif = document.activeElement;
  if (evenement.shiftKey && (actif === premier || actif === conteneur || !conteneur.contains(actif))) {
    evenement.preventDefault();
    dernier.focus();
  } else if (!evenement.shiftKey && (actif === dernier || !conteneur.contains(actif))) {
    evenement.preventDefault();
    premier.focus();
  }
}
