import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check, Database } from "lucide-react";

const SQL_SETUP_SCRIPT = `-- PROMO CODES TABLE SETUP
-- Copy and run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  profit_percentage DECIMAL(5,2) DEFAULT 0 CHECK (profit_percentage >= 0 AND profit_percentage <= 100),
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to read active promo codes"
  ON promo_codes FOR SELECT TO public
  USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

CREATE POLICY "Allow authenticated to read all promo codes"
  ON promo_codes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated to manage promo codes"
  ON promo_codes FOR ALL TO authenticated USING (true) WITH CHECK (true);

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'promo_code'
  ) THEN
    ALTER TABLE orders ADD COLUMN promo_code TEXT;
    CREATE INDEX IF NOT EXISTS idx_orders_promo_code ON orders(promo_code);
    ALTER TABLE orders ADD CONSTRAINT orders_promo_code_fkey 
      FOREIGN KEY (promo_code) REFERENCES promo_codes(code) ON DELETE SET NULL;
  END IF;
END $$;`;

export default function PromoSetupInstructions({ onComplete }: { onComplete?: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <Database className="h-5 w-5" />
          Setup Required: Promo Codes Table
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            To use promo codes, you need to run a SQL script in your Supabase dashboard.
            This is a one-time setup.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <p className="text-sm font-medium">Steps:</p>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>Click the button below to copy the SQL script</li>
            <li>Go to your Supabase Dashboard → SQL Editor</li>
            <li>Click "New Query"</li>
            <li>Paste the script and click "Run"</li>
            <li>Refresh this page</li>
          </ol>
        </div>

        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs max-h-60">
            {SQL_SETUP_SCRIPT}
          </pre>
          <Button
            onClick={handleCopy}
            className="absolute top-2 right-2"
            size="sm"
            variant="secondary"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy SQL
              </>
            )}
          </Button>
        </div>

        {onComplete && (
          <Button onClick={onComplete} className="w-full">
            I've run the SQL script
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
