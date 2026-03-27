$files = Get-ChildItem -Path ".\app\api" -Recurse -Filter "route.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    if ($content -notmatch 'export const dynamic = "force-dynamic";') {
        if ($content -match '^(import .+?;\r?\n)+') {
            $content = [regex]::Replace(
                $content,
                '^(import .+?;\r?\n)+',
                {
                    param($m)
                    $m.Value + "`r`nexport const dynamic = `"force-dynamic`";`r`n"
                },
                [System.Text.RegularExpressions.RegexOptions]::Multiline
            )
        } else {
            $content = "export const dynamic = `"force-dynamic`";`r`n`r`n" + $content
        }

        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "FIXED: $($file.FullName)"
    } else {
        Write-Host "OK: $($file.FullName)"
    }
}