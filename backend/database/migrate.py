from termcolor import cprint
import psycopg2
from dotenv import load_dotenv
import os
import glob
from termcolor import colored

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
MIGRATION_DIR = os.path.join(os.path.dirname(__file__), "migrations")

def get_connection():
    return psycopg2.connect(DATABASE_URL)

def ensure_migrations_table(conn):
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version VARCHAR(255) PRIMARY KEY,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
        """)

    conn.commit()

def applied_versions(conn) -> set:
    with conn.cursor() as cur:
        cur.execute("SELECT version FROM schema_migrations;")
        return {row[0] for row in cur.fetchall()}

def run_migrations():
    conn = get_connection()
    try:
        ensure_migrations_table(conn)
        done = applied_versions(conn)

        pattern = os.path.join(MIGRATION_DIR, "*.sql")
        files = sorted(glob.glob(pattern))

        if not files:
            print(colored(f"No migration files found in {MIGRATION_DIR}", "red"))
            return
        
        pending = [f for f in files if os.path.basename(f) not in done]

        if not pending:
            print(colored("All migrations are already applied", "blue"))
            return
        
        for filepath in pending:
            version = os.path.basename(filepath)
            cprint(f"Applying {version} ...", "yellow", end=" ", attrs=["italic"] )

            with open(filepath, "r") as fh:
                sql = fh.read()

            with conn.cursor() as cur:
                cur.execute(sql)
                cur.execute(
                    "INSERT INTO schema_migrations (version) VALUES (%s);",
                    (version,)
                )
            conn.commit()
            print(colored(f"\n{version} done.", "blue", attrs=["italic"]))

        print(colored(f"\n{len(pending)} migration(s) applied successfully.", "green", attrs=["bold"]))
    except Exception as error:
        conn.rollback()
        print(colored(f"\nMigration failed: {error}", "red"))
    finally:
        conn.close()

if __name__ == "__main__":
    run_migrations()