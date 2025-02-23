from aiogram.types import ReplyKeyboardMarkup, WebAppInfo, KeyboardButton

web_button = (
    KeyboardButton(
        text="Открыть Web App",
        web_app=WebAppInfo(
        url=
        "https://f310-2a00-20-4-8e9b-94f9-7fdb-4c12-bf66.ngrok-free.app")
    )
)


wa_kb = ReplyKeyboardMarkup(resize_keyboard=True, keyboard=[[web_button]])