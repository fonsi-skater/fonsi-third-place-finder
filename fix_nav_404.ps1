# Fonsi Third Place Finder - Fix Nav 404s
# Points Categories/Near You to the listings section on the homepage,
# and removes the About link (no page built for it yet).

$projectRoot = "C:\Users\HP\Projects\Fonsi_Third_Place_Finder"

function Write-FileFromBase64($RelativePath, $Base64Content) {
    $fullPath = Join-Path $projectRoot $RelativePath
    $dir = Split-Path $fullPath -Parent
    if (!(Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    $bytes = [System.Convert]::FromBase64String($Base64Content)
    [System.IO.File]::WriteAllBytes($fullPath, $bytes)
    Write-Host "Written: $RelativePath" -ForegroundColor Green
}

Write-FileFromBase64 "components\\layout\\Navbar.tsx" "aW1wb3J0IExpbmsgZnJvbSAibmV4dC9saW5rIjsKCmNvbnN0IG5hdkl0ZW1zID0gWwogIHsgbGFiZWw6ICJDYXRlZ29yaWVzIiwgaHJlZjogIi8jbGlzdGluZ3MiIH0sCiAgeyBsYWJlbDogIk5lYXIgWW91IiwgaHJlZjogIi8jbGlzdGluZ3MiIH0sCl07CgpleHBvcnQgZnVuY3Rpb24gTmF2YmFyKCkgewogIHJldHVybiAoCiAgICA8bmF2IGNsYXNzTmFtZT0iZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB4LTYgcHktNCI+CiAgICAgIDxMaW5rIGhyZWY9Ii8iIGNsYXNzTmFtZT0iZm9udC1kaXNwbGF5IHRleHQtbGcgZm9udC1zZW1pYm9sZCB0ZXh0LXNhbmQiPgogICAgICAgIEZvbnNpCiAgICAgIDwvTGluaz4KCiAgICAgIDxkaXYgY2xhc3NOYW1lPSJoaWRkZW4gaXRlbXMtY2VudGVyIGdhcC0xIHJvdW5kZWQtZnVsbCBiZy13aGl0ZS8xMCBweC0yIHB5LTEgYmFja2Ryb3AtYmx1ciBtZDpmbGV4Ij4KICAgICAgICB7bmF2SXRlbXMubWFwKChpdGVtKSA9PiAoCiAgICAgICAgICA8TGluawogICAgICAgICAgICBrZXk9e2l0ZW0uaHJlZn0KICAgICAgICAgICAgaHJlZj17aXRlbS5ocmVmfQogICAgICAgICAgICBjbGFzc05hbWU9InJvdW5kZWQtZnVsbCBweC00IHB5LTIgdGV4dC1zbSB0ZXh0LXNhbmQvOTAgdHJhbnNpdGlvbi1jb2xvcnMgaG92ZXI6Ymctd2hpdGUvMTAgaG92ZXI6dGV4dC1zYW5kIgogICAgICAgICAgPgogICAgICAgICAgICB7aXRlbS5sYWJlbH0KICAgICAgICAgIDwvTGluaz4KICAgICAgICApKX0KICAgICAgPC9kaXY+CgogICAgICA8TGluawogICAgICAgIGhyZWY9Ii9zdWJtaXQiCiAgICAgICAgY2xhc3NOYW1lPSJyb3VuZGVkLWZ1bGwgYmctZW1iZXIgcHgtNSBweS0yLjUgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LXdoaXRlIHRyYW5zaXRpb24tdHJhbnNmb3JtIGhvdmVyOnNjYWxlLVsxLjAyXSIKICAgICAgPgogICAgICAgIFN1Ym1pdCBhIEdyb3VwCiAgICAgIDwvTGluaz4KICAgIDwvbmF2PgogICk7Cn0K"

Write-Host ""
Write-Host "Nav fixed. Now run:" -ForegroundColor Cyan
Write-Host "  Remove-Item -Recurse -Force `"$projectRoot\.next`"" -ForegroundColor Yellow
Write-Host "  cd `"$projectRoot`"" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Yellow
