import os
import logging
import json
import asyncio
from aiohttp import web
from aiogram import Bot, Dispatcher, types
from aiogram.types import WebAppInfo
from aiogram.filters import Command
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
API_TOKEN = os.getenv('BOT_TOKEN')
# Render provides the PORT environment variable. Default to 8080 if not set.
PORT = int(os.getenv('PORT', 8080))

# If on Render, get the generic URL, otherwise use localhost for testing
RENDER_EXTERNAL_URL = os.getenv('RENDER_EXTERNAL_URL') # Auto-set by Render
if RENDER_EXTERNAL_URL:
    WEBAPP_URL = f"{RENDER_EXTERNAL_URL}/index.html"
else:
    WEBAPP_URL = os.getenv('WEBAPP_URL', f'http://localhost:{PORT}/index.html')

# Logging
logging.basicConfig(level=logging.INFO)

# Initialize Bot and Dispatcher
if not API_TOKEN:
    print("Error: BOT_TOKEN is missing in .env!")
    exit(1)

bot = Bot(token=API_TOKEN)
dp = Dispatcher()

# --- Bot Handlers ---
@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    markup = types.ReplyKeyboardMarkup(
        keyboard=[
            [
                types.KeyboardButton(
                    text="🛍 Do'konni ochish", 
                    web_app=WebAppInfo(url=WEBAPP_URL)
                )
            ]
        ],
        resize_keyboard=True
    )
    await message.answer(
        "Assalomu alaykum! Bizning Premium Do'konimizga xush kelibsiz.",
        reply_markup=markup
    )

@dp.message(lambda message: message.web_app_data)
async def handle_webapp_data(message: types.Message):
    try:
        data = json.loads(message.web_app_data.data)
        text = "📦 **Yangi Buyurtma!**\n\n"
        for product_id, quantity in data.items():
            text += f"🆔 Mahsulot ID: {product_id}, Soni: {quantity}\n"
        await message.answer(f"{text}\n✅ Buyurtma qabul qilindi!", parse_mode="Markdown")
    except Exception as e:
        logging.error(f"Error: {e}")

# --- Web Server Handlers ---
async def index_handler(request):
    return web.FileResponse('./index.html')

async def style_handler(request):
    return web.FileResponse('./style.css')

async def script_handler(request):
    return web.FileResponse('./script.js')

# --- Main App Setup ---
async def on_startup(app):
    # Start polling in background
    # Note: In production with high load, webhooks are better, 
    # but polling is easier for setup and works fine for small apps.
    asyncio.create_task(dp.start_polling(bot))

def main():
    app = web.Application()
    
    # Static file routes
    app.router.add_get('/', index_handler)
    app.router.add_get('/index.html', index_handler)
    app.router.add_get('/style.css', style_handler)
    app.router.add_get('/script.js', script_handler)
    
    # Serve static assets folder
    # Verify assets folder exists first to avoid error
    if os.path.exists('./assets'):
        app.router.add_static('/assets', './assets')
    
    # Start bot in background when app starts
    app.on_startup.append(on_startup)
    
    # Start the web server
    print(f"Starting server on port {PORT}...")
    print(f"WebApp URL: {WEBAPP_URL}")
    web.run_app(app, port=PORT)

if __name__ == '__main__':
    main()
