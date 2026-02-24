@echo off
cd d:\01_WEB\01_Projects\fathstore-core\apps\store\app
mkdir "[locale]"
move about "[locale]\"
move cart "[locale]\"
move categories "[locale]\"
move checkout "[locale]\"
move globals.css "[locale]\"
move layout.tsx "[locale]\"
move license-expired "[locale]\"
move page.tsx "[locale]\"
move payment "[locale]\"
move products "[locale]\"
cd ..
mkdir messages
echo {} > messages\en.json
echo {} > messages\id.json
echo "Restructuring complete."
