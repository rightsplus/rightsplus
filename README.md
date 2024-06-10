# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.



# SQL
```sql
-- Policy for allowing read access to the public
CREATE POLICY "allow_read_for_public" 
ON "public"."booking" 
FOR SELECT 
TO PUBLIC 
USING (true);

-- Policy for allowing insert access to the public
CREATE POLICY "allow_insert_for_public" 
ON "public"."booking" 
FOR INSERT 
TO PUBLIC 
WITH CHECK (true);

-- Policy for allowing all actions for admins
CREATE POLICY "allow_all_for_admins" 
ON "public"."booking" 
FOR ALL 
TO admins 
USING (true);
```