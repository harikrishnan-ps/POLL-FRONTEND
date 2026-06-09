$ErrorActionPreference = "Stop"

# Initialize git
git init
git remote add origin https://github.com/harikrishnan-ps/POLL-FRONTEND.git

# Initial commit on main
git add package.json package-lock.json angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json .editorconfig .gitignore .prettierrc README.md Dockerfile
git commit -m "Initial commit with config files"
git branch -M main

# Push main
git push -u origin main

# Create development branch from main
git checkout -b development

# Feature 1: Core
git checkout -b feature/core
git add src/app/core
git commit -m "Add core functionality"
git push -u origin feature/core

# Feature 2: Shared
git checkout development
git checkout -b feature/shared
git add src/app/shared
git commit -m "Add shared functionality"
git push -u origin feature/shared

# Feature 3: Features (UI)
git checkout development
git checkout -b feature/ui
git add src/app/features
git commit -m "Add UI features"
git push -u origin feature/ui

# Feature 4: App Root
git checkout development
git checkout -b feature/app-root
git add src/app/app.component.ts src/app/app.html src/app/app.css src/app/app.routes.ts src/app/app.config.ts src/app/app.spec.ts src/app/app.ts
git commit -m "Add app root components"
git push -u origin feature/app-root

# Feature 5: Remaining source and public
git checkout development
git checkout -b feature/misc
git add .
git commit -m "Add remaining application files"
git push -u origin feature/misc

# Merge feature branches into development
git checkout development
git merge feature/core --no-edit
git merge feature/shared --no-edit
git merge feature/ui --no-edit
git merge feature/app-root --no-edit
git merge feature/misc --no-edit

# Push development
git push -u origin development

# Create release branch
git checkout -b release/v1.0.0
# Push release
git push -u origin release/v1.0.0

# Finally merge release/v1.0.0 branch and main branch
git checkout main
git merge release/v1.0.0 --no-edit
git push origin main
