import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from phlaskMain.db import get_db

bp = Blueprint('home', __name__, url_prefix='/home')
@bp.route('/experimentQuery')
def returnexperiments():
    experiment = db.session.execute("SELECT title FROM experiment ").fetchall()
    return render_template('home/machinecontroller.htm', experiment = experiment)

@bp.route('/machineControl', methods=('GET','POST'))

def returnhomePage():
    return render_template('home/machinecontroller.htm')
