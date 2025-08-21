Write-Host "🚀 Configurando Push para GitHub" -ForegroundColor Green
Write-Host ""

Write-Host "Por favor, informe:" -ForegroundColor Yellow
Write-Host "1. Seu username no GitHub"
Write-Host "2. Nome do repositório"
Write-Host ""

$username = Read-Host "Username do GitHub"
$repo = Read-Host "Nome do repositório"

Write-Host ""
Write-Host "Configurando remote..." -ForegroundColor Cyan
git remote add origin "https://github.com/$username/$repo.git"

Write-Host ""
Write-Host "Fazendo push..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "✅ Concluído!" -ForegroundColor Green
Read-Host "Pressione Enter para continuar"
