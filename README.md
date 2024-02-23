# Laravel Contact Profiles
## Composer Installation
To download & install all dependenies that use in project.  
> 1. Visit https://getcomposer.org/doc/00-intro.md#installation-windows  
> 2. Download installer for windows.  
> 3. Install
> 4. Continue to step below.

# Deploy Laravel Project with ReactJS Frontend (Development Mode)

## Step 1: Clone the Repository

```bash
git clone https://github.com/Dzyfhuba/contact-profiles.git your-project-name
```

Replace `your-project-name` with the desired name for your Laravel project.

## Step 2: Install Dependencies

```bash
cd your-project-name
composer install
npm install
```

## Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit the `.env` file to configure your database connection and other settings.

## Step 4: Generate Application Key

```bash
php artisan key:generate
```

## Step 5: Run Migrations

```bash
php artisan migrate
```

## Step 6: Compile Assets for Production

```bash
npm run build
```

This command will optimize and minify the assets for production.

## Step 7: Start the Development Server

If you're using PHP's built-in server for development:

```bash
php artisan serve
```