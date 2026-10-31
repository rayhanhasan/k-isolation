#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# EXPORT COMPLET DU WORDPRESS k-isolation.fr DEPUIS HOSTINGER
#
# À lancer en SSH sur Hostinger :
#   ssh -p 65002 <utilisateur>@46.202.172.2
#   bash 1-export-depuis-hostinger.sh
#
# Périmètre : UNIQUEMENT le dossier du domaine k-isolation.fr. Le script ne lit
# ni ne modifie aucun autre site du compte.
# Lecture seule sur le site : rien n'est modifié, rien n'est supprimé.
# L'export est écrit HORS de public_html (jamais accessible depuis le web).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

DOMAIN_DIR="$HOME/domains/k-isolation.fr"
SITE_DIR="$DOMAIN_DIR/public_html"
STAMP="$(date +%Y%m%d-%H%M)"
OUT="$DOMAIN_DIR/export-$STAMP"

[ -f "$SITE_DIR/wp-config.php" ] || { echo "wp-config.php introuvable dans $SITE_DIR"; exit 1; }
mkdir -p "$OUT"
chmod 700 "$OUT"
cd "$SITE_DIR"

echo "▶ 1/5 Informations sur l'installation"
{
  echo "Date de l'export : $(date -Iseconds)"
  echo "PHP : $(php -r 'echo PHP_VERSION;')"
  if command -v wp >/dev/null 2>&1; then
    echo "WordPress : $(wp core version --path="$SITE_DIR" 2>/dev/null)"
    echo "siteurl : $(wp option get siteurl --path="$SITE_DIR" 2>/dev/null)"
    echo "home : $(wp option get home --path="$SITE_DIR" 2>/dev/null)"
    echo "Préfixe des tables : $(wp config get table_prefix --path="$SITE_DIR" 2>/dev/null)"
  fi
} | tee "$OUT/infos.txt"
if command -v wp >/dev/null 2>&1; then
  wp plugin list --path="$SITE_DIR" --format=csv > "$OUT/extensions.csv" 2>/dev/null || true
  wp theme list --path="$SITE_DIR" --format=csv > "$OUT/themes.csv" 2>/dev/null || true
fi

echo "▶ 2/5 Base de données"
if command -v wp >/dev/null 2>&1; then
  wp db export "$OUT/base-de-donnees.sql" --path="$SITE_DIR" --add-drop-table --default-character-set=utf8mb4
else
  # Repli : lecture des identifiants dans wp-config.php (sans charger WordPress)
  cfg() { grep -oP "define\(\s*['\"]$1['\"]\s*,\s*['\"]\K[^'\"]*" "$SITE_DIR/wp-config.php" | head -1; }
  DB_NAME="$(cfg DB_NAME)"; DB_USER="$(cfg DB_USER)"; DB_PASS="$(cfg DB_PASSWORD)"; DB_HOST="$(cfg DB_HOST)"
  MYSQL_PWD="$DB_PASS" mysqldump --single-transaction --quick --default-character-set=utf8mb4 \
    -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" > "$OUT/base-de-donnees.sql"
fi
gzip -9 "$OUT/base-de-donnees.sql"

echo "▶ 3/5 Fichiers du site (hors caches régénérables)"
tar -czf "$OUT/fichiers-site.tar.gz" -C "$SITE_DIR" \
  --exclude='./wp-content/cache' \
  --exclude='./wp-content/litespeed' \
  --exclude='./wp-content/upgrade' \
  --exclude='./wp-content/ai1wm-backups' \
  --exclude='./wp-content/updraft' \
  .

echo "▶ 4/5 Empreintes de contrôle"
( cd "$OUT" && sha256sum base-de-donnees.sql.gz fichiers-site.tar.gz > SHA256SUMS )

echo "▶ 5/5 Archive unique à télécharger"
tar -cf "$DOMAIN_DIR/export-k-isolation-$STAMP.tar" -C "$DOMAIN_DIR" "export-$STAMP"
chmod 600 "$DOMAIN_DIR/export-k-isolation-$STAMP.tar"
rm -rf "$OUT"   # on ne garde qu'une seule archive sur le serveur

echo
echo "✅ Export terminé : $DOMAIN_DIR/export-k-isolation-$STAMP.tar ($(du -h "$DOMAIN_DIR/export-k-isolation-$STAMP.tar" | cut -f1))"
echo "   Téléchargez-le (gestionnaire de fichiers hPanel, FTP ou scp), puis supprimez-le du serveur :"
echo "   scp -P 65002 <utilisateur>@46.202.172.2:domains/k-isolation.fr/export-k-isolation-$STAMP.tar ."
echo "   ⚠️  Il contient la base de données (comptes, e-mails des formulaires) : ne le partagez pas."
