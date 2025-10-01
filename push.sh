#!/bin/bash

# Skrip untuk commit & push ke GitHub sekaligus
# Pastikan SSH sudah dikonfigurasi sebelumnya

# Pesan commit bisa diketik setelah ./push.sh "Pesan commit"
COMMIT_MSG=${1:-"Update project Next.js"}

# Tambahkan semua perubahan
git add .

# Commit
git commit -m "$COMMIT_MSG"

# Push ke GitHub
git push -u origin main

echo "✅ Semua perubahan sudah di-push ke GitHub!"

