-- =============================================
-- COPY & PASTE SQL TO VERIFY AUTO-CONFIRMATION
-- =============================================

-- 1. Check if auto-confirmation trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'auto_confirm_user_trigger';

-- 2. Check if auto-confirmation function exists
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines 
WHERE routine_name = 'auto_confirm_user';

-- 3. Check existing users confirmation status
SELECT 
    id,
    email,
    email_confirmed_at IS NOT NULL as email_confirmed,
    phone_confirmed_at IS NOT NULL as phone_confirmed,
    confirmed_at IS NOT NULL as overall_confirmed,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Test query to see if all users are confirmed
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
    COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users;

-- =============================================
-- RESULTS SHOULD SHOW:
-- - Trigger exists and is active
-- - Function exists with SECURITY DEFINER
-- - All users have confirmation timestamps
-- - Zero unconfirmed users
-- =============================================