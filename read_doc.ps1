sao l$word = New-Object -ComObject Word.Application
$word.Visible = $false
$files = Get-ChildItem 'd:\Template_HopDong\' -Filter '*.doc'
Write-Host "Doc files found:"
foreach ($f in $files) { Write-Host $f.FullName }
$doc = $word.Documents.Open($files[0].FullName, $false, $true)
$text = $doc.Content.Text
Write-Host "=== DOC CONTENT ==="
Write-Host $text.Substring(0, [Math]::Min($text.Length, 8000))
$doc.Close($false)
$word.Quit()
