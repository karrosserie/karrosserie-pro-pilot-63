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

    // Check if there's at least one entry older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: oldEntries, error: checkError } = await supabase
      .from('insurance_companies')
      .select('id, updated_at')
      .lt('updated_at', sevenDaysAgo.toISOString())
      .limit(1);

    if (checkError) {
      console.error('Error checking for old entries:', checkError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Error checking database entries: ' + checkError.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    if (!oldEntries || oldEntries.length === 0) {
      console.log('No entries older than 7 days found, skipping sync');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Sync skipped: No entries older than 7 days found',
        stats: {
          totalProcessed: 0,
          inserted: 0,
          updated: 0,
          errors: 0
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log(`Found ${oldEntries.length} entries older than 7 days, proceeding with sync...`);

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
        // Split by single semicolon since that's the CSV format
        const columns = line.split(';').map(col => col.trim());
        
        console.log(`Processing line ${i + 2}: ${line}`);
        console.log(`Columns:`, columns);
        
        // CSV structure: name;fonction_service;address;address2;zipcode;city;phone;email
        // We ignore the "fonction_service" column (index 1)
        if (columns.length >= 8 && columns[0]) {
          const company: InsuranceCompanyRow = {
            name: columns[0] || '',
            address: columns[2] || '',
            address2: columns[3] || '',
            zipcode: columns[4] || '',
            city: columns[5] || '',
            phone: columns[6] || '',
            email: columns[7] || '',
          };
          
          console.log(`Parsed company:`, company);
          processedCompanies.push(company);
        }
      } catch (error) {
        console.error(`Error processing line ${i + 2}:`, error);
        errors.push(`Line ${i + 2}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    console.log(`Parsed ${processedCompanies.length} companies from CSV`);

    // Update database
    let insertedCount = 0;
    let updatedCount = 0;
    
    for (const company of processedCompanies) {
      try {
        // Check if company already exists
        const { data: existingCompany } = await supabase
          .from('insurance_companies')
          .select('id')
          .eq('name', company.name)
          .single();

        if (existingCompany) {
          // Update existing company
          const { error: updateError } = await supabase
            .from('insurance_companies')
            .update({
              address: company.address,
              phone: company.phone,
              email: company.email,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingCompany.id);

          if (updateError) {
            console.error(`Error updating company ${company.name}:`, updateError);
            errors.push(`Error updating ${company.name}: ${updateError.message}`);
          } else {
            updatedCount++;
            console.log(`Updated existing company: ${company.name}`);
          }
        } else {
          // Insert new company
          const { error: insertError } = await supabase
            .from('insurance_companies')
            .insert({
              name: company.name,
              address: company.address,
              phone: company.phone,
              email: company.email
            });

          if (insertError) {
            console.error(`Error inserting company ${company.name}:`, insertError);
            errors.push(`Error inserting ${company.name}: ${insertError.message}`);
          } else {
            insertedCount++;
            console.log(`Inserted new company: ${company.name}`);
          }
        }
      } catch (error) {
        console.error(`Error processing company ${company.name}:`, error);
        errors.push(`Error processing ${company.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    const result = {
      success: true,
      message: `Synchronization completed. Inserted: ${insertedCount}, Updated: ${updatedCount}`,
      inserted: insertedCount,
      updated: updatedCount,
      errors: errors.length > 0 ? errors : undefined
    };

    console.log('Sync result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in sync function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});