"use server"

import { sql } from "@/lib/db"

export async function initDatabase() {
  try {
    console.log("Initializing database...")

    // Drop existing tables in reverse order of dependencies
    console.log("Dropping existing tables if they exist...")
    await sql`DROP TABLE IF EXISTS state_licenses CASCADE`
    await sql`DROP TABLE IF EXISTS licenses CASCADE`
    await sql`DROP TABLE IF EXISTS advisors CASCADE`
    await sql`DROP TABLE IF EXISTS agents CASCADE`
    await sql`DROP TABLE IF EXISTS advisor_firms CASCADE`
    await sql`DROP TABLE IF EXISTS firms CASCADE`

    console.log("All tables dropped. Creating new tables...")

    // Create firms table
    await sql`
      CREATE TABLE firms (
        firm_id SERIAL PRIMARY KEY,
        firm_name VARCHAR(255) NOT NULL,
        firm_external_id VARCHAR(50),
        email VARCHAR(255),
        tin VARCHAR(20),
        firm_npn VARCHAR(20),
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("Created firms table")

    // Create advisor_firms table
    await sql`
      CREATE TABLE advisor_firms (
        advisor_firm_id SERIAL PRIMARY KEY,
        advisor_firm_name VARCHAR(255) NOT NULL,
        firm_external_id VARCHAR(50),
        linked_b2b_partner_firm_id INTEGER REFERENCES firms(firm_id),
        primary_contact_name VARCHAR(255),
        primary_contact_email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        advisors_count INTEGER DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        portal_access_status VARCHAR(50) DEFAULT 'Enabled',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("Created advisor_firms table")

    // Create agents table
    await sql`
      CREATE TABLE agents (
        agent_id SERIAL PRIMARY KEY,
        agent_name VARCHAR(255) NOT NULL,
        agent_external_id VARCHAR(50),
        npn VARCHAR(20),
        email VARCHAR(255),
        resident_state VARCHAR(2),
        firm_id INTEGER REFERENCES firms(firm_id),
        firm_name VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        phone VARCHAR(50),
        residential_address TEXT,
        business_address TEXT,
        aml_expiry_date DATE,
        eo_expiry_date DATE,
        appointment_status VARCHAR(50) DEFAULT 'Pending',
        linked_b2b_partner_firm_name VARCHAR(255),
        portal_access_status VARCHAR(50) DEFAULT 'Pending',
        portal_account_creation_date TIMESTAMP WITH TIME ZONE,
        last_login_date TIMESTAMP WITH TIME ZONE,
        pst_completion_date DATE,
        at_status VARCHAR(50) DEFAULT 'Not Started',
        bit_status VARCHAR(50) DEFAULT 'Not Started',
        background_check_status VARCHAR(50) DEFAULT 'Not Started',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("Created agents table")

    // Create advisors table
    await sql`
      CREATE TABLE advisors (
        advisor_id SERIAL PRIMARY KEY,
        advisor_name VARCHAR(255) NOT NULL,
        advisor_firm_id INTEGER REFERENCES advisor_firms(advisor_firm_id),
        email VARCHAR(255),
        phone VARCHAR(50),
        portal_access_status VARCHAR(50) DEFAULT 'Pending',
        portal_account_creation_date TIMESTAMP WITH TIME ZONE,
        last_login_date TIMESTAMP WITH TIME ZONE,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("Created advisors table")

    // Create licenses table
    await sql`
      CREATE TABLE licenses (
        license_id SERIAL PRIMARY KEY,
        agent_id INTEGER REFERENCES agents(agent_id),
        agent_name VARCHAR(255),
        firm_id INTEGER REFERENCES firms(firm_id),
        firm_name VARCHAR(255),
        license_state VARCHAR(2) NOT NULL,
        license_expiration_date DATE,
        status VARCHAR(50) NOT NULL DEFAULT 'Pending',
        actionable_alerts VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `
    console.log("Created licenses table")

    // Create state_licenses table
    await sql`
      CREATE TABLE state_licenses (
        id SERIAL PRIMARY KEY,
        agent_id INTEGER REFERENCES agents(agent_id),
        state VARCHAR(2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Not Appointed',
        expiration_date DATE,
        appointment_status VARCHAR(50) DEFAULT 'Not Appointed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(agent_id, state)
      )
    `
    console.log("Created state_licenses table")

    console.log("Database initialization completed successfully")
    return { success: true, message: "Database initialized successfully" }
  } catch (error) {
    console.error("Error initializing database:", error)
    return {
      success: false,
      message: `Failed to initialize database: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
