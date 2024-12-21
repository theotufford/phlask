import sqlite3
import json

import click
from flask import current_app, g


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


# this returns a dictionary of all the well plates with a subdictionary that contains all of the well xy coordinates eg wellpos()["(9,16)"][a7][x]
# this info is also stored in the database through the wellUpdate cli command, but its seperated here in case I want to call it directly, aslo its a little cleaner

def wellPos():
    alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','t','u','v','w','x','y','z'] # easier alphanumeric assignment lol
    plateMapCollection = {}

    with current_app.open_resource('./static/resources/config.json') as f:
        PlateInfo = json.loads(f.read())["machineInfo"]["plates"]


# basically this just takes the plates by their dimensions, assigns that as the key, and then nests a subdictionary of all the well coordinates
# it then inserts that into the database with 
# probably one of my favorite things in this project because it absolutely brain melted me 
    for plate in PlateInfo:
        plateMap = {}
        ypos = 0
        plateName = "(" + str(plate["dimension"]["rows"]) + "," + str(plate["dimension"]["columns"]) + ")" #make a string in the form of (rows,columns) to act as the key to each plate
        for row in range(0, plate["dimension"]["rows"]):
            xpos = 0
            prefix = alphabet[row]
            for well in range(1, plate["dimension"]["columns"]+1):
                wellName = prefix + str(well)
                newWell = {wellName:{"x":xpos,"y":ypos}}
                plateMap.update(newWell)
                xpos = xpos + plate["spacing"]*2
            ypos = ypos + plate["spacing"]*2 
        plateMapCollection.update({plateName:plateMap})
        del(plateMap) # this is here to detach the pointer to the uniquePlatemap so it can be rebuilt for the next plate and if you try to use .clear() it will dissapear from the parent dict lmao

    return plateMapCollection 

def plateUpdate():
    db = get_db()
    db.execute("DELETE FROM plateatlas")
    db.execute(
        'INSERT INTO plateatlas (plateData) VALUES (?)',(json.dumps(wellPos()), )
    )
    db.commit()

def pumpUpdate(updatedict):
    pumpData = {}
    db = get_db()
    with current_app.open_resource('./static/resources/config.json') as f:
        try:
            pumpData = json.loads(db.execute('SELECT pumpData FROM pumpatlas').fetchone()[0])
        except Exception as e:
            print(e)
    pumpData[updatedict['name']] = updatedict['contents']
    print(json.dumps(pumpData))
    db.execute("DELETE FROM pumpatlas")
    db.execute(
        'INSERT INTO pumpatlas (pumpData) VALUES (?)',(json.dumps(pumpData), )
    )
    db.commit()


def init_db():
    db = get_db()
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))
    with current_app.open_resource('./static/resources/config.json') as j:
        count = json.loads(j.read())["machineInfo"]["pumpCount"] 
        for id in range(1, count+1):
            name = "pump" + str(id)
            pumpUpdate({"name": name, "contents": "empty"})
    plateUpdate()


@click.command('init-db')
def init_db_command():
    click.echo(
    """ \n WARNING: this will clear delete all of the data stored in the database and create new tables. 
       it should only be done if you are just building the application for the first time 
    \n if you are just updating the machine config you can use the \"configUpdate\" command 
    or if you just want to update the pumps or plate specifically from the config file you can use \"plateUpdate\" and \"pumpUpdate\" 
    \n """)
    choice = input("do you want to proceed? y/n")
    if choice == "y":
        init_db()
        click.echo('tables cleared and database initialized.')
    else:
        click.echo("aborted")


@click.command('plateUpdate')
def plateUpdate_command():
    """ clearing and refreshing the plate atlas """
    plateUpdate()
    click.echo('refreshed plate atlas')

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(plateUpdate_command)

