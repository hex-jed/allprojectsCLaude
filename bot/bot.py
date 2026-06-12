import os
import json
import logging
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

logging.basicConfig(level=logging.INFO)

BOT_TOKEN  = os.environ["BOT_TOKEN"]
WEB_APP_URL = os.environ["WEB_APP_URL"]   # https://ваш-сайт.ru/tarot-oracle-sbp.html

GREETED_FILE = "greeted_users.json"


def load_greeted() -> set[int]:
    if os.path.exists(GREETED_FILE):
        with open(GREETED_FILE) as f:
            return set(json.load(f))
    return set()


def save_greeted(users: set[int]) -> None:
    with open(GREETED_FILE, "w") as f:
        json.dump(list(users), f)


greeted_users = load_greeted()


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    is_new = user_id not in greeted_users

    if is_new:
        greeted_users.add(user_id)
        save_greeted(greeted_users)

        keyboard = [[InlineKeyboardButton(
            "🔮 Открыть Оракул Таро",
            web_app=WebAppInfo(url=WEB_APP_URL)
        )]]
        await update.message.reply_text(
            "Добро пожаловать ✨\nНажмите кнопку — и карты откроются:",
            reply_markup=InlineKeyboardMarkup(keyboard),
        )
    else:
        await update.message.reply_text(
            "С возвращением 🌙  Используйте кнопку меню внизу, чтобы открыть Оракул."
        )


if __name__ == "__main__":
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    print("Бот запущен…")
    app.run_polling()
