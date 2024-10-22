import functools
from datetime import date
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from phlaskMain.db import get_db


bp = Blueprint('programmer', __name__, url_prefix='/program')
@bp.route('/submitprogram', methods=("GET","POST"))
def submitprogram():
    if  request.method == "POST":
        experimentTitle = request.form['title']
        db = get_db
        error = None
        if not experimentTitle:
            experimentTitle =  date.today()
        if error is None:
            db.execute(
                "INSERT INTO title (experimentTitle) (?)",(experimentTitle),
            ).fetchall()
            db.commit()
            return redirect(url_for("home")) 
        flash(error)
    return render_template("programmer/programmer.htm")
