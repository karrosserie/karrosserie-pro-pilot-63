-- Migrate claim_number from JSON notes to dedicated column
UPDATE public.quotes 
SET claim_number = (
  CASE 
    WHEN notes IS NOT NULL AND notes != '' AND notes LIKE '%claimNumber%' THEN
      (
        SELECT COALESCE(
          (json_extract_path_text(notes::json, 'claimNumber')),
          ''
        )
      )
    ELSE ''
  END
)
WHERE claim_number IS NULL AND notes IS NOT NULL;

-- Clean up notes by removing claimNumber from JSON
UPDATE public.quotes 
SET notes = (
  CASE 
    WHEN notes IS NOT NULL AND notes != '' AND notes LIKE '%claimNumber%' THEN
      (
        SELECT json_build_object(
          'notes', COALESCE(json_extract_path_text(notes::json, 'notes'), ''),
          'currentMileage', COALESCE(json_extract_path_text(notes::json, 'currentMileage'), ''),
          'repairs', COALESCE(notes::json->'repairs', '[]'::json),
          'parts', COALESCE(notes::json->'parts', '[]'::json),
          'discounts', COALESCE(notes::json->'discounts', '[]'::json)
        )::text
      )
    ELSE notes
  END
)
WHERE notes IS NOT NULL AND notes LIKE '%claimNumber%';