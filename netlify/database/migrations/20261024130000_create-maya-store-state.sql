CREATE TABLE IF NOT EXISTS maya_store_state (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  products JSONB NOT NULL,
  categories JSONB NOT NULL,
  whatsapp_number TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
