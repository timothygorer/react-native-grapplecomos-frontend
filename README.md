The app GrappleCosmos is for journaling your thoughts. It sorts thoughts by date so that you can go back in time to see what thoughts you had that day. Thoughts are stored in a PostgresSQL instance (Supabase). Auth is via Supabase too.

Written in React Native (Expo). Using several files from [minds.com's](https://github.com/Minds/mobile-native) React Native app in the codebase.

[Demo](https://youtu.be/W6HWchKgbKI)

```How to Install```

1. Make sure to have Expo installed.
2. Create a Supabase project: supabase.com
3. Please check out the companion backend [here](https://github.com/timothygorer/grapplecosmos-backend), read its readme, and run the postgres migration files so that your Supabase instance gets updated.

Create a .env with:

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

```

1. ```yarn install```
2. ```npx expo start```


   
