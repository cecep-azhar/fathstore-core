Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

$imagePath = "D:\01_WEB\01_Projects\fathstore-core\issues_screenshot.png"
$outputPath = "D:\01_WEB\01_Projects\fathstore-core\issues_fixed.png"

$bmp = New-Object System.Drawing.Bitmap($imagePath)
$width = $bmp.Width
$height = $bmp.Height
$format = $bmp.PixelFormat

Write-Host "Image: $width x $height, Format: $format"

# Save as different format to test
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "Saved fixed image to $outputPath"
