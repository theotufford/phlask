import functools
from datetime import date
import json
from flask import (
    Blueprint, flash, g, redirect, current_app, render_template, request, session, url_for
)

from WasabiMain.db import (get_db,wellPos)


bp = Blueprint('programmer', __name__, url_prefix='/program')

@bp.route('/', methods=("GET","POST"))

def programmer():
    db = get_db()
    if  request.method == "POST":
        experimentTitle = request.form['title']
        error = None
        if not experimentTitle:
            experimentTitle =  date.today()
        if error is None:
            db.execute(
                "INSERT INTO experiments (title) VALUES (?)",(experimentTitle, )
            ).fetchall()
            db.commit()
            return redirect(url_for("home.homePage")) 
        flash(error)
    with current_app.open_resource('./static/resources/config.json') as f:
        jsonstring = json.loads(f.read())
        PlateInfo = jsonstring["plates"] 
    DBplates = json.loads(db.execute('SELECT plateData FROM plateatlas').fetchone()[0])
    return render_template("programmer/programmer.htm", plates=PlateInfo, DBplates = DBplates) 

@bp.route('/test', methods=("GET","POST"))
def test():
    return render_template("programmer/test.htm")
