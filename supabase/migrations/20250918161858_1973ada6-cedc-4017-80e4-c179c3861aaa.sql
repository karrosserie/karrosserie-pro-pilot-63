-- Ajouter les champs pour la marque de peinture et le code couleur
ALTER TABLE employee_schedule 
ADD COLUMN paint_brand text,
ADD COLUMN color_code text;