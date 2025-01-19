#!/bin/bash

# Install git-filter-repo if not already installed
if ! command -v git-filter-repo &> /dev/null
then
    echo "Installing git-filter-repo..."
    pip install git-filter-repo
fi

# Create replacement patterns
cat > replacements.txt <<EOL
AIzaSyChS6vN_Lk3K_9zj2hklIyhkmgD2a66HAk==>REMOVED
reusable-portal.firebaseapp.com==>REMOVED
reusable-portal==>REMOVED
reusable-portal.appspot.com==>REMOVED
1043075733434==>REMOVED
1:1043075733434:web:fac562e7e318273dbdaf83==>REMOVED
G-D8WSN0J6J4==>REMOVED
EOL

# Run git filter-repo
git filter-repo --replace-text replacements.txt --force

# Clean up
rm replacements.txt

echo "Git history cleaned successfully!"
echo "You will need to force push the changes:"
echo "git push origin --force --all"
echo "git push origin --force --tags"
