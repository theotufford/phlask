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

def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))
# this returns a dictionary of all the well plates with a subdictionary that contains all of the well xy coordinates eg wellpos()["(9,16)"][a7][x]
# this info is also stored in the database through the wellUpdate cli command, but its seperated here in case I want to call it directly, aslo its a little cleaner
def wellPos():
    alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','t','u','v','w','x','y','z'] # easier alphanumeric assignment lol
    plateMapCollection = {}

    with current_app.open_resource('./static/resources/config.json') as f:
        PlateInfo = json.loads(f.read())


# basically this just takes the plates by their dimensions, assigns that as the key, and then nests a subdictionary of all the well coordinates
# it then inserts that into the database with 
# probably one of my favorite things in this project because it absolutely brain melted me 
    for plate in PlateInfo["plates"]:
        plateMap = {}
        ypos = 0
        plateName = "(" + str(plate["dimension"]["rows"]) + "," + str(plate["dimension"]["columns"]) + ")" #make a string in the form of (rows,columns) to act as the key to each plate

        if plate["namingConvention"] == "AN": #alphanumeric naming convention for wells on the plate
            for row in range(0, plate["dimension"]["rows"]):
                xpos = 0
                prefix = alphabet[row]
                for well in range(1, plate["dimension"]["columns"]+1):
                    wellName = prefix + str(well)
                    newWell = {wellName:{"x":xpos,"y":ypos}}
                    plateMap.update(newWell)
                    xpos = xpos + plate["radius"]*2
                ypos = ypos + plate["radius"]*2 

        elif plate["namingConvention"] == "n": #numeric, left to right top to bottom naming of wells
            wellcounter = 1 
            for row in range(1, plate["dimension"]["rows"]+1): 
                xpos = 0
                for well in range(1, plate["dimension"]["columns"]+1):
                    wellName = wellcounter  
                    newWell = {wellName:{"x":xpos,"y":ypos}}
                    plateMap.update(newWell)
                    wellcounter = wellcounter + 1
                    xpos = xpos + plate["radius"]*2
                ypos = ypos + plate["radius"]*2 

        #add more cases here for each different naming convention, they arent all in one statement because of differences in the loops, just copy and paste lol

        plateMapCollection.update({plateName:plateMap})
        del(plateMap) # this is here to detach the pointer to the uniquePlatemap so it can be rebuilt for the next plate and if you try to use .clear() it will dissapear from the parent dict lmao

    return plateMapCollection 



@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

#broken :(
@click.command('plateUpdate')
def plateUpdate_command():
    db = get_db()
    db.execute("DELETE FROM plateatlas")
    db.execute(
        'INSERT INTO plateatlas (plateData) VALUES (?)',(json.dumps(wellPos()), )
    )
    db.commit()

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
    app.cli.add_command(plateUpdate_command)

