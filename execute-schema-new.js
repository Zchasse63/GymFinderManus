const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = 'https://ntthbfdaijwdqgxzugpi.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dGhiZmRhaWp3ZHFneHp1Z3BpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzcwODQxOSwiZXhwIjoyMDU5Mjg0NDE5fQ.qUf3MX8MHj4YEOiHR9vjli09p4OlbJF1as3QyCm6xzg';

// Read the SQL file
const schemaFilePath = path.join(__dirname, 'src', 'lib', 'supabase-schema.sql');
const sqlContent = fs.readFileSync(schemaFilePath, 'utf8');

// Execute the entire SQL script at once
async function executeFullScript() {
  console.log('Executing SQL schema creation with new credentials...');
  
  try {
    // Execute the full SQL script
    const response = await fetch(`${supabaseUrl}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: sqlContent
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SQL execution failed: ${errorText}`);
    }

    console.log('SQL schema created successfully!');
    return true;
  } catch (error) {
    console.error('Error executing SQL schema:', error.message);
    return false;
  }
}

// Run the script
executeFullScript().then(success => {
  if (success) {
    console.log('Database schema creation completed successfully!');
  } else {
    console.error('Database schema creation failed.');
  }
}).catch(error => {
  console.error('Script execution failed:', error);
});
