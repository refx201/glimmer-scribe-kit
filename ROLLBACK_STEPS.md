# Authentication System Rollback Guide

## 🚨 Emergency Rollback Procedure

If issues arise after deploying the authentication updates, follow these steps to quickly revert to the previous stable state.

---

## ⚡ Quick Rollback (5 minutes)

### Option 1: Git Revert (Recommended)
```bash
# Revert the authentication commit
git revert HEAD

# Push changes
git push origin main

# Redeploy application
npm run build
```

### Option 2: Checkout Previous Commit
```bash
# Find the commit before auth changes
git log --oneline

# Checkout previous stable commit
git checkout <commit-hash>

# Create new branch from stable commit
git checkout -b stable-fallback

# Push and redeploy
git push origin stable-fallback
```

---

## 🗄️ Database Rollback (10 minutes)

### Step 1: Backup Current State
```sql
-- Backup user_roles table
CREATE TABLE user_roles_backup AS SELECT * FROM public.user_roles;

-- Backup user_presence table
CREATE TABLE user_presence_backup AS SELECT * FROM public.user_presence;
```

### Step 2: Remove New Tables
```sql
-- Drop user_presence table
DROP TABLE IF EXISTS public.user_presence CASCADE;

-- Drop user_roles table
DROP TABLE IF EXISTS public.user_roles CASCADE;
```

### Step 3: Remove Functions
```sql
-- Drop role-checking functions
DROP FUNCTION IF EXISTS public.has_role(UUID, public.app_role) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_roles(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_role() CASCADE;
```

### Step 4: Remove Triggers
```sql
-- Drop trigger for role assignment
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
```

### Step 5: Remove Enum Type
```sql
-- Drop app_role enum
DROP TYPE IF EXISTS public.app_role CASCADE;
```

### Step 6: Remove Indexes
```sql
-- Drop indexes (if they exist)
DROP INDEX IF EXISTS idx_user_roles_user_id;
DROP INDEX IF EXISTS idx_user_roles_role;
DROP INDEX IF EXISTS idx_user_presence_user_id;
DROP INDEX IF EXISTS idx_user_presence_heartbeat;
```

---

## 📁 Code Rollback

### Files to Restore:

1. **src/lib/auth-context.tsx**
   - Restore from previous commit
   - Remove presence tracking code
   - Remove role management code
   - Restore original signIn/signOut functions

2. **src/components/EnhancedAuthModal.tsx**
   - Restore from previous commit
   - Re-add success toast in handleSignIn

3. **Delete New Files:**
   ```bash
   rm src/tests/auth.test.ts
   rm CHANGELOG.md
   rm ROLLBACK_STEPS.md
   ```

### Manual Code Changes (if git revert not possible):

**src/lib/auth-context.tsx**:

Replace the imports:
```typescript
// Old (restore this)
import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
```

Remove from AuthContextType:
```typescript
// Remove these lines:
userRoles: string[]
hasRole: (role: string) => boolean
isAdmin: boolean
updatePresence: () => Promise<void>
```

Restore original signIn:
```typescript
const signIn = async (email: string, password: string) => {
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    // Show welcome toast (restore this)
    const userName = data.user?.user_metadata?.name || 'المستخدم'
    toast.success(`أهلاً بك، ${userName}!`, {
      description: 'تم تسجيل الدخول بنجاح'
    })
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}
```

Restore original signOut:
```typescript
const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}
```

**src/components/EnhancedAuthModal.tsx**:

Restore handleSignIn:
```typescript
const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!signInData.email || !signInData.password) {
    toast.error('جميع الحقول مطلوبة');
    return;
  }

  try {
    await signIn(signInData.email, signInData.password);
    toast.success('تم تسجيل الدخول بنجاح'); // Restore this line
    onClose();
    setSignInData({ email: '', password: '' });
  } catch (error: any) {
    // ... error handling
  }
};
```

---

## 🧪 Verification After Rollback

Run these checks to ensure rollback was successful:

### 1. Database Verification
```sql
-- Verify tables are removed
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_roles', 'user_presence');
-- Should return 0 rows

-- Verify functions are removed
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('has_role', 'get_user_roles', 'handle_new_user_role');
-- Should return 0 rows

-- Verify enum is removed
SELECT typname 
FROM pg_type 
WHERE typname = 'app_role';
-- Should return 0 rows
```

### 2. Application Verification
- [ ] Test sign up with email/password
- [ ] Test sign in with email/password
- [ ] Test Google OAuth (if configured)
- [ ] Verify NO redirect to `/profile` after sign in
- [ ] Verify toast shows "تم تسجيل الدخول بنجاح"
- [ ] Check browser console for errors
- [ ] Verify profile page works
- [ ] Test sign out

### 3. Code Verification
```bash
# Verify test file is removed
ls src/tests/auth.test.ts
# Should show: No such file or directory

# Verify CHANGELOG is removed
ls CHANGELOG.md
# Should show: No such file or directory

# Check git status
git status
# Should show clean working directory
```

---

## 🔍 Troubleshooting Common Rollback Issues

### Issue 1: Migration Won't Reverse
**Symptom**: SQL errors when dropping tables/functions

**Solution**:
```sql
-- Force drop with CASCADE
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.user_presence CASCADE;

-- If triggers are blocking
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users CASCADE;

-- Try dropping in reverse order
DROP TYPE IF EXISTS public.app_role CASCADE;
```

### Issue 2: Code Still Referencing Removed Features
**Symptom**: TypeScript errors or runtime errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear TypeScript cache
rm -rf .next
rm -rf .cache

# Rebuild
npm run build
```

### Issue 3: Supabase Types Out of Sync
**Symptom**: Type errors in IDE

**Solution**:
```bash
# Regenerate Supabase types (if using CLI)
npx supabase gen types typescript --project-id <your-project-id> > src/integrations/supabase/types.ts

# Or restart TypeScript server in IDE
# VS Code: Cmd+Shift+P > "TypeScript: Restart TS Server"
```

### Issue 4: Users Can't Sign In After Rollback
**Symptom**: Auth errors for existing users

**Solution**:
```sql
-- Check if handle_new_user trigger is still active
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- If trigger is still there, drop it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Verify profiles table still exists and has data
SELECT COUNT(*) FROM profiles;
```

---

## 📊 Post-Rollback Monitoring

After rolling back, monitor these metrics for 24 hours:

1. **Authentication Success Rate**
   - Expected: Same as before new changes
   - Watch for: Sudden drop in successful logins

2. **Error Rates**
   - Expected: Return to baseline
   - Watch for: New or increased errors

3. **User Complaints**
   - Watch for: Reports of login issues
   - Action: Document and investigate

4. **Database Queries**
   ```sql
   -- Monitor auth attempts
   SELECT COUNT(*), DATE(created_at) 
   FROM auth.audit_log_entries 
   WHERE created_at > NOW() - INTERVAL '24 hours'
   GROUP BY DATE(created_at);
   ```

---

## 🆘 Emergency Contacts

If rollback fails or issues persist:

1. **Check Supabase Dashboard**
   - https://supabase.com/dashboard/project/<your-project-id>
   - Review logs in Authentication > Logs

2. **Review Supabase Support**
   - https://supabase.com/docs
   - Discord: https://discord.supabase.com

3. **Restore Database Backup**
   ```sql
   -- If you have a backup
   RESTORE DATABASE FROM BACKUP 'backup-name';
   ```

---

## ✅ Rollback Completion Checklist

Mark items as complete:

### Database:
- [ ] Backed up current state
- [ ] Dropped user_presence table
- [ ] Dropped user_roles table
- [ ] Dropped has_role function
- [ ] Dropped get_user_roles function
- [ ] Dropped handle_new_user_role function
- [ ] Dropped triggers
- [ ] Dropped app_role enum
- [ ] Dropped indexes
- [ ] Verified tables removed
- [ ] Verified functions removed

### Code:
- [ ] Reverted auth-context.tsx
- [ ] Reverted EnhancedAuthModal.tsx
- [ ] Deleted auth.test.ts
- [ ] Deleted CHANGELOG.md
- [ ] Deleted ROLLBACK_STEPS.md
- [ ] Cleared node_modules
- [ ] Reinstalled dependencies
- [ ] Rebuilt application
- [ ] No TypeScript errors
- [ ] No console errors

### Testing:
- [ ] Sign up works
- [ ] Sign in works
- [ ] Google OAuth works
- [ ] Profile page works
- [ ] Sign out works
- [ ] No redirect to /profile
- [ ] Toast messages work
- [ ] Mobile responsive

### Deployment:
- [ ] Code pushed to repository
- [ ] Application redeployed
- [ ] Database changes applied
- [ ] Monitoring set up
- [ ] Team notified

---

## 📝 Rollback Report Template

Use this template to document the rollback:

```markdown
# Rollback Report

**Date**: [Date]
**Time**: [Time]
**Performed By**: [Your Name]
**Reason**: [Why rollback was necessary]

## Actions Taken
1. [List each step performed]
2. 
3. 

## Verification Results
- Database: [Pass/Fail]
- Code: [Pass/Fail]
- Testing: [Pass/Fail]

## Issues Encountered
[Describe any issues and how they were resolved]

## Current Status
[Describe the current state of the system]

## Next Steps
[What needs to be done next]

## Lessons Learned
[What went wrong and how to prevent it]
```

---

## 🔮 Prevention for Future Deployments

To avoid needing rollback in the future:

1. **Test in Staging First**
   - Always deploy to staging environment
   - Run full test suite
   - Manual QA testing

2. **Gradual Rollout**
   - Enable feature flags
   - Deploy to 10% of users first
   - Monitor for 24 hours before full rollout

3. **Better Backups**
   - Automated daily database backups
   - Code snapshots before major changes
   - Document all changes

4. **Monitoring**
   - Set up alerts for auth failures
   - Monitor user complaints
   - Track key metrics

---

**End of Rollback Guide**

*Keep this document accessible for emergency situations*
*Last Updated: 2025-10-18*
*Version: 1.0*
