import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from phlaskMain.db import get_db

bp = Blueprint('home', __name__, url_prefix='/')



@bp.route('/')
def homePage():
    db = get_db()
    plates = db.execute("SELECT plateName FROM plates ").fetchall()
    experiments = db.execute("SELECT title FROM experiments ").fetchall()
    return render_template('home/mainHomePage.htm', plates=plates, experiments=experiments,)
