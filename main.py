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

ADMIN_ID = os.getenv("ADMIN_ID")

# Product Data (Must match script.js for correct pricing/names)
PRODUCTS = {
    "1": {"name": "Simsiz Quloqchin (Oddiy)", "price": 95000},
    "2": {"name": "Fitnes Braslet M6", "price": 120000},
    "3": {"name": "Telefon G'ilofi (Chexol)", "price": 35000},
    "4": {"name": "USB Kabel (Type-C)", "price": 25000},
    "5": {"name": "Quyosh Ko'zoynagi", "price": 60000},
    "6": {"name": "Ryukzak (Maktab uchun)", "price": 185000}
}

@dp.message(lambda message: message.web_app_data)
async def handle_webapp_data(message: types.Message):
    try:
        data = json.loads(message.web_app_data.data)
        
        # 1. Extract Data
        cart = data.get('cart', {})
        user_info = data.get('user_info', {})
        
        # 2. Build Receipt Text
        receipt = "📦 **YANGI BUYURTMA**\n\n"
        total_sum = 0
        
        for p_id, count in cart.items():
            product = PRODUCTS.get(str(p_id))
            if product:
                item_sum = product['price'] * count
                total_sum += item_sum
                # Thousands separator for readability
                receipt += f"▫️ {product['name']}\n   {count} x {product['price']:,} = {item_sum:,} so'm\n"
        
        receipt += f"\n💰 **JAMI: {total_sum:,} so'm**\n"
        receipt += f"➖➖➖➖➖➖➖➖\n"
        receipt += f"👤 **Mijoz:** {user_info.get('name')}\n"
        receipt += f"📞 **Tel:** {user_info.get('phone')}\n"
        receipt += f"📍 **Manzil:** {user_info.get('address')}\n"

        # 3. Send Confirmation to User
        await message.answer(
            f"✅ Rahmat! Buyurtmangiz qabul qilindi.\n\n{receipt}\nTez orada operatorimiz bog'lanadi.",
            parse_mode="Markdown"
        )
        
        # 4. Send Notification to Admin
        if ADMIN_ID:
            try:
                await bot.send_message(
                    chat_id=ADMIN_ID,
                    text=f"🚨 **YANGI ADMIN XABARI** 🚨\n\nUsername: @{message.from_user.username}\n\n{receipt}",
                    parse_mode="Markdown"
                )
            except Exception as e:
                logging.error(f"Failed to send to admin: {e}")
            
    except Exception as e:
        logging.error(f"Error handling webapp data: {e}")
        await message.answer("❌ Xatolik yuz berdi. Iltimos qaytadan urining.")

# --- Web Server Handlers ---
async def index_handler(request):
    try:
        return web.FileResponse('./web-app/dist/index.html')
    except FileNotFoundError:
        return web.Response(text="Build not found. Run 'npm run build' in web-app directory.", status=404)

# --- Main App Setup ---
async def on_startup(app):
    # Start polling in background
    asyncio.create_task(dp.start_polling(bot))

def main():
    app = web.Application()
    
    # Serve the main index file for root and explicit index.html requests
    app.router.add_get('/', index_handler)
    app.router.add_get('/index.html', index_handler)
    
    # Serve static assets from the build output
    # The React build output structure is: dist/assets/index-....js
    # We verify the path exists to avoid errors on startup if not built yet
    dist_assets_path = './web-app/dist/assets'
    if os.path.exists(dist_assets_path):
        app.router.add_static('/assets', dist_assets_path)
    else:
        print(f"Warning: Assets path '{dist_assets_path}' not found. Did you run 'npm run build'?")

    # Start bot in background when app starts
    app.on_startup.append(on_startup)
    
    # Start the web server
    print(f"Starting server on port {PORT}...")
    print(f"WebApp URL: {WEBAPP_URL}")
    web.run_app(app, port=PORT)

if __name__ == '__main__':
    main()
