import functools 
import json

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from WasabiMain.db import (get_db, pumpUpdate)

bp = Blueprint('home', __name__, url_prefix='/')



@bp.route('/', methods = ('GET','POST'))
def homePage():
    db = get_db()
    if request.method == "GET":
        experiments = db.execute("SELECT title FROM experiments ").fetchall()
        pumps  = json.loads(db.execute('SELECT pumpData FROM pumpatlas').fetchone()[0])
        return render_template('home/mainHomePage.htm', experiments=experiments, pumps=pumps)
    else:
        pump = request.get_json()['pump']
        pumpValue = request.get_json()['pumpValue']
        pumpUpdate({'name': pump, 'contents': pumpValue})
        return "pumps updated"
        ##do pump stuff here because its the post request area 
