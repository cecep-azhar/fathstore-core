Get-Process | Where-Object {
    $_.Name -like '*node*' -or
    $_.Name -like '*npm*' -or
    $_.Name -like '*next*'
} | Select-Object Id, Name, CPU | Format-Table -AutoSize
