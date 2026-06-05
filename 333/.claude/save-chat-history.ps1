# Сохраняет текущий транскрипт чата Claude Code в папку проекта,
# чтобы история попадала в архив вместе с файлами сайта.
# Вызывается хуками Stop и SessionEnd. JSON хука приходит на stdin.
$ErrorActionPreference = 'Stop'
try {
    $raw = [Console]::In.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }

    $data = $raw | ConvertFrom-Json
    $src = $data.transcript_path
    if ([string]::IsNullOrWhiteSpace($src) -or -not (Test-Path -LiteralPath $src)) { exit 0 }

    # Корень проекта = родитель папки .claude, где лежит этот скрипт.
    # Так история едет вместе с проектом, даже если папку переименовать/переместить.
    $projectRoot = Split-Path -Parent $PSScriptRoot
    $destDir = Join-Path $projectRoot 'chat-history'
    if (-not (Test-Path -LiteralPath $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }

    $sessionId = if ($data.session_id) { $data.session_id } else { 'session' }
    $dest = Join-Path $destDir "$sessionId.jsonl"
    Copy-Item -LiteralPath $src -Destination $dest -Force
} catch {
    # Бэкап не должен ронять сессию — молча проглатываем ошибки.
}
exit 0
