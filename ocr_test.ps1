# Try to get text from image using Windows OCR
Add-Type -AssemblyName System.Drawing

$imagePath = "D:\01_WEB\01_Projects\fathstore-core\issues_screenshot.png"

# Load the image
$image = [System.Drawing.Image]::FromFile($imagePath)

# Check if Windows.Media.Ocr is available
try {
    Add-Type -AssemblyName Windows.Media
    Add-Type -AssemblyName System.Runtime.WindowsRuntime

    # Try to use Windows OCR
    Write-Host "Windows OCR not easily accessible from PowerShell"
} catch {
    Write-Host "OCR not available"
}

$image.Dispose()
