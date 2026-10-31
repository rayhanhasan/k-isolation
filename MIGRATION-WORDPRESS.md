# Migration du site WordPress k-isolation.fr vers un nouvel hébergeur

Ce guide déplace **le site actuel tel quel** (WordPress + Elementor + thème Fuse) de Hostinger vers un autre hébergeur, **sans coupure du site ni des e-mails**. Il ne concerne pas la refonte, qui est en pause.

> **Les 3 règles qui évitent 99 % des problèmes**
> 1. **Les e-mails `@k-isolation.fr` sont chez Hostinger.** On ne touche ni aux MX, ni à SPF, DKIM et DMARC, ni aux serveurs de noms tant que la question des e-mails n'est pas réglée (§2).
> 2. **On teste le site sur le nouveau serveur AVANT de changer le DNS** (§5).
> 3. **On garde Hostinger actif 30 jours après la bascule** : le retour arrière se fait en 5 minutes (§8).

---

## 0. Ce qui est déjà exporté dans ce dépôt

Le dossier `export-site-actuel/` contient tout ce qui est accessible publiquement, détaillé dans son `LISEZMOI.md` :

| Élément | Contenu | Restaurable tel quel ? |
|---|---|---|
| `miroir/` | Copie complète consultable hors ligne (HTML, CSS, JS, images, polices) | Non : c'est une archive de consultation et de secours |
| `medias/uploads/` | Les 138 fichiers originaux de la médiathèque (105 Mo, vidéos comprises), dans l'arborescence WordPress `AAAA/MM/` | Oui : ils peuvent être recopiés dans `wp-content/uploads/` |
| `donnees-wordpress/` | Toutes les données publiques en JSON : 25 pages, 4 articles, réalisations, services, témoignages, gabarits, catégories, étiquettes, médias, comptes | Partiellement : contenu et textes, mais pas les mises en page Elementor |
| `dns-releve.json` | Relevé exact du DNS au 31/10/2026 | Oui : référence pour la bascule |
| `../audit/source/` | Texte et métadonnées de chacune des 57 pages | — |

**Ce qui ne peut PAS être exporté depuis l'extérieur** : la base de données (mises en page Elementor, menus, réglages des extensions, formulaires, comptes), les extensions et le thème. Seul un accès au serveur le permet (§3). C'est la seule étape qui demande une action de ta part ou du client.

---

## 1. Choisir le nouvel hébergeur

Critères pour ce site :

| Critère | Pourquoi |
|---|---|
| PHP 8.2 ou plus, MySQL/MariaDB | Exigences d'Elementor et de WordPress 6.8 |
| **Accès SSH + WP-CLI** | Permet la migration en une commande (§3, méthode C) et les sauvegardes propres |
| Sauvegardes quotidiennes incluses, restaurables en un clic | Filet de sécurité |
| Serveurs en France ou dans l'UE | RGPD, proximité des visiteurs |
| Serveur **LiteSpeed** (ou non) | Si oui, l'extension LiteSpeed Cache actuelle continue de fonctionner ; sinon, il faut la remplacer par le cache de l'hébergeur |
| **Migration gratuite** proposée par l'hébergeur | Beaucoup d'hébergeurs WordPress la font eux-mêmes à partir d'une sauvegarde ou d'un accès : c'est l'option la plus simple |
| E-mail inclus ou non | Voir §2 |

Dis-moi lequel tu retiens : j'adapterai les étapes 4 à 6 à son interface exacte.

## 2. Décider du sort des e-mails (AVANT tout le reste)

Aujourd'hui (relevé DNS du 31/10/2026) :

| Enregistrement | Valeur | Rôle |
|---|---|---|
| MX | `mx1.hostinger.com` (5), `mx2.hostinger.com` (10) | Réception des e-mails |
| TXT (SPF) | `v=spf1 include:_spf.mail.hostinger.com ~all` | Autorise Hostinger à envoyer |
| CNAME DKIM | `hostingermail-a/b/c._domainkey` → `*.dkim.mail.hostinger.com` | Signature des e-mails |
| TXT `_dmarc` | `v=DMARC1; p=none` | Politique anti-usurpation |
| CNAME | `autodiscover` / `autoconfig` → `*.mail.hostinger.com` | Configuration automatique des logiciels de messagerie |
| NS | `ns1/ns2.dns-parking.com` | Le DNS est géré chez Hostinger |

Trois options :
- **A. Garder les e-mails chez Hostinger (le plus simple).** Dans hPanel, vérifier si la boîte `contact@` dépend de l'offre d'hébergement web. Si oui, souscrire une offre **e-mail seule** avant de résilier l'hébergement. On ne touche à aucun enregistrement e-mail.
- **B. Les déplacer chez le nouvel hébergeur.** Créer les boîtes chez lui, copier les messages (outil de migration IMAP de l'hébergeur), puis remplacer MX, SPF et DKIM **le même jour**, en dehors des heures de travail.
- **C. Google Workspace ou Microsoft 365.** Même principe que B, avec leurs assistants de migration.

**Le nom de domaine** est aussi géré chez Hostinger : vérifier sa date d'échéance et le renouvellement automatique. Le garder chez Hostinger ne pose aucun problème.

## 3. Exporter le site depuis Hostinger (3 méthodes, une seule suffit)

**Méthode A : sauvegarde hPanel (5 minutes, sans technique)**
hPanel → Sites web → k-isolation.fr → **Sauvegardes**. Générer une nouvelle sauvegarde, puis télécharger séparément **les fichiers** et **la base de données**. Ces deux fichiers suffisent pour l'hébergeur qui fait la migration.

**Méthode B : extension de migration (depuis l'administration WordPress)**
Installer **All-in-One WP Migration** ou **Duplicator** → Exporter vers un fichier → télécharger. Sur le nouvel hébergeur : installer un WordPress vierge, la même extension, puis Importer. Attention : la version gratuite d'All-in-One limite la taille d'import selon l'hébergeur ; le site complet pèse un peu plus de 100 Mo de médias.

**Méthode C : script SSH fourni (complet et vérifiable)**
```bash
ssh -p 65002 <utilisateur>@46.202.172.2
```
Puis copier `export-site-actuel/scripts/1-export-depuis-hostinger.sh` sur le serveur et le lancer :
```bash
bash 1-export-depuis-hostinger.sh
```
Le script :
- ne lit **que** le dossier `domains/k-isolation.fr` et ne modifie rien ;
- produit une archive unique (base de données + fichiers, sans les caches, avec empreintes de contrôle) **hors** de `public_html` ;
- liste les extensions, thèmes et versions.

Il a été testé sur une installation simulée. Pense à supprimer l'archive du serveur une fois téléchargée.

⚠️ L'export contient la base de données, donc les comptes et les messages reçus par les formulaires : ne pas le partager ni le déposer sur GitHub.

## 4. Installer le site sur le nouvel hébergeur

- **Si l'hébergeur fait la migration** : lui transmettre l'export (méthode A ou C) et lui préciser de **ne pas changer le DNS**.
- **Avec l'extension (méthode B)** : importer le fichier sur un WordPress neuf.
- **Avec SSH (méthode C)** : créer une base vide, puis lancer :
  ```bash
  bash 2-import-sur-nouvel-hebergeur.sh export-k-isolation-AAAAMMJJ-HHMM.tar ~/dossier-web
  ```
  Le script vérifie l'archive, restaure fichiers et base, branche la nouvelle base, régénère les clés de sécurité, désactive ce qui est propre à Hostinger et contrôle l'intégrité de WordPress.

**Réglages à faire après l'import, quelle que soit la méthode :**
1. **LiteSpeed Cache** : à garder seulement si le nouveau serveur est LiteSpeed. Sinon, désactiver l'extension et activer le cache recommandé par l'hébergeur.
2. **Extensions Hostinger** (outils, assistant) : à désactiver.
3. **Polices hébergées sur l'ancien domaine de test Hostinger.** Le fichier `wp-content/uploads/elementor/google-fonts/css/roboto.css` charge ses polices depuis `https://mediumspringgreen-narwhal-464896.hostingersite.com/…`. Ce domaine disparaîtra avec l'hébergement. Correction : Elementor → Outils → **Remplacer l'URL**, de `https://mediumspringgreen-narwhal-464896.hostingersite.com` vers `https://k-isolation.fr`, puis **Régénérer les fichiers CSS**. Avec WP-CLI :
   ```bash
   wp search-replace 'https://mediumspringgreen-narwhal-464896.hostingersite.com' 'https://k-isolation.fr' --all-tables --dry-run
   ```
   Relancer ensuite la même commande sans `--dry-run`.
4. **Envoi des e-mails du site** (formulaires Contact Form 7) : configurer une extension SMTP (WP Mail SMTP par exemple) avec la boîte `contact@k-isolation.fr`, sinon les demandes de devis risquent de partir en spam ou de ne jamais arriver.
5. **Comptes administrateurs** : 3 comptes publics existent (« Inès Ben Labidi », « Rayhan », « jojo jojo »). Supprimer les comptes de test et changer les mots de passe.
6. **Réglages → Permaliens** : cliquer « Enregistrer » une fois (régénère les règles d'URL).

## 5. Tester avant de changer le DNS

Faire « croire » à ton ordinateur que k-isolation.fr est déjà sur le nouveau serveur, sans rien changer pour le reste du monde :
- **Mac** : `sudo nano /etc/hosts`.
- **Windows** : Bloc-notes en administrateur → `C:\Windows\System32\drivers\etc\hosts`.

Ajouter la ligne suivante (IP fournie par le nouvel hébergeur), enregistrer, puis vider le cache du navigateur :
```
<IP-du-nouveau-serveur>  k-isolation.fr www.k-isolation.fr
```

Checklist de recette :
- [ ] Accueil, une page service, une réalisation, un article, la page contact : affichage identique, images présentes.
- [ ] Polices correctes : pas de police de remplacement, cf. réglage n° 3.
- [ ] **Formulaire de contact envoyé et reçu** sur `contact@`.
- [ ] Connexion à `/wp-admin/`, ouverture d'une page dans l'éditeur Elementor.
- [ ] `/sitemap_index.xml` accessible.
- [ ] Certificat HTTPS : souvent généré seulement après la bascule DNS. Un avertissement pendant ce test est normal.

Retirer la ligne du fichier `hosts` après le test.

## 6. Bascule DNS (jour J, 15 minutes)

48 h avant : dans hPanel → DNS, passer le TTL de `A @`, `AAAA @` et `CNAME www` à **300 secondes**, pour que la bascule et un éventuel retour arrière soient quasi immédiats.

Le jour J, dans hPanel → Domaines → k-isolation.fr → **DNS**, modifier **uniquement** :

| Enregistrement | Avant | Après |
|---|---|---|
| `A @` | `46.202.172.2` | IP du nouvel hébergeur |
| `AAAA @` | `2a02:4780:27:1890:0:227e:fa92:d` | IPv6 du nouvel hébergeur, **ou suppression** s'il n'en fournit pas. Sinon une partie des visiteurs continuerait d'arriver chez Hostinger |
| `CNAME www` | `k-isolation.fr` | inchangé (sauf consigne contraire de l'hébergeur) |

**Ne pas toucher** : MX, TXT SPF, CNAME `hostingermail-*._domainkey`, TXT `_dmarc`, `autodiscover`, `autoconfig`, NS.

Puis, chez le nouvel hébergeur : activer le certificat HTTPS (Let's Encrypt) et forcer la redirection `http` → `https`.

## 7. Après la bascule

- [ ] Visiter le site depuis un téléphone en 4G : on doit être sur le nouveau serveur.
- [ ] Envoyer et recevoir un e-mail sur `contact@` (doit fonctionner exactement comme avant).
- [ ] Envoyer un formulaire de contact depuis le site.
- [ ] **Google Search Console** : vérifier que la propriété est toujours validée. La validation actuelle passe probablement par Site Kit : en profiter pour ajouter une propriété « Domaine » vérifiée par un enregistrement TXT DNS.
- [ ] **Site Kit** : reconnecter le compte Google si l'extension le demande.
- [ ] Pendant 7 jours : surveiller Search Console (pages en erreur) et les formulaires.

## 8. Retour arrière (si quelque chose ne va pas)

Remettre `A @` = `46.202.172.2` et `AAAA @` = `2a02:4780:27:1890:0:227e:fa92:d` dans le DNS Hostinger. Avec un TTL de 300 s, le site revient chez Hostinger en quelques minutes. C'est pour cela que **l'hébergement Hostinger reste actif 30 jours** après la bascule. Une fois ce délai passé, et les e-mails réglés (§2), il peut être résilié.
