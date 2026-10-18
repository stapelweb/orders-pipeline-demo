# -*- coding: utf-8 -*-
"""Точка входа: python -m pipeline collect | report | all"""

from __future__ import annotations

import argparse
import logging
import sys

from . import collect, report


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="pipeline", description="Сбор заявок и экран по ним")
    p.add_argument("команда", choices=["collect", "report", "all"])
    p.add_argument("--url", default=None, help="адрес источника; без него берётся вложенная фикстура")
    p.add_argument("--тихо", action="store_true", help="только ошибки")
    а = p.parse_args(argv)

    logging.basicConfig(
        level=logging.ERROR if а.тихо else logging.INFO,
        format="%(levelname)s  %(message)s",
    )

    if а.команда in ("collect", "all"):
        счёт = collect.прогон(а.url)
        print("Сбор:", ", ".join(f"{к} {в}" for к, в in счёт.items()))

    if а.команда in ("report", "all"):
        файл = report.собрать()
        print("Экран:", файл)

    return 0


if __name__ == "__main__":
    sys.exit(main())
