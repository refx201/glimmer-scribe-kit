// components/OAuthDebug.tsx
import { useEffect } from 'react';

export function OAuthDebug() {
  useEffect(() => {
    // Log immediately on component mount
    console.log('🚨 EARLY OAUTH DEBUG - Component Mount');
    console.log('🔗 Full href:', window.location.href);
    console.log('🔍 Search:', window.location.search);
    console.log('🎯 Hash:', window.location.hash);
    
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    console.log('📋 URL Params:', Object.fromEntries(urlParams.entries()));
    console.log('🔑 Hash Params:', Object.fromEntries(hashParams.entries()));
    
    // Check for OAuth parameters
    const hasCode = urlParams.has('code') || hashParams.has('code');
    const hasState = urlParams.has('state') || hashParams.has('state');
    
    console.log('🎯 OAuth Params Found:', { hasCode, hasState });
    
    if (hasCode && hasState) {
      console.log('✅ OAuth parameters detected!');
      console.log('📍 Code:', urlParams.get('code') || hashParams.get('code'));
      console.log('📍 State:', urlParams.get('state') || hashParams.get('state'));
    } else {
      console.log('❌ No OAuth parameters found');
    }
  }, []);

  return null;
}