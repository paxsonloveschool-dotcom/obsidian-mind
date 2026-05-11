---
name: github-ssh-token-workflow
description: GitHub setup with SSH keys and understanding when tokens vs SSH are needed. Covers creating dedicated SSH keys, configuring SSH config, and the limitations of SSH vs gh CLI token requirements.
category: github
---

# GitHub SSH + Token Workflow

## Key Learning
**SSH authentication ≠ gh CLI authentication**

- **SSH** (git push/pull): Works with SSH keys only
- **gh CLI** (API operations like creating repos): Requires personal access token
- **git operations** (clone, push, pull, fetch): Can use SSH keys

## When to Use What

### SSH Keys (git operations)
```bash
git clone git@github.com:user/repo.git
git push
git pull
```

### Personal Access Token (gh CLI API operations)
```bash
gh repo create user/repo --public
gh pr create
gh issue list
```

## Setup: Dedicated SSH Key for Hermes Agent

### 1. Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "hermes-agent@username" -f ~/.ssh/id_ed25519_hermes -N ""
```

### 2. Configure SSH Config
```bash
cat >> ~/.ssh/config << 'EOF'

# Hermes Agent GitHub Access
Host github.com-hemes
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_hermes
  IdentitiesOnly yes
EOF
```

### 3. Add Public Key to GitHub
```bash
# Show public key
cat ~/.ssh/id_ed25519_hermes.pub

# Then add at: https://github.com/settings/ssh/new
# Title: Hermes Agent
# Key: paste public key
```

### 4. Test Connection
```bash
ssh -T git@github.com-hemes
# Expected: "Hi username! You've successfully authenticated..."
```

### 5. Use with Git
```bash
# Clone using custom host
git clone git@github.com-hemes:user/repo.git

# Or update existing remote
cd repo
git remote set-url origin git@github.com-hemes:user/repo.git
```

## Workflow: Create Repo + Push (Without gh Token)

Since `gh repo create` needs a token but SSH works for push:

### Step 1: Create Repo Manually
1. Go to: https://github.com/new
2. Fill in:
   - Repository name: `repo-name`
   - Description: `Description`
   - Public/Private
   - ❌ Don't initialize with README
3. Click "Create repository"

### Step 2: Push with SSH
```bash
cd /path/to/local/repo
git remote add origin git@github.com-hemes:user/repo-name.git
git branch -M main
git push -u origin main
```

## Alternative: Use gh with Token

If you want to create repos programmatically:

### 1. Find Existing Token
Check `~/.env` for `GITHUB_TOKEN`:
```bash
# Option 1: Source and use
source ~/.env
echo $GITHUB_TOKEN  # Format: ghp_xxxx

# Option 2: Direct grep
grep "GITHUB_TOKEN" ~/.env | cut -d'"' -f2
```

Or create new token at: https://github.com/settings/tokens/new
- Note: `Hermes Agent`
- Expiration: 90 days (or custom)
- Scopes: ✅ `repo` (full control)

### 2. Authenticate gh CLI
```bash
# Non-interactive authentication
echo "$GITHUB_TOKEN" | gh auth login --with-token

# Verify
gh auth status
# Should show: "Logged in to github.com account adityahimaone"
```

### 3. Create Repo Programmatically
```bash
cd /path/to/project

# Create and push in one command
gh repo create adityahimaone/repo-name \
  --public \
  --source=. \
  --remote=origin \
  --push \
  --description "Repository description"

# If repo already exists, just push
git remote set-url origin git@github.com-hemes:adityahimaone/repo-name.git
git push -u origin main
```

### 4. Complete Workflow Example
```bash
# 1. Generate SSH key
ssh-keygen -t ed25519 -C "hermes-agent@adityahimaone" -f ~/.ssh/id_ed25519_hermes -N ""

# 2. Add to SSH config
cat >> ~/.ssh/config << 'EOF'

# Hermes Agent GitHub Access
Host github.com-hemes
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_hermes
  IdentitiesOnly yes
EOF

# 3. Add public key to GitHub (manual)
cat ~/.ssh/id_ed25519_hermes.pub
# Add at: https://github.com/settings/ssh/new

# 4. Test SSH
ssh -T git@github.com-hemes

# 5. Authenticate gh with token from ~/.env
source ~/.env
echo "$GITHUB_TOKEN" | gh auth login --with-token

# 6. Create repository
cd ~/Development/my-project
gh repo create adityahimaone/my-project --public --source=. --remote=origin --push
```

## SSH Config for Multiple Keys

If you have multiple SSH keys:

```bash
# ~/.ssh/config

# Personal GitHub
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes

# Hermes Agent GitHub
Host github.com-hemes
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_hermes
  IdentitiesOnly yes

# Work GitHub
Host github.com-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  IdentitiesOnly yes
```

Usage:
```bash
git clone git@github.com:personal/repo.git        # Uses id_ed25519
git clone git@github.com-hemes:hermes/repo.git    # Uses id_ed25519_hermes
git clone git@github.com-work:work/repo.git       # Uses id_ed25519_work
```

## Troubleshooting

### Permission Denied (publickey)
```bash
# Check which key is being used
ssh -vT git@github.com 2>&1 | grep "Offering"

# Test specific host
ssh -T git@github.com-hemes

# Add key to agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_hermes
```

### gh CLI: "You are not logged into any GitHub hosts"
```bash
# gh needs token, not SSH
# Option 1: Create token and authenticate
source ~/.env
echo "$GITHUB_TOKEN" | gh auth login --with-token

# Option 2: Use manual workflow
# Create repo at github.com/new, then push with git
```

### GraphQL: "Name already exists on this account"
```bash
# Repository already exists on GitHub
# Option 1: Just push to existing repo
git remote set-url origin git@github.com-hemes:adityahimaone/repo-name.git
git push -u origin main

# Option 2: Check repo exists first
gh repo view adityahimaone/repo-name

# Option 3: Use gh to push if remote not set
cd /path/to/repo
gh repo create adityahimaone/repo-name --public --source=. --remote=origin --push
# If fails with "already exists", just push:
git push -u origin main
```

### gh CLI: "cannot use `--web` with `--json`"
```bash
# This error occurs when trying to open repo in browser with --web flag
# Just use the URL directly:
echo "https://github.com/adityahimaone/repo-name"

# Or use gh repo view without --web:
gh repo view adityahimaone/repo-name
```

### gh auth status shows "keyring" but no token
```bash
# Token might be stored in system keyring
# To use a specific token:
echo "$GITHUB_TOKEN" | gh auth login --with-token
```

### Wrong Key Being Used
```bash
# Check SSH config
cat ~/.ssh/config

# Force specific key
ssh -i ~/.ssh/id_ed25519_hermes -T git@github.com

# Update remote URL to use custom host
git remote set-url origin git@github.com-hemes:user/repo.git
```

## Files

```
~/.ssh/id_ed25519_hermes       # Private key (NEVER share)
~/.ssh/id_ed25519_hermes.pub   # Public key (add to GitHub)
~/.ssh/config                  # SSH configuration
```

## Security Best Practices

1. ✅ Use Ed25519 keys (more secure than RSA)
2. ✅ Create dedicated keys per purpose (Hermes, work, personal)
3. ✅ Use meaningful key comments (`-C "hermes-agent@username"`)
4. ✅ Don't use passphrases for automated agents (or use ssh-agent)
5. ❌ Never commit private keys
6. ❌ Never share private keys
7. ❌ Never store tokens in code (use env vars or gh auth)

---

**Created**: 2026-04-13
**Context**: Setting up GitHub access for Hermes Agent backup repository
