import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InsuranceCompanyRow {
  name: string;
  address?: string;
  address2?: string;
  zipcode?: string;
  city?: string;
  phone?: string;
  email?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting insurance companies sync...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch CSV data from the URL
    console.log('Fetching CSV data from Clearbus...');
    const csvResponse = await fetch('https://www.clearbus.fr/Misc/Karrosserie.pro/Karrosserie.csv');
    
    if (!csvResponse.ok) {
      throw new Error(`Failed to fetch CSV: ${csvResponse.status} ${csvResponse.statusText}`);
    }

    const csvText = await csvResponse.text();
    console.log('CSV data fetched successfully');

    // Parse CSV data
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length <= 1) {
      console.log('No data rows found in CSV');
      return new Response(JSON.stringify({ success: true, message: 'No data to process' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Skip the header row (first line)
    const dataLines = lines.slice(1);
    console.log(`Processing ${dataLines.length} insurance companies...`);

    const processedCompanies: InsuranceCompanyRow[] = [];
    const errors: string[] = [];

    // Process each line
    for (let i = 0; i < dataLines.length; i++) {
      try {
        const line = dataLines[i];
        // Split by double semicolon since that's the CSV format
        const columns = line.split(';;').map(col => col.trim());
        
        console.log(`Processing line ${i + 2}: ${line}`);
        console.log(`Columns:`, columns);
        
        // Assuming CSV structure: name;;address;;address2;;zipcode;;city;;phone;;email
        if (columns.length >= 1 && columns[0]) {
          const company: InsuranceCompanyRow = {
            name: columns[0] || '',
            address: columns[1] || '',
            address2: columns[2] || '',
            zipcode: columns[3] || '',
            city: columns[4] || '',
            phone: columns[5] || '',
            email: columns[6] || '',
          };
          
          console.log(`Parsed company:`, company);
          processedCompanies.push(company);
        }
      } catch (error) {
        console.error(`Error processing line ${i + 2}:`, error);
        errors.push(`Line ${i + 2}: ${error.message}`);
      }
    }

    console.log(`Parsed ${processedCompanies.length} companies from CSV`);

    // Update database
    let updatedCount = 0;
    let insertedCount = 0;

    for (const company of processedCompanies) {
      try {
        // Check if company already exists
        const { data: existingCompany, error: selectError } = await supabase
          .from('insurance_companies')
          .select('id, name, address, address2, zipcode, city, phone, email')
          .eq('name', company.name)
          .single();

        if (selectError && selectError.code !== 'PGRST116') {
          console.error('Error checking existing company:', selectError);
          errors.push(`Error checking ${company.name}: ${selectError.message}`);
          continue;
        }

        if (existingCompany) {
          // Check if any fields need updating
          const needsUpdate = 
            existingCompany.address !== company.address ||
            existingCompany.address2 !== company.address2 ||
            existingCompany.zipcode !== company.zipcode ||
            existingCompany.city !== company.city ||
            existingCompany.phone !== company.phone ||
            existingCompany.email !== company.email;

          if (needsUpdate) {
            // Update existing company
            const { error: updateError } = await supabase
              .from('insurance_companies')
              .update({
                address: company.address,
                address2: company.address2,
                zipcode: company.zipcode,
                city: company.city,
                phone: company.phone,
                email: company.email,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingCompany.id);

            if (updateError) {
              console.error('Error updating company:', updateError);
              errors.push(`Error updating ${company.name}: ${updateError.message}`);
            } else {
              updatedCount++;
              console.log(`Updated company: ${company.name}`);
            }
          }
        } else {
          // Insert new company
          const { error: insertError } = await supabase
            .from('insurance_companies')
            .insert({
              name: company.name,
              address: company.address,
              address2: company.address2,
              zipcode: company.zipcode,
              city: company.city,
              phone: company.phone,
              email: company.email
            });

          if (insertError) {
            console.error('Error inserting company:', insertError);
            errors.push(`Error inserting ${company.name}: ${insertError.message}`);
          } else {
            insertedCount++;
            console.log(`Inserted new company: ${company.name}`);
          }
        }
      } catch (error) {
        console.error(`Error processing company ${company.name}:`, error);
        errors.push(`Error processing ${company.name}: ${error.message}`);
      }
    }

    const result = {
      success: true,
      message: `Sync completed: ${insertedCount} inserted, ${updatedCount} updated`,
      stats: {
        totalProcessed: processedCompanies.length,
        inserted: insertedCount,
        updated: updatedCount,
        errors: errors.length
      },
      errors: errors.length > 0 ? errors : undefined
    };

    console.log('Sync completed:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in sync function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});