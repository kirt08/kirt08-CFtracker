import postgres from "postgres"

for (const name of ["DATABASE_URL", "MIGRATION_DATABASE_URL"]) {
    const sql = postgres(process.env[name]!, { prepare: false, max: 1 })
    const [row] = await sql`select current_user, version()`
    console.log(`${name}: OK as ${row.current_user}`)
    console.log(`  ${row.version}`)
    await sql.end()
}
