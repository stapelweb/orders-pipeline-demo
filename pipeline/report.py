# -*- coding: utf-8 -*-
"""Экран по собранным данным: один самодостаточный HTML-файл.

Почему один файл без сервера и без сборки: такой экран открывается с телефона
по ссылке, переживает переезд хостинга и не требует от заказчика ничего, кроме
браузера. Светлая и тёмная тема — системные, без переключателя.

    python -m pipeline report
"""

from __future__ import annotations

import html
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

КОРЕНЬ = Path(__file__).resolve().parent.parent
БАЗА = КОРЕНЬ / "data" / "orders.db"
ВЫХОД = КОРЕНЬ / "data" / "dashboard.html"

ШАБЛОН = """<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Заявки</title>
<style>
  :root {{
    --фон: #f6f7f9; --карточка: #ffffff; --текст: #15181d; --тихий: #5b6472;
    --рамка: #e3e6ea; --акцент: #2f6df6;
  }}
  @media (prefers-color-scheme: dark) {{
    :root:not([data-theme="light"]) {{
      --фон: #11141a; --карточка: #181c24; --текст: #e8eaee; --тихий: #98a1b0;
      --рамка: #262c36; --акцент: #6b9bff;
    }}
  }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; padding: 24px 16px 48px; background: var(--фон); color: var(--текст);
         font: 15px/1.5 -apple-system, "Segoe UI", Roboto, sans-serif; }}
  .обёртка {{ max-width: 880px; margin: 0 auto; }}
  h1 {{ font-size: 22px; margin: 0 0 4px; }}
  .подпись {{ color: var(--тихий); font-size: 13px; margin-bottom: 24px; }}
  .плитки {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
             gap: 12px; margin-bottom: 24px; }}
  .плитка {{ background: var(--карточка); border: 1px solid var(--рамка);
             border-radius: 12px; padding: 14px 16px; }}
  .плитка .имя {{ color: var(--тихий); font-size: 12px; text-transform: uppercase;
                  letter-spacing: .04em; }}
  .плитка .значение {{ font-size: 24px; font-weight: 600; margin-top: 6px;
                       font-variant-numeric: tabular-nums; }}
  table {{ width: 100%; border-collapse: collapse; background: var(--карточка);
           border: 1px solid var(--рамка); border-radius: 12px; overflow: hidden; }}
  th, td {{ padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--рамка); }}
  th {{ font-size: 12px; text-transform: uppercase; letter-spacing: .04em;
        color: var(--тихий); font-weight: 600; }}
  tr:last-child td {{ border-bottom: 0; }}
  td.сумма {{ text-align: right; font-variant-numeric: tabular-nums; }}
  .пусто {{ color: var(--тихий); padding: 24px; text-align: center; }}
  @media (max-width: 560px) {{ th.скрыть, td.скрыть {{ display: none; }} }}
</style></head><body><div class="обёртка">
<h1>Заявки</h1>
<div class="подпись">Собрано {снято}. Источник — журнал сборщика, экран пересобирается одной командой.</div>
<div class="плитки">{плитки}</div>
{таблица}
</div></body></html>
"""


def плитка(имя: str, значение: str) -> str:
    return f'<div class="плитка"><div class="имя">{имя}</div><div class="значение">{значение}</div></div>'


def деньги(n: int) -> str:
    return f"{n:,}".replace(",", " ") + " ₽"


def собрать(путь: Path = БАЗА, выход: Path = ВЫХОД) -> Path:
    соединение = sqlite3.connect(путь)
    соединение.row_factory = sqlite3.Row
    try:
        строки = [dict(r) for r in соединение.execute(
            "SELECT * FROM orders ORDER BY сумма DESC, создана DESC"
        )]
    finally:
        соединение.close()

    всего = len(строки)
    сумма = sum(с["сумма"] for с in строки)
    средняя = сумма // всего if всего else 0
    источников = len({с["источник"] for с in строки})

    плитки = "".join([
        плитка("Заявок", str(всего)),
        плитка("Сумма", деньги(сумма)),
        плитка("Средняя", деньги(средняя)),
        плитка("Источников", str(источников)),
    ])

    if строки:
        тело = "".join(
            "<tr>"
            f"<td>{html.escape(с['имя']) or '—'}</td>"
            f"<td>{html.escape(с['телефон'])}</td>"
            f"<td class='сумма'>{деньги(с['сумма'])}</td>"
            f"<td class='скрыть'>{html.escape(с['создана'][:10])}</td>"
            f"<td class='скрыть'>{html.escape(с['источник'])}</td>"
            "</tr>"
            for с in строки
        )
        таблица = (
            "<table><thead><tr><th>Имя</th><th>Телефон</th>"
            "<th class='сумма'>Сумма</th><th class='скрыть'>Создана</th>"
            "<th class='скрыть'>Источник</th></tr></thead>"
            f"<tbody>{тело}</tbody></table>"
        )
    else:
        таблица = '<div class="пусто">Пока ни одной заявки. Запустите сбор.</div>'

    выход.parent.mkdir(parents=True, exist_ok=True)
    выход.write_text(
        ШАБЛОН.format(
            снято=datetime.now(timezone.utc).strftime("%d.%m.%Y %H:%M UTC"),
            плитки=плитки,
            таблица=таблица,
        ),
        encoding="utf-8",
    )
    return выход
