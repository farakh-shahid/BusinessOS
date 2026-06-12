-- Booking date + flexible JSON measurements on orders and measurements

ALTER TABLE "business_os_tailor"."orders"
  ADD COLUMN "booking_date" DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN "measurements_data" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN "style_data" JSONB NOT NULL DEFAULT '{}';

ALTER TABLE "business_os_tailor"."measurements"
  ADD COLUMN "garment_type" "business_os_tailor"."GarmentType",
  ADD COLUMN "measurements_data" JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN "style_data" JSONB NOT NULL DEFAULT '{}';

-- Backfill JSON from existing decimal columns where present
UPDATE "business_os_tailor"."measurements" m
SET measurements_data = jsonb_strip_nulls(
  jsonb_build_object(
    'chest', m.chest,
    'waist', m.waist,
    'shoulder', m.shoulder,
    'sleeve', m.sleeve,
    'neck', m.neck,
    'qameezLength', m.shirt_length,
    'shalwarLength', m.trouser_length,
    'hip', m.hip,
    'thigh', m.thigh
  )
),
style_data = jsonb_strip_nulls(
  jsonb_build_object(
    'chestPocket', lower(m.chest_pocket::text),
    'sidePockets', lower(m.side_pockets::text),
    'collar', lower(m.collar::text),
    'placket', lower(m.placket::text),
    'gera', m.gera,
    'notes', m.notes
  )
)
WHERE measurements_data = '{}'::jsonb;
