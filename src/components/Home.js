import React, { useState, useEffect } from 'react'

export default function Home({ URL }) {
    // Luodaan muutujat
    const [games, setGames] = useState([]);
    const [newGameName, setNewGameName] = useState('');
    const [newGM, setNewGM] = useState('');
    const [gameEdited, setGameEdited] = useState(null);
    const [gameNameUptd, setGameNameUptd] = useState('');
    const [gmUpdated, setGmUpdated] = useState('');
    const [characters, setCharacters] = useState([]);
    const [newCharName, setNewCharName] = useState('');
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newGameNbr, setNewGameNbr] = useState(null);
    const [charEdited, setCharEdited] = useState(null);
    const [charUpdated, setCharUpdated] = useState('');
    const [playerUpdated, setPlayerUpdated] = useState('');
    const [charstatus, setCharstatus] = useState([]);
    const [addStatus, setAddStatus] = useState(null);
    const [statusName, setStatusName] = useState('');
    const [createDate, setCreateDate] = useState('');
    const [newstatus, setNewStatus] = useState('');
    const [editStatus, setEditStatus] = useState(null);
    const [editedDate, setEditedDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');

    // Haetaan peli-taulusta kierrossa olevat pelit
    useEffect(() => {
        let status = 0;
        fetch(URL + 'index.php')
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        setGames(res)
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
    }, [newGameName, newGM])

    // Tallennetaan uusi peli
    function saveNewGame(e) {
        if (newGameName === '' || newGM === '') {
            alert('Syötä uuden pelin nimi ja pelinjohtaja');
            return;
        }
        e.preventDefault();
        let status = 0;
        fetch(URL + 'new_game.php', {
            method: 'POST',
            headers: {
                'Accept': 'application.json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                pelin_nimi: newGameName,
                pelinjohtaja: newGM
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        setGames(newGame => [...newGame, res]);
                        setNewGameName('');
                        setNewGM('');
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error)
                }
            )

    }

    // poistetaan peli taulusta peli
    function deleteGame(id) {
        let status = 0;
        fetch(URL + 'delete_game.php', {
            method: 'POST',
            headers: {
                'Accept': 'application.json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                pelinro: id
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        const gamesWithoutRemoved = games.filter((game) => game.pelinro !== id);
                        setGames(gamesWithoutRemoved);
                    } else {
                        alert(res.error)
                    }
                }, (error) => {
                    alert(error)
                }
            )
    }

    // Tuodaan sivulla näkyville pelin tietojen muokkausinputit ja asetetaan muutujille oletusarvot
    function editGame(game) {
        setGameEdited(game);
        setGameNameUptd(game.pelin_nimi);
        setGmUpdated(game.pelinjohtaja);
    }
    // Päivitetään pelin tiedot ja piilotetaan muokkausikkuna
    function updateGame(pelinro) {
        let status = 0;
        fetch(URL + 'update_game.php', {
            method: 'POST',
            headers: {
                'Accept': 'application.json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                pelin_nimi: gameNameUptd,
                pelinjohtaja: gmUpdated,
                pelinro: pelinro,
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        games[(games.findIndex(game => game.pelinro === pelinro))].pelin_nimi = gameNameUptd;
                        games[(games.findIndex(game => game.pelinro === pelinro))].pelinjohtaja = gmUpdated;
                        setGameEdited(null);
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
    }

    // tuodaan rietokannasta tiettyyn peliin tehdyt hahmot
    function Characters(pelinro) {
        setCharstatus([]);
        let status = 0;
        fetch(URL + 'characters.php?pelinro=' + pelinro)
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        setCharacters(res)
                        /* setTrnro(id) */
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error)
                }
            )
    }

    // lisätään uusi hahmo tiettyyn peliin
    function saveNewCharacter(e) {
        e.preventDefault();

        if (newCharName === '' || newPlayerName === '') {
            alert('Lisää hahmon ja pelaajan nimet!');
            return;
        } else if (newGameNbr === null) {
            alert('Valitse peli!');
            return;
        }

        let status = 0;

        fetch(URL + 'new_character.php', {
            method: 'POST',
            headers: {
                'Accept': 'application.json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                pelinro: newGameNbr,
                pelaaja_nimi: newPlayerName,
                hahmon_nimi: newCharName,
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        setCharacters(newCharacter => [...newCharacter, res]);
                        setNewPlayerName('');
                        setNewCharName('');
                        Characters(newGameNbr);
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
    }
    // Poistetaan hahmo
    function deleteCharacter(hahmonro) {
        let status = 0;
        fetch(URL + 'delete_character.php', {
            method: 'POST',
            headers: {
                'Accept': 'application.json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                hahmonro: hahmonro
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        const charWithoutRemoved = characters.filter((char) => char.hahmonro !== hahmonro);
                        setCharacters(charWithoutRemoved);
                    } else {
                        alert(res.error)
                    }
                }, (error) => {
                    alert(error)
                }
            )
    }
    // TUodaan esille hahmonmuokkauksen inputit ja asetetaan oletusarvot
    function editCharacter(game) {
        setCharEdited(game);
        setCharUpdated(game.hahmon_nimi);
        setPlayerUpdated(game.pelaaja_nimi);
    }
    // Päivitetään hahmon tiedot ja suljetaan muokkausikkuna 
    function updateCharacter(hahmonro) {
        let status = 0;
        fetch(URL + 'update_character.php', {
            method: 'POST',
            headers: {
                'Accept': 'application.json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                hahmon_nimi: charUpdated,
                pelaaja_nimi: playerUpdated,
                hahmonro: hahmonro,
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        characters[(characters.findIndex(char => char.hahmonro === hahmonro))].hahmon_nimi = charUpdated;
                        characters[(characters.findIndex(char => char.hahmonro === hahmonro))].pelaaja_nimi = playerUpdated;
                        setCharEdited(null);
                        Status(hahmonro);
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
    }
    // Haetaan hahmoon liittyvä satus esille
    function Status(hahmonro) {
        let status = 0;
        fetch(URL + 'status.php?hahmonro=' + hahmonro)
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        setCharstatus(res)

                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error)
                }
            )
    }

    // Avataan statuksen lisäyksen inputit
    function AddStatus(character) {
            setStatusName(character.hahmon_nimi);
            setCharstatus([]);
            setAddStatus(character);
     }

     // Tallennetaan uusi, lisätty status
     function saveStatus (hahmonro) {
        if (createDate === '' || newstatus === '') {
            alert('Lisää päivänmäärä ja status!');
            return;
        }
        let status = 0;
        fetch(URL + 'new_status.php', {
            method: 'POST',
            headers: {
                'Accept': 'application.json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                luontipvm: createDate,
                hahmonro: hahmonro,
                tila: newstatus,
                hahmon_nimi: statusName 
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        setCharstatus(newCharstatus=> [...newCharstatus, res]);
                        setCreateDate('');
                        setNewStatus('');
                        setStatusName('');
                        setAddStatus(null);
                        } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
     }
    
     // Poistetaan hahmon statu
     function deleteStatus(hahmonro) {
        let status = 0;
        fetch(URL + 'delete_status.php', {
            method: 'POST',
            headers: {
                'Accept': 'application.json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                hahmonro: hahmonro
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        const statusWithoutRemoved = charstatus.filter((status) => status.hahmonro !== hahmonro);
                        setCharstatus(statusWithoutRemoved);
                    } else {
                        alert(res.error)
                    }
                }, (error) => {
                    alert(error)
                }
            )
    }

    // avataan editointi_ikkuna statuyksen muokkaamiselle sekä asetetaan oletusarvot
    function EditStat(charstatus) {
        setEditStatus(charstatus);
        setEditedDate(charstatus.luontipvm);
        setUpdateStatus(charstatus.tila);
        setEndDate(charstatus.kuolinpvm);
        
    }
    // Tallennetaan muokattu status
    function SaveStatusUpdate(hahmonro) {
        if (updateStatus === 'Kuollut' && endDate === null){
            alert('Valitse hahmon kuolinpäivä.')
            return;
        }
        
        
        let status = 0;
        fetch(URL + 'update_status.php', {
            method: 'POST',
            headers: {
                'Accept': 'application.json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                luontipvm: editedDate, 
                kuolinpvm:endDate,
                hahmonro: hahmonro,
                tila:updateStatus
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        charstatus[(charstatus.findIndex(status => status.hahmonro === hahmonro))].luontipvm = editedDate;
                        charstatus[(charstatus.findIndex(status => status.hahmonro === hahmonro))].kuolinpvm = endDate;
                        charstatus[(charstatus.findIndex(status => status.hahmonro === hahmonro))].tila = updateStatus;
                        setEditStatus(null);
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
    }
    console.log(endDate);

    return (
        <div className="row">
            <h1>Pelauksessa olevat roolipelit:</h1>
            <div className="col-xl-3">
                <div className="col-auto mt-2">
                    <h5 className="mt-2">Lisää uusi peli:</h5>
                    <input id="uusiNimi" type="text" maxLength='30' className="form-control m-2" aria-describedby="uusiNimi" placeholder="Syötä uuden pelin nimi" value={newGameName} onChange={e => setNewGameName(e.target.value)} />
                    <input id="uusiPJ" type="text" maxLength='30' className="form-control m-2" aria-describedby="UusiPJ" placeholder="Syötä uuden pelin pelinjohtaja" value={newGM} onChange={e => setNewGM(e.target.value)} />
                    <span className="p-2"><button onClick={saveNewGame} className="btn btn-primary mt-2">Tallenna</button></span>
                </div>
                <div className="col-auto mt-2">

                    <table className="table">
                        <thead>
                            <th scope="col">Pelin nimi</th>
                            <th scope="col">Pelinjohtaja</th>
                        </thead>
                        <tbody>
                            {games.map(game => (
                                <tr>
                                    <td>{game.pelin_nimi}</td>
                                    <td>{game.pelinjohtaja}</td>
                                    <td><button onClick={() => editGame(game)} className="btn btn-primary">Muokkaa</button></td>
                                    <td><button onClick={() => deleteGame(game.pelinro)} className="btn btn-primary">Poista</button></td>
                                    <td><button onClick={() => Characters(game.pelinro)} className="btn btn-primary">Hahmot</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {gameEdited != null ? (
                    <>
                        <h5>Muokkaa Peliä:</h5>
                        <input type="text" className="form-control m-2" aria-describedby="pelinimi" value={gameNameUptd} onChange={e => setGameNameUptd(e.target.value)} />
                        <input type="text" className="form-control m-2" aria-describedby="gmnimi" value={gmUpdated} onChange={e => setGmUpdated(e.target.value)} />
                        <span className="p-2"><button onClick={() => updateGame(gameEdited.pelinro)} className="btn btn-primary">Tallenna</button></span>
                        <button onClick={() => setGameEdited(null)} className="btn btn-primary">Sulje muokkaamatta</button>
                    </>
                ) : (
                    <></>
                )
                }
            </div>


            <div className="col-xl-4 mt-2">
                <h5>Lisää uusi hahmo: </h5>
                <form action="submit" onSubmit={saveNewCharacter}>
                    <input placeholder="Syötä uuden hahmon nimi" className="form-control mt-2" id="hahmonimi" type="text" value={newCharName} onChange={e => setNewCharName(e.target.value)} />
                    <input placeholder="Syötä pelaajan nimi" className="form-control mt-2" id="pelaajanimi" type="text" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)}/>
                    <div className="input-group">
                        <select className="form-control mt-2" id="inputGroupSelect01" onChange={e => setNewGameNbr(e.target.value)}>
                            <label htmlFor="peli">Peli: </label>
                            <option selected>Valitse Peli</option>
                            {games.map(game => (
                                <option value={game.pelinro}>{game.pelin_nimi}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-primary m-2">Lisää</button>
                </form>
                <table className="table">
                    <thead>
                        <th scope="col">Hahmon nimi</th>
                        <th scope="col">Pelaajan nimi</th>
                    </thead>
                    <tbody>
                        {characters.map(character => (
                            <tr>
                                <td>{character.hahmon_nimi}</td>
                                <td>{character.pelaaja_nimi}</td>
                                <td><button onClick={() => editCharacter(character)} className="btn btn-primary">Muokkaa</button></td>
                                <td><button onClick={() => deleteCharacter(character.hahmonro)} className="btn btn-primary">Poista</button></td>
                                <td><button onClick={() => AddStatus(character)} className="btn btn-primary">Lisää status</button></td>
                                <td><button onClick={() => Status(character.hahmonro)} className="btn btn-primary">Näytä status</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {charEdited != null ? (
                    <>  
                        <h5>Muokkaa Hahmoa:</h5>
                        <input type="text" className="form-control m-2" aria-describedby="uushahmonimi" value={charUpdated} onChange={e => setCharUpdated(e.target.value)} />
                        <input type="text" className="form-control m-2" aria-describedby="uuspelajanimi" value={playerUpdated} onChange={e => setPlayerUpdated(e.target.value)} />
                        <span className="p-2"><button onClick={() => updateCharacter(charEdited.hahmonro)} className="btn btn-primary">Tallenna</button></span>
                        <button onClick={() => setCharEdited(null)} className="btn btn-primary">Sulje muokkaamatta</button>
                    </>
                ) : (
                    <></>
                )
                }

                {addStatus != null ? (
                    <>  
                        <h5>Lisää uuden hahmon status:</h5>
                        <input type="date" className="form-control m-2" aria-describedby="muokattupvm" value={createDate} onChange={e => setCreateDate(e.target.value)} />
                        <input type="text" className="form-control m-2" aria-describedby="statusnimi" value={statusName} hidden/>
                        <div className="input-group">
                        <select className="form-control m-2" id="inputGroupSelect03" onChange={e => setNewStatus(e.target.value)}>
                            <option selected>Vaihda hahmon status</option>
                            <option value="Elossa" >Elossa</option>
                        </select>
                    </div>
                        <span className="p-2"><button onClick={() => saveStatus(addStatus.hahmonro)} className="btn btn-primary">Tallenna</button></span>
                        <button onClick={() => setAddStatus(null)} className="btn btn-primary">Peruuta</button>
                    </>
                ) : (
                    <></>
                )
                }

            </div>
            <div className="col-xl-4 mt-2">
                <div className="col-auto mt-2">
                    <table className="table">
                        <thead>
                            <th scope="col">Hahmon nimi:</th>
                            <th scope="col">Luontipäivä:</th>
                            <th scope="col">Tila</th>
                            <th scope="col">Kuolinpäivä</th>
                        </thead>
                        <tbody>
                            {charstatus.map(charstatus => (
                                <tr>
                                    <td>{charstatus.hahmon_nimi}</td>
                                    <td>{charstatus.luontipvm}</td>
                                    <td>{charstatus.tila}</td>
                                    <td>{charstatus.kuolinpvm}</td>
                                    <td><button onClick={() => deleteStatus(charstatus.hahmonro)} className="btn btn-primary">Poista</button></td>
                                    <td><button onClick={() => EditStat(charstatus)} className="btn btn-primary">Muokkaa</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {editStatus != null ? (
                    <>  
                        <h5>Muokkaa hahmon statusta:</h5>
                        <input type="date" className="form-control m-2" aria-describedby="uusipvm" value={editedDate} onChange={e => setEditedDate(e.target.value)} />
                        <input type="date" className="form-control m-2" aria-describedby="kuolinpvm" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        <div className="input-group">
                        <select className="form-control m-2" id="inputGroupSelect03" onChange={e => setUpdateStatus(e.target.value)}>
                            <option value="Elossa" selected>Valitse hahmon status</option>
                            <option value="Kuollut" >Kuollut</option>
                        </select>
                    </div>
                        <span className="p-2"><button onClick={() => SaveStatusUpdate(editStatus.hahmonro)} className="btn btn-primary">Tallenna</button></span>
                        <button onClick={() => setEditStatus(null)} className="btn btn-primary">Sulje muokkaamatta</button>
                    </>
                ) : (
                    <></>
                )
                }
            </div>
        </div>

    )
}
