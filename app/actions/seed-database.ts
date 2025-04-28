import { sql } from "@/lib/db"

// Let's simplify the seeding process and remove the table existence check since we're now dropping and recreating tables

export async function seedDatabase() {
  try {
    console.log("Starting database seeding process...")

    // Verify the schema before seeding
    try {
      console.log("Verifying database schema...")
      const columnsResult = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'agents'
      `

      // Log all columns in the agents table
      const columns = Array.isArray(columnsResult)
        ? columnsResult.map((col) => col.column_name)
        : columnsResult.rows.map((col) => col.column_name)

      console.log("Agents table columns:", columns)

      // Check for required columns
      const requiredColumns = ["firm_name", "linked_b2b_partner_firm_name"]
      const missingColumns = requiredColumns.filter((col) => !columns.includes(col))

      if (missingColumns.length > 0) {
        console.error(`Missing columns in agents table: ${missingColumns.join(", ")}`)
        return {
          success: false,
          message: `Database schema is missing columns: ${missingColumns.join(", ")}. Please reinitialize the database.`,
        }
      }
    } catch (error) {
      console.error("Error verifying schema:", error)
      return {
        success: false,
        message: "Error verifying database schema. Please initialize the database first.",
      }
    }

    console.log("Inserting firms data...")
    // Insert firms without specifying IDs
    const firmsResult = await sql`
      INSERT INTO firms (firm_name, firm_external_id, email, tin, firm_npn, status, address)
      VALUES 
        ('Acme Financial Services', 'AFS-001', 'contact@acmefinancial.com', '12-3456789', '1234567', 'Active', '123 Main St, San Francisco, CA 94105'),
        ('Global Advisors Inc', 'GAI-002', 'info@globaladvisors.com', '98-7654321', '7654321', 'Active', '456 Park Ave, New York, NY 10022'),
        ('Premier Financial Group', 'PFG-003', 'contact@premierfinancial.com', '45-6789123', '9876543', 'Review', '789 Oak St, Austin, TX 78701'),
        ('Elite Insurance Partners', 'EIP-004', 'support@eliteinsurance.com', '78-9123456', '8765432', 'Inactive', '987 Palm Dr, Miami, FL 33139'),
        ('Cornerstone Wealth Management', 'CWM-005', 'info@cornerstonewealth.com', '32-1654987', '5432167', 'Active', '456 Michigan Ave, Chicago, IL 60611')
      RETURNING firm_id, firm_name
    `
    console.log(`Inserted firms. Result:`, JSON.stringify(firmsResult))

    // Map firm names to IDs
    const firmMap = new Map()

    // Handle case where result is an array directly
    if (Array.isArray(firmsResult)) {
      for (const firm of firmsResult) {
        if (firm && firm.firm_name && firm.firm_id) {
          firmMap.set(firm.firm_name, firm.firm_id)
          console.log(`Mapped firm: ${firm.firm_name} -> ID: ${firm.firm_id}`)
        }
      }
    }
    // Handle case where result has a rows property
    else if (firmsResult?.rows) {
      for (const firm of firmsResult.rows) {
        if (firm && firm.firm_name && firm.firm_id) {
          firmMap.set(firm.firm_name, firm.firm_id)
          console.log(`Mapped firm: ${firm.firm_name} -> ID: ${firm.firm_id}`)
        }
      }
    } else {
      console.error("No firms were inserted or returned")
      return {
        success: false,
        message: "Failed to insert firms data",
      }
    }

    console.log("Inserting advisor firms data...")
    // Insert advisor firms
    const advisorFirmsResult = await sql`
      INSERT INTO advisor_firms (advisor_firm_name, firm_external_id, linked_b2b_partner_firm_id, primary_contact_name, primary_contact_email, phone, address, advisors_count, status, portal_access_status)
      VALUES 
        ('Wealth Advisors Group', 'WAG-001', ${firmMap.get("Acme Financial Services")}, 'Robert Johnson', 'robert.johnson@wealthadvisors.com', '555-123-7890', '789 Wealth Ave, Boston, MA 02110', 12, 'Active', 'Enabled'),
        ('Financial Freedom Partners', 'FFP-002', ${firmMap.get("Global Advisors Inc")}, 'Jennifer Williams', 'jennifer@financialfreedom.com', '555-456-7890', '456 Liberty St, Chicago, IL 60601', 8, 'Active', 'Enabled'),
        ('Retirement Planning Specialists', 'RPS-003', ${firmMap.get("Premier Financial Group")}, 'Michael Thompson', 'michael@retirementplanning.com', '555-789-1234', '123 Retirement Rd, Phoenix, AZ 85001', 5, 'Review', 'Pending'),
        ('Secure Investments LLC', 'SI-004', ${firmMap.get("Elite Insurance Partners")}, 'Lisa Rodriguez', 'lisa@secureinvestments.com', '555-234-5678', '567 Security Blvd, Denver, CO 80202', 3, 'Inactive', 'Disabled'),
        ('Future Planning Associates', 'FPA-005', ${firmMap.get("Cornerstone Wealth Management")}, 'David Chen', 'david@futureplanning.com', '555-876-5432', '890 Future Dr, Seattle, WA 98101', 7, 'Active', 'Enabled')
      RETURNING advisor_firm_id, advisor_firm_name
    `
    console.log(`Inserted advisor firms. Result:`, JSON.stringify(advisorFirmsResult))

    // Map advisor firm names to IDs
    const advisorFirmMap = new Map()

    // Handle case where result is an array directly
    if (Array.isArray(advisorFirmsResult)) {
      for (const advisorFirm of advisorFirmsResult) {
        if (advisorFirm && advisorFirm.advisor_firm_name && advisorFirm.advisor_firm_id) {
          advisorFirmMap.set(advisorFirm.advisor_firm_name, advisorFirm.advisor_firm_id)
        }
      }
    }
    // Handle case where result has a rows property
    else if (advisorFirmsResult?.rows) {
      for (const advisorFirm of advisorFirmsResult.rows) {
        if (advisorFirm && advisorFirm.advisor_firm_name && advisorFirm.advisor_firm_id) {
          advisorFirmMap.set(advisorFirm.advisor_firm_name, advisorFirm.advisor_firm_id)
        }
      }
    }

    console.log("Inserting agents data...")
    // Insert agents
    const agentsResult = await sql`
      INSERT INTO agents (agent_name, agent_external_id, npn, email, resident_state, firm_id, firm_name, status, phone, residential_address, business_address, aml_expiry_date, eo_expiry_date, appointment_status, linked_b2b_partner_firm_name, portal_access_status, portal_account_creation_date, last_login_date)
      VALUES 
        ('John Smith', 'JS-001', '12345678', 'john.smith@example.com', 'CA', ${firmMap.get("Acme Financial Services")}, 'Acme Financial Services', 'Active', '555-123-4567', '123 Main St, San Francisco, CA 94105', '456 Market St, San Francisco, CA 94105', '2024-12-31', '2024-10-15', 'Approved', 'Acme Financial Services', 'Active', '2023-06-15', '2024-04-10'),
        ('Sarah Johnson', 'SJ-002', '87654321', 'sarah.johnson@example.com', 'NY', ${firmMap.get("Global Advisors Inc")}, 'Global Advisors Inc', 'Active', '555-987-6543', '789 Broadway, New York, NY 10003', '101 Park Ave, New York, NY 10178', '2025-03-15', '2024-08-22', 'Approved', 'Global Advisors Inc', 'Active', '2023-07-20', '2024-04-12'),
        ('Michael Brown', 'MB-003', '23456789', 'michael.brown@example.com', 'TX', ${firmMap.get("Premier Financial Group")}, 'Premier Financial Group', 'Pending', '555-456-7890', '321 Oak St, Austin, TX 78701', '555 Congress Ave, Austin, TX 78701', '2024-11-10', '2024-09-30', 'Pending', 'Premier Financial Group', 'Pending', '2024-03-10', NULL),
        ('Emily Davis', 'ED-004', '34567890', 'emily.davis@example.com', 'FL', ${firmMap.get("Elite Insurance Partners")}, 'Elite Insurance Partners', 'Inactive', '555-789-0123', '987 Palm Dr, Miami, FL 33139', '888 Biscayne Blvd, Miami, FL 33132', '2024-08-05', '2024-07-15', 'Expired', 'Elite Insurance Partners', 'Inactive', '2023-05-05', '2023-11-15'),
        ('David Wilson', 'DW-005', '45678901', 'david.wilson@example.com', 'IL', ${firmMap.get("Cornerstone Wealth Management")}, 'Cornerstone Wealth Management', 'Active', '555-234-5678', '456 Michigan Ave, Chicago, IL 60611', '233 S Wacker Dr, Chicago, IL 60606', '2025-01-20', '2024-11-05', 'Approved', 'Cornerstone Wealth Management', 'Active', '2023-09-12', '2024-04-08')
      RETURNING agent_id, agent_name
    `
    console.log(`Inserted agents. Result:`, JSON.stringify(agentsResult))

    // Map agent names to IDs
    const agentMap = new Map()

    // Handle case where result is an array directly
    if (Array.isArray(agentsResult)) {
      for (const agent of agentsResult) {
        if (agent && agent.agent_name && agent.agent_id) {
          agentMap.set(agent.agent_name, agent.agent_id)
        }
      }
    }
    // Handle case where result has a rows property
    else if (agentsResult?.rows) {
      for (const agent of agentsResult.rows) {
        if (agent && agent.agent_name && agent.agent_id) {
          agentMap.set(agent.agent_name, agent.agent_id)
        }
      }
    }

    console.log("Inserting advisors data...")
    // Insert advisors
    const advisorsResult = await sql`
      INSERT INTO advisors (advisor_name, advisor_firm_id, email, phone, portal_access_status, portal_account_creation_date, last_login_date, status)
      VALUES 
        ('James Wilson', ${advisorFirmMap.get("Wealth Advisors Group")}, 'james.wilson@wealthadvisors.com', '555-111-2222', 'Active', '2023-06-15', '2024-04-10', 'Active'),
        ('Maria Garcia', ${advisorFirmMap.get("Wealth Advisors Group")}, 'maria.garcia@wealthadvisors.com', '555-222-3333', 'Active', '2023-07-20', '2024-04-12', 'Active'),
        ('Thomas Lee', ${advisorFirmMap.get("Financial Freedom Partners")}, 'thomas.lee@financialfreedom.com', '555-333-4444', 'Pending', '2024-03-10', NULL, 'Pending'),
        ('Sophia Martinez', ${advisorFirmMap.get("Retirement Planning Specialists")}, 'sophia.martinez@retirementplanning.com', '555-444-5555', 'Inactive', '2023-05-05', '2023-11-15', 'Inactive'),
        ('Daniel Kim', ${advisorFirmMap.get("Future Planning Associates")}, 'daniel.kim@futureplanning.com', '555-555-6666', 'Active', '2023-09-12', '2024-04-08', 'Active')
    `
    console.log(`Inserted advisors. Result:`, JSON.stringify(advisorsResult))

    console.log("Inserting licenses data...")
    // Insert licenses
    const licensesResult = await sql`
      INSERT INTO licenses (agent_id, agent_name, firm_id, firm_name, license_state, license_expiration_date, status, actionable_alerts)
      VALUES 
        (${agentMap.get("John Smith")}, 'John Smith', ${firmMap.get("Acme Financial Services")}, 'Acme Financial Services', 'CA', '2024-12-31', 'Approved', NULL),
        (${agentMap.get("Sarah Johnson")}, 'Sarah Johnson', ${firmMap.get("Global Advisors Inc")}, 'Global Advisors Inc', 'NY', '2024-08-15', 'Approved', 'Renew'),
        (${agentMap.get("Michael Brown")}, 'Michael Brown', ${firmMap.get("Premier Financial Group")}, 'Premier Financial Group', 'TX', '2024-11-10', 'Pending', NULL),
        (${agentMap.get("Emily Davis")}, 'Emily Davis', ${firmMap.get("Elite Insurance Partners")}, 'Elite Insurance Partners', 'FL', '2024-07-05', 'Expired', 'Complete Appointment'),
        (${agentMap.get("David Wilson")}, 'David Wilson', ${firmMap.get("Cornerstone Wealth Management")}, 'Cornerstone Wealth Management', 'IL', '2025-01-20', 'Approved', NULL)
    `
    console.log(`Inserted licenses. Result:`, JSON.stringify(licensesResult))

    console.log("Inserting state licenses data...")
    // Insert state licenses
    const stateLicensesResult = await sql`
      INSERT INTO state_licenses (agent_id, state, status, expiration_date, appointment_status)
      VALUES 
        (${agentMap.get("John Smith")}, 'CA', 'Active', '2024-12-31', 'Appointed'),
        (${agentMap.get("John Smith")}, 'NY', 'Active', '2024-10-15', 'Appointed'),
        (${agentMap.get("John Smith")}, 'TX', 'Active', '2024-11-20', 'Appointed'),
        (${agentMap.get("John Smith")}, 'FL', 'Pending', NULL, 'Pending'),
        (${agentMap.get("John Smith")}, 'IL', 'Not Appointed', NULL, 'Not Appointed'),
        (${agentMap.get("Sarah Johnson")}, 'NY', 'Active', '2025-03-15', 'Appointed'),
        (${agentMap.get("Sarah Johnson")}, 'NJ', 'Active', '2025-02-10', 'Appointed'),
        (${agentMap.get("Sarah Johnson")}, 'CT', 'Active', '2025-01-20', 'Appointed'),
        (${agentMap.get("Sarah Johnson")}, 'PA', 'Pending', NULL, 'Pending'),
        (${agentMap.get("Sarah Johnson")}, 'MA', 'Not Appointed', NULL, 'Not Appointed')
    `
    console.log(`Inserted state licenses. Result:`, JSON.stringify(stateLicensesResult))

    console.log("Database seeded successfully")
    return { success: true, message: "Database seeded successfully" }
  } catch (error) {
    console.error("Error seeding database:", error)
    return {
      success: false,
      message: `Failed to seed database: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
