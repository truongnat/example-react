# Scripts Documentation

This directory contains utility scripts for the server-ts application.

## Available Scripts

### 🌱 Demo Data Seeder (`seed-demo-data.ts`)

Seeds the database with demo user and sample todos for testing and demonstration purposes.

#### Usage

From the root directory:
```bash
# Seed demo data (skip if user already exists)
pnpm run seed:demo

# Force recreate demo data (removes existing user first)
pnpm run seed:demo:force
```

From the server-ts directory:
```bash
# Seed demo data
pnpm run seed:demo

# Force recreate demo data
pnpm run seed:demo:force
```

#### What gets created

**Demo User:**
- **Email:** `john@example.com`
- **Password:** `Password123`
- **Username:** `john`
- **Avatar:** Auto-generated avatar

**Sample Todos (10 items):**
1. 🚀 Welcome to Todo App (initial)
2. 📝 Learn the Todo Workflow (todo)
3. 🎯 Set Up Your Workspace (doing)
4. 🔍 Review App Features (review) - *demonstrates valid status transitions*
5. ✅ Complete Your First Task (done) - *demonstrates workflow: initial → todo → doing → done*
6. 📚 Read Documentation (keeping)
7. 🎨 Customize Your Experience (initial)
8. 🔧 Test API Endpoints (todo)
9. 🌟 Share Your Feedback (initial)
10. 🚀 Deploy Your Own Instance (cancelled)

#### Features

- **Smart Status Transitions:** Respects the todo workflow validation rules
- **Idempotent:** Won't create duplicate users unless forced
- **Comprehensive:** Creates realistic demo data for all todo statuses
- **Safe:** Uses proper error handling and database transactions

#### Status Workflow

The script demonstrates the valid todo status transitions:

```
INITIAL → TODO, DOING, KEEPING, CANCELLED
TODO → DOING, REVIEW, DONE, KEEPING, CANCELLED  
DOING → TODO, REVIEW, DONE, KEEPING, CANCELLED
REVIEW → TODO, DOING, DONE, KEEPING, CANCELLED
DONE → KEEPING, TODO, DOING
KEEPING → TODO, DOING, DONE
CANCELLED → TODO, DOING, INITIAL
```

#### Options

- `--force` or `-f`: Force recreate demo data (removes existing user first)
- `--help` or `-h`: Show help message

#### Examples

```bash
# Basic seeding
pnpm run seed:demo

# Force recreate (useful for development)
pnpm run seed:demo:force

# Show help
pnpm run seed:demo --help
```

#### Technical Details

- **Database:** Works with SQLite (default), PostgreSQL, Supabase, and MongoDB
- **Password Hashing:** Uses bcrypt for secure password storage
- **Entity Validation:** Respects all domain entity business rules
- **TypeScript:** Fully typed with proper error handling
- **Path Mapping:** Uses TypeScript path mapping for clean imports

#### Development

The script is located at `server-ts/scripts/seed-demo-data.ts` and uses:

- **TypeScript:** For type safety and modern JavaScript features
- **ts-node:** For direct TypeScript execution
- **Path Mapping:** Custom tsconfig.json for script-specific configuration
- **Domain Entities:** Uses the same entities as the main application
- **Repository Pattern:** Leverages existing repository implementations

#### Troubleshooting

**Module Resolution Issues:**
- The script uses a custom `tsconfig.json` in the scripts directory
- Ensure `tsconfig-paths` is installed: `pnpm add -D tsconfig-paths`

**Database Connection Issues:**
- Ensure the database is properly configured in `.env`
- Check that the database directory exists and is writable

**Status Transition Errors:**
- The script respects todo workflow rules
- Invalid transitions will throw descriptive errors

#### Integration

This script integrates seamlessly with:
- Development workflow
- Testing environments  
- CI/CD pipelines
- Demo environments

Perfect for:
- New developer onboarding
- Feature demonstrations
- Testing with realistic data
- API documentation examples
