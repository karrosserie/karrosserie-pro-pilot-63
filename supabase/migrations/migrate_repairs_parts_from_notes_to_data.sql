-- Migration pour déplacer les données de réparations et pièces des notes vers les nouveaux champs
UPDATE quotes 
SET 
  repairs_data = CASE 
    WHEN notes IS NOT NULL AND notes != '' THEN
      CASE 
        WHEN json_extract(notes, '$.repairs') IS NOT NULL THEN
          json_extract(notes, '$.repairs')
        ELSE NULL
      END
    ELSE NULL
  END,
  parts_data = CASE 
    WHEN notes IS NOT NULL AND notes != '' THEN
      CASE 
        WHEN json_extract(notes, '$.parts') IS NOT NULL THEN
          json_extract(notes, '$.parts')
        ELSE NULL
      END
    ELSE NULL
  END
WHERE notes IS NOT NULL AND notes != '';