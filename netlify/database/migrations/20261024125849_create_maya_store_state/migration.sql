CREATE TABLE "maya_store_state" (
	"singleton" boolean PRIMARY KEY DEFAULT true,
	"products" jsonb NOT NULL,
	"categories" jsonb NOT NULL,
	"whatsapp_number" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
