#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# IMPORT DU WORDPRESS k-isolation.fr SUR LE NOUVEL HÉBERGEUR (accès SSH requis)
#
# Prérequis sur le nouvel hébergeur :
#   - le domaine k-isolation.fr ajouté (sans encore toucher au DNS) ;
#   - une base MySQL/MariaDB VIDE créée, avec son utilisateur ;
#   - WP-CLI disponible (c'est le cas chez la plupart des hébergeurs WordPress).
#
# Usage :
#   bash 2-import-sur-nouvel-hebergeur.sh export-k-isolation-AAAAMMJJ-HHMM.tar /chemin/vers/le/dossier/web
#   (le script demande ensuite le nom, l'utilisateur, le mot de passe et l'hôte de la nouvelle base)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ARCHIVE="${1:?Indiquez le chemin du fichier export-k-isolation-*.tar}"
WEBROOT="${2:?Indiquez le dossier web du domaine sur le nouvel hebergeur, ex. ~/www}"
command -v wp >/dev/null || { echo "WP-CLI introuvable : demandez-le à l'hébergeur ou utilisez la méthode par extension (MIGRATION-WORDPRESS.md, méthode A)."; exit 1; }

if [ -n "$(ls -A "$WEBROOT" 2>/dev/null | grep -v -E '^(\.well-known|cgi-bin|index\.html|default\.php)$' || true)" ]; then
  echo "⚠️  $WEBROOT n'est pas vide. Videz-le (ou choisissez un autre dossier) avant l'import."; exit 1
fi

WORK="$(mktemp -d)"
tar -xf "$ARCHIVE" -C "$WORK"
SRC="$(find "$WORK" -maxdepth 1 -type d -name 'export-*' | head -1)"
( cd "$SRC" && sha256sum -c SHA256SUMS ) || { echo "❌ Archive corrompue (empreintes différentes)"; exit 1; }

echo "▶ 1/5 Fichiers"
tar -xzf "$SRC/fichiers-site.tar.gz" -C "$WEBROOT"

echo "▶ 2/5 Connexion à la nouvelle base"
read -rp "Nom de la base : " DB_NAME
read -rp "Utilisateur : " DB_USER
read -rsp "Mot de passe : " DB_PASS; echo
read -rp "Hôte [localhost] : " DB_HOST; DB_HOST="${DB_HOST:-localhost}"
cd "$WEBROOT"
wp config set DB_NAME "$DB_NAME" --quiet
wp config set DB_USER "$DB_USER" --quiet
wp config set DB_PASSWORD "$DB_PASS" --quiet
wp config set DB_HOST "$DB_HOST" --quiet
wp config shuffle-salts --quiet   # déconnecte toutes les sessions existantes (sécurité)

echo "▶ 3/5 Base de données"
gunzip -c "$SRC/base-de-donnees.sql.gz" | wp db import -

echo "▶ 4/5 Adaptation à l'hébergeur"
# LiteSpeed Cache ne fonctionne que sur un serveur LiteSpeed (Hostinger, o2switch…).
read -rp "Le nouvel hébergeur utilise-t-il un serveur LiteSpeed ? (o/N) " LS
if [[ ! "$LS" =~ ^[oOyY] ]]; then
  wp plugin deactivate litespeed-cache --quiet 2>/dev/null && echo "   LiteSpeed Cache désactivé (installez le cache conseillé par l'hébergeur)" || true
fi
# Extensions propres à Hostinger : inutiles ailleurs.
wp plugin list --status=active --field=name | grep -i hostinger | xargs -r wp plugin deactivate --quiet || true
wp rewrite flush --hard --quiet || true
wp cache flush --quiet || true
wp elementor flush-css --quiet 2>/dev/null || true

echo "▶ 5/5 Contrôles"
wp core verify-checksums || echo "   (vérifiez les fichiers signalés ci-dessus)"
echo "   siteurl = $(wp option get siteurl) | home = $(wp option get home)"
echo "   Extensions actives : $(wp plugin list --status=active --field=name | tr '\n' ' ')"
rm -rf "$WORK"

echo
echo "✅ Import terminé. AVANT de changer le DNS, testez le site sur le nouveau serveur"
echo "   (fichier hosts ou URL temporaire de l'hébergeur) : voir MIGRATION-WORDPRESS.md, étape 4."
