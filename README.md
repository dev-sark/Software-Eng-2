# Timetable AI App

A Next.js application that uses AI to process and manage timetables, with Supabase integration for database and authentication.

## Features

- File upload handling for timetable images/PDFs
- OCR processing for text extraction
- NLP processing for schedule parsing
- Database storage with Supabase
- User authentication
- Calendar integration (upcoming)

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Supabase (Database & Auth)
- Tailwind CSS

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/timetable-ai-app.git
cd timetable-ai-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the development server:
```bash
npm run dev
```

5. Setup the database:
- Visit `http://localhost:3000/setup`
- Click "Setup Database" to create tables and policies
- Visit `http://localhost:3000/test-data` to insert test data
- Visit `http://localhost:3000/dashboard` to view and manage data

## Project Structure

```
timetable-ai-app/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── setup/            # Database setup page
│   └── test-data/        # Test data insertion page
├── lib/                   # Shared libraries
│   ├── supabase.ts       # Supabase client
│   ├── database.ts       # Database utilities
│   └── auth.ts           # Authentication utilities
├── types/                 # TypeScript type definitions
└── utils/                # Utility functions
```

## API Routes

- `POST /api/upload` - Handle file uploads
- `POST /api/ocr` - Process images with OCR
- `POST /api/nlp` - Parse text with NLP
- `GET /api/test-connection` - Test database connection
- `POST /api/test-data` - Insert test data
- `POST /api/setup-db` - Setup database tables and policies

## Database Schema

### Timetables Table
```sql
CREATE TABLE timetables (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
```

### Class Schedules Table
```sql
CREATE TABLE class_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  timetable_id UUID NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
  course_name TEXT NOT NULL,
  day TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  venue TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
