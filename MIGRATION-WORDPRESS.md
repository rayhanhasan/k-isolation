# Migration k-isolation.fr : Hostinger → LWS (domaine chez IONOS)

Déménagement du site WordPress actuel **tel quel**, et des e-mails, de Hostinger vers LWS, **sans coupure**. Le nom de domaine reste chez IONOS.

## La situation aujourd'hui (relevé du 31/10/2026)

| Élément | Où | Détail |
|---|---|---|
| Nom de domaine `k-isolation.fr` | **IONOS** | Ses serveurs DNS pointent vers Hostinger (`ns1/ns2.dns-parking.com`) |
| Zone DNS (tous les enregistrements) | **Hostinger** | Site : A `46.202.172.2`, AAAA `2a02:4780:27:1890:0:227e:fa92:d`. E-mails : MX `mx1/mx2.hostinger.com`, SPF, DKIM, DMARC |
| Site WordPress | **Hostinger** | WordPress 6.8, Elementor, thème Fuse, LiteSpeed Cache |
| E-mails `@k-isolation.fr` | **Hostinger** | Au moins `contact@k-isolation.fr` |

## Le principe : 2 phases, pour ne jamais risquer site ET e-mails en même temps

- **Phase 1 (le site).** On installe le site chez LWS, on le teste, puis on change une seule adresse (enregistrement A) dans la zone DNS encore chez Hostinger. Le retour arrière prend 5 minutes, et les e-mails ne bougent pas.
- **Phase 2 (les e-mails et le DNS), quelques jours plus tard.** On crée les boîtes chez LWS, on fait pointer le domaine IONOS vers les serveurs DNS de LWS, puis on recopie les anciens messages.
- **Hostinger reste actif 30 jours** après la phase 2, puis on le résilie.

---

## Étape 0 : commander chez LWS

**Formule conseillée : « LWS Perso » (hébergement WordPress).** Elle comprend 3 sites, 5 adresses e-mail pro (2 à 50 Go par boîte), 100 Go, sauvegardes journalières, SSL gratuit et **migration WordPress gratuite**.

| Formule | 1re année | Ensuite | E-mails | Sites |
|---|---|---|---|---|
| **Perso** | 1,49 € HT/mois (1,79 € TTC) | 3,99 €/mois | 5 | 3 |
| Starter | 3,49 € HT/mois (4,19 € TTC) | 5,99 €/mois | 25 | 10 |
| Performance | 6,99 € HT/mois (8,39 € TTC) | 11,99 €/mois | 100 | 50 |

*Tarifs relevés sur lws.fr le 01/11/2026. LWS précise que le prix normal s'applique dès la 2e année : le vérifier au moment de commander.*

- Prendre **Starter** seulement s'il faut plus de 5 boîtes e-mail, ou si tu veux regrouper d'autres sites sur le même hébergement.
- À la commande, choisir **« utiliser un domaine existant »** (ou équivalent) : on ne transfère pas le domaine, il reste chez IONOS. Le domaine offert par LWS n'est pas utile ici.

**Avant de commander, poser ces 3 questions au support LWS (chat ou ticket) :**
1. « Votre migration WordPress gratuite inclut-elle un site Elementor de 100 Mo de médias depuis une sauvegarde Hostinger ? »
2. « Migrez-vous aussi le contenu des boîtes e-mail ? »
3. « Quels serveurs DNS dois-je déclarer chez IONOS, et l'IP de mon hébergement pour un enregistrement A ? »

**Alternative à LWS** si leurs réponses ne conviennent pas : o2switch (« Offre Unique », serveurs en France, migration gratuite, e-mails et sites illimités). Prix d'appel 1,86 € HT/mois payé à l'année ; le tarif de renouvellement est à vérifier sur leur site. La suite du guide s'applique de la même façon.

## Étape 1 : faire l'inventaire chez Hostinger (15 min)

Dans hPanel :
- [ ] **E-mails** : noter **toutes** les adresses existantes (`contact@`, et d'éventuelles autres), leurs **redirections** et réponses automatiques, et la taille de chaque boîte.
- [ ] **Sites web → k-isolation.fr → Sauvegardes** : générer une sauvegarde, puis télécharger **les fichiers** et **la base de données**. Ce sont les deux fichiers à remettre à LWS pour la migration. Le script SSH `export-site-actuel/scripts/1-export-depuis-hostinger.sh` est l'alternative technique.
- [ ] **DNS** : vérifier qu'il n'existe pas d'enregistrement ajouté à la main (TXT de vérification Google, sous-domaine…) en plus de ceux du relevé `export-site-actuel/dns-releve.json`.
- [ ] Autres sites hébergés sur le même compte Hostinger : ils ne sont pas couverts par ce guide et doivent être déménagés ou résiliés séparément.

## Étape 2 : migrer le site chez LWS

**Option recommandée : la migration gratuite LWS.** Ouvrir la demande dans l'espace client LWS, joindre les 2 fichiers de sauvegarde (ou un accès temporaire à l'administration WordPress), et préciser par écrit :
> « Merci de ne PAS modifier le DNS : le domaine est chez IONOS et je ferai la bascule moi-même après vérification. »

**Option autonome :** extension **All-in-One WP Migration** ou **Duplicator**. Exporter depuis le WordPress actuel, installer un WordPress vierge chez LWS, puis importer. Avec le terminal web et WP-CLI de LWS, le script `export-site-actuel/scripts/2-import-sur-nouvel-hebergeur.sh` fait l'import complet.

**Réglages indispensables après la migration, à faire chez LWS :**
1. **LiteSpeed Cache → désactiver.** Cette extension ne fonctionne que sur les serveurs LiteSpeed, ce que LWS n'est pas (leur page cite Nginx, Varnish, Redis). Activer à la place le cache proposé par LWS dans son panneau.
2. **Extensions Hostinger** (outils, assistant) : désactiver puis supprimer.
3. **Polices liées à l'ancien domaine de test Hostinger.** Le fichier `wp-content/uploads/elementor/google-fonts/css/roboto.css` charge ses polices depuis `https://mediumspringgreen-narwhal-464896.hostingersite.com`, qui disparaîtra avec Hostinger. Dans Elementor → Outils → **Remplacer l'URL** : remplacer cette adresse par `https://k-isolation.fr`, puis cliquer sur **Régénérer les fichiers CSS**.
4. **Formulaires (Contact Form 7)** : installer **WP Mail SMTP** et le configurer après la phase 2 avec la boîte `contact@` de LWS. Sans ça, les demandes de devis risquent de finir en spam.
5. **Comptes utilisateurs** : 3 comptes existent (« Inès Ben Labidi », « Rayhan », « jojo jojo »). Supprimer les comptes de test et changer les mots de passe administrateur.
6. **Réglages → Permaliens → Enregistrer** (une fois, sans rien changer).

## Étape 3 : tester le site chez LWS avant de basculer

Récupérer **l'adresse IP de l'hébergement LWS** (espace client ou support). Puis ajouter cette ligne dans le fichier `hosts` de ton ordinateur :
- **Mac** : `sudo nano /etc/hosts`
- **Windows** : Bloc-notes lancé en administrateur → `C:\Windows\System32\drivers\etc\hosts`

```
<IP-LWS>  k-isolation.fr www.k-isolation.fr
```

Ton ordinateur seul voit alors le site chez LWS, le reste du monde voit toujours Hostinger. Vérifier :
- [ ] Accueil, services, une réalisation, un article, contact : identiques au site actuel (la copie `export-site-actuel/miroir/` sert de référence).
- [ ] Polices correctes (réglage n° 3) et images présentes.
- [ ] Connexion à `/wp-admin/` et ouverture d'une page dans Elementor.
- [ ] Un avertissement HTTPS est **normal** à ce stade : le certificat sera créé après la bascule.

Retirer ensuite la ligne du fichier `hosts`.

## Étape 4 : phase 1, basculer le site (10 min, réversible en 5 min)

48 h avant, dans **hPanel → DNS de k-isolation.fr**, passer le TTL des enregistrements `A @`, `AAAA @` et `CNAME www` à **300**.

Le jour J, toujours dans le **DNS Hostinger** :

| Enregistrement | Avant | Après |
|---|---|---|
| `A @` | `46.202.172.2` | **IP LWS** |
| `AAAA @` | `2a02:4780:27:1890:0:227e:fa92:d` | **Supprimer** (sinon une partie des visiteurs reste chez Hostinger), sauf si LWS fournit une IPv6 |
| `CNAME www` | `k-isolation.fr` | inchangé |
| MX, TXT, DKIM, DMARC, autodiscover, autoconfig | — | **Ne pas toucher** |

Ensuite :
- Chez LWS, activer le **certificat SSL gratuit** pour `k-isolation.fr` et `www`, puis forcer le HTTPS.
- Tester depuis un téléphone en 4G : le site doit s'afficher, cadenas compris.
- Envoyer un formulaire de contact : il doit arriver sur `contact@`, encore chez Hostinger à ce stade.

**Retour arrière** : remettre `A @` = `46.202.172.2` et l'AAAA d'origine. Effectif en quelques minutes.

## Étape 5 : phase 2, e-mails et DNS (3 à 7 jours après, un vendredi soir de préférence)

Le principe : au lieu de modifier des enregistrements un par un, on confie toute la zone DNS à LWS en changeant les serveurs DNS chez IONOS. LWS crée automatiquement les bons enregistrements (site, MX, SPF, DKIM).

1. **Chez LWS** : créer les **mêmes adresses e-mail** qu'à l'étape 1 (même orthographe), avec leurs redirections et réponses automatiques.
2. **Chez LWS** : ouvrir la **zone DNS** du domaine et vérifier qu'elle contient l'enregistrement A du site, les MX de LWS, le SPF et le DKIM LWS. Y ajouter les enregistrements personnalisés notés à l'étape 1 (TXT Google par exemple).
3. **Chez IONOS** : Domaines & SSL → `k-isolation.fr` → **Serveurs de noms** → serveurs personnalisés → remplacer `ns1/ns2.dns-parking.com` par les serveurs indiqués par LWS (de la forme `nsX.lwsdns.com`).
4. **Propagation : jusqu'à 24 à 48 h.** Pendant ce temps, une partie des e-mails arrive encore chez Hostinger, et c'est normal : rien n'est perdu, les deux boîtes existent.
5. **Reconfigurer les messageries** (téléphones, Outlook, Mac Mail) avec les serveurs IMAP et SMTP donnés par LWS.
6. **48 h après**, **recopier les anciens messages** de Hostinger vers LWS, selon l'une de ces trois méthodes :
   - **Simple** : ajouter les deux comptes (Hostinger et LWS) dans Thunderbird ou Outlook, puis glisser-déposer les dossiers de l'un vers l'autre. Le webmail Hostinger reste accessible tant que l'abonnement court.
   - **Technique** (copie complète et relançable sans doublons) :
     ```bash
     docker run --rm gilleslamiral/imapsync imapsync \
       --host1 imap.hostinger.com --port1 993 --ssl1 --user1 contact@k-isolation.fr --password1 '<mdp Hostinger>' \
       --host2 <serveur IMAP LWS> --port2 993 --ssl2 --user2 contact@k-isolation.fr --password2 '<mdp LWS>'
     ```
   - **Par LWS**, si leur migration inclut les e-mails (question n° 2 de l'étape 0).
7. **Configurer WP Mail SMTP** (étape 2, réglage n° 4) avec la boîte `contact@` de LWS, puis envoyer un formulaire de test.

**Vérifications de fin de phase 2 :**
- [ ] Un e-mail envoyé depuis Gmail vers `contact@` arrive chez LWS.
- [ ] Un e-mail envoyé depuis `contact@` (LWS) arrive dans une boîte Gmail, et **pas en spam** : SPF et DKIM sont corrects.
- [ ] Le formulaire du site arrive bien.
- [ ] Les anciens messages sont présents chez LWS.

## Étape 6 : après la migration

- [ ] **Google Search Console** : ajouter (ou vérifier) une propriété « Domaine » `k-isolation.fr` validée par un enregistrement TXT, **dans la zone DNS LWS**.
- [ ] **Site Kit** : reconnecter le compte Google si l'extension le demande.
- [ ] **IONOS** : vérifier la date d'échéance et le renouvellement automatique du domaine.
- [ ] **J+30, si tout fonctionne** : chez Hostinger, désactiver le renouvellement automatique et résilier l'hébergement et l'offre e-mail. Télécharger une dernière sauvegarde avant de résilier.

## En cas de problème

| Symptôme | Cause probable | Solution |
|---|---|---|
| Site sans mise en forme ou polices de remplacement | Polices de l'ancien domaine Hostinger, ou cache Elementor | Étape 2, réglage n° 3, puis vider le cache LWS |
| Erreur 500 après la migration | Extension LiteSpeed Cache encore active | Renommer le dossier `wp-content/plugins/litespeed-cache` par FTP |
| Les formulaires n'arrivent pas | Envoi PHP bloqué ou classé en spam | WP Mail SMTP avec `contact@` (étape 5, point 7) |
| E-mails reçus nulle part pendant la phase 2 | Boîte pas encore créée chez LWS | La créer : les serveurs réessaient pendant plusieurs jours, les messages arriveront |
| Site encore sur l'ancienne version chez certains | Propagation DNS ou AAAA oublié | Attendre jusqu'à 24 h ; vérifier que l'AAAA Hostinger est supprimé |

Sources : [tarifs et formules LWS](https://www.lws.fr/hebergement_wordpress.php), [o2switch](https://www.o2switch.fr/).
