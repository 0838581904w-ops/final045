$cp874_to_byte = @{}
$win1252_extras = @{
    [char]0x20ac = 0x80; [char]0x201a = 0x82; [char]0x0192 = 0x83; [char]0x201e = 0x84;
    [char]0x2026 = 0x85; [char]0x2020 = 0x86; [char]0x2021 = 0x87; [char]0x02c6 = 0x88;
    [char]0x2030 = 0x89; [char]0x0160 = 0x8a; [char]0x2039 = 0x8b; [char]0x0152 = 0x8c;
    [char]0x017d = 0x8e; [char]0x2018 = 0x91; [char]0x2019 = 0x92; [char]0x201c = 0x93;
    [char]0x201d = 0x94; [char]0x2022 = 0x95; [char]0x2013 = 0x96; [char]0x2014 = 0x97;
    [char]0x02dc = 0x98; [char]0x2122 = 0x99; [char]0x0161 = 0x9a; [char]0x203a = 0x9b;
    [char]0x0153 = 0x9c; [char]0x017e = 0x9e; [char]0x0178 = 0x9f
}
foreach ($key in $win1252_extras.Keys) { $cp874_to_byte[$key] = $win1252_extras[$key] }
for ($i = 0xA1; $i -le 0xFB; $i++) { $cp874_to_byte[[char](0x0E01 + $i - 0xA1)] = $i }

function Fix-Text ($text) {
    $bytes = New-Object byte[] $text.Length
    $count = 0; $prev1 = 0; $prev2 = 0
    foreach ($c in $text.ToCharArray()) {
        $charCode = [int]$c
        $b = 63
        if ($charCode -lt 128) {
            $b = [byte]$charCode
            if ($b -eq 32) {
                if ($prev1 -eq 184 -and $prev2 -eq 224) { $b = 129 }
                if ($prev1 -eq 185 -and $prev2 -eq 224) { $b = 129 }
            }
        } elseif ($cp874_to_byte.ContainsKey($c)) {
            $b = [byte]$cp874_to_byte[$c]
        }
        $bytes[$count] = $b
        $prev2 = $prev1; $prev1 = $b; $count++
    }
    $utf8String = [System.Text.Encoding]::UTF8.GetString($bytes, 0, $count)
    $utf8String = $utf8String -replace "ใหก่", "ใหญ่"
    $utf8String = $utf8String -replace "หกิง", "หญิง"
    $utf8String = $utf8String -replace "สำคัก", "สำคัญ"
    $utf8String = $utf8String -replace "ปักหา", "ปัญหา"
    $utf8String = $utf8String -replace "สัญกา", "สัญญา"
    $utf8String = $utf8String -replace "อนุกาต", "อนุญาต"
    $utf8String = $utf8String -replace "เหรียก", "เหรียญ"
    $utf8String = $utf8String -replace "กก", "กฎ"
    $utf8String = $utf8String -replace "ปกิบัติ", "ปฏิบัติ"
    $utf8String = $utf8String -replace "พื้นกาน", "พื้นฐาน"
    $utf8String = $utf8String -replace "กึก", "ฝึก"
    $utf8String = $utf8String -replace "กีมือ", "ฝีมือ"
    $utf8String = [System.Text.RegularExpressions.Regex]::Replace($utf8String, "([ก-ฮ][่-๋]?)แ", "$1ำ")
    return $utf8String
}

$directory = 'c:\laragon\www\final'
Get-ChildItem -Path $directory -Filter "*.html" | ForEach-Object {
    $filepath = $_.FullName
    $content = [System.IO.File]::ReadAllText($filepath, [System.Text.Encoding]::UTF8)
    if ($content.Contains('เธ') -or $content.Contains('เน€')) {
        $fixed = Fix-Text $content
        [System.IO.File]::WriteAllText($filepath, $fixed, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed $($_.Name)"
    }
}
