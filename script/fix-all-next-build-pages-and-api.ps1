$root = Get-Location

function Get-Text($path) {
  return [System.IO.File]::ReadAllText($path)
}

function Set-Text($path, $content) {
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
}

function Has-Line($content, $line) {
  return $content.Contains($line)
}

function Insert-After-Imports($content, $block) {
  $regex = '^(import[\s\S]*?;\r?\n)+'
  $m = [System.Text.RegularExpressions.Regex]::Match($content, $regex)
  if ($m.Success) {
    $imports = $m.Value
    $rest = $content.Substring($imports.Length)
    return $imports + "`r`n" + $block + "`r`n" + $rest
  }
  return $block + "`r`n`r`n" + $content
}

function Ensure-ApiRouteFlags($content) {
  $next = $content
  if (-not (Has-Line $next 'export const dynamic = "force-dynamic";')) {
    $next = Insert-After-Imports $next 'export const dynamic = "force-dynamic";'
  }
  return $next
}

function Ensure-PageFlags($content) {
  $lines = @()

  if (-not (Has-Line $content 'export const dynamic = "force-dynamic";')) {
    $lines += 'export const dynamic = "force-dynamic";'
  }

  if (-not (Has-Line $content 'export const revalidate = 0;')) {
    $lines += 'export const revalidate = 0;'
  }

  if ($lines.Count -eq 0) {
    return $content
  }

  $block = [string]::Join("`r`n", $lines)
  return Insert-After-Imports $content $block
}

$files = Get-ChildItem -Recurse -File .\app | Where-Object {
  $_.FullName.EndsWith("page.tsx") -or $_.FullName.EndsWith("route.ts")
}

$changed = 0

foreach ($file in $files) {
  $full = $file.FullName
  $norm = $full.Replace('\','/')

  $content = Get-Text $full
  $next = $content

  if ($norm -like "*/app/api/*/route.ts" -or $norm -like "*/app/api/route.ts") {
    $next = Ensure-ApiRouteFlags $next
  }
  elseif ($norm -like "*/app/*/page.tsx" -or $norm -like "*/app/page.tsx") {
    $next = Ensure-PageFlags $next
  }

  if ($next -ne $content) {
    Set-Text $full $next
    Write-Host "FIXED: $norm"
    $changed++
  }
}

Write-Host ""
Write-Host "Totale file modificati: $changed"